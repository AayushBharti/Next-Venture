import { defineField, defineType } from "sanity";

export const logoTickerSection = defineType({
  name: "logoTickerSection",
  title: "Logo Ticker Section",
  type: "object",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      description:
        "Heading text above the logos (e.g., 'Trusted by Innovative Companies')",
    }),
    defineField({
      name: "logos",
      type: "array",
      title: "Logos",
      description: "Company logos that scroll horizontally",
      of: [{ type: "image" }],
    }),
    defineField({
      name: "speed",
      type: "number",
      title: "Scroll Speed (seconds)",
      description: "Duration of one full scroll cycle",
      initialValue: 30,
    }),
  ],
});
