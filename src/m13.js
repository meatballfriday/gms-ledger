/* ===== Module 13: Product, customer and sourcing decisions ===== */
(function(){
const {K,TIP,FLAG,CASE,REPORT,Q,FS,FLIP,SORT,CHECK,W,PACK,money,signed,pct,kfmt} = BW.h;

BW.add({
  id:'m13', minutes:50,
  title:'Product, customer and sourcing decisions',
  subtitle:'Make or buy, take the odd order or not, drop the weak product or keep it. The trick is knowing which costs actually change.',
  goals:[
    'Separate relevant costs from sunk costs and unchanged fixed costs',
    'Decide on special orders using contribution and spare capacity',
    'Compare making a part with buying it, beyond the unit price',
    'Rank products by contribution per bottleneck hour'
  ],
  sections:[
  {id:'rel', label:'Relevant costs', kind:'learn', title:'Only the costs that change matter', blocks:[
    `<p>Every decision compares two futures: do it, or don't. The only costs and revenues that matter are the ones that are <strong>different between those two futures</strong>. Accountants call them <span class="term">relevant costs</span>.</p>`,
    FLIP([
      {f:'Sunk costs', b:'<strong>Money already spent can\'t be recovered by any decision.</strong> The $60,000 already paid for the foam cutter is irrelevant to whether you use it next month. Only future costs matter.'},
      {f:'Unchanged fixed costs', b:'<strong>Costs that stay the same either way don\'t affect the choice.</strong> Factory rent is paid whether you take an extra order or not. Allocated overhead in a unit cost often hides this.'},
      {f:'Variable costs', b:'<strong>Usually relevant.</strong> An extra order needs extra materials, freight and commission.'},
      {f:'Avoidable fixed costs', b:'<strong>Relevant if they really go away.</strong> Dropping a product saves its labour only if you actually reduce staff or move them to other paid work.'},
      {f:'Opportunity cost', b:'<strong>The value of the best alternative you give up.</strong> If the sewing line is full, an extra order of slings costs you the mattresses you could have sewn instead.'}
    ]),
    K('The danger of full unit cost',
      `<p>Full unit cost (Module 6) includes a share of fixed overhead. That's right for pricing in the long run and for valuing stock. But for a one-off decision, it misleads, because that overhead doesn't change with the decision. Use <strong>contribution</strong> and the costs that actually change.</p>`),
    SORT('Relevant to the decision, or not?',['Relevant','Not relevant'],[
      {text:'Deciding on a one-off order: the foam it needs', a:0, why:'It will be bought only if you take the order.'},
      {text:'Deciding on a one-off order: the factory rent', a:1, why:'Paid either way.'},
      {text:'Deciding whether to repair or replace a machine: what you paid for it 6 years ago', a:1, why:'A sunk cost. Only future costs and benefits matter.'},
      {text:'Deciding to drop a product: the salary of the supervisor you would let go', a:0, why:'Avoidable, so relevant.'},
      {text:'Deciding to drop a product: overhead allocated to it that will be re-spread to other products', a:1, why:'The cost doesn\'t disappear. It just moves.'},
      {text:'Taking an order when the line is full: the profit from the orders you\'d have to turn away', a:0, why:'That\'s the opportunity cost.'}
    ])
  ]},
  {id:'special', label:'Special orders', kind:'play', title:'The order at a lower price', blocks:[
    `<p>A health NGO in Kenya asks for <strong>2,000 patient slings at $32 each</strong>, collected from the factory. BraceWorks' normal price is $45. The full unit cost is $27.12, so the sales manager says "only $4.88 a unit, not worth the trouble". Is she right?</p>`,
    W('Special order calculator', function(el, ctx){
      const {money,signed}=ctx.h;
      const top=document.createElement('div'), out=document.createElement('div'); el.append(top,out);
      const VC=18.30, HRS=1.5, OT=4.5;
      ctx.ui.sliders(top,[
        {k:'price',label:'Price offered per sling',min:20,max:45,step:0.5,v:32,f:x=>money(x,2)},
        {k:'qty',label:'Quantity',min:500,max:4000,step:100,v:2000,f:x=>x.toLocaleString('en-US')},
        {k:'spare',label:'Spare labour hours available',min:0,max:5000,step:250,v:2000,f:x=>x.toLocaleString('en-US')+' h'}
      ],(v)=>{
        const need=v.qty*HRS, ot=Math.max(0,need-v.spare), otCost=ot*OT;
        const rev=v.qty*v.price, var_=v.qty*VC, inc=rev-var_-otCost;
        const fullView=v.qty*(v.price-27.12);
        out.innerHTML=ctx.ui.table(['Incremental view','Amount'],[
          ['Extra revenue',money(rev)],
          ['Materials and handling ($18.30 a sling)',money(-var_)],
          [`Overtime for ${ot.toLocaleString('en-US')} hours beyond spare capacity ($4.50/h)`,money(-otCost)],
          ['Labour within spare capacity','$0 (already paid)'],
          ['Factory overhead','$0 (doesn\'t change)'],
          {cls:'',cells:['<strong>Extra profit from the order</strong>',`<strong class="${inc<0?'neg':'pos'}">${signed(Math.round(inc))}</strong>`]}
        ],{num:[1]})+
        `<div class="stats" style="margin-top:12px">${ctx.ui.stat('Full-cost view says',signed(Math.round(fullView)),fullView<0?'bad':'warn','misleading here')}${ctx.ui.stat('Real extra profit',signed(Math.round(inc)),inc>0?'good':'bad')}</div>
        <p class="w-hint" style="margin-top:10px">${inc<=0?'At this price and capacity, the order loses money. Decline, or offer a later delivery date when the line has spare capacity.':v.spare>=need?'With enough spare capacity, everything above $18.30 a sling is extra profit. The overhead is already paid for.':'Some of the order needs overtime, which eats into the gain. Could the delivery be spread over quieter months?'}</p>`;
      },ctx.uid);
    }),
    K('When to say yes to a lower price',
      `<ul>
        <li><strong>The price beats the variable cost</strong>, plus any extra costs like overtime, tooling or freight.</li>
        <li><strong>There's spare capacity,</strong> so you're not turning away full-price work.</li>
        <li><strong>It won't leak.</strong> If your regular distributors hear about $32 slings, you may have to cut prices for everyone. A different market, a different label or a one-off tender reduces the risk.</li>
        <li><strong>It isn't the start of a habit.</strong> If every quiet month is filled with cheap orders, the fixed costs never get covered.</li>
       </ul>`)
  ]},
  {id:'make', label:'Make or buy', kind:'learn', title:'Make it, or buy it in?', blocks:[
    `<p>A supplier offers to deliver ready-sewn mattress covers for <strong>$27.00 each</strong>. BraceWorks' full cost of making a cover in-house is <strong>$35.39</strong>. It looks like an easy $8.39 saving per cover, or $23,500 a year.</p>`,
    FS({title:'Making one mattress cover in-house', cols:['Full cost','Relevant cost if staff stay'], rows:[
      ['Fabric, zip, binding and thread', [16.54, 16.54]],
      ['Labour: 3.1 hours of cutting and sewing at $3.00', [9.30, 0]],
      ['Variable overhead: power and needles', [0.60, 0.60]],
      ['Fixed overhead at $3.08 per hour', [8.95, 0]],
      ['Cost per cover', [35.39, 17.14], 'total']
    ], fmt:x=>money(x,2), note:'If the sewing team stays employed anyway, their wages and the fixed overhead don\'t go away when you buy covers.'}),
    `<p>Now the comparison changes. Buying costs $27.00. Making, if the people stay, costs $17.14 in extra cash. <strong>Buying would cost $9.86 more per cover</strong>, unless the freed-up sewing time can be used for something more valuable.</p>
     <h3>When buying does make sense</h3>
     <ul>
      <li>The <strong>sewing line is a bottleneck</strong>, and freeing it lets you make more mattresses or slings at full contribution.</li>
      <li>You genuinely <strong>reduce headcount</strong> or overtime. Then labour becomes relevant.</li>
      <li>The supplier is <strong>better at it</strong>: lower defect rates, or capabilities you don't have.</li>
     </ul>`,
    FLAG('Beyond the price',
      `<p>For a medical device maker, outsourcing a component means qualifying and auditing the supplier under ISO 13485, controlling their changes, and keeping traceability. Add lead times, minimum orders, currency and the risk of a single source. These costs are real even if they're not on the quote.</p>`),
    Q('The sewing line is running at full capacity, and the time freed by buying covers could make 900 more mattresses a year, each with $74.20 contribution. Does that change the answer?',[
      'No, making is still cheaper',
      'Yes. The extra mattresses add about $66,800 of contribution, far more than the $27,600 extra cost of buying 2,800 covers',
      'Only if the supplier is in the same country',
      'It depends only on the full unit cost'],1,
      'Opportunity cost decides it. Buying covers costs $9.86 × 2,800 = $27,600 more, but frees time worth $66,800. When capacity is the constraint, the bottleneck\'s time is the most valuable thing in the factory.')
  ]},
  {id:'bottle', label:'The bottleneck', kind:'play', title:'When the line is full', blocks:[
    `<p>When demand exceeds capacity, the question changes from "which product has the best margin?" to <strong>"which product earns the most per hour of the bottleneck?"</strong> At BraceWorks, the bottleneck is sewing.</p>`,
    {t:'tbl', head:['Per unit','Mattress','Sling','Brace'], opts:{num:[1,2,3]}, rows:[
      ['Contribution','$74.20','$24.30','$14.52'],['Contribution margin','41.2%','54.0%','51.9%'],['Sewing hours','2.6','1.2','1.4'],
      {cls:'',cells:['<strong>Contribution per sewing hour</strong>','<strong>$28.54</strong>','<strong>$20.25</strong>','<strong>$10.37</strong>']},
      ['Maximum demand next year','3,400','8,000','14,500']
    ]},
    W('Product mix when sewing is the limit', function(el, ctx){
      const {money}=ctx.h;
      const top=document.createElement('div'), out=document.createElement('div'); el.append(top,out);
      const P=[{n:'Mattresses',c:74.2,cm:0.412,h:2.6,d:3400},{n:'Slings',c:24.3,cm:0.54,h:1.2,d:8000},{n:'Braces',c:14.52,cm:0.519,h:1.4,d:14500}];
      const plan=(order,cap)=>{ let left=cap; const u={}; order.forEach(p=>{ const q=Math.min(p.d,Math.floor(left/p.h)); u[p.n]=q; left-=q*p.h; }); const c=P.reduce((s,p)=>s+u[p.n]*p.c,0); return {u,c,left}; };
      ctx.ui.sliders(top,[{k:'cap',label:'Sewing hours available next year',min:25000,max:42000,step:500,v:36000,f:x=>x.toLocaleString('en-US')+' h'}],(v)=>{
        const a=plan([...P].sort((x,y)=>y.cm-x.cm),v.cap), b=plan([...P].sort((x,y)=>y.c/y.h-x.c/x.h),v.cap);
        const need=P.reduce((s,p)=>s+p.d*p.h,0);
        out.innerHTML=ctx.ui.table(['Units made','Ranked by margin %','Ranked by contribution per sewing hour'],P.map(p=>[p.n,a.u[p.n].toLocaleString('en-US'),b.u[p.n].toLocaleString('en-US')]).concat([{cls:'',cells:['<strong>Total contribution</strong>',`<strong>${money(Math.round(a.c))}</strong>`,`<strong>${money(Math.round(b.c))}</strong>`]}]),{num:[1,2]})+
        `<div class="msg ${b.c-a.c>1000?'good':'info'}" style="margin-top:12px">${v.cap>=need?`At ${v.cap.toLocaleString('en-US')} hours there's enough sewing time for all demand (${Math.round(need).toLocaleString('en-US')} hours), so the ranking doesn't matter. Make everything. Drag the slider down.`:`With sewing as the limit, ranking by contribution per sewing hour earns <strong>${money(Math.round(b.c-a.c))} more</strong> than ranking by margin %. Mattresses look weakest on margin % but earn the most per hour of the scarce resource.`}</div>`;
      },ctx.uid);
    }),
    TIP('Work on the bottleneck itself',
      `<p>An hour lost at the bottleneck is an hour lost for the whole factory. An hour saved elsewhere saves almost nothing. So put your best people, preventive maintenance and quality checks <em>before</em> the sewing line, so it never waits and never sews a defective part. Spending to add sewing capacity is often the best investment the factory can make (Module 14).</p>`)
  ]},
  {id:'case', label:'Case: drop the braces?', kind:'case', title:'Should BraceWorks drop braces?', blocks:[
    CASE('The owner\'s proposal',
      `<p>The owner has read the product costing (Module 6). Braces earn only a 16.6% gross margin on full cost, against 30% for mattresses and 40% for slings. "Let's stop making braces and focus on what makes money," he says. "We'd free half the factory floor."</p>
       <p>Before deciding, you model it. Choose which product lines to drop, and how much of their fixed costs you could really remove.</p>`),
    W('Drop a product line?', function(el, ctx){
      const {money,signed}=ctx.h;
      const P={m:{n:'Mattresses',c:207760,lab:42000,oh:66640,fullGP:152880},s:{n:'Slings',c:174960,lab:32400,oh:20736,fullGP:128736},b:{n:'Braces',c:188760,lab:74100,oh:66300,fullGP:60450}};
      const drop={m:false,s:false,b:true};
      const seg=document.createElement('div'); seg.className='seg'; const top=document.createElement('div'), out=document.createElement('div'); el.append(seg,top,out);
      Object.keys(P).forEach(k=>{ const b=document.createElement('button'); b.type='button'; b.textContent='Drop '+P[k].n.toLowerCase(); b.setAttribute('aria-pressed',String(drop[k])); b.onclick=()=>{ drop[k]=!drop[k]; b.setAttribute('aria-pressed',String(drop[k])); draw(); }; seg.appendChild(b); });
      let vals={};
      function draw(){
        let lost=0, saveL=0, saveO=0, fullLost=0;
        Object.keys(P).forEach(k=>{ if(drop[k]){ lost+=P[k].c; saveL+=P[k].lab*vals.l/100; saveO+=P[k].oh*vals.o/100; fullLost+=P[k].fullGP; } });
        const sev=saveL*0.4; const ongoing=-lost+saveL+saveO, y1=ongoing-sev; const pbt=74000+ongoing;
        out.innerHTML=ctx.ui.table(['Effect of dropping','Per year'],[
          ['Contribution lost',money(-lost)],
          ['Production labour removed',money(Math.round(saveL))],
          ['Overhead actually removed',money(Math.round(saveO))],
          {cls:'',cells:['<strong>Change in yearly profit</strong>',`<strong class="${ongoing<0?'neg':'pos'}">${signed(Math.round(ongoing))}</strong>`]},
          ['One-off severance in year one (about 5 months\' pay)',money(-Math.round(sev))]
        ],{num:[1]})+
        `<div class="stats" style="margin-top:12px">${ctx.ui.stat('Profit before tax after the change',money(Math.round(pbt)),pbt<0?'bad':pbt<74000?'warn':'good','today $74,000')}${ctx.ui.stat('What the full-cost view promised',`lose only ${money(fullLost)} of gross profit`,'warn')}</div>
        <p class="w-hint" style="margin-top:10px">${!lost?'Choose a product line to drop.':ongoing<0?'The full-cost view only counts the product\'s gross profit. In reality you lose all of its contribution, and most of the overhead stays, now spread over fewer products. The remaining products suddenly look less profitable too.':'Only if you could cut almost all of its labour and overhead would dropping this line help.'}</p>`;
      }
      ctx.ui.sliders(top,[
        {k:'l',label:'Share of that line\'s production labour you can remove',min:0,max:100,step:5,v:60,f:x=>x+'%'},
        {k:'o',label:'Share of its allocated overhead that really disappears',min:0,max:100,step:5,v:25,f:x=>x+'%'}
      ],(v)=>{vals=v;draw();},ctx.uid);
    }),
    Q('What should you tell the owner?',[
      {text:'Agree. Braces have the lowest margin.', why:'The low full-cost margin comes mostly from allocated overhead, which stays when braces go.'},
      {text:'Keep braces. They contribute $188,760 a year towards fixed costs. Instead, work on their price, their batch sizes and the cost of their 40 SKUs.'},
      {text:'Drop braces and raise mattress prices to compensate', why:'That would need a large price rise just to get back to where you are.'},
      {text:'Drop slings instead', why:'Slings have the highest contribution margin. Dropping them would be even worse.'}
    ],1,'Braces cover a big share of the rent, supervision and machines. Without them, BraceWorks makes a loss. The better question is how to improve them: fewer SKUs, larger batches, a price review, and a minimum order.'),
    K('When dropping a product is right',
      `<p>When its contribution is negative or tiny, when the capacity it uses could earn more elsewhere (a bottleneck), or when you can genuinely remove the fixed costs it causes. Even then, check whether customers buy it as part of a range: a distributor who buys braces may also buy your mattresses.</p>`)
  ]},
  {id:'quiz', label:'Quiz', kind:'quiz', title:'Check your understanding', blocks:[
    Q('You paid $40,000 for a machine five years ago. Deciding whether to keep using it, how relevant is the $40,000?',['Very relevant','Not relevant: it\'s a sunk cost','Relevant only for tax','Relevant if the machine is old'],1,'Only future costs and benefits matter: running costs, repair costs, resale value.'),
    Q('A special order pays $32 per sling. Materials and handling are $18.30, and there\'s spare capacity. What is the extra profit per sling?',['$4.88','$13.70','$32.00','$(5.12)'],1,'$32.00 − $18.30. Labour and overhead are already paid for.'),
    Q('Which is NOT a good reason to accept a low-price special order?',['Spare capacity','Price above variable cost','Other customers might hear and demand the same price','A different market with no overlap'],2,'Price leakage to existing customers can cost far more than the order earns.'),
    Q('A product shows a loss on full cost. Dropping it will usually…',['Always increase profit','Lose its contribution, while much of the allocated overhead stays','Have no effect','Increase overhead'],1,'Check contribution and which fixed costs really go away.'),
    Q('Sewing is the bottleneck. How should you rank products?',['By contribution margin %','By contribution per sewing hour','By selling price','By full-cost margin'],1,'The scarce resource is sewing time, so maximise contribution per hour of it.'),
    Q('Buying a component looks cheaper than making it, but the staff who make it will stay employed with nothing else to do. What happens?',['Buying saves money','Buying probably costs more, because the labour cost doesn\'t go away','It makes no difference','Overhead falls'],1,'If labour isn\'t avoided or redeployed, it isn\'t relevant, and you pay the supplier on top.')
  ]},
  {id:'apply', label:'Practice', kind:'apply', title:'Practise on a sample pack', blocks:[
    PACK('packC',3,'Pack C, page 3: commentary'),
    Q('The NGO offers $32 per sling. Materials and handling are $18.30. What is the contribution per sling if labour were spare?',['$4.88','$13.70','$32.00','$6.95'],1,'$32.00 − $18.30 = $13.70.'),
    Q('But the line is on 960 hours of overtime a month. If every sling needs 1.5 hours of overtime at $4.50 an hour, what\'s left?',['$13.70','$6.95','$0','$4.50'],1,'$13.70 − (1.5 × $4.50) = $6.95. Half the gain disappears, and the cash need comes at the worst time.'),
    PACK('packB',5,'Pack B, page 5: product margins'),
    Q('Pack B shows braces at a 14.9% gross margin. Should BraceWorks drop them?',['Yes, lowest margin','No: braces earn roughly $14.50 contribution each and help pay fixed costs. Work on price, batches and variants instead.','Only if mattresses grow','Yes, and raise sling prices'],1,'Full-cost margin isn\'t the test for dropping a product (Module 13).'),
    {t:'html',html:'<h3>Later, with your own report</h3><p class="small" style="color:var(--muted)">Optional. When you next read your own monthly report, use this checklist. Nothing here is shared or sent; ticks are saved only in this browser.</p>'},
    CHECK('m13-dec','When we make these decisions…',[
      'We look at contribution and changes in cash, not just full unit cost',
      'We list which fixed costs would really change, and which wouldn\'t',
      'We know where our bottleneck is, and our products\' contribution per bottleneck hour',
      'Special orders below normal price need GM approval, with a contribution check',
      'Make-or-buy decisions include supplier qualification, lead time and quality risk',
      'Before dropping a product or customer, we check what else they buy from us'
    ]),
    REPORT('Your Monday-morning question',
      `<p>Ask: <strong>"Which is our bottleneck process, and what is each product's contribution per hour of it?"</strong> If the team can't say, find out together. It's the most important number for capacity decisions.</p>`),
    K('Takeaways',
      `<ul>
        <li>Only costs that differ between the options are relevant. Ignore sunk costs and unchanged fixed costs.</li>
        <li>With spare capacity, any price above variable cost adds profit, as long as it doesn't leak to other customers.</li>
        <li>Make or buy depends on which costs really go away, and on what freed capacity could earn.</li>
        <li>At a bottleneck, rank products by contribution per bottleneck hour.</li>
        <li>Dropping a low-margin product often makes things worse. Check its contribution first.</li>
       </ul>`)
  ]}
  ],
  warnings:[
    {sign:'Decisions based on full unit cost alone', meaning:'Allocated overhead makes good products look bad, and leads to wrong drops and refusals.', look:'Contribution and avoidable costs for the decision.'},
    {sign:'Frequent low-price "special" orders', meaning:'Fixed costs not being covered; price leakage risk.', look:'Share of sales below target price; contribution trend.'},
    {sign:'Overtime at one process while others wait', meaning:'A bottleneck that limits the whole factory.', look:'Utilisation by process; contribution per bottleneck hour.'}
  ],
  formulas:[
    {name:'Incremental profit of an order', f:'Extra revenue − Extra variable costs − Extra fixed costs (e.g. overtime)', ex:'2,000 × ($32.00 − $18.30) − $4,500 overtime = $22,900'},
    {name:'Contribution per bottleneck hour', f:'Contribution per unit ÷ Bottleneck hours per unit', ex:'Mattress: $74.20 ÷ 2.6 h = $28.54'},
    {name:'Make-or-buy saving', f:'Relevant cost to make − Price to buy (+/− opportunity cost)', ex:'$17.14 − $27.00 = ($9.86) per cover, before opportunity cost'}
  ],
  glossary:[
    {term:'Relevant cost', def:'A future cost that differs between the options being compared.'},
    {term:'Sunk cost', def:'Money already spent that no decision can recover. Irrelevant to future decisions.'},
    {term:'Avoidable cost', def:'A cost that would disappear if an activity stopped.'},
    {term:'Opportunity cost', def:'The benefit of the best alternative given up.'},
    {term:'Special order', def:'A one-off order, often at a lower price, judged on its incremental profit.'},
    {term:'Make or buy', def:'The decision to produce a component in-house or purchase it from a supplier.'},
    {term:'Bottleneck', def:'The process with the least capacity relative to demand. It limits the output of the whole factory.'},
    {term:'Price leakage', def:'When a discount given to one customer spreads to others.'}
  ]
});
})();
