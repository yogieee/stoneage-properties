import { Typography } from "@/components/ui/Typography";

type TrustBadgesProps = {
  warranty: { label: string; detail: string };
  className?: string;
};

/**
 * Content-agnostic warranty/trust badge display. Accepts a generic
 * `{ label, detail }` shape rather than importing the `Service` domain type
 * directly, keeping this component reusable outside the services content
 * layer. Renders the warranty label prominently, never buried below other
 * content, using only semantic design tokens.
 */
export function TrustBadges({ warranty, className }: TrustBadgesProps) {
  return (
    <div
      className={`border-line bg-paper-dim flex flex-col gap-2 rounded-md border p-6 ${className ?? ""}`}
    >
      <Typography variant="display-sm" as="p">
        {warranty.label}
      </Typography>
      <Typography variant="body-sm">{warranty.detail}</Typography>
    </div>
  );
}
