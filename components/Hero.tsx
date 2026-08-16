"use client";

import { useEffect, useState } from "react";
import ScrollVideo from "./ScrollVideo";
import DesktopHero from "./DesktopHero";

// NOTE: these two clips are the MOBILE versions (portrait). Desktop uses the
// static hero above. When desktop videos are provided, add them here and
// render a desktop ScrollVideo variant instead of <DesktopHero/>.
const VIDEO_A =
  "https://cdn.shopify.com/videos/c/vp/a973874d819e414f9c199d50eb09e285/a973874d819e414f9c199d50eb09e285.SD-480p-1.5Mbps-91731697.mp4";
const VIDEO_B =
  "https://cdn.shopify.com/videos/c/vp/c5139a9cc72a4fb48081eff1f68ec4cd/c5139a9cc72a4fb48081eff1f68ec4cd.SD-480p-1.5Mbps-91731696.mp4";

function MobileVideos() {
  return (
    <>
      <ScrollVideo src={VIDEO_A} autoIntro introMs={1000} showCue>
        <p className="eyebrow" style={{ marginBottom: 22 }}>Professional Cosmetics</p>
        <h1 className="display">היופי מתחיל<br /><span className="gold-text">בתא.</span></h1>
        <p>קוסמטיקה מקצועית מבוססת טבע — קסם בגבול המודרני.</p>
      </ScrollVideo>

      <ScrollVideo src={VIDEO_B}>
        <h2 className="display gold-text">טבע. מדע. מגע.</h2>
        <p>כל פורמולה נולדת מתוך דיוק — לעור רך, מוזן וזוהר.</p>
      </ScrollVideo>
    </>
  );
}

/**
 * Renders the mobile scroll-scrub videos on phones and the static hero on
 * desktop. First paint (SSR + hydration) is the desktop hero, so desktop never
 * downloads the mobile clips; phones swap in the videos after mount.
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

  return isMobile ? <MobileVideos /> : <DesktopHero />;
}
