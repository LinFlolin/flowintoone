import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { safeNextPath } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const tokenHash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type") as EmailOtpType | null;
  // Email confirmation is the entry point for new users, so a confirmation
  // link without an explicit destination should begin website creation.
  const nextPath = safeNextPath(requestUrl.searchParams.get("next"), "/onboarding/role");

  if (tokenHash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });

    if (!error) {
      return NextResponse.redirect(new URL(nextPath, requestUrl.origin));
    }
  }

  const loginUrl = new URL("/login", requestUrl.origin);
  loginUrl.searchParams.set(
    "error",
    "The verification link is invalid or has expired. Please request a new one.",
  );
  loginUrl.searchParams.set("resend", "1");
  return NextResponse.redirect(loginUrl);
}
