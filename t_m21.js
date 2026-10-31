const {JSDOM, VirtualConsole} = require('/tmp/claude-0/jt/node_modules/jsdom');
const fs=require('fs'); const html=fs.readFileSync('/home/claude/course/dist/gm-ledger.html','utf8');
const errs=[]; const vc=new VirtualConsole(); vc.on('jsdomError',e=>{ if(!/scrollTo|scrollIntoView/.test(e.message)) errs.push(e.message); });
const saved=[];
const d=new JSDOM(html,{runScripts:'dangerously',pretendToBeVisual:true,virtualConsole:vc,beforeParse(w){ w.claude={use:async n=>n==='downloads'?{save:async r=>{ saved.push(r); return {status:'saved'}; }}:null}; }});
const w=d.window; const sleep=ms=>new Promise(r=>setTimeout(r,ms)); const $=s=>w.document.querySelector(s), $$=s=>[...w.document.querySelectorAll(s)];
const ix=id=>w.BW.mods.m21.sections.findIndex(s=>s.id===id);
const type=(inp,v)=>{ inp.value=v; };
(async()=>{ await sleep(300); const BW=w.BW;
  console.log('m21 in nav:', !!$$('.chip').find(c=>/Real reports/.test(c.textContent)), '| header:', (BW.go('m21',0), $('.eyebrow').textContent));
  // Arjo hunt: answers in varied formats
  BW.go('m21',ix('arjo'));
  const A=['11,292','3.1%','43.5','18.5','(126)','1516','76.7','58','2.0x','61'];
  $$('.hunt-i').forEach((li,i)=>{ type(li.querySelector('input'),A[i]); li.querySelector('[data-c]').click(); });
  console.log('arjo:', $('.hunt-score').textContent, '| failures:', $$('.hunt-i:not(.is-ok)').map(li=>li.querySelector('.hunt-q').textContent.slice(0,30)).join(';'));
  // Embla hunt with one wrong twice then reveal
  BW.go('m21',ix('embla'));
  const E=['855','6','3','148.4','1','62.5','20','76.8','776','50.4','2.4'];
  $$('.hunt-i').forEach((li,i)=>{ type(li.querySelector('input'),E[i]); li.querySelector('[data-c]').click(); });
  console.log('embla:', $('.hunt-score').textContent);
  BW.go('m21',ix('arjo')); console.log('arjo persisted:', $('.hunt-score').textContent);
  // wrong answers + reveal
  $('.hunt-reset').click(); let li=$$('.hunt-i')[0]; type(li.querySelector('input'),'10980'); li.querySelector('[data-c]').click(); li.querySelector('[data-c]').click();
  li.querySelector('.hunt-fb .linkbtn').click(); console.log('reveal:', li.className, li.querySelector('.hunt-fb').textContent.slice(0,50), '|', $('.hunt-score').textContent);
  li=$$('.hunt-i')[1]; type(li.querySelector('input'),'abc'); li.querySelector('[data-c]').click(); console.log('non-number:', li.querySelector('.hunt-fb').textContent.slice(0,30));
  // Invacare walk-through
  BW.go('m21',ix('invacare'));
  for(let y=0;y<4;y++){ $$('.ivc-q .opt')[1].click(); const nb=$('.ivc-q .quiz-why .btn'); nb.click(); }
  console.log('invacare end:', !!$('.ivc-end'), $('.ivc-end .w-hint').textContent.slice(0,22), '| future cells hidden at start?');
  $('[data-restart]').click(); console.log('restart -> fut cells', $$('.ivc-t td.fut').length, 'disabled chips', $$('.ivc-years .chip:disabled').length);
  // compare
  BW.go('m21',ix('compare')); const C=['-2.8','83','13.2']; $$('.hunt-i').forEach((r,i)=>{ type(r.querySelector('input'),C[i]); r.querySelector('button').click(); });
  console.log('compare ok', $$('.hunt-i.is-ok').length);
  const r0=$$('.hunt-i')[0]; 
  // apply download
  BW.go('m21',ix('apply')); $('.tmpl button').click(); await sleep(50); console.log('download', saved[0]&&saved[0].filename, saved[0]&&saved[0].data.size);
  // glossary has new terms
  console.log('gloss:', ['Organic growth','Key audit matters','Chapter 11'].map(t=>!!BW.gloss.find(t)).join(','));
  BW.go('kit',3); console.log('kit templates', $$('.tmpl').length);
  console.log(errs.length?'ERRORS '+errs.join('\n'):'no errors'); process.exit(0); })();
