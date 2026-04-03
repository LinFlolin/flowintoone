'use client'

import React, { useState } from 'react'

const plans = [
  {
    id: 1,
    title: 'Basic',
    price: '€9,99/mo',
    description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Consequuntur magnam labore facilis error inventore, molestiae velit quisquam ratione sint sit necessitatibus neque quia laborum quasi voluptatem culpa, impedit ipsam assumenda?', 
  },
  {
    id: 2,
    title: 'Normal',
    price: '€16,99/mo',
    description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Consequuntur magnam labore facilis error inventore, molestiae velit quisquam ratione sint sit necessitatibus neque quia laborum quasi voluptatem culpa, impedit ipsam assumenda?', 
  },
  {
    id: 3,
    title: 'Special',
    price: '€24,99/mo',
    description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Consequuntur magnam labore facilis error inventore, molestiae velit quisquam ratione sint sit necessitatibus neque quia laborum quasi voluptatem culpa, impedit ipsam assumenda?',
  },
]

export default function SubscriptionCard() {
  const [active, setActive] = useState(1) // middle card is default

  return (
    <section className="bg-gradient-to-b from-[#7217ba] to-[#f8f4ec] text-Cream min-h-[60vh] flex items-center justify-center px-4">
      <div
        className="relative w-full max-w-6xl h-[500px] flex items-center justify-center "
        onMouseLeave={() => setActive(1)} 
      >
        {plans.map((plan, index) => {
          const isActive = active === index

          let positionClasses = ''
          let textColor = ''
          let zIndex = 'z-10'
          let scale = 'scale-90'
          let blur = active !== 1 && !isActive ? 'blur-[1px]' : ''
          let opacity = 'opacity-90'

          if (index === 0) {
            positionClasses = '-translate-x-[55%] md:-translate-x-[100%]'
          }

          if (index === 1) {
            positionClasses = 'translate-x-0'
            zIndex = isActive ? 'z-30' : 'z-20'
            scale = 'scale-100'
            blur = active !== 1 && !isActive ? 'blur-[2px]' : ''
            opacity = 'opacity-100'
          }

          if (index === 2) {
            positionClasses = 'translate-x-[55%] md:translate-x-[100%]'
          }

          if (isActive && index !== 1) {
            zIndex = 'z-30'
            scale = 'scale-100'
            blur = ''
            opacity = 'opacity-100'
            textColor = 'Orange'
          }

          return (
            <div
              key={plan.id}
              onMouseEnter={() => setActive(index)}
              className={`
                absolute w-5 md:w-96 h-full
                rounded-3xl bg-white text-black shadow-2xl
                transition-all duration-500 ease-in-out content-center
                ${positionClasses}
                ${zIndex}
                ${scale}
                ${blur}
                ${opacity}
              `}
            >
              <div className="flex h-11/12 flex-col justify-around m-2 px-5 border-2 border-gray-300 rounded-3xl">
                <div className="flex flex-col h-1/2 justify-evenly">
                  <h3 className={`text-2xl font-bold ${isActive ? 'text-orange-500' : ''}`}>
                    {plan.title}
                  </h3>

                  <p className={`mt-3 text-4xl font-extrabold ${isActive ? 'text-orange-500' : ''}`}>
                    {plan.price}
                  </p>

                  <p className="mt-4 text-md text-gray-600 ">
                    {plan.description}
                  </p>
                </div>

                <button className="rounded-full hover:animate-bounce hover:bg-Orange bg-[#7217ba]  py-3 text-white font-semibold hover:opacity-90 transition">
                  Choose Plan
                </button>
                
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}