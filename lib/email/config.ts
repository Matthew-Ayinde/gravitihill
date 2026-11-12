/**
 * Mail configuration, read from the environment and nowhere else.
 *
 * Every value here is edited in `.env.local` (or the Vercel project's env
 * settings) — no code change is needed to rotate a password, move inboxes or
 * swap Gmail for another relay. See `.env.example` for the annotated list.
 *
 * Defaults target Gmail: smtp.gmail.com on 465 (implicit TLS). Gmail needs an
 * App Password (Google Account → Security → 2-Step Verification → App
 * passwords), not the account password. Google displays it in four groups of
 * four with spaces; those spaces are stripped here, so paste it either way.
 */

export type MailConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  /** RFC 5322 From header, e.g. `"Graviti Hill" <enquiries@gmail.com>`. */
  from: string;
  /** Inboxes that receive the internal notification. */
  adminRecipients: string[];
};

export type MailConfigResult =
  | { ok: true; config: MailConfig }
  | { ok: false; missing: string[] };

const read = (key: string) => process.env[key]?.trim() || undefined;

/** Strip surrounding quotes a hand-edited env file sometimes leaves behind. */
const unquote = (value: string) => value.replace(/^(['"])(.*)\1$/, "$2");

export function readMailConfig(): MailConfigResult {
  const host = read("SMTP_HOST") ?? "smtp.gmail.com";
  const portRaw = read("SMTP_PORT") ?? "465";
  const user = read("SMTP_USER");
  const passRaw = read("SMTP_PASS");
  // ADMIN_EMAIL is the documented key; CONTACT_TO is accepted for older envs.
  const adminRaw = read("ADMIN_EMAIL") ?? read("CONTACT_TO");

  const missing: string[] = [];
  if (!user) missing.push("SMTP_USER");
  if (!passRaw) missing.push("SMTP_PASS");
  if (!adminRaw) missing.push("ADMIN_EMAIL");

  const port = Number(portRaw);
  if (!Number.isInteger(port) || port <= 0) missing.push("SMTP_PORT (not a number)");

  if (missing.length > 0 || !user || !passRaw || !adminRaw) {
    return { ok: false, missing };
  }

  const isGmail = /(^|\.)gmail\.com$|googlemail\.com$/i.test(host);
  const pass = isGmail ? unquote(passRaw).replace(/\s+/g, "") : unquote(passRaw);

  const adminRecipients = unquote(adminRaw)
    .split(/[,;]/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (adminRecipients.length === 0) return { ok: false, missing: ["ADMIN_EMAIL"] };

  const fromEnv = read("EMAIL_FROM");
  const from = fromEnv ? unquote(fromEnv) : `"Graviti Hill" <${user}>`;

  return {
    ok: true,
    config: {
      host,
      port,
      // 465 is implicit TLS; 587 (and anything else) upgrades via STARTTLS.
      secure: port === 465,
      user: unquote(user),
      pass,
      from,
      adminRecipients,
    },
  };
}
