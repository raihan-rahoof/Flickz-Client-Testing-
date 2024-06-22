import React, { useState, useEffect } from 'react';
import './Moviedetails.scss';
import { useParams } from 'react-router-dom';
import createAxiosInstance from '../../utlis/axiosinstance';
import MoiveInfo from '../../components/users/movie-details/MovieInfo';
import axios from 'axios';
import YouTube from 'react-youtube';

function MoveDetails() {
  const apiKey = '1e8ca15750c58626a3d6735c10534c73';
  const baseUrl = 'https://api.themoviedb.org/3';
  const imgUrl = 'https://image.tmdb.org/t/p/original';
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const axiosInstance = createAxiosInstance('user');
  const [details, setDetails] = useState({});
  const [cast, setCast] = useState([]);
  const [showTrailer, setShowTrailer] = useState(false);

  const fetchMovieDetail = async () => {
    try {
      const res = await axiosInstance.get(`/home/movie/${id}/`);
      setMovie(res.data);
    } catch (error) {
      console.error('Error fetching movie details:', error);
    }
  };

  const fetchRelatedDeatails = async () => {
    try {
      const res = await axios.get(`${baseUrl}/search/movie?api_key=${apiKey}&query=${movie.title}`);
      const response = res.data.results;
      if (response.length > 0) {
        setDetails(response[0]);
      } else {
        console.log('no movie found');
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMovieDetail();
  }, [id]);

  useEffect(() => {
    if (movie) {
      fetchRelatedDeatails();
    }
  }, [movie]);

  useEffect(() => {
    if (details.id) {
      axios
        .get(`${baseUrl}/movie/${details.id}/credits?api_key=${apiKey}`)
        .then(response => {
          setCast(response.data.cast);
        })
        .catch(error => {
          console.error('Error fetching cast details:', error);
        });
    }
  }, [details]);

  const toggleTrailer = () => {
    setShowTrailer(!showTrailer);
  };

  const getYoutubeId = (url) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };
    
    
  if (!movie) {
    return <div>Loading...</div>;
  }

  const videoId = getYoutubeId(movie.trailer_link);

  const opts = {
        height: '100%',
        width: '100%',
        playerVars: {
          autoplay: 1,
          controls: 0,
          modestbranding: 0,
          cc_load_policy: 0,
          disablekb: 0,
          iv_load_policy: 3,
          fs: 0,
          rel: 0, 
          showinfo: 0,
          loop: 1,
          playlist: videoId,
        },
      };


  return (
    <>
      {showTrailer && videoId ? (
        <>
          <YouTube className="cover-container" videoId={videoId} opts={opts} />
          <div className="cover-overlay"></div>
        </>
      ) : (
        <div className="cover-container" style={{ backgroundImage: `url(${movie.cover_image})` }}>
          <div className="cover-overlay"></div>
        </div>
      )}

      <MoiveInfo
        flim={movie}
        details={details}
        cast={cast}
        url={imgUrl}
        showTrailer={showTrailer}
        toggleTrailer={toggleTrailer}
      />
    </>
  );
}

export default MoveDetails;
