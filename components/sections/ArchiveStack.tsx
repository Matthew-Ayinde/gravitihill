"use client";

import { useRef, useState, type CSSProperties, type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { EASE_3D, EASE_BRAND, TOGGLE_ONCE } from "@/lib/motion";
import { cn, indexNumber } from "@/lib/utils";

/**
 * The /insights archive: a filter and a stack of files.
 *
 * ── The stack (desktop) ──────────────────────────────────────────────────
 * Each file is `position: sticky`, offset a little lower than the one before
 * (see .file in globals.css), so as the reader scrolls each new file slides
 * up over the last and leaves that file's top edge showing — a drawer of
 * pieces rather than a list. As a file is covered it recedes: scales back and
 * takes on shade, scrubbed to the scrollbar.
 *
 * ScrollTrigger never measures a sticky element. A stuck element reports its
 * stuck position, so any refresh taken mid-stack would mis-place every
 * trigger built on one. Positions are instead derived from the list — which
 * is never sticky — plus each file's natural offset inside it.
 *
 * ── The filter ───────────────────────────────────────────────────────────
 * One ink marker travels between filters. Choosing one files the current set
 * away (a quick drop), swaps the list, and the new set rises in with a wipe.
 * The marker moves the instant a filter is pressed; the list follows once
 * the old set has cleared, so the two never share the screen.
 *
 * ── Tiers ────────────────────────────────────────────────────────────────
 *   ≥1024px, motion allowed   stack + recede + cursor lean + wipes
 *   <1024px, motion allowed   plain list, wipes on enter and on filter
 *   reduced motion            plain list; filtering swaps instantly
 */

export type ArchiveEntry = { id: string; category: string; file: ReactNode };

const ALL = "all";
const REDUCED = "(prefers-reduced-motion: reduce)";

export function ArchiveStack({
  heading,
  entries,
}: {
  /** Server-rendered section heading, set on the filter's row. */
  heading: ReactNode;
  entries: ArchiveEntry[];
}) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const marker = useRef<HTMLSpanElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const exit = useRef<ReturnType<typeof gsap.timeline> | null>(null);
  const markerPlaced = useRef(false);
  const listBuilt = useRef(false);

  // `chosen` drives the marker and moves immediately; `shown` drives the list
  // and moves once the outgoing files have cleared.
  const [chosen, setChosen] = useState(ALL);
  const [shown, setShown] = useState(ALL);

  const categories = Array.from(new Set(entries.map((entry) => entry.category))).sort();
  const filters = [
    { key: ALL, label: "All", count: entries.length },
    ...categories.map((category) => ({
      key: category,
      label: category,
      count: entries.filter((entry) => entry.category === category).length,
    })),
  ];
  const visible = shown === ALL ? entries : entries.filter((entry) => entry.category === shown);

  // ── The marker ─────────────────────────────────────────────────────────
  useGSAP(
    () => {
      const container = track.current;
      const block = marker.current;
      if (!container || !block) return;

      const place = (animate: boolean) => {
        const chip = container.querySelector<HTMLElement>(`[data-chip="${CSS.escape(chosen)}"]`);
        if (!chip) return;
        const to = {
          x: chip.offsetLeft,
          y: chip.offsetTop,
          width: chip.offsetWidth,
          height: chip.offsetHeight,
        };
        if (animate && !window.matchMedia(REDUCED).matches) {
          gsap.to(block, { ...to, duration: 0.6, ease: EASE_3D, overwrite: true });
          // On a phone the filters scroll sideways; bring the chosen one in.
          container.parentElement?.scrollTo({ left: chip.offsetLeft - 16, behavior: "smooth" });
        } else {
          gsap.set(block, to);
        }
        container.dataset.ready = "";
      };

      place(markerPlaced.current);
      markerPlaced.current = true;

      // Webfont swaps and viewport changes resize the chips under the marker.
      // A ResizeObserver reports once on observe; that first report is the
      // placement just made, so it is skipped rather than snapping a tween.
      let first = true;
      const observer = new ResizeObserver(() => {
        if (first) {
          first = false;
          return;
        }
        place(false);
      });
      observer.observe(container);
      return () => observer.disconnect();
    },
    { dependencies: [chosen], scope: root },
  );

  // ── Choosing a filter ──────────────────────────────────────────────────
  const { contextSafe } = useGSAP({ scope: root });

  const choose = contextSafe((key: string) => {
    if (key === chosen) return;
    setChosen(key);
    exit.current?.kill();

    const files = gsap.utils.toArray<HTMLElement>("[data-file]", list.current);

    if (window.matchMedia(REDUCED).matches || files.length === 0) {
      setShown(key);
      return;
    }

    // Straight back to the set already on screen, mid-exit: settle it.
    if (key === shown) {
      gsap.to(files, { opacity: 1, y: 0, duration: 0.4, ease: EASE_BRAND, overwrite: true });
      return;
    }

    exit.current = gsap.timeline({ onComplete: () => setShown(key) }).to(files, {
      opacity: 0,
      y: 40,
      duration: 0.32,
      stagger: 0.04,
      ease: "power2.in",
    });
  });

  // ── The list: arrival, stack, recede, lean ─────────────────────────────
  // Rebuilt from scratch whenever the visible set changes (revertOnUpdate),
  // so no trigger ever outlives the file it was measuring.
  useGSAP(
    () => {
      const container = list.current;
      if (!container) return;
      const files = gsap.utils.toArray<HTMLElement>("[data-file]", container);
      if (files.length === 0) return;

      // Each file's top inside the list as if nothing were sticky: the sum of
      // the heights and gaps above it. Called from trigger functions, so it
      // is re-read on every refresh.
      const naturalTop = (index: number) => {
        let top = 0;
        for (let i = 0; i < index; i++) {
          top += files[i].offsetHeight + parseFloat(getComputedStyle(files[i + 1]).marginTop);
        }
        return top;
      };

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        files.forEach((file, i) => {
          gsap.fromTo(
            file,
            { opacity: 1, y: 72, clipPath: "inset(0% 0% 100% 0% round 4px)" },
            {
              y: 0,
              clipPath: "inset(0% 0% 0% 0% round 4px)",
              duration: 1,
              ease: EASE_3D,
              delay: Math.min(i, 2) * 0.06,
              overwrite: true,
              clearProps: "clipPath,transform",
              scrollTrigger: {
                trigger: container,
                start: () => `top+=${naturalTop(i)} 88%`,
                toggleActions: TOGGLE_ONCE,
                invalidateOnRefresh: true,
              },
            },
          );
        });
      });

      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const detach: Array<() => void> = [];

        files.forEach((file, i) => {
          const next = files[i + 1];
          const body = file.querySelector<HTMLElement>("[data-file-body]");
          const dim = file.querySelector<HTMLElement>("[data-file-dim]");

          // Recede while the next file travels from the bottom of the
          // viewport to its own sticky line.
          if (next && body && dim) {
            gsap
              .timeline({
                scrollTrigger: {
                  trigger: container,
                  start: () => `top+=${naturalTop(i + 1)} bottom`,
                  end: () => `top+=${naturalTop(i + 1)} ${parseFloat(getComputedStyle(next).top) || 0}px`,
                  scrub: true,
                  invalidateOnRefresh: true,
                },
              })
              .fromTo(body, { scale: 1 }, { scale: 0.92, transformOrigin: "50% 0%", ease: "none" }, 0)
              .fromTo(dim, { opacity: 0 }, { opacity: 0.16, ease: "none" }, 0);
          }

          // The photograph leans away from the cursor inside its frame. The
          // layer is scaled 108%, which is what ±3% spends.
          const pan = file.querySelector<HTMLElement>("[data-pan]");
          if (!pan) return;
          const toX = gsap.quickTo(pan, "xPercent", { duration: 1, ease: "power3" });
          const toY = gsap.quickTo(pan, "yPercent", { duration: 1, ease: "power3" });
          const onMove = (event: PointerEvent) => {
            if (event.pointerType !== "mouse") return;
            const rect = file.getBoundingClientRect();
            toX(((event.clientX - rect.left) / rect.width - 0.5) * -6);
            toY(((event.clientY - rect.top) / rect.height - 0.5) * -6);
          };
          const onLeave = () => {
            toX(0);
            toY(0);
          };
          file.addEventListener("pointermove", onMove);
          file.addEventListener("pointerleave", onLeave);
          detach.push(() => {
            file.removeEventListener("pointermove", onMove);
            file.removeEventListener("pointerleave", onLeave);
          });
        });

        return () => detach.forEach((fn) => fn());
      });

      // The page just changed height. Every trigger below the archive (and
      // Lenis's limit) needs to know; the first build is covered by
      // MotionRoot's route refresh.
      let frame = 0;
      if (listBuilt.current) frame = requestAnimationFrame(() => ScrollTrigger.refresh());
      listBuilt.current = true;

      return () => {
        cancelAnimationFrame(frame);
        mm.revert();
      };
    },
    { dependencies: [shown], scope: root, revertOnUpdate: true },
  );

  const shownLabel = filters.find((filter) => filter.key === shown)?.label;

  return (
    <div ref={root}>
      <div className="flex flex-col gap-y-10 lg:flex-row lg:items-end lg:justify-between lg:gap-x-12">
        {heading}
        <div className="chip-rail -mx-gutter overflow-x-auto px-gutter lg:mx-0 lg:overflow-visible lg:px-0">
          <div
            ref={track}
            role="group"
            aria-label="Filter the archive by subject"
            className="group relative inline-flex gap-1 rounded-sm p-1 ring-1 ring-rule"
          >
            <span
              ref={marker}
              aria-hidden="true"
              className="absolute top-0 left-0 rounded-xs bg-ink opacity-0 group-data-ready:opacity-100"
            />
            {filters.map((filter) => {
              const on = filter.key === chosen;
              return (
                <button
                  key={filter.key}
                  type="button"
                  data-chip={filter.key}
                  aria-pressed={on}
                  onClick={() => choose(filter.key)}
                  className={cn(
                    "type-eyebrow relative z-10 flex shrink-0 items-baseline gap-2 whitespace-nowrap rounded-xs px-4 py-3 transition-colors duration-300 ease-brand",
                    on
                      ? "bg-ink text-white group-data-ready:bg-transparent"
                      : "text-ink-muted hover:text-ink",
                  )}
                >
                  {filter.label}
                  <span className={cn("tabular-nums", on ? "text-white/55" : "text-ink-muted/70")}>
                    {indexNumber(filter.count - 1)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <ul ref={list} className="mt-10 lg:mt-16">
        {visible.map((entry, i) => (
          <li key={entry.id} data-file className="file" style={{ "--i": i } as CSSProperties}>
            {entry.file}
          </li>
        ))}
      </ul>

      <p className="sr-only" aria-live="polite">
        {visible.length} {visible.length === 1 ? "piece" : "pieces"}
        {shown === ALL ? " in the archive" : ` filed under ${shownLabel}`}.
      </p>
    </div>
  );
}
