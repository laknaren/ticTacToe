import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Square extends React.PureComponent {

  clickHandler = () => {
    this.props.clickHandler();
  }

  render() {
    return (
      <button className="square" onClick={this.clickHandler}>
        {this.props.player}
      </button>
    );
  }
}

class Board extends React.PureComponent {


  renderSquare(i) {
    return <Square clickHandler={() => this.props.onSquareClick(i)} player={this.props.squares[i]} />;
  }


  render() {
    const boardElement = () => {
      let boardRows = [];
      let size = 3;

      for (let i = 0; i < size; i++) {
        let boardElements = [];
        for (let j = 0; j < size; j++) {
          boardElements.push(this.renderSquare((i * size) + j));
        }
        boardRows.push(<div className="board-row">{boardElements}</div>);
      }
      return boardRows;
    };

    return (
      <div className="board">{ boardElement() }</div>
    );
  }
}

class Game extends React.Component {

  state = {
    history: [{
      squares: Array(9).fill(null)
    }],
    player: "X",
    currentState: 0
  }

  onSquareClick = (index) => {
    let history = this.state.history.slice(0, this.state.currentState + 1);
    let squares = history[this.state.currentState].squares.slice();
    let player = (this.state.currentState) % 2 ? "O" : "X";

    if (squares[index] || this.calculateWinner(squares)) {
      return;
    } else {
      squares[index] = player;
      history[this.state.currentState + 1] = { squares: squares };
      this.setState({ player: player, history: history, currentState: history.length - 1 });
    }
  }

  calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }


  showHistory = (index) => {
    let player = (this.state.currentState) % 2 ? "O" : "X";
    this.setState(Object.assign({}, this.state, { player: player, currentState: index }));
  }

  render() {

    let status = null;
    let winner = this.calculateWinner(this.state.history[this.state.currentState].squares);

    if (winner) {
      status = "Winner : " + winner;
    } else {
      status = "Player :" + this.state.player;
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board  onSquareClick={this.onSquareClick} squares={this.state.history[this.state.currentState].squares} />
        </div>
        <div className="game-info">
          <div className="status">{status}</div>

          <div>History</div>
          <ol>
            <li> {this.state.history.map((history, index) => {
              if (index === 0) {
                return <a key={index} onClick={() => this.showHistory(index)}> Game Start</a>;
              } else {
                return <a key={index} onClick={() => this.showHistory(index)}> Move {index}</a>;
              }
            })}
            </li>
          </ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
