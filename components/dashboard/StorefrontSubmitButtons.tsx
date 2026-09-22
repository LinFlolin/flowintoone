"use client";

import { useFormStatus } from "react-dom";
import { FlowLoader } from "@/components/ui/FlowLoader";

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
        {pending ? <><FlowLoader size={20} message="Salvataggio e caricamento" />Salvataggio e caricamento…</> : exists ? "Salva modifiche" : "Crea bozza"}
      </button>
      {exists && (
        <button
          type="submit"
          name="intent"
          value="publish"
          disabled={pending || disabled}
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-viridian/45 bg-viridian/10 px-7 text-sm font-semibold text-[#477b7b] transition-colors hover:bg-viridian/20 disabled:cursor-wait disabled:opacity-60"
        >
        {pending ? <><FlowLoader size={20} message="Pubblicazione sito" />Pubblicazione…</> : isPublished ? "Ripubblica sito" : "Pubblica sito"}
        </button>
      )}
    </div>
  );
}
