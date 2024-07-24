import React, { createContext, useEffect, useRef, useState } from 'react';
import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import WorkSpacePage from './pages/WorkSpacePage';
import { serverURL } from './apiinfo';
import {io} from "socket.io-client"


export const LoginStateContext:any = createContext("")
export const SocketContext:any = createContext("")
export const SetFirstLogContext:any = createContext("")
const socket = io(`${serverURL}`)
function App() {
  const [loginState,setLoginState] = useState<Boolean>(false)
  const [firstLog,setFirstLog] = useState<string>("")
  const [machineId,setMachineId] = useState<string>("")

  return(
    <SetFirstLogContext.Provider value={{machineId:machineId,setMachineId:setMachineId,firstLog:firstLog,setFirstLog:setFirstLog}}>
      <SocketContext.Provider value={socket}>
        <LoginStateContext.Provider value={setLoginState}>
          <BrowserRouter>
            <Routes>
              <Route  path="/" element={<LoginPage/>}/>
              <Route  path="/login" element={<LoginPage/>}/>
              <Route  path="/home" element={loginState?<Home/>:<Navigate replace to="/login"/>}/>
              <Route  path="/workspace" element={loginState?<WorkSpacePage/>:<Navigate replace to="/login"/>}/>
              <Route  path="/test" element={<WorkSpacePage/>}/>
            </Routes> 
          </BrowserRouter>
        </LoginStateContext.Provider>
      </SocketContext.Provider>
      </SetFirstLogContext.Provider>
  );
}

export default App;
