import React from 'react'
import Navbar from '../../components/users/Navbar'
import { useLocation } from 'react-router-dom';
import SeatLayout from '../../components/users/movie-details/SeatLayout';

function SelectSeat() {
    const location = useLocation();
    const show = location.state;
    
    return (
        <>
            <Navbar/>
            <SeatLayout show={show}/>
        </>
    )
    }

export default SelectSeat