import "server-only";
import twilio from "twilio";
import {
  adminWhatsAppTemplate,
  clientWhatsAppTemplate,
  type SubmissionForTemplates,
} from "@/lib/notifications/templates";

function getTwilioClient() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  if (!accountSid || !authToken) return null;
  return twilio(accountSid, authToken);
}

function toWhatsAppAddress(rawNumber: string): string {
  return rawNumber.startsWith("whatsapp:") ? rawNumber : `whatsapp:${rawNumber}`;
}

async function sendWhatsAppMessage(to: string, body: string): Promise<boolean> {
  const client = getTwilioClient();
  const from = process.env.TWILIO_WHATSAPP_FROM;

  if (!client || !from) {
    console.warn("Twilio is not configured; skipping WhatsApp message.");
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
