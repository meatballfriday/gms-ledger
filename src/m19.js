/* ===== Module 19: Tax for exporters ===== */
(function(){
const {K,TIP,FLAG,CASE,REPORT,Q,FS,FLIP,SORT,CHECK,W,PACK,money,signed,pct,kfmt} = BW.h;
const SRC=(label,url)=>`<a href="${url}" target="_blank" rel="noopener">${label}</a>`;
const ASOF='Rates and rules as of October 2026. Tax law changes often: confirm anything you act on with a licensed tax adviser in that country.';

/* country snapshot table */
const SNAP=(rows)=>({t:'html',html:`<div class="tbl"><table class="grid"><tbody>${rows.map(r=>`<tr><th style="width:30%;vertical-align:top">${r[0]}</th><td>${r[1]}</td></tr>`).join('')}</tbody></table></div>`});

BW.add({
  id:'m19', minutes:55,
  title:'Tax for exporters',
  subtitle:'The logic behind tax rules, the taxes that touch a manufacturer, how VAT can quietly trap cash, and how five countries apply it all.',
  goals:[
    'Explain the principles behind where and why taxes are charged',
    'Tell taxable profit from accounting profit, and read an effective tax rate',
    'Show how VAT works for an exporter, and why refunds tie up cash',
    'Spot cross-border tax risks: withholding, permanent establishment, transfer pricing, duties',
    'Compare the main rules in the Philippines, Taiwan, China, the US and the UK'
  ],
  sections:[
  /* ---------------------------------------------------------------- */
  {id:'logic', label:'The logic of tax', kind:'learn', title:'Six principles behind almost every tax rule', blocks:[
    FLAG('General education, not tax advice', `<p>${ASOF}</p>`),
    `<p>Tax rules look like a maze of exceptions. Underneath, most countries follow the same handful of ideas. Once you know them, a new country's rules start to make sense, and you can ask your adviser sharper questions.</p>`,
    FLIP([
      {f:'1. Profits are taxed where the company lives', b:'<strong>The residence principle.</strong> A company pays income tax on its profits in the country where it is incorporated or managed. BraceWorks pays income tax where it is based, not in every country it ships to.'},
      {f:'2. …and where the money is earned', b:'<strong>The source principle.</strong> A country also taxes income that arises there: a branch, an office, a factory, or interest and royalties paid from it. If BraceWorks put a sales office in Germany, Germany could tax the profit that office earns.'},
      {f:'3. Consumption is taxed where it\'s consumed', b:'<strong>The destination principle.</strong> VAT, GST and sales taxes fall on the final consumer in the country where goods are used. So exports are zero-rated at home, and the buyer\'s country charges its own VAT or sales tax on import.'},
      {f:'4. Collect tax at the source when you can', b:'<strong>Withholding.</strong> Governments find it hard to chase foreign companies, so they make the payer deduct tax before paying: on payments abroad for dividends, interest, royalties and some services, and in some countries on local supplier payments too.'},
      {f:'5. Don\'t tax the same profit twice', b:'<strong>Tax treaties and credits.</strong> When two countries could both tax the same income, treaties split the rights, cut withholding rates, and let you credit foreign tax against home tax.'},
      {f:'6. Related companies must deal at arm\'s length', b:'<strong>Transfer pricing.</strong> Companies under common ownership could shift profit to low-tax countries by setting odd prices between themselves. So prices between related parties must match what unrelated parties would agree.'}
    ]),
    K('A seventh idea: incentives',
      `<p>Governments also use tax to <strong>attract</strong> what they want: exports, factories, jobs, research. Tax holidays, export-zone regimes, R&amp;D credits and fast depreciation are the result. For an exporter like BraceWorks, incentives can matter more than the headline rate. You'll see examples in each country.</p>`),
    `<h3>The taxes that touch a manufacturer</h3>`,
    {t:'tbl', head:['Tax','Charged on','Who really bears it','Where you see it'], rows:[
      ['<strong>Corporate income tax</strong>','Taxable profit','The company and its owners','Income tax line on the P&amp;L; tax payable on the balance sheet'],
      ['<strong>VAT / GST</strong> (sales tax in the US)','Value added at each stage of sale','The final consumer; the business collects and passes it on','Not in revenue or costs if recovered; VAT payable or receivable on the balance sheet'],
      ['<strong>Payroll taxes and contributions</strong>','Wages','Employer and employee, in shares set by law','Wage costs, so product cost and overheads'],
      ['<strong>Withholding taxes</strong>','Payments to others, especially abroad','Usually the recipient; the payer collects it','A deduction from payments; a liability until paid over'],
      ['<strong>Customs duties and tariffs</strong>','Goods crossing a border','The importer, then passed into prices','Part of the cost of imported materials or, under DDP, your cost of sale'],
      ['<strong>Local and other taxes</strong>','Business activity, property, documents','The company','Overheads']
    ]}
  ]},
  /* ---------------------------------------------------------------- */
  {id:'profit', label:'Taxable profit', kind:'learn', title:'Accounting profit is not taxable profit', blocks:[
    `<p>Income tax is charged on <span class="term">taxable profit</span>, which starts from accounting profit but follows the tax law's own rules. The differences fall into two groups:</p>
     <ul>
      <li><strong>Permanent differences:</strong> costs the tax law never allows, such as fines, penalties and some entertainment, or income it never taxes. They change how much tax you pay, for good.</li>
      <li><strong>Timing differences:</strong> items allowed in a different year. Tax depreciation often runs faster than accounting depreciation; provisions for bad debts or obsolete stock are often deductible only when the loss actually happens. They change <em>when</em> you pay, not how much.</li>
     </ul>
     <p>BraceWorks' P&amp;L simply showed tax as 25% of profit. Here's what a more realistic year looks like, at the same 25% rate:</p>`,
    FS({title:'From accounting profit to tax payable (illustration)', rows:[
      ['Profit before tax (accounting)',74000],
      ['Add back: fines and non-deductible entertainment (permanent)',3000,'ind'],
      ['Add back: accounting depreciation',38000,'ind'],
      ['Deduct: tax depreciation, faster in the early years',-47000,'ind'],
      ['Add back: stock provision not yet deductible',6000,'ind'],
      ['Taxable profit',74000,'sub'],
      ['Current tax at 25%: paid to the tax office',18500,'total']
    ], note:'The timing items cancel out here (+$38k −$47k +$6k = −$3k), offsetting the permanent +$3k. In most years they won\'t.'}),
    K('Effective tax rate',
      `<p>The <span class="term">effective tax rate</span> = total tax expense ÷ profit before tax. If it\'s far from the headline rate, ask why. Common reasons: non-deductible costs (push it up), incentives or tax-exempt income (pull it down), losses brought forward, different rates in different countries, or an adjustment for last year.</p>`),
    TIP('Deferred tax, in one paragraph',
      `<p>Because timing differences reverse later, the accounts record <span class="term">deferred tax</span>: a liability when you\'ve paid less tax now and will pay more later (for example from fast tax depreciation), or an asset when the reverse applies. It\'s an accounting estimate, not a bill. A GM mainly needs to know it exists and that it explains why the P&amp;L tax line differs from what was paid.</p>`),
    K('Tax is a cash flow too',
      `<p>Most countries collect income tax in instalments during the year, with a final payment after year-end. Put the dates in the 13-week cash forecast (Module 10). A profitable year means a bigger tax bill, often due when cash is already tight.</p>`)
  ]},
  /* ---------------------------------------------------------------- */
  {id:'vat', label:'VAT and refunds', kind:'play', title:'VAT: the tax that flows through you', blocks:[
    `<p><span class="term">VAT</span> (called GST in some countries) is charged at every stage of a sale, but each business deducts the VAT it paid on its own purchases. So it\'s really a tax on the value each stage adds, and the final consumer pays the whole amount.</p>
     <ul>
      <li><strong>Output VAT:</strong> what you charge customers.</li>
      <li><strong>Input VAT:</strong> what suppliers charge you.</li>
      <li><strong>You pay the tax office:</strong> output minus input. If input is bigger, you have a credit or a refund claim.</li>
     </ul>
     <p>Because of the destination principle, <strong>exports are zero-rated</strong>: BraceWorks charges 0% on export sales but still pays VAT on local foam, fabric and power. So it almost always has more input VAT than output VAT, and has to claim the difference back.</p>`,
    {t:'html',html:'<div class="co tip"><span class="co-label">Zero-rated is not the same as exempt</span><div class="prose"><p><strong>Zero-rated</strong> sales carry 0% VAT, and you can still reclaim the VAT on your purchases. <strong>Exempt</strong> sales carry no VAT, and you <em>can\'t</em> reclaim the related input VAT, so it becomes a cost. Exporters want zero-rating, and the paperwork that proves it.</p></div></div>'},
    W('How much cash is waiting in VAT refunds?', function(el, ctx){
      const {money,pct}=ctx.h;
      const RATES={ph:['Philippines',0.12],cn:['China',0.13],tw:['Taiwan',0.05],uk:['United Kingdom',0.20]};
      let cc='ph'; const segEl=document.createElement('div'), top=document.createElement('div'), out=document.createElement('div'); el.append(segEl,top,out); let vals={};
      function draw(){ const r=RATES[cc][1], monthly=vals.buy*r, tied=monthly*vals.delay, lost=monthly*12*(1-vals.back/100);
        out.innerHTML=`<div class="stats">${ctx.ui.stat('Input VAT paid each month',money(Math.round(monthly)))}${ctx.ui.stat('Cash waiting for refunds',money(Math.round(tied)),tied>42000?'bad':tied>20000?'warn':'', pct(tied/42000,0)+' of BraceWorks\' year-end cash')}${ctx.ui.stat('VAT never recovered each year',money(Math.round(lost)),lost>0?'bad':'good')}</div>`+
        ctx.ui.bars([{label:'Cash in the bank at year-end',v:42000,tone:'blue'},{label:'Cash waiting for VAT refunds',v:Math.round(tied),tone:tied>42000?'bad':'warn'}],{max:Math.max(42000,tied)})+
        `<p class="w-hint" style="margin-top:10px">${cc==='ph'?'Philippine registered export enterprises can buy many local inputs at 0% VAT instead, so far less cash gets trapped. Unregistered exporters must claim refunds, and claims have time limits.':cc==='cn'?'In China, export refund rates are set per product and can be lower than the 13% VAT rate. The difference is a real cost, so build it into export prices.':cc==='tw'?'At 5%, Taiwan\'s VAT traps less cash, and export refunds are generally processed routinely.':'UK businesses with mainly zero-rated sales can file monthly returns so refunds come back faster.'} Try a 9-month delay.</p>`; }
      ctx.ui.seg(segEl,Object.keys(RATES).map(k=>({v:k,label:RATES[k][0]+' '+Math.round(RATES[k][1]*100)+'%'})),cc,v=>{cc=v;draw();});
      ctx.ui.sliders(top,[
        {k:'buy',label:'Local purchases with VAT, per month',min:5000,max:80000,step:1000,v:40000,f:money},
        {k:'delay',label:'Months until refunds arrive',min:1,max:24,step:1,v:6,f:x=>x+' months'},
        {k:'back',label:'Share of input VAT you actually get back',min:50,max:100,step:5,v:100,f:x=>x+'%'}
      ],v=>{vals=v;draw();},ctx.uid);
    }),
    K('What the accounts show',
      `<p>Unrecovered input VAT sits on the balance sheet as a receivable (often called "input VAT" or "VAT recoverable"). If it grows month after month, refunds aren\'t being claimed, or claims are being rejected. Ask for it as its own line, with the age of each claim.</p>`),
    TIP('The US is different',
      `<p>The US has no VAT. States charge <span class="term">sales and use tax</span> on final sales to consumers; sales for resale and exports are generally exempt with the right certificates. For BraceWorks, US distributors handle sales tax when they sell on. What matters at the US border is customs duty and tariffs.</p>`)
  ]},
  /* ---------------------------------------------------------------- */
  {id:'cross', label:'Across borders', kind:'learn', title:'Selling across borders: five tax traps', blocks:[
    {t:'tbl', head:['Trap','What happens','How to manage it'], rows:[
      ['<strong>Customs duties and tariffs</strong>','Duty depends on the product\'s HS code, its origin and the importing country\'s rules. Under DDP, BraceWorks pays it.','Classify products correctly; check free trade agreements and rules of origin; check the current rate before every DDP quote.'],
      ['<strong>Withholding on payments abroad</strong>','Paying a foreign consultant, licensor or lender may require you to withhold tax and pay it to your tax office. Miss it, and you can owe the tax yourself, plus penalties.','Ask finance to check withholding before any payment abroad; use treaty rates with the right forms.'],
      ['<strong>Permanent establishment</strong>','A salesperson or agent abroad who regularly signs contracts, or a warehouse you run there, can make you taxable in that country.','Keep contract signing at head office; take advice before hiring people abroad.'],
      ['<strong>Transfer pricing</strong>','If the owner also owns a trading company or a supplier, prices between them must be at arm\'s length, and documented.','List related parties; price on market terms; keep the documentation the law requires.'],
      ['<strong>Indirect tax registration abroad</strong>','Holding stock in another country, or selling DDP, can require you to register for VAT or sales tax there.','Check before using a foreign warehouse or delivered terms.']
    ]},
    K('Tariffs move fast: the US example',
      `<p>US import tariffs changed repeatedly after 2025: broad tariffs introduced in April 2025 were struck down by the Supreme Court in February 2026, a temporary 10% surcharge followed until July 2026, and further measures are being challenged in court. Whatever the rate is when you read this, the lesson holds: <strong>if you sell DDP into a country, you carry its tariff risk.</strong> Price it, or move to FCA or FOB so the importer carries it.</p>`),
    Q('BraceWorks pays a Singapore consultant $10,000 to help with a CE technical file. What should finance check before paying?',[
      'Nothing: it\'s a normal supplier invoice','Whether withholding tax applies to the payment, and whether the treaty reduces it','Only the exchange rate','Whether the consultant charges VAT'],1,
      'Service and royalty payments abroad can carry withholding tax. If BraceWorks should have withheld and didn\'t, it can owe the tax itself.'),
    Q('BraceWorks hires a sales manager in Germany who negotiates and signs distributor contracts. What\'s the main tax risk?',[
      'German VAT on his salary','A permanent establishment: Germany may tax the profit linked to his work','None, because the products ship from home','Higher customs duty'],1,
      'Someone who habitually concludes contracts abroad can create a taxable presence there. Take advice before such a hire.')
  ]},
  /* ---------------------------------------------------------------- */
  {id:'compare', label:'Same profit, five systems', kind:'play', title:'Same profit, five tax systems', blocks:[
    `<p>Here\'s BraceWorks\' income tax if it were based in each country. It shows how differently systems work, not which is "best". Headline corporate income tax only: it ignores minimum taxes, local taxes, eligibility tests and exchange-rate movements.</p>`,
    W('BraceWorks\' income tax by country', function(el, ctx){
      const {money,pct}=ctx.h; const top=document.createElement('div'), out=document.createElement('div'); el.append(top,out);
      const PHP=58, GBP=1.32, RMB=7.1;
      ctx.ui.sliders(top,[
        {k:'pbt',label:'Profit before tax',min:20000,max:300000,step:2000,v:74000,f:money},
        {k:'gi',label:'Gross profit (sales minus cost of sales)',min:150000,max:600000,step:5000,v:340000,f:money}
      ],v=>{
        const p=v.pbt, gi=v.gi;
        const phSmall=(p*PHP<=5e6);
        const ukP=p/GBP; let ukT; if(ukP<=50000) ukT=ukP*0.19; else if(ukP>=250000) ukT=ukP*0.25; else ukT=ukP*0.25-(250000-ukP)*3/200; ukT*=GBP;
        const usState=p*0.06, usFed=(p-usState)*0.21;
        const R=[
          ['Philippines, standard',p*(phSmall?0.20:0.25),phSmall?'20% small-company rate applies (taxable income ≤ PHP 5M, assets ≤ PHP 100M)':'25% regular rate'],
          ['Philippines, registered exporter (5% SCIT)',gi*0.05,'5% of gross income earned, in place of most national and local taxes'],
          ['Taiwan, profits kept in the business',p*0.20+p*0.8*0.05,'20%, plus 5% surtax on earnings not distributed'],
          ['China',p<=3e6/RMB?p*0.05:p*0.25,p<=3e6/RMB?'5% effective rate for small low-profit enterprises, if it meets the size tests':'25% standard rate'],
          ['United States (6% state tax assumed)',usState+usFed,'21% federal plus state tax, which is deductible federally'],
          ['United Kingdom',ukT,ukP<=50000?'19% small profits rate':ukP>=250000?'25% main rate':'Marginal relief between 19% and 25%']
        ];
        const max=Math.max(...R.map(r=>r[1]));
        out.innerHTML=ctx.ui.bars(R.map(r=>({label:r[0],v:Math.round(r[1]),tone:'blue'})),{max})+ctx.ui.table(['System','Tax','Effective rate'],R.map(r=>[`${r[0]}<div class="small" style="color:var(--muted)">${r[2]}</div>`,money(Math.round(r[1])),pct(r[1]/p)]),{num:[1,2]})+
        `<p class="w-hint" style="margin-top:10px">${gi*0.05>p*0.25?'Notice: the 5% Philippine SCIT is charged on gross income, not profit. With thin profits it can cost more than the regular rate. Always model both before choosing an incentive regime.':'Push profit down and gross profit up: the 5% tax on gross income stops looking cheap. Incentives must be modelled for your own margins.'} Exchange rates used: PHP ${PHP}, £1 = $${GBP}, RMB ${RMB} per dollar.</p>`;
      },ctx.uid);
    }),
    K('What this teaches',
      `<ul>
        <li><strong>The headline rate is only the start.</strong> Small-company rates, incentives and surtaxes change the answer.</li>
        <li><strong>Some incentives tax gross income, not profit.</strong> They reward high-margin businesses and can hurt thin-margin ones.</li>
        <li><strong>Eligibility rules matter.</strong> Size tests, registration, export percentages and documentation decide whether you get the rate at all.</li>
       </ul>`)
  ]},
  /* ---------------------------------------------------------------- */
  {id:'ph', label:'Philippines', kind:'learn', title:'Philippines', blocks:[
    `<p class="small" style="color:var(--muted)">${ASOF}</p>`,
    SNAP([
      ['Corporate income tax','25% regular rate. 20% for domestic companies with net taxable income up to PHP 5 million and total assets up to PHP 100 million (excluding land). Minimum corporate income tax of 2% of gross income from the 4th year of operations, paid if higher than the regular tax.'],
      ['Incentives for exporters','Companies registered with an investment promotion agency (such as PEZA or BOI) can get an income tax holiday, then either a <strong>5% special corporate income tax on gross income earned</strong> (in place of most national and local taxes) or the <strong>enhanced deductions regime at 20%</strong> plus extra deductions. The CREATE MORE Act (2024) lowered the enhanced-deductions rate and lengthened incentive periods.'],
      ['VAT','12%. Export sales are zero-rated. Registration is required above PHP 3 million of annual sales. Refunds of input VAT on zero-rated sales: the BIR is to decide within 90 days of a complete claim; claims have a two-year filing window. Registered export enterprises can buy qualifying local goods and services at 0% VAT and import with VAT exemption.'],
      ['Invoicing','Since the Ease of Paying Taxes Act (2024), the invoice is the main document for both goods and services. VAT-compliant invoices are needed to claim input VAT.'],
      ['Withholding','Payments to non-resident foreign companies: generally 25%, with 15% possible on dividends and 20% on interest, reduced by treaties. Locally, many payments to suppliers carry creditable ("expanded") withholding, typically 1% on goods and 2% on services when paid by top withholding agents.'],
      ['Payroll','Employer contributions to SSS, PhilHealth and Pag-IBIG (HDMF). <strong>13th-month pay</strong> of at least 1/12 of annual basic salary is required by law, paid by 24 December: accrue it every month. It\'s exempt from income tax up to PHP 90,000 per employee.'],
      ['Other','Local business tax set by each city, usually up to about 3% of prior-year gross sales (registered exporters on the 5% regime are largely covered). Documentary stamp tax on some documents. Transfer pricing rules require arm\'s-length related-party dealings.'],
      ['Watch-outs for a business like yours','Input VAT refunds that are slow or never filed. Missing 13th-month accruals in monthly profit. Choosing between the 5% gross-income regime and the 20% enhanced-deductions regime without modelling both.']
    ]),
    {t:'html',html:`<p class="small">Sources: ${SRC('PwC Worldwide Tax Summaries: Philippines','https://taxsummaries.pwc.com/philippines')} · ${SRC('Grant Thornton Philippines on VAT zero-rating under CREATE MORE','https://www.grantthornton.com.ph/insights/articles-and-updates1/lets-talk-tax/what-lies-beyond-exploring-vat-zero-rating-and-certification-under-the-create-more-act/')} · ${SRC('Acclime: tax incentives in the Philippines','https://philippines.acclime.com/guides/tax-incentives/')}</p>`}
  ]},
  {id:'tw', label:'Taiwan', kind:'learn', title:'Taiwan', blocks:[
    `<p class="small" style="color:var(--muted)">${ASOF}</p>`,
    SNAP([
      ['Corporate income tax','20%. Taxable income up to NT$120,000 is exempt. An extra <strong>5% surtax on undistributed earnings</strong> applies to profit kept in the company at year-end, which pushes companies to distribute or reinvest. An alternative minimum tax (income basic tax) of 12% applies to certain exempt income.'],
      ['Business tax (VAT)','5% on most goods and services. Exports are zero-rated, and input VAT on them is refundable.'],
      ['Invoicing','Uniform government invoices, now mostly electronic, are required for sales and for claiming input tax.'],
      ['Withholding','Payments to non-residents: dividends 21%, interest 15–20%, royalties 20% (some approved technology royalties exempt). Treaties with over 40 jurisdictions often reduce these.'],
      ['Payroll','Employer pays 70% of labour insurance and 60% of national health insurance premiums, and at least 6% of monthly wages into the employee\'s labour pension account.'],
      ['Incentives','R&amp;D tax credits under the Statute for Industrial Innovation (a share of qualifying R&amp;D spend, capped at 30% of the year\'s income tax). Export processing zones and science parks offer duty and tax benefits.'],
      ['Watch-outs for a business like yours','The 5% surtax if profits are retained: plan dividends and reinvestment. Transfer pricing documentation for related-party dealings in China or elsewhere.']
    ]),
    {t:'html',html:`<p class="small">Sources: ${SRC('PwC Worldwide Tax Summaries: Taiwan','https://taxsummaries.pwc.com/taiwan')}</p>`}
  ]},
  {id:'cn', label:'China', kind:'learn', title:'China', blocks:[
    `<p class="small" style="color:var(--muted)">${ASOF}</p>`,
    SNAP([
      ['Corporate income tax','25% standard. <strong>Small low-profit enterprises</strong> pay an effective 5% on taxable income up to RMB 3 million (2023–2027), if they meet headcount and asset tests. High and new technology enterprises pay 15%. Qualifying R&amp;D costs get an extra deduction on top of the actual spend.'],
      ['VAT','13% on goods (9% and 6% for some goods and services). A new VAT Law took effect on 1 January 2026, consolidating the rules. Small-scale taxpayers pay a reduced rate.'],
      ['Exports','Goods use an "exempt, credit, refund" system. <strong>Export refund rates are set per product, from 0% to 13%</strong>, so where the refund rate is below the VAT rate, part of the input VAT becomes a real cost of exporting.'],
      ['Invoicing','Official VAT invoices (fapiao), now fully digital, are needed to claim input VAT and many expense deductions. No fapiao, no deduction.'],
      ['Withholding','10% on dividends, interest and royalties paid to non-residents, reduced by treaties.'],
      ['Payroll','Mandatory social insurance (pension, medical, unemployment, injury, maternity) and housing fund contributions. Employer rates and contribution bases are set by each city and are a substantial share of salary.'],
      ['Watch-outs for a business like yours','The export refund rate for each HS code. Foreign exchange rules on payments abroad. Bonded processing arrangements if materials are imported for re-export.']
    ]),
    {t:'html',html:`<p class="small">Sources: ${SRC('PwC Worldwide Tax Summaries: China','https://taxsummaries.pwc.com/peoples-republic-of-china')}</p>`}
  ]},
  {id:'us', label:'United States', kind:'learn', title:'United States', blocks:[
    `<p class="small" style="color:var(--muted)">${ASOF}</p>`,
    SNAP([
      ['Corporate income tax','21% federal, plus state income tax of 0% to about 10% depending on the state. From 2026, US companies that export can deduct part of qualifying foreign-derived income (now called FDDEI), for an effective federal rate of about 14% on that income.'],
      ['Investment and R&amp;D','100% bonus depreciation was made permanent for qualifying property acquired after 19 January 2025, and domestic research costs can again be deducted immediately.'],
      ['Sales tax (no VAT)','No federal VAT. States charge sales and use tax, generally 2.9% to 7.25% at state level plus local rates. Sales for resale and exports are generally exempt with the right certificates. Selling into a state above its thresholds can require registering there ("economic nexus").'],
      ['Customs and tariffs','Duty depends on the product\'s HTS code and origin. Tariffs have changed repeatedly since 2025 and some are still in court: check the current rate before quoting delivered prices. The 2.3% medical device excise tax was repealed from 2020.'],
      ['Withholding','30% on US-source dividends, interest and royalties paid to foreign persons, unless a treaty reduces it.'],
      ['Payroll','Employer Social Security 6.2% (up to $184,500 of wages in 2026), Medicare 1.45%, plus federal and state unemployment taxes.'],
      ['Watch-outs for a business like yours','Selling DDP to US distributors makes you the importer of record, carrying duties and tariffs. Staff or agents in the US who habitually sign contracts can create US income tax exposure.']
    ]),
    {t:'html',html:`<p class="small">Sources: ${SRC('PwC Worldwide Tax Summaries: United States','https://taxsummaries.pwc.com/united-states')} · ${SRC('BDO on FDDEI under the One Big Beautiful Bill Act','https://www.bdo.com/insights/tax/fdii-transformed-how-the-obbba-reshapes-the-deduction-for-foreign-derived-income')} · ${SRC('BDO on the Supreme Court IEEPA tariff ruling','https://www.bdo.com/insights/tax/supreme-court-invalidates-ieepa-tariffs-administration-replaces-with-new-surcharge-what-importers')}</p>`}
  ]},
  {id:'uk', label:'United Kingdom', kind:'learn', title:'United Kingdom', blocks:[
    `<p class="small" style="color:var(--muted)">${ASOF}</p>`,
    SNAP([
      ['Corporation tax','25% main rate on profits above £250,000; 19% small profits rate up to £50,000; marginal relief in between. Thresholds are shared between associated companies.'],
      ['Investment and R&amp;D','Full expensing (a 100% first-year deduction) for new main-rate plant and machinery, made permanent, and an Annual Investment Allowance of £1 million. A merged R&amp;D scheme gives a 20% above-the-line credit, with extra support for R&amp;D-intensive small companies.'],
      ['VAT','20% standard rate; registration threshold £90,000. Exports are zero-rated. Certain equipment designed for disabled people can be zero-rated when supplied to them or to eligible charities (HMRC Notice 701/7), which can apply to some patient aids. Importers can use postponed VAT accounting.'],
      ['Withholding','No withholding on dividends. 20% on interest and royalties paid to non-residents, reduced by treaties.'],
      ['Payroll','Employer National Insurance of 15% on earnings above £5,000 a year (from April 2025), with an Employment Allowance that reduces the bill for smaller employers.'],
      ['Watch-outs for a business like yours','Customs and VAT between the UK and the EU are now separate. UKCA and CE marking rules for medical devices. Making Tax Digital rules for VAT records.']
    ]),
    {t:'html',html:`<p class="small">Sources: ${SRC('PwC Worldwide Tax Summaries: United Kingdom','https://taxsummaries.pwc.com/united-kingdom')} · ${SRC('HMRC VAT Notice 701/7: reliefs for disabled people','https://www.gov.uk/guidance/vat-relief-for-disabled-and-older-people')}</p>`}
  ]},
  /* ---------------------------------------------------------------- */
  {id:'case', label:'Case: the forgotten refund', kind:'case', title:'The refund nobody filed', blocks:[
    CASE('$96,000 of "other receivables"',
      `<p>Reviewing BraceWorks\' balance sheet line by line, you notice "other current assets" has grown every year: <strong>$96,000</strong> now, more than twice the cash in the bank. The accountant explains it\'s input VAT on local purchases. The company zero-rates its export sales, so it pays VAT on foam and power but charges none.</p>
       <p>Refund claims were filed for the first year only. That claim took 14 months and needed three rounds of documents, so nobody filed again.</p>`),
    W('Input VAT waiting to be recovered', function(el,ctx){
      const q=['Q1 Y1','Q2','Q3','Q4','Q1 Y2','Q2','Q3','Q4','Q1 Y3','Q2','Q3','Q4'], v=[8,16,24,32,22,30,38,46,58,70,82,96];
      el.innerHTML=ctx.ui.bars(q.map((x,i)=>({label:x,v:v[i]*1000,tone:i>=8?'bad':i>=4?'warn':''})),{max:100000})+'<p class="w-hint" style="margin-top:8px">The dip in year 2 is the one refund that arrived. After that the balance only grows. Claims older than the legal filing window can be lost for good.</p>';
    }),
    Q('What should you do first?',[
      {text:'Write the balance off: refunds take too long', why:'That throws away real cash. Most of it is still claimable.'},
      {text:'Find out which quarters are still within the filing window, file those claims now with complete documents, and stop new balances building up'},
      {text:'Stop exporting', why:'Exports are the business. The fix is in the paperwork and registrations.'},
      {text:'Ask suppliers to stop charging VAT', why:'Suppliers must charge VAT unless you qualify for zero-rated purchases.'}
    ],1,'File what\'s still recoverable, starting with the oldest claims at risk of expiring. Then look at registering for 0% VAT on local purchases where the law allows it (in the Philippines, as a registered export enterprise), so the balance stops building.'),
    K('How accounting catches it',
      `<p>Give input VAT its own balance sheet line, with an aging by quarter, like receivables. Reconcile it to the VAT returns each month. Add "VAT refunds outstanding" to the 13-week cash forecast with realistic dates. A $96,000 balance would have stood out in year one.</p>`)
  ]},
  /* ---------------------------------------------------------------- */
  {id:'quiz', label:'Quiz', kind:'quiz', title:'Check your understanding', blocks:[
    Q('Why are exports usually zero-rated for VAT?',['To help exporters\' profits','Because VAT follows the destination principle: consumption is taxed where it happens, so the importing country charges its own VAT','Because foreign customers refuse to pay VAT','It\'s a temporary incentive'],1,'The buyer\'s country taxes the consumption on import.'),
    Q('What\'s the difference between zero-rated and exempt sales?',['There isn\'t one','Zero-rated: 0% VAT and input VAT can be reclaimed. Exempt: no VAT and input VAT can\'t be reclaimed.','Exempt sales have a lower rate','Zero-rated sales can\'t be exported'],1,'Exporters want zero-rating, because reclaimable input VAT keeps it from becoming a cost.'),
    Q('Accounting profit is $74,000. Fines of $3,000 aren\'t deductible. At 25%, what\'s the tax, ignoring other differences?',['$18,500','$19,250','$17,750','$3,000'],1,'Taxable profit is $77,000; 25% gives $19,250. The effective rate rises to 26%.'),
    Q('Tax depreciation is faster than accounting depreciation in the early years. What happens?',['Total tax over the asset\'s life falls','Tax is paid later rather than sooner: a timing difference','The asset becomes tax-free','Profit falls'],1,'Fast tax depreciation defers tax. The accounts record a deferred tax liability.'),
    Q('A Philippine registered exporter has gross income of $340,000 and profit of $40,000. Which costs less: 5% of gross income, or 25% of profit?',['5% of gross income: $17,000','25% of profit: $10,000','They\'re the same','Neither applies'],1,'With thin profits, a tax on gross income can be more expensive. Model both.'),
    Q('Which of these most often creates a taxable presence abroad?',['Shipping goods to a foreign distributor','A local employee who habitually signs contracts on your behalf','Exhibiting at a trade show','Receiving payment in euros'],1,'That\'s the classic permanent establishment risk.'),
    Q('Why do withholding taxes exist?',['To punish foreign companies','Because it\'s easier to collect tax from the local payer than to chase the foreign recipient','To replace VAT','To reduce tariffs'],1,'Withholding collects tax at the source. Treaties often reduce the rate.')
  ]},
  /* ---------------------------------------------------------------- */
  {id:'apply', label:'Practice', kind:'apply', title:'Practise: a tax health check', blocks:[
    SORT('Which tax mainly applies? Sort each situation.',['Income tax','VAT or sales tax','Withholding','Customs duty','Payroll'],[
      {text:'BraceWorks buys $20,000 of foam from a local supplier', a:1, why:'Input VAT on a local purchase.'},
      {text:'BraceWorks pays a licence fee to a US software company', a:2, why:'Royalty-type payments abroad may need withholding.'},
      {text:'BraceWorks ships mattresses DDP to Germany', a:3, why:'Under DDP, BraceWorks pays the import duty (and German import VAT).'},
      {text:'BraceWorks pays its December 13th-month pay', a:4, why:'A payroll cost, with contributions and withholding on wages.'},
      {text:'BraceWorks makes a $74,000 profit', a:0, why:'Corporate income tax on taxable profit.'}
    ]),
    REPORT('Questions for your finance team or tax adviser',
      `<ul>
        <li>What was our effective tax rate last year, and why does it differ from the headline rate?</li>
        <li>How much input VAT is waiting to be recovered, by quarter? Which claims are close to their filing deadline?</li>
        <li>Do we qualify for any export incentive or 0% VAT on local purchases? Have we modelled the alternatives?</li>
        <li>Which payments abroad did we make last year, and did we withhold tax correctly on each?</li>
        <li>Do we have any related-party transactions, and is the transfer pricing documented?</li>
        <li>What are our tax payment dates for the next 12 months, and are they in the cash forecast?</li>
       </ul>`),
    {t:'html',html:'<h3>Later, with your own business</h3><p class="small" style="color:var(--muted)">Optional. Ticks are saved only in this browser.</p>'},
    CHECK('m19-tax','At my company…',[
      'I know our effective tax rate and the main reasons it differs from the headline rate',
      'Input VAT recoverable is its own line in the monthly pack, aged by quarter',
      'VAT refund claims are filed on schedule, with complete documents',
      'Tax payment dates are in the 13-week cash forecast',
      'Payments abroad are checked for withholding before they\'re made',
      'Related-party transactions are listed and priced at arm\'s length',
      'Monthly accounts accrue payroll costs such as 13th-month pay and contributions',
      'We\'ve checked which incentives we qualify for, with a licensed adviser'
    ]),
    K('Takeaways',
      `<ul>
        <li>Most tax rules follow a few principles: residence, source, destination, withholding, treaties, arm\'s length, and incentives.</li>
        <li>Taxable profit differs from accounting profit; the effective tax rate tells you how much.</li>
        <li>Exporters pay input VAT but charge none, so refunds can trap a lot of cash. Track and claim them.</li>
        <li>Cross-border traps: withholding, permanent establishment, transfer pricing, duties and tariffs.</li>
        <li>Incentives can matter more than headline rates, but only if you qualify and model them for your own margins.</li>
       </ul>`)
  ]}
  ],
  warnings:[
    {sign:'Input VAT recoverable growing every quarter', meaning:'Refund claims not filed or being rejected; cash is trapped and claims may expire.', look:'Input VAT aging by quarter; refund claims filed and their status.'},
    {sign:'Effective tax rate far from the headline rate, unexplained', meaning:'Non-deductible costs, missed incentives, errors or prior-year adjustments.', look:'Tax reconciliation from accounting profit to tax charge.'},
    {sign:'Payments abroad with no withholding considered', meaning:'You may owe the tax yourself, plus penalties.', look:'List of foreign payments and the withholding treatment of each.'},
    {sign:'Staff or agents abroad signing contracts', meaning:'Possible taxable presence (permanent establishment) in that country.', look:'Contracts, job descriptions, who signs what.'},
    {sign:'DDP quotes into a new country', meaning:'Duties, tariffs, import VAT and registration obligations become yours.', look:'Landed cost check with a freight forwarder or customs broker.'}
  ],
  formulas:[
    {name:'VAT payable', f:'Output VAT (on sales) − Input VAT (on purchases)', ex:'Exporter: $0 output − $4,800 input = $4,800 refund due'},
    {name:'Cash waiting in VAT refunds', f:'Monthly input VAT × Months until refund', ex:'$4,800 × 9 months = $43,200'},
    {name:'Effective tax rate', f:'Total tax expense ÷ Profit before tax', ex:'$19,250 ÷ $74,000 = 26.0%'},
    {name:'Current tax', f:'Taxable profit × Tax rate', ex:'$77,000 × 25% = $19,250'}
  ],
  glossary:[
    {term:'Residence principle', def:'A company is taxed on its profits in the country where it is incorporated or managed.'},
    {term:'Source principle', def:'A country taxes income that arises within it, such as profits of a local branch or interest paid from it.'},
    {term:'Destination principle', def:'Consumption taxes are charged where goods are consumed. Exports are zero-rated; imports are taxed.'},
    {term:'Input VAT', def:'VAT a business pays on its purchases, normally reclaimable.'},
    {term:'Output VAT', def:'VAT a business charges on its sales and pays over to the tax office.'},
    {term:'Zero-rated', def:'Taxable at 0% VAT, with input VAT still reclaimable. Most exports are zero-rated.'},
    {term:'VAT exempt', def:'Outside VAT: no VAT charged, but the related input VAT can\'t be reclaimed.'},
    {term:'Taxable profit', def:'Profit calculated under tax rules, starting from accounting profit and adjusting for non-deductible items and timing differences.'},
    {term:'Effective tax rate', def:'Total tax expense divided by profit before tax.'},
    {term:'Deferred tax', def:'Tax that will be paid or saved in future because of timing differences between accounting and tax rules.'},
    {term:'Tax depreciation (capital allowances)', def:'Depreciation allowed by the tax law, often at different rates from the accounts.'},
    {term:'Tax loss carryforward', def:'A tax loss that can be offset against taxable profits in later years, within limits.'},
    {term:'Withholding tax', def:'Tax the payer deducts from a payment and pays to the tax office on the recipient\'s behalf.'},
    {term:'Tax treaty', def:'An agreement between two countries that prevents double taxation and often reduces withholding rates.'},
    {term:'Permanent establishment', def:'A fixed place of business or a dependent agent that makes a foreign company taxable in a country.'},
    {term:'Transfer pricing', def:'The prices charged between related companies. Tax rules require them to be at arm\'s length.'},
    {term:'Arm\'s length', def:'The terms unrelated parties would agree in the same situation.'},
    {term:'HS code', def:'The Harmonized System number that classifies a product for customs duty. Called HTS in the US.'},
    {term:'Rules of origin', def:'Rules that decide which country a product "comes from", affecting duty rates and trade-agreement benefits.'},
    {term:'Importer of record', def:'The party legally responsible for importing goods and paying duties. Under DDP, that\'s the seller.'},
    {term:'Tax holiday', def:'A period during which a qualifying company pays little or no income tax.'},
    {term:'Special corporate income tax (SCIT)', def:'In the Philippines, a 5% tax on gross income earned available to qualifying registered enterprises, in place of most other taxes.'},
    {term:'Minimum corporate income tax (MCIT)', def:'In the Philippines, a 2% tax on gross income payable when it exceeds the regular income tax, from the 4th year of operations.'},
    {term:'13th-month pay', def:'In the Philippines, a legally required extra month\'s basic pay each year, accrued monthly in good accounts.'},
    {term:'Fapiao', def:'China\'s official tax invoice, needed to claim input VAT and many expense deductions.'},
    {term:'Profit retention tax', def:'Taiwan\'s 5% surtax on earnings kept in a company rather than distributed.'},
    {term:'Sales and use tax', def:'US state taxes on final sales to consumers, in place of VAT.'},
    {term:'Economic nexus', def:'A US rule that requires out-of-state sellers to register for a state\'s sales tax once their sales there pass a threshold.'},
    {term:'National Insurance', def:'UK social security contributions paid by employers and employees on earnings.'},
    {term:'Social insurance', def:'Mandatory contributions for pensions, health and similar benefits, paid by employers and employees.'}
  ]
});
})();
