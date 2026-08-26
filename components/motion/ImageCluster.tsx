"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  m,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { Parallax } from "@/components/motion/Parallax";
import { EASE_BRAND } from "@/lib/motion";
import type { Img } from "@/lib/schemas";
import { cn } from "@/lib/utils";

/**
 * The hero's layered photography — the one place on the homepage that spends
 * real motion budget on imagery rather than the headline (the H1 stays
 * plain, instant text; see the comment on HeadlineReveal for why).
 *
 * Three things happen at once, each cheap on its own:
 *   1. Entrance — each tile clip-reveals (inset()) on mount, staggered.
 *      This is a CSS clip-path, not a layout change, so it costs nothing
 *      beyond a composited transition.
 *   2. Depth — every tile drifts at its own rate via <Parallax>, the same
 *      component every other image on the site drifts with, just at a few
 *      different rates so the cluster reads as several planes rather than
 *      one photo.
 *   3. A very light whole-cluster tilt toward the cursor — the same spring
 *      constants Tilt3D uses (stiffness 200 / damping 20), capped at 3° so
 *      it stays a texture, not a toy. Fine-pointer desktop only; touch and
 *      reduced motion render the tiles flat with no listeners attached.
 *
 * Deliberately not <EditorialImage>: that component owns a fixed 3:2/4:5
 * aspect ratio (the site's rule for images sitting *in prose*), but a
 * collage tile's aspect here is set by the grid cell it occupies. Same grade
 * — a --ridge tint, next/image with sizes/blur — carried by hand instead.
 */

type ClusterItem = {
  image: Img;
};

/** Fixed offset composition for up to three tiles — centralised here rather
 *  than left to callers, so the asymmetry is deliberate and repeatable. */
const POSITION = [
  "relative z-20 col-span-8 row-span-8 col-start-1 row-start-1",
  "relative z-30 col-span-6 row-span-6 col-start-7 row-start-6",
  "relative z-10 col-span-5 row-span-5 col-start-2 row-start-10",
] as const;

const PARALLAX_RANGE = [0.12, 0.2, 0.16] as const;
const PARALLAX_DIR = ["up", "down", "up"] as const;
const ENTRANCE_DELAY = [0, 0.16, 0.3] as const;
/** Tile 0 is the largest tile and the likely LCP candidate — it renders at
 *  full opacity immediately, same reasoning HeroBackground documents for why
 *  a full-bleed hero photo stays admin-optional. Only the two smaller tiles
 *  that land visually *on top of* it get the clip-reveal entrance. */
const ANIMATE_ENTRANCE = [false, true, true] as const;

export function ImageCluster({
  items,
  className,
}: {
  items: ClusterItem[];
  className?: string;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [tiltEnabled, setTiltEnabled] = useState(false);

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const springX = useSpring(px, { stiffness: 200, damping: 20 });
  const springY = useSpring(py, { stiffness: 200, damping: 20 });
  const rotateX = useTransform(springY, [0, 1], [3, -3]);
  const rotateY = useTransform(springX, [0, 1], [-3, 3]);

  useEffect(() => {
    const query = window.matchMedia("(pointer: fine)");
    const update = () => setTiltEnabled(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const live = tiltEnabled && !reduced;

  return (
    <div
      ref={ref}
      className={cn("perspective-scene relative", className)}
      onPointerMove={
        live
          ? (event) => {
              const rect = ref.current?.getBoundingClientRect();
              if (!rect) return;
              px.set((event.clientX - rect.left) / rect.width);
              py.set((event.clientY - rect.top) / rect.height);
            }
          : undefined
      }
      onPointerLeave={
        live
          ? () => {
              px.set(0.5);
              py.set(0.5);
            }
          : undefined
      }
    >
      <m.div
        data-motion
        className="preserve-3d grid aspect-4/5 grid-cols-12 grid-rows-12"
        style={live ? { rotateX, rotateY } : undefined}
      >
        {items.slice(0, 3).map((item, i) => (
          <div key={i} className={POSITION[i]}>
            <Tile
              image={item.image}
              range={PARALLAX_RANGE[i]}
              direction={PARALLAX_DIR[i]}
              delay={ENTRANCE_DELAY[i]}
              priority={i === 0}
              animateEntrance={ANIMATE_ENTRANCE[i]}
              reduced={!!reduced}
            />
          </div>
        ))}
      </m.div>
    </div>
  );
}

function Tile({
  image,
  range,
  direction,
  delay,
  priority,
  animateEntrance,
  reduced,
}: {
  image: Img;
  range: number;
  direction: "up" | "down";
  delay: number;
  priority: boolean;
  animateEntrance: boolean;
  reduced: boolean;
}) {
  const photo = (
    <div className="absolute inset-0 scale-[1.14]">
      <Image
        src={image.src}
        alt={image.alt}
        fill
        priority={priority}
        sizes="(min-width: 1024px) 32vw, 60vw"
        className="object-cover"
        {...(image.blurDataURL
          ? { placeholder: "blur" as const, blurDataURL: image.blurDataURL }
          : {})}
      />
    </div>
  );

  const body = (
    <>
      <Parallax range={range} direction={direction} className="absolute inset-0">
        {photo}
      </Parallax>
      <div aria-hidden="true" className="absolute inset-0 bg-ridge/10" />
    </>
  );

  if (reduced || !animateEntrance) {
    return <div className="relative h-full w-full overflow-hidden">{body}</div>;
  }

  return (
    <m.div
      data-motion
      className="relative h-full w-full overflow-hidden"
      initial={{ clipPath: "inset(100% 0% 0% 0%)", opacity: 0 }}
      animate={{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }}
      transition={{ duration: 0.9, ease: EASE_BRAND, delay }}
    >
      {body}
    </m.div>
  );
}
