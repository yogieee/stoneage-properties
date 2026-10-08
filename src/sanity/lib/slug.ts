import type { SlugRule } from "sanity";

/** Strict, URL-safe slugify: lowercase letters, digits, and single hyphens only. */
export function strictSlugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/**
 * Shared `slug` field options: makes the "Generate" button produce a clean,
 * URL-safe value, and blocks publishing if someone hand-types a slug with
 * spaces, apostrophes, or uppercase letters (the cause of a project page
 * 404ing in production because its slug was "architect's-office refurbishment").
 */
export function slugOptions(sourceField: string) {
  return {
    source: sourceField,
    slugify: strictSlugify,
  };
}

export function requireUrlSafeSlug(rule: SlugRule) {
  return rule.required().custom((slug) => {
    if (!slug?.current) return true;
    return SLUG_PATTERN.test(slug.current)
      ? true
      : "Slug must be lowercase letters, numbers, and hyphens only (no spaces, apostrophes, or punctuation) — e.g. \"architects-office-refurbishment\".";
  });
}
