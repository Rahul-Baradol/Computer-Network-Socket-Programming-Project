import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';

function Room(props) {
   const navigate = useNavigate();
   const [message, setMessage] = useState("");
   const [searchParams, setSearchParams] = useSearchParams();

   // show the modal on the query parameter
   useEffect(() => {
      // if the socket is not connected, navigate to the home page
      if (!props.socket) {
         navigate("/");
      }

      // if the exitedRoom query parameter is present, show the modal displaying "Other player exited room."
      let exitedRoom = searchParams.get("exitedRoom")
      if (exitedRoom) {
         setMessage("Other player exited room.") // set the message to be displayed in the modal
         document.getElementById("matchResult").showModal(); // show the modal
      }
   }, [])

   return (
      <>
         <div className='flex flex-col items-center gap-3'>
            <div className='flex flex-col gap-3'>
               {/* Input Box to take the room id */}
               <input value={props.roomId} onChange={(e) => {
                  props.setRoomId(e.target.value);
               }} type="text" placeholder="Enter Room Id" className="text-center input input-bordered w-[30vw]" />

               {/* Join Room button to join the room */}
               <button className="btn btn-secondary w-[30vw]" onClick={async () => {
                  // send a message to the server to join the room
                  props.socket.send(JSON.stringify({
                     type: "join",
                     playerName: props.player,
                     roomId: props.roomId
                  }))
                  
                  // perform an action for the response from the server via a event listener
                  props.socket.onmessage = (event) => {
                     let data = JSON.parse(event.data);

                     // if the response is not a join response, return
                     if (data.type !== "join") {
                        return;
                     }

                     // if the response message is "added", then we have been added to the room and therefore we can navigate to the /play route 
                     if (data.status === "added") {
                        props.setRoomId(data.roomId);
                        props.setOtherPlayer(data.otherPlayerName);
                        props.setIdentity(data.whoyouare);
                        navigate("/play");
                        return;
                     }
                     
                     // if the room is full, set the message to "Room is full"
                     if (data.status === "full") {
                        setMessage("Room is full")
                     } else {
                        setMessage("Room does not exist") // if the room does not exist, set the message to "Room does not exist"
                     }

                     // show the modal with the message
                     document.getElementById("matchResult").showModal();
                  }
               }}>Join Room</button>
            </div>

            <div className="divider w-[30vw] ">OR</div>

            <div>
               {/* Create Room button to create a new room */}
               <button className="btn btn-secondary w-[30vw]" onClick={async () => {
                  // send a message to the server to create a new room
                  props.socket.send(JSON.stringify({
                     type: "create",
                     playerName: props.player
                  }))
                  
                  // perform an action for the response from the server via a event listener
                  props.socket.onmessage = (event) => {
                     let data = JSON.parse(event.data);
                     
                     // if the response is a create response, and the roomId is present, set the roomId and navigate to the /wait route 
                     if (data.type === "create" && data.roomId) {
                        props.setRoomId(data.roomId);
                        navigate("/wait")
                     }
                  }
               }}>Create Room</button>
            </div>

            {/* Modal to display the message | This is DaisyUI component */}
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