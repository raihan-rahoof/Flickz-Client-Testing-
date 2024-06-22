import React, { useState, useEffect } from 'react';
import createAxiosInstance from '../../../utlis/axiosinstance';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import formatTime12Hour from '../../../utlis/formatTime12';
import formatDateString from '../../../utlis/Dateformat';
import { Button, Input } from '@nextui-org/react';

function TheatreShowsList({ movie_id }) {
  const [shows, setShows] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTheatres, setFilteredTheatres] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();

  const axiosInstance = createAxiosInstance('theatre');
  const userAxiosInstance = createAxiosInstance('user')
  const fetchUserProfile = async () => {
    try {
      const res = await userAxiosInstance.get(`/auth/user-profile/`);  // Adjust the endpoint as needed
      setUserProfile(res.data);
    } catch (error) {
      toast.error('There was an error fetching the user profile!');
      console.log(error);
    }
  };

  const fetchShows = async () => {
    try {
      const res = await axiosInstance.get(`/theatre/movies/${movie_id}/available-shows/`);
      setShows(res.data);
      filterShows(res.data, userProfile);
    } catch (error) {
      toast.error('There was an error fetching the shows!');
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (userProfile) {
      fetchShows();
    }
  }, [userProfile]);

  const filterShows = (shows, userProfile) => {
    if (!userProfile) return;

    const filtered = shows.filter(show => {
      const theatre = show.theatre_details;
      return (
        theatre.city === userProfile.city ||
        theatre.district === userProfile.district ||
        theatre.state === userProfile.state
      );
    });

    setFilteredTheatres(filtered.length ? filtered : shows);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 0) {
      const filtered = shows.filter(show =>
        show.theatre_details.theatre_name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredTheatres(filtered);
    } else {
      setFilteredTheatres(shows);
    }
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);

    if (date) {
      const filtered = shows.filter(show =>
        new Date(show.date).toISOString().slice(0, 10) === new Date(date).toISOString().slice(0, 10)
      );
      setFilteredTheatres(filtered);
    } else {
      setFilteredTheatres(shows);
    }
  };

  const handleShowClick = (show) => {
    navigate('/movie/select-seat/', { state: show });
  };

  const groupShowsByTheatreAndDate = (shows) => {
    const groupedShows = {};

    shows.forEach(show => {
      const theatreName = show.theatre_details.theatre_name;
      const date = show.date;

      if (!groupedShows[theatreName]) {
        groupedShows[theatreName] = {};
      }

      if (!groupedShows[theatreName][date]) {
        groupedShows[theatreName][date] = [];
      }

      groupedShows[theatreName][date].push(show);
    });

    return groupedShows;
  };

  const groupedShows = groupShowsByTheatreAndDate(filteredTheatres);

  return (
    <>
      <div className="flex flex-col justify-center container h-screen mx-auto p-4">
        <div className="flex justify-center items-center text-center mb-6">
          <div>
            <h3 className="text-3xl font-semibold mb-2">Search Theatre</h3>
            <Input
              type="text"
              placeholder="Search Theatres"
              value={searchQuery}
              onChange={handleSearchChange}
              startContent={<i className="fa-solid fa-magnifying-glass"></i>}
            />
          </div>
        </div>

        <div className="mb-6">
          <div className="flex space-x-2 justify-start bg-[#101824] rounded-md pt-3 pb-3 pl-8">
            <Button
              radius="sm"
              onClick={() => handleDateClick('')}
              className="bg-gray-700 text-white "
            >
              All
            </Button>
            {[...new Set(shows.map(show => show.date))].map(date => (
              <Button
                radius="sm"
                key={date}
                onClick={() => handleDateClick(date)}
                className={`bg-gray-700 text-white px-4 py-2 ${selectedDate === date ? 'bg-gradient-to-r from-[#2d75b3] to-blue-800' : ''}`}
              >
                {formatDateString(date)}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-4 bg-[#101824] p-8 rounded-lg">
          {Object.keys(groupedShows).map(theatreName =>
            Object.keys(groupedShows[theatreName]).map(date => (
              <div key={`${theatreName}-${date}`} className="bg-gray-800 rounded-lg p-4 mb-4">
                <h2 className="text-xl font-semibold mb-2">{theatreName} : {groupedShows[theatreName][date][0].theatre_details.city}</h2>
                <div className="flex">
                  <h3><i className="fa-solid fa-tv"></i> {groupedShows[theatreName][date][0].screen.quality}</h3>
                  <p className="text-default-500 ml-2"><i className="fa-solid fa-volume-low"></i> {groupedShows[theatreName][date][0].screen.sound}</p>
                </div>
                <div className="flex gap-2 flex-wrap mt-2">
                  {groupedShows[theatreName][date].map(show => (
                    <button key={show.id} className="bg-gradient-to-r from-[#2d75b3] to-blue-800 text-white px-4 py-2 rounded mb-2" onClick={() => handleShowClick(show)}>
                      {formatTime12Hour(show.start_time)} - {formatTime12Hour(show.end_time)}
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default TheatreShowsList;
