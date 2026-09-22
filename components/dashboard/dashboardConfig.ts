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
  { label: "Il mio sito", href: "/dashboard/storefront", icon: "storefront", group: "Website", ownerOnly: true },
  { label: "Aspetto", icon: "appearance", group: "Website", ownerOnly: true },
  { label: "Impostazioni", icon: "settings", group: "Website", ownerOnly: true },
  { label: "Scopri", href: "/discover", icon: "discover", group: "Community" },
  { label: "Seguiti", icon: "following", group: "Community" },
  { label: "Eventi", icon: "calendar", group: "Community" },
  { label: "I miei preferiti", icon: "bookmark", group: "Community" },
  { label: "Aiuto", icon: "help", group: "Support" },
  { label: "Il mio account", href: "/dashboard/profile", icon: "profile", group: "Support" },
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
    label: "Modifica contenuti",
    description: "Aggiorna testi, immagini e pagine.",
    href: "/dashboard/storefront",
    icon: "edit",
    tone: "bg-candy/15 text-[#a95d76]",
    backgroundClassName: "bg-candy/10",
  },
  {
    label: "Gestisci immagini",
    description: "Carica e organizza le tue foto.",
    icon: "image",
    tone: "bg-viridian/15 text-[#477b7b]",
    backgroundClassName: "bg-viridian/10",
  },
  {
    label: "Aspetto",
    description: "Cambia colori e stile.",
    icon: "appearance",
    tone: "bg-heather/15 text-heather",
    backgroundClassName: "bg-heather/10",
  },
  {
    label: "Impostazioni sito",
    description: "Nome, URL e visibilità.",
    icon: "settings",
    tone: "bg-azur/15 text-[#537da9]",
    backgroundClassName: "bg-azur/10",
  },
];
