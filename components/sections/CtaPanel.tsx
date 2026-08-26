import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { ScanLine } from "@/components/motion/ScanLine";
import { Spotlight } from "@/components/motion/Spotlight";
import { getSiteSettings, whatsappUrl } from "@/lib/settings";
import { cn } from "@/lib/utils";

/**
 * The closing dark panel. One of the site's three --ridge moments.
 *
 * This is deliberately not a slogan with a button under it. The block *is* the
 * contact information, set at display scale: in this market the phone number
 * converts better than a form, so the number gets the type size that admission
 * implies. The form is offered second, not first.
 *
 * ── `intense` ────────────────────────────────────────────────────────────────
 * Opt-in ambient system layer (cursor spotlight, scan sweep, a growing accent
 * rule on each route row) — used on the closing panel of every secondary
 * route. `intense` defaults to `false` and the home route's call never passes
 * it, so home's CtaPanel renders exactly as it always has; nothing here
 * reaches that route.
 */
export async function CtaPanel({
  eyebrow = "Start",
  heading = "Start a conversation.",
  className,
  intense = false,
}: {
  eyebrow?: string;
  heading?: string;
  className?: string;
  intense?: boolean;
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
    <section
      className={cn(
        "relative bg-ridge py-section text-white",
        intense && "overflow-hidden",
        className,
      )}
    >
      {intense && (
        <>
          <Spotlight tone="dark" className="z-0" />
          <ScanLine tone="dark" duration={8} className="z-0 opacity-25" />
        </>
      )}

      <div className="shell grid-12 relative z-10 gap-y-12">
        <div className="col-span-12 lg:col-span-3">
          <p
            className={cn(
              "type-eyebrow text-accent",
              intense && "flex items-center gap-2.5",
            )}
          >
            {intense && (
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 shrink-0 animate-pulse-dot rounded-full bg-current"
              />
            )}
            {eyebrow}
          </p>
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
                    className={cn(
                      "group flex flex-col gap-1 border-t border-rule-dark py-6 transition-colors duration-200 hover:bg-white/5 sm:flex-row sm:items-baseline sm:gap-8",
                      intense && "relative pl-5 sm:pl-6",
                    )}
                  >
                    <RouteRow {...route} intense={intense} />
                  </a>
                ) : (
                  <Link
                    href={route.href}
                    className={cn(
                      "group flex flex-col gap-1 border-t border-rule-dark py-6 transition-colors duration-200 hover:bg-white/5 sm:flex-row sm:items-baseline sm:gap-8",
                      intense && "relative pl-5 sm:pl-6",
                    )}
                  >
                    <RouteRow {...route} intense={intense} />
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
  intense,
}: {
  label: string;
  value: string;
  note: string;
  intense?: boolean;
}) {
  return (
    <>
      {intense && (
        <span
          aria-hidden="true"
          className="absolute top-1 bottom-1 left-0 w-0.5 origin-center scale-y-0 bg-accent transition-transform duration-300 ease-brand group-hover:scale-y-100"
        />
      )}
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
