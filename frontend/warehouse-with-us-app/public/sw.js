const cacheName = 'warehouse-with-us';
const staticAssets = [
  '.',
  './index.html',
  './app.js',
  './styles.css',
  './favicon.ico',
  './css/bootstrap.min.css',
  './static/js/bundle.js',
  './static/js/0.chunk.js',
  './static/js/1.chunk.js',
  './static/js/main.chunk.js',
  './manifest.json',
  './logo192.png'
];

async function cacheFirst(req) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(req);
  return cachedResponse || networkFirst(req);
  // return cachedResponse || fetch(req); 
  // return cachedResponse;
}

async function networkFirst(req) {
  const cache = await caches.open(cacheName);
  try { 
    const fresh = await fetch(req);
    if(req.method == 'GET')
      // cache.put(req, fresh.clone());
      console.log("");
    if(!fresh.ok)
      throw new Error("Error in sw")
    return fresh;
  } catch (e) { 
    const cachedResponse = await cache.match(req);
    console.log(e);
    return cachedResponse;
  }
}

self.addEventListener('install', async event => {
  // const cache = await caches.open(cacheName); 
  // await cache.addAll(staticAssets); 
  // console.log("install event");
  caches.open(cacheName).then(function (cache) {
    return Promise.all(
      staticAssets.map(function (url) {
            return cache.add(url).catch(function (reason) {
                return console.log([url + "failed: " + String(reason)]);
            });
        })
    );
  });
});
  
self.addEventListener('fetch', event => {
  const req = event.request;
  // if (/.*(json)$/.test(req.url)) {
    // event.respondWith(networkFirst(req));
  // } else {
    event.respondWith(cacheFirst(req));
  // }
});