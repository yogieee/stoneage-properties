import { HeroCarousel } from "@/components/sections/HeroCarousel";
import { getHeroSlides } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";

export async function Hero() {
  const heroSlides = await getHeroSlides();
  const slides = heroSlides.map((slide) => ({
    src: urlFor(slide.image).width(1920).height(1080).url(),
    alt: slide.alt,
    tag: slide.tag,
    title: slide.title,
    caption: slide.caption,
  }));

  return <HeroCarousel slides={slides} />;
}
