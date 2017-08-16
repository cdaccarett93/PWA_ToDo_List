self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open('static-cache-v1')
            .then(function(cache) {
                return cache.addAll([
                    '.',
                    'index.html',
                    'css/main.css',
                    'css/reset.min.css',
                    'css/font-awesome.min.css'
                ]);
            })
    );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.open('static-cache-v1').then(function(cache) {
      return fetch(event.request).then(function(response) {
        cache.put(event.request, response.clone());
        return response;
      });
    })
  );
});