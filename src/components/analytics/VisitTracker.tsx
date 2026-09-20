"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Records a page view (path + UTM params) via /api/track. Cookieless: it
 * stores nothing in the browser and sends no visitor identifier.
 */
export function VisitTracker() {
  const pathname = usePathname();
  const isFirstView = useRef(true);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;

    const params = new URLSearchParams(window.location.search);

    // document.referrer keeps the original external referrer through
    // client-side navigation, so only report it on the first view.
    let referrerHost = "";
    if (isFirstView.current && document.referrer) {
      try {
        const host = new URL(document.referrer).hostname;
        if (host !== window.location.hostname) referrerHost = host;
      } catch {
        // Malformed referrer: ignore.
      }
    }
    isFirstView.current = false;

    const payload = JSON.stringify({
      path: pathname,
      utmSource: params.get("utm_source"),
      utmMedium: params.get("utm_medium"),
      utmCampaign: params.get("utm_campaign"),
      referrerHost,
    });

    if (!navigator.sendBeacon?.("/api/track", new Blob([payload], { type: "application/json" }))) {
      fetch("/api/track", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }
  }, [pathname]);

  return null;
}
