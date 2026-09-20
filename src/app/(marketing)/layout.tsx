import { SiteNav } from "@/components/sections/SiteNav";
import { SiteFooter } from "@/components/sections/SiteFooter";
import { Preloader } from "@/components/motion/Preloader";
import { PageTransition } from "@/components/motion/PageTransition";
import { MediaRail } from "@/components/sections/MediaRail";
import { VisitTracker } from "@/components/analytics/VisitTracker";
import { getSiteSettings } from "@/sanity/queries";

export default async function MarketingLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  const settings = await getSiteSettings();

  return (
    <div className="flex min-h-screen flex-col bg-[#F7F5F0] text-[#1C1B19]">
      <VisitTracker />
      <Preloader />
      <SiteNav siteSettings={settings} />
      <main className="flex w-full flex-1 flex-col">
        <PageTransition>{children}</PageTransition>
      </main>
      <SiteFooter />
      {modal}
      <MediaRail socials={settings?.socials} />
    </div>
  );
}
