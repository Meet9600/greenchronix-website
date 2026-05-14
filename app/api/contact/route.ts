import { NextResponse } from "next/server";
import { siteConfig } from "../../lib/site";

/**
 * Contact form API route.
 *
 * Reads RESEND_API_KEY and CONTACT_TO_EMAIL from env, sends an email via
 * Resend's REST API, and returns JSON status. Includes:
 *   - Input validation (name, email, details required; email shape checked)
 *   - Honeypot field check (`company` should be empty)
 *   - Length caps to prevent abuse
 *   - Graceful degradation: if env vars are missing, returns a clean error
 *     so the client can fall back to WhatsApp.
 *
 * Env vars (set in Vercel project settings):
 *   RESEND_API_KEY   — your Resend API key (required for email sending)
 *   CONTACT_TO_EMAIL — where leads should be delivered (defaults to siteConfig.email)
 *   RESEND_FROM      — verified sender, e.g. "GreenChronix <hello@yourdomain.com>"
 *                       (defaults to Resend's onboarding sender so it works
 *                        immediately while you set up domain verification)
 */

type ContactBody = {
  name?: string;
  email?: string;
  budget?: string;
  details?: string;
  company?: string; // honeypot — should always be empty
};

const MAX_LEN = {
  name: 120,
  email: 200,
  budget: 80,
  details: 4000,
};

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
  let body: ContactBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 }
    );
  }

  // Honeypot — silently succeed so bots think they got through
  if (body.company && body.company.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  const name = (body.name ?? "").trim().slice(0, MAX_LEN.name);
  const email = (body.email ?? "").trim().slice(0, MAX_LEN.email);
  const budget = (body.budget ?? "").trim().slice(0, MAX_LEN.budget);
  const details = (body.details ?? "").trim().slice(0, MAX_LEN.details);

  if (!name || !email || !details) {
    return NextResponse.json(
      { ok: false, error: "Name, email, and project details are required." },
      { status: 400 }
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { ok: false, error: "That email address doesn't look right." },
      { status: 400 }
    );
  }

  // Read env at request time so a missing key during build doesn't fail deploy
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL || siteConfig.email;
  const fromEmail =
    process.env.RESEND_FROM || `${siteConfig.name} <onboarding@resend.dev>`;

  if (!apiKey) {
    // Tell the client to use the WhatsApp fallback. This is the
    // "works immediately even before env vars are set" path.
    return NextResponse.json(
      {
        ok: false,
        error: "Email delivery isn't configured yet — please use WhatsApp.",
        fallback: "whatsapp",
      },
      { status: 503 }
    );
  }

  // Build a clean text + HTML email
  const subject = `New lead from ${name} | ${siteConfig.name}`;
  const textBody = [
    `New contact form submission:`,
    ``,
    `Name:    ${name}`,
    `Email:   ${email}`,
    budget ? `Budget:  ${budget}` : null,
    ``,
    `Details:`,
    details,
    ``,
    `---`,
    `Sent from ${siteConfig.url}`,
  ]
    .filter(Boolean)
    .join("\n");

  const htmlBody = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; padding: 24px;">
      <h2 style="color: #047857; margin: 0 0 16px;">New lead from ${escapeHtml(name)}</h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
        <tr><td style="padding: 6px 0; color: #6b7280; width: 100px;">Name</td><td style="padding: 6px 0;"><strong>${escapeHtml(name)}</strong></td></tr>
        <tr><td style="padding: 6px 0; color: #6b7280;">Email</td><td style="padding: 6px 0;"><a href="mailto:${escapeHtml(email)}" style="color: #047857;">${escapeHtml(email)}</a></td></tr>
        ${budget ? `<tr><td style="padding: 6px 0; color: #6b7280;">Budget</td><td style="padding: 6px 0;">${escapeHtml(budget)}</td></tr>` : ""}
      </table>
      <div style="background: #f9fafb; padding: 16px; border-left: 3px solid #34d399; border-radius: 4px;">
        <p style="margin: 0 0 8px; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Project details</p>
        <p style="margin: 0; white-space: pre-wrap; line-height: 1.6;">${escapeHtml(details)}</p>
      </div>
      <p style="margin-top: 24px; color: #9ca3af; font-size: 12px;">Sent from <a href="${siteConfig.url}" style="color: #047857;">${siteConfig.url}</a></p>
    </div>
  `;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: email,
        subject,
        text: textBody,
        html: htmlBody,
      }),
    });

    if (!res.ok) {
      // Resend gave us a real error — log it server-side, fall back client-side
      const errText = await res.text();
      console.error("Resend API error:", res.status, errText);
      return NextResponse.json(
        {
          ok: false,
          error: "Email delivery failed — please use WhatsApp as a fallback.",
          fallback: "whatsapp",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact route error:", err);
    return NextResponse.json(
      {
        ok: false,
        error: "Unexpected error. Please try WhatsApp.",
        fallback: "whatsapp",
      },
      { status: 500 }
    );
  }
}
