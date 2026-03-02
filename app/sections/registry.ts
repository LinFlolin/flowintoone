import type { SectionType, Variant } from "@/app/themes/presets";


import HeroV1 from "@/app/sections/components/hero/HeroV1";
import HeroV2 from "@/app/sections/components/hero/HeroV2";

import AboutV1 from "@/app/sections/components/about/AboutV1";
import AboutV2 from "@/app/sections/components/about/AboutV2";

import CapabilitiesV1 from "@/app/sections/components/capabilities/CapabilitiesV1";

import ProductsV1 from "@/app/sections/components/products/ProductsV1";
import ProductsV2 from "@/app/sections/components/products/ProductsV2";

import CertificationsV1 from "@/app/sections/components/certifications/CertificationsV1";

import ContactV1 from "@/app/sections/components/contact/ContactV1";

import FooterV1 from "@/app/sections/components/footer/FooterV1";

export type SectionRegistry = {
  [K in SectionType]: Partial<Record<Variant, React.ComponentType<any>>>;
};

export const SECTION_REGISTRY: SectionRegistry = {
  hero: { v1: HeroV1, v2: HeroV2 },
  about: { v1: AboutV1, v2: AboutV2 },
  capabilities: { v1: CapabilitiesV1 },
  products: { v1: ProductsV1, v2: ProductsV2 },
  certifications: { v1: CertificationsV1 },
  contact: { v1: ContactV1 },
  footer: { v1: FooterV1 },
};