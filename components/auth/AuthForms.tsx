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
      {pending ? "Please wait…" : children}
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
          Forgot your password?
        </Link>
      </div>
      <SubmitButton>Login</SubmitButton>
      <p className="text-center text-sm text-ink/60">
        New to Flowintoone?{" "}
        <Link href="/register" className="font-semibold text-heather underline underline-offset-4">
          Create an account
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
        Full name
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
        <span className="mt-2 block text-xs font-normal text-ink/50">At least 8 characters.</span>
      </label>
      <label className="text-sm font-semibold text-ink">
        Confirm password
        <input
          className={inputClassName}
          type="password"
          name="confirmPassword"
          autoComplete="new-password"
          minLength={8}
          required
        />
      </label>
      <SubmitButton>Create my account</SubmitButton>
      <p className="text-center text-sm text-ink/60">
        Already registered?{" "}
        <Link href="/login" className="font-semibold text-heather underline underline-offset-4">
          Login
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
      <SubmitButton>Send reset link</SubmitButton>
      <Link
        href="/login"
        className="text-center text-sm font-semibold text-heather underline underline-offset-4"
      >
        Back to login
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
      <SubmitButton>Send confirmation email</SubmitButton>
      <Link href="/login" className="text-center text-sm font-semibold text-heather underline underline-offset-4">Back to login</Link>
    </form>
  );
}

export function UpdatePasswordForm() {
  const [state, formAction] = useActionState(updatePasswordAction, initialState);

  return (
    <form action={formAction} className="grid gap-5">
      <FormMessage state={state} />
      <label className="text-sm font-semibold text-ink">
        New password
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
        Confirm new password
        <input
          className={inputClassName}
          type="password"
          name="confirmPassword"
          autoComplete="new-password"
          minLength={8}
          required
        />
      </label>
      <SubmitButton>Update password</SubmitButton>
    </form>
  );
}
