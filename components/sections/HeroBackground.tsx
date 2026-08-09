"use client";

import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAmbientPlaybackAllowed } from "@/components/ui/AmbientVideo";
import { EASE_BRAND } from "@/lib/motion";
import type { Img } from "@/lib/schemas";

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
 * Only the active slide (and, briefly, the incoming one during a crossfade)
 * is ever mounted — slides are not preloaded up front — so total page
 * weight is bounded by how many the reader actually sits through, not by
 * how many the admin saved.
 */

const DWELL_MS = 7000;
const CROSSFADE_S = 0.9;

export function HeroBackground({ items }: { items: Img[] }) {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduced || items.length < 2) return;
    const id = setInterval(() => {
      setActive((i) => (i + 1) % items.length);
    }, DWELL_MS);
    return () => clearInterval(id);
  }, [reduced, items.length]);

  const current = items[active];
  if (!current) return null;

  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10">
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

      {/* Fixed, not admin-configurable — every slide reads at the same
          contrast regardless of what photography sits behind it. */}
      <div className="absolute inset-0 bg-ridge/60" />
    </div>
  );
}

function HeroSlide({ image, priority }: { image: Img; priority: boolean }) {
  const playAllowed = useAmbientPlaybackAllowed();

  if (image.video && playAllowed) {
    return (
      <video
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
