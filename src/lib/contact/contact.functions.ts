import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const SUPPORT_INBOX = "support@myhealthcheckup.co.uk";
const FROM = "myhealth checkup <support@myhealthcheckup.co.uk>";

const contactInput = z.object({
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(20).optional().or(z.literal("")),
  subject: z.string().trim().min(1).max(200),
  message: z.string().trim().min(10).max(2000),
  /** Honeypot — must stay empty for genuine submissions. */
  hp: z.string().max(200).optional().or(z.literal("")),
});

export type ContactInput = z.infer<typeof contactInput>;

const escapeHtml = (value: string): string =>
  value.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c,
  );

async function sendEmail(
  apiKey: string,
  payload: Record<string, unknown>,
): Promise<void> {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Email delivery failed (${response.status}): ${detail.slice(0, 200)}`);
  }
}

/**
 * Delivers a contact-form message to the support inbox and sends the sender an
 * acknowledgement. Throws on delivery failure so the UI can surface a real error.
 */
export const submitContactMessage = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => contactInput.parse(data))
  .handler(async ({ data }): Promise<{ ok: true; reference: string }> => {
    const reference = `MHC-${Date.now().toString(36).toUpperCase()}-${Math.random()
      .toString(36)
      .slice(2, 6)
      .toUpperCase()}`;

    // Silently accept bot submissions without delivering them.
    if (data.hp && data.hp.length > 0) {
      return { ok: true, reference };
    }

    const apiKey = process.env["RESEND_API_KEY"];
    if (!apiKey) {
      console.error("[contact] RESEND_API_KEY missing");
      throw new Error(
        `Our message service is temporarily unavailable. Please email ${SUPPORT_INBOX}.`,
      );
    }

    const fullName = `${data.firstName} ${data.lastName}`;

    try {
      await sendEmail(apiKey, {
        from: FROM,
        to: [SUPPORT_INBOX],
        reply_to: data.email,
        subject: `[${reference}] Contact form: ${data.subject}`,
        html: `
          <h2>New contact form submission</h2>
          <p><strong>Reference:</strong> ${reference}</p>
          <p><strong>Received:</strong> ${new Date().toISOString()}</p>
          <hr/>
          <p><strong>Name:</strong> ${escapeHtml(fullName)}</p>
          <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
          ${data.phone ? `<p><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>` : ""}
          <p><strong>Subject:</strong> ${escapeHtml(data.subject)}</p>
          <hr/>
          <p style="white-space:pre-wrap">${escapeHtml(data.message)}</p>
        `,
      });

      await sendEmail(apiKey, {
        from: FROM,
        to: [data.email],
        subject: `We've received your message (ref ${reference})`,
        html: `
          <p>Hello ${escapeHtml(data.firstName)},</p>
          <p>Thank you for contacting myhealth checkup. Your reference is
             <strong>${reference}</strong>.</p>
          <p>We aim to respond within two business days. myhealth checkup is an
             independent comparison platform and does not provide medical care
             or clinical advice.</p>
          <p>— MYHEALTHCHECKUP LTD (Company No. 16589056)</p>
        `,
      });
    } catch (error) {
      console.error("[contact] delivery failed", error);
      throw new Error(
        `We could not send your message. Please try again or email ${SUPPORT_INBOX}.`,
      );
    }

    return { ok: true, reference };
  });
