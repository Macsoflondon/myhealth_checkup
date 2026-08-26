import { createServerFn } from "@tanstack/react-start";
import { contactInputSchema, buildContactReference, SUPPORT_INBOX } from "./contact.shared";

/**
 * Delivers a contact-form message to the support inbox and acknowledges the
 * sender. Throws on delivery failure so the UI can surface a real error.
 */
export const submitContactMessage = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => contactInputSchema.parse(data))
  .handler(async ({ data }): Promise<{ ok: true; reference: string }> => {
    const reference = buildContactReference();

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

    try {
      const { deliverContactMessage } = await import("./contact.server");
      await deliverContactMessage(apiKey, data, reference);
    } catch (error) {
      console.error("[contact] delivery failed", error);
      throw new Error(
        `We could not send your message. Please try again or email ${SUPPORT_INBOX}.`,
      );
    }

    return { ok: true, reference };
  });
