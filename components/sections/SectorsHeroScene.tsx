"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { EASE_3D, EASE_BRAND } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * The motion layer for the /sectors hero. Everything it animates is
 * server-rendered markup handed in as children; this file only finds it by
 * data attribute and moves it:
 *
 *   [data-shutter]          each triptych panel — opens upward on load
 *   [data-shutter-media]    the photograph inside — settles from a zoom on
 *                           load, then drifts against the scroll
 *   [data-shutter-content]  the panel's type — rises in after the panel opens
 *   [data-drift="-1|1"]     headline lines — pull apart as the hero leaves
 *   [data-hero-col]         the drawn 12-column grid — the column under a
 *                           mouse is lit
 *
 * The hover expansion of the shutters is not here: it is CSS state (see the
 * SECTORS HERO block in globals.css), so it costs no JS and works before
 * hydration.
 *
 * ── Tiers ────────────────────────────────────────────────────────────────
 * gsap.matchMedia owns every branch, so each one reverts itself when its
 * query stops matching:
 *   motion allowed, any width  → the load reveal
 *   motion allowed, ≥1024px    → scroll drift, parallax, lit column
 *   reduced motion             → nothing; the hold in globals.css is
 *                                overridden and the hero renders final
 */
export function SectorsHeroScene({
  children,
  className,
  labelledBy,
}: {
  children: ReactNode;
  className?: string;
  labelledBy?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;

      const mm = gsap.matchMedia();

      // ── Load: the triptych opens, left to right ────────────────────────
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const shutters = gsap.utils.toArray<HTMLElement>("[data-shutter]", root);
        const media = gsap.utils.toArray<HTMLElement>("[data-shutter-media]", root);
        const content = gsap.utils.toArray<HTMLElement>("[data-shutter-content]", root);
        if (shutters.length === 0) return;

        // Takes over the pre-hydration hold before MotionRoot releases it.
        gsap.set(shutters, { clipPath: "inset(100% 0% 0% 0%)" });
        gsap.set(media, { scale: 1.3 });
        gsap.set(content, { opacity: 0, y: 24 });

        gsap
          .timeline({ delay: 0.35 })
          .to(
            shutters,
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1.3,
              ease: EASE_3D,
              stagger: 0.12,
              clearProps: "clipPath",
            },
            0,
          )
          .to(media, { scale: 1, duration: 1.8, ease: EASE_3D, stagger: 0.12 }, 0)
          .to(
            content,
            {
              opacity: 1,
              y: 0,
              duration: 0.9,
              ease: EASE_BRAND,
              stagger: 0.12,
              clearProps: "transform,opacity",
            },
            0.55,
          );
      });

      // ── Desktop: scroll and pointer ────────────────────────────────────
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        // The two headline lines pull apart as the hero scrolls away — small
        // numbers, so it reads as the page shifting weight, not sliding.
        gsap.utils.toArray<HTMLElement>("[data-drift]", root).forEach((line) => {
          gsap.to(line, {
            xPercent: (Number(line.dataset.drift) || 0) * 5,
            ease: "none",
            scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
          });
        });

        // Photographs travel against the page. The media layer bleeds 8%
        // past its frame top and bottom, which is what ±6yPercent spends.
        const list = root.querySelector<HTMLElement>("[data-shutter-list]");
        const media = gsap.utils.toArray<HTMLElement>("[data-shutter-media]", root);
        if (list && media.length > 0) {
          gsap.fromTo(
            media,
            { yPercent: -6 },
            {
              yPercent: 6,
              ease: "none",
              scrollTrigger: { trigger: list, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        }

        // The lit column. Left edges are measured on enter and on resize,
        // never per move, so the hot path is arithmetic and one attribute.
        const cols = gsap.utils.toArray<HTMLElement>("[data-hero-col]", root);
        if (cols.length === 0) return;

        let lefts: number[] = [];
        let right = 0;
        let active: HTMLElement | null = null;
        let pointerX = 0;
        let frame = 0;

        const measure = () => {
          lefts = cols.map((col) => col.getBoundingClientRect().left);
          right = cols[cols.length - 1].getBoundingClientRect().right;
        };

        const light = (next: HTMLElement | null) => {
          if (next === active) return;
          active?.removeAttribute("data-active");
          next?.setAttribute("data-active", "");
          active = next;
        };

        const apply = () => {
          frame = 0;
          let index = -1;
          if (pointerX <= right) {
            for (let i = lefts.length - 1; i >= 0; i--) {
              if (pointerX >= lefts[i]) {
                index = i;
                break;
              }
            }
          }
          light(index >= 0 ? cols[index] : null);
        };

        const onMove = (event: PointerEvent) => {
          if (event.pointerType !== "mouse") return;
          pointerX = event.clientX;
          if (!frame) frame = requestAnimationFrame(apply);
        };
        const onLeave = () => light(null);

        measure();
        root.addEventListener("pointerenter", measure);
        root.addEventListener("pointermove", onMove);
        root.addEventListener("pointerleave", onLeave);
        window.addEventListener("resize", measure);

        return () => {
          cancelAnimationFrame(frame);
          light(null);
          root.removeEventListener("pointerenter", measure);
          root.removeEventListener("pointermove", onMove);
          root.removeEventListener("pointerleave", onLeave);
          window.removeEventListener("resize", measure);
        };
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} aria-labelledby={labelledBy} className={cn("relative overflow-hidden", className)}>
      {children}
    </section>
  );
}
