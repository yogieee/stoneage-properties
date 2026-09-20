import "server-only";
import { Resend } from "resend";
import {
  adminChatLeadEmail,
  adminNotificationEmail,
  clientThankYouEmail,
  type ChatLeadForTemplates,
  type SubmissionForTemplates,
} from "@/lib/notifications/templates";

function getResendClient(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
}

function getFromAddress(): string {
  return process.env.RESEND_FROM_EMAIL || "Stoneage Properties <onboarding@resend.dev>";
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const emailWrapper = (bodyHtml: string) => `
<div style="font-family: -apple-system, Helvetica, Arial, sans-serif; background:#faf9f6; padding: 32px 16px;">
  <div style="max-width: 560px; margin: 0 auto; background:#fdfcf9; border:1px solid #dcdad4; border-radius: 8px; padding: 32px;">
    <p style="font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color:#8a8883; margin: 0 0 24px;">
      Stoneage Properties
    </p>
    ${bodyHtml}
    <p style="font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 10px; letter-spacing: 0.06em; text-transform: uppercase; color:#8a8883; margin: 32px 0 0; border-top: 1px solid #dcdad4; padding-top: 16px;">
      Solihull, UK &middot; stoneageproperties.com
    </p>
  </div>
</div>`;

export async function sendClientThankYouEmail(
  submission: SubmissionForTemplates,
): Promise<boolean> {
  const resend = getResendClient();
  if (!resend) {
    console.warn("Resend is not configured; skipping client thank-you email.");
    return false;
  }

  const template = clientThankYouEmail(submission);
  const html = emailWrapper(`
    <h1 style="font-size: 20px; font-weight: 500; color:#111110; margin: 0 0 16px;">${escapeHtml(template.heading)}</h1>
    ${template.bodyLines
      .map(
        (line) =>
          `<p style="font-size: 14px; line-height: 1.6; color:#555451; margin: 0 0 16px;">${escapeHtml(line)}</p>`,
      )
      .join("")}
    <p style="font-size: 14px; line-height: 1.6; color:#555451; margin: 24px 0 0;">${template.signOff
      .map(escapeHtml)
      .join("<br />")}</p>
  `);

  try {
    const { error } = await resend.emails.send({
      from: getFromAddress(),
      to: submission.email,
      subject: template.subject,
      html,
    });
    if (error) {
      console.error("Resend client email failed:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Resend client email threw:", err);
    return false;
  }
}

export async function sendAdminNotificationEmail(
  submission: SubmissionForTemplates,
): Promise<boolean> {
  const resend = getResendClient();
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
  if (!resend || !adminEmail) {
    console.warn(
      "Resend or ADMIN_NOTIFICATION_EMAIL is not configured; skipping admin notification email.",
    );
    return false;
  }

  const template = adminNotificationEmail(submission);
  const rowsHtml = template.fields
    .map(
      ([label, value]) => `
      <tr>
        <td style="padding: 6px 12px 6px 0; font-size: 12px; color:#8a8883; white-space: nowrap; vertical-align: top;">${escapeHtml(label)}</td>
        <td style="padding: 6px 0; font-size: 14px; color:#111110;">${escapeHtml(value)}</td>
      </tr>`,
    )
    .join("");

  const html = emailWrapper(`
    <h1 style="font-size: 20px; font-weight: 500; color:#111110; margin: 0 0 16px;">${escapeHtml(template.heading)}</h1>
    <table style="width:100%; border-collapse: collapse; margin-bottom: 16px;">
      ${rowsHtml}
    </table>
    ${
      template.message
        ? `<p style="font-size: 12px; color:#8a8883; margin: 0 0 6px; text-transform: uppercase; letter-spacing: 0.05em;">Message</p>
           <p style="font-size: 14px; line-height: 1.6; color:#111110; margin: 0; white-space: pre-line;">${escapeHtml(template.message)}</p>`
        : ""
    }
  `);

  try {
    const { error } = await resend.emails.send({
      from: getFromAddress(),
      to: adminEmail,
      subject: template.subject,
      html,
    });
    if (error) {
      console.error("Resend admin email failed:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Resend admin email threw:", err);
    return false;
  }
}

export async function sendAdminChatLeadEmail(
  lead: ChatLeadForTemplates,
): Promise<boolean> {
  const resend = getResendClient();
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
  if (!resend || !adminEmail) {
    console.warn(
      "Resend or ADMIN_NOTIFICATION_EMAIL is not configured; skipping chat lead email.",
    );
    return false;
  }

  const template = adminChatLeadEmail(lead);
  const rowsHtml = template.fields
    .map(
      ([label, value]) => `
      <tr>
        <td style="padding: 6px 12px 6px 0; font-size: 12px; color:#8a8883; white-space: nowrap; vertical-align: top;">${escapeHtml(label)}</td>
        <td style="padding: 6px 0; font-size: 14px; color:#111110;">${escapeHtml(value)}</td>
      </tr>`,
    )
    .join("");

  const html = emailWrapper(`
    <h1 style="font-size: 20px; font-weight: 500; color:#111110; margin: 0 0 16px;">${escapeHtml(template.heading)}</h1>
    <table style="width:100%; border-collapse: collapse; margin-bottom: 16px;">
      ${rowsHtml}
    </table>
  `);

  try {
    const { error } = await resend.emails.send({
      from: getFromAddress(),
      to: adminEmail,
      subject: template.subject,
      html,
    });
    if (error) {
      console.error("Resend chat lead email failed:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Resend chat lead email threw:", err);
    return false;
  }
}
