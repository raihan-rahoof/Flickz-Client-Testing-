import React, { useEffect, useState } from 'react';
import createAxiosInstance from '../../../utlis/axiosinstance';
import toast from 'react-hot-toast';
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";

function TheatreListTable() {
  const [theatres, setTheatres] = useState([]);
  const [theatre, setTheatre] = useState({});
  const [requests, setRequests] = useState([]);
  const axiosInstance = createAxiosInstance('admin');
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [viewAll, setViewAll] = useState(false);

  useEffect(() => {
    fetchTheatreRequests();
  }, []);

  console.log(requests);

  const fetchTheatreRequests = async () => {
    try {
      const res = await axiosInstance.get('/cadmin/admin/theatres-request-list');
      setRequests(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  const fetchTheatres = async () => {
    try {
      const res = await axiosInstance.get('/cadmin/admin/theatres-list');
      setTheatres(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  const handleApprove = async (e, TheatreId, index) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.put(`/cadmin/admin/theatre-allow-reject/${TheatreId}/`);
      console.log(res.data);
      if (res.status === 200) {
        const updatedRequests = [...requests];
        updatedRequests[index].admin_allow = res.data.admin_allow;
        setRequests(updatedRequests);
        toast.success(`Approved ${res.data.theatre_name} to Login`);
      } else {
        toast.error('Failed to update theatre status');
      }
    } catch (error) {
      console.log(error);
    }
  }

  const buttonChange = () => {
    setViewAll(prev => !prev);
    if (!viewAll) {
      fetchTheatres();
    }
  }

  return (
    <>
      <div className="fixed w-full h-screen bg-[#1B1C31]">
        <div className="mx-auto mt-12 max-w-screen-lg px-2">
          <div className="sm:flex sm:items-center sm:justify-between flex-col sm:flex-row">
            <h2 className="flex-1 text-base font-semibold text-gray-100">
              {viewAll ? 'Theatre List' : 'Theatre Requests'}
            </h2>
            <div className="mt-4 sm:mt-0">
              <div className="flex items-center justify-start sm:justify-end">
                <button 
                  onClick={buttonChange} 
                  type="button" 
                  className="inline-flex cursor-pointer items-center rounded-lg border border-gray-400 bg-gray-800 py-2 px-3 text-center text-sm font-medium text-gray-300 shadow hover:bg-gray-700 focus:shadow"
                >
                  {viewAll ? 'View Requests' : 'View all'}
                </button>
              </div>
            </div>
          </div>

          {viewAll ? (
            <div className="mt-6 overflow-hidden rounded-xl border shadow bg-gray-800">
              <table className="bg-[#2d2e3e] min-w-full border-separate border-spacing-y-2 border-spacing-x-2">
                <thead className="hidden border-b lg:table-header-group">
                  <tr>
                    <td width="50%" className="whitespace-normal py-4 text-sm font-medium text-gray-400 sm:px-6">Name</td>
                    <td className="whitespace-normal py-4 text-sm font-medium text-gray-400 sm:px-6">Owner</td>
                    <td className="whitespace-normal py-4 text-sm font-medium text-gray-400 sm:px-6">State</td>
                    <td className="whitespace-normal py-4 text-sm font-medium text-gray-400 sm:px-6">Details</td>
                  </tr>
                </thead>
                <tbody className="lg:border-gray-700">
                  {theatres.map((theatre, index) => (
                    <tr className="" key={theatre.id}>
                      <td width="50%" className="whitespace-no-wrap py-4 text-sm font-bold text-gray-100 sm:px-6">
                        {theatre.theatre_name}
                        <div className="mt-1 lg:hidden">
                          <p className="font-normal text-gray-500">{theatre.owner_name}</p>
                        </div>
                      </td>
                      <td className="whitespace-no-wrap hidden py-4 text-sm font-normal text-gray-300 sm:px-6 lg:table-cell">
                        {theatre.owner_name}
                      </td>
                      <td className="whitespace-no-wrap py-4 px-6 text-right text-sm text-gray-300 lg:text-left">
                        {theatre.state}
                        <Button 
                          onClick={() => { setTheatre(theatre); onOpen(); }} 
                          className="flex mt-1 ml-auto w-fit items-center rounded-full bg-blue-600 py-2 px-3 text-left text-xs font-medium text-white lg:hidden"
                        >
                          <i className="fa-solid fa-eye"></i>
                        </Button>
                      </td>
                      <td className="whitespace-no-wrap hidden py-4 text-sm font-normal text-gray-500 sm:px-6 lg:table-cell">
                        <Button 
                          onClick={() => { setTheatre(theatre); onOpen(); }} 
                          className="inline-flex items-center rounded-full bg-blue-600 py-2 px-3 text-xs text-white hover:bg-blue-800"
                        >
                          <i className="fa-solid fa-eye"></i>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="mt-6 overflow-hidden rounded-xl border shadow bg-gray-800">
              <table className="bg-[#2d2e3e] min-w-full border-separate border-spacing-y-2 border-spacing-x-2">
                <thead className="hidden border-b lg:table-header-group">
                  <tr>
                    <td width="50%" className="whitespace-normal py-4 text-sm font-medium text-gray-400 sm:px-6">Name</td>
                    <td className="whitespace-normal py-4 text-sm font-medium text-gray-400 sm:px-6">Owner</td>
                    <td className="whitespace-normal py-4 text-sm font-medium text-gray-400 sm:px-6">State</td>
                    <td className="whitespace-normal py-4 text-sm font-medium text-gray-400 sm:px-6">Details</td>
                    <td className="whitespace-normal py-4 text-sm font-medium text-gray-400 sm:px-6">Decision</td>
                  </tr>
                </thead>
                <tbody className="lg:border-gray-700">
                  {requests.map((theatre, index) => (
                    <tr className="" key={theatre.id}>
                      <td width="50%" className="whitespace-no-wrap py-4 text-sm font-bold text-gray-100 sm:px-6">
                        {theatre.theatre_name}
                        <div className="mt-1 lg:hidden">
                          <p className="font-normal text-gray-500">{theatre.owner_name}</p>
                        </div>
                      </td>
                      <td className="whitespace-no-wrap hidden py-4 text-sm font-normal text-gray-300 sm:px-6 lg:table-cell">
                        {theatre.owner_name}
                      </td>
                      <td className="whitespace-no-wrap py-4 px-6 text-right text-sm text-gray-300 lg:text-left">
                        {theatre.state}
                        <Button 
                          onClick={() => { setTheatre(theatre); onOpen(); }} 
                          className="flex mt-1 ml-auto w-fit items-center rounded-full bg-blue-600 py-2 px-3 text-left text-xs font-medium text-white lg:hidden"
                        >
                          <i className="fa-solid fa-eye"></i>
                        </Button>
                      </td>
                      <td className="whitespace-no-wrap hidden py-4 text-sm font-normal text-gray-500 sm:px-6 lg:table-cell">
                        <Button 
                          onClick={() => { setTheatre(theatre); onOpen(); }} 
                          className="inline-flex items-center rounded-full bg-blue-600 py-2 px-3 text-xs text-white hover:bg-blue-800"
                        >
                          <i className="fa-solid fa-eye"></i>
                        </Button>
                      </td>
                      <td className="whitespace-no-wrap hidden py-4 text-sm font-normal text-gray-500 sm:px-6 lg:table-cell">
                        <button className="inline-flex items-center rounded-full bg-red-600 py-2 px-3 text-xs text-white">
                          <i className="fa-solid fa-x"></i>
                        </button>
                        <button 
                          onClick={(e) => handleApprove(e, theatre.id, index)} 
                          className="inline-flex items-center ml-[2px] rounded-full bg-green-600 py-2 px-3 text-xs text-white"
                        >
                          <i className="fa-solid fa-check"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <Modal scrollBehavior={'inside'} isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">{theatre.theatre_name}</ModalHeader>
                <ModalBody>
                  <form className="max-w-sm mx-auto">
                    <div className="mb-5">
                      <label htmlFor="details" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Owner Name</label>
                      <input type="text" disabled readOnly id="details" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" value={theatre.owner_name} />
                    </div>
                    <div className="mb-5">
                      <label htmlFor="details" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Theatre Email</label>
                      <input type="text" disabled readOnly id="details" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" value={theatre.user.email} />
                    </div>
                    <div className="mb-5">
                      <label htmlFor="details" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone</label>
                      <input type="text" disabled readOnly id="details" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" value={theatre.phone_number} />
                    </div>
                    <div className="mb-5">
                      <label htmlFor="details" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">State, District, City</label>
                      <input type="text" disabled readOnly id="details" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" value={`${theatre.state} , ${theatre.district} , ${theatre.city}`} />
                    </div>
                    <div className="mb-5">
                      <label htmlFor="details" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Pin Code</label>
                      <input type="text" disabled readOnly id="details" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" value={theatre.pincode} />
                    </div>
                    <div className="mb-5">
                      <label htmlFor="details" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Address</label>
                      <textarea type="text" disabled readOnly id="details" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" value={theatre.address} />
                    </div>
                    <div className="mb-5">
                      <label htmlFor="details" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Google Map Details</label>
                      <a href={theatre.google_maps_link} target="_blank" rel="noopener noreferrer" className="shadow-sm bg-gray-50 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[8rem] p-2.5 dark:bg-blue-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light hover:border-blue-500">
                        view in map <i className="fa-solid fa-location-dot"></i>
                      </a>
                    </div>
                  </form>
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </>
  );
}

export default TheatreListTable;
