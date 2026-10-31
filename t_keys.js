const {JSDOM,VirtualConsole}=require('/tmp/claude-0/jt/node_modules/jsdom');const fs=require('fs');
function load(html){const vc=new VirtualConsole();const d=new JSDOM('<body>'+html+'</body>',{runScripts:'dangerously',pretendToBeVisual:true,virtualConsole:vc,url:'https://x.org/'});d.window.scrollTo=()=>{};return d.window;}
const full=fs.readFileSync('dist/gm-ledger.html','utf8');
// build a copy without visuals.js content
const vis=fs.readFileSync('src/visuals.js','utf8'); const bare=full.replace(vis,'');
const A=load(full).BW, B=load(bare).BW;
let diff=0,checked=0;
for(const id of [...Object.keys(B.mods),...Object.keys(B.packs)]){ const ma=A.mods[id]||A.packs[id], mb=B.mods[id]||B.packs[id];
  mb.sections.forEach(sb=>{ const sa=ma.sections.find(x=>x.id===sb.id); const ka=A.keyIdx(sa), kb=B.keyIdx(sb);
    const keysA=sa.blocks.map((b,i)=>b&&['quiz','sort','widget','check'].includes(b.t)?(b.t+':'+(b.q||b.prompt||b.title||b.id)+'@'+ka[i]):null).filter(Boolean);
    const keysB=sb.blocks.map((b,i)=>b&&['quiz','sort','widget','check'].includes(b.t)?(b.t+':'+(b.q||b.prompt||b.title||b.id)+'@'+kb[i]):null).filter(Boolean);
    keysB.forEach(k=>{ checked++; if(!keysA.includes(k)){ const replaced=/widget:(Month-end cash at BraceWorks|The hockey stick|13-week liquidity)/.test(k); if(!replaced){ diff++; console.log('MOVED',id,sb.id,k);} } });
  }); }
console.log('checked',checked,'moved',diff);
