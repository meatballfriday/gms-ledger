/* ===== Module 14: Investing in equipment ===== */
(function(){
const {K,TIP,FLAG,CASE,REPORT,Q,FS,FLIP,SORT,CHECK,W,PACK,money,signed,pct,kfmt} = BW.h;

function npv(rate,flows){ return flows.reduce((s,c,t)=>s+c/Math.pow(1+rate,t),0); }
function irr(flows){ let lo=-0.99, hi=5; const f=r=>npv(r,flows); if(f(lo)*f(hi)>0) return NaN; for(let i=0;i<200;i++){ const mid=(lo+hi)/2; if(f(lo)*f(mid)<=0) hi=mid; else lo=mid; } return (lo+hi)/2; }
function payback(flows){ let cum=0; for(let t=0;t<flows.length;t++){ const prev=cum; cum+=flows[t]; if(t>0&&cum>=0&&prev<0) return t-1+(-prev)/flows[t]; } return Infinity; }

BW.add({
  id:'m14', minutes:45,
  title:'Investing in equipment',
  subtitle:'Should BraceWorks spend $60,000 on an automatic fabric cutter? Payback, NPV and IRR, in plain words, and how to spot an optimistic proposal.',
  goals:[
    'Build the cash flows of an investment, including the costs people forget',
    'Explain why a dollar next year is worth less than a dollar today',
    'Calculate and interpret payback, NPV and IRR',
    'Challenge the assumptions in an investment proposal'
  ],
  sections:[
  {id:'cash', label:'Think in cash', kind:'learn', title:'An investment is a stream of cash', blocks:[
    `<p>The production manager wants an <strong>automatic fabric cutting table</strong>. Today, two people cut cover fabric by hand with patterns and electric knives. The machine nests patterns by software, cuts faster and wastes less fabric.</p>
     <p>For an investment decision, forget profit and depreciation for a moment. Think about <strong>cash out</strong> and <strong>cash in</strong>, year by year, compared with not buying.</p>`,
    FS({title:'The fabric cutter: cash flows', rows:[
      'Year 0 (now)',
      ['Machine and software', -52000, 'ind'],
      ['Installation and electrical work', -3000, 'ind'],
      ['Validation (IQ/OQ/PQ) and operator training', -5000, 'ind'],
      ['Total investment', -60000, 'sub'],
      'Each year, years 1 to 8',
      ['Fabric saved: waste falls from 12% to 6%', 10800, 'ind'],
      ['Labour: two cutters not replaced when they leave this year', 8000, 'ind'],
      ['Contribution from extra capacity at cutting', 6000, 'ind'],
      ['Maintenance and software licence', -2500, 'ind'],
      ['Net cash benefit per year', 22300, 'sub'],
      'End of year 8',
      ['Resale value', 5000, 'ind']
    ], note:'Before tax, to keep things simple. In practice, include the tax saved through depreciation allowances.'}),
    K('Costs people forget',
      `<ul>
        <li><strong>Validation:</strong> in medical device manufacturing, new process equipment must be qualified (installation, operation and performance qualification) before you can use it for production.</li>
        <li><strong>Installation, training, and lost output</strong> while the line is down.</li>
        <li><strong>Running costs:</strong> maintenance contracts, software licences, spare parts, power.</li>
        <li><strong>Working capital:</strong> if the machine increases volume, more stock and receivables (Module 5).</li>
       </ul>`)
  ]},
  {id:'tvm', label:'Time value of money', kind:'learn', title:'Why a dollar next year is worth less', blocks:[
    `<p>Would you rather have $1,000 today or $1,000 in a year? Today, because you could put it to work: pay down the overdraft and save 8% interest, or invest it in the business. Money has a time value.</p>
     <p>To compare cash in different years, you convert future cash into today's money. This is called <span class="term">discounting</span>, and the rate you use is the <span class="term">discount rate</span>.</p>
     <p class="num" style="font-weight:600">Value today = Future cash ÷ (1 + rate)<sup>years</sup></p>`,
    {t:'tbl', head:['$22,300 received in…','Divide by','Worth today at 10%'], opts:{num:[1,2]}, rows:[
      ['Year 1','1.10','$20,273'],['Year 2','1.21','$18,430'],['Year 4','1.46','$15,231'],['Year 8','2.14','$10,403']
    ]},
    K('Choosing the discount rate',
      `<p>The discount rate is the return BraceWorks needs to make the investment worthwhile. It should be at least the cost of the money used, plus something for risk. BraceWorks borrows at about 6.4%, and its owners expect more than that for their riskier stake. A rate of <strong>10% to 12%</strong> is reasonable for a small manufacturer. Riskier projects, like a new product, deserve a higher rate.</p>`)
  ]},
  {id:'methods', label:'Payback, NPV, IRR', kind:'learn', title:'The three numbers on every investment proposal', blocks:[
    {t:'tbl', head:['Method','What it is','Fabric cutter','Decision rule'], opts:{num:[2]}, rows:[
      ['<strong>Payback period</strong>','Years until the cash in equals the cash out','2.7 years','Shorter is safer. Many small firms want under 3 years.'],
      ['<strong>Net present value (NPV)</strong>','All future cash, discounted to today, minus the investment','+$61,300 at 10%','Positive: the project earns more than the discount rate. Higher is better.'],
      ['<strong>Internal rate of return (IRR)</strong>','The discount rate at which NPV is exactly zero: the project\'s own return','33.8%','Accept if IRR beats your required rate.']
    ]},
    `<h3>What each one is good for</h3>
     <ul>
      <li><strong>Payback</strong> is simple and focuses on risk and cash: how long is our money exposed? But it ignores everything after payback, and the time value of money.</li>
      <li><strong>NPV</strong> is the most reliable: it tells you how much value the project adds, in today's dollars. Use it to choose between projects.</li>
      <li><strong>IRR</strong> is easy to communicate ("this machine returns 34% a year"). It can mislead when comparing projects of very different sizes.</li>
     </ul>`,
    K('In plain words',
      `<p>The fabric cutter pays back its $60,000 in under three years. Over its eight-year life, it's worth about $61,000 more than it costs, in today's money, after allowing for a 10% return. It earns roughly 34% a year on the money invested. That's a strong project, provided the savings are real.</p>`),
    Q('A project has a positive NPV at a 10% discount rate. What does that mean?',[
      'It will make an accounting profit every year','It earns more than 10% a year on the money invested','It pays back within 10 years','Its IRR is exactly 10%'],1,
      'Positive NPV means the project returns more than the discount rate, adding value.')
  ]},
  {id:'play', label:'Investment lab', kind:'play', title:'The investment lab', blocks:[
    `<p>Test the fabric cutter, or any other investment. Change the assumptions and watch the three numbers. Pay attention to which assumption matters most.</p>`,
    W('Investment calculator', function(el, ctx){
      const {money,pct}=ctx.h;
      const top=document.createElement('div'), out=document.createElement('div'); el.append(top,out);
      ctx.ui.sliders(top,[
        {k:'inv',label:'Total investment (year 0)',min:20000,max:150000,step:1000,v:60000,f:money},
        {k:'ben',label:'Net cash benefit per year',min:0,max:60000,step:500,v:22300,f:money},
        {k:'ramp',label:'Year 1 benefit while ramping up',min:25,max:100,step:5,v:100,f:x=>x+'%'},
        {k:'life',label:'Useful life',min:3,max:12,step:1,v:8,f:x=>x+' years'},
        {k:'rate',label:'Discount rate',min:6,max:20,step:0.5,v:10,f:x=>x+'%'},
        {k:'res',label:'Resale value at the end',min:0,max:20000,step:1000,v:5000,f:money}
      ],(v)=>{
        const flows=[-v.inv]; for(let t=1;t<=v.life;t++){ let c=v.ben*(t===1?v.ramp/100:1); if(t===v.life) c+=v.res; flows.push(c); }
        const N=npv(v.rate/100,flows), I=irr(flows), P=payback(flows);
        let cum=0; const bars=flows.map((c,t)=>{ cum+=c; return {label:t===0?'Now':'Year '+t,v:Math.round(cum),tone:cum<0?'bad':'good'}; });
        out.innerHTML=`<div class="stats">${ctx.ui.stat('Payback',isFinite(P)?P.toFixed(1)+' years':'Never',!isFinite(P)?'bad':P<=3?'good':P<=5?'warn':'bad')}${ctx.ui.stat('NPV at '+v.rate+'%',money(Math.round(N)),N>0?'good':'bad')}${ctx.ui.stat('IRR',isNaN(I)?'n/a':pct(I),isNaN(I)||I<v.rate/100?'bad':'good')}</div>
        <h4 style="margin:14px 0 8px">Cumulative cash, not discounted</h4>${ctx.ui.bars(bars,{fmt:x=>money(x)})}
        <p class="w-hint" style="margin-top:10px">${N<0?'At these assumptions the project destroys value: it returns less than your required rate. Can the cost come down, or the benefits be made more certain?':P>v.life?'It never pays back within its life.':'Now cut the yearly benefit by 30%, the usual gap between proposals and reality, and see if the project still works. That\'s the test of a robust investment.'}</p>`;
      },ctx.uid);
    }),
    TIP('Sensitivity: the most useful check',
      `<p>Ask what happens if the main assumption is 30% worse. For the fabric cutter, benefits of $15,600 instead of $22,300 still give a positive NPV of about $25,600 at 10% and payback in under four years. A project that only works if everything goes right isn't a good project.</p>`)
  ]},
  {id:'case', label:'Case: the rosy proposal', kind:'case', title:'The proposal that looked too good', blocks:[
    CASE('An automated quilting line',
      `<p>A machinery supplier's sales engineer, helped by the production manager, presents a proposal for an <strong>$85,000 automated quilting line</strong>. The headline: <strong>$45,000 a year of savings, payback in 1.9 years</strong>. The production manager is excited and wants to order this month to get a 5% discount.</p>
       <p>You go through the assumptions with finance.</p>`),
    SORT('For each assumption: realistic or optimistic?',['Realistic','Optimistic'],[
      {text:'Saves four workers\' wages ($16,000 a year)', a:1, why:'Nobody has a plan for those four people. If they stay, the saving is zero. Realistically, one person who is retiring won\'t be replaced: $4,000.'},
      {text:'Material saving of $9,000 a year from more precise quilting', a:0, why:'The supplier\'s trial on your own fabric showed this, and it matches the scrap data.'},
      {text:'Extra contribution of $20,000 a year from more capacity', a:1, why:'Quilting isn\'t the bottleneck, and this assumes 30% sales growth that isn\'t in the budget. About $6,000 is realistic.'},
      {text:'No maintenance or running costs', a:1, why:'Automated lines need a service contract and spares: about $4,000 a year.'},
      {text:'Full savings from the first month', a:1, why:'New equipment takes time to learn. Half the benefit in year one is more realistic.'},
      {text:'Investment of $85,000', a:1, why:'Price only. Installation ($6,000), validation ($8,000) and training downtime ($5,000) bring it to $104,000.'}
    ]),
    FS({title:'Proposal vs realistic view', cols:['Proposal','Realistic'], rows:[
      ['Investment', [-85000, -104000]],
      ['Labour savings per year', [16000, 4000]],
      ['Material savings per year', [9000, 9000]],
      ['Extra contribution per year', [20000, 6000]],
      ['Running costs per year', [0, -4000]],
      ['Net benefit per year', [45000, 15000], 'sub'],
      ['Payback', ['1.9 years','7.4 years'], ''],
      ['NPV at 12% over 10 years', ['+$169,000','($26,000)'], 'total']
    ]}),
    K('What to do',
      `<ul>
        <li>Don't let a time-limited discount rush a $100,000 decision.</li>
        <li>Ask for a written plan for every saving: whose job changes, when, and how you'll measure it.</li>
        <li>Compare with alternatives: the fabric cutter has a better return for less money.</li>
        <li>After any approved investment, do a <strong>post-investment review</strong> at 12 months. Did the savings happen? It makes future proposals more honest.</li>
       </ul>`)
  ]},
  {id:'quiz', label:'Quiz', kind:'quiz', title:'Check your understanding', blocks:[
    Q('A $40,000 machine saves $10,000 a year. What is the simple payback?',['2.5 years','4 years','10 years','40 years'],1,'$40,000 ÷ $10,000 = 4 years.'),
    Q('At a 10% discount rate, what is $11,000 received one year from now worth today?',['$11,000','$10,000','$12,100','$9,900'],1,'$11,000 ÷ 1.10 = $10,000.'),
    Q('A project\'s IRR is 8%. BraceWorks requires 12%. What should it do?',['Accept: 8% is positive','Reject, or improve the project: it returns less than required','Accept if payback is under 10 years','Use a lower discount rate'],1,'The NPV at 12% would be negative.'),
    Q('Which is the main weakness of payback?',['It\'s hard to calculate','It ignores cash after the payback date and the time value of money','It uses discounting','It needs the IRR'],1,'Two projects with the same payback can have very different value.'),
    Q('What should be included in the investment for new production equipment at a medical device maker?',['Only the purchase price','Price, installation, validation, training and any extra working capital','Price and tax','Only what the supplier quotes'],1,'All the cash needed to get the equipment producing good product.'),
    Q('The proposal says a machine will save four jobs. What should you ask?',['Nothing','Who exactly, when, and what happens to them. If they stay, there\'s no saving.','Whether the machine is blue','What the IRR is'],1,'Labour savings are only real if costs actually fall or people move to valuable work.')
  ]},
  {id:'apply', label:'Practice', kind:'apply', title:'Practise on a sample pack', blocks:[
    PACK('packB',7,'Pack B, page 7: capital request'),
    Q('The fabric cutter has a 2.7-year payback. With benefits 30% lower, payback is 3.8 years and NPV +$25,600. What do you do?',['Reject: payback over 3 years in the downside','Approve, with named owners for the savings and a 12-month review','Approve only if the supplier discounts','Wait a year'],1,'It survives the downside test. Make the savings accountable (Module 14).'),
    Q('Who should own the "two leavers not replaced" saving in the request?',['Finance','The production manager, with names and dates','The bank','Nobody'],1,'A saving without an owner usually doesn\'t happen.'),
    PACK('packD',4,'Pack D, page 4: balance sheet'),
    Q('By November (Pack D), equipment loans are $128,000 after the cutter loan. Before borrowing more, which covenant would you check first?',['Minimum net worth','Net debt to EBITDA','Interest cover','None'],1,'More debt pushes net debt to EBITDA towards its 2.5× limit (Module 17).'),
    {t:'html',html:'<h3>Later, with your own report</h3><p class="small" style="color:var(--muted)">Optional. When you next read your own monthly report, use this checklist. Nothing here is shared or sent; ticks are saved only in this browser.</p>'},
    CHECK('m14-capex','At my company…',[
      'Investments over a set amount (say $10,000) need a written proposal',
      'Proposals show cash flows by year, including installation, validation, training and running costs',
      'We calculate payback and NPV at an agreed discount rate',
      'Proposals include a "30% worse" sensitivity case',
      'Each saving has a named owner and a plan',
      'We review each major investment 12 months after it starts',
      'The monthly pack shows capital spending against the approved budget'
    ]),
    REPORT('Your Monday-morning question',
      `<p>Ask: <strong>"What did our last three equipment purchases promise, and what did they actually deliver?"</strong> The answer tells you how much to trust the next proposal.</p>`),
    K('Takeaways',
      `<ul>
        <li>Judge investments on cash flows, including the costs people forget.</li>
        <li>Money later is worth less than money now. Discount it.</li>
        <li>Payback measures risk; NPV measures value; IRR gives the return in one number.</li>
        <li>Test the main assumption at 30% worse. Robust projects survive it.</li>
        <li>Review investments after a year. It keeps proposals honest.</li>
       </ul>`)
  ]}
  ],
  warnings:[
    {sign:'Investment proposals with only the purchase price', meaning:'Installation, validation, training and running costs will surprise you.', look:'Full year-by-year cash flows.'},
    {sign:'Labour savings with no named people or plan', meaning:'Savings that won\'t happen.', look:'Who, when, and how it\'s measured.'},
    {sign:'Nobody checks if past investments delivered', meaning:'Over-optimistic proposals keep getting approved.', look:'Post-investment reviews at 12 months.'},
    {sign:'Capital spending funded from the overdraft', meaning:'Short-term money funding long-term assets; liquidity risk.', look:'Match equipment with term loans or leases.'}
  ],
  formulas:[
    {name:'Payback period', f:'Investment ÷ Annual net cash benefit (if even)', ex:'$60,000 ÷ $22,300 = 2.7 years'},
    {name:'Present value', f:'Future cash ÷ (1 + rate)^years', ex:'$22,300 in year 2 at 10%: $22,300 ÷ 1.21 = $18,430'},
    {name:'Net present value (NPV)', f:'Sum of discounted future cash flows − Investment', ex:'Fabric cutter at 10%: $121,300 − $60,000 = +$61,300'},
    {name:'Internal rate of return (IRR)', f:'The discount rate that makes NPV = 0', ex:'Fabric cutter: about 33.8%'}
  ],
  glossary:[
    {term:'Capital expenditure (capex)', def:'Spending on equipment and other long-term assets.'},
    {term:'Time value of money', def:'A dollar today is worth more than a dollar later, because it can be used or invested now.'},
    {term:'Discount rate', def:'The return required on an investment, used to convert future cash into today\'s value.'},
    {term:'Present value', def:'The value today of cash to be received in the future.'},
    {term:'Payback period', def:'Time taken for an investment\'s cash inflows to repay its cost.'},
    {term:'Net present value (NPV)', def:'Present value of future cash flows minus the investment. Positive means value is created.'},
    {term:'Internal rate of return (IRR)', def:'The discount rate at which a project\'s NPV is zero: its own rate of return.'},
    {term:'Sensitivity analysis', def:'Testing how results change when key assumptions change.'},
    {term:'Validation (IQ/OQ/PQ)', def:'Installation, operational and performance qualification of equipment, required for medical device production processes.'},
    {term:'Post-investment review', def:'A check, usually after 12 months, of whether an investment delivered what was promised.'}
  ]
});
})();
