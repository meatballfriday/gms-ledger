// Dump identity of every saved-answer slot; compare against baseline if present.
const {JSDOM,VirtualConsole}=require('/tmp/claude-0/jt/node_modules/jsdom');const fs=require('fs');
const d=new JSDOM('<body>'+fs.readFileSync('dist/gm-ledger.html','utf8')+'</body>',{runScripts:'dangerously',pretendToBeVisual:true,virtualConsole:new VirtualConsole(),url:'https://x.org/'});
const BW=d.window.BW; const out={};
for(const id of [...Object.keys(BW.mods),...Object.keys(BW.packs)]){ const m=BW.mods[id]||BW.packs[id];
  m.sections.forEach(s=>{ const ki=BW.keyIdx(s); s.blocks.forEach((b,i)=>{ if(b&&['quiz','sort','widget','check'].includes(b.t)){ const k=b.t==='check'?'check:'+b.id:`${id}.${s.id}.${ki[i]}`; out[k]=(b.t+':'+(b.q||b.prompt||b.title||b.id)).slice(0,90); } }); }); }
if(process.argv[2]==='save'){ fs.writeFileSync('baseline.json',JSON.stringify(out,null,1)); console.log('saved',Object.keys(out).length); }
else { const base=JSON.parse(fs.readFileSync('baseline.json','utf8')); let bad=0; for(const k in base){ if(out[k]!==base[k]){ bad++; console.log('CHANGED',k,'|',base[k],'→',out[k]); } } console.log('baseline slots',Object.keys(base).length,'changed',bad,'new slots',Object.keys(out).filter(k=>!(k in base)).length); }
