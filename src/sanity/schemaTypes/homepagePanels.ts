import { defineField, defineType } from "sanity";

export const homepagePanels = defineType({
  name: "homepagePanels",
  title: "Homepage Panels",
  type: "document",
  fields: [
    defineField({
      name: "panels",
      title: "Panels",
      description:
        "The four image link panels shown below the homepage intro (Projects, Design, Build, Studio).",
      type: "array",
      validation: (rule) => rule.required().length(4),
      of: [
        {
          type: "object",
          name: "panel",
          fields: [
            defineField({
              name: "image",
              title: "Image",
              type: "image",
              options: { hotspot: true },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "eyebrow",
              title: "Eyebrow",
              description: 'Small label above the title, e.g. "Portfolio"',
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "href",
              title: "Link",
              description: 'Internal path, e.g. "/projects"',
              type: "string",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: "title", subtitle: "eyebrow", media: "image" },
          },
        },
      ],
    }),
    defineField({
      name: "methodology",
      title: "Methodology statement",
      description:
        'The "Our Methodology / Conceive. Engineer. Craft." statement between the first two panel rows.',
      type: "object",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
        defineField({ name: "heading", title: "Heading", type: "string" }),
        defineField({
          name: "body",
          title: "Body paragraphs",
          type: "array",
          of: [{ type: "text", rows: 4 }],
        }),
      ],
    }),
    defineField({
      name: "statement",
      title: "Closing statement",
      description:
        'The "Bespoke Residences / Quiet Luxury & Enduring Form" statement at the bottom of the panels section.',
      type: "object",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
        defineField({ name: "heading", title: "Heading", type: "string" }),
        defineField({
          name: "body",
          title: "Body paragraphs",
          type: "array",
          of: [{ type: "text", rows: 4 }],
        }),
        defineField({ name: "ctaLabel", title: "CTA label", type: "string" }),
        defineField({ name: "ctaHref", title: "CTA link", type: "string" }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Homepage Panels" }),
  },
});
