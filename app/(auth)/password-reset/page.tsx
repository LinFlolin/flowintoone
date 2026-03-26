"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/api/client";

export default function PasswordResetPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  async function handleResetRequest(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setErrorMsg("Please enter your email.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    setSuccessMsg("Password reset email sent. Check your inbox.");
  }

  return (
    <div className="bg-linear-to-b text-Cream from-[#7217ba] from-90% md:from-60% to-[#f8f4ec] h-screen flex justify-center items-center">
      <div className="p-10 outline-2 outline-offset-8 outline-Cream flex justify-center items-center flex-col bg-Cream w-1/4 text-Viola rounded-3xl shadow-2xl shadow-White/30">
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

        <form
          onSubmit={handleResetRequest}
          className="flex flex-col gap-6 mt-6 w-full items-center"
        >
          <p className="font-extrabold">Reset password</p>

          <input
            className="bg-transparent border-b-2 border-Viola w-3/4 text-center text-Viola focus:outline-none focus:border-Orange transition-colors duration-300"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />

          {errorMsg && (
            <p className="text-red-600 text-sm text-center w-3/4">{errorMsg}</p>
          )}

          {successMsg && (
            <p className="text-green-700 text-sm text-center w-3/4">
              {successMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-Orange text-Cream font-bold py-2 px-4 rounded-full mt-4 hover:bg-Viola-Light transition-colors duration-300 disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send reset email"}
          </button>
        </form>

        <div className="mt-4 flex flex-col gap-1 items-center">
          <Link
            href="/login"
            className="text-[12px] text-Viola hover:text-Orange transition-colors duration-300"
          >
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}