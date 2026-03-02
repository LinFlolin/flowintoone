"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/api/client";


export default function Page() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    router.push("/dashboard"); // change to your real dashboard route
    router.refresh();
  }

  return (
    <div className="bg-linear-to-b text-Cream from-[#7217ba] from-90% md:from-60% to-[#f8f4ec] h-screen flex justify-center items-center">
      <div className="flex justify-center items-center flex-col bg-Cream h-1/2 w-1/4 text-Viola rounded-3xl shadow-2xl shadow-White/30">
        <Link href="/" className="text-sm mt-4 text-Viola hover:text-Orange transition-colors duration-300">
          <Image src="/Logo.png" className="mb-10" alt="Flowintoone Logo" width={90} height={90} />
        </Link>

        <form onSubmit={handleLogin} className="flex flex-col gap-6 mt-6 w-full items-center">
          <p className="font-extrabold">Login</p>

          <input
            className="bg-transparent border-b-2 border-Viola w-3/4 text-center text-Viola focus:outline-none focus:border-Orange transition-colors duration-300"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />

          <input
            className="bg-transparent border-b-2 border-Viola w-3/4 text-center text-Viola focus:outline-none focus:border-Orange transition-colors duration-300"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />

          {errorMsg && <p className="text-red-600 text-sm">{errorMsg}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-Orange text-Cream font-bold py-2 px-4 rounded-full mt-4 hover:bg-Viola-Light transition-colors duration-300 disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <div className="mt-4 flex flex-col gap-1 items-center">
          <Link href="/password-reset" className="text-[12px] text-Viola hover:text-Orange transition-colors duration-300">
            Forgot password?
          </Link>
          <Link href="/signup" className="text-[12px] text-Viola hover:text-Orange transition-colors duration-300">
            Don&apos;t have an account? Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}