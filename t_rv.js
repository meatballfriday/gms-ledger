const {JSDOM, VirtualConsole} = require('/tmp/claude-0/jt/node_modules/jsdom');
const fs=require('fs'); const html=fs.readFileSync('/home/claude/course/dist/gm-ledger.html','utf8');
const errs=[]; const vc=new VirtualConsole(); vc.on('jsdomError',e=>{ if(!/scrollTo|scrollIntoView/.test(e.message)) errs.push(e.message); });
const d=new JSDOM(html,{runScripts:'dangerously',pretendToBeVisual:true,virtualConsole:vc});
const w=d.window; const sleep=ms=>new Promise(r=>setTimeout(r,ms)); const $=s=>w.document.querySelector(s), $$=s=>[...w.document.querySelectorAll(s)];
(async()=>{ await sleep(300); const BW=w.BW; const ix=id=>BW.mods.m21.sections.findIndex(s=>s.id===id);
  BW.go('m21',ix('library')); console.log('library cards', $$('.lib-card').length);
  $$('.lib-card .rv-open-btn')[0].click(); console.log('open:', !!$('.rv'), $('.rv-ttl strong').textContent, '| tabs', $$('.rv-tabs button').length, '| run', $('.rv-run').textContent);
  $$('.rv-tabs button')[2].click(); console.log('IS page rows', $$('.rv-st tbody tr').length, '| first rows', $$('.rv-st tbody tr').slice(0,3).map(r=>r.textContent.replace(/\s+/g,' ')).join(' / '));
  $('[data-next]').click(); console.log('next ->', $('.rv-paper h3').textContent, '| total row:', $$('.rv-st tr.tot').map(r=>r.textContent.replace(/\s+/g,' ')).join(' | '));
  for(const [k,label] of [['embla','Embla'],['ivc21','2021'],['ivc22','2022']]){ BW.openReport(k,'cf'); const rows=$$('.rv-st tbody tr'); console.log(k,'cf rows',rows.length,'| last:',rows[rows.length-1].textContent.replace(/\s+/g,' ').trim(), '| unit:', $('.rv-unit').textContent); }
  BW.openReport('ivc22','gc'); console.log('gc page:', $('.rv-paper h3').textContent, $('.rv-paper .prose').textContent.slice(0,60));
  w.document.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape'})); console.log('closed by Escape:', !$('.rv'));
  // hunt hint opens right page
  BW.go('m21',ix('arjo')); const li=$$('.hunt-i')[5]; li.querySelector('[data-h]').click(); li.querySelector('.hunt-hint .rv-open-btn').click(); console.log('hint opens:', $('.rv-paper h3').textContent);
  $('.rv-x').click(); console.log('closed by X:', !$('.rv'), 'body class', w.document.body.classList.contains('rv-open'));
  // stays open across navigation
  BW.openReport('embla','bs'); BW.go('m21',ix('embla')); console.log('open after nav:', !!$('.rv'));
  // all pages render without undefined
  let bad=[]; for(const k in BW.reports){ BW.reports[k].pages.forEach((p,i)=>{ BW.openReport(k,i); const t=$('.rv-body').textContent; if(/undefined|NaN|\[object/.test(t)) bad.push(k+':'+p.id); }); } console.log('pages with bad text:', bad.length?bad:'none', '| total pages', Object.values(BW.reports).reduce((a,r)=>a+r.pages.length,0));
  console.log(errs.length?'ERRORS '+errs.join('\n'):'no errors'); process.exit(0); })();
