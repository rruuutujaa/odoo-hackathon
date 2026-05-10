const CACHE_NAME = "traveloop-cache-v1";
const OFFLINE_URL = "/offline";

const STATIC_ASSETS = [
  "/",
  "/dashboard",
  "/trips",
  "/globals.css",
  "/manifest.json"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(OFFLINE_URL) || caches.match("/");
      })
    );
  }
});
