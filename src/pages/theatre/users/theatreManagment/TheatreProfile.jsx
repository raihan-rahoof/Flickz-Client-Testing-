import React from 'react'
import TheatreNav from "./TheatreNav";
import TheatreProfileComponent from '../../../components/Theatre/TheatreProfileComponent';
function TheatreProfile() {
  return (
    <>
    <TheatreNav now='profile'/>
    <TheatreProfileComponent/>
    </>
  )
}

export default TheatreProfile