import React ,{useState}from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './theatreauth.scss'

function TheatreRegister() {

  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    theatre_name: '',
    owner_name: '',
    email: '',
    phone_number: '',
    password: '',
    confirm_password: '',
    address: '',
    state: '',
    district: '',
    city: '',
    pincode: '',
    license:null,
    google_maps_link: '',
 });

 const [isLoading,setLoading] = useState(false)

 const handleChange = (e) => {
  if(e.target.name == 'license'){
    setFormData({...formData,[e.target.name]:e.target.files[0]})
  }else{
  setFormData({ ...formData, [e.target.name]: e.target.value });
  }
};

console.log(formData);

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/.test(formData.password)){
    toast.error("Provide a strong password ")
    return
  }

  
  if (formData.password !== formData.confirm_password) {
    toast.error("Passwords do not match.");
    return;
  }

  if (!/^(?:\+91|0)?[789]\d{9}$/.test(formData.phone_number)) {
    toast.error("Invalid mobile number. It should be 10 digits.");
    return;
  }

  if (!/^\d{6}$/.test(formData.pincode)) {
    toast.error("Invalid pincode. It should be 6 digits.");
    return;
  }

  if (!formData.license){
    toast.error('Provide your Theatre license');
    return ;
  }

  const data = new FormData();
  for (const key in formData) {
    data.append(key, formData[key]);
  }
  
  try {
    setLoading(true)
    const response = await axios.post('http://127.0.0.1:8000/api/v1/theatre/register/', data,{
      headers:{
        "Content-Type":'multipart/form-data',
      }
    });

    if (response.status == 201){
      setLoading(false)
      navigate('/theatre/verify-email')
      toast.success("A verification code has sent to your mail please enter it Here")
    }

  } catch (error) {
    setLoading(false)
    console.log(error);
    if (error.response) {
     
      toast.error(error.response.data.detail || "An error occurred.please try again");
    } else if (error.request) {
      
      toast.error("No response from server.");
    } else {
     
      toast.error("An error occurred.please try after some time");
    }
  }
};


  return (
   <>

    <div class="flex-col dark md:flex justify-center items-center h-auto">
      
  <form onSubmit={handleSubmit} class="relative top-[3rem] border border-gray-700 space-y-3 max-w-screen-md mx-auto rounded-md bg-gray-800 p-6 shadow-xl lg:p-10">
    <h1 class="mb-6 text-xl font-semibold lg:text-2xl text-white">Register your Theatre</h1>

    <div class="grid gap-3 md:grid-cols-2">
      <div> 
        <label class="text-white"> Theatre Name </label>
        <input required type="text" placeholder="Theatre name" name='theatre_name' onChange={handleChange}  class="mt-2 h-12 w-full rounded-md bg-gray-700 px-3 text-white" />
      </div>
      <div>
        <label class="text-white"> Owner Name </label>
        <input required type="text" placeholder="Owner Name" name='owner_name' onChange={handleChange} class="mt-2 h-12 w-full rounded-md bg-gray-700 px-3 text-white" />
      </div>
    </div>
    <div class="grid gap-3 md:grid-cols-2">
      <div> 
        <label class="text-white"> Email </label>
        <input required type="email" placeholder="info@example.com" name='email' onChange={handleChange}  class="mt-2 h-12 w-full rounded-md bg-gray-700 px-3 text-white" />
      </div>
      <div>
        <label class="text-white"> Phone </label>
        <input required type="number" placeholder="+91 xxx xxx xx xx" name='phone_number' onChange={handleChange} class="mt-2 h-12 w-full rounded-md bg-gray-700 px-3 text-white" />
      </div>
    </div>

    <div class="grid gap-3 md:grid-cols-2">
      <div>
         <label class="text-white"> Theatre Address </label>
        <textarea required type="text" name='address' onChange={handleChange} class="mt-2 h-12 w-full rounded-md bg-gray-700 px-3 text-white" />
      </div>
      <div>
       <label class="text-white">License</label>
       <input type="file" name='license' onChange={handleChange}
        class="w-full text-gray-500 mt-2 font-medium text-base bg-gray-700 file:cursor-pointer cursor-pointer file:border-0 file:py-2.5 file:px-4 file:mr-4 file:bg-gray-500 file:hover:bg-gray-700 file:text-white rounded" />

      </div>
    </div>

    <div class="grid gap-3 md:grid-cols-2">
      <div> 
        <label class="text-white"> State </label>
        <input required type="text" placeholder="eg.Kerala" name='state' onChange={handleChange}  class="mt-2 h-12 w-full rounded-md bg-gray-700 px-3 text-white" />
      </div>
      <div>
        <label class="text-white"> District </label>
        <input required type="text" placeholder="eg.Kannur" name='district' onChange={handleChange} class="mt-2 h-12 w-full rounded-md bg-gray-700 px-3 text-white" />
      </div>
    </div>

    <div class="grid gap-3 md:grid-cols-2">
      <div> 
        <label class="text-white"> City </label>
        <input required type="text" placeholder="eg.Thalassery" name='city' onChange={handleChange}  class="mt-2 h-12 w-full rounded-md bg-gray-700 px-3 text-white" />
      </div>
      <div>
        <label class="text-white"> Pincode </label>
        <input required type="number" placeholder="xxxxxx" name='pincode' onChange={handleChange} class="mt-2 h-12 w-full rounded-md bg-gray-700 px-3 text-white" />
      </div>
    </div>

    <div>
      <label class="text-white"> Google map link </label>
      <input required type="url" placeholder="https://example.com" name='google_maps_link' onChange={handleChange} class="mt-2 h-12 w-full rounded-md bg-gray-700 px-3 text-white" />
    </div>

    <div class="grid gap-3 md:grid-cols-2">
      <div> 
        <label class="text-white"> Password </label>
        <input required type="password" placeholder="********" name='password' onChange={handleChange}  class="mt-2 h-12 w-full rounded-md bg-gray-700 px-3 text-white" />
      </div>
      <div>
        <label class="text-white"> Confirm Password </label>
        <input required type="password" placeholder="********" name='confirm_password' onChange={handleChange} class="mt-2 h-12 w-full rounded-md bg-gray-700 px-3 text-white" />
      </div>
    </div>


    {/* <div class="grid gap-3 lg:grid-cols-2">
      <div>
        <label class="text-white"> Gender </label>
        <div class="relative w-56 mt-2 bg-gray-700 rounded-lg">
          <input class="peer hidden" type="checkbox" name="select-1" id="select-1" />
          <label for="select-1" class="flex w-full cursor-pointer rounded-lg select-none border p-2 px-3 text-sm text-white ring-blue-400 peer-checked:ring">Select Option </label>
          <svg xmlns="http://www.w3.org/2000/svg" class="pointer-events-none absolute right-5 top-3 h-4 text-white transition peer-checked:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
          <ul class="max-h-0 select-none flex-col overflow-hidden rounded-b-lg shadow-md transition-all duration-300 peer-checked:max-h-56 peer-checked:py-3">
            <li class="cursor-pointer px-3 py-2 text-sm text-white hover:bg-blue-500 hover:text-white">Male</li>
            <li class="cursor-pointer px-3 py-2 text-sm text-white hover:bg-blue-500 hover:text-white">Female</li>
            <li class="cursor-pointer px-3 py-2 text-sm text-white hover:bg-blue-500 hover:text-white">Other</li>
          </ul>
        </div>
      </div>
      <div>
        <label class="text-white"> Phone: <span class="text-sm text-gray-400">(optional)</span> </label>
        <input type="text" placeholder="+543 5445 0543" class="mt-2 h-12 w-full rounded-md bg-gray-700 px-3 text-white" />
      </div>
    </div> */}

    

    <div>
      {isLoading ? <button type="submit" class="mt-5 w-full rounded-md bg-indigo-500 p-2 text-center font-semibold text-white">
        <div class="animate-spin inline-block size-7 border-[3px] border-current border-t-transparent text-white rounded-full " role="status" aria-label="loading">
          <span class="sr-only">Loading...</span>
        </div>
        </button> :
      <button type="submit" class="mt-5 w-full rounded-md bg-indigo-500 p-2 text-center font-semibold text-white">Register</button>}
    </div>
  </form>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#6366f1" fill-opacity="1" d="M0,32L120,74.7C240,117,480,203,720,208C960,213,1200,139,1320,101.3L1440,64L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z"></path></svg>
</div>

</>
  );
}

export default TheatreRegister;
