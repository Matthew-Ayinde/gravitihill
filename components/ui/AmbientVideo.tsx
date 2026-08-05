"use client";

import { useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Img } from "@/lib/schemas";

/**
 * Ambient motion for an image slot: muted, looping, inline, no controls, no
 * sound, no chrome. It behaves as a moving photograph, not as a player.
 *
 * Three conditions send it back to the still, and all three are checked before
 * a byte of video is requested:
 *
 *   1. `prefers-reduced-motion: reduce` — non-negotiable. Note that browsers do
 *      NOT pause autoplaying video for this setting, so it has to be handled
 *      here; a CSS rule cannot do it.
 *   2. `navigator.connection.saveData`, or an effective connection of 2g/3g —
 *      the primary audience is on Nigerian mobile networks, and a hero video is
 *      not worth someone's data bundle.
 *   3. No `video` on the record at all.
 *
 * The decision runs in an effect, so the server and the first paint always
 * render the still. The video is an upgrade that arrives after the image is
 * already on screen — it can never delay LCP.
 */
export function AmbientVideo({
  image,
  sizes,
  priority = false,
  className,
}: {
  image: Img & { video: NonNullable<Img["video"]> };
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const [play, setPlay] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (reduced) {
      setPlay(false);
      return;
    }
    const conn = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;
    if (conn?.saveData) return;
    if (conn?.effectiveType && /2g|3g/.test(conn.effectiveType)) return;
    setPlay(true);
  }, [reduced]);

  // Pause when off-screen. A hero that keeps decoding frames after the reader
  // has scrolled past is spending battery on nothing.
  useEffect(() => {
    const el = ref.current;
    if (!el || !play) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [play]);

  if (!play) {
    return (
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={sizes}
        priority={priority}
        className={className ?? "object-cover"}
        {...(image.blurDataURL
          ? { placeholder: "blur" as const, blurDataURL: image.blurDataURL }
          : {})}
      />
    );
  }

  return (
    <video
      ref={ref}
      poster={image.src}
      muted
      loop
      playsInline
      autoPlay
      preload="none"
      aria-label={image.alt}
      className={className ?? "h-full w-full object-cover"}
    >
      {image.video.webm && <source src={image.video.webm} type="video/webm" />}
      {image.video.mp4 && <source src={image.video.mp4} type="video/mp4" />}
    </video>
  );
}
