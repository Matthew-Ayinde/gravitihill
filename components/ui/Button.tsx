import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Two button styles. There is no third.
 *
 *   primary   — --green fill, white label. Inverts on dark panels to white fill
 *               with a --green label.
 *   secondary — hairline outline only.
 *
 * --accent is never a button fill. Hover shifts fill luminance by ~6%; nothing
 * lifts, nothing casts a shadow.
 */

type Tone = "light" | "dark";
type Variant = "primary" | "secondary";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-sm px-6 py-3.5 " +
  "type-subhead text-[0.9375rem] leading-none transition-colors duration-200 " +
  "ease-brand";

const STYLES: Record<Tone, Record<Variant, string>> = {
  light: {
    primary: "bg-green text-white hover:bg-[#1a5512]",
    secondary: "border border-rule text-ink hover:bg-canvas-alt",
  },
  dark: {
    primary: "bg-white text-green hover:bg-[#eeeeec]",
    secondary: "border border-rule-dark text-white hover:bg-white/8",
  },
};

type Props = {
  children: ReactNode;
  variant?: Variant;
  tone?: Tone;
  className?: string;
};

export function ButtonLink({
  children,
  href,
  variant = "primary",
  tone = "light",
  className,
  ...rest
}: Props & ComponentProps<typeof Link>) {
  return (
    <Link
      href={href}
      className={cn(BASE, STYLES[tone][variant], className)}
      {...rest}
    >
      {children}
    </Link>
  );
}

export function Button({
  children,
  variant = "primary",
  tone = "light",
  className,
  ...rest
}: Props & ComponentProps<"button">) {
  return (
    <button
      className={cn(BASE, STYLES[tone][variant], className, "disabled:opacity-50")}
      {...rest}
    >
      {children}
    </button>
  );
}
