"use client";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Textarea } from "@workspace/ui/components/textarea";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  FileText,
  ImagePlus,
  Rocket,
  Send,
  Sparkles,
  Tag,
  Type,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";

import { createPitch } from "@/lib/actions";
import { PitchEditor } from "./pitch-editor";

/** Field wrapper with icon, label, hint, and error display. */
function FormField({
  icon: Icon,
  label,
  hint,
  error,
  children,
  htmlFor,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  htmlFor: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label
          htmlFor={htmlFor}
          className="flex items-center gap-2 text-sm font-semibold"
        >
          <Icon className="size-4 text-pink-500" />
          {label}
        </Label>
        {hint && (
          <span className="text-xs text-neutral-400 dark:text-white/30">
            {hint}
          </span>
        )}
      </div>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-500">
          <AlertCircle className="size-3" />
          {error}
        </p>
      )}
    </div>
  );
}

/** Step indicator pill. */
function StepIndicator({
  currentStep,
  totalSteps,
}: {
  currentStep: number;
  totalSteps: number;
}) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            i === currentStep
              ? "w-8 bg-gradient-to-r from-pink-500 to-purple-600"
              : i < currentStep
                ? "w-4 bg-pink-500/40"
                : "w-4 bg-neutral-200 dark:bg-white/10"
          }`}
        />
      ))}
    </div>
  );
}

interface Category {
  _id: string;
  title: string | null;
  slug: string | null;
}

/**
 * Multi-step form for submitting a new startup pitch.
 * Step 1: Basic info (title, description, category, image).
 * Step 2: Rich pitch editor (Novel/Tiptap).
 */
export function StartupForm({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [pitchHtml, setPitchHtml] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [charCounts, setCharCounts] = useState({ title: 0, description: 0 });
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) {
        setImagePreview(null);
        return;
      }
      if (file.size > 800 * 1024) {
        setError("Image must be under 800 KB");
        e.target.value = "";
        return;
      }
      setError(null);
      setImagePreview(URL.createObjectURL(file));
    },
    []
  );

  const clearImage = useCallback(() => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  /** Validate step 1 fields before proceeding. */
  function validateStep1(): boolean {
    if (!formRef.current) return false;
    const form = formRef.current;
    const title = (form.elements.namedItem("title") as HTMLInputElement)?.value;
    const desc = (form.elements.namedItem("description") as HTMLTextAreaElement)
      ?.value;
    const cat = (form.elements.namedItem("category") as HTMLSelectElement)
      ?.value;

    if (!title || title.length < 3) {
      setError("Title must be at least 3 characters");
      return false;
    }
    if (!desc || desc.length < 10) {
      setError("Description must be at least 10 characters");
      return false;
    }
    if (!cat) {
      setError("Please select a category");
      return false;
    }
    if (!imagePreview) {
      setError("Cover image is required");
      return false;
    }
    setError(null);
    return true;
  }

  function handleNext() {
    if (validateStep1()) {
      setStep(1);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (pitchHtml.length < 20) {
      setError("Your pitch needs more content — at least a few sentences.");
      return;
    }

    setIsPending(true);

    const formData = new FormData(e.currentTarget);
    formData.set("pitch", pitchHtml);

    const result = await createPitch(formData);

    setIsPending(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    router.push(`/startup/${result.id}`);
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      {/* Step indicator */}
      <div className="mb-8">
        <StepIndicator currentStep={step} totalSteps={2} />
        <p className="mt-3 text-center text-sm text-neutral-400 dark:text-white/40">
          {step === 0 ? "Step 1 — Basic Info" : "Step 2 — Write Your Pitch"}
        </p>
      </div>

      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
          <AlertCircle className="mt-0.5 size-5 shrink-0 text-red-500" />
          <div>
            <p className="text-sm font-medium text-red-500">
              Something went wrong
            </p>
            <p className="mt-1 text-sm text-red-400">{error}</p>
          </div>
        </div>
      )}

      {/* ── Step 1: Basic Info ── */}
      <div className={step === 0 ? "space-y-6" : "hidden"}>
        {/* Title & Category row */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <FormField
              icon={Type}
              label="Title"
              htmlFor="title"
              hint={`${charCounts.title}/80`}
            >
              <Input
                id="title"
                name="title"
                required
                maxLength={80}
                placeholder="e.g. NightOwl — AI Sleep Coaching"
                className="h-12 text-base"
                onChange={(e) =>
                  setCharCounts((prev) => ({
                    ...prev,
                    title: e.target.value.length,
                  }))
                }
              />
            </FormField>
          </div>

          <div>
            <FormField icon={Tag} label="Category" htmlFor="category">
              <select
                id="category"
                name="category"
                required
                defaultValue=""
                className="flex h-12 w-full appearance-none rounded-md border border-input bg-transparent bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23999%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_0.75rem_center] bg-no-repeat px-3 pr-10 text-base shadow-xs outline-none transition focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 dark:bg-input/30"
              >
                <option value="" disabled>
                  Select a category
                </option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.title}
                  </option>
                ))}
              </select>
            </FormField>
          </div>
        </div>

        {/* Description */}
        <FormField
          icon={Sparkles}
          label="Short Description"
          htmlFor="description"
          hint={`${charCounts.description}/200`}
        >
          <Textarea
            id="description"
            name="description"
            required
            maxLength={200}
            rows={3}
            placeholder="One or two sentences that explain what your startup does and why it matters."
            className="resize-none text-base"
            onChange={(e) =>
              setCharCounts((prev) => ({
                ...prev,
                description: e.target.value.length,
              }))
            }
          />
        </FormField>

        {/* Cover image upload */}
        <FormField icon={ImagePlus} label="Cover Image" htmlFor="image">
          {imagePreview ? (
            <div className="group relative overflow-hidden rounded-2xl border border-neutral-200/60 dark:border-white/10">
              <Image
                src={imagePreview}
                alt="Cover preview"
                width={800}
                height={400}
                className="aspect-video w-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition group-hover:opacity-100">
                <button
                  type="button"
                  onClick={clearImage}
                  className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/20"
                >
                  <X className="size-4" />
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <label
              htmlFor="image"
              className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-50 py-12 transition hover:border-pink-400 hover:bg-pink-50/50 dark:border-white/10 dark:bg-white/5 dark:hover:border-pink-500/30 dark:hover:bg-pink-500/5"
            >
              <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500/10 to-purple-500/10 dark:from-pink-500/20 dark:to-purple-500/20">
                <ImagePlus className="size-6 text-pink-500" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">Click to upload</p>
                <p className="mt-1 text-xs text-neutral-400 dark:text-white/30">
                  PNG, JPG, or WebP up to 800 KB
                </p>
              </div>
            </label>
          )}
          <input
            ref={fileInputRef}
            id="image"
            name="image"
            type="file"
            accept="image/*"
            required={!imagePreview}
            className="sr-only"
            onChange={handleImageChange}
          />
        </FormField>

        {/* Next button */}
        <Button
          type="button"
          size="lg"
          className="w-full text-base"
          onClick={handleNext}
        >
          Continue to Pitch
          <ArrowRight className="ml-2 size-5" />
        </Button>
      </div>

      {/* ── Step 2: Pitch Editor ── */}
      <div className={step === 1 ? "space-y-6" : "hidden"}>
        <FormField
          icon={FileText}
          label="Your Pitch"
          htmlFor="pitch"
          hint="Type / for commands"
        >
          <div className="overflow-hidden rounded-2xl border border-neutral-200/60 bg-gradient-to-b from-neutral-50 to-white shadow-sm dark:border-white/10 dark:from-neutral-900 dark:to-neutral-900 dark:shadow-none">
            <PitchEditor onChange={setPitchHtml} />
          </div>
        </FormField>

        {/* Action buttons */}
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="text-base"
            onClick={() => {
              setStep(0);
              setError(null);
            }}
          >
            <ArrowLeft className="mr-2 size-5" />
            Back
          </Button>
          <Button
            type="submit"
            size="lg"
            className="flex-1 text-base"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Rocket className="mr-2 size-5 animate-bounce" />
                Creating & Analyzing...
              </>
            ) : (
              <>
                <Send className="mr-2 size-5" />
                Submit Your Pitch
              </>
            )}
          </Button>
        </div>
        <p className="text-center text-xs text-neutral-400 dark:text-white/30">
          Your pitch will be published immediately and visible to everyone.
        </p>
      </div>
    </form>
  );
}
