import React from 'react'
import TheatreNav from './TheatreNav'
import TheatreDashboardStatus from '../../../components/Theatre/TheatreDashboardStatus'

function TheatreDashboard() {
  return (
    <>
    <TheatreNav now={'dashboard'}/>
    <div className="h-screen">
      <TheatreDashboardStatus/>
    </div>


    </>
    
  )
}

export default TheatreDashboard