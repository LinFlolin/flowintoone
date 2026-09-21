import { redirect } from "next/navigation";
import { requireArtisan } from "@/lib/auth/roles";

export default async function CreateStorePage() {
  await requireArtisan();
  // Keep the wizard's centered, no-sidebar presentation while retaining the
  // requested dashboard entry URL for artisans without a website.
  redirect("/create");
}
