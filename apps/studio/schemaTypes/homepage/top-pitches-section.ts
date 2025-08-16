import { defineField, defineType } from "sanity";

export const topPitchesSection = defineType({
  name: "topPitchesSection",
  title: "Top Pitches Section",
  type: "object",
  fields: [
    defineField({
      name: "eyebrow",
      type: "string",
      title: "Eyebrow",
      description: "Small label above the title (e.g., 'Top Pitches')",
    }),
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      description: "Heading for the top pitches carousel",
    }),
    defineField({
      name: "count",
      type: "number",
      title: "Number of Pitches",
      description: "How many top startups to show",
      initialValue: 5,
    }),
  ],
});
