import { z } from "zod";

export const SUPPORT_INBOX = "support@myhealthcheckup.co.uk";
export const CONTACT_FROM = "myhealth checkup <support@myhealthcheckup.co.uk>";

export const contactInputSchema = z.object({
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(20).optional().or(z.literal("")),
  subject: z.string().trim().min(1).max(200),
  message: z.string().trim().min(10).max(2000),
  /** Honeypot — must stay empty for genuine submissions. */
  hp: z.string().max(200).optional().or(z.literal("")),
});

export type ContactInput = z.infer<typeof contactInputSchema>;

export const escapeHtml = (value: string): string =>
  value.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c,
  );

export const buildContactReference = (): string =>
  `MHC-${Date.now().toString(36).toUpperCase()}-${Math.random()
    .toString(36)
    .slice(2, 6)
    .toUpperCase()}`;
