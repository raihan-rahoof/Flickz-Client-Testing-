import React,{useState,useContext} from 'react'
import { useNavigate } from 'react-router-dom'
import createAxiosInstance from '../../../utlis/axiosinstance'
import { toast } from 'react-hot-toast'
import AdminAuthContext from '../../../Context/AdminAuthContext'


function AdminLogin() {

    const navigate = useNavigate()
    const axiosInstance = createAxiosInstance('admin')
    const {isAdminLoggedIn , setIsAdminLoggedIn} = useContext(AdminAuthContext)
    const [loginData , setLogin] = useState({
        'email':'',
        'password':''
    })

    const handleChange = (e) =>{
        setLogin({...loginData , [e.target.name]:e.target.value})
    }

    console.log(loginData)

    

    const handleSubmit = async (e) =>{
      e.preventDefault()
      if (!loginData.email || !loginData.password){
        toast.error('all fields are required')
      }else{
      try{
         const res = await axiosInstance.post('/cadmin/admin/token',loginData)
         const response = res.data
         console.log(res);

         const admin = {
          'email': response.email,
          "name": response.name,
          }
          
          if(res.status == 200){
          localStorage.setItem("admin", JSON.stringify(admin));
          localStorage.setItem("admin_access", JSON.stringify(response.access_token));
          localStorage.setItem("admin_refresh", JSON.stringify(response.refresh_token));
          navigate('/admin/user-list')
          toast.success('Login successful');
          setIsAdminLoggedIn(true)
          }
      }catch(error){
        if (error.response) {
         
          if (error.response.status === 400) {
          
            toast.error('Invalid email or password. Please try again.');
          } else {
            toast.error('An error occurred. Please try again later.');
          }
        } else if (error.request) {
          
          toast.error('No response received from the server. Please try again later.');
        } else {
          
          toast.error('An error occurred. Please try again later.');
        }
      }
    }
  }



  return (
    <div className="min-h-screen flex justify-center items-center bg-[#1b1c31]">
  <div class="p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
    <h1 class="font-bold text-center text-2xl mb-5 dark:text-white" >FLICKZ ADMIN </h1>
    <div class="bg-white shadow w-full rounded-lg divide-y divide-gray-200">
      <div class="px-5 py-7">
        <form onSubmit={handleSubmit}>
        <label class="font-semibold text-sm text-gray-600 pb-1 block">E-mail</label>
        <input type="email" name='email'  value={loginData.email} onChange={handleChange} class="text-black bg-slate-300 border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full" />
        <label class="font-semibold text-sm text-gray-600 pb-1 block">Password</label>
        <input type="password" name='password' value={loginData.password} onChange={handleChange} class=" text-black bg-slate-300 border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full" />
        <button type="submit" class="transition duration-200 bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block">
            <span class="inline-block mr-2">Login</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-4 h-4 inline-block">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
        </button>
        </form>
      </div>
     
    </div>
    
  </div>
  </div>
  )
}

export default AdminLogin