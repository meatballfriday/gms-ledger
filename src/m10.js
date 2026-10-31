/* ===== Module 10: Reports beyond the statements ===== */
(function(){
const {K,TIP,FLAG,CASE,REPORT,Q,FS,FLIP,SORT,CHECK,W,PACK,money,signed,pct,kfmt} = BW.h;

BW.add({
  id:'m10', minutes:50,
  title:'Reports beyond the statements',
  subtitle:'The three statements tell you what happened. These reports tell you why, and what\'s about to happen.',
  goals:[
    'Read a receivables aging and decide which customers to act on',
    'Use customer and product profitability to see who really makes you money',
    'Track orders, backlog and book-to-bill as early warnings',
    'Build and use a 13-week cash forecast'
  ],
  sections:[
  {id:'map', label:'The report map', kind:'learn', title:'The reports that run a factory', blocks:[
    `<p>The financial statements are summaries. When a number in them moves, you need the detail underneath to find out why. And because they look backwards, you need some reports that look forward. Here's the set that matters for BraceWorks.</p>`,
    {t:'tbl', head:['Report','Question it answers','How often'], rows:[
      ['<strong>Receivables aging</strong>','Who owes us money, and how late is it?','Weekly'],
      ['<strong>Payables aging</strong>','Who do we owe, and when is it due?','Weekly'],
      ['<strong>Inventory aging</strong>','What stock isn\'t moving? (Module 7)','Monthly'],
      ['<strong>Margin by customer and product</strong>','Who and what actually makes us money?','Monthly or quarterly'],
      ['<strong>Orders and backlog</strong>','Is demand growing or shrinking, before it shows in sales?','Weekly'],
      ['<strong>Production KPIs</strong>','Output, efficiency, scrap and yield, on-time delivery','Daily to weekly'],
      ['<strong>13-week cash forecast</strong>','Will we have enough cash, week by week, for the next quarter?','Weekly'],
      ['<strong>Budget vs actual</strong>','Are we on plan? (Module 15)','Monthly']
    ]},
    K('Lagging and leading',
      `<p>The P&amp;L is a <strong>lagging</strong> report: it tells you what already happened. Orders received, quotes outstanding, overdue receivables and the cash forecast are <strong>leading</strong>: they tell you what's coming. A good GM spends at least as much time on the leading reports.</p>`)
  ]},
  {id:'aging', label:'Receivables aging', kind:'play', title:'Who owes BraceWorks money?', blocks:[
    `<p>BraceWorks is owed $230,000. The <span class="term">receivables aging</span> splits it by customer and by how far past the due date each invoice is. Tap a customer to see what you'd do.</p>`,
    W('Receivables aging at year-end', function(el, ctx){
      const {money}=ctx.h; const k=x=>x?money(x*1000):'–';
      const R=[
        ['US distributor A',40,10,0,0,0,'Your largest customer, 22% of sales. Mostly current. The $10k slightly overdue is a timing lag. Keep a friendly weekly check-in.','good'],
        ['Australian hospital supplier',22,5,0,0,0,'Healthy. Pays a little late at month-end. No action beyond the normal reminder.','good'],
        ['German distributor',20,0,6,0,0,'One invoice of $6k is 45 days late. Probably a dispute. Ask sales: was there a quality or delivery issue?','warn'],
        ['Swedish distributor',24,0,0,0,0,'Perfect payer. Consider offering them better terms or priority. They\'re worth keeping happy.','good'],
        ['US distributor B',10,5,8,0,0,'Getting worse: six months ago they paid on time. Now $13k is overdue. Call the owner, ask what\'s changed, and hold the next shipment until the oldest invoice is paid.','bad'],
        ['UAE distributor',0,0,0,0,28,'$28k over 180 days late and not answering. Stop all shipments, issue a formal demand, consider a collection agency or credit insurance claim, and provide for it in the accounts (Module 4).','bad'],
        ['UK distributor',12,0,0,8,0,'$8k 75 days late, rest current. Often a lost invoice or missing paperwork. Ask finance to call their accounts payable team this week.','warn'],
        ['19 other customers',32,0,0,0,0,'All current. Small accounts, well managed.','good']
      ];
      const cols=['Current','1–30','31–60','61–90','90+'];
      const tot=cols.map((c,i)=>R.reduce((s,r)=>s+r[i+1],0));
      el.innerHTML=`<div class="tbl"><table class="grid"><thead><tr><th>Customer</th>${cols.map(c=>`<th class="v">${c}</th>`).join('')}<th class="v">Total</th></tr></thead><tbody></tbody><tfoot></tfoot></table></div><div data-note class="msg info">Tap a customer name.</div>`;
      const tb=el.querySelector('tbody');
      R.forEach(r=>{ const tr=document.createElement('tr'); const t=r.slice(1,6).reduce((a,b)=>a+b,0);
        tr.innerHTML=`<td><button type="button" class="linkbtn" style="text-align:left;font-size:14px">${r[0]}</button></td>${r.slice(1,6).map((x,i)=>`<td class="v ${x&&i>=2?'neg':''}">${k(x)}</td>`).join('')}<td class="v"><strong>${k(t)}</strong></td>`;
        tr.querySelector('button').onclick=()=>{ tb.querySelectorAll('tr').forEach(x=>x.style.background=''); tr.style.background='var(--accent-soft)'; const n=el.querySelector('[data-note]'); n.className='msg '+r[7]; n.innerHTML=`<strong>${r[0]}:</strong> ${r[6]}`; };
        tb.appendChild(tr); });
      el.querySelector('tfoot').innerHTML=`<tr><td><strong>Total</strong></td>${tot.map(x=>`<td class="v"><strong>${k(x)}</strong></td>`).join('')}<td class="v"><strong>${k(tot.reduce((a,b)=>a+b,0))}</strong></td></tr><tr><td class="small">% of total</td>${tot.map(x=>`<td class="v small">${(x/230*100).toFixed(0)}%</td>`).join('')}<td class="v small">100%</td></tr>`;
    }),
    K('How to read an aging',
      `<ul>
        <li><strong>Look at the shape.</strong> 70% is current, which is reasonable. But $50k (22%) is more than 30 days late.</li>
        <li><strong>Look at the trend by customer.</strong> A customer drifting from current into 31–60 and then 61–90 over a few months is more worrying than a big old invoice you understand.</li>
        <li><strong>Over 90 days is a problem, not a timing issue.</strong> Every month past 90 days, the chance of collecting falls sharply.</li>
        <li><strong>Calculate days sales outstanding:</strong> receivables ÷ sales × 365 = $230,000 ÷ $1,200,000 × 365 = <strong>70 days</strong>.</li>
       </ul>`),
    TIP('Credit control basics',
      `<p>Every customer should have a <strong>credit limit</strong> and agreed payment terms. Reminders go out before the due date, a call at 7 days late, and a shipment hold at 30 to 45 days late. For export customers you don't know well, use letters of credit or credit insurance (Module 17).</p>`)
  ]},
  {id:'margin', label:'Who makes you money?', kind:'play', title:'Customer profitability', blocks:[
    `<p>Gross margin by product is a start. But two customers buying the same products can be very different to serve. One orders full containers on FOB terms and pays on time. Another orders small, custom-labelled lots delivered to its door, and pays late. <span class="term">Cost to serve</span> captures the difference.</p>`,
    W('BraceWorks\' top customers, ranked', function(el, ctx){
      const {money,pct}=ctx.h;
      const C=[
        {n:'US distributor A',rev:264000,gm:0.26,frt:0,cts:4000,bad:0,note:'Big FOB orders, standard products'},
        {n:'Australian hospital supplier',rev:150000,gm:0.29,frt:9000,cts:3000,bad:0,note:'CIF terms, regular orders'},
        {n:'Swedish distributor',rev:96000,gm:0.31,frt:2000,cts:2000,bad:0,note:'FCA, pays early'},
        {n:'German distributor',rev:110000,gm:0.31,frt:12000,cts:6000,bad:0,note:'DDP, many small orders'},
        {n:'UK distributor',rev:70000,gm:0.28,frt:4000,cts:5000,bad:0,note:'Custom labels on every order'},
        {n:'UAE distributor',rev:60000,gm:0.30,frt:3000,cts:2000,bad:21000,note:'Bad debt provision'}
      ].map(c=>Object.assign(c,{gp:c.rev*c.gm,contrib:c.rev*c.gm-c.frt-c.cts-c.bad}));
      let mode='rev'; const segEl=document.createElement('div'), out=document.createElement('div'); el.append(segEl,out);
      function draw(){
        const list=[...C].sort((a,b)=> mode==='rev'?b.rev-a.rev: mode==='gp'?b.gm-a.gm : b.contrib/b.rev-a.contrib/a.rev);
        const val=c=> mode==='rev'?c.rev: mode==='gp'?c.gp : c.contrib;
        out.innerHTML=ctx.ui.bars(list.map(c=>({label:c.n,v:val(c),tone:val(c)<0?'bad':mode==='contrib'&&c.contrib/c.rev<0.18?'warn':mode==='contrib'?'good':''})),{max:Math.max(...C.map(val))})+
          ctx.ui.table(['Customer','Revenue','Gross margin','Freight','Cost to serve','Bad debt','Contribution','%'],list.map(c=>[`${c.n}<div class="small" style="color:var(--muted)">${c.note}</div>`,money(c.rev),money(c.gp),c.frt?money(-c.frt):'–',money(-c.cts),c.bad?money(-c.bad):'–',`<strong class="${c.contrib<0?'neg':''}">${money(c.contrib)}</strong>`,pct(c.contrib/c.rev)]),{num:[1,2,3,4,5,6,7]})+
          `<p class="w-hint">${mode==='rev'?'Ranked by revenue, the UAE distributor looks like a mid-sized account. Now switch to contribution.':mode==='gp'?'By gross margin %, the German distributor looks like your best customer. But margin % ignores what it costs to deliver and to collect.':'After freight, cost to serve and bad debt, the German distributor drops from best margin to below average, and the UAE distributor is losing money. US distributor A, with the lowest gross margin, is your most valuable customer in dollars.'}</p>`;
      }
      ctx.ui.seg(segEl,[{v:'rev',label:'Rank by revenue'},{v:'gp',label:'Rank by gross margin %'},{v:'contrib',label:'Rank by contribution %'}],'rev',v=>{mode=v;draw();});
      draw();
    }),
    K('Turning this into action',
      `<ul>
        <li><strong>Price for cost to serve:</strong> small-order surcharges, freight charged at cost, labelling fees.</li>
        <li><strong>Change terms, not just prices:</strong> move the German distributor from DDP to FCA or CIF, and set a minimum order.</li>
        <li><strong>Protect your best accounts:</strong> US distributor A buys 22% of everything. Keep them happy, and also reduce the risk of depending on them (Module 11).</li>
       </ul>`)
  ]},
  {id:'ops', label:'Orders and operations', kind:'learn', title:'Orders, backlog and the factory floor', blocks:[
    `<h3>Orders tell you the future</h3>
     <p>Sales this month mostly come from orders taken one to three months ago. So orders received are your best early warning of a slowdown or a surge.</p>`,
    {t:'tbl', head:['Measure','Formula','BraceWorks, last quarter','Meaning'], opts:{num:[2]}, rows:[
      ['<strong>Book-to-bill ratio</strong>','Orders received ÷ Sales shipped','0.92','Below 1.0: orders are coming in slower than you ship. The backlog is shrinking.'],
      ['<strong>Order backlog</strong>','Orders received but not yet shipped','$180,000','About 1.8 months of sales, down from 2.3 months a quarter ago.'],
      ['<strong>Quote win rate</strong>','Quotes won ÷ Quotes issued','31%','Falling win rates can mean prices are out of line, or slow quoting.']
    ]},
    `<p>A book-to-bill of 0.92 for a quarter means sales will fall in two or three months unless orders pick up. You'd see it in the P&amp;L only after it had happened.</p>
     <h3>Factory KPIs that explain the money</h3>`,
    {t:'tbl', head:['KPI','What it measures','BraceWorks','Links to'], opts:{num:[2]}, rows:[
      ['<strong>On time in full (OTIF)</strong>','Orders shipped complete by the promised date','87%','Customer retention, freight (rushed air freight)'],
      ['<strong>First-pass yield</strong>','Units passing QA first time without rework','95.9%','Rework cost, labour efficiency'],
      ['<strong>Scrap rate</strong>','Material scrapped ÷ material issued','4.1%','Materials usage variance'],
      ['<strong>Labour efficiency</strong>','Standard hours earned ÷ Hours worked','93%','Labour efficiency variance, unit cost'],
      ['<strong>Output per labour hour</strong>','Revenue at standard ÷ Direct hours','$23.70','Capacity and pricing decisions']
    ]},
    TIP('One number per desk',
      `<p>Each of these KPIs should have an owner who can change it. OTIF belongs to planning and production; scrap to the production supervisor; book-to-bill to sales. When the number moves, you know who to ask.</p>`)
  ]},
  {id:'cash13', label:'13-week cash forecast', kind:'play', title:'The 13-week cash forecast', blocks:[
    `<p>This is the single most useful report for a small manufacturer. It lists expected receipts and payments <strong>week by week</strong> for the next quarter, so you can see a cash squeeze weeks before it arrives. It's built from the receivables aging, the payables aging, the payroll calendar, loan schedules and planned purchases.</p>`,
    W('BraceWorks\' next 13 weeks', function(el, ctx){
      const {money}=ctx.h;
      const BASE_REC=[16,18,44,15,17,20,40,16,18,19,42,16,18];
      const LUMP={2:25,6:25,10:25}; // US distributor A monthly payment (weeks 3, 7, 11)
      const OPEN=42, LIMIT=30, BUFFER=15;
      const opts={late:false,foam:false,slow:false,machine:false};
      el.innerHTML=`<p class="w-hint">Turn on what-ifs and watch the lowest point. Liquidity = cash + the $30k unused overdraft line. Red bars, below $15k, are too close for comfort.</p><div data-t class="seg"></div><div data-out></div>`;
      const T=[['late','US distributor A pays 3 weeks late'],['foam','Bulk foam purchase of $30k in week 5'],['slow','Sales 10% below plan (receipts drop from week 6)'],['machine','$15k deposit on a new machine in week 6']];
      const tEl=el.querySelector('[data-t]');
      T.forEach(([k,l])=>{ const b=document.createElement('button'); b.type='button'; b.textContent=l; b.setAttribute('aria-pressed','false'); b.onclick=()=>{ opts[k]=!opts[k]; b.setAttribute('aria-pressed',String(opts[k])); draw(); }; tEl.appendChild(b); });
      const out=el.querySelector('[data-out]');
      function draw(){
        const rec=BASE_REC.slice();
        if(opts.late){ Object.keys(LUMP).forEach(w=>{ w=+w; rec[w]-=LUMP[w]; if(w+3<13) rec[w+3]+=LUMP[w]; }); }
        if(opts.slow){ for(let i=5;i<13;i++) rec[i]=rec[i]*0.9; }
        const pay=[];
        for(let i=0;i<13;i++){ let p=15; if(i%2===1) p+=12; if(i%4===0) p+=9; if(i===3||i===7||i===11) p+=6; if(i===9) p+=5; if(opts.foam&&i===4) p+=30; if(opts.machine&&i===5) p+=15; pay.push(p); }
        let bal=OPEN; const rows=[], liq=[];
        for(let i=0;i<13;i++){ bal=bal+rec[i]-pay[i]; liq.push(bal+LIMIT); rows.push([`Wk ${i+1}`,money(Math.round(rec[i]*1000)),money(-pay[i]*1000),`<strong class="${bal<0?'neg':''}">${money(Math.round(bal*1000))}</strong>`,`<span class="${bal+LIMIT<BUFFER?'neg':''}">${money(Math.round((bal+LIMIT)*1000))}</span>`]); }
        const min=Math.min(...liq), wk=liq.indexOf(min)+1;
        const maxL=Math.max(...liq,OPEN+LIMIT);
        const chart='<div data-chart></div>';
        out.innerHTML=`<div class="stats" style="margin:12px 0">${ctx.ui.stat('Lowest liquidity',money(Math.round(min*1000)),min<0?'bad':min<BUFFER?'warn':'good',`in week ${wk}`)}${ctx.ui.stat('Cash at week 13',money(Math.round(bal*1000)))}</div>
          <h4 style="margin:4px 0 8px">Liquidity each week (cash + unused overdraft)</h4>${chart}
          <div class="msg ${min<0?'bad':min<BUFFER?'warn':'good'}" style="margin-top:12px">${min<0?`In week ${wk} BraceWorks would run out of cash and overdraft. Payroll is at risk. Act now: chase collections, delay the purchase, or ask the bank for a temporary increase while you still have time.`:min<BUFFER?`Tight in week ${wk}. Not a crisis, but one more surprise would be. Decide now which payment you'd delay, or what you'd collect early.`:'Comfortable throughout. Now try combining two what-ifs. Problems rarely arrive alone.'}</div>
          <details style="margin-top:12px"><summary style="cursor:pointer">Show the weekly table</summary>${ctx.ui.table(['Week','Receipts','Payments','Closing cash','Liquidity'],rows,{num:[1,2,3,4]})}</details>`;
        BW.viz.mount(out.querySelector('[data-chart]'),BW.viz.line({label:'Liquidity each week for the next 13 weeks.',x:liq.map((v,i)=>'W'+(i+1)),fmt:kfmt,tfmt:x=>money(Math.round(x)),dots:true,zero:true,endLabels:false,table:false,
          series:[{name:'Liquidity',v:liq.map(v=>Math.round(v*1000)),c:min<0?'s2':'s1'}],refs:[{v:BUFFER*1000,label:'Comfort level $15k',cls:'bad'}],band:min<0?{lo:Math.min(-15000,Math.round(min*1000)-5000),hi:0,label:'Out of cash'}:null,
          marks:[{i:wk-1,label:money(Math.round(min*1000)),dy:18}]}));
      }
      draw();
    }),
    K('How to run it',
      `<ul>
        <li><strong>Update weekly,</strong> rolling forward one week each time.</li>
        <li><strong>Receipts</strong> come from the receivables aging, adjusted for how each customer actually pays, not the due date.</li>
        <li><strong>Payments</strong> come from payables, payroll dates, rent, loan schedules, tax dates and planned purchases.</li>
        <li><strong>Compare last week's forecast with what happened.</strong> The forecast gets better as you learn which customers pay late.</li>
        <li><strong>Watch the lowest point,</strong> and decide in advance what you'd do if it gets close to zero.</li>
       </ul>`)
  ]},
  {id:'case', label:'Case: the fading customer', kind:'case', title:'The customer that faded away', blocks:[
    CASE('US distributor B',
      `<p>US distributor B had been a steady customer for five years. In March, it went into bankruptcy, owing BraceWorks <strong>$23,000</strong>. There was also <strong>$14,000 of custom-labelled stock</strong> in the warehouse, made for it and now unsellable without relabelling.</p>
       <p>Looking back through the reports, the signs were there for eight months:</p>`),
    {t:'tbl', head:['Month','Average days to pay','Orders','What happened'], opts:{num:[1]}, rows:[
      ['July','32','$14,000','Normal'],['August','38','$12,000','Paid two invoices together'],['September','47','$11,000','Asked for 60-day terms instead of 30'],
      ['October','55','$9,000','Paid a round $5,000 "on account" instead of specific invoices'],['November','63','$12,000','Over its credit limit; shipment approved by sales anyway'],
      ['December','71','$6,000','New accounts payable contact; slow to answer'],['January','82','$4,000','Payment promised "next week" three times'],['February','–','$0','Stopped answering']
    ]},
    SORT('Which of these were warning signs?',['Warning sign','Normal'],[
      {text:'Average days to pay rising month after month', a:0, why:'A steady drift in payment days is the clearest early signal of cash trouble at a customer.'},
      {text:'Asking to extend payment terms', a:0, why:'Customers ask for longer terms when they\'re short of cash.'},
      {text:'Round-sum payments "on account" instead of paying specific invoices', a:0, why:'They\'re paying what they can afford, not what they owe.'},
      {text:'Orders shrinking at the same time', a:0, why:'Their own sales were falling.'},
      {text:'A customer paying exactly on the due date', a:1, why:'That\'s what you want.'},
      {text:'Shipping over the credit limit because "they\'re a good customer"', a:0, why:'Credit limits exist for exactly this. Overriding them should need the GM\'s approval.'}
    ]),
    K('What accounting could have done',
      `<p>Each signal was in a report: the aging, the payment history, the credit limit check. What was missing was someone looking at them <strong>by customer and over time</strong>, and a rule that turned the signal into action. With a credit hold at 45 days late, BraceWorks would have lost perhaps $6,000 instead of $37,000. And a deposit on custom-labelled orders would have covered most of the stock.</p>`)
  ]},
  {id:'quiz', label:'Quiz', kind:'quiz', title:'Check your understanding', blocks:[
    Q('Receivables are $230,000 and annual sales $1,200,000. What are days sales outstanding?',['19 days','52 days','70 days','100 days'],2,'$230,000 ÷ $1,200,000 × 365 = 70 days.'),
    Q('Which customer is most worrying?',['$40k all current','$28k, all over 180 days, not answering','$24k, always pays early','$12k current and $8k 75 days late after a lost invoice'],1,'Very old debt from an unresponsive customer is the most likely to be lost.'),
    Q('Book-to-bill has been 0.92 for a quarter. What does it suggest?',['Sales will likely fall in coming months','Profit is rising','Inventory is too low','Customers are paying faster'],0,'Orders are arriving slower than you\'re shipping, so the backlog and future sales shrink.'),
    Q('Why might a customer with the highest gross margin % be one of the least profitable?',['Gross margin is calculated wrongly','High freight, small orders, custom work or slow payment can eat the margin','High margin customers always pay late','It\'s not possible'],1,'Cost to serve sits below gross margin. Contribution after those costs tells the real story.'),
    Q('How often should a 13-week cash forecast be updated?',['Yearly','Quarterly','Weekly','Only in a crisis'],2,'Weekly, rolling forward. Its value is in seeing problems weeks ahead.'),
    Q('A customer starts paying round sums "on account" instead of specific invoices. What does it usually mean?',['They\'ve changed accounting systems','They\'re paying what they can afford, a sign of cash trouble','They\'re overpaying','Nothing'],1,'Treat it as an early warning: review their credit limit and terms.')
  ]},
  {id:'apply', label:'Practice', kind:'apply', title:'Practise on a sample pack', blocks:[
    PACK('packC',5,'Pack C, page 5: receivables aging'),
    Q('Which customer needs action this week?',['US distributor A ($88k, all current)','US distributor B ($45k, of which $39k is overdue and $10k is over 90 days)','Swedish distributor','Other customers'],1,'A five-year customer drifting through every aging bucket: hold shipments and call their owner (Module 10).'),
    Q('July was a record sales month, but book-to-bill was 0.88. What does that mean?',['Orders are strong','The record month was shipped from the existing backlog; orders coming in are lower, so sales will fall back','Customers are paying faster','Nothing'],1,'Backlog fell to 1.4 months. Without new orders, August and September will be weaker.'),
    Q('What share of Pack C\'s receivables is US distributor A, on 90-day terms?',['About 10%','About 29%','About 50%','About 75%'],1,'$88,000 ÷ $302,000 ≈ 29%. That one set of terms explains most of the rise in DSO.'),
    {t:'html',html:'<h3>Later, with your own report</h3><p class="small" style="color:var(--muted)">Optional. When you next read your own monthly report, use this checklist. Nothing here is shared or sent; ticks are saved only in this browser.</p>'},
    CHECK('m10-ops','I receive, and actually read…',[
      'A receivables aging by customer, every week',
      'A list of customers over their credit limit or more than 30 days late, with actions',
      'Margin by customer, including freight and cost to serve, at least quarterly',
      'Orders received, backlog and book-to-bill, weekly',
      'A 13-week cash forecast, updated weekly, with the lowest point highlighted',
      'Last week\'s cash forecast compared with what actually happened',
      'OTIF, scrap rate, first-pass yield and labour efficiency, weekly'
    ]),
    REPORT('Your Monday-morning request',
      `<p>Ask finance for a <strong>13-week cash forecast by Friday</strong>, even a rough one in a spreadsheet. The first version will be imperfect. That's fine. Updating it every week is what makes it accurate, and what makes you the GM who's never surprised by cash.</p>`),
    K('Takeaways',
      `<ul>
        <li>The statements are summaries. Aging, margin and operational reports explain them.</li>
        <li>Read receivables by customer and over time. Drifting payment days are an early warning.</li>
        <li>Customer profitability after cost to serve can reverse what gross margin suggests.</li>
        <li>Orders and backlog predict sales. Book-to-bill below 1.0 is a warning.</li>
        <li>The 13-week cash forecast is your fuel gauge. Update it weekly.</li>
       </ul>`)
  ]}
  ],
  warnings:[
    {sign:'A customer\'s days-to-pay rising month after month', meaning:'The customer may be in cash trouble.', look:'Payment history by customer; credit limit; order trend.'},
    {sign:'Shipments approved over credit limits', meaning:'Credit control is being overridden by sales pressure.', look:'Credit hold exceptions report; who approved.'},
    {sign:'Book-to-bill below 1.0 for a quarter', meaning:'Sales will fall in coming months.', look:'Orders by customer and market; quote win rate.'},
    {sign:'A high-margin customer with low contribution', meaning:'Freight, small orders, custom work or slow payment are eating the margin.', look:'Cost to serve by customer.'},
    {sign:'No forward cash forecast', meaning:'Cash problems will arrive without warning.', look:'Start a 13-week forecast and update it weekly.'}
  ],
  formulas:[
    {name:'Days sales outstanding (DSO)', f:'Receivables ÷ Sales × 365', ex:'$230,000 ÷ $1,200,000 × 365 = 70 days'},
    {name:'Book-to-bill ratio', f:'Orders received ÷ Sales shipped (same period)', ex:'$276,000 ÷ $300,000 = 0.92'},
    {name:'Customer contribution', f:'Gross profit − Freight − Cost to serve − Bad debt', ex:'German distributor: $34,100 − $12,000 − $6,000 = $16,100'},
    {name:'Labour efficiency', f:'Standard hours earned ÷ Actual hours worked', ex:'47,100 ÷ 50,650 = 93%'}
  ],
  glossary:[
    {term:'Receivables aging', def:'Report showing amounts owed by each customer, grouped by how far past due.'},
    {term:'Days sales outstanding (DSO)', def:'Average number of days customers take to pay.'},
    {term:'Credit limit', def:'The maximum a customer may owe at any time before shipments are held.'},
    {term:'Cost to serve', def:'Costs of supplying a customer beyond the product itself: freight, small orders, custom work, admin, collection.'},
    {term:'Book-to-bill ratio', def:'Orders received divided by sales shipped. Above 1.0, the backlog is growing.'},
    {term:'Order backlog', def:'Orders received but not yet shipped. Also called the order book.'},
    {term:'OTIF', def:'On time in full: share of orders delivered complete by the promised date.'},
    {term:'First-pass yield', def:'Share of units that pass quality checks first time without rework.'},
    {term:'13-week cash forecast', def:'Week-by-week projection of receipts, payments and cash for the next quarter.'},
    {term:'Leading indicator', def:'A measure that changes before results do, such as orders received.'},
    {term:'Lagging indicator', def:'A measure that reports results after the fact, such as profit.'}
  ]
});
})();
