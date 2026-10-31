/* ===== Module 17: Export finance ===== */
(function(){
const {K,TIP,FLAG,CASE,REPORT,Q,FS,FLIP,SORT,CHECK,W,PACK,money,signed,pct,kfmt} = BW.h;

BW.add({
  id:'m17', minutes:50,
  title:'Export finance',
  subtitle:'Currencies, Incoterms, letters of credit and bank facilities: the money side of selling medical devices across borders.',
  goals:[
    'Measure BraceWorks\' currency exposure and choose a way to manage it',
    'Know what each common Incoterm means for cost, risk and when revenue counts',
    'Choose a payment method that fits the customer and the risk',
    'Understand bank facilities and the covenants that come with them'
  ],
  sections:[
  {id:'fx', label:'Currency risk', kind:'play', title:'Currency risk', blocks:[
    `<p>BraceWorks keeps its books in US dollars. But not all its money is in dollars:</p>
     <ul>
      <li>About <strong>30% of sales are invoiced in euros</strong>, to European distributors.</li>
      <li>About <strong>$370,000 of costs are paid in local currency</strong>: wages, rent, power and local services.</li>
     </ul>
     <p>So BraceWorks wins when the euro strengthens and the local currency weakens, and loses when they go the other way. That's the $6,000 foreign exchange loss on last year's P&amp;L.</p>
     <h3>A single invoice</h3>
     <p>BraceWorks ships to Germany and invoices <strong>€40,000</strong> when €1 = $1.10. Revenue is booked at $44,000. Sixty days later the customer pays, but now €1 = $1.06. The euros convert to $42,400. The $1,600 difference is a <strong>foreign exchange loss</strong>, even though the customer paid in full.</p>`,
    W('Currency exposure for a year', function(el, ctx){
      const {money,signed}=ctx.h;
      const top=document.createElement('div'), out=document.createElement('div'); el.append(top,out);
      ctx.ui.sliders(top,[
        {k:'eur',label:'Share of sales invoiced in euros',min:0,max:60,step:5,v:30,f:x=>x+'%'},
        {k:'mv',label:'Euro move against the dollar before payment',min:-10,max:10,step:1,v:-5,f:x=>(x>0?'+':'')+x+'%'},
        {k:'hedge',label:'Share of euro receipts hedged with forwards',min:0,max:100,step:10,v:0,f:x=>x+'%'},
        {k:'loc',label:'Local currency move against the dollar',min:-10,max:10,step:1,v:3,f:x=>(x>0?'stronger ':'weaker ')+Math.abs(x)+'%'}
      ],(v)=>{
        const eurSales=1200000*v.eur/100, eurEff=eurSales*(v.mv/100)*(1-v.hedge/100), locEff=-370000*(v.loc/100);
        const tot=eurEff+locEff;
        out.innerHTML=ctx.ui.bars([{label:'Euro sales effect',v:Math.round(eurEff),tone:eurEff<0?'bad':'good'},{label:'Local cost effect',v:Math.round(locEff),tone:locEff<0?'bad':'good'},{label:'Total effect on profit',v:Math.round(tot),tone:tot<0?'bad':'good'}],{fmt:x=>signed(x),max:Math.max(30000,Math.abs(eurEff),Math.abs(locEff),Math.abs(tot))})+
        `<div class="stats" style="margin-top:12px">${ctx.ui.stat('Effect on profit before tax',signed(Math.round(tot)),tot<-5000?'bad':tot>5000?'good':'')}${ctx.ui.stat('As a share of last year\'s profit before tax',(tot/74000*100).toFixed(0)+'%',Math.abs(tot)>15000?'warn':'')}</div>
        <p class="w-hint" style="margin-top:10px">${Math.abs(tot)>20000?'Currency alone could swing BraceWorks\' profit by a quarter or more. That\'s too big to leave to chance.':v.hedge>=50?'Hedging takes the euro risk off the table. The local cost exposure remains, and is harder to hedge for a small company.':'Even modest moves matter at a 6% profit margin. Try hedging half the euro receipts.'}</p>`;
      },ctx.uid);
    }),
    `<h3>Ways to manage currency risk</h3>`,
    {t:'tbl', head:['Method','How it works','Good for'], rows:[
      ['<strong>Invoice in your own currency</strong>','Quote in US dollars; the customer carries the risk','Customers who accept it. Many European hospitals won\'t.'],
      ['<strong>Natural hedge</strong>','Buy in the same currency you sell: euro fabric paid from euro sales','Reducing exposure without bank products'],
      ['<strong>Forward contract</strong>','Agree with your bank today the rate for converting a known amount on a future date','Known receipts: confirmed orders, tenders, contracts'],
      ['<strong>Price adjustment clause</strong>','Contract price moves if the rate moves beyond an agreed band','Long contracts and tenders'],
      ['<strong>Currency buffer in quotes</strong>','Add 2–3% to euro quotes to absorb normal moves (Module 12)','Small, frequent orders']
    ]},
    K('Hedging is insurance, not speculation',
      `<p>The goal isn't to beat the market. It's to know what a euro order will be worth in dollars when you price it, so the margin you quoted is the margin you get. A forward contract also means you miss out if the euro strengthens. That's the price of certainty.</p>`)
  ]},
  {id:'inco', label:'Incoterms', kind:'learn', title:'Incoterms: who pays, who carries the risk', blocks:[
    `<p><span class="term">Incoterms</span> are standard trade rules, published by the International Chamber of Commerce, that say where the seller's responsibility ends and the buyer's begins. The current version is Incoterms 2020. They decide three things that matter to a GM: <strong>who pays which costs, who carries the risk if goods are lost or damaged, and often when you can count the sale as revenue.</strong></p>`,
    {t:'tbl', head:['Term','Seller (BraceWorks) delivers…','Risk passes to buyer','BraceWorks pays'], rows:[
      ['<strong>EXW</strong> Ex Works','Goods ready at the factory','At the factory','Nothing beyond packing. The buyer must handle export clearance, which can cause problems.'],
      ['<strong>FCA</strong> Free Carrier','To the buyer\'s carrier, export-cleared','When handed to the carrier','Export clearance and local delivery to the carrier. Recommended for container shipments.'],
      ['<strong>FOB</strong> Free On Board','Loaded on the ship at the export port','When on board the vessel','Export clearance, local transport, port loading. Sea freight only.'],
      ['<strong>CIF</strong> Cost, Insurance and Freight','Loaded on the ship, with freight and insurance paid to the destination port','When on board at the <em>export</em> port','Sea freight and minimum insurance. Note: you pay to destination but the risk passes at origin.'],
      ['<strong>DAP</strong> Delivered At Place','To the buyer\'s named place, ready to unload','On arrival at destination','All transport. The buyer pays import duties and taxes.'],
      ['<strong>DDP</strong> Delivered Duty Paid','To the buyer\'s place, import-cleared, duties paid','On arrival at destination','Everything, including import duties, taxes and customs clearance in the buyer\'s country.']
    ]},
    K('Incoterms and your revenue',
      `<p>Revenue is recognised when control of the goods passes to the customer, which usually follows the Incoterm. Under FCA or FOB, a mattress shipment counts as a sale when it leaves. Under DAP or DDP, it counts only on arrival, perhaps five weeks later. So at month-end, DDP goods on the water are still <em>your</em> inventory. Finance must handle this cut-off correctly, or monthly sales will be wrong.</p>`),
    FLAG('DDP is the riskiest term',
      `<p>Under DDP, BraceWorks pays import duties and taxes in the buyer's country, must deal with that country's customs and medical device import rules, and carries the risk all the way. It's sometimes necessary to win a hospital tender, but it must be priced fully (Module 12), and checked with a freight forwarder for that country first.</p>`),
    Q('BraceWorks ships on CIF terms to Sydney. The ship is damaged in a storm halfway. Whose risk is it?',['BraceWorks\', because it paid the freight','The buyer\'s, because risk passed when the goods were loaded at the export port','Shared equally','The shipping line\'s only'],1,
      'Under CIF the seller pays freight and insurance to destination, but risk passes at loading. The buyer claims on the insurance BraceWorks bought.')
  ]},
  {id:'pay', label:'Getting paid', kind:'learn', title:'Getting paid by foreign customers', blocks:[
    `<p>Collecting from a customer 10,000 km away, under another country's laws, is harder than collecting at home. So choose the payment method according to how well you know the customer and the country.</p>`,
    {t:'tbl', head:['Method','How it works','Risk to BraceWorks','Cost'], rows:[
      ['<strong>Cash in advance</strong>','Customer pays before shipping','None','None. But few distributors will accept it.'],
      ['<strong>Letter of credit (LC)</strong>','The customer\'s bank promises to pay when you present the exact documents the LC requires','Low, if documents are perfect','Bank fees of roughly 0.5–2%, mostly paid by the buyer; more admin'],
      ['<strong>Documentary collection</strong>','Banks hand over the shipping documents only when the buyer pays (or accepts a bill of exchange)','Medium: the buyer can refuse to take the goods','Low bank fees'],
      ['<strong>Open account</strong>','Ship and invoice; the customer pays on terms','Highest: you rely on their willingness and ability to pay','None, unless insured'],
      ['<strong>Open account + credit insurance</strong>','An insurer covers most of the loss if the customer doesn\'t pay','Low, within the insured limit','Premium, often 0.2–0.5% of insured sales']
    ]},
    `<h3>How a letter of credit works</h3>
     <ol>
      <li>The buyer asks its bank to issue an LC in BraceWorks' favour, listing the documents required.</li>
      <li>BraceWorks ships, and presents those documents to its bank: invoice, bill of lading, packing list, certificate of origin, and so on.</li>
      <li>If the documents match the LC exactly, the buyer's bank must pay, whatever the buyer thinks.</li>
     </ol>`,
    FLAG('The discrepancy trap',
      `<p>Banks pay on documents, not goods. A misspelled port name, a description that differs from the LC wording, or presenting documents a day after the deadline is a <span class="term">discrepancy</span>. The bank can then refuse to pay until the buyer agrees to waive it. That delays payment, adds fees, and hands the buyer leverage. Check every LC carefully when it arrives, and ask for changes to anything you can't meet before you ship.</p>`),
    TIP('Match the method to the customer',
      `<p>New customer in a high-risk market: cash in advance or a confirmed LC. Established distributor in a stable market: open account, with a credit limit and ideally credit insurance. The UAE bad debt from Module 4 would have been covered by either an LC or insurance.</p>`)
  ]},
  {id:'bank', label:'Bank facilities', kind:'play', title:'Bank facilities and covenants', blocks:[
    `<p>BraceWorks has two bank facilities: a $150,000 working capital line and a $100,000 equipment loan. Here are the main types of funding a small exporter can use.</p>`,
    {t:'tbl', head:['Facility','Use it for','How it works'], rows:[
      ['<strong>Overdraft or working capital line</strong>','Day-to-day swings in cash','Borrow and repay as needed, up to a limit. Usually reviewed every year.'],
      ['<strong>Invoice discounting or factoring</strong>','Turning receivables into cash','The bank advances, say, 80% of approved invoices when you ship. Factoring also takes over collection.'],
      ['<strong>Pre-shipment (packing) credit</strong>','Funding materials and labour for a confirmed export order','The bank lends against a confirmed order or LC, repaid when the customer pays.'],
      ['<strong>Term loan or lease</strong>','Equipment and other long-term assets','Fixed repayments over several years, matched to the asset\'s life.']
    ]},
    K('Match the funding to the need',
      `<p>Fund long-term assets with long-term money, and short-term needs with short-term money. Paying for a machine from the overdraft leaves no room for the normal swings in working capital. That's exactly what happened when BraceWorks' overdraft use rose by $40,000 in the year it bought the foam cutter.</p>`),
    `<h3>Covenants</h3>
     <p>Most loans come with <span class="term">covenants</span>: financial tests the business must pass, usually checked every quarter or year. Breaking one can let the bank demand repayment, raise the interest rate or stop further lending. BraceWorks' loan has three:</p>`,
    W('Covenant tester', function(el, ctx){
      const {money}=ctx.h;
      const top=document.createElement('div'), out=document.createElement('div'); el.append(top,out);
      ctx.ui.sliders(top,[
        {k:'ebitda',label:'EBITDA for the year',min:40000,max:200000,step:2000,v:132000,f:money},
        {k:'debt',label:'Bank debt',min:100000,max:400000,step:5000,v:220000,f:money},
        {k:'cash',label:'Cash',min:0,max:120000,step:2000,v:42000,f:money},
        {k:'int',label:'Interest for the year',min:6000,max:30000,step:500,v:14000,f:money},
        {k:'eq',label:'Equity (net worth)',min:300000,max:600000,step:5000,v:491500,f:money}
      ],(v)=>{
        const nd=(v.debt-v.cash)/v.ebitda, ic=v.ebitda/v.int;
        const row=(name,val,lim,ok,fmt)=>[name,`<strong>${fmt}</strong>`,lim,`<span class="${ok?'pos':'neg'}"><strong>${ok?'Pass':'Breach'}</strong></span>`];
        const t=[row('Net debt to EBITDA',nd,'≤ 2.5×',nd<=2.5,nd.toFixed(2)+'×'),row('Interest cover (EBITDA ÷ interest)',ic,'≥ 4.0×',ic>=4,ic.toFixed(1)+'×'),row('Minimum net worth',v.eq,'≥ $400,000',v.eq>=400000,money(v.eq))];
        const fails=[nd>2.5,ic<4,v.eq<400000].filter(Boolean).length;
        const close=nd>2.1||ic<5;
        out.innerHTML=ctx.ui.table(['Covenant','Actual','Limit','Result'],t,{num:[1]})+`<div class="msg ${fails?'bad':close?'warn':'good'}" style="margin-top:12px">${fails?'A breach. Talk to the bank before the test date, not after. Explain why, what you\'re doing, and ask for a waiver or a reset. Banks deal with breaches all the time; surprises are what damage trust.':close?'Passing, but with little headroom. One bad quarter could cause a breach. Forecast the covenants for the next four quarters.':'Comfortable headroom on all three. Try the clean-up from Module 4: EBITDA falls to about $88,600. Then add a $104,000 loan for the quilting line from Module 14.'}</div>`;
      },ctx.uid);
    }),
    TIP('Definitions differ: read your loan agreement',
      `<p>Module 11 measured interest cover as operating profit ÷ interest (6.7×). This bank uses EBITDA ÷ interest (9.4×). Both are common. For a covenant, the only definition that counts is the one written in your loan agreement, including what it adds back and which months it covers.</p>`),
    TIP('Forecast your covenants',
      `<p>Ask finance to add the covenant tests to the monthly forecast, so you can see a breach coming two or three quarters ahead. Before any big decision that adds debt or could hit EBITDA, check the covenants first.</p>`)
  ]},
  {id:'case', label:'Case: the euro tender', kind:'case', title:'The euro tender', blocks:[
    CASE('A Spanish hospital group',
      `<p>BraceWorks wins a tender to supply a Spanish hospital group: <strong>€120,000</strong> of mattresses and slings, priced in euros, delivered DDP, with payment 120 days after delivery. At the time of pricing, €1 = $1.10, so the order is worth <strong>$132,000</strong>, with an expected margin of 18%, about $23,800.</p>
       <p>By the time the hospital pays, the euro has fallen 6%.</p>`),
    FS({title:'The tender in dollars', cols:['As priced','When paid'], rows:[
      ['Euro amount', ['€120,000','€120,000']],
      ['Exchange rate', ['$1.10','$1.034']],
      ['Revenue in dollars', [132000, 124080]],
      ['Costs (in dollars and local currency)', [-108240, -108240]],
      ['Margin', [23760, 15840], 'sub'],
      ['Margin %', ['18.0%','12.8%'], 'total']
    ], note:'One third of the profit gone, through no fault of operations.'}),
    Q('What would have protected the margin?',[
      {text:'Waiting to see if the euro recovers', why:'That\'s speculation. The euro could just as easily fall further.'},
      {text:'A forward contract when the tender was awarded, selling €120,000 for dollars on the expected payment date at a fixed rate'},
      {text:'Asking the hospital to pay faster', why:'Helpful for cash, but public hospitals rarely change tender terms.'},
      {text:'Raising mattress prices for US customers', why:'Making other customers pay for an unmanaged currency risk isn\'t a fix.'}
    ],1,'A forward contract fixes the dollar value at about the rate when the deal was done, give or take the interest-rate difference. The margin is then the one you priced. For tenders, ask your bank about this before you submit, because you won\'t know if you\'ve won until later.'),
    K('Three lessons for euro business',
      `<ul>
        <li>Price euro tenders with a currency buffer, and hedge once the contract is signed.</li>
        <li>Long payment terms increase currency risk as well as tying up cash. Price both in.</li>
        <li>Report currency gains and losses separately in the monthly pack, with the exposure for the next few months.</li>
       </ul>`)
  ]},
  {id:'quiz', label:'Quiz', kind:'quiz', title:'Check your understanding', blocks:[
    Q('You invoice €50,000 at $1.10 and receive payment when the rate is $1.12. What happens?',['A $1,000 loss','A $1,000 gain','No effect','A €1,000 loss'],1,'You receive $56,000 against $55,000 booked: a $1,000 foreign exchange gain.'),
    Q('Under which Incoterm does BraceWorks pay the import duty in the buyer\'s country?',['FOB','CIF','DAP','DDP'],3,'Delivered Duty Paid: the seller carries all costs including import duties and taxes.'),
    Q('Why might a sale shipped under DDP on 28 June not be June revenue?',['DDP sales are never revenue','Control passes on delivery at the destination, which may be in July','The invoice is in euros','It depends on the bank'],1,'Revenue follows the transfer of control, which under DDP happens at the destination.'),
    Q('What\'s the main risk with a letter of credit for the exporter?',['The bank might go bankrupt','Discrepancies in documents can delay or block payment','The buyer can cancel at any time','It\'s illegal in some countries'],1,'Banks pay only on documents that match the LC exactly.'),
    Q('Which funding is best suited to buying a new machine?',['The overdraft','A term loan or lease matched to the machine\'s life','Supplier credit','Invoice discounting'],1,'Long-term assets should be funded with long-term money.'),
    Q('Net debt is $178,000 and EBITDA falls to $70,000. The covenant is 2.5×. What happens?',['Pass: 1.35×','Pass: it\'s exactly at the limit','Breach: 2.54×, just over the 2.5× limit','You can\'t tell without the equity figure'],2,'$178,000 ÷ $70,000 = 2.54×, just over the limit. Talk to the bank before the test date.')
  ]},
  {id:'apply', label:'Practice', kind:'apply', title:'Practise on a sample pack', blocks:[
    PACK('packC',6,'Pack C, page 6: covenants'),
    Q('All of Pack C\'s covenants pass, yet liquidity goes negative in week 4. How can both be true?',['They can\'t','Covenants test ratios at a date; they don\'t measure when cash arrives and leaves','The bank made an error','Covenants include cash'],1,'Watch both: covenant headroom and the 13-week forecast.'),
    Q('The Saudi payment is held because the port name on the bill of lading is misspelt. What\'s the lesson?',['Avoid Saudi customers','Check every document against the LC wording before presenting it to the bank','Don\'t use LCs','Ask the bank to ignore it'],1,'Banks pay on documents that match exactly (Module 17).'),
    PACK('packB',3,'Pack B, page 3: commentary'),
    Q('Pack B says 40% of April euro receipts are hedged. What does that protect?',['All profit','The dollar value of 40% of those euro receipts, fixed by forward contracts','Local currency costs','Interest rates'],1,'Hedging fixes the rate for known amounts. The other 60% still moves with the euro.'),
    {t:'html',html:'<h3>Later, with your own report</h3><p class="small" style="color:var(--muted)">Optional. When you next read your own monthly report, use this checklist. Nothing here is shared or sent; ticks are saved only in this browser.</p>'},
    CHECK('m17-exp','At my company…',[
      'We know our currency exposure: sales and costs by currency for the next 6 months',
      'Euro (or other foreign currency) contracts and tenders are hedged once confirmed',
      'Foreign exchange gains and losses are shown separately in the monthly pack',
      'Every quote states the Incoterm, and the price reflects it',
      'Finance handles revenue cut-off correctly for DAP and DDP shipments',
      'New customers in higher-risk markets pay in advance, by LC, or are credit-insured',
      'LCs are checked on arrival, and documents are checked before presentation',
      'We forecast our loan covenants for the next four quarters'
    ]),
    REPORT('Your Monday-morning questions',
      `<p>Ask finance: <strong>"How much do we have coming in, in euros, over the next six months, and how much of it is hedged?"</strong> Then: <strong>"What are our loan covenants, and how close are we to each one?"</strong></p>`),
    K('Takeaways',
      `<ul>
        <li>Currency moves can swing a thin margin. Measure the exposure; hedge confirmed amounts.</li>
        <li>Incoterms decide costs, risk and when revenue counts. Price DDP fully.</li>
        <li>Choose payment methods by customer risk: in advance, LC, collection, open account, insurance.</li>
        <li>Match funding to the need, and keep an eye on covenant headroom.</li>
       </ul>`)
  ]}
  ],
  warnings:[
    {sign:'Large foreign exchange losses with no explanation', meaning:'Unmanaged currency exposure.', look:'Exposure by currency; hedging policy.'},
    {sign:'DDP or DAP quotes without a freight forwarder\'s check', meaning:'Duties, taxes and customs costs underpriced.', look:'Landed cost estimate per country.'},
    {sign:'New overseas customer on open account with no credit check', meaning:'High risk of a bad debt that\'s hard to recover abroad.', look:'Credit insurance, LC or deposit.'},
    {sign:'Covenant headroom shrinking', meaning:'A breach could give the bank the right to demand repayment.', look:'Covenant forecast for the next four quarters.'},
    {sign:'Equipment bought with the overdraft', meaning:'Short-term funding for long-term assets; liquidity squeeze.', look:'Term loan or lease options.'}
  ],
  formulas:[
    {name:'Foreign exchange gain or loss', f:'Foreign amount × (Rate at payment − Rate at invoice)', ex:'€40,000 × (1.06 − 1.10) = ($1,600)'},
    {name:'Net debt to EBITDA covenant', f:'(Bank debt − Cash) ÷ EBITDA', ex:'($220,000 − $42,000) ÷ $132,000 = 1.35×'},
    {name:'Interest cover covenant', f:'EBITDA ÷ Interest', ex:'$132,000 ÷ $14,000 = 9.4×'}
  ],
  glossary:[
    {term:'Transaction exposure', def:'The risk that exchange rates move between agreeing a price in foreign currency and settling it.'},
    {term:'Forward contract', def:'An agreement with a bank to exchange a set amount of currency at a fixed rate on a future date.'},
    {term:'Natural hedge', def:'Reducing currency exposure by matching revenues and costs in the same currency.'},
    {term:'Incoterms 2020', def:'The International Chamber of Commerce\'s standard trade terms defining costs, risks and responsibilities between buyer and seller.'},
    {term:'FCA', def:'Free Carrier: the seller delivers export-cleared goods to the buyer\'s carrier; risk passes there.'},
    {term:'FOB', def:'Free On Board: risk passes when goods are loaded on the vessel at the export port. Sea freight only.'},
    {term:'CIF', def:'Cost, Insurance and Freight: the seller pays freight and insurance to the destination port, but risk passes at loading.'},
    {term:'DDP', def:'Delivered Duty Paid: the seller delivers to the buyer\'s premises and pays all costs including import duties.'},
    {term:'Letter of credit (LC)', def:'A bank\'s promise to pay the exporter when documents exactly matching the LC terms are presented.'},
    {term:'Confirmed LC', def:'An LC where a second bank, usually in the exporter\'s country, also guarantees payment.'},
    {term:'Documentary collection', def:'Banks release shipping documents to the buyer only against payment or acceptance of a bill.'},
    {term:'Credit insurance', def:'Insurance that pays a large part of a receivable if the customer doesn\'t pay.'},
    {term:'Invoice discounting', def:'Borrowing against unpaid invoices, typically up to around 80% of their value.'},
    {term:'Discrepancy', def:'A difference between documents presented and the LC terms, allowing the bank to refuse payment.'}
  ]
});
})();
