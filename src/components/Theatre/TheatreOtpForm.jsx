import React, { useState } from 'react'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'


function TheatreOtpForm() {

  const [otp,setOtp] = useState('')
  const [isLoading,setLoading]= useState(false)
  const navigate = useNavigate()

  const handleOtp = (e)=>{
    setOtp(e.target.value)
  }

  const handleSubmit = async (e)=>{
    e.preventDefault()

    if (!otp){
      toast.error('Enter otp to proceed')
      return 
    }else if(otp.length!=4){
      toast.error('Enter full 4 digits of otp')
      return 
    }

    try {
      if(otp){
        setLoading(true)
        const res = await axios.post('http://127.0.0.1:8000/api/v1/theatre/verify-email/',{"otp":otp})
        const response = res.data

        if(res.status === 200){
          setLoading(false)
          navigate('/theatre/login')
          toast.success('Email verification Successfull')
        }
      }else{
        setLoading(false)
        toast.error('Please provide your OTP')
      }
    } catch (error) {
      setLoading(false)
      toast.error(error.response.data.message)
    }
  }

  return (
    <>
<div class="h-screen bg-gray-900 flex justify-center items-center">
  <div class="max-w-md mx-auto text-center bg-gray-800 px-4 sm:px-8 py-10 rounded-xl shadow-lg">
    <header class="mb-8">
        <h1 class="text-2xl font-bold mb-1 text-white">Email Verification</h1>
        <p class="text-sm text-gray-300">Enter the 4-digit verification code that was sent to your email.</p>
    </header>
    <form id="otp-form" onSubmit={handleSubmit}>
        <div class="flex items-center justify-center gap-3">
            <input
                type="text"
                value={otp}
                onChange={handleOtp}
                class="w-[12rem] h-14 text-center text-2xl font-extrabold text-white bg-gray-700 border border-transparent hover:border-gray-600 appearance-none rounded p-4 outline-none focus:bg-gray-900 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                pattern="\d*" maxlength="4" />
           
        </div>
        <div class="max-w-[260px] mx-auto mt-4">
            <button type="submit"
                class="w-full inline-flex justify-center whitespace-nowrap rounded-lg bg-indigo-500 px-3.5 py-2.5 text-sm font-medium text-white shadow-sm shadow-indigo-950/10 hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-300 focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-300 transition-colors duration-150">Verify
                Account</button>
        </div>
    </form>
    <div class="text-sm text-gray-300 mt-4">Didn't receive code? <a class="font-medium text-indigo-500 hover:text-indigo-600" href="#0">Resend</a></div>
  </div>
</div>

    </>
  )
}

export default TheatreOtpForm