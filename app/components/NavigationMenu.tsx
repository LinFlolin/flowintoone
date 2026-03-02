"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useScrollTrigger } from "@app/ui/utils/useScrollTrigger";


export default function NavigationMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const scrolled  = useScrollTrigger(5);

  function toggleMenu () {
    setIsOpen(!isOpen);
  }

  return (
    <>
     <div id="nav-meunu" className={` w-screen fixed z-50 flex justify-between items-center p-2 md:hidden transition-colors duration-500 ${!isOpen && scrolled ? "bg-Cream " : "bg-transparent"}`}>
        <Link href="/">
          <Image
            src="/Logo.png"
            alt="Flowintoone Logo"
            width={36}
            height={36}
          />
        </Link>
        <button onClick={toggleMenu} className="flex flex-col gap-1">
            <Image
              src="/menu_mobile.png"
              alt="Flowintoone Logo"
              width={25}
              height={25}
            />
        </button>
      </div>
      
    

      <nav
        className={
          `md:hidden navigation_munu fixed top-0 right-0 z-50 text-white font-bold font-nunito flex flex-col justify-around items-center p-4 shadow-m bg-Viola-Light h-screen w-1/3 transform transition-transform duration-300 
          ${isOpen ? "translate-x-0" : "translate-x-full"} `
        }
      >
        <button className="absolute top-4 right-4 text-2xl" onClick={() => setIsOpen(false)}>
          ✕
        </button>

        <Link href="/chi-siamo" onClick={() => setIsOpen(false)}>Chi siamo</Link>
        <Link href="/esplora" onClick={() => setIsOpen(false)}>Esplora</Link>
        <Link href="/news" onClick={() => setIsOpen(false)}>News</Link>
        <Link href="/authentication" onClick={() => setIsOpen(false)}>Log in</Link>
      </nav>

      {/* DESKTOP MENU */}
      
      <nav className="navigation_munu_desktop hidden md:bg-background md:flex md:font-bold md:h-15 md:flex-row md:gap-6 md:text-Viola md:items-center md:p-4 md:justify-evenly md:shadow-sm md:sticky md:top-0 md:w-full md:z-50 ">
      
        <Link className="hover:text-Orange focus:text-Orange" href="/chi-siamo">Chi siamo</Link>
        <Link className="hover:text-Orange focus:text-Orange" href="/esplora">Esplora</Link>

        <Link href="/" className="md:mx-4">
          <Image src="/Logo.png" alt="Flowintoone Logo" width={50} height={60} />
        </Link>

        <Link className="hover:text-Orange focus:text-Orange" href="/news">News</Link>
        <Link className="hover:text-Orange focus:text-Orange" href="/authentication">Log in</Link>
      </nav>
    </>
  );
}
