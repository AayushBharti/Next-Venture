import { defineField, defineType } from "sanity";

import { buttonsField } from "@/schemaTypes/common";

export const heroSection = defineType({
  name: "heroSection",
  title: "Hero Section",
  type: "object",
  fields: [
    defineField({
      name: "badge",
      type: "string",
      title: "Badge Text",
      description:
        "Small highlighted text above the title (e.g., 'Pitch. Vote. Grow.')",
    }),
    defineField({
      name: "title",
      type: "text",
      title: "Title",
      description: "Main hero heading — supports line breaks",
      rows: 3,
    }),
    defineField({
      name: "subtitle",
      type: "text",
      title: "Subtitle",
      description: "Supporting text below the title",
      rows: 3,
    }),
    buttonsField,
    defineField({
      name: "decorativeImages",
      type: "array",
      title: "Decorative Images",
      description: "Draggable overlay images for the hero animation",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
  ],
});
