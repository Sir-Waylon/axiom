const V='tr-1eda043a-e07e2a';
const PRE=["./", "icon.svg", "manifest.webmanifest", "hub.css", "reg.js", "fonts/inter-400.woff", "fonts/inter-600.woff", "fonts/inter-700.woff", "fonts/interd-700.woff", "apex/", "apex/app.ef363d16.js", "apex/app.1eda043a.css", "apex/app.1eda043a.theme.css", "quanta/", "quanta/app.21373acf.js", "quanta/app.1eda043a.css", "quanta/app.1eda043a.theme.css"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(PRE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin||new URL(r.url).pathname.startsWith('/api/'))return;
if(r.mode==='navigate'){e.respondWith(fetch(r).then(x=>{if(x.ok){const y=x.clone();caches.open(V).then(c=>c.put(r,y))}return x}).catch(()=>caches.match(r)));return}
e.respondWith(caches.match(r).then(h=>{const n=fetch(r).then(x=>{if(x.ok){const y=x.clone();caches.open(V).then(c=>c.put(r,y))}return x}).catch(()=>h);return h||n}))});