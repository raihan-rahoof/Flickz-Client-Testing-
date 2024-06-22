import React from 'react'
import AdminNav from '../AdminNav'
import TheatreListTable from '../../../components/admin/theatre-section/TheatreListTable'

function TheatreList() {
  return (
    <>
    <AdminNav now={'theatres'}/>
    <TheatreListTable/>
    </>
  )
}

export default TheatreList