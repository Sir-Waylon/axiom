const V='tr-8034da28-70d63c';
const PRE=["./", "icon.svg", "manifest.webmanifest", "hub.css", "reg.js", "geometry/", "geometry/app.b0df206e.js", "geometry/app.8034da28.css", "apex/", "apex/app.7cb6daa9.js", "apex/app.8034da28.css", "quanta/", "quanta/app.f883c1f1.js", "quanta/app.8034da28.css"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(PRE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin||new URL(r.url).pathname.startsWith('/api/'))return;
e.respondWith(caches.match(r).then(h=>{const n=fetch(r).then(x=>{if(x.ok){const y=x.clone();caches.open(V).then(c=>c.put(r,y))}return x}).catch(()=>h);return h||n}))});