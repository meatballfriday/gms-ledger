/* ===== Module 24 (file m23): Opening a sales office or factory abroad (optional: growing into a multinational) ===== */
(function(){
const {K,TIP,FLAG,CASE,REPORT,Q,FS,FLIP,SORT,CHECK,W,money,signed,pct,kfmt} = BW.h;
const m$=v=>money(Math.round(v));

BW.add({
  id:'m23', minutes:60,
  title:'Opening a sales office or factory abroad',
  subtitle:'What changes in tax, accounting, cash and control when BraceWorks stops just exporting and puts people, an office or a factory in another country.',
  goals:[
    'Compare the ways to enter a market, from distributor to subsidiary to factory',
    'Recognise when activity abroad creates a taxable presence (a permanent establishment)',
    'Set transfer prices between group companies, and explain why they must be at arm\'s length',
    'Combine a parent and a subsidiary into group accounts, removing sales between them',
    'Fund a foreign company and bring cash home without unnecessary tax or trapped cash',
    'Build the business case for a factory abroad, including the medical device approvals'
  ],
  sections:[
  {id:'options', label:'Ways to go abroad', kind:'learn', title:'From exporting to owning a company abroad', blocks:[
    `<p>BraceWorks sells abroad today through independent distributors. Each step up the ladder below gives more control over customers and prices, and adds cost, risk and paperwork. Many companies stop at the right rung and stay there for years.</p>`,
    {t:'fig', title:'The ladder: more control, more commitment', draw:function(w){
      const P=BW.viz.p; const steps=[['Distributor','buys and resells; you just export'],['Agent','finds customers; you sell direct'],['Representative office','promotes only; can\'t sell'],['Branch','part of your company, abroad'],['Sales subsidiary','a separate company you own'],['Contract manufacturer','someone else makes for you'],['Own factory','a subsidiary that makes product']];
      const n=steps.length, wide=w>=620; let g='';
      if(wide){ const bw=(w-20)/n-6, base=210;
        steps.forEach((s,i)=>{ const h=50+i*22, x=10+i*(bw+6), y=base-h; g+=`<rect x="${P.f(x)}" y="${P.f(y)}" width="${P.f(bw)}" height="${P.f(h)}" rx="6" class="v-node ${i>=4?'hl':''}"/>`+P.lines(x+bw/2,y+18,P.wrap(s[0],Math.max(8,Math.floor(bw/7.2))),'v-t','middle',14)+P.lines(x+bw/2,base+16,P.wrap(s[1],Math.max(10,Math.floor(bw/6))),'v-s','middle',13); });
        g+=P.arrow(14,base+76,w-14,base+76,{cls:'acc'})+P.txt(14,base+92,'Less control, less cost and risk','v-l','start')+P.txt(w-14,base+92,'More control, more cost and risk','v-l','end');
        return P.svg(w,base+100,'Seven ways to sell or make abroad, from distributor to own factory, with control and commitment rising at each step.',g); }
      const rh=46, x0=34; steps.forEach((s,i)=>{ const y=8+i*rh, bw=w-x0-4; g+=`<rect x="${x0}" y="${y}" width="${P.f(bw)}" height="${rh-8}" rx="6" class="v-node ${i>=4?'hl':''}"/>`+P.txt(x0+10,y+17,s[0],'v-t','start')+P.txt(x0+10,y+32,s[1],'v-s','start'); });
      g+=P.arrow(14,8+n*rh-12,14,10,{cls:'acc'})+`<text x="10" y="${P.f(8+n*rh/2)}" class="v-l" text-anchor="middle" transform="rotate(-90 10 ${P.f(8+n*rh/2)})">more control and commitment</text>`;
      return P.svg(w,8+n*rh+6,'Seven ways to sell or make abroad, from distributor to own factory, with control and commitment rising at each step.',g);
    }, caption:'Highlighted steps create a company abroad, with its own accounts, tax returns and audit.'},
    {t:'tbl', head:['Option','Control over customers and prices','Set-up cost','Tax presence abroad','Typical use'], rows:[
      ['Distributor','Low','None','Normally none','Most small exporters, including BraceWorks today'],
      ['Commission agent','Medium','Low','Can create one if the agent signs contracts for you','Testing a market'],
      ['Representative office','Medium','Low','Usually none, but it can\'t sell or invoice','Market research, customer support'],
      ['Branch','High','Medium','Yes: profits taxed abroad','Quick start; same legal company'],
      ['Sales subsidiary','High','Medium to high','Yes: a separate taxpayer','Serious, long-term market'],
      ['Contract manufacturer','Medium over production','Low to medium','Normally none for you','Lower cost without owning a plant'],
      ['Own factory (subsidiary)','Full','High','Yes','Large volumes, long-term cost advantage']
    ]},
    K('Start with the question, not the structure',
      `<p>Ask what problem the move solves: closer to customers, lower cost, avoiding tariffs, or meeting a tender rule that requires a local company. Then pick the lowest rung that solves it. A sales subsidiary costs a full set of accounts, tax returns, an audit and local payroll every year, even in a quiet year.</p>`)
  ]},
  {id:'tax', label:'Where profit is taxed', kind:'learn', title:'Permanent establishment: when a country can tax you', blocks:[
    `<p>Module 19 showed that profits are taxed where the company lives <em>and</em> where it earns them. The test for "earns it there" is whether you have a <span class="term">permanent establishment</span> (PE) in that country. Most tax treaties follow the OECD model, which has two main tests.</p>`,
    FLIP([
      {f:'Test 1: a fixed place of business', b:'An office, branch, factory, workshop or warehouse you use to carry on your business there. Purely preparatory work, such as storage or market research, is usually excluded.'},
      {f:'Test 2: a dependent agent', b:'A person who habitually concludes contracts for you, or plays the main role leading to them. A salesperson who negotiates and signs orders abroad can create a PE without any office.'},
      {f:'What follows from a PE', b:'The profit that the PE earns is taxed in that country. You file a return there, keep records, and often register for VAT or sales tax and payroll.'},
      {f:'Tax treaties', b:'A treaty between two countries decides which one taxes what, caps withholding taxes, and lets you claim credit at home for tax paid abroad, so the same profit isn\'t fully taxed twice.'}
    ]),
    {t:'tbl', head:['','Branch','Subsidiary'], rows:[
      ['Legal status','Part of BraceWorks','A separate company BraceWorks owns'],
      ['Who\'s liable for its debts','BraceWorks, fully','Usually only the subsidiary'],
      ['Where its profit is taxed','Abroad, and often again at home with a credit for the foreign tax','Abroad; taxed at home only when paid as a dividend, depending on home rules'],
      ['Losses','Can often reduce home profits','Stay in the subsidiary unless group rules allow'],
      ['Profits sent home','Usually free to move; some countries add a branch profits tax','Paid as dividends, often with withholding tax'],
      ['Accounts and audit','Within BraceWorks\' accounts; a local filing may be needed','Its own statutory accounts and usually a local audit']
    ]},
    TIP('Get country advice early',`<p>PE rules, branch taxes, treaty rates and filing rules differ by country and change often. Use this module to understand the questions, and get local tax advice before anyone starts working abroad, not after.</p>`),
    Q('A BraceWorks sales manager lives in Germany, negotiates with hospitals there and signs the orders. BraceWorks has no office in Germany. Is there a risk of a German PE?',['No: there\'s no office','Yes: a dependent agent who habitually concludes contracts can create a PE without an office','Only if sales exceed $1 million','Only if the manager is German'],1,'The dependent-agent test looks at what the person does, not where the desk is. Having the manager promote but leave contracts to head office lowers the risk.')
  ]},
  {id:'tp', label:'Transfer pricing', kind:'play', title:'Setting prices between your own companies', blocks:[
    `<p>Once BraceWorks owns a company abroad, it sells to itself. The price it charges its subsidiary (the <span class="term">transfer price</span>) decides how much profit sits in each country, and so how much tax each country collects. Tax authorities everywhere require that price to be <strong>at arm's length</strong>: what independent companies would charge each other in the same situation.</p>`,
    {t:'tbl', head:['Method','How it works','Fits'], rows:[
      ['Comparable uncontrolled price','Use the price charged to, or by, independent parties for the same product','Identical products sold to outsiders too'],
      ['Resale price','Start from the subsidiary\'s selling price and leave it a normal distributor\'s gross margin','A subsidiary that resells without changing the product'],
      ['Cost plus','Cost plus a normal mark-up','A contract manufacturer or service provider'],
      ['Transactional net margin','Set the price so the subsidiary earns a normal operating margin, benchmarked against comparable companies','Most sales subsidiaries in practice'],
      ['Profit split','Divide combined profit by each side\'s contribution','Highly integrated operations; rare for small groups']
    ]},
    W('Transfer price: who gets the profit?', function(el,ctx){
      const top=document.createElement('div'), out=document.createElement('div'); el.append(top,out);
      ctx.ui.sliders(top,[
        {k:'tp',label:'Transfer price for a year\'s products',min:380000,max:480000,step:2000,v:456000,f:m$},
        {k:'th',label:'Tax rate at home',min:10,max:35,step:1,v:25,f:v=>v+'%'},
        {k:'ta',label:'Tax rate in the subsidiary\'s country',min:10,max:35,step:1,v:26,f:v=>v+'%'}
      ],v=>{
        const sales=600000, cost=380000, opex=120000;
        const home=v.tp-cost, sub=sales-v.tp-opex, margin=sub/sales;
        const taxH=Math.max(0,home)*v.th/100, taxA=Math.max(0,sub)*v.ta/100, inBand=margin>=0.02&&margin<=0.05;
        out.innerHTML=`<p class="w-hint">The US subsidiary sells BraceWorks braces for ${m$(sales)} a year. The braces cost BraceWorks ${m$(cost)} to make, and the subsidiary\'s own costs (a sales manager, an office, freight in the US) are ${m$(opex)}. Suppose a benchmarking study shows comparable independent distributors earn an operating margin of 2% to 5% of sales.</p>
          ${ctx.ui.table(['','BraceWorks (home)','US subsidiary','Group'],[['Sales',m$(v.tp),m$(sales),m$(sales)],['Cost of products',m$(-cost),m$(-v.tp),m$(-cost)],['Own costs','–',m$(-opex),m$(-opex)],['Profit before tax',m$(home),m$(sub),m$(home+sub)],['Tax',m$(-taxH),m$(-taxA),m$(-taxH-taxA)],['Profit after tax',m$(home-taxH),m$(sub-taxA),m$(home+sub-taxH-taxA)]],{num:[1,2,3]})}
          <div class="stats" style="margin-top:10px">${ctx.ui.stat('Subsidiary operating margin',(margin*100).toFixed(1)+'%',inBand?'good':'bad',inBand?'inside the 2–5% range':'outside the 2–5% range')}${ctx.ui.stat('Group profit before tax',m$(home+sub),'','the same at any transfer price')}${ctx.ui.stat('Total tax',m$(taxH+taxA))}</div>
          <div class="msg ${inBand?'good':'warn'}" style="margin-top:10px">${inBand?'This price would be supportable: the subsidiary earns what an independent distributor would. Document why.':margin<0.02?'The subsidiary is left with too little profit (or a loss). The subsidiary\'s tax authority could raise its taxable profit and charge penalties.':'The subsidiary keeps more profit than an independent distributor would. Your home tax authority could argue BraceWorks undercharged.'}</div>`;
      },ctx.uid);
    }),
    K('What the widget shows',
      `<p>Group profit before tax never changes. The transfer price only moves it between countries. That's why tax authorities watch it closely: set it to suit the tax rates and one of them will challenge it. The safe approach is a price you can defend with a benchmark, written into an intercompany agreement, applied consistently and reviewed each year.</p>`),
    TIP('Paperwork that goes with it',`<ul><li>A written <strong>intercompany agreement</strong> for every flow: product sales, services, loans, royalties.</li><li><strong>Transfer pricing documentation</strong>: many countries require a local file explaining the method and benchmark; larger groups also need a master file. Thresholds vary by country.</li><li>Invoices that actually match the agreement, every month.</li></ul>`),
    Q('BraceWorks\' US subsidiary makes a loss every year while BraceWorks makes good profits at home. What risk does that create?',['None: the group is profitable','The US tax authority may argue the transfer price is too high and reassess the subsidiary\'s profit','The auditors will refuse to sign','Customers will pay late'],1,'A distributor that routinely loses money is not behaving like an independent one. Expect questions.')
  ]},
  {id:'setup', label:'Setting it up', kind:'learn', title:'What it takes to set up a company abroad', blocks:[
    `<p>Setting up takes months, not weeks, and the work is spread across lawyers, accountants, banks and regulators. Here's what to expect, roughly in order.</p>`,
    {t:'tbl', head:['Step','What it involves','Who usually helps'], rows:[
      ['<strong>1. Structure and tax advice</strong>','Branch or subsidiary; PE, treaty, transfer pricing and how profits will come home','Tax adviser in both countries'],
      ['<strong>2. Register the company</strong>','Name, articles, share capital (some countries set a minimum), registered address, local director or secretary rules','Corporate lawyer or service provider'],
      ['<strong>3. Bank account</strong>','Know-your-customer checks on the owners can take weeks; decide who can sign and the limits','Local bank'],
      ['<strong>4. Tax registrations</strong>','Corporate tax number, VAT or sales tax, payroll withholding, customs or importer number','Local accountant'],
      ['<strong>5. People</strong>','Employment contracts under local law, payroll, social security, benefits; work permits for anyone sent from home','Employment lawyer, payroll provider'],
      ['<strong>6. Medical device rules</strong>','Who is the importer, distributor or authorised representative; device registration; complaint handling and vigilance in that market','Regulatory consultant'],
      ['<strong>7. Accounts and audit</strong>','Local bookkeeping, statutory accounts in the local format, audit, filing deadlines','Local accountant and auditor'],
      ['<strong>8. Intercompany set-up</strong>','Agreements, transfer prices, invoicing routine, how the subsidiary reports to you each month','Your finance team and tax adviser']
    ]},
    K('Budget for the running costs, not just the set-up',
      `<p>A small sales subsidiary carries fixed annual costs before it sells anything: accounting, audit, tax returns, payroll, registered office, insurance and the time your own team spends on it. Put these in the business case as a yearly cost. They're often the difference between a subsidiary that pays and one that doesn't.</p>`),
    FLAG('People working abroad before the company exists',`<p>Hiring someone abroad before the entity is set up, or paying them as a "consultant" from home, can create a PE, payroll obligations and employment claims. Set up the structure first, or use a registered employer-of-record service until you do.</p>`)
  ]},
  {id:'group', label:'Group accounts', kind:'play', title:'Combining the accounts: consolidation', blocks:[
    `<p>Once BraceWorks owns a subsidiary, owners, banks and auditors will want <strong>group accounts</strong>: one set of statements for the whole group, as if it were a single company. Three steps get you there.</p>`,
    {t:'tbl', head:['Step','What it does','Why'], rows:[
      ['<strong>1. Add line by line</strong>','Sales plus sales, stock plus stock, and so on','The group owns everything both companies own'],
      ['<strong>2. Remove intercompany items</strong>','Take out sales, purchases, receivables and payables between group companies, and any profit still sitting in group stock','A group can\'t make money selling to itself'],
      ['<strong>3. Translate currencies</strong>','Balance sheet at the year-end rate; income statement at the average rate; the difference goes to equity as a translation reserve','So figures in different currencies can be added up']
    ]},
    W('Consolidate BraceWorks and its US subsidiary', function(el,ctx){
      const S=ctx.state; S.m23c=S.m23c||{ic:false,up:false}; const st=S.m23c;
      el.innerHTML=`<p class="w-hint">BraceWorks sold the subsidiary $200,000 of braces that cost $150,000 to make. The subsidiary has sold three-quarters of them to US customers for $210,000, and still holds $50,000 of them (at the transfer price) in stock. It still owes BraceWorks $60,000.</p>
        <div class="row" style="display:flex;flex-wrap:wrap;gap:14px;margin:6px 0 10px"><label><input type="checkbox" data-k="ic"> Step 2a: remove the intercompany sale and balance</label><label><input type="checkbox" data-k="up"> Step 2b: remove profit still in group stock</label></div><div class="cs-out"></div>`;
      const out=el.querySelector('.cs-out');
      const draw=()=>{ const ic=st.ic, up=st.up;
        const P={rev:1200000,cos:860000,inv:250000,ar:230000,ap:95000}, U={rev:210000,cos:150000,inv:50000,ar:40000,ap:60000};
        const e={rev:ic?-200000:0,cos:(ic?-200000:0)+(up?12500:0),inv:up?-12500:0,ar:ic?-60000:0,ap:ic?-60000:0};
        const G={}; ['rev','cos','inv','ar','ap'].forEach(k=>G[k]=P[k]+U[k]+e[k]);
        const gp=x=>x.rev-x.cos;
        const rows=[['Revenue',P.rev,U.rev,e.rev,G.rev],['Cost of sales',-P.cos,-U.cos,-e.cos,-G.cos],['Gross profit',gp(P),gp(U),e.rev-e.cos,gp(G)],['Inventory',P.inv,U.inv,e.inv,G.inv],['Receivables',P.ar,U.ar,e.ar,G.ar],['Payables',P.ap,U.ap,e.ap,G.ap]].map(r=>[r[0]].concat(r.slice(1).map((v,i)=>i===2&&!v?'–':m$(v))));
        const done=ic&&up;
        out.innerHTML=ctx.ui.table(['','BraceWorks','US subsidiary','Adjustments','Group'],rows,{num:[1,2,3,4]})+
          `<div class="msg ${done?'good':'warn'}" style="margin-top:10px">${done?'<strong>Group gross profit: $387,500.</strong> That\'s what the group really earned from outside customers: $290,000 on BraceWorks\' own export sales plus $97,500 on the US sales. The $12,500 of profit on braces still in the subsidiary\'s warehouse will count when they\'re sold.':`<strong>Group gross profit shows ${m$(gp(G))}.</strong> ${!ic?'The $200,000 sale between the two companies is counted as revenue, and the $60,000 they owe each other is counted on both sides.':'Better, but $12,500 of profit on braces still in the subsidiary\'s warehouse hasn\'t been earned from an outside customer yet.'}`}</div>`;
      };
      el.querySelectorAll('input[data-k]').forEach(c=>{ c.checked=!!st[c.dataset.k]; c.onchange=()=>{ st[c.dataset.k]=c.checked; ctx.save(); draw(); }; });
      draw();
    }),
    TIP('Currency translation in one line',`<p>If a subsidiary in Germany keeps its books in euros and BraceWorks reports in US dollars, the subsidiary's balance sheet is translated at the year-end rate and its income statement at the year's average rate. The difference doesn't go through profit; it builds up in equity as a translation reserve. Big swings there are a sign of currency exposure worth managing (Module 17).</p>`),
    REPORT('Ask finance',`<p>Before the subsidiary opens, ask: who will prepare the group accounts, in which currency, with what intercompany reconciliation each month, and which accounting standard both companies will follow? Agreeing intercompany balances every month is far easier than untangling a year of them at audit time.</p>`)
  ]},
  {id:'cash', label:'Funding and cash home', kind:'learn', title:'Getting money in, and getting it back out', blocks:[
    `<p>How you put money into a foreign company decides how easily, and at what tax cost, you can take it back out. Plan both directions before the first transfer.</p>`,
    {t:'tbl', head:['Route','Into the subsidiary','Back home','Watch out for'], rows:[
      ['<strong>Share capital</strong>','Simple; may be a legal minimum','Only as dividends from profits, or a formal capital reduction','Hard to get back quickly; dividends often carry withholding tax'],
      ['<strong>Intercompany loan</strong>','Flexible; repayable','Interest and repayments','Interest must be at arm\'s length; withholding tax on interest; many countries cap interest deductions, often at 30% of EBITDA, and some limit debt compared with equity'],
      ['<strong>Trade credit</strong>','Longer payment terms on goods you sell it','Payment of invoices','Terms must be commercial; long-overdue intercompany balances draw questions'],
      ['<strong>Service fees and royalties</strong>','–','Fees for management services or use of your brand and know-how','Must reflect real services or value; withholding tax; documentation'],
      ['<strong>Dividends</strong>','–','From accumulated profits','Withholding tax, reduced by treaties; local rules on when profits can be distributed']
    ]},
    K('Trapped cash',
      `<p>Cash in a subsidiary isn't the same as cash at home. Some countries control foreign exchange and require audited accounts and tax clearance before profits can be sent abroad; China is a well-known example. Withholding taxes reduce what arrives. In your 13-week forecast, show cash by country, and treat cash abroad as available only on the date you can actually move it.</p>`),
    TIP('A natural hedge',`<p>A factory abroad has costs in local currency. If you also sell in that currency, part of the currency risk cancels out. Match the currency of costs and income where you can before reaching for forward contracts (Module 17).</p>`),
    Q('BraceWorks wants the option to bring money back from its new subsidiary within two years. Which funding is usually more flexible?',['All share capital','Mostly an intercompany loan at an arm\'s-length interest rate, within local interest-deduction limits','No funding: let it borrow locally with a parent guarantee and never repay','Cash in a suitcase'],1,'Loans can be repaid; share capital usually can\'t without a formal process. Check withholding tax and interest limits with an adviser.')
  ]},
  {id:'factory', label:'The factory decision', kind:'play', title:'Should BraceWorks make braces abroad?', blocks:[
    `<p>Lower wages are the usual reason to move production. But the saving per unit has to pay for set-up, validation, travel, extra management and risk, and medical devices add approvals that take time. Compare like for like, per unit and in total.</p>`,
    W('Factory abroad: business case', function(el,ctx){
      const top=document.createElement('div'), out=document.createElement('div'); el.append(top,out);
      ctx.ui.sliders(top,[
        {k:'vol',label:'Braces a year',min:10000,max:80000,step:1000,v:30000,f:v=>v.toLocaleString('en-US')},
        {k:'lab',label:'Labour per brace abroad',min:1,max:9,step:0.5,v:3.5,f:v=>'$'+v.toFixed(2)},
        {k:'mgmt',label:'Extra yearly costs: management, travel, local audit',min:0,max:150000,step:5000,v:70000,f:m$},
        {k:'setup',label:'One-off set-up: building, equipment, validation, approvals',min:100000,max:800000,step:25000,v:350000,f:m$},
        {k:'fx',label:'Local currency strengthens by',min:-10,max:20,step:1,v:0,f:v=>v+'%'}
      ],v=>{
        const home={mat:14,lab:9,oh:6,fr:2.5}, abroadBase={mat:14.5,oh:4.5,fr:2.0};
        const fxm=1+v.fx/100, abroad={mat:abroadBase.mat,lab:v.lab*fxm,oh:abroadBase.oh*fxm,fr:abroadBase.fr};
        const uh=home.mat+home.lab+home.oh+home.fr, ua=abroad.mat+abroad.lab+abroad.oh+abroad.fr;
        const save=(uh-ua)*v.vol-v.mgmt*fxm;
        const r=0.112; let npv=-v.setup; for(let y=1;y<=7;y++){ npv+=(y===1?save*0.5:save)/Math.pow(1+r,y); }
        let cum=-v.setup, pb=null; for(let y=1;y<=15;y++){ const cf=y===1?save*0.5:save; if(cum+cf>=0&&pb===null){ pb=y-1+(-cum)/cf; } cum+=cf; }
        out.innerHTML=ctx.ui.table(['Per brace','Make at home','Make abroad'],[['Materials','$'+home.mat.toFixed(2),'$'+abroad.mat.toFixed(2)],['Labour','$'+home.lab.toFixed(2),'$'+abroad.lab.toFixed(2)],['Factory overhead','$'+home.oh.toFixed(2),'$'+abroad.oh.toFixed(2)],['Freight to customers','$'+home.fr.toFixed(2),'$'+abroad.fr.toFixed(2)],['Total','$'+uh.toFixed(2),'$'+ua.toFixed(2)]],{num:[1,2]})+
          `<div class="stats" style="margin-top:10px">${ctx.ui.stat('Yearly saving after extra costs',m$(save),save>0?'good':'bad')}${ctx.ui.stat('Payback',pb===null?'never':pb.toFixed(1)+' years',pb===null||pb>5?'bad':pb>3?'warn':'good','year 1 at half speed')}${ctx.ui.stat('NPV over 7 years at 11.2%',m$(npv),npv>0?'good':'bad','cost of capital from Module 20')}</div>
          <p class="w-hint">Materials cost a little more abroad (imported foam and fabric), freight is a little lower if the factory is nearer the main market, and labour and overhead are paid in local currency, so they move with the exchange rate.</p>`;
      },ctx.uid);
    }),
    TIP('Things to try',`<ul><li>Halve the volume to 15,000 braces. The fixed yearly costs eat most of the saving, and payback stretches past ten years.</li><li>Let the local currency strengthen 15%. Wage savings shrink quickly.</li><li>Compare with a contract manufacturer: no set-up cost, but a higher price per unit and less control over quality.</li></ul>`),
    {t:'tbl', head:['Medical device step','What it means for the plan'], rows:[
      ['Quality system','The new site must work under your quality system (usually ISO 13485) and be audited before it ships product'],
      ['Process validation','Every production process is validated again at the new site, with records'],
      ['Regulators','Registrations must list the new site: for example, US FDA establishment registration, and your EU notified body certificate scope'],
      ['Customers','Large distributors and hospital groups may need to approve the change of site before buying from it'],
      ['Timing','Allow for months of parallel running at both sites, which doubles some costs during the move']
    ]},
    FLAG('A saving that assumes everything goes right',`<p>Factory cases usually go wrong in the same places: volumes lower than planned, validation taking longer, quality problems in the first year, and currency moving the wrong way. Run the downside before you sign the lease, using the three-statement model from Module 23 to see the cash needed while both sites run.</p>`)
  ]},
  {id:'control', label:'Running it from afar', kind:'learn', title:'Control without being there', blocks:[
    `<p>Fraud and errors grow with distance. A subsidiary needs the same controls as head office (Module 18), plus a few more because you can't walk the floor.</p>`,
    CHECK('m23-control','Controls for a company abroad',[
      'Bank accounts need two signatures, at least one from head office, above a set limit',
      'A written authority table: what the local manager can approve alone, and what needs head office',
      'Monthly reporting pack from the subsidiary by working day 8, in the group format (Module 9)',
      'Intercompany balances agreed between the two companies every month',
      'Local statutory deadlines, audit and tax filings in a shared calendar',
      'Cash forecast by country, updated weekly',
      'Visits at least twice a year, including a look at stock and the bank statements',
      'A local auditor or accountant who also reports to head office, not only to the local manager'
    ]),
    K('Local directors carry personal responsibility',
      `<p>Directors of the subsidiary, including you if you're appointed, can be personally liable for its filings, taxes and wages under local law. Know what you're signing, and make sure local filings are on time even when the subsidiary is small.</p>`)
  ]},
  {id:'case', label:'Case: the US salesperson', kind:'case', title:'The salesperson who opened a US company by accident', blocks:[
    CASE('Growth without a plan',
      `<p>US sales were growing, so BraceWorks hired an experienced salesperson living in Ohio. She was paid as a "consultant" from head office, worked from home, negotiated prices with hospital groups and signed the orders. Sales rose to $900,000 in two years.</p>
       <p>Then a large customer's audit asked for BraceWorks' US tax registration. The adviser BraceWorks called explained the problems: a probable US permanent establishment, state tax registrations missing, payroll taxes unpaid because she was really an employee, and two years of returns to file late, with interest and penalties.</p>`),
    SORT('Which actions would have avoided it?',['Would have helped','Wouldn\'t'],[
      {text:'Taking tax advice before hiring anyone in the US', a:0, why:'The adviser would have flagged the PE and employment risks on day one.'},
      {text:'Having her promote and negotiate, with head office approving and signing all contracts', a:0, why:'This reduces the dependent-agent risk, though it doesn\'t remove it entirely.'},
      {text:'Setting up a US sales subsidiary to employ her, with a transfer pricing agreement', a:0, why:'The subsidiary is the taxpayer, employs her properly and earns an arm\'s-length margin.'},
      {text:'Using an employer-of-record service until the subsidiary existed', a:0, why:'Payroll and employment law are handled properly while you decide on structure.'},
      {text:'Paying her a higher commission', a:1, why:'Pay level doesn\'t change what she does or where she does it.'},
      {text:'Keeping US sales below a fixed amount', a:1, why:'PE tests look at activity, not a sales threshold (though some state taxes do use thresholds).'}
    ]),
    Q('What was the root cause?',['The salesperson was too successful','Activity abroad started before anyone looked at the tax and employment consequences','The customer\'s audit','US tax rates'],1,'Structure first, then people. The cost of advice is tiny compared with fixing it afterwards.')
  ]},
  {id:'quiz', label:'Quiz', kind:'quiz', title:'Check your understanding', blocks:[
    Q('What is the main tax difference between using a distributor and opening a branch abroad?',['None','A branch normally creates a permanent establishment, so its profit is taxed in that country','A distributor pays your taxes','Branches are tax-free'],1,'A distributor is an independent customer; a branch is you, abroad.'),
    Q('Why must transfer prices be at arm\'s length?',['To keep customers happy','Because they decide how much profit, and tax, each country gets, and tax authorities require independent-party pricing','To satisfy the bank','They don\'t have to be'],1,'Group profit doesn\'t change; its split between countries does.'),
    Q('In group accounts, why remove a $200,000 sale from BraceWorks to its own subsidiary?',['To reduce tax','A group can\'t earn revenue from selling to itself; only sales to outside customers count','Because it was paid late','Auditors prefer smaller numbers'],1,'Consolidation shows the group as if it were one company.'),
    Q('The subsidiary still holds braces bought from BraceWorks at a $12,500 mark-up. What happens in the group accounts?',['Nothing','The $12,500 is removed from group profit and inventory until the braces are sold to an outside customer','It\'s added to revenue','It\'s taxed twice'],1,'Unrealised profit is profit the group hasn\'t earned yet.'),
    Q('Why might cash in a foreign subsidiary not count as available for paying bills at home?',['It\'s always available','Exchange controls, distribution rules and withholding taxes can delay or reduce what can be sent home','Banks abroad close at weekends','Because of IFRS'],1,'Treat cash abroad as available only when, and in the amount, you can actually move it.'),
    Q('A factory abroad would save $6 per brace on 30,000 braces, but adds $70,000 a year of extra costs and $350,000 of set-up. What\'s the yearly saving after extra costs?',['$180,000','$110,000','$350,000','$40,000'],1,'$6 × 30,000 = $180,000, minus $70,000 = $110,000. Then test payback and NPV, including a slow first year.')
  ]},
  {id:'apply', label:'Practice', kind:'apply', title:'Before you go abroad', blocks:[
    REPORT('Questions to take to your advisers',
      `<ul><li>Would our planned activity create a permanent establishment? Branch or subsidiary, and why?</li><li>What transfer pricing method fits, what margin should the subsidiary earn, and what documentation is required?</li><li>How should we fund it, and what withholding taxes and interest limits apply to bringing cash home?</li><li>What are the yearly fixed costs: accounting, audit, tax filings, payroll, registered office?</li><li>Which medical device registrations and roles (importer, distributor, authorised representative) apply in that market?</li><li>What personal responsibilities would I have as a director of the subsidiary?</li></ul>`),
    CHECK('m23-go','Ready to go abroad',[
      'The problem the move solves is written down, and the lowest rung that solves it is chosen',
      'Tax advice taken in both countries, before anyone is hired abroad',
      'Business case with set-up costs, yearly fixed costs, a slow first year and a downside case',
      'Funding plan and how cash will come home agreed',
      'Intercompany agreements and transfer prices documented',
      'Group reporting, intercompany reconciliation and consolidation owner agreed',
      'Controls in place from day one: bank signatures, authority table, monthly pack',
      'Regulatory roles and registrations for medical devices confirmed'
    ]),
    TIP('Practise with the forecast model',`<p>Use the Module 23 model to test the cash effect: add the set-up cost as equipment purchases, the yearly fixed costs as selling and admin, and the extra stock a subsidiary needs as more stock days. See what it does to the overdraft before you commit.</p>`)
  ]}
  ],
  warnings:[
    {sign:'Staff working abroad before any tax advice', meaning:'Possible permanent establishment, payroll and employment liabilities.', look:'Contracts, who signs orders, how people are paid.'},
    {sign:'A subsidiary that loses money year after year', meaning:'Transfer prices may not be at arm\'s length; a tax reassessment risk.', look:'Subsidiary margin against benchmark; intercompany agreement.'},
    {sign:'Intercompany balances that don\'t agree', meaning:'Errors, or cash tied up between group companies.', look:'Monthly intercompany reconciliation.'},
    {sign:'Large cash balances abroad', meaning:'Cash may be trapped by exchange controls or tax.', look:'Cash by country; repatriation route and timing.'}
  ],
  formulas:[
    {name:'Subsidiary operating margin', f:'Subsidiary operating profit ÷ Subsidiary sales', ex:'$24,000 ÷ $600,000 = 4.0%'},
    {name:'Unrealised profit in stock', f:'Group stock bought from a group company × that company\'s profit margin', ex:'$50,000 × 25% = $12,500'},
    {name:'Factory saving', f:'(Unit cost at home − unit cost abroad) × volume − extra yearly costs', ex:'$6 × 30,000 − $70,000 = $110,000'}
  ],
  glossary:[
    {term:'Permanent establishment', def:'A fixed place of business, or an agent who habitually concludes contracts, that lets another country tax the profit earned there.'},
    {term:'Branch', def:'Part of your own company operating in another country; not a separate legal entity.'},
    {term:'Subsidiary', def:'A separate company owned by another company (the parent).'},
    {term:'Representative office', def:'An office abroad that may promote and research but not sell or invoice.'},
    {term:'Transfer price', def:'The price one group company charges another for goods, services, loans or rights.'},
    {term:'Arm\'s length', def:'The terms unrelated parties would agree in the same situation. Transfer prices between group companies must meet this test.'},
    {term:'Intercompany agreement', def:'A written contract between group companies setting out what is supplied and on what terms.'},
    {term:'Consolidation', def:'Combining a parent and its subsidiaries into one set of group accounts, removing transactions between them.'},
    {term:'Unrealised profit', def:'Profit on goods sold between group companies that are still in group stock; removed in group accounts until sold outside.'},
    {term:'Translation reserve', def:'The part of equity that collects exchange differences from translating foreign subsidiaries\' accounts.'},
    {term:'Withholding tax', def:'Tax deducted at source from payments such as dividends, interest or royalties sent abroad.'},
    {term:'Tax treaty', def:'An agreement between two countries that decides taxing rights, caps withholding taxes and prevents double taxation.'},
    {term:'Trapped cash', def:'Cash held abroad that cannot easily or cheaply be sent home.'},
    {term:'Employer of record', def:'A service company that legally employs staff in a country on your behalf, handling payroll and employment law.'},
    {term:'Contract manufacturer', def:'An independent company that makes products to your design and specification.'}
  ]
});
})();
