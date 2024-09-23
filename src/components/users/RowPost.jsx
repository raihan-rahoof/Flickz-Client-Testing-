import React, { useEffect, useState } from 'react'
import '../../pages/users/Home.scss'
import createAxiosInstance from '../../utlis/axiosinstance'
import { Link, useNavigate } from 'react-router-dom'
import { Spinner } from "@nextui-org/spinner";

function RowPost({heading,movies,isloading}) {

    
    const navigate = useNavigate()

    

    const handlePosterClick = (id)=>{
        navigate(`/movie/${id}`)
        console.log(id);
    }
    

  return (
    <>
      <div className="Row">
        <h3>{heading}</h3>
        {isloading ? (
          <div className="posters flex justify-center items-center">
            <Spinner label="Loading..." color="primary"  />
          </div>
        ) : (
          <div className="posters">
            {movies.map((movie) => (
              <img
                className="poster"
                src={movie.poster}
                key={movie.id}
                onClick={() => handlePosterClick(movie.id)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default RowPost