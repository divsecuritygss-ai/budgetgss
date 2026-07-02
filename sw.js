const CACHE_NAME = "budget-gss-v4";
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/manifest.json",
  "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css",
  "https://cdn.jsdelivr.net/npm/chart.js"
];

// Tahap Install: Kunci semua aset UI dasar ke dalam storage perangkat
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Tahap Aktivasi: Bersihkan cache versi lama jika ada pembaruan UI
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Tahap Intersepsi: Melayani UI dasar secara instan meskipun tanpa internet
self.addEventListener("fetch", (e) => {
  // Hanya tangani aset statis, biarkan API ditangani oleh localStorage di Index.html
  if (e.request.url.includes("script.google.com")) {
    return;
  }
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request);
    })
  );
});
