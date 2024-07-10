import React, { createContext, useState } from 'react';
import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import WorkSpacePage from './pages/WorkSpacePage';
import { serverURL } from './apiinfo';
import {io} from "socket.io-client"

const socket:any = io(`${serverURL}`)
export const LoginStateContext:any = createContext("")
export const SocketContext:any = createContext("")

function App() {
  const [loginState,setLoginState] = useState<Boolean>(false)
  return(
    <SocketContext.Provider value={socket}>
      <LoginStateContext.Provider value={setLoginState}>
        <BrowserRouter>
          <Routes>
            <Route  path="/login" element={<LoginPage/>}/>
            <Route  path="/home" element={loginState?<Home/>:<Navigate replace to="/login"/>}/>
            <Route  path="/workspace" element={loginState?<WorkSpacePage/>:<LoginPage/>}/>
          </Routes> 
        </BrowserRouter>
      </LoginStateContext.Provider>
    </SocketContext.Provider>
  );
}

export default App;
