const {JSDOM,VirtualConsole}=require('/tmp/claude-0/jt/node_modules/jsdom');const fs=require('fs');
const d=new JSDOM('<body>'+fs.readFileSync('dist/gm-ledger.html','utf8')+'</body>',{runScripts:'dangerously',pretendToBeVisual:true,virtualConsole:new VirtualConsole(),url:'https://x.org/'});
const BW=d.window.BW; const c={};
const all=[...Object.values(BW.mods),...Object.values(BW.packs)];
all.forEach(m=>m.sections.forEach(s=>s.blocks.forEach(b=>{ const t=typeof b==='string'?'text':b.t==='callout'?'callout:'+b.tone:b.t; c[t]=(c[t]||0)+1; })));
const mins=Object.values(BW.mods).reduce((a,m)=>a+(m.minutes||0),0);
console.log(JSON.stringify(c),'minutes',mins,'gloss',BW.gloss.list().length,'warnings',Object.values(BW.mods).reduce((a,m)=>a+(m.warnings||[]).length,0),'formulas',Object.values(BW.mods).reduce((a,m)=>a+(m.formulas||[]).length,0));
// full text for keyword coverage scan
const txt=all.map(m=>m.sections.map(s=>s.blocks.map(b=>typeof b==='string'?b:JSON.stringify(b)).join(' ')).join(' ')).join(' ').toLowerCase();
['vat','withholding','13th','sss','philhealth','peza','transfer pricing','income tax','deferred tax','lease','ifrs','pfrs','warranty','rebate','return','capitalis','wacc','cost of capital','valuation','multiple','dividend','related part','owner','oee','safety stock','eoq','insurance','product liability','recall','sanction','bribery','erp','notes to the','accounting polic','going concern','expected credit','impairment'].forEach(k=>{ const n=(txt.match(new RegExp(k,'g'))||[]).length; console.log(k.padEnd(18),n); });
