"use client";

import { useEffect, useState } from "react";
import DesktopHero from "./DesktopHero";
import CinematicHero from "./CinematicHero";

/**
 * Mobile gets the pinned cinematic intro (autoplay videos + scroll-driven text
 * beats). Desktop gets the static hero. First paint (SSR + hydration) is the
 * desktop hero, so desktop never loads the mobile clips; phones swap in the
 * cinematic hero after mount.
 */
export default function Hero() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 780px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return isMobile ? <CinematicHero /> : <DesktopHero />;
}
