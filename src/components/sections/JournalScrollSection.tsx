"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "@/lib/gsap";

export interface JournalArticleItem {
  slug: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  tag?: string;
  publishedAt?: string;
}

interface JournalScrollSectionProps {
  articles: JournalArticleItem[];
}

export function JournalScrollSection({ articles }: JournalScrollSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const list = listRef.current;
    if (!section || !list || articles.length === 0) return;

    const mm = gsap.matchMedia();

    const items = gsap.utils.toArray<HTMLElement>(
      section.querySelectorAll("[data-journal-item]"),
    );
    if (!items.length) return;

    const n = items.map((item) => ({
      item,
      row: item.querySelector<HTMLElement>("[data-journal-row]"),
      visual: item.querySelector<HTMLElement>("[data-journal-visual]"),
      description: item.querySelector<HTMLElement>(
        "[data-journal-description]",
      ),
      imageWrap: item.querySelector<HTMLElement>("[data-journal-image-wrap]"),
    }));

    if (
      n.some(
        ({ row, visual, description, imageWrap }) =>
          !(row && visual && description && imageWrap),
      )
    ) {
      return;
    }

    const elementsToClear = [
      section,
      list,
      ...n.map(({ item }) => item),
      ...n.map(({ visual }) => visual),
      ...n.map(({ imageWrap }) => imageWrap),
      ...n.map(({ description }) => description),
    ];

    const clearAll = () => {
      gsap.set(elementsToClear, {
        clearProps:
          "transform,height,width,left,top,zIndex,overflow,clipPath,webkitClipPath,opacity,visibility",
      });
    };

    // Desktop: min-width 992px (Exact Alejandro HA Services Scroll Effect)
    mm.add("(min-width: 992px)", () => {
      const calcHeights = () => {
        n.forEach(({ row, visual }, a) => {
          if (!row || !visual) return;
          const prevRowH =
            a > 0 && n[a - 1].row ? n[a - 1].row!.offsetHeight : 0;
          const remainingH = window.innerHeight - row.offsetHeight - prevRowH;
          gsap.set(visual, { height: Math.max(remainingH, 0) });
        });
      };

      calcHeights();

      const ctx = gsap.context(() => {
        gsap.set(list, { y: 0 });

        n.forEach(({ visual, imageWrap }, a) => {
          if (visual) gsap.set(visual, { overflow: "hidden" });
          if (imageWrap) {
            gsap.set(imageWrap, {
              left: "29%",
              width: a === 0 ? "71%" : "0%",
              overflow: "hidden",
            });
          }
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${window.innerHeight * n.length}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onRefreshInit: calcHeights,
          },
        });

        n.slice(0, -1).forEach((curr, idx) => {
          const nextIdx = idx + 1;
          const next = n[nextIdx];

          // 1. Current visual collapses height to 0
          tl.to(curr.visual, { height: 0, duration: 1, ease: "none" }, idx)
            // 2. Current image curtain wipes out to the right (left: 100%, width: 0%)
            .to(
              curr.imageWrap,
              { left: "100%", width: "0%", duration: 1, ease: "none" },
              idx,
            )
            // 3. Next image curtain expands into view from left: 29% to width: 71%
            .to(
              next.imageWrap,
              { left: "29%", width: "71%", duration: 1, ease: "none" },
              idx,
            )
            // 4. Container translates upwards by accumulated row heights so previous row scrolls off
            .to(
              list,
              {
                y: () => {
                  if (nextIdx < 2) return 0;
                  let sum = 0;
                  for (let k = 0; k <= nextIdx - 2; k += 1) {
                    if (n[k].row) sum += n[k].row!.offsetHeight;
                  }
                  return -sum;
                },
                duration: 1,
                ease: "none",
              },
              idx,
            );
        });
      }, section);

      return () => {
        ctx.revert();
        clearAll();
      };
    });

    // Tablet: 768px - 991px
    mm.add("(min-width: 768px) and (max-width: 991px)", () => {
      let heights: number[] = [];
      const calcHeights = () => {
        heights = n.map(({ visual }) => (visual ? visual.scrollHeight : 0));
      };

      const setup = () => {
        gsap.set(list, { y: 0 });
        n.forEach(({ item, visual, imageWrap, description }, o) => {
          gsap.set(item, { clearProps: "transform,zIndex" });
          if (visual) {
            gsap.set(visual, {
              height: o === 0 ? heights[o] : 0,
              overflow: "hidden",
            });
          }
          if (imageWrap) {
            gsap.set(imageWrap, {
              clearProps:
                "transform,width,left,top,clipPath,webkitClipPath,opacity,visibility",
            });
          }
          if (description) {
            gsap.set(description, {
              clearProps: "transform,opacity,visibility",
            });
          }
        });
      };

      calcHeights();

      const ctx = gsap.context(() => {
        setup();
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${window.innerHeight * (n.length - 1)}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onRefreshInit: () => {
              calcHeights();
              setup();
            },
          },
        });

        n.slice(0, -1).forEach((curr, r) => {
          const next = n[r + 1];
          tl.to(curr.visual, { height: 0, duration: 1, ease: "none" }, r).to(
            next.visual,
            { height: () => heights[r + 1], duration: 1, ease: "none" },
            r,
          );
        });
      }, section);

      return () => {
        ctx.revert();
        clearAll();
      };
    });

    // Mobile: max-width 767px (natural stack, zero pin/scroll traps)
    mm.add("(max-width: 767px)", () => {
      clearAll();
    });

    return () => {
      mm.revert();
      clearAll();
    };
  }, [articles]);

  return (
    <section
      ref={sectionRef}
      data-services=""
      className="journal-section-sticky relative w-full overflow-hidden bg-[#F7F5F0] text-[#1C1B19] select-none"
    >
      <div className="journal-wrapper relative h-full w-full">
        <div className="journal-sticky relative h-full w-full overflow-hidden">
          <div
            ref={listRef}
            data-journal-list=""
            className="journal-list relative w-full will-change-transform"
          >
            {articles.map((article, index) => {
              const numberFormatted = `[0${index + 1}]`;

              return (
                <article
                  key={article.slug}
                  data-journal-item=""
                  className="journal-item group relative flex w-full flex-none flex-col"
                >
                  {/* Row Header (Title & Number) */}
                  <Link
                    href={`/journal/${article.slug}`}
                    data-journal-row=""
                    className="journal-row relative z-20 flex w-full items-center justify-between border-t border-b border-[#1C1B19]/15 bg-[#F7F5F0] px-4 py-4 transition-colors duration-300 hover:bg-[#EFECE4] sm:px-8 sm:py-6 md:px-12"
                  >
                    <div className="journal-number font-mono text-3xl font-light tracking-tight text-[#1C1B19]/70 transition-colors group-hover:text-[#1C1B19] sm:text-4xl md:text-5xl lg:text-6xl">
                      {numberFormatted}
                    </div>

                    <div className="text-right">
                      <h3 className="journal-title text-base font-normal tracking-[-0.5px] text-[#1C1B19] uppercase transition-opacity group-hover:opacity-75 sm:text-xl md:text-2xl md:tracking-[-1px] lg:text-3xl">
                        {article.title}
                      </h3>
                    </div>
                  </Link>

                  {/* Visual Content (Description & Large Curtain-Revealed Image) */}
                  <div
                    data-journal-visual=""
                    className="journal-visual relative w-full flex-none overflow-hidden bg-[#F7F5F0]"
                  >
                    {/* Left Column: Description */}
                    <div
                      data-journal-description=""
                      className="journal-description absolute bottom-8 left-8 z-10 hidden max-w-[280px] flex-col justify-end gap-4 sm:left-12 md:flex lg:max-w-sm"
                    >
                      <div className="flex items-center gap-2">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#1C1B19]" />
                        <span className="font-mono text-xs tracking-widest text-[#1C1B19]/60 uppercase">
                          {article.tag || `Insight · 0${index + 1}`}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed font-light text-[#1C1B19]/80 lg:text-base">
                        {article.excerpt}
                      </p>
                      <Link
                        href={`/journal/${article.slug}`}
                        className="group/btn inline-flex items-center gap-2 pt-1 font-mono text-xs tracking-wider text-[#1C1B19] uppercase transition-opacity hover:opacity-70"
                      >
                        <span className="border-b border-[#1C1B19] pb-0.5">
                          Read Article
                        </span>
                        <span className="font-mono transition-transform duration-300 group-hover/btn:translate-x-1">
                          &rarr;
                        </span>
                      </Link>
                    </div>

                    {/* Right Column: Image with shutter curtain reveal (Desktop) */}
                    <div
                      data-journal-image-wrap=""
                      className="journal-image-wrap absolute top-0 right-0 h-full overflow-hidden"
                      style={{
                        left: "29%",
                        width: index === 0 ? "71%" : "0%",
                      }}
                    >
                      <Link
                        href={`/journal/${article.slug}`}
                        className="group/img relative block h-full w-full cursor-pointer overflow-hidden"
                      >
                        <Image
                          src={article.imageUrl}
                          alt={article.title}
                          fill
                          priority={index === 0}
                          sizes="(min-width: 992px) 71vw, 100vw"
                          className="object-cover transition-transform duration-700 ease-out group-hover/img:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/5 opacity-0 transition-opacity duration-300 group-hover/img:opacity-100" />
                      </Link>
                    </div>

                    {/* Mobile Only: Inline visual layout for < 768px */}
                    <div className="flex w-full flex-col px-4 py-4 sm:px-8 md:hidden">
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/5">
                        <Image
                          src={article.imageUrl}
                          alt={article.title}
                          fill
                          sizes="100vw"
                          className="object-cover"
                        />
                      </div>
                      <div className="pt-4 pb-2">
                        <div className="mb-2 font-mono text-[11px] tracking-wider text-black/50 uppercase">
                          {article.tag || `Insight · 0${index + 1}`}
                        </div>
                        <p className="text-sm leading-relaxed font-light text-black/75">
                          {article.excerpt}
                        </p>
                        <Link
                          href={`/journal/${article.slug}`}
                          className="mt-3 inline-flex items-center gap-2 font-mono text-xs tracking-wider text-black uppercase"
                        >
                          <span className="border-b border-black pb-0.5">
                            Read Article
                          </span>
                          <span>&rarr;</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
