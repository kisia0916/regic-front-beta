import { useGoogleLogin } from '@react-oauth/google'
import React, { useContext, useEffect, useState } from 'react'
import { LoginStateContext } from '../../App'
import axios from 'axios'
import { serverURL } from '../../apiinfo'
import { useCookies } from 'react-cookie'
import { loginResInterface } from '../../interfaces/loginResInterface'
import { Navigate } from 'react-router-dom'

function LoginPageMain() {
    const setLoginState:any = useContext(LoginStateContext)
    const [authCode,setAuthCode] = useState<string>("")
    const [cookies,setCookie] = useCookies()
    const [redirectFlg,setRedirectFlg] = useState<Boolean>(false)
    useEffect(()=>{
        console.log(authCode)
        if (authCode){
            axios.post(`${serverURL}/user/auth`,{
                authCode:authCode as string,
                jwtToken:""
            }).then((res)=>{
                setLoginState(true)
                setCookie("jwt_token",res.data.token,{
                    httpOnly:true
                })
                setRedirectFlg(true)
            }).catch((error)=>console.log(error))
        }
    },[authCode])
    const login = useGoogleLogin({
        flow:"auth-code",
        onSuccess:(res)=>{
            setAuthCode(res.code)
        }
    })
  return (
    <div>
        <button onClick={login}>login with google</button>
        {redirectFlg?<Navigate replace to="/home"/>:<></>}
    </div>
  )
}

export default LoginPageMain