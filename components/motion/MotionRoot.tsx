"use client";

import { LazyMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * The site's single motion provider.
 *
 * LazyMotion loads framer-motion's DOM feature bundle asynchronously, keeping
 * it out of first-load JS. Every motion component on the site therefore uses
 * `m.*` rather than `motion.*`; `strict` turns a slip into a runtime error
 * instead of a silent 20kb regression.
 *
 * `children` stays a server-rendered tree — this only wraps it in context.
 */
export function MotionRoot({ children }: { children: ReactNode }) {
  return (
    <LazyMotion
      features={() => import("./features").then((f) => f.default)}
      strict
    >
      {children}
    </LazyMotion>
  );
}
