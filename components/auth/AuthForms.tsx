"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  forgotPasswordAction,
  loginAction,
  registerAction,
  resendConfirmationAction,
  updatePasswordAction,
  type AuthFormState,
} from "@/app/auth/actions";

const initialState: AuthFormState = { error: null, success: null };
const inputClassName =
  "mt-2 min-h-12 w-full rounded-xl border border-heather/20 bg-white px-4 text-sm text-ink placeholder:text-ink/35 focus:border-heather focus:outline-2 disabled:opacity-60";

function FormMessage({ state }: { state: AuthFormState }) {
  if (!state.error && !state.success) return null;

  return (
    <p
      role={state.error ? "alert" : "status"}
      className={`rounded-xl px-4 py-3 text-sm leading-6 ${
        state.error
          ? "border border-candy/30 bg-candy/10 text-ink"
          : "border border-viridian/30 bg-viridian/10 text-ink"
      }`}
    >
      {state.error || state.success}
    </p>
  );
}

function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-heather px-6 text-sm font-semibold text-white transition-colors hover:bg-[#756486] focus-visible:outline-2 disabled:cursor-wait disabled:opacity-65"
    >
      {pending ? "Attendi…" : children}
    </button>
  );
}

export function LoginForm({ nextPath = "/dashboard" }: { nextPath?: string }) {
  const [state, formAction] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="grid gap-5">
      <input type="hidden" name="next" value={nextPath} />
      <FormMessage state={state} />
      <label className="text-sm font-semibold text-ink">
        Email
        <input className={inputClassName} type="email" name="email" autoComplete="email" required />
      </label>
      <label className="text-sm font-semibold text-ink">
        Password
        <input
          className={inputClassName}
          type="password"
          name="password"
          autoComplete="current-password"
          required
        />
      </label>
      <div className="-mt-1 text-right">
        <Link
          href="/forgot-password"
          className="text-xs font-semibold text-heather underline decoration-heather/30 underline-offset-4"
        >
          Hai dimenticato la password?
        </Link>
      </div>
      <SubmitButton>Accedi</SubmitButton>
      <p className="text-center text-sm text-ink/60">
        Non hai ancora un account Flowintoone?{" "}
        <Link href="/register" className="font-semibold text-heather underline underline-offset-4">
          Crea un account
        </Link>
      </p>
    </form>
  );
}

export function RegisterForm() {
  const [state, formAction] = useActionState(registerAction, initialState);

  return (
    <form action={formAction} className="grid gap-5">
      <FormMessage state={state} />
      <label className="text-sm font-semibold text-ink">
        Nome e cognome
        <input
          className={inputClassName}
          type="text"
          name="fullName"
          autoComplete="name"
          minLength={2}
          maxLength={100}
          required
        />
      </label>
      <label className="text-sm font-semibold text-ink">
        Email
        <input className={inputClassName} type="email" name="email" autoComplete="email" required />
      </label>
      <label className="text-sm font-semibold text-ink">
        Password
        <input
          className={inputClassName}
          type="password"
          name="password"
          autoComplete="new-password"
          minLength={8}
          required
        />
        <span className="mt-2 block text-xs font-normal text-ink/50">Almeno 8 caratteri.</span>
      </label>
      <label className="text-sm font-semibold text-ink">
        Conferma password
        <input
          className={inputClassName}
          type="password"
          name="confirmPassword"
          autoComplete="new-password"
          minLength={8}
          required
        />
      </label>
      <SubmitButton>Crea il mio account</SubmitButton>
      <p className="text-center text-sm text-ink/60">
        Hai già un account?{" "}
        <Link href="/login" className="font-semibold text-heather underline underline-offset-4">
          Accedi
        </Link>
      </p>
    </form>
  );
}

export function ForgotPasswordForm() {
  const [state, formAction] = useActionState(forgotPasswordAction, initialState);

  return (
    <form action={formAction} className="grid gap-5">
      <FormMessage state={state} />
      <label className="text-sm font-semibold text-ink">
        Email
        <input className={inputClassName} type="email" name="email" autoComplete="email" required />
      </label>
      <SubmitButton>Invia link di reimpostazione</SubmitButton>
      <Link
        href="/login"
        className="text-center text-sm font-semibold text-heather underline underline-offset-4"
      >
        Torna all&apos;accesso
      </Link>
    </form>
  );
}

export function ResendConfirmationForm() {
  const [state, formAction] = useActionState(resendConfirmationAction, initialState);

  return (
    <form action={formAction} className="grid gap-5">
      <FormMessage state={state} />
      <label className="text-sm font-semibold text-ink">
        Email
        <input className={inputClassName} type="email" name="email" autoComplete="email" required />
      </label>
      <SubmitButton>Invia email di conferma</SubmitButton>
      <Link href="/login" className="text-center text-sm font-semibold text-heather underline underline-offset-4">Torna all&apos;accesso</Link>
    </form>
  );
}

export function UpdatePasswordForm() {
  const [state, formAction] = useActionState(updatePasswordAction, initialState);

  return (
    <form action={formAction} className="grid gap-5">
      <FormMessage state={state} />
      <label className="text-sm font-semibold text-ink">
        Nuova password
        <input
          className={inputClassName}
          type="password"
          name="password"
          autoComplete="new-password"
          minLength={8}
          required
        />
      </label>
      <label className="text-sm font-semibold text-ink">
        Conferma nuova password
        <input
          className={inputClassName}
          type="password"
          name="confirmPassword"
          autoComplete="new-password"
          minLength={8}
          required
        />
      </label>
      <SubmitButton>Aggiorna password</SubmitButton>
    </form>
  );
}
