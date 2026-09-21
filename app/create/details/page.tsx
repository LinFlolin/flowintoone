import { WebsiteDetailsStep } from "@/components/create/WebsiteDetailsStep";
import { requireArtisan } from "@/lib/auth/roles";

export default async function CreateDetailsPage() {
  const { supabase } = await requireArtisan();
  const { data } = await supabase
    .from("categories")
    .select("id, name")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  return <WebsiteDetailsStep categories={data ?? []} />;
}
