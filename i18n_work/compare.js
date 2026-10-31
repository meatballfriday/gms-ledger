// Usage: node i18n_work/compare.js <file> [<file>...]   (files are names in src/, e.g. m06.js)
// Loads the English course, then re-runs all content with src/i18n/zh-TW/<file> substituted for the given files,
// compares structure with English, renders every affected section in the translated bundle, and flags leftover English.
const {JSDOM,VirtualConsole}=require('/tmp/claude-0/jt/node_modules/jsdom');const fs=require('fs');const path=require('path');
const R='/home/claude/course', files=process.argv.slice(2);
if(!files.length){ console.log('give file names'); process.exit(1); }
const errs=[]; const vc=new VirtualConsole(); vc.on('jsdomError',e=>{ if(!/scrollTo|scrollIntoView|getContext|matchMedia/.test(e.message)) errs.push(e.message.slice(0,300)); }); vc.on('error',m=>errs.push(String(m).slice(0,300)));
const d=new JSDOM('<body>'+fs.readFileSync(R+'/i18n_work/base.html','utf8')+'</body>',{runScripts:'dangerously',pretendToBeVisual:true,virtualConsole:vc,url:'https://x.org/'});
const W=d.window, BW=W.BW;
const build=fs.readFileSync(R+'/build.py','utf8'); const m=build.match(/CONTENT = (.*)/)[1];
const mfiles=fs.readdirSync(R+'/src').filter(f=>/^m\d\d\.js$/.test(f)).sort();
const rest=[...m.matchAll(/'([\w.]+\.js)'/g)].map(x=>x[1]);
const order=mfiles.concat(rest);
for(const f of files){ if(!fs.existsSync(R+'/src/i18n/zh-TW/'+f)){ console.log('MISSING translation',f); process.exit(1);} }
let src='BW.beginLang("zz");\n';
order.forEach(f=>{ const p=files.includes(f)?R+'/src/i18n/zh-TW/'+f:R+'/src/'+f; src+='(function(){\n'+fs.readFileSync(p,'utf8')+'\n})();\n'; });
src+='BW.endLang("zz");';
try{ W.eval(src); }catch(e){ console.log('LOAD ERROR',e.message); process.exit(1); }
if(errs.length){ console.log('ERRORS while loading:\n'+errs.join('\n')); }
const E=BW.LANG.en, Z=BW.LANG.zz; let probs=[];
const typ=b=>typeof b==='string'?'str':(b&&b.t)||'?';
const cmpMod=(a,b,id)=>{ if(!b){ probs.push(id+': module missing'); return; }
  if(a.sections.length!==b.sections.length) probs.push(id+': section count '+a.sections.length+' vs '+b.sections.length);
  a.sections.forEach((s,i)=>{ const t=b.sections[i]; if(!t) return; if(s.id!==t.id) probs.push(`${id}.${s.id}: section id changed to ${t.id}`); if(s.kind!==t.kind) probs.push(`${id}.${s.id}: kind changed`);
    if(s.blocks.length!==t.blocks.length) probs.push(`${id}.${s.id}: block count ${s.blocks.length} vs ${t.blocks.length}`);
    s.blocks.forEach((x,j)=>{ const y=t.blocks[j]; if(!y) return; if(typ(x)!==typ(y)) probs.push(`${id}.${s.id}#${j}: block type ${typ(x)} vs ${typ(y)}`);
      if(x&&x.t==='quiz'&&y){ if(x.a!==y.a) probs.push(`${id}.${s.id}#${j}: quiz answer index changed`); if((x.opts||[]).length!==(y.opts||[]).length) probs.push(`${id}.${s.id}#${j}: option count changed`); }
      if(x&&x.t==='sort'&&y){ const ax=(x.items||[]).map(i=>i.a).join(), ay=(y.items||[]).map(i=>i.a).join(); if(ax!==ay) probs.push(`${id}.${s.id}#${j}: sort answers changed`); }
      if(x&&x.steps&&y&&(!y.steps||x.steps.length!==y.steps.length)) probs.push(`${id}.${s.id}#${j}: step count changed`); }); });
  ['glossary','warnings','formulas'].forEach(k=>{ if(((a[k]||[]).length)!==((b[k]||[]).length)) probs.push(`${id}: ${k} count ${(a[k]||[]).length} vs ${(b[k]||[]).length}`); });
  if(a.minutes!==b.minutes) probs.push(id+': minutes changed'); };
Object.keys(E.mods).forEach(id=>cmpMod(E.mods[id],Z.mods[id],id));
Object.keys(E.packs||{}).forEach(id=>cmpMod(E.packs[id],(Z.packs||{})[id],id));
// render every section in the translated bundle
BW.useLang('zz'); const resid={};
const word=/\b[A-Za-z][a-z]{3,}\b/g;
const keepRe=/BraceWorks|Medical|Arjo|Embla|Invacare|Getinge|Enovis|Hershey|CITIC|Pacific|Luckin|WeWork|Iridium|Ford|Carillion|Olympus|Wirecard|McKesson|Kanthal|Valerie|Patisserie|MoviePass|Grant|Excel|Claude|Gemini|ChatGPT|Manila|Philippines|Vietnam|Germany|Australia|Taiwan|China|Sydney/;
Object.keys(Z.mods).concat(Object.keys(Z.packs||{})).forEach(id=>{ const mod=Z.mods[id]||Z.packs[id]; mod.sections.forEach((s,i)=>{ const before=errs.length; try{ BW.go(id,i); }catch(e){ errs.push(id+'#'+i+': '+e.message); }
  const main=W.document.getElementById('main'); const txt=main.textContent; if(/undefined|NaN|\[object Object\]/.test(txt)) probs.push(`${id}.${s.id}: suspicious text "${(txt.match(/.{0,40}(undefined|NaN|\[object Object\]).{0,40}/)||[''])[0]}"`);
  if(errs.length>before) probs.push(`${id}.${s.id}: render error ${errs[errs.length-1]}`);
  const words=(main.querySelector('.sec-body')||main).textContent.match(word)||[]; const en=words.filter(w=>!keepRe.test(w)); if(en.length>25) resid[id+'.'+s.id]=en.length+': '+[...new Set(en)].slice(0,12).join(' '); }); });
console.log(probs.length?'STRUCTURE PROBLEMS:\n'+probs.join('\n'):'structure: same as English');
console.log(Object.keys(resid).length?'SECTIONS WITH MUCH ENGLISH LEFT (word count: sample) — interface labels may still be English until the UI catalog is translated:\n'+Object.entries(resid).map(([k,v])=>k+' '+v).join('\n'):'no sections with much English left');
console.log(errs.length?'ERRORS:\n'+[...new Set(errs)].slice(0,20).join('\n'):'no errors');
