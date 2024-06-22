import React from 'react';
import { Link } from 'react-router-dom';
import { useState,useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BeatLoader } from 'react-spinners';
import '../../pages/users/auth/register.scss'
import Swal from 'sweetalert2';




function RegisterForm() {
  const navigate = useNavigate()
  const [form,setform] = useState(
    {
      email:"",
      phone:"",
      first_name:"",
      last_name:"",
      password:"",
      password2:"",

    }
  )

 

  const handleOnChange =  (e)=>{
    setform({...form,[e.target.name]:e.target.value})
  }

  const {email,phone,first_name,last_name,password,password2} = form

  const [isLoading,setLoading] = useState(false)

  function isValidIndianPhoneNumber(phoneNumber) {
    const pattern = /^(?:\+91|0)?[789]\d{9}$/;
    return pattern.test(phoneNumber);
   }
  
   function isValidPassword(password) {
    const pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/;
    return pattern.test(password);
   }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !first_name || !last_name || !phone || !password || !password2) {
      toast.error("All details should be filled");
    }else if(!isValidPassword(password)){
      Swal.fire({
        text:"Password length should be 8 and must contain a upper&lowcase Letter also add numbers",
        imageUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExN21qYWh5aWd1bHFvMWx1cnU4dzRjMDZvazU4ZHg5a2lza2g4MjBnNiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Y02ORR28LCZzvbxD3z/giphy.gif",
        imageWidth: 400,
        imageHeight: 200,
      })
    }else if (password !== password2) {
      toast.error("Passwords do not match");
    }else if(!isValidIndianPhoneNumber(phone)){
      toast.error("Provide a valid Phone Number")
    } else {
      setLoading(true)
      axios.post('http://127.0.0.1:8000/api/v1/auth/register/', form)
        .then((res) => {
          const response = res.data;
          
          console.log(response);
          if (res.status === 201) {
            setLoading(false)
            navigate('/register/otp');
            toast.success(response.message);
          }
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status === 400) {
              const errorData = error.response.data;
              setLoading(false)
              for (const key in errorData) {
                if (errorData.hasOwnProperty(key)) {
                  const errorMessage = errorData[key][0];
                  toast.error(errorMessage);
                }
              }
            } else {
              toast.error("Server Error");
              setLoading(false)
            }
          } else if (error.request) {
            toast.error("No response from server");
            setLoading(false)
          } else {
            console.error('Error', error.message);
            setLoading(false)
          }
        });
    }
  };
  

  return (

    <>
    
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md px-8 py-6 flex flex-col items-center">
      <h1 className="text-xl font-bold text-center text-gray-700 dark:text-gray-200 mb-4">Register</h1>
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-2">
        <div className="flex items-start flex-col justify-start">
          <label htmlFor="firstName" className="text-sm text-gray-700 dark:text-gray-200 mr-2">First Name:</label>
          <input type="text" id="firstName" name="first_name" onChange={handleOnChange} value={first_name}  className="w-full px-3 dark:text-gray-200 dark:bg-gray-900 py-2 rounded-md border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"/>
        </div>

        <div className="flex items-start flex-col justify-start">
          <label htmlFor="lastName" className="text-sm text-gray-700 dark:text-gray-200 mr-2">Last Name:</label>
          <input type="text" id="lastName" name="last_name" value={last_name} onChange={handleOnChange} className="w-full px-3 dark:text-gray-200 dark:bg-gray-900 py-2 rounded-md border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"/>
        </div>

        <div className="flex items-start flex-col justify-start">
          <label htmlFor="username" className="text-sm text-gray-700 dark:text-gray-200 mr-2">Phone:</label>
          <input type="number" inputMode="numeric" id="phone" name="phone" value={phone} onChange={handleOnChange} className="w-full px-3 dark:text-gray-200 dark:bg-gray-900 py-2 rounded-md border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"/>
        </div>

        <div className="flex items-start flex-col justify-start">
          <label htmlFor="email" className="text-sm text-gray-700 dark:text-gray-200 mr-2">Email:</label>
          <input type="email" autoComplete="off" id="email" name="email" onChange={handleOnChange} value={email} className="w-full px-3 dark:text-gray-200 dark:bg-gray-900 py-2 rounded-md border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"/>
        </div>

        <div className="flex items-start flex-col justify-start">
          <label htmlFor="password" className="text-sm text-gray-700 dark:text-gray-200 mr-2">Password:</label>
          <input type="password" autoComplete="off" id="password" name="password" onChange={handleOnChange} value={password} className="w-full px-3 dark:text-gray-200 dark:bg-gray-900 py-2 rounded-md border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"/>
        </div>

        <div className="flex items-start flex-col justify-start">
          <label htmlFor="confirmPassword" className="text-sm text-gray-700 dark:text-gray-200 mr-2">Confirm Password:</label>
          <input type="password" id="confirmPassword" name="password2" onChange={handleOnChange} value={password2} className="w-full px-3 dark:text-gray-200 dark:bg-gray-900 py-2 rounded-md border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"/>
        </div>

        <button type="submit" className="bg-gradient-to-r from-[#427EF5] to-[#274A8F] text-white mt-4 font-medium py-2 px-4 rounded-md shadow-sm">{isLoading ? 
       <BeatLoader
       color="#ffffff"
       cssOverride={{
         position: 'relative',
         top: '5px'
       }}
     />
        :"Register"}</button>
      </form>

      <div className="mt-2 text-center">
        <span className="text-sm text-gray-500 dark:text-gray-300">Already have an account? </span>
        <Link to="/login" className="text-blue-500 hover:text-blue-600">Login</Link>
      </div>
     
    </div>
    
    </>
  );
}

export default RegisterForm;
