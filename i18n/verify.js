// Usage: node i18n/verify.js <lang> [id ...]   e.g. node i18n/verify.js zh-TW m05 packs
// Builds a temporary page with every translation present, then checks that each translated module has
// exactly the same structure as English (so saved progress lines up) and renders without errors.
const {execSync}=require('child_process');
const {JSDOM,VirtualConsole}=require('/tmp/claude-0/jt/node_modules/jsdom');
const fs=require('fs');
const L=process.argv[2]; const only=process.argv.slice(3);
if(!L){ console.log('usage: node i18n/verify.js zh-TW [m05 cap packs ...]'); process.exit(1); }
const out=`/tmp/claude-0/verify_${L}_${process.pid}.html`;
execSync(`python3 /home/claude/course/build.py ${out}`,{stdio:'pipe'});
const errs=[]; const vc=new VirtualConsole(); vc.on('jsdomError',e=>{ if(!/scrollTo|scrollIntoView|Not implemented/.test(e.message)) errs.push(e.message.slice(0,300)); });
const d=new JSDOM(fs.readFileSync(out,'utf8'),{runScripts:'dangerously',pretendToBeVisual:true,virtualConsole:vc});
fs.unlinkSync(out);
const w=d.window;
setTimeout(()=>{
  const BW=w.BW, EN=BW.LANG.en, T=BW.LANG[L]; const bad=[];
  if(!T){ console.log('language not built'); process.exit(1); }
  const sig=b=>{ if(typeof b==='string') return 'str'; if(!b) return 'null'; const t=b.t||'?';
    if(t==='quiz') return `quiz:${b.opts.length}:${b.a}`;
    if(t==='sort') return `sort:${b.buckets.length}:${b.items.map(i=>i.a).join('')}`;
    if(t==='check') return `check:${b.id}:${b.items.length}`;
    if(t==='flip') return `flip:${b.cards.length}`;
    if(t==='fs') return `fs:${(b.rows||[]).length}`;
    if(t==='tbl') return `tbl:${(b.head||[]).length}x${(b.rows||[]).length}`;
    if(t==='pack') return `pack:${b.id}`;
    if(t==='callout') return `callout:${b.tone}`;
    return t; };
  const cmp=(kind,id,a,b)=>{
    if(!b){ bad.push(`${kind} ${id}: missing in ${L}`); return; }
    const as=a.sections.map(s=>s.id).join(','), bs=b.sections.map(s=>s.id).join(',');
    if(as!==bs){ bad.push(`${id}: section ids differ\n   en: ${as}\n   ${L}: ${bs}`); return; }
    a.sections.forEach((s,i)=>{ const t=b.sections[i];
      if(s.kind!==t.kind) bad.push(`${id}.${s.id}: kind ${s.kind} vs ${t.kind}`);
      const sa=s.blocks.map(sig), sb=t.blocks.map(sig);
      if(sa.join('|')!==sb.join('|')){ bad.push(`${id}.${s.id}: blocks differ\n   en: ${sa.join(' | ')}\n   ${L}: ${sb.join(' | ')}`); } });
    ['warnings','formulas','glossary','goals'].forEach(k=>{ if(a[k]&&b[k]&&a[k].length!==b[k].length) bad.push(`${id}: ${k} count ${a[k].length} vs ${b[k].length}`); });
  };
  const ids=only.length?only:[...Object.keys(EN.mods),'packs'];
  ids.forEach(id=>{ if(id==='kit'||id==='home') return; if(id==='packs'||id.startsWith('pack')){ Object.keys(EN.packs).filter(p=>id==='packs'||p===id).forEach(p=>cmp('pack',p,EN.packs[p],T.packs[p])); } else cmp('module',id,EN.mods[id],T.mods[id]); });
  // render every section in the target language and poke the controls
  BW.useLang(L); let secs=0;
  const targets=[]; ids.forEach(id=>{ if(id==='kit'||id==='home') return; if(id==='packs'||id.startsWith('pack')) Object.keys(T.packs).filter(p=>id==='packs'||p===id).forEach(p=>targets.push(p)); else targets.push(id); });
  if(ids.includes('home')){ try{ BW.go('home'); const t=w.document.getElementById('main').textContent; const latin=(t.match(/[A-Za-z][A-Za-z ,'’-]{60,}/g)||[]).filter(x=>!/BraceWorks|http/.test(x)); if(latin.length) bad.push('home: possible untranslated text: "'+latin[0].slice(0,80)+'"'); w.document.querySelectorAll('#main button').forEach(b=>{ if(/3-minute|分鐘|分钟/.test(b.textContent)) b.click(); }); secs++; }catch(e){ errs.push('home: '+e.message); } }
  if(ids.includes('kit')){ for(let i=0;i<5;i++){ try{ BW.go('kit',i); const main=w.document.getElementById('main'); main.querySelectorAll('.az button, .qb-t button').forEach(b=>b.click()); const t=main.textContent; const latin=(t.match(/[A-Za-z][A-Za-z ,'’-]{60,}/g)||[]).filter(x=>!/BraceWorks|http|xlsx/.test(x)); if(latin.length) bad.push('kit#'+i+': possible untranslated text: "'+latin[0].slice(0,80)+'"'); secs++; }catch(e){ errs.push('kit#'+i+': '+e.message); } } }
  targets.forEach(id=>{ const m=T.mods[id]||T.packs[id]; if(!m) return;
    m.sections.forEach((s,i)=>{ try{ BW.go(id,i); }catch(e){ errs.push(`${id}#${i} render: ${e.message}`); return; }
      const main=w.document.getElementById('main'); const txt=main.textContent;
      if(/undefined|NaN|\[object Object\]/.test(txt)) bad.push(`${id}.${s.id}: suspicious text: `+(txt.match(/.{0,40}(undefined|NaN|\[object Object\]).{0,40}/)||[''])[0]);
      if(/could not load|could not be drawn/.test(txt)) bad.push(`${id}.${s.id}: a widget or figure failed to load`);
      [...main.querySelectorAll('.widget button, .fig button, .sort button.sb, .flip, .opt, input[type=checkbox]')].slice(0,300).forEach(b=>{ try{ if(b.isConnected&&!b.disabled) b.click(); }catch(e){ errs.push(`${id}.${s.id} click: ${e.message}`); } });
      [...main.querySelectorAll('input[type=range]')].slice(0,40).forEach(r=>{ try{ r.value=r.max; r.dispatchEvent(new w.Event('input')); r.value=r.min; r.dispatchEvent(new w.Event('input')); }catch(e){ errs.push(`${id}.${s.id} slider: ${e.message}`); } });
      const after=main.textContent; if(/undefined|NaN|\[object Object\]/.test(after)) bad.push(`${id}.${s.id} after interaction: `+(after.match(/.{0,40}(undefined|NaN|\[object Object\]).{0,40}/)||[''])[0]);
      // English left behind (long runs of Latin words in visible text)
      const latin=(after.match(/[A-Za-z][A-Za-z ,'’-]{60,}/g)||[]).filter(x=>!/BraceWorks|Invacare|Arjo|Embla|Fior|IFRS|EBITDA|http/.test(x));
      if(latin.length) bad.push(`${id}.${s.id}: possible untranslated text: "${latin[0].slice(0,80)}"`);
      secs++; }); });
  console.log(`${L}: checked ${targets.length} item(s), ${secs} sections`);
  console.log(bad.length?'PROBLEMS:\n'+bad.slice(0,60).join('\n'):'structure OK');
  console.log(errs.length?'ERRORS:\n'+[...new Set(errs)].slice(0,30).join('\n'):'no runtime errors');
  process.exit(0);
},600);
