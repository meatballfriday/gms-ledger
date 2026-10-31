/* ===== Module 21 (file m24): The judgement calls behind the numbers ===== */
(function(){
const {K,TIP,FLAG,CASE,REPORT,Q,FS,FLIP,SORT,CHECK,W,money,signed,pct,kfmt,esc} = BW.h;
const m$=v=>money(Math.round(v));
const P=BW.viz.p;
const calm=()=>{ try{ return window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches; }catch(e){ return false; } };
const later=fn=>{ if(typeof requestAnimationFrame==='function') requestAnimationFrame(()=>setTimeout(fn,20)); else setTimeout(fn,30); };
const E=(tag,cls,html)=>{ const e=document.createElement(tag); if(cls) e.className=cls; if(html!=null) e.innerHTML=html; return e; };

/* ---------- animated column chart (HTML, so bars can glide between values) ---------- */
function cols(host,o){
  const series=o.series; const one=series.length===1;
  host.innerHTML=(one&&!o.legend?'':`<div class="ac-leg">${series.map(s=>`<span><i class="ac-b ${s.cls}" style="position:static"></i>${s.name}</span>`).join('')}</div>`)+'<div class="ac" role="img"></div><details class="v-data"><summary>Show the numbers</summary><div class="ac-tbl"></div></details>';
  const wrap=host.querySelector('.ac'), tbl=host.querySelector('.ac-tbl'); let cells=[];
  const fmt=o.fmt||(v=>kfmt(v));
  function build(groups){
    wrap.innerHTML=''; cells=groups.map(g=>{ const c=E('div','ac-g'); const plot=E('div','ac-plot'); plot.style.height=(o.height||170)+'px'; const z=E('div','ac-zero'); plot.appendChild(z);
      const bars=series.map((s,si)=>{ const b=E('div','ac-b '+s.cls+(one?' one':'')); if(!one) b.style.left=(si===0?6:52)+'%'; b.style.height='0%'; plot.appendChild(b); return b; });
      c.appendChild(plot); const l=E('div','ac-l',g.label); c.appendChild(l); wrap.appendChild(c); return {bars,z,l}; });
  }
  function update(groups){
    if(cells.length!==groups.length) build(groups);
    const vals=groups.flatMap(g=>g.v); let hi=Math.max(0,...vals), lo=Math.min(0,...vals);
    if(o.max!=null) hi=Math.max(hi,o.max); if(o.min!=null) lo=Math.min(lo,o.min);
    const span=(hi-lo)||1, z=(-lo)/span*100;
    groups.forEach((g,gi)=>{ const c=cells[gi]; c.z.style.bottom=z+'%'; c.l.innerHTML=g.label; c.l.style.fontWeight=g.on?'700':''; c.l.style.color=g.on?'var(--ink)':'';
      g.v.forEach((v,si)=>{ const b=c.bars[si]; const h=Math.abs(v)/span*100; b.style.bottom=(v>=0?z:z-h)+'%'; b.style.height=h+'%'; b.classList.toggle('neg',v<0); b.dataset.tip=`${String(g.label).replace(/<[^>]+>/g,'')} · ${series[si].name}|${fmt(v)}`; }); });
    wrap.setAttribute('aria-label',(o.label||'Chart')+': '+groups.map(g=>`${String(g.label).replace(/<[^>]+>/g,'')} ${g.v.map(fmt).join(' and ')}`).join('; '));
    tbl.innerHTML=BW.ui.table([o.xName||''].concat(series.map(s=>s.name)),groups.map(g=>[String(g.label).replace(/<[^>]+>/g,'')].concat(g.v.map(fmt))),{num:series.map((s,i)=>i+1)});
  }
  let first=true, pending=false, latest=null;
  return function(groups){ latest=groups;
    if(first){ first=false; build(groups); if(calm()) update(groups); else { const zero=groups.map(g=>Object.assign({},g,{v:g.v.map(()=>0)})); update(zero); pending=true; later(()=>{ pending=false; update(latest); }); } }
    else if(!pending) update(groups); };
}
BW.cols=cols;

/* ---------- small parser for typed numbers: 1,200 · (1,200) · -1200 · 1.2k ---------- */
function parseNum(s){ let x=String(s||'').trim().toLowerCase().replace(/\$|,|\s|usd/g,''); if(!x) return null; let neg=false; if(/^\(.*\)$/.test(x)){ neg=true; x=x.slice(1,-1); } if(x.startsWith('−')) x='-'+x.slice(1); let mult=1; if(x.endsWith('k')){ mult=1000; x=x.slice(0,-1); } const v=parseFloat(x); if(isNaN(v)) return null; return (neg?-1:1)*v*mult; }
BW.parseNum=parseNum;

/* ====================================================================== content */
BW.add({
  id:'m24', minutes:80,
  title:'The judgement calls behind the numbers',
  subtitle:'Cash is counted. Almost everything else in the accounts involves an estimate or a choice of rule. Learn the calls that move a medical device exporter\'s profit most, and the questions that keep them honest.',
  goals:[
    'Tell which figures are counted and which are estimated, and how far estimates can move profit',
    'Decide when a sale becomes revenue, and how much of it, with rebates, returns and bundled services',
    'Judge whether a cost belongs on the balance sheet or in this year\'s profit, especially new-product spending',
    'Read warranty, returns and recall provisions, and the difference between a provision and a note',
    'Explain why currency moves create gains and losses after a sale is booked',
    'See how a lease changes EBITDA, debt and cash flow, depending on the rulebook',
    'Know which accounting rulebook your company follows, why tax isn\'t simply rate × profit, and what IFRS 18 changes from 2027'
  ],
  sections:[
  /* ---------------------------------------------------------------- 1 */
  {id:'estimates', label:'Counted or estimated?', kind:'play', title:'Counted or estimated?', blocks:[
    `<p>The bank balance is counted: there's a statement to prove it. Most other numbers in BraceWorks' accounts are partly <strong>estimated</strong>. Someone decided how long a machine will last, how many mattresses will come back under warranty, and whether a slow distributor will pay. Each decision is reasonable on its own. Together they can move profit a long way.</p>`,
    {t:'fig', title:'From counted to estimated', draw:function(w){
      const items=[['Cash in the bank',0.03,'bank statement'],['Bank loans',0.11,'loan statement'],['Supplier invoices',0.2,'invoices'],['Sales invoiced',0.3,'less rebates and returns'],['Stock',0.46,'counted units × estimated costs'],['Depreciation',0.6,'guess of useful life'],['Bad debt allowance',0.7,'who won\'t pay'],['Warranty provision',0.8,'future claims'],['Capitalised development',0.89,'future sales'],['Goodwill',0.97,'value of a whole business']];
      if(w>=640){ const x0=16, x1=w-16, ax=104; let g=`<defs><linearGradient id="cegr" x1="0" x2="1"><stop offset="0" stop-color="var(--good)"/><stop offset="1" stop-color="var(--red)"/></linearGradient></defs><rect x="${x0}" y="${ax-4}" width="${x1-x0}" height="8" rx="4" fill="url(#cegr)" opacity=".75"/>`;
        g+=P.txt(x0,ax+132,'← Counted: hard to argue with','v-l','start')+P.txt(x1,ax+132,'Estimated: needs judgement →','v-l','end');
        items.forEach((it,i)=>{ const x=x0+(x1-x0)*it[1], up=i%2===0, lvl=(i%4<2)?0:1; const y=up?ax-22-lvl*34:ax+56+lvl*34;
          g+=`<line x1="${P.f(x)}" y1="${ax}" x2="${P.f(x)}" y2="${up?y+6:y-14}" class="v-edge" style="stroke-dasharray:2 3"/><circle cx="${P.f(x)}" cy="${ax}" r="5" class="v-node hl"/>`+P.txt(x,y,it[0],'v-t')+P.txt(x,y+14,it[2],'v-s'); });
        return P.svg(w,ax+142,'Balance sheet and profit items arranged from counted (cash, loans, invoices) to estimated (provisions, capitalised development, goodwill).',g); }
      const rh=38, top=8; let g=`<defs><linearGradient id="cegv" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="var(--good)"/><stop offset="1" stop-color="var(--red)"/></linearGradient></defs><rect x="14" y="${top}" width="8" height="${items.length*rh}" rx="4" fill="url(#cegv)" opacity=".75"/>`;
      items.forEach((it,i)=>{ const y=top+i*rh+rh/2; g+=`<circle cx="18" cy="${y}" r="5" class="v-node hl"/>`+P.txt(36,y-2,it[0],'v-t','start')+P.txt(36,y+13,it[2],'v-s','start'); });
      g+=P.txt(w-6,top+12,'counted','v-l','end')+P.txt(w-6,top+items.length*rh-4,'estimated','v-l','end');
      return P.svg(w,top+items.length*rh+8,'Items arranged from counted at the top to estimated at the bottom.',g);
    }, caption:'The further along the line an item sits, the more its value depends on someone\'s judgement, and the more questions it deserves.'},
    `<p>Try it. Below are six estimates in BraceWorks' latest accounts. The reported profit before tax of <strong>$74,000</strong> used the middle setting each time. Every setting is one a careful accountant could defend.</p>`,
    W('Two honest accountants', function(el,ctx){
      const BASE=74000;
      const J=[
        {k:'reb',t:'Distributor rebates',d:'US distributor A may earn a 2–4% volume rebate on $480,000 of purchases.',o:[['Accrue 4%',-4800],['3%',0],['2%',4800]],def:1},
        {k:'war',t:'Warranty provision',d:'Expected claims on $504,000 of mattresses sold with a two-year warranty.',o:[['2.0% of sales',-2520],['1.5%',0],['1.0%',2520]],def:1},
        {k:'stk',t:'Slow-moving brace stock',d:'$40,000 of brace variants with no sales in nine months.',o:[['Write down 50%',-8000],['30%',0],['10%',8000]],def:1},
        {k:'bad',t:'An overdue distributor',d:'US distributor B owes $10,000, now 120 days late, and still answering emails.',o:[['Provide 100%',-5000],['50%',0],['Nothing',5000]],def:1},
        {k:'dep',t:'Machine lives',d:'Depreciation is $38,000 a year, on lives of about ten years.',o:[['8 years',-9500],['10 years',0],['12 years',6300]],def:1},
        {k:'dev',t:'New-product testing',d:'$30,000 of testing and regulatory work on the bariatric mattress.',o:[['Expense it',0],['Capitalise it',30000]],def:0}
      ];
      const lo=BASE+J.reduce((t,j)=>t+Math.min(...j.o.map(x=>x[1])),0), hi=BASE+J.reduce((t,j)=>t+Math.max(...j.o.map(x=>x[1])),0);
      const pick={}; J.forEach(j=>pick[j.k]=j.def);
      const list=E('div'); const out=E('div'); el.append(list,out);
      J.forEach(j=>{ const r=E('div','jc-row',`<div><b>${j.t}</b><small>${j.d}</small></div>`); const sg=E('div'); r.appendChild(sg); list.appendChild(r);
        ctx.ui.seg(sg,j.o.map((x,i)=>({v:i,label:x[0]})),j.def,v=>{ pick[j.k]=v; draw(); }); });
      out.innerHTML=`<div class="jc-track"><div class="jc-axis"></div><span class="jc-tick l" style="left:0">${kfmt(lo)}</span><span class="jc-tick r" style="left:100%">${kfmt(hi)}</span><div class="jc-mark rep" style="left:${((BASE-lo)/(hi-lo)*100).toFixed(1)}%">reported</div><div class="jc-mark now"></div></div><div class="stats" style="margin-top:8px"></div><p class="w-hint" style="margin-top:10px"></p>`;
      const mark=out.querySelector('.jc-mark.now'), stats=out.querySelector('.stats'), hint=out.querySelector('.w-hint');
      function draw(){
        const pbt=BASE+J.reduce((t,j)=>t+j.o[pick[j.k]][1],0), d=pbt-BASE;
        mark.style.left=((pbt-lo)/(hi-lo)*100).toFixed(1)+'%'; mark.textContent=kfmt(pbt);
        stats.innerHTML=ctx.ui.stat('Profit before tax',m$(pbt),d>0?'good':d<0?'bad':'')+ctx.ui.stat('Change from reported',d?signed(d):'none')+ctx.ui.stat('Cash at year-end','$42,000','','the same in every case');
        const allLo=J.every(j=>j.o[pick[j.k]][1]===Math.min(...j.o.map(x=>x[1]))), allHi=J.every(j=>j.o[pick[j.k]][1]===Math.max(...j.o.map(x=>x[1])));
        hint.innerHTML=allLo?`Every setting at its most cautious: profit falls to <strong>${m$(pbt)}</strong>. Prudent, but if next year's claims and bad debts are normal, provisions will be released and next year will look flattered.`:
          allHi?`Every setting at its boldest: profit of <strong>${m$(pbt)}</strong>, nearly three times the cautious figure. No single choice is outrageous, but an auditor would challenge the pattern. And under the SME accounting standards most small companies follow, capitalising the testing costs isn't allowed at all (see "Asset or expense").`:
          `Profit can land anywhere between <strong>${m$(lo)}</strong> and <strong>${m$(hi)}</strong> from these six choices alone, while the bank balance never moves. That's why a GM asks <em>how</em> each estimate was made, not just what profit was.`;
      }
      draw();
    }),
    K('Three questions for any estimate',
      `<ol>
        <li><strong>What's it based on?</strong> Claim history, an aging list, an engineer's review. "Gut feel" isn't evidence.</li>
        <li><strong>Did it change from last year, and why?</strong> A change is fine if the facts changed. A change that lands profit exactly on budget isn't.</li>
        <li><strong>What would one notch either way do to profit?</strong> If one estimate can swing profit by more than 10%, you should know about it every month, not at year-end.</li>
       </ol>`),
    TIP('Consistency matters more than precision',
      `<p>Auditors and banks forgive an estimate that turns out wrong. What they don't forgive is <strong>moving estimates around to manage the result</strong>: generous in a good year (to store profit), stingy in a bad one (to release it). A change in an estimate is applied from now on and explained in the notes. A change in an accounting policy is rarer and is applied to past years too.</p>`),
    Q('Profit before tax rose from $74,000 to $80,300. The only change: machine lives were extended from 10 to 12 years. What should you ask?',[
      'Nothing. Higher profit is good news',
      'What evidence supports 12 years, and what would profit have been on the old lives?',
      'Whether cash rose by $6,300 too',
      'Whether the tax office approves'],1,
      'Depreciation is an estimate. Longer lives can be right (machines kept in good repair often last longer), but a GM should see the underlying result on a like-for-like basis and the evidence for the change. Cash isn\'t affected at all.')
  ]},
  /* ---------------------------------------------------------------- 2 */
  {id:'revenue', label:'Revenue', kind:'learn', title:'Revenue: when, and how much?', blocks:[
    `<p>Revenue is the biggest number on the P&amp;L, and at a small exporter it's the one most often wrong. Every sale raises two questions: <strong>when</strong> does it count, and <strong>how much</strong> is it really worth once rebates, returns and extra services are taken out?</p>
     <p>The rules that answer them, IFRS 15 under full IFRS and PFRS and Topic 606 under US GAAP, follow the same five steps. The SME standards are moving to a simplified version from 2027, and the UK's FRS 102 already has from 2026. Here they are on one BraceWorks contract.</p>`,
    {t:'fig', title:'The five steps, on one hospital contract', intro:'A Spanish hospital group signs a <strong>$60,000</strong> contract. Press <strong>Play</strong> to work through it.',
      steps:[
        {k:['n0'],t:'<strong>The contract.</strong> A signed order for 300 pressure-relief mattresses, a staff training day, and a <strong>three-year extended warranty</strong> that starts when the standard two-year warranty ends. Price: $60,000, delivered DAP Madrid.'},
        {k:['n0','e0','n1'],t:'<strong>The promises.</strong> Three separate things are promised: the mattresses, the training, and the extended warranty. The extended warranty counts separately because the customer pays for cover beyond the normal guarantee: it\'s a service, not just a promise that the product works.'},
        {k:['n1','e1','n2'],t:'<strong>The price.</strong> $60,000, fixed. If there were rebates, returns or late-delivery penalties, the expected amount would be deducted here.'},
        {k:['n2','e2','n3'],t:'<strong>Split the price</strong> by what each would sell for alone: mattresses $54,000, training $2,000, extended warranty $6,000. That\'s $62,000, so the $2,000 discount is spread across all three: <strong>$52,258</strong>, <strong>$1,935</strong> and <strong>$5,806</strong>.'},
        {k:['n3','e3','n4'],t:'<strong>Recognise it when each promise is kept.</strong> Mattress revenue when they\'re delivered in Madrid in March (DAP: control passes on delivery). Training in April, when it happens. The warranty revenue waits two years, then is spread over years 3 to 5. Until then the $5,806 sits on the balance sheet as a <span class="term">contract liability</span>.'}],
      draw:BW.viz.flow({label:'Five steps: contract, promises, price, split the price, recognise when each promise is kept.',labels:['what\'s promised?','for how much?','split it','when?'],edgeK:['e0','e1','e2','e3'],
        nodes:[{t:'1. Contract',s:'a signed order',k:'n0'},{t:'2. Promises',s:'goods, training, warranty',k:'n1'},{t:'3. Price',s:'less expected rebates',k:'n2'},{t:'4. Split the price',s:'by stand-alone prices',k:'n3'},{t:'5. Recognise',s:'as each promise is kept',k:'n4'}]})},
    `<h3>When: control passes</h3>
     <p>Goods become revenue when <strong>control passes</strong> to the customer: they can use them, sell them, and carry the risk. For an exporter, the Incoterm usually decides the day (Module 17). FOB or FCA: when the goods are handed over at this end. DAP or DDP: when they arrive.</p>`,
    SORT('BraceWorks closes its books on 30 June. Which of these are June revenue?',['June revenue','Later','Never revenue'],[
      {text:'Mattresses shipped FOB Manila on 28 June to US distributor A', a:0, why:'Under FOB, control passes when the goods are loaded at the port of departure.'},
      {text:'Slings shipped DDP to Germany on 27 June, delivered 6 July', a:1, why:'Under DDP, BraceWorks carries the goods to the customer\'s door. July revenue.'},
      {text:'A hospital pays a 30% deposit on an order shipping in August', a:1, why:'Cash in, but nothing delivered. It\'s a liability (a customer deposit) until August.'},
      {text:'400 braces sent on consignment to the UK distributor, who pays only when it sells them on', a:1, why:'BraceWorks still controls the stock. Revenue comes when the distributor sells to a hospital.'},
      {text:'At the hospital\'s request, 300 slings are invoiced on 30 June but stored at BraceWorks until the new wing opens. They\'re packed, labelled for that hospital and can\'t go to anyone else', a:0, why:'This is "bill-and-hold". It counts only because all four tests are met: there\'s a real reason (the customer asked), the goods are set aside, they\'re ready, and BraceWorks can\'t sell them elsewhere. If BraceWorks had suggested it to hit a target, it would not.'},
      {text:'50 free sample mattresses sent to a new distributor', a:2, why:'A marketing cost, not a sale.'},
      {text:'An insurance payout for flood-damaged stock', a:2, why:'Other income. Revenue is only what you earn from selling your products and services.'}
    ]),
    `<h3>How much: rebates, returns and discounts</h3>
     <p>If part of the price depends on what happens later, revenue is booked at the amount you <strong>expect</strong> to keep, as you go. Distributor volume rebates are the classic case. Here's US distributor A's deal: no rebate below $400,000 of purchases a year; 3% on <em>all</em> purchases once they pass $400,000; 5% on all purchases once they reach $600,000. In March, finance must guess where the year will end.</p>`,
    W('Distributor rebate: estimate it now, or get a surprise later', function(el,ctx){
      const QS=[150000,155000,155000,160000], TOTAL=620000, tier=x=>x>=600000?0.05:x>=400000?0.03:0, TRUE=TOTAL*tier(TOTAL);
      const top=E('div'), seg=E('div'), chart=E('div'), out=E('div'); el.append(top,seg,chart,out);
      let pol='est', exp=500000, ready=false;
      ctx.ui.sliders(top,[{k:'exp',label:'In March, finance expects full-year purchases of',min:300000,max:700000,step:10000,v:500000,f:v=>`${m$(v)} → ${pct(tier(v),0)} rebate`}],v=>{ exp=v.exp; if(ready) draw(); },ctx.uid);
      ctx.ui.seg(seg,[{v:'est',label:'Estimate the rebate each quarter'},{v:'paid',label:'Book it when it\'s paid (January)'}],'est',v=>{ pol=v; draw(); });
      seg.style.margin='10px 0';
      const plot=cols(chart,{series:[{name:'Rebate deducted from revenue',cls:'s2'}],label:'Rebate deducted from revenue by quarter',legend:true,fmt:v=>m$(v),max:31000});
      function draw(){
        const r=tier(exp); let ded;
        if(pol==='est'){ ded=QS.map((q,i)=>i<3?q*r:TRUE-r*(QS[0]+QS[1]+QS[2])); }
        else ded=[0,0,0,0];
        const net=QS.map((q,i)=>q-ded[i]); const nextJan=pol==='paid'?-TRUE:0;
        plot([{label:'Q1',v:[ded[0]]},{label:'Q2',v:[ded[1]]},{label:'Q3',v:[ded[2]]},{label:'Q4',v:[ded[3]]},{label:'Next year,<br>when paid',v:[-nextJan]}]);
        const year=net.reduce((a,b)=>a+b,0), over=year-(TOTAL-TRUE); 
        out.innerHTML=`<div class="stats">${ctx.ui.stat('This year\'s revenue from A',m$(year))}${ctx.ui.stat('Q4 rebate charge',m$(-ded[3]),ded[3]>15000?'bad':'')}${ctx.ui.stat('Overstated this year by',over?m$(over):'nothing',over>0?'bad':'good')}</div>
          <p class="w-hint" style="margin-top:10px">Actual purchases came in at <strong>$620,000</strong>, so the rebate is 5%: <strong>${m$(TRUE)}</strong>. ${pol==='paid'?'Booking it only when it\'s paid in January overstates this year\'s revenue and profit by the full amount, and next year starts in a hole. That\'s not allowed: the rebate is earned as the purchases happen.':r===0.05?'Finance guessed right, so every quarter carries its fair share of the rebate and there\'s no year-end surprise.':`Finance accrued ${pct(r,0)}, so Q4 has to catch up with a ${m$(ded[3])} charge, making it look like a bad quarter. The fix: update the estimate every quarter as the purchase trend becomes clear.`}</p>`;
      }
      ready=true; draw();
    }),
    K('Returns, discounts and bundles follow the same logic',
      `<ul>
        <li><strong>Right of return:</strong> a new distributor may return unsold stock within 90 days. Book revenue for what you expect it to keep; the rest is a refund liability.</li>
        <li><strong>Early-payment discounts:</strong> if most customers take 2% for paying in 10 days, estimate the discounts taken and book revenue net of them.</li>
        <li><strong>Bundles:</strong> equipment plus training, installation or service. Split the price; each part is revenue when it's delivered.</li>
       </ul>`),
    {t:'fig', title:'What channel stuffing looks like', draw:function(w){
      const m=['J','F','M','A','M','J','J','A','S','O','N','D'], s=[88,92,131,84,90,128,79,93,136,85,95,142], cn=[0,0,0,-14,0,0,-12,0,0,-15,0,0];
      const pl=34, pr=8, top=10, hh=150, base=top+hh*0.82, sc=hh*0.82/150, bw=(w-pl-pr)/12; let g='';
      [0,50,100,150].forEach(t=>{ const y=base-t*sc; g+=`<line x1="${pl}" x2="${w-pr}" y1="${P.f(y)}" y2="${P.f(y)}" class="v-grid"/>`+P.txt(pl-6,y+4,'$'+t+'k','v-s','end'); });
      s.forEach((v,i)=>{ const x=pl+i*bw+bw*0.18, ww=bw*0.64, qe=i%3===2; g+=`<rect x="${P.f(x)}" y="${P.f(base-v*sc)}" width="${P.f(ww)}" height="${P.f(v*sc)}" rx="2" class="${qe?'v-f-s2':'v-f-s1'}" data-tip="${m[i]} sales|$${v}k"/>`;
        if(cn[i]) g+=`<rect x="${P.f(x)}" y="${P.f(base)}" width="${P.f(ww)}" height="${P.f(-cn[i]*sc)}" rx="2" fill="var(--red)" data-tip="Credit notes|($${-cn[i]}k)"/>`;
        g+=P.txt(x+ww/2,base+hh*0.18+12,m[i],'v-s'); });
      g+=`<line x1="${pl}" x2="${w-pr}" y1="${P.f(base)}" y2="${P.f(base)}" class="v-edge"/>`;
      return P.svg(w,top+hh+18,'Monthly sales spike in the last month of every quarter, followed by credit notes in the next month.',g);
    }, caption:'Orange: the last month of each quarter. Red: credit notes the month after. Sales that spike at every quarter-end and come back as returns usually mean distributors were pushed to take stock early, with extra discounts or long terms. Revenue was borrowed from the next quarter.'},
    FLAG('Channel stuffing',
      `<p>Watch for: sales concentrated in the last two weeks of a period; receivables days rising; credit notes and returns early in the next month; distributors' stock building up. If bonuses depend on quarterly sales, expect pressure here.</p>`),
    Q('BraceWorks sells $60,000 of mattresses plus a $6,000 three-year extended warranty, as one deal. When is the warranty part revenue?',[
      'Immediately, with the mattresses','Spread over the period of extra cover it provides','Only when a claim is made','Never: warranties are a cost, not revenue'],1,
      'An extended warranty the customer pays for is a separate service. Its share of the price is held back as a contract liability and released as the cover is provided.')
  ]},
  /* ---------------------------------------------------------------- 3 */
  {id:'capitalise', label:'Asset or expense', kind:'play', title:'Asset or expense? The new-product test', blocks:[
    `<p>Module 4 covered the easy cases: a machine is an asset, a repair is a cost. The hard calls come with <strong>new products</strong>. A device maker spends heavily before the first sale: design, prototypes, testing, the technical file and regulatory submissions. Whether that spending hits profit now or sits on the balance sheet depends on two things: what kind of spending it is, and which rulebook you follow.</p>`,
    {t:'tbl', head:['Kind of spending','Full IFRS, full PFRS, Taiwan-IFRS, China ASBE','SME standards (IFRS and PFRS for SMEs)','US GAAP','UK FRS 102'], rows:[
      ['<strong>Research</strong>: finding out (new foam materials, early concepts)','Expense','Expense','Expense','Expense'],
      ['<strong>Development</strong>: turning a proven design into a product (verification, testing, technical file)','Capitalise once six tests are met; expense before that','Expense','Expense (narrow exceptions, such as some software)','Your choice of policy: capitalise once the tests are met, or expense'],
      ['<strong>Tooling, moulds, cutting patterns</strong>','Asset: equipment','Asset','Asset','Asset'],
      ['<strong>Launch marketing, samples, trade fairs</strong>','Expense','Expense','Expense','Expense']
    ]},
    K('The six tests for capitalising development (full IFRS)',
      `<p>All six must be met, and you must be able to show it: the product is <strong>technically feasible</strong>; you <strong>intend</strong> to finish it; you're <strong>able</strong> to sell it; there's a <strong>market</strong> (it will bring future benefits); you have the <strong>resources</strong> to finish; and you can <strong>measure</strong> its cost reliably.</p>
       <p>For medical devices, regulatory approval is the big uncertainty. Many device makers start capitalising only once approval looks very likely, and some only once it's granted. Spending before that point is expensed and can't be put back on the balance sheet later.</p>`),
    `<p>Here's the bariatric mattress plan from Module 14. Choose how each item is treated, then look at the profit it reports each year. Cash leaves in year 0 whatever you choose.</p>`,
    W('Same spending, two profit stories', function(el,ctx){
      const IT=[
        {k:'des',t:'Design, prototypes and user trials',v:25000,ok:{full:false,sme:false,us:false},why:'Mostly research and early design, before feasibility is proven: an expense in every rulebook.'},
        {k:'reg',t:'Testing, technical file and regulatory submissions',v:30000,ok:{full:true,sme:false,us:false},why:{full:'Allowed under full IFRS once the six tests are met, so you need evidence that approval is likely.',sme:'Not allowed: the SME standards expense all research and development.',us:'Not allowed: US GAAP expenses research and development.'}},
        {k:'tool',t:'Tooling and cutting patterns',v:15000,ok:{full:true,sme:true,us:true},why:'Equipment you\'ll use for years: an asset under every rulebook.'},
        {k:'mkt',t:'Launch marketing and samples',v:10000,ok:{full:false,sme:false,us:false},why:'Never an asset: you can\'t control the goodwill it creates.'}];
      const ch={des:0,reg:1,tool:1,mkt:0}; let book='full', life=5, ready=false;
      const top=E('div'), list=E('div'), chart=E('div'), out=E('div'); el.append(top,list,chart,out);
      const rb=E('div'); top.appendChild(E('p','w-hint','Rulebook:')); top.appendChild(rb); rb.style.margin='4px 0 10px';
      ctx.ui.seg(rb,[{v:'full',label:'Full IFRS or PFRS'},{v:'sme',label:'SME standards'},{v:'us',label:'US GAAP'}],'full',v=>{ book=v; draw(); });
      IT.forEach(it=>{ const r=E('div','jc-row',`<div><b>${it.t}</b><small>${m$(it.v)}</small></div>`); const sg=E('div'); r.appendChild(sg); list.appendChild(r);
        ctx.ui.seg(sg,[{v:0,label:'Expense now'},{v:1,label:'On the balance sheet'}],ch[it.k],v=>{ ch[it.k]=v; draw(); }); });
      const sl=E('div'); list.appendChild(sl);
      ctx.ui.sliders(sl,[{k:'life',label:'Amortise capitalised costs over',min:3,max:8,step:1,v:5,f:v=>v+' years'}],v=>{ life=v.life; if(ready) draw(); },ctx.uid);
      const plot=cols(chart,{series:[{name:'Expense everything',cls:'mut'},{name:'Your choices',cls:'s1'}],label:'Effect on profit by year',fmt:v=>m$(v)});
      function draw(){
        const total=IT.reduce((t,i)=>t+i.v,0), cap=IT.reduce((t,i)=>t+(ch[i.k]?i.v:0),0), exp0=total-cap, am=cap/life;
        const yrs=[0,1,2,3,4,5,6]; plot(yrs.map(y=>({label:'Year '+y,v:[y===0?-total:0, y===0?-exp0:(y<=life?-am:0)]})));
        const bad=IT.filter(i=>ch[i.k]&&!i.ok[book]);
        out.innerHTML=`<div class="stats" style="margin-top:6px">${ctx.ui.stat('Year 0 profit effect',m$(-exp0),'',`vs ${m$(-total)} if all expensed`)}${ctx.ui.stat('On the balance sheet at end of year 0',m$(cap))}${ctx.ui.stat('Total cost over the life','$80,000','','the same either way')}</div>
          <div class="msg ${bad.length?'bad':'good'}" style="margin-top:10px">${bad.length?`<strong>Not allowed under ${book==='full'?'full IFRS':book==='sme'?'the SME standards':'US GAAP'}:</strong><ul style="margin:6px 0 0 18px;padding:0">${bad.map(i=>`<li>${i.t}: ${typeof i.why==='string'?i.why:i.why[book]}</li>`).join('')}</ul>`:`<strong>All allowed under ${book==='full'?'full IFRS':book==='sme'?'the SME standards':'US GAAP'}.</strong> ${cap?`Capitalising ${m$(cap)} lifts year-0 profit by that much, then costs ${m$(am)} a year for ${life} years. The cash went out in year 0 either way.`:'Everything hits year 0: cautious, and the launch year looks expensive.'}`}</div>`;
      }
      ready=true; draw();
    }),
    TIP('The trade-off for a GM',
      `<p>Capitalising makes the launch year look better and later years look worse, by exactly the same total. It also creates an asset that must be <strong>tested for impairment</strong>: if the product is delayed, fails approval or sells badly, the asset is written off in one go. Many owners of small firms prefer to expense development: simpler, cautious, and often how the tax office treats it anyway.</p>`),
    FLAG('Capitalising to hit a target',
      `<p>The biggest known case is WorldCom, which in 2002 admitted booking billions of dollars of ordinary network costs as assets. On a smaller scale, watch for: a development or "other intangible" asset that grows every year while launches slip; repairs relabelled as upgrades; staff time "allocated to projects" at year-end. Ask for the list of what was capitalised this year, item by item.</p>`),
    SORT('Under full IFRS, where should each go?',['Asset','Expense'],[
      {text:'$22,000 of moulds for a new brace', a:0, why:'Tooling is equipment.'},
      {text:'Lab tests of three foam suppliers\' materials, before any product is chosen', a:1, why:'Research: finding out. Always an expense.'},
      {text:'Verification testing of a frozen brace design, with approval expected', a:0, why:'Development after feasibility, if the six tests are documented.'},
      {text:'The annual ISO 13485 surveillance audit', a:1, why:'A yearly running cost.'},
      {text:'Licences and set-up of an accounting system you\'ll use for years, installed on your own servers', a:0, why:'Software you control is an intangible asset.'},
      {text:'Configuring a cloud (subscription) software service', a:1, why:'Usually an expense: you don\'t control the software, you rent access to it.'}
    ]),
    Q('BraceWorks follows PFRS for SMEs. Finance proposes capitalising $30,000 of regulatory testing because approval is "almost certain". What\'s the right answer?',[
      'Capitalise it: approval is almost certain','Expense it: the SME standards expense all research and development','Capitalise half','Put it in inventory'],1,
      'Under the SME standards, research and development are always expensed, however good the prospects. If BraceWorks ever moves to full PFRS, the rules change.')
  ]},
  /* ---------------------------------------------------------------- 4 */
  {id:'provisions', label:'Provisions', kind:'play', title:'Warranties, returns and recalls', blocks:[
    `<p>A <span class="term">provision</span> is a liability where the amount or the timing is uncertain. For a device maker the important ones are <strong>warranty claims</strong>, <strong>returns</strong>, and the costs of a <strong>recall</strong> or field safety action. The question is always the same: should it be in the accounts now, as a number, or just mentioned in a note?</p>`,
    {t:'fig', title:'Provision, note, or nothing?', intro:'Press <strong>Play</strong> to run three BraceWorks situations through the test.',
      steps:[
        {k:['q1'],t:'<strong>Warranty.</strong> BraceWorks has sold mattresses with a two-year warranty. The past event is the sale: an obligation exists today.'},
        {k:['q1','y1','q2'],t:'Will it have to pay? Claim history says about 1.5% of mattress sales come back as claims. Across thousands of mattresses, that\'s more likely than not.'},
        {k:['q2','y2','q3'],t:'Can it estimate the amount? Yes: the claim rate × sales still under warranty.'},
        {k:['q3','y3','prov'],t:'So it records a <strong>provision</strong>: a cost in the P&amp;L as mattresses are sold, and a liability until claims are paid.'},
        {k:['q1','y1','q2','n2','cont'],t:'<strong>A lawsuit.</strong> A hospital sues after a patient fall, blaming a sling. The sale is the past event. Lawyers think BraceWorks will probably win: paying is <em>possible</em>, not probable. Result: a <strong>note</strong> describing the claim, no number in the accounts.'},
        {k:['q1','n1','none'],t:'<strong>Next year\'s rebrand.</strong> BraceWorks plans to spend $40,000 on new packaging. Nothing has happened yet that obliges it to: <strong>nothing</strong> is recorded, however certain the plan.'}],
      draw:function(w){
        const narrow=w<560, gap=narrow?14:40, qw=narrow?Math.min(w*0.56,240):Math.min(300,w*0.5), ow=w-qw-gap-4, x0=2, ox=x0+qw+gap;
        const Qs=[['q1','A past event has created an obligation?'],['q2','Paying is more likely than not?'],['q3','The amount can be estimated?']];
        const Os=[['none','Nothing to record','no obligation yet',''],['cont','A note only','"contingent liability": described, not booked','warn'],['cont3','A note only','very rare in practice','warn']];
        let g='', y=4; const rows=[];
        Qs.forEach((q,i)=>{ const L=P.nodeLines(qw,q[1]), Lo=P.nodeLines(ow,Os[i][1],Os[i][2]); const h=Math.max(L.h,Lo.h); rows.push({y,h});
          g+=`<g data-k="${q[0]}">${P.node(x0,y,qw,h,L,'')}</g>`;
          const ok=i===2?'cont3':Os[i][0]; g+=`<g data-k="${ok}">${P.node(ox,y,ow,h,Lo,Os[i][3])}</g>`;
          const lab=['No','Only possible','No'][i]; g+=`<g data-k="n${i+1}">${P.arrow(x0+qw+2,y+h/2,ox-2,y+h/2)}${P.txt(x0+qw+gap/2,y+h/2-6,narrow?'':lab,'v-l')}</g>`;
          y+=h+(narrow?34:38); });
        const Lp=P.nodeLines(qw,'Provision','a cost now and a liability until paid'); g+=`<g data-k="prov">${P.node(x0,y,qw,Lp.h,Lp,'good')}</g>`;
        rows.forEach((r,i)=>{ const yb=r.y+r.h, ye=(i<2?rows[i+1].y:y); g+=`<g data-k="y${i+1}">${P.arrow(x0+qw/2,yb+2,x0+qw/2,ye-2)}${P.txt(x0+qw/2+10,(yb+ye)/2+4,['Yes','Probable','Yes'][i],'v-l','start')}</g>`; });
        if(narrow) rows.forEach((r,i)=>{ g+=P.txt(ox+ow/2,r.y-4,['if no','if only possible','if no'][i],'v-l'); });
        return P.svg(w,y+Lp.h+6,'Decision tree: obligation from a past event, then probable payment, then a reliable estimate leads to a provision; otherwise a note or nothing.',g);
      }, caption:'Possible but not probable: describe it in the notes. Remote: nothing at all. Probable and measurable: a provision.'},
    `<h3>A provision fills and drains</h3>
     <p>Every month, BraceWorks charges the expected claim cost on that month's mattress sales into the provision (a cost in the P&amp;L). When claims are paid, they come out of the provision, not out of profit. If the rate is right, the level stays steady. Run a year and see what happens when the foam problem from Module 8 pushes claims up.</p>`,
    W('The warranty provision through a year', function(el,ctx){
      const SALES=42000, OPEN=7560, MAXV=20000, MON=['J','F','M','A','M','J','J','A','S','O','N','D'];
      let rate=1.5, mode='normal', timer=null, shown=0, ready=false;
      const top=E('div'), seg=E('div'), body=E('div'), out=E('div'); el.append(top,seg,body,out);
      ctx.ui.sliders(top,[{k:'r',label:'Provision charged on each month\'s mattress sales',min:0.5,max:3.5,step:0.1,v:1.5,f:v=>v.toFixed(1)+'%'}],v=>{ rate=v.r; if(ready) reset(); },ctx.uid);
      ctx.ui.seg(seg,[{v:'normal',label:'Claims as usual'},{v:'foam',label:'Foam problem: claims double from July'}],'normal',v=>{ mode=v; reset(); });
      seg.style.margin='10px 0 14px';
      body.innerHTML=`<div class="tank-wrap"><div><div class="tank"><div class="tank-fill"></div><div class="tank-need"><span></span></div></div><div class="tank-amt"></div></div><div><div class="ac-leg"><span><i class="ac-b s1" style="position:static"></i>charged to P&amp;L</span><span><i class="ac-b s2" style="position:static"></i>claims paid</span></div><div class="tank-m">${MON.map(()=>'<div><i class="in"></i><i class="out"></i></div>').join('')}</div><div class="tank-ml">${MON.map(m=>`<span>${m}</span>`).join('')}</div><div class="row" style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap"><button type="button" class="btn small" data-play>Play the year ▶</button><button type="button" class="btn ghost small" data-end>Jump to year-end</button></div></div></div>`;
      const fill=body.querySelector('.tank-fill'), need=body.querySelector('.tank-need'), amt=body.querySelector('.tank-amt'), mcol=[...body.querySelectorAll('.tank-m div')];
      const claims=()=>MON.map((m,i)=>mode==='foam'&&i>=6?1400:630), needEnd=()=>mode==='foam'?11900:7560;
      function balAt(n){ const c=claims(); let b=OPEN; for(let i=0;i<n;i++) b+=SALES*rate/100-c[i]; return b; }
      function paint(n){ shown=n; const b=balAt(n), c=claims();
        fill.style.height=Math.max(0,Math.min(100,b/MAXV*100))+'%'; fill.classList.toggle('low',b<needEnd()*0.6);
        amt.textContent=m$(b); need.style.bottom=(needEnd()/MAXV*100)+'%'; need.querySelector('span').textContent='target '+kfmt(needEnd());
        mcol.forEach((d,i)=>{ d.classList.toggle('on',i<n); const [a,o]=d.querySelectorAll('i'); a.style.height=(SALES*rate/100/1500*100)+'%'; o.style.height=(c[i]/1500*100)+'%'; d.title=`${MON[i]}: charged ${m$(SALES*rate/100)}, claims ${m$(c[i])}`; });
        if(n<12){ out.innerHTML=`<p class="w-hint" style="margin-top:10px">${n?`End of month ${n}: provision ${m$(b)}.`:'Opening provision $7,560: half of two years of expected claims on $1,008,000 of mattresses still under warranty.'}</p>`; return; }
        const gap=needEnd()-b, charged=SALES*12*rate/100, paid=c.reduce((a,x)=>a+x,0);
        out.innerHTML=`<div class="stats" style="margin-top:10px">${ctx.ui.stat('Charged to profit in the year',m$(charged))}${ctx.ui.stat('Claims paid',m$(paid))}${ctx.ui.stat('Year-end provision',m$(b),Math.abs(gap)<600?'good':'bad',`needed: ${m$(needEnd())}`)}</div>
          <p class="w-hint" style="margin-top:10px">${Math.abs(gap)<600?'About right. Claims and charges balance, so profit carried the true cost of warranties month by month.':gap>0?`The provision is <strong>${m$(gap)} short</strong>. A catch-up charge lands in December, so the year's monthly reports overstated profit. ${mode==='foam'?'When claims start rising, raise the rate straight away: here, about 3.3% would have kept up.':''}`:`The provision is <strong>${m$(-gap)} more than needed</strong>. Releasing it will flatter next year's profit. Too generous a provision is a "cookie jar": a store of profit to release when needed.`}</p>`;
      }
      function stop(){ if(timer){ clearInterval(timer); timer=null; } }
      function reset(){ stop(); paint(0); }
      body.querySelector('[data-play]').onclick=()=>{ stop(); if(calm()){ paint(12); return; } let n=0; paint(0); timer=setInterval(()=>{ if(!el.isConnected){ stop(); return; } n++; paint(n); if(n>=12) stop(); },430); };
      body.querySelector('[data-end]').onclick=()=>{ stop(); paint(12); };
      ready=true; paint(0);
    }),
    FS({title:'How the notes show it: warranty provision movement', sub:'BraceWorks, a normal year', rows:[
      ['At 1 January',7560],['Charged to profit',7560,'ind'],['Used: claims paid',-7560,'ind'],['Released: no longer needed',0,'ind'],['At 31 December',7560,'total']
    ], note:'Look for the "released" line. Big releases in a weak year, or provisions growing much faster than sales in a strong one, are the signs of profit being stored and released.'}),
    `<h3>Recalls and field safety actions</h3>
     <p>In November, BraceWorks finds that buckles from one batch of 1,200 braces can crack. 700 are already with distributors and hospitals; 500 are in the warehouse. Under the device regulations it must run a <span class="term">field safety corrective action</span>: tell customers, swap the affected braces for new ones, and report to the regulators. It announces the action to distributors on 10 December.</p>`,
    FS({title:'Batch B-2209: what goes in the December accounts', rows:[
      'Braces already sold (a provision)',
      ['Replacement braces: 700 × $23.35 full cost',-16345,'ind'],
      ['Freight, labelling and customer notices',-6000,'ind'],
      ['Recall provision',-22345,'sub'],
      'Braces still in the warehouse (not a provision)',
      ['Rework 500 buckles at $4 each, if that takes cost above selling price',-2000,'ind'],
      ['Total cost in this year\'s profit',-24345,'total']
    ], note:'The announcement in December created the obligation. If the defect had been found in January, before the accounts were finished, it would usually still be provided for in December: the faulty braces were sold before year-end with a warranty or legal duty to fix them, so the condition existed at 31 December (an "adjusting event"). Stock in the warehouse is written down only to the extent that cost plus rework exceeds what the braces will sell for.'}),
    Q('A patient\'s family threatens to sue over a fall involving a BraceWorks sling. The lawyers say a payout is possible but unlikely. What goes in the accounts?',[
      'A provision for the full claim','A note describing the claim (a contingent liability), with no amount booked','Nothing, ever','A provision for half the claim'],1,
      'Possible but not probable: disclose it in the notes. If the lawyers later say BraceWorks will probably pay, it becomes a provision.'),
    Q('Warranty claims doubled in the second half, but the provision rate stayed at 1.5%. What\'s the effect on the monthly reports?',[
      'None','Monthly profit was overstated; a catch-up charge will hit at year-end','Monthly profit was understated','Only cash is affected'],1,
      'The provision didn\'t keep up with real claims. Ask finance each quarter: does the provision rate still match the claim trend?')
  ]},
  /* ---------------------------------------------------------------- 5 */
  {id:'fx', label:'Currency', kind:'play', title:'Currency on the statements', blocks:[
    `<p>Module 17 showed the cash side: a euro invoice can lose value before it's paid. The accounts record that loss in a particular way, month by month, and it explains why an exporter's profit jumps around even when the business doesn't.</p>`,
    K('Three rules',
      `<ol>
        <li><strong>A sale is recorded at the rate on the day.</strong> €40,000 invoiced when €1 = $1.10 is $44,000 of revenue, and revenue is never changed afterwards.</li>
        <li><strong>Money balances are revalued every month-end.</strong> Receivables, payables, bank accounts and loans in foreign currency are restated at the month-end rate. The difference is an <span class="term">unrealised exchange gain or loss</span>, booked in profit even though nothing has been paid.</li>
        <li><strong>On payment, the last difference is realised.</strong> Stock, machines and prepayments are not revalued: they stay at the rate when they were bought.</li>
       </ol>`),
    W('Follow one euro invoice through three month-ends', function(el,ctx){
      const EUR=40000, R0=1.10; let r={may:1.08,jun:1.05,pay:1.06}, at=0, ready=false;
      const top=E('div'), cards=E('div','fxt'), info=E('div'), chart=E('div'); el.append(top,cards,info,chart);
      ctx.ui.sliders(top,[
        {k:'may',label:'Rate on 31 May',min:1.00,max:1.20,step:0.01,v:1.08,f:v=>'€1 = $'+v.toFixed(2)},
        {k:'jun',label:'Rate on 30 June',min:1.00,max:1.20,step:0.01,v:1.05,f:v=>'€1 = $'+v.toFixed(2)},
        {k:'pay',label:'Rate when paid, 19 July',min:1.00,max:1.20,step:0.01,v:1.06,f:v=>'€1 = $'+v.toFixed(2)}],v=>{ r=v; if(ready) draw(); },ctx.uid);
      const plot=cols(chart,{series:[{name:'Exchange gain or loss in the month',cls:'s2'}],legend:true,label:'Exchange gains and losses by month',fmt:v=>m$(v)});
      function draw(){
        const pts=[{d:'20 May',k:'Invoice',rate:R0},{d:'31 May',k:'Month-end',rate:r.may},{d:'30 June',k:'Month-end',rate:r.jun},{d:'19 July',k:'Paid',rate:r.pay}];
        pts.forEach((p,i)=>{ p.usd=EUR*p.rate; p.g=i?p.usd-pts[i-1].usd:0; });
        cards.innerHTML=pts.map((p,i)=>`<button type="button" class="fxt-d ${i===at?'on':''}" data-i="${i}"><span class="k">${p.d} · ${p.k}</span><span class="v">${m$(p.usd)}</span><span class="k">€1 = $${p.rate.toFixed(2)}</span><span class="g ${p.g<0?'bad':p.g>0?'good':''}">${i?(p.g>=0?'+':'')+m$(p.g)+(i<3?' unrealised':' realised'):'revenue booked'}</span></button>`).join('');
        cards.querySelectorAll('.fxt-d').forEach(b=>b.onclick=()=>{ at=+b.dataset.i; draw(); });
        const p=pts[at];
        const text=[`BraceWorks ships and invoices <strong>€40,000</strong>. Revenue: <strong>$44,000</strong>. Receivable: $44,000. This revenue figure won't change, whatever the euro does next.`,
          `Month-end. The receivable is still €40,000 but now worth ${m$(p.usd)}. The ${p.g<0?'loss':'gain'} of ${m$(Math.abs(p.g))} goes into May's profit as an <strong>unrealised</strong> exchange ${p.g<0?'loss':'gain'}. No money has moved.`,
          `Another month-end. Revalued again to ${m$(p.usd)}: a further ${p.g<0?'loss':'gain'} of ${m$(Math.abs(p.g))} in June's profit.`,
          `The customer pays €40,000, converted at ${p.rate.toFixed(2)} to ${m$(p.usd)}. The final difference of ${m$(Math.abs(p.g))} is a <strong>realised</strong> ${p.g<0?'loss':'gain'} in July.`][at];
        const tot=pts[3].usd-44000;
        info.innerHTML=`<p class="msg info" style="margin:0 0 12px">${text}</p><table class="jtbl"><tbody><tr><td>Revenue (May)</td><td class="v">$44,000</td></tr><tr><td>Exchange gains and losses: May, June, July</td><td class="v">${[1,2,3].map(i=>(pts[i].g>=0?'+':'')+m$(pts[i].g)).join(' · ')}</td></tr><tr class="hi"><td><strong>Total exchange ${tot<0?'loss':'gain'}</strong> = €40,000 × (${pts[3].rate.toFixed(2)} − 1.10)</td><td class="v"><strong>${m$(tot)}</strong></td></tr></tbody></table>`;
        plot([{label:'May',v:[pts[1].g],on:at===1},{label:'June',v:[pts[2].g],on:at===2},{label:'July',v:[pts[3].g],on:at===3}]);
      }
      ready=true; draw();
    }),
    K('What this means for your monthly pack',
      `<ul>
        <li><strong>Ask for exchange gains and losses on their own line</strong>, split into realised and unrealised. Unrealised amounts can reverse next month.</li>
        <li><strong>Ask for margins at budget rates</strong> ("constant currency") so you can see whether the business improved or only the euro moved.</li>
        <li><strong>Large foreign-currency balances mean large swings.</strong> A $300,000 euro receivables book moves about $3,000 for every cent the euro moves.</li>
       </ul>`),
    TIP('Which currency are your books kept in?',
      `<p>Your <span class="term">functional currency</span> is the currency of the main economy you operate in. A Philippine, Taiwanese or Chinese company often keeps its books in pesos, NT dollars or renminbi even if it sells in US dollars. Then <em>every</em> dollar receivable, dollar bank account and dollar loan is a foreign balance, revalued each month. Ask your accountant which currency the books are kept in. It decides which balances create gains and losses. Results of a foreign subsidiary are different again: translating them for group accounts goes to a reserve in equity, not to profit (Module 24).</p>`),
    Q('A €40,000 invoice is booked at 1.10 ($44,000). At month-end the rate is 1.07. What appears in that month\'s accounts?',[
      'Revenue is reduced to $42,800','Revenue stays $44,000; an unrealised exchange loss of $1,200 is booked','Nothing until the customer pays','A realised loss of $1,200'],1,
      'Revenue is fixed at the rate on the day of the sale. The receivable is revalued to $42,800, and the $1,200 difference is an unrealised loss.'),
    Q('Which of these is NOT revalued at the month-end rate?',['A euro bank account','A US dollar loan in a peso company\'s books','Foam bought in euros and still in stock','A euro payable to a supplier'],2,
      'Stock is a non-money item. It stays at the rate when it was bought; only money owed, owing or held in a foreign currency is revalued.')
  ]},
  /* ---------------------------------------------------------------- 6 */
  {id:'leases', label:'Leases', kind:'play', title:'Leases: rent, or debt?', blocks:[
    `<p>BraceWorks rents its factory and office for <strong>$3,000 a month</strong>, with five years left on the lease. The same lease looks very different depending on the rulebook. Under full IFRS (IFRS 16) the lease is a <strong>debt</strong>: BraceWorks has promised to pay $180,000, so it records a <span class="term">lease liability</span> for today's value of those payments and an equal <span class="term">right-of-use asset</span>, then depreciates the asset and pays interest on the liability.</p>`,
    W('One lease, three rulebooks', function(el,ctx){
      const R=0.064/12, N=60, PAY=3000; const PV=PAY*(1-Math.pow(1+R,-N))/R; let bal=PV; const INT=[], PRIN=[];
      for(let y=0;y<5;y++){ let i=0,p=0; for(let m=0;m<12;m++){ const it=bal*R; i+=it; p+=PAY-it; bal-=PAY-it; } INT.push(i); PRIN.push(p); }
      const DEP=PV/5;
      const C={
        rent:{n:'Rent (SME standards)',ebitda:132000,dep:38000,int:14000,liab:0,nd:178000,cfo:33000,cff:20000},
        ifrs:{n:'IFRS 16',ebitda:168000,dep:38000+DEP,int:14000+INT[0],liab:PV,nd:178000+PV,cfo:33000+36000-INT[0],cff:20000-PRIN[0]},
        us:{n:'US GAAP',ebitda:132000,dep:38000,int:14000,liab:PV,nd:178000,cfo:33000,cff:20000}};
      Object.values(C).forEach(c=>{ c.pbt=c.ebitda-c.dep-c.int-6000; });
      let mode='ifrs';
      const seg=E('div'), tab=E('div'), out=E('div'), chart=E('div'); el.append(seg,tab,out,E('h4',null,'Cost in the P&amp;L, year by year'),chart);
      seg.style.marginBottom='10px';
      ctx.ui.seg(seg,[{v:'rent',label:'Rent (SME standards)'},{v:'ifrs',label:'On the balance sheet (IFRS 16)'},{v:'us',label:'US GAAP'}],'ifrs',v=>{ mode=v; draw(); });
      const rows=[['EBITDA','ebitda'],['Depreciation','dep'],['Interest','int'],['Profit before tax, year 1','pbt'],['Lease liability on day one','liab'],['Net debt','nd'],['Net debt ÷ EBITDA','ratio'],['Operating cash flow, year 1','cfo'],['Financing cash flow, year 1','cff']];
      function draw(){
        const a=C.rent, b=C[mode]; a.ratio=a.nd/a.ebitda; b.ratio=b.nd/b.ebitda;
        const f=(k,v)=>k==='ratio'?v.toFixed(2)+'×':m$(v);
        tab.innerHTML=`<table class="jtbl"><thead><tr><th></th><th class="v">Rent</th><th class="v">${b.n}</th></tr></thead><tbody>${rows.map(([l,k])=>`<tr class="${Math.abs(a[k]-b[k])>0.5?'hi':''}"><td>${l}</td><td class="v">${f(k,a[k])}</td><td class="v">${f(k,b[k])}</td></tr>`).join('')}</tbody></table>`;
        out.innerHTML=`<p class="w-hint" style="margin-top:10px">${mode==='rent'?'The lease is just a $36,000 cost in operating expenses. Nothing on the balance sheet but a note of the commitment.':mode==='ifrs'?`EBITDA jumps by $36,000 because rent disappears, replaced by depreciation and interest, which sit below EBITDA. Debt rises by ${m$(PV)}, so net debt ÷ EBITDA goes from 1.35× to ${C.ifrs.ratio.toFixed(2)}×. Profit is a little lower in the early years. Cash is identical, but ${m$(PRIN[0])} of it moves from operating to financing.`:`The lease is on the balance sheet as a liability of ${m$(PV)}, but the P&amp;L still shows one straight-line lease cost of $36,000, so EBITDA and cash flows look like rent. Many loan agreements leave these operating lease liabilities out of debt; check yours.`}</p>`;
      }
      draw();
      const plot=cols(chart,{series:[{name:'Rent',cls:'mut'},{name:'IFRS 16: depreciation + interest',cls:'s1'}],label:'Lease cost by year',fmt:v=>m$(v)});
      plot([1,2,3,4,5].map((y,i)=>({label:'Year '+y,v:[36000,DEP+INT[i]]})));
      chart.appendChild(E('p','w-hint',`Same $180,000 in total over five years. Under IFRS 16 the cost is front-loaded, because interest is highest while the debt is largest.`));
    }),
    {t:'tbl', head:['Rulebook','Leases on the balance sheet?'], rows:[
      ['Full IFRS and full PFRS (IFRS 16), Taiwan-IFRS, China ASBE','Yes, almost all leases over 12 months, except low-value items'],
      ['US GAAP (Topic 842)','Yes, but operating leases keep a single straight-line cost in the P&amp;L'],
      ['UK FRS 102','Yes, for years starting on or after 1 January 2026 (it used to be rent)'],
      ['IFRS and PFRS for SMEs, PFRS for Small Entities, China\'s small-business standards, Taiwan\'s standards for non-listed companies (EAS)','No: most property leases are still treated as rent, with the commitment shown in a note']
    ]},
    TIP('Ask how your bank covenants treat leases',
      `<p>If BraceWorks moved to full IFRS, its net debt ÷ EBITDA would jump overnight with no change in the business. Many loan agreements fix the definitions to the rules in force when the loan was signed ("frozen GAAP") or exclude lease liabilities. Find out before the auditor or the bank does.</p>`),
    Q('A company adopts IFRS 16 for its factory lease. Which is true in the first year?',[
      'EBITDA falls','EBITDA rises, debt rises, and total cash paid is unchanged','Cash flow improves by the rent saved','Nothing changes'],1,
      'Rent leaves EBITDA; depreciation and interest replace it below EBITDA. The lease liability adds to debt. The cash paid to the landlord is the same.')
  ]},
  /* ---------------------------------------------------------------- 7 */
  {id:'rules', label:'Rulebooks and tax', kind:'learn', title:'Which rulebook, the tax line, and IFRS 18', blocks:[
    `<p>Every set of accounts follows a rulebook, called the accounting framework. It's named in the first note, and it decides several of the judgement calls in this module before anyone makes them. Small and large companies in the same country often follow different ones.</p>`,
    {t:'tbl', head:['Country','Listed, public and large companies','Most private small and medium companies'], rows:[
      ['<strong>Philippines</strong>','Full PFRS: listed companies, and others with assets over PHP 350 million or liabilities over PHP 250 million','PFRS for SMEs (assets PHP 100–350 million or liabilities PHP 100–250 million); PFRS for Small Entities (assets or liabilities PHP 3–100 million). Micro entities may use the tax basis'],
      ['<strong>Taiwan</strong>','Taiwan-IFRSs, as endorsed by the Financial Supervisory Commission, for all public companies','Enterprise Accounting Standards (EAS), including large private companies'],
      ['<strong>China</strong>','Accounting Standards for Business Enterprises (ASBE), close to IFRS','ASBE, or the Accounting Standards for Small Business Enterprises'],
      ['<strong>United States</strong>','US GAAP','US GAAP, with some private-company simplifications; some small firms report on a tax or cash basis'],
      ['<strong>United Kingdom</strong>','UK-adopted IFRS for listed groups','FRS 102 (with reduced disclosure for small companies); FRS 105 for micro-entities']
    ]},
    `<p class="small" style="color:var(--muted)">Thresholds and options change. Check the current rules with your auditor. BraceWorks, with about $845,000 of assets (roughly PHP 50 million), is in the Philippine Small Entities band. Small entities may use PFRS for SMEs or full PFRS in specified cases, for example as part of a group that does; in this course BraceWorks follows PFRS for SMEs.</p>`,
    {t:'tbl', head:['The same question…','Full IFRS','SME standards','US GAAP'], rows:[
      ['Development costs','Capitalise once six tests are met','Expense','Expense'],
      ['Property leases','On the balance sheet','Usually rent','On the balance sheet, single lease cost'],
      ['Stock costing: LIFO allowed?','No','No','Yes'],
      ['Revalue land and buildings upward?','Allowed','Allowed','No'],
      ['Write back an impairment if things improve?','Yes, except goodwill','Yes, except goodwill','No'],
      ['Goodwill','Not amortised; tested yearly','Amortised, usually over 10 years or less','Not amortised (private companies may elect to amortise)'],
      ['Deferred tax','Yes','Yes (some small-company frameworks, such as China\'s, record only tax payable)','Yes']
    ]},
    K('Why it matters to a GM',
      `<p>Comparing BraceWorks with a competitor's published accounts, a buyer's valuation model or a bank's covenant? Check they use the same rulebook. A switch to full IFRS, for example before selling the business or listing, changes EBITDA, debt and equity without changing anything real.</p>`),
    `<h3>Why tax isn't simply rate × profit</h3>
     <p>Module 19 explained that taxable profit follows its own rules. In the accounts, those differences show up in two places: the <strong>effective tax rate</strong> and <strong>deferred tax</strong>. Here's next year's draft for BraceWorks: profit before tax $90,000, tax $25,300. That's 28.1%, not 25%. The tax note reconciles the two:</p>`,
    {t:'fig', title:'From the headline rate to the effective rate', render:function(box,ctx){
      box.innerHTML=ctx.ui.bridge([{label:'Tax at 25% on $90,000',v:22500,total:true},{label:'Fines and entertainment not deductible',v:1000},{label:'German sales office loss: no tax relief yet',v:3000},{label:'Export incentive on part of profit',v:-2600},{label:'Last year\'s tax under-provided',v:1400},{label:'Tax charge: 28.1%',v:25300,total:true}]);
    }, caption:'Each step is a question to ask. Permanent items (fines) raise the rate for good. Losses abroad that can\'t yet be used are a sign the new office is costing more than it looks.'},
    `<p><strong>Deferred tax</strong> appears when the tax rules and the accounts put the same cost in different years. Here's BraceWorks' new $60,000 foam cutter. The accounts depreciate it over 10 years. Suppose the tax rules let BraceWorks deduct it over 5. Move through the years:</p>`,
    W('Tax paid later, not saved', function(el,ctx){
      const COST=60000, BK=6000, TX=12000, RATE=0.25;
      const top=E('div'), chart=E('div'), chart2=E('div'), out=E('div'); el.append(top,chart,E('h4',null,'Deferred tax liability at each year-end'),chart2,out);
      let yr=1, timer=null, ready=false;
      const ctl=ctx.ui.sliders(top,[{k:'y',label:'Year',min:1,max:10,step:1,v:1,f:v=>'Year '+v}],v=>{ yr=v.y; if(ready) draw(); },ctx.uid);
      const pb=E('button','btn small','Play ▶'); pb.type='button'; pb.style.marginTop='8px'; top.appendChild(pb);
      const plot=cols(chart,{series:[{name:'Depreciation in the accounts',cls:'s1'},{name:'Deduction for tax',cls:'s2'}],label:'Depreciation and tax deduction by year',fmt:v=>m$(v),height:130});
      const plot2=cols(chart2,{series:[{name:'Deferred tax liability',cls:'s4'}],label:'Deferred tax liability by year',fmt:v=>m$(v),height:110,max:7500});
      function draw(){
        const ys=[1,2,3,4,5,6,7,8,9,10];
        plot(ys.map(y=>({label:String(y),v:[BK,y<=5?TX:0],on:y===yr})));
        const diff=y=>Math.max(0,Math.min(y,5)*TX-y*BK);
        plot2(ys.map(y=>({label:String(y),v:[y<=yr?diff(y)*RATE:0],on:y===yr})));
        const d=diff(yr);
        out.innerHTML=`<div class="stats" style="margin-top:8px">${ctx.ui.stat('Book value in the accounts',m$(COST-BK*yr))}${ctx.ui.stat('Value left for tax',m$(Math.max(0,COST-TX*yr)))}${ctx.ui.stat('Deferred tax liability',m$(d*RATE),'','25% of the gap')}</div>
          <p class="w-hint" style="margin-top:10px">${yr<=5?`So far BraceWorks has deducted ${m$(Math.min(yr,5)*TX)} for tax but only ${m$(yr*BK)} in the accounts, paying ${m$(d*RATE)} less tax than the accounts\' profit suggests. That tax isn\'t saved: it\'s owed later, so the accounts carry it as a liability.`:`From year 6 there\'s nothing left to deduct for tax, but the accounts still charge $6,000 a year. Taxable profit is now higher than accounting profit, and the liability unwinds: ${yr<10?m$(d*RATE)+' left.':'gone by year 10.'}`}</p>`;
      }
      function stop(){ if(timer){ clearInterval(timer); timer=null; pb.textContent='Play ▶'; } }
      pb.onclick=()=>{ if(timer){ stop(); return; } const inp=top.querySelector('input[type=range]'); let y=0; pb.textContent='Pause ❚❚'; const step=()=>{ y++; inp.value=y; inp.dispatchEvent(new Event('input')); if(y>=10) stop(); }; if(calm()){ y=9; step(); return; } step(); timer=setInterval(()=>{ if(!el.isConnected){ stop(); return; } step(); },900); };
      ready=true; draw();
    }),
    K('Deferred tax assets need a closer look',
      `<p>The reverse happens too. A warranty provision is charged now but is usually deductible only when claims are paid; tax losses can be carried forward. Those create <strong>deferred tax assets</strong>: tax you expect to save later. They're only worth something if there will be enough future profit to use them. A large deferred tax asset in a loss-making company is a forecast, not money: ask what profits it assumes.</p>`),
    `<h3>Coming in 2027: IFRS 18 changes the layout</h3>
     <p>From years starting on or after <strong>1 January 2027</strong>, companies reporting under full IFRS replace the old presentation rules with <strong>IFRS 18</strong>, with last year's figures restated to match. Countries adopt it on their own timetables: the Philippines (full PFRS) from 2027, Taiwan-IFRS companies from 2028, and China's ASBE hasn't adopted it yet. Nothing about how much profit you make changes. What changes is where things sit. Here's BraceWorks' income statement laid out the new way.</p>`,
    {t:'fig', title:'BraceWorks\' income statement under IFRS 18', intro:'Press <strong>Play</strong> to see the new categories.',
      steps:[
        {k:['op'],t:'<strong>Operating</strong> comes first: the main business, and anything not classified elsewhere. It ends in a required subtotal, <strong>operating profit</strong>.'},
        {k:['op','fx'],t:'Exchange differences follow the item that caused them. BraceWorks\' $6,000 loss arose on customer balances, so it moves <strong>up</strong> into operating. Operating profit is $88,000, not the $94,000 shown today.'},
        {k:['inv'],t:'<strong>Investing</strong>: returns from investments and spare cash, such as interest on deposits. BraceWorks has none, so the second required subtotal, <strong>profit before financing and income taxes</strong>, is also $88,000.'},
        {k:['fin'],t:'<strong>Financing</strong>: interest on loans and leases. $14,000, giving profit before tax of $74,000, the same as before.'},
        {k:['tax'],t:'<strong>Income taxes</strong>, then profit for the year: $55,500. Unchanged.'},
        {k:['mpm'],t:'<strong>Your own measures.</strong> If a company uses its own profit measure in public, such as "adjusted EBITDA" in a results release, it must define it and reconcile it to the IFRS subtotals in a note.'},
        {k:['cf'],t:'<strong>The cash flow statement</strong> changes too: the indirect method starts from operating profit, interest and dividends paid go to financing, and interest and dividends received go to investing.'}],
      draw:function(w){
        const R=[['op','Revenue','1,200,000'],['op','Cost of goods sold','(860,000)'],['op','Selling expenses','(86,000)'],['op','Administrative expenses','(160,000)'],['op fx','Exchange loss on customer balances','(6,000)'],['op','Operating profit','88,000',1],['inv','Income from investments','–'],['inv','Profit before financing and income taxes','88,000',1],['fin','Interest on bank loans','(14,000)'],['fin','Profit before tax','74,000',1],['tax','Income tax','(18,500)'],['tax','Profit for the year','55,500',1]];
        const CAT={op:'Operating',inv:'Investing',fin:'Financing',tax:'Income taxes'};
        const narrow=w<520, cw=narrow?20:96, rh=22, x1=cw+8, top=4; let g='', y=top, prev=null, start=top;
        const band=(k,y0,y1)=>`<g data-k="${k}"><rect x="2" y="${P.f(y0)}" width="${cw-4}" height="${P.f(y1-y0-3)}" rx="6" class="v-node hl"/>${narrow?'':P.lines(cw/2,(y0+y1)/2-2,P.wrap(CAT[k],11),'v-t','middle',14)}</g>`;
        R.forEach((r,i)=>{ const k=r[0].split(' ')[0]; if(prev&&k!==prev){ g+=band(prev,start,y); y+=6; start=y; } prev=k;
          g+=`<g data-k="${r[0]}">${r[3]?`<line x1="${x1}" x2="${w-4}" y1="${y+2}" y2="${y+2}" class="v-edge"/>`:''}${P.txt(x1+4,y+15,r[1],r[3]?'v-t':'v-s','start')}${P.txt(w-6,y+15,r[2],r[3]?'v-t':'v-s','end')}</g>`; y+=rh; });
        g+=band(prev,start,y); y+=10;
        const L1=P.nodeLines(w-8,'Note: management-defined performance measures','e.g. "adjusted EBITDA" used in public, defined and reconciled'); g+=`<g data-k="mpm">${P.node(4,y,w-8,L1.h,L1,'')}</g>`; y+=L1.h+8;
        const L2=P.nodeLines(w-8,'Cash flow statement','starts from operating profit; interest paid in financing'); g+=`<g data-k="cf">${P.node(4,y,w-8,L2.h,L2,'')}</g>`; y+=L2.h+4;
        return P.svg(w,y,'BraceWorks income statement grouped into operating, investing, financing and income tax categories, with operating profit of 88,000.',g);
      }, caption:'Same profit, new order. The exchange loss moves into operating profit, and interest is separated into financing.'},
    `<p>Companies on the SME standards, US GAAP or FRS 102 aren't affected. If yours reports under full IFRS or full PFRS, expect the layout of your accounts to change from 2027 (2028 for Taiwan-IFRS), and with it your EBIT figure. Check whether any bonus or loan covenant is defined by a line that moves.</p>`,
    Q('Under IFRS 18, where does an exchange loss on euro customer receivables go?',['Financing, with interest','Operating, because the receivables come from operating activities','Below profit before tax','Straight to equity'],1,
      'Exchange differences go in the same category as the item that caused them. Customer balances are operating.'),
    Q('BraceWorks\' draft shows a tax rate of 28.1% against a headline 25%. Which is the most useful question?',['Why do we pay so much tax?','Can I see the reconciliation from 25% to 28.1%, item by item?','Can we use 25% instead?','Is the auditor wrong?'],1,
      'The tax note reconciles the headline and effective rates. Each line is either permanent (fines) or a sign of something to manage (losses abroad that can\'t be used, a prior-year error).')
  ]},
  /* ---------------------------------------------------------------- 8 */
  {id:'notes', label:'In the notes', kind:'apply', title:'Where the judgement is written down', blocks:[
    `<p>Module 18 showed what to read in your own audited accounts. Every judgement call in this module leaves a trail in the notes. Here's where to look:</p>`,
    {t:'tbl', head:['You want to know…','Look in'], rows:[
      ['Which rulebook, and whether the business is a going concern','Note 1: basis of preparation'],
      ['When revenue counts; how stock, development and leases are measured','Accounting policies'],
      ['Which estimates were hardest, and how sensitive they are','Critical judgements and estimates'],
      ['How provisions moved: added, used, released','Provisions note'],
      ['Lease liabilities and when they fall due','Leases note'],
      ['Why the tax rate isn\'t the headline rate; deferred tax','Tax note'],
      ['Dividends, new shares, currency reserves','Statement of changes in equity (Module 4)'],
      ['"Adjusted" or "underlying" profit and what was taken out','Alternative performance measures, or under IFRS 18 a note on management-defined measures']
    ]},
    `<p>Now find the judgement calls in the real reports from Module 22. Open each page, then answer.</p>
     <p>${BW.reportBtn('arjo','bs','Open: Arjo 2024 balance sheet')} ${BW.reportBtn('arjo','debt','Open: Arjo net debt and exceptional items')}</p>`,
    Q('Arjo (full IFRS) shows lease liabilities of SEK 851 million non-current and 428 million current, out of SEK 5,453 million of interest-bearing liabilities. Roughly what share of its debt is leases?',['About 5%','About 23%','About 50%','None: leases aren\'t debt'],1,
      '851 + 428 = 1,279, which is about 23% of 5,453. Under IFRS 16, Arjo counts leases in its net debt. A competitor on US GAAP or SME standards would look less indebted.'),
    Q('Arjo reports "exceptional items" of SEK 126 million in 2024, including SEK 68 million of restructuring costs. Restructuring was SEK 72 million the year before too. What should you conclude?',['Exceptional items should always be ignored','Costs that recur every year aren\'t really exceptional; count them when judging underlying profit','Restructuring is never a real cost','Arjo made a mistake'],1,
      'Labels like "exceptional" are management\'s judgement. If they appear year after year, treat them as part of the normal cost of running the business.'),
    `<p>${BW.reportBtn('embla','notes','Open: Embla Medical selected notes')}</p>`,
    Q('When Embla bought Fior & Gentz, net assets acquired were USD 133.4 million, of which goodwill was USD 104.5 million. What does that mean?',['Most of the price was for expected growth, synergies and the team: things that can\'t be recognised as separate assets','Fior & Gentz had $104.5 million of cash','Goodwill is spread over 10 years as a cost','Embla overpaid by $104.5 million'],0,
      'Goodwill is the part of the price not matched by identifiable assets. Customer relationships and technology were valued separately, as USD 31.1 million of other intangible assets. Under full IFRS it isn\'t amortised but tested for impairment every year, which is one of the biggest judgement calls in any acquirer\'s accounts. The note also shows a deferred tax liability: the acquired intangible assets were valued higher than their tax values.'),
    `<p>${BW.reportBtn('ivc22','gc','Open: Invacare 2022, note 1')}</p>`,
    Q('Invacare (US GAAP) filed its 2022 accounts after entering Chapter 11. On what basis were they prepared?',['A break-up basis','As a going concern, with substantial doubt disclosed','No basis: they were withdrawn','Cash basis'],1,
      'Accounts assume the business will carry on unless that\'s no longer realistic. When it\'s in doubt, the first note says so. Read Note 1 first in any company under strain.')
  ]},
  /* ---------------------------------------------------------------- 9 */
  {id:'case', label:'Case: the record year', kind:'case', title:'The record year that wasn\'t', blocks:[
    CASE('A very good January',
      `<p>It's mid-January. BraceWorks' new finance manager, keen to impress, sends the draft year-end accounts: profit before tax <strong>$148,600</strong>, double last year's $74,000, on sales up just 6%. The owner wants to announce bonuses on Friday.</p>
       <p>BraceWorks reports under <strong>PFRS for SMEs</strong>. You ask for the list of year-end entries and judgements. Six stand out. For each, decide: accept it as booked, or adjust it?</p>`),
    W('Restate the draft', function(el,ctx){
      const DRAFT=148600;
      const IT=[
        {t:'December shipment to Spain',d:'$36,000 of mattresses shipped DDP on 28 December, delivered 9 January, booked as December revenue. Profit effect: +$11,200.',adj:-11200,right:'adj',why:'Under DDP, control passes on delivery: January revenue. Take out the $36,000 of sales and put the mattresses back in stock.'},
        {t:'Testing costs capitalised',d:'$30,000 of testing and regulatory work on the bariatric mattress moved to the balance sheet, "because approval is almost certain".',adj:-30000,right:'adj',why:'BraceWorks follows PFRS for SMEs, which expenses all research and development. However good the prospects, it\'s a cost this year.'},
        {t:'Warranty provision released',d:'$6,000 of warranty provision released "because claims were low in the last quarter", while foam complaints are rising.',adj:-6000,right:'adj',why:'One quiet quarter isn\'t evidence, and the claim trend points the other way. Releasing it stores up a problem for next year.'},
        {t:'Machine lives extended',d:'Machine lives extended from 10 to 12 years, adding $6,300 to profit. A maintenance engineer\'s review shows the machines routinely run 12–14 years.',adj:-6300,right:'acc',why:'A change of estimate backed by evidence, applied from now on and disclosed. Fine to accept, but know that $6,300 of the improvement is a change of estimate, not better trading.'},
        {t:'Exchange gain',d:'An unrealised exchange gain of $4,500 on euro receivables, at the 31 December rate.',adj:-4500,right:'acc',why:'The rules require it: receivables are revalued at the year-end rate. Accept it, but tell the owner it isn\'t cash and may reverse.'},
        {t:'Distributor rebate',d:'No rebate accrued for US distributor A, "in case they don\'t qualify". Its purchases for the year were $610,000; the 5% tier starts at $600,000.',adj:-30500,right:'adj',why:'The year is over and the tier was reached: 5% × $610,000 = $30,500 is owed. Revenue must be reduced.'}];
      const S=ctx.state; S.rs=S.rs||{}; const st=S.rs;
      el.innerHTML=`<div class="rs-list"></div><div class="rs-run"><span>Draft $148,600 → your restated profit before tax: <b class="rs-p"></b></span><span class="rs-n"></span></div><div class="rs-end"></div><p style="margin-top:8px"><button type="button" class="linkbtn rs-reset">Start again</button></p>`;
      const list=el.querySelector('.rs-list');
      IT.forEach((it,i)=>{ const d=E('div','rs-i',`<h5>${i+1}. ${it.t}</h5><p>${it.d}</p><div class="rs-b"><button type="button" class="btn small ghost" data-c="acc">Accept as booked</button><button type="button" class="btn small ghost" data-c="adj">Adjust it</button></div><div class="rs-v" hidden></div>`); list.appendChild(d);
        const v=d.querySelector('.rs-v');
        const show=()=>{ const c=st[i]; if(!c) return; d.classList.add('done'); d.querySelectorAll('[data-c]').forEach(b=>{ b.disabled=true; b.setAttribute('aria-pressed',String(b.dataset.c===c)); if(b.dataset.c===c) b.classList.remove('ghost'); });
          const ok=c===it.right; v.hidden=false; v.className='rs-v '+(ok?'ok':'no'); v.innerHTML=`<strong>${ok?'Agreed.':'Think again.'}</strong> ${it.why}${it.right==='adj'?` Effect: ${m$(it.adj)}.`:''}`; };
        d.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{ st[i]=b.dataset.c; ctx.save(); show(); upd(); });
        show(); });
      function upd(){
        const p=DRAFT+IT.reduce((t,it,i)=>t+(st[i]==='adj'?it.adj:0),0), n=IT.filter((it,i)=>st[i]).length, right=IT.filter((it,i)=>st[i]===it.right).length;
        el.querySelector('.rs-p').textContent=m$(p); el.querySelector('.rs-n').textContent=`${n} of ${IT.length} decided`;
        const end=el.querySelector('.rs-end');
        if(n<IT.length){ end.innerHTML=''; return; }
        const steps=[{label:'Draft profit before tax',v:DRAFT,total:true}].concat(IT.filter(it=>it.right==='adj').map(it=>({label:it.t,v:it.adj}))).concat([{label:'Restated profit before tax',v:70900,total:true}]);
        end.innerHTML=`<div class="msg ${right===IT.length?'good':'warn'}" style="margin-top:12px"><strong>${right} of ${IT.length} calls agreed.</strong> The supportable figure is <strong>$70,900</strong>, a little <em>below</em> last year's $74,000. The "record year" was a flat year with four optimistic entries.</div><div style="margin-top:12px">${ctx.ui.bridge(steps)}</div>`;
      }
      el.querySelector('.rs-reset').onclick=()=>{ Object.keys(st).forEach(k=>delete st[k]); ctx.save(); BW.go(ctx.mod.id,ctx.mod.sections.indexOf(ctx.sec)); };
      upd();
    }),
    Q('What should you do before Friday?',[
      {text:'Approve the bonuses: the auditors will catch anything wrong', why:'Bonuses paid on overstated profit are very hard to claw back, and the audit comes months later.'},
      {text:'Fire the finance manager', why:'Nothing here is hidden: each entry was listed when you asked. It looks like optimism under pressure, not fraud. Coach first.'},
      {text:'Sit down with the finance manager, agree the adjustments that are needed, set bonuses on the restated figure, and agree a written policy for rebates, warranties and development costs'},
      {text:'Ask the bank what it thinks', why:'The bank will see the audited accounts. Get them right first.'}],2,
      'The four entries share a pattern: each pushes profit up, and each is the kind of call that should be agreed in advance. A short written policy (what to accrue, how to set the warranty rate, what may be capitalised) takes the pressure out of next year-end.'),
    TIP('Make the judgements visible every month',
      `<p>Ask for a one-page schedule in the monthly pack listing the main estimates (rebates, warranty, stock, bad debts, anything capitalised), their balance, and any change in the method. It takes finance ten minutes and saves arguments at year-end.</p>`)
  ]},
  /* ---------------------------------------------------------------- 10 */
  {id:'quiz', label:'Quiz', kind:'quiz', title:'Check your understanding', blocks:[
    Q('Which of these is a counted figure, rather than an estimate?',['The warranty provision','The bad debt allowance','The balance in the euro bank account','Depreciation'],2,'It\'s on a bank statement. Its dollar value moves with the exchange rate, but the euros are counted.'),
    Q('A distributor\'s rebate depends on its full-year purchases. When should BraceWorks reduce revenue for it?',['When the rebate is paid','As the purchases happen, at the expected rate, updated each quarter','At year-end only','Never: rebates are a selling expense'],1,'Revenue is the amount you expect to keep. Estimate the rebate as you go.'),
    Q('Goods shipped DAP on 29 December arrive on 5 January. Which year\'s revenue are they?',['This year: they\'ve left the factory','Next year: under DAP, control passes on arrival','Split between the two','Whichever the customer prefers'],1,'Under D-terms, BraceWorks carries the goods to the destination; control passes there.'),
    Q('Under full IFRS, BraceWorks capitalises $30,000 of development and amortises it over 5 years. Compared with expensing it, total profit over the five years is…',['$30,000 higher','The same: only the timing differs','$30,000 lower','$6,000 higher'],1,'Capitalising moves cost between years. The total, and the cash, are unchanged.'),
    Q('Which needs a provision at year-end?',['A recall announced to distributors in December','A planned rebrand next year','A lawsuit the lawyers expect to win','Next year\'s salary rises'],0,'The announcement created an obligation from a past event (the faulty braces sold). The others are either future plans or only possible.'),
    Q('Under IFRS 16, a $3,000-a-month factory lease will…',['Reduce EBITDA','Raise EBITDA and add a lease liability to debt','Change total cash paid','Disappear from the accounts'],1,'Rent is replaced by depreciation and interest, both below EBITDA, and the liability is debt.'),
    Q('BraceWorks\' accounts show a deferred tax liability. What does it mean?',['Tax that is overdue','Tax postponed by faster tax deductions, which will be paid later','A tax refund due','A penalty'],1,'Timing differences reverse. The liability is the tax that will become payable as they do.'),
    Q('From 2027, under IFRS 18, the indirect cash flow statement starts from…',['Revenue','Profit after tax','Operating profit','EBITDA'],2,'And interest paid moves to financing, interest received to investing.')
  ]},
  /* ---------------------------------------------------------------- 11 */
  {id:'apply', label:'Practice', kind:'apply', title:'Use it on your own accounts', blocks:[
    `<p>Optional. Next time you read your own monthly pack or annual accounts, check these. Nothing here is shared or sent; ticks are saved only in this browser.</p>`,
    CHECK('m24-judge','In our accounts…',[
      'I know which rulebook we follow, and how it treats leases and development costs',
      'Rebates, returns and discounts are estimated monthly, not when paid',
      'There\'s a written cut-off rule for shipments at month-end, by Incoterm',
      'The warranty provision rate is checked against actual claims at least quarterly',
      'I can see what was capitalised this year, item by item',
      'Exchange gains and losses are shown separately, realised and unrealised',
      'Changes in estimates are listed, with their effect on profit',
      'The tax charge is reconciled from the headline rate, and I know what any deferred tax asset relies on'
    ]),
    REPORT('Your Monday-morning question',
      `<p>Ask: <strong>"Which three estimates in our accounts move profit the most, and what would a reasonable change in each do?"</strong> A good answer names them and gives dollar figures. "Everything's standard" isn't an answer.</p>`),
    K('Takeaways',
      `<ul>
        <li>Cash is counted; most other figures involve judgement. Six reasonable estimates can move profit by a factor of three without touching cash.</li>
        <li>Revenue counts when control passes, at the amount you expect to keep after rebates and returns.</li>
        <li>Capitalising moves cost between years. Which rulebook you follow often decides it for you.</li>
        <li>Provisions should fill and drain with reality. Watch for releases in weak years.</li>
        <li>Currency moves create gains and losses after the sale; revenue doesn\'t change.</li>
        <li>Leases, deferred tax and IFRS 18 change how the numbers look, not what the business earns. Know which apply to you.</li>
       </ul>`)
  ]}
  ],
  warnings:[
    {sign:'Sales spiking at every quarter-end, then credit notes', meaning:'Channel stuffing: revenue pulled forward from the next period.', look:'Sales by week; credit notes in the first month of each quarter; distributor stock.'},
    {sign:'No rebate accrual until rebates are paid', meaning:'Revenue overstated through the year, with a hit when the rebate is settled.', look:'Rebate agreements and purchases to date against each tier.'},
    {sign:'Capitalised development growing while launches slip', meaning:'Costs parked on the balance sheet; a write-off may be coming.', look:'Project list with dates, spend to date and approval status.'},
    {sign:'Provisions released in a weak year', meaning:'Profit being smoothed with an earlier "cookie jar".', look:'Provisions note: the "released" line, against claims history.'},
    {sign:'Profit swings that track the euro', meaning:'Unhedged foreign-currency balances being revalued.', look:'Exchange gains and losses, realised and unrealised; balances by currency.'},
    {sign:'A large deferred tax asset in a loss-making company', meaning:'It relies on future profits that may not come.', look:'Tax note; the profit forecast behind it.'}
  ],
  formulas:[
    {name:'Lease liability (present value)', f:'Payment × (1 − (1 + r)^−n) ÷ r, with r the monthly rate and n the months left', ex:'$3,000 × (1 − 1.00533^−60) ÷ 0.00533 ≈ $153,700'},
    {name:'Unrealised exchange gain or loss', f:'Foreign balance × (Month-end rate − Previous rate)', ex:'€40,000 × (1.08 − 1.10) = ($800)'},
    {name:'Deferred tax liability', f:'(Tax deductions so far − Accounting depreciation so far) × Tax rate', ex:'Year 3: ($36,000 − $18,000) × 25% = $4,500'},
    {name:'Warranty provision charge', f:'Sales under warranty × Expected claim rate', ex:'$42,000 × 1.5% = $630 a month'}
  ],
  glossary:[
    {term:'Revenue recognition', def:'The rules for when a sale counts as revenue (when control passes) and how much (after expected rebates and returns).'},
    {term:'Performance obligation', def:'A distinct promise in a contract, such as goods, training or an extended warranty. Each is recognised as revenue when delivered.'},
    {term:'Contract liability', def:'Money received or billed for something not yet delivered, such as a deposit or a prepaid extended warranty.'},
    {term:'Variable consideration', def:'Parts of a price that depend on later events, such as rebates, returns or penalties. Estimated when revenue is booked.'},
    {term:'Bill-and-hold', def:'A sale invoiced but kept at the seller\'s premises at the customer\'s request. Revenue only if strict conditions are met.'},
    {term:'Consignment stock', def:'Stock held by a distributor that still belongs to the supplier until the distributor sells it.'},
    {term:'Channel stuffing', def:'Pushing extra stock onto distributors at period-end to inflate sales, often with discounts or long terms.'},
    {term:'Capitalise', def:'To record a cost as an asset on the balance sheet and spread it over the years it benefits, instead of expensing it now.'},
    {term:'Amortisation', def:'Spreading the cost of an intangible asset, such as capitalised development, over its useful life.'},
    {term:'Field safety corrective action', def:'Action a device maker takes to reduce risk from a device already on the market, such as a recall or a modification, reported to regulators.'},
    {term:'Contingent liability', def:'A possible obligation that depends on a future event, such as a legal claim, disclosed in the notes.'},
    {term:'Unrealised exchange gain or loss', def:'The change in value of a foreign-currency balance from revaluing it at the month-end rate, before it is paid.'},
    {term:'Functional currency', def:'The currency of the main economy a company operates in, in which it keeps its books.'},
    {term:'Lease liability', def:'Under full IFRS or PFRS, the debt-like obligation to pay future lease payments.'},
    {term:'Right-of-use asset', def:'Under full IFRS or PFRS, the asset recorded for the right to use a leased item, alongside a lease liability.'},
    {term:'Accounting framework', def:'The set of rules the accounts follow, such as full PFRS, PFRS for SMEs or IFRS.'},
    {term:'Deferred tax', def:'Tax that will be paid or saved in future because of timing differences between accounting and tax rules.'},
    {term:'Effective tax rate', def:'Total tax expense divided by profit before tax.'},
    {term:'IFRS 18', def:'The IFRS standard on presenting financial statements, effective from 2027: new operating, investing and financing categories in the income statement.'},
    {term:'Management-defined performance measure', def:'Under IFRS 18, a company\'s own profit measure used in public (such as adjusted EBITDA), which must be defined and reconciled in the notes.'},
    {term:'Change in accounting estimate', def:'A revised judgement, such as a longer machine life, applied from now on and disclosed, without restating past years.'}
  ]
});
})();
