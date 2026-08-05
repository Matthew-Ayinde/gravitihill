import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * THE ONLY PLACE THE BRAND MARK IS ALLOWED TO RENDER.
 *
 * The Graviti Hill mark may appear as an approved lockup and nothing else. Its
 * wave/hill curves are never extracted into dividers, backgrounds, watermarks,
 * scroll motifs, loaders or textures; never recoloured, stretched, skewed,
 * rotated, animated, masked or parallaxed; never below 120px wide.
 *
 * Approved lockups: black on light, white on dark, green (#206616) alternate
 * on light. Clear space equal to the mark's cap-height on all four sides is
 * applied here as padding so callers cannot crowd it.
 *
 * ── Asset status ────────────────────────────────────────────────────────────
 * The supplied brand SVGs are not in the repo yet. Until they are, this renders
 * a typographic wordmark — pure type, no invented approximation of the mark,
 * because a drawn stand-in would itself breach the rule above.
 *
 * To install the real lockup:
 *   1. drop lockup-black.svg / lockup-white.svg / lockup-green.svg
 *      into public/brand/
 *   2. flip LOCKUP_ASSET_PRESENT to true
 * No other change is needed anywhere in the codebase.
 */
const LOCKUP_ASSET_PRESENT = false;

type Variant = "black" | "white" | "green";

const VARIANT_CLASS: Record<Variant, string> = {
  black: "text-ink",
  white: "text-white",
  green: "text-green",
};

export function Lockup({
  variant = "black",
  className,
  href = "/",
  label = "Graviti Hill — home",
}: {
  variant?: Variant;
  className?: string;
  /** Pass null to render the lockup without wrapping it in a link. */
  href?: string | null;
  label?: string;
}) {
  const mark = LOCKUP_ASSET_PRESENT ? (
    // eslint-disable-next-line @next/next/no-img-element -- fixed-size inline brand asset, no optimisation needed
    <img
      src={`/brand/lockup-${variant}.svg`}
      alt="Graviti Hill"
      width={160}
      height={32}
      className="block h-auto w-[160px] min-w-[120px]"
    />
  ) : (
    <span
      className={cn(
        "type-subhead block min-w-[120px] text-[1.0625rem] leading-none uppercase",
        VARIANT_CLASS[variant],
      )}
      style={{ letterSpacing: "0.06em" }}
    >
      Graviti&nbsp;Hill
    </span>
  );

  // Clear space = the mark's cap-height on all four sides.
  const framed = <span className="block p-[0.55em]">{mark}</span>;

  if (href === null) return <span className={className}>{framed}</span>;

  return (
    <Link href={href} aria-label={label} className={cn("-m-[0.55em] inline-block", className)}>
      {framed}
    </Link>
  );
}
