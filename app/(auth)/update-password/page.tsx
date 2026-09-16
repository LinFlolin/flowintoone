import { AuthCard } from "@/components/auth/AuthCard";
import { UpdatePasswordForm } from "@/components/auth/AuthForms";
import { requireUser } from "@/lib/auth/session";

export default async function UpdatePasswordPage() {
  await requireUser();

  return (
    <AuthCard
      eyebrow="Account security"
      title="Choose a new password."
      description="Use a password of at least 8 characters that you do not use elsewhere."
    >
      <UpdatePasswordForm />
    </AuthCard>
  );
}
