/* ===== Module 26: Group treasury, cash and currency across countries (optional: growing into a multinational) ===== */
(function(){
const {K,TIP,FLAG,CASE,REPORT,Q,FS,FLIP,SORT,CHECK,W,money,signed,pct,kfmt} = BW.h;
const m$=v=>money(Math.round(v));
const E=(tag,cls,html)=>{ const e=document.createElement(tag); if(cls) e.className=cls; if(html!=null) e.innerHTML=html; return e; };

BW.add({
  id:'m26', minutes:55,
  title:'Group treasury: cash and currency across countries',
  subtitle:'With five companies and five currencies, cash sits in the wrong place, payments cross borders in both directions, and currency moves can wipe out a year\'s margin. How a growing group sees, moves and protects its cash.',
  goals:[
    'Get weekly visibility of cash in every company, and use surplus cash before borrowing',
    'Explain cash pooling and netting, and the local rules that limit them',
    'Write a currency hedging policy that protects margins without turning into a bet',
    'Manage a small group of relationship banks, facilities, guarantees and covenants'
  ],
  sections:[
  /* ---------------------------------------------------------------- 1 */
  {id:'visibility', label:'Where is the cash?', kind:'play', title:'Where is our cash?', blocks:[
    `<p>In a group, cash is rarely where it's needed. One company has a healthy surplus earning little interest, while another runs an expensive overdraft. Without a weekly view of every bank account, nobody notices. Here's the BraceWorks group on the last Friday of the month, all in US dollar equivalents.</p>`,
    W('Cash across the group', function(el,ctx){
      const ENT=[['Philippines',2100000,0.025],['Germany',900000,0.015],['United States',1400000,0.03],['Australia',400000,0.025],['Vietnam',-1200000,0.09]];
      const IC=0.06; let lend=false;
      const sg=E('div'), chart=E('div'), out=E('div'); el.append(sg,chart,out);
      ctx.ui.seg(sg,[{v:false,label:'Each company on its own'},{v:true,label:'Lend Manila\'s surplus to Vietnam'}],false,v=>{ lend=v; draw(); });
      sg.style.marginBottom='10px';
      const plot=BW.cols(chart,{series:[{name:'Bank balance',cls:'s1'}],label:'Bank balance by company',fmt:v=>kfmt(v),height:160});
      function draw(){
        const bal=ENT.map(e=>e[1]); if(lend){ bal[0]-=1200000; bal[4]+=1200000; }
        plot(ENT.map((e,i)=>({label:e[0],v:[bal[i]]})));
        const net=bal.reduce((a,b)=>a+b,0);
        const intr=ENT.reduce((t,e,i)=>t+(bal[i]>=0?bal[i]*e[2]:bal[i]*e[2]),0);
        const base=ENT.reduce((t,e)=>t+e[1]*e[2],0);
        out.innerHTML=`<div class="stats" style="margin-top:10px">${ctx.ui.stat('Group net cash',m$(net),'','the same either way')}${ctx.ui.stat('Group net interest a year',m$(intr),intr<0?'bad':'good')}${ctx.ui.stat('Saving',lend?m$(intr-base)+' a year':'–',lend?'good':'')}</div>
          <p class="w-hint" style="margin-top:8px">${lend?`Vietnam repays its 9% overdraft with a $1.2 million loan from Manila. The group stops paying the bank 9% to borrow its own money while earning 2.5% on it. Inside the group, Vietnam pays Manila an arm's-length rate (say ${pct(IC,0)}), documented for transfer pricing (Module 24). Withholding tax may apply to the interest (Module 19), and some countries require cross-border loans to be registered: Vietnam for loans of more than one year (with the State Bank of Vietnam), China with its foreign exchange regulator.`:`The group has $${(net/1e6).toFixed(1)} million of net cash, yet Vietnam pays 9% on a $1.2 million overdraft while Manila earns 2.5% on its surplus. Try lending the surplus.`}</p>`;
      }
      draw();
    }),
    K('Visibility comes first',
      `<p>Before any pooling or hedging, get one report every week: cash and borrowing by company, by bank and by currency, with available headroom. Most banks offer read-only access across countries, and an ERP or treasury tool can collect it. You can't manage cash you can't see.</p>`)
  ]},
  /* ---------------------------------------------------------------- 2 */
  {id:'netting', label:'Pooling and netting', kind:'play', title:'Pooling and netting: moving less money', blocks:[
    `<p>Two tools stop a group's cash going round in circles.</p>`,
    {t:'tbl', head:['Tool','How it works','Watch out for'], rows:[
      ['<strong>Physical cash pooling</strong>','Balances in group accounts are swept into one header account every day, creating intercompany loans','Each sweep is a loan: needs arm\'s-length interest, documentation, and may be restricted across borders'],
      ['<strong>Notional pooling</strong>','Cash stays in each account, but the bank calculates interest on the combined balance','Not offered in every country; banks need cross-guarantees'],
      ['<strong>Intercompany netting</strong>','Once a month, all amounts group companies owe each other are offset, and each company makes or receives one net payment','Needs agreed balances (Module 25) and a fixed netting date; some countries limit netting of trade payments']
    ]},
    `<p>Here is one month of BraceWorks' intercompany trade, in thousands of US dollar equivalents. Switch on netting and watch what happens to the payments.</p>`,
    W('Monthly intercompany netting', function(el,ctx){
      const N=[{k:'PH',t:'Philippines',c:'USD'},{k:'DE',t:'Germany',c:'EUR'},{k:'US',t:'United States',c:'USD'},{k:'AU',t:'Australia',c:'AUD'},{k:'VN',t:'Vietnam',c:'VND'}];
      const F=[['DE','PH',1200],['PH','DE',450],['US','PH',900],['PH','US',300],['AU','PH',300],['PH','VN',700],['VN','PH',650]];
      const cur=k=>N.find(n=>n.k===k).c;
      const net={}; N.forEach(n=>net[n.k]=0); F.forEach(([a,b,v])=>{ net[a]-=v; net[b]+=v; });
      let mode='gross';
      const sg=E('div'), box=E('div','nt'), out=E('div'); el.append(sg,box,out);
      ctx.ui.seg(sg,[{v:'gross',label:'Every invoice paid separately'},{v:'net',label:'Monthly netting'}],'gross',v=>{ mode=v; draw(); });
      sg.style.marginBottom='8px';
      BW.viz.mount(box,function(w){ const P=BW.viz.p; const cx=w/2, cy=150, R=Math.min(w/2-70,130);
        const pos={}; N.forEach((n,i)=>{ const a=-Math.PI/2+i*2*Math.PI/N.length; pos[n.k]=[cx+R*Math.cos(a),cy+R*Math.sin(a)]; });
        let g=`<defs><marker id="ntA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0L10,5L0,10z" fill="var(--s2)"/></marker><marker id="ntB" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0L10,5L0,10z" fill="var(--s3)"/></marker></defs>`;
        const line=(x1,y1,x2,y2,off,cls,mk,lab)=>{ const dx=x2-x1, dy=y2-y1, L=Math.hypot(dx,dy), ux=dx/L, uy=dy/L, nx=-uy*off, ny=ux*off, r=30;
          const a=[x1+ux*r+nx,y1+uy*r+ny], b=[x2-ux*r+nx,y2-uy*r+ny];
          return `<line x1="${P.f(a[0])}" y1="${P.f(a[1])}" x2="${P.f(b[0])}" y2="${P.f(b[1])}" class="${cls}" marker-end="url(#${mk})"/>`+(lab?P.txt((a[0]+b[0])/2+nx*1.6,(a[1]+b[1])/2+ny*1.6+4,lab,'v-l'):''); };
        g+='<g class="nt-g">'+F.map(([a,b,v])=>{ const two=F.some(x=>x[0]===b&&x[1]===a); return line(pos[a][0],pos[a][1],pos[b][0],pos[b][1],two?9:0,'nt-l g','ntA',w>=480?String(v):''); }).join('')+'</g>';
        g+='<g class="nt-n">'+N.map(n=>{ const v=net[n.k]; return line(...(v<0?[pos[n.k][0],pos[n.k][1],cx,cy]:[cx,cy,pos[n.k][0],pos[n.k][1]]),0,'nt-l n','ntB',w>=480?String(Math.abs(v)):''); }).join('')+
          `<circle cx="${cx}" cy="${cy}" r="30" class="v-node hl"/>`+P.txt(cx,cy-2,'Netting','v-t')+P.txt(cx,cy+13,'centre','v-s')+'</g>';
        N.forEach(n=>{ const [x,y]=pos[n.k]; g+=`<circle cx="${P.f(x)}" cy="${P.f(y)}" r="28" class="v-node"/>`+P.txt(x,y-1,n.t.length>9&&w<480?n.k:n.t.replace('United States','US'),'v-t')+P.txt(x,y+13,n.c,'v-s'); });
        return P.svg(w,300,'Intercompany payments between five BraceWorks companies, gross or through a netting centre.',g);
      },()=>draw());
      function draw(){ box.classList.toggle('is-net',mode==='net');
        const gp=F.length, gv=F.reduce((t,x)=>t+x[2],0), gfx=F.filter(([a,b])=>cur(a)!==cur(b)).reduce((t,x)=>t+x[2],0);
        const np=N.filter(n=>net[n.k]!==0).length, nv=N.reduce((t,n)=>t+(net[n.k]<0?-net[n.k]:0),0), nfx=N.filter(n=>n.c!=='USD').reduce((t,n)=>t+Math.abs(net[n.k]),0);
        const P=mode==='net'?{p:np,v:nv,fx:nfx}:{p:gp,v:gv,fx:gfx}; const cost=x=>x.fx*1000*0.004*12+x.p*40*12;
        out.innerHTML=`<div class="stats" style="margin-top:8px">${ctx.ui.stat('Cross-border payments',P.p+' a month')}${ctx.ui.stat('Money moved',kfmt(P.v*1000)+' a month')}${ctx.ui.stat('Currency converted',kfmt(P.fx*1000)+' a month')}${ctx.ui.stat('Bank and currency costs',m$(cost(P))+' a year',mode==='net'?'good':'')}</div>
          <p class="w-hint" style="margin-top:8px">${mode==='net'?`Each company now makes or receives one payment. Money moved falls from ${kfmt(gv*1000)} to ${kfmt(nv*1000)} a month, and currency converted from ${kfmt(gfx*1000)} to ${kfmt(nfx*1000)}: about ${m$(cost({p:gp,fx:gfx})-cost(P))} a year saved, assuming a 0.4% currency spread and $40 a payment. Fewer conversions also means less exchange-rate noise in each company's profit.`:'Seven separate cross-border payments, most of them converting currency both ways. Germany and Manila pay each other, so do Manila and Vietnam.'}</p>`; }
    }),
    TIP('Check local rules before you pool or net',
      `<p>Pooling and netting create intercompany loans and offset payments across borders. Some countries restrict both, require central bank registration or reporting, or tax the interest. A bank's cash management team or your tax adviser can tell you what each country allows. Start with the countries that allow it, and settle the others with regular, documented payments.</p>`)
  ]},
  /* ---------------------------------------------------------------- 3 */
  {id:'fx', label:'Hedging policy', kind:'play', title:'A hedging policy, not a bet', blocks:[
    `<p>Module 17 showed one forward contract on one euro tender. At group scale, BraceWorks sells about €1 million a month in Europe and pays most of its costs in pesos and dong. A small move in the euro can wipe out a year's margin. The answer is a written <span class="term">hedging policy</span>, approved by the board, that sets out:</p>
     <ul>
      <li><strong>What</strong> to hedge: firm orders and forecast sales or purchases in foreign currency, never more than the real exposure.</li>
      <li><strong>How much</strong>, by time horizon: more for the next few months, which are near-certain, less further out.</li>
      <li><strong>With what</strong>: plain forward contracts and simple options only. No leveraged products, no contracts whose losses have no cap.</li>
      <li><strong>Who</strong> deals, who approves and who checks: three different people.</li>
      <li><strong>How it's reported</strong>: hedge positions and their market value to the board every month.</li>
     </ul>`,
    W('Hedging policy simulator', function(el,ctx){
      const F=1.10, MON=12, SALES=1000000; let v={h1:75,h2:50,h3:25}, short=false, ready=false;
      const top=E('div'), sg=E('div'), chart=E('div'), out=E('div'); el.append(top,sg,chart,out);
      ctx.ui.sliders(top,[{k:'h1',label:'Hedge months 1–3',min:0,max:100,step:5,v:75,f:x=>x+'%'},{k:'h2',label:'Hedge months 4–6',min:0,max:100,step:5,v:50,f:x=>x+'%'},{k:'h3',label:'Hedge months 7–12',min:0,max:100,step:5,v:25,f:x=>x+'%'}],x=>{ v=x; if(ready) draw(); },ctx.uid);
      ctx.ui.seg(sg,[{v:false,label:'Sales come in as forecast'},{v:true,label:'Sales come in 40% below forecast'}],false,x=>{ short=x; draw(); });
      sg.style.margin='10px 0';
      const BUD=SALES*MON*F;
      const plot=BW.cols(chart,{series:[{name:'Unhedged',cls:'mut'},{name:'With your hedges',cls:'s1'}],label:'Dollar revenue against budget under three euro scenarios',fmt:x=>(x>=0?'+':'')+kfmt(x),height:160});
      const SC=[['Euro falls to 0.95',0.95],['Euro flat at 1.10',1.10],['Euro rises to 1.25',1.25]];
      const hr=m=>(m<3?v.h1:m<6?v.h2:v.h3)/100;
      function run(end){ let un=0, he=0; for(let m=0;m<MON;m++){ const spot=F+(end-F)*(m+1)/MON, act=SALES*(short?0.6:1), H=SALES*hr(m); un+=act*spot; he+=act*spot+H*(F-spot); } return {un,he}; }
      function draw(){ const R=SC.map(s=>run(s[1])); plot(SC.map((s,i)=>({label:s[0],v:[R[i].un-BUD,R[i].he-BUD]})));
        const ru=Math.max(...R.map(r=>r.un))-Math.min(...R.map(r=>r.un)), rh=Math.max(...R.map(r=>r.he))-Math.min(...R.map(r=>r.he));
        const over=short&&[v.h1,v.h2,v.h3].some(h=>h>60);
        out.innerHTML=`<p class="w-hint" style="margin:4px 0 0">Bars show dollar revenue for the year against the $13.2 million budget (€12 million at 1.10).</p><div class="stats" style="margin-top:8px">${ctx.ui.stat('Range of outcomes, unhedged',m$(ru))}${ctx.ui.stat('Range with your hedges',m$(rh),rh<ru*0.7?'good':'')}</div>
          <p class="w-hint" style="margin-top:8px">${over?`<strong>Over-hedged.</strong> With sales 40% below forecast, some contracts are now bigger than the euros coming in. That part isn't a hedge any more: it's a bet on the euro, and if the euro rises it loses money with nothing to offset it. That's why policies hedge less of the uncertain later months, and why a hedge ratio over 100% of firm exposure is never allowed.`:`Hedging narrows the range of outcomes: you give up some upside when the euro rises in exchange for protection when it falls. It isn't about beating the market, it's about knowing your margin. Layering (more near-term, less later) keeps you protected while forecasts firm up.`}</p>`; }
      ready=true; draw();
    }),
    FLAG('When a hedge becomes a bet',
      `<p>Warning signs: contracts larger than the sales or purchases they cover; products with "accumulator", "knock-in" or "target redemption" in the name; hedges that make money in some scenarios and lose without limit in others; one person dealing and confirming their own trades; profits from "treasury" that the business can't explain.</p>`),
    Q('BraceWorks forecasts €12 million of sales next year. A bank offers a contract to sell €24 million forward "at a better rate, because you must sell double if the euro rises above 1.20". What should the policy say?',[
      'Accept: a better rate is a better hedge','Decline: it can commit the group to sell twice its real exposure, which is speculation, not hedging','Accept half','Accept if the CFO likes it'],1,
      'Leveraged structures like this can double your exposure exactly when the market moves against you. A good policy bans them outright.')
  ]},
  /* ---------------------------------------------------------------- 4 */
  {id:'banks', label:'Banks and facilities', kind:'learn', title:'Banks, facilities and guarantees for a group', blocks:[
    `<p>A single-company exporter usually has one bank. A five-country group needs a deliberate banking structure.</p>`,
    {t:'tbl', head:['Practice','Why'], rows:[
      ['<strong>Two to four relationship banks</strong> that cover your main countries','Competition on pricing, a back-up if one bank pulls back, and fewer accounts to control'],
      ['<strong>A facilities register</strong>: every loan, overdraft, guarantee and letter of credit line in the group, with limits, used amounts, expiry dates and covenants','So nothing expires unnoticed and headroom is known by country'],
      ['<strong>Covenants tested at group level</strong>, with a quarterly forecast of each test','A breach found at the year-end is too late to fix (Module 23)'],
      ['<strong>Guarantees between group companies</strong> recorded and approved by the board','A parent guarantee makes the parent liable for a subsidiary\'s debts'],
      ['<strong>Cross-default clauses</strong> understood','A default in one country can make loans elsewhere repayable immediately'],
      ['<strong>Deposits spread</strong> across strong banks','A bank failure can freeze cash for days or weeks']
    ]},
    K('Trapped cash and dividends home',
      `<p>Profit in a subsidiary isn't cash in Manila. Getting it home through dividends, royalties, service fees or loan repayments each has tax and legal effects (Module 24). Plan the route every year so cash doesn't pile up where it can't be used.</p>`),
    Q('A US bank loan to BraceWorks USA is guaranteed by the Philippine parent. What does that mean for the group?',[
      'Nothing: it\'s a US loan','If BraceWorks USA can\'t pay, the parent must: the parent\'s own assets and covenants are on the hook','The guarantee lowers group debt','Only the US bank\'s lawyers need to know'],1,
      'Guarantees put the parent on the hook. The loan is already in the group accounts; the guarantee makes the parent itself liable, and it may count in the parent\'s own covenant tests. Keep a register of every guarantee.')
  ]},
  /* ---------------------------------------------------------------- 5 */
  {id:'case', label:'Case: the clever hedge', kind:'case', title:'The hedge that made money, until it didn\'t', blocks:[
    CASE('Treasury becomes a profit centre',
      `<p>BraceWorks Europe's finance manager is proud: for two years, her currency contracts have made money every quarter, about $180,000 in total, which she reports as "treasury income". Looking closer, you find she has been selling euros forward for twice the expected sales, through a structure that pays a better rate as long as the euro stays below 1.15. Nobody else checks the contracts. The euro is now 1.13 and rising.</p>`),
    Q('What do you do first?',[
      {text:'Leave it: it has made money for two years', why:'Past gains say nothing about the exposure now. The structure loses most exactly when the euro rises.'},
      {text:'Get every open contract valued today, stop new deals, and have the board decide how to close or reduce the excess, under a written policy'},
      {text:'Fire the finance manager and say nothing', why:'Removing the person doesn\'t remove the contracts. The exposure still has to be measured and managed.'},
      {text:'Double the position to average down', why:'That is gambling with the company\'s money.'}],1,
      'First measure (mark the contracts to market), then stop new risk, then decide with the board. Afterwards: a hedging policy, limits, and separate people for dealing, approving and confirming.')
  ]},
  /* ---------------------------------------------------------------- 6 */
  {id:'quiz', label:'Quiz', kind:'quiz', title:'Check your understanding', blocks:[
    Q('Manila holds $2.1m at 2.5% while Vietnam owes the bank $1.2m at 9%. The simplest improvement is…',['Ignore it','Lend Manila\'s surplus to Vietnam inside the group at an arm\'s-length rate, if local rules allow','Move all cash to the US','Borrow more in Manila'],1,'The group stops paying a bank 9% to borrow its own money.'),
    Q('What does intercompany netting do?',['Removes tax on intercompany trade','Offsets what group companies owe each other so each makes or receives one net payment','Hides intercompany balances','Converts all balances to dollars'],1,'Fewer payments, less money moved, fewer currency conversions.'),
    Q('Which belongs in a hedging policy?',['Hedge 150% of forecast sales to be safe','Use any product the bank recommends','Hedge a set share of real exposure by time horizon, with plain forwards, separate dealing and approval, and monthly reporting','Let each country decide'],2,'A policy fixes what, how much, with what, who, and how it is reported.'),
    Q('Hedging mainly…',['Increases expected profit','Narrows the range of outcomes','Eliminates all currency risk forever','Is only for banks'],1,'You give up some upside for protection against the downside.'),
    Q('A loan in one country has a cross-default clause. What does that mean?',['A default anywhere in the group can make this loan repayable at once','The bank can\'t lend elsewhere','The loan has no covenants','Interest is fixed'],0,'Cross-default links your loans together. One breach can trigger many.')
  ]},
  /* ---------------------------------------------------------------- 7 */
  {id:'apply', label:'Practice', kind:'apply', title:'Treasury for your group', blocks:[
    `<p>Optional. Ticks are saved only in this browser.</p>`,
    CHECK('m26-treasury','In our group…',[
      'I get a weekly report of cash and borrowing by company, bank and currency',
      'Surplus cash in one company is used before another borrows, where local rules allow',
      'Intercompany balances are settled monthly, ideally by netting',
      'We have a board-approved hedging policy, and positions are reported monthly',
      'Dealing, approving and confirming hedges are done by different people',
      'A facilities register lists every loan, guarantee and covenant, with expiry dates',
      'We know which cash can\'t easily leave its country, and plan dividends home each year'
    ]),
    REPORT('Your Monday-morning question',
      `<p>Ask: <strong>"How much cash do we have in each country today, and how much is sitting idle while another company borrows?"</strong></p>`),
    K('Takeaways',
      `<ul>
        <li>See all the cash every week before trying to optimise it.</li>
        <li>Pooling and netting cut interest and currency costs; check local rules first.</li>
        <li>Hedge real exposures by a written policy, never more than 100% of them, with plain instruments.</li>
        <li>Treasury that "makes money" deserves the hardest questions.</li>
        <li>Know every facility, guarantee and covenant in the group, and when each expires.</li>
       </ul>`)
  ]}
  ],
  warnings:[
    {sign:'One company borrowing while another holds idle cash', meaning:'Paying interest to borrow the group\'s own money.', look:'Weekly cash report by company.'},
    {sign:'Hedges larger than the real exposure, or leveraged products', meaning:'Speculation dressed as hedging.', look:'Hedge positions against forecast exposure; product terms.'},
    {sign:'"Treasury income" that grows every year', meaning:'Possibly risk-taking nobody has approved.', look:'Who deals, who approves, who confirms; mark-to-market values.'},
    {sign:'Facilities expiring with no renewal plan', meaning:'A funding gap that appears suddenly.', look:'Facilities register with expiry dates.'}
  ],
  formulas:[
    {name:'Interest saved by lending inside the group', f:'Amount × (Overdraft rate − Deposit rate)', ex:'$1.2m × (9% − 2.5%) = $78,000 a year'},
    {name:'Hedged revenue', f:'Actual sales × spot rate + Hedged amount × (Forward rate − spot rate)', ex:'Shows why hedging more than actual sales creates a speculative position'}
  ],
  glossary:[
    {term:'Cash pooling', def:'Combining the balances of group bank accounts, physically by sweeping cash into one account or notionally for interest, so surplus cash offsets borrowing.'},
    {term:'Intercompany netting', def:'Offsetting what group companies owe each other so each makes or receives one net payment, usually monthly.'},
    {term:'Hedging policy', def:'A board-approved document setting what currency exposures are hedged, how much, with which instruments, by whom, and how positions are reported.'},
    {term:'Hedge ratio', def:'The share of a forecast or firm currency exposure covered by hedging contracts.'},
    {term:'Facilities register', def:'A list of every loan, overdraft, guarantee and credit line in a group, with limits, amounts used, expiry dates and covenants.'},
    {term:'Cross-default', def:'A loan clause that lets the lender demand repayment if the borrower defaults on another loan.'}
  ]
});
})();
