/* Learning design: starting diagnostic, spaced warm-ups, Pack C commentary exercise, final assessment. */
(function(){
const S=BW.state, save=BW.save;
const E=(tag,cls,html)=>{ const e=document.createElement(tag); if(cls) e.className=cls; if(html!=null) e.innerHTML=html; return e; };
const optsOf=b=>b.opts.map(o=>typeof o==='string'?{text:o}:o);
const MODS=BW.ORDER.filter(id=>id!=='cap'&&!BW.isOptional(id));  /* the core course, in teaching order (the optional multinational track is excluded) */
const mnum=id=>BW.modNo(id);              /* the number the learner sees */
const pos=id=>BW.ORDER.indexOf(id);
const plain=h=>String(h).replace(/<[^>]+>/g,'');

/* one multiple-choice question with instant feedback; returns the element */
function mcq(q,{onAnswer,reveal=true,chosen}={}){
  const box=E('div','quiz'); const opts=optsOf(q);
  box.innerHTML=`<div class="quiz-q"><span class="quiz-tag">${q.tag||'Question'}</span><p>${q.q}</p></div><div class="quiz-opts"></div><div class="quiz-why" hidden></div>`;
  const oe=box.querySelector('.quiz-opts'), why=box.querySelector('.quiz-why'); const btns=[];
  const show=c=>{ const right=c===q.a; btns.forEach((bt,j)=>{ bt.disabled=true; if(reveal){ bt.classList.toggle('is-right',j===q.a); bt.classList.toggle('is-wrong',j===c&&!right); bt.classList.toggle('is-dim',j!==q.a&&j!==c); } else { bt.classList.toggle('is-picked',j===c); bt.classList.toggle('is-dim',j!==c); } });
    if(reveal){ why.hidden=false; why.innerHTML=`<p><strong>${right?'Correct.':'Not quite.'}</strong> ${opts[c].why?opts[c].why+' ':''}${q.why||''}</p>`; } };
  opts.forEach((o,j)=>{ const bt=E('button','opt',`<span class="ol">${'ABCDEF'[j]}</span><span>${o.text}</span>`); bt.type='button'; bt.onclick=()=>{ show(j); if(onAnswer) onAnswer(j,why); }; oe.appendChild(bt); btns.push(bt); });
  if(chosen!=null) show(chosen);
  box._why=why; box._btns=btns; box._unlock=()=>{ btns.forEach(bt=>{ bt.disabled=false; bt.className='opt'; }); why.hidden=true; };
  return box;
}

/* ================= Spaced-review warm-up ================= */
function quizPool(upto){
  const pool=[];
  MODS.filter(id=>pos(id)<upto).forEach(id=>{ const m=BW.mods[id]; if(!m) return;
    const visited=Object.keys(S.visited).some(k=>k.startsWith(id+'.'));
    if(!visited) return;
    m.sections.forEach((sec,si)=>{ const ki=BW.keyIdx(sec); sec.blocks.forEach((b,i)=>{ if(b&&b.t==='quiz'){ const key=`${id}.${sec.id}.${ki[i]}`; const ans=S.quiz[key]; pool.push({b,id,si,key,w:ans===undefined?2:ans!==b.a?4:1}); } }); });
  });
  return pool;
}
function seeded(seed){ let x=seed%2147483647; if(x<=0) x+=2147483646; return ()=>(x=x*16807%2147483647)/2147483647; }
BW.warmup=function(m){
  if(!/^m\d+$/.test(m.id)||pos(m.id)<2) return null;
  const pool=quizPool(pos(m.id)); if(pool.length<2) return null;
  const day=Math.floor(Date.now()/864e5); const rnd=seeded(day*31+mnum(m.id)*977);
  const pick=[]; const tmp=pool.slice();
  while(pick.length<2&&tmp.length){ const tot=tmp.reduce((t,p)=>t+p.w,0); let r=rnd()*tot, k=0; while(r>tmp[k].w){ r-=tmp[k].w; k++; } pick.push(tmp.splice(k,1)[0]); }
  const wrap=E('div','warm');
  wrap.innerHTML=`<div class="warm-h"><span class="warm-tag">Warm-up</span><strong>Two questions from earlier modules</strong><button type="button" class="linkbtn warm-x">Hide</button></div><p class="small" style="margin:2px 0 10px;color:var(--muted)">Recalling what you learned a few weeks ago is what makes it stick. Questions you got wrong before come up more often.</p>`;
  const list=E('div','warm-list'); wrap.appendChild(list);
  pick.forEach(p=>{ const mod=BW.mods[p.id];
    const el=mcq({q:p.b.q,opts:p.b.opts,a:p.b.a,why:p.b.why,tag:`From Module ${mnum(p.id)}`},{onAnswer:(j,why)=>{
      S.warm=S.warm||{n:0,r:0}; S.warm.n++; if(j===p.b.a) S.warm.r++; save();
      const lk=E('button','linkbtn',`Revisit Module ${mnum(p.id)}: ${mod.sections[p.si].label}`); lk.type='button'; lk.onclick=()=>BW.go(p.id,p.si,{jump:true}); why.appendChild(lk); }});
    list.appendChild(el); });
  wrap.querySelector('.warm-x').onclick=()=>{ wrap.remove(); };
  return wrap;
};

/* ================= Starting diagnostic (home page) ================= */
const DIAG=[
 {p:1,q:'A customer pays a $5,000 invoice for goods delivered last month. What happens to this month\'s profit?',opts:['It rises by $5,000','Nothing: the sale was counted last month, when the goods were delivered','It falls by $5,000','It depends on the tax rate'],a:1},
 {p:1,q:'Which report shows what the business owns and owes on one date?',opts:['Income statement','Balance sheet','Cash flow statement','Sales report'],a:1},
 {p:2,q:'What does the "full cost" of a mattress include?',opts:['Only the materials','Materials and direct labour','Materials, direct labour and a share of factory overhead','The selling price minus the margin'],a:2},
 {p:2,q:'The factory makes more mattresses than it sells this month. What usually happens to reported profit?',opts:['It rises, because part of the fixed overhead moves into stock','It falls','No change','It doubles'],a:0},
 {p:3,q:'What belongs on page one of a good monthly pack?',opts:['The full trial balance','A few KPIs against target, with a short commentary on what needs action','Every invoice issued','Last year\'s audited accounts'],a:1},
 {p:3,q:'Days sales outstanding (DSO) measures…',opts:['How long stock sits in the warehouse','How many days, on average, customers take to pay','How fast we pay suppliers','Days until the next sales order'],a:1},
 {p:4,q:'Fixed costs are $300,000 a year and the contribution margin is 40%. What are break-even sales?',opts:['$120,000','$420,000','$750,000','$1,200,000'],a:2},
 {p:4,q:'A $60,000 machine saves $22,000 a year for eight years. What is the best test of whether to buy it?',opts:['Is the payback under five years?','Is the NPV positive at our cost of capital, even if savings come in lower?','Does the supplier offer a discount?','Is there cash in the bank today?'],a:1},
 {p:5,q:'Profit is up this year but cash is down. What is the most likely reason?',opts:['A bookkeeping error','Receivables and inventory grew faster than profit','Tax rates went up','Depreciation rose'],a:1},
 {p:5,q:'Why do exporters often have VAT refunds to claim?',opts:['Exports are zero-rated, but VAT is paid on local purchases','Exporters pay double VAT','Foreign customers pay our VAT','VAT doesn\'t apply to manufacturers'],a:0}
];
const PARTN=[null,{n:'Foundations',m:'m1'},{n:'Factory costs',m:'m6'},{n:'Reports',m:'m9'},{n:'Decisions',m:'m12'},{n:'Cash, risk and control',m:'m16'}];
BW.homeDiag=function(){
  const sec=E('section','diag'); sec.style.marginTop='30px';
  const draw=()=>{ const d=S.diag;
    if(d&&d.done){
      const per=[1,2,3,4,5].map(p=>DIAG.map((q,i)=>({q,i})).filter(x=>x.q.p===p).reduce((t,x)=>t+(d.a[x.i]===x.q.a?1:0),0));
      const first=per.findIndex(x=>x<2); const startM=first<0?null:PARTN[first+1].m;
      sec.innerHTML=`<h2 style="margin-bottom:6px">Your starting point</h2><p class="prose" style="margin:0 0 12px">From your quick check: ${per.reduce((a,b)=>a+b,0)} of 10 right. ${first<0?'You have a solid base across the course. Work through it at your own pace, and spend most time on the case files and practice packs.':`Start with Part ${first+1}. Parts marked "Skim" can go faster.`}</p>
        <div class="diag-g">${per.map((v,i)=>`<div class="diag-p ${v===2?'ok':v===1?'mid':'low'}"><span class="eyebrow">Part ${i+1}</span><strong>${PARTN[i+1].n}</strong><span>${v===2?'Skim: you know the basics':v===1?'Work through it':'Take this part slowly'}</span></div>`).join('')}</div>
        <div class="row" style="margin-top:12px;gap:10px;display:flex;flex-wrap:wrap">${startM?`<button type="button" class="btn small" data-start>Start at Module ${mnum(startM)}</button>`:''}<button type="button" class="btn ghost small" data-redo>Take the check again</button></div>`;
      const st=sec.querySelector('[data-start]'); if(st) st.onclick=()=>BW.go(startM,0);
      sec.querySelector('[data-redo]').onclick=()=>{ S.diag={a:{},done:false,open:true}; save(); draw(); };
      return;
    }
    const open=d&&d.open;
    sec.innerHTML=`<h2 style="margin-bottom:6px">Where should you start?</h2><p class="prose" style="margin:0 0 12px">Ten quick questions, two for each part of the course. About three minutes. You'll see which parts you can skim and where to slow down. Nothing is graded.</p>`;
    if(!open){ const b=E('button','btn small','Take the 3-minute check'); b.type='button'; b.onclick=()=>{ S.diag={a:{},done:false,open:true}; save(); draw(); }; sec.appendChild(b); return; }
    const a=d.a||{}; const list=E('div','diag-q'); sec.appendChild(list);
    const done=E('button','btn small','See my starting point'); done.type='button'; done.style.marginTop='12px';
    const upd=()=>{ const n=Object.keys(a).length; done.disabled=n<DIAG.length; done.textContent=n<DIAG.length?`See my starting point (${n} of ${DIAG.length} answered)`:'See my starting point'; };
    DIAG.forEach((q,i)=>{ const el=mcq(Object.assign({tag:`${i+1} of 10 · Part ${q.p}`},q),{reveal:false,chosen:a[i],onAnswer:j=>{ a[i]=j; S.diag.a=a; save(); upd(); }});
      const ch=E('button','linkbtn small','Change answer'); ch.type='button'; ch.style.marginTop='6px'; ch.onclick=()=>{ delete a[i]; save(); el._unlock(); upd(); }; el.appendChild(ch); list.appendChild(el); });
    done.onclick=()=>{ S.diag.done=true; S.diag.open=false; save(); draw(); sec.scrollIntoView&&sec.scrollIntoView({block:'start'}); };
    sec.appendChild(done); upd();
  };
  draw(); return sec;
};

/* ================= Pack C: write the commentary ================= */
const CHK=[
 ['Opens with cash, not sales',t=>/cash|liquidity|headroom/.test(t.split(/[.!?]/)[0]||'')],
 ['Says how big the shortfall is and when it hits (weeks 2 and 4, down to about −$12k)',t=>/week\s*(2|4|two|four)|12\s?k|12,000|below zero|negative/.test(t)],
 ['Explains why profit didn\'t become cash: receivables and inventory up',t=>/(receivable|debtor|customers owe)/.test(t)&&/(inventory|stock|foam)/.test(t)],
 ['Names the problem customers: US distributor B and the Saudi letter of credit',t=>/(distributor b|\bb\b owes|saudi|letter of credit|\blc\b)/.test(t)],
 ['Proposes talking to the bank before the crunch',t=>/bank|overdraft/.test(t)],
 ['Gives actions with an owner and a date',t=>/(by (mon|tue|wed|thu|fri|the|end|\d)|this week|tomorrow|owner|will )/.test(t)],
 ['Makes a call on the NGO order',t=>/ngo|kenya|sling/.test(t)],
 ['Explains the margin slip: overtime, scrap, air freight',t=>/overtime|scrap|air|margin/.test(t)]
];
const MODEL=`<p><strong>Cash, not sales, is this month's story.</strong> Sales hit a record $128.0k and profit before tax was $12.9k, on budget. But our 13-week forecast shows liquidity below zero in week 2 (−$6k) and week 4 (−$12k), when payroll, the foam supplier and quarterly tax fall due. Without action, we cannot meet the week 4 payroll.</p>
<p><strong>Why.</strong> Since January we made $34.7k profit after tax, but operations used $36.5k of cash. Receivables are up $72k (77 days against a 60-day target), mainly US distributor A's $88k on 90-day CIF terms. Inventory is up $46k, including $38k of bulk-bought foam. US distributor B owes $45k, of which $30k is overdue and $10k is over 90 days.</p>
<p><strong>Actions this week.</strong> (1) GM meets the bank by Friday with this forecast to ask for a temporary $45k overdraft increase until October. (2) Finance resubmits the Saudi letter of credit documents by Wednesday to release $18k. (3) Sales calls US distributor B's owner; no more shipments until a payment plan is agreed, and we consider a provision. (4) Purchasing agrees a later payment date for the foam invoice. (5) We decline the NGO order for September, or offer October delivery with a 30% deposit.</p>
<p><strong>Margin.</strong> Gross margin was 29.6% against a 30.9% budget: $2.9k of overtime, scrap at 4.6% and one air shipment. Year to date it's 28.3% against 29.5%.</p>
<p><strong>From now on.</strong> No new long-payment-term deals without finance sign-off and a cash check.</p>`;
const pc=BW.packs.packC;
if(pc&&!pc.sections.some(s=>s.id==='write')) pc.sections.push({id:'write',label:'Write the commentary',kind:'play',title:'Rewrite the commentary yourself',blocks:[
  `<p>The July commentary called the cash position "temporary". Write the commentary this pack should have had, as if you were the finance manager writing to the GM and the owner. Aim for 150 to 250 words. Use the figures on the earlier pages.</p>`,
  {t:'callout',tone:'tip',title:'A good commentary',html:`<ul><li>Starts with the most important message, not the best news.</li><li>Uses numbers: how much, when, against what target.</li><li>Explains <em>why</em>, not just <em>what</em>.</li><li>Ends with actions, owners and dates.</li></ul><p>Module 9 has more on writing commentary.</p>`},
  {t:'live',render(box){
    const st=S.commC=S.commC||{text:'',checked:{},shown:false};
    box.innerHTML=`<label class="small" for="commC" style="color:var(--muted)">Your commentary for July (saved in this browser as you type)</label><textarea id="commC" class="cm-ta" rows="12" placeholder="Start with the most important message…"></textarea><div class="cm-bar"><span class="cm-wc small"></span><button type="button" class="btn small cm-check">Check my draft</button></div><div class="cm-out"></div>`;
    const ta=box.querySelector('textarea'), wc=box.querySelector('.cm-wc'), out=box.querySelector('.cm-out');
    ta.value=st.text||'';
    const words=()=>{ const n=(ta.value.trim().match(/\S+/g)||[]).length; wc.textContent=`${n} words`+(n?n<150?' · a little short':n>250?' · try trimming':' · good length':''); wc.style.color=n&&(n<150||n>250)?'var(--amber)':'var(--muted)'; };
    let tmr; ta.addEventListener('input',()=>{ words(); clearTimeout(tmr); tmr=setTimeout(()=>{ st.text=ta.value; save(); },400); });
    const check=()=>{ st.text=ta.value; st.shown=true; save(); const t=ta.value.toLowerCase();
      const rows=CHK.map((c,i)=>{ const auto=c[1](t); const on=st.checked[i]!==undefined?st.checked[i]:auto; return `<label class="cm-row"><input type="checkbox" data-i="${i}" ${on?'checked':''}><span>${c[0]}</span>${auto?'<em class="cm-auto">found in your draft</em>':''}</label>`; }).join('');
      out.innerHTML=`<div class="cm-list"><h4>Check your draft against these eight points</h4><p class="small" style="color:var(--muted);margin:0 0 6px">Ticks marked "found in your draft" are a quick guess from the words you used. Untick or tick each one honestly.</p>${rows}<div class="cm-score"></div></div><details class="cm-model"><summary>Show a model commentary</summary><div class="prose">${MODEL}</div></details>`;
      const score=()=>{ const n=out.querySelectorAll('input:checked').length; out.querySelector('.cm-score').innerHTML=`<div class="msg ${n>=7?'good':n>=5?'warn':'bad'}"><strong>${n} of 8.</strong> ${n>=7?'A commentary a GM could act on today.':n>=5?'Good start. Add what\'s missing, then compare with the model.':'Read the model below, then try again. Lead with cash and end with actions.'}</div>`; };
      out.querySelectorAll('input').forEach(cb=>cb.onchange=()=>{ st.checked[cb.dataset.i]=cb.checked; save(); score(); });
      score(); };
    box.querySelector('.cm-check').onclick=()=>{ st.checked={}; check(); };
    words(); if(st.shown&&st.text) check();
  }}
]});

/* ================= Final assessment (capstone) ================= */
const FINAL=[
 {q:'BraceWorks made a profit of $60,000 this year, but cash fell by $20,000. Which is the most likely explanation?',opts:['The accountant made an error','Receivables and inventory grew, and a machine was bought','Profit was overstated by depreciation','Tax was paid twice'],a:1,why:'Profit and cash part ways through working capital and investment (Modules 1 and 5).',m:'m5'},
 {q:'A distributor pays a $10,000 invoice. Which entry records it?',opts:['Debit sales, credit cash','Debit cash, credit receivables','Debit receivables, credit cash','Debit cash, credit sales'],a:1,why:'Cash goes up (debit) and the amount owed falls (credit). The sale was recorded when the goods were invoiced (Module 2).',m:'m2'},
 {q:'Revenue is $110,000 and cost of goods sold is $78,100. What is the gross margin?',opts:['29.0%','71.0%','32.1%','22.0%'],a:0,why:'($110,000 − $78,100) ÷ $110,000 = 29.0% (Module 3).',m:'m3'},
 {q:'Current assets are $520,000, of which $300,000 is inventory. Current liabilities are $300,000. What is the quick ratio?',opts:['1.73','0.73','1.00','0.58'],a:1,why:'($520,000 − $300,000) ÷ $300,000 = 0.73. Without selling stock, BraceWorks can\'t cover its short-term bills (Module 4).',m:'m4'},
 {q:'Overhead is spread by direct labour hours, but braces use far more machine time than slings. What is the risk?',opts:['None, as long as total overhead is right','Braces look cheaper than they are, and slings look dearer, so pricing decisions go wrong','Tax goes up','The balance sheet won\'t balance'],a:1,why:'A poor overhead driver moves cost between products (Module 6).',m:'m6'},
 {q:'In a quiet sales month the factory kept producing, so finished goods rose by 400 units. Why might profit look better than it is?',opts:['Because sales rose','Because part of the fixed overhead went into stock rather than the income statement','Because scrap fell','Because depreciation stopped'],a:1,why:'Absorption costing can flatter profit when production runs ahead of sales (Module 7).',m:'m7'},
 {q:'The foam usage variance is $4,000 adverse while the foam price variance is zero. Where do you look first?',opts:['The purchasing manager\'s negotiations','Scrap, cutting waste and foam quality on the factory floor','The sales team','Exchange rates'],a:1,why:'Usage variances come from how much was used, not what it cost (Module 8).',m:'m8'},
 {q:'Fixed costs are $360,000 and the contribution margin is 45%. What are break-even sales?',opts:['$162,000','$800,000','$522,000','$1,000,000'],a:1,why:'$360,000 ÷ 0.45 = $800,000 (Module 12).',m:'m12'},
 {q:'With spare capacity, a one-off export order is offered at $96 per mattress. Variable cost is $88 and full cost is $118. What should you do?',opts:['Reject it: it\'s below full cost','Accept it if it won\'t undercut your normal prices, because it adds $8 a unit of contribution','Accept any price above zero','Reject it: margins must always be 30%'],a:1,why:'With idle capacity, fixed costs don\'t change, so anything above variable cost adds profit, as long as normal prices aren\'t harmed (Module 13).',m:'m13'},
 {q:'Project A pays back in 2 years but has a negative NPV. Project B pays back in 4 years with an NPV of +$40,000. Which creates more value?',opts:['Project A, because it pays back faster','Project B, because it earns more than the cost of capital over its life','Neither','Both equally'],a:1,why:'Payback ignores what happens after it, and ignores the cost of money. NPV doesn\'t (Module 14).',m:'m14'},
 {q:'DSO is 70 days, inventory days are 100 and payable days are 45. What is the cash conversion cycle?',opts:['215 days','125 days','25 days','170 days'],a:1,why:'70 + 100 − 45 = 125 days between paying for materials and being paid by customers (Module 16).',m:'m16'},
 {q:'A new customer in a new country wants 90-day open-account terms on a $90,000 first order. What is the safest sensible response?',opts:['Accept: big orders are good','Ask for a letter of credit, a deposit, or credit insurance cover first','Refuse all export credit','Ship by air to be paid faster'],a:1,why:'Match the payment method to the risk (Module 17).',m:'m17'},
 {q:'An email asks you to change a supplier\'s bank details before Friday\'s payment run. What should happen?',opts:['Change them: it came from the supplier\'s address','Call the supplier on a number you already hold, and have a second person approve the change','Pay half to the old account and half to the new one','Ask the sender to confirm by email'],a:1,why:'Call-back checks and segregation of duties stop most payment fraud (Module 18).',m:'m18'},
 {q:'Your accounting profit is $100,000, but the tax bill is based on $112,000. What is the most likely reason?',opts:['A mistake by the tax office','Some costs, such as entertainment or certain provisions, aren\'t deductible for tax','The tax rate went up','Revenue was counted twice'],a:1,why:'Taxable profit differs from accounting profit because of tax rules on deductions and timing (Module 19).',m:'m19'},
 {q:'Net debt is $300,000 and EBITDA is $120,000. The covenant limit is 2.5×. Can BraceWorks borrow another $100,000 for a machine?',opts:['Yes, there\'s plenty of room','Not without breaching the covenant unless EBITDA grows: it\'s already at 2.5×','Covenants don\'t apply to equipment loans','Only if it\'s paid in cash'],a:1,why:'$300,000 ÷ $120,000 = 2.5×, already at the limit. Talk to the bank first, or use a lease or equity (Modules 17 and 20).',m:'m20'}
];
const PASS=12;
function recordHTML(r){
  const d=new Date(r.date); const ds=d.toLocaleDateString(undefined,{year:'numeric',month:'long',day:'numeric'});
  return `<!doctype html><html><head><meta charset="utf-8"><title>Completion record</title><style>body{font-family:Georgia,serif;max-width:720px;margin:40px auto;padding:0 24px;color:#16232A}h1{font-size:30px;margin:0}h2{font-weight:normal;color:#55666B;margin:4px 0 28px}table{border-collapse:collapse;width:100%;margin:20px 0}td{border-bottom:1px solid #D3DCD7;padding:8px 4px}td:last-child{text-align:right;font-family:monospace}.box{border:2px solid #0C6A61;padding:28px 32px;border-radius:8px}.small{font-size:13px;color:#55666B}</style></head><body><div class="box"><p class="small">THE GM'S LEDGER · BRACEWORKS MEDICAL EDITION</p><h1>Completion record</h1><h2>Accounting and finance for general managers</h2><p>This records that <strong>${(r.name||'the learner').replace(/[<>&]/g,'')}</strong> completed the final assessment on ${ds}.</p><table><tr><td>Final assessment score</td><td>${r.score} / ${FINAL.length}</td></tr><tr><td>Course sections opened</td><td>${r.secs}</td></tr><tr><td>Module quiz answers correct</td><td>${r.quiz}</td></tr><tr><td>Practice packs graded</td><td>${r.packs} / 4</td></tr><tr><td>Year-long simulation, best decisions</td><td>${r.sim}</td></tr></table><p class="small">Covers the three statements, bookkeeping, product costing, inventory, variances, management reporting, KPIs, pricing and decisions, investment appraisal, budgeting, working capital, export finance, controls and audit, tax for exporters, and funding and value. A self-study course record; not an accredited qualification.</p></div></body></html>`;
}
function courseStats(){
  let n=0,r=0,secs=0,done=0;
  MODS.forEach(id=>{ const m=BW.mods[id]; if(!m) return; m.sections.forEach(sec=>{ secs++; if(S.visited[id+'.'+sec.id]) done++; const ki=BW.keyIdx(sec); sec.blocks.forEach((b,i)=>{ if(b&&b.t==='quiz'){ n++; if(S.quiz[`${id}.${sec.id}.${ki[i]}`]===b.a) r++; } }); }); });
  const packs=['A','B','C','D'].filter(x=>S.sc2&&S.sc2[x]&&Object.keys(S.sc2[x]).length>=20).length;
  return {secs:`${done} / ${secs}`,quiz:`${r} / ${n}`,packs,sim:S.simDone?`${S.simBest||0} / 8`:'not played yet'};
}
const cap=BW.mods.cap;
if(cap&&!cap.sections.some(s=>s.id==='final')){
  const gi=cap.sections.findIndex(s=>s.id==='grad');
  cap.sections.splice(gi<0?cap.sections.length:gi,0,{id:'final',label:'Final assessment',kind:'quiz',title:'Final assessment',blocks:[
    `<p>Fifteen questions, one from each of the main modules, written as situations a GM actually meets. Answer them all, then mark the assessment. Score ${PASS} or more (80%) to get your completion record. You can retake it as often as you like; your best score is kept.</p>`,
    {t:'live',render(box){
      const F=S.final=S.final||{a:{},marked:false,best:0};
      const draw=()=>{
        box.innerHTML='';
        const list=E('div','fa-list'); box.appendChild(list);
        const btns=[];
        FINAL.forEach((q,i)=>{
          const el=mcq(Object.assign({tag:`Question ${i+1} of ${FINAL.length} · Module ${mnum(q.m)}`},q),{reveal:F.marked,chosen:F.a[i],onAnswer:j=>{ F.a[i]=j; save(); upd(); }});
          if(F.marked&&F.a[i]!==q.a){ const lk=E('button','linkbtn',`Revisit Module ${mnum(q.m)}`); lk.type='button'; lk.onclick=()=>BW.go(q.m,0,{jump:true}); el._why.appendChild(lk); }
          if(!F.marked){ const ch=E('button','linkbtn small','Change answer'); ch.type='button'; ch.style.marginTop='6px'; ch.onclick=()=>{ delete F.a[i]; save(); el._unlock(); upd(); }; el.appendChild(ch); }
          list.appendChild(el);
        });
        const foot=E('div','fa-foot'); box.appendChild(foot);
        const upd=()=>{ if(F.marked) return; const n=Object.keys(F.a).length; foot.innerHTML=''; const b=E('button','btn',n<FINAL.length?`Mark my assessment (${n} of ${FINAL.length} answered)`:'Mark my assessment'); b.type='button'; b.disabled=n<FINAL.length;
          b.onclick=()=>{ F.marked=true; const sc=FINAL.reduce((t,q,i)=>t+(F.a[i]===q.a?1:0),0); F.score=sc; if(sc>=F.best){ F.best=sc; } if(sc>=PASS&&!F.passDate) F.passDate=new Date().toISOString(); save(); draw(); box.scrollIntoView&&box.scrollIntoView({block:'start'}); };
          foot.appendChild(b); };
        if(!F.marked){ upd(); return; }
        const sc=F.score, pass=sc>=PASS;
        const res=E('div','fa-res'); res.innerHTML=`<div class="msg ${pass?'good':sc>=9?'warn':'bad'}"><strong>You scored ${sc} of ${FINAL.length}.</strong> ${pass?'Well done: you passed. Your completion record is below.':`You need ${PASS} to pass. The explanations below show which module to revisit for each one you missed.`}${F.best>sc?` Your best score so far is ${F.best}.`:''}</div>`;
        box.insertBefore(res,list);
        const again=E('button','btn ghost small','Retake the assessment'); again.type='button'; again.onclick=()=>{ F.a={}; F.marked=false; save(); draw(); };
        foot.appendChild(again);
        if(F.best>=PASS){
          const st=courseStats(); const rec=E('div','fa-rec');
          const date=F.passDate||new Date().toISOString();
          rec.innerHTML=`<div class="fa-cert"><div class="eyebrow">Completion record</div><h3>The GM's Ledger: accounting and finance for general managers</h3><label class="small" for="faName" style="color:var(--muted)">Name for your record</label><input id="faName" class="search" type="text" autocomplete="name" placeholder="Your name"><div class="fa-g"><div><span>Completed</span><strong>${new Date(date).toLocaleDateString(undefined,{year:'numeric',month:'short',day:'numeric'})}</strong></div><div><span>Best final score</span><strong>${F.best} / ${FINAL.length}</strong></div><div><span>Sections opened</span><strong>${st.secs}</strong></div><div><span>Quiz answers correct</span><strong>${st.quiz}</strong></div><div><span>Packs graded</span><strong>${st.packs} / 4</strong></div><div><span>Simulation</span><strong>${st.sim}</strong></div></div><div class="tmpl-a"><button type="button" class="btn small" data-rec>Download the record</button><span class="small fa-s" role="status" aria-live="polite" style="color:var(--muted)"></span></div></div>`;
          box.appendChild(rec);
          const nm=rec.querySelector('#faName'); nm.value=F.name||''; nm.addEventListener('input',()=>{ F.name=nm.value.slice(0,80); save(); });
          rec.querySelector('[data-rec]').onclick=()=>{ const r=Object.assign({name:F.name,date,score:F.best},st); BW.saveFile('gms-ledger-completion-record.html',recordHTML(r),t=>{ rec.querySelector('.fa-s').textContent=t; }); };
        }
      };
      draw();
    }}
  ]});
}
})();
