/*
  FANTASY 90 — this service worker used to cache the app shell (offline
  support), but that turned out not to be worth the trade-off: caching
  index.html meant that after every deploy, phones kept showing the old
  cached version until the SW's own file changed bytes and force-updated —
  a plain refresh (which works fine on every other static site) didn't help.

  This version deliberately does none of that. It removes every cache this
  app ever created and unregisters itself, so the browser goes back to
  always fetching index.html straight from the network like a normal page —
  a refresh (or GitHub Pages redeploying) just works from here on.
*/
self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
      .then(() => self.registration.unregister())
      .then(() => self.clients.matchAll({ type: "window" }))
      .then((clients) => clients.forEach((client) => client.navigate(client.url)))
  );
});
