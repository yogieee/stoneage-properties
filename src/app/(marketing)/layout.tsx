import { SiteNav } from "@/components/sections/SiteNav";
import { SiteFooter } from "@/components/sections/SiteFooter";
import { Preloader } from "@/components/motion/Preloader";
import { ChatWidget } from "@/components/sections/ChatWidget";

export default function MarketingLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink selection:bg-charcoal selection:text-paper">
      <Preloader />
      <SiteNav />
      <main className="flex-1 w-full">{children}</main>
      <SiteFooter />
      {modal}
      <ChatWidget />
    </div>
  );
}
