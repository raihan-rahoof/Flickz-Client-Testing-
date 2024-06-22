import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import seatImg from '../../../../public/images/seat.svg';
import selectedSeatImg from '../../../../public/images/selectedImg.svg';
import reservedSeatImg from '../../../../public/images/reservedseats.svg';
import screenImg from '../../../../public/images/screen.png';
import { Button, Chip } from '@nextui-org/react';
import createAxiosInstance from '../../../utlis/axiosinstance';

const stripePromise = loadStripe('pk_test_51PRBUXJab1Eh3UND6ig2wzb9wnUBCwK3vnJRubJ9pbSIyK07Rd0ClznqGRmtFYPOeqzbHJMUGqoX1zbQp50loNi9006P3uVDQk');

function SeatLayout({ show }) {
  const [mySelectedSeats, setMySelectedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [reservedSeats, setReservedSeats] = useState([]);
  const [ws, setWs] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));
  const myId = user.user_id;
  const axiosInstance = createAxiosInstance('user');

  useEffect(() => {
    const websocket = new WebSocket('ws://127.0.0.1:8000/ws/seats/');

    websocket.onopen = () => {
      console.log('WebSocket connection opened');
      setWs(websocket);
    };

    websocket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    websocket.onerror = (error) => {
      console.log('WebSocket error:', error);
    };

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const seatId = data.seat_id;
      const user_id = data.user_id;
      const show_id = data.show_id;

      if (show_id !== show.id) return; // Ignore messages for other shows

      if (data.type === 'seat_selected') {
        if (user_id === myId) {
          setMySelectedSeats((prevSeats) => [...prevSeats, seatId]);
        } else {
          setSelectedSeats((prevSeats) => [...prevSeats, seatId]);
        }
      } else if (data.type === 'seat_unselected') {
        if (user_id === myId) {
          setMySelectedSeats((prevSeats) => prevSeats.filter(id => id !== seatId));
        }
        setSelectedSeats((prevSeats) => prevSeats.filter(id => id !== seatId));
      }
    };

    return () => {
      websocket.close();
    };
  }, [show.id, myId]);

  useEffect(() => {
    const fetchReservedSeats = async () => {
      try {
        const response = await axiosInstance.get(`screen/shows/${show.id}/reservations/`);
        const reserved = response.data.filter((reservation)=> reservation.is_reserved == true).map((seat)=> seat.seat)
       
        setReservedSeats(reserved);
      } catch (error) {
        console.error('Error fetching reserved seats:', error);
      }
    };

    fetchReservedSeats();
  }, []);

  console.log(reservedSeats);

  const handleSeatClick = (seatId) => {
    if (ws && !selectedSeats.includes(seatId) && !reservedSeats.includes(seatId)) {
      const userMail = JSON.parse(localStorage.getItem('user')).email;
      const action = mySelectedSeats.includes(seatId) ? 'unselect' : 'select';
      const seatNumber = getSeatNumberFromId(seatId);  // A function to get the seat number from seatId
      ws.send(JSON.stringify({ seat_id: seatId, user_mail: userMail, action: action, show_id: show.id, seat_number: seatNumber }));
    }
  };

  const getSeatNumberFromId = (seatId) => {
    for (const section of show.screen.sections) {
      for (const seat of section.seats) {
        if (seat.id === seatId) {
          const sectionIndex = show.screen.sections.findIndex(s => s === section);
          return getSeatNumber(sectionIndex, seat.row_number, seat.column_number);
        }
      }
    }
    return '';
  };

  const getSeatNumber = (sectionIndex, rowIndex, colIndex) => {
    const rowLetter = String.fromCharCode(65 + rowIndex + sectionIndex * 4); // Adjust based on section index
    return `${rowLetter}${colIndex + 1}`;
  };

  const calculateTotalPrice = () => {
    return mySelectedSeats.reduce((total, seatId) => {
      for (const section of show.screen.sections) {
        for (const seat of section.seats) {
          if (seat.id === seatId) {
            return total + parseFloat(section.price);
          }
        }
      }
      return total;
    }, 0);
  };

  const handleBooking = async () => {
    const stripe = await stripePromise;

    try {
      const seatNumbers = mySelectedSeats.map(seatId => getSeatNumberFromId(seatId));
      const response = await axiosInstance.post('/booking/checkout/', {
        show_id: show.id,
        seats: mySelectedSeats,
        seat_numbers: seatNumbers  // Send seat numbers to the backend
      });

      const sessionId = response.data.id;

      const result = await stripe.redirectToCheckout({ sessionId });

      if (result.error) {
        console.error(result.error.message);
      }
    } catch (error) {
      console.error("Error during booking:", error);
    }
  };

  if (!show || !show.screen || !show.screen.sections) {
    return <div className='w-full h-screen flex justify-center items-center '><h1>Loading...</h1></div>; // or any other loading/error message
  }

  return (
    <>
      <div className='bg-[black] p-4 flex flex-col justify-center items-center'>
        <div className='flex items-center justify-center font-semibold text-2xl mt-20'>
          <h1>Select Your Seats</h1>
        </div>
        <div className='grid gap-2 flex-row items-center mt-8 justify-center'>
          {show.screen.sections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <div className="flex justify-center items-center mb-2">
                <Chip size='sm'>{section.name} ${section.price} </Chip>
              </div>
              {show.screen.layout.slice(sectionIndex * section.rows, (sectionIndex + 1) * section.rows).map((row, rowIndex) => (
                <div key={rowIndex} className='flex items-center justify-center'>
                  {row.map((seatId, colIndex) => (
                    <React.Fragment key={colIndex}>
                      {seatId === null ? (
                        <div className='w-8 h-8 mr-2' />
                      ) : (
                        <img
                          src={
                            reservedSeats.includes(seatId) ? reservedSeatImg :
                            mySelectedSeats.includes(seatId) ? selectedSeatImg :
                            selectedSeats.includes(seatId) ? reservedSeatImg :
                            seatImg
                          }
                          onClick={() => !reservedSeats.includes(seatId) && handleSeatClick(seatId)}
                          className='w-8 h-8 mr-2 cursor-pointer'
                          alt={`Seat ${getSeatNumber(sectionIndex, rowIndex, colIndex)}`}
                        />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              ))}
            </div>
          ))}
          <div className="flex items-center justify-center mt-4">
            <img src={screenImg} className='max-w-[85%]' alt="Screen" />
          </div>
        </div>
        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-700 to-blue-800 w-full flex rounded-xl relative top-20 justify-between items-center p-4">
          <div>
            <h3 className='text-lg font-semibold'>{show.theatre_details.theatre_name}</h3>
            <h3><i className="fa-solid fa-film"></i> {show.movie.title}</h3>
            <h3 className='text-sm'><i className="fa-solid fa-tv"></i> {show.screen.quality}</h3>
            <h3 className='text-sm'><i className="fa-solid fa-location-dot"></i> {show.theatre_details.city}, {show.theatre_details.district}</h3>
          </div>
          <div>
            <h3 className='text-lg font-semibold'>Seats</h3>
            <p>{mySelectedSeats.map(seatId => {
                for (const section of show.screen.sections) {
                  for (const seat of section.seats) {
                    if (seat.id === seatId) {
                      return getSeatNumber(show.screen.sections.findIndex(s => s.seats.includes(seat)), seat.row_number, seat.column_number);
                    }
                  }
                }
                return '';
              }).filter((seat, index, self) => self.indexOf(seat) === index).join(', ')}</p>
          </div>
          <div>
            <h3 className='text-lg font-semibold'>Total</h3>
            <p>${calculateTotalPrice().toFixed(2)}</p>
          </div>
          <div>
            <Button variant='bordered' color='' onClick={handleBooking}>Book tickets</Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default SeatLayout;
