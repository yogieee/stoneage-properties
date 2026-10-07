import Link from "next/link";
import { SpatialBriefSection } from "@/components/sections/SpatialBriefSection";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Terms of Website Use",
  description:
    "Terms governing use of the Stoneage Properties website, including content ownership, acceptable use, and liability.",
  path: "/terms",
  keywords: ["terms of use", "website terms", "Stoneage Properties terms"],
});

const LAST_UPDATED = "7 October 2026";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-[#1C1B19]/10 py-10 first:pt-0 last:border-b-0">
      <h2 className="text-xl mb-4 font-normal tracking-[-0.5px] text-black">
        {title}
      </h2>
      <div className="text-reg space-y-4 leading-relaxed text-black/75">
        {children}
      </div>
    </section>
  );
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F7F5F0] pt-28 pb-16 text-[#1C1B19] sm:pt-32">
      <div className="mx-auto max-w-3xl px-3 sm:px-6 md:px-0">
        <div className="mb-12 border-b border-[#1C1B19]/10 pb-8">
          <span className="font-mono text-xs tracking-wider text-black/50 uppercase">
            Legal
          </span>
          <h1 className="text-xxl mt-3 leading-tight font-normal tracking-[-1.5px] text-black">
            Terms of Website Use
          </h1>
          <p className="mt-3 font-mono text-xs tracking-wider text-black/50 uppercase">
            Last updated {LAST_UPDATED}
          </p>
        </div>

        <Section title="Acceptance of these terms">
          <p>
            These terms govern your use of this website, operated by
            Stoneage Properties Ltd (&ldquo;Stoneage Properties&rdquo;,
            &ldquo;we&rdquo;, &ldquo;us&rdquo;). By browsing this site, submitting a
            project brief, or using the chat assistant, you accept these
            terms in full.
          </p>
        </Section>

        <Section title="Content is for information only">
          <p>
            Project photography, pricing indications, timelines, and
            descriptions of services on this site are illustrative and for
            general information only. They do not constitute a quotation,
            an architectural or structural recommendation, or an offer
            capable of acceptance. Specific advice for your property is
            only given once we&rsquo;ve reviewed your brief and, where
            appropriate, visited the site.
          </p>
        </Section>

        <Section title="The AI chat assistant">
          <p>
            The chat assistant provides general information about our
            services and helps triage enquiries. Its responses are
            generated automatically and, while we aim for accuracy, should
            not be relied on as a substitute for advice from our team.
            Anything that matters to your project should be confirmed with
            us directly in writing.
          </p>
        </Section>

        <Section title="Intellectual property">
          <p>
            Unless otherwise credited, the text, photography, and project
            case studies on this site belong to Stoneage Properties or are
            used with permission from our clients. You may view and share
            pages for personal, non-commercial reference, but may not
            reproduce, redistribute, or use our content or imagery
            commercially without our written consent.
          </p>
        </Section>

        <Section title="Acceptable use">
          <p>
            You agree not to misuse this site — including attempting to
            gain unauthorised access to it, disrupting its operation, or
            submitting false, abusive, or unlawful content through our
            forms or chat assistant.
          </p>
        </Section>

        <Section title="Liability">
          <p>
            We take reasonable care to keep this site accurate and
            available, but it is provided &ldquo;as is&rdquo; without
            warranties of any kind. We are not liable for any loss arising
            from reliance on general content on this site, or from
            temporary unavailability of the site or its features.
          </p>
        </Section>

        <Section title="Governing law">
          <p>
            These terms are governed by the laws of England and Wales, and
            any dispute relating to this site falls under the exclusive
            jurisdiction of the courts of England and Wales.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Questions about these terms can be sent to{" "}
            <a
              href="mailto:enquiries@stoneageproperties.com"
              className="underline underline-offset-4 hover:opacity-70"
            >
              enquiries@stoneageproperties.com
            </a>
            .
          </p>
        </Section>

        <p className="pt-4 text-sm text-black/60">
          See also our{" "}
          <Link
            href="/privacy"
            className="underline underline-offset-4 hover:opacity-70"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>

      <div className="mt-20">
        <SpatialBriefSection />
      </div>
    </div>
  );
}
