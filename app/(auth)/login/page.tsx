import { redirect } from "next/navigation";
import { AuthCard } from "@/components/auth/AuthCard";
import { LoginForm, ResendConfirmationForm } from "@/components/auth/AuthForms";
import { getAuthenticatedUser, safeNextPath } from "@/lib/auth/session";

type LoginPageProps = {
  searchParams: Promise<{ next?: string; error?: string; message?: string; resend?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const user = await getAuthenticatedUser();
  const params = await searchParams;

  if (user) redirect("/dashboard");

  return (
    <AuthCard
      eyebrow="Bentornato"
      title="Accedi al tuo account."
      description="Gestisci il tuo sito e condividi il tuo lavoro con la community Flowintoone."
    >
      {(params.error || params.message) && (
        <p
          role={params.error ? "alert" : "status"}
          className={`mb-5 rounded-xl px-4 py-3 text-sm leading-6 ${
            params.error ? "bg-candy/10 text-ink" : "bg-viridian/10 text-ink"
          }`}
        >
          {params.error || params.message}
        </p>
      )}
      {params.resend === "1" ? <ResendConfirmationForm /> : <LoginForm nextPath={safeNextPath(params.next)} />}
    </AuthCard>
  );
}
