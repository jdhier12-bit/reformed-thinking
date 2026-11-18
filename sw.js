// Reformed Thinking service worker. Bump VERSION on every deploy.
const VERSION='rt6';
const SHELL='rt-shell-'+VERSION, DATA='rt-data-d1' // bump only when data/ changes;
const SHELL_FILES=['./','index.html','style.css','app.js','rag.js','pwa.js','manifest.webmanifest','icons/icon.svg','icons/icon-192.png','icons/icon-512.png','apple-touch-icon.png'];
const DATA_FILES=['data/topics.json','data/src-calvin.json','data/src-boc.json','data/src-luther.json','data/kjv.json'];
self.addEventListener('install',e=>{e.waitUntil((async()=>{const c=await caches.open(SHELL);await c.addAll(SHELL_FILES.map(u=>new Request(u,{cache:'reload'})));
  // texts are fetched in the background; failures don't block install
  caches.open(DATA).then(d=>Promise.all(DATA_FILES.map(u=>d.match(u).then(m=>m||d.add(new Request(u,{cache:'reload'})).catch(()=>{})))));
  await self.skipWaiting()})())});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{for(const k of await caches.keys())if(k.startsWith('rt-')&&k!==SHELL&&k!==DATA)await caches.delete(k);await self.clients.claim()})())});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
  if(u.origin!==location.origin)return; // AI model, CDN etc.: handled by the browser/WebLLM's own cache
  if(u.pathname.includes('/data/')){ // big texts: cache-first (versioned)
    e.respondWith(caches.open(DATA).then(async c=>{const hit=await c.match(r,{ignoreSearch:true});if(hit)return hit;const res=await fetch(r);if(res.ok)c.put(r,res.clone());return res}));return}
  // app shell (HTML/JS/CSS/icons): network-first so updates always arrive; cache is the offline fallback
  e.respondWith((async()=>{const c=await caches.open(SHELL);try{const res=await fetch(r,{cache:'no-cache'});if(res.ok)c.put(r,res.clone());return res}
    catch(_){return (await c.match(r,{ignoreSearch:true}))||(r.mode==='navigate'?await c.match('index.html'):Response.error())}})())});
