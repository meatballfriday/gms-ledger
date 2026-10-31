/* ===== New sections added to existing modules (from the course review) ===== */
(function(){
'use strict';
const {K,TIP,FLAG,CASE,REPORT,Q,FS,FLIP,SORT,CHECK,W,PACK,money,signed,pct,kfmt} = BW.h;
function addSec(id,beforeId,sec,extra){
  const m=BW.mods[id]; if(!m){ console.error('extras: no module '+id); return; }
  const i=m.sections.findIndex(s=>s.id===beforeId); if(i<0){ console.error('extras: no section '+id+'.'+beforeId); return; }
  m.sections.splice(i,0,sec);
  if(extra){ ['glossary','warnings','formulas'].forEach(k=>{ if(extra[k]) m[k]=(m[k]||[]).concat(extra[k]); }); if(extra.minutes) m.minutes+=extra.minutes; }
}
const npv=(r,f)=>f.reduce((s,c,t)=>s+c/Math.pow(1+r,t),0);

/* ------------------------------------------------------------ M2: payroll accruals */
addSec('m2','case',{id:'payroll', label:'Payroll accruals', kind:'learn', title:'The payroll costs that hide until December', blocks:[
  `<p>Wages are BraceWorks\' second-biggest cost. The monthly payslip isn\'t the whole of it. Several payroll costs build up through the year and are paid later, so they must be <span class="term">accrued</span> every month:</p>
   <ul>
    <li><strong>Employer contributions:</strong> social security, health insurance and pension contributions on top of gross pay (Module 19 lists them by country).</li>
    <li><strong>13th-month pay or annual bonuses:</strong> in the Philippines, 13th-month pay is required by law, at least one month\'s basic salary a year, paid by 24 December.</li>
    <li><strong>Unused leave:</strong> leave earned but not yet taken, where it can be paid out or carried forward.</li>
    <li><strong>Overtime and allowances</strong> worked in the last days of the month but paid next month.</li>
   </ul>`,
  W('13th-month pay: accrued, or not?', function(el,ctx){
    const M=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], base=[2.6,3.2,5.4,4.8,5.0,5.6,3.8,4.2,6.2,5.8,7.4,6.4].map(x=>x*1000), acc=1972, tot=acc*12;
    el.innerHTML='<div data-s></div><div data-o></div>'; const o=el.querySelector('[data-o]');
    const draw=mode=>{ const v=M.map((m,i)=>mode==='acc'?base[i]+tot/12-acc:(i===11?base[i]+tot/12-tot:base[i]+tot/12));
      o.innerHTML=ctx.ui.bars(M.map((m,i)=>({label:m,v:Math.round(v[i]),tone:v[i]<0?'bad':''})),{fmt:x=>money(x),max:Math.max(...v.map(Math.abs))})+
      `<p class="w-hint" style="margin-top:10px">${mode==='acc'?'With $1,972 accrued each month, every month carries its fair share and profit follows the real business.':'Without the accrual, January to November look about $2,000 better than they really are, and December takes the whole $23,700 at once, turning a good month into a loss.'}</p>`; };
    ctx.ui.seg(el.querySelector('[data-s]'),[{v:'no',label:'Booked when paid in December'},{v:'acc',label:'Accrued every month'}],'no',draw); draw('no');
  }),
  Q('BraceWorks\' monthly payroll is about $23,700. How much 13th-month pay should be accrued each month?',['$23,700','About $1,975','$13,000','Nothing until December'],1,'One month\'s pay spread over 12 months: $23,700 ÷ 12 ≈ $1,975.'),
  TIP('Ask for it by name',`<p>Look for "accrued 13th-month pay" (or "accrued bonuses") on the balance sheet. It should grow each month and fall to near zero after the December payout. If it isn\'t there, monthly profit is overstated.</p>`)
]},{minutes:8,
  glossary:[{term:'Payroll on-costs', def:'Employer costs on top of gross pay: social security, health insurance, pension contributions, and accrued bonuses or leave.'},{term:'Accrued leave', def:'The value of leave employees have earned but not yet taken, recorded as a liability where it can be paid out or carried forward.'}],
  warnings:[{sign:'No accrued 13th-month pay or bonus on the balance sheet', meaning:'Monthly profit is overstated until December, then a big hit.', look:'Accrued payroll liabilities by type, month by month.'}]});

/* ------------------------------------------------------------ M4: judgement calls */
addSec('m4','case',{id:'judgement', label:'Judgement calls', kind:'learn', title:'The judgement calls behind the numbers', blocks:[
  `<p>Some figures in the accounts aren\'t facts but estimates. Each one needs a judgement, and a too-optimistic judgement flatters profit. These matter most for a medical device maker:</p>`,
  {t:'tbl', head:['Judgement','What it is','If it\'s too optimistic','Question to ask'], rows:[
    ['<strong>Warranty provision</strong>','The expected cost of repairing or replacing products under warranty, set aside when they\'re sold.','Profit looks better now, and claims hit later.','What\'s our claim rate history, and does the provision match it?'],
    ['<strong>Returns and credit notes</strong>','Expected returns from distributors, deducted from revenue.','Revenue overstated, then reversed.','How do actual returns compare with what we provided?'],
    ['<strong>Customer rebates</strong>','Volume rebates earned as customers hit targets, accrued as they\'re earned.','Revenue overstated until the rebate is paid.','Which rebate deals are we accruing for, and at what rate?'],
    ['<strong>Capitalise or expense</strong>','Whether a cost is an asset (used over years) or an expense now.','Repairs called "improvements" push costs onto the balance sheet.','What\'s our capitalisation policy and threshold?'],
    ['<strong>Leases</strong>','Under full PFRS or IFRS (standard 16), most leases go on the balance sheet as an asset and a debt. Under the SME standards, rent is simply an expense.','Different frameworks give different EBITDA and debt figures.','Which framework do we use, and how does it treat our factory lease?'],
    ['<strong>Asset impairment</strong>','Writing down equipment that will no longer earn its value, such as a machine for a discontinued product.','Assets overstated.','Are any machines idle or tied to products we\'re phasing out?'],
    ['<strong>Going concern</strong>','The assumption the business will keep operating for at least a year.','Serious problems not disclosed.','Does the forecast show we can meet our debts for the next 12 months?']
  ]},
  SORT('Capitalise (an asset) or expense (a cost now)?',['Capitalise','Expense'],[
    {text:'A new $60,000 fabric cutter', a:0, why:'It will be used for years.'},
    {text:'$1,400 to replace worn belts on a sewing machine', a:1, why:'Routine repair that keeps it running; no extra life or capacity.'},
    {text:'$18,000 to install and validate the new cutter', a:0, why:'Costs of getting an asset ready for use are part of its cost.'},
    {text:'Annual ISO 13485 surveillance audit fee', a:1, why:'A yearly running cost.'},
    {text:'Rebuilding a machine so it lasts five more years', a:0, why:'Extends useful life: an improvement.'}
  ]),
  Q('BraceWorks sells $1.2M a year with a 2-year warranty. Historically claims cost about 0.8% of sales. What warranty provision would you expect to see?',['$0, until claims arrive','Roughly $9,600 a year added, with the balance reflecting two years of open warranties','$1.2M','$96,000 a year'],1,'0.8% × $1.2M ≈ $9,600 a year. The balance sheet provision should cover the claims still expected on products under warranty.'),
  TIP('Going deeper','<p>This is the overview. <strong>Module 21</strong> works through each of these calls on BraceWorks\' numbers: revenue timing and rebates, development costs, warranty and recall provisions, currency, leases, deferred tax, and which rulebook applies.</p>')
]},{minutes:10,
  glossary:[{term:'Warranty provision', def:'An amount set aside when products are sold for the expected cost of future warranty claims.'},{term:'Returns provision', def:'An estimate of products customers will send back, deducted from revenue when the sale is recorded.'},{term:'Rebate accrual', def:'The amount of volume rebate customers have earned so far, recorded as it\'s earned rather than when paid.'},{term:'Capitalisation policy', def:'The rules for deciding which costs are recorded as assets rather than expenses, often with a minimum amount.'},{term:'Right-of-use asset', def:'Under full IFRS or PFRS, the asset recorded for the right to use a leased item, alongside a lease liability.'},{term:'Lease liability', def:'Under full IFRS or PFRS, the debt-like obligation to pay future lease payments.'},{term:'Impairment', def:'Writing down an asset whose value has fallen below its book value.'},{term:'Going concern', def:'The assumption that a business will keep operating for the foreseeable future, at least 12 months.'}],
  warnings:[{sign:'No warranty, returns or rebate provisions in a growing business', meaning:'Profit probably overstated; reversals to come.', look:'Provisions vs claim and return history.'},{sign:'Repairs being capitalised', meaning:'Costs moved to the balance sheet; profit overstated.', look:'Additions to fixed assets, item by item.'}]});

/* ------------------------------------------------------------ M7: stock levels */
addSec('m7','case',{id:'levels', label:'How much to hold', kind:'play', title:'How much stock should you hold?', blocks:[
  `<p>Too little stock stops the line; too much traps cash. Two numbers decide it for each material:</p>
   <ul>
    <li><strong>Reorder point</strong> = daily usage × supplier lead time + <span class="term">safety stock</span>. When stock falls to this level, order more.</li>
    <li><strong>Order quantity:</strong> how much to buy each time. Bigger orders mean fewer deliveries and sometimes better prices, but more stock on average. The classic <span class="term">economic order quantity</span> balances ordering cost against carrying cost.</li>
   </ul>
   <p>BraceWorks uses about 3.5 m³ of foam per working day, and the supplier takes 15 working days to deliver.</p>`,
  W('Foam stock planner', function(el,ctx){
    const top=document.createElement('div'), out=document.createElement('div'); el.append(top,out);
    ctx.ui.sliders(top,[
      {k:'use',label:'Foam used per working day',min:2,max:6,step:0.1,v:3.5,f:x=>x.toFixed(1)+' m³'},
      {k:'lead',label:'Supplier lead time',min:5,max:40,step:1,v:15,f:x=>x+' days'},
      {k:'safe',label:'Safety stock',min:0,max:20,step:1,v:5,f:x=>x+' days of usage'},
      {k:'qty',label:'Order quantity',min:20,max:250,step:5,v:90,f:x=>x+' m³'}
    ],v=>{
      const rop=v.use*(v.lead+v.safe), avg=v.qty/2+v.use*v.safe, val=avg*200, carry=val*0.2, orders=(v.use*250)/v.qty;
      out.innerHTML=`<div class="stats">${ctx.ui.stat('Reorder when stock falls to',rop.toFixed(0)+' m³')}${ctx.ui.stat('Average foam in stock',avg.toFixed(0)+' m³',`${(avg/v.use).toFixed(0)} days of usage`)}${ctx.ui.stat('Value tied up',money(Math.round(val)))}${ctx.ui.stat('Carrying cost a year (20%)',money(Math.round(carry)))}${ctx.ui.stat('Orders a year',orders.toFixed(0))}</div>
      <p class="w-hint" style="margin-top:10px">${v.qty>=180?'Big orders cut the number of deliveries but double the average stock. A bulk discount has to beat the extra carrying cost (Module 5\'s case).':v.safe===0?'No safety stock: one late truck stops the mattress line. A few days\' cover is cheap insurance for critical materials.':'Shorter lead times are worth negotiating: every day off the lead time takes 3.5 m³ off the reorder point.'}</p>`;
    },ctx.uid);
  }),
  `<h3>Make to order or make to stock?</h3>`,
  {t:'tbl', head:['','Make to stock','Make to order'], rows:[
    ['<strong>Best for</strong>','Standard, fast-moving products','Custom, slow-moving or many-variant products'],
    ['<strong>Customer gets</strong>','Fast delivery from the shelf','A lead time'],
    ['<strong>Cash</strong>','Finished goods tie up cash before any order','Cash goes out only after an order is confirmed, ideally with a deposit'],
    ['<strong>Risk</strong>','Stock goes obsolete or unsold','Idle capacity in slow weeks'],
    ['<strong>At BraceWorks</strong>','Standard mattresses and top-selling slings','Custom-labelled orders and the 40 brace variants']
  ]},
  Q('Daily usage is 3.5 m³, lead time 15 days and safety stock 5 days. What\'s the reorder point?',['52.5 m³','70 m³','17.5 m³','90 m³'],1,'3.5 × (15 + 5) = 70 m³.')
]},{minutes:10,
  glossary:[{term:'Safety stock', def:'Extra stock held to cover late deliveries or unexpected demand.'},{term:'Economic order quantity (EOQ)', def:'The order size that balances the cost of placing orders against the cost of holding stock.'},{term:'Lead time', def:'The time between placing an order and receiving it.'},{term:'Make to stock', def:'Producing standard products ahead of orders, to ship from the shelf.'},{term:'Make to order', def:'Producing only once a customer order is confirmed.'}],
  formulas:[{name:'Reorder point', f:'Daily usage × (Lead time + Safety days)', ex:'3.5 m³ × (15 + 5) = 70 m³'},{name:'Average stock', f:'Order quantity ÷ 2 + Safety stock', ex:'90 ÷ 2 + 17.5 = 62.5 m³'}]});

/* ------------------------------------------------------------ M10: OEE */
addSec('m10','case',{id:'oee', label:'OEE and capacity', kind:'play', title:'How much of the factory\'s time really produces good product?', blocks:[
  `<p><span class="term">OEE</span> (overall equipment effectiveness) measures how much of planned production time turns into good product. It multiplies three losses:</p>
   <ul>
    <li><strong>Availability:</strong> running time ÷ planned time. Lost to breakdowns, changeovers, waiting for materials.</li>
    <li><strong>Performance:</strong> actual speed ÷ standard speed. Lost to slow running and small stops.</li>
    <li><strong>Quality:</strong> good units ÷ total units. Lost to scrap and rework.</li>
   </ul>
   <p>BraceWorks\' sewing line: 7 of 8 planned hours running (87.5%), at 90% of standard speed, with 95.9% first-pass yield. OEE = 87.5% × 90% × 95.9% = <strong>75.5%</strong>.</p>`,
  W('Sewing line OEE', function(el,ctx){
    const top=document.createElement('div'), out=document.createElement('div'); el.append(top,out);
    ctx.ui.sliders(top,[
      {k:'a',label:'Availability',min:60,max:100,step:0.5,v:87.5,f:x=>x.toFixed(1)+'%'},
      {k:'p',label:'Performance',min:60,max:100,step:0.5,v:90,f:x=>x.toFixed(1)+'%'},
      {k:'q',label:'Quality (first-pass yield)',min:85,max:100,step:0.1,v:95.9,f:x=>x.toFixed(1)+'%'}
    ],v=>{
      const oee=v.a*v.p*v.q/1e4, base=0.755, extra=(oee/base-1)*640;
      out.innerHTML=`<div class="stats">${ctx.ui.stat('OEE',oee.toFixed(1)+'%',oee>=85?'good':oee>=65?'warn':'bad','world-class is often quoted around 85%')}${ctx.ui.stat('Sewing output per week',Math.round(640*oee/75.5)+' units','',`today 640`)}${ctx.ui.stat('Extra contribution a year, if demand exists',money(Math.round(Math.max(0,extra)*48*35)),'','at about $35 contribution per unit')}</div>
      <p class="w-hint" style="margin-top:10px">Sewing is the bottleneck (Module 13), so every OEE point gained there is extra output for the whole factory, often cheaper than buying a new machine. A small rise in availability, from fewer changeovers or waiting for parts, is usually the easiest win.</p>`;
    },ctx.uid);
  }),
  K('Why finance cares about OEE',`<p>Low OEE hides capacity you\'ve already paid for, raises unit cost (the same overhead spread over fewer good units) and can trigger equipment purchases you don\'t need. Before approving a capacity investment (Module 14), ask: what\'s the OEE on that process today?</p>`),
  Q('Availability 90%, performance 85%, quality 98%. What\'s the OEE?',['85%','About 75%','90%','98%'],1,'0.90 × 0.85 × 0.98 ≈ 75%.')
]},{minutes:8,
  glossary:[{term:'OEE (overall equipment effectiveness)', def:'Availability × performance × quality: the share of planned time that produces good product.'},{term:'Availability', def:'Running time as a share of planned production time.'},{term:'Performance rate', def:'Actual production speed as a share of standard speed.'},{term:'Capacity utilisation', def:'Actual output as a share of the maximum possible output.'}],
  formulas:[{name:'OEE', f:'Availability × Performance × Quality', ex:'87.5% × 90% × 95.9% = 75.5%'}]});

/* ------------------------------------------------------------ M14: new product */
addSec('m14','case',{id:'npd', label:'A new product', kind:'play', title:'Investing in a new product', blocks:[
  `<p>For a device maker, launching a product is often a bigger investment than any machine. BraceWorks is considering a <strong>bariatric pressure-relief mattress</strong>. The cash flows look different from a machine\'s:</p>`,
  FS({title:'Bariatric mattress: the plan', rows:[
    'Year 0',
    ['Design, prototypes and user trials',-25000,'ind'],['Testing, technical file and regulatory submissions',-30000,'ind'],['Tooling and cutting patterns',-15000,'ind'],['Launch marketing and samples',-10000,'ind'],['Extra working capital (stock and receivables)',-20000,'ind'],
    ['Total investment',-100000,'sub'],
    'Contribution after launch',
    ['Year 1 (ramp-up)',20000,'ind'],['Year 2',45000,'ind'],['Years 3 to 6, each',55000,'ind'],['Working capital released at the end of year 6',20000,'ind']
  ], note:'NPV at 11% (BraceWorks\' cost of capital, Module 20): about +$103,700. Payback: about 2.6 years.'}),
  W('What if approval is late, or sales are slower?', function(el,ctx){
    const top=document.createElement('div'), out=document.createElement('div'); el.append(top,out);
    ctx.ui.sliders(top,[
      {k:'vol',label:'Sales volume vs plan',min:40,max:130,step:5,v:100,f:x=>x+'%'},
      {k:'delay',label:'Delay to regulatory approval',min:0,max:2,step:1,v:0,f:x=>x+(x===1?' year':' years')},
      {k:'reg',label:'Regulatory cost vs plan',min:100,max:250,step:10,v:100,f:x=>x+'%'}
    ],v=>{
      const c=[20000,45000,55000,55000,55000,55000].map(x=>x*v.vol/100);
      const inv=-(70000+30000*v.reg/100);
      const f=[inv]; for(let i=0;i<v.delay;i++) f.push(-10000); c.forEach((x,i)=>f.push(x+(i===c.length-1?20000:0)));
      const N=npv(0.11,f); let cum=0,pb=null; for(let t=0;t<f.length;t++){ const p=cum; cum+=f[t]; if(pb===null&&cum>=0&&t>0) pb=t-1+(-p)/f[t]; }
      out.innerHTML=`<div class="stats">${ctx.ui.stat('NPV at 11%',money(Math.round(N)),N>0?'good':'bad')}${ctx.ui.stat('Payback',pb===null?'Never':pb.toFixed(1)+' years',pb===null||pb>4?'bad':pb>3?'warn':'good')}</div>`+
        ctx.ui.bars(f.map((x,t)=>({label:t===0?'Now':'Year '+t,v:Math.round(x),tone:x<0?'bad':'good'})),{fmt:x=>money(x)})+
        `<p class="w-hint" style="margin-top:10px">${N<0?'At these assumptions the product destroys value. Can the launch be phased, or the regulatory work shared with a distributor?':'Each year of delay costs a year of contribution plus the cost of keeping the project team going. Regulatory timelines deserve as much scrutiny as the sales forecast.'}</p>`;
    },ctx.uid);
  }),
  TIP('How it shows in the accounts',`<p>Research costs are expensed as they happen. Under full PFRS or IFRS, development costs can be capitalised once strict tests are met (technical feasibility, intention and ability to sell, reliable cost tracking); many smaller companies simply expense them. Either way, track the project\'s spend separately, so you can do a post-investment review (Module 14) of the launch.</p>`),
  Q('Why does a new product need more scrutiny than a machine?',['It doesn\'t','Sales volumes and regulatory timing are far less certain, and delays cost a year of contribution each','Machines never fail','New products have no working capital'],1,'Test volume, delay and regulatory cost before committing.')
]},{minutes:10,
  glossary:[{term:'Product development costs', def:'Spending to design, test and certify a new product. Research is expensed; development can be capitalised under strict rules in full IFRS or PFRS.'},{term:'Technical file', def:'The documentation proving a medical device meets regulatory requirements, needed for CE marking and similar approvals.'}]});

/* ------------------------------------------------------------ M17: insurance and risk register */
addSec('m17','case',{id:'risk', label:'Insurance and risks', kind:'learn', title:'Insurance and the risk register', blocks:[
  `<p>Finance-savvy GMs know which risks the business keeps, which it insures, and which it reduces. A one-page <span class="term">risk register</span> lists each major risk with how likely it is, how much it would hurt, who owns it and what\'s being done.</p>`,
  {t:'tbl', head:['Cover','Protects against','Why it matters for BraceWorks'], rows:[
    ['<strong>Product liability</strong>','Claims that a product injured someone','Essential for medical devices. Distributors and hospitals often ask for a certificate.'],
    ['<strong>Product recall</strong>','Costs of tracing, withdrawing and replacing products','A field action can cost more than a year\'s profit (Module 8).'],
    ['<strong>Property and business interruption</strong>','Fire, flood, breakdown, and the lost profit while you rebuild','One fire at a single factory stops all sales.'],
    ['<strong>Marine cargo</strong>','Loss or damage in transit','Under CIF you must insure for the buyer (Module 17); under FOB, check who does.'],
    ['<strong>Credit insurance</strong>','Customers who don\'t pay','Covers export receivables (Module 17).'],
    ['<strong>Fraud and cyber</strong>','Payment redirection, hacking, employee theft','The $18,400 email fraud in Module 18.']
  ]},
  {t:'fig', title:'BraceWorks\' risk map', draw:function(w){
    const P=BW.viz.p, R=[['Largest customer leaves',3,4],['Product recall',2,5],['Foam price spike',4,3],['Euro falls 10%',3,3],['Factory fire',1,5],['Payment fraud',3,2],['Key person leaves',3,3.6]];
    const lw=34, s=Math.min(w-lw-10,420), cell=s/5, x0=lw+(w-lw-10-s)/2, y0=8; let g='';
    for(let i=0;i<5;i++) for(let j=0;j<5;j++){ const sc=(i+1)*(j+1), cls=sc>=12?'v-f-q3':sc>=6?'v-f-q1':'v-f-q0'; g+=`<rect x="${P.f(x0+i*cell+1)}" y="${P.f(y0+(4-j)*cell+1)}" width="${P.f(cell-2)}" height="${P.f(cell-2)}" rx="3" class="${cls}" opacity=".55"/>`; }
    R.forEach((r,k)=>{ const cx=x0+(r[1]-0.5)*cell, cy=y0+(5-r[2]+0.5)*cell; g+=`<circle cx="${P.f(cx)}" cy="${P.f(cy)}" r="11" class="v-badge" data-tip="${r[0]}|Likelihood ${r[1]} of 5 · Impact ${Math.round(r[2])} of 5"/>`+P.txt(cx,cy+4,String(k+1),'v-badge-t'); });
    g+=P.txt(x0+s/2,y0+s+18,'Likelihood →','v-ax')+`<text x="12" y="${P.f(y0+s/2)}" class="v-ax" text-anchor="middle" transform="rotate(-90 12 ${P.f(y0+s/2)})">Impact →</text>`;
    return P.svg(w,y0+s+26,'Risk map plotting seven BraceWorks risks by likelihood and impact.',g)+`<ol class="small" style="margin:8px 0 0;padding-left:20px;columns:2;column-gap:20px">${R.map(r=>`<li>${r[0]}</li>`).join('')}</ol>`;
  }, caption:'Top right is where to act first: likely and damaging. Insurance helps with the rare-but-severe risks (fire, recall); the frequent ones, such as a customer leaving or price spikes, need management action, not insurance.'},
  Q('Which risk is insurance least able to solve?',['A factory fire','A product liability claim','The largest customer moving to a competitor','A shipment lost at sea'],2,'Losing a customer is a business risk to manage through diversification, service and pricing, not something you can insure.')
]},{minutes:8,
  glossary:[{term:'Risk register', def:'A list of a business\'s main risks, with likelihood, impact, owner and actions.'},{term:'Product liability insurance', def:'Insurance against claims that a product caused injury or damage.'},{term:'Business interruption insurance', def:'Insurance for lost profit while a business recovers from damage such as a fire.'},{term:'Marine cargo insurance', def:'Insurance for goods lost or damaged in transit.'}]});

/* ------------------------------------------------------------ M18: audited accounts, owner dealings, delegation */
addSec('m18','case',{id:'statutory', label:'Your audited accounts', kind:'learn', title:'Reading your audited accounts', blocks:[
  `<p>Once a year, the auditors sign the statutory accounts. The monthly pack is for running the business; the audited accounts are what banks, tax offices and buyers rely on. Read three things in them.</p>
   <h3>1. The auditor\'s opinion, on the first pages</h3>`,
  {t:'tbl', head:['Opinion','What it means','What to do'], rows:[
    ['<strong>Unqualified ("clean")</strong>','The accounts give a true and fair view.','The normal result.'],
    ['<strong>Clean, with an "emphasis of matter" or going-concern note</strong>','Fair, but the auditor wants readers to notice something, such as doubt about meeting debts.','Banks will ask about it. Have a plan to show them.'],
    ['<strong>Qualified</strong>','Fair except for a specific problem, such as stock that couldn\'t be verified.','Fix the cause before next year; lenders take this seriously.'],
    ['<strong>Adverse or disclaimer</strong>','The accounts aren\'t fair, or the auditor couldn\'t reach a view.','A serious problem for banks, customers and tax authorities.']
  ]},
  `<h3>2. The framework and accounting policies</h3>
   <p>The first note says which rules the accounts follow. In the Philippines, that\'s full PFRS, PFRS for SMEs or PFRS for Small Entities, depending on size. The policies then explain how revenue, stock, depreciation and provisions are measured. Check they match how the monthly pack is prepared: if they don\'t, the year-end will hold surprises.</p>
   <h3>3. The notes worth reading</h3>
   <ul>
    <li><strong>Judgements and estimates:</strong> where management had to guess, such as provisions and stock values (this module\'s judgement calls).</li>
    <li><strong>Related parties:</strong> dealings with owners, their families and their other companies.</li>
    <li><strong>Commitments and contingencies:</strong> promises and possible liabilities not yet on the balance sheet, such as guarantees or legal claims.</li>
    <li><strong>Events after the year-end:</strong> anything big that happened before the accounts were signed.</li>
   </ul>`,
  Q('The auditor\'s report is clean but includes a going-concern note. What does it mean?',['Nothing to worry about','The accounts are fair, but there is doubt about the business meeting its debts over the next year','The auditor refused to sign','Tax was underpaid'],1,'Expect questions from the bank, and prepare a cash plan to answer them.')
]},{minutes:8,
  glossary:[{term:'Unqualified opinion', def:'A clean audit opinion: the accounts give a true and fair view.'},{term:'Qualified opinion', def:'An audit opinion that the accounts are fair except for a specific matter.'},{term:'Emphasis of matter', def:'A paragraph in a clean audit report drawing attention to an important issue, such as going concern.'},{term:'Contingent liability', def:'A possible obligation that depends on a future event, such as a legal claim, disclosed in the notes.'},{term:'Accounting framework', def:'The set of rules the accounts follow, such as full PFRS, PFRS for SMEs or IFRS.'}]});

addSec('m18','case',{id:'governance', label:'Owners and authority', kind:'learn', title:'Owner dealings and who can approve what', blocks:[
  `<h3>Owner and related-party transactions</h3>
   <p>In owner-run companies, personal and business money can blur. It matters because it distorts margins, can be disallowed for tax, and worries banks and buyers. Common examples:</p>
   <ul>
    <li>Personal expenses paid by the company: cars, travel, family phones.</li>
    <li>Family members on the payroll who don\'t work in the business.</li>
    <li>Loans to or from the owner with no written terms.</li>
    <li>Buying from or selling to another company the owner controls, at prices nobody has checked.</li>
   </ul>
   <p>None of these is necessarily wrong. They need to be <strong>known, documented, priced fairly and shown separately</strong>, so the monthly pack shows the real business. Auditors list them as related-party transactions.</p>`,
  `<h3>Delegation of authority</h3>
   <p>A one-page table that says who can approve what, up to how much. It speeds decisions (people know they can act) and protects the business (big decisions get a second look).</p>`,
  {t:'tbl', head:['Decision','Supervisor or manager','GM','Owner or board'], rows:[
    ['Purchase orders for materials (on budget)','Up to $5,000','Up to $50,000','Above $50,000'],
    ['Other spending','Up to $1,000','Up to $10,000','Above $10,000'],
    ['Equipment purchases','–','Up to $15,000 within the capex budget','Above $15,000 or outside budget'],
    ['Price below the floor price, or special terms','–','Yes, with a contribution check','Above $25,000 of order value'],
    ['New customer credit limits','Up to $10,000 (finance)','Up to $50,000','Above $50,000'],
    ['Hiring','Within budgeted headcount','New roles within budget','Roles outside budget'],
    ['Bank payments','Second approver','Above $10,000','Above $50,000'],
    ['Borrowing, guarantees, dividends','–','–','Always']
  ]},
  `<p class="small" style="color:var(--muted)">Example figures for a business of BraceWorks\' size. Set your own with the owner, write them down, and review them once a year.</p>`,
  Q('The owner\'s car and family phones are paid through the company. What\'s the best approach?',['Hide them in sundry expenses','Record them separately as owner costs or benefits, agree the treatment with the accountant, and show them apart from operating costs','Stop paying the owner','Ignore them'],1,'Visible and documented is fine. Hidden distorts margins and creates tax risk.')
]},{minutes:8,
  glossary:[{term:'Related party', def:'A person or company connected to the business: owners, their families, and companies they control.'},{term:'Delegation of authority', def:'A written table of who may approve which decisions, up to what amount.'}],
  warnings:[{sign:'Owner or family costs mixed into operating expenses', meaning:'Margins distorted; tax disallowance risk; buyers and banks discount the numbers.', look:'Related-party list; owner costs shown separately.'}]});

/* ------------------------------------------------------------ M9: systems, data and new requests */
addSec('m9','case',{id:'systems', label:'Systems and data', kind:'learn', title:'Systems, data and new requests', blocks:[
  `<p>A good pack depends on good data. Three things decide how good it can be.</p>
   <h3>1. One system, one version of the truth</h3>
   <p>When sales, stock, purchasing and accounts live in one integrated system (an <span class="term">ERP</span>), the numbers agree with each other. When they live in separate spreadsheets, someone has to reconcile them every month, and errors slip through. You don\'t need an expensive system, but stock and costing should come from the same place as the accounts.</p>
   <h3>2. Master data</h3>
   <p>Bills of materials, routings, standard costs, customer payment terms and price lists are the <span class="term">master data</span> every report is built on. Module 7\'s wrong fabric quantity was a master data error. Give each type an owner and review it at least once a year.</p>
   <h3>3. Spreadsheets with care</h3>
   <p>Spreadsheets are fine for analysis, but risky as the system of record: formulas get overwritten, versions multiply. Keep inputs, calculations and outputs separate, and have someone check any spreadsheet used for prices, payroll or the monthly pack.</p>`,
  K('A newer request: sustainability data',
    `<p>Large customers, especially hospital groups in Europe, increasingly ask suppliers for data on energy use, materials, waste and carbon emissions, sometimes as part of tenders. The numbers come from the same places as your costs: utility bills, purchase records and production volumes. If you can produce a cost per mattress, you can usually estimate energy and materials per mattress too. Start collecting it now, before a tender asks.</p>`),
  Q('Module 7\'s stock count found the mattress BOM used 4.2 m of fabric when the cutters used 4.6 m. What kind of problem is that?',['A fraud problem','A master data problem: a wrong standard in the system that every cost and report relied on','A tax problem','A bank problem'],1,'Master data needs an owner and regular review.')
]},{minutes:6,
  glossary:[{term:'ERP', def:'Enterprise resource planning: an integrated system covering sales, stock, purchasing, production and accounts.'},{term:'Master data', def:'The core reference data reports are built on: BOMs, routings, standard costs, customer terms, price lists.'},{term:'Sustainability (ESG) data', def:'Information on environmental, social and governance performance, such as energy use and emissions, increasingly requested by customers.'}]});
})();
