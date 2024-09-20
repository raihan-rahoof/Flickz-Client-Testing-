import React , {useContext, useEffect, useState} from 'react'
import Navbar from '../../components/users/Navbar'
import './Home.scss'
import  AuthContext  from '../../Context/AuthContext';
import { Navigate } from 'react-router-dom';
import RowPost from '../../components/users/RowPost';
import createAxiosInstance from '../../utlis/axiosinstance';


function Home() {
  const {isLoggedIn,setIsLoggedIn} = useContext(AuthContext)
  const [backgroundImage, setBackgroundImage] = useState([]);
  
  useEffect(()=>{
    const fetchBackgroundImage = async () => {
      try {
        const axiosInstance = createAxiosInstance("user");
        const response = await axiosInstance.get(
          "/home/banner"
        );
        setBackgroundImage(response.data[0].image);
        console.log(response.data);
        
      } catch (error) {
        console.log("Error fetching background image:", error);
      }
    };

    fetchBackgroundImage();
  },[])
  return (
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
      <RowPost heading="Latest" />
    </>
  );
}

export default Home