import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FaqAccordionClient } from "@/components/sections/FaqAccordionClient";
import { SpatialBriefSection } from "@/components/sections/SpatialBriefSection";
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
  const [service, relatedProjects, allServices, siteSettings] = await Promise.all([
    getService(slug),
    getProjectsByService(slug),
    getServices(),
    getSiteSettings(),
  ]);

  if (!service) notFound();

  const otherServices =
    relatedProjects.length === 0
      ? allServices.filter((item) => item.slug !== slug).slice(0, 3)
      : [];

  const serviceAreas = siteSettings?.offices?.map((office) => office.name).filter(Boolean) ?? [];
  const servingLine =
    serviceAreas.length > 0 ? serviceAreas.join(", ") : "Solihull";
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

  const assuranceItems = [
    {
      title: service.warranty.label,
      description: service.warranty.detail,
    },
    ...(service.note?.line
      ? [
          {
            title: "A Note From Stoneage",
            description: [service.note.line, service.note.subline].filter(Boolean).join(" "),
          },
        ]
      : []),
  ];

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#1C1B19]">
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

      {/* Back link */}
      <div className="px-3 pt-6 sm:px-6 md:px-12">
        <Link
          href="/services"
          className="group inline-flex items-center gap-2 font-mono text-xs tracking-wider text-black/50 uppercase transition-colors hover:text-black"
        >
          <span className="transition-transform duration-300 group-hover:-translate-x-1">
            &larr;
          </span>
          Services
        </Link>
      </div>

      {/* 1. Hero matching Build / Design / Studio framing */}
      <section className="relative h-[80vh] w-full bg-[#F7F5F0] px-3 pt-6 text-[#1C1B19] select-none sm:px-6 md:h-[90vh] md:px-12">
        <div className="relative flex h-full w-full flex-col justify-between pb-[72px]">
          <div className="relative h-full w-full overflow-hidden bg-black">
            {service.heroImage ? (
              <Image
                src={urlFor(service.heroImage).width(2400).height(1200).url()}
                alt={service.name}
                fill
                priority
                className="object-cover opacity-90"
                sizes="100vw"
              />
            ) : (
              <div className="h-full w-full bg-black/80" />
            )}
          </div>

          <div className="absolute bottom-0 left-0 flex h-[72px] w-full items-center justify-between gap-3 border-b border-black/10">
            <div className="flex items-baseline gap-2 sm:gap-3">
              <h1 className="text-base font-normal tracking-[-1px] text-black sm:text-2xl">
                {service.name}
              </h1>
              <span className="font-mono text-[11px] tracking-wider text-black/50 uppercase sm:text-sm">
                ST-{service.slug.toUpperCase()}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm font-normal tracking-[-0.5px] text-black sm:text-base">
              <span>Scroll</span>
              <span className="font-mono text-sm">&darr;</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Section: Overview (layout-2-4) */}
      <section className="w-full border-b border-black/10 px-3 py-16 sm:px-6 md:px-12 md:py-24">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-4">
            <h2 className="text-xxl leading-none font-normal tracking-[-1.5px] text-black">
              Overview
            </h2>
            <div className="mt-4 font-mono text-xs tracking-wider text-black/50 uppercase">
              Serving {servingLine}
            </div>
          </div>

          <div className="text-reg max-w-3xl space-y-5 leading-relaxed text-black/80 md:col-span-8">
            <p className="text-lg font-medium tracking-[-0.5px] text-black sm:text-xl">
              {service.summary}
            </p>
            <p className="whitespace-pre-line">{service.description}</p>
          </div>
        </div>

        {/* Warranty & Note strip */}
        <div className="mt-16 grid grid-cols-1 gap-8 border-t border-black/10 pt-10 sm:grid-cols-2">
          {assuranceItems.map((item) => (
            <div key={item.title}>
              <h3 className="font-display mb-2 text-xl font-medium tracking-tight text-black">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed font-light text-black/70">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link href="#contact" className="fabric-btn">
            Book a Consultation
          </Link>
          {phone && (
            <a
              href={`tel:${phone.replace(/\s+/g, "")}`}
              className="inline-flex items-center gap-2 border border-black/10 px-6 py-3 font-mono text-xs tracking-wider text-black uppercase transition-colors hover:border-black"
            >
              Call {phone}
            </a>
          )}
        </div>
      </section>

      {/* 3. Section: How It Works (layout-2-4) */}
      {service.process && service.process.length > 0 && (
        <section className="w-full border-b border-black/10 px-3 py-16 sm:px-6 md:px-12 md:py-24">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-12">
            <div className="md:col-span-4">
              <h2 className="text-xxl leading-none font-normal tracking-[-1.5px] text-black">
                How It Works
              </h2>
              <p className="mt-3 max-w-xs text-sm text-black/60">
                How the {service.name.toLowerCase()} process runs from first call to handover.
              </p>
            </div>

            <div className="space-y-6 md:col-span-8">
              {service.process.map((step, index) => (
                <div
                  key={step.title}
                  className="flex flex-col justify-between gap-4 border-t border-black/10 pt-4 sm:flex-row sm:items-baseline"
                >
                  <div className="sm:w-1/3">
                    <span className="mb-1 block font-mono text-xs tracking-wider text-black/50 uppercase">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-lg font-medium text-black">{step.title}</h3>
                  </div>
                  <p className="text-sm leading-relaxed font-light text-black/70 sm:w-2/3">
                    {step.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. Section: What's Included (grid matching Assurance) */}
      {service.features && service.features.length > 0 && (
        <section className="w-full border-b border-black/10 px-3 py-16 sm:px-6 md:px-12 md:py-24">
          <div className="mb-12 border-b border-black/10 pb-6">
            <h2 className="text-xxl font-normal tracking-[-1.5px] text-black">
              What&rsquo;s Included
            </h2>
            <p className="text-reg mt-2 text-black/70">
              Every {service.name.toLowerCase()} project includes the following as standard
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {service.features.map((feature, index) => (
              <div key={feature} className="border-t border-black/10 pt-4">
                <span className="mb-2 block font-mono text-xs tracking-wider text-black/50 uppercase">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="text-sm leading-relaxed font-light text-black/70">{feature}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. Section: FAQ */}
      {service.faqs && service.faqs.length > 0 && (
        <section className="w-full border-b border-black/10 px-3 py-16 sm:px-6 md:px-12 md:py-24">
          <div className="mb-12 border-b border-black/10 pb-6">
            <h2 className="text-xxl font-normal tracking-[-1.5px] text-black">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="mx-auto max-w-3xl [&_button]:text-black [&_p]:text-black/70 [&_span]:text-black/50">
            <FaqAccordionClient faqs={service.faqs} />
          </div>
        </section>
      )}

      {/* 6. Section: Explore Related Work (falls back to other services) */}
      {(relatedProjects.length > 0 || otherServices.length > 0) && (
        <section className="w-full border-b border-black/10 px-3 py-16 sm:px-6 md:px-12 md:py-24">
          <div className="mb-12 flex items-end justify-between gap-4 border-b border-black/10 pb-6">
            <h2 className="text-xxl font-normal tracking-[-1.5px] text-black">
              {relatedProjects.length > 0 ? "Explore Related Work" : "Explore Other Services"}
            </h2>
            <Link
              href={relatedProjects.length > 0 ? "/projects" : "/services"}
              className="group hidden shrink-0 items-center gap-2 font-mono text-xs tracking-wider text-black/50 uppercase transition-colors hover:text-black sm:inline-flex"
            >
              View All
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                &rarr;
              </span>
            </Link>
          </div>

          {relatedProjects.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              {relatedProjects.slice(0, 3).map((item) => (
                <Link key={item.slug} href={`/projects/${item.slug}`} className="group block">
                  <div className="relative mb-3 aspect-[4/3] w-full overflow-hidden bg-black/5">
                    <Image
                      src={urlFor(item.image).width(700).height(525).url()}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>
                  <div className="flex items-start justify-between gap-3 border-t border-black/10 pt-3">
                    <div>
                      <span className="mb-1 block font-mono text-[10px] tracking-wider text-black/50 uppercase">
                        {item.location}
                      </span>
                      <h3 className="text-lg font-normal tracking-[-0.5px] text-black transition-opacity group-hover:opacity-75">
                        {item.title}
                      </h3>
                    </div>
                    <span className="font-mono text-sm text-black transition-transform group-hover:translate-x-1">
                      &rarr;
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              {otherServices.map((item) => (
                <Link
                  key={item.slug}
                  href={`/services/${item.slug}`}
                  className="group block"
                >
                  <div className="relative mb-3 aspect-[4/3] w-full overflow-hidden bg-black/5">
                    {item.heroImage ? (
                      <Image
                        src={urlFor(item.heroImage).width(700).height(525).url()}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    ) : (
                      <div className="h-full w-full bg-black/5" />
                    )}
                  </div>
                  <div className="flex items-start justify-between gap-3 border-t border-black/10 pt-3">
                    <div>
                      <h3 className="text-lg font-normal tracking-[-0.5px] text-black transition-opacity group-hover:opacity-75">
                        {item.name}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-sm leading-relaxed font-light text-black/70">
                        {item.summary}
                      </p>
                    </div>
                    <span className="font-mono text-sm text-black transition-transform group-hover:translate-x-1">
                      &rarr;
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      )}

      {/* 7. Section: Explore Navigation */}
      <section className="w-full px-3 py-16 sm:px-6 md:px-12 md:py-20">
        <div className="mb-10 flex items-baseline justify-between border-b border-black/10 pb-4">
          <h2 className="text-xxl font-normal tracking-[-1.5px] text-black">Explore</h2>
          <span className="font-mono text-xs tracking-wider text-black/50 uppercase">
            Navigation &rarr;
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/craftsmanship" className="group block">
            <div className="relative mb-3 aspect-[4/3] w-full overflow-hidden bg-black">
              <Image
                src="/images/hero/build-stone-masonry.png"
                alt="Specialist Building & Master Craftsmanship"
                fill
                className="object-cover contrast-110 grayscale transition-all duration-700 ease-out group-hover:scale-105 group-hover:grayscale-0"
              />
            </div>
            <div className="flex items-center justify-between border-t border-black/10 pt-2">
              <span className="text-lg font-normal tracking-[-0.5px]">
                Craftsmanship
              </span>
              <span className="font-mono text-base transition-transform duration-300 group-hover:translate-x-1">
                &rarr;
              </span>
            </div>
          </Link>

          <Link href="/build" className="group block">
            <div className="relative mb-3 aspect-[4/3] w-full overflow-hidden bg-black">
              <Image
                src="/images/hero/build-hero.png"
                alt="Build & Delivery"
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
            <div className="flex items-center justify-between border-t border-black/10 pt-2">
              <span className="text-lg font-normal tracking-[-0.5px]">Build</span>
              <span className="font-mono text-base transition-transform duration-300 group-hover:translate-x-1">
                &rarr;
              </span>
            </div>
          </Link>

          <Link href="/ourstudio" className="group block">
            <div className="relative mb-3 aspect-[4/3] w-full overflow-hidden bg-black">
              <Image
                src="/images/hero/studio-hero.png"
                alt="Our Studio"
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
            <div className="flex items-center justify-between border-t border-black/10 pt-2">
              <span className="text-lg font-normal tracking-[-0.5px]">Studio</span>
              <span className="font-mono text-base transition-transform duration-300 group-hover:translate-x-1">
                &rarr;
              </span>
            </div>
          </Link>

          <Link href="/projects" className="group block">
            <div className="relative mb-3 aspect-[4/3] w-full overflow-hidden bg-black">
              <Image
                src="/images/hero/projects-panel.png"
                alt="Projects"
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
            <div className="flex items-center justify-between border-t border-black/10 pt-2">
              <span className="text-lg font-normal tracking-[-0.5px]">Projects</span>
              <span className="font-mono text-base transition-transform duration-300 group-hover:translate-x-1">
                &rarr;
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* 8. Project Brief Consultation */}
      <SpatialBriefSection
        eyebrow="Book a Consultation"
        heading={`Start a conversation about your ${service.name} project.`}
        intro={`Tell us about your space and timeline, and a senior director from our team will get back to you within one business day to discuss how we can help with your ${service.name.toLowerCase()} project.`}
        defaultMessage={`Enquiry: ${service.name}\n\n`}
      />
    </div>
  );
}
