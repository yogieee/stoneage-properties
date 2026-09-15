import { ExpertiseSectionClient } from "@/components/sections/ExpertiseSectionClient";
import { getExpertiseAreas } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";

export async function ExpertiseSection() {
  const areas = await getExpertiseAreas();

  return (
    <ExpertiseSectionClient
      areas={areas.map((area) => ({
        number: area.number,
        title: area.title,
        description: area.description,
        image: urlFor(area.image).width(1200).height(720).url(),
      }))}
    />
  );
}
