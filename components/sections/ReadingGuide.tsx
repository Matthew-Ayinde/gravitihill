"use client";

import { useRef, useState, type RefObject } from "react";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { cn, indexNumber } from "@/lib/utils";

/**
 * The reading guide: where the reader is in a piece, and how long is left.
 *
 *   <ReadingRail>  desktop — sticky beside the text: a ring that fills with
 *                  progress, a minutes-left count that ticks down, and the
 *                  piece's parts, each with its own progress rule
 *   <ReadingBar>   phones — a compact bar that sticks to the bottom of the
 *                  screen while the text is in view
 *
 * Both read the same measurements (`useReading`): one trigger across the
 * whole body for overall progress, one per `[data-part]` for the part rules
 * and the current part. Progress is written straight to the DOM as CSS
 * custom properties and transforms, so scrolling never re-renders React;
 * only the whole-minute count and the active part are state, and those
 * change a handful of times per read.
 *
 * These are position indicators, not decoration, so they run under reduced
 * motion too — they just stop easing (the sitewide transition reset).
 */

type Part = { id: string; label: string };

function useReading(
  root: RefObject<HTMLElement | null>,
  bodyId: string,
  minutes: number,
) {
  const [active, setActive] = useState(0);
  const [left, setLeft] = useState(minutes);

  useGSAP(
    () => {
      const node = root.current;
      const body = document.getElementById(bodyId);
      if (!node || !body) return;

      const write = (progress: number) => {
        node.style.setProperty("--read", progress.toFixed(4));
        node.toggleAttribute("data-done", progress >= 0.999);
        setLeft(Math.max(0, Math.ceil(minutes * (1 - progress) - 0.0001)));
      };

      ScrollTrigger.create({
        trigger: body,
        start: "top 60%",
        end: "bottom 70%",
        onUpdate: (self) => write(self.progress),
        onRefresh: (self) => write(self.progress),
      });

      const bars = Array.from(node.querySelectorAll<HTMLElement>("[data-part-bar]"));
      Array.from(body.querySelectorAll<HTMLElement>("[data-part]")).forEach((part, i) => {
        const bar = bars[i];
        const paint = (progress: number) => {
          if (bar) bar.style.transform = `scaleX(${progress.toFixed(4)})`;
        };
        ScrollTrigger.create({
          trigger: part,
          start: "top 60%",
          end: "bottom 60%",
          onUpdate: (self) => paint(self.progress),
          onRefresh: (self) => paint(self.progress),
          onToggle: (self) => {
            if (self.isActive) setActive(i);
          },
        });
      });
    },
    { dependencies: [bodyId, minutes], scope: root },
  );

  return { active, left };
}

/** The progress ring, with the minutes (or a finished mark) at its centre. */
function Ring({ left, size }: { left: number; size: "lg" | "sm" }) {
  return (
    <span className={cn("reading-ring relative block shrink-0", size === "lg" ? "h-14 w-14" : "h-9 w-9")}>
      <svg viewBox="0 0 40 40" aria-hidden="true" className="h-full w-full -rotate-90">
        <circle cx="20" cy="20" r="18" fill="none" strokeWidth="1.5" className="stroke-current opacity-20" />
        <circle
          cx="20"
          cy="20"
          r="18"
          fill="none"
          strokeWidth="1.5"
          strokeLinecap="round"
          pathLength={100}
          className="reading-ring-fill stroke-green"
        />
      </svg>
      <span
        aria-hidden="true"
        className="reading-ring-dot absolute inset-0 m-auto block h-2 w-2 bg-green"
      />
      <span
        key={left}
        aria-hidden="true"
        className={cn(
          "reading-count type-subhead absolute inset-0 flex items-center justify-center tabular-nums",
          size === "lg" ? "text-body-lg" : "text-caption",
        )}
      >
        {left > 0 ? left : ""}
      </span>
    </span>
  );
}

function statusText(left: number) {
  return left > 0 ? `${left} min left` : "Finished";
}

export function ReadingRail({
  bodyId,
  minutes,
  parts,
}: {
  bodyId: string;
  minutes: number;
  parts: Part[];
}) {
  const ref = useRef<HTMLElement>(null);
  const { active, left } = useReading(ref, bodyId, minutes);

  return (
    <nav ref={ref} aria-label="In this piece" className="sticky top-32 text-ink">
      <div className="flex items-center gap-4">
        <Ring left={left} size="lg" />
        <p className="type-eyebrow text-ink-muted">
          <span key={left} className="reading-count inline-block">
            {statusText(left)}
          </span>
        </p>
      </div>

      {parts.length > 1 && (
        <ol className="mt-10 border-t border-rule">
          {parts.map((part, i) => {
            const current = i === active;
            return (
              <li key={part.id}>
                <a
                  href={`#${part.id}`}
                  aria-current={current ? "true" : undefined}
                  className="group relative flex gap-4 py-4 pr-2"
                >
                  <span
                    className={cn(
                      "type-eyebrow shrink-0 pt-0.5 tabular-nums transition-colors duration-500 ease-brand",
                      current ? "text-green" : "text-ink-muted",
                    )}
                  >
                    {indexNumber(i)}
                  </span>
                  <span
                    className={cn(
                      "line-clamp-2 text-caption transition-colors duration-500 ease-brand group-hover:text-ink",
                      current ? "text-ink" : "text-ink-muted",
                    )}
                  >
                    {part.label}
                  </span>
                  <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-rule">
                    <span
                      data-part-bar
                      className="block h-full origin-left bg-green"
                      style={{ transform: "scaleX(0)" }}
                    />
                  </span>
                </a>
              </li>
            );
          })}
        </ol>
      )}
    </nav>
  );
}

export function ReadingBar({
  bodyId,
  minutes,
  parts,
}: {
  bodyId: string;
  minutes: number;
  parts: Part[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { active, left } = useReading(ref, bodyId, minutes);

  return (
    <div ref={ref} aria-hidden="true" className="reading-bar sticky bottom-4 z-20 mt-16 lg:hidden">
      <div className="flex items-center gap-3 rounded-sm bg-ink py-2.5 pr-4 pl-2.5 text-white">
        <Ring left={left} size="sm" />
        <span className="min-w-0 flex-1 truncate text-caption text-white/80">
          {parts[active]?.label}
        </span>
        <span key={left} className="reading-count type-eyebrow shrink-0 text-white/60">
          {statusText(left)}
        </span>
      </div>
    </div>
  );
}
