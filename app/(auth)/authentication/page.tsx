import React from 'react'
import Image from "next/image";

export default function page() {
  return (
    <div className="bg-linear-to-b text-Cream from-[#7217ba] from-90% md:from-60% to-[#f8f4ec] h-screen flex justify-center items-center  ">
        
        <div className='flex justify-center items-center flex-col bg-Cream h-1/2 w-1/4  text-Viola rounded-3xl shadow-2xl shadow-White/30  ' >
            <Image src="/Logo.png" className=' mb-10' alt="Flowintoone Logo" width={90} height={90} />
            <div className='flex flex-col gap-6 mt-6 w-full items-center' >
                <p>Login</p>
                <input className='bg-transparent border-b-2 border-Viola w-3/4 text-center text-Viola focus:outline-none focus:border-Orange transition-colors duration-300' placeholder='Username' />
                <input className='bg-transparent border-b-2 border-Viola w-3/4 text-center text-Viola focus:outline-none focus:border-Orange transition-colors duration-300' placeholder='Password' type="password" />
                <button className='bg-Orange text-Cream font-bold py-2 px-4 rounded-full mt-4 hover:bg-Orange-Dark transition-colors duration-300'>Log in</button>
            </div>
        </div>
    </div>

  )
}
