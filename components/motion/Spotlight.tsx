"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * A soft radial light that follows the pointer across a panel — a light
 * source, not a shadow. §0.2 bans gradient-mesh blobs and decorative
 * backdrop-blur; this is neither: one radial gradient pinned to the cursor,
 * gone the instant the pointer leaves.
 *
 * Scoped to the secondary routes' "ambient system layer" (see PageHero,
 * CtaPanel, ContactForm) — never imported by the home route or The Naked
 * Board, so neither is affected by this file existing.
 *
 * ── The look ─────────────────────────────────────────────────────────────
 * A cool blue-white core (the brand's own --blue-light, reserved by the
 * palette's own comment for "hover glows, data highlights") cooling through
 * two more stops into --accent at the rim, rather than one flat colour with
 * a hard cutoff — the same falloff a real point light has. On dark panels
 * it's composited with `mix-blend-mode: screen` so it reads as light adding
 * onto the surface, not a tinted disc sitting on top of it; screen is
 * skipped on light panels, where it would just wash out toward white and
 * erase the effect.
 *
 * ── Why this costs almost nothing ───────────────────────────────────────────
 * The pointer position is written straight to two CSS custom properties on
 * the DOM node, rAF-throttled to at most one write per frame. There is no
 * React state, no re-render, no layout read in the hot path — only a paint
 * of the radial-gradient background, confined to this one absolutely-
 * positioned layer. `--spot-x`/`--spot-y` are registered as animatable
 * lengths (see the `@property` rules in globals.css), so the browser itself
 * eases the light from one position to the next on a damped curve — the
 * same "trails rather than tracks" quality as PreviewRows' cursor preview
 * and Tilt3D's lean, just done natively instead of with a spring — with no
 * extra JS work per frame beyond the one property write above.
 *
 * Fine-pointer desktop only; touch and `prefers-reduced-motion` attach no
 * listener at all, and the layer stays at its resting opacity (0) forever.
 */
export function Spotlight({
  className,
  tone = "dark",
  size = 560,
}: {
  className?: string;
  /** Dark panels get a cooler, more visible bloom; light panels stay a
   *  near-imperceptible wash so it never competes with body text. */
  tone?: "dark" | "light";
  /** Diameter of the light, in px. */
  size?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    const host = el?.parentElement;
    if (!el || !host) return;

    if (!window.matchMedia("(pointer: fine)").matches) return;

    let raf = 0;
    let pendingX = 0;
    let pendingY = 0;

    const apply = () => {
      raf = 0;
      el.style.setProperty("--spot-x", `${pendingX}px`);
      el.style.setProperty("--spot-y", `${pendingY}px`);
    };

    const onMove = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      pendingX = event.clientX - rect.left;
      pendingY = event.clientY - rect.top;
      el.style.setProperty("--spot-opacity", "1");
      if (!raf) raf = requestAnimationFrame(apply);
    };

    const onLeave = () => el.style.setProperty("--spot-opacity", "0");

    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, [reduced]);

  const stops =
    tone === "dark"
      ? [
          "rgba(210, 228, 255, 0.24) 0%",
          "rgba(79, 134, 198, 0.17) 28%",
          "rgba(138, 191, 77, 0.10) 55%",
          "transparent 78%",
        ]
      : [
          "rgba(32, 102, 22, 0.06) 0%",
          "rgba(32, 102, 22, 0.03) 45%",
          "transparent 75%",
        ];

  if (reduced) return null;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0", className)}
      style={
        {
          opacity: "var(--spot-opacity, 0)",
          mixBlendMode: tone === "dark" ? "screen" : "normal",
          background: `radial-gradient(${size}px circle at var(--spot-x, 50%) var(--spot-y, 50%), ${stops.join(", ")})`,
          transition:
            "opacity 500ms ease-out, --spot-x 450ms cubic-bezier(0.22, 1, 0.36, 1), --spot-y 450ms cubic-bezier(0.22, 1, 0.36, 1)",
        } as React.CSSProperties
      }
    />
  );
}
