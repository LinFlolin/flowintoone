"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { safeNextPath } from "@/lib/auth/session";
import { getPostAuthPath } from "@/lib/auth/roles";
import { getSiteUrl } from "@/lib/auth/site-url";

export type AuthFormState = {
  error: string | null;
  success: string | null;
};

const emptyState: AuthFormState = { error: null, success: null };

function getField(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function authErrorMessage(message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes("invalid login credentials")) {
    return "The email or password is incorrect.";
  }

  if (normalized.includes("email not confirmed")) {
    return "Please verify your email before signing in.";
  }

  if (normalized.includes("already registered") || normalized.includes("already exists")) {
    return "An account with this email already exists.";
  }

  if (normalized.includes("rate limit")) {
    return "Too many attempts. Please wait a moment and try again.";
  }

  return message;
}

export async function loginAction(
  _previousState: AuthFormState = emptyState,
  formData: FormData,
): Promise<AuthFormState> {
  void _previousState;
  const email = getField(formData, "email").toLowerCase();
  const password = getField(formData, "password");
  const requestedNextPath = getField(formData, "next");
  const nextPath = safeNextPath(requestedNextPath);

  if (!isEmail(email) || !password) {
    return { error: "Enter a valid email and password.", success: null };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: authErrorMessage(error.message), success: null };
  }

  redirect(
    requestedNextPath && nextPath !== "/dashboard"
      ? nextPath
      : data.user
        ? await getPostAuthPath(supabase, data.user.id)
        : nextPath,
  );
}

export async function registerAction(
  _previousState: AuthFormState = emptyState,
  formData: FormData,
): Promise<AuthFormState> {
  void _previousState;
  const fullName = getField(formData, "fullName");
  const email = getField(formData, "email").toLowerCase();
  const password = getField(formData, "password");
  const confirmPassword = getField(formData, "confirmPassword");

  if (fullName.length < 2 || fullName.length > 100) {
    return { error: "Enter your full name using 2 to 100 characters.", success: null };
  }

  if (!isEmail(email)) {
    return { error: "Enter a valid email address.", success: null };
  }

  if (password.length < 8) {
    return { error: "Use at least 8 characters for your password.", success: null };
  }

  if (password !== confirmPassword) {
    return { error: "The passwords do not match.", success: null };
  }

  const supabase = await createClient();
  const siteUrl = await getSiteUrl();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
      // The callback exchanges the code for a session before sending the user
      // to role selection, which then chooses the correct protected dashboard.
      emailRedirectTo: `${siteUrl}/auth/callback?next=/onboarding/role`,
    },
  });

  if (error) {
    return { error: authErrorMessage(error.message), success: null };
  }

  if (data.session) {
    redirect("/onboarding/role");
  }

  return {
    error: null,
    success: "Check your inbox and confirm your email to finish creating your account.",
  };
}

export async function forgotPasswordAction(
  _previousState: AuthFormState = emptyState,
  formData: FormData,
): Promise<AuthFormState> {
  void _previousState;
  const email = getField(formData, "email").toLowerCase();

  if (!isEmail(email)) {
    return { error: "Enter a valid email address.", success: null };
  }

  const supabase = await createClient();
  const siteUrl = await getSiteUrl();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/auth/callback?next=/update-password`,
  });

  if (error) {
    return { error: authErrorMessage(error.message), success: null };
  }

  return {
    error: null,
    success:
      "If an account exists for that email, you will receive a password reset link shortly.",
  };
}

export async function resendConfirmationAction(
  _previousState: AuthFormState = emptyState,
  formData: FormData,
): Promise<AuthFormState> {
  void _previousState;
  const email = getField(formData, "email").toLowerCase();
  if (!isEmail(email)) return { error: "Enter a valid email address.", success: null };

  const supabase = await createClient();
  const siteUrl = await getSiteUrl();
  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: { emailRedirectTo: `${siteUrl}/auth/callback?next=/onboarding/role` },
  });

  if (error) return { error: authErrorMessage(error.message), success: null };
  return { error: null, success: "If this account still needs confirmation, a new email is on its way." };
}

export async function updatePasswordAction(
  _previousState: AuthFormState = emptyState,
  formData: FormData,
): Promise<AuthFormState> {
  void _previousState;
  const password = getField(formData, "password");
  const confirmPassword = getField(formData, "confirmPassword");

  if (password.length < 8) {
    return { error: "Use at least 8 characters for your password.", success: null };
  }

  if (password !== confirmPassword) {
    return { error: "The passwords do not match.", success: null };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: authErrorMessage(error.message), success: null };
  }

  redirect("/dashboard?message=Password updated successfully.");
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
