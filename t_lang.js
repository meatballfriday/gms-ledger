// Language switcher: EN -> 繁中 -> EN. Walks every page in zh-TW, checks for errors and undefined/NaN,
// checks the interface catalog and module-name overrides, and that progress and the current page survive switching.
const {JSDOM, VirtualConsole} = require('/tmp/claude-0/jt/node_modules/jsdom');
const fs=require('fs'); const html=fs.readFileSync('/home/claude/course/dist/gm-ledger.html','utf8');
const errs=[]; const vc=new VirtualConsole();
vc.on('jsdomError',e=>{ if(!/scrollTo|scrollIntoView|stylesheet|Could not load link/i.test(e.message)) errs.push(e.message); });
vc.on('error',(...a)=>errs.push('console.error: '+a.map(x=>x&&x.stack||String(x)).join(' ')));
const d=new JSDOM('<body>'+html+'</body>',{runScripts:'dangerously',pretendToBeVisual:true,virtualConsole:vc,url:'https://example.org/'});
const w=d.window; w.scrollTo=()=>{}; const $=s=>w.document.querySelector(s), $$=s=>[...w.document.querySelectorAll(s)];
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let fails=0; const ok=(c,msg)=>{ console.log((c?'ok   ':'FAIL ')+msg); if(!c) fails++; };
const bad=t=>{ const m=t.match(/.{0,40}\b(undefined|NaN)\b.{0,40}/); return m?m[0]:null; };
const pick=sel=>{ const s=$('#lang'); s.value=sel; s.dispatchEvent(new w.Event('change',{bubbles:true})); };
(async()=>{ await sleep(200); const BW=w.BW;
  ok(BW.lang==='en','starts in English');
  ok(!!$('#lang')&&$$('#lang option').map(o=>o.textContent).join('/')==='EN/繁中','switcher shows EN/繁中');
  ok($('#lang').getAttribute('aria-label')==='Language','switcher aria-label');
  ok(!!BW.LANG['zh-TW'],'zh-TW bundle built');

  // progress made in English
  BW.go('m3',1); const m3=BW.mods.m3; const qi=m3.sections.findIndex(s=>s.blocks.some(b=>b&&b.t==='quiz'));
  BW.go('m3',qi); $('.quiz .opt').click();
  const before=JSON.stringify(BW.state); const enTitle=$('.mod-head h1').textContent, enEye=$('.eyebrow').textContent;
  ok(/^Module 3 of \d+, in Part 1: Foundations$/.test(enEye),'English eyebrow: '+enEye);

  // switch with the control
  pick('zh-TW'); await sleep(20);
  ok(BW.lang==='zh-TW','switched to zh-TW');
  ok(w.document.documentElement.lang==='zh-Hant-TW','html lang zh-Hant-TW');
  ok(w.localStorage.getItem('gmledger.lang')==='zh-TW','choice saved');
  ok(w.location.hash==='#m3-'+(qi+1),'same page after switch: '+w.location.hash);
  ok($('.sectab.is-active')&&$$('.sectab').indexOf($('.sectab.is-active'))===qi,'same section tab active');
  const zhTitle=$('.mod-head h1').textContent; console.log('     m3 title en/zh:',enTitle,'/',zhTitle);
  ok($('.quiz .opt.is-right,.quiz .opt.is-wrong')!==null,'saved quiz answer still shown in zh-TW');

  // catalog and module-name overrides (temporary values)
  BW.UISTR['zh-TW']['Home']='首頁'; BW.UISTR['zh-TW']['Module {n} of {total}, in Part {p}: {part}']='第 {n} 單元（共 {total} 單元），第 {p} 部分：{part}';
  BW.OUTSTR['zh-TW'].m3.short='損益表'; BW.OUTSTR['zh-TW'].parts['Foundations']='基礎';
  BW.useLang('zh-TW'); BW.go('m3',qi);
  ok($('#strip .chip').textContent==='首頁','catalog string used: '+$('#strip .chip').textContent);
  ok(/^第 3 單元（共 \d+ 單元），第 1 部分：基礎$/.test($('.eyebrow').textContent),'placeholders + part override: '+$('.eyebrow').textContent);
  ok(BW.OUT.m3.short==='損益表','module short name override');
  BW.UISTR['zh-TW']['Home']=''; BW.useLang('zh-TW'); BW.go('home');
  ok($('#strip .chip').textContent==='Home','empty catalog value falls back to English');

  // walk every page in zh-TW
  let n=0; const probs=[];
  const ids=[...Object.keys(BW.mods),'kit','home','packs',...Object.keys(BW.packs)];
  for(const id of ids){ const m=BW.mods[id]||BW.packs[id]; const k=m?m.sections.length:(id==='kit'?6:1);
    for(let i=0;i<k;i++){ BW.go(id,i); n++; const t=$('#main').textContent+' '+$('#top').textContent; const b=bad(t); if(b) probs.push(id+'-'+(i+1)+': '+b); } }
  $('#tocbtn').click(); const tb=bad($('.toc').textContent); if(tb) probs.push('toc: '+tb); $('.toc-x').click();
  ok(probs.length===0,`zh-TW: ${n} pages walked, no undefined/NaN`+(probs.length?'\n     '+probs.slice(0,10).join('\n     '):''));
  // term spans in zh-TW content resolve against the zh-TW glossary
  const miss=new Set(); for(const id of Object.keys(BW.mods)) BW.mods[id].sections.forEach((s,i)=>{ BW.go(id,i); $$('#main .term').forEach(t=>{ if(!t.classList.contains('has-def')) miss.add(t.textContent); }); });
  ok(miss.size===0,'zh-TW term spans all resolve'+(miss.size?' (unresolved: '+[...miss].slice(0,12).join(', ')+')':''));

  // back to English
  BW.go('m3',qi); pick('en'); await sleep(20);
  ok(BW.lang==='en'&&w.document.documentElement.lang==='en','back to English');
  ok($('.mod-head h1').textContent===enTitle,'English module title back: '+$('.mod-head h1').textContent);
  ok($('.eyebrow').textContent===enEye,'English eyebrow back');
  ok(BW.OUT.m3.short==='Income statement'&&BW.PARTS[0].name==='Foundations','English OUT/PARTS restored');
  ok($('#strip .chip').textContent==='Home'&&$('#tocbtn span').textContent==='Contents','English chrome back');
  const st=JSON.parse(JSON.stringify(BW.state)), b0=JSON.parse(before);
  ok(Object.keys(b0.quiz).every(k=>st.quiz[k]===b0.quiz[k])&&Object.keys(b0.visited).every(k=>st.visited[k]),'progress intact (quiz answers and visited sections)');
  ok(Object.keys(st.quiz).every(k=>/^(m\d+|cap)\.[\w-]+\.\d+$/.test(k)),'progress keys are language-independent');
  console.log(errs.length?'ERRORS\n'+errs.slice(0,10).join('\n'):'no errors'); if(errs.length) fails++;
  console.log(fails?fails+' FAILED':'all passed'); process.exit(fails?1:0);
})();
