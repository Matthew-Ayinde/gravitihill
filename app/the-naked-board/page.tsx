import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { Section, SectionLabel, SectionLabelInline } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { RevealGroup, RevealItem } from "@/components/motion/RevealGroup";
import { HeadlineReveal } from "@/components/motion/HeadlineReveal";
import { Icon } from "@/components/icons";
import { NAKED_BOARD } from "@/content/naked-board";
import { pageMetadata } from "@/lib/seo";
import { WHATSAPP_URL } from "@/lib/site";
import { indexNumber } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "The Naked Board",
  description:
    "Graviti Hill's proprietary executive coaching platform for boardroom challenges and cultural transformation. A structured programme, closed cohorts, unrecorded sessions.",
  path: "/the-naked-board",
});

/**
 * This page has its own identity inside the system: dark-dominant, product
 * framing, a sequence rather than a service list. It should read as a platform
 * the firm owns, not as a fifth practice page.
 */
export default function NakedBoardPage() {
  const grid = ["lg:col-start-1", "lg:col-start-2", "lg:col-start-3", "lg:col-start-4", "lg:col-start-5"];

  return (
    <>
      <PageHero
        eyebrow="A Graviti Hill platform"
        tone="dark"
        title={
          <>
            The Naked <span className="accent-word-dark">Board.</span>
          </>
        }
        lede={NAKED_BOARD.premise}
        index={[
          { label: "Format", value: "Closed cohort" },
          { label: "Sessions", value: "Unrecorded" },
          { label: "Delivery", value: "Lagos" },
        ]}
      />

      {/* ── Positioning ─────────────────────────────────────────────────── */}
      <Section tone="ridge">
        <div className="shell grid-12 gap-y-8">
          <div className="col-span-12 lg:col-span-3">
            <SectionLabel index="01" tone="dark">
              The premise
            </SectionLabel>
            <SectionLabelInline index="01" tone="dark">
              The premise
            </SectionLabelInline>
          </div>

          <div className="col-span-12 lg:col-span-8 lg:col-start-5">
            <HeadlineReveal
              as="h2"
              className="type-display text-h2 text-white"
              lines={[
                "The name is the",
                <>
                  method<span className="accent-word-dark">.</span>
                </>,
              ]}
            />
            <div className="measure mt-10 space-y-6 text-body-lg text-white/75">
              {NAKED_BOARD.positioning.map((paragraph, i) => (
                <Reveal as="p" key={i}>
                  {paragraph}
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ── The sequence ────────────────────────────────────────────────── */}
      <Section tone="ridge" labelledBy="sequence-heading">
        <div className="shell grid-12 gap-y-8">
          <div className="col-span-12 lg:col-span-3">
            <SectionLabel index="02" tone="dark">
              The sequence
            </SectionLabel>
            <SectionLabelInline index="02" tone="dark">
              The sequence
            </SectionLabelInline>
          </div>

          <div className="col-span-12 lg:col-span-9">
            <h2
              id="sequence-heading"
              className="type-display max-w-[18ch] text-h2 text-white"
            >
              Five stages, run in order.
            </h2>

            {/* Each stage steps one column further in — the programme
                advancing, expressed as layout rather than an animation. */}
            <RevealGroup as="ol" className="grid-12 mt-16 gap-y-0">
              {NAKED_BOARD.stages.map((stage, i) => (
                <RevealItem
                  as="li"
                  key={stage.name}
                  className={`col-span-12 border-t border-rule-dark py-8 lg:col-span-8 ${grid[i]}`}
                >
                  <div className="flex gap-6">
                    <span className="type-eyebrow w-8 shrink-0 pt-1.5 text-accent">
                      {indexNumber(i)}
                    </span>
                    <Icon
                      name={stage.icon}
                      className="mt-1 h-6 w-6 shrink-0 text-white"
                      accentClassName="text-accent"
                    />
                    <div>
                      <h3 className="type-subhead text-h3 text-white">
                        {stage.name}
                      </h3>
                      <p className="measure mt-2 text-white/65">{stage.summary}</p>
                    </div>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </Section>

      {/* ── Who it is for — the one light band on this page ─────────────── */}
      <Section tone="alt" labelledBy="audience-heading">
        <div className="shell grid-12 gap-y-8">
          <div className="col-span-12 lg:col-span-3">
            <SectionLabel index="03">Who it is for</SectionLabel>
            <SectionLabelInline index="03">Who it is for</SectionLabelInline>
          </div>

          <div className="col-span-12 lg:col-span-9">
            <h2 id="audience-heading" className="type-display max-w-[20ch] text-h2">
              Four situations this was built for.
            </h2>

            <RevealGroup as="ul" className="mt-14 border-t border-rule">
              {NAKED_BOARD.audience.map((item, i) => (
                <RevealItem
                  as="li"
                  key={item}
                  className="flex gap-6 border-b border-rule py-7"
                >
                  <span className="type-eyebrow w-8 shrink-0 pt-1 text-green">
                    {indexNumber(i)}
                  </span>
                  <p className="measure text-body-lg">{item}</p>
                </RevealItem>
              ))}
            </RevealGroup>

            <p className="type-eyebrow mt-10 text-ink-muted">
              {NAKED_BOARD.commitment}
            </p>
          </div>
        </div>
      </Section>

      {/* ── Booking ─────────────────────────────────────────────────────── */}
      <Section tone="ridge">
        <div className="shell grid-12 gap-y-10">
          <div className="col-span-12 lg:col-span-3">
            <SectionLabel index="04" tone="dark">
              Enrol
            </SectionLabel>
            <SectionLabelInline index="04" tone="dark">
              Enrol
            </SectionLabelInline>
          </div>

          <div className="col-span-12 lg:col-span-9">
            <Reveal
              as="h2"
              className="type-display max-w-[16ch] text-h2 text-white"
            >
              Cohorts are formed by conversation, not by application.
            </Reveal>
            <p className="measure mt-8 text-body-lg text-white/75">
              Tell us the situation. If The Naked Board is the wrong instrument
              for it, we will say so and point you at the right one.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <ButtonLink href="/contact" tone="dark">
                Start a conversation
              </ButtonLink>
              <ButtonLink
                href={WHATSAPP_URL}
                tone="dark"
                variant="secondary"
                target="_blank"
                rel="noopener noreferrer"
              >
                Message on WhatsApp
              </ButtonLink>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
