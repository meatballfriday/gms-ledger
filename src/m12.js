/* ===== Module 12: Break-even and pricing ===== */
(function(){
const {K,TIP,FLAG,CASE,REPORT,Q,FS,FLIP,SORT,CHECK,W,PACK,money,signed,pct,kfmt} = BW.h;

BW.add({
  id:'m12', minutes:50,
  title:'Break-even and pricing',
  subtitle:'Split costs into the ones that move with volume and the ones that don\'t, and most pricing and volume questions answer themselves.',
  goals:[
    'Separate fixed and variable costs, and calculate contribution margin',
    'Find BraceWorks\' break-even point and margin of safety',
    'Price an export quote for a target margin, including freight, payment terms and currency',
    'Work out how much volume a price rise can afford to lose'
  ],
  sections:[
  {id:'behave', label:'Fixed vs variable', kind:'learn', title:'Costs that move, and costs that don\'t', blocks:[
    `<p>The P&amp;L groups costs by <em>what</em> they are. For decisions, you need to group them by <em>how they behave</em> when volume changes.</p>
     <ul>
      <li><strong>Variable costs</strong> rise and fall with each unit sold: materials, freight on each shipment, sales commission.</li>
      <li><strong>Fixed costs</strong> stay the same in the short run, whatever the volume: rent, salaries, depreciation, insurance, certification fees.</li>
     </ul>`,
    SORT('Fixed or variable for BraceWorks, over the next few months?',['Variable','Fixed'],[
      {text:'Foam and fabric', a:0, why:'Every extra mattress needs more.'},
      {text:'Factory rent', a:1, why:'Same rent whether you make 2,000 or 3,000 mattresses.'},
      {text:'Sales commission at 2% of sales', a:0, why:'Moves directly with revenue.'},
      {text:'Production staff on monthly wages', a:1, why:'In the short run you pay the team whether the line is busy or not. In the Philippines, regular employees can only be let go for a legal cause, with notice and separation pay, so this cost doesn\'t fall when orders dip. Over a year you could hire or reduce, so it\'s "semi-fixed".'},
      {text:'Overtime when orders are high', a:0, why:'Paid only for the extra hours the line runs, at a premium: at least 25% more per hour on a normal working day in the Philippines.'},
      {text:'Agency workers hired for a busy season', a:0, why:'Hired for the extra volume and released when it ends.'},
      {text:'Sea freight on each shipment', a:0, why:'More shipments, more freight.'},
      {text:'ISO 13485 certification audit fee', a:1, why:'The same whatever the volume.'},
      {text:'Depreciation of the foam cutter', a:1, why:'Charged by time, not by use.'}
    ]),
    `<h3>BraceWorks, rearranged</h3>`,
    FS({title:'Contribution view of BraceWorks\' year', cols:['$','% of revenue'], rows:[
      ['Revenue', [1200000,'100%'], 'sub'],
      ['Materials', [-552000,'46%'], 'ind'],
      ['Freight and export documents', [-48000,'4%'], 'ind'],
      ['Sales commission', [-24000,'2%'], 'ind'],
      ['Contribution', [576000,'48%'], 'sub'],
      ['Production wages', [-152000,''], 'ind'],
      ['Factory overhead', [-156000,''], 'ind'],
      ['Other selling and admin costs', [-174000,''], 'ind'],
      ['Interest and currency', [-20000,''], 'ind'],
      ['Total fixed costs', [-502000,''], 'sub'],
      ['Profit before tax', [74000,''], 'total']
    ]}),
    K('Production labour is a mixed cost',
      `<p>Is production labour really fixed? In practice it's <strong>part fixed, part variable</strong>. The core team on monthly wages is paid whether the line is busy or quiet. But busy months bring <strong>overtime</strong> and <strong>agency or daily workers</strong>, and those move with volume. A cost like this is called a <span class="term">semi-variable cost</span>.</p>
       <p>The table above treats all $152,000 of production wages as fixed, to keep the first look simple. Below, split it and see what changes.</p>`),
    K('Contribution: the most useful number in this course',
      `<p><span class="term">Contribution</span> = revenue − variable costs. It's what each sale contributes towards paying the fixed costs, and then to profit.</p>
       <p>BraceWorks' <strong>contribution margin is 48%</strong>, treating all production wages as fixed. So every extra $100 of sales, at current prices, adds $48 to profit, as long as fixed costs don't change. And every $100 of lost sales costs $48.</p>`),
    {t:'tbl', head:['Per unit','Mattress','Sling','Brace'], opts:{num:[1,2,3]}, rows:[
      ['Price','$180.00','$45.00','$28.00'],
      ['Materials','($95.00)','($18.00)','($11.80)'],
      ['Freight and commission (6%)','($10.80)','($2.70)','($1.68)'],
      {cls:'',cells:['<strong>Contribution per unit</strong>','<strong>$74.20</strong>','<strong>$24.30</strong>','<strong>$14.52</strong>']},
      ['Contribution margin','41.2%','54.0%','51.9%'],
      ['Full-cost gross margin (Module 6)','30.3%','39.7%','16.6%']
    ]},
    TIP('Notice the braces',
      `<p>On full cost, braces look like the weakest product, at 16.6%. On contribution, they're at 51.9%, almost as good as slings. Both views are correct. They answer different questions. Module 13 shows which one to use when deciding whether to drop a product.</p>`)
  ]},
  {id:'be', label:'Break-even', kind:'play', title:'Where does BraceWorks break even?', blocks:[
    `<p>The <span class="term">break-even point</span> is the sales level where contribution exactly covers fixed costs: no profit, no loss.</p>
     <p class="num" style="font-weight:600">Break-even sales = Fixed costs ÷ Contribution margin = $502,000 ÷ 48% = $1,045,833</p>
     <p>BraceWorks sells $1,200,000. Its <span class="term">margin of safety</span> is the gap: $154,000, or <strong>12.8%</strong>. Sales could fall by 12.8% before the company makes a loss.</p>`,
    W('Break-even chart', function(el, ctx){
      const {money,pct,kfmt}=ctx.h;
      const top=document.createElement('div'), chart=document.createElement('div'), out=document.createElement('div'); el.append(top,chart,out);
      ctx.ui.sliders(top,[
        {k:'p',label:'Price change',min:-10,max:10,step:1,v:0,f:x=>(x>0?'+':'')+x+'%'},
        {k:'vc',label:'Variable cost per unit change',min:-10,max:15,step:1,v:0,f:x=>(x>0?'+':'')+x+'%'},
        {k:'fc',label:'Fixed costs',min:400000,max:620000,step:5000,v:502000,f:money}
      ],(v)=>{
        const R=1200000*(1+v.p/100), VC=624000*(1+v.vc/100), FC=v.fc; const cm=(R-VC)/R;
        const be=cm>0?FC/cm:Infinity, beVol=cm>0?be/R:Infinity; const pbt=R-VC-FC;
        const W_=600,H_=300,L=64,B=36,T=12,Rt=14; const xmax=1.5, ymax=Math.max(R,VC+FC)*1.5*1.02;
        const X=x=>L+(x/xmax)*(W_-L-Rt), Y=y=>T+(1-y/ymax)*(H_-T-B);
        const line=(f,col,dash)=>`<polyline fill="none" stroke="${col}" stroke-width="2.5" ${dash?'stroke-dasharray="6 5"':''} points="${[0,0.5,1,1.5].map(x=>X(x).toFixed(1)+','+Y(f(x)).toFixed(1)).join(' ')}"/>`;
        let grid=''; for(let i=0;i<=4;i++){ const y=ymax*i/4; grid+=`<line x1="${L}" x2="${W_-Rt}" y1="${Y(y)}" y2="${Y(y)}" stroke="var(--rule)" stroke-width="1"/><text x="${L-8}" y="${Y(y)+4}" text-anchor="end" font-size="11" fill="var(--muted)" font-family="var(--f-mono)">${kfmt(y)}</text>`; }
        [0,0.5,1,1.5].forEach(x=>{ grid+=`<text x="${X(x)}" y="${H_-B+18}" text-anchor="middle" font-size="11" fill="var(--muted)" font-family="var(--f-mono)">${Math.round(x*100)}%</text>`; });
        const beMark= isFinite(beVol)&&beVol<=xmax ? `<line x1="${X(beVol)}" x2="${X(beVol)}" y1="${T}" y2="${H_-B}" stroke="var(--amber)" stroke-width="1.5" stroke-dasharray="3 4"/><circle cx="${X(beVol)}" cy="${Y(be)}" r="5" fill="var(--amber)"/><text x="${X(beVol)>W_*0.55?X(beVol)-8:X(beVol)+8}" text-anchor="${X(beVol)>W_*0.55?'end':'start'}" y="${Y(be)-10}" font-size="12" fill="var(--amber)" font-weight="700" font-family="var(--f-body)">Break-even ${kfmt(be)}</text>`:'';
        const cur=`<line x1="${X(1)}" x2="${X(1)}" y1="${T}" y2="${H_-B}" stroke="var(--ink)" stroke-width="1" stroke-dasharray="2 3" opacity=".5"/><text x="${X(1)-6}" y="${T+14}" text-anchor="end" font-size="11" fill="var(--muted)" font-family="var(--f-body)">Today's volume</text>`;
        chart.innerHTML=`<div style="overflow-x:auto"><svg viewBox="0 0 ${W_} ${H_}" style="width:100%;min-width:420px;height:auto" role="img" aria-label="Break-even chart">${grid}<line x1="${L}" x2="${W_-Rt}" y1="${H_-B}" y2="${H_-B}" stroke="var(--rule-strong)"/>${line(x=>FC,'var(--muted)',true)}${line(x=>FC+VC*x,'var(--red)')}${line(x=>R*x,'var(--good)')}${cur}${beMark}<text x="${L}" y="${H_-4}" font-size="11" fill="var(--muted)" font-family="var(--f-body)">Volume, as % of today's</text></svg></div>
          <div class="row small" style="gap:14px;color:var(--muted)"><span><span style="display:inline-block;width:14px;height:3px;background:var(--good);vertical-align:middle"></span> Revenue</span><span><span style="display:inline-block;width:14px;height:3px;background:var(--red);vertical-align:middle"></span> Total costs</span><span><span style="display:inline-block;width:14px;height:0;border-top:2px dashed var(--muted);vertical-align:middle"></span> Fixed costs</span></div>`;
        const mos=isFinite(be)?(R-be)/R:-1;
        out.innerHTML=`<div class="stats">${ctx.ui.stat('Contribution margin',pct(cm))}${ctx.ui.stat('Break-even sales',isFinite(be)?money(Math.round(be)):'Never','',isFinite(beVol)?`${Math.round(beVol*100)}% of today's volume`:'')}${ctx.ui.stat('Margin of safety',isFinite(be)?pct(mos):'–',mos<0?'bad':mos<0.1?'warn':'good')}${ctx.ui.stat('Profit before tax at today\'s volume',money(Math.round(pbt)),pbt<0?'bad':'')}</div>`;
      },ctx.uid);
    }),
    K('Operating leverage',
      `<p>Because most of BraceWorks' costs are fixed, profit swings much more than sales. Contribution $576,000 ÷ profit before tax $74,000 = <strong>7.8</strong>. That's the <span class="term">operating leverage</span>: a 1% change in sales changes profit by about 7.8%. A 10% sales drop would cut profit by almost 80%. High operating leverage is exciting in a good year and dangerous in a bad one.</p>`),
    Q('Fixed costs rise by $24,000 (a new quality engineer). By how much must sales rise to keep the same profit?',['$24,000','$50,000','$11,520','$100,000'],1,'Extra sales needed = $24,000 ÷ 48% = $50,000. Every fixed cost needs about twice its value in extra sales.')
  ]},
  {id:'price', label:'Pricing an export quote', kind:'play', title:'Pricing an export quote', blocks:[
    `<p>Every export quote has costs that a domestic price list ignores: who pays freight and duty (the <span class="term">Incoterm</span>), how long you wait to be paid, currency risk, and commission. Each one is a % of the price or a cost per unit. Leave any out and your margin quietly disappears.</p>`,
    W('Export quote builder', function(el, ctx){
      const {money,pct}=ctx.h; const m2=x=>money(x,2);
      const P={m:{n:'Mattress',full:125.40,vc:95,list:180,log:{EXW:0,FOB:3,CIF:14,DDP:22}},s:{n:'Sling',full:27.12,vc:18,list:45,log:{EXW:0,FOB:0.6,CIF:1.8,DDP:3.2}},b:{n:'Brace',full:23.35,vc:11.8,list:28,log:{EXW:0,FOB:0.4,CIF:1.1,DDP:2.0}}};
      let prod='m', inc='FOB';
      const segP=document.createElement('div'), segI=document.createElement('div'), top=document.createElement('div'), out=document.createElement('div');
      segI.style.marginTop='8px'; el.append(segP,segI,top,out);
      let vals={};
      function draw(){
        const p=P[prod], log=p.log[inc], duty=inc==='DDP'?0.03:0;
        const fin=0.08*vals.days/365, pctCosts=vals.com/100+vals.fx/100+fin+duty;
        const target=vals.tm/100;
        const priceT=(p.full+log)/(1-target-pctCosts);
        const floor=(p.vc+log)/(1-pctCosts);
        const fullBE=(p.full+log)/(1-pctCosts);
        const listMargin=(p.list-(p.full+log)-p.list*pctCosts)/p.list;
        out.innerHTML=ctx.ui.table(['Build-up at the target price','Per unit'],[
          ['Full unit cost (Module 6)',m2(p.full)],
          [`Freight, insurance and handling (${inc})`,m2(log)],
          ['Sales commission ('+vals.com+'%)',m2(priceT*vals.com/100)],
          ['Currency buffer ('+vals.fx+'%)',m2(priceT*vals.fx/100)],
          [`Cost of waiting ${vals.days} days to be paid (8% a year)`,m2(priceT*fin)],
          ...(duty?[['Import duty paid by us (3%)',m2(priceT*duty)]]:[]),
          ['Margin ('+vals.tm+'%)',m2(priceT*target)],
          {cls:'',cells:['<strong>Quote price</strong>',`<strong>${m2(priceT)}</strong>`]}
        ],{num:[1]})+
        `<div class="stats" style="margin-top:12px">${ctx.ui.stat('Quote at target margin',m2(priceT),'good')}${ctx.ui.stat('Covers full cost, zero margin',m2(fullBE),'warn')}${ctx.ui.stat('Absolute floor: covers variable costs only',m2(floor),'bad')}${ctx.ui.stat('Margin if you quote list price ('+money(p.list)+')',pct(listMargin),listMargin<0.1?'bad':listMargin<target?'warn':'good')}</div>
        <p class="w-hint" style="margin-top:10px">${inc==='DDP'?'DDP means BraceWorks carries freight, insurance, import duty and the risk all the way to the customer\'s door. If you quote DDP at your FOB price, the difference comes straight out of your margin.':vals.days>=90?'Long payment terms are a real cost: your money is funding the customer. 90 days at 8% a year costs about 2% of the price.':'Try switching Incoterm to DDP with 90-day terms, and compare with the list price margin.'}</p>`;
      }
      function build(){
        top.innerHTML='';
        ctx.ui.sliders(top,[
          {k:'tm',label:'Target margin after all costs',min:5,max:40,step:1,v:25,f:x=>x+'%'},
          {k:'days',label:'Customer payment terms',min:0,max:120,step:15,v:60,f:x=>x+' days'},
          {k:'com',label:'Sales commission or agent fee',min:0,max:10,step:0.5,v:2,f:x=>x+'%'},
          {k:'fx',label:'Currency buffer (if quoting in euros)',min:0,max:5,step:0.5,v:0,f:x=>x+'%'}
        ],(v)=>{vals=v;draw();},ctx.uid);
      }
      ctx.ui.seg(segP,[{v:'m',label:'Mattress'},{v:'s',label:'Sling'},{v:'b',label:'Brace'}],'m',v=>{prod=v;draw();});
      ctx.ui.seg(segI,[{v:'EXW',label:'EXW: collected from factory'},{v:'FOB',label:'FOB: loaded on ship'},{v:'CIF',label:'CIF: to their port'},{v:'DDP',label:'DDP: to their door, duty paid'}],'FOB',v=>{inc=v;draw();});
      build();
    }),
    K('Three price levels to know for every product',
      `<ul>
        <li><strong>Target price:</strong> covers full cost, delivery terms, financing and your target margin. Your normal quote.</li>
        <li><strong>Full-cost price:</strong> covers everything, earns nothing. Below this, you're not paying your share of overheads.</li>
        <li><strong>Floor price:</strong> covers only variable costs. Below this, every unit you sell makes you poorer. Only go near it for special cases with spare capacity (Module 13).</li>
       </ul>`),
    TIP('Cost-plus is a floor, not a strategy',
      `<p>Costs tell you the lowest price you can accept. They don't tell you the highest price the customer would pay. For products where BraceWorks is strong, such as certified pressure-relief mattresses with fast delivery, ask sales what competitors charge and what the hospital saves by using a better product. That's <span class="term">value-based pricing</span>, and it's where margin is won.</p>`)
  ]},
  {id:'raise', label:'The price rise test', kind:'learn', title:'How much volume can a price rise afford to lose?', blocks:[
    `<p>The fear behind every price rise is losing customers. Contribution lets you put a number on it.</p>
     <p class="num" style="font-weight:600">Maximum volume you can lose = Price rise ÷ (Contribution margin + Price rise)</p>
     <p>For BraceWorks, a 5% price rise: 5% ÷ (48% + 5%) = <strong>9.4%</strong>. You could lose almost one unit in ten and still make the same profit. Lose less, and you're ahead.</p>`,
    {t:'tbl', head:['Price rise','Volume you can lose and break even','Volume you must gain if you cut price instead'], opts:{num:[1,2]}, rows:[
      ['+3%','5.9%','–'],['+5%','9.4%','–'],['+10%','17.2%','–'],['−5%','–','11.6%'],['−10%','–','26.3%']
    ]},
    K('The asymmetry',
      `<p>A 10% price <em>cut</em> needs 26% more volume just to stand still. A 10% price <em>rise</em> can lose 17% of volume and still break even. With thin margins and high fixed costs, discounting is expensive and price increases are powerful.</p>`),
    Q('BraceWorks raises prices 5% and loses 3% of volume. What happens to profit before tax?',['It falls','It stays the same','It rises by about $40,000','It rises by $60,000'],2,
      'Revenue becomes $1,222,200. Variable costs become $606,400: materials and freight fall with volume, commission rises with price. Contribution rises from $576,000 to $615,800, about $40,000 more, and fixed costs don\'t change.')
  ]},
  {id:'case', label:'Case: nobody dared', kind:'case', title:'The price rise nobody dared', blocks:[
    CASE('Two years, no increase',
      `<p>Over two years, foam rose 12%, fabric 7% and wages 8%. BraceWorks' prices haven't changed, because "distributors will leave". Gross margin has slid from 31.5% to 28.3%.</p>
       <p>You propose a 5% increase from 1 January. The sales manager estimates you could lose up to 6% of volume. The owner asks: <em>"Is it worth the risk?"</em></p>`),
    FS({title:'The numbers', cols:['No change','+5%, lose 6%'], rows:[
      ['Revenue', [1200000, 1184400]],
      ['Variable costs (materials, freight, commission)', [-624000, -587700]],
      ['Contribution', [576000, 596700], 'sub'],
      ['Fixed costs', [-502000, -502000]],
      ['Profit before tax', [74000, 94700], 'total']
    ], note:'Even in the sales manager\'s worst case, profit rises 28%. Commission rises with the higher price; materials and freight fall with lower volume.'}),
    Q('How should BraceWorks put the price rise in place?',[
      {text:'Raise all prices 5% overnight with no explanation', why:'Surprises damage trust. Distributors need time to update their own price lists.'},
      {text:'Give 60–90 days\' notice with a short, honest explanation of the cost increases, protect key accounts with a small loyalty step, and track volume by customer afterwards'},
      {text:'Raise prices only for new customers', why:'That leaves most of the margin problem unsolved.'},
      {text:'Wait one more year to see if costs fall', why:'Each year of delay costs about $20,000–$60,000 of margin.'}
    ],1,'Distributors in medical supply expect annual price reviews. A clear explanation tied to real cost increases, with notice, keeps almost all of them. Then track volume and margin by customer to see who reacts.'),
    K('How accounting found it',
      `<p>The signal was in the reports all along: materials % of revenue creeping up (Module 3), adverse price variances on foam (Module 8), and standard costs that hadn't been updated (Module 6). What was missing was a yearly routine: <strong>update standard costs, then review prices against them</strong>.</p>`)
  ]},
  {id:'quiz', label:'Quiz', kind:'quiz', title:'Check your understanding', blocks:[
    Q('Revenue is $1.2M and variable costs are $624,000. What is the contribution margin?',['52%','48%','28%','62%'],1,'($1,200,000 − $624,000) ÷ $1,200,000 = 48%.'),
    Q('Fixed costs are $502,000 and the contribution margin is 48%. What is break-even revenue?',['$502,000','$1,045,833','$240,960','$1,200,000'],1,'$502,000 ÷ 0.48 = $1,045,833.'),
    Q('Which is the absolute lowest price that adds anything to profit in the short run?',['Full cost','Variable cost (plus delivery and payment costs)','List price','Break-even price'],1,'Any price above variable cost adds contribution. But it only makes sense with spare capacity and no damage to normal prices.'),
    Q('You quote DDP at the same price as your FOB quote. What happens?',['Nothing changes','Your margin absorbs freight, insurance, duty and delivery risk','The customer pays more','Your revenue rises'],1,'DDP shifts all costs to the customer\'s door onto you. The price must rise to match.'),
    Q('With a 48% contribution margin, how much volume can a 5% price rise lose before profit falls?',['5%','9.4%','25%','48%'],1,'5 ÷ (48 + 5) = 9.4%.'),
    Q('High operating leverage means…',['Profit moves much more than sales, both up and down','The company has lots of debt','Sales are very stable','Variable costs are high'],0,'With mostly fixed costs, each % of sales moves profit by several %.')
  ]},
  {id:'apply', label:'Practice', kind:'apply', title:'Practise on a sample pack', blocks:[
    PACK('packB',3,'Pack B, page 3: commentary'),
    Q('Pack B proposes a price review. With a 4% price rise and no volume loss, what would March gross margin have been?',['26.7%','About 29.5%','About 31%','About 34%'],1,'Revenue $106,080, gross profit $27,200 + $4,080 = $31,280: 29.5%.'),
    PACK('packC',4,'Pack C, page 4: income statement'),
    Q('Pack C\'s freight was 5.0% of revenue against 4.0% budget, because a big order was shipped CIF. What should future CIF quotes include?',['Nothing extra','Sea freight and insurance to the destination port, priced into the quote','Only commission','A discount'],1,'Under CIF the seller pays freight and insurance. Price it (Module 12).'),
    {t:'html',html:'<h3>Later, with your own report</h3><p class="small" style="color:var(--muted)">Optional. When you next read your own monthly report, use this checklist. Nothing here is shared or sent; ticks are saved only in this browser.</p>'},
    CHECK('m12-price','At my company…',[
      'Finance can tell me our contribution margin and break-even sales',
      'Each product has a known variable cost and contribution per unit',
      'Quotes include freight by Incoterm, payment terms, currency and commission',
      'Sales knows the floor price for each product and needs approval to go below the target',
      'Prices are reviewed every year against updated standard costs',
      'Commission is paid on contribution or gross profit, not just revenue',
      'We track win rates and margin on quotes, not just volume'
    ]),
    REPORT('Your Monday-morning question',
      `<p>Ask: <strong>"What's our contribution margin, our break-even sales level and our margin of safety?"</strong> Then ask: <strong>"When did we last raise prices, and how much have our costs risen since?"</strong></p>`),
    K('Takeaways',
      `<ul>
        <li>Contribution = revenue − variable costs. BraceWorks keeps 48 cents of every sales dollar to cover fixed costs.</li>
        <li>Break-even = fixed costs ÷ contribution margin. Margin of safety shows how far sales can fall.</li>
        <li>Export prices must cover delivery terms, payment terms, currency and commission.</li>
        <li>Price rises usually beat volume. Price cuts need far more volume than you'd think.</li>
       </ul>`)
  ]}
  ],
  warnings:[
    {sign:'No price increase for over a year while costs rise', meaning:'Margin erosion, often several points a year.', look:'Material and wage inflation vs price changes.'},
    {sign:'Margin of safety below 10%', meaning:'A modest sales drop would cause a loss.', look:'Break-even sales vs forecast; fixed cost growth.'},
    {sign:'DDP or CIF quotes priced like FOB', meaning:'Freight, duty and risk absorbed without being priced.', look:'Margin by Incoterm on recent orders.'},
    {sign:'Sales offering longer payment terms to win orders', meaning:'Hidden price cut, plus more cash tied up.', look:'Terms by customer; cost of financing in quotes.'}
  ],
  formulas:[
    {name:'Contribution', f:'Revenue − Variable costs', ex:'$1,200,000 − $624,000 = $576,000'},
    {name:'Contribution margin', f:'Contribution ÷ Revenue', ex:'$576,000 ÷ $1,200,000 = 48%'},
    {name:'Break-even sales', f:'Fixed costs ÷ Contribution margin', ex:'$502,000 ÷ 48% = $1,045,833'},
    {name:'Margin of safety', f:'(Actual sales − Break-even sales) ÷ Actual sales', ex:'($1,200,000 − $1,045,833) ÷ $1,200,000 = 12.8%'},
    {name:'Operating leverage', f:'Contribution ÷ Profit before tax', ex:'$576,000 ÷ $74,000 = 7.8×'},
    {name:'Volume a price rise can lose', f:'Price rise ÷ (Contribution margin + Price rise)', ex:'5% ÷ (48% + 5%) = 9.4%'},
    {name:'Volume a price cut must gain', f:'Price cut ÷ (Contribution margin − Price cut)', ex:'5% ÷ (48% − 5%) = 11.6%'}
  ],
  glossary:[
    {term:'Variable cost', def:'A cost that rises and falls with volume, such as materials or freight per shipment.'},
    {term:'Fixed cost', def:'A cost that stays the same in the short run whatever the volume, such as rent or salaries.'},
    {term:'Semi-variable cost', def:'A cost with a fixed part and a variable part, such as production labour: a core team on monthly wages, plus overtime and agency workers that rise with volume. Also called a mixed cost.'},
    {term:'Contribution', def:'Revenue minus variable costs. What each sale contributes to fixed costs and profit.'},
    {term:'Contribution margin', def:'Contribution as a % of revenue.'},
    {term:'Break-even point', def:'The sales level where contribution exactly covers fixed costs.'},
    {term:'Margin of safety', def:'How far sales can fall before the business makes a loss, as a % of current sales.'},
    {term:'Operating leverage', def:'How sensitive profit is to changes in sales, driven by the share of fixed costs.'},
    {term:'Incoterms', def:'Standard trade terms (EXW, FCA, FOB, CIF, DDP and others) defining who pays for and carries risk on each stage of delivery.'},
    {term:'Value-based pricing', def:'Setting price by the value to the customer rather than by cost alone.'},
    {term:'Floor price', def:'The lowest acceptable price: variable cost plus delivery and payment costs.'}
  ]
});
})();
