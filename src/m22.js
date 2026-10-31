/* ===== Module 23 (file m22): Building a three-statement forecast (core, Part 6) ===== */
(function(){
const {K,TIP,FLAG,CASE,REPORT,Q,FS,FLIP,SORT,CHECK,W,money,signed,pct,kfmt} = BW.h;

/* Opening balance sheet = BraceWorks at 31 December (Module 1). */
const OPEN={cash:42000,ar:230000,inv:250000,prepay:13000,ppe:310000,ap:95000,accr:30000,tax:8500,od:120000,lt:100000,cap:250000,re:241500};
const LAST={rev:1200000,cos:822000,sga:246000,ebitda:132000,dep:38000,ebit:94000,int:14000,fx:6000,pbt:74000,taxe:18500,np:55500};
const BASE={g:5,gm:31.5,inf:4,dso:70,dio:106,dpo:63,capex:60000,loan:0,div:0};
const LIMIT=150000, MINCASH=20000, RATE=0.064, MATERIALS=0.46;

function model(d,mistake){
  const R=LAST.rev*(1+d.g/100);
  const cos=R*(1-d.gm/100), sga=LAST.sga*(1+d.inf/100);
  const ebitda=R-cos-sga, dep=LAST.dep+d.capex/16;              /* new equipment: half a year of an 8-year life */
  const ebit=ebitda-dep, int=RATE*(OPEN.od+OPEN.lt+d.loan/2);     /* interest on opening debt keeps the model free of circular formulas */
  const pbt=ebit-int, taxe=Math.max(0,pbt)*0.25, np=pbt-taxe;
  const ar=R*d.dso/365, inv=(cos+dep)*d.dio/365, ap=R*MATERIALS*d.dpo/365;
  const ppe=OPEN.ppe+d.capex-dep, lt=OPEN.lt-20000+d.loan;
  const dAR=OPEN.ar-ar, dInv=OPEN.inv-inv, dAP=ap-OPEN.ap;
  const cfo=np+dep+dAR+(mistake?0:dInv)+dAP, fcf=cfo-d.capex;
  const pre=OPEN.cash+fcf-20000+d.loan-d.div;                       /* cash before the overdraft moves */
  let od, cash;
  if(pre<MINCASH){ od=OPEN.od+(MINCASH-pre); cash=MINCASH; } else { const rep=Math.min(OPEN.od,pre-MINCASH); od=OPEN.od-rep; cash=pre-rep; }
  const re=OPEN.re+np-d.div, eq=OPEN.cap+re;
  const assets=cash+ar+inv+OPEN.prepay+ppe, liab=ap+OPEN.accr+OPEN.tax+od+lt;
  return {R,cos,sga,ebitda,dep,ebit,int,pbt,taxe,np,ar,inv,ap,ppe,lt,dAR,dInv,dAP,cfo,fcf,od,cash,re,eq,assets,liab,check:Math.round(assets-liab-eq),
    netDebt:od+lt-cash, nde:(od+lt-cash)/Math.max(1,ebitda), headroom:LIMIT-od+cash, overLimit:od>LIMIT};
}
BW.m22model=model;
const r0=v=>Math.round(v);
const m$=v=>money(r0(v));

function statements(x){
  const row=(l,a,b,cls)=>`<tr class="${cls||''}"><td>${l}</td>${a===null?'<td></td>':`<td class="v">${m$(a)}</td>`}<td class="v">${m$(b)}</td></tr>`;
  const is=`<table class="fs fm"><caption>Income statement</caption><thead><tr><th></th><th class="v">Last year</th><th class="v">Forecast</th></tr></thead><tbody>
    ${row('Revenue',LAST.rev,x.R)}${row('Cost of sales (excl. depreciation)',-LAST.cos,-x.cos)}${row('Selling and admin',-LAST.sga,-x.sga)}${row('EBITDA',LAST.ebitda,x.ebitda,'sub')}
    ${row('Depreciation',-LAST.dep,-x.dep)}${row('Operating profit',LAST.ebit,x.ebit,'sub')}${row('Interest',-LAST.int,-x.int)}${row('Currency losses',-LAST.fx,0)}${row('Profit before tax',LAST.pbt,x.pbt,'sub')}${row('Tax (25%)',-LAST.taxe,-x.taxe)}${row('Net profit',LAST.np,x.np,'tot lk-np')}</tbody></table>`;
  const bs=`<table class="fs fm"><caption>Balance sheet, 31 December</caption><thead><tr><th></th><th class="v">Opening</th><th class="v">Forecast</th></tr></thead><tbody>
    ${row('Cash',OPEN.cash,x.cash,'lk-cash')}${row('Receivables',OPEN.ar,x.ar)}${row('Inventory',OPEN.inv,x.inv)}${row('Prepayments',OPEN.prepay,OPEN.prepay)}${row('Equipment, net',OPEN.ppe,x.ppe)}${row('Total assets',845000,x.assets,'sub')}
    ${row('Payables',OPEN.ap,x.ap)}${row('Accrued expenses',OPEN.accr,OPEN.accr)}${row('Tax payable',OPEN.tax,OPEN.tax)}${row('Overdraft (limit $150,000)',OPEN.od,x.od,x.overLimit?'bad':'')}${row('Equipment loan',OPEN.lt,x.lt)}
    ${row('Share capital',OPEN.cap,OPEN.cap)}${row('Retained earnings',OPEN.re,x.re,'lk-np')}${row('Total liabilities and equity',845000,x.liab+x.eq,'tot')}</tbody></table>`;
  const cf=`<table class="fs fm"><caption>Cash flow statement</caption><thead><tr><th></th><th class="v">Forecast</th></tr></thead><tbody>
    <tr class="lk-np"><td>Net profit</td><td class="v">${m$(x.np)}</td></tr><tr><td>Add back depreciation</td><td class="v">${m$(x.dep)}</td></tr>
    <tr><td>Receivables (increase) / decrease</td><td class="v">${m$(x.dAR)}</td></tr><tr class="${x.mistake?'bad':''}"><td>Inventory (increase) / decrease</td><td class="v">${x.mistake?'left out':m$(x.dInv)}</td></tr><tr><td>Payables increase / (decrease)</td><td class="v">${m$(x.dAP)}</td></tr>
    <tr class="sub"><td>Cash from operations</td><td class="v">${m$(x.cfo)}</td></tr><tr><td>Equipment purchases</td><td class="v">${m$(-x.d.capex)}</td></tr><tr class="sub"><td>Free cash flow</td><td class="v">${m$(x.fcf)}</td></tr>
    <tr><td>Loan repayments</td><td class="v">${m$(-20000)}</td></tr><tr><td>New equipment loan</td><td class="v">${m$(x.d.loan)}</td></tr><tr><td>Dividends</td><td class="v">${m$(-x.d.div)}</td></tr><tr><td>Overdraft drawn / (repaid)</td><td class="v">${m$(x.od-OPEN.od)}</td></tr>
    <tr class="sub"><td>Change in cash</td><td class="v">${m$(x.cash-OPEN.cash)}</td></tr><tr><td>Opening cash</td><td class="v">${m$(OPEN.cash)}</td></tr><tr class="tot lk-cash"><td>Closing cash</td><td class="v">${m$(x.cash)}</td></tr></tbody></table>`;
  return {is,bs,cf};
}
const SL=[
  {k:'g',label:'Sales growth',min:-20,max:40,step:1,f:v=>(v>0?'+':'')+v+'%'},
  {k:'gm',label:'Gross margin before depreciation',min:25,max:38,step:0.5,f:v=>v.toFixed(1)+'%'},
  {k:'inf',label:'Selling and admin cost increase',min:-5,max:15,step:1,f:v=>v+'%'},
  {k:'dso',label:'Customers pay in (days)',min:40,max:120,step:1,f:v=>v+' days'},
  {k:'dio',label:'Stock held (days of cost of sales)',min:50,max:160,step:1,f:v=>v+' days'},
  {k:'dpo',label:'We pay suppliers in (days)',min:20,max:90,step:1,f:v=>v+' days'},
  {k:'capex',label:'Equipment purchases',min:0,max:200000,step:5000,f:v=>money(v)},
  {k:'loan',label:'New equipment loan',min:0,max:150000,step:5000,f:v=>money(v)},
  {k:'div',label:'Dividend to owners',min:0,max:80000,step:5000,f:v=>money(v)}
];
const PRESETS=[
  {label:'Base plan',d:BASE},
  {label:'Downturn',d:{...BASE,g:-10,gm:29.5,dso:80}},
  {label:'Big order, long terms',d:{...BASE,g:30,dso:95,dio:120}},
  {label:'Fund the machine properly',d:{...BASE,capex:120000,loan:100000}}
];

BW.add({
  id:'m22', minutes:55,
  title:'Building a three-statement forecast',
  subtitle:'The one advanced skill most GMs end up needing: a forecast where profit, balance sheet and cash are linked, so you can see what a plan does to the bank balance before you commit to it.',
  goals:[
    'Explain the three links that tie the income statement, balance sheet and cash flow together',
    'Pick the handful of assumptions that drive a manufacturer\'s forecast',
    'Build and read a linked forecast, and use the balance check to catch mistakes',
    'Stress-test a plan and find what breaks first: cash, the overdraft or a covenant',
    'Keep a model honest: inputs separate, no typed-in results, compared with actuals every month'
  ],
  sections:[
  {id:'why', label:'Why link them', kind:'learn', title:'Why a profit forecast isn\'t enough', blocks:[
    `<p>Most budgets stop at the income statement. That answers "will we make money?" but not "will we have the cash?", and Module 5 showed how a profitable factory runs out of cash. A <strong>three-statement forecast</strong> projects all three statements together, linked, so a change in one flows through the others.</p>
     <p>Banks ask for one before lending. Buyers and investors ask for one before paying. And it's the only honest way to answer questions like "can we take the Australian contract?" or "can we afford a dividend and the new machine?"</p>`,
    {t:'fig', title:'The three links', draw:function(w){
      const P=BW.viz.p, wide=w>=600; let g='';
      if(wide){ const bw=Math.min(178,(w-140)/3), y=64, xs=[10,(w-bw)/2,w-bw-10], h=96;
        const N=[['Income statement','profit for the year'],['Balance sheet','what you own and owe'],['Cash flow','how cash moved']];
        N.forEach((n,i)=>{ g+=P.node(xs[i],y,bw,h,P.nodeLines(bw,n[0],n[1]),i===1?'hl':''); });
        g+=P.arrow(xs[0]+bw,y+h/2,xs[1],y+h/2,{cls:'acc'})+P.lines((xs[0]+bw+xs[1])/2,y-34,['1 Net profit adds','to retained earnings'],'v-l','middle',12);
        g+=P.arrow(xs[1]+bw,y+h/2,xs[2],y+h/2)+P.lines((xs[1]+bw+xs[2])/2,y-34,['2 Changes in assets','and debts drive cash'],'v-l','middle',12);
        g+=`<path d="M${P.f(xs[2]+bw/2)},${y+h} C${P.f(xs[2]+bw/2)},${y+h+60} ${P.f(xs[1]+bw/2)},${y+h+60} ${P.f(xs[1]+bw/2)},${y+h+8}" class="v-edge acc" fill="none"/>`+P.head(xs[1]+bw/2,y+h+2,-Math.PI/2,'acc')+P.txt((xs[1]+xs[2]+bw)/2,y+h+64,'3 Closing cash becomes the balance sheet\'s cash','v-l','middle');
        g+=P.arrow(xs[0]+bw/2,y+h,xs[0]+bw/2,y+h+30)+P.txt(xs[0]+bw/2,y+h+44,'net profit also starts the cash flow','v-l','middle');
        return P.svg(w,y+h+80,'Net profit flows to retained earnings, balance sheet changes drive the cash flow, and closing cash returns to the balance sheet.',g); }
      const bw=w-40, xs=20; const N=[['Income statement','profit for the year'],['Balance sheet','what you own and owe'],['Cash flow','how cash moved']]; const h=60, gap=58;
      N.forEach((n,i)=>{ g+=P.node(xs,10+i*(h+gap),bw,h,P.nodeLines(bw,n[0],n[1]),i===1?'hl':''); });
      g+=P.arrow(w/2,10+h,w/2,10+h+gap)+P.txt(w/2+8,10+h+gap/2+4,'1 Net profit → retained earnings','v-l','start');
      g+=P.arrow(w/2,10+2*h+gap,w/2,10+2*h+2*gap)+P.txt(w/2+8,10+2*h+gap*1.5+4,'2 Changes drive cash flow','v-l','start');
      g+=`<path d="M${xs+bw-10},${10+2*(h+gap)+h/2} C${w+8},${10+2*(h+gap)} ${w+8},${10+h+gap+h} ${xs+bw-10},${10+h+gap+h/2}" class="v-edge acc" fill="none"/>`+P.txt(xs+bw-14,10+2*(h+gap)+h+18,'3 Closing cash → balance sheet','v-l','end');
      return P.svg(w,10+3*h+2*gap+30,'Net profit flows to retained earnings, balance sheet changes drive the cash flow, and closing cash returns to the balance sheet.',g);
    }, caption:'If all three links are built right, total assets always equal liabilities plus equity. That gives every forecast a built-in error check.'},
    {t:'tbl', head:['Link','In words','BraceWorks last year'], rows:[
      ['<strong>1. Profit to equity</strong>','Net profit, less dividends, is added to retained earnings on the balance sheet.','$241,500 retained earnings already include last year\'s $55,500 profit'],
      ['<strong>2. Balance sheet to cash flow</strong>','Every change in a balance sheet line (receivables, stock, payables, equipment, loans) is a cash movement.','Receivables up $30,000 = $30,000 less cash'],
      ['<strong>3. Cash flow to balance sheet</strong>','Opening cash plus the year\'s cash flow is the closing cash on the balance sheet.','$49,000 − $7,000 = $42,000']
    ]},
    K('The balance check',
      `<p>Add up the forecast balance sheet. If assets don't equal liabilities plus equity, something is missing from the cash flow or the balance sheet. The difference usually equals the thing you forgot. Good models show this check on every page, and it must read zero.</p>`)
  ]},
  {id:'drivers', label:'The drivers', kind:'learn', title:'A few assumptions drive everything', blocks:[
    `<p>A forecast is only as good as its assumptions. For a manufacturer, nine of them do most of the work. Each one has a lesson behind it earlier in the course.</p>`,
    {t:'tbl', head:['Driver','What it sets','BraceWorks base','Learn it'], rows:[
      ['Sales growth','Revenue','+5%','Modules 12, 15'],
      ['Gross margin before depreciation','Cost of sales','31.5%','Modules 3, 6'],
      ['Selling and admin cost increase','Overheads','+4%','Module 15'],
      ['Customer days (DSO)','Receivables','70 days','Modules 10, 16'],
      ['Stock days','Inventory','106 days','Modules 7, 16'],
      ['Supplier days','Payables','63 days of materials','Module 16'],
      ['Equipment purchases','Equipment and depreciation','$60,000','Module 14'],
      ['New borrowing','Loans and interest','none','Module 20'],
      ['Dividends','Retained earnings and cash','none','Module 20']
    ]},
    TIP('Fixed rules the model uses',
      `<p>To keep the forecast simple and free of circular formulas: interest is 6.4% of the opening debt (plus half a year on any new loan); tax is 25% of profit; new equipment is depreciated over 8 years, with half a year in the first year; the loan repays $20,000 a year; and the <strong>overdraft is the balancing item</strong>. If cash would fall below $20,000, the overdraft is drawn; any cash above that repays it.</p>`),
    SORT('Input or calculated?',['Input (an assumption you type)','Calculated (a formula)'],[
      {text:'Customer days: 70', a:0, why:'An assumption you choose, based on your aging and customer terms.'},
      {text:'Receivables at year-end', a:1, why:'Calculated: revenue × customer days ÷ 365.'},
      {text:'Interest rate: 6.4%', a:0, why:'From the loan agreement.'},
      {text:'Retained earnings', a:1, why:'Opening retained earnings + net profit − dividends.'},
      {text:'Closing cash', a:1, why:'Comes out of the cash flow. Never type it in.'},
      {text:'Equipment purchases: $60,000', a:0, why:'A decision, so it\'s an input.'},
      {text:'Overdraft at year-end', a:1, why:'The balancing item: whatever is needed to keep the minimum cash.'}
    ]),
    FLAG('Typed-in results',`<p>The most common modelling error is typing a number where a formula belongs: a closing cash figure "to make it balance", or a receivables number copied from last year. The model then stops responding to its assumptions. In a good model, every number in the statements traces back to an input.</p>`)
  ]},
  {id:'build', label:'Build the forecast', kind:'play', title:'BraceWorks\' forecast for next year', blocks:[
    `<p>This is a working three-statement model, opening from BraceWorks' real balance sheet at 31 December. Move the drivers and watch all three statements change together. The balance check at the top should always read zero.</p>`,
    W('Three-statement forecast', function(el,ctx){
      const S=ctx.state; S.m22=S.m22||{d:{...BASE},mistake:false};
      el.innerHTML=`<div class="fm-presets" role="group" aria-label="Scenarios"></div><div class="fm-ctrls"></div>
        <label class="fm-mis"><input type="checkbox" id="${ctx.uid('mis')}"> Make a common mistake: leave the inventory change out of the cash flow</label>
        <div class="fm-out"></div>`;
      const pr=el.querySelector('.fm-presets'), cw=el.querySelector('.fm-ctrls'), out=el.querySelector('.fm-out'), mis=el.querySelector('input[type=checkbox]');
      mis.checked=!!S.m22.mistake;
      const draw=()=>{ const d=S.m22.d, x=model(d,S.m22.mistake); x.d=d; x.mistake=S.m22.mistake; const t=statements(x);
        const ok=x.check===0;
        out.innerHTML=`<div class="stats">${ctx.ui.stat('Balance check',ok?'$0 ✓':money(x.check),ok?'good':'bad',ok?'assets = liabilities + equity':'something is missing')}${ctx.ui.stat('Year-end cash',m$(x.cash),x.cash<MINCASH?'bad':'')}${ctx.ui.stat('Overdraft used',m$(x.od),x.overLimit?'bad':x.od>LIMIT*0.85?'warn':'good',x.overLimit?`over the $150,000 limit by ${m$(x.od-LIMIT)}`:`${m$(LIMIT-x.od)} still available`)}${ctx.ui.stat('Net debt ÷ EBITDA',x.ebitda>0?x.nde.toFixed(2)+'×':'n/a',x.nde>2.5||x.ebitda<=0?'bad':x.nde>2?'warn':'good','covenant: no more than 2.5×')}</div>
          ${!ok?`<div class="msg bad" style="margin-top:10px"><strong>The balance sheet is out by ${money(Math.abs(x.check))}.</strong> That's exactly the inventory change left out of the cash flow (${m$(x.dInv)}). This is why every model needs a balance check.</div>`:''}
          <div class="fm-grid"><div class="fs-wrap">${t.is}</div><div class="fs-wrap">${t.bs}</div><div class="fs-wrap">${t.cf}</div></div>
          <p class="w-hint">Highlighted rows show the links: net profit feeds retained earnings and starts the cash flow; closing cash becomes the balance sheet's cash.</p>`; };
      const build=()=>{ cw.innerHTML=''; ctx.ui.sliders(cw,SL.map(s=>({...s,v:S.m22.d[s.k]})),v=>{ Object.assign(S.m22.d,v); ctx.save(); draw(); },ctx.uid); };
      PRESETS.forEach(p=>{ const b=document.createElement('button'); b.type='button'; b.textContent=p.label; b.onclick=()=>{ S.m22.d={...p.d}; ctx.save(); build(); pr.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',String(x===b))); }; b.setAttribute('aria-pressed',String(JSON.stringify(p.d)===JSON.stringify(S.m22.d))); pr.appendChild(b); });
      mis.onchange=()=>{ S.m22.mistake=mis.checked; ctx.save(); draw(); };
      build();
    }),
    TIP('Things to try',
      `<ul><li><strong>Big order, long terms:</strong> sales up 30% with 95-day terms. Profit jumps, and the overdraft goes over its limit. That's overtrading, the Module 5 lesson, now visible a year ahead.</li><li><strong>Fund the machine properly:</strong> a $120,000 machine paid from the overdraft, then with a $100,000 loan. Same profit, very different headroom.</li><li>Find the customer-days figure at which BraceWorks no longer needs its overdraft at all.</li></ul>`)
  ]},
  {id:'scen', label:'Scenarios', kind:'learn', title:'Stress-test the plan: what breaks first?', blocks:[
    `<p>A single forecast is a guess. Three forecasts (a base case, a downside and an upside) show you the range, and which limit you'll hit first. Banks call this a stress test.</p>`,
    {t:'live', render(box){
      const sc=[['Base plan',BASE],['Downturn: sales −10%, margin −2 points, customers 10 days slower',{...BASE,g:-10,gm:29.5,dso:80}],['Growth: sales +25%, customers 15 days slower, more stock',{...BASE,g:25,dso:85,dio:115}],['Growth, funded: as above, plus a $60,000 loan',{...BASE,g:25,dso:85,dio:115,loan:60000}]];
      const rows=sc.map(([n,d])=>{ const x=model(d); return [n,m$(x.R),m$(x.np),m$(x.cfo),m$(x.od)+(x.overLimit?' ⚠':''),x.ebitda>0?x.nde.toFixed(2)+'×':'n/a', x.overLimit?'<strong style="color:var(--red)">Overdraft limit</strong>':x.nde>2.5?'<strong style="color:var(--red)">Covenant</strong>':x.od>LIMIT*0.85?'<span style="color:var(--amber)">Little headroom</span>':'<span style="color:var(--good)">Nothing</span>']; });
      box.innerHTML=BW.ui.table(['Scenario','Revenue','Net profit','Cash from operations','Overdraft at year-end','Net debt ÷ EBITDA','Breaks first'],rows,{num:[1,2,3,4,5]});
    }},
    K('What the table says',
      `<p>Each bad case breaks a different limit. The <strong>growth</strong> case makes the most profit, yet it's the one that breaks the overdraft limit: growth needs working capital before it produces cash. The <strong>downturn</strong> stays inside the overdraft, because receivables and stock shrink with sales, but EBITDA falls so far that net debt reaches about 3 times EBITDA and breaks the bank covenant. Funding the growth with a loan agreed in advance fixes the first problem; for the second, you'd need cost cuts ready, or a covenant reset agreed with the bank. Have both conversations <em>before</em> you need them.</p>`),
    Q('In the stress test, why does the growth case strain cash more than the downturn?',['Growth always reduces profit','More sales mean more receivables and stock to finance before customers pay','The downturn includes a tax refund','Interest rates rise with growth'],1,'Working capital grows with sales. In a downturn it shrinks and releases cash, which is why some businesses look cash-rich in a recession and run dry in a boom.'),
    Q('Which limit should a GM check first in every scenario?',['The share price','The overdraft limit and loan covenants, because breaching them hands control to the bank','Employee numbers','Gross margin only'],1,'Profit shows whether a plan is worth doing. Headroom and covenants show whether you can survive it.')
  ]},
  {id:'monthly', label:'Keeping it honest', kind:'learn', title:'From annual model to monthly management tool', blocks:[
    `<p>An annual forecast answers big questions. To run the business you need it monthly, and then compared with what actually happened.</p>`,
    {t:'tbl', head:['Step','What to do'], rows:[
      ['<strong>Go monthly</strong>','Split revenue by month using last year\'s pattern. Payroll, rent and loan repayments go in the months they\'re paid; the 13th-month pay in December (Module 2).'],
      ['<strong>Link to the 13-week cash forecast</strong>','The first three months of the model should agree with the weekly cash forecast (Module 10). If they don\'t, find out why.'],
      ['<strong>Compare every month</strong>','Put actuals beside the forecast for each statement. Explain the big differences, and update the assumptions that turned out wrong (Module 15).'],
      ['<strong>Roll forward</strong>','Each quarter, extend the forecast so it always looks 12 months ahead, not just to December.'],
      ['<strong>Keep versions</strong>','Save each version with a date, and write down what changed and why. When the bank asks why the forecast moved, you\'ll have the answer.']
    ]},
    CHECK('m22-hygiene','A model you can trust',[
      'All assumptions on one input sheet, in blue on yellow, with a note on where each came from',
      'No typed-in numbers in the statements: every figure is a formula',
      'A balance check that reads zero, shown on every sheet',
      'A cash check: closing cash on the cash flow equals cash on the balance sheet',
      'Overdraft limit and covenant tests calculated automatically',
      'At least three scenarios: base, downside and upside',
      'A version date and a change log',
      'Actuals compared with forecast every month'
    ]),
    TIP('The template does this for you',`<p>The <strong>three-statement forecast</strong> Excel template (in the Practice tab and the Toolkit) follows every rule on this list, with BraceWorks' figures filled in. Replace them with your own.</p>`)
  ]},
  {id:'case', label:'Case: the model that lied', kind:'case', title:'The model that forgot working capital', blocks:[
    CASE('A beautiful spreadsheet',
      `<p>To win a $350,000 distribution contract, BraceWorks' sales manager built a forecast: sales up 30%, profit up $60,000, and "cash will follow". The owner was impressed and signed. The bank was told the overdraft wouldn't be needed.</p>
       <p>Six months later the overdraft was at its limit and the bank wanted a meeting. The forecast had no balance sheet: it never asked how much extra stock and receivables the new contract needed.</p>`),
    {t:'live', render(box){ const b=model(BASE), g=model({...BASE,g:30,dso:95,dio:120});
      box.innerHTML=BW.ui.table(['','Base plan','Sales +30%, 95-day terms'],[['Net profit',m$(b.np),m$(g.np)],['Receivables at year-end',m$(b.ar),m$(g.ar)],['Inventory at year-end',m$(b.inv),m$(g.inv)],['Cash from operations',m$(b.cfo),m$(g.cfo)],['Overdraft needed',m$(b.od),m$(g.od)]],{num:[1,2]})+'<p class="w-hint">Worked out with the model from this module.</p>'; }},
    Q('What should the GM have asked before signing?',['Is the profit margin right?','Show me the balance sheet and cash flow too: how much extra stock and receivables does this need, and how will we fund them?','Can we raise prices later?','Who will sell it?'],1,'A profit forecast without a balance sheet hides the working capital the plan needs. Always ask for all three statements.'),
    REPORT('Your Monday-morning request',`<p>Ask finance for next year's budget as <strong>three linked statements</strong>, with a balance check and a downside scenario. If the budget is only an income statement, ask for the balance sheet and cash flow to be added before the next board or bank meeting.</p>`)
  ]},
  {id:'quiz', label:'Quiz', kind:'quiz', title:'Check your understanding', blocks:[
    Q('Which link connects the income statement to the balance sheet?',['Revenue becomes receivables','Net profit, less dividends, adds to retained earnings','Depreciation becomes cash','Tax becomes equity'],1,'Profit belongs to the owners, so it increases equity through retained earnings.'),
    Q('The forecast balance sheet is out by exactly $45,000. Inventory is forecast to rise by $45,000. What\'s the likely cause?',['A typing error in sales','The inventory increase was left out of the cash flow','The tax rate is wrong','Depreciation is too high'],1,'An imbalance usually equals the missing item. That\'s what makes the balance check so useful.'),
    Q('Why use the overdraft as the balancing item?',['Banks require it','Cash comes out of the model, so something must flex to fund a shortfall or absorb a surplus, and the overdraft is what does that in real life','It keeps interest low','It avoids tax'],1,'In a real business, a cash gap is covered by the overdraft. The model mirrors that, and shows when the limit would be breached.'),
    Q('Sales are forecast to grow 25%. What normally happens to cash in the first year?',['It grows 25% too','It\'s often squeezed, because receivables and stock grow before customers pay','It stays the same','It always improves'],1,'Growth consumes working capital first. Plan the funding before you grow.'),
    Q('Which of these should never be typed into a forecast\'s statements?',['The interest rate','Closing cash','Customer days','The tax rate'],1,'Closing cash is a result. Typing it in breaks the model\'s links.'),
    Q('What makes a downside scenario useful?',['It makes the base case look good','It shows which limit (cash, overdraft or covenant) you hit first if things go wrong, so you can prepare','Banks don\'t read them','It replaces the budget'],1,'The point is to know your breaking point before you reach it.')
  ]},
  {id:'apply', label:'Practice', kind:'apply', title:'Build your own', blocks:[
    `<p>Download the three-statement forecast template. It opens with BraceWorks' balance sheet and assumptions, forecasts three years, and checks itself. Replace the yellow cells with your own figures from last year's audited accounts.</p>`,
    {t:'live', render(box){
      const f='three-statement-forecast.xlsx', d=(BW.tmplData||{})[f];
      box.innerHTML=`<div class="tmpl" style="max-width:520px"><div class="tmpl-h"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M9 9v11M15 9v11"/></svg><div><h4>Three-statement forecast</h4><div class="tmpl-f">${f}</div></div></div><p>Three years of linked income statement, balance sheet and cash flow, with an overdraft that balances automatically, covenant tests and a balance check.</p><div class="tmpl-a"><button type="button" class="btn small" ${d?'':'disabled'}>Download .xlsx</button><span class="small tmpl-s" role="status" aria-live="polite"></span></div></div>`;
      const b=box.querySelector('button'), st=box.querySelector('.tmpl-s');
      b.onclick=()=>{ const bin=atob(d), u=new Uint8Array(bin.length); for(let i=0;i<bin.length;i++) u[i]=bin.charCodeAt(i); b.disabled=true;
        BW.saveFile(f,new Blob([u],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}),t=>{ st.textContent=t; }).finally(()=>{ b.disabled=false; }); };
    }},
    CHECK('m22-apply','Your own forecast',[
      'Opening balance sheet typed in from last year\'s accounts, and it balances',
      'Nine drivers set, each with a note on where it came from',
      'Balance check reads zero in every year',
      'Downside scenario run: I know what breaks first',
      'Forecast shared with finance, and actuals compared each month'
    ])
  ]}
  ],
  warnings:[
    {sign:'A budget or forecast with no balance sheet or cash flow', meaning:'The working capital and funding a plan needs are invisible.', look:'Ask for all three statements, linked, with a balance check.'},
    {sign:'A forecast that doesn\'t balance, or balances with a "plug"', meaning:'Something is missing or typed in; the cash figure can\'t be trusted.', look:'Balance check; trace closing cash back to its inputs.'},
    {sign:'Only one scenario', meaning:'Nobody knows what breaks first if sales or collections slip.', look:'Downside case: overdraft headroom and covenants.'}
  ],
  formulas:[
    {name:'Receivables (forecast)', f:'Revenue × customer days ÷ 365', ex:'$1,260,000 × 70 ÷ 365 = $241,644'},
    {name:'Retained earnings (forecast)', f:'Opening retained earnings + net profit − dividends', ex:'$241,500 + profit − dividends'},
    {name:'Balance check', f:'Total assets − (total liabilities + equity) = 0', ex:'Any difference points to a missing link'}
  ],
  glossary:[
    {term:'Three-statement forecast', def:'A forecast of the income statement, balance sheet and cash flow together, linked so a change in one flows through the others.'},
    {term:'Driver', def:'An assumption that determines many numbers in a forecast, such as sales growth or customer days.'},
    {term:'Balancing item', def:'The line in a forecast that flexes to make cash work, usually the overdraft or revolving credit line.'},
    {term:'Balance check', def:'A test that total assets equal total liabilities plus equity; any difference reveals an error.'},
    {term:'Scenario', def:'A complete forecast under a different set of assumptions, such as a downturn or a big new order.'},
    {term:'Stress test', def:'Running a forecast under bad but plausible assumptions to see which limit is breached first.'},
    {term:'Circular reference', def:'A formula that depends on its own result, such as interest on an overdraft that depends on interest. Models avoid it, for example by charging interest on opening balances.'}
  ]
});
})();
