import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { ContactForm } from "@/components/sections/ContactForm";
import { Section } from "@/components/ui/Section";
import { HudCorners } from "@/components/motion/HudCorners";
import { Reveal } from "@/components/motion/Reveal";
import { ScanLine } from "@/components/motion/ScanLine";
import { Spotlight } from "@/components/motion/Spotlight";
import { Tilt3D } from "@/components/motion/Tilt3D";
import { getSiteSettings, whatsappUrl } from "@/lib/settings";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Reach Graviti Hill in Victoria Island, Lagos — by WhatsApp, by phone, by email, or with a written brief.",
  path: "/contact",
});

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const ADDRESS = settings.address;
  const EMAIL = settings.email;
  const PHONES = settings.phones;
  const WHATSAPP_URL = whatsappUrl(settings);

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={
          <>
            Start a <span className="accent-word">conversation.</span>
          </>
        }
        lede="Tell us the situation, not the solution you have already decided on. If we are the wrong firm for it, we will say so."
      />

      <Section className="relative overflow-hidden pt-0">
        <Spotlight tone="light" size={700} className="z-0" />
        <ScanLine tone="light" duration={9} className="z-0 opacity-[0.15]" />

        <div className="shell grid-12 relative z-10 gap-y-20">
          {/* ── The form ────────────────────────────────────────────────── */}
          <div className="col-span-12 lg:col-span-7">
            <h2 className="type-eyebrow flex items-center gap-2.5 text-green">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 shrink-0 animate-pulse-dot rounded-full bg-current"
              />
              01
              <span aria-hidden="true" className="mx-2">
                —
              </span>
              Send a brief
            </h2>
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>

          {/* ── The direct routes ───────────────────────────────────────── */}
          <div className="col-span-12 lg:col-span-4 lg:col-start-9">
            <h2 className="type-eyebrow flex items-center gap-2.5 text-green">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 shrink-0 animate-pulse-dot rounded-full bg-current"
              />
              02
              <span aria-hidden="true" className="mx-2">
                —
              </span>
              Reach us directly
            </h2>

            {/* WhatsApp carries equal weight to the form, deliberately.
                In this market it converts better, and pretending otherwise
                would be designing for a different country. */}
            <Tilt3D max={2} scale={1} className="mt-8">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block overflow-hidden border-t border-rule py-7 pl-5 transition-colors duration-200 hover:bg-canvas-alt"
              >
                <span
                  aria-hidden="true"
                  className="absolute top-2 bottom-2 left-0 w-0.5 origin-center scale-y-0 bg-accent transition-transform duration-300 ease-brand group-hover:scale-y-100"
                />
                <span className="type-eyebrow flex items-center gap-2.5 text-ink-muted">
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 shrink-0 animate-pulse-dot rounded-full bg-green"
                  />
                  WhatsApp — fastest route
                </span>
                <span className="type-display mt-3 block text-h3">
                  {PHONES[0].display}
                </span>
                <span className="mt-2 block text-caption text-ink-muted">
                  Opens a chat with the message prefilled.
                </span>
              </a>
            </Tilt3D>

            <Tilt3D max={2} scale={1}>
              <a
                href={`mailto:${EMAIL}`}
                className="group relative block overflow-hidden border-t border-rule py-7 pl-5 transition-colors duration-200 hover:bg-canvas-alt"
              >
                <span
                  aria-hidden="true"
                  className="absolute top-2 bottom-2 left-0 w-0.5 origin-center scale-y-0 bg-accent transition-transform duration-300 ease-brand group-hover:scale-y-100"
                />
                <span className="type-eyebrow text-ink-muted">Email</span>
                <span className="type-display mt-3 block text-h3 wrap-break-word">
                  {EMAIL}
                </span>
                <span className="mt-2 block text-caption text-ink-muted">
                  For RFPs, tender documents and attachments.
                </span>
              </a>
            </Tilt3D>

            <div className="border-t border-rule py-7">
              <p className="type-eyebrow text-ink-muted">Telephone</p>
              <ul className="mt-3 space-y-2">
                {PHONES.map((phone) => (
                  <li key={phone.e164}>
                    <a
                      href={`tel:${phone.e164}`}
                      className="link-draw type-subhead text-body-lg"
                    >
                      {phone.display}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Map-free location block — an embedded map is a third-party
                script and an iframe on a page that needs neither. */}
            <Reveal
              as="div"
              className="relative border-t border-b border-rule py-7 pl-5"
            >
              <HudCorners tone="light" size={14} />
              <p className="type-eyebrow text-ink-muted">Office</p>
              <address className="mt-3 text-body-lg">
                2nd Floor, Megamound Head Office
                <br />
                Muri Okunola Extension
                <br />
                {ADDRESS.locality}
                <br />
                {ADDRESS.region}, {ADDRESS.country}
              </address>
              <p className="mt-5 text-caption text-ink-muted">
                Visits by appointment. Ask for the practice lead named in your
                correspondence at reception.
              </p>
            </Reveal>
          </div>
        </div>
      </Section>
    </>
  );
}
