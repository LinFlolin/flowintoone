"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/api/client";

export default function UpdatePasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function checkRecoverySession() {
      const { data, error } = await supabase.auth.getSession();

      if (!mounted) return;

      if (error || !data.session) {
        setErrorMsg("Invalid or expired reset link.");
      }

      setCheckingSession(false);
    }

    checkRecoverySession();

    return () => {
      mounted = false;
    };
  }, []);

  async function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirm) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    setSuccessMsg("Password updated successfully.");

    setTimeout(() => {
      router.push("/login");
      router.refresh();
    }, 1200);
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
          onSubmit={handleUpdatePassword}
          className="flex flex-col gap-6 mt-6 w-full items-center"
        >
          <p className="font-extrabold">Set new password</p>

          <input
            className="bg-transparent border-b-2 border-Viola w-3/4 text-center text-Viola focus:outline-none focus:border-Orange transition-colors duration-300"
            placeholder="New password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            disabled={checkingSession}
          />

          <input
            className="bg-transparent border-b-2 border-Viola w-3/4 text-center text-Viola focus:outline-none focus:border-Orange transition-colors duration-300"
            placeholder="Confirm new password"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
            disabled={checkingSession}
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
            disabled={loading || checkingSession}
            className="bg-Orange text-Cream font-bold py-2 px-4 rounded-full mt-4 hover:bg-Viola-Light transition-colors duration-300 disabled:opacity-60"
          >
            {checkingSession
              ? "Checking..."
              : loading
              ? "Updating..."
              : "Update password"}
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