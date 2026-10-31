from playwright.sync_api import sync_playwright
import json
src='/tmp/claude-0/shots/page.html'
open(src,'w').write('<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width">'+open('/home/claude/course/dist/gm-ledger.html').read())
S={"visited":{"m1.meet":True,"m1.pl":True,"m5.stmt":True,"m5.bridge":True},"quiz":{},"checks":{},"sorts":{},"last":"m5-3"}
shots=[('home',1280,'light',None,False),('home',390,'dark',None,False),('m5-1',1280,'light','toc',False),('m5-1',390,'light','toc',False),('m5-1',390,'light',None,False),('m1-8',1280,'dark','end',False)]
with sync_playwright() as p:
    b=p.chromium.launch()
    for h,wd,sc,act,full in shots:
        ctx=b.new_context(viewport={'width':wd,'height':900},color_scheme=sc)
        ctx.add_init_script("try{localStorage.setItem('gmledger.v1',%s);localStorage.setItem('gmledger.theme','%s')}catch(e){}"%(json.dumps(json.dumps(S)),sc))
        pg=ctx.new_page(); errs=[]; pg.on('pageerror',lambda e: errs.append(str(e)))
        pg.goto('file://'+src+'#'+h); pg.wait_for_timeout(700)
        if act=='toc': pg.click('#tocbtn'); pg.wait_for_timeout(350)
        if act=='end': pg.evaluate("window.scrollTo(0,document.body.scrollHeight)"); pg.wait_for_timeout(200)
        out=f'/tmp/claude-0/shots/U_{h}_{wd}_{sc}_{act}.png'; pg.screenshot(path=out,full_page=full)
        print(out,'sw',pg.evaluate('document.documentElement.scrollWidth'),errs); ctx.close()
    b.close()
