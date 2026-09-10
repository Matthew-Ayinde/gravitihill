"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { EASE_BRAND, SCROLL_START, TOGGLE_ONCE } from "@/lib/motion";
import { useInView } from "@/lib/use-in-view";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn, indexNumber } from "@/lib/utils";

export type DnaSlide = {
  key: string;
  name: string;
  summary: string;
  detail: string;
  icon: ReactNode;
};

/** Seconds each commitment holds the stage before the next one takes it. */
const DWELL = 8;

/**
 * The four commitments, one at a time.
 *
 * Four quarter-width columns made every commitment small and none of them
 * important. Here one commitment owns the stage at display scale, and the
 * other three wait in an index beside the heading — so the section reads as
 * an argument being made point by point rather than a grid to be skimmed.
 *
 * ── Rotation ─────────────────────────────────────────────────────────────
 * The active tab's rule fills over DWELL seconds and that tween *is* the
 * timer: when it completes, the next commitment comes in. Pausing is a
 * tween.pause(), so the rule freezes exactly where rotation stopped and the
 * reader can see that it has. Rotation holds while:
 *   · a mouse is over the section (someone is reading)
 *   · keyboard focus is inside it (WAI-ARIA carousel pattern)
 *   · the section is out of view
 *   · the reader has pressed Pause (WCAG 2.2.2)
 * Under reduced motion it never starts, and the tabs switch instantly.
 *
 * ── No layout shift ──────────────────────────────────────────────────────
 * All four panels are stacked in one grid cell, so the stage is always as
 * tall as the longest commitment and swapping never moves the page. Inactive
 * panels are `invisible` + `inert`: out of the accessibility tree and tab
 * order, but still in the served HTML for crawlers.
 */
export function DnaCarousel({
  heading,
  items,
}: {
  heading: ReactNode;
  items: DnaSlide[];
}) {
  const uid = useId();
  const reduced = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const timer = useRef<ReturnType<typeof gsap.fromTo> | null>(null);
  const exit = useRef<ReturnType<typeof gsap.timeline> | null>(null);
  // Where rotation is heading, which runs ahead of `active` for the length
  // of an exit — so two quick arrow presses move two places, not one.
  const pending = useRef(0);
  // False until the reader or the timer has moved the carousel once.
  const moved = useRef(false);

  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const inView = useInView(root, { margin: "-15%" });

  const total = items.length;
  const running = playing && !reduced && !hovered && !focused && inView;

  // ── Entrance of the active commitment ────────────────────────────────
  // The first one arrives with the section on scroll; every later one plays
  // the moment it becomes active.
  const { contextSafe } = useGSAP(
    () => {
      const panel = panelAt(root.current, active);
      if (reduced || !panel) return;

      const timeline = gsap.timeline(
        !moved.current
          ? {
              scrollTrigger: {
                trigger: panel,
                start: SCROLL_START,
                toggleActions: TOGGLE_ONCE,
              },
            }
          : {},
      );

      timeline
        .fromTo(
          panel.querySelectorAll("[data-dna-line]"),
          { yPercent: 110 },
          { yPercent: 0, duration: 0.8, stagger: 0.07, ease: EASE_BRAND },
          0,
        )
        .fromTo(
          panel.querySelector("[data-dna-rule]"),
          { scaleX: 0, transformOrigin: "left center" },
          { scaleX: 1, duration: 0.9, ease: EASE_BRAND },
          0.15,
        )
        .fromTo(
          panel.querySelectorAll("[data-dna-fade]"),
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.07, ease: EASE_BRAND },
          0.25,
        );
    },
    { dependencies: [active, reduced], scope: root },
  );

  // ── Moving to another commitment ─────────────────────────────────────
  // The outgoing lines lift out of their masks before the incoming ones rise
  // in, so the two never share the stage.
  const go = contextSafe((next: number) => {
    const target = (next + total) % total;
    const panel = panelAt(root.current, active);

    timer.current?.pause();
    exit.current?.kill();
    pending.current = target;
    moved.current = true;

    if (reduced || !panel) {
      setActive(target);
      return;
    }

    const lines = panel.querySelectorAll("[data-dna-line]");
    const fades = panel.querySelectorAll("[data-dna-fade]");
    const rule = panel.querySelector("[data-dna-rule]");

    // Back to the commitment already on stage, possibly mid-exit: settle it
    // where it was and carry on.
    if (target === active) {
      gsap.to(lines, { yPercent: 0, duration: 0.4, ease: EASE_BRAND });
      gsap.to(fades, { opacity: 1, y: 0, duration: 0.4, ease: EASE_BRAND });
      gsap.to(rule, { scaleX: 1, duration: 0.4, ease: EASE_BRAND });
      if (running) timer.current?.resume();
      return;
    }

    exit.current = gsap
      .timeline({ onComplete: () => setActive(target) })
      .to(lines, { yPercent: -110, duration: 0.4, stagger: 0.04, ease: "power2.in" }, 0)
      .to(fades, { opacity: 0, duration: 0.3, ease: "power1.in" }, 0)
      .to(rule, { scaleX: 0, transformOrigin: "right center", duration: 0.4, ease: "power2.in" }, 0);
  });

  // ── The timer ────────────────────────────────────────────────────────
  useGSAP(
    () => {
      const fills = gsap.utils.toArray<HTMLElement>("[data-dna-progress]", root.current);
      const fill = fills[active];
      gsap.set(fills, { scaleX: 0 });
      if (!fill) return;

      if (reduced) {
        gsap.set(fill, { scaleX: 1 });
        return;
      }

      timer.current?.kill();
      timer.current = gsap.fromTo(
        fill,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: DWELL,
          ease: "none",
          paused: true,
          onComplete: () => go(active + 1),
        },
      );
    },
    { dependencies: [active, reduced], scope: root },
  );

  useEffect(() => {
    const tween = timer.current;
    if (!tween) return;
    if (running) tween.resume();
    else tween.pause();
  }, [running, active, reduced]);

  // ── Input ────────────────────────────────────────────────────────────
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const from = pending.current;
    const moves: Record<string, number> = {
      ArrowRight: from + 1,
      ArrowDown: from + 1,
      ArrowLeft: from - 1,
      ArrowUp: from - 1,
      Home: 0,
      End: total - 1,
    };
    if (!(event.key in moves)) return;

    event.preventDefault();
    const target = (moves[event.key] + total) % total;
    go(target);
    tabs.current[target]?.focus();
  };

  // Only keyboard focus holds rotation. A mouse click also focuses the tab,
  // and pausing on that would leave the carousel stopped long after the
  // pointer has gone.
  const onFocus = (event: FocusEvent<HTMLDivElement>) => {
    if (event.target.matches(":focus-visible")) setFocused(true);
  };
  const onBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
  };
  const onPointer = (event: PointerEvent<HTMLDivElement>, over: boolean) => {
    if (event.pointerType === "mouse") setHovered(over);
  };

  return (
    <div
      ref={root}
      onFocus={onFocus}
      onBlur={onBlur}
      onPointerEnter={(event) => onPointer(event, true)}
      onPointerLeave={(event) => onPointer(event, false)}
      className="grid-12 items-start gap-y-14"
    >
      <div className="col-span-12 lg:col-span-5">
        {heading}

        <div
          role="tablist"
          aria-label="Brand DNA"
          onKeyDown={onKeyDown}
          className="mt-12 grid grid-cols-4 gap-x-3 lg:mt-20 lg:max-w-md lg:grid-cols-1 lg:border-b lg:border-rule"
        >
          {items.map((item, i) => {
            const current = i === active;
            return (
              <button
                key={item.key}
                ref={(node) => {
                  tabs.current[i] = node;
                }}
                type="button"
                role="tab"
                id={`${uid}-tab-${i}`}
                aria-selected={current}
                aria-controls={`${uid}-panel-${i}`}
                tabIndex={current ? 0 : -1}
                onClick={() => go(i)}
                className={cn(
                  "relative flex items-baseline gap-5 pt-5 pb-4 text-left transition-colors duration-300 ease-brand lg:py-5",
                  current ? "text-ink-display" : "text-ink-muted hover:text-ink",
                )}
              >
                <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-rule" />
                {/* --green rather than --accent: this rule is the only
                    visible sign that rotation is running, and --accent on a
                    light wall falls short of the 3:1 a state indicator needs. */}
                <span
                  aria-hidden="true"
                  data-dna-progress
                  className="absolute inset-x-0 top-0 h-0.5 origin-left bg-green"
                  style={{ transform: "scaleX(0)" }}
                />
                <span className="type-eyebrow tabular-nums">{indexNumber(i)}</span>
                <span className="type-subhead sr-only text-h3 lg:not-sr-only">
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex items-center justify-between lg:max-w-md">
          <p aria-hidden="true" className="type-eyebrow tabular-nums text-ink-muted">
            <span className="text-ink-display">{indexNumber(active)}</span>
            <span className="mx-2">/</span>
            {indexNumber(total - 1)}
          </p>

          {!reduced && (
            <button
              type="button"
              onClick={() => setPlaying((value) => !value)}
              className="type-eyebrow flex items-center gap-2.5 py-2 text-ink-muted transition-colors duration-300 ease-brand hover:text-ink"
            >
              <svg aria-hidden="true" viewBox="0 0 12 12" fill="currentColor" className="h-2.5 w-2.5">
                {playing ? (
                  <>
                    <rect x="2" y="1" width="3" height="10" />
                    <rect x="7" y="1" width="3" height="10" />
                  </>
                ) : (
                  <path d="M2.5 1 11 6l-8.5 5V1Z" />
                )}
              </svg>
              {playing ? "Pause" : "Play"}
              <span className="sr-only"> rotation</span>
            </button>
          )}
        </div>
      </div>

      <div
        aria-live={running ? "off" : "polite"}
        className="col-span-12 grid lg:col-span-6 lg:col-start-7"
      >
        {items.map((item, i) => {
          const current = i === active;
          return (
            <div
              key={item.key}
              id={`${uid}-panel-${i}`}
              role="tabpanel"
              aria-labelledby={`${uid}-tab-${i}`}
              data-dna-panel={i}
              inert={!current}
              className={cn("col-start-1 row-start-1", !current && "invisible")}
            >
              <div className="flex items-start justify-between gap-8">
                <span className="line-mask">
                  <span
                    data-dna-line
                    data-motion
                    className="type-display block text-numeral leading-none tabular-nums text-green"
                  >
                    {indexNumber(i)}
                  </span>
                </span>
                <span data-dna-fade data-motion className="mt-2 shrink-0">
                  {item.icon}
                </span>
              </div>

              <h3 className="type-display mt-8 text-h1 text-ink-display">
                <span className="line-mask">
                  <span data-dna-line data-motion className="block">
                    {item.name}
                  </span>
                </span>
              </h3>

              <p className="line-mask mt-6">
                <span data-dna-line data-motion className="type-eyebrow block text-green">
                  {item.summary}
                </span>
              </p>

              <span
                aria-hidden="true"
                data-dna-rule
                data-motion
                className="mt-10 block h-px bg-rule"
              />

              <p data-dna-fade data-motion className="measure-tight mt-8 text-body-lg text-ink">
                {item.detail}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function panelAt(root: HTMLElement | null, index: number) {
  return root?.querySelector<HTMLElement>(`[data-dna-panel="${index}"]`) ?? null;
}
