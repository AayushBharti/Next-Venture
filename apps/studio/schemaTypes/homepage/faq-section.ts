import { defineField, defineType } from "sanity";

export const faqSection = defineType({
  name: "faqSection",
  title: "FAQ Section",
  type: "object",
  fields: [
    defineField({
      name: "eyebrow",
      type: "string",
      title: "Eyebrow",
      description: "Small label above the title (e.g., 'FAQs')",
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
      name: "faqs",
      type: "array",
      title: "FAQs",
      description: "Select FAQ items to display",
      of: [{ type: "reference", to: [{ type: "faq" }] }],
    }),
  ],
});
