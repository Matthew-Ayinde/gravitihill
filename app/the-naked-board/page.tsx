import type { Metadata } from "next";
import { Section, SectionLabel, SectionLabelInline } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { HeadlineReveal } from "@/components/motion/HeadlineReveal";
import { Magnetic } from "@/components/motion/Magnetic";
import { Parallax } from "@/components/motion/Parallax";
import { CountUp } from "@/components/motion/CountUp";
import { HudCorners } from "@/components/motion/HudCorners";
import { NakedBoardField } from "@/components/sections/NakedBoardField";
import { NakedBoardHero } from "@/components/sections/NakedBoardHero";
import { NakedBoardStages } from "@/components/sections/NakedBoardStages";
import { NakedBoardAudience } from "@/components/sections/NakedBoardAudience";
import { getNakedBoard } from "@/content/naked-board";
import { pageMetadata } from "@/lib/seo";
import { getSiteSettings, whatsappUrl } from "@/lib/settings";

export const metadata: Metadata = pageMetadata({
  title: "The Naked Board",
  description:
    "Graviti Hill's proprietary executive coaching platform for boardroom challenges and cultural transformation. A structured programme, closed cohorts, unrecorded sessions.",
  path: "/the-naked-board",
});

/**
 * This page has its own identity inside the system: dark-dominant, product
 * framing, instrumentation rather than a plain service list. It should read
 * as a platform the firm owns, not as a fifth practice page — see
 * NakedBoardField/Hero/Stages/Audience for the treatment that's unique to
 * this route (cursor-reactive glow, a scroll-linked stage rail, count-up
 * data points, HUD corner framing on the closing CTA).
 */
export default async function NakedBoardPage() {
  const [nakedBoard, settings] = await Promise.all([getNakedBoard(), getSiteSettings()]);

  return (
    <>
      <NakedBoardHero
        eyebrow="A Graviti Hill platform"
        title={
          <>
            The Naked <span className="accent-word-dark">Board.</span>
          </>
        }
        lede={nakedBoard.premise}
        index={[
          { label: "Format", value: "Closed cohort" },
          { label: "Sessions", value: "Unrecorded" },
          { label: "Delivery", value: "Lagos" },
        ]}
        ticker={[
          "CLOSED COHORT",
          "UNRECORDED SESSIONS",
          "BOARDROOM READY",
          "LAGOS",
          nakedBoard.name.toUpperCase(),
        ]}
      />

      {/* ── Positioning ─────────────────────────────────────────────────── */}
      <NakedBoardField>
        <div className="shell grid-12 gap-y-8">
          <div className="col-span-12 lg:col-span-3">
            <SectionLabel index="01" tone="dark">
              The premise
            </SectionLabel>
            <SectionLabelInline index="01" tone="dark">
              The premise
            </SectionLabelInline>
          </div>

          <div className="relative col-span-12 lg:col-span-8 lg:col-start-5">
            {/* A watermark numeral, not a stat card: the stage count counts
                itself in the first time it scrolls into view, then drifts a
                few pixels against the copy as the page keeps moving. */}
            <Parallax
              direction="down"
              range={0.06}
              className="pointer-events-none absolute -top-14 right-0 hidden select-none lg:block"
            >
              <CountUp
                value={nakedBoard.stages.length}
                pad={2}
                className="type-display text-hero leading-none text-white/8"
              />
            </Parallax>

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
              {nakedBoard.positioning.map((paragraph, i) => (
                <Reveal as="p" key={i}>
                  {paragraph}
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </NakedBoardField>

      {/* ── The sequence ────────────────────────────────────────────────── */}
      <NakedBoardField labelledBy="sequence-heading">
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
            <h2 id="sequence-heading" className="type-display max-w-[18ch] text-h2 text-white">
              <CountUp value={nakedBoard.stages.length} pad={2} className="text-accent" /> stages,
              run in order.
            </h2>

            <NakedBoardStages stages={nakedBoard.stages} />
          </div>
        </div>
      </NakedBoardField>

      {/* ── Who it is for — the one light band on this page ─────────────── */}
      <Section tone="alt" labelledBy="audience-heading">
        <div className="shell grid-12 gap-y-8">
          <div className="col-span-12 lg:col-span-3">
            <SectionLabel index="03">Who it is for</SectionLabel>
            <SectionLabelInline index="03">Who it is for</SectionLabelInline>
          </div>

          <div className="col-span-12 lg:col-span-9">
            <h2 id="audience-heading" className="type-display max-w-[20ch] text-h2">
              <CountUp value={nakedBoard.audience.length} pad={2} className="text-green" />{" "}
              situations this was built for.
            </h2>

            <NakedBoardAudience items={nakedBoard.audience} />

            <p className="type-eyebrow mt-10 text-ink-muted">{nakedBoard.commitment}</p>
          </div>
        </div>
      </Section>

      {/* ── Booking ─────────────────────────────────────────────────────── */}
      <NakedBoardField>
        <div className="shell">
          <div className="grid-12 gap-y-10">
            <div className="col-span-12 lg:col-span-3">
              <SectionLabel index="04" tone="dark">
                Enrol
              </SectionLabel>
              <SectionLabelInline index="04" tone="dark">
                Enrol
              </SectionLabelInline>
            </div>

            <div className="relative col-span-12 border border-rule-dark p-8 lg:col-span-9 lg:p-14">
              <HudCorners tone="dark" />

              <Reveal as="h2" className="type-display max-w-[16ch] text-h2 text-white">
                Cohorts are formed by conversation, not by application.
              </Reveal>
              <p className="measure mt-8 text-body-lg text-white/75">
                Tell us the situation. If The Naked Board is the wrong instrument
                for it, we will say so and point you at the right one.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Magnetic strength={0.3}>
                  <ButtonLink href="/contact" tone="dark">
                    Start a conversation
                  </ButtonLink>
                </Magnetic>
                <Magnetic strength={0.25}>
                  <ButtonLink
                    href={whatsappUrl(settings)}
                    tone="dark"
                    variant="secondary"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Message on WhatsApp
                  </ButtonLink>
                </Magnetic>
              </div>
            </div>
          </div>
        </div>
      </NakedBoardField>
    </>
  );
}
