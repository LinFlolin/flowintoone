import { WebsitePurposeStep } from "@/components/create/WebsitePurposeStep";
import { requireArtisan } from "@/lib/auth/roles";
import { redirect } from "next/navigation";

export default async function CreateWebsitePage() {
  const { supabase, userId } = await requireArtisan();
  const { data: business } = await supabase
    .from("businesses")
    .select("id")
    .eq("owner_id", userId)
    .limit(1)
    .maybeSingle();
  if (business) redirect("/dashboard/storefront");
  return <WebsitePurposeStep />;
}
