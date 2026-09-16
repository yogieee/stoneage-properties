import "server-only";

/**
 * Single source of truth for every outbound message triggered by a
 * Spatial Brief submission. Edit copy here — email and WhatsApp senders
 * both read from this file, and it doubles as the reference doc when
 * submitting the WhatsApp templates to Meta for approval (see the
 * {{1}}, {{2}}... placeholder notes on each WhatsApp template).
 */

export interface SubmissionForTemplates {
  name: string;
  email: string;
  phone?: string | null;
  projectTypes: string[];
  location?: string | null;
  timeline?: string | null;
  message?: string | null;
}

// ============================================================
// Email templates
// ============================================================

export function clientThankYouEmail(submission: SubmissionForTemplates) {
  return {
    subject: "We've received your Spatial Brief",
    heading: `Brief received, ${submission.name}`,
    bodyLines: [
      "Thank you for sharing your project details with Stoneage Properties. A senior director from our Solihull HQ will review your spatial brief and respond within one business day.",
      "In the meantime, if anything changes about your project or you'd like to add more detail, just reply to this email.",
    ],
  };
}

export function adminNotificationEmail(submission: SubmissionForTemplates) {
  return {
    subject: `New enquiry: ${submission.name}`,
    heading: "New Spatial Brief submission",
    fields: [
      ["Name", submission.name],
      ["Email", submission.email],
      ["Phone", submission.phone || "-"],
      ["Project type", submission.projectTypes.join(", ") || "-"],
      ["Location", submission.location || "-"],
      ["Timeline", submission.timeline || "-"],
    ] as Array<[string, string]>,
    message: submission.message || null,
  };
}

// ============================================================
// WhatsApp templates
//
// Twilio Sandbox (testing): free-form text below works as-is once the
// recipient has joined the sandbox.
//
// Production (WhatsApp Business Platform via Twilio or Meta directly):
// business-initiated messages require a pre-approved template. Submit
// the "meta template body" strings below verbatim (with {{1}}, {{2}}...
// placeholders) in the template request — category "Utility" fits both.
// ============================================================

export function clientWhatsAppTemplate(submission: SubmissionForTemplates) {
  return {
    name: "spatial_brief_client_confirmation",
    metaTemplateBody:
      "Hi {{1}}, thanks for reaching out to Stoneage Properties. We've received your Spatial Brief and a senior director will be in touch within one business day. Reply here anytime with questions.",
    render: () =>
      `Hi ${submission.name}, thanks for reaching out to Stoneage Properties. We've received your Spatial Brief and a senior director will be in touch within one business day. Reply here anytime with questions.`,
  };
}

export function adminWhatsAppTemplate(submission: SubmissionForTemplates) {
  return {
    name: "spatial_brief_admin_alert",
    metaTemplateBody:
      "New Spatial Brief submission\nName: {{1}}\nEmail: {{2}}\nPhone: {{3}}\nProject type: {{4}}",
    render: () =>
      [
        "New Spatial Brief submission",
        `Name: ${submission.name}`,
        `Email: ${submission.email}`,
        submission.phone ? `Phone: ${submission.phone}` : null,
        submission.projectTypes.length > 0
          ? `Project type: ${submission.projectTypes.join(", ")}`
          : null,
      ]
        .filter(Boolean)
        .join("\n"),
  };
}
