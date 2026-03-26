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

export type SectionConfig = {
  type: SectionType;
  variant: Variant;
  props?: Record<string, unknown>;
};

export type ThemePreset = {
  sections: readonly SectionConfig[];
};

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
  overrides?: Partial<
    Record<
      SectionType,
      {
        variant?: Variant;
        props?: Record<string, unknown>;
      }
    >
  >;
  disabled?: SectionType[];
};

export type ThemeKey = keyof typeof THEME_PRESETS;