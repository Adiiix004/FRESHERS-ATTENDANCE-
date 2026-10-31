// =====================================================
// KJIT CAMPUS ATTENDANCE SYSTEM
// SERVICE WORKER
// =====================================================

const CACHE_NAME = "kjit-attendance-v1";


// =====================================================
// FILES TO CACHE
// =====================================================

const APP_FILES = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./manifest.json",
    "./login.html",
    "./login.js",
    "./students.html",
    "./students.js",
    "./report.html",
    "./report.js"
];


// =====================================================
// INSTALL
// =====================================================

self.addEventListener("install", event => {

    console.log(
        "KJIT Attendance: Installing service worker..."
    );

    event.waitUntil(

        caches.open(CACHE_NAME)
            .then(cache => {

                return cache.addAll(
                    APP_FILES
                );

            })

            .then(() => {

                console.log(
                    "KJIT Attendance: App files cached."
                );

                return self.skipWaiting();

            })

    );

});


// =====================================================
// ACTIVATE
// =====================================================

self.addEventListener("activate", event => {

    console.log(
        "KJIT Attendance: Service worker activated."
    );

    event.waitUntil(

        caches.keys()
            .then(cacheNames => {

                return Promise.all(

                    cacheNames
                        .filter(
                            cacheName =>
                                cacheName !== CACHE_NAME
                        )
                        .map(
                            cacheName =>
                                caches.delete(
                                    cacheName
                                )
                        )

                );

            })

            .then(() => {

                return self.clients.claim();

            })

    );

});


// =====================================================
// FETCH
// =====================================================

self.addEventListener("fetch", event => {

    // Only handle GET requests.
    if (
        event.request.method !== "GET"
    ) {
        return;
    }


    event.respondWith(

        caches.match(
            event.request
        )

        .then(cachedResponse => {

            // If file exists in cache,
            // return the cached version.
            if (cachedResponse) {

                return cachedResponse;

            }


            // Otherwise try the internet.
            return fetch(
                event.request
            )

            .then(networkResponse => {

                // Save valid responses
                // in the cache.
                if (
                    networkResponse &&
                    networkResponse.status === 200 &&
                    networkResponse.type === "basic"
                ) {

                    const responseCopy =
                        networkResponse.clone();


                    caches.open(
                        CACHE_NAME
                    )
                    .then(cache => {

                        cache.put(
                            event.request,
                            responseCopy
                        );

                    });

                }


                return networkResponse;

            })

            .catch(() => {

                // If internet is unavailable,
                // open the dashboard.
                return caches.match(
                    "./index.html"
                );

            });

        })

    );

});
