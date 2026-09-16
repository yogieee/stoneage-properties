import { defineField, defineType } from "sanity";

export const expertiseArea = defineType({
  name: "expertiseArea",
  title: "Expertise Area",
  type: "document",
  fields: [
    defineField({
      name: "number",
      title: "Number",
      description: "Displayed numeral, e.g. \"1\"",
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
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "service",
      title: "Related service",
      description: "If set, the \"Explore Related Works\" link points to this service's detail page instead of the general Projects page.",
      type: "reference",
      to: [{ type: "service" }],
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
    select: { title: "title", subtitle: "number", media: "image" },
  },
});
