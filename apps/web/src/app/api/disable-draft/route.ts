import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const params = new URLSearchParams(request.nextUrl.searchParams);
  const redirectUrl = params.get("slug") || "/";

  (await draftMode()).disable();
  await new Promise((resolve) => setTimeout(resolve, 1000));
  redirect(redirectUrl);
}
