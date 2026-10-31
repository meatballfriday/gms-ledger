/* ===== Figures placed into the modules ===== */
(function(){
'use strict';
const V=BW.viz, H=BW.h, UI=BW.ui, P=V.p;
const {money,pct,kfmt,signed}=H;
const {wrap,txt,lines,arrow,head,badge,svg,nodeLines,node,f}=P;
const k$=x=>kfmt(x);
const pc1=x=>x.toFixed(1)+'%';
const pc0=x=>Math.round(x)+'%';

/* ---------- placement helper: insert a figure next to a block, found by its text */
function textOf(b){ if(typeof b==='string') return b; if(!b) return ''; return [b.title,b.html,b.q,b.prompt,b.label,b.intro,(b.head||[]).join(' '),(b.cards||[]).map(c=>c.f).join(' ')].filter(Boolean).join(' '); }
function put(id,secId,where,block){
  const m=BW.mods[id]||BW.packs[id]; if(!m){ console.error('visuals: no module '+id); return; }
  const sec=m.sections.find(s=>s.id===secId); if(!sec){ console.error('visuals: no section '+id+'.'+secId); return; }
  const b=Object.assign({t:'fig'},block);
  if(where.start){ sec.blocks.unshift(b); return; }
  if(where.end){ sec.blocks.push(b); return; }
  const needle=where.after||where.before||where.replace;
  const i=where.at!=null?where.at:sec.blocks.findIndex(x=>textOf(x).includes(needle));
  if(i<0){ console.error('visuals: anchor not found in '+id+'.'+secId+': '+needle); return; }
  if(where.replace){ if(sec.blocks[i].t==='quiz'){ console.error('visuals: refusing to replace a quiz'); return; } sec.blocks[i]=Object.assign(b,{t:'fig'}); return; }
  sec.blocks.splice(where.after?i+1:i,0,b);
}
/* Replacing a non-fig block would shift saved keys, so replacements reuse the old block's slot as a widget-like block */
function swap(id,secId,needle,block){
  const m=BW.mods[id]||BW.packs[id]; const sec=m&&m.sections.find(s=>s.id===secId); if(!sec){ console.error('visuals: swap target missing '+id+'.'+secId); return; }
  const i=(typeof needle==='object'&&needle)?needle.at:sec.blocks.findIndex(x=>textOf(x).includes(needle)); if(i<0){ console.error('visuals: swap anchor not found '+id+'.'+secId); return; }
  const b=Object.assign({t:'fig'},block); const keepCount=sec.blocks[i].t!=='fig';
  sec.blocks[i]=b; if(keepCount) sec.blocks.splice(i,0,{t:'nop'}); // invisible placeholder keeps later saved keys unchanged
}

const FOCUS=V.flow;

/* =================================================================== HOME */
BW.homeFig=function(){
  const fig=document.createElement('figure'); fig.className='fig'; fig.style.marginTop='16px';
  fig.innerHTML='<div class="fig-t">BraceWorks的資金循環</div>';
  const box=document.createElement('div'); box.className='fig-body'; fig.appendChild(box);
  V.mount(box,V.cycle({label:'現金流出去購買材料、支付工資，停留在存貨中，變成客戶的欠款，之後才以現金的形式回來：平均要113天。',
    nodes:[{t:'銀行裡的現金',k:'c'},{t:'購買泡棉與布料',s:'供應商給我們63天'},{t:'生產與儲存',s:'在庫106天'},{t:'出貨並開立發票',s:'客戶欠我們錢'},{t:'客戶付款',s:'70天後'}],
    center:{big:'113天',sub:'每繞一圈 現金被占用的天數'}}));
  const cap=document.createElement('figcaption'); cap.textContent='BraceWorks花出去的每一塊錢，都要繞完這一圈才會回來。這門課教你隨時看懂錢走到了哪裡，以及如何讓這個循環轉得更快。'; fig.appendChild(cap);
  return fig;
};

/* =================================================================== MODULE 1 */
put('m1','meet',{at:1,after:'Units last year'},{title:'BraceWorks的$120萬營收從哪裡來',
  html:V.stack({fmt:k$,inside:'pct',rows:[
    {label:'依產品',parts:[{label:'床墊',v:504000,c:'s1'},{label:'吊帶',v:324000,c:'s2'},{label:'護具',v:364000,c:'s3'},{label:'備品',v:8000,c:'s4'}]},
    {label:'依市場',parts:[{label:'美國',v:480000,c:'s1'},{label:'歐洲',v:420000,c:'s2'},{label:'澳洲與中東',v:300000,c:'s3'}]}],
    keys:[{label:'床墊／美國',c:'s1'},{label:'吊帶／歐洲',c:'s2'},{label:'護具／澳洲與中東',c:'s3'},{label:'備品',c:'s4'}]}),
  caption:'床墊帶來最多營收；護具賣出的數量最多，但單價最低。將游標移到色塊上或點一下，即可看到數字。'});

put('m1','connect',{at:0,after:'Every business event touches'},{title:'三大財務報表如何串連',
  render:function(box){
    const $=n=>(n<0?'(':'')+'$'+Math.abs(n).toLocaleString('en-US')+(n<0?')':''), sg=n=>(n>0?'+':'')+$(n);
    const IS=[['rev','營業收入',1200000],['cost','所有成本（含折舊$38,000）',-1144500],['np','本期淨利',55500,1]];
    const CF=[['np','本期淨利',55500,1],['dep','加回折舊',38000],['wc','應收帳款與存貨增加',-75000],['ap','應付供應商及其他款項增加',14500],['ops','營業活動現金流量',33000,1],['capex','新機器',-60000],['loan','銀行借款淨增加',20000],['chg','現金變動',-7000,1],['cash0','期初現金',49000,2],['cash1','期末現金',42000,1]];
    const BS=[['cash','現金',49000,42000],['wc','應收帳款與存貨',405000,480000],['pre','預付款項',13000,13000],['mach','機器設備（扣除折舊後）',288000,310000],['tot','資產總計',755000,845000,1],['ap','應付供應商及其他款項',119000,133500],['loan','銀行借款',200000,220000],['cap','股本',250000,250000],['re','保留盈餘',186000,241500],['tot2','負債及權益總計',755000,845000,1]];
    const ST=[
      {k:[],say:`三份報表，同一套數字。按<strong>下一步</strong>，看看同樣的數字如何出現在不只一張報表裡。一起亮起的各行，代表的是同一筆錢。`},
      {k:['is:np','cf:np','bs:re'],links:[['is:np','cf:np'],['cf:np','bs:re']],say:`<strong>利潤串起三張報表。</strong>損益表的最後一行是本期淨利$55,500。現金流量表就從同樣的$55,500開始。資產負債表上的保留盈餘也正好增加$55,500，從$186,000增至$241,500。`},
      {k:['is:cost','cf:dep','cf:capex','bs:mach'],links:[['is:cost','cf:dep'],['cf:dep','bs:mach'],['cf:capex','bs:mach']],say:`<strong>機器。</strong>折舊$38,000在損益中是一項成本，但並沒有支付現金，所以現金流量表把它加回。新機器花了$60,000現金。兩者合起來解釋了機器設備這一行：$288,000 + $60,000 − $38,000 = <strong>$310,000</strong>。`},
      {k:['cf:wc','bs:wc','cf:ap','bs:ap'],links:[['cf:wc','bs:wc'],['cf:ap','bs:ap']],say:`<strong>營運資金。</strong>應收帳款與存貨增加了$75,000（從$405,000到$480,000）：這是被占用的現金，在現金流量表中列為−$75,000。BraceWorks欠供應商及其他人的錢多了$14,500（從$119,000到$133,500），讓$14,500留在銀行裡。`},
      {k:['cf:loan','bs:loan'],links:[['cf:loan','bs:loan']],say:`<strong>借款。</strong>銀行借款增加了$20,000（從$200,000到$220,000）：透支多了$40,000，減去設備貸款償還的$20,000。同樣的$20,000，以來自銀行的現金流入出現在現金流量表上。`},
      {k:['cf:cash0','cf:cash1','bs:cash','cf:chg'],links:[['cf:cash0','bs:cash'],['cf:cash1','bs:cash']],say:`<strong>現金讓循環閉合。</strong>期初現金$49,000就是去年資產負債表上的現金。計入減少的$7,000，就得到$42,000：正好是今年資產負債表上的現金。<strong>現金流量表的每一行，都是資產負債表某一行的變動</strong>，所以三張表永遠一致。`}
    ];
    const row=(pre,r,cols)=>`<div class="tri-r${r[r.length-1]===1?' t':''}" data-k="${pre}:${r[0]}"><span>${r[1]}</span>${cols}</div>`;
    box.innerHTML=`<div class="tri-ctl"><button type="button" class="btn ghost small tri-b">← 上一步</button><span class="tri-n"></span><button type="button" class="btn small tri-f">下一步 →</button></div>
      <div class="tri">
        <div class="tri-c" data-c="is"><h4>損益表 <small>今年</small></h4>${IS.map(r=>row('is',r,`<b>${$(r[2])}</b>`)).join('')}</div>
        <div class="tri-c" data-c="cf"><h4>現金流量表 <small>今年</small></h4>${CF.map(r=>row('cf',r,`<b>${r[3]?$(r[2]):sg(r[2])}</b>`)).join('')}</div>
        <div class="tri-c" data-c="bs"><h4>資產負債表 <small>去年 → 今年</small></h4>${BS.map(r=>row('bs',r,`<i>${$(r[2])}</i><b>${$(r[3])}</b>`)).join('')}</div>
        <svg class="tri-lines" aria-hidden="true"></svg>
      </div>
      <div class="tri-say" aria-live="polite"></div>`;
    const grid=box.querySelector('.tri'), lines=box.querySelector('.tri-lines'), say=box.querySelector('.tri-say'); let n=0;
    function draw(){
      const s=ST[n]; grid.classList.toggle('is-on',n>0);
      grid.querySelectorAll('.tri-r').forEach(r=>r.classList.toggle('on',s.k.includes(r.dataset.k)));
      say.innerHTML=`<p>${s.say}</p>`; box.querySelector('.tri-n').textContent=n?`第${n}個連結，共${ST.length-1}個`:'開始';
      box.querySelector('.tri-b').disabled=n===0; const f=box.querySelector('.tri-f'); f.textContent=n===ST.length-1?'重新開始':'下一步 →';
      wire();
    }
    function wire(){
      const s=ST[n], g=grid.getBoundingClientRect(); lines.setAttribute('width',g.width); lines.setAttribute('height',g.height); lines.innerHTML='';
      const cs=[...grid.querySelectorAll('.tri-c')].map(c=>c.getBoundingClientRect()); if(cs.length<3||Math.abs(cs[0].top-cs[1].top)>4) return;  /* stacked on narrow screens: highlight only */
      lines.innerHTML=(s.links||[]).map(([a,b])=>{ const A=grid.querySelector(`[data-k="${a}"]`).getBoundingClientRect(), B=grid.querySelector(`[data-k="${b}"]`).getBoundingClientRect();
        const x1=A.right-g.left+2, y1=A.top+A.height/2-g.top, x2=B.left-g.left-2, y2=B.top+B.height/2-g.top, mx=(x1+x2)/2;
        return `<path d="M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}"/><circle cx="${x1}" cy="${y1}" r="3"/><circle cx="${x2}" cy="${y2}" r="3"/>`; }).join('');
    }
    box.querySelector('.tri-b').onclick=()=>{ if(n>0){ n--; draw(); } };
    box.querySelector('.tri-f').onclick=()=>{ n=n===ST.length-1?0:n+1; draw(); };
    if(window.ResizeObserver) new ResizeObserver(()=>wire()).observe(grid); else window.addEventListener('resize',wire);
    draw();
  },
  caption:'經驗法則：利潤把損益表和另外兩張表連在一起，而現金流量表的每一行，都是資產負債表某一行的變動。'});

put('m1','pl',{at:1,after:'BraceWorks Medical · Income statement'},{title:'每$100的營收流向哪裡',
  html:V.stack({fmt:x=>'$'+x.toFixed(1),pct:false,minShow:6,rows:[{label:'',tipLabel:'每$100中',parts:[
    {label:'材料',v:46.0,c:'s1'},{label:'工廠人工與製造費用',v:25.7,c:'s2'},{label:'推銷及管理費用',v:20.5,c:'s3'},{label:'利息與所得稅',v:3.2,c:'s4'},{label:'本期淨利',v:4.6,c:'good'}]}],
    keys:[{label:'材料',v:'$46.00',c:'s1'},{label:'工廠人工與製造費用',v:'$25.70',c:'s2'},{label:'推銷及管理費用',v:'$20.50',c:'s3'},{label:'利息與所得稅',v:'$3.20',c:'s4'},{label:'本期淨利',v:'$4.60',c:'good'}]}),
  caption:'客戶每付$100，BraceWorks只留下$4.60。最末端那一小段綠色，正是小幅的成本與價格變動影響如此之大的原因。'});

put('m1','bs',{at:2,after:'The accounting equation'},{title:'為什麼兩邊一定平衡',
  draw:function(w){
    const W=Math.min(w,560), cx=w/2, beamY=26, panY=150, arm=W*0.34, bw=Math.min(150,W*0.3), unit=90/845000;
    const ha=845000*unit, hl=353500*unit, he=491500*unit;
    let g=`<line x1="${f(cx-arm)}" y1="${beamY}" x2="${f(cx+arm)}" y2="${beamY}" class="v-edge" style="stroke-width:4;stroke:var(--ink)"/>`;
    g+=`<polygon points="${f(cx)},${beamY} ${f(cx-24)},${panY+34} ${f(cx+24)},${panY+34}" class="v-f-muted"/><line x1="${f(cx-60)}" x2="${f(cx+60)}" y1="${panY+34}" y2="${panY+34}" class="v-edge" style="stroke:var(--ink);stroke-width:3"/>`;
    [[-1],[1]].forEach(([s])=>{ const px=cx+s*arm; g+=`<line x1="${f(px)}" y1="${beamY}" x2="${f(px-bw/2-6)}" y2="${panY}" class="v-edge"/><line x1="${f(px)}" y1="${beamY}" x2="${f(px+bw/2+6)}" y2="${panY}" class="v-edge"/><line x1="${f(px-bw/2-10)}" x2="${f(px+bw/2+10)}" y1="${panY}" y2="${panY}" class="v-edge" style="stroke:var(--ink);stroke-width:3"/>`; });
    const lx=cx-arm-bw/2, rx=cx+arm-bw/2;
    g+=`<rect x="${f(lx)}" y="${f(panY-ha)}" width="${f(bw)}" height="${f(ha)}" rx="6" class="v-node hl"/>`+txt(lx+bw/2,panY-ha/2-2,'資產','v-t')+txt(lx+bw/2,panY-ha/2+14,'$845,000','v-s');
    g+=`<rect x="${f(rx)}" y="${f(panY-he)}" width="${f(bw)}" height="${f(he)}" rx="6" class="v-node good"/>`+txt(rx+bw/2,panY-he/2-2,'權益','v-t')+txt(rx+bw/2,panY-he/2+14,'$491,500','v-s');
    g+=`<rect x="${f(rx)}" y="${f(panY-he-hl-2)}" width="${f(bw)}" height="${f(hl)}" rx="6" class="v-node warn"/>`+txt(rx+bw/2,panY-he-hl/2-4,'負債','v-t')+txt(rx+bw/2,panY-he-hl/2+11,'$353,500','v-s');
    return svg(w,panY+42,'資產$845,000，與負債$353,500加上權益$491,500相平衡。',g);
  },
  caption:'BraceWorks擁有的一切（左）都有人出了錢：放款人與供應商，或是股東（右）。兩邊永遠一樣重。'});

/* =================================================================== MODULE 2 */
put('m2','chain',{at:0,after:'Every figure in your monthly pack started life'},{title:'追蹤一張發票走進報表',
  intro:'按<strong>播放</strong>，跟著一張真實的BraceWorks發票，從一張紙走到你的月度管理報告。',
  steps:[
    {k:['n0'],t:'BraceWorks出貨600張床墊給澳洲的醫院用品供應商。業務部門開立<strong>發票INV-5582，金額$21,600</strong>。這就是原始憑證。'},
    {k:['n0','e0','n1'],t:'記帳人員記錄一筆<strong>分錄</strong>：借記應收帳款$21,600，貸記銷貨收入$21,600。開立發票時，會計軟體通常會自動完成這一步。'},
    {k:['n1','e1','n2'],t:'這筆分錄<strong>過帳到總分類帳</strong>。應收帳款科目與銷貨收入科目各增加$21,600。'},
    {k:['n2','e2','n3'],t:'月底時，每個科目餘額都列在<strong>試算表</strong>上。借方總額等於貸方總額，所以帳簿是一致的。'},
    {k:['n3','e3','n4'],t:'財務部門把這些餘額編排成<strong>財務報表</strong>。這$21,600在損益表上列為營業收入；在客戶付款之前，也在資產負債表上列為應收帳款。'}],
  draw:V.flow({label:'原始憑證、分錄、總分類帳、試算表、財務報表。',labels:['記錄','過帳','列出','編排'],edgeK:['e0','e1','e2','e3'],
    nodes:[{t:'原始憑證',s:'發票INV-5582',k:'n0'},{t:'分錄',s:'借應收 貸銷貨',k:'n1'},{t:'總分類帳',s:'各科目 累計數',k:'n2'},{t:'試算表',s:'借方＝貸方',k:'n3'},{t:'財務報表',s:'三大報表',k:'n4'}]}),
  clickStep:{n0:0,n1:1,n2:2,n3:3,n4:4},
  docHint:'提示：點一下流程中的任一方框，或按<strong>下一步</strong>，就能看到該文件長什麼樣子的簡圖。',
  docs:[
    `<div class="dk-t">長什麼樣子：發票</div><div class="dk-paper dk-inv">
       <div class="dk-row"><b class="dk-big">BraceWorks Medical</b><span class="dk-tag">發票</span></div>
       <div class="dk-row dk-s"><span>菲律賓馬尼拉</span><span>編號 <b>INV-5582</b> · 12月18日</span></div>
       <div class="dk-box dk-s"><b>買受人：</b>澳洲醫院用品供應商，雪梨</div>
       <table class="dk-tb"><tr><th>品項</th><th>數量</th><th>單價</th><th>金額</th></tr><tr><td>減壓床墊</td><td>600</td><td>$36.00</td><td>$21,600</td></tr><tr class="dk-tot"><td colspan="3">應付總額</td><td>$21,600</td></tr></table>
       <div class="dk-s">付款條件：60天</div></div>
     <p class="dk-note"><strong>原始憑證是某件事確實發生過的證明。</strong>你還會看到其他種類：收據、供應商帳單、送貨單、薪資單和銀行對帳單。沒有憑證，就沒有分錄。</p>`,
    `<div class="dk-t">長什麼樣子：分錄</div><div class="dk-paper">
       <div class="dk-row dk-s"><b>分錄 JE-0412</b><span>12月18日</span></div>
       <table class="dk-tb dk-je"><tr><th>會計科目</th><th>借方</th><th>貸方</th></tr><tr class="dk-hl"><td>應收帳款</td><td>$21,600</td><td></td></tr><tr class="dk-hl"><td class="dk-in">銷貨收入：床墊</td><td></td><td>$21,600</td></tr><tr class="dk-tot"><td>合計</td><td>$21,600</td><td>$21,600</td></tr></table>
       <div class="dk-s"><i>摘要：</i>INV-5582，出貨600張床墊給澳洲醫院用品供應商。</div></div>
     <p class="dk-note"><strong>日記簿就是企業的日記：</strong>每筆交易都依日期順序，寫成一個借方和一個等額的貸方。依照慣例，貸方那一行要縮排。</p>`,
    `<div class="dk-t">長什麼樣子：總分類帳的兩頁</div><div class="dk-two">
       <div class="dk-paper"><div class="dk-acc">應收帳款</div><table class="dk-tb dk-led"><tr><th>日期</th><th>摘要</th><th>借方</th><th>貸方</th><th>餘額</th></tr><tr><td>12/17</td><td>截至目前餘額</td><td></td><td></td><td>$208,400</td></tr><tr class="dk-hl"><td>12/18</td><td>INV-5582</td><td>$21,600</td><td></td><td>$230,000</td></tr></table></div>
       <div class="dk-paper"><div class="dk-acc">銷貨收入</div><table class="dk-tb dk-led"><tr><th>日期</th><th>摘要</th><th>借方</th><th>貸方</th><th>餘額</th></tr><tr><td>12/17</td><td>截至目前餘額</td><td></td><td></td><td>$1,178,400</td></tr><tr class="dk-hl"><td>12/18</td><td>INV-5582</td><td></td><td>$21,600</td><td>$1,200,000</td></tr></table></div></div>
     <p class="dk-note"><strong>總分類帳每個科目一頁</strong>，各有累計餘額。日記簿告訴你<em>發生了什麼事</em>；總分類帳告訴你<em>每個科目目前的狀況</em>。會計軟體會自動同時維護兩者。</p>`,
    `<div class="dk-t">長什麼樣子：試算表</div><div class="dk-paper">
       <div class="dk-row dk-s"><b>12月31日試算表</b></div>
       <table class="dk-tb dk-tbal"><tr><th>會計科目</th><th>借方</th><th>貸方</th></tr>
       <tr><td>現金</td><td>$42,000</td><td></td></tr><tr class="dk-hl"><td>應收帳款</td><td>$230,000</td><td></td></tr><tr><td>存貨</td><td>$250,000</td><td></td></tr><tr><td>預付款項</td><td>$13,000</td><td></td></tr><tr><td>機器設備（扣除折舊後）</td><td>$310,000</td><td></td></tr><tr><td>全年所有成本</td><td>$1,144,500</td><td></td></tr>
       <tr><td>應付供應商及其他款項</td><td></td><td>$133,500</td></tr><tr><td>銀行借款</td><td></td><td>$220,000</td></tr><tr><td>股本</td><td></td><td>$250,000</td></tr><tr><td>保留盈餘（年初）</td><td></td><td>$186,000</td></tr><tr class="dk-hl"><td>銷貨收入</td><td></td><td>$1,200,000</td></tr>
       <tr class="dk-tot"><td>合計</td><td>$1,989,500</td><td>$1,989,500</td></tr></table></div>
     <p class="dk-note"><strong>所有分類帳餘額都在同一頁上。</strong>如果兩邊合計相符，表示每筆分錄都是以相等的借貸記錄。這並不證明分錄是對的，只證明它們平衡。</p>`,
    `<div class="dk-t">長什麼樣子：財務報表</div><div class="dk-two">
       <div class="dk-paper"><div class="dk-acc">損益表</div><table class="dk-tb dk-st"><tr class="dk-hl"><td>營業收入</td><td>$1,200,000</td></tr><tr><td>所有成本</td><td>($1,144,500)</td></tr><tr class="dk-tot"><td>本期淨利</td><td>$55,500</td></tr></table></div>
       <div class="dk-paper"><div class="dk-acc">資產負債表（節錄）</div><table class="dk-tb dk-st"><tr><td>現金</td><td>$42,000</td></tr><tr class="dk-hl"><td>應收帳款</td><td>$230,000</td></tr><tr><td>存貨</td><td>$250,000</td></tr><tr><td>…</td><td></td></tr></table></div></div>
     <p class="dk-note"><strong>把試算表重新編排給讀者看。</strong>收入與成本科目進損益表；其餘全部進資產負債表。發票INV-5582現在是$1,200,000營業收入和$230,000應收帳款的一部分。</p>`
  ]});

put('m2','drcr',{at:5,after:'Account Debit Credit'},{title:'同一筆分錄，畫成T字帳',
  draw:function(w){
    const side=w>=440, tw=side?Math.min(250,(w-40)/2):Math.min(300,w-20); const items=[['存貨：原料','left','$9,000','織帶到貨'],['應付帳款','right','$9,000','欠供應商']];
    let g='', y=0;
    items.forEach((it,i)=>{ const x=side?(w-(2*tw+40))/2+i*(tw+40):(w-tw)/2, yy=side?0:i*130; y=Math.max(y,yy);
      g+=txt(x+tw/2,yy+16,it[0],'v-t')+`<line x1="${f(x)}" x2="${f(x+tw)}" y1="${yy+26}" y2="${yy+26}" class="v-edge" style="stroke:var(--ink);stroke-width:2"/><line x1="${f(x+tw/2)}" x2="${f(x+tw/2)}" y1="${yy+26}" y2="${yy+108}" class="v-edge" style="stroke:var(--ink);stroke-width:2"/>`;
      g+=txt(x+tw/4,yy+44,'借方（左）','v-l')+txt(x+3*tw/4,yy+44,'貸方（右）','v-l');
      const ex=it[1]==='left'?x+tw/4:x+3*tw/4; g+=`<rect x="${f(ex-52)}" y="${yy+54}" width="104" height="40" rx="7" class="v-node ${it[1]==='left'?'hl':'warn'}"/>`+txt(ex,yy+72,it[2],'v-t')+txt(ex,yy+87,it[3],'v-s'); });
    const H_=side?140:270; g+=txt(w/2,H_-8,'借方$9,000 ＝ 貸方$9,000','v-l');
    return svg(w,H_,'存貨在左側借記$9,000；應付帳款在右側貸記$9,000。',g);
  },
  caption:'每筆交易都記兩次：一次記在某個科目的左邊，一次記在另一個科目的右邊。這就是「複式」的意思，也是帳簿會平衡的原因。'});

put('m2','close',{at:1,after:'Close step'},{title:'快速又平淡的結帳：八個工作天',
  draw:function(w){
    const T=[['銀行調節',1,2],['應收與應付分類帳',1,2],['應計項目與預付費用',2,3],['存貨盤點與評價',2,4],['折舊',3,3],['編製報表草稿',4,5],['複核與追查',5,6],['管理評述與月報',6,7],['發出月報',8,8,1]];
    const lw=Math.min(210,w*0.44), dw=(w-lw-6)/8, mc=Math.floor((lw-10)/6.4), two=T.some(t=>t[0].length>mc), rh=two?36:26, top=26; let g='';
    for(let d=1; d<=8; d++){ const x=lw+(d-1)*dw; g+=txt(x+dw/2,14,String(d),'v-ax')+`<line x1="${f(x)}" x2="${f(x)}" y1="${top-4}" y2="${f(top+T.length*rh)}" class="v-grid"/>`; }
    T.forEach((t,i)=>{ const y=top+i*rh; const L=wrap(t[0],mc).slice(0,2); g+=lines(lw-8,y+(L.length>1?14:rh/2+4),L,'v-s','end',13);
      if(t[3]){ const cx=lw+(t[1]-0.5)*dw, cy=y+rh/2; g+=`<polygon points="${f(cx)},${f(cy-9)} ${f(cx+9)},${f(cy)} ${f(cx)},${f(cy+9)} ${f(cx-9)},${f(cy)}" class="v-f-good" data-tip="${t[0]}|工作天 ${t[1]}"/>`; }
      else g+=`<rect x="${f(lw+(t[1]-1)*dw+2)}" y="${y+4}" width="${f((t[2]-t[1]+1)*dw-4)}" height="${rh-8}" rx="4" class="v-f-acc" data-tip="${t[0]}|工作天${t[1]===t[2]?' '+t[1]:' '+t[1]+'–'+t[2]}"/>`; });
    g+=txt(lw+4*dw,top+T.length*rh+18,'月底後的工作天','v-ax');
    return svg(w,top+T.length*rh+26,'月結工作排在第1到第8個工作天，最後在第8天發出月度管理報告。',g);
  },
  caption:'銀行調節和應計項目最先做，因為後面的一切都要靠它們。將游標移到長條上，可看到所需天數。如果你的月報第20天才到，代表其中某一步卡住了。'});

/* =================================================================== MODULE 3 */
put('m3','full',{at:1,after:'BraceWorks Medical · Income statement'},{title:'從$120萬營收到$55,500淨利',
  html:UI.bridge([{label:'營業收入',v:1200000,total:true},{label:'材料',v:-552000},{label:'直接人工',v:-152000},{label:'製造費用',v:-156000},{label:'營業毛利',v:340000,total:true},{label:'推銷與出口費用',v:-86000},{label:'管理費用',v:-160000},{label:'營業利益',v:94000,total:true},{label:'利息與匯兌',v:-20000},{label:'所得稅',v:-18500},{label:'本期淨利',v:55500,total:true}],{fmt:k$}),
  caption:'每一根紅色長條是被扣掉的成本；深色長條是小計。材料是最大的一口。'});

put('m3','leaks',{at:3,after:'% of revenue Jan'},{title:'材料上升，毛利率下降',
  draw:V.line({label:'材料占營收比重從45.8%升到50.3%，毛利率則從28.5%降到24.1%。',x:['1月','2月','3月','4月','5月','6月'],fmt:pc0,tfmt:pc1,ticks:4,dots:true,yMin:20,yMax:55,
    series:[{name:'材料占營收%',short:'材料',v:[45.8,46.1,46.9,48.0,49.2,50.3],c:'s1'},{name:'毛利率',short:'毛利率',v:[28.5,28.2,27.6,25.9,25.2,24.1],c:'s2'}]}),
  caption:'兩條線互為鏡像：材料每增加一個百分點，毛利率就少一個百分點。人工與製造費用（未顯示）維持持平。'});

put('m3','case',{at:1,after:'Before and after the growth push'},{title:'多出來的利潤去哪了',
  html:UI.bridge([{label:'衝成長前的營業利益',v:94000,total:true},{label:'按牌價計的新增銷量（扣除材料後）',v:154000},{label:'給出的折扣',v:-90000},{label:'加班',v:-30000},{label:'運費與關稅（DDP）',v:-64000},{label:'較高的佣金',v:-18300},{label:'衝成長後的營業利益',v:45700,total:true}],{fmt:k$}),
  caption:'新增銷量值$154,000。折扣、免費送貨、加班和佣金又拿回了其中的$202,300。'});

/* =================================================================== MODULE 4 */
put('m4','full',{at:1,after:'BraceWorks Medical · Balance sheet'},{title:'按比例畫出的資產負債表',
  draw:function(w){
    const A=[['現金',42000,'s1'],['應收帳款',230000,'s1'],['存貨',250000,'s1'],['預付款項',13000,'s1'],['設備淨額',310000,'s3']];
    const B=[['應付帳款及應計費用',125000,'s2'],['應付所得稅',8500,'s2'],['透支',120000,'s2'],['設備貸款',100000,'s2'],['權益',491500,'s4']];
    if(w<480){ ['現金','應收','存貨','預付','設備'].forEach((n,i)=>A[i][0]=n); ['應付','稅','透支','貸款','權益'].forEach((n,i)=>B[i][0]=n); }
    const HH=w<480?300:340, top=30, cw=Math.min(140,w*0.2), gx=Math.min(40,w*0.08), lx=w/2-gx/2-cw, rx=w/2+gx/2, sc=HH/845000;
    let g=txt(lx+cw/2,16,'我們擁有的','v-l')+txt(rx+cw/2,16,'誰出的錢','v-l')+txt(w/2,top+HH/2+6,'=','v-big');
    const col=(arr,x,side)=>{ let y=top; const labs=[];
      arr.forEach(a=>{ const h=a[1]*sc; g+=`<rect x="${f(x)}" y="${f(y)}" width="${f(cw)}" height="${f(Math.max(1,h-2))}" rx="3" class="v-f-${a[2]}" data-tip="${a[0]}|${money(a[1])} · 占總額的${pct(a[1]/845000)}"/>`; labs.push({t:a[0],v:k$(a[1]),y:y+h/2,cy:y+h/2}); y+=h; });
      for(let i=1;i<labs.length;i++) if(labs[i].y-labs[i-1].y<28) labs[i].y=labs[i-1].y+28;
      const over=labs[labs.length-1].y-(top+HH-8); if(over>0) for(let i=labs.length-1;i>=0;i--){ labs[i].y-=over; if(i>0&&labs[i].y-labs[i-1].y>=28) break; }
      labs.forEach(L=>{ const ex=side<0?x-6:x+cw+6, tx=side<0?x-12:x+cw+12; g+=`<line x1="${f(side<0?x:x+cw)}" y1="${f(L.cy)}" x2="${f(ex)}" y2="${f(L.y)}" class="v-grid" style="stroke:var(--rule-strong)"/>`+txt(tx,L.y-1,L.t,'v-s',side<0?'end':'start')+txt(tx,L.y+13,L.v,'v-l',side<0?'end':'start'); }); };
    col(A,lx,-1); col(B,rx,1);
    g+=txt(lx+cw/2,top+HH+18,'$845,000','v-val')+txt(rx+cw/2,top+HH+18,'$845,000','v-val');
    return `<div class="v-legend"><span><i class="sq" style="background:var(--s1)"></i>流動資產</span><span><i class="sq" style="background:var(--s3)"></i>非流動資產</span><span><i class="sq" style="background:var(--s2)"></i>負債</span><span><i class="sq" style="background:var(--s4)"></i>權益</span></div>`+svg(w,top+HH+26,'資產$845,000以一根長條呈現，高度等於負債加權益。',g);
  },
  caption:'每個區塊的高度代表它的金額。應收帳款加存貨比設備還大，而最上面那一小條現金非常小。'});

put('m4','compare',{at:1,after:'Balance sheet movements'},{title:'成長得比業務還快',
  html:UI.bars([{label:'營收',v:0.09,tone:'blue'},{label:'應付帳款',v:0.12,tone:'muted'},{label:'應收帳款',v:0.15,tone:'warn'},{label:'在製品',v:0.17,tone:'warn'},{label:'原料',v:0.19,tone:'warn'},{label:'製成品',v:0.32,tone:'bad'}],{fmt:x=>'+'+Math.round(x*100)+'%',max:0.34}),
  caption:'任何成長得比營收（藍色長條）快的項目，都在吸走現金。製成品的成長速度是營收的三倍以上。'});

/* =================================================================== MODULE 5 */
put('m5','stmt',{at:1,after:'BraceWorks Medical · Cash flow statement'},{title:'現金從哪裡來，又去了哪裡',
  html:V.stack({fmt:k$,max:80000,rows:[
    {label:'流入',sub:'$73,000',parts:[{label:'來自營業活動',v:33000,c:'s1'},{label:'新增借款',v:40000,c:'s2'}]},
    {label:'流出',sub:'$80,000',parts:[{label:'泡棉裁切機',v:60000,c:'s3'},{label:'償還貸款',v:20000,c:'s4'}]}],
    keys:[{label:'來自營業活動',c:'s1'},{label:'新增借款',c:'s2'},{label:'機器',c:'s3'},{label:'償還貸款',c:'s4'}]}),
  caption:'流出比流入多了$7,000，所以銀行存款從$49,000降到$42,000。流入的錢有一半以上是借來的。'});

swap('m5','runway',{at:1,n:'Month-end cash at BraceWorks'},{title:'BraceWorks的月底現金',
  draw:V.line({label:'月底現金介於$6,000到$42,000之間，兩度跌破$10,000。',x:['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],fmt:k$,area:true,dots:true,yMin:0,
    series:[{name:'月底現金',v:[38,31,22,35,41,18,9,48,6,24,37,42].map(x=>x*1000),c:'s1'}],
    refs:[{v:24000,label:'一個月的薪資'}],band:{lo:0,hi:10000,label:'低於$10k'},endLabels:false,
    marks:[{i:6,label:'$9k',dy:16},{i:8,label:'$6k',dy:16}]}),
  caption:'7月是因為一大筆泡棉採購；8月兩筆大額客戶付款入帳後回升；9月就是第1單元的個案，從$48,000跌到$6,000。年底的$42,000掩蓋了兩次差點發不出薪水的險境。'});

put('m5','case',{at:2,after:'The contract\'s cash effect in year one'},{title:'這份合約的現金曲線',
  draw:V.line({label:'合約的累計現金影響在第6個月跌到負$160,000，低於$72,000的可用額度餘裕，第一年結束時為負$135,000。',x:['M1','M2','M3','M4','M5','M6','M7','M8','M9','M10','M11','M12'],fmt:k$,area:true,yMax:0,
    series:[{name:'合約的累計現金影響',v:[-30,-62,-95,-128,-150,-160,-158,-152,-145,-139,-136,-135].map(x=>x*1000),c:'s2'}],
    refs:[{v:-72000,label:'可用額度餘裕：$72k',cls:'bad'}],endLabels:false,marks:[{i:5,label:'最大資金需求$160k',dy:18}]}),
  caption:'材料和工資在第一筆90天期貨款入帳之前好幾個月就要支付。跌破紅線時，BraceWorks的現金和透支額度都已用完。有利可圖的合約，一開始還是會先挖出一個洞。'});

/* =================================================================== MODULE 6 */
put('m6','build',{at:6,after:'Full cost of one mattress'},{title:'哪些間接費用會進入毛利率？',
  render:function(box){
    box.innerHTML=`<div class="ovh">
      <div class="ovh-c in"><div class="ovh-h">製造產品<small>計入銷貨成本，所以在毛利率<b>之內</b></small></div>
        <ul><li>材料</li><li>生產人工</li><li><strong>製造費用：</strong>領班、工廠租金與電費、機器折舊與維修、產線上的品質檢驗</li></ul></div>
      <div class="ovh-c out"><div class="ovh-h">銷售產品與經營公司<small>營業費用，列在營業毛利<b>之下</b></small></div>
        <ul><li>業務團隊、佣金、行銷、商展</li><li>送貨給客戶的運費與保險</li><li>辦公室租金、財務、人資、總經理、查核公費</li></ul></div>
    </div>
    <div class="ovh-pl" role="img" aria-label="BraceWorks：營業收入$1,200,000減銷貨成本$860,000，得到營業毛利$340,000；再減營業費用$246,000，得到營業利益$94,000。">
      <div><span>營業收入</span><b>$1,200,000</b></div>
      <div class="m"><span>銷貨成本<small>材料$552k＋人工$152k＋製造費用$156k</small></span><b>($860,000)</b></div>
      <div class="t"><span>營業毛利 <small>毛利率28.3%</small></span><b>$340,000</b></div>
      <div class="m o"><span>營業費用<small>推銷與出口$86k＋辦公室與管理$160k</small></span><b>($246,000)</b></div>
      <div class="t"><span>營業利益</span><b>$94,000</b></div>
    </div>`;
  },
  caption:'判斷標準是這項成本的用途：是製造產品，還是銷售產品和經營公司。會計準則（IAS 2，菲律賓以PFRS採用）把製造費用計入存貨成本，所以要等貨品售出時才進入毛利率。至於特殊訂單之類的決策，第12單元改用邊際貢獻，把固定製造費用排除在外。'});

put('m6','products',{at:1,after:'Per unit Mattress Sling Brace'},{title:'每項產品的售價裡包含什麼',
  html:V.stack({fmt:x=>x.toFixed(1)+'%',pct:false,inside:'pct',rows:[
    {label:'床墊',sub:'$180',parts:[{label:'材料',v:52.8,c:'s1'},{label:'人工',v:8.3,c:'s2'},{label:'製造費用',v:8.6,c:'s3'},{label:'營業毛利',v:30.3,c:'s4'}]},
    {label:'吊帶',sub:'$45',parts:[{label:'材料',v:40.0,c:'s1'},{label:'人工',v:10.0,c:'s2'},{label:'製造費用',v:10.3,c:'s3'},{label:'營業毛利',v:39.7,c:'s4'}]},
    {label:'護具',sub:'$28',parts:[{label:'材料',v:42.1,c:'s1'},{label:'人工',v:20.4,c:'s2'},{label:'製造費用',v:20.9,c:'s3'},{label:'營業毛利',v:16.6,c:'s4'}]}],
    keys:[{label:'材料',c:'s1'},{label:'人工',c:'s2'},{label:'製造費用',c:'s3'},{label:'營業毛利',c:'s4'}]}),
  caption:'每根長條都是售價的100%。護具花在人工與製造費用上的比重是床墊的兩倍，所以毛利很薄。'});

put('m6','abc',{at:2,after:'Overhead per unit Mattress Sling Brace'},{title:'每單位製造費用：一個成本庫 vs. 三個',
  draw:V.vbars({label:'在作業基礎成本制下，每張床墊的製造費用從$15.40升到$23.80；吊帶從$4.62降到$2.88；護具從$5.85降到$5.10。',x:['床墊','吊帶','護具'],fmt:x=>'$'+Math.round(x),tfmt:x=>money(x,2),values:true,vfmt:x=>'$'+x.toFixed(2),
    series:[{name:'依人工小時分攤',v:[15.40,4.62,5.85],c:'s1'},{name:'作業基礎（三個成本庫）',v:[23.80,2.88,5.10],c:'s2'}]}),
  caption:'床墊要用泡棉裁切機，又占了一半的廠房空間，所以較好的方法會分攤更多給它。總額同樣是$156,000，但每項產品的答案都不同。'});

put('m6','case',{at:3,after:'On a $125.40 cost'},{title:'同一成本下的加成與利潤率',
  html:V.stack({fmt:x=>money(x,2),max:179.14,pct:false,rows:[
    {label:'30%加成',sub:'售價$163.02',parts:[{label:'成本',v:125.40,c:'muted',show:'成本$125.40'},{label:'利潤',v:37.62,c:'s1',show:'23%'}]},
    {label:'30%利潤率',sub:'售價$179.14',parts:[{label:'成本',v:125.40,c:'muted',show:'成本$125.40'},{label:'利潤',v:53.74,c:'s1',show:'30%'}]}],
    keys:[{label:'成本',c:'muted'},{label:'利潤（占售價比重）',c:'s1'}]}),
  caption:'成本加成30%，利潤只占售價的23%。要讓利潤占售價的30%，就要把成本除以0.70。'});

/* =================================================================== MODULE 7 */
put('m7','flow',{at:0,after:'In a factory, inventory has three stages'},{title:'成本如何在工廠裡流動',
  intro:'按<strong>播放</strong>，跟著錢從一批泡棉到貨，一路走到損益表。',
  steps:[
    {k:['n0','e0','n1'],t:'材料到貨後放在<strong>原料</strong>中，這是資產負債表上的資產。此時還沒有任何東西進入損益表。'},
    {k:['n1','e1','n2'],t:'生產部門把材料領到產線上。在<strong>在製品</strong>中，再加上製造產品人員的工資和分攤的製造費用。'},
    {k:['n2','e2','n3'],t:'完成、檢驗並放行的產品移到<strong>製成品</strong>，仍然帶著上述所有成本。'},
    {k:['n3','e3','n4'],t:'只有在產品<strong>售出</strong>時，它的成本才會離開資產負債表，以銷貨成本出現在損益表上。'},
    {k:['n1','n2','n3'],t:'所以在任何時刻，今年的部分工資、電費和租金，都以存貨的形式放在貨架上。這就是為什麼生產多於銷售會美化利潤。'}],
  draw:V.flow({label:'採購流入原料，再進入在製品並加上人工與製造費用，接著成為製成品，最後成為銷貨成本。',labels:['到貨','領用','完工','售出'],edgeK:['e0','e1','e2','e3'],
    nodes:[{t:'採購',s:'泡棉、布料、織帶 $588k',k:'n0'},{t:'原料',s:'年底$140k',k:'n1'},{t:'在製品',s:'＋人工$156k ＋製造費用$161k',k:'n2'},{t:'製成品',s:'年底$75k',k:'n3'},{t:'銷貨成本',s:'損益表上 $860k',k:'n4',cls:'hl'}]})});

put('m7','case',{at:1,after:'Cause Value Type'},{title:'那$19,400是由什麼構成的',
  html:UI.bars([{label:'未記錄的泡棉報廢',v:11000,tone:'bad'},{label:'物料清單中的布料數量錯誤',v:3600,tone:'warn'},{label:'小零件可能遭竊',v:2500,tone:'bad'},{label:'未記錄的樣品',v:2300,tone:'warn'}]),
  caption:'「不見」的存貨有一半以上，是沒有人記錄的報廢品。每個原因都有不同的解法。'});

/* =================================================================== MODULE 8 */
put('m8','split',{at:1,after:'Variance Formula October Owner'},{title:'把價格與數量畫出來',
  draw:function(w){
    const W=Math.min(w,620), x0=(w-W)/2+56, PL=wrap('價格差異：每m³多付$12 × 68.4 m³ = $821',Math.max(16,Math.floor((w-((w-W)/2+56)-8)/6.5))), top=30+PL.length*13, hs=w<480?120:150, hp=34, avail=W-56-(w<480?120:190), k=avail/68.4, ws=62.4*k, ue=6*k;
    let g=`<rect x="${f(x0)}" y="${f(top+hp)}" width="${f(ws)}" height="${hs}" class="v-f-q0" data-tip="標準成本|62.4 m³ × $200 = $12,480"/>`;
    g+=lines(x0+ws/2,top+hp+hs/2-6,['標準成本','62.4 m³ × $200','= $12,480'],'v-s','middle',15);
    g+=`<rect x="${f(x0+ws+2)}" y="${f(top+hp)}" width="${f(ue-2)}" height="${hs}" class="v-f-s1" data-tip="數量差異|(68.4 − 62.4) × $200 = $1,200 A"/>`;
    g+=`<rect x="${f(x0)}" y="${f(top)}" width="${f(ws+ue)}" height="${hp-2}" class="v-f-s2" data-tip="價格差異|($212 − $200) × 68.4 = $821 A"/>`;
    g+=lines(x0,top-10-(PL.length-1)*13,PL,'v-l','start',13);
    const lx=x0+ws+ue+10; g+=lines(lx,top+hp+hs/2-14,wrap('數量差異： 多用6 m³ × $200 = $1,200',Math.max(12,Math.floor((w-lx-6)/6.4))),'v-l','start',13);
    g+=arrow(x0,top+hp+hs+4,x0,top-4)+txt(x0-8,top+hp+4,'$200','v-ax','end')+txt(x0-8,top+12,'$212','v-ax','end')+lines(x0-8,top+hp+hs-20,['價格','每m³'],'v-ax','end',12);
    g+=arrow(x0-2,top+hp+hs,x0+ws+ue+24,top+hp+hs)+txt(x0+ws,top+hp+hs+16,'62.4','v-ax')+txt(x0+ws+ue+4,top+hp+hs+30,'實際68.4 m³','v-ax','start');
    return svg(w,top+hp+hs+40,'標準成本矩形，上方有一條價格差異帶，右側有一條數量差異帶。',g);
  },
  caption:'灰色矩形是240張床墊應有的成本：標準數量 × 標準價格。多出來的長條就是超支。上方那條是每m³付得比較多（價格）；側邊那條是用了比較多m³（數量）。未按比例繪製。'});

put('m8','coq',{at:2,after:'Where BraceWorks\' quality money goes'},{title:'缺陷越晚發現，代價越高',
  draw:V.vbars({label:'修正一個缺陷的相對成本：設計階段為1，產線上為10，客戶端為100。',x:['在設計階段發現','在產線上發現','由客戶發現'],fmt:x=>'×'+x,values:true,xwrap:true,
    series:[{name:'修正一個缺陷的相對成本',v:[1,10,100],c:'s1',cs:['good','s4','red']}]}),
  caption:'這是常見的經驗法則，不是精確的定律：缺陷每多存活一個階段，修正成本就倍增。對醫療器材而言，客戶階段可能意味著現場安全矯正措施或回收。'});

put('m8','case',{at:1,after:'Average monthly variances since the switch'},{title:'較便宜的泡棉，逐月來看',
  html:UI.bridge([{label:'泡棉價格節省',v:1650},{label:'多用的泡棉',v:-2400},{label:'裁切變慢',v:-900},{label:'報廢與重工',v:-1100},{label:'客訴與退貨',v:-1800},{label:'每月淨影響',v:-4550,total:true}]),
  caption:'一根綠色長條，四根紅色長條。採購部門因此獲得獎勵的那筆節省，比它造成的成本還小。'});

/* =================================================================== MODULE 9 */
put('m9','score',{at:2,before:'Fix in this order'},{title:'每一層都建立在下一層之上',
  draw:function(w){
    const L=[['完整且相互串連','毛利、帳齡、營運','s4'],['有洞見','摘要、管理評述、行動','s3'],['可比較','預算、去年、占營收%','s2'],['可靠','已調節、已結帳、準時','s1']];
    const W=Math.min(w,560), lh=56, top=4, x0=(w-W)/2; let g='';
    L.forEach((l,i)=>{ const yt=top+i*lh, yb=yt+lh-3, b0=w<480?0.56:0.36, wt=W*(b0+(1-b0)*i/L.length), wb=W*(b0+(1-b0)*(i+1)/L.length);
      g+=`<polygon points="${f(w/2-wt/2)},${f(yt)} ${f(w/2+wt/2)},${f(yt)} ${f(w/2+wb/2)},${f(yb)} ${f(w/2-wb/2)},${f(yb)}" class="v-node ${['warn','good','hl','alt'][i]}"/>`+txt(w/2,yt+24,`${4-i}. ${l[0]}`,'v-t')+txt(w/2,yt+40,l[1],'v-s'); });
    return svg(w,top+L.length*lh+4,'金字塔：底層是可靠，往上是可比較，再來是有洞見，最上層是完整且相互串連。',g);
  },
  caption:'從底層往上蓋。在未經調節的數字上做出漂亮的儀表板，只會讓錯的數字看起來很有說服力。'});

/* =================================================================== MODULE 10 */
put('m10','aging',{at:1,after:'Receivables aging at year-end'},{title:'同一份帳齡，畫成圖',
  html:V.stack({fmt:k$,max:50000,minShow:9,rows:[
    ['美國經銷商A',[40,10,0,0,0]],['澳洲醫院用品供應商',[22,5,0,0,0]],['德國經銷商',[20,0,6,0,0]],['瑞典經銷商',[24,0,0,0,0]],['美國經銷商B',[10,5,8,0,0]],['阿聯經銷商',[0,0,0,0,28]],['英國經銷商',[12,0,0,8,0]],['其他19位客戶',[32,0,0,0,0]]
  ].map(r=>({label:r[0],parts:r[1].map((v,i)=>({label:['未到期','逾期1–30天','逾期31–60天','逾期61–90天','逾期超過90天'][i],v:v*1000,c:'q'+i})).filter(p=>p.v>0)})),
    keys:[{label:'未到期',c:'q0'},{label:'逾期1–30',c:'q1'},{label:'31–60',c:'q2'},{label:'61–90',c:'q3'},{label:'90+',c:'q4'}]}),
  caption:'灰色是尚未到期的錢。紅色越深，錢收得越晚。阿聯經銷商那根長條全是深色：那是最可能收不回來的帳款。'});

put('m10','ops',{at:1,after:'Measure Formula'},{title:'訂單先動，銷貨隨後',
  draw:V.line({label:'訂單在3月達到高峰並從4月起下滑；銷貨在5月達到高峰，之後下滑。',x:['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],fmt:k$,dots:true,
    series:[{name:'收到的訂單',v:[100,103,104,101,96,93,91,88,87,86,88,90].map(x=>x*1000),c:'s2'},{name:'已出貨的銷貨',v:[94,96,98,100,103,102,99,97,95,92,90,89].map(x=>x*1000),c:'s1'}],
    vmarks:[{i:4,label:'訂單低於銷貨'}]}),
  caption:'從5月起，訂單（橘色）低於銷貨（藍色）：訂單出貨比低於1.0。兩個月後，銷貨也開始下滑。觀察訂單，能讓你提早得到警訊。'});

/* =================================================================== MODULE 11 */
put('m11','good',{at:1,after:'Mix leading and lagging'},{title:'一個問題如何從領先指標傳到落後指標',
  draw:V.flow({label:'報廢率上升，接著出現數量差異，然後毛利率下降，最後利潤未達預算。',labels:['幾週後','進入月報','累積成'],
    nodes:[{t:'報廢率上升',s:'每週在現場看到',cls:'hl'},{t:'數量差異',s:'月底差異報告'},{t:'毛利率下降',s:'每月損益表'},{t:'利潤未達預算',s:'季度與年度',cls:'bad'}]}),
  caption:'同一個問題出現了四次。在第一個方框（領先指標）就採取行動，你就永遠不會看到最後一個（落後指標）。'});

put('m11','roce',{at:2,after:'Three levers behind ROE'},{title:'杜邦分析樹',
  draw:function(w){
    const gap=w<480?18:30, cw=Math.min(210,(w-2*gap)/3), rw=Math.min(280,w-20), x0=(w-(3*cw+2*gap))/2;
    const R=nodeLines(rw,'權益報酬率 11.3%','本期淨利 ÷ 權益'), C=[['淨利率 4.6%','本期淨利 ÷ 營業收入','價格與成本'],['資產週轉率 1.42×','營業收入 ÷ 資產總額','減少存貨、 加快收款'],['財務槓桿 1.72×','資產總額 ÷ 權益','更多負債、 更多風險']];
    const Ls=C.map(c=>nodeLines(cw,c[0],c[1])), ch=Math.max(...Ls.map(l=>l.h)), cy=R.h+46;
    let g=node((w-rw)/2,4,rw,R.h,R,'hl');
    C.forEach((c,i)=>{ const x=x0+i*(cw+gap), mx=x+cw/2; g+=`<path d="M${f(w/2)},${f(R.h+4)} V${f(R.h+24)} H${f(mx)} V${f(cy-3)}" class="v-edge"/>`+node(x,cy,cw,ch,Ls[i]);
      g+=lines(mx,cy+ch+18,['著力點：'].concat(wrap(c[2],Math.floor(cw/6.3))),'v-s','middle',14); if(i<2) g+=txt(x+cw+gap/2,cy+ch/2+7,'×','v-big'); });
    return svg(w,cy+ch+64,'權益報酬率等於淨利率乘以資產週轉率再乘以財務槓桿。',g);
  },
  caption:'把三個方框相乘，就得到權益報酬率：4.6% × 1.42 × 1.72 = 11.3%。每個方框都是不同的著力點，由不同的人負責。'});

/* =================================================================== MODULE 12 */
put('m12','behave',{at:1,after:'Fixed or variable for BraceWorks'},{title:'兩種成本如何變動',
  draw:function(w){
    const two=w>=620, cw=two?(w-20)/2:w;
    const a=V.line({label:'固定成本維持在$502,000，變動成本則隨數量上升。',x:['0%','25%','50%','75%','100%','125%','150%'],fmt:k$,h:200,table:false,yMin:0,
      series:[{name:'總成本',v:[502,658,814,970,1126,1282,1438].map(x=>x*1000),c:'ink'},{name:'變動成本',v:[0,156,312,468,624,780,936].map(x=>x*1000),c:'s1'},{name:'固定成本',v:[502,502,502,502,502,502,502].map(x=>x*1000),c:'s2',dash:true}]})(cw);
    const b=V.line({label:'每單位固定成本隨數量增加從$87降到$15；每單位變動成本維持在$27。',x:['25%','50%','75%','100%','125%','150%'],fmt:x=>'$'+Math.round(x),tfmt:x=>money(x,2),h:200,table:false,yMin:0,
      series:[{name:'每單位固定成本',short:'單位固定',v:[87.30,43.65,29.10,21.83,17.46,14.55],c:'s2',dash:true},{name:'每單位變動成本',short:'單位變動',v:[27.13,27.13,27.13,27.13,27.13,27.13],c:'s1'}]})(cw);
    return `<div style="display:grid;grid-template-columns:${two?'1fr 1fr':'1fr'};gap:18px"><div><div class="eyebrow" style="margin-bottom:4px">總成本（依數量）</div>${a}</div><div><div class="eyebrow" style="margin-bottom:4px">單位成本（依數量）</div>${b}</div></div><p class="w-hint" style="margin-top:6px">數量以目前數量的%表示（100% = 每年23,000單位）。</p>`;
  },
  caption:'左圖：固定成本是一條水平線；變動成本隨每個單位攀升。右圖：同樣的固定成本分攤到更多單位，讓每單位更便宜。這就是數量有幫助的原因，也是閒置產能如此誘人、讓人想填滿的原因。'});

put('m12','behave',{at:6,after:'Contribution: the most useful number'},{title:'填滿固定成本的水桶',
  render:function(el,ctx){
    const S=[78,84,102,96,98,104,88,92,112,108,124,114], M=['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'], FIX=502;
    const cum=[]; S.reduce((a,v,i)=>(cum[i]=a+v*0.48),0);
    let mo=12, timer=null;
    el.innerHTML=`<div class="bucket-wrap"><div data-svg></div><div style="display:grid;gap:10px;min-width:0"><div data-txt></div>
      <div class="ctrl"><label for="${ctx.uid('m')}"><span>月份</span><output></output></label><input type="range" id="${ctx.uid('m')}" min="0" max="12" step="1" value="12"></div>
      <div class="row"><button type="button" class="btn small" data-play>播放全年 ▶</button></div></div></div>`;
    const sv=el.querySelector('[data-svg]'), tx=el.querySelector('[data-txt]'), rng=el.querySelector('input'), out=el.querySelector('output'), pb=el.querySelector('[data-play]');
    const draw=()=>{ const c=mo?cum[mo-1]:0, inB=Math.min(c,FIX), over=Math.max(0,c-FIX);
      const W=200, Hb=210, top=50, bw1=150, bw2=118, cx=W/2, y0=top, y1=top+Hb, lvl=y1-inB/FIX*Hb;
      const lerp=y=>bw2+(bw1-bw2)*((y1-y)/Hb), wl=lerp(lvl);
      let g=`<polygon points="${f(cx-wl/2)},${f(lvl)} ${f(cx+wl/2)},${f(lvl)} ${f(cx+bw2/2)},${f(y1)} ${f(cx-bw2/2)},${f(y1)}" class="v-f-s1" opacity=".9"/>`;
      if(over>0){ const oh=over/FIX*Hb; g+=`<rect x="${f(cx-bw1/2+4)}" y="${f(y0-oh)}" width="${f(bw1-8)}" height="${f(oh)}" rx="6" class="v-f-good"/>`+txt(cx,y0-oh-6,'利潤 '+money(Math.round(over)*1000),'v-val'); }
      g+=`<path d="M${f(cx-bw1/2)},${f(y0)} L${f(cx-bw2/2)},${f(y1)} L${f(cx+bw2/2)},${f(y1)} L${f(cx+bw1/2)},${f(y0)}" class="v-edge" style="stroke:var(--ink);stroke-width:3"/>`;
      g+=`<line x1="${f(cx-bw1/2-8)}" x2="${f(cx+bw1/2+8)}" y1="${y0}" y2="${y0}" class="v-ref"/>`+txt(cx,y1+20,'固定成本：$502k','v-l');
      sv.innerHTML=svg(W,y1+28,`截至${mo?M[mo-1]:'年初'}的邊際貢獻：已涵蓋$502,000固定成本中的${money(Math.round(c)*1000)}。`,g);
      out.textContent=mo?M[mo-1]:'年初';
      tx.innerHTML=mo===0?'<p style="margin:0">每年開始時，水桶是空的：有<strong>$502,000</strong>的固定成本要涵蓋。</p>':
        `<div class="stats">${ctx.ui.stat('目前累計邊際貢獻',money(Math.round(c)*1000))}${c<FIX?ctx.ui.stat('尚待涵蓋的固定成本',money(Math.round(FIX-c)*1000),'warn'):ctx.ui.stat('目前累計利潤',money(Math.round(c-FIX)*1000),'good')}</div>
        <p class="w-hint" style="margin:8px 0 0">${c<FIX?`每個月的銷貨，每一塊錢有48分流進水桶。${M[mo-1]}倒進了${money(Math.round(S[mo-1]*0.48)*1000)}。`:mo===11?'11月：水桶滿出來了。全年的固定成本都已涵蓋，從現在起，每一塊錢的邊際貢獻都是利潤。':'溢出水桶的部分都是利潤。光是12月的邊際貢獻，就占了全年利潤的大半。'}</p>`; };
    const stop=()=>{ if(timer){ clearInterval(timer); timer=null; } pb.textContent='播放全年 ▶'; };
    rng.oninput=()=>{ stop(); mo=+rng.value; draw(); };
    pb.onclick=()=>{ if(timer){ stop(); return; } mo=0; rng.value='0'; draw(); pb.textContent='暫停 ❚❚'; timer=setInterval(()=>{ if(!el.isConnected||mo>=12){ stop(); return; } mo++; rng.value=String(mo); draw(); },750); };
    draw();
  },
  caption:'BraceWorks要到11月、全年固定成本都涵蓋之後，才開始賺錢。這就是為什麼一個淡季的打擊這麼大：水桶要更晚才會滿。'});

put('m12','behave',{at:5,after:'Production labour is a mixed cost'},{title:'把生產人工拆成固定與變動兩部分',
  render:function(box){
    const R=1200000, VC0=624000, FC0=502000, LAB=152000, PBT=74000;
    const $=n=>'$'+Math.round(n).toLocaleString('en-US'), pc=x=>(x*100).toFixed(1)+'%';
    box.innerHTML=`<div class="spl-ctl"><label for="splr">加班與派遣人員（$152,000中的一部分）</label><input id="splr" type="range" min="0" max="60000" step="2000" value="18000"><b class="spl-v"></b></div>
      <div class="spl-bar" aria-hidden="true"><span class="fx"></span><span class="vr"></span></div><div class="spl-leg small"><span><i class="fx"></i>固定：領月薪的核心團隊</span><span><i class="vr"></i>變動：加班與派遣人員</span></div>
      <table class="spl-t"><thead><tr><th></th><th>人工全部視為固定</th><th>拆分後</th></tr></thead><tbody></tbody></table><div class="spl-say"></div>`;
    const r=box.querySelector('input'), tb=box.querySelector('tbody');
    function draw(){
      const v=+r.value, vc=VC0+v, fc=FC0-v, cm=(R-vc)/R, cm0=(R-VC0)/R, be=fc/cm, be0=FC0/cm0, ol=(R-vc)/PBT, ol0=(R-VC0)/PBT;
      box.querySelector('.spl-v').textContent=$(v)+' ('+Math.round(v/LAB*100)+'%)';
      box.querySelector('.spl-bar .fx').style.width=((LAB-v)/LAB*100)+'%'; box.querySelector('.spl-bar .vr').style.width=(v/LAB*100)+'%';
      const row=(l,a,b,d)=>`<tr${d?' class="d"':''}><td>${l}</td><td>${a}</td><td>${b}</td></tr>`;
      tb.innerHTML=row('變動成本',$(VC0),$(vc))+row('固定成本',$(FC0),$(fc))+row('邊際貢獻率',pc(cm0),pc(cm),1)+row('損益兩平銷貨額',$(be0),$(be),1)+row('安全邊際',pc((R-be0)/R),pc((R-be)/R))+row('稅前淨利',$(PBT),$(PBT))+row('營收下滑10%時的利潤減少',$(0.1*(R-VC0)),$(0.1*(R-vc)),1);
      box.querySelector('.spl-say').innerHTML=v===0?'<p>拖動滑桿，把一部分生產人工移到變動成本。</p>':
        `<p><strong>今天的利潤不變</strong>：同樣是$${(LAB/1000).toFixed(0)}k的工資，只是分類方式不同。<strong>損益兩平點幾乎不動</strong>（${$(be0)} → ${$(be)}），因為邊際貢獻率下降的幅度，與固定成本下降的幅度差不多。</p>
         <p>拆分真正改變的是<strong>成本如何隨數量變動</strong>。景氣下滑時，你可以停止加班、遣回派遣人員，所以營收下滑10%只會讓利潤減少${$(0.1*(R-vc))}，而不是${$(0.1*(R-VC0))}。而面對一筆大額追加訂單，每多一個單位就多一份人工成本：這就是第13單元把加班費加進特殊訂單成本的原因。變動部分的占比越大，這一點就越重要。</p>`;
    }
    r.oninput=draw; draw();
  },
  caption:'經驗法則：如果一項成本真的會隨下個月的數量而變，就把它視為變動成本。正職員工的月薪通常不會；加班、派遣人員、計件工資和日薪工人則會。'});

put('m12','raise',{at:1,after:'Price rise Volume you can lose'},{title:'漲價有寬容空間，降價會受懲罰',
  draw:V.line({label:'維持利潤不變所需的數量變動：降價10%需增加26%，漲價10%則可減少17%。',x:['−10%','−8%','−6%','−4%','−2%','0%','+2%','+4%','+6%','+8%','+10%'],xName:'價格變動',fmt:pc0,tfmt:x=>(x>0?'+':'')+x.toFixed(1)+'%',zero:true,dots:true,endLabels:false,
    series:[{name:'維持相同利潤所需的數量變動',v:[26.3,20.0,14.3,9.1,4.3,0,-4.0,-7.7,-11.1,-14.3,-17.2],c:'s1'}],
    marks:[{i:0,label:'降價10%：需多賣26%',anchor:'start',dx:6,dy:-10},{i:10,label:'漲價10%：可少賣17%',anchor:'end',dx:-8,dy:-12}]}),
  caption:'邊際貢獻率為48%時，這條曲線並不對稱。降價所需的額外數量，遠多於漲價後所能承受流失的數量。'});

/* =================================================================== MODULE 13 */
put('m13','rel',{at:1,after:'Sunk costs'},{title:'這項成本攸關嗎？三個問題',
  draw:function(w){
    const qw=Math.min(250,w*0.5), ow=Math.min(190,w-qw-56), x0=Math.max(6,(w-(qw+50+ow))/2), ox=x0+qw+50;
    const Q=[['成本會在未來發生嗎？','沉沒成本：忽略','bad'],['各方案之間有差異嗎？','兩案都一樣：忽略','bad']];
    let y=4, g='';
    Q.forEach((qq,i)=>{ const L=nodeLines(qw,qq[0]), Lo=nodeLines(ow,qq[1]), h=Math.max(L.h,Lo.h);
      g+=node(x0,y,qw,h,L,'alt')+arrow(x0+qw+3,y+h/2,ox-3,y+h/2)+txt(x0+qw+25,y+h/2-6,'否','v-l')+node(ox,y,ow,h,Lo,qq[2]);
      g+=arrow(x0+qw/2,y+h+3,x0+qw/2,y+h+37)+txt(x0+qw/2+8,y+h+24,'是','v-l','start'); y+=h+40; });
    const L=nodeLines(qw,'攸關：納入','放進比較中'); g+=node(x0,y,qw,L.h,L,'good');
    return svg(w,y+L.h+6,'如果一項成本不是未來的成本，或無論選哪個方案都一樣，就忽略它。否則它就是攸關成本。',g);
  },
  caption:'把每一項成本都過一遍這些問題。已經花掉的錢，以及無論如何都不變的成本，都不屬於這個決策。'});

put('m13','bottle',{at:0,after:'When demand exceeds capacity'},{title:'最窄的那一步決定速度',
  draw:function(w){
    const D=[['泡棉裁切',920],['套子縫製',640],['組裝',860],['品保與放行',980],['包裝',1050]], DEM=720, MAX=1100;
    const lw=Math.min(130,w*0.32), bw=w-lw-60, rh=34, top=22; let g='';
    const X=v=>lw+v/MAX*bw;
    D.forEach((d,i)=>{ const y=top+i*rh, bot=d[1]<DEM; g+=txt(lw-8,y+20,d[0],'v-s','end')+`<rect x="${lw}" y="${y+6}" width="${f(X(d[1])-lw)}" height="${rh-12}" rx="4" class="v-f-${bot?'red':'muted'}" data-tip="${d[0]}|每週${d[1]}單位${bot?' · 瓶頸':''}"/>`+txt(X(d[1])+6,y+21,String(d[1]),'v-val','start'); });
    g+=`<line x1="${f(X(DEM))}" x2="${f(X(DEM))}" y1="${top-8}" y2="${f(top+D.length*rh)}" class="v-ref bad"/>`+txt(X(DEM),12,'訂單：每週720','v-l');
    return svg(w,top+D.length*rh+6,'各製程每週產能：只有縫製的640低於720的需求。',g);
  },
  caption:'其他每個製程都能每週處理720單位。縫製只能做640，所以整個工廠只出得了640。在其他地方省下一小時毫無改變；在縫製多出一小時，就等於多出整整一小時的產出。'});

/* =================================================================== MODULE 14 */
put('m14','tvm',{at:1,after:'$22,300 received in'},{title:'同樣的現金，價值逐漸縮水',
  draw:V.vbars({label:'裁切機每年帶來$22,300；以10%折現，第1年的價值為$20,273，到第8年降至$10,403。',x:['第1年','第2年','第3年','第4年','第5年','第6年','第7年','第8年'],xName:'年度',fmt:k$,tfmt:x=>money(Math.round(x)),
    series:[{name:'收到的現金',v:Array(8).fill(22300),c:'muted'},{name:'以10%折現的今日價值',v:[20273,18430,16754,15231,13847,12588,11443,10403],c:'s1'}]}),
  caption:'灰色長條每年都一樣。藍色長條顯示每年的現金在今天值多少。到了第8年，$22,300的價值還不到它的一半。'});

put('m14','methods',{at:2,after:'In plain words'},{title:'淨現值曲線：內部報酬率從何而來',
  draw:(function(){ const rates=[]; for(let r=0;r<=50;r+=2) rates.push(r); const fl=[-60000,22300,22300,22300,22300,22300,22300,22300,27300];
    const npv=r=>fl.reduce((s,c,t)=>s+c/Math.pow(1+r/100,t),0);
    return V.line({label:'布料裁切機的淨現值隨折現率上升而下降，從0%時的$123,400降到33.8%時的零，也就是內部報酬率。',x:rates.map(r=>r+'%'),xName:'折現率',fmt:k$,tfmt:x=>money(Math.round(x)),zero:true,endLabels:false,xw:42,
      series:[{name:'布料裁切機的淨現值',v:rates.map(r=>Math.round(npv(r))),c:'s1'}],
      vmarks:[{i:33.83/2,label:'IRR 33.8%'}],marks:[{i:5,label:'在10%時：+$61.3k',anchor:'start',dx:8,dy:-8}]}); })(),
  caption:'每個點是裁切機在不同必要報酬率下的淨現值。曲線穿過零的地方就是內部報酬率：這個專案所能提供的最高報酬。BraceWorks要求的是10%，遠在曲線左側，所以這個專案輕鬆過關。'});

/* =================================================================== MODULE 15 */
put('m15','why',{at:1,after:'Step Budget Built from'},{title:'預算，依編製順序排列',
  draw:V.flow({label:'先是銷貨，接著是生產、材料、人工、間接費用、資本支出、損益表，最後是現金與資產負債表。',
    nodes:[{t:'1. 銷貨',s:'數量與價格',cls:'hl'},{t:'2. 生產',s:'銷貨 ± 存貨變動'},{t:'3. 材料',s:'生產量 × 物料清單'},{t:'4. 人工',s:'生產量 × 製程途程'},{t:'5. 間接費用',s:'逐項編列'},{t:'6. 資本支出',s:'已核准專案'},{t:'7. 損益表',s:'以上全部'},{t:'8. 現金與 資產負債表',s:'付款條件、 存貨、借款',cls:'good'}]}),
  caption:'每個方框都需要前一個。銷貨估錯了，後面的每個數字也都會錯，這就是為什麼銷貨預算最值得嚴格挑戰。'});

put('m15','flex',{at:4,after:'Two very different stories'},{title:'拆解$7,600的差距',
  html:UI.bridge([{label:'原始預算利潤',v:7800,total:true},{label:'數量較低（銷售問題）',v:-5400},{label:'彈性預算利潤',v:2400,total:true},{label:'支出與效率（成本問題）',v:-2200},{label:'實際利潤',v:200,total:true}]),
  caption:'中間的彈性預算才是公平的量尺：以實際賣出的數量來看，利潤本應是多少。'});

put('m15','fcst',{at:2,after:'Three scenarios, not one number'},{title:'明年的三種版本',
  draw:V.line({label:'基本、下檔與上檔情境下的每月銷貨。',x:['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],fmt:k$,
    series:[{name:'上檔：澳洲合約自7月起',short:'上檔',v:[78,84,102,96,98,104,124,128,148,144,160,150].map(x=>x*1000),c:'s3'},{name:'基本情境',short:'基本',v:[78,84,102,96,98,104,88,92,112,108,124,114].map(x=>x*1000),c:'s1'},{name:'下檔：最大客戶削減訂單',short:'下檔',v:[78,84,102,84.5,86.2,91.5,77.4,81,98.6,95,109.1,100.3].map(x=>x*1000),c:'s2'}]}),
  caption:'同樣的第一季，三種不同的年度。每條線都需要自己的計畫：上檔需要產能和現金；下檔需要啟動成本削減的觸發條件。'});

swap('m15','case',{at:1,n:'The hockey stick'},{title:'曲棍球桿',
  draw:V.line({label:'預算銷貨在第4季跳升至$570k；實際銷貨只達到$330k。',x:['Q1','Q2','Q3','Q4'],fmt:k$,dots:true,yMin:0,
    series:[{name:'預算',v:[300,310,320,570].map(x=>x*1000),c:'muted',dash:true},{name:'實際',v:[296,262,270,330].map(x=>x*1000),c:'s2'}]}),
  caption:'九個月持平，然後因為一筆還沒簽約的交易而暴增。成本照著虛線投入；銷貨卻照著實線走。'});

/* =================================================================== MODULE 16 */
put('m16','ccc',{at:0,after:'From the day BraceWorks pays for foam'},{title:'現金循環，持續轉動',
  draw:V.cycle({label:'現金用來支付供應商，變成存貨106天，再變成應收帳款70天，然後再變回現金。',
    nodes:[{t:'銀行裡的現金'},{t:'支付供應商',s:'交貨後63天'},{t:'存貨',s:'在架上106天'},{t:'出貨並開立發票',s:'客戶欠我們錢'},{t:'客戶付款',s:'70天後'}],
    center:{big:'113天',sub:'106 + 70 − 63'}}),
  caption:'那個圓點是BraceWorks的一塊錢現金。循環每縮短一天，就有現金回到銀行：應收帳款每縮短一天，約$3,300。'});

/* =================================================================== MODULE 17 */
put('m17','fx',{at:0,after:'BraceWorks keeps its books in US dollars'},{title:'歐元下跌的60天',
  draw:V.line({label:'在開立發票到收款的60天內，歐元從$1.100跌到$1.060。',x:['第0天','5','10','15','20','25','30','35','40','45','50','55','第60天'],fmt:x=>'$'+x.toFixed(2),tfmt:x=>'$'+x.toFixed(3),yMin:1.04,yMax:1.11,endLabels:false,
    series:[{name:'每歐元兌美元',v:[1.100,1.097,1.094,1.091,1.088,1.085,1.082,1.078,1.074,1.071,1.067,1.063,1.060],c:'s1'}],
    marks:[{i:0,label:'開立發票：$44,000',anchor:'start',dx:6,dy:-10},{i:12,label:'收款：$42,400',anchor:'end',dx:-6,dy:18}]}),
  caption:'訂單和客戶都沒出任何問題。只是等到錢入帳時，歐元能換到的美元變少了。€40,000的貨款，這一跌就損失了$1,600。'});

put('m17','inco',{at:1,after:'Risk passes to buyer'},{title:'誰付錢，風險在哪裡移轉',scroll:true,
  draw:function(w){
    const W=Math.max(w,640), stages=['工廠包裝','出口報關','交付運送人','裝船','海運及保險','目的港','進口稅與通關','送達買方'];
    const R=[['EXW',[0],1,'在工廠'],['FCA',[0,1,2],3,'交給運送人時'],['FOB',[0,1,2,3],4,'貨物裝上船時'],['CIF',[0,1,2,3,4,5],4,'在出口港裝船時'],['DAP',[0,1,2,3,4,5,7],8,'抵達買方指定地點時'],['DDP',[0,1,2,3,4,5,6,7],8,'抵達買方指定地點時']];
    const lw=56, cw=(W-lw-6)/8, hh=54, rh=34; let g='';
    stages.forEach((s,i)=>{ g+=lines(lw+i*cw+cw/2,14,wrap(s,Math.floor(cw/6.2)),'v-ax','middle',12); });
    R.forEach((r,j)=>{ const y=hh+j*rh; g+=txt(lw-10,y+21,r[0],'v-t','end');
      for(let i=0;i<8;i++){ const s=r[1].includes(i); g+=`<rect x="${f(lw+i*cw+1)}" y="${y+5}" width="${f(cw-2)}" height="${rh-10}" rx="3" class="v-f-${s?'s1':'q0'}" data-tip="${r[0]} · ${stages[i]}|${s?'BraceWorks付費':'買方付費'}|風險移轉：${r[3]}"/>`; }
      const rx=lw+r[2]*cw; g+=`<line x1="${f(rx)}" x2="${f(rx)}" y1="${y+1}" y2="${y+rh-1}" style="stroke:var(--red);stroke-width:3"/><polygon points="${f(rx-6)},${y+1} ${f(rx+6)},${y+1} ${f(rx)},${y+9}" class="v-f-red"/>`; });
    return `<div class="v-legend"><span><i class="sq" style="background:var(--s1)"></i>BraceWorks付費</span><span><i class="sq" style="background:var(--q0)"></i>買方付費</span><span><i style="background:var(--red);width:4px;height:14px"></i>風險移轉給買方</span></div>`+svg(W,hh+R.length*rh+6,'在各國貿條規下，BraceWorks負擔哪些交貨階段的費用，以及風險在何處移轉給買方。',g);
  },
  caption:'橫向閱讀每一列：藍色是BraceWorks付費的部分，紅線是風險移轉的地方。注意CIF：BraceWorks一路付費到目的港，但風險早在出口港就已移轉給買方。用手機看時，請橫向捲動圖表。'});

put('m17','pay',{at:1,after:'Risk to BraceWorks'},{title:'從對你最安全，到對買方最方便',
  draw:function(w){
    const M=['預付貨款','信用狀','記帳交易＋信用保險','跟單託收','記帳交易'];
    let g='';
    if(w>=560){ const x0=50, x1=w-50, y=70, st=(x1-x0)/(M.length-1);
      g+=arrow((x0+x1)/2,y,x0-30,y,{cls:'acc'})+arrow((x0+x1)/2,y,x1+30,y);
      M.forEach((m,i)=>{ const x=x0+i*st, up=i%2===0; g+=`<circle cx="${f(x)}" cy="${y}" r="7" class="v-f-${i===0?'acc':i===M.length-1?'red':'s1'}"/>`+lines(x,up?y-30:y+26,wrap(m,16),'v-s','middle',13); });
      g+=txt(x0-30,y+66,'對BraceWorks較安全','v-l','start')+txt(x1+30,y+66,'對買方較方便','v-l','end');
      return svg(w,148,'付款方式排序：從對出口商最安全的預付貨款，到對買方最方便的記帳交易。',g); }
    const x=26, y0=30, st=52; g+=txt(x-10,14,'對BraceWorks較安全','v-l','start')+arrow(x,y0+((M.length-1)*st)/2,x,y0-8,{cls:'acc'})+arrow(x,y0+((M.length-1)*st)/2,x,y0+(M.length-1)*st+10);
    M.forEach((m,i)=>{ const y=y0+i*st; g+=`<circle cx="${x}" cy="${f(y)}" r="7" class="v-f-${i===0?'acc':i===M.length-1?'red':'s1'}"/>`+txt(x+18,y+5,m,'v-s','start'); });
    g+=txt(x-10,y0+(M.length-1)*st+30,'對買方較方便','v-l','start');
    return svg(w,y0+(M.length-1)*st+38,'付款方式排序：從對出口商最安全的預付貨款，到對買方最方便的記帳交易。',g);
  },
  caption:'從預付貨款往記帳交易每走一步，買方就更滿意，BraceWorks也有更多的錢暴露在風險中。依照你對這位客戶的了解程度，在這條線上選擇適合的位置。'});

put('m17','pay',{at:3,after:'How a letter of credit works'},{title:'信用狀，一步一步來',
  intro:'四方、八個步驟。按<strong>播放</strong>，看看銀行如何站在BraceWorks與買方之間。',
  steps:[
    {k:['ex','im','e1'],t:'BraceWorks與買方談定交易，以<strong>信用狀</strong>付款。'},
    {k:['im','imb','e2'],t:'買方向<strong>自己的銀行</strong>申請開立信用狀。'},
    {k:['imb','exb','e3'],t:'買方的銀行<strong>開出信用狀</strong>，並寄給BraceWorks的銀行。從這一刻起，開狀銀行已承諾付款。'},
    {k:['exb','ex','e4'],t:'BraceWorks的銀行<strong>把信用狀轉交給BraceWorks</strong>。趁出貨之前，現在就逐一檢查每項條件。'},
    {k:['ex','im','e5'],t:'BraceWorks<strong>出貨</strong>，並備齊單據：商業發票、提單、裝箱單、原產地證明。'},
    {k:['ex','exb','e6'],t:'BraceWorks在期限之前<strong>向自己的銀行提示單據</strong>。'},
    {k:['exb','imb','e7'],t:'單據送到買方的銀行。如果與信用狀<strong>完全相符</strong>，銀行就付款。一個拼字錯誤就可能讓付款卡住。'},
    {k:['imb','im','e8'],t:'買方付款給自己的銀行並取得單據，這是它到港口<strong>提領貨物</strong>所需要的。'}],
  draw:function(w){
    const bw=Math.min(180,(w-100)/2), lx=10, rx=w-10-bw;
    const N=[['exb','BraceWorks的銀行','通知銀行',lx,0],['imb','買方的銀行','開狀銀行',rx,0],['ex','BraceWorks','出口商',lx,1],['im','買方','進口商',rx,1]];
    const Ls=N.map(n=>nodeLines(bw,n[1],n[2])), bh=Math.max(...Ls.map(l=>l.h)), ty=8, by=ty+bh+120;
    let g=''; const lcx=lx+bw/2, rcx=rx+bw/2, xa=lx+bw+3, xb=rx-3, mid=(xa+xb)/2;
    const E=[
      ['e1',arrow(xa,by+bh/2-12,xb,by+bh/2-12),mid,by+bh/2-12],
      ['e5',arrow(xa,by+bh/2+14,xb,by+bh/2+14,{dash:true}),mid,by+bh/2+14],
      ['e2',arrow(rcx+18,by-3,rcx+18,ty+bh+3),rcx+18,(ty+bh+by)/2+18],
      ['e8',arrow(rcx-18,ty+bh+3,rcx-18,by-3),rcx-18,(ty+bh+by)/2-18],
      ['e3',arrow(xb,ty+bh/2-12,xa,ty+bh/2-12),mid,ty+bh/2-12],
      ['e7',arrow(xa,ty+bh/2+14,xb,ty+bh/2+14),mid,ty+bh/2+14],
      ['e4',arrow(lcx-18,ty+bh+3,lcx-18,by-3),lcx-18,(ty+bh+by)/2-18],
      ['e6',arrow(lcx+18,by-3,lcx+18,ty+bh+3),lcx+18,(ty+bh+by)/2+18]];
    E.forEach(e=>{ g+=`<g data-k="${e[0]}">${e[1]}${badge(e[2],e[3],e[0].slice(1))}</g>`; });
    N.forEach((n,i)=>{ g+=`<g data-k="${n[0]}">${node(n[3],n[4]?by:ty,bw,bh,Ls[i],n[4]?'hl':'alt')}</g>`; });
    if(w>=520) g+=txt(mid,by+bh/2+34,'貨物','v-l')+txt(mid,ty+bh/2-28,'信用狀','v-l');
    return svg(w,by+bh+10,'信用狀：買方向自己的銀行申請，開狀銀行透過出口商的銀行開出信用狀；出口商出貨並提示單據；兩家銀行以單據交換付款。',g);
  },
  caption:'箭頭上的數字對應步驟編號。虛線箭頭是貨物；其他都是在銀行之間流動的文件和金錢。'});

/* =================================================================== MODULE 18 */
put('m18','fraud',{at:0,after:'Most people are honest'},{title:'舞弊三角',
  draw:function(w){
    const s=Math.min(w-150,330), cx=w/2, top=34, hgt=s*0.86, A=[cx,top], B=[cx-s/2,top+hgt], C=[cx+s/2,top+hgt];
    let g=`<polygon points="${A.join(',')} ${B.map(f).join(',')} ${C.map(f).join(',')}" class="v-node alt" style="stroke-width:2"/>`+txt(cx,top+hgt*0.66,'舞弊','v-big');
    g+=`<circle cx="${f(A[0])}" cy="${f(A[1])}" r="9" class="v-f-muted"/>`+txt(cx,top-14,'壓力：債務、業績目標','v-s');
    g+=`<circle cx="${f(B[0])}" cy="${f(B[1])}" r="9" class="v-f-muted"/>`+lines(B[0],B[1]+26,['合理化','「我會還的」'],'v-s','middle',14);
    g+=`<circle cx="${f(C[0])}" cy="${f(C[1])}" r="13" class="v-f-acc v-pulse"/><circle cx="${f(C[0])}" cy="${f(C[1])}" r="9" class="v-f-acc"/>`+lines(C[0],C[1]+26,['機會','控制薄弱'],'v-t','middle',15);
    g+=lines(C[0],C[1]+60,['這一角你可以消除'],'v-l','middle',13);
    return svg(w,top+hgt+72,'舞弊需要壓力、合理化和機會；控制措施能消除機會。',g);
  },
  caption:'舞弊發生之前，三個角通常都已經湊齊。你看不到別人的生活，但可以用簡單的控制措施，封住「機會」這一角。'});

put('m18','controls',{at:1,after:'Process Who should do what Why'},{title:'一筆採購，四個不同的人',
  draw:V.flow({label:'生產部門提出請購，採購部門下單，倉庫收貨，財務部門比對，第二人核准，財務部門付款。',
    nodes:[{t:'請購材料',s:'生產部門'},{t:'開立採購單',s:'採購部門'},{t:'收貨與點數',s:'倉庫'},{t:'三方比對',s:'財務部門',cls:'hl'},{t:'核准付款批次',s:'總經理或 第二核准人',cls:'hl'},{t:'支付供應商',s:'財務部門， 透過銀行'}]}),
  caption:'沒有任何一個人能同時下單、驗收和付款。偽造一筆採購需要好幾個人串通，這就是為什麼它很少發生。'});

put('m18','controls',{at:3,after:'When you can\'t separate duties'},{title:'三方比對',
  draw:function(w){
    const gap=12, dw=Math.min(180,(w-2*gap)/3), x0=(w-(3*dw+2*gap))/2, D=[['採購單','我們訂了什麼'],['驗收單','實際到了什麼'],['供應商發票','向我們請款多少']];
    const Ls=D.map(d=>nodeLines(dw,d[0],d[1])), dh=Math.max(...Ls.map(l=>l.h)), qw=Math.min(240,w-40), qy=dh+44, Lq=nodeLines(qw,'三者都一致嗎？','數量、價格、供應商');
    let g=''; D.forEach((d,i)=>{ const x=x0+i*(dw+gap); g+=node(x,4,dw,dh,Ls[i],'alt')+arrow(x+dw/2,dh+7,w/2+(i-1)*qw*0.3,qy-3); });
    g+=node((w-qw)/2,qy,qw,Lq.h,Lq,'hl');
    const oy=qy+Lq.h+46, ow=Math.min(170,(w-40)/2), Lp=nodeLines(ow,'付款','在到期日'), Ln=nodeLines(ow,'提出疑問','先不要付款'), oh=Math.max(Lp.h,Ln.h);
    g+=arrow(w/2-20,qy+Lq.h+3,w/2-ow/2-10,oy-3)+txt(w/2-ow/2-16,qy+Lq.h+28,'是','v-l','end')+arrow(w/2+20,qy+Lq.h+3,w/2+ow/2+10,oy-3)+txt(w/2+ow/2+16,qy+Lq.h+28,'否','v-l','start');
    g+=node(w/2-ow-10,oy,ow,oh,Lp,'good')+node(w/2+10,oy,ow,oh,Ln,'bad');
    return svg(w,oy+oh+6,'比對採購單、驗收單和供應商發票；只有三者一致才付款。',g);
  },
  caption:'三份文件來自三個不同的人。如果它們不一致，就代表有東西沒訂、沒到，或請款錯誤，付款就要等。'});

put('m18','case',{at:0,after:'$18,400 gone'},{title:'那$18,400是怎麼流出去的，以及原本可以在哪裡攔下',
  draw:V.flow({label:'假冒的電子郵件要求變更銀行帳戶資料；未經回電確認就修改了紀錄；款項匯入詐騙者帳戶；三週後真正的供應商來催款。',labels:['未回電確認','下一次付款','3週後'],
    nodes:[{t:'假郵件：「我們換銀行了」',s:'只差一個字母',cls:'bad'},{t:'供應商資料被更新',s:'控制點： 此時應回電確認',cls:'warn'},{t:'已付款$18,400',s:'匯到詐騙者帳戶',cls:'bad'},{t:'真正的供應商來電',s:'「我們的錢呢？」'}]}),
  caption:'琥珀色方框就是關鍵：只要打一通兩分鐘的電話到檔案中既有的號碼，就能阻止這一切。'});


/* =================================================================== MODULE 19 */
put('m19','logic',{at:4,after:'The taxes that touch a manufacturer'},{title:'稅務在哪些地方影響BraceWorks',
  draw:function(w){
    const N=[['稅捐機關','所得稅、VAT、 薪資申報','hl'],['本地供應商','收取進項稅額； 部分付款需扣繳',''],['員工','工資的稅負 與社保提撥',''],['海外客戶','出口零稅率； 進口國另課稅',''],['海外服務供應商','境外付款 可能需扣繳','']];
    const nar=w<560, bw=nar?Math.min(150,(w-24)/2):Math.min(180,w*0.27), cw=Math.min(170,w*0.32);
    const Lc=nodeLines(cw,'BraceWorks','出口商暨製造商'), Ls=N.map(n=>nodeLines(bw,n[0],n[1])), bh=Math.max(...Ls.map(l=>l.h));
    let g='', H_;
    const edge=(cx,cy,hw,hh,dx,dy)=>{ const t=Math.min(dx?hw/Math.abs(dx):1e9, dy?hh/Math.abs(dy):1e9); return [cx+dx*t,cy+dy*t]; };
    if(!nar){ const cx=w/2, rx=w/2-bw/2-6, ry=bh+40, cy=ry+bh/2+6; H_=2*ry+bh+12;
      N.forEach((n,i)=>{ const a=-Math.PI/2+i*2*Math.PI/N.length, x=cx+rx*Math.cos(a), y=cy+ry*Math.sin(a), dx=x-cx, dy=y-cy;
        const s1=edge(cx,cy,cw/2+3,Lc.h/2+3,dx,dy), s2=edge(x,y,bw/2+3,bh/2+3,-dx,-dy);
        g+=`<line x1="${f(s1[0])}" y1="${f(s1[1])}" x2="${f(s2[0])}" y2="${f(s2[1])}" class="v-edge" stroke-dasharray="4 4"/>`+node(x-bw/2,y-bh/2,bw,bh,Ls[i],n[2]); });
      g+=node(cx-cw/2,cy-Lc.h/2,cw,Lc.h,Lc,'good');
    } else { const nw=w-34, L2=N.map(n=>nodeLines(nw,n[0],n[1])); g+=node(6,4,Math.min(220,w-12),Lc.h,Lc,'good'); let y=Lc.h+18; const sx=18, ys=[];
      N.forEach((n,i)=>{ g+=node(28,y,nw,L2[i].h,L2[i],n[2]); ys.push(y+L2[i].h/2); y+=L2[i].h+10; });
      g+=`<line x1="${sx}" y1="${f(Lc.h+4)}" x2="${sx}" y2="${f(ys[ys.length-1])}" class="v-edge" stroke-dasharray="4 4"/>`+ys.map(yy=>`<line x1="${sx}" y1="${f(yy)}" x2="26" y2="${f(yy)}" class="v-edge"/>`).join('');
      H_=y; }
    return svg(w,H_,'BraceWorks與五個群體往來，各自帶來不同的稅：稅捐機關、本地供應商、員工、海外客戶與海外服務供應商。',g);
  },
  caption:'每一種往來關係都有自己的稅。課程中大部分的會計技能都派得上用場：加值稅和扣繳稅款是要調節的資產負債表項目，薪資相關稅負是產品成本的一部分，所得稅則是要事先規劃的現金支出。'});

put('m19','vat',{at:0,after:'is charged at every stage of a sale'},{title:'沿著供應鏈追蹤加值稅',
  draw:V.flow({label:'泡棉供應商向BraceWorks收取加值稅，BraceWorks以0%稅率出口並申請退還；進口國向經銷商收取加值稅，最後由醫院負擔。',labels:['賣泡棉','出口','轉售'],
    nodes:[{t:'泡棉供應商',s:'向BraceWorks收 $1,000 + 12% VAT = $120'},{t:'BraceWorks',s:'出口適用0% VAT； 申請退還$120',cls:'hl'},{t:'德國經銷商',s:'繳德國進口VAT， 之後再申請退還'},{t:'德國醫院',s:'最終消費者： 負擔VAT',cls:'good'}]}),
  caption:'供應鏈中的每家企業都能拿回加值稅；只有最終消費者真正負擔。BraceWorks的難處在於時間差：它現在就要付出$120，然後等待退稅。'});

/* =================================================================== PRACTICE PACKS */
put('packB','dash',{at:1,after:'Revenue, March'},{title:'毛利率，最近12個月',
  draw:V.line({label:'過去12個月，毛利率從約28.6%逐步下滑到26.7%，低於30%的目標。',x:['4月','5月','6月','7月','8月','9月','10月','11月','12月','1月','2月','3月'],fmt:pc0,tfmt:pc1,dots:true,yMin:24,yMax:32,endLabels:false,
    series:[{name:'毛利率',v:[28.6,28.9,28.4,28.0,28.2,28.8,28.7,28.9,27.6,28.3,27.5,26.7],c:'s1'}],refs:[{v:30,label:'目標30%'}],marks:[{i:11,label:'26.7%',dy:16}]}),
  caption:'有了趨勢，3月的數字才有意義：毛利率整年都低於目標，而且現在還在下滑。'});

swap('packB','ops',{at:3,n:'13-week liquidity forecast'},{title:'13週流動性預測（現金＋未動用透支額度）',
  draw:V.line({label:'流動性維持在$56,000到$88,000之間，第6週最低。',x:Array.from({length:13},(_,i)=>'W'+(i+1)),xName:'週',fmt:k$,area:true,dots:true,yMin:0,endLabels:false,
    series:[{name:'流動性',v:[86,82,77,79,70,56,63,72,68,75,82,79,88].map(x=>x*1000),c:'s1'}],refs:[{v:30000,label:'最低$30k'}],marks:[{i:5,label:'$56k',dy:18}]}),
  caption:'最低點在第6週：每季稅款$6k加上薪資。假設美國經銷商A照常在第62天付款。'});

put('packC','dash',{at:1,after:'Revenue, July'},{title:'利潤上升，現金下降：1月到7月',
  draw:V.line({label:'累計稅後淨利升至$34,700，現金則從$38,000降到$10,500。',x:['1月','2月','3月','4月','5月','6月','7月'],fmt:k$,dots:true,yMin:0,
    series:[{name:'稅後淨利，本年累計',short:'利潤（YTD）',v:[3,7,11,16,21,27,34.7].map(x=>x*1000),c:'s3'},{name:'月底現金',short:'現金',v:[38,33,30,26,22,16,10.5].map(x=>x*1000),c:'s2'}]}),
  caption:'兩條線在5月交會，之後越拉越開。每個月，這家公司在損益表上看起來更好，在銀行裡卻更糟。'});

swap('packC','ar',{at:2,n:'13-week liquidity forecast'},{title:'13週流動性預測（現金＋未動用透支額度）',
  draw:V.line({label:'流動性在第2週和第4週轉為負數，最低到負$12,000，之後在第13週回升到$52,000。',x:Array.from({length:13},(_,i)=>'W'+(i+1)),xName:'週',fmt:k$,dots:true,zero:true,endLabels:false,
    series:[{name:'流動性',v:[9,-6,4,-12,3,18,26,14,31,40,33,46,52].map(x=>x*1000),c:'s2'}],refs:[{v:30000,label:'最低$30k'}],band:{lo:-15000,hi:0,label:'現金耗盡'},marks:[{i:3,label:'($12k)',dy:18},{i:1,label:'($6k)',dy:18}]}),
  caption:'第2週：薪資$12k。第4週：薪資$12k、泡棉供應商$18k、每季稅款$5k。假設沙烏地的$18k在第6週入帳，美國經銷商A在第11週支付$88k。'});
})();
