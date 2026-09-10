import Link from "next/link";
import { InkScrub } from "@/components/motion/InkScrub";
import { RollText } from "@/components/ui/RollText";
import { getSiteSettings, whatsappUrl } from "@/lib/settings";

/**
 * /insights — the close.
 *
 * Not the shared dark <CtaPanel> every other route ends on: this page ends on
 * a light surface with an invitation specific to reading, then hands straight
 * to the footer. The statement inks in as it is read (<InkScrub>); the two
 * direct routes roll over on hover (<RollText>). The enquiry form is offered
 * as a sentence, not a third tile, because a reply to an article is rarely a
 * brief.
 */
export async function InsightsReply() {
  const settings = await getSiteSettings();
  const primary = settings.phones.find((phone) => phone.whatsapp) ?? settings.phones[0];

  const routes = [
    {
      label: "Email",
      value: settings.email,
      href: `mailto:${settings.email}?subject=${encodeURIComponent("Reply to a Graviti Hill insight")}`,
      external: false,
    },
    ...(primary
      ? [{ label: "WhatsApp", value: primary.display, href: whatsappUrl(settings), external: true }]
      : []),
  ];

  return (
    <section aria-labelledby="reply-heading" className="bg-canvas py-section">
      <div className="shell grid-12 gap-y-10">
        <p className="type-eyebrow col-span-12 text-green lg:col-span-3 lg:pt-5">Reply</p>

        <div className="col-span-12 lg:col-span-9">
          <InkScrub
            as="h2"
            id="reply-heading"
            className="type-display max-w-[20ch] text-h1 text-ink-display"
            segments={[
              { text: "Think one of these gets your market wrong? " },
              { text: "Tell us where.", className: "text-green" },
            ]}
          />

          <ul className="mt-14 grid gap-x-10 gap-y-2 sm:grid-cols-2 lg:mt-20">
            {routes.map((route) => (
              <li key={route.label}>
                <a
                  href={route.href}
                  {...(route.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="reply-route group relative block border-t border-rule pt-6 pb-8"
                >
                  <span
                    aria-hidden="true"
                    className="reply-rule absolute inset-x-0 -top-px h-0.5 bg-green"
                  />
                  <span className="type-eyebrow flex items-center justify-between text-ink-muted">
                    {route.label}
                    <span aria-hidden="true" className="reply-arrow text-body-lg text-green">
                      ↗
                    </span>
                  </span>
                  <RollText className="type-display mt-5 text-h3 text-ink-display">
                    {route.value}
                  </RollText>
                </a>
              </li>
            ))}
          </ul>

          <p className="mt-10 text-ink-muted">
            Sending a full brief instead?{" "}
            <Link href="/contact" className="link-draw text-ink">
              Use the enquiry form
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
