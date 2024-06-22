import React from 'react'
import AdminNav from '../AdminNav'
import MoviesList from '../../../components/admin/MoviesList'

function Movie() {
  return (
    <>
    <AdminNav now={'movies'}/>
    <MoviesList/>
    </>
  )
}

export default Movie