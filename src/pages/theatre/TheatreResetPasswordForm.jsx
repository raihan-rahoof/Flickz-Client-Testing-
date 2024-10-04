import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import createAxiosInstance from '../../utlis/axiosinstance'
import { Button } from '@nextui-org/react'


function TheatreResetPassword() {
    const [email,setEmail] = useState('')
    const axiosInstance = createAxiosInstance('user')
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (email) {
            try {
                const res = await axiosInstance.post("/theatre/password-reset/", { 'email': email });
                toast.success("A link to reset your password has been sent to your email");
            } catch (error) {
                if (error.response && error.response.status === 400) {
                    toast.error(error.response.data.email || 'Cannot find an account with this Email');
                } else {
                    toast.error('Something went wrong');
                }
            } finally {
                setEmail('');
            }
        }else{
            toast.error("plasese provide your email")
        }
    };

    return (
        <div className="flex flex-1 flex-col justify-center h-screen items-center space-y-5 max-w-md mx-auto">
            <div className="flex flex-col space-y-2 text-center">
                <h2 className="text-3xl md:text-4xl text-white font-bold">Reset Password</h2>
                <p className="text-md text-white md:text-xl">Enter the Email of the account to change password.</p>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col max-w-md space-y-5">
                <input
                    type="email" // Corrected type attribute
                    name="email" // Corrected name attribute
                    placeholder="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex px-3 py-2 md:px-4 md:py-3 border-2 border-blue-500 rounded-lg font-medium placeholder:font-normal"
                    />

                   <Button size='lg' color='secondary' type='submit'>Confirm</Button>
                </div>
            </form>
        </div>
    )
}

export default TheatreResetPassword
