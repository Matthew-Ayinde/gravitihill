"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { Lockup } from "@/components/ui/Lockup";
import { Icon } from "@/components/icons";
import { GrainOverlay } from "@/components/motion/GrainOverlay";
import { EASE_BRAND } from "@/lib/motion";
import { markHeroReady, resetHeroReady } from "@/lib/hero-gate";
import type { IconName } from "@/lib/schemas";

/**
 * THE ARRIVAL — a home-route gate, not a route-agnostic loader.
 *
 * Plays on every entry into "/" — a hard load and a client-side navigation
 * back to home both count, because the brief asks for every visit, not a
 * once-per-session flag. A two-panel --ridge gate covers the viewport for a
 * fixed ~5s beat: the lockup and the positioning line settle in, the four
 * practices tick past as a loading manifest tracked by one accent progress
 * rule, then the panels part like doors onto the home page already painted
 * underneath.
 *
 * This is a deliberate, requested exception to two AGENTS.md rules: §0.1
 * (the mark is never animated) and §0.3 (exactly one signature moment). It
 * is scoped tightly — one first-paint beat, gone before the reader can
 * scroll — rather than a second interaction competing with the Sectors
 * panel.
 *
 * ── Why this lives in the root layout, not on the home page ────────────────
 * `PageFade` animates a wrapper carrying a `rotateX` transform. A `transform`
 * on an ancestor becomes the containing block for its `position: fixed`
 * descendants (CSS Transforms §"Establishing a new containing block"), so a
 * splash mounted inside Home would be positioned against that tilted wrapper,
 * not the viewport. Mounting as a *sibling* of `PageFade` avoids the bug
 * outright with no portal needed, and keeps the initial server-rendered HTML
 * already showing the closed gate, so there is no client-only flash.
 * (PageFade now clears its transform on completion, but the gate runs *while*
 * that transition is live, so the sibling placement still matters.)
 *
 * ── Reduced motion ───────────────────────────────────────────────────────
 * Skipped outright, matching how `PageFade` treats the same signal. A forced
 * 5s block with the transforms stripped out is still a forced 5s block; the
 * honest answer for that setting is not to run it.
 *
 * ── Keyboard / assistive tech ────────────────────────────────────────────
 * The header, main and footer landmarks are marked `inert` for the duration
 * — the gate already blocks them visually and by pointer, `inert` stops a
 * keyboard user tabbing into a link they can't see and a screen reader
 * narrating a page that isn't visibly there yet. The one live control is the
 * "Skip" button, auto-focused so keyboard users land somewhere useful
 * immediately; Escape does the same.
 *
 * ── Coordinating with the hero's typewriter ─────────────────────────────
 * The home hero's TypedHeadline mounts underneath this gate and would
 * otherwise type its whole line out unseen behind the doors. `markHeroReady`
 * (see `lib/hero-gate`) releases it at the moment the doors start moving —
 * on the timed exit, on Skip, and immediately when the gate doesn't run at
 * all (reduced motion, or not the home route).
 */

const MANIFEST: { icon: IconName; label: string }[] = [
  { icon: "brand-building", label: "Brand Development" },
  { icon: "strategy", label: "Business Advisory" },
  { icon: "executive-coaching", label: "Executive Coaching" },
  { icon: "market-expansion", label: "Market Expansion" },
];

const HOLD_MS = 4000; // logo, headline, manifest, progress rule fill
const DOOR_DELAY_MS = 250; // content clears before the gate moves
const DOOR_DURATION_MS = 650;
const SETTLE_MS = 100;
const TOTAL_MS = HOLD_MS + DOOR_DELAY_MS + DOOR_DURATION_MS + SETTLE_MS; // ~5s
// Slow on purpose: this is a manifest settling into view, not a ticker.
// It's fine if the hold ends before all four practices have had a turn.
const TICK_MS = 1500;

const LANDMARKS = ["header", "#main", "footer"] as const;

type Phase = "idle" | "hold" | "exit" | "done";

export function SplashScreen() {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const isHome = pathname === "/";

  const [phase, setPhase] = useState<Phase>(isHome && !reduced ? "hold" : "idle");
  const [tick, setTick] = useState(0);
  const timers = useRef<{ interval?: number; toExit?: number; toDone?: number }>({});
  const skipButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isHome || reduced) {
      setPhase("idle");
      markHeroReady(); // no gate running — let the hero type immediately
      return;
    }

    resetHeroReady(); // re-arm for a client-side navigation back to "/"
    setPhase("hold");
    setTick(0);

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    const landmarks = LANDMARKS.map((s) => document.querySelector(s)).filter(
      (el): el is HTMLElement => el !== null,
    );
    landmarks.forEach((el) => el.setAttribute("inert", ""));
    skipButtonRef.current?.focus();

    const unlock = () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      landmarks.forEach((el) => el.removeAttribute("inert"));
    };

    timers.current.interval = window.setInterval(() => {
      setTick((t) => t + 1);
    }, TICK_MS);

    timers.current.toExit = window.setTimeout(() => {
      setPhase("exit");
      markHeroReady(); // doors start moving — the headline can start typing
    }, HOLD_MS);
    timers.current.toDone = window.setTimeout(() => {
      setPhase("done");
      unlock();
    }, TOTAL_MS);

    return () => {
      window.clearInterval(timers.current.interval);
      window.clearTimeout(timers.current.toExit);
      window.clearTimeout(timers.current.toDone);
      unlock();
    };
  }, [isHome, reduced]);

  const skip = () => {
    window.clearInterval(timers.current.interval);
    window.clearTimeout(timers.current.toExit);
    window.clearTimeout(timers.current.toDone);
    setPhase("exit");
    markHeroReady();
    timers.current.toDone = window.setTimeout(() => {
      setPhase("done");
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      LANDMARKS.forEach((s) => document.querySelector(s)?.removeAttribute("inert"));
    }, DOOR_DURATION_MS + 60);
  };

  const active = MANIFEST[tick % MANIFEST.length];
  const opening = phase === "exit";
  const showing = phase === "hold" || phase === "exit";

  return (
    <SplashGate
      showing={showing}
      opening={opening}
      manifestKey={active.label}
      manifest={
        <>
          <Icon
            name={active.icon}
            className="h-5 w-5 text-accent"
            accentClassName="text-white/70"
          />
          <span className="type-eyebrow text-white/60">{active.label}</span>
        </>
      }
      onSkip={skip}
      skipRef={skipButtonRef}
    />
  );
}

/**
 * The gate's markup and every tween in it.
 *
 * Split out from the state machine above so that the hooks it needs can run
 * unconditionally: the parent returns null in two of its four phases, and a
 * useGSAP behind that early return would break the rules of hooks. This
 * component always mounts; `showing` decides whether it paints anything.
 */
function SplashGate({
  showing,
  opening,
  manifest,
  manifestKey,
  onSkip,
  skipRef,
}: {
  showing: boolean;
  opening: boolean;
  manifest: React.ReactNode;
  manifestKey: string;
  onSkip: () => void;
  skipRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const root = useRef<HTMLDivElement>(null);
  const manifestRef = useRef<HTMLDivElement>(null);

  // Entrance: mark, headline, progress rule. One timeline rather than three
  // tweens with hand-computed delays — the sequence is legible in the code in
  // the order it plays, and killing the timeline kills all of it at once if
  // the reader skips.
  useGSAP(
    () => {
      if (!showing || !root.current) return;

      const timeline = gsap.timeline();
      timeline
        .fromTo(
          "[data-splash-mark]",
          { opacity: 0, scale: 0.92 },
          { opacity: 1, scale: 1, duration: 0.5, ease: EASE_BRAND },
          0.1,
        )
        .fromTo(
          "[data-splash-line]",
          { yPercent: 110 },
          { yPercent: 0, duration: 0.6, ease: EASE_BRAND },
          0.35,
        )
        .fromTo(
          "[data-splash-progress]",
          { scaleX: 0 },
          { scaleX: 1, duration: HOLD_MS / 1000, ease: "none" },
          0,
        );

      return () => timeline.kill();
    },
    { dependencies: [showing], scope: root },
  );

  // The manifest swap — one entry replacing the last, every TICK_MS.
  useGSAP(
    () => {
      if (!showing || !manifestRef.current) return;
      gsap.fromTo(
        manifestRef.current,
        { opacity: 0, y: 6 },
        { opacity: 1, y: 0, duration: 0.28, ease: EASE_BRAND },
      );
    },
    { dependencies: [manifestKey, showing], scope: root },
  );

  // The exit: content clears, then the doors part.
  useGSAP(
    () => {
      if (!opening || !root.current) return;

      const timeline = gsap.timeline();
      timeline
        .to("[data-splash-content]", {
          opacity: 0,
          scale: 0.97,
          duration: 0.35,
          ease: EASE_BRAND,
        })
        .to(
          "[data-splash-door-left]",
          { xPercent: -100, duration: DOOR_DURATION_MS / 1000, ease: EASE_BRAND },
          DOOR_DELAY_MS / 1000,
        )
        .to(
          "[data-splash-door-right]",
          { xPercent: 100, duration: DOOR_DURATION_MS / 1000, ease: EASE_BRAND },
          DOOR_DELAY_MS / 1000,
        );

      return () => timeline.kill();
    },
    { dependencies: [opening], scope: root },
  );

  if (!showing) return null;

  return (
    <div ref={root} className="fixed inset-0 z-200" aria-label="Site introduction">
      {/* ── Decorative: doors, mark, copy, manifest, progress ─────────── */}
      <div aria-hidden="true">
        <div
          data-splash-door-left
          className="absolute inset-y-0 left-0 w-1/2 overflow-hidden bg-ridge"
        >
          <GrainOverlay className="opacity-[0.08]" />
        </div>

        <div
          data-splash-door-right
          className="absolute inset-y-0 right-0 w-1/2 overflow-hidden bg-ridge"
        >
          <GrainOverlay className="opacity-[0.08]" />
        </div>

        <div
          data-splash-content
          className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
        >
          <div data-splash-mark>
            <Lockup variant="white" width={140} href={null} />
          </div>

          <div className="line-mask mt-8 max-w-3xl">
            <p data-splash-line className="type-display w-xcond text-h1 text-white">
              Re-definers of <span className="accent-word-dark">Brand</span>{" "}
              Building
            </p>
          </div>

          {/* Manifest — the four practices ticking past like a loading readout */}
          <div className="mt-14 flex h-6 items-center gap-3">
            <div ref={manifestRef} className="flex items-center gap-3">
              {manifest}
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-px bg-rule-dark">
          <div
            data-splash-progress
            className="h-px origin-left bg-accent"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      </div>

      {/* ── Live: the one control a reader can act on ──────────────────── */}
      <button
        ref={skipRef}
        type="button"
        onClick={onSkip}
        onKeyDown={(e) => {
          if (e.key === "Escape") onSkip();
        }}
        aria-label="Skip introduction"
        className="group absolute bottom-6 right-6 inline-flex items-center gap-2.5 rounded-sm border border-rule-dark px-4 py-2.5 type-eyebrow text-white/60 outline-offset-4 transition-colors duration-200 hover:border-white/40 hover:bg-white/5 hover:text-white"
      >
        Skip
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="h-3 w-3 shrink-0 fill-current transition-transform duration-200 group-hover:translate-x-0.5"
        >
          <path d="M4 5v14l7-7-7-7Z" />
          <path d="M13 5v14l7-7-7-7Z" />
        </svg>
      </button>
    </div>
  );
}
