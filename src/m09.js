/* ===== Module 9: A good monthly pack ===== */
(function(){
const {K,TIP,FLAG,CASE,REPORT,Q,FS,FLIP,SORT,CHECK,W,PACK,money,signed,pct,kfmt} = BW.h;

const GROUPS=[
  {g:'Timely and reliable', items:[
    'Arrives within 10 working days of month-end',
    'Bank accounts, receivables and payables are reconciled before it\'s issued',
    'Numbers don\'t change after the pack is issued',
    'Accruals and prepayments are booked every month'
  ]},
  {g:'Complete', items:[
    'Includes the P&L, balance sheet and cash flow',
    'Shows gross margin by product line',
    'Includes receivables and inventory aging',
    'Includes a forward cash forecast with headroom'
  ]},
  {g:'Comparative', items:[
    'Compares with budget',
    'Compares with the same period last year',
    'Shows a 12-month trend for key lines',
    'Shows each P&L line as a % of revenue'
  ]},
  {g:'Insightful', items:[
    'Starts with a one-page summary or dashboard',
    'Commentary explains why things moved, not just what moved',
    'Lists actions with owners and dates',
    'Shows one-off items separately'
  ]},
  {g:'Connected to operations', items:[
    'Includes production volume and efficiency measures',
    'Shows the cost of scrap, rework and returns',
    'Shows orders received and the order backlog',
    'Uses the same format every month'
  ]}
];

BW.add({
  id:'m9', minutes:40,
  title:'A good monthly pack',
  subtitle:'What a decent management report contains, the signs of a weak one, and a scorecard to grade the one you get today.',
  goals:[
    'Describe what a useful monthly management pack contains, section by section',
    'Tell helpful commentary from commentary that just repeats the numbers',
    'Grade your own pack and pick the first three improvements',
    'Understand why reported numbers sometimes change after they\'re issued'
  ],
  sections:[
  {id:'purpose', label:'What it\'s for', kind:'learn', title:'A pack is for decisions, not decoration', blocks:[
    `<p>Your accountant prepares statutory accounts for the tax office and the auditors once a year. The <span class="term">monthly management pack</span> is different. It exists for one reason: to help you and the owners run the business. If it doesn't change what you do, it isn't working.</p>
     <p>Many small companies get a pack that's technically correct but useless: a P&amp;L printout from the accounting system, three weeks late, with no comparison and no explanation. You've probably seen one.</p>`,
    `<h3>Eight qualities of a good pack</h3>`,
    FLIP([
      {f:'Timely', b:'Arrives within 5 to 10 working days of month-end. A report about September that arrives on 25 October is history, not management.'},
      {f:'Reliable', b:'Built on reconciled accounts with a proper month-end close. Numbers don\'t change after you\'ve seen them.'},
      {f:'Comparative', b:'Every number is shown against something: budget, last year, last month. A number on its own means nothing.'},
      {f:'Explained', b:'Commentary says why things moved, what it means and what\'s being done. Written by someone who talked to operations.'},
      {f:'Focused', b:'Starts with a one-page summary. Ten to twelve KPIs, not fifty. Detail goes to the back.'},
      {f:'Connected', b:'Links money to operations: output, scrap, on-time delivery, orders. The GM can see the causes, not just the results.'},
      {f:'Forward-looking', b:'Includes a cash forecast and an updated outlook for the year. You can still change the future.'},
      {f:'Consistent', b:'Same structure, same definitions, every month. Trends are only visible if the format holds still.'}
    ])
  ]},
  {id:'structure', label:'The ideal structure', kind:'learn', title:'What goes in the pack, in order', blocks:[
    `<p>For a business BraceWorks' size, a good pack is about 10 to 15 pages. Here's the structure to ask for. The order matters: most important first.</p>`,
    {t:'tbl', head:['#','Section','What it shows','Module'], rows:[
      ['1','<strong>One-page dashboard</strong>','10–12 KPIs with targets, trend arrows and red/amber/green status','11'],
      ['2','<strong>Commentary</strong>','One page: what happened, why, what we\'re doing, outlook','9'],
      ['3','<strong>Income statement</strong>','Month and year-to-date vs budget and last year, with % of revenue','3'],
      ['4','<strong>Margin analysis</strong>','Gross margin by product line, top customers and markets','6, 10'],
      ['5','<strong>Balance sheet</strong>','Month-end vs last month and last year-end, with key ratios','4'],
      ['6','<strong>Cash</strong>','Cash flow statement, 13-week forecast, headroom','5, 10'],
      ['7','<strong>Working capital</strong>','Receivables aging, payables aging, inventory aging','7, 10, 16'],
      ['8','<strong>Operations</strong>','Output, labour efficiency, variances, scrap, rework, returns, on-time delivery','8, 10'],
      ['9','<strong>Sales pipeline</strong>','Orders received, backlog, book-to-bill, quotes outstanding','10'],
      ['10','<strong>Capital spending</strong>','Spend vs approved budget, by project','14'],
      ['11','<strong>Risks and actions log</strong>','Open issues, owners, due dates, status','9'],
      ['12','<strong>Appendix</strong>','Close checklist sign-off, reconciliation status, definitions','2']
    ]},
    TIP('Don\'t ask for everything at once',
      `<p>If your current pack is a bare P&amp;L, asking for all twelve sections next month will overwhelm your finance team and produce a rushed, unreliable report. Use the scorecard in the next section to find the biggest gaps, and fix three things a month.</p>`)
  ]},
  {id:'score', label:'Scorecard', kind:'play', title:'Grade your own monthly pack', blocks:[
    `<p>Practise on the four sample reports first. Each has an expert grading to compare with. Score each item: <strong>0</strong> = not there, <strong>1</strong> = partly, <strong>2</strong> = fully. You can also grade your own report privately; nothing is sent anywhere.</p>`,
    W('Monthly pack scorecard', function(el, ctx){
      const S=ctx.state;
      if(!S.sc2){ S.sc2={}; if(S.sc&&typeof S.sc==='object'&&Object.keys(S.sc).length){ S.sc2.own=S.sc; } }
      const TARGETS=[{v:'A',label:'Pack A · October'},{v:'B',label:'Pack B · March'},{v:'C',label:'Pack C · July'},{v:'D',label:'Pack D · November'},{v:'own',label:'My own report (private)'}];
      let target=S.scTarget&&TARGETS.some(t=>t.v===S.scTarget)?S.scTarget:'A';
      let showExpert=false;
      const head=document.createElement('div'), body=document.createElement('div'); el.append(head,body);
      head.innerHTML='<p class="w-hint" style="margin-bottom:8px">Choose what to grade:</p>';
      ctx.ui.seg(head,TARGETS,target,v=>{ target=v; S.scTarget=v; ctx.save(); showExpert=false; draw(); });
      function draw(){
        const sc=S.sc2[target]=S.sc2[target]||{};
        const pack=target!=='own'?BW.packs['pack'+target]:null;
        const expert=pack?pack.grades:null;
        body.innerHTML='';
        if(pack){ const lk=document.createElement('button'); lk.type='button'; lk.className='packlink'; lk.style.marginTop='10px'; lk.innerHTML=`<span><span class="pl-k">Practice pack ${pack.code}, ${pack.month}</span>${pack.title}</span><span class="pl-a">Open</span>`; lk.onclick=()=>BW.go(pack.id,0,{jump:true}); body.appendChild(lk); }
        else body.appendChild(Object.assign(document.createElement('p'),{className:'w-hint',textContent:'Grade the report your finance team gives you. Nothing leaves this page: your answers are stored only in this browser.'}));
        const groups=document.createElement('div'); groups.style.cssText='display:grid;gap:16px;margin-top:12px'; body.appendChild(groups);
        let idx=0;
        GROUPS.forEach((g,gi)=>{
          const box=document.createElement('div'); box.innerHTML=`<h4 style="margin-bottom:6px">${g.g}</h4>`;
          g.items.forEach((it,ii)=>{
            const key=gi+'.'+ii, ex=expert?expert[idx]:null; idx++;
            const row=document.createElement('div'); row.className='sort-item';
            row.innerHTML=`<div class="sort-text">${it}</div>`; const bb=document.createElement('div'); bb.className='seg';
            [[0,'0 · No'],[1,'1 · Partly'],[2,'2 · Yes']].forEach(([v,l])=>{ const b=document.createElement('button'); b.type='button'; b.textContent=l; b.setAttribute('aria-pressed',String(sc[key]===v));
              b.onclick=()=>{ sc[key]=v; ctx.save(); bb.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed','false')); b.setAttribute('aria-pressed','true'); result(); }; bb.appendChild(b); });
            row.appendChild(bb);
            if(showExpert&&ex!==null){ const you=sc[key]; const m=document.createElement('div'); m.className='sort-fb'; m.innerHTML=`Expert: <strong>${ex}</strong>${you===undefined?'':you===ex?' <span class="pos">· you agree</span>':` <span class="neg">· you gave ${you}</span>`}`; row.appendChild(m); }
            box.appendChild(row);
          });
          groups.appendChild(box);
        });
        const res=document.createElement('div'); res.dataset.res='1'; body.appendChild(res);
        const row=document.createElement('div'); row.className='row'; row.style.marginTop='10px';
        if(expert){ const xb=document.createElement('button'); xb.type='button'; xb.className='btn ghost small'; xb.textContent=showExpert?'Hide expert grading':'Compare with expert grading'; xb.onclick=()=>{ showExpert=!showExpert; draw(); }; row.appendChild(xb); }
        const reset=document.createElement('button'); reset.type='button'; reset.className='linkbtn'; reset.textContent='Clear these scores'; reset.onclick=()=>{ S.sc2[target]={}; ctx.save(); draw(); }; row.appendChild(reset);
        body.appendChild(row);
        result();
      }
      function result(){
        const res=body.querySelector('[data-res]'); const sc=S.sc2[target]||{}; const pack=target!=='own'?BW.packs['pack'+target]:null;
        let total=0, answered=0; const gs=GROUPS.map((g,gi)=>{ let s=0; g.items.forEach((x,ii)=>{ const v=sc[gi+'.'+ii]; if(v!==undefined){ s+=v; answered++; total+=v; } }); return {g:g.g,s}; });
        const n=GROUPS.reduce((a,g)=>a+g.items.length,0);
        if(!answered){ res.innerHTML='<div class="msg info" style="margin-top:12px">Score at least a few items to see the result.</div>'; return; }
        const grade=t=> t>=32?['Strong','good','A genuinely useful pack. Keep it consistent, and close the few gaps.']:t>=22?['Decent','warn','A solid base. A few targeted fixes will make it a real management tool.']:t>=12?['Basic','warn','Numbers, but not much help running the business. Big gains available.']:['Weak','bad','The pack isn\'t doing its job yet. Start with reliability, then add comparisons.'];
        const g=grade(total); const weakest=[...gs].sort((a,b)=>a.s-b.s).slice(0,2);
        const exTot=pack?pack.grades.reduce((a,b)=>a+b,0):null;
        res.innerHTML=`<div style="border-top:1px dashed var(--rule-strong);padding-top:14px;margin-top:14px;display:grid;gap:12px">
          <div class="stats">${ctx.ui.stat('Your score',`${total} / ${n*2}`,g[1],`${answered} of ${n} items scored`)}${ctx.ui.stat('Grade',g[0],g[1])}${exTot!==null?ctx.ui.stat('Expert score',`${exTot} / 40`,grade(exTot)[1],grade(exTot)[0]):''}</div>
          ${ctx.ui.bars(gs.map(x=>({label:x.g,v:x.s,tone:x.s>=6?'good':x.s>=3?'warn':'bad'})),{max:8,fmt:x=>x+' / 8'})}
          <div class="msg ${g[1]}">${g[2]} <strong>Weakest areas: ${weakest.map(w=>w.g.toLowerCase()).join(' and ')}.</strong>${pack&&answered===n?` ${Math.abs(total-exTot)<=3?'Your grading is close to the expert\'s.':total>exTot?'You graded more generously than the expert. Compare item by item to see where.':'You were stricter than the expert. Compare item by item.'}`:''}</div></div>`;
      }
      draw();
    }),
    K('Fix in this order',
      `<ol>
        <li><strong>Reliable first.</strong> Better-looking reports built on unreconciled numbers just make wrong numbers look convincing.</li>
        <li><strong>Then comparative.</strong> Budget and last-year columns are cheap to add and transform what you can see.</li>
        <li><strong>Then insightful.</strong> The one-page summary and real commentary.</li>
        <li><strong>Then complete and connected.</strong> Margin by product, aging reports, operational KPIs.</li>
       </ol>`)
  ]},
  {id:'comment', label:'Commentary', kind:'learn', title:'Commentary that actually helps', blocks:[
    `<p>The commentary page is where a pack earns its keep. Compare these two versions about the same month at BraceWorks.</p>`,
    FLAG('Weak commentary',
      `<p>"Sales for October were $96,000, which is below budget. Gross margin was 25.1%. Expenses were in line with budget. Net profit was $1,200. Cash at the end of the month was $31,000."</p>
       <p class="small"><strong>Why it's weak:</strong> every sentence repeats a number you can already see in the table. Nothing says why, so nothing tells you what to do.</p>`),
    K('Strong commentary',
      `<p><strong>Sales $96k, $9k (9%) below budget.</strong> Our largest US distributor moved a $12k mattress order to 4 November (confirmed in writing). Europe was $3k ahead on slings. Underlying sales are on plan.</p>
       <p><strong>Gross margin 25.1% vs 28.0% budget, costing $2.8k.</strong> Two causes: foam supplier price rise of 6% from 1 October ($1.4k), and rework on sling batch 2231 after a stitching defect ($1.1k). The balance is lower volume over fixed costs.</p>
       <p><strong>Actions:</strong> price increase letter to distributors, effective 1 January (Sales, by 15 Nov). Second foam quote (Purchasing, by 8 Nov). Corrective action on stitching machine 4 is closed (Quality).</p>
       <p><strong>Cash $31k, $11k below forecast</strong>, because of the delayed order. Lowest point in the next 13 weeks: $18k in week 3. No extra borrowing needed.</p>
       <p><strong>Outlook:</strong> November forecast $118k sales, 27.5% gross margin. Full year still on track for $1.22M.</p>`),
    `<h3>The recipe for good commentary</h3>
     <ul>
      <li><strong>Lead with the variance:</strong> the size in dollars and %, against budget or forecast.</li>
      <li><strong>Give the cause:</strong> specific, with names of products, customers or batches.</li>
      <li><strong>Separate timing from real change:</strong> a delayed order isn't a lost one.</li>
      <li><strong>Say what's being done:</strong> who, and by when.</li>
      <li><strong>Look forward:</strong> what this means for next month and the year.</li>
     </ul>`,
    Q('Which sentence belongs in good commentary?',[
      'Raw material costs were higher this month.',
      'Materials were 49.2% of sales against 46% budget, mainly the 6% foam price rise ($1.4k); new supplier quote due 8 Nov.',
      'The P&L shows a profit of $1,200.',
      'Results were disappointing and we will try harder next month.'],1,
      'It quantifies the variance, names the cause, puts a dollar value on it, and says what\'s being done.')
  ]},
  {id:'case', label:'Case: the moving numbers', kind:'case', title:'The numbers that moved', blocks:[
    CASE('Profit, then no profit',
      `<p>On 12 October you receive September's pack: <strong>net profit $9,000</strong>, your best month this year. You tell the owner. On 26 October, finance sends a "revised" pack: September is now a <strong>loss of $2,000</strong>.</p>
       <p>The accountant explains what changed:</p>
       <ul>
        <li>$6,800 of foam and fabric arrived in September, but the supplier invoices came in October. They weren't recorded in September.</li>
        <li>A $2,400 freight bill for September shipments arrived late.</li>
        <li>$1,800 of overtime worked in the last week of September was paid in October.</li>
       </ul>`),
    Q('What process would have prevented this?',[
      {text:'Waiting until all invoices arrive before issuing the pack', why:'That makes the pack later and later. Good companies issue on time by estimating what\'s missing.'},
      {text:'Accruing for goods received but not yet invoiced, plus known costs like freight and overtime, during the month-end close'},
      {text:'Asking suppliers to invoice faster', why:'Helpful, but there will always be timing gaps. The close process must handle them.'},
      {text:'Reporting on a cash basis', why:'That would make the monthly numbers swing even more (Module 2).'}
    ],1,'The fix is a "goods received not invoiced" accrual: anything signed for in the warehouse but not yet billed is recorded at the purchase order price. Freight and overtime are accrued from shipping and timesheet records.'),
    K('Goods received not invoiced (GRNI)',
      `<p>When the warehouse signs for a delivery, the cost has been incurred, whether or not the invoice has arrived. A good system records it automatically from the goods-received note and purchase order. At month-end, any received-but-not-invoiced goods are accrued. This one control fixes the most common cause of numbers that move.</p>`),
    TIP('A rule worth setting',
      `<p>Tell finance: <strong>once a pack is issued, the month is closed.</strong> Anything found later goes into the next month, with a note. Your numbers then never change behind you, and the team has a strong reason to get the close right first time.</p>`)
  ]},
  {id:'quiz', label:'Quiz', kind:'quiz', title:'Check your understanding', blocks:[
    Q('What\'s the main purpose of the monthly management pack?',['To satisfy the tax office','To help managers and owners make decisions','To prepare for the annual audit','To record transactions'],1,'Statutory accounts serve outsiders. The management pack serves the people running the business.'),
    Q('What should come first in a good pack?',['The detailed trial balance','A one-page summary with key KPIs and status','The receivables aging','The appendix'],1,'Most important first. Detail goes to the back.'),
    Q('Your pack arrives 22 working days after month-end. What\'s the main problem?',['It looks unprofessional','It\'s too late to act on, so it\'s history rather than management','Banks won\'t accept it','None, if it\'s accurate'],1,'Aim for 5 to 10 working days. Late information can\'t change the outcome.'),
    Q('Which improvement should come first if your pack scores low everywhere?',['A nicer design','Reliability: reconciliations and a proper close','More KPIs','Charts'],1,'Everything else is built on reliable numbers.'),
    Q('Materials received on 28 September are invoiced on 5 October. When should the cost appear?',['October','September, as a goods-received-not-invoiced accrual','When paid','At year-end'],1,'The cost was incurred when the goods arrived.'),
    Q('"Sales were $96k, below budget." What\'s missing from this commentary?',['The currency','The size of the variance, the cause, and the action','A chart','The year-to-date figure'],1,'Good commentary quantifies, explains, and says what\'s being done.')
  ]},
  {id:'apply', label:'Practice', kind:'apply', title:'Practise on a sample pack', blocks:[
    PACK('packA',1,'Pack A: the old October report'),
    PACK('packB',1,'Pack B: the March pack'),
    `<p>Use the scorecard in the Try it tab to grade Pack A and Pack B, then compare with the expert grading. Then try Packs C and D.</p>`,
    Q('Pack D looks more polished than Pack C, with a green dashboard and confident commentary. Which scores higher on the scorecard?',['Pack D','Pack C (31 against 24)','They score the same','The scorecard can\'t tell'],1,'Pack D loses points on one-offs, scrap costs, changed definitions and reliability. Polish isn\'t quality.'),
    Q('What does Pack A\'s commentary have that a good commentary needs?',['Variance against budget','Causes','Actions with owners','None of these: it only repeats the numbers'],3,'Compare with Pack B\'s commentary: variance, cause, action, outlook.'),
    {t:'html',html:'<h3>Later, with your own report</h3><p class="small" style="color:var(--muted)">When you\'re ready, the same scorecard works on your own report. Your scores stay in this browser. The plan below is the order to fix things in.</p>'},
    CHECK('m9-plan','Month 1: reliable',[
      'Agree a pack deadline: working day 8 or earlier',
      'Written month-end close checklist, signed off each month',
      'Goods-received-not-invoiced, freight and overtime accruals',
      'Rule: issued months are closed; late items go into next month'
    ]),
    CHECK('m9-plan2','Month 2: comparative and explained',[
      'Budget and last-year columns on the P&L, with % of revenue',
      'One-page commentary using the recipe: variance, cause, action, outlook',
      'Balance sheet and cash flow included every month'
    ]),
    CHECK('m9-plan3','Month 3: insight and operations',[
      'One-page KPI dashboard (Module 11)',
      'Gross margin by product line',
      'Receivables and inventory aging, 13-week cash forecast (Module 10)',
      'Scrap, rework and returns costs shown separately'
    ]),
    REPORT('Your Monday-morning conversation',
      `<p>Share your scorecard with your accountant as a joint project, not a criticism. Ask: <strong>"Which three of these could we add by next month, and what do you need from me or the team to do it?"</strong> Often the answer is information only operations can give: production data, shipping logs, timesheets.</p>`),
    K('Takeaways',
      `<ul>
        <li>A good pack is timely, reliable, comparative, explained, focused, connected, forward-looking and consistent.</li>
        <li>Start with a one-page summary and real commentary: variance, cause, action, outlook.</li>
        <li>Fix reliability first, then comparisons, then insight.</li>
        <li>Numbers that change after issue usually mean missing accruals. Close the month and keep it closed.</li>
       </ul>`)
  ]}
  ],
  warnings:[
    {sign:'Pack arrives more than 10 working days after month-end', meaning:'Weak close process or under-resourced finance. Decisions are made on old news.', look:'Close checklist and where the time goes.'},
    {sign:'Numbers change after the pack is issued', meaning:'Missing accruals or cut-off errors. Reported results can\'t be trusted.', look:'GRNI, freight and overtime accruals.'},
    {sign:'Commentary repeats the numbers', meaning:'Finance isn\'t talking to operations, or doesn\'t know the causes.', look:'Ask "why?" on the three biggest variances.'},
    {sign:'Format changes every month', meaning:'Trends become invisible; problems can be hidden.', look:'Agree a fixed template and definitions.'}
  ],
  formulas:[
    {name:'Pack scorecard', f:'20 criteria × (0 no, 1 partly, 2 yes) = score out of 40', ex:'32+ strong · 22–31 decent · 12–21 basic · under 12 weak'}
  ],
  glossary:[
    {term:'Management pack', def:'Monthly internal report for managers and owners: financial statements, KPIs, analysis and commentary.'},
    {term:'Statutory accounts', def:'Annual financial statements prepared to legal and accounting standards for tax authorities, regulators and shareholders.'},
    {term:'Commentary', def:'Written explanation in a management pack of what moved, why, what is being done and the outlook.'},
    {term:'Goods received not invoiced (GRNI)', def:'Accrual for goods delivered and signed for but not yet billed by the supplier.'},
    {term:'Variance to budget', def:'The difference between actual results and the budget, in dollars and %.'},
    {term:'Outlook', def:'Management\'s current expectation for the rest of the year, updated monthly.'}
  ]
});
})();
