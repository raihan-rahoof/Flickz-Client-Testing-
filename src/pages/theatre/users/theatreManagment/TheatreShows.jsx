import React from 'react'
import TheatreNav from './TheatreNav'
import TheatreShowCards from '../../../components/Theatre/TheatreShowCards'

function TheatreShows() {
  return (
   <>
   <TheatreNav now="Shows"/>
   <TheatreShowCards/>
   </>
  )
}

export default TheatreShows