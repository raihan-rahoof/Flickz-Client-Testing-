import React,{useEffect, useState} from 'react'
import TheatreSeatBookingComponent from '../../../components/Theatre/TheatreSeatBookingComponent'
import { useLocation } from 'react-router-dom'
import createAxiosInstance from '../../../utlis/axiosinstance'
function TheatreSideSeatBooking() {
    const [reservedSeats,updateReservedSeats]=useState([])
    const location = useLocation()
    const screenData = location.state
    console.log(screenData);
    const axiosInstance = createAxiosInstance("theatre");
    useEffect(() => {
      const fetchReservedSeats = async () => {
        try {
          const response = await axiosInstance.get(
            `screen/shows/${screenData.id}/reservations/`
          );
          const reserved = response.data
            .filter((reservation) => reservation.is_reserved == true)
            .map((seat) => seat.seat);

          updateReservedSeats(reserved);
        } catch (error) {
          console.error("Error fetching reserved seats:", error);
        }
      };

      fetchReservedSeats();
    }, []);
  return (
    <>
      <TheatreSeatBookingComponent
        screenData={screenData}
        reservedSeats={reservedSeats}
        updateReservedSeats={updateReservedSeats}
      />
    </>
  );
}

export default TheatreSideSeatBooking