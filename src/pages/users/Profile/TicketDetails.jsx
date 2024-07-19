import React, { useEffect, useState } from 'react';
import createAxiosInstance from '../../../utlis/axiosinstance';
import toast from 'react-hot-toast';
import Navbar from '../../../components/users/Navbar';
import {Card, CardFooter, Image, Button ,Spinner} from "@nextui-org/react";
import formatDateString from '../../../utlis/Dateformat';
import formatTime12Hour from '../../../utlis/formatTime12';
import { Link } from 'react-router-dom';

function TicketDetails() {
  const [bookings, setBookings] = useState([]);
  const axiosInstance = createAxiosInstance('user');
  const [loading,setLoading] = useState(false)

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const response = await axiosInstance.get('/booking/show-tickets/');
      if (response.status === 200) {
        setLoading(false);
        setBookings(response.data);
      } else {
        setLoading(false);
        toast.error('Error fetching details. Please refresh the page.');
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error('Error fetching details. Please refresh the page.');
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <>
      <Navbar />
      <div className=" sm:h-full lg:h-screen md:h-full p-5 mt-6">
        {loading ? (
          <div className="h-full flex justify-center items-center">
            <Spinner label="Loading..." color="primary" />
          </div>
        ) : (
          <div className="gap-2 grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1">
            {bookings.map((item, index) => (
              <Card index={item.key} radius="lg" className="border-none">
                <Image
                  alt="Woman listing to music"
                  className=""
                  src={`https://flickz-backend.duckdns.org${item.show.movie.poster}`}
                />
                <CardFooter className="flex flex-col bg-[#0F0F14]/90  overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                  <p className="font-bold text-lg text-white">
                    {item.show.movie.title}
                  </p>
                  <p className="text-sm text-white ">
                    {item.show.theatre_details.theatre_name}
                  </p>
                  <p className="text-sm text-white mb-3">
                    {formatDateString(item.show.date)} -{" "}
                    {formatTime12Hour(item.show.start_time)} to{" "}
                    {formatTime12Hour(item.show.end_time)}
                  </p>

                  <Link
                    to={`/tickets/details/${item.id}`}
                    state={{ booking: item }}
                    className="text-tiny text-white bg-white/20 p-2 rounded-lg"
                  >
                    See ticket
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default TicketDetails;
