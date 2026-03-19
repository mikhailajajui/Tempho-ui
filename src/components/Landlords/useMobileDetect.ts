"use client";

import { useEffect, useState } from "react";

export function useMobileDetect(breakpoint = 1024) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth <= breakpoint);

    update();
    window.addEventListener("resize", update, { passive: true });

    return () => window.removeEventListener("resize", update);
  }, [breakpoint]);

  return isMobile;
}
