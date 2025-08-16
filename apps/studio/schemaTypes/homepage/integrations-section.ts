import { defineField, defineType } from "sanity";

export const integrationsSection = defineType({
  name: "integrationsSection",
  title: "Integrations Section",
  type: "object",
  fields: [
    defineField({
      name: "eyebrow",
      type: "string",
      title: "Eyebrow",
      description: "Small label above the title (e.g., 'Integrations')",
    }),
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      description: "Section heading",
    }),
    defineField({
      name: "subtitle",
      type: "text",
      title: "Subtitle",
      description: "Supporting text below the heading",
      rows: 2,
    }),
    defineField({
      name: "integrations",
      type: "array",
      title: "Integrations",
      description: "Integration cards in the scrolling columns",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "icon",
              type: "image",
              title: "Icon",
            }),
            defineField({
              name: "name",
              type: "string",
              title: "Name",
            }),
            defineField({
              name: "description",
              type: "text",
              title: "Description",
              rows: 2,
            }),
          ],
          preview: {
            select: { title: "name", media: "icon" },
          },
        },
      ],
    }),
  ],
});
