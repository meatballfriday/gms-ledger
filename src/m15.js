/* ===== Module 15: Budgeting and forecasting ===== */
(function(){
const {K,TIP,FLAG,CASE,REPORT,Q,FS,FLIP,SORT,CHECK,W,PACK,money,signed,pct,kfmt} = BW.h;

BW.add({
  id:'m15', minutes:45,
  title:'Budgeting and forecasting',
  subtitle:'A budget is your plan for the year in numbers. A forecast is your best guess of how the year will actually end. You need both.',
  goals:[
    'Build a budget in the right order, from sales to cash',
    'Compare actual results with a flexed budget, not just the original',
    'Use rolling forecasts and scenarios to see the year ahead',
    'Spot an unrealistic budget before it causes damage'
  ],
  sections:[
  {id:'why', label:'Why budget', kind:'learn', title:'What a budget is for', blocks:[
    `<p>A <span class="term">budget</span> turns your plans into numbers: how much you'll sell, what it will cost, how many people you need, what you'll invest, and what happens to cash. It does four jobs:</p>
     <ul>
      <li><strong>Planning:</strong> it forces you to think the year through, and to spot problems such as a cash gap in June before they happen.</li>
      <li><strong>Coordination:</strong> sales, production and purchasing work from the same numbers.</li>
      <li><strong>Control:</strong> each month, actual results are compared with the plan, and big differences are explained.</li>
      <li><strong>Accountability:</strong> each manager owns part of the budget.</li>
     </ul>
     <h3>Build it in this order</h3>
     <p>Each step depends on the one before, so the order matters.</p>`,
    {t:'tbl', head:['Step','Budget','Built from'], rows:[
      ['1','<strong>Sales</strong>: units and prices by product and customer','Signed contracts, customer forecasts, pipeline, price plan'],
      ['2','<strong>Production</strong>: units to make','Sales plus or minus planned stock changes'],
      ['3','<strong>Materials and purchasing</strong>','Production × bill of materials × expected prices'],
      ['4','<strong>Labour</strong>: hours, headcount, wage rates','Production × routing; wage increases; hires'],
      ['5','<strong>Overheads and operating expenses</strong>','Last year, adjusted line by line for known changes'],
      ['6','<strong>Capital spending</strong>','Approved investment proposals (Module 14)'],
      ['7','<strong>P&amp;L</strong>','All of the above'],
      ['8','<strong>Cash flow and balance sheet</strong>','P&amp;L plus payment terms, stock levels, capex, loans']
    ]},
    TIP('Top-down or bottom-up?',
      `<p>Top-down: the owner sets targets ("grow 10%"). Bottom-up: each manager builds their numbers. The best budgets do both: the GM sets the ambition, managers build realistic plans, and the gap gets discussed openly. A budget no one believes in won't be used.</p>`)
  ]},
  {id:'build', label:'Build next year', kind:'play', title:'Build BraceWorks\' budget for next year', blocks:[
    `<p>Set the assumptions for next year. The budget P&amp;L and cash flow update as you go. Remember what you learned: price beats volume, volume needs working capital, and growth may need people.</p>`,
    W('Budget builder', function(el, ctx){
      const {money,signed,pct}=ctx.h;
      const top=document.createElement('div'), out=document.createElement('div'); el.append(top,out);
      ctx.ui.sliders(top,[
        {k:'vol',label:'Sales volume growth',min:-10,max:30,step:1,v:5,f:x=>(x>0?'+':'')+x+'%'},
        {k:'price',label:'Price increase',min:0,max:10,step:0.5,v:3,f:x=>'+'+x+'%'},
        {k:'mat',label:'Material price inflation',min:0,max:12,step:0.5,v:4,f:x=>'+'+x+'%'},
        {k:'wage',label:'Wage increase',min:0,max:12,step:0.5,v:6,f:x=>'+'+x+'%'},
        {k:'hires',label:'Extra production staff',min:0,max:12,step:1,v:0,f:x=>x+' people'},
        {k:'oh',label:'Overhead and admin inflation',min:0,max:10,step:0.5,v:4,f:x=>'+'+x+'%'},
        {k:'capex',label:'Equipment purchases',min:0,max:120000,step:5000,v:60000,f:money}
      ],(v)=>{
        const V=1+v.vol/100, P=1+v.price/100;
        const rev=1200000*V*P, mat=552000*V*(1+v.mat/100), frt=48000*V, com=rev*0.02;
        const lab=152000*(1+v.wage/100)+v.hires*4000*(1+v.wage/100);
        const dep2=v.capex/8;
        const ovh=118000*(1+v.oh/100)+38000+dep2, opex=174000*(1+v.oh/100), intr=20000;
        const gp=rev-mat-lab-ovh, pbt=gp-frt-com-opex-intr, tax=Math.max(0,pbt*0.25), np=pbt-tax;
        const dWC=0.32*(rev-1200000), cash=np+38000+dep2-dWC-v.capex-20000;
        const cm=(rev-mat-frt-com)/rev, fixed=lab+ovh+opex+intr, be=fixed/cm;
        const capNeed=Math.max(0,(v.vol-5)/2.6); // extra staff needed beyond 5% spare capacity
        out.innerHTML=BW.fsHTML({title:'Budget vs this year',cols:['This year','Budget','Change'],rows:[
          ['Revenue',[1200000,Math.round(rev),signed(Math.round(rev-1200000))],'sub'],
          ['Materials',[-552000,-Math.round(mat),'']], ['Production labour',[-152000,-Math.round(lab),'']], ['Factory overhead',[-156000,-Math.round(ovh),'']],
          ['Gross profit',[340000,Math.round(gp),signed(Math.round(gp-340000))],'sub'],
          ['Gross margin',['28.3%',pct(gp/rev),''],'muted'],
          ['Freight, commission, admin, interest',[-266000,-Math.round(frt+com+opex+intr),'']],
          ['Profit before tax',[74000,Math.round(pbt),signed(Math.round(pbt-74000))],'total']
        ]})+
        `<div class="stats" style="margin-top:12px">${ctx.ui.stat('Net profit',money(Math.round(np)),np<0?'bad':np<55500?'warn':'good','this year $55,500')}${ctx.ui.stat('Extra working capital needed',money(Math.round(dWC)),dWC>40000?'warn':'')}${ctx.ui.stat('Net cash flow for the year',money(Math.round(cash)),cash<0?'bad':'good','after capex and loan repayments')}${ctx.ui.stat('Break-even sales',money(Math.round(be)),'',`margin of safety ${pct((rev-be)/rev)}`)}</div>
        <div class="msg ${cash<-30000||pbt<0?'bad':capNeed>v.hires+0.5?'warn':'info'}" style="margin-top:12px">${pbt<0?'This budget makes a loss. Costs are rising faster than prices. Look at the price assumption first.':capNeed>v.hires+0.5?`Volume growth of ${v.vol}% needs roughly ${Math.ceil(capNeed)} more production staff, as the factory has only about 5% spare capacity. Add them, or the budget can't be delivered.`:cash<-30000?`Profitable, but cash falls by ${money(Math.round(-cash))}: growth needs working capital and the equipment needs paying for. That's more than the $30,000 of unused overdraft. Plan the funding now.`:v.price<v.mat*0.6?'Material prices rise faster than your prices. Margin is being squeezed. Is the price assumption brave enough?':'A balanced budget. Check it against the cash forecast month by month, especially in the peak season.'}</div>`;
      },ctx.uid);
    }),
    K('Budget the cash, not just the profit',
      `<p>A budget that only shows profit is half a budget. Growth uses cash for stock and receivables; equipment uses cash up front; loans need repaying. The cash budget, month by month, tells you whether you'll need more funding, and when to ask the bank. Banks are much happier to lend when you ask months ahead with a plan.</p>`)
  ]},
  {id:'flex', label:'Budget vs actual', kind:'learn', title:'Comparing actuals with a flexed budget', blocks:[
    `<p>In October, BraceWorks sold 10% less than budgeted. Here's the usual budget-vs-actual report:</p>`,
    FS({title:'October: actual vs original budget', cols:['Budget','Actual','Variance'], rows:[
      ['Revenue', [100000, 90000, '(10,000)']],
      ['Materials', [-46000, -43200, '2,800']],
      ['Production labour', [-12700, -12900, '(200)']],
      ['Factory overhead', [-13000, -13400, '(400)']],
      ['Selling and admin', [-20500, -20300, '200']],
      ['Profit', [7800, 200, '(7,600)'], 'total']
    ]}),
    `<p>It looks as if materials were well controlled: $2,800 under budget. But materials <em>should</em> be lower when you make 10% less. The comparison is unfair.</p>
     <p>A <span class="term">flexed budget</span> adjusts the budget to the actual volume. Variable costs are scaled down; fixed costs stay the same.</p>`,
    FS({title:'October: actual vs flexed budget (90% volume)', cols:['Flexed budget','Actual','Variance'], rows:[
      ['Revenue', [90000, 90000, '–']],
      ['Materials (46% of revenue)', [-41400, -43200, '(1,800)']],
      ['Production labour (fixed)', [-12700, -12900, '(200)']],
      ['Factory overhead (fixed)', [-13000, -13400, '(400)']],
      ['Selling and admin (fixed)', [-20500, -20300, '200']],
      ['Profit', [2400, 200, '(2,200)'], 'total']
    ]}),
    K('Two very different stories',
      `<p>The $7,600 shortfall splits in two:</p>
       <ul>
        <li><strong>$5,400 from lower volume</strong> (budget $7,800 vs flexed $2,400). That's a sales question.</li>
        <li><strong>$2,200 from spending and efficiency</strong> (flexed $2,400 vs actual $200). Materials were actually <strong>$1,800 over</strong> what 90% volume should cost. That's a production and purchasing question, and the original report hid it completely.</li>
       </ul>`),
    Q('Sales are 20% below budget, and materials are 15% below budget. Using a flexed budget, how did materials perform?',['Well: 15% under budget','Badly: about 6% more than they should be for the actual volume','Exactly on target','You can\'t tell'],1,
      'At 80% volume, materials should be 80% of budget. They\'re at 85%, so 85 ÷ 80 = 6% too high.')
  ]},
  {id:'fcst', label:'Forecasts and scenarios', kind:'learn', title:'Rolling forecasts and scenarios', blocks:[
    `<p>The budget is fixed once the year starts. It's your yardstick. But by March, things have changed. A <span class="term">forecast</span>, sometimes called the latest estimate, is updated every month or quarter with what you now expect. Comparing the two tells you how far off plan the year will end, while there's still time to act.</p>
     <h3>Phase the budget by month</h3>
     <p>A budget split into twelve equal months is useless for monthly comparison. Hospital buying has seasons. Here's BraceWorks' typical sales pattern:</p>`,
    W('Monthly sales phasing', function(el, ctx){
      const m=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], s=[78,84,102,96,98,104,88,92,112,108,124,114];
      el.innerHTML=ctx.ui.bars(m.map((x,i)=>({label:x,v:s[i]*1000,tone:s[i]>=110?'good':s[i]<90?'warn':''})),{fmt:x=>'$'+(x/1000)+'k',max:124000})+
      `<p class="w-hint" style="margin-top:10px">January and February are slow, after hospitals spend their year-end budgets. September to December are busy. Budgeting $100k every month would make January look like a disaster and November look like a triumph, when both are normal.</p>`;
    }),
    `<h3>Three scenarios, not one number</h3>
     <ul>
      <li><strong>Base case:</strong> what you expect.</li>
      <li><strong>Downside:</strong> what if the largest customer cuts orders by 30%, or foam rises 10%? What would you do, and does cash survive?</li>
      <li><strong>Upside:</strong> what if the Australian tender comes through? Do you have the capacity and cash to deliver it?</li>
     </ul>`,
    K('Decide your triggers in advance',
      `<p>For the downside, agree now what you'll do if it happens: "If orders for Q2 are below $250k by 31 March, we freeze hiring and delay the cutter." Decisions made calmly in advance are better than decisions made in a panic.</p>`)
  ]},
  {id:'case', label:'Case: the hockey stick', kind:'case', title:'The hockey-stick budget', blocks:[
    CASE('Twenty-five percent growth, mostly in Q4',
      `<p>Last year's budget was built mainly by the sales team. It showed <strong>25% growth</strong>: flat for nine months, then a big jump in Q4 from "a new distributor in Japan" that was still being negotiated. Production planned around it: four new hires in January, and an extra $40,000 of materials bought early to secure prices.</p>
       <p>By June, sales were 15% behind budget. The Japan deal was delayed. The extra wages and stock had used $70,000 of cash, the overdraft was nearly full, and the year ended with a loss.</p>`),
    W('The hockey stick', function(el,ctx){
      const m=['Q1','Q2','Q3','Q4'], b=[300,310,320,570], a=[296,262,270,330];
      el.innerHTML=`<h4 style="margin-bottom:8px">Sales by quarter, $k: budget vs actual</h4>`+ctx.ui.table(['Quarter','Budget','Actual','Gap'],m.map((q,i)=>[q,'$'+b[i]+'k','$'+a[i]+'k',`<span class="${a[i]<b[i]?'neg':''}">${a[i]-b[i]<0?'($'+(b[i]-a[i])+'k)':'$'+(a[i]-b[i])+'k'}</span>`]),{num:[1,2,3]})+
      ctx.ui.bars(m.flatMap((q,i)=>[{label:q+' budget',v:b[i],tone:'muted'},{label:q+' actual',v:a[i],tone:a[i]<b[i]*0.9?'bad':''}]),{fmt:x=>'$'+x+'k'});
    }),
    SORT('Which budget practices would have prevented this?',['Would help','Wouldn\'t help'],[
      {text:'Include only signed business, plus a probability-weighted share of the pipeline', a:0, why:'An unsigned deal at, say, 40% probability adds 40% of its value, not all of it.'},
      {text:'Keep the stretch target separate from the budget used for hiring and buying', a:0, why:'Ambition is fine as a target. Costs should be committed against realistic numbers.'},
      {text:'Tie hiring and purchasing to triggers, such as "hire when the Japan contract is signed"', a:0, why:'Costs follow evidence, not hope.'},
      {text:'Ask the sales team to work harder', a:1, why:'Effort doesn\'t fix a budget built on an assumption that hadn\'t happened.'},
      {text:'A monthly rolling forecast comparing expected year-end with budget', a:0, why:'By March, it would have shown the gap, with time to delay the hires and purchases.'},
      {text:'Spread the budget evenly over 12 months', a:1, why:'That hides seasonality and makes the comparisons worse.'}
    ]),
    K('Lessons',
      `<p>A budget is a commitment of resources, so it should be built on evidence. Ambition belongs in targets. Big costs should be triggered by events, not dates. And a monthly forecast is what turns the budget from a document you write once into a tool you use all year.</p>`)
  ]},
  {id:'quiz', label:'Quiz', kind:'quiz', title:'Check your understanding', blocks:[
    Q('Which budget must be built first?',['Overheads','Sales','Cash','Capital spending'],1,'Almost everything else depends on how much you expect to sell.'),
    Q('What does a flexed budget do?',['Changes the budget to make it easier','Adjusts the budget to the actual volume, so costs can be compared fairly','Replaces the budget with a forecast','Removes fixed costs'],1,'Variable costs are scaled to actual volume; fixed costs stay.'),
    Q('Profit is $7,600 below budget. Lower volume explains $5,400. What does the remaining $2,200 point to?',['Sales','Spending and efficiency','Tax','Nothing important'],1,'Once volume is allowed for, the rest comes from costs being higher than they should be for that volume.'),
    Q('What\'s the difference between a budget and a forecast?',['There isn\'t one','The budget is the fixed plan for the year; the forecast is updated with the latest expectations','The forecast is only for cash','The budget is for banks'],1,'Keep both. The budget is the yardstick; the forecast shows where you\'re heading.'),
    Q('An unsigned $250,000 deal has a 40% chance of closing. How much should go in the budget?',['$250,000','$100,000, or treat it as an upside scenario','$0 under any circumstances','$150,000'],1,'Probability-weight it, or keep it out of the base case and plan it as an upside with triggers.'),
    Q('Why phase the budget by month?',['It\'s required by law','Sales and costs are seasonal, so monthly comparisons need realistic monthly targets','It makes the budget bigger','To reduce tax'],1,'Equal months would make normal seasonal swings look like problems or successes.')
  ]},
  {id:'apply', label:'Practice', kind:'apply', title:'Practise on a sample pack', blocks:[
    PACK('packB',4,'Pack B, page 4: income statement'),
    Q('Year to date, profit before tax is $3,560 below budget. How much of that is the January currency loss?',['None','$2,020','$3,560','$1,540'],1,'Separating currency from operations shows the operating shortfall is only $1,540.'),
    PACK('packC',4,'Pack C, page 4: income statement'),
    Q('July sales were $16,000 above budget, yet profit before tax was only $630 above. What absorbed the extra contribution?',['Office costs','Higher materials %, overtime and extra freight on the big order','Tax','Depreciation'],1,'A flexed budget would show sales volume helped, while spending and efficiency took it back (Module 15).'),
    Q('Pack D shows year-to-date profit $14,100 ahead of budget. Should the full-year forecast be raised on that basis?',['Yes, immediately','Only after adjusting for the advance payment, the stock build, the missing provision and the suspense items','Yes, by double','No forecast is needed'],1,'Forecasts are only as good as the numbers they start from.'),
    {t:'html',html:'<h3>Later, with your own report</h3><p class="small" style="color:var(--muted)">Optional. When you next read your own monthly report, use this checklist. Nothing here is shared or sent; ticks are saved only in this browser.</p>'},
    CHECK('m15-bud','At my company…',[
      'We have an annual budget, built from sales through to cash',
      'The budget is phased by month, reflecting seasonality',
      'It includes a monthly cash flow and balance sheet, not just a P&L',
      'Monthly reports compare actuals with a flexed budget, or at least explain volume effects',
      'We update a forecast of the full year every month or quarter',
      'We have a downside scenario and agreed triggers for action',
      'Big costs such as hiring and capital spending are tied to evidence, not just to the budget'
    ]),
    REPORT('Your Monday-morning question',
      `<p>Ask: <strong>"Based on what we know today, where will we end the year, and how does that compare with budget?"</strong> If the answer takes a week to prepare, it's time to start a monthly forecast.</p>`),
    K('Takeaways',
      `<ul>
        <li>Build the budget in order: sales, production, materials, labour, overheads, capex, P&amp;L, cash.</li>
        <li>Phase it by month and include cash.</li>
        <li>Compare actuals with a flexed budget to separate volume effects from cost control.</li>
        <li>Keep the budget fixed and update a forecast monthly. Plan the downside before it happens.</li>
        <li>Commit costs on evidence, not hope.</li>
       </ul>`)
  ]}
  ],
  warnings:[
    {sign:'Budget growth concentrated late in the year', meaning:'A "hockey stick" built on hope.', look:'Signed vs unsigned business in the budget.'},
    {sign:'Budget with no cash flow', meaning:'Funding gaps will appear without warning.', look:'Monthly cash budget and peak borrowing need.'},
    {sign:'Costs "under budget" when volume is down', meaning:'May hide overspending once volume is allowed for.', look:'Flexed budget comparison.'},
    {sign:'No updated year-end forecast', meaning:'Problems are found at year-end, too late to fix.', look:'Monthly or quarterly forecast vs budget.'}
  ],
  formulas:[
    {name:'Flexed budget (variable cost)', f:'Budgeted cost per unit (or % of sales) × Actual volume', ex:'Materials at 46% × $90,000 actual revenue = $41,400'},
    {name:'Volume variance (profit)', f:'Flexed budget profit − Original budget profit', ex:'$2,400 − $7,800 = ($5,400)'},
    {name:'Spending and efficiency variance', f:'Actual profit − Flexed budget profit', ex:'$200 − $2,400 = ($2,200)'},
    {name:'Probability-weighted pipeline', f:'Deal value × Probability of winning', ex:'$250,000 × 40% = $100,000'}
  ],
  glossary:[
    {term:'Budget', def:'The plan for the year expressed in numbers, fixed once approved.'},
    {term:'Forecast (latest estimate)', def:'An updated view of how the year will end, revised monthly or quarterly.'},
    {term:'Rolling forecast', def:'A forecast that always looks a fixed period ahead, such as 12 months, updated regularly.'},
    {term:'Flexed budget', def:'The budget adjusted to actual volume, to compare costs fairly.'},
    {term:'Phasing', def:'Splitting an annual budget into months, reflecting seasonality.'},
    {term:'Scenario', def:'An alternative version of the plan, such as a downside or upside case.'},
    {term:'Trigger', def:'A pre-agreed event or threshold that starts a planned action.'},
    {term:'Stretch target', def:'An ambitious goal, kept separate from the realistic budget used to commit costs.'}
  ]
});
})();
