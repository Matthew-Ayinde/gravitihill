import { NextResponse } from "next/server";
import { contactSchema, normaliseContactInput } from "@/lib/contact-schema";
import { getEnquiryTypes } from "@/content/services";
import { readMailConfig } from "@/lib/email/config";
import { createReference, sendEnquiryEmails } from "@/lib/mail";
import { getSiteSettings } from "@/lib/settings";
import { SITE } from "@/lib/site";
import { rateLimit } from "@/lib/rate-limit";
import { recordSubmission } from "@/lib/repositories/contact-submissions";

export const runtime = "nodejs";

/**
 * POST /api/contact
 *
 * The server is the validation boundary — the client-side Zod check is a
 * courtesy and is assumed hostile here.
 *
 * SMTP failures are logged server-side and returned to the client as a generic
 * message. A client must never learn the host, the port, the auth mode or the
 * reason a relay refused; that is reconnaissance.
 */
export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  const limit = rateLimit(`contact:${ip}`);
  if (!limit.ok) {
    return NextResponse.json(
      { message: "Too many enquiries from this connection. Try again shortly." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: "Malformed request." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(payload);
  if (
    !parsed.success ||
    !(await getEnquiryTypes()).includes(parsed.data.enquiryType)
  ) {
    return NextResponse.json(
      { message: "Some fields need attention. Check the form and send again." },
      { status: 400 },
    );
  }

  // Trim server-side too. The client already does, but the client is not
  // the one making this decision.
  const data = normaliseContactInput(parsed.data);

  // Honeypot. Answer 200 so a bot cannot distinguish a rejection from a send.
  if (data.website) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const reference = createReference();
  const receivedAt = new Date();

  // Persisted before the email attempt, so a submission survives an SMTP
  // failure. A persistence failure is logged, not fatal — the visitor should
  // still get a real send attempt rather than a 500 over a logging problem.
  try {
    await recordSubmission(data, reference);
  } catch (error) {
    console.error(`[contact] ${reference}: failed to record submission`, error);
  }

  const mail = readMailConfig();
  if (!mail.ok) {
    console.error(
      `[contact] ${reference}: email is not configured — missing ${mail.missing.join(", ")} in .env.local`,
    );
    return NextResponse.json(
      {
        message:
          "The form is unavailable right now. Reach us on WhatsApp or by email.",
      },
      { status: 503 },
    );
  }

  try {
    const settings = await getSiteSettings();
    const { visitorConfirmationSent } = await sendEnquiryEmails(
      { input: data, reference, receivedAt, settings, siteUrl: SITE.url },
      mail.config,
    );
    return NextResponse.json({ ok: true, reference, confirmationSent: visitorConfirmationSent }, { status: 200 });
  } catch (error) {
    console.error(`[contact] ${reference}: notification send failed`, error);
    return NextResponse.json(
      {
        message:
          "That did not send. Try again, or reach us on WhatsApp or by email.",
      },
      { status: 502 },
    );
  }
}
