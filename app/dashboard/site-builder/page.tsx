import { THEME_PRESETS, type ThemeKey, type SectionType } from "@/app/themes/presets";
import { setSectionVariant, setTheme, toggleSection } from "../settings/actions";

export default async function SiteBuilderPage() {
  // TODO: replace with your real businessId selection logic
  const businessId = "Pdda6824a-e54c-44de-9c2e-98f36ea96afa";

  const themes = Object.keys(THEME_PRESETS) as ThemeKey[];

  return (
    <div className="p-15">
      <h1>Site Builder</h1>

      <h2>Choose Theme</h2>
      <div style={{ display: "flex", gap: 12 }}>
        {themes.map((t) => (
          <form key={t} action={async () => { "use server"; await setTheme(businessId, t); }}>
            <button type="submit">{t}</button>
          </form>
        ))}
      </div>

      <hr style={{ margin: "24px 0" }} />

      <h2>Customize Sections (overrides)</h2>
      <p>Example: set Products to v2 or hide Certifications.</p>

      <div style={{ display: "grid", gap: 12 }}>
        {(["products", "hero", "about", "capabilities", "certifications", "contact", "footer"] as SectionType[]).map((s) => (
          <div key={s} style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8 }}>
            <strong>{s}</strong>

            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <form action={async () => { "use server"; await setSectionVariant(businessId, s, "v1"); }}>
                <button type="submit">Set v1</button>
              </form>

              <form action={async () => { "use server"; await setSectionVariant(businessId, s, "v2"); }}>
                <button className=" bg-amber-500" type="submit">Set v2</button>
              </form>

              <form action={async () => { "use server"; await toggleSection(businessId, s); }}>
                <button type="submit">Toggle hide/show</button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}