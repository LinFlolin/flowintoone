"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/api/client";
import { useScrollTrigger } from "@app/ui/utils/useScrollTrigger";

export default function NavigationMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const scrolled = useScrollTrigger(5);
  const pathname = usePathname();

  function toggleMenu() {
    setIsOpen((prev) => !prev);
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setAuthReady(true);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setAuthReady(true);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  async function handleLogout() {
  await supabase.auth.signOut();
  await fetch("/session", {
    method: "DELETE",
  });

  window.location.href = "/";
}

  return (
    <>
      <div
        id="nav-menu"
        className={`w-screen fixed z-50 flex justify-between items-center p-2 md:hidden transition-colors duration-500 ${
          !isOpen && scrolled ? "bg-Cream" : "bg-transparent"
        }`}
      >
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
            alt="Menu"
            width={25}
            height={25}
          />
        </button>
      </div>

      <nav
        className={`md:hidden fixed top-0 right-0 z-50 text-white font-bold font-nunito flex flex-col justify-around items-center p-4 shadow-m bg-Viola-Light h-screen w-2/3 sm:w-1/2 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          className="absolute top-4 right-4 text-2xl"
          onClick={() => setIsOpen(false)}
        >
          ✕
        </button>

        <Link href="/chi-siamo">Chi siamo</Link>
        <Link href="/esplora">Esplora</Link>
        <Link href="/news">News</Link>

        {user ? (
            <div className="flex flex-col items-center gap-2">
              <Link href="/dashboard">
                <div className="w-10 h-10 rounded-full bg-white text-Viola flex items-center justify-center font-bold">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
              </Link>

              <button
                onClick={handleLogout}
                className="text-sm text-white hover:text-Orange"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link href="/login">Log in</Link>
          )}
      </nav>

      <nav className="hidden md:bg-background md:flex md:font-bold md:h-15 md:flex-row md:gap-6 md:text-Viola md:items-center md:p-4 md:justify-evenly md:shadow-sm md:sticky md:top-0 md:w-full md:z-50">
        <Link className="hover:text-Orange focus:text-Orange" href="/chi-siamo">
          Chi siamo
        </Link>
        <Link className="hover:text-Orange focus:text-Orange" href="/esplora">
          Esplora
        </Link>

        <Link href="/" className="md:mx-4">
          <Image
            src="/Logo.png"
            alt="Flowintoone Logo"
            width={50}
            height={60}
          />
        </Link>

        <Link className="hover:text-Orange focus:text-Orange" href="/news">
          News
        </Link>

        {user ? (
          <>
            <Link href="/dashboard">
            <div className="w-10 h-10 rounded-full bg-Viola text-white flex items-center justify-center font-bold">
                {user.email?.charAt(0).toUpperCase()}
              </div>
            </Link>

            <button
              onClick={handleLogout}
              className="text-md  hover:text-Orange"
            >
              Logout
            </button>
            </>
        ) : (
          <Link href="/login">Log in</Link>
        )}
      </nav>
    </>
  );
}