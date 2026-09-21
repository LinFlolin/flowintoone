import { NextResponse, type NextRequest } from "next/server";
import { safeNextPath } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  // New-account confirmation links should enter the creation flow even when
  // an older or custom email template omits the `next` query parameter.
  const nextPath = safeNextPath(requestUrl.searchParams.get("next"), "/onboarding/role");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(new URL(nextPath, requestUrl.origin));
    }
  }

  const loginUrl = new URL("/login", requestUrl.origin);
  loginUrl.searchParams.set(
    "error",
    "The authentication link is invalid or has expired. Please try again.",
  );
  loginUrl.searchParams.set("resend", "1");
  return NextResponse.redirect(loginUrl);
}
