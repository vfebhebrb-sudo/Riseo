/* =========================================================
   KONKUR PWA SERVICE WORKER
   PWA + WEB PUSH
========================================================= */

const CACHE_NAME = "konkur-app-v2";

const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./manifest.json",
    "./icon.png"
];


/* =========================================================
   INSTALL
========================================================= */

self.addEventListener("install", event => {

    console.log("📦 Konkur PWA: Installing...");

    event.waitUntil(

        caches.open(CACHE_NAME)
            .then(cache => {

                return cache.addAll(FILES_TO_CACHE);

            })

    );

    self.skipWaiting();

});


/* =========================================================
   ACTIVATE
========================================================= */

self.addEventListener("activate", event => {

    console.log("✅ Konkur PWA فعال شد");

    event.waitUntil(

        caches.keys()
            .then(cacheNames => {

                return Promise.all(

                    cacheNames
                        .filter(name => name !== CACHE_NAME)
                        .map(name => caches.delete(name))

                );

            })

    );

    self.clients.claim();

});


/* =========================================================
   FETCH
========================================================= */

self.addEventListener("fetch", event => {

    event.respondWith(

        caches.match(event.request)
            .then(response => {

                return response || fetch(event.request);

            })

    );

});


/* =========================================================
   WEB PUSH
========================================================= */

self.addEventListener("push", event => {

    console.log("🔔 Push Notification دریافت شد");


    let data = {

        title: "یادآوری برنامه",

        body: "یک برنامه جدید برایت داری.",

        icon: "./icon.png",

        badge: "./icon.png",

        tag: "konkur-planner",

        data: {
            url: "./"
        }

    };


    /* -----------------------------------------
       دریافت اطلاعات Push
    ----------------------------------------- */

    if (event.data) {

        try {

            const incomingData =
                event.data.json();

            data = {
                ...data,
                ...incomingData
            };

        }

        catch (error) {

            console.warn(
                "⚠️ Push JSON نبود، متن دریافت شد."
            );

            data.body =
                event.data.text();

        }

    }


    /* -----------------------------------------
       نمایش Notification
    ----------------------------------------- */

    const notificationOptions = {

        body: data.body,

        icon: data.icon,

        badge: data.badge,

        tag: data.tag,

        dir: "rtl",

        lang: "fa",

        requireInteraction: false,

        vibrate: [
            200,
            100,
            200
        ],

        data: data.data || {}

    };


    event.waitUntil(

        self.registration.showNotification(

            data.title,

            notificationOptions

        )

    );

});


/* =========================================================
   NOTIFICATION CLICK
========================================================= */

self.addEventListener(
    "notificationclick",
    event => {

        console.log(
            "👆 Notification clicked"
        );


        event.notification.close();


        const notificationData =
            event.notification.data || {};


        const targetUrl =
            notificationData.url || "./";


        event.waitUntil(

            clients.matchAll({

                type: "window",

                includeUncontrolled: true

            })

            .then(clientList => {

                /* -----------------------------------------
                   اگر سایت از قبل باز است
                ----------------------------------------- */

                for (const client of clientList) {

                    if (
                        "focus" in client &&
                        client.url.includes(
                            new URL(
                                targetUrl,
                                self.location.origin
                            ).pathname
                        )
                    ) {

                        return client.focus();

                    }

                }


                /* -----------------------------------------
                   اگر سایت باز نیست
                ----------------------------------------- */

                if (
                    clients.openWindow
                ) {

                    return clients.openWindow(
                        targetUrl
                    );

                }

            })

        );

    }
);


/* =========================================================
   NOTIFICATION CLOSE
========================================================= */

self.addEventListener(
    "notificationclose",
    event => {

        console.log(
            "🔕 Notification بسته شد"
        );

    }
);