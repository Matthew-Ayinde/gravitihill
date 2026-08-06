import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/**
 * Admin form field primitives. Same design language as the public site —
 * type-eyebrow labels, hairline borders, 4px radius, no shadows — but this
 * is a tool, not a marketing surface, so there's no motion here.
 */

const INPUT_BASE =
  "w-full border border-rule bg-canvas px-4 py-3 text-body text-ink " +
  "placeholder:text-ink-muted/60 focus-visible:border-green";

export function Label({
  children,
  htmlFor,
  hint,
}: {
  children: React.ReactNode;
  htmlFor?: string;
  hint?: string;
}) {
  return (
    <div className="mb-2 flex items-baseline justify-between gap-4">
      <label htmlFor={htmlFor} className="type-eyebrow text-ink-muted">
        {children}
      </label>
      {hint ? <span className="text-caption text-ink-muted/70">{hint}</span> : null}
    </div>
  );
}

export function TextField({
  label,
  name,
  hint,
  className,
  ...rest
}: {
  label: string;
  name: string;
  hint?: string;
  className?: string;
} & Omit<ComponentProps<"input">, "name" | "className">) {
  return (
    <div className={className}>
      <Label htmlFor={name} hint={hint}>
        {label}
      </Label>
      <input id={name} name={name} className={cn(INPUT_BASE, "rounded-sm")} {...rest} />
    </div>
  );
}

export function TextAreaField({
  label,
  name,
  hint,
  rows = 4,
  className,
  ...rest
}: {
  label: string;
  name: string;
  hint?: string;
  className?: string;
} & Omit<ComponentProps<"textarea">, "name" | "className">) {
  return (
    <div className={className}>
      <Label htmlFor={name} hint={hint}>
        {label}
      </Label>
      <textarea
        id={name}
        name={name}
        rows={rows}
        className={cn(INPUT_BASE, "rounded-sm resize-y")}
        {...rest}
      />
    </div>
  );
}

export function SelectField({
  label,
  name,
  hint,
  children,
  className,
  ...rest
}: {
  label: string;
  name: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
} & Omit<ComponentProps<"select">, "name" | "className">) {
  return (
    <div className={className}>
      <Label htmlFor={name} hint={hint}>
        {label}
      </Label>
      <select id={name} name={name} className={cn(INPUT_BASE, "rounded-sm")} {...rest}>
        {children}
      </select>
    </div>
  );
}

export function CheckboxField({
  label,
  name,
  ...rest
}: { label: string; name: string } & Omit<ComponentProps<"input">, "name" | "type">) {
  return (
    <label htmlFor={name} className="flex items-center gap-3">
      <input
        id={name}
        name={name}
        type="checkbox"
        className="h-4 w-4 rounded-sm border border-rule accent-green"
        {...rest}
      />
      <span className="type-eyebrow text-ink-muted">{label}</span>
    </label>
  );
}

export function FieldGroup({
  legend,
  children,
  className,
}: {
  legend: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <fieldset className={cn("border-t border-rule pt-8", className)}>
      <legend className="type-subhead mb-6 text-h3">{legend}</legend>
      {children}
    </fieldset>
  );
}
