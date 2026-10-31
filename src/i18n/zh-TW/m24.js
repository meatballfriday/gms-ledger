/* ===== Module 21 (file m24): The judgement calls behind the numbers ===== */
(function(){
const {K,TIP,FLAG,CASE,REPORT,Q,FS,FLIP,SORT,CHECK,W,money,signed,pct,kfmt,esc} = BW.h;
const m$=v=>money(Math.round(v));
const P=BW.viz.p;
const calm=()=>{ try{ return window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches; }catch(e){ return false; } };
const later=fn=>{ if(typeof requestAnimationFrame==='function') requestAnimationFrame(()=>setTimeout(fn,20)); else setTimeout(fn,30); };
const E=(tag,cls,html)=>{ const e=document.createElement(tag); if(cls) e.className=cls; if(html!=null) e.innerHTML=html; return e; };

/* ---------- animated column chart (HTML, so bars can glide between values) ---------- */
function cols(host,o){
  const series=o.series; const one=series.length===1;
  host.innerHTML=(one&&!o.legend?'':`<div class="ac-leg">${series.map(s=>`<span><i class="ac-b ${s.cls}" style="position:static"></i>${s.name}</span>`).join('')}</div>`)+'<div class="ac" role="img"></div><details class="v-data"><summary>顯示數字</summary><div class="ac-tbl"></div></details>';
  const wrap=host.querySelector('.ac'), tbl=host.querySelector('.ac-tbl'); let cells=[];
  const fmt=o.fmt||(v=>kfmt(v));
  function build(groups){
    wrap.innerHTML=''; cells=groups.map(g=>{ const c=E('div','ac-g'); const plot=E('div','ac-plot'); plot.style.height=(o.height||170)+'px'; const z=E('div','ac-zero'); plot.appendChild(z);
      const bars=series.map((s,si)=>{ const b=E('div','ac-b '+s.cls+(one?' one':'')); if(!one) b.style.left=(si===0?6:52)+'%'; b.style.height='0%'; plot.appendChild(b); return b; });
      c.appendChild(plot); const l=E('div','ac-l',g.label); c.appendChild(l); wrap.appendChild(c); return {bars,z,l}; });
  }
  function update(groups){
    if(cells.length!==groups.length) build(groups);
    const vals=groups.flatMap(g=>g.v); let hi=Math.max(0,...vals), lo=Math.min(0,...vals);
    if(o.max!=null) hi=Math.max(hi,o.max); if(o.min!=null) lo=Math.min(lo,o.min);
    const span=(hi-lo)||1, z=(-lo)/span*100;
    groups.forEach((g,gi)=>{ const c=cells[gi]; c.z.style.bottom=z+'%'; c.l.innerHTML=g.label; c.l.style.fontWeight=g.on?'700':''; c.l.style.color=g.on?'var(--ink)':'';
      g.v.forEach((v,si)=>{ const b=c.bars[si]; const h=Math.abs(v)/span*100; b.style.bottom=(v>=0?z:z-h)+'%'; b.style.height=h+'%'; b.classList.toggle('neg',v<0); b.dataset.tip=`${String(g.label).replace(/<[^>]+>/g,'')} · ${series[si].name}|${fmt(v)}`; }); });
    wrap.setAttribute('aria-label',(o.label||'圖表')+'：'+groups.map(g=>`${String(g.label).replace(/<[^>]+>/g,'')} ${g.v.map(fmt).join('、')}`).join('；'));
    tbl.innerHTML=BW.ui.table([o.xName||''].concat(series.map(s=>s.name)),groups.map(g=>[String(g.label).replace(/<[^>]+>/g,'')].concat(g.v.map(fmt))),{num:series.map((s,i)=>i+1)});
  }
  let first=true, pending=false, latest=null;
  return function(groups){ latest=groups;
    if(first){ first=false; build(groups); if(calm()) update(groups); else { const zero=groups.map(g=>Object.assign({},g,{v:g.v.map(()=>0)})); update(zero); pending=true; later(()=>{ pending=false; update(latest); }); } }
    else if(!pending) update(groups); };
}
BW.cols=cols;

/* ---------- small parser for typed numbers: 1,200 · (1,200) · -1200 · 1.2k ---------- */
function parseNum(s){ let x=String(s||'').trim().toLowerCase().replace(/\$|,|\s|usd/g,''); if(!x) return null; let neg=false; if(/^\(.*\)$/.test(x)){ neg=true; x=x.slice(1,-1); } if(x.startsWith('−')) x='-'+x.slice(1); let mult=1; if(x.endsWith('k')){ mult=1000; x=x.slice(0,-1); } const v=parseFloat(x); if(isNaN(v)) return null; return (neg?-1:1)*v*mult; }
BW.parseNum=parseNum;

/* ====================================================================== content */
BW.add({
  id:'m24', minutes:80,
  title:'數字背後的判斷',
  subtitle:'現金是數出來的。帳上幾乎其他所有數字，都牽涉到估計或會計規則的選擇。認識對醫療器材出口商獲利影響最大的那些判斷，以及能讓它們保持誠實的提問。',
  goals:[
    '分辨哪些數字是點算出來的、哪些是估計的，以及估計能讓獲利變動多少',
    '在有銷貨回饋、退貨與搭售服務的情況下，判斷一筆銷售何時成為營業收入、金額多少',
    '判斷一筆成本應列在資產負債表上，還是計入今年損益，特別是新產品支出',
    '看懂保固、退貨與產品回收的負債準備，以及負債準備與附註揭露的差別',
    '說明為什麼銷售入帳之後，匯率變動還會產生損益',
    '了解租賃如何依所適用的準則，改變EBITDA、負債與現金流量',
    '知道公司適用哪一套會計準則、為什麼稅額不只是稅率×利潤，以及IFRS 18從2027年起會改變什麼'
  ],
  sections:[
  /* ---------------------------------------------------------------- 1 */
  {id:'estimates', label:'點算或估計？', kind:'play', title:'點算或估計？', blocks:[
    `<p>銀行存款餘額是點算出來的：有對帳單可以證明。BraceWorks帳上其他大多數數字，都有一部分是<strong>估計</strong>的。有人決定了一台機器能用多久、會有多少床墊在保固期內送回，以及一家付款慢的經銷商最後會不會付錢。每個決定單獨看都合理，加在一起卻能讓獲利差很多。</p>`,
    {t:'fig', title:'從點算到估計', draw:function(w){
      const items=[['銀行存款',0.03,'銀行對帳單'],['銀行借款',0.11,'借款對帳單'],['供應商發票',0.2,'發票'],['已開立發票之銷售',0.3,'減除回饋與退貨'],['存貨',0.46,'點算數量×估計成本'],['折舊',0.6,'推估耐用年限'],['備抵呆帳',0.7,'誰不會付款'],['保固負債準備',0.8,'未來的理賠'],['資本化的發展支出',0.89,'未來的銷售'],['商譽',0.97,'整個事業的價值']];
      if(w>=640){ const x0=16, x1=w-16, ax=104; let g=`<defs><linearGradient id="cegr" x1="0" x2="1"><stop offset="0" stop-color="var(--good)"/><stop offset="1" stop-color="var(--red)"/></linearGradient></defs><rect x="${x0}" y="${ax-4}" width="${x1-x0}" height="8" rx="4" fill="url(#cegr)" opacity=".75"/>`;
        g+=P.txt(x0,ax+132,'← 點算：難以爭辯','v-l','start')+P.txt(x1,ax+132,'估計：需要判斷 →','v-l','end');
        items.forEach((it,i)=>{ const x=x0+(x1-x0)*it[1], up=i%2===0, lvl=(i%4<2)?0:1; const y=up?ax-22-lvl*34:ax+56+lvl*34;
          g+=`<line x1="${P.f(x)}" y1="${ax}" x2="${P.f(x)}" y2="${up?y+6:y-14}" class="v-edge" style="stroke-dasharray:2 3"/><circle cx="${P.f(x)}" cy="${ax}" r="5" class="v-node hl"/>`+P.txt(x,y,it[0],'v-t')+P.txt(x,y+14,it[2],'v-s'); });
        return P.svg(w,ax+142,'資產負債表與損益項目，由點算（現金、借款、發票）排列到估計（負債準備、資本化的發展支出、商譽）。',g); }
      const rh=38, top=8; let g=`<defs><linearGradient id="cegv" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="var(--good)"/><stop offset="1" stop-color="var(--red)"/></linearGradient></defs><rect x="14" y="${top}" width="8" height="${items.length*rh}" rx="4" fill="url(#cegv)" opacity=".75"/>`;
      items.forEach((it,i)=>{ const y=top+i*rh+rh/2; g+=`<circle cx="18" cy="${y}" r="5" class="v-node hl"/>`+P.txt(36,y-2,it[0],'v-t','start')+P.txt(36,y+13,it[2],'v-s','start'); });
      g+=P.txt(w-6,top+12,'點算','v-l','end')+P.txt(w-6,top+items.length*rh-4,'估計','v-l','end');
      return P.svg(w,top+items.length*rh+8,'各項目由上方的點算排列到下方的估計。',g);
    }, caption:'項目在這條線上越往右，價值就越取決於某個人的判斷，也越值得多問幾句。'},
    `<p>動手試試。以下是BraceWorks最新帳上的六項估計。報告的稅前淨利<strong>$74,000</strong>，每一項都採用中間的設定。每一種設定都是謹慎的會計人員說得出道理的。</p>`,
    W('兩位誠實的會計人員', function(el,ctx){
      const BASE=74000;
      const J=[
        {k:'reb',t:'經銷商銷貨回饋',d:'美國經銷商A在$480,000的採購額上，可能拿到2–4%的數量回饋。',o:[['估列4%',-4800],['3%',0],['2%',4800]],def:1},
        {k:'war',t:'保固負債準備',d:'$504,000附兩年保固的床墊銷售，預期的理賠。',o:[['銷售額的2.0%',-2520],['1.5%',0],['1.0%',2520]],def:1},
        {k:'stk',t:'滯銷的護具存貨',d:'$40,000的護具款式，九個月沒有銷售。',o:[['沖減50%',-8000],['30%',0],['10%',8000]],def:1},
        {k:'bad',t:'一家逾期的經銷商',d:'美國經銷商B欠款$10,000，已逾期120天，但仍會回覆電子郵件。',o:[['提列100%',-5000],['50%',0],['不提列',5000]],def:1},
        {k:'dep',t:'機器耐用年限',d:'每年折舊$38,000，耐用年限約十年。',o:[['8年',-9500],['10年',0],['12年',6300]],def:1},
        {k:'dev',t:'新產品測試',d:'肥胖患者用床墊$30,000的測試與法規工作。',o:[['費用化',0],['資本化',30000]],def:0}
      ];
      const lo=BASE+J.reduce((t,j)=>t+Math.min(...j.o.map(x=>x[1])),0), hi=BASE+J.reduce((t,j)=>t+Math.max(...j.o.map(x=>x[1])),0);
      const pick={}; J.forEach(j=>pick[j.k]=j.def);
      const list=E('div'); const out=E('div'); el.append(list,out);
      J.forEach(j=>{ const r=E('div','jc-row',`<div><b>${j.t}</b><small>${j.d}</small></div>`); const sg=E('div'); r.appendChild(sg); list.appendChild(r);
        ctx.ui.seg(sg,j.o.map((x,i)=>({v:i,label:x[0]})),j.def,v=>{ pick[j.k]=v; draw(); }); });
      out.innerHTML=`<div class="jc-track"><div class="jc-axis"></div><span class="jc-tick l" style="left:0">${kfmt(lo)}</span><span class="jc-tick r" style="left:100%">${kfmt(hi)}</span><div class="jc-mark rep" style="left:${((BASE-lo)/(hi-lo)*100).toFixed(1)}%">報告數</div><div class="jc-mark now"></div></div><div class="stats" style="margin-top:8px"></div><p class="w-hint" style="margin-top:10px"></p>`;
      const mark=out.querySelector('.jc-mark.now'), stats=out.querySelector('.stats'), hint=out.querySelector('.w-hint');
      function draw(){
        const pbt=BASE+J.reduce((t,j)=>t+j.o[pick[j.k]][1],0), d=pbt-BASE;
        mark.style.left=((pbt-lo)/(hi-lo)*100).toFixed(1)+'%'; mark.textContent=kfmt(pbt);
        stats.innerHTML=ctx.ui.stat('稅前淨利',m$(pbt),d>0?'good':d<0?'bad':'')+ctx.ui.stat('與報告數的差異',d?signed(d):'無')+ctx.ui.stat('年底現金','$42,000','','每種情況都一樣');
        const allLo=J.every(j=>j.o[pick[j.k]][1]===Math.min(...j.o.map(x=>x[1]))), allHi=J.every(j=>j.o[pick[j.k]][1]===Math.max(...j.o.map(x=>x[1])));
        hint.innerHTML=allLo?`每項設定都選最保守的：獲利降到<strong>${m$(pbt)}</strong>。夠審慎，但如果明年的理賠和呆帳都正常，負債準備會被迴轉，明年的數字就會好看得不真實。`:
          allHi?`每項設定都選最大膽的：獲利<strong>${m$(pbt)}</strong>，幾乎是保守數字的三倍。單看任何一項都不離譜，但會計師會質疑這種一面倒的模式。而且在多數小公司採用的中小企業會計準則下，測試成本根本不准資本化（見「資產或費用」）。`:
          `光是這六個選擇，獲利就可能落在<strong>${m$(lo)}</strong>到<strong>${m$(hi)}</strong>之間，而銀行存款一毛都沒動。所以總經理要問的是每項估計<em>怎麼</em>算出來的，而不只是獲利多少。`;
      }
      draw();
    }),
    K('檢視任何估計的三個問題',
      `<ol>
        <li><strong>依據是什麼？</strong>理賠紀錄、帳齡表、工程師的評估。「直覺」不是證據。</li>
        <li><strong>跟去年比有沒有改？為什麼？</strong>事實變了，估計跟著改沒問題。改完剛好讓獲利落在預算上，就有問題。</li>
        <li><strong>往任一邊調一格，獲利會變多少？</strong>如果單一估計就能讓獲利擺動超過10%，你應該每個月都知道它，而不是等到年底。</li>
       </ol>`),
    TIP('一致性比精確更重要',
      `<p>會計師和銀行可以原諒事後證明不準的估計。他們不能原諒的是<strong>為了操控結果而調動估計</strong>：好年頭提得大方（把利潤存起來），壞年頭提得吝嗇（把利潤放出來）。<span class="term">會計估計變動</span>是從現在起適用，並在附註中說明。會計政策變動則較少見，而且要追溯適用到以前年度。</p>`),
    Q('稅前淨利從$74,000增加到$80,300。唯一的變動：機器耐用年限從10年延長為12年。你該問什麼？',[
      '不用問。獲利增加是好消息',
      '有什麼證據支持12年？若用原本的年限，獲利會是多少？',
      '現金是不是也增加了$6,300',
      '稅務機關是否核准'],1,
      '折舊是一種估計。延長年限可能是對的（保養良好的機器往往用得更久），但總經理應該看到同一基礎下的實際結果，以及這項變動的證據。現金完全不受影響。')
  ]},
  /* ---------------------------------------------------------------- 2 */
  {id:'revenue', label:'營業收入', kind:'learn', title:'營業收入：何時認列？認列多少？', blocks:[
    `<p>營業收入是損益表上最大的數字，而在小型出口商，它也是最常出錯的數字。每筆銷售都有兩個問題：<strong>何時</strong>算數？扣掉回饋、退貨和額外服務之後，它<strong>實際值多少</strong>？</p>
     <p>回答這兩個問題的規則，完整版IFRS與PFRS下的IFRS 15，以及US GAAP下的Topic 606，都遵循同樣的五個步驟。中小企業準則將從2027年起改採簡化版，英國的FRS 102則已從2026年開始適用。以下用BraceWorks的一份合約來走一遍。</p>`,
    {t:'fig', title:'五個步驟，用在一份醫院合約上', intro:'一家西班牙醫院集團簽下一份<strong>$60,000</strong>的合約。按<strong>播放</strong>逐步看下去。',
      steps:[
        {k:['n0'],t:'<strong>合約。</strong>一份已簽署的訂單：300張減壓床墊、一天的員工訓練，以及一項<strong>三年延長保固</strong>，在標準兩年保固結束後開始。價格：$60,000，以DAP馬德里交貨。'},
        {k:['n0','e0','n1'],t:'<strong>承諾。</strong>合約承諾了三件不同的事：床墊、訓練和延長保固。延長保固要單獨計算，因為客戶是花錢買超出正常保證範圍的保障：它是一項服務，而不只是保證產品能正常運作。'},
        {k:['n1','e1','n2'],t:'<strong>價格。</strong>$60,000，固定。如果有回饋、退貨或延遲交貨罰款，要在這一步扣除預期金額。'},
        {k:['n2','e2','n3'],t:'<strong>分攤價格</strong>，依各項單獨出售時的價格：床墊$54,000、訓練$2,000、延長保固$6,000。合計$62,000，因此$2,000的折扣要分攤到三項：<strong>$52,258</strong>、<strong>$1,935</strong>和<strong>$5,806</strong>。'},
        {k:['n3','e3','n4'],t:'<strong>每履行一項承諾就認列。</strong>床墊收入在3月送達馬德里時認列（DAP：交貨時控制移轉）。訓練在4月實際舉辦時認列。保固收入要等兩年，再於第3到第5年間分攤認列。在那之前，$5,806列在資產負債表上，作為<span class="term">合約負債</span>。'}],
      draw:BW.viz.flow({label:'五個步驟：合約、承諾、價格、分攤價格、每履行一項承諾就認列。',labels:['承諾了什麼？','多少錢？','分攤','何時？'],edgeK:['e0','e1','e2','e3'],
        nodes:[{t:'1. 合約',s:'已簽署的訂單',k:'n0'},{t:'2. 承諾',s:'商品、訓練、保固',k:'n1'},{t:'3. 價格',s:'減除預期回饋',k:'n2'},{t:'4. 分攤價格',s:'依單獨售價',k:'n3'},{t:'5. 認列',s:'每履行一項承諾時',k:'n4'}]})},
    `<h3>何時：控制移轉</h3>
     <p>商品在<strong>控制移轉</strong>給客戶時成為營業收入：客戶能使用、能轉售，也承擔風險。對出口商來說，通常由國貿條規決定是哪一天（第17單元）。FOB或FCA：在這一端交付貨物時。DAP或DDP：在貨物送達時。</p>`,
    SORT('BraceWorks在6月30日結帳。下列哪些是6月的營業收入？',['6月營業收入','之後','永遠不是營業收入'],[
      {text:'6月28日以FOB馬尼拉出貨給美國經銷商A的床墊', a:0, why:'在FOB條件下，貨物在出發港裝船時控制移轉。'},
      {text:'6月27日以DDP出貨到德國的移位吊帶，7月6日送達', a:1, why:'在DDP條件下，BraceWorks要把貨物送到客戶門口。是7月的營業收入。'},
      {text:'一家醫院為8月出貨的訂單付了30%訂金', a:1, why:'現金進來了，但什麼都還沒交付。在8月之前，它是一項負債（預收款項）。'},
      {text:'寄銷給英國經銷商的400件護具，經銷商賣出後才付款', a:1, why:'BraceWorks仍控制這批存貨。等經銷商賣給醫院時才是營業收入。'},
      {text:'應醫院要求，300條移位吊帶在6月30日開立發票，但存放在BraceWorks直到新院區啟用。已包裝好、貼上該醫院的標籤，不能轉給其他人', a:0, why:'這是「開立帳單但代管」。它能算數，只因為四項條件都符合：有實質理由（客戶要求）、貨物已單獨存放、已可出貨，而且BraceWorks不能賣給別人。如果是BraceWorks為了達成目標而提議這麼做，就不算。'},
      {text:'寄給新經銷商的50張免費樣品床墊', a:2, why:'是行銷成本，不是銷售。'},
      {text:'淹水受損存貨的保險理賠', a:2, why:'是其他收入。營業收入只包括銷售產品和服務所賺得的錢。'}
    ]),
    `<h3>多少：回饋、退貨與折扣</h3>
     <p>如果價格有一部分取決於日後發生的事，營業收入就要按你<strong>預期</strong>能保留的金額，邊做邊認列。經銷商的數量回饋是典型例子。以下是美國經銷商A的條件：年採購額低於$400,000沒有回饋；超過$400,000後，<em>全部</em>採購額享3%；達到$600,000後，全部採購額享5%。到了3月，財務部門就得推估全年會落在哪裡。</p>`,
    W('經銷商回饋：現在估列，或等著日後被嚇一跳', function(el,ctx){
      const QS=[150000,155000,155000,160000], TOTAL=620000, tier=x=>x>=600000?0.05:x>=400000?0.03:0, TRUE=TOTAL*tier(TOTAL);
      const top=E('div'), seg=E('div'), chart=E('div'), out=E('div'); el.append(top,seg,chart,out);
      let pol='est', exp=500000, ready=false;
      ctx.ui.sliders(top,[{k:'exp',label:'3月時，財務部門預期全年採購額為',min:300000,max:700000,step:10000,v:500000,f:v=>`${m$(v)} → ${pct(tier(v),0)}回饋`}],v=>{ exp=v.exp; if(ready) draw(); },ctx.uid);
      ctx.ui.seg(seg,[{v:'est',label:'每季估列回饋'},{v:'paid',label:'支付時才入帳（1月）'}],'est',v=>{ pol=v; draw(); });
      seg.style.margin='10px 0';
      const plot=cols(chart,{series:[{name:'自營業收入扣除的回饋',cls:'s2'}],label:'各季自營業收入扣除的回饋',legend:true,fmt:v=>m$(v),max:31000});
      function draw(){
        const r=tier(exp); let ded;
        if(pol==='est'){ ded=QS.map((q,i)=>i<3?q*r:TRUE-r*(QS[0]+QS[1]+QS[2])); }
        else ded=[0,0,0,0];
        const net=QS.map((q,i)=>q-ded[i]); const nextJan=pol==='paid'?-TRUE:0;
        plot([{label:'Q1',v:[ded[0]]},{label:'Q2',v:[ded[1]]},{label:'Q3',v:[ded[2]]},{label:'Q4',v:[ded[3]]},{label:'明年，<br>支付時',v:[-nextJan]}]);
        const year=net.reduce((a,b)=>a+b,0), over=year-(TOTAL-TRUE);
        out.innerHTML=`<div class="stats">${ctx.ui.stat('今年來自A的營業收入',m$(year))}${ctx.ui.stat('Q4回饋費用',m$(-ded[3]),ded[3]>15000?'bad':'')}${ctx.ui.stat('今年高估金額',over?m$(over):'無',over>0?'bad':'good')}</div>
          <p class="w-hint" style="margin-top:10px">實際採購額為<strong>$620,000</strong>，所以回饋是5%：<strong>${m$(TRUE)}</strong>。${pol==='paid'?'等到1月支付才入帳，會讓今年的營業收入和獲利高估整筆金額，明年一開始就是個坑。這是不允許的：回饋是隨著採購發生而賺得的。':r===0.05?'財務部門猜對了，所以每一季都分擔了合理的回饋，年底沒有意外。':`財務部門估列${pct(r,0)}，所以Q4得補提${m$(ded[3])}的費用，讓這一季看起來很差。解法：隨著採購趨勢越來越明朗，每季更新估計。`}</p>`;
      }
      ready=true; draw();
    }),
    K('退貨、折扣與搭售都依同樣的邏輯',
      `<ul>
        <li><strong>退貨權：</strong>新經銷商可在90天內退回未售出的存貨。按你預期它會留下的部分認列營業收入；其餘列為退款負債。</li>
        <li><strong>提前付款折扣：</strong>如果多數客戶在10天內付款以享2%折扣，就估計會被使用的折扣，以扣除後的淨額認列營業收入。</li>
        <li><strong>搭售：</strong>設備加上訓練、安裝或服務。分攤價格；每一部分在交付時認列為營業收入。</li>
       </ul>`),
    {t:'fig', title:'通路塞貨長什麼樣子', draw:function(w){
      const m=['1','2','3','4','5','6','7','8','9','10','11','12'], s=[88,92,131,84,90,128,79,93,136,85,95,142], cn=[0,0,0,-14,0,0,-12,0,0,-15,0,0];
      const pl=34, pr=8, top=10, hh=150, base=top+hh*0.82, sc=hh*0.82/150, bw=(w-pl-pr)/12; let g='';
      [0,50,100,150].forEach(t=>{ const y=base-t*sc; g+=`<line x1="${pl}" x2="${w-pr}" y1="${P.f(y)}" y2="${P.f(y)}" class="v-grid"/>`+P.txt(pl-6,y+4,'$'+t+'k','v-s','end'); });
      s.forEach((v,i)=>{ const x=pl+i*bw+bw*0.18, ww=bw*0.64, qe=i%3===2; g+=`<rect x="${P.f(x)}" y="${P.f(base-v*sc)}" width="${P.f(ww)}" height="${P.f(v*sc)}" rx="2" class="${qe?'v-f-s2':'v-f-s1'}" data-tip="${m[i]}月銷售|$${v}k"/>`;
        if(cn[i]) g+=`<rect x="${P.f(x)}" y="${P.f(base)}" width="${P.f(ww)}" height="${P.f(-cn[i]*sc)}" rx="2" fill="var(--red)" data-tip="折讓單|($${-cn[i]}k)"/>`;
        g+=P.txt(x+ww/2,base+hh*0.18+12,m[i],'v-s'); });
      g+=`<line x1="${pl}" x2="${w-pr}" y1="${P.f(base)}" y2="${P.f(base)}" class="v-edge"/>`;
      return P.svg(w,top+hh+18,'每季最後一個月的月銷售額都暴增，隔月接著出現折讓單。',g);
    }, caption:'橘色：每季最後一個月。紅色：隔月的折讓單。銷售在每個季末暴增、之後又以退貨形式回來，通常代表經銷商被施壓提早進貨，搭配額外折扣或較長的付款條件。營業收入是向下一季借來的。'},
    FLAG('通路塞貨',
      `<p>注意：銷售集中在期末最後兩週；應收帳款週轉天數上升；下個月初出現折讓單和退貨；經銷商的存貨越堆越多。如果獎金取決於季度銷售，這裡就會有壓力。</p>`),
    Q('BraceWorks以一筆交易賣出$60,000的床墊，外加$6,000的三年延長保固。保固部分何時成為營業收入？',[
      '立即，與床墊一起','在它提供額外保障的期間內分攤','只有在發生理賠時','永遠不會：保固是成本，不是營業收入'],1,
      '客戶付費購買的延長保固是一項單獨的服務。分攤給它的價格先保留為合約負債，隨著提供保障而轉列收入。')
  ]},
  /* ---------------------------------------------------------------- 3 */
  {id:'capitalise', label:'資產或費用', kind:'play', title:'資產或費用？新產品的考驗', blocks:[
    `<p>第4單元談過簡單的情況：機器是資產，修理是費用。困難的判斷出現在<strong>新產品</strong>。醫療器材廠在第一筆銷售之前就要大筆支出：設計、原型、測試、技術文件和法規送審。這些支出是現在就影響獲利，還是留在資產負債表上，取決於兩件事：支出的性質，以及你適用哪一套準則。</p>`,
    {t:'tbl', head:['支出類型','完整版IFRS、完整版PFRS、台灣IFRSs、中國企業會計準則','中小企業準則（IFRS與PFRS for SMEs）','US GAAP','英國FRS 102'], rows:[
      ['<strong>研究</strong>：探索階段（新泡棉材料、早期概念）','費用','費用','費用','費用'],
      ['<strong>發展</strong>：把已證實可行的設計做成產品（驗證、測試、技術文件）','六項條件都符合後資本化；之前列為費用','費用','費用（少數例外，例如部分軟體）','可自行選擇政策：符合條件後資本化，或列為費用'],
      ['<strong>工裝治具、模具、裁切版型</strong>','資產：設備','資產','資產','資產'],
      ['<strong>上市行銷、樣品、商展</strong>','費用','費用','費用','費用']
    ]},
    K('發展支出資本化的六項條件（完整版IFRS）',
      `<p>六項必須全部符合，而且你要能證明：產品<strong>技術上可行</strong>；你<strong>有意圖</strong>完成它；你<strong>有能力</strong>銷售它；有<strong>市場</strong>（會帶來未來經濟效益）；你有完成它的<strong>資源</strong>；而且能可靠地<strong>衡量</strong>它的成本。</p>
       <p>對醫療器材來說，法規核准是最大的不確定性。許多器材廠要等到核准看起來非常可能時才開始資本化，有些甚至要等到正式核准。在那之前的支出要列為費用，日後也不能再轉回資產負債表。</p>`),
    `<p>以下是第14單元的肥胖患者用床墊計畫。選擇每一項的處理方式，然後看每年報告的獲利。不論你怎麼選，現金都在第0年流出。</p>`,
    W('同樣的支出，兩種獲利故事', function(el,ctx){
      const IT=[
        {k:'des',t:'設計、原型與使用者試用',v:25000,ok:{full:false,sme:false,us:false},why:'大多屬於研究和早期設計，在可行性獲證實之前：在每一套準則下都是費用。'},
        {k:'reg',t:'測試、技術文件與法規送審',v:30000,ok:{full:true,sme:false,us:false},why:{full:'在完整版IFRS下，符合六項條件後允許資本化，所以你需要證據顯示很可能獲得核准。',sme:'不允許：中小企業準則規定所有研究與發展支出都列為費用。',us:'不允許：US GAAP規定研究與發展支出列為費用。'}},
        {k:'tool',t:'工裝治具與裁切版型',v:15000,ok:{full:true,sme:true,us:true},why:'會使用多年的設備：在每一套準則下都是資產。'},
        {k:'mkt',t:'上市行銷與樣品',v:10000,ok:{full:false,sme:false,us:false},why:'永遠不是資產：你無法控制它所創造的商譽。'}];
      const ch={des:0,reg:1,tool:1,mkt:0}; let book='full', life=5, ready=false;
      const top=E('div'), list=E('div'), chart=E('div'), out=E('div'); el.append(top,list,chart,out);
      const rb=E('div'); top.appendChild(E('p','w-hint','會計準則：')); top.appendChild(rb); rb.style.margin='4px 0 10px';
      ctx.ui.seg(rb,[{v:'full',label:'完整版IFRS或PFRS'},{v:'sme',label:'中小企業準則'},{v:'us',label:'US GAAP'}],'full',v=>{ book=v; draw(); });
      IT.forEach(it=>{ const r=E('div','jc-row',`<div><b>${it.t}</b><small>${m$(it.v)}</small></div>`); const sg=E('div'); r.appendChild(sg); list.appendChild(r);
        ctx.ui.seg(sg,[{v:0,label:'現在列為費用'},{v:1,label:'列在資產負債表上'}],ch[it.k],v=>{ ch[it.k]=v; draw(); }); });
      const sl=E('div'); list.appendChild(sl);
      ctx.ui.sliders(sl,[{k:'life',label:'資本化成本的攤銷年限',min:3,max:8,step:1,v:5,f:v=>v+'年'}],v=>{ life=v.life; if(ready) draw(); },ctx.uid);
      const plot=cols(chart,{series:[{name:'全部列為費用',cls:'mut'},{name:'你的選擇',cls:'s1'}],label:'各年度對獲利的影響',fmt:v=>m$(v)});
      function draw(){
        const total=IT.reduce((t,i)=>t+i.v,0), cap=IT.reduce((t,i)=>t+(ch[i.k]?i.v:0),0), exp0=total-cap, am=cap/life;
        const yrs=[0,1,2,3,4,5,6]; plot(yrs.map(y=>({label:'第'+y+'年',v:[y===0?-total:0, y===0?-exp0:(y<=life?-am:0)]})));
        const bad=IT.filter(i=>ch[i.k]&&!i.ok[book]);
        out.innerHTML=`<div class="stats" style="margin-top:6px">${ctx.ui.stat('第0年對獲利的影響',m$(-exp0),'',`全部費用化則為${m$(-total)}`)}${ctx.ui.stat('第0年底列在資產負債表上',m$(cap))}${ctx.ui.stat('整個期間的總成本','$80,000','','兩種做法都一樣')}</div>
          <div class="msg ${bad.length?'bad':'good'}" style="margin-top:10px">${bad.length?`<strong>在${book==='full'?'完整版IFRS':book==='sme'?'中小企業準則':'US GAAP'}下不允許：</strong><ul style="margin:6px 0 0 18px;padding:0">${bad.map(i=>`<li>${i.t}：${typeof i.why==='string'?i.why:i.why[book]}</li>`).join('')}</ul>`:`<strong>在${book==='full'?'完整版IFRS':book==='sme'?'中小企業準則':'US GAAP'}下全部允許。</strong>${cap?`資本化${m$(cap)}會讓第0年獲利增加同樣金額，之後${life}年每年產生${m$(am)}的成本。不論哪種做法，現金都在第0年流出。`:'全部在第0年認列：很保守，上市那一年看起來成本很高。'}`}</div>`;
      }
      ready=true; draw();
    }),
    TIP('總經理要權衡的取捨',
      `<p>資本化讓上市那年看起來比較好，之後幾年比較差，總額完全相同。它也會產生一項必須<strong>進行減損測試</strong>的資產：如果產品延誤、未獲核准或賣得不好，這項資產就會一次沖銷。許多小公司的業主偏好把發展支出列為費用：比較簡單、保守，而且稅務機關通常也是這樣處理。</p>`),
    FLAG('為了達標而資本化',
      `<p>已知最大的案例是WorldCom，它在2002年承認把數十億美元的一般網路成本列為資產。規模小一點的，要注意：發展支出或「其他無形資產」每年都在增加，產品上市卻一再延後；修理被重新標示為升級；年底時把員工工時「分攤到專案」。要求看今年資本化的清單，逐項檢視。</p>`),
    SORT('在完整版IFRS下，各項應歸到哪裡？',['資產','費用'],[
      {text:'新護具的$22,000模具', a:0, why:'工裝治具屬於設備。'},
      {text:'在選定任何產品之前，對三家泡棉供應商材料做的實驗室測試', a:1, why:'研究：探索階段。一律列為費用。'},
      {text:'已定案護具設計的驗證測試，預期將獲核准', a:0, why:'可行性確立後的發展支出，前提是六項條件都有書面紀錄。'},
      {text:'每年的ISO 13485追查稽核', a:1, why:'每年發生的經常性成本。'},
      {text:'會使用多年、安裝在自家伺服器上的會計系統授權與建置', a:0, why:'你能控制的軟體是無形資產。'},
      {text:'設定雲端（訂閱制）軟體服務', a:1, why:'通常是費用：你並不控制軟體，只是租用使用權。'}
    ]),
    Q('BraceWorks採用PFRS for SMEs。財務部門提議把$30,000的法規測試費資本化，因為核准「幾乎確定」。正確答案是什麼？',[
      '資本化：核准幾乎確定','列為費用：中小企業準則規定所有研究與發展支出都列為費用','資本化一半','列入存貨'],1,
      '在中小企業準則下，研究與發展支出一律列為費用，不論前景多好。如果BraceWorks將來改採完整版PFRS，規則就不同了。')
  ]},
  /* ---------------------------------------------------------------- 4 */
  {id:'provisions', label:'負債準備', kind:'play', title:'保固、退貨與產品回收', blocks:[
    `<p><span class="term">負債準備</span>是金額或時點不確定的負債。對醫療器材廠來說，重要的有<strong>保固理賠</strong>、<strong>退貨</strong>，以及<strong>產品回收</strong>或現場安全措施的成本。問題永遠是同一個：它應該現在就以金額列入帳上，還是只在附註中提及？</p>`,
    {t:'fig', title:'負債準備、附註，還是什麼都不做？', intro:'按<strong>播放</strong>，把BraceWorks的三種情況逐一套進這個判斷流程。',
      steps:[
        {k:['q1'],t:'<strong>保固。</strong>BraceWorks賣出附兩年保固的床墊。過去事件就是這筆銷售：義務今天已經存在。'},
        {k:['q1','y1','q2'],t:'它必須付錢嗎？理賠紀錄顯示，床墊銷售額約有1.5%會以理賠形式回來。以數千張床墊來看，這是很有可能（more likely than not）的。'},
        {k:['q2','y2','q3'],t:'能估計金額嗎？能：理賠率×仍在保固期內的銷售額。'},
        {k:['q3','y3','prov'],t:'所以要認列<strong>負債準備</strong>：隨著床墊賣出在損益表中認列成本，在理賠付清之前列為負債。'},
        {k:['q1','y1','q2','n2','cont'],t:'<strong>一件訴訟。</strong>一家醫院在病人跌倒後提告，歸咎於一條移位吊帶。銷售就是過去事件。律師認為BraceWorks很可能勝訴：付款是<em>有可能</em>，但不是很有可能。結果：在<strong>附註</strong>中描述這項求償，帳上不列金額。'},
        {k:['q1','n1','none'],t:'<strong>明年的品牌重塑。</strong>BraceWorks計畫花$40,000換新包裝。目前還沒發生任何使它負有義務的事：不論計畫多確定，都<strong>不做任何</strong>入帳。'}],
      draw:function(w){
        const narrow=w<560, gap=narrow?14:40, qw=narrow?Math.min(w*0.56,240):Math.min(300,w*0.5), ow=w-qw-gap-4, x0=2, ox=x0+qw+gap;
        const Qs=[['q1','過去事件已產生義務？'],['q2','付款的可能性大於不付款？'],['q3','金額能夠估計？']];
        const Os=[['none','無須入帳','尚無義務',''],['cont','僅於附註揭露','「或有負債」：描述，不入帳','warn'],['cont3','僅於附註揭露','實務上非常少見','warn']];
        let g='', y=4; const rows=[];
        Qs.forEach((q,i)=>{ const L=P.nodeLines(qw,q[1]), Lo=P.nodeLines(ow,Os[i][1],Os[i][2]); const h=Math.max(L.h,Lo.h); rows.push({y,h});
          g+=`<g data-k="${q[0]}">${P.node(x0,y,qw,h,L,'')}</g>`;
          const ok=i===2?'cont3':Os[i][0]; g+=`<g data-k="${ok}">${P.node(ox,y,ow,h,Lo,Os[i][3])}</g>`;
          const lab=['否','僅為可能','否'][i]; g+=`<g data-k="n${i+1}">${P.arrow(x0+qw+2,y+h/2,ox-2,y+h/2)}${P.txt(x0+qw+gap/2,y+h/2-6,narrow?'':lab,'v-l')}</g>`;
          y+=h+(narrow?34:38); });
        const Lp=P.nodeLines(qw,'負債準備','現在認列成本，付清前列為負債'); g+=`<g data-k="prov">${P.node(x0,y,qw,Lp.h,Lp,'good')}</g>`;
        rows.forEach((r,i)=>{ const yb=r.y+r.h, ye=(i<2?rows[i+1].y:y); g+=`<g data-k="y${i+1}">${P.arrow(x0+qw/2,yb+2,x0+qw/2,ye-2)}${P.txt(x0+qw/2+10,(yb+ye)/2+4,['是','很有可能','是'][i],'v-l','start')}</g>`; });
        if(narrow) rows.forEach((r,i)=>{ g+=P.txt(ox+ow/2,r.y-4,['若否','若僅為可能','若否'][i],'v-l'); });
        return P.svg(w,y+Lp.h+6,'決策樹：過去事件產生義務，接著很有可能付款，再加上能可靠估計，就認列負債準備；否則在附註揭露或不做任何處理。',g);
      }, caption:'有可能但不是很有可能：在附註中描述。可能性極低：什麼都不做。很有可能且可衡量：認列負債準備。'},
    `<h3>負債準備有進有出</h3>
     <p>每個月，BraceWorks按當月床墊銷售的預期理賠成本提列到負債準備（損益表上的成本）。理賠付款時，從負債準備中扣除，而不是從獲利中扣。如果比率正確，餘額會維持穩定。跑完一整年，看看第8單元的泡棉問題讓理賠增加時會發生什麼事。</p>`,
    W('一整年的保固負債準備', function(el,ctx){
      const SALES=42000, OPEN=7560, MAXV=20000, MON=['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
      let rate=1.5, mode='normal', timer=null, shown=0, ready=false;
      const top=E('div'), seg=E('div'), body=E('div'), out=E('div'); el.append(top,seg,body,out);
      ctx.ui.sliders(top,[{k:'r',label:'按每月床墊銷售額提列的負債準備',min:0.5,max:3.5,step:0.1,v:1.5,f:v=>v.toFixed(1)+'%'}],v=>{ rate=v.r; if(ready) reset(); },ctx.uid);
      ctx.ui.seg(seg,[{v:'normal',label:'理賠如常'},{v:'foam',label:'泡棉問題：7月起理賠加倍'}],'normal',v=>{ mode=v; reset(); });
      seg.style.margin='10px 0 14px';
      body.innerHTML=`<div class="tank-wrap"><div><div class="tank"><div class="tank-fill"></div><div class="tank-need"><span></span></div></div><div class="tank-amt"></div></div><div><div class="ac-leg"><span><i class="ac-b s1" style="position:static"></i>計入損益</span><span><i class="ac-b s2" style="position:static"></i>已付理賠</span></div><div class="tank-m">${MON.map(()=>'<div><i class="in"></i><i class="out"></i></div>').join('')}</div><div class="tank-ml">${MON.map(m=>`<span>${m.replace('月','')}</span>`).join('')}</div><div class="row" style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap"><button type="button" class="btn small" data-play>播放這一年 ▶</button><button type="button" class="btn ghost small" data-end>直接跳到年底</button></div></div></div>`;
      const fill=body.querySelector('.tank-fill'), need=body.querySelector('.tank-need'), amt=body.querySelector('.tank-amt'), mcol=[...body.querySelectorAll('.tank-m div')];
      const claims=()=>MON.map((m,i)=>mode==='foam'&&i>=6?1400:630), needEnd=()=>mode==='foam'?11900:7560;
      function balAt(n){ const c=claims(); let b=OPEN; for(let i=0;i<n;i++) b+=SALES*rate/100-c[i]; return b; }
      function paint(n){ shown=n; const b=balAt(n), c=claims();
        fill.style.height=Math.max(0,Math.min(100,b/MAXV*100))+'%'; fill.classList.toggle('low',b<needEnd()*0.6);
        amt.textContent=m$(b); need.style.bottom=(needEnd()/MAXV*100)+'%'; need.querySelector('span').textContent='目標 '+kfmt(needEnd());
        mcol.forEach((d,i)=>{ d.classList.toggle('on',i<n); const [a,o]=d.querySelectorAll('i'); a.style.height=(SALES*rate/100/1500*100)+'%'; o.style.height=(c[i]/1500*100)+'%'; d.title=`${MON[i]}：提列${m$(SALES*rate/100)}，理賠${m$(c[i])}`; });
        if(n<12){ out.innerHTML=`<p class="w-hint" style="margin-top:10px">${n?`第${n}個月底：負債準備${m$(b)}。`:'期初負債準備$7,560：仍在保固期內的$1,008,000床墊，兩年預期理賠的一半。'}</p>`; return; }
        const gap=needEnd()-b, charged=SALES*12*rate/100, paid=c.reduce((a,x)=>a+x,0);
        out.innerHTML=`<div class="stats" style="margin-top:10px">${ctx.ui.stat('全年計入損益',m$(charged))}${ctx.ui.stat('已付理賠',m$(paid))}${ctx.ui.stat('年底負債準備',m$(b),Math.abs(gap)<600?'good':'bad',`應有：${m$(needEnd())}`)}</div>
          <p class="w-hint" style="margin-top:10px">${Math.abs(gap)<600?'大致正確。理賠與提列相抵，所以獲利每個月都反映了保固的真實成本。':gap>0?`負債準備<strong>短少${m$(gap)}</strong>。12月要補提一筆費用，所以這一年的月報都高估了獲利。${mode==='foam'?'理賠一開始增加，就要立刻提高比率：在這裡，約3.3%才跟得上。':''}`:`負債準備<strong>比需要的多出${m$(-gap)}</strong>。迴轉它會讓明年的獲利好看得不真實。提列得太大方的負債準備就是一個「餅乾罐」：一個需要時就能拿出來用的利潤存放處。`}</p>`;
      }
      function stop(){ if(timer){ clearInterval(timer); timer=null; } }
      function reset(){ stop(); paint(0); }
      body.querySelector('[data-play]').onclick=()=>{ stop(); if(calm()){ paint(12); return; } let n=0; paint(0); timer=setInterval(()=>{ if(!el.isConnected){ stop(); return; } n++; paint(n); if(n>=12) stop(); },430); };
      body.querySelector('[data-end]').onclick=()=>{ stop(); paint(12); };
      ready=true; paint(0);
    }),
    FS({title:'附註如何呈現：保固負債準備變動表', sub:'BraceWorks，正常的一年', rows:[
      ['1月1日餘額',7560],['計入損益',7560,'ind'],['使用：已付理賠',-7560,'ind'],['迴轉：不再需要',0,'ind'],['12月31日餘額',7560,'total']
    ], note:'留意「迴轉」那一行。業績差的年度出現大額迴轉，或業績好的年度負債準備增加得比銷售快很多，都是利潤被存起來又放出來的跡象。'}),
    `<h3>產品回收與現場安全矯正措施</h3>
     <p>11月，BraceWorks發現某一批1,200件護具的扣具可能會裂開。其中700件已在經銷商和醫院手上；500件還在倉庫。依醫療器材法規，它必須執行<span class="term">現場安全矯正措施</span>：通知客戶、把受影響的護具換成新品，並向主管機關通報。它在12月10日向經銷商宣布這項措施。</p>`,
    FS({title:'批號B-2209：12月帳上要列什麼', rows:[
      '已售出的護具（負債準備）',
      ['替換護具：700 × $23.35全部成本',-16345,'ind'],
      ['運費、標示與客戶通知',-6000,'ind'],
      ['產品回收負債準備',-22345,'sub'],
      '仍在倉庫的護具（不是負債準備）',
      ['500個扣具重工，每個$4，若因此使成本高於售價',-2000,'ind'],
      ['計入今年損益的總成本',-24345,'total']
    ], note:'12月的公告產生了義務。如果瑕疵是在1月、帳還沒結完之前才發現，通常仍要在12月提列：有瑕疵的護具在年底前已售出，且附有保固或修復的法定責任，所以這個狀況在12月31日就已存在（屬於「調整事項」）。倉庫裡的存貨，只有在成本加上重工超過護具售價的部分才要沖減。'}),
    Q('一名病人的家屬威脅要對一起與BraceWorks移位吊帶有關的跌倒事件提告。律師說有可能賠償，但機會不大。帳上要列什麼？',[
      '按全額求償提列負債準備','在附註中描述這項求償（或有負債），不入帳金額','什麼都不用，永遠不用','按求償金額的一半提列負債準備'],1,
      '有可能但不是很有可能：在附註中揭露。如果律師後來說BraceWorks很可能要賠，就要轉為負債準備。'),
    Q('下半年保固理賠加倍，但負債準備提列率仍維持1.5%。這對月報有什麼影響？',[
      '沒有影響','每月獲利被高估；年底會出現一筆補提費用','每月獲利被低估','只影響現金'],1,
      '負債準備沒有跟上實際理賠。每季問財務部門：負債準備提列率是否仍符合理賠趨勢？')
  ]},
  /* ---------------------------------------------------------------- 5 */
  {id:'fx', label:'匯率', kind:'play', title:'財務報表上的匯率', blocks:[
    `<p>第17單元談的是現金面：一張歐元發票在收款前就可能縮水。帳上用一種特定方式、逐月記錄這項損失，這也說明了為什麼出口商的獲利會跳來跳去，即使業務本身沒什麼變化。</p>`,
    K('三條規則',
      `<ol>
        <li><strong>銷售按當天匯率入帳。</strong>在€1 = $1.10時開立€40,000的發票，就是$44,000的營業收入，之後營業收入不會再更改。</li>
        <li><strong>貨幣性餘額每個月底重新評價。</strong>外幣的應收帳款、應付帳款、銀行存款和借款，都按月底匯率重新換算。差額就是<span class="term">未實現兌換損益</span>，即使還沒有任何款項收付，也要計入損益。</li>
        <li><strong>收付款時，最後一段差額就實現了。</strong>存貨、機器和預付款項不重新評價：它們維持購入時的匯率。</li>
       </ol>`),
    W('跟著一張歐元發票走過三個月底', function(el,ctx){
      const EUR=40000, R0=1.10; let r={may:1.08,jun:1.05,pay:1.06}, at=0, ready=false;
      const top=E('div'), cards=E('div','fxt'), info=E('div'), chart=E('div'); el.append(top,cards,info,chart);
      ctx.ui.sliders(top,[
        {k:'may',label:'5月31日匯率',min:1.00,max:1.20,step:0.01,v:1.08,f:v=>'€1 = $'+v.toFixed(2)},
        {k:'jun',label:'6月30日匯率',min:1.00,max:1.20,step:0.01,v:1.05,f:v=>'€1 = $'+v.toFixed(2)},
        {k:'pay',label:'7月19日收款時匯率',min:1.00,max:1.20,step:0.01,v:1.06,f:v=>'€1 = $'+v.toFixed(2)}],v=>{ r=v; if(ready) draw(); },ctx.uid);
      const plot=cols(chart,{series:[{name:'當月兌換損益',cls:'s2'}],legend:true,label:'各月兌換損益',fmt:v=>m$(v)});
      function draw(){
        const pts=[{d:'5月20日',k:'開立發票',rate:R0},{d:'5月31日',k:'月底',rate:r.may},{d:'6月30日',k:'月底',rate:r.jun},{d:'7月19日',k:'收款',rate:r.pay}];
        pts.forEach((p,i)=>{ p.usd=EUR*p.rate; p.g=i?p.usd-pts[i-1].usd:0; });
        cards.innerHTML=pts.map((p,i)=>`<button type="button" class="fxt-d ${i===at?'on':''}" data-i="${i}"><span class="k">${p.d} · ${p.k}</span><span class="v">${m$(p.usd)}</span><span class="k">€1 = $${p.rate.toFixed(2)}</span><span class="g ${p.g<0?'bad':p.g>0?'good':''}">${i?(p.g>=0?'+':'')+m$(p.g)+(i<3?' 未實現':' 已實現'):'認列營業收入'}</span></button>`).join('');
        cards.querySelectorAll('.fxt-d').forEach(b=>b.onclick=()=>{ at=+b.dataset.i; draw(); });
        const p=pts[at];
        const text=[`BraceWorks出貨並開立<strong>€40,000</strong>的發票。營業收入：<strong>$44,000</strong>。應收帳款：$44,000。不論歐元之後怎麼走，這個營業收入數字都不會變。`,
          `月底。應收帳款仍是€40,000，但現在值${m$(p.usd)}。這${m$(Math.abs(p.g))}的${p.g<0?'損失':'利益'}以<strong>未實現</strong>兌換${p.g<0?'損失':'利益'}計入5月的損益。沒有任何款項移動。`,
          `又一個月底。再重新評價為${m$(p.usd)}：6月的損益中再多一筆${m$(Math.abs(p.g))}的${p.g<0?'損失':'利益'}。`,
          `客戶支付€40,000，按${p.rate.toFixed(2)}換算為${m$(p.usd)}。最後${m$(Math.abs(p.g))}的差額，是7月的<strong>已實現</strong>${p.g<0?'損失':'利益'}。`][at];
        const tot=pts[3].usd-44000;
        info.innerHTML=`<p class="msg info" style="margin:0 0 12px">${text}</p><table class="jtbl"><tbody><tr><td>營業收入（5月）</td><td class="v">$44,000</td></tr><tr><td>兌換損益：5月、6月、7月</td><td class="v">${[1,2,3].map(i=>(pts[i].g>=0?'+':'')+m$(pts[i].g)).join(' · ')}</td></tr><tr class="hi"><td><strong>兌換${tot<0?'損失':'利益'}合計</strong> = €40,000 × (${pts[3].rate.toFixed(2)} − 1.10)</td><td class="v"><strong>${m$(tot)}</strong></td></tr></tbody></table>`;
        plot([{label:'5月',v:[pts[1].g],on:at===1},{label:'6月',v:[pts[2].g],on:at===2},{label:'7月',v:[pts[3].g],on:at===3}]);
      }
      ready=true; draw();
    }),
    K('這對你的月度管理報告代表什麼',
      `<ul>
        <li><strong>要求把兌換損益單獨列一行</strong>，並分成已實現與未實現。未實現的金額下個月可能會反轉。</li>
        <li><strong>要求以預算匯率呈現的利潤率</strong>（固定匯率基礎），才看得出是業務變好了，還是只是歐元在動。</li>
        <li><strong>外幣餘額大，擺盪就大。</strong>$300,000的歐元應收帳款，歐元每變動一分錢，金額就變動約$3,000。</li>
       </ul>`),
    TIP('你的帳是用哪種貨幣記的？',
      `<p>你的<span class="term">功能性貨幣</span>是公司營運所處主要經濟環境的貨幣。菲律賓、台灣或中國的公司即使以美元銷售，帳也常以披索、新台幣或人民幣記載。這樣一來，<em>每一筆</em>美元應收帳款、美元銀行存款和美元借款都是外幣餘額，每月都要重新評價。問你的會計人員帳是用哪種貨幣記的。這決定了哪些餘額會產生兌換損益。國外子公司的結果又不一樣：為編製合併財務報表而換算所產生的差額，是進入權益中的準備，而不是損益（第24單元）。</p>`),
    Q('一張€40,000的發票按1.10入帳（$44,000）。月底匯率是1.07。那個月的帳上會出現什麼？',[
      '營業收入減為$42,800','營業收入維持$44,000；認列$1,200的未實現兌換損失','客戶付款前什麼都沒有','$1,200的已實現損失'],1,
      '營業收入固定按銷售當天的匯率。應收帳款重新評價為$42,800，$1,200的差額是未實現損失。'),
    Q('下列哪一項不按月底匯率重新評價？',['歐元銀行存款','披索記帳公司帳上的美元借款','以歐元購入、仍在庫的泡棉','應付供應商的歐元帳款'],2,
      '存貨是非貨幣性項目。它維持購入時的匯率；只有以外幣計價的應收、應付或持有的貨幣才要重新評價。')
  ]},
  /* ---------------------------------------------------------------- 6 */
  {id:'leases', label:'租賃', kind:'play', title:'租賃：是租金，還是負債？', blocks:[
    `<p>BraceWorks承租工廠和辦公室，<strong>每月$3,000</strong>，租約還剩五年。同一份租約，依所適用的準則不同，看起來差很多。在完整版IFRS（IFRS 16）下，這份租約是一筆<strong>負債</strong>：BraceWorks已承諾支付$180,000，所以它要按這些付款的現值認列<span class="term">租賃負債</span>，並認列等額的<span class="term">使用權資產</span>，之後對資產提列折舊、對負債支付利息。</p>`,
    W('一份租約，三套準則', function(el,ctx){
      const R=0.064/12, N=60, PAY=3000; const PV=PAY*(1-Math.pow(1+R,-N))/R; let bal=PV; const INT=[], PRIN=[];
      for(let y=0;y<5;y++){ let i=0,p=0; for(let m=0;m<12;m++){ const it=bal*R; i+=it; p+=PAY-it; bal-=PAY-it; } INT.push(i); PRIN.push(p); }
      const DEP=PV/5;
      const C={
        rent:{n:'租金（中小企業準則）',ebitda:132000,dep:38000,int:14000,liab:0,nd:178000,cfo:33000,cff:20000},
        ifrs:{n:'IFRS 16',ebitda:168000,dep:38000+DEP,int:14000+INT[0],liab:PV,nd:178000+PV,cfo:33000+36000-INT[0],cff:20000-PRIN[0]},
        us:{n:'US GAAP',ebitda:132000,dep:38000,int:14000,liab:PV,nd:178000,cfo:33000,cff:20000}};
      Object.values(C).forEach(c=>{ c.pbt=c.ebitda-c.dep-c.int-6000; });
      let mode='ifrs';
      const seg=E('div'), tab=E('div'), out=E('div'), chart=E('div'); el.append(seg,tab,out,E('h4',null,'損益表中的成本，逐年比較'),chart);
      seg.style.marginBottom='10px';
      ctx.ui.seg(seg,[{v:'rent',label:'租金（中小企業準則）'},{v:'ifrs',label:'列在資產負債表上（IFRS 16）'},{v:'us',label:'US GAAP'}],'ifrs',v=>{ mode=v; draw(); });
      const rows=[['EBITDA','ebitda'],['折舊','dep'],['利息','int'],['第1年稅前淨利','pbt'],['第一天的租賃負債','liab'],['淨負債','nd'],['淨負債 ÷ EBITDA','ratio'],['第1年營業活動現金流量','cfo'],['第1年籌資活動現金流量','cff']];
      function draw(){
        const a=C.rent, b=C[mode]; a.ratio=a.nd/a.ebitda; b.ratio=b.nd/b.ebitda;
        const f=(k,v)=>k==='ratio'?v.toFixed(2)+'×':m$(v);
        tab.innerHTML=`<table class="jtbl"><thead><tr><th></th><th class="v">租金</th><th class="v">${b.n}</th></tr></thead><tbody>${rows.map(([l,k])=>`<tr class="${Math.abs(a[k]-b[k])>0.5?'hi':''}"><td>${l}</td><td class="v">${f(k,a[k])}</td><td class="v">${f(k,b[k])}</td></tr>`).join('')}</tbody></table>`;
        out.innerHTML=`<p class="w-hint" style="margin-top:10px">${mode==='rent'?'租約只是營業費用中一筆$36,000的成本。資產負債表上什麼都沒有，只在附註中揭露承諾。':mode==='ifrs'?`EBITDA跳增$36,000，因為租金消失了，換成列在EBITDA以下的折舊和利息。負債增加${m$(PV)}，所以淨負債 ÷ EBITDA從1.35×變成${C.ifrs.ratio.toFixed(2)}×。前幾年的獲利稍低。現金完全相同，但其中${m$(PRIN[0])}從營業活動移到籌資活動。`:`租約以${m$(PV)}的負債列在資產負債表上，但損益表仍只顯示一筆直線法的租賃成本$36,000，所以EBITDA和現金流量看起來跟租金一樣。許多借款合約不把這些營業租賃負債算進負債；查查你的合約。`}</p>`;
      }
      draw();
      const plot=cols(chart,{series:[{name:'租金',cls:'mut'},{name:'IFRS 16：折舊＋利息',cls:'s1'}],label:'各年度租賃成本',fmt:v=>m$(v)});
      plot([1,2,3,4,5].map((y,i)=>({label:'第'+y+'年',v:[36000,DEP+INT[i]]})));
      chart.appendChild(E('p','w-hint',`五年合計同樣是$180,000。在IFRS 16下成本集中在前期，因為負債最大時利息最高。`));
    }),
    {t:'tbl', head:['會計準則','租賃要列在資產負債表上嗎？'], rows:[
      ['完整版IFRS與完整版PFRS（IFRS 16）、台灣IFRSs、中國企業會計準則','是，幾乎所有超過12個月的租賃，低價值項目除外'],
      ['US GAAP（Topic 842）','是，但營業租賃在損益表中維持單一直線法成本'],
      ['英國FRS 102','是，適用於2026年1月1日以後開始的年度（以前是租金）'],
      ['IFRS與PFRS for SMEs、PFRS for Small Entities、中國小企業會計準則、台灣非公開發行公司適用的企業會計準則（EAS）','否：多數不動產租賃仍按租金處理，承諾在附註中揭露']
    ]},
    TIP('問清楚銀行的財務承諾條款怎麼處理租賃',
      `<p>如果BraceWorks改採完整版IFRS，它的淨負債 ÷ EBITDA會一夕之間跳升，業務卻毫無變化。許多借款合約把定義固定在簽約當時有效的規則（「凍結GAAP」），或把租賃負債排除在外。在會計師或銀行發現之前，先搞清楚。</p>`),
    Q('一家公司對工廠租約採用IFRS 16。第一年哪一項是對的？',[
      'EBITDA下降','EBITDA上升、負債增加，付出的現金總額不變','現金流量因省下租金而改善','什麼都沒變'],1,
      '租金離開EBITDA；由EBITDA以下的折舊和利息取代。租賃負債加進負債。付給房東的現金一樣。')
  ]},
  /* ---------------------------------------------------------------- 7 */
  {id:'rules', label:'會計準則與稅', kind:'learn', title:'適用哪套準則、稅額這一行，以及IFRS 18', blocks:[
    `<p>每一套財務報表都遵循一套規則，稱為<span class="term">財務報導架構</span>。它寫在第一個附註裡，而且在任何人做判斷之前，就已決定了本單元中好幾個判斷。同一個國家的小公司和大公司，往往適用不同的準則。</p>`,
    {t:'tbl', head:['國家','上市、公開發行與大型公司','多數非公開的中小企業'], rows:[
      ['<strong>菲律賓</strong>','完整版PFRS：上市公司，以及資產超過PHP 3.5億或負債超過PHP 2.5億的其他公司','PFRS for SMEs（資產PHP 1億–3.5億，或負債PHP 1億–2.5億）；PFRS for Small Entities（資產或負債PHP 300萬–1億）。微型企業可採用稅務基礎'],
      ['<strong>台灣</strong>','經金融監督管理委員會認可的台灣IFRSs，適用於所有公開發行公司','企業會計準則（EAS），包括大型非公開發行公司'],
      ['<strong>中國</strong>','企業會計準則（ASBE），與IFRS相近','企業會計準則，或小企業會計準則'],
      ['<strong>美國</strong>','US GAAP','US GAAP，非公開公司有部分簡化規定；有些小公司以稅務基礎或現金基礎報導'],
      ['<strong>英國</strong>','上市集團採用英國認可之IFRS','FRS 102（小公司揭露較少）；微型企業採用FRS 105']
    ]},
    `<p class="small" style="color:var(--muted)">門檻與選項會變動。請向你的會計師確認現行規定。BraceWorks資產約$845,000（約PHP 5,000萬），屬於菲律賓的小型企業（Small Entities）級距。小型企業在特定情況下可採用PFRS for SMEs或完整版PFRS，例如所屬集團採用時；本課程中BraceWorks採用PFRS for SMEs。</p>`,
    {t:'tbl', head:['同一個問題…','完整版IFRS','中小企業準則','US GAAP'], rows:[
      ['發展支出','符合六項條件後資本化','費用','費用'],
      ['不動產租賃','列在資產負債表上','通常按租金處理','列在資產負債表上，單一租賃成本'],
      ['存貨成本：可以用後進先出法（LIFO）嗎？','否','否','是'],
      ['土地和建築物可以向上重估嗎？','可以','可以','否'],
      ['情況好轉時，減損可以迴轉嗎？','可以，商譽除外','可以，商譽除外','否'],
      ['商譽','不攤銷；每年測試','攤銷，通常在10年以內','不攤銷（非公開公司可選擇攤銷）'],
      ['遞延所得稅','有','有（有些小企業的準則，例如中國的，只認列應付稅額）','有']
    ]},
    K('為什麼這對總經理很重要',
      `<p>要拿BraceWorks跟競爭對手公開的財務報表、買方的評價模型或銀行的財務承諾條款比較嗎？先確認大家用的是同一套準則。改採完整版IFRS，例如在出售事業或上市之前，會改變EBITDA、負債和權益，而實質上什麼都沒變。</p>`),
    `<h3>為什麼稅額不只是稅率×利潤</h3>
     <p>第19單元說明過，課稅所得有它自己的規則。在財務報表上，這些差異出現在兩個地方：<strong><span class="term">有效稅率</span></strong>與<strong><span class="term">遞延所得稅</span></strong>。以下是BraceWorks明年的草稿：稅前淨利$90,000，所得稅$25,300。這是28.1%，不是25%。所得稅附註會把兩者調節起來：</p>`,
    {t:'fig', title:'從法定稅率到有效稅率', render:function(box,ctx){
      box.innerHTML=ctx.ui.bridge([{label:'以25%計算$90,000的稅額',v:22500,total:true},{label:'罰款與交際費不可扣除',v:1000},{label:'德國銷售辦事處虧損：尚無租稅抵減',v:3000},{label:'部分利潤享出口租稅優惠',v:-2600},{label:'去年所得稅估列不足',v:1400},{label:'所得稅費用：28.1%',v:25300,total:true}]);
    }, caption:'每一步都是該問的問題。永久性項目（罰款）會永久拉高稅率。海外虧損暫時無法使用，代表新辦事處的成本比看起來更高。'},
    `<p><strong>遞延所得稅</strong>出現在稅法和財務報表把同一筆成本放在不同年度的時候。以BraceWorks新的$60,000泡棉裁切機為例。帳上按10年提列折舊。假設稅法允許BraceWorks在5年內扣除。逐年往下看：</p>`,
    W('稅是晚點繳，不是省下來', function(el,ctx){
      const COST=60000, BK=6000, TX=12000, RATE=0.25;
      const top=E('div'), chart=E('div'), chart2=E('div'), out=E('div'); el.append(top,chart,E('h4',null,'各年底的遞延所得稅負債'),chart2,out);
      let yr=1, timer=null, ready=false;
      const ctl=ctx.ui.sliders(top,[{k:'y',label:'年度',min:1,max:10,step:1,v:1,f:v=>'第'+v+'年'}],v=>{ yr=v.y; if(ready) draw(); },ctx.uid);
      const pb=E('button','btn small','播放 ▶'); pb.type='button'; pb.style.marginTop='8px'; top.appendChild(pb);
      const plot=cols(chart,{series:[{name:'帳上折舊',cls:'s1'},{name:'稅上扣除額',cls:'s2'}],label:'各年度折舊與稅上扣除額',fmt:v=>m$(v),height:130});
      const plot2=cols(chart2,{series:[{name:'遞延所得稅負債',cls:'s4'}],label:'各年度遞延所得稅負債',fmt:v=>m$(v),height:110,max:7500});
      function draw(){
        const ys=[1,2,3,4,5,6,7,8,9,10];
        plot(ys.map(y=>({label:String(y),v:[BK,y<=5?TX:0],on:y===yr})));
        const diff=y=>Math.max(0,Math.min(y,5)*TX-y*BK);
        plot2(ys.map(y=>({label:String(y),v:[y<=yr?diff(y)*RATE:0],on:y===yr})));
        const d=diff(yr);
        out.innerHTML=`<div class="stats" style="margin-top:8px">${ctx.ui.stat('帳上的帳面金額',m$(COST-BK*yr))}${ctx.ui.stat('稅上剩餘價值',m$(Math.max(0,COST-TX*yr)))}${ctx.ui.stat('遞延所得稅負債',m$(d*RATE),'','差額的25%')}</div>
          <p class="w-hint" style="margin-top:10px">${yr<=5?`到目前為止，BraceWorks在稅上扣除了${m$(Math.min(yr,5)*TX)}，帳上卻只提列${m$(yr*BK)}，繳的稅比帳上利潤所顯示的少了${m$(d*RATE)}。這筆稅沒有省下來：它是日後要繳的，所以帳上把它列為負債。`:`從第6年起，稅上已沒有可扣除的金額，但帳上每年仍提列$6,000。課稅所得現在高於會計利潤，負債逐漸迴轉：${yr<10?'剩下'+m$(d*RATE)+'。':'到第10年歸零。'}`}</p>`;
      }
      function stop(){ if(timer){ clearInterval(timer); timer=null; pb.textContent='播放 ▶'; } }
      pb.onclick=()=>{ if(timer){ stop(); return; } const inp=top.querySelector('input[type=range]'); let y=0; pb.textContent='暫停 ❚❚'; const step=()=>{ y++; inp.value=y; inp.dispatchEvent(new Event('input')); if(y>=10) stop(); }; if(calm()){ y=9; step(); return; } step(); timer=setInterval(()=>{ if(!el.isConnected){ stop(); return; } step(); },900); };
      ready=true; draw();
    }),
    K('遞延所得稅資產需要細看',
      `<p>反過來的情況也會發生。保固負債準備現在就提列，但通常要到理賠付款時才能在稅上扣除；稅務虧損可以往後扣抵。這些會產生<strong>遞延所得稅資產</strong>：預期日後可以少繳的稅。只有在未來有足夠利潤可以用掉它們時，它們才有價值。虧損公司帳上一大筆遞延所得稅資產，是一項預測，不是錢：要問它假設了多少利潤。</p>`),
    `<h3>2027年上路：IFRS 18改變報表編排</h3>
     <p>自<strong>2027年1月1日</strong>以後開始的年度起，採用完整版IFRS的公司要以<strong>IFRS 18</strong>取代舊的表達規定，去年的數字也要重編以便比較。各國依自己的時程採用：菲律賓（完整版PFRS）從2027年起，台灣IFRSs公司從2028年起，中國企業會計準則則尚未採用。你賺多少利潤完全不變，變的是項目放的位置。以下是用新方式編排的BraceWorks損益表。</p>`,
    {t:'fig', title:'IFRS 18下的BraceWorks損益表', intro:'按<strong>播放</strong>看看新的分類。',
      steps:[
        {k:['op'],t:'<strong>營業</strong>排第一：主要業務，以及所有未歸入其他類別的項目。它以一個規定的小計作結：<strong>營業利益</strong>。'},
        {k:['op','fx'],t:'兌換差額跟著產生它的項目走。BraceWorks的$6,000損失產生於客戶餘額，所以它<strong>往上</strong>移進營業類別。營業利益是$88,000，而不是現在顯示的$94,000。'},
        {k:['inv'],t:'<strong>投資</strong>：投資和閒置資金的報酬，例如存款利息。BraceWorks沒有這類項目，所以第二個規定小計<strong>籌資及所得稅前損益</strong>也是$88,000。'},
        {k:['fin'],t:'<strong>籌資</strong>：借款和租賃的利息。$14,000，得出稅前淨利$74,000，與以前相同。'},
        {k:['tax'],t:'<strong>所得稅</strong>，接著是本期淨利：$55,500。不變。'},
        {k:['mpm'],t:'<strong>你自己的衡量指標。</strong>如果公司對外使用自己的利潤衡量指標，例如在業績新聞稿中的「調整後EBITDA」，就必須在附註中定義它，並調節到IFRS的小計。'},
        {k:['cf'],t:'<strong>現金流量表</strong>也會改變：間接法從營業利益開始，支付的利息和股利歸入籌資活動，收到的利息和股利歸入投資活動。'}],
      draw:function(w){
        const R=[['op','營業收入','1,200,000'],['op','銷貨成本','(860,000)'],['op','推銷費用','(86,000)'],['op','管理費用','(160,000)'],['op fx','客戶餘額之兌換損失','(6,000)'],['op','營業利益','88,000',1],['inv','投資收益','–'],['inv','籌資及所得稅前損益','88,000',1],['fin','銀行借款利息','(14,000)'],['fin','稅前淨利','74,000',1],['tax','所得稅','(18,500)'],['tax','本期淨利','55,500',1]];
        const CAT={op:'營業',inv:'投資',fin:'籌資',tax:'所得稅'};
        const narrow=w<520, cw=narrow?20:96, rh=22, x1=cw+8, top=4; let g='', y=top, prev=null, start=top;
        const band=(k,y0,y1)=>`<g data-k="${k}"><rect x="2" y="${P.f(y0)}" width="${cw-4}" height="${P.f(y1-y0-3)}" rx="6" class="v-node hl"/>${narrow?'':P.lines(cw/2,(y0+y1)/2-2,P.wrap(CAT[k],11),'v-t','middle',14)}</g>`;
        R.forEach((r,i)=>{ const k=r[0].split(' ')[0]; if(prev&&k!==prev){ g+=band(prev,start,y); y+=6; start=y; } prev=k;
          g+=`<g data-k="${r[0]}">${r[3]?`<line x1="${x1}" x2="${w-4}" y1="${y+2}" y2="${y+2}" class="v-edge"/>`:''}${P.txt(x1+4,y+15,r[1],r[3]?'v-t':'v-s','start')}${P.txt(w-6,y+15,r[2],r[3]?'v-t':'v-s','end')}</g>`; y+=rh; });
        g+=band(prev,start,y); y+=10;
        const L1=P.nodeLines(w-8,'附註：管理階層績效衡量','例如對外使用的「調整後EBITDA」，須定義並調節'); g+=`<g data-k="mpm">${P.node(4,y,w-8,L1.h,L1,'')}</g>`; y+=L1.h+8;
        const L2=P.nodeLines(w-8,'現金流量表','從營業利益開始；支付的利息歸入籌資活動'); g+=`<g data-k="cf">${P.node(4,y,w-8,L2.h,L2,'')}</g>`; y+=L2.h+4;
        return P.svg(w,y,'BraceWorks損益表分為營業、投資、籌資與所得稅四類，營業利益為88,000。',g);
      }, caption:'利潤相同，順序不同。兌換損失移進營業利益，利息則分到籌資類別。'},
    `<p>採用中小企業準則、US GAAP或FRS 102的公司不受影響。如果你的公司採用完整版IFRS或完整版PFRS，預期財務報表的編排會從2027年起改變（台灣IFRSs為2028年），你的EBIT數字也會跟著變。檢查是否有任何獎金或財務承諾條款是以會移動的那一行來定義的。</p>`,
    Q('在IFRS 18下，歐元客戶應收帳款的兌換損失歸在哪裡？',['籌資，與利息放在一起','營業，因為應收帳款來自營業活動','稅前淨利以下','直接進權益'],1,
      '兌換差額歸入與產生它的項目相同的類別。客戶餘額屬於營業。'),
    Q('BraceWorks的草稿顯示稅率28.1%，法定稅率則是25%。哪個問題最有用？',['我們為什麼繳這麼多稅？','能讓我看從25%到28.1%的逐項調節嗎？','可以改用25%嗎？','會計師錯了嗎？'],1,
      '所得稅附註會調節法定稅率與有效稅率。每一行若不是永久性的（罰款），就是一個需要管理的訊號（無法使用的海外虧損、前期錯誤）。')
  ]},
  /* ---------------------------------------------------------------- 8 */
  {id:'notes', label:'在附註裡', kind:'apply', title:'判斷寫在哪裡', blocks:[
    `<p>第18單元說明了自家經查核的財務報表要讀哪些地方。本單元的每一個判斷，都會在附註中留下痕跡。以下是該看的地方：</p>`,
    {t:'tbl', head:['你想知道…','看這裡'], rows:[
      ['適用哪一套準則，以及企業是否繼續經營','附註1：編製基礎'],
      ['營業收入何時算數；存貨、發展支出與租賃如何衡量','會計政策'],
      ['哪些估計最難，以及它們有多敏感','重大會計判斷與估計'],
      ['負債準備如何變動：增加、使用、迴轉','負債準備附註'],
      ['租賃負債及其到期時間','租賃附註'],
      ['為什麼稅率不是法定稅率；遞延所得稅','所得稅附註'],
      ['股利、新股、換算準備','權益變動表（第4單元）'],
      ['「調整後」或「基本」利潤，以及排除了什麼','替代性績效衡量指標，或在IFRS 18下關於管理階層績效衡量的附註']
    ]},
    `<p>現在到第22單元的真實年報中，找出這些判斷。打開每一頁，然後作答。</p>
     <p>${BW.reportBtn('arjo','bs','開啟：Arjo 2024年資產負債表')} ${BW.reportBtn('arjo','debt','開啟：Arjo淨負債與特殊項目')}</p>`,
    Q('Arjo（完整版IFRS）在SEK 54.53億的附息負債中，列有非流動租賃負債SEK 8.51億和流動租賃負債SEK 4.28億。它的負債中租賃大約佔多少？',['約5%','約23%','約50%','沒有：租賃不是負債'],1,
      '851 + 428 = 1,279，約為5,453的23%。在IFRS 16下，Arjo把租賃算進淨負債。採用US GAAP或中小企業準則的競爭對手，看起來負債會比較少。'),
    Q('Arjo在2024年報告SEK 1.26億的「特殊項目」，其中包括SEK 6,800萬的重組成本。前一年的重組成本也有SEK 7,200萬。你應該得出什麼結論？',['特殊項目一律應該忽略','每年都發生的成本並不真的特殊；評估基本獲利時要把它算進去','重組從來不是真正的成本','Arjo弄錯了'],1,
      '「特殊」這類標籤是管理階層的判斷。如果年年出現，就把它當成經營事業的正常成本。'),
    `<p>${BW.reportBtn('embla','notes','開啟：Embla Medical部分附註')}</p>`,
    Q('Embla收購Fior & Gentz時，取得的淨資產為USD 1.334億，其中商譽為USD 1.045億。這代表什麼？',['價格大部分是為了預期成長、綜效和團隊：這些無法單獨認列為資產','Fior & Gentz有$1.045億的現金','商譽在10年內攤銷為成本','Embla多付了$1.045億'],0,
      '商譽是價格中沒有對應到可辨認資產的部分。客戶關係和技術已另行評價，列為USD 3,110萬的其他無形資產。在完整版IFRS下，商譽不攤銷，而是每年進行減損測試，這是任何收購方帳上最重大的判斷之一。附註也顯示一筆遞延所得稅負債：取得的無形資產評價高於其課稅基礎。'),
    `<p>${BW.reportBtn('ivc22','gc','開啟：Invacare 2022年，附註1')}</p>`,
    Q('Invacare（US GAAP）在進入美國破產法第11章（重整程序）後申報2022年財務報表。這些報表是以什麼基礎編製的？',['清算基礎','以繼續經營為基礎，並揭露重大疑慮','沒有基礎：已撤回','現金基礎'],1,
      '財務報表假設企業會繼續營運，除非這已不再實際。一旦有疑慮，第一個附註就會說明。任何陷入困境的公司，都要先讀附註1。')
  ]},
  /* ---------------------------------------------------------------- 9 */
  {id:'case', label:'個案：創紀錄的一年', kind:'case', title:'其實不是創紀錄的一年', blocks:[
    CASE('一個很好的1月',
      `<p>現在是1月中。BraceWorks新來的財務經理急著表現，送來年度財務報表草稿：稅前淨利<strong>$148,600</strong>，是去年$74,000的兩倍，而銷售只成長6%。業主想在週五宣布獎金。</p>
       <p>BraceWorks採用<strong>PFRS for SMEs</strong>。你要求看年底分錄與判斷的清單。有六項特別醒目。逐項決定：照原樣接受，還是調整？</p>`),
    W('重編草稿', function(el,ctx){
      const DRAFT=148600;
      const IT=[
        {t:'12月出貨到西班牙',d:'$36,000的床墊在12月28日以DDP出貨，1月9日送達，列為12月營業收入。獲利影響：+$11,200。',adj:-11200,right:'adj',why:'在DDP條件下，交貨時控制才移轉：是1月的營業收入。把$36,000的銷售拿掉，床墊放回存貨。'},
        {t:'測試成本資本化',d:'肥胖患者用床墊$30,000的測試與法規工作被移到資產負債表上，「因為核准幾乎確定」。',adj:-30000,right:'adj',why:'BraceWorks採用PFRS for SMEs，所有研究與發展支出都列為費用。不論前景多好，它都是今年的成本。'},
        {t:'迴轉保固負債準備',d:'迴轉$6,000的保固負債準備，「因為上一季理賠很少」，同時泡棉客訴卻在增加。',adj:-6000,right:'adj',why:'一季清淡不構成證據，而且理賠趨勢指向相反方向。迴轉它是在替明年埋問題。'},
        {t:'延長機器耐用年限',d:'機器耐用年限從10年延長為12年，獲利增加$6,300。一位保養工程師的評估顯示，這些機器通常可運轉12–14年。',adj:-6300,right:'acc',why:'有證據支持的估計變動，從現在起適用並加以揭露。可以接受，但要知道改善中有$6,300來自估計變動，而不是營運變好。'},
        {t:'兌換利益',d:'歐元應收帳款按12月31日匯率產生的$4,500未實現兌換利益。',adj:-4500,right:'acc',why:'這是規則要求的：應收帳款按年底匯率重新評價。接受它，但要告訴業主這不是現金，而且可能反轉。'},
        {t:'經銷商銷貨回饋',d:'美國經銷商A沒有估列任何回饋，「以防他們不符資格」。它今年的採購額是$610,000；5%級距從$600,000開始。',adj:-30500,right:'adj',why:'這一年已經結束，而且已達到級距：5% × $610,000 = $30,500是欠對方的。營業收入必須減少。'}];
      const S=ctx.state; S.rs=S.rs||{}; const st=S.rs;
      el.innerHTML=`<div class="rs-list"></div><div class="rs-run"><span>草稿$148,600 → 你重編後的稅前淨利：<b class="rs-p"></b></span><span class="rs-n"></span></div><div class="rs-end"></div><p style="margin-top:8px"><button type="button" class="linkbtn rs-reset">重新開始</button></p>`;
      const list=el.querySelector('.rs-list');
      IT.forEach((it,i)=>{ const d=E('div','rs-i',`<h5>${i+1}. ${it.t}</h5><p>${it.d}</p><div class="rs-b"><button type="button" class="btn small ghost" data-c="acc">照原樣接受</button><button type="button" class="btn small ghost" data-c="adj">調整</button></div><div class="rs-v" hidden></div>`); list.appendChild(d);
        const v=d.querySelector('.rs-v');
        const show=()=>{ const c=st[i]; if(!c) return; d.classList.add('done'); d.querySelectorAll('[data-c]').forEach(b=>{ b.disabled=true; b.setAttribute('aria-pressed',String(b.dataset.c===c)); if(b.dataset.c===c) b.classList.remove('ghost'); });
          const ok=c===it.right; v.hidden=false; v.className='rs-v '+(ok?'ok':'no'); v.innerHTML=`<strong>${ok?'同意。':'再想想。'}</strong>${it.why}${it.right==='adj'?`影響：${m$(it.adj)}。`:''}`; };
        d.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{ st[i]=b.dataset.c; ctx.save(); show(); upd(); });
        show(); });
      function upd(){
        const p=DRAFT+IT.reduce((t,it,i)=>t+(st[i]==='adj'?it.adj:0),0), n=IT.filter((it,i)=>st[i]).length, right=IT.filter((it,i)=>st[i]===it.right).length;
        el.querySelector('.rs-p').textContent=m$(p); el.querySelector('.rs-n').textContent=`已決定${n}項，共${IT.length}項`;
        const end=el.querySelector('.rs-end');
        if(n<IT.length){ end.innerHTML=''; return; }
        const steps=[{label:'稅前淨利草稿',v:DRAFT,total:true}].concat(IT.filter(it=>it.right==='adj').map(it=>({label:it.t,v:it.adj}))).concat([{label:'重編後稅前淨利',v:70900,total:true}]);
        end.innerHTML=`<div class="msg ${right===IT.length?'good':'warn'}" style="margin-top:12px"><strong>${IT.length}項判斷中，有${right}項與建議一致。</strong>站得住腳的數字是<strong>$70,900</strong>，比去年的$74,000還<em>低</em>一點。這個「創紀錄的一年」其實是持平的一年，加上四筆過度樂觀的分錄。</div><div style="margin-top:12px">${ctx.ui.bridge(steps)}</div>`;
      }
      el.querySelector('.rs-reset').onclick=()=>{ Object.keys(st).forEach(k=>delete st[k]); ctx.save(); BW.go(ctx.mod.id,ctx.mod.sections.indexOf(ctx.sec)); };
      upd();
    }),
    Q('週五之前你該做什麼？',[
      {text:'核准獎金：會計師會抓出任何錯誤', why:'按高估的獲利發出的獎金很難追回，而且查核要好幾個月後才會進行。'},
      {text:'開除財務經理', why:'這裡沒有任何東西被隱藏：你一問，每筆分錄都列出來了。這看起來是在壓力下過度樂觀，不是舞弊。先輔導。'},
      {text:'與財務經理坐下來，談定需要的調整，以重編後的數字決定獎金，並就銷貨回饋、保固與發展支出訂定書面政策'},
      {text:'問銀行怎麼看', why:'銀行會看到查核後的財務報表。先把它弄對。'}],2,
      '這四筆分錄有共同的模式：每一筆都推高獲利，而且每一筆都是應該事先講好的判斷。一份簡短的書面政策（要估列什麼、保固率怎麼訂、什麼可以資本化），能讓明年結帳時少掉很多壓力。'),
    TIP('讓判斷每個月都看得見',
      `<p>要求在月度管理報告中加一頁明細表，列出主要估計（銷貨回饋、保固、存貨、呆帳、任何資本化的項目）、它們的餘額，以及方法有無變動。財務部門只要花十分鐘，就能省下年底的爭論。</p>`)
  ]},
  /* ---------------------------------------------------------------- 10 */
  {id:'quiz', label:'測驗', kind:'quiz', title:'檢查你的理解', blocks:[
    Q('下列哪一項是點算出來的數字，而不是估計？',['保固負債準備','備抵呆帳','歐元銀行存款的餘額','折舊'],2,'它在銀行對帳單上。它的美元價值會隨匯率變動，但歐元金額是點算出來的。'),
    Q('一家經銷商的回饋取決於全年採購額。BraceWorks應該何時為它減少營業收入？',['支付回饋時','隨著採購發生，按預期比率估列，每季更新','只在年底','永遠不用：回饋是推銷費用'],1,'營業收入是你預期能保留的金額。邊做邊估列回饋。'),
    Q('12月29日以DAP出貨的商品在1月5日送達。它們屬於哪一年的營業收入？',['今年：貨已經離開工廠','明年：在DAP條件下，送達時控制移轉','兩年各分一部分','看客戶喜歡哪一年'],1,'在D類條件下，BraceWorks要把貨物送到目的地；控制在那裡移轉。'),
    Q('在完整版IFRS下，BraceWorks將$30,000的發展支出資本化，並分5年攤銷。與列為費用相比，五年合計的獲利會…',['多$30,000','一樣：只有時點不同','少$30,000','多$6,000'],1,'資本化只是把成本在年度間移動。總額和現金都不變。'),
    Q('哪一項在年底需要提列負債準備？',['12月向經銷商宣布的產品回收','明年計畫中的品牌重塑','律師預期會勝訴的訴訟','明年的加薪'],0,'這項公告因過去事件（已售出的瑕疵護具）而產生義務。其他項目不是未來計畫，就是僅為可能。'),
    Q('在IFRS 16下，一份每月$3,000的工廠租約會…',['減少EBITDA','提高EBITDA，並在負債中加入一筆租賃負債','改變付出的現金總額','從帳上消失'],1,'租金由折舊和利息取代，兩者都在EBITDA以下，而這項負債屬於負債。'),
    Q('BraceWorks的財務報表上有一筆遞延所得稅負債。這代表什麼？',['逾期未繳的稅','因稅上扣除較快而延後、日後要繳的稅','應收的退稅','一筆罰款'],1,'暫時性差異會迴轉。這項負債就是差異迴轉時將要繳納的稅。'),
    Q('從2027年起，在IFRS 18下，間接法現金流量表從哪裡開始？',['營業收入','稅後淨利','營業利益','EBITDA'],2,'而且支付的利息移到籌資活動，收到的利息移到投資活動。')
  ]},
  /* ---------------------------------------------------------------- 11 */
  {id:'apply', label:'練習', kind:'apply', title:'用在你自己的財務報表上', blocks:[
    `<p>選讀。下次讀自家的月度管理報告或年度財務報表時，檢查這幾項。這裡的內容不會分享或傳送；勾選只儲存在這個瀏覽器中。</p>`,
    CHECK('m24-judge','在我們的帳上…',[
      '我知道我們適用哪一套準則，以及它如何處理租賃與發展支出',
      '銷貨回饋、退貨與折扣每月估列，而不是付款時才入帳',
      '月底出貨有依國貿條規訂定的書面截止規則',
      '保固負債準備提列率至少每季與實際理賠比對一次',
      '我看得到今年資本化了什麼，逐項列出',
      '兌換損益單獨列示，並分為已實現與未實現',
      '估計變動有列出清單，並附上對獲利的影響',
      '所得稅費用有從法定稅率開始的調節，而且我知道任何遞延所得稅資產所依賴的假設'
    ]),
    REPORT('你週一早上要問的問題',
      `<p>問：<strong>「我們帳上哪三項估計對獲利影響最大？每一項做合理的調整，會有什麼影響？」</strong>好的回答會點出它們，並給出金額。「一切都是標準做法」不算回答。</p>`),
    K('重點整理',
      `<ul>
        <li>現金是點算出來的；其他多數數字都牽涉判斷。六項合理的估計，就能讓獲利相差三倍，而現金一分未動。</li>
        <li>營業收入在控制移轉時認列，金額是扣除回饋與退貨後預期能保留的部分。</li>
        <li>資本化是把成本在年度間移動。你適用的準則往往已替你做了決定。</li>
        <li>負債準備應該隨著實際情況有進有出。留意業績差的年度出現迴轉。</li>
        <li>匯率變動在銷售後產生損益；營業收入不會改變。</li>
        <li>租賃、遞延所得稅與IFRS 18改變的是數字呈現的樣子，而不是事業賺多少。要知道哪些適用於你。</li>
       </ul>`)
  ]}
  ],
  warnings:[
    {sign:'每到季末銷售就暴增，接著出現折讓單', meaning:'通路塞貨：營業收入從下一期提前拉進來。', look:'每週銷售；每季第一個月的折讓單；經銷商存貨。'},
    {sign:'銷貨回饋要到付款時才估列', meaning:'整年營業收入被高估，等回饋結清時再一次受衝擊。', look:'回饋協議，以及至今採購額與各級距的比較。'},
    {sign:'資本化的發展支出持續增加，產品上市卻一再延後', meaning:'成本被暫放在資產負債表上；可能即將沖銷。', look:'專案清單，含日期、至今支出與核准狀態。'},
    {sign:'業績差的年度迴轉負債準備', meaning:'用先前存下的「餅乾罐」來平滑獲利。', look:'負債準備附註：「迴轉」那一行，與理賠紀錄比較。'},
    {sign:'獲利跟著歐元起伏', meaning:'未避險的外幣餘額正在重新評價。', look:'兌換損益，分已實現與未實現；各幣別餘額。'},
    {sign:'虧損公司帳上有一大筆遞延所得稅資產', meaning:'它仰賴可能不會出現的未來利潤。', look:'所得稅附註；背後的獲利預測。'}
  ],
  formulas:[
    {name:'租賃負債（現值）', f:'付款額 × (1 − (1 + r)^−n) ÷ r，r為月利率，n為剩餘月數', ex:'$3,000 × (1 − 1.00533^−60) ÷ 0.00533 ≈ $153,700'},
    {name:'未實現兌換損益', f:'外幣餘額 × (月底匯率 − 前次匯率)', ex:'€40,000 × (1.08 − 1.10) = ($800)'},
    {name:'遞延所得稅負債', f:'(至今稅上扣除額 − 至今帳上折舊) × 稅率', ex:'第3年：($36,000 − $18,000) × 25% = $4,500'},
    {name:'保固負債準備提列額', f:'保固期內銷售額 × 預期理賠率', ex:'$42,000 × 1.5% = 每月$630'}
  ],
  glossary:[
    {term:'收入認列（Revenue recognition）', def:'規範一筆銷售何時算作營業收入（控制移轉時）以及金額多少（扣除預期回饋與退貨後）的規則。'},
    {term:'履約義務（Performance obligation）', def:'合約中一項可區分的承諾，例如商品、訓練或延長保固。每一項在交付時認列為營業收入。'},
    {term:'合約負債（Contract liability）', def:'對尚未交付的東西已收取或已開立帳單的款項，例如訂金或預付的延長保固。'},
    {term:'變動對價（Variable consideration）', def:'價格中取決於日後事件的部分，例如回饋、退貨或罰款。在認列營業收入時估計。'},
    {term:'開立帳單但代管之協議（Bill-and-hold）', def:'應客戶要求，已開立發票但保留在賣方處所的銷售。只有符合嚴格條件時才能認列營業收入。'},
    {term:'寄銷存貨（Consignment stock）', def:'由經銷商保管、但在經銷商售出前仍屬於供應商的存貨。'},
    {term:'通路塞貨（Channel stuffing）', def:'在期末把額外存貨推給經銷商以灌高銷售，通常搭配折扣或較長的付款條件。'},
    {term:'資本化（Capitalise）', def:'把一筆成本記為資產負債表上的資產，並在受益的年度間分攤，而不是現在就列為費用。'},
    {term:'攤銷（Amortisation）', def:'把無形資產（例如資本化的發展支出）的成本在其耐用年限內分攤。'},
    {term:'現場安全矯正措施（Field safety corrective action）', def:'醫療器材廠為降低已上市器材的風險所採取的行動，例如回收或改裝，並向主管機關通報。'},
    {term:'或有負債（Contingent liability）', def:'取決於未來事件的可能義務，例如法律求償，在附註中揭露。'},
    {term:'未實現兌換損益（Unrealised exchange gain or loss）', def:'外幣餘額在收付款前，按月底匯率重新評價所產生的價值變動。'},
    {term:'功能性貨幣（Functional currency）', def:'公司營運所處主要經濟環境的貨幣，也是公司記帳所用的貨幣。'},
    {term:'租賃負債（Lease liability）', def:'在完整版IFRS或PFRS下，支付未來租賃給付的類負債義務。'},
    {term:'使用權資產（Right-of-use asset）', def:'在完整版IFRS或PFRS下，為使用租賃標的之權利所認列的資產，與租賃負債一併認列。'},
    {term:'財務報導架構（Accounting framework）', def:'財務報表所遵循的一套規則，例如完整版PFRS、PFRS for SMEs或IFRS。'},
    {term:'遞延所得稅（Deferred tax）', def:'因會計與稅法規則之間的暫時性差異，未來將繳納或節省的稅。'},
    {term:'有效稅率（Effective tax rate）', def:'所得稅費用總額除以稅前淨利。'},
    {term:'IFRS 18「財務報表之表達及揭露」', def:'規範財務報表表達的IFRS準則，自2027年起生效：損益表中新增營業、投資與籌資類別。'},
    {term:'管理階層績效衡量（Management-defined performance measure）', def:'在IFRS 18下，公司對外使用的自訂利潤衡量指標（例如調整後EBITDA），必須在附註中定義並調節。'},
    {term:'會計估計變動（Change in accounting estimate）', def:'修正後的判斷，例如延長機器耐用年限，從現在起適用並加以揭露，不重編以前年度。'}
  ]
});
})();
