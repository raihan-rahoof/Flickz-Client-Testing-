import React,{useContext, useState} from 'react';
import { Link } from 'react-router-dom';
import './theatreauth.scss'
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import TheatreAuthContext from '../../Context/TheatreAuthContext';

function TheatreLogin() {

        const navigate = useNavigate()
        const {isTheatreLoggedIn, setIsTheatreLoggedIn}=useContext(TheatreAuthContext)
        const [formData, setFormData] = useState({
           email: '',
           password: '',
        })
       
        const handleChange = (e) => {
           setFormData({ ...formData, [e.target.name]: e.target.value });
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            
            if (formData.email.trim() === '' || formData.password.trim() === '') {
              alert('Email and password cannot be empty.');
              return;
            }
            if (!formData.email.includes('@')) {
              alert('Please enter a valid email address.');
              return;
            }
            
            try{
              const res = await axios.post('http://127.0.0.1:8000/api/v1/theatre/theatre-login/',formData)
              const response = res.data

              const theatre = {
                'theatre_name':response.theatre_name,
                'theatre_email':response.email,
                'theatre_id':response.id,
              }

              if(res.status === 200){
                localStorage.setItem("theatre", JSON.stringify(theatre));
                localStorage.setItem("theatre_access", JSON.stringify(response.access_token));
                localStorage.setItem("theatre_refresh", JSON.stringify(response.refresh_token));
                setIsTheatreLoggedIn(true)
                navigate('/theatre/dashboard');
                toast.success('Theatre login successful');
              }else{
                toast.success('Facing some problem.Please try again')
              }
            }catch(error){
              if (error.response) {
                const errorMessage = error.response.data.detail;
                const check_message = "Your account is currently pending review by our administration team. We will update you on Mail with the status of your account approval within one business day. Thank you for your patience."
                if (errorMessage === check_message){
                  Swal.fire({
                  text: errorMessage,
                  imageUrl: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExeW9vd2lhcXVndTVkZHphdTh5NmxjZmR1cXlleHphZmNkZHVzd2J3NyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/HqqUPmqVuo4UgIZ88g/giphy.gif",
                  imageWidth: 400,
                  imageHeight: 300,
                  imageAlt: "Custom image"
                });
                }else{
                  toast.error(errorMessage)
                }
                
              } else if (error.request) {
                toast.error('No response from server. Please try again later.');
              } else {
                console.error('Error', error.message);
              }
            }
            
         };


  return (
    <>
     <div class="flex h-screen w-full items-center justify-center bg-gray-900">
  <div class="w-full max-w-3xl overflow-hidden rounded-lg bg-gray-800 shadow-lg sm:flex">
    <div class="limage m-2 w-full rounded-2xl bg-gray-700 bg-cover bg-center text-white sm:w-2/5" ></div>
    <div class="w-full sm:w-3/5">
      <div class="p-8">
        <h1 class="text-3xl font-black text-white">Login</h1>
        <p class="mt-2 mb-5 text-base leading-tight text-gray-300">Login to start your selling your tickets with flickz and lets grow together.</p>
        <form class="mt-8" onSubmit={handleSubmit}>
          <div class="relative mt-2 w-full">
            <input type="email" name='email' onChange={handleChange} id="email"  class="border-1 peer block w-full appearance-none rounded-lg border border-gray-600 bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-gray-100 focus:border-blue-400 focus:outline-none focus:ring-0" placeholder=" " />
            <label for="email" class="absolute top-2 left-1 z-10 origin-[0] -translate-y-4 scale-75 transform cursor-text select-none bg-gray-800 px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-400"> Enter Your Email </label>
          </div>
          <div class="relative mt-2 w-full">
            <input type="password" name='password' onChange={handleChange} id="password" class="border-1 peer block w-full appearance-none rounded-lg border border-gray-600 bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-gray-100 focus:border-blue-400 focus:outline-none focus:ring-0" placeholder=" " />
            <label for="password" class="absolute top-2 left-1 z-10 origin-[0] -translate-y-4 scale-75 transform cursor-text select-none bg-gray-800 px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-400"> Enter Your Password</label>
          </div>
          <input class="mt-4 w-full cursor-pointer rounded-lg bg-indigo-500 pt-3 pb-3 text-white shadow-lg hover:bg-blue-400" type="submit" value="Login" />
        </form>
        <div class="mt-4 text-center">
          <p class="text-sm text-gray-300">Does'nt have an account? <Link to='/theatre/register' class="font-bold text-blue-400 no-underline hover:text-blue-300">Register</Link></p>
        </div>
      </div>
    </div>
  </div>
</div>


    </>
  );
}

export default TheatreLogin;
