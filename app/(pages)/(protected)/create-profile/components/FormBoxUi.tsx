import React, { Children } from 'react'

export default function FormBoxUi({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-linear-to-b text-Cream from-[#7217ba] from-90% md:from-60% to-[#f8f4ec] h-screen flex justify-center items-center ${className || ''}`}>
      <div className="h-4/5 w-4/5 bg-Cream overflow-hidden rounded-xl shadow-lg flex md:flex-row justify-center items-center">
        {children}
      </div>
    </div>
  )
}
