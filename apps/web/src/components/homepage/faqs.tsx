"use client";

import { cn } from "@workspace/ui/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import { RichText } from "@/components/elements/rich-text";
import { Tag } from "@/components/shared/tag";
import type { PagebuilderType } from "@/types";

type FaqsSectionProps = PagebuilderType<"faqSection">;

export function Faqs({ eyebrow, title, subtitle, faqs }: FaqsSectionProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!faqs || faqs.length === 0) {
    return null;
  }

  return (
    <section id="faqs" className="py-24">
      <div className="container">
        <div className="flex justify-center">
          {eyebrow && <Tag>{eyebrow}</Tag>}
        </div>

        {title && (
          <h2 className="mx-auto mt-6 max-w-xl text-center text-6xl font-medium">
            {title}
          </h2>
        )}

        {subtitle && (
          <p className="mx-auto mt-4 max-w-xl text-center text-lg text-neutral-500 dark:text-white/50">
            {subtitle}
          </p>
        )}

        <div className="mx-auto mt-12 flex max-w-xl flex-col gap-6">
          {faqs.map((faq, faqIndex) => (
            <button
              key={faq?._id}
              type="button"
              className="w-full cursor-pointer rounded-2xl border border-neutral-200/60 dark:border-white/10 bg-gradient-to-b from-neutral-50 to-white shadow-sm dark:from-neutral-900 dark:to-neutral-900 dark:shadow-none p-6 text-left transition hover:shadow-md hover:border-neutral-300/60 dark:hover:border-white/20 dark:hover:shadow-none"
              onClick={() =>
                setSelectedIndex(selectedIndex === faqIndex ? -1 : faqIndex)
              }
            >
              <div className="flex w-full items-center justify-between">
                <h3 className="font-medium">{faq?.title}</h3>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  role="img"
                  aria-label={
                    selectedIndex === faqIndex ? "Collapse" : "Expand"
                  }
                  className={cn(
                    "feather feather-plus shrink-0 text-pink-400 transition duration-300",
                    selectedIndex === faqIndex && "rotate-45"
                  )}
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </div>

              <AnimatePresence>
                {selectedIndex === faqIndex && (
                  <motion.div
                    initial={{ height: 0, marginTop: 0 }}
                    animate={{ height: "auto", marginTop: 24 }}
                    exit={{ height: 0, marginTop: 0 }}
                    className="overflow-hidden"
                  >
                    <RichText
                      className="text-neutral-500 dark:text-white/50"
                      richText={faq?.richText ?? []}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
