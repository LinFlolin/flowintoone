"use client";

import { useFormStatus } from "react-dom";

export function StorefrontSubmitButtons({
  exists,
  isPublished,
  disabled = false,
}: {
  exists: boolean;
  isPublished: boolean;
  disabled?: boolean;
}) {
  const { pending } = useFormStatus();

  return (
    <div className="flex flex-col gap-3 border-t border-heather/10 pt-7 sm:flex-row">
      <button
        type="submit"
        name="intent"
        value="save"
        disabled={pending || disabled}
        className="inline-flex min-h-12 items-center justify-center rounded-full bg-heather px-7 text-sm font-semibold text-white transition-colors hover:bg-[#756486] disabled:cursor-wait disabled:opacity-60"
      >
        {pending ? "Saving and uploading…" : exists ? "Save changes" : "Create draft"}
      </button>
      {exists && !isPublished && (
        <button
          type="submit"
          name="intent"
          value="publish"
          disabled={pending || disabled}
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-viridian/45 bg-viridian/10 px-7 text-sm font-semibold text-[#477b7b] transition-colors hover:bg-viridian/20 disabled:cursor-wait disabled:opacity-60"
        >
          Publish storefront
        </button>
      )}
    </div>
  );
}
