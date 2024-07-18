import React, { useContext, useEffect, useRef, useState } from 'react'
import { SetFirstLogContext, SocketContext } from '../../App'
import "./WorkSpaceMain.css"
import { useCookies } from 'react-cookie'

// let isFirst:boolean = true
function WorkSpaceMain() {
    const socket:any = useContext(SocketContext)
    const textAriaRef = useRef<any>()
    const firstLog:any = useContext(SetFirstLogContext)
    const [resList,setResList] = useState<string[]>([firstLog.firstLog])
    const [nowBottomLength,setNowBottomLength] = useState<number>(firstLog.firstLog.length)
    const [userInput,setUserInput] = useState<string>("")
    const firstFlg = useRef(true)
    const [cookies,setCookie] = useCookies()
    const [changeLineNum,setChangeLineNum] = useState<number>(()=>{
        const split = firstLog.firstLog.split("\n")
        return split.length-1
    }) 
    useEffect(()=>{
        if (firstFlg.current){
            firstFlg.current = false
            console.log("process on")
            socket.on("process_result",(result:any)=>{
                // console.log(result.data.data)
                setNowBottomLength(result.data.data.length)
                setResList((now)=>{
                    console.log(result.data.data)
                    if (now.length>1){
                        const splitList = result.data.data.split("\n")
                        setChangeLineNum(splitList.length-1)
                        return [now[0]+now[1],result.data.data]
                    }else{
                        const splitList = result.data.data.split("\n")
                        setChangeLineNum(splitList.length-1)
                        return [...now,result.data.data]
                    }
                })
            })
            socket.on("socket-error",(data:string)=>{
                console.log(data)
            })
        }
    },[])
    const cmdInput = (event:any)=>{
        console.log(event.target.value.length)
        console.log(nowBottomLength)
        console.log(changeLineNum)
        if (event.target.value.length>=nowBottomLength-changeLineNum){
            setResList((now)=>{
                if (now.length>1){
                    return [now[0],event.target.value]
                }else{
                    return [event.target.value]
                }
            })
            setUserInput(event.target.value.slice(nowBottomLength-changeLineNum))
        }
    }
    const checkLine = (value:string)=>{
        const splitValue = value.split("\n")
        return splitValue.length*12
    }
    const keyCheck = (event:any)=>{
        if (event.key === "Enter"){
            socket.emit("run_command",{token:cookies.jwt_token,command:userInput,machineId:firstLog.machineId})
        }
    }
  return (
    <div className='WorkSpaceMain'>
        {resList.map((i,index)=>{
            if (index === 0 && resList.length !== 1){
                return <textarea value={i} style={{height:`${checkLine(i)}px`,width:"99.5vw"}} className='consoleTextBox topBox' readOnly></textarea>
            }else{
                return <textarea value={i} style={{height:`${checkLine(i)}px`,width:"99.5vw"}} className='consoleTextBox' onChange={cmdInput} onKeyDown={keyCheck}></textarea>
            }
        })}
    </div>
  )
}

export default WorkSpaceMain