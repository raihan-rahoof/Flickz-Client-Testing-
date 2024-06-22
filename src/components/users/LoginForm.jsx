import axios from 'axios'
import React,{useState,useEffect,useContext} from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast';
import { BeatLoader } from 'react-spinners';
import Swal from 'sweetalert2';
import AuthContext from '../../Context/AuthContext';


function LoginForm() {

  const [loginData,setLoginData]= useState({
    "email":'',
    "password":'',
  })

  const {isLoggedIn,setIsLoggedIn} = useContext(AuthContext)

  console.log(isLoggedIn)  

  const navigate = useNavigate()
  const [isLoading,setLoading] = useState(false)

  const handleSigninWithGoogle = async (response)=>{
    const payload=response.credential

    try {
      const server_res= await axios.post("http://localhost:8000/api/v1/auth/google/", {'access_token':payload})
      console.log(server_res.data)
      
      const user = {
        'email': server_res.data.email,
        "name": server_res.data.name,
        'user_id':server_res.data.user_id
      }

      if (server_res.status === 200) {
        setLoading(false);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("access", JSON.stringify(server_res.data.access_token));
        localStorage.setItem("refresh", JSON.stringify(server_res.data.refresh_token));
        navigate('/');
        toast.success('Login successful');
        setIsLoggedIn(true)
        
        
      }
    } catch (error) {
      setLoading(false);
      if (error.response) {
        const errorMessage = error.response.data.detail;
        
        toast.error(errorMessage);
      } else if (error.request) {
        toast.error('No response from server. Please try again later.');
      } else {
        console.error('Error', error.message);
      }
    }


    
}
  
  useEffect(() => {
    
   google.accounts.id.initialize({
    client_id:"528891910545-hv0arfk0uaesa7tuiklimhehoea3q459.apps.googleusercontent.com",
    callback:handleSigninWithGoogle
   })

   google.accounts.id.renderButton(
    document.getElementById("signInDiv"),
    {theme:"filled",  text:"continue_with", shape:"circle", width:"200", borderRadius: "20px"}
  );

  if(isLoggedIn){
    navigate('/')
  }

  }, [])
  

 

  const HandleOnChange =  (e)=>{
    setLoginData({...loginData,[e.target.name]:e.target.value})
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!loginData.email || !loginData.password) {
      toast.error('Please fill all fields');
    } else {
      setLoading(true);
      try {
        const res = await axios.post('http://127.0.0.1:8000/api/v1/auth/login/', loginData);
        const response = res.data;
        
        const user = {
        'email': response.email,
        "name": response.name,
        'user_id':response.user_id
      }
  
        if (res.status === 200) {
          setLoading(false);
          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("access", JSON.stringify(response.access_token));
          localStorage.setItem("refresh", JSON.stringify(response.refresh_token));
          navigate('/');
          toast.success('Login successful');
          setIsLoggedIn(true)
          
        }
      } catch (error) {
        setLoading(false);
        if (error.response) {
          const errorMessage = error.response.data.detail;
          Swal.fire({
            text:errorMessage,
            imageUrl:"https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdm15c3p6cmxvdm5qa25uM3FxMXV2Y2N5cHM0ZXh2aWtvbWgya3BxeiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/fwDprKZ2a3dqUwvEtK/giphy.gif",
            imageWidth: 300,
            imageHeight: 200,
          })
        } else if (error.request) {
          toast.error('No response from server. Please try again later.');
        } else {
          console.error('Error', error.message);
        }
      }
    }
  }
  




  return (
    <>
   <div className=" flex justify-center items-center">
    <div className="grid gap-8">
      <div
        id="back-div"
        className="bg-gradient-to-r from-[#427EF5] to-[#274A8F] rounded-[26px] m-4"
      >
        <div
          className="border-[20px] border-transparent rounded-[20px] dark:bg-gray-900 bg-white shadow-lg xl:p-5 2xl:p-5 lg:p-5 md:p-5 sm:p-1 m-1"
        >
          <h1 className="pt-8 pb-6 font-semibold dark:text-gray-400 text-4xl text-center cursor-default">
            Log in
          </h1>
          <form onSubmit={handleSubmit} method="post" className="space-y-4">
            <div>
              <label for="email" className="mb-2  dark:text-gray-400 text-lg">Email</label>
              <input
                id="email"
                name='email'
                value={loginData.email}
                onChange={HandleOnChange}
                autoComplete="off" 
                className="border p-3 bg-[#7b6e6e33] dark:text-gray-300  dark:border-gray-700 shadow-md placeholder:text-base focus:scale-105 ease-in-out duration-300 border-gray-300 rounded-lg w-full"
                type="email"
                required
                
              />
            </div>
            <div>
              <label for="password" className="mb-2 dark:text-gray-400 text-lg">Password</label>
              <input
                id="password"
                name='password'
                value = {loginData.password}
                onChange={HandleOnChange}
                autoComplete="off" 
                className="border p-3 shadow-md bg-[#7b6e6e33] dark:text-gray-300  dark:border-gray-700 placeholder:text-base focus:scale-105 ease-in-out duration-300 border-gray-300 rounded-lg w-full"
                type="password"
                
                required
                
              />
            </div>
            <a
              className="group text-blue-400 transition-all duration-100 ease-in-out"
              href="#"
            >
              <Link to='/reset-password'
                className="bg-left-bottom bg-gradient-to-r text-sm from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out"
              >
                Forget your password?
              </Link>
            </a>
            <button
              className="bg-gradient-to-r dark:text-gray-300 from-blue-500 to-[#274A8F] shadow-lg mt-6 p-2 text-white rounded-lg w-full hover:scale-105 hover:from-purple-500 hover:to-blue-500 transition duration-300 ease-in-out"
              type="submit"
            >
             { isLoading ?  <BeatLoader color="#ffffff" cssOverride={{position: 'relative', top: '5px' }}/>: "LOG IN"}
            </button>
          </form>
          <div className="flex flex-col mt-4 items-center justify-center text-sm">
            <h3 className="dark:text-gray-300">
              Don't have an account?
              <a
                className="group text-blue-400 transition-all duration-100 ease-in-out"
                href="#"
              >
             <Link to='/register'
                  className={`bg-left-bottom bg-gradient-to-r from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out`}
              >
                  Sign Up
              </Link>

              </a>
            </h3>
          </div>
          <div className="py-3 flex items-center text-sm text-gray-800 before:flex-1 before:border-t before:border-gray-200 before:me-6 after:flex-1 after:border-t after:border-gray-200 after:ms-6 dark:text-white dark:before:border-neutral-600 dark:after:border-neutral-600">Or </div>
          <div className="googleContainer" >
              <div className="gsignIn" id='signInDiv'>
                
              </div>
          </div>

          {/* <div
            className="text-gray-500 flex text-center flex-col mt-4 items-center text-sm"
          >
            <p className="cursor-default">
              By signing in, you agree to our
              <a
                className="group text-blue-400 transition-all duration-100 ease-in-out"
                href="#"
              >
                <span
                  className="cursor-pointer bg-left-bottom bg-gradient-to-r from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out"
                >
                  Terms
                </span>
              </a>
              and
              <a
                className="group text-blue-400 transition-all duration-100 ease-in-out"
                href="#"
              >
                <span
                  className="cursor-pointer bg-left-bottom bg-gradient-to-r from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out"
                >
                  Privacy Policy
                </span>
              </a>
            </p>
          </div> */}
        </div>
      </div>
      </div>
    </div>
    </>
  )
}

export default LoginForm