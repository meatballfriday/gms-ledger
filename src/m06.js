/* ===== Module 6: Product costing ===== */
(function(){
const {K,TIP,FLAG,CASE,REPORT,Q,FS,FLIP,SORT,CHECK,W,PACK,money,signed,pct,kfmt} = BW.h;
const m2=(n)=>money(n,2);

BW.add({
  id:'m6', minutes:45,
  title:'Product costing',
  subtitle:'What does one mattress really cost to make? The answer drives your quotes, your product mix and your inventory value, and it\'s often wrong.',
  goals:[
    'Build a unit cost from the bill of materials, labour routing and overhead',
    'Explain how overhead is spread across products, and why the method matters',
    'Tell markup from margin, and price for a target margin',
    'Spot when a custom or small order costs far more than standard'
  ],
  sections:[
  {id:'build', label:'Building a unit cost', kind:'learn', title:'Building the cost of one mattress', blocks:[
    `<p>Knowing your total costs isn't enough. To quote a price, choose which products to push, or value your stock, you need the cost of <strong>one unit</strong> of each product. It has three parts, the same three as cost of goods sold.</p>`,
    `<h3>1. Materials, from the bill of materials</h3>
     <p>A <span class="term">bill of materials</span> (BOM) lists every component in a product, with the quantity and cost. Here's BraceWorks' standard pressure-relief mattress:</p>`,
    {t:'tbl', head:['Component','Quantity','Cost per unit','Cost'], opts:{num:[1,2,3]}, rows:[
      ['High-resilience foam core','0.26 m³','$200.00/m³','$52.00'],
      ['Visco-elastic top layer','0.05 m³','$370.00/m³','$18.50'],
      ['PU-coated waterproof cover fabric','4.2 m','$3.20/m','$13.44'],
      ['Fire barrier sock','1','$4.80','$4.80'],
      ['Zip, binding and thread','1 set','$3.10','$3.10'],
      ['Labels, instructions, bag and carton','1 set','$3.16','$3.16'],
      {cls:'',cells:['<strong>Materials per mattress</strong>','','','<strong>$95.00</strong>']}
    ]},
    `<h3>2. Labour, from the routing</h3>
     <p>A <span class="term">routing</span> lists each production step and the standard time it takes. BraceWorks' labour costs $3.00 per productive hour, including benefits.</p>`,
    {t:'tbl', head:['Step','Standard hours','Cost'], opts:{num:[1,2]}, rows:[
      ['Foam cutting and bonding','0.6','$1.80'],['Cover cutting','0.5','$1.50'],['Cover sewing','2.6','$7.80'],['Assembly and packing','0.8','$2.40'],['Quality inspection and release','0.5','$1.50'],
      {cls:'',cells:['<strong>Labour per mattress</strong>','<strong>5.0</strong>','<strong>$15.00</strong>']}
    ]},
    `<h3>3. Overhead, spread by a rate</h3>
     <p>Factory overhead (supervisors, power, rent, depreciation, repairs) can't be traced to one mattress. So it's spread using an <span class="term">overhead rate</span>. BraceWorks uses labour hours:</p>
     <p class="num" style="font-weight:600">$156,000 overhead ÷ 50,667 labour hours = $3.08 per labour hour</p>
     <p>A mattress takes 5 hours, so it carries 5 × $3.08 = <strong>$15.40</strong> of overhead.</p>`,
    FS({title:'Full cost of one mattress', rows:[['Materials',95],['Labour',15],['Overhead',15.40],['Full unit cost',125.40,'sub'],['Selling price',180],['Gross profit per mattress',54.60,'total']], fmt:m2, note:'Gross margin 30.3%. This is called absorption costing, because each unit "absorbs" a share of factory overhead.'}),
    K('Why unit costs matter so much',
      `<ul>
        <li><strong>Quoting:</strong> every export quote starts from unit cost. A wrong cost means every quote is wrong.</li>
        <li><strong>Product mix:</strong> which products to push and which to drop depends on their margins.</li>
        <li><strong>Inventory value:</strong> stock on the balance sheet is valued at unit cost, so cost errors flow into profit.</li>
       </ul>`)
  ]},
  {id:'products', label:'All three products', kind:'learn', title:'BraceWorks\' three products side by side', blocks:[
    `<p>Here's the same calculation for all three product lines, using the labour-hour overhead rate.</p>`,
    {t:'tbl', head:['Per unit','Mattress','Sling','Brace'], opts:{num:[1,2,3]}, rows:[
      ['Materials','$95.00','$18.00','$11.80'],
      ['Labour hours','5.0','1.5','1.9'],
      ['Labour at $3.00/hr','$15.00','$4.50','$5.70'],
      ['Overhead at $3.08/hr','$15.40','$4.62','$5.85'],
      {cls:'',cells:['<strong>Full unit cost</strong>','<strong>$125.40</strong>','<strong>$27.12</strong>','<strong>$23.35</strong>']},
      ['Selling price','$180.00','$45.00','$28.00'],
      {cls:'',cells:['<strong>Gross profit per unit</strong>','<strong>$54.60</strong>','<strong>$17.88</strong>','<strong>$4.65</strong>']},
      ['Gross margin','30.3%','39.7%','16.6%'],
      ['Units sold','2,800','7,200','13,000'],
      {cls:'',cells:['<strong>Total gross profit</strong>','<strong>$152,880</strong>','<strong>$128,736</strong>','<strong>$60,450</strong>']}
    ]},
    `<p>Already this tells you something the P&amp;L couldn't. <strong>Braces are 30% of revenue but only 18% of gross profit.</strong> Slings earn nearly 40 cents of every dollar. Mattresses make the most money in total.</p>`,
    Q('A distributor offers to buy 3,000 more braces a year at $28. Using these costs, roughly how much gross profit would that add?',['$84,000','$13,950','$70,050','$4.65'],1,
      '3,000 × $4.65 = $13,950. But be careful: Module 12 shows why the true extra profit can be quite different, because some of that overhead wouldn\'t actually increase.')
  ]},
  {id:'play', label:'Cost lab', kind:'play', title:'The cost lab', blocks:[
    `<p>Pick a product and change what goes into it. Watch how the unit cost and margin respond. Try the scrap slider in particular: it's the cost most factories underestimate.</p>`,
    W('Unit cost builder', function(el, ctx){
      const {money,pct}=ctx.h; const m2=x=>money(x,2);
      const P={m:{n:'Mattress',price:180,mat:95,hrs:5.0,units:2800},s:{n:'Sling',price:45,mat:18,hrs:1.5,units:7200},b:{n:'Brace',price:28,mat:11.8,hrs:1.9,units:13000}};
      let prod='m'; const segEl=document.createElement('div'), top=document.createElement('div'), out=document.createElement('div'); el.append(segEl,top,out);
      let vals={};
      function draw(){
        const p=P[prod]; const mat=p.mat*(1+vals.mp/100)*(1+vals.scrap/100), lab=vals.hrs*vals.rate, oh=vals.hrs*3.08, cost=mat+lab+oh, gp=vals.price-cost, gm=gp/vals.price;
        out.innerHTML=ctx.ui.bars([{label:'Materials',v:mat,tone:''},{label:'Labour',v:lab,tone:'blue'},{label:'Overhead',v:oh,tone:'warn'},{label:'Full cost',v:cost,tone:'muted'},{label:'Price',v:vals.price,tone:'good'}],{fmt:m2,max:Math.max(vals.price,cost)})+
        `<div class="stats" style="margin-top:12px">${ctx.ui.stat('Gross profit per unit',m2(gp),gp<0?'bad':'')}${ctx.ui.stat('Gross margin',pct(gm),gm<0.15?'bad':gm<0.25?'warn':'good')}${ctx.ui.stat('Annual gross profit at '+p.units.toLocaleString('en-US')+' units',money(gp*p.units))}</div>
        <p class="w-hint" style="margin-top:10px">${vals.scrap>=5?`At ${vals.scrap}% extra scrap, you're throwing away ${m2(mat-p.mat*(1+vals.mp/100))} of material on every ${p.n.toLowerCase()}. Over a year that's ${money((mat-p.mat*(1+vals.mp/100))*p.units)}.`:vals.hrs>p.hrs?`Each extra labour hour also drags in $3.08 of overhead, because overhead is spread by labour hours. Slow production costs twice.`:'Change one slider at a time to see which cost your margin is most sensitive to.'}</p>`;
      }
      function build(){
        top.innerHTML=''; const p=P[prod];
        ctx.ui.sliders(top,[
          {k:'price',label:'Selling price',min:Math.round(p.price*0.7),max:Math.round(p.price*1.3),step:prod==='m'?1:0.5,v:p.price,f:m2},
          {k:'mp',label:'Material price change',min:-15,max:25,step:1,v:0,f:x=>(x>0?'+':'')+x+'%'},
          {k:'scrap',label:'Extra scrap above standard',min:0,max:20,step:1,v:0,f:x=>x+'%'},
          {k:'hrs',label:'Labour hours per unit',min:+(p.hrs*0.6).toFixed(1),max:+(p.hrs*1.5).toFixed(1),step:0.1,v:p.hrs,f:x=>x.toFixed(1)+' h'},
          {k:'rate',label:'Labour cost per hour',min:2,max:5,step:0.1,v:3,f:x=>'$'+x.toFixed(2)}
        ],(v)=>{ vals=v; draw(); },ctx.uid);
      }
      ctx.ui.seg(segEl,[{v:'m',label:'Mattress'},{v:'s',label:'Sling'},{v:'b',label:'Brace'}],'m',v=>{prod=v; build();});
      build();
    })
  ]},
  {id:'abc', label:'Spreading overhead', kind:'learn', title:'Is the overhead in the right place?', blocks:[
    `<p>BraceWorks spreads all $156,000 of overhead by labour hours. That's simple, and common. But it assumes overhead is caused by labour. Is it?</p>
     <ul>
      <li><strong>Machine costs</strong> (depreciation, power, maintenance) are driven by the foam cutters. Mattresses use them heavily. Slings barely touch them.</li>
      <li><strong>Batch costs</strong> (changeovers, scheduling, first-article inspection, lot release paperwork) are driven by the number of batches. Braces come in 40 sizes and versions, so they run in many small batches.</li>
      <li><strong>Space costs</strong> (rent, lighting, air conditioning) are driven by floor area. Bulky foam takes half the factory.</li>
     </ul>
     <p><span class="term">Activity-based costing</span> (ABC) splits overhead into pools like these and spreads each one by what actually drives it.</p>`,
    {t:'tbl', head:['Overhead pool','Cost','Driver','Rate'], opts:{num:[1,3]}, rows:[
      ['Machines (depreciation, part of power, maintenance)','$60,000','Machine hours (4,460)','$13.45/hr'],
      ['Batches (changeovers, scheduling, lot release)','$50,000','Batches run (1,000)','$50/batch'],
      ['Space (rent, lighting, general power)','$46,000','Floor area used','by %']
    ]},
    {t:'tbl', head:['Overhead per unit','Mattress','Sling','Brace'], opts:{num:[1,2,3]}, rows:[
      ['Labour-hour method','$15.40','$4.62','$5.85'],
      ['ABC method','$23.80','$2.88','$5.10'],
      {cls:'',cells:['<strong>Gross margin, labour-hour</strong>','30.3%','39.7%','16.6%']},
      {cls:'',cells:['<strong>Gross margin, ABC</strong>','25.7%','43.6%','19.3%']}
    ]},
    K('What ABC changed',
      `<p>Mattresses were <strong>under-costed by $8.40 each</strong>, because the labour-hour method ignored how much machine time and floor space they use. That's $23,500 a year of cost that was quietly charged to slings and braces instead.</p>
       <p>The total overhead hasn't changed. Only where it lands. But that changes which products look best, and what price you'd quote for a big mattress order.</p>`),
    TIP('Do you need full ABC?',
      `<p>Probably not. For a 50-person factory, a full ABC system is overkill. But a simple version, with two or three overhead pools instead of one, is worth doing once a year. Ask finance to test whether your products' margins change much. If they do, your quotes need the better numbers.</p>`)
  ]},
  {id:'case', label:'Case: the custom order', kind:'case', title:'The custom order that made nothing', blocks:[
    CASE('Fifty special mattresses',
      `<p>A hospital in Dubai asks for <strong>50 bariatric mattresses</strong> in a non-standard size, with their own labels. The sales manager quotes quickly: standard cost $125.40 plus a 30% markup = <strong>$163 each</strong>, total $8,150. The order is accepted.</p>
       <p>Three months later, you ask finance what the order really cost.</p>`),
    FS({title:'Custom order: actual cost per mattress', rows:[
      ['Materials, including 12% extra foam waste from non-standard cutting, and custom labels', 105.50],
      ['Labour: 6.5 hours (slower sewing on a new pattern) at $3.00', 19.50],
      ['Overhead at $3.08 per labour hour', 20.02],
      ['One-off costs spread over 50 units: pattern and cutting program, 3 extra setups, separate lot release and labelling documentation ($790)', 15.80],
      ['Actual cost per mattress', 160.82, 'sub'],
      ['Price charged', 163.00],
      ['Gross profit per mattress', 2.18, 'total']
    ], fmt:m2, note:'Gross margin 1.3%. After freight and commission, the order lost money.'}),
    `<h3>Two mistakes</h3>
     <p><strong>Mistake 1: using the standard cost for a non-standard product.</strong> Custom work brings extra waste, slower labour and one-off setup costs. None of these are in the standard cost.</p>
     <p><strong>Mistake 2: confusing markup with margin.</strong> A 30% markup on cost is <em>not</em> a 30% margin on price.</p>`,
    {t:'tbl', head:['','Formula','On a $125.40 cost'], opts:{num:[2]}, rows:[
      ['<strong>30% markup</strong>','Cost × 1.30','Price $163.02 → margin only 23.1%'],
      ['<strong>30% margin</strong>','Cost ÷ (1 − 0.30)','Price $179.14 → margin 30.0%']
    ]},
    Q('To earn a 30% gross margin on the true custom cost of $160.82, what should the price have been?',['$209.07','$192.98','$229.74','$163.00'],2,
      '$160.82 ÷ 0.70 = $229.74. A better quote would be a unit price plus a separate one-off setup charge, so small orders pay for their own setup costs.'),
    K('The fix',
      `<ul>
        <li>Quote custom and small orders with a <strong>setup charge</strong> and a <strong>minimum order quantity</strong>.</li>
        <li>Give sales a quoting sheet that works in <strong>margin</strong>, not markup.</li>
        <li>After big or unusual orders, have finance compare actual cost with the quote. It's the fastest way to improve future quotes.</li>
       </ul>`)
  ]},
  {id:'quiz', label:'Quiz', kind:'quiz', title:'Check your understanding', blocks:[
    Q('What two documents give you the materials and labour in a unit cost?',['The P&L and balance sheet','The bill of materials and the routing','The sales invoice and delivery note','The budget and forecast'],1,'The BOM lists components and quantities. The routing lists production steps and times.'),
    Q('Overhead is $156,000 and the factory works 50,667 labour hours. A brace takes 1.9 hours. How much overhead does each brace carry?',['$3.08','$5.85','$1.90','$15.40'],1,'Rate $3.08 per hour × 1.9 hours = $5.85.'),
    Q('A product costs $100. You want a 25% gross margin. What price do you charge?',['$125.00','$133.33','$120.00','$175.00'],1,'Price = Cost ÷ (1 − margin) = $100 ÷ 0.75 = $133.33. A $125 price would be a 25% markup, giving only a 20% margin.'),
    Q('Why might labour-hour overhead allocation give misleading product costs?',[
      'It\'s against accounting rules','Overhead caused by machines, batches or space gets spread as if labour caused it','It always overstates costs','It ignores materials'],1,
      'Products that use lots of machine time or floor space but little labour end up looking cheaper than they are.'),
    Q('Which order is most likely to cost more per unit than standard?',[
      'A repeat order of 500 standard slings','A first order of 40 custom-sized braces with the customer\'s own labels','An order of 200 standard mattresses','A reorder of spare covers'],1,
      'Small, custom, first-time orders bring setup, waste, slower labour and documentation costs that standard costs don\'t include.'),
    Q('Braces are 30% of BraceWorks\' revenue. What share of gross profit do they bring?',['30%','About 18%','About 40%','About 50%'],1,'$60,450 of $342,000 total gross profit, about 18%. Unit costs reveal what the total P&L hides.')
  ]},
  {id:'apply', label:'Practice', kind:'apply', title:'Practise on a sample pack', blocks:[
    PACK('packB',5,'Pack B, page 5: product margins'),
    Q('Braces: 1,100 units, revenue $30,800, gross profit $4,590. What is gross profit per brace?',['$28.00','$4.17','$14.52','$27.20'],1,'$4,590 ÷ 1,100 = $4.17, against $4.65 at standard. Material price and scrap took the rest.'),
    Q('Mattress gross margin was 27.8% against 31.5% budget, on $43,200 of mattress sales. Roughly what did that cost in March?',['$160','$1,600','$16,000','$3,700'],1,'3.7 percentage points × $43,200 ≈ $1,600.'),
    Q('Foam usage was 10% over standard after a new cutting pattern. Which document sets the standard foam quantity?',['The routing','The bill of materials','The sales invoice','The budget'],1,'The BOM gives the standard quantity per mattress (Module 6).'),
    {t:'html',html:'<h3>Later, with your own report</h3><p class="small" style="color:var(--muted)">Optional. When you next read your own monthly report, use this checklist. Nothing here is shared or sent; ticks are saved only in this browser.</p>'},
    CHECK('m6-cost','At my company…',[
      'Every product has a bill of materials and a routing in the system',
      'Standard costs are updated at least once a year, and after any big supplier price change',
      'I know our overhead rate and what it\'s based on',
      'My monthly report shows gross margin by product line',
      'Sales quotes are built from current unit costs, using margin rather than markup',
      'Custom and small orders carry a setup charge or a minimum order quantity',
      'Finance compares actual cost with quoted cost for big or unusual orders'
    ]),
    REPORT('Your Monday-morning question',
      `<p>Ask: <strong>"When were our standard costs last updated, and how much have foam and fabric prices moved since then?"</strong> If the answer is "two years ago", every quote since may be underpriced.</p>`),
    K('Takeaways',
      `<ul>
        <li>Unit cost = materials (from the BOM) + labour (from the routing) + a share of overhead.</li>
        <li>How you spread overhead can change which products look profitable.</li>
        <li>Markup and margin are different. Price = cost ÷ (1 − target margin).</li>
        <li>Custom and small orders cost more than standard. Quote them with setup charges.</li>
       </ul>`)
  ]}
  ],
  warnings:[
    {sign:'Quotes built on standard costs more than a year old', meaning:'Material and wage rises aren\'t in your prices. Margins erode quietly.', look:'Date of last standard cost update versus supplier price changes.'},
    {sign:'Small or custom orders priced like standard ones', meaning:'Setup, waste and documentation costs go unrecovered.', look:'Actual vs quoted cost on recent custom orders.'},
    {sign:'Sales team talks about "markup"', meaning:'Margins may be lower than everyone thinks.', look:'Convert their markups to margins: margin = markup ÷ (1 + markup).'},
    {sign:'One product line far below the others in gross margin', meaning:'Underpricing, high cost, or overhead allocated in a way that hides the truth.', look:'Margin by product under a second overhead method.'}
  ],
  formulas:[
    {name:'Unit cost', f:'Materials (BOM) + Labour hours × Rate + Overhead allocation', ex:'Mattress: $95.00 + $15.00 + $15.40 = $125.40'},
    {name:'Overhead rate', f:'Budgeted overhead ÷ Budgeted activity (e.g. labour hours)', ex:'$156,000 ÷ 50,667 hours = $3.08 per hour'},
    {name:'Price for a target margin', f:'Cost ÷ (1 − Target margin)', ex:'$160.82 ÷ (1 − 0.30) = $229.74'},
    {name:'Markup to margin', f:'Margin = Markup ÷ (1 + Markup)', ex:'30% markup = 0.30 ÷ 1.30 = 23.1% margin'}
  ],
  glossary:[
    {term:'Bill of materials (BOM)', def:'List of every component in a product, with quantities and costs.'},
    {term:'Routing', def:'List of the production steps for a product, with standard times.'},
    {term:'Unit cost', def:'The full cost of making one unit: materials, labour and a share of overhead.'},
    {term:'Absorption costing', def:'Costing method where each unit carries a share of factory overhead. Required for inventory valuation.'},
    {term:'Overhead rate', def:'The rate used to spread overhead to products, such as $ per labour hour or machine hour.'},
    {term:'Activity-based costing (ABC)', def:'Spreading overhead using several pools, each by the activity that drives it: machine hours, batches, floor space.'},
    {term:'Cost driver', def:'The activity that causes a cost to rise, such as number of setups or machine hours.'},
    {term:'Markup', def:'Profit as a % of cost. A $100 item sold at $130 has a 30% markup.'},
    {term:'Margin', def:'Profit as a % of price. A $100 item sold at $130 has a 23.1% margin.'},
    {term:'Setup cost', def:'One-off cost of preparing to run a batch: changeovers, programming, first-article checks.'}
  ]
});
})();
