import React, { useState } from "react";
import axios from "axios";
import createAxiosInstance from "../../utlis/axiosinstance";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FileUploaderRegular } from "@uploadcare/react-uploader";
import "@uploadcare/react-uploader/core.css";

function AddMovieForm() {
  const [formData, setFormData] = useState({
    title: "",
    poster: null,
    trailer_link: "",
    duration: "",
    genre: "",
    language: "",
    certificate: "",
    release_date: "",
    description: "",
    cover_image: "",
  });

  const navigate = useNavigate();
  const axiosInstance = createAxiosInstance("admin");

  const [previewImage, setPreviewImage] = useState("");
  const [coverPreview, setCoverPreview] = useState("");

  
  const handlePosterChange = (files) => {
    const successFile = files.allEntries.find((f) => f.status === "success");
    if (successFile) {
      const cdnUrl = successFile.cdnUrl;
      setFormData((prevState) => ({
        ...prevState,
        poster: cdnUrl,
      }));
      setPreviewImage(cdnUrl); 
    }
  };

  
  const handleCoverChange = (files) => {
    const successfulFile = files.allEntries.find((f) => f.status === "success");
    if (successfulFile) {
      const cdnUrl = successfulFile.cdnUrl;
      setFormData((prevState) => ({
        ...prevState,
        cover_image: cdnUrl,
      }));
      setCoverPreview(cdnUrl); 
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Provide a Proper Title");
      return;
    } else if (!formData.trailer_link.trim()) {
      toast.error("Provide a Proper Link for Trailer");
      return;
    } else if (!formData.duration.trim()) {
      toast.error("Provide a Proper Duration");
      return;
    } else if (!formData.language.trim()) {
      toast.error("Provide a Proper Language");
      return;
    } else if (!formData.genre.trim()) {
      toast.error("Provide a Proper Genre");
      return;
    }
    
    if(!/^(\d+hr\s\d+mins|\d+hr|\d+mins)$/.test(formData.duration.trim())){
      toast.error('Duration must in the format like eg: 2hr 30mins')
      return
    }

    if(!/^[A-za-z\s]+$/.test(formData.genre)){
      toast.error('Please Provide Proper Genre')
      return
    }
    
    const wordCount = formData.description.split(/\s+/).filter(word=>word.length > 0).length
    if(wordCount < 50){
      toast.error("Description must be more then 50 words")
      return
    }

     if (!formData.poster) {
       toast.error('Please Provide Poster for Movie')
       return
     }
     if(!formData.cover_image){
      toast.error('Please Provide Cover Image for Movie')
      return
     }


    try {
      const token = JSON.parse(localStorage.getItem("admin_access"));
      const res = await axiosInstance.post(
        "/cadmin/admin/add-movies/",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 201) {
        toast.success("Movie added successfully");
        navigate("/admin/movies");
      } else if (res.status === 200) {
        Swal.fire({
          title: "Already Exists",
          text: res.data.error,
          icon: "warning",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-8 bg-gray-800 p-8 rounded-md">
      <h2 className="text-white text-2xl mb-6">Add Movie</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-white">
            Title
          </label>
          <input
            required
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full bg-gray-700 text-white rounded-md px-3 py-2"
          />
        </div>

        {/* Poster Upload */}
        <div className="mb-4">
          <label htmlFor="poster" className="block text-white">
            Poster
          </label>
          <FileUploaderRegular
            onChange={handlePosterChange}
            pubkey="84b299193c8297b74db7"
            maxLocalFileSizeBytes={5000000}
            multiple={false}
            imgOnly={true}
            sourceList="local"
            classNameUploader="my-config uc-dark"
          />
        </div>
        {previewImage && (
          <div className="mb-4">
            <img
              src={previewImage}
              alt="Poster Preview"
              className="max-w-[14rem] mx-auto"
            />
          </div>
        )}
        <div className="mb-4">
          <label htmlFor="language" className="block text-white">
            Language
          </label>
          <input
            required
            type="text"
            id="language"
            name="language"
            value={formData.language}
            onChange={handleChange}
            className="w-full bg-gray-700 text-white rounded-md px-3 py-2"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="duration" className="block text-white">
            Duration
          </label>
          <input
            required
            type="text"
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className="w-full bg-gray-700 text-white rounded-md px-3 py-2"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="trailer_link" className="block text-white">
            Trailer Link
          </label>
          <input
            required
            type="url"
            id="trailer_link"
            name="trailer_link"
            value={formData.trailer_link}
            onChange={handleChange}
            className="w-full bg-gray-700 text-white rounded-md px-3 py-2"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="genre" className="block text-white">
            Genre
          </label>
          <input
            required
            type="text"
            id="genre"
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            className="w-full bg-gray-700 text-white rounded-md px-3 py-2"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="certificate" className="block text-white">
            Certificate
          </label>
          <select
            id="certificate"
            name="certificate"
            value={formData.certificate}
            onChange={handleChange}
            className="w-full bg-gray-700 text-white rounded-md px-3 py-2"
            required
          >
            <option value="U">U</option>
            <option value="UA">UA</option>
            <option value="A">A</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="release_date" className="block text-white">
            Release Date
          </label>
          <input
            required
            type="date"
            id="release_date"
            name="release_date"
            value={formData.release_date}
            onChange={handleChange}
            className="w-full bg-gray-700 text-white rounded-md px-3 py-2"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-white">
            Description
          </label>
          <textarea
            required
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full bg-gray-700 text-white rounded-md px-3 py-2"
            rows="5"
          ></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="cover_image" className="block text-white">
            Cover Image
          </label>
          <FileUploaderRegular
            onChange={handleCoverChange}
            pubkey="84b299193c8297b74db7"
            maxLocalFileSizeBytes={5000000}
            multiple={false}
            imgOnly={true}
            sourceList="local"
            classNameUploader="my-config uc-dark"
          />
        </div>
        {coverPreview && (
          <div className="mb-4">
            <img
              src={coverPreview}
              alt="Cover Preview"
              className="max-w-[14rem] mx-auto"
            />
          </div>
        )}
        <div className="mb-4">
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Add Movie
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddMovieForm;
