const V='tr-0c5748d3-626ddd';
const PRE=["./", "icon.svg", "manifest.webmanifest", "hub.css", "reg.js", "geometry/", "geometry/app.d4cf8e75.js", "geometry/app.0c5748d3.css", "apex/", "apex/app.4a308cc5.js", "apex/app.0c5748d3.css", "quanta/", "quanta/app.6a73e3a0.js", "quanta/app.0c5748d3.css"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(PRE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin||new URL(r.url).pathname.startsWith('/api/'))return;
e.respondWith(caches.match(r).then(h=>{const n=fetch(r).then(x=>{if(x.ok){const y=x.clone();caches.open(V).then(c=>c.put(r,y))}return x}).catch(()=>h);return h||n}))});