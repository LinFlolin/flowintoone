import type { ReactNode } from "react";
import type { DashboardIconName } from "./dashboardConfig";

type DashboardIconProps = {
  name: DashboardIconName;
  className?: string;
};

const paths: Record<DashboardIconName, ReactNode> = {
  home: <path d="m3 10 9-7 9 7v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 21v-6h6v6" />,
  storefront: <path d="M4 10h16v10H4zM3 10l1.5-6h15L21 10M8 4v6m8-6v6M8 14h3m2 0h3" />,
  profile: <path d="M20 21a8 8 0 0 0-16 0M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8" />,
  settings: <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm0-12.5v2m0 14v2m9-9h-2M5 12H3m15.36-6.36-1.42 1.42M6.06 17.94l-1.42 1.42m0-13.72 1.42 1.42m10.88 10.88 1.42 1.42" />,
  appearance: <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 0c2 2 2 4-1 5s-4 0-4-2m11 1c-2 0-3 2-2 4s3 2 4 1m-9 8c-1-2 0-4 2-4s3 2 2 4" />,
  discover: <path d="m12 3 2.2 6.8L21 12l-6.8 2.2L12 21l-2.2-6.8L3 12l6.8-2.2L12 3Z" />,
  following: <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m6-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm8-4v6m3-3h-6" />,
  calendar: <path d="M5 4h14v16H5zM8 2v4m8-4v4M5 9h14M8 13h2m2 0h2" />,
  bookmark: <path d="M6 4h12v17l-6-3-6 3V4Z" />,
  help: <path d="M9.5 9a2.7 2.7 0 1 1 4.2 2.25c-1.1.7-1.7 1.2-1.7 2.75m.01 3h.01M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />,
  image: <path d="M4 5h16v14H4zM7 15l3-3 2 2 2-2 3 3M8 9h.01" />,
  edit: <path d="m4 20 4.5-1 10-10a2.12 2.12 0 0 0-3-3l-10 10L4 20Zm9.5-12.5 3 3" />,
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
