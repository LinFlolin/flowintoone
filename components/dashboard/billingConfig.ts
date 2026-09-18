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
  yearlyDiscount: "Save 20%",
};

export const BILLING_PLANS: BillingPlan[] = [
  {
    id: "free",
    label: "Free",
    eyebrow: "A gentle beginning",
    description: "A place to begin your creative journey.",
    monthlyPrice: 0,
    yearlyPrice: 0,
    accent: "border-heather/25",
    cardBackground: "bg-white/70",
    features: [
      { label: "Public storefront", included: true },
      { label: "Up to 12 products", included: true },
      { label: "Business story, logo and cover", included: true },
      { label: "Browse events", included: true },
      { label: "1 weekly market announcement", included: true },
      { label: "Public contact details", included: false },
      { label: "Event publishing", included: false },
      { label: "Contact form", included: false },
      { label: "Customer reviews", included: false },
    ],
  },
  {
    id: "basic",
    label: "Basic",
    eyebrow: "More room to grow",
    description: "More visibility for your handmade business.",
    monthlyPrice: 9,
    yearlyPrice: 90,
    accent: "border-candy/70",
    cardBackground: "bg-candy/5",
    features: [
      { label: "Everything in Free", included: true },
      { label: "Up to 50 products", included: true },
      { label: "Public contact details", included: true },
      { label: "Public market announcements", included: true },
      { label: "Can publish events", included: true },
      { label: "Contact form", included: false },
      { label: "Customer reviews", included: false },
    ],
  },
  {
    id: "pro",
    label: "Pro",
    eyebrow: "A complete creative space",
    description: "For established makers ready to be discovered.",
    monthlyPrice: 19,
    yearlyPrice: 190,
    accent: "border-heather/35",
    cardBackground: "bg-heather/5",
    features: [
      { label: "Everything in Basic", included: true },
      { label: "Unlimited products", included: true },
      { label: "Public contact details", included: true },
      { label: "Public market announcements", included: true },
      { label: "Can publish events", included: true },
      { label: "Contact form", included: true },
      { label: "Customer reviews", included: true },
    ],
  },
];

export const BILLING_COMPARISON = [
  { label: "Products", values: ["12", "50", "Unlimited"] },
  { label: "Public storefront", values: [true, true, true] },
  { label: "Story / logo / cover", values: [true, true, true] },
  { label: "Browse events", values: [true, true, true] },
  { label: "Weekly market announcements", values: ["1 per week", "Public", "Public"] },
  { label: "Public market visibility", values: [false, true, true] },
  { label: "Event publishing", values: [false, true, true] },
  { label: "Public contact details", values: [false, true, true] },
  { label: "Contact form", values: [false, false, true] },
  { label: "Reviews", values: [false, false, true] },
] as const;
