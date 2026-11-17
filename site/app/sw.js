const V='tr-55318d4e-8d3c48';
const PRE=["./", "icon.svg", "manifest.webmanifest", "hub.css", "reg.js", "apex/", "apex/app.4255f354.js", "apex/app.55318d4e.css", "quanta/", "quanta/app.e5b7106c.js", "quanta/app.55318d4e.css"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(PRE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin||new URL(r.url).pathname.startsWith('/api/'))return;
e.respondWith(caches.match(r).then(h=>{const n=fetch(r).then(x=>{if(x.ok){const y=x.clone();caches.open(V).then(c=>c.put(r,y))}return x}).catch(()=>h);return h||n}))});