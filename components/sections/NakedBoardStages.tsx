"use client";

import { useRef } from "react";
import {
  m,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { Tilt3D } from "@/components/motion/Tilt3D";
import { Icon } from "@/components/icons";
import type { NakedBoard } from "@/lib/schemas";
import { cn, indexNumber } from "@/lib/utils";

/**
 * The five-stage programme, run as an instrument rather than a plain list.
 *
 * A rail runs down the left edge (desktop only): an accent fill tracks how
 * far the reader has scrolled through the sequence, with a small node riding
 * its leading edge, and whichever stage sits nearest the centre of the
 * viewport brightens — icon ring, name, rule and rail node together. This is
 * the scroll-linked "you are here" cousin of the Sectors panel's progress
 * rule, without any pinning — the page keeps scrolling natively throughout.
 *
 * Each row also leans very slightly toward the cursor (`Tilt3D`, capped low)
 * for a texture of physicality on hover. Mobile drops the rail and the tilt
 * and reads as a plain, static-lit list.
 */
export function NakedBoardStages({ stages }: { stages: NakedBoard["stages"] }) {
  const reduced = useReducedMotion();
  const railRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ["start center", "end center"],
  });
  const fill = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 26,
    restDelta: 0.001,
  });
  const dotTop = useTransform(fill, (v) => `${Math.min(Math.max(v, 0), 1) * 100}%`);

  return (
    <ol className="perspective-scene relative mt-16">
      <div
        ref={railRef}
        aria-hidden="true"
        className="absolute top-1 bottom-1 left-[15px] hidden w-px bg-rule-dark lg:block"
      >
        {!reduced && (
          <>
            <m.div
              data-motion
              className="absolute inset-0 origin-top bg-accent"
              style={{ scaleY: fill }}
            />
            <m.div
              data-motion
              className="absolute left-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent"
              style={{ top: dotTop }}
            />
          </>
        )}
      </div>

      {stages.map((stage, i) => (
        <StageRow
          key={stage.name}
          stage={stage}
          index={i}
          last={i === stages.length - 1}
        />
      ))}
    </ol>
  );
}

function StageRow({
  stage,
  index,
  last,
}: {
  stage: NakedBoard["stages"][number];
  index: number;
  last: boolean;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const active = useInView(ref, { margin: "-42% 0px -42% 0px" });

  return (
    <li
      ref={ref}
      className={cn("border-t border-rule-dark", last && "border-b")}
    >
      <Tilt3D max={2} scale={1} className="py-8 lg:pl-12">
        <div className="flex gap-6">
          <span
            className={cn(
              "type-eyebrow w-8 shrink-0 pt-1.5 transition-colors duration-500",
              active ? "text-accent" : "text-white/40",
            )}
          >
            {indexNumber(index)}
          </span>

          <div
            className={cn(
              "relative mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border transition-colors duration-500",
              active ? "border-accent" : "border-white/20",
            )}
          >
            <span
              className={cn(
                "absolute -inset-px rounded-full border border-dashed opacity-50 [animation-duration:14s]",
                active ? "animate-spin border-accent" : "border-white/15",
              )}
            />
            <Icon
              name={stage.icon}
              className={cn(
                "h-5 w-5 transition-colors duration-500",
                active ? "text-white" : "text-white/45",
              )}
              accentClassName={active ? "text-accent" : "text-white/25"}
            />
          </div>

          <div>
            <h3
              className={cn(
                "type-subhead text-h3 transition-colors duration-500",
                active ? "text-white" : "text-white/55",
              )}
            >
              {stage.name}
            </h3>
            <p
              className={cn(
                "measure mt-2 transition-colors duration-500",
                active ? "text-white/70" : "text-white/35",
              )}
            >
              {stage.summary}
            </p>
          </div>
        </div>
      </Tilt3D>
    </li>
  );
}
