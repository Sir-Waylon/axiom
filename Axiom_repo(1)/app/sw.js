const V='tr-8f3c91e7-40e2d8';
const PRE=["./", "icon.svg", "manifest.webmanifest", "hub.css", "reg.js", "geometry/", "geometry/app.091fc2f0.js", "geometry/app.8f3c91e7.css", "apex/", "apex/app.dbf31e3c.js", "apex/app.8f3c91e7.css", "quanta/", "quanta/app.22bc820d.js", "quanta/app.8f3c91e7.css"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(PRE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin||new URL(r.url).pathname.startsWith('/api/'))return;
e.respondWith(caches.match(r).then(h=>{const n=fetch(r).then(x=>{if(x.ok){const y=x.clone();caches.open(V).then(c=>c.put(r,y))}return x}).catch(()=>h);return h||n}))});