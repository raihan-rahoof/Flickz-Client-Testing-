import React , {useContext, useEffect, useState} from 'react'
import Navbar from '../../components/users/Navbar'
import './Home.scss'
import  AuthContext  from '../../Context/AuthContext';
import { Navigate } from 'react-router-dom';
import RowPost from '../../components/users/RowPost';
import createAxiosInstance from '../../utlis/axiosinstance';
import { Spinner } from '@nextui-org/react';


function Home() {
  const {isLoggedIn,setIsLoggedIn} = useContext(AuthContext)
  const [movies, setMovies] = useState([]);
  const [isloading, setloading] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState([]);
  const axiosInstance = createAxiosInstance('user')

  const fetchMovies = async () => {
    setloading(true);
    try {
      const res = await axiosInstance.get("/home/movies");
      setloading(false);
      setMovies(res.data);
      console.log(res.data);
    } catch (error) {
      setloading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);


  
  
  return (
    <>
    {isloading ? 
    <div className="h-screen flex justify-center items-center">
    <Spinner size='lg' label='Loading...'/>
    </div>
    :
    <>
      <div
        className="home-container"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      >
        <Navbar />
        <div className="home-overlay"></div>
      </div>
      <RowPost heading="Latest" movies={movies} isloading={isloading} />
    </>
      }
    </>
  );
}

export default Home