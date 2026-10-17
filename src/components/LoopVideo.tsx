"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const query = "(prefers-reduced-motion: reduce)";
const subscribe = (cb: () => void) => {
  const m = window.matchMedia(query);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};

// HERO-06 / MOTION-06: muted ambient loop, paused off-screen, poster only under reduced motion
// (reacts live to the system setting). `pausable` adds a visible pause/play control (audit finding 11).
// The server always renders the poster; the video only mounts in the browser once we know the
// visitor has not asked for reduced motion, so no-JS and reduced-motion visitors never get it.
export function LoopVideo({
  mp4,
  webm,
  poster,
  className,
  pausable,
  label = "background video",
}: {
  mp4: string;
  webm?: string;
  poster: string;
  className?: string;
  pausable?: boolean;
  label?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduce = useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => true);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v || reduce || paused) {
      v?.pause();
      return;
    }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) v.play().catch(() => {});
      else v.pause();
    });
    io.observe(v);
    return () => io.disconnect();
  }, [reduce, paused]);

  if (reduce) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={poster} alt="" className={className} fetchPriority="low" decoding="async" />;
  }
  const video = (
    <video ref={ref} className={className} muted loop playsInline preload="metadata" poster={poster} aria-hidden="true">
      {webm && <source src={webm} type="video/webm" />}
      <source src={mp4} type="video/mp4" />
    </video>
  );
  if (!pausable) return video;
  return (
    <div className="loop-wrap">
      {video}
      <button type="button" className="loop-toggle" aria-pressed={paused} onClick={() => setPaused((p) => !p)} aria-label={`${paused ? "Play" : "Pause"} ${label}`}>
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
          {paused ? <path d="M2 1l9 5-9 5z" fill="currentColor" /> : <path d="M2 1h3v10H2zM7 1h3v10H7z" fill="currentColor" />}
        </svg>
        {paused ? "Play" : "Pause"}
      </button>
    </div>
  );
}
