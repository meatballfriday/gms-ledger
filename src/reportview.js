/* Report viewer: opens a practice copy of a real report beside the lesson. */
(function(){
const R=()=>BW.reports||{};
const T=(s,v)=>BW.T(s,v);
let cur=null, lastFocus=null;
const esc=t=>String(t==null?'':t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function num(v,neg){
  if(v==null||v==='') return '';
  if(typeof v!=='number') return esc(v);
  const dec=Math.abs(v%1)>1e-9?(String(v).split('.')[1]||'').length:0;
  const s=Math.abs(v).toLocaleString('en-US',{minimumFractionDigits:dec,maximumFractionDigits:dec});
  if(v<0) return neg==='minus'?'−'+s:'('+s+')';
  return s;
}
function stHTML(b,neg){
  const n=b.periods.length;
  return `<div class="rv-block"><h4>${esc(b.title)}</h4><div class="rv-scroll"><table class="rv-st"><thead><tr><th></th>${b.periods.map(p=>`<th>${esc(p)}</th>`).join('')}</tr></thead><tbody>${b.rows.map(r=>{
    const cls=r.s==='h'?'h':r.s==='sub'?'sub':r.s==='tot'?'tot':'';
    if(r.s==='h') return `<tr class="h"><td colspan="${n+1}">${esc(r.label)}</td></tr>`;
    return `<tr class="${cls}"><td>${esc(r.label)}</td>${(r.v||[]).slice(0,n).map(v=>`<td class="n">${num(v,neg)}</td>`).join('')}</tr>`; }).join('')}</tbody></table></div>${b.note?`<p class="rv-note">${esc(b.note)}</p>`:''}</div>`;
}
function tblHTML(b,neg){
  return `<div class="rv-block"><h4>${esc(b.title)}</h4><div class="rv-scroll"><table class="rv-st rv-t"><thead><tr>${b.cols.map((c,i)=>`<th${i?'':' class="l"'}>${esc(c)}</th>`).join('')}</tr></thead><tbody>${b.rows.map(r=>{
    const empty=r.slice(1).every(x=>x==null||x==='');
    if(empty&&r.length>1) return `<tr class="h"><td colspan="${b.cols.length}">${esc(r[0])}</td></tr>`;
    const tot=/^(total|interest-bearing net debt|net assets acquired|consideration shown|at 31 december|external product sales)/i.test(String(r[0]));
    return `<tr class="${tot?'sub':''}">${b.cols.map((c,i)=>i?`<td class="n">${num(r[i],neg)}</td>`:`<td>${esc(r[0])}</td>`).join('')}</tr>`; }).join('')}</tbody></table></div>${b.note?`<p class="rv-note">${esc(b.note)}</p>`:''}</div>`;
}
function pageHTML(rep,pi){
  const p=rep.pages[pi];
  return `<div class="rv-paper"><div class="rv-run"><span>${esc(rep.company)}, ${esc(rep.title)}</span><span>${T('Page {i} of {n}',{i:pi+1,n:rep.pages.length})}</span></div><h3>${esc(p.title)}</h3>${pi?`<p class="rv-unit">${esc(rep.unit)}</p>`:''}${p.blocks.map(b=>b.t==='st'?stHTML(b,rep.neg):b.t==='tbl'?tblHTML(b,rep.neg):`<div class="rv-block prose">${b.html}</div>`).join('')}
    ${pi===0?`<div class="rv-srcs"><strong>${T('Original documents')}</strong>${rep.sources.map(s=>`<a href="${s[1]}" target="_blank" rel="noopener noreferrer">${esc(s[0])} ↗</a>`).join('')}<p class="rv-note">${T('A practice copy for this course: figures exactly as published, layout simplified, not updated after publication.')}</p></div>`:''}</div>`;
}
function close(){ if(!cur) return; cur.el.remove(); document.body.classList.remove('rv-open'); document.removeEventListener('keydown',onKey); cur=null; if(lastFocus&&lastFocus.focus) lastFocus.focus(); }
function onKey(e){ if(e.key==='Escape') close(); }
function show(pi){
  const rep=R()[cur.id]; pi=Math.max(0,Math.min(rep.pages.length-1,pi)); cur.pi=pi;
  const body=cur.el.querySelector('.rv-body'); body.innerHTML=pageHTML(rep,pi); body.scrollTop=0;
  cur.el.querySelectorAll('.rv-tabs button').forEach((b,i)=>{ b.setAttribute('aria-pressed',String(i===pi)); if(i===pi&&b.scrollIntoView) try{ b.scrollIntoView({block:'nearest',inline:'nearest'}); }catch(_){} });
  cur.el.querySelector('[data-prev]').disabled=pi===0; cur.el.querySelector('[data-next]').disabled=pi===rep.pages.length-1;
  cur.el.querySelector('[data-prev]').textContent=pi?'← '+rep.pages[pi-1].title:'←';
  cur.el.querySelector('[data-next]').textContent=pi<rep.pages.length-1?rep.pages[pi+1].title+' →':'→';
}
BW.openReport=function(id,page){
  const rep=R()[id]; if(!rep) return;
  let pi=typeof page==='number'?page:Math.max(0,rep.pages.findIndex(p=>p.id===page));
  if(cur&&cur.id===id){ show(pi); return; }
  if(cur) close();
  lastFocus=document.activeElement;
  const el=document.createElement('aside'); el.className='rv'; el.setAttribute('role','dialog'); el.setAttribute('aria-label',rep.company+' '+rep.title);
  el.innerHTML=`<div class="rv-head"><div class="rv-ttl"><span class="eyebrow">${T('Practice copy of a real report')}</span><strong>${esc(rep.company)}</strong><span class="small">${esc(rep.title)}</span></div><button type="button" class="rv-x" aria-label="${esc(T('Close the report'))}">✕</button></div>
    <div class="rv-tabs" role="group" aria-label="${esc(T('Pages'))}">${rep.pages.map((p,i)=>`<button type="button" data-p="${i}">${i+1}. ${esc(p.title)}</button>`).join('')}</div>
    <div class="rv-body" tabindex="0"></div>
    <div class="rv-foot"><button type="button" class="btn ghost small" data-prev></button><button type="button" class="btn ghost small" data-next></button></div>`;
  document.body.appendChild(el); document.body.classList.add('rv-open');
  cur={id,el,pi:0};
  el.querySelector('.rv-x').onclick=close;
  el.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>show(+b.dataset.p));
  el.querySelector('[data-prev]').onclick=()=>show(cur.pi-1); el.querySelector('[data-next]').onclick=()=>show(cur.pi+1);
  document.addEventListener('keydown',onKey);
  show(pi); el.querySelector('.rv-x').focus();
};
BW.closeReport=close;
/* a button that opens a report page */
BW.reportBtn=function(id,page,label,cls){ return `<button type="button" class="${cls||'btn small'} rv-open-btn" data-rv="${id}" data-rvp="${page||''}">${label}</button>`; };
document.addEventListener('click',e=>{ const b=e.target.closest&&e.target.closest('[data-rv]'); if(!b) return; e.preventDefault(); BW.openReport(b.dataset.rv,b.dataset.rvp||0); });
})();
