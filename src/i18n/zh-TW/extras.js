/* ===== New sections added to existing modules (from the course review) ===== */
(function(){
'use strict';
const {K,TIP,FLAG,CASE,REPORT,Q,FS,FLIP,SORT,CHECK,W,PACK,money,signed,pct,kfmt} = BW.h;
function addSec(id,beforeId,sec,extra){
  const m=BW.mods[id]; if(!m){ console.error('extras: no module '+id); return; }
  const i=m.sections.findIndex(s=>s.id===beforeId); if(i<0){ console.error('extras: no section '+id+'.'+beforeId); return; }
  m.sections.splice(i,0,sec);
  if(extra){ ['glossary','warnings','formulas'].forEach(k=>{ if(extra[k]) m[k]=(m[k]||[]).concat(extra[k]); }); if(extra.minutes) m.minutes+=extra.minutes; }
}
const npv=(r,f)=>f.reduce((s,c,t)=>s+c/Math.pow(1+r,t),0);

/* ------------------------------------------------------------ M2: payroll accruals */
addSec('m2','case',{id:'payroll', label:'薪資應計項目', kind:'learn', title:'躲到12月才現身的薪資成本', blocks:[
  `<p>薪資是BraceWorks第二大的成本。每月的薪資單並不是全部。有好幾項薪資成本會在一年中逐漸累積、之後才支付，因此每個月都必須估列為<span class="term">應計項目</span>：</p>
   <ul>
    <li><strong>雇主負擔的提撥：</strong>在應發薪資之外，雇主另外負擔的社會保險、健康保險和退休金提撥（第19單元依國家逐一列出）。</li>
    <li><strong>第13個月薪資或年度獎金：</strong>在菲律賓，第13個月薪資是法定給付，每年至少一個月的基本薪資，須在12月24日前發放。</li>
    <li><strong>未休假：</strong>已累積但尚未休的假，可以折現發放或遞延到下一年度。</li>
    <li>月底最後幾天發生、但下個月才支付的<strong>加班費和津貼</strong>。</li>
   </ul>`,
  W('第13個月薪資：有沒有每月估列？', function(el,ctx){
    const M=['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'], base=[2.6,3.2,5.4,4.8,5.0,5.6,3.8,4.2,6.2,5.8,7.4,6.4].map(x=>x*1000), acc=1972, tot=acc*12;
    el.innerHTML='<div data-s></div><div data-o></div>'; const o=el.querySelector('[data-o]');
    const draw=mode=>{ const v=M.map((m,i)=>mode==='acc'?base[i]+tot/12-acc:(i===11?base[i]+tot/12-tot:base[i]+tot/12));
      o.innerHTML=ctx.ui.bars(M.map((m,i)=>({label:m,v:Math.round(v[i]),tone:v[i]<0?'bad':''})),{fmt:x=>money(x),max:Math.max(...v.map(Math.abs))})+
      `<p class="w-hint" style="margin-top:10px">${mode==='acc'?'每月估列$1,972後，每個月都承擔了合理的份額，利潤也反映出真實的營運狀況。':'沒有估列的話，1月到11月看起來都比實際好約$2,000，而12月一次承擔全部的$23,700，把一個好月份變成虧損。'}</p>`; };
    ctx.ui.seg(el.querySelector('[data-s]'),[{v:'no',label:'12月支付時才入帳'},{v:'acc',label:'每月估列'}],'no',draw); draw('no');
  }),
  Q('BraceWorks每月薪資約$23,700。每個月應該估列多少第13個月薪資？',['$23,700','約$1,975','$13,000','12月之前都不用估列'],1,'把一個月的薪資分攤到12個月：$23,700 ÷ 12 ≈ $1,975。'),
  TIP('直接點名要這個科目',`<p>在資產負債表上找「應計第13個月薪資」（或「應計獎金」）。它應該每個月增加，並在12月發放後降到接近零。如果找不到，每月的利潤就被高估了。</p>`)
]},{minutes:8,
  glossary:[{term:'雇主附加人事成本（Payroll on-costs）', def:'在應發薪資之外由雇主負擔的成本：社會保險、健康保險、退休金提撥，以及應計的獎金或休假。'},{term:'應計休假負債（Accrued leave）', def:'員工已累積但尚未休用的假期價值；若可折算現金發放或遞延使用，就列為負債。'}],
  warnings:[{sign:'資產負債表上沒有應計第13個月薪資或獎金', meaning:'每月利潤在12月之前都被高估，到12月再一次重擊。', look:'依類別逐月列示的應計薪資負債。'}]});

/* ------------------------------------------------------------ M4: judgement calls */
addSec('m4','case',{id:'judgement', label:'判斷', kind:'learn', title:'數字背後的判斷', blocks:[
  `<p>帳上有些數字不是事實，而是估計。每一個都需要判斷，而過度樂觀的判斷會美化利潤。對醫療器材製造商來說，以下這些最重要：</p>`,
  {t:'tbl', head:['判斷項目','是什麼','如果太樂觀','該問的問題'], rows:[
    ['<strong>保固負債準備</strong>','在產品售出時，為保固期內維修或更換產品的預期成本所提列的金額。','現在利潤比較好看，理賠之後才找上門。','我們過去的理賠率是多少？負債準備與它相符嗎？'],
    ['<strong>退貨及折讓單</strong>','經銷商預期的退貨，從營業收入中扣除。','營業收入被高估，之後再迴轉。','實際退貨和我們提列的金額相比如何？'],
    ['<strong>客戶銷貨回饋</strong>','客戶達到目標時賺得的數量回饋，在賺得時估列。','在回饋支付前，營業收入都被高估。','我們為哪些回饋協議估列了金額？比率是多少？'],
    ['<strong>資本化或費用化</strong>','一項成本是資產（使用多年），還是當期費用。','把維修說成「改良」，會把成本推到資產負債表上。','我們的資本化政策和門檻是什麼？'],
    ['<strong>租賃</strong>','在完整版PFRS或IFRS（第16號準則）下，大多數租賃會以一項資產和一項負債列在資產負債表上。在中小企業準則下，租金就只是費用。','不同的架構會得出不同的EBITDA和負債數字。','我們採用哪一套架構？它如何處理我們的廠房租賃？'],
    ['<strong>資產減損</strong>','將不再能賺回其價值的設備減記，例如專為停產產品使用的機器。','資產被高估。','有沒有閒置的機器，或綁在我們正逐步淘汰的產品上的機器？'],
    ['<strong>繼續經營</strong>','假設企業至少在未來一年會持續營運。','嚴重問題未被揭露。','預測是否顯示我們未來12個月有能力償還債務？']
  ]},
  SORT('資本化（列為資產）還是費用化（當期成本）？',['資本化','費用化'],[
    {text:'一台新的$60,000布料裁切機', a:0, why:'它會使用好幾年。'},
    {text:'花$1,400更換縫紉機上磨損的皮帶', a:1, why:'讓機器維持運轉的例行維修；沒有延長壽命或增加產能。'},
    {text:'花$18,000安裝並確效新的裁切機', a:0, why:'讓資產達到可使用狀態的成本，屬於資產成本的一部分。'},
    {text:'ISO 13485年度追蹤稽核費', a:1, why:'每年都會發生的營運成本。'},
    {text:'重建一台機器，讓它再多用五年', a:0, why:'延長了耐用年限：屬於改良。'}
  ]),
  Q('BraceWorks年銷售$120萬，提供2年保固。過去理賠成本約為銷售的0.8%。你預期會看到多少保固負債準備？',['$0，等理賠發生再說','每年約增提$9,600，餘額反映兩年內仍在保固期的產品','$120萬','每年$96,000'],1,'0.8% × $120萬 ≈ 每年$9,600。資產負債表上的負債準備，應足以涵蓋仍在保固期的產品預期還會發生的理賠。'),
  TIP('深入了解','<p>這裡是概覽。<strong>第21單元</strong>會用BraceWorks的數字逐一演練這些判斷：收入認列時點和銷貨回饋、開發支出、保固與回收負債準備、匯率、租賃、遞延所得稅，以及適用哪一套規則。</p>')
]},{minutes:10,
  glossary:[{term:'保固負債準備（Warranty provision）', def:'在產品售出時，為未來保固理賠的預期成本所提列的金額。'},{term:'退貨負債準備（Returns provision）', def:'估計客戶將退回的產品，在銷售入帳時從營業收入中扣除。'},{term:'應計銷貨回饋（Rebate accrual）', def:'客戶到目前為止已賺得的數量回饋金額，在賺得時入帳，而不是在支付時。'},{term:'資本化政策（Capitalisation policy）', def:'決定哪些成本列為資產而非費用的規則，通常設有最低金額門檻。'},{term:'使用權資產（Right-of-use asset）', def:'在完整版IFRS或PFRS下，為使用租賃標的之權利所認列的資產，同時認列租賃負債。'},{term:'租賃負債（Lease liability）', def:'在完整版IFRS或PFRS下，支付未來租賃給付的類負債義務。'},{term:'減損（Impairment）', def:'將價值已跌破帳面金額的資產予以減記。'},{term:'繼續經營（Going concern）', def:'假設企業在可預見的未來（至少12個月）會持續營運。'}],
  warnings:[{sign:'成長中的企業卻沒有保固、退貨或銷貨回饋負債準備', meaning:'利潤很可能被高估；之後會有迴轉。', look:'負債準備與理賠及退貨歷史的比較。'},{sign:'維修費用被資本化', meaning:'成本被移到資產負債表；利潤被高估。', look:'固定資產的增添，逐項檢視。'}]});

/* ------------------------------------------------------------ M7: stock levels */
addSec('m7','case',{id:'levels', label:'該持有多少', kind:'play', title:'你應該持有多少存貨？', blocks:[
  `<p>存貨太少會讓產線停擺；太多則會卡住現金。每一種原料都由兩個數字決定：</p>
   <ul>
    <li><strong>再訂購點</strong> = 每日用量 × 供應商前置時間 + <span class="term">安全存量</span>。存貨降到這個水準時，就該下單。</li>
    <li><strong>訂購量：</strong>每次買多少。訂單越大，送貨次數越少，有時價格也更好，但平均存貨也更多。經典的<span class="term">經濟訂購量</span>（EOQ）就是在訂購成本和持有成本之間取得平衡。</li>
   </ul>
   <p>BraceWorks每個工作天約使用3.5 m³的泡棉，供應商需要15個工作天才能交貨。</p>`,
  W('泡棉存貨規劃器', function(el,ctx){
    const top=document.createElement('div'), out=document.createElement('div'); el.append(top,out);
    ctx.ui.sliders(top,[
      {k:'use',label:'每個工作天的泡棉用量',min:2,max:6,step:0.1,v:3.5,f:x=>x.toFixed(1)+' m³'},
      {k:'lead',label:'供應商前置時間',min:5,max:40,step:1,v:15,f:x=>x+' 天'},
      {k:'safe',label:'安全存量',min:0,max:20,step:1,v:5,f:x=>x+' 天用量'},
      {k:'qty',label:'訂購量',min:20,max:250,step:5,v:90,f:x=>x+' m³'}
    ],v=>{
      const rop=v.use*(v.lead+v.safe), avg=v.qty/2+v.use*v.safe, val=avg*200, carry=val*0.2, orders=(v.use*250)/v.qty;
      out.innerHTML=`<div class="stats">${ctx.ui.stat('存貨降到此量時再訂購',rop.toFixed(0)+' m³')}${ctx.ui.stat('平均泡棉存量',avg.toFixed(0)+' m³',`${(avg/v.use).toFixed(0)} 天用量`)}${ctx.ui.stat('卡住的資金',money(Math.round(val)))}${ctx.ui.stat('每年存貨持有成本（20%）',money(Math.round(carry)))}${ctx.ui.stat('每年訂購次數',orders.toFixed(0))}</div>
      <p class="w-hint" style="margin-top:10px">${v.qty>=180?'大量訂購減少了送貨次數，但平均存貨會倍增。大量採購折扣必須大於多出來的持有成本（第5單元的個案）。':v.safe===0?'沒有安全存量：一輛卡車遲到，床墊產線就停擺。對關鍵原料來說，保留幾天的存量是便宜的保險。':'值得爭取更短的前置時間：前置時間每縮短一天，再訂購點就減少3.5 m³。'}</p>`;
    },ctx.uid);
  }),
  `<h3>接單生產還是存貨生產？</h3>`,
  {t:'tbl', head:['','存貨生產','接單生產'], rows:[
    ['<strong>最適合</strong>','標準化、流通快的產品','客製化、流通慢或規格變化多的產品'],
    ['<strong>客戶得到</strong>','直接從貨架快速出貨','需要等待交期'],
    ['<strong>現金</strong>','製成品在接到任何訂單前就卡住現金','訂單確認後才付出現金，最好還能收取訂金'],
    ['<strong>風險</strong>','存貨過時或賣不出去','淡季時產能閒置'],
    ['<strong>在BraceWorks</strong>','標準床墊和最暢銷的吊帶','客製標籤訂單和40種護具規格']
  ]},
  Q('每日用量3.5 m³，前置時間15天，安全存量5天。再訂購點是多少？',['52.5 m³','70 m³','17.5 m³','90 m³'],1,'3.5 × (15 + 5) = 70 m³。')
]},{minutes:10,
  glossary:[{term:'安全存量（Safety stock）', def:'為了因應交貨延遲或意外需求而額外持有的存貨。'},{term:'經濟訂購量（Economic order quantity, EOQ）', def:'在下單成本和持有存貨成本之間取得平衡的訂購數量。'},{term:'前置時間（Lead time）', def:'從下單到收貨之間的時間。'},{term:'存貨生產（Make to stock, MTS）', def:'在接到訂單前先生產標準產品，直接從貨架出貨。'},{term:'接單生產（Make to order, MTO）', def:'客戶訂單確認後才開始生產。'}],
  formulas:[{name:'再訂購點', f:'每日用量 × (前置時間 + 安全存量天數)', ex:'3.5 m³ × (15 + 5) = 70 m³'},{name:'平均存貨', f:'訂購量 ÷ 2 + 安全存量', ex:'90 ÷ 2 + 17.5 = 62.5 m³'}]});

/* ------------------------------------------------------------ M10: OEE */
addSec('m10','case',{id:'oee', label:'OEE與產能', kind:'play', title:'工廠有多少時間真正產出良品？', blocks:[
  `<p><span class="term">OEE</span>（整體設備效率）衡量計畫生產時間中，有多少轉化成良品。它把三種損失相乘：</p>
   <ul>
    <li><strong>可用率：</strong>運轉時間 ÷ 計畫時間。損失來自故障、換線、等待原料。</li>
    <li><strong>性能效率：</strong>實際速度 ÷ 標準速度。損失來自低速運轉和短暫停機。</li>
    <li><strong>品質：</strong>良品數 ÷ 總產出數。損失來自報廢和重工。</li>
   </ul>
   <p>BraceWorks的縫製線：計畫8小時中運轉7小時（87.5%），速度為標準的90%，一次良率95.9%。OEE = 87.5% × 90% × 95.9% = <strong>75.5%</strong>。</p>`,
  W('縫製線OEE', function(el,ctx){
    const top=document.createElement('div'), out=document.createElement('div'); el.append(top,out);
    ctx.ui.sliders(top,[
      {k:'a',label:'可用率',min:60,max:100,step:0.5,v:87.5,f:x=>x.toFixed(1)+'%'},
      {k:'p',label:'性能效率',min:60,max:100,step:0.5,v:90,f:x=>x.toFixed(1)+'%'},
      {k:'q',label:'品質（一次良率）',min:85,max:100,step:0.1,v:95.9,f:x=>x.toFixed(1)+'%'}
    ],v=>{
      const oee=v.a*v.p*v.q/1e4, base=0.755, extra=(oee/base-1)*640;
      out.innerHTML=`<div class="stats">${ctx.ui.stat('OEE',oee.toFixed(1)+'%',oee>=85?'good':oee>=65?'warn':'bad','世界級水準常被引用為約85%')}${ctx.ui.stat('縫製線每週產出',Math.round(640*oee/75.5)+' 件','',`目前640`)}${ctx.ui.stat('每年額外邊際貢獻（若有需求）',money(Math.round(Math.max(0,extra)*48*35)),'','以每件約$35邊際貢獻計')}</div>
      <p class="w-hint" style="margin-top:10px">縫製是瓶頸（第13單元），所以在這裡每提升一個OEE百分點，就是整座工廠的額外產出，往往比買一台新機器便宜。透過減少換線或等料來小幅提高可用率，通常是最容易的成果。</p>`;
    },ctx.uid);
  }),
  K('為什麼財務在乎OEE',`<p>OEE低會把你已經付錢買下的產能藏起來，推高單位成本（相同的製造費用分攤到更少的良品上），還可能導致你買了不需要的設備。在核准產能投資（第14單元）之前，先問：這道製程目前的OEE是多少？</p>`),
  Q('可用率90%，性能效率85%，品質98%。OEE是多少？',['85%','約75%','90%','98%'],1,'0.90 × 0.85 × 0.98 ≈ 75%。')
]},{minutes:8,
  glossary:[{term:'OEE（整體設備效率）', def:'可用率 × 性能效率 × 品質：計畫時間中產出良品的比例。'},{term:'可用率（Availability）', def:'運轉時間占計畫生產時間的比例。'},{term:'性能效率（Performance rate）', def:'實際生產速度占標準速度的比例。'},{term:'產能利用率（Capacity utilisation）', def:'實際產出占最大可能產出的比例。'}],
  formulas:[{name:'OEE', f:'可用率 × 性能效率 × 品質', ex:'87.5% × 90% × 95.9% = 75.5%'}]});

/* ------------------------------------------------------------ M14: new product */
addSec('m14','case',{id:'npd', label:'新產品', kind:'play', title:'投資一項新產品', blocks:[
  `<p>對醫療器材製造商來說，推出一項產品往往比任何一台機器都是更大的投資。BraceWorks正在評估一款<strong>肥胖病患用減壓床墊</strong>。它的現金流量和機器的不一樣：</p>`,
  FS({title:'肥胖病患用床墊：計畫', rows:[
    '第0年',
    ['設計、原型和使用者試用',-25000,'ind'],['測試、技術文件和法規送審',-30000,'ind'],['模具和裁切版型',-15000,'ind'],['上市行銷和樣品',-10000,'ind'],['額外營運資金（存貨和應收帳款）',-20000,'ind'],
    ['投資總額',-100000,'sub'],
    '上市後的邊際貢獻',
    ['第1年（爬坡期）',20000,'ind'],['第2年',45000,'ind'],['第3至6年，每年',55000,'ind'],['第6年底收回的營運資金',20000,'ind']
  ], note:'以11%（BraceWorks的資金成本，第20單元）計算的NPV：約+$103,700。回收期間：約2.6年。'}),
  W('如果核准延遲，或銷售較慢呢？', function(el,ctx){
    const top=document.createElement('div'), out=document.createElement('div'); el.append(top,out);
    ctx.ui.sliders(top,[
      {k:'vol',label:'銷售量相對於計畫',min:40,max:130,step:5,v:100,f:x=>x+'%'},
      {k:'delay',label:'法規核准延遲',min:0,max:2,step:1,v:0,f:x=>x+(x===1?' 年':' 年')},
      {k:'reg',label:'法規成本相對於計畫',min:100,max:250,step:10,v:100,f:x=>x+'%'}
    ],v=>{
      const c=[20000,45000,55000,55000,55000,55000].map(x=>x*v.vol/100);
      const inv=-(70000+30000*v.reg/100);
      const f=[inv]; for(let i=0;i<v.delay;i++) f.push(-10000); c.forEach((x,i)=>f.push(x+(i===c.length-1?20000:0)));
      const N=npv(0.11,f); let cum=0,pb=null; for(let t=0;t<f.length;t++){ const p=cum; cum+=f[t]; if(pb===null&&cum>=0&&t>0) pb=t-1+(-p)/f[t]; }
      out.innerHTML=`<div class="stats">${ctx.ui.stat('以11%計算的NPV',money(Math.round(N)),N>0?'good':'bad')}${ctx.ui.stat('回收期間',pb===null?'無法回收':pb.toFixed(1)+' 年',pb===null||pb>4?'bad':pb>3?'warn':'good')}</div>`+
        ctx.ui.bars(f.map((x,t)=>({label:t===0?'現在':'第'+t+'年',v:Math.round(x),tone:x<0?'bad':'good'})),{fmt:x=>money(x)})+
        `<p class="w-hint" style="margin-top:10px">${N<0?'在這些假設下，這項產品會毀損價值。能不能分階段上市，或與經銷商分攤法規作業？':'每延遲一年，就損失一年的邊際貢獻，還要負擔維持專案團隊的成本。法規時程和銷售預測一樣值得仔細審視。'}</p>`;
    },ctx.uid);
  }),
  TIP('在帳上如何呈現',`<p>研究支出在發生時列為費用。在完整版PFRS或IFRS下，發展支出符合嚴格條件（技術可行性、出售的意圖與能力、可靠的成本追蹤）後即可資本化；許多小公司則直接費用化。無論如何，都要單獨追蹤專案支出，這樣才能對這次上市做投資後檢討（第14單元）。</p>`),
  Q('為什麼新產品比機器需要更仔細的審視？',['其實不需要','銷售量和法規時程不確定得多，而且每延遲一年就損失一年的邊際貢獻','機器從不故障','新產品不需要營運資金'],1,'在投入之前，先測試銷售量、延遲和法規成本。')
]},{minutes:10,
  glossary:[{term:'產品開發支出（Product development costs）', def:'設計、測試和取得認證一項新產品的支出。研究支出列為費用；在完整版IFRS或PFRS下，發展支出符合嚴格規定時可資本化。'},{term:'技術文件（Technical file）', def:'證明醫療器材符合法規要求的文件，取得CE標誌及類似核准時需要。'}]});

/* ------------------------------------------------------------ M17: insurance and risk register */
addSec('m17','case',{id:'risk', label:'保險與風險', kind:'learn', title:'保險與風險登錄表', blocks:[
  `<p>懂財務的總經理知道哪些風險由企業自留、哪些投保、哪些設法降低。一頁的<span class="term">風險登錄表</span>列出每項主要風險的發生可能性、造成的衝擊、負責人以及正在採取的措施。</p>`,
  {t:'tbl', head:['保險類型','保障範圍','對BraceWorks的重要性'], rows:[
    ['<strong>產品責任保險</strong>','產品造成他人受傷的求償','醫療器材必備。經銷商和醫院常會要求提供保險證明。'],
    ['<strong>產品回收保險</strong>','追溯、下架和更換產品的成本','一次現場矯正行動的成本可能超過一年的利潤（第8單元）。'],
    ['<strong>財產及營業中斷保險</strong>','火災、水災、機器故障，以及重建期間損失的利潤','單一工廠發生一場火災，所有銷售就停擺。'],
    ['<strong>海上貨物運輸保險</strong>','運輸途中的滅失或損壞','在CIF條件下，你必須為買方投保（第17單元）；在FOB條件下，要確認由誰投保。'],
    ['<strong>信用保險</strong>','客戶不付款','涵蓋出口應收帳款（第17單元）。'],
    ['<strong>舞弊及網路保險</strong>','變更匯款帳戶詐騙、駭客入侵、員工竊盜','第18單元那起$18,400的電子郵件詐騙。']
  ]},
  {t:'fig', title:'BraceWorks的風險地圖', draw:function(w){
    const P=BW.viz.p, R=[['最大客戶流失',3,4],['產品回收',2,5],['泡棉價格飆漲',4,3],['歐元貶值10%',3,3],['工廠火災',1,5],['付款詐騙',3,2],['關鍵人員離職',3,3.6]];
    const lw=34, s=Math.min(w-lw-10,420), cell=s/5, x0=lw+(w-lw-10-s)/2, y0=8; let g='';
    for(let i=0;i<5;i++) for(let j=0;j<5;j++){ const sc=(i+1)*(j+1), cls=sc>=12?'v-f-q3':sc>=6?'v-f-q1':'v-f-q0'; g+=`<rect x="${P.f(x0+i*cell+1)}" y="${P.f(y0+(4-j)*cell+1)}" width="${P.f(cell-2)}" height="${P.f(cell-2)}" rx="3" class="${cls}" opacity=".55"/>`; }
    R.forEach((r,k)=>{ const cx=x0+(r[1]-0.5)*cell, cy=y0+(5-r[2]+0.5)*cell; g+=`<circle cx="${P.f(cx)}" cy="${P.f(cy)}" r="11" class="v-badge" data-tip="${r[0]}|可能性 ${r[1]}／5 · 衝擊 ${Math.round(r[2])}／5"/>`+P.txt(cx,cy+4,String(k+1),'v-badge-t'); });
    g+=P.txt(x0+s/2,y0+s+18,'可能性 →','v-ax')+`<text x="12" y="${P.f(y0+s/2)}" class="v-ax" text-anchor="middle" transform="rotate(-90 12 ${P.f(y0+s/2)})">衝擊 →</text>`;
    return P.svg(w,y0+s+26,'依可能性和衝擊標示BraceWorks七項風險的風險地圖。',g)+`<ol class="small" style="margin:8px 0 0;padding-left:20px;columns:2;column-gap:20px">${R.map(r=>`<li>${r[0]}</li>`).join('')}</ol>`;
  }, caption:'右上角是最該優先處理的區域：可能發生且傷害大。保險適合處理罕見但嚴重的風險（火災、回收）；經常發生的風險，例如客戶流失或價格飆漲，需要的是管理行動，而不是保險。'},
  Q('哪一種風險最難靠保險解決？',['工廠火災','產品責任求償','最大客戶轉向競爭對手','一批貨物在海上滅失'],2,'失去客戶是一種營運風險，要靠分散客戶、服務和定價來管理，而不是可以投保的東西。')
]},{minutes:8,
  glossary:[{term:'風險登錄表（Risk register）', def:'列出企業主要風險的清單，包含可能性、衝擊、負責人和因應措施。'},{term:'產品責任保險（Product liability insurance）', def:'承保因產品造成傷害或損害而遭求償的保險。'},{term:'營業中斷保險（Business interruption insurance）', def:'承保企業在火災等損害後復原期間所損失利潤的保險。'},{term:'海上貨物運輸保險（Marine cargo insurance）', def:'承保貨物在運輸途中滅失或損壞的保險。'}]});

/* ------------------------------------------------------------ M18: audited accounts, owner dealings, delegation */
addSec('m18','case',{id:'statutory', label:'你的查核財報', kind:'learn', title:'閱讀你的經查核財務報表', blocks:[
  `<p>每年一次，會計師會簽署法定財務報表。月度管理報告是用來經營企業的；經查核的財務報表則是銀行、稅務機關和買方所依賴的。在裡面要讀三件事。</p>
   <h3>1. 前幾頁的會計師查核意見</h3>`,
  {t:'tbl', head:['意見','代表什麼','該怎麼做'], rows:[
    ['<strong>無保留意見（「乾淨」的意見）</strong>','財務報表允當表達。','正常結果。'],
    ['<strong>無保留意見，但附「強調事項」或繼續經營說明</strong>','允當表達，但會計師希望讀者注意某件事，例如對償債能力的疑慮。','銀行會來問。準備好一份計畫給他們看。'],
    ['<strong>保留意見</strong>','除了某個特定問題之外允當表達，例如存貨無法查證。','在下一年度之前解決根本原因；貸款人會很重視這件事。'],
    ['<strong>否定意見或無法表示意見</strong>','財務報表未允當表達，或會計師無法形成意見。','對銀行、客戶和稅務機關來說都是嚴重問題。']
  ]},
  `<h3>2. 財務報導架構和會計政策</h3>
   <p>第一個附註會說明財務報表遵循哪一套規則。在菲律賓，依公司規模不同，會是完整版PFRS、中小企業適用之PFRS或小型企業適用之PFRS。接著，會計政策會說明營業收入、存貨、折舊和負債準備如何衡量。檢查它們是否與月度報告的編製方式一致：如果不一致，年底就會有意外。</p>
   <h3>3. 值得一讀的附註</h3>
   <ul>
    <li><strong>判斷與估計：</strong>管理階層必須推估的地方，例如負債準備和存貨價值（也就是本單元談到的判斷）。</li>
    <li><strong>關係人：</strong>與股東、其家人及其他所屬公司之間的往來。</li>
    <li><strong>承諾及或有事項：</strong>尚未列在資產負債表上的承諾和可能負債，例如保證或法律求償。</li>
    <li><strong>報導期間後事項：</strong>在財務報表簽署前發生的任何重大事件。</li>
   </ul>`,
  Q('會計師的查核報告是無保留意見，但附有繼續經營的說明。這代表什麼？',['沒什麼好擔心的','財務報表允當表達，但對企業未來一年能否償還債務存有疑慮','會計師拒絕簽名','稅繳少了'],1,'預期銀行會來詢問，並準備一份現金計畫來回答。')
]},{minutes:8,
  glossary:[{term:'無保留意見（Unqualified opinion）', def:'「乾淨」的查核意見：財務報表允當表達。'},{term:'保留意見（Qualified opinion）', def:'認為財務報表除特定事項外允當表達的查核意見。'},{term:'強調事項（Emphasis of matter）', def:'在無保留意見的查核報告中，提醒讀者注意重要議題（例如繼續經營）的段落。'},{term:'或有負債（Contingent liability）', def:'取決於未來事件的可能義務，例如法律求償，於附註中揭露。'},{term:'財務報導架構（Accounting framework）', def:'財務報表所遵循的一套規則，例如完整版PFRS、中小企業適用之PFRS或IFRS。'}]});

addSec('m18','case',{id:'governance', label:'股東與權限', kind:'learn', title:'股東往來與誰能核准什麼', blocks:[
  `<h3>股東及關係人交易</h3>
   <p>在老闆經營的公司裡，個人和公司的錢常常界線模糊。這很重要，因為它會扭曲利潤率、可能在稅務上被剔除，也會讓銀行和買方擔心。常見的例子：</p>
   <ul>
    <li>由公司支付的個人費用：汽車、旅遊、家人的手機。</li>
    <li>列在薪資名冊上、但沒有在公司工作的家人。</li>
    <li>與老闆之間沒有書面條件的借貸。</li>
    <li>向老闆控制的另一家公司採購或銷售，價格沒有人核對過。</li>
   </ul>
   <p>這些不一定是錯的。它們需要<strong>被知悉、有文件記錄、公平定價並單獨列示</strong>，讓月度報告呈現真實的營運狀況。會計師會把它們列為關係人交易。</p>`,
  `<h3>核決權限</h3>
   <p>一張一頁的表格，寫明誰可以核准什麼、金額上限多少。它能加快決策（大家知道自己可以行動），也能保護企業（重大決策會多一道把關）。</p>`,
  {t:'tbl', head:['決策','領班或經理','總經理','老闆或董事會'], rows:[
    ['原料採購單（在預算內）','$5,000以下','$50,000以下','超過$50,000'],
    ['其他支出','$1,000以下','$10,000以下','超過$10,000'],
    ['設備採購','–','資本支出預算內$15,000以下','超過$15,000或在預算外'],
    ['低於底價的價格，或特殊條件','–','可以，但需做邊際貢獻檢查','訂單金額超過$25,000'],
    ['新客戶信用額度','$10,000以下（財務）','$50,000以下','超過$50,000'],
    ['招募','在預算人數內','預算內的新職位','預算外的職位'],
    ['銀行付款','第二核准人','超過$10,000','超過$50,000'],
    ['借款、保證、股利','–','–','一律']
  ]},
  `<p class="small" style="color:var(--muted)">以上是適用於BraceWorks規模企業的範例數字。與老闆一起訂出你們自己的數字，寫下來，並每年檢討一次。</p>`,
  Q('老闆的汽車和家人的手機費用都由公司支付。最好的做法是什麼？',['藏在雜項費用裡','單獨記錄為老闆的成本或福利，與會計師議定處理方式，並與營業費用分開列示','停止支付老闆','不予理會'],1,'公開且有文件記錄就沒問題。藏起來會扭曲利潤率，並產生稅務風險。')
]},{minutes:8,
  glossary:[{term:'關係人（Related party）', def:'與企業有關聯的個人或公司：股東、其家人，以及他們控制的公司。'},{term:'核決權限（Delegation of authority）', def:'一份書面表格，列明誰可以核准哪些決策、金額上限多少。'}],
  warnings:[{sign:'老闆或家人的費用混在營業費用裡', meaning:'利潤率被扭曲；有稅務剔除風險；買方和銀行會打折看待這些數字。', look:'關係人清單；老闆相關成本單獨列示。'}]});

/* ------------------------------------------------------------ M9: systems, data and new requests */
addSec('m9','case',{id:'systems', label:'系統與資料', kind:'learn', title:'系統、資料與新的需求', blocks:[
  `<p>好的報告仰賴好的資料。有三件事決定它能好到什麼程度。</p>
   <h3>1. 一套系統，一個版本的真相</h3>
   <p>當銷售、存貨、採購和帳務都在同一套整合系統（<span class="term">ERP</span>）裡，數字彼此就會一致。當它們分散在不同的試算表裡，每個月都得有人去調節，錯誤就會漏網。你不需要昂貴的系統，但存貨和成本計算應該和帳務來自同一個地方。</p>
   <h3>2. 主檔資料</h3>
   <p>物料清單、製程途程、標準成本、客戶付款條件和價目表，是每份報告賴以建立的<span class="term">主檔資料</span>。第7單元那個布料用量錯誤就是主檔資料錯誤。為每一類主檔資料指定負責人，並至少每年檢討一次。</p>
   <h3>3. 謹慎使用試算表</h3>
   <p>試算表很適合做分析，但當作正式紀錄系統就有風險：公式會被覆蓋，版本越來越多。把輸入、計算和輸出分開，並請人檢查任何用於定價、薪資或月度報告的試算表。</p>`,
  K('較新的需求：永續資訊',
    `<p>大客戶，尤其是歐洲的醫院集團，越來越常要求供應商提供能源使用、原料、廢棄物和碳排放的資料，有時還是投標的一部分。這些數字和你的成本來自同樣的地方：水電帳單、採購紀錄和生產量。如果你算得出每張床墊的成本，通常也能估算每張床墊的能源和原料用量。在標案要求之前，現在就開始蒐集。</p>`),
  Q('第7單元的存貨盤點發現，床墊的物料清單用量是4.2 m的布料，而裁切人員實際用了4.6 m。這屬於哪一類問題？',['舞弊問題','主檔資料問題：系統裡一個錯誤的標準，而所有成本和報告都依賴它','稅務問題','銀行問題'],1,'主檔資料需要負責人和定期檢討。')
]},{minutes:6,
  glossary:[{term:'ERP（企業資源規劃系統）', def:'企業資源規劃：涵蓋銷售、存貨、採購、生產和帳務的整合系統。'},{term:'主檔資料（Master data）', def:'報告賴以建立的核心參考資料：物料清單、製程途程、標準成本、客戶條件、價目表。'},{term:'永續（ESG）資訊（Sustainability data）', def:'有關環境、社會和治理績效的資訊，例如能源使用和排放量，客戶越來越常要求提供。'}]});
})();
