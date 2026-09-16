import "server-only";

import { headers } from "next/headers";

export async function getSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, "");
  }

  const requestHeaders = await headers();
  return (requestHeaders.get("origin") || "http://localhost:3000").replace(/\/$/, "");
}
