"use server";

import { Logger } from "@workspace/logger";
import { client } from "@workspace/sanity/client";
import { writeClient } from "@workspace/sanity/write-client";
import { revalidatePath } from "next/cache";
import slugify from "slugify";
import TurndownService from "turndown";

import { auth } from "@/auth";
import { analyzePitch } from "@/lib/gemini";
import {
  commentSchema,
  pitchFormSchema,
  profileSchema,
} from "@/lib/validation";

const turndown = new TurndownService({ headingStyle: "atx" });
const logger = new Logger("actions");

type CreatePitchResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

/**
 * Server action to create a new startup pitch.
 * Expects FormData with: title, description, category, pitch, image (File).
 * Returns discriminated union: { ok: true; id } | { ok: false; error }.
 */
export async function createPitch(
  formData: FormData
): Promise<CreatePitchResult> {
  const session = await auth();
  const sessionId = (session as { id?: string })?.id;

  if (!sessionId) {
    return { ok: false, error: "You must be signed in to create a pitch" };
  }

  const pitchHtml = formData.get("pitch") as string;
  const markdown = turndown.turndown(pitchHtml || "");

  const rawData = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    category: formData.get("category") as string,
    pitch: markdown,
  };

  const parsed = pitchFormSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues.map((e) => e.message).join(", "),
    };
  }

  const imageFile = formData.get("image") as File | null;

  if (!imageFile || imageFile.size === 0) {
    return { ok: false, error: "Cover image is required" };
  }

  try {
    const imageAsset = await writeClient.assets.upload("image", imageFile, {
      filename: imageFile.name,
    });

    const doc = await writeClient.create({
      _type: "startup",
      title: parsed.data.title,
      slug: {
        _type: "slug",
        current: slugify(parsed.data.title, { lower: true, strict: true }),
      },
      author: { _type: "reference", _ref: sessionId },
      description: parsed.data.description,
      category: { _type: "reference", _ref: parsed.data.category },
      image: {
        _type: "image",
        asset: { _type: "reference", _ref: imageAsset._id },
      },
      pitch: parsed.data.pitch,
    });

    // AI analysis — fire and tolerate failure
    const analysis = await analyzePitch({
      title: parsed.data.title,
      description: parsed.data.description,
      category: parsed.data.category,
      pitch: parsed.data.pitch,
    });

    if (analysis) {
      try {
        await writeClient.patch(doc._id).set({ aiAnalysis: analysis }).commit();
      } catch (patchError) {
        logger.error("Failed to save AI analysis", { patchError, id: doc._id });
      }
    }

    return { ok: true, id: doc._id };
  } catch {
    return { ok: false, error: "Failed to submit pitch" };
  }
}

type CreateCommentResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

/**
 * Server action to create a comment on a startup pitch.
 * Requires authentication. Validates content length and startup existence.
 */
export async function createComment(
  startupId: string,
  content: string
): Promise<CreateCommentResult> {
  const session = await auth();
  const sessionId = (session as { id?: string })?.id;

  if (!sessionId) {
    return { ok: false, error: "You must be signed in to comment" };
  }

  const parsed = commentSchema.safeParse({ content, startupId });

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues.map((e) => e.message).join(", "),
    };
  }

  try {
    const startup = await client
      .withConfig({ useCdn: false })
      .fetch(`*[_type == "startup" && _id == $id][0]{ _id }`, {
        id: startupId,
      });

    if (!startup) {
      return { ok: false, error: "Startup not found" };
    }

    const doc = await writeClient.create({
      _type: "comment",
      author: { _type: "reference", _ref: sessionId },
      startup: { _type: "reference", _ref: startupId },
      content: parsed.data.content,
    });

    return { ok: true, id: doc._id };
  } catch {
    return { ok: false, error: "Failed to post comment" };
  }
}

type DeleteCommentResult = { ok: true } | { ok: false; error: string };

/**
 * Server action to delete a comment.
 * Only the comment author can delete their own comments.
 */
export async function deleteComment(
  commentId: string
): Promise<DeleteCommentResult> {
  const session = await auth();
  const sessionId = (session as { id?: string })?.id;

  if (!sessionId) {
    return { ok: false, error: "You must be signed in" };
  }

  try {
    const comment = await writeClient.fetch(
      `*[_type == "comment" && _id == $id][0]{ _id, "authorId": author._ref }`,
      { id: commentId }
    );

    if (!comment) {
      return { ok: false, error: "Comment not found" };
    }

    if (comment.authorId !== sessionId) {
      return { ok: false, error: "You can only delete your own comments" };
    }

    await writeClient.delete(commentId);
    return { ok: true };
  } catch {
    return { ok: false, error: "Failed to delete comment" };
  }
}

type UpdateProfileResult = { ok: true } | { ok: false; error: string };

/**
 * Server action to update the authenticated user's profile.
 * Only patches the logged-in user's own author document (no client-supplied ID).
 * Returns discriminated union: { ok: true } | { ok: false; error }.
 */
export async function updateProfile(
  formData: FormData
): Promise<UpdateProfileResult> {
  const session = await auth();
  const authorId = (session as { id?: string })?.id;

  if (!authorId) {
    return { ok: false, error: "You must be signed in to edit your profile" };
  }

  const rawData = {
    name: formData.get("name") as string,
    position: formData.get("position") as string,
    bio: formData.get("bio") as string,
  };

  const parsed = profileSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues.map((e) => e.message).join(", "),
    };
  }

  try {
    const fields: Record<string, unknown> = {
      name: parsed.data.name,
      position: parsed.data.position || "",
      bio: parsed.data.bio || "",
    };

    const imageFile = formData.get("image") as File | null;

    if (imageFile && imageFile.size > 0) {
      if (imageFile.size > 2 * 1024 * 1024) {
        return { ok: false, error: "Image must be under 2 MB" };
      }

      if (!imageFile.type.startsWith("image/")) {
        return { ok: false, error: "File must be an image" };
      }

      const imageAsset = await writeClient.assets.upload("image", imageFile, {
        filename: imageFile.name,
      });

      fields.image = {
        _type: "image",
        asset: { _type: "reference", _ref: imageAsset._id },
        alt: parsed.data.name,
      };
    }

    await writeClient.patch(authorId).set(fields).commit();
    revalidatePath(`/user/${authorId}`);

    return { ok: true };
  } catch {
    return { ok: false, error: "Failed to update profile" };
  }
}
