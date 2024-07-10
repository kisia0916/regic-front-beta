import React, { createContext, useState } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import WorkSpacePage from './pages/WorkSpacePage';


export const LoginStateContext:any = createContext("")

function App() {
  const [loginState,setLoginState] = useState<Boolean>(false)
  return(
    <LoginStateContext.Provider value={setLoginState}>
      <BrowserRouter>
        <Routes>
          <Route  path="/login" element={<LoginPage/>}/>
          <Route  path="/home" element={loginState?<Home/>:<LoginPage/>}/>
          <Route  path="/workspace" element={loginState?<WorkSpacePage/>:<LoginPage/>}/>
        </Routes> 
      </BrowserRouter>
    </LoginStateContext.Provider>
  );
}

export default App;
