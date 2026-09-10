"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { EASE_BRAND, SCROLL_START, TOGGLE_ONCE } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * The motion layer for the /insights lead. Everything it moves is markup
 * <InsightsLead> has already server-rendered; this finds it by attribute:
 *
 *   [data-aperture-stage]   the viewport-high stage (sticky on desktop)
 *   [data-aperture-frame]   the photograph's frame — opens from a small
 *                           aperture to the full stage as the reader scrolls
 *   [data-aperture-media]   the photograph — settles from a zoom as the frame
 *                           opens, and leans away from the cursor once open
 *   [data-lead-meta]        the eyebrow row
 *   [data-lead-title]       the title, inside its link — wipes up out of its
 *                           own box
 *   [data-lead-fade]        excerpt and read cue
 *
 * ── Tiers ────────────────────────────────────────────────────────────────
 *   ≥1024px, motion allowed   the section is a tall scroll track (see
 *                             .lead-track in globals.css) and the aperture
 *                             is scrubbed through it; scroll back, it closes
 *   <1024px, motion allowed   no track, no pin: the photograph settles as it
 *                             passes and the copy rises in once
 *   reduced motion            nothing is set — a full-bleed panel at rest
 *
 * The pin is CSS `position: sticky`, not a ScrollTrigger pin: no spacer
 * element, nothing for Lenis to fight, and it survives a failed hydration.
 */
export function LeadAperture({
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

      const stage = root.querySelector<HTMLElement>("[data-aperture-stage]");
      const frame = root.querySelector<HTMLElement>("[data-aperture-frame]");
      const media = root.querySelector<HTMLElement>("[data-aperture-media]");
      const scrim = root.querySelector<HTMLElement>("[data-aperture-scrim]");
      const title = root.querySelector<HTMLElement>("[data-lead-title]");
      const meta = gsap.utils.toArray<HTMLElement>("[data-lead-meta]", root);
      const fades = gsap.utils.toArray<HTMLElement>("[data-lead-fade]", root);
      if (!stage || !frame || !media || !scrim || !title) return;

      const mm = gsap.matchMedia();

      // ── Desktop: the aperture ──────────────────────────────────────────
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        // The scrub starts while the stage is still rising into view, so the
        // letterbox is already opening as it arrives and the stage never sits
        // still around a closed frame.
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: root, start: "top 65%", end: "bottom bottom", scrub: 0.8 },
          })
          .fromTo(
            frame,
            { clipPath: "inset(33% 6% 33% 6% round 4px)" },
            { clipPath: "inset(0% 0% 0% 0% round 0px)", duration: 0.5, ease: "power2.inOut" },
            0,
          )
          .fromTo(media, { scale: 1.35 }, { scale: 1, duration: 0.62, ease: "power1.out" }, 0)
          .fromTo(scrim, { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0.34)
          .fromTo(meta, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.1 }, 0.42)
          .fromTo(
            title,
            { y: 90, clipPath: "inset(0% 0% 100% 0%)" },
            { y: 0, clipPath: "inset(-20% -5% -25% -5%)", duration: 0.22, ease: "power2.out" },
            0.46,
          )
          .fromTo(fades, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.12, stagger: 0.05 }, 0.6)
          // Held open for the last stretch of the track, so the piece can be
          // read before the stage releases.
          .to({}, { duration: 0.22 });

        // The photograph leans away from the cursor. The media layer bleeds
        // 4% past the frame on every side, which is what ±2.5% spends.
        const toX = gsap.quickTo(media, "xPercent", { duration: 1.1, ease: "power3" });
        const toY = gsap.quickTo(media, "yPercent", { duration: 1.1, ease: "power3" });

        const onMove = (event: PointerEvent) => {
          if (event.pointerType !== "mouse") return;
          const rect = stage.getBoundingClientRect();
          toX(((event.clientX - rect.left) / rect.width - 0.5) * -5);
          toY(((event.clientY - rect.top) / rect.height - 0.5) * -5);
        };
        const onLeave = () => {
          toX(0);
          toY(0);
        };

        stage.addEventListener("pointermove", onMove);
        stage.addEventListener("pointerleave", onLeave);
        return () => {
          stage.removeEventListener("pointermove", onMove);
          stage.removeEventListener("pointerleave", onLeave);
        };
      });

      // ── Phones and tablets: a quieter arrival ──────────────────────────
      mm.add("(max-width: 1023.98px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          media,
          { scale: 1.2 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
        gsap.fromTo(
          [...meta, title, ...fades],
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.08,
            ease: EASE_BRAND,
            scrollTrigger: { trigger: stage, start: SCROLL_START, toggleActions: TOGGLE_ONCE },
          },
        );
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} aria-labelledby={labelledBy} className={cn("relative", className)}>
      {children}
    </section>
  );
}
