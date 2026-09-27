"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "@/lib/gsap";

export interface ProjectItem {
  slug: string;
  title: string;
  location: string;
  category: string;
  imageUrl: string;
  summary?: string;
  tags?: string[];
}

interface ProjectsHorizontalScrollProps {
  primaryProjects: ProjectItem[];
  remainingProjects: ProjectItem[];
}

export function ProjectsHorizontalScroll({
  primaryProjects,
  remainingProjects,
}: ProjectsHorizontalScrollProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const progressLineRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const totalCards = primaryProjects.length + 1; // 4 primary + 1 remaining/archive

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const progressLine = progressLineRef.current;
    if (!section || !track) return;

    const mm = gsap.matchMedia();

    // Desktop & Tablet (min-width: 768px): Pin and scroll right-to-left
    mm.add("(min-width: 768px)", () => {
      const getScrollDistance = () => {
        const trackWidth = track.scrollWidth;
        const windowWidth = window.innerWidth;
        return Math.max(0, trackWidth - windowWidth + 80);
      };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${getScrollDistance()}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const idx = Math.min(
              totalCards - 1,
              Math.floor(self.progress * totalCards)
            );
            setActiveIndex(idx);
          },
        },
      });

      tl.to(track, {
        x: () => -getScrollDistance(),
        ease: "none",
      });

      if (progressLine) {
        tl.to(
          progressLine,
          {
            scaleX: 1,
            ease: "none",
          },
          0
        );
      }

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    });

    return () => {
      mm.revert();
    };
  }, [primaryProjects, remainingProjects, totalCards]);

  return (
    <section
      ref={sectionRef}
      id="work"
      className="relative w-full bg-[#0B0A09] text-white select-none md:h-screen md:overflow-hidden flex flex-col justify-between"
    >
      {/* Top Header Bar (clears fixed SiteNav 72px height) */}
      <div className="w-full border-b border-white/10 px-4 pt-[88px] pb-4 sm:px-8 md:px-12 md:pt-[96px] md:pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4 z-20 bg-[#0B0A09]/90 backdrop-blur-sm">
        <div>
          <span className="font-mono text-xs tracking-widest text-white/50 uppercase">
            [Selected Portfolio &middot; 01 &mdash; 0{totalCards}]
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-normal tracking-[-1px] text-white mt-1">
            Selected Projects
          </h2>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center gap-2 font-mono text-xs text-white/40 uppercase tracking-wider">
            <span>Scroll horizontally</span>
            <span className="font-mono text-sm">&rarr;</span>
          </div>
          <Link
            href="/projects"
            className="group flex items-center gap-2 text-sm font-medium tracking-[-0.5px] text-white/80 transition-opacity hover:opacity-100 sm:text-base"
          >
            <span>View All Projects</span>
            <span className="font-mono transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
          </Link>
        </div>
      </div>

      {/* Horizontal Big Cards Track */}
      <div className="relative w-full flex-1 flex items-center overflow-x-auto md:overflow-hidden no-scrollbar px-4 py-4 sm:px-8 md:px-12">
        <div
          ref={trackRef}
          className="flex items-stretch gap-6 md:gap-8 will-change-transform py-2"
        >
          {/* 4 Primary Big Project Cards */}
          {primaryProjects.map((project, idx) => {
            const indexFormatted = `0${idx + 1}`;

            return (
              <div
                key={project.slug}
                className="group relative flex-none w-[86vw] sm:w-[78vw] md:w-[68vw] lg:w-[62vw] xl:w-[58vw] max-w-[960px] h-[58vh] sm:h-[62vh] md:h-[65vh] max-h-[580px] flex flex-col justify-between border border-white/15 bg-[#121110] p-6 sm:p-8 md:p-10 overflow-hidden transition-all duration-500 hover:border-white/35"
              >
                {/* Project Hero Image Background */}
                <div className="absolute inset-0 z-0 overflow-hidden bg-black">
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    fill
                    priority={idx < 2}
                    sizes="(min-width: 1024px) 65vw, 90vw"
                    className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                  />
                  {/* Cinematic gradient overlay for crisp white typography readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/60 transition-colors duration-500 group-hover:via-black/35" />
                </div>

                {/* Top Row: Small Number & Category / Tags */}
                <div className="relative z-10 flex items-start justify-between gap-4 border-b border-white/10 pb-4">
                  <span className="font-mono text-xs sm:text-sm tracking-wider text-white/70">
                    {indexFormatted}
                  </span>
                  <div className="text-right">
                    <span className="font-mono text-[10px] sm:text-xs tracking-widest text-white/60 uppercase">
                      {project.location} &middot; {project.category}
                    </span>
                  </div>
                </div>

                {/* Center Content: Giant Title & Narrative Description */}
                <div className="relative z-10 my-auto py-6">
                  <Link href={`/projects/${project.slug}`} className="block group/title">
                    <h3 className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-normal tracking-[-1px] text-white leading-[1.08] transition-opacity group-hover/title:opacity-85">
                      {project.title}
                    </h3>
                  </Link>

                  <p className="mt-4 max-w-xl text-xs sm:text-sm md:text-base leading-relaxed text-white/70 font-light line-clamp-3 sm:line-clamp-4">
                    {project.summary ||
                      `${project.category} crafted in ${project.location}. Designed and built with material honesty, architectural proportion, and structural precision.`}
                  </p>
                </div>

                {/* Bottom Row: EXPLORE button & Giant Watermark Number */}
                <div className="relative z-10 flex items-end justify-between border-t border-white/10 pt-4">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="group/btn inline-flex items-center gap-2 font-mono text-xs sm:text-sm tracking-widest uppercase text-white hover:text-white/80 transition-colors"
                  >
                    <span className="border-b border-white/60 pb-0.5 group-hover/btn:border-white">
                      EXPLORE
                    </span>
                    <span className="font-mono text-base transition-transform duration-300 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-0.5">
                      &#8599;
                    </span>
                  </Link>

                  {/* Giant Watermark Number matching user image */}
                  <span className="font-display text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] font-extralight text-white/20 leading-none select-none pointer-events-none -mb-3 sm:-mb-6">
                    {indexFormatted}
                  </span>
                </div>
              </div>
            );
          })}

          {/* 5th Big Card: Soft White Architectural Card for Remaining Projects */}
          <div className="group relative flex-none w-[88vw] sm:w-[80vw] md:w-[72vw] lg:w-[66vw] xl:w-[62vw] max-w-[1020px] h-[58vh] sm:h-[62vh] md:h-[65vh] max-h-[580px] flex flex-col justify-between border border-[#1C1B19]/15 bg-[#F7F5F0] text-[#1C1B19] p-6 sm:p-8 md:p-10 overflow-hidden transition-all duration-500 hover:border-[#1C1B19]/35">
            {/* Top Row: Small Number & Tags */}
            <div className="relative z-10 flex items-start justify-between gap-4 border-b border-[#1C1B19]/10 pb-4">
              <span className="font-mono text-xs sm:text-sm tracking-wider text-[#1C1B19]/70">
                0{totalCards}
              </span>
              <div className="text-right">
                <span className="font-mono text-[10px] sm:text-xs tracking-widest text-[#1C1B19]/60 uppercase">
                  RESIDENTIAL ARCHIVE &middot; EXTENDED COMMISSIONS
                </span>
              </div>
            </div>

            {/* Header Text & 2x2 Mini Cards Grid */}
            <div className="relative z-10 my-auto py-4">
              <div className="mb-4">
                <h3 className="font-display text-2xl sm:text-4xl md:text-5xl font-normal tracking-[-1px] text-[#1C1B19]">
                  More Selected Works
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-[#1C1B19]/70 font-light">
                  Explore additional residential studies and commissions from our practice.
                </p>
              </div>

              {/* 2x2 Mini Grid of Small Project Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {remainingProjects.slice(0, 4).map((remProj, rIdx) => (
                  <Link
                    key={remProj.slug + rIdx}
                    href={`/projects/${remProj.slug}`}
                    className="group/mini flex items-center gap-3 sm:gap-4 border border-[#1C1B19]/10 bg-white/90 p-2.5 sm:p-3 transition-all duration-300 hover:border-[#1C1B19]/30 hover:bg-white shadow-sm"
                  >
                    <div className="relative aspect-[4/3] w-20 sm:w-24 flex-none overflow-hidden bg-black/5">
                      <Image
                        src={remProj.imageUrl}
                        alt={remProj.title}
                        fill
                        sizes="100px"
                        className="object-cover transition-transform duration-500 group-hover/mini:scale-105"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs sm:text-sm font-medium tracking-tight text-[#1C1B19] line-clamp-1 group-hover/mini:text-black">
                        {remProj.title}
                      </h4>
                      <p className="mt-0.5 font-mono text-[10px] text-[#1C1B19]/60 uppercase truncate">
                        {remProj.location}
                      </p>
                      <span className="mt-1 inline-flex items-center gap-1 font-mono text-[10px] text-[#1C1B19] font-medium group-hover/mini:translate-x-1 transition-transform">
                        Explore &rarr;
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Bottom Row: Full Archive Button & Giant Watermark 05 */}
            <div className="relative z-10 flex items-end justify-between border-t border-[#1C1B19]/10 pt-4">
              <Link
                href="/projects"
                className="group/btn inline-flex items-center gap-2 font-mono text-xs sm:text-sm tracking-widest uppercase text-[#1C1B19] hover:opacity-75 transition-opacity"
              >
                <span className="border-b border-[#1C1B19]/60 pb-0.5 group-hover/btn:border-[#1C1B19]">
                  VIEW FULL ARCHIVE
                </span>
                <span className="font-mono text-base transition-transform duration-300 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-0.5">
                  &#8599;
                </span>
              </Link>

              {/* Giant Watermark Number in Soft Ink */}
              <span className="font-display text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] font-extralight text-[#1C1B19]/10 leading-none select-none pointer-events-none -mb-3 sm:-mb-6">
                0{totalCards}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Timeline / Navigation Bar (Exact Match to User Image) */}
      <div className="hidden md:block w-full px-8 md:px-12 pb-6 z-20">
        {/* Full-width Timeline Line with active progress scrub */}
        <div className="relative h-[1px] w-full bg-white/20 mb-3 overflow-hidden">
          <div
            ref={progressLineRef}
            className="absolute top-0 left-0 h-full w-full bg-white origin-left scale-x-0 will-change-transform"
          />
        </div>

        {/* Timeline Tabs */}
        <div className="flex items-center justify-between font-mono text-[11px] tracking-wider uppercase">
          {primaryProjects.map((p, pIdx) => {
            const isCurrent = activeIndex === pIdx;
            return (
              <span
                key={p.slug}
                className={`transition-colors duration-300 truncate max-w-[180px] lg:max-w-[220px] ${
                  isCurrent ? "text-white font-semibold" : "text-white/40"
                }`}
              >
                0{pIdx + 1} {p.title}
              </span>
            );
          })}

          <span
            className={`transition-colors duration-300 ${
              activeIndex === primaryProjects.length
                ? "text-white font-semibold"
                : "text-white/40"
            }`}
          >
            0{totalCards} ALL WORKS &amp; ARCHIVE
          </span>
        </div>
      </div>
    </section>
  );
}
