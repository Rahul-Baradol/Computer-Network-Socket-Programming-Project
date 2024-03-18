import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css'
import Player from './components/Player'
import Room from "./components/Room";
import { useEffect, useState } from "react";
import Wait from "./components/Wait";
import Play from "./components/Play";

function App() {
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
      socket.addEventListener("open", () => {
        console.log("Web Socket connected!");
      })

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
            <Route path="/" element={<Player player={player} setPlayer={setPlayer} />} />
            <Route path="/room" element={<Room setIdentity={setIdentity} setOtherPlayer={setOtherPlayer} socket={socket} player={player} roomId={roomId} setRoomId={setRoomId} />} />
            <Route path="/play" element={<Play roomId={roomId} socket={socket} identity={identity} player={player} otherPlayer={otherPlayer} />} />
            <Route path="/wait" element={<Wait setIdentity={setIdentity} socket={socket} setOtherPlayer={setOtherPlayer} roomId={roomId} />} />
          </Routes>
        </BrowserRouter>

      </div>
      <div />
    </>
  )
}

export default App
