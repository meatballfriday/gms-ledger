// Checks the live tools: JS results match the Excel templates, the UI renders, and "download with my numbers" produces valid files.
const {JSDOM,VirtualConsole}=require('/tmp/claude-0/jt/node_modules/jsdom');const fs=require('fs');
const vc=new VirtualConsole();const errs=[];vc.on('jsdomError',e=>{if(!/stylesheet|link|scrollTo|Not implemented/i.test(e.message))errs.push(e.message)});
const d=new JSDOM('<body>'+fs.readFileSync('dist/gm-ledger.html','utf8')+'</body>',{runScripts:'dangerously',pretendToBeVisual:true,virtualConsole:vc,url:'https://x.org/'});
const w=d.window, doc=w.document, BW=w.BW; w.scrollTo=()=>{};
// give the page the stream APIs it uses in real browsers
Object.assign(w,{DecompressionStream,CompressionStream,Response,Blob,TextDecoder,TextEncoder});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const ok=(n,c,x)=>console.log((c?'PASS ':'FAIL ')+n+(x!==undefined?' | '+x:''));
const near=(a,b,t=0.01)=>Math.abs(a-b)<=t*Math.max(1,Math.abs(b));
(async()=>{
  const T=BW.tools;
  const b=T.budget.calc(T.budget.defaults()); ok('budget revenue',near(b.t.rev,1289148),b.t.rev); ok('budget net',near(b.t.net,61493.34),b.t.net.toFixed(2)); ok('budget break-even',near(b.be,1116519.84),b.be.toFixed(2)); ok('budget close cash',near(b.cf.close,97983.27),b.cf.close.toFixed(2));
  const q=T.quote.calc(T.quote.defaults()); ok('quote price',near(q.q,194.462068,1e-6),q.q); ok('quote zero',near(q.zero,144.179654,1e-6)); ok('quote floor',near(q.floor,112.737319,1e-6)); ok('quote margin at list',near(q.ml,0.19240487,1e-6)); ok('quote contribution',near(q.contrib,17383.41,1e-6));
  const c=T.capex.calc(T.capex.defaults()); ok('capex npv',near(c.npv,61301.39,1e-6),c.npv.toFixed(2)); ok('capex irr',near(c.irr,0.338285,1e-4),c.irr); ok('capex payback',near(c.pb,2.6906,1e-3),c.pb); ok('capex sens',near(c.npvS,25610.73,1e-6));
  const f=T.cash13.calc(T.cash13.defaults()); ok('cash13 headroom',JSON.stringify(f.head)===JSON.stringify([91100,80600,108100,94600,86100,71600,95100,76600,69100,54600,80100,61600,54100]),f.head.join(',')); ok('cash13 low',f.low===54100&&f.lw===12);
  // UI: open each tool through the Toolkit
  for(const k of ['cash13','budget','quote','capex']){ BW.openTool(k); await sleep(250); const tool=doc.querySelector('.tool'); ok('render '+k, !!tool && /Download with my numbers/.test(tool.textContent), tool&&tool.querySelector('h3').textContent);
    const inp=tool.querySelector('.tin:not(.txt)'); inp.value='12345'; inp.dispatchEvent(new w.Event('input')); await sleep(200); }
  ok('state saved', BW.state.tools && Object.keys(BW.state.tools).length===4);
  // late-payer what-if
  BW.state.tools.cash13=T.cash13.defaults(); BW.openTool('cash13'); await sleep(200);
  [...doc.querySelectorAll('.tool-what .seg button')].find(x=>/US distributor A/.test(x.textContent)).click(); await sleep(50);
  ok('late payer text', /lowest headroom becomes/.test(doc.querySelector('.tw-o').textContent), doc.querySelector('.tw-o').textContent.slice(0,120));
  // fill buttons on template cards and module link
  BW.go('kit',3); await sleep(50); ok('template cards have Use it in the page', doc.querySelectorAll('.tmpl .tmpl-a .btn.ghost').length===4);
  const m=BW.mods.m15; BW.go('m15',m.sections.findIndex(s=>s.id==='build')); await sleep(50); ok('module link', !!doc.querySelector('.tool-link .packlink'));
  // xlsx: write changed inputs, then let LibreOffice recalculate and compare
  const qs=T.quote.defaults(); qs.inco='DDP'; qs.target=0.30; qs.product='Test & <sling>'; qs.qty=500;
  const bs=T.budget.defaults(); bs.p[2].u=15000; bs.a.extra=3; bs.a.dso=80;
  const cs=T.capex.defaults(); cs.life=6; cs.ben[0]=14000; cs.item='New cutter';
  const fs13=T.cash13.defaults(); fs13.open=-80000; fs13.rec[0][2]=0; fs13.rec[0][4]=25000;
  const out={quote:[qs,'export-quote-calculator.xlsx'],budget:[bs,'budget-builder.xlsx'],capex:[cs,'equipment-purchase-proposal.xlsx'],cash13:[fs13,'13-week-cash-forecast.xlsx']};
  const res={};
  for(const k in out){ const [st,file]=out[k]; const blob=await BW.fillXlsx(file,T[k].edits(st)); const buf=Buffer.from(await blob.arrayBuffer()); fs.writeFileSync(`/tmp/claude-0/tt_${k}.xlsx`,buf); res[k]=T[k].calc(st); }
  fs.writeFileSync('/tmp/claude-0/tt_expect.json',JSON.stringify({quote:{q:res.quote.q,ml:res.quote.ml},budget:{net:res.budget.t.net,close:res.budget.cf.close},capex:{npv:res.capex.npv,pb:res.capex.pb},cash13:{low:res.cash13.low}}));
  console.log('files written');
  console.log(errs.length?'ERRORS '+errs.join('\n'):'no errors');
  process.exit(0);
})();
