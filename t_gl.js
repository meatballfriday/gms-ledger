const {JSDOM,VirtualConsole}=require('/tmp/claude-0/jt/node_modules/jsdom');const fs=require('fs');
const d=new JSDOM('<body>'+fs.readFileSync('dist/gm-ledger.html','utf8')+'</body>',{runScripts:'dangerously',pretendToBeVisual:true,virtualConsole:new VirtualConsole(),url:'https://x.org/'});
const BW=d.window.BW; const all=[];
Object.values(BW.mods).forEach(m=>(m.glossary||[]).forEach(g=>all.push([g.term,m.id])));
const seen={}; all.forEach(([t,m])=>{const k=t.toLowerCase(); (seen[k]=seen[k]||[]).push(m)});
console.log('entries',all.length,'unique',Object.keys(seen).length);
console.log(Object.entries(seen).filter(([k,v])=>v.length>1).map(([k,v])=>k+':'+v.join('/')).join(' | '));
console.log(Object.keys(seen).sort().join(' · '));
// .term spans used in content
const terms=new Set(); const html=fs.readFileSync('dist/gm-ledger.html','utf8'); (html.match(/class="term">[^<]+</g)||[]).forEach(x=>terms.add(x.replace('class="term">','').replace('<','')));
console.log('\nTERM SPANS',terms.size,[...terms].join(' · '));
