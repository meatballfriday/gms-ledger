const {JSDOM,VirtualConsole}=require('/tmp/claude-0/jt/node_modules/jsdom');const fs=require('fs');
const vc=new VirtualConsole();const errs=[];vc.on('jsdomError',e=>{if(!/stylesheet|link/i.test(e.message))errs.push(e.message)});
const d=new JSDOM('<body>'+fs.readFileSync('dist/gm-ledger.html','utf8')+'</body>',{runScripts:'dangerously',pretendToBeVisual:true,virtualConsole:vc,url:'https://x.org/'});
const w=d.window;w.scrollTo=()=>{};const doc=w.document;
console.log('theme attr',doc.documentElement.getAttribute('data-theme'),doc.getElementById('theme').textContent);
doc.getElementById('theme').click();console.log('after click',doc.documentElement.getAttribute('data-theme'));
w.BW.go('m9',2);
// choose pack B (second seg button), fill all with 2, show expert
const seg=doc.querySelector('.w-body .seg'); seg.querySelectorAll('button')[1].click();
doc.querySelectorAll('.w-body .sort-item .seg').forEach(g=>g.querySelectorAll('button')[2].click());
[...doc.querySelectorAll('.w-body button')].find(b=>/expert/.test(b.textContent)).click();
const t=doc.getElementById('main').textContent;
console.log((t.match(/Your score\d+ \/ 40/)||[])[0],(t.match(/Expert score\d+ \/ 40/)||[])[0],(t.match(/Expert: \d · you gave 2/g)||[]).length,'disagreements');
w.BW.go('packC',4);console.log(doc.querySelector('h2').textContent, errs);
w.BW.go('m1',7);console.log([...doc.querySelectorAll('.sectab')].map(x=>x.textContent).slice(-2), doc.querySelector('.packlink')?.textContent);
