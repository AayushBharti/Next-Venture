import "server-only";

import { env } from "@workspace/env/server";
import { createClient } from "next-sanity";

import { client } from "./client";

/**
 * Server-only Sanity client with write permissions.
 * Used for mutations: creating startups, upserting authors on OAuth.
 */
export const writeClient = createClient({
  ...client.config(),
  useCdn: false,
  token: env.SANITY_API_WRITE_TOKEN,
});
