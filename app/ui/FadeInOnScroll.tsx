"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type VariantName =
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "zoom-in"
  | "zoom-out"
  | "blur-in"
  | "rotate-in";

// Can be a real animation or "none"
type Variant = VariantName | "none";

type FadeInOnScrollProps = {
  children: ReactNode;
  className?: string;
  delay?: number;

  /** Default animation (used if others are null/undefined) */
  variant?: Variant | null;

  /** Mobile animation (< breakpoint). Use "none" to disable */
  mobileVariant?: Variant | null;

  /** Desktop animation (>= breakpoint). Use "none" to disable */
  desktopVariant?: Variant | null;

  /** Tailwind-like breakpoint in px, default 768 */
  breakpoint?: number;
};

const variants: Record<VariantName, { hidden: string; visible: string }> = {
  "fade-up": {
    hidden: "opacity-0 translate-y-6",
    visible: "opacity-100 translate-y-0",
  },
  "fade-down": {
    hidden: "opacity-0 -translate-y-6",
    visible: "opacity-100 translate-y-0",
  },
  "fade-left": {
    hidden: "opacity-0 -translate-x-6",
    visible: "opacity-100 translate-x-0",
  },
  "fade-right": {
    hidden: "opacity-0 translate-x-10",
    visible: "opacity-100 translate-x-0",
  },
  "zoom-in": {
    hidden: "opacity-0 scale-90",
    visible: "opacity-100 scale-100",
  },
  "zoom-out": {
    hidden: "opacity-0 scale-110",
    visible: "opacity-100 scale-100",
  },
  "blur-in": {
    hidden: "opacity-0 blur-sm translate-y-4",
    visible: "opacity-100 blur-0 translate-y-0",
  },
  "rotate-in": {
    hidden: "opacity-0 -rotate-3 translate-y-4",
    visible: "opacity-100 rotate-0 translate-y-0",
  },
};

export default function FadeInOnScroll({
  children,
  className = "",
  delay = 0,
  variant = null,
  mobileVariant = null,
  desktopVariant = null,
  breakpoint = 768,
}: FadeInOnScrollProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  // Detect viewport size
  useEffect(() => {
    if (typeof window === "undefined") return;

    const update = () => setIsDesktop(window.innerWidth >= breakpoint);

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [breakpoint]);

  // Intersection observer (only actually needed when we have animation,
  // but it's fine to keep it simple)
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const fallbackVariant: VariantName = "fade-up";

  const baseVariant: Variant =
    variant ?? fallbackVariant;

  const currentVariant: Variant =
    isDesktop === null
      ? baseVariant
      : isDesktop
      ? (desktopVariant ?? baseVariant)
      : (mobileVariant ?? baseVariant);

  const { hidden, visible } =
    currentVariant === "none"
      ? { hidden: "", visible: "" }
      : variants[currentVariant];

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`
        ${hidden}
        transition-all duration-700 ease-out
        ${isVisible ? visible : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
