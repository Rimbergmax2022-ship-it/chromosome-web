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
 * iOS Safari never preloads video and won't render a paused seek until the clip
 * has been "activated" by a play(), so we prime each video (muted play → pause)
 * when it nears the viewport and on the first touch. With `autoIntro` the clip
 * plays itself for ~`introMs`, then locks to scroll (or hands off immediately
 * if the user scrolls sooner).
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
    let primed = false;      // video has decoded at least one frame (iOS)
    let introStarted = false;
    let raf = 0;
    let disposed = false;

    // iOS inline playback
    video.muted = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "true");

    const progress = () => {
      const rect = wrap.getBoundingClientRect();
      const total = wrap.offsetHeight - window.innerHeight;
      if (total <= 0) return 0;
      return Math.min(1, Math.max(0, -rect.top / total));
    };

    const onMeta = () => { duration = video.duration || 0; };

    // Force a first frame to render (kills the black screen on iOS).
    const showFirstFrame = () => {
      try { if (video.currentTime < 0.02) video.currentTime = 0.03; } catch { /* not seekable yet */ }
    };

    // Muted play→pause to decode/activate the video, then behave per mode.
    const prime = () => {
      if (primed) return;
      const p = video.play();
      if (p && typeof p.then === "function") {
        p.then(() => {
          primed = true;
          if (autoIntro) startIntro();
          else { video.pause(); showFirstFrame(); }
        }).catch(() => {
          // Autoplay blocked — wait for a user gesture (see unlock below).
          showFirstFrame();
        });
      } else {
        primed = true;
        if (!autoIntro) { try { video.pause(); } catch {} showFirstFrame(); }
      }
    };

    const endIntro = () => {
      if (!intro) return;
      intro = false;
      try { video.pause(); } catch {}
      armed = true;
      current = video.currentTime;
    };

    function startIntro() {
      if (introStarted) return;
      introStarted = true;
      if (reduce) { armed = true; return; }
      // already playing from prime(); just time-box the intro
      window.setTimeout(endIntro, introMs);
    }

    // Hand off to scroll the moment the user scrolls, even mid-intro.
    const onFirstScroll = () => { if (intro) endIntro(); };

    // iOS: first touch/click unlocks media playback — prime then.
    const unlock = () => { prime(); };

    const loop = () => {
      if (disposed) return;
      if (armed && duration > 0 && primed) {
        const target = progress() * duration;
        current += (target - current) * 0.12;
        if (Math.abs(target - current) < 0.002) current = target;
        if (Math.abs(video.currentTime - current) > 0.01) {
          try { video.currentTime = current; } catch { /* seeking not ready */ }
        }
      }
      raf = requestAnimationFrame(loop);
    };

    video.addEventListener("loadedmetadata", onMeta);
    video.addEventListener("loadeddata", showFirstFrame, { once: true });
    if (video.readyState >= 1) onMeta();

    // Prime when the section is near the viewport.
    const io = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) prime(); }); },
      { rootMargin: "120% 0px 120% 0px" }
    );
    io.observe(wrap);

    // Kick a load so range requests can start buffering.
    try { video.load(); } catch {}

    window.addEventListener("scroll", onFirstScroll, { passive: true });
    window.addEventListener("touchmove", onFirstScroll, { passive: true });
    window.addEventListener("touchstart", unlock, { passive: true, once: true });
    window.addEventListener("click", unlock, { once: true });

    raf = requestAnimationFrame(loop);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      video.removeEventListener("loadedmetadata", onMeta);
      window.removeEventListener("scroll", onFirstScroll);
      window.removeEventListener("touchmove", onFirstScroll);
      window.removeEventListener("touchstart", unlock);
      window.removeEventListener("click", unlock);
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
