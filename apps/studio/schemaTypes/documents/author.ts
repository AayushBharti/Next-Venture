import { UserIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

import { imageWithAltField } from "@/schemaTypes/common";

export const author = defineType({
  name: "author",
  title: "Author",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({
      name: "name",
      type: "string",
      title: "Name",
      description: "The full name of the person who wrote the content",
      validation: (Rule) => Rule.required().error("Author name is required"),
    }),
    defineField({
      name: "position",
      type: "string",
      title: "Position",
      description:
        "The job title or role of this person, like 'Editor' or 'Writer'",
    }),
    imageWithAltField({
      title: "Image",
      description:
        "A photo of the author that will appear next to their articles",
    }),
    defineField({
      name: "bio",
      type: "text",
      title: "Bio",
      description:
        "A short paragraph about the author's background and expertise",
      rows: 3,
    }),
    defineField({
      name: "githubId",
      type: "number",
      title: "GitHub ID",
      description: "The user's GitHub ID — set automatically on sign-in",
      readOnly: true,
    }),
    defineField({
      name: "username",
      type: "string",
      title: "GitHub Username",
      description:
        "The user's GitHub login handle — set automatically on sign-in",
      readOnly: true,
    }),
    defineField({
      name: "email",
      type: "string",
      title: "Email",
      description: "The user's email address — set automatically on sign-in",
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: "name",
      position: "position",
      media: "image",
      bio: "bio",
    },
    prepare: ({ title, position, media, bio }) => {
      const positionInfo = position ? `💼 ${position}` : "🎭 Mystery Writer";
      return {
        title: `✍️ ${title || "Unnamed Author"}`,
        subtitle: `${positionInfo} | ${bio}`,
        media,
      };
    },
  },
});
