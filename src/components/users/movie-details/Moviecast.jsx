import React from 'react';
import { Image } from "@nextui-org/react";

function Moviecast(props) {
  return (
    <div className='ml-5 relative bottom-[8rem] text-white'>
      <h3 className='text-xl text-center mb-4 font-semibold'>Casts</h3>
      <div className='relative w-full flex overflow-x-scroll items-center overflow-y-hidden scrollbar-hide p-5 space-x-8 justify-start '>
        {props.casts.map((cst) => (
          cst.profile_path && (
            <div key={cst.id} className="flex-shrink-0 w-[120px]">
              <Image
                src={props.url + cst.profile_path}
                className='rounded-full border-2 border-blue-400'
                width={100}
                height={100}
                alt={cst.name}
              />
              <p className='text-center mt-2 text-xs'>{cst.name}</p>
            </div>
          )
        ))}
      </div>
    </div>
  );
}

export default Moviecast;
