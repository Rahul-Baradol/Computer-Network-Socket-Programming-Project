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

   arr.push(playerName);

   roomId_Names.set(roomId, arr);

   let tmparr = roomId_WS.get(roomId);
   tmparr[0].send(JSON.stringify({
      type: "otherplayer",
      playerName: playerName
   }))

   tmparr.push(ws);
   roomId_WS.set(roomId, tmparr);

   ws.send(JSON.stringify({
      type: "join",
      status: "added",
      otherPlayerName: arr[0]
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

   console.log(playerName);

   let arr = [];
   arr.push(playerName);

   roomId_Names.set(roomId, arr);

   let tmparr = []
   tmparr.push(ws)

   roomId_WS.set(roomId, tmparr);
   
   console.log(roomId_WS);

   ws.send(JSON.stringify({
      type: "create",
      roomId: roomId
   }));
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
      }
   });

   ws.on('close', () => {
      console.log('Client disconnected :(');
   });
});

app.listen(3000, () => {
   console.log('Server listening on port 3000');
});