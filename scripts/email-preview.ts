/**
 * Render the contact-form emails to local HTML, and optionally send them.
 *
 *   npm run email:preview
 *     → writes .email-preview/admin-notification.html and
 *       .email-preview/visitor-confirmation.html (open them in a browser)
 *
 *   npm run email:preview -- --send you@example.com
 *     → checks the SMTP credentials in .env.local, then sends the real pair:
 *       the notification to ADMIN_EMAIL and the confirmation to you@example.com
 *
 * Uses sample enquiry data and the compiled-in NAP from lib/site.ts (the live
 * site reads the admin-editable copy from MongoDB instead).
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { readMailConfig } from "@/lib/email/config";
import {
  renderAdminNotification,
  renderVisitorConfirmation,
  type EnquiryEmailData,
} from "@/lib/email/templates";
import { createReference, sendEnquiryEmails, verifyMailConfig } from "@/lib/mail";
import { LOGO_PNG_BASE64 } from "@/lib/email/logo";
import { ADDRESS, EMAIL, LINKEDIN, PHONES, SITE } from "@/lib/site";

const sendIndex = process.argv.indexOf("--send");
const sendTo = sendIndex > -1 ? process.argv[sendIndex + 1] : undefined;

const data: EnquiryEmailData = {
  input: {
    name: "Adaeze Okafor",
    company: "Northbank Foods Ltd",
    role: "Chief Marketing Officer",
    email: sendTo ?? "adaeze.okafor@example.com",
    phone: "0803 555 0142",
    enquiryType: "Market Expansion",
    budget: "₦20m-₦50m",
    message:
      "We are preparing to take two of our packaged-food lines into Ghana and Côte d'Ivoire in Q2.\n\nWe need help with market entry sequencing, regulatory due diligence and a stakeholder map before we commit to distribution partners. Could we set up a first conversation in the next fortnight?",
    website: "",
  },
  reference: createReference(),
  receivedAt: new Date(),
  settings: { address: ADDRESS, phones: [...PHONES], email: EMAIL, linkedin: LINKEDIN },
  siteUrl: SITE.url,
};

async function main() {
  const outDir = path.join(process.cwd(), ".email-preview");
  await mkdir(outDir, { recursive: true });
  // Browsers cannot resolve cid:, so the preview inlines the logo as a data URI.
  const preview = { ...data, logoSrc: `data:image/png;base64,${LOGO_PNG_BASE64}` };
  for (const [file, email] of [
    ["admin-notification.html", renderAdminNotification(preview)],
    ["visitor-confirmation.html", renderVisitorConfirmation(preview)],
  ] as const) {
    await writeFile(path.join(outDir, file), email.html, "utf8");
    await writeFile(path.join(outDir, file.replace(".html", ".txt")), email.text, "utf8");
    console.log(`wrote .email-preview/${file}  —  "${email.subject}"`);
  }

  if (sendIndex === -1) return;
  if (!sendTo || !sendTo.includes("@")) {
    throw new Error("Usage: npm run email:preview -- --send you@example.com");
  }

  const mail = readMailConfig();
  if (!mail.ok) throw new Error(`Missing in .env.local: ${mail.missing.join(", ")}`);

  const { host, port, user, from, adminRecipients } = mail.config;
  console.log(`\nSMTP ${host}:${port} as ${user}\nFrom ${from}\nAdmin ${adminRecipients.join(", ")}`);
  await verifyMailConfig(mail.config);
  console.log("credentials ok");

  const result = await sendEnquiryEmails(data, mail.config);
  console.log(
    `sent notification to ${adminRecipients.join(", ")}` +
      (result.visitorConfirmationSent
        ? ` and confirmation to ${sendTo} (${data.reference})`
        : ` — confirmation to ${sendTo} FAILED (see error above)`),
  );
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
