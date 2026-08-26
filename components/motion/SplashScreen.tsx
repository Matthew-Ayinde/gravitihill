"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { Lockup } from "@/components/ui/Lockup";
import { Icon } from "@/components/icons";
import { GrainOverlay } from "@/components/motion/GrainOverlay";
import { EASE_BRAND } from "@/lib/motion";
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
 * `PageFade` wraps its children in a `m.div` carrying a `rotateX` transform.
 * A `transform` on an ancestor becomes the containing block for its
 * `position: fixed` descendants (CSS Transforms §"Establishing a new
 * containing block"), so a splash mounted inside Home would be positioned
 * against that tilted wrapper, not the viewport. Mounting as a *sibling* of
 * `PageFade` — still inside `MotionRoot` for the `m.*` feature context —
 * avoids the bug outright with no portal needed, and keeps the initial
 * server-rendered HTML already showing the closed gate, so there is no
 * client-only flash.
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
      return;
    }

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

    timers.current.toExit = window.setTimeout(() => setPhase("exit"), HOLD_MS);
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
    timers.current.toDone = window.setTimeout(() => {
      setPhase("done");
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      LANDMARKS.forEach((s) => document.querySelector(s)?.removeAttribute("inert"));
    }, DOOR_DURATION_MS + 60);
  };

  if (phase === "idle" || phase === "done") return null;

  const active = MANIFEST[tick % MANIFEST.length];
  const opening = phase === "exit";

  return (
    <div className="fixed inset-0 z-200" aria-label="Site introduction">
      {/* ── Decorative: doors, mark, copy, manifest, progress ─────────── */}
      <div aria-hidden="true">
        <m.div
          className="absolute inset-y-0 left-0 w-1/2 overflow-hidden bg-ridge"
          animate={{ x: opening ? "-100%" : "0%" }}
          transition={{
            duration: DOOR_DURATION_MS / 1000,
            delay: opening ? DOOR_DELAY_MS / 1000 : 0,
            ease: EASE_BRAND,
          }}
        >
          <GrainOverlay className="opacity-[0.08]" />
          <div className="absolute inset-y-0 right-0 w-px bg-rule-dark" />
        </m.div>

        <m.div
          className="absolute inset-y-0 right-0 w-1/2 overflow-hidden bg-ridge"
          animate={{ x: opening ? "100%" : "0%" }}
          transition={{
            duration: DOOR_DURATION_MS / 1000,
            delay: opening ? DOOR_DELAY_MS / 1000 : 0,
            ease: EASE_BRAND,
          }}
        >
          <GrainOverlay className="opacity-[0.08]" />
        </m.div>

        <m.div
          className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
          animate={{ opacity: opening ? 0 : 1, scale: opening ? 0.97 : 1 }}
          transition={{ duration: 0.35, ease: EASE_BRAND }}
        >
          <m.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: EASE_BRAND, delay: 0.1 }}
          >
            <Lockup variant="white" width={140} href={null} />
          </m.div>

          <div className="line-mask mt-8 max-w-3xl">
            <m.p
              className="type-display w-xcond text-h1 text-white"
              initial={{ y: "110%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 0.6, ease: EASE_BRAND, delay: 0.35 }}
            >
              Re-definers of <span className="accent-word-dark">Brand</span>{" "}
              Building
            </m.p>
          </div>

          {/* Manifest — the four practices ticking past like a loading readout */}
          <div className="mt-14 flex h-6 items-center gap-3">
            <AnimatePresence mode="wait">
              <m.div
                key={active.label}
                className="flex items-center gap-3"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.28, ease: EASE_BRAND }}
              >
                <Icon
                  name={active.icon}
                  className="h-5 w-5 text-accent"
                  accentClassName="text-white/70"
                />
                <span className="type-eyebrow text-white/60">
                  {active.label}
                </span>
              </m.div>
            </AnimatePresence>
          </div>
        </m.div>

        <div className="absolute inset-x-0 bottom-0 h-px bg-rule-dark">
          <m.div
            className="h-px origin-left bg-accent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: HOLD_MS / 1000, ease: "linear" }}
          />
        </div>
      </div>

      {/* ── Live: the one control a reader can act on ──────────────────── */}
      <button
        ref={skipButtonRef}
        type="button"
        onClick={skip}
        onKeyDown={(e) => {
          if (e.key === "Escape") skip();
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
