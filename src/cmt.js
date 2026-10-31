/* Comments on the course content. Uses the artifact `comments` capability with custom anchors, because this is a
   single-page app: the same DOM path shows different modules, so shell anchors would drift. Each block carries a
   stable key in data-cm ("m5:profit:1:4" = module, section id, section index, block index). A thread's anchor is
   that key plus a readable location, which is also what Claude reads when revising the course. */
(function(){
if(BW._cmtInit) return; BW._cmtInit=true;
const KEY=/^((?:m\d{1,2}|cap|kit|packs|pack[A-D])):([\w-]+):(\d+):(\d+|t|h)(?=\s|$)/;
const IDK=/#cm-((?:m\d{1,2}|cap|kit|packs|pack[A-D]))-([a-z0-9_]+)-(\d+)-(\d+|t|h)(?![\w-])/i;
/* a thread anchor is a DOM path ending at a block id (#cm-m4-ratios-2-5); older threads used a page-invented name */
const parse=a=>{ a=String(a); const m=a.match(IDK)||a.match(KEY); return m?[m[0],m[1],m[2]==='x'?'_':m[2],m[3],m[4]]:null; };
const T=(s,v)=>BW.T(s,v);
/* Location labels stay in English whatever the interface language, because the course maintainer reads them. */
const CO_EN={key:'Key idea',tip:'Good to know',flag:'Red flag',report:'Back at work',case:'Case file'}, KIT_EN={warn:'Early warning signs',form:'Formula sheet',glos:'Glossary'};
function secNameEn(mid,sid,tab){
  const tabTxt=tab?tab.textContent.replace(/^\s*\d+/,'').trim():'';
  if(!BW.lang||BW.lang==='en') return tabTxt;
  const en=BW.LANG&&BW.LANG.en; if(!en) return tabTxt;
  if(mid==='kit'){ if(KIT_EN[sid]) return KIT_EN[sid]; const x=(en.kitExtra||[]).find(q=>q.id===sid); return x?x.label:tabTxt; }
  const m=(en.mods&&en.mods[mid])||(en.packs&&en.packs[mid]); const sc=m&&m.sections.find(q=>q.id===sid); return sc?sc.label:tabTxt;
}
const bytes=s=>unescape(encodeURIComponent(s)).length;
const clip=(s,n)=>{ s=s.replace(/\s+/g,' ').trim(); return s.length>n?s.slice(0,n-1).trim()+'…':s; };
function fitBytes(s,max){ if(bytes(s)<=max) return s; let t=s; while(t.length&&bytes(t+'…')>max) t=t.slice(0,-1); return t.trim()+'…'; }

/* readable description of a block */
function describe(el){
  const key=el.dataset.cm, [, mid, sid, , bi]=key.match(KEY)||[];
  const main=document.getElementById('main');
  const o=(BW.OUT_EN||BW.OUT)[mid], tab=main.querySelector('.sectab.is-active');
  const modName=o?(o.n==='C'?'Capstone':'M'+o.n+' '+o.short):(mid==='kit'?'Toolkit':BW.packs&&BW.packs[mid]?'Pack '+BW.packs[mid].code:mid);
  const secName=secNameEn(mid,sid,tab);
  let what;
  if(bi==='h') what='module intro';
  else if(bi==='t') what='section heading';
  else if(el.classList.contains('widget')) what='widget "'+clip((el.querySelector('.w-head')||el).textContent,40)+'"';
  else if(el.matches('figure')) what=(el.classList.contains('story')?'story "':'diagram "')+clip((el.querySelector('.fig-t,figcaption')||el).textContent,40)+'"';
  else if(el.classList.contains('co')) what=clip((BW.lang&&BW.lang!=='en'&&CO_EN[Object.keys(CO_EN).find(t=>el.classList.contains(t))])||(el.querySelector('.co-label')||{textContent:'callout'}).textContent,16)+' "'+clip(el.textContent.replace((el.querySelector('.co-label')||{textContent:''}).textContent,''),36)+'"';
  else if(el.querySelector('.q-q,.quiz')||el.classList.contains('quiz')) what='quiz "'+clip(el.textContent,40)+'"';
  else what='text "'+clip(el.textContent,44)+'"';
  return {label:fitBytes(`${modName} › ${secName||'intro'} › ${what}`,120), short:`${modName} › ${secName}`};
}
const anchorFor=el=>{ const d=describe(el); return {anchor:fitBytes(el.dataset.cm+' '+d.label,128), label:d.label, detail:fitBytes(`[${el.dataset.cm}] `+clip(el.innerText||el.textContent||'',600),500)}; };

let ctrl=null, local=false, modeOn=false, pickOn=false, threads=[], raf=0, pen=null, listBtn=null;

function targetOf(e){ const t=e.target.closest&&e.target.closest('[data-cm]'); return t&&document.getElementById('main').contains(t)?t:null; }
function onClick(e){
  if(!(modeOn||pickOn)||(!ctrl&&!local)) return;
  if(e.target.closest('.ask,.ask-fab,.cmt-fab,.nt-fab,.nt-ed,.top,.toc,.rv')) return;
  const t=targetOf(e); if(!t) return;
  e.preventDefault(); e.stopPropagation();
  if(local){ setPick(false); editNote(t); return; }
  const a=anchorFor(t); let anchor=a.anchor, at=t;
  try{ const d=ctrl.domAnchor(t,e); if(d&&d[0]){ anchor=d[0]; at=d[1]; } }catch(err){}
  ctrl.compose(anchor,at,{label:a.label,detail:a.detail}).then(r=>{ if(r&&r.opened) setPick(false); }).catch(()=>{});
}
function onOver(e){ if(!(modeOn||pickOn)) return; document.querySelectorAll('.cmt-hover').forEach(x=>x.classList.remove('cmt-hover')); const t=targetOf(e); if(t) t.classList.add('cmt-hover'); }
function setPick(on){ pickOn=on; document.body.classList.toggle('cmt-on',modeOn||pickOn); if(pen){ pen.setAttribute('aria-pressed',on?'true':'false'); pen.querySelector('span').textContent=on?T('Click a block…'):(local?T('Note'):T('Comment')); } if(!on&&!modeOn) document.querySelectorAll('.cmt-hover').forEach(x=>x.classList.remove('cmt-hover')); }

/* pin placement: only threads whose block is on the current page */
function place(){
  raf=0; if(!ctrl) return;
  const map={}, per={};
  threads.forEach(t=>{
    const m=parse(t.anchor); if(!m) return;
    const key=`${m[1]}:${m[2]}:${m[3]}:${m[4]}`;
    let el=document.querySelector(`#main [data-cm="${key}"]`);
    if(!el&&m[4]!=='h'&&m[4]!=='t'){ /* section id may survive a reorder: match by id + block index */
      el=[...document.querySelectorAll('#main [data-cm]')].find(x=>{ const k=x.dataset.cm.split(':'); return k[0]===m[1]&&k[1]===m[2]&&k[3]===m[4]; })||null; }
    if(!el||!el.getClientRects().length) return;
    const r=el.getBoundingClientRect(), n=per[key]=(per[key]||0)+1;
    map[t.id]={x:Math.round(r.right-12-(n-1)*24+window.scrollX), y:Math.round(r.top+12+window.scrollY)};
  });
  try{ ctrl.placed(map); }catch(e){}
}
const replace=()=>{ if(!raf) raf=requestAnimationFrame(place); };

function reveal(id){
  const t=threads.find(x=>x.id===id); if(!t) return;
  const m=parse(t.anchor); if(m) goKey(`${m[1]}:${m[2]}:${m[3]}:${m[4]}`);
}
function goKey(key){
  const m=key.split(':');
  const show=()=>{ const el=document.querySelector(`#main [data-cm="${key}"]`); if(!el) return;
    const smooth=!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches);
    el.scrollIntoView({block:'center',behavior:smooth?'smooth':'auto'}); el.classList.add('cmt-flash'); setTimeout(()=>el.classList.remove('cmt-flash'),1600); replace(); };
  if(document.querySelector(`#main [data-cm="${key}"]`)) return show();
  const mod=BW.mods[m[0]]||(BW.packs&&BW.packs[m[0]]);
  let si=mod?mod.sections.findIndex(s=>s.id===m[1]):-1; if(si<0) si=+m[2]||0;
  BW.go(m[0],si); setTimeout(show,120);
}

function start(cm){
  cm.customAnchors({
    mode(on){ modeOn=on; document.body.classList.toggle('cmt-on',modeOn||pickOn); if(!on){ threads=[]; if(!pickOn) document.querySelectorAll('.cmt-hover').forEach(x=>x.classList.remove('cmt-hover')); } },
    threads(list){ threads=Array.isArray(list)?list:[]; replace(); },
    reveal,
    composing(open){ if(!open) document.querySelectorAll('.cmt-hover').forEach(x=>x.classList.remove('cmt-hover')); }
  }).then(c=>{
    ctrl=c; BW.cmt=c;
    listen();
    new MutationObserver(replace).observe(document.getElementById('main'),{childList:true,subtree:true});
    window.addEventListener('resize',replace);
    if(window.ResizeObserver) new ResizeObserver(replace).observe(document.getElementById('main'));
    makePen(/*T*/'Comment',/*T*/'Leave a comment on any part of this page for Claude to revise');
    place();
  }).catch(()=>startLocal());
}
function listen(){
  document.addEventListener('click',onClick,true);
  document.addEventListener('mouseover',onOver,true);
  document.addEventListener('keydown',e=>{ if(e.key==='Escape'&&pickOn) setPick(false); });
}
function makePen(label,title){
  pen=document.createElement('button'); pen.type='button'; pen.className='cmt-fab'; pen.setAttribute('aria-pressed','false'); pen.title=T(title);
  pen.innerHTML='<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M13.6 3.6l2.8 2.8L7.2 15.6 3.6 16.4l.8-3.6z"/><path d="M11.8 5.4l2.8 2.8"/></svg><span>'+T(label)+'</span>';
  if(BW.onLang) BW.onLang(()=>{ pen.title=T(title); if(!pickOn) pen.querySelector('span').textContent=T(label); else pen.querySelector('span').textContent=T('Click a block…'); if(listBtn) markNotes(); });
  pen.onclick=e=>{ e.stopPropagation(); setPick(!pickOn); };
  document.body.appendChild(pen);
}

/* ---------- local notes: where shared comments aren't available (the course saved as a file, or a viewer without commenting).
   Notes stay in this browser; "Download notes" saves them as a file to send to whoever maintains the course. */
const NK='gmledger.notes';
const loadNotes=()=>{ try{ const a=JSON.parse(localStorage.getItem(NK)||'[]'); return Array.isArray(a)?a:[]; }catch(e){ return []; } };
const saveNotes=a=>{ try{ localStorage.setItem(NK,JSON.stringify(a)); }catch(e){} };
const escH=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function startLocal(){
  if(local||ctrl) return; local=true;
  listen(); makePen(/*T*/'Note',/*T*/'Leave yourself a note on any part of this page');
  listBtn=document.createElement('button'); listBtn.type='button'; listBtn.className='nt-fab'; listBtn.onclick=e=>{ e.stopPropagation(); showList(); };
  document.body.appendChild(listBtn);
  new MutationObserver(()=>markNotes()).observe(document.getElementById('main'),{childList:true});
  markNotes();
}
function markNotes(){
  const notes=loadNotes();
  if(listBtn){ listBtn.hidden=!notes.length; listBtn.innerHTML=T('My notes <b>{n}</b>',{n:notes.length}); }
  document.querySelectorAll('#main .nt-pin').forEach(x=>x.remove()); document.querySelectorAll('#main .has-note').forEach(x=>x.classList.remove('has-note'));
  const by={}; notes.forEach(n=>{ (by[n.key]=by[n.key]||[]).push(n); });
  Object.keys(by).forEach(k=>{ const el=document.querySelector(`#main [data-cm="${k}"]`); if(!el) return;
    el.classList.add('has-note'); const b=document.createElement('button'); b.type='button'; b.className='nt-pin'; b.title=T('Your notes here'); b.textContent='✎ '+by[k].length;
    b.onclick=e=>{ e.stopPropagation(); e.preventDefault(); showList(k); }; el.appendChild(b); });
}
function editNote(el,existing){
  const old=document.querySelector('.nt-ed'); if(old) old.remove();
  const a=anchorFor(el), d=document.createElement('div'); d.className='nt-ed'; d.setAttribute('role','dialog'); d.setAttribute('aria-label',T('Add a note'));
  d.innerHTML=`<p class="nt-loc">${escH(a.label)}</p><label class="sr" for="ntta">${T('Note')}</label><textarea id="ntta" rows="4" maxlength="4000" placeholder="${escH(T("What would you change, or what's unclear?"))}"></textarea><div class="nt-row"><button type="button" class="btn small nt-save">${T('Save note')}</button><button type="button" class="linkbtn nt-cancel">${T('Cancel')}</button></div>`;
  document.body.appendChild(d); const ta=d.querySelector('textarea'); if(existing) ta.value=existing.text; setTimeout(()=>ta.focus(),20);
  el.classList.add('cmt-flash');
  const done=()=>{ d.remove(); el.classList.remove('cmt-flash'); };
  d.querySelector('.nt-cancel').onclick=done;
  d.addEventListener('keydown',e=>{ if(e.key==='Escape'){ e.stopPropagation(); done(); } });
  d.querySelector('.nt-save').onclick=()=>{ const t=ta.value.trim(); if(!t){ ta.focus(); return; }
    const notes=loadNotes();
    if(existing){ const n=notes.find(x=>x.id===existing.id); if(n) n.text=t; }
    else notes.push({id:Date.now().toString(36)+Math.random().toString(36).slice(2,6),key:el.dataset.cm,label:a.label,excerpt:clip(el.innerText||el.textContent||'',200),text:t,at:new Date().toISOString()});
    saveNotes(notes); done(); markNotes(); };
}
function showList(onlyKey){
  const old=document.querySelector('.nts'); if(old) old.remove();
  const notes=loadNotes().filter(n=>!onlyKey||n.key===onlyKey);
  const p=document.createElement('aside'); p.className='ask nts'; p.setAttribute('role','dialog'); p.setAttribute('aria-label',T('My notes'));
  p.innerHTML=`<div class="ask-head"><div class="ask-ttl"><strong>${T('My notes')}</strong><span class="ask-ctx">${onlyKey?T('On this block'):T('Saved in this browser only')}</span></div>${onlyKey?`<button type="button" class="ask-new nt-all">${T('All notes')}</button>`:''}<button type="button" class="ask-x" aria-label="${escH(T('Close'))}">✕</button></div>
    <div class="ask-log nts-list">${notes.length?'':`<p class="ask-hi">${T('No notes yet. Press <strong>Note</strong>, then click any paragraph, diagram or exercise.')}</p>`}</div>
    <div class="ask-foot"><div class="nt-row"><button type="button" class="btn small nt-dl"${notes.length?'':' disabled'}>${T('Download notes')}</button><button type="button" class="btn ghost small nt-cp"${notes.length?'':' disabled'}>${T('Copy all')}</button><span class="nt-say small"></span></div>
    <p class="ask-note">${T('Send the downloaded file to whoever maintains the course, or paste it into a Claude chat, to have the content revised.')}</p></div>`;
  const list=p.querySelector('.nts-list');
  notes.slice().reverse().forEach(n=>{ const it=document.createElement('div'); it.className='nt-it';
    it.innerHTML=`<button type="button" class="linkbtn nt-go">${escH(n.label)}</button><p>${escH(n.text).replace(/\n/g,'<br>')}</p><div class="nt-row small"><span>${new Date(n.at).toLocaleDateString()}</span><button type="button" class="linkbtn nt-edit">${T('Edit')}</button><button type="button" class="linkbtn nt-del">${T('Delete')}</button></div>`;
    it.querySelector('.nt-go').onclick=()=>{ p.remove(); goKey(n.key); };
    it.querySelector('.nt-edit').onclick=()=>{ p.remove(); goKey(n.key); setTimeout(()=>{ const el=document.querySelector(`#main [data-cm="${n.key}"]`); if(el) editNote(el,n); },250); };
    it.querySelector('.nt-del').onclick=()=>{ saveNotes(loadNotes().filter(x=>x.id!==n.id)); it.remove(); markNotes(); };
    list.appendChild(it); });
  const md=()=>"# Notes on The GM's Ledger\n\n"+loadNotes().map(n=>`## ${n.label}\nBlock: ${n.key}\n\n> ${n.excerpt}\n\n${n.text}\n`).join('\n');
  const say=p.querySelector('.nt-say');
  p.querySelector('.nt-dl').onclick=()=>BW.saveFile('gms-ledger-notes.md',new Blob([md()],{type:'text/markdown'}),t=>{ say.textContent=t; });
  p.querySelector('.nt-cp').onclick=()=>{ const t=md(); (navigator.clipboard&&window.isSecureContext?navigator.clipboard.writeText(t):Promise.reject()).then(()=>{ say.textContent=T('Copied.'); },()=>{ say.textContent=T('Copying is blocked here; use Download.'); }); };
  p.querySelector('.ask-x').onclick=()=>p.remove();
  const al=p.querySelector('.nt-all'); if(al) al.onclick=()=>showList();
  p.addEventListener('keydown',e=>{ if(e.key==='Escape'){ e.stopPropagation(); p.remove(); } });
  document.body.appendChild(p); p.querySelector('.ask-x').focus();
}

if(window.claude&&typeof window.claude.use==='function'){
  Promise.resolve(window.claude.use('comments')).then(cm=>{ if(cm&&typeof cm.customAnchors==='function') start(cm); else startLocal(); }).catch(()=>startLocal());
} else startLocal();
BW.cmtDescribe=el=>anchorFor(el);  /* exposed for tests */
})();
