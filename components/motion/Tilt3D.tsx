"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";
import { m, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Pointer-tracked 3D tilt. The card leans away from the cursor within a
 * `perspective-scene` ancestor, spring-damped so it settles rather than
 * snaps, and returns flat on pointer leave.
 *
 * No glare/sheen overlay — that reads as glassmorphism the moment it's
 * added, which is banned regardless of how the rest of the palette opens
 * up. The only visual consequence of the tilt is the tilt itself, plus a
 * shadow that grows with it: shadows exist here because tilt *causes* them,
 * not as decoration on a card that never moves.
 *
 * Fine-pointer desktop only. Touch and reduced motion render the child
 * completely flat, with no listeners attached.
 */
export function Tilt3D({
  children,
  className,
  as = "div",
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
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const springX = useSpring(px, { stiffness: 200, damping: 20 });
  const springY = useSpring(py, { stiffness: 200, damping: 20 });

  const rotateX = useTransform(springY, [0, 1], [max, -max]);
  const rotateY = useTransform(springX, [0, 1], [-max, max]);

  useEffect(() => {
    const query = window.matchMedia("(pointer: fine)");
    const update = () => setEnabled(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const Tag = as;

  if (reduced || !enabled) {
    return (
      <Tag className={className} {...rest}>
        {children}
      </Tag>
    );
  }

  const MotionTag = m[as as keyof typeof m] as typeof m.div;

  return (
    <MotionTag
      ref={ref}
      data-motion
      className={cn("preserve-3d", className)}
      style={{ rotateX, rotateY }}
      // The shadow is tinted --blue rather than neutral black: the closest
      // this site gets to a "light source" for its 3D scene. It only exists
      // as a direct consequence of the tilt (hover-triggered), never sitting
      // on the card at rest — so this isn't the banned shadow-on-every-card.
      whileHover={{
        scale,
        boxShadow: "0 28px 56px -20px rgba(27, 79, 140, 0.35)",
      }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      onPointerMove={(event) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        px.set((event.clientX - rect.left) / rect.width);
        py.set((event.clientY - rect.top) / rect.height);
      }}
      onPointerLeave={() => {
        px.set(0.5);
        py.set(0.5);
      }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}
