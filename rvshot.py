from playwright.sync_api import sync_playwright
src='/tmp/claude-0/shots/page.html'
open(src,'w').write('<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width">'+open('/home/claude/course/dist/gm-ledger.html').read())
shots=[('m21-3',1366,'light','arjo','cf'),('m21-3',390,'dark','arjo','is'),('m21-5',1366,'dark','ivc21','is'),('m21-4',390,'light','embla','bs'),('m21-2',1280,'light',None,None)]
with sync_playwright() as p:
    b=p.chromium.launch()
    for h,wd,sc,rep,page in shots:
        ctx=b.new_context(viewport={'width':wd,'height':900},color_scheme=sc)
        ctx.add_init_script("try{localStorage.setItem('gmledger.theme','%s')}catch(e){}"%sc)
        pg=ctx.new_page(); errs=[]; pg.on('pageerror',lambda e: errs.append(str(e)))
        pg.goto('file://'+src+'#'+h); pg.wait_for_timeout(700)
        if rep:
            pg.evaluate("window.scrollTo(0, document.querySelector('.hunt-open, .sec-body').getBoundingClientRect().top+window.scrollY-120)")
            pg.evaluate(f"BW.openReport('{rep}','{page}')"); pg.wait_for_timeout(300)
        out=f'/tmp/claude-0/shots/RV_{h}_{wd}_{sc}_{rep}.png'; pg.screenshot(path=out,full_page=(rep is None))
        print(out,'sw',pg.evaluate('document.documentElement.scrollWidth'),errs)
        ctx.close()
    b.close()
