// Runtime smoke test: renders every module section, pokes every widget control, reports JS errors.
const {JSDOM, VirtualConsole} = require('/tmp/claude-0/jt/node_modules/jsdom');
const fs = require('fs');
const html = fs.readFileSync('/home/claude/course/dist/gm-ledger.html','utf8');
const errors = [];
const vc = new VirtualConsole();
vc.on('jsdomError', e => { if(!/Could not load link|stylesheet/i.test(String(e.message))) errors.push('jsdomError: '+(e.stack||e.message)); });
vc.on('error', (...a) => errors.push('console.error: '+a.map(String).join(' ')));
const dom = new JSDOM('<!doctype html><html><head></head><body>'+html+'</body></html>', {runScripts:'dangerously', pretendToBeVisual:true, virtualConsole:vc, url:'https://example.org/'});
const w = dom.window;
w.scrollTo = ()=>{};
const BW = w.BW;
const ids = Object.keys(BW.mods);
let sections = 0, clicks = 0, figs = 0;
function poke(main){
  // sliders
  main.querySelectorAll('input[type=range]').forEach(r=>{ const min=+r.min,max=+r.max; [min,max,(min+max)/2].forEach(v=>{ r.value=String(v); r.dispatchEvent(new w.Event('input',{bubbles:true})); clicks++; }); });
  main.querySelectorAll('input[type=number],input[type=text],input[type=search]').forEach(r=>{ r.value= r.type==='number'?'5':'a'; r.dispatchEvent(new w.Event('input',{bubbles:true})); r.dispatchEvent(new w.Event('change',{bubbles:true})); });
  main.querySelectorAll('select').forEach(s=>{ for(let i=0;i<s.options.length;i++){ s.selectedIndex=i; s.dispatchEvent(new w.Event('change',{bubbles:true})); clicks++; } });
  // buttons inside widgets (not navigation)
  let btns=[...main.querySelectorAll('.widget button, .fig button, .sort button.sb, .flip, .opt')];
  btns.slice(0,400).forEach(b=>{ if(b.isConnected && !b.disabled){ try{ b.click(); clicks++; }catch(e){ errors.push('click: '+e.message); } } });
  // second round for dynamically created buttons
  btns=[...main.querySelectorAll('.widget button')];
  btns.slice(0,400).forEach(b=>{ if(b.isConnected && !b.disabled){ try{ b.click(); clicks++; }catch(e){ errors.push('click2: '+e.message); } } });
}
for(const id of [...ids,'kit','home','packs',...Object.keys(BW.packs)]){
  const m = BW.mods[id]||BW.packs[id]||null;
  const n = m? m.sections.length : (id==='kit'?5:1);
  for(let i=0;i<n;i++){
    try{ BW.go(id,i); }catch(e){ errors.push(`${id}#${i} render: `+e.stack); continue; }
    const main = w.document.getElementById('main');
    const txt = main.textContent;
    if(/undefined|NaN|\[object Object\]/.test(txt)) errors.push(`${id}#${i}: suspicious text: `+(txt.match(/.{0,60}(undefined|NaN|\[object Object\]).{0,60}/)||[''])[0]);
    if(main.querySelector('.w-body') && /could not load/.test(txt)) errors.push(`${id}#${i}: widget failed to load`);
    figs+=main.querySelectorAll('figure.fig').length; if(/could not (load|be drawn)/.test(main.textContent)) errors.push(`${id}#${i}: figure failed`); main.querySelectorAll('figure.fig:not(.story)').forEach(fg=>{ if(!fg.querySelector('svg,.stk,.bars,.bridge,.spl-bar,.ovh')) errors.push(`${id}#${i}: empty figure ${fg.querySelector('.fig-t')?.textContent}`); });
    poke(main); sections++;
    const after = main.textContent;
    if(/undefined|NaN|\[object Object\]|Infinity/.test(after)) errors.push(`${id}#${i} after poke: `+(after.match(/.{0,60}(undefined|NaN|\[object Object\]|Infinity).{0,60}/)||[''])[0]);
  }
}
console.log(`modules: ${ids.join(',')} | sections rendered: ${sections} | figures: ${figs} | interactions: ${clicks}`);
console.log(errors.length? 'ERRORS:\n'+[...new Set(errors)].slice(0,40).join('\n'):'no errors');
