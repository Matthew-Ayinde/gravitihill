import type { ContactInput } from "@/lib/contact-schema";
import type { Settings } from "@/lib/schemas";
import { SITE } from "@/lib/site";
import { LOGO_CID } from "@/lib/email/logo";

/**
 * The two contact-form emails: the internal notification and the visitor's
 * confirmation. Pure functions — data in, `{ subject, html, text }` out — so
 * they render identically in the route handler and in
 * `npm run email:preview`.
 *
 * Built by hand rather than with an email framework: two templates do not
 * justify a dependency, and table-based markup with inline styles is still the
 * only thing Outlook desktop renders faithfully.
 *
 * Brand rules carried into the inbox:
 * · The approved black lockup (PNG — Outlook does not render WebP), ≥120px
 *   wide, with clear space. No derived wave graphics.
 * · 70/20/10: neutral surfaces, --green for emphasis and the primary button,
 *   --accent only as a short hairline marker — never type, never a fill.
 * · Editorial hairlines, eyebrow labels, no shadows, no gradients, no emoji.
 *
 * Every visitor-supplied string passes through `esc()` before it touches
 * HTML. Nothing here trusts the form.
 */

export type EnquiryEmailData = {
  input: ContactInput;
  /** Short human reference shared by both emails, e.g. GH-7K2Q9M. */
  reference: string;
  receivedAt: Date;
  /** Live, admin-editable NAP — not the compiled-in constants. */
  settings: Settings;
  /** Absolute origin for links (site, admin inbox). */
  siteUrl: string;
  /**
   * Logo `src`. Defaults to the inline CID attachment that lib/mail.ts sends;
   * the preview script passes a data URI so a browser can show it.
   */
  logoSrc?: string;
};

export type RenderedEmail = { subject: string; html: string; text: string };

/* ── Tokens (mirrors app/globals.css; email clients cannot read CSS vars) ── */

const C = {
  canvas: "#FDFDFC",
  canvasAlt: "#EDECED",
  ink: "#0B0B0B",
  inkMuted: "#5A5F5A",
  green: "#206616",
  ridge: "#0D2A0B",
  accent: "#8ABF4D",
  white: "#FFFFFF",
  // --rule (ink @ 12%) flattened onto --canvas: Outlook ignores rgba borders.
  rule: "#E1E1E0",
  // --rule-dark flattened onto --ridge.
  ruleDark: "#334A31",
  // Secondary type on --ridge; 7.4:1 against it.
  onRidgeMuted: "#B4C2B2",
} as const;

const FONT_BODY = "'Archivo', 'Helvetica Neue', Helvetica, Arial, sans-serif";
// font-stretch reaches the Archivo width axis where the webfont loads (Apple
// Mail, iOS); elsewhere Arial Narrow carries the condensed display voice.
const FONT_DISPLAY = "'Archivo', 'Arial Narrow', 'Helvetica Neue', Arial, sans-serif";

/* ── Primitives ──────────────────────────────────────────────────────────── */

export function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Escaped, with line breaks kept — Outlook ignores `white-space: pre-wrap`. */
const escMultiline = (value: string) => esc(value).replace(/\r?\n/g, "<br>");

/** Header values must never carry a line break (header injection). */
export const headerSafe = (value: string) => value.replace(/[\r\n]+/g, " ").trim();

const firstName = (name: string) => name.trim().split(/\s+/)[0] ?? name;

/** `12 / 11 / 26 · 18:40 WAT` — the site's editorial date, in Lagos time. */
function lagosStamp(date: Date): string {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Africa/Lagos",
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(date)
      .map((p) => [p.type, p.value]),
  );
  return `${parts.day} / ${parts.month} / ${parts.year} · ${parts.hour}:${parts.minute} WAT`;
}

/**
 * Digits for a wa.me link. Nigerian local numbers (0802…) become 234802…;
 * anything already international keeps its digits.
 */
function whatsappDigits(phone: string): string | null {
  const trimmed = phone.trim();
  const digits = trimmed.replace(/\D/g, "");
  if (digits.length < 7) return null;
  if (trimmed.startsWith("+")) return digits;
  if (digits.startsWith("00")) return digits.slice(2);
  if (digits.startsWith("0") && digits.length === 11) return `234${digits.slice(1)}`;
  return digits;
}

const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

function eyebrow(label: string, color: string = C.green): string {
  return `<p style="margin:0;font-family:${FONT_BODY};font-size:11px;line-height:16px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:${color};">${label}</p>`;
}

/** The accent's one job in the inbox: a short marker above the headline. */
const accentMarker = `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td width="32" height="2" style="width:32px;height:2px;line-height:2px;font-size:0;background-color:${C.accent};">&nbsp;</td></tr></table>`;

function headline(html: string): string {
  return `<h1 style="margin:0;font-family:${FONT_DISPLAY};font-stretch:72%;font-size:34px;line-height:36px;font-weight:700;letter-spacing:-0.02em;color:${C.ink};">${html}</h1>`;
}

function paragraph(html: string, color: string = C.ink): string {
  return `<p style="margin:0;font-family:${FONT_BODY};font-size:15px;line-height:24px;color:${color};">${html}</p>`;
}

function spacer(px: number): string {
  return `<tr><td height="${px}" style="height:${px}px;line-height:${px}px;font-size:0;">&nbsp;</td></tr>`;
}

const hairline = `<tr><td style="border-top:1px solid ${C.rule};height:1px;line-height:1px;font-size:0;">&nbsp;</td></tr>`;

/** Primary: --green fill, white label. The only filled button style. */
function primaryButton(label: string, href: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="display:inline-table;"><tr><td bgcolor="${C.green}" style="background-color:${C.green};border-radius:2px;mso-padding-alt:14px 24px;"><a href="${esc(href)}" style="display:inline-block;padding:14px 24px;font-family:${FONT_BODY};font-size:12px;line-height:16px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:${C.white};text-decoration:none;">${label}</a></td></tr></table>`;
}

/** Secondary: hairline outline. */
function secondaryButton(label: string, href: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="display:inline-table;"><tr><td style="border:1px solid ${C.ink};border-radius:2px;mso-padding-alt:13px 23px;"><a href="${esc(href)}" style="display:inline-block;padding:13px 23px;font-family:${FONT_BODY};font-size:12px;line-height:16px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:${C.ink};text-decoration:none;">${label}</a></td></tr></table>`;
}

/** Buttons side by side on desktop; they wrap naturally on narrow screens. */
function buttonRow(buttons: string[]): string {
  return `<div style="font-size:0;line-height:0;">${buttons
    .map(
      (b) =>
        `<div class="btn" style="display:inline-block;vertical-align:top;margin:0 12px 12px 0;">${b}</div>`,
    )
    .join("")}</div>`;
}

/** Label / value rows separated by hairlines — a definition list for email. */
function detailRows(rows: Array<[label: string, valueHtml: string]>): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${rows
    .map(
      ([label, value]) =>
        `<tr><td class="stack" width="150" valign="top" style="width:150px;padding:14px 16px 14px 0;border-top:1px solid ${C.rule};font-family:${FONT_BODY};font-size:11px;line-height:20px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:${C.inkMuted};">${label}</td><td class="stack stack-value" valign="top" style="padding:14px 0;border-top:1px solid ${C.rule};font-family:${FONT_BODY};font-size:15px;line-height:20px;color:${C.ink};word-break:break-word;">${value}</td></tr>`,
    )
    .join("")}<tr><td colspan="2" style="border-top:1px solid ${C.rule};height:1px;line-height:1px;font-size:0;">&nbsp;</td></tr></table>`;
}

/** The visitor's message: a --canvas-alt panel, no border, no shadow. */
function messagePanel(message: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="${C.canvasAlt}" style="background-color:${C.canvasAlt};padding:24px 28px;font-family:${FONT_BODY};font-size:15px;line-height:24px;color:${C.ink};word-break:break-word;">${escMultiline(message)}</td></tr></table>`;
}

const link = (label: string, href: string, color: string = C.ink) =>
  `<a href="${esc(href)}" style="color:${color};text-decoration:underline;text-underline-offset:2px;">${label}</a>`;

/* ── Shell ───────────────────────────────────────────────────────────────── */

function shell({
  title,
  preheader,
  siteUrl,
  logoSrc,
  body,
  footer,
}: {
  title: string;
  preheader: string;
  siteUrl: string;
  logoSrc?: string;
  body: string;
  footer: string;
}): string {
  const logo = logoSrc ?? `cid:${LOGO_CID}`;
  // Pads the preheader so clients do not pull body copy into the preview line.
  const previewPad = "&#8199;&#65279;&#847; ".repeat(60);

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="x-apple-disable-message-reformatting">
<meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${esc(title)}</title>
<!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
<!--[if !mso]><!--><link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..700&display=swap" rel="stylesheet"><!--<![endif]-->
<style>
  :root { color-scheme: light; supported-color-schemes: light; }
  body { margin:0 !important; padding:0 !important; width:100% !important; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
  table { border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; }
  img { border:0; outline:none; text-decoration:none; -ms-interpolation-mode:bicubic; }
  a { color:${C.green}; }
  a[x-apple-data-detectors] { color:inherit !important; text-decoration:none !important; }
  u + #body a { color:inherit; text-decoration:none; }
  @media only screen and (max-width:620px) {
    .container { width:100% !important; }
    .pad { padding-left:24px !important; padding-right:24px !important; }
    .stack { display:block !important; width:100% !important; box-sizing:border-box; padding-right:0 !important; }
    .stack-value { border-top:0 !important; padding-top:0 !important; }
    h1 { font-size:30px !important; line-height:32px !important; }
  }
</style>
<!--[if mso]><style>body, table, td, p, a, h1 { font-family: Arial, Helvetica, sans-serif !important; }</style><![endif]-->
</head>
<body id="body" style="margin:0;padding:0;background-color:${C.canvasAlt};">
<div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">${esc(preheader)}${previewPad}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.canvasAlt}" style="background-color:${C.canvasAlt};">
<tr><td align="center" style="padding:32px 12px;">
<!--[if mso]><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->
<table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;">
  <tr><td bgcolor="${C.canvas}" style="background-color:${C.canvas};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr><td class="pad" style="padding:40px 48px 36px 48px;">
        <a href="${esc(siteUrl)}" style="text-decoration:none;"><img src="${esc(logo)}" width="160" height="75" alt="Graviti Hill" style="display:block;width:160px;height:75px;font-family:${FONT_DISPLAY};font-size:22px;font-weight:700;letter-spacing:0.06em;color:${C.ink};"></a>
      </td></tr>
      <tr><td class="pad" style="padding:0 48px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${hairline}</table></td></tr>
      <tr><td class="pad" style="padding:40px 48px 48px 48px;">
        ${body}
      </td></tr>
    </table>
  </td></tr>
  ${footer}
</table>
<!--[if mso]></td></tr></table><![endif]-->
</td></tr>
</table>
</body>
</html>`;
}

/** Dark --ridge band: the email's single "held breath", like the site footer. */
function ridgeFooter(settings: Settings, siteUrl: string, note: string): string {
  const a = settings.address;
  const phones = settings.phones
    .map((p) => link(esc(p.display), telHref(p.e164), C.white))
    .join(`<span style="color:${C.onRidgeMuted};">&nbsp;&nbsp;·&nbsp;&nbsp;</span>`);
  const host = siteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");

  return `<tr><td bgcolor="${C.ridge}" class="pad" style="background-color:${C.ridge};padding:40px 48px;">
    <p style="margin:0;font-family:${FONT_DISPLAY};font-stretch:88%;font-size:18px;line-height:24px;font-weight:600;color:${C.white};">${esc(SITE.legalName)}</p>
    <p style="margin:4px 0 0 0;font-family:${FONT_BODY};font-size:13px;line-height:20px;color:${C.onRidgeMuted};">${esc(SITE.positioning)}</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:24px;"><tr><td style="border-top:1px solid ${C.ruleDark};height:1px;line-height:1px;font-size:0;">&nbsp;</td></tr></table>
    <p style="margin:20px 0 0 0;font-family:${FONT_BODY};font-size:13px;line-height:21px;color:${C.onRidgeMuted};">${esc(a.street)}<br>${esc(a.locality)}, ${esc(a.region)}, ${esc(a.country)}</p>
    <p style="margin:12px 0 0 0;font-family:${FONT_BODY};font-size:13px;line-height:21px;color:${C.white};">${phones}</p>
    <p style="margin:12px 0 0 0;font-family:${FONT_BODY};font-size:13px;line-height:21px;">${link(esc(settings.email), `mailto:${settings.email}`, C.white)}<span style="color:${C.onRidgeMuted};">&nbsp;&nbsp;·&nbsp;&nbsp;</span>${link(esc(host), siteUrl, C.white)}</p>
    <p style="margin:24px 0 0 0;font-family:${FONT_BODY};font-size:12px;line-height:18px;color:${C.onRidgeMuted};">${note}</p>
  </td></tr>`;
}

/* ── 1. Internal notification ────────────────────────────────────────────── */

export function renderAdminNotification(data: EnquiryEmailData): RenderedEmail {
  const { input, reference, receivedAt, settings, siteUrl } = data;
  const stamp = lagosStamp(receivedAt);
  const first = firstName(input.name);
  const phone = input.phone?.trim() || "";
  const budget = input.budget || "";
  const wa = phone ? whatsappDigits(phone) : null;

  const subject = headerSafe(`New enquiry · ${input.enquiryType} · ${input.company}`);
  const replySubject = `Re: Your enquiry to Graviti Hill (${reference})`;
  const mailto = `mailto:${input.email}?subject=${encodeURIComponent(replySubject)}`;
  const adminUrl = `${siteUrl.replace(/\/$/, "")}/admin/enquiries`;

  const rows: Array<[string, string]> = [
    ["Role", esc(input.role)],
    ["Company", esc(input.company)],
    ["Email", link(esc(input.email), mailto, C.green)],
    ["Phone", phone ? link(esc(phone), telHref(phone), C.green) : `<span style="color:${C.inkMuted};">Not given</span>`],
    ["Enquiry", esc(input.enquiryType)],
    ["Budget", budget ? esc(budget) : `<span style="color:${C.inkMuted};">Not given</span>`],
  ];

  const buttons = [primaryButton(`Reply to ${esc(first)}`, mailto)];
  if (wa) buttons.push(secondaryButton("WhatsApp", `https://wa.me/${wa}`));
  if (phone) buttons.push(secondaryButton("Call", telHref(phone)));

  const body = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr><td>${accentMarker}</td></tr>
    ${spacer(16)}
    <tr><td>${eyebrow(`New enquiry&nbsp;&nbsp;·&nbsp;&nbsp;${esc(reference)}`)}</td></tr>
    ${spacer(14)}
    <tr><td>${headline(`${esc(input.name)}<br><span style="color:${C.green};">${esc(input.company)}</span>`)}</td></tr>
    ${spacer(14)}
    <tr><td>${paragraph(`${esc(input.role)} · ${esc(input.enquiryType)}<br>Received&nbsp;${esc(stamp).replace(/ /g, "&nbsp;")}`, C.inkMuted)}</td></tr>
    ${spacer(36)}
    <tr><td>${eyebrow("Their message", C.inkMuted)}</td></tr>
    ${spacer(12)}
    <tr><td>${messagePanel(input.message)}</td></tr>
    ${spacer(36)}
    <tr><td>${eyebrow("Details", C.inkMuted)}</td></tr>
    ${spacer(4)}
    <tr><td>${detailRows(rows)}</td></tr>
    ${spacer(32)}
    <tr><td>${buttonRow(buttons)}</td></tr>
    ${spacer(12)}
    <tr><td>${paragraph(`Replying to this email goes straight to ${esc(first)}. The enquiry is also logged in ${link("the admin inbox", adminUrl, C.green)}.`, C.inkMuted)}</td></tr>
  </table>`;

  const footer = `<tr><td class="pad" bgcolor="${C.canvas}" style="background-color:${C.canvas};padding:0 48px 36px 48px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${hairline}</table>
    <p style="margin:16px 0 0 0;font-family:${FONT_BODY};font-size:12px;line-height:18px;color:${C.inkMuted};">Internal notification from the contact form at ${esc(siteUrl.replace(/^https?:\/\//, ""))}. The sender has been sent a confirmation quoting ${esc(reference)}.</p>
  </td></tr>`;

  const html = shell({
    title: subject,
    preheader: `${input.name}, ${input.role} at ${input.company}: ${input.message.slice(0, 90)}`,
    siteUrl,
    logoSrc: data.logoSrc,
    body,
    footer,
  });

  const text = [
    `NEW ENQUIRY · ${reference}`,
    `Received ${stamp}`,
    "",
    `${input.name}`,
    `${input.role}, ${input.company}`,
    "",
    "MESSAGE",
    input.message,
    "",
    "DETAILS",
    `Email     ${input.email}`,
    `Phone     ${phone || "Not given"}`,
    `Enquiry   ${input.enquiryType}`,
    `Budget    ${budget || "Not given"}`,
    "",
    `Reply to this email to answer ${first} directly.`,
    `Admin inbox: ${adminUrl}`,
  ].join("\n");

  return { subject, html, text };
}

/* ── 2. Visitor confirmation ─────────────────────────────────────────────── */

export function renderVisitorConfirmation(data: EnquiryEmailData): RenderedEmail {
  const { input, reference, settings, siteUrl } = data;
  const first = firstName(input.name);
  const budget = input.budget || "";
  const waPhone = settings.phones.find((p) => p.whatsapp) ?? settings.phones[0];
  const waUrl = waPhone
    ? `https://wa.me/${waPhone.e164.replace(/\D/g, "")}?text=${encodeURIComponent(
        `Hello Graviti Hill. Following up on my enquiry ${reference}.`,
      )}`
    : null;

  const subject = "We have your enquiry — Graviti Hill";

  const steps: Array<[string, string, string]> = [
    ["01", "Read", "A practice lead reads your brief in full."],
    [
      "02",
      "Reply",
      `They reply to ${esc(input.email)}, usually within one working day, with questions or a time to talk.`,
    ],
    [
      "03",
      "Conversation",
      "A first conversation, at our Victoria Island office or by call, to scope what you need.",
    ],
  ];

  const stepsHtml = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${steps
    .map(
      ([n, title, copy]) =>
        `<tr><td width="56" valign="top" style="width:56px;padding:18px 0;border-top:1px solid ${C.rule};font-family:${FONT_DISPLAY};font-stretch:72%;font-size:22px;line-height:24px;font-weight:700;color:${C.green};">${n}</td><td valign="top" style="padding:18px 0;border-top:1px solid ${C.rule};"><p style="margin:0;font-family:${FONT_DISPLAY};font-stretch:88%;font-size:17px;line-height:24px;font-weight:600;color:${C.ink};">${title}</p><p style="margin:4px 0 0 0;font-family:${FONT_BODY};font-size:15px;line-height:23px;color:${C.inkMuted};">${copy}</p></td></tr>`,
    )
    .join("")}<tr><td colspan="2" style="border-top:1px solid ${C.rule};height:1px;line-height:1px;font-size:0;">&nbsp;</td></tr></table>`;

  const recapRows: Array<[string, string]> = [
    ["Reference", `<strong style="font-weight:600;">${esc(reference)}</strong>`],
    ["Enquiry", esc(input.enquiryType)],
    ["Company", esc(input.company)],
  ];
  if (budget) recapRows.push(["Budget", esc(budget)]);

  const urgentButtons: string[] = [];
  if (waUrl) urgentButtons.push(primaryButton("Message us on WhatsApp", waUrl));
  if (waPhone) urgentButtons.push(secondaryButton(`Call ${esc(waPhone.display)}`, telHref(waPhone.e164)));

  const body = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr><td>${accentMarker}</td></tr>
    ${spacer(16)}
    <tr><td>${eyebrow("Enquiry received")}</td></tr>
    ${spacer(14)}
    <tr><td>${headline(`Thank you, ${esc(first)}.<br><span style="color:${C.green};">Your brief is with us.</span>`)}</td></tr>
    ${spacer(20)}
    <tr><td>${paragraph(`Your ${esc(input.enquiryType.toLowerCase())} enquiry has reached Graviti Hill and is logged under reference <strong style="font-weight:600;">${esc(reference)}</strong>. Quote it if you contact us about this.`)}</td></tr>
    ${spacer(40)}
    <tr><td>${eyebrow("What happens next", C.inkMuted)}</td></tr>
    ${spacer(4)}
    <tr><td>${stepsHtml}</td></tr>
    ${spacer(40)}
    <tr><td>${eyebrow("What you sent", C.inkMuted)}</td></tr>
    ${spacer(4)}
    <tr><td>${detailRows(recapRows)}</td></tr>
    ${spacer(16)}
    <tr><td>${messagePanel(input.message)}</td></tr>
    ${spacer(40)}
    ${
      urgentButtons.length
        ? `<tr><td>${eyebrow("If it is time-sensitive", C.inkMuted)}</td></tr>
    ${spacer(10)}
    <tr><td>${paragraph("WhatsApp reaches us faster than email.")}</td></tr>
    ${spacer(20)}
    <tr><td>${buttonRow(urgentButtons)}</td></tr>
    ${spacer(28)}`
        : ""
    }
    <tr><td>${paragraph(`To add anything to your brief, reply to this email.`, C.inkMuted)}</td></tr>
    ${spacer(28)}
    <tr><td>${paragraph(`Graviti Hill`)}</td></tr>
  </table>`;

  const footer = ridgeFooter(
    settings,
    siteUrl,
    `You are receiving this because this address was used on the enquiry form at ${esc(
      siteUrl.replace(/^https?:\/\//, "").replace(/\/$/, ""),
    )}. If that was not you, ignore this email. Nothing further will be sent.`,
  );

  const html = shell({
    title: subject,
    preheader: `Reference ${reference}. A practice lead will reply, usually within one working day.`,
    siteUrl,
    logoSrc: data.logoSrc,
    body,
    footer,
  });

  const a = settings.address;
  const text = [
    `Thank you, ${first}. Your brief is with us.`,
    "",
    `Your ${input.enquiryType.toLowerCase()} enquiry has reached Graviti Hill and is logged under reference ${reference}. Quote it if you contact us about this.`,
    "",
    "WHAT HAPPENS NEXT",
    "01  Read — a practice lead reads your brief in full.",
    `02  Reply — they reply to ${input.email}, usually within one working day.`,
    "03  Conversation — at our Victoria Island office or by call, to scope what you need.",
    "",
    "WHAT YOU SENT",
    `Reference  ${reference}`,
    `Enquiry    ${input.enquiryType}`,
    `Company    ${input.company}`,
    ...(budget ? [`Budget     ${budget}`] : []),
    "",
    input.message,
    "",
    ...(waUrl && waPhone
      ? ["If it is time-sensitive, WhatsApp reaches us faster:", `${waPhone.display}  ${waUrl}`, ""]
      : []),
    "To add anything to your brief, reply to this email.",
    "",
    "Graviti Hill",
    "",
    "—",
    SITE.legalName,
    `${a.street}, ${a.locality}, ${a.region}, ${a.country}`,
    settings.phones.map((p) => p.display).join(" · "),
    settings.email,
    siteUrl,
  ].join("\n");

  return { subject, html, text };
}
