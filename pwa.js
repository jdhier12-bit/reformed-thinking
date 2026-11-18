// Install hint, share button, service worker registration.
(()=>{const $=s=>document.querySelector(s);
const URL_SHARE='https://jdhier12-bit.github.io/reformed-thinking/';
const standalone=matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
const ua=navigator.userAgent;const isIOS=/iPad|iPhone|iPod/.test(ua)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
const toast=m=>{const t=$('#toast');t.textContent=m;t.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(()=>t.hidden=true,2200)};
// Share
$('#share').onclick=async()=>{const data={title:'Reformed Thinking',text:'Calvin & Luther side by side — ask any theological question:',url:URL_SHARE};
  try{if(navigator.share){await navigator.share(data);return}}catch(e){if(e&&e.name==='AbortError')return}
  try{await navigator.clipboard.writeText(URL_SHARE);toast('Link copied')}catch(_){prompt('Copy this link:',URL_SHARE)}};
// Install hint
const box=$('#install');let deferred=null;
const dismissed=()=>localStorage.getItem('rt_install_dismissed')==='1';
function showHint(html){if(standalone||dismissed())return;box.innerHTML=`<img src="icons/icon-192.png" alt="" width="40" height="40"><div class="itext">${html}</div><button class="ix" aria-label="Dismiss">×</button>`;box.hidden=false;
  box.querySelector('.ix').onclick=()=>{box.hidden=true;localStorage.setItem('rt_install_dismissed','1')};
  const ib=box.querySelector('[data-install]');if(ib)ib.onclick=async()=>{if(!deferred)return;deferred.prompt();const r=await deferred.userChoice;deferred=null;if(r.outcome==='accepted')box.hidden=true}}
const shareGlyph='<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px"><path d="M12 3v12"/><path d="M7 8l5-5 5 5"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/></svg>';
if(isIOS&&!standalone)showHint(`<b>Install Reformed Thinking</b><span>Tap ${shareGlyph} Share, then <b>Add to Home Screen</b>.</span>`);
addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferred=e;showHint(`<b>Install Reformed Thinking</b><span>Get it on your home screen — free, works offline.</span><button class="ibtn" data-install>Install app</button>`)});
addEventListener('appinstalled',()=>{box.hidden=true});
// Service worker (network-first for the app, so updates arrive on the next open)
if('serviceWorker' in navigator){addEventListener('load',()=>{navigator.serviceWorker.register('sw.js',{updateViaCache:'none'}).then(reg=>{reg.update().catch(()=>{});
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')reg.update().catch(()=>{})})}).catch(()=>{})});
  let had=!!navigator.serviceWorker.controller,reloaded=false;navigator.serviceWorker.addEventListener('controllerchange',()=>{if(had&&!reloaded){reloaded=true;location.reload()}had=true})}
})();
