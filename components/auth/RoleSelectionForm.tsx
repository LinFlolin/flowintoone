"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { selectRoleAction, type RoleFormState } from "@/app/onboarding/role/actions";

const initialState: RoleFormState = { error: null };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-8 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-heather px-6 text-sm font-semibold text-white transition-colors hover:bg-[#756486] disabled:cursor-wait disabled:opacity-60"
    >
      {pending ? "Salvataggio…" : "Continua"}
    </button>
  );
}

export function RoleSelectionForm() {
  const [state, formAction] = useActionState(selectRoleAction, initialState);

  return (
    <form action={formAction}>
      {state.error && <p role="alert" className="mb-5 rounded-xl bg-candy/10 px-4 py-3 text-sm leading-6">{state.error}</p>}
      <fieldset>
        <legend className="sr-only">Account type</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="cursor-pointer rounded-2xl border border-heather/20 bg-white/55 p-5 has-[:checked]:border-heather has-[:checked]:bg-[#f7eef6]">
            <input className="sr-only" type="radio" name="role" value="visitor" required />
            <span className="block text-lg font-semibold">Sono qui per esplorare</span>
            <span className="mt-2 block text-sm leading-6 text-ink/60">Scopri creator indipendenti e il loro lavoro.</span>
          </label>
          <label className="cursor-pointer rounded-2xl border border-heather/20 bg-white/55 p-5 has-[:checked]:border-heather has-[:checked]:bg-[#f7eef6]">
            <input className="sr-only" type="radio" name="role" value="artisan" required />
            <span className="block text-lg font-semibold">Sono un creator</span>
            <span className="mt-2 block text-sm leading-6 text-ink/60">Crea e pubblica un sito per la tua attività.</span>
          </label>
        </div>
      </fieldset>
      <SubmitButton />
    </form>
  );
}
