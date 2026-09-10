import Link from "next/link";
import { Icon } from "@/components/icons";
import { ScrubRule } from "@/components/motion/ScrubRule";
import { RevealGroup, RevealItem } from "@/components/motion/RevealGroup";
import type { Sector } from "@/lib/schemas";

/**
 * /sectors §01 — how the work is run in each sector.
 *
 * ── What this section is not allowed to repeat ──────────────────────────
 * The hero already carries each sector's photograph, proposition and
 * differentiators. This section carries only what the hero does not: the
 * thesis (why the sector behaves as it does) and the three approach steps
 * with their notes. No imagery, no propositions, no index numerals — the
 * sector name is the only thing both share, and here it is a label at h3
 * scale rather than a second display moment.
 *
 * ── Layout ───────────────────────────────────────────────────────────────
 * One block per sector. On desktop the left column (name, thesis, link) is
 * sticky while its three steps scroll past on the right, and a scrubbed
 * accent rule beside it shows progress through that sector. Below 1024px
 * it is a plain stacked list.
 */
export function SectorApproach({ sectors }: { sectors: Sector[] }) {
  return (
    <section
      id="approach"
      aria-labelledby="approach-heading"
      className="scroll-mt-24 bg-canvas-alt py-section"
    >
      <div className="shell">
        <div className="grid-12 gap-y-6">
          <p className="type-eyebrow col-span-12 text-ink-muted lg:col-span-5 lg:pt-3">
            <span className="text-green">01</span>
            <span aria-hidden="true" className="mx-2">
              —
            </span>
            Approach
          </p>
          <h2
            id="approach-heading"
            className="type-display col-span-12 text-h1 lg:col-span-7 lg:col-start-6"
          >
            <span className="block">One standard.</span>
            <span className="block">
              Run <span className="accent-word">three ways.</span>
            </span>
          </h2>
        </div>

        <ul className="mt-16 lg:mt-24">
          {sectors.map((sector) => (
            <li
              key={sector.slug}
              data-scrub-root
              className="grid-12 gap-y-10 border-t border-rule py-14 lg:py-20"
            >
              <div className="col-span-12 lg:col-span-4">
                <div className="flex gap-6 lg:sticky lg:top-32">
                  <ScrubRule className="hidden shrink-0 lg:block" />

                  <div>
                    <h3 className="type-display text-h2">{sector.name}</h3>
                    <p className="measure-tight mt-5 text-ink-muted">{sector.thesis[0]}</p>
                    <Link
                      href={`/sectors/${sector.slug}`}
                      className="type-eyebrow mt-8 inline-flex items-center gap-3 text-green"
                    >
                      <span className="link-draw">The full {sector.name} brief</span>
                      <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Rules sit between steps only: the sector's own top border
                  already opens the block, so a list border would double it. */}
              <RevealGroup as="ol" className="col-span-12 lg:col-span-7 lg:col-start-6">
                {sector.approach.map((step) => (
                  <RevealItem
                    as="li"
                    key={step.name}
                    className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 border-t border-rule py-8 first:border-t-0 first:pt-0 last:pb-0 lg:py-10"
                  >
                    <Icon name={step.icon} className="mt-1 h-7 w-7 text-green" />
                    <div>
                      <h4 className="type-subhead text-h3">{step.name}</h4>
                      <p className="measure mt-3 text-body-lg text-ink-muted">{step.note}</p>
                    </div>
                  </RevealItem>
                ))}
              </RevealGroup>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
