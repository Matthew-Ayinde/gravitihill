"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  BUDGET_RANGES,
  ENQUIRY_TYPES,
  contactSchema,
  normaliseContactInput,
  type ContactInput,
} from "@/lib/contact-schema";
import { cn } from "@/lib/utils";

/**
 * The enquiry form.
 *
 * · The same Zod schema validates here and in the route handler — the client
 *   check is a courtesy, the server check is the boundary.
 * · Errors are written in the interface voice: specific, no apology, no
 *   exclamation. They live inline, tied to the field with aria-describedby.
 * · Status is an inline state change with aria-live. No toast library; a toast
 *   would be a dependency and a disappearing message for a form submission the
 *   user needs a record of.
 * · `website` is a honeypot — off-screen, tab-skipped, autocomplete off.
 */

type Status =
  | { state: "idle" }
  | { state: "pending" }
  | { state: "success" }
  | { state: "error"; message: string };

const EMPTY: ContactInput = {
  name: "",
  company: "",
  role: "",
  email: "",
  phone: "",
  enquiryType: "General",
  budget: "",
  message: "",
  website: "",
};

export function ContactForm() {
  const formId = useId();
  const [values, setValues] = useState<ContactInput>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>({ state: "idle" });

  const field = <K extends keyof ContactInput>(key: K, value: ContactInput[K]) => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key as string];
      return next;
    });
  };

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsed = contactSchema.safeParse(normaliseContactInput(values));
    if (!parsed.success) {
      const nextErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0]);
        nextErrors[key] ??= issue.message;
      }
      setErrors(nextErrors);
      setStatus({
        state: "error",
        message: "Check the highlighted fields and send again.",
      });
      return;
    }

    setStatus({ state: "pending" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as {
          message?: string;
        } | null;
        setStatus({
          state: "error",
          message:
            body?.message ??
            "That did not send. Try again, or reach us on WhatsApp.",
        });
        return;
      }

      setValues(EMPTY);
      setErrors({});
      setStatus({ state: "success" });
    } catch {
      setStatus({
        state: "error",
        message: "That did not send. Try again, or reach us on WhatsApp.",
      });
    }
  }

  if (status.state === "success") {
    return (
      <div
        className="border-t border-rule pt-10"
        role="status"
        aria-live="polite"
      >
        <p className="type-eyebrow text-green">Received</p>
        <p className="type-display mt-5 max-w-[18ch] text-h2">
          Your brief is with us.
        </p>
        <p className="measure mt-6 text-body-lg text-ink-muted">
          An acknowledgement is on its way to your inbox. A practice lead will
          reply directly — usually within one working day. If it is urgent,
          WhatsApp is faster.
        </p>
        <Button
          type="button"
          variant="secondary"
          className="mt-8"
          onClick={() => setStatus({ state: "idle" })}
        >
          Send another
        </Button>
      </div>
    );
  }

  const pending = status.state === "pending";

  return (
    <form onSubmit={onSubmit} noValidate className="border-t border-rule pt-10">
      {/* Honeypot. Never rendered to sighted users, never focusable. */}
      <div aria-hidden="true" className="absolute h-px w-px overflow-hidden opacity-0">
        <label htmlFor={`${formId}-website`}>Leave this field empty</label>
        <input
          id={`${formId}-website`}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={(e) => field("website", e.target.value)}
        />
      </div>

      <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
        <Field
          id={`${formId}-name`}
          label="Full name"
          value={values.name}
          error={errors.name}
          autoComplete="name"
          onChange={(v) => field("name", v)}
        />
        <Field
          id={`${formId}-company`}
          label="Company"
          value={values.company}
          error={errors.company}
          autoComplete="organization"
          onChange={(v) => field("company", v)}
        />
        <Field
          id={`${formId}-role`}
          label="Role"
          value={values.role}
          error={errors.role}
          autoComplete="organization-title"
          onChange={(v) => field("role", v)}
        />
        <Field
          id={`${formId}-email`}
          label="Work email"
          type="email"
          value={values.email}
          error={errors.email}
          autoComplete="email"
          onChange={(v) => field("email", v)}
        />
        <Field
          id={`${formId}-phone`}
          label="Phone"
          optional
          type="tel"
          value={values.phone ?? ""}
          error={errors.phone}
          autoComplete="tel"
          onChange={(v) => field("phone", v)}
        />
        <SelectField
          id={`${formId}-enquiry`}
          label="Enquiry type"
          value={values.enquiryType}
          error={errors.enquiryType}
          options={ENQUIRY_TYPES}
          onChange={(v) =>
            field("enquiryType", v as ContactInput["enquiryType"])
          }
        />
        <SelectField
          id={`${formId}-budget`}
          label="Budget range"
          optional
          value={values.budget ?? ""}
          error={errors.budget}
          options={BUDGET_RANGES}
          placeholder="Prefer not to say"
          onChange={(v) => field("budget", v as ContactInput["budget"])}
        />
      </div>

      <div className="mt-7">
        <Field
          id={`${formId}-message`}
          label="What are you trying to solve?"
          multiline
          value={values.message}
          error={errors.message}
          onChange={(v) => field("message", v)}
        />
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-6">
        <Button type="submit" disabled={pending}>
          {pending ? "Sending…" : "Send enquiry"}
        </Button>

        <p
          aria-live="polite"
          className={cn(
            "text-caption",
            status.state === "error" ? "text-ink" : "text-ink-muted",
          )}
        >
          {status.state === "error"
            ? status.message
            : pending
              ? "Sending your brief…"
              : "We reply within one working day."}
        </p>
      </div>
    </form>
  );
}

/* ── Field primitives ─────────────────────────────────────────────────────── */

const CONTROL =
  "mt-2 w-full rounded-sm border bg-canvas px-4 py-3 text-body text-ink " +
  "transition-colors duration-200 placeholder:text-ink-muted";

function Field({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  optional = false,
  multiline = false,
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  optional?: boolean;
  multiline?: boolean;
  autoComplete?: string;
}) {
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className="type-eyebrow text-ink-muted">
        {label}
        {optional && <span className="ml-2 text-ink-muted/70">Optional</span>}
      </label>

      {multiline ? (
        <textarea
          id={id}
          rows={6}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(CONTROL, error ? "border-green" : "border-rule")}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(CONTROL, error ? "border-green" : "border-rule")}
        />
      )}

      {error && (
        <p id={errorId} className="mt-2 text-caption text-green">
          {error}
        </p>
      )}
    </div>
  );
}

function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  error,
  optional = false,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  error?: string;
  optional?: boolean;
  placeholder?: string;
}) {
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className="type-eyebrow text-ink-muted">
        {label}
        {optional && <span className="ml-2 text-ink-muted/70">Optional</span>}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(CONTROL, error ? "border-green" : "border-rule")}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error && (
        <p id={errorId} className="mt-2 text-caption text-green">
          {error}
        </p>
      )}
    </div>
  );
}
