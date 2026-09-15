import { TextReveal } from "@/components/motion/TextReveal";
import { Reveal } from "@/components/motion/Reveal";
import { Typography } from "@/components/ui/Typography";
import { getServices } from "@/sanity/queries";

/**
 * Condensed services teaser for the single-page homepage. Shows only
 * `name`, `summary`, and `warranty.label` for each service — the full
 * `description` and `warranty.detail` stay reserved for Phase 3's
 * per-service case study pages (02-CONTEXT.md).
 *
 * Renders the section *content* only; the caller wraps this in the
 * `<section id="services">` element so it stays reusable/testable
 * independent of the page's anchor wiring.
 */
export async function ServicesSection() {
  const services = await getServices();

  return (
    <div className="flex flex-col gap-10">
      <TextReveal as="h2" className="font-display text-display-md text-ink">
        What We Do
      </TextReveal>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => (
          <Reveal key={service.slug} delay={index * 0.05}>
            <div className="border-line flex h-full flex-col gap-3 rounded-2xl border p-6">
              <Typography variant="display-sm" as="h3">
                {service.name}
              </Typography>
              <Typography variant="body">{service.summary}</Typography>
              <Typography variant="body-sm" className="text-ink-subtle mt-auto">
                {service.warranty.label}
              </Typography>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
