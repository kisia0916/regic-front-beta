import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { serverURL } from '../../apiinfo'
import { machineListInterface, onlineRemoteMachineInterface, RemoteMachineInterface, RemoteMachineInterfaceMain } from '../../interfaces/remoteMachineInterface'
import MachineItem from '../machineItem/MachineItem'
import { SocketContext } from '../../App'

function HomePageMain() {
    const [cookies,setCookie] = useCookies()
    const [firstLoadRestFlg,setFirstLoadRestFlg] = useState<Boolean>(false)
    const [firstLoadSocketFlg,setFirstLoadSocketFlg] = useState<Boolean>(false)
    const [isOnline,setIsOnline] = useState<Boolean>(false)
    const [machineList,setMachineList] = useState<machineListInterface>()
    const socket:any = useContext(SocketContext)
    useEffect(()=>{
        if (!firstLoadRestFlg){
            setFirstLoadRestFlg(true)
            axios.post(`${serverURL}/remotemachine/getmachine`,{
                jwt_token:cookies.jwt_token
            }).then((res)=>{
                setMachineList(res.data as machineListInterface)
                const resData = res.data as machineListInterface
                if (resData.onlineRemoteMachine.length>0){
                    setIsOnline(true)
                }
                console.log(res.data)
            }).catch((error)=>{
                alert(error)
            })
        }
    },[])
    useEffect(()=>{
        if (!firstLoadSocketFlg){
            setFirstLoadSocketFlg(true)
            socket.emit("first_handshake",{userType:"client",token:cookies.jwt_token})
        }
    },[])
  return (
    <div>
        <span>Online hosts</span><br/>
        {isOnline?machineList?.onlineRemoteMachine.map((i:onlineRemoteMachineInterface)=>{
            return <MachineItem key={i.machineId} machineId={i.machineId} machineName={i.machineName}/>
        }):<span>None<br/></span>}
        <span>All hosts</span>
        {machineList?.allRemoteMachine.map((i:RemoteMachineInterfaceMain)=>{
            return <MachineItem key={i.machineId} machineId={i.machineId} machineName={i.machineName}/>
        })}
    </div>
  )
}

export default HomePageMain