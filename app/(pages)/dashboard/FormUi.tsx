import React, { Children } from 'react'

export default function FormUi({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center w-screen h-svh bg-linear-to-b text-Cream z-20 from-[#7217ba]">
      <div className="bg-Cream/80 rounded-lg shadow-lg p-8 flex items-center w-4/5 h-4/5">
        {children}
      </div>
    </div>
  )
}
