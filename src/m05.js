/* ===== Module 5: Cash flow ===== */
(function(){
const {K,TIP,FLAG,CASE,REPORT,Q,FS,FLIP,SORT,CHECK,W,PACK,money,signed,pct,kfmt} = BW.h;
const C=BW.data.cf;

BW.add({
  id:'m5', minutes:40,
  title:'Cash flow',
  subtitle:'Profit keeps score. Cash keeps you alive. How to read the cash flow statement, and how a profitable factory can still run out of money.',
  goals:[
    'Read a cash flow statement in both its common formats',
    'Explain each step from net profit to operating cash flow',
    'Calculate free cash flow and liquidity headroom',
    'Spot overtrading before you sign a big new order'
  ],
  sections:[
  {id:'stmt', label:'The statement', kind:'learn', title:'BraceWorks\' cash flow statement', blocks:[
    `<p>The cash flow statement explains the change in the bank balance. Most companies present it using the <strong>indirect method</strong>: start from net profit, then adjust for everything that affected profit and cash differently.</p>`,
    FS({title:'BraceWorks Medical · Cash flow statement', sub:'Year ended 31 December · indirect method', rows:[
      'Operating activities',
      ['Net profit', C.net, 'ind'],
      ['Add back depreciation', C.dep, 'ind'],
      ['Increase in receivables', C.dAR, 'ind'],
      ['Increase in inventory', C.dInv, 'ind'],
      ['Increase in payables', C.dAP, 'ind'],
      ['Increase in accrued expenses', C.dAccr, 'ind'],
      ['Increase in tax payable', C.dTax, 'ind'],
      ['Cash from operating activities', C.cfo, 'sub'],
      'Investing activities',
      ['Purchase of foam-cutting machine', C.capex, 'ind'],
      ['Cash used in investing activities', C.capex, 'sub'],
      'Financing activities',
      ['Drawn on working capital loan', C.borrow, 'ind'],
      ['Equipment loan repaid', C.repay, 'ind'],
      ['Dividends paid', 0, 'ind'],
      ['Cash from financing activities', C.cff, 'sub'],
      ['Net change in cash', C.change, 'sub'],
      ['Cash at start of year', C.open, 'ind'],
      ['Cash at end of year', C.close, 'total']
    ]}),
    `<h3>The same story, told directly</h3>
     <p>Some companies show operating cash flow using the <strong>direct method</strong>: actual money in and out. It's easier to read, and it's worth asking your team for this view, at least monthly.</p>`,
    FS({title:'Operating cash flow · direct method', rows:[
      ['Received from customers', 1170000],
      ['Paid to suppliers, employees and others', -1106000],
      ['Interest paid', -14000],
      ['Tax paid', -17000],
      ['Cash from operating activities', 33000, 'total']
    ], note:'Customers paid $30,000 less than sales, because receivables grew. Same answer as the indirect method, from the other direction.'}),
    K('Where to look first',
      `<p>Look at the <strong>operating</strong> line before anything else. A healthy business generates cash from its operations year after year. If operating cash is weak or negative, the business is being kept alive by borrowing or by the owners, however good the profit looks.</p>`),
    TIP('Coming in 2027: where interest goes',
      `<p>Today, companies may show interest paid under operating or financing activities. BraceWorks puts it in operating. Under <strong>IFRS 18</strong>, for companies on full IFRS or full PFRS from 2027 (Taiwan-IFRS from 2028), interest and dividends paid go to <strong>financing</strong>, interest and dividends received go to investing, and the indirect method starts from <strong>operating profit</strong> instead of net profit. For BraceWorks, operating cash flow would rise from $33,000 to $47,000 and financing would fall by the same $14,000, with no change in the bank balance.</p>`)
  ]},
  {id:'bridge', label:'Profit to cash', kind:'learn', title:'From profit to cash, step by step', blocks:[
    `<p>The indirect method looks confusing until you know the two rules behind it.</p>`,
    K('Rule 1: add back costs that used no cash',
      `<p>Depreciation reduced profit by $38,000, but no money left the bank when it was recorded. The cash left when the machines were bought. So it's added back. The same applies to inventory write-downs and bad debt provisions.</p>`),
    K('Rule 2: working capital moves cash',
      `<ul>
        <li>An <strong>asset going up</strong> (more receivables, more stock) <strong>uses cash</strong>. Money is now sitting in it instead of the bank.</li>
        <li>An <strong>asset going down</strong> releases cash.</li>
        <li>A <strong>liability going up</strong> (more owed to suppliers) <strong>provides cash</strong>. You\'ve kept money you would otherwise have paid.</li>
        <li>A <strong>liability going down</strong> uses cash.</li>
       </ul>`),
    SORT('Does each change use cash or provide cash?',['Uses cash','Provides cash'],[
      {text:'Receivables go up by $20,000', a:0, why:'Customers owe you more, so you\'ve collected less than you sold.'},
      {text:'Finished goods inventory falls by $15,000', a:1, why:'You sold stock you\'d already paid for, without replacing all of it.'},
      {text:'Payables to suppliers rise by $10,000', a:1, why:'You\'ve held on to $10,000 that would otherwise have gone to suppliers.'},
      {text:'A customer pays a $15,000 deposit on a future order', a:1, why:'Cash in now, with a liability to deliver later.'},
      {text:'You prepay a year of insurance', a:0, why:'Cash out now for a cost that belongs to future months.'},
      {text:'You repay $20,000 of the equipment loan', a:0, why:'A liability falls, using cash. It shows under financing.'},
      {text:'You sell an old sewing machine for $2,000', a:1, why:'Cash in from investing activities.'}
    ]),
    TIP('A shortcut for reading any cash flow statement',
      `<p>Compare <strong>operating cash flow with EBITDA</strong>. This is called cash conversion. BraceWorks: $33,000 ÷ $132,000 = 25%. In a stable business you'd hope for 70% or more after tax and interest. Low conversion almost always means working capital is growing: check receivables and stock.</p>`)
  ]},
  {id:'play', label:'Cash bridge', kind:'play', title:'Build BraceWorks\' cash year', blocks:[
    `<p>Change how fast customers pay, how much stock you hold, how fast you pay suppliers, and how much you spend on equipment. Watch the year-end cash. The figures start at last year's actuals.</p>`,
    W('Cash bridge builder', function(el, ctx){
      const {money,signed}=ctx.h;
      const top=document.createElement('div'), out=document.createElement('div'); el.append(top,out);
      const REV=1200000, COGS=860000, MAT=552000, AR0=200000, INV0=205000, AP0=85000, DEP=38000, OPEN=49000, FIN=20000, OTHER=4500;
      ctx.ui.sliders(top,[
        {k:'dso',label:'Customers pay in (days)',min:30,max:120,step:1,v:70,f:x=>x+' days'},
        {k:'dio',label:'Stock held (days of cost of sales)',min:45,max:150,step:1,v:106,f:x=>x+' days'},
        {k:'dpo',label:'We pay suppliers in (days)',min:20,max:90,step:1,v:63,f:x=>x+' days'},
        {k:'capex',label:'Equipment purchases',min:0,max:120000,step:5000,v:60000,f:money},
        {k:'np',label:'Net profit',min:-20000,max:120000,step:2500,v:55500,f:money}
      ],(v)=>{
        const ar=REV*v.dso/365, inv=COGS*v.dio/365, ap=MAT*v.dpo/365;
        const dAR=-(ar-AR0), dInv=-(inv-INV0), dAP=ap-AP0;
        const cfo=v.np+DEP+dAR+dInv+dAP+OTHER, fcf=cfo-v.capex, close=OPEN+cfo-v.capex+FIN;
        const R=x=>Math.round(x/100)*100;
        out.innerHTML=ctx.ui.bridge([
          {label:'Net profit',v:R(v.np),total:true},
          {label:'Add back depreciation',v:DEP},
          {label:'Receivables',v:R(dAR)},
          {label:'Inventory',v:R(dInv)},
          {label:'Payables and other',v:R(dAP+OTHER)},
          {label:'Cash from operations',v:R(cfo),total:true},
          {label:'Equipment',v:-v.capex},
          {label:'Net borrowing',v:FIN},
          {label:'Opening cash',v:OPEN},
          {label:'Closing cash',v:R(close),total:true}
        ])+`<div class="stats" style="margin-top:14px">
          ${ctx.ui.stat('Cash from operations',money(R(cfo)),cfo<0?'bad':'')}
          ${ctx.ui.stat('Free cash flow',money(R(fcf)),fcf<0?'bad':'good','operations minus equipment')}
          ${ctx.ui.stat('Year-end cash',money(R(close)),close<0?'bad':close<30000?'warn':'good')}
        </div>
        <p class="w-hint" style="margin-top:10px">${close<0?`BraceWorks would need another <strong>${money(-R(close))}</strong> of borrowing to get through the year, despite ${v.np>0?'making a profit':'its result'}.`:v.dso<=55&&v.dio<=85?'Look how much cash comes out of working capital. Faster collection and leaner stock fund the business without any extra profit.':'Try this: set customers to 55 days and stock to 85 days, leaving profit alone. That releases roughly $100,000.'}</p>`;
      },ctx.uid);
    }),
    K('Working capital is a cash lever as big as profit',
      `<p>Collecting 15 days faster and holding 3 weeks less stock frees about $100,000 once. To generate the same cash from profit, BraceWorks would need nearly two years of current earnings. That's why Module 16 is devoted to it.</p>`)
  ]},
  {id:'build', label:'Build it yourself', kind:'play', title:'Build next year\'s cash flow yourself', blocks:[
    `<p>Reading a cash flow statement is one skill. Building one from the other two statements proves you understand how they link. Here are BraceWorks' draft accounts for <strong>next year</strong>. Work out each line of the cash flow statement from the clues. Use a minus sign for cash going out.</p>`,
    W('Cash flow builder', function(el,ctx){
      const CL=[
        ['Cash',42000,17900],['Receivables',230000,214000],['Inventory (all three kinds)',250000,245000],['Prepayments',13000,15000],
        ['Machinery and fit-out, at cost',520000,575000],['Less accumulated depreciation',-210000,-227000],['<strong>Total assets</strong>',845000,839900],
        ['Payables',95000,88000],['Accrued expenses',30000,34000],['Working capital loan (overdraft)',120000,95000],['Tax payable',8500,10200],['Equipment loan',100000,80000],
        ['Share capital',250000,250000],['Retained earnings',241500,282700],['<strong>Total liabilities and equity</strong>',845000,839900]];
      const L=[
        {h:'Operating activities'},
        {k:'np',t:'Net profit',a:61200,given:true},
        {k:'dep',t:'Add back depreciation',a:44000,hint:'Depreciation charged in the year is in the clues: $44,000. It reduced profit but used no cash.'},
        {k:'gain',t:'Gain on selling the old machine',a:-2000,hint:'The machine\'s book value was $30,000 − $27,000 = $3,000; it sold for $5,000. The $2,000 gain is inside profit, but the whole $5,000 belongs under investing. Take the gain out here.'},
        {k:'ar',t:'Change in receivables',a:16000,hint:'$230,000 → $214,000. Receivables fell by $16,000: customers paid more than they were billed, which provides cash.'},
        {k:'inv',t:'Change in inventory',a:5000,hint:'$250,000 → $245,000. Less stock means cash released.'},
        {k:'pre',t:'Change in prepayments',a:-2000,hint:'$13,000 → $15,000. More paid in advance uses cash.'},
        {k:'ap',t:'Change in payables',a:-7000,hint:'$95,000 → $88,000. Suppliers were paid down, which uses cash.'},
        {k:'acc',t:'Change in accrued expenses',a:4000,hint:'$30,000 → $34,000. More costs not yet paid: cash kept.'},
        {k:'tax',t:'Change in tax payable',a:1700,hint:'$8,500 → $10,200. Tax charged but not yet paid: cash kept.'},
        {sub:'cfo',t:'Cash from operating activities',of:['np','dep','gain','ar','inv','pre','ap','acc','tax']},
        {h:'Investing activities'},
        {k:'capex',t:'Machinery bought',a:-85000,hint:'At cost, machinery went from $520,000 to $575,000, but the $30,000 machine sold was also removed. Purchases = $575,000 − $520,000 + $30,000 = $85,000.'},
        {k:'sale',t:'Cash from selling the old machine',a:5000,hint:'The sale price: $5,000.'},
        {sub:'cfi',t:'Cash used in investing',of:['capex','sale']},
        {h:'Financing activities'},
        {k:'od',t:'Overdraft repaid',a:-25000,hint:'$120,000 → $95,000.'},
        {k:'loan',t:'Equipment loan repaid',a:-20000,hint:'$100,000 → $80,000.'},
        {k:'div',t:'Dividends paid',a:-20000,hint:'From the clues. Check: retained earnings $241,500 + profit $61,200 − dividends = $282,700.'},
        {sub:'cff',t:'Cash from financing',of:['od','loan','div']},
        {sub:'net',t:'Net change in cash',of:['np','dep','gain','ar','inv','pre','ap','acc','tax','capex','sale','od','loan','div']}];
      const S=ctx.state; S.cfb=S.cfb||{}; const st=S.cfb; const P=BW.parseNum||(x=>parseFloat(x));
      el.innerHTML=`<div class="cfb-clues"><div><h4 style="margin:0 0 6px">Balance sheets</h4>${ctx.ui.table(['','This year','Next year'],CL.map(r=>[r[0],ctx.h.money(r[1]),ctx.h.money(r[2])]),{num:[1,2]})}</div>
        <div><h4 style="margin:0 0 6px">Next year: the other clues</h4><ul class="prose" style="margin:0;padding-left:18px;font-size:15px">
          <li>Net profit: <strong>$61,200</strong>, after depreciation of <strong>$44,000</strong>.</li>
          <li>An old sewing machine that cost <strong>$30,000</strong> (accumulated depreciation <strong>$27,000</strong>) was sold for <strong>$5,000</strong> cash. The gain is included in profit.</li>
          <li>Dividends of <strong>$20,000</strong> were declared and paid.</li>
          <li>No new loans were taken out.</li></ul></div></div>
        <div class="cfb-lines"></div>
        <div class="cfb-tie"><div class="cfb-txt" style="flex:1"></div><span class="cfb-stamp" hidden>TIES ✓</span></div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px"><button type="button" class="btn small" data-check>Check my answers</button><button type="button" class="btn ghost small" data-show style="display:none">Show the answers</button><button type="button" class="linkbtn" data-reset>Start again</button></div>`;
      const box=el.querySelector('.cfb-lines'); const rows={};
      L.forEach(l=>{ if(l.h){ box.appendChild(Object.assign(document.createElement('div'),{className:'cfb-row h',textContent:l.h})); return; }
        const r=document.createElement('div'); r.className='cfb-row'+(l.sub?' sub':'');
        if(l.sub){ r.innerHTML=`<span>${l.t}</span><span class="given" data-sum></span><span class="mk"></span>`; rows[l.sub]={r,l}; }
        else if(l.given){ r.innerHTML=`<span>${l.t}</span><span class="given">${ctx.h.money(l.a)}</span><span class="mk"></span>`; rows[l.k]={r,l}; }
        else { r.innerHTML=`<label for="${ctx.uid(l.k)}">${l.t}</label><input id="${ctx.uid(l.k)}" type="text" inputmode="decimal" autocomplete="off" placeholder="0"><span class="mk" aria-live="polite"></span><div class="hint" hidden></div>`; rows[l.k]={r,l}; const inp=r.querySelector('input'); if(st[l.k]!=null) inp.value=st[l.k]; inp.addEventListener('input',()=>{ st[l.k]=inp.value; ctx.save(); r.classList.remove('ok','bad'); r.querySelector('.mk').textContent=''; r.querySelector('.hint').hidden=true; sums(); }); inp.addEventListener('keydown',e=>{ if(e.key==='Enter') check(); }); }
        box.appendChild(r); });
      const val=k=>{ const x=rows[k]; if(x.l.given) return x.l.a; const v=P(x.r.querySelector('input').value); return v==null?0:v; };
      const allRight=()=>L.filter(l=>l.k&&!l.given).every(l=>val(l.k)===l.a);
      function sums(){ L.filter(l=>l.sub).forEach(l=>{ const t=l.of.reduce((a,k)=>a+val(k),0); rows[l.sub].r.querySelector('[data-sum]').textContent=ctx.h.money(t); });
        const net=L.find(l=>l.sub==='net').of.reduce((a,k)=>a+val(k),0), close=42000+net, ok=allRight();
        const tie=el.querySelector('.cfb-tie'); tie.classList.toggle('ok',ok); el.querySelector('.cfb-stamp').hidden=!ok;
        el.querySelector('.cfb-txt').innerHTML=`Opening cash $42,000 ${net<0?'−':'+'} ${ctx.h.money(Math.abs(net))} = <strong>${ctx.h.money(close)}</strong> closing cash. The balance sheet says <strong>$17,900</strong>.${ok?' Every line is right, and the three statements agree.':Math.round(close)===17900?' The total ties, but at least one line is wrong: two errors are cancelling out. Check your answers.':''}`; }
      function check(){ let wrong=0; L.filter(l=>l.k&&!l.given).forEach(l=>{ const x=rows[l.k], v=val(l.k), raw=x.r.querySelector('input').value.trim(), h=x.r.querySelector('.hint'), mk=x.r.querySelector('.mk');
          if(v===l.a&&raw){ x.r.classList.add('ok'); x.r.classList.remove('bad'); mk.textContent='✓'; h.hidden=true; return; }
          wrong++; x.r.classList.add('bad'); x.r.classList.remove('ok'); mk.textContent='✗'; h.hidden=false;
          h.innerHTML=raw&&v===-l.a?'<strong>Right amount, wrong direction.</strong> Does this change use cash or provide it?':raw?'Not quite. Compare the two balance sheet figures for this line, or reread the clues.':'Fill this one in.'; });
        el.querySelector('[data-show]').style.display=wrong===0?'none':''; S.cfbChecked=true; ctx.save(); sums(); }
      el.querySelector('[data-check]').onclick=check;
      el.querySelector('[data-show]').onclick=()=>{ L.filter(l=>l.k&&!l.given).forEach(l=>{ const x=rows[l.k]; x.r.querySelector('input').value=String(l.a); st[l.k]=String(l.a); const h=x.r.querySelector('.hint'); h.hidden=false; h.innerHTML=l.hint; }); ctx.save(); check(); };
      el.querySelector('[data-reset]').onclick=()=>{ Object.keys(st).forEach(k=>delete st[k]); ctx.save(); BW.go(ctx.mod.id,ctx.mod.sections.indexOf(ctx.sec)); };
      sums(); if(S.cfbChecked&&Object.keys(st).length) check();
    }),
    K('The method, in three steps',
      `<ol>
        <li><strong>Start from profit.</strong> Add back costs that used no cash (depreciation, write-downs). Take out gains and losses that belong under investing, such as selling a machine.</li>
        <li><strong>Every other balance sheet change is a cash flow.</strong> Assets up: cash used. Liabilities up: cash kept. Put each under operating, investing or financing.</li>
        <li><strong>Check it ties.</strong> The total must equal the change in the bank balance. If it doesn't, a line is missing or has the wrong sign.</li>
       </ol>
       <p>That's also exactly how a three-statement forecast works (Module 23).</p>`),
    Q('Profit next year is $61,200, yet cash falls by $24,100. Which statement explains it best?',[
      'The business made a loss in cash terms','Operations produced plenty of cash, but even more went into machinery, repaying the bank and a dividend','Depreciation was too high','The tax bill was paid twice'],1,
      'Operating cash of $120,900 was a strong result; $80,000 went into machinery and $65,000 to the bank and the owners. Falling cash isn\'t always bad news: read where it went.')
  ]},
  {id:'runway', label:'Free cash and headroom', kind:'learn', title:'Free cash flow, headroom and the lowest point', blocks:[
    `<h3>Free cash flow</h3>
     <p><span class="term">Free cash flow</span> = cash from operations − equipment spending. It's the cash the business generates that's free to repay debt, pay dividends or save.</p>
     <p>BraceWorks: $33,000 − $60,000 = <strong>($27,000)</strong>. The business didn't fund its own investment. The bank did. One year of this is normal when you buy a machine. Several years in a row means the business is slowly borrowing to stand still.</p>
     <h3>The year-end number hides the lows</h3>
     <p>BraceWorks ended the year with $42,000. But here's the cash at each month-end:</p>`,
    W('Month-end cash at BraceWorks', function(el, ctx){
      const m=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], v=[38,31,22,35,41,18,9,48,6,24,37,42];
      el.innerHTML=ctx.ui.bars(m.map((x,i)=>({label:x,v:v[i]*1000,tone:v[i]<15?'bad':v[i]<25?'warn':''})),{max:50000})+
        `<p class="w-hint" style="margin-top:10px">Twice in the year, cash fell below $10,000, with payroll of about $24,000 a month. July followed a large foam purchase. September is the case you met in Module 1. The year-end figure looks fine; the business nearly missed payroll twice.</p>`;
    }),
    K('Liquidity headroom',
      `<p><span class="term">Headroom</span> = cash + the unused part of your borrowing facilities. It's the real measure of how much room you have.</p>
       <p>BraceWorks has a $150,000 working capital line, with $120,000 drawn. Headroom at year-end: $42,000 + $30,000 = <strong>$72,000</strong>, about three months of payroll. Ask for headroom every month, and for the <strong>lowest expected headroom over the next 13 weeks</strong>.</p>`),
    Q('BraceWorks\' operating cash flow is $33,000 and equipment purchases are $60,000. What is free cash flow, and what does it mean?',[
      '$93,000: plenty of spare cash','($27,000): the business needed outside funding to cover its investment','$33,000: equipment doesn\'t count','$60,000: the value of the machine'],1,
      'Negative free cash flow means the business consumed more cash than it generated. Borrowing filled the gap.')
  ]},
  {id:'case', label:'Case: growing broke', kind:'case', title:'Growing broke', blocks:[
    CASE('The contract everyone wants',
      `<p>An Australian hospital group offers BraceWorks a two-year supply contract: mattresses and slings worth <strong>$432,000 a year</strong>. That's about 40% more units than BraceWorks makes today. The terms:</p>
       <ul>
        <li>Price 10% below BraceWorks' list, because of the volume.</li>
        <li>Payment <strong>90 days</strong> after delivery.</li>
        <li>BraceWorks must hold six weeks of safety stock.</li>
        <li>First deliveries in two months.</li>
       </ul>
       <p>Finance runs the numbers. The contract is profitable: about <strong>$69,000 a year of extra net profit</strong> after hiring 15 people and adding a second shift. The sales team wants to sign today.</p>`),
    `<p>Now the cash view for year one:</p>`,
    FS({title:'The contract\'s cash effect in year one', rows:[
      ['Extra net profit', 69000],
      ['Extra receivables (90 days of $432,000)', -106500],
      ['Extra inventory (materials, WIP and safety stock)', -90600],
      ['Extra supplier credit (63 days of $221,000 of materials)', 38100],
      ['Second foam cutter needed for the volume', -45000],
      ['Cash needed in year one', -135000, 'sub'],
      ['Headroom available today (cash + unused overdraft)', 72000],
      ['Funding gap', -63000, 'total']
    ], note:'And this is the year-end view. In the first four months, wages and materials are paid long before the first customer payment arrives, so the peak gap is bigger.'}),
    K('This is called overtrading',
      `<p><span class="term">Overtrading</span> means growing faster than your cash can support. It's one of the most common reasons profitable small manufacturers fail. Growth needs working capital up front: stock to make the goods, and credit for the customer while you wait to be paid.</p>`),
    Q('What should BraceWorks do?',[
      {text:'Decline. It\'s too risky.', why:'The contract is profitable. Turning it down without trying to fix the cash problem leaves money on the table.'},
      {text:'Sign today and sort out the cash later', why:'This is how overtrading starts. The gap is known now, and so is the fact that headroom won\'t cover it.'},
      {text:'Negotiate first: shorter terms or a deposit, a staged ramp-up, and agree extra bank funding before signing'},
      {text:'Sign, and pay all suppliers at 120 days to fund it', why:'Stretching suppliers this far risks supply, quality priority and your reputation. It\'s a last resort, not a plan.'}
    ],2,'Each lever shrinks the gap. Payment at 60 days instead of 90 frees about $35,000. A 20% deposit on the first order brings in cash before you spend it. Ramping up over six months spreads the stock build. And an export invoice-financing line, arranged before signing, covers the rest. Banks lend far more readily against a signed contract with a hospital group than to a company already in trouble.'),
    TIP('The question to ask before every big order',
      `<p>Not just <em>"Is it profitable?"</em> but <strong>"How much cash does it need, when, and where will that cash come from?"</strong> Ask finance for a monthly cash projection of the order, from the first material purchase to the last customer payment.</p>`)
  ]},
  {id:'quiz', label:'Quiz', kind:'quiz', title:'Check your understanding', blocks:[
    Q('Why is depreciation added back to net profit in the cash flow statement?',['It\'s a source of cash','It reduced profit without any cash leaving the business','Banks require it','To reduce tax'],1,'The cash left when the machine was bought, and shows under investing. Depreciation spreads that cost but moves no money itself.'),
    Q('Receivables rose by $30,000 during the year. In the indirect cash flow, this is…',['Added to profit','Subtracted from profit','Shown under financing','Ignored'],1,'More money is owed by customers, so less was collected than was sold. Subtract it.'),
    Q('Which line on the cash flow statement should a GM look at first?',['Financing activities','Cash from operating activities','Dividends','Opening cash'],1,'Operating cash shows whether the business itself generates cash. Investing and financing show how it spends and funds itself.'),
    Q('BraceWorks has $42,000 cash and a $150,000 overdraft line with $120,000 used. What is its liquidity headroom?',['$42,000','$72,000','$150,000','$192,000'],1,'Cash plus undrawn facilities: $42,000 + $30,000 = $72,000.'),
    Q('A profitable new contract needs $135,000 of cash in year one and you have $72,000 of headroom. This is an example of…',['A liquidity crisis that has already happened','Overtrading risk','A bad contract','Normal seasonality'],1,'The business could run out of cash by growing too fast, even though the growth is profitable.'),
    Q('Operating cash flow is consistently far below EBITDA. What is the most likely cause?',['High depreciation','Working capital (receivables and inventory) keeps growing','Low interest rates','Too much cash in the bank'],1,'Low cash conversion usually means cash is being absorbed by working capital.')
  ]},
  {id:'apply', label:'Practice', kind:'apply', title:'Practise on a sample pack', blocks:[
    PACK('packC',5,'Pack C, page 5: 13-week forecast'),
    Q('Pack C\'s cash flow shows operating cash of ($36,500) against profit after tax of $34,725. What\'s the cash conversion?',['About 100%','Negative: the business used cash while making a profit','About 50%','You can\'t tell'],1,'Every dollar of profit, and more, went into receivables and stock.'),
    Q('When is liquidity lowest in the 13-week forecast, and how low?',['Week 1, $9k','Week 4, ($12k)','Week 13, $52k','Week 11'],1,'Payroll, a foam payment and quarterly tax land together in week 4.'),
    Q('The forecast recovers mainly because one receipt arrives. Which, and what if it\'s late?',['The Saudi $18k; no effect','US distributor A\'s $88k in week 11; if late, the shortfall lasts weeks longer','Tax refund; none','Overdraft increase'],1,'Forecasts that depend on one big receipt need a plan B. Here, the bank conversation should happen now.'),
    {t:'html',html:'<h3>Later, with your own report</h3><p class="small" style="color:var(--muted)">Optional. When you next read your own monthly report, use this checklist. Nothing here is shared or sent; ticks are saved only in this browser.</p>'},
    CHECK('m5-cash','My monthly pack…',[
      'Includes a cash flow statement for the month and year-to-date',
      'Explains the gap between profit and operating cash in a few lines',
      'Shows cash balances by currency and by bank account',
      'Shows overdraft and loan limits, amounts used, and headroom',
      'Includes a forward-looking cash forecast (ideally 13 weeks, week by week)',
      'Shows capital spending separately, compared with the approved budget',
      'Flags the lowest expected cash point in the coming months'
    ]),
    REPORT('Your Monday-morning question',
      `<p>Ask: <strong>"What's our lowest expected cash and headroom in the next 13 weeks, and in which week?"</strong> If nobody can answer, you're flying without a fuel gauge. Module 10 shows how to build the forecast.</p>`),
    K('Takeaways',
      `<ul>
        <li>Read operating cash flow first. It tells you whether the business funds itself.</li>
        <li>Profit becomes cash only after it gets through receivables and inventory.</li>
        <li>Free cash flow = operating cash − equipment spending. Negative for years means borrowing to stand still.</li>
        <li>Watch the lowest point and the headroom, not just the month-end balance.</li>
        <li>Before signing big growth, ask how much cash it needs and when.</li>
       </ul>`)
  ]}
  ],
  warnings:[
    {sign:'Operating cash flow well below EBITDA year after year', meaning:'Working capital is soaking up the profits.', look:'Receivables and inventory days trends.'},
    {sign:'Negative free cash flow for two years or more', meaning:'Equipment and growth are being funded by debt.', look:'Capital spending plan versus operating cash.'},
    {sign:'Headroom below one month of payroll', meaning:'Little room for a late customer payment or a big purchase.', look:'13-week cash forecast; options to increase facilities early.'},
    {sign:'Big new order with long payment terms', meaning:'Overtrading risk: growth needs cash before it pays.', look:'Cash projection of the order, month by month.'},
    {sign:'Paying suppliers later and later to stay afloat', meaning:'The business is using suppliers as a hidden bank.', look:'Payables days trend; supplier complaints and stop-supply threats.'}
  ],
  formulas:[
    {name:'Operating cash flow (indirect)', f:'Net profit + Depreciation − Increase in receivables − Increase in inventory + Increase in payables (and other working capital)', ex:'$55,500 + $38,000 − $30,000 − $45,000 + $14,500 = $33,000'},
    {name:'Free cash flow', f:'Operating cash flow − Capital expenditure', ex:'$33,000 − $60,000 = ($27,000)'},
    {name:'Cash conversion', f:'Operating cash flow ÷ EBITDA', ex:'$33,000 ÷ $132,000 = 25%'},
    {name:'Liquidity headroom', f:'Cash + Undrawn borrowing facilities', ex:'$42,000 + $30,000 = $72,000'}
  ],
  glossary:[
    {term:'Operating cash flow', def:'Cash generated by the business\'s day-to-day activities.'},
    {term:'Investing cash flow', def:'Cash spent on or received from long-term assets such as machinery.'},
    {term:'Financing cash flow', def:'Cash from or to lenders and owners: loans drawn and repaid, capital, dividends.'},
    {term:'Indirect method', def:'Cash flow presentation that starts from net profit and adjusts for non-cash items and working capital changes.'},
    {term:'Direct method', def:'Cash flow presentation showing actual receipts and payments, such as cash from customers and to suppliers.'},
    {term:'Free cash flow', def:'Operating cash flow minus capital spending. Cash free for debt repayment, dividends or saving.'},
    {term:'Cash conversion', def:'Operating cash flow as a % of EBITDA. Shows how much of operating profit becomes cash.'},
    {term:'Headroom', def:'Cash plus undrawn borrowing facilities. The real measure of financial room.'},
    {term:'Overtrading', def:'Growing faster than available cash can support, so a profitable business runs out of money.'},
    {term:'Capital expenditure (capex)', def:'Spending on long-term assets such as machines, tooling or building fit-out.'}
  ]
});
})();
