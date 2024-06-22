import React , {useContext} from 'react'
import Navbar from '../../components/users/Navbar'
import './Home.scss'
import  AuthContext  from '../../Context/AuthContext';
import { Navigate } from 'react-router-dom';
import RowPost from '../../components/users/RowPost';


function Home() {
  const {isLoggedIn,setIsLoggedIn} = useContext(AuthContext)
  
  

  return (
    <>
     <div className="home-container">
      <Navbar />
      <div className="home-overlay"></div>
    </div>
    <RowPost heading='Latest'/>
    
    </>
  )
}

export default Home