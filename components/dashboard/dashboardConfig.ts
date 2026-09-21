export type DashboardIconName =
  | "home"
  | "storefront"
  | "profile"
  | "settings"
  | "appearance"
  | "discover"
  | "following"
  | "calendar"
  | "bookmark"
  | "help"
  | "arrow"
  | "external"
  | "check"
  | "edit"
  | "image";

export const DASHBOARD_ASSETS = {
  // Replace this path when the final dashboard banner artwork is provided.
  welcomeBanner: "/images/Hero-image.jpg",
} as const;

export const DASHBOARD_NAVIGATION: Array<{
  label: string;
  href?: string;
  icon: DashboardIconName;
  group: "Website" | "Community" | "Support";
  ownerOnly?: boolean;
}> = [
  { label: "Dashboard", href: "/dashboard", icon: "home", group: "Website" },
  { label: "My website", href: "/dashboard/storefront", icon: "storefront", group: "Website", ownerOnly: true },
  { label: "Appearance", icon: "appearance", group: "Website", ownerOnly: true },
  { label: "Settings", icon: "settings", group: "Website", ownerOnly: true },
  { label: "Discover", href: "/discover", icon: "discover", group: "Community" },
  { label: "Following", icon: "following", group: "Community" },
  { label: "Events", icon: "calendar", group: "Community" },
  { label: "My saves", icon: "bookmark", group: "Community" },
  { label: "Help", icon: "help", group: "Support" },
  { label: "My account", href: "/dashboard/profile", icon: "profile", group: "Support" },
];

export const DASHBOARD_QUICK_ACCESS: Array<{
  label: string;
  description: string;
  href?: string;
  icon: DashboardIconName;
  tone: string;
  backgroundClassName: string;
}> = [
  {
    label: "Edit content",
    description: "Update text, images and pages.",
    href: "/dashboard/storefront",
    icon: "edit",
    tone: "bg-candy/15 text-[#a95d76]",
    backgroundClassName: "bg-candy/10",
  },
  {
    label: "Manage images",
    description: "Upload and organize your photos.",
    icon: "image",
    tone: "bg-viridian/15 text-[#477b7b]",
    backgroundClassName: "bg-viridian/10",
  },
  {
    label: "Appearance",
    description: "Change colors and style.",
    icon: "appearance",
    tone: "bg-heather/15 text-heather",
    backgroundClassName: "bg-heather/10",
  },
  {
    label: "Website settings",
    description: "Name, URL and visibility.",
    icon: "settings",
    tone: "bg-azur/15 text-[#537da9]",
    backgroundClassName: "bg-azur/10",
  },
];
