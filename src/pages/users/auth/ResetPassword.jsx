import React from 'react'
import './otp.scss'
import ResetPasswordForm from '../../../components/users/ResetPasswordForm'

function ResetPassword() {
  return (
    <>
        <div className="otp-page">
      <div className="background-image"></div>
        <div className="otp-form-container">
            <ResetPasswordForm/>
        </div>
    </div>
    </>
  )
}

export default ResetPassword