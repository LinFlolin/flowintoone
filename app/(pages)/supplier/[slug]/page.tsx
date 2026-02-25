import { supabase } from "@/api/client";
import { SECTION_REGISTRY } from "@/app/sections/registry";
import { THEME_PRESETS, type ThemeKey, type SectionConfig, type PageConfig } from "@/app/themes/presets";

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
    .select("*")
    .eq("business_id", business.id)
    .maybeSingle();

  const rawThemeKey = settings?.theme_key;
  const themeKey: ThemeKey =
    rawThemeKey && rawThemeKey in THEME_PRESETS ? (rawThemeKey as ThemeKey) : "theme1";

  const config = (settings?.config as unknown as PageConfig) ?? { sections: [] };

  const sections: SectionConfig[] =
    config.sections.length > 0 ? config.sections : (THEME_PRESETS[themeKey].sections as SectionConfig[]);

  return (
    <>
      {sections.map((section, index) => {
        const Component = SECTION_REGISTRY[section.type]?.[section.variant];
        if (!Component) return null;

        return (
          <Component
            key={`${section.type}-${index}`}
            supplier={supplier}
            sectionProps={section.props ?? {}}
          />
        );
      })}
    </>
  );
}