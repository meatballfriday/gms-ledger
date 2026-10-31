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
  key:'cash13', file:'13-week-cash-forecast.xlsx', title:'13週現金流量預測', short:'13週現金', m:'m10', s:'cash13',
  blurb:'逐週列出收款與付款、期末現金與可用額度餘裕，並標出最低點，還能測試客戶延遲付款的影響。',
  rec:['美國經銷商A','澳洲醫院供應商','德國經銷商','瑞典經銷商','其他客戶','其他收款（加值稅退稅、資產出售）'],
  pay:['薪資','材料供應商','租金與水電','運費與出口費用','貸款還本與利息','稅款繳納','設備（資本支出）','其他付款'],
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
    const wk=w=>{ const d=new Date((st.date||'')+'T00:00:00'); if(isNaN(d)) return '第'+(w+1)+'週'; d.setDate(d.getDate()+7*w); return d.toLocaleDateString('zh-TW',{day:'numeric',month:'short'}); };
    const top=E('div','tf'); box.appendChild(top);
    field(top,st,'date','第一週結束日','text',()=>{ heads(); changed(); },{hint:'日期，例如2026-04-03'});
    field(top,st,'open','期初淨現金','usd',changed,{hint:'現金減去已動用的透支'});
    field(top,st,'limit','透支或授信額度上限','usd',changed);
    field(top,st,'minH','你想保留的最低可用額度餘裕','usd',changed);
    const wrap=E('div','tg-wrap'); box.appendChild(wrap);
    const t=E('table','tg'); wrap.appendChild(t);
    const head=`<thead><tr><th>美元</th>${[...Array(13)].map((_,w)=>`<th class="v"><span class="tg-w">第${w+1}週</span><span class="tg-d" data-w="${w}"></span></th>`).join('')}<th class="v">合計</th></tr></thead>`;
    t.innerHTML=head+'<tbody></tbody>'; const tb=t.querySelector('tbody');
    const sec=(txt)=>{ const r=E('tr','tg-h',`<td colspan="15">${txt}</td>`); tb.appendChild(r); };
    const rowIn=(arr,i,name,kind)=>{ const r=E('tr'); const th=E('td','tg-l'); th.innerHTML=`<span>${name}</span>`; const fill=E('button','tg-fill','→'); fill.type='button'; fill.title='將第1週複製到每一週'; fill.setAttribute('aria-label',`將「${name}」第1週複製到每一週`); th.appendChild(fill); r.appendChild(th);
      const ins=[]; for(let w=0;w<13;w++){ const td=E('td'); const inp=inputEl(arr[i],w,'usd',changed,{label:`${name}，第${w+1}週`}); ins.push(inp); td.appendChild(inp); r.appendChild(td); }
      fill.onclick=()=>{ const v=arr[i][0]; for(let w=1;w<13;w++){ arr[i][w]=v; ins[w].value=show('usd',v); } changed(); };
      const tot=E('td','v tg-t'); r.appendChild(tot); r._tot=tot; tb.appendChild(r); return r; };
    const rowOut=(name,cls)=>{ const r=E('tr','tg-o '+(cls||'')); r.innerHTML=`<td class="tg-l"><span>${name}</span></td>`+[...Array(14)].map(()=>'<td class="v"></td>').join(''); tb.appendChild(r); return r; };
    sec('收款'); const rr=C13.rec.map((n,i)=>rowIn(st.rec,i,n)); const trR=rowOut('收款合計','sub');
    sec('付款'); const pr=C13.pay.map((n,i)=>rowIn(st.pay,i,n)); const tpR=rowOut('付款合計','sub');
    const nR=rowOut('淨現金流量'), cR=rowOut('期末淨現金','sub'), hR=rowOut('可用額度餘裕（期末現金＋額度）','sub'), sR=rowOut('狀態');
    function heads(){ t.querySelectorAll('.tg-d').forEach(s=>{ s.textContent=wk(+s.dataset.w); }); }
    heads();
    const out=E('div'); box.appendChild(out);
    out.innerHTML=`<h4 style="margin:18px 0 6px">每週可用額度餘裕</h4><div class="hc"></div><div class="stats" style="margin-top:10px"></div>
      <div class="tool-what"><h4 style="margin:16px 0 6px">如果客戶延遲付款會怎樣？</h4><div class="tw-c"></div><p class="w-hint tw-o" style="margin-top:8px"></p></div>`;
    const hc=out.querySelector('.hc'), stats=out.querySelector('.stats');
    const sel=E('div','seg'); out.querySelector('.tw-c').appendChild(sel);
    const lateOpts=[{v:-1,label:'無'}].concat(C13.rec.slice(0,5).map((n,i)=>({v:i,label:n})));
    UI.seg(sel,lateOpts,st.late>=0&&st.lateW?st.late:-1,v=>{ st.late=v; if(v>=0&&!st.lateW) st.lateW=2; if(v<0) st.lateW=0; save(); draw(); });
    const slh=E('div'); out.querySelector('.tw-c').appendChild(slh);
    let slReady=false; UI.sliders(slh,[{k:'w',label:'延遲付款',min:1,max:4,step:1,v:st.lateW||2,f:x=>x+(x===1?' 週':' 週')}],v=>{ if(slReady&&st.late>=0){ st.lateW=v.w; save(); draw(); } },s=>'t13-'+s); slReady=true;
    function bars(c){ const max=Math.max(1,...c.head.map(Math.abs),+st.minH||0), neg=Math.min(0,...c.head); const span=max-neg, z=(-neg)/span*100;
      hc.innerHTML=`<div class="hc-min" style="bottom:${(z+(+st.minH||0)/span*100).toFixed(2)}%"><span>最低 ${kfmt(+st.minH||0)}</span></div>`+c.head.map((h,w)=>{ const ht=Math.abs(h)/span*100; return `<div class="hc-c" data-tip="第${w+1}週（${wk(w)}）|可用額度餘裕 ${m$(h)}"><i class="hc-b ${c.status[w]}" style="bottom:${(h>=0?z:z-ht).toFixed(2)}%;height:${ht.toFixed(2)}%"></i><span>${w+1}</span></div>`; }).join('')+`<div class="hc-z" style="bottom:${z.toFixed(2)}%"></div>`; }
    function draw(){
      const c=C13.calc(st);
      rr.forEach((r,i)=>{ r._tot.textContent=m$(sum(st.rec[i])); }); pr.forEach((r,i)=>{ r._tot.textContent=m$(sum(st.pay[i])); });
      const fill=(r,arr,tot,fmt)=>{ const td=r.querySelectorAll('td.v'); arr.forEach((v,w)=>{ td[w].textContent=fmt?fmt(v,w):m$(v); }); td[13].textContent=tot==null?'':m$(tot); };
      fill(trR,c.tr,sum(c.tr)); fill(tpR,c.tp,sum(c.tp)); fill(nR,c.net,sum(c.net)); fill(cR,c.close,null); fill(hR,c.head,null);
      fill(sR,c.status,null,(s)=>`<span class="tg-st ${s}">${s==='out'?'現金不足':s==='low'?'低於目標':'正常'}</span>`); sR.querySelectorAll('td.v').forEach((td,w)=>{ if(w<13) td.innerHTML=td.textContent; });
      hR.querySelectorAll('td.v').forEach((td,w)=>{ td.classList.toggle('neg',w<13&&c.status[w]!=='ok'); });
      bars(c);
      stats.innerHTML=UI.stat('最低可用額度餘裕',m$(c.low),c.low<0?'bad':c.low<(+st.minH||0)?'warn':'good',`第${c.lw+1}週，${wk(c.lw)}`)+UI.stat('第13週淨現金',m$(c.close[12]))+UI.stat('收款減付款',m$(sum(c.tr)-sum(c.tp)),'','13週合計');
      const o=out.querySelector('.tw-o');
      if(st.late>=0&&st.lateW){ const d=C13.calc(st,{row:st.late,by:st.lateW}); const lost=sum(st.rec[st.late].slice(13-st.lateW));
        o.innerHTML=`如果<strong>${esc(C13.rec[st.late])}</strong>延遲${st.lateW}週付款，最低可用額度餘裕會變成第${d.lw+1}週的<strong>${m$(d.low)}</strong>${d.low<c.low?`，惡化${m$(c.low-d.low)}`:''}。${lost?`有${m$(lost)}會延到第13週之後。`:''}${d.low<0?'<strong>你會發生現金短缺。</strong>現在就要安排資金，或延後付款。':d.low<(+st.minH||0)?'低於你設定的最低水準：現在就決定要催收什麼、延後什麼或借多少。':'仍高於你設定的最低水準。'}`; }
      else o.innerHTML='選一位客戶，看看延遲付款會對你的最低點造成什麼影響。';
      return c;
    }
    return draw;
  }
};

/* ===================================================================== tool 2: export quote */
const INCO=['EXW','FCA','FOB','CIF','DAP','DDP'];
const QT={
  key:'quote', file:'export-quote-calculator.xlsx', title:'出口報價計算器', short:'出口報價', m:'m12', s:'price',
  blurb:'依任一國貿條規、付款條件與佣金為訂單定價，並排比較底價、損益兩平價與目標利潤率價格。',
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
    L.appendChild(E('h4',null,'產品')); const f1=E('div','tf one'); L.appendChild(f1);
    field(f1,st,'product','產品','text',changed);
    field(f1,st,'full','完整單位成本','usd2',changed,{hint:'材料、人工、製造費用（第6單元）'});
    field(f1,st,'vc','單位變動成本','usd2',changed,{hint:'隨數量增加的成本'});
    field(f1,st,'list','你的牌價','usd2',changed); field(f1,st,'qty','本訂單數量','num',changed);
    L.appendChild(E('h4',null,'交貨條件'));
    const sg=E('div'); L.appendChild(sg); UI.seg(sg,INCO.map(k=>({v:k,label:k})),st.inco,v=>{ st.inco=v; changed(); });
    const ft=E('div','tf fr6'); L.appendChild(ft); L.appendChild(E('p','w-hint','各國貿條規下每單位的運費、保險與處理費，向你的貨運承攬商取得。'));
    INCO.forEach(k=>field(ft,st.fr,k,k,'usd2',changed));
    L.appendChild(E('h4',null,'條件與成本')); const f2=E('div','tf one'); L.appendChild(f2);
    field(f2,st,'comm','銷售佣金或代理商費用','pct',changed); field(f2,st,'buf','匯率緩衝','pct',changed,{hint:'以其他幣別報價時'});
    field(f2,st,'duty','由你負擔的進口關稅（僅限DDP）','pct',changed); field(f2,st,'days','客戶付款條件','num',changed,{hint:'天'});
    field(f2,st,'rate','你的借款成本','pct',changed,{hint:'年利率'}); field(f2,st,'target','扣除所有成本後的目標利潤率','pct',changed);
    R.innerHTML=`<div class="qt-big"><span class="k">每單位報價</span><b></b><span class="s"></span></div><div class="ladder"></div><div class="ld-k"></div><div class="qt-res"></div><h4 style="margin:16px 0 6px">同一張訂單在各國貿條規下的比較</h4><div class="qt-cmp"></div><div class="qt-msg"></div>`;
    function draw(){
      const c=QT.calc(st); const big=R.querySelector('.qt-big');
      big.querySelector('b').textContent=c.q!=null?m2(c.q):'請檢查輸入'; big.querySelector('.s').textContent=c.q!=null?`${st.inco}，${st.days}天，利潤率${pct(st.target,0)} · 訂單${m$(c.val)}`:'目標利潤率加上按比例計算的成本已達100%。';
      const pts=[c.floor,c.zero,c.q,st.list].filter(x=>x!=null&&isFinite(x)); const max=Math.max(1,...pts)*1.12; const P=v=>Math.max(0,Math.min(100,v/max*100)).toFixed(2)+'%';
      R.querySelector('.ladder').innerHTML=c.floor==null?'':`<div class="ld-bar"><span class="ld-z red" style="left:0;width:${P(c.floor)}"></span><span class="ld-z amb" style="left:${P(c.floor)};width:calc(${P(c.zero)} - ${P(c.floor)})"></span><span class="ld-z grn" style="left:${P(c.zero)};right:0"></span></div>
        <div class="ld-m up" style="left:${P(c.q||0)}">報價 <b>${m2(c.q||0)}</b></div><div class="ld-m dn" style="left:${P(st.list)}">牌價 ${m2(st.list)}</div>`;
      R.querySelector('.ld-k').innerHTML=c.floor==null?'':`<span><i class="red"></i>低於${m2(c.floor)}：絕不接受</span><span><i class="amb"></i>${m2(c.floor)}–${m2(c.zero)}：僅在有閒置產能時</span><span><i class="grn"></i>高於${m2(c.zero)}：可涵蓋完整成本</span>`;
      R.querySelector('.qt-res').innerHTML=`<table class="jtbl"><tbody>
        <tr><td>運費與處理費（${st.inco}）</td><td class="v">${m2(c.fr)}</td></tr>
        <tr><td>等待${st.days}天收款的成本</td><td class="v">價格的${pct(c.wait,1)}</td></tr>
        <tr><td>佣金、匯率緩衝${st.inco==='DDP'?'及關稅':''}</td><td class="v">價格的${pct(c.pc-c.wait,1)}</td></tr>
        <tr class="hi"><td><strong>利潤率${pct(st.target,0)}的報價</strong></td><td class="v"><strong>${c.q!=null?m2(c.q):'–'}</strong></td></tr>
        <tr><td>零利潤價格（涵蓋完整成本）</td><td class="v">${c.zero!=null?m2(c.zero):'–'}</td></tr>
        <tr><td>底價（僅涵蓋變動成本）</td><td class="v">${c.floor!=null?m2(c.floor):'–'}</td></tr>
        <tr><td>以牌價報價時的利潤率</td><td class="v">${c.ml!=null?pct(c.ml,1):'–'}</td></tr>
        <tr><td>以報價計算的訂單邊際貢獻</td><td class="v">${c.contrib!=null?m$(c.contrib):'–'}</td></tr></tbody></table>`;
      R.querySelector('.qt-cmp').innerHTML=`<table class="jtbl"><thead><tr><th>國貿條規</th><th class="v">報價</th><th class="v">牌價利潤率</th></tr></thead><tbody>${INCO.map(k=>{ const x=QT.calc(st,k); return `<tr class="${k===st.inco?'hi':''}"><td>${k}</td><td class="v">${x.q!=null?m2(x.q):'–'}</td><td class="v ${x.ml!=null&&x.ml<0?'neg':''}">${x.ml!=null?pct(x.ml,1):'–'}</td></tr>`; }).join('')}</tbody></table>`;
      const msg=R.querySelector('.qt-msg'); let t='', tone='info';
      if(c.q==null){ t='你的目標利潤率加上按比例計算的成本達到100%以上。請調降其中一項。'; tone='bad'; }
      else if(st.list&&st.list<c.floor){ t=`在${st.inco}及這些條件下，你的牌價連變動成本都不夠。每賣一件都在流失現金。不要用牌價報價。`; tone='bad'; }
      else if(st.list&&st.list<c.zero){ t=`在這些條件下，你的牌價低於零利潤價格。只有在有閒置產能、且不會影響你正常價格時才這樣報價（第13單元）。`; tone='warn'; }
      else if(st.list&&st.list<c.q){ t=`牌價的利潤率為${pct(c.ml,1)}，未達你${pct(st.target,0)}的目標。報價${m2(c.q)}，或改提FOB或較短的付款條件。`; tone='warn'; }
      else if(st.list){ t=`在這些條件下，牌價高於你的目標。很好：守住價格。`; tone='good'; }
      msg.innerHTML=t?`<div class="msg ${tone}" style="margin-top:12px">${t}</div>`:'';
    }
    return draw;
  }
};

/* ===================================================================== tool 3: equipment proposal */
function irr(fl){ const npv=r=>fl.reduce((t,v,i)=>t+v/Math.pow(1+r,i),0); let lo=-0.99, hi=10; if(npv(lo)*npv(hi)>0) return null; for(let i=0;i<200;i++){ const mid=(lo+hi)/2; if(npv(lo)*npv(mid)<=0) hi=mid; else lo=mid; } return (lo+hi)/2; }
const CX={
  key:'capex', file:'equipment-purchase-proposal.xlsx', title:'設備採購提案', short:'設備提案', m:'m14', s:'methods',
  blurb:'為一台機器建立投資論證：NPV、IRR、回收期間，以及「效益不如預期會怎樣」的測試，並附上白話結論。',
  defaults(){ return {item:'Automatic fabric cutting table',by:'Production manager',owner:'Production manager (fabric waste, cutting labour)',date:'2026-04-09',
    inv:[52000,3000,5000,0],ben:[10800,8000,6000,-2500],ramp:1,life:8,resale:5000,rate:0.10,sens:0.70}; },
  clear(st){ st.item=''; st.by=''; st.owner=''; st.inv=[0,0,0,0]; st.ben=[0,0,0,0]; st.resale=0; },
  invN:['機器與軟體','安裝與電力工程','確效與訓練','增加的營運資金'],
  benN:['節省的材料','節省的人工（列出人員姓名與日期）','產能增加帶來的額外邊際貢獻','營運成本（以負數輸入）'],
  calc(st){ const inv=sum(st.inv), ben=sum(st.ben), life=Math.max(1,Math.min(10,Math.round(+st.life||1)));
    const flows=k=>{ const f=[-inv]; for(let y=1;y<=10;y++) f.push(y<=life?ben*k*(y===1?(+st.ramp||0):1)+(y===life?(+st.resale||0)+(+st.inv[3]||0):0):0); return f; };
    const plan=flows(1), sens=flows(+st.sens||0); const r=+st.rate||0; const npv=f=>f.reduce((t,v,i)=>t+v/Math.pow(1+r,i),0);
    const cum=[]; plan.reduce((t,v,i)=>(cum[i]=t+v),0); const cumS=[]; sens.reduce((t,v,i)=>(cumS[i]=t+v),0);
    let pb=null; for(let y=1;y<=10;y++){ if(cum[y]>=0){ pb=(y-1)+(-cum[y-1])/plan[y]; break; } }
    const N=npv(plan), NS=npv(sens);
    return {inv,ben,life,plan,sens,cum,cumS,npv:N,npvS:NS,irr:irr(plan),pb,rec:N>0&&NS>0?'穩健：即使在敏感度情境下NPV仍為正':N>0?'NPV為正，但很脆弱：請檢查假設':'NPV為負：不要照原提案進行'}; },
  edits(st){ const e={B4:st.item||'',B5:st.by||'',B6:st.owner||'',B7:st.date||'',B23:+st.ramp||0,B24:+st.life||0,B25:+st.resale||0,B26:+st.rate||0,B27:+st.sens||0};
    st.inv.forEach((v,i)=>{ e['B'+(10+i)]=+v||0; }); st.ben.forEach((v,i)=>{ e['B'+(17+i)]=+v||0; }); return {Proposal:e}; },
  render(box,st,changed){
    const g=E('div','tool-2'); box.appendChild(g); const L=E('div'), R=E('div'); g.append(L,R);
    L.appendChild(E('h4',null,'提案')); const f0=E('div','tf one'); L.appendChild(f0);
    field(f0,st,'item','項目','text',changed); field(f0,st,'by','申請人','text',changed); field(f0,st,'owner','節省的負責人','text',changed);
    L.appendChild(E('h4',null,'投資額，第0年')); const f1=E('div','tf one'); L.appendChild(f1); CX.invN.forEach((n,i)=>field(f1,st.inv,i,n,'usd',changed));
    L.appendChild(E('h4',null,'每年效益與營運成本')); const f2=E('div','tf one'); L.appendChild(f2); CX.benN.forEach((n,i)=>field(f2,st.ben,i,n,'usd',changed));
    L.appendChild(E('h4',null,'假設')); const f3=E('div','tf one'); L.appendChild(f3);
    field(f3,st,'ramp','第1年爬坡期效益','pct',changed,{hint:'占全年的%'}); field(f3,st,'life','使用年限','num',changed,{hint:'年，最多10年'});
    field(f3,st,'resale','期末殘值','usd',changed); field(f3,st,'rate','折現率','pct',changed,{hint:'你的資金成本'});
    field(f3,st,'sens','敏感度：效益為計畫的此%','pct',changed);
    R.innerHTML=`<div class="stats cx-s"></div><div class="cx-rec"></div><h4 style="margin:16px 0 4px">逐年累計現金</h4><div class="cx-ch"></div>`;
    let plot=null;
    function draw(){
      const c=CX.calc(st);
      R.querySelector('.cx-s').innerHTML=UI.stat('淨現值',m$(c.npv),c.npv>0?'good':'bad')+UI.stat('內部報酬率',c.irr==null?'不適用':pct(c.irr,1),c.irr!=null&&c.irr>(+st.rate||0)?'good':'')+UI.stat('回收期間',c.pb==null?'無法回收':c.pb.toFixed(1)+' 年')+UI.stat(`效益為計畫${pct(+st.sens||0,0)}時的NPV`,m$(c.npvS),c.npvS>0?'good':'warn');
      R.querySelector('.cx-rec').innerHTML=`<div class="msg ${c.npv>0&&c.npvS>0?'good':c.npv>0?'warn':'bad'}" style="margin-top:10px"><strong>${c.rec}。</strong>${c.npv>0?`以${pct(+st.rate||0,0)}計算，這台機器以今天的幣值，比它的成本多賺${m$(c.npv)}。`:`以${pct(+st.rate||0,0)}計算，效益無法回收${m$(c.inv)}的投資。`}核准之前：人工節省有指名人員嗎？確效成本納入了嗎？誰會負責12個月後的檢討？</div>`;
      const yrs=[...Array(Math.min(10,c.life)+1)].map((_,y)=>y);
      if(!plot) plot=BW.cols(R.querySelector('.cx-ch'),{series:[{name:'計畫',cls:'s1'},{name:`效益為${pct(+st.sens||0,0)}`,cls:'s4'}],label:'逐年累計現金',fmt:v=>m$(v),height:150});
      plot(yrs.map(y=>({label:'第'+y+'年',v:[c.cum[y],c.cumS[y]]})));
    }
    return draw;
  }
};

/* ===================================================================== tool 4: budget builder */
const MON=['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
const BA=[ /* key, label, kind, row on the Assumptions sheet, group */
  ['wages','去年生產薪資','usd',11,'成本'],['wageInc','調薪幅度','pct',12,'成本'],['extra','增加的生產人員','num',13,'成本'],['extraCost','每增加一名員工的成本（每年）','usd',14,'成本'],
  ['oh','去年製造費用（不含折舊）','usd',15,'成本'],['dep','本年度折舊','usd',16,'成本'],['ohInc','製造費用通膨率','pct',17,'成本'],
  ['sa','去年推銷及管理費用（不含運費與佣金）','usd',18,'成本'],['saInc','推銷及管理費用通膨率','pct',19,'成本'],['frt','運費與出口費用，占銷貨%','pct',20,'成本'],['com','銷售佣金，占銷貨%','pct',21,'成本'],
  ['int','本年度利息','usd',22,'資金與稅務'],['tax','稅率','pct',23,'資金與稅務'],['capex','設備採購（資本支出）','usd',24,'資金與稅務'],['loan','貸款還本','usd',25,'資金與稅務'],
  ['dso','應收帳款週轉天數（DSO）','num',26,'營運資金'],['dio','存貨週轉天數','num',27,'營運資金'],['dpo','應付帳款週轉天數','num',28,'營運資金'],
  ['ar0','期初應收帳款','usd',29,'期初餘額'],['inv0','期初存貨','usd',30,'期初餘額'],['ap0','期初應付帳款','usd',31,'期初餘額'],['cash0','期初現金','usd',32,'期初餘額']];
const BG={
  key:'budget', file:'budget-builder.xlsx', title:'預算編製工具', short:'預算', m:'m15', s:'build',
  blurb:'輸入數量、價格與成本；產出每月損益表、損益兩平點與年底現金。',
  defaults(){ return {p:[{n:'床墊',u:2800,g:0.05,pr:180,pi:0.03,mc:95,mi:0.04},{n:'吊帶',u:7200,g:0.05,pr:45,pi:0.03,mc:18,mi:0.04},{n:'護具',u:13000,g:0.05,pr:28,pi:0.03,mc:11.8,mi:0.04}],
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
    box.appendChild(E('h4',null,'產品'));
    const wrap=E('div','tg-wrap'); box.appendChild(wrap); const t=E('table','tg tg-p'); wrap.appendChild(t);
    t.innerHTML=`<thead><tr><th>產品</th><th class="v">去年數量</th><th class="v">數量成長%</th><th class="v">去年價格</th><th class="v">漲價%</th><th class="v">單位材料成本</th><th class="v">材料通膨率%</th><th class="v">預算營業收入</th></tr></thead><tbody></tbody>`;
    const tb=t.querySelector('tbody'); const revCells=[];
    st.p.forEach((p,i)=>{ const r=E('tr'); r.appendChild(E('td','tg-l',`<span>${esc(p.n)}</span>`)); [['u','num'],['g','pct'],['pr','usd2'],['pi','pct'],['mc','usd2'],['mi','pct']].forEach(([k,kind])=>{ const td=E('td'); td.appendChild(inputEl(p,k,kind,changed,{label:`${p.n}: ${k}`})); r.appendChild(td); }); const rc=E('td','v tg-t'); r.appendChild(rc); revCells.push(rc); tb.appendChild(r); });
    const groups={}; BA.forEach(b=>{ (groups[b[4]]=groups[b[4]]||[]).push(b); });
    const gw=E('div','bg-g'); box.appendChild(gw);
    Object.keys(groups).forEach(gname=>{ const c=E('div'); c.appendChild(E('h4',null,gname)); const f=E('div','tf one'); c.appendChild(f); groups[gname].forEach(([k,lab,kind])=>field(f,st.a,k,lab,kind,changed)); gw.appendChild(c); });
    box.appendChild(E('h4',null,'每月銷貨分配'));
    const phw=E('div','bg-ph'); box.appendChild(phw);
    const phIn=MON.map((mn,i)=>{ const c=E('label','bg-pm'); c.appendChild(E('span',null,mn)); const w=E('span','tf-in is-pct'); const inp=inputEl(st.ph,i,'pct',changed,{label:`${mn}銷貨占比`}); w.appendChild(inp); c.appendChild(w); phw.appendChild(c); return inp; });
    const phBar=E('div','bg-phb'); box.appendChild(phBar);
    const out=E('div'); box.appendChild(out);
    out.innerHTML=`<div class="stats bg-s" style="margin-top:16px"></div><h4 style="margin:18px 0 4px">每月本期淨利</h4><p class="w-hint" style="margin:0">固定成本平均分攤，所以即使全年獲利，淡季月份仍可能虧損。</p><div class="bg-ch"></div><div class="tool-2 even" style="margin-top:8px"><div><h4 style="margin:10px 0 6px">預算損益表</h4><div class="bg-pl"></div></div><div><h4 style="margin:10px 0 6px">全年現金</h4><div class="bg-cf"></div><div class="bg-msg"></div></div></div>`;
    const plot=BW.cols(out.querySelector('.bg-ch'),{series:[{name:'本期淨利',cls:'s3'}],label:'每月本期淨利',fmt:v=>m$(v),height:140});
    const lb=UI.liveBridge(out.querySelector('.bg-cf'));
    function draw(){
      const c=BG.calc(st);
      c.P.forEach((x,i)=>{ revCells[i].textContent=m$(x.rev); });
      const ok=Math.abs(c.phT-1)<0.0005;
      phBar.innerHTML=`<span class="${ok?'ok':'bad'}">合計 ${pct(c.phT,2)}${ok?' ✓':'：合計必須為100%'}</span> <button type="button" class="linkbtn" data-even>平均分配</button>${ok?'':' <button type="button" class="linkbtn" data-scale>按比例調整為100%</button>'}`;
      phBar.querySelector('[data-even]').onclick=()=>{ st.ph=st.ph.map(()=>+(1/12).toFixed(4)); st.ph[11]=+(1-st.ph.slice(0,11).reduce((a,b)=>a+b,0)).toFixed(4); phIn.forEach((inp,i)=>{ inp.value=show('pct',st.ph[i]); }); changed(); };
      const sc=phBar.querySelector('[data-scale]'); if(sc) sc.onclick=()=>{ const T=sum(st.ph)||1; st.ph=st.ph.map(v=>+(v/T).toFixed(4)); const d=+(1-sum(st.ph)).toFixed(4); st.ph[11]=+(st.ph[11]+d).toFixed(4); phIn.forEach((inp,i)=>{ inp.value=show('pct',st.ph[i]); }); changed(); };
      out.querySelector('.bg-s').innerHTML=UI.stat('預算營業收入',m$(c.t.rev))+UI.stat('本期淨利',m$(c.t.net),c.t.net<0?'bad':'good',c.t.rev?'占營業收入'+pct(c.t.net/c.t.rev,1):'')+UI.stat('損益兩平銷貨額',c.be?m$(c.be):'–',c.be>c.t.rev?'bad':'',c.be&&c.t.rev?`安全邊際${pct(1-c.be/c.t.rev,0)}`:'')+UI.stat('年底現金',m$(c.cf.close),c.cf.close<0?'bad':c.cf.close<20000?'warn':'good');
      plot(c.m.map((x,i)=>({label:MON[i],v:[x.net]})));
      const L=[['營業收入',c.t.rev,1],['材料',c.t.mat],['運費與出口費用',c.t.fr],['佣金',c.t.co],['邊際貢獻',c.t.con,1],['生產薪資',c.t.w],['製造費用',c.t.oh],['折舊',c.t.dep],['推銷及管理費用',c.t.sa],['營業利益',c.t.op,1],['利息',c.t.int],['稅前淨利',c.t.pbt,1],['所得稅',c.t.tax],['本期淨利',c.t.net,1]];
      out.querySelector('.bg-pl').innerHTML=`<table class="jtbl"><thead><tr><th></th><th class="v">全年</th><th class="v">占營業收入%</th></tr></thead><tbody>${L.map(([n,v,b])=>`<tr class="${b?'hi':''}"><td>${b?'<strong>'+n+'</strong>':n}</td><td class="v">${b?'<strong>'+m$(v)+'</strong>':m$(v)}</td><td class="v">${c.t.rev?pct(v/c.t.rev,1):'–'}</td></tr>`).join('')}</tbody></table>`;
      lb([{label:'期初現金',v:st.a.cash0,total:true},{label:'本期淨利',v:c.cf.np},{label:'加回折舊',v:c.cf.dep},{label:'應收帳款',v:c.cf.ar},{label:'存貨',v:c.cf.inv},{label:'供應商賒帳',v:c.cf.ap},{label:'設備',v:c.cf.capex},{label:'貸款還本',v:c.cf.loan},{label:'期末現金',v:c.cf.close,total:true}]);
      out.querySelector('.bg-msg').innerHTML=`<div class="msg ${c.cf.close<0?'bad':c.t.net<0?'warn':'info'}" style="margin-top:10px">${c.cf.close<0?`<strong>到年底你大約需要額外借款${m$(-c.cf.close)}</strong>，期間的最低點還需要更多。在年度開始前就先和銀行談。`:c.t.net<0?'這是一份虧損的預算。在任何人核准之前，先檢查價格、數量和固定成本。':`邊際貢獻率${pct(c.cm,1)}。在你的目標天數下，營運資金${c.cf.ar+c.cf.inv+c.cf.ap>=0?'釋出':'占用'}${m$(Math.abs(c.cf.ar+c.cf.inv+c.cf.ap))}。`}年底現金不是最低點：最低點請看13週現金流量預測。</div>`;
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
  const head=E('div','tool-h',`<div><h3>${tool.title}</h3><p class="w-hint">${tool.blurb}<strong>有底色的欄位是輸入欄</strong>，就像Excel檔中的黃色儲存格。你輸入的內容只會儲存在這個瀏覽器中。</p></div>`); host.appendChild(head);
  const bar=E('div','tool-bar'); host.appendChild(bar);
  const dl=E('button','btn small','<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" style="fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round"><path d="M12 4v11M7 10l5 5 5-5M5 20h14"/></svg>下載含我的數字的檔案'); dl.type='button';
  const rs=E('button','btn ghost small','重設為BraceWorks範例'); rs.type='button';
  const cl=E('button','btn ghost small','清除範例數字'); cl.type='button';
  const say=E('span','tmpl-s small'); say.setAttribute('role','status'); say.setAttribute('aria-live','polite');
  bar.append(dl,cl,rs,say);
  const body=E('div','tool-b'); host.appendChild(body);
  const persist=debounce(()=>save(),400);
  let draw=()=>{};
  const changed=debounce(()=>{ draw(); persist(); },90);
  function build(){ body.innerHTML=''; draw=tool.render(body,st,changed)||(()=>{}); draw(); }
  rs.onclick=()=>{ S.tools[key]=st=tool.defaults(); save(); build(); say.textContent='已恢復為BraceWorks範例。'; };
  cl.onclick=()=>{ tool.clear(st); save(); build(); say.textContent='範例數字已清除。比率與設定保留不變。'; };
  dl.onclick=async()=>{ dl.disabled=true; const s=t=>{ say.textContent=t; };
    try{
      if(!(BW.tmplData||{})[tool.file]) throw new Error('missing');
      let blob, name=tool.file.replace('.xlsx','-my-numbers.xlsx');
      if(canPatch()){ s('正在填入Excel檔…'); blob=await fillXlsx(tool.file,tool.edits(st)); }
      else { name=tool.file; const u=b64u8(BW.tmplData[tool.file]); blob=new Blob([u],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}); s('這個瀏覽器無法填入檔案，因此提供空白範本。'); }
      await BW.saveFile(name,blob,s);
    }catch(e){ console.error(e); s('準備檔案時發生問題。空白範本可在「範本」頁面取得。'); }
    dl.disabled=false; };
  build();
  return {tool};
}
BW.mountTool=mountTool;

/* ===================================================================== Toolkit page: Live tools */
const pickIcon={cash13:'<path d="M4 17l5-5 4 3 7-8"/><path d="M15 7h5v5"/>',budget:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>',quote:'<path d="M3 7h13l5 5-5 5H3z"/><circle cx="8" cy="12" r="1.6"/>',capex:'<rect x="3" y="9" width="18" height="10" rx="1"/><path d="M7 9V5h10v4M8 14h3"/>'};
const toolsSec={id:'tools',label:'線上工具',kind:'play',title:'線上工具：試試你自己的數字',blocks:[
  `<p>其中四個Excel範本也能直接在這裡使用。從BraceWorks的範例開始，修改任何有底色的欄位，結果、圖表和警示會隨你輸入即時更新。滿意之後，按<strong>下載含我的數字的檔案</strong>，就能取得填好你數字的完整Excel檔，直接交給你的財務團隊。</p>`,
  {t:'live',cls:'tools-page',render(box){
    S.toolPick=BYKEY[S.toolPick]?S.toolPick:'cash13';
    const pick=E('div','tool-pick'); const host=E('div'); box.append(pick,host);
    TOOLS.forEach(t=>{ const b=E('button','tp',`<svg viewBox="0 0 24 24" aria-hidden="true">${pickIcon[t.key]}</svg><span><b>${t.title}</b><small>${t.blurb}</small></span>`); b.type='button'; b.setAttribute('aria-pressed',String(t.key===S.toolPick)); b.dataset.k=t.key;
      b.onclick=()=>{ S.toolPick=t.key; save(); pick.querySelectorAll('.tp').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.k===t.key))); mountTool(host,t.key); host.scrollIntoView&&host.scrollIntoView({block:'start',behavior:'smooth'}); }; pick.appendChild(b); });
    mountTool(host,S.toolPick);
    const lk=E('p','small',''); lk.style.marginTop='14px'; lk.innerHTML='了解每個工具背後的方法：'+TOOLS.map(t=>`<button type="button" class="linkbtn" data-m="${t.m}" data-s="${t.s}">${t.short}：第${BW.modNo(t.m)}單元</button>`).join(' · '); box.appendChild(lk);
    lk.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{ const m=BW.mods[b.dataset.m]; BW.go(b.dataset.m,Math.max(0,m.sections.findIndex(x=>x.id===b.dataset.s)),{jump:true}); });
  }},
  {t:'callout',tone:'tip',title:'你的數字只屬於你',html:`<p>你輸入的數字只會保存在這台裝置的這個瀏覽器中，作為你學習進度的一部分，不會傳送到任何地方。若要移到另一台電腦，請下載Excel檔，或使用課程首頁的<strong>儲存我的進度</strong>。</p>`}
]};
BW.kitExtra=(BW.kitExtra||[]).concat([toolsSec]);
const KIT_TOOLS=BW.kitExtra.length+2; /* Toolkit sections: warn, form, glos, then kitExtra */
BW.openTool=key=>{ S.toolPick=key; save(); BW.go('kit',KIT_TOOLS,{jump:true}); };

/* ---------- links from the template cards and the modules that teach each tool ---------- */
const tmpl=BW.kitExtra.find(s=>s.id==='tmpl');
if(tmpl){ const lv=tmpl.blocks.find(b=>b&&b.t==='live'); if(lv){ const orig=lv.render; lv.render=function(box,ctx){ orig.call(this,box,ctx);
  box.querySelectorAll('.tmpl').forEach(card=>{ const f=(card.querySelector('.tmpl-f')||{}).textContent; const t=TOOLS.find(x=>x.file===f); if(!t) return; const a=card.querySelector('.tmpl-a'); const b=E('button','btn ghost small','在頁面中使用'); b.type='button'; b.onclick=()=>BW.openTool(t.key); a.insertBefore(b,a.children[1]||null); }); }; } }
TOOLS.forEach(t=>{ const m=BW.mods[t.m]; const sec=m&&m.sections.find(x=>x.id===t.s); if(!sec){ console.error('tools: no section '+t.m+'.'+t.s); return; }
  sec.blocks.push({t:'live',cls:'tool-link',render(box){ const b=E('button','packlink',`<span><span class="pl-k">線上工具</span>${t.title}：用BraceWorks的數字或你自己的數字試試</span><span class="pl-a">開啟</span>`); b.type='button'; b.onclick=()=>BW.openTool(t.key); box.appendChild(b); }}); });
})();
