import { redirect } from "next/navigation";
import { AuthCard } from "@/components/auth/AuthCard";
import { RegisterForm } from "@/components/auth/AuthForms";
import { getAuthenticatedUser } from "@/lib/auth/session";

export default async function RegisterPage() {
  const user = await getAuthenticatedUser();
  if (user) redirect("/dashboard");

  return (
    <AuthCard
      eyebrow="Per creator indipendenti"
      title="Crea il tuo account."
      description="Entra in Flowintoone e crea una casa digitale autentica per la tua attività."
    >
      <RegisterForm />
    </AuthCard>
  );
}
