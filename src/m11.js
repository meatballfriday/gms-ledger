/* ===== Module 11: Ratios and KPIs ===== */
(function(){
const {K,TIP,FLAG,CASE,REPORT,Q,FS,FLIP,SORT,CHECK,W,PACK,money,signed,pct,kfmt} = BW.h;

// value, target, status g/a/r, leading?, how computed
const LIB=[
  {g:'Sales and growth', id:'growth', n:'Revenue growth vs last year', v:'9.1%', t:'10%', s:'a', lead:false, f:'This year\'s revenue ÷ last year\'s − 1'},
  {g:'Sales and growth', id:'b2b', n:'Book-to-bill (quarter)', v:'0.92', t:'≥ 1.00', s:'r', lead:true, f:'Orders received ÷ Sales shipped'},
  {g:'Sales and growth', id:'backlog', n:'Order backlog', v:'1.8 months', t:'2.0 months', s:'a', lead:true, f:'Unshipped orders ÷ Average monthly sales'},
  {g:'Sales and growth', id:'conc', n:'Largest customer share of sales', v:'22%', t:'< 20%', s:'a', lead:true, f:'Largest customer\'s sales ÷ Total sales'},
  {g:'Sales and growth', id:'win', n:'Quote win rate', v:'31%', t:'35%', s:'a', lead:true, f:'Quotes won ÷ Quotes issued'},
  {g:'Profitability', id:'gm', n:'Gross margin', v:'28.3%', t:'30%', s:'a', lead:false, f:'Gross profit ÷ Revenue'},
  {g:'Profitability', id:'ebitda', n:'EBITDA margin', v:'11.0%', t:'12%', s:'a', lead:false, f:'(Operating profit + Depreciation) ÷ Revenue'},
  {g:'Profitability', id:'net', n:'Net margin', v:'4.6%', t:'6%', s:'a', lead:false, f:'Net profit ÷ Revenue'},
  {g:'Profitability', id:'rpe', n:'Revenue per employee', v:'$24,000', t:'$26,000', s:'a', lead:false, f:'Revenue ÷ Average headcount'},
  {g:'Operations', id:'otif', n:'On time in full (OTIF)', v:'87%', t:'95%', s:'r', lead:true, f:'Orders delivered complete and on time ÷ Orders delivered'},
  {g:'Operations', id:'scrap', n:'Scrap rate', v:'4.1%', t:'3.0%', s:'r', lead:true, f:'Material scrapped ÷ Material issued'},
  {g:'Operations', id:'fpy', n:'First-pass yield', v:'95.9%', t:'97%', s:'a', lead:true, f:'Units passing QA first time ÷ Units inspected'},
  {g:'Operations', id:'eff', n:'Labour efficiency', v:'93%', t:'95%', s:'a', lead:true, f:'Standard hours earned ÷ Hours worked'},
  {g:'Operations', id:'coq', n:'Cost of quality', v:'8.4%', t:'6%', s:'r', lead:false, f:'Prevention + appraisal + failure costs ÷ Revenue'},
  {g:'Cash and working capital', id:'dso', n:'Days sales outstanding', v:'70 days', t:'60 days', s:'r', lead:true, f:'Receivables ÷ Revenue × 365'},
  {g:'Cash and working capital', id:'od60', n:'Receivables over 60 days late', v:'15.7%', t:'< 5%', s:'r', lead:true, f:'Receivables > 60 days past due ÷ Total receivables'},
  {g:'Cash and working capital', id:'dio', n:'Inventory days', v:'106 days', t:'85 days', s:'r', lead:true, f:'Inventory ÷ Cost of goods sold × 365'},
  {g:'Cash and working capital', id:'dpo', n:'Payables days', v:'63 days', t:'60 days', s:'g', lead:false, f:'Payables ÷ Materials purchased × 365'},
  {g:'Cash and working capital', id:'ccc', n:'Cash conversion cycle', v:'113 days', t:'85 days', s:'r', lead:false, f:'DSO + Inventory days − Payables days'},
  {g:'Cash and working capital', id:'head', n:'Lowest headroom, next 13 weeks', v:'$41,000', t:'≥ $30,000', s:'g', lead:true, f:'Lowest forecast (cash + unused facilities)'},
  {g:'Cash and working capital', id:'cconv', n:'Cash conversion', v:'25%', t:'70%', s:'r', lead:false, f:'Operating cash flow ÷ EBITDA'},
  {g:'Financial strength', id:'cr', n:'Current ratio', v:'2.11', t:'≥ 1.5', s:'g', lead:false, f:'Current assets ÷ Current liabilities'},
  {g:'Financial strength', id:'nd', n:'Net debt to EBITDA', v:'1.35×', t:'≤ 2.0×', s:'g', lead:false, f:'(Bank debt − Cash) ÷ EBITDA'},
  {g:'Financial strength', id:'ic', n:'Interest cover', v:'6.7×', t:'≥ 4×', s:'g', lead:false, f:'Operating profit ÷ Interest (banks often use EBITDA ÷ interest instead)'},
  {g:'Financial strength', id:'roce', n:'Return on capital employed', v:'15.9%', t:'15%', s:'g', lead:false, f:'Operating profit ÷ (Total assets − Current liabilities)'}
];
const REC=['gm','ebitda','b2b','conc','otif','scrap','dso','dio','head','nd'];

BW.add({
  id:'m11', minutes:40,
  title:'Ratios and KPIs',
  subtitle:'Fifty numbers will drown you. Ten well-chosen ones, each with a target, a trend and an owner, will run the business.',
  goals:[
    'Choose KPIs that lead to decisions, mixing leading and lagging measures',
    'Calculate and interpret return on capital, and see the three levers behind it',
    'Build a one-page dashboard for BraceWorks, and then for your own business',
    'Recognise when a "green" KPI is hiding a problem'
  ],
  sections:[
  {id:'good', label:'What makes a good KPI', kind:'learn', title:'What makes a KPI worth tracking', blocks:[
    `<p>A <span class="term">KPI</span> (key performance indicator) is a number you watch because it tells you whether the business is on track. Most small companies either have none, or have so many that nobody looks at them. Good KPIs pass five tests:</p>
     <ol>
      <li><strong>It drives a decision.</strong> If the number moved, would you do something differently? If not, drop it.</li>
      <li><strong>It has a target.</strong> 87% OTIF means nothing until you know the target is 95%.</li>
      <li><strong>It shows a trend.</strong> Is it getting better or worse? Show at least the last six months.</li>
      <li><strong>It has an owner.</strong> One person who can change it and explains it when it moves.</li>
      <li><strong>It's defined once and never quietly changed.</strong> Otherwise you'll be comparing different things.</li>
     </ol>`,
    K('Mix leading and lagging',
      `<p><strong>Lagging</strong> KPIs (gross margin, net profit) tell you the result. <strong>Leading</strong> KPIs (book-to-bill, scrap rate, overdue receivables) tell you what the result will be. A dashboard of only lagging measures is like driving by looking in the mirror. Aim for about half and half.</p>`),
    SORT('Leading or lagging?',['Leading','Lagging'],[
      {text:'Orders received this month', a:0, why:'Orders today are sales next month.'},
      {text:'Net profit last quarter', a:1, why:'It reports a result that has already happened.'},
      {text:'Scrap rate on the cutting line this week', a:0, why:'Rising scrap shows up in gross margin weeks later.'},
      {text:'Gross margin for the year', a:1, why:'A result.'},
      {text:'Receivables more than 60 days overdue', a:0, why:'Predicts bad debts and cash shortfalls.'},
      {text:'Revenue per employee', a:1, why:'Summarises past performance.'}
    ])
  ]},
  {id:'set', label:'BraceWorks\' numbers', kind:'learn', title:'The 25 numbers worth knowing', blocks:[
    `<p>Here's BraceWorks scored against sensible targets for a business like it. You won't put all 25 on your dashboard, but you should know what each one means. Red means well off target, amber close, green on target.</p>`,
    {t:'html', html: (()=>{ const groups=[...new Set(LIB.map(k=>k.g))]; const dot=s=>`<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:var(--${s==='g'?'good':s==='a'?'amber':'red'});margin-right:6px"></span>`;
      return groups.map(g=>`<h3 style="margin:18px 0 8px">${g}</h3>`+BW.ui.table(['KPI','BraceWorks','Target','Type'],LIB.filter(k=>k.g===g).map(k=>[`${dot(k.s)}<strong>${k.n}</strong><div class="small" style="color:var(--muted)">${k.f}</div>`,k.v,k.t,k.lead?'Leading':'Lagging']),{num:[1,2]})).join(''); })()},
    TIP('Where do targets come from?',
      `<p>Three sources: your own best past performance, your budget, and what similar companies achieve. Industry benchmarks are hard to find for a business your size, so start with "better than last year" and tighten as you learn.</p>`)
  ]},
  {id:'roce', label:'Return on capital', kind:'learn', title:'Is the business worth the money in it?', blocks:[
    `<p>Profit alone doesn't tell you if a business is good. $55,500 of profit is impressive from $100,000 of investment, and poor from $2 million. Return ratios compare profit with the money tied up to earn it.</p>`,
    {t:'tbl', head:['Ratio','Formula','BraceWorks','Question it answers'], opts:{num:[2]}, rows:[
      ['<strong>Return on capital employed (ROCE)</strong>','Operating profit ÷ (Total assets − Current liabilities)','$94,000 ÷ $591,500 = 15.9%','How well does the business use all its long-term funding, debt and equity together?'],
      ['<strong>Return on equity (ROE)</strong>','Net profit ÷ Equity','$55,500 ÷ $491,500 = 11.3%','What return are the owners earning on their stake?']
    ]},
    `<p>Compare ROCE with what money costs. BraceWorks pays about 6.4% interest on its loans. Earning 15.9% on capital is comfortably above that, so borrowing to invest in the business has created value. If ROCE fell below the cost of borrowing, each new dollar borrowed would make the owners poorer.</p>
     <h3>Three levers behind ROE</h3>
     <p>Return on equity can be split into three parts, a breakdown often called the DuPont analysis:</p>
     <p class="num" style="font-weight:600">ROE = Net margin × Asset turnover × Leverage</p>
     <ul>
      <li><strong>Net margin</strong> (net profit ÷ revenue): how much profit each sale makes. BraceWorks 4.6%.</li>
      <li><strong>Asset turnover</strong> (revenue ÷ total assets): how hard the assets work. BraceWorks 1.42.</li>
      <li><strong>Leverage</strong> (total assets ÷ equity): how much of the business is funded by debt. BraceWorks 1.72.</li>
     </ul>`,
    W('ROE levers', function(el, ctx){
      const {pct}=ctx.h;
      const top=document.createElement('div'), out=document.createElement('div'); el.append(top,out);
      ctx.ui.sliders(top,[
        {k:'m',label:'Net margin',min:1,max:10,step:0.1,v:4.6,f:x=>x.toFixed(1)+'%'},
        {k:'t',label:'Asset turnover',min:0.8,max:2.5,step:0.01,v:1.42,f:x=>x.toFixed(2)+'×'},
        {k:'l',label:'Leverage (assets ÷ equity)',min:1.1,max:3.5,step:0.01,v:1.72,f:x=>x.toFixed(2)+'×'}
      ],(v)=>{
        const roe=v.m/100*v.t*v.l;
        out.innerHTML=`<div class="stats">${ctx.ui.stat('Return on equity',pct(roe),roe>=0.15?'good':roe<0.08?'bad':'warn','was 11.3%')}</div>
        <p class="w-hint" style="margin-top:10px">${v.l>2.5?'High leverage boosts ROE, but it also raises risk. A bad year with heavy debt can wipe out the equity. Banks will limit how far you can go.':v.t>1.7?'Faster asset turnover usually comes from less stock and fewer unpaid invoices. Module 16 shows how. It\'s often the safest lever to pull.':v.m>6?'Margin is the most powerful lever for a business with thin margins like BraceWorks.':'Try raising asset turnover to 1.70, which BraceWorks could reach by cutting inventory and receivables. Then compare it with adding the same ROE through more debt.'}</p>`;
      },ctx.uid);
    })
  ]},
  {id:'dash', label:'Build your dashboard', kind:'play', title:'Build the one-page dashboard', blocks:[
    `<p>Choose up to 12 KPIs for BraceWorks' monthly dashboard. Aim for a balance across the groups, and for about half leading measures. Your choice is saved in this browser.</p>`,
    W('Dashboard builder', function(el, ctx){
      const S=ctx.state; if(!Array.isArray(S.dash)) S.dash=REC.slice();
      el.innerHTML=`<div class="row"><button type="button" class="btn ghost small" data-rec>Use the recommended ten</button><button type="button" class="linkbtn" data-clear>Clear all</button></div><div data-pick style="display:grid;gap:12px"></div><div data-prev></div>`;
      const pick=el.querySelector('[data-pick]'), prev=el.querySelector('[data-prev]');
      const groups=[...new Set(LIB.map(k=>k.g))];
      function drawPick(){
        pick.innerHTML='';
        groups.forEach(g=>{ const box=document.createElement('div'); box.innerHTML=`<div class="eyebrow" style="margin-bottom:6px">${g}</div>`; const seg=document.createElement('div'); seg.className='seg';
          LIB.filter(k=>k.g===g).forEach(k=>{ const b=document.createElement('button'); b.type='button'; b.textContent=k.n; b.setAttribute('aria-pressed',String(S.dash.includes(k.id)));
            b.onclick=()=>{ if(S.dash.includes(k.id)) S.dash=S.dash.filter(x=>x!==k.id); else { if(S.dash.length>=12) return flash(); S.dash.push(k.id); } ctx.save(); b.setAttribute('aria-pressed',String(S.dash.includes(k.id))); drawPrev(); };
            seg.appendChild(b); });
          box.appendChild(seg); pick.appendChild(box); });
      }
      let flashMsg='';
      function flash(){ flashMsg='Twelve is the limit. Remove one first. A dashboard that needs scrolling isn\'t a dashboard.'; drawPrev(); }
      function drawPrev(){
        const sel=LIB.filter(k=>S.dash.includes(k.id));
        const lead=sel.filter(k=>k.lead).length; const missing=groups.filter(g=>!sel.some(k=>k.g===g));
        const tips=[]; if(flashMsg){ tips.push(flashMsg); flashMsg=''; }
        if(sel.length<6) tips.push('Fewer than six KPIs leaves blind spots.');
        if(missing.length) tips.push('Nothing from: '+missing.join(', ').toLowerCase()+'.');
        if(sel.length&&lead/sel.length<0.4) tips.push(`Only ${lead} of ${sel.length} are leading measures. Add some that warn you early.`);
        if(sel.length&&!sel.some(k=>['head','dso','ccc','cconv','od60'].includes(k.id))) tips.push('No cash measure. Cash is what stops a profitable business.');
        const col=s=>s==='g'?'good':s==='a'?'warn':'bad';
        prev.innerHTML=`<div style="border-top:1px dashed var(--rule-strong);padding-top:14px;display:grid;gap:10px">
          <div class="row" style="justify-content:space-between"><h4>BraceWorks · Monthly dashboard</h4><span class="eyebrow">${sel.length}/12 · ${lead} leading</span></div>
          <div class="stats">${sel.map(k=>ctx.ui.stat(k.n,k.v,col(k.s),`target ${k.t}${k.lead?' · leading':''}`)).join('')||'<p class="w-hint">Pick some KPIs above.</p>'}</div>
          ${tips.length?`<div class="msg warn">${tips.join(' ')}</div>`:sel.length?'<div class="msg good">A balanced dashboard. Every group is covered, with a good mix of early warnings.</div>':''}</div>`;
      }
      el.querySelector('[data-rec]').onclick=()=>{ S.dash=REC.slice(); ctx.save(); drawPick(); drawPrev(); };
      el.querySelector('[data-clear]').onclick=()=>{ S.dash=[]; ctx.save(); drawPick(); drawPrev(); };
      drawPick(); drawPrev();
    }),
    K('The recommended ten, and why',
      `<p>Gross margin and EBITDA margin (are we making money?), book-to-bill and largest customer share (is demand healthy and spread?), OTIF and scrap rate (is the factory performing?), DSO and inventory days (is cash getting stuck?), lowest 13-week headroom (will we have enough cash?) and net debt to EBITDA (can we carry our debt?). Seven of the ten are leading.</p>`)
  ]},
  {id:'case', label:'Case: all green', kind:'case', title:'All green, still in trouble', blocks:[
    CASE('The dashboard that said everything was fine',
      `<p>The previous GM had a dashboard. Every month, every KPI was green. Yet the year ended with a cash crisis, a lost distributor and a $43,000 clean-up of bad debts and old stock. You dig into how the KPIs were measured.</p>`),
    SORT('Why was each KPI misleading?',['Target too easy','Definition bent','Average hides detail','One-off flattered it'],[
      {text:'OTIF 96%, measured against the delivery date after customers agreed to a delay, not the date first promised', a:1, why:'Against the original promise date, OTIF was 79%. Re-promising made every late order "on time".'},
      {text:'Gross margin 28.9% against a target of 25%, set three years ago', a:0, why:'The target was below what the business already achieved, so it was green even as margin fell from 31%.'},
      {text:'Gross margin boosted by an $18,000 year-end volume rebate from the foam supplier', a:3, why:'Without the rebate, gross margin was 27.4% and falling. One-offs should be shown separately.'},
      {text:'DSO of 62 days, comfortably inside the 75-day target', a:2, why:'The average looked fine, but one customer was at 210 days. Overdue amounts by customer would have shown it.'},
      {text:'Scrap rate 1.8%, measured only at final inspection', a:1, why:'Most scrap happens at cutting, which wasn\'t counted. Measured from material issued, it was 4.1%.'}
    ]),
    K('Lessons for your dashboard',
      `<ul>
        <li><strong>Write down each KPI's definition</strong>, and don't let it change without your approval.</li>
        <li><strong>Review targets every year.</strong> A target you always hit isn't a target.</li>
        <li><strong>Look behind averages.</strong> Pair each average with its worst case: worst customer, worst product, worst week.</li>
        <li><strong>Strip out one-offs</strong> so the trend shows the underlying business.</li>
        <li><strong>Remember Goodhart's law:</strong> when a measure becomes a target, people find ways to hit the number rather than improve the business. Watch for it, especially where bonuses are tied to KPIs.</li>
       </ul>`)
  ]},
  {id:'quiz', label:'Quiz', kind:'quiz', title:'Check your understanding', blocks:[
    Q('Which is the best KPI to warn you of falling sales before they happen?',['Net profit','Book-to-bill ratio','Gross margin','Current ratio'],1,'It compares orders coming in with sales going out, so it moves before sales do.'),
    Q('BraceWorks\' ROCE is 15.9% and it borrows at about 6.4%. What does this suggest?',['Borrowing to invest has created value','The business should repay all debt immediately','ROCE is too high to be real','Nothing useful'],0,'Earning more on capital than it costs means investment funded by borrowing adds value, as long as it continues.'),
    Q('ROE = Net margin × Asset turnover × Leverage. BraceWorks cuts stock and receivables without hurting sales. Which lever moves?',['Net margin','Asset turnover','Leverage','None'],1,'Same revenue from fewer assets means higher asset turnover.'),
    Q('Your DSO is 62 days, inside target. What else should you check?',['Nothing','The receivables by customer, especially overdue amounts','The current ratio','Revenue per employee'],1,'Averages can hide one very late customer.'),
    Q('How many KPIs belong on a one-page dashboard?',['3','About 8 to 12','25','As many as possible'],1,'Enough to cover the business, few enough to read in two minutes.'),
    Q('A KPI has been green for three years in a row. What should you do?',['Celebrate','Check its definition and whether the target is still challenging','Remove it','Lower the target'],1,'It may be genuinely good, or the target and definition may have stopped meaning anything.')
  ]},
  {id:'apply', label:'Practice', kind:'apply', title:'Practise on a sample pack', blocks:[
    PACK('packD',2,'Pack D, page 2: dashboard'),
    Q('Which two green KPIs on Pack D\'s dashboard rely on changed or narrow definitions?',['Revenue and PBT','On time in full and scrap rate','Book-to-bill and headroom','DSO and net debt'],1,'OTIF now uses re-promised dates, and scrap is measured only at final inspection. Check the appendix notes.'),
    Q('The "best ever" gross margin of 34.7% falls to about what once the $8,000 advance payment is removed?',['34.0%','30.4%','25.0%','40.0%'],1,'($45,400 − $8,000) ÷ ($131,000 − $8,000) ≈ 30.4%. Below the 32.3% budget for the month.'),
    Q('Which KPI would you add to Pack D\'s dashboard to catch its biggest hidden problem?',['Revenue per employee','Cash conversion (operating cash flow ÷ EBITDA)','Interest cover','Quote win rate'],1,'Operating cash was negative while profit soared. A cash measure would have turned the dashboard red.'),
    {t:'html',html:'<h3>Later, with your own report</h3><p class="small" style="color:var(--muted)">Optional. When you next read your own monthly report, use this checklist. Nothing here is shared or sent; ticks are saved only in this browser.</p>'},
    CHECK('m11-kpi','For my own business, I have…',[
      'Chosen 8 to 12 KPIs, covering sales, profit, operations, cash and financial strength',
      'Included at least four leading measures',
      'Written a one-line definition for each KPI',
      'Set a target for each, reviewed at least yearly',
      'Named one owner for each KPI',
      'Asked for each KPI to be shown with a six-month trend',
      'Paired averages with worst cases (worst customer, product or week)'
    ]),
    REPORT('Your Monday-morning task',
      `<p>Use the dashboard builder above as a draft. Replace BraceWorks' numbers with your own targets, then ask finance: <strong>"Can you put these on the first page of the pack, with the last six months and a red/amber/green status?"</strong></p>`),
    K('Takeaways',
      `<ul>
        <li>Good KPIs drive decisions, have targets, trends and owners, and stay defined the same way.</li>
        <li>Mix leading and lagging measures. Leading ones give you time to act.</li>
        <li>ROCE and ROE compare profit with the money invested. ROCE should beat your cost of borrowing.</li>
        <li>Green isn't always good. Check definitions, targets, averages and one-offs.</li>
       </ul>`)
  ]}
  ],
  warnings:[
    {sign:'Every KPI green, every month', meaning:'Targets too easy, definitions bent, or averages hiding problems.', look:'KPI definitions, target history, worst-case breakdowns.'},
    {sign:'KPI definition changed without explanation', meaning:'Trends broken; possibly a bad number being hidden.', look:'Ask for the old and new definitions side by side.'},
    {sign:'ROCE falling toward the interest rate', meaning:'New investment and borrowing may no longer create value.', look:'Profit from recent investments; capital tied up in working capital.'},
    {sign:'Largest customer above 20% of sales', meaning:'Losing one customer could threaten the business.', look:'Sales concentration trend; plans to diversify.'}
  ],
  formulas:[
    {name:'Return on capital employed (ROCE)', f:'Operating profit ÷ (Total assets − Current liabilities)', ex:'$94,000 ÷ $591,500 = 15.9%'},
    {name:'Return on equity (ROE)', f:'Net profit ÷ Equity', ex:'$55,500 ÷ $491,500 = 11.3%'},
    {name:'DuPont analysis', f:'ROE = Net margin × Asset turnover × Leverage', ex:'4.6% × 1.42 × 1.72 = 11.3%'},
    {name:'Interest cover', f:'Operating profit ÷ Interest expense (some lenders use EBITDA ÷ interest)', ex:'$94,000 ÷ $14,000 = 6.7×; on EBITDA: $132,000 ÷ $14,000 = 9.4×'},
    {name:'Asset turnover', f:'Revenue ÷ Total assets', ex:'$1,200,000 ÷ $845,000 = 1.42×'},
    {name:'Customer concentration', f:'Largest customer sales ÷ Total sales', ex:'$264,000 ÷ $1,200,000 = 22%'}
  ],
  glossary:[
    {term:'KPI', def:'Key performance indicator: a number tracked against a target because it shows whether the business is on track.'},
    {term:'Dashboard', def:'A one-page summary of the main KPIs, with targets, trends and status.'},
    {term:'Return on capital employed (ROCE)', def:'Operating profit as a % of the long-term funding in the business (debt and equity).'},
    {term:'Return on equity (ROE)', def:'Net profit as a % of the owners\' equity.'},
    {term:'Asset turnover', def:'Revenue divided by total assets. How much sales each dollar of assets generates.'},
    {term:'Leverage', def:'The use of debt to fund a business. Measured here as total assets divided by equity.'},
    {term:'Interest cover', def:'How comfortably profit covers interest: usually operating profit divided by interest, though many loan agreements use EBITDA instead. Always use the definition in your own loan agreement.'},
    {term:'Customer concentration', def:'The share of sales coming from the largest customer or customers.'},
    {term:'Goodhart\'s law', def:'When a measure becomes a target, it tends to stop being a good measure, because people optimise the number.'}
  ]
});
})();
