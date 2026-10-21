import { requireCreator } from "@/lib/auth/roles";
import { WebsiteDesignStep } from "@/components/create/WebsiteDesignStep";

export default async function CreateDesignPage() {
  await requireCreator();
  return <WebsiteDesignStep />;
}
