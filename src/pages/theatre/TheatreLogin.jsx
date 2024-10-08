import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import './theatreauth.scss';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import TheatreAuthContext from '../../Context/TheatreAuthContext';

function TheatreLogin() {
  const navigate = useNavigate();
  const { isTheatreLoggedIn, setIsTheatreLoggedIn } = useContext(TheatreAuthContext);
  const [isLoading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

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
      setLoading(true);
      try {
        const res = await axios.post(
          "https://flickz-backend.duckdns.org/api/v1/theatre/theatre-login/",
          formData
        );
        
        console.log('Full Response:', res);

        
        const response = res.data;
        console.log('Response data:', response);

       
        if (!response || typeof response !== 'object' || !response.email || !response.access_token || !response.refresh_token) {
          throw new Error('Invalid response from server');
        }

        const theatre = {
          theatre_name: response.theatre_name,
          theatre_email: response.email,
          theatre_id: response.id,
        };

        if (res.status === 200) {
          setLoading(false);
          localStorage.setItem('theatre', JSON.stringify(theatre));
          localStorage.setItem("theatre_access", JSON.stringify(response.access_token));
          localStorage.setItem("theatre_refresh", JSON.stringify(response.refresh_token));
          setIsTheatreLoggedIn(true);
          navigate('/theatre/shows');
          toast.success('Theatre login successful');
        } else {
          setLoading(false);
          toast.error('Facing some problem. Please try again');
        }
      } catch (error) {
        setLoading(false);
        console.error('Error:', error);

        if (error.response) {
          const errorMessage = error.response.data.detail;
          const check_message =
            'Your account is currently pending review by our administration team. We will update you on Mail with the status of your account approval within one business day. Thank you for your patience.';
          if (errorMessage === check_message) {
            Swal.fire({
              text: errorMessage,
              imageUrl:
                'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExeW9vd2lhcXVndTVkZHphdTh5NmxjZmR1cXlleHphZmNkZHVzd2J3NyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/HqqUPmqVuo4UgIZ88g/giphy.gif',
              imageWidth: 400,
              imageHeight: 300,
              imageAlt: 'Custom image',
            });
          } else {
            toast.error(errorMessage);
          }
        } else if (error.request) {
          toast.error('No response from server. Please try again later.');
        } else {
          toast.error('An unexpected error occurred. Please try again.');
        }
      }
};

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-900">
      <div className="w-full max-w-3xl overflow-hidden rounded-lg bg-gray-800 shadow-lg sm:flex">
        <div className="limage m-2 w-full rounded-2xl bg-gray-700 bg-cover bg-center text-white sm:w-2/5"></div>
        <div className="w-full sm:w-3/5">
          <div className="p-8">
            <h1 className="text-3xl font-black text-white">Login</h1>
            <p className="mt-2 mb-5 text-base leading-tight text-gray-300">
              Login to start your selling your tickets with flickz and lets grow together.
            </p>
            <form className="mt-8" onSubmit={handleSubmit}>
              <div className="relative mt-2 w-full">
                <input
                  type="email"
                  name="email"
                  onChange={handleChange}
                  id="email"
                  className="border-1 peer block w-full appearance-none rounded-lg  border-gray-600 bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-gray-100 focus:border-blue-400 focus:outline-none focus:ring-0"
                  placeholder=" "
                />
                <label
                  htmlFor="email"
                  className="absolute top-2 left-1 z-10 origin-[0] -translate-y-4 scale-75 transform cursor-text select-none bg-gray-800 px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-400"
                >
                  Enter Your Email
                </label>
              </div>
              <div className="relative mt-2 w-full">
                <input
                  type="password"
                  name="password"
                  onChange={handleChange}
                  id="password"
                  className="border-1 peer block w-full appearance-none rounded-lg  border-gray-600 bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-gray-100 focus:border-blue-400 focus:outline-none focus:ring-0"
                  placeholder=" "
                />
                <label
                  htmlFor="password"
                  className="absolute top-2 left-1 z-10 origin-[0] -translate-y-4 scale-75 transform cursor-text select-none bg-gray-800 px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-400"
                >
                  Enter Your Password
                </label>
                <a
                    className="group text-blue-400 transition-all duration-100 ease-in-out"
                    href="#"
                  >
                    <Link to='/theatre/reset-password'
                      className="bg-left-bottom bg-gradient-to-r text-xs from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out"
                    >
                      Forget your password?
                    </Link>
            </a>
              </div>
              {isLoading ? (
                <input
                  disabled
                  className="mt-4 w-full cursor-pointer rounded-lg bg-indigo-500 pt-3 pb-3 text-white shadow-lg hover:bg-blue-400"
                  type="submit"
                  value="Loading...."
                />
              ) : (
                <input
                  className="mt-4 w-full cursor-pointer rounded-lg bg-indigo-500 pt-3 pb-3 text-white shadow-lg hover:bg-blue-400"
                  type="submit"
                  value="Login"
                />
              )}
            </form>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-300">
                Doesn't have an account?{' '}
                <Link to="/theatre/register" disabled={isLoading} className="font-bold text-blue-400 no-underline hover:text-blue-300">
                  Register
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TheatreLogin;
