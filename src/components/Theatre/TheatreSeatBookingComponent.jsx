import React, { useState, useEffect } from "react";
import { Chip, Button } from "@nextui-org/react";
import seatImg from "../../../public/images/seat.svg";
import selectedSeatImg from "../../../public/images/selectedImg.svg";
import reservedSeatImg from "../../../public/images/reservedseats.svg";
import screenImg from "../../../public/images/screen.png";
import createAxiosInstance from "../../utlis/axiosinstance";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
} from "@nextui-org/react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function TheatreSeatBookingComponent({
  screenData,
  reservedSeats,
  updateReservedSeats,
}) {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedSeatNumbers, setSelectedSeatNumbers] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate()
  const [reservationDetails, setReservationDetails] = useState({
    name: "",
    phone: "",
    email: "",
  });
  console.log(selectedSeatNumbers,totalPrice);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const axiosInstance = createAxiosInstance("theatre");

  useEffect(() => {
    setTotalPrice(calculateTotalPrice());
    setSelectedSeatNumbers(calculateSeatNumbers(selectedSeats));
  }, [selectedSeats]);

  const handleSeatClick = (seatId) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((id) => id !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const getSeatIdentifier = (sectionIndex, rowIndex, colIndex) => {
    const rowLetter = String.fromCharCode(65 + rowIndex + sectionIndex * 4); // Adjust based on section index
    return `${rowLetter}${colIndex + 1}`;
  };

  const calculateTotalPrice = () => {
    return selectedSeats.reduce((total, seatId) => {
      for (const section of screenData.screen.sections) {
        for (const seat of section.seats) {
          if (seat.id === seatId) {
            return total + parseFloat(section.price);
          }
        }
      }
      return total;
    }, 0);
  };

  const calculateSeatNumbers = (selectedSeats) => {
    return selectedSeats.map((seatId) => {
      for (const section of screenData.screen.sections) {
        for (const seat of section.seats) {
          if (seat.id === seatId) {
            const sectionIndex = screenData.screen.sections.findIndex((s) =>
              s.seats.includes(seat)
            );
            return getSeatIdentifier(
              sectionIndex,
              seat.row_number,
              seat.column_number
            );
          }
        }
      }
      return "";
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReservationDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const HandleSubmit = async ()=>{
    const postData = {
      show: screenData.id,
      seats: selectedSeats,
      seat_nums: selectedSeatNumbers,
      name: reservationDetails.name,
      phone: reservationDetails.phone,
      email: reservationDetails.email,
      total_price: totalPrice,
    };

    try {
      if (!postData.name || !postData.phone || !postData.email){
        toast.error('Please fill out all required fields')
        return;
      }
      const res = await axiosInstance.post('/booking/offline-booking/',postData)
      console.log(res);
      if (res.status === 201){
        toast.success('Reserved Successfully')
        setSelectedSeats([]);
        setReservationDetails({ name: "", phone: "", email: "" });
        updateReservedSeats([...reservedSeats, ...selectedSeats]);
        navigate("/theatre/shows");
      }else{
        toast.error('Please Try again there is some problem')
        return
      }
    } catch (error) {
      console.log(error);
      toast.error("Please try again one more after refreshing the page!!")
    }


  }

  return (
    <>
      <div className="h-screen bg-black">
        <div className="flex items-center justify-center font-semibold text-2xl mt-20">
          <h1>Select Seats to Reserve</h1>
        </div>
        <div className="grid gap-2 flex-row items-center mt-8 justify-center">
          {screenData.screen.sections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <div className="flex justify-center items-center mb-2">
                <Chip size="sm">
                  {section.name} ${section.price}
                </Chip>
              </div>
              {screenData.screen.layout
                .slice(
                  sectionIndex * section.rows,
                  (sectionIndex + 1) * section.rows
                )
                .map((row, rowIndex) => (
                  <div
                    key={rowIndex}
                    className="flex items-center justify-center"
                  >
                    {row.map((seatId, colIndex) => (
                      <React.Fragment key={colIndex}>
                        {seatId === null ? (
                          <div className="w-8 h-8 mr-2" />
                        ) : (
                          <img
                            src={
                              reservedSeats.includes(seatId)
                                ? reservedSeatImg
                                : selectedSeats.includes(seatId)
                                ? selectedSeatImg
                                : seatImg
                            }
                            onClick={() =>
                              !reservedSeats.includes(seatId) &&
                              handleSeatClick(seatId)
                            }
                            className="w-8 h-8 mr-2 cursor-pointer"
                            alt={`Seat ${getSeatIdentifier(
                              sectionIndex,
                              rowIndex,
                              colIndex
                            )}`}
                          />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                ))}
            </div>
          ))}
          <div className="flex items-center justify-center mt-4">
            <img src={screenImg} className="max-w-[85%]" alt="Screen" />
          </div>
        </div>
        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-700 to-blue-800 w-full flex rounded-xl relative top-20 justify-between items-center p-4">
          <div>
            <h3 className="text-lg font-semibold">Seats</h3>
            <p>
              {selectedSeatNumbers
                .filter((seat, index, self) => self.indexOf(seat) === index)
                .join(", ")}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Total</h3>
            <p>${totalPrice.toFixed(2)}</p>
          </div>
          <div>
            <Button onPress={onOpen} variant="bordered" color="">
              Reserve Seats
            </Button>
          </div>
        </div>
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Enter Details of Holder
              </ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  type="text"
                  label="Name"
                  name="name"
                  placeholder="Enter holder Name"
                  variant="bordered"
                  onChange={handleInputChange}
                />
                <Input
                  label="Phone"
                  placeholder="Enter your Phone number"
                  type="number"
                  name="phone"
                  variant="bordered"
                  onChange={handleInputChange}
                />
                <Input
                  label="Email"
                  placeholder="Enter your Email"
                  type="email"
                  name="email"
                  variant="bordered"
                  onChange={handleInputChange}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose} onClick={HandleSubmit}>
                  Reserve
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default TheatreSeatBookingComponent;
