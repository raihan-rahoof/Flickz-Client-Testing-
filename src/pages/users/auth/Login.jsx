import React from 'react'
import LoginForm from '../../../components/users/LoginForm'
import './login.scss'

function Login() {
  return (
    <>
     <div className="login-page">
      <div className="background-image"></div>
        <div className="login-form-container">
            <LoginForm />
        </div>
    </div>
    </>
  )
}

export default Login