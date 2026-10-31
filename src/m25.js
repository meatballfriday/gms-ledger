/* ===== Module 25: Running group finance across countries (optional: growing into a multinational) ===== */
(function(){
const {K,TIP,FLAG,CASE,REPORT,Q,FS,FLIP,SORT,CHECK,W,money,signed,pct,kfmt} = BW.h;
const m$=v=>money(Math.round(v));
const E=(tag,cls,html)=>{ const e=document.createElement(tag); if(cls) e.className=cls; if(html!=null) e.innerHTML=html; return e; };

BW.add({
  id:'m25', minutes:60,
  title:'Running group finance across countries',
  subtitle:'When BraceWorks has companies in five countries, finance is no longer one set of books. How the finance team, systems, monthly close and group reporting have to grow with the business, and what the GM should insist on.',
  goals:[
    'Know which finance roles and systems a growing group needs, and roughly when',
    'Plan an accounting system (ERP) change without wrecking a peak season',
    'Run one monthly close across several companies and still report within about ten working days',
    'Reconcile intercompany balances and explain why they don\'t match',
    'Follow how local books become group accounts, and what each country still needs on its own',
    'Read group reporting by country and in constant currency, and know when the global minimum tax applies'
  ],
  sections:[
  /* ---------------------------------------------------------------- 1 */
  {id:'stages', label:'How finance grows', kind:'play', title:'How the finance team grows with you', blocks:[
    `<p>Picture BraceWorks a few years from now: <strong>about 650 people</strong>, a factory in the Philippines and a second one in Vietnam, and sales companies in Germany, the United States and Australia. Five companies, five currencies, five tax authorities and five sets of auditors.</p>
     <p>The two-person finance team that served a 50-person exporter can't run that. But hiring a full corporate finance department too early wastes money. The skill is to hire <strong>just ahead of the complexity</strong>. Move the sliders to see what a company of each size usually needs.</p>`,
    W('Finance team builder', function(el,ctx){
      const R=[
        {k:'book',t:'Bookkeeper',d:'Records transactions, pays bills, runs payroll inputs.',on:(p,e)=>true},
        {k:'acct',t:'Accountant',d:'Closes the month, reconciles, prepares tax filings.',on:(p,e)=>p>=30},
        {k:'ctrl',t:'Financial controller',d:'Owns the close, controls and the monthly pack.',on:(p,e)=>p>=80},
        {k:'fd',t:'Head of finance',d:'Budget, bank relationships, the numbers behind decisions.',on:(p,e)=>p>=150},
        {k:'fpa',t:'Planning and analysis',d:'Forecasts, budgets, product and customer profitability.',on:(p,e)=>p>=150},
        {k:'grp',t:'Group accountant',d:'Consolidation, intercompany, group policies.',on:(p,e)=>e>=2},
        {k:'ctry',t:'Finance lead in each country',d:'Local books, local tax and audit; reports to group.',on:(p,e)=>e>=3},
        {k:'tax',t:'Tax manager',d:'Transfer pricing, withholding, compliance calendar.',on:(p,e)=>e>=3},
        {k:'cfo',t:'Chief financial officer',d:'Strategy, funding, investors, the board.',on:(p,e)=>p>=300||e>=4},
        {k:'trs',t:'Treasury manager',d:'Cash across countries, currency hedging, banks.',on:(p,e)=>e>=4||p>=500},
        {k:'ia',t:'Internal audit',d:'Independent checks; reports to the audit committee.',on:(p,e)=>p>=500}];
      const SYS=(p,e)=>e>=4?'Group ERP on one chart of accounts, plus a consolidation tool':p>=150||e>=2?'An ERP with multi-currency, intercompany, standard costing and lot traceability':'Small-business accounting software and spreadsheets';
      const top=E('div'), grid=E('div','ft-grid'), out=E('div'); el.append(top,grid,out);
      let ready=false, v={p:50,e:1};
      ctx.ui.sliders(top,[{k:'p',label:'People',min:20,max:1000,step:10,v:50,f:x=>x+' people'},{k:'e',label:'Companies in the group',min:1,max:6,step:1,v:1,f:x=>x+(x===1?' company':' companies')}],x=>{ v=x; if(ready) draw(); },ctx.uid);
      grid.innerHTML=R.map(r=>`<div class="ft-card" data-k="${r.k}"><b>${r.t}</b><span>${r.d}</span></div>`).join('');
      function draw(){ let n=0; R.forEach(r=>{ const on=r.on(v.p,v.e); grid.querySelector(`[data-k="${r.k}"]`).classList.toggle('on',on); if(on) n++; });
        out.innerHTML=`<div class="stats" style="margin-top:12px">${ctx.ui.stat('Finance roles needed',n+' of '+R.length)}${ctx.ui.stat('Systems',SYS(v.p,v.e))}</div><p class="w-hint" style="margin-top:8px">${v.e>=3&&v.p<300?'Several countries but still mid-sized: buy in what you can\'t justify full-time, such as local accountants in each country, a tax adviser for transfer pricing, or a part-time CFO.':v.p>=500?'At this size, finance is a department of 15 to 40 people across countries, and the CFO sits on the leadership team.':'Rules of thumb, not laws: a complex product range or heavy regulation pulls each step earlier.'}</p>`; }
      ready=true; draw();
    }),
    K('The GM\'s job in building finance',
      `<ul>
        <li><strong>Hire one step ahead.</strong> The group accountant should arrive before the second company opens, not after the first messy consolidation.</li>
        <li><strong>Buy in specialists</strong> you can't justify full-time: local accountants and payroll providers, a transfer pricing adviser, a fractional CFO.</li>
        <li><strong>Write the rules once.</strong> A group accounting manual (policies, chart of accounts, close calendar, approval limits) that every country follows.</li>
       </ul>`)
  ]},
  /* ---------------------------------------------------------------- 2 */
  {id:'systems', label:'Systems', kind:'learn', title:'From accounting software to an ERP', blocks:[
    `<p>Most small manufacturers start with small-business accounting software and spreadsheets. Somewhere between 150 and 300 people, or when the second company opens, that stops working: stock, costing, purchasing and sales live in different places, and the month-end close becomes a spreadsheet marathon. The answer is usually an <span class="term">ERP</span>: one system for orders, purchasing, production, stock and accounts.</p>`,
    {t:'tbl', head:['A device maker\'s ERP must handle…','Why'], rows:[
      ['Lot and serial traceability','Recalls and regulators: you must trace each batch to its customers (Module 21)'],
      ['Standard costing and variances','Product cost, stock value and margin by product (Modules 6–8)'],
      ['Several companies and currencies','Each country\'s books in its own currency, rolled up in dollars'],
      ['Intercompany trading','Sales between group companies booked on both sides automatically'],
      ['One chart of accounts and one item list','So every country reports the same way and products have one code'],
      ['Approval workflows','Purchase and payment limits enforced by the system, not by memory (Module 27)']
    ]},
    K('How ERP projects go wrong',
      `<ul>
        <li><strong>Going live in peak season</strong>, or with everything at once.</li>
        <li><strong>Dirty data:</strong> duplicate customers, wrong bills of materials and old prices copied into the new system.</li>
        <li><strong>No dress rehearsal:</strong> no full test of a month's orders, shipments and invoices before go-live.</li>
        <li><strong>No "stop or go" decision</strong> with a plan B if testing fails.</li>
       </ul>`),
    SORT('Before the go-live: essential, or nice to have?',['Essential','Can wait'],[
      {text:'Cleaning customer, supplier and product master data', a:0, why:'Bad data in means bad orders, invoices and costs out.'},
      {text:'A full test run of a month\'s orders through to invoices and stock', a:0, why:'The only way to find gaps before customers do.'},
      {text:'Choosing a go-live date outside the busiest weeks', a:0, why:'If it goes wrong, it should go wrong when you can recover.'},
      {text:'Extra stock and cash buffer for the first two months', a:0, why:'Shipments slow down after almost every go-live.'},
      {text:'Fancy management dashboards', a:1, why:'Useful later. First the system must take orders, ship and invoice.'},
      {text:'Custom features copied from the old system', a:1, why:'Each one adds cost and risk. Change the process to fit standard features where you can.'}
    ]),
    Q('An ERP supplier proposes going live on 1 October, just before BraceWorks\' busiest quarter, "so the new year starts clean". What should you ask for?',[
      'Accept: a clean year-end is worth it','A date in a quiet period, a full dress rehearsal, a stop-or-go checkpoint and a fallback plan','Go live in stages but skip testing','Delay until every custom feature is built'],1,
      'A failed go-live in peak season hurts customers, revenue and cash all at once. Quiet period, dress rehearsal, checkpoint, fallback.')
  ]},
  /* ---------------------------------------------------------------- 3 */
  {id:'close', label:'The group close', kind:'play', title:'One close, five sets of books', blocks:[
    `<p>A group month-end close is a relay: each country closes its own books, intercompany balances are agreed, each company's figures are mapped into the group format, translated into dollars and consolidated. The group pack can only go out after the slowest runner finishes. Try the changes that usually make the biggest difference.</p>`,
    W('Group close timeline', function(el,ctx){
      const ENT=[['Philippines',5],['Vietnam',8],['Germany',4],['United States',4],['Australia',4]];
      const O=[{k:'cal',t:'A shared close calendar with fixed deadlines',save:'The slowest country closes on day 6, not day 8'},{k:'coa',t:'One chart of accounts in every country',save:'No mapping step: 2 days saved'},{k:'ic',t:'Intercompany balances agreed before month-end',save:'No chasing differences: 3 days saved'},{k:'tool',t:'A consolidation tool instead of spreadsheets',save:'1 day saved, and fewer formula errors'}];
      const S=ctx.state; S.m25c=S.m25c||{}; const st=S.m25c;
      el.innerHTML=`<div class="gc-opts">${O.map(o=>`<label class="gc-o"><input type="checkbox" data-k="${o.k}"><span><b>${o.t}</b><small>${o.save}</small></span></label>`).join('')}</div><div class="gc"></div><div class="gc-out"></div>`;
      const gc=el.querySelector('.gc'), out=el.querySelector('.gc-out');
      el.querySelectorAll('input[data-k]').forEach(i=>{ i.checked=!!st[i.dataset.k]; i.onchange=()=>{ st[i.dataset.k]=i.checked; ctx.save(); draw(); }; });
      const MAXD=22;
      gc.innerHTML=`<div class="gc-axis">${[...Array(MAXD)].map((_,d)=>`<span>${d+1}</span>`).join('')}</div>`+ENT.map(e=>`<div class="gc-row"><span class="gc-l">${e[0]}</span><span class="gc-t"><i class="gc-b loc"></i></span></div>`).join('')+
        `<div class="gc-row"><span class="gc-l">Map to group format</span><span class="gc-t"><i class="gc-b map"></i></span></div><div class="gc-row"><span class="gc-l">Agree intercompany</span><span class="gc-t"><i class="gc-b ic"></i></span></div><div class="gc-row"><span class="gc-l">Consolidate and review</span><span class="gc-t"><i class="gc-b con"></i></span></div><div class="gc-row tot"><span class="gc-l">Group pack issued</span><span class="gc-t"><i class="gc-b fin"></i></span></div>`;
      function draw(){
        const loc=ENT.map(e=>st.cal?Math.min(e[1],6):e[1]), lmax=Math.max(...loc);
        const map=st.coa?0:2, ic=st.ic?0:3, con=st.tool?2:3, done=lmax+map+ic+con;
        const P=d=>(d/MAXD*100).toFixed(2)+'%';
        const bars=gc.querySelectorAll('.gc-b');
        loc.forEach((d,i)=>{ bars[i].style.left='0%'; bars[i].style.width=P(d); bars[i].dataset.tip=`${ENT[i][0]}|closes on day ${d}`; });
        const set=(b,s,len,t)=>{ b.style.left=P(s); b.style.width=len?P(len):'0%'; b.style.opacity=len?1:.15; b.dataset.tip=t; };
        set(bars[5],lmax,map,map?`Mapping|${map} days`:'Mapping|not needed');
        set(bars[6],lmax+map,ic,ic?`Intercompany|${ic} days`:'Intercompany|agreed in advance');
        set(bars[7],lmax+map+ic,con,`Consolidation|${con} days`);
        set(bars[8],done-0.6,0.6,`Group pack|day ${done}`);
        out.innerHTML=`<div class="stats" style="margin-top:12px">${ctx.ui.stat('Group pack issued on',`working day ${done}`,done<=10?'good':done<=14?'warn':'bad')}${ctx.ui.stat('Slowest country',ENT[loc.indexOf(lmax)][0]+', day '+lmax)}</div><p class="w-hint" style="margin-top:8px">${done<=10?'A group pack by about day 10 is a good standard for a group this size. Decisions are made on last month, not the month before.':done<=14?'Better. The rest usually comes from agreeing intercompany before month-end and closing every country to the same calendar.':'By working day 16, most of the next month has gone before anyone sees last month\'s numbers. Each fix here is a process decision, not a hiring one.'}</p>`;
      }
      draw();
    }),
    TIP('Fix the close before buying software',
      `<p>Most delay comes from process, not systems: no fixed calendar, different charts of accounts, intercompany balances argued over after month-end. A consolidation tool helps, but only once those are fixed.</p>`)
  ]},
  /* ---------------------------------------------------------------- 4 */
  {id:'ic', label:'Intercompany', kind:'play', title:'Intercompany: the group trading with itself', blocks:[
    `<p>BraceWorks Philippines makes the braces; BraceWorks Europe in Germany buys them and sells them to hospitals. Every shipment creates a receivable in Manila and a payable in Germany. In the group accounts the two must cancel exactly. When they don't, the consolidation stalls until someone explains the difference.</p>`,
    W('Explain the intercompany gap', function(el,ctx){
      const PH=1050000, DE=1028500;
      const IT=[
        {t:'An invoice for $16,500 dated 30 June: Manila booked it; Germany will book it when the goods arrive in July',v:16500,ok:true,why:'Goods in transit: a timing difference. Agree a rule: the buyer books at the seller\'s shipping date.'},
        {t:'Germany converted its euro payable at the month-end rate; Manila used the rate on each invoice date',v:5000,ok:true,why:'Currency: both sides should use the same rate for intercompany, set by group.'},
        {t:'A $12,000 credit note for damaged braces that Manila hasn\'t issued yet',v:12000,ok:false,why:'Plausible, but not in the evidence here. Check before you assume.'},
        {t:'Manila received $20,000 from Germany on 29 June that Germany hasn\'t recorded yet',v:20000,ok:false,why:'That would make Germany\'s payable <em>higher</em> than Manila\'s receivable, the opposite of what we see. It doesn\'t fit.'}];
      const S=ctx.state; S.m25ic=S.m25ic||{}; const st=S.m25ic;
      el.innerHTML=`<div class="stats"><div class="stat"><div class="stat-l">Manila: receivable from Germany</div><div class="stat-v">${m$(PH)}</div></div><div class="stat"><div class="stat-l">Germany: payable to Manila (in $)</div><div class="stat-v">${m$(DE)}</div></div><div class="stat ic-gap"><div class="stat-l">Unexplained difference</div><div class="stat-v"></div></div></div>
        <p class="w-hint" style="margin:10px 0 6px">Tick the items that explain the gap. Only two of them are supported by the evidence.</p><div class="ic-list">${IT.map((x,i)=>`<label class="gc-o"><input type="checkbox" data-i="${i}"><span><b>${x.t}</b><small class="ic-why" hidden></small></span></label>`).join('')}</div><div class="ic-out"></div>`;
      const gapEl=el.querySelector('.ic-gap .stat-v'), gapBox=el.querySelector('.ic-gap'), out=el.querySelector('.ic-out');
      el.querySelectorAll('input[data-i]').forEach(inp=>{ const i=+inp.dataset.i; inp.checked=!!st[i]; inp.onchange=()=>{ st[i]=inp.checked; ctx.save(); draw(); }; });
      function draw(){ let gap=PH-DE; IT.forEach((x,i)=>{ const w=el.querySelector(`input[data-i="${i}"]`).closest('label').querySelector('.ic-why'); if(st[i]){ gap-=x.v; w.hidden=false; w.innerHTML=(x.ok?'✓ ':'✗ ')+x.why; w.style.color=x.ok?'var(--good)':'var(--red)'; } else w.hidden=true; });
        gapEl.textContent=m$(gap); gapBox.classList.toggle('good',gap===0); gapBox.classList.toggle('bad',gap<0);
        out.innerHTML=gap===0&&IT.every((x,i)=>!!st[i]===x.ok)?`<div class="msg good" style="margin-top:10px">Reconciled: $21,500 = $16,500 in transit + $5,000 of currency. Both are rule problems, not errors. A group intercompany policy (same cut-off, same rate, monthly agreement before close) makes them disappear.</div>`:gap<0?`<div class="msg bad" style="margin-top:10px">You've explained more than the gap. One of your items doesn't belong.</div>`:'';
      }
      draw();
    }),
    K('An intercompany policy in five lines',
      `<ol>
        <li>Every intercompany sale has an invoice, in an agreed currency, under a written agreement (Module 24).</li>
        <li>The buyer books goods when the seller ships them, not when they arrive.</li>
        <li>Both sides convert at the same rate, set by group each month.</li>
        <li>Balances are confirmed between companies before month-end, and differences fixed by the seller.</li>
        <li>Intercompany debts are settled regularly, ideally through netting (Module 26), so balances don't build up for years.</li>
       </ol>`)
  ]},
  /* ---------------------------------------------------------------- 5 */
  {id:'gaap', label:'Local to group', kind:'learn', title:'From local books to group accounts', blocks:[
    `<p>Each company keeps its books in its own currency, under its own country's rules, and files its own statutory accounts and tax return. The group accounts are built on top. Press <strong>Play</strong> to follow BraceWorks Vietnam's numbers into the group.</p>`,
    {t:'fig', title:'From Vietnam\'s books to the group accounts', intro:'Press <strong>Play</strong> to go step by step.',
      steps:[
        {k:['n0'],t:'<strong>Local books.</strong> BraceWorks Vietnam records everything in Vietnamese dong, under Vietnamese accounting rules. These books are the basis for its local tax return and statutory audit, and they never stop being needed.'},
        {k:['n0','e0','n1'],t:'<strong>Align to group policies.</strong> Adjust anything that local rules treat differently from the group\'s rulebook: for example leases on the balance sheet under IFRS 16, or a different depreciation life (Module 21).'},
        {k:['n1','e1','n2'],t:'<strong>Translate into dollars.</strong> Balance sheet at the closing rate, income statement at the average rate. The difference goes to the translation reserve in equity, not to profit (Module 4).'},
        {k:['n2','e2','n3'],t:'<strong>Eliminate the group\'s trading with itself.</strong> Intercompany sales, balances, dividends and any profit still sitting in another group company\'s stock (Module 24).'},
        {k:['n3','e3','n4'],t:'<strong>Add up and report.</strong> Group income statement, balance sheet and cash flow, plus segment information by country or product.'}],
      draw:BW.viz.flow({label:'Local books, align policies, translate, eliminate, group accounts.',labels:['adjust','translate','eliminate','add up'],edgeK:['e0','e1','e2','e3'],
        nodes:[{t:'Local books',s:'local currency and rules',k:'n0'},{t:'Group policies',s:'same rulebook everywhere',k:'n1'},{t:'Translate',s:'into US dollars',k:'n2'},{t:'Eliminate',s:'trading inside the group',k:'n3'},{t:'Group accounts',s:'one set for the group',k:'n4'}]})},
    {t:'tbl', head:['Each company still needs…','Usually due'], rows:[
      ['Statutory accounts under local rules, audited if required','Within a few months of its year-end'],
      ['Corporate income tax return, and tax instalments during the year','Set by local law'],
      ['VAT or GST returns','Monthly or quarterly'],
      ['Payroll taxes and social contributions','Monthly'],
      ['Transfer pricing documentation for intercompany prices','Annually, often with the tax return'],
      ['Company secretarial filings: directors, shareholders, annual return','Annually']
    ]},
    TIP('One compliance calendar for the group',
      `<p>Five countries can mean a hundred or more filing deadlines a year. Keep them in one shared calendar with an owner for each, and review it monthly. Late filings bring penalties, and in some countries they make local directors personally liable.</p>`),
    Q('Why can\'t the group simply use the consolidated accounts and drop the local books?',[
      'It can, once the group is audited','Each company is a separate legal entity that must file its own accounts and tax returns under local law','Only if all companies use IFRS','Local books are only needed for banks'],1,
      'Group accounts are an extra layer. Each company still exists legally in its own country, with its own filings, taxes and auditors.')
  ]},
  /* ---------------------------------------------------------------- 6 */
  {id:'report', label:'Group reporting', kind:'learn', title:'Group reporting a GM can use', blocks:[
    `<p>A group pack should answer the same questions as BraceWorks' old monthly pack (Module 9), plus three new ones.</p>`,
    {t:'tbl', head:['New question','What the pack should show'], rows:[
      ['<strong>Which country or product line makes the money?</strong>','Revenue, gross margin and operating profit by segment, with intercompany profit shown where it is really earned'],
      ['<strong>Did we improve, or did currencies move?</strong>','Results at last year\'s or budget exchange rates ("constant currency") next to actual rates'],
      ['<strong>Where is the cash, and can we use it?</strong>','Cash and borrowing by country, with any cash that can\'t easily leave a country flagged (Module 26)']
    ]},
    W('Growth, or just currency?', function(el,ctx){
      const top=E('div'), out=E('div'); el.append(top,out);
      const LY=10.0, LYR=1.08; let ready=false, v={g:5,r:1.08};
      ctx.ui.sliders(top,[{k:'g',label:'Euro sales growth in euros',min:-10,max:20,step:1,v:5,f:x=>(x>0?'+':'')+x+'%'},{k:'r',label:'Average euro rate this year',min:0.95,max:1.25,step:0.01,v:1.08,f:x=>'€1 = $'+x.toFixed(2)}],x=>{ v=x; if(ready) draw(); },ctx.uid);
      function draw(){ const eur=LY*(1+v.g/100), act=eur*v.r, cc=eur*LYR, ly=LY*LYR;
        out.innerHTML=`<table class="jtbl"><thead><tr><th>BraceWorks Europe sales</th><th class="v">$ million</th><th class="v">Growth</th></tr></thead><tbody>
          <tr><td>Last year (€10.0m at 1.08)</td><td class="v">${ly.toFixed(2)}</td><td class="v"></td></tr>
          <tr><td>This year at actual rates</td><td class="v">${act.toFixed(2)}</td><td class="v">${pct(act/ly-1,1)}</td></tr>
          <tr class="hi"><td><strong>This year at last year's rate (constant currency)</strong></td><td class="v"><strong>${cc.toFixed(2)}</strong></td><td class="v"><strong>${pct(cc/ly-1,1)}</strong></td></tr></tbody></table>
          <p class="w-hint" style="margin-top:8px">${Math.abs(act-cc)<0.05?'Currency barely moved, so reported and underlying growth agree.':act>cc?`Reported growth flatters the business: ${pct((act-cc)/ly,1)} of it is the euro strengthening, not more hospitals buying.`:`Reported growth hides real progress: the business grew ${pct(cc/ly-1,1)} in euros, but a weaker euro took ${pct((cc-act)/ly,1)} off in dollars.`}</p>`; }
      ready=true; draw();
    }),
    K('The global minimum tax, and when it matters',
      `<p>Many countries, including most of the EU, the UK, Japan, South Korea, Australia and Vietnam, have adopted rules for a <span class="term">global minimum tax</span> (often called Pillar Two): groups with consolidated revenue of at least <strong>€750 million</strong> in two of the previous four years must pay an effective rate of at least 15% on adjusted profits in each country. If they don't, a top-up tax is charged, usually by that country itself, otherwise by the parent's country or another group country. The Philippines and the US have not adopted the rules. BraceWorks is far below the threshold, but a large group buying it, or rapid growth, would bring it in. Then a generous local tax holiday may simply be topped up to 15%, so incentives need re-checking.</p>`),
    Q('Group sales rose 12% in dollars. At constant currency they rose 4%. What happened?',[
      'The business grew 12%','About 8 points of the growth came from currencies strengthening against the dollar','Prices fell 8%','The figures are wrong'],1,
      'Constant currency strips out exchange-rate movements. Underlying growth was 4%; the rest was translation.')
  ]},
  /* ---------------------------------------------------------------- 7 */
  {id:'case', label:'Case: day 19', kind:'case', title:'The group pack that arrived on day 19', blocks:[
    CASE('A new group, an old process',
      `<p>BraceWorks now has five companies. The first group pack of the year arrives on working day 19. It shows operating profit of $4.1 million, but with a note: "intercompany difference of $340,000 under investigation; Vietnam figures provisional." The group accountant has spent four days re-keying Vietnam's numbers into a spreadsheet because Vietnam uses a different chart of accounts. Germany and Manila disagree on what Germany owes. The bank wants the quarterly covenant certificate by day 20.</p>`),
    Q('You can fix three things this quarter. Which three?',[
      {text:'Hire two more accountants in Manila', why:'More people re-keying the same spreadsheets doesn\'t fix the cause.'},
      {text:'A fixed close calendar for all countries, one chart of accounts, and an intercompany policy with balances agreed before month-end'},
      {text:'Buy a consolidation tool first', why:'Without one chart of accounts and agreed intercompany balances, the tool will consolidate the same mess faster.'},
      {text:'Ask the bank for a later covenant deadline every quarter', why:'A one-off extension may be needed now, but a late close is a warning sign to a lender.'}],1,
      'All three are process fixes that cost little and remove most of the delay. With them in place, a consolidation tool and extra people become worth buying.'),
    TIP('What to tell the bank',
      `<p>Ask early, once, and explain the plan: "Our first quarter as a five-company group took longer to close. Here's what we've changed; from next quarter you'll have the certificate by day 12." Lenders forgive a late first quarter. They worry about a pattern.</p>`)
  ]},
  /* ---------------------------------------------------------------- 8 */
  {id:'quiz', label:'Quiz', kind:'quiz', title:'Check your understanding', blocks:[
    Q('BraceWorks is opening its third country. Which finance role is most important to have in place first?',['An internal auditor','A group accountant responsible for consolidation and intercompany','An investor relations manager','A treasury dealer'],1,'Consolidation and intercompany become the bottleneck as soon as there is more than one company.'),
    Q('Which is the riskiest ERP plan?',['Go live in a quiet month after a full dress rehearsal','Go live in stages, country by country','Go live everywhere at once, just before the busiest season, with no fallback','Clean master data before go-live'],2,'All-at-once, in peak season, with no fallback: if anything goes wrong, everything goes wrong at the worst time.'),
    Q('Manila shows $1.05m owed by Germany; Germany shows $1.03m owed to Manila. Which is the most likely first explanation to check?',['Fraud in Germany','Goods in transit and different exchange rates','A tax error','Germany has paid twice'],1,'Timing and currency explain most intercompany differences. A group policy on cut-off and rates prevents them.'),
    Q('Where do translation differences on a foreign subsidiary\'s balance sheet go?',['Operating profit','A translation reserve in equity','Revenue','Cost of sales'],1,'Translation differences go to other comprehensive income and build up in equity.'),
    Q('Why report results in constant currency?',['Auditors require it','To see underlying performance without exchange-rate effects','To make results look better','To calculate tax'],1,'It separates what the business did from what currencies did.'),
    Q('The global minimum tax applies to groups with revenue of at least…',['$100 million','€750 million in two of the previous four years','€1 billion every year','Any group with a subsidiary abroad'],1,'The threshold is €750 million of consolidated revenue in at least two of the four preceding years.')
  ]},
  /* ---------------------------------------------------------------- 9 */
  {id:'apply', label:'Practice', kind:'apply', title:'Plan your own group finance', blocks:[
    `<p>Optional. Use this list when you plan the next country or the next 200 people. Ticks are saved only in this browser.</p>`,
    CHECK('m25-group','Before the next company opens…',[
      'We know who will keep its books, file its taxes and sign its statutory accounts',
      'It will use the group chart of accounts and accounting policies from day one',
      'Intercompany agreements, prices and a settlement rule are written down',
      'Its deadlines are in the group compliance calendar, with an owner for each',
      'It will report to group by the same close calendar as everyone else',
      'Bank mandates need a head-office signature above a set limit',
      'Our systems can handle another company and currency, or we have a plan to upgrade',
      'We\'ve checked whether the group\'s size brings new rules, such as the global minimum tax'
    ]),
    REPORT('Your Monday-morning question',
      `<p>Ask: <strong>"On which working day will next month's group pack arrive, and what is the one thing that most delays it?"</strong> The answer tells you where to spend your next dollar in finance.</p>`),
    K('Takeaways',
      `<ul>
        <li>Hire finance one step ahead of complexity, and buy in specialists you can't justify full-time.</li>
        <li>Change systems in a quiet period, with clean data, a full rehearsal and a fallback.</li>
        <li>Most close delays are process: a fixed calendar, one chart of accounts and agreed intercompany fix most of them.</li>
        <li>Every company still needs its own local books, filings and audit.</li>
        <li>Read group results by segment and in constant currency.</li>
       </ul>`)
  ]}
  ],
  warnings:[
    {sign:'Group pack later than working day 12', meaning:'Decisions made on old numbers; often a process problem.', look:'Close calendar; which country or step is slowest.'},
    {sign:'Unexplained intercompany differences carried month after month', meaning:'No intercompany policy; errors hiding in the gap.', look:'Intercompany reconciliation by pair of companies.'},
    {sign:'Growth reported only at actual exchange rates', meaning:'Currency may be flattering or hiding real performance.', look:'Constant-currency comparison.'},
    {sign:'Local filings handled "by the local accountant", with no group calendar', meaning:'Penalties and director liability building unseen.', look:'Group compliance calendar with owners.'}
  ],
  formulas:[
    {name:'Constant-currency growth', f:'(This year in local currency × last year\'s rate) ÷ last year in dollars − 1', ex:'(€10.5m × 1.08) ÷ $10.8m − 1 = 5.0%'}
  ],
  glossary:[
    {term:'Group accounting manual', def:'The written policies, chart of accounts, close calendar and approval limits every company in a group follows.'},
    {term:'Intercompany reconciliation', def:'Agreeing the balances that group companies owe each other, so they cancel exactly in the group accounts.'},
    {term:'Close calendar', def:'The fixed timetable of month-end tasks and deadlines for every company and step in the close.'},
    {term:'Constant currency', def:'Results restated at a fixed exchange rate (usually last year\'s or budget) to show underlying performance.'},
    {term:'Global minimum tax', def:'Rules (often called Pillar Two) making groups with revenue of €750 million or more pay an effective tax rate of at least 15% on profits in each country.'}
  ]
});
})();
