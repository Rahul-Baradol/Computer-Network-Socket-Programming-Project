import React, { useEffect, useState } from 'react'
import Cell from './Cell'
import { useNavigate } from 'react-router-dom';

function Play(props) {
   const [turn, setTurn] = useState("X");
   const [grid, setGrid] = useState([["", "", ""], ["", "", ""], ["", "", ""]])
   const [flag, setFlag] = useState(0);
   const [message, setMessage] = useState("");
   const navigate = useNavigate();

   useEffect(() => {
      props.socket.onmessage = (event) => {
         let data = JSON.parse(event.data);
         console.log(data);

         if (data.type !== "move") {
            return;
         }

         let status = data.status;
         if (status === "accept") {
            let g = grid;
            g[data.x][data.y] = data.value;
            setGrid(g);
            setTurn(turn === "X" ? "O" : "X")
            if (data.winner !== "?") {
               setFlag(1);
               setMessage(`${data.winner} is winner!`)
            }
         }
      }
   })

   return (
      <>
         <div className='flex flex-col items-center gap-5'>
            <div className='flex flex-col items-center gap-2'>
               <div>You are {props.player}</div>
               <div>Your opponent is {props.otherPlayer}</div>
               <div>You play {props.identity}</div>
               <div>It is {turn}'s turn</div>
               <div>{message}</div>
            </div>

            <div className='grid grid-cols-3 grid-rows-3 w-[20vw] h-[40vh]'>
               <Cell flag={flag} displayValue={grid[0][0]} setGrid={setGrid} setTurn={setTurn} roomId={props.roomId} socket={props.socket} identity={props.identity} x={0} y={0} />
               <Cell flag={flag} displayValue={grid[0][1]} setGrid={setGrid} setTurn={setTurn} roomId={props.roomId} socket={props.socket} identity={props.identity} x={0} y={1} />
               <Cell flag={flag} displayValue={grid[0][2]} setGrid={setGrid} setTurn={setTurn} roomId={props.roomId} socket={props.socket} identity={props.identity} x={0} y={2} />

               <Cell flag={flag} displayValue={grid[1][0]} setGrid={setGrid} setTurn={setTurn} roomId={props.roomId} socket={props.socket} identity={props.identity} x={1} y={0} />
               <Cell flag={flag} displayValue={grid[1][1]} setGrid={setGrid} setTurn={setTurn} roomId={props.roomId} socket={props.socket} identity={props.identity} x={1} y={1} />
               <Cell flag={flag} displayValue={grid[1][2]} setGrid={setGrid} setTurn={setTurn} roomId={props.roomId} socket={props.socket} identity={props.identity} x={1} y={2} />

               <Cell flag={flag} displayValue={grid[2][0]} setGrid={setGrid} setTurn={setTurn} roomId={props.roomId} socket={props.socket} identity={props.identity} x={2} y={0} />
               <Cell flag={flag} displayValue={grid[2][1]} setGrid={setGrid} setTurn={setTurn} roomId={props.roomId} socket={props.socket} identity={props.identity} x={2} y={1} />
               <Cell flag={flag} displayValue={grid[2][2]} setGrid={setGrid} setTurn={setTurn} roomId={props.roomId} socket={props.socket} identity={props.identity} x={2} y={2} />
            </div>

            <button disabled={!flag} className={`btn btn-secondary w-[30vw]`} onClick={async () => {
               props.socket.send(JSON.stringify({
                  type: "reset",
                  roomId: props.roomId
               }))

               setGrid([["", "", ""], ["", "", ""], ["", "", ""]])
               setFlag(0)
               setMessage("")
               setTurn("X")
            }}>Reset</button>

            <button className={`btn btn-secondary w-[30vw]`} onClick={async () => {
               props.socket.send(JSON.stringify({
                  type: "reset",
                  roomId: props.roomId
               }))

               setGrid([["", "", ""], ["", "", ""], ["", "", ""]])
               setFlag(0)
               setMessage("")
               setTurn("X")

               navigate("/room")
            }}>Exit Room</button>
         </div>
      </>
   )
}

export default Play