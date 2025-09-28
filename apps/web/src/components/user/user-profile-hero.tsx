"use client";

import { Button } from "@workspace/ui/components/button";
import {
  Camera,
  Check,
  ExternalLink,
  Github,
  Loader2,
  Pencil,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";

import { updateProfile } from "@/lib/actions";

interface AuthorData {
  name: string | null;
  position: string | null;
  bio: string | null;
  imageUrl: string | null;
  username: string | null;
}

interface UserProfileHeroProps {
  author: AuthorData;
  isOwner: boolean;
}

/**
 * Profile hero section with inline editing.
 * In edit mode, each field becomes an input in place — same layout, no page jump.
 */
export function UserProfileHero({ author, isOwner }: UserProfileHeroProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be under 2 MB");
      e.target.value = "";
      return;
    }
    if (!file.type.startsWith("image/")) {
      setError("File must be an image");
      e.target.value = "";
      return;
    }
    setError(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(URL.createObjectURL(file));
  }

  function handleCancel() {
    setIsEditing(false);
    setError(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await updateProfile(formData);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setIsEditing(false);
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
      router.refresh();
    });
  }

  const avatarSrc =
    imagePreview ??
    author.imageUrl ??
    (author.username
      ? `https://avatars.githubusercontent.com/${author.username}`
      : null);

  const content = (
    <div className="container relative px-6 pt-32 pb-10 md:px-10 md:pt-36 md:pb-14">
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
        {/* Avatar */}
        <div className="relative">
          <div className="size-28 shrink-0 overflow-hidden rounded-2xl ring-4 ring-white shadow-xl dark:ring-neutral-900 md:size-32">
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt={author.name ?? "Avatar"}
                className="size-full object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center bg-gradient-to-br from-pink-500 to-purple-600 text-4xl font-bold text-white">
                {author.name?.charAt(0)}
              </div>
            )}
          </div>

          {isEditing && (
            <>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -right-1 -bottom-1 flex size-8 items-center justify-center rounded-full bg-pink-500 text-white shadow-lg ring-2 ring-white transition hover:bg-pink-600 dark:ring-neutral-900"
              >
                <Camera className="size-4" />
              </button>
              <input
                ref={fileInputRef}
                name="image"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleImageChange}
              />
            </>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 text-center sm:text-left">
          {isEditing ? (
            <input
              name="name"
              defaultValue={author.name ?? ""}
              required
              maxLength={100}
              className="w-full border-0 border-b-2 border-pink-400/50 bg-transparent text-3xl font-extrabold tracking-tight text-neutral-900 outline-none transition focus:border-pink-500 dark:text-white md:text-4xl"
              placeholder="Your name"
            />
          ) : (
            <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white md:text-4xl">
              {author.name}
            </h1>
          )}

          <div className="mt-1.5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 sm:justify-start">
            {author.username && (
              <span className="text-sm text-neutral-500 dark:text-white/40">
                @{author.username}
              </span>
            )}
            {isEditing ? (
              <>
                <span className="hidden text-neutral-300 dark:text-white/15 sm:inline">
                  &middot;
                </span>
                <input
                  name="position"
                  defaultValue={author.position ?? ""}
                  maxLength={100}
                  className="border-0 border-b border-neutral-300/50 bg-transparent text-sm font-medium text-neutral-600 outline-none transition focus:border-pink-500 dark:border-white/10 dark:text-white/50"
                  placeholder="Your position"
                />
              </>
            ) : (
              author.position && (
                <>
                  <span className="hidden text-neutral-300 dark:text-white/15 sm:inline">
                    &middot;
                  </span>
                  <span className="text-sm font-medium text-neutral-600 dark:text-white/50">
                    {author.position}
                  </span>
                </>
              )
            )}
          </div>

          {isEditing ? (
            <textarea
              name="bio"
              defaultValue={author.bio ?? ""}
              maxLength={500}
              rows={2}
              className="mt-3 w-full max-w-xl resize-none border-0 border-b border-neutral-300/50 bg-transparent text-base leading-relaxed text-neutral-500 outline-none transition focus:border-pink-500 dark:border-white/10 dark:text-white/50"
              placeholder="Tell us about yourself..."
            />
          ) : (
            author.bio && (
              <p className="mt-3 max-w-xl text-base leading-relaxed text-neutral-500 dark:text-white/50">
                {author.bio}
              </p>
            )
          )}

          {/* Action links / edit buttons */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            {isEditing ? (
              <>
                {error && (
                  <p className="mr-auto w-full text-xs text-red-500">{error}</p>
                )}
                <Button
                  type="submit"
                  size="sm"
                  disabled={isPending}
                  className="gap-1.5"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="size-3.5" />
                      Save
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  disabled={isPending}
                  className="gap-1.5"
                >
                  <X className="size-3.5" />
                  Cancel
                </Button>
              </>
            ) : (
              <>
                {author.username && (
                  <a
                    href={`https://github.com/${author.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-900 px-3.5 py-1.5 text-xs font-medium text-white transition hover:bg-neutral-800 dark:bg-white/10 dark:hover:bg-white/15"
                  >
                    <Github className="size-3.5" />
                    GitHub
                    <ExternalLink className="size-3" />
                  </a>
                )}
                {isOwner && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 px-3.5 py-1.5 text-xs font-medium transition hover:bg-neutral-100 dark:border-white/10 dark:hover:bg-white/5"
                  >
                    <Pencil className="size-3.5" />
                    Edit Profile
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const wrapper = (
    <div className="relative overflow-hidden bg-gradient-to-br from-pink-500/10 via-purple-500/5 to-transparent dark:from-pink-500/5 dark:via-purple-500/[0.02]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(236,72,153,0.08),transparent_70%)] dark:bg-[radial-gradient(ellipse_at_top_right,rgba(236,72,153,0.04),transparent_70%)]" />
      {content}
    </div>
  );

  if (isEditing) {
    return (
      <form ref={formRef} onSubmit={handleSubmit}>
        {wrapper}
      </form>
    );
  }

  return wrapper;
}
