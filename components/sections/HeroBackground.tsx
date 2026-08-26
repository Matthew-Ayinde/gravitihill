"use client";

import {
  AnimatePresence,
  m,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useAmbientPlaybackAllowed } from "@/components/ui/AmbientVideo";
import { EASE_BRAND } from "@/lib/motion";
import type { Img } from "@/lib/schemas";
import { releaseVideoElement } from "@/lib/utils";

/**
 * The home hero's optional background: one static slide, or several
 * auto-rotating. This is a second animated moment on a site whose brief
 * allows exactly one (the Sectors panel) — it exists only because it was
 * requested explicitly, stays admin-optional (see app/page.tsx), and is
 * built to the same restraint as everything else here: no dots, no arrows,
 * no manual controls, a slow dwell and the same crossfade grammar
 * SectorsPanel already established rather than a new one.
 *
 * Reduced motion is non-negotiable: the timer never starts, so the first
 * slide renders and stays — no crossfade, matching the Sectors panel's own
 * fallback to a static state under the same setting.
 *
 * Only the active slide and the one due up next are ever mounted — not the
 * whole set — so total page weight stays bounded by two slides regardless
 * of how many the admin saved. The "next" one is preloaded hidden as soon
 * as its predecessor becomes active, which given the 7s dwell gives it
 * ample time to warm the browser cache before its crossfade starts, so the
 * swap itself never has to wait on a fetch.
 */

const DWELL_MS = 7000;
const CROSSFADE_S = 0.9;

export function HeroBackground({ items }: { items: Img[] }) {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // The background lags the fold as it scrolls out — a slower rate than the
  // foreground content above it, which is the depth cue parallax trades on.
  // Overscanned via scale so the drift never exposes an edge.
  //
  // Gated on `mounted`: useScroll has nothing to measure before the DOM
  // exists, so the pre-mount client render must match the server's static
  // markup exactly, or React flags a hydration mismatch on every route with
  // an admin-set hero background.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (reduced || items.length < 2) return;
    const id = setInterval(() => {
      setActive((i) => (i + 1) % items.length);
    }, DWELL_MS);
    return () => clearInterval(id);
  }, [reduced, items.length]);

  const current = items[active];
  if (!current) return null;

  const upNext =
    !reduced && items.length > 1 ? items[(active + 1) % items.length] : undefined;
  const live = mounted && !reduced;

  return (
    <div ref={ref} aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
      <m.div
        data-motion
        className="absolute inset-0 scale-[1.12]"
        style={live ? { y } : undefined}
      >
        <AnimatePresence initial={false}>
          <m.div
            key={active}
            data-motion
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: CROSSFADE_S, ease: EASE_BRAND }}
          >
            <HeroSlide image={current} priority={active === 0} />
          </m.div>
        </AnimatePresence>
      </m.div>

      {upNext && upNext !== current && <SlidePreload image={upNext} />}

      {/* Fixed, not admin-configurable — every slide reads at the same
          contrast regardless of what photography sits behind it. */}
      <div className="absolute inset-0 bg-ridge/60" />
    </div>
  );
}

/** Warms the browser cache for a slide before it becomes active — invisible, never in flow. */
function SlidePreload({ image }: { image: Img }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (image.video) return;
    const img = new window.Image();
    img.src = image.src;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image.src]);

  // This element exists purely to force-buffer the *next* slide's video —
  // `preload="auto"` tells the browser to fully download and decode it. That
  // makes cleanup on the way out mandatory, not optional: it is re-created
  // every DWELL_MS for as long as the hero rotates, i.e. for as long as the
  // tab stays open. Letting each one leave the DOM without an explicit
  // release is what turns this warm-cache trick into an unbounded video
  // decoder leak instead of a one-time convenience. See releaseVideoElement.
  useEffect(() => {
    return () => releaseVideoElement(ref.current);
  }, []);

  if (!image.video) return null;

  return (
    <video
      key={image.video.mp4 ?? image.video.webm}
      ref={ref}
      muted
      playsInline
      preload="auto"
      className="absolute h-px w-px opacity-0"
    >
      {image.video.webm && <source src={image.video.webm} type="video/webm" />}
      {image.video.mp4 && <source src={image.video.mp4} type="video/mp4" />}
    </video>
  );
}

function HeroSlide({ image, priority }: { image: Img; priority: boolean }) {
  const playAllowed = useAmbientPlaybackAllowed();
  const ref = useRef<HTMLVideoElement>(null);

  // Same leak as SlidePreload, from the other end of the rotation: this is
  // the *visible* video, and it's swapped for a new one every DWELL_MS as
  // the hero advances. Release its decode buffers explicitly before
  // AnimatePresence removes it, rather than trusting garbage collection to
  // reclaim them on its own.
  useEffect(() => {
    return () => releaseVideoElement(ref.current);
  }, []);

  if (image.video && playAllowed) {
    return (
      <video
        ref={ref}
        poster={image.src}
        muted
        loop
        playsInline
        autoPlay
        preload="none"
        className="h-full w-full object-cover"
      >
        {image.video.webm && <source src={image.video.webm} type="video/webm" />}
        {image.video.mp4 && <source src={image.video.mp4} type="video/mp4" />}
      </video>
    );
  }

  return (
    <Image
      src={image.src}
      alt=""
      fill
      priority={priority}
      sizes="100vw"
      className="object-cover"
      {...(image.blurDataURL
        ? { placeholder: "blur" as const, blurDataURL: image.blurDataURL }
        : {})}
    />
  );
}
