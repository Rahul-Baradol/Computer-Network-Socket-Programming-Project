import React, { useState } from 'react';
import './App.css'



function Create() {
  const [isJoinClicked, setIsJoinClicked] = useState(false);

  const handleJoinClick =  () => {
    setIsJoinClicked(true);
  };

  return (
    <div className="text-center">
      <Name/>
      {!isJoinClicked ? (
        <button className="join-button" onClick={handleJoinClick}>Join Room</button>
      ) : (
        <TicTacToe />
      )}<br/><br/>
    
        <button className="join-button" onClick={handleJoinClick}>Create Room</button>
     
        
    
    </div>
  );
}
function Name() {
  return (
    <div class="welcome">
     
      <h2>Tic Toc Toe Game</h2>
      {/* Tic Tac Toe game component goes here */}
    </div>
  );
}





function TicTacToe() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  const handleLogin = (name, password) => {
    // Perform authentication here. For simplicity, just check if name and password are not empty.
    if (name && password) {
      if(password=="1234")
      {
      setIsLoggedIn(true);
      setUsername(name);
      }
      else
      {
        alert("incorrect password")
      }
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="App">
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        <div>
          <h2>Player-Name, {username}!</h2>
          <Game />
        </div>
      )}
    </div>
  );
}

function Login({ onLogin }) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(name, password);
  };

  return (
    <div>
      
      <form onSubmit={handleSubmit}>
        <h3>Enter Username</h3><input
          type="text"
          placeholder="Username"
          value={name}
          onChange={(e) => setName(e.target.value)}
        /><br/><br/>
        <h3>Enter Room-id</h3> <input
          type="password"
          placeholder="Room-id"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /><br/><br/>
        <button type="submit" class="Login-button">Login</button>
      </form>
    </div>
  );
}



function Game({ username }) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const handleClick = (i) => {
    const newBoard = [...board];
    if (calculateWinner(newBoard) || newBoard[i]) {
      return;
    }
    newBoard[i] = xIsNext ? 'X' : 'O';
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  };

  const renderSquare = (i) => {
    return (
      <button className="square" onClick={() => handleClick(i)}>
        {board[i]}
      </button>
    );
  };

  const winner = calculateWinner(board);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <div>
      <h2>Welcome, {username}!</h2>
      <div className="status">{status}</div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  );
}

function calculateWinner(board) {
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
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}


export default Create;
