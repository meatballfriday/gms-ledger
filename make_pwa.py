"""Package the standalone course as an installable, offline-capable web app in site/ (published by GitHub Pages).
Run after build.py:  python3 build.py && python3 make_pwa.py"""
import hashlib, json, os, re, shutil
from PIL import Image, ImageDraw, ImageFont
R = os.path.dirname(os.path.abspath(__file__)); OUT = os.path.join(R, 'site')
html = open(os.path.join(R, 'dist/gm-ledger-standalone.html'), encoding='utf8').read()
ver = hashlib.sha256(html.encode()).hexdigest()[:12]
os.makedirs(os.path.join(OUT, 'icons'), exist_ok=True)

# ---- icons: the course's DR|CR ledger mark on the course teal
TEAL, WHITE = (12, 106, 97), (255, 255, 255)
def font(px):
    for f in ['/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf', '/usr/share/fonts/truetype/liberation/LiberationMono-Bold.ttf']:
        if os.path.exists(f): return ImageFont.truetype(f, px)
    return ImageFont.load_default()
def icon(size, pad):
    im = Image.new('RGB', (size, size), TEAL); d = ImageDraw.Draw(im)
    inner = size - 2 * pad; bw, bh = inner * 0.8, inner * 0.42; x0 = (size - bw) / 2; y0 = (size - bh) / 2
    lw = max(2, size // 48)
    d.rectangle([x0, y0, x0 + bw, y0 + bh], outline=WHITE, width=lw)
    d.line([size / 2, y0, size / 2, y0 + bh], fill=WHITE, width=lw)
    f = font(int(bh * 0.5))
    for txt, cx in (('DR', x0 + bw / 4), ('CR', x0 + 3 * bw / 4)):
        b = d.textbbox((0, 0), txt, font=f); d.text((cx - (b[2] - b[0]) / 2 - b[0], size / 2 - (b[3] - b[1]) / 2 - b[1]), txt, font=f, fill=WHITE)
    return im
for s in (192, 512): icon(s, s // 10).save(os.path.join(OUT, f'icons/icon-{s}.png'))
icon(512, 512 // 5).save(os.path.join(OUT, 'icons/maskable-512.png'))
icon(180, 18).save(os.path.join(OUT, 'icons/apple-touch-icon.png'))
icon(48, 4).save(os.path.join(OUT, 'favicon.png'))

# ---- manifest
json.dump({
  "name": "The GM's Ledger", "short_name": "GM's Ledger",
  "description": "Accounting and finance for general managers: the BraceWorks Medical course.",
  "start_url": "./", "scope": "./", "display": "standalone", "background_color": "#F1F4F2", "theme_color": "#0C6A61",
  "lang": "en", "icons": [
    {"src": "icons/icon-192.png", "sizes": "192x192", "type": "image/png"},
    {"src": "icons/icon-512.png", "sizes": "512x512", "type": "image/png"},
    {"src": "icons/maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable"}]
}, open(os.path.join(OUT, 'manifest.webmanifest'), 'w'), indent=1)

# ---- service worker: the app shell is cached for offline use; a new deploy (new version) replaces it
open(os.path.join(OUT, 'sw.js'), 'w').write(f"""const V='gml-{ver}', SHELL=['./','./index.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./favicon.png'];
self.addEventListener('install',e=>{{ e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting())); }});
self.addEventListener('activate',e=>{{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V&&k.startsWith('gml-')).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); }});
self.addEventListener('fetch',e=>{{
  const r=e.request; if(r.method!=='GET') return;
  const u=new URL(r.url);
  if(u.origin===location.origin){{  /* the course: network first so updates arrive, cache when offline */
    e.respondWith(fetch(r).then(res=>{{ const c=res.clone(); caches.open(V).then(x=>x.put(r,c)); return res; }}).catch(()=>caches.match(r).then(m=>m||caches.match('./index.html'))));
  }} else if(/fonts\\.(googleapis|gstatic)\\.com$/.test(u.hostname)){{  /* web fonts: cache once, reuse offline */
    e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{{ const c=res.clone(); caches.open(V+'-fonts').then(x=>x.put(r,c)); return res; }})));
  }}
}});
""")

# ---- page: add manifest, icons, theme colour and service-worker registration
head = ('<link rel="manifest" href="manifest.webmanifest">\n<meta name="theme-color" content="#0C6A61">\n'
        '<link rel="icon" type="image/png" href="favicon.png">\n<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">\n'
        '<meta name="apple-mobile-web-app-capable" content="yes">\n<meta name="mobile-web-app-capable" content="yes">\n'
        '<meta name="apple-mobile-web-app-title" content="GM\'s Ledger">\n<meta name="description" content="Accounting and finance for general managers: the BraceWorks Medical course.">\n')
html = html.replace('<title>', head + '<title>', 1)
reg = "<script>if('serviceWorker' in navigator&&(location.protocol==='https:'||location.hostname==='localhost')){addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));}</script>\n"
i = html.rfind('</html>'); html = html[:i] + reg + html[i:]  # only the document's own closing tag
open(os.path.join(OUT, 'index.html'), 'w', encoding='utf8').write(html)
open(os.path.join(OUT, '.nojekyll'), 'w').write('')
open(os.path.join(OUT, '404.html'), 'w', encoding='utf8').write('<!doctype html><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=./"><a href="./">The GM\'s Ledger</a>')
print('site/ ready, version', ver, 'index', len(html.encode()) // 1024, 'KB')
