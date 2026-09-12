import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary:
    "bg-ink text-paper hover:bg-ink-muted",
  secondary:
    "border border-line bg-transparent text-ink hover:bg-paper-dim",
  ghost:
    "bg-transparent text-ink hover:text-ink-muted",
};

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
        "font-body text-body-sm inline-flex items-center justify-center rounded-full px-6 py-3 transition-colors duration-300 ease-out",
        VARIANT_STYLES[variant],
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
