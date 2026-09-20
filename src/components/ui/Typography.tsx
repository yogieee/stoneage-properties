import { type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type TypographyVariant =
  | "display-xl"
  | "display-lg"
  | "display-md"
  | "display-sm"
  | "body-lg"
  | "body"
  | "body-sm";

const VARIANT_STYLES: Record<
  TypographyVariant,
  { className: string; defaultElement: ElementType }
> = {
  "display-xl": {
    className: "font-display text-display-xl leading-tight text-ink",
    defaultElement: "h1",
  },
  "display-lg": {
    className: "font-display text-display-lg leading-tight text-ink",
    defaultElement: "h1",
  },
  "display-md": {
    className: "font-display text-display-md leading-tight text-ink",
    defaultElement: "h2",
  },
  "display-sm": {
    className: "font-display text-display-sm leading-snug text-ink",
    defaultElement: "h3",
  },
  "body-lg": {
    className: "font-body text-body-lg leading-relaxed text-ink-muted",
    defaultElement: "p",
  },
  body: {
    className: "font-body text-body leading-relaxed text-ink-muted",
    defaultElement: "p",
  },
  "body-sm": {
    className: "font-body text-body-sm leading-relaxed text-ink-subtle",
    defaultElement: "p",
  },
};

type TypographyProps = {
  variant: TypographyVariant;
  as?: ElementType;
  className?: string;
  children: ReactNode;
};

/**
 * Design-system typography primitive. Every heading/body variant consumes
 * the project's semantic `@theme` tokens (`text-display-*`, `text-body*`,
 * `text-ink*`) only — never raw Tailwind default text-size/color utilities.
 *
 * `as` overrides the rendered element without changing the visual variant,
 * so semantics (e.g. an `h2` styled like `display-sm`) stay decoupled from
 * appearance.
 */
export function Typography({
  variant,
  as,
  className,
  children,
}: TypographyProps) {
  const { className: variantClassName, defaultElement } =
    VARIANT_STYLES[variant];
  const Component = as ?? defaultElement;

  return (
    <Component className={cn(variantClassName, className)}>
      {children}
    </Component>
  );
}

export const TYPOGRAPHY_VARIANTS = Object.keys(
  VARIANT_STYLES,
) as TypographyVariant[];
