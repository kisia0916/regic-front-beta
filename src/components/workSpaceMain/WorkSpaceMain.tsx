
import React, { useContext, useEffect, useRef, useState } from 'react'
import { SetFirstLogContext, SocketContext } from '../../App'
import "./WorkSpaceMain.css"
import { useCookies } from 'react-cookie'
import "./xterm.css"
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit'
import { Navigate } from 'react-router-dom'
import {jwtDecode} from "jwt-decode"
import { FullScreen, useFullScreenHandle } from "react-full-screen";


// let isFirst:boolean = true

function sleep(ms:number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function WorkSpaceMain() {
    const socket:any = useContext(SocketContext)
    const firstLog:any = useContext(SetFirstLogContext)
    const firstFlg = useRef(true)
    const [cookies,setCookie] = useCookies()
    const [termContent,setTermContent] = useState<string>(firstLog.firstLog)
    const [moveElement,setMoveElement] = useState<any>(<></>)
    const mainUserId = useRef<string>("")
    const resizeFlg = useRef<boolean>(true)
    const handle = useFullScreenHandle();
    useEffect(()=>{
        if (firstFlg.current){
            handle.enter()
            firstFlg.current = false
            const decodedToken:any = jwtDecode(cookies.jwt_token)
            mainUserId.current = decodedToken.userId
            const term:any = new Terminal()
            const fitAdd:any = new FitAddon()
            term.loadAddon(fitAdd)
            term.open(document.getElementById("terminal"))
            fitAdd.fit()
            console.log({token:cookies.jwt_token,size:[fitAdd._terminal.cols,fitAdd._terminal.rows],machineId:firstLog.machineId})
            socket.emit("resize_term",{token:cookies.jwt_token,size:[fitAdd._terminal.cols,fitAdd._terminal.rows],machineId:firstLog.machineId})
            term.onKey((e:any)=>{
                console.log(e.key)
                socket.emit("run_command",{userId:mainUserId.current,command:e.key,machineId:firstLog.machineId})
            })
            socket.on("process_result",(result:any)=>{
                term.write(result.data.data)
                console.log(result.data.data)
            })
            socket.on("disconnect_remote_machine",(data:{machineId:string})=>{
                alert("remote machine is offline")
                setMoveElement(<Navigate replace to="/home"/>)
            })
            socket.on("socket-error",(data:string)=>{
                console.log(data)
            })
            window.addEventListener("resize",async()=>{
                if (resizeFlg.current){
                    resizeFlg.current = false
                    await sleep(100)
                    fitAdd.fit()
                    socket.emit("resize_term",{token:cookies.jwt_token,size:[fitAdd._terminal.cols,fitAdd._terminal.rows],machineId:firstLog.machineId})
                    resizeFlg.current = true
                }
            })
        }
    },[])
  return (
    <FullScreen handle={handle}>
        <div id='terminal'>
            
        </div>
        {moveElement}
    </FullScreen>
  )
}

export default WorkSpaceMain