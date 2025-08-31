import { ArrowUpRight } from "lucide-react";

interface PitchCardProps {
  title: string;
  category: string;
  date: string;
  description: string;
  author: string;
  avatarInitial: string;
  avatarColor: string;
  gradient: string;
  radial: string;
  className?: string;
}

function PitchCard({
  title,
  category,
  date,
  description,
  author,
  avatarInitial,
  avatarColor,
  gradient,
  radial,
  className = "w-80",
}: PitchCardProps) {
  return (
    <article
      className={`${className} select-none overflow-hidden rounded-2xl border border-neutral-200/60 dark:border-white/10 bg-gradient-to-b from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-900 shadow-2xl shadow-black/10 dark:shadow-black/50`}
    >
      <div className="relative aspect-video w-full overflow-hidden">
        <div className={`absolute inset-0 ${gradient}`} />
        <div className={`absolute inset-0 ${radial}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 dark:from-neutral-900 dark:via-neutral-900/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <p className="text-lg font-bold leading-tight tracking-tight text-neutral-900 dark:text-white">
            {title}
          </p>
        </div>
      </div>

      <div className="px-5 pt-3 pb-5">
        <div className="flex items-center gap-2 text-xs text-neutral-400 dark:text-white/40">
          <span className="font-medium text-pink-400">{category}</span>
          <span className="text-neutral-200 dark:text-white/15">/</span>
          <span>{date}</span>
        </div>

        <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-neutral-500 dark:text-white/50">
          {description}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={`flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-full ${avatarColor} ring-1 ring-neutral-200 dark:ring-white/10`}
            >
              <span className="text-xs font-medium text-neutral-500 dark:text-white/70">
                {avatarInitial}
              </span>
            </div>
            <span className="text-xs text-neutral-400 dark:text-white/40">
              {author}
            </span>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-neutral-300 dark:text-white/30">
            View
            <ArrowUpRight className="size-3.5" />
          </span>
        </div>
      </div>
    </article>
  );
}

export function DecorativePitchCardLeft() {
  return (
    <PitchCard
      title="CloudSync Pro"
      category="SaaS"
      date="Mar 12"
      description="Real-time infrastructure sync across multi-cloud environments with zero-config deployment pipelines."
      author="Alex Rivera"
      avatarInitial="A"
      avatarColor="bg-violet-500/20"
      gradient="bg-gradient-to-br from-violet-600 via-fuchsia-500 to-pink-400"
      radial="bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.15),transparent_60%)]"
    />
  );
}

export function DecorativePitchCardRight() {
  return (
    <PitchCard
      title="PayFlow"
      category="FinTech"
      date="Mar 10"
      description="Instant cross-border payments for freelancers with built-in invoicing and tax compliance."
      author="Sofia Chen"
      avatarInitial="S"
      avatarColor="bg-amber-500/20"
      gradient="bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500"
      radial="bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.2),transparent_50%)]"
      className="w-72"
    />
  );
}
