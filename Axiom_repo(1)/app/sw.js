const V='tr-5e73efb2-6492b2';
const PRE=["./", "icon.svg", "manifest.webmanifest", "hub.css", "reg.js", "geometry/", "geometry/app.aae837c0.js", "geometry/app.5e73efb2.css", "apex/", "apex/app.a5fdccbd.js", "apex/app.5e73efb2.css", "quanta/", "quanta/app.4fef8b17.js", "quanta/app.5e73efb2.css"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(PRE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin||new URL(r.url).pathname.startsWith('/api/'))return;
e.respondWith(caches.match(r).then(h=>{const n=fetch(r).then(x=>{if(x.ok){const y=x.clone();caches.open(V).then(c=>c.put(r,y))}return x}).catch(()=>h);return h||n}))});