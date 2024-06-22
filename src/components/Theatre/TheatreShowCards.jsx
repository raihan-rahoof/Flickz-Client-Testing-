import React, { useEffect, useState } from 'react';
import {
  Card,
  CardBody,
  TimeInput,
  CardFooter,
  Image,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
} from '@nextui-org/react';
import toast from 'react-hot-toast';
import createAxiosInstance from '../../utlis/axiosinstance';
import Select from 'react-select';
import formatTime from '../../utlis/formatTime';
import parseMovieDuration from '../../utlis/movieDuration';
import formatTime12Hour from '../../utlis/formatTime12';
import formatDateString from '../../utlis/Dateformat';
import formatTime12HourInput from '../../utlis/formatTIme12Input';

const customStyles = {
  control: (provided) => ({
    ...provided,
    backgroundColor: '#2c2c2c',
    borderColor: '#5a5a5a',
    color: '#fff',
    minHeight: '48px',
    borderRadius: '0.8rem',
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: '#2c2c2c',
    color: '#fff',
    borderRadius: '0.5rem',
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#fff',
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#3a3a3a' : state.isFocused ? '#4a4a4a' : '#2c2c2c',
    color: '#fff',
  }),
  input: (provided) => ({
    ...provided,
    color: '#fff',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: '#aaa',
  }),
};

function TheatreShowCards() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [shows, setShows] = useState([]);
  const [movieList, setMovieList] = useState([]);
  const [screens, setScreens] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedShow, setSelectedShow] = useState(null);
  const theatreData = JSON.parse(localStorage.getItem('theatre'));
  const theatreId = theatreData.theatre_id;
  const [formData, setFormData] = useState({
    show_name: '',
    movie: null,
    screen: '',
    theatre: theatreId || '',
    date: null,
    start_time: { hour: 0, minute: 0, second: 0, millisecond: 0 },
    end_time: { hour: 0, minute: 0, second: 0, millisecond: 0 },
  });
  const axiosInstance = createAxiosInstance('theatre');
  
  const handleInputChange = (field, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));
    if (field === 'start_time' && formData.movie) {
      const duration = parseMovieDuration(formData.movie.duration);
      const endTime = calculateEndTime(value, duration);
      setFormData((prevData) => ({
        ...prevData,
        end_time: endTime,
      }));
    }
  };

  const calculateEndTime = (startTime, duration) => {
    const startHour = parseInt(startTime.hour, 10);
    const startMinute = parseInt(startTime.minute, 10);
    let endHour = startHour + duration.hours;
    let endMinute = startMinute + duration.minutes;
    if (endMinute >= 60) {
      endHour += Math.floor(endMinute / 60);
      endMinute %= 60;
    }
    return {
      hour: endHour,
      minute: endMinute,
      second: 0,
      millisecond: 0,
    };
  };

  const handleSave = async () => {
    try {
      const simplifiedFormData = {
        show_name: formData.show_name,
        movie: formData.movie.value,
        screen: formData.screen.value,
        date: formData.date,
        theatre: formData.theatre,
        start_time: formatTime12Hour(formData.start_time),
        end_time: formatTime12HourInput(formData.end_time),
      };

      const response = await axiosInstance.post('theatre/shows/', simplifiedFormData);
      if (response.status === 201) {
        toast.success('New Show Added');
        onOpenChange();
        fetchShows();
      } else {
        toast.error('Please Try again One more time');
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to add show. Please try again.');
    }
  };

  const handleMovieSelect = (movieId) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      movie: movieId,
    }));
  };

  const handleScreenSelect = (screenId) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      screen: screenId,
    }));
  };

  const handleDelete = async () => {
    try {
      const response = await axiosInstance.delete(`theatre/shows/${selectedShow.id}/`);
      if (response.status === 204) {
        toast.success('Show deleted successfully');
        fetchShows();
        setDeleteModal(false);
      } else {
        toast.error('Failed to delete show. Please try again.');
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to delete show. Please try again.');
    }
  };

  useEffect(() => {
    fetchMovies();
    fetchScreens();
    fetchShows();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await axiosInstance.get('theatre/view-movies');
      const movieOptions = response.data.map((movie) => ({
        value: movie.id,
        label: movie.title,
        poster: movie.poster,
        duration: movie.duration,
        language: movie.language,
      }));
      setMovieList(movieOptions);
    } catch (error) {
      toast.error('Failed to fetch movies, please refresh the page.');
    }
  };

  const fetchScreens = async () => {
    try {
      const response = await axiosInstance.get('screen/add-screen/');
      const screenOptions = response.data.map((screen) => ({
        value: screen.id,
        label: `${screen.name} (${screen.quality}, ${screen.sound})`,
      }));
      setScreens(screenOptions);
    } catch (error) {
      toast.error('Failed to get screens, please refresh the page.');
    }
  };

  const fetchShows = async () => {
    try {
      const response = await axiosInstance.get('theatre/shows/');
      setShows(response.data);
    } catch (error) {
      toast.error('Failed to fetch shows, please refresh the page.');
    }
  };

  return (
    <>
      <div className="h-screen p-4 bg-black">
        <div className="flex pb-8 pt-4">
          <h1 className="text-3xl font-semibold">Manage Shows</h1>
        </div>
        <Button className="bg-indigo-500 mb-4" onPress={onOpen}>
          Shows +
        </Button>
        <div className="gap-2 grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1">
          {shows.length > 0 && (
            <>
              {shows.map((show) => (
                <Card key={show.id} className="" shadow="sm" isPressable>
                  <CardBody className="overflow-visible p-0">
                    <Image
                      shadow="sm"
                      radius="lg"
                      width="100%"
                      className="w-full object-cover"
                      src={show.movie.poster}
                    />
                  </CardBody>
                  <CardFooter className="text-small flex flex-col justify-center items-start">
                    <h2 className="text-lg font-bold">{show.show_name}</h2>
                    <h3 className="font-bold font-md">{show.movie.title}</h3>
                    <p className="text-default-500">Language : {show.movie.language}</p>
                    <p className="text-default-500">Date : {formatDateString(show.date)}</p>
                    <p className="text-default-500">
                      {formatTime12Hour(show.start_time)} - {formatTime12Hour(show.end_time)}
                    </p>
                    <Button
                      size="sm"
                      radius="full"
                      color="danger"
                      variant="shadow"
                      className="mt-2"
                      onPress={() => {
                        setSelectedShow(show);
                        setDeleteModal(true);
                      }}
                    >
                      <i className="fa-solid fa-trash"></i>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </>
          )}
        </div>
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center" backdrop="blur">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Add Show</ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  labelPlacement="outside"
                  label="Show name"
                  placeholder="Enter show name"
                  variant="bordered"
                  value={formData.show_name}
                  onChange={(e) => handleInputChange('show_name', e.target.value)}
                  required
                />

                <label className="block text-white text-sm">Movie</label>
                <Select
                  options={movieList}
                  onChange={handleMovieSelect}
                  placeholder="Select a movie"
                  isSearchable
                  styles={customStyles}
                />

                <label className="block text-white text-sm">Screen</label>
                <Select
                  options={screens}
                  onChange={handleScreenSelect}
                  placeholder="Select a Screen"
                  isSearchable
                  styles={customStyles}
                />

                <div className="mb-4">
                  <label htmlFor="release_date" className="block text-white text-sm">
                    Show Date
                  </label>
                  <input
                    type="date"
                    id="release_date"
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    name="date"
                    className="w-full text-white text-sm rounded-md px-3 py-2"
                  />
                </div>

                <TimeInput
                  label="Start Time"
                  labelPlacement="outside"
                  onChange={(value) => handleInputChange('start_time', value)}
                />

                <label className="block text-white text-sm">End Time</label>
                <Input value={formatTime12HourInput(formData.end_time) || ''} disabled />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={handleSave}>
                  Save
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal isOpen={deleteModal} onOpenChange={setDeleteModal} placement="top-center" backdrop="blur">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Confirm Delete</ModalHeader>
              <ModalBody>
                <p>Are you sure you want to delete the show "{selectedShow?.show_name}"?</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    handleDelete();
                    onClose();
                  }}
                >
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default TheatreShowCards;
