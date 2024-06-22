import React from 'react'
import AdminNav from '../AdminNav'
import AddMovieForm from '../../../components/admin/AddMovieForm'

function AddMovie() {
  return (
   <>
   <AdminNav now={'movies'}/>
   <AddMovieForm/>
   </>
  )
}

export default AddMovie