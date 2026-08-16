"use client";

import { useEffect, useRef } from "react";

/**
 * One pinned, cinematic intro (mobile).
 *
 * Video A plays on its own for ~2s, then the scroll position scrubs it
 * (down = forward, up = back). Around the middle it cross-fades to video B,
 * which is scrubbed the same way. Three text beats rise in with a dissolving
 * blur as scroll advances. Videos are primed (muted play → pause) so iOS
 * Safari renders the seeked frames instead of showing black.
 */

const VIDEO_A =
  "https://cdn.shopify.com/videos/c/vp/a973874d819e414f9c199d50eb09e285/a973874d819e414f9c199d50eb09e285.SD-480p-1.5Mbps-91731697.mp4";
const VIDEO_B =
  "https://cdn.shopify.com/videos/c/vp/c5139a9cc72a4fb48081eff1f68ec4cd/c5139a9cc72a4fb48081eff1f68ec4cd.SD-480p-1.5Mbps-91731696.mp4";

const INTRO_MS = 2000;

// beat 1 is present from the start and lifts away; beats 2 & 3 rise in.
const BEATS = [
  { start: 0.0, in: 0.0, out: 0.16, end: 0.24 },
  { start: 0.3, in: 0.42, out: 0.56, end: 0.64 },
  { start: 0.7, in: 0.82, out: 1.02, end: 1.02 },
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
    if (!wrap || !vA || !vB) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let dA = 0, dB = 0;
    let curA = 0, curB = 0;
    let introActive = !reduce;
    let introTimer = 0;
    let raf = 0;
    let disposed = false;

    for (const v of [vA, vB]) {
      v.muted = true;
      v.setAttribute("muted", "");
      v.setAttribute("playsinline", "");
      v.setAttribute("webkit-playsinline", "true");
    }

    const onMetaA = () => { dA = vA.duration || 0; };
    const onMetaB = () => { dB = vB.duration || 0; };
    vA.addEventListener("loadedmetadata", onMetaA);
    vB.addEventListener("loadedmetadata", onMetaB);
    if (vA.readyState >= 1) onMetaA();
    if (vB.readyState >= 1) onMetaB();

    const endIntro = () => {
      if (!introActive) return;
      introActive = false;
      try { vA.pause(); } catch {}
      curA = vA.currentTime;
    };

    const startIntro = () => {
      if (reduce) { introActive = false; return; }
      const p = vA.play();
      if (p && typeof p.then === "function") p.catch(() => { introActive = false; });
      introTimer = window.setTimeout(endIntro, INTRO_MS);
    };

    // Decode a frame of B (kept hidden) so iOS renders its seeks later.
    const primeB = () => {
      const p = vB.play();
      if (p && typeof p.then === "function") {
        p.then(() => { vB.pause(); try { if (vB.currentTime < 0.02) vB.currentTime = 0.03; } catch {} }).catch(() => {});
      } else { try { vB.pause(); } catch {} }
    };

    const onFirstScroll = () => { if (introActive) { clearTimeout(introTimer); endIntro(); } };
    const unlock = () => { if (introActive) vA.play().catch(() => {}); primeB(); };

    window.addEventListener("scroll", onFirstScroll, { passive: true });
    window.addEventListener("touchmove", onFirstScroll, { passive: true });
    window.addEventListener("touchstart", unlock, { passive: true, once: true });
    window.addEventListener("click", unlock, { once: true });

    try { vA.load(); } catch {}
    try { vB.load(); } catch {}
    startIntro();
    primeB();

    const PA = 0.52; // scroll fraction over which A scrubs
    const PB = 0.48; // B starts scrubbing from here

    const applyBeat = (el: HTMLDivElement | null, p: number, b: typeof BEATS[number]) => {
      if (!el) return;
      let opacity = 0, y = 44, blur = 12;
      if (p >= b.start && p <= b.end) {
        if (b.in > b.start && p < b.in) {
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

      vB.style.opacity = String(clamp01((p - 0.46) / (0.62 - 0.46)));

      // Scrub A (after its 2s intro): intro covered [0..introEnd], scroll covers the rest.
      if (!introActive && dA > 0) {
        const introEndA = Math.min(INTRO_MS / 1000, dA);
        const tA = clamp01(p / PA);
        const target = introEndA + tA * Math.max(0, dA - introEndA);
        curA += (target - curA) * 0.14;
        if (Math.abs(target - curA) < 0.002) curA = target;
        if (Math.abs(vA.currentTime - curA) > 0.01) { try { vA.currentTime = curA; } catch {} }
      }

      // Scrub B across the second half.
      if (dB > 0) {
        const tB = clamp01((p - PB) / (1 - PB));
        const target = tB * dB;
        curB += (target - curB) * 0.14;
        if (Math.abs(target - curB) < 0.002) curB = target;
        if (Math.abs(vB.currentTime - curB) > 0.01) { try { vB.currentTime = curB; } catch {} }
      }

      beatRefs.forEach((r, i) => applyBeat(r.current, p, BEATS[i]));
      if (cueRef.current) cueRef.current.style.opacity = String(clamp01(1 - p / 0.06));

      raf = requestAnimationFrame(render);
    };

    if (reduce) {
      beatRefs.forEach((r) => { if (r.current) { r.current.style.opacity = "1"; r.current.style.transform = "none"; r.current.style.filter = "none"; } });
      vB.style.opacity = "0";
    } else {
      raf = requestAnimationFrame(render);
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      clearTimeout(introTimer);
      vA.removeEventListener("loadedmetadata", onMetaA);
      vB.removeEventListener("loadedmetadata", onMetaB);
      window.removeEventListener("scroll", onFirstScroll);
      window.removeEventListener("touchmove", onFirstScroll);
      window.removeEventListener("touchstart", unlock);
      window.removeEventListener("click", unlock);
    };
  }, []);

  return (
    <section className="cine" ref={wrapRef}>
      <div className="cine__stage">
        <video ref={aRef} className="cine__video" src={VIDEO_A} muted playsInline preload="auto" disableRemotePlayback />
        <video ref={bRef} className="cine__video cine__video--b" src={VIDEO_B} muted playsInline preload="auto" disableRemotePlayback />
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
        .cine { position: relative; height: 460vh; }
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
