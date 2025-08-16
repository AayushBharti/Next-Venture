import { CommentIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const comment = defineType({
  name: "comment",
  title: "Comment",
  type: "document",
  icon: CommentIcon,
  description: "A comment on a startup pitch",
  fields: [
    defineField({
      name: "author",
      type: "reference",
      title: "Author",
      description: "The user who posted this comment",
      to: [{ type: "author" }],
      validation: (rule) => rule.required(),
      readOnly: true,
    }),
    defineField({
      name: "startup",
      type: "reference",
      title: "Startup",
      description: "The startup this comment belongs to",
      to: [{ type: "startup" }],
      validation: (rule) => rule.required(),
      readOnly: true,
    }),
    defineField({
      name: "content",
      type: "text",
      title: "Content",
      description: "The comment text (max 200 characters)",
      rows: 3,
      validation: (rule) =>
        rule
          .required()
          .max(200)
          .error("Comment must be 200 characters or less"),
    }),
  ],
  preview: {
    select: {
      title: "content",
      subtitle: "author.name",
    },
    prepare: ({ title, subtitle }) => ({
      title: title
        ? title.length > 50
          ? `${title.slice(0, 50)}...`
          : title
        : "Empty comment",
      subtitle: `by ${subtitle || "Unknown"}`,
    }),
  },
});
