"use client";

/**
 * TEMPORARY — construction screen shown in place of the whole public site
 * until launch. Wired in from app/layout.tsx; the real site is commented out
 * there, not deleted. To go live: restore the commented block in
 * app/layout.tsx and remove the <ComingSoon /> return.
 */

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Lockup } from "@/components/ui/Lockup";
import { EMAIL, PHONES } from "@/lib/site";
import s from "./ComingSoon.module.css";

/** Monday 16 November 2026, 18:00 Lagos time (WAT, UTC+1). */
const LAUNCH_AT = new Date("2026-11-16T18:00:00+01:00").getTime();

const ROTATING = ["assured.", "deliberate.", "future-forward.", "worth the wait."];

const TICKER = [
  "Brand Development",
  "Business Advisory",
  "Executive Coaching",
  "Market Expansion",
  "Consumer",
  "B2B",
  "Technology",
  "Victoria Island, Lagos",
  "Est. 2022",
];

const WHATSAPP = `https://wa.me/${PHONES[0].e164.replace("+", "")}?text=${encodeURIComponent(
  "Hello Graviti Hill, I'd like to start a conversation.",
)}`;

type Remaining = { d: number; h: number; m: number; s: number; done: boolean };

function remaining(now: number): Remaining {
  const diff = Math.max(0, LAUNCH_AT - now);
  const total = Math.floor(diff / 1000);
  return {
    d: Math.floor(total / 86400),
    h: Math.floor((total % 86400) / 3600),
    m: Math.floor((total % 3600) / 60),
    s: total % 60,
    done: diff === 0,
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

/** One slot-machine digit: a 0–9 strip translated behind a 1em mask. */
function Digit({ value }: { value: number }) {
  return (
    <span className={s.digit} aria-hidden>
      <span className={s.strip} style={{ transform: `translateY(-${value}em)` }}>
        {Array.from({ length: 10 }, (_, i) => (
          <span key={i}>{i}</span>
        ))}
      </span>
    </span>
  );
}

function Unit({
  value,
  label,
  of,
  seconds = false,
}: {
  value: number;
  label: string;
  of: number;
  seconds?: boolean;
}) {
  const str = pad(value);
  return (
    <div className={`${s.unit} ${seconds ? s.unitSeconds : ""}`}>
      <div className={s.digits}>
        {str.split("").map((ch, i) => (
          <Digit key={`${str.length}-${i}`} value={Number(ch)} />
        ))}
      </div>
      <div className={s.unitBar} aria-hidden>
        <span
          className={s.unitBarFill}
          style={{ transform: `scaleX(${Math.min(1, value / of)})` }}
        />
      </div>
      <div className={`type-eyebrow ${s.unitLabel}`}>
        <span>{label}</span>
        <span aria-hidden>{str}</span>
      </div>
    </div>
  );
}

export function ComingSoon() {
  const rootRef = useRef<HTMLDivElement>(null);
  const readoutRef = useRef<HTMLSpanElement>(null);
  const [now, setNow] = useState<number | null>(null);
  const [{ word, prevWord }, setRot] = useState<{ word: number; prevWord: number | null }>({
    word: 0,
    prevWord: null,
  });

  // Countdown tick.
  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  // Rotating headline word, starting once the headline has risen.
  useEffect(() => {
    let interval: number | undefined;
    const start = window.setTimeout(() => {
      interval = window.setInterval(() => {
        setRot(({ word: w }) => ({ word: (w + 1) % ROTATING.length, prevWord: w }));
      }, 2800);
    }, 3400);
    return () => {
      window.clearTimeout(start);
      if (interval) window.clearInterval(interval);
    };
  }, []);

  // Cursor → CSS vars (spotlight, lit grid, crosshair). rAF-throttled and
  // written straight to the DOM so React never re-renders on pointer move.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let x = 0;
    let y = 0;
    const paint = () => {
      raf = 0;
      root.style.setProperty("--mx", `${x}px`);
      root.style.setProperty("--my", `${y}px`);
      if (readoutRef.current) {
        readoutRef.current.textContent = `X ${String(Math.round(x)).padStart(4, "0")} · Y ${String(
          Math.round(y),
        ).padStart(4, "0")}`;
      }
    };
    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      root.dataset.pointer = "on";
      if (!raf) raf = requestAnimationFrame(paint);
    };
    const onLeave = () => {
      root.dataset.pointer = "off";
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const r = now === null ? { d: 0, h: 0, m: 0, s: 0, done: false } : remaining(now);
  const lagosTime =
    now === null
      ? "--:--:--"
      : new Intl.DateTimeFormat("en-GB", {
          timeZone: "Africa/Lagos",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(now);

  const d = (ms: number): CSSProperties => ({ animationDelay: `${ms}ms` });

  return (
    <div ref={rootRef} className={s.root} data-pointer="off">
      {/* ── Atmosphere (all decorative) ───────────────────────────────── */}
      <div className={s.surface} aria-hidden />
      <div className={s.grid} aria-hidden>
        {Array.from({ length: 12 }, (_, i) => (
          <span key={i} className={s.gridCol} style={d(1300 + i * 70)} />
        ))}
      </div>
      {[22, 50, 78].map((top, i) => (
        <span
          key={top}
          className={s.gridRow}
          style={{ top: `${top}%`, ...d(1400 + i * 160) }}
          aria-hidden
        />
      ))}
      <div className={s.gridLit} aria-hidden />
      <div className={s.grain} aria-hidden />
      <span className={s.crossX} aria-hidden />
      <span className={s.crossY} aria-hidden />
      <span ref={readoutRef} className={s.readout} aria-hidden>
        X 0000 · Y 0000
      </span>

      {/* ── Intro shutter ─────────────────────────────────────────────── */}
      <div className={s.shutter} aria-hidden>
        <span className={s.leafTop} />
        <span className={s.leafBottom} />
        <span className={s.seam} />
        <span className={`type-eyebrow ${s.shutterLabel}`}>Graviti Hill · Site under construction</span>
      </div>

      <div className={s.shell}>
        {/* ── Top bar ─────────────────────────────────────────────────── */}
        <header className={`${s.topbar} ${s.fadeUp}`} style={d(2000)}>
          <Lockup variant="white" width={140} href={null} priority />
          <div className={`type-eyebrow ${s.topMeta}`}>
            <span className={s.hideSm}>6°26′N · 3°25′E</span>
            <span>
              <span className={s.liveDot} aria-hidden />
              Lagos {lagosTime}
            </span>
          </div>
        </header>

        <main id="main" className={s.main}>
          <p className={`type-eyebrow ${s.eyebrow} ${s.fadeUp}`} style={d(2200)}>
            <span className={s.eyebrowRule} aria-hidden />
            Under construction
          </p>

          <h1 className={s.headline}>
            <span className="sr-only">
              We&rsquo;re building something assured. The new Graviti Hill opens
              Monday at 6pm.
            </span>
            <span aria-hidden>
              <span className={s.line}>
                <span className={`${s.lineInner} ${s.outline}`} style={d(2150)}>
                  We&rsquo;re building
                </span>
              </span>
              <span className={s.line}>
                <span className={s.lineInner} style={d(2280)}>
                  something
                </span>
              </span>
              <span className={s.line}>
                <span className={s.lineInner} style={d(2410)}>
                  <span className={s.rotator}>
                    {ROTATING.map((w, i) => (
                      <span
                        key={w}
                        className={s.rotWord}
                        data-state={i === word ? "in" : i === prevWord ? "out" : "idle"}
                      >
                        {w}
                      </span>
                    ))}
                  </span>
                </span>
              </span>
            </span>
          </h1>

          <p className={`${s.lede} ${s.fadeUp}`} style={d(2700)}>
            A new home for Graviti Hill&rsquo;s advisory, brand and coaching
            practice is being composed. The doors open Monday at 18:00, Lagos
            time. Until then, the conversation is already open.
          </p>

          {/* ── Countdown ─────────────────────────────────────────────── */}
          {r.done ? (
            <p className={s.live} role="status">
              The doors are opening. Refresh in a moment.
            </p>
          ) : (
            <section
              className={`${s.countWrap} ${s.fadeUp}`}
              style={d(2900)}
              aria-label="Countdown to launch"
            >
              <span className={`${s.corner} ${s.cTL}`} aria-hidden />
              <span className={`${s.corner} ${s.cTR}`} aria-hidden />
              <span className={`${s.corner} ${s.cBL}`} aria-hidden />
              <span className={`${s.corner} ${s.cBR}`} aria-hidden />

              <div className={`type-eyebrow ${s.countHead}`}>
                <span>Launch sequence</span>
                <span>Mon 16 / 11 / 26 · 18:00 WAT</span>
              </div>

              <div className={s.count}>
                <Unit value={r.d} label="Days" of={7} />
                <Unit value={r.h} label="Hours" of={24} />
                <Unit value={r.m} label="Minutes" of={60} />
                <Unit value={r.s} label="Seconds" of={60} seconds />
              </div>

              {/* Screen readers get a calm, once-a-minute summary rather
                  than a per-second announcement. */}
              <p className="sr-only" aria-live="polite">
                {now === null
                  ? ""
                  : `${r.d} days, ${r.h} hours and ${r.m} minutes until launch.`}
              </p>
            </section>
          )}

          {/* ── Reach us meanwhile ────────────────────────────────────── */}
          <div className={`${s.contact} ${s.fadeUp}`} style={d(3150)}>
            <div className={s.ctaRow}>
              <a className={`${s.btn} ${s.btnPrimary}`} href={`mailto:${EMAIL}`}>
                <span>Start a conversation</span>
                <span className={s.arrow} aria-hidden>
                  →
                </span>
              </a>
              <a
                className={`${s.btn} ${s.btnGhost}`}
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>WhatsApp us</span>
                <span className={s.arrow} aria-hidden>
                  →
                </span>
              </a>
            </div>

            <address className={`not-italic text-[0.9375rem] ${s.phones}`}>
              <a className={s.link} href={`mailto:${EMAIL}`}>
                {EMAIL}
              </a>
              {PHONES.map((p) => (
                <a key={p.e164} className={s.link} href={`tel:${p.e164}`}>
                  {p.display}
                </a>
              ))}
            </address>
          </div>
        </main>

        {/* ── Footer ticker ───────────────────────────────────────────── */}
        <footer className={`type-eyebrow ${s.footer} ${s.fadeUp}`} style={d(3300)}>
          <span className={`${s.footerFixed} ${s.hideSm}`}>
            © {new Date().getFullYear()} Graviti Hill Limited
          </span>
          <div className={s.ticker} aria-hidden>
            <div className={s.tickerTrack}>
              {[...TICKER, ...TICKER].map((t, i) => (
                <span key={i} className={s.tickerItem}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </footer>
      </div>

      <span
        className={s.minuteRule}
        style={{ transform: `scaleX(${r.s / 60})` }}
        aria-hidden
      />
    </div>
  );
}
