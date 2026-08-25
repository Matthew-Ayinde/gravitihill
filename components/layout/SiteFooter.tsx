import Link from "next/link";
import { Lockup } from "@/components/ui/Lockup";
import { HeadlineReveal } from "@/components/motion/HeadlineReveal";
import { Magnetic } from "@/components/motion/Magnetic";
import { Marquee } from "@/components/motion/Marquee";
import { GrainOverlay } from "@/components/motion/GrainOverlay";
import { AnimatedGrid } from "@/components/motion/AnimatedGrid";
import { FOOTER_NAV, SITE } from "@/lib/site";
import { getSiteSettings } from "@/lib/settings";

/**
 * Dark footer on --ridge — back in the same green family as the rest of the
 * site's dark panels, at explicit request. What makes it not read as "the
 * same flat fill again" is two layered, animated surfaces rather than a
 * colour swap: a hairline grid that pans on an infinite diagonal loop
 * (<AnimatedGrid>, pure SVG strokes — no gradient function anywhere) under a
 * slow-shifting film-grain texture (<GrainOverlay>). Motion and geometry do
 * the work a different background colour was doing before.
 *
 * The address block here is the NAP of record — it, the contact page and the
 * JSON-LD all read the same lib/settings.ts getter, so local SEO never sees
 * a variant.
 */
export async function SiteFooter() {
  const year = new Date().getFullYear();
  const { address: ADDRESS, email: EMAIL, phones: PHONES, linkedin: LINKEDIN } =
    await getSiteSettings();

  return (
    // `isolate`, not just `relative`: position:relative with no explicit
    // z-index does NOT form a new stacking context on its own, so the
    // `-z-10` layers below would otherwise escape to whatever real stacking
    // context sits above the footer in the tree — sinking behind the page's
    // own background rather than just behind this section's text, which is
    // exactly the bug that made both layers invisible. `isolate` forces
    // this element to own its stacking context, so -z-10 only ever means
    // "behind this footer's own content."
    <footer className="relative isolate overflow-hidden bg-ridge text-white">
      <AnimatedGrid className="-z-10" />
      <GrainOverlay className="-z-10" />

      <div className="shell pt-20">
        {/* The closing statement, set at the same command as the hero it
            answers — the one place on the page allowed to be this large
            after the fold, because it's the last thing said. */}
        <HeadlineReveal
          as="p"
          className="type-display max-w-4xl text-h1"
          lines={["Re-definers of", "Brand Building."]}
        />

        <div className="mt-14 flex flex-wrap items-center justify-between gap-8 border-t border-rule-dark pt-10">
          <p className="measure-tight text-white/65">
            Let&rsquo;s talk about the outcome you&rsquo;re trying to reach.
          </p>
          <Magnetic strength={0.3}>
            <Link
              href="/contact"
              className="type-subhead flex items-center gap-3 text-body-lg text-white"
            >
              Start a conversation
              <span aria-hidden="true">→</span>
            </Link>
          </Magnetic>
        </div>
      </div>

      <div className="shell py-20">
        <div className="grid-12 gap-y-14">
          <div className="col-span-12 lg:col-span-4">
            <Lockup variant="white" width={200} />
          </div>

          <nav aria-label="Footer" className="col-span-6 lg:col-span-3">
            <h2 className="type-eyebrow mb-6 text-white/55">Navigate</h2>
            <ul className="space-y-3">
              {FOOTER_NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="link-draw type-subhead text-body-lg text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="col-span-6 lg:col-span-5">
            <h2 className="type-eyebrow mb-6 text-white/55">Reach us</h2>
            <address className="space-y-6">
              <p className="measure-tight text-white/75">
                {ADDRESS.street},<br />
                {ADDRESS.locality}, {ADDRESS.region}, {ADDRESS.country}
              </p>
              <p>
                <a
                  href={`mailto:${EMAIL}`}
                  className="link-draw type-subhead text-body-lg text-white"
                >
                  {EMAIL}
                </a>
              </p>
              <ul className="flex flex-wrap gap-x-8 gap-y-2">
                {PHONES.map((phone) => (
                  <li key={phone.e164}>
                    <a
                      href={`tel:${phone.e164}`}
                      className="link-draw text-white/75"
                    >
                      {phone.display}
                    </a>
                  </li>
                ))}
              </ul>
            </address>
          </div>
        </div>
      </div>

      {/* A large-scale wordmark as the footer's base note — pure type, not
          the graphic mark (reserved for the approved lockup only, per §0.1)
          and not a gradient fill (banned outright). The same ghost-type
          language already used behind the Naked Board panel, now drifting:
          a slow, infinite horizontal loop rather than a still line. Scale
          and speed are inversely tied — the bigger the type, the slower it
          moves, which is why this runs at a third of the ambient ribbons'
          pace. Fast motion at this size would read as a ticker; slow motion
          reads as a held, ambient presence, which is the point of it sitting
          behind everything else. Ambient, decorative, aria-hidden via
          <Marquee> itself — the accessible name is already carried by the
          lockup above and the copyright line below. */}
      <div className="overflow-hidden pb-2">
        <Marquee
          items={["Graviti Hill"]}
          speed={70}
          itemClassName="type-display select-none text-[4rem] leading-none text-white/6 sm:text-[7rem] md:text-[10rem] lg:text-[12rem]"
        />
      </div>

      <div className="border-t border-rule-dark">
        <div className="shell flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="type-eyebrow text-white/45">
            © {year} {SITE.legalName}. Lagos, Nigeria.
          </p>
          <a
            href={LINKEDIN}
            target="_blank"
            rel="noopener noreferrer"
            className="link-draw type-eyebrow text-white/45"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
