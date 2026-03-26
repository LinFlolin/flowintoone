import React, { Children } from 'react'

export default function FormUi({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center w-screen bg-linear-to-b text-Cream z-20 from-[#7217ba]">
      <div className="bg-Cream/50 p-8 flex items-center h-screen-custom w-full ">
        {children}
      </div>
    </div>
  )
}
