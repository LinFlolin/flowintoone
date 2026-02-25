// themes/presets.ts

// 1) tipi base
export type SectionType =
  | "hero"
  | "about"
  | "capabilities"
  | "products"
  | "certifications"
  | "contact"
  | "footer";

export type Variant = "v1" | "v2";

// 2) config di una singola sezione
export type SectionConfig = {
  type: SectionType;
  variant: Variant;
  // opzionale: props custom per quella sezione
  props?: Record<string, unknown>;
};

// 3) config di un tema
export type ThemePreset = {
  sections: readonly SectionConfig[];
};

// 4) preset veri e propri
export const THEME_PRESETS: Record<string, ThemePreset> = {
  theme1: {
    sections: [
      { type: "hero", variant: "v1" },
      { type: "about", variant: "v1" },
      { type: "capabilities", variant: "v1" },
      { type: "products", variant: "v1" },
      { type: "certifications", variant: "v1" },
      { type: "contact", variant: "v1" },
      { type: "footer", variant: "v1" },
    ],
  },

  theme2: {
    sections: [
      { type: "hero", variant: "v2" },
      { type: "products", variant: "v1" },
      { type: "about", variant: "v2" },
      { type: "contact", variant: "v1" },
      { type: "footer", variant: "v1" },
    ],
  },
};
export type PageConfig = {
  sections: SectionConfig[];
};
// 5) ThemeKey tipizzato automaticamente dai preset (theme1 | theme2)
export type ThemeKey = keyof typeof THEME_PRESETS;