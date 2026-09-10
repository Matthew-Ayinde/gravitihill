"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { EASE_BRAND } from "@/lib/motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

/**
 * Pointer-tracked 3D tilt. The card leans away from the cursor within a
 * `perspective-scene` ancestor, damped so it settles rather than snaps, and
 * returns flat on pointer leave.
 *
 * No glare/sheen overlay and no shadow — both read as decoration bolted onto
 * the tilt rather than a consequence of it. The only visual effect is the
 * tilt (plus the hover scale) itself.
 *
 * Three quickTo instances (rotateX, rotateY, scale) are built once and
 * re-targeted per pointer event — see <Magnetic> for why that matters at 60
 * events a second.
 *
 * Fine-pointer desktop only. Touch and reduced motion render the child
 * completely flat, with no listeners attached.
 */
export function Tilt3D({
  children,
  className,
  as: Tag = "div",
  max = 7,
  scale = 1.02,
  ...rest
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  /** Maximum rotation in degrees, either axis. */
  max?: number;
  /** Scale applied on hover, on top of the tilt. */
  scale?: number;
  [key: string]: unknown;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(pointer: fine)");
    const update = () => setEnabled(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const live = enabled && !reduced;

  useGSAP(
    () => {
      const node = ref.current;
      if (!live || !node) return;

      const settle = { duration: 0.4, ease: EASE_BRAND };
      const rotateX = gsap.quickTo(node, "rotateX", settle);
      const rotateY = gsap.quickTo(node, "rotateY", settle);
      const scaleTo = gsap.quickTo(node, "scale", settle);

      const onMove = (event: PointerEvent) => {
        const rect = node.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width;
        const py = (event.clientY - rect.top) / rect.height;
        // py 0 (top) → +max, py 1 (bottom) → -max: the card leans away.
        rotateX(gsap.utils.interpolate(max, -max, py));
        rotateY(gsap.utils.interpolate(-max, max, px));
        scaleTo(scale);
      };
      const onLeave = () => {
        rotateX(0);
        rotateY(0);
        scaleTo(1);
      };

      node.addEventListener("pointermove", onMove);
      node.addEventListener("pointerleave", onLeave);
      return () => {
        node.removeEventListener("pointermove", onMove);
        node.removeEventListener("pointerleave", onLeave);
      };
    },
    { dependencies: [live, max, scale], scope: ref },
  );

  if (!live) {
    return (
      <Tag className={className} {...rest}>
        {children}
      </Tag>
    );
  }

  return (
    <Tag ref={ref} data-motion className={cn("preserve-3d", className)} {...rest}>
      {children}
    </Tag>
  );
}
