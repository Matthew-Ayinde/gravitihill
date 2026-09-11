import Link from "next/link";
import type { CSSProperties } from "react";
import { BenchField } from "@/components/motion/BenchField";
import { Converge } from "@/components/motion/Converge";
import { RevealGroup, RevealItem } from "@/components/motion/RevealGroup";
import { Icon } from "@/components/icons";
import { Section, SectionLabel, SectionLabelInline } from "@/components/ui/Section";
import { getPractices } from "@/content/services";
import type { Practice } from "@/lib/schemas";
import { indexNumber } from "@/lib/utils";

/**
 * Home §02: the four practices as one bench.
 *
 * Two layouts are rendered, and CSS shows exactly one of them. Because
 * `display: none` removes a subtree from the accessibility tree, assistive
 * technology only meets one:
 *
 *   · Desktop, motion allowed: <BenchField>, a 2×2 field whose split follows
 *     the pointer. See that file for the mechanics.
 *   · Under 1024px, or reduced motion at any width: a native <details>
 *     accordion with the first practice open. It works without JavaScript and
 *     animates its height where the browser supports `::details-content`.
 *
 * All markup is rendered here on the server. The client field receives
 * finished children and only writes CSS variables.
 *
 * "One bench" is backed by the data: a service offered by more than one
 * practice (Due Diligence, today) is marked with the other practice's index,
 * and the headline count is of distinct services, not a sum.
 */
export async function PracticeBench({ index = "02" }: { index?: string }) {
  const practices = await getPractices();

  // service name → every practice index that offers it
  const owners = new Map<string, number[]>();
  practices.forEach((practice, p) =>
    practice.offerings.forEach((offering) => {
      const key = offering.name.trim().toLowerCase();
      owners.set(key, [...(owners.get(key) ?? []), p]);
    }),
  );
  const distinct = owners.size;
  const names = practices.map((practice) => practice.name);

  return (
    <Section labelledBy="practices-heading" className="overflow-x-clip">
      <div className="shell grid-12 gap-y-10">
        <div className="col-span-12 lg:col-span-3">
          <SectionLabel index={index}>Practice</SectionLabel>
          <SectionLabelInline index={index}>Practice</SectionLabelInline>
        </div>

        <div className="col-span-12 grid gap-y-8 lg:col-span-9 lg:grid-cols-9 lg:items-end lg:gap-x-8">
          <Converge
            id="practices-heading"
            className="type-display text-h1 lg:col-span-6"
            lines={[
              "Four practices,",
              <span key="line-2">
                staffed from <span className="accent-word">one bench.</span>
              </span>,
            ]}
          />
          <p className="measure-tight text-body-lg text-ink-muted lg:col-span-3 lg:pb-2">
            {distinct} services, one team. The practice is how you engage us.
            The people doing the work are the same.
          </p>
        </div>
      </div>

      <div className="shell mt-14 lg:mt-20">
        {/* ── Desktop: the field ─────────────────────────────────────── */}
        <BenchField className="hidden border-y border-rule motion-safe:lg:block">
          {practices.map((practice, p) => (
            <article
              key={practice.slug}
              data-bench-cell
              data-q={p}
              data-open={p === 0 ? "" : undefined}
              className="bench-cell"
              style={{ "--lit": p === 0 ? 1 : 0 } as CSSProperties}
            >
              <div className="bench-inner">
                <div data-bench-head data-motion>
                  <p className="type-eyebrow flex items-center gap-3 text-ink-muted">
                    <span className="text-green">{indexNumber(p)}</span>
                    <span aria-hidden="true" className="h-px w-6 bg-rule" />
                    {practice.offerings.length} services
                  </p>
                  <h3 className="mt-4">
                    <Link href={`/services/${practice.slug}`} className="bench-link">
                      <span className="bench-name type-display">{practice.name}</span>
                    </Link>
                  </h3>
                </div>

                <p className="bench-prop measure-tight mt-3 text-body-lg text-ink-muted">
                  {practice.proposition}
                </p>

                <ServiceList practice={practice} position={p} owners={owners} names={names} variant="field" />

                <p aria-hidden="true" className="bench-cue type-eyebrow mt-auto pt-6 text-green">
                  Open the practice <span className="bench-cue-arrow">→</span>
                </p>
              </div>
            </article>
          ))}
        </BenchField>

        {/* ── Mobile & reduced motion: the stack ─────────────────────── */}
        <RevealGroup className="bench-stack border-t border-rule motion-safe:lg:hidden">
          {practices.map((practice, p) => (
            <RevealItem key={practice.slug}>
              <details name="practice-bench" open={p === 0} className="border-b border-rule">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-7 [&::-webkit-details-marker]:hidden">
                  <h3 className="flex items-baseline gap-4">
                    <span className="type-eyebrow text-green">{indexNumber(p)}</span>
                    <span className="bench-stack-name type-display text-h2">{practice.name}</span>
                  </h3>
                  <span className="flex shrink-0 items-center gap-4">
                    <span className="type-eyebrow hidden text-ink-muted sm:inline">
                      {practice.offerings.length} services
                    </span>
                    <span aria-hidden="true" className="bench-toggle" />
                  </span>
                </summary>

                <div className="pb-10">
                  <p className="measure text-body-lg text-ink-muted">{practice.proposition}</p>
                  <ServiceList practice={practice} position={p} owners={owners} names={names} variant="stack" />
                  <Link
                    href={`/services/${practice.slug}`}
                    className="link-draw type-eyebrow mt-8 text-green"
                  >
                    Open {practice.name} →
                  </Link>
                </div>
              </details>
            </RevealItem>
          ))}
        </RevealGroup>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <p className="type-eyebrow hidden text-ink-muted motion-safe:lg:block">
            Move across the bench to open a practice
          </p>
          <Link href="/services" className="link-draw type-eyebrow">
            All services
          </Link>
        </div>
      </div>
    </Section>
  );
}

function ServiceList({
  practice,
  position,
  owners,
  names,
  variant,
}: {
  practice: Practice;
  position: number;
  owners: Map<string, number[]>;
  names: string[];
  variant: "field" | "stack";
}) {
  return (
    <ul className={variant === "field" ? "bench-services mt-6" : "mt-7 grid gap-x-8 gap-y-3 sm:grid-cols-2"}>
      {practice.offerings.map((offering, i) => {
        const shared = (owners.get(offering.name.trim().toLowerCase()) ?? []).filter(
          (owner) => owner !== position,
        );
        return (
          <li
            key={offering.name}
            className={variant === "field" ? "bench-service" : "flex items-start gap-3"}
            style={variant === "field" ? ({ "--i": i } as CSSProperties) : undefined}
          >
            <Icon name={offering.icon} className="mt-0.5 h-4 w-4 shrink-0 text-green" />
            <span>
              {offering.name}
              {shared.length > 0 ? (
                <span className="type-eyebrow ml-2 whitespace-nowrap text-ink-muted">
                  <span aria-hidden="true">Also {shared.map(indexNumber).join(", ")}</span>
                  <span className="sr-only">
                    , also offered in {shared.map((owner) => names[owner]).join(" and ")}
                  </span>
                </span>
              ) : null}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
