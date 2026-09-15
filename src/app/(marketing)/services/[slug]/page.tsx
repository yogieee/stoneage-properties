import { notFound } from "next/navigation";
import { Typography } from "@/components/ui/Typography";
import { getService, getServices } from "@/sanity/queries";

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

  return {
    title: `${service.name} | Stoneage Properties`,
    description: service.summary,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await getService(slug);

  if (!service) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 pt-32 pb-24 sm:px-12 sm:pt-40">
      <Typography variant="display-lg" as="h1" className="mb-6">
        {service.name}
      </Typography>
      <Typography variant="body-lg" className="mb-10">
        {service.description}
      </Typography>

      <div className="border-line rounded-2xl border p-6">
        <Typography variant="display-sm" as="h2" className="mb-2">
          {service.warranty.label}
        </Typography>
        <Typography variant="body">{service.warranty.detail}</Typography>
      </div>
    </div>
  );
}
