import Link from "next/link";
import { requireUser } from "@/lib/auth/session";
import { updateProfileAction } from "./actions";

type ProfilePageProps = {
  searchParams: Promise<{ error?: string; message?: string }>;
};

type ProfileRow = {
  id: string;
  full_name: string | null;
};

export default async function ProfilePage({ searchParams }: ProfilePageProps) {
  const { supabase, userId, email } = await requireUser();
  const params = await searchParams;
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name")
    .eq("id", userId)
    .maybeSingle();
  const profile = data as ProfileRow | null;

  return (
    <main className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16 lg:px-10">
      <Link
        href="/dashboard"
        className="text-sm font-semibold text-heather underline decoration-heather/30 underline-offset-4"
      >
        ← Back to dashboard
      </Link>

      <div className="mt-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-heather">
          Account details
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.045em] text-ink sm:text-5xl">
          Your profile.
        </h1>
        <p className="mt-4 text-sm leading-6 text-ink/60">
          Keep the name used to welcome you in your artisan dashboard up to date.
        </p>
      </div>

      {(params.error || params.message) && (
        <p
          role={params.error ? "alert" : "status"}
          className={`mt-8 rounded-xl border px-4 py-3 text-sm leading-6 ${
            params.error
              ? "border-candy/25 bg-candy/10 text-ink"
              : "border-viridian/25 bg-viridian/10 text-ink"
          }`}
        >
          {params.error || params.message}
        </p>
      )}

      {error ? (
        <div className="mt-8 rounded-[2rem] border border-candy/25 bg-candy/10 p-7 text-sm leading-6 text-ink">
          Your profile could not be loaded. Confirm that the profile RLS policies are active,
          then try again.
        </div>
      ) : !profile ? (
        <div className="mt-8 rounded-[2rem] border border-heather/15 bg-white/60 p-7 text-sm leading-6 text-ink/65">
          Your profile has not appeared yet. The database trigger should create it
          automatically; refresh this page shortly or verify the trigger in Supabase.
        </div>
      ) : (
        <form
          action={updateProfileAction}
          className="mt-8 grid gap-6 rounded-[2rem] border border-heather/15 bg-white/65 p-6 sm:p-10"
        >
          <label className="text-sm font-semibold text-ink">
            Full name
            <input
              className="mt-2 min-h-12 w-full rounded-xl border border-heather/20 bg-white px-4 text-sm text-ink focus:border-heather focus:outline-2"
              name="fullName"
              defaultValue={profile.full_name ?? ""}
              autoComplete="name"
              minLength={2}
              maxLength={100}
              required
            />
          </label>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.13em] text-ink/45">
              Account email
            </p>
            <p className="mt-2 text-sm text-ink/70">{email || "Unavailable"}</p>
          </div>
          <button
            type="submit"
            className="inline-flex min-h-12 w-fit items-center justify-center rounded-full bg-heather px-7 text-sm font-semibold text-white transition-colors hover:bg-[#756486] focus-visible:outline-2"
          >
            Save profile
          </button>
        </form>
      )}
    </main>
  );
}
