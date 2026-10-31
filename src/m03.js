/* ===== Module 3: The income statement ===== */
(function(){
const {K,TIP,FLAG,CASE,REPORT,Q,FS,FLIP,SORT,CHECK,W,PACK,money,signed,pct,kfmt} = BW.h;
const D=BW.data;
const R=D.pl.revenue, p=x=>pct(x/R);

BW.add({
  id:'m3', minutes:40,
  title:'The income statement',
  subtitle:'Every line of BraceWorks\' P&L opened up, the margins that matter, and where a manufacturer\'s profit quietly leaks away.',
  goals:[
    'Read a manufacturer\'s P&L line by line and say what drives each line',
    'Calculate gross margin, operating margin, EBITDA and net margin',
    'Use "% of revenue" to spot costs creeping up',
    'See why a small price change usually beats a big volume push'
  ],
  sections:[
  {id:'full', label:'The full P&L', kind:'learn', title:'BraceWorks\' full income statement', blocks:[
    `<p>In Module 1 you saw a simplified P&amp;L. Here's the version a good monthly pack should give you. The right-hand column shows each line as a <strong>% of revenue</strong>. This is the single most useful column on any P&amp;L, because it lets you compare months of different sizes.</p>`,
    FS({title:'BraceWorks Medical · Income statement', sub:'Year ended 31 December', cols:['$','% of revenue'], rows:[
      ['Revenue', [R,'100.0%'], 'sub'],
      'Cost of goods sold',
      ['Direct materials (foam, fabric, webbing, buckles, packaging)', [-552000,p(552000)], 'ind'],
      ['Direct labour (38 production staff)', [-152000,p(152000)], 'ind'],
      ['Factory overhead', [-156000,p(156000)], 'ind'],
      ['Total cost of goods sold', [-860000,p(860000)], 'sub'],
      ['Gross profit', [340000,p(340000)], 'sub'],
      'Selling and export costs',
      ['Freight and export documents', [-48000,p(48000)], 'ind'],
      ['Sales commissions', [-24000,p(24000)], 'ind'],
      ['Trade shows and marketing', [-14000,p(14000)], 'ind'],
      'Administration',
      ['Office salaries (6 people)', [-96000,p(96000)], 'ind'],
      ['Regulatory and certification (ISO 13485, FDA, CE)', [-22000,p(22000)], 'ind'],
      ['Office rent', [-12000,p(12000)], 'ind'],
      ['Audit, tax and legal fees', [-10000,p(10000)], 'ind'],
      ['Insurance', [-8000,p(8000)], 'ind'],
      ['IT, phones and other', [-12000,p(12000)], 'ind'],
      ['Total operating expenses', [-246000,p(246000)], 'sub'],
      ['Operating profit (EBIT)', [94000,p(94000)], 'sub'],
      ['Interest on bank loans', [-14000,p(14000)], 'ind'],
      ['Foreign exchange loss', [-6000,p(6000)], 'ind'],
      ['Profit before tax', [74000,p(74000)], 'sub'],
      ['Income tax (25%)', [-18500,p(18500)], 'ind'],
      ['Net profit', [55500,p(55500)], 'total']
    ], note:'Factory overhead is indirect labour $36k, power and water $42k, depreciation $38k, factory rent $24k, repairs and consumables $16k. The 25% tax rate is an example; real rates and incentives vary by country (Module 19).'}),
    `<h3>The structure, in plain words</h3>
     <ul>
      <li><strong>Cost of goods sold</strong> is everything it takes to <em>make</em> what you sold. In a factory it has three parts: materials, the people who make the products, and the cost of running the factory (overhead).</li>
      <li><strong>Operating expenses</strong> are everything it takes to <em>sell</em> the products and <em>run</em> the company. You'll often see them called SG&amp;A: selling, general and administrative.</li>
      <li><strong>Below operating profit</strong> come the costs of how the business is <em>financed</em> (interest), currency movements and tax. A GM controls these less directly.</li>
     </ul>`,
    K('Materials are BraceWorks\' biggest cost by far',
      `<p>46 cents of every sales dollar goes on materials, three times more than direct labour. That tells you where to look first for savings: purchasing, scrap, yield and design. A 5% saving on materials is worth $27,600 a year, which is half of last year's net profit.</p>`),
    TIP('Coming in 2027: the same lines in a new order',
      `<p>Companies reporting under full IFRS or full PFRS adopt a new standard, <strong>IFRS 18</strong>, for years starting on or after 1 January 2027 (Taiwan-IFRS companies from 2028). Profit doesn't change, but the layout does: <strong>operating profit</strong> becomes a required line, interest moves into a separate financing section, and exchange differences follow the item that caused them. BraceWorks' $6,000 loss on customer balances would move <em>above</em> operating profit, which would show $88,000 instead of $94,000. Module 21 lays the whole statement out the new way.</p>`)
  ]},
  {id:'margins', label:'The four margins', kind:'learn', title:'The four margins every GM should know', blocks:[
    `<p>A margin is a profit expressed as a % of revenue. Each one answers a different question about the business.</p>`,
    {t:'tbl', head:['Margin','Formula','BraceWorks','What it tells you'], rows:[
      ['<strong>Gross margin</strong>','Gross profit ÷ Revenue','<span class="num">28.3%</span>','How well the factory turns materials and labour into products customers pay more for. Pricing, purchasing and production efficiency.'],
      ['<strong>EBITDA margin</strong>','(Operating profit + Depreciation) ÷ Revenue','<span class="num">11.0%</span>','Cash-like operating earnings before equipment costs and financing. Banks love this one.'],
      ['<strong>Operating margin</strong>','Operating profit ÷ Revenue','<span class="num">7.8%</span>','How profitable the whole operation is, after overheads, before financing and tax.'],
      ['<strong>Net margin</strong>','Net profit ÷ Revenue','<span class="num">4.6%</span>','What\'s left for the owners. Affected by debt levels and tax as well as operations.']
    ]},
    `<h3>What's EBITDA?</h3>
     <p><span class="term">EBITDA</span> stands for Earnings Before Interest, Tax, Depreciation and Amortisation. For BraceWorks: operating profit $94,000 + depreciation $38,000 = <strong>$132,000</strong>.</p>
     <p>Banks and buyers use it because it strips out financing choices and accounting estimates, giving a rough view of the cash the operations generate. But be careful: machines do wear out and need replacing. A business that "makes" EBITDA but never has money to replace equipment isn't really profitable.</p>`,
    K('Is 28% gross margin good?',
      `<p>It depends on the industry, so the most useful comparison is <strong>BraceWorks against itself over time</strong>, and against the budget. As a rough guide, many small contract manufacturers run gross margins between 25% and 40%. Companies selling under their own brand to hospitals usually sit at the higher end. BraceWorks at 28% has little room for mistakes: a 3-point slip in gross margin wipes out about half of net profit.</p>`),
    Q('Sales stay at $1.2M but gross margin falls from 28.3% to 25.3%. Other costs stay the same. Roughly what happens to operating profit?',[
      'It falls by about $3,600','It falls by about $36,000','It falls by 3%','It doesn\'t change'],1,
      '3 percentage points of $1.2M is $36,000. Operating profit drops from $94,000 to about $58,000, a 38% fall. Small margin changes have big effects when net margins are thin.')
  ]},
  {id:'levers', label:'Profit levers', kind:'play', title:'Which lever moves profit most?', blocks:[
    `<p>You have four levers: price, volume, material cost and wages. Move them and see what happens to net profit. Some costs move with volume (materials, freight, commissions). Others stay put in the short term (factory overhead, office costs). The model assumes the factory can make up to 15% more without hiring.</p>`,
    W('BraceWorks profit levers', function(el, ctx){
      const {money,signed,pct}=ctx.h;
      const top=document.createElement('div'), out=document.createElement('div'); el.append(top,out);
      const base={rev:1200000,mat:552000,lab:152000,ovh:156000,frt:48000,com:24000,otherOpex:174000,int:20000};
      function calc(v){
        const P=1+v.price/100, V=1+v.vol/100, M=1+v.mat/100, L=1+v.wage/100;
        const rev=base.rev*P*V, mat=base.mat*V*M, lab=base.lab*L, ovh=base.ovh, frt=base.frt*V, com=base.com*P*V;
        const gp=rev-mat-lab-ovh, ebit=gp-frt-com-base.otherOpex, pbt=ebit-base.int, tax=Math.max(0,pbt*0.25), net=pbt-tax;
        return {rev,gp,ebit,net};
      }
      const b0=calc({price:0,vol:0,mat:0,wage:0});
      ctx.ui.sliders(top,[
        {k:'price',label:'Selling price change',min:-10,max:10,step:1,v:0,f:x=>(x>0?'+':'')+x+'%'},
        {k:'vol',label:'Units sold change',min:-20,max:15,step:1,v:0,f:x=>(x>0?'+':'')+x+'%'},
        {k:'mat',label:'Material cost per unit change',min:-10,max:15,step:1,v:0,f:x=>(x>0?'+':'')+x+'%'},
        {k:'wage',label:'Wage rate change',min:-5,max:15,step:1,v:0,f:x=>(x>0?'+':'')+x+'%'}
      ],(v)=>{
        const r=calc(v), d=r.net-b0.net;
        // single-lever comparisons for the insight
        const one=k=>calc(Object.assign({price:0,vol:0,mat:0,wage:0},{[k]:5})).net-b0.net;
        out.innerHTML=`<div class="stats">
          ${ctx.ui.stat('Revenue',money(r.rev),'',signed(r.rev-b0.rev))}
          ${ctx.ui.stat('Gross margin',pct(r.gp/r.rev),'',`was ${pct(b0.gp/b0.rev)}`)}
          ${ctx.ui.stat('Operating profit',money(r.ebit),'',signed(r.ebit-b0.ebit))}
          ${ctx.ui.stat('Net profit',money(r.net),d>500?'good':d<-500?'bad':'',`${signed(d)} (${d>=0?'+':''}${Math.round(d/b0.net*100)}%)`)}
        </div>
        <h4 style="margin:14px 0 8px">What a 5% move in each lever does to net profit</h4>
        ${ctx.ui.bars([{label:'Price +5%',v:one('price'),tone:'good'},{label:'Volume +5%',v:one('vol'),tone:'blue'},{label:'Materials +5%',v:one('mat'),tone:'bad'},{label:'Wages +5%',v:one('wage'),tone:'bad'}],{fmt:x=>signed(Math.round(x))})}
        <p class="w-hint" style="margin-top:10px">A 5% price rise adds about twice as much profit as 5% more volume. Every extra unit sold costs materials, freight and commission, but a higher price on the same units drops almost straight to profit. A 5% rise in material prices that you don't pass on wipes out more than a third of net profit.</p>`;
      },ctx.uid);
    }),
    K('The price lever',
      `<p>Because BraceWorks' net margin is thin (4.6%), each 1% of price is worth about $9,000 of net profit, around 16% of the total. Small manufacturers often under-use price. They hold prices for years while material and wage costs rise, and the margin quietly erodes. Module 12 covers how to price export quotes with confidence.</p>`)
  ]},
  {id:'leaks', label:'Where profit leaks', kind:'learn', title:'Where profit leaks in a manufacturer\'s P&L', blocks:[
    `<p>Profit rarely disappears in one dramatic event. It drips out through lines that each look small. Here are the leaks to watch at BraceWorks, and how each one shows up.</p>`,
    {t:'tbl', head:['Leak','How it shows in the P&L','What to ask for'], rows:[
      ['<strong>Supplier price rises not passed on</strong>','Materials % of revenue creeps up month after month.','Material cost per unit, by product, over 12 months.'],
      ['<strong>Scrap and rework</strong>','Hidden inside materials and labour, so you can\'t see it.','A separate scrap and rework account (Module 8).'],
      ['<strong>Freight absorbed</strong>','Freight out % rises, especially when quoting delivered prices (CIF, DDP).','Freight cost as % of sales, by customer.'],
      ['<strong>Discounts and credit notes</strong>','Revenue is shown net, so you never see what was given away.','Gross sales, discounts and returns shown on separate lines.'],
      ['<strong>Overtime</strong>','Direct labour % jumps in busy months.','Overtime hours and cost, separately from normal wages.'],
      ['<strong>Currency</strong>','A foreign exchange line that\'s bigger than you expected.','Breakdown of gains and losses by currency, and why.'],
      ['<strong>One-off items mixed in</strong>','A big write-off or legal bill makes a normal month look terrible, or hides a bad one.','One-offs shown separately, so you can see the underlying trend.']
    ]},
    `<h3>Spot the leak</h3><p>Here are BraceWorks' cost lines as % of revenue for six months. Sales were steady at around $100,000 a month.</p>`,
    {t:'tbl', head:['% of revenue','Jan','Feb','Mar','Apr','May','Jun'], opts:{num:[1,2,3,4,5,6]}, rows:[
      ['Direct materials','45.8%','46.1%','46.9%','48.0%','49.2%','50.3%'],
      ['Direct labour','12.6%','12.8%','12.5%','12.9%','12.7%','12.6%'],
      ['Factory overhead','13.1%','12.9%','13.0%','13.2%','12.9%','13.0%'],
      ['Freight and export docs','4.0%','3.9%','4.1%','4.0%','4.1%','3.9%'],
      {cls:'', cells:['<strong>Gross margin</strong>','<strong>28.5%</strong>','<strong>28.2%</strong>','<strong>27.6%</strong>','<strong>25.9%</strong>','<strong>25.2%</strong>','<strong>24.1%</strong>']}
    ]},
    Q('Which line is leaking, and what are the two most likely causes?',[
      'Direct labour: overtime and new hires',
      'Direct materials: supplier price increases not passed to customers, or rising scrap',
      'Factory overhead: higher power costs',
      'Nothing. Monthly figures always move around.'],1,
      'Materials rose 4.5 points in six months while everything else stayed flat. That\'s worth about $4,500 a month, or $54,000 a year. Ask purchasing for price changes on foam and fabric, and production for scrap rates. Without the % column, at steady sales, the rising cost in dollars is easy to miss.'),
    TIP('Read across, not down',
      `<p>Reading a P&amp;L top to bottom tells you about one month. Reading <em>across</em> 6 to 12 months of the same line tells you about the business. Ask for a trailing 12-month view with % of revenue. It's the fastest way to see trends.</p>`)
  ]},
  {id:'case', label:'Case: growth that hurt', kind:'case', title:'The growth that made BraceWorks poorer', blocks:[
    CASE('Sales up 18%, profit down by half',
      `<p>To grow, the previous GM tried three things in one year:</p>
       <ul>
        <li>Sales reps could offer up to 10% discount to win new distributors.</li>
        <li>New customers were offered <strong>DDP terms</strong>: BraceWorks pays freight, insurance and import duties all the way to the customer's door.</li>
        <li>Commission was raised from 2% to 3% of sales.</li>
       </ul>
       <p>Units sold rose 25%. The sales team celebrated. Here's the P&amp;L:</p>`),
    FS({title:'Before and after the growth push', cols:['Before','After','Change'], rows:[
      ['Revenue', [1200000,1410000,'+17.5%'], 'sub'],
      ['Direct materials', [-552000,-690000,'+25.0%'], 'ind'],
      ['Direct labour (incl. $30k overtime)', [-152000,-182000,'+19.7%'], 'ind'],
      ['Factory overhead', [-156000,-164000,'+5.1%'], 'ind'],
      ['Gross profit', [340000,374000,'+10.0%'], 'sub'],
      ['Gross margin', ['28.3%','26.5%',''], 'muted'],
      ['Freight, duties and export documents', [-48000,-112000,'+133%'], 'ind'],
      ['Sales commissions', [-24000,-42300,'+76%'], 'ind'],
      ['Marketing', [-14000,-14000,''], 'ind'],
      ['Administration', [-160000,-160000,''], 'ind'],
      ['Operating profit', [94000,45700,'(51%)'], 'total']
    ], note:'At list prices, the extra volume would have brought in $1,500,000. Discounts gave away $90,000.'}),
    SORT('For each change, did it help or hurt operating profit, compared with the old way?',['Helped','Hurt'],[
      {text:'Discounts of 6% on average', a:1, why:'They gave away $90,000 of revenue that would otherwise have been almost pure profit.'},
      {text:'Switching new customers to DDP terms', a:1, why:'Freight and duty costs more than doubled, up $64,000, and prices weren\'t raised to cover them.'},
      {text:'Higher commission rate', a:1, why:'Commission rose $18,300, and it was paid on discounted sales.'},
      {text:'Extra volume itself', a:0, why:'More units spread factory overhead and admin over more sales. On its own, that helped. The way it was bought is what hurt.'}
    ]),
    K('The lesson',
      `<p>Growth isn't the same as profit. Each lever pulled cost money that the P&amp;L only showed months later. Before approving a sales push, ask finance to model it the way you just saw: <strong>what happens to gross margin and to operating profit, not just to revenue?</strong></p>
       <p>And pay sales commission on <strong>gross profit</strong> rather than revenue, so the sales team feels the cost of discounts and free freight.</p>`)
  ]},
  {id:'quiz', label:'Quiz', kind:'quiz', title:'Check your understanding', blocks:[
    Q('Which three costs make up cost of goods sold in a manufacturer?',['Materials, freight out and commissions','Materials, direct labour and factory overhead','Direct labour, office salaries and rent','Materials, interest and tax'],1,'COGS is the cost of making the products: what goes in, who makes them, and the cost of running the factory.'),
    Q('BraceWorks\' operating profit is $94,000 and depreciation is $38,000. What is EBITDA?',['$56,000','$94,000','$132,000','$55,500'],2,'EBITDA = Operating profit + Depreciation (and amortisation) = $132,000.'),
    Q('Why is a "% of revenue" column so useful?',[
      'It makes the report look more professional','It lets you compare months and years of different sizes and spot creeping costs','Banks require it by law','It converts figures to US dollars'],1,
      'A cost that grows in dollars might be fine if sales grew too. As a % of revenue, you see whether it\'s growing faster than the business.'),
    Q('With BraceWorks\' cost structure, which adds more profit?',['A 5% price rise','A 5% rise in units sold','They add the same','Neither, because costs rise too'],0,
      'Extra units bring extra material, freight and commission costs. A price rise on the same units carries almost no extra cost.'),
    Q('Your P&L shows "Revenue" as one line. What important information might be hidden?',[
      'The tax rate','Discounts, returns and credit notes, and the split by product','Depreciation','Interest'],1,
      'Ask for gross sales, discounts and returns separately, and revenue by product line. That\'s where pricing problems show up.'),
    Q('A big inventory write-off lands in March. What should a good report do?',[
      'Leave it inside cost of goods sold without comment','Show it as a separate one-off line, so you can see the underlying margin','Move it to next year','Leave it out of the P&L'],1,
      'One-offs should be visible and explained. Otherwise they distort the trend, or hide a bad month inside a big number.')
  ]},
  {id:'apply', label:'Practice', kind:'apply', title:'Practise on a sample pack', blocks:[
    PACK('packB',4,'Pack B, page 4: income statement'),
    Q('March gross margin was 26.7% against 30.0% budget. Which line, as a % of revenue, moved most?',['Direct labour','Materials: 47.5% against 45% budget','Factory overhead','Freight'],1,'Read the % of revenue column. Materials alone explains most of the gap.'),
    Q('Year to date, materials are 45.4% of revenue, but March alone is 47.5%. What does that suggest?',['Nothing','The cost increase started recently, in March, consistent with the foam price rise from 1 March','January was wrong','Budgets are always wrong'],1,'Comparing the month with the year-to-date shows when a change began.'),
    Q('Interest and currency are $2,020 worse than budget year to date. According to the pack, why?',['Higher overdraft','A currency loss in January','Bank fees','A tax error'],1,'Good packs show currency separately and explain it, so it isn\'t mistaken for an operating problem.'),
    PACK('packA',2,'Compare: Pack A\'s P&L'),
    Q('Pack A shows "Rent" below gross profit. Pack B puts factory costs inside cost of goods sold. Why does it matter?',['It doesn\'t','Pack A overstates gross margin, because factory rent is a cost of making the products','Rent should be on the balance sheet','Only for tax'],1,'Gross margin is only comparable if factory costs are classified consistently.'),
    {t:'html',html:'<h3>Later, with your own report</h3><p class="small" style="color:var(--muted)">Optional. When you next read your own monthly report, use this checklist. Nothing here is shared or sent; ticks are saved only in this browser.</p>'},
    CHECK('m3-pl','My P&L…',[
      'Shows each line as a % of revenue',
      'Compares this month with budget and with the same month last year',
      'Splits cost of goods sold into materials, direct labour and factory overhead',
      'Shows gross margin by product line (mattresses, slings, braces or your equivalents)',
      'Shows gross sales, discounts and returns separately',
      'Shows freight, foreign exchange and overtime as their own lines',
      'Shows one-off items separately with a short explanation',
      'Includes a trailing 12-month view, so trends are visible'
    ]),
    REPORT('Your Monday-morning question',
      `<p>Ask: <strong>"What was our gross margin each month for the last 12 months, and why did it move?"</strong> If nobody can answer the "why", you've found the biggest gap in your reporting.</p>`),
    K('Takeaways',
      `<ul>
        <li>Gross margin measures the factory and pricing. Operating margin measures the whole operation. Net margin is what owners keep.</li>
        <li>Read each line as a % of revenue, and read across months to spot trends.</li>
        <li>At thin margins, small price and material-cost changes matter more than big volume pushes.</li>
        <li>Profit leaks through scrap, freight, discounts and unpassed price rises. Your report should make each one visible.</li>
       </ul>`)
  ]}
  ],
  warnings:[
    {sign:'Gross margin falling while sales rise', meaning:'Growth is being bought with discounts, freight or overtime.', look:'Gross margin by product and customer; discounts and freight as % of sales.'},
    {sign:'Materials % of revenue creeping up', meaning:'Supplier price rises not passed on, or rising scrap and waste.', look:'Material cost per unit by product; scrap rate.'},
    {sign:'Freight % of sales rising', meaning:'More delivered-price (CIF/DDP) deals or small shipments, often unpriced.', look:'Freight cost by customer and Incoterm.'},
    {sign:'Large "other" or "sundry" lines', meaning:'Costs nobody wants to explain, or a weak chart of accounts.', look:'Ask for a breakdown of anything over 2% of revenue.'}
  ],
  formulas:[
    {name:'Gross margin', f:'Gross profit ÷ Revenue', ex:'$340,000 ÷ $1,200,000 = 28.3%'},
    {name:'Operating margin', f:'Operating profit ÷ Revenue', ex:'$94,000 ÷ $1,200,000 = 7.8%'},
    {name:'EBITDA', f:'Operating profit + Depreciation + Amortisation', ex:'$94,000 + $38,000 = $132,000 (11.0% margin)'},
    {name:'Common-size P&L', f:'Each line ÷ Revenue', ex:'Materials $552,000 ÷ $1,200,000 = 46.0%'}
  ],
  glossary:[
    {term:'Direct materials', def:'Materials that become part of the product: foam, fabric, webbing, buckles, packaging.'},
    {term:'Direct labour', def:'Wages of people who physically make the products.'},
    {term:'Factory overhead', def:'Costs of running the factory that can\'t be traced to one product: supervisors, power, rent, depreciation, repairs.'},
    {term:'Operating expenses (SG&A)', def:'Selling, general and administrative costs: everything outside the factory needed to sell and run the business.'},
    {term:'Gross margin', def:'Gross profit as a % of revenue.'},
    {term:'Operating profit (EBIT)', def:'Profit after all operating costs, before interest and tax.'},
    {term:'EBITDA', def:'Earnings before interest, tax, depreciation and amortisation. A rough measure of operating cash generation.'},
    {term:'Net margin', def:'Net profit as a % of revenue.'},
    {term:'Common-size statement', def:'A statement with every line shown as a % of revenue, to compare periods of different sizes.'},
    {term:'Credit note', def:'A document reducing an amount a customer owes, for returns, damage, pricing errors or rebates.'},
    {term:'One-off item', def:'An unusual cost or income unlikely to repeat, shown separately so it doesn\'t distort the trend.'},
    {term:'Foreign exchange gain or loss', def:'The profit or loss from currency rates moving between invoice date and payment, or on foreign currency balances.'}
  ]
});
})();
