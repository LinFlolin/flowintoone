import { useEffect, useState } from "react";

export function useScrollTrigger(threshold: number) {
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    function handleScroll() {
      if (window.scrollY > threshold) {
        setTriggered(true);
      } else {
        setTriggered(false);
      }
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return triggered;
}
