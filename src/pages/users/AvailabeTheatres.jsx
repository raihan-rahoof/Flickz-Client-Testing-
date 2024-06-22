import React from 'react'
import Navbar from '../../components/users/Navbar'
import TheatreShowsList from '../../components/users/movie-details/TheatreShowsList'
import { useParams } from 'react-router-dom'


function AvailabeTheatres() {
const {id}=useParams()
  return (
    <>
    <Navbar/>
    <TheatreShowsList movie_id={id}/>
    </>
   
  )
}

export default AvailabeTheatres