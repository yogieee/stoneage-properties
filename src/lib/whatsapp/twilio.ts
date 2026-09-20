import "server-only";
import twilio from "twilio";
import {
  adminChatLeadWhatsAppTemplate,
  adminWhatsAppTemplate,
  clientWhatsAppTemplate,
  type ChatLeadForTemplates,
  type SubmissionForTemplates,
} from "@/lib/notifications/templates";

function getTwilioClient() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  if (!accountSid || !authToken) return null;
  return twilio(accountSid, authToken);
}

// Twilio needs E.164 (+447700900123). The form accepts free text, so tidy
// common UK formats: "07700 900123" -> "+447700900123", "0044..." -> "+44...".
function toE164(rawNumber: string): string {
  const stripped = rawNumber.replace(/^whatsapp:/, "").replace(/[\s().-]/g, "");
  if (stripped.startsWith("+")) return stripped;
  if (stripped.startsWith("00")) return `+${stripped.slice(2)}`;
  if (stripped.startsWith("0")) return `+44${stripped.slice(1)}`;
  return `+${stripped}`;
}

function toWhatsAppAddress(rawNumber: string): string {
  return `whatsapp:${toE164(rawNumber)}`;
}

async function sendWhatsAppMessage(to: string, body: string): Promise<boolean> {
  const client = getTwilioClient();
  const from = process.env.TWILIO_WHATSAPP_FROM;

  if (!client || !from) {
    const missing = [
      !process.env.TWILIO_ACCOUNT_SID && "TWILIO_ACCOUNT_SID",
      !process.env.TWILIO_AUTH_TOKEN && "TWILIO_AUTH_TOKEN",
      !from && "TWILIO_WHATSAPP_FROM",
    ].filter(Boolean);
    console.warn(`Twilio is not configured (missing ${missing.join(", ")}); skipping WhatsApp message.`);
    return false;
  }

  try {
    await client.messages.create({
      from: toWhatsAppAddress(from),
      to: toWhatsAppAddress(to),
      body,
    });
    return true;
  } catch (err) {
    console.error("Twilio WhatsApp send failed:", err);
    return false;
  }
}

export async function sendClientWhatsAppMessage(
  submission: SubmissionForTemplates,
): Promise<boolean> {
  if (!submission.phone) return false;
  const template = clientWhatsAppTemplate(submission);
  return sendWhatsAppMessage(submission.phone, template.render());
}

export async function sendAdminWhatsAppMessage(
  submission: SubmissionForTemplates,
): Promise<boolean> {
  const adminNumber = process.env.ADMIN_WHATSAPP_NUMBER;
  if (!adminNumber) {
    console.warn("ADMIN_WHATSAPP_NUMBER is not configured; skipping admin WhatsApp message.");
    return false;
  }

  const template = adminWhatsAppTemplate(submission);
  return sendWhatsAppMessage(adminNumber, template.render());
}

export async function sendAdminChatLeadWhatsAppMessage(
  lead: ChatLeadForTemplates,
): Promise<boolean> {
  const adminNumber = process.env.ADMIN_WHATSAPP_NUMBER;
  if (!adminNumber) {
    console.warn("ADMIN_WHATSAPP_NUMBER is not configured; skipping chat lead WhatsApp message.");
    return false;
  }

  const template = adminChatLeadWhatsAppTemplate(lead);
  return sendWhatsAppMessage(adminNumber, template.render());
}
