import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The opening of every route except home.
 *
 * The h1 renders statically — no mask reveal, no entrance. It is the LCP
 * element on every page, and withholding the paint to animate it would spend
 * the performance budget on the one thing the brief says to protect. Motion
 * starts at the second section.
 *
 * Layout is asymmetric by default: title in columns 1–8, the index block in
 * 10–12, prose never dead-centre.
 */
export function PageHero({
  eyebrow,
  title,
  lede,
  index,
  tone = "light",
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  /** Editorial data for the right margin — label/value pairs, not stat cards. */
  index?: ReadonlyArray<{ label: string; value: string }>;
  tone?: "light" | "dark";
  children?: ReactNode;
}) {
  const dark = tone === "dark";

  return (
    <section
      className={cn(
        "pt-36 pb-20 lg:pt-44 lg:pb-28 2xl:pt-56 2xl:pb-32",
        dark && "bg-ridge text-white",
      )}
    >
      <div className="shell grid-12 gap-y-10">
        <div className="col-span-12 lg:col-span-8">
          <p className={cn("type-eyebrow", dark ? "text-accent" : "text-green")}>
            {eyebrow}
          </p>
          <h1
            className={cn(
              "type-display mt-6 text-h1",
              dark ? "text-white" : "text-ink",
            )}
          >
            {title}
          </h1>
        </div>

        {index && index.length > 0 && (
          <dl className="col-span-12 self-end lg:col-span-3 lg:col-start-10">
            {index.map((item) => (
              <div
                key={item.label}
                className={cn(
                  "flex items-baseline justify-between gap-6 border-t py-3",
                  dark ? "border-rule-dark" : "border-rule",
                )}
              >
                <dt
                  className={cn(
                    "type-eyebrow",
                    dark ? "text-white/45" : "text-ink-muted",
                  )}
                >
                  {item.label}
                </dt>
                <dd className="type-subhead text-body-lg">{item.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {lede && (
          <div className="col-span-12 lg:col-span-7">
            <p
              className={cn(
                "measure text-body-lg",
                dark ? "text-white/75" : "text-ink-muted",
              )}
            >
              {lede}
            </p>
          </div>
        )}

        {children && <div className="col-span-12">{children}</div>}
      </div>
    </section>
  );
}
