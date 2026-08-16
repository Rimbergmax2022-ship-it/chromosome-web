"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  as?: ElementType;
  delay?: 0 | 1 | 2 | 3;
  className?: string;
};

/** Fades/reveals children when they scroll into view. */
export default function Reveal({ children, as: Tag = "div", delay = 0, className = "" }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref as never} className={`reveal ${className}`} data-delay={delay || undefined}>
      {children}
    </Tag>
  );
}
