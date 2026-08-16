"use client";

import { useEffect, useRef } from "react";

/**
 * One pinned, cinematic intro (mobile). The stage stays fixed while you scroll
 * through a tall track; two muted videos autoplay and cross-fade (A → B), and
 * three text "beats" rise in with a dissolving blur as scroll advances, then
 * lift away. Autoplay (not frame-scrubbing) keeps it smooth and black-free on
 * iOS Safari.
 */

const VIDEO_A =
  "https://cdn.shopify.com/videos/c/vp/a973874d819e414f9c199d50eb09e285/a973874d819e414f9c199d50eb09e285.SD-480p-1.5Mbps-91731697.mp4";
const VIDEO_B =
  "https://cdn.shopify.com/videos/c/vp/c5139a9cc72a4fb48081eff1f68ec4cd/c5139a9cc72a4fb48081eff1f68ec4cd.SD-480p-1.5Mbps-91731696.mp4";

// Each beat: hidden < start, rises in start→in, holds in→out, lifts out out→end.
const BEATS = [
  { start: 0.0, in: 0.08, out: 0.2, end: 0.28 },
  { start: 0.34, in: 0.44, out: 0.56, end: 0.64 },
  { start: 0.7, in: 0.8, out: 1.01, end: 1.01 },
];

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);

export default function CinematicHero() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const aRef = useRef<HTMLVideoElement>(null);
  const bRef = useRef<HTMLVideoElement>(null);
  const beatRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];
  const cueRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const vA = aRef.current;
    const vB = bRef.current;
    if (!wrap) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Keep the muted videos playing (iOS-safe).
    const kick = (v: HTMLVideoElement | null) => {
      if (!v) return;
      v.muted = true;
      const p = v.play();
      if (p && typeof p.then === "function") p.catch(() => {});
    };
    kick(vA); kick(vB);
    const unlock = () => { kick(vA); kick(vB); };
    window.addEventListener("touchstart", unlock, { passive: true, once: true });
    window.addEventListener("click", unlock, { once: true });

    let raf = 0;
    let disposed = false;

    const applyBeat = (el: HTMLDivElement | null, p: number, b: typeof BEATS[number]) => {
      if (!el) return;
      let opacity = 0, y = 40, blur = 12;
      if (p >= b.start && p <= b.end) {
        if (p < b.in) {
          const t = easeOut(clamp01((p - b.start) / (b.in - b.start)));
          opacity = t; y = (1 - t) * 44; blur = (1 - t) * 12;
        } else if (p <= b.out) {
          opacity = 1; y = 0; blur = 0;
        } else {
          const t = easeOut(clamp01((p - b.out) / (b.end - b.out)));
          opacity = 1 - t; y = -t * 44; blur = t * 12;
        }
      }
      el.style.opacity = String(opacity);
      el.style.transform = `translateY(${y}px)`;
      el.style.filter = `blur(${blur}px)`;
    };

    const render = () => {
      if (disposed) return;
      const rect = wrap.getBoundingClientRect();
      const total = wrap.offsetHeight - window.innerHeight;
      const p = total > 0 ? clamp01(-rect.top / total) : 0;

      // Cross-fade A → B around the middle.
      if (vB) vB.style.opacity = String(clamp01((p - 0.46) / (0.62 - 0.46)));

      beatRefs.forEach((r, i) => applyBeat(r.current, p, BEATS[i]));

      if (cueRef.current) cueRef.current.style.opacity = String(clamp01(1 - p / 0.08));

      raf = requestAnimationFrame(render);
    };

    if (reduce) {
      // Static fallback: show all beats, no pinning math.
      beatRefs.forEach((r) => {
        if (r.current) { r.current.style.opacity = "1"; r.current.style.transform = "none"; r.current.style.filter = "none"; }
      });
      if (vB) vB.style.opacity = "0";
    } else {
      raf = requestAnimationFrame(render);
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("touchstart", unlock);
      window.removeEventListener("click", unlock);
    };
  }, []);

  return (
    <section className="cine" ref={wrapRef}>
      <div className="cine__stage">
        <video ref={aRef} className="cine__video" src={VIDEO_A} muted playsInline autoPlay loop preload="auto" disableRemotePlayback />
        <video ref={bRef} className="cine__video cine__video--b" src={VIDEO_B} muted playsInline autoPlay loop preload="auto" disableRemotePlayback />
        <div className="cine__scrim" />

        <div className="cine__beats">
          <div className="cine__beat" ref={beatRefs[0]}>
            <p className="eyebrow">Professional Cosmetics</p>
            <h1 className="display cine__h">היופי מתחיל<br /><span className="gold-text">בתא.</span></h1>
            <p className="cine__sub">קוסמטיקה מקצועית מבוססת טבע.</p>
          </div>

          <div className="cine__beat" ref={beatRefs[1]}>
            <h2 className="display cine__h gold-text">טבע. מדע. מגע.</h2>
            <p className="cine__sub">כל פורמולה נולדת מתוך דיוק.</p>
          </div>

          <div className="cine__beat" ref={beatRefs[2]}>
            <h2 className="display cine__h">לעור רך,<br />מוזן <span className="gold-text">וזוהר.</span></h2>
            <p className="cine__sub">טיפוח יוקרתי לידיים, לרגליים ולגוף.</p>
            <a href="#products" className="btn btn--gold cine__cta">לגילוי הסדרה</a>
          </div>
        </div>

        <div className="scroll-cue" ref={cueRef} aria-hidden><span>גלה</span><i /></div>
      </div>

      <style jsx>{`
        .cine { position: relative; height: 420vh; }
        .cine__stage { position: sticky; top: 0; height: 100svh; overflow: hidden; background: #000; }
        .cine__video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
        .cine__video--b { opacity: 0; }
        .cine__scrim { position: absolute; inset: 0; pointer-events: none;
          background: linear-gradient(180deg, rgba(6,6,6,0.5) 0%, transparent 26%, transparent 55%, rgba(6,6,6,0.9) 100%); }
        .cine__beats { position: absolute; inset: 0; z-index: 2; }
        .cine__beat {
          position: absolute; inset: 0; display: flex; flex-direction: column;
          align-items: center; justify-content: center; text-align: center;
          padding: 0 26px; will-change: opacity, transform, filter; opacity: 0;
        }
        .cine__beat :global(.eyebrow) { margin-bottom: 16px; }
        .cine__h { font-size: clamp(2.6rem, 12vw, 4.6rem); line-height: 1.02; text-shadow: 0 8px 50px rgba(0,0,0,0.6); }
        .cine__sub { margin-top: 18px; color: var(--ink-soft); font-size: clamp(1rem, 4.4vw, 1.2rem); max-width: 26ch; }
        .cine__cta { margin-top: 30px; pointer-events: auto; }
      `}</style>
    </section>
  );
}
