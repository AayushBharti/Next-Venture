import { client } from "@workspace/sanity/client";
import { sanityFetch } from "@workspace/sanity/live";
import {
  queryAllCategoriesWithCount,
  queryCategoryBySlug,
  queryCategoryPaths,
  queryStartupsByCategory,
} from "@workspace/sanity/query";
import {
  ArrowLeft,
  ArrowRight,
  Boxes,
  BrainCircuit,
  Code2,
  CreditCard,
  GraduationCap,
  type LucideIcon,
  Monitor,
  Paintbrush,
  Rocket,
  Server,
  Shield,
  Video,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getSEOMetadata } from "@/lib/seo";
import { StartupCard } from "@/components/startup/startup-card";

type Props = {
  params: Promise<{ slug: string }>;
};

/** Map category slugs to themed icons. */
const CATEGORY_ICONS: Record<string, LucideIcon> = {
  ai: BrainCircuit,
  "developer-tools": Code2,
  design: Paintbrush,
  devops: Wrench,
  edtech: GraduationCap,
  saas: Monitor,
  "creator-tools": Video,
  infrastructure: Server,
  security: Shield,
  fintech: CreditCard,
  other: Boxes,
};

/** Map category slugs to themed gradient pairs. */
const CATEGORY_GRADIENTS: Record<string, { from: string; to: string }> = {
  ai: { from: "from-violet-600/20", to: "to-indigo-600/5" },
  "developer-tools": { from: "from-cyan-600/20", to: "to-blue-600/5" },
  design: { from: "from-rose-600/20", to: "to-pink-600/5" },
  devops: { from: "from-emerald-600/20", to: "to-teal-600/5" },
  edtech: { from: "from-amber-600/20", to: "to-yellow-600/5" },
  saas: { from: "from-blue-600/20", to: "to-sky-600/5" },
  "creator-tools": { from: "from-fuchsia-600/20", to: "to-purple-600/5" },
  infrastructure: { from: "from-slate-600/20", to: "to-zinc-600/5" },
  security: { from: "from-red-600/20", to: "to-orange-600/5" },
  fintech: { from: "from-green-600/20", to: "to-emerald-600/5" },
  other: { from: "from-pink-600/20", to: "to-rose-600/5" },
};

const CATEGORY_ACCENTS: Record<string, string> = {
  ai: "text-violet-400 border-violet-500/30 bg-violet-500/10",
  "developer-tools": "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
  design: "text-rose-400 border-rose-500/30 bg-rose-500/10",
  devops: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
  edtech: "text-amber-400 border-amber-500/30 bg-amber-500/10",
  saas: "text-blue-400 border-blue-500/30 bg-blue-500/10",
  "creator-tools": "text-fuchsia-400 border-fuchsia-500/30 bg-fuchsia-500/10",
  infrastructure: "text-slate-400 border-slate-500/30 bg-slate-500/10",
  security: "text-red-400 border-red-500/30 bg-red-500/10",
  fintech: "text-green-400 border-green-500/30 bg-green-500/10",
  other: "text-pink-400 border-pink-500/30 bg-pink-500/10",
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const { data: category } = await sanityFetch({
    query: queryCategoryBySlug,
    params: { slug },
  });

  return getSEOMetadata({
    title: category?.title ? `${category.title} Startups` : "Category",
    description:
      category?.description ??
      `Browse startup pitches in the ${category?.title ?? slug} category.`,
    slug: `/category/${slug}`,
  });
}

/**
 * Pre-generate category pages at build time.
 */
export async function generateStaticParams() {
  const slugs = await client.fetch(queryCategoryPaths);
  return (slugs ?? []).map((slug: string) => ({ slug }));
}

export const dynamicParams = true;

/**
 * Category page — hero with themed gradient, stats, grid, sidebar nav.
 */
export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;

  const [{ data: category }, { data: startups }, { data: categories }] =
    await Promise.all([
      sanityFetch({ query: queryCategoryBySlug, params: { slug } }),
      sanityFetch({ query: queryStartupsByCategory, params: { slug } }),
      sanityFetch({ query: queryAllCategoriesWithCount }),
    ]);

  if (!category) {
    notFound();
  }

  const defaultGradient = { from: "from-pink-600/20", to: "to-rose-600/5" };
  const defaultAccent = "text-pink-400 border-pink-500/30 bg-pink-500/10";
  const gradient = CATEGORY_GRADIENTS[slug] ?? defaultGradient;
  const Icon = CATEGORY_ICONS[slug] ?? Rocket;
  const accent = CATEGORY_ACCENTS[slug] ?? defaultAccent;

  return (
    <main className="min-h-screen pb-24">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-32 pb-20">
        {/* Themed gradient background */}
        <div
          className={`pointer-events-none absolute inset-0 bg-gradient-to-b ${gradient.from} ${gradient.to}`}
        />
        {/* Decorative grid */}
        <div className="pointer-events-none absolute inset-0 opacity-5 [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:4rem_4rem]" />

        <div className="relative mx-auto max-w-6xl px-6">
          <Link
            href="/startup"
            className="mb-8 inline-flex items-center gap-1.5 text-sm text-neutral-400 dark:text-white/40 transition hover:text-neutral-900 dark:hover:text-white"
          >
            <ArrowLeft className="size-4" />
            All Pitches
          </Link>

          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              {/* Icon badge */}
              <div
                className={`mb-6 inline-flex size-16 items-center justify-center rounded-2xl border ${accent}`}
              >
                <Icon className="size-8" />
              </div>

              <h1 className="text-5xl font-bold tracking-tight md:text-6xl">
                {category.title}
              </h1>

              {category.description && (
                <p className="mt-4 text-lg leading-relaxed text-neutral-500 dark:text-white/50">
                  {category.description}
                </p>
              )}
            </div>

            {/* Stats card */}
            <div className="flex shrink-0 gap-6 rounded-2xl border border-neutral-200/60 dark:border-white/10 bg-gradient-to-b from-neutral-50 to-neutral-100 shadow-sm dark:from-white/5 dark:to-white/5 dark:shadow-none px-8 py-5 backdrop-blur-sm">
              <div className="text-center">
                <p className="text-3xl font-bold">{startups.length}</p>
                <p className="mt-1 text-xs text-neutral-400 dark:text-white/40">
                  {startups.length === 1 ? "Pitch" : "Pitches"}
                </p>
              </div>
              <div className="w-px bg-neutral-200 dark:bg-white/10" />
              <div className="text-center">
                <p className="text-3xl font-bold">
                  {
                    new Set(
                      startups
                        .map((s) =>
                          "author" in s && s.author ? s.author.name : null
                        )
                        .filter(Boolean)
                    ).size
                  }
                </p>
                <p className="mt-1 text-xs text-neutral-400 dark:text-white/40">
                  Founders
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="mx-auto mt-12 max-w-6xl px-6">
        <div className="flex flex-col gap-12 lg:flex-row">
          {/* ── Main grid ── */}
          <div className="min-w-0 flex-1">
            {startups.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {startups.map((startup) => (
                  <StartupCard key={startup._id} post={startup} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-neutral-200 dark:border-white/10 py-24">
                <div
                  className={`mb-6 inline-flex size-20 items-center justify-center rounded-3xl border ${accent}`}
                >
                  <Icon className="size-10" />
                </div>
                <p className="text-lg font-medium text-neutral-400 dark:text-white/40">
                  No pitches in {category.title} yet
                </p>
                <p className="mt-2 text-sm text-neutral-300 dark:text-white/25">
                  Be the first to submit a pitch in this category
                </p>
                <Link
                  href="/startup/create"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-neutral-100 dark:bg-white/10 px-5 py-2.5 text-sm font-medium transition hover:bg-neutral-200 dark:hover:bg-white/20"
                >
                  Submit a Pitch
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            )}
          </div>

          {/* ── Sidebar ── */}
          <aside className="lg:w-64 lg:shrink-0">
            <div className="sticky top-28 space-y-6">
              {/* Category nav */}
              <div className="rounded-2xl border border-neutral-200/60 dark:border-white/10 bg-gradient-to-b from-neutral-50/80 to-white/80 shadow-sm dark:from-neutral-900/50 dark:to-neutral-900/50 dark:shadow-none p-5">
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-neutral-300 dark:text-white/30">
                  Browse Categories
                </p>
                <nav className="flex flex-col gap-0.5">
                  <Link
                    href="/startup"
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-neutral-500 dark:text-white/50 transition hover:bg-neutral-100 dark:hover:bg-white/5 hover:text-neutral-900 dark:hover:text-white"
                  >
                    <Rocket className="size-4" />
                    All Pitches
                  </Link>
                  {categories.map((cat) => {
                    const isActive = cat.slug === slug;
                    const CatIcon = CATEGORY_ICONS[cat.slug ?? ""] ?? Rocket;
                    const activeAccent =
                      CATEGORY_ACCENTS[cat.slug ?? ""] ??
                      CATEGORY_ACCENTS.other;

                    return (
                      <Link
                        key={cat._id}
                        href={`/category/${cat.slug}`}
                        className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition ${
                          isActive
                            ? `${activeAccent} font-medium`
                            : "text-neutral-500 dark:text-white/50 hover:bg-neutral-100 dark:hover:bg-white/5 hover:text-neutral-900 dark:hover:text-white"
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <CatIcon className="size-4" />
                          {cat.title}
                        </span>
                        {cat.count > 0 && (
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs ${
                              isActive
                                ? "bg-neutral-100 dark:bg-white/10"
                                : "bg-neutral-100 dark:bg-white/5 text-neutral-300 dark:text-white/25"
                            }`}
                          >
                            {cat.count}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* CTA card */}
              <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-gradient-to-b from-neutral-100 dark:from-white/5 to-transparent p-5">
                <p className="text-sm font-semibold">Have an idea?</p>
                <p className="mt-1 text-xs leading-relaxed text-neutral-400 dark:text-white/40">
                  Submit your startup pitch and get discovered by the community.
                </p>
                <Link
                  href="/startup/create"
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-pink-500/20 px-4 py-2.5 text-sm font-medium text-pink-400 ring-1 ring-pink-500/30 transition hover:bg-pink-500/30"
                >
                  Submit a Pitch
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
