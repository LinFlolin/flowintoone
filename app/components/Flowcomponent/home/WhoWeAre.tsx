import React from 'react'
import FadeInOnScroll from '@app/ui/FadeInOnScroll'
import Link from 'next/link'

export default function WhoWeAre() {

  return (
  <div className='w-full flex justify-evenly items-center py-20'>
    <div className='w-100'>
      <FadeInOnScroll delay={100}  mobileVariant='zoom-in' desktopVariant='blur-in' >
        <img src="/about-us.jpg" alt="Who We Are" className='w-full h-auto rounded-lg shadow-lg' />
      </FadeInOnScroll>
    </div>
    <div className='w-1/2 flex flex-col justify-center items-start px-10'>
      <FadeInOnScroll delay={100}  mobileVariant='zoom-in' desktopVariant='fade-down' className='self-start relative z-10 bottom-10 '  >
        <img src="/tre_bubble_left.png" alt="Who We Are" className='w-40 self-start rotate-35 ' />
      </FadeInOnScroll>
      <div>
        <h1 className='text-4xl font-bold mb-4'>Who We Are</h1>
        <p className='text-lg text-gray-700 mb-6'>
          We are a team of passionate individuals dedicated to providing innovative solutions for our clients. Our mission is to help businesses thrive in the digital age by offering cutting-edge technology and exceptional service.
        </p>
        <p className='text-lg text-gray-700'>
          With years of experience in the industry, we have built a reputation for delivering high-quality products and services that exceed our clients' expectations. We believe in fostering strong relationships with our clients and working collaboratively to achieve their goals.
        </p>
      </div>
      <button className='mt-6 px-6 py-3 bg-Viola w-fit text-white rounded-lg hover:bg-Orange transition duration-300'>
        <Link href="/chi-siamo">Learn More</Link>
      </button>
      <FadeInOnScroll delay={100}  mobileVariant='zoom-in' desktopVariant='fade-up' className='self-end relative z-10 bottom-10 ' >
        <img src="/bubble-3.png" alt="Who We Are" className='w-40' />
      </FadeInOnScroll>
    </div>
  </div>
  )
}
