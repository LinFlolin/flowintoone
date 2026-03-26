import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const RATE_LIMIT = 100;
const WINDOW = 60 * 1000;

const ipMap = new Map<string, { count: number; time: number }>();

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const res = NextResponse.next();

  const isAuthRoute =
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/session") ||
    pathname.startsWith("/password-reset");

  const isProtectedRoute = pathname.startsWith("/dashboard");

  // Rate limiting for auth-related routes
  if (isAuthRoute) {
    const forwardedFor = req.headers.get("x-forwarded-for");
    const ip = forwardedFor?.split(",")[0]?.trim() || "unknown";
    const now = Date.now();

    const entry = ipMap.get(ip);

    if (!entry || now - entry.time > WINDOW) {
      ipMap.set(ip, { count: 1, time: now });
    } else {
      entry.count += 1;

      if (entry.count > RATE_LIMIT) {
        return new NextResponse("Too many requests", { status: 429 });
      }
    }
  }

  // Protect dashboard routes
  if (isProtectedRoute) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return req.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              res.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      const url = req.nextUrl.clone();
      url.pathname = "/authentication";
      url.searchParams.set("redirectedFrom", pathname);
      return NextResponse.redirect(url);
    }
  }

  return res;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/signup",
    "/session",
    "/password-reset",
  ],
};