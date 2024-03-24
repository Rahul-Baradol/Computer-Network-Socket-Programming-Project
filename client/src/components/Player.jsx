import React from 'react'
import { useNavigate } from "react-router-dom";

function Player(props) {
   // navigate function to navigate to a different route
   const navigate = useNavigate();

   return (
      <>
         {/* Input Box to take the player name */}
         <input value={props.player} onChange={(e) => {
            props.setPlayer(e.target.value);
         }} type="text" placeholder="Your name please :)" className="text-center input input-bordered w-[30vw]" />

         {/* Continue button to navigate to the room component */}
         <button className="btn btn-secondary w-[30vw]" onClick={() => {
            if (props.player !== "") {
               navigate("/room")
               return;
            }
         }}>Continue</button>
      </>
   )
}

export default Player