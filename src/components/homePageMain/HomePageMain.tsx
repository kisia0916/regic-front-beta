import axios from 'axios'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useCookies } from 'react-cookie'
import { serverURL } from '../../apiinfo'
import { machineListInterface, onlineRemoteMachineInterface, RemoteMachineInterface, RemoteMachineInterfaceMain } from '../../interfaces/remoteMachineInterface'
import MachineItem from '../machineItem/MachineItem'
import { SetFirstLogContext, SocketContext } from '../../App'
import { Navigate } from 'react-router-dom'

function HomePageMain() {
    const [cookies,setCookie] = useCookies()
    const [firstLoadRestFlg,setFirstLoadRestFlg] = useState<Boolean>(false)
    const [firstLoadSocketFlg,setFirstLoadSocketFlg] = useState<Boolean>(false)
    const [isOnline,setIsOnline] = useState<Boolean>(false)
    const [machineList,setMachineList] = useState<machineListInterface>()
    const [navigateContent,setNavigateContent] = useState<any>(<></>)
    const [machineSettingToken,setMachineSettingToken] = useState<string>("")
    const socket:any = useContext(SocketContext)
    const firstLog:any = useContext(SetFirstLogContext)
    const decoder = new TextDecoder("shift-jis")
    const isFirst = useRef<boolean>(true)
    useEffect(()=>{
        if (isFirst.current){
            isFirst.current = false
            socket.emit("first_handshake",{userType:"client",token:cookies.jwt_token})
            socket.on("socket-error",(data:string)=>{
            alert(data)
            })
            socket.on("new_process_created",(data:any)=>{
                console.log(decoder.decode(data.data as Uint8Array))
                firstLog.setFirstLog(decoder.decode(data.data as Uint8Array))
                firstLog.setMachineId(data.machineId)
                setNavigateContent(<Navigate replace to="/workspace"/>)
            })
        }
      },[])
    useEffect(()=>{
        if (!firstLoadRestFlg){
            setFirstLoadRestFlg(true)
            axios.post(`${serverURL}/remotemachine/generatemjwt`,{
                jwt_token:cookies.jwt_token
            }).then((res)=>{
                setMachineSettingToken(res.data.token)
                console.log(res.data.token)
            }).catch((error)=>{
                alert(error)
            })
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

  return (
    <div>
        <span>setting token:<input type='text' value={machineSettingToken}></input></span><br/>
        <span>Online hosts</span><br/>
        {isOnline?machineList?.onlineRemoteMachine.map((i:onlineRemoteMachineInterface)=>{
            return <MachineItem key={i.machineId} machineId={i.machineId} machineName={i.machineName}/>
        }):<span>None<br/></span>}
        <span>All hosts</span>
        {machineList?.allRemoteMachine.map((i:RemoteMachineInterfaceMain)=>{
            return <MachineItem key={i.machineId} machineId={i.machineId} machineName={i.machineName}/>
        })}
        {navigateContent}
    </div>
  )
}

export default HomePageMain