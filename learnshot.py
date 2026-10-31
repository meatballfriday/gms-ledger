from playwright.sync_api import sync_playwright
import json
src='/tmp/claude-0/shots/page.html'
open(src,'w').write('<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width">'+open('/home/claude/course/dist/gm-ledger.html').read())
S={"visited":{"m1.meet":True,"m2.chain":True,"m3.full":True},"quiz":{},"checks":{},"sorts":{},"last":None,
   "diag":{"a":{"0":1,"1":1,"2":2,"3":0,"4":0,"5":0,"6":2,"7":1,"8":1,"9":1},"done":True},
   "sim":[1,1,0,1,1,2,1,1],"simV":2,
   "final":{"a":{str(i):1 for i in range(15)},"marked":True,"best":13,"score":13,"passDate":"2026-10-03T09:00:00Z","name":"Liyang"},
   "commC":{"text":"Cash is the urgent issue. Liquidity goes negative in week 4. Receivables and inventory are up. Talk to the bank by Friday.","checked":{},"shown":True}}
S["final"]["a"]["0"]=1; S["final"]["a"]["2"]=1
shots=[('home',1280,'light','.diag'),('m5-1',390,'dark','.warm'),('cap-2',1280,'light','.qchart'),('cap-2',390,'dark','.qchart'),('cap-5',390,'light','.fa-res'),('packC-9',1280,'dark','.cm-out')]
shots=[s for s in shots if s[0] in ('packC-9','cap-5')]
with sync_playwright() as p:
    b=p.chromium.launch()
    for h,wd,sc,sel in shots:
        ctx=b.new_context(viewport={'width':wd,'height':1000},color_scheme=sc)
        ctx.add_init_script("try{localStorage.setItem('gmledger.v1',%s);localStorage.setItem('gmledger.theme','%s')}catch(e){}"%(json.dumps(json.dumps(S)),sc))
        pg=ctx.new_page(); errs=[]; pg.on('pageerror',lambda e: errs.append(str(e)))
        pg.goto('file://'+src+'#'+h); pg.wait_for_timeout(700)
        el=pg.query_selector(sel)
        if el: el.scroll_into_view_if_needed(); pg.evaluate("window.scrollBy(0,-120)")
        out=f'/tmp/claude-0/shots/L_{h}_{wd}_{sc}.png'; pg.screenshot(path=out)
        print(out,'found' if el else 'MISSING',sel,'sw',pg.evaluate('document.documentElement.scrollWidth'),errs)
        ctx.close()
    b.close()
