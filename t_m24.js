// Interaction checks for the judgement-calls module and the three-statement additions
const {JSDOM,VirtualConsole}=require('/tmp/claude-0/jt/node_modules/jsdom');const fs=require('fs');
const vc=new VirtualConsole();const errs=[];vc.on('jsdomError',e=>{if(!/stylesheet|link|scrollTo|Not implemented/i.test(e.message))errs.push(e.message)});
const d=new JSDOM('<body>'+fs.readFileSync('dist/gm-ledger.html','utf8')+'</body>',{runScripts:'dangerously',pretendToBeVisual:true,virtualConsole:vc,url:'https://x.org/'});
const w=d.window, doc=w.document, BW=w.BW; w.scrollTo=()=>{};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const ix=(m,id)=>BW.mods[m].sections.findIndex(s=>s.id===id);
const $=s=>doc.querySelector(s), $$=s=>[...doc.querySelectorAll(s)];
const txt=s=>($(s)||{}).textContent||'';
const type=(inp,v)=>{ inp.value=v; inp.dispatchEvent(new w.Event('input')); };
const segClick=(scope,label)=>{ const b=[...scope.querySelectorAll('.seg button')].find(x=>x.textContent.trim()===label); if(!b) throw new Error('no seg '+label); b.click(); };
(async()=>{
  const ok=(name,cond,extra)=>console.log((cond?'PASS ':'FAIL ')+name+(extra?' | '+extra:''));
  console.log('m24 header:', (BW.go('m24',0), txt('.eyebrow')));
  // 1. two honest accountants: all bold
  const wd=$$('.widget')[0]; wd.querySelectorAll('.jc-row').forEach(r=>{ const bs=r.querySelectorAll('.seg button'); bs[bs.length-1].click(); });
  ok('dial max', /\$130,620/.test(wd.querySelector('.stats').textContent), wd.querySelector('.stats').textContent.slice(0,60));
  // 2. rebate
  BW.go('m24',ix('m24','revenue')); await sleep(80); const rw=$$('.widget')[0];
  ok('rebate est 3% no overstatement', /nothing/.test(rw.querySelector('.stats').textContent));
  segClick(rw,'Book it when it\'s paid (January)'); ok('rebate paid overstated', /\$31,000/.test(rw.querySelector('.stats').textContent));
  // 3. capitalise under SME
  BW.go('m24',ix('m24','capitalise')); await sleep(80); const cw=$$('.widget')[0]; segClick(cw,'SME standards');
  ok('capitalise SME flags testing', /Not allowed under the SME standards/.test(cw.textContent));
  // 4. tank foam to year-end
  BW.go('m24',ix('m24','provisions')); const tw=$$('.widget')[0]; segClick(tw,'Foam problem: claims double from July'); tw.querySelector('[data-end]').click();
  ok('tank shortfall', /\$8,960 short/.test(tw.textContent), (tw.textContent.match(/provision is[^.]+/)||[''])[0]);
  // 5. fx totals
  BW.go('m24',ix('m24','fx')); const fw=$$('.widget')[0]; ok('fx total', /\(\$1,600\)/.test(fw.querySelector('.jtbl').textContent)); fw.querySelectorAll('.fxt-d')[3].click(); ok('fx realised text', /realised/.test(fw.querySelector('.msg').textContent));
  // 6. lease us
  BW.go('m24',ix('m24','leases')); const lw=$$('.widget')[0]; ok('lease ifrs ratio', /1\.97×/.test(lw.textContent)); segClick(lw,'US GAAP'); ok('lease us ebitda same', /\$132,000[\s\S]*\$132,000/.test(lw.querySelector('.jtbl').textContent));
  // 7. deferred tax year 5
  BW.go('m24',ix('m24','rules')); const dw=$$('.widget').find(x=>/Tax paid later/.test(x.textContent)); const r=dw.querySelector('input[type=range]'); r.value=5; r.dispatchEvent(new w.Event('input'));
  ok('dtl year 5', /\$7,500/.test(dw.querySelector('.stats').textContent));
  // 8. restate case
  BW.go('m24',ix('m24','case')); const rs=$$('.widget')[0]; ['adj','adj','adj','acc','acc','adj'].forEach((c,i)=>rs.querySelectorAll('.rs-i')[i].querySelector(`[data-c="${c}"]`).click());
  ok('restated', /\$70,900/.test(rs.querySelector('.rs-p').textContent) && /6 of 6 calls agreed/.test(rs.textContent));
  BW.go('m24',ix('m24','case')); ok('restate persisted', /6 of 6 decided/.test(txt('.rs-n')));
  // 9. cash flow builder
  BW.go('m5',ix('m5','build')); const bw=$$('.widget').find(x=>/Cash flow builder/.test(x.textContent));
  const ans={dep:44000,gain:-2000,ar:16000,inv:'5,000',pre:'(2,000)',ap:-7000,acc:'4k',tax:1700,capex:-85000,sale:5000,od:-25000,loan:-20000,div:20000};
  Object.entries(ans).forEach(([k,v])=>type(bw.querySelector(`#m5-build-1-${k}`),String(v)));
  bw.querySelector('[data-check]').click(); ok('builder wrong sign caught', /wrong direction/.test(bw.textContent));
  type(bw.querySelector('#m5-build-1-div'),'-20000'); bw.querySelector('[data-check]').click();
  ok('builder ties', !bw.querySelector('.cfb-stamp').hidden && /\$17,900<\/strong> closing/.test(bw.querySelector('.cfb-txt').innerHTML), bw.querySelector('.cfb-txt').textContent.slice(0,90));
  // 10. equity
  BW.go('m4',ix('m4','equity')); const ew=$$('.widget')[0]; const sl=ew.querySelectorAll('input[type=range]'); sl[1].value=100000; sl[1].dispatchEvent(new w.Event('input'));
  ok('equity dividend warning', /Dividends exceed profit/.test(ew.textContent));
  // 11. numbering
  ok('real reports is 22', BW.modNo('m21')===22 && BW.modNo('m24')===21 && BW.modNo('m23')===24);
  BW.go('kit',4); ok('qb has judgement group', /Judgement calls/.test(doc.getElementById('main').textContent));
  console.log(errs.length?'ERRORS '+errs.join('\n'):'no errors');
  process.exit(0);
})();
