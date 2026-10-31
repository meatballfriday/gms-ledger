/* ===== Visual library: charts, flow diagrams, steppers ===== */
(function(){
'use strict';
const V = BW.viz = {};
const H = BW.h;
const esc = H.esc;
const f = n => Math.round(n*10)/10;
const q = s => String(s).replace(/"/g,'&quot;');
const T = (s,v) => BW.T(s,v);

/* ---------- mounting with resize, so text stays a real size on every screen */
let ROs=[];
V.cleanup=()=>{ ROs.forEach(r=>{ try{ r.disconnect(); }catch(e){} }); ROs=[]; };
V.mount=function(el,draw,after){
  let lastW=0;
  const paint=w=>{ w=Math.max(260,Math.floor(w)); if(Math.abs(w-lastW)<8) return; lastW=w;
    try{ el.innerHTML=draw(w); }catch(e){ el.innerHTML=`<p class="w-hint">${T('This figure could not be drawn.')}</p>`; console.error(e); }
    if(after) after(el); };
  paint(el.clientWidth || Math.min(780,(window.innerWidth||820)-66));
  if(typeof ResizeObserver!=='undefined'){ const ro=new ResizeObserver(es=>{ const w=es[0].contentRect.width; if(w>0) paint(w); }); ro.observe(el); ROs.push(ro); }
};

/* ---------- svg primitives */
/* Wrap text to a width given in Latin-character units. CJK characters count as about two units and can break
   between any two characters (but never before closing punctuation), so Chinese labels wrap correctly too. */
const CJK=/[⺀-鿿豈-﫿︰-﹏＀-￯　-〿]/, NOSTART=/^[，。、；：！？）」』》〉％,.;:!?)\]]/;
const vw=s=>{ let n=0; for(const ch of s) n+=CJK.test(ch)?1.9:1; return n; };
function wrap(str,max){
  const toks=[];  /* [text, separator before it] */
  String(str).split(' ').forEach((w,wi)=>{ if(!w) return;
    let parts;
    if(CJK.test(w)){ parts=[]; let cur=''; for(const ch of w){ const glue=/[（「『《〈(\[]$/.test(cur); if(glue){ cur+=ch; continue; } if(CJK.test(ch)&&!NOSTART.test(ch)){ if(cur) parts.push(cur); cur=ch; } else if(NOSTART.test(ch)){ cur+=ch; } else { if(cur&&CJK.test(cur[cur.length-1])){ parts.push(cur); cur=ch; } else cur+=ch; } } if(cur) parts.push(cur); }
    else if(w.length>max&&w.includes('-')){ const p=w.split('-'); parts=p.map((x,i)=>i<p.length-1?x+'-':x); }
    else parts=[w];
    parts.forEach((p,i)=>toks.push([p, i===0?(wi&&toks.length?' ':''):''])); });
  const out=[]; let cur='';
  toks.forEach(([t,sep])=>{ const sp=cur.endsWith('-')?'':sep; if(!cur) cur=t; else if(vw(cur+sp+t)<=max) cur+=sp+t; else { out.push(cur); cur=t; } });
  if(cur) out.push(cur); return out;
}
V.wrap=wrap;
function txt(x,y,s,cls,anchor){ return `<text x="${f(x)}" y="${f(y)}" class="${cls||'v-t'}" text-anchor="${anchor||'middle'}">${s}</text>`; }
function lines(x,y,arr,cls,anchor,lh){ return `<text x="${f(x)}" y="${f(y)}" class="${cls}" text-anchor="${anchor||'middle'}">`+arr.map((l,i)=>`<tspan x="${f(x)}" dy="${i?lh:0}">${l}</tspan>`).join('')+'</text>'; }
function arrow(x1,y1,x2,y2,o={}){
  const a=Math.atan2(y2-y1,x2-x1), s=o.head||7, w=s*0.62;
  const bx=x2-s*Math.cos(a), by=y2-s*Math.sin(a);
  const p=[[x2,y2],[bx+w*Math.sin(a),by-w*Math.cos(a)],[bx-w*Math.sin(a),by+w*Math.cos(a)]];
  return `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(bx)}" y2="${f(by)}" class="v-edge ${o.cls||''}"${o.dash?' stroke-dasharray="5 4"':''}/><polygon points="${p.map(r=>f(r[0])+','+f(r[1])).join(' ')}" class="v-head ${o.cls||''}"/>`;
}
function head(x,y,a,cls){ const s=7,w=4.3; const bx=x-s*Math.cos(a), by=y-s*Math.sin(a); return `<polygon points="${f(x)},${f(y)} ${f(bx+w*Math.sin(a))},${f(by-w*Math.cos(a))} ${f(bx-w*Math.sin(a))},${f(by+w*Math.cos(a))}" class="v-head ${cls||''}"/>`; }
function badge(x,y,n){ return `<circle cx="${f(x)}" cy="${f(y)}" r="10" class="v-badge"/>${txt(x,y+4,n,'v-badge-t')}`; }
function svg(w,h,label,body){ return `<svg viewBox="0 0 ${f(w)} ${f(h)}" width="${f(w)}" height="${f(h)}" role="img" aria-label="${q(label||'')}" class="v-svg">${body}</svg>`; }
function nodeLines(w,t,s){ const tl=wrap(t,Math.max(6,Math.floor((w-16)/7.4))); const sl=s?wrap(s,Math.max(8,Math.floor((w-14)/6.1))):[]; return {tl,sl,h:16+tl.length*16+(sl.length?3+sl.length*14:0)+6}; }
function node(x,y,w,h,L,cls){
  const ch=L.tl.length*16+(L.sl.length?3+L.sl.length*14:0); const y1=y+(h-ch)/2+12;
  let o=`<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="9" class="v-node ${cls||''}"/>`+lines(x+w/2,y1,L.tl,'v-t','middle',16);
  if(L.sl.length) o+=lines(x+w/2,y1+(L.tl.length-1)*16+17,L.sl,'v-s','middle',14);
  return o;
}
V.p={wrap,txt,lines,arrow,head,badge,svg,nodeLines,node,f};

/* ---------- nice ticks */
function niceTicks(lo,hi,count){
  if(lo===hi){ lo-=1; hi+=1; }
  const raw=(hi-lo)/count, mag=Math.pow(10,Math.floor(Math.log10(raw))), r=raw/mag;
  const step=(r<=1?1:r<=2?2:r<=2.5?2.5:r<=5?5:10)*mag;
  const a=Math.floor(lo/step+1e-9)*step, b=Math.ceil(hi/step-1e-9)*step; const t=[];
  for(let v=a; v<=b+step*1e-6; v+=step) t.push(Math.round(v/step)*step);
  return t;
}
V.niceTicks=niceTicks;

/* ---------- FLOW: boxes joined by labelled arrows; lays itself out for the space */
V.flow=function(o){ return function(w){
  const n=o.nodes.length, gap=o.labels?56:36, minN=o.minNode||96;
  const ek=i=>(o.edgeK&&o.edgeK[i])||'';
  let out='', H_;
  const perRow=Math.min(n, Math.floor((w+gap)/(minN+gap)));
  if(perRow>=n && !o.vertical){
    const nw=Math.min(o.maxNode||190,(w-(n-1)*gap)/n), Ls=o.nodes.map(d=>nodeLines(nw,d.t,d.s)), nh=Math.max(...Ls.map(l=>l.h));
    const x0=(w-(n*nw+(n-1)*gap))/2, y0=o.labels?28:4;
    o.nodes.forEach((d,i)=>{ const x=x0+i*(nw+gap);
      out+=`<g data-k="${d.k||''}">${node(x,y0,nw,nh,Ls[i],d.cls)}</g>`;
      if(i<n-1){ const lb=o.labels&&o.labels[i]?wrap(o.labels[i],Math.max(6,Math.floor(gap/6.4))):[];
        out+=`<g data-k="${ek(i)}">${arrow(x+nw+3,y0+nh/2,x+nw+gap-3,y0+nh/2)}${lb.length?lines(x+nw+gap/2,y0+nh/2-8-(lb.length-1)*12,lb,'v-l','middle',12):''}</g>`; }
    });
    H_=y0+nh+6;
  } else if(perRow>=3 && !o.vertical){
    const cols=Math.min(perRow,4), rows=Math.ceil(n/cols), vgap=o.labels?46:34;
    const nw=Math.min(o.maxNode||190,(w-(cols-1)*gap)/cols), Ls=o.nodes.map(d=>nodeLines(nw,d.t,d.s)), nh=Math.max(...Ls.map(l=>l.h));
    const x0=(w-(cols*nw+(cols-1)*gap))/2, y0=o.labels?6:4;
    const pos=i=>{ const r=Math.floor(i/cols), c=i%cols, cc=r%2? cols-1-c : c; return {x:x0+cc*(nw+gap), y:y0+r*(nh+vgap), r}; };
    o.nodes.forEach((d,i)=>{ const P=pos(i); out+=`<g data-k="${d.k||''}">${node(P.x,P.y,nw,nh,Ls[i],d.cls)}</g>`;
      if(i<n-1){ const Q=pos(i+1); const lb=o.labels&&o.labels[i]?o.labels[i]:'';
        if(Q.r===P.r){ const dir=Q.x>P.x?1:-1; const xa=dir>0?P.x+nw+3:P.x-3, xb=dir>0?Q.x-3:Q.x+nw+3; const L=lb?wrap(lb,Math.max(6,Math.floor(gap/6.4))):[];
          out+=`<g data-k="${ek(i)}">${arrow(xa,P.y+nh/2,xb,P.y+nh/2)}${L.length?lines((xa+xb)/2,P.y+nh/2-8-(L.length-1)*12,L,'v-l','middle',12):''}</g>`; }
        else { const cx=P.x+nw/2; out+=`<g data-k="${ek(i)}">${arrow(cx,P.y+nh+3,cx,Q.y-3)}${lb?txt(cx+10,P.y+nh+vgap/2+4,lb,'v-l','start'):''}</g>`; }
      }
    });
    H_=y0+rows*nh+(rows-1)*vgap+6;
  } else {
    const nw=Math.min(o.maxNodeV||320,w-24), Ls=o.nodes.map(d=>nodeLines(nw,d.t,d.s)), vgap=o.labels?42:28, x=(w-nw)/2; let y=4;
    o.nodes.forEach((d,i)=>{ out+=`<g data-k="${d.k||''}">${node(x,y,nw,Ls[i].h,Ls[i],d.cls)}</g>`; y+=Ls[i].h;
      if(i<n-1){ const lb=o.labels&&o.labels[i]?wrap(o.labels[i],Math.max(8,Math.floor((nw/2-14)/6.3))):[];
        out+=`<g data-k="${ek(i)}">${arrow(x+nw/2,y+3,x+nw/2,y+vgap-3)}${lb.length?lines(x+nw/2+12,y+vgap/2+4-(lb.length-1)*6,lb,'v-l','start',12):''}</g>`; y+=vgap; }
    });
    H_=y+4;
  }
  return svg(w,H_,o.label,out);
};};

/* ---------- STEPPER: plays a diagram one step at a time */
V.stepper=function(fig,box,b){
  let i=-1, timer=null;
  const cap=document.createElement('div'); cap.className='st-cap';
  const ctl=document.createElement('div'); ctl.className='st-ctl';
  const mk=(t,cls)=>{ const x=document.createElement('button'); x.type='button'; x.className='btn small '+(cls||'ghost'); x.textContent=t; ctl.appendChild(x); return x; };
  const play=mk(T('Play ▶'),'');
  const back=mk(T('← Back')), next=mk(T('Next →')), all=mk(T('Show all'));
  const cnt=document.createElement('span'); cnt.className='st-n'; ctl.appendChild(cnt);
  /* optional: a picture of the document for each step (b.docs), and boxes you can click to jump to a step (b.clickStep) */
  const doc=b.docs?document.createElement('div'):null; if(doc){ doc.className='st-doc'; doc.setAttribute('aria-live','polite'); }
  const apply=()=>{
    const keys=i<0?null:b.steps[i].k;
    box.classList.toggle('st-dim',!!keys);
    box.querySelectorAll('[data-k]').forEach(nd=>{ const ks=(nd.getAttribute('data-k')||'').split(' ').filter(Boolean); nd.classList.toggle('on',!!keys&&ks.some(k=>keys.includes(k))); });
    cap.innerHTML=i<0?(b.intro||T('Press Play to go through it step by step.')):`<strong>${T('Step {n}.',{n:i+1})}</strong> ${b.steps[i].t}`;
    cnt.textContent=i<0?T('{n} steps',{n:b.steps.length}):T('{i} of {n}',{i:i+1,n:b.steps.length});
    back.disabled=i<0; next.disabled=i>=b.steps.length-1; all.disabled=i<0;
    if(b.clickStep) box.querySelectorAll('[data-k]').forEach(nd=>{ const k=(nd.getAttribute('data-k')||'').split(' ')[0]; if(k in b.clickStep){ nd.classList.add('st-click'); nd.setAttribute('tabindex','0'); nd.setAttribute('role','button'); nd.setAttribute('aria-label',T('Show step {n}',{n:b.clickStep[k]+1})); } });
    if(doc) doc.innerHTML=i<0?(b.docHint?`<p class="st-doc-hint">${b.docHint}</p>`:''):(b.docs[i]||'');
  };
  const jump=e=>{ const nd=e.target.closest&&e.target.closest('[data-k]'); if(!nd||!b.clickStep) return; const k=(nd.getAttribute('data-k')||'').split(' ')[0]; if(!(k in b.clickStep)) return; if(e.type==='keydown'&&e.key!=='Enter'&&e.key!==' ') return; e.preventDefault(); stop(); i=b.clickStep[k]; apply(); if(doc&&doc.scrollIntoView&&doc.getBoundingClientRect().top>window.innerHeight-80) doc.scrollIntoView({block:'nearest',behavior:'smooth'}); };
  if(b.clickStep){ box.addEventListener('click',jump); box.addEventListener('keydown',jump); }
  const stop=()=>{ if(timer){ clearInterval(timer); timer=null; } play.textContent=i>=b.steps.length-1?T('Replay ▶'):T('Play ▶'); };
  play.onclick=()=>{ if(timer){ stop(); return; } if(i>=b.steps.length-1) i=-1; i++; apply(); play.textContent=T('Pause ❚❚');
    timer=setInterval(()=>{ if(!box.isConnected){ stop(); return; } if(i>=b.steps.length-1){ stop(); return; } i++; apply(); }, b.ms||3600); };
  back.onclick=()=>{ stop(); i=Math.max(-1,i-1); apply(); };
  next.onclick=()=>{ stop(); i=Math.min(b.steps.length-1,i+1); apply(); };
  all.onclick=()=>{ stop(); i=-1; apply(); };
  V.mount(box,b.draw,apply);
  fig.appendChild(ctl); fig.appendChild(cap); if(doc) fig.appendChild(doc);
};

/* ---------- LINE chart with hover, direct labels, reference lines and a data table */
V.line=function(o){
  const draw=function(w){
    const S=o.series, n=o.x.length, fmt=o.fmt||H.kfmt, tf=o.tfmt||fmt;
    const endLab=o.endLabels!==false && S.length<=4;
    const maxName=Math.max(...S.map(s=>(s.short||s.name).length));
    const m={l:o.ml||52, r:endLab?Math.min(118,16+maxName*6.6):14, t:12, b:28};
    const h=o.h||(w<480?200:230), pw=w-m.l-m.r, ph=h-m.t-m.b;
    let vals=S.flatMap(s=>s.v.filter(v=>v!=null)); (o.refs||[]).forEach(r=>vals.push(r.v)); if(o.band) vals.push(o.band.lo,o.band.hi); if(o.zero) vals.push(0);
    let lo=o.yMin!=null?o.yMin:Math.min(...vals), hi=o.yMax!=null?o.yMax:Math.max(...vals);
    const ticks=niceTicks(lo,hi,o.ticks||4); lo=ticks[0]; hi=ticks[ticks.length-1];
    const X=i=>m.l+(n===1?pw/2:i*pw/(n-1)), Y=v=>m.t+(1-(v-lo)/(hi-lo))*ph;
    let g='';
    ticks.forEach(t=>{ g+=`<line x1="${m.l}" x2="${f(m.l+pw)}" y1="${f(Y(t))}" y2="${f(Y(t))}" class="${t===0&&lo<0?'v-zero':'v-grid'}"/>`+txt(m.l-6,Y(t)+4,fmt(t),'v-ax','end'); });
    if(o.band) g+=`<rect x="${m.l}" y="${f(Y(o.band.hi))}" width="${f(pw)}" height="${f(Math.max(0,Y(o.band.lo)-Y(o.band.hi)))}" class="v-band"/>`+(o.band.label?txt(m.l+pw-6,Y(o.band.lo)-5,o.band.label,'v-l','end'):'');
    (o.refs||[]).forEach(r=>{ g+=`<line x1="${m.l}" x2="${f(m.l+pw)}" y1="${f(Y(r.v))}" y2="${f(Y(r.v))}" class="v-ref ${r.cls||''}"/>`+(r.label?txt(m.l+pw-2,Y(r.v)-5,r.label,'v-l','end'):''); });
    (o.vmarks||[]).forEach(vm=>{ const x=X(vm.i); g+=`<line x1="${f(x)}" x2="${f(x)}" y1="${m.t}" y2="${f(m.t+ph)}" class="v-ref ${vm.cls||''}"/>`+(vm.label?txt(x+(vm.left?-5:5),m.t+12,vm.label,'v-l',vm.left?'end':'start'):''); });
    const every=Math.max(1,Math.ceil(n/Math.max(2,Math.floor(pw/(o.xw||46)))));
    o.x.forEach((xl,i)=>{ if(i%every===0||i===n-1&&(n-1)%every>every/2) g+=txt(X(i),h-8,xl,'v-ax','middle'); });
    S.forEach(s=>{
      let seg=[], segs=[]; s.v.forEach((v,i)=>{ if(v==null){ if(seg.length) segs.push(seg); seg=[]; } else seg.push([X(i),Y(v)]); }); if(seg.length) segs.push(seg);
      if(o.area&&S.length===1&&segs.length){ const pts=segs[0]; const base=Y(Math.max(lo,Math.min(0,hi))); g+=`<polygon points="${pts.map(p=>f(p[0])+','+f(p[1])).join(' ')} ${f(pts[pts.length-1][0])},${f(base)} ${f(pts[0][0])},${f(base)}" class="v-area v-f-${s.c||'s1'}"/>`; }
      segs.forEach(pts=>{ g+=`<polyline points="${pts.map(p=>f(p[0])+','+f(p[1])).join(' ')}" class="v-line v-c-${s.c||'s1'}"${s.dash?' stroke-dasharray="6 5"':''}/>`; });
      if(o.dots) s.v.forEach((v,i)=>{ if(v!=null) g+=`<circle cx="${f(X(i))}" cy="${f(Y(v))}" r="3.6" class="v-dot v-f-${s.c||'s1'}"/>`; });
    });
    (o.marks||[]).forEach(mk=>{ const s=S[mk.s||0], v=s.v[mk.i]; if(v==null) return; const x=X(mk.i), y=Y(v); g+=`<circle cx="${f(x)}" cy="${f(y)}" r="5" class="v-dot v-f-${s.c||'s1'}"/>`; if(mk.label) g+=txt(x+(mk.dx||0),y+(mk.dy!=null?mk.dy:-10),mk.label,'v-val',mk.anchor||'middle'); });
    if(endLab){ const lab=S.map(s=>{ let li=s.v.length-1; while(li>0&&s.v[li]==null) li--; return {s,y:Y(s.v[li]),x:X(li),v:s.v[li]}; }).sort((a,b)=>a.y-b.y);
      for(let k=1;k<lab.length;k++) if(lab[k].y-lab[k-1].y<14) lab[k].y=lab[k-1].y+14;
      lab.forEach(L=>{ g+=`<circle cx="${f(L.x)}" cy="${f(Y(L.v))}" r="4" class="v-dot v-f-${L.s.c||'s1'}"/>`+txt(L.x+8,L.y+4,L.s.short||L.s.name,'v-s','start'); }); }
    const cw=n>1?pw/(n-1):pw;
    o.x.forEach((xl,i)=>{ const tip=[xl].concat(S.map(s=>`${s.name}: ${s.v[i]==null?'–':tf(s.v[i])}`)).join('|'); g+=`<rect x="${f(Math.max(m.l,X(i)-cw/2))}" y="${m.t}" width="${f(Math.min(cw, i===0||i===n-1?cw/2:cw))}" height="${f(ph)}" class="v-hit" data-tip="${q(tip)}"/>`; });
    const cv=c=>'var(--'+(c&&c[0]==='s'?c:c==='good'?'good':c==='red'?'red':c==='muted'?'rule-strong':c==='acc'?'accent':'ink')+')';
    const legend=S.length>=2?`<div class="v-legend">${S.map(s=>`<span><i style="${s.dash?`background:none;height:0;border-top:2.5px dashed ${cv(s.c)}`:`background:${cv(s.c)}`}"></i>${s.name}</span>`).join('')}</div>`:'';
    return legend+svg(w,h,o.label,g);
  };
  if(o.table!==false){ const tf=o.tfmt||o.fmt||H.kfmt; draw.tableHTML=`<details class="v-data"><summary>${T('Show the numbers')}</summary>${BW.ui.table([o.xName||''].concat(o.series.map(s=>s.name)),o.x.map((xl,i)=>[xl].concat(o.series.map(s=>s.v[i]==null?'–':tf(s.v[i])))),{num:o.series.map((s,i)=>i+1)})}</details>`; }
  return draw;
};

/* ---------- vertical BARS, grouped */
V.vbars=function(o){
  const draw=function(w){
    const S=o.series, n=o.x.length, fmt=o.fmt||H.kfmt, tf=o.tfmt||fmt;
    const m={l:o.ml||52,r:10,t:18,b:o.xwrap?40:28}, h=o.h||(w<480?200:230), pw=w-m.l-m.r, ph=h-m.t-m.b;
    let vals=S.flatMap(s=>s.v); vals.push(0); const ticks=niceTicks(Math.min(...vals),Math.max(...vals),o.ticks||4); const lo=ticks[0], hi=ticks[ticks.length-1];
    const Y=v=>m.t+(1-(v-lo)/(hi-lo))*ph, base=Y(Math.max(lo,0)), gw=pw/n, bw=Math.min(o.maxBar||44,(gw*0.72-(S.length-1)*2)/S.length);
    let g=''; ticks.forEach(t=>{ g+=`<line x1="${m.l}" x2="${f(m.l+pw)}" y1="${f(Y(t))}" y2="${f(Y(t))}" class="${t===0?'v-zero':'v-grid'}"/>`+txt(m.l-6,Y(t)+4,fmt(t),'v-ax','end'); });
    o.x.forEach((xl,i)=>{ const gx=m.l+i*gw+gw/2, tot=S.length*bw+(S.length-1)*2;
      S.forEach((s,j)=>{ const v=s.v[i], x=gx-tot/2+j*(bw+2), y=Y(Math.max(v,0)), hh=Math.abs(Y(v)-base), r=Math.min(4,bw/2,hh);
        const top=v>=0? `M${f(x)},${f(base)} V${f(y+r)} Q${f(x)},${f(y)} ${f(x+r)},${f(y)} H${f(x+bw-r)} Q${f(x+bw)},${f(y)} ${f(x+bw)},${f(y+r)} V${f(base)} Z` : `M${f(x)},${f(base)} V${f(base+hh-r)} Q${f(x)},${f(base+hh)} ${f(x+r)},${f(base+hh)} H${f(x+bw-r)} Q${f(x+bw)},${f(base+hh)} ${f(x+bw)},${f(base+hh-r)} V${f(base)} Z`;
        g+=`<path d="${top}" class="v-f-${(s.cs&&s.cs[i])||s.c||'s1'}" data-tip="${q(xl+'|'+s.name+': '+tf(v))}"/>`;
        if(o.values) g+=txt(x+bw/2,(v>=0?y-5:base+hh+13),o.vfmt?o.vfmt(v):fmt(v),'v-val','middle'); });
      const L=o.xwrap?wrap(xl,Math.max(6,Math.floor(gw/6.6))):[xl]; g+=lines(gx,h-m.b+16,L,'v-ax','middle',12); });
    const legend=S.length>=2?`<div class="v-legend">${S.map(s=>`<span><i class="sq" style="background:var(--${s.c==='muted'?'rule-strong':s.c==='good'?'good':s.c==='red'?'red':s.c})"></i>${s.name}</span>`).join('')}</div>`:'';
    return legend+svg(w,h,o.label,g);
  };
  if(o.table!==false){ const tf=o.tfmt||o.fmt||H.kfmt; draw.tableHTML=`<details class="v-data"><summary>${T('Show the numbers')}</summary>${BW.ui.table([o.xName||''].concat(o.series.map(s=>s.name)),o.x.map((xl,i)=>[xl].concat(o.series.map(s=>tf(s.v[i])))),{num:o.series.map((s,i)=>i+1)})}</details>`; }
  return draw;
};

/* ---------- STACKED horizontal bars (HTML) */
const COL={s1:'var(--s1)',s2:'var(--s2)',s3:'var(--s3)',s4:'var(--s4)',good:'var(--good)',red:'var(--red)',muted:'var(--rule-strong)',q0:'var(--q0)',q1:'var(--q1)',q2:'var(--q2)',q3:'var(--q3)',q4:'var(--q4)',acc:'var(--accent)',amber:'var(--amber)',blue:'var(--blue)'};
const LIGHT={s3:1,s4:1,q0:1,q1:1,muted:1};
V.stack=function(o){
  const fmt=o.fmt||H.kfmt, keys=o.keys||[];
  const key=keys.length?`<div class="stk-key">${keys.map(k=>`<span><i style="background:${COL[k.c]}"></i>${k.label}${k.v!=null?` <b>${k.v}</b>`:''}</span>`).join('')}</div>`:'';
  const rows=o.rows.map(r=>{ const tot=r.parts.reduce((a,p)=>a+p.v,0), max=o.max||tot;
    return `<div class="stk-row ${r.label?'':'nolabel'}">${r.label?`<div class="stk-l">${r.label}${r.sub?`<small>${r.sub}</small>`:''}</div>`:''}<div class="stk-bar" style="width:${(tot/max*100).toFixed(2)}%">${r.parts.map(p=>{ const pc=p.v/tot*100; const show=(pc*(tot/max))>=(o.minShow||8);
      return `<span class="stk-seg ${LIGHT[p.c]?'light':''}" style="flex:${p.v} 1 0;background:${COL[p.c]}" data-tip="${q((r.tipLabel||r.label||'').replace(/<[^>]+>/g,'')+'|'+p.label+': '+fmt(p.v)+(o.pct!==false?' ('+(p.v/tot*100).toFixed(1)+'%)':''))}">${show?(p.show!=null?p.show:(o.inside==='label'?p.label:o.inside==='pct'?Math.round(pc)+'%':fmt(p.v))):''}</span>`; }).join('')}</div></div>`; }).join('');
  return `<div class="stk">${key}${rows}</div>`;
};

/* ---------- CYCLE: a loop of stages with a moving dot */
V.cycle=function(o){ return function(w){
  const n=o.nodes.length, s=Math.min(w,o.size||560), cx=w/2, bw=Math.min(150,s*0.31);
  const Ls=o.nodes.map(d=>nodeLines(bw,d.t,d.s)), bh=Math.max(...Ls.map(l=>l.h));
  const rx=Math.min(s/2-bw/2-4,190), ry=w<520?Math.max(rx*1.4,rx+50):rx, k=ry/rx, cy=ry+bh/2+8, h=2*ry+bh+16;
  const P=t=>[cx+rx*Math.cos(t), cy+ry*Math.sin(t)];
  let g=`<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry)}" class="v-ring"/>`;
  g+=`<g transform="translate(${f(cx)} ${f(cy)}) scale(1 ${f(k*100)/100}) translate(${f(-cx)} ${f(-cy)})"><g class="v-spin" style="transform-origin:${f(cx)}px ${f(cy)}px"><circle cx="${f(cx)}" cy="${f(cy-rx)}" r="7" class="v-f-acc"/></g></g>`;
  const ang=i=>-Math.PI/2+i*2*Math.PI/n;
  const inside=(t,c)=>{ const p=P(t); return Math.abs(p[0]-c[0])<bw/2+8 && Math.abs(p[1]-c[1])<bh/2+8; };
  o.nodes.forEach((d,i)=>{ const a1=ang(i), a2=ang(i+1), c1=P(a1), c2=P(a2); let s1=a1, s2=a2;
    while(s1<a2&&inside(s1,c1)) s1+=0.01; while(s2>s1&&inside(s2,c2)) s2-=0.01; if(s2-s1<0.05) return;
    const p1=P(s1), p2=P(s2), tx=-rx*Math.sin(s2), ty=ry*Math.cos(s2);
    g+=`<g data-k="${(o.edgeK&&o.edgeK[i])||''}"><path d="M${f(p1[0])},${f(p1[1])} A${f(rx)},${f(ry)} 0 0 1 ${f(p2[0])},${f(p2[1])}" class="v-edge"/>${head(p2[0],p2[1],Math.atan2(ty,tx))}</g>`; });
  o.nodes.forEach((d,i)=>{ const c=P(ang(i)); g+=`<g data-k="${d.k||''}">${node(c[0]-bw/2,c[1]-bh/2,bw,bh,Ls[i],d.cls)}</g>`; });
  if(o.center){ const nar=w<520, yb=nar?cy+18:cy-2; g+=`<text x="${f(cx)}" y="${f(yb)}" class="v-big" text-anchor="middle"${nar?' style="font-size:17px"':''}>${o.center.big}</text>`; if(o.center.sub) g+=lines(cx,yb+19,wrap(o.center.sub,nar?14:18),'v-s','middle',14); }
  return svg(w,h,o.label,g);
};};
})();
