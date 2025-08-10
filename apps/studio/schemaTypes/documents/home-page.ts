import { HomeIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

import { pageBuilderField } from "@/schemaTypes/common";
import { GROUP, GROUPS } from "@/utils/constant";
import { ogFields } from "@/utils/og-fields";
import { seoFields } from "@/utils/seo-fields";

export const homePage = defineType({
  name: "homePage",
  type: "document",
  title: "Home Page",
  icon: HomeIcon,
  description:
    "The main landing page — build it by adding section blocks below. Animations are handled by the frontend.",
  groups: GROUPS,
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Page Title",
      description: "Internal title for this page",
      group: GROUP.MAIN_CONTENT,
    }),
    ...seoFields.filter(
      (field) => !["seoNoIndex", "seoHideFromLists"].includes(field.name)
    ),
    ...ogFields,
    pageBuilderField,
  ],
  preview: {
    select: { title: "title" },
    prepare: ({ title }) => ({
      title: title || "Home Page",
      media: HomeIcon,
    }),
  },
});
