/* Conquest offline cache: the game and site work without a connection after the first visit.
   Pages: network first with a short timeout, then the cached copy (never a blank screen).
   Images, icons, fonts: cache first. Supabase, music and version checks are never cached. */
const V='conquest-v11';
const CORE=['/','/play','/favicon.svg','/manifest.webmanifest','/icons/icon-192.png','/icons/icon-512.png'];
/* Android refuses to show a page if the service worker hands it a "redirected" response, so store clean copies */
const clean=res=>res.redirected?res.blob().then(b=>new Response(b,{status:res.status,statusText:res.statusText,headers:res.headers})):Promise.resolve(res);
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>Promise.all(CORE.map(p=>fetch(p,{cache:'reload'}).then(clean).then(r=>r.ok&&c.put(p,r)).catch(()=>{}))))
  .then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
function page(r,u){const key=u.pathname.startsWith('/play')?'/play':(u.pathname==='/'?'/':u.pathname);
  const net=fetch(r).then(clean).then(res=>{if(res.ok){const cp=res.clone();caches.open(V).then(c=>c.put(key,cp));}return res;});
  const cached=()=>caches.match(key).then(m=>m||caches.match('/play'));
  /* online: fresh page; slow network (4 s) or offline: cached page, so the app always opens */
  return new Promise(ok=>{let done=false;const t=setTimeout(()=>cached().then(m=>{if(m&&!done){done=true;ok(m);}}),4000);
    net.then(res=>{if(!done){done=true;clearTimeout(t);ok(res);}}).catch(()=>cached().then(m=>{if(!done){done=true;clearTimeout(t);ok(m||Response.error());}}));});}
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
  if(u.hostname.endsWith('supabase.co'))return;
  if(/\.(mp3|mp4|webm)$/.test(u.pathname)||u.pathname==='/version.json'||u.pathname==='/sw.js')return;
  const font=u.hostname==='fonts.googleapis.com'||u.hostname==='fonts.gstatic.com';
  if(u.origin!==location.origin&&!font)return;
  if(r.mode==='navigate'){e.respondWith(page(r,u));return;}
  e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{if(res.ok||res.type==='opaque'){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp));}return res;})));});
