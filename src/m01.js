/* ===== Module 1: The three statements ===== */
(function(){
const {K,TIP,FLAG,CASE,REPORT,Q,FS,FLIP,SORT,CHECK,W,PACK,money,signed,pct,kfmt} = BW.h;
const D = BW.data;

BW.add({
  id:'m1', minutes:35,
  title:'The three statements',
  subtitle:"BraceWorks' year as three pictures: how much it earned, what it owns and owes, and where the cash went.",
  goals:[
    'Say in one sentence what each of the three statements tells you',
    'Explain why BraceWorks made $55,500 profit while its cash went down',
    'Trace one sale through the income statement, balance sheet and cash flow',
    'Check whether your monthly pack gives you all three pictures'
  ],
  sections:[
  /* ---------------------------------------------------------------- */
  {id:'meet', label:'Meet BraceWorks', kind:'learn', title:'Your first morning as GM', blocks:[
    `<p>It's your first day as general manager of <strong>BraceWorks Medical</strong>. The owner hands you last year's accounts and says: <em>"We were profitable. So why is the bank calling me about our overdraft?"</em></p>
     <p>By the end of this module you'll be able to answer that. First, the company:</p>`,
    {t:'tbl', head:['Product','Avg. price','Units last year','Revenue'], opts:{num:[1,2,3]}, rows:[
      ['Pressure-relief mattresses','$180','2,800','$504,000'],
      ['Patient slings','$45','7,200','$324,000'],
      ['Orthopaedic braces','$28','13,000','$364,000'],
      ['Spare covers and parts','','','$8,000'],
      {cls:'', cells:['<strong>Total</strong>','','','<strong>$1,200,000</strong>']}
    ]},
    `<ul>
      <li><strong>People:</strong> 50. That's 38 on the production line, 6 in factory support (quality, maintenance, stores, supervisors) and 6 in the office, including you.</li>
      <li><strong>Customers:</strong> about 25 distributors. 40% of sales go to the US, 35% to Europe, 25% to Australia and the Middle East. The biggest customer buys 22% of everything.</li>
      <li><strong>Quality systems:</strong> ISO 13485 certified, FDA-registered and CE-marked. Keeping those costs real money every year.</li>
      <li><strong>Money in, money out:</strong> most sales are invoiced in US dollars, some in euros. Wages, rent and power are paid in local currency.</li>
     </ul>`,
    K('Accounting is the language of the business',
      `<p>Every shipment, wage payment and machine purchase gets recorded. Accounting sorts those records into three reports, the <strong>financial statements</strong>. Each one answers a different question. A GM who reads only one of them is driving with one eye closed.</p>`),
    `<h3>The three pictures</h3><p>Tap each card.</p>`,
    FLIP([
      {f:'Income statement (P&L)', b:'<strong>Did we make money over the period?</strong> Sales minus all the costs of earning them, over a month or a year. Think of it as the scoreboard for the season.'},
      {f:'Balance sheet', b:'<strong>What do we own and owe on one day?</strong> A snapshot at a single date, such as 31 December. Think of it as a photo of the company\'s belongings and debts.'},
      {f:'Cash flow statement', b:'<strong>Where did the cash come from and go?</strong> The actual money in and out of the bank over the period. Think of it as the bank statement, explained.'}
    ]),
    TIP('A word on brackets',
      `<p>Accountants write negative numbers in brackets: <span class="num">($7,000)</span> means minus $7,000. You'll see this convention everywhere in this course and in your own reports.</p>`)
  ]},
  /* ---------------------------------------------------------------- */
  {id:'pl', label:'Picture 1: profit', kind:'learn', title:'The income statement: did we make money?', blocks:[
    `<p>The income statement (often called the <span class="term">P&amp;L</span>, for profit and loss) starts with sales at the top and subtracts costs on the way down. What's left at the bottom is profit. That's why people call profit "the bottom line".</p>`,
    FS({title:'BraceWorks Medical · Income statement', sub:'Year ended 31 December · simplified', rows:[
      ['Revenue (sales)', D.pl.revenue],
      ['Cost of goods sold', -D.pl.cogs],
      ['Gross profit', D.pl.gp, 'sub'],
      ['Operating expenses (selling, office, certifications)', -D.pl.opex],
      ['Operating profit', D.pl.ebit, 'sub'],
      ['Interest and currency losses', -(D.pl.interest+D.pl.fx)],
      ['Profit before tax', D.pl.pbt, 'sub'],
      ['Income tax', -D.pl.tax],
      ['Net profit', D.pl.net, 'total']
    ], note:'Module 3 opens up every line of this statement.'}),
    `<h3>Reading it top to bottom</h3>
     <ul>
      <li><strong>Revenue $1.2M:</strong> the value of everything BraceWorks <em>shipped</em> to customers in the year, whether or not they've paid yet.</li>
      <li><strong>Cost of goods sold $860k:</strong> what it cost to make the products that were sold. Foam, fabric, buckles, factory wages and factory running costs.</li>
      <li><strong>Gross profit $340k (28%):</strong> what's left to pay for everything else. For every $100 of sales, $28 survives the factory.</li>
      <li><strong>Operating expenses $246k:</strong> the office, sales, export paperwork and the certifications.</li>
      <li><strong>Net profit $55,500 (4.6%):</strong> what's left for the owners after interest and tax. For every $100 of sales, BraceWorks keeps $4.60.</li>
     </ul>`,
    K('Revenue is counted when you deliver, not when you get paid',
      `<p>This is called <span class="term">accrual accounting</span>. A sale counts when the goods are delivered under the shipping terms, even if the customer pays 60 days later. Costs work the same way: they count when they're incurred, not when the bill is paid. That's what makes the P&amp;L a fair score of the year's performance. It's also why the P&amp;L can't tell you how much cash you have.</p>`),
    Q('BraceWorks ships $40,000 of slings to a US distributor on 31 March. The customer pays on 30 May. When does the $40,000 appear as revenue?',
      [{text:'In March, when the goods were delivered',why:''},{text:'In May, when the cash arrived'},{text:'Half in March, half in May'},{text:'Only when the year-end audit is done'}],0,
      'Under accrual accounting, revenue follows delivery. The cash timing shows up on the balance sheet as a receivable, money a customer owes you, until May.')
  ]},
  /* ---------------------------------------------------------------- */
  {id:'bs', label:'Picture 2: position', kind:'learn', title:'The balance sheet: what we own and owe', blocks:[
    `<p>The balance sheet is a photo taken on one day. On the left are the things the business <strong>owns</strong> (assets). On the right is <strong>who paid for them</strong>: lenders and suppliers (liabilities) or the owners (equity).</p>`,
    FS({title:'BraceWorks Medical · Balance sheet', sub:'At 31 December · simplified', rows:[
      'What we own (assets)',
      ['Cash in the bank', D.bs.cash, 'ind'],
      ['Receivables: customers who owe us', D.bs.ar, 'ind'],
      ['Inventory: materials, half-made and finished goods', D.bs.inv, 'ind'],
      ['Prepayments and other', D.bs.prepay, 'ind'],
      ['Machines, equipment and fit-out (after depreciation)', D.bs.ppe, 'ind'],
      ['Total assets', D.bs.ta, 'total'],
      'Who paid for it (liabilities and equity)',
      ['Payables: suppliers and bills we owe', D.bs.ap+D.bs.accr, 'ind'],
      ['Tax owed', D.bs.taxPay, 'ind'],
      ['Bank loans', D.bs.stLoan+D.bs.ltLoan, 'ind'],
      ['Total liabilities', D.bs.tl, 'sub'],
      ['Owners\' equity', D.bs.equity, 'ind'],
      ['Total liabilities and equity', D.bs.ta, 'total']
    ]}),
    K('The accounting equation',
      `<p class="num" style="font-size:18px;font-weight:600">Assets = Liabilities + Equity</p>
       <p>Everything the business owns was paid for by someone: a lender, a supplier, or the owners. So the two sides must always be equal. That's why it's called a <em>balance</em> sheet. If yours doesn't balance, something is wrong in the books.</p>`),
    `<h3>What jumps out to a GM</h3>
     <ul>
      <li><strong>$480,000 is tied up in receivables and inventory.</strong> That's 57% of everything BraceWorks owns, and more than ten times the cash in the bank.</li>
      <li><strong>Cash is only $42,000.</strong> Payroll alone is about $24,000 a month, so that's less than two months of breathing room.</li>
      <li><strong>Bank loans are $220,000,</strong> about half of the owners' stake. Debt is useful, but it has to be repaid with cash, not profit.</li>
     </ul>`,
    SORT('Asset, liability or equity? Tap the right one for each item.',['Asset','Liability','Equity'],[
      {text:'A new sewing machine BraceWorks bought last month', a:0, why:'It\'s something the business owns and will use for years.'},
      {text:'$18,000 owed to the foam supplier, due in 45 days', a:1, why:'Money owed to someone else is a liability. This one is called a payable.'},
      {text:'Brace straps sitting in the warehouse', a:0, why:'Inventory is an asset until it\'s sold.'},
      {text:'The money the owner invested to start the company', a:2, why:'Owner investment is share capital, part of equity.'},
      {text:'$25,000 a German distributor owes for last month\'s order', a:0, why:'Money customers owe you is a receivable, an asset.'},
      {text:'Profits from past years that were kept in the business', a:2, why:'These are retained earnings. They belong to the owners, so they sit in equity.'},
      {text:'The equipment loan from the bank', a:1, why:'Borrowed money is a liability.'}
    ])
  ]},
  /* ---------------------------------------------------------------- */
  {id:'cf', label:'Picture 3: cash', kind:'learn', title:'The cash flow statement: where did the money go?', blocks:[
    `<p>Here's the owner's puzzle. BraceWorks made <strong>$55,500 profit</strong>. Yet the bank account <strong>fell by $7,000</strong>, from $49,000 to $42,000. The cash flow statement explains the gap.</p>`,
    W('Where did the $55,500 go?', function(el, ctx){
      const {money}=ctx.h;
      const ST=[
        {label:'Net profit', v:D.cf.net, total:true, say:`Start with the <strong>$55,500 profit</strong> from the income statement. If every sale had been paid in cash and every cost paid in cash, the bank balance would have grown by exactly this much. It didn't, so let's find out why.`},
        {label:'Add back depreciation', v:D.cf.dep, say:`Depreciation of <strong>$38,000</strong> reduced profit, but no money left the bank for it this year: the machines were paid for when they were bought. So we add it back. Cash so far: <strong>${money(D.cf.net+D.cf.dep)}</strong>.`},
        {label:'More cash stuck in receivables', v:D.cf.dAR, say:`Customers owe <strong>$30,000 more</strong> than a year ago. Those sales are already in profit, but the cash hasn't arrived. Take it off.`},
        {label:'More cash stuck in inventory', v:D.cf.dInv, say:`There's <strong>$45,000 more stock</strong> on the shelves. Cash was spent buying materials and making it, but it isn't sold yet, so it isn't in profit. Take it off too.`},
        {label:'More owed to suppliers and others', v:D.cf.dAP+D.cf.dAccr+D.cf.dTax, say:`BraceWorks owes suppliers, staff and the tax office <strong>$14,500 more</strong> than last year. Those costs are in profit but not paid yet, so the cash is still in our account. Add it back.`},
        {label:'Cash from operations', v:D.cf.cfo, total:true, say:`Running the business brought in <strong>$33,000</strong> of cash, not $55,500. The dark bar starts from zero again: it's a subtotal. The $22,500 difference is sitting with customers and on the shelves.`},
        {label:'Bought equipment', v:D.cf.capex, say:`A new foam-cutting machine cost <strong>$60,000</strong>. It isn't a cost in this year's profit (it will be depreciated over several years), but the cash went out all at once. Now the running total is below zero: <strong>${money(D.cf.cfo+D.cf.capex)}</strong>.`},
        {label:'Net new borrowing', v:D.cf.cff, say:`BraceWorks borrowed $40,000 more on its overdraft and repaid $20,000 of the equipment loan: <strong>$20,000</strong> net in from the bank.`},
        {label:'Change in cash', v:D.cf.change, total:true, say:`Add it all up: the bank balance <strong>fell by $7,000</strong>, from $49,000 to $42,000. Profitable, and yet poorer in cash. That's the owner's puzzle solved.`}
      ];
      let n=1;
      const top=document.createElement('div'); top.className='brs-top';
      top.innerHTML=`<button type="button" class="btn ghost small brs-back">← Back</button><span class="brs-n" aria-live="polite"></span><button type="button" class="btn small brs-next">Next step →</button><button type="button" class="linkbtn brs-all">Show all</button>`;
      const chart=document.createElement('div'), say=document.createElement('div'); say.className='brs-say'; say.setAttribute('aria-live','polite');
      const key=document.createElement('p'); key.className='brs-key'; key.innerHTML='<span class="sw up"></span>adds cash <span class="sw down"></span>takes cash away <span class="sw tot"></span>total, measured from zero <span class="sw z"></span>zero';
      el.append(top,chart,say,key);
      const all=ST.map(s=>s.v), lo=Math.min(0,...ST.reduce((acc,s)=>{ const r=s.total?s.v:(acc.length?acc[acc.length-1]:0)+s.v; acc.push(r); return acc; },[])), hi=Math.max(...ST.reduce((acc,s)=>{ const r=s.total?s.v:(acc.length?acc[acc.length-1]:0)+s.v; acc.push(r); return acc; },[]));
      const lb=ctx.ui.liveBridge(chart,{lo,hi});
      function draw(){
        lb(ST.map((s,i)=>i<n?{label:s.label,v:s.v,total:s.total,cls:i===n-1&&n<ST.length?'is-cur':''}:{label:s.label,v:0,vt:'?',cls:'is-ghost'}));
        say.innerHTML=`<p>${ST[n-1].say}</p>`;
        top.querySelector('.brs-n').textContent=`Step ${n} of ${ST.length}`;
        top.querySelector('.brs-back').disabled=n<=1; top.querySelector('.brs-next').disabled=n>=ST.length; top.querySelector('.brs-all').hidden=n>=ST.length;
      }
      top.querySelector('.brs-back').onclick=()=>{ if(n>1){ n--; draw(); } };
      top.querySelector('.brs-next').onclick=()=>{ if(n<ST.length){ n++; draw(); } };
      top.querySelector('.brs-all').onclick=()=>{ n=ST.length; draw(); };
      draw();
    }),
    `<p class="small" style="color:var(--muted);margin-top:-6px">Read it from the top. Each coloured bar starts where the one above it ended, so you can follow the running cash total down the page. Dark bars are totals measured from zero.</p>
     <h3>The three kinds of cash flow</h3>
     <ul>
      <li><strong>Operating ($33,000 in):</strong> cash from running the business. Profit, adjusted for money that got stuck in receivables and stock.</li>
      <li><strong>Investing ($60,000 out):</strong> buying equipment. BraceWorks bought a new foam-cutting machine.</li>
      <li><strong>Financing ($20,000 in):</strong> borrowing and repaying loans, or money from or to the owners. BraceWorks borrowed $40,000 more and repaid $20,000.</li>
     </ul>`,
    K('Profit is an opinion. Cash is a fact.',
      `<p>Profit depends on accounting judgements: when revenue counts, how fast machines depreciate, what stock is worth. Cash in the bank doesn't. Both matter. Profit tells you if the business model works. Cash tells you if the business survives.</p>`),
    `<p>So the answer to the owner's question: <strong>BraceWorks earned $55,500, but $75,000 went into extra receivables and inventory, and $60,000 into a machine.</strong> Borrowing covered most of the gap. That's why the bank is calling.</p>`
  ]},
  /* ---------------------------------------------------------------- */
  {id:'connect', label:'How they connect', kind:'play', title:'One event, three statements', blocks:[
    `<p>Every business event touches the statements in its own way. Some change profit but not cash. Some change cash but not profit. Tap through the events and look for the pattern.</p>`,
    W('Run a month at BraceWorks', function(el, ctx){
      const {money,signed} = ctx.h;
      const EV=[
        {k:'ship', label:'Ship a $40,000 order', desc:'BraceWorks ships 220 mattresses to a distributor in Germany. The invoice is $40,000, payable in 60 days. The mattresses cost $28,000 to make.',
         pl:[['Revenue',40000],['Cost of goods sold',-28000]], A:[['Receivables',40000],['Finished goods',-28000]], L:[], E:[['Retained profit',12000]], cf:[0,0,0],
         note:'Profit is recorded today. The cash arrives in 60 days. This gap is the reason profitable companies run short of cash.'},
        {k:'collect', label:'Customer pays $40,000', desc:'Sixty days later, the German distributor pays in full.',
         pl:[], A:[['Cash',40000],['Receivables',-40000]], L:[], E:[], cf:[40000,0,0],
         note:'No profit change. The profit was already counted when you shipped. This event is pure cash.'},
        {k:'buymat', label:'Buy $25,000 of foam on credit', desc:'Foam and fabric arrive from the supplier, with 45 days to pay.',
         pl:[], A:[['Raw materials',25000]], L:[['Payables',25000]], E:[], cf:[0,0,0],
         note:'Materials are an asset until they\'re used and sold. No expense yet, and no cash yet.'},
        {k:'paysup', label:'Pay the foam supplier', desc:'45 days later, BraceWorks pays the $25,000 invoice.',
         pl:[], A:[['Cash',-25000]], L:[['Payables',-25000]], E:[], cf:[-25000,0,0],
         note:'Cash leaves, but profit doesn\'t change. The foam reaches the P&L only when the mattresses it goes into are sold.'},
        {k:'wagesF', label:'Pay $13,000 of factory wages', desc:'The production line is paid for two weeks of sewing and assembly.',
         pl:[], A:[['Cash',-13000],['Work-in-progress',13000]], L:[], E:[], cf:[-13000,0,0],
         note:'In a factory, the wages of the people making products become part of the products\' cost. They hit the P&L when those products are sold. Module 6 shows how.'},
        {k:'wagesO', label:'Pay $8,000 of office salaries', desc:'The office team is paid for the month.',
         pl:[['Office salaries',-8000]], A:[['Cash',-8000]], L:[], E:[['Retained profit',-8000]], cf:[-8000,0,0],
         note:'Office costs aren\'t part of any product, so they hit profit straight away.'},
        {k:'machine', label:'Buy a $30,000 machine', desc:'A new quilting machine, paid in cash.',
         pl:[], A:[['Cash',-30000],['Machinery',30000]], L:[], E:[], cf:[0,-30000,0],
         note:'Profit is untouched today. The cost reaches the P&L gradually as depreciation, about $250 a month over ten years.'},
        {k:'loan', label:'Borrow $50,000', desc:'The bank lends BraceWorks $50,000 for three years.',
         pl:[], A:[['Cash',50000]], L:[['Bank loan',50000]], E:[], cf:[0,0,50000],
         note:'Cash goes up and profit doesn\'t. A loan isn\'t income, because you owe it back. Only the interest becomes an expense.'},
        {k:'dep', label:'Record $3,200 depreciation', desc:'The month\'s share of the cost of office equipment and the delivery van.',
         pl:[['Depreciation',-3200]], A:[['Equipment (net value)',-3200]], L:[], E:[['Retained profit',-3200]], cf:[0,0,0],
         note:'Depreciation is a real cost with no cash payment. The cash left when the equipment was bought.'},
        {k:'scrap', label:'Throw out $5,000 of expired stock', desc:'Brace straps past their shelf life are scrapped.',
         pl:[['Inventory write-off',-5000]], A:[['Inventory',-5000]], L:[], E:[['Retained profit',-5000]], cf:[0,0,0],
         note:'No cash moves today, because it was spent when the straps were bought. But profit drops. Repeated write-offs usually mean over-buying.'}
      ];
      const tally={}; let sel=null;
      el.innerHTML=`<p class="w-hint">Tap an event to see where it lands. Tap events in any order to build up a month.</p>
        <div class="ev-list" role="group" aria-label="Business events"></div>
        <div class="ev-show"></div>
        <div class="ev-month"></div>`;
      const list=el.querySelector('.ev-list'), show=el.querySelector('.ev-show'), month=el.querySelector('.ev-month');
      const lines=(arr)=>arr.length?arr.map(([l,v])=>`<div class="ev-line"><span>${l}</span><span class="num ${v<0?'neg':'pos'}">${signed(v)}</span></div>`).join(''):'';
      function draw(e){
        const profit=e.pl.reduce((s,x)=>s+x[1],0), cash=e.cf.reduce((s,x)=>s+x,0);
        const dA=e.A.reduce((s,x)=>s+x[1],0), dL=e.L.reduce((s,x)=>s+x[1],0), dE=e.E.reduce((s,x)=>s+x[1],0);
        show.innerHTML=`<p class="ev-desc">${e.desc}</p>
        <div class="stats" style="margin:12px 0">${ctx.ui.stat('Effect on profit',signed(profit),profit>0?'good':profit<0?'bad':'')}${ctx.ui.stat('Effect on cash',signed(cash),cash>0?'good':cash<0?'bad':'')}</div>
        <div class="ev-panels">
          <div class="ev-p"><h5>Income statement</h5>${e.pl.length?lines(e.pl)+`<div class="ev-line tot"><span>Profit</span><span class="num">${signed(profit)}</span></div>`:'<div class="ev-none">No change</div>'}</div>
          <div class="ev-p"><h5>Balance sheet</h5>
            ${e.A.length?`<div class="ev-sub">Assets</div>${lines(e.A)}`:''}
            ${e.L.length?`<div class="ev-sub">Liabilities</div>${lines(e.L)}`:''}
            ${e.E.length?`<div class="ev-sub">Equity</div>${lines(e.E)}`:''}
            <div class="ev-line tot"><span>Assets ${signed(dA)} = L+E ${signed(dL+dE)}</span><span>✓</span></div></div>
          <div class="ev-p"><h5>Cash flow</h5>${cash||e.cf.some(x=>x)?['Operating','Investing','Financing'].map((n,i)=>e.cf[i]?`<div class="ev-line"><span>${n}</span><span class="num ${e.cf[i]<0?'neg':'pos'}">${signed(e.cf[i])}</span></div>`:'').join(''):'<div class="ev-none">No cash moved</div>'}</div>
        </div>
        <div class="msg info" style="margin-top:12px">${e.note}</div>`;
      }
      function drawMonth(){
        const keys=Object.keys(tally).filter(k=>tally[k]); if(!keys.length){ month.innerHTML=''; return; }
        let p=0,c=0,n=0; keys.forEach(k=>{ const e=EV.find(x=>x.k===k); n+=tally[k]; p+=tally[k]*e.pl.reduce((s,x)=>s+x[1],0); c+=tally[k]*e.cf.reduce((s,x)=>s+x,0); });
        const gap=p-c;
        month.innerHTML=`<div style="border-top:1px dashed var(--rule-strong);padding-top:12px;display:grid;gap:10px">
          <div class="row" style="justify-content:space-between"><strong>Your month so far (${n} event${n>1?'s':''})</strong><button type="button" class="linkbtn" data-reset>Start the month again</button></div>
          <div class="stats">${ctx.ui.stat('Total profit',signed(p),p>0?'good':p<0?'bad':'')}${ctx.ui.stat('Total cash change',signed(c),c>0?'good':c<0?'bad':'')}${ctx.ui.stat('Gap: profit minus cash',signed(gap))}</div>
          <p class="w-hint">${Math.abs(gap)<1?'Profit and cash match. That rarely happens in a real month.':gap>0?'You made more profit than cash. Look at which events did that: shipping on credit, buying machines, paying for stock.':'You have more cash than profit. Borrowing and collecting old invoices do that. It feels good, but it isn\'t earnings.'}</p></div>`;
        month.querySelector('[data-reset]').onclick=()=>{ Object.keys(tally).forEach(k=>tally[k]=0); list.querySelectorAll('.cnt').forEach(x=>x.textContent=''); drawMonth(); };
      }
      EV.forEach(e=>{ const b=document.createElement('button'); b.type='button'; b.setAttribute('aria-pressed','false'); b.innerHTML=`${e.label}<span class="cnt"></span>`;
        b.onclick=()=>{ list.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed','false')); b.setAttribute('aria-pressed','true'); sel=e; tally[e.k]=(tally[e.k]||0)+1; b.querySelector('.cnt').textContent='×'+tally[e.k]; draw(e); drawMonth(); };
        list.appendChild(b); });
      show.innerHTML='<div class="ev-none" style="padding:6px 0">Pick an event above. A good first one: "Ship a $40,000 order".</div>';
    }),
    K('The pattern',
      `<ul>
        <li><strong>Changes profit but not cash:</strong> selling on credit, depreciation, write-offs.</li>
        <li><strong>Changes cash but not profit:</strong> collecting from customers, paying suppliers, buying machines, borrowing, repaying loans.</li>
        <li><strong>Changes both:</strong> cash sales, paying office costs in cash.</li>
       </ul>
       <p>A good GM asks of any big event: <em>what does this do to profit, and what does it do to cash?</em> They're often different answers.</p>`)
  ]},
  /* ---------------------------------------------------------------- */
  {id:'case', label:'Case: best month ever?', kind:'case', title:'The best month ever?', blocks:[
    CASE('Record sales, empty bank',
      `<p>September was BraceWorks' best month on record: <strong>$135,000 of sales</strong> and <strong>$14,000 net profit</strong>. The sales manager bought cakes for the office.</p>
       <p>On 1 October the accountant walks in: there's <strong>$6,000 in the bank</strong> and <strong>$21,000 of wages</strong> due on Friday.</p>`),
    FS({title:'September at a glance', cols:['Profit view','Cash view'], rows:[
      ['Sales shipped / cash collected from customers', [135000, 77000]],
      ['Cost of goods sold / paid to suppliers', [-97000, -68000]],
      ['Overheads and wages / paid', [-21000, -41000]],
      ['Interest and tax / machine deposit', [-3000, -10000]],
      ['Net profit / net cash movement', [14000, -42000], 'total']
    ], note:'Cash started the month at $48,000 and ended at $6,000.'}),
    `<p>The details, from the accountant's notes:</p>
     <ul>
      <li>A big new US customer took $60,000 of mattresses on <strong>90-day payment terms</strong>.</li>
      <li>Production bought an extra <strong>$30,000 of foam</strong> to get a 6% volume discount.</li>
      <li>A <strong>$10,000 deposit</strong> was paid on a new cutting table.</li>
     </ul>`,
    Q('What best explains why a record-profit month left the bank nearly empty?',[
      {text:'The accountant made a mistake. You can\'t have profit without cash.', why:'Profit and cash differ all the time under accrual accounting. Nothing here is a mistake.'},
      {text:'Sales were recorded but not collected, and cash went into extra stock and a machine deposit.'},
      {text:'Customers are refusing to pay. This looks like fraud.', why:'Nothing says customers won\'t pay. The US customer simply isn\'t due to pay for 90 days.'},
      {text:'Tax took most of the profit.', why:'Tax and interest together were only $3,000.'}
    ],1,'Three decisions, each sensible on its own, drained nearly $100,000 of cash: long credit terms, a bulk materials buy, and a capital purchase. None of them is visible on the P&L.'),
    `<h3>What the GM could have seen coming</h3>
     <ul>
      <li><strong>On the balance sheet:</strong> receivables up $58,000 and raw materials up $30,000 in a single month.</li>
      <li><strong>On the cash flow:</strong> operating cash flow strongly negative while profit was positive.</li>
      <li><strong>Before it happened:</strong> a 13-week cash forecast would have shown payroll at risk weeks earlier. Module 10 builds one.</li>
     </ul>`,
    K('The fix',
      `<p>Nothing BraceWorks did was wrong by itself. The mistake was making three cash-hungry decisions in the same month without looking at cash. Before agreeing to long credit terms or a bulk buy, ask: <em>"What does this do to our cash over the next 90 days?"</em></p>`)
  ]},
  /* ---------------------------------------------------------------- */
  {id:'quiz', label:'Quiz', kind:'quiz', title:'Check your understanding', blocks:[
    Q('Which statement shows what the company owns and owes on a specific date?',['Income statement','Balance sheet','Cash flow statement','Sales report'],1,'The balance sheet is a snapshot at one date. The other two cover a period of time.'),
    Q('BraceWorks pays $30,000 cash for a new machine. What happens to this year\'s profit on the day of purchase?',[
      {text:'It falls by $30,000'},{text:'Nothing. The cost is spread over the machine\'s life as depreciation.'},{text:'It rises, because assets went up'},{text:'It falls by the interest on the money'}],1,
      'Buying equipment swaps one asset (cash) for another (machinery). Profit takes the hit slowly through depreciation.'),
    Q('Total assets are $845,000 and total liabilities are $353,500. What is equity?',['$1,198,500','$491,500','$353,500','You can\'t tell without the P&L'],1,'Assets = Liabilities + Equity, so Equity = $845,000 − $353,500 = $491,500.'),
    Q('Your P&L shows a good profit, but cash keeps falling month after month. Which two places on the balance sheet do you check first?',[
      'Equity and tax owed','Receivables and inventory','Machinery and loans','Prepayments and payables'],1,
      'Receivables and inventory are where cash most often gets trapped in a manufacturer. If they\'re growing faster than sales, cash is being soaked up.'),
    Q('BraceWorks borrows $50,000 from the bank. Which is true?',[
      'Profit rises by $50,000','Cash rises and a liability rises by the same amount','Equity rises by $50,000','Nothing changes until it\'s repaid'],1,
      'A loan brings cash in and creates a debt of the same size. It\'s not income.'),
    Q('Which question is the cash flow statement best at answering?',[
      'Are our products priced well?','Where did our money come from, and where did it go?','What is the factory worth?','Which customers are most profitable?'],1,
      'It explains the movement in the bank balance, split into operating, investing and financing activities.')
  ]},
  /* ---------------------------------------------------------------- */
  {id:'apply', label:'Practice', kind:'apply', title:'Practise on a sample pack', blocks:[
    PACK('packA',2,'Pack A, page 2: the old October P&L'),
    Q('Pack A\'s commentary says "Cash is tight". What would you need to check that?',['Nothing more: the P&L shows it','A balance sheet and a cash flow statement, which Pack A doesn\'t have','A sales report','The tax return'],1,'The P&L can\'t show cash. Without the other two statements, "cash is tight" can\'t be checked or explained.'),
    PACK('packB',6,'Pack B, page 6: balance sheet and cash flow'),
    Q('What is Pack B\'s total equity at 31 March?',['$814,100','$500,950','$313,150','$491,500'],1,'Share capital $250,000 + retained earnings $250,950. Total assets $814,100 = liabilities $313,150 + equity $500,950, so it balances.'),
    Q('Retained earnings rose from $241,500 to $250,950. What should that increase equal?',['Revenue for the quarter','Profit after tax for the quarter, $9,450, as no dividends were paid','The change in cash','Depreciation'],1,'Opening + profit − dividends = closing. It ties exactly, which is a good sign.'),
    Q('Where in Pack B can you see that the overdraft was cut by $20,000?',['Only the income statement','The balance sheet (the overdraft line) and the cash flow statement (financing)','Only the dashboard','Nowhere'],1,'Financing moves cash and the balance sheet, never profit.'),
    {t:'html',html:'<h3>Later, with your own report</h3><p class="small" style="color:var(--muted)">Optional. When you next read your own monthly report, use this checklist. Nothing here is shared or sent; ticks are saved only in this browser.</p>'},
    CHECK('m1-pack','My monthly report…',[
      'Includes all three statements: income statement, balance sheet and cash flow, not just the P&L',
      'Has a balance sheet that balances: total assets equal total liabilities plus equity',
      'Shows this month and year-to-date, compared with last year or the budget',
      'Shows closing cash that matches the bank statements',
      'Has net profit that ties to the change in retained earnings on the balance sheet (after any dividends)',
      'Arrives within 10 working days of month-end'
    ]),
    REPORT('Your Monday-morning question',
      `<p>Ask your accountant: <strong>"Last month, why was our change in cash different from our profit?"</strong></p>
       <p>A good answer names three or four specific items, such as "receivables rose $20k because the US order hasn't been paid" or "we paid the machine deposit". A vague answer, or no answer, tells you the reporting needs work. Module 9 shows what good looks like.</p>`),
    K('Takeaways',
      `<ul>
        <li>The <strong>income statement</strong> scores the period. The <strong>balance sheet</strong> is a snapshot of what's owned and owed. The <strong>cash flow</strong> explains the bank balance.</li>
        <li>Revenue counts when goods are delivered, not when cash arrives. So profit and cash part ways.</li>
        <li>In a manufacturer, cash hides in <strong>receivables</strong> and <strong>inventory</strong>.</li>
        <li>Read all three statements together. Each one covers the others' blind spots.</li>
       </ul>`)
  ]}
  ],
  warnings:[
    {sign:'Profit up, cash down for two or more months', meaning:'Cash is getting trapped in receivables or inventory, or spent on equipment.', look:'Balance sheet movements in receivables and inventory; cash flow from operations.'},
    {sign:'Monthly pack has a P&L but no balance sheet or cash flow', meaning:'You\'re seeing one third of the picture. Cash problems will surprise you.', look:'Ask finance to add both statements every month.'},
    {sign:'Net profit doesn\'t match the change in retained earnings', meaning:'Unexplained adjustments, errors, or entries posted straight to equity.', look:'Ask for a reconciliation of opening to closing equity.'}
  ],
  formulas:[
    {name:'Accounting equation', f:'Assets = Liabilities + Equity', ex:'BraceWorks: $845,000 = $353,500 + $491,500'},
    {name:'Gross profit', f:'Revenue − Cost of goods sold', ex:'$1,200,000 − $860,000 = $340,000'},
    {name:'Net profit margin', f:'Net profit ÷ Revenue', ex:'$55,500 ÷ $1,200,000 = 4.6%'}
  ],
  glossary:[
    {term:'Income statement (P&L)', def:'Report of revenue, costs and profit over a period, such as a month or year.'},
    {term:'Balance sheet', def:'Snapshot on one date of what the business owns (assets) and how they were funded (liabilities and equity).'},
    {term:'Cash flow statement', def:'Report explaining the change in cash over a period, split into operating, investing and financing activities.'},
    {term:'Accrual accounting', def:'Recording revenue when earned (goods delivered) and costs when incurred, regardless of when cash moves.'},
    {term:'Revenue', def:'The value of goods delivered to customers in the period. Also called sales or turnover.'},
    {term:'Cost of goods sold (COGS)', def:'The cost of making the products that were sold in the period: materials, factory labour and factory overhead.'},
    {term:'Gross profit', def:'Revenue minus cost of goods sold. What\'s left to cover all other costs.'},
    {term:'Net profit', def:'Profit after all costs, interest and tax. The "bottom line".'},
    {term:'Asset', def:'Something the business owns or controls that will bring future benefit: cash, receivables, inventory, equipment.'},
    {term:'Liability', def:'Something the business owes to others: supplier bills, loans, tax.'},
    {term:'Equity', def:'The owners\' stake: money they put in plus profits kept in the business. Equals assets minus liabilities.'},
    {term:'Receivables', def:'Money customers owe for goods already delivered. Also called accounts receivable or debtors.'},
    {term:'Payables', def:'Money the business owes suppliers for goods or services received. Also called accounts payable or creditors.'},
    {term:'Retained earnings', def:'Cumulative profits kept in the business rather than paid out to owners. Part of equity.'},
    {term:'Depreciation', def:'Spreading the cost of equipment over its useful life as an expense. No cash moves when it\'s recorded.'}
  ]
});
})();
