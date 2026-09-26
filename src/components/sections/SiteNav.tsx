"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { StackingStonesLogo } from "@/components/decorative/StackingStonesLogo";
import { SocialIcon } from "@/components/decorative/SocialIcon";
import type { SiteSettings } from "@/sanity/queries";

const FALLBACK_PHONE = "0121 537 8229";
const FALLBACK_EMAIL = "enquiries@stoneageproperties.com";
const FALLBACK_OFFICES = [
  {
    name: "Solihull HQ",
    address: "64 Stratford Rd, Shirley, Solihull, B90 3LP",
  },
];
const FALLBACK_SOCIALS = [
  {
    platform: "Instagram",
    url: "https://www.instagram.com/stoneage_building_contractors/",
  },
  { platform: "Facebook", url: "https://www.facebook.com/stoneageproperties" },
  {
    platform: "LinkedIn",
    url: "https://www.linkedin.com/in/stoneage-properties-5bb8171a1/",
  },
  {
    platform: "YouTube",
    url: "https://www.youtube.com/channel/UCaXNV-S7WE2LfIQOr9NlGeQ",
  },
];

interface SiteNavProps {
  onOpenContact?: () => void;
  siteSettings?: SiteSettings | null;
}

export function SiteNav({ onOpenContact, siteSettings }: SiteNavProps) {
  const phone = siteSettings?.phones?.[0]?.number || FALLBACK_PHONE;
  const email = siteSettings?.email || FALLBACK_EMAIL;
  const offices = siteSettings?.offices?.length
    ? siteSettings.offices
    : FALLBACK_OFFICES;
  const socials = siteSettings?.socials?.length
    ? siteSettings.socials
    : FALLBACK_SOCIALS;
  const phoneHref = `tel:${phone.replace(/\s+/g, "")}`;
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on navigation
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when full-screen menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const navLinks = [
    { label: "Studio", href: "/ourstudio" },
    { label: "Projects", href: "/projects" },
    { label: "Craftsmanship", href: "/craftsmanship" },
    { label: "Build", href: "/build" },
    { label: "Journal", href: "/journal" },
    { label: "Contact", href: "/contact", isContact: true },
  ];

  const handleLinkClick = (e: React.MouseEvent, item: (typeof navLinks)[0]) => {
    if (item.isContact && onOpenContact) {
      e.preventDefault();
      setMenuOpen(false);
      onOpenContact();
    }
  };

  return (
    <>
      {/* Fabric 72px Fixed Header (padding: 12px / 12px 48px desktop) */}
      <header
        role="banner"
        className={`fixed top-0 left-0 z-50 flex h-[72px] w-full items-center justify-between px-3 transition-colors duration-300 sm:px-6 md:px-12 ${
          menuOpen
            ? "bg-transparent text-[#1C1B19]"
            : scrolled
              ? "border-b border-[#1C1B19]/5 bg-[#F7F5F0]/95 text-[#1C1B19] backdrop-blur-sm"
              : "bg-[#F7F5F0] text-[#1C1B19]"
        }`}
      >
        {/* Brand identity wordmark on the left with exact Fabric logo typography */}
        <div className="flex items-center">
          <Link
            href="/"
            className="text-xxl p-spaced inline-flex items-center leading-none font-semibold text-[#1C1B19] uppercase transition-opacity select-none hover:opacity-80"
            aria-label="Stoneage Properties Home"
          >
            Stoneage
          </Link>
        </div>

        {/* Stacking Stones Logo on the right as the menu toggle button (no text menu) */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          className="group -mr-1 flex h-12 w-12 cursor-pointer items-center justify-center text-[#1C1B19] transition-opacity hover:opacity-75 focus:outline-none md:h-14 md:w-14"
        >
          <div className="flex items-center justify-center">
            <StackingStonesLogo
              size="w-10 h-10 md:w-12 md:h-12"
              isStacked={menuOpen}
              className="text-[#1C1B19] transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </button>
      </header>

      {/* Fabric Full-Screen Minimalist Overlay Menu Drawer */}
      <div
        className={`fixed inset-0 z-40 flex flex-col justify-between bg-[#F7F5F0]/95 px-6 pt-[72px] pb-8 backdrop-blur-md transition-opacity duration-400 ease-in-out md:px-12 ${
          menuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!menuOpen}
      >
        {/* Stacked list on mobile; a single centered line from md and up, with the font scaling up as the screen grows */}
        <nav
          role="navigation"
          className="no-scrollbar flex w-full flex-1 items-center justify-center overflow-y-auto py-8"
        >
          <ul className="flex w-full flex-col items-center justify-center gap-5 px-2 sm:gap-6 md:flex-row md:flex-nowrap md:justify-center md:gap-8 md:px-0 lg:gap-10">
            {navLinks.map((item, index) => {
              const isOtherHovered =
                hoveredIndex !== null && hoveredIndex !== index;
              return (
                <li key={item.label} className="shrink-0 text-center">
                  <Link
                    href={item.href}
                    onClick={(e) => handleLinkClick(e, item)}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className={`liquid-glass-pill text-xxl inline-block rounded-full px-5 py-2 font-normal whitespace-nowrap text-black transition-opacity duration-300 ${
                      isOtherHovered ? "opacity-20" : "opacity-100"
                    } hover:opacity-100`}
                  >
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Fabric Menu Footer with Contact & Offices */}
        <div className="grid w-full grid-cols-1 gap-6 border-t border-black/10 pt-6 text-sm md:grid-cols-12">
          <div className="space-y-2 text-black/80 md:col-span-6">
            <p className="font-normal text-black">
              Phone:{" "}
              <a href={phoneHref} className="hover:underline">
                {phone}
              </a>
            </p>
            <p className="font-normal text-black">
              Email:{" "}
              <a href={`mailto:${email}`} className="hover:underline">
                {email}
              </a>
            </p>
            <div className="flex items-center gap-4 pt-2 text-xs tracking-wider text-black/60 uppercase">
              {socials.map((social, index) => (
                <span key={social.platform} className="flex items-center gap-4">
                  {index > 0 && <span>/</span>}
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.platform}
                    className="flex items-center gap-1.5 transition-colors hover:text-black"
                  >
                    <SocialIcon
                      platform={social.platform}
                      className="h-3.5 w-3.5"
                    />
                    {social.platform}
                  </a>
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-1 text-xs text-black/60 md:col-span-6 md:text-right">
            <p className="font-medium text-black">Stoneage Design & Build</p>
            {offices.map((office) => (
              <p key={office.name}>
                {office.name}: {office.address}
              </p>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
