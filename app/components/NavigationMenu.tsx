import Link from 'next/link'
import Image from 'next/image'
import React from 'react'

export default function NavigationMenu() {
  return (
    <nav className="navigation_munu text-white font-bold font flex flex-col justify-around p-4 shadow-m md:items-center md:flex-row md:text-Viola ">
      <Link href="/">
        <Image 
          src="/Logo.png" 
          alt="Flowintoone Logo" 
          width={50} 
          height={60} 
          className="logo"
        />
      </Link>

      <Link href="/chi-siamo">Chi siamo</Link>
      <Link href="/esplora">Esplora</Link>
      <Link href="/news">News</Link>
      <Link href="/log-in">Log in</Link>
    </nav>
  )
}
