import React, { useContext, useEffect } from 'react'
import "./MachineItem.css"
import { SetFirstLogContext, SocketContext } from '../../App'
import { useCookies } from 'react-cookie'

function MachineItem(props:{machineName:string,machineId:string,isOnline:boolean}) {
  const socket:any = useContext(SocketContext)
  const [cookies,setCookies] = useCookies()
  const connection_request = ()=>{
      socket.emit("connection_request",{machineId:props.machineId,jwtToken:cookies.jwt_token})
  }
  const restart_host = ()=>{
    socket.emit("restart_host",{machineId:props.machineId,token:cookies.jwt_token})
}
  return (
    <div className='machineItemMain'>
        <p>Name:{props.machineName}</p>
        <p>ID:{props.machineId}</p>
        {props.isOnline?<>
          <button onClick={connection_request}>connection</button>
          <button onClick={restart_host}>restart</button>
        </>:<></>}

    </div>
  )
}

export default MachineItem