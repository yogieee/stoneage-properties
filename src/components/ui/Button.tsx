import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "text-link";

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary:
    "px-6 py-3 bg-black text-white border border-black hover:bg-transparent hover:text-black",
  secondary:
    "px-6 py-3 border border-black/20 bg-transparent text-black hover:border-black",
  ghost: "px-6 py-3 bg-transparent text-black hover:opacity-70",
  "text-link":
    "group/link gap-2 rounded-none px-0 py-0 text-black underline-offset-4 hover:underline",
};

/** Arrow glyph for `text-link` CTAs — translates right on hover. */
export function ButtonArrow() {
  return (
    <span
      aria-hidden
      className="inline-block transition-transform duration-300 ease-out group-hover/link:translate-x-1"
    >
      &rarr;
    </span>
  );
}

type ButtonOwnProps<T extends ElementType> = {
  variant?: ButtonVariant;
  /** Renders as a different element/component (e.g. `next/link`'s `Link`)
   * while keeping identical variant styling — mirrors `Typography`'s `as`
   * override so CTAs can be real navigable links, not `<button>`s. */
  as?: T;
  className?: string;
};

type ButtonProps<T extends ElementType> = ButtonOwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof ButtonOwnProps<T>>;

/**
 * Design-system button primitive. Styled entirely from project semantic
 * `@theme` tokens (`bg-ink`, `text-paper`, `border-line`, etc.) with a CSS
 * transition for the hover micro-interaction. Polymorphic via `as` (like
 * `Typography`) so CTAs can render as `next/link`'s `Link` and stay real,
 * navigable links rather than `<button>`s.
 */
export function Button<T extends ElementType = "button">({
  variant = "primary",
  as,
  className,
  children,
  ...props
}: ButtonProps<T>) {
  const Tag = (as ?? "button") as ElementType;
  return (
    <Tag
      className={cn(
        "font-body text-body-sm inline-flex items-center justify-center transition-colors duration-300 ease-out",
        VARIANT_STYLES[variant],
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}

export const BUTTON_VARIANTS = Object.keys(VARIANT_STYLES) as ButtonVariant[];
