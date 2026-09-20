"use client";

import { useFormStatus } from "react-dom";

export function DeleteAccountButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-11 items-center justify-center rounded-full bg-candy px-5 text-sm font-semibold text-white transition-colors hover:bg-[#a95d76] focus-visible:outline-2 disabled:cursor-wait disabled:opacity-65"
    >
      {pending ? "Deleting account…" : "Delete my account"}
    </button>
  );
}
