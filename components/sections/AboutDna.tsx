import { Studio } from "@/components/sections/Studio";
import { DnaCarousel } from "@/components/sections/DnaCarousel";
import { HeadlineReveal } from "@/components/motion/HeadlineReveal";
import { Reveal } from "@/components/motion/Reveal";
import { Icon } from "@/components/icons";
import type { Pillar } from "@/lib/schemas";

/**
 * /about §03 — the four commitments.
 *
 * The statement and an index of the four on the left; one commitment at a
 * time on the right, set at display scale and rotating on its own. Giving
 * each commitment the whole stage is what makes it read as a position the
 * firm holds rather than one feature in a row of four.
 *
 * Server component. The carousel is the only client island; the heading is
 * rendered here and handed to it as a slot.
 */
export function AboutDna({ pillars }: { pillars: Pillar[] }) {
  return (
    <Studio surface="deep" labelledBy="dna-heading">
      <div className="shell">
        <Reveal>
          <p className="type-eyebrow flex items-center gap-4 text-ink-muted">
            <span className="text-green">03</span>
            <span aria-hidden="true" className="h-px w-6 bg-rule" />
            <span className="whitespace-nowrap">Brand DNA</span>
          </p>
        </Reveal>

        <div className="mt-12">
          <DnaCarousel
            heading={
              <HeadlineReveal
                as="h2"
                id="dna-heading"
                className="type-display text-h2 text-ink-display"
                lines={[
                  "Four commitments",
                  "the work is measured",
                  <span key="against" className="text-green">
                    against.
                  </span>,
                ]}
              />
            }
            items={pillars.map((pillar) => ({
              key: pillar.name,
              name: pillar.name,
              summary: pillar.summary,
              detail: pillar.detail,
              icon: <Icon name={pillar.icon} className="h-12 w-12 text-green lg:h-14 lg:w-14" />,
            }))}
          />
        </div>
      </div>
    </Studio>
  );
}
