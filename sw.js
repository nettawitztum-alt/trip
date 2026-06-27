const CACHE='austria26-v14';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./icon-180.png'];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()).catch(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('message',e=>{if(e.data==='skipWaiting')self.skipWaiting();});
self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET')return;
  const url=new URL(req.url);
  // Always serve the app shell for navigations (offline-friendly)
  if(req.mode==='navigate'){
    e.respondWith(fetch(req).catch(()=>caches.match('./index.html')));
    return;
  }
  // Stale-while-revalidate for same-origin assets; cache-first fallback otherwise
  e.respondWith(caches.match(req).then(cached=>{
    const net=fetch(req).then(res=>{
      if(url.origin===location.origin && res && res.status===200){
        const copy=res.clone();caches.open(CACHE).then(c=>c.put(req,copy));
      }
      return res;
    }).catch(()=>cached);
    return cached||net;
  }));
});
