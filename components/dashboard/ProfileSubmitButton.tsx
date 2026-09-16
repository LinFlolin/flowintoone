"use client";

import { useFormStatus } from "react-dom";

export function ProfileSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-12 w-fit items-center justify-center rounded-full bg-heather px-7 text-sm font-semibold text-white transition-colors hover:bg-[#756486] focus-visible:outline-2 disabled:cursor-wait disabled:opacity-65"
    >
      {pending ? "Saving profile…" : "Save profile"}
    </button>
  );
}
