/* ===== Module 2: Bookkeeping basics ===== */
(function(){
const {K,TIP,FLAG,CASE,REPORT,Q,FS,FLIP,SORT,CHECK,W,PACK,money,signed,pct,kfmt} = BW.h;

BW.add({
  id:'m2', minutes:45,
  title:'Bookkeeping basics',
  subtitle:'Where every number in your report comes from. You\'ll post a month of real transactions yourself, then never need to again.',
  goals:[
    'Follow a transaction from invoice to financial statements',
    'Use debits and credits correctly for the common transactions',
    'Read a trial balance and know why it must balance',
    'Explain accruals, and why the month-end close decides how good your report is'
  ],
  sections:[
  {id:'chain', label:'From invoice to report', kind:'learn', title:'From an invoice to your monthly report', blocks:[
    `<p>Every figure in your monthly pack started life as a piece of paper or a screen: a sales invoice, a supplier bill, a payslip, a bank transfer. Bookkeeping is the system that turns thousands of these into three statements.</p>
     <p>You don't need to do it. But you need to know how it works, for two reasons. First, when a number looks wrong, you'll know where to dig. Second, <strong>the quality of your report can never be better than the quality of the bookkeeping underneath it.</strong></p>
     <h3>The five steps</h3>
     <ol>
      <li><strong>Source document.</strong> Something happens and leaves evidence: an invoice, a delivery note, a bank statement line.</li>
      <li><strong>Journal entry.</strong> The bookkeeper records it in the accounting system, choosing which accounts it affects.</li>
      <li><strong>General ledger.</strong> The system sorts every entry into its account, so you can see the running total of Cash, Sales, Wages and so on.</li>
      <li><strong>Trial balance.</strong> A list of every account's balance at month-end. Total debits must equal total credits.</li>
      <li><strong>Financial statements.</strong> The trial balance is arranged into the income statement and balance sheet, and the cash flow is derived from them.</li>
     </ol>`,
    K('The chart of accounts',
      `<p>Every business has a list of the accounts it uses, called the <span class="term">chart of accounts</span>. Most follow the same numbering logic:</p>`),
    {t:'tbl', head:['Number range','Account type','BraceWorks examples'], rows:[
      ['1000–1999','Assets','1010 Bank (USD) · 1020 Bank (EUR) · 1200 Receivables · 1310 Raw materials · 1320 Work-in-progress · 1330 Finished goods · 1500 Machinery'],
      ['2000–2999','Liabilities','2100 Payables · 2200 Accrued expenses · 2300 Customer deposits · 2500 Bank loans'],
      ['3000–3999','Equity','3100 Share capital · 3200 Retained earnings'],
      ['4000–4999','Revenue','4010 Sales: mattresses · 4020 Sales: slings · 4030 Sales: braces · 4900 Returns and credit notes'],
      ['5000–5999','Cost of goods sold','5100 Materials · 5200 Direct labour · 5300 Factory overhead · 5400 Scrap and rework'],
      ['6000–7999','Operating expenses','6100 Freight out · 6200 Commissions · 7100 Office salaries · 7300 Certifications']
    ]},
    TIP('Why this matters to you',
      `<p>The chart of accounts decides what your reports <em>can</em> show. If there's one account called "Sales", you can never see margin by product. If scrap is mixed into "Materials", you can never see what scrap costs you. When your report can't answer a question, the fix often starts here. Ask finance for separate accounts for what you want to manage.</p>`)
  ]},
  {id:'drcr', label:'Debits and credits', kind:'learn', title:'Debits and credits, without the tears', blocks:[
    `<p>Bookkeeping uses <span class="term">double entry</span>. Every transaction touches at least two accounts, and the amounts on each side are equal. That's what keeps the accounting equation in balance.</p>
     <p>The two sides are called <strong>debit</strong> (written Dr, the left side) and <strong>credit</strong> (Cr, the right side). Forget the everyday meaning of "credit". Here they're just left and right.</p>`,
    {t:'tbl', head:['Account type','A debit…','A credit…'], rows:[
      ['<strong>Assets</strong> (cash, receivables, stock, machines)','increases it','decreases it'],
      ['<strong>Expenses</strong> (wages, materials used, rent)','increases it','decreases it'],
      ['<strong>Liabilities</strong> (payables, loans)','decreases it','increases it'],
      ['<strong>Equity</strong> (capital, retained profit)','decreases it','increases it'],
      ['<strong>Revenue</strong> (sales)','decreases it','increases it']
    ]},
    K('A memory trick: DEALER (DEA | LER)',
      `<p><strong>D</strong>ividends, <strong>E</strong>xpenses, <strong>A</strong>ssets grow with a <strong>debit</strong>. <strong>L</strong>iabilities, <strong>E</strong>quity, <strong>R</strong>evenue grow with a <strong>credit</strong>.</p>
       <p>So when cash comes in, you <em>debit</em> cash. When you make a sale, you <em>credit</em> sales.</p>`),
    TIP('"But my bank credits my account when money comes in!"',
      `<p>True, and it confuses everyone. Your bank statement is written from the <em>bank's</em> point of view. To the bank, your deposit is money it owes you, a liability, so it credits it. In your books, the same cash is your asset, so you debit it.</p>`),
    `<h3>Worked example</h3>
     <p>BraceWorks buys $9,000 of nylon webbing on 30-day credit. Two accounts change: Inventory goes up (an asset, so debit) and Payables go up (a liability, so credit).</p>`,
    {t:'tbl', head:['Account','Debit','Credit'], opts:{num:[1,2]}, rows:[
      ['Inventory: raw materials','$9,000',''],
      ['&nbsp;&nbsp;&nbsp;&nbsp;Accounts payable','','$9,000']
    ]},
    `<p class="small" style="color:var(--muted)">Convention: the credit line is indented under the debit. Debits always equal credits.</p>`,
    SORT('Does this account go UP with a debit or a credit?',['Debit','Credit'],[
      {text:'Cash in the bank', a:0, why:'Cash is an asset. Assets increase with debits.'},
      {text:'Sales revenue', a:1, why:'Revenue increases with credits.'},
      {text:'Wages expense', a:0, why:'Expenses increase with debits.'},
      {text:'Bank loan', a:1, why:'Loans are liabilities. Liabilities increase with credits.'},
      {text:'Raw materials inventory', a:0, why:'Inventory is an asset.'},
      {text:'Money owed to suppliers (payables)', a:1, why:'Payables are liabilities.'},
      {text:'Share capital the owner invested', a:1, why:'Equity increases with credits.'},
      {text:'Customer receivables', a:0, why:'Receivables are assets.'}
    ])
  ]},
  {id:'journal', label:'Post a month', kind:'play', title:'Post a month of transactions', blocks:[
    `<p>The owner sets up a small sister business, <strong>BraceWorks Straps</strong>, to make sling straps. You're the bookkeeper for its first month. For each transaction, pick the account to debit and the account to credit. The trial balance builds as you go.</p>`,
    W('The journal', function(el, ctx){
      const {money}=ctx.h;
      const ACC=['Cash','Accounts receivable','Inventory','Equipment','Accumulated depreciation','Accounts payable','Bank loan','Share capital','Sales revenue','Cost of goods sold','Wages expense','Rent expense','Depreciation expense'];
      const TX=[
        {d:'1 Oct', t:'The owner puts $50,000 into the business bank account.', amt:50000, dr:0, cr:7, why:'Cash (asset) goes up: debit. The owner\'s investment is share capital (equity), which goes up: credit.'},
        {d:'2 Oct', t:'Buy two industrial sewing machines for $18,000, paid by bank transfer.', amt:18000, dr:3, cr:0, why:'Equipment (asset) goes up: debit. Cash goes down: credit. Swapping one asset for another.'},
        {d:'4 Oct', t:'Webbing and buckles arrive from a supplier: $9,000 on 30-day credit.', amt:9000, dr:2, cr:5, why:'Inventory goes up: debit. You now owe the supplier, so payables go up: credit.'},
        {d:'10 Oct', t:'Borrow $10,000 from the bank.', amt:10000, dr:0, cr:6, why:'Cash up: debit. Loan (liability) up: credit.'},
        {d:'15 Oct', t:'Ship straps to BraceWorks\' customers and invoice $14,000, payable in 30 days.', amt:14000, dr:1, cr:8, why:'Customers now owe you: receivables up, debit. You\'ve earned revenue: sales up, credit.'},
        {d:'15 Oct', t:'The straps you shipped cost $7,000 in materials. Move that cost out of inventory.', amt:7000, dr:9, cr:2, why:'Cost of goods sold (expense) up: debit. Inventory down: credit. This matches the cost to the sale.'},
        {d:'25 Oct', t:'A customer pays $10,000 of what it owes.', amt:10000, dr:0, cr:1, why:'Cash up: debit. Receivables down: credit. No revenue here, as it was already recorded on 15 Oct.'},
        {d:'28 Oct', t:'Pay the supplier $6,000 of the $9,000 owed.', amt:6000, dr:5, cr:0, why:'Payables down: debit. Cash down: credit.'},
        {d:'30 Oct', t:'Pay October wages of $4,000.', amt:4000, dr:10, cr:0, why:'Wages expense up: debit. Cash down: credit. (In a bigger factory, these wages would go into product cost. Module 6 explains.)'},
        {d:'31 Oct', t:'Pay October workshop rent of $1,500.', amt:1500, dr:11, cr:0, why:'Rent expense up: debit. Cash down: credit.'},
        {d:'31 Oct', t:'Record one month of depreciation on the sewing machines: $300.', amt:300, dr:12, cr:4, why:'Depreciation expense up: debit. Accumulated depreciation, a negative asset that reduces the machines\' value, goes up: credit. No cash moves.'}
      ];
      let n=Math.min(ctx.state.m2j||0, TX.length);
      const opt='<option value="">Choose an account…</option>'+ACC.map((a,i)=>`<option value="${i}">${a}</option>`).join('');
      el.innerHTML=`<div class="row" style="justify-content:space-between"><span class="eyebrow" data-step></span><button type="button" class="linkbtn" data-restart>Start the month again</button></div>
        <div data-card></div>
        <div data-journal></div>
        <div data-tb></div>
        <div data-fin></div>`;
      const step=el.querySelector('[data-step]'), card=el.querySelector('[data-card]'), jr=el.querySelector('[data-journal]'), tbEl=el.querySelector('[data-tb]'), fin=el.querySelector('[data-fin]');
      function balances(k){ const b=ACC.map(()=>0); TX.slice(0,k).forEach(x=>{ b[x.dr]+=x.amt; b[x.cr]-=x.amt; }); return b; }
      function drawCard(){
        if(n>=TX.length){ step.textContent='All 11 entries posted'; card.innerHTML=`<div class="msg good"><strong>Month closed.</strong> Every debit has a matching credit, so the trial balance balances. Below, the trial balance is turned into the two main statements.</div>`; return; }
        const x=TX[n]; step.textContent=`Entry ${n+1} of ${TX.length}`;
        card.innerHTML=`<div class="stat" style="background:var(--paper)"><div class="stat-l">${x.d}</div><div style="font-size:16.5px;margin:2px 0 6px">${x.t}</div><div class="stat-v">${money(x.amt)}</div></div>
          <div class="ctrls" style="margin-top:12px">
            <div class="ctrl"><label for="${ctx.uid('dr'+n)}"><span>Debit (left side)</span></label><select class="search" id="${ctx.uid('dr'+n)}" data-dr>${opt}</select></div>
            <div class="ctrl"><label for="${ctx.uid('cr'+n)}"><span>Credit (right side)</span></label><select class="search" id="${ctx.uid('cr'+n)}" data-cr>${opt}</select></div>
          </div>
          <div class="row" style="margin-top:12px"><button type="button" class="btn small" data-post>Post entry</button><button type="button" class="btn ghost small" data-show>Show me the answer</button></div>
          <div data-fb style="margin-top:10px"></div>`;
        const dr=card.querySelector('[data-dr]'), cr=card.querySelector('[data-cr]'), fb=card.querySelector('[data-fb]');
        const accept=(msg)=>{ fb.innerHTML=`<div class="msg good">${msg} ${x.why}</div><div class="row" style="margin-top:10px"><button type="button" class="btn small" data-next>${n+1<TX.length?'Next entry':'Close the month'}</button></div>`; card.querySelector('[data-post]').disabled=true; card.querySelector('[data-show]').disabled=true; dr.disabled=true; cr.disabled=true; n++; ctx.state.m2j=n; ctx.save(); drawBooks(); fb.querySelector('[data-next]').onclick=()=>{ drawCard(); }; };
        card.querySelector('[data-post]').onclick=()=>{
          const d=dr.value===''?null:+dr.value, c=cr.value===''?null:+cr.value;
          if(d===null||c===null){ fb.innerHTML='<div class="msg warn">Pick one account for each side first.</div>'; return; }
          if(d===x.dr&&c===x.cr) return accept('<strong>Correct, and posted.</strong>');
          let m;
          if(d===x.cr&&c===x.dr) m='Right accounts, wrong sides. Check which one is going up, and whether it\'s an asset or expense (debit to increase) or a liability, equity or revenue (credit to increase).';
          else if(d===x.dr) m='Your debit is right. Think again about the credit: where did the value come from?';
          else if(c===x.cr) m='Your credit is right. Think again about the debit: what did the business receive or what cost was incurred?';
          else m='Not quite. Ask: which two accounts change? Then: is each one going up or down?';
          fb.innerHTML=`<div class="msg bad">${m}</div>`;
        };
        card.querySelector('[data-show]').onclick=()=>{ dr.value=String(x.dr); cr.value=String(x.cr); accept(`<strong>Answer: Dr ${ACC[x.dr]}, Cr ${ACC[x.cr]}.</strong>`); };
      }
      function drawBooks(){
        if(n===0){ jr.innerHTML=''; tbEl.innerHTML=''; fin.innerHTML=''; return; }
        jr.innerHTML=`<h4 style="margin:4px 0 8px">Journal</h4>`+ctx.ui.table(['Date','Account','Debit','Credit'],
          TX.slice(0,n).flatMap(x=>[[x.d,ACC[x.dr],money(x.amt),''],['', '&nbsp;&nbsp;&nbsp;&nbsp;'+ACC[x.cr],'',money(x.amt)]]),{num:[2,3]});
        const b=balances(n); let td=0,tc=0;
        const rows=ACC.map((a,i)=>{ if(!b[i]) return null; const dv=b[i]>0?b[i]:0, cv=b[i]<0?-b[i]:0; td+=dv; tc+=cv; return [a,dv?money(dv):'',cv?money(cv):'']; }).filter(Boolean);
        rows.push({cls:'',cells:['<strong>Totals</strong>',`<strong>${money(td)}</strong>`,`<strong>${money(tc)}</strong>`]});
        tbEl.innerHTML=`<h4 style="margin:4px 0 8px">Trial balance ${td===tc?'<span class="pos small">· balances ✓</span>':''}</h4>`+ctx.ui.table(['Account','Debit','Credit'],rows,{num:[1,2]});
        if(n<TX.length){ fin.innerHTML=''; return; }
        const rev=-b[8], cogs=b[9], wages=b[10], rent=b[11], dep=b[12], profit=rev-cogs-wages-rent-dep;
        fin.innerHTML=`<div style="display:grid;gap:12px;grid-template-columns:repeat(auto-fit,minmax(260px,1fr))">`+
          BW.fsHTML({title:'Income statement · October',rows:[['Sales revenue',rev],['Cost of goods sold',-cogs],['Gross profit',rev-cogs,'sub'],['Wages',-wages],['Rent',-rent],['Depreciation',-dep],['Net profit',profit,'total']]})+
          BW.fsHTML({title:'Balance sheet · 31 October',rows:['Assets',['Cash',b[0],'ind'],['Receivables',b[1],'ind'],['Inventory',b[2],'ind'],['Equipment, net',b[3]+b[4],'ind'],['Total assets',b[0]+b[1]+b[2]+b[3]+b[4],'total'],'Liabilities and equity',['Payables',-b[5],'ind'],['Bank loan',-b[6],'ind'],['Share capital',-b[7],'ind'],['October profit',profit,'ind'],['Total',-b[5]-b[6]-b[7]+profit,'total']]})+
          `</div><div class="msg info" style="margin-top:12px">Notice: <strong>profit was ${money(profit)}</strong>, but cash went from $0 to <strong>${money(b[0])}</strong>, mostly because of the owner's money and the loan. And $4,000 of profit is still sitting in receivables. Module 1's lesson, now in your own books.</div>`;
      }
      el.querySelector('[data-restart]').onclick=()=>{ n=0; ctx.state.m2j=0; ctx.save(); drawCard(); drawBooks(); };
      drawCard(); drawBooks();
    }),
    TIP('You won\'t do this in real life',
      `<p>Accounting software does most of this automatically. When your team raises a sales invoice, the system posts Dr Receivables, Cr Sales by itself. What the software can't do is judge which account is right for unusual items. That's where mistakes creep in.</p>`)
  ]},
  {id:'close', label:'The month-end close', kind:'learn', title:'The month-end close: where report quality is decided', blocks:[
    `<p>Before the trial balance becomes your monthly report, the finance team should do a set of adjustments called the <span class="term">month-end close</span>. Skipping them is the most common reason small-company reports are unreliable.</p>`,
    {t:'tbl', head:['Close step','What it means','What goes wrong if skipped'], rows:[
      ['<strong>Bank reconciliation</strong>','Match every line in the bank statement to the books.','Missing payments, double entries, even theft go unnoticed.'],
      ['<strong>Accruals</strong>','Record costs incurred this month that haven\'t been billed yet: power, freight, overtime.','This month looks too profitable, next month too poor.'],
      ['<strong>Prepayments</strong>','Spread costs paid in advance, like annual insurance or ISO audit fees, over the months they cover.','One month takes a big hit, the others look too good.'],
      ['<strong>Depreciation</strong>','Charge the month\'s share of equipment cost.','Profit is overstated every month, then a big catch-up at year-end.'],
      ['<strong>Inventory</strong>','Confirm stock quantities and value. Count or reconcile with the stock system.','Cost of goods sold is a guess, so gross margin is a guess.'],
      ['<strong>Cut-off</strong>','Make sure sales and purchases are in the right month, matching delivery dates.','Revenue moves between months. Sometimes on purpose.'],
      ['<strong>Review</strong>','Someone senior looks at the results against last month and budget, and investigates odd movements.','Errors reach you, and you make decisions on them.']
    ]},
    `<h3>Accruals in action</h3><p>Here's what missing accruals do to BraceWorks' monthly profit. The power bill arrives a month late, and the $9,600 annual insurance is paid in August.</p>`,
    W('With and without the month-end close', function(el, ctx){
      const months=['Jul','Aug','Sep','Oct'];
      const without=[9400,-6100,10200,5900], withA=[4900,5000,4800,5000];
      el.innerHTML='<div data-seg></div><div data-out></div>';
      const out=el.querySelector('[data-out]');
      const draw=(mode)=>{ const v=mode==='with'?withA:without;
        out.innerHTML=ctx.ui.bars(months.map((m,i)=>({label:m,v:v[i],tone:v[i]<0?'bad':''})),{max:10200})+
        `<p class="w-hint" style="margin-top:10px">${mode==='with'?'With accruals and prepayments, profit is steady at about $5,000 a month. This is the truth: the business didn\'t change from month to month.':'Without them, profit swings from +$10,200 to a loss, purely because of when bills were paid. A GM could easily react to August\'s "loss" with cuts that weren\'t needed.'}</p>`; };
      ctx.ui.seg(el.querySelector('[data-seg]'),[{v:'without',label:'Bills recorded when paid'},{v:'with',label:'Proper month-end close'}],'without',draw);
      draw('without');
    }),
    K('A good close is fast and boring',
      `<p>A well-run small company closes its books within 5 to 10 working days, with a written checklist and the same steps every month. If your report arrives on the 25th, or profit swings for no reason you can name, the close is the place to look.</p>`)
  ]},
  {id:'case', label:'Case: too good to be true', kind:'case', title:'Too good to be true', blocks:[
    CASE('A surprise $15,000 boost',
      `<p>November's report shows BraceWorks' best gross margin all year. Sales are $118,000 against $104,000 in October. But the warehouse manager says shipments were about the same as October.</p>
       <p>You ask the bookkeeper for the November sales listing. One line stands out:</p>`),
    {t:'tbl', head:['Date','Customer','Description','Amount'], opts:{num:[3]}, rows:[
      ['27 Nov','Kangaroo Care Supplies (Australia)','30% deposit on order #4471, ship date 15 Jan','$15,000']
    ]},
    `<p>The bookkeeper posted it like this:</p>`,
    {t:'tbl', head:['Account','Debit','Credit'], opts:{num:[1,2]}, rows:[['Cash','$15,000',''],['&nbsp;&nbsp;&nbsp;&nbsp;Sales revenue','','$15,000']]},
    Q('What should the entry have been?',[
      {text:'Dr Cash, Cr Sales revenue. It\'s correct, because the cash was received.', why:'Revenue is earned when goods are delivered, not when cash arrives. Nothing has shipped yet.'},
      {text:'Dr Cash, Cr Customer deposits (a liability)'},
      {text:'Dr Receivables, Cr Sales revenue', why:'No sale has happened, and the customer doesn\'t owe anything. They\'ve paid in advance.'},
      {text:'Don\'t record it until January', why:'The cash is in the bank, so it must be recorded now. The question is which account.'}
    ],1,'Until the goods ship, BraceWorks owes the customer either the products or the money back. That\'s a liability, usually called customer deposits or deferred revenue. In January, when the order ships, the deposit moves to revenue.'),
    `<h3>Why this matters beyond one month</h3>
     <ul>
      <li>November profit was overstated by about $15,000, and January's will be understated by the same amount.</li>
      <li>If sales commissions or bonuses are based on monthly revenue, BraceWorks may have paid them on a sale that hadn't happened.</li>
      <li>If the order is cancelled, the deposit has to be refunded. Recorded as revenue, it would have been treated as earned money.</li>
      <li>The bank and auditors treat early revenue recognition as a serious red flag, because it's the most common way profits get inflated.</li>
     </ul>`,
    FLAG('The suspense account',
      `<p>When a bookkeeper doesn't know where something belongs, it often goes into a <span class="term">suspense account</span> "for now". A suspense account should be cleared to zero every month. If yours has a balance that's growing, there are transactions nobody has explained. Ask for the list.</p>`)
  ]},
  {id:'quiz', label:'Quiz', kind:'quiz', title:'Check your understanding', blocks:[
    Q('BraceWorks pays a $3,000 electricity bill from the bank. What is the entry?',['Dr Cash, Cr Electricity expense','Dr Electricity expense, Cr Cash','Dr Electricity expense, Cr Payables','Dr Payables, Cr Electricity expense'],1,'Expense goes up: debit. Cash goes down: credit.'),
    Q('Why must a trial balance always balance?',[
      'Because the auditor adjusts it at year-end','Because every entry has equal debits and credits','Because revenue always equals expenses','It doesn\'t need to balance'],1,'Double entry means each transaction adds the same amount to both sides, so the totals always match. If they don\'t, an entry was posted wrongly.'),
    Q('The trial balance balances. Does that prove the books are correct?',[
      'Yes, always','No. An entry can balance but be posted to the wrong account, or be missing altogether.','Only if the auditor has signed it','Only if cash matches the bank'],1,
      'Balancing catches one-sided mistakes only. Posting a machine repair to Equipment instead of Repairs expense still balances, but overstates profit.'),
    Q('Your August report shows a loss. July and September were profitable. Nothing changed in the factory. What do you suspect first?',[
      'A drop in sales','Theft','Missing accruals or prepayments: costs recorded when paid, not when incurred','A tax error'],2,
      'Profit swinging with no operational reason usually means the month-end close isn\'t being done properly.'),
    Q('A customer pays a deposit for goods you\'ll ship next quarter. Where does it go?',['Sales revenue','Customer deposits, a liability','Receivables','Retained earnings'],1,'You owe the goods or a refund until you deliver, so it\'s a liability until then.'),
    Q('Which account should be cleared to zero every month?',['Cash','Retained earnings','Suspense','Receivables'],2,'A suspense account is a temporary holding place. A lingering balance means unexplained transactions.')
  ]},
  {id:'apply', label:'Practice', kind:'apply', title:'Practise on a sample pack', blocks:[
    PACK('packB',7,'Pack B, page 7: month-end close checklist'),
    Q('Pack B\'s close checklist shows $6,200 of accruals booked for goods received, freight and overtime. Without them, March profit would have been…',['The same','About $6,200 higher in March, then $6,200 lower in April','Lower','Unaffected, because accruals are balance sheet items'],1,'Accruals put costs in the month they belong to. Without them, profit swings between months (Module 2).'),
    PACK('packD',5,'Pack D, page 5: largest invoices and suspense items'),
    Q('INV-5601 is an $8,000 advance payment for January delivery, recorded as November revenue. What should the entry have been?',['Dr Cash, Cr Sales revenue','Dr Cash, Cr Customer deposits (a liability)','Dr Receivables, Cr Sales revenue','No entry until January'],1,'Cash received before delivery is a liability until the goods ship.'),
    Q('Pack D has $8,600 of suspense items in "other current assets". What should happen?',['Leave them until year-end','Investigate and clear them to zero before the pack is issued','Write them off to profit','Move them to equity'],1,'A suspense account is temporary. Unexplained items should never sit in a vaguely named line.'),
    {t:'html',html:'<h3>Later, with your own report</h3><p class="small" style="color:var(--muted)">Optional. When you next read your own monthly report, use this checklist. Nothing here is shared or sent; ticks are saved only in this browser.</p>'},
    CHECK('m2-books','Ask your finance team…',[
      'Are all bank accounts reconciled every month, including foreign-currency accounts?',
      'Is the suspense account at zero at every month-end?',
      'Do we accrue for costs not yet billed (power, freight, overtime, commissions)?',
      'Are prepayments such as insurance and certification fees spread over the months they cover?',
      'Is revenue recorded on the shipping date that matches the customer\'s Incoterms, not on order or payment?',
      'Is there a written month-end close checklist, and who signs it off?',
      'Can anyone post journals, or are manual journals reviewed and approved by a second person?',
      'Does the chart of accounts separate sales and cost of goods sold by product line?'
    ]),
    REPORT('Your Monday-morning request',
      `<p>Ask for a copy of the <strong>month-end close checklist</strong> and the date each step was completed last month. If there isn't one, that's your first improvement project, and it's cheap.</p>`),
    K('Takeaways',
      `<ul>
        <li>Every entry has a debit and a credit of equal value. Assets and expenses grow with debits. Liabilities, equity and revenue grow with credits.</li>
        <li>A balanced trial balance doesn't mean the books are right, only that they're consistent.</li>
        <li>The month-end close (reconciliations, accruals, prepayments, cut-off, review) decides whether your monthly numbers can be trusted.</li>
        <li>Cash received before delivery is a liability, not revenue.</li>
       </ul>`)
  ]}
  ],
  warnings:[
    {sign:'Profit swings month to month while operations are steady', meaning:'Costs recorded when paid rather than when incurred. The month-end close is weak.', look:'Ask whether accruals and prepayments are booked each month.'},
    {sign:'Suspense or "unallocated" account with a balance', meaning:'Transactions nobody has explained, possibly errors or worse.', look:'Ask for the itemised list and a plan to clear it.'},
    {sign:'Bank reconciliations late or not done', meaning:'Errors, duplicate payments or theft can go undetected.', look:'Ask for last month\'s reconciliation, signed and dated.'},
    {sign:'Revenue jump without a matching jump in shipments', meaning:'Deposits or orders booked as sales, or cut-off errors.', look:'Compare invoiced sales to the shipping log for the month.'}
  ],
  formulas:[
    {name:'Double entry', f:'Total debits = Total credits (for every entry)', ex:'Buy $9,000 webbing on credit: Dr Inventory $9,000, Cr Payables $9,000'},
    {name:'Accrued expense', f:'Cost incurred this month − amount already billed', ex:'September power used $3,500, bill arrives in October: accrue $3,500 in September'}
  ],
  glossary:[
    {term:'Double-entry bookkeeping', def:'System where every transaction is recorded in at least two accounts with equal debits and credits.'},
    {term:'Debit (Dr)', def:'Left side of an entry. Increases assets and expenses; decreases liabilities, equity and revenue.'},
    {term:'Credit (Cr)', def:'Right side of an entry. Increases liabilities, equity and revenue; decreases assets and expenses.'},
    {term:'Journal entry', def:'The record of one transaction, showing the accounts debited and credited.'},
    {term:'General ledger', def:'The complete set of accounts, each showing every entry posted to it and its running balance.'},
    {term:'Chart of accounts', def:'The numbered list of all accounts a business uses. Decides what reports can show.'},
    {term:'Trial balance', def:'List of every account balance at a date. Total debits must equal total credits.'},
    {term:'Month-end close', def:'The routine of reconciliations and adjustments done before monthly reports are produced.'},
    {term:'Accrual', def:'A cost recorded in the month it was incurred even though the bill hasn\'t arrived yet.'},
    {term:'Prepayment', def:'A cost paid in advance and spread over the months it covers, such as annual insurance.'},
    {term:'Bank reconciliation', def:'Matching the bank statement to the books line by line and explaining any differences.'},
    {term:'Cut-off', def:'Making sure sales and costs are recorded in the correct period.'},
    {term:'Suspense account', def:'Temporary account for entries whose correct account is unknown. Should be zero at month-end.'},
    {term:'Customer deposits (deferred revenue)', def:'Cash received before goods are delivered. A liability until the goods ship.'},
    {term:'Accumulated depreciation', def:'Total depreciation charged on equipment so far. Shown as a deduction from its cost.'}
  ]
});
})();
