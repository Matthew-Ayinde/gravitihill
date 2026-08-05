import nodemailer from "nodemailer";
import type { ContactInput } from "@/lib/contact-schema";
import { ADDRESS, EMAIL, PHONES, SITE } from "@/lib/site";

/**
 * SMTP transport and the two messages the contact route sends: an internal
 * notification and a plain-text acknowledgement to the sender.
 *
 * Credentials come from the environment (see README §Environment). Nothing
 * here is imported by a client component — the transport is server-only.
 */

const required = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "CONTACT_TO"] as const;

export function mailConfigured(): boolean {
  return required.every((key) => Boolean(process.env[key]));
}

function transport() {
  const port = Number(process.env.SMTP_PORT);
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    // 465 is implicit TLS; everything else negotiates STARTTLS.
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

function line(label: string, value: string) {
  return `${label.padEnd(14)}${value}`;
}

export async function sendContactEmails(input: ContactInput): Promise<void> {
  const from = `"${SITE.name} Website" <${process.env.SMTP_USER}>`;
  const mailer = transport();

  const internalBody = [
    "New enquiry from gravitihill.com",
    "",
    line("Name", input.name),
    line("Company", input.company),
    line("Role", input.role),
    line("Email", input.email),
    line("Phone", input.phone || "—"),
    line("Enquiry", input.enquiryType),
    line("Budget", input.budget || "—"),
    "",
    "Message",
    "-------",
    input.message,
    "",
    `Received ${new Date().toISOString()}`,
  ].join("\n");

  const acknowledgement = [
    `${input.name},`,
    "",
    "Thank you — your enquiry has reached Graviti Hill.",
    "",
    `You told us this concerns ${input.enquiryType.toLowerCase()}. A practice lead will read it and reply directly, usually within one working day.`,
    "",
    "If it is urgent, WhatsApp is faster:",
    `  ${PHONES[0].display}`,
    "",
    "Graviti Hill Limited",
    `${ADDRESS.street}`,
    `${ADDRESS.locality}, ${ADDRESS.region}, ${ADDRESS.country}`,
    EMAIL,
  ].join("\n");

  await mailer.sendMail({
    from,
    to: process.env.CONTACT_TO,
    replyTo: `"${input.name}" <${input.email}>`,
    subject: `Enquiry — ${input.enquiryType} — ${input.company}`,
    text: internalBody,
  });

  await mailer.sendMail({
    from,
    to: input.email,
    subject: "We have your enquiry — Graviti Hill",
    text: acknowledgement,
  });
}
