"use client";

import { ChevronDown, Sparkles } from "lucide-react";
import { AnimatePresence, animate, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface AiAnalysis {
  overallScore: number;
  clarity: { score: number; feedback: string };
  marketPositioning: { score: number; feedback: string };
  uniqueness: { score: number; feedback: string };
  suggestions: string[];
  analyzedAt: string;
}

type Props = {
  analysis: AiAnalysis;
};

/**
 * Visual weight by score — pink accent stroke for strong scores,
 * neutrals that recede for weaker ones. Communicates quality
 * through intensity, not hue.
 */
function scoreWeight(score: number) {
  if (score >= 70) {
    return {
      text: "text-neutral-900 dark:text-white",
      stroke: "stroke-pink-500 dark:stroke-pink-400",
    };
  }
  if (score >= 40) {
    return {
      text: "text-neutral-500 dark:text-white/55",
      stroke: "stroke-neutral-300 dark:stroke-white/25",
    };
  }
  return {
    text: "text-neutral-300 dark:text-white/25",
    stroke: "stroke-neutral-200 dark:stroke-white/10",
  };
}

// ── Animation primitives ──

/** Tracks element dimensions via ResizeObserver using a callback ref. */
function useMeasure() {
  const [node, setNode] = useState<HTMLDivElement | null>(null);
  const [bounds, setBounds] = useState({ height: 0 });

  useEffect(() => {
    if (!node) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) setBounds({ height: entry.contentRect.height });
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [node]);

  return [setNode, bounds] as const;
}

/** Blur-in letter-by-letter text reveal. Fires onComplete after last letter. */
function BlurRevealText({
  text,
  delay = 0,
  maxStagger = 1.5,
  className,
  onComplete,
}: {
  text: string;
  delay?: number;
  maxStagger?: number;
  className?: string;
  onComplete?: () => void;
}) {
  const letters = text.split("");
  const [started, setStarted] = useState(false);
  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const delayPerChar = Math.min(0.01, maxStagger / letters.length);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  useEffect(() => {
    if (started && letters.length === 0 && !completedRef.current) {
      completedRef.current = true;
      onCompleteRef.current?.();
    }
  }, [started, letters.length]);

  if (!started) return null;

  return (
    <span className={className}>
      {letters.map((letter, i) => (
        <motion.span
          key={`${i}-${letter}`}
          initial={{ filter: "blur(4px)", opacity: 0, y: 5 }}
          animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
          style={{ willChange: "transform, filter" }}
          transition={{
            duration: 0.15,
            delay: delayPerChar * i,
          }}
          onAnimationComplete={
            i === letters.length - 1
              ? () => {
                  if (!completedRef.current) {
                    completedRef.current = true;
                    onCompleteRef.current?.();
                  }
                }
              : undefined
          }
        >
          {letter}
        </motion.span>
      ))}
    </span>
  );
}

/** Animates a number counting up from 0 to target. Calls onComplete when done. */
function CountUp({
  target,
  delay = 0,
  className,
  onComplete,
}: {
  target: number;
  delay?: number;
  className?: string;
  onComplete?: () => void;
}) {
  const [value, setValue] = useState(0);
  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    let controls: { stop: () => void } | undefined;
    const t = setTimeout(() => {
      controls = animate(0, target, {
        duration: 1.2,
        ease: "easeOut",
        onUpdate: (v) => setValue(Math.round(v)),
        onComplete: () => {
          if (!completedRef.current) {
            completedRef.current = true;
            onCompleteRef.current?.();
          }
        },
      });
    }, delay);
    return () => {
      clearTimeout(t);
      controls?.stop();
    };
  }, [target, delay]);

  return <span className={className}>{value}</span>;
}

// ── Score gauge ──

/** Circular SVG gauge with optional content overlaid at center. */
function ScoreGauge({
  score,
  size = 48,
  strokeWidth = 2.5,
  delay = 0.15,
  children,
}: {
  score: number;
  size?: number;
  strokeWidth?: number;
  delay?: number;
  children?: React.ReactNode;
}) {
  const weight = scoreWeight(score);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const filled = (score / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-neutral-100 dark:stroke-white/5"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className={weight.stroke}
          style={{ strokeDasharray: circumference }}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - filled }}
          transition={{ duration: 1, ease: "easeOut", delay }}
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}

// ── Composite components ──

/** Thin gradient divider between content sections. */
function SectionDivider() {
  return (
    <div className="h-px bg-gradient-to-r from-transparent via-neutral-200/60 to-transparent dark:via-white/5" />
  );
}

/**
 * Dimension metric row — ring gauge on the left with score centered inside,
 * label and blur-in feedback on the right. Editorial two-column layout.
 */
function DimensionRow({
  label,
  score,
  feedback,
  onComplete,
}: {
  label: string;
  score: number;
  feedback: string;
  onComplete?: () => void;
}) {
  const weight = scoreWeight(score);
  const [revealReady, setRevealReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setRevealReady(true), 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      className="flex gap-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Ring gauge with score centered inside */}
      <div className="shrink-0 pt-0.5">
        <ScoreGauge score={score} size={48} strokeWidth={2.5}>
          <CountUp
            target={score}
            delay={150}
            className={`text-sm font-bold tabular-nums ${weight.text}`}
          />
        </ScoreGauge>
      </div>

      {/* Label + blur-reveal feedback */}
      <div className="min-w-0 flex-1 pt-1">
        <span className="text-sm font-semibold text-neutral-700 dark:text-white/70">
          {label}
        </span>
        <p className="mt-1.5 text-sm leading-relaxed text-neutral-500 dark:text-white/45">
          {revealReady ? (
            <BlurRevealText
              text={feedback}
              maxStagger={1.5}
              onComplete={onComplete}
            />
          ) : null}
        </p>
      </div>
    </motion.div>
  );
}

/** Centered overall score — large ring gauge hero with radial glow. */
function OverallScoreSection({
  score,
  onComplete,
}: {
  score: number;
  onComplete?: () => void;
}) {
  return (
    <motion.div
      className="relative flex flex-col items-center py-3"
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Radial glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="size-32 rounded-full bg-pink-500/5 blur-2xl dark:bg-pink-500/10" />
      </div>

      <span className="relative mb-3 flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-pink-500/70 dark:text-pink-400/50">
        <Sparkles className="size-3" />
        Overall Score
      </span>

      <div className="relative">
        <ScoreGauge score={score} size={80} strokeWidth={4} delay={0.3}>
          <CountUp
            target={score}
            delay={400}
            onComplete={onComplete}
            className="text-2xl font-bold tabular-nums text-neutral-900 dark:text-white"
          />
        </ScoreGauge>
      </div>
    </motion.div>
  );
}

/** Single suggestion row with numbered badge and blur-in text. */
function SuggestionRow({
  index,
  text,
  onComplete,
}: {
  index: number;
  text: string;
  onComplete?: () => void;
}) {
  return (
    <motion.li
      className="flex gap-3 text-sm"
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-pink-500/10 text-xs font-bold text-pink-500 dark:bg-pink-500/15">
        {index + 1}
      </span>
      <span className="text-neutral-500 dark:text-white/45">
        <BlurRevealText
          text={text}
          delay={100}
          maxStagger={1.2}
          onComplete={onComplete}
        />
      </span>
    </motion.li>
  );
}

// ── Content orchestrator ──

/**
 * Sequential animation flow via step state machine.
 * Steps: 1-3 = dimension rows, 4 = overall score,
 *         5+ = suggestions, last = footer.
 */
function AnalysisContent({ analysis }: { analysis: AiAnalysis }) {
  const [step, setStep] = useState(0);

  const dimensions = [
    { label: "Clarity", ...analysis.clarity },
    { label: "Market Positioning", ...analysis.marketPositioning },
    { label: "Uniqueness", ...analysis.uniqueness },
  ];

  const suggestionsStart = 5;
  const footerStep = suggestionsStart + analysis.suggestions.length;

  const formattedDate = new Date(analysis.analyzedAt).toLocaleDateString(
    "en-US",
    { year: "numeric", month: "short", day: "numeric" }
  );

  useEffect(() => {
    const t = setTimeout(() => setStep(1), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative px-6 py-6">
      {/* Atmospheric background gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-pink-50/30 via-transparent to-violet-50/20 dark:from-pink-500/5 dark:via-transparent dark:to-violet-500/5" />

      <div className="relative">
        {/* Dimension rows with dividers between them */}
        <div>
          {dimensions.map((dim, i) => (
            <div key={dim.label}>
              {step >= i + 1 ? (
                <div className={i > 0 ? "pt-5" : ""}>
                  <DimensionRow
                    label={dim.label}
                    score={dim.score}
                    feedback={dim.feedback}
                    onComplete={() => setStep(i + 2)}
                  />
                </div>
              ) : null}
              {step >= i + 2 && i < dimensions.length - 1 && (
                <div className="mt-5">
                  <SectionDivider />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Overall score — hero moment after all dimension rows */}
        {step >= 4 && (
          <>
            <div className="my-5">
              <SectionDivider />
            </div>
            <OverallScoreSection
              score={analysis.overallScore}
              onComplete={() => setStep(5)}
            />
          </>
        )}

        {/* Suggestions — one at a time */}
        {step >= suggestionsStart && (
          <>
            <div className="my-5">
              <SectionDivider />
            </div>
            <div>
              <motion.p
                className="mb-3 text-xs font-medium uppercase tracking-widest text-neutral-400 dark:text-white/30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                Suggestions
              </motion.p>
              <ol className="space-y-3">
                {analysis.suggestions.map((suggestion, i) =>
                  step >= suggestionsStart + i ? (
                    <SuggestionRow
                      key={i}
                      index={i}
                      text={suggestion}
                      onComplete={() => setStep(suggestionsStart + i + 1)}
                    />
                  ) : null
                )}
              </ol>
            </div>
          </>
        )}

        {/* Footer */}
        {step >= footerStep && (
          <motion.p
            className="mt-6 text-center text-xs text-neutral-300 dark:text-white/15"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Analyzed by Gemini &middot; {formattedDate}
          </motion.p>
        )}
      </div>
    </div>
  );
}

// ── Main panel ──

/**
 * AI analysis panel with sequential blur-in reveal.
 * Shimmer-accented trigger, ring gauges with scores inside,
 * atmospheric gradient interior, large hero ring for overall.
 */
export function AiAnalysisPanel({ analysis }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [measureRef, bounds] = useMeasure();

  return (
    <div
      className={`group/panel overflow-hidden rounded-2xl border transition-all duration-500 ${
        isOpen
          ? "border-pink-200/50 shadow-lg shadow-pink-500/5 dark:border-pink-500/15 dark:shadow-pink-500/5"
          : "border-neutral-200/80 hover:border-pink-300/40 dark:border-white/10 dark:hover:border-pink-500/20"
      }`}
    >
      {/* Trigger */}
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls="ai-analysis-content"
        onClick={() => setIsOpen(!isOpen)}
        className={`relative flex w-full items-center justify-between overflow-hidden px-5 py-4 transition-all ${
          isOpen
            ? "bg-transparent"
            : "bg-gradient-to-r from-pink-50/50 via-white to-violet-50/40 hover:from-pink-50/70 hover:to-violet-50/60 dark:from-pink-500/5 dark:via-transparent dark:to-violet-500/5 dark:hover:from-pink-500/10 dark:hover:to-violet-500/10"
        }`}
      >
        {/* Animated shimmer line across top edge when closed */}
        {!isOpen && (
          <div className="absolute inset-x-0 top-0 h-px overflow-hidden">
            <motion.div
              className="h-full w-1/3 bg-gradient-to-r from-transparent via-pink-400/40 to-transparent"
              animate={{ x: ["-100%", "400%"] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </div>
        )}

        <div className="flex items-center gap-3">
          <motion.div
            className="flex size-7 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500/10 to-violet-500/10 dark:from-pink-500/15 dark:to-violet-500/15"
            animate={isOpen ? { rotate: 0 } : { rotate: [0, 12, -12, 0] }}
            transition={
              isOpen
                ? { duration: 0.2 }
                : {
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 4,
                    ease: "easeInOut",
                  }
            }
          >
            <Sparkles className="size-3.5 text-pink-500" />
          </motion.div>
          <span className="text-sm font-semibold text-neutral-900 dark:text-white">
            AI Pitch Analysis
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Mini score ring in trigger */}
          <ScoreGauge score={analysis.overallScore} size={32} strokeWidth={2}>
            <span className="text-xs font-bold tabular-nums text-neutral-700 dark:text-white/70">
              {analysis.overallScore}
            </span>
          </ScoreGauge>
          <ChevronDown
            className={`size-4 text-neutral-400 transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {/* Expanding content with height animation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="ai-analysis-content"
            className="overflow-hidden border-t border-neutral-100/80 dark:border-white/5"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: bounds.height, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { duration: 0.35, ease: "easeOut" },
              opacity: { duration: 0.2, ease: "easeOut" },
            }}
          >
            <div ref={measureRef}>
              <AnalysisContent analysis={analysis} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
