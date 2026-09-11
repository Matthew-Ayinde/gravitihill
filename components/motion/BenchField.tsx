"use client";

import { useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { EASE_3D } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * THE BENCH — home §02's field controller
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Four practices share one fixed field, split into quadrants by two hairlines.
 * The split follows the pointer: whichever quadrant it moves toward takes the
 * room, and the other three give that room up. Nothing is added or removed.
 * Capacity moves between practices, which is the claim the headline makes.
 *
 * ── What this file owns, and what it doesn't ────────────────────────────
 * The markup is rendered on the server (PracticeBench) and passed in as
 * children, so the content module, the icon set and Zod never reach the
 * client. This component writes three kinds of CSS variable:
 *
 *   · `--sx` / `--sy` on the field: the column and row split, 0–1
 *   · `--lit` on each quadrant: 0 while it holds a quarter of the area or
 *     less, 1 when it holds the largest share the split allows
 *
 * Everything visible is derived from those in globals.css: quadrant geometry,
 * the surface tone, the name's scale and colour, and each service's fade.
 * Each service opens at its own `--lit` threshold, so the list comes in item
 * by item as the pointer moves toward a quadrant and goes back out as it moves
 * away. No timeline is involved; the position of the pointer is the state.
 *
 * ── Why the split can't fight the pointer ───────────────────────────────
 * The split is mirrored around the centre: a pointer right of centre always
 * moves the vertical rule left of centre. That means the pointer is always
 * inside the quadrant it is enlarging, and the rule can never pass over it
 * and flip the state back.
 *
 * ── Input ───────────────────────────────────────────────────────────────
 * · Mouse / pen: continuous, as above. On leave, the field settles fully
 *   onto the quadrant the pointer was favouring, so one practice is always
 *   open and the section reads complete without interaction.
 * · Keyboard: focusing a practice's link opens its quadrant.
 * · Touch (tablets at ≥1024px): the first tap on a closed quadrant opens it,
 *   and a second tap follows the link.
 *
 * Desktop and `prefers-reduced-motion: no-preference` only. PracticeBench
 * hides this field with CSS everywhere else and renders the accordion stack
 * instead, so the listeners below are only attached where they can do
 * anything.
 */

const COL = [0.34, 0.66] as const;
const ROW = [0.3, 0.7] as const;
/** How far from centre the pointer must travel to fully open a quadrant. */
const GAIN = 1.25;
const REST_AREA = 0.25;
const MAX_AREA = COL[1] * ROW[1];

type Split = { sx: number; sy: number };

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/** The split that fully opens quadrant `q` (0 TL, 1 TR, 2 BL, 3 BR). */
function openSplit(q: number): Split {
  return { sx: q % 2 === 0 ? COL[1] : COL[0], sy: q < 2 ? ROW[1] : ROW[0] };
}

function quadrantOf({ sx, sy }: Split): number {
  return (sx >= 0.5 ? 0 : 1) + (sy >= 0.5 ? 0 : 2);
}

export function BenchField({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const cells = gsap.utils.toArray<HTMLElement>("[data-bench-cell]", el);
        const state: Split = { ...openSplit(0) };
        const target: Split = { ...openSplit(0) };
        let dirty = true;

        const render = () => {
          if (!dirty) return;
          dirty = false;
          el.style.setProperty("--sx", state.sx.toFixed(4));
          el.style.setProperty("--sy", state.sy.toFixed(4));
          cells.forEach((cell, q) => {
            const w = q % 2 === 0 ? state.sx : 1 - state.sx;
            const h = q < 2 ? state.sy : 1 - state.sy;
            const lit = clamp((w * h - REST_AREA) / (MAX_AREA - REST_AREA), 0, 1);
            cell.style.setProperty("--lit", lit.toFixed(3));
            cell.toggleAttribute("data-open", lit > 0.6);
          });
        };
        const mark = () => {
          dirty = true;
        };

        // One reused tween per axis. Heavy enough that the split trails the
        // pointer and settles instead of snapping to it.
        const toX = gsap.quickTo(state, "sx", { duration: 0.95, ease: "power3", onUpdate: mark });
        const toY = gsap.quickTo(state, "sy", { duration: 0.95, ease: "power3", onUpdate: mark });

        gsap.ticker.add(render);

        // ── Entrance ─────────────────────────────────────────────────────
        // The rules draw outward from the junction and the names rise, then
        // the field opens onto the first practice. This is skipped if the
        // field is already on screen at hydration (a reload mid-page), where
        // playing it would mean closing a field the reader is already looking
        // at.
        let intro: gsap.core.Timeline | null = null;
        if (!ScrollTrigger.isInViewport(el, 0.1)) {
          const rules = el.querySelectorAll("[data-bench-rule]");
          const node = el.querySelector("[data-bench-node]");
          const heads = el.querySelectorAll("[data-bench-head]");

          Object.assign(state, { sx: 0.5, sy: 0.5 });
          mark();
          gsap.set(rules, { scale: 0 });
          gsap.set(node, { scale: 0 });
          gsap.set(heads, { opacity: 0, y: 28 });

          intro = gsap
            .timeline({
              paused: true,
              onComplete: () => {
                intro = null;
              },
            })
            .to(rules, { scale: 1, duration: 1.1, ease: EASE_3D })
            .to(node, { scale: 1, duration: 0.6, ease: EASE_3D }, 0.35)
            // clearProps: a leftover inline transform on the head would make
            // it the containing block for the link's stretched hit area.
            .to(
              heads,
              { opacity: 1, y: 0, duration: 0.9, stagger: 0.09, ease: EASE_3D, clearProps: "opacity,transform" },
              0.3,
            )
            .to(
              state,
              { ...openSplit(0), duration: 1.5, ease: EASE_3D, onUpdate: mark },
              0.75,
            );

          ScrollTrigger.create({
            trigger: el,
            start: "top 70%",
            once: true,
            onEnter: () => intro?.play(),
          });
        }

        const go = (next: Split) => {
          if (intro) {
            intro.progress(1).kill();
            intro = null;
          }
          Object.assign(target, next);
          toX(next.sx, state.sx);
          toY(next.sy, state.sy);
        };

        // ── Pointer ──────────────────────────────────────────────────────
        const onMove = (event: PointerEvent) => {
          if (event.pointerType === "touch") return;
          const rect = el.getBoundingClientRect();
          const px = (event.clientX - rect.left) / rect.width;
          const py = (event.clientY - rect.top) / rect.height;
          go({
            sx: clamp(0.5 + (0.5 - px) * GAIN, COL[0], COL[1]),
            sy: clamp(0.5 + (0.5 - py) * GAIN, ROW[0], ROW[1]),
          });
        };

        const onLeave = (event: PointerEvent) => {
          if (event.pointerType === "touch") return;
          go(openSplit(quadrantOf(target)));
        };

        // ── Keyboard ─────────────────────────────────────────────────────
        const cellIndex = (node: EventTarget | null) => {
          const cell = (node as Element | null)?.closest?.("[data-bench-cell]");
          return cell ? cells.indexOf(cell as HTMLElement) : -1;
        };

        const onFocus = (event: FocusEvent) => {
          const q = cellIndex(event.target);
          if (q >= 0) go(openSplit(q));
        };

        // ── Touch: first tap opens, second tap follows ───────────────────
        // The open quadrant is read at pointerdown, before the tap's own
        // focus event has had a chance to open the quadrant being tapped.
        let tapGuard = -1;
        const onDown = (event: PointerEvent) => {
          tapGuard = event.pointerType === "touch" ? quadrantOf(target) : -1;
        };
        const onClick = (event: MouseEvent) => {
          if (tapGuard < 0) return;
          const q = cellIndex(event.target);
          if (q >= 0 && q !== tapGuard) {
            event.preventDefault();
            go(openSplit(q));
          }
          tapGuard = -1;
        };

        el.addEventListener("pointermove", onMove);
        el.addEventListener("pointerleave", onLeave);
        el.addEventListener("pointerdown", onDown);
        el.addEventListener("focusin", onFocus);
        el.addEventListener("click", onClick);

        return () => {
          el.removeEventListener("pointermove", onMove);
          el.removeEventListener("pointerleave", onLeave);
          el.removeEventListener("pointerdown", onDown);
          el.removeEventListener("focusin", onFocus);
          el.removeEventListener("click", onClick);
          gsap.ticker.remove(render);
          intro?.kill();
          el.style.removeProperty("--sx");
          el.style.removeProperty("--sy");
        };
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className={cn("bench", className)}>
      {children}
      <span data-bench-rule data-motion aria-hidden="true" className="bench-rule-y" />
      <span data-bench-rule data-motion aria-hidden="true" className="bench-rule-x" />
      <span data-bench-node data-motion aria-hidden="true" className="bench-node" />
    </div>
  );
}
