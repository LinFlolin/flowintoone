import { AuthCard } from "@/components/auth/AuthCard";
import { ForgotPasswordForm } from "@/components/auth/AuthForms";

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      eyebrow="Account recovery"
      title="Reset your password."
      description="Enter your email and we’ll send you a secure link to choose a new password."
    >
      <ForgotPasswordForm />
    </AuthCard>
  );
}
