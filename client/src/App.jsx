import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css'
import Player from './components/Player'
import Room from "./components/Room";
import { useEffect, useState } from "react";
import Wait from "./components/Wait";
import Play from "./components/Play";

function App() {
  // state variables
  const [player, setPlayer] = useState("");
  const [otherPlayer, setOtherPlayer] = useState("");
  const [roomId, setRoomId] = useState("");
  const [socket, setSocket] = useState(null);
  const [identity, setIdentity] = useState("");

  // initialize the web socket on component render
  useEffect(() => {
    if (!socket) {
      setSocket(new WebSocket("ws://localhost:3000/"))
    }
  }, [])

  // add event listeners to the web socket
  useEffect(() => {
    if (socket) {
      // when a new web socket connection is established
      socket.addEventListener("open", () => {
        console.log("Web Socket connected!");
      })

      // when the web socket connection closes
      socket.addEventListener("close", () => {
        console.log("Web Socket disconnected!");
      })
    }
  }, [socket])

  return (
    <>
      <div className='flex flex-col gap-5 w-screen h-screen justify-center items-center'>
        <div className='font text-6xl'>Tic Tac Toe</div>

        <BrowserRouter>
          <Routes>
            {/* Route to the player component on / path */}
            <Route path="/" element={<Player player={player} setPlayer={setPlayer} />} />

            {/* Route to the room component on /room path */}
            <Route path="/room" element={<Room setIdentity={setIdentity} setOtherPlayer={setOtherPlayer} socket={socket} player={player} roomId={roomId} setRoomId={setRoomId} />} />

            {/* Route to the play component on /play path */}
            <Route path="/play" element={<Play roomId={roomId} socket={socket} identity={identity} player={player} otherPlayer={otherPlayer} />} />

            {/* Route to the wait component on /wait path */}
            <Route path="/wait" element={<Wait setIdentity={setIdentity} socket={socket} setOtherPlayer={setOtherPlayer} roomId={roomId} />} />
          </Routes>
        </BrowserRouter>

      </div>
    </>
  )
}

export default App
