import { sanityFetch } from "@workspace/sanity/live";
import { queryFooterData } from "@workspace/sanity/query";
import Link from "next/link";

import { RichText } from "./elements/rich-text";
import { TextHoverEffect } from "./shared/text-hover-effect";

export async function FooterServer() {
  const { data } = await sanityFetch({ query: queryFooterData });

  if (!data) {
    return <FooterSkeleton />;
  }

  return (
    <footer className="py-8">
      <Link href="/startup/create" className="block w-full">
        <div className="hidden h-64 md:block lg:h-80">
          <TextHoverEffect text="VentureDen" />
        </div>
        <div className="h-44 md:hidden">
          <TextHoverEffect
            text="Pitch"
            viewBox="0 0 100 37"
            strokeWidth={0.4}
          />
        </div>
      </Link>
      <div className="container mx-auto">
        <RichText
          richText={data.richText}
          className="prose-sm dark:prose-invert max-w-none text-center prose-p:my-0 prose-p:text-neutral-400 dark:prose-p:text-white/40"
        />
      </div>
    </footer>
  );
}

export function FooterSkeleton() {
  return (
    <footer className="py-8">
      <div className="container mx-auto pt-8">
        <div className="flex justify-center">
          <div className="h-4 w-72 animate-pulse rounded bg-neutral-100 dark:bg-white/5" />
        </div>
      </div>
    </footer>
  );
}
