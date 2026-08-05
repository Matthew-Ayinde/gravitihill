import Link from "next/link";
import { Lockup } from "@/components/ui/Lockup";
import {
  ADDRESS,
  EMAIL,
  FOOTER_NAV,
  LINKEDIN,
  PHONES,
  SITE,
} from "@/lib/site";

/**
 * Dark footer on --ridge with the white-wordmark lockup.
 *
 * The address block here is the NAP of record — it, the contact page and the
 * JSON-LD all read the same constants, so local SEO never sees a variant.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ridge text-white">
      <div className="shell py-20">
        <div className="grid-12 gap-y-14">
          <div className="col-span-12 lg:col-span-4">
            <Lockup variant="white" />
            <p className="type-display mt-8 max-w-[14ch] text-h3 text-white">
              Re-definers of Brand&nbsp;Building.
            </p>
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
