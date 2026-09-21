import type { ReactNode } from "react";
import { requireArtisan } from "@/lib/auth/roles";

export default async function BillingLayout({ children }: { children: ReactNode }) {
  await requireArtisan();
  return children;
}
