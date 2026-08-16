"use client";

import { useEffect, useRef, type ReactNode } from "react";

type Props = {
  src: string;
  /** video 1: plays on its own for ~1s, then hands off to scroll scrubbing */
  autoIntro?: boolean;
  /** intro auto-play duration in ms */
  introMs?: number;
  className?: string;
  children?: ReactNode; // overlay content
  showCue?: boolean;
};

/**
 * A scroll-scrubbed video. The wrapper is a tall track; the video is pinned
 * (sticky) and its currentTime is mapped to how far the track has scrolled —
 * scrolling down runs the clip forward, scrolling up runs it backward.
 *
 * With `autoIntro`, the clip first plays by itself for ~`introMs`, then locks
 * to the scroll position (or hands off immediately if the user scrolls sooner).
 */
export default function ScrollVideo({
  src,
  autoIntro = false,
  introMs = 1000,
  className = "",
  children,
  showCue = false,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const video = videoRef.current;
    if (!wrap || !video) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let duration = 0;
    let current = 0;         // smoothed currentTime
    let armed = !autoIntro;  // when true, scroll controls the video
    let intro = autoIntro;   // intro auto-play in progress
    let raf = 0;
    let disposed = false;

    const progress = () => {
      const rect = wrap.getBoundingClientRect();
      const total = wrap.offsetHeight - window.innerHeight;
      if (total <= 0) return 0;
      const scrolled = -rect.top;
      return Math.min(1, Math.max(0, scrolled / total));
    };

    const onMeta = () => {
      duration = video.duration || 0;
    };

    const endIntro = () => {
      if (!intro) return;
      intro = false;
      video.pause();
      armed = true;
      current = video.currentTime;
    };

    // Hand off to scroll the moment the user scrolls, even mid-intro.
    const onFirstScroll = () => {
      if (intro) endIntro();
    };

    const startIntro = () => {
      if (reduce) { armed = true; return; }
      const p = video.play();
      if (p && typeof p.then === "function") p.catch(() => { armed = true; intro = false; });
      window.setTimeout(endIntro, introMs);
    };

    const loop = () => {
      if (disposed) return;
      if (armed && duration > 0) {
        const target = progress() * duration;
        current += (target - current) * 0.12;
        if (Math.abs(target - current) < 0.002) current = target;
        // Only seek when meaningfully different — avoids thrashing the decoder.
        if (Math.abs(video.currentTime - current) > 0.01) {
          try { video.currentTime = current; } catch { /* seeking not ready */ }
        }
      }
      raf = requestAnimationFrame(loop);
    };

    video.addEventListener("loadedmetadata", onMeta);
    if (video.readyState >= 1) onMeta();

    if (autoIntro) {
      if (video.readyState >= 2) startIntro();
      else video.addEventListener("loadeddata", startIntro, { once: true });
      window.addEventListener("scroll", onFirstScroll, { passive: true });
      window.addEventListener("wheel", onFirstScroll, { passive: true });
      window.addEventListener("touchmove", onFirstScroll, { passive: true });
    }

    raf = requestAnimationFrame(loop);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      video.removeEventListener("loadedmetadata", onMeta);
      window.removeEventListener("scroll", onFirstScroll);
      window.removeEventListener("wheel", onFirstScroll);
      window.removeEventListener("touchmove", onFirstScroll);
    };
  }, [autoIntro, introMs]);

  return (
    <div ref={wrapRef} className={`scrollvideo ${className}`}>
      <div className="scrollvideo__stage">
        <video
          ref={videoRef}
          className="scrollvideo__video"
          src={src}
          muted
          playsInline
          preload="auto"
          disableRemotePlayback
        />
        <div className="scrollvideo__scrim" />
        {children ? <div className="scrollvideo__overlay">{children}</div> : null}
        {showCue ? (
          <div className="scroll-cue" aria-hidden>
            <span>גלה</span>
            <i />
          </div>
        ) : null}
      </div>
    </div>
  );
}
