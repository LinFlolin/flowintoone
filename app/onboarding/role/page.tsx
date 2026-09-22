import { redirect } from "next/navigation";
import { RoleSelectionForm } from "@/components/auth/RoleSelectionForm";
import { getAccountRole, getPostAuthPath } from "@/lib/auth/roles";
import { requireUser } from "@/lib/auth/session";

export default async function RoleSelectionPage() {
  const user = await requireUser();
  const role = await getAccountRole(user.supabase, user.userId);

  if (role) redirect(await getPostAuthPath(user.supabase, user.userId));

  return (
    <main className="min-h-screen bg-cream px-5 py-5 text-ink sm:px-8 sm:py-8">
      <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] w-full max-w-3xl flex-col justify-center rounded-[2rem] border border-heather/10 bg-white/35 px-5 py-8 shadow-[0_20px_70px_rgba(81,68,91,0.06)] sm:min-h-[calc(100vh-4rem)] sm:px-12 sm:py-12">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-heather">Una domanda veloce</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.045em]">Come userai Flowintoone?</h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-ink/60">
          Questo ci aiuta a portarti nel posto giusto dopo la conferma dell&apos;email. Potrai cambiare idea in seguito.
        </p>
        <div className="mt-10">
          <RoleSelectionForm />
        </div>
      </div>
    </main>
  );
}
