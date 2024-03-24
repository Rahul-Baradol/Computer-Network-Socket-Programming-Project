const express = require('express');
const expressWs = require('express-ws');
const ws = require('ws');
const cors = require('cors');

const app = express();

const expressWsInstance = expressWs(app);
const wss = new ws.Server({ server: expressWsInstance.app });

// enable cors for all requests
app.use(cors());

// array to store the roomIds
let rooms = []

// maps to store the room details
let roomGrid = new Map();
let roomId_Names = new Map();
let roomId_WS = new Map();
let roomId_Turn = new Map();

// function to determine if the player is X or O
// returns 1 for X and 0 for O
function XorO() {
   const randomNumber = Math.random();
   return randomNumber < 0.5 ? 1 : 0;
}

// function to determine the winner of the game of tic tac toe
function determineWinner(grid) {
   // check the diagonals
   if (grid[0][0] !== null && grid[0][0] === grid[1][1] && grid[1][1] === grid[2][2]) {
      return grid[0][0];
   }
   
   // check the diagonals
   if (grid[0][2] !== null && grid[0][2] === grid[1][1] && grid[1][1] === grid[2][0]) {
      return grid[0][2];
   }

   let nullExists = false;
   for (let i = 0; i <= 2; i++) {
      // check the rows and columns
      if (grid[i][0] !== null && grid[i][0] === grid[i][1] && grid[i][1] === grid[i][2]) {
         return grid[i][0];
      }

      if (grid[0][i] !== null && grid[0][i] === grid[1][i] && grid[1][i] === grid[2][i]) {
         return grid[0][i];
      }

      if (grid[i][0] === null || grid[i][1] === null || grid[i][2] === null) {
         nullExists = true;
      }
   }

   if (!nullExists) {
      return "=";
   }

   return "?";
}

// kicks the clients out of the room if one of the players is disconnected
function checkClientStatus(roomId) {
   let clients = roomId_WS.get(roomId);
   if (!clients) return;
   
   for (let client of clients) {
      if (client.readyState === ws.CLOSED) {
         exitRoom(roomId);
      }
   }
}

// when a client sends a join room message
function join(ws, playerName, roomId) {
   // if the roomId does not exist, send the message to the client that you cannot join the room
   if (!rooms.includes(roomId)) {
      ws.send(JSON.stringify({
         type: "join",
         status: "notexist"
      }));
      return;
   }

   let arr = roomId_Names.get(roomId);

   // more than 2 players cannot join the same room
   // so send the message to the client that the room is full
   if (arr.length >= 2) {
      ws.send(JSON.stringify({
         type: "join",
         status: "full"
      }));
      return;
   }

   const xo = XorO();

   arr.push(playerName);

   roomId_Names.set(roomId, arr);
   roomId_Turn.set(roomId, "X");

   let tmparr = roomId_WS.get(roomId);

   // send the details of the current player to the other player
   tmparr[0].send(JSON.stringify({
      type: "otherplayer",
      playerName: playerName,
      whoyouare: xo ? "X" : "O"
   }))

   tmparr.push(ws);
   roomId_WS.set(roomId, tmparr);

   // send the added message to the current player
   ws.send(JSON.stringify({
      type: "join",
      status: "added",
      otherPlayerName: arr[0],
      whoyouare: xo ? "O" : "X",
      roomId: roomId
   }));
}

// when a client sends a create room message
function create(ws, playerName) {
   // function to generate a random 5 digit number
   function random5Digit() {
      return Math.floor(Math.random() * 100000).toString().padStart(5, '0');
   }

   // generate a random 5 digit number which is not already in the rooms array
   let roomId;
   do {
      roomId = random5Digit();
   } while (rooms.includes(roomId));

   rooms.push(roomId);
   roomGrid[roomId] = [[null, null, null], [null, null, null], [null, null, null]]

   let arr = [];
   arr.push(playerName);

   roomId_Names.set(roomId, arr);

   let tmparr = []
   tmparr.push(ws)

   roomId_WS.set(roomId, tmparr);

   // send the create acknowledgement to the current player with the roomId
   ws.send(JSON.stringify({
      type: "create",
      roomId: roomId
   }));
}

// when a client sends a move message i.e when the player makes a move of X or O
function move(ws, data) {
   let x = data.x;
   let y = data.y;
   let whoyouare = data.whoyouare;
   let roomId = data.roomId;

   let currentTurn = roomId_Turn.get(roomId);
   console.log(roomId);
   console.log(currentTurn, whoyouare);
   if (currentTurn !== whoyouare) {
      // if it is not the turn of the player, send a message to the client that the move is rejected
      ws.send(JSON.stringify({
         type: "move",
         status: "rejected"
      }))
      return;
   }

   let grid = roomGrid[roomId];
   console.log(grid);
   if (grid[x][y] !== null) {
      // if the cell is already occupied, send a message to the client that the move is rejected
      ws.send(JSON.stringify({
         type: "move",
         status: "rejected"
      }))
      return;
   }

   grid[x][y] = whoyouare;
   roomGrid.set(roomId, grid);
   roomId_Turn.set(roomId, whoyouare === "X" ? "O" : "X");

   let roomWS = roomId_WS.get(roomId);

   for (let ws of roomWS) {
      // send the move details to the other player
      ws.send(JSON.stringify({
         type: "move",
         status: "accept",
         value: whoyouare,
         x: x,
         y: y,
         winner: determineWinner(grid)
      }))
   }
}

// kicks the clients out of the room and deletes the room
function exitRoom(roomId) {
   let clients = roomId_WS.get(roomId);
   for (let client of clients) {
      if (client.readyState === ws.OPEN) {
         // send the exit message to the client
         client.send(JSON.stringify({
            type: "exit"
         }))
      }
   }

   // clear the map with key roomId
   roomGrid.delete(roomId);
   roomId_Names.delete(roomId);
   roomId_WS.delete(roomId);
   roomId_Turn.delete(roomId);

   let index = rooms.indexOf(roomId);
   if (index !== -1) {
      // remove the roomId from the rooms array
      rooms.splice(index, 1);
   }
}

// websocket listening on path /
app.ws('/', (ws, req) => {
   console.log('Client connected to WebSocket :)');

   // When the client sends a message
   ws.on('message', (message) => {
      // Parse the message
      let data = JSON.parse(message);

      // for all existing rooms, check if the players are still connected and if one player of a room is disconnected, kick the other player out of the same room
      if (data.type === "alive") {
         checkClientStatus(data.roomId);
         return;
      }

      // if the message is a join message
      if (data.type === "join") {
         join(ws, data.playerName, data.roomId);
         return;
      }

      // if the message is a create room message
      if (data.type === "create") {
         create(ws, data.playerName);
         return;
      }

      // if the message is a move message
      if (data.type === "move") {
         move(ws, data)
         return;
      }

      // if the message is an exit message
      if (data.type === "exit") {
         exitRoom(data.roomId);
         return;
      }
   });

   // When the client closes the connection
   ws.on('close', () => {
      console.log('Client disconnected :(');
   });
});

// Start the server
app.listen(3000, () => {
   console.log('Server listening on port 3000');

   // check the connection status of the clients of all rooms every second 
   setInterval(() => {
      for (let room of rooms) {
         checkClientStatus(room)
      }
   }, 1000)
});