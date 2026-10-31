from playwright.sync_api import sync_playwright
import json
src='/tmp/claude-0/shots/page.html'
open(src,'w').write('<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width">'+open('/home/claude/course/dist/gm-ledger.html').read())
S={"visited":{},"quiz":{},"checks":{},"sorts":{},"last":None,"ivc":{"y":2,"a":{"0":1,"1":0}},"hunt":{"arjo":{"0":{"ok":True},"1":{"ok":True},"4":{"tries":2,"shown":True}}}}
shots=[('m21-1',1280,'light',None,True),('m21-1',390,'dark',None,True),('m21-2',390,'light','.hunt',False),('m21-2',1280,'dark','figure',False),('m21-3',1280,'light','figure',False),('m21-4',1280,'light','.ivc-years',False),('m21-4',390,'dark','figure',False),('m21-5',390,'light','figure',False),('m21-6',390,'dark','.tbl',False)]
shots=[('m21-6',390,'dark','.tbl',False)]
with sync_playwright() as p:
    b=p.chromium.launch()
    for h,wd,sc,sel,full in shots:
        ctx=b.new_context(viewport={'width':wd,'height':1100},color_scheme=sc)
        ctx.add_init_script("try{localStorage.setItem('gmledger.v1',%s);localStorage.setItem('gmledger.theme','%s')}catch(e){}"%(json.dumps(json.dumps(S)),sc))
        pg=ctx.new_page(); errs=[]; pg.on('pageerror',lambda e: errs.append(str(e)))
        pg.goto('file://'+src+'#'+h); pg.wait_for_timeout(800)
        if sel:
            el=pg.query_selector(sel)
            if el: el.scroll_into_view_if_needed(); pg.evaluate("window.scrollBy(0,-90)")
        out=f'/tmp/claude-0/shots/M21_{h}_{wd}_{sc}.png'; pg.screenshot(path=out,full_page=full)
        print(out,'sw',pg.evaluate('document.documentElement.scrollWidth'),errs)
        ctx.close()
    b.close()
