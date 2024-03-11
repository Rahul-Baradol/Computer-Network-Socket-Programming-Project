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
      if (!props.socket) {
         navigate("/")
      }
   }, [])

   useEffect(() => {
      if (props.socket) {
         props.socket.onmessage = (event) => {
            let data = JSON.parse(event.data);
            console.log(data);
   
            if (data.type === "exit") {
               navigate(`/room?exitedRoom=true`);
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
   
                  if (data.winner === "=") {
                     setMessage("It is tie!")
                     document.getElementById("matchResult").showModal();
                  } else {
                     setMessage(`${data.winner} is winner!`)
                     document.getElementById("matchResult").showModal();
                  }
               }
            }
         }
      }
   })

   return (
      <>
         <div className='flex flex-col items-center gap-5'>
            <div className='flex flex-col items-center gap-2'>
               <div>You ({props.player}) will play as {props.identity}</div>
               <div>You have {props.otherPlayer} as opponent</div>
               <div>{turn} plays now!</div>
            </div>

            <div className='grid grid-cols-3 grid-rows-3 w-[40vw] md:w-[20vw] h-[40vh]'>
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

            <button className={`btn btn-secondary w-[30vw]`} onClick={async () => {
               props.socket.send(JSON.stringify({
                  type: "exit",
                  roomId: props.roomId
               }))

               navigate("/room")
            }}>Exit Room</button>

            <dialog id="matchResult" className="modal">
               <div className="modal-box">
                  <h3 className="font-bold text-lg">Match Results :)</h3>
                  <p className="py-4">{message}</p>
                  <div className="modal-action">
                     <form method="dialog">
                     <button className="btn">Close</button>
                     </form>
                  </div>
               </div>
            </dialog>
         </div>
      </>
   )
}

export default Play;