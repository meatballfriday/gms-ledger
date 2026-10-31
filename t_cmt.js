// Comment layer (custom anchors) and tutor depth selector, with stubbed viewer capabilities.
const {chromium}=require('/opt/node22/lib/node_modules/playwright');
(async()=>{
  const b=await chromium.launch(); const url='file://'+require('path').resolve('dist/gm-ledger.html'); const errs=[];
  const pg=await b.newPage({viewport:{width:1200,height:900}}); pg.on('pageerror',e=>errs.push(String(e)));
  await pg.addInitScript(()=>{ window.__c={compose:[],placed:[],calls:[]};
    window.claude={use:async n=>{
      if(n==='comments') return {customAnchors:async cb=>{ window.__cb=cb; return {compose:async(a,at,o)=>{ window.__c.compose.push({a,label:o&&o.label,tag:at.className}); return {opened:true}; }, placed:m=>window.__c.placed.push(m), open:async()=>{}, domAnchor:(el)=>['#'+el.id,{x:5,y:5}], exitMode(){}, release(){}, areas:false}; }};
      if(n==='sample') return async(input,opt)=>{ window.__c.calls.push(opt.modelTier); opt.onText&&opt.onText({text:'ok',delta:'ok'}); return {text:'ok',truncated:false,modelTierApplied:opt.modelTier==='complex'?'default':opt.modelTier}; };
      return null; }}; });
  await pg.goto(url+'#m5-4'); await pg.waitForTimeout(900);
  console.log('pen visible:', await pg.$eval('.cmt-fab',e=>getComputedStyle(e).display!=='none'));
  console.log('blocks tagged:', await pg.$$eval('#main [data-cm]',x=>x.length), await pg.$eval('#main .widget',e=>e.dataset.cm));
  await pg.click('.cmt-fab'); await pg.hover('#main .widget'); 
  console.log('hover outline:', await pg.$eval('#main .widget',e=>e.classList.contains('cmt-hover')));
  await pg.click('#main .widget .w-head'); await pg.waitForTimeout(100);
  const c=await pg.evaluate(()=>window.__c.compose[0]); console.log('compose anchor:', c.a, '| bytes', Buffer.byteLength(c.a));
  console.log('pick off after compose:', await pg.$eval('.cmt-fab',e=>e.getAttribute('aria-pressed')));
  // threads arrive: one ours on this page, one ours on another module, one shell css anchor
  await pg.evaluate(a=>window.__cb.threads([{id:'t1',anchor:a,resolved:false,active:false},{id:'t2',anchor:'m12:fixed:0:3 M12 › Fixed vs variable › text',resolved:false,active:false},{id:'t3',anchor:'body>div:nth-child(2)',resolved:false,active:false}]),c.a);
  await pg.waitForTimeout(100);
  let last=await pg.evaluate(()=>window.__c.placed.at(-1)); console.log('placed on m5:', Object.keys(last).join(','), JSON.stringify(last.t1));
  await pg.evaluate(()=>window.__cb.reveal('t2')); await pg.waitForTimeout(400);
  console.log('reveal navigated to:', await pg.evaluate(()=>location.hash));
  last=await pg.evaluate(()=>window.__c.placed.at(-1)); console.log('placed on m12:', Object.keys(last).join(','));
  // mode from shell: clicking a block composes
  await pg.evaluate(()=>window.__cb.mode(true)); await pg.click('#main .sec-head'); await pg.waitForTimeout(100);
  console.log('shell-mode compose:', await pg.evaluate(()=>window.__c.compose.at(-1).a));
  await pg.evaluate(()=>window.__cb.mode(false));
  // tutor depth
  await pg.click('.ask-fab'); await pg.click('.ask-tier [data-t="complex"]'); await pg.fill('#askta','q'); await pg.keyboard.press('Enter'); await pg.waitForTimeout(200);
  console.log('tier sent:', await pg.evaluate(()=>window.__c.calls.at(-1)), '| note:', await pg.$eval('.ask-err',e=>e.textContent));
  await pg.screenshot({path:'/tmp/claude-0/shots/ask_tier.png'});
  await pg.keyboard.press('Escape');
  await pg.goto(url+'#m5-4'); await pg.waitForTimeout(700); await pg.click('.cmt-fab'); await pg.hover('#main figure, #main .widget'); await pg.screenshot({path:'/tmp/claude-0/shots/cmt_pick.png'});
  const mp=await b.newPage({viewport:{width:390,height:800}}); await mp.addInitScript(()=>{ window.claude={use:async n=>n==='comments'?{customAnchors:async()=>({compose:async()=>({opened:true}),placed(){},release(){}})}:n==='sample'?async()=>({text:'x'}):null}; });
  await mp.goto(url+'#m3-1'); await mp.waitForTimeout(800); await mp.screenshot({path:'/tmp/claude-0/shots/cmt_390.png'});
  console.log(errs.length?'ERRORS '+errs.join('\n'):'no errors'); await b.close();
})();
