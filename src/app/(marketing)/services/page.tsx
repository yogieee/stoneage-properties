import Image from "next/image";
import Link from "next/link";
import { Typography } from "@/components/ui/Typography";
import { getServices } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";

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

      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <Link key={service.slug} href={`/services/${service.slug}`} className="group block">
            <div className="border-line bg-paper-card relative aspect-[4/3] w-full overflow-hidden rounded-lg border shadow-sm transition-all group-hover:shadow-md">
              {service.heroImage ? (
                <Image
                  src={urlFor(service.heroImage).width(700).height(525).url()}
                  alt={service.name}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              ) : (
                <div className="bg-paper-dim absolute inset-0" />
              )}
            </div>
            <div className="mt-4">
              <Typography variant="display-sm" as="h2" className="text-lg sm:text-xl">
                {service.name}
              </Typography>
              <Typography variant="body" className="mt-2">
                {service.summary}
              </Typography>
              <Typography variant="body-sm" className="text-ink-subtle mt-3">
                {service.warranty.label}
              </Typography>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
