import { TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

/**
 * Category document type with predefined options + "Other".
 * Used to classify startups by industry/topic.
 */
export const category = defineType({
  name: "category",
  title: "Category",
  type: "document",
  icon: TagIcon,
  description: "Industry or topic category for classifying startups",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      description: "The display name of this category",
      validation: (rule) => rule.required().error("Category title is required"),
    }),
    defineField({
      name: "slug",
      type: "slug",
      title: "Slug",
      description: "URL-friendly identifier, auto-generated from the title",
      options: { source: "title" },
      validation: (rule) => rule.required().error("Slug is required"),
    }),
    defineField({
      name: "description",
      type: "text",
      title: "Description",
      description: "A short description of what this category covers",
      rows: 2,
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare: ({ title }) => ({
      title: title || "Untitled Category",
    }),
  },
});
