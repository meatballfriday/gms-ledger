/* ===== Module 28: Funding growth: investors, a sale or a listing (optional: growing into a multinational) ===== */
(function(){
const {K,TIP,FLAG,CASE,REPORT,Q,FS,FLIP,SORT,CHECK,W,money,signed,pct,kfmt} = BW.h;
const m$=v=>money(Math.round(v));
const mm=v=>(v<0?'(':'')+'$'+Math.abs(v).toFixed(1)+'m'+(v<0?')':'');
const E=(tag,cls,html)=>{ const e=document.createElement(tag); if(cls) e.className=cls; if(html!=null) e.innerHTML=html; return e; };

BW.add({
  id:'m28', minutes:60,
  title:'Funding growth: investors, a sale or a listing',
  subtitle:'Growing from 50 to 1,000 people usually needs more money than profits and bank loans can provide. What each kind of investor wants, how a business is valued and adjusted in a deal, and the years of preparation behind a good outcome.',
  goals:[
    'Compare bank debt, private equity, strategic investors and a stock market listing',
    'Work out how new money dilutes the owners, and what control rights matter more than percentages',
    'Turn a valuation multiple into the cash the sellers actually receive',
    'Spot the earnings adjustments a buyer will challenge',
    'Plan the three years of preparation before raising capital or selling',
    'Understand the deal terms that move money after a price is agreed'
  ],
  sections:[
  /* ---------------------------------------------------------------- 1 */
  {id:'options', label:'Ways to fund growth', kind:'play', title:'Ways to fund the next stage', blocks:[
    `<p>Module 20 covered funding for a 50-person company. For a group heading towards 1,000 people, building a second factory and buying distributors, the options widen, and so do the strings attached.</p>`,
    {t:'tbl', head:['Source','What they give','What they want','Typical strings'], rows:[
      ['<strong>Banks and private credit funds</strong>','Loans, often larger and longer from private credit','Interest and repayment','Covenants, security, sometimes limits on dividends and acquisitions'],
      ['<strong>Development finance institutions</strong>','Long-term loans or equity for emerging-market growth','Development impact as well as a return','Environmental, social and governance standards; reporting'],
      ['<strong>Private equity, minority stake</strong>','Equity for growth, plus board help','A return of several times their money in about 4–7 years','Board seats, vetoes on key decisions, an exit plan'],
      ['<strong>Private equity, majority stake</strong>','Buys most of the company; founders often keep a stake','Control and a planned exit','Management incentives, debt, a five-year plan'],
      ['<strong>Strategic investor</strong> (a bigger device company)','Money, plus distribution or technology','Market access, products, possibly full ownership later','Exclusivity, rights to buy the rest'],
      ['<strong>Stock market listing</strong>','Capital from many investors; a market for shares','Growth, dividends and constant information','Public reporting, governance rules, scrutiny every quarter']
    ]},
    W('How new money changes who owns what', function(el,ctx){
      const top=E('div'), sg=E('div'), out=E('div'); el.append(top,sg,out);
      let v={r1:20,v1:60}, two=false, ready=false;
      ctx.ui.sliders(top,[{k:'r1',label:'Raise from a private equity investor',min:5,max:60,step:5,v:20,f:x=>'$'+x+'m'},{k:'v1',label:'Value agreed before the money (pre-money)',min:20,max:200,step:5,v:60,f:x=>'$'+x+'m'}],x=>{ v=x; if(ready) draw(); },ctx.uid);
      ctx.ui.seg(sg,[{v:false,label:'One round'},{v:true,label:'Add a second round: $40m at $160m pre-money'}],false,x=>{ two=x; draw(); });
      sg.style.margin='10px 0';
      function draw(){
        const post1=v.v1+v.r1, a=v.r1/post1, own1=1-a;
        let own=own1, A=a, B=0, val=post1;
        if(two){ const post2=160+40; B=40/post2; own=own1*(1-B); A=a*(1-B); val=post2; }
        const seg=(cls,p,lab)=>`<i class="${cls}" style="flex-basis:${(p*100).toFixed(2)}%" title="${lab}: ${pct(p,1)}">${p>0.08?lab.split(' ')[0]+' '+pct(p,0):''}</i>`;
        out.innerHTML=`<div class="pie-wrap"><div class="own">${seg('s1',own,'Founders')}${seg('s2',A,'Investor A')}${two?seg('s3',B,'Investor B'):''}</div></div>
          <div class="stats" style="margin-top:12px">${ctx.ui.stat('Founders own',pct(own,1),own<0.5?'warn':'')}${ctx.ui.stat('Company valued at',mm(val),'','after the money')}${ctx.ui.stat('Founders\' stake worth',mm(own*val),'good','on paper')}</div>
          <p class="w-hint" style="margin-top:8px">${own<0.5?'The founders have lost majority control, unless the shareholders\' agreement says otherwise. Agree in advance which decisions need whose consent.':own<2/3?'Below two-thirds, founders may no longer be able to pass some major decisions alone: in many countries changes to the company\'s articles, mergers or selling the business need a two-thirds or larger vote. Check your own law and the shareholders\' agreement.':'Founders keep clear control, though investors will still ask for vetoes on key decisions.'} A smaller share of a bigger, better-funded business can be worth far more than all of a small one.</p>`;
      }
      ready=true; draw();
    }),
    K('Control isn\'t only about percentages',
      `<p>A 25% investor often gets board seats and vetoes over the budget, borrowing, acquisitions, hiring the CEO and selling the company. Read the shareholders' agreement as carefully as the price: <strong>who decides what</strong>, and <strong>who can force a sale, and when</strong>.</p>`)
  ]},
  /* ---------------------------------------------------------------- 2 */
  {id:'value', label:'Value to cash', kind:'play', title:'From a headline value to cash in the sellers\' hands', blocks:[
    `<p>Buyers usually price a company as a multiple of its earnings, often EBITDA (Module 20). That gives the <strong>enterprise value</strong>, the value of the whole business. The sellers receive the <strong>equity value</strong>: what's left after debt and anything that behaves like debt, adjusted for whether the business is handed over with a normal level of working capital.</p>`,
    W('Enterprise value to equity value', function(el,ctx){
      const top=E('div'), br=E('div'), out=E('div'); el.append(top,br,out);
      const EB=12.2, ND=18, RET=2.0, TAX=1.5, LEASE=4.0, PEG=28;
      const lb=ctx.ui.liveBridge(br); let v={x:9,wc:26}, ready=false;
      ctx.ui.sliders(top,[{k:'x',label:'Multiple of EBITDA',min:6,max:14,step:0.5,v:9,f:x=>x.toFixed(1)+'×'},{k:'wc',label:'Working capital at completion',min:22,max:32,step:0.5,v:26,f:x=>'$'+x.toFixed(1)+'m (normal: $28m)'}],x=>{ v=x; if(ready) draw(); },ctx.uid);
      function draw(){ const EV=EB*v.x, wcAdj=v.wc-PEG, eq=EV-ND-RET-TAX-LEASE+wcAdj;
        lb([{label:`Enterprise value (${v.x.toFixed(1)}× $${EB}m EBITDA)`,v:EV,total:true},{label:'Net bank debt',v:-ND},{label:'Lease liabilities',v:-LEASE},{label:'Unfunded staff retirement obligations',v:-RET},{label:'Tax owed for past years',v:-TAX},{label:'Working capital above or below normal',v:wcAdj},{label:'Equity value: what the sellers receive',v:eq,total:true}].map(s=>Object.assign(s,{v:Math.round(s.v*10)/10*1e6})));
        out.innerHTML=`<p class="w-hint" style="margin-top:10px">${wcAdj<0?`Working capital is ${mm(-wcAdj)} below the agreed normal level, the "peg". Running stock and receivables down before completion just reduces the price, dollar for dollar.`:wcAdj>0?'Leaving extra working capital in the business is paid for by the buyer, dollar for dollar.':'Working capital exactly at the peg: no adjustment.'} Every $1 of EBITDA is worth ${v.x.toFixed(1)} dollars of value here; every $1 of debt-like items is worth exactly $1 off.</p>`; }
      ready=true; draw();
    }),
    TIP('What counts as "debt-like"',
      `<p>Buyers deduct anything that will cost cash and relates to the time before the sale: bank loans, lease liabilities, unpaid taxes, unfunded staff retirement obligations (under Philippine law, RA 7641, staff retiring at 60 or over with at least five years\' service are owed at least 22.5 days\' pay per year of service), deferred payments for past acquisitions, and sometimes customer deposits. Each is negotiated. Knowing them before a buyer finds them protects your price.</p>`)
  ]},
  /* ---------------------------------------------------------------- 3 */
  {id:'qoe', label:'Quality of earnings', kind:'play', title:'Quality of earnings: what buyers will adjust', blocks:[
    `<p>Before an investor or buyer agrees a price, accountants they hire prepare a <span class="term">quality of earnings</span> report: what the business really earns in a normal year. Sellers present "adjusted EBITDA" with costs they consider one-off added back. Buyers check every adjustment. Here is BraceWorks Group's: reported EBITDA <strong>$12.18 million</strong>, adjusted by the sellers to <strong>$13.5 million</strong>. At 9× EBITDA, each adjustment is worth nine times its size.</p>`,
    W('Review the sellers\' adjustments', function(el,ctx){
      const BASE=12.18, X=9;
      const IT=[
        {t:'Add back $0.30m of legal costs from a patent case, won and closed',v:0.30,seller:true,right:true,why:'Genuinely one-off and finished: a fair add-back.'},
        {t:'Add back $0.50m of recall costs, "one-off"',v:0.50,seller:true,right:false,why:'The third field action in five years. In device making, recalls are a cost of doing business: buyers leave them in.'},
        {t:'Add back $0.12m of salaries for two family members who leave at the sale',v:0.12,seller:true,right:true,why:'Accepted if their contracts really end and no one replaces them.'},
        {t:'Add back $0.40m of savings from a planned move to a cheaper warehouse',v:0.40,seller:true,right:false,why:'Not signed, not achieved. Buyers pay for savings once they\'re real, not planned.'},
        {t:'The owner is paid $90,000; a market-rate group CEO would cost $250,000',v:-0.16,seller:false,right:true,why:'The buyer will need to pay market rates, so it deducts the difference.'},
        {t:'The Manila factory is rented from the owner at $0.2m a year below market',v:-0.20,seller:false,right:true,why:'After the sale the rent goes to market rates. Buyers deduct the difference.'}];
      const S=ctx.state; S.m28q=S.m28q||{}; const st=S.m28q;
      el.innerHTML=`<div class="rs-list"></div><div class="rs-run"><span>Normalised EBITDA: <b class="q-e"></b></span><span>Value at 9×: <b class="q-v"></b></span></div><div class="rs-end"></div><p style="margin-top:8px"><button type="button" class="linkbtn q-reset">Start again</button></p>`;
      const list=el.querySelector('.rs-list');
      IT.forEach((it,i)=>{ const yes=it.seller?'Accept the add-back':'Make the deduction', no=it.seller?'Reject it':'Ignore it';
        const d=E('div','rs-i',`<h5>${i+1}. ${it.t}</h5><div class="rs-b"><button type="button" class="btn small ghost" data-c="y">${yes}</button><button type="button" class="btn small ghost" data-c="n">${no}</button></div><div class="rs-v" hidden></div>`); list.appendChild(d);
        const v=d.querySelector('.rs-v');
        const show=()=>{ const c=st[i]; if(!c) return; d.classList.add('done'); d.querySelectorAll('[data-c]').forEach(b=>{ b.disabled=true; if(b.dataset.c===c) b.classList.remove('ghost'); });
          const ok=(c==='y')===it.right; v.hidden=false; v.className='rs-v '+(ok?'ok':'no'); v.innerHTML=`<strong>${ok?'Agreed.':'A buyer would disagree.'}</strong> ${it.why}`; };
        d.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{ st[i]=b.dataset.c; ctx.save(); show(); upd(); }); show(); });
      function upd(){ const e=BASE+IT.reduce((t,it,i)=>t+(st[i]==='y'?it.v:0),0), n=IT.filter((it,i)=>st[i]).length;
        el.querySelector('.q-e').textContent='$'+e.toFixed(2)+'m'; el.querySelector('.q-v').textContent='$'+(e*X).toFixed(1)+'m';
        const end=el.querySelector('.rs-end'); if(n<IT.length){ end.innerHTML=''; return; }
        const right=IT.filter((it,i)=>(st[i]==='y')===it.right).length; const fair=BASE+IT.filter(it=>it.right).reduce((t,it)=>t+it.v,0);
        end.innerHTML=`<div class="msg ${right===IT.length?'good':'warn'}" style="margin-top:12px"><strong>${right} of ${IT.length} calls match a careful buyer.</strong> A buyer would likely accept about <strong>$${fair.toFixed(2)}m</strong> of EBITDA, against the sellers' $13.5m: at 9×, a difference of about <strong>$${((13.5-fair)*X).toFixed(1)}m</strong> in price. Sellers who prepare their own quality of earnings report find these gaps first, and fix or explain them before the buyer does.</div>`; }
      el.querySelector('.q-reset').onclick=()=>{ Object.keys(st).forEach(k=>delete st[k]); ctx.save(); BW.go(ctx.mod.id,ctx.mod.sections.indexOf(ctx.sec)); };
      upd();
    })
  ]},
  /* ---------------------------------------------------------------- 4 */
  {id:'ready', label:'Getting ready', kind:'learn', title:'Getting ready: the three years before', blocks:[
    `<p>The best-prepared companies raise money or sell on better terms and faster, because buyers trust what they see. Preparation takes years, not months. Press <strong>Play</strong>.</p>`,
    {t:'fig', title:'Three years to investor-ready', intro:'Press <strong>Play</strong> to walk through the timeline.',
      steps:[
        {k:['n0'],t:'<strong>Three years before.</strong> Audited accounts under the rulebook investors expect (often full IFRS), consistently for three years. A clean group structure: every company owned as it should be, related-party deals with the owners ended or put on market terms (Module 27).'},
        {k:['n0','e0','n1'],t:'<strong>Two years before.</strong> A monthly group pack by about working day 10 (Module 25), budgets that come true, KPI history, written contracts with key customers, distributors and suppliers, regulatory files and approvals in order, and a tax health check including transfer pricing (Module 24).'},
        {k:['n1','e1','n2'],t:'<strong>One year before.</strong> A strong finance team and CFO; an independent director or two; your own quality of earnings and legal review ("vendor due diligence"); a data room with every document a buyer will ask for; and a clear story of where growth will come from.'},
        {k:['n2','e2','n3'],t:'<strong>The deal.</strong> A letter of intent, then weeks of due diligence by the buyer\'s accountants, lawyers and technical experts, then negotiating the sale agreement. The business must keep hitting its forecast throughout: missing a month mid-deal costs value.'},
        {k:['n3','e3','n4'],t:'<strong>After the deal.</strong> Earn-out targets, investor reporting, board meetings and a new rhythm. Many promises in the sale agreement are tested in the first year.'}],
      draw:BW.viz.flow({label:'Three years before, two years before, one year before, the deal, after the deal.',labels:['','','','',''],edgeK:['e0','e1','e2','e3'],
        nodes:[{t:'Year −3',s:'audited accounts, clean structure',k:'n0'},{t:'Year −2',s:'reporting, contracts, tax health',k:'n1'},{t:'Year −1',s:'team, own due diligence, data room',k:'n2'},{t:'The deal',s:'due diligence, sale agreement',k:'n3'},{t:'After',s:'earn-outs, investor reporting',k:'n4'}]})},
    Q('Which preparation step most often protects the price?',['A glossy presentation','Your own quality of earnings and legal review before buyers arrive, so problems are fixed or explained first','Hiring the most expensive bank','Holding back bad news until after signing'],1,'Surprises found by the buyer cut the price or kill the deal. Problems found by you can be fixed or framed.')
  ]},
  /* ---------------------------------------------------------------- 5 */
  {id:'deal', label:'Deal terms', kind:'learn', title:'Deal terms that move money after the price is agreed', blocks:[
    `<p>The headline price is only the start. These terms decide how much the sellers actually keep.</p>`,
    {t:'tbl', head:['Term','What it means','Watch for'], rows:[
      ['<strong>Locked box</strong>','Price fixed on a past balance sheet date; the buyer gets the profits from then on, and the sellers promise no cash "leaks" out to them','Simple and certain, but every payment to the sellers after the box date must be allowed in the contract'],
      ['<strong>Completion accounts</strong>','Price adjusted after the deal for actual debt, cash and working capital on the completion date','Arguments over how the completion accounts are prepared'],
      ['<strong>Working capital peg</strong>','The "normal" working capital the business must be handed over with','A peg set too high quietly cuts the price'],
      ['<strong>Earn-out</strong>','Part of the price paid later if targets are hit','Targets the new owner can influence; define them precisely'],
      ['<strong>Escrow or holdback</strong>','Part of the price held back to cover claims','How much, for how long, and what releases it'],
      ['<strong>Warranties and indemnities</strong>','Sellers\' promises about the business, and compensation if they prove untrue','Disclose problems in advance; warranty insurance can cover some claims']
    ]},
    Q('An earn-out pays the sellers $10 million more if group EBITDA reaches $15 million in two years. What is the biggest risk for the sellers?',[
      'Tax on the payment','The buyer controls costs, pricing and investment after the sale, and can affect whether the target is hit','The payment is too large','Interest rates'],1,
      'Agree exactly how EBITDA will be measured, what the buyer may and may not change, and what happens if the business is merged or restructured.')
  ]},
  /* ---------------------------------------------------------------- 6 */
  {id:'ipo', label:'Listing', kind:'learn', title:'A stock market listing: what changes', blocks:[
    `<p>A listing (an initial public offering, or IPO) raises money from many investors and creates a market for the shares. It also changes how the company is run, permanently.</p>`,
    {t:'tbl', head:['Before listing','After listing'], rows:[
      ['Accounts audited once a year','Interim and annual reports to tight deadlines; some markets require quarterly reports'],
      ['News shared when you choose','Price-sensitive news disclosed promptly to everyone at the same time'],
      ['A board of owners and friends','Independent directors, board committees and a code of corporate governance'],
      ['Owners trade shares privately','Insider trading rules, blackout periods, disclosure of directors\' dealings'],
      ['Investors you know','Thousands of shareholders, analysts and short sellers reading every note']
    ]},
    K('Which exchange?',
      `<p>Each exchange, such as the Philippine Stock Exchange in Manila, Singapore Exchange, Hong Kong Exchanges or Nasdaq in New York, sets its own rules on track record, profits, how many shares must be held by the public, and governance. The choice depends on where your investors and peers are listed and where analysts understand medical devices. Advisers can compare them; start the conversation two to three years ahead.</p>`),
    Q('Why do investors scrutinise "adjusted" measures and related-party deals so closely before a listing?',[
      'Regulators require it, nothing more','They show whether management reports honestly and runs the company for all shareholders, not just the founders','Adjusted measures are always wrong','Related parties are illegal'],1,
      'Credibility is the asset you sell in a listing. Flattering measures and self-dealing destroy it.')
  ]},
  /* ---------------------------------------------------------------- 7 */
  {id:'case', label:'Case: the term sheet', kind:'case', title:'The private equity term sheet', blocks:[
    CASE('An offer on the table',
      `<p>A private equity fund offers <strong>$30 million for 40%</strong> of BraceWorks Group to fund the Vietnam factory and two acquisitions. The headline values the business at $75 million after the new money ($45 million before it). The term sheet also includes: two of five board seats; vetoes on the budget, borrowing over $5 million, acquisitions and senior hires; a <strong>2× liquidation preference</strong> (the fund gets twice its money back before the founders get anything in a sale); and the right to force a sale of the whole company after five years if it hasn't exited.</p>`),
    Q('Which terms deserve the hardest negotiation?',[
      {text:'Only the price', why:'Price matters, but the other terms can transfer far more value and control.'},
      {text:'The 2× liquidation preference and the forced-sale right: in a modest sale, the founders could get much less than 60% of the proceeds, and lose the timing of the exit'},
      {text:'The number of board seats', why:'Two of five is normal for a 40% investor. The economic terms matter more.'},
      {text:'The vetoes on the budget', why:'Usual for this size of stake; ask that they lapse if the business performs.'}],1,
      'With a 2× preference, a sale at $90 million would pay the fund $60 million first, leaving $30 million for founders who own 60% (that is with a non-participating preference; a participating one would also take 40% of the remaining $30 million). Push for a 1× non-participating preference, and an exit right with a longer horizon and founder consent on the process.')
  ]},
  /* ---------------------------------------------------------------- 8 */
  {id:'quiz', label:'Quiz', kind:'quiz', title:'Check your understanding', blocks:[
    Q('An investor puts in $20m at a $60m pre-money valuation. What share does it own?',['20%','25%','33%','40%'],1,'$20m ÷ ($60m + $20m) = 25%.'),
    Q('Enterprise value is $110m, net debt $18m and lease liabilities $4m. Ignoring other items, what is the equity value?',['$110m','$92m','$88m','$132m'],2,'$110m − $18m − $4m = $88m.'),
    Q('Which add-back would a buyer most likely reject?',['Legal costs of a finished, one-off lawsuit','Recall costs at a device maker that has had three field actions in five years','Salaries of family members who leave at the sale','Costs of the sale process itself'],1,'Recurring "one-offs" are part of normal earnings.'),
    Q('In a locked-box deal, what must the sellers avoid after the box date?',['Making sales','Taking cash out of the business (leakage) except as agreed','Hiring','Paying suppliers'],1,'The price is fixed on the box date, so value leaving the business afterwards is "leakage".'),
    Q('Why prepare a data room and your own due diligence a year ahead?',['Buyers require a year','So problems are found, fixed or explained before buyers find them','It reduces tax','It replaces the audit'],1,'Preparation protects price and speed.')
  ]},
  /* ---------------------------------------------------------------- 9 */
  {id:'apply', label:'Practice', kind:'apply', title:'Is your group investor-ready?', blocks:[
    `<p>Optional. Ticks are saved only in this browser.</p>`,
    CHECK('m28-ready','We could show an investor…',[
      'Three years of audited accounts under the rulebook they expect',
      'A clean group structure, with related-party deals ended or on market terms',
      'A monthly group pack by about day 10, and budgets that came true',
      'Our own adjusted EBITDA, with every adjustment explained and supported',
      'A list of debt-like items: leases, retirement obligations, unpaid taxes, deferred payments',
      'Written contracts with key customers, distributors and suppliers, and regulatory approvals in order',
      'A finance team and board that would survive an investor\'s questions'
    ]),
    REPORT('Your Monday-morning question',
      `<p>Ask: <strong>"If a buyer's accountants arrived next month, what would they adjust in our EBITDA, and what would they deduct as debt?"</strong> Fix those before you need the money.</p>`),
    K('Takeaways',
      `<ul>
        <li>Each source of money comes with strings; read control rights as carefully as the price.</li>
        <li>A smaller share of a bigger business can be worth more, but know which decisions you can still make.</li>
        <li>Enterprise value minus debt and debt-like items, adjusted for working capital, is what sellers receive.</li>
        <li>Buyers normalise earnings; recurring "one-offs" and planned savings won't survive.</li>
        <li>Investor readiness takes about three years: audited accounts, clean structure, reliable reporting, credible metrics.</li>
       </ul>`)
  ]}
  ],
  warnings:[
    {sign:'"Adjusted EBITDA" far above reported, with the same add-backs every year', meaning:'Buyers will reverse them; the price expectation is too high.', look:'Add-back history and support.'},
    {sign:'Related-party deals with the owners at off-market terms', meaning:'Buyers will adjust earnings and question governance.', look:'Related-party list and contracts.'},
    {sign:'A term sheet with high liquidation preferences or forced-sale rights', meaning:'Founders may receive far less than their percentage suggests.', look:'Waterfall of proceeds under several sale prices.'},
    {sign:'Working capital run down just before a sale', meaning:'Price falls dollar for dollar through the peg.', look:'Normal working capital over 12–24 months.'}
  ],
  formulas:[
    {name:'Investor\'s share', f:'Money invested ÷ (Pre-money value + Money invested)', ex:'$20m ÷ ($60m + $20m) = 25%'},
    {name:'Equity value', f:'Enterprise value − Net debt − Debt-like items ± (Working capital − Peg)', ex:'$109.8m − $18m − $7.5m − $2m = $82.3m'}
  ],
  glossary:[
    {term:'Pre-money valuation', def:'The value agreed for a company before new investment; adding the investment gives the post-money valuation.'},
    {term:'Dilution', def:'The fall in existing owners\' percentage when new shares are issued to investors.'},
    {term:'Quality of earnings', def:'An accountant\'s review of what a business really earns in a normal year, testing every adjustment to reported profit.'},
    {term:'Debt-like items', def:'Obligations a buyer deducts from enterprise value like debt: leases, unpaid taxes, unfunded retirement obligations, deferred payments.'},
    {term:'Working capital peg', def:'The normal level of working capital a business must be handed over with in a sale; differences adjust the price.'},
    {term:'Locked box', def:'A deal where the price is fixed on a past balance sheet and the sellers promise no value leaks to them afterwards.'},
    {term:'Earn-out', def:'Part of a sale price paid later only if agreed targets are met.'},
    {term:'Liquidation preference', def:'An investor\'s right to be paid back a set multiple of its money before other shareholders receive anything in a sale.'},
    {term:'Data room', def:'A secure online folder of every document buyers or investors will review in due diligence.'},
    {term:'Initial public offering (IPO)', def:'A company\'s first sale of shares to the public and listing on a stock exchange.'}
  ]
});
})();
