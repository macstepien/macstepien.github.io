const version = '20230307224413';
const cacheName = `static::${version}`;

const buildContentBlob = () => {
  return ["/robots/2022/10/20/roomac/","/software/2021/04/05/selfdriving-car-eng-nanodegree/","/software/2020/01/10/ekf-slam/","/robots/2019/09/24/human-following-robot/","/robots/2019/03/27/tank/","/robots/2018/06/08/hexapod/","/software/2017/05/26/move/","/electronics/2016/08/28/fuzz/","/electronics/2015/12/10/cewkatesli/","/robots/2015/08/25/mapping-robot/","/posts_pl/-02-10-stereovision/","/posts_pl/2013-05-31-gry-konsolowe/","/posts_pl/2013-09-23-Blu/","/posts_pl/2014-01-18-2dracing/","/posts_pl/2014-03-22-elektronicznakostka/","/posts_pl/2014-08-28-universal-robots/","/posts_pl/2014-08-28-universal-robots_en/","/posts_pl/2015-04-09-3dviewer/","/posts_pl/2015-04-09-3dviewer_en/","/posts_pl/2015-08-25-mapping-robot/","/posts_pl/2015-08-25-mapping-robot_en/","/posts_pl/2015-12-10-cewkatesli/","/posts_pl/2016-08-28-fuzz/","/posts_pl/2017-05-26-move/","/posts_pl/2018-06-08-hexapod/","/posts_pl/2018-06-08-hexapod_en/","/posts_pl/2019-03-27-tank/","/posts_pl/2019-03-27-tank_en/","/posts_pl/2019-09-24-human-following-robot/","/about/","/categories/","/home/","/","/manifest.json","/assets/search.json","/assets/styles.css","/redirects.json","/sitemap.xml","/robots.txt","/feed.xml","/pics/logo1.png", "/assets/default-offline-image.png", "/assets/scripts/fetch.js"
  ]
}

const updateStaticCache = () => {
  return caches.open(cacheName).then(cache => {
    return cache.addAll(buildContentBlob());
  });
};

const clearOldCache = () => {
  return caches.keys().then(keys => {
    // Remove caches whose name is no longer valid.
    return Promise.all(
      keys
        .filter(key => {
          return key !== cacheName;
        })
        .map(key => {
          console.log(`Service Worker: removing cache ${key}`);
          return caches.delete(key);
        })
    );
  });
};

self.addEventListener("install", event => {
  event.waitUntil(
    updateStaticCache().then(() => {
      console.log(`Service Worker: cache updated to version: ${cacheName}`);
    })
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(clearOldCache());
});

self.addEventListener("fetch", event => {
  let request = event.request;
  let url = new URL(request.url);

  // Only deal with requests from the same domain.
  if (url.origin !== location.origin) {
    return;
  }

  // Always fetch non-GET requests from the network.
  if (request.method !== "GET") {
    event.respondWith(fetch(request));
    return;
  }

  // Default url returned if page isn't cached
  let offlineAsset = "/offline/";

  if (request.url.match(/\.(jpe?g|png|gif|svg)$/)) {
    // If url requested is an image and isn't cached, return default offline image
    offlineAsset = "/assets/default-offline-image.png";
  }

  // For all urls request image from network, then fallback to cache, then fallback to offline page
  event.respondWith(
    fetch(request).catch(async () => {
      return (await caches.match(request)) || caches.match(offlineAsset);
    })
  );
  return;
});
