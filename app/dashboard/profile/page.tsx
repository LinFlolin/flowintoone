import Link from "next/link";
import { DeleteAccountButton } from "@/components/dashboard/DeleteAccountButton";
import { ProfileAvatarField } from "@/components/dashboard/ProfileAvatarField";
import { ProfileSubmitButton } from "@/components/dashboard/ProfileSubmitButton";
import { requireUser } from "@/lib/auth/session";
import { isOwnedProfileAvatarPath, PROFILE_AVATAR_BUCKET } from "@/lib/profile/avatar";
import { deleteAccountAction, updateProfileAction } from "./actions";

type ProfilePageProps = {
  searchParams: Promise<{ error?: string; message?: string }>;
};

type ProfileRow = {
  id: string;
  full_name: string | null;
  city: string | null;
  country: string | null;
  avatar_path: string | null;
};

function getInitials(fullName: string | null, email: string | null) {
  const nameInitials = fullName
    ?.split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return nameInitials || email?.charAt(0).toUpperCase() || "F";
}

export default async function ProfilePage({ searchParams }: ProfilePageProps) {
  const { supabase, userId, email } = await requireUser();
  const params = await searchParams;
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, city, country, avatar_path")
    .eq("id", userId)
    .maybeSingle();
  const profile = data as ProfileRow | null;

  let avatarUrl: string | null = null;
  if (profile && isOwnedProfileAvatarPath(profile.avatar_path, userId)) {
    const { data: signedAvatar, error: avatarError } = await supabase.storage
      .from(PROFILE_AVATAR_BUCKET)
      .createSignedUrl(profile.avatar_path, 60 * 60);

    if (avatarError) {
      console.error(
        `[profile:avatar-read] Supabase request failed ${JSON.stringify({
          message: avatarError.message ?? null,
        })}`,
      );
    } else {
      avatarUrl = signedAvatar.signedUrl;
    }
  }

  return (
    <section className="w-full py-4 sm:py-8">
      <Link
        href="/dashboard"
        className="text-sm font-semibold text-heather underline decoration-heather/30 underline-offset-4"
      >
        ← Torna alla dashboard
      </Link>

      <div className="mt-8 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-heather">
          Dettagli account
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.045em] text-ink sm:text-5xl">
          Il tuo profilo<span className="text-candy">.</span>
        </h1>
        <p className="mt-4 text-sm leading-7 text-ink/60 sm:text-base">
          Mantieni aggiornati i tuoi dati personali e scegli come apparire nel tuo spazio
          creativo.
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
          Non è stato possibile caricare il profilo. Verifica che la migrazione Profile 2.0
          sia stata applicata, poi riprova.
        </div>
      ) : !profile ? (
        <div className="mt-8 rounded-[2rem] border border-heather/15 bg-white/60 p-7 text-sm leading-6 text-ink/65">
          Il tuo profilo non è ancora disponibile. Il database dovrebbe crearlo
          automaticamente; aggiorna la pagina tra poco o verifica il trigger in Supabase.
        </div>
      ) : (
        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_18rem] lg:items-start">
          <form
            action={updateProfileAction}
            className="grid gap-8 rounded-[2rem] border border-heather/15 bg-white/65 p-6 sm:p-10"
          >
            <div className="grid gap-8 border-b border-heather/10 pb-8 lg:grid-cols-[12rem_1fr]">
              <ProfileAvatarField
                avatarUrl={avatarUrl}
                initials={getInitials(profile.full_name, email)}
              />

              <fieldset className="grid gap-6 border-0 p-0">
                <legend className="text-sm font-semibold text-ink">Dati personali</legend>

                <label className="text-sm font-semibold text-ink">
                  Nome completo
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

                <div className="grid gap-6 sm:grid-cols-2">
                  <label className="text-sm font-semibold text-ink">
                    Città <span className="font-normal text-ink/45">(facoltativa)</span>
                    <input
                      className="mt-2 min-h-12 w-full rounded-xl border border-heather/20 bg-white px-4 text-sm text-ink focus:border-heather focus:outline-2"
                      name="city"
                      defaultValue={profile.city ?? ""}
                      autoComplete="address-level2"
                      maxLength={120}
                    />
                  </label>

                  <label className="text-sm font-semibold text-ink">
                    Paese <span className="font-normal text-ink/45">(facoltativo)</span>
                    <input
                      className="mt-2 min-h-12 w-full rounded-xl border border-heather/20 bg-white px-4 text-sm text-ink focus:border-heather focus:outline-2"
                      name="country"
                      defaultValue={profile.country ?? ""}
                      autoComplete="country-name"
                      maxLength={120}
                    />
                  </label>
                </div>
              </fieldset>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.13em] text-ink/45">
                Email account
              </p>
              <p className="mt-2 break-all text-sm font-medium text-ink">
                {email || "Non disponibile"}
              </p>
              <p className="mt-2 text-xs leading-5 text-ink/45">
                La tua email proviene direttamente da Supabase Auth e non viene duplicata nel
                profilo.
              </p>
            </div>

            <ProfileSubmitButton />
          </form>

          <aside className="rounded-[2rem] bg-sandstone/35 p-7 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-heather">
              Sicurezza account
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.035em] text-ink">
              Mantieni sicuro il tuo account.
            </h2>
            <p className="mt-4 text-sm leading-6 text-ink/60">
              Scegli una password sicura e aggiornala quando necessario.
            </p>
            <Link
              href="/update-password"
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full border border-heather/25 bg-white/70 px-5 text-sm font-semibold text-ink transition-colors hover:border-heather hover:text-heather focus-visible:outline-2"
            >
              Gestisci password
            </Link>

            <div className="mt-8 border-t border-candy/20 pt-7">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a95d76]">
                Zona pericolosa
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.035em] text-ink">
                Elimina il tuo account.
              </h2>
              <p className="mt-4 text-sm leading-6 text-ink/60">
                Questa azione rimuove definitivamente profilo, siti, immagini e accesso. Non
                può essere annullata.
              </p>
              <form action={deleteAccountAction} className="mt-5 grid gap-3">
                <label className="text-xs font-semibold text-ink/70" htmlFor="delete-confirmation">
                  Digita <span className="font-bold text-[#a95d76]">DELETE</span> per confermare
                  <input
                    id="delete-confirmation"
                    name="confirmation"
                    className="mt-2 min-h-11 w-full rounded-xl border border-candy/25 bg-white px-3 text-sm text-ink focus:border-candy focus:outline-2"
                    autoComplete="off"
                    pattern="DELETE"
                    spellCheck={false}
                    title="Inserisci DELETE esattamente per confermare l'eliminazione dell'account."
                    required
                  />
                </label>
                <DeleteAccountButton />
              </form>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}
