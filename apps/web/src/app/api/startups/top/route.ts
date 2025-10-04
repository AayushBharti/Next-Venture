import { sanityFetch } from "@workspace/sanity/live";
import { queryTopStartups } from "@workspace/sanity/query";
import { type NextRequest, NextResponse } from "next/server";

/** Revalidate every 30 minutes — top pitches don't change frequently. */
export const revalidate = 1800;

export async function GET(request: NextRequest) {
  const count = Number(request.nextUrl.searchParams.get("count") ?? 6);
  const { data } = await sanityFetch({
    query: queryTopStartups,
    params: { count },
  });
  return NextResponse.json(data ?? []);
}
