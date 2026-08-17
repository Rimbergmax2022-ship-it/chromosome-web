"use client";

import { useEffect, useRef } from "react";

/**
 * One pinned, cinematic intro (mobile).
 *
 * Video A plays on its own for ~2s, then the scroll position scrubs it
 * (down = forward, up = back). Around the middle it cross-fades to video B.
 * Text arrives as a CINEMATIC MASK REVEAL: every line rises out from behind a
 * hidden mask, line after line, and lifts back up as the beat leaves.
 */

// Self-hosted HD clips (H.264, 1080x1920). A = jars falling from above, B = submerged.
const VIDEO_A = "/videos/a.mp4";
const VIDEO_B = "/videos/b.mp4";
const INTRO_MS = 2000;

type Line = { t: string; kind: "eyebrow" | "h" | "sub" | "cta"; gold?: boolean; mt?: string };
type Beat = { r: [number, number, number, number]; lines: Line[] };

const BEATS: Beat[] = [
  {
    r: [0.02, 0.14, 0.2, 0.28],
    lines: [
      { t: "Professional Cosmetics", kind: "eyebrow" },
      { t: "היופי מתחיל", kind: "h", mt: "0.22em" },
      { t: "בתא.", kind: "h", gold: true },
      { t: "קוסמטיקה מקצועית מבוססת טבע.", kind: "sub", mt: "0.7em" },
    ],
  },
  {
    r: [0.34, 0.47, 0.56, 0.64],
    lines: [
      { t: "טבע. מדע. מגע.", kind: "h", gold: true },
      { t: "כל פורמולה נולדת מתוך דיוק.", kind: "sub", mt: "0.6em" },
    ],
  },
  {
    r: [0.7, 0.85, 1.02, 1.02],
    lines: [
      { t: "לעור רך,", kind: "h" },
      { t: "מוזן וזוהר.", kind: "h", gold: true },
      { t: "טיפוח יוקרתי לידיים, לרגליים ולגוף.", kind: "sub", mt: "0.6em" },
      { t: "לגילוי הסדרה", kind: "cta", mt: "1.2em" },
    ],
  },
];

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);

export default function CinematicHero() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const aRef = useRef<HTMLVideoElement>(null);
  const bRef = useRef<HTMLVideoElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const vA = aRef.current;
    const vB = bRef.current;
    if (!wrap || !vA || !vB) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lines = Array.from(wrap.querySelectorAll<HTMLElement>(".cine__line"));

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

    const PA = 0.52, PB = 0.48;

    const applyLine = (el: HTMLElement, p: number) => {
      const b = +(el.dataset.b || 0);
      const l = +(el.dataset.l || 0);
      const n = +(el.dataset.n || 1);
      const [start, inp, out, end] = BEATS[b].r;
      const entrance = inp - start;
      const revealDur = Math.max(0.0001, entrance * 0.55);
      const delay = n > 1 ? (l / n) * entrance * 0.6 : 0;
      let ty: number;
      if (p <= out) {
        const t = easeOut(clamp01((p - (start + delay)) / revealDur));
        ty = (1 - t) * 130;
      } else {
        const e = easeOut(clamp01((p - out) / Math.max(0.0001, end - out)));
        ty = -e * 130;
      }
      el.style.transform = `translateY(${ty}%)`;
    };

    const render = () => {
      if (disposed) return;
      const rect = wrap.getBoundingClientRect();
      const total = wrap.offsetHeight - window.innerHeight;
      const P = total > 0 ? clamp01(-rect.top / total) : 0;

      vB.style.opacity = String(clamp01((P - 0.46) / (0.62 - 0.46)));

      if (!introActive && dA > 0) {
        const introEndA = Math.min(INTRO_MS / 1000, dA);
        const target = introEndA + clamp01(P / PA) * Math.max(0, dA - introEndA);
        curA += (target - curA) * 0.14;
        if (Math.abs(target - curA) < 0.002) curA = target;
        if (Math.abs(vA.currentTime - curA) > 0.01) { try { vA.currentTime = curA; } catch {} }
      }
      if (dB > 0) {
        const target = clamp01((P - PB) / (1 - PB)) * dB;
        curB += (target - curB) * 0.14;
        if (Math.abs(target - curB) < 0.002) curB = target;
        if (Math.abs(vB.currentTime - curB) > 0.01) { try { vB.currentTime = curB; } catch {} }
      }

      lines.forEach((el) => applyLine(el, P));
      if (cueRef.current) cueRef.current.style.opacity = String(clamp01(1 - P / 0.06));

      raf = requestAnimationFrame(render);
    };

    if (reduce) {
      lines.forEach((el) => { el.style.transform = "none"; });
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
      <h1 className="sr-only">Chromosome — קוסמטיקה מקצועית מבוססת טבע</h1>
      <div className="cine__stage">
        <video ref={aRef} className="cine__video" src={VIDEO_A} muted playsInline preload="auto" disableRemotePlayback />
        <video ref={bRef} className="cine__video cine__video--b" src={VIDEO_B} muted playsInline preload="auto" disableRemotePlayback />
        <div className="cine__scrim" />

        <div className="cine__beats">
          {BEATS.map((beat, bi) => (
            <div className="cine__beat" key={bi}>
              {beat.lines.map((ln, li) => {
                const n = beat.lines.length;
                if (ln.kind === "cta") {
                  return (
                    <span className="cine__mask" key={li} style={{ marginTop: ln.mt }}>
                      <a href="#products" className="cine__line btn btn--gold" data-b={bi} data-l={li} data-n={n}>{ln.t}</a>
                    </span>
                  );
                }
                const cls =
                  ln.kind === "h" ? "cine__h" : ln.kind === "eyebrow" ? "eyebrow" : "cine__sub";
                return (
                  <span className="cine__mask" key={li} style={{ marginTop: ln.mt }}>
                    <span className={`cine__line ${cls} ${ln.gold ? "gold-text" : ""}`} data-b={bi} data-l={li} data-n={n}>
                      {ln.t}
                    </span>
                  </span>
                );
              })}
            </div>
          ))}
        </div>

        <div className="scroll-cue" ref={cueRef} aria-hidden><span>גלה</span><i /></div>
      </div>

      <style jsx>{`
        .cine { position: relative; height: 460vh; }
        .cine__stage { position: sticky; top: 0; height: 100svh; overflow: hidden; background: #000; }
        .cine__video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
        .cine__video--b { opacity: 0; }
        .cine__scrim { position: absolute; inset: 0; pointer-events: none;
          background: linear-gradient(180deg, rgba(6,6,6,0.5) 0%, transparent 26%, transparent 55%, rgba(6,6,6,0.92) 100%); }
        .cine__beats { position: absolute; inset: 0; z-index: 2; }
        .cine__beat {
          position: absolute; inset: 0; display: flex; flex-direction: column;
          align-items: center; justify-content: center; text-align: center; padding: 0 26px;
        }
        .cine__mask { display: block; overflow: hidden; padding-bottom: 0.08em; }
        .cine__line { display: block; will-change: transform; transform: translateY(130%); }
        .cine__h { font-family: var(--font-suez), serif; font-weight: 400;
          font-size: clamp(2.7rem, 13vw, 4.8rem); line-height: 1.04; text-shadow: 0 8px 50px rgba(0,0,0,0.55); }
        .cine__sub { color: var(--ink-soft); font-size: clamp(1rem, 4.4vw, 1.2rem); max-width: 26ch; }
        .cine__mask :global(.btn) { pointer-events: auto; }
        .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
      `}</style>
    </section>
  );
}
