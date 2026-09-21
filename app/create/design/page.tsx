import { requireArtisan } from "@/lib/auth/roles";
import { WebsiteDesignStep } from "@/components/create/WebsiteDesignStep";

export default async function CreateDesignPage() {
  await requireArtisan();
  return <WebsiteDesignStep />;
}
