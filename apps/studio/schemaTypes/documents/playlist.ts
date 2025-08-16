import { StackCompactIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const playlist = defineType({
  name: "playlist",
  title: "Playlist",
  type: "document",
  icon: StackCompactIcon,
  description: "A curated collection of startups (e.g., Editor's Picks)",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      description: "Name of this collection",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      title: "Slug",
      description: "Unique identifier for fetching this playlist",
      options: { source: "title" },
    }),
    defineField({
      name: "select",
      type: "array",
      title: "Startups",
      description: "The startups included in this collection",
      of: [{ type: "reference", to: [{ type: "startup" }] }],
    }),
  ],
  preview: {
    select: {
      title: "title",
      count: "select",
    },
    prepare: ({ title, count }) => ({
      title: title || "Untitled Playlist",
      subtitle: `${count?.length ?? 0} startups`,
      media: StackCompactIcon,
    }),
  },
});
