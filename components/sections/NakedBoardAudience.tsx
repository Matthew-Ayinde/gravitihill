"use client";

import { useState } from "react";
import { m, useReducedMotion } from "framer-motion";
import { cn, indexNumber } from "@/lib/utils";

/**
 * The "who it's for" list, reworked from a plain hairline-ruled list into
 * rows that answer touch/hover with a light sweep — a single soft band of
 * `--green` at low opacity crossing the row, never a gradient on text and
 * never a shadow. The index numeral and the row's own underline both light
 * up with it, so the three read as one response rather than three separate
 * hover states competing for attention.
 */
export function NakedBoardAudience({ items }: { items: string[] }) {
  const reduced = useReducedMotion();

  return (
    <ul className="mt-14 border-t border-rule">
      {items.map((item, i) => (
        <Row key={item} index={i} reduced={!!reduced}>
          {item}
        </Row>
      ))}
    </ul>
  );
}

function Row({
  index,
  children,
  reduced,
}: {
  index: number;
  children: string;
  reduced: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <li
      className="group relative flex gap-6 overflow-hidden border-b border-rule py-7"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      {!reduced && (
        <m.span
          data-motion
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-28 bg-green/[0.05]"
          initial={{ x: "-140%" }}
          animate={{ x: hovered ? "620%" : "-140%" }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        />
      )}

      <span
        className={cn(
          "type-eyebrow relative w-8 shrink-0 pt-1 transition-colors duration-300",
          hovered ? "text-accent" : "text-green",
        )}
      >
        {indexNumber(index)}
      </span>

      <p className="measure relative text-body-lg">{children}</p>

      <span
        aria-hidden="true"
        className={cn(
          "absolute bottom-0 left-0 h-px bg-green transition-all duration-500 ease-brand",
          hovered ? "w-full" : "w-0",
        )}
      />
    </li>
  );
}
