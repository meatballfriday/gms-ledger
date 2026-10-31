from playwright.sync_api import sync_playwright
open('/tmp/claude-0/shots/page.html','w').write('<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width">'+open('/home/claude/course/dist/gm-ledger.html').read())
with sync_playwright() as p:
    b=p.chromium.launch(); ctx=b.new_context(viewport={'width':820,'height':900}); pg=ctx.new_page()
    pg.goto('file:///tmp/claude-0/shots/page.html#m17-3'); pg.wait_for_timeout(500)
    fig=pg.query_selector_all('figure.fig')[1]
    for _ in range(3): fig.query_selector('button:has-text("Next")').click()
    pg.wait_for_timeout(500); fig.screenshot(path='/tmp/claude-0/shots/step_lc.png')
    pg.goto('file:///tmp/claude-0/shots/page.html#m12-1'); pg.wait_for_timeout(500)
    f2=pg.query_selector_all('figure.fig')[1]; f2.query_selector('[data-play]').click(); pg.wait_for_timeout(2400); f2.screenshot(path='/tmp/claude-0/shots/step_bucket.png')
    b.close()
print('ok')
