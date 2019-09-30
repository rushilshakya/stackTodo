const staticCacheName = 'site-static-v6'
const dynamicCacheName = 'site-dynamic-v4'

const assets = [
  '/',
  '/about',
  '/contact',
  '/notfound',
  '/index.html',
  '/bundle.js',
  '/js/ui.js',
  '/js/materialize.min.js',
  '/css/styles.css',
  '/css/materialize.min.css',
  '/img/dish.png',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://fonts.gstatic.com/s/materialicons/v48/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2'
]

// cache size limit function
const limitCacheSize = (name, size) => {
  caches.open(name).then(cache => {
    cache.keys().then(keys => {
      if (keys.length > size) {
        cache.delete(keys[0]).then(limitCacheSize(name, size))
      }
    })
  })
}

// install event
self.addEventListener('install', evt => {
  //console.log('service worker installed');
  evt.waitUntil(
    caches.open(staticCacheName).then(cache => {
      cache.addAll(assets)
    })
  )
})

// activate event
self.addEventListener('activate', evt => {
  //console.log('service worker activated');
  evt.waitUntil(
    caches.keys().then(keys => {
      //console.log(keys);
      return Promise.all(
        keys
          .filter(key => key !== staticCacheName && key !== dynamicCacheName)
          .map(key => caches.delete(key))
      )
    })
  )
})

// fetch event
self.addEventListener('fetch', evt => {
  if (
    evt.request.url.indexOf('firestore.googleapis.com') === -1 &&
    evt.request.url.indexOf('chrome-extension') === -1
  ) {
    evt.respondWith(
      caches
        .match(evt.request)
        .then(cacheRes => {
          return (
            cacheRes ||
            fetch(evt.request).then(fetchRes => {
              return caches.open(dynamicCacheName).then(cache => {
                cache.put(evt.request.url, fetchRes.clone())
                // check cached items size
                limitCacheSize(dynamicCacheName, 15)
                return fetchRes
              })
            })
          )
        })
        .catch(() => {
          if (evt.request.url.indexOf('.png') < 0) {
            return caches.match('/notfound')
          }
        })
    )
  }
})
