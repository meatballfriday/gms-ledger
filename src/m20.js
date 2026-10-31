/* ===== Module 20: Funding and value ===== */
(function(){
const {K,TIP,FLAG,CASE,REPORT,Q,FS,FLIP,SORT,CHECK,W,PACK,money,signed,pct,kfmt} = BW.h;

BW.add({
  id:'m20', minutes:45,
  title:'Funding and value',
  subtitle:'Where the money to run and grow BraceWorks comes from, what it really costs, how fast the business can grow on its own, and what it\'s worth.',
  goals:[
    'Compare the main sources of funding and match them to the need',
    'Estimate how much debt the business can safely carry',
    'Work out the cost of capital and whether the business is creating value',
    'Use the sustainable growth rate to plan growth and dividends',
    'Explain what drives the value of a small manufacturer'
  ],
  sections:[
  {id:'sources', label:'Where money comes from', kind:'learn', title:'The funding menu', blocks:[
    `<p>Every dollar in BraceWorks came from somewhere: profits kept in the business, suppliers, banks, or the owners. Each source has a different cost, a different risk, and different strings attached.</p>`,
    {t:'tbl', head:['Source','Best for','Cost','Strings attached'], rows:[
      ['<strong>Profits kept in the business</strong>','Steady growth, equipment','No interest, but owners expect a return on it','Less cash for dividends'],
      ['<strong>Supplier credit</strong>','Materials','Free if paid on time','Stretch it and you lose goodwill (Module 16)'],
      ['<strong>Overdraft or working capital line</strong>','Swings in stock and receivables','Interest, often variable','Annual renewal; can be cut when you need it most'],
      ['<strong>Invoice finance</strong>','Fast-growing receivables','Interest plus fees','Customers may see it; tied to invoice quality'],
      ['<strong>Term loan or lease</strong>','Machines, fit-out','Fixed or variable interest','Covenants, security, repayment schedule'],
      ['<strong>Owner loan</strong>','Bridging a gap','Whatever is agreed','Must be documented; ranks behind the bank'],
      ['<strong>New equity</strong>','Big expansion, a new plant','The most expensive: investors expect high returns','Gives away ownership and some control'],
      ['<strong>Government or export credit schemes</strong>','Exporters, new markets','Often subsidised','Eligibility rules and paperwork']
    ]},
    {t:'fig', title:'Debt is cheaper; equity is safer', draw:function(w){
      const P=BW.viz.p, items=['Supplier credit','Bank overdraft','Term loan or lease','Owner loan','New equity'];
      let g='';
      if(w>=560){ const x0=50,x1=w-50,y=66,st=(x1-x0)/(items.length-1);
        g+=P.arrow((x0+x1)/2,y,x0-30,y,{cls:'acc'})+P.arrow((x0+x1)/2,y,x1+30,y);
        items.forEach((m,i)=>{ const x=x0+i*st, up=i%2===0; g+=`<circle cx="${P.f(x)}" cy="${y}" r="7" class="v-f-s1"/>`+P.lines(x,up?y-24:y+26,P.wrap(m,14),'v-s','middle',13); });
        g+=P.lines(x0-30,y+64,['Cheaper, but must be repaid','on time: more risk to you'],'v-l','start',13)+P.lines(x1+30,y+64,['Costlier, but no fixed','repayments: less risk to you'],'v-l','end',13);
        return P.svg(w,160,'Funding sources from cheaper but riskier debt to costlier but safer equity.',g); }
      const x=26,y0=34,st=50; g+=P.txt(x-10,14,'Cheaper, more risk to you','v-l','start')+P.arrow(x,y0+((items.length-1)*st)/2,x,y0-8,{cls:'acc'})+P.arrow(x,y0+((items.length-1)*st)/2,x,y0+(items.length-1)*st+10);
      items.forEach((m,i)=>{ const y=y0+i*st; g+=`<circle cx="${x}" cy="${P.f(y)}" r="7" class="v-f-s1"/>`+P.txt(x+18,y+5,m,'v-s','start'); });
      g+=P.txt(x-10,y0+(items.length-1)*st+30,'Costlier, less risk to you','v-l','start');
      return P.svg(w,y0+(items.length-1)*st+38,'Funding sources from cheaper but riskier debt to costlier but safer equity.',g);
    }, caption:'Debt costs less because lenders get paid first and interest is usually tax-deductible. But it must be repaid whatever happens. Equity costs more because owners take the risk, and only get paid if the business does well.'},
    K('Match the money to the need',
      `<p>Short-term needs (stock, receivables) suit short-term money. Long-term assets (machines, a new line) suit long-term money: a term loan, a lease, or equity. Funding a machine from the overdraft is the most common mistake, and it\'s exactly what squeezed BraceWorks in Module 5.</p>`)
  ]},
  {id:'capacity', label:'How much debt?', kind:'play', title:'How much debt can BraceWorks carry?', blocks:[
    `<p>Banks size loans mainly on two tests: how many years of EBITDA the debt represents, and whether operating cash comfortably covers interest and repayments. You can run the same tests yourself before you ask.</p>`,
    W('Debt capacity check', function(el, ctx){
      const {money}=ctx.h; const top=document.createElement('div'), out=document.createElement('div'); el.append(top,out);
      ctx.ui.sliders(top,[
        {k:'ebitda',label:'EBITDA',min:60000,max:250000,step:2000,v:132000,f:money},
        {k:'lim',label:'Your own limit: net debt ÷ EBITDA',min:1,max:3.5,step:0.25,v:2,f:x=>x.toFixed(2)+'×'},
        {k:'nd',label:'Net debt today',min:0,max:400000,step:5000,v:178000,f:money},
        {k:'rate',label:'Interest rate',min:3,max:14,step:0.5,v:6.5,f:x=>x+'%'},
        {k:'yrs',label:'Years to repay new borrowing',min:2,max:10,step:1,v:5,f:x=>x+' years'}
      ],v=>{
        const capTotal=v.ebitda*v.lim, room=Math.max(0,capTotal-v.nd);
        const interest=capTotal*v.rate/100, service=interest+room/v.yrs, fcf=v.ebitda*0.75;
        const dscr=fcf/service;
        out.innerHTML=`<div class="stats">${ctx.ui.stat('Most net debt at your limit',money(Math.round(capTotal)))}${ctx.ui.stat('Room to borrow more',money(Math.round(room)),room<20000?'warn':'good')}${ctx.ui.stat('Interest cover at the limit (EBITDA ÷ interest)',(v.ebitda/Math.max(1,interest)).toFixed(1)+'×',v.ebitda/interest<4?'bad':'good')}${ctx.ui.stat('Cash available ÷ yearly debt payments',dscr.toFixed(2)+'×',dscr<1.25?'bad':dscr<1.6?'warn':'good','banks like 1.25× or more')}</div>`+
          ctx.ui.bars([{label:'Net debt today',v:v.nd,tone:'blue'},{label:'Room to borrow more',v:Math.round(room),tone:'good'},{label:'Your limit',v:Math.round(capTotal),tone:'muted'}],{max:Math.max(capTotal,v.nd)})+
          `<p class="w-hint" style="margin-top:10px">${room===0?'BraceWorks is already at or above your limit. Growth would need profit, faster cash collection, or equity.':dscr<1.25?'The ratio says yes, but cash flow says no: repayments would take too much of the cash the business generates. Borrow less, or over more years.':'Within both tests. Remember the bank\'s covenants (Module 17) may be tighter than your own limit.'} Cash available is estimated as 75% of EBITDA, after tax and routine equipment spending.</p>`;
      },ctx.uid);
    }),
    K('Set your own limit below the bank\'s',
      `<p>If the covenant is 2.5×, run the business at 2.0× or less. The gap is your safety margin for a bad quarter, a late customer or a currency swing. Lenders trust companies that never need a covenant waiver.</p>`)
  ]},
  {id:'cost', label:'Cost of capital', kind:'play', title:'What does BraceWorks\' money cost?', blocks:[
    `<p>BraceWorks uses two kinds of long-term money: bank debt and the owners\' equity. Each has a cost:</p>
     <ul>
      <li><strong>Cost of debt:</strong> the interest rate, reduced by the tax saved because interest is deductible. 6.4% × (1 − 25%) = <strong>4.8%</strong>.</li>
      <li><strong>Cost of equity:</strong> the return the owners could reasonably expect elsewhere for similar risk. For a small private manufacturer, a figure in the mid-teens is common. We\'ll use <strong>14%</strong>.</li>
     </ul>
     <p>Weighted by how much of each BraceWorks uses ($220,000 of debt, $491,500 of equity), that gives a <span class="term">weighted average cost of capital</span> (WACC) of about <strong>11%</strong>.</p>`,
    W('Cost of capital and economic profit', function(el, ctx){
      const {money,pct}=ctx.h; const top=document.createElement('div'), out=document.createElement('div'); el.append(top,out);
      ctx.ui.sliders(top,[
        {k:'r',label:'Interest rate on debt',min:3,max:14,step:0.1,v:6.4,f:x=>x.toFixed(1)+'%'},
        {k:'t',label:'Tax rate',min:0,max:30,step:1,v:25,f:x=>x+'%'},
        {k:'ke',label:'Owners\' required return (cost of equity)',min:8,max:25,step:0.5,v:14,f:x=>x+'%'},
        {k:'wd',label:'Share of funding from debt',min:0,max:70,step:1,v:31,f:x=>x+'%'},
        {k:'roce',label:'Return on capital employed',min:0,max:30,step:0.1,v:15.9,f:x=>x.toFixed(1)+'%'}
      ],v=>{
        const kd=v.r*(1-v.t/100), wacc=(v.wd/100)*kd+(1-v.wd/100)*v.ke, ep=(v.roce-wacc)/100*591500;
        out.innerHTML=`<div class="stats">${ctx.ui.stat('After-tax cost of debt',kd.toFixed(1)+'%')}${ctx.ui.stat('WACC',wacc.toFixed(1)+'%')}${ctx.ui.stat('Return on capital',v.roce.toFixed(1)+'%',v.roce>wacc?'good':'bad')}${ctx.ui.stat('Economic profit',money(Math.round(ep)),ep>0?'good':'bad','(ROCE − WACC) × $591,500 capital')}</div>
        <p class="w-hint" style="margin-top:10px">${ep>0?`BraceWorks earns ${(v.roce-wacc).toFixed(1)} points more on its capital than that capital costs: it\'s creating value for its owners.`:'Return on capital is below the cost of capital. Accounting profit may be positive, but the owners would be better off with their money elsewhere.'} More debt lowers WACC up to a point, but raises risk: push the debt share up and remember the covenants.</p>`;
      },ctx.uid);
    }),
    K('Where this connects',
      `<ul>
        <li><strong>Investment decisions (Module 14):</strong> the discount rate should be at least the WACC. At 11%, the fabric cutter\'s NPV is about +$56,000 instead of +$61,300 at 10%: still a clear yes.</li>
        <li><strong>Economic profit:</strong> profit after charging for <em>all</em> the capital used, including the owners\'. BraceWorks: (15.9% − 11.2%) × $591,500 ≈ <strong>$27,800</strong> of value created in the year.</li>
       </ul>`)
  ]},
  {id:'growth', label:'Growth and dividends', kind:'play', title:'How fast can BraceWorks grow on its own money?', blocks:[
    `<p>Growth needs more stock, more receivables and more equipment (Module 5). If BraceWorks keeps its ratios the same and doesn\'t borrow more, the fastest it can grow is set by how much profit it keeps:</p>
     <p class="num" style="font-weight:600">Sustainable growth rate = Return on equity × Share of profit kept in the business</p>
     <p>BraceWorks: 11.3% × 100% kept = <strong>11.3% a year</strong>. Pay out half as dividends, and it falls to about 5.6%.</p>`,
    W('Dividends vs growth', function(el, ctx){
      const {money,pct}=ctx.h; const top=document.createElement('div'), out=document.createElement('div'); el.append(top,out);
      ctx.ui.sliders(top,[
        {k:'roe',label:'Return on equity',min:4,max:25,step:0.1,v:11.3,f:x=>x.toFixed(1)+'%'},
        {k:'pay',label:'Share of profit paid as dividends',min:0,max:100,step:5,v:0,f:x=>x+'%'},
        {k:'plan',label:'Growth you\'re planning',min:0,max:40,step:1,v:15,f:x=>x+'%'}
      ],v=>{
        const g=v.roe*(1-v.pay/100), gap=v.plan-g;
        out.innerHTML=`<div class="stats">${ctx.ui.stat('Sustainable growth',g.toFixed(1)+'% a year')}${ctx.ui.stat('Planned growth',v.plan+'%',gap>0?'warn':'good')}${ctx.ui.stat('Extra funding needed in year one',gap>0?money(Math.round(gap/100*591500)):'$0',gap>0?'bad':'good','roughly: the growth gap × $591,500 of capital employed')}</div>`+
          ctx.ui.bars([{label:'Sustainable growth',v:g,tone:'good'},{label:'Planned growth',v:v.plan,tone:gap>0?'bad':'blue'}],{fmt:x=>x.toFixed(1)+'%',max:Math.max(v.plan,g,1)})+
          `<p class="w-hint" style="margin-top:10px">${gap>0?`Growing faster than ${g.toFixed(1)}% needs extra money: more borrowing, new equity, a lower dividend, or a faster cash cycle (Module 16). Decide which before you sign the contracts.`:'This growth plan can be funded from kept profits, if ratios hold.'}</p>`;
      },ctx.uid);
    }),
    K('Dividends: questions to ask first',
      `<ul>
        <li><strong>Is there cash?</strong> Dividends are paid in cash, not profit. Check the 13-week forecast.</li>
        <li><strong>Is it allowed?</strong> Company law usually allows dividends only from accumulated profits, and loan agreements may restrict them.</li>
        <li><strong>What does the growth plan need?</strong> Every dollar paid out is a dollar not funding growth.</li>
        <li><strong>How is it taxed?</strong> Dividend taxes differ by country, and Taiwan\'s surtax on retained profits pushes the other way (Module 19).</li>
        <li><strong>Salary, dividend or loan?</strong> Owners can be paid in different ways with different tax and legal effects. Keep owner loans documented (Module 18).</li>
       </ul>`)
  ]},
  {id:'value', label:'What it\'s worth', kind:'play', title:'What is BraceWorks worth?', blocks:[
    `<p>Owners, buyers and banks all ask this sooner or later. For a small private company, the most common shortcut is a <span class="term">valuation multiple</span>:</p>
     <ul>
      <li><strong>Enterprise value</strong> = EBITDA × a multiple. It\'s the value of the whole business, whoever funds it.</li>
      <li><strong>Equity value</strong> = enterprise value − net debt. It\'s what the owners\' shares are worth.</li>
     </ul>
     <p>Small private manufacturers often change hands at mid single-digit multiples of EBITDA. The multiple rises with growth, margins and lower risk, and falls with dependence on one customer or on the owner. A more thorough method values the future cash flows directly, which is the NPV idea from Module 14 applied to the whole company.</p>`,
    W('Valuation builder', function(el, ctx){
      const {money}=ctx.h; const top=document.createElement('div'), tg=document.createElement('div'), out=document.createElement('div'); tg.className='seg'; el.append(top,tg,out);
      const F=[['conc','Largest customer below 15% of sales',0.4],['audit','Clean audited accounts and a reliable monthly pack',0.4],['mgmt','A management team that runs it without the owner',0.5],['cash','Cash conversion above 70% of EBITDA',0.3]];
      const on={}; let vals={};
      F.forEach(x=>{ const b=document.createElement('button'); b.type='button'; b.textContent='+ '+x[1]; b.setAttribute('aria-pressed','false'); b.onclick=()=>{ on[x[0]]=!on[x[0]]; b.setAttribute('aria-pressed',String(!!on[x[0]])); draw(); }; tg.appendChild(b); });
      function draw(){ const add=F.reduce((s,x)=>s+(on[x[0]]?x[2]:0),0), mult=vals.m+add, ev=vals.e*mult, eq=ev-vals.nd;
        out.innerHTML=ctx.ui.bridge([{label:'EBITDA × '+vals.m.toFixed(1)+' (base multiple)',v:Math.round(vals.e*vals.m),total:true},{label:'Lower risk: +'+add.toFixed(1)+'× multiple',v:Math.round(vals.e*add)},{label:'Enterprise value',v:Math.round(ev),total:true},{label:'Less net debt',v:-vals.nd},{label:'Equity value',v:Math.round(eq),total:true}],{fmt:kfmt})+
          `<div class="stats" style="margin-top:12px">${ctx.ui.stat('Multiple used',mult.toFixed(1)+'× EBITDA')}${ctx.ui.stat('Equity value',money(Math.round(eq)),eq>0?'good':'bad')}</div>
          <p class="w-hint" style="margin-top:10px">Illustrative only: real multiples depend on the market, the buyer and the deal. The point is what moves value: the same EBITDA is worth more when the business is less risky. Several of the fixes are things this course teaches.</p>`; }
      ctx.ui.sliders(top,[
        {k:'e',label:'EBITDA',min:60000,max:300000,step:2000,v:132000,f:money},
        {k:'m',label:'Base multiple',min:3,max:8,step:0.1,v:4.5,f:x=>x.toFixed(1)+'×'},
        {k:'nd',label:'Net debt',min:0,max:400000,step:5000,v:178000,f:money}
      ],v=>{vals=v;draw();},ctx.uid);
    }),
    K('Value is built every month',
      `<p>Better margins raise EBITDA. Lower risk raises the multiple. Faster cash collection reduces net debt. A GM who improves all three can add more value than a big sales push. And clean, reliable numbers are themselves worth money: buyers pay less, or walk away, when they can\'t trust the accounts.</p>`)
  ]},
  {id:'case', label:'Case: the year-end dividend', kind:'case', title:'The year-end dividend', blocks:[
    CASE('The owner asks for $50,000',
      `<p>It\'s early December. The owner has had a good year and asks for a <strong>$50,000 dividend</strong> before Christmas. Here\'s the position:</p>
       <ul>
        <li>Cash $42,000; overdraft $120,000 of a $150,000 limit.</li>
        <li>Net debt to EBITDA 1.35×. The covenant is 2.5×; your own limit is 2.0×.</li>
        <li>The Australian contract (Module 5) starts in February and needs about $45,000 of working capital up front, even after negotiating better terms.</li>
        <li>January and February are the slowest sales months (Module 15).</li>
       </ul>`),
    FS({title:'Paying $50,000 now', cols:['Before','After'], rows:[
      ['Cash plus unused overdraft (headroom)',[72000,22000]],
      ['Net debt',[178000,228000]],
      ['Net debt ÷ EBITDA',['1.35×','1.73×']],
      ['Headroom after funding the Australian contract',[27000,-23000],'total']
    ]}),
    Q('What do you recommend to the owner?',[
      {text:'Pay the full $50,000 now: it\'s been a good year', why:'Headroom would fall to $22,000 in the slowest months, and the Australian contract would leave BraceWorks out of cash.'},
      {text:'Refuse any dividend this year', why:'The business is profitable and under its debt limits. A refusal with no plan damages trust with the owner.'},
      {text:'Pay a smaller dividend now, with the rest in the second quarter once the contract\'s cash need is funded and the forecast confirms headroom'},
      {text:'Pay it, and stretch suppliers to 90 days to cover it', why:'Using suppliers to fund a dividend is the pattern Module 16 warned against.'}
    ],2,'For example, $15,000 now and up to $35,000 in April, subject to the 13-week forecast. The owner gets a return, the business stays inside its own limits, and the growth contract is funded. Show the owner the numbers: owners agree more readily when they can see the cash plan.'),
    K('The habit to build',
      `<p>Agree a dividend policy with the owner once a year, for example "up to 40% of profit, paid after year-end, provided headroom stays above $50,000 and net debt stays below 2× EBITDA". Then dividends stop being a surprise for anyone.</p>`)
  ]},
  {id:'quiz', label:'Quiz', kind:'quiz', title:'Check your understanding', blocks:[
    Q('Why is debt usually cheaper than equity?',['Banks are generous','Lenders are paid first, and interest is usually tax-deductible','Equity has no cost','Debt never has to be repaid'],1,'Lower risk for the lender plus the tax saving make debt cheaper. But it has to be repaid whatever happens.'),
    Q('BraceWorks\' EBITDA is $132,000 and its own limit is 2.0× net debt to EBITDA. Net debt is $178,000. How much more could it borrow within that limit?',['$264,000','$86,000','$178,000','Nothing'],1,'2.0 × $132,000 = $264,000 maximum, less $178,000 today = $86,000 of room.'),
    Q('ROCE is 15.9% and WACC is 11.2%. What does that tell you?',['The business is losing money','The business earns more on its capital than that capital costs: it creates value','WACC is too low','Nothing useful'],1,'Economic profit is positive: about $27,800 on $591,500 of capital.'),
    Q('ROE is 11.3% and the company pays out half its profit as dividends. What is its sustainable growth rate?',['11.3%','5.65%','22.6%','50%'],1,'11.3% × 50% kept = about 5.6% a year without new funding.'),
    Q('Two companies have the same EBITDA. Which deserves the higher multiple?',['The one where one customer buys 40% of everything','The one with many customers, audited accounts and a team that runs it without the owner','The one with the bigger overdraft','They\'re worth exactly the same'],1,'Lower risk means a higher multiple.'),
    Q('What should come first when the owner asks for a dividend?',['The tax rate','The cash forecast and headroom, loan restrictions, and the growth plan\'s cash needs','The share price','The auditor\'s fee'],1,'Dividends are paid in cash. Check that the business can afford it and stay within its limits.')
  ]},
  {id:'apply', label:'Practice', kind:'apply', title:'Practise on a sample pack', blocks:[
    PACK('packB',6,'Pack B, page 6: balance sheet and cash flow'),
    Q('Pack B\'s dashboard shows net debt to EBITDA of 1.2×. Net debt is about $154,000. With EBITDA around $132,000 and an own limit of 2.0×, roughly how much room is there to borrow for the fabric cutter?',['About $110,000','About $20,000','About $264,000','None'],0,'2.0 × $132,000 = $264,000, less $154,000 = about $110,000. A $60,000 loan for the cutter fits comfortably.'),
    PACK('packC',6,'Pack C, page 6: covenants'),
    Q('In July (Pack C), the owner asks for a dividend because "profit is ahead of budget". What\'s the strongest reason to say not now?',['Covenants fail','The 13-week forecast shows liquidity below zero in weeks 2 and 4','Profit is behind budget','Tax'],1,'Covenants pass, but cash doesn\'t. A dividend would make the crunch worse.'),
    {t:'html',html:'<h3>Later, with your own business</h3><p class="small" style="color:var(--muted)">Optional. Ticks are saved only in this browser.</p>'},
    CHECK('m20-fund','At my company…',[
      'Long-term assets are funded with long-term money (term loans, leases, equity), not the overdraft',
      'We have our own debt limit, set below the bank\'s covenants',
      'I know roughly what our capital costs, and use at least that rate for investment decisions',
      'Growth plans are checked against how much growth our profits can fund',
      'There\'s an agreed dividend policy with the owners',
      'Owner loans and payments are documented',
      'I know what drives our value, and which risks would lower it'
    ]),
    K('Takeaways',
      `<ul>
        <li>Debt is cheaper but must be repaid; equity is costlier but carries no fixed repayments. Match the funding to the need.</li>
        <li>Size debt with two tests: net debt ÷ EBITDA, and cash available ÷ debt payments. Keep your own limit below the bank\'s.</li>
        <li>WACC is the hurdle: earning more than it on your capital creates value.</li>
        <li>Sustainable growth = ROE × share of profit kept. Faster growth needs extra funding.</li>
        <li>Value = EBITDA × a multiple that rises as risk falls, less net debt.</li>
       </ul>`)
  ]}
  ],
  warnings:[
    {sign:'Planned growth above the sustainable growth rate, with no funding plan', meaning:'Overtrading risk: the business will run short of cash.', look:'Sustainable growth vs plan; funding options agreed in advance.'},
    {sign:'Net debt above your own limit, or close to the covenant', meaning:'Little room for a bad quarter; the bank may tighten terms.', look:'Net debt ÷ EBITDA trend and forecast.'},
    {sign:'Return on capital below the cost of capital', meaning:'The business is destroying value even if it shows a profit.', look:'ROCE vs WACC; low-return products, customers or assets.'},
    {sign:'Dividends paid without checking cash', meaning:'Dividends funded by the overdraft or by stretching suppliers.', look:'13-week forecast and headroom at the payment date.'}
  ],
  formulas:[
    {name:'After-tax cost of debt', f:'Interest rate × (1 − Tax rate)', ex:'6.4% × (1 − 25%) = 4.8%'},
    {name:'WACC', f:'(Debt share × After-tax cost of debt) + (Equity share × Cost of equity)', ex:'31% × 4.8% + 69% × 14% = 11.2%'},
    {name:'Economic profit', f:'(ROCE − WACC) × Capital employed', ex:'(15.9% − 11.2%) × $591,500 = $27,800'},
    {name:'Sustainable growth rate', f:'ROE × Share of profit kept in the business', ex:'11.3% × 100% = 11.3% a year'},
    {name:'Debt capacity', f:'EBITDA × Your limit (net debt ÷ EBITDA) − Net debt today', ex:'$132,000 × 2.0 − $178,000 = $86,000'},
    {name:'Equity value', f:'EBITDA × Multiple − Net debt', ex:'$132,000 × 4.5 − $178,000 = $416,000'}
  ],
  glossary:[
    {term:'Cost of debt', def:'The interest rate on borrowing, usually shown after the tax saving on interest.'},
    {term:'Cost of equity', def:'The return owners could reasonably expect elsewhere for the same risk.'},
    {term:'Weighted average cost of capital (WACC)', def:'The average cost of all the long-term money a business uses, weighted by how much of each it has.'},
    {term:'Economic profit', def:'Profit after a charge for all the capital used, including the owners\'. Positive means value is being created.'},
    {term:'Sustainable growth rate', def:'The fastest a business can grow without new funding, if its ratios stay the same: ROE × share of profit kept.'},
    {term:'Payout ratio', def:'The share of profit paid out as dividends.'},
    {term:'Debt capacity', def:'How much a business can borrow while staying within its own limits and lenders\' tests.'},
    {term:'Debt service', def:'The interest and repayments due on borrowing in a period.'},
    {term:'Gearing', def:'How much of a business is funded by debt rather than equity. Also called leverage.'},
    {term:'Enterprise value', def:'The value of a whole business, before deducting its debt. Often estimated as EBITDA × a multiple.'},
    {term:'Equity value', def:'Enterprise value minus net debt: what the owners\' shares are worth.'},
    {term:'Valuation multiple', def:'A rule-of-thumb ratio used to value a business, such as a number of years\' EBITDA.'},
    {term:'Discounted cash flow (DCF)', def:'Valuing a business or project by discounting its expected future cash flows to today.'},
    {term:'Personal guarantee', def:'A promise by an owner to repay a company\'s loan personally if the company can\'t.'},
    {term:'Owner loan', def:'Money lent to the company by its owner, to be repaid on agreed terms.'},
    {term:'Export credit agency', def:'A government-backed body that offers loans, guarantees or insurance to support exporters.'}
  ]
});
})();
