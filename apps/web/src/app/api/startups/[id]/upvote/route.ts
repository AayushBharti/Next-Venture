import { Logger } from "@workspace/logger";
import { writeClient } from "@workspace/sanity/write-client";
import { NextResponse } from "next/server";

const logger = new Logger("upvote-api");

type Params = { params: Promise<{ id: string }> };

/**
 * POST /api/startups/[id]/upvote
 * Increments the upvote count by 1. No auth required, one-way only.
 */
export async function POST(_request: Request, { params }: Params) {
  const { id } = await params;

  try {
    const result = await writeClient.patch(id).inc({ upvotes: 1 }).commit();
    return NextResponse.json({ count: result.upvotes ?? 0 });
  } catch (error) {
    logger.error("Failed to update upvotes", { id, error });
    return NextResponse.json(
      { error: "Failed to update upvotes" },
      { status: 500 }
    );
  }
}
