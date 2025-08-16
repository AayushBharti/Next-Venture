import { defineField, defineType } from "sanity";

export const recentPitchesSection = defineType({
  name: "recentPitchesSection",
  title: "Recent Pitches Section",
  type: "object",
  fields: [
    defineField({
      name: "eyebrow",
      type: "string",
      title: "Eyebrow",
      description: "Small label above the title (e.g., 'Recent Pitches')",
    }),
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      description: "Heading for the recent pitches carousel",
    }),
    defineField({
      name: "count",
      type: "number",
      title: "Number of Pitches",
      description: "How many recent startups to show",
      initialValue: 5,
    }),
  ],
});
