/* ===== Figures placed into the modules ===== */
(function(){
'use strict';
const V=BW.viz, H=BW.h, UI=BW.ui, P=V.p;
const {money,pct,kfmt,signed}=H;
const {wrap,txt,lines,arrow,head,badge,svg,nodeLines,node,f}=P;
const k$=x=>kfmt(x);
const pc1=x=>x.toFixed(1)+'%';
const pc0=x=>Math.round(x)+'%';

/* ---------- placement helper: insert a figure next to a block, found by its text */
function textOf(b){ if(typeof b==='string') return b; if(!b) return ''; return [b.title,b.html,b.q,b.prompt,b.label,b.intro,(b.head||[]).join(' '),(b.cards||[]).map(c=>c.f).join(' ')].filter(Boolean).join(' '); }
function put(id,secId,where,block){
  const m=BW.mods[id]||BW.packs[id]; if(!m){ console.error('visuals: no module '+id); return; }
  const sec=m.sections.find(s=>s.id===secId); if(!sec){ console.error('visuals: no section '+id+'.'+secId); return; }
  const b=Object.assign({t:'fig'},block);
  if(where.start){ sec.blocks.unshift(b); return; }
  if(where.end){ sec.blocks.push(b); return; }
  const needle=where.after||where.before||where.replace;
  const i=where.at!=null?where.at:sec.blocks.findIndex(x=>textOf(x).includes(needle));
  if(i<0){ console.error('visuals: anchor not found in '+id+'.'+secId+': '+needle); return; }
  if(where.replace){ if(sec.blocks[i].t==='quiz'){ console.error('visuals: refusing to replace a quiz'); return; } sec.blocks[i]=Object.assign(b,{t:'fig'}); return; }
  sec.blocks.splice(where.after?i+1:i,0,b);
}
/* Replacing a non-fig block would shift saved keys, so replacements reuse the old block's slot as a widget-like block */
function swap(id,secId,needle,block){
  const m=BW.mods[id]||BW.packs[id]; const sec=m&&m.sections.find(s=>s.id===secId); if(!sec){ console.error('visuals: swap target missing '+id+'.'+secId); return; }
  const i=(typeof needle==='object'&&needle)?needle.at:sec.blocks.findIndex(x=>textOf(x).includes(needle)); if(i<0){ console.error('visuals: swap anchor not found '+id+'.'+secId); return; }
  const b=Object.assign({t:'fig'},block); const keepCount=sec.blocks[i].t!=='fig';
  sec.blocks[i]=b; if(keepCount) sec.blocks.splice(i,0,{t:'nop'}); // invisible placeholder keeps later saved keys unchanged
}

const FOCUS=V.flow;

/* =================================================================== HOME */
BW.homeFig=function(){
  const fig=document.createElement('figure'); fig.className='fig'; fig.style.marginTop='16px';
  fig.innerHTML='<div class="fig-t">BraceWorks\' money loop</div>';
  const box=document.createElement('div'); box.className='fig-body'; fig.appendChild(box);
  V.mount(box,V.cycle({label:'Cash goes out to buy materials and pay wages, sits in stock, becomes a customer debt, and only then comes back as cash: 113 days on average.',
    nodes:[{t:'Cash in the bank',k:'c'},{t:'Buy foam and fabric',s:'suppliers give us 63 days'},{t:'Make and store',s:'106 days as stock'},{t:'Ship and invoice',s:'customer owes us'},{t:'Customer pays',s:'after 70 days'}],
    center:{big:'113 days',sub:'cash is tied up on each lap'}}));
  const cap=document.createElement('figcaption'); cap.textContent='Every dollar BraceWorks spends goes round this loop before it comes back. The course teaches you to read where it is at any moment, and how to make the loop faster.'; fig.appendChild(cap);
  return fig;
};

/* =================================================================== MODULE 1 */
put('m1','meet',{at:1,after:'Units last year'},{title:'Where BraceWorks\' $1.2M of sales comes from',
  html:V.stack({fmt:k$,inside:'pct',rows:[
    {label:'By product',parts:[{label:'Mattresses',v:504000,c:'s1'},{label:'Slings',v:324000,c:'s2'},{label:'Braces',v:364000,c:'s3'},{label:'Spares',v:8000,c:'s4'}]},
    {label:'By market',parts:[{label:'United States',v:480000,c:'s1'},{label:'Europe',v:420000,c:'s2'},{label:'Australia and Middle East',v:300000,c:'s3'}]}],
    keys:[{label:'Mattresses / United States',c:'s1'},{label:'Slings / Europe',c:'s2'},{label:'Braces / Australia and Middle East',c:'s3'},{label:'Spares',c:'s4'}]}),
  caption:'Mattresses bring in the most money; braces sell the most units at the lowest price. Hover or tap a segment for the figure.'});

put('m1','connect',{at:0,after:'Every business event touches'},{title:'How the three statements link together',
  render:function(box){
    const $=n=>(n<0?'(':'')+'$'+Math.abs(n).toLocaleString('en-US')+(n<0?')':''), sg=n=>(n>0?'+':'')+$(n);
    const IS=[['rev','Revenue',1200000],['cost','All costs, including $38,000 depreciation',-1144500],['np','Net profit',55500,1]];
    const CF=[['np','Net profit',55500,1],['dep','Add back depreciation',38000],['wc','Receivables and stock up',-75000],['ap','Owed to suppliers and others up',14500],['ops','Cash from operations',33000,1],['capex','New machine',-60000],['loan','Net new bank loans',20000],['chg','Change in cash',-7000,1],['cash0','Opening cash',49000,2],['cash1','Closing cash',42000,1]];
    const BS=[['cash','Cash',49000,42000],['wc','Receivables and stock',405000,480000],['pre','Prepayments',13000,13000],['mach','Machinery, after depreciation',288000,310000],['tot','Total assets',755000,845000,1],['ap','Owed to suppliers and others',119000,133500],['loan','Bank loans',200000,220000],['cap','Share capital',250000,250000],['re','Retained earnings',186000,241500],['tot2','Total liabilities and equity',755000,845000,1]];
    const ST=[
      {k:[],say:`Three reports, one set of numbers. Press <strong>Next</strong> to see the same figures turn up in more than one statement. Lines that light up together are the same money.`},
      {k:['is:np','cf:np','bs:re'],links:[['is:np','cf:np'],['cf:np','bs:re']],say:`<strong>Profit links all three.</strong> The income statement ends with net profit of $55,500. The cash flow statement starts from the same $55,500. And retained earnings on the balance sheet grow by exactly $55,500, from $186,000 to $241,500.`},
      {k:['is:cost','cf:dep','cf:capex','bs:mach'],links:[['is:cost','cf:dep'],['cf:dep','bs:mach'],['cf:capex','bs:mach']],say:`<strong>Machines.</strong> Depreciation of $38,000 was a cost in profit but no cash was paid, so the cash flow adds it back. The new machine cost $60,000 in cash. Together they explain the machinery line: $288,000 + $60,000 − $38,000 = <strong>$310,000</strong>.`},
      {k:['cf:wc','bs:wc','cf:ap','bs:ap'],links:[['cf:wc','bs:wc'],['cf:ap','bs:ap']],say:`<strong>Working capital.</strong> Receivables and stock grew by $75,000 ($405,000 to $480,000): that's cash tied up, shown as −$75,000 in the cash flow. BraceWorks owes suppliers and others $14,500 more ($119,000 to $133,500), which kept $14,500 in the bank.`},
      {k:['cf:loan','bs:loan'],links:[['cf:loan','bs:loan']],say:`<strong>Borrowing.</strong> Bank loans rose by $20,000 ($200,000 to $220,000): $40,000 more overdraft, less $20,000 repaid on the equipment loan. The same $20,000 appears as cash in from the bank.`},
      {k:['cf:cash0','cf:cash1','bs:cash','cf:chg'],links:[['cf:cash0','bs:cash'],['cf:cash1','bs:cash']],say:`<strong>Cash closes the loop.</strong> Opening cash of $49,000 is last year's balance sheet cash. Add the $7,000 fall and you get $42,000: exactly the cash on this year's balance sheet. <strong>Every line of the cash flow statement is the change in a balance sheet line</strong>, which is why all three always agree.`}
    ];
    const row=(pre,r,cols)=>`<div class="tri-r${r[r.length-1]===1?' t':''}" data-k="${pre}:${r[0]}"><span>${r[1]}</span>${cols}</div>`;
    box.innerHTML=`<div class="tri-ctl"><button type="button" class="btn ghost small tri-b">← Back</button><span class="tri-n"></span><button type="button" class="btn small tri-f">Next →</button></div>
      <div class="tri">
        <div class="tri-c" data-c="is"><h4>Income statement <small>this year</small></h4>${IS.map(r=>row('is',r,`<b>${$(r[2])}</b>`)).join('')}</div>
        <div class="tri-c" data-c="cf"><h4>Cash flow statement <small>this year</small></h4>${CF.map(r=>row('cf',r,`<b>${r[3]?$(r[2]):sg(r[2])}</b>`)).join('')}</div>
        <div class="tri-c" data-c="bs"><h4>Balance sheet <small>last year → this year</small></h4>${BS.map(r=>row('bs',r,`<i>${$(r[2])}</i><b>${$(r[3])}</b>`)).join('')}</div>
        <svg class="tri-lines" aria-hidden="true"></svg>
      </div>
      <div class="tri-say" aria-live="polite"></div>`;
    const grid=box.querySelector('.tri'), lines=box.querySelector('.tri-lines'), say=box.querySelector('.tri-say'); let n=0;
    function draw(){
      const s=ST[n]; grid.classList.toggle('is-on',n>0);
      grid.querySelectorAll('.tri-r').forEach(r=>r.classList.toggle('on',s.k.includes(r.dataset.k)));
      say.innerHTML=`<p>${s.say}</p>`; box.querySelector('.tri-n').textContent=n?`Link ${n} of ${ST.length-1}`:'Start';
      box.querySelector('.tri-b').disabled=n===0; const f=box.querySelector('.tri-f'); f.textContent=n===ST.length-1?'Start again':'Next →';
      wire();
    }
    function wire(){
      const s=ST[n], g=grid.getBoundingClientRect(); lines.setAttribute('width',g.width); lines.setAttribute('height',g.height); lines.innerHTML='';
      const cs=[...grid.querySelectorAll('.tri-c')].map(c=>c.getBoundingClientRect()); if(cs.length<3||Math.abs(cs[0].top-cs[1].top)>4) return;  /* stacked on narrow screens: highlight only */
      lines.innerHTML=(s.links||[]).map(([a,b])=>{ const A=grid.querySelector(`[data-k="${a}"]`).getBoundingClientRect(), B=grid.querySelector(`[data-k="${b}"]`).getBoundingClientRect();
        const x1=A.right-g.left+2, y1=A.top+A.height/2-g.top, x2=B.left-g.left-2, y2=B.top+B.height/2-g.top, mx=(x1+x2)/2;
        return `<path d="M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}"/><circle cx="${x1}" cy="${y1}" r="3"/><circle cx="${x2}" cy="${y2}" r="3"/>`; }).join('');
    }
    box.querySelector('.tri-b').onclick=()=>{ if(n>0){ n--; draw(); } };
    box.querySelector('.tri-f').onclick=()=>{ n=n===ST.length-1?0:n+1; draw(); };
    if(window.ResizeObserver) new ResizeObserver(()=>wire()).observe(grid); else window.addEventListener('resize',wire);
    draw();
  },
  caption:'Rule of thumb: profit connects the income statement to both of the others, and every line of the cash flow statement is the change in a balance sheet line.'});

put('m1','pl',{at:1,after:'BraceWorks Medical · Income statement'},{title:'Where every $100 of sales goes',
  html:V.stack({fmt:x=>'$'+x.toFixed(1),pct:false,minShow:6,rows:[{label:'',tipLabel:'Of every $100',parts:[
    {label:'Materials',v:46.0,c:'s1'},{label:'Factory labour and overhead',v:25.7,c:'s2'},{label:'Selling and admin',v:20.5,c:'s3'},{label:'Interest and tax',v:3.2,c:'s4'},{label:'Net profit',v:4.6,c:'good'}]}],
    keys:[{label:'Materials',v:'$46.00',c:'s1'},{label:'Factory labour and overhead',v:'$25.70',c:'s2'},{label:'Selling and admin',v:'$20.50',c:'s3'},{label:'Interest and tax',v:'$3.20',c:'s4'},{label:'Net profit',v:'$4.60',c:'good'}]}),
  caption:'Out of every $100 a customer pays, BraceWorks keeps $4.60. The green sliver at the end is why small cost and price changes matter so much.'});

put('m1','bs',{at:2,after:'The accounting equation'},{title:'Why it\'s called a balance sheet',
  draw:function(w){
    const W=Math.min(w,560), cx=w/2, beamY=26, panY=150, arm=W*0.34, bw=Math.min(150,W*0.3), unit=90/845000;
    const ha=845000*unit, hl=353500*unit, he=491500*unit;
    let g=`<line x1="${f(cx-arm)}" y1="${beamY}" x2="${f(cx+arm)}" y2="${beamY}" class="v-edge" style="stroke-width:4;stroke:var(--ink)"/>`;
    g+=`<polygon points="${f(cx)},${beamY} ${f(cx-24)},${panY+34} ${f(cx+24)},${panY+34}" class="v-f-muted"/><line x1="${f(cx-60)}" x2="${f(cx+60)}" y1="${panY+34}" y2="${panY+34}" class="v-edge" style="stroke:var(--ink);stroke-width:3"/>`;
    [[-1],[1]].forEach(([s])=>{ const px=cx+s*arm; g+=`<line x1="${f(px)}" y1="${beamY}" x2="${f(px-bw/2-6)}" y2="${panY}" class="v-edge"/><line x1="${f(px)}" y1="${beamY}" x2="${f(px+bw/2+6)}" y2="${panY}" class="v-edge"/><line x1="${f(px-bw/2-10)}" x2="${f(px+bw/2+10)}" y1="${panY}" y2="${panY}" class="v-edge" style="stroke:var(--ink);stroke-width:3"/>`; });
    const lx=cx-arm-bw/2, rx=cx+arm-bw/2;
    g+=`<rect x="${f(lx)}" y="${f(panY-ha)}" width="${f(bw)}" height="${f(ha)}" rx="6" class="v-node hl"/>`+txt(lx+bw/2,panY-ha/2-2,'Assets','v-t')+txt(lx+bw/2,panY-ha/2+14,'$845,000','v-s');
    g+=`<rect x="${f(rx)}" y="${f(panY-he)}" width="${f(bw)}" height="${f(he)}" rx="6" class="v-node good"/>`+txt(rx+bw/2,panY-he/2-2,'Equity','v-t')+txt(rx+bw/2,panY-he/2+14,'$491,500','v-s');
    g+=`<rect x="${f(rx)}" y="${f(panY-he-hl-2)}" width="${f(bw)}" height="${f(hl)}" rx="6" class="v-node warn"/>`+txt(rx+bw/2,panY-he-hl/2-4,'Liabilities','v-t')+txt(rx+bw/2,panY-he-hl/2+11,'$353,500','v-s');
    return svg(w,panY+42,'Assets of $845,000 balance liabilities of $353,500 plus equity of $491,500.',g);
  },
  caption:'Everything BraceWorks owns (left) was paid for by someone: lenders and suppliers, or the owners (right). The two sides always weigh the same.'});

/* =================================================================== MODULE 2 */
put('m2','chain',{at:0,after:'Every figure in your monthly pack started life'},{title:'Follow one invoice into the reports',
  intro:'Press <strong>Play</strong> to follow one real BraceWorks invoice from a piece of paper to your monthly report.',
  steps:[
    {k:['n0'],t:'BraceWorks ships 600 mattresses to the Australian hospital supplier. Sales raises <strong>invoice INV-5582 for $21,600</strong>. That\'s the source document.'},
    {k:['n0','e0','n1'],t:'The bookkeeper records a <strong>journal entry</strong>: debit Receivables $21,600, credit Sales $21,600. Accounting software usually does this automatically when the invoice is raised.'},
    {k:['n1','e1','n2'],t:'The entry is <strong>posted to the general ledger</strong>. The Receivables account and the Sales account each grow by $21,600.'},
    {k:['n2','e2','n3'],t:'At month-end every account balance is listed in the <strong>trial balance</strong>. Total debits equal total credits, so the books are consistent.'},
    {k:['n3','e3','n4'],t:'Finance arranges the balances into the <strong>statements</strong>. The $21,600 shows as revenue on the P&amp;L, and as a receivable on the balance sheet until the customer pays.'}],
  draw:V.flow({label:'Source document, journal entry, general ledger, trial balance, financial statements.',labels:['recorded','posted','listed','arranged'],edgeK:['e0','e1','e2','e3'],
    nodes:[{t:'Source document',s:'invoice INV-5582',k:'n0'},{t:'Journal entry',s:'Dr Receivables, Cr Sales',k:'n1'},{t:'General ledger',s:'running total per account',k:'n2'},{t:'Trial balance',s:'debits = credits',k:'n3'},{t:'Statements',s:'P&L, balance sheet, cash flow',k:'n4'}]}),
  clickStep:{n0:0,n1:1,n2:2,n3:3,n4:4},
  docHint:'Tip: click any box in the flow, or press <strong>Next</strong>, to see a simple drawing of what that document looks like.',
  docs:[
    `<div class="dk-t">What it looks like: an invoice</div><div class="dk-paper dk-inv">
       <div class="dk-row"><b class="dk-big">BraceWorks Medical</b><span class="dk-tag">INVOICE</span></div>
       <div class="dk-row dk-s"><span>Manila, Philippines</span><span>No. <b>INV-5582</b> · 18 December</span></div>
       <div class="dk-box dk-s"><b>Bill to:</b> Australian hospital supplier, Sydney</div>
       <table class="dk-tb"><tr><th>Item</th><th>Qty</th><th>Price</th><th>Amount</th></tr><tr><td>Pressure-relief mattress</td><td>600</td><td>$36.00</td><td>$21,600</td></tr><tr class="dk-tot"><td colspan="3">Total due</td><td>$21,600</td></tr></table>
       <div class="dk-s">Payment terms: 60 days</div></div>
     <p class="dk-note"><strong>A source document is proof that something happened.</strong> Others you'll see: receipts, supplier bills, delivery notes, payslips and bank statements. No document, no entry.</p>`,
    `<div class="dk-t">What it looks like: a journal entry</div><div class="dk-paper">
       <div class="dk-row dk-s"><b>Journal entry JE-0412</b><span>18 December</span></div>
       <table class="dk-tb dk-je"><tr><th>Account</th><th>Debit</th><th>Credit</th></tr><tr class="dk-hl"><td>Receivables</td><td>$21,600</td><td></td></tr><tr class="dk-hl"><td class="dk-in">Sales: mattresses</td><td></td><td>$21,600</td></tr><tr class="dk-tot"><td>Totals</td><td>$21,600</td><td>$21,600</td></tr></table>
       <div class="dk-s"><i>Narrative:</i> INV-5582, 600 mattresses to the Australian hospital supplier.</div></div>
     <p class="dk-note"><strong>The journal is the diary of the business:</strong> every transaction, in date order, written as a debit and an equal credit. The credit line is indented by tradition.</p>`,
    `<div class="dk-t">What it looks like: two pages of the general ledger</div><div class="dk-two">
       <div class="dk-paper"><div class="dk-acc">Receivables</div><table class="dk-tb dk-led"><tr><th>Date</th><th>Details</th><th>Dr</th><th>Cr</th><th>Balance</th></tr><tr><td>17 Dec</td><td>Balance so far</td><td></td><td></td><td>$208,400</td></tr><tr class="dk-hl"><td>18 Dec</td><td>INV-5582</td><td>$21,600</td><td></td><td>$230,000</td></tr></table></div>
       <div class="dk-paper"><div class="dk-acc">Sales</div><table class="dk-tb dk-led"><tr><th>Date</th><th>Details</th><th>Dr</th><th>Cr</th><th>Balance</th></tr><tr><td>17 Dec</td><td>Balance so far</td><td></td><td></td><td>$1,178,400</td></tr><tr class="dk-hl"><td>18 Dec</td><td>INV-5582</td><td></td><td>$21,600</td><td>$1,200,000</td></tr></table></div></div>
     <p class="dk-note"><strong>The ledger has one page per account</strong>, each with a running balance. The journal says <em>what happened</em>; the ledger says <em>where each account stands</em>. Software keeps both automatically.</p>`,
    `<div class="dk-t">What it looks like: a trial balance</div><div class="dk-paper">
       <div class="dk-row dk-s"><b>Trial balance at 31 December</b></div>
       <table class="dk-tb dk-tbal"><tr><th>Account</th><th>Debit</th><th>Credit</th></tr>
       <tr><td>Cash</td><td>$42,000</td><td></td></tr><tr class="dk-hl"><td>Receivables</td><td>$230,000</td><td></td></tr><tr><td>Inventory</td><td>$250,000</td><td></td></tr><tr><td>Prepayments</td><td>$13,000</td><td></td></tr><tr><td>Machinery, after depreciation</td><td>$310,000</td><td></td></tr><tr><td>All costs for the year</td><td>$1,144,500</td><td></td></tr>
       <tr><td>Owed to suppliers and others</td><td></td><td>$133,500</td></tr><tr><td>Bank loans</td><td></td><td>$220,000</td></tr><tr><td>Share capital</td><td></td><td>$250,000</td></tr><tr><td>Retained earnings, start of year</td><td></td><td>$186,000</td></tr><tr class="dk-hl"><td>Sales</td><td></td><td>$1,200,000</td></tr>
       <tr class="dk-tot"><td>Totals</td><td>$1,989,500</td><td>$1,989,500</td></tr></table></div>
     <p class="dk-note"><strong>Every ledger balance on one page.</strong> If the two totals match, every entry was recorded with equal debits and credits. It doesn't prove the entries are right, only that they balance.</p>`,
    `<div class="dk-t">What it looks like: the statements</div><div class="dk-two">
       <div class="dk-paper"><div class="dk-acc">Income statement</div><table class="dk-tb dk-st"><tr class="dk-hl"><td>Revenue</td><td>$1,200,000</td></tr><tr><td>All costs</td><td>($1,144,500)</td></tr><tr class="dk-tot"><td>Net profit</td><td>$55,500</td></tr></table></div>
       <div class="dk-paper"><div class="dk-acc">Balance sheet (extract)</div><table class="dk-tb dk-st"><tr><td>Cash</td><td>$42,000</td></tr><tr class="dk-hl"><td>Receivables</td><td>$230,000</td></tr><tr><td>Inventory</td><td>$250,000</td></tr><tr><td>…</td><td></td></tr></table></div></div>
     <p class="dk-note"><strong>The trial balance, rearranged for readers.</strong> Income and cost accounts go to the income statement; everything else goes to the balance sheet. Invoice INV-5582 is now part of $1,200,000 of revenue and $230,000 of receivables.</p>`
  ]});

put('m2','drcr',{at:5,after:'Account Debit Credit'},{title:'The same entry, drawn as T-accounts',
  draw:function(w){
    const side=w>=440, tw=side?Math.min(250,(w-40)/2):Math.min(300,w-20); const items=[['Inventory: raw materials','left','$9,000','webbing arrives'],['Accounts payable','right','$9,000','owed to supplier']];
    let g='', y=0;
    items.forEach((it,i)=>{ const x=side?(w-(2*tw+40))/2+i*(tw+40):(w-tw)/2, yy=side?0:i*130; y=Math.max(y,yy);
      g+=txt(x+tw/2,yy+16,it[0],'v-t')+`<line x1="${f(x)}" x2="${f(x+tw)}" y1="${yy+26}" y2="${yy+26}" class="v-edge" style="stroke:var(--ink);stroke-width:2"/><line x1="${f(x+tw/2)}" x2="${f(x+tw/2)}" y1="${yy+26}" y2="${yy+108}" class="v-edge" style="stroke:var(--ink);stroke-width:2"/>`;
      g+=txt(x+tw/4,yy+44,'Debit (left)','v-l')+txt(x+3*tw/4,yy+44,'Credit (right)','v-l');
      const ex=it[1]==='left'?x+tw/4:x+3*tw/4; g+=`<rect x="${f(ex-52)}" y="${yy+54}" width="104" height="40" rx="7" class="v-node ${it[1]==='left'?'hl':'warn'}"/>`+txt(ex,yy+72,it[2],'v-t')+txt(ex,yy+87,it[3],'v-s'); });
    const H_=side?140:270; g+=txt(w/2,H_-8,'Debits $9,000 = Credits $9,000','v-l');
    return svg(w,H_,'Inventory is debited $9,000 on its left side; accounts payable is credited $9,000 on its right side.',g);
  },
  caption:'Every transaction is written twice: once on the left of one account and once on the right of another. That\'s what "double entry" means, and why the books balance.'});

put('m2','close',{at:1,after:'Close step'},{title:'A fast, boring close: eight working days',
  draw:function(w){
    const T=[['Bank reconciliations',1,2],['Receivables and payables ledgers',1,2],['Accruals and prepayments',2,3],['Stock counts and valuation',2,4],['Depreciation',3,3],['Draft statements',4,5],['Review and investigate',5,6],['Commentary and pack',6,7],['Pack issued',8,8,1]];
    const lw=Math.min(210,w*0.44), dw=(w-lw-6)/8, mc=Math.floor((lw-10)/6.4), two=T.some(t=>t[0].length>mc), rh=two?36:26, top=26; let g='';
    for(let d=1; d<=8; d++){ const x=lw+(d-1)*dw; g+=txt(x+dw/2,14,String(d),'v-ax')+`<line x1="${f(x)}" x2="${f(x)}" y1="${top-4}" y2="${f(top+T.length*rh)}" class="v-grid"/>`; }
    T.forEach((t,i)=>{ const y=top+i*rh; const L=wrap(t[0],mc).slice(0,2); g+=lines(lw-8,y+(L.length>1?14:rh/2+4),L,'v-s','end',13);
      if(t[3]){ const cx=lw+(t[1]-0.5)*dw, cy=y+rh/2; g+=`<polygon points="${f(cx)},${f(cy-9)} ${f(cx+9)},${f(cy)} ${f(cx)},${f(cy+9)} ${f(cx-9)},${f(cy)}" class="v-f-good" data-tip="${t[0]}|Working day ${t[1]}"/>`; }
      else g+=`<rect x="${f(lw+(t[1]-1)*dw+2)}" y="${y+4}" width="${f((t[2]-t[1]+1)*dw-4)}" height="${rh-8}" rx="4" class="v-f-acc" data-tip="${t[0]}|Working day${t[1]===t[2]?' '+t[1]:'s '+t[1]+'–'+t[2]}"/>`; });
    g+=txt(lw+4*dw,top+T.length*rh+18,'Working days after month-end','v-ax');
    return svg(w,top+T.length*rh+26,'Month-end close tasks scheduled across working days 1 to 8, ending with the pack issued on day 8.',g);
  },
  caption:'Reconciliations and accruals come first, because everything after depends on them. Hover a bar for its days. If your pack arrives on day 20, one of these steps is stuck.'});

/* =================================================================== MODULE 3 */
put('m3','full',{at:1,after:'BraceWorks Medical · Income statement'},{title:'From $1.2M of sales to $55,500 of profit',
  html:UI.bridge([{label:'Revenue',v:1200000,total:true},{label:'Materials',v:-552000},{label:'Direct labour',v:-152000},{label:'Factory overhead',v:-156000},{label:'Gross profit',v:340000,total:true},{label:'Selling and export',v:-86000},{label:'Administration',v:-160000},{label:'Operating profit',v:94000,total:true},{label:'Interest and currency',v:-20000},{label:'Income tax',v:-18500},{label:'Net profit',v:55500,total:true}],{fmt:k$}),
  caption:'Each red bar is a cost taken away; dark bars are subtotals. Materials is the biggest single bite.'});

put('m3','leaks',{at:3,after:'% of revenue Jan'},{title:'Materials up, margin down',
  draw:V.line({label:'Materials rose from 45.8% to 50.3% of revenue while gross margin fell from 28.5% to 24.1%.',x:['Jan','Feb','Mar','Apr','May','Jun'],fmt:pc0,tfmt:pc1,ticks:4,dots:true,yMin:20,yMax:55,
    series:[{name:'Materials, % of revenue',short:'Materials',v:[45.8,46.1,46.9,48.0,49.2,50.3],c:'s1'},{name:'Gross margin',short:'Gross margin',v:[28.5,28.2,27.6,25.9,25.2,24.1],c:'s2'}]}),
  caption:'The two lines mirror each other: every point materials gains, gross margin loses. Labour and overhead (not shown) stayed flat.'});

put('m3','case',{at:1,after:'Before and after the growth push'},{title:'Where the extra profit went',
  html:UI.bridge([{label:'Operating profit before',v:94000,total:true},{label:'Extra volume at list prices, after materials',v:154000},{label:'Discounts given',v:-90000},{label:'Overtime',v:-30000},{label:'Freight and duties (DDP)',v:-64000},{label:'Higher commission',v:-18300},{label:'Operating profit after',v:45700,total:true}],{fmt:k$}),
  caption:'The extra volume was worth $154,000. Discounts, free delivery, overtime and commission took $202,300 of it back.'});

/* =================================================================== MODULE 4 */
put('m4','full',{at:1,after:'BraceWorks Medical · Balance sheet'},{title:'The balance sheet, drawn to scale',
  draw:function(w){
    const A=[['Cash',42000,'s1'],['Receivables',230000,'s1'],['Inventory',250000,'s1'],['Prepayments',13000,'s1'],['Equipment, net',310000,'s3']];
    const B=[['Payables and accruals',125000,'s2'],['Tax payable',8500,'s2'],['Overdraft',120000,'s2'],['Equipment loan',100000,'s2'],['Equity',491500,'s4']];
    if(w<480){ ['Cash','Receivables','Inventory','Prepaid','Equipment'].forEach((n,i)=>A[i][0]=n); ['Payables','Tax','Overdraft','Loan','Equity'].forEach((n,i)=>B[i][0]=n); }
    const HH=w<480?300:340, top=30, cw=Math.min(140,w*0.2), gx=Math.min(40,w*0.08), lx=w/2-gx/2-cw, rx=w/2+gx/2, sc=HH/845000;
    let g=txt(lx+cw/2,16,'What we own','v-l')+txt(rx+cw/2,16,'Who funded it','v-l')+txt(w/2,top+HH/2+6,'=','v-big');
    const col=(arr,x,side)=>{ let y=top; const labs=[];
      arr.forEach(a=>{ const h=a[1]*sc; g+=`<rect x="${f(x)}" y="${f(y)}" width="${f(cw)}" height="${f(Math.max(1,h-2))}" rx="3" class="v-f-${a[2]}" data-tip="${a[0]}|${money(a[1])} · ${pct(a[1]/845000)} of the total"/>`; labs.push({t:a[0],v:k$(a[1]),y:y+h/2,cy:y+h/2}); y+=h; });
      for(let i=1;i<labs.length;i++) if(labs[i].y-labs[i-1].y<28) labs[i].y=labs[i-1].y+28;
      const over=labs[labs.length-1].y-(top+HH-8); if(over>0) for(let i=labs.length-1;i>=0;i--){ labs[i].y-=over; if(i>0&&labs[i].y-labs[i-1].y>=28) break; }
      labs.forEach(L=>{ const ex=side<0?x-6:x+cw+6, tx=side<0?x-12:x+cw+12; g+=`<line x1="${f(side<0?x:x+cw)}" y1="${f(L.cy)}" x2="${f(ex)}" y2="${f(L.y)}" class="v-grid" style="stroke:var(--rule-strong)"/>`+txt(tx,L.y-1,L.t,'v-s',side<0?'end':'start')+txt(tx,L.y+13,L.v,'v-l',side<0?'end':'start'); }); };
    col(A,lx,-1); col(B,rx,1);
    g+=txt(lx+cw/2,top+HH+18,'$845,000','v-val')+txt(rx+cw/2,top+HH+18,'$845,000','v-val');
    return `<div class="v-legend"><span><i class="sq" style="background:var(--s1)"></i>Current assets</span><span><i class="sq" style="background:var(--s3)"></i>Non-current assets</span><span><i class="sq" style="background:var(--s2)"></i>Liabilities</span><span><i class="sq" style="background:var(--s4)"></i>Equity</span></div>`+svg(w,top+HH+26,'Assets of $845,000 shown as a column equal in height to liabilities plus equity.',g);
  },
  caption:'Each block\'s height is its dollar value. Receivables and inventory together are bigger than the equipment, and the cash sliver at the top is tiny.'});

put('m4','compare',{at:1,after:'Balance sheet movements'},{title:'Growing faster than the business',
  html:UI.bars([{label:'Sales',v:0.09,tone:'blue'},{label:'Payables',v:0.12,tone:'muted'},{label:'Receivables',v:0.15,tone:'warn'},{label:'Work-in-progress',v:0.17,tone:'warn'},{label:'Raw materials',v:0.19,tone:'warn'},{label:'Finished goods',v:0.32,tone:'bad'}],{fmt:x=>'+'+Math.round(x*100)+'%',max:0.34}),
  caption:'Anything that grows faster than sales (the blue bar) is soaking up cash. Finished goods grew more than three times as fast.'});

/* =================================================================== MODULE 5 */
put('m5','stmt',{at:1,after:'BraceWorks Medical · Cash flow statement'},{title:'Where the cash came from, and where it went',
  html:V.stack({fmt:k$,max:80000,rows:[
    {label:'Came in',sub:'$73,000',parts:[{label:'From operations',v:33000,c:'s1'},{label:'New borrowing',v:40000,c:'s2'}]},
    {label:'Went out',sub:'$80,000',parts:[{label:'Foam-cutting machine',v:60000,c:'s3'},{label:'Loan repaid',v:20000,c:'s4'}]}],
    keys:[{label:'From operations',c:'s1'},{label:'New borrowing',c:'s2'},{label:'Machine',c:'s3'},{label:'Loan repaid',c:'s4'}]}),
  caption:'$7,000 more went out than came in, so the bank balance fell from $49,000 to $42,000. More than half of what came in was borrowed.'});

swap('m5','runway',{at:1,n:'Month-end cash at BraceWorks'},{title:'Month-end cash at BraceWorks',
  draw:V.line({label:'Month-end cash ranged from $6,000 to $42,000, twice falling below $10,000.',x:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],fmt:k$,area:true,dots:true,yMin:0,
    series:[{name:'Cash at month-end',v:[38,31,22,35,41,18,9,48,6,24,37,42].map(x=>x*1000),c:'s1'}],
    refs:[{v:24000,label:'One month of payroll'}],band:{lo:0,hi:10000,label:'Under $10k'},endLabels:false,
    marks:[{i:6,label:'$9k',dy:16},{i:8,label:'$6k',dy:16}]}),
  caption:'July followed a large foam purchase; August recovered when two big customer payments arrived; September is the case from Module 1, falling from $48,000 to $6,000. The year-end figure of $42,000 hides two near-misses on payroll.'});

put('m5','case',{at:2,after:'The contract\'s cash effect in year one'},{title:'The contract\'s cash curve',
  draw:V.line({label:'Cumulative cash effect of the contract falls to minus $160,000 in month 6, below the $72,000 of headroom, and ends year one at minus $135,000.',x:['M1','M2','M3','M4','M5','M6','M7','M8','M9','M10','M11','M12'],fmt:k$,area:true,yMax:0,
    series:[{name:'Cumulative cash effect of the contract',v:[-30,-62,-95,-128,-150,-160,-158,-152,-145,-139,-136,-135].map(x=>x*1000),c:'s2'}],
    refs:[{v:-72000,label:'Headroom available: $72k',cls:'bad'}],endLabels:false,marks:[{i:5,label:'Peak need $160k',dy:18}]}),
  caption:'Materials and wages are paid months before the first 90-day payment arrives. Below the red line, BraceWorks has run out of cash and overdraft. Profitable contracts still dig a hole first.'});

/* =================================================================== MODULE 6 */
put('m6','build',{at:6,after:'Full cost of one mattress'},{title:'Which overheads go into gross margin?',
  render:function(box){
    box.innerHTML=`<div class="ovh">
      <div class="ovh-c in"><div class="ovh-h">Making the product<small>in cost of goods sold, so <b>inside</b> gross margin</small></div>
        <ul><li>Materials</li><li>Production labour</li><li><strong>Factory overhead:</strong> supervisors, factory rent and power, machine depreciation and repairs, quality checks on the line</li></ul></div>
      <div class="ovh-c out"><div class="ovh-h">Selling it and running the company<small>operating expenses, <b>below</b> gross profit</small></div>
        <ul><li>Sales team, commission, marketing, trade fairs</li><li>Freight and insurance to customers</li><li>Office rent, finance, HR, the GM, audit fees</li></ul></div>
    </div>
    <div class="ovh-pl" role="img" aria-label="BraceWorks: revenue $1,200,000 less cost of goods sold $860,000 gives gross profit $340,000; less operating expenses $246,000 gives operating profit $94,000.">
      <div><span>Revenue</span><b>$1,200,000</b></div>
      <div class="m"><span>Cost of goods sold<small>materials $552k + labour $152k + factory overhead $156k</small></span><b>($860,000)</b></div>
      <div class="t"><span>Gross profit <small>28.3% gross margin</small></span><b>$340,000</b></div>
      <div class="m o"><span>Operating expenses<small>selling and export $86k + office and admin $160k</small></span><b>($246,000)</b></div>
      <div class="t"><span>Operating profit</span><b>$94,000</b></div>
    </div>`;
  },
  caption:'The test is what the cost is for: making the product, or selling it and running the company. The accounting rules (IAS 2, followed in the Philippines as PFRS) put factory overhead into the cost of stock, so it reaches gross margin when the goods are sold. For decisions such as a special order, Module 12 uses contribution instead, which leaves fixed factory overhead out.'});

put('m6','products',{at:1,after:'Per unit Mattress Sling Brace'},{title:'What\'s inside each product\'s price',
  html:V.stack({fmt:x=>x.toFixed(1)+'%',pct:false,inside:'pct',rows:[
    {label:'Mattress',sub:'$180',parts:[{label:'Materials',v:52.8,c:'s1'},{label:'Labour',v:8.3,c:'s2'},{label:'Overhead',v:8.6,c:'s3'},{label:'Gross profit',v:30.3,c:'s4'}]},
    {label:'Sling',sub:'$45',parts:[{label:'Materials',v:40.0,c:'s1'},{label:'Labour',v:10.0,c:'s2'},{label:'Overhead',v:10.3,c:'s3'},{label:'Gross profit',v:39.7,c:'s4'}]},
    {label:'Brace',sub:'$28',parts:[{label:'Materials',v:42.1,c:'s1'},{label:'Labour',v:20.4,c:'s2'},{label:'Overhead',v:20.9,c:'s3'},{label:'Gross profit',v:16.6,c:'s4'}]}],
    keys:[{label:'Materials',c:'s1'},{label:'Labour',c:'s2'},{label:'Overhead',c:'s3'},{label:'Gross profit',c:'s4'}]}),
  caption:'Each bar is 100% of the selling price. Braces spend twice as much of their price on labour and overhead as mattresses do, which is why their margin is thin.'});

put('m6','abc',{at:2,after:'Overhead per unit Mattress Sling Brace'},{title:'Overhead per unit: one pool vs three',
  draw:V.vbars({label:'Overhead per mattress rises from $15.40 to $23.80 under activity-based costing; slings fall from $4.62 to $2.88; braces from $5.85 to $5.10.',x:['Mattress','Sling','Brace'],fmt:x=>'$'+Math.round(x),tfmt:x=>money(x,2),values:true,vfmt:x=>'$'+x.toFixed(2),
    series:[{name:'Spread by labour hours',v:[15.40,4.62,5.85],c:'s1'},{name:'Activity-based (three pools)',v:[23.80,2.88,5.10],c:'s2'}]}),
  caption:'Mattresses use the foam cutters and half the floor space, so the better method charges them more. Same $156,000 in total, different answer for each product.'});

put('m6','case',{at:3,after:'On a $125.40 cost'},{title:'Markup and margin on the same cost',
  html:V.stack({fmt:x=>money(x,2),max:179.14,pct:false,rows:[
    {label:'30% markup',sub:'price $163.02',parts:[{label:'Cost',v:125.40,c:'muted',show:'cost $125.40'},{label:'Profit',v:37.62,c:'s1',show:'23%'}]},
    {label:'30% margin',sub:'price $179.14',parts:[{label:'Cost',v:125.40,c:'muted',show:'cost $125.40'},{label:'Profit',v:53.74,c:'s1',show:'30%'}]}],
    keys:[{label:'Cost',c:'muted'},{label:'Profit, as a share of price',c:'s1'}]}),
  caption:'A 30% markup on cost leaves only 23% of the price as profit. To keep 30% of the price, divide the cost by 0.70.'});

/* =================================================================== MODULE 7 */
put('m7','flow',{at:0,after:'In a factory, inventory has three stages'},{title:'How costs travel through the factory',
  intro:'Press <strong>Play</strong> to follow the money from a foam delivery to the P&amp;L.',
  steps:[
    {k:['n0','e0','n1'],t:'Materials arrive and sit in <strong>raw materials</strong>, an asset on the balance sheet. Nothing has reached the P&amp;L yet.'},
    {k:['n1','e1','n2'],t:'Production issues materials to the line. In <strong>work-in-progress</strong> they\'re joined by the wages of the people making the products and a share of factory overhead.'},
    {k:['n2','e2','n3'],t:'Finished, inspected and released products move to <strong>finished goods</strong>, still carrying all of those costs.'},
    {k:['n3','e3','n4'],t:'Only when a product is <strong>sold</strong> does its cost leave the balance sheet and appear on the P&amp;L as cost of goods sold.'},
    {k:['n1','n2','n3'],t:'So at any moment, some of this year\'s wages, power and rent are sitting on shelves as stock. That\'s why making more than you sell can flatter profit.'}],
  draw:V.flow({label:'Purchases flow into raw materials, then work-in-progress with labour and overhead added, then finished goods, then cost of goods sold.',labels:['arrive','issued','finished','sold'],edgeK:['e0','e1','e2','e3'],
    nodes:[{t:'Purchases',s:'$588k of foam, fabric, webbing',k:'n0'},{t:'Raw materials',s:'$140k at year-end',k:'n1'},{t:'Work-in-progress',s:'+ labour $156k + overhead $161k',k:'n2'},{t:'Finished goods',s:'$75k at year-end',k:'n3'},{t:'Cost of goods sold',s:'$860k on the P&L',k:'n4',cls:'hl'}]})});

put('m7','case',{at:1,after:'Cause Value Type'},{title:'What the $19,400 was made of',
  html:UI.bars([{label:'Unrecorded foam scrap',v:11000,tone:'bad'},{label:'Wrong fabric quantity in the BOM',v:3600,tone:'warn'},{label:'Probable theft of small items',v:2500,tone:'bad'},{label:'Unrecorded samples',v:2300,tone:'warn'}]),
  caption:'More than half of the "missing" stock was scrap that nobody recorded. Each cause has a different fix.'});

/* =================================================================== MODULE 8 */
put('m8','split',{at:1,after:'Variance Formula October Owner'},{title:'Picturing price and usage',
  draw:function(w){
    const W=Math.min(w,620), x0=(w-W)/2+56, PL=wrap('Price variance: $12 extra × 68.4 m³ = $821',Math.max(16,Math.floor((w-((w-W)/2+56)-8)/6.5))), top=30+PL.length*13, hs=w<480?120:150, hp=34, avail=W-56-(w<480?120:190), k=avail/68.4, ws=62.4*k, ue=6*k;
    let g=`<rect x="${f(x0)}" y="${f(top+hp)}" width="${f(ws)}" height="${hs}" class="v-f-q0" data-tip="Standard cost|62.4 m³ × $200 = $12,480"/>`;
    g+=lines(x0+ws/2,top+hp+hs/2-6,['Standard cost','62.4 m³ × $200','= $12,480'],'v-s','middle',15);
    g+=`<rect x="${f(x0+ws+2)}" y="${f(top+hp)}" width="${f(ue-2)}" height="${hs}" class="v-f-s1" data-tip="Usage variance|(68.4 − 62.4) × $200 = $1,200 A"/>`;
    g+=`<rect x="${f(x0)}" y="${f(top)}" width="${f(ws+ue)}" height="${hp-2}" class="v-f-s2" data-tip="Price variance|($212 − $200) × 68.4 = $821 A"/>`;
    g+=lines(x0,top-10-(PL.length-1)*13,PL,'v-l','start',13);
    const lx=x0+ws+ue+10; g+=lines(lx,top+hp+hs/2-14,wrap('Usage variance: 6 m³ extra × $200 = $1,200',Math.max(12,Math.floor((w-lx-6)/6.4))),'v-l','start',13);
    g+=arrow(x0,top+hp+hs+4,x0,top-4)+txt(x0-8,top+hp+4,'$200','v-ax','end')+txt(x0-8,top+12,'$212','v-ax','end')+lines(x0-8,top+hp+hs-20,['Price','per m³'],'v-ax','end',12);
    g+=arrow(x0-2,top+hp+hs,x0+ws+ue+24,top+hp+hs)+txt(x0+ws,top+hp+hs+16,'62.4','v-ax')+txt(x0+ws+ue+4,top+hp+hs+30,'68.4 m³ actual','v-ax','start');
    return svg(w,top+hp+hs+40,'The standard cost rectangle with a price variance strip across the top and a usage variance strip down the right side.',g);
  },
  caption:'The grey rectangle is what 240 mattresses should cost: standard quantity × standard price. The extra strips are the overspend. The top strip is paying more per m³ (price); the side strip is using more m³ (usage). Not drawn to scale.'});

put('m8','coq',{at:2,after:'Where BraceWorks\' quality money goes'},{title:'The later a defect is found, the more it costs',
  draw:V.vbars({label:'Relative cost to fix a defect: 1 in design, 10 on the production line, 100 at the customer.',x:['Found in design','Found on the line','Found by the customer'],fmt:x=>'×'+x,values:true,xwrap:true,
    series:[{name:'Relative cost to fix one defect',v:[1,10,100],c:'s1',cs:['good','s4','red']}]}),
  caption:'A common rule of thumb, not a precise law: each stage a defect survives multiplies the cost of fixing it. For a medical device, the customer stage can mean a field action or recall.'});

put('m8','case',{at:1,after:'Average monthly variances since the switch'},{title:'The cheaper foam, month by month',
  html:UI.bridge([{label:'Foam price saving',v:1650},{label:'Extra foam used',v:-2400},{label:'Slower cutting',v:-900},{label:'Scrap and rework',v:-1100},{label:'Complaints and returns',v:-1800},{label:'Net effect per month',v:-4550,total:true}]),
  caption:'One green bar, four red ones. The saving purchasing was rewarded for is smaller than the costs it caused.'});

/* =================================================================== MODULE 9 */
put('m9','score',{at:2,before:'Fix in this order'},{title:'Each layer rests on the one below',
  draw:function(w){
    const L=[['Complete and connected','margins, aging, operations','s4'],['Insightful','summary, commentary, actions','s3'],['Comparative','budget, last year, % of revenue','s2'],['Reliable','reconciled, closed, on time','s1']];
    const W=Math.min(w,560), lh=56, top=4, x0=(w-W)/2; let g='';
    L.forEach((l,i)=>{ const yt=top+i*lh, yb=yt+lh-3, b0=w<480?0.56:0.36, wt=W*(b0+(1-b0)*i/L.length), wb=W*(b0+(1-b0)*(i+1)/L.length);
      g+=`<polygon points="${f(w/2-wt/2)},${f(yt)} ${f(w/2+wt/2)},${f(yt)} ${f(w/2+wb/2)},${f(yb)} ${f(w/2-wb/2)},${f(yb)}" class="v-node ${['warn','good','hl','alt'][i]}"/>`+txt(w/2,yt+24,`${4-i}. ${l[0]}`,'v-t')+txt(w/2,yt+40,l[1],'v-s'); });
    return svg(w,top+L.length*lh+4,'A pyramid: reliable at the base, then comparative, then insightful, then complete and connected at the top.',g);
  },
  caption:'Build from the bottom. A beautiful dashboard on top of unreconciled numbers just makes wrong numbers look convincing.'});

/* =================================================================== MODULE 10 */
put('m10','aging',{at:1,after:'Receivables aging at year-end'},{title:'The same aging, as a picture',
  html:V.stack({fmt:k$,max:50000,minShow:9,rows:[
    ['US distributor A',[40,10,0,0,0]],['Australian hospital supplier',[22,5,0,0,0]],['German distributor',[20,0,6,0,0]],['Swedish distributor',[24,0,0,0,0]],['US distributor B',[10,5,8,0,0]],['UAE distributor',[0,0,0,0,28]],['UK distributor',[12,0,0,8,0]],['19 other customers',[32,0,0,0,0]]
  ].map(r=>({label:r[0],parts:r[1].map((v,i)=>({label:['Current','1–30 days late','31–60 days late','61–90 days late','Over 90 days late'][i],v:v*1000,c:'q'+i})).filter(p=>p.v>0)})),
    keys:[{label:'Current',c:'q0'},{label:'1–30 late',c:'q1'},{label:'31–60',c:'q2'},{label:'61–90',c:'q3'},{label:'90+',c:'q4'}]}),
  caption:'Grey is money not yet due. The darker the red, the later the money. The UAE distributor\'s bar is all dark: that\'s the debt most likely to be lost.'});

put('m10','ops',{at:1,after:'Measure Formula'},{title:'Orders move first, sales follow',
  draw:V.line({label:'Orders peaked in March and fell from April; sales peaked in May and fell after that.',x:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],fmt:k$,dots:true,
    series:[{name:'Orders received',v:[100,103,104,101,96,93,91,88,87,86,88,90].map(x=>x*1000),c:'s2'},{name:'Sales shipped',v:[94,96,98,100,103,102,99,97,95,92,90,89].map(x=>x*1000),c:'s1'}],
    vmarks:[{i:4,label:'Orders fall below sales'}]}),
  caption:'From May, orders (orange) run below sales (blue): book-to-bill under 1.0. Two months later, sales start falling too. Watching orders gives you that warning early.'});

/* =================================================================== MODULE 11 */
put('m11','good',{at:1,after:'Mix leading and lagging'},{title:'How one problem travels from leading to lagging',
  draw:V.flow({label:'Scrap rate rises, then a usage variance appears, then gross margin falls, then profit misses budget.',labels:['weeks later','in the pack','adds up to'],
    nodes:[{t:'Scrap rate rises',s:'seen weekly on the floor',cls:'hl'},{t:'Usage variance',s:'month-end variance report'},{t:'Gross margin falls',s:'monthly P&L'},{t:'Profit misses budget',s:'quarter and year',cls:'bad'}]}),
  caption:'The same problem shows up four times. Act on the first box (a leading measure) and you never see the last one (a lagging measure).'});

put('m11','roce',{at:2,after:'Three levers behind ROE'},{title:'The DuPont tree',
  draw:function(w){
    const gap=w<480?18:30, cw=Math.min(210,(w-2*gap)/3), rw=Math.min(280,w-20), x0=(w-(3*cw+2*gap))/2;
    const R=nodeLines(rw,'Return on equity 11.3%','Net profit ÷ Equity'), C=[['Net margin 4.6%','Net profit ÷ Revenue','prices and costs'],['Asset turnover 1.42×','Revenue ÷ Total assets','less stock, faster collection'],['Leverage 1.72×','Total assets ÷ Equity','more debt, more risk']];
    const Ls=C.map(c=>nodeLines(cw,c[0],c[1])), ch=Math.max(...Ls.map(l=>l.h)), cy=R.h+46;
    let g=node((w-rw)/2,4,rw,R.h,R,'hl');
    C.forEach((c,i)=>{ const x=x0+i*(cw+gap), mx=x+cw/2; g+=`<path d="M${f(w/2)},${f(R.h+4)} V${f(R.h+24)} H${f(mx)} V${f(cy-3)}" class="v-edge"/>`+node(x,cy,cw,ch,Ls[i]);
      g+=lines(mx,cy+ch+18,['Lever:'].concat(wrap(c[2],Math.floor(cw/6.3))),'v-s','middle',14); if(i<2) g+=txt(x+cw+gap/2,cy+ch/2+7,'×','v-big'); });
    return svg(w,cy+ch+64,'Return on equity equals net margin times asset turnover times leverage.',g);
  },
  caption:'Multiply the three boxes and you get return on equity: 4.6% × 1.42 × 1.72 = 11.3%. Each box is a different lever, owned by different people.'});

/* =================================================================== MODULE 12 */
put('m12','behave',{at:1,after:'Fixed or variable for BraceWorks'},{title:'How the two kinds of cost behave',
  draw:function(w){
    const two=w>=620, cw=two?(w-20)/2:w;
    const a=V.line({label:'Fixed costs stay at $502,000 while variable costs rise with volume.',x:['0%','25%','50%','75%','100%','125%','150%'],fmt:k$,h:200,table:false,yMin:0,
      series:[{name:'Total costs',v:[502,658,814,970,1126,1282,1438].map(x=>x*1000),c:'ink'},{name:'Variable costs',v:[0,156,312,468,624,780,936].map(x=>x*1000),c:'s1'},{name:'Fixed costs',v:[502,502,502,502,502,502,502].map(x=>x*1000),c:'s2',dash:true}]})(cw);
    const b=V.line({label:'Fixed cost per unit falls from $87 to $15 as volume rises; variable cost per unit stays at $27.',x:['25%','50%','75%','100%','125%','150%'],fmt:x=>'$'+Math.round(x),tfmt:x=>money(x,2),h:200,table:false,yMin:0,
      series:[{name:'Fixed cost per unit',short:'Fixed per unit',v:[87.30,43.65,29.10,21.83,17.46,14.55],c:'s2',dash:true},{name:'Variable cost per unit',short:'Variable per unit',v:[27.13,27.13,27.13,27.13,27.13,27.13],c:'s1'}]})(cw);
    return `<div style="display:grid;grid-template-columns:${two?'1fr 1fr':'1fr'};gap:18px"><div><div class="eyebrow" style="margin-bottom:4px">Total costs, by volume</div>${a}</div><div><div class="eyebrow" style="margin-bottom:4px">Cost per unit, by volume</div>${b}</div></div><p class="w-hint" style="margin-top:6px">Volume as % of today's (100% = 23,000 units a year).</p>`;
  },
  caption:'Left: fixed costs are a flat line; variable costs climb with every unit. Right: the same fixed costs spread over more units make each unit cheaper. That\'s why volume helps, and why spare capacity is so tempting to fill.'});

put('m12','behave',{at:6,after:'Contribution: the most useful number'},{title:'Filling the fixed-cost bucket',
  render:function(el,ctx){
    const S=[78,84,102,96,98,104,88,92,112,108,124,114], M=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], FIX=502;
    const cum=[]; S.reduce((a,v,i)=>(cum[i]=a+v*0.48),0);
    let mo=12, timer=null;
    el.innerHTML=`<div class="bucket-wrap"><div data-svg></div><div style="display:grid;gap:10px;min-width:0"><div data-txt></div>
      <div class="ctrl"><label for="${ctx.uid('m')}"><span>Month</span><output></output></label><input type="range" id="${ctx.uid('m')}" min="0" max="12" step="1" value="12"></div>
      <div class="row"><button type="button" class="btn small" data-play>Play the year ▶</button></div></div></div>`;
    const sv=el.querySelector('[data-svg]'), tx=el.querySelector('[data-txt]'), rng=el.querySelector('input'), out=el.querySelector('output'), pb=el.querySelector('[data-play]');
    const draw=()=>{ const c=mo?cum[mo-1]:0, inB=Math.min(c,FIX), over=Math.max(0,c-FIX);
      const W=200, Hb=210, top=50, bw1=150, bw2=118, cx=W/2, y0=top, y1=top+Hb, lvl=y1-inB/FIX*Hb;
      const lerp=y=>bw2+(bw1-bw2)*((y1-y)/Hb), wl=lerp(lvl);
      let g=`<polygon points="${f(cx-wl/2)},${f(lvl)} ${f(cx+wl/2)},${f(lvl)} ${f(cx+bw2/2)},${f(y1)} ${f(cx-bw2/2)},${f(y1)}" class="v-f-s1" opacity=".9"/>`;
      if(over>0){ const oh=over/FIX*Hb; g+=`<rect x="${f(cx-bw1/2+4)}" y="${f(y0-oh)}" width="${f(bw1-8)}" height="${f(oh)}" rx="6" class="v-f-good"/>`+txt(cx,y0-oh-6,'Profit '+money(Math.round(over)*1000),'v-val'); }
      g+=`<path d="M${f(cx-bw1/2)},${f(y0)} L${f(cx-bw2/2)},${f(y1)} L${f(cx+bw2/2)},${f(y1)} L${f(cx+bw1/2)},${f(y0)}" class="v-edge" style="stroke:var(--ink);stroke-width:3"/>`;
      g+=`<line x1="${f(cx-bw1/2-8)}" x2="${f(cx+bw1/2+8)}" y1="${y0}" y2="${y0}" class="v-ref"/>`+txt(cx,y1+20,'Fixed costs: $502k','v-l');
      sv.innerHTML=svg(W,y1+28,`Contribution to ${mo?M[mo-1]:'start of year'}: ${money(Math.round(c)*1000)} of $502,000 fixed costs covered.`,g);
      out.textContent=mo?M[mo-1]:'Start';
      tx.innerHTML=mo===0?'<p style="margin:0">The year starts with an empty bucket: <strong>$502,000</strong> of fixed costs to cover.</p>':
        `<div class="stats">${ctx.ui.stat('Contribution so far',money(Math.round(c)*1000))}${c<FIX?ctx.ui.stat('Fixed costs still to cover',money(Math.round(FIX-c)*1000),'warn'):ctx.ui.stat('Profit so far',money(Math.round(c-FIX)*1000),'good')}</div>
        <p class="w-hint" style="margin:8px 0 0">${c<FIX?`Each month's sales pour 48 cents per dollar into the bucket. ${M[mo-1]} added ${money(Math.round(S[mo-1]*0.48)*1000)}.`:mo===11?'November: the bucket overflows. Fixed costs for the whole year are covered, and every extra dollar of contribution from now is profit.':'Everything that overflows the bucket is profit. December\'s contribution alone is most of the year\'s profit.'}</p>`; };
    const stop=()=>{ if(timer){ clearInterval(timer); timer=null; } pb.textContent='Play the year ▶'; };
    rng.oninput=()=>{ stop(); mo=+rng.value; draw(); };
    pb.onclick=()=>{ if(timer){ stop(); return; } mo=0; rng.value='0'; draw(); pb.textContent='Pause ❚❚'; timer=setInterval(()=>{ if(!el.isConnected||mo>=12){ stop(); return; } mo++; rng.value=String(mo); draw(); },750); };
    draw();
  },
  caption:'BraceWorks only starts making money in November, once the year\'s fixed costs are covered. That\'s why a slow quarter hurts so much: the bucket fills later.'});

put('m12','behave',{at:5,after:'Production labour is a mixed cost'},{title:'Split production labour into its fixed and variable parts',
  render:function(box){
    const R=1200000, VC0=624000, FC0=502000, LAB=152000, PBT=74000;
    const $=n=>'$'+Math.round(n).toLocaleString('en-US'), pc=x=>(x*100).toFixed(1)+'%';
    box.innerHTML=`<div class="spl-ctl"><label for="splr">Overtime and agency workers, part of the $152,000</label><input id="splr" type="range" min="0" max="60000" step="2000" value="18000"><b class="spl-v"></b></div>
      <div class="spl-bar" aria-hidden="true"><span class="fx"></span><span class="vr"></span></div><div class="spl-leg small"><span><i class="fx"></i>Fixed: core team on monthly wages</span><span><i class="vr"></i>Variable: overtime and agency workers</span></div>
      <table class="spl-t"><thead><tr><th></th><th>All labour fixed</th><th>Split</th></tr></thead><tbody></tbody></table><div class="spl-say"></div>`;
    const r=box.querySelector('input'), tb=box.querySelector('tbody');
    function draw(){
      const v=+r.value, vc=VC0+v, fc=FC0-v, cm=(R-vc)/R, cm0=(R-VC0)/R, be=fc/cm, be0=FC0/cm0, ol=(R-vc)/PBT, ol0=(R-VC0)/PBT;
      box.querySelector('.spl-v').textContent=$(v)+' ('+Math.round(v/LAB*100)+'%)';
      box.querySelector('.spl-bar .fx').style.width=((LAB-v)/LAB*100)+'%'; box.querySelector('.spl-bar .vr').style.width=(v/LAB*100)+'%';
      const row=(l,a,b,d)=>`<tr${d?' class="d"':''}><td>${l}</td><td>${a}</td><td>${b}</td></tr>`;
      tb.innerHTML=row('Variable costs',$(VC0),$(vc))+row('Fixed costs',$(FC0),$(fc))+row('Contribution margin',pc(cm0),pc(cm),1)+row('Break-even sales',$(be0),$(be),1)+row('Margin of safety',pc((R-be0)/R),pc((R-be)/R))+row('Profit before tax',$(PBT),$(PBT))+row('Profit drop if sales fall 10%',$(0.1*(R-VC0)),$(0.1*(R-vc)),1);
      box.querySelector('.spl-say').innerHTML=v===0?'<p>Slide to move part of production labour into variable costs.</p>':
        `<p><strong>Profit today doesn't change</strong>: it's the same $${(LAB/1000).toFixed(0)}k of wages, just labelled differently. <strong>Break-even barely moves</strong> (${$(be0)} → ${$(be)}), because the contribution margin falls by about as much as fixed costs do.</p>
         <p>What the split changes is <strong>how costs move with volume</strong>. In a downturn you can stop overtime and release agency staff, so a 10% fall in sales costs ${$(0.1*(R-vc))} of profit instead of ${$(0.1*(R-VC0))}. And on a big extra order, every extra unit brings extra labour cost: that's why Module 13 adds overtime to the cost of a special order. The bigger the variable share, the more this matters.</p>`;
    }
    r.oninput=draw; draw();
  },
  caption:'Rule of thumb: treat a cost as variable if it would really change with next month\'s volume. Monthly wages for regular staff usually won\'t; overtime, agency workers, piece rates and daily-paid workers will.'});

put('m12','raise',{at:1,after:'Price rise Volume you can lose'},{title:'Price rises forgive; price cuts punish',
  draw:V.line({label:'Volume change needed to keep profit unchanged, from plus 26% for a 10% price cut to minus 17% for a 10% price rise.',x:['−10%','−8%','−6%','−4%','−2%','0%','+2%','+4%','+6%','+8%','+10%'],xName:'Price change',fmt:pc0,tfmt:x=>(x>0?'+':'')+x.toFixed(1)+'%',zero:true,dots:true,endLabels:false,
    series:[{name:'Volume change needed to keep the same profit',v:[26.3,20.0,14.3,9.1,4.3,0,-4.0,-7.7,-11.1,-14.3,-17.2],c:'s1'}],
    marks:[{i:0,label:'Cut 10%: need 26% more',anchor:'start',dx:6,dy:-10},{i:10,label:'Raise 10%: can lose 17%',anchor:'end',dx:-8,dy:-12}]}),
  caption:'With a 48% contribution margin, the curve isn\'t symmetrical. A price cut needs far more extra volume than a price rise can afford to lose.'});

/* =================================================================== MODULE 13 */
put('m13','rel',{at:1,after:'Sunk costs'},{title:'Is this cost relevant? Three questions',
  draw:function(w){
    const qw=Math.min(250,w*0.5), ow=Math.min(190,w-qw-56), x0=Math.max(6,(w-(qw+50+ow))/2), ox=x0+qw+50;
    const Q=[['Will the cost happen in the future?','Sunk cost: ignore it','bad'],['Is it different between the options?','Same either way: ignore it','bad']];
    let y=4, g='';
    Q.forEach((qq,i)=>{ const L=nodeLines(qw,qq[0]), Lo=nodeLines(ow,qq[1]), h=Math.max(L.h,Lo.h);
      g+=node(x0,y,qw,h,L,'alt')+arrow(x0+qw+3,y+h/2,ox-3,y+h/2)+txt(x0+qw+25,y+h/2-6,'No','v-l')+node(ox,y,ow,h,Lo,qq[2]);
      g+=arrow(x0+qw/2,y+h+3,x0+qw/2,y+h+37)+txt(x0+qw/2+8,y+h+24,'Yes','v-l','start'); y+=h+40; });
    const L=nodeLines(qw,'Relevant: include it','in the comparison'); g+=node(x0,y,qw,L.h,L,'good');
    return svg(w,y+L.h+6,'If a cost is not in the future, or is the same whichever option you choose, ignore it. Otherwise it is relevant.',g);
  },
  caption:'Run each cost through these questions. Money already spent, and costs that stay the same either way, don\'t belong in the decision.'});

put('m13','bottle',{at:0,after:'When demand exceeds capacity'},{title:'The narrowest step sets the pace',
  draw:function(w){
    const D=[['Foam cutting',920],['Cover sewing',640],['Assembly',860],['QA and release',980],['Packing',1050]], DEM=720, MAX=1100;
    const lw=Math.min(130,w*0.32), bw=w-lw-60, rh=34, top=22; let g='';
    const X=v=>lw+v/MAX*bw;
    D.forEach((d,i)=>{ const y=top+i*rh, bot=d[1]<DEM; g+=txt(lw-8,y+20,d[0],'v-s','end')+`<rect x="${lw}" y="${y+6}" width="${f(X(d[1])-lw)}" height="${rh-12}" rx="4" class="v-f-${bot?'red':'muted'}" data-tip="${d[0]}|${d[1]} units a week${bot?' · the bottleneck':''}"/>`+txt(X(d[1])+6,y+21,String(d[1]),'v-val','start'); });
    g+=`<line x1="${f(X(DEM))}" x2="${f(X(DEM))}" y1="${top-8}" y2="${f(top+D.length*rh)}" class="v-ref bad"/>`+txt(X(DEM),12,'Orders: 720 a week','v-l');
    return svg(w,top+D.length*rh+6,'Weekly capacity by process: sewing at 640 is the only step below demand of 720.',g);
  },
  caption:'Every other process could handle 720 units a week. Sewing can do 640, so the whole factory ships 640. An hour saved anywhere else changes nothing; an hour gained in sewing is worth a full hour of output.'});

/* =================================================================== MODULE 14 */
put('m14','tvm',{at:1,after:'$22,300 received in'},{title:'Same cash, shrinking value',
  draw:V.vbars({label:'Each year the cutter brings $22,300; discounted at 10% that is worth $20,273 in year 1 falling to $10,403 in year 8.',x:['Y1','Y2','Y3','Y4','Y5','Y6','Y7','Y8'],xName:'Year',fmt:k$,tfmt:x=>money(Math.round(x)),
    series:[{name:'Cash received',v:Array(8).fill(22300),c:'muted'},{name:'Worth today at 10%',v:[20273,18430,16754,15231,13847,12588,11443,10403],c:'s1'}]}),
  caption:'The grey bars are the same every year. The blue bars show what each year\'s cash is worth today. By year 8, $22,300 is worth less than half of that.'});

put('m14','methods',{at:2,after:'In plain words'},{title:'The NPV curve: where IRR comes from',
  draw:(function(){ const rates=[]; for(let r=0;r<=50;r+=2) rates.push(r); const fl=[-60000,22300,22300,22300,22300,22300,22300,22300,27300];
    const npv=r=>fl.reduce((s,c,t)=>s+c/Math.pow(1+r/100,t),0);
    return V.line({label:'NPV of the fabric cutter falls as the discount rate rises, from $123,400 at 0% to zero at 33.8%, the IRR.',x:rates.map(r=>r+'%'),xName:'Discount rate',fmt:k$,tfmt:x=>money(Math.round(x)),zero:true,endLabels:false,xw:42,
      series:[{name:'NPV of the fabric cutter',v:rates.map(r=>Math.round(npv(r))),c:'s1'}],
      vmarks:[{i:33.83/2,label:'IRR 33.8%'}],marks:[{i:5,label:'At 10%: +$61.3k',anchor:'start',dx:8,dy:-8}]}); })(),
  caption:'Each point is the cutter\'s NPV at a different required return. Where the curve crosses zero is the IRR: the highest return the project can deliver. BraceWorks needs 10%, far to the left, so the project clears the bar easily.'});

/* =================================================================== MODULE 15 */
put('m15','why',{at:1,after:'Step Budget Built from'},{title:'The budget, in the order it\'s built',
  draw:V.flow({label:'Sales, then production, materials, labour, overheads, capital spending, the P&L, and finally cash and the balance sheet.',
    nodes:[{t:'1. Sales',s:'units and prices',cls:'hl'},{t:'2. Production',s:'sales ± stock change'},{t:'3. Materials',s:'production × BOM'},{t:'4. Labour',s:'production × routing'},{t:'5. Overheads',s:'line by line'},{t:'6. Capital spending',s:'approved projects'},{t:'7. P&L',s:'all of the above'},{t:'8. Cash and balance sheet',s:'terms, stock, loans',cls:'good'}]}),
  caption:'Each box needs the one before it. Get sales wrong and every number after it is wrong too, which is why the sales budget deserves the most challenge.'});

put('m15','flex',{at:4,after:'Two very different stories'},{title:'Splitting the $7,600 shortfall',
  html:UI.bridge([{label:'Original budget profit',v:7800,total:true},{label:'Lower volume (a sales question)',v:-5400},{label:'Flexed budget profit',v:2400,total:true},{label:'Spending and efficiency (a cost question)',v:-2200},{label:'Actual profit',v:200,total:true}]),
  caption:'The flexed budget in the middle is the fair yardstick: what profit should have been at the volume actually sold.'});

put('m15','fcst',{at:2,after:'Three scenarios, not one number'},{title:'Three versions of next year',
  draw:V.line({label:'Monthly sales under base, downside and upside scenarios.',x:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],fmt:k$,
    series:[{name:'Upside: Australian contract from July',short:'Upside',v:[78,84,102,96,98,104,124,128,148,144,160,150].map(x=>x*1000),c:'s3'},{name:'Base case',short:'Base',v:[78,84,102,96,98,104,88,92,112,108,124,114].map(x=>x*1000),c:'s1'},{name:'Downside: largest customer cuts orders',short:'Downside',v:[78,84,102,84.5,86.2,91.5,77.4,81,98.6,95,109.1,100.3].map(x=>x*1000),c:'s2'}]}),
  caption:'Same first quarter, three different years. Each line needs its own plan: the upside needs capacity and cash; the downside needs triggers for cutting costs.'});

swap('m15','case',{at:1,n:'The hockey stick'},{title:'The hockey stick',
  draw:V.line({label:'Budget sales jump to $570k in Q4; actual sales reached $330k.',x:['Q1','Q2','Q3','Q4'],fmt:k$,dots:true,yMin:0,
    series:[{name:'Budget',v:[300,310,320,570].map(x=>x*1000),c:'muted',dash:true},{name:'Actual',v:[296,262,270,330].map(x=>x*1000),c:'s2'}]}),
  caption:'Flat for nine months, then a leap on a deal that hadn\'t been signed. Costs were committed to the dashed line; sales followed the solid one.'});

/* =================================================================== MODULE 16 */
put('m16','ccc',{at:0,after:'From the day BraceWorks pays for foam'},{title:'The cash cycle, going round',
  draw:V.cycle({label:'Cash pays suppliers, becomes stock for 106 days, then a receivable for 70 days, then cash again.',
    nodes:[{t:'Cash in the bank'},{t:'Pay the supplier',s:'63 days after delivery'},{t:'Stock',s:'106 days on the shelf'},{t:'Ship and invoice',s:'customer owes us'},{t:'Customer pays',s:'70 days later'}],
    center:{big:'113 days',sub:'106 + 70 − 63'}}),
  caption:'The dot is a dollar of BraceWorks\' cash. Every day you take off the loop is cash back in the bank: about $3,300 for each day of receivables.'});

/* =================================================================== MODULE 17 */
put('m17','fx',{at:0,after:'BraceWorks keeps its books in US dollars'},{title:'Sixty days of a falling euro',
  draw:V.line({label:'The euro fell from $1.100 to $1.060 over the 60 days between invoice and payment.',x:['Day 0','5','10','15','20','25','30','35','40','45','50','55','Day 60'],fmt:x=>'$'+x.toFixed(2),tfmt:x=>'$'+x.toFixed(3),yMin:1.04,yMax:1.11,endLabels:false,
    series:[{name:'Dollars per euro',v:[1.100,1.097,1.094,1.091,1.088,1.085,1.082,1.078,1.074,1.071,1.067,1.063,1.060],c:'s1'}],
    marks:[{i:0,label:'Invoice: $44,000',anchor:'start',dx:6,dy:-10},{i:12,label:'Paid: $42,400',anchor:'end',dx:-6,dy:18}]}),
  caption:'Nothing went wrong with the order or the customer. The euro simply bought fewer dollars by the time it arrived. On €40,000, that slide cost $1,600.'});

put('m17','inco',{at:1,after:'Risk passes to buyer'},{title:'Who pays, and where the risk passes',scroll:true,
  draw:function(w){
    const W=Math.max(w,640), stages=['Packing at factory','Export clearance','To carrier or port','Loaded on ship','Sea freight and insurance','Destination port','Import duty and clearance','To buyer\'s door'];
    const R=[['EXW',[0],1,'at the factory'],['FCA',[0,1,2],3,'handed to the carrier'],['FOB',[0,1,2,3],4,'on board the ship'],['CIF',[0,1,2,3,4,5],4,'on board at the export port'],['DAP',[0,1,2,3,4,5,7],8,'on arrival at the buyer\'s place'],['DDP',[0,1,2,3,4,5,6,7],8,'on arrival at the buyer\'s place']];
    const lw=56, cw=(W-lw-6)/8, hh=54, rh=34; let g='';
    stages.forEach((s,i)=>{ g+=lines(lw+i*cw+cw/2,14,wrap(s,Math.floor(cw/6.2)),'v-ax','middle',12); });
    R.forEach((r,j)=>{ const y=hh+j*rh; g+=txt(lw-10,y+21,r[0],'v-t','end');
      for(let i=0;i<8;i++){ const s=r[1].includes(i); g+=`<rect x="${f(lw+i*cw+1)}" y="${y+5}" width="${f(cw-2)}" height="${rh-10}" rx="3" class="v-f-${s?'s1':'q0'}" data-tip="${r[0]} · ${stages[i]}|${s?'BraceWorks pays':'Buyer pays'}|Risk passes ${r[3]}"/>`; }
      const rx=lw+r[2]*cw; g+=`<line x1="${f(rx)}" x2="${f(rx)}" y1="${y+1}" y2="${y+rh-1}" style="stroke:var(--red);stroke-width:3"/><polygon points="${f(rx-6)},${y+1} ${f(rx+6)},${y+1} ${f(rx)},${y+9}" class="v-f-red"/>`; });
    return `<div class="v-legend"><span><i class="sq" style="background:var(--s1)"></i>BraceWorks pays</span><span><i class="sq" style="background:var(--q0)"></i>Buyer pays</span><span><i style="background:var(--red);width:4px;height:14px"></i>Risk passes to the buyer</span></div>`+svg(W,hh+R.length*rh+6,'For each Incoterm, which delivery stages BraceWorks pays for and where risk passes to the buyer.',g);
  },
  caption:'Read across each row: blue is what BraceWorks pays for, the red line is where risk passes. Notice CIF: BraceWorks pays all the way to the destination port, but the risk passed back at the export port. On a phone, scroll the chart sideways.'});

put('m17','pay',{at:1,after:'Risk to BraceWorks'},{title:'From safest for you to easiest for the buyer',
  draw:function(w){
    const M=['Cash in advance','Letter of credit','Open account + credit insurance','Documentary collection','Open account'];
    let g='';
    if(w>=560){ const x0=50, x1=w-50, y=70, st=(x1-x0)/(M.length-1);
      g+=arrow((x0+x1)/2,y,x0-30,y,{cls:'acc'})+arrow((x0+x1)/2,y,x1+30,y);
      M.forEach((m,i)=>{ const x=x0+i*st, up=i%2===0; g+=`<circle cx="${f(x)}" cy="${y}" r="7" class="v-f-${i===0?'acc':i===M.length-1?'red':'s1'}"/>`+lines(x,up?y-30:y+26,wrap(m,16),'v-s','middle',13); });
      g+=txt(x0-30,y+66,'Safer for BraceWorks','v-l','start')+txt(x1+30,y+66,'Easier for the buyer','v-l','end');
      return svg(w,148,'Payment methods ranked from cash in advance, safest for the exporter, to open account, easiest for the buyer.',g); }
    const x=26, y0=30, st=52; g+=txt(x-10,14,'Safer for BraceWorks','v-l','start')+arrow(x,y0+((M.length-1)*st)/2,x,y0-8,{cls:'acc'})+arrow(x,y0+((M.length-1)*st)/2,x,y0+(M.length-1)*st+10);
    M.forEach((m,i)=>{ const y=y0+i*st; g+=`<circle cx="${x}" cy="${f(y)}" r="7" class="v-f-${i===0?'acc':i===M.length-1?'red':'s1'}"/>`+txt(x+18,y+5,m,'v-s','start'); });
    g+=txt(x-10,y0+(M.length-1)*st+30,'Easier for the buyer','v-l','start');
    return svg(w,y0+(M.length-1)*st+38,'Payment methods ranked from cash in advance, safest for the exporter, to open account, easiest for the buyer.',g);
  },
  caption:'Each step from cash in advance towards open account makes the buyer happier and puts more of BraceWorks\' money at risk. Choose the point on the line that fits how well you know the customer.'});

put('m17','pay',{at:3,after:'How a letter of credit works'},{title:'A letter of credit, step by step',
  intro:'Four parties, eight steps. Press <strong>Play</strong> to see how the banks stand between BraceWorks and the buyer.',
  steps:[
    {k:['ex','im','e1'],t:'BraceWorks and the buyer agree the sale, with payment by <strong>letter of credit</strong>.'},
    {k:['im','imb','e2'],t:'The buyer applies to <strong>its own bank</strong> to open the LC.'},
    {k:['imb','exb','e3'],t:'The buyer\'s bank <strong>issues the LC</strong> and sends it to BraceWorks\' bank. From now on, that bank has promised to pay.'},
    {k:['exb','ex','e4'],t:'BraceWorks\' bank <strong>passes the LC to BraceWorks</strong>. Check every condition now, before shipping.'},
    {k:['ex','im','e5'],t:'BraceWorks <strong>ships the goods</strong> and collects the documents: invoice, bill of lading, packing list, certificate of origin.'},
    {k:['ex','exb','e6'],t:'BraceWorks <strong>presents the documents</strong> to its bank, before the deadline.'},
    {k:['exb','imb','e7'],t:'The documents go to the buyer\'s bank. If they <strong>match the LC exactly</strong>, it pays. One spelling mistake can stop it.'},
    {k:['imb','im','e8'],t:'The buyer pays its bank and receives the documents, which it needs to <strong>collect the goods</strong> at the port.'}],
  draw:function(w){
    const bw=Math.min(180,(w-100)/2), lx=10, rx=w-10-bw;
    const N=[['exb',"BraceWorks' bank",'advising bank',lx,0],['imb',"Buyer's bank",'issuing bank',rx,0],['ex','BraceWorks','exporter',lx,1],['im','Buyer','importer',rx,1]];
    const Ls=N.map(n=>nodeLines(bw,n[1],n[2])), bh=Math.max(...Ls.map(l=>l.h)), ty=8, by=ty+bh+120;
    let g=''; const lcx=lx+bw/2, rcx=rx+bw/2, xa=lx+bw+3, xb=rx-3, mid=(xa+xb)/2;
    const E=[
      ['e1',arrow(xa,by+bh/2-12,xb,by+bh/2-12),mid,by+bh/2-12],
      ['e5',arrow(xa,by+bh/2+14,xb,by+bh/2+14,{dash:true}),mid,by+bh/2+14],
      ['e2',arrow(rcx+18,by-3,rcx+18,ty+bh+3),rcx+18,(ty+bh+by)/2+18],
      ['e8',arrow(rcx-18,ty+bh+3,rcx-18,by-3),rcx-18,(ty+bh+by)/2-18],
      ['e3',arrow(xb,ty+bh/2-12,xa,ty+bh/2-12),mid,ty+bh/2-12],
      ['e7',arrow(xa,ty+bh/2+14,xb,ty+bh/2+14),mid,ty+bh/2+14],
      ['e4',arrow(lcx-18,ty+bh+3,lcx-18,by-3),lcx-18,(ty+bh+by)/2-18],
      ['e6',arrow(lcx+18,by-3,lcx+18,ty+bh+3),lcx+18,(ty+bh+by)/2+18]];
    E.forEach(e=>{ g+=`<g data-k="${e[0]}">${e[1]}${badge(e[2],e[3],e[0].slice(1))}</g>`; });
    N.forEach((n,i)=>{ g+=`<g data-k="${n[0]}">${node(n[3],n[4]?by:ty,bw,bh,Ls[i],n[4]?'hl':'alt')}</g>`; });
    if(w>=520) g+=txt(mid,by+bh/2+34,'goods','v-l')+txt(mid,ty+bh/2-28,'the LC','v-l');
    return svg(w,by+bh+10,'Letter of credit: buyer applies to its bank, which issues the LC through the exporter\'s bank; the exporter ships and presents documents; the banks exchange documents for payment.',g);
  },
  caption:'Numbers on the arrows match the steps. The dashed arrow is the goods; everything else is paper and money moving between banks.'});

/* =================================================================== MODULE 18 */
put('m18','fraud',{at:0,after:'Most people are honest'},{title:'The fraud triangle',
  draw:function(w){
    const s=Math.min(w-150,330), cx=w/2, top=34, hgt=s*0.86, A=[cx,top], B=[cx-s/2,top+hgt], C=[cx+s/2,top+hgt];
    let g=`<polygon points="${A.join(',')} ${B.map(f).join(',')} ${C.map(f).join(',')}" class="v-node alt" style="stroke-width:2"/>`+txt(cx,top+hgt*0.66,'Fraud','v-big');
    g+=`<circle cx="${f(A[0])}" cy="${f(A[1])}" r="9" class="v-f-muted"/>`+txt(cx,top-14,'Pressure: debts, targets','v-s');
    g+=`<circle cx="${f(B[0])}" cy="${f(B[1])}" r="9" class="v-f-muted"/>`+lines(B[0],B[1]+26,['Rationalisation','"I\'ll pay it back"'],'v-s','middle',14);
    g+=`<circle cx="${f(C[0])}" cy="${f(C[1])}" r="13" class="v-f-acc v-pulse"/><circle cx="${f(C[0])}" cy="${f(C[1])}" r="9" class="v-f-acc"/>`+lines(C[0],C[1]+26,['Opportunity','weak controls'],'v-t','middle',15);
    g+=lines(C[0],C[1]+60,['You can remove this one'],'v-l','middle',13);
    return svg(w,top+hgt+72,'Fraud needs pressure, rationalisation and opportunity; controls remove the opportunity.',g);
  },
  caption:'All three corners usually meet before fraud happens. You can\'t see into people\'s lives, but you can close the opportunity corner with simple controls.'});

put('m18','controls',{at:1,after:'Process Who should do what Why'},{title:'One purchase, four different people',
  draw:V.flow({label:'Production requests, purchasing orders, stores receives, finance matches, a second person approves, finance pays.',
    nodes:[{t:'Request materials',s:'Production'},{t:'Raise purchase order',s:'Purchasing'},{t:'Receive and count',s:'Stores'},{t:'Three-way match',s:'Finance',cls:'hl'},{t:'Approve the payment run',s:'GM or second approver',cls:'hl'},{t:'Pay the supplier',s:'Finance, through the bank'}]}),
  caption:'No single person can order something, accept it and pay for it. Faking a purchase would need several people to cooperate, which is why it rarely happens.'});

put('m18','controls',{at:3,after:'When you can\'t separate duties'},{title:'The three-way match',
  draw:function(w){
    const gap=12, dw=Math.min(180,(w-2*gap)/3), x0=(w-(3*dw+2*gap))/2, D=[['Purchase order','what we ordered'],['Goods-received note','what arrived'],['Supplier invoice','what we\'re billed']];
    const Ls=D.map(d=>nodeLines(dw,d[0],d[1])), dh=Math.max(...Ls.map(l=>l.h)), qw=Math.min(240,w-40), qy=dh+44, Lq=nodeLines(qw,'Do all three agree?','quantity, price, supplier');
    let g=''; D.forEach((d,i)=>{ const x=x0+i*(dw+gap); g+=node(x,4,dw,dh,Ls[i],'alt')+arrow(x+dw/2,dh+7,w/2+(i-1)*qw*0.3,qy-3); });
    g+=node((w-qw)/2,qy,qw,Lq.h,Lq,'hl');
    const oy=qy+Lq.h+46, ow=Math.min(170,(w-40)/2), Lp=nodeLines(ow,'Pay','on the due date'), Ln=nodeLines(ow,'Query','don\'t pay yet'), oh=Math.max(Lp.h,Ln.h);
    g+=arrow(w/2-20,qy+Lq.h+3,w/2-ow/2-10,oy-3)+txt(w/2-ow/2-16,qy+Lq.h+28,'Yes','v-l','end')+arrow(w/2+20,qy+Lq.h+3,w/2+ow/2+10,oy-3)+txt(w/2+ow/2+16,qy+Lq.h+28,'No','v-l','start');
    g+=node(w/2-ow-10,oy,ow,oh,Lp,'good')+node(w/2+10,oy,ow,oh,Ln,'bad');
    return svg(w,oy+oh+6,'A purchase order, goods-received note and supplier invoice are compared; pay only if all three agree.',g);
  },
  caption:'Three documents from three different people. If they don\'t agree, something was not ordered, not delivered, or billed wrongly, and the payment waits.'});

put('m18','case',{at:0,after:'$18,400 gone'},{title:'How the $18,400 left, and where it could have been stopped',
  draw:V.flow({label:'Fake email asks to change bank details; the record is changed without a call-back; the payment goes to the fraudster; the real supplier chases payment three weeks later.',labels:['no call-back','next payment','3 weeks later'],
    nodes:[{t:'Fake email: "our bank has changed"',s:'one letter different',cls:'bad'},{t:'Supplier record updated',s:'the control point: call back now',cls:'warn'},{t:'$18,400 paid',s:'to the fraudster\'s account',cls:'bad'},{t:'Real supplier calls',s:'"where is our money?"'}]}),
  caption:'The amber box is where a two-minute phone call to a number already on file would have stopped everything.'});


/* =================================================================== MODULE 19 */
put('m19','logic',{at:4,after:'The taxes that touch a manufacturer'},{title:'Where taxes touch BraceWorks',
  draw:function(w){
    const N=[['Tax office','income tax, VAT returns, payroll filings','hl'],['Local suppliers','charge input VAT; some payments carry withholding',''],['Employees','payroll taxes and contributions on wages',''],['Foreign customers','exports at 0% VAT; their country charges import VAT and duty',''],['Foreign service providers','payments abroad may need withholding','']];
    const nar=w<560, bw=nar?Math.min(150,(w-24)/2):Math.min(180,w*0.27), cw=Math.min(170,w*0.32);
    const Lc=nodeLines(cw,'BraceWorks','exporter and manufacturer'), Ls=N.map(n=>nodeLines(bw,n[0],n[1])), bh=Math.max(...Ls.map(l=>l.h));
    let g='', H_;
    const edge=(cx,cy,hw,hh,dx,dy)=>{ const t=Math.min(dx?hw/Math.abs(dx):1e9, dy?hh/Math.abs(dy):1e9); return [cx+dx*t,cy+dy*t]; };
    if(!nar){ const cx=w/2, rx=w/2-bw/2-6, ry=bh+40, cy=ry+bh/2+6; H_=2*ry+bh+12;
      N.forEach((n,i)=>{ const a=-Math.PI/2+i*2*Math.PI/N.length, x=cx+rx*Math.cos(a), y=cy+ry*Math.sin(a), dx=x-cx, dy=y-cy;
        const s1=edge(cx,cy,cw/2+3,Lc.h/2+3,dx,dy), s2=edge(x,y,bw/2+3,bh/2+3,-dx,-dy);
        g+=`<line x1="${f(s1[0])}" y1="${f(s1[1])}" x2="${f(s2[0])}" y2="${f(s2[1])}" class="v-edge" stroke-dasharray="4 4"/>`+node(x-bw/2,y-bh/2,bw,bh,Ls[i],n[2]); });
      g+=node(cx-cw/2,cy-Lc.h/2,cw,Lc.h,Lc,'good');
    } else { const nw=w-34, L2=N.map(n=>nodeLines(nw,n[0],n[1])); g+=node(6,4,Math.min(220,w-12),Lc.h,Lc,'good'); let y=Lc.h+18; const sx=18, ys=[];
      N.forEach((n,i)=>{ g+=node(28,y,nw,L2[i].h,L2[i],n[2]); ys.push(y+L2[i].h/2); y+=L2[i].h+10; });
      g+=`<line x1="${sx}" y1="${f(Lc.h+4)}" x2="${sx}" y2="${f(ys[ys.length-1])}" class="v-edge" stroke-dasharray="4 4"/>`+ys.map(yy=>`<line x1="${sx}" y1="${f(yy)}" x2="26" y2="${f(yy)}" class="v-edge"/>`).join('');
      H_=y; }
    return svg(w,H_,'BraceWorks deals with five groups that each bring a different tax: the tax office, local suppliers, employees, foreign customers and foreign service providers.',g);
  },
  caption:'Each relationship brings its own tax. Most of the course\'s accounting skills apply: VAT and withholding are balance sheet items to reconcile, payroll taxes are part of product cost, and income tax is a cash payment to plan.'});

put('m19','vat',{at:0,after:'is charged at every stage of a sale'},{title:'Following the VAT down the chain',
  draw:V.flow({label:'The foam supplier charges VAT to BraceWorks, which exports at 0% and reclaims it; the importing country charges VAT to the distributor and finally to the hospital.',labels:['sells foam','exports','sells on'],
    nodes:[{t:'Foam supplier',s:'charges BraceWorks $1,000 + 12% VAT = $120'},{t:'BraceWorks',s:'exports at 0% VAT; reclaims the $120',cls:'hl'},{t:'German distributor',s:'pays German import VAT, reclaims it later'},{t:'German hospital',s:'the final consumer: bears the VAT',cls:'good'}]}),
  caption:'Every business in the chain gets its VAT back; only the final consumer keeps paying it. The catch for BraceWorks is timing: it pays the $120 now and waits for the refund.'});

/* =================================================================== PRACTICE PACKS */
put('packB','dash',{at:1,after:'Revenue, March'},{title:'Gross margin, last 12 months',
  draw:V.line({label:'Gross margin drifted from about 28.6% to 26.7% over the last 12 months, below the 30% target.',x:['Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar'],fmt:pc0,tfmt:pc1,dots:true,yMin:24,yMax:32,endLabels:false,
    series:[{name:'Gross margin',v:[28.6,28.9,28.4,28.0,28.2,28.8,28.7,28.9,27.6,28.3,27.5,26.7],c:'s1'}],refs:[{v:30,label:'Target 30%'}],marks:[{i:11,label:'26.7%',dy:16}]}),
  caption:'A trend makes March\'s number meaningful: margin has been below target all year and is now falling.'});

swap('packB','ops',{at:3,n:'13-week liquidity forecast'},{title:'13-week liquidity forecast (cash + unused overdraft)',
  draw:V.line({label:'Liquidity stays between $56,000 and $88,000, lowest in week 6.',x:Array.from({length:13},(_,i)=>'W'+(i+1)),xName:'Week',fmt:k$,area:true,dots:true,yMin:0,endLabels:false,
    series:[{name:'Liquidity',v:[86,82,77,79,70,56,63,72,68,75,82,79,88].map(x=>x*1000),c:'s1'}],refs:[{v:30000,label:'Minimum $30k'}],marks:[{i:5,label:'$56k',dy:18}]}),
  caption:'Lowest point week 6: quarterly tax $6k plus payroll. Assumes US distributor A pays on its usual day 62.'});

put('packC','dash',{at:1,after:'Revenue, July'},{title:'Profit up, cash down: January to July',
  draw:V.line({label:'Cumulative profit after tax rose to $34,700 while cash fell from $38,000 to $10,500.',x:['Jan','Feb','Mar','Apr','May','Jun','Jul'],fmt:k$,dots:true,yMin:0,
    series:[{name:'Profit after tax, year to date',short:'Profit, YTD',v:[3,7,11,16,21,27,34.7].map(x=>x*1000),c:'s3'},{name:'Cash at month-end',short:'Cash',v:[38,33,30,26,22,16,10.5].map(x=>x*1000),c:'s2'}]}),
  caption:'The lines meet in May and keep moving apart. Every month, the business looked better on the P&L and worse in the bank.'});

swap('packC','ar',{at:2,n:'13-week liquidity forecast'},{title:'13-week liquidity forecast (cash + unused overdraft)',
  draw:V.line({label:'Liquidity goes negative in weeks 2 and 4, reaching minus $12,000, before recovering to $52,000 by week 13.',x:Array.from({length:13},(_,i)=>'W'+(i+1)),xName:'Week',fmt:k$,dots:true,zero:true,endLabels:false,
    series:[{name:'Liquidity',v:[9,-6,4,-12,3,18,26,14,31,40,33,46,52].map(x=>x*1000),c:'s2'}],refs:[{v:30000,label:'Minimum $30k'}],band:{lo:-15000,hi:0,label:'Out of cash'},marks:[{i:3,label:'($12k)',dy:18},{i:1,label:'($6k)',dy:18}]}),
  caption:'Week 2: payroll $12k. Week 4: payroll $12k, foam supplier $18k, quarterly tax $5k. Assumes the Saudi $18k arrives in week 6 and US distributor A pays $88k in week 11.'});
})();
