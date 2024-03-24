import React, { useEffect, useState } from 'react'
import Cell from './Cell'
import { useNavigate } from 'react-router-dom';

function Play(props) {
   // state to store the turn of the player
   const [turn, setTurn] = useState("X");

   // state to store the grid of the game
   const [grid, setGrid] = useState([["", "", ""], ["", "", ""], ["", "", ""]])

   // state to store the flag
   // significance of flag: 
   // if the flag is 0, the game is currently running i.e the verdict of the match is not decided and the player can make the move
   // if the flag is 1, the game is over and the player cannot make a move
   const [flag, setFlag] = useState(0);

   // state to store the message to be displayed in the modal
   const [message, setMessage] = useState("");

   // navigate function to navigate to a different route
   const navigate = useNavigate();

   useEffect(() => {
      // if the socket is not connected, navigate to the home page
      if (!props.socket) {
         navigate("/")
      }
   }, [])

   useEffect(() => {
      if (props.socket) {
         // on receiving a message from the server via socket, perform the following action
         props.socket.onmessage = (event) => {
            let data = JSON.parse(event.data);
            console.log(data);

            // if the response is exit response, navigate to the /room route with the query parameter exitedRoom=true
            if (data.type === "exit") {
               navigate(`/room?exitedRoom=true`);
               return;
            }

            let status = data.status;

            // if status message from the response is "accept", it means that the move request sent has been acknowledged by the server
            // therefore update the grid and turn
            if (status === "accept") {
               let g = grid;
               g[data.x][data.y] = data.value;
               setGrid(g);
               setTurn(turn === "X" ? "O" : "X") // change the turn

               // if the winner is decided, set the flag to 1 and display the message in the modal
               if (data.winner !== "?") {
                  setFlag(1);

                  // if the winner value is =, then it is a tie
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

            {/* grid to display the game */}
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

            {/* button to exit the room */}
            <button className={`btn btn-secondary w-[30vw]`} onClick={async () => {
               // send a message to the server to exit the room
               props.socket.send(JSON.stringify({
                  type: "exit",
                  roomId: props.roomId
               }))

               // navigate to the /room route
               navigate("/room")
            }}>Exit Room</button>

            {/* modal to display the match results */}
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