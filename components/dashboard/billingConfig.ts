export type BillingCycle = "monthly" | "yearly";

export type BillingPlan = {
  id: "free" | "basic" | "pro";
  label: string;
  eyebrow: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  accent: string;
  cardBackground: string;
  features: Array<{ label: string; included: boolean }>;
};

export const BILLING_ASSETS = {
  // Replace with the final billing artwork when it is provided.
  heroImage: "/images/Hero-image.jpg",
} as const;

export const BILLING_CONFIG = {
  // Presentation-only placeholder until a real subscription state exists.
  currentPlan: "free" as const,
  yearlyDiscount: "Risparmia il 20%",
};

export const BILLING_PLANS: BillingPlan[] = [
  {
    id: "free",
    label: "Free",
    eyebrow: "Un inizio gentile",
    description: "Un luogo da cui iniziare il tuo viaggio creativo.",
    monthlyPrice: 0,
    yearlyPrice: 0,
    accent: "border-heather/25",
    cardBackground: "bg-white/70",
    features: [
      { label: "Sito pubblico", included: true },
      { label: "Fino a 12 prodotti", included: true },
      { label: "Storia, logo e copertina attività", included: true },
      { label: "Esplora eventi", included: true },
      { label: "1 annuncio mercato a settimana", included: true },
      { label: "Contatti pubblici", included: false },
      { label: "Pubblicazione eventi", included: false },
      { label: "Modulo di contatto", included: false },
      { label: "Recensioni clienti", included: false },
    ],
  },
  {
    id: "basic",
    label: "Basic",
    eyebrow: "Più spazio per crescere",
    description: "Più visibilità per la tua attività artigianale.",
    monthlyPrice: 9,
    yearlyPrice: 90,
    accent: "border-candy/70",
    cardBackground: "bg-candy/5",
    features: [
      { label: "Tutto ciò che include Free", included: true },
      { label: "Fino a 50 prodotti", included: true },
      { label: "Contatti pubblici", included: true },
      { label: "Annunci del mercato pubblico", included: true },
      { label: "Puoi pubblicare eventi", included: true },
      { label: "Modulo di contatto", included: false },
      { label: "Recensioni clienti", included: false },
    ],
  },
  {
    id: "pro",
    label: "Pro",
    eyebrow: "Uno spazio creativo completo",
    description: "Per creator affermati pronti a farsi scoprire.",
    monthlyPrice: 19,
    yearlyPrice: 190,
    accent: "border-heather/35",
    cardBackground: "bg-heather/5",
    features: [
      { label: "Tutto ciò che include Basic", included: true },
      { label: "Prodotti illimitati", included: true },
      { label: "Contatti pubblici", included: true },
      { label: "Annunci del mercato pubblico", included: true },
      { label: "Puoi pubblicare eventi", included: true },
      { label: "Modulo di contatto", included: true },
      { label: "Recensioni clienti", included: true },
    ],
  },
];

export const BILLING_COMPARISON = [
  { label: "Prodotti", values: ["12", "50", "Illimitati"] },
  { label: "Sito pubblico", values: [true, true, true] },
  { label: "Storia / logo / copertina", values: [true, true, true] },
  { label: "Esplora eventi", values: [true, true, true] },
  { label: "Annunci mercato settimanali", values: ["1 a settimana", "Pubblico", "Pubblico"] },
  { label: "Visibilità mercato pubblico", values: [false, true, true] },
  { label: "Pubblicazione eventi", values: [false, true, true] },
  { label: "Contatti pubblici", values: [false, true, true] },
  { label: "Modulo di contatto", values: [false, false, true] },
  { label: "Recensioni", values: [false, false, true] },
] as const;
