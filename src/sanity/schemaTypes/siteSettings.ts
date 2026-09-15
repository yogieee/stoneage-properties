import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "email",
      title: "Enquiries email",
      type: "string",
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: "phones",
      title: "Phone numbers",
      type: "array",
      of: [
        {
          type: "object",
          name: "phone",
          fields: [
            defineField({ name: "label", title: "Label", type: "string" }),
            defineField({ name: "number", title: "Number", type: "string" }),
          ],
        },
      ],
    }),
    defineField({
      name: "offices",
      title: "Offices",
      type: "array",
      of: [
        {
          type: "object",
          name: "office",
          fields: [
            defineField({ name: "name", title: "Name", type: "string" }),
            defineField({ name: "address", title: "Address", type: "text", rows: 2 }),
          ],
        },
      ],
    }),
    defineField({
      name: "socials",
      title: "Social links",
      type: "array",
      of: [
        {
          type: "object",
          name: "social",
          fields: [
            defineField({
              name: "platform",
              title: "Platform",
              type: "string",
              options: {
                list: ["Facebook", "YouTube", "LinkedIn", "Instagram", "WhatsApp"],
              },
            }),
            defineField({ name: "url", title: "URL", type: "url" }),
          ],
        },
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Site Settings" }),
  },
});
