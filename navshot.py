from playwright.sync_api import sync_playwright
open('/tmp/claude-0/shots/page.html','w').write('<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width">'+open('/home/claude/course/dist/gm-ledger.html').read())
with sync_playwright() as p:
    b=p.chromium.launch(); ctx=b.new_context(viewport={'width':400,'height':820}); pg=ctx.new_page()
    pg.goto('file:///tmp/claude-0/shots/page.html#m1-2'); pg.wait_for_timeout(500)
    t=pg.query_selector('.term.has-def'); t.scroll_into_view_if_needed(); t.click(); pg.wait_for_timeout(300)
    pg.screenshot(path='/tmp/claude-0/shots/nav_pop.png')
    pg.query_selector('.gpop button').click(); pg.wait_for_timeout(500)
    pg.screenshot(path='/tmp/claude-0/shots/nav_gloss.png')
    pg.evaluate("BW.go('kit',2)"); pg.wait_for_timeout(400); pg.screenshot(path='/tmp/claude-0/shots/nav_gloss2.png',full_page=False)
    b.close()
print('ok')
