import React, { useContext, useEffect, useState } from "react";
import Navbar from "../../components/users/Navbar";
import "./Home.scss";
import AuthContext from "../../Context/AuthContext";
import { Navigate } from "react-router-dom";
import RowPost from "../../components/users/RowPost";
import createAxiosInstance from "../../utlis/axiosinstance";
import { Spinner } from "@nextui-org/react";

function Home() {

  //------useStates of Home------------
      const [movies, setMovies] = useState([]);
      const [isLoading, setLoading] = useState(false);
      const [page,setPage] = useState(1)
      const [hasMore,setHasMore] = useState(true)
 
  //-----------axiosInstance for User---------------
      const axiosInstance = createAxiosInstance("user");


  //------------Functions ---------------------------

      //fetch movies for display
        const fetchMovies = async () => {
          setLoading(true);
          try {
            const res = await axiosInstance.get(`/home/movies?page=${page}`);
            setMovies((prevMovies)=> [...prevMovies,res.data.results]);
            setHasMore(res.data.next !== null)
            setLoading(false);
            
            console.log(res.data);
          } catch (error) {
            setLoading(false);
            console.log(error);
          }
        };

        useEffect(() => {
          fetchMovies(page);
        }, [page]);

      //scroll pagination handling
        const handleScroll = ()=>{
          if(window.innerHeight + window.scrollY >= document.body.offsetHeight && hasMore && !isLoading)
            setPage((prevPage)=> prevPage+1)
        }

        useEffect(() => {
          window.addEventListener('scroll',handleScroll)
          return ()=>{
            window.removeEventListener('scroll',handleScroll)
          }
        }, [hasMore,isLoading])
      

      //filtering movies based on genres
        const moviesByGenre = movies.reduce((acc, movie) => {
          if (!acc[movie.genre]) {
            acc[movie.genre] = []; 
          }
          acc[movie.genre].push(movie); 
          return acc;
        }, {});

        const genres = Object.keys(moviesByGenre); 

  return (
    <>
      {isLoading ? (
        <div className="h-screen flex justify-center items-center">
          <Spinner size="lg" label="Loading..." />
        </div>
      ) : (
        <>
          <div
            className="home-container"
            style={{
              backgroundImage: 'url("images/homebg.webp")',
            }}
          >
            <Navbar />
            <div className="home-overlay"></div>
          </div>
          
          {genres.map((genre) => (
            <RowPost
              key={genre}
              heading={genre}
              movies={moviesByGenre[genre]}
              isloading={isLoading}
            />
          ))}
        </>
      )}
    </>
  );
}

export default Home;
