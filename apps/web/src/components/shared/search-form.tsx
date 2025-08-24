import { Button } from "@workspace/ui/components/button";
import { Search, X } from "lucide-react";
import Form from "next/form";
import Link from "next/link";

/**
 * Hero search bar using Next.js Form component.
 * Submits to /search?query=... with an optional reset link.
 */
export function SearchForm({ query }: { query?: string }) {
  return (
    <Form
      action="/search/"
      className="mx-auto mt-8 flex w-full max-w-2xl items-center gap-2 rounded-full border border-neutral-200/60 bg-neutral-50 shadow-sm p-1.5 backdrop-blur-sm transition-all focus-within:border-neutral-300/60 focus-within:bg-white focus-within:shadow-md dark:border-white/15 dark:bg-white/5 dark:shadow-none dark:focus-within:border-white/30 dark:focus-within:bg-white/10 dark:focus-within:shadow-none"
    >
      <input
        name="query"
        defaultValue={query}
        placeholder="Search Startups"
        className="h-12 w-full rounded-full border-none bg-transparent pl-4 text-xl font-semibold text-neutral-900 outline-none placeholder:text-neutral-500 focus-visible:ring-0 focus-visible:ring-offset-0 dark:text-white dark:placeholder:text-white/70 md:text-2xl"
      />
      <div className="flex items-center gap-2">
        {query && (
          <Link
            href="/search"
            aria-label="Clear search"
            className="flex size-8 items-center justify-center rounded-full bg-neutral-100 transition hover:bg-neutral-200 dark:bg-white/10 dark:hover:bg-white/20"
          >
            <X className="size-4" />
          </Link>
        )}
        <Button
          type="submit"
          className="m-0 mr-1 h-10 rounded-full bg-pink-400 px-4 text-base text-black hover:bg-pink-500"
        >
          <Search className="size-5 md:mr-2" />
          <span className="hidden md:flex">Search</span>
        </Button>
      </div>
    </Form>
  );
}
