import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { sendAdminNotificationEmail, sendClientThankYouEmail } from "@/lib/email/resend";
import {
  sendAdminWhatsAppMessage,
  sendClientWhatsAppMessage,
} from "@/lib/whatsapp/twilio";

export async function POST(request: NextRequest) {
  let body: {
    name?: string;
    email?: string;
    phone?: string;
    projectTypes?: string[];
    location?: string;
    timeline?: string;
    message?: string;
    contactConsent?: boolean;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { name, email, phone, projectTypes, location, timeline, message, contactConsent } =
    body;

  if (!name?.trim() || !email?.trim()) {
    return NextResponse.json(
      { error: "Name and email are required." },
      { status: 400 },
    );
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return NextResponse.json(
      { error: "Please provide a valid email address." },
      { status: 400 },
    );
  }

  if (!contactConsent) {
    return NextResponse.json(
      { error: "Please confirm we can contact you about this enquiry." },
      { status: 400 },
    );
  }

  const submission = {
    name: name.trim(),
    email: email.trim(),
    phone: phone?.trim() || null,
    projectTypes: projectTypes ?? [],
    location: location?.trim() || null,
    timeline: timeline || null,
    message: message?.trim() || null,
  };

  // The form has one combined checkbox, but preferences are stored
  // per-channel so each can be independently revoked later (e.g. an
  // unsubscribe link or a WhatsApp "STOP" reply) without touching the other.
  const emailOptIn = true;
  const whatsappOptIn = Boolean(submission.phone);

  try {
    const supabase = getSupabaseServerClient();
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from("contact_submissions")
      .insert({
        name: submission.name,
        email: submission.email,
        phone: submission.phone,
        project_types: submission.projectTypes,
        location: submission.location,
        timeline: submission.timeline,
        message: submission.message,
        user_agent: request.headers.get("user-agent"),
        referrer: request.headers.get("referer"),
        contact_consent: true,
        contact_consent_at: now,
        email_opt_in: emailOptIn,
        whatsapp_opt_in: whatsappOptIn,
        preferences_updated_at: now,
      })
      .select("id")
      .single();

    if (error || !data) {
      console.error("Supabase contact insert failed:", error);
      return NextResponse.json(
        { error: "Could not save your submission. Please try again." },
        { status: 500 },
      );
    }

    // Notifications are best-effort: the submission is already saved, so a
    // failed email/WhatsApp send should never fail the user-facing request.
    const [clientEmailOk, adminEmailOk, clientWhatsAppOk, adminWhatsAppOk] =
      await Promise.all([
        emailOptIn ? sendClientThankYouEmail(submission) : Promise.resolve(false),
        sendAdminNotificationEmail(submission),
        whatsappOptIn ? sendClientWhatsAppMessage(submission) : Promise.resolve(false),
        sendAdminWhatsAppMessage(submission),
      ]);

    const sentAtUpdates: Record<string, string> = {};
    if (clientEmailOk) sentAtUpdates.client_email_sent_at = new Date().toISOString();
    if (adminEmailOk) sentAtUpdates.admin_email_sent_at = new Date().toISOString();
    if (clientWhatsAppOk) sentAtUpdates.client_whatsapp_sent_at = new Date().toISOString();
    if (adminWhatsAppOk) sentAtUpdates.admin_whatsapp_sent_at = new Date().toISOString();

    if (Object.keys(sentAtUpdates).length > 0) {
      const { error: updateError } = await supabase
        .from("contact_submissions")
        .update(sentAtUpdates)
        .eq("id", data.id);
      if (updateError) {
        console.error("Failed to record notification send status:", updateError);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact form submission error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again shortly." },
      { status: 500 },
    );
  }
}
