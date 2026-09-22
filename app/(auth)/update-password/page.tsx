import { AuthCard } from "@/components/auth/AuthCard";
import { UpdatePasswordForm } from "@/components/auth/AuthForms";
import { requireUser } from "@/lib/auth/session";

export default async function UpdatePasswordPage() {
  await requireUser();

  return (
    <AuthCard
      eyebrow="Sicurezza account"
      title="Scegli una nuova password."
      description="Usa una password di almeno 8 caratteri che non utilizzi altrove."
    >
      <UpdatePasswordForm />
    </AuthCard>
  );
}
