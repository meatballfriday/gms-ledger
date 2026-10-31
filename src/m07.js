/* ===== Module 7: Inventory ===== */
(function(){
const {K,TIP,FLAG,CASE,REPORT,Q,FS,FLIP,SORT,CHECK,W,PACK,money,signed,pct,kfmt} = BW.h;

BW.add({
  id:'m7', minutes:40,
  title:'Inventory',
  subtitle:'BraceWorks\' biggest asset after its machines. How stock flows through the factory, how it\'s valued, how it can flatter profit, and how it leaks away.',
  goals:[
    'Follow costs from raw materials through work-in-progress to finished goods and the P&L',
    'Explain how producing more than you sell can make profit look better while cash gets worse',
    'Read an inventory aging and the main stock KPIs',
    'Find the causes of stock count differences'
  ],
  sections:[
  {id:'flow', label:'How stock flows', kind:'learn', title:'How costs flow through the factory', blocks:[
    `<p>In a factory, inventory has three stages. Costs move from one to the next, and only reach the P&amp;L when the product is sold.</p>`,
    {t:'tbl', head:['Stage','What it is','At BraceWorks','Year-end value'], opts:{num:[3]}, rows:[
      ['<strong>Raw materials</strong>','Purchased inputs not yet issued to production','Foam blocks, fabric rolls, webbing, buckles, cartons','$140,000'],
      ['<strong>Work-in-progress</strong>','Products started but not finished. Includes materials, labour and overhead so far.','Cut foam waiting for covers, half-sewn slings, braces waiting for QA release','$35,000'],
      ['<strong>Finished goods</strong>','Completed, released products waiting to ship','Boxed mattresses, packed slings and braces','$75,000']
    ]},
    `<h3>BraceWorks' inventory flow for the year</h3>`,
    FS({title:'Where the factory\'s costs went', rows:[
      'Raw materials',
      ['Opening raw materials', 118000, 'ind'],
      ['Purchases', 588000, 'ind'],
      ['Issued to production', -566000, 'ind'],
      ['Closing raw materials', 140000, 'sub'],
      'Work-in-progress',
      ['Opening WIP', 30000, 'ind'],
      ['Materials issued', 566000, 'ind'],
      ['Direct labour', 156000, 'ind'],
      ['Factory overhead', 161000, 'ind'],
      ['Completed and moved to finished goods', -878000, 'ind'],
      ['Closing WIP', 35000, 'sub'],
      'Finished goods',
      ['Opening finished goods', 57000, 'ind'],
      ['Completed production', 878000, 'ind'],
      ['Sold: cost of goods sold on the P&L', -860000, 'ind'],
      ['Closing finished goods', 75000, 'total']
    ], note:'The factory spent $883,000 making products, but only $860,000 reached the P&L. The other $23,000 is sitting in the warehouse as extra WIP and finished goods.'}),
    K('Wages can sit on a shelf',
      `<p>Here's something that surprises most GMs. Some of this year's factory wages, power and rent aren't on the P&amp;L at all. They're inside the stock on the balance sheet, waiting for those products to be sold. Keep that in mind for the next exercise.</p>`),
    TIP('How stock is valued',
      `<p>Accounting standards allow a few methods for valuing stock you bought at different prices:</p>
       <ul>
        <li><strong>First in, first out (FIFO):</strong> assumes the oldest stock is used first. Closing stock is valued at recent prices.</li>
        <li><strong>Weighted average:</strong> every unit carries the average cost of all units held.</li>
        <li><strong>Standard cost:</strong> stock is valued at the planned cost, and differences go to variance accounts (Module 8). Common in factories, as long as standards are kept close to actual.</li>
       </ul>
       <p>Whatever the method, stock is never valued above what it can be sold for (Module 4).</p>`)
  ]},
  {id:'absorb', label:'The overproduction trap', kind:'play', title:'Can you make profit by making more?', blocks:[
    `<p>Imagine BraceWorks made one average product: price $52, materials and other variable costs $26 a unit, and $308,000 a year of fixed factory costs (production wages and overhead). It sells 23,000 units a year, and opex is $246,000.</p>
     <p>Sales stay at 23,000 units. Change how many units the factory <em>makes</em>.</p>`,
    W('Production volume vs profit and cash', function(el, ctx){
      const {money,signed}=ctx.h;
      const top=document.createElement('div'), out=document.createElement('div'); el.append(top,out);
      const PRICE=52, VC=26, FIXED=308000, OPEX=246000, SALES=23000;
      const calc=prod=>{ const fpu=FIXED/prod, uc=VC+fpu, cogs=SALES*uc, closing=(prod-SALES)*uc, profit=SALES*PRICE-cogs-OPEX, cash=SALES*PRICE-VC*prod-FIXED-OPEX; return {fpu,uc,cogs,closing,profit,cash}; };
      const b=calc(SALES);
      ctx.ui.sliders(top,[{k:'prod',label:'Units produced this year',min:23000,max:30000,step:250,v:23000,f:x=>x.toLocaleString('en-US')}],(v)=>{
        const r=calc(v.prod);
        out.innerHTML=`<div class="stats">
          ${ctx.ui.stat('Fixed cost in each unit',money(r.fpu,2),'',`was ${money(b.fpu,2)}`)}
          ${ctx.ui.stat('Profit (absorption costing)',money(Math.round(r.profit)),r.profit>b.profit+100?'warn':'',signed(Math.round(r.profit-b.profit)))}
          ${ctx.ui.stat('Cash from the year',money(Math.round(r.cash)),r.cash<b.cash-100?'bad':'',signed(Math.round(r.cash-b.cash)))}
          ${ctx.ui.stat('Extra stock in the warehouse',money(Math.round(r.closing)),r.closing>0?'warn':'')}
        </div>
        <p class="w-hint" style="margin-top:10px">${v.prod>SALES?`Making ${(v.prod-SALES).toLocaleString('en-US')} extra units spreads fixed costs thinner, so each unit sold carries less of them. Profit rises by ${money(Math.round(r.profit-b.profit))}, but nothing more was sold. The "profit" is fixed cost parked in the warehouse, and cash fell by ${money(Math.round(b.cash-r.cash))} to pay for materials.`:'Producing exactly what you sell: profit and the stock level both stay put. Now drag the slider right.'}</p>`;
      },ctx.uid);
    }),
    FLAG('Watch for this in your own reports',
      `<p>When finished goods rise and profit improves in the same months, ask whether you're selling more or just making more. A bonus based on profit can reward overproduction. Some companies also report a second view called <span class="term">variable (marginal) costing</span>, which charges all fixed factory costs to the period. It can't be inflated by building stock.</p>`),
    Q('Profit is up $40,000 this quarter, sales are flat, and finished goods inventory is up $90,000. What\'s the most likely explanation?',[
      'The factory became more efficient','Fixed factory costs were absorbed into extra stock, flattering profit','Prices went up','An error in the cash flow statement'],1,
      'With flat sales, higher profit plus a stock build points to overproduction. Ask what\'s in that extra stock and whether it\'s ordered.')
  ]},
  {id:'health', label:'Stock health', kind:'learn', title:'Reading inventory health', blocks:[
    `<h3>The KPIs that matter</h3>`,
    {t:'tbl', head:['KPI','Formula','BraceWorks','What it tells you'], opts:{num:[2]}, rows:[
      ['<strong>Inventory days</strong>','Inventory ÷ Cost of goods sold × 365','106 days','How long stock sits before it\'s sold. Lower frees cash.'],
      ['<strong>Inventory turns</strong>','Cost of goods sold ÷ Average inventory','3.8×','How many times stock is "used up" in a year. Higher is leaner.'],
      ['<strong>Stock record accuracy</strong>','Items where count matches system ÷ Items counted','86%','Whether you can trust the system. Aim for 95%+.'],
      ['<strong>Slow-moving share</strong>','Stock with no movement in 6 months ÷ Total','15%','Risk of future write-downs.']
    ]},
    `<h3>BraceWorks' inventory aging</h3><p>An <span class="term">aging report</span> groups stock by how long it's been held. Here's BraceWorks at year-end:</p>`,
    W('Inventory aging', function(el, ctx){
      const {money}=ctx.h;
      const rows=[['0–90 days',172000,''],['91–180 days',41000,'warn'],['181–365 days',22000,'bad'],['Over 1 year',15000,'bad']];
      el.innerHTML=ctx.ui.bars(rows.map(r=>({label:r[0],v:r[1],tone:r[2]}))) +
        `<p class="w-hint" style="margin-top:10px">$37,000, about 15% of stock, hasn't moved in over six months. That's where the write-downs in Module 4 came from. A monthly aging report would have flagged them a year earlier.</p>`;
    }),
    `<h3>Controls that keep inventory honest</h3>
     <ul>
      <li><strong>Cycle counting:</strong> count a few items every week instead of everything once a year. Count high-value items such as foam monthly.</li>
      <li><strong>First expired, first out:</strong> for adhesives, latex and anything with a shelf life, issue the oldest lot first.</li>
      <li><strong>Lot traceability:</strong> ISO 13485 already requires you to trace each finished device to its material lots. The same records show where stock goes.</li>
      <li><strong>Recorded scrap:</strong> every damaged or wasted item is booked out with a reason, so the system matches reality.</li>
      <li><strong>Reorder points:</strong> a minimum and maximum level for each material, so purchasing doesn't buy on instinct.</li>
     </ul>`,
    K('Stock is cash in a different shape',
      `<p>Every $10,000 of extra stock is $10,000 that isn't in the bank, plus the costs of storing, insuring and handling it. Carrying costs usually run 15% to 25% of stock value a year. For BraceWorks' $250,000, that's roughly $40,000 to $60,000 a year, about as much as the whole net profit.</p>`)
  ]},
  {id:'case', label:'Case: the count', kind:'case', title:'The year-end count', blocks:[
    CASE('$19,400 missing',
      `<p>At the year-end stock count, the physical count comes to <strong>$19,400 less</strong> than the system says. The stores supervisor insists nothing was stolen. Finance wants to post the difference as one line, "stock adjustment", and move on.</p>
       <p>You ask for the difference by item, and spend a morning on the floor. Here's what you find:</p>
       <ul>
        <li><strong>Foam offcuts</strong> are thrown in the skip after cutting and never booked out. The system assumes 8% waste; the real figure is nearer 15%.</li>
        <li><strong>The fabric quantity in the mattress BOM is wrong.</strong> The system deducts 4.2 m per cover, but the cutters actually use 4.6 m.</li>
        <li><strong>Samples</strong> sent to prospective distributors are taken from finished goods with no paperwork.</li>
        <li><strong>Buckles and webbing</strong>, small and useful at home, are short by more than any process would explain.</li>
       </ul>`),
    {t:'tbl', head:['Cause','Value','Type'], opts:{num:[1]}, rows:[
      ['Unrecorded foam scrap','$11,000','Real cost, hidden'],
      ['Wrong fabric quantity in the BOM (0.4 m × 2,800 covers)','$3,600','Wrong unit cost'],
      ['Unrecorded samples','$2,300','Real cost, hidden'],
      ['Probable theft of small items','$2,500','Loss'],
      {cls:'',cells:['<strong>Total difference</strong>','<strong>$19,400</strong>','']}
    ]},
    SORT('What does each finding mean for your numbers?',['Costs were understated','Unit costs are wrong','Both'],[
      {text:'Foam offcuts not booked out', a:2, why:'Scrap wasn\'t in the monthly costs, so profit was overstated all year. And the 8% waste allowance in the standard cost is too low, so unit costs are too.'},
      {text:'Fabric BOM says 4.2 m, reality is 4.6 m', a:2, why:'Every mattress has been costed $1.28 too cheap, so quotes were too low too. The shortfall built up silently in inventory.'},
      {text:'Samples taken with no paperwork', a:0, why:'Samples are a marketing cost. They belong in the P&L, recorded when they go out.'},
      {text:'Buckles and webbing going missing', a:0, why:'A real loss that\'s been hiding inside inventory. It also points to a security gap.'}
    ]),
    Q('Finance wants to post the $19,400 as one "stock adjustment" line. What\'s wrong with that?',[
      {text:'Nothing. The amount is small.', why:'It\'s 26% of the year\'s profit before tax, and the causes keep repeating every month.'},
      {text:'It fixes the balance sheet but hides four separate problems, two of which make every unit cost and quote wrong'},
      {text:'It should be posted to equity instead', why:'Stock losses are a cost of the business. They belong in the P&L.'},
      {text:'It should be spread over next year', why:'The loss has already happened. It belongs in this year.'}
    ],1,'The adjustment fixes the number but not the cause. Correct the BOM and the scrap allowance, start recording scrap and samples, and lock up small high-value items. Then the difference shrinks next year.'),
    K('How accounting finds stock problems',
      `<p>A count difference is a symptom. The cure is in four habits: count high-value items monthly; analyse differences <strong>by item</strong>, not just in total; compare actual material usage with the BOM every month (Module 8 calls this the usage variance); and record scrap with a reason code. Each one turns a vague year-end surprise into a specific monthly fix.</p>`)
  ]},
  {id:'quiz', label:'Quiz', kind:'quiz', title:'Check your understanding', blocks:[
    Q('Cut foam waiting for its cover to be sewn is…',['Raw materials','Work-in-progress','Finished goods','Cost of goods sold'],1,'It has started its journey through production but isn\'t finished.'),
    Q('When do factory wages reach the P&L?',['When they\'re paid','When the products they helped make are sold','At year-end','Never; they stay in inventory'],1,'Under absorption costing, factory wages become part of product cost, held in inventory until the products are sold.'),
    Q('BraceWorks\' cost of goods sold is $860,000 and average inventory is $227,500. What are inventory turns?',['2.6×','3.8×','5.0×','106×'],1,'$860,000 ÷ $227,500 = 3.8. That\'s about 96 days on average stock, or 106 days on year-end stock.'),
    Q('Which method is best for medical components with an expiry date?',['Last in, first out','First expired, first out','Random issue','Whatever is nearest the door'],1,'Issue the earliest-expiring lots first, so nothing expires on the shelf.'),
    Q('Your stock count is $19,400 below the system. What should you ask for first?',['A new stock system','The difference broken down by item','A new stores supervisor','A write-off to equity'],1,'Item-level differences point to causes: BOM errors, unrecorded scrap, samples or theft.'),
    Q('Making more than you sell, with absorption costing, tends to…',['Lower profit and raise cash','Raise profit and lower cash','Raise both','Lower both'],1,'Fixed costs get parked in stock, flattering profit, while cash goes into materials and wages for unsold goods.')
  ]},
  {id:'apply', label:'Practice', kind:'apply', title:'Practise on a sample pack', blocks:[
    PACK('packD',4,'Pack D, page 4: balance sheet'),
    Q('Finished goods rose $34,000 (44%) in October and November, while sales were close to budget. What\'s the first question to ask?',['Is the warehouse big enough?','Which customer orders is this stock for, and how much was produced compared with sales?','Can we raise prices?','Is the stock insured?'],1,'Overproduction parks fixed costs in stock and flatters profit (Module 7).'),
    Q('Inventory days of 108 is the only amber KPI on Pack D\'s dashboard. Why should it worry you more than amber suggests?',['It shouldn\'t','Rising stock is absorbing cash and may be flattering profit, which the other green KPIs hide','Because the target is wrong','Because it\'s measured monthly'],1,'Read KPIs together. Stock growth plus negative operating cash plus record margin is a pattern.'),
    PACK('packB',7,'Pack B, page 7: close checklist'),
    Q('Pack B reports stock record accuracy of 91% from cycle counts. Good enough?',['Yes','Not yet: aim for 95% or more, and look at the items that didn\'t match','It\'s too high','Accuracy doesn\'t matter'],1,'Item-level differences point to BOM errors, unrecorded scrap or theft (Module 7).'),
    {t:'html',html:'<h3>Later, with your own report</h3><p class="small" style="color:var(--muted)">Optional. When you next read your own monthly report, use this checklist. Nothing here is shared or sent; ticks are saved only in this browser.</p>'},
    CHECK('m7-inv','My monthly pack or team provides…',[
      'Inventory split into raw materials, work-in-progress and finished goods, with movement from last month',
      'Inventory days or turns, with a 12-month trend',
      'An aging report showing stock over 90, 180 and 365 days',
      'A list of finished goods not linked to a customer order',
      'Cycle count results and stock record accuracy',
      'Recorded scrap by reason, compared with the standard allowance',
      'A warning when finished goods rise while sales are flat'
    ]),
    REPORT('Your Monday-morning question',
      `<p>Ask: <strong>"What were last year's stock count differences, broken down by item, and what did we change because of them?"</strong> If the answer is one adjustment line and no changes, expect the same surprise again.</p>`),
    K('Takeaways',
      `<ul>
        <li>Costs flow from raw materials to WIP to finished goods, and reach the P&amp;L only when products are sold.</li>
        <li>Producing more than you sell parks fixed costs in stock: profit up, cash down.</li>
        <li>Watch inventory days, aging, record accuracy and slow-moving stock monthly.</li>
        <li>Stock count differences have causes. Find them item by item, and fix the BOM, scrap recording and security.</li>
       </ul>`)
  ]}
  ],
  warnings:[
    {sign:'Finished goods rising while sales are flat', meaning:'Overproduction. Profit is flattered by fixed costs parked in stock.', look:'Production volume vs sales volume; finished goods not linked to orders.'},
    {sign:'Big stock count differences at year-end', meaning:'Unrecorded scrap, BOM errors, samples, or theft.', look:'Differences by item; monthly cycle counts.'},
    {sign:'Stock over 180 days old growing', meaning:'Future write-downs. Over-buying or products losing demand.', look:'Inventory aging report; purchasing decisions.'},
    {sign:'Inventory days rising', meaning:'Cash being absorbed by stock.', look:'Inventory days by category, monthly.'}
  ],
  formulas:[
    {name:'Inventory days', f:'Inventory ÷ Cost of goods sold × 365', ex:'$250,000 ÷ $860,000 × 365 = 106 days'},
    {name:'Inventory turns', f:'Cost of goods sold ÷ Average inventory', ex:'$860,000 ÷ $227,500 = 3.8×'},
    {name:'Stock record accuracy', f:'Items where count = system ÷ Items counted', ex:'172 of 200 items match = 86%'},
    {name:'Cost of goods sold (from stock)', f:'Opening inventory + Production cost − Closing inventory', ex:'Finished goods: $57,000 + $878,000 − $75,000 = $860,000'}
  ],
  glossary:[
    {term:'Raw materials', def:'Purchased inputs not yet issued to production.'},
    {term:'Work-in-progress (WIP)', def:'Products started but not finished, valued at the materials, labour and overhead put in so far.'},
    {term:'Finished goods', def:'Completed, released products waiting to be shipped.'},
    {term:'FIFO', def:'First in, first out. A valuation method assuming the oldest stock is used first.'},
    {term:'Weighted average cost', def:'Valuing stock at the average cost of all units held.'},
    {term:'Inventory aging', def:'Report grouping stock by how long it has been held.'},
    {term:'Inventory turns', def:'How many times inventory is used up in a year. Cost of goods sold divided by average inventory.'},
    {term:'Cycle counting', def:'Counting a portion of stock items regularly throughout the year instead of everything at once.'},
    {term:'Shrinkage', def:'Stock lost to theft, damage or unrecorded scrap. The gap between system and physical quantities.'},
    {term:'Variable (marginal) costing', def:'Costing that treats fixed factory costs as period expenses, so building stock can\'t inflate profit.'},
    {term:'Carrying cost', def:'The cost of holding stock: capital tied up, storage, insurance, handling, obsolescence. Often 15–25% of value per year.'},
    {term:'Lot traceability', def:'Records linking each finished device to the material lots used. Required under ISO 13485.'}
  ]
});
})();
