"use client";

import { useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { EASE_3D, SCROLL_START } from "@/lib/motion";
import { cn, indexNumber } from "@/lib/utils";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * WHO WE ARE — home §01's motion layer
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * <AboutPrecis> renders every element on the server. This finds them by
 * attribute and does four things:
 *
 *   [data-precis-track]    "Re-definers of": tracking closes from open to set
 *   [data-precis-weight]   "Brand Building.": weight builds from hairline to
 *                          bold. Both are scrubbed to the scroll and use the
 *                          variable font's own axes rather than a transform.
 *
 *   [data-slat-frame]      one photograph, cut into horizontal slats
 *   [data-slat]            a slat. On approach the slats of the first frame
 *                          sit scattered sideways and assemble as the reader
 *                          scrolls. Stepping to another frame weaves its
 *                          slats in over the current one from alternating
 *                          sides. On a fine pointer, slats near the cursor
 *                          lean toward it.
 *
 *   [data-precis-underline] a rule drawn under the quote's last words, scrubbed
 *   [data-precis-rise]     copy blocks that rise in once
 *
 * The figure column also drifts against the text column on desktop, so the
 * spread reads as two planes.
 *
 * Reduced motion: none of the scroll or pointer work is set up, and stepping
 * between photographs swaps frames instantly. The `data-motion` guard in
 * globals.css holds every transformed element in its final state.
 */

/** Scatter, in % of slat width, for the approach. Uneven on purpose. */
const SCATTER = [-24, 36, -14, 44, -32, 20, -40, 28];

export function PrecisMotion({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const el = root.current;
      if (!el || !contextSafe) return;

      const frames = gsap.utils.toArray<HTMLElement>("[data-slat-frame]", el);
      const stage = el.querySelector<HTMLElement>("[data-precis-stage]");
      const slatsOf = (f: number) => gsap.utils.toArray<HTMLElement>("[data-slat]", frames[f]);
      const mediaOf = (f: number) => gsap.utils.toArray<HTMLElement>("[data-slat-media]", frames[f]);

      let active = 0;
      let animate = false;
      let interacted = false;
      let weave: gsap.core.Timeline | null = null;
      let assembly: gsap.core.Timeline | null = null;
      let settle: (() => void) | null = null;

      // ── Stepping between photographs ─────────────────────────────────
      const indexLabel = el.querySelector("[data-slat-index]");
      const liveLabel = el.querySelector("[data-slat-live]");

      const show = contextSafe((next: number, dir: 1 | -1) => {
        if (frames.length < 2 || next === active) return;
        interacted = true;

        // Hand over cleanly: finish the approach and any weave in flight.
        if (assembly) {
          assembly.scrollTrigger?.kill();
          assembly.progress(1).kill();
          assembly = null;
        }
        weave?.progress(1);
        settle?.();

        const from = active;
        active = next;
        const incoming = frames[next];
        const outgoing = frames[from];

        incoming.setAttribute("data-active", "");
        incoming.removeAttribute("aria-hidden");
        outgoing.setAttribute("aria-hidden", "true");
        if (indexLabel) indexLabel.textContent = indexNumber(next);
        if (liveLabel) liveLabel.textContent = `Photograph ${next + 1} of ${frames.length}`;

        if (!animate) {
          outgoing.removeAttribute("data-active");
          return;
        }

        gsap.set(incoming, { zIndex: 2 });
        gsap.set(outgoing, { zIndex: 1 });
        weave = gsap
          .timeline({
            onComplete: () => {
              outgoing.removeAttribute("data-active");
              gsap.set([incoming, outgoing], { clearProps: "zIndex" });
              gsap.set(mediaOf(from), { scale: 1 });
              weave = null;
            },
          })
          .fromTo(
            slatsOf(next),
            { xPercent: (i: number) => (i % 2 === 0 ? 101 : -101) * dir },
            {
              xPercent: 0,
              duration: 1.05,
              ease: EASE_3D,
              stagger: { each: 0.06, from: dir > 0 ? "start" : "end" },
            },
            0,
          )
          .fromTo(mediaOf(next), { scale: 1.16 }, { scale: 1, duration: 1.5, ease: EASE_3D }, 0)
          .to(mediaOf(from), { scale: 1.08, duration: 1.2, ease: EASE_3D }, 0);
      });

      const prev = el.querySelector("[data-slat-prev]");
      const next = el.querySelector("[data-slat-next]");
      const onPrev = () => show((active - 1 + frames.length) % frames.length, -1);
      const onNext = () => show((active + 1) % frames.length, 1);
      prev?.addEventListener("click", onPrev);
      next?.addEventListener("click", onNext);

      // Swipe on the photograph itself. Horizontal only; vertical drags stay
      // with the page (the stage sets touch-action: pan-y).
      let downX: number | null = null;
      const onDown = (event: PointerEvent) => {
        downX = event.pointerType === "mouse" ? null : event.clientX;
      };
      const onUp = (event: PointerEvent) => {
        if (downX === null) return;
        const dx = event.clientX - downX;
        downX = null;
        if (Math.abs(dx) > 40) (dx < 0 ? onNext : onPrev)();
      };
      stage?.addEventListener("pointerdown", onDown);
      stage?.addEventListener("pointerup", onUp);

      // ── Motion tiers ─────────────────────────────────────────────────
      const one = (selector: string) => el.querySelector<HTMLElement>(selector);
      const heading = one("[data-precis-heading]");
      const figure = one("[data-precis-figure]");
      const underline = one("[data-precis-underline]");
      const rule = one("[data-precis-rule]");

      const mm = gsap.matchMedia(el);
      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          desktop: "(min-width: 1024px)",
          fine: "(hover: hover) and (pointer: fine)",
        },
        (context) => {
          const { motion, desktop, fine } = context.conditions as Record<string, boolean>;
          animate = motion;
          if (!motion) return;

          // Headline: tracking closes, weight builds.
          const scrub = (end: string) => ({
            trigger: heading,
            start: "top 92%",
            end,
            scrub: true,
          });
          gsap.fromTo(
            one("[data-precis-track]"),
            { letterSpacing: "0.1em" },
            { letterSpacing: "-0.02em", ease: "none", scrollTrigger: scrub("top 42%") },
          );
          gsap.fromTo(
            one("[data-precis-weight]"),
            { fontWeight: 150 },
            { fontWeight: 700, ease: "none", scrollTrigger: scrub("top 30%") },
          );

          // The approach: first frame's slats assemble.
          if (stage && frames.length > 0 && active === 0 && !interacted) {
            assembly = gsap
              .timeline({
                scrollTrigger: {
                  trigger: stage,
                  start: "top 95%",
                  end: desktop ? "center 50%" : "top 25%",
                  scrub: true,
                },
              })
              .fromTo(
                slatsOf(0),
                { xPercent: (i: number) => SCATTER[i % SCATTER.length] },
                { xPercent: 0, ease: "none", stagger: 0.03 },
                0,
              )
              .fromTo(mediaOf(0), { scale: 1.24 }, { scale: 1, ease: "none" }, 0);
          }

          // Two planes: the figure drifts against the text.
          if (desktop && figure) {
            gsap.fromTo(
              figure,
              { y: 70 },
              {
                y: -70,
                ease: "none",
                scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
              },
            );
          }

          // The underline under the quote's last words.
          if (underline) {
            gsap.fromTo(
              underline,
              { "--u": 0 },
              {
                "--u": 1,
                ease: "none",
                scrollTrigger: { trigger: underline, start: "top 88%", end: "top 52%", scrub: true },
              },
            );
          }

          // Copy rises in once, in reading order.
          const rises = gsap.utils.toArray<HTMLElement>("[data-precis-rise]", el);
          gsap.set(rises, { opacity: 0, y: 28 });
          ScrollTrigger.batch(rises, {
            start: SCROLL_START,
            once: true,
            onEnter: (batch) =>
              gsap.to(batch, { opacity: 1, y: 0, duration: 0.95, ease: EASE_3D, stagger: 0.12 }),
          });

          if (rule) {
            gsap.fromTo(
              rule,
              { scaleX: 0 },
              { scaleX: 1, duration: 1.3, ease: EASE_3D, scrollTrigger: { trigger: rule, start: SCROLL_START } },
            );
          }

          // Slats lean toward a fine pointer.
          if (!fine || !stage) return;

          const setters = frames.map((_, f) =>
            slatsOf(f).map((slat) => gsap.quickTo(slat, "x", { duration: 0.9, ease: "power3" })),
          );
          const onMove = (event: PointerEvent) => {
            const rect = stage.getBoundingClientRect();
            const px = (event.clientX - rect.left) / rect.width - 0.5;
            const row = setters[active];
            const py = ((event.clientY - rect.top) / rect.height) * row.length;
            row.forEach((set, i) => {
              const d = py - (i + 0.5);
              set(px * 44 * Math.exp(-(d * d) / 1.8));
            });
          };
          const onLeave = () => setters[active].forEach((set) => set(0));
          settle = () => setters.forEach((row) => row.forEach((set) => set(0)));

          stage.addEventListener("pointermove", onMove);
          stage.addEventListener("pointerleave", onLeave);
          return () => {
            stage.removeEventListener("pointermove", onMove);
            stage.removeEventListener("pointerleave", onLeave);
            settle = null;
          };
        },
      );

      return () => {
        mm.revert();
        prev?.removeEventListener("click", onPrev);
        next?.removeEventListener("click", onNext);
        stage?.removeEventListener("pointerdown", onDown);
        stage?.removeEventListener("pointerup", onUp);
      };
    },
    { scope: root },
  );

  return (
    <div ref={root} className={cn(className)}>
      {children}
    </div>
  );
}
