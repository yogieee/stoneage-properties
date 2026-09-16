"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";
import { LogoSpinner } from "@/components/decorative/LogoSpinner";

interface SiteNavProps {
  onOpenContact?: () => void;
}

export function SiteNav({ onOpenContact }: SiteNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const lenis = useLenis();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Only the home page opens on a full-bleed dark hero — every other page
  // starts on a light (bg-paper) section, so the nav needs dark text/logo
  // from the very top there, not just after scrolling.
  const hasDarkHero = pathname === "/";
  const isDark = isScrolled || !hasDarkHero;

  const navLinks = [
    { label: "Projects", href: "/projects" },
    { label: "Journal", href: "/journal" },
    { label: "Services", href: "/#services" },
  ];

  const handleContactClick = (e: React.MouseEvent) => {
    if (onOpenContact) {
      e.preventDefault();
      onOpenContact();
    }
  };

  const handleAnchorClick = (e: React.MouseEvent, href: string) => {
    if (href.startsWith("/#") && lenis) {
      const hash = href.replace("/", "");
      const target = document.querySelector(hash);
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target as HTMLElement, { offset: -80, duration: 1.2 });
      }
    }
  };

  return (
    <>
      <header
        className={`pointer-events-auto fixed top-0 left-0 z-40 w-full px-5 transition-all duration-300 sm:px-10 ${
          isScrolled
            ? "bg-paper/90 border-line/40 border-b py-4 shadow-xs backdrop-blur-md sm:py-5"
            : "border-b border-transparent bg-transparent py-5 sm:py-7"
        }`}
      >
        <div className="mx-auto grid max-w-full grid-cols-[auto_1fr_auto] items-center gap-4">
          {/* Logo & Brand Mark */}
          <Link
            href="/"
            data-nav-logo
            className={`flex items-center gap-2 justify-self-start transition-colors duration-300 ${
              isDark
                ? "text-ink hover:opacity-80"
                : "text-paper hover:opacity-90"
            }`}
            aria-label="Stoneage Properties Home"
          >
            <span className="font-display text-2xl leading-none font-bold tracking-tight sm:text-3xl">
              Stoneage
            </span>
            <LogoSpinner
              spin="continuous"
              size="h-8 w-8 sm:h-9 sm:w-9"
              className={`self-center transition-colors duration-300 ${
                isDark ? "text-ink" : "text-paper"
              }`}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden justify-self-center md:flex"
            aria-label="Main Navigation"
          >
            <ul className="flex items-center gap-8 font-mono text-sm tracking-wide">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    onClick={(e) => handleAnchorClick(e, link.href)}
                    className={`group relative inline-block py-1 transition-colors duration-300 ${
                      isDark
                        ? "text-ink-muted hover:text-ink"
                        : "text-paper/80 hover:text-paper"
                    }`}
                  >
                    <span className="inline-block transition-transform duration-200 group-hover:-translate-y-0.5">
                      {link.label}
                    </span>
                    <span
                      className={`absolute bottom-0 left-0 h-[1px] w-full origin-right scale-x-0 transition-transform duration-300 ease-out group-hover:origin-left group-hover:scale-x-100 ${
                        isDark ? "bg-ink" : "bg-paper"
                      }`}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center justify-self-end">
            {/* Contact Button with monolith mark */}
            <Link
              href="/contact"
              onClick={handleContactClick}
              className={`group hidden items-center gap-3 rounded-full px-5 py-2.5 font-mono text-xs tracking-wider uppercase shadow-sm transition-all duration-300 hover:shadow-md md:inline-flex ${
                isScrolled
                  ? "bg-charcoal text-paper hover:bg-ink"
                  : "bg-paper text-ink hover:bg-paper-warm"
              }`}
            >
              <span>Contact</span>
              <LogoSpinner
                spin="hover"
                size="h-5 w-5"
                className={isScrolled ? "text-paper" : "text-ink"}
              />
            </Link>

            {/* Mobile Menu Trigger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`rounded-full px-4 py-2 font-mono text-sm tracking-wider uppercase shadow-sm transition-all duration-300 focus:outline-none md:hidden ${
                isScrolled
                  ? "bg-charcoal text-paper hover:bg-ink"
                  : "bg-paper text-ink hover:bg-paper-warm"
              }`}
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? "Close" : "Menu"}
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="bg-paper animate-in fade-in fixed inset-0 z-30 flex flex-col justify-between p-8 pt-28 duration-200 md:hidden">
          <nav className="space-y-6">
            <ul className="space-y-6">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-display text-ink hover:text-ink-muted block text-3xl transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="border-line text-ink-muted space-y-3 border-t pt-8 font-mono text-xs">
            <p>
              <a
                href="mailto:enquiries@stoneageproperties.com"
                className="hover:text-ink"
              >
                enquiries@stoneageproperties.com
              </a>
            </p>
            <p>
              <a href="tel:01215378229" className="hover:text-ink">
                0121 537 8229
              </a>
            </p>
            <p className="text-ink-subtle pt-2">
              Solihull HQ &middot; London &middot; Nottingham
            </p>
          </div>
        </div>
      )}
    </>
  );
}
