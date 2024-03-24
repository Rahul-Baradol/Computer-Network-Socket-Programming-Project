import React, { useEffect } from 'react'
import '../App.css'
import { useNavigate } from 'react-router-dom'

function Wait(props) {
  const navigate = useNavigate();

  useEffect(() => {
    // perform an action for the response from the server via a event listener
    props.socket.onmessage = (event) => {
      let data = JSON.parse(event.data);

      // if the response is not otherplayer response, return
      if (data.type !== "otherplayer") {
        return;
      }

      // if the response message is otherplayer, then we have been added to the room and therefore we can navigate to the /play route
      props.setOtherPlayer(data.playerName);
      props.setIdentity(data.whoyouare);
      navigate("/play");
    }
  }, [])

  return (
    <>
      <div className='flex flex-col gap-12 items-center'>
        <div className='flex flex-col items-center gap-3 text-lg'>
          Waiting for other player
          <div className="loading loading-ring loading-lg">

          </div>
        </div>

        <div className='font2 text-lg'>
          Room Id is {props.roomId}
        </div>
      </div>
    </>
  )
}

export default Wait