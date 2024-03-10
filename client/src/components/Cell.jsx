import React from 'react'

function Cell(props) {
   function border(x, y) {
      let classes = "";

      if (x === 0) {
         classes += "border-t-0 ";
      }

      if (x === 2) {
         classes += "border-b-0 ";
      }

      if (y === 0) {
         classes += "border-l-0 ";
      }

      if (y === 2) {
         classes += "border-r-0 ";
      }

      return classes
   }

   return (
      <>
         <div onClick={() => {
            if (props.flag === 0) {
               props.socket.send(JSON.stringify({
                  type: "move",
                  roomId: `${props.roomId}`,
                  whoyouare: `${props.identity}`,
                  x: `${props.x}`,
                  y: `${props.y}`,
               }))
            }
         }} className={`w-auto h-auto flex justify-center items-center border-blue-400 border-2 ${border(props.x, props.y)}`}>
            {props.displayValue !== "" && <span className='text-2xl'>
               {props.displayValue}
            </span>}
         </div>
      </>
   )
}

export default Cell