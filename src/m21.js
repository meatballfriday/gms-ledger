/* ===== Module 22 (file m21): Reading real annual reports ===== */
(function(){
const {K,TIP,FLAG,CASE,REPORT,Q,FS,FLIP,SORT,CHECK,W,money,signed,pct,kfmt} = BW.h;

/* ---------- sources (opened by the learner) ---------- */
const SRC={
  arjoAR:'https://www.arjo.com/siteassets/01-about-us/investors/2025/annual-report-2024/final-version/arjo_ahr24_eng_final.pdf',
  arjoQ4:'https://www.arjo.com/siteassets/01-about-us/investors/2025/q4-2024/arjo_q4_2024_eng_final.pdf',
  emblaAR:'https://media.ossur.com/image/upload/documents/corporate/Quarterly%20Reports/2024/2024%20Annual%20Report.pdf',
  emblaQ4:'https://mb.cision.com/Main/18404/4100604/3246107.pdf',
  ivc21:'https://www.sec.gov/Archives/edgar/data/742112/000074211222000012/0000742112-22-000012-index.html',
  ivc22:'https://www.sec.gov/Archives/edgar/data/742112/000074211223000036/0000742112-23-000036-index.html'
};
const link=(href,label)=>`<a class="btn ghost small" href="${href}" target="_blank" rel="noopener noreferrer">${label} ↗</a>`;

/* ---------- the report hunt: find a number, type it, get it checked ---------- */
function hunt(id,title,tasks,rid){
  const pg=p=>{ const r=(BW.reports||{})[rid]; const x=r&&r.pages.find(q=>q.id===p); return x?x.title:p; };
  return W(title,function(el,ctx){
    const S=ctx.state; S.hunt=S.hunt||{}; const st=S.hunt[id]=S.hunt[id]||{};
    el.innerHTML=`<div class="hunt-top"><span class="hunt-score small"></span><button type="button" class="linkbtn hunt-reset">Start again</button></div><ol class="hunt">${tasks.map((t,i)=>`<li class="hunt-i" data-i="${i}">
      <div class="hunt-q">${t.q}</div>
      <div class="hunt-row"><input class="hunt-in" type="text" inputmode="decimal" autocomplete="off" id="${ctx.uid('h'+i)}" aria-label="Your answer to task ${i+1}"><span class="hunt-u">${t.unit||''}</span><button type="button" class="btn small" data-c>Check</button><button type="button" class="linkbtn" data-h>Where to look</button></div>
      <div class="hunt-hint small" hidden>${t.where}${t.page&&rid?` ${BW.reportBtn(rid,t.page,'Open: '+pg(t.page),'linkbtn')}`:''}</div><div class="hunt-fb" hidden></div></li>`).join('')}</ol>`;
    const score=el.querySelector('.hunt-score');
    const upd=()=>{ const n=tasks.filter((t,i)=>st[i]&&st[i].ok).length, sh=tasks.filter((t,i)=>st[i]&&st[i].shown&&!st[i].ok).length; score.textContent=`${n} of ${tasks.length} found${sh?` · ${sh} answer${sh>1?'s':''} shown`:''}`; };
    const parse=s=>{ let x=String(s).trim().replace(/^\((.*)\)$/,'-$1').replace(/sek|usd|us\$|\$|%|×|x|m\b|,|\s/gi,''); if(x.endsWith('.')) x=x.slice(0,-1); const v=parseFloat(x); return isNaN(v)?null:v; };
    el.querySelectorAll('.hunt-i').forEach(li=>{ const i=+li.dataset.i, t=tasks[i], inp=li.querySelector('input'), fb=li.querySelector('.hunt-fb'), hint=li.querySelector('.hunt-hint');
      const done=(ok,shown)=>{ li.classList.add(ok?'is-ok':'is-shown'); inp.value=t.show||String(t.ans); inp.disabled=true; li.querySelector('[data-c]').disabled=true;
        fb.hidden=false; const u=t.unit==='%'||t.unit==='×'?t.unit:(t.unit?' '+t.unit:''); fb.innerHTML=`<p><strong>${ok?'Found it.':'The answer is '+(t.show||t.ans)+u+'.'}</strong> ${t.why}</p>`; };
      if(st[i]&&(st[i].ok||st[i].shown)) done(!!st[i].ok,true);
      li.querySelector('[data-h]').onclick=()=>{ hint.hidden=!hint.hidden; };
      const check=()=>{ const v=parse(inp.value); if(v==null){ fb.hidden=false; fb.innerHTML='<p>Type a number, for example <code>1,234</code> or <code>12.5</code>.</p>'; return; }
        const val=t.abs?Math.abs(v):v; const ok=Math.abs(val-t.ans)<=(t.tol!=null?t.tol:Math.max(0.5,Math.abs(t.ans)*0.002));
        st[i]=st[i]||{tries:0};
        if(ok){ st[i].ok=true; ctx.save(); done(true); upd(); return; }
        st[i].tries++; ctx.save(); fb.hidden=false;
        fb.innerHTML=`<p><strong>Not quite.</strong> ${t.nudge||'Check the year, the unit and which line you used.'}</p>`;
        if(st[i].tries>=2){ const b=document.createElement('button'); b.type='button'; b.className='linkbtn'; b.textContent='Show the answer'; b.onclick=()=>{ st[i].shown=true; ctx.save(); done(false); upd(); }; fb.appendChild(b); } };
      li.querySelector('[data-c]').onclick=check; inp.addEventListener('keydown',e=>{ if(e.key==='Enter') check(); });
    });
    el.querySelector('.hunt-reset').onclick=()=>{ Object.keys(st).forEach(k=>delete st[k]); ctx.save(); ctx.sec&&BW.go(ctx.mod.id,ctx.mod.sections.indexOf(ctx.sec)); };
    upd();
  });
}

/* ---------- Invacare data (US$ millions, from the 10-K filings) ---------- */
const IVC=[
  {y:2019,sales:928.0,gm:28.2,op:-10.4,nl:-53.3,ocf:2.7,capex:10.9,cash:80.1,debt:219.5,eq:308.5,inv:120.5,ar:116.7,gw:373.4},
  {y:2020,sales:850.7,gm:28.8,op:11.3,nl:-28.3,ocf:21.9,capex:22.3,cash:105.3,debt:245.1,eq:333.8,inv:115.5,ar:108.6,gw:402.5},
  {y:2021,sales:872.5,gm:27.4,op:-24.2,nl:-45.6,ocf:-14.3,capex:17.7,cash:83.7,debt:308.1,eq:218.5,inv:144.3,ar:117.1,gw:355.9},
  {y:2022,sales:741.7,gm:23.6,op:-80.5,nl:-101.1,ocf:-55.3,capex:3.8,cash:58.8,debt:354.2,eq:81.1,inv:112.6,ar:88.0,gw:326.3}
];
const m1=v=>(v<0?'(':'')+'$'+Math.abs(v).toFixed(1)+(v<0?')':'');
const IVCQ=[
  {when:'March 2020: the 2019 annual report arrives', story:`Sales are $928m. The company has lost money again. It is closing and merging plants in Europe, and in November it swapped notes due in 2021 for new ones due in 2024.`,
   q:'Operating cash flow was a positive $2.7m and capital spending was $10.9m. What does that tell you?',
   opts:['The business is generating cash, so the losses don\'t matter','Free cash flow was negative: the business can\'t pay for its own investment, and is living on cash reserves and borrowing','Capital spending is too high and should be cut to zero','Nothing: cash flow only matters for small companies'],a:1,
   why:'$2.7m − $10.9m = about −$8m of free cash flow. A business that can\'t fund its own maintenance spending must keep borrowing. Swapping notes due in 2021 for notes due in 2024 bought time, but didn\'t repay anything.'},
  {when:'March 2021: the 2020 annual report arrives', story:`Sales fell 8% in the pandemic year, but the headline says operating income has turned positive: $11.3m, up from a loss of $10.4m. Cash rose to $105m.`,
   q:'Is the turnaround in operating income real?',
   opts:['Yes: a $21.7m swing is a clear recovery','Mostly not: $9.8m of it was a one-off gain from selling the Dynamic Controls business, so the underlying figure was only about $1.5m','Yes, because cash went up','It can\'t be judged without the share price'],a:1,
   why:'One-off gains belong in a separate box. Take out the $9.8m gain on the sale and operating income was about $1.5m on $851m of sales: roughly break-even. Cash rose partly because debt rose, from $220m to $245m.'},
  {when:'March 2022: the 2021 annual report arrives', story:`Sales grew 2.6%. There is a $28.6m goodwill write-down in North America after an IT system change. During the year it borrowed $110m (later $125m) through new convertible notes due 2026, mostly to buy back notes due in 2022.`,
   q:'Inventory rose 25% while sales grew 2.6%, operating cash flow turned negative (−$14.3m) and debt rose to $308m. What is the most worrying signal?',
   opts:['The goodwill write-down, because it\'s the biggest number','The business now burns cash and fills the gap with new borrowing, while stock piles up','Gross margin fell 1.4 points','Receivables went up by $8.5m'],a:1,
   why:'The write-down is real but non-cash. The bigger problem is that operations used cash for the first time, $29m extra was tied up in stock, and new debt paid for it. Equity also fell by $115m, far more than the $46m loss. When that happens, open the statement of changes in equity to see where the rest went.'},
  {when:'Late 2022 and early 2023', story:`In July the company took a secured term loan at SOFR + 7% and swapped some notes for secured ones. In September the NYSE warned that the share price had been below $1 for 30 days. Respiratory products were dropped. The 2022 annual report was filed late, on 14 April 2023.`,
   q:'What does a secured loan at SOFR + 7% tell a reader of the accounts?',
   opts:['Interest rates rose everywhere in 2022','Lenders now see high risk: they want security over the assets and a very high margin. It\'s last-resort money','The company is expanding','Nothing: loan terms aren\'t important'],a:1,
   why:'Healthy companies borrow unsecured, or with modest margins. Security plus a 7-point margin means lenders expect a real chance of default, and the security puts them ahead of the existing noteholders.'}
];

BW.add({
  id:'m21', minutes:60,
  title:'Reading real annual reports',
  subtitle:'Everything so far used BraceWorks. Now open the published reports of three real companies that sell mattresses, slings and braces, find the numbers that matter, and watch a real company slide into bankruptcy, one annual report at a time.',
  goals:[
    'Find your way around any annual report in 20 minutes, starting with the parts that are audited',
    'Find, check and calculate key figures in real published reports',
    'Tell audited figures from management\'s own measures, such as "adjusted" profit and organic growth',
    'Spot the warning signs of financial distress years before the auditor raises them',
    'Read the notes and the auditor\'s report for what the statements don\'t show'
  ],
  sections:[
  /* ------------------------------------------------------------ 1 */
  {id:'map', label:'How a report works', kind:'learn', title:'Your map of an annual report', blocks:[
    `<p>A listed company's annual report can run to 150 pages. You don't read it front to back. Most of the front half is written by management to tell a good story. The back half is the evidence: the financial statements and notes, checked by the auditor. A finance-savvy reader starts at the back.</p>`,
    {t:'fig', title:'Two halves of every annual report', draw:function(w){
      const P=BW.viz.p;
      const L=[['The story','Written by management · not audited',['Chair\'s and CEO\'s letters','Strategy and market','Highlights and "key figures"','Segment and regional review','Sustainability report','"Adjusted" and other own measures'],''],
               ['The evidence','Audited · same rules for everyone',['Auditor\'s report','Income statement','Balance sheet','Cash flow statement','Statement of changes in equity','Notes to the accounts'],'hl']];
      const wide=w>=560, bw=wide?(w-70)/2:w-8, ih=24, bh=58+6*ih+10;
      let g='';
      L.forEach((c,k)=>{ const x=wide?(k?bw+66:4):4, y=wide?24:(k?bh+70:24);
        g+=`<rect x="${P.f(x)}" y="${y}" width="${P.f(bw)}" height="${bh}" rx="12" class="v-node ${c[3]}"/>`+P.txt(x+16,y+26,c[0],'v-t','start')+P.txt(x+16,y+44,c[1],'v-s','start');
        c[2].forEach((it,i)=>{ g+=`<circle cx="${P.f(x+22)}" cy="${y+66+i*ih}" r="3" class="v-f-${k?'s3':'s2'}"/>`+P.txt(x+32,y+70+i*ih,it,'v-s','start'); }); });
      if(wide){ const mx=bw+35; g+=P.arrow(mx+26,24+bh/2,mx-26,24+bh/2,{cls:'acc'})+P.lines(mx,24+bh/2-30,['test','claims'],'v-l','middle',12); g+=P.txt(4,14,'FRONT','v-l','start')+P.txt(bw+66,14,'BACK','v-l','start'); }
      else { g+=P.arrow(w/2,24+bh+52,w/2,24+bh+14,{cls:'acc'})+P.txt(w/2+10,24+bh+38,'test the claims against the evidence','v-l','start'); }
      return P.svg(w,wide?bh+34:2*bh+100,'The front half of an annual report tells management\'s story; the back half holds the audited statements and notes used to test it.',g);
    }, caption:'Management chooses what goes in the front half, including its own "adjusted" figures. The back half follows accounting standards and is audited. Read the back first, then check the front against it.'},
    {t:'tbl', head:['What you want to know','Where to look'], rows:[
      ['Can we trust these numbers?','<strong>Auditor\'s report</strong>: is the opinion clean? Any paragraph on going concern?'],
      ['Is the business turning profit into cash?','<strong>Cash flow statement</strong>: operating cash flow vs profit; capital spending; how any gap was funded'],
      ['How much does it owe, and when is it due?','<strong>Balance sheet</strong> and the <strong>borrowings (debt) note</strong>'],
      ['Which parts grow and which make money?','<strong>Segment note</strong> and the segment review'],
      ['What did acquisitions cost, and are they still worth it?','<strong>Business combinations</strong> and <strong>goodwill</strong> notes'],
      ['Anything big that isn\'t in the numbers yet?','<strong>Contingent liabilities</strong> and <strong>events after the reporting date</strong> notes']
    ]},
    `<h3>The 20-minute read</h3><p>Use the same order every time, for a competitor's report, a customer's, or your own audited accounts.</p>`,
    {t:'fig', title:'Where your 20 minutes go', render:function(box){ box.innerHTML=BW.viz.stack({fmt:v=>v+' min',inside:'label',pct:false,minShow:12,keys:[
      {c:'s1',label:'1 Auditor\'s report',v:'2 min'},{c:'s2',label:'2 Cash flow',v:'4 min'},{c:'s3',label:'3 Balance sheet',v:'4 min'},{c:'s4',label:'4 Income statement',v:'3 min'},{c:'q2',label:'5 Notes',v:'5 min'},{c:'muted',label:'6 The story',v:'2 min'}],
      rows:[{label:'',tipLabel:'20 minutes',parts:[{label:'1',v:2,c:'s1'},{label:'2',v:4,c:'s2'},{label:'3',v:4,c:'s3'},{label:'4',v:3,c:'s4'},{label:'5',v:5,c:'q2'},{label:'6',v:2,c:'muted'}]}]}); },
      caption:'Cash flow and balance sheet before the income statement: profit is easy to flatter for a year or two, cash and debt are not.'},
    {t:'tbl', head:['Step','Look for'], rows:[
      ['<strong>1. Auditor\'s report</strong>','A clean ("unmodified") opinion. Any section on going concern or "emphasis of matter". The list of key audit matters: the areas the auditor worried about most.'],
      ['<strong>2. Cash flow statement</strong>','Operating cash flow compared with profit. Capital spending. Free cash flow. Was any shortfall covered by new debt, new shares or selling assets?'],
      ['<strong>3. Balance sheet</strong>','Cash, debt and equity this year vs last. Did receivables and inventory grow faster than sales? Is goodwill large compared with equity?'],
      ['<strong>4. Income statement</strong>','Sales growth, gross margin trend, and one-off items. Is profit up only because of a gain or a lower tax charge?'],
      ['<strong>5. Notes</strong>','Segments, debt maturities, acquisitions and goodwill, provisions, contingent liabilities, related parties, events after year-end.'],
      ['<strong>6. The story</strong>','Now read the front half. For each claim, ask which number in the back half tests it.']
    ]},
    K('Audited figures vs management\'s own measures',
      `<p>Listed companies often lead with figures that no accounting standard defines: <strong>organic growth</strong>, <strong>adjusted EBITDA</strong>, <strong>cash conversion</strong>, <strong>free cash flow</strong>. These are called <span class="term">alternative performance measures</span>. They can be genuinely useful, but management chooses what goes in and what's left out. Good reports reconcile each one to the audited figures. Always look for that reconciliation.</p>`),
    SORT('Audited figure, or management\'s own measure?',['Audited figure','Management\'s own measure'],[
      {text:'Net sales', a:0, why:'Defined by accounting standards and part of the audited income statement.'},
      {text:'Organic growth', a:1, why:'Sales growth with currency and acquisitions stripped out. Useful, but each company defines it its own way.'},
      {text:'Adjusted EBITDA', a:1, why:'Management decides which costs are "exceptional" and adds them back.'},
      {text:'Cash flow from operating activities', a:0, why:'A line in the audited cash flow statement.'},
      {text:'Cash conversion', a:1, why:'A ratio management defines, usually operating cash flow ÷ EBITDA. Check the definition.'},
      {text:'Goodwill', a:0, why:'On the audited balance sheet, and tested for impairment every year.'},
      {text:'Net debt ÷ EBITDA', a:1, why:'A common measure, and often a loan covenant, but not defined by accounting standards.'}
    ]),
    `<h3>Where to find real reports</h3><p>Reading other companies' accounts is free practice, and it shows you how competitors, customers and suppliers are really doing.</p>`,
    {t:'tbl', head:['Country','Where','What you can get'], rows:[
      ['Philippines','SEC (sec.gov.ph); PSE EDGE (edge.pse.com.ph) for listed companies','Every corporation files audited financial statements with the SEC each year, and copies can be requested. Listed companies post annual reports on PSE EDGE.'],
      ['Taiwan','Market Observation Post System (mops.twse.com.tw)','Financial reports of listed and over-the-counter companies.'],
      ['China','CNINFO (cninfo.com.cn); HKEXnews for Hong Kong listings','Annual reports of listed companies.'],
      ['United States','SEC EDGAR (sec.gov/edgar)','Form 10-K annual reports of listed companies, free. Private companies don\'t publish.'],
      ['United Kingdom','Companies House (gov.uk "Find and update company information")','Accounts of every company, private ones included, free. Small companies may file shortened accounts without an income statement.'],
      ['Listed companies anywhere','The company\'s investor relations website','Annual reports, quarterly reports and results presentations.']
    ]},
    TIP('The quarterly report is a good place to start',
      `<p>A year-end or fourth-quarter report is usually 20 to 30 pages and carries the same full-year numbers as the annual report, without the glossy front half. It's a quick way into the figures. Then use the annual report for the notes and the auditor's report.</p>`)
  ]},
  {id:'library', label:'Report library', kind:'learn', title:'The report library', blocks:[
    `<p>Four real reports are built into the course, so you can practise without leaving it. Each has the key figures, the full income statement, balance sheet and cash flow statement, and the most useful notes. Every figure is exactly as the company published it. Only the layout is simplified, and the companies' own narrative text is left out.</p>`,
    {t:'live', render(box){
      const R=BW.reports||{}; const blurb={arjo:'Swedish maker of patient lifts and slings, medical beds and pressure-relief mattresses. Reports in Swedish kronor.',embla:'Icelandic prosthetics company with a bracing business. Reports in US dollars.',ivc21:'US maker of beds, mattresses and patient lifts, a year before it failed. Three years of results.',ivc22:'The same company\'s last annual report, filed after it entered Chapter 11.'};
      box.className='lib';
      box.innerHTML=['arjo','embla','ivc21','ivc22'].filter(k=>R[k]).map(k=>{ const r=R[k]; return `<article class="lib-card"><span class="lib-co">${r.company}</span><h4>${r.title}</h4><p>${blurb[k]}</p><span class="lib-pages">${r.pages.length} pages: ${r.pages.slice(1).map(p=>p.title).join(', ')}</span>${BW.reportBtn(k,'about','Open the report')}</article>`; }).join('');
    }},
    TIP('How to practise with the library',
      `<ul><li>Open a report and do the 20-minute read from the last section, using only what's on the pages.</li><li>Before you look at the cash flow statement, guess from the income statement and balance sheet whether cash went up or down. Then check.</li><li>Pick any line and ask: is it bigger or smaller than last year, and why might that be?</li><li>The next three sections send you into these reports with specific questions.</li></ul>`),
    `<h3>House styles differ</h3>`,
    {t:'tbl', head:['How it\'s shown','What it means'], rows:[
      ['(1,234) or −1,234','A negative number. US reports and Embla use brackets; Arjo uses a minus sign.'],
      ['Costs shown as positive numbers','US reports list costs as positive amounts that are deducted. Arjo and Embla show costs as negatives.'],
      ['SEK M · USD thousands · US$ thousands','The unit, stated at the top of each page. Always check it before you compare.']
    ]}
  ]},
  /* ------------------------------------------------------------ 2 */
  {id:'arjo', label:'Hunt 1: Arjo', kind:'play', title:'Report hunt 1: Arjo, 2024', blocks:[
    `<p><strong>Arjo</strong> is a Swedish company selling patient-handling lifts and slings, medical beds, pressure-injury mattresses and related services to hospitals and care homes worldwide. It is far bigger than BraceWorks, but many of its products are the same kind as yours. It reports in Swedish kronor (SEK); in 2024, roughly SEK 10.5 bought one US dollar. Ratios don't care about the currency.</p>
     <p>Open the report, find each figure and type it in. The report opens beside these questions on a wide screen; on a phone, close it with ✕ to come back. Each "Where to look" hint can also take you straight to the right page, but try finding it yourself first.</p>
     <div class="hunt-open">${BW.reportBtn('arjo','about','Open Arjo\'s 2024 report')}<span class="small" style="color:var(--muted)">Figures in SEK millions (SEK M), exactly as published.</span></div>`,
    hunt('arjo','Find it in Arjo\'s 2024 report',[
      {q:'Net sales for 2024', unit:'SEK M', ans:11292, tol:3, show:'11,292', page:'is', where:'The first line of the income statement, or the top of the key figures.', why:'Up from 10,980 in 2023, so reported growth was 2.8%.'},
      {q:'Organic growth in 2024', unit:'%', ans:3.1, tol:0.1, page:'keyfig', where:'Key figures: "Organic growth in sales". The "Segments and sales" page breaks it down.', why:'Organic growth (3.1%) was a little higher than reported growth (2.8%) because the stronger krona shrank foreign sales when converted, by SEK 32 M. Organic growth strips out currency and acquisitions, so it shows how the existing business really did.'},
      {q:'Gross margin in 2024', unit:'%', ans:43.5, tol:0.15, page:'is', where:'Key figures, or work it out: gross profit ÷ net sales from the income statement.', why:'Much higher than BraceWorks\' 28%. A quarter of Arjo\'s sales are rentals and a fifth are service: a very different mix from a manufacturer selling products to distributors. Compare margins only between similar business models.'},
      {q:'Adjusted EBITDA margin in 2024', unit:'%', ans:18.5, tol:0.15, page:'keyfig', where:'Key figures. Notice it sits next to the unadjusted EBITDA margin.', why:'The unadjusted margin was 17.5%. Arjo\'s own target is an adjusted EBITDA margin of about 23% from full-year 2025, so in 2024 it was still 4.5 points short. Comparing results with the company\'s own targets is one of the quickest tests of a management team.'},
      {q:'Total "exceptional items" charged in 2024 (type the amount as a positive number)', unit:'SEK M', ans:126, tol:1, abs:true, page:'debt', where:'A separate line in the income statement, broken down on the "Net debt and exceptional items" page.', why:'Restructuring 68, a loss on Bruin Biometrics assets after a distribution agreement ended 54, and acquisition costs 4. Exceptional items were SEK 74 M in 2022 and 73 M in 2023 too. "Adjusted" EBITDA adds them back. Costs that come back every year are part of running the business, so look at the unadjusted figures too.'},
      {q:'Cash flow from operations in 2024', unit:'SEK M', ans:1516, tol:3, show:'1,516', page:'cf', where:'Cash flow statement: the subtotal after the changes in working capital.', why:'Down from 2,061 in 2023, while EBITDA rose. Look at the three working-capital lines just above it: they explain the difference.'},
      {q:'Calculate cash conversion: cash flow from operations ÷ EBITDA (find EBITDA in the key figures)', unit:'%', ans:76.7, tol:0.4, page:'keyfig', where:'1,516 ÷ 1,977 × 100. Arjo defines cash conversion this way, and its target is above 80%.', why:'Below target, and down from 105.9% in 2023. The cash flow statement shows why: in 2023 working capital released SEK 525 M (192 from inventories, 130 from receivables, 203 from more credit), while in 2024 it absorbed SEK 73 M, mainly receivables. A one-off release of working capital flatters a single year, which is why you read three years together.'},
      {q:'Calculate days sales outstanding: accounts receivable at year-end ÷ net sales × 365', unit:'days', ans:58, tol:1.5, page:'bs', where:'Accounts receivables are on the balance sheet: 1,798 ÷ 11,292 × 365.', why:'About 58 days, against BraceWorks\' 70, even though Arjo sells largely to hospitals and governments. Large customers don\'t have to mean slow payment.'},
      {q:'Net debt ÷ adjusted EBITDA at the end of 2024', unit:'×', ans:2.0, tol:0.05, page:'keyfig', where:'Key figures. The "Net debt and exceptional items" page shows what net debt is made of, leases included.', why:'Down from 2.3× in 2023 (and 2.7× in 2022). Arjo has been using its cash to pay down debt.'},
      {q:'What share of 2024 sales came from rental, service and disposables combined?', unit:'%', ans:61, tol:1, page:'about', where:'"Arjo in brief" on the first page: sales by type of service.', why:'About three-fifths of sales come back every year without a new sale. Recurring revenue makes results steadier and easier to forecast. Is there a recurring product, such as replacement covers or service plans, BraceWorks could offer?'}
    ],'arjo'),
    {t:'fig', title:'Arjo: profit rose, cash didn\'t keep up', draw:BW.viz.vbars({label:'Arjo adjusted EBITDA and cash flow from operations, 2022 to 2024, SEK millions.',x:['2022','2023','2024'],xName:'Year',fmt:v=>(v/1000).toFixed(1)+'bn',tfmt:v=>'SEK '+v.toLocaleString('en-US')+' M',values:true,vfmt:v=>v.toLocaleString('en-US'),
      series:[{name:'Adjusted EBITDA',c:'s1',v:[1752,2017,2086]},{name:'Cash flow from operations',c:'s3',v:[827,2061,1516]}]}),
      caption:'Adjusted EBITDA rose steadily. Cash flow swung from 49% of EBITDA in 2022 to 106% in 2023 and 77% in 2024. That\'s why one year\'s cash flow tells you little: read three years together. Source: Arjo year-end reports.'},
    Q('Arjo\'s headline says adjusted EBITDA rose to SEK 2,086 M. What should a careful reader check next?',['Only the share price','Whether the "exceptional" costs added back really are one-offs, and whether cash flow kept pace with profit','The number of employees','The chair\'s letter'],1,'Adjusted figures exclude costs management calls exceptional. Arjo had them three years running, and cash conversion fell in 2024.'),
    Q('Arjo\'s organic growth was 3.1%, but reported growth was 2.8%. Why?',['Arjo sold a business','The stronger krona made foreign sales worth less when converted into SEK','Prices fell','It\'s a rounding error'],1,'Currency moves change reported sales without anything changing in the business. Organic growth takes them out.')
  ]},
  /* ------------------------------------------------------------ 3 */
  {id:'embla', label:'Hunt 2: Embla Medical', kind:'play', title:'Report hunt 2: Embla Medical, 2024', blocks:[
    `<p><strong>Embla Medical</strong> (until 2024 called Össur) is an Icelandic company best known for prosthetic legs and feet. It also has a <strong>Bracing &amp; Supports</strong> business selling orthopaedic braces, the same kind of product BraceWorks makes. It reports in <strong>US dollars</strong>, so its numbers sit right next to yours.</p>
     <div class="hunt-open">${BW.reportBtn('embla','about','Open Embla Medical\'s 2024 report')}<span class="small" style="color:var(--muted)">Statements in USD thousands; five-year overview in USD millions. Answer in USD millions.</span></div>`,
    hunt('embla','Find it in Embla Medical\'s 2024 report',[
      {q:'Net sales for 2024 (in USD millions)', unit:'USD M', ans:855, tol:1, page:'five', where:'The five-year overview, or the first line of the income statement (854,889 in thousands).', why:'Up 9% from $786m in 2023.'},
      {q:'Organic growth in 2024', unit:'%', ans:6, tol:0.3, page:'five', where:'Five-year overview, under sales growth; also the growth analysis on the "Segments and growth" page.', why:'Reported growth was 9%. Currency was neutral, so the other 3 points came from buying businesses.'},
      {q:'How many percentage points of 2024 growth came from acquisitions?', unit:'points', ans:3, tol:0.5, page:'seg', where:'The growth analysis: organic + acquisitions + currency = growth in USD.', why:'All of it in Prosthetics & Neuro Orthotics (6 points there), from Fior & Gentz, bought on 1 January 2024. Growth you buy is not the same as growth you earn: it costs cash or new shares, and adds goodwill.'},
      {q:'Bracing & Supports sales in 2024 (in USD millions)', unit:'USD M', ans:148, tol:1, page:'seg', where:'Segment information: sales by business segment (148,386 in thousands).', why:'Under a fifth of group sales. Prosthetics & Neuro Orthotics, at $451m, is three times bigger.'},
      {q:'Organic growth of Bracing & Supports in 2024', unit:'%', ans:1, tol:0.3, page:'seg', where:'The growth analysis table, business segment rows.', why:'Only 1%, against 9% for prosthetics and 6% for the group. Bracing is a mature, price-competitive market even for a global leader. That\'s useful context for BraceWorks\' own growth plans and pricing.'},
      {q:'Gross margin in 2024 (to the nearest whole %)', unit:'%', ans:63, tol:0.6, page:'is', where:'Five-year overview key ratios, or gross profit ÷ net sales from the income statement.', why:'More than double BraceWorks\' margin. Prosthetics are high-tech, fitted to each patient, and partly sold through Embla\'s own clinics, so the margin is very different from a manufacturer selling to distributors.'},
      {q:'EBITDA margin before special items in 2024', unit:'%', ans:20, tol:0.5, page:'notes', where:'Five-year overview, or the EBITDA table under "Selected notes".', why:'EBITDA was $169.1m; before $4.1m of special items, all in the first quarter, it was $173.3m: 20% of sales.'},
      {q:'Free cash flow in 2024 (in USD millions)', unit:'USD M', ans:77, tol:1, page:'cf', where:'Five-year overview. Check it in the cash flow statement: net cash from operating activities minus purchase of fixed and intangible assets.', why:'116,066 − 39,227 = 76,839 thousand, 9% of sales. Notice the cash flow statement shows two subtotals: "cash generated from operations" ($160m, before interest and tax) and "net cash generated from operating activities" ($116m, after them). Know which one you\'re comparing.'},
      {q:'Goodwill on the balance sheet at the end of 2024 (in USD millions)', unit:'USD M', ans:776, tol:2, page:'bs', where:'Balance sheet, non-current assets (776,306 in thousands).', why:'Up from $691m: $104.5m came from the Fior & Gentz acquisition, partly offset by $19m of currency movements. See the goodwill table under "Selected notes".'},
      {q:'Calculate goodwill as a share of total assets', unit:'%', ans:50, tol:1.5, page:'bs', where:'Goodwill ÷ total assets, both on the balance sheet: 776,306 ÷ 1,538,965 × 100.', why:'Half the balance sheet is goodwill: the premium paid for businesses above the value of their assets. It isn\'t cash and can\'t be sold. If acquired businesses underperform, it gets written down, as Invacare\'s was in 2021. That\'s why auditors test it every year.'},
      {q:'Net interest-bearing debt ÷ EBITDA before special items, end of 2024', unit:'×', ans:2.4, tol:0.05, page:'notes', where:'Five-year overview (NIBD to EBITDA), or the net interest-bearing debt table under "Selected notes".', why:'Down from 2.8× in 2023, inside the company\'s own target range of 2.0–3.0×. Net debt of $414m includes lease liabilities.'}
    ],'embla'),
    {t:'fig', title:'Embla Medical: organic growth by business', draw:BW.viz.vbars({label:'Organic growth by segment, 2023 and 2024: Prosthetics 13% and 9%, Patient Care 8% and 5%, Bracing and Supports 3% and 1%.',x:['Prosthetics','Patient Care','Bracing & Supports'],xName:'Segment',fmt:v=>v+'%',values:true,
      series:[{name:'2023',c:'muted',v:[13,8,3]},{name:'2024',c:'s1',v:[9,5,1]}]}),
      caption:'Segment notes show which parts of a business are carrying it. In both years bracing grew slowest. Source: Embla Medical annual reports 2023 and 2024 (prosthetics renamed Prosthetics & Neuro Orthotics in 2024).'},
    Q('Embla grew 9% in 2024: 6% organic, 3% from acquisitions. Why separate them?',['They mean the same thing','Organic growth shows how the existing business performed; acquired growth was bought with cash or shares and adds goodwill','Acquisitions don\'t count as sales','To reduce tax'],1,'A company can show steady growth for years by buying it, while the underlying business stalls. Always look for the split.'),
    Q('Half of Embla\'s total assets are goodwill. What\'s the main risk for a reader?',['Goodwill will run out','If acquired businesses underperform, goodwill is written down, cutting profit and equity, though no cash leaves at that point','Goodwill must be repaid to the bank','There is no risk'],1,'Goodwill reflects past prices paid. It is tested every year, and a write-down tells you an acquisition didn\'t deliver.')
  ]},
  /* ------------------------------------------------------------ 4 */
  {id:'invacare', label:'Case: road to bankruptcy', kind:'case', title:'Case file: Invacare, 2019 to 2023', blocks:[
    CASE('Four annual reports, one ending',
      `<p><strong>Invacare</strong> was a US company making wheelchairs, homecare beds, therapeutic mattresses and patient lifts, with almost $1 billion of sales. On 31 January 2023 it filed for Chapter 11 bankruptcy protection. The old shareholders lost everything.</p>
       <p>You'll read its last four annual reports in order, as a GM or lender would have at the time. In each year, decide what the numbers were saying. All figures are US$ millions from the company's Form 10-K filings, which you can open in full in the course.</p>
       <div class="hunt-open">${BW.reportBtn('ivc21','is','2021 10-K','btn ghost small')}${BW.reportBtn('ivc22','is','2022 10-K','btn ghost small')}</div>`),
    W('Read the reports as they arrived', function(el,ctx){
      const S=ctx.state; S.ivc=S.ivc||{y:0,a:{}}; const st=S.ivc;
      const row=(lab,k,fmt)=>{ return `<tr><td>${lab}</td>${IVC.map((r,i)=>`<td class="num ${i===st.y?'cur':''} ${i>st.y?'fut':''}">${i>st.y?'?':fmt(r[k])}</td>`).join('')}</tr>`; };
      const draw=()=>{ const q=IVCQ[st.y];
        el.innerHTML=`<div class="ivc-years" role="tablist">${IVC.map((r,i)=>`<button type="button" class="chip plain ${i===st.y?'is-active':''}" ${i>st.y&&st.a[i-1]===undefined?'disabled':''} data-y="${i}">${r.y}</button>`).join('')}</div>
          <div class="eyebrow" style="margin-top:10px">${q.when}</div><p style="margin:4px 0 10px">${q.story}</p>
          <div class="tbl"><table class="grid ivc-t"><thead><tr><th>US$ m</th>${IVC.map((r,i)=>`<th class="num ${i===st.y?'cur':''}">${i>st.y?'':r.y}</th>`).join('')}</tr></thead><tbody>
          ${row('Net sales','sales',v=>v.toFixed(1))}${row('Gross margin','gm',v=>v.toFixed(1)+'%')}${row('Operating income','op',m1)}${row('Net loss','nl',m1)}${row('Operating cash flow','ocf',m1)}${row('Capital spending','capex',v=>v.toFixed(1))}${row('Cash at year-end','cash',v=>v.toFixed(1))}${row('Total debt','debt',v=>v.toFixed(1))}${row('Shareholders\' equity','eq',v=>v.toFixed(1))}${row('Inventories','inv',v=>v.toFixed(1))}${row('Goodwill','gw',v=>v.toFixed(1))}
          </tbody></table></div><div class="ivc-q"></div>`;
        const qb=el.querySelector('.ivc-q'); const box=document.createElement('div'); box.className='quiz';
        box.innerHTML=`<div class="quiz-q"><span class="quiz-tag">Your call</span><p>${q.q}</p></div><div class="quiz-opts"></div><div class="quiz-why" hidden></div>`; qb.appendChild(box);
        const oe=box.querySelector('.quiz-opts'), why=box.querySelector('.quiz-why'); const btns=[];
        const show=c=>{ btns.forEach((b,j)=>{ b.disabled=true; b.classList.toggle('is-right',j===q.a); b.classList.toggle('is-wrong',j===c&&c!==q.a); b.classList.toggle('is-dim',j!==q.a&&j!==c); }); why.hidden=false;
          why.innerHTML=`<p><strong>${c===q.a?'Right.':'Not quite.'}</strong> ${q.why}</p>`;
          const nb=document.createElement('button'); nb.type='button'; nb.className='btn small'; nb.style.marginTop='8px';
          if(st.y<IVC.length-1){ nb.textContent=`Open the ${IVC[st.y+1].y} report`; nb.onclick=()=>{ st.y++; ctx.save(); draw(); }; }
          else { nb.textContent='See what happened next'; nb.onclick=()=>{ st.y=IVC.length-1; st.end=true; ctx.save(); draw(); }; }
          why.appendChild(nb); };
        q.opts.forEach((o,j)=>{ const b=document.createElement('button'); b.type='button'; b.className='opt'; b.innerHTML=`<span class="ol">${'ABCD'[j]}</span><span>${o}</span>`; b.onclick=()=>{ st.a[st.y]=j; ctx.save(); show(j); }; oe.appendChild(b); btns.push(b); });
        if(st.a[st.y]!==undefined) show(st.a[st.y]);
        el.querySelectorAll('[data-y]').forEach(b=>b.onclick=()=>{ st.y=+b.dataset.y; st.end=false; ctx.save(); draw(); });
        if(st.end&&st.y===IVC.length-1){ const out=document.createElement('div'); out.className='ivc-end';
          out.innerHTML=`<h4>What happened next</h4><ul class="ivc-tl">
            <li><b>31 Jan 2023</b>Filed for Chapter 11 in Texas, with a plan agreed with creditors to cut debt by about $240m.</li>
            <li><b>1 Feb 2023</b>The New York Stock Exchange suspended trading; the shares were delisted later that month.</li>
            <li><b>14 Apr 2023</b>The 2022 annual report was filed, late. It now said the risks raised "substantial doubt" about the company's ability to continue as a going concern.</li>
            <li><b>5 May 2023</b>Emerged from Chapter 11 as Invacare Holdings. $223m of convertible notes and unpaid interest were wiped out, creditors became the new owners, and the old shares were cancelled with nothing paid to shareholders.</li></ul>
            <p class="w-hint">Score: ${IVCQ.filter((x,i)=>st.a[i]===x.a).length} of 4 right. The formal going-concern warning came <strong>after</strong> the bankruptcy filing. The cash flow statement, the debt note and the balance sheet had been telling the story for three years.</p>
            <button type="button" class="linkbtn" data-restart>Read the four reports again</button>`;
          el.appendChild(out); out.querySelector('[data-restart]').onclick=()=>{ S.ivc={y:0,a:{}}; ctx.save(); BW.go('m21',ctx.mod.sections.indexOf(ctx.sec)); }; }
      };
      draw();
    }),
    {t:'fig', title:'Invacare: the cash went first', draw:BW.viz.line({label:'Invacare operating cash flow and free cash flow, 2019 to 2022, in US dollars millions. Operating cash flow went from 2.7 to minus 55.3.',x:['2019','2020','2021','2022'],xName:'Year',xw:28,fmt:v=>(v<0?'−$'+(-v):'$'+v)+'m',tfmt:v=>m1(v)+'m',dots:true,zero:true,ticks:4,
      series:[{name:'Operating cash flow',short:'Operating',c:'s1',v:[2.7,21.9,-14.3,-55.3]},{name:'Free cash flow (after capital spending)',short:'Free',c:'s2',v:[-8.2,-0.4,-32.0,-59.1]}]}),
      caption:'Free cash flow here is operating cash flow minus capital spending, worked out from the 10-K figures. It was negative in all four years, and the gap was filled with borrowing.'},
    {t:'fig', title:'Debt up, equity down', draw:BW.viz.vbars({label:'Invacare total debt rose from 219.5 to 354.2 million dollars while equity fell from 308.5 to 81.1 million, 2019 to 2022.',x:['2019','2020','2021','2022'],xName:'Year',fmt:v=>'$'+v+'m',tfmt:v=>'$'+v.toFixed(1)+'m',values:true,vfmt:v=>Math.round(v),
      series:[{name:'Total debt',c:'s2',v:[219.5,245.1,308.1,354.2]},{name:'Shareholders\' equity',c:'s1',v:[308.5,333.8,218.5,81.1]}]}),
      caption:'Debt went from 0.7 times equity to 4.4 times. Each year\'s losses ate into the owners\' cushion, while lenders\' claims grew.'},
    {t:'tbl', head:['Signal','Where it showed','First visible'], rows:[
      ['Free cash flow negative every year','Cash flow statement','2019 report'],
      ['Debt refinanced by swapping notes for later-dated ones, again and again','Debt note; news releases','2019 report'],
      ['Profit flattered by a one-off gain','Income statement; notes','2020 report'],
      ['Inventory growing ten times faster than sales','Balance sheet','2021 report'],
      ['Goodwill written down after a system change','Income statement; goodwill note','2021 report'],
      ['Equity falling far faster than the reported loss','Balance sheet; statement of changes in equity','2021 report'],
      ['Secured loan at SOFR + 7%; capital spending cut to $3.8m','Debt note; cash flow statement','2022 report'],
      ['Annual report filed late; "substantial doubt" about going concern','Filing dates; Note 1 and risk factors','April 2023, after the filing']
    ]},
    `<p><strong>Your turn with the real filings.</strong> Both 10-K reports are in the course. In the <strong>2021 10-K</strong>, find the three lines that tell the story: inventories on the balance sheet, net cash from operating activities, and the convertible notes due in November 2024 in the debt note. Then open the <strong>2022 10-K</strong>: read Note 1 on going concern, and compare the debt note with the year before. What changed, and who now ranks first?</p>
     <div class="hunt-open">${BW.reportBtn('ivc21','is','Open the 2021 10-K')}${BW.reportBtn('ivc22','gc','Open the 2022 10-K','btn ghost small')}</div>
     <p class="small" style="color:var(--muted)">For the full filings, including the auditor's report in Item 8, use the links on each report's first page.</p>`,
    K('The lesson for BraceWorks',
      `<p>Invacare's gross margin in 2019 was 28%, close to BraceWorks'. Size didn't protect it. What sank it was the pattern Module 5 warned about: cash going out faster than it came in, covered year after year by new borrowing, until lenders stopped believing. Read your own accounts for the same signs: free cash flow, debt maturities, and equity trend, every year.</p>`)
  ]},
  /* ------------------------------------------------------------ 5 */
  {id:'notes', label:'Notes and audit report', kind:'learn', title:'Reading the notes and the auditor\'s report', blocks:[
    `<p>The statements give totals. The notes tell you what's inside them, and what's coming. Most annual reports have 25 to 40 notes. You only need a handful for a first read.</p>`,
    {t:'tbl', head:['Note','The question it answers','Real example'], rows:[
      ['<strong>Segment information</strong>','Which parts of the business grow, and which earn the profit?','Embla: Bracing & Supports grew 1% organically in 2024, prosthetics 9%.'],
      ['<strong>Business combinations</strong>','What was bought, for how much, and how was it paid for?','Embla bought Fior & Gentz in 2024 for a mix of new shares and cash, adding about $104m of goodwill.'],
      ['<strong>Borrowings or debt</strong>','How much is owed, at what rate, and when is it due?','Invacare\'s 2021 note showed about $150m of notes due in November 2024.'],
      ['<strong>Goodwill and impairment testing</strong>','Are past acquisitions still worth what was paid?','Invacare wrote off $28.6m of North American goodwill in 2021.'],
      ['<strong>Provisions and contingent liabilities</strong>','What costs or claims are expected but not yet paid?','Warranty, product liability and legal claims: big for medical devices.'],
      ['<strong>Related parties</strong>','Does the business deal with its owners, directors or their companies?','Loans, rent or sales to owners, which should be on normal terms.'],
      ['<strong>Events after the reporting date</strong>','Has anything big happened since year-end?','Invacare\'s 2022 report came out after its Chapter 11 filing.']
    ]},
    {t:'fig', title:'Invacare\'s repayment wall, as the 2021 debt note showed it', draw:BW.viz.vbars({label:'Invacare convertible notes by year due, from the 2021 debt note: about 150 million dollars due in 2024 and 119 million in 2026.',x:['2022','2023','2024','2025','2026'],xName:'Year due',fmt:v=>'$'+v+'m',tfmt:v=>'$'+v.toFixed(1)+'m',values:true,vfmt:v=>v?Math.round(v):'',
      series:[{name:'Convertible notes due',c:'s2',v:[2.6,0,150.4,0,119.0]}]}),
      caption:'Carrying values of the convertible notes in the debt note of the 2021 10-K: 2024 Series I $72.1m plus Series II $78.3m; 2026 notes $119.0m (face value $125m). Other borrowing ($36.1m, mainly the revolving credit line) is not shown. With $83.7m of cash and negative operating cash flow, the 2024 wall could only be met by refinancing.'},
    `<div class="hunt-open">${BW.reportBtn('ivc21','debt','Open the debt note in the 2021 10-K','btn ghost small')}</div>`,
    Q('In March 2022 a supplier is deciding whether to give Invacare longer payment terms. What does the debt note add?',['Nothing beyond the balance sheet','It shows about $150m of notes due in November 2024 that the company couldn\'t repay from cash or operations, so a refinancing or restructuring was coming','It shows the interest rate is low, so the company is safe','It shows the notes can be converted into shares, so they don\'t need repaying'],1,'The balance sheet gives the total. The debt note gives the dates. A big repayment that cash flow can\'t cover is a risk to everyone the company owes money to, suppliers included.'),
    `<h3>The auditor's report</h3><p>It's usually two to four pages, just before or after the statements. Learn the handful of standard forms and you can read any of them in two minutes.</p>`,
    FLIP([
      {f:'Unmodified (clean) opinion', b:'The statements give a true and fair view, or "present fairly", under the accounting rules. This is what you want to see.'},
      {f:'Qualified opinion: "except for…"', b:'Fair overall, except for one specific area where the auditor disagrees or couldn\'t get evidence. Read exactly what is excluded.'},
      {f:'Adverse opinion', b:'The statements are materially wrong. Rare, and very serious.'},
      {f:'Disclaimer of opinion', b:'The auditor couldn\'t get enough evidence to form any opinion. Treat the numbers as unverified.'},
      {f:'Material uncertainty related to going concern', b:'Under international auditing standards, a separate section saying there is significant doubt the business can keep going. In the US the wording is "substantial doubt". The opinion can still be clean.'},
      {f:'Emphasis of matter', b:'The auditor draws attention to something already disclosed in the notes, such as a big lawsuit or a fire. The opinion isn\'t changed.'},
      {f:'Key audit matters', b:'For listed companies: the areas the auditor judged most significant, such as goodwill impairment, revenue or inventory. In US reports they are called critical audit matters. A preview of where the judgement calls are.'}
    ]),
    SORT('Which note would you open first?',['Segments','Debt','Goodwill','Related parties'],[
      {text:'A competitor says its home-care division is "growing fast". Is it?', a:0, why:'The segment note gives sales, and often profit, by division.'},
      {text:'A customer has a large loan. When does it fall due?', a:1, why:'The borrowings note lists each loan with its rate and maturity.'},
      {text:'A distributor bought two rivals last year. Did it overpay?', a:2, why:'The goodwill note shows the impairment test and any write-downs.'},
      {text:'Your factory rents its building from the owner\'s family company. Is it disclosed, and on normal terms?', a:3, why:'Related-party transactions must be disclosed.'},
      {text:'Which product lines earn the best margin?', a:0, why:'If the company reports segments by product line, the segment note shows it.'},
      {text:'Has the company breached, or come close to, a loan covenant?', a:1, why:'Covenant compliance is usually discussed in the debt note, or in risk and liquidity notes.'}
    ])
  ]},
  /* ------------------------------------------------------------ 6 */
  {id:'compare', label:'Compare like an analyst', kind:'play', title:'Compare companies like an analyst', blocks:[
    `<p>Amounts tell you size; ratios tell you quality. Ratios work across currencies and sizes, which is how you compare a SEK 11 billion company with a $1.2 million one. But only when the definitions match.</p>`,
    {t:'tbl', head:['Ratio','Arjo 2024','Embla 2024','Invacare 2021','Brace­Works'], opts:{num:[1,2,3,4]}, rows:[
      ['Gross margin','43.5%','62.5%','27.4%','28.3%'],
      ['Operating margin','7.9%','13.2%','(2.8%)','7.8%'],
      ['Cash conversion¹','76.7%','68.6%','n/a','25.0%'],
      ['DSO (days)','58','52','49','70'],
      ['Net debt ÷ EBITDA²','2.0×','2.4×','n/m','1.35×']
    ]},
    `<p class="small" style="color:var(--muted)">Arjo and Embla from their 2024 reports; Invacare from its 2021 10-K; BraceWorks from Module 1. Operating margin is EBIT ÷ sales. ¹ Operating cash flow after interest and tax ÷ EBITDA; Invacare's 10-K figures here don't include EBITDA. ² Arjo uses adjusted EBITDA and Embla EBITDA before special items; with losses, Invacare's ratio is not meaningful (n/m). Embla's cash ratio uses net cash from operating activities ($116m), which, like Arjo's figure, is after interest and tax. Embla's "cash generated by operations" ($160m) is before them, and would give 95%.</p>`,
    W('Work out three ratios yourself', function(el,ctx){
      const T=[
        {q:'Invacare 2021 operating margin: operating income (−24.2) ÷ net sales (872.5)',ans:-2.8,tol:0.1,unit:'%',why:'A loss of 2.8% of sales. Take out the $28.6m goodwill write-down and it was about +0.5%: barely above break-even, even before the cash problems.'},
        {q:'Invacare inventory days in 2021: inventories (144.3) ÷ cost of sales (872.5 − 239.1 = 633.4) × 365',ans:83,tol:1.5,unit:'days',why:'About 83 days, up from about 70 in 2020. Fourteen extra days of stock is roughly $24m of cash sitting in the warehouse.'},
        {q:'Embla 2024 operating margin: EBIT (113.2) ÷ net sales (854.9)',ans:13.2,tol:0.1,unit:'%',why:'Embla keeps 13 cents of every sales dollar as operating profit, against 7.8 cents at BraceWorks and 7.9 at Arjo.'}
      ];
      const S=ctx.state; S.cmp=S.cmp||{};
      el.innerHTML=T.map((t,i)=>`<div class="hunt-i" data-i="${i}"><div class="hunt-q">${t.q}</div><div class="hunt-row"><input class="hunt-in" type="text" inputmode="decimal" aria-label="Your answer" id="${ctx.uid('c'+i)}"><span class="hunt-u">${t.unit}</span><button type="button" class="btn small">Check</button></div><div class="hunt-fb" hidden></div></div>`).join('');
      el.querySelectorAll('.hunt-i').forEach(row=>{ const i=+row.dataset.i, t=T[i], inp=row.querySelector('input'), fb=row.querySelector('.hunt-fb'), b=row.querySelector('button');
        const ok=()=>{ row.classList.add('is-ok'); inp.value=String(t.ans); inp.disabled=true; b.disabled=true; fb.hidden=false; fb.innerHTML=`<p><strong>Right.</strong> ${t.why}</p>`; };
        if(S.cmp[i]) ok();
        const go=()=>{ const v=parseFloat(String(inp.value).replace(/^\((.*)\)$/,'-$1').replace(/[%,\s]|days?/gi,'')); if(isNaN(v)){ fb.hidden=false; fb.innerHTML='<p>Type a number.</p>'; return; }
          if(Math.abs(v-t.ans)<=t.tol){ S.cmp[i]=1; ctx.save(); ok(); } else { fb.hidden=false; fb.innerHTML=`<p><strong>Not quite.</strong> ${t.ans<0&&v>0?'Watch the sign: an operating loss gives a negative margin. ':''}Check the formula, and multiply by ${t.unit==='%'?'100':'365'}.</p>`; } };
        b.onclick=go; inp.addEventListener('keydown',e=>{ if(e.key==='Enter') go(); }); });
    }),
    Q('Invacare collected cash from customers faster (49 days) than BraceWorks (70 days), yet went bankrupt. What does that teach?',['DSO doesn\'t matter','No single ratio tells the story: Invacare\'s problem was losses, cash burn and debt, not collections','BraceWorks is about to fail','Invacare\'s figures were wrong'],1,'Read ratios as a set, and over several years. One good ratio can sit next to several fatal ones.'),
    K('Three rules for comparing',
      `<ol><li><strong>Compare ratios, not amounts.</strong> Size and currency drop out.</li><li><strong>Check the definitions.</strong> "Adjusted", "before special items", "cash from operations": each company draws the line in its own place. Read the definitions page.</li><li><strong>Compare similar business models, over three years.</strong> A rental-heavy company or a clinic chain will always show a higher gross margin than a manufacturer selling to distributors. One year can be a fluke; three years make a trend.</li></ol>`)
  ]},
  /* ------------------------------------------------------------ 7 */
  {id:'quiz', label:'Quiz', kind:'quiz', title:'Check your understanding', blocks:[
    Q('Which part of an annual report has been audited?',['Everything in it','The financial statements and their notes','The chair\'s letter and highlights','Only the sustainability report'],1,'The auditor\'s opinion covers the statements and notes. The front half is management\'s own presentation, though the auditor reads it for consistency.'),
    Q('Arjo reported "exceptional items" in 2022, 2023 and 2024, and its adjusted EBITDA adds them back. What\'s the sensible reading?',['Ignore them: they\'re exceptional','Treat costs that recur every year as part of normal running costs, and look at the unadjusted figures too','Add them to sales','They prove the company is failing'],1,'An "exceptional" cost that appears every year is a normal cost with a flattering label.'),
    Q('What does organic growth exclude?',['Price increases','The effect of currency movements and businesses bought or sold','New products','Sales to new customers'],1,'Organic growth shows how the business you already had performed.'),
    Q('Invacare reported operating income of $11.3m in 2020, including a $9.8m gain on selling a business. What was the underlying figure?',['$21.1m','About $1.5m','$11.3m','A loss of $9.8m'],1,'Take one-off gains out to see what the ongoing business earned.'),
    Q('Which was the earliest reliable warning of Invacare\'s trouble?',['The going-concern language in the 2022 report','Negative free cash flow, funded year after year by rolling debt forward','The NYSE notice in 2022','The bankruptcy filing'],1,'The formal warnings came last. The cash flow statement and debt note showed the pattern from 2019.'),
    Q('You want to compare Arjo (reports in SEK) with Embla (reports in USD). What\'s the best approach?',['Convert everything at today\'s exchange rate','Compare ratios such as margins and DSO, using matching definitions','Compare total sales','It can\'t be done'],1,'Ratios remove currency and size. Matching definitions removes the rest of the noise.'),
    Q('Where can you get a UK private competitor\'s accounts for free?',['From its auditor','Companies House','The UK tax authority','You can\'t'],1,'Every UK company files accounts at Companies House, free to view online. Small companies may file shortened versions.'),
    Q('An auditor\'s report includes a section headed "Material uncertainty related to going concern". What does that mean?',['The accounts are wrong','The auditor agrees with the accounts, but there is significant doubt the business can continue: read the note it points to','The company has been fined','The audit was incomplete'],1,'The opinion can still be clean. The section points you to the note explaining the doubt, and it\'s often the most important page in the report.')
  ]},
  /* ------------------------------------------------------------ 8 */
  {id:'apply', label:'Practice', kind:'apply', title:'Read a real report on your own', blocks:[
    `<p>Now pick a report and go through it yourself: a competitor, a big customer, a key supplier, or your own audited financial statements. The <strong>annual report reader</strong> template does the ratios and flags the warning signs. It comes filled in with Invacare's 2019 to 2022 figures so you can see it light up.</p>`,
    {t:'live', render(box){
      const f='annual-report-reader.xlsx', d=(BW.tmplData||{})[f];
      box.innerHTML=`<div class="tmpl" style="max-width:520px"><div class="tmpl-h"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h4"/><circle cx="17" cy="17" r="3"/><path d="M19.2 19.2l2 2"/></svg><div><h4>Annual report reader</h4><div class="tmpl-f">${f}</div></div></div><p>Type in three to four years of figures from any annual report. The template works out margins, cash conversion, free cash flow, working-capital days, debt ratios and goodwill share, and flags the warning signs from this module.</p><div class="tmpl-a"><button type="button" class="btn small" ${d?'':'disabled'}>Download .xlsx</button><span class="small tmpl-s" role="status" aria-live="polite"></span></div></div>`;
      const b=box.querySelector('button'), st=box.querySelector('.tmpl-s');
      b.onclick=()=>{ const bin=atob(d), u=new Uint8Array(bin.length); for(let i=0;i<bin.length;i++) u[i]=bin.charCodeAt(i); b.disabled=true;
        BW.saveFile(f,new Blob([u],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}),t=>{ st.textContent=t; }).finally(()=>{ b.disabled=false; }); };
    }},
    CHECK('m21-read','My 20-minute read of a real report',[
      'Read the auditor\'s report: opinion, any going-concern or emphasis section, key audit matters',
      'Cash flow statement: operating cash flow vs profit, capital spending, free cash flow, how any gap was funded',
      'Balance sheet: cash, debt and equity trend; receivables and inventory against sales; goodwill against equity',
      'Income statement: sales growth, gross margin trend, one-off gains or costs',
      'Notes: segments, debt maturities, acquisitions and goodwill, provisions, related parties, events after year-end',
      'Management\'s own measures: found the definitions and the reconciliation to audited figures',
      'Front half: tested at least three of management\'s claims against the numbers',
      'Wrote three sentences: how the company is doing, its biggest risk, and what I\'d watch next year'
    ]),
    REPORT('Your Monday-morning request',
      `<p>Ask your accountant for <strong>last year's full audited financial statements</strong>: every note, the auditor's report, and the management letter the auditor sent. Then do the 20-minute read on your own company. What would a lender or buyer conclude from those pages alone?</p>`),
    TIP('Good reports to practise on',
      `<ul><li><strong>Arjo</strong> and <strong>Embla Medical</strong>: from this module; try their 2023 reports and compare.</li><li><strong>Getinge</strong> (Sweden): hospital equipment, a larger cousin of Arjo.</li><li><strong>Enovis</strong> (US, 10-K on EDGAR): owns DJO, a large orthopaedic bracing brand.</li><li><strong>A UK competitor</strong> from Companies House: search for a mattress or mobility-aids maker and read its filed accounts.</li><li><strong>A Philippine listed company</strong> on PSE EDGE: any manufacturer, to see local reporting under PFRS.</li></ul>`),
    `<p>For more practice reading <em>monthly</em> management reports, the four BraceWorks practice packs are in the Toolkit menu under <strong>Practice packs</strong>.</p>`
  ]}
  ],
  warnings:[
    {sign:'"Exceptional" or "special" items every year', meaning:'Normal costs presented as one-offs to flatter adjusted profit.', look:'Three years of exceptional items; unadjusted profit.'},
    {sign:'Adjusted profit rising while cash conversion falls', meaning:'Profit tied up in receivables and inventory, or not real cash.', look:'Cash flow statement; working-capital lines.'},
    {sign:'Debt repeatedly refinanced by swapping for later-dated notes', meaning:'The business can\'t repay from cash; it\'s buying time.', look:'Debt note maturities; free cash flow.'},
    {sign:'Equity falling faster than the reported loss', meaning:'Other losses going straight to equity: currency, pensions, or financing costs.', look:'Statement of changes in equity.'},
    {sign:'Goodwill larger than equity', meaning:'A write-down could wipe out most of the owners\' cushion.', look:'Goodwill note and impairment test assumptions.'},
    {sign:'Annual report filed late', meaning:'Often a sign of an audit problem or a crisis.', look:'Filing dates; auditor\'s report; going-concern note.'}
  ],
  formulas:[
    {name:'Organic growth', f:'Sales growth − effect of acquisitions and disposals − currency effect', ex:'Embla 2024: 9% reported − 3% acquisitions − 0% currency = 6%'},
    {name:'Goodwill share of assets', f:'Goodwill ÷ Total assets', ex:'Embla 2024: $776m ÷ $1,539m = 50%'},
    {name:'Recurring revenue share', f:'(Rental + Service + Consumables sales) ÷ Total sales', ex:'Arjo 2024: 25% + 20% + 16% = 61%'}
  ],
  glossary:[
    {term:'Annual report', def:'A company\'s yearly report to shareholders: management\'s review at the front, audited financial statements and notes at the back.'},
    {term:'Form 10-K', def:'The annual report US listed companies file with the Securities and Exchange Commission, free on EDGAR.'},
    {term:'Alternative performance measure', def:'A figure management uses that accounting standards don\'t define, such as adjusted EBITDA or organic growth. Should be reconciled to audited figures.'},
    {term:'Organic growth', def:'Sales growth excluding currency effects and businesses bought or sold: how the existing business performed.'},
    {term:'Adjusted EBITDA', def:'EBITDA with costs management calls exceptional or one-off added back. Check what was added back, and whether it recurs.'},
    {term:'Exceptional items', def:'Costs or gains a company shows separately as unusual, such as restructuring or acquisition costs. Also called special items or items affecting comparability.'},
    {term:'Key audit matters', def:'In a listed company\'s auditor\'s report, the areas the auditor judged most significant. Called critical audit matters in the US.'},
    {term:'Material uncertainty related to going concern', def:'A section of the auditor\'s report saying there is significant doubt the business can continue, pointing to the note that explains why.'},
    {term:'Segment reporting', def:'The note splitting sales and results by business line or region, as management runs the business.'},
    {term:'Business combination', def:'An acquisition of a business. The note shows what was paid, how, and how much became goodwill.'},
    {term:'Convertible notes', def:'Bonds that the holder can swap for shares. If they aren\'t converted, they must be repaid in cash when due.'},
    {term:'Chapter 11', def:'US bankruptcy procedure that lets a company keep operating while it restructures its debts under court protection.'},
    {term:'Statement of changes in equity', def:'The statement showing everything that changed the owners\' equity in the year: profit or loss, dividends, new shares and other gains or losses.'},
    {term:'Recurring revenue', def:'Sales that repeat without a new sale each time, such as rentals, service contracts and consumables.'},
    {term:'Net interest-bearing debt', def:'All borrowings that carry interest, often including leases, minus cash.'}
  ]
});
})();
