import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { SmoothScrollProvider } from "@/components/motion/SmoothScrollProvider";
import { getSiteSettings } from "@/sanity/queries";
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from "@/lib/seo";
import "./globals.css";

const display = Montserrat({
  variable: "--font-display-family",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

const body = Montserrat({
  variable: "--font-body-family",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Stoneage - Specialised builders",
    template: "Stoneage - %s",
  },
  description:
    "Stoneage Properties designs and delivers new builds, renovations, extensions, and conversions in Solihull. Book a project brief consultation.",
  keywords: [
    "architects near me",
    "residential architecture",
    "house extension design",
    "renovation architects",
    "new build architects",
    "Solihull architects",
    "Solihull building contractors",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    url: SITE_URL,
    title: "Stoneage Properties | Architects & Property Design",
    description: "New builds, renovations, extensions, and conversions in Solihull.",
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Stoneage Properties | Architects & Property Design",
    description: "New builds, renovations, extensions, and conversions in Solihull.",
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteSettings = await getSiteSettings();

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/icon.svg`,
    email: siteSettings?.email,
    telephone: siteSettings?.phones?.[0]?.number,
    sameAs: siteSettings?.socials?.map((social) => social.url).filter(Boolean),
    address: siteSettings?.offices?.map((office) => ({
      "@type": "PostalAddress",
      name: office.name,
      streetAddress: office.address,
    })),
  };

  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
