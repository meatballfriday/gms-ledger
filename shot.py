import sys
from playwright.sync_api import sync_playwright
pages=sys.argv[1].split(',')
open('/tmp/claude-0/shots/page.html','w').write('<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width">'+open('/home/claude/course/dist/gm-ledger.html').read())
with sync_playwright() as p:
    b=p.chromium.launch()
    for spec in pages:
        h,w,scheme=spec.split(':')
        ctx=b.new_context(viewport={'width':int(w),'height':900},color_scheme=scheme,device_scale_factor=1)
        pg=ctx.new_page(); errs=[]
        pg.on('pageerror',lambda e: errs.append(str(e)))
        pg.goto('file:///tmp/claude-0/shots/page.html#'+h, wait_until='domcontentloaded'); pg.wait_for_timeout(600)
        sw=pg.evaluate('document.documentElement.scrollWidth'); 
        out=f'/tmp/claude-0/shots/{h}_{w}_{scheme}.png'
        pg.screenshot(path=out,full_page=True)
        print(out,'scrollWidth',sw,'errors',errs)
        ctx.close()
    b.close()
