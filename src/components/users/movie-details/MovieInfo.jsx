import React from 'react';
import '../../../pages/users/Moviedetails.scss';
import { Link } from 'react-router-dom';
import { Button , Tooltip } from '@nextui-org/react';
import Moviecast from './Moviecast';

function MoiveInfo(props) {
  return (
    <>
      <div className="w-full h-full flex flex-col justify-center items-center relative bottom-[12rem] overflow-hidden px-4">
        <div className="pt-2 flex flex-col md:flex-row md:justify-center md:items-center gap-6 md:gap-12">
          <div className="p-4 overflow-y-hidden scroll-smooth w-full md:w-[30rem] sm:w-[28rem] h-fit">
            <img className="rounded-lg" src={props.flim.poster} alt="" />
          </div>
          <div className="flex flex-col items-center md:items-start gap-4">
            <h2 className="text-xl md:text-2xl font-bold">{props.flim.title}</h2>
            <p className="w-full md:w-[40rem] text-center md:text-left text-md text-white">{props.flim.description}</p>
            <div className="sub-details flex flex-wrap justify-center md:justify-start mt-2 gap-4 font-bold">
              <h5 className="text-white text-sm"><i className="fa-solid fa-language"></i> {props.flim.language}</h5>
              <h5 className="text-white text-sm"><i className="fa-regular fa-clock"></i> {props.flim.duration}</h5>
              <h5 className="text-white text-sm"><i className="fa-solid fa-heart"></i> 7/10</h5>
              <h5 className="text-white text-sm"><i className="fa-solid fa-comment"></i> 200+</h5>
            </div>
            <div className="flex gap-2 mt-2">
              <Link to={`/movie/available-shows/${props.flim.id}`} className="login-btn text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center">Get tickets </Link>
                <Tooltip showArrow={true} color='primary' placement='bottom'   content="Click this button again to Close the video">
                   <Button onClick={props.toggleTrailer} className="login-btn text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm px-2 py-2 text-center">
                    {props.showTrailer ? <i className="fa-solid fa-pause"></i> : <i className="fa-solid fa-play"></i>}
                  </Button>
                </Tooltip>
             
              
            </div>
          </div>
        </div>
      </div>
      <Moviecast casts={props.cast} url={props.url} />
    </>
  );
}

export default MoiveInfo;
