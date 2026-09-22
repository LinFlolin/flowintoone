"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

export function ScrollReveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observe = () => {
      const element = elementRef.current;
      if (!element || !("IntersectionObserver" in window)) {
        setIsVisible(true);
        return;
      }

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        },
        { threshold: 0.14 },
      );

      observer.observe(element);
      return () => observer.disconnect();
    };

    if (document.readyState === "complete") {
      return observe();
    }

    const onLoad = () => observe();
    window.addEventListener("load", onLoad, { once: true });
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return <div ref={elementRef} style={{ "--flow-reveal-delay": `${delay}ms` } as CSSProperties} className={`flow-scroll-reveal ${isVisible ? "is-visible" : ""} ${className}`}>{children}</div>;
}
