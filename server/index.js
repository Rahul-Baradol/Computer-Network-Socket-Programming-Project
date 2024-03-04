const express = require('express');
const expressWs = require('express-ws');
const ws = require('ws');
const cors = require('cors');

const app = express();

const expressWsInstance = expressWs(app);
const wss = new ws.Server({ server: expressWsInstance.app });

app.use(cors());

let rooms = []

let roomGrid = new Map();
let roomId_Names = new Map();
let roomId_WS = new Map();
let roomId_Turn = new Map();

function XorO() {
   const randomNumber = Math.random();
   return randomNumber < 0.5 ? 1 : 0;
}

function determineWinner(grid) {
   if (grid[0][0] !== null && grid[0][0] === grid[1][1] && grid[1][1] === grid[2][2]) {
      return grid[0][0];
   }
   
   if (grid[0][2] !== null && grid[0][2] === grid[1][1] && grid[1][1] === grid[2][0]) {
      return grid[0][2];
   }

   for (let i = 0; i <= 2; i++) {
      if (grid[i][0] !== null && grid[i][0] === grid[i][1] && grid[i][1] === grid[i][2]) {
         return grid[i][0];
      }

      if (grid[0][i] !== null && grid[0][i] === grid[1][i] && grid[1][i] === grid[2][i]) {
         return grid[0][i];
      }
   }

   return "?";
}

function join(ws, playerName, roomId) {
   if (!rooms.includes(roomId)) {
      ws.send(JSON.stringify({
         type: "join",
         status: "notexist"
      }));
      return;
   }

   let arr = roomId_Names.get(roomId);

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
   tmparr[0].send(JSON.stringify({
      type: "otherplayer",
      playerName: playerName,
      whoyouare: xo ? "X" : "O"
   }))

   tmparr.push(ws);
   roomId_WS.set(roomId, tmparr);

   ws.send(JSON.stringify({
      type: "join",
      status: "added",
      otherPlayerName: arr[0],
      whoyouare: xo ? "O" : "X",
      roomId: roomId
   }));
}

function create(ws, playerName) {
   function random5Digit() {
      return Math.floor(Math.random() * 100000).toString().padStart(5, '0');
   }

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

   ws.send(JSON.stringify({
      type: "create",
      roomId: roomId
   }));
}

function move(ws, data) {
   let x = data.x;
   let y = data.y;
   let whoyouare = data.whoyouare;
   let roomId = data.roomId;

   let currentTurn = roomId_Turn.get(roomId);
   console.log(roomId);
   console.log(currentTurn, whoyouare);
   if (currentTurn !== whoyouare) {
      ws.send(JSON.stringify({
         type: "move",
         status: "rejected"
      }))
      return;
   }

   let grid = roomGrid[roomId];
   console.log(grid);
   if (grid[x][y] !== null) {
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

function reset(roomId) {
   roomGrid.set(roomId, [[null, null, null], [null, null, null], [null, null, null]])
   roomId_Turn.set(roomId, "X");
}

app.ws('/', (ws, req) => {
   console.log('Client connected to WebSocket :)');

   ws.on('message', (message) => {
      let data = JSON.parse(message);
      if (data.type === "join") {
         join(ws, data.playerName, data.roomId);
         return;
      }

      if (data.type === "create") {
         create(ws, data.playerName);
         return;
      }

      if (data.type === "move") {
         move(ws, data)
         return;
      }

      if (data.type === "reset") {
         reset(data.roomId);
         return;
      }
   });

   ws.on('close', () => {
      console.log('Client disconnected :(');
   });
});

app.listen(3000, () => {
   console.log('Server listening on port 3000');
});