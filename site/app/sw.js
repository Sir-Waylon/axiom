const V='tr-2e9fa19c-e04bcc';
const PRE=["./", "icon.svg", "manifest.webmanifest", "hub.css", "reg.js", "fonts/inter-400.woff", "fonts/inter-600.woff", "fonts/inter-700.woff", "fonts/interd-700.woff", "apex/", "apex/app.d3f381bc.js", "apex/app.2e9fa19c.css", "quanta/", "quanta/app.c4d60f83.js", "quanta/app.2e9fa19c.css"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(PRE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin||new URL(r.url).pathname.startsWith('/api/'))return;
e.respondWith(caches.match(r).then(h=>{const n=fetch(r).then(x=>{if(x.ok){const y=x.clone();caches.open(V).then(c=>c.put(r,y))}return x}).catch(()=>h);return h||n}))});