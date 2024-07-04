import React, { useEffect, useState } from 'react'
import '../../pages/users/Home.scss'
import createAxiosInstance from '../../utlis/axiosinstance'
import { Link, useNavigate } from 'react-router-dom'
import { Spinner } from "@nextui-org/spinner";

function RowPost(props) {

    const [movies , setMovies] = useState([])
    const [isloading,setloading]=useState(false)
    const axiosInstance = createAxiosInstance('admin')
    const navigate = useNavigate()

    const fetchMovies = async ()=>{
        setloading(true)
        try{
            const res = await axiosInstance.get('/home/movies')
            setloading(false)
            setMovies(res.data)
            console.log(res.data);
        }catch(error){
            setloading(false);
            console.log(error)
        }
    }

    useEffect(() => {
      fetchMovies();
    
      
    }, [])

    const handlePosterClick = (id)=>{
        navigate(`/movie/${id}`)
        console.log(id);
    }
    

  return (
    <>
      <div className="Row">
        <h3>{props.heading}</h3>
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