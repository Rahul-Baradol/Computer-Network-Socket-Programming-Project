import React from 'react'
import { useNavigate } from "react-router-dom";

function Player(props) {
   const navigate = useNavigate();

   return (
      <>
         <input value={props.player} onChange={(e) => {
            props.setPlayer(e.target.value);
         }} type="text" placeholder="Your name please :)" className="text-center input input-bordered w-[30vw]" />

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