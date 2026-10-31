// Ask-the-tutor panel: hidden without a viewer; with a stubbed sample(), sends page context and renders streamed Markdown.
const {chromium}=require('/opt/node22/lib/node_modules/playwright');
(async()=>{
  const b=await chromium.launch(); const url='file://'+require('path').resolve('dist/gm-ledger.html');
  let errs=[];
  // 1. no viewer: no button
  let pg=await b.newPage(); pg.on('pageerror',e=>errs.push(String(e)));
  await pg.goto(url+'#m5-2'); await pg.waitForTimeout(800);
  console.log('no viewer, fab shown (copy mode):', !(await pg.$eval('.ask-fab',e=>e.hidden)));
  // 2. stubbed viewer
  pg=await b.newPage({viewport:{width:1280,height:900}}); pg.on('pageerror',e=>errs.push(String(e)));
  await pg.addInitScript(()=>{ window.__calls=[]; window.claude={use:async n=>n==='sample'?function(input,opt){ window.__calls.push({input,opt:{cache:opt.cache}}); return new Promise((res,rej)=>{
      const full='**Working capital** is the cash tied up in running the business.\n\n- Receivables\n- Inventory\n\n| Item | $ |\n|---|---|\n| AR | 120,000 |\n| AP | (60,000) |\n\nSee Module 16.';
      let i=0; const t=setInterval(()=>{ if(opt.signal&&opt.signal.aborted){ clearInterval(t); rej({code:'cancelled',text:full.slice(0,i)||undefined}); return; } i=Math.min(full.length,i+40); opt.onText({text:full.slice(0,i),delta:''}); if(i>=full.length){ clearInterval(t); res({text:full,truncated:false,modelTierApplied:'default'}); } },30); }); }:null}; });
  await pg.goto(url+'#m5-2'); await pg.waitForTimeout(800);
  console.log('viewer, fab visible:', !(await pg.$eval('.ask-fab',e=>e.hidden)));
  await pg.click('.ask-fab'); await pg.waitForTimeout(200);
  console.log('ctx line:', await pg.$eval('.ask-ctx',e=>e.textContent));
  console.log('chips:', await pg.$$eval('.ask-chip',x=>x.map(e=>e.textContent).join(' | ')));
  await pg.fill('#askta','What is working capital?'); await pg.keyboard.press('Enter');
  await pg.waitForTimeout(900);
  const c=await pg.evaluate(()=>window.__calls[0]);
  console.log('turns:', c.input.length, 'roles', c.input.map(t=>t.role).join(','), 'cache', c.opt.cache);
  console.log('rules mention page:', /Module 5/.test(c.input[0].content), /Page text/.test(c.input[0].content), 'len', c.input[0].content.length);
  console.log('rendered:', await pg.$eval('.ask-m.bot',e=>[e.querySelector('strong')&&e.querySelector('strong').textContent, e.querySelectorAll('li').length, e.querySelectorAll('td').length].join(' / ')));
  await pg.screenshot({path:'/tmp/claude-0/shots/ask_1280.png'});
  // second question carries history
  await pg.fill('#askta','And inventory?'); await pg.click('.ask-send'); await pg.waitForTimeout(900);
  const c2=await pg.evaluate(()=>window.__calls[1]); console.log('2nd call turns:', c2.input.map(t=>t.role).join(','));
  // stop mid-stream
  await pg.fill('#askta','Third'); await pg.click('.ask-send'); await pg.waitForTimeout(80); await pg.click('.ask-stop'); await pg.waitForTimeout(200);
  console.log('stopped note:', await pg.$$eval('.ask-err',x=>x.map(e=>e.textContent).join('|')));
  // XSS safety
  console.log('md escapes:', await pg.evaluate(()=>BW.askMd('<img src=x onerror=alert(1)> **b**')));
  // Escape closes, fab returns
  await pg.keyboard.press('Escape'); await pg.waitForTimeout(100);
  console.log('closed:', await pg.$eval('#askp',e=>e.hidden), 'fab back:', !(await pg.$eval('.ask-fab',e=>e.hidden)));
  // mobile
  const mp=await b.newPage({viewport:{width:390,height:800}}); mp.on('pageerror',e=>errs.push(String(e)));
  await mp.addInitScript(()=>{ window.claude={use:async()=>async()=>({text:'ok',truncated:false})}; });
  await mp.goto(url+'#m12-1'); await mp.waitForTimeout(800); await mp.screenshot({path:'/tmp/claude-0/shots/ask_fab_390.png'});
  await mp.click('.ask-fab'); await mp.waitForTimeout(300); await mp.screenshot({path:'/tmp/claude-0/shots/ask_390.png'});
  console.log('mobile overflow:', await mp.evaluate(()=>document.documentElement.scrollWidth));
  // denied
  const dp=await b.newPage(); dp.on('pageerror',e=>errs.push(String(e)));
  await dp.addInitScript(()=>{ window.claude={use:async()=>()=>Promise.reject({code:'not_granted',message:'x'})}; });
  await dp.goto(url+'#m1-1'); await dp.waitForTimeout(800); await dp.click('.ask-fab'); await dp.fill('#askta','hi'); await dp.keyboard.press('Enter'); await dp.waitForTimeout(300);
  console.log('denied:', await dp.$eval('.ask-err',e=>e.textContent.slice(0,40)), 'form hidden', await dp.$eval('.ask-form',e=>e.hidden));
  await dp.keyboard.press('Escape'); await dp.waitForTimeout(100); console.log('fab gone after deny:', await dp.$eval('.ask-fab',e=>e.hidden));
  console.log(errs.length?'ERRORS '+errs.join('\n'):'no errors'); await b.close();
})();
