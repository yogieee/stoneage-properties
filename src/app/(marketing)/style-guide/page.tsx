import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { Typography, TYPOGRAPHY_VARIANTS } from "@/components/ui/Typography";

const COLOR_TOKENS = [
  { name: "ink", className: "bg-ink" },
  { name: "ink-muted", className: "bg-ink-muted" },
  { name: "ink-subtle", className: "bg-ink-subtle" },
  { name: "paper", className: "bg-paper" },
  { name: "paper-dim", className: "bg-paper-dim" },
  { name: "line", className: "bg-line" },
] as const;

const BUTTON_VARIANTS = ["primary", "secondary", "ghost"] as const;

/**
 * Living design-system reference/audit page (Server Component). Every
 * component built in later phases should visually match what's shown here.
 * Not linked from primary nav — a working document, not marketing content.
 */
export default function StyleGuidePage() {
  return (
    <div className="flex flex-col gap-24 px-6 py-24 sm:px-12">
      <section className="flex flex-col gap-6">
        <Typography variant="display-sm" as="h2">
          Color Palette
        </Typography>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-6">
          {COLOR_TOKENS.map((token) => (
            <div key={token.name} className="flex flex-col gap-2">
              <div
                className={`border-line h-24 w-full rounded-md border ${token.className}`}
              />
              <Typography variant="body-sm" as="span">
                {token.name}
              </Typography>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <Typography variant="display-sm" as="h2">
          Type Scale
        </Typography>
        <div className="flex flex-col gap-6">
          {TYPOGRAPHY_VARIANTS.map((variant) => (
            <Typography key={variant} variant={variant}>
              {variant} — Stoneage Properties
            </Typography>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <Typography variant="display-sm" as="h2">
          Buttons
        </Typography>
        <div className="flex flex-wrap gap-4">
          {BUTTON_VARIANTS.map((variant) => (
            <Button key={variant} variant={variant}>
              {variant}
            </Button>
          ))}
        </div>
      </section>

      <Reveal className="flex flex-col gap-4">
        <Typography variant="display-sm" as="h2">
          Reveal Demo (reduced-motion test section)
        </Typography>
        <Typography variant="body-lg">
          This section animates in on scroll. With OS-level reduce-motion
          enabled, it appears instantly with no transform/opacity animation.
        </Typography>
      </Reveal>
    </div>
  );
}
