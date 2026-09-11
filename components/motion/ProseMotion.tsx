"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { EASE_3D, EASE_BRAND, TOGGLE_ONCE } from "@/lib/motion";

/**
 * The motion layer for an article body. <ArticleBody> renders every block on
 * the server; this only finds them by data attribute and plays each one once,
 * as the reader reaches it. Nothing is scrubbed and nothing moves twice —
 * text that keeps moving is text that cannot be read.
 *
 * Every block settles within about a second, and paragraphs travel 18px at
 * most: the page should feel like it is gently coming into focus around the
 * reader, never like it is performing while they try to read it.
 *
 * Reduced motion: nothing is set up, and the `data-motion` guard in
 * globals.css holds every block in its final state.
 */
export function ProseMotion({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;

      const all = (selector: string, scope: Element = root) =>
        gsap.utils.toArray<HTMLElement>(selector, scope);
      const once = (trigger: Element, start = "top 88%") => ({
        trigger,
        start,
        toggleActions: TOGGLE_ONCE,
      });

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Paragraphs sharpen out of a slight blur as they rise.
        all("[data-prose-p]").forEach((paragraph) => {
          gsap.fromTo(
            paragraph,
            { opacity: 0, y: 18, filter: "blur(6px)" },
            {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 1,
              ease: EASE_BRAND,
              clearProps: "filter,transform",
              scrollTrigger: once(paragraph),
            },
          );
        });

        // Section heads: the numbered rule draws, then the words rise.
        all("[data-prose-heading]").forEach((heading) => {
          gsap
            .timeline({ scrollTrigger: once(heading) })
            .fromTo(
              heading.querySelector("[data-heading-rule]"),
              { scaleX: 0 },
              { scaleX: 1, duration: 1.2, ease: EASE_3D },
              0,
            )
            .fromTo(
              heading.querySelector("[data-heading-num]"),
              { opacity: 0, x: -12 },
              { opacity: 1, x: 0, duration: 0.6, ease: EASE_BRAND },
              0.1,
            )
            .fromTo(
              heading.querySelector("[data-heading-text]"),
              { yPercent: 105 },
              { yPercent: 0, duration: 0.95, ease: EASE_BRAND },
              0.18,
            );
        });

        // The pull quote: its bar grows down, then the sentence builds.
        all("[data-prose-quote]").forEach((quote) => {
          gsap
            .timeline({ scrollTrigger: once(quote, "top 78%") })
            .fromTo(
              quote.querySelector("[data-quote-bar]"),
              { scaleY: 0 },
              { scaleY: 1, duration: 1.1, ease: EASE_3D },
              0,
            )
            .fromTo(
              all("[data-quote-word]", quote),
              { opacity: 0, yPercent: 30, filter: "blur(6px)" },
              {
                opacity: 1,
                yPercent: 0,
                filter: "blur(0px)",
                duration: 0.8,
                stagger: 0.04,
                ease: EASE_BRAND,
                clearProps: "filter,transform",
              },
              0.2,
            );
        });

        // Lists: each item's tick draws, then its line follows.
        all("[data-prose-list]").forEach((list) => {
          const items = all("li", list);
          gsap
            .timeline({ scrollTrigger: once(list, "top 85%") })
            .fromTo(
              items.map((item) => item.querySelector("[data-item-tick]")),
              { scaleX: 0 },
              { scaleX: 1, duration: 0.7, stagger: 0.12, ease: EASE_3D },
              0,
            )
            .fromTo(
              items.map((item) => item.querySelector("[data-item-text]")),
              { opacity: 0, x: -10 },
              { opacity: 1, x: 0, duration: 0.7, stagger: 0.12, ease: EASE_BRAND, clearProps: "transform" },
              0.15,
            );
        });

        // The end: the rule runs out to the mark, the mark lands, the close
        // fades up beneath it.
        all("[data-prose-end]").forEach((end) => {
          gsap
            .timeline({ scrollTrigger: once(end, "top 85%") })
            .fromTo(
              end.querySelector("[data-end-rule]"),
              { scaleX: 0 },
              { scaleX: 1, duration: 1.1, ease: EASE_3D },
              0,
            )
            .fromTo(
              end.querySelector("[data-end-mark]"),
              { scale: 0, rotate: -90 },
              { scale: 1, rotate: 0, duration: 0.7, ease: "back.out(2.4)" },
              0.75,
            )
            .fromTo(
              all("[data-end-fade]", end),
              { opacity: 0, y: 16 },
              { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: EASE_BRAND, clearProps: "transform" },
              0.95,
            );
        });
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return <div ref={ref}>{children}</div>;
}
