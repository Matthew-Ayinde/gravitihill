"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { EASE_3D, EASE_BRAND } from "@/lib/motion";
import { cn, wordTokens } from "@/lib/utils";

export type HeadlineSegment = { text: string; className?: string };

/**
 * A headline set on Archivo's two axes, and moved along them.
 *
 * The /insights opening. Every other hero on the site moves its type through
 * space — typed on, extruded, drifted, wiped. This one moves it through the
 * *font*: the width and weight axes are the animation, which is the thing a
 * variable superfamily can do that no other device on the site does.
 *
 *   · Entrance: each word arrives wide and light (wdth 100 / wght 300) and
 *     condenses into the display cut (wdth 72 / wght 700) as it rises out of
 *     its line — the sentence tightening into a position.
 *   · Pointer (desktop): words near the cursor open back toward a reading
 *     cut and close again as it moves on. Proximity is measured against each
 *     word's *resting* centre, captured once, so a word widening never moves
 *     the target it is being measured against — no feedback, no jitter.
 *
 * ── Tiers ────────────────────────────────────────────────────────────────
 *   ≥1024px, motion allowed   entrance on both axes + pointer field
 *   <1024px, motion allowed   words rise out of their lines, no axis work
 *   reduced motion            the finished headline at first paint
 *
 * The visible words are aria-hidden; one sr-only copy carries the sentence,
 * so assistive tech reads it once and whole rather than word by word.
 */

type Cut = { w: number; g: number };

/** The site's display role. */
const REST: Cut = { w: 72, g: 700 };
/** Where a word opens to under the pointer. */
const OPEN: Cut = { w: 100, g: 400 };
/** Where the entrance begins. */
const START: Cut = { w: 100, g: 300 };

function paintCut(node: HTMLElement, cut: Cut) {
  node.style.fontVariationSettings = `"wdth" ${cut.w.toFixed(2)}`;
  node.style.fontWeight = String(Math.round(cut.g));
}

export function PressureHeadline({
  lines,
  id,
  className,
}: {
  /** Hand-set lines. Each line holds one or more toned segments. */
  lines: HeadlineSegment[][];
  id?: string;
  className?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const label = lines
    .map((line) => line.map((segment) => segment.text).join("").trim())
    .join(" ");

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const words = gsap.utils.toArray<HTMLElement>("[data-word]", root);
      if (words.length === 0) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          wide: "(min-width: 1024px)",
          motion: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const { wide, motion } = context.conditions as { wide: boolean; motion: boolean };
          if (!motion) return;

          const cuts = words.map(() => ({ ...(wide ? START : REST) }));
          const paint = () => words.forEach((word, i) => paintCut(word, cuts[i]));
          let detach: (() => void) | undefined;

          gsap.set(words, { yPercent: 120 });
          if (wide) paint();

          const timeline = gsap.timeline({ delay: 0.2 });
          timeline.to(words, { yPercent: 0, duration: 1.1, stagger: 0.07, ease: EASE_BRAND }, 0);

          if (wide) {
            timeline.to(
              cuts,
              { w: REST.w, g: REST.g, duration: 1.5, stagger: 0.07, ease: EASE_3D, onUpdate: paint },
              0.05,
            );
            // The field only arms once the sentence has settled, so the two
            // never write to the same axis at once.
            timeline.eventCallback("onComplete", () => {
              context.add(() => {
                detach = listen(root, words, cuts);
              });
            });
          }

          return () => {
            detach?.();
            words.forEach((word) => {
              word.style.fontVariationSettings = "";
              word.style.fontWeight = "";
            });
          };
        },
      );

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <h1 ref={ref} id={id} className={cn("type-display", className)}>
      <span className="sr-only">{label}</span>
      <span aria-hidden="true" data-hold className="block">
        {lines.map((line, lineIndex) => (
          <span key={lineIndex} className="press-line block lg:whitespace-nowrap">
            {line.map((segment, segmentIndex) =>
              wordTokens(segment.text).map((token, tokenIndex) =>
                /^\s+$/.test(token) ? (
                  token
                ) : (
                  <span
                    key={`${segmentIndex}-${tokenIndex}`}
                    data-word
                    data-motion
                    className={cn("inline-block", segment.className)}
                  >
                    {token}
                  </span>
                ),
              ),
            )}
          </span>
        ))}
      </span>
    </h1>
  );
}

/**
 * The pointer field. Listens on the nearest `[data-press-field]` ancestor so
 * the whole hero is live, not just the glyphs. Returns its own teardown.
 */
function listen(root: HTMLElement, words: HTMLElement[], cuts: Cut[]): () => void {
  const field = root.closest<HTMLElement>("[data-press-field]") ?? root;
  let centres: Array<{ x: number; y: number }> = [];
  let radius = 320;

  const measure = () => {
    const box = root.getBoundingClientRect();
    radius = Math.max(260, box.width * 0.3);
    centres = words.map((word) => {
      const rect = word.getBoundingClientRect();
      return {
        x: rect.left - box.left + rect.width / 2,
        y: rect.top - box.top + rect.height / 2,
      };
    });
  };
  measure();

  const toWidth = words.map((word, i) =>
    gsap.quickTo(cuts[i], "w", {
      duration: 0.9,
      ease: "power3",
      onUpdate: () => paintCut(word, cuts[i]),
    }),
  );
  const toWeight = cuts.map((cut) => gsap.quickTo(cut, "g", { duration: 0.9, ease: "power3" }));

  const onMove = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    const box = root.getBoundingClientRect();
    const px = event.clientX - box.left;
    const py = event.clientY - box.top;

    centres.forEach((centre, i) => {
      // Vertical distance counts for more: a word on the other line should
      // barely respond to a cursor sitting on this one.
      const distance = Math.hypot(px - centre.x, (py - centre.y) * 1.5);
      const linear = Math.min(1, Math.max(0, 1 - distance / radius));
      const t = linear * linear * (3 - 2 * linear);
      toWidth[i](REST.w + (OPEN.w - REST.w) * t);
      toWeight[i](REST.g + (OPEN.g - REST.g) * t);
    });
  };

  const onLeave = () => {
    toWidth.forEach((to) => to(REST.w));
    toWeight.forEach((to) => to(REST.g));
  };

  field.addEventListener("pointermove", onMove);
  field.addEventListener("pointerleave", onLeave);
  window.addEventListener("resize", measure);

  return () => {
    field.removeEventListener("pointermove", onMove);
    field.removeEventListener("pointerleave", onLeave);
    window.removeEventListener("resize", measure);
  };
}
