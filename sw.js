/* 오프라인 사용을 위한 서비스 워커
   - 화면 파일(index.html 등)은 인터넷이 되면 항상 최신 파일을 받고, 오프라인일 때만 저장본을 씁니다.
   - 폰트·라이브러리·아이콘처럼 거의 안 바뀌는 큰 파일은 저장본을 먼저 씁니다.
   - 폰트·라이브러리·아이콘을 교체했다면 아래 버전 이름을 바꿔서 올려 주세요. */
const C='report-maker-v3';
const A=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','libs/html2canvas.min.js','libs/jszip.min.js','fonts/KoPubDotum-Medium.woff','fonts/KoPubDotum-Bold.woff','fonts/KoPubBatang-Medium.woff','fonts/KoPubBatang-Bold.woff'];
const STATIC=/\/(libs|fonts)\/|icon-\d+\.png$/;
const keep=(r,x)=>{if(x.ok){const y=x.clone();caches.open(C).then(c=>c.put(r,y))}return x};

self.addEventListener('install',e=>e.waitUntil(
  caches.open(C).then(c=>c.addAll(A.map(u=>new Request(u,{cache:'reload'})))).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(
  caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>clients.claim())));
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=='GET'||u.origin!==location.origin)return;
  if(STATIC.test(u.pathname)){
    e.respondWith(caches.match(r).then(m=>m||fetch(r).then(x=>keep(r,x))));
    return;
  }
  e.respondWith(
    fetch(r.url,{cache:'no-cache'}).then(x=>keep(r,x))
      .catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||caches.match('index.html'))));
});
