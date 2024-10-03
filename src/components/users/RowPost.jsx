import React from 'react'
import {useInView} from 'react-intersection-observer'
import '../../pages/users/Home.scss'
import { Link, useNavigate } from 'react-router-dom'
import { Spinner } from "@nextui-org/spinner";

function RowPost({heading,movies,isloading}) {

    
      const navigate = useNavigate()

    //----lazy loading function-----
      const {ref,inView} = useInView({
        triggerOnce:true,
        threshold:0.1,
      })

    //--------functions--------------
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
            <Spinner label="Loading..." color="primary" />
          </div>
        ) : (
          <div className="posters">
            {movies.map((movie) => (
              <img
                className="poster"
                src={inView ? movie.poster : ""}
                key={movie.id}
                ref={ref}
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