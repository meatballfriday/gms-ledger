const {JSDOM,VirtualConsole}=require('/tmp/claude-0/jt/node_modules/jsdom');const fs=require('fs');
const vc=new VirtualConsole();const errs=[];vc.on('jsdomError',e=>{if(!/stylesheet|link/i.test(e.message))errs.push(e.message)});vc.on('error',(...a)=>errs.push(a.join(' ')));
const d=new JSDOM('<body>'+fs.readFileSync('dist/gm-ledger.html','utf8')+'</body>',{runScripts:'dangerously',pretendToBeVisual:true,virtualConsole:vc,url:'https://x.org/'});
const w=d.window, doc=w.document, BW=w.BW; w.scrollTo=()=>{};
const tick=()=>new Promise(r=>setTimeout(r,20));
(async()=>{
  console.log('glossary terms', BW.gloss.list().length);
  // term spans resolution
  const html=fs.readFileSync('dist/gm-ledger.html','utf8'); const spans=[...new Set((html.match(/class="term">[^<]+</g)||[]).map(x=>x.replace('class="term">','').replace('<','')))];
  const miss=spans.filter(t=>!BW.gloss.find(t.replace(/&amp;/g,'&'))); console.log('term spans',spans.length,'unresolved',miss);
  ['AR','COGS','WIP','YTD','opex','P&L','DSO','overdraft','turnover','LC','capex','NPV'].forEach(t=>{ const e=BW.gloss.find(t); console.log(' ',t,'→',e&&e.term); });
  // back navigation from module 4 practice to a pack
  BW.go('m4',BW.mods.m4.sections.findIndex(s=>s.id==='apply')); await tick();
  doc.querySelector('.packlink').click(); await tick();
  console.log('now at', w.location.hash, '| pill:', doc.querySelector('#backpill:not([hidden]) .bp-t')?.textContent);
  // move to another page of the pack, pill should persist
  doc.querySelectorAll('.sectab')[2].click(); await tick();
  console.log('pack page 3 pill:', doc.querySelector('#backpill:not([hidden]) .bp-t')?.textContent);
  doc.querySelector('.bp-go').click(); await tick();
  console.log('after back', w.location.hash, '| pill hidden:', doc.getElementById('backpill').hidden);
  // popover on a term
  BW.go('m1',1); await tick(); const t=doc.querySelector('.term.has-def'); t.click(); await tick();
  console.log('popover:', doc.querySelector('.gpop:not([hidden]) .gp-t')?.textContent);
  doc.querySelector('.gpop button').click(); await tick();
  console.log('glossary opened at', w.location.hash, 'search=', doc.querySelector('input.search').value, '| results', doc.querySelector('.g-count').textContent, '| pill:', doc.querySelector('#backpill:not([hidden]) .bp-t')?.textContent);
  // learn more from glossary → module, then back to glossary
  doc.querySelector('[data-m]').click(); await tick();
  console.log('learn more →', w.location.hash, '| pill:', doc.querySelector('#backpill:not([hidden]) .bp-t')?.textContent);
  doc.querySelector('.bp-go').click(); await tick(); console.log('back →', w.location.hash, '| pill:', doc.querySelector('#backpill:not([hidden]) .bp-t')?.textContent);
  doc.querySelector('.bp-go').click(); await tick(); console.log('back again →', w.location.hash);
  // letter filter
  BW.go('kit',2); await tick(); [...doc.querySelectorAll('.az button')].find(b=>b.textContent==='W').click(); console.log('letter W:', doc.querySelector('.g-count').textContent);
  // ordinary nav clears stack
  BW.go('packs',0,{jump:true}); await tick(); BW.go('m5',0); await tick(); console.log('after ordinary nav pill hidden:', doc.getElementById('backpill').hidden);
  console.log('errors', errs);
})();
