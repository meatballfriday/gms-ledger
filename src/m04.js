/* ===== Module 4: The balance sheet ===== */
(function(){
const {K,TIP,FLAG,CASE,REPORT,Q,FS,FLIP,SORT,CHECK,W,PACK,money,signed,pct,kfmt} = BW.h;
const D=BW.data.bs;

BW.add({
  id:'m4', minutes:40,
  title:'The balance sheet',
  subtitle:'What BraceWorks owns and owes, what each line says about how the business is run, and how to tell if it\'s healthy.',
  goals:[
    'Read every line of a manufacturer\'s balance sheet and know what question to ask about it',
    'Tell current from non-current, and explain working capital',
    'Check liquidity and debt with four simple ratios',
    'Spot assets that are worth less than the books say'
  ],
  sections:[
  {id:'full', label:'The full balance sheet', kind:'learn', title:'BraceWorks\' full balance sheet', blocks:[
    `<p>A full balance sheet sorts assets and liabilities by <strong>how soon they turn into cash</strong>, or need cash. "Current" means within 12 months. "Non-current" means longer.</p>`,
    FS({title:'BraceWorks Medical · Balance sheet', sub:'At 31 December, with prior year', cols:['This year','Last year'], rows:[
      'Current assets',
      ['Cash', [42000,49000], 'ind'],
      ['Receivables (customers owe us)', [230000,200000], 'ind'],
      ['Inventory: raw materials', [140000,118000], 'ind'],
      ['Inventory: work-in-progress', [35000,30000], 'ind'],
      ['Inventory: finished goods', [75000,57000], 'ind'],
      ['Prepayments', [13000,13000], 'ind'],
      ['Total current assets', [535000,467000], 'sub'],
      'Non-current assets',
      ['Machinery and fit-out, at cost', [520000,460000], 'ind'],
      ['Less accumulated depreciation', [-210000,-172000], 'ind'],
      ['Net book value', [310000,288000], 'sub'],
      ['Total assets', [845000,755000], 'total'],
      'Current liabilities',
      ['Payables (suppliers)', [95000,85000], 'ind'],
      ['Accrued expenses', [30000,27000], 'ind'],
      ['Working capital loan (overdraft line)', [120000,80000], 'ind'],
      ['Tax payable', [8500,7000], 'ind'],
      ['Total current liabilities', [253500,199000], 'sub'],
      'Non-current liabilities',
      ['Equipment loan', [100000,120000], 'ind'],
      ['Total liabilities', [353500,319000], 'sub'],
      'Equity',
      ['Share capital', [250000,250000], 'ind'],
      ['Retained earnings', [241500,186000], 'ind'],
      ['Total equity', [491500,436000], 'sub'],
      ['Total liabilities and equity', [845000,755000], 'total']
    ], note:'Revenue grew from $1,100,000 to $1,200,000 (+9%) between the two years.'}),
    K('Working capital',
      `<p><span class="term">Working capital</span> = current assets − current liabilities. For BraceWorks: $535,000 − $253,500 = <strong>$281,500</strong>.</p>
       <p>It's the money tied up in running the business day to day: stock on the shelves and customers' unpaid invoices, minus what you owe suppliers. A manufacturer needs some. Too much means cash is sitting idle. Module 16 is about getting it down.</p>`),
    `<h3>Three things to notice straight away</h3>
     <ul>
      <li><strong>Equipment is 40% depreciated:</strong> $210,000 of $520,000. The factory is middle-aged, and replacement spending is coming.</li>
      <li><strong>The overdraft line jumped 50%</strong>, from $80,000 to $120,000, while long-term debt was repaid. Short-term borrowing is funding something.</li>
      <li><strong>Retained earnings rose by exactly last year's profit</strong> ($55,500). No dividends were paid, and nothing odd was posted to equity. Good.</li>
     </ul>`
  ]},
  {id:'lines', label:'Read it like a GM', kind:'learn', title:'Every line, and the question it should make you ask', blocks:[
    `<p>Accountants read the balance sheet to check it's right. A GM reads it to see how the business is being run. Tap each card for the question that line should prompt.</p>`,
    FLIP([
      {f:'Receivables $230,000', b:'<strong>Ask: who owes it, and how old is it?</strong> 70 days of sales are unpaid. If one customer owes a big chunk, or invoices are past 90 days, your profit may never turn into cash.'},
      {f:'Raw materials $140,000', b:'<strong>Ask: how many weeks of production is this?</strong> At about $46,000 of materials a month, it\'s three months\' worth. Is that a deliberate bulk buy, or poor purchasing control?'},
      {f:'Work-in-progress $35,000', b:'<strong>Ask: is anything stuck?</strong> WIP should flow through in days. If it grows, orders are waiting on parts, rework or a bottleneck.'},
      {f:'Finished goods $75,000', b:'<strong>Ask: is it all sold?</strong> Stock made for confirmed orders is fine. Stock made "just in case", or for a customer who has gone quiet, is a risk.'},
      {f:'Machinery, net $310,000', b:'<strong>Ask: what\'s near the end of its life?</strong> A machine fully depreciated on paper may still run well, or may be one breakdown from a big bill.'},
      {f:'Payables $95,000', b:'<strong>Ask: are we paying on time?</strong> Paying too early wastes cash. Paying late damages supplier trust, and can cost you priority and discounts.'},
      {f:'Overdraft line $120,000', b:'<strong>Ask: what\'s the limit, and what is it funding?</strong> Short-term debt should fund short-term needs like stock and receivables, not machines.'},
      {f:'Retained earnings $241,500', b:'<strong>Ask: does it reconcile?</strong> Opening balance + profit − dividends should equal closing. Any other movement needs an explanation.'}
    ]),
    TIP('Assets aren\'t always worth their book value',
      `<p>The balance sheet shows most assets at what they <em>cost</em>, less depreciation. That's not what you could sell them for. Inventory and receivables in particular can be worth less than the books say: stock can go obsolete, and customers can fail to pay. Accounting has rules for this, which you'll meet in the case file.</p>`)
  ]},
  {id:'health', label:'Health checks', kind:'learn', title:'Four ratios that tell you if the balance sheet is healthy', blocks:[
    `<p>You don't need dozens of ratios. These four answer the two questions a banker asks: <em>can you pay your bills this year?</em> and <em>how much do you rely on debt?</em></p>`,
    {t:'tbl', head:['Ratio','Formula','This year','Last year','Rough guide'], opts:{num:[2,3]}, rows:[
      ['<strong>Current ratio</strong>','Current assets ÷ Current liabilities','2.11','2.35','Above 1.5 is comfortable. Below 1.0 means short-term debts exceed short-term assets.'],
      ['<strong>Quick ratio</strong>','(Current assets − Inventory) ÷ Current liabilities','1.12','1.32','Above 1.0 means you could pay short-term debts without selling stock.'],
      ['<strong>Debt to equity</strong>','Bank debt ÷ Equity','0.45','0.46','Under 1.0 is moderate for a small manufacturer. Banks often set a ceiling in the loan terms.'],
      ['<strong>Net debt to EBITDA</strong>','(Bank debt − Cash) ÷ EBITDA','1.35×','–','Years of operating cash needed to repay net debt. Under 2× is usually comfortable; above 3× worries lenders.']
    ]},
    `<p>BraceWorks looks healthy on all four. So why is the bank calling? Look at the <strong>trend</strong>: the quick ratio dropped from 1.32 to 1.12 in one year, because inventory grew 22% while sales grew 9%. Ratios that look fine but are moving the wrong way are an early warning.</p>`,
    W('Liquidity check', function(el, ctx){
      const {money}=ctx.h;
      const top=document.createElement('div'), out=document.createElement('div'); el.append(top,out);
      ctx.ui.sliders(top,[
        {k:'cash',label:'Cash',min:0,max:150000,step:1000,v:42000,f:money},
        {k:'ar',label:'Receivables',min:50000,max:400000,step:5000,v:230000,f:money},
        {k:'inv',label:'Inventory',min:50000,max:450000,step:5000,v:250000,f:money},
        {k:'cl',label:'Current liabilities',min:100000,max:500000,step:5000,v:253500,f:money}
      ],(v)=>{
        const ca=v.cash+v.ar+v.inv+13000, cr=ca/v.cl, qr=(ca-v.inv)/v.cl, wc=ca-v.cl;
        const tone=x=>x>=1.5?'good':x>=1?'warn':'bad';
        out.innerHTML=`<div class="stats">${ctx.ui.stat('Current ratio',cr.toFixed(2),tone(cr))}${ctx.ui.stat('Quick ratio',qr.toFixed(2),qr>=1?'good':qr>=0.7?'warn':'bad')}${ctx.ui.stat('Working capital',money(wc),wc>0?'':'bad')}</div>
        <p class="w-hint" style="margin-top:10px">${qr<0.7?'Danger zone. Without selling stock, BraceWorks can\'t cover its short-term debts. Suppliers and the bank will get nervous.':cr>2.5&&v.inv>300000?'Ratios look strong, but much of that strength is stock. Stock only helps if it sells. Check the inventory aging.':qr<1?'Tight. Bills can be paid only if stock keeps selling and customers pay on time.':'Comfortable. Now check the trend and the quality of receivables and stock behind these numbers.'}</p>`;
      },ctx.uid);
    }),
    Q('Inventory doubles while everything else stays the same. What happens?',[
      'Both the current and quick ratios improve',
      'The current ratio improves, the quick ratio doesn\'t change, and the business has less cash',
      'Both ratios get worse',
      'Nothing, because inventory isn\'t a current asset'],1,
      'More stock makes the current ratio look stronger, but the quick ratio leaves stock out on purpose. Meanwhile, the cash to buy that stock came from somewhere. That\'s why the quick ratio is the more honest of the two for a manufacturer.')
  ]},
  {id:'compare', label:'Year on year', kind:'play', title:'What changed in a year?', blocks:[
    `<p>The best way to read a balance sheet is to compare it with the last one. Tap each line to see what its movement says about how BraceWorks was run this year. Remember: sales grew 9%.</p>`,
    W('Balance sheet movements', function(el, ctx){
      const {money,signed}=ctx.h;
      const L=[
        ['Cash',49000,42000,'Down despite a $55,500 profit. The money went into stock, receivables and a machine. Module 5 traces it.','warn'],
        ['Receivables',200000,230000,'Up 15%, against sales up 9%. Customers are paying more slowly: from 66 to 70 days. Ask for the aging report. Is one big customer slipping?','bad'],
        ['Raw materials',118000,140000,'Up 19%. Purchasing bought foam in bulk for a discount. Worth it only if the discount beats the cost of the cash it ties up.','warn'],
        ['Work-in-progress',30000,35000,'Up 17%. Small in dollars, but check for orders stuck waiting for parts or rework.','warn'],
        ['Finished goods',57000,75000,'Up 32%, the fastest-growing line on the balance sheet. Is this stock sold, or made in hope? Ask for a list of finished goods older than 90 days.','bad'],
        ['Machinery, net',288000,310000,'Up $22,000: a $60,000 foam cutter, less $38,000 depreciation. Is the new machine earning its keep? Module 14 shows how to check.',''],
        ['Payables',85000,95000,'Up 12%, roughly in line with higher purchases. Fine, as long as suppliers are paid on agreed terms.','good'],
        ['Overdraft line',80000,120000,'Up 50%. This is where the extra stock and receivables were funded. Short-term borrowing is fine for this, but check how close you are to the limit.','bad'],
        ['Equipment loan',120000,100000,'Down $20,000: scheduled repayments. On track.','good'],
        ['Equity',436000,491500,'Up exactly by the year\'s profit. No dividends, no surprises.','good']
      ];
      el.innerHTML=`<div class="tbl"><table class="grid"><thead><tr><th>Line</th><th class="v">Last year</th><th class="v">This year</th><th class="v">Change</th></tr></thead><tbody></tbody></table></div><div data-note class="msg info">Tap a line to see what it tells you.</div>`;
      const tb=el.querySelector('tbody'), note=el.querySelector('[data-note]');
      L.forEach((r,i)=>{ const tr=document.createElement('tr'); const ch=(r[2]-r[1])/r[1];
        tr.innerHTML=`<td><button type="button" class="linkbtn" style="font-size:14.5px;text-align:left">${r[0]}</button></td><td class="v">${money(r[1])}</td><td class="v">${money(r[2])}</td><td class="v ${r[4]==='bad'?'neg':r[4]==='good'?'pos':''}">${ch>=0?'+':''}${(ch*100).toFixed(0)}%</td>`;
        tr.querySelector('button').onclick=()=>{ tb.querySelectorAll('tr').forEach(x=>x.style.background=''); tr.style.background='var(--accent-soft)'; note.className='msg '+(r[4]==='bad'?'bad':r[4]==='good'?'good':r[4]==='warn'?'warn':'info'); note.innerHTML=`<strong>${r[0]}:</strong> ${r[5]||r[3]}`; };
        tb.appendChild(tr); });
    }),
    K('The rule of thumb',
      `<p>Receivables and inventory should grow roughly in line with sales. When they grow faster, cash is being absorbed. BraceWorks' sales grew 9%, but receivables plus inventory grew 18%, from $405,000 to $480,000. That's the $75,000 the owner couldn't find.</p>`)
  ]},
  {id:'equity', label:'Changes in equity', kind:'play', title:'The statement of changes in equity', blocks:[
    `<p>Full annual accounts have a fourth statement. <strong>Equity</strong> is the owners' stake in the business, and it changes for only a handful of reasons: profit or loss, dividends, owners putting money in or taking capital out, and a few gains and losses that bypass the income statement. The <span class="term">statement of changes in equity</span> lists them, so nothing can slip into equity unnoticed.</p>`,
    FS({title:'BraceWorks Medical · Statement of changes in equity', sub:'Year ended 31 December', cols:['Share capital','Retained earnings','Total equity'], rows:[
      ['At 1 January', [250000,186000,436000]],
      ['Profit for the year', [0,55500,55500], 'ind'],
      ['Dividends paid', [0,0,0], 'ind'],
      ['New shares issued', [0,0,0], 'ind'],
      ['At 31 December', [250000,241500,491500], 'total']
    ], note:'A simple year: equity grew by exactly the profit. In group accounts there are usually more columns, such as a translation reserve for foreign subsidiaries (Module 24).'}),
    `<p>Roll BraceWorks' equity forward one year. Watch which changes go through profit and which go straight to equity.</p>`,
    W('Roll equity forward', function(el,ctx){
      const top=document.createElement('div'), br=document.createElement('div'), out=document.createElement('div'); el.append(top,br,out);
      const lb=ctx.ui.liveBridge(br); let ready=false, v0={np:61200,div:20000,sh:0,fx:0};
      ctx.ui.sliders(top,[
        {k:'np',label:'Profit or loss for the year',min:-80000,max:150000,step:2500,v:61200,f:x=>ctx.h.money(x)},
        {k:'div',label:'Dividends paid to the owners',min:0,max:120000,step:5000,v:20000,f:x=>ctx.h.money(x)},
        {k:'sh',label:'New shares bought by the owners',min:0,max:100000,step:5000,v:0,f:x=>ctx.h.money(x)},
        {k:'fx',label:'Translating a foreign subsidiary (if BraceWorks had one)',min:-30000,max:30000,step:2500,v:0,f:x=>ctx.h.signed(x)}],v=>{ v0=v; if(ready) draw(); },ctx.uid);
      function draw(){ const v=v0; const close=491500+v.np-v.div+v.sh+v.fx, re=241500+v.np-v.div;
        lb([{label:'Equity at 1 January',v:491500,total:true},{label:'Profit or loss',v:v.np},{label:'Dividends',v:-v.div},{label:'New shares',v:v.sh},{label:'Currency translation (other comprehensive income)',v:v.fx},{label:'Equity at 31 December',v:close,total:true}]);
        const msgs=[];
        if(v.div>v.np) msgs.push(`<strong>Dividends exceed profit.</strong> Retained earnings fall to ${ctx.h.money(re)}. In most countries dividends can only be paid out of accumulated profits ("distributable reserves"), and many loans set a minimum net worth. Check both before agreeing.`);
        if(re<0) msgs.push('<strong>Accumulated losses.</strong> Retained earnings are negative: no dividend can legally be paid in most countries, and the bank will be watching equity closely.');
        if(v.fx) msgs.push(`The ${ctx.h.money(Math.abs(v.fx))} currency ${v.fx<0?'loss':'gain'} goes <strong>straight to equity</strong>, as other comprehensive income. It never appears in profit, which is why equity can move by more, or less, than the result.`);
        if(v.sh) msgs.push(`New capital of ${ctx.h.money(v.sh)} raises equity and cash, but it isn't income.`);
        out.innerHTML=`<div class="stats" style="margin-top:10px">${ctx.ui.stat('Equity at 31 December',ctx.h.money(close),close<491500?'warn':'good')}${ctx.ui.stat('Retained earnings',ctx.h.money(re),re<0?'bad':'')}${ctx.ui.stat('Change in the year',ctx.h.signed(close-491500),close<491500?'bad':'')}</div>${msgs.length?`<div class="msg ${re<0||v.div>v.np?'warn':'info'}" style="margin-top:10px">${msgs.join('<br>')}</div>`:''}`;
      }
      ready=true; draw();
    }),
    K('Why a GM reads it',
      `<ul>
        <li><strong>Dividends have limits.</strong> Most countries allow dividends only out of accumulated profits, and many loan agreements restrict them.</li>
        <li><strong>Covenants often use equity.</strong> A minimum net worth, or debt to equity, is common. A big loss or dividend can breach it.</li>
        <li><strong>Equity should move by profit, minus dividends, plus new capital.</strong> If it moves by more, something went straight to equity: currency, pension changes, or corrections of past errors. Module 22 shows a real company whose equity fell more than twice as fast as its reported loss.</li>
       </ul>`),
    Q('Suppose next year BraceWorks makes a profit of $40,000 and pays a $25,000 dividend. What will retained earnings be at year-end?',['$241,500','$256,500','$281,500','$306,500'],1,'$241,500 + $40,000 − $25,000 = $256,500. The dividend comes out of retained earnings; share capital doesn\'t change.'),
    Q('A company\'s equity fell by $115 million in a year when its reported loss was $46 million. Where do you look first?',['The income statement','The statement of changes in equity','The cash flow statement','The auditor\'s fees'],1,'It lists every change in equity, including losses that bypassed the income statement and any dividends or buybacks.')
  ]},
  {id:'case', label:'Case: the full warehouse', kind:'case', title:'The warehouse full of money', blocks:[
    CASE('Is the stock really worth $250,000?',
      `<p>The bank asks for an inventory and receivables review before renewing the overdraft line. You walk the warehouse with the stores supervisor and the accountant. Here's what you find:</p>
       <ul>
        <li><strong>2,400 old-model wrist braces</strong>, cost $15,600. The design was updated last year. Distributors will only take them at half price.</li>
        <li><strong>Adhesive pads and latex components past their shelf life</strong>, cost $7,400. Can't be used in medical devices.</li>
        <li><strong>Custom-labelled slings</strong> made for a distributor that went bankrupt, cost $11,200. Relabelling and repacking will cost about $6,000.</li>
       </ul>
       <p>And in receivables: <strong>$28,000 owed by a Middle East distributor</strong>, now 210 days overdue. They've stopped answering emails.</p>`),
    K('The accounting rule: be prudent',
      `<p>Accounting standards require assets to be shown at no more than they're likely to bring in.</p>
       <ul>
        <li><strong>Inventory</strong> is valued at the <em>lower</em> of what it cost and what you can sell it for, after selling costs. This is called <span class="term">net realisable value</span>.</li>
        <li><strong>Receivables</strong> need an <span class="term">allowance for doubtful debts</span> for amounts that probably won't be collected.</li>
       </ul>
       <p>Losses are recognised as soon as they're likely. Gains aren't counted until they happen.</p>
       <p class="small"><strong>Note on standards:</strong> companies using full PFRS or IFRS (standard 9) go further, providing for <em>expected</em> credit losses on all receivables, even current ones, usually as a small percentage by aging bucket. The simpler SME standards provide only when there's evidence of a loss. Your auditor will tell you which applies (Module 18).</p>`),
    SORT('How much should each item be written down?',['Nothing','About half','All of it'],[
      {text:'Old-model wrist braces, cost $15,600, sellable at half price', a:1, why:'Selling value is about $7,800, so write down roughly $7,800 to $9,000, depending on selling costs.'},
      {text:'Expired adhesive and latex parts, cost $7,400', a:2, why:'They can\'t legally be used, so they\'re worth nothing.'},
      {text:'Custom slings, cost $11,200, need $6,000 of relabelling to sell', a:1, why:'If they can sell for close to cost after $6,000 of rework, the write-down is about $6,000.'},
      {text:'Foam bought in bulk last month, in good condition', a:0, why:'Slow, perhaps, but not impaired. It will be used at full value.'},
      {text:'$28,000 owed by a silent distributor, 210 days overdue', a:2, why:'Most companies would provide for most or all of this. Keep chasing it. If it\'s collected later, the provision is reversed.'}
    ]),
    `<h3>The effect on BraceWorks</h3>`,
    FS({title:'Clean-up adjustments', rows:[
      ['Inventory write-downs (braces $9,000, expired parts $7,400, slings $6,000)', -22400],
      ['Allowance for the doubtful debt (75% of $28,000)', -21000],
      ['Total charge against profit', -43400, 'sub'],
      ['Profit before tax, before clean-up', 74000],
      ['Profit before tax, after clean-up', 30600, 'total']
    ]}),
    Q('The accountant suggests leaving these out "until we\'re sure", because the bank review is next month. What do you do?',[
      {text:'Agree. Waiting keeps the numbers strong for the bank.', why:'Delaying known losses misleads the bank and makes next year look worse. If the bank finds them, trust is gone.'},
      {text:'Record the write-downs now, show them as a one-off, and explain the causes and fixes to the bank'},
      {text:'Record only the receivable, because inventory might still sell', why:'The inventory losses are just as known. Prudence applies to both.'},
      {text:'Move the stock to a separate warehouse so it isn\'t counted', why:'Moving stock doesn\'t change what it\'s worth, and this would be misleading.'}
    ],1,'Banks see write-downs all the time. What worries them is surprises. Showing them as a clearly explained one-off, with what you\'re changing to prevent it, builds credibility.'),
    K('The real fix is upstream',
      `<p>Each write-down has a cause. Old braces: no plan to run down stock before a design change. Expired parts: no first-in, first-out control on shelf-life items. Custom slings: no deposit or credit check on a custom order. The bad debt: no credit limit and no action at 60 days. Modules 7, 10 and 18 build the reports and controls that catch these early.</p>`)
  ]},
  {id:'quiz', label:'Quiz', kind:'quiz', title:'Check your understanding', blocks:[
    Q('What does "current" mean on a balance sheet?',['Recorded this month','Expected to turn into cash, or be paid, within 12 months','Valued at today\'s market price','In the local currency'],1,'Current assets and liabilities are those due within one year.'),
    Q('BraceWorks\' current assets are $535,000 and current liabilities $253,500. What is working capital?',['$788,500','$281,500','$2.11','$535,000'],1,'$535,000 − $253,500 = $281,500. The current ratio is 2.11.'),
    Q('Why is the quick ratio often more useful than the current ratio for a manufacturer?',[
      'It includes machinery','It leaves out inventory, which may be slow to turn into cash','It is required by banks','It includes next year\'s sales'],1,'Stock can be slow-moving or obsolete. The quick ratio tests whether you can pay bills without relying on it.'),
    Q('Sales grew 9%. Receivables grew 15% and inventory 22%. What does this suggest?',[
      'The business is managing cash very well','Cash is being absorbed faster than the business is growing','Profit must be overstated','Nothing; these always move together'],1,'When working capital grows faster than sales, it soaks up cash. Find out why: slower payers, bulk buying, or unsold stock.'),
    Q('Old stock that cost $10,000 can now only be sold for $4,000. What value goes on the balance sheet?',['$10,000','$4,000 less any selling costs','$7,000','$0'],1,'Inventory is valued at the lower of cost and net realisable value: what you\'ll get for it after selling costs.'),
    Q('A machine is fully depreciated on the balance sheet. What does that mean?',[
      'It has stopped working','Its whole cost has been charged to profit over the years. It may still be running well.','It must be sold','It was sold last year'],1,'Depreciation is an accounting estimate, not a measure of condition. Fully depreciated machines that still run are common, but they\'re signs that replacement spending may be near.')
  ]},
  {id:'apply', label:'Practice', kind:'apply', title:'Practise on a sample pack', blocks:[
    PACK('packC',4,'Pack C, page 4: balance sheet'),
    Q('What is Pack C\'s quick ratio at 31 July? (Current assets $620,500, inventory $296,000, current liabilities $303,075.)',['2.05','1.07','0.53','0.03'],1,'($620,500 − $296,000) ÷ $303,075 = 1.07, slightly below December\'s 1.12. The current ratio of 2.05 looks comfortable only because of stock, and only $10,500 of the current assets is cash.'),
    Q('Since December, receivables are up 31% and inventory 18%, while year-to-date sales are only 2% above budget. What does that tell you?',['The business is growing healthily','Working capital is absorbing cash much faster than the business is growing','Profit is overstated','Nothing'],1,'This is exactly where the $72,000 and $46,000 of cash went.'),
    Q('Which balance sheet item most likely needs a provision?',['Equipment','Receivables: US distributor B has $10k over 90 days and is drifting','Prepayments','Share capital'],1,'Old, worsening debts need an allowance for doubtful debts (Module 4).'),
    {t:'html',html:'<h3>Later, with your own report</h3><p class="small" style="color:var(--muted)">Optional. When you next read your own monthly report, use this checklist. Nothing here is shared or sent; ticks are saved only in this browser.</p>'},
    CHECK('m4-bs','My monthly balance sheet…',[
      'Shows comparatives: last month-end and last year-end',
      'Splits inventory into raw materials, work-in-progress and finished goods',
      'Comes with a receivables aging report (current, 30, 60, 90+ days)',
      'Comes with an inventory aging or slow-moving stock list',
      'Shows an allowance for doubtful debts and a provision for obsolete stock, even if small',
      'Shows how much of the overdraft or working capital line is used, and the limit',
      'Lists loan repayments due in the next 12 months',
      'Includes a few ratios, such as current and quick ratio, with the trend'
    ]),
    REPORT('Your Monday-morning question',
      `<p>Ask: <strong>"Which items in inventory haven't moved in 6 months, and which customers owe us money that's over 60 days old?"</strong> Those two lists are where balance sheet surprises come from.</p>`),
    K('Takeaways',
      `<ul>
        <li>The balance sheet shows how the business is being run: how fast customers pay, how much stock you hold, how you\'re funded.</li>
        <li>Compare it with last year and with sales growth. Receivables and inventory shouldn't grow faster than sales.</li>
        <li>Current ratio, quick ratio, debt to equity and net debt to EBITDA cover most of what a banker checks.</li>
        <li>Book values can be too high. Insist on regular reviews of old stock and overdue receivables.</li>
       </ul>`)
  ]}
  ],
  warnings:[
    {sign:'Receivables growing faster than sales', meaning:'Customers paying slower, a disputed invoice, or a customer in trouble.', look:'Receivables aging report; days sales outstanding by customer.'},
    {sign:'Inventory growing faster than sales', meaning:'Bulk buying, overproduction, or stock that isn\'t selling.', look:'Inventory aging; split by raw materials, WIP and finished goods.'},
    {sign:'Quick ratio falling below 1.0', meaning:'Short-term debts can only be paid if stock sells.', look:'Cash forecast and overdraft headroom.'},
    {sign:'Overdraft rising while long-term debt is repaid', meaning:'Short-term money funding stock build-up or capital spending.', look:'Cash flow statement: what did the borrowing pay for?'},
    {sign:'No obsolete-stock or bad-debt provision, ever', meaning:'Assets are probably overstated. A big write-off is coming.', look:'Ask for the provisioning policy and the last stock review.'}
  ],
  formulas:[
    {name:'Working capital', f:'Current assets − Current liabilities', ex:'$535,000 − $253,500 = $281,500'},
    {name:'Current ratio', f:'Current assets ÷ Current liabilities', ex:'$535,000 ÷ $253,500 = 2.11'},
    {name:'Quick ratio', f:'(Current assets − Inventory) ÷ Current liabilities', ex:'($535,000 − $250,000) ÷ $253,500 = 1.12'},
    {name:'Debt to equity', f:'Bank debt ÷ Total equity', ex:'$220,000 ÷ $491,500 = 0.45'},
    {name:'Net debt to EBITDA', f:'(Bank debt − Cash) ÷ EBITDA', ex:'($220,000 − $42,000) ÷ $132,000 = 1.35×'}
  ],
  glossary:[
    {term:'Other comprehensive income (OCI)', def:'Gains and losses that go straight to equity instead of through profit, such as translating a foreign subsidiary\'s accounts.'},
    {term:'Distributable reserves', def:'The accumulated profits a company is legally allowed to pay out as dividends.'},
    {term:'Current assets', def:'Assets expected to turn into cash within 12 months: cash, receivables, inventory, prepayments.'},
    {term:'Non-current assets', def:'Assets used over more than a year, such as machinery and buildings. Also called fixed assets.'},
    {term:'Current liabilities', def:'Debts due within 12 months: payables, accruals, overdrafts, tax.'},
    {term:'Working capital', def:'Current assets minus current liabilities. The money tied up in day-to-day operations.'},
    {term:'Net book value', def:'An asset\'s cost minus accumulated depreciation. Not the same as its market value.'},
    {term:'Net realisable value (NRV)', def:'What inventory can be sold for, minus the costs of finishing and selling it.'},
    {term:'Allowance for doubtful debts', def:'A reduction in receivables for amounts unlikely to be collected. Also called a bad debt provision.'},
    {term:'Inventory write-down', def:'Reducing the book value of stock that is damaged, expired or obsolete. Charged against profit.'},
    {term:'Prudence', def:'Accounting principle: recognise likely losses early, and don\'t count gains until they\'re realised.'},
    {term:'Net debt', def:'Total bank borrowings minus cash.'},
    {term:'Covenant', def:'A condition in a loan agreement, such as a maximum debt ratio, that the borrower must meet.'},
    {term:'Current ratio', def:'Current assets divided by current liabilities. A test of short-term solvency.'},
    {term:'Quick ratio', def:'Current assets excluding inventory, divided by current liabilities. Also called the acid test.'}
  ]
});
})();
