import { redirect } from "next/navigation";
import { AuthCard } from "@/components/auth/AuthCard";
import { RegisterForm } from "@/components/auth/AuthForms";
import { getAuthenticatedUser } from "@/lib/auth/session";

export default async function RegisterPage() {
  const user = await getAuthenticatedUser();
  if (user) redirect("/dashboard");

  return (
    <AuthCard
      eyebrow="For independent artisans"
      title="Create your account."
      description="Join Flowintoone and start building a thoughtful digital home for your handmade business."
    >
      <RegisterForm />
    </AuthCard>
  );
}
