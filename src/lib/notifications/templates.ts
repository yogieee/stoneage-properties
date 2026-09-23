import "server-only";

/**
 * Single source of truth for every outbound message triggered by a
 * Project Brief submission. Edit copy here — email and WhatsApp senders
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
    subject: `Thank you for getting in touch, ${submission.name}`,
    heading: `Thanks for reaching out, ${submission.name}`,
    bodyLines: [
      "We've received your Project Brief, and we're glad you thought of Stoneage Properties for your project.",
      "A senior director from our Solihull studio will read it personally and come back to you within 1-2 working days.",
      "If anything changes, or you'd like to add more detail, just reply to this email. We'd love to hear more.",
    ],
    signOff: ["Warm regards,", "The Stoneage Properties team"],
  };
}

export function adminNotificationEmail(submission: SubmissionForTemplates) {
  return {
    subject: `New enquiry: ${submission.name}`,
    heading: "New Project Brief submission",
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
      "Hi {{1}}, thank you for getting in touch with Stoneage Properties. We've received your Project Brief and a senior director will contact you within 1-2 working days. Feel free to reply here with any questions.",
    render: () =>
      `Hi ${submission.name}, thank you for getting in touch with Stoneage Properties. We've received your Project Brief and a senior director will contact you within 1-2 working days. Feel free to reply here with any questions.`,
  };
}

export function adminWhatsAppTemplate(submission: SubmissionForTemplates) {
  return {
    name: "spatial_brief_admin_alert",
    metaTemplateBody:
      "New Project Brief submission\nName: {{1}}\nEmail: {{2}}\nPhone: {{3}}\nProject type: {{4}}",
    render: () =>
      [
        "New Project Brief submission",
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

// ============================================================
// Chat widget: hot lead alert
//
// Sent once per conversation, only when the assistant classifies the
// visitor as a "hot" lead, they've given contact info, and they've
// explicitly consented to being contacted.
// ============================================================

export interface ChatLeadForTemplates {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  projectType?: string | null;
  timeline?: string | null;
  pagePath?: string | null;
}

export function adminChatLeadEmail(lead: ChatLeadForTemplates) {
  return {
    subject: `Hot lead from chat: ${lead.name || "Website visitor"}`,
    heading: "Hot lead captured via AI chat",
    fields: [
      ["Name", lead.name || "-"],
      ["Email", lead.email || "-"],
      ["Phone", lead.phone || "-"],
      ["Project type", lead.projectType || "-"],
      ["Timeline", lead.timeline || "-"],
      ["Page", lead.pagePath || "-"],
    ] as Array<[string, string]>,
    message: null as string | null,
  };
}

export function adminChatLeadWhatsAppTemplate(lead: ChatLeadForTemplates) {
  return {
    name: "chat_hot_lead_admin_alert",
    metaTemplateBody:
      "Hot lead from chat\nName: {{1}}\nEmail: {{2}}\nPhone: {{3}}\nProject type: {{4}}",
    render: () =>
      [
        "Hot lead from chat",
        `Name: ${lead.name || "-"}`,
        lead.email ? `Email: ${lead.email}` : null,
        lead.phone ? `Phone: ${lead.phone}` : null,
        lead.projectType ? `Project type: ${lead.projectType}` : null,
        lead.timeline ? `Timeline: ${lead.timeline}` : null,
      ]
        .filter(Boolean)
        .join("\n"),
  };
}
