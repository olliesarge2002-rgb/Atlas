// Atlas V offline cache. Bump VERSION when you upload a new index.html.
const VERSION='atlas-v-1';
const CORE=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==VERSION).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const req=e.request;if(req.method!=='GET')return;
  // network first for the game page so updates arrive, cache fallback when offline
  if(req.mode==='navigate'){e.respondWith(fetch(req).then(r=>{const cp=r.clone();caches.open(VERSION).then(c=>c.put('./index.html',cp));return r}).catch(()=>caches.match('./index.html')));return}
  // cache first for icons and fonts
  e.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(r=>{if(r.ok||r.type==='opaque'){const cp=r.clone();caches.open(VERSION).then(c=>c.put(req,cp))}return r})))});
