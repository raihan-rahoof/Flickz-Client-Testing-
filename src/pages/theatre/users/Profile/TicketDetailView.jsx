import React from "react";
import { useLocation } from "react-router-dom";
import formatDateString from "../../../utlis/Dateformat";
import formatTime12Hour from "../../../utlis/formatTime12";
import { Card, CardBody, CardFooter, Image } from "@nextui-org/react";
import Navbar from "../../../components/users/Navbar";
import "./ticketdetailview.scss";
import qrimage from "../../../../public/images/qrcode.png";
import { usePDF } from "react-to-pdf";

const TicketDetailPage = () => {
  const location = useLocation();
  const { booking } = location.state || {};
  const { toPDF, targetRef } = usePDF({ filename: "ticket.pdf" });

  if (!booking) {
    return <div>No booking details available.</div>;
  }

  return (
    <>
      <Navbar />
      <div className="h-screen flex flex-col justify-center items-center">
        <div
          ref={targetRef}
          className="relative flex flex-col mt-6 text-gray-700 bg-white shadow-md bg-clip-border rounded-xl w-96"
        >
          <div className="relative mx-4 -mt-6 overflow-hidden text-white shadow-lg bg-clip-border rounded-xl bg-blue-gray-500 shadow-blue-gray-500/40">
            <img src={booking.show.movie.poster} alt="card-image" />
          </div>
          <div className="p-6">
            <h5 className="block mb-2 text-xl antialiased font-bold leading-snug tracking-normal text-blue-gray-900">
              {booking.show.theatre_details.theatre_name} :{" "}
              {booking.show.theatre_details.city}
            </h5>
            <p className="block antialiased font-light leading-relaxed text-inherit">
              <i className="fa-solid fa-film"></i> {booking.show.movie.title}
            </p>
            <p className="block antialiased font-light leading-relaxed text-inherit">
              <i className="fa-solid fa-tv"></i> {booking.show.screen.name}
            </p>
            <p className="block antialiased font-light leading-relaxed text-inherit">
              <i className="fa-solid fa-calendar-days"></i>{" "}
              {formatDateString(booking.show.date)}
            </p>
            <p className="block antialiased font-light leading-relaxed text-inherit">
              <i className="fa-solid fa-clock"></i>{" "}
              {formatTime12Hour(booking.show.start_time)} -{" "}
              {formatTime12Hour(booking.show.end_time)}
            </p>
            <div className="flex items-start">
              {booking.seat_number.map((number, index) => (
                <p
                  key={index}
                  className="block mr-4 text-xl font-semibold antialiased leading-relaxed text-inherit"
                >
                  <i className="fa-solid fa-couch"></i> {number}
                </p>
              ))}
            </div>
            <div className="flex justify-start">
              <img src={qrimage} alt="" className="h-24" />
            </div>
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={() => toPDF()}
            className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
            type="button"
          >
            Download
          </button>
        </div>
      </div>
    </>
  );
};

export default TicketDetailPage;
