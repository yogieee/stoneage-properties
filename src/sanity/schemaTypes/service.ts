import { defineField, defineType } from "sanity";

export const service = defineType({
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Summary",
      description: "One-line summary, used on the services index page.",
      type: "text",
      rows: 2,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      description: "Longer paragraph(s), used on the service detail page.",
      type: "text",
      rows: 6,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroImage",
      title: "Hero image",
      description: "Cover image shown at the top of the service detail page.",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "note",
      title: "Hero note",
      description:
        "Short pinned-note line shown beside the summary on the service detail page (e.g. homepage's 'Calm homes, lasting craft.').",
      type: "object",
      fields: [
        defineField({ name: "line", title: "Line", type: "string" }),
        defineField({ name: "subline", title: "Subline", type: "string" }),
      ],
    }),
    defineField({
      name: "process",
      title: "How it works",
      description:
        "Ordered steps explaining how the service works and how the team collaborates with the client (e.g. Consultation, Design & Quote, On-Site Delivery, Handover & Warranty).",
      type: "array",
      of: [
        {
          type: "object",
          name: "processStep",
          fields: [
            defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "detail", title: "Detail", type: "text", rows: 3, validation: (rule) => rule.required() }),
          ],
          preview: { select: { title: "title", subtitle: "detail" } },
        },
      ],
    }),
    defineField({
      name: "features",
      title: "What's included",
      description: "Bullet list of what's included with this service.",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "faqs",
      title: "FAQs",
      description: "Frequently asked questions shown on the service detail page.",
      type: "array",
      of: [
        {
          type: "object",
          name: "faq",
          fields: [
            defineField({ name: "question", title: "Question", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "answer", title: "Answer", type: "text", rows: 3, validation: (rule) => rule.required() }),
          ],
          preview: { select: { title: "question", subtitle: "answer" } },
        },
      ],
    }),
    defineField({
      name: "metaDescription",
      title: "Meta description",
      description: "SEO description override. Falls back to Summary if left blank.",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "warranty",
      title: "Warranty",
      type: "object",
      fields: [
        defineField({ name: "label", title: "Label", type: "string" }),
        defineField({ name: "detail", title: "Detail", type: "text", rows: 3 }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "order",
      title: "Display order",
      type: "number",
    }),
  ],
  orderings: [
    {
      title: "Display order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "name", subtitle: "summary" },
  },
});
