import React, { useContext, useEffect } from 'react'
import "./MachineItem.css"
import { SetFirstLogContext, SocketContext } from '../../App'
import { useCookies } from 'react-cookie'

function MachineItem(props:{machineName:string,machineId:string}) {
  const socket:any = useContext(SocketContext)
  const [cookies,setCookies] = useCookies()
  const connection_request = ()=>{
      socket.emit("connection_request",{machineId:props.machineId,jwtToken:cookies.jwt_token})
  }

  return (
    <div className='machineItemMain'>
        <p>Name:{props.machineName}</p>
        <p>ID:{props.machineId}</p>
        <button onClick={connection_request}>connection</button>
    </div>
  )
}

export default MachineItem