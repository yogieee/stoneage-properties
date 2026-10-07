import Link from "next/link";
import { SpatialBriefSection } from "@/components/sections/SpatialBriefSection";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Privacy Policy",
  description:
    "How Stoneage Properties collects, uses, and protects personal data submitted through our website, project brief form, and AI chat assistant.",
  path: "/privacy",
  keywords: ["privacy policy", "data protection", "GDPR", "Stoneage Properties privacy"],
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

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#F7F5F0] pt-28 pb-16 text-[#1C1B19] sm:pt-32">
      <div className="mx-auto max-w-3xl px-3 sm:px-6 md:px-0">
        <div className="mb-12 border-b border-[#1C1B19]/10 pb-8">
          <span className="font-mono text-xs tracking-wider text-black/50 uppercase">
            Legal
          </span>
          <h1 className="text-xxl mt-3 leading-tight font-normal tracking-[-1.5px] text-black">
            Privacy Policy
          </h1>
          <p className="mt-3 font-mono text-xs tracking-wider text-black/50 uppercase">
            Last updated {LAST_UPDATED}
          </p>
        </div>

        <Section title="Who we are">
          <p>
            This website is operated by Stoneage Properties Ltd (&ldquo;Stoneage
            Properties&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;), a specialist residential
            architecture and construction practice based at 64 Stratford Rd,
            Shirley, Solihull, B90 3LP, United Kingdom. We are the data
            controller for the personal data described in this policy.
          </p>
          <p>
            For any question about this policy or your data, contact us at{" "}
            <a
              href="mailto:enquiries@stoneageproperties.com"
              className="underline underline-offset-4 hover:opacity-70"
            >
              enquiries@stoneageproperties.com
            </a>{" "}
            or 0121 537 8229.
          </p>
        </Section>

        <Section title="What we collect">
          <p>We collect personal data directly from you when you:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              Submit a project brief or enquiry through our contact form
              (name, email, phone number, project location, timeline, and
              message).
            </li>
            <li>
              Use the AI chat assistant on our site (the messages you send,
              and — only if the conversation indicates genuine interest and
              you choose to share it — your name, contact details, project
              type, timeline, and explicit consent to be contacted).
            </li>
            <li>
              Browse the site generally (page visited, referral source,
              marketing campaign tags where present, and approximate
              technical details such as user agent). We do not use
              advertising or tracking cookies for this — no cookie banner is
              shown because we do not set any non-essential cookies.
            </li>
          </ul>
        </Section>

        <Section title="How we use your data">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="text-black">Respond to enquiries</strong> —
              to review your project brief and get back to you about our
              services.
            </li>
            <li>
              <strong className="text-black">Operate the chat assistant</strong>{" "}
              — to answer questions about our services and, where you&rsquo;ve
              given consent, follow up about your project.
            </li>
            <li>
              <strong className="text-black">Understand site usage</strong> —
              aggregate, non-advertising analytics (pages visited, referral
              source) to understand what visitors find useful.
            </li>
            <li>
              <strong className="text-black">Meet legal obligations</strong> —
              such as accounting and contractual record-keeping once a
              project proceeds.
            </li>
          </ul>
          <p>
            Our legal basis is your consent (for marketing contact via the
            chat assistant and the contact-method checkbox on our form), our
            legitimate interest in responding to enquiries and understanding
            our site, and contractual necessity once you engage us for a
            project.
          </p>
        </Section>

        <Section title="Local storage, not cookies">
          <p>
            We use your browser&rsquo;s local storage (not cookies) to remember a
            random chat visitor ID and the current conversation, purely so
            the chat assistant can hold a conversation across page loads. It
            contains no personal information by itself and is not used for
            advertising or cross-site tracking.
          </p>
        </Section>

        <Section title="Who we share it with">
          <p>
            We use a small number of trusted processors to run this site.
            They only process data on our instructions and do not use it for
            their own purposes:
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="text-black">Supabase</strong> — secure
              database hosting for form submissions and chat history.
            </li>
            <li>
              <strong className="text-black">Anthropic</strong> — processes
              chat messages in real time to generate the assistant&rsquo;s
              replies.
            </li>
            <li>
              <strong className="text-black">Resend</strong> — delivers
              email notifications of new enquiries to our team.
            </li>
            <li>
              <strong className="text-black">Twilio</strong> — delivers
              WhatsApp notifications of qualified leads to our team.
            </li>
            <li>
              <strong className="text-black">Sanity</strong> — hosts our
              public content (projects, services, journal articles); no
              enquiry or chat data is stored here.
            </li>
          </ul>
          <p>
            We do not sell personal data, and we do not share it with third
            parties for their own marketing purposes.
          </p>
        </Section>

        <Section title="How long we keep it">
          <p>
            Enquiry and chat records are kept for as long as reasonably
            needed to respond to you and, if a project proceeds, for the
            duration of that relationship plus a standard retention period
            for accounting and legal purposes. You can ask us to delete your
            data at any time, as set out below.
          </p>
        </Section>

        <Section title="Your rights">
          <p>
            Under UK GDPR, you have the right to ask us for a copy of your
            data, to correct it, to have it deleted, to restrict or object to
            our processing, and to data portability. To exercise any of
            these rights, email{" "}
            <a
              href="mailto:enquiries@stoneageproperties.com"
              className="underline underline-offset-4 hover:opacity-70"
            >
              enquiries@stoneageproperties.com
            </a>
            . You also have the right to complain to the UK Information
            Commissioner&rsquo;s Office (ico.org.uk) if you believe we have not
            handled your data properly.
          </p>
        </Section>

        <Section title="Changes to this policy">
          <p>
            We may update this policy as our services or tools change. The
            &ldquo;last updated&rdquo; date above reflects the most recent
            revision. Material changes will be reflected on this page.
          </p>
        </Section>

        <p className="pt-4 text-sm text-black/60">
          See also our{" "}
          <Link
            href="/terms"
            className="underline underline-offset-4 hover:opacity-70"
          >
            Terms of Website Use
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
