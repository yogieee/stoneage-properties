"use client";

import { useRouter } from "next/navigation";
import { ContactModal } from "@/components/sections/ContactModal";

/**
 * Intercepted `/contact` route — rendered into the `@modal` parallel slot
 * on client-side navigation only (nav "Contact" link, any "Enquire" CTA).
 * Hard navigation (typed URL, refresh, shared link) bypasses this and
 * renders the real standalone page at `app/(marketing)/contact/page.tsx`
 * instead, per Next.js intercepting-route semantics.
 */
export default function InterceptedContactPage() {
  const router = useRouter();

  return <ContactModal onClose={() => router.back()} />;
}
