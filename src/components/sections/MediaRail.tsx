import { SocialIcon } from "@/components/decorative/SocialIcon";
import { getSiteSettings } from "@/sanity/queries";

const FALLBACK_SOCIALS = [
  { platform: "Instagram", url: "https://www.instagram.com/stoneage_building_contractors/" },
  { platform: "Facebook", url: "https://www.facebook.com/stoneageproperties" },
  { platform: "LinkedIn", url: "https://www.linkedin.com/in/stoneage-properties-5bb8171a1/" },
  { platform: "YouTube", url: "https://www.youtube.com/channel/UCaXNV-S7WE2LfIQOr9NlGeQ" },
];

export async function MediaRail() {
  const settings = await getSiteSettings();
  const socials = settings?.socials?.length ? settings.socials : FALLBACK_SOCIALS;

  return (
    <div
      className="fixed right-4 top-1/2 z-30 hidden -translate-y-1/2 mix-blend-difference lg:flex sm:right-6"
      aria-label="Social media"
    >
      <div className="flex flex-col items-center gap-4 py-4">
        {socials.map((social) => (
          <a
            key={social.platform}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.platform}
            title={social.platform}
            className="text-white opacity-80 transition-opacity hover:opacity-100"
          >
            <SocialIcon platform={social.platform} className="h-4 w-4" />
          </a>
        ))}
      </div>
    </div>
  );
}
