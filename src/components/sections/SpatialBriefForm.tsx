"use client";

import { useState } from "react";
import { LogoSpinner } from "@/components/decorative/LogoSpinner";

interface SpatialBriefFormProps {
  isModal?: boolean;
  onSuccess?: () => void;
  onClose?: () => void;
  defaultMessage?: string;
}

export function SpatialBriefForm({
  isModal = false,
  onSuccess,
  onClose,
  defaultMessage,
}: SpatialBriefFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projectTypes, setProjectTypes] = useState<string[]>(["Residential"]);
  const [contactConsent, setContactConsent] = useState(false);

  const toggleProjectType = (type: string) => {
    setProjectTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      projectTypes,
      location: String(formData.get("location") ?? ""),
      timeline: String(formData.get("timeline") ?? ""),
      message: String(formData.get("message") ?? ""),
      contactConsent,
    };

    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Could not submit your brief.");
      }

      setSubmitted(true);
      if (onSuccess) {
        setTimeout(onSuccess, 1500);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not submit your brief. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className={`relative w-full ${isModal ? "mx-auto max-w-5xl" : "max-w-4xl"}`}
    >
      {/* Brief Container */}
      <div className="bg-paper-card border-line text-ink relative overflow-visible rounded-lg border p-6 shadow-md sm:p-12">
        {/* Paper Form Header */}
        <div className="border-line mb-8 flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-b pb-6 sm:pb-8">
          <div className="flex items-center gap-3">
            <span className="text-ink-subtle font-mono text-xs">01</span>
            <h3 className="text-ink font-mono text-base font-semibold tracking-wider uppercase sm:text-lg">
              PROJECT BRIEF INTAKE
            </h3>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2">
              <span className="font-display text-base font-bold sm:text-lg">
                Stoneage
              </span>
              <LogoSpinner size="w-6 h-6" className="text-ink" />
            </span>
            {isModal && onClose && (
              <button
                type="button"
                onClick={onClose}
                className="text-ink-muted hover:text-ink border-line hover:border-ink rounded-full border px-3 py-1.5 font-mono text-xs tracking-widest uppercase transition-colors"
              >
                Close &times;
              </button>
            )}
          </div>
        </div>

        {submitted ? (
          <div className="space-y-4 py-16 text-center">
            <h4 className="font-display text-ink text-2xl font-medium">
              Brief Received
            </h4>
            <p className="font-body text-ink-muted mx-auto max-w-md text-sm leading-relaxed">
              Thank you for sharing your project details. A senior director from
              our Solihull HQ will review your project brief and respond within
              one business day.
            </p>
            <div className="text-ink-subtle pt-4 font-mono text-xs">
              ST / CTF &middot; ENQUIRY CONFIRMED &middot;
              STONEAGEPROPERTIES.COM
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8 sm:space-y-10">
            {/* Field 01: Name */}
            <div className="grid grid-cols-12 items-baseline gap-4">
              <span className="text-ink-subtle col-span-2 font-mono text-xs">
                01)
              </span>
              <div className="col-span-10 space-y-1.5">
                <label
                  htmlFor="brief-name"
                  className="text-ink-muted block font-mono text-sm tracking-wider uppercase"
                >
                  Name
                </label>
                <input
                  id="brief-name"
                  name="name"
                  type="text"
                  required
                  placeholder="Your full name"
                  className="border-line font-body focus:border-ink placeholder:text-ink-subtle/50 w-full border-b bg-transparent py-1.5 text-base transition-colors focus:outline-none sm:text-lg"
                />
              </div>
            </div>

            {/* Field 02: Email */}
            <div className="grid grid-cols-12 items-baseline gap-4">
              <span className="text-ink-subtle col-span-2 font-mono text-xs">
                02)
              </span>
              <div className="col-span-10 space-y-1.5">
                <label
                  htmlFor="brief-email"
                  className="text-ink-muted block font-mono text-sm tracking-wider uppercase"
                >
                  Email
                </label>
                <input
                  id="brief-email"
                  name="email"
                  type="email"
                  required
                  placeholder="name@domain.com"
                  className="border-line font-body focus:border-ink placeholder:text-ink-subtle/50 w-full border-b bg-transparent py-1.5 text-base transition-colors focus:outline-none sm:text-lg"
                />
              </div>
            </div>

            {/* Field 03: Phone */}
            <div className="grid grid-cols-12 items-baseline gap-4">
              <span className="text-ink-subtle col-span-2 font-mono text-xs">
                03)
              </span>
              <div className="col-span-10 space-y-1.5">
                <label
                  htmlFor="brief-phone"
                  className="text-ink-muted block font-mono text-sm tracking-wider uppercase"
                >
                  Phone (optional)
                </label>
                <input
                  id="brief-phone"
                  name="phone"
                  type="tel"
                  placeholder="+44 7000 000000"
                  className="border-line font-body focus:border-ink placeholder:text-ink-subtle/50 w-full border-b bg-transparent py-1.5 text-base transition-colors focus:outline-none sm:text-lg"
                />
              </div>
            </div>

            {/* Field 04: Project Type */}
            <div className="grid grid-cols-12 items-baseline gap-4">
              <span className="text-ink-subtle col-span-2 font-mono text-xs">
                04)
              </span>
              <div className="col-span-10 space-y-3">
                <span className="text-ink-muted block font-mono text-sm tracking-wider uppercase">
                  Project Type
                </span>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  {[
                    "Residential",
                    "Commercial",
                    "Renovation & Remodel",
                    "Structural Extension",
                  ].map((type) => {
                    const checked = projectTypes.includes(type);
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => toggleProjectType(type)}
                        className={`flex items-center gap-3 rounded border px-3 py-2 text-left font-mono text-sm transition-all ${
                          checked
                            ? "bg-charcoal text-paper border-charcoal"
                            : "bg-paper-warm text-ink border-line hover:border-ink-muted"
                        }`}
                      >
                        <div
                          className={`h-3 w-3 rounded-sm border ${
                            checked
                              ? "bg-paper border-paper"
                              : "border-ink-subtle"
                          }`}
                        />
                        <span>{type}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Field 05: Location */}
            <div className="grid grid-cols-12 items-baseline gap-4">
              <span className="text-ink-subtle col-span-2 font-mono text-xs">
                05)
              </span>
              <div className="col-span-10 space-y-1.5">
                <label
                  htmlFor="brief-location"
                  className="text-ink-muted block font-mono text-sm tracking-wider uppercase"
                >
                  Location
                </label>
                <input
                  id="brief-location"
                  name="location"
                  type="text"
                  placeholder="e.g. Solihull, West Midlands or Postcode"
                  className="border-line font-body focus:border-ink placeholder:text-ink-subtle/50 w-full border-b bg-transparent py-1.5 text-base transition-colors focus:outline-none sm:text-lg"
                />
              </div>
            </div>

            {/* Field 06: Timeline */}
            <div className="grid grid-cols-12 items-baseline gap-4">
              <span className="text-ink-subtle col-span-2 font-mono text-xs">
                06)
              </span>
              <div className="col-span-10 space-y-1.5">
                <label
                  htmlFor="brief-timeline"
                  className="text-ink-muted block font-mono text-sm tracking-wider uppercase"
                >
                  Timeline
                </label>
                <select
                  id="brief-timeline"
                  name="timeline"
                  defaultValue="immediate"
                  className="border-line font-body focus:border-ink w-full cursor-pointer border-b bg-transparent py-1.5 text-base transition-colors focus:outline-none sm:text-lg"
                >
                  <option value="immediate">Within 3 months</option>
                  <option value="medium">3 to 6 months</option>
                  <option value="future">6 to 12 months</option>
                  <option value="exploring">
                    Early concept / exploring feasibility
                  </option>
                </select>
              </div>
            </div>

            {/* Field 07: Tell us more (Notepad Lined Area) */}
            <div className="grid grid-cols-12 items-start gap-4">
              <span className="text-ink-subtle col-span-2 pt-2 font-mono text-xs">
                07)
              </span>
              <div className="col-span-10 space-y-1.5">
                <label
                  htmlFor="brief-message"
                  className="text-ink-muted block font-mono text-sm tracking-wider uppercase"
                >
                  Tell us more
                </label>
                <div className="border-line bg-paper relative w-full rounded border p-3">
                  <textarea
                    id="brief-message"
                    name="message"
                    rows={4}
                    defaultValue={defaultMessage}
                    placeholder="Share initial dimensions, requirements, planning permissions, or architectural aspirations..."
                    className="font-body placeholder:text-ink-subtle/40 w-full resize-none bg-transparent text-base leading-relaxed focus:outline-none sm:text-lg"
                  />
                </div>
              </div>
            </div>

            {/* Contact Consent */}
            <div className="grid grid-cols-12 items-start gap-4">
              <span className="text-ink-subtle col-span-2 font-mono text-xs" />
              <div className="col-span-10">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    required
                    checked={contactConsent}
                    onChange={(e) => setContactConsent(e.target.checked)}
                    className="border-line accent-charcoal mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded"
                  />
                  <span className="font-body text-ink-muted text-sm leading-relaxed sm:text-base">
                    I agree that Stoneage Properties may contact me by email and
                    where a phone number is provided via WhatsApp regarding this
                    enquiry. We&apos;ll only message about your Project Brief
                    and you can opt out anytime.
                  </span>
                </label>
              </div>
            </div>

            {/* Submit Action */}
            <div className="flex items-center justify-between gap-4 pt-4">
              <div>
                {error && (
                  <p className="font-mono text-xs text-red-600">{error}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="fabric-btn cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span>
                  {submitting ? "Submitting..." : "Submit Project Brief"}
                </span>
              </button>
            </div>

            {/* Footer Form Stamp */}
            <div className="border-line text-ink-subtle grid grid-cols-3 gap-2 border-t pt-6 text-center font-mono text-[9px] tracking-widest uppercase">
              <div>ST / CTF</div>
              <div>THANK YOU</div>
              <div>STONEAGE</div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
