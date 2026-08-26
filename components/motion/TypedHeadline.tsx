"use client";

import { useReducedMotion } from "framer-motion";
import { Fragment, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";
import {
  getHeroReadyServerSnapshot,
  getHeroReadySnapshot,
  subscribeHeroReady,
} from "@/lib/hero-gate";

/**
 * Typewriter reveal for the home headline.
 *
 * ── Why this exists, and what it costs ──────────────────────────────────────
 * Requested explicitly. Worth recording that the brief's §0.2 bans typewriter
 * effects and §7 asks that nothing delay the hero paint, because this does
 * trade LCP for the effect. Everything below is about making that trade as
 * cheap as it can be.
 *
 * ── How it stays smooth ─────────────────────────────────────────────────────
 * 1. Untyped characters are NOT removed from the DOM — they sit at opacity 0.
 *    The line box is therefore always the full final string, so line wrapping
 *    is identical on every frame. Nothing reflows, the last word never hops to
 *    the next line as it grows, and CLS is exactly zero. Appending characters
 *    to a growing string, the obvious implementation, fails all three.
 * 2. The caret is a zero-width inline element, so inserting it between the
 *    typed and untyped runs cannot create a break opportunity or nudge metrics.
 * 3. Cadence comes from a schedule of absolute timestamps computed once, then
 *    read by a rAF loop. That makes the animation frame-rate independent — it
 *    runs identically on 60Hz and 120Hz — and lets punctuation hold naturally.
 *    A setTimeout-per-character chain drifts and stutters under load.
 * 4. React state updates only when the character count actually changes:
 *    ~46 renders for the whole line, not one per frame.
 *
 * ── Accessibility and SEO ───────────────────────────────────────────────────
 * The complete headline is in the server HTML from the first byte. Assistive
 * technology reads the real <h1> text once, from a visually-hidden copy, rather
 * than hearing characters trickle in. Crawlers get the same. The animated layer
 * is aria-hidden.
 *
 * Reduced motion and no-JS both resolve to the finished headline through CSS
 * alone — see the .type-pending rules in globals.css and the <noscript> below.
 *
 * ── Timing against the splash ────────────────────────────────────────────
 * This mounts under SplashScreen's doors on every home load, so the schedule
 * doesn't start on mount — it waits for the gate in `lib/hero-gate` to open,
 * which SplashScreen flips the moment the doors start parting (or right away
 * if there's no gate to wait for). Otherwise the whole line would type out
 * hidden behind the doors and appear already finished when they open.
 */

export type Segment = { text: string; className?: string };

/** Milliseconds per character before jitter. */
const BASE = 27;
/** A beat before the first character, so the page settles first. */
const START_DELAY = 240;

/** Deterministic jitter — no Math.random, so nothing differs between renders. */
function jitter(i: number): number {
  const n = Math.sin(i * 12.9898) * 43758.5453;
  return 0.84 + 0.32 * (n - Math.floor(n));
}

function delayFor(ch: string, i: number): number {
  let d = BASE;
  if (ch === " ") d = BASE * 1.55; // typists pause between words
  else if (ch === "-") d = BASE * 1.7;
  else if (ch === "," ) d = BASE * 4;
  else if (ch === ".") d = BASE * 6; // land on the full stop
  return d * jitter(i);
}

export function TypedHeadline({
  segments,
  className,
}: {
  segments: Segment[];
  className?: string;
}) {
  const reduced = useReducedMotion();
  // Gated on the splash: without this the schedule below would start the
  // instant this component mounts, which is while SplashScreen's doors
  // still cover the whole viewport — the line would finish typing unseen
  // and appear whole the moment the doors part. See `lib/hero-gate`.
  const heroReady = useSyncExternalStore(
    subscribeHeroReady,
    getHeroReadySnapshot,
    getHeroReadyServerSnapshot,
  );
  const full = useMemo(() => segments.map((s) => s.text).join(""), [segments]);
  const total = full.length;

  // Server and first paint render nothing typed; CSS handles the reduced-motion
  // and no-JS cases, so starting empty costs those readers nothing.
  const [typed, setTyped] = useState(0);
  const done = typed >= total;

  const schedule = useMemo(() => {
    const times: number[] = [];
    let t = START_DELAY;
    for (let i = 0; i < total; i++) {
      t += delayFor(full[i], i);
      times.push(t);
    }
    return times;
  }, [full, total]);

  useEffect(() => {
    if (reduced) {
      setTyped(total);
      return;
    }

    // Hold at 0 until the splash gate opens (or reports there's no gate to
    // wait for). `heroReady` flipping true re-runs this effect, and `start`
    // is stamped from that frame, so the first character lands right as the
    // doors start moving rather than at some arbitrary point mid-hold.
    if (!heroReady) return;

    let raf = 0;
    let start = 0;
    let index = 0;

    const step = (now: number) => {
      start ||= now;
      const elapsed = now - start;

      let next = index;
      while (next < total && schedule[next] <= elapsed) next++;

      if (next !== index) {
        index = next;
        setTyped(index);
      }

      if (index < total) raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [reduced, schedule, total, heroReady]);

  // Walk the segments, splitting each at the cursor.
  let offset = 0;

  return (
    <h1 className={className}>
      {/* The real headline: one clean string for screen readers and crawlers. */}
      <span className="sr-only">{full}</span>

      <span aria-hidden="true">
        {segments.map((seg, i) => {
          const start = offset;
          offset += seg.text.length;
          const shown = Math.min(Math.max(typed - start, 0), seg.text.length);
          const caretHere = typed >= start && typed < offset;

          return (
            <Fragment key={i}>
              <span className={seg.className}>{seg.text.slice(0, shown)}</span>
              {caretHere && <Caret state="typing" />}
              <span className={cn(seg.className, "type-pending")}>
                {seg.text.slice(shown)}
              </span>
            </Fragment>
          );
        })}
        {/* On completion the caret fades out and stays gone. */}
        {done && <Caret state="exit" />}
      </span>

      <noscript>
        <style>{`.type-pending{opacity:1}.typing-caret{display:none}`}</style>
      </noscript>
    </h1>
  );
}

function Caret({ state }: { state: "typing" | "exit" }) {
  return <span className="typing-caret" data-state={state} aria-hidden="true" />;
}
