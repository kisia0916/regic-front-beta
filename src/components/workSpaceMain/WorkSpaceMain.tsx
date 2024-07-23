
import React, { useContext, useEffect, useRef, useState } from 'react'
import { SetFirstLogContext, SocketContext } from '../../App'
import "./WorkSpaceMain.css"
import { useCookies } from 'react-cookie'
import "./xterm.css"
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit'
import { Navigate } from 'react-router-dom'

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
    const resizeFlg = useRef<boolean>(true)
    useEffect(()=>{
        if (firstFlg.current){
            firstFlg.current = false
            const term:any = new Terminal()
            const fitAdd:any = new FitAddon()
            term.loadAddon(fitAdd)
            term.open(document.getElementById("terminal"))
            fitAdd.fit()
            console.log({token:cookies.jwt_token,size:[fitAdd._terminal.cols,fitAdd._terminal.rows],machineId:firstLog.machineId})
            socket.emit("resize_term",{token:cookies.jwt_token,size:[fitAdd._terminal.cols,fitAdd._terminal.rows],machineId:firstLog.machineId})
            term.onKey((e:any)=>{
                console.log(e.key)
                socket.emit("run_command",{token:cookies.jwt_token,command:e.key,machineId:firstLog.machineId})
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
    <>
        <div id='terminal'>
            
        </div>
        {moveElement}
    </>
  )
}

export default WorkSpaceMain