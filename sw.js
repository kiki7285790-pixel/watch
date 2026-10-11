// 애플워치 저축 — 홈 화면 앱이 인터넷 없이도 열리게 파일을 폰에 담아 둔다
//   화면(index.html)은 인터넷이 되면 늘 새로 받아(고친 게 바로 반영) 담아 두고, 안 되면 담아 둔 것으로 연다
//   글꼴 · 아이콘은 담아 둔 것을 먼저 쓴다. 판이 바뀌면 VER 를 올려 예전 것을 지운다
const VER = 'watch-1.0-1';
const FILES = ['./', './index.html', './manifest.webmanifest', './icon-180.png', './icon-192.png', './icon-512.png',
  './fonts/Paperlogy-4Regular.woff2', './fonts/Paperlogy-5Medium.woff2', './fonts/Paperlogy-6SemiBold.woff2',
  './fonts/Paperlogy-7Bold.woff2', './fonts/Paperlogy-8ExtraBold.woff2', './fonts/Paperlogy-9Black.woff2'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VER).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VER).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if(req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  const page = req.mode === 'navigate' || /\/(index\.html)?$/.test(new URL(req.url).pathname);
  if(page){
    e.respondWith(fetch(req).then(r => { const copy = r.clone(); caches.open(VER).then(c => c.put('./index.html', copy)); return r; })
      .catch(() => caches.match('./index.html')));
  } else {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => { const copy = r.clone(); caches.open(VER).then(c => c.put(req, copy)); return r; })));
  }
});
