import React from 'react'

export default function WhoWeAre() {
  return (
  <div className='w-full flex justify-evenly items-center   py-40'>
    <div className='w-1/2'>
      <img src='/assets/who-we-are.png' alt='Who We Are' className='w-full h-auto rounded-lg shadow-md' />
    </div>
    <div className='w-1/2'>
      <h1 className='text-4xl font-bold mb-4'>Who We Are</h1>
      <p className='text-lg text-gray-700 mb-6'>
        We are a team of passionate individuals dedicated to providing innovative solutions for our clients. Our mission is to help businesses thrive in the digital age by offering cutting-edge technology and exceptional service.
      </p>
      <p className='text-lg text-gray-700'>
        With years of experience in the industry, we have built a reputation for delivering high-quality products and services that exceed our clients' expectations. We believe in fostering strong relationships with our clients and working collaboratively to achieve their goals.
      </p>
    </div>
  </div>
  )
}
