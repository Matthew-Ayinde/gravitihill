"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { m, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
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

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 120, damping: 24 });
  const springY = useSpring(y, { stiffness: 120, damping: 24 });

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

  return (
    <div
      className={cn("relative", className)}
      onPointerMove={
        previewEnabled
          ? (event) => {
              x.set(event.clientX);
              y.set(event.clientY);
            }
          : undefined
      }
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
        <m.div
          aria-hidden="true"
          className="pointer-events-none fixed top-0 left-0 z-40 w-[22rem]"
          style={{
            x: springX,
            y: springY,
            translateX: "-50%",
            translateY: "-50%",
            transformPerspective: 800,
          }}
          initial={false}
          // A per-element perspective (via the transformPerspective motion
          // value) rather than an ancestor `perspective-scene` class: this
          // panel is `fixed`, and a transformed ancestor would hijack the
          // containing block every other fixed element on the page relies
          // on. The panel tilts into place on its own axis, unrelated to
          // anything around it.
          animate={{
            opacity: activeItem?.preview ? 1 : 0,
            rotateX: activeItem?.preview ? 0 : -8,
          }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          {activeItem?.preview}
        </m.div>
      )}
    </div>
  );
}
