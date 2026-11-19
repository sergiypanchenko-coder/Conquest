/* Conquest offline cache: the game and site work without a connection after the first visit.
   Pages: network first (always fresh when online). Images, icons, fonts: cache first.
   Supabase (leaderboard) is never cached. */
const V='conquest-v8';
const CORE=['/','/play','/favicon.svg','/manifest.webmanifest','/icons/icon-192.png','/icons/icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
  if(u.hostname.endsWith('supabase.co'))return;
  if(u.pathname.endsWith('.mp3'))return;  // let the browser stream music with range requests
  const font=u.hostname==='fonts.googleapis.com'||u.hostname==='fonts.gstatic.com';
  if(u.origin!==location.origin&&!font)return;
  if(r.mode==='navigate'){e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(V).then(c=>c.put(r,cp));return res;}).catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||caches.match(u.pathname.startsWith('/play')?'/play':'/'))));return;}
  e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{if(res.ok||res.type==='opaque'){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp));}return res;})));});
