"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { EASE_3D, EASE_BRAND, SCROLL_START, TOGGLE_ONCE } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * A card whose photograph blooms out from wherever the cursor enters it.
 *
 * At rest on desktop the card is type on a dark ground. Entering it opens a
 * circle of photograph from the exact point of entry until it fills the card;
 * leaving closes it back into the point of exit — so the image always seems
 * to come from, and return to, the reader's hand. Keyboard focus blooms from
 * the centre.
 *
 * Phones, tablets without hover, and reduced motion get no bloom at all: the
 * photograph simply sits under the scrim, always visible, which is also the
 * server-rendered state. The bloom is an enhancement layered on a finished
 * card, never a requirement for seeing the image.
 *
 * Moves `[data-bloom-media]`; rises `[data-bloom-rise]` in once on arrival.
 */
export function BloomCard({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      const media = root?.querySelector<HTMLElement>("[data-bloom-media]");
      if (!root) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          gsap.utils.toArray<HTMLElement>("[data-bloom-rise]", root),
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.09,
            ease: EASE_BRAND,
            clearProps: "transform",
            scrollTrigger: { trigger: root, start: SCROLL_START, toggleActions: TOGGLE_ONCE },
          },
        );
      });

      if (!media) return () => mm.revert();

      mm.add("(any-hover: hover) and (prefers-reduced-motion: no-preference)", () => {
        const shut = (x: number, y: number) => `circle(0% at ${x}px ${y}px)`;
        const open = (x: number, y: number) => `circle(150% at ${x}px ${y}px)`;
        const local = (event: { clientX: number; clientY: number }) => {
          const rect = root.getBoundingClientRect();
          return { x: event.clientX - rect.left, y: event.clientY - rect.top };
        };
        const centre = () => ({ x: root.offsetWidth / 2, y: root.offsetHeight / 2 });

        gsap.set(media, { clipPath: shut(centre().x, centre().y) });
        let isOpen = false;

        const bloom = ({ x, y }: { x: number; y: number }) => {
          isOpen = true;
          gsap.fromTo(
            media,
            { clipPath: shut(x, y) },
            { clipPath: open(x, y), duration: 1.1, ease: EASE_3D, overwrite: true },
          );
        };
        const close = ({ x, y }: { x: number; y: number }) => {
          isOpen = false;
          gsap.to(media, { clipPath: shut(x, y), duration: 0.7, ease: "power3.inOut", overwrite: true });
        };

        const onEnter = (event: PointerEvent) => {
          if (event.pointerType === "mouse") bloom(local(event));
        };
        const onLeave = (event: PointerEvent) => {
          if (event.pointerType !== "mouse" || root.contains(document.activeElement)) return;
          close(local(event));
        };
        const onFocusIn = (event: FocusEvent) => {
          const target = event.target as HTMLElement;
          if (!isOpen && target.matches(":focus-visible")) bloom(centre());
        };
        const onFocusOut = (event: FocusEvent) => {
          if (!root.contains(event.relatedTarget as Node | null) && !root.matches(":hover")) {
            close(centre());
          }
        };

        root.addEventListener("pointerenter", onEnter);
        root.addEventListener("pointerleave", onLeave);
        root.addEventListener("focusin", onFocusIn);
        root.addEventListener("focusout", onFocusOut);
        return () => {
          root.removeEventListener("pointerenter", onEnter);
          root.removeEventListener("pointerleave", onLeave);
          root.removeEventListener("focusin", onFocusIn);
          root.removeEventListener("focusout", onFocusOut);
        };
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={cn("relative isolate overflow-hidden", className)}>
      {children}
    </div>
  );
}
