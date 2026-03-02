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
  const [confirm, setConfirm] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim()) {
      setErrorMsg("Please enter your email.");
      return;
    }
    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/callback?next=/dashboard`,
      },
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    setSuccessMsg(
      "Account created! Check your email to confirm your account, then come back to log in."
    );

    
    setTimeout(() => router.push("/authentication"), 1500);
  }

  return (
    <div className="bg-linear-to-b text-Cream from-[#7217ba] from-90% md:from-60% to-[#f8f4ec] h-screen flex justify-center items-center">
      <div className="flex justify-center items-center flex-col bg-Cream  w-1/4 text-Viola rounded-3xl shadow-2xl shadow-White/30">
        <Link
          href="/"
          className="text-sm mt-4 text-Viola hover:text-Orange transition-colors duration-300"
        >
          <Image
            src="/Logo.png"
            className="mb-10"
            alt="Flowintoone Logo"
            width={90}
            height={90}
          />
        </Link>

        <form onSubmit={handleSignup} className="flex flex-col gap-6 mt-2 w-full items-center">
          <p className="font-extrabold">Sign up</p>

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
            autoComplete="new-password"
          />

          <input
            className="bg-transparent border-b-2 border-Viola w-3/4 text-center text-Viola focus:outline-none focus:border-Orange transition-colors duration-300"
            placeholder="Confirm password"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
          />

          {errorMsg && <p className="text-red-600 text-sm text-center w-3/4">{errorMsg}</p>}
          {successMsg && <p className="text-green-700 text-sm text-center w-3/4">{successMsg}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-Orange text-Cream font-bold py-2 px-4 rounded-full mt-2 hover:bg-Viola-Light transition-colors duration-300 disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create account"}
          </button>
          
        </form>
         <div className="mt-4 flex flex-col items-center">
          <Link
            href="/authentication"
            className="text-[12px] text-Viola hover:text-Orange transition-colors duration-300"
          >
            Already have an account? Log in
          </Link>
        </div>
       
      </div>
    </div>
  );
}