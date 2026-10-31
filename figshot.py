import sys
from playwright.sync_api import sync_playwright
open('/tmp/claude-0/shots/page.html','w').write('<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width">'+open('/home/claude/course/dist/gm-ledger.html').read())
with sync_playwright() as p:
    b=p.chromium.launch()
    for spec in sys.argv[1].split(','):
        h,w,scheme=spec.split(':')
        ctx=b.new_context(viewport={'width':int(w),'height':900},color_scheme=scheme)
        pg=ctx.new_page(); errs=[]
        if scheme=='dark': pg.add_init_script("try{localStorage.setItem('gmledger.theme','dark')}catch(e){}")
        pg.on('pageerror',lambda e: errs.append(str(e)))
        pg.goto('file:///tmp/claude-0/shots/page.html#'+h); pg.wait_for_timeout(700)
        figs=pg.query_selector_all('figure.fig')
        for i,fg in enumerate(figs):
            fg.screenshot(path=f'/tmp/claude-0/shots/fig_{h}_{w}_{scheme}_{i}.png')
        print(h,w,scheme,'figs',len(figs),'sw',pg.evaluate('document.documentElement.scrollWidth'),errs)
        ctx.close()
    b.close()
