import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * THE ONLY PLACE THE BRAND MARK IS ALLOWED TO RENDER.
 *
 * The Graviti Hill mark appears as an approved lockup and nothing else. Its
 * wave/hill curves are never extracted into dividers, backgrounds, watermarks,
 * scroll motifs, loaders or textures; never recoloured, stretched, skewed,
 * rotated, animated, masked or parallaxed; never below 120px wide.
 *
 * ── The three approved lockups ──────────────────────────────────────────────
 * Built from the supplied master artwork. In every variant the *mark* is the
 * original, untouched: only the wordmark changes colour, which is what the
 * guideline permits.
 *
 *   black — wordmark #0B0B0B, for light backgrounds
 *   white — wordmark #FFFFFF, for dark backgrounds
 *   green — wordmark as supplied (#206616 family), alternate on light
 *
 * ── Geometry (measured from the master, not guessed) ────────────────────────
 * The supplied file is raster artwork, so these are derived from the actual
 * pixel bounds of the trimmed lockup:
 *
 *   ASPECT     2.1321 : 1  (w : h)
 *   CAP_RATIO  0.245       cap-height as a fraction of total lockup height
 *
 * Clear space equal to the cap-height is applied as padding on all four sides,
 * so no caller can crowd the mark. A compensating negative margin cancels it
 * for layout, so the lockup still optically aligns to the grid — the clear
 * space protects against neighbours without pushing the logo off the column.
 *
 * ── If a vector master arrives ──────────────────────────────────────────────
 * The supplied PDF wraps a 1500px bitmap, not vector paths, so these are WebP.
 * Drop SVGs in at the same paths and change SRC below; nothing else moves.
 */

const ASPECT = 2.1321;
const CAP_RATIO = 0.245;
const MIN_WIDTH = 120;

type Variant = "black" | "white" | "green";

const SRC: Record<Variant, string> = {
  black: "/brand/lockup-black.webp",
  white: "/brand/lockup-white.webp",
  green: "/brand/lockup-green.webp",
};

export function Lockup({
  variant = "black",
  width = 124,
  className,
  href = "/",
  label = "Graviti Hill — home",
  priority = false,
}: {
  variant?: Variant;
  /** Rendered width in px. Clamped to the 120px brand minimum. */
  width?: number;
  className?: string;
  /** Pass null to render the lockup without wrapping it in a link. */
  href?: string | null;
  label?: string;
  priority?: boolean;
}) {
  const w = Math.max(MIN_WIDTH, width);
  const h = Math.round(w / ASPECT);
  const clear = Math.round(h * CAP_RATIO);

  const mark = (
    <Image
      src={SRC[variant]}
      alt="Graviti Hill"
      width={w}
      height={h}
      priority={priority}
      sizes={`${w}px`}
      className="block h-auto w-full"
    />
  );

  // Clear space in, layout compensation out.
  const framed = (
    <span className="block" style={{ padding: clear, width: w + clear * 2 }}>
      {mark}
    </span>
  );

  if (href === null) {
    return (
      <span className={cn("inline-block", className)} style={{ margin: -clear }}>
        {framed}
      </span>
    );
  }

  return (
    <Link
      href={href}
      aria-label={label}
      className={cn("inline-block", className)}
      style={{ margin: -clear }}
    >
      {framed}
    </Link>
  );
}
