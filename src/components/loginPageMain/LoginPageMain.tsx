import { useGoogleLogin } from '@react-oauth/google'
import React, { useContext, useEffect, useState } from 'react'
import { LoginStateContext } from '../../App'
import axios from 'axios'
import { serverURL } from '../../apiinfo'

function LoginPageMain() {
    const setLoginState:any = useContext(LoginStateContext)
    const [authCode,setAuthCode] = useState<string>("")
    useEffect(()=>{
        console.log(authCode)
        if (authCode){
            axios.post(`${serverURL}/user/auth`,{
                authCode:authCode as string,
                jwtToken:""
            }).then((res)=>{
                console.log(res)
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
    </div>
  )
}

export default LoginPageMain