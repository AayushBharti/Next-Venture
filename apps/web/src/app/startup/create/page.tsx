import { sanityFetch } from "@workspace/sanity/live";
import { queryAllCategories } from "@workspace/sanity/query";
import { Lightbulb, Rocket, Users, Zap } from "lucide-react";
import type { Metadata } from "next";

import { AuthGate } from "@/components/auth/auth-gate";
import { StartupForm } from "@/components/startup/startup-form";
import { getSEOMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return getSEOMetadata({
    title: "Submit Your Startup Pitch",
    description:
      "Share your startup idea with the community. Submit your pitch and get discovered by investors and fellow founders.",
    slug: "/startup/create",
  });
}

const STEPS = [
  {
    icon: Lightbulb,
    title: "Describe Your Vision",
    description: "Give your startup a compelling title and short description.",
  },
  {
    icon: Zap,
    title: "Craft Your Pitch",
    description:
      "Use the markdown editor to explain the problem, solution, and traction.",
  },
  {
    icon: Users,
    title: "Get Discovered",
    description:
      "Your pitch goes live instantly for investors and founders to see.",
  },
];

/**
 * Create startup page — wraps the form in an AuthGate so
 * unauthenticated users are prompted to sign in.
 */
export default async function CreateStartupPage() {
  const { data: categories } = await sanityFetch({ query: queryAllCategories });

  return (
    <AuthGate>
      <div className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 left-1/2 size-96 -translate-x-1/2 rounded-full bg-pink-500/10 blur-3xl dark:bg-pink-500/5" />
          <div className="absolute right-0 top-1/3 size-72 rounded-full bg-purple-500/10 blur-3xl dark:bg-purple-500/5" />
        </div>

        {/* Hero header */}
        <section className="container relative mx-auto max-w-5xl px-4 pt-32 pb-12">
          <div className="flex items-center justify-center gap-2 text-sm font-medium text-pink-500">
            <Rocket className="size-4" />
            <span>Launch your idea</span>
          </div>
          <h1 className="mt-4 text-center text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            Submit Your{" "}
            <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Startup Pitch
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-center text-neutral-500 dark:text-white/50">
            Share your idea with the world. A great pitch is concise, clear, and
            shows why your startup matters.
          </p>

          {/* Steps */}
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {STEPS.map((step, index) => (
              <div
                key={step.title}
                className="group relative rounded-2xl border border-neutral-200/60 bg-gradient-to-b from-neutral-50 to-white p-6 shadow-sm transition hover:shadow-md dark:border-white/10 dark:from-neutral-900 dark:to-neutral-900 dark:shadow-none dark:hover:shadow-none"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500/10 to-purple-500/10 dark:from-pink-500/20 dark:to-purple-500/20">
                    <step.icon className="size-5 text-pink-500" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-neutral-300 dark:text-white/20">
                    Step {index + 1}
                  </span>
                </div>
                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="mt-1 text-sm text-neutral-500 dark:text-white/50">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Form section */}
        <section className="container relative mx-auto max-w-3xl px-4 pb-32">
          <StartupForm categories={categories ?? []} />
        </section>
      </div>
    </AuthGate>
  );
}
