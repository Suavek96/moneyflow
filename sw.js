// Only the application shell is cached. No financial data is sent or cached here.
const prefix = 'moneyflow-shell:' + self.registration.scope + ':';
const cacheName = prefix + '2.2.1';
const base = new URL(self.registration.scope);
const files = ['index.html','pwa.js','manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png'].map(p => new URL(p,base).href);
const entry = files[0];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(cacheName).then(cache => cache.addAll(files.map(url => new Request(url,{cache:'reload'})))));
});
self.addEventListener('activate', event => {
  event.waitUntil((async()=>{ for(const key of await caches.keys()) if(key.startsWith(prefix)&&key!==cacheName) await caches.delete(key); await self.clients.claim(); })());
});
self.addEventListener('fetch', event => {
  const req=event.request, url=new URL(req.url);
  if(req.method!=='GET'||url.origin!==base.origin) return;
  const navigation=req.mode==='navigate'&&(url.pathname===base.pathname||url.pathname===new URL(entry).pathname);
  if(!navigation && !files.includes(url.href)) return;
  event.respondWith((async()=>{const cache=await caches.open(cacheName);const hit=await cache.match(navigation?entry:req);return hit||fetch(req);})());
});
