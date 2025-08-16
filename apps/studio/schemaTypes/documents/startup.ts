import { RocketIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const startup = defineType({
  name: "startup",
  title: "Startup",
  type: "document",
  icon: RocketIcon,
  description: "A startup pitch submitted by a user",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      description: "The name of the startup pitch",
      validation: (rule) => rule.required().error("Title is required"),
    }),
    defineField({
      name: "slug",
      type: "slug",
      title: "Slug",
      description: "URL-friendly identifier, auto-generated from the title",
      options: { source: "title" },
    }),
    defineField({
      name: "author",
      type: "reference",
      title: "Author",
      description: "The person who submitted this pitch",
      to: [{ type: "author" }],
    }),
    defineField({
      name: "description",
      type: "text",
      title: "Description",
      description: "A short summary of the startup idea (1-2 sentences)",
      rows: 3,
    }),
    defineField({
      name: "category",
      type: "reference",
      title: "Category",
      description: "The industry or topic this startup belongs to",
      to: [{ type: "category" }],
      validation: (rule) => rule.required().error("Category is required"),
    }),
    defineField({
      name: "image",
      type: "image",
      title: "Cover Image",
      description: "The main image representing this startup",
      options: { hotspot: true },
      validation: (rule) => rule.required().error("Cover image is required"),
    }),
    defineField({
      name: "pitch",
      type: "markdown",
      title: "Pitch",
      description:
        "The full startup pitch — use markdown for headings, lists, bold, etc.",
    }),
    defineField({
      name: "views",
      type: "number",
      title: "Views",
      description: "Total page views — auto-incremented, do not edit manually",
      initialValue: 0,
      readOnly: true,
    }),
    defineField({
      name: "upvotes",
      type: "number",
      title: "Upvotes",
      description:
        "Total upvote count — auto-incremented, do not edit manually",
      initialValue: 0,
      readOnly: true,
    }),
    defineField({
      name: "aiAnalysis",
      type: "object",
      title: "AI Analysis",
      description: "AI-generated pitch analysis — auto-populated on submission",
      hidden: true,
      readOnly: true,
      fields: [
        defineField({
          name: "overallScore",
          type: "number",
          title: "Overall Score",
          description:
            "Weighted average: clarity 35%, market 35%, uniqueness 30%",
        }),
        defineField({
          name: "clarity",
          type: "object",
          title: "Clarity",
          fields: [
            defineField({ name: "score", type: "number", title: "Score" }),
            defineField({ name: "feedback", type: "text", title: "Feedback" }),
          ],
        }),
        defineField({
          name: "marketPositioning",
          type: "object",
          title: "Market Positioning",
          fields: [
            defineField({ name: "score", type: "number", title: "Score" }),
            defineField({ name: "feedback", type: "text", title: "Feedback" }),
          ],
        }),
        defineField({
          name: "uniqueness",
          type: "object",
          title: "Uniqueness",
          fields: [
            defineField({ name: "score", type: "number", title: "Score" }),
            defineField({ name: "feedback", type: "text", title: "Feedback" }),
          ],
        }),
        defineField({
          name: "suggestions",
          type: "array",
          title: "Suggestions",
          of: [{ type: "string" }],
        }),
        defineField({
          name: "analyzedAt",
          type: "datetime",
          title: "Analyzed At",
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      author: "author.name",
      media: "image",
      category: "category.title",
    },
    prepare: ({ title, author, media, category }) => ({
      title: title || "Untitled Startup",
      subtitle: `${category || "No category"} — by ${author || "Unknown"}`,
      media,
    }),
  },
});
