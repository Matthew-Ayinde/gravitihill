import { randomInt } from "node:crypto";
import nodemailer from "nodemailer";
import type { MailConfig } from "@/lib/email/config";
import { LOGO_CID, LOGO_PNG_BASE64 } from "@/lib/email/logo";
import {
  headerSafe,
  renderAdminNotification,
  renderVisitorConfirmation,
  type EnquiryEmailData,
} from "@/lib/email/templates";

/**
 * Sends the two contact-form emails over SMTP (Gmail by default — see
 * lib/email/config.ts for the env keys).
 *
 * Order and failure policy:
 * 1. Internal notification — critical. If it fails, this throws and the
 *    route reports a failed send (the enquiry is still in Mongo).
 * 2. Visitor confirmation — best-effort. The firm already has the enquiry, so
 *    a failed acknowledgement is logged, not surfaced; telling the visitor
 *    "that did not send" would invite a duplicate submission.
 *
 * Server-only: nothing here is imported by a client component.
 */

function createTransport(config: MailConfig) {
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    // On 587, refuse to send credentials over an un-upgraded connection.
    requireTLS: !config.secure,
    auth: { user: config.user, pass: config.pass },
    // A slow relay must not hold the visitor's request open indefinitely.
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });
}

/** `GH-` + 6 chars from an alphabet with no 0/O or 1/I/L to misread. */
export function createReference(): string {
  const alphabet = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
  let ref = "";
  for (let i = 0; i < 6; i += 1) ref += alphabet[randomInt(alphabet.length)];
  return `GH-${ref}`;
}

/** The lockup travels inline, so it renders whatever domain the site is on. */
const logoAttachment = () => ({
  filename: "graviti-hill.png",
  content: Buffer.from(LOGO_PNG_BASE64, "base64"),
  contentType: "image/png",
  cid: LOGO_CID,
  contentDisposition: "inline" as const,
});

export type SendResult = { visitorConfirmationSent: boolean };

export async function sendEnquiryEmails(
  data: EnquiryEmailData,
  config: MailConfig,
): Promise<SendResult> {
  const transport = createTransport(config);
  try {
    return await send(transport, data, config);
  } finally {
    transport.close();
  }
}

async function send(
  transport: ReturnType<typeof createTransport>,
  data: EnquiryEmailData,
  config: MailConfig,
): Promise<SendResult> {
  const { input, reference, settings } = data;

  const admin = renderAdminNotification(data);
  await transport.sendMail({
    from: config.from,
    to: config.adminRecipients,
    // Reply goes to the visitor, not back to the sending mailbox.
    replyTo: { name: headerSafe(input.name), address: input.email },
    subject: admin.subject,
    html: admin.html,
    text: admin.text,
    attachments: [logoAttachment()],
    headers: { "X-Enquiry-Reference": reference },
  });

  const visitor = renderVisitorConfirmation(data);
  try {
    await transport.sendMail({
      from: config.from,
      to: { name: headerSafe(input.name), address: input.email },
      // Replies land in the firm's public inbox (admin-editable), falling
      // back to the notification inbox.
      replyTo: settings.email || config.adminRecipients[0],
      subject: visitor.subject,
      html: visitor.html,
      text: visitor.text,
      attachments: [logoAttachment()],
      headers: {
        "X-Enquiry-Reference": reference,
        // Transactional acknowledgement: discourage vacation auto-replies.
        "Auto-Submitted": "auto-replied",
      },
    });
    return { visitorConfirmationSent: true };
  } catch (error) {
    console.error(`[contact] ${reference}: confirmation to sender failed`, error);
    return { visitorConfirmationSent: false };
  }
}

/** Opens and authenticates an SMTP session without sending. For diagnostics. */
export async function verifyMailConfig(config: MailConfig): Promise<void> {
  const transport = createTransport(config);
  try {
    await transport.verify();
  } finally {
    transport.close();
  }
}
