import { Logger } from "@workspace/logger";
import { client } from "@workspace/sanity/client";
import { queryStartupViews } from "@workspace/sanity/query";
import { writeClient } from "@workspace/sanity/write-client";
import { after } from "next/server";

const logger = new Logger("views-badge");

/**
 * Server component that increments view count on render.
 * Uses after() to atomically increment views without blocking render.
 * Renders nothing — the count is displayed in the floating stats bar.
 */
export async function ViewsBadge({ id }: { id: string }) {
  await client.withConfig({ useCdn: false }).fetch(queryStartupViews, { id });

  after(async () => {
    try {
      await writeClient.patch(id).inc({ views: 1 }).commit();
    } catch (error) {
      logger.error("Failed to increment views", { id, error });
    }
  });

  return null;
}
