import { redirect } from "next/navigation";
import { AuthCard } from "@/components/auth/AuthCard";
import { LoginForm } from "@/components/auth/AuthForms";
import { getAuthenticatedUser, safeNextPath } from "@/lib/auth/session";

type LoginPageProps = {
  searchParams: Promise<{ next?: string; error?: string; message?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const user = await getAuthenticatedUser();
  const params = await searchParams;

  if (user) redirect("/dashboard");

  return (
    <AuthCard
      eyebrow="Welcome back"
      title="Login to your account."
      description="Manage your storefront and share your handmade work with the Flowintoone community."
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
      <LoginForm nextPath={safeNextPath(params.next)} />
    </AuthCard>
  );
}
