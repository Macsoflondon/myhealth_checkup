import {
  CONTACT_FROM,
  SUPPORT_INBOX,
  escapeHtml,
  type ContactInput,
} from "./contact.shared";

async function sendEmail(apiKey: string, payload: Record<string, unknown>): Promise<void> {
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

/** Delivers the support notification and the sender acknowledgement. */
export async function deliverContactMessage(
  apiKey: string,
  data: ContactInput,
  reference: string,
): Promise<void> {
  const fullName = `${data.firstName} ${data.lastName}`;

  await sendEmail(apiKey, {
    from: CONTACT_FROM,
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
    from: CONTACT_FROM,
    to: [data.email],
    subject: `We've received your message (ref ${reference})`,
    html: `
      <p>Hello ${escapeHtml(data.firstName)},</p>
      <p>Thank you for contacting myhealth checkup. Your reference is
         <strong>${reference}</strong>.</p>
      <p>We aim to respond within two business days. myhealth checkup is an
         independent comparison platform and does not provide medical care or
         clinical advice.</p>
      <p>— MYHEALTHCHECKUP LTD</p>
    `,
  });
}
