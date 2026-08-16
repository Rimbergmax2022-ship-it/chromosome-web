"use client";

import Image from "next/image";
import logo from "@/public/logo.png";

/** Elegant static hero shown on desktop (the scroll-scrub videos are mobile-only). */
export default function DesktopHero() {
  return (
    <section className="dhero">
      <div className="dhero__glow" aria-hidden />
      <div className="dhero__inner">
        <div className="dhero__logo">
          <Image src={logo} alt="Chromosome — Professional Cosmetics" width={340} height={301} priority />
        </div>
        <h1 className="display dhero__title">
          היופי מתחיל <span className="gold-text">בתא.</span>
        </h1>
        <p className="dhero__sub">קוסמטיקה מקצועית מבוססת טבע — קסם בגבול המודרני.</p>
        <div className="dhero__cta">
          <a href="#products" className="btn btn--gold">לגילוי הסדרה</a>
          <a href="#story" className="btn btn--ghost">הסיפור שלנו</a>
        </div>
      </div>

      <a href="#products" className="scroll-cue" aria-hidden>
        <span>גלה</span><i />
      </a>

      <style jsx>{`
        .dhero {
          position: relative; min-height: 100svh;
          display: grid; place-items: center; text-align: center;
          padding: 120px clamp(20px, 5vw, 64px) 90px; overflow: hidden;
        }
        .dhero__glow {
          position: absolute; z-index: 0; top: 42%; left: 50%;
          width: 78vw; max-width: 900px; aspect-ratio: 1;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle, rgba(202,168,106,0.18), rgba(202,168,106,0.06) 38%, transparent 62%);
          filter: blur(10px); animation: breathe 8s var(--ease) infinite;
        }
        @keyframes breathe { 0%,100% { transform: translate(-50%,-50%) scale(1); opacity: 0.85; } 50% { transform: translate(-50%,-50%) scale(1.08); opacity: 1; } }
        .dhero__inner { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; }
        .dhero__logo { animation: float 7s var(--ease) infinite; }
        .dhero__logo :global(img) { width: clamp(210px, 22vw, 320px); height: auto; object-fit: contain; filter: drop-shadow(0 20px 50px rgba(202,168,106,0.25)); }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        .dhero__title { font-size: clamp(2.8rem, 7vw, 6rem); line-height: 1.0; margin-top: 26px; }
        .dhero__sub { color: var(--ink-soft); margin-top: 22px; font-size: clamp(1rem, 1.5vw, 1.22rem); max-width: 34ch; }
        .dhero__cta { display: flex; gap: 16px; margin-top: 38px; flex-wrap: wrap; justify-content: center; }
      `}</style>
    </section>
  );
}
