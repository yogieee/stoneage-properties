import { TestimonialsSliderClient } from "@/components/sections/TestimonialsSliderClient";
import { getTestimonials } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";

export async function TestimonialsSlider() {
  const testimonials = await getTestimonials();

  return (
    <TestimonialsSliderClient
      testimonials={testimonials.map((testimonial) => ({
        quote: testimonial.quote,
        author: testimonial.author,
        role: testimonial.role,
        image: testimonial.image
          ? urlFor(testimonial.image).width(900).height(675).url()
          : "",
      }))}
    />
  );
}
