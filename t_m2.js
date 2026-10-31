const {JSDOM,VirtualConsole}=require('/tmp/claude-0/jt/node_modules/jsdom');const fs=require('fs');
const vc=new VirtualConsole();const errs=[];vc.on('jsdomError',e=>{if(!/stylesheet|link/i.test(e.message))errs.push(e.message)});
const d=new JSDOM('<body>'+fs.readFileSync('dist/gm-ledger.html','utf8')+'</body>',{runScripts:'dangerously',pretendToBeVisual:true,virtualConsole:vc,url:'https://x.org/'});
const w=d.window;w.scrollTo=()=>{};w.BW.go('m2',2);
for(let i=0;i<11;i++){const s=w.document.querySelector('[data-show]');s.click();const nx=w.document.querySelector('[data-next]');nx.click();}
const t=w.document.getElementById('main').textContent;
console.log(/Month closed/.test(t), (t.match(/Net profit\$[\d,]+/)||[])[0], (t.match(/Total assets\$[\d,]+/)||[])[0], errs);
