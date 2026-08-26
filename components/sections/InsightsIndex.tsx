"use client";

import { useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { PreviewRows, type PreviewRowItem } from "@/components/sections/PreviewRows";
import { Spotlight } from "@/components/motion/Spotlight";
import { EASE_BRAND } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Category filter over the insights index.
 *
 * The rows arrive already rendered by the server — this component receives
 * React elements, not the content module — so filtering costs a category
 * string per row and ships no article data to the browser. The page stays
 * statically generated; only the visible subset changes.
 *
 * The filtered list cross-fades on a category change (keyed on `active`)
 * rather than snapping — a small, cheap `AnimatePresence` swap, gone
 * entirely under reduced motion.
 */

export type FilterableRow = PreviewRowItem & { category: string };

export function InsightsIndex({
  items,
  categories,
}: {
  items: FilterableRow[];
  categories: string[];
}) {
  const [active, setActive] = useState<string | null>(null);
  const reduced = useReducedMotion();

  const visible = active
    ? items.filter((item) => item.category === active)
    : items;

  const list = <PreviewRows items={visible} />;

  return (
    <div className="relative">
      <Spotlight tone="light" size={640} />

      <div
        role="group"
        aria-label="Filter insights by category"
        className="flex flex-wrap items-center gap-x-8 gap-y-3 border-b border-rule pb-6"
      >
        <FilterButton
          active={active === null}
          onClick={() => setActive(null)}
          count={items.length}
        >
          All
        </FilterButton>

        {categories.map((category) => (
          <FilterButton
            key={category}
            active={active === category}
            onClick={() => setActive(category)}
            count={items.filter((item) => item.category === category).length}
          >
            {category}
          </FilterButton>
        ))}
      </div>

      <div className="mt-2">
        {reduced ? (
          list
        ) : (
          <AnimatePresence mode="wait" initial={false}>
            <m.div
              key={active ?? "all"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.32, ease: EASE_BRAND }}
            >
              {list}
            </m.div>
          </AnimatePresence>
        )}
      </div>

      <p className="sr-only" aria-live="polite">
        {visible.length} article{visible.length === 1 ? "" : "s"} shown
        {active ? ` in ${active}` : ""}.
      </p>
    </div>
  );
}

function FilterButton({
  children,
  active,
  count,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="type-eyebrow relative py-1"
    >
      <span className={active ? "text-ink" : "text-ink-muted"}>{children}</span>
      <span className="ml-2 text-ink-muted/70">{count}</span>
      <span
        aria-hidden="true"
        className={cn(
          "absolute -bottom-0.5 left-0 h-px w-full origin-left bg-accent transition-transform duration-200 ease-brand",
          active ? "scale-x-100" : "scale-x-0",
        )}
      />
    </button>
  );
}
