"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { EASE_BRAND, TRAIL_FOLLOW } from "@/lib/motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

/**
 * Editorial index rows with a cursor-following preview.
 *
 * This is the site's *secondary* motion moment — the only place besides the
 * pinned Sectors panel where motion is allowed to be noticed. It serves both
 * the Insights index and the Leadership index, which is why it is generic:
 * two sections share one interaction instead of inventing two.
 *
 * · Desktop with a fine pointer: the preview follows the cursor, heavily
 *   damped (stiffness 120, damping 24) so it trails rather than tracks.
 * · Touch, narrow viewports, and reduced motion: no preview layer at all —
 *   the row renders its preview inline instead. Not a scaled-down version of
 *   the cursor behaviour; a different, simpler layout.
 *
 * Nothing else on the site gets custom cursor behaviour.
 */

export type PreviewRowItem = {
  id: string;
  href?: string;
  /** Eyebrow-scale metadata on the left — a date, a role, an index. */
  leading: ReactNode;
  title: ReactNode;
  /** Eyebrow-scale metadata on the right — a category, a reading time. */
  trailing?: ReactNode;
  /** Sub-line under the title. Kept short. */
  note?: ReactNode;
  /** The large preview. Rendered in the cursor layer, or inline on touch. */
  preview?: ReactNode;
};

export function PreviewRows({
  items,
  tone = "light",
  className,
}: {
  items: PreviewRowItem[];
  tone?: "light" | "dark";
  className?: string;
}) {
  const reduced = useReducedMotion();
  const [pointerFine, setPointerFine] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const query = window.matchMedia("(pointer: fine) and (min-width: 1024px)");
    const update = () => setPointerFine(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const previewEnabled = pointerFine && !reduced;
  const activeItem = items.find((item) => item.id === active);

  const dark = tone === "dark";

  // Position tracking. Separate from the show/hide tween below so cursor
  // movement never restarts the fade — the panel keeps trailing the cursor
  // whether it is visible or not, which is what makes it appear *already in
  // motion* the moment it fades in rather than flying in from a stale spot.
  useGSAP(
    () => {
      const node = panel.current;
      const container = root.current;
      if (!previewEnabled || !node || !container) return;

      const moveX = gsap.quickTo(node, "x", TRAIL_FOLLOW);
      const moveY = gsap.quickTo(node, "y", TRAIL_FOLLOW);

      const onMove = (event: PointerEvent) => {
        moveX(event.clientX);
        moveY(event.clientY);
      };

      container.addEventListener("pointermove", onMove);
      return () => container.removeEventListener("pointermove", onMove);
    },
    { dependencies: [previewEnabled], scope: root },
  );

  // Show/hide, keyed on which row is hovered.
  useGSAP(
    () => {
      const node = panel.current;
      if (!previewEnabled || !node) return;

      const visible = Boolean(activeItem?.preview);
      gsap.to(node, {
        opacity: visible ? 1 : 0,
        rotateX: visible ? 0 : -8,
        // transformPerspective, not a CSS `perspective` on the element: CSS
        // perspective applies to an element's *children*, so it would do
        // nothing for this panel's own rotateX.
        transformPerspective: 800,
        duration: 0.3,
        ease: EASE_BRAND,
      });
    },
    { dependencies: [previewEnabled, activeItem?.id], scope: root },
  );

  return (
    <div
      ref={root}
      className={cn("relative", className)}
      onPointerLeave={previewEnabled ? () => setActive(null) : undefined}
    >
      <ul>
        {items.map((item) => {
          const body = (
            <>
              <span
                className={cn(
                  "type-eyebrow shrink-0 lg:w-32",
                  dark ? "text-white/45" : "text-ink-muted",
                )}
              >
                {item.leading}
              </span>

              <span className="flex-1">
                <span
                  className={cn(
                    "type-subhead block text-h3",
                    dark ? "text-white" : "text-ink",
                  )}
                >
                  {item.title}
                </span>
                {item.note && (
                  <span
                    className={cn(
                      "measure mt-2 block text-body",
                      dark ? "text-white/65" : "text-ink-muted",
                    )}
                  >
                    {item.note}
                  </span>
                )}

                {/* Touch / narrow / reduced-motion: the preview lives here. */}
                {!previewEnabled && item.preview && (
                  <span className="mt-6 block max-w-md">{item.preview}</span>
                )}
              </span>

              {item.trailing && (
                <span
                  className={cn(
                    "type-eyebrow shrink-0 lg:text-right",
                    dark ? "text-white/45" : "text-ink-muted",
                  )}
                >
                  {item.trailing}
                </span>
              )}
            </>
          );

          const rowClass = cn(
            "flex flex-col gap-3 border-t py-8 transition-colors duration-200 ease-brand lg:flex-row lg:items-baseline lg:gap-10",
            dark
              ? "border-rule-dark hover:bg-white/5"
              : "border-rule hover:bg-canvas-alt",
          );

          return (
            <li key={item.id}>
              {item.href ? (
                <Link
                  href={item.href}
                  className={rowClass}
                  onPointerEnter={
                    previewEnabled ? () => setActive(item.id) : undefined
                  }
                  onFocus={previewEnabled ? () => setActive(null) : undefined}
                >
                  {body}
                </Link>
              ) : (
                <div
                  className={rowClass}
                  onPointerEnter={
                    previewEnabled ? () => setActive(item.id) : undefined
                  }
                >
                  {body}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {previewEnabled && (
        <div
          ref={panel}
          aria-hidden="true"
          // A per-element perspective rather than an ancestor
          // `perspective-scene` class: this panel is `fixed`, and a
          // transformed ancestor would hijack the containing block every
          // other fixed element on the page relies on. The panel tilts on its
          // own axis, unrelated to anything around it.
          //
          // The -50% centring offsets are CSS translate, not part of the GSAP
          // transform, so the quickTo above owns x/y outright and never has
          // to carry the centring in its own values.
          className="pointer-events-none fixed top-0 left-0 z-40 w-[22rem] -translate-x-1/2 -translate-y-1/2 opacity-0"
        >
          {activeItem?.preview}
        </div>
      )}
    </div>
  );
}
