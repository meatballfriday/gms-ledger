/* ===== Module 16: Working capital ===== */
(function(){
const {K,TIP,FLAG,CASE,REPORT,Q,FS,FLIP,SORT,CHECK,W,PACK,money,signed,pct,kfmt} = BW.h;
const DAY_AR=1200000/365, DAY_INV=860000/365, DAY_AP=552000/365;

BW.add({
  id:'m16', minutes:40,
  title:'Working capital',
  subtitle:'BraceWorks has $385,000 tied up in receivables and stock, net of what it owes suppliers. Freeing even a quarter of it beats a year of profit.',
  goals:[
    'Calculate the cash conversion cycle and what each day is worth',
    'Use the levers on receivables, inventory and payables',
    'Work out the true cost of an early-payment discount',
    'Set a 90-day working capital plan with targets and owners'
  ],
  sections:[
  {id:'ccc', label:'The cash cycle', kind:'learn', title:'The cash conversion cycle', blocks:[
    `<p>From the day BraceWorks pays for foam to the day a customer pays for the mattress, cash is tied up. The length of that gap is the <span class="term">cash conversion cycle</span> (CCC).</p>
     <p class="num" style="font-weight:600">CCC = Inventory days + Receivable days − Payable days = 106 + 70 − 63 = 113 days</p>`,
    {t:'html', html:`<div class="tbl" style="padding:14px 16px;display:grid;gap:10px">
      <div class="small eyebrow">The journey of one dollar, in days</div>
      <div style="display:grid;grid-template-columns:106fr 70fr;gap:2px;font-size:13px">
        <div style="background:var(--amber-soft);border:1px solid var(--amber-line);border-radius:6px 0 0 6px;padding:8px">Stock: materials in, products made and stored<br><strong class="num">106 days</strong></div>
        <div style="background:var(--blue-soft);border:1px solid var(--blue);border-radius:0 6px 6px 0;padding:8px">Customer has the goods, hasn't paid<br><strong class="num">70 days</strong></div>
      </div>
      <div style="display:grid;grid-template-columns:63fr 113fr;gap:2px;font-size:13px">
        <div style="background:var(--good-soft);border:1px solid var(--good);border-radius:6px 0 0 6px;padding:8px">Supplier funds us<br><strong class="num">63 days</strong></div>
        <div style="background:var(--red-soft);border:1px solid var(--red);border-radius:0 6px 6px 0;padding:8px">BraceWorks funds the gap: the cash conversion cycle<br><strong class="num">113 days</strong></div>
      </div></div>`},
    `<h3>What one day is worth</h3>`,
    {t:'tbl', head:['One day less of…','Cash released','How'], opts:{num:[1]}, rows:[
      ['Receivables','$3,288','Sales ÷ 365'],
      ['Inventory','$2,356','Cost of goods sold ÷ 365'],
      ['One day more of payables','$1,512','Materials purchased ÷ 365']
    ]},
    K('Why this is the GM\'s job, not just finance\'s',
      `<p>Each part of the cycle is driven by operations: sales sets payment terms, production and purchasing set stock levels, and the factory decides how fast orders are made and shipped. Finance can measure working capital, but only the whole management team can change it.</p>`)
  ]},
  {id:'play', label:'Cash cycle levers', kind:'play', title:'Free up cash', blocks:[
    `<p>Set targets for each part of the cycle and see how much cash comes back into the bank.</p>`,
    W('Working capital levers', function(el, ctx){
      const {money,pct}=ctx.h;
      const top=document.createElement('div'), out=document.createElement('div'); el.append(top,out);
      ctx.ui.sliders(top,[
        {k:'dso',label:'Receivable days (today 70)',min:30,max:100,step:1,v:58,f:x=>x+' days'},
        {k:'dio',label:'Inventory days (today 106)',min:45,max:140,step:1,v:88,f:x=>x+' days'},
        {k:'dpo',label:'Payable days (today 63)',min:30,max:90,step:1,v:65,f:x=>x+' days'}
      ],(v)=>{
        const rAR=(70-v.dso)*DAY_AR, rInv=(106-v.dio)*DAY_INV, rAP=(v.dpo-63)*DAY_AP, tot=rAR+rInv+rAP;
        const ccc=v.dio+v.dso-v.dpo;
        out.innerHTML=ctx.ui.bridge([
          {label:'Receivables',v:Math.round(rAR)},{label:'Inventory',v:Math.round(rInv)},{label:'Payables',v:Math.round(rAP)},{label:'Total cash released',v:Math.round(tot),total:true}
        ])+`<div class="stats" style="margin-top:12px">${ctx.ui.stat('Cash conversion cycle',ccc+' days',ccc<113?'good':ccc>113?'bad':'','today 113 days')}${ctx.ui.stat('Cash released (one time)',money(Math.round(tot)),tot>0?'good':'bad')}${ctx.ui.stat('Interest saved each year at 8%',money(Math.round(Math.max(0,tot)*0.08)))}${ctx.ui.stat('Sales needed to earn the same cash',tot>0?money(Math.round(tot/0.046)):'–','','at a 4.6% net margin')}</div>
        <p class="w-hint" style="margin-top:10px">${v.dpo>75?'Be careful: stretching suppliers far beyond agreed terms damages trust and supply. The case file shows how it can backfire.':tot>80000?`That releases ${money(Math.round(tot))} of cash, once, and keeps it released for as long as the new levels hold. To generate that from profit, BraceWorks would need about ${money(Math.round(tot/0.046/1000)*1000)} of extra sales.`:'Try the plan in this module: 58 receivable days, 88 inventory days, 65 payable days.'}</p>`;
      },ctx.uid);
    })
  ]},
  {id:'levers', label:'The levers', kind:'learn', title:'What actually moves each number', blocks:[
    `<h3>Receivables: get paid sooner</h3>
     <ul>
      <li><strong>Invoice on the day of shipment</strong>, with all the documents the customer needs. Every day of delay is a day added to DSO.</li>
      <li><strong>Agree terms before the order,</strong> and make the due date clear on every invoice.</li>
      <li><strong>Remind before the due date,</strong> call at 7 days late, hold shipments at 30–45 days late (Module 10).</li>
      <li><strong>Take deposits</strong> on custom and first orders.</li>
      <li><strong>Use the bank:</strong> letters of credit for new markets; invoice discounting to turn receivables into cash (Module 17).</li>
     </ul>
     <h3>Inventory: hold less, sell faster</h3>
     <ul>
      <li><strong>Cut SKUs</strong> that sell rarely. BraceWorks' 40 brace variants need stock for each one.</li>
      <li><strong>Set reorder points and maximums</strong> per material, based on actual usage and lead times.</li>
      <li><strong>Make to order</strong> for slow and custom items instead of stocking them.</li>
      <li><strong>Clear old stock</strong>: sell it, rework it or write it off, so it stops hiding in the numbers.</li>
      <li><strong>Plan sales and production together</strong> each month, so the factory doesn't build stock "just in case".</li>
     </ul>
     <h3>Payables: pay on time, not early</h3>
     <ul>
      <li><strong>Pay on the agreed due date,</strong> not when the invoice arrives.</li>
      <li><strong>Negotiate longer terms</strong> as part of a bigger relationship: volume commitments, forecasts shared, reliable payment.</li>
      <li><strong>Don't stretch beyond terms.</strong> Suppliers respond with higher prices, lower priority or cash-in-advance demands.</li>
     </ul>`,
    K('The true cost of an early-payment discount',
      `<p>A distributor asks for a 2% discount if it pays in 10 days instead of 60. Is that cheap money? You're paying 2% to get cash 50 days early.</p>
       <p class="num" style="font-weight:600">Annual cost = 2 ÷ 98 × 365 ÷ 50 = 14.9% a year</p>
       <p>BraceWorks' overdraft costs about 8%. So offering this discount is expensive, unless cash is extremely tight. The same formula tells you when to <em>accept</em> a supplier's early-payment discount: if it beats your cost of borrowing, take it.</p>`),
    Q('A foam supplier offers 1.5% off if BraceWorks pays in 10 days instead of 45. Overdraft interest is 8%. Should BraceWorks take it?',[
      'No, 1.5% is too small to matter','Yes: it\'s worth about 15.9% a year, far more than the 8% overdraft costs','Only if the supplier is local','Only at year-end'],1,
      '1.5 ÷ 98.5 × 365 ÷ 35 = 15.9% a year. Borrowing at 8% to earn 15.9% is a good deal, as long as headroom allows.')
  ]},
  {id:'case', label:'Case: stretched too far', kind:'case', title:'When stretching suppliers backfires', blocks:[
    CASE('The foam supplier says stop',
      `<p>During last year's cash squeeze, the previous GM told finance to pay all suppliers "as late as possible". Payable days went from 51 to 75 at the peak, about 12 days later on average over the year. It worked for a few months.</p>
       <p>Then the main foam supplier put BraceWorks on <strong>cash in advance</strong>. A $30,000 delivery was held until payment cleared. The mattress line stopped for six days. An urgent hospital order was shipped by air freight to avoid a penalty. And at the next price review, the supplier added 4%.</p>`),
    FS({title:'What stretching suppliers really cost', rows:[
      ['Cash gained by paying 12 days later on average', 18100],
      ['Lost orders and overtime after six days without mattress output', -12000],
      ['Air freight instead of sea on the urgent order', -6500],
      ['Supplier\'s 4% price increase on $210,000 of foam a year', -8400],
      ['Net effect in the first year', -8800, 'total']
    ], note:'And the $18,100 was a one-off cash gain, while the price increase repeats every year: about $8,400 a year, for good.'}),
    Q('What should BraceWorks have done instead?',[
      {text:'Stretched only the smaller suppliers', why:'Small suppliers are often the most fragile. Damaging them can cut off a critical part.'},
      {text:'Freed cash from receivables and inventory first, and negotiated any change in supplier terms openly'},
      {text:'Stopped paying suppliers until customers paid', why:'This would breach contracts and put supply at risk.'},
      {text:'Bought less foam each month', why:'Only sensible if inventory is too high, which is a separate decision.'}
    ],1,'Receivables and inventory hold far more cash than payables, and pulling them in doesn\'t hurt anyone. If supplier terms must change, ask: many suppliers agree to longer terms in exchange for a volume commitment or reliable, predictable payment.'),
    K('How accounting spots it',
      `<p>Watch payable days next to the supplier aging. Rising payable days with a growing number of invoices past due, supplier statements with "overdue" warnings, or requests for cash in advance are all signs the business is using suppliers as a hidden overdraft.</p>`)
  ]},
  {id:'quiz', label:'Quiz', kind:'quiz', title:'Check your understanding', blocks:[
    Q('Inventory days 106, receivable days 70, payable days 63. What is the cash conversion cycle?',['239 days','113 days','99 days','43 days'],1,'106 + 70 − 63 = 113 days.'),
    Q('BraceWorks\' sales are $1.2M a year. Roughly how much cash does reducing receivable days by 10 release?',['$3,288','$32,900','$120,000','$10,000'],1,'10 × $1,200,000 ÷ 365 ≈ $32,900.'),
    Q('Offering customers 2% off for paying 50 days early costs about…',['2% a year','8% a year','14.9% a year','50% a year'],2,'2 ÷ 98 × 365 ÷ 50 ≈ 14.9%.'),
    Q('Which lever usually holds the most cash for a manufacturer like BraceWorks?',['Payables','Receivables and inventory','Prepayments','Tax payable'],1,'$480,000 sits in receivables and inventory, against $95,000 of payables.'),
    Q('Who can actually change inventory days?',['Only finance','Production, purchasing and sales planning together','Only the warehouse','The auditors'],1,'Stock levels come from purchasing, production and planning decisions.'),
    Q('Why is invoicing on the day of shipment important?',['It\'s the law everywhere','The customer\'s payment clock starts from the invoice, so delays add directly to receivable days','It reduces tax','It increases prices'],1,'Every day between shipping and invoicing is a day of free credit to the customer.')
  ]},
  {id:'apply', label:'Practice', kind:'apply', title:'Practise on a sample pack', blocks:[
    PACK('packC',4,'Pack C, page 4: balance sheet'),
    Q('Pack C shows receivable days 77, inventory days 105 and payable days 65. What is the cash conversion cycle?',['247 days','117 days','93 days','65 days'],1,'105 + 77 − 65 = 117 days, up from 113 at the start of the year.'),
    Q('Receivable days rose from 68 in March (Pack B) to 77 in July. What drove most of it?',['Slower payment by everyone','US distributor A\'s large order on 90-day terms, plus US distributor B drifting','Invoices sent late','The Saudi LC'],1,'One set of terms agreed without a cash check moved the whole number (Module 16).'),
    Q('Payables are up $23,000 since December. Should BraceWorks stretch suppliers further to get through August?',['Yes, to 120 days','No: agree any delay openly with the foam supplier, and free cash from receivables and stock first','Stop paying suppliers','Pay suppliers early'],1,'Remember what happened when suppliers were stretched before (Module 16).'),
    {t:'html',html:'<h3>Later, with your own report</h3><p class="small" style="color:var(--muted)">Optional. When you next read your own monthly report, use this checklist. Nothing here is shared or sent; ticks are saved only in this browser.</p>'},
    CHECK('m16-plan','Working capital plan',[
      'Finance: report receivable, inventory and payable days monthly, with targets and a 12-month trend',
      'Finance: invoice every shipment the same day, with complete export documents',
      'Sales: confirm payment terms before every order; deposits on custom and first orders',
      'Finance and sales: weekly collections call list from the receivables aging',
      'Production and purchasing: reorder points and maximums for the top 30 materials',
      'Sales and production: monthly sales and operations planning meeting',
      'Operations: review stock over 180 days old; sell, rework or write off',
      'Purchasing: review payment terms with the top 10 suppliers, openly and fairly'
    ]),
    REPORT('Your Monday-morning question',
      `<p>Ask: <strong>"What's our cash conversion cycle, and how has it moved over the last 12 months?"</strong> Then set a target for each part of it, with an owner.</p>`),
    K('Takeaways',
      `<ul>
        <li>Cash conversion cycle = inventory days + receivable days − payable days.</li>
        <li>For BraceWorks, each day of receivables is worth $3,288 and each day of stock $2,356.</li>
        <li>Receivables and inventory hold the most cash. Payables should be paid on time, not stretched.</li>
        <li>Work out discounts as an annual rate before offering or accepting them.</li>
       </ul>`)
  ]}
  ],
  warnings:[
    {sign:'Cash conversion cycle lengthening', meaning:'More cash needed to run the same business.', look:'Which part moved: receivables, inventory or payables.'},
    {sign:'Payable days rising with supplier complaints', meaning:'Using suppliers as a hidden overdraft. Supply and price risk.', look:'Supplier aging; stop-supply or cash-in-advance demands.'},
    {sign:'Invoices raised days after shipment', meaning:'Free credit given to customers; higher receivable days.', look:'Shipping date vs invoice date.'},
    {sign:'Customers taking discounts but paying late', meaning:'Paying for early payment you aren\'t getting.', look:'Discounts taken vs payment dates.'}
  ],
  formulas:[
    {name:'Cash conversion cycle', f:'Inventory days + Receivable days − Payable days', ex:'106 + 70 − 63 = 113 days'},
    {name:'Payable days', f:'Payables ÷ Materials purchased (or COGS) × 365', ex:'$95,000 ÷ $552,000 × 365 = 63 days'},
    {name:'Cash released by fewer receivable days', f:'Days reduced × Sales ÷ 365', ex:'12 × $1,200,000 ÷ 365 = $39,450'},
    {name:'Annual cost of an early-payment discount', f:'Discount % ÷ (100 − Discount %) × 365 ÷ Days earlier', ex:'2 ÷ 98 × 365 ÷ 50 = 14.9%'}
  ],
  glossary:[
    {term:'Cash conversion cycle', def:'The number of days cash is tied up between paying suppliers and collecting from customers.'},
    {term:'Payable days (DPO)', def:'Average number of days taken to pay suppliers.'},
    {term:'Early-payment discount', def:'A discount for paying before the due date, such as 2/10 net 60: 2% off if paid in 10 days, otherwise due in 60.'},
    {term:'Sales and operations planning (S&OP)', def:'A regular meeting where sales, production and purchasing agree one plan for demand, output and stock.'},
    {term:'Reorder point', def:'The stock level at which a new purchase order is placed.'},
    {term:'SKU', def:'Stock-keeping unit: each distinct product variant held in stock.'},
    {term:'Cash in advance', def:'Payment terms where the buyer pays before goods are shipped.'}
  ]
});
})();
