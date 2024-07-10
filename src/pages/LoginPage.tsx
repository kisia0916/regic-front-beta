import { GoogleOAuthProvider } from '@react-oauth/google'
import React from 'react'
import LoginPageMain from '../components/loginPageMain/LoginPageMain'

function LoginPage() {
  return (
    <GoogleOAuthProvider clientId='199921114218-f89uudjipama2ha02csjjgk8la86vji2.apps.googleusercontent.com'>
        <LoginPageMain/>
    </GoogleOAuthProvider>
  )
}

export default LoginPage