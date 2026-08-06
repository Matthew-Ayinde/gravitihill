import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { getSiteSettings, whatsappUrl } from "@/lib/settings";
import { cn } from "@/lib/utils";

/**
 * The closing dark panel. One of the site's three --ridge moments.
 *
 * This is deliberately not a slogan with a button under it. The block *is* the
 * contact information, set at display scale: in this market the phone number
 * converts better than a form, so the number gets the type size that admission
 * implies. The form is offered second, not first.
 */
export async function CtaPanel({
  eyebrow = "Start",
  heading = "Start a conversation.",
  className,
}: {
  eyebrow?: string;
  heading?: string;
  className?: string;
}) {
  const settings = await getSiteSettings();
  const primary = settings.phones[0];

  const routes = [
    {
      label: "WhatsApp",
      value: primary.display,
      href: whatsappUrl(settings),
      external: true,
      note: "Fastest route. Message prefilled.",
    },
    {
      label: "Email",
      value: settings.email,
      href: `mailto:${settings.email}`,
      external: true,
      note: "For briefs, RFPs and documents.",
    },
    {
      label: "Enquiry form",
      value: "Send a brief",
      href: "/contact",
      external: false,
      note: "Routed to the relevant practice lead.",
    },
  ];

  return (
    <section className={cn("bg-ridge py-section text-white", className)}>
      <div className="shell grid-12 gap-y-12">
        <div className="col-span-12 lg:col-span-3">
          <p className="type-eyebrow text-accent">{eyebrow}</p>
        </div>

        <div className="col-span-12 lg:col-span-9">
          <Reveal as="h2" className="type-display max-w-[16ch] text-h2 text-white">
            {heading}
          </Reveal>

          <ul className="mt-14">
            {routes.map((route) => (
              <li key={route.label}>
                {route.external ? (
                  <a
                    href={route.href}
                    target={route.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      route.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="group flex flex-col gap-1 border-t border-rule-dark py-6 transition-colors duration-200 hover:bg-white/5 sm:flex-row sm:items-baseline sm:gap-8"
                  >
                    <RouteRow {...route} />
                  </a>
                ) : (
                  <Link
                    href={route.href}
                    className="group flex flex-col gap-1 border-t border-rule-dark py-6 transition-colors duration-200 hover:bg-white/5 sm:flex-row sm:items-baseline sm:gap-8"
                  >
                    <RouteRow {...route} />
                  </Link>
                )}
              </li>
            ))}
          </ul>

          <address className="mt-10 text-white/55">
            {settings.address.street}, {settings.address.locality}, {settings.address.region},{" "}
            {settings.address.country}
          </address>
        </div>
      </div>
    </section>
  );
}

function RouteRow({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <>
      <span className="type-eyebrow w-32 shrink-0 text-white/45">{label}</span>
      <span className="type-display flex-1 text-h3 text-white">{value}</span>
      <span className="text-caption text-white/45">{note}</span>
      <span
        aria-hidden="true"
        className="type-subhead hidden text-white/45 transition-transform duration-200 ease-brand group-hover:translate-x-1 sm:block"
      >
        →
      </span>
    </>
  );
}
