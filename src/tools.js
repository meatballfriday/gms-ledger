/* Live tools: in-page versions of four Excel templates, with "Download with my numbers".
   Each tool keeps its inputs in the learner's saved progress (S.tools) and can write them
   into the matching .xlsx template, which recalculates when it is opened. */
(function(){
'use strict';
const H=BW.h, UI=BW.ui, S=BW.state, save=BW.save;
const {money,pct,kfmt,esc}=H;
const m$=v=>money(Math.round(v)), m2=v=>money(v,2);
const E=(tag,cls,html)=>{ const e=document.createElement(tag); if(cls) e.className=cls; if(html!=null) e.innerHTML=html; return e; };
const clone=o=>JSON.parse(JSON.stringify(o));
const sum=a=>a.reduce((t,x)=>t+(+x||0),0);

/* ===================================================================== inputs */
function parse(s){ let x=String(s==null?'':s).trim().toLowerCase().replace(/[$,\s%]|usd/g,''); if(!x) return 0; let neg=false; if(/^\(.*\)$/.test(x)){ neg=true; x=x.slice(1,-1); } x=x.replace(/^[−–]/,'-'); let k=1; if(x.endsWith('k')){ k=1000; x=x.slice(0,-1); } else if(x.endsWith('m')){ k=1e6; x=x.slice(0,-1); } const v=parseFloat(x); return isNaN(v)?null:(neg?-1:1)*v*k; }
function show(kind,v){ if(kind==='text') return v==null?'':String(v); if(v==null||v==='') return ''; if(kind==='pct') return String(+(v*100).toFixed(2)); if(kind==='usd2') return (+v).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}); return (+v).toLocaleString('en-US',{maximumFractionDigits:2}); }
/* a single input bound to obj[key]; kind: usd | usd2 | num | pct | text */
function inputEl(obj,key,kind,onChange,o={}){
  const inp=E('input','tin'+(kind==='text'?' txt':'')); inp.type='text'; if(kind!=='text') inp.inputMode='decimal'; inp.autocomplete='off';
  if(o.id) inp.id=o.id; if(o.label) inp.setAttribute('aria-label',o.label);
  inp.value=show(kind,obj[key]);
  inp.addEventListener('input',()=>{ if(kind==='text'){ obj[key]=inp.value; inp.classList.remove('bad'); onChange(); return; } const v=parse(inp.value); if(v==null){ inp.classList.add('bad'); return; } inp.classList.remove('bad'); obj[key]=kind==='pct'?v/100:v; onChange(); });
  inp.addEventListener('blur',()=>{ if(!inp.classList.contains('bad')) inp.value=show(kind,obj[key]); });
  inp.addEventListener('focus',()=>{ try{ inp.select(); }catch(e){} });
  return inp;
}
/* a labelled field row */
function field(host,obj,key,label,kind,onChange,o={}){
  const id='t-'+Math.random().toString(36).slice(2,9);
  const r=E('div','tf-r'+(o.wide||kind==='text'?' wide':'')); const l=E('label',null,label+(o.hint?`<small>${o.hint}</small>`:'')); l.htmlFor=id; r.appendChild(l);
  const w=E('span','tf-in'+(kind==='pct'?' is-pct':kind.startsWith('usd')?' is-usd':''));
  w.appendChild(inputEl(obj,key,kind,onChange,{id})); r.appendChild(w); host.appendChild(r); return r;
}
function debounce(fn,ms){ let t=null; return ()=>{ clearTimeout(t); t=setTimeout(fn,ms); }; }

/* ===================================================================== zip + xlsx */
const CRC=(()=>{ const t=new Uint32Array(256); for(let n=0;n<256;n++){ let c=n; for(let k=0;k<8;k++) c=c&1?0xEDB88320^(c>>>1):c>>>1; t[n]=c>>>0; } return t; })();
function crc32(u){ let c=0xFFFFFFFF; for(let i=0;i<u.length;i++) c=CRC[(c^u[i])&0xFF]^(c>>>8); return (c^0xFFFFFFFF)>>>0; }
function b64u8(b64){ const bin=atob(b64); const u=new Uint8Array(bin.length); for(let i=0;i<bin.length;i++) u[i]=bin.charCodeAt(i); return u; }
async function pipe(u,stream){ const s=new Blob([u]).stream().pipeThrough(stream); return new Uint8Array(await new Response(s).arrayBuffer()); }
const canPatch=()=>typeof DecompressionStream!=='undefined'&&typeof CompressionStream!=='undefined';
function readZip(u){
  const dv=new DataView(u.buffer,u.byteOffset,u.byteLength); let e=u.length-22; while(e>=0&&dv.getUint32(e,true)!==0x06054b50) e--; if(e<0) throw new Error('not a zip');
  const n=dv.getUint16(e+10,true); let p=dv.getUint32(e+16,true); const out=[]; const td=new TextDecoder();
  for(let i=0;i<n;i++){ if(dv.getUint32(p,true)!==0x02014b50) throw new Error('bad zip directory');
    const method=dv.getUint16(p+10,true), time=dv.getUint16(p+12,true), date=dv.getUint16(p+14,true), crc=dv.getUint32(p+16,true), csize=dv.getUint32(p+20,true), usize=dv.getUint32(p+24,true);
    const nl=dv.getUint16(p+28,true), xl=dv.getUint16(p+30,true), cl=dv.getUint16(p+32,true), off=dv.getUint32(p+42,true);
    const name=td.decode(u.subarray(p+46,p+46+nl)); const lnl=dv.getUint16(off+26,true), lxl=dv.getUint16(off+28,true); const start=off+30+lnl+lxl;
    out.push({name,method,time,date,crc,csize,usize,data:u.subarray(start,start+csize)}); p+=46+nl+xl+cl; }
  return out;
}
function writeZip(entries){
  const te=new TextEncoder(); const parts=[]; const cen=[]; let off=0;
  entries.forEach(en=>{ const nm=te.encode(en.name); const lh=new DataView(new ArrayBuffer(30));
    lh.setUint32(0,0x04034b50,true); lh.setUint16(4,20,true); lh.setUint16(6,0x0800,true); lh.setUint16(8,en.method,true); lh.setUint16(10,en.time,true); lh.setUint16(12,en.date,true);
    lh.setUint32(14,en.crc,true); lh.setUint32(18,en.data.length,true); lh.setUint32(22,en.usize,true); lh.setUint16(26,nm.length,true); lh.setUint16(28,0,true);
    parts.push(new Uint8Array(lh.buffer),nm,en.data);
    const ch=new DataView(new ArrayBuffer(46)); ch.setUint32(0,0x02014b50,true); ch.setUint16(4,20,true); ch.setUint16(6,20,true); ch.setUint16(8,0x0800,true); ch.setUint16(10,en.method,true); ch.setUint16(12,en.time,true); ch.setUint16(14,en.date,true);
    ch.setUint32(16,en.crc,true); ch.setUint32(20,en.data.length,true); ch.setUint32(24,en.usize,true); ch.setUint16(28,nm.length,true); ch.setUint32(42,off,true);
    cen.push(new Uint8Array(ch.buffer),nm); off+=30+nm.length+en.data.length; });
  const csz=cen.reduce((t,x)=>t+x.length,0); const eo=new DataView(new ArrayBuffer(22)); eo.setUint32(0,0x06054b50,true); eo.setUint16(8,entries.length,true); eo.setUint16(10,entries.length,true); eo.setUint32(12,csz,true); eo.setUint32(16,off,true);
  return new Blob(parts.concat(cen,[new Uint8Array(eo.buffer)]),{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
}
const xe=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const colN=c=>c.split('').reduce((t,ch)=>t*26+ch.charCodeAt(0)-64,0);
function setCell(xml,ref,val){
  const style=a=>{ const m=/\ss="(\d+)"/.exec(a||''); return m?` s="${m[1]}"`:''; };
  const cell=s=>typeof val==='number'?`<c r="${ref}"${s} t="n"><v>${isFinite(val)?val:0}</v></c>`:(val===''?`<c r="${ref}"${s}/>`:`<c r="${ref}"${s} t="inlineStr"><is><t xml:space="preserve">${xe(val)}</t></is></c>`);
  const re=new RegExp(`<c r="${ref}"((?:\\s[^>]*?)?)(?:/>|>[\\s\\S]*?</c>)`);
  if(re.test(xml)) return xml.replace(re,(m,a)=>cell(style(a)));
  const row=+ref.replace(/[A-Z]+/,''), col=colN(ref.replace(/\d+/,''));
  const rre=new RegExp(`(<row r="${row}"[^>]*?)(/>|>([\\s\\S]*?)</row>)`);
  return xml.replace(rre,(m,open,tail,inner)=>{ const cells=[]; (inner||'').replace(/<c r="([A-Z]+)\d+"[^>]*?(?:\/>|>[\s\S]*?<\/c>)/g,(c,cl)=>{ cells.push([colN(cl),c]); return c; });
    cells.push([col,cell('')]); cells.sort((x,y)=>x[0]-y[0]); return `${open.replace(/\/$/,'')}>${cells.map(c=>c[1]).join('')}</row>`; }).replace(re,(m,a)=>cell(style(a)));
}
function dropCached(xml){ return xml.replace(/<c ([^>]*)>(<f[^>]*\/>|<f[^>]*>[\s\S]*?<\/f>)(?:<v>[\s\S]*?<\/v>|<v\/>)?<\/c>/g,(m,a,f)=>`<c ${a.replace(/\st="[a-zA-Z]+"/,'')}>${f}</c>`); }
async function fillXlsx(file,edits){
  const u=b64u8((BW.tmplData||{})[file]); const ents=readZip(u); const td=new TextDecoder(), te=new TextEncoder();
  const text=async en=>td.decode(en.method===0?en.data:await pipe(en.data,new DecompressionStream('deflate-raw')));
  const byName=n=>ents.find(x=>x.name===n);
  const wb=await text(byName('xl/workbook.xml')), rels=await text(byName('xl/_rels/workbook.xml.rels'));
  const path={}; wb.replace(/<sheet [^>]*name="([^"]+)"[^>]*r:id="([^"]+)"/g,(m,nm,id)=>{ const t=new RegExp(`Id="${id}"[^>]*Target="([^"]+)"`).exec(rels)||new RegExp(`Target="([^"]+)"[^>]*Id="${id}"`).exec(rels); if(t) path[nm.replace(/&amp;/g,'&')]='xl/'+t[1].replace(/^\/?xl\//,''); return m; });
  const changed={};
  for(const en of ents){ if(!/^xl\/worksheets\/sheet\d+\.xml$/.test(en.name)) continue; let x=await text(en); x=dropCached(x);
    Object.keys(edits).forEach(sh=>{ if(path[sh]===en.name) Object.keys(edits[sh]).forEach(ref=>{ x=setCell(x,ref,edits[sh][ref]); }); });
    changed[en.name]=x; }
  changed['xl/workbook.xml']=/<calcPr/.test(wb)?wb.replace(/<calcPr([^>]*?)\s*\/>/,(m,a)=>`<calcPr${a.replace(/\sfullCalcOnLoad="[^"]*"/,'')} fullCalcOnLoad="1"/>`):wb.replace('</workbook>','<calcPr fullCalcOnLoad="1"/></workbook>');
  const out=[];
  for(const en of ents){ if(changed[en.name]==null){ out.push(en); continue; } const raw=te.encode(changed[en.name]); const comp=await pipe(raw,new CompressionStream('deflate-raw')); out.push({name:en.name,method:8,time:en.time,date:en.date,crc:crc32(raw),usize:raw.length,data:comp}); }
  return writeZip(out);
}
BW.fillXlsx=fillXlsx; BW.setCell=setCell;

/* ===================================================================== tool 1: 13-week cash forecast */
const C13={
  key:'cash13', file:'13-week-cash-forecast.xlsx', title:'13-week cash forecast', short:'13-week cash', m:'m10', s:'cash13',
  blurb:'Week-by-week receipts and payments, closing cash and headroom, with the lowest point and a late-payer test.',
  rec:['US distributor A','Australian hospital supplier','German distributor','Swedish distributor','Other customers','Other receipts (VAT refunds, asset sales)'],
  pay:['Payroll','Materials suppliers','Rent and utilities','Freight and export costs','Loan repayments and interest','Tax payments','Equipment (capex)','Other payments'],
  defaults(){ return {date:'2026-04-03',open:-59400,limit:150000,minH:30000,
    rec:[[0,0,25000,0,0,0,25000,0,0,0,25000,0,0],[6000,0,6000,6000,0,6000,6000,0,6000,6000,0,6000,6000],[8000,0,5000,0,5000,0,5000,0,5000,0,5000,0,5000],[0,6000,0,6000,0,6000,0,6000,0,6000,0,6000,0],[12000,12000,8000,9000,12000,8000,4000,10000,7000,7000,12000,4000,7000],[0,0,0,0,0,0,0,0,0,0,0,0,0]],
    pay:[[0,12000,0,12000,0,12000,0,12000,0,12000,0,12000,0],[15000,15000,15000,15000,15000,15000,15000,15000,15000,15000,15000,15000,15000],[9000,0,0,0,9000,0,0,0,9000,0,0,0,9000],[1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000],[0,0,0,6000,0,0,0,6000,0,0,0,6000,0],[0,0,0,0,0,6000,0,0,0,5000,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0],[500,500,500,500,500,500,500,500,500,500,500,500,500]],
    late:-1, lateW:0}; },
  clear(st){ st.open=0; st.rec=st.rec.map(r=>r.map(()=>0)); st.pay=st.pay.map(r=>r.map(()=>0)); },
  calc(st,shift){ const rec=st.rec.map((r,i)=>shift&&i===shift.row?r.map((v,w)=>w-shift.by>=0?r[w-shift.by]:0):r);
    const tr=[...Array(13)].map((_,w)=>sum(rec.map(r=>r[w]))), tp=[...Array(13)].map((_,w)=>sum(st.pay.map(r=>r[w])));
    let open=+st.open||0; const net=[],close=[],head=[],status=[];
    for(let w=0;w<13;w++){ net[w]=tr[w]-tp[w]; close[w]=open+net[w]; open=close[w]; head[w]=close[w]+(+st.limit||0); status[w]=head[w]<0?'out':head[w]<(+st.minH||0)?'low':'ok'; }
    const low=Math.min(...head), lw=head.indexOf(low); return {tr,tp,net,close,head,status,low,lw}; },
  edits(st){ const L=c=>String.fromCharCode(65+c); const e={'B3':String(st.date||''),'B5':+st.open||0,'B27':+st.limit||0,'B29':+st.minH||0};
    st.rec.forEach((r,i)=>r.forEach((v,w)=>{ e[L(1+w)+(7+i)]=+v||0; })); st.pay.forEach((r,i)=>r.forEach((v,w)=>{ e[L(1+w)+(15+i)]=+v||0; })); return {Forecast:e}; },
  render(box,st,changed){
    const wk=w=>{ const d=new Date((st.date||'')+'T00:00:00'); if(isNaN(d)) return 'Week '+(w+1); d.setDate(d.getDate()+7*w); return d.toLocaleDateString('en-GB',{day:'numeric',month:'short'}); };
    const top=E('div','tf'); box.appendChild(top);
    field(top,st,'date','First week ends','text',()=>{ heads(); changed(); },{hint:'a date, e.g. 2026-04-03'});
    field(top,st,'open','Opening net cash','usd',changed,{hint:'cash minus overdraft used'});
    field(top,st,'limit','Overdraft or credit line limit','usd',changed);
    field(top,st,'minH','Minimum headroom you want to keep','usd',changed);
    const wrap=E('div','tg-wrap'); box.appendChild(wrap);
    const t=E('table','tg'); wrap.appendChild(t);
    const head=`<thead><tr><th>US dollars</th>${[...Array(13)].map((_,w)=>`<th class="v"><span class="tg-w">Wk ${w+1}</span><span class="tg-d" data-w="${w}"></span></th>`).join('')}<th class="v">Total</th></tr></thead>`;
    t.innerHTML=head+'<tbody></tbody>'; const tb=t.querySelector('tbody');
    const sec=(txt)=>{ const r=E('tr','tg-h',`<td colspan="15">${txt}</td>`); tb.appendChild(r); };
    const rowIn=(arr,i,name,kind)=>{ const r=E('tr'); const th=E('td','tg-l'); th.innerHTML=`<span>${name}</span>`; const fill=E('button','tg-fill','→'); fill.type='button'; fill.title='Copy week 1 to every week'; fill.setAttribute('aria-label',`Copy week 1 of ${name} to every week`); th.appendChild(fill); r.appendChild(th);
      const ins=[]; for(let w=0;w<13;w++){ const td=E('td'); const inp=inputEl(arr[i],w,'usd',changed,{label:`${name}, week ${w+1}`}); ins.push(inp); td.appendChild(inp); r.appendChild(td); }
      fill.onclick=()=>{ const v=arr[i][0]; for(let w=1;w<13;w++){ arr[i][w]=v; ins[w].value=show('usd',v); } changed(); };
      const tot=E('td','v tg-t'); r.appendChild(tot); r._tot=tot; tb.appendChild(r); return r; };
    const rowOut=(name,cls)=>{ const r=E('tr','tg-o '+(cls||'')); r.innerHTML=`<td class="tg-l"><span>${name}</span></td>`+[...Array(14)].map(()=>'<td class="v"></td>').join(''); tb.appendChild(r); return r; };
    sec('Receipts'); const rr=C13.rec.map((n,i)=>rowIn(st.rec,i,n)); const trR=rowOut('Total receipts','sub');
    sec('Payments'); const pr=C13.pay.map((n,i)=>rowIn(st.pay,i,n)); const tpR=rowOut('Total payments','sub');
    const nR=rowOut('Net cash flow'), cR=rowOut('Closing net cash','sub'), hR=rowOut('Headroom (closing cash + limit)','sub'), sR=rowOut('Status');
    function heads(){ t.querySelectorAll('.tg-d').forEach(s=>{ s.textContent=wk(+s.dataset.w); }); }
    heads();
    const out=E('div'); box.appendChild(out);
    out.innerHTML=`<h4 style="margin:18px 0 6px">Headroom by week</h4><div class="hc"></div><div class="stats" style="margin-top:10px"></div>
      <div class="tool-what"><h4 style="margin:16px 0 6px">What if a customer pays late?</h4><div class="tw-c"></div><p class="w-hint tw-o" style="margin-top:8px"></p></div>`;
    const hc=out.querySelector('.hc'), stats=out.querySelector('.stats');
    const sel=E('div','seg'); out.querySelector('.tw-c').appendChild(sel);
    const lateOpts=[{v:-1,label:'Nobody'}].concat(C13.rec.slice(0,5).map((n,i)=>({v:i,label:n})));
    UI.seg(sel,lateOpts,st.late>=0&&st.lateW?st.late:-1,v=>{ st.late=v; if(v>=0&&!st.lateW) st.lateW=2; if(v<0) st.lateW=0; save(); draw(); });
    const slh=E('div'); out.querySelector('.tw-c').appendChild(slh);
    let slReady=false; UI.sliders(slh,[{k:'w',label:'Pays late by',min:1,max:4,step:1,v:st.lateW||2,f:x=>x+(x===1?' week':' weeks')}],v=>{ if(slReady&&st.late>=0){ st.lateW=v.w; save(); draw(); } },s=>'t13-'+s); slReady=true;
    function bars(c){ const max=Math.max(1,...c.head.map(Math.abs),+st.minH||0), neg=Math.min(0,...c.head); const span=max-neg, z=(-neg)/span*100;
      hc.innerHTML=`<div class="hc-min" style="bottom:${(z+(+st.minH||0)/span*100).toFixed(2)}%"><span>minimum ${kfmt(+st.minH||0)}</span></div>`+c.head.map((h,w)=>{ const ht=Math.abs(h)/span*100; return `<div class="hc-c" data-tip="Week ${w+1} (${wk(w)})|Headroom ${m$(h)}"><i class="hc-b ${c.status[w]}" style="bottom:${(h>=0?z:z-ht).toFixed(2)}%;height:${ht.toFixed(2)}%"></i><span>${w+1}</span></div>`; }).join('')+`<div class="hc-z" style="bottom:${z.toFixed(2)}%"></div>`; }
    function draw(){
      const c=C13.calc(st);
      rr.forEach((r,i)=>{ r._tot.textContent=m$(sum(st.rec[i])); }); pr.forEach((r,i)=>{ r._tot.textContent=m$(sum(st.pay[i])); });
      const fill=(r,arr,tot,fmt)=>{ const td=r.querySelectorAll('td.v'); arr.forEach((v,w)=>{ td[w].textContent=fmt?fmt(v,w):m$(v); }); td[13].textContent=tot==null?'':m$(tot); };
      fill(trR,c.tr,sum(c.tr)); fill(tpR,c.tp,sum(c.tp)); fill(nR,c.net,sum(c.net)); fill(cR,c.close,null); fill(hR,c.head,null);
      fill(sR,c.status,null,(s)=>`<span class="tg-st ${s}">${s==='out'?'Out of cash':s==='low'?'Below target':'OK'}</span>`); sR.querySelectorAll('td.v').forEach((td,w)=>{ if(w<13) td.innerHTML=td.textContent; });
      hR.querySelectorAll('td.v').forEach((td,w)=>{ td.classList.toggle('neg',w<13&&c.status[w]!=='ok'); });
      bars(c);
      stats.innerHTML=UI.stat('Lowest headroom',m$(c.low),c.low<0?'bad':c.low<(+st.minH||0)?'warn':'good',`week ${c.lw+1}, ${wk(c.lw)}`)+UI.stat('Net cash at week 13',m$(c.close[12]))+UI.stat('Receipts vs payments',m$(sum(c.tr)-sum(c.tp)),'','over 13 weeks');
      const o=out.querySelector('.tw-o');
      if(st.late>=0&&st.lateW){ const d=C13.calc(st,{row:st.late,by:st.lateW}); const lost=sum(st.rec[st.late].slice(13-st.lateW));
        o.innerHTML=`If <strong>${esc(C13.rec[st.late])}</strong> pays ${st.lateW} week${st.lateW>1?'s':''} late, the lowest headroom becomes <strong>${m$(d.low)}</strong> in week ${d.lw+1}${d.low<c.low?`, ${m$(c.low-d.low)} worse`:''}.${lost?` ${m$(lost)} moves beyond week 13.`:''} ${d.low<0?'<strong>You would run out of cash.</strong> Line up funding or delay payments now.':d.low<(+st.minH||0)?'Below your minimum: decide now what you would chase, delay or borrow.':'Still above your minimum.'}`; }
      else o.innerHTML='Pick a customer to see what a late payment does to your lowest point.';
      return c;
    }
    return draw;
  }
};

/* ===================================================================== tool 2: export quote */
const INCO=['EXW','FCA','FOB','CIF','DAP','DDP'];
const QT={
  key:'quote', file:'export-quote-calculator.xlsx', title:'Export quote calculator', short:'Export quote', m:'m12', s:'price',
  blurb:'Price an order for any Incoterm, payment term and commission, and see the floor, break-even and target-margin prices side by side.',
  defaults(){ return {product:'Pressure-relief mattress',full:125.40,vc:95,inco:'CIF',duty:0.03,comm:0.02,buf:0,days:60,rate:0.08,target:0.25,list:180,qty:220,fr:{EXW:0,FCA:2,FOB:3,CIF:14,DAP:19,DDP:22}}; },
  clear(st){ st.product=''; st.full=0; st.vc=0; st.list=0; st.qty=0; INCO.forEach(k=>st.fr[k]=0); },
  calc(st,inco){ inco=inco||st.inco; const fr=+st.fr[inco]||0, wait=(+st.rate||0)*(+st.days||0)/365, duty=inco==='DDP'?(+st.duty||0):0, pc=(+st.comm||0)+(+st.buf||0)+wait+duty;
    const q=1-st.target-pc>0?(st.full+fr)/(1-st.target-pc):null, zero=1-pc>0?(st.full+fr)/(1-pc):null, floor=1-pc>0?(st.vc+fr)/(1-pc):null;
    const ml=st.list?(st.list-st.full-fr-st.list*pc)/st.list:null;
    return {fr,wait,duty,pc,q,zero,floor,ml,val:q!=null?q*st.qty:null,contrib:q!=null?(q-st.vc-fr-q*pc)*st.qty:null}; },
  edits(st){ const e={B4:String(st.product||''),B5:+st.full||0,B6:+st.vc||0,B7:st.inco,B8:+st.duty||0,B9:+st.comm||0,B10:+st.buf||0,B11:+st.days||0,B12:+st.rate||0,B13:+st.target||0,B14:+st.list||0,B15:+st.qty||0};
    INCO.forEach((k,i)=>{ e['E'+(5+i)]=+st.fr[k]||0; }); return {Quote:e}; },
  render(box,st,changed){
    const g=E('div','tool-2'); box.appendChild(g); const L=E('div'), R=E('div'); g.append(L,R);
    L.appendChild(E('h4',null,'The product')); const f1=E('div','tf one'); L.appendChild(f1);
    field(f1,st,'product','Product','text',changed);
    field(f1,st,'full','Full unit cost','usd2',changed,{hint:'materials, labour, overhead (Module 6)'});
    field(f1,st,'vc','Variable cost per unit','usd2',changed,{hint:'costs that rise with volume'});
    field(f1,st,'list','Your list price','usd2',changed); field(f1,st,'qty','Quantity on this order','num',changed);
    L.appendChild(E('h4',null,'Delivery terms'));
    const sg=E('div'); L.appendChild(sg); UI.seg(sg,INCO.map(k=>({v:k,label:k})),st.inco,v=>{ st.inco=v; changed(); });
    const ft=E('div','tf fr6'); L.appendChild(ft); L.appendChild(E('p','w-hint','Freight, insurance and handling per unit for each Incoterm, from your forwarder.'));
    INCO.forEach(k=>field(ft,st.fr,k,k,'usd2',changed));
    L.appendChild(E('h4',null,'Terms and costs')); const f2=E('div','tf one'); L.appendChild(f2);
    field(f2,st,'comm','Sales commission or agent fee','pct',changed); field(f2,st,'buf','Currency buffer','pct',changed,{hint:'if quoting in another currency'});
    field(f2,st,'duty','Import duty you pay (DDP only)','pct',changed); field(f2,st,'days','Customer payment terms','num',changed,{hint:'days'});
    field(f2,st,'rate','Your cost of borrowing','pct',changed,{hint:'a year'}); field(f2,st,'target','Target margin after all costs','pct',changed);
    R.innerHTML=`<div class="qt-big"><span class="k">Quote price per unit</span><b></b><span class="s"></span></div><div class="ladder"></div><div class="ld-k"></div><div class="qt-res"></div><h4 style="margin:16px 0 6px">The same order on every Incoterm</h4><div class="qt-cmp"></div><div class="qt-msg"></div>`;
    function draw(){
      const c=QT.calc(st); const big=R.querySelector('.qt-big');
      big.querySelector('b').textContent=c.q!=null?m2(c.q):'Check inputs'; big.querySelector('.s').textContent=c.q!=null?`${st.inco}, ${st.days} days, ${pct(st.target,0)} margin · order ${m$(c.val)}`:'Target margin plus percentage costs reach 100%.';
      const pts=[c.floor,c.zero,c.q,st.list].filter(x=>x!=null&&isFinite(x)); const max=Math.max(1,...pts)*1.12; const P=v=>Math.max(0,Math.min(100,v/max*100)).toFixed(2)+'%';
      R.querySelector('.ladder').innerHTML=c.floor==null?'':`<div class="ld-bar"><span class="ld-z red" style="left:0;width:${P(c.floor)}"></span><span class="ld-z amb" style="left:${P(c.floor)};width:calc(${P(c.zero)} - ${P(c.floor)})"></span><span class="ld-z grn" style="left:${P(c.zero)};right:0"></span></div>
        <div class="ld-m up" style="left:${P(c.q||0)}">quote <b>${m2(c.q||0)}</b></div><div class="ld-m dn" style="left:${P(st.list)}">list ${m2(st.list)}</div>`;
      R.querySelector('.ld-k').innerHTML=c.floor==null?'':`<span><i class="red"></i>below ${m2(c.floor)}: never</span><span><i class="amb"></i>${m2(c.floor)}–${m2(c.zero)}: only with spare capacity</span><span><i class="grn"></i>above ${m2(c.zero)}: covers full cost</span>`;
      R.querySelector('.qt-res').innerHTML=`<table class="jtbl"><tbody>
        <tr><td>Freight and handling (${st.inco})</td><td class="v">${m2(c.fr)}</td></tr>
        <tr><td>Cost of waiting ${st.days} days to be paid</td><td class="v">${pct(c.wait,1)} of price</td></tr>
        <tr><td>Commission, currency buffer${st.inco==='DDP'?' and duty':''}</td><td class="v">${pct(c.pc-c.wait,1)} of price</td></tr>
        <tr class="hi"><td><strong>Quote price at ${pct(st.target,0)} margin</strong></td><td class="v"><strong>${c.q!=null?m2(c.q):'–'}</strong></td></tr>
        <tr><td>Zero-margin price (covers full cost)</td><td class="v">${c.zero!=null?m2(c.zero):'–'}</td></tr>
        <tr><td>Floor price (covers variable cost only)</td><td class="v">${c.floor!=null?m2(c.floor):'–'}</td></tr>
        <tr><td>Margin if you quote your list price</td><td class="v">${c.ml!=null?pct(c.ml,1):'–'}</td></tr>
        <tr><td>Order contribution at the quote price</td><td class="v">${c.contrib!=null?m$(c.contrib):'–'}</td></tr></tbody></table>`;
      R.querySelector('.qt-cmp').innerHTML=`<table class="jtbl"><thead><tr><th>Incoterm</th><th class="v">Quote price</th><th class="v">Margin at list</th></tr></thead><tbody>${INCO.map(k=>{ const x=QT.calc(st,k); return `<tr class="${k===st.inco?'hi':''}"><td>${k}</td><td class="v">${x.q!=null?m2(x.q):'–'}</td><td class="v ${x.ml!=null&&x.ml<0?'neg':''}">${x.ml!=null?pct(x.ml,1):'–'}</td></tr>`; }).join('')}</tbody></table>`;
      const msg=R.querySelector('.qt-msg'); let t='', tone='info';
      if(c.q==null){ t='Your target margin and percentage costs add up to 100% or more. Lower one of them.'; tone='bad'; }
      else if(st.list&&st.list<c.floor){ t=`At ${st.inco} on these terms, your list price doesn't even cover variable cost. Every unit loses cash. Don't quote list.`; tone='bad'; }
      else if(st.list&&st.list<c.zero){ t=`Your list price is below the zero-margin price on these terms. Quote it only with spare capacity and no risk to your normal prices (Module 13).`; tone='warn'; }
      else if(st.list&&st.list<c.q){ t=`List price earns ${pct(c.ml,1)}, short of your ${pct(st.target,0)} target. Quote ${m2(c.q)}, or offer FOB or shorter payment terms instead.`; tone='warn'; }
      else if(st.list){ t=`List price beats your target on these terms. Good: hold the price.`; tone='good'; }
      msg.innerHTML=t?`<div class="msg ${tone}" style="margin-top:12px">${t}</div>`:'';
    }
    return draw;
  }
};

/* ===================================================================== tool 3: equipment proposal */
function irr(fl){ const npv=r=>fl.reduce((t,v,i)=>t+v/Math.pow(1+r,i),0); let lo=-0.99, hi=10; if(npv(lo)*npv(hi)>0) return null; for(let i=0;i<200;i++){ const mid=(lo+hi)/2; if(npv(lo)*npv(mid)<=0) hi=mid; else lo=mid; } return (lo+hi)/2; }
const CX={
  key:'capex', file:'equipment-purchase-proposal.xlsx', title:'Equipment purchase proposal', short:'Equipment case', m:'m14', s:'methods',
  blurb:'Build the case for a machine: NPV, IRR, payback and a "what if benefits fall short" test, with a plain-English verdict.',
  defaults(){ return {item:'Automatic fabric cutting table',by:'Production manager',owner:'Production manager (fabric waste, cutting labour)',date:'2026-04-09',
    inv:[52000,3000,5000,0],ben:[10800,8000,6000,-2500],ramp:1,life:8,resale:5000,rate:0.10,sens:0.70}; },
  clear(st){ st.item=''; st.by=''; st.owner=''; st.inv=[0,0,0,0]; st.ben=[0,0,0,0]; st.resale=0; },
  invN:['Machine and software','Installation and electrical work','Validation and training','Extra working capital'],
  benN:['Material saved','Labour saved (named people and dates)','Extra contribution from capacity','Running costs (enter as a negative)'],
  calc(st){ const inv=sum(st.inv), ben=sum(st.ben), life=Math.max(1,Math.min(10,Math.round(+st.life||1)));
    const flows=k=>{ const f=[-inv]; for(let y=1;y<=10;y++) f.push(y<=life?ben*k*(y===1?(+st.ramp||0):1)+(y===life?(+st.resale||0)+(+st.inv[3]||0):0):0); return f; };
    const plan=flows(1), sens=flows(+st.sens||0); const r=+st.rate||0; const npv=f=>f.reduce((t,v,i)=>t+v/Math.pow(1+r,i),0);
    const cum=[]; plan.reduce((t,v,i)=>(cum[i]=t+v),0); const cumS=[]; sens.reduce((t,v,i)=>(cumS[i]=t+v),0);
    let pb=null; for(let y=1;y<=10;y++){ if(cum[y]>=0){ pb=(y-1)+(-cum[y-1])/plan[y]; break; } }
    const N=npv(plan), NS=npv(sens);
    return {inv,ben,life,plan,sens,cum,cumS,npv:N,npvS:NS,irr:irr(plan),pb,rec:N>0&&NS>0?'Robust: positive NPV even in the sensitivity case':N>0?'Positive NPV, but fragile: check the assumptions':'Negative NPV: don\'t proceed as proposed'}; },
  edits(st){ const e={B4:st.item||'',B5:st.by||'',B6:st.owner||'',B7:st.date||'',B23:+st.ramp||0,B24:+st.life||0,B25:+st.resale||0,B26:+st.rate||0,B27:+st.sens||0};
    st.inv.forEach((v,i)=>{ e['B'+(10+i)]=+v||0; }); st.ben.forEach((v,i)=>{ e['B'+(17+i)]=+v||0; }); return {Proposal:e}; },
  render(box,st,changed){
    const g=E('div','tool-2'); box.appendChild(g); const L=E('div'), R=E('div'); g.append(L,R);
    L.appendChild(E('h4',null,'The proposal')); const f0=E('div','tf one'); L.appendChild(f0);
    field(f0,st,'item','Item','text',changed); field(f0,st,'by','Requested by','text',changed); field(f0,st,'owner','Who owns the savings','text',changed);
    L.appendChild(E('h4',null,'Investment, year 0')); const f1=E('div','tf one'); L.appendChild(f1); CX.invN.forEach((n,i)=>field(f1,st.inv,i,n,'usd',changed));
    L.appendChild(E('h4',null,'Yearly benefits and running costs')); const f2=E('div','tf one'); L.appendChild(f2); CX.benN.forEach((n,i)=>field(f2,st.ben,i,n,'usd',changed));
    L.appendChild(E('h4',null,'Assumptions')); const f3=E('div','tf one'); L.appendChild(f3);
    field(f3,st,'ramp','Year 1 benefit while ramping up','pct',changed,{hint:'% of a full year'}); field(f3,st,'life','Useful life','num',changed,{hint:'years, up to 10'});
    field(f3,st,'resale','Resale value at the end','usd',changed); field(f3,st,'rate','Discount rate','pct',changed,{hint:'your cost of capital'});
    field(f3,st,'sens','Sensitivity: benefits at this % of plan','pct',changed);
    R.innerHTML=`<div class="stats cx-s"></div><div class="cx-rec"></div><h4 style="margin:16px 0 4px">Cumulative cash, year by year</h4><div class="cx-ch"></div>`;
    let plot=null;
    function draw(){
      const c=CX.calc(st);
      R.querySelector('.cx-s').innerHTML=UI.stat('Net present value',m$(c.npv),c.npv>0?'good':'bad')+UI.stat('Internal rate of return',c.irr==null?'n/a':pct(c.irr,1),c.irr!=null&&c.irr>(+st.rate||0)?'good':'')+UI.stat('Payback',c.pb==null?'Never':c.pb.toFixed(1)+' years')+UI.stat(`NPV if benefits are ${pct(+st.sens||0,0)} of plan`,m$(c.npvS),c.npvS>0?'good':'warn');
      R.querySelector('.cx-rec').innerHTML=`<div class="msg ${c.npv>0&&c.npvS>0?'good':c.npv>0?'warn':'bad'}" style="margin-top:10px"><strong>${c.rec}.</strong> ${c.npv>0?`At ${pct(+st.rate||0,0)}, the machine earns ${m$(c.npv)} more than it costs, in today's money.`:`At ${pct(+st.rate||0,0)}, the benefits don't repay the ${m$(c.inv)} investment.`} Before approving: are the labour savings named? Is validation included? Who will do the 12-month review?</div>`;
      const yrs=[...Array(Math.min(10,c.life)+1)].map((_,y)=>y);
      if(!plot) plot=BW.cols(R.querySelector('.cx-ch'),{series:[{name:'Plan',cls:'s1'},{name:`Benefits at ${pct(+st.sens||0,0)}`,cls:'s4'}],label:'Cumulative cash by year',fmt:v=>m$(v),height:150});
      plot(yrs.map(y=>({label:'Yr '+y,v:[c.cum[y],c.cumS[y]]})));
    }
    return draw;
  }
};

/* ===================================================================== tool 4: budget builder */
const MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const BA=[ /* key, label, kind, row on the Assumptions sheet, group */
  ['wages','Production wages last year','usd',11,'Costs'],['wageInc','Wage increase','pct',12,'Costs'],['extra','Extra production staff','num',13,'Costs'],['extraCost','Cost of one extra employee (a year)','usd',14,'Costs'],
  ['oh','Factory overhead last year (excluding depreciation)','usd',15,'Costs'],['dep','Depreciation for the year','usd',16,'Costs'],['ohInc','Overhead inflation','pct',17,'Costs'],
  ['sa','Selling and admin last year (excluding freight and commission)','usd',18,'Costs'],['saInc','Selling and admin inflation','pct',19,'Costs'],['frt','Freight and export costs, % of sales','pct',20,'Costs'],['com','Sales commission, % of sales','pct',21,'Costs'],
  ['int','Interest for the year','usd',22,'Funding and tax'],['tax','Tax rate','pct',23,'Funding and tax'],['capex','Equipment purchases (capex)','usd',24,'Funding and tax'],['loan','Loan repayments','usd',25,'Funding and tax'],
  ['dso','Receivable days (DSO)','num',26,'Working capital'],['dio','Inventory days','num',27,'Working capital'],['dpo','Payable days','num',28,'Working capital'],
  ['ar0','Opening receivables','usd',29,'Opening balances'],['inv0','Opening inventory','usd',30,'Opening balances'],['ap0','Opening payables','usd',31,'Opening balances'],['cash0','Opening cash','usd',32,'Opening balances']];
const BG={
  key:'budget', file:'budget-builder.xlsx', title:'Budget builder', short:'Budget', m:'m15', s:'build',
  blurb:'Volumes, prices and costs in; a monthly income statement, break-even and year-end cash out.',
  defaults(){ return {p:[{n:'Mattresses',u:2800,g:0.05,pr:180,pi:0.03,mc:95,mi:0.04},{n:'Slings',u:7200,g:0.05,pr:45,pi:0.03,mc:18,mi:0.04},{n:'Braces',u:13000,g:0.05,pr:28,pi:0.03,mc:11.8,mi:0.04}],
    a:{wages:152000,wageInc:0.06,extra:0,extraCost:4000,oh:118000,dep:45500,ohInc:0.04,sa:174000,saInc:0.04,frt:0.04,com:0.02,int:20000,tax:0.25,capex:60000,loan:20000,dso:65,dio:95,dpo:63,ar0:230000,inv0:250000,ap0:95000,cash0:42000},
    ph:[0.065,0.07,0.085,0.08,0.0817,0.0867,0.0733,0.0767,0.0933,0.09,0.1033,0.095]}; },
  clear(st){ st.p.forEach(p=>{ p.u=0; p.pr=0; p.mc=0; }); ['wages','extra','extraCost','oh','dep','sa','int','capex','loan','ar0','inv0','ap0','cash0'].forEach(k=>st.a[k]=0); },
  calc(st){ const a=st.a; const P=st.p.map(p=>{ const bu=p.u*(1+p.g), bp=p.pr*(1+p.pi), bm=p.mc*(1+p.mi); return {bu,bp,bm,rev:bu*bp,mat:bu*bm}; });
    const REV=sum(P.map(x=>x.rev)), MAT=sum(P.map(x=>x.mat));
    const wM=-(a.wages*(1+a.wageInc)+a.extra*a.extraCost*(1+a.wageInc))/12, ohM=-a.oh*(1+a.ohInc)/12, dM=-a.dep/12, saM=-a.sa*(1+a.saInc)/12, iM=-a.int/12;
    const m=MON.map((_,i)=>{ const ph=+st.ph[i]||0; const rev=REV*ph, mat=-MAT*ph, fr=-rev*a.frt, co=-rev*a.com, con=rev+mat+fr+co, op=con+wM+ohM+dM+saM, pbt=op+iM; return {rev,mat,fr,co,con,op,pbt}; });
    let cum=0; m.forEach(x=>{ const prev=cum; cum+=x.pbt; x.tax=-a.tax*(Math.max(0,cum)-Math.max(0,prev)); x.net=x.pbt+x.tax; });
    const T=k=>sum(m.map(x=>x[k])); const t={rev:T('rev'),mat:T('mat'),fr:T('fr'),co:T('co'),con:T('con'),w:wM*12,oh:ohM*12,dep:dM*12,sa:saM*12,op:T('op'),int:iM*12,pbt:T('pbt'),tax:T('tax'),net:T('net')};
    const cm=t.rev?t.con/t.rev:0, be=cm>0?-(t.w+t.oh+t.dep+t.sa+t.int)/cm:0;
    const arC=a.dso*t.rev/365, invC=a.dio*-(t.mat+t.w+t.oh)/365, apC=a.dpo*-t.mat/365;
    const cf={np:t.net,dep:a.dep,ar:a.ar0-arC,inv:a.inv0-invC,ap:apC-a.ap0}; cf.cfo=cf.np+cf.dep+cf.ar+cf.inv+cf.ap; cf.capex=-a.capex; cf.loan=-a.loan; cf.net=cf.cfo+cf.capex+cf.loan; cf.close=a.cash0+cf.net;
    return {P,REV,MAT,m,t,cm,be,cf,phT:sum(st.ph)}; },
  edits(st){ const e={}; const L='BCDEFG'; st.p.forEach((p,i)=>{ [p.u,p.g,p.pr,p.pi,p.mc,p.mi].forEach((v,j)=>{ e[L[j]+(5+i)]=+v||0; }); });
    BA.forEach(([k,,,row])=>{ e['B'+row]=+st.a[k]||0; }); st.ph.forEach((v,i)=>{ e[String.fromCharCode(66+i)+'36']=+v||0; }); return {Assumptions:e}; },
  render(box,st,changed){
    box.appendChild(E('h4',null,'Products'));
    const wrap=E('div','tg-wrap'); box.appendChild(wrap); const t=E('table','tg tg-p'); wrap.appendChild(t);
    t.innerHTML=`<thead><tr><th>Product</th><th class="v">Units last year</th><th class="v">Volume growth %</th><th class="v">Price last year</th><th class="v">Price rise %</th><th class="v">Material cost per unit</th><th class="v">Material inflation %</th><th class="v">Budget revenue</th></tr></thead><tbody></tbody>`;
    const tb=t.querySelector('tbody'); const revCells=[];
    st.p.forEach((p,i)=>{ const r=E('tr'); r.appendChild(E('td','tg-l',`<span>${esc(p.n)}</span>`)); [['u','num'],['g','pct'],['pr','usd2'],['pi','pct'],['mc','usd2'],['mi','pct']].forEach(([k,kind])=>{ const td=E('td'); td.appendChild(inputEl(p,k,kind,changed,{label:`${p.n}: ${k}`})); r.appendChild(td); }); const rc=E('td','v tg-t'); r.appendChild(rc); revCells.push(rc); tb.appendChild(r); });
    const groups={}; BA.forEach(b=>{ (groups[b[4]]=groups[b[4]]||[]).push(b); });
    const gw=E('div','bg-g'); box.appendChild(gw);
    Object.keys(groups).forEach(gname=>{ const c=E('div'); c.appendChild(E('h4',null,gname)); const f=E('div','tf one'); c.appendChild(f); groups[gname].forEach(([k,lab,kind])=>field(f,st.a,k,lab,kind,changed)); gw.appendChild(c); });
    box.appendChild(E('h4',null,'Monthly sales phasing'));
    const phw=E('div','bg-ph'); box.appendChild(phw);
    const phIn=MON.map((mn,i)=>{ const c=E('label','bg-pm'); c.appendChild(E('span',null,mn)); const w=E('span','tf-in is-pct'); const inp=inputEl(st.ph,i,'pct',changed,{label:`${mn} share of sales`}); w.appendChild(inp); c.appendChild(w); phw.appendChild(c); return inp; });
    const phBar=E('div','bg-phb'); box.appendChild(phBar);
    const out=E('div'); box.appendChild(out);
    out.innerHTML=`<div class="stats bg-s" style="margin-top:16px"></div><h4 style="margin:18px 0 4px">Net profit by month</h4><p class="w-hint" style="margin:0">Fixed costs are spread evenly, so quiet months can make a loss even in a profitable year.</p><div class="bg-ch"></div><div class="tool-2 even" style="margin-top:8px"><div><h4 style="margin:10px 0 6px">Budget income statement</h4><div class="bg-pl"></div></div><div><h4 style="margin:10px 0 6px">Cash for the year</h4><div class="bg-cf"></div><div class="bg-msg"></div></div></div>`;
    const plot=BW.cols(out.querySelector('.bg-ch'),{series:[{name:'Net profit',cls:'s3'}],label:'Net profit by month',fmt:v=>m$(v),height:140});
    const lb=UI.liveBridge(out.querySelector('.bg-cf'));
    function draw(){
      const c=BG.calc(st);
      c.P.forEach((x,i)=>{ revCells[i].textContent=m$(x.rev); });
      const ok=Math.abs(c.phT-1)<0.0005;
      phBar.innerHTML=`<span class="${ok?'ok':'bad'}">Total ${pct(c.phT,2)}${ok?' ✓':': must total 100%'}</span> <button type="button" class="linkbtn" data-even>Spread evenly</button>${ok?'':' <button type="button" class="linkbtn" data-scale>Rescale to 100%</button>'}`;
      phBar.querySelector('[data-even]').onclick=()=>{ st.ph=st.ph.map(()=>+(1/12).toFixed(4)); st.ph[11]=+(1-st.ph.slice(0,11).reduce((a,b)=>a+b,0)).toFixed(4); phIn.forEach((inp,i)=>{ inp.value=show('pct',st.ph[i]); }); changed(); };
      const sc=phBar.querySelector('[data-scale]'); if(sc) sc.onclick=()=>{ const T=sum(st.ph)||1; st.ph=st.ph.map(v=>+(v/T).toFixed(4)); const d=+(1-sum(st.ph)).toFixed(4); st.ph[11]=+(st.ph[11]+d).toFixed(4); phIn.forEach((inp,i)=>{ inp.value=show('pct',st.ph[i]); }); changed(); };
      out.querySelector('.bg-s').innerHTML=UI.stat('Budget revenue',m$(c.t.rev))+UI.stat('Net profit',m$(c.t.net),c.t.net<0?'bad':'good',c.t.rev?pct(c.t.net/c.t.rev,1)+' of revenue':'')+UI.stat('Break-even sales',c.be?m$(c.be):'–',c.be>c.t.rev?'bad':'',c.be&&c.t.rev?`${pct(1-c.be/c.t.rev,0)} margin of safety`:'')+UI.stat('Year-end cash',m$(c.cf.close),c.cf.close<0?'bad':c.cf.close<20000?'warn':'good');
      plot(c.m.map((x,i)=>({label:MON[i],v:[x.net]})));
      const L=[['Revenue',c.t.rev,1],['Materials',c.t.mat],['Freight and export',c.t.fr],['Commission',c.t.co],['Contribution',c.t.con,1],['Production wages',c.t.w],['Factory overhead',c.t.oh],['Depreciation',c.t.dep],['Selling and admin',c.t.sa],['Operating profit',c.t.op,1],['Interest',c.t.int],['Profit before tax',c.t.pbt,1],['Income tax',c.t.tax],['Net profit',c.t.net,1]];
      out.querySelector('.bg-pl').innerHTML=`<table class="jtbl"><thead><tr><th></th><th class="v">Year</th><th class="v">% of revenue</th></tr></thead><tbody>${L.map(([n,v,b])=>`<tr class="${b?'hi':''}"><td>${b?'<strong>'+n+'</strong>':n}</td><td class="v">${b?'<strong>'+m$(v)+'</strong>':m$(v)}</td><td class="v">${c.t.rev?pct(v/c.t.rev,1):'–'}</td></tr>`).join('')}</tbody></table>`;
      lb([{label:'Opening cash',v:st.a.cash0,total:true},{label:'Net profit',v:c.cf.np},{label:'Add back depreciation',v:c.cf.dep},{label:'Receivables',v:c.cf.ar},{label:'Inventory',v:c.cf.inv},{label:'Supplier credit',v:c.cf.ap},{label:'Equipment',v:c.cf.capex},{label:'Loan repayments',v:c.cf.loan},{label:'Closing cash',v:c.cf.close,total:true}]);
      out.querySelector('.bg-msg').innerHTML=`<div class="msg ${c.cf.close<0?'bad':c.t.net<0?'warn':'info'}" style="margin-top:10px">${c.cf.close<0?`<strong>You'd need about ${m$(-c.cf.close)} of extra borrowing</strong> by year-end, and more at the low point in between. Talk to the bank before the year starts.`:c.t.net<0?'A loss-making budget. Check prices, volumes and fixed costs before anyone approves it.':`Contribution margin ${pct(c.cm,1)}. Working capital ${c.cf.ar+c.cf.inv+c.cf.ap>=0?'releases':'absorbs'} ${m$(Math.abs(c.cf.ar+c.cf.inv+c.cf.ap))} at your target days.`} Year-end cash isn't the low point: check the 13-week forecast for that.</div>`;
    }
    return draw;
  }
};

const TOOLS=[C13,BG,QT,CX]; const BYKEY={}; TOOLS.forEach(t=>BYKEY[t.key]=t);
BW.tools=BYKEY;

/* ===================================================================== shell around one tool */
function mountTool(host,key,opts={}){
  const tool=BYKEY[key]; S.tools=S.tools||{}; if(!S.tools[key]) S.tools[key]=tool.defaults(); let st=S.tools[key];
  host.innerHTML=''; host.classList.add('tool');
  const head=E('div','tool-h',`<div><h3>${tool.title}</h3><p class="w-hint">${tool.blurb} <strong>Shaded boxes are inputs</strong>, like the yellow cells in the Excel file. What you type is saved only in this browser.</p></div>`); host.appendChild(head);
  const bar=E('div','tool-bar'); host.appendChild(bar);
  const dl=E('button','btn small','<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" style="fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round"><path d="M12 4v11M7 10l5 5 5-5M5 20h14"/></svg>Download with my numbers'); dl.type='button';
  const rs=E('button','btn ghost small','Reset to the BraceWorks example'); rs.type='button';
  const cl=E('button','btn ghost small','Clear the example figures'); cl.type='button';
  const say=E('span','tmpl-s small'); say.setAttribute('role','status'); say.setAttribute('aria-live','polite');
  bar.append(dl,cl,rs,say);
  const body=E('div','tool-b'); host.appendChild(body);
  const persist=debounce(()=>save(),400);
  let draw=()=>{};
  const changed=debounce(()=>{ draw(); persist(); },90);
  function build(){ body.innerHTML=''; draw=tool.render(body,st,changed)||(()=>{}); draw(); }
  rs.onclick=()=>{ S.tools[key]=st=tool.defaults(); save(); build(); say.textContent='Back to the BraceWorks example.'; };
  cl.onclick=()=>{ tool.clear(st); save(); build(); say.textContent='Example figures cleared. Rates and settings are kept.'; };
  dl.onclick=async()=>{ dl.disabled=true; const s=t=>{ say.textContent=t; };
    try{
      if(!(BW.tmplData||{})[tool.file]) throw new Error('missing');
      let blob, name=tool.file.replace('.xlsx','-my-numbers.xlsx');
      if(canPatch()){ s('Filling in the Excel file…'); blob=await fillXlsx(tool.file,tool.edits(st)); }
      else { name=tool.file; const u=b64u8(BW.tmplData[tool.file]); blob=new Blob([u],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}); s('This browser can\'t fill the file in, so here is the blank template.'); }
      await BW.saveFile(name,blob,s);
    }catch(e){ console.error(e); s('Something went wrong preparing the file. The plain template is on the Templates page.'); }
    dl.disabled=false; };
  build();
  return {tool};
}
BW.mountTool=mountTool;

/* ===================================================================== Toolkit page: Live tools */
const pickIcon={cash13:'<path d="M4 17l5-5 4 3 7-8"/><path d="M15 7h5v5"/>',budget:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>',quote:'<path d="M3 7h13l5 5-5 5H3z"/><circle cx="8" cy="12" r="1.6"/>',capex:'<rect x="3" y="9" width="18" height="10" rx="1"/><path d="M7 9V5h10v4M8 14h3"/>'};
const toolsSec={id:'tools',label:'Live tools',kind:'play',title:'Live tools: try your own numbers',blocks:[
  `<p>Four of the Excel templates also work right here. Start from BraceWorks' example, change any shaded box, and the results, charts and warnings update as you type. When you're happy, <strong>Download with my numbers</strong> gives you the full Excel file filled in with your figures, ready for your finance team.</p>`,
  {t:'live',cls:'tools-page',render(box){
    S.toolPick=BYKEY[S.toolPick]?S.toolPick:'cash13';
    const pick=E('div','tool-pick'); const host=E('div'); box.append(pick,host);
    TOOLS.forEach(t=>{ const b=E('button','tp',`<svg viewBox="0 0 24 24" aria-hidden="true">${pickIcon[t.key]}</svg><span><b>${t.title}</b><small>${t.blurb}</small></span>`); b.type='button'; b.setAttribute('aria-pressed',String(t.key===S.toolPick)); b.dataset.k=t.key;
      b.onclick=()=>{ S.toolPick=t.key; save(); pick.querySelectorAll('.tp').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.k===t.key))); mountTool(host,t.key); host.scrollIntoView&&host.scrollIntoView({block:'start',behavior:'smooth'}); }; pick.appendChild(b); });
    mountTool(host,S.toolPick);
    const lk=E('p','small',''); lk.style.marginTop='14px'; lk.innerHTML='Learn the method behind each tool: '+TOOLS.map(t=>`<button type="button" class="linkbtn" data-m="${t.m}" data-s="${t.s}">${t.short}: Module ${BW.modNo(t.m)}</button>`).join(' · '); box.appendChild(lk);
    lk.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{ const m=BW.mods[b.dataset.m]; BW.go(b.dataset.m,Math.max(0,m.sections.findIndex(x=>x.id===b.dataset.s)),{jump:true}); });
  }},
  {t:'callout',tone:'tip',title:'Your numbers stay with you',html:`<p>Figures you type are kept only in this browser on this device, as part of your saved progress. They aren't sent anywhere. To move them to another computer, download the Excel file, or use <strong>Save my progress</strong> on the course home page.</p>`}
]};
BW.kitExtra=(BW.kitExtra||[]).concat([toolsSec]);
const KIT_TOOLS=BW.kitExtra.length+2; /* Toolkit sections: warn, form, glos, then kitExtra */
BW.openTool=key=>{ S.toolPick=key; save(); BW.go('kit',KIT_TOOLS,{jump:true}); };

/* ---------- links from the template cards and the modules that teach each tool ---------- */
const tmpl=BW.kitExtra.find(s=>s.id==='tmpl');
if(tmpl){ const lv=tmpl.blocks.find(b=>b&&b.t==='live'); if(lv){ const orig=lv.render; lv.render=function(box,ctx){ orig.call(this,box,ctx);
  box.querySelectorAll('.tmpl').forEach(card=>{ const f=(card.querySelector('.tmpl-f')||{}).textContent; const t=TOOLS.find(x=>x.file===f); if(!t) return; const a=card.querySelector('.tmpl-a'); const b=E('button','btn ghost small','Use it in the page'); b.type='button'; b.onclick=()=>BW.openTool(t.key); a.insertBefore(b,a.children[1]||null); }); }; } }
TOOLS.forEach(t=>{ const m=BW.mods[t.m]; const sec=m&&m.sections.find(x=>x.id===t.s); if(!sec){ console.error('tools: no section '+t.m+'.'+t.s); return; }
  sec.blocks.push({t:'live',cls:'tool-link',render(box){ const b=E('button','packlink',`<span><span class="pl-k">Live tool</span>${t.title}: try it with BraceWorks' numbers or your own</span><span class="pl-a">Open</span>`); b.type='button'; b.onclick=()=>BW.openTool(t.key); box.appendChild(b); }}); });
})();
