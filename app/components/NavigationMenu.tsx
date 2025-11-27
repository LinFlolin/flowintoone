"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function NavigationMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* when mobile menu is active it */}
      <div className="flex justify-between items-center p-4 md:hidden ">
        <Link href="/">
          <Image
            src="/Logo.png"
            alt="Flowintoone Logo"
            width={36}
            height={36}
          />
        </Link>

        {/* BURGER BUTTON */}
        <button onClick={() => setIsOpen(!isOpen)} className="flex flex-col gap-1">
            <span className={`h-0.5 w-6 bg-Viola transition-transform ${isOpen ? "rotate-45 translate-y-1" : ""}`} />
            <span className={`h-0.5 w-6 bg-Viola transition-opacity ${isOpen ? "opacity-0" : "opacity-100"}`} />
            <span className={`h-0.5 w-6 bg-Viola transition-transform ${isOpen ? "-rotate-45 -translate-y-1" : ""}`} />
        </button>
      </div>


      <nav
        className={
          `navigation_munu fixed top-0 right-0 z-50 text-white font-bold font-nunito flex flex-col justify-around items-center p-4 shadow-m bg-Green-pastel h-screen w-1/3 transform transition-transform duration-300 
          ${isOpen ? "translate-x-0" : "translate-x-full"} md:hidden`
        }
      >
        <button className="absolute top-4 right-4 text-2xl" onClick={() => setIsOpen(false)}>
          ✕
        </button>

        <Link href="/chi-siamo" onClick={() => setIsOpen(false)}>Chi siamo</Link>
        <Link href="/esplora" onClick={() => setIsOpen(false)}>Esplora</Link>
        <Link href="/news" onClick={() => setIsOpen(false)}>News</Link>
        <Link href="/log-in" onClick={() => setIsOpen(false)}>Log in</Link>
      </nav>

      {/* DESKTOP MENU */}
      
      <nav className="navigation_munu_desktop hidden md:bg-background md:flex md:font-bold md:h-15 md:flex-row md:gap-6 md:text-Viola md:items-center md:p-4 md:justify-evenly md:shadow-sm md:sticky md:top-0 md:w-full ">
      
        <Link className="hover:text-Orange focus:text-Orange" href="/chi-siamo">Chi siamo</Link>
        <Link className="hover:text-Orange focus:text-Orange" href="/esplora">Esplora</Link>

        <Link href="/" className="md:mx-4">
          <Image src="/Logo.png" alt="Flowintoone Logo" width={50} height={60} />
        </Link>

        <Link className="hover:text-Orange focus:text-Orange" href="/news">News</Link>
        <Link className="hover:text-Orange focus:text-Orange" href="/log-in">Log in</Link>
      </nav>
    </>
  );
}
