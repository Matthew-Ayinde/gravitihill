import Image from "next/image";
import type { Img } from "@/lib/schemas";

/**
 * Client logo wall.
 *
 * Renders nothing at all when the array is empty. An empty logo wall — grey
 * boxes, "your logo here", a row of placeholder rectangles — is worse than no
 * logo wall, and the brief is explicit that the site must be complete with zero
 * client logos present. So the section removes itself.
 *
 * No client logos have been verified for use, so this currently renders null
 * everywhere it is called.
 */
export function LogoWall({
  logos = [],
  label = "Selected clients",
}: {
  logos?: Img[];
  label?: string;
}) {
  if (logos.length === 0) return null;

  return (
    <section className="py-section" aria-label={label}>
      <div className="shell">
        <h2 className="type-eyebrow text-ink-muted">{label}</h2>
        <ul className="mt-10 grid grid-cols-2 gap-px border border-rule bg-rule sm:grid-cols-3 lg:grid-cols-5">
          {logos.map((logo) => (
            <li
              key={logo.src}
              className="flex items-center justify-center bg-canvas px-8 py-10"
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={140}
                height={44}
                className="h-8 w-auto object-contain"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
