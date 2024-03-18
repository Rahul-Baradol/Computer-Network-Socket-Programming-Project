import React, { useEffect } from 'react'
import '../App.css'
import { useNavigate } from 'react-router-dom'

function Wait(props) {
  const navigate = useNavigate();

  // add event listener to the web socket
  useEffect(() => {
    props.socket.onmessage = (event) => {
      let data = JSON.parse(event.data);

      if (data.type !== "otherplayer") {
        return;
      }

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