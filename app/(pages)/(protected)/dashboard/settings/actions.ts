"use server";

import { createClient } from "@supabase/supabase-js";
import type { ThemeKey, PageConfig, SectionType, Variant } from "@app/(page-theme-component)/themes/presets";
import { Database } from "@/types/supabase";

function getSupabaseAdmin() {
  // Use SERVICE ROLE only in server code (never in client)
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function setTheme(businessId: string, themeKey: ThemeKey) {
  const supabase = getSupabaseAdmin();
  const emptyConfig: PageConfig = {};

  await supabase.from("business_page_settings").upsert({
    business_id: businessId,
    page_type: "supplier",
    theme_key: themeKey,
    config: emptyConfig as any,
  });
}

export async function setSectionVariant(
  businessId: string,
  section: SectionType,
  variant: Variant
) {
  const supabase = getSupabaseAdmin();

  // read current
  const { data } = await supabase
    .from("business_page_settings")
    .select("config, theme_key, page_type")
    .eq("business_id", businessId)
    .maybeSingle();

  const currentConfig = (data?.config ?? {}) as any;

  const nextConfig = {
    ...currentConfig,
    overrides: {
      ...(currentConfig.overrides ?? {}),
      [section]: {
        ...(currentConfig.overrides?.[section] ?? {}),
        variant,
      },
    },
  };

  await supabase.from("business_page_settings").upsert({
    business_id: businessId,
    page_type: data?.page_type ?? "supplier",
    theme_key: (data?.theme_key as any) ?? "theme1",
    config: nextConfig,
  });
}

export async function toggleSection(
  businessId: string,
  section: SectionType
) {
  const supabase = getSupabaseAdmin();

  const { data } = await supabase
    .from("business_page_settings")
    .select("config, theme_key, page_type")
    .eq("business_id", businessId)
    .maybeSingle();

  const currentConfig = (data?.config ?? {}) as any;
  const disabled: SectionType[] = currentConfig.disabled ?? [];

  const nextDisabled = disabled.includes(section)
    ? disabled.filter((s) => s !== section)
    : [...disabled, section];

  const nextConfig = { ...currentConfig, disabled: nextDisabled };

  await supabase.from("business_page_settings").upsert({
    business_id: businessId,
    page_type: data?.page_type ?? "supplier",
    theme_key: (data?.theme_key as any) ?? "theme1",
    config: nextConfig,
  });
}