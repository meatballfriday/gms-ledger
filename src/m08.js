/* ===== Module 8: Standard costs and variances ===== */
(function(){
const {K,TIP,FLAG,CASE,REPORT,Q,FS,FLIP,SORT,CHECK,W,PACK,money,signed,pct,kfmt} = BW.h;

BW.add({
  id:'m8', minutes:45,
  title:'Standard costs and variances',
  subtitle:'Actual costs never match the plan exactly. Variances tell you by how much, why, and whose desk to walk to.',
  goals:[
    'Explain what a standard cost is and why factories use them',
    'Split a cost overrun into price and usage (or rate and efficiency) variances',
    'Know who in the business owns each variance',
    'Use the cost of quality to put a dollar figure on scrap, rework and returns'
  ],
  sections:[
  {id:'std', label:'What is a standard?', kind:'learn', title:'The standard cost card', blocks:[
    `<p>A <span class="term">standard cost</span> is what a product <em>should</em> cost when things go to plan: the right quantity of materials at the expected price, made in the expected time. It's the unit cost from Module 6, written down as a target.</p>`,
    {t:'tbl', head:['Mattress standard cost card','Standard quantity','Standard price','Standard cost'], opts:{num:[1,2,3]}, rows:[
      ['High-resilience foam','0.26 m³','$200.00/m³','$52.00'],
      ['Visco-elastic foam','0.05 m³','$370.00/m³','$18.50'],
      ['Cover fabric','4.2 m','$3.20/m','$13.44'],
      ['Other components','1 set','$11.06','$11.06'],
      ['Direct labour','5.0 h','$3.00/h','$15.00'],
      ['Overhead','5.0 h','$3.08/h','$15.40'],
      {cls:'',cells:['<strong>Standard cost</strong>','','','<strong>$125.40</strong>']}
    ]},
    `<h3>Why bother with standards?</h3>
     <ul>
      <li><strong>They give every cost a target.</strong> Without one, you can see that foam cost $14,800 last month, but not whether that was good or bad.</li>
      <li><strong>They make problems visible early.</strong> Any difference between actual and standard shows up as a <span class="term">variance</span> every month, not as a surprise at the year-end count.</li>
      <li><strong>They point to the cause.</strong> Each variance has an owner: purchasing, production, HR or sales.</li>
     </ul>`,
    K('Favourable and adverse',
      `<p>A variance is <strong>favourable (F)</strong> when actual cost is below standard, and <strong>adverse (A)</strong>, sometimes called unfavourable (U), when it's above. "Favourable" doesn't automatically mean good. Cheap materials can cause expensive problems later, as you'll see in the case file.</p>`)
  ]},
  {id:'split', label:'Price vs usage', kind:'learn', title:'Splitting a variance into price and usage', blocks:[
    `<p>In October, BraceWorks made <strong>240 mattresses</strong>. The standard allows 0.26 m³ of foam each, at $200 per m³: <strong>62.4 m³ costing $12,480</strong>. Actual foam cost was <strong>$14,500</strong>, made up of 68.4 m³ at $212. That's $2,020 over standard. But why?</p>`,
    {t:'tbl', head:['Variance','Formula','October','Owner'], opts:{num:[2]}, rows:[
      ['<strong>Price variance</strong>','(Actual price − Standard price) × Actual quantity','(212 − 200) × 68.4 = <span class="neg">$821 A</span>','Purchasing'],
      ['<strong>Usage variance</strong>','(Actual quantity − Standard quantity) × Standard price','(68.4 − 62.4) × 200 = <span class="neg">$1,200 A</span>','Production'],
      {cls:'',cells:['<strong>Total foam variance</strong>','','<strong class="neg">$2,021 A</strong>','']}
    ]},
    `<p>So purchasing paid 6% more per m³, and production used 10% more foam than it should have. Two different problems, two different conversations. Without the split, both would hide in one number.</p>
     <h3>The same logic for labour</h3>`,
    {t:'tbl', head:['Variance','Formula','October','Owner'], opts:{num:[2]}, rows:[
      ['<strong>Rate variance</strong>','(Actual rate − Standard rate) × Actual hours','(3.05 − 3.00) × 1,290 = <span class="neg">$65 A</span>','HR / management (pay rates, overtime premium)'],
      ['<strong>Efficiency variance</strong>','(Actual hours − Standard hours) × Standard rate','(1,290 − 1,200) × 3.00 = <span class="neg">$270 A</span>','Production']
    ]},
    TIP('Overhead variances, briefly',
      `<p>Overhead is charged to products at $3.08 per labour hour, based on a budget of 50,667 hours a year. In a slow month, fewer hours are worked, so less overhead gets charged to products than is actually spent. The difference is called <span class="term">under-absorbed overhead</span>, and it hits the P&amp;L as a cost. A big under-absorption tells you the factory is running well below the volume it's built for.</p>`)
  ]},
  {id:'calc', label:'Variance lab', kind:'play', title:'The variance lab', blocks:[
    `<p>Here's October's mattress production. Change the actuals and see how each variance responds, and who you'd talk to.</p>`,
    W('Mattress variances for the month', function(el, ctx){
      const {money}=ctx.h;
      const top=document.createElement('div'), out=document.createElement('div'); el.append(top,out);
      const SQ=0.26, SP=200, SH=5, SR=3;
      ctx.ui.sliders(top,[
        {k:'units',label:'Mattresses made',min:150,max:320,step:5,v:240,f:x=>x+''},
        {k:'aq',label:'Foam actually used (m³)',min:40,max:100,step:0.2,v:68.4,f:x=>x.toFixed(1)+' m³'},
        {k:'ap',label:'Actual foam price per m³',min:170,max:240,step:1,v:212,f:x=>'$'+x},
        {k:'ah',label:'Labour hours actually worked',min:800,max:1800,step:10,v:1290,f:x=>x.toLocaleString('en-US')+' h'},
        {k:'ar',label:'Actual labour cost per hour',min:2.6,max:3.6,step:0.05,v:3.05,f:x=>'$'+x.toFixed(2)}
      ],(v)=>{
        const sq=SQ*v.units, sh=SH*v.units;
        const mpv=(v.ap-SP)*v.aq, muv=(v.aq-sq)*SP, lrv=Math.round((v.ar-SR)*100)/100*v.ah, lev=(v.ah-sh)*SR;
        const tag=x=>Math.abs(x)<0.5?'<span>–</span>':x>0?`<span class="neg">${money(Math.round(x))} A</span>`:`<span class="pos">${money(Math.round(-x))} F</span>`;
        const std=sq*SP+sh*SR, act=v.aq*v.ap+v.ah*v.ar;
        out.innerHTML=ctx.ui.table(['Variance','Amount','Talk to'],[
          ['Foam price',tag(mpv),'Purchasing'],
          ['Foam usage',tag(muv),'Production / cutting'],
          ['Labour rate',tag(lrv),'HR, overtime approvals'],
          ['Labour efficiency',tag(lev),'Production supervisors'],
          {cls:'',cells:['<strong>Total</strong>',`<strong>${tag(mpv+muv+lrv+lev)}</strong>`,'']}
        ],{num:[1]})+
        `<div class="stats" style="margin-top:12px">${ctx.ui.stat('Standard cost for '+v.units+' mattresses (foam + labour)',money(Math.round(std)))}${ctx.ui.stat('Actual cost',money(Math.round(act)),act>std*1.03?'bad':act<std*0.98?'good':'')}${ctx.ui.stat('Foam used per mattress',(v.aq/v.units).toFixed(3)+' m³','',`standard 0.260`)}</div>
        <p class="w-hint" style="margin-top:10px">${(()=>{ const tot=mpv+muv+lrv+lev; const parts=[['u',muv],['p',mpv],['e',lev],['r',lrv]].sort((a,b)=>b[1]-a[1]); const top=parts[0];
          if(tot<-0.02*std) return 'Favourable overall. Check it\'s real: are quality checks being skipped, or is the standard out of date?';
          if(tot<0.03*std||top[1]<300) return 'Close to standard. Small variances are normal. Look at the trend over several months before acting.';
          return {u:'Foam usage is the biggest problem. Check cutting patterns, scrap bins, and whether the foam blocks are the size purchasing ordered.',p:'Foam price is the main driver. Was this a supplier increase, a rush order, or a currency move? Should the standard and your quotes be updated?',e:'Labour efficiency is the main issue. Look for machine downtime, waiting for materials, rework or new staff.',r:'Pay rates are the main driver, usually overtime premiums. Ask why overtime was needed.'}[top[0]]; })()}</p>`;
      },ctx.uid);
    }),
    K('How to use a variance report',
      `<ul>
        <li><strong>Look at the big ones first.</strong> Ignore variances under, say, 2% of the cost line unless they repeat.</li>
        <li><strong>Look for trends.</strong> One bad month is noise. Three in a row is a problem.</li>
        <li><strong>Ask "why", not "who".</strong> A usage variance might come from bad foam (a purchasing issue) rather than careless cutting.</li>
        <li><strong>Update standards when the world changes.</strong> If foam is permanently 6% dearer, change the standard and the prices you quote.</li>
       </ul>`)
  ]},
  {id:'coq', label:'Cost of quality', kind:'learn', title:'What quality costs, and what poor quality costs more', blocks:[
    `<p>For a medical device maker, quality isn't optional. But it isn't free either. The <span class="term">cost of quality</span> puts a dollar figure on it, in four groups:</p>`,
    {t:'tbl', head:['Category','What it includes','BraceWorks per year'], opts:{num:[2]}, rows:[
      ['<strong>Prevention</strong>','Training, design reviews, supplier qualification, process validation','$8,000'],
      ['<strong>Appraisal</strong>','Incoming inspection, in-process checks, final QA, testing, certification audits','$34,000'],
      ['<strong>Internal failure</strong>','Scrap, rework, re-inspection, downtime caused by defects','$41,000'],
      ['<strong>External failure</strong>','Returns, credit notes, complaint handling, corrective actions, field actions, lost customers','$18,000'],
      {cls:'',cells:['<strong>Total cost of quality</strong>','8.4% of revenue','<strong>$101,000</strong>']}
    ]},
    W('Where BraceWorks\' quality money goes', function(el,ctx){
      el.innerHTML=ctx.ui.bars([{label:'Prevention',v:8000,tone:'good'},{label:'Appraisal',v:34000,tone:'blue'},{label:'Internal failure',v:41000,tone:'bad'},{label:'External failure',v:18000,tone:'bad'}])+
      `<p class="w-hint" style="margin-top:10px">BraceWorks spends $8,000 preventing problems and $59,000 paying for them. Most quality experts would say the balance should be the other way round. Each dollar of prevention typically saves several dollars of failure.</p>`;
    }),
    K('Why accounting needs to see this',
      `<p>In most small factories, scrap and rework are buried in materials and labour, and returns are netted off revenue. So nobody sees the $59,000. Ask finance to give scrap, rework and returns their own accounts. Once they're visible, they get managed.</p>`),
    FLAG('Medical device extra',
      `<p>An external failure in a medical device can mean a field safety corrective action or recall: tracing lots, notifying regulators and distributors, and replacing product. Even a small recall can cost more than a year's profit. That's the strongest financial argument for prevention spending.</p>`)
  ]},
  {id:'case', label:'Case: the cheaper foam', kind:'case', title:'The cheaper foam', blocks:[
    CASE('Purchasing\'s best quarter',
      `<p>The purchasing manager switched to a new foam supplier at <strong>8% lower price</strong>. Her bonus is based on the foam price variance, and this quarter it's strongly favourable. She's delighted.</p>
       <p>Production is not. The new foam tears more easily when cut and has small density variations. Here's the monthly variance report since the switch:</p>`),
    FS({title:'Average monthly variances since the switch', rows:[
      ['Foam price variance', 1650],
      ['Foam usage variance (more offcuts and rejects)', -2400],
      ['Labour efficiency (slower cutting, more trimming)', -900],
      ['Scrap and rework of finished covers', -1100],
      ['Complaint credits and returns (mattresses losing shape)', -1800],
      ['Net effect per month', -4550, 'total']
    ], note:'Positive = favourable, negative in brackets = adverse. Over a year: about $54,600 worse, almost the whole net profit.'}),
    Q('What is the main lesson here?',[
      {text:'The purchasing manager made a mistake and should be replaced', why:'She did exactly what her bonus rewarded. The problem is the measure, not the person.'},
      {text:'Variances must be read together. A favourable price variance can cause bigger adverse variances elsewhere.'},
      {text:'Price variances don\'t matter', why:'They do. But only in context with usage, labour and quality.'},
      {text:'The usage standard should be raised to absorb the new foam', why:'That would hide the problem rather than fix it.'}
    ],1,'Judge the supplier on total cost, including usage, labour, scrap and returns, not just the invoice price. Change the purchasing bonus to reflect total material cost per good unit produced.'),
    K('What to do now',
      `<ul>
        <li>Run a trial: back to the old foam for one month, and compare total cost per good mattress.</li>
        <li>Give new suppliers a qualification trial with usage and scrap tracked, before switching. ISO 13485 requires supplier evaluation anyway.</li>
        <li>Report variances as a set, so price gains and the costs they cause appear on the same page.</li>
       </ul>`)
  ]},
  {id:'quiz', label:'Quiz', kind:'quiz', title:'Check your understanding', blocks:[
    Q('Standard foam price is $200 per m³. You bought 50 m³ at $210. What is the price variance?',['$500 F','$500 A','$10 A','$10,500 A'],1,'(210 − 200) × 50 = $500, adverse because you paid more than standard.'),
    Q('Standard usage for 100 braces is 30 m of webbing. Actual use was 34 m. Standard price is $0.50 per m. Usage variance?',['$2 A','$4 A','$2 F','$17 A'],0,'(34 − 30) × $0.50 = $2 adverse.'),
    Q('Who usually owns the labour efficiency variance?',['Purchasing','Sales','Production supervisors','The bank'],2,'Efficiency is about hours used for the output achieved, which production manages.'),
    Q('Why might a favourable price variance be bad news?',[
      'It never is','Cheaper materials can raise usage, scrap, labour time and returns','It increases tax','It reduces inventory value'],1,'Always read price variances alongside usage and quality.'),
    Q('Which cost of quality category is usually the cheapest way to reduce total quality costs?',['Prevention','Appraisal','Internal failure','External failure'],0,'Preventing defects is cheaper than finding them, and much cheaper than customers finding them.'),
    Q('A slow month leaves overhead under-absorbed. What does this mean?',[
      'Overhead was overspent','Fewer hours were worked than planned, so less overhead was charged to products than was spent','Products were over-costed','The bank has absorbed the cost'],1,'The shortfall hits the P&L directly. Persistent under-absorption means the factory runs below its planned volume.')
  ]},
  {id:'apply', label:'Practice', kind:'apply', title:'Practise on a sample pack', blocks:[
    PACK('packB',5,'Pack B, page 5: variances'),
    Q('Which March variance is biggest, and who owns it?',['Foam price, purchasing','Foam usage $1,200 A, production','Webbing price, purchasing','Labour rate, HR'],1,'The new cutting pattern used 10% more foam. Production restored the old pattern on 2 April.'),
    Q('The labour efficiency variance is $270 A because two new operators are in training. How worried should you be?',['Very: replace them','Not much, if it improves over the next two months. Watch the trend.','Not at all','Cut their wages'],1,'One month is noise; a trend is a problem (Module 8).'),
    Q('Brace scrap of $180 came from a worn die. Which cost of quality category is it?',['Prevention','Appraisal','Internal failure','External failure'],2,'Defects caught before shipping are internal failures. Replacing dies on a schedule would be prevention.'),
    {t:'html',html:'<h3>Later, with your own report</h3><p class="small" style="color:var(--muted)">Optional. When you next read your own monthly report, use this checklist. Nothing here is shared or sent; ticks are saved only in this browser.</p>'},
    CHECK('m8-var','My monthly pack includes…',[
      'Actual cost compared with standard cost for the month\'s production',
      'Material variances split into price and usage',
      'Labour variances split into rate and efficiency, with overtime shown separately',
      'Under- or over-absorbed overhead',
      'Scrap and rework as separate lines, ideally with reasons',
      'Returns, credit notes and complaint costs by cause',
      'A note explaining any variance over a set threshold, with an owner and an action'
    ]),
    REPORT('Your Monday-morning question',
      `<p>Ask: <strong>"What did scrap, rework and returns cost us last month, in dollars?"</strong> If nobody knows, start there: it's the quickest win in most factories.</p>`),
    K('Takeaways',
      `<ul>
        <li>A standard cost is a target. Variances show where actual cost differs, and by how much.</li>
        <li>Split each variance into price and usage (or rate and efficiency) to find the owner.</li>
        <li>Read variances together. A saving in one place can cause a bigger cost in another.</li>
        <li>Make the cost of poor quality visible. What gets measured gets managed.</li>
       </ul>`)
  ]}
  ],
  warnings:[
    {sign:'Persistent adverse usage variance', meaning:'Waste, poor cutting patterns, bad materials, or a wrong BOM.', look:'Usage per unit by material and by shift.'},
    {sign:'Favourable price variance with rising usage or scrap', meaning:'Cheaper inputs are costing more downstream.', look:'Total cost per good unit before and after supplier changes.'},
    {sign:'Overtime rising while output is flat', meaning:'Labour efficiency falling: downtime, rework, or waiting for materials.', look:'Labour efficiency variance; overtime hours by department.'},
    {sign:'Under-absorbed overhead every month', meaning:'Factory running below planned volume. Unit costs are understated.', look:'Actual vs budgeted production hours.'},
    {sign:'Rising returns or complaint credits', meaning:'Quality problems reaching customers. Possible recall risk.', look:'External failure costs by product and cause.'}
  ],
  formulas:[
    {name:'Material price variance', f:'(Actual price − Standard price) × Actual quantity', ex:'(212 − 200) × 68.4 m³ = $821 A'},
    {name:'Material usage variance', f:'(Actual quantity − Standard quantity) × Standard price', ex:'(68.4 − 62.4) × $200 = $1,200 A'},
    {name:'Labour rate variance', f:'(Actual rate − Standard rate) × Actual hours', ex:'(3.05 − 3.00) × 1,290 = $65 A'},
    {name:'Labour efficiency variance', f:'(Actual hours − Standard hours) × Standard rate', ex:'(1,290 − 1,200) × $3.00 = $270 A'},
    {name:'Cost of quality', f:'Prevention + Appraisal + Internal failure + External failure', ex:'$8k + $34k + $41k + $18k = $101k (8.4% of revenue)'}
  ],
  glossary:[
    {term:'Standard cost', def:'The planned cost of a product: standard quantities at standard prices.'},
    {term:'Variance', def:'The difference between actual and standard cost.'},
    {term:'Favourable variance (F)', def:'Actual cost below standard.'},
    {term:'Adverse variance (A or U)', def:'Actual cost above standard. Also called unfavourable.'},
    {term:'Price variance', def:'The part of a material variance caused by paying a different price per unit.'},
    {term:'Usage variance', def:'The part of a material variance caused by using a different quantity than standard.'},
    {term:'Efficiency variance', def:'The part of a labour variance caused by working more or fewer hours than standard for the output.'},
    {term:'Under-absorbed overhead', def:'Overhead spent but not charged to products, because activity was below plan.'},
    {term:'Cost of quality', def:'Total cost of preventing, finding and fixing defects, including failures that reach customers.'},
    {term:'Corrective action (CAPA)', def:'A documented process to fix the cause of a quality problem and prevent it recurring.'}
  ]
});
})();
