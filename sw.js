/* 오프라인 사용용 캐시. 파일을 고쳐서 다시 올릴 때는 아래 버전 이름을 바꿔야 새 파일이 적용돼요. */
const C='report-maker-v1';
const A=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','libs/html2canvas.min.js','libs/jszip.min.js','fonts/KoPubDotum-Medium.woff','fonts/KoPubDotum-Bold.woff','fonts/KoPubBatang-Medium.woff','fonts/KoPubBatang-Bold.woff'];
self.addEventListener('install',e=>e.waitUntil(caches.open(C).then(c=>c.addAll(A)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)))});
