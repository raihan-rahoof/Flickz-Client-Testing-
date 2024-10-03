import React, { useContext, useEffect, useState } from "react";
import Navbar from "../../components/users/Navbar";
import "./Home.scss";
import AuthContext from "../../Context/AuthContext";
import { Navigate } from "react-router-dom";
import RowPost from "../../components/users/RowPost";
import createAxiosInstance from "../../utlis/axiosinstance";
import { Spinner } from "@nextui-org/react";

function Home() {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const [movies, setMovies] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState([]);
  const axiosInstance = createAxiosInstance("user");

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/home/movies");
      setLoading(false);
      setMovies(res.data);
      console.log(res.data);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  // Extract genres and group movies by genre
  const moviesByGenre = movies.reduce((acc, movie) => {
    if (!acc[movie.genre]) {
      acc[movie.genre] = []; // Initialize the genre array if it doesn't exist
    }
    acc[movie.genre].push(movie); // Add the movie to the corresponding genre
    return acc;
  }, {});

  const genres = Object.keys(moviesByGenre); // Get the unique genres

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
