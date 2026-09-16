import type { ReactNode } from "react";
import type { DashboardIconName } from "./dashboardConfig";

type DashboardIconProps = {
  name: DashboardIconName;
  className?: string;
};

const paths: Record<DashboardIconName, ReactNode> = {
  home: <path d="m3 10 9-7 9 7v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 21v-6h6v6" />,
  storefront: <path d="M4 10h16v10H4zM3 10l1.5-6h15L21 10M8 4v6m8-6v6M8 14h3m2 0h3" />,
  products: <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9zM4 7.5 12 12l8-4.5M12 12v9" />,
  profile: <path d="M20 21a8 8 0 0 0-16 0M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8" />,
  settings: <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm0-12.5v2m0 14v2m9-9h-2M5 12H3m15.36-6.36-1.42 1.42M6.06 17.94l-1.42 1.42m0-13.72 1.42 1.42m10.88 10.88 1.42 1.42" />,
  arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
  external: <path d="M14 4h6v6m0-6-9 9M19 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5" />,
  check: <path d="m5 12 4 4L19 6" />,
};

export function DashboardIcon({ name, className = "" }: DashboardIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {paths[name]}
    </svg>
  );
}
