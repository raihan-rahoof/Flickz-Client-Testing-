import React from 'react'
import TheatreScreeAddList from '../../../components/Theatre/TheatreScreeAddList'
import TheatreNav from './TheatreNav'

function TheatreScreens() {
  return (
    <>
    <TheatreNav now="screens"/>
    <div className="">
        <TheatreScreeAddList/>
    </div>
    
    </>
  )
}

export default TheatreScreens