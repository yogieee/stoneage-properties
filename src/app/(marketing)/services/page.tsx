import Link from "next/link";
import { Typography } from "@/components/ui/Typography";
import { getServices } from "@/sanity/queries";

export const metadata = {
  title: "Services | Stoneage Properties",
  description:
    "New builds, renovations, extensions, and conversions delivered by Stoneage Properties across Solihull, London, and Nottingham.",
};

export default async function ServicesIndexPage() {
  const services = await getServices();

  return (
    <div className="px-6 pt-32 pb-24 sm:px-12 sm:pt-40">
      <Typography variant="display-lg" as="h1" className="mb-16">
        Services
      </Typography>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <Link
            key={service.slug}
            href={`/services/${service.slug}`}
            className="border-line group flex h-full flex-col gap-3 rounded-2xl border p-6 transition-colors hover:bg-paper-dim"
          >
            <Typography variant="display-sm" as="h2">
              {service.name}
            </Typography>
            <Typography variant="body">{service.summary}</Typography>
            <Typography
              variant="body-sm"
              className="text-ink-subtle mt-auto"
            >
              {service.warranty.label}
            </Typography>
          </Link>
        ))}
      </div>
    </div>
  );
}
