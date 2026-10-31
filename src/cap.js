/* ===== Capstone ===== */
(function(){
const {K,TIP,FLAG,CASE,REPORT,Q,FS,FLIP,SORT,CHECK,W,money,signed,pct,kfmt} = BW.h;

const QUARTERS=[ /* eight decisions, two per quarter */
  {q:'Q1 · January', qn:1, t:'The price review',
   ctx:'Over the last year foam rose 4% and wages 6%. If nothing changes, those increases will take about <strong>$28,000</strong> off this year\'s profit. Sales warn that distributors are price-sensitive.',
   opts:[
     {l:'Hold prices. Don\'t risk the customers.', pbt:0, liq:0, dip:0, rel:0, r:'Costs keep rising and margin keeps slipping. You protected volume but paid for it in profit.', m:'Module 12: a 5% rise could lose 9.4% of volume and still break even.'},
     {l:'Raise prices 5% with 90 days\' notice and a clear explanation of the cost increases.', pbt:30000, liq:22000, dip:0, rel:0, r:'One small distributor leaves; everyone else accepts. Profit up about $30,000 for the nine months it applies.', m:'Module 12: price rises beat volume when margins are thin.', best:true},
     {l:'Raise prices 10% from next week to recover everything at once.', pbt:8000, liq:5000, dip:0, rel:-2, r:'Two distributors move to a competitor and others delay orders. Volume falls about 15%, so most of the gain is lost.', m:'Modules 3 and 12: notice and explanation keep customers; surprises lose them.'}
   ]},
  {q:'Q1 · March', qn:1, t:'The late payer',
   ctx:'US distributor A, your largest customer at 22% of sales, is 45 days overdue on $38,000. They\'ve just sent a new $40,000 order and want it shipped this month.',
   opts:[
     {l:'Ship as normal. They always pay in the end, and they\'re too big to upset.', pbt:-9000, liq:-40000, dip:-15000, rel:0, r:'They pay the old invoice four months late and argue over $9,000 of it, which you write off. Meanwhile $78,000 is tied up in one customer.', m:'Modules 10 and 17: an overdue customer asking for more credit is a warning sign, not a compliment.'},
     {l:'Call their owner. Agree a payment plan for the overdue amount, ship the new order once the first instalment lands, and get a credit insurance quote.', pbt:-1500, liq:15000, dip:0, rel:0, r:'They pay half within two weeks and the rest by May. The new order ships three weeks later than they wanted. Credit insurance costs $1,500 a year and covers 90% of the balance from now on.', m:'Modules 10, 16 and 17: protect the receivable, keep the customer.', best:true},
     {l:'Stop supplying them until everything is paid, and hand the debt to a lawyer.', pbt:-25000, liq:10000, dip:0, rel:-2, r:'You get the $38,000 after a lawyer\'s letter, but they move their business to a competitor. Losing 22% of sales costs far more than the debt was worth.', m:'Modules 13 and 17: credit control is about managing risk, not ending relationships.'}
   ]},
  {q:'Q2 · April', qn:2, t:'The Australian contract',
   ctx:'The hospital group from Module 5 offers $432,000 a year at 10% below list, with 90-day payment terms and six weeks of safety stock. Check your liquidity figure above before you choose.',
   opts:[
     {l:'Sign as offered. It\'s profitable.', pbt:37000, liq:-110000, dip:-30000, rel:1, r:'Profitable, but cash runs out in month four. The bank grants an emergency increase at a higher rate, and an urgent order goes by air. You spend the summer managing cash instead of the business.', m:'Module 5: overtrading. Profit doesn\'t pay wages; cash does.'},
     {l:'Negotiate first: 60-day terms, 20% deposit on the first order, a staged ramp-up, and an invoice finance line agreed before signing.', pbt:38000, liq:-35000, dip:-10000, rel:1, r:'The customer accepts most of it. The ramp-up is smoother, the cash need is a third of the original, and the bank is comfortable lending against a signed contract.', m:'Modules 5, 16 and 17: shape the deal so the cash works.', best:true},
     {l:'Decline. Too risky.', pbt:0, liq:0, dip:0, rel:0, r:'No risk, but no growth. A competitor takes the contract.', m:'Module 5: the problem was the terms, not the customer.'}
   ]},
  {q:'Q2 · June', qn:2, t:'The VAT refunds',
   ctx:'Finance mentions that <strong>$38,000</strong> of VAT on local purchases has never been reclaimed, because the export paperwork is "a lot of work". The oldest quarter reaches its filing deadline in five weeks.',
   opts:[
     {l:'Leave it. It\'s only tax, and the team is busy with the new contract.', pbt:-11000, liq:0, dip:0, rel:0, r:'The oldest quarter\'s deadline passes and $11,000 is lost for good. The rest stays stuck, not working for the business.', m:'Module 19: VAT on exports is meant to come back. Unclaimed refunds are cash left on the table.'},
     {l:'Pay a tax adviser $2,000 to file the two oldest quarters now, and set up a quarterly claim routine.', pbt:-2000, liq:38000, dip:0, rel:0, r:'The refund arrives in September, just when the Australian ramp-up needs it. Every quarter is now claimed on time.', m:'Modules 5 and 19: a refund routine turns tax into a cash source.', best:true},
     {l:'Hold back this quarter\'s other tax payments to make up for it.', pbt:-6000, liq:-6000, dip:0, rel:0, r:'The tax office treats it as late payment and charges penalties and interest. The refunds are still not filed.', m:'Module 19: taxes don\'t net off unless the law allows it. File the claim properly.'}
   ]},
  {q:'Q3 · July', qn:3, t:'The foam offer',
   ctx:'A new foam supplier offers prices 8% below your current one. Separately, your current supplier offers 6% off if you buy six months of foam at once.',
   opts:[
     {l:'Switch to the cheaper supplier straight away.', pbt:-22000, liq:-4000, dip:0, rel:-1, r:'Foam tears and varies in density. Usage, rework and complaints wipe out the price saving and more, exactly as in Module 8.', m:'Module 8: judge suppliers on total cost per good unit, not invoice price.'},
     {l:'Run a one-month trial of the new foam with usage and scrap tracked, and use it to negotiate 3% off for a volume commitment with your current supplier.', pbt:5000, liq:0, dip:0, rel:0, r:'The trial shows the new foam isn\'t good enough. Your current supplier, knowing you looked, agrees 3%.', m:'Modules 8 and 16: test before switching; negotiate openly.', best:true},
     {l:'Take the 6% bulk-buy discount on six months of foam.', pbt:6000, liq:-25000, dip:-20000, rel:0, r:'A real saving on paper, but $50,000 of cash sits in the warehouse for months, right when the Australian contract needs it. Carrying costs eat a good part of the discount.', m:'Modules 7 and 16: stock is cash in a different shape.'}
   ]},
  {q:'Q3 · September', qn:3, t:'The euro order',
   ctx:'The German distributor offers a year-long order worth about <strong>€180,000</strong>, priced in euros. The euro has been weak, and your costs are in dollars and local currency.',
   opts:[
     {l:'Insist on US dollar pricing. Currency risk isn\'t our business.', pbt:0, liq:0, dip:0, rel:-1, r:'They place the order with a European competitor instead. You avoided the risk, but you lost the contract and their goodwill.', m:'Module 17: sometimes managing a risk beats refusing it.'},
     {l:'Accept in euros and hope the rate holds.', pbt:3000, liq:-12000, dip:0, rel:0, r:'The euro falls 7%. Most of the order\'s $14,000 contribution disappears in currency losses.', m:'Module 17: an open currency position is a bet, not a sale.'},
     {l:'Accept in euros, sell 70% of the expected euros forward with your bank, and add a price-review clause if the rate moves more than 5%.', pbt:12000, liq:-12000, dip:0, rel:1, r:'The euro falls 7%, but the forward contract locks in most of the dollar value. The distributor values the euro pricing and adds a second product line.', m:'Module 17: hedge what you can forecast; agree clauses for the rest.', best:true}
   ]},
  {q:'Q4 · October', qn:4, t:'The investment',
   ctx:'Two proposals reach your desk: the $104,000 automated quilting line from Module 14 (realistic NPV negative), and the $60,000 fabric cutter (payback 2.7 years). Cash is tight after the year\'s growth.',
   opts:[
     {l:'Buy the quilting line, paid from the overdraft, to grab the supplier\'s year-end discount.', pbt:-4000, liq:-104000, dip:0, rel:0, r:'Overdraft at its limit, a covenant breach looming, and savings that won\'t arrive. The bank asks for a meeting.', m:'Modules 14 and 17: test assumptions; match long-term assets with long-term funding.'},
     {l:'Buy the fabric cutter, funded with a 4-year equipment loan.', pbt:1000, liq:-6000, dip:0, rel:0, r:'Small deposit, loan covers the rest. Fabric waste halves from February, and the cutter adds about $61,000 of value over its life.', m:'Module 14: strong NPV, funded the right way.', best:true},
     {l:'Buy nothing. Pay down the overdraft.', pbt:1000, liq:0, dip:0, rel:0, r:'Safe, and it saves a little interest. But the fabric waste continues for another year.', m:'Module 14: not investing has a cost too.'}
   ]},
  {q:'Q4 · December', qn:4, t:'The year-end dividend',
   ctx:'The owner wants a <strong>$50,000</strong> dividend in December "because profit is well up". The 13-week forecast shows January payroll and the quarterly tax bill landing in the same fortnight.',
   opts:[
     {l:'Pay the full $50,000 now from the overdraft. Profit is there.', pbt:0, liq:-50000, dip:-15000, rel:0, r:'January payroll is met with $4,000 to spare, and the bank asks why net debt rose at year-end. Profit was there; the cash wasn\'t.', m:'Module 20: dividends come out of cash, not profit.'},
     {l:'Show the owner the 13-week forecast. Pay $20,000 now and the rest in March, once headroom is back above $30,000.', pbt:0, liq:-20000, dip:0, rel:1, r:'The owner appreciates being shown the numbers and agrees. The second payment goes out in March, with no strain on the bank or payroll.', m:'Modules 5 and 20: give the owner the facts and a plan.', best:true},
     {l:'Refuse. Cash is too tight for any dividend this year.', pbt:0, liq:0, dip:0, rel:-1, r:'The owner is frustrated: profit is up and they don\'t see why there\'s nothing for them. A plan would have worked better than a no.', m:'Module 20: the answer is usually "how much, and when", not "no".'}
   ]}
];

BW.add({
  id:'cap', minutes:45,
  title:'Capstone',
  subtitle:'Run BraceWorks for a year, then play detective on a year-end pack. Everything from the 21 modules, in one place.',
  goals:[
    'Make eight real GM decisions, two a quarter, and see their effect on profit and cash together',
    'Find the problems hidden in a year-end management pack',
    'Turn the course into a monthly routine for your own business',
    'Pass a 15-question final assessment and download your completion record'
  ],
  sections:[
  {id:'brief', label:'Briefing', kind:'learn', title:'Your year as GM', blocks:[
    `<p>It's a new year at BraceWorks. You know the business now: the statements, the costs, the reports, the levers. The owner has given you one instruction: <em>"Grow profit, and don't run out of cash."</em></p>
     <p>You'll face eight decisions, two each quarter. Each has a sensible-sounding wrong answer. After each choice you'll see what happened, and which module it connects to. At the end of each quarter you get the quarter's results, like a real board pack, and at year-end the full picture.</p>`,
    {t:'tbl', head:['Starting point','Figure'], opts:{num:[1]}, rows:[
      ['Profit before tax if nothing changes (after cost inflation)','$46,000'],
      ['Liquidity: cash plus unused overdraft','$72,000'],
      ['Customers','25 distributors, the largest at 22% of sales'],
      ['Covenants','Net debt to EBITDA ≤ 2.5×, interest cover ≥ 4×']
    ]},
    K('How to win',
      `<p>There's no single number to maximise. A good year means <strong>more profit, enough cash all year round, and customers and suppliers who still want to work with you</strong>. That's the GM's job in one sentence.</p>`)
  ]},
  {id:'sim', label:'Run the year', kind:'play', title:'Run BraceWorks for a year', blocks:[
    W('The year', function(el, ctx){
      const {money,signed}=ctx.h; const S=ctx.state; if(!Array.isArray(S.sim)||S.simV!==2){ S.sim=[]; S.simV=2; ctx.save(); } const N=QUARTERS.length;
      function draw(){
        const ch=S.sim; let pbt=46000, liq=72000, low=72000, rel=0, best=0, qlow=72000; const qr=[];
        let html='';
        ch.forEach((c,i)=>{ const o=QUARTERS[i].opts[c]; pbt+=o.pbt; low=Math.min(low,liq+o.liq+o.dip); qlow=Math.min(qlow,liq+o.liq+o.dip); liq+=o.liq; rel+=o.rel; if(o.best) best++;
          if(i%2===1){ qr.push({q:QUARTERS[i].qn,pbt,liq,low:qlow}); qlow=liq; }
          html+=`<div class="stat" style="background:var(--paper)"><div class="stat-l">${QUARTERS[i].q} · ${QUARTERS[i].t}</div><div style="font-weight:700;margin:4px 0">${o.l}</div><div class="small">${o.r}</div><div class="small" style="margin-top:6px;color:var(--muted)">Profit ${signed(o.pbt)} · Liquidity ${signed(o.liq)} · ${o.m}</div></div>`;
          if(i%2===1){ const r=qr[qr.length-1]; html+=`<div class="qres"><div class="qres-h">Quarter ${r.q} results</div><div class="qres-g"><div><span>Profit before tax, full-year outlook</span><strong>${money(r.pbt)}</strong></div><div><span>Liquidity at quarter-end</span><strong class="${r.liq<0?'neg':''}">${money(r.liq)}</strong></div><div><span>Lowest point this quarter</span><strong class="${r.low<0?'neg':r.low<15000?'warnc':''}">${money(r.low)}</strong></div></div></div>`; } });
        const chart=qr.length?`<div class="qchart" role="img" aria-label="Liquidity at each quarter-end">${[{q:0,liq:72000}].concat(qr).map(r=>{ const h=Math.max(2,Math.min(100,Math.abs(r.liq)/1500)); return `<div class="qc"><div class="qc-bar ${r.liq<0?'neg':r.liq<30000?'warnb':''}" style="height:${h}px"></div><div class="qc-v">${money(r.liq)}</div><div class="qc-l">${r.q?'Q'+r.q:'Start'}</div></div>`; }).join('')}</div><div class="small" style="color:var(--muted);margin-top:4px">Liquidity (cash plus unused overdraft) at the start and at each quarter-end. Red means the bank had to step in.</div>`:'';
        const score=chart+`<div class="stats" style="margin-top:12px">${ctx.ui.stat('Profit before tax',money(pbt),pbt>=100000?'good':pbt<46000?'bad':'warn','start $46,000')}${ctx.ui.stat('Year-end liquidity',money(liq),liq<0?'bad':liq<30000?'warn':'good','start $72,000')}${ctx.ui.stat('Lowest point in the year',money(low),low<0?'bad':low<15000?'warn':'good')}${ctx.ui.stat('Relationships: customers, suppliers, owner',rel>=2?'Stronger':rel>=0?'Steady':rel>=-1?'Strained':'Damaged',rel<0?'bad':rel>=2?'good':'')}</div>`;
        let body='';
        if(ch.length<N){
          const Qx=QUARTERS[ch.length];
          body=`<div style="display:grid;gap:10px"><div class="eyebrow">${Qx.q} · decision ${ch.length+1} of ${N}</div><h4 style="font-size:19px">${Qx.t}</h4><p style="margin:0">${Qx.ctx}</p><div class="quiz-opts" data-opts></div></div>`;
        } else {
          const verdict= low<0||liq<0 ? ['bad','The bank had to step in. Profit was there, but cash ran out. Every one of those decisions looked sensible on the P&L alone. Replay, and check each one against cash.'] : best===N ? ['good','An excellent year. Profit up sharply, cash safe all year, customers and suppliers on side. This is what reading all three statements together looks like.'] : pbt>=100000&&low>=15000 ? ['good','A strong year. A couple of choices left money on the table. See which, and why.'] : ['warn','A survivable year, but you can do better. Look at which decisions hurt profit or cash, and the module each one points to.'];
          body=`<div class="msg ${verdict[0]}"><strong>Year complete. ${best} of ${N} best choices.</strong> ${verdict[1]}</div><div class="row"><button type="button" class="btn small" data-replay>Run the year again</button></div>`;
        }
        el.innerHTML=score+`<div style="display:grid;gap:10px;margin-top:14px">${html}</div><div style="margin-top:14px">${body}</div>`;
        const oe=el.querySelector('[data-opts]');
        if(oe){ QUARTERS[ch.length].opts.forEach((o,j)=>{ const b=document.createElement('button'); b.type='button'; b.className='opt'; b.innerHTML=`<span class="ol">${'ABC'[j]}</span><span>${o.l}</span>`; b.onclick=()=>{ S.sim.push(j); ctx.save(); draw(); }; oe.appendChild(b); }); }
        const rp=el.querySelector('[data-replay]'); if(rp) rp.onclick=()=>{ S.sim=[]; ctx.save(); draw(); };
        if(ch.length===N){ S.simBest=Math.max(S.simBest||0,best); S.simDone=true; ctx.save(); }
      }
      draw();
    }),
    TIP('Notice the pattern',
      `<p>The tempting wrong answers each looked good on one statement: the contract and the bulk buy on the P&amp;L, the dividend on profit, the quilting line on a supplier's brochure. The right answers checked profit, cash and relationships together. That's the habit this course is built to give you.</p>`)
  ]},
  {id:'detect', label:'Detective round', kind:'play', title:'Find what\'s hidden in the pack', blocks:[
    `<p>Two years later, a sister company with the same products sends you its year-end pack for review. The headline looks good: profit before tax up 24%. Read the extracts, then decide which findings are problems.</p>`,
    FS({title:'Income statement extract', cols:['This year','Last year'], rows:[
      ['Revenue', [1260000,1200000]],
      ['Gross profit', [371000,340000], 'sub'],
      ['Gross margin', ['29.4%','28.3%'], 'muted'],
      ['Freight and export documents', [-63000,-48000]],
      ['Consulting fees (new supplier, $1,500 a month)', [-18000,0]],
      ['Office salaries', [-101800,-96000]],
      ['Depreciation (in overhead)', [-45500,-38000]],
      ['Interest', [-12500,-14000]],
      ['Profit before tax', [92000,74000], 'total']
    ], note:'Gross profit includes an $18,000 year-end volume rebate from the foam supplier.'}),
    FS({title:'Balance sheet and KPI extract', cols:['This year','Last year'], rows:[
      ['Receivables', [310000,230000]],
      ['Finished goods', [105000,75000]],
      ['Other current assets: suspense account', [12400,0]],
      ['Overdraft (limit $150,000)', [148000,120000]],
      ['Cash from operations', [12000,33000]],
      ['EBITDA', [150000,132000]],
      ['OTIF, measured against revised delivery dates', ['94%','87%'], 'muted']
    ]}),
    SORT('Problem, or fine?',['Problem','Looks fine'],[
      {text:'Gross margin up from 28.3% to 29.4%', a:0, why:'Without the $18,000 one-off rebate, gross margin is 28.0%: actually down. One-offs must be shown separately (Modules 3 and 11).'},
      {text:'Receivables up 35% while revenue rose 5%', a:0, why:'Receivable days have gone from 70 to about 90. Look at the aging by customer (Module 10).'},
      {text:'Finished goods up 40% in a year when profit rose', a:0, why:'Overproduction can flatter profit by parking fixed costs in stock (Module 7). Is this stock ordered?'},
      {text:'A $12,400 suspense account balance at year-end', a:0, why:'Unexplained entries. It should be zero (Module 2).'},
      {text:'Freight up 31% on sales up 5%', a:0, why:'Probably more DDP or CIF deals not priced for freight (Modules 3 and 12).'},
      {text:'New "consulting fees" of $1,500 a month to a new supplier', a:0, why:'Round, regular payments for vague services to a new supplier: verify who they are, what they did, and who set them up (Module 18).'},
      {text:'Office salaries up 6%', a:1, why:'In line with the 6% wage increase. Nothing unusual.'},
      {text:'Depreciation up $7,500', a:1, why:'A $60,000 fabric cutter depreciated over 8 years adds $7,500 a year. Expected.'},
      {text:'Interest down $1,500', a:1, why:'Consistent with scheduled loan repayments.'},
      {text:'Overdraft at $148,000 of a $150,000 limit', a:0, why:'Almost no headroom. One late customer and payroll is at risk (Modules 5 and 17).'},
      {text:'Cash from operations $12,000 against EBITDA $150,000', a:0, why:'Cash conversion of 8%. The profit is stuck in receivables and stock (Modules 5 and 16).'},
      {text:'OTIF improved to 94%', a:0, why:'Measured against revised dates, which customers agreed after delays. Against the original promise, it may be far lower (Module 11).'}
    ]),
    K('What a GM would say',
      `<p>"Profit looks up 24%, but underneath, margin is down, cash conversion has collapsed, the overdraft is full, and there are two entries I need explained this week. Before anything else: the receivables aging by customer, the finished goods list by order, the suspense account items, and who the consulting supplier is."</p>
       <p>That's a GM who reads the numbers. Two years ago, that might not have been you.</p>`)
  ]},
  {id:'routine', label:'Your monthly routine', kind:'apply', title:'Turn the course into a habit', blocks:[
    `<p>Knowledge fades. Routines don't. Here's a monthly rhythm that puts everything in this course to work. Tick each habit once it's become routine in your business.</p>`,
    CHECK('cap-routine','Every week',[
      'Read the receivables aging and the list of overdue customers (Module 10)',
      'Update and review the 13-week cash forecast: where is the lowest point? (Modules 5, 10)',
      'Check orders received and the backlog (Module 10)',
      'Review the payment run, and any supplier bank detail changes (Module 18)'
    ]),
    CHECK('cap-routine2','Every month',[
      'Pack arrives by working day 8, with the one-page dashboard first (Modules 9, 11)',
      'Read all three statements, with % of revenue and comparisons (Modules 1, 3, 4, 5)',
      'Review margin by product and the variance report: price, usage, scrap (Modules 6, 8)',
      'Check receivable, inventory and payable days against targets (Module 16)',
      'Sign the bank reconciliation; review headcount and overtime (Modules 2, 18)',
      'Update the full-year forecast and the covenant forecast (Modules 15, 17)'
    ]),
    CHECK('cap-routine3','Every year',[
      'Update standard costs, then review prices (Modules 6, 12)',
      'Build the budget from sales to cash, with a downside scenario (Module 15)',
      'Review customer profitability and credit limits (Modules 10, 17)',
      'Review last year\'s investments against what they promised (Module 14)',
      'Act on the auditors\' management letter (Module 18)',
      'Grade your monthly pack with the scorecard, as you practised on the sample packs (Module 9)'
    ]),
    {t:'widget', title:'Grade all four practice packs', render(el,ctx){
      const sc=ctx.state.sc2||{}; const done=['A','B','C','D'].filter(x=>sc[x]&&Object.keys(sc[x]).length>=20);
      el.innerHTML=`<p class="w-hint">You\'ve fully graded ${done.length} of 4 practice packs${done.length?': '+done.join(', '):''}. Grading all four, then comparing with the expert scores, is the best practice for reading your own reports.</p>`;
      const b=document.createElement('button'); b.type='button'; b.className='btn small'; b.textContent='Open the scorecard'; b.onclick=()=>BW.go('m9',2,{jump:true}); el.appendChild(b);
    }}
  ]},
  {id:'grad', label:'Graduation', kind:'apply', title:'What you can do now', blocks:[
    {t:'widget', title:'Your course record', render(el,ctx){
      const S=ctx.state; const ids=BW.ORDER.filter(id=>id!=='cap'&&!BW.isOptional(id));  /* every core module */
      let n=0,r=0,secs=0,done=0;
      ids.forEach(id=>{ const m=BW.mods[id]; if(!m) return; m.sections.forEach(sec=>{ secs++; if(S.visited[id+'.'+sec.id]) done++; const ki=BW.keyIdx(sec); sec.blocks.forEach((b,i)=>{ if(b&&b.t==='quiz'){ n++; if(S.quiz[`${id}.${sec.id}.${ki[i]}`]===b.a) r++; } }); }); });
      const pctQ=n?r/n:0;
      el.innerHTML=`<div class="stats">${ctx.ui.stat('Sections opened',`${done} / ${secs}`,done===secs?'good':'')}${ctx.ui.stat('Quiz answers correct',`${r} / ${n}`,pctQ>=0.8?'good':pctQ>=0.6?'warn':'')}${ctx.ui.stat('Final assessment',S.final&&S.final.best?`${S.final.best} / 15`:'Not taken',S.final&&S.final.best>=12?'good':'')}${ctx.ui.stat('Year-long simulation',S.simDone?`${S.simBest||0} / 8 best`:'Not played',S.simBest>=6?'good':'')}${ctx.ui.stat('Practice packs graded',`${['A','B','C','D'].filter(x=>S.sc2&&S.sc2[x]&&Object.keys(S.sc2[x]).length>=20).length} / 4`)}</div>
        <p class="w-hint" style="margin-top:10px">${r>=n*0.8&&n?'You know this material well. The next step is using it every month.':'Revisit the modules where quiz answers went wrong. Each question has a "Try again" link.'}</p>`;
    }},
    K('You can now…',
      `<ul>
        <li>Read the income statement, balance sheet and cash flow together, and explain why profit and cash differ.</li>
        <li>Follow a transaction from invoice to report, and check that the month-end close is done properly.</li>
        <li>Know what each product really costs, and spot when quotes, scrap or stock are leaking margin.</li>
        <li>Ask for, and grade, a monthly pack that helps you run the business.</li>
        <li>Use contribution, break-even and relevant costs to make pricing, product and sourcing decisions.</li>
        <li>Judge investments with payback and NPV, and challenge optimistic proposals.</li>
        <li>Manage working capital, currency risk and payment risk in export markets.</li>
        <li>Protect the business with practical controls, and talk to banks and owners with confidence.</li>
       </ul>`),
    REPORT('One last Monday-morning question',
      `<p>Ask yourself: <strong>"Which three things from this course would make the biggest difference in my business in the next 90 days?"</strong> For most GMs, the answer is a 13-week cash forecast, a better monthly pack, and a price review. Start there.</p>`),
    TIP('Keep the Toolkit handy',
      `<p>The Toolkit tab has every warning sign, formula and glossary term from the course in one place. Keep it open next to your monthly pack.</p>`)
  ]}
  ],
  warnings:[],
  formulas:[],
  glossary:[]
});
})();
