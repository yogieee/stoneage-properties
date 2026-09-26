import { SocialIcon } from "@/components/decorative/SocialIcon";
import { StarRating } from "@/components/decorative/StarRating";

const REVIEW_URL = "https://uk.trustpilot.com/review/stoneageproperties.com";
const RATING = 4.7;

export function TrustpilotWidget() {
  return (
    <a
      href={REVIEW_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 text-sm transition-opacity hover:opacity-70"
    >
      <SocialIcon platform="Trustpilot" className="h-5 w-5 text-[#00b67a]" />
      <span className="font-semibold text-[#00b67a]">{RATING}</span>
      <StarRating rating={RATING} />
      <span>Read our reviews on Trustpilot</span>
    </a>
  );
}
