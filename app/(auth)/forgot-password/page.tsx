import { AuthCard } from "@/components/auth/AuthCard";
import { ForgotPasswordForm } from "@/components/auth/AuthForms";

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      eyebrow="Recupero account"
      title="Reimposta la password."
      description="Inserisci la tua email e riceverai un link sicuro per scegliere una nuova password."
    >
      <ForgotPasswordForm />
    </AuthCard>
  );
}
