import { supabase } from "@/api/client";
import { SECTION_REGISTRY } from "@app/(page-theme-component)/sections/registry";
import {
  THEME_PRESETS,
  type ThemeKey,
  type SectionConfig,
  type PageConfig,
} from "@app/(page-theme-component)/themes/presets";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function buildSectionsFromTheme(themeKey: ThemeKey, config?: PageConfig): SectionConfig[] {
  const base = THEME_PRESETS[themeKey].sections as SectionConfig[];
  const disabled = config?.disabled ?? [];
  const overrides = config?.overrides ?? {};

  return base
    .filter((s) => !disabled.includes(s.type))
    .map((s) => {
      const ov = overrides[s.type];
      if (!ov) return s;

      return {
        ...s,
        variant: (ov.variant ?? s.variant) as any,
        props: { ...(s.props ?? {}), ...(ov.props ?? {}) },
      };
    });
}

export default async function SupplierPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: business } = await supabase
    .from("businesses")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!business) return <div>Supplier not found</div>;

  const { data: supplier } = await supabase
    .from("supplier_profiles")
    .select("*")
    .eq("business_id", business.id)
    .eq("is_published", true)
    .single();

  if (!supplier) return <div>Not published</div>;

  const { data: settings } = await supabase
    .from("business_page_settings")
    .select("theme_key, config")
    .eq("business_id", business.id)
    .maybeSingle();

  const rawThemeKey = settings?.theme_key;
  const themeKey: ThemeKey =
    rawThemeKey && rawThemeKey in THEME_PRESETS ? (rawThemeKey as ThemeKey) : "theme1";

  const config = (settings?.config as unknown as PageConfig) ?? {};

  const sections = buildSectionsFromTheme(themeKey, config);

  return (
    <>
      {sections.map((section, index) => {
        const Component = SECTION_REGISTRY[section.type]?.[section.variant];
        if (!Component) return null;

        return (
          <Component
            key={`${section.type}-${section.variant}-${index}`}
            supplier={supplier}
            sectionProps={section.props ?? {}}
          />
        );
      })}
    </>
  );
}