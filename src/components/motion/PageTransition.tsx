"use client";

import React, { createContext, useContext, useEffect, useState, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";

interface TransitionContextType {
  navigateWithTransition: (href: string) => void;
  isTransitioning: boolean;
}

const TransitionContext = createContext<TransitionContextType>({
  navigateWithTransition: () => {},
  isTransitioning: false,
});

export const usePageTransition = () => useContext(TransitionContext);

/**
 * Top-level transition provider:
 * 1. User clicks a link or navigates.
 * 2. Soft pure white veil instantly rises/fades in over 300ms.
 * 3. Next.js router transitions while screen is 100% covered by white.
 * 4. Window scroll resets to top instantly while invisible.
 * 5. After 1-second total white veil duration, veil softly unveils the new page.
 */
export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  const [active, setActive] = useState(false);
  const [opacity, setOpacity] = useState(false);

  // When pathname actually finishes updating, hold white momentarily then fade out
  useEffect(() => {
    if (active) {
      // Hold white screen for a moment so the user experiences the calm 1-second white transition
      const timer = setTimeout(() => {
        setOpacity(false);
        const unmountTimer = setTimeout(() => {
          setActive(false);
        }, 400);
        return () => clearTimeout(unmountTimer);
      }, 700);

      return () => clearTimeout(timer);
    }
  }, [pathname, active]);

  const navigateWithTransition = (href: string) => {
    // If navigating to current path or an in-page anchor, ignore
    if (href === pathname || href.startsWith("#")) {
      return;
    }

    // 1. Immediately activate soft white overlay
    setActive(true);
    requestAnimationFrame(() => {
      setOpacity(true);
    });

    // 2. Once overlay covers screen (300ms), execute Next.js page change
    setTimeout(() => {
      startTransition(() => {
        router.push(href);
        if (typeof window !== "undefined") {
          window.scrollTo({ top: 0, behavior: "instant" });
        }
      });
    }, 320);
  };

  // Intercept internal <a> link clicks globally so all navigation gets the soft white transition
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      // Don't intercept if modifier keys are pressed (cmd/ctrl click for new tab)
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.defaultPrevented) return;

      const target = e.target as HTMLElement | null;
      const anchor = target?.closest("a") as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      // Only intercept relative internal routes (not tel, mailto, external, target="_blank", or hash anchors)
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("http") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        anchor.target === "_blank" ||
        anchor.hasAttribute("download")
      ) {
        return;
      }

      // Check if href is same as current path
      if (href === pathname) {
        return;
      }

      e.preventDefault();
      navigateWithTransition(href);
    };

    document.addEventListener("click", handleDocumentClick, true);
    return () => document.removeEventListener("click", handleDocumentClick, true);
  }, [pathname]);

  return (
    <TransitionContext.Provider value={{ navigateWithTransition, isTransitioning: active }}>
      {children}

      {/* 1-Second Pure Empty Soft White Veil */}
      {active && (
        <div
          className={`fixed inset-0 z-100 bg-[#F7F5F0] transition-opacity duration-350 ease-in-out pointer-events-auto select-none ${
            opacity ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          aria-hidden="true"
        />
      )}
    </TransitionContext.Provider>
  );
}

// Export backwards-compatible alias for layout
export function PageTransition({ children }: { children: React.ReactNode }) {
  return <PageTransitionProvider>{children}</PageTransitionProvider>;
}
