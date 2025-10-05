const CACHE_VERSION = 1;
const STATIC_CACHE = `venture-den-static-v${CACHE_VERSION}`;
const PAGES_CACHE = `venture-den-pages-v${CACHE_VERSION}`;
const EXPECTED_CACHES = [STATIC_CACHE, PAGES_CACHE];

const PRECACHE_URLS = ["/offline", "/icon-192.png"];

// --- Install: precache offline fallback ---
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting()),
  );
});

// --- Activate: clean old caches ---
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => !EXPECTED_CACHES.includes(key))
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

// --- Fetch: route to caching strategy ---
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") return;

  // Skip external origins (covers cdn.sanity.io, apicdn.sanity.io)
  if (url.origin !== self.location.origin) return;

  // Skip API routes (covers /api/auth/*, /api/startups/*, etc.)
  if (url.pathname.startsWith("/api/")) return;

  // Skip RSC flight payloads — caching these breaks client navigation
  if (request.headers.get("RSC")) return;

  // Static assets: cache-first
  if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // Navigation requests: network-first with offline fallback
  if (request.mode === "navigate") {
    event.respondWith(networkFirstWithOfflineFallback(request));
    return;
  }
});

// --- Strategies ---

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(cacheName);
    cache.put(request, response.clone());
  }
  return response;
}

async function networkFirstWithOfflineFallback(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(PAGES_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;

    const offlinePage = await caches.match("/offline");
    if (offlinePage) return offlinePage;

    return new Response("Offline", { status: 503, statusText: "Offline" });
  }
}

// --- Helpers ---

function isStaticAsset(url) {
  if (url.pathname.startsWith("/_next/static/")) return true;

  const staticExtensions = [
    ".js",
    ".css",
    ".woff2",
    ".woff",
    ".png",
    ".jpg",
    ".jpeg",
    ".svg",
    ".webp",
    ".avif",
    ".ico",
    ".mp4",
    ".gif",
  ];
  return staticExtensions.some((ext) => url.pathname.endsWith(ext));
}
