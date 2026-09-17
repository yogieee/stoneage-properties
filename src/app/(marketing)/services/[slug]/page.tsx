import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Typography } from "@/components/ui/Typography";
import { LogoSpinner } from "@/components/decorative/LogoSpinner";
import { Paperclip } from "@/components/decorative/Paperclip";
import { SpatialBriefSection } from "@/components/sections/SpatialBriefSection";
import { FaqAccordionClient } from "@/components/sections/FaqAccordionClient";
import {
  getService,
  getServices,
  getProjectsByService,
  getSiteSettings,
} from "@/sanity/queries";
import { urlFor } from "@/sanity/image";
import { SITE_URL } from "@/lib/seo";

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) return {};

  const description = service.metaDescription || service.summary;
  const images = service.heroImage
    ? [urlFor(service.heroImage).width(1200).height(630).url()]
    : undefined;

  return {
    title: service.name,
    description,
    alternates: { canonical: `${SITE_URL}/services/${service.slug}` },
    openGraph: {
      title: `${service.name} | Stoneage Properties`,
      description,
      url: `${SITE_URL}/services/${service.slug}`,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: `${service.name} | Stoneage Properties`,
      description,
      images,
    },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [service, relatedProjects, siteSettings] = await Promise.all([
    getService(slug),
    getProjectsByService(slug),
    getSiteSettings(),
  ]);

  if (!service) notFound();

  const serviceAreas = siteSettings?.offices?.map((office) => office.name).filter(Boolean) ?? [];
  const phone = siteSettings?.phones?.[0]?.number;

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.metaDescription || service.summary,
    provider: {
      "@type": "Organization",
      name: "Stoneage Properties",
      url: SITE_URL,
    },
    areaServed: serviceAreas.length > 0 ? serviceAreas : undefined,
    url: `${SITE_URL}/services/${service.slug}`,
  };

  const faqJsonLd =
    service.faqs && service.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: service.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: { "@type": "Answer", text: faq.answer },
          })),
        }
      : null;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Services", item: `${SITE_URL}/services` },
      {
        "@type": "ListItem",
        position: 2,
        name: service.name,
        item: `${SITE_URL}/services/${service.slug}`,
      },
    ],
  };

  return (
    <div className="pt-16 sm:pt-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Breadcrumb */}
      <div className="px-6 pt-8 sm:px-12">
        <Link
          href="/services"
          className="group text-ink-subtle hover:text-ink inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase transition-colors"
        >
          <span className="transition-transform duration-300 group-hover:-translate-x-1">
            &larr;
          </span>
          Services
        </Link>
      </div>

      {/* Header */}
      <div className="px-6 pt-8 pb-16 sm:px-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-4 lg:items-start lg:gap-x-12">
          <div className="lg:col-span-3">
            <span className="text-ink-subtle mb-4 block font-mono text-xs tracking-widest uppercase">
              Service
            </span>
            <h1 className="font-display text-ink mb-6 text-3xl leading-[1.12] font-medium tracking-tight sm:text-5xl lg:text-6xl">
              {service.name}
            </h1>
            <Typography variant="body-lg" className="whitespace-pre-line">
              {service.description}
            </Typography>

            <div className="border-line mt-8 gap-x-8 gap-y-3 border-t pt-4 font-mono text-sm">
              <div className="flex flex-col gap-1">
                <span className="text-ink-subtle text-xs tracking-widest uppercase">
                  Serving
                </span>
                <span className="text-ink mt-1 whitespace-nowrap">
                  {serviceAreas.length > 0
                    ? serviceAreas.join(", ")
                    : "Solihull, London & Nottingham"}
                </span>
              </div>
            </div>
          </div>

          <div className="relative -rotate-2 transition-transform duration-500 hover:rotate-0 lg:col-span-1 lg:mt-2">
            <div className="pointer-events-none absolute -top-7 left-6 z-20">
              <Paperclip className="h-auto w-10 drop-shadow-md" />
            </div>

            <div className="bg-paper-card border-line text-ink relative overflow-hidden rounded border p-6 shadow-md">
              <div className="border-line mb-6 flex items-center justify-between gap-2 border-b pb-4">
                <span className="text-ink-subtle min-w-0 flex-1 truncate font-mono text-[10px] tracking-widest uppercase">
                  A NOTE FROM STONEAGE
                </span>
                <div className="flex shrink-0 items-center gap-1.5">
                  <span className="font-display text-xs font-medium">Stoneage</span>
                  <LogoSpinner size="w-3.5 h-3.5" className="text-ink" />
                </div>
              </div>
              <div className="notepad-lines font-display text-ink-muted py-2 text-base italic">
                <p className="mb-0 pl-1 leading-loose">
                  {service.note?.line || "Calm homes, lasting craft."}
                </p>
                <p className="text-ink-subtle pl-1 font-mono text-sm leading-loose not-italic">
                  {service.note?.subline ||
                    "30+ years delivering structural excellence across the UK."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero image */}
      {service.heroImage && (
        <div className="bg-paper-dim relative aspect-[16/10] w-full overflow-hidden sm:aspect-[21/9]">
          <Image
            src={urlFor(service.heroImage).width(2400).height(1029).url()}
            alt={service.name}
            fill
            priority
            className="object-cover"
          />
        </div>
      )}

      {/* Body: warranty */}
      <div className="mx-auto max-w-3xl px-6 py-16 sm:px-12 sm:py-24">
        <div className="border-line rounded-2xl border p-6">
          <Typography variant="display-sm" as="h2" className="mb-2">
            {service.warranty.label}
          </Typography>
          <Typography variant="body">{service.warranty.detail}</Typography>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            href="#contact"
            className="bg-charcoal text-paper hover:bg-ink inline-flex items-center gap-3 rounded-full px-8 py-3.5 font-mono text-xs tracking-wider uppercase shadow-md transition-all duration-300 hover:shadow-lg"
          >
            Book a Consultation
          </Link>
          {phone && (
            <a
              href={`tel:${phone.replace(/\s+/g, "")}`}
              className="border-line text-ink hover:border-ink inline-flex items-center gap-3 rounded-full border px-8 py-3.5 font-mono text-xs tracking-wider uppercase transition-colors"
            >
              Call {phone}
            </a>
          )}
        </div>
      </div>

      {/* Process: how it works + how we work with you */}
      {service.process && service.process.length > 0 && (
        <section className="border-line bg-paper-dim border-t px-6 py-20 sm:px-12 sm:py-28">
          <div className="mx-auto max-w-5xl">
            <Typography variant="display-sm" as="h2" className="mb-12">
              How It Works
            </Typography>
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
              {service.process.map((step, index) => (
                <div key={step.title} className="flex gap-5">
                  <span className="text-ink/15 font-mono text-4xl leading-none font-light select-none sm:text-5xl">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <Typography variant="display-sm" as="h3" className="mb-2 text-lg sm:text-xl">
                      {step.title}
                    </Typography>
                    <Typography variant="body">{step.detail}</Typography>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* What's included */}
      {service.features && service.features.length > 0 && (
        <section className="px-6 py-20 sm:px-12 sm:py-28">
          <div className="mx-auto max-w-5xl">
            <Typography variant="display-sm" as="h2" className="mb-10">
              What&rsquo;s Included
            </Typography>
            <ul className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
              {service.features.map((feature) => (
                <li key={feature} className="border-line flex items-start gap-3 border-b pb-4">
                  <LogoSpinner size="h-4 w-4" className="text-ink-subtle mt-0.5 shrink-0" />
                  <Typography variant="body">{feature}</Typography>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* FAQ */}
      {service.faqs && service.faqs.length > 0 && (
        <section className="border-line bg-paper-dim border-t px-6 py-20 sm:px-12 sm:py-28">
          <div className="mx-auto max-w-3xl">
            <Typography variant="display-sm" as="h2" className="mb-10">
              Frequently Asked Questions
            </Typography>
            <FaqAccordionClient faqs={service.faqs} />
          </div>
        </section>
      )}

      {/* Explore Related Work */}
      {relatedProjects.length > 0 && (
        <section className="px-6 py-20 sm:px-12 sm:py-28">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 flex items-end justify-between gap-4">
              <Typography variant="display-sm" as="h2">
                Explore Related Work
              </Typography>
              <Link
                href="/projects"
                className="group text-ink-muted hover:text-ink hidden shrink-0 items-center gap-2 font-mono text-xs tracking-wider uppercase transition-colors sm:inline-flex"
              >
                View All
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  &rarr;
                </span>
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
              {relatedProjects.slice(0, 3).map((item) => (
                <Link key={item.slug} href={`/projects/${item.slug}`} className="group block">
                  <div className="border-line bg-paper-card relative aspect-[4/3] w-full overflow-hidden rounded-lg border shadow-sm transition-all group-hover:shadow-md">
                    <Image
                      src={urlFor(item.image).width(700).height(525).url()}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-4 flex items-start justify-between gap-3">
                    <div>
                      <span className="text-ink-subtle mb-1 block font-mono text-[10px] uppercase">
                        {item.location}
                      </span>
                      <h3 className="font-display text-ink group-hover:text-ink-muted text-lg leading-snug font-medium transition-colors">
                        {item.title}
                      </h3>
                    </div>
                    <LogoSpinner
                      spin="hover"
                      size="h-4 w-4"
                      className="text-ink-subtle mt-1 shrink-0 group-hover:text-ink"
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <SpatialBriefSection
        eyebrow="Book a Consultation"
        heading={`Start a conversation about your ${service.name} project.`}
        intro={`Tell us about your space and timeline, and a senior director from our team will get back to you within one business day to discuss how we can help with your ${service.name.toLowerCase()} project.`}
        defaultMessage={`Enquiry: ${service.name}\n\n`}
      />
    </div>
  );
}
