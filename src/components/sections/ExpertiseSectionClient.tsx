"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { GeometricLogo } from "@/components/decorative/GeometricLogo";
import { gsap } from "@/lib/gsap";

type ExpertiseItem = {
  number: string;
  title: string;
  description: string;
  image: string;
};

type ExpertiseSectionClientProps = {
  areas: ExpertiseItem[];
};

export function ExpertiseSectionClient({ areas }: ExpertiseSectionClientProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const overlayRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // 2 going over 1 scroll effect:
      // As next card (e.g. 2) slides over current card (e.g. 1):
      // Current card recedes (scale 0.96) and its background turns grey from white!
      areas.forEach((_, i) => {
        if (i < areas.length - 1) {
          const currentCard = cardRefs.current[i];
          const currentOverlay = overlayRefs.current[i];
          const nextCard = cardRefs.current[i + 1];

          if (currentCard && nextCard && currentOverlay) {
            // Turn grey from white bg
            gsap.to(currentOverlay, {
              opacity: 0.55,
              ease: "none",
              scrollTrigger: {
                trigger: nextCard,
                start: "top bottom",
                end: "top 20%",
                scrub: true,
              },
            });

            // Recede backwards slightly into the depth stack
            gsap.to(currentCard, {
              scale: 0.96,
              transformOrigin: "center top",
              ease: "none",
              scrollTrigger: {
                trigger: nextCard,
                start: "top bottom",
                end: "top 20%",
                scrub: true,
              },
            });
          }
        }

        // Parallax scrub on card image
        const imgEl = imageRefs.current[i];
        const cardEl = cardRefs.current[i];
        if (imgEl && cardEl) {
          gsap.to(imgEl, {
            y: "10%",
            ease: "none",
            scrollTrigger: {
              trigger: cardEl,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
        }
      });

      // Last card: as next section (StatementBanner) rolls in over it, it recedes and turns grey with no dead space!
      const lastCard = cardRefs.current[areas.length - 1];
      const lastOverlay = overlayRefs.current[areas.length - 1];

      if (lastCard && lastOverlay) {
        gsap.to(lastOverlay, {
          opacity: 0.55,
          ease: "none",
          scrollTrigger: {
            trigger: lastCard,
            start: "bottom 95%",
            end: "bottom 40%",
            scrub: true,
          },
        });

        gsap.to(lastCard, {
          scale: 0.96,
          transformOrigin: "center top",
          ease: "none",
          scrollTrigger: {
            trigger: lastCard,
            start: "bottom 95%",
            end: "bottom 40%",
            scrub: true,
          },
        });
      }

      // Gliding watermark logo accent
      if (logoRef.current) {
        gsap.to(logoRef.current, {
          y: "20vw",
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [areas]);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="bg-paper text-ink relative w-full overflow-hidden pt-20 pb-0 sm:pt-28"
    >
      {/* Section Header */}
      <div className="w-full px-6 sm:px-12">
        <div className="grid grid-cols-1 items-end gap-6 sm:gap-8 md:grid-cols-12">
          <div className="md:col-span-4">
            <h2 className="font-display text-ink text-3xl font-medium tracking-tight sm:text-5xl md:text-6xl">
              Our areas of expertise
            </h2>
          </div>
          <div className="md:col-span-5 md:col-start-7">
            <p className="font-body text-ink-muted text-base leading-relaxed sm:text-lg">
              Stoneage works across private residential architecture,
              high-specification renovations, and structural extensions,
              creating spaces that feel considered from every angle.
            </p>
          </div>
        </div>
      </div>

      {/* Stack of Service Cards: 2 goes over 1 as 1 turns grey and recedes */}
      <div className="relative w-full">
        {areas.map((item, index) => (
          <div
            key={item.number}
            ref={(el) => {
              cardRefs.current[index] = el;
            }}
            className={`bg-paper border-line sticky top-20 w-full overflow-hidden py-14 will-change-transform sm:top-24 sm:py-20 ${
              index === 0 ? "" : "border-t shadow-[0_-8px_30px_rgba(0,0,0,0.06)]"
            }`}
            style={{
              zIndex: (index + 1) * 10,
              minHeight: "75vh",
            }}
          >
            {/* The grey overlay: as this card goes back, it smoothly turns grey from white! */}
            <div
              ref={(el) => {
                overlayRefs.current[index] = el;
              }}
              className="will-change-opacity pointer-events-none absolute inset-0 z-20 bg-[#2b2a28] opacity-0 transition-opacity"
            />

            <div className="relative z-10 flex h-full w-full flex-col justify-between px-6 sm:px-12">
              {/* Top row: Title and Description */}
              <div className="mb-12 grid grid-cols-1 items-start gap-6 sm:mb-16 sm:gap-8 md:grid-cols-12">
                <div className="md:col-span-4">
                  <h3 className="font-display text-ink text-2xl font-medium tracking-tight sm:text-3xl md:text-4xl">
                    {item.title}
                  </h3>
                </div>

                <div className="md:col-span-5 md:col-start-7">
                  <p className="font-body text-ink-muted mb-4 text-base leading-relaxed sm:text-lg">
                    {item.description}
                  </p>
                  <Link
                    href="/projects"
                    className="text-ink hover:text-ink-muted inline-block font-mono text-xs tracking-widest uppercase underline underline-offset-8 transition-colors"
                  >
                    Explore Related Works &rarr;
                  </Link>
                </div>
              </div>

              {/* Bottom row: Giant Number & Aspect 5/3 Photography Card */}
              <div className="grid grid-cols-1 items-end gap-6 sm:gap-8 md:grid-cols-12">
                {/* Massive Monospace Number */}
                <div className="self-end md:col-span-4">
                  <span className="text-ink/15 block font-mono text-7xl leading-none font-light select-none sm:text-9xl md:text-[14vw]">
                    {item.number}
                  </span>
                </div>

                {/* Aspect 5/3 Photography Card with smooth scrub parallax */}
                <div className="md:col-span-5 md:col-start-7">
                  <div className="bg-paper-warm border-line group relative aspect-[5/3] w-full overflow-hidden rounded-lg border shadow-sm">
                    <div
                      ref={(el) => {
                        imageRefs.current[index] = el;
                      }}
                      className="absolute inset-x-0 -top-[10%] h-[120%] w-full will-change-transform"
                    >
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Storey's Gliding Watermark Logo Accent at the bottom of the section */}
      <div
        ref={logoRef}
        className="pointer-events-none absolute bottom-0 left-1/2 hidden h-fit w-fit -translate-x-[60%] translate-y-1/2 opacity-5 select-none sm:block"
        aria-hidden="true"
      >
        <GeometricLogo className="text-ink h-[45vw] w-[45vw]" />
      </div>
    </section>
  );
}
