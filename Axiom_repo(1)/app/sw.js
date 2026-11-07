const V='tr-c0f86e83-a46c68';
const PRE=["./", "icon.svg", "manifest.webmanifest", "hub.css", "reg.js", "geometry/", "geometry/app.1f58c292.js", "geometry/app.c0f86e83.css", "apex/", "apex/app.ce5a724c.js", "apex/app.c0f86e83.css", "quanta/", "quanta/app.6a90fe04.js", "quanta/app.c0f86e83.css"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(PRE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin||new URL(r.url).pathname.startsWith('/api/'))return;
e.respondWith(caches.match(r).then(h=>{const n=fetch(r).then(x=>{if(x.ok){const y=x.clone();caches.open(V).then(c=>c.put(r,y))}return x}).catch(()=>h);return h||n}))});