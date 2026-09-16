import { PortableText, type PortableTextComponents } from "@portabletext/react";

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="font-display text-ink mt-12 mb-4 text-2xl font-medium tracking-tight first:mt-0 sm:text-3xl">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-display text-ink mt-10 mb-3 text-xl font-medium tracking-tight sm:text-2xl">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="font-display text-ink mt-8 mb-3 text-lg font-medium tracking-tight">
        {children}
      </h4>
    ),
    normal: ({ children }) => (
      <p className="font-body text-ink-muted mb-6 text-base leading-relaxed sm:text-lg">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-line font-display text-ink my-10 border-l-2 pl-6 text-xl leading-snug italic sm:text-2xl">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="font-body text-ink-muted mb-6 list-outside list-disc space-y-2 pl-5 text-base leading-relaxed sm:text-lg">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="font-body text-ink-muted mb-6 list-outside list-decimal space-y-2 pl-5 text-base leading-relaxed sm:text-lg">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
  },
  marks: {
    strong: ({ children }) => (
      <strong className="text-ink font-semibold">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target={value?.href?.startsWith("http") ? "_blank" : undefined}
        rel={value?.href?.startsWith("http") ? "noopener noreferrer" : undefined}
        className="text-ink underline decoration-line decoration-1 underline-offset-4 transition-colors hover:decoration-ink"
      >
        {children}
      </a>
    ),
  },
};

export function ArticleBody({ value }: { value: unknown }) {
  return (
    <div className="max-w-none">
      <PortableText value={value as never} components={components} />
    </div>
  );
}
