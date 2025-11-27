"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type FadeInOnScrollProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export default function FadeInOnScroll({
  children,
  className = "",
  delay = 0,
}: FadeInOnScrollProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

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

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`
        opacity-0 translate-y-6 scale-95
        transition-all duration-700 ease-out
        ${isVisible ? "opacity-100 translate-y-0 scale-100" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
