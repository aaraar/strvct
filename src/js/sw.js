importScripts("https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js");
workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);

workbox.routing.registerRoute(
    ({request}) => request.destination === 'document',
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'documents',
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
            }),
        ],
    }),
);

workbox.routing.registerRoute(
    ({request}) => request.destination === 'image',
    new workbox.strategies.CacheFirst({
        cacheName: 'images',
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
            }),
        ],
    }),
);

workbox.routing.registerRoute(
    ({request}) => new URL(request.url).pathname === '/data/getentities/old',
    async ({url, event}) => {
            return caches.open('entities').then((cache) => {
                event.request.url = event.request.url.replace('old', 'new');
                return cache.match('/data/getentities/new').then((response) => {
                    return response || fetch(event.request).then(function (response) {
                        cache.put('/data/getentities/new', response.clone());
                        return response;
                    })
                })
            })
    }
)

workbox.routing.registerRoute(
    ({request}) => new URL(request.url).pathname === '/data/getentities/new',
    new workbox.strategies.NetworkFirst({
        cacheName: 'entities',
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxEntries: 60,
                maxAgeSeconds: 7 * 24 * 60 * 60, // 7 Days
            }),
        ],
        matchOptions: {
            ignoreSearch: true,
            ignoreMethod: true,
            ignoreVary: true
        },
        networkTimeoutSeconds: 90
    })
)
