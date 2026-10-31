const {JSDOM, VirtualConsole} = require('/tmp/claude-0/jt/node_modules/jsdom');
const fs=require('fs'); const html=fs.readFileSync('/home/claude/course/dist/gm-ledger.html','utf8');
const errs=[]; const vc=new VirtualConsole(); vc.on('jsdomError',e=>{ if(!/scrollTo|scrollIntoView/.test(e.message)) errs.push(e.message); });
const saved=[];
const d=new JSDOM(html,{runScripts:'dangerously',pretendToBeVisual:true,virtualConsole:vc,beforeParse(w){ w.claude={use:async n=>n==='downloads'?{save:async r=>{ saved.push(r); return {status:'saved'}; }}:null}; w.Element.prototype.scrollIntoView=function(){}; }});
const w=d.window; const sleep=ms=>new Promise(r=>setTimeout(r,ms)); const $=s=>w.document.querySelector(s), $$=s=>[...w.document.querySelectorAll(s)];
(async()=>{ await sleep(300); const BW=w.BW;
  // diagnostic
  BW.go('home'); $('.diag .btn').click();
  let qs=$$('.diag .quiz'); console.log('diag questions',qs.length);
  qs.forEach((q,i)=>{ const o=q.querySelectorAll('.opt'); o[i<4?[1,1,2,0][i]:0].click(); });
  console.log('diag btn', $('.diag > .btn').textContent, $('.diag > .btn').disabled); $('.diag > .btn').click();
  console.log('diag result:', $('.diag p').textContent.slice(0,120), '|', $$('.diag-p').map(x=>x.className.split(' ')[1]).join(','), '|', $('[data-start]')?.textContent);
  // warm-up: visit m1, m2 then open m5
  BW.go('m1',0); BW.go('m2',0); BW.go('m5',0);
  console.log('warm-up in m5:', !!$('.warm'), $$('.warm .quiz-tag').map(x=>x.textContent).join(','));
  $$('.warm .quiz')[0].querySelector('.opt').click(); console.log('warm feedback:', $('.warm .quiz-why').textContent.slice(0,90));
  BW.go('m5',1); console.log('warm on sec 2?', !!$('.warm'));
  // Pack C write
  const pc=BW.packs.packC; const wi=pc.sections.findIndex(s=>s.id==='write'); BW.go('packC',wi);
  const ta=$('#commC'); ta.value='Cash is the urgent issue this month. Liquidity goes negative in week 4 (-$12k) when payroll and foam fall due. Receivables up $72k and inventory up $46k absorbed the profit. US distributor B owes $45k overdue and the Saudi letter of credit is stuck. GM will meet the bank by Friday for a temporary overdraft increase. We decline the NGO order. Margin slipped on overtime and scrap.';
  ta.dispatchEvent(new w.Event('input')); $('.cm-check').click(); await sleep(450);
  console.log('commentary score:', $('.cm-score').textContent.slice(0,40), 'saved?', BW.state.commC.text.length>50, 'model:', !!$('.cm-model'));
  // simulation best path
  const ci=BW.mods.cap.sections.findIndex(s=>s.id==='sim'); BW.go('cap',ci);
  const best=[1,1,1,1,1,2,1,1];
  for(const b of best){ $$('[data-opts] .opt')[b].click(); }
  const stats=$$('#main .stat').filter(x=>!x.closest('.qres')).slice(-4).map(x=>x.textContent.replace(/\s+/g,' ').trim());
  console.log('sim:', $('.msg')?.textContent.slice(0,40), '| qres', $$('.qres').length, '| bars', $$('.qc').length, '\n  ', stats.join(' || '));
  console.log('  quarter results:', $$('.qres').map(x=>x.textContent.replace(/\s+/g,' ').replace('Quarter','\n   Q')).join(''));
  // worst path
  $('[data-replay]').click(); for(const b of [0,0,0,2,2,0,0,0]){ $$('[data-opts] .opt')[b].click(); } console.log('worst:', $('.msg').textContent.slice(0,70), '| neg bars', $$('.qc-bar.neg').length);
  // final assessment
  const fi=BW.mods.cap.sections.findIndex(s=>s.id==='final'); BW.go('cap',fi);
  const fq=$$('.fa-list .quiz'); console.log('final qs', fq.length, 'cap tabs', BW.mods.cap.sections.map(s=>s.id).join(','));
  fq.forEach((q,i)=>q.querySelectorAll('.opt')[i===0?0:1].click());
  $('.fa-foot .btn').click(); console.log('final:', $('.fa-res').textContent.slice(0,60));
  $('#faName').value='Test GM'; $('#faName').dispatchEvent(new w.Event('input')); $('[data-rec]').click(); await sleep(50);
  console.log('record saved', saved[0]&&saved[0].filename, /Test GM/.test(saved[0]&&saved[0].data), /14 \/ 15/.test(saved[0]&&saved[0].data));
  BW.go('cap',BW.mods.cap.sections.findIndex(s=>s.id==='grad')); console.log('grad stats:', $$('#main .stat').map(x=>x.textContent.replace(/\s+/g,' ').trim()).join(' || '));
  console.log(errs.length?'ERRORS '+errs.join('\n'):'no errors'); process.exit(0); })();
