import { cn } from "@workspace/ui/lib/utils";
import Image from "next/image";

import avatar1 from "@/../public/images/avatar-ashwin-santiago.jpg";
import avatar3 from "@/../public/images/avatar-florence-shaw.jpg";
import avatar2 from "@/../public/images/avatar-lula-meyers.jpg";
import avatar4 from "@/../public/images/avatar-owen-garcia.jpg";
import { Tag } from "@/components/shared/tag";
import type { PagebuilderType } from "@/types";
import { RichText } from "../elements/rich-text";

type FeatureCardsWithIconProps = PagebuilderType<"featureCardsIcon">;

type CardType = NonNullable<FeatureCardsWithIconProps["cards"]>[number];

const GRID_CLASSES = [
  "md:col-span-2 lg:col-span-1",
  "md:col-span-2 lg:col-span-1",
  "md:col-span-2 md:col-start-2 lg:col-span-1 lg:col-start-auto",
];

// ─── Animation Variants ───

function AvatarsAnimation() {
  const avatars = [
    { src: avatar1, alt: "Avatar 1", border: "", z: "z-40", ml: "" },
    {
      src: avatar2,
      alt: "Avatar 2",
      border: "border-indigo-500",
      z: "z-30",
      ml: "-ml-6",
    },
    {
      src: avatar3,
      alt: "Avatar 3",
      border: "border-amber-500",
      z: "z-20",
      ml: "-ml-6",
    },
  ];

  return (
    <div className="flex items-center justify-center">
      {avatars.map(({ src, alt, border, z, ml }) => (
        <div
          key={alt}
          className={cn(
            "size-20 overflow-hidden rounded-full border-4 border-blue-500 bg-white dark:bg-neutral-900 p-1",
            border,
            z,
            ml
          )}
        >
          <div className="relative size-full overflow-hidden rounded-full">
            <Image src={src} alt={alt} fill className="object-cover" />
          </div>
        </div>
      ))}
      <div className="-ml-6 size-20 overflow-hidden rounded-full border-4 border-transparent bg-white dark:bg-neutral-900 p-1 transition group-hover:border-green-500">
        <div className="relative size-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
          <Image
            src={avatar4}
            alt="Avatar 4"
            fill
            className="object-cover opacity-0 transition-all duration-500 group-hover:opacity-100"
          />
          <div className="flex size-full items-center justify-center gap-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <span
                className="inline-flex size-1.5 rounded-full bg-neutral-900 dark:bg-white"
                key={i}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TextHighlightAnimation() {
  return (
    <p className="text-center text-4xl font-extrabold text-neutral-200 dark:text-white/20 transition duration-500 group-hover:text-neutral-200 dark:group-hover:text-white/10">
      We&apos;ve achieved{" "}
      <span className="relative bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
        <span>incredible</span>
        <video
          src="/gif-incredible.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 rounded-2xl opacity-0 shadow-xl transition duration-500 group-hover:opacity-100"
        />
      </span>{" "}
      <br />
      milestones this year.
    </p>
  );
}

function KeyboardKeysAnimation() {
  const keys = [
    { label: "Shift", wide: true, delay: "" },
    { label: "alt", wide: false, delay: "delay-150" },
    { label: "C", wide: false, delay: "delay-300" },
  ];

  return (
    <div className="flex items-center justify-center gap-4">
      {keys.map(({ label, wide, delay }) => (
        <div
          key={label}
          className={cn(
            "inline-flex size-14 items-center justify-center rounded-2xl bg-neutral-300 text-xl font-medium text-neutral-950",
            "outline outline-2 outline-offset-4 outline-transparent transition-all duration-500 group-hover:translate-y-1 group-hover:outline-pink-400",
            wide && "w-28",
            delay
          )}
        >
          {label}
        </div>
      ))}
    </div>
  );
}

function CardAnimation({ variant }: { variant?: string | null }) {
  switch (variant) {
    case "avatars":
      return <AvatarsAnimation />;
    case "text-highlight":
      return <TextHighlightAnimation />;
    case "keyboard-keys":
      return <KeyboardKeysAnimation />;
    default:
      return null;
  }
}

// ─── Feature Card ───

function FeatureCard({
  card,
  className,
}: {
  card: CardType;
  className?: string;
}) {
  const { title, richText, animationVariant } = card ?? {};

  return (
    <div
      className={cn(
        "group rounded-3xl border border-neutral-200/60 dark:border-white/10 bg-gradient-to-b from-neutral-50 to-white shadow-sm dark:from-neutral-900 dark:to-neutral-900 dark:shadow-none p-6 transition duration-500 hover:scale-105 hover:shadow-md dark:hover:shadow-none",
        className
      )}
    >
      <div className="flex aspect-video items-center justify-center">
        <CardAnimation variant={animationVariant} />
      </div>
      <div>
        <h3 className="mt-6 text-3xl font-medium">{title}</h3>
        <RichText
          className="mt-2 text-neutral-500 dark:text-white/50"
          richText={richText}
        />
      </div>
    </div>
  );
}

// ─── Section ───

export function FeatureCardsWithIcon({
  eyebrow,
  title,
  cards,
  features,
}: FeatureCardsWithIconProps) {
  return (
    <section id="features" className="container py-24">
      <div className="flex justify-center">
        <Tag>{eyebrow}</Tag>
      </div>

      <h2 className="mx-auto mt-6 max-w-2xl text-center text-6xl font-medium">
        {title}
      </h2>

      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-3">
        {cards?.map((card, index) => (
          <FeatureCard
            key={card?._key ?? index}
            card={card}
            className={GRID_CLASSES[index % GRID_CLASSES.length]}
          />
        ))}
      </div>

      {features && features.length > 0 && (
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {features.map((feature) => (
            <div
              key={feature}
              className="group inline-flex items-center gap-3 rounded-2xl border border-neutral-200/60 dark:border-white/10 bg-neutral-50 shadow-sm dark:bg-neutral-900 dark:shadow-none px-3 py-1.5 transition duration-500 hover:scale-105 hover:shadow-md dark:hover:shadow-none md:px-5 md:py-2"
            >
              <span className="inline-flex size-5 items-center justify-center rounded-full bg-pink-400 text-xl text-neutral-950 transition duration-500 group-hover:rotate-45">
                &#10038;
              </span>
              <span className="font-medium md:text-lg">{feature}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
