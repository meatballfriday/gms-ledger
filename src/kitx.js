/* Toolkit extras: downloadable Excel templates + questions-to-ask bank. Appended as Toolkit sections 3 and 4. */
(function(){
const secIx=(m,s)=>{ const mod=BW.mods[m]; if(!mod) return 0; const i=mod.sections.findIndex(x=>x.id===s); return i<0?0:i; };
const modName=m=>{ const mod=BW.mods[m]; const n=m==='cap'?'Capstone':'Module '+BW.modNo(m); return mod?`${n}: ${mod.title}`:n; };
const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ---------- saving files ---------- */
const XLSX='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
function b64Blob(b64,type){ const bin=atob(b64); const u=new Uint8Array(bin.length); for(let i=0;i<bin.length;i++) u[i]=bin.charCodeAt(i); return new Blob([u],{type}); }
let dlP=null;
function getDownloads(){ if(!dlP) dlP=(window.claude&&typeof window.claude.use==='function')?Promise.resolve(window.claude.use('downloads')).catch(()=>null):Promise.resolve(null); return dlP; }
async function saveFile(filename,data,say){
  say('Preparing the file…');
  const d=await getDownloads();
  if(d){
    try{ const r=await d.save({filename,data}); say(r&&r.status==='delivered'?'Sent.':'Downloaded. Look in your downloads folder.'); }
    catch(e){ const c=e&&e.code;
      if(c==='declined') say('Download cancelled.');
      else if(c==='rate_limited') say('Another download is waiting for your answer. Finish that one first, then try again.');
      else say('Downloads aren’t available in this view. Open the course in the Claude app or a web browser and try again.'); }
    return;
  }
  try{
    if(!(window.URL&&URL.createObjectURL)) throw 0;
    const blob=data instanceof Blob?data:new Blob([data],{type:'text/plain'});
    const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=filename; document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(url),5000);
    say(window.claude?'If nothing downloaded, this view blocks downloads. Open the course in the Claude app or a web browser and try again.':'Downloaded. Look in your downloads folder.');
  }catch(_){ say('Downloads aren’t available in this view. Open the course in the Claude app or a web browser and try again.'); }
}
BW.saveFile=saveFile;

/* ---------- templates ---------- */
const T=[
  {file:'13-week-cash-forecast.xlsx',title:'13-week cash forecast',icon:'cash',m:'m10',s:'cash13',
   what:'Week-by-week receipts, payments, closing cash and headroom against your overdraft limit, with the lowest point flagged.',
   sheets:['Forecast','Last week vs forecast'],when:'Every Monday. Roll it forward one week each time.'},
  {file:'budget-builder.xlsx',title:'Budget builder',icon:'budget',m:'m15',s:'build',
   what:'Set prices, volumes, seasonality, wage rises and overheads on one sheet. Get a monthly income statement, break-even sales and a year-end cash estimate.',
   sheets:['Assumptions','Budget P&L','Cash summary'],when:'Once a year, then reforecast each quarter.'},
  {file:'kpi-dashboard.xlsx',title:'KPI dashboard',icon:'kpi',m:'m11',s:'dash',
   what:'Ten KPIs with target, owner, a 12-month trend and a red/amber/green status. Type in a few numbers from the monthly pack and the KPIs calculate themselves.',
   sheets:['Dashboard','Monthly inputs'],when:'Monthly, the day the pack arrives.'},
  {file:'export-quote-calculator.xlsx',title:'Export quote calculator',icon:'quote',m:'m12',s:'price',
   what:'Price a quote that covers the Incoterm, commission, payment terms and currency risk. Shows the price at your target margin, the zero-margin price and the floor.',
   sheets:['Quote'],when:'Every quote above your normal list-price terms.'},
  {file:'month-end-close-checklist.xlsx',title:'Month-end close checklist',icon:'check',m:'m2',s:'close',
   what:'The 20 close steps with owner, due day, done date and status. Overdue steps turn red, and a progress figure shows how close you are.',
   sheets:['Checklist'],when:'Every month-end. Ask finance to send it with the pack.'},
  {file:'equipment-purchase-proposal.xlsx',title:'Equipment purchase proposal',icon:'capex',m:'m14',s:'methods',
   what:'A one-page investment case: NPV, IRR, payback and a "what if benefits are 30% lower" test, with a plain-English recommendation.',
   sheets:['Proposal'],when:'Any purchase above your approval limit.'},
  {file:'three-statement-forecast.xlsx',title:'Three-statement forecast',icon:'budget',m:'m22',s:'build',
   what:'A three-year forecast where the income statement, balance sheet and cash flow are linked. The overdraft balances automatically, and the sheet checks covenants and that it balances.',
   sheets:['Assumptions','Forecast'],when:'For the annual budget, a bank request, or before a big decision.'},
  {file:'annual-report-reader.xlsx',title:'Annual report reader',icon:'reader',m:'m21',s:'apply',
   what:'Type up to four years of figures from any annual report and get margins, cash conversion, free cash flow, working-capital days, debt ratios and nine warning signs. Comes filled in with Invacare\u2019s real 10-K figures.',
   sheets:['Inputs','Ratios and flags'],when:'Before meeting a big customer, supplier, competitor or lender, and once a year on your own accounts.'}
];
const ICON={
  cash:'<path d="M4 17l5-5 4 3 7-8"/><path d="M15 7h5v5"/>',
  budget:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>',
  kpi:'<circle cx="12" cy="13" r="8"/><path d="M12 13l4-4"/><path d="M12 5v2"/>',
  quote:'<path d="M3 7h13l5 5-5 5H3z"/><circle cx="8" cy="12" r="1.6"/>',
  check:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 9l2 2 4-4M8 16h8"/>',
  capex:'<rect x="3" y="9" width="18" height="10" rx="1"/><path d="M7 9V5h10v4M8 14h3"/>',
  reader:'<rect x="4" y="3" width="13" height="18" rx="2"/><path d="M7 8h7M7 12h5"/><circle cx="17" cy="16" r="3.2"/><path d="M19.4 18.4l2 2"/>'
};
const tmplSec={id:'tmpl',label:'Templates',kind:'learn',title:'Excel templates to download',blocks:[
  `<p>Eight working Excel files built from the course. Seven come filled in with BraceWorks' example figures and the annual report reader with a real company's, so you can see how it should look before you type your own over them. Every file opens with a <strong>How to use</strong> sheet.</p>`,
  {t:'live',cls:'tmpl-grid',render(box){
    const have=BW.tmplData||{};
    box.innerHTML=T.map((x,i)=>`<article class="tmpl"><div class="tmpl-h"><svg viewBox="0 0 24 24" aria-hidden="true">${ICON[x.icon]}</svg><div><h4>${x.title}</h4><div class="tmpl-f">${x.file}</div></div></div>
      <p>${x.what}</p>
      <dl class="tmpl-m"><div><dt>Sheets</dt><dd>${x.sheets.join(' · ')}</dd></div><div><dt>Use it</dt><dd>${x.when}</dd></div><div><dt>Learn it</dt><dd><button type="button" class="linkbtn" data-go="${i}">${modName(x.m)}</button></dd></div></dl>
      <div class="tmpl-a"><button type="button" class="btn small" data-dl="${i}" ${have[x.file]?'':'disabled'}><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" style="fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round"><path d="M12 4v11M7 10l5 5 5-5M5 20h14"/></svg>Download .xlsx</button><span class="tmpl-s small" role="status" aria-live="polite"></span></div></article>`).join('');
    box.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>{ const x=T[+b.dataset.go]; BW.go(x.m,secIx(x.m,x.s),{jump:true}); });
    box.querySelectorAll('[data-dl]').forEach(b=>b.onclick=()=>{ const x=T[+b.dataset.dl]; const st=b.parentNode.querySelector('.tmpl-s'); const say=t=>{ st.textContent=t; };
      b.disabled=true; saveFile(x.file,b64Blob(have[x.file],XLSX),say).finally(()=>{ b.disabled=false; }); });
  }},
  {t:'callout',tone:'tip',title:'How the templates are colour-coded',html:`<ul><li><strong style="color:#0000ff;background:#ffff00;padding:0 4px">Blue text on yellow</strong>: an input. Type your own figures here.</li><li><strong>Black text</strong>: a formula. Don't type over these, or the sheet stops calculating.</li><li><strong style="color:#008000">Green text</strong>: a figure brought in from another sheet.</li></ul><p>This is the convention most finance teams use. If your accountant builds models, ask them to follow it too: you'll always know which numbers are assumptions and which are results.</p>`},
  {t:'callout',tone:'report',title:'Make them yours',html:`<p>Start with the <strong>13-week cash forecast</strong> and the <strong>KPI dashboard</strong>. Ask your finance team to fill them in every week and every month, and to send them with the pack. After three months you'll have a trend, and you'll know which forecasts can be trusted.</p><p>The files were built for Microsoft Excel. They also open in Google Sheets and Apple Numbers, but a few features, such as the colour warnings, may look different there.</p>`}
]};

/* ---------- question bank ---------- */
const QB=[
 {g:'The monthly pack',qs:[
  ['Why was our change in cash different from our profit last month?','Three or four named items with amounts: "Receivables rose $20k because the US order is unpaid; we paid the $12k machine deposit."','"It’s just timing." No items, no amounts.','m1','connect'],
  ['What are the three things in this pack I should worry about, and what is being done about each?','Specific issues, each with an owner and a date.','"Everything is fine" every month, or a list of 15 small things.','m9','comment'],
  ['Which numbers this month are estimates, and how big are they?','A short list: accruals, the stock valuation, the warranty provision, each with a dollar figure.','"None": every month has estimates.','m2','close'],
  ['On what working day did the close finish, and were the bank, receivables, payables and inventory reconciled?','A date (working day 5 to 8 is good for your size) and the reconciliations signed off.','"We reconcile at year end."','m2','close'],
  ['What changed against last month’s forecast, and why?','The two or three biggest moves explained, and the forecast updated.','No forecast to compare against.','m15','fcst']]},
 {g:'Cash and borrowing',qs:[
  ['What is our lowest headroom in the next 13 weeks, and in which week?','A dollar figure and a week, plus what we’ll do if it’s tight.','"We’ll be fine." No 13-week forecast.','m10','cash13'],
  ['Which customers pay later than their terms, and how much is over 60 days?','Names and amounts from the aging, with a plan for each.','Only the total receivables figure.','m10','aging'],
  ['How many days of cash are tied up in receivables, inventory and payables, and is it getting better or worse?','The cash conversion cycle in days, compared with last quarter.','No one tracks it.','m16','ccc'],
  ['How close are we to each bank covenant?','Each covenant, the limit, our figure and the headroom.','"I’d have to check the loan agreement."','m17','bank'],
  ['Which suppliers are we paying late, and could any of them stop supplying us?','A short list with how many days late and the risk to supply.','Paying late as a habit, without a plan.','m16','levers']]},
 {g:'Margins and pricing',qs:[
  ['What was our gross margin each month for the last 12 months, and why did it move?','A trend line plus reasons: price, material cost, mix, scrap.','The figure, but no "why".','m3','margins'],
  ['How much did freight, discounts, rebates and scrap cost us last month, as a % of sales?','Each leak shown separately, against target.','All buried in "cost of sales".','m3','leaks'],
  ['When did we last raise prices, and how much of the material cost increase did we pass on?','Dates, % increases, and how many customers accepted.','"We don’t want to lose customers."','m12','raise'],
  ['What are our break-even sales per month, and how far above them are we?','A monthly figure and the margin of safety in %.','No split between fixed and variable costs.','m12','be'],
  ['Which products and customers earn the least per hour of our bottleneck?','A ranking by contribution per bottleneck hour, not by revenue.','A ranking by revenue only.','m13','bottle']]},
 {g:'Costs and inventory',qs:[
  ['How is this product’s unit cost built up, and when was it last updated?','Materials, labour, overhead and freight, updated in the last 12 months.','A cost set years ago that no one can explain.','m6','build'],
  ['Which stock hasn’t moved in six months, and what is it worth?','A list by item with value and a plan: use, sell or write off.','"It’ll sell eventually."','m7','health'],
  ['Did profit rise this month only because we built stock?','The overhead absorbed into inventory shown separately, with production vs sales volume.','No one knows how overhead is absorbed.','m7','absorb'],
  ['What were the biggest variances against standard cost, and who owns each?','Price, usage and efficiency variances, each with an owner and a cause.','A single "cost of sales variance" line.','m8','split'],
  ['What did quality problems cost us: scrap, rework, returns and complaints?','A cost-of-quality figure each month.','Scrap counted in units only, never in dollars.','m8','coq']]},
 {g:'Customers and export',qs:[
  ['What happens to our profit if the dollar moves 10% against our main currencies?','A dollar figure by currency, and what’s hedged.','"We invoice in dollars, so there’s no risk" (check your costs).','m17','fx'],
  ['Which customers buy on open account, and how much of that is covered by credit insurance or letters of credit?','Exposure by customer, with cover and limits.','Large new customers on open account with no checks.','m17','pay'],
  ['Which Incoterm is each big customer on, and does our quote include all the costs that come with it?','Incoterm by customer, matched to freight and insurance in the quote.','Quoting CIF or DAP with EXW-style prices.','m17','inco'],
  ['What share of sales comes from our largest customer, and what’s the plan if they leave?','The % and a realistic plan.','Over 25% and no plan.','m11','set']]},
 {g:'Investment and funding',qs:[
  ['What are the NPV and payback, and what happens if benefits come in 30% lower?','NPV at our cost of capital, payback, and the sensitivity case still positive.','Payback only, with best-case savings.','m14','methods'],
  ['Who owns the savings, and when will we check that they happened?','A named person and a review date 12 months out.','"The savings will come."','m14','play'],
  ['Should this be paid for with a term loan, a lease or the overdraft?','Long-term assets funded with long-term money.','Machines bought from the overdraft.','m20','sources'],
  ['How much more could we borrow before we breach a covenant?','A dollar figure, based on EBITDA and the covenant limit.','No idea of debt capacity.','m20','capacity'],
  ['Can we afford this dividend after the next 13 weeks’ cash needs and our covenants?','The 13-week forecast with the dividend in it, and the covenant tests.','"The profit is there," with no cash check.','m20','case']]},
 {g:'Tax',qs:[
  ['What was our effective tax rate last year, and why does it differ from the headline rate?','A reconciliation: incentives, non-deductible costs, losses used.','"Tax is whatever the accountant says."','m19','profit'],
  ['How much VAT is waiting to be refunded, and which claims are close to their deadline?','Amounts by period, with filing dates.','Refunds never claimed because "it’s too much paperwork".','m19','vat'],
  ['Do we qualify for an export incentive, and have we compared the options?','The incentives we qualify for, with tax saved under each.','"We’ve always done it this way."','m19','logic'],
  ['Did we withhold the right tax on every payment abroad?','A list of foreign payments (royalties, services, interest) with the tax withheld.','Paying foreign consultants gross, with no review.','m19','cross'],
  ['Are our tax payment dates for the next 12 months in the cash forecast?','Each date and amount in the forecast.','Tax bills that come as a surprise.','m19','profit']]},
 {g:'Judgement calls',qs:[
  ['Which three estimates move our profit the most, and what would a reasonable change in each do?','Named estimates with dollar effects: "the warranty rate, plus or minus 0.5%, is $2,500."','"Everything is standard."','m24','estimates'],
  ['How do we decide which month a shipment counts in, and how are rebates and returns estimated?','A written cut-off rule by Incoterm, and monthly rebate accruals against each tier.','Rebates booked when paid; sales that spike at month-end.','m24','revenue'],
  ['What did we capitalise this year, and under which rule?','A list by project and asset, with the policy and threshold.','Repairs or development parked on the balance sheet with no list.','m24','capitalise'],
  ['Does our warranty provision rate still match the claims we see?','Claims history against the provision, reviewed quarterly.','The same rate for years, whatever happens to claims.','m24','provisions'],
  ['Which accounting framework do we follow, and how does it treat our leases?','The framework named, with the effect on EBITDA, debt and our covenants.','No one is sure.','m24','rules']]},
 {g:'Growing into a multinational',qs:[
  ['On which working day does the group pack arrive, and what delays it most?','A day number (about 10 is good) and the one step that holds it up.','"It depends on the countries."','m25','close'],
  ['Are intercompany balances agreed before month-end, by every pair of companies?','Yes, with a written policy on cut-off, exchange rates and settlement.','Differences carried forward month after month.','m25','ic'],
  ['How much cash do we hold in each country, and is any company borrowing while another has a surplus?','A weekly report by company, bank and currency.','Nobody can say without asking each country.','m26','visibility'],
  ['What does our hedging policy allow, and are our current hedges within it?','Hedges within limits, all plain products, reported monthly with their market value.','"Treasury made money again this year."','m26','fx'],
  ['If a buyer\'s accountants looked at our EBITDA tomorrow, what would they adjust?','A list of add-backs with evidence, and the ones that wouldn\'t survive.','"Our adjusted EBITDA is what it is."','m28','qoe']]},
 {g:'Controls and audit',qs:[
  ['Who can add a new supplier or change bank details, and who checks it?','Two different people, with a call-back to a known number.','One person can do both.','m18','fraud'],
  ['What did the auditor’s management letter say, and what has been fixed?','Each point with an owner, a date and a status.','No one has read it.','m18','audit'],
  ['What adjustments did the auditor make, and why didn’t our monthly numbers catch them?','The adjustments and the change to the monthly close that stops them recurring.','Big year-end surprises, every year.','m18','audit'],
  ['Which estimates in our accounts carry the most risk?','Warranty, slow stock and bad debts, with how each is worked out.','Estimates no one can explain.','m4','judgement'],
  ['Do we have any dealings with owners or their related companies, and are they on market terms?','A list, approved and disclosed.','Loans to owners with no paperwork.','m18','governance']]}
];
const qbText=()=>'Questions to ask your finance team\nFrom The GM’s Ledger course\n\n'+QB.map(g=>g.g.toUpperCase()+'\n'+g.qs.map((q,i)=>`${i+1}. ${q[0]}\n   A good answer: ${q[1]}\n   Red flag: ${q[2]}\n   (${modName(q[3])})`).join('\n')).join('\n\n')+'\n';
const askSec={id:'ask',label:'Questions to ask',kind:'learn',title:'Questions to ask your finance team',blocks:[
  `<p>The questions a finance-savvy GM asks, grouped by topic, each with what a good answer sounds like and the red flag to listen for. Pick two or three for each monthly review meeting. You don't need to ask them all at once.</p>`,
  {t:'live',cls:'qb',render(box,ctx){
    let topic='', q='';
    const total=QB.reduce((n,g)=>n+g.qs.length,0);
    box.innerHTML=`<div class="qb-bar"><label class="sr" for="${ctx.uid('s')}">Search the questions</label><input class="search" id="${ctx.uid('s')}" type="search" placeholder="Search, for example “margin” or “VAT”" autocomplete="off"><button type="button" class="btn ghost small qb-dl">Download as a text file</button></div><div class="az qb-t" role="group" aria-label="Filter by topic"></div><div class="qb-c small" style="color:var(--muted)"></div><span class="qb-s small" role="status" aria-live="polite"></span><div class="qb-list"></div>`;
    const tb=box.querySelector('.qb-t'), list=box.querySelector('.qb-list'), inp=box.querySelector('input'), cnt=box.querySelector('.qb-c');
    ['All'].concat(QB.map(g=>g.g)).forEach((name,ix)=>{ const b=document.createElement('button'); b.type='button'; b.textContent=name; b.setAttribute('aria-pressed',String(ix===0)); b.onclick=()=>{ topic=ix?name:''; tb.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',String(x===b))); draw(); }; tb.appendChild(b); });
    const draw=()=>{ const qq=q.trim().toLowerCase(); let n=0;
      list.innerHTML=QB.filter(g=>!topic||g.g===topic).map(g=>{ const rows=g.qs.map((x,i)=>({x,i})).filter(({x})=>!qq||x.slice(0,3).join(' ').toLowerCase().includes(qq)); n+=rows.length; if(!rows.length) return '';
        return `<section class="qb-g"><h4>${g.g}</h4>${rows.map(({x,i})=>`<details class="qb-q"><summary>${esc(x[0])}</summary><div class="qb-a"><p><span class="qb-ok">A good answer</span>${esc(x[1])}</p><p><span class="qb-no">Red flag</span>${esc(x[2])}</p><button type="button" class="linkbtn" data-m="${x[3]}" data-s="${x[4]}">${modName(x[3])}</button></div></details>`).join('')}</section>`; }).join('')||'<p>No question matches. Try a shorter word.</p>';
      cnt.textContent=qq||topic?`${n} of ${total} questions`:`${total} questions`;
      list.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>BW.go(b.dataset.m,secIx(b.dataset.m,b.dataset.s),{jump:true})); };
    inp.addEventListener('input',()=>{ q=inp.value; draw(); });
    const st=box.querySelector('.qb-s'), dl=box.querySelector('.qb-dl');
    dl.onclick=()=>{ dl.disabled=true; saveFile('questions-to-ask-finance.txt',qbText(),t=>{ st.textContent=t; }).finally(()=>{ dl.disabled=false; }); };
    draw();
  }},
  {t:'callout',tone:'tip',title:'How to ask without sounding like an auditor',html:`<p>Ask with curiosity, not suspicion: "Help me understand…" works better than "Why didn't you…". Give notice of the questions before the meeting so your team can prepare a real answer. And when the answer is "we don't know yet", agree a date. That's a good result: you've found a gap before it found you.</p>`}
]};
BW.kitExtra=[tmplSec,askSec];
})();
