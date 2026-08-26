import type { ReactNode } from "react";
import { CountUp } from "@/components/motion/CountUp";
import { HudCorners } from "@/components/motion/HudCorners";
import { Reveal } from "@/components/motion/Reveal";
import { RevealGroup, RevealItem } from "@/components/motion/RevealGroup";
import { ScanLine } from "@/components/motion/ScanLine";
import { Spotlight } from "@/components/motion/Spotlight";
import { cn, leadingInt } from "@/lib/utils";

/**
 * The opening of every secondary route: Services, Sectors, Insights, Contact.
 * (About gets its own sibling, AboutHero — this file is untouched by that
 * page. Home and The Naked Board never import this component at all, so
 * neither is affected by anything below.)
 *
 * The h1 still renders statically — no mask reveal, no entrance. It is the
 * LCP element on every page that uses it, and withholding the paint to
 * animate it would spend the performance budget on the one thing the brief
 * protects. Motion starts at the eyebrow and the index panel, both of which
 * sit beside the headline rather than ahead of it.
 *
 * ── The ambient system layer ────────────────────────────────────────────────
 * A cursor-tracked <Spotlight> and a slow <ScanLine> sweep read as
 * instrumentation, not decoration: the page feels like it's live and
 * measuring something, which is the "futuristic" register this pass asked
 * for. Both are inert SVG/CSS on the compositor — see their own files for
 * why neither costs meaningful CPU — and both disappear outright under
 * `prefers-reduced-motion`.
 *
 * Layout is asymmetric by default: title in columns 1–8, the index block in
 * 10–12, prose never dead-centre.
 */
export function PageHero({
  eyebrow,
  title,
  lede,
  index,
  tone = "light",
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  /** Editorial data for the right margin — label/value pairs, not stat cards. */
  index?: ReadonlyArray<{ label: string; value: string }>;
  tone?: "light" | "dark";
  children?: ReactNode;
}) {
  const dark = tone === "dark";

  return (
    <section
      className={cn(
        "relative overflow-hidden pt-36 pb-20 lg:pt-44 lg:pb-28 2xl:pt-56 2xl:pb-32",
        dark && "bg-ridge text-white",
      )}
    >
      <Spotlight tone={dark ? "dark" : "light"} className="z-0" />
      <ScanLine
        tone={dark ? "dark" : "light"}
        duration={7}
        className={dark ? "z-0 opacity-35" : "z-0 opacity-[0.18]"}
      />

      <div className="shell grid-12 relative z-10 gap-y-10">
        <div className="col-span-12 lg:col-span-8">
          <p
            className={cn(
              "type-eyebrow flex items-center gap-2.5",
              dark ? "text-accent" : "text-green",
            )}
          >
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 shrink-0 animate-pulse-dot rounded-full bg-current"
            />
            {eyebrow}
          </p>
          <h1
            className={cn(
              "type-display mt-6 text-h1",
              dark ? "text-white" : "text-ink",
            )}
          >
            {title}
          </h1>
        </div>

        {index && index.length > 0 && (
          <div className="relative col-span-12 self-end lg:col-span-3 lg:col-start-10">
            <HudCorners tone={dark ? "dark" : "light"} size={18} />
            <RevealGroup as="dl" className="px-1 py-1" stagger={0.06}>
              {index.map((item) => {
                const n = leadingInt(item.value);
                const suffix = n !== null ? item.value.slice(String(n).length) : "";

                return (
                  <RevealItem
                    as="div"
                    key={item.label}
                    className={cn(
                      "flex items-baseline justify-between gap-6 border-t py-3",
                      dark ? "border-rule-dark" : "border-rule",
                    )}
                  >
                    <dt
                      className={cn(
                        "type-eyebrow",
                        dark ? "text-white/45" : "text-ink-muted",
                      )}
                    >
                      {item.label}
                    </dt>
                    <dd className="type-subhead text-body-lg">
                      {n !== null ? (
                        <>
                          <CountUp value={n} />
                          {suffix}
                        </>
                      ) : (
                        item.value
                      )}
                    </dd>
                  </RevealItem>
                );
              })}
            </RevealGroup>
          </div>
        )}

        {lede && (
          <div className="col-span-12 lg:col-span-7">
            <Reveal as="p" className={cn("measure text-body-lg", dark ? "text-white/75" : "text-ink-muted")}>
              {lede}
            </Reveal>
          </div>
        )}

        {children && <div className="col-span-12">{children}</div>}
      </div>
    </section>
  );
}
