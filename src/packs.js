/* ===== Practice packs: fictional monthly management reports ===== */
(function(){
const {K,TIP,FLAG,CASE,REPORT,Q,FS,FLIP,SORT,CHECK,W,money,signed,pct,kfmt} = BW.h;
const DH=(month,page,label,issued)=>({t:'html',html:`<div class="doc-head"><span><strong>BraceWorks Medical</strong> · Monthly management report · ${month}</span><span>${label}${issued?' · '+issued:''} · p.${page}</span></div>`});
const TXT=html=>({t:'html',cls:'doc-text',html});
const tiles=list=>({t:'html',html:`<div class="stats">${list.map(x=>BW.ui.stat(x[0],x[1],x[2]||'',x[3]||'')).join('')}</div>`});
const GRADE=(id)=>({t:'widget',title:'Grade this pack',render(el,ctx){
  el.innerHTML='<p class="w-hint">Score this pack on the 20-point scorecard in Module 9, then compare your grades with the expert grading.</p>';
  const b=document.createElement('button'); b.type='button'; b.className='btn small'; b.textContent='Grade it in the scorecard'; b.onclick=()=>{ ctx.state.scTarget=id; ctx.save(); BW.go('m9',2,{jump:true}); }; el.appendChild(b);
}});
const k=x=>'$'+x.toLocaleString('en-US');

/* ------------------------------------------------------------------ PACK A */
BW.addPack({
  id:'packA', code:'A', month:'October, last year', scenario:'a weak, typical small-company report',
  title:'The old October report',
  blurb:'How BraceWorks reported before you arrived: a printout from the accounting system and three lines of comment, issued late. Good for learning what\'s missing.',
  usedIn:'Modules 1, 2 and 9',
  subtitle:'The report the owner received for October last year, before you joined. It\'s reproduced exactly as issued.',
  grades:[0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,1],
  sections:[
  {id:'about', label:'About this pack', kind:'learn', title:'About this pack', blocks:[
    `<p>This is a typical small-company report: an export of the profit and loss account from the accounting software, plus a short note from the bookkeeper. It was emailed to the owner on <strong>24 November</strong>, 17 working days after month-end.</p>
     <p>Nothing in it is wrong as arithmetic. The question is whether you could run a business from it. Read the two pages, then try the review questions.</p>`,
    TIP('What to look for',
      `<p>As you read, keep a list: what can't you see? What would you want to compare each number with? Which lines would you ask about?</p>`)
  ]},
  {id:'pl', label:'Profit and loss', kind:'learn', title:'Profit and loss statement', blocks:[
    DH('October',1,'As issued','24 November'),
    FS({title:'Profit and Loss Statement', sub:'1 October to 31 October', rows:[
      ['Sales', 96000],
      ['Cost of Sales', -70600],
      ['Gross Profit', 25400, 'sub'],
      'Expenses',
      ['Salaries', -8100,'ind'],['Rent', -3000,'ind'],['Freight', -4950,'ind'],['Commission', -1920,'ind'],['Professional Fees', -900,'ind'],
      ['Insurance', -670,'ind'],['Repairs & Maintenance', -1450,'ind'],['Sundry Expenses', -2870,'ind'],['Bank Charges', -610,'ind'],['Interest', -1170,'ind'],['Exchange Loss', -320,'ind'],
      ['Total Expenses', -25960, 'sub'],
      ['Net Profit / (Loss)', -560, 'total']
    ], note:'Note: depreciation is posted at year end.'})
  ]},
  {id:'comm', label:'Commentary', kind:'learn', title:'Commentary', blocks:[
    DH('October',2,'As issued','24 November'),
    TXT(`<p>October sales were $96,000. Gross profit was $25,400. Expenses were $25,960, resulting in a net loss of $560.</p><p>Cash is tight. We will monitor costs closely.</p>`)
  ]},
  {id:'review', label:'Review', kind:'quiz', title:'Review questions', blocks:[
    Q('Which of the three financial statements does this pack contain?',['All three','Only the income statement (P&L)','The P&L and balance sheet','The P&L and cash flow'],1,'There\'s no balance sheet and no cash flow, yet the commentary says cash is tight. You can\'t see why, or how tight (Module 1).'),
    Q('"Depreciation is posted at year end." What does this do to the monthly profit figures?',['Nothing','Every month\'s profit is overstated by about $3,200, and December takes a large catch-up hit','Monthly profit is understated','It only affects tax'],1,'The real October result was a loss of about $3,760, not $560. A proper month-end close books depreciation monthly (Module 2).'),
    Q('The "Rent" line of $3,000 sits in expenses. What\'s the problem?',['None','It mixes factory rent, which belongs in cost of sales, with office rent, so gross margin is overstated','Rent should be on the balance sheet','It should be split by currency'],1,'Factory costs belong in cost of goods sold. With factory rent below the line, gross margin looks better than it is (Module 3).'),
    Q('Gross margin is 26.5%. Is that good?',['Yes, above 25%','No, below 30%','You can\'t tell: there\'s no budget, last year or trend to compare with','It doesn\'t matter'],2,'A number with nothing to compare it with tells you almost nothing (Module 9).'),
    Q('Which line would you query first?',['Bank charges $610','Sundry expenses $2,870, 3% of sales, with no breakdown','Insurance $670','Interest $1,170'],1,'"Sundry" lines this large hide costs nobody has classified. Ask for the detail (Module 3).'),
    Q('The report arrived on 24 November. What\'s wrong with that?',['Nothing','At 17 working days late, October is history. Any problem has already cost another month.','It should arrive at year-end','Reports should be weekly'],1,'Aim for working day 8 or earlier (Module 9).'),
    GRADE('A')
  ]}
  ]
});

/* ------------------------------------------------------------------ PACK B */
BW.addPack({
  id:'packB', code:'B', month:'March', scenario:'a steady month with a margin squeeze',
  title:'The March pack: what good looks like',
  blurb:'Your first quarter as GM, with the pack rebuilt to the Module 9 standard. Sales are steady, but gross margin is slipping. Dashboard, commentary, statements, variances, cash forecast.',
  usedIn:'Modules 1, 3, 6, 8, 9, 12, 14 and 15',
  subtitle:'Issued 9 April (working day 7). A full pack in the structure from Module 9. Use it as a model, and as a source of practice questions.',
  grades:[2,2,2,2, 2,2,2,1, 2,2,0,2, 2,2,2,2, 2,1,2,2],
  sections:[
  {id:'about', label:'About this pack', kind:'learn', title:'About this pack', blocks:[
    `<p>It's the end of your first quarter. Finance has rebuilt the monthly pack: a one-page dashboard, real commentary, statements with budget and last-year comparisons, product margins, variances, the balance sheet, cash flow, receivables, a 13-week cash forecast and operations.</p>
     <p><strong>The story of the month:</strong> sales are close to plan and the balance sheet is improving, but gross margin has slipped three points. Your job is to understand why, and what to do.</p>`,
    TIP('How to read it',`<p>Dashboard first, then the commentary. Only then go to the statements, looking for the evidence behind what the commentary says.</p>`)
  ]},
  {id:'dash', label:'Dashboard', kind:'learn', title:'Dashboard', blocks:[
    DH('March',1,'Dashboard','Issued 9 April'),
    tiles([
      ['Revenue, March','$102.0k','warn','budget $105.0k · last year $97.0k'],
      ['Gross margin, March','26.7%','bad','target 30.0% · YTD 27.5%'],
      ['Profit before tax, March','$5.2k','bad','budget $9.5k'],
      ['Book-to-bill','1.04','good','orders $106k · backlog 2.1 months'],
      ['On time in full','89%','warn','target 95%'],
      ['Scrap rate','3.8%','bad','target 3.0%'],
      ['Days sales outstanding','68 days','warn','target 60 · was 70 in Dec'],
      ['Inventory days','106 days','bad','target 85'],
      ['Lowest headroom, next 13 weeks','$56k','good','week 6 · minimum $30k'],
      ['Net debt to EBITDA','1.2×','good','covenant ≤ 2.5×']
    ]),
    `<p class="small" style="color:var(--muted)">Red: well off target. Amber: close. Green: on target. Definitions are unchanged from January.</p>`
  ]},
  {id:'comm', label:'Commentary', kind:'learn', title:'Commentary', blocks:[
    DH('March',2,'Commentary'),
    TXT(`<p><strong>Summary.</strong> Sales $102.0k, $3.0k (3%) below budget and 5% above last March. Profit before tax $5.2k against $9.5k budget. The shortfall is mostly gross margin.</p>
      <p><strong>Sales.</strong> Mattresses and slings on budget. Braces $3.2k below: the UK distributor moved a $3.5k order to 4 April (confirmed in writing). Orders received $106k; book-to-bill 1.04; backlog 2.1 months.</p>
      <p><strong>Gross margin 26.7% vs 30.0% budget.</strong> At this volume that's $3.4k. Causes: foam price up 6% from 1 March ($0.8k); foam usage 10% over standard after the new cutting pattern ($1.2k); webbing price ($0.3k); scrap on two brace batches ($0.2k). The rest is lower volume over fixed costs.</p>
      <p><strong>Actions.</strong> Price review proposal to the owner by 15 April (GM). Old cutting pattern restored on 2 April after a trial (Production). Second foam quote due 12 April (Purchasing).</p>
      <p><strong>Cash.</strong> Cash $40.6k. Overdraft $100k of $150k: $20k repaid this quarter, helped by receivables falling $16k. Lowest headroom in the next 13 weeks: $56k in week 6 (quarterly tax plus payroll).</p>
      <p><strong>Outlook.</strong> Q2 forecast $330k sales, $22k profit before tax. Full year unchanged at $1.22M. Risks: further foam increases; euro weakness (40% of April euro receipts hedged).</p>`)
  ]},
  {id:'pl', label:'Income statement', kind:'learn', title:'Income statement', blocks:[
    DH('March',3,'Income statement'),
    FS({title:'March', cols:['Actual','% of rev.','Budget','Variance','Last year'], rows:[
      ['Revenue',[102000,'100%',105000,-3000,97000],'sub'],
      ['Materials',[-48400,'47.5%',-47250,-1150,-43700],'ind'],
      ['Direct labour',[-13100,'12.8%',-13000,-100,-12400],'ind'],
      ['Factory overhead',[-13300,'13.0%',-13300,'–',-13000],'ind'],
      ['Gross profit',[27200,'26.7%',31450,-4250,27900],'sub'],
      ['Freight and export documents',[-4100,'4.0%',-4200,100,-3900],'ind'],
      ['Sales commission',[-2040,'2.0%',-2100,60,-1940],'ind'],
      ['Marketing',[-1100,'1.1%',-1200,100,-1100],'ind'],
      ['Office salaries',[-8000,'7.8%',-8000,'–',-7600],'ind'],
      ['Certification',[-1830,'1.8%',-1830,'–',-1700],'ind'],
      ['Rent, audit, insurance, IT',[-3500,'3.4%',-3500,'–',-3460],'ind'],
      ['Operating profit',[6630,'6.5%',10620,-3990,8200],'sub'],
      ['Interest and currency',[-1390,'1.4%',-1150,-240,-1400],'ind'],
      ['Profit before tax',[5240,'5.1%',9470,-4230,6800],'total']
    ]}),
    FS({title:'Year to date (January to March)', cols:['Actual','% of rev.','Budget','Variance'], rows:[
      ['Revenue',[287000,'100%',290000,-3000],'sub'],
      ['Materials',[-130300,'45.4%',-130500,200],'ind'],
      ['Direct labour',[-38700,'13.5%',-39000,300],'ind'],
      ['Factory overhead',[-39200,'13.7%',-39900,700],'ind'],
      ['Gross profit',[78800,'27.5%',80600,-1800],'sub'],
      ['Operating expenses',[-60730,'21.2%',-60990,260],'ind'],
      ['Operating profit',[18070,'6.3%',19610,-1540],'sub'],
      ['Interest and currency (incl. $2,020 FX loss in January)',[-5470,'1.9%',-3450,-2020],'ind'],
      ['Profit before tax',[12600,'4.4%',16160,-3560],'total']
    ], note:'Budget gross margin is lower in January and February because sales are seasonally low while fixed factory costs are not.'})
  ]},
  {id:'margin', label:'Margins and variances', kind:'learn', title:'Product margins and cost variances', blocks:[
    DH('March',4,'Margins and variances'),
    {t:'tbl', head:['March, by product','Units','Revenue','Gross profit','Gross margin','Budget margin'], opts:{num:[1,2,3,4,5]}, rows:[
      ['Mattresses','240','$43,200','$12,010','27.8%','31.5%'],
      ['Slings','600','$27,000','$9,990','37.0%','39.5%'],
      ['Braces','1,100','$30,800','$4,590','14.9%','17.0%'],
      ['Spares','–','$1,000','$610','61.0%','60.0%'],
      {cls:'',cells:['<strong>Total</strong>','','<strong>$102,000</strong>','<strong>$27,200</strong>','<strong>26.7%</strong>','<strong>30.0%</strong>']}
    ]},
    {t:'tbl', head:['Materials variances, March','Amount','Owner','Status'], opts:{num:[1]}, rows:[
      ['Foam price (+6% from 1 March)','<span class="neg">$820 A</span>','Purchasing','Second quote due 12 April'],
      ['Foam usage (new cutting pattern)','<span class="neg">$1,200 A</span>','Production','Old pattern restored 2 April'],
      ['Webbing price','<span class="neg">$300 A</span>','Purchasing','Supplier increase, permanent'],
      ['Brace scrap, batches 3114 and 3120','<span class="neg">$180 A</span>','Quality','Root cause: worn die, replaced'],
      {cls:'',cells:['<strong>Total vs flexed budget</strong>','<strong class="neg">$2,500 A</strong>','','']}
    ]},
    {t:'tbl', head:['Labour, March','Amount','Note'], opts:{num:[1]}, rows:[
      ['Rate (overtime premium)','<span class="neg">$65 A</span>','120 overtime hours for the late UK order'],
      ['Efficiency','<span class="neg">$270 A</span>','Labour efficiency 92%: two new sewing operators in training']
    ]}
  ]},
  {id:'bs', label:'Balance sheet and cash', kind:'learn', title:'Balance sheet and cash flow', blocks:[
    DH('March',5,'Balance sheet and cash flow'),
    FS({title:'Balance sheet', cols:['31 March','31 December'], rows:[
      'Assets',
      ['Cash',[40600,42000],'ind'],['Receivables',[214000,230000],'ind'],['Raw materials',[132000,140000],'ind'],['Work-in-progress',[36000,35000],'ind'],['Finished goods',[73000,75000],'ind'],['Prepayments',[15000,13000],'ind'],['Equipment, net',[303500,310000],'ind'],
      ['Total assets',[814100,845000],'total'],
      'Liabilities and equity',
      ['Payables',[88000,95000],'ind'],['Accrued expenses',[27000,30000],'ind'],['Overdraft (limit $150,000)',[100000,120000],'ind'],['Tax payable',[3150,8500],'ind'],['Equipment loan',[95000,100000],'ind'],
      ['Total liabilities',[313150,353500],'sub'],
      ['Share capital',[250000,250000],'ind'],['Retained earnings',[250950,241500],'ind'],
      ['Total liabilities and equity',[814100,845000],'total']
    ]}),
    FS({title:'Cash flow, January to March', rows:[
      ['Net profit after tax',9450],['Depreciation',9500],['Receivables down',16000],['Inventory down',9000],['Prepayments up',-2000],['Payables down',-7000],['Accrued expenses down',-3000],['Tax paid above charge',-5350],
      ['Cash from operations',26600,'sub'],['Equipment purchases',-3000],['Overdraft repaid',-20000],['Equipment loan repaid',-5000],
      ['Change in cash',-1400,'sub'],['Cash at 1 January',42000],['Cash at 31 March',40600,'total']
    ]})
  ]},
  {id:'ops', label:'Receivables, cash forecast, operations', kind:'learn', title:'Receivables, cash forecast and operations', blocks:[
    DH('March',6,'Working capital and operations'),
    {t:'tbl', head:['Receivables aging','Current','1–30','31–60','61–90','90+','Total'], opts:{num:[1,2,3,4,5,6]}, rows:[
      ['Total','$170,000','$30,000','$10,000','$4,000','–','$214,000'],
      ['Share','79%','14%','5%','2%','0%','100%']
    ]},
    `<p class="small" style="color:var(--muted)">Over 30 days: German distributor $8k (disputed delivery date, resolved 3 April), UK distributor $4k (61–90, invoice re-sent), US distributor B $2k. The old UAE debt was written off in January and passed to a collection agency.</p>`,
    W('13-week liquidity forecast (cash + unused overdraft)', function(el,ctx){
      const v=[86,82,77,79,70,56,63,72,68,75,82,79,88];
      el.innerHTML=ctx.ui.bars(v.map((x,i)=>({label:'Week '+(i+1),v:x*1000,tone:x<30?'bad':x<60?'warn':'good'})),{max:90000})+'<p class="w-hint" style="margin-top:8px">Lowest point week 6: quarterly tax $6k plus payroll. Assumes US distributor A pays on its usual day 62.</p>';
    }),
    {t:'tbl', head:['Operations, March','Actual','Target'], opts:{num:[1,2]}, rows:[
      ['Mattresses / slings / braces made','240 / 610 / 1,060','250 / 600 / 1,150'],
      ['On time in full (against first promised date)','89%','95%'],
      ['First-pass yield','95.6%','97%'],
      ['Scrap rate (all stages, from material issued)','3.8%','3.0%'],
      ['Labour efficiency','92%','95%'],
      ['Overtime hours','120','under 100']
    ]}
  ]},
  {id:'appx', label:'Appendix', kind:'learn', title:'Appendix: capital request and close checklist', blocks:[
    DH('March',7,'Appendix'),
    {t:'tbl', head:['Capital request for approval','Detail'], rows:[
      ['Item','Automatic fabric cutting table, including installation, validation and training'],
      ['Investment','$60,000; funding proposed by a 4-year equipment loan'],
      ['Annual net cash benefit','$22,300 (fabric waste 12% → 6%; two leavers not replaced; extra cutting capacity; less $2,500 running costs)'],
      ['Payback / NPV at 10% / IRR','2.7 years / +$61,300 / 33.8%'],
      ['Sensitivity','Benefits 30% lower: payback 3.8 years, NPV +$25,600'],
      ['Requested by','Production manager; finance has reviewed the assumptions']
    ]},
    {t:'tbl', head:['Month-end close checklist','Status'], rows:[
      ['Bank reconciliations, USD and EUR accounts','Done 3 April, reviewed by GM'],
      ['Receivables and payables ledgers agree to the balance sheet','Done'],
      ['Goods-received-not-invoiced, freight and overtime accruals','Booked: $6,200'],
      ['Depreciation','Booked monthly'],
      ['Cycle counts (foam, fabric, webbing)','Done; record accuracy 91%'],
      ['Suspense account','$0'],
      ['Signed off','Finance manager, 9 April']
    ]}
  ]},
  {id:'review', label:'Review', kind:'quiz', title:'Review questions', blocks:[
    Q('What is the main reason profit before tax is $4.2k below budget?',['Lower sales','Gross margin: higher material costs and usage','Office costs','Interest'],1,'Of the $4.2k, $4.25k is at gross profit. The commentary splits it: foam price, foam usage, webbing and scrap, plus a little volume.'),
    Q('Sales are 2.9% below budget. Flexed to actual sales, materials should be 45% × $102,000 = $45,900. How far over is the actual $48,400?',['$1,150, as the P&L shows','$2,500','$3,000','It\'s under budget'],1,'The original budget comparison shows only $1,150 because lower sales hide part of the overspend. The variance report confirms $2,500 (Module 15).'),
    Q('Profit after tax for the quarter was $9,450, yet cash fell $1,400. Why?',['The pack must be wrong','Operations generated $26,600, but $25,000 went to repaying the overdraft and the loan, plus $3,000 of equipment','Customers paid more slowly','Tax was refunded'],1,'Good news, in fact: working capital released cash, and it was used to reduce debt (Modules 1 and 5).'),
    Q('Which product has the weakest gross margin, and what would you look at first?',['Mattresses: price','Slings: scrap','Braces at 14.9%: price, batch sizes and the number of variants (Modules 6 and 13)','Spares'],2,'Braces still contribute well above variable cost, so the answer is to improve them, not drop them.'),
    Q('What would you check before approving the fabric cutter?',['Nothing, the numbers look good','That the labour saving names the two leavers, that validation is included, and that the loan keeps covenants comfortable','Only the IRR','Whether the supplier offers a discount this month'],1,'The appendix already shows sensitivity. Your job is to test the assumptions behind the savings (Module 14).'),
    GRADE('B')
  ]}
  ]
});

/* ------------------------------------------------------------------ PACK C */
BW.addPack({
  id:'packC', code:'C', month:'July', scenario:'a record month heading for a cash crisis',
  title:'The July pack: record sales, empty bank',
  blurb:'Best sales month ever, profit on budget, and a bank account about to run dry. A decent pack whose commentary is too relaxed. Can you see the crisis coming?',
  usedIn:'Modules 4, 5, 10, 13, 16 and 17',
  subtitle:'Issued 8 August (working day 6). Sales are at a record, and the commentary calls the cash position "temporary". Look harder.',
  grades:[2,1,2,1, 2,0,2,2, 2,2,0,2, 2,1,1,2, 2,1,2,2],
  sections:[
  {id:'about', label:'About this pack', kind:'learn', title:'About this pack', blocks:[
    `<p>In June, while you were at a trade fair, the sales team agreed a 600-mattress order with US distributor A on <strong>CIF terms with 90-day payment</strong>. Purchasing took a 6% bulk discount on foam. Both looked like good news.</p>
     <p>This pack is reasonably well built. But the commentary describes the cash position as "temporary". Your job: work out how serious it is, and what has to happen this week.</p>`
  ]},
  {id:'dash', label:'Dashboard', kind:'learn', title:'Dashboard', blocks:[
    DH('July',1,'Dashboard','Issued 8 August'),
    tiles([
      ['Revenue, July','$128.0k','good','budget $112.0k · record month'],
      ['Gross margin, July','29.6%','warn','target 30% · budget 30.9%'],
      ['Profit before tax, July','$12.9k','warn','budget $12.3k'],
      ['Book-to-bill','0.88','bad','orders $112.6k'],
      ['On time in full','82%','bad','target 95%'],
      ['Scrap rate','4.6%','bad','target 3.0%'],
      ['Days sales outstanding','77 days','bad','target 60'],
      ['Inventory days','105 days','bad','target 85'],
      ['Lowest headroom, next 13 weeks','($12k)','bad','week 4 · minimum $30k'],
      ['Net debt to EBITDA','1.6×','good','covenant ≤ 2.5×']
    ])
  ]},
  {id:'comm', label:'Commentary', kind:'learn', title:'Commentary', blocks:[
    DH('July',2,'Commentary'),
    TXT(`<p><strong>A record month.</strong> Sales $128.0k, 14% above budget, driven by US distributor A's 600-mattress order (CIF, 90-day terms). Profit before tax $12.9k, slightly above budget: freight was $1.9k over (CIF plus one air shipment to meet the date) and overtime $2.9k.</p>
      <p><strong>Cash is temporarily tight</strong> at $10.5k, mainly timing: US distributor A pays in October. We also took the foam supplier's bulk offer (6% discount, about $38k of extra stock), which will save $2.3k over six months. We expect cash to improve from September.</p>
      <p><strong>Other.</strong> An NGO in Kenya has asked for 2,000 slings at $32 for delivery in September; sales recommends accepting, to use capacity. The Saudi distributor's $18k payment is delayed by a letter of credit discrepancy (port name misspelt on the bill of lading); the bank expects it to be resolved in August.</p>`)
  ]},
  {id:'pl', label:'Income statement', kind:'learn', title:'Income statement', blocks:[
    DH('July',3,'Income statement'),
    FS({title:'July', cols:['Actual','% of rev.','Budget','Variance','Last year'], rows:[
      ['Revenue',[128000,'100%',112000,16000,104000],'sub'],
      ['Materials',[-59900,'46.8%',-50400,-9500,-47000],'ind'],
      ['Direct labour (incl. $2,900 overtime)',[-16500,'12.9%',-13400,-3100,-12900],'ind'],
      ['Factory overhead',[-13700,'10.7%',-13600,-100,-13100],'ind'],
      ['Gross profit',[37900,'29.6%',34600,3300,31000],'sub'],
      ['Freight and export documents',[-6400,'5.0%',-4500,-1900,-4200],'ind'],
      ['Sales commission',[-2560,'2.0%',-2240,-320,-2080],'ind'],
      ['Marketing, salaries, certification, other',[-14330,'11.2%',-14330,'–',-14520],'ind'],
      ['Operating profit',[14610,'11.4%',13530,1080,10200],'sub'],
      ['Interest and currency',[-1700,'1.3%',-1250,-450,-1300],'ind'],
      ['Profit before tax',[12910,'10.1%',12280,630,8900],'total']
    ]}),
    FS({title:'Year to date (January to July)', cols:['Actual','Budget','Variance'], rows:[
      ['Revenue',[752000,735000,17000],'sub'],['Gross profit',[213000,216800,-3800],'sub'],['Gross margin',['28.3%','29.5%',''],'muted'],['Profit before tax',[46300,50200,-3900],'total']
    ]})
  ]},
  {id:'bs', label:'Balance sheet and cash', kind:'learn', title:'Balance sheet and cash flow', blocks:[
    DH('July',4,'Balance sheet and cash flow'),
    FS({title:'Balance sheet', cols:['31 July','31 December'], rows:[
      'Assets',
      ['Cash',[10500,42000],'ind'],['Receivables',[302000,230000],'ind'],['Raw materials',[178000,140000],'ind'],['Work-in-progress',[38000,35000],'ind'],['Finished goods',[80000,75000],'ind'],['Prepayments',[12000,13000],'ind'],['Equipment, net',[293800,310000],'ind'],
      ['Total assets',[914300,845000],'total'],
      'Liabilities and equity',
      ['Payables',[118000,95000],'ind'],['Accrued expenses',[33000,30000],'ind'],['Overdraft (limit $150,000)',[146000,120000],'ind'],['Tax payable',[6075,8500],'ind'],['Equipment loan',[85000,100000],'ind'],
      ['Total liabilities',[388075,353500],'sub'],['Share capital',[250000,250000],'ind'],['Retained earnings',[276225,241500],'ind'],
      ['Total liabilities and equity',[914300,845000],'total']
    ]}),
    FS({title:'Cash flow, January to July', rows:[
      ['Net profit after tax',34725],['Depreciation',22200],['Receivables up',-72000],['Inventory up',-46000],['Prepayments down',1000],['Payables up',23000],['Accrued expenses up',3000],['Tax paid above charge',-2425],
      ['Cash from operations',-36500,'sub'],['Equipment purchases',-6000],['Overdraft drawn',26000],['Equipment loan repaid',-15000],
      ['Change in cash',-31500,'sub'],['Cash at 1 January',42000],['Cash at 31 July',10500,'total']
    ]})
  ]},
  {id:'ar', label:'Receivables and 13 weeks', kind:'learn', title:'Receivables aging and 13-week forecast', blocks:[
    DH('July',5,'Receivables and cash forecast'),
    {t:'tbl', head:['Customer','Current','1–30','31–60','61–90','90+','Total'], opts:{num:[1,2,3,4,5,6]}, rows:[
      ['US distributor A','$88,000','–','–','–','–','$88,000'],
      ['Australian hospital supplier','$30,000','–','–','–','–','$30,000'],
      ['German distributor','$24,000','–','$6,000','–','–','$30,000'],
      ['Swedish distributor','$22,000','–','–','–','–','$22,000'],
      ['US distributor B','$6,000','$9,000','$12,000','$8,000','$10,000','$45,000'],
      ['UK distributor','$14,000','–','–','–','–','$14,000'],
      ['Saudi distributor (LC discrepancy)','–','$18,000','–','–','–','$18,000'],
      ['Other customers','$55,000','–','–','–','–','$55,000'],
      {cls:'',cells:['<strong>Total</strong>','<strong>$239,000</strong>','<strong>$27,000</strong>','<strong>$18,000</strong>','<strong>$8,000</strong>','<strong>$10,000</strong>','<strong>$302,000</strong>']}
    ]},
    W('13-week liquidity forecast (cash + unused overdraft)', function(el,ctx){
      const v=[9,-6,4,-12,3,18,26,14,31,40,33,46,52];
      el.innerHTML=ctx.ui.bars(v.map((x,i)=>({label:'Week '+(i+1),v:x*1000,tone:x<0?'bad':x<30?'warn':'good'})),{max:55000,fmt:x=>money(x)})+'<p class="w-hint" style="margin-top:8px">Week 2: payroll $12k. Week 4: payroll $12k, foam supplier $18k, quarterly tax $5k. Assumes the Saudi $18k arrives in week 6 and US distributor A pays $88k in week 11.</p>';
    })
  ]},
  {id:'ops', label:'Operations and covenants', kind:'learn', title:'Operations and covenants', blocks:[
    DH('July',6,'Operations and covenants'),
    {t:'tbl', head:['Operations, July','Actual','Target'], opts:{num:[1,2]}, rows:[
      ['Mattresses made','760','600'],['On time in full','82%','95%'],['Scrap rate','4.6%','3.0%'],['Labour efficiency','88%','95%'],['Overtime hours','960','under 100'],['Orders received','$112,600','–'],['Order backlog','1.4 months','2.0 months']
    ]},
    {t:'tbl', head:['Covenant','Actual','Limit','Status'], opts:{num:[1,2]}, rows:[
      ['Net debt to EBITDA (last 12 months)','1.6×','≤ 2.5×','Pass'],['Interest cover (EBITDA ÷ interest)','9.0×','≥ 4.0×','Pass'],['Minimum net worth','$526,225','≥ $400,000','Pass']
    ]}
  ]},
  {id:'review', label:'Review', kind:'quiz', title:'Review questions', blocks:[
    Q('How serious is the cash position?',['Temporary, as the commentary says','Serious: liquidity goes negative in weeks 2 and 4, so payroll can\'t be met without action','Fine, because covenants pass','Fine, because profit is on budget'],1,'The forecast shows ($6k) in week 2 and ($12k) in week 4. A covenant pass doesn\'t pay wages (Module 5).'),
    Q('What happened to cash this year, according to the cash flow?',['Losses drained it','Operations used $36,500, despite $34,725 of profit, because receivables rose $72k and inventory $46k','Equipment purchases','Tax'],1,'Profitable, but working capital absorbed all of it and more (Modules 5 and 16).'),
    Q('What is the most urgent action this week?',['Accept the NGO order to fill capacity','Talk to the bank now about a temporary increase, push the Saudi LC fix, chase US distributor B, and agree a foam payment date with the supplier','Wait for September','Cut prices to sell stock'],1,'Act while there\'s still time: tell the bank before the crunch, with a plan (Modules 5, 17 and 18).'),
    Q('Should BraceWorks accept the NGO\'s 2,000 slings at $32 for September?',['Yes, it beats variable cost','Not now. The line is already on 960 hours of overtime, and the order would need materials and wages paid long before any payment arrives. Offer a later date or a deposit.','Yes, at any price','No, because $32 is below full cost'],1,'With no spare capacity, overtime erodes the margin, and the cash need is the real problem this month (Module 13).'),
    Q('US distributor B owes $45k, with $30k overdue and $10k over 90 days. What should happen?',['Nothing until October','Hold further shipments, call their owner this week, and consider a provision','Increase their credit limit','Offer them a discount'],1,'This is the drift pattern from Module 10.'),
    Q('Which commentary sentence most needs challenging?',['"Sales $128.0k, 14% above budget"','"Cash is temporarily tight… we expect cash to improve from September"','"Overtime $2.9k"','"The bank expects it to be resolved in August"'],1,'The pack\'s own forecast shows negative liquidity in two of the next four weeks. "Temporary" hides the decision you need to make now.'),
    GRADE('C')
  ]}
  ]
});

/* ------------------------------------------------------------------ PACK D */
BW.addPack({
  id:'packD', code:'D', month:'November', scenario:'a polished pack hiding problems',
  title:'The November pack: too good to be true',
  blurb:'Every KPI green, best-ever gross margin, and a recommendation to raise the year-end bonus pool. Polished, persuasive, and hiding at least seven problems.',
  usedIn:'Modules 2, 7, 11 and 18',
  subtitle:'Issued 6 December. The best-looking pack of the year. Read it the way an auditor would.',
  grades:[2,1,2,1, 2,0,1,1, 2,2,0,2, 2,1,1,0, 1,0,2,1],
  sections:[
  {id:'about', label:'About this pack', kind:'learn', title:'About this pack', blocks:[
    `<p>November is the busiest month of the year. The pack looks excellent: green dashboard, best gross margin ever, profit well ahead of budget. The commentary ends by recommending a larger year-end bonus pool, which the finance manager, the sales manager and the production manager all share in.</p>
     <p>Read every page, including the appendix. Look for numbers that don't fit together, and for definitions that have changed.</p>`,
    FLAG('Remember the fraud triangle',`<p>A bonus based on these numbers creates pressure. That doesn't mean anyone has done anything wrong. It means the numbers deserve a careful look (Module 18).</p>`)
  ]},
  {id:'dash', label:'Dashboard', kind:'learn', title:'Dashboard', blocks:[
    DH('November',1,'Dashboard','Issued 6 December'),
    tiles([
      ['Revenue, November','$131.0k','good','budget $124.0k'],
      ['Gross margin, November','34.7%','good','target 30% · best ever'],
      ['Profit before tax, YTD','$96.1k','good','budget $82.0k'],
      ['Book-to-bill','1.02','good','orders $133.6k'],
      ['On time in full','95%','good','target 95%'],
      ['Scrap rate','2.4%','good','target 3.0%'],
      ['Days sales outstanding','65 days','good','target 65'],
      ['Inventory days','108 days','warn','target 100'],
      ['Headroom today','$49k','good','minimum $30k'],
      ['Net debt to EBITDA','1.5×','good','covenant ≤ 2.5×']
    ])
  ]},
  {id:'comm', label:'Commentary', kind:'learn', title:'Commentary', blocks:[
    DH('November',2,'Commentary'),
    TXT(`<p><strong>Another excellent month.</strong> Sales $131.0k, 6% above budget and 11% above last year. Gross margin 34.7%, our best ever, reflecting efficiency gains on the line. Every KPI is on or above target.</p>
      <p>Profit before tax year to date is $96.1k, 17% ahead of budget. Cash is stable at $31k.</p>
      <p>Given this performance, we recommend the year-end bonus pool be set at budget plus 15%.</p>`)
  ]},
  {id:'pl', label:'Income statement', kind:'learn', title:'Income statement', blocks:[
    DH('November',3,'Income statement'),
    FS({title:'November', cols:['Actual','% of rev.','Budget','Last year'], rows:[
      ['Revenue',[131000,'100%',124000,118000],'sub'],
      ['Materials',[-57600,'44.0%',-55800,-54300],'ind'],
      ['Direct labour',[-14000,'10.7%',-14000,-13200],'ind'],
      ['Factory overhead',[-14000,'10.7%',-14200,-13600],'ind'],
      ['Gross profit',[45400,'34.7%',40000,36900],'sub'],
      ['Freight and export documents',[-6300,'4.8%',-5600,-5300],'ind'],
      ['Sales commission',[-2620,'2.0%',-2480,-2360],'ind'],
      ['Consulting fees',[-2500,'1.9%',0,0],'ind'],
      ['Office salaries',[-8500,'6.5%',-8500,-8000],'ind'],
      ['Marketing, certification, other',[-6230,'4.8%',-6230,-6240],'ind'],
      ['Operating profit',[19250,'14.7%',17190,15000],'sub'],
      ['Interest (net of $300 currency gain)',[-800,'0.6%',-1200,-1300],'ind'],
      ['Profit before tax',[18450,'14.1%',15990,13700],'total']
    ]}),
    FS({title:'Year to date (January to November)', cols:['Actual','Budget'], rows:[
      ['Revenue',[1234000,1190000],'sub'],['Gross profit',[352000,348000],'sub'],['Gross margin',['28.5%','29.2%'],'muted'],['Profit before tax',[96100,82000],'total']
    ]})
  ]},
  {id:'bs', label:'Balance sheet and cash', kind:'learn', title:'Balance sheet and cash flow', blocks:[
    DH('November',4,'Balance sheet and cash flow'),
    FS({title:'Balance sheet', cols:['30 November','30 September'], rows:[
      'Assets',
      ['Cash',[31000,29000],'ind'],['Receivables',[266000,248000],'ind'],['Raw materials',[150000,152000],'ind'],['Work-in-progress',[37000,36000],'ind'],['Finished goods',[112000,78000],'ind'],['Other current assets',[8600,0],'ind'],['Prepayments',[14000,13000],'ind'],['Equipment, net',[352000,359500],'ind'],
      ['Total assets',[970600,915500],'total'],
      'Liabilities and equity',
      ['Payables',[104000,98000],'ind'],['Accrued expenses',[31000,30000],'ind'],['Overdraft (limit $150,000)',[132000,105540],'ind'],['Tax payable',[12000,9000],'ind'],['Equipment loans',[128000,133000],'ind'],
      ['Total liabilities',[407000,375540],'sub'],['Share capital',[250000,250000],'ind'],['Retained earnings',[313600,289960],'ind'],
      ['Total liabilities and equity',[970600,915500],'total']
    ]}),
    FS({title:'Cash flow, October and November', rows:[
      ['Net profit after tax',23640],['Depreciation',7500],['Receivables up',-18000],['Inventory up',-33000],['Other current assets up',-8600],['Prepayments up',-1000],['Payables up',6000],['Accrued expenses up',1000],['Tax payable up',3000],
      ['Cash from operations',-19460,'sub'],['Overdraft drawn',26460],['Equipment loans repaid',-5000],
      ['Change in cash',2000,'sub'],['Cash at 30 September',29000],['Cash at 30 November',31000,'total']
    ]}),
    {t:'tbl', head:['Receivables aging','Current','1–30','31–60','61–90','90+','Total'], opts:{num:[1,2,3,4,5,6]}, rows:[
      ['Total','$196,000','$22,000','$12,000','$8,000','$28,000','$266,000']
    ]},
    `<p class="small" style="color:var(--muted)">Over 90 days: one account. No allowance for doubtful debts.</p>`
  ]},
  {id:'appx', label:'Appendix', kind:'learn', title:'Appendix: notes, supplier changes, payments', blocks:[
    DH('November',5,'Appendix'),
    {t:'tbl', head:['KPI definition notes'], rows:[
      ['From October, on time in full is measured against the confirmed delivery date (the date agreed with the customer after any change).'],
      ['Scrap rate is measured at final quality inspection.'],
      ['Days sales outstanding uses the last three months\' revenue.']
    ]},
    {t:'tbl', head:['Largest invoices, November','Customer','Amount'], opts:{num:[2]}, rows:[
      ['INV-5582 · 600 mattresses','Australian hospital supplier','$21,600'],
      ['INV-5590 · slings and covers','US distributor A','$18,400'],
      ['INV-5601 · 20% advance payment, delivery in January','Spanish hospital group','$8,000'],
      ['INV-5596 · braces','Swedish distributor','$7,900']
    ]},
    {t:'tbl', head:['Supplier master changes','Changed by','Approved by','Verification'], rows:[
      ['12 Sep · New supplier: Pacific Quality Consulting (QA advisory)','Purchasing officer','Purchasing officer','–'],
      ['6 Nov · Freight forwarder: new bank account','Accounts assistant','Accounts assistant','Confirmed by reply email'],
      ['20 Nov · Webbing supplier: new address','Accounts assistant','Finance manager','Call-back to number on file']
    ]},
    {t:'tbl', head:['Payments to Pacific Quality Consulting','Amount','Purchase order','Invoice detail'], opts:{num:[1]}, rows:[
      ['30 September','$2,500','None','"QA advisory services, September"'],['31 October','$2,500','None','"QA advisory services, October"'],['30 November','$2,500','None','"QA advisory services, November"']
    ]},
    {t:'tbl', head:['Other current assets','Amount'], opts:{num:[1]}, rows:[
      ['Suspense: unidentified receipt, 19 October','$5,100'],['Suspense: unmatched payment, 2 November','$3,500'],{cls:'',cells:['<strong>Total</strong>','<strong>$8,600</strong>']}
    ]}
  ]},
  {id:'review', label:'Review', kind:'quiz', title:'Review: find the problems', blocks:[
    `<p>There are at least seven problems in this pack. Sort each finding.</p>`,
    SORT('Problem, or fine?',['Problem','Looks fine'],[
      {text:'Revenue includes INV-5601, an $8,000 advance payment for January delivery', a:0, why:'A deposit is a liability until the goods ship. Revenue and margin are overstated (Module 2). Without it, gross margin is about 30.4%, not 34.7%.'},
      {text:'Finished goods up $34,000 (44%) in two months', a:0, why:'Overproduction parks fixed costs in stock and flatters profit, while using cash (Module 7). Ask which orders this stock is for.'},
      {text:'Cash from operations ($19,460) negative in two months of $23,640 profit', a:0, why:'The profit isn\'t turning into cash: stock, receivables and suspense absorbed it (Module 5).'},
      {text:'$8,600 in "other current assets" that is really a suspense account', a:0, why:'Unexplained items, tucked into a vague line. Should be cleared to zero (Module 2).'},
      {text:'Pacific Quality Consulting: set up and approved by the same person, $2,500 a month, no purchase order', a:0, why:'Classic signs of a fake supplier (Module 18). It may be genuine, but it must be verified now.'},
      {text:'Freight forwarder\'s bank details changed, "confirmed by reply email"', a:0, why:'Replying to the email that requested the change verifies nothing. Call back on a known number before the next payment (Module 18).'},
      {text:'OTIF 95%, now measured against the date agreed after delays', a:0, why:'A changed definition that turns late orders into "on time" (Module 11).'},
      {text:'Scrap 2.4%, measured only at final inspection', a:0, why:'Most scrap happens earlier, at cutting. March\'s pack measured from material issued: 3.8% (Module 11).'},
      {text:'$28,000 over 90 days with no allowance for doubtful debts', a:0, why:'Probably the Saudi account. Without a provision, profit and assets are overstated (Module 4).'},
      {text:'Office salaries up $500 against last year', a:1, why:'Consistent with the annual pay rise.'},
      {text:'Equipment loans down $5,000 in two months', a:1, why:'Scheduled repayments.'},
      {text:'Retained earnings up $23,640 from September', a:1, why:'Exactly equal to two months\' profit. The balance sheet reconciles.'}
    ]),
    Q('What should you do about the bonus recommendation?',['Approve it: the numbers are excellent','Defer the decision until the deposit, stock, suspense, provision and supplier questions are resolved, and the year-end numbers are restated','Reject all bonuses','Increase it further'],1,'Bonuses should be paid on numbers you trust. Once restated, profit is lower and the cash picture is weaker.'),
    GRADE('D')
  ]}
  ]
});
})();
