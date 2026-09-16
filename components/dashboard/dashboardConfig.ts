export type DashboardIconName =
  | "home"
  | "storefront"
  | "products"
  | "profile"
  | "insights"
  | "settings"
  | "arrow"
  | "external"
  | "check";

export const DASHBOARD_ASSETS = {
  // Replace this path when the final dashboard banner artwork is provided.
  welcomeBanner: "/images/Hero-image.jpg",
} as const;

export const DASHBOARD_NAVIGATION: Array<{
  label: string;
  href?: string;
  icon: DashboardIconName;
}> = [
  { label: "Dashboard", href: "/dashboard", icon: "home" },
  { label: "My storefront", href: "/dashboard/storefront", icon: "storefront" },
  { label: "My products", icon: "products" },
  { label: "My profile", href: "/dashboard/profile", icon: "profile" },
  { label: "Insights", icon: "insights" },
  { label: "Settings", icon: "settings" },
];

export const DASHBOARD_QUICK_ACCESS: Array<{
  label: string;
  description: string;
  href?: string;
  icon: DashboardIconName;
  tone: string;
}> = [
  {
    label: "My profile",
    description: "Manage your personal information and bio.",
    href: "/dashboard/profile",
    icon: "profile",
    tone: "bg-heather/10 text-heather",
  },
  {
    label: "My storefront",
    description: "Edit your business details and public space.",
    href: "/dashboard/storefront",
    icon: "storefront",
    tone: "bg-viridian/15 text-[#477b7b]",
  },
  {
    label: "My products",
    description: "Add and manage your creations.",
    icon: "products",
    tone: "bg-candy/15 text-[#a95d76]",
  },
  {
    label: "Settings",
    description: "Update your preferences and account details.",
    icon: "settings",
    tone: "bg-azur/15 text-[#537da9]",
  },
];
