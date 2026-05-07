"use client";

import { ChevronDown, Sparkles } from "lucide-react";
import { AnimatePresence, animate, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { GlowBorder } from "../shared/glow-border";

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
 * neutrals that recede for weaker ones.
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

/** Tracks element dimensions via ResizeObserver. */
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

/** Blur-in letter-by-letter text reveal. */
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
          transition={{ duration: 0.15, delay: delayPerChar * i }}
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

/** Animates a number counting up from 0 to target. */
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

function SectionDivider() {
  return (
    <div className="mx-1 h-px bg-gradient-to-r from-transparent via-neutral-200/50 to-transparent dark:via-white/[0.04]" />
  );
}

/**
 * Dimension metric row — ring gauge left, label + feedback right.
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
      className="flex gap-4 px-5 py-4"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="shrink-0 pt-0.5">
        <ScoreGauge score={score} size={44} strokeWidth={2.5}>
          <CountUp
            target={score}
            delay={150}
            className={`text-[13px] font-bold tabular-nums ${weight.text}`}
          />
        </ScoreGauge>
      </div>
      <div className="min-w-0 flex-1 pt-0.5">
        <span className="text-[13px] font-semibold text-neutral-800 dark:text-white/80">
          {label}
        </span>
        <p className="mt-1 text-[13px] leading-relaxed text-neutral-500 dark:text-white/40">
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

/** Overall score — hero ring gauge with subtle radial glow. */
function OverallScoreSection({
  score,
  onComplete,
}: {
  score: number;
  onComplete?: () => void;
}) {
  return (
    <motion.div
      className="relative flex flex-col items-center px-5 py-5"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="size-28 rounded-full bg-pink-500/[0.04] blur-2xl dark:bg-pink-500/[0.08]" />
      </div>

      <span className="relative mb-3 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-widest text-pink-500/60 dark:text-pink-400/40">
        <Sparkles className="size-3" />
        Overall Score
      </span>

      <div className="relative">
        <ScoreGauge score={score} size={72} strokeWidth={3.5} delay={0.3}>
          <CountUp
            target={score}
            delay={400}
            onComplete={onComplete}
            className="text-xl font-bold tabular-nums text-neutral-900 dark:text-white"
          />
        </ScoreGauge>
      </div>
    </motion.div>
  );
}

/** Single suggestion row with numbered badge. */
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
      className="flex gap-3 text-[13px]"
      initial={{ opacity: 0, x: -4 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="mt-[3px] flex size-[18px] shrink-0 items-center justify-center rounded-full bg-pink-500/10 text-[10px] font-bold text-pink-500 dark:bg-pink-500/15">
        {index + 1}
      </span>
      <span className="text-neutral-500 dark:text-white/40">
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
    { year: "numeric", month: "short", day: "numeric" },
  );

  useEffect(() => {
    const t = setTimeout(() => setStep(1), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative py-1">
      {/* Atmospheric background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-pink-50/20 via-transparent to-violet-50/10 dark:from-pink-500/[0.03] dark:via-transparent dark:to-violet-500/[0.03]" />

      <div className="relative">
        {/* Dimension rows */}
        {dimensions.map((dim, i) => (
          <div key={dim.label}>
            {step >= i + 1 ? (
              <DimensionRow
                label={dim.label}
                score={dim.score}
                feedback={dim.feedback}
                onComplete={() => setStep(i + 2)}
              />
            ) : null}
            {step >= i + 2 && i < dimensions.length - 1 && <SectionDivider />}
          </div>
        ))}

        {/* Overall score */}
        {step >= 4 && (
          <>
            <SectionDivider />
            <OverallScoreSection
              score={analysis.overallScore}
              onComplete={() => setStep(5)}
            />
          </>
        )}

        {/* Suggestions */}
        {step >= suggestionsStart && (
          <>
            <SectionDivider />
            <div className="px-5 py-4">
              <motion.p
                className="mb-3 text-[11px] font-medium uppercase tracking-widest text-neutral-400 dark:text-white/25"
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
                  ) : null,
                )}
              </ol>
            </div>
          </>
        )}

        {/* Footer */}
        {step >= footerStep && (
          <motion.p
            className="border-t border-neutral-100/50 px-5 py-3 text-center text-[11px] text-neutral-300 dark:border-white/[0.03] dark:text-white/15"
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

export function AiAnalysisPanel({ analysis }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [measureRef, bounds] = useMeasure();

  return (
    <GlowBorder radius={16} borderWidth={1.5} speed={4} active={!isOpen}>
      <div className="overflow-hidden rounded-[14.5px]">
        {/* Trigger */}
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls="ai-analysis-content"
          onClick={() => setIsOpen(!isOpen)}
          className="relative flex w-full items-center justify-between px-4 py-3.5 transition-colors hover:bg-neutral-50/50 dark:hover:bg-white/[0.02]"
        >
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-[10px] bg-gradient-to-br from-pink-500/10 to-violet-500/10 dark:from-pink-500/15 dark:to-violet-500/15">
              <Sparkles className="size-3.5 text-pink-500" />
            </div>
            <div className="text-left">
              <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                AI Pitch Analysis
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <ScoreGauge score={analysis.overallScore} size={30} strokeWidth={2}>
              <span className="text-[10px] font-bold tabular-nums text-neutral-700 dark:text-white/70">
                {analysis.overallScore}
              </span>
            </ScoreGauge>
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <ChevronDown className="size-4 text-neutral-400 dark:text-white/30" />
            </motion.div>
          </div>
        </button>

        {/* Expanding content */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              id="ai-analysis-content"
              className="overflow-hidden border-t border-neutral-100/60 dark:border-white/[0.04]"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: bounds.height, opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                height: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
                opacity: { duration: 0.2 },
              }}
            >
              <div ref={measureRef}>
                <AnalysisContent analysis={analysis} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </GlowBorder>
  );
}
