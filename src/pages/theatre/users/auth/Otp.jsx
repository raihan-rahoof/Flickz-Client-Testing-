import React from 'react'
import './otp.scss'
import OtpForm from '../../../components/users/OtpForm'

function Otp() {
  return (
    <>
        <div className="otp-page">
      <div className="background-image"></div>
        <div className="otp-form-container">
            <OtpForm/>
        </div>
    </div>
    </>
  )
}

export default Otp