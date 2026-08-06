import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { ContactForm } from "@/components/sections/ContactForm";
import { Section } from "@/components/ui/Section";
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

      <Section className="pt-0">
        <div className="shell grid-12 gap-y-20">
          {/* ── The form ────────────────────────────────────────────────── */}
          <div className="col-span-12 lg:col-span-7">
            <h2 className="type-eyebrow text-green">
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
            <h2 className="type-eyebrow text-green">
              02
              <span aria-hidden="true" className="mx-2">
                —
              </span>
              Reach us directly
            </h2>

            {/* WhatsApp carries equal weight to the form, deliberately.
                In this market it converts better, and pretending otherwise
                would be designing for a different country. */}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-8 block border-t border-rule py-7 transition-colors duration-200 hover:bg-canvas-alt"
            >
              <span className="type-eyebrow text-ink-muted">WhatsApp</span>
              <span className="type-display mt-3 block text-h3">
                {PHONES[0].display}
              </span>
              <span className="mt-2 block text-caption text-ink-muted">
                Opens a chat with the message prefilled.
              </span>
            </a>

            <a
              href={`mailto:${EMAIL}`}
              className="group block border-t border-rule py-7 transition-colors duration-200 hover:bg-canvas-alt"
            >
              <span className="type-eyebrow text-ink-muted">Email</span>
              <span className="type-display mt-3 block text-h3 break-words">
                {EMAIL}
              </span>
              <span className="mt-2 block text-caption text-ink-muted">
                For RFPs, tender documents and attachments.
              </span>
            </a>

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
            <div className="border-t border-b border-rule py-7">
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
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
