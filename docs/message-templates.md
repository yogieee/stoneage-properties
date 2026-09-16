# Spatial Brief notification templates

Source of truth for the copy below: `src/lib/notifications/templates.ts`. Edit
the wording there — both the email and WhatsApp senders read from that file,
so this doc always describes what's actually sent.

Triggered automatically whenever a visitor submits the Spatial Brief form
(`/contact` or the contact modal), provided they've checked the required
consent box.

## Email

### 1. Client thank-you email

Sent to the email address the visitor submitted.

- **Subject:** We've received your Spatial Brief
- **Body:**
  > Brief received, {name}
  >
  > Thank you for sharing your project details with Stoneage Properties. A
  > senior director from our Solihull HQ will review your spatial brief and
  > respond within one business day.
  >
  > In the meantime, if anything changes about your project or you'd like to
  > add more detail, just reply to this email.

### 2. Admin notification email

Sent to `ADMIN_NOTIFICATION_EMAIL`, always (regardless of the visitor's
consent choice — this is an internal operations notification, not contact
with the visitor).

- **Subject:** New enquiry: {name}
- **Body:** a field table (Name, Email, Phone, Project type, Location,
  Timeline) followed by the visitor's free-text message, if any.

## WhatsApp

Sent only if the visitor checked the consent box **and** provided a phone
number. Twilio's WhatsApp Sandbox (current setup, for testing) sends
free-form text directly — no approval needed. Moving to a real WhatsApp
Business sender later requires submitting these as **approved templates** to
Meta first; the `{{1}}`, `{{2}}`... placeholders below are in the format Meta
expects for that submission.

### 1. Client confirmation — `spatial_brief_client_confirmation`

- **Category:** Utility
- **Template body:**
  > Hi {{1}}, thanks for reaching out to Stoneage Properties. We've received
  > your Spatial Brief and a senior director will be in touch within one
  > business day. Reply here anytime with questions.
- **Variables:** `{{1}}` = visitor's name

### 2. Admin alert — `spatial_brief_admin_alert`

Sent to `ADMIN_WHATSAPP_NUMBER`, always (same reasoning as the admin email —
internal notification, not visitor-facing).

- **Category:** Utility
- **Template body:**
  > New Spatial Brief submission
  > Name: {{1}}
  > Email: {{2}}
  > Phone: {{3}}
  > Project type: {{4}}
- **Variables:** `{{1}}` name, `{{2}}` email, `{{3}}` phone, `{{4}}` project
  type(s)

## Consent & preferences

The form has one combined checkbox ("I agree that Stoneage Properties may
contact me by email and, where a phone number is provided, via WhatsApp
regarding this enquiry...") and is **required** to submit. Behind the scenes,
each channel gets its own preference row so either can be revoked
independently later without touching the other:

- `contact_submissions.email_opt_in` — set `true` at submission (the
  checkbox covers email unconditionally)
- `contact_submissions.whatsapp_opt_in` — set `true` only if a phone number
  was also provided
- `contact_submissions.email_opted_out` / `email_opted_out_at` — for a future
  unsubscribe link; not wired up to any UI yet, defaults to `false`/`null`
- `contact_submissions.whatsapp_opted_out` / `whatsapp_opted_out_at` — same,
  for a future WhatsApp "STOP" handler
- `contact_submissions.preferences_updated_at` — last time any of the above
  changed
- `contact_submissions.contact_consent` / `contact_consent_at` — the original
  combined flag, kept for historical rows; the app now reads/writes the
  per-channel columns above instead

Sending gates on `*_opt_in`:

- Client thank-you email → `email_opt_in`
- Client WhatsApp confirmation → `whatsapp_opt_in` (requires a phone number)

Admin email/WhatsApp alerts are **not** gated by any of this — they go to
Stoneage's own team about their own lead, not to the visitor. Delivery is
tracked via `client_email_sent_at` / `admin_email_sent_at` /
`client_whatsapp_sent_at` / `admin_whatsapp_sent_at` so you can audit what
actually went out.
