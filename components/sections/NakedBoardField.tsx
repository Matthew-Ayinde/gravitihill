"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { m, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { AnimatedGrid } from "@/components/motion/AnimatedGrid";
import { GrainOverlay } from "@/components/motion/GrainOverlay";
import { cn } from "@/lib/utils";

/**
 * The dark-panel treatment unique to /the-naked-board: a `--ridge` fill
 * carrying a slow instrument grid and a soft accent glow that leans toward
 * the cursor — surfaces stacked behind the content, not effects bolted
 * onto it.
 *
 * The glow is a blurred solid fill (`blur-3xl` on a plain `bg-accent`
 * circle), never a CSS gradient — same discipline the rest of the site
 * holds to. It lives at low opacity and only exists at all on a fine
 * pointer with no reduced-motion preference; touch and reduced-motion
 * visitors get the grid with nothing tracking the cursor.
 *
 * `grain` is opt-in and off by default. GrainOverlay's `feTurbulence`
 * filter animates continuously for as long as the tab is open — sitewide
 * it only ever runs once, in the footer. This page reuses NakedBoardField
 * three times, so a grain-per-field default would mean three permanent
 * turbulence filters recomputing at once, a real paint cost that has
 * nothing to do with JS weight. Pass it on the hero only, where the
 * texture actually earns its keep as the first thing a visitor sees.
 *
 * Pointer tracking is bound to the section element itself so the glow layer
 * underneath it can stay `pointer-events-none` and leave every click and
 * hover on real content untouched.
 */
export function NakedBoardField({
  children,
  className,
  id,
  labelledBy,
  grain = false,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  labelledBy?: string;
  grain?: boolean;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const [enabled, setEnabled] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 55, damping: 22, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 55, damping: 22, mass: 0.6 });

  useEffect(() => {
    const query = window.matchMedia("(pointer: fine)");
    const update = () => setEnabled(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const live = enabled && !reduced;

  return (
    <section
      ref={ref}
      id={id}
      aria-labelledby={labelledBy}
      className={cn("relative overflow-hidden bg-ridge py-section text-white", className)}
      onPointerMove={
        live
          ? (event) => {
              const rect = ref.current?.getBoundingClientRect();
              if (!rect) return;
              x.set(event.clientX - rect.left);
              y.set(event.clientY - rect.top);
            }
          : undefined
      }
    >
      <AnimatedGrid className="opacity-[0.06]" duration={24} />

      {live && (
        <m.div
          data-motion
          aria-hidden="true"
          className="pointer-events-none absolute z-0 h-112 w-112 rounded-full bg-accent opacity-[0.08] blur-3xl"
          style={{ left: springX, top: springY, x: "-50%", y: "-50%" }}
        />
      )}

      {grain && <GrainOverlay />}

      <div className="relative z-10">{children}</div>
    </section>
  );
}
