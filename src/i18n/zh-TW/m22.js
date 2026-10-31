/* ===== Module 23 (file m22): Building a three-statement forecast (core, Part 6) ===== */
(function(){
const {K,TIP,FLAG,CASE,REPORT,Q,FS,FLIP,SORT,CHECK,W,money,signed,pct,kfmt} = BW.h;

/* Opening balance sheet = BraceWorks at 31 December (Module 1). */
const OPEN={cash:42000,ar:230000,inv:250000,prepay:13000,ppe:310000,ap:95000,accr:30000,tax:8500,od:120000,lt:100000,cap:250000,re:241500};
const LAST={rev:1200000,cos:822000,sga:246000,ebitda:132000,dep:38000,ebit:94000,int:14000,fx:6000,pbt:74000,taxe:18500,np:55500};
const BASE={g:5,gm:31.5,inf:4,dso:70,dio:106,dpo:63,capex:60000,loan:0,div:0};
const LIMIT=150000, MINCASH=20000, RATE=0.064, MATERIALS=0.46;

function model(d,mistake){
  const R=LAST.rev*(1+d.g/100);
  const cos=R*(1-d.gm/100), sga=LAST.sga*(1+d.inf/100);
  const ebitda=R-cos-sga, dep=LAST.dep+d.capex/16;              /* new equipment: half a year of an 8-year life */
  const ebit=ebitda-dep, int=RATE*(OPEN.od+OPEN.lt+d.loan/2);     /* interest on opening debt keeps the model free of circular formulas */
  const pbt=ebit-int, taxe=Math.max(0,pbt)*0.25, np=pbt-taxe;
  const ar=R*d.dso/365, inv=(cos+dep)*d.dio/365, ap=R*MATERIALS*d.dpo/365;
  const ppe=OPEN.ppe+d.capex-dep, lt=OPEN.lt-20000+d.loan;
  const dAR=OPEN.ar-ar, dInv=OPEN.inv-inv, dAP=ap-OPEN.ap;
  const cfo=np+dep+dAR+(mistake?0:dInv)+dAP, fcf=cfo-d.capex;
  const pre=OPEN.cash+fcf-20000+d.loan-d.div;                       /* cash before the overdraft moves */
  let od, cash;
  if(pre<MINCASH){ od=OPEN.od+(MINCASH-pre); cash=MINCASH; } else { const rep=Math.min(OPEN.od,pre-MINCASH); od=OPEN.od-rep; cash=pre-rep; }
  const re=OPEN.re+np-d.div, eq=OPEN.cap+re;
  const assets=cash+ar+inv+OPEN.prepay+ppe, liab=ap+OPEN.accr+OPEN.tax+od+lt;
  return {R,cos,sga,ebitda,dep,ebit,int,pbt,taxe,np,ar,inv,ap,ppe,lt,dAR,dInv,dAP,cfo,fcf,od,cash,re,eq,assets,liab,check:Math.round(assets-liab-eq),
    netDebt:od+lt-cash, nde:(od+lt-cash)/Math.max(1,ebitda), headroom:LIMIT-od+cash, overLimit:od>LIMIT};
}
BW.m22model=model;
const r0=v=>Math.round(v);
const m$=v=>money(r0(v));

function statements(x){
  const row=(l,a,b,cls)=>`<tr class="${cls||''}"><td>${l}</td>${a===null?'<td></td>':`<td class="v">${m$(a)}</td>`}<td class="v">${m$(b)}</td></tr>`;
  const is=`<table class="fs fm"><caption>損益表</caption><thead><tr><th></th><th class="v">去年</th><th class="v">預測</th></tr></thead><tbody>
    ${row('營業收入',LAST.rev,x.R)}${row('銷貨成本（不含折舊）',-LAST.cos,-x.cos)}${row('推銷及管理費用',-LAST.sga,-x.sga)}${row('EBITDA',LAST.ebitda,x.ebitda,'sub')}
    ${row('折舊',-LAST.dep,-x.dep)}${row('營業利益',LAST.ebit,x.ebit,'sub')}${row('利息費用',-LAST.int,-x.int)}${row('外幣兌換損失',-LAST.fx,0)}${row('稅前淨利',LAST.pbt,x.pbt,'sub')}${row('所得稅（25%）',-LAST.taxe,-x.taxe)}${row('本期淨利',LAST.np,x.np,'tot lk-np')}</tbody></table>`;
  const bs=`<table class="fs fm"><caption>資產負債表（12月31日）</caption><thead><tr><th></th><th class="v">期初</th><th class="v">預測</th></tr></thead><tbody>
    ${row('現金',OPEN.cash,x.cash,'lk-cash')}${row('應收帳款',OPEN.ar,x.ar)}${row('存貨',OPEN.inv,x.inv)}${row('預付款項',OPEN.prepay,OPEN.prepay)}${row('設備淨額',OPEN.ppe,x.ppe)}${row('資產總計',845000,x.assets,'sub')}
    ${row('應付帳款',OPEN.ap,x.ap)}${row('應計費用',OPEN.accr,OPEN.accr)}${row('應付所得稅',OPEN.tax,OPEN.tax)}${row('透支（額度 $150,000）',OPEN.od,x.od,x.overLimit?'bad':'')}${row('設備貸款',OPEN.lt,x.lt)}
    ${row('股本',OPEN.cap,OPEN.cap)}${row('保留盈餘',OPEN.re,x.re,'lk-np')}${row('負債及權益總計',845000,x.liab+x.eq,'tot')}</tbody></table>`;
  const cf=`<table class="fs fm"><caption>現金流量表</caption><thead><tr><th></th><th class="v">預測</th></tr></thead><tbody>
    <tr class="lk-np"><td>本期淨利</td><td class="v">${m$(x.np)}</td></tr><tr><td>加回：折舊</td><td class="v">${m$(x.dep)}</td></tr>
    <tr><td>應收帳款（增加）／減少</td><td class="v">${m$(x.dAR)}</td></tr><tr class="${x.mistake?'bad':''}"><td>存貨（增加）／減少</td><td class="v">${x.mistake?'漏列':m$(x.dInv)}</td></tr><tr><td>應付帳款增加／（減少）</td><td class="v">${m$(x.dAP)}</td></tr>
    <tr class="sub"><td>營業活動現金流量</td><td class="v">${m$(x.cfo)}</td></tr><tr><td>購置設備</td><td class="v">${m$(-x.d.capex)}</td></tr><tr class="sub"><td>自由現金流量</td><td class="v">${m$(x.fcf)}</td></tr>
    <tr><td>償還貸款</td><td class="v">${m$(-20000)}</td></tr><tr><td>新增設備貸款</td><td class="v">${m$(x.d.loan)}</td></tr><tr><td>股利</td><td class="v">${m$(-x.d.div)}</td></tr><tr><td>透支動用／（償還）</td><td class="v">${m$(x.od-OPEN.od)}</td></tr>
    <tr class="sub"><td>現金增減</td><td class="v">${m$(x.cash-OPEN.cash)}</td></tr><tr><td>期初現金</td><td class="v">${m$(OPEN.cash)}</td></tr><tr class="tot lk-cash"><td>期末現金</td><td class="v">${m$(x.cash)}</td></tr></tbody></table>`;
  return {is,bs,cf};
}
const SL=[
  {k:'g',label:'營收成長率',min:-20,max:40,step:1,f:v=>(v>0?'+':'')+v+'%'},
  {k:'gm',label:'折舊前毛利率',min:25,max:38,step:0.5,f:v=>v.toFixed(1)+'%'},
  {k:'inf',label:'推銷及管理費用增幅',min:-5,max:15,step:1,f:v=>v+'%'},
  {k:'dso',label:'客戶付款天數',min:40,max:120,step:1,f:v=>v+'天'},
  {k:'dio',label:'存貨天數（以銷貨成本計）',min:50,max:160,step:1,f:v=>v+'天'},
  {k:'dpo',label:'我們付款給供應商的天數',min:20,max:90,step:1,f:v=>v+'天'},
  {k:'capex',label:'購置設備',min:0,max:200000,step:5000,f:v=>money(v)},
  {k:'loan',label:'新增設備貸款',min:0,max:150000,step:5000,f:v=>money(v)},
  {k:'div',label:'發放給股東的股利',min:0,max:80000,step:5000,f:v=>money(v)}
];
const PRESETS=[
  {label:'基本計畫',d:BASE},
  {label:'景氣下滑',d:{...BASE,g:-10,gm:29.5,dso:80}},
  {label:'大訂單、長付款條件',d:{...BASE,g:30,dso:95,dio:120}},
  {label:'用對的方式為機器籌資',d:{...BASE,capex:120000,loan:100000}}
];

BW.add({
  id:'m22', minutes:55,
  title:'建立三表預測模型',
  subtitle:'多數總經理最後都會需要的一項進階技能：一個把損益、資產負債表和現金串在一起的預測，讓你在拍板之前，就看到計畫會對銀行存款造成什麼影響。',
  goals:[
    '說明把損益表、資產負債表和現金流量表綁在一起的三個連結',
    '挑出驅動一家製造業預測的那幾個關鍵假設',
    '建立並解讀一個連動的預測，並用平衡檢查抓出錯誤',
    '對計畫做壓力測試，找出最先撐不住的是什麼：現金、透支額度，還是財務承諾條款',
    '讓模型保持誠實：輸入值獨立擺放、不手動填入結果、每月與實際數比較'
  ],
  sections:[
  {id:'why', label:'為什麼要連動', kind:'learn', title:'為什麼光有獲利預測還不夠', blocks:[
    `<p>大多數預算只做到損益表為止。它回答了「我們會不會賺錢？」，卻沒回答「我們會不會有現金？」，而第5單元已經示範過，一家有獲利的工廠如何把現金燒光。<strong>三表預測模型</strong>把三大財務報表放在一起、彼此連動地預測，所以其中一張變動，就會帶動另外兩張。</p>
     <p>銀行放款前會要一份，買方和投資人出錢前也會要一份。而且要誠實回答「我們能不能接澳洲那張合約？」或「我們能不能同時發股利又買新機器？」這類問題，這是唯一的方法。</p>`,
    {t:'fig', title:'三個連結', draw:function(w){
      const P=BW.viz.p, wide=w>=600; let g='';
      if(wide){ const bw=Math.min(178,(w-140)/3), y=64, xs=[10,(w-bw)/2,w-bw-10], h=96;
        const N=[['損益表','本年度的獲利'],['資產負債表','你擁有什麼、欠了什麼'],['現金流量表','現金如何流動']];
        N.forEach((n,i)=>{ g+=P.node(xs[i],y,bw,h,P.nodeLines(bw,n[0],n[1]),i===1?'hl':''); });
        g+=P.arrow(xs[0]+bw,y+h/2,xs[1],y+h/2,{cls:'acc'})+P.lines((xs[0]+bw+xs[1])/2,y-34,['1 本期淨利','加入保留盈餘'],'v-l','middle',12);
        g+=P.arrow(xs[1]+bw,y+h/2,xs[2],y+h/2)+P.lines((xs[1]+bw+xs[2])/2,y-34,['2 資產與負債的變動','驅動現金'],'v-l','middle',12);
        g+=`<path d="M${P.f(xs[2]+bw/2)},${y+h} C${P.f(xs[2]+bw/2)},${y+h+60} ${P.f(xs[1]+bw/2)},${y+h+60} ${P.f(xs[1]+bw/2)},${y+h+8}" class="v-edge acc" fill="none"/>`+P.head(xs[1]+bw/2,y+h+2,-Math.PI/2,'acc')+P.txt((xs[1]+xs[2]+bw)/2,y+h+64,'3 期末現金成為資產負債表上的現金','v-l','middle');
        g+=P.arrow(xs[0]+bw/2,y+h,xs[0]+bw/2,y+h+30)+P.txt(xs[0]+bw/2,y+h+44,'本期淨利也是現金流量表的起點','v-l','middle');
        return P.svg(w,y+h+80,'本期淨利流入保留盈餘，資產負債表的變動驅動現金流量，期末現金再回到資產負債表。',g); }
      const bw=w-40, xs=20; const N=[['損益表','本年度的獲利'],['資產負債表','你擁有什麼、欠了什麼'],['現金流量表','現金如何流動']]; const h=60, gap=58;
      N.forEach((n,i)=>{ g+=P.node(xs,10+i*(h+gap),bw,h,P.nodeLines(bw,n[0],n[1]),i===1?'hl':''); });
      g+=P.arrow(w/2,10+h,w/2,10+h+gap)+P.txt(w/2+8,10+h+gap/2+4,'1 本期淨利 → 保留盈餘','v-l','start');
      g+=P.arrow(w/2,10+2*h+gap,w/2,10+2*h+2*gap)+P.txt(w/2+8,10+2*h+gap*1.5+4,'2 變動驅動現金流量','v-l','start');
      g+=`<path d="M${xs+bw-10},${10+2*(h+gap)+h/2} C${w+8},${10+2*(h+gap)} ${w+8},${10+h+gap+h} ${xs+bw-10},${10+h+gap+h/2}" class="v-edge acc" fill="none"/>`+P.txt(xs+bw-14,10+2*(h+gap)+h+18,'3 期末現金 → 資產負債表','v-l','end');
      return P.svg(w,10+3*h+2*gap+30,'本期淨利流入保留盈餘，資產負債表的變動驅動現金流量，期末現金再回到資產負債表。',g);
    }, caption:'只要三個連結都建對，資產總額永遠等於負債加權益。這讓每一份預測都內建了一道錯誤檢查。'},
    {t:'tbl', head:['連結','白話說明','BraceWorks 去年'], rows:[
      ['<strong>1. 損益連到權益</strong>','本期淨利減去股利，加進資產負債表上的保留盈餘。','$241,500 的保留盈餘已包含去年 $55,500 的淨利'],
      ['<strong>2. 資產負債表連到現金流量</strong>','資產負債表上每一行的變動（應收帳款、存貨、應付帳款、設備、借款）都是一筆現金流動。','應收帳款增加 $30,000 ＝ 現金少了 $30,000'],
      ['<strong>3. 現金流量連回資產負債表</strong>','期初現金加上本年度的現金流量，就是資產負債表上的期末現金。','$49,000 − $7,000 = $42,000']
    ]},
    K('平衡檢查',
      `<p>把預測的資產負債表加總。如果資產不等於負債加權益，代表現金流量表或資產負債表漏了東西。差額通常正好等於你漏掉的那一項。好的模型每一頁都會顯示這項檢查，而且必須是零。</p>`)
  ]},
  {id:'drivers', label:'驅動因子', kind:'learn', title:'少數幾個假設決定一切', blocks:[
    `<p>預測的好壞取決於它的假設。對製造業來說，九個假設就做了大部分的工作。每一個背後，都有本課程前面的一堂課。</p>`,
    {t:'tbl', head:['驅動因子','決定什麼','BraceWorks 基本值','在哪裡學'], rows:[
      ['營收成長率','營業收入','+5%','第12、15單元'],
      ['折舊前毛利率','銷貨成本','31.5%','第3、6單元'],
      ['推銷及管理費用增幅','間接費用','+4%','第15單元'],
      ['客戶付款天數（DSO）','應收帳款','70天','第10、16單元'],
      ['存貨天數','存貨','106天','第7、16單元'],
      ['供應商付款天數','應付帳款','材料的63天','第16單元'],
      ['購置設備','設備與折舊','$60,000','第14單元'],
      ['新增借款','借款與利息','無','第20單元'],
      ['股利','保留盈餘與現金','無','第20單元']
    ]},
    TIP('模型使用的固定規則',
      `<p>為了讓預測保持簡單、不出現循環公式：利息是期初負債的6.4%（新貸款再加計半年）；所得稅是獲利的25%；新設備分8年折舊，第一年只提半年；貸款每年償還 $20,000；而<strong>透支是平衡項目</strong>。如果現金會低於 $20,000，就動用透支；高於這個水準的現金則拿去償還透支。</p>`),
    SORT('輸入值還是計算值？',['輸入值（你填入的假設）','計算值（公式）'],[
      {text:'客戶付款天數：70', a:0, why:'這是你根據帳齡分析和客戶付款條件所選定的假設。'},
      {text:'年底應收帳款', a:1, why:'計算而來：營業收入 × 客戶付款天數 ÷ 365。'},
      {text:'利率：6.4%', a:0, why:'來自借款合約。'},
      {text:'保留盈餘', a:1, why:'期初保留盈餘 ＋ 本期淨利 − 股利。'},
      {text:'期末現金', a:1, why:'由現金流量表算出。絕對不要手動填入。'},
      {text:'購置設備：$60,000', a:0, why:'這是一項決策，所以是輸入值。'},
      {text:'年底透支餘額', a:1, why:'這是平衡項目：維持最低現金所需的金額。'}
    ]),
    FLAG('手動填入的結果',`<p>最常見的建模錯誤，是在該放公式的地方直接打數字：為了「讓它平衡」而填入的期末現金，或是從去年複製過來的應收帳款數字。這樣模型就不再隨假設變動了。好的模型裡，報表上的每一個數字都能追溯到某個輸入值。</p>`)
  ]},
  {id:'build', label:'建立預測', kind:'play', title:'BraceWorks 明年的預測', blocks:[
    `<p>這是一個可以實際運作的三表預測模型，以 BraceWorks 12月31日真實的資產負債表為起點。調整驅動因子，看三張報表如何一起變動。最上方的平衡檢查應該永遠是零。</p>`,
    W('三表預測模型', function(el,ctx){
      const S=ctx.state; S.m22=S.m22||{d:{...BASE},mistake:false};
      el.innerHTML=`<div class="fm-presets" role="group" aria-label="情境"></div><div class="fm-ctrls"></div>
        <label class="fm-mis"><input type="checkbox" id="${ctx.uid('mis')}"> 犯一個常見錯誤：把存貨變動漏在現金流量表之外</label>
        <div class="fm-out"></div>`;
      const pr=el.querySelector('.fm-presets'), cw=el.querySelector('.fm-ctrls'), out=el.querySelector('.fm-out'), mis=el.querySelector('input[type=checkbox]');
      mis.checked=!!S.m22.mistake;
      const draw=()=>{ const d=S.m22.d, x=model(d,S.m22.mistake); x.d=d; x.mistake=S.m22.mistake; const t=statements(x);
        const ok=x.check===0;
        out.innerHTML=`<div class="stats">${ctx.ui.stat('平衡檢查',ok?'$0 ✓':money(x.check),ok?'good':'bad',ok?'資產 = 負債 + 權益':'有東西漏掉了')}${ctx.ui.stat('年底現金',m$(x.cash),x.cash<MINCASH?'bad':'')}${ctx.ui.stat('已動用透支',m$(x.od),x.overLimit?'bad':x.od>LIMIT*0.85?'warn':'good',x.overLimit?`超過 $150,000 額度 ${m$(x.od-LIMIT)}`:`尚可動用 ${m$(LIMIT-x.od)}`)}${ctx.ui.stat('淨負債 ÷ EBITDA',x.ebitda>0?x.nde.toFixed(2)+'×':'不適用',x.nde>2.5||x.ebitda<=0?'bad':x.nde>2?'warn':'good','財務承諾條款：不超過 2.5×')}</div>
          ${!ok?`<div class="msg bad" style="margin-top:10px"><strong>資產負債表差了 ${money(Math.abs(x.check))}。</strong>這正好是漏在現金流量表之外的存貨變動（${m$(x.dInv)}）。這就是為什麼每個模型都需要平衡檢查。</div>`:''}
          <div class="fm-grid"><div class="fs-wrap">${t.is}</div><div class="fs-wrap">${t.bs}</div><div class="fs-wrap">${t.cf}</div></div>
          <p class="w-hint">標示的列顯示了連結：本期淨利流入保留盈餘，也是現金流量表的起點；期末現金成為資產負債表上的現金。</p>`; };
      const build=()=>{ cw.innerHTML=''; ctx.ui.sliders(cw,SL.map(s=>({...s,v:S.m22.d[s.k]})),v=>{ Object.assign(S.m22.d,v); ctx.save(); draw(); },ctx.uid); };
      PRESETS.forEach(p=>{ const b=document.createElement('button'); b.type='button'; b.textContent=p.label; b.onclick=()=>{ S.m22.d={...p.d}; ctx.save(); build(); pr.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',String(x===b))); }; b.setAttribute('aria-pressed',String(JSON.stringify(p.d)===JSON.stringify(S.m22.d))); pr.appendChild(b); });
      mis.onchange=()=>{ S.m22.mistake=mis.checked; ctx.save(); draw(); };
      build();
    }),
    TIP('可以試試看',
      `<ul><li><strong>大訂單、長付款條件：</strong>營收成長30%，付款條件95天。獲利大增，透支卻超過額度。這就是過度擴張營業，第5單元的那一課，現在提前一年就看得到。</li><li><strong>用對的方式為機器籌資：</strong>一台 $120,000 的機器，先用透支支付，再改用 $100,000 的貸款。獲利一樣，可用額度餘裕卻天差地遠。</li><li>找出客戶付款天數降到多少時，BraceWorks 就完全不需要透支。</li></ul>`)
  ]},
  {id:'scen', label:'情境', kind:'learn', title:'對計畫做壓力測試：什麼會最先撐不住？', blocks:[
    `<p>單一預測只是一個猜測。三個預測（基本情境、下檔情境和上檔情境）能讓你看到範圍，以及你會最先碰到哪一條上限。銀行把這叫做壓力測試。</p>`,
    {t:'live', render(box){
      const sc=[['基本計畫',BASE],['景氣下滑：營收 −10%，毛利率 −2 個百分點，客戶晚付10天',{...BASE,g:-10,gm:29.5,dso:80}],['成長：營收 +25%，客戶晚付15天，存貨增加',{...BASE,g:25,dso:85,dio:115}],['成長並安排資金：同上，另加 $60,000 貸款',{...BASE,g:25,dso:85,dio:115,loan:60000}]];
      const rows=sc.map(([n,d])=>{ const x=model(d); return [n,m$(x.R),m$(x.np),m$(x.cfo),m$(x.od)+(x.overLimit?' ⚠':''),x.ebitda>0?x.nde.toFixed(2)+'×':'不適用', x.overLimit?'<strong style="color:var(--red)">透支額度</strong>':x.nde>2.5?'<strong style="color:var(--red)">財務承諾條款</strong>':x.od>LIMIT*0.85?'<span style="color:var(--amber)">餘裕很小</span>':'<span style="color:var(--good)">都沒有</span>']; });
      box.innerHTML=BW.ui.table(['情境','營業收入','本期淨利','營業活動現金流量','年底透支','淨負債 ÷ EBITDA','最先撐不住的'],rows,{num:[1,2,3,4,5]});
    }},
    K('這張表告訴你什麼',
      `<p>每個壞情境撐破的上限都不一樣。<strong>成長</strong>情境賺最多錢，卻正是它撐破了透支額度：成長要先投入營運資金，之後才會產生現金。<strong>景氣下滑</strong>情境還在透支額度內，因為應收帳款和存貨隨營收一起縮小，但 EBITDA 掉得太多，淨負債達到約 EBITDA 的3倍，違反了銀行的財務承諾條款。事先談好一筆貸款來支應成長，可以解決第一個問題；第二個問題則需要預先準備好的成本削減方案，或與銀行談妥重設財務承諾條款。這兩場對話都要在你需要<em>之前</em>就談。</p>`),
    Q('在壓力測試中，為什麼成長情境對現金的壓力比景氣下滑還大？',['成長一定會降低獲利','營收越多，代表在客戶付款之前，要先墊更多應收帳款和存貨','景氣下滑情境包含一筆退稅','利率會隨成長上升'],1,'營運資金會隨營收增加。景氣下滑時它會縮小、釋放現金，這也是為什麼有些企業在不景氣時看起來現金充裕，卻在景氣大好時把錢燒光。'),
    Q('在每一個情境中，總經理應該最先檢查哪一條上限？',['股價','透支額度和借款的財務承諾條款，因為一旦違反，主導權就交到銀行手上','員工人數','只看毛利率'],1,'獲利告訴你一個計畫值不值得做。可用額度餘裕和財務承諾條款告訴你能不能撐過去。')
  ]},
  {id:'monthly', label:'保持誠實', kind:'learn', title:'從年度模型到每月管理工具', blocks:[
    `<p>年度預測回答大問題。要經營公司，你需要按月的版本，而且要跟實際發生的數字比較。</p>`,
    {t:'tbl', head:['步驟','怎麼做'], rows:[
      ['<strong>改成按月</strong>','依照去年的月份分布拆分營收。薪資、租金和貸款還款放在實際支付的月份；第13個月薪資放在12月（第2單元）。'],
      ['<strong>與13週現金流量預測連結</strong>','模型的前三個月應該與每週現金預測一致（第10單元）。如果不一致，要查出原因。'],
      ['<strong>每月比較</strong>','把每張報表的實際數放在預測數旁邊。解釋重大差異，並更新事後證明錯誤的假設（第15單元）。'],
      ['<strong>往前滾動</strong>','每一季把預測往後延伸，讓它永遠看到未來12個月，而不只是看到12月。'],
      ['<strong>保留版本</strong>','每個版本都存檔並標上日期，記下改了什麼、為什麼改。銀行問預測為什麼變了，你就有答案。']
    ]},
    CHECK('m22-hygiene','一個值得信賴的模型',[
      '所有假設集中在一張輸入工作表，以黃底藍字標示，並註明每個數字的來源',
      '報表裡沒有手動填入的數字：每個數字都是公式',
      '平衡檢查為零，而且每張工作表都顯示',
      '現金檢查：現金流量表上的期末現金等於資產負債表上的現金',
      '透支額度和財務承諾條款的測試自動計算',
      '至少三個情境：基本、下檔和上檔',
      '版本日期和變更紀錄',
      '每月比較實際數與預測數'
    ]),
    TIP('範本已經幫你做好',`<p><strong>三表預測模型</strong> Excel 範本（在「練習」分頁和「工具箱」裡）遵循這份清單上的每一條規則，並已填入 BraceWorks 的數字。換成你自己的數字就行了。</p>`)
  ]},
  {id:'case', label:'個案：說謊的模型', kind:'case', title:'忘了營運資金的模型', blocks:[
    CASE('一份漂亮的試算表',
      `<p>為了拿下一張 $350,000 的經銷合約，BraceWorks 的業務經理做了一份預測：營收成長30%，獲利增加 $60,000，而且「現金自然會跟上」。老闆很滿意，就簽了。銀行那邊則被告知不會需要動用透支。</p>
       <p>六個月後，透支已經用到上限，銀行要求開會。那份預測沒有資產負債表：它從來沒問過這張新合約需要多少額外的存貨和應收帳款。</p>`),
    {t:'live', render(box){ const b=model(BASE), g=model({...BASE,g:30,dso:95,dio:120});
      box.innerHTML=BW.ui.table(['','基本計畫','營收 +30%，95天付款條件'],[['本期淨利',m$(b.np),m$(g.np)],['年底應收帳款',m$(b.ar),m$(g.ar)],['年底存貨',m$(b.inv),m$(g.inv)],['營業活動現金流量',m$(b.cfo),m$(g.cfo)],['所需透支',m$(b.od),m$(g.od)]],{num:[1,2]})+'<p class="w-hint">以本單元的模型計算。</p>'; }},
    Q('總經理在簽約前應該問什麼？',['利潤率對不對？','把資產負債表和現金流量表也給我看：這需要多少額外的存貨和應收帳款，我們要怎麼籌措這筆錢？','之後可以漲價嗎？','誰來賣？'],1,'只有損益、沒有資產負債表的預測，會把計畫所需的營運資金藏起來。一定要三張報表都要。'),
    REPORT('你週一早上要提出的要求',`<p>請財務部門把明年的預算做成<strong>三張連動的報表</strong>，附上平衡檢查和一個下檔情境。如果預算只有損益表，請他們在下一次董事會或銀行會議前，補上資產負債表和現金流量表。</p>`)
  ]},
  {id:'quiz', label:'測驗', kind:'quiz', title:'檢查你的理解', blocks:[
    Q('哪一個連結把損益表接到資產負債表？',['營業收入變成應收帳款','本期淨利減去股利，加進保留盈餘','折舊變成現金','所得稅變成權益'],1,'獲利屬於股東，所以會透過保留盈餘增加權益。'),
    Q('預測的資產負債表正好差了 $45,000。存貨預計增加 $45,000。最可能的原因是什麼？',['營收打錯字','存貨增加漏在現金流量表之外','稅率錯了','折舊太高'],1,'不平衡的金額通常就等於漏掉的那一項。這正是平衡檢查這麼有用的原因。'),
    Q('為什麼用透支當平衡項目？',['銀行規定的','現金是模型算出來的，所以必須有某個項目彈性調整，去填補缺口或吸收盈餘，而在現實中做這件事的就是透支','這樣利息比較低','這樣可以避稅'],1,'在真實的企業裡，現金缺口是由透支來補。模型反映了這一點，並顯示何時會超過額度。'),
    Q('預計營收成長25%。第一年現金通常會怎樣？',['也成長25%','常常會被壓縮，因為應收帳款和存貨在客戶付款之前就先增加了','維持不變','一定會改善'],1,'成長會先吃掉營運資金。成長之前，先把資金安排好。'),
    Q('下列哪一項絕對不應該手動填入預測的報表？',['利率','期末現金','客戶付款天數','稅率'],1,'期末現金是結果。手動填入會切斷模型的連結。'),
    Q('下檔情境有什麼用？',['讓基本情境看起來比較好','它顯示萬一出狀況，你會最先碰到哪一條上限（現金、透支或財務承諾條款），讓你可以預作準備','銀行不會看','它取代預算'],1,'重點是在碰到臨界點之前，就知道它在哪裡。')
  ]},
  {id:'apply', label:'練習', kind:'apply', title:'建立你自己的模型', blocks:[
    `<p>下載三表預測模型範本。它以 BraceWorks 的資產負債表和假設為起點，預測三年，並會自我檢查。把黃色儲存格換成你自己公司去年經查核財務報表上的數字。</p>`,
    {t:'live', render(box){
      const f='three-statement-forecast.xlsx', d=(BW.tmplData||{})[f];
      box.innerHTML=`<div class="tmpl" style="max-width:520px"><div class="tmpl-h"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M9 9v11M15 9v11"/></svg><div><h4>三表預測模型</h4><div class="tmpl-f">${f}</div></div></div><p>三年期、彼此連動的損益表、資產負債表和現金流量表，透支會自動平衡，並附有財務承諾條款測試和平衡檢查。</p><div class="tmpl-a"><button type="button" class="btn small" ${d?'':'disabled'}>下載 .xlsx</button><span class="small tmpl-s" role="status" aria-live="polite"></span></div></div>`;
      const b=box.querySelector('button'), st=box.querySelector('.tmpl-s');
      b.onclick=()=>{ const bin=atob(d), u=new Uint8Array(bin.length); for(let i=0;i<bin.length;i++) u[i]=bin.charCodeAt(i); b.disabled=true;
        BW.saveFile(f,new Blob([u],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}),t=>{ st.textContent=t; }).finally(()=>{ b.disabled=false; }); };
    }},
    CHECK('m22-apply','你自己的預測',[
      '期初資產負債表已依去年財務報表填入，而且是平衡的',
      '九個驅動因子都已設定，每個都註明來源',
      '每一年的平衡檢查都是零',
      '已跑過下檔情境：我知道什麼會最先撐不住',
      '預測已與財務部門分享，並每月比較實際數'
    ])
  ]}
  ],
  warnings:[
    {sign:'預算或預測沒有資產負債表或現金流量表', meaning:'計畫所需的營運資金和資金來源都看不見。', look:'要求三張報表都要有、彼此連動，並附平衡檢查。'},
    {sign:'預測不平衡，或靠一個「硬塞的數字」才平衡', meaning:'有東西漏掉或是手動填入；現金數字不可信。', look:'平衡檢查；把期末現金追溯回它的輸入值。'},
    {sign:'只有一個情境', meaning:'萬一營收或收款下滑，沒人知道什麼會最先撐不住。', look:'下檔情境：透支的可用額度餘裕和財務承諾條款。'}
  ],
  formulas:[
    {name:'應收帳款（預測）', f:'營業收入 × 客戶付款天數 ÷ 365', ex:'$1,260,000 × 70 ÷ 365 = $241,644'},
    {name:'保留盈餘（預測）', f:'期初保留盈餘 ＋ 本期淨利 − 股利', ex:'$241,500 ＋ 本期淨利 − 股利'},
    {name:'平衡檢查', f:'資產總計 −（負債總計 ＋ 權益）= 0', ex:'任何差額都指向一個漏掉的連結'}
  ],
  glossary:[
    {term:'三表預測模型（Three-statement forecast）', def:'把損益表、資產負債表和現金流量表放在一起預測，彼此連動，其中一張變動就會帶動其他兩張。'},
    {term:'驅動因子（Driver）', def:'決定預測中許多數字的一項假設，例如營收成長率或客戶付款天數。'},
    {term:'平衡項目（Balancing item）', def:'預測中為了讓現金兜得起來而彈性調整的那一行，通常是透支或循環信用額度。'},
    {term:'平衡檢查（Balance check）', def:'檢驗資產總計是否等於負債總計加權益；任何差額都代表有錯誤。'},
    {term:'情境（Scenario）', def:'在另一組假設下做出的完整預測，例如景氣下滑或接到一張大訂單。'},
    {term:'壓力測試（Stress test）', def:'在不利但合理的假設下跑預測，看哪一條上限會最先被突破。'},
    {term:'循環參照（Circular reference）', def:'一個依賴自身結果的公式，例如透支的利息又取決於利息本身。模型會避免這種情況，例如改以期初餘額計算利息。'}
  ]
});
})();
