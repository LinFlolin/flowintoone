"use client";

import { useSyncExternalStore } from "react";
import { FlowLoader } from "@/components/ui/FlowLoader";

export function InitialPageLoader() {
  const ready = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener("load", onStoreChange, { once: true });
      return () => window.removeEventListener("load", onStoreChange);
    },
    () => document.readyState === "complete",
    () => false,
  );

  if (ready) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="fixed inset-0 z-[100] grid place-items-center bg-cream"
    >
      <FlowLoader message="Caricamento Flowintoone" />
    </div>
  );
}
