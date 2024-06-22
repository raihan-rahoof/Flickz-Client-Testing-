import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

function OtpForm() {
    const [otp, setOtp]=useState("")
    const navigate=useNavigate()

    const handleOtpSubmit = async (e) => {
        e.preventDefault()
        try {
            if (otp) {
                const res = await axios.post('http://127.0.0.1:8000/api/v1/auth/verify-email/', { 'otp': otp })
                const resp = res.data
                if (res.status === 200) {
                    navigate('/login')
                    toast.success("Verification success , Now Login")
                }
            }else{
                toast.error("Please enter your otp");
            }
        } catch (error) {
            if (error.response) {
                console.log(error.response)
                if (error.response.status === 400) {
                    toast.error(error.response.data.message);
                } 
            } else if (error.request) {
                
                toast.error("No response from server");
            } else {
                
                console.error('Error', error.message);
            }
        }
    }

    return (
        <div className="flex flex-1 flex-col justify-center h-screen items-center space-y-5 max-w-md mx-auto">
            <div className="flex flex-col space-y-2 text-center">
                <h2 className="text-3xl md:text-4xl text-white font-bold">Confirm OTP</h2>
                <p className="text-md text-white md:text-xl">Enter the OTP we just sent you.</p>
            </div>
            <form onSubmit={handleOtpSubmit}>
                <div className="flex flex-col max-w-md space-y-5">
                    <input type="text" name='otp' placeholder="otp" value={otp} onChange={(e) => setOtp(e.target.value)}
                        className="flex px-3 py-2 md:px-4 md:py-3 border-2 border-blue-500 rounded-lg font-medium placeholder:font-normal" />
                    <button type="submit" className="bg-gradient-to-r from-[#427EF5] to-[#274A8F] flex items-center justify-center flex-none px-3 py-2 md:px-4 md:py-3 rounded-lg font-medium text-white">
                        Confirm
                    </button>
                </div>
            </form>
        </div>
    )
}

export default OtpForm
