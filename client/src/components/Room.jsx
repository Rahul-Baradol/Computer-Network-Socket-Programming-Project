import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';

function Room(props) {
   const navigate = useNavigate();
   const [message, setMessage] = useState("");
   const [searchParams, setSearchParams] = useSearchParams();

   useEffect(() => {
      if (!props.socket) {
         navigate("/");
      }

      let exitedRoom = searchParams.get("exitedRoom")
      if (exitedRoom) {
         setMessage("Other player exited room.")
         document.getElementById("matchResult").showModal();
      }
   }, [])

   return (
      <>
         <div className='flex flex-col items-center gap-3'>
            <div className='flex flex-col gap-3'>
               <input value={props.roomId} onChange={(e) => {
                  props.setRoomId(e.target.value);
               }} type="text" placeholder="Enter Room Id" className="text-center input input-bordered w-[30vw]" />

               <button className="btn btn-secondary w-[30vw]" onClick={async () => {
                  props.socket.send(JSON.stringify({
                     type: "join",
                     playerName: props.player,
                     roomId: props.roomId
                  }))

                  props.socket.onmessage = (event) => {
                     let data = JSON.parse(event.data);

                     if (data.type !== "join") {
                        return;
                     }

                     if (data.status === "added") {
                        props.setRoomId(data.roomId);
                        props.setOtherPlayer(data.otherPlayerName);
                        props.setIdentity(data.whoyouare);
                        navigate("/play");
                        return;
                     }

                     if (data.status === "full") {
                        setMessage("Room is full")
                     } else {
                        setMessage("Room does not exist")
                     }
                     document.getElementById("matchResult").showModal();
                  }
               }}>Join Room</button>
            </div>

            <div className="divider w-[30vw] ">OR</div>

            <div>
               <button className="btn btn-secondary w-[30vw]" onClick={async () => {
                  props.socket.send(JSON.stringify({
                     type: "create",
                     playerName: props.player
                  }))

                  props.socket.onmessage = (event) => {
                     let data = JSON.parse(event.data);

                     if (data.type === "create" && data.roomId) {
                        props.setRoomId(data.roomId);
                        navigate("/wait")
                     }
                  }
               }}>Create Room</button>
            </div>

            <dialog id="matchResult" className="modal">
               <div className="modal-box">
                  <h3 className="font-bold text-lg">Match Result</h3>
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

export default Room