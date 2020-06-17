import {precacheAndRoute} from 'workbox-precaching';
// import {registerRoute} from 'workbox-routing';
// import {CacheFirst, NetworkFirst, StaleWhileRevalidate} from 'workbox-strategies'
// import {ExpirationPlugin} from 'workbox-expiration';

precacheAndRoute(self.__WB_MANIFEST);
// registerRoute(
//     ({request}) => request.destination === 'image',
//     new CacheFirst({
//         cacheName: 'images',
//         plugins: [
//             new ExpirationPlugin({
//                 maxEntries: 60,
//                 maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
//             }),
//         ],
//     }),
// );
// registerRoute(
//     ({request}) => new URL(request.url).pathname === '/data/getentities/old',
//     () => {
//         const strategy = new StaleWhileRevalidate({
//             cacheName: 'entities',
//             plugins: [
//                 new ExpirationPlugin({
//                     maxEntries: 60,
//                     maxAgeSeconds: 7 * 24 * 60 * 60, // 7 Days
//                 }),
//             ],
//             matchOptions: {
//                 ignoreSearch: true,
//                 ignoreMethod: true,
//                 ignoreVary: true
//             }
//         })
//         strategy.handle(fetch('/data/getentities'));
//         return strategy;
//     }
// );
// registerRoute(
//     ({request}) => new URL(request.url).pathname === '/data/getentities/new',
//     () => {
//         const strategy = NetworkFirst({
//             cacheName: 'entities',
//             plugins: [
//                 new ExpirationPlugin({
//                     maxEntries: 60,
//                     maxAgeSeconds: 7 * 24 * 60 * 60, // 7 Days
//                 }),
//             ],
//             matchOptions: {
//                 ignoreSearch: true,
//                 ignoreMethod: true,
//                 ignoreVary: true
//             },
//             networkTimeoutSeconds: 90
//         })
//         strategy.handle(fetch('/data/getentities'));
//         return strategy
//     }
// );
