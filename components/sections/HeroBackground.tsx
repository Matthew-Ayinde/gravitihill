"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/use-reduced-motion";
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
  // The slide on its way out. Held in state rather than unmounted on the spot
  // because a crossfade needs both frames present for its whole duration —
  // this is the job AnimatePresence used to do, done explicitly.
  const [exiting, setExiting] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const drift = useRef<HTMLDivElement>(null);

  // The background lags the fold as it scrolls out — a slower rate than the
  // foreground content above it, which is the depth cue parallax trades on.
  // Overscanned via scale so the drift never exposes an edge.
  useGSAP(
    () => {
      if (reduced || !ref.current || !drift.current) return;

      gsap.fromTo(
        drift.current,
        { yPercent: 0 },
        {
          yPercent: 20,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    },
    { dependencies: [reduced], scope: ref },
  );

  useEffect(() => {
    if (reduced || items.length < 2) return;
    const id = setInterval(() => {
      setActive((i) => {
        setExiting(i);
        return (i + 1) % items.length;
      });
    }, DWELL_MS);
    return () => clearInterval(id);
  }, [reduced, items.length]);

  // The crossfade itself: the incoming slide rises out of a slight zoom while
  // the outgoing one dissolves, then the outgoing frame is dropped from the
  // DOM so only ever two slides exist at once.
  useGSAP(
    () => {
      if (reduced || exiting === null || !ref.current) return;

      const incoming = ref.current.querySelector<HTMLElement>(`[data-slide="${active}"]`);
      const outgoing = ref.current.querySelector<HTMLElement>(`[data-slide="${exiting}"]`);

      if (incoming) {
        gsap.fromTo(
          incoming,
          { opacity: 0, scale: 1.04 },
          { opacity: 1, scale: 1, duration: CROSSFADE_S, ease: EASE_BRAND },
        );
      }
      if (outgoing) {
        gsap.to(outgoing, {
          opacity: 0,
          duration: CROSSFADE_S,
          ease: EASE_BRAND,
          onComplete: () => setExiting(null),
        });
      } else {
        setExiting(null);
      }
    },
    { dependencies: [active, exiting, reduced], scope: ref },
  );

  const current = items[active];
  if (!current) return null;

  const upNext =
    !reduced && items.length > 1 ? items[(active + 1) % items.length] : undefined;
  const leaving = exiting !== null ? items[exiting] : undefined;

  return (
    <div ref={ref} aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
      <div ref={drift} data-motion className="absolute inset-0 scale-[1.12]">
        {leaving && exiting !== active && (
          <div key={`exit-${exiting}`} data-slide={exiting} className="absolute inset-0">
            <HeroSlide image={leaving} priority={false} />
          </div>
        )}
        <div key={active} data-slide={active} className="absolute inset-0">
          <HeroSlide image={current} priority={active === 0} />
        </div>
      </div>

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
  // the crossfade drops it from the DOM, rather than trusting garbage
  // collection to reclaim them on its own.
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
