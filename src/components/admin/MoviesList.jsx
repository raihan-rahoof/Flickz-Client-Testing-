import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import createAxiosInstance from '../../utlis/axiosinstance';
import toast from 'react-hot-toast';
import {
  Modal,
  Image,
  Input,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Textarea,
  Spinner,
  Pagination,
} from "@nextui-org/react";
import Swal from 'sweetalert2';
import YouTube from 'react-youtube';
import { FileUploaderRegular } from '@uploadcare/react-uploader';


function MoviesList() {
    const [movies, setMovies] = useState([]);
    const [loading,setLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1);  
    const [totalPages, setTotalPages] = useState(1);
    const axiosInstance = createAxiosInstance('admin');
    const [selectedMovie, setMovie] = useState(null);
    const [newPoster, setNewPoster] = useState(null);
    const [newCover,setNewCover] = useState(null)
    const [originalMovie, setOriginalMovie] = useState(null);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const {isOpen: isYoutubeOpen , onOpen:OnYoutubeOpen , onOpenChange:onYoutubeOpenChange} = useDisclosure()
    const [videoId, setVideoId] = useState(null);


    

    const fetchMovies = async (page=1) => {
        try {
            setLoading(true)
            const response = await axiosInstance.get(`cadmin/admin/add-movies/?page=${page}`);
            setMovies(response.data.results);
            setTotalPages(Math.ceil(response.data.count / 5));
            setLoading(false);
        } catch (error) {
            setLoading(false);
            toast.error('Failed to fetch movies, please refresh the page.');
        }
    };

    useEffect(() => {
      fetchMovies(currentPage);
    }, [currentPage]);

    const handlePageChange = (page) => {
      setCurrentPage(page); 
    };

    const handlePosterChange = (files) => {
      const successFile = files.allEntries.find((f) => f.status === "success");
      if (successFile) {
        const cdnUrl = successFile.cdnUrl;
        setNewPoster(cdnUrl)
        setPreviewImage(cdnUrl); 
      }
    };
  
    
    const handleCoverChange = (files) => {
      const successfulFile = files.allEntries.find((f) => f.status === "success");
      if (successfulFile) {
        const cdnUrl = successfulFile.cdnUrl;
        setNewCover(cdnUrl)
        setCoverPreview(cdnUrl); 
      }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setMovie((prevMovie) => ({
            ...prevMovie,
            [name]: value,
        }));
    };

    const handleUpdate = async () => {
        
        const changes = newPoster || newCover || Object.keys(selectedMovie).some(key => selectedMovie[key] !== originalMovie[key]);

        if (!changes) {
            toast('No changes to update');
            return;
        }

        const formData = new FormData();
        formData.append('title', selectedMovie.title);
        formData.append('language', selectedMovie.language);
        formData.append('genre', selectedMovie.genre);
        formData.append('duration', selectedMovie.duration);
        formData.append('release_date', selectedMovie.release_date);
        formData.append('description', selectedMovie.description);
        formData.append('cast', selectedMovie.cast);
        formData.append('certificate', selectedMovie.certificate);
        formData.append('trailer_link', selectedMovie.trailer_link);
        if (newPoster) {
            formData.append('poster', newPoster);
        } if (newCover) {
            formData.append('cover_image', newCover);
        }

        try {
            await axiosInstance.put(`/cadmin/admin/update-movie/${selectedMovie.id}/`, formData);
            toast.success('Movie updated successfully');
            fetchMovies();
            onOpenChange(false); 
        } catch (error) {
            toast.error('Failed to update the movie');
        }
    };

    const handleDeleteMovie = (movieId , movieName) =>{
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
          }).then(async(result) => {
            if (result.isConfirmed) {
                try{
                    await axiosInstance.delete(`/cadmin/admin/update-movie/${movieId}/`)
                    toast.success(`${movieName} Deleted Successfully`)
                    fetchMovies()
                }catch(error){
                    toast.error('Failed to Delete the Movie')
                }
              
            }
          });
    }

    const handleYoutubeClick = (trailerLink) => {
        console.log('YouTube icon clicked'); // Debugging log
        const videoId = extractYouTubeVideoId(trailerLink);
        if (videoId) {
            console.log('Extracted video ID:', videoId); // Debugging log
            setVideoId(videoId);
            OnYoutubeOpen();
        } else {
            toast.error('Invalid YouTube URL');
        }
    };

    const opts = {
        height: '390',
        width: '640',
        playerVars: {
          autoplay: 1,
          rel:0,
          iv_load_policy:3,
          
        },
      };

    const extractYouTubeVideoId = (url) => {
        const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
        const match = url.match(regex);
        return match ? match[1] : null;
    };


    return (
      <>
        <div className="h-screen bg-[#1b1c31]">
          <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-semibold mb-4 text-white">
              Movie List
            </h2>
            <Link to="/admin/add-movie">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4">
                Add Movie
              </button>
            </Link>
            {loading ? (
              <div className="h-[10rem] flex justify-center items-center">
                <Spinner size="lg" label="Please Wait ..." />
              </div>
            ) : (
              <table className="w-full border-collapse border border-gray-200">
                <thead>
                  <tr>
                    <th className="border border-gray-200 px-4 py-2 text-white">
                      Poster
                    </th>
                    <th className="border border-gray-200 px-4 py-2 text-white">
                      Name
                    </th>
                    <th className="border border-gray-200 px-4 py-2 text-white">
                      Genre
                    </th>
                    <th className="border border-gray-200 px-4 py-2 text-white">
                      Language
                    </th>
                    <th className="border border-gray-200 px-4 py-2 text-white">
                      Release date
                    </th>
                    <th className="border border-gray-200 px-4 py-2 text-white">
                      Edit
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {movies.map((movie) => (
                    <tr key={movie.id}>
                      <td className="border border-gray-200 px-4 py-2 text-white">
                        <img
                          src={movie.poster}
                          alt={movie.name}
                          className="w-24 h-auto"
                        />
                      </td>
                      <td className="border border-gray-200 px-4 py-2 text-white">
                        {movie.title}
                      </td>
                      <td className="border border-gray-200 px-4 py-2 text-white">
                        {movie.genre}
                      </td>
                      <td className="border border-gray-200 px-4 py-2 text-white">
                        {movie.language}
                      </td>
                      <td className="border border-gray-200 px-4 py-2 text-white">
                        {movie.release_date}
                      </td>
                      <td className="border border-gray-200 px-4 py-2 text-white">
                        <Button
                          onPress={() => {
                            onOpen();
                            setMovie(movie);
                            setOriginalMovie({ ...movie });
                          }}
                          size="sm"
                          radius="full"
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold h-[2.5rem]"
                        >
                          <box-icon name="edit" color="#ffffff"></box-icon>
                        </Button>
                        <Button
                          onClick={() =>
                            handleDeleteMovie(movie.id, movie.title)
                          }
                          size="sm"
                          radius="full"
                          className="bg-red-500 hover:bg-red-700 text-white font-bold h-[2.5rem]"
                        >
                          <box-icon name="trash" color="#ffffff"></box-icon>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div className="flex justify-center items-center">
          <Pagination
              showControls
              total={totalPages}
              page={currentPage}
              onChange={handlePageChange}
            />
          </div>
        </div>
        {selectedMovie && (
          <Modal
            scrollBehavior="outside"
            isOpen={isOpen}
            onOpenChange={onOpenChange}
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    Edit Movie
                  </ModalHeader>
                  <ModalBody>
                    <Input
                      autoFocus
                      value={selectedMovie.title}
                      label="Title"
                      labelPlacement="outside"
                      name="title"
                      onChange={handleInputChange}
                    />
                    <Input
                      autoFocus
                      value={selectedMovie.language}
                      label="Language"
                      labelPlacement="outside"
                      name="language"
                      onChange={handleInputChange}
                    />
                    <Input
                      autoFocus
                      value={selectedMovie.genre}
                      label="Genre"
                      labelPlacement="outside"
                      name="genre"
                      onChange={handleInputChange}
                    />
                    <Input
                      autoFocus
                      value={selectedMovie.duration}
                      label="Duration"
                      labelPlacement="outside"
                      name="duration"
                      onChange={handleInputChange}
                    />
                    <Input
                      autoFocus
                      value={selectedMovie.release_date}
                      label="Release Date"
                      labelPlacement="outside"
                      type="date"
                      name="release_date"
                      onChange={handleInputChange}
                    />
                    <Textarea
                      autoFocus
                      value={selectedMovie.description}
                      label="Description"
                      labelPlacement="outside"
                      name="description"
                      onChange={handleInputChange}
                    />
                    <Input
                      autoFocus
                      value={selectedMovie.cast}
                      label="Cast"
                      labelPlacement="outside"
                      name="cast"
                      onChange={handleInputChange}
                    />
                    <Input
                      autoFocus
                      value={selectedMovie.certificate}
                      label="Certificate"
                      labelPlacement="outside"
                      name="certificate"
                      onChange={handleInputChange}
                    />
                    <div className="mt-2 flex justify-center align-middle">
                      <Image
                        isZoomed
                        width={240}
                        alt="Failed to Fetch"
                        src={
                          newPoster
                            ? newPoster
                            : selectedMovie.poster
                        }
                      />
                    </div>
                    <FileUploaderRegular
                      onChange={handlePosterChange}
                      pubkey="84b299193c8297b74db7"
                      maxLocalFileSizeBytes={5000000}
                      multiple={false}
                      imgOnly={true}
                      sourceList="local,url"
                      classNameUploader="my-config uc-dark"
                    />
                    <Input
                      autoFocus
                      value={selectedMovie.trailer_link}
                      label="Movie Trailer"
                      labelPlacement="outside"
                      name="trailer_link"
                      onChange={handleInputChange}
                      endContent={
                        <i
                          onClick={() =>
                            handleYoutubeClick(selectedMovie.trailer_link)
                          }
                          className="fa-brands fa-youtube cursor-pointer text-red-500"
                        ></i>
                      }
                    />
                    <div className="mt-2 flex justify-center align-middle">
                      <Image
                        isZoomed
                        width={240}
                        alt="Failed to Fetch"
                        src={
                          newCover
                            ? newCover
                            : selectedMovie.cover_image
                        }
                      />
                    </div>
                    <FileUploaderRegular
                      onChange={handleCoverChange}
                      pubkey="84b299193c8297b74db7"
                      maxLocalFileSizeBytes={5000000}
                      multiple={false}
                      imgOnly={true}
                      sourceList="local,url"
                      classNameUploader="my-config uc-dark"
                    />
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" onPress={onClose}>
                      Close
                    </Button>
                    <Button
                      color="primary"
                      className="hover:bg-green-400"
                      onPress={handleUpdate}
                    >
                      Update
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        )}

        {videoId && (
          <Modal
            isOpen={isYoutubeOpen}
            size="3xl"
            onOpenChange={onYoutubeOpenChange}
          >
            <ModalContent>
              <ModalHeader className="flex flex-col gap-1">
                Movie Trailer
              </ModalHeader>
              <ModalBody>
                <YouTube
                  className="flex justify-center align-middle "
                  videoId={videoId}
                  opts={opts}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  onPress={() => onYoutubeOpenChange(false)}
                >
                  Close
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}
      </>
    );
}

export default MoviesList;
