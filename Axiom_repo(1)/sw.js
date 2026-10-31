/* retires the old root service worker (the app now lives in /app/) */
self.addEventListener('install',function(){self.skipWaiting()});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.map(function(x){return caches.delete(x)}))}).then(function(){return self.registration.unregister()}).then(function(){return self.clients.matchAll()}).then(function(c){c.forEach(function(w){w.navigate(w.url)})}))});
