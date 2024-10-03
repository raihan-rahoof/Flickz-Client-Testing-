import React from 'react'
import RegisterForm from '../../../components/users/RegisterForm'
import './register.scss'

function Register() {
  return (
     <>
    <div className="register-page">
     <div className="background-image"></div>
       <div className="register-form-container">
           <RegisterForm/>
       </div>
   </div>
   </>
  )
}

export default Register