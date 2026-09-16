import Image from "next/image";
import Link from "next/link";
import { getServices } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";

const FEATURED_SLUGS = ["new-builds", "renovations", "extensions", "kitchens"];

export async function MoreServicesGrid() {
  const services = await getServices();
  const rest = services.filter((service) => !FEATURED_SLUGS.includes(service.slug));

  if (rest.length === 0) return null;

  return (
    <section className="bg-paper text-ink border-line border-t py-24 sm:py-36">
      <div className="px-6 sm:px-12">
        <div className="border-line mb-16 flex flex-col justify-between gap-4 border-b pb-8 sm:mb-20 sm:flex-row sm:items-end">
          <div>
            <span className="text-ink-subtle mb-3 block font-mono text-xs tracking-widest uppercase">
              Full Range
            </span>
            <h2 className="font-display text-ink text-3xl font-medium tracking-tight sm:text-5xl">
              More ways we can help
            </h2>
          </div>
          <p className="font-body text-ink-muted max-w-sm text-base leading-relaxed sm:text-lg">
            Beyond our core expertise, Stoneage delivers a full range of
            specialist residential construction services.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-12">
          {rest.map((service) => (
            <Link key={service.slug} href={`/services/${service.slug}`} className="group block">
              <div className="border-line bg-paper-card relative aspect-[4/3] w-full overflow-hidden rounded-lg border shadow-sm transition-all group-hover:shadow-md">
                {service.heroImage ? (
                  <Image
                    src={urlFor(service.heroImage).width(900).height(675).url()}
                    alt={service.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                ) : (
                  <div className="bg-paper-dim absolute inset-0" />
                )}
              </div>
              <div className="mt-4">
                <h3 className="font-display text-ink group-hover:text-ink-muted text-lg leading-snug font-medium transition-colors sm:text-xl">
                  {service.name}
                </h3>
                <p className="font-body text-ink-muted mt-2 text-sm leading-relaxed sm:text-base">
                  {service.summary}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
