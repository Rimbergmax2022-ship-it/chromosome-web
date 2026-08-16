"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import mark from "@/public/mark.png";

const LINKS = [
  { href: "#products", label: "מוצרים" },
  { href: "#ingredients", label: "הרכיבים" },
  { href: "#story", label: "הסיפור" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`nav ${scrolled ? "nav--scrolled" : ""}`}>
      <a href="#top" className="nav__logo" aria-label="Chromosome — לדף הבית">
        <Image src={mark} alt="" width={26} height={47} priority />
        <span className="nav__word">CHROMOSOME</span>
      </a>

      <nav className={`nav__links ${open ? "open" : ""}`} aria-label="ניווט ראשי">
        {LINKS.map((l) => (
          <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
            {l.label}
          </a>
        ))}
      </nav>

      <div className="nav__actions">
        <a href="#products" className="nav__cta">חנות</a>
        <button
          className="nav__burger"
          aria-label="תפריט"
          onClick={() => setOpen((o) => !o)}
        >
          <span /><span />
        </button>
      </div>

      <style jsx>{`
        .nav {
          position: fixed; top: 0; inset-inline: 0; z-index: 50;
          display: flex; align-items: center; justify-content: space-between;
          padding: 20px clamp(20px, 5vw, 64px);
          transition: background 0.5s var(--ease), padding 0.5s var(--ease), backdrop-filter 0.5s;
        }
        .nav--scrolled {
          background: rgba(6, 6, 6, 0.72); backdrop-filter: blur(18px) saturate(1.1);
          padding-block: 12px; border-bottom: 1px solid var(--line);
        }
        .nav__logo { display: flex; align-items: center; gap: 11px; }
        .nav__logo :global(img) { height: 42px; width: auto; object-fit: contain; }
        .nav__word { font-family: var(--font-suez), serif; font-size: 1.15rem; letter-spacing: 0.2em; color: var(--ink); padding-inline-start: 2px; }
        @media (max-width: 480px) { .nav__word { display: none; } }
        .nav__links { display: flex; gap: clamp(18px, 2.6vw, 42px); }
        .nav__links a { font-size: 0.98rem; color: var(--ink-soft); position: relative; padding: 4px 0; transition: color 0.3s; }
        .nav__links a::after {
          content: ""; position: absolute; inset-inline: 0; bottom: -2px; height: 1px;
          background: var(--gold); transform: scaleX(0); transform-origin: right;
          transition: transform 0.4s var(--ease);
        }
        .nav__links a:hover { color: var(--ink); }
        .nav__links a:hover::after { transform: scaleX(1); }
        .nav__actions { display: flex; align-items: center; gap: 16px; }
        .nav__cta {
          font-size: 0.95rem; color: var(--gold-lt);
          border: 1px solid var(--gold-dk); padding: 0.55em 1.5em; border-radius: 100px;
          transition: all 0.4s var(--ease);
        }
        .nav__cta:hover { background: var(--grad-gold); color: #1a1408; border-color: transparent; }
        .nav__burger { display: none; flex-direction: column; gap: 5px; background: none; border: none; padding: 6px; }
        .nav__burger span { width: 24px; height: 1.6px; background: var(--ink); transition: 0.3s; }

        @media (max-width: 780px) {
          .nav__cta { display: none; }
          .nav__burger { display: flex; }
          .nav__links {
            position: fixed; inset: 0; background: rgba(6, 6, 6, 0.97);
            backdrop-filter: blur(20px); flex-direction: column;
            align-items: center; justify-content: center; gap: 34px; z-index: 49;
            opacity: 0; pointer-events: none; transition: opacity 0.4s var(--ease);
          }
          .nav__links.open { opacity: 1; pointer-events: auto; }
          .nav__links a { font-size: 1.8rem; }
        }
      `}</style>
    </header>
  );
}
