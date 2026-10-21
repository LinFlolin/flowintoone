import { requireCreator } from "@/lib/auth/roles";
import { WebsiteReviewStep } from "@/components/create/WebsiteReviewStep";

type ReviewPageProps = { searchParams: Promise<{ error?: string }> };

export default async function CreateReviewPage({ searchParams }: ReviewPageProps) {
  await requireCreator();
  const params = await searchParams;
  return <WebsiteReviewStep error={params.error ?? null} />;
}
