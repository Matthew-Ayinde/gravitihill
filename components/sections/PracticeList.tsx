import Link from "next/link";
import { RevealGroup, RevealItem } from "@/components/motion/RevealGroup";
import { Icon } from "@/components/icons";
import { PRACTICES } from "@/content/services";
import { indexNumber } from "@/lib/utils";

/**
 * The four practices as a hairline-ruled editorial list. Hovering or focusing a
 * row reveals three sample services.
 *
 * Two decisions worth naming:
 *
 * 1. No accordion, no chevron, no height animation. The right half of every row
 *    is permanently reserved and the services *fade in place*. Nothing moves,
 *    so the section contributes exactly zero to CLS and the interaction reads
 *    as a reveal rather than a toy.
 *
 * 2. This is a server component. The whole behaviour is `group-hover` and
 *    `group-focus-visible` in CSS — no state, no client boundary, no JS. Under
 *    1024px the services are simply always visible, because a hover affordance
 *    on a touch device is a hidden feature.
 */
export function PracticeList() {
  return (
    <RevealGroup as="ul" className="border-t border-rule">
      {PRACTICES.map((practice, i) => (
        <RevealItem as="li" key={practice.slug}>
          <Link
            href={`/services/${practice.slug}`}
            className="group flex flex-col gap-4 border-b border-rule py-9 transition-colors duration-200 ease-brand hover:bg-canvas-alt focus-visible:bg-canvas-alt lg:flex-row lg:items-center lg:gap-10"
          >
            {/* Half the row, fixed. The practice names must never wrap —
                a two-line name makes the rows uneven and the index stops
                reading as an index. */}
            <div className="flex items-baseline gap-5 lg:w-1/2 lg:shrink-0">
              <span className="type-eyebrow text-ink-muted">
                {indexNumber(i)}
              </span>
              <h3 className="type-display text-h2">{practice.name}</h3>
            </div>

            {/* Reserved space — present whether or not it is showing anything,
                so the reveal changes tone and never geometry. */}
            <div className="lg:flex-1">
              <ul className="flex flex-wrap gap-x-6 gap-y-2 opacity-100 transition-opacity duration-300 ease-brand lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-visible:opacity-100">
                {practice.offerings.slice(0, 3).map((offering) => (
                  <li
                    key={offering.name}
                    className="type-eyebrow flex items-center gap-2 text-ink-muted"
                  >
                    <Icon name={offering.icon} className="h-4 w-4 text-green" />
                    {offering.name}
                  </li>
                ))}
                <li className="type-eyebrow text-ink-muted/70">
                  +{practice.offerings.length - 3} more
                </li>
              </ul>
            </div>

            <span
              aria-hidden="true"
              className="type-subhead hidden shrink-0 text-ink-muted transition-transform duration-200 ease-brand group-hover:translate-x-1 lg:block"
            >
              →
            </span>
          </Link>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
