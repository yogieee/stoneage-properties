"use client";

import { useState } from "react";
import { Paperclip } from "@/components/decorative/Paperclip";
import { LogoSpinner } from "@/components/decorative/LogoSpinner";

interface SpatialBriefFormProps {
  isModal?: boolean;
  onSuccess?: () => void;
  onClose?: () => void;
}

export function SpatialBriefForm({
  isModal = false,
  onSuccess,
  onClose,
}: SpatialBriefFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [projectTypes, setProjectTypes] = useState<string[]>(["Residential"]);

  const toggleProjectType = (type: string) => {
    setProjectTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (onSuccess) {
      setTimeout(onSuccess, 1500);
    }
  };

  return (
    <div
      className={`relative w-full ${isModal ? "mx-auto max-w-4xl" : "max-w-3xl"}`}
    >
      {/* Signature Paperclip pinned over top edge */}
      <div className="pointer-events-none absolute -top-24 left-6 z-30 sm:-top-16 sm:left-12">
        <Paperclip className="h-auto w-12 drop-shadow-lg sm:w-16" />
      </div>

      {/* Tactile Paper Brief Container */}
      <div className="paper-texture bg-paper-card border-line text-ink relative overflow-visible rounded-lg border p-6 shadow-xl sm:p-12">
        {/* Paper Form Header */}
        <div className="border-line mb-8 flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-b pb-6 sm:pb-8">
          <div className="flex items-center gap-3">
            <span className="text-ink-subtle font-mono text-xs">01</span>
            <h3 className="text-ink font-mono text-sm font-semibold tracking-wider uppercase sm:text-base">
              SPATIAL BRIEF INTAKE
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
              our Solihull HQ will review your spatial brief and respond within
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
                  className="text-ink-muted block font-mono text-xs tracking-wider uppercase"
                >
                  Name
                </label>
                <input
                  id="brief-name"
                  type="text"
                  required
                  placeholder="Your full name"
                  className="border-line font-body focus:border-ink placeholder:text-ink-subtle/50 w-full border-b bg-transparent py-1.5 text-sm transition-colors focus:outline-none sm:text-base"
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
                  className="text-ink-muted block font-mono text-xs tracking-wider uppercase"
                >
                  Email
                </label>
                <input
                  id="brief-email"
                  type="email"
                  required
                  placeholder="name@domain.com"
                  className="border-line font-body focus:border-ink placeholder:text-ink-subtle/50 w-full border-b bg-transparent py-1.5 text-sm transition-colors focus:outline-none sm:text-base"
                />
              </div>
            </div>

            {/* Field 03: Project Type */}
            <div className="grid grid-cols-12 items-baseline gap-4">
              <span className="text-ink-subtle col-span-2 font-mono text-xs">
                03)
              </span>
              <div className="col-span-10 space-y-3">
                <span className="text-ink-muted block font-mono text-xs tracking-wider uppercase">
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
                        className={`flex items-center gap-3 rounded border px-3 py-2 text-left font-mono text-xs transition-all ${
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

            {/* Field 04: Location */}
            <div className="grid grid-cols-12 items-baseline gap-4">
              <span className="text-ink-subtle col-span-2 font-mono text-xs">
                04)
              </span>
              <div className="col-span-10 space-y-1.5">
                <label
                  htmlFor="brief-location"
                  className="text-ink-muted block font-mono text-xs tracking-wider uppercase"
                >
                  Location
                </label>
                <input
                  id="brief-location"
                  type="text"
                  placeholder="e.g. Solihull, London, Nottingham or Postcode"
                  className="border-line font-body focus:border-ink placeholder:text-ink-subtle/50 w-full border-b bg-transparent py-1.5 text-sm transition-colors focus:outline-none sm:text-base"
                />
              </div>
            </div>

            {/* Field 05: Timeline */}
            <div className="grid grid-cols-12 items-baseline gap-4">
              <span className="text-ink-subtle col-span-2 font-mono text-xs">
                05)
              </span>
              <div className="col-span-10 space-y-1.5">
                <label
                  htmlFor="brief-timeline"
                  className="text-ink-muted block font-mono text-xs tracking-wider uppercase"
                >
                  Timeline
                </label>
                <select
                  id="brief-timeline"
                  className="border-line font-body focus:border-ink w-full cursor-pointer border-b bg-transparent py-1.5 text-sm transition-colors focus:outline-none sm:text-base"
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

            {/* Field 06: Tell us more (Notepad Lined Area) */}
            <div className="grid grid-cols-12 items-start gap-4">
              <span className="text-ink-subtle col-span-2 pt-2 font-mono text-xs">
                06)
              </span>
              <div className="col-span-10 space-y-1.5">
                <label
                  htmlFor="brief-message"
                  className="text-ink-muted block font-mono text-xs tracking-wider uppercase"
                >
                  Tell us more
                </label>
                <div className="border-line bg-paper relative w-full rounded border p-3">
                  <textarea
                    id="brief-message"
                    rows={4}
                    placeholder="Share initial dimensions, requirements, planning permissions, or architectural aspirations..."
                    className="notepad-lines font-body placeholder:text-ink-subtle/40 w-full resize-none bg-transparent text-sm leading-[2.25rem] focus:outline-none sm:text-base"
                  />
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div className="flex items-center justify-between pt-4">
              <div />
              <button
                type="submit"
                className="group bg-charcoal text-paper hover:bg-ink inline-flex items-center gap-4 rounded-full px-8 py-3.5 font-mono text-xs tracking-wider uppercase shadow-md transition-all duration-300 hover:shadow-lg"
              >
                <span>Submit Spatial Brief</span>
                <LogoSpinner spin="hover" size="h-5 w-5" className="text-paper" />
              </button>
            </div>

            {/* Footer Form Stamp */}
            <div className="border-line text-ink-subtle grid grid-cols-3 gap-2 border-t pt-6 text-center font-mono text-[9px] tracking-widest uppercase">
              <div>ST / CTF</div>
              <div>THANK YOU</div>
              <div>STOREYARCHITECTURE / STONEAGE</div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
