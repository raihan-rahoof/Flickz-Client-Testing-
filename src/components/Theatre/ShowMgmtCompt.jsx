import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Image,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Divider,
  Input,
  Spinner,
  Button,
} from "@nextui-org/react";
import createAxiosInstance from "../../utlis/axiosinstance";
import toast from "react-hot-toast";
import formatDateString from "../../utlis/Dateformat";
import formatTime12Hour from "../../utlis/formatTime12";
import jsPDF from "jspdf";
import "jspdf-autotable";

function ShowMgmtCompt() {
  const location = useLocation();
  const showId = location.state || {};
  const [loading, setLoading] = useState(false);
  const axiosInstance = createAxiosInstance("theatre");
  const [showDetails, setShowDetails] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const fetchShowDetails = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/theatre/show/details/${showId}/`);
      console.log(res);
      if (res.status === 200) {
        setShowDetails(res.data);
        setLoading(false);
      } else {
        setLoading(false);
        console.log(res.response);
        toast.error("Failed to fetch Data's try again");
      }
    } catch (error) {
      setLoading(false);
      toast.error("Failed to fetch Data's try again");
      console.log(error);
    }
  };

  const handleSearchQuery = (e) => {
    setSearchQuery(e.target.value);
  };

  const filterBookings = (bookings) => {
    return bookings?.filter(
      (booking) =>
        booking.user?.first_name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        booking.user?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.user?.phone.includes(searchQuery) ||
        booking.seat_number.some((seat) =>
          seat.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Show and Booking Details", 20, 10);

    const showData = [
      ["Show Name", showDetails.show_name],
      ["Movie Title", showDetails.movie.title],
      ["Language", showDetails.movie.language],
      ["Date", formatDateString(showDetails.date)],
      [
        "Time",
        `${formatTime12Hour(showDetails.start_time)} - ${formatTime12Hour(
          showDetails.end_time
        )}`,
      ],
      ["Screen", showDetails.screen.name],
      ["Total Revenue Online", showDetails.total_revenue_online],
      ["Total Revenue Offline", showDetails.total_revenue_offline],
      ["Total Revenue", showDetails.total_revenue],
      ["Tickets Sold", showDetails.tickets_sold],
      [
        "Remaining Seats",
        showDetails.screen.cols * showDetails.screen.rows -
          showDetails.tickets_sold,
      ],
    ];

    doc.autoTable({
      head: [["Field", "Value"]],
      body: showData,
      startY: 20,
    });

    const bookingHeaders = ["Name", "Seats", "Email", "Phone", "Total Amount"];
    const onlineBookings = filteredOnlineBookings?.map((item) => [
      item.user?.first_name || "N/A",
      item.seat_number.join(", "),
      item.user?.email || "N/A",
      item.user?.phone || "N/A",
      `$ ${item.total_price}`,
    ]);

    const offlineBookings = filteredOfflineBookings?.map((item) => [
      item.name,
      item.seat_number.join(", "),
      item.email,
      item.phone,
      `$ ${item.total_price}`,
    ]);

    doc.autoTable({
      head: [bookingHeaders],
      body: onlineBookings,
      startY: doc.autoTable.previous.finalY + 10,
      theme: "striped",
      title: "Online Bookings",
    });

    doc.autoTable({
      head: [bookingHeaders],
      body: offlineBookings,
      startY: doc.autoTable.previous.finalY + 10,
      theme: "striped",
      title: "Offline Bookings",
    });

    doc.save("show_details.pdf");
  };



  useEffect(() => {
    fetchShowDetails();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Spinner label="Loading..." color="primary" />
      </div>
    );
  }

  if (
    !showDetails.show_name ||
    !showDetails.movie ||
    (!showDetails.bookings && !showDetails.offline_bookings)
  ) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Spinner label="Fetching data..." color="primary" />
      </div>
    );
  }

  const filteredOnlineBookings = filterBookings(showDetails.bookings);
  const filteredOfflineBookings = filterBookings(showDetails.offline_bookings);

  return (
    <div>
      <div className="p-4 flex flex-col gap-4">
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="p-4 md:p-5  min-h-[410px] flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-800 dark:border-neutral-700">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">
                  {showDetails.show_name}
                </p>
                <h2 className="text-sm text-gray-500 dark:text-neutral-500">
                  {showDetails.movie.title}
                </h2>
                <Image
                  shadow="sm"
                  radius="lg"
                  width="100%"
                  className="w-full object-cover"
                  src={showDetails.movie.poster}
                />
                <p className="text-default-500">
                  Language :{" "}
                  <span className="font-bold text-white">
                    {showDetails.movie.language}
                  </span>
                </p>
                <p className="text-default-500">
                  Date :
                  <span className="font-bold text-white">
                    {formatDateString(showDetails.date)}
                  </span>
                </p>
                <p className="text-default-500">
                  Time :
                  <span className="font-bold text-white">
                    {formatTime12Hour(showDetails.start_time)}-
                    {formatTime12Hour(showDetails.end_time)}
                  </span>
                </p>
                <p className="text-default-500">
                  Screen :
                  <span className="font-bold text-white">
                    {showDetails.screen.name}
                  </span>
                </p>
                <Button
                  color="secondary"
                  className="mt-2"
                  radius="sm"
                  onClick={() =>
                    navigate("/theatre/show/manage/seats", {
                      state: showDetails,
                    })
                  }
                >
                  Reserve Seats
                </Button>
              </div>
            </div>
          </div>

          <div className="p-4 md:p-5 min-h-[410px] flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-800 dark:border-neutral-700">
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <div>
                  <h2 className="text-sm text-gray-500 dark:text-neutral-500">
                    Online Booking Revenue
                  </h2>
                  <p className="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">
                    <i
                      className="fa-solid fa-dollar"
                      style={{ color: "green" }}
                    ></i>{" "}
                    {showDetails.total_revenue_online}
                  </p>
                </div>
                <div className="mt-4">
                  <h2 className="text-sm text-gray-500 dark:text-neutral-500">
                    Offline Booking Revenue
                  </h2>
                  <p className="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">
                    <i
                      className="fa-solid fa-dollar"
                      style={{ color: "green" }}
                    ></i>{" "}
                    {showDetails.total_revenue_offline}
                  </p>
                </div>
                <div className="mt-4">
                  <h2 className="text-sm text-gray-500 dark:text-neutral-500">
                    Total Booking Revenue of Show
                  </h2>
                  <p className="text-xl sm:text-3xl font-medium text-gray-800 dark:text-neutral-200 underline">
                    <i
                      className="fa-solid fa-dollar"
                      style={{ color: "green" }}
                    ></i>{" "}
                    {showDetails.total_revenue}
                  </p>
                </div>
                <Divider className="my-4 w-[30rem] " />
                <div className="mt-4">
                  <h2 className="text-sm text-gray-500 dark:text-neutral-500">
                    Booked Seats
                  </h2>
                  <p className="text-xl sm:text-xl font-medium text-gray-800 dark:text-neutral-200">
                    <i
                      className="fa-solid fa-ticket"
                      style={{ color: "green" }}
                    ></i>{" "}
                    {showDetails.tickets_sold}
                  </p>
                </div>
                <div className="mt-4">
                  <h2 className="text-sm text-gray-500 dark:text-neutral-500">
                    Remaining Seats
                  </h2>
                  <p className="text-xl sm:text-xl font-medium text-gray-800 dark:text-neutral-200">
                    <i
                      className="fa-solid fa-ticket"
                      style={{ color: "green" }}
                    ></i>{" "}
                    {showDetails.screen.cols * showDetails.screen.rows -
                      showDetails.tickets_sold}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="">
          <div className="flex gap-2">
            <Input
              isClearable
              startContent={<i className="fa-solid fa-search"></i>}
              className="w-full sm:max-w-[44%] mb-4"
              placeholder="Search by name..."
              onChange={handleSearchQuery}
            />
            <Button color="secondary" onClick={downloadPDF}>
              Details <i class="fa-solid fa-download"></i>{" "}
            </Button>
          </div>
          <Table aria-label="Example empty table">
            <TableHeader>
              <TableColumn>NAME</TableColumn>
              <TableColumn>SEATS</TableColumn>
              <TableColumn>EMAIL</TableColumn>
              <TableColumn>PHONE</TableColumn>
              <TableColumn>TOTAL AMOUNT</TableColumn>
            </TableHeader>
            <TableBody emptyContent={"Nobody booked tickets yet"}>
              {filteredOnlineBookings?.map((item) => (
                <TableRow key={`online-${item.id}`}>
                  <TableCell>{item.user?.first_name || "N/A"}</TableCell>
                  <TableCell>{item.seat_number.join(", ")}</TableCell>
                  <TableCell>{item.user?.email || "N/A"}</TableCell>
                  <TableCell>{item.user?.phone || "N/A"}</TableCell>
                  <TableCell>$ {item.total_price}</TableCell>
                </TableRow>
              ))}
              {filteredOfflineBookings?.map((item) => (
                <TableRow key={`offline-${item.id}`}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.seat_number.join(", ")}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>{item.phone}</TableCell>
                  <TableCell>$ {item.total_price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default ShowMgmtCompt;
