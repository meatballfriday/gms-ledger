/* ===== Module 11: Ratios and KPIs ===== */
(function(){
const {K,TIP,FLAG,CASE,REPORT,Q,FS,FLIP,SORT,CHECK,W,PACK,money,signed,pct,kfmt} = BW.h;

// value, target, status g/a/r, leading?, how computed
const LIB=[
  {g:'銷售與成長', id:'growth', n:'營收較去年成長', v:'9.1%', t:'10%', s:'a', lead:false, f:'今年營業收入 ÷ 去年營業收入 − 1'},
  {g:'銷售與成長', id:'b2b', n:'訂單出貨比（B/B值，季）', v:'0.92', t:'≥ 1.00', s:'r', lead:true, f:'接單金額 ÷ 出貨銷貨金額'},
  {g:'銷售與成長', id:'backlog', n:'未出貨訂單', v:'1.8個月', t:'2.0個月', s:'a', lead:true, f:'未出貨訂單 ÷ 平均每月銷貨'},
  {g:'銷售與成長', id:'conc', n:'最大客戶占銷貨比重', v:'22%', t:'< 20%', s:'a', lead:true, f:'最大客戶銷貨 ÷ 銷貨總額'},
  {g:'銷售與成長', id:'win', n:'報價成交率', v:'31%', t:'35%', s:'a', lead:true, f:'成交報價數 ÷ 發出報價數'},
  {g:'獲利能力', id:'gm', n:'毛利率', v:'28.3%', t:'30%', s:'a', lead:false, f:'營業毛利 ÷ 營業收入'},
  {g:'獲利能力', id:'ebitda', n:'EBITDA利潤率', v:'11.0%', t:'12%', s:'a', lead:false, f:'（營業利益 + 折舊）÷ 營業收入'},
  {g:'獲利能力', id:'net', n:'淨利率', v:'4.6%', t:'6%', s:'a', lead:false, f:'本期淨利 ÷ 營業收入'},
  {g:'獲利能力', id:'rpe', n:'每位員工營收', v:'$24,000', t:'$26,000', s:'a', lead:false, f:'營業收入 ÷ 平均員工人數'},
  {g:'營運', id:'otif', n:'準時足量交貨率（OTIF）', v:'87%', t:'95%', s:'r', lead:true, f:'準時且足量交付的訂單 ÷ 已交付訂單'},
  {g:'營運', id:'scrap', n:'報廢率', v:'4.1%', t:'3.0%', s:'r', lead:true, f:'報廢材料 ÷ 領用材料'},
  {g:'營運', id:'fpy', n:'一次良率', v:'95.9%', t:'97%', s:'a', lead:true, f:'首次即通過品保的數量 ÷ 檢驗數量'},
  {g:'營運', id:'eff', n:'人工效率', v:'93%', t:'95%', s:'a', lead:true, f:'達成標準工時 ÷ 實際工作時數'},
  {g:'營運', id:'coq', n:'品質成本', v:'8.4%', t:'6%', s:'r', lead:false, f:'（預防 + 鑑定 + 失敗成本）÷ 營業收入'},
  {g:'現金與營運資金', id:'dso', n:'應收帳款週轉天數', v:'70天', t:'60天', s:'r', lead:true, f:'應收帳款 ÷ 營業收入 × 365'},
  {g:'現金與營運資金', id:'od60', n:'逾期超過60天的應收帳款', v:'15.7%', t:'< 5%', s:'r', lead:true, f:'逾期 > 60天的應收帳款 ÷ 應收帳款總額'},
  {g:'現金與營運資金', id:'dio', n:'存貨週轉天數', v:'106天', t:'85天', s:'r', lead:true, f:'存貨 ÷ 銷貨成本 × 365'},
  {g:'現金與營運資金', id:'dpo', n:'應付帳款週轉天數', v:'63天', t:'60天', s:'g', lead:false, f:'應付帳款 ÷ 材料採購額 × 365'},
  {g:'現金與營運資金', id:'ccc', n:'現金轉換循環', v:'113天', t:'85天', s:'r', lead:false, f:'DSO + 存貨週轉天數 − 應付帳款週轉天數'},
  {g:'現金與營運資金', id:'head', n:'未來13週最低可用額度餘裕', v:'$41,000', t:'≥ $30,000', s:'g', lead:true, f:'預測最低值（現金 + 未動用額度）'},
  {g:'現金與營運資金', id:'cconv', n:'現金轉換率', v:'25%', t:'70%', s:'r', lead:false, f:'營業活動現金流量 ÷ EBITDA'},
  {g:'財務實力', id:'cr', n:'流動比率', v:'2.11', t:'≥ 1.5', s:'g', lead:false, f:'流動資產 ÷ 流動負債'},
  {g:'財務實力', id:'nd', n:'淨負債對EBITDA比', v:'1.35×', t:'≤ 2.0×', s:'g', lead:false, f:'（銀行借款 − 現金）÷ EBITDA'},
  {g:'財務實力', id:'ic', n:'利息保障倍數', v:'6.7×', t:'≥ 4×', s:'g', lead:false, f:'營業利益 ÷ 利息（銀行常改用EBITDA ÷ 利息）'},
  {g:'財務實力', id:'roce', n:'已動用資本報酬率', v:'15.9%', t:'15%', s:'g', lead:false, f:'營業利益 ÷（資產總額 − 流動負債）'}
];
const REC=['gm','ebitda','b2b','conc','otif','scrap','dso','dio','head','nd'];

BW.add({
  id:'m11', minutes:40,
  title:'財務比率與KPI',
  subtitle:'五十個數字會把你淹沒。精挑細選的十個，每個都有目標、趨勢和負責人，就能讓你管好這門生意。',
  goals:[
    '選擇能促成決策的KPI，兼顧領先與落後指標',
    '計算並解讀資本報酬率，看懂背後的三個槓桿',
    '為BraceWorks建立一頁式儀表板，再為你自己的企業建立一份',
    '辨認「綠燈」KPI何時掩蓋了問題'
  ],
  sections:[
  {id:'good', label:'好的KPI具備什麼', kind:'learn', title:'值得追蹤的KPI具備哪些條件', blocks:[
    `<p><span class="term">KPI</span>（關鍵績效指標）是你持續關注的數字，因為它告訴你企業是否走在正軌上。大多數小公司要不是完全沒有KPI，就是多到沒人去看。好的KPI要通過五項檢驗：</p>
     <ol>
      <li><strong>它會促成決策。</strong>如果這個數字變了，你會採取不同的做法嗎？如果不會，就刪掉它。</li>
      <li><strong>它有目標。</strong>87%的OTIF毫無意義，直到你知道目標是95%。</li>
      <li><strong>它呈現趨勢。</strong>是變好還是變差？至少呈現最近六個月。</li>
      <li><strong>它有負責人。</strong>一個能改變它、並在它變動時負責說明的人。</li>
      <li><strong>它的定義只訂一次，絕不悄悄更改。</strong>否則你比較的會是不同的東西。</li>
     </ol>`,
    K('兼顧領先與落後指標',
      `<p><strong>落後</strong>KPI（毛利率、本期淨利）告訴你結果。<strong>領先</strong>KPI（訂單出貨比、報廢率、逾期應收帳款）告訴你結果將會如何。只有落後指標的儀表板，就像看著後照鏡開車。目標是大約各占一半。</p>`),
    SORT('領先還是落後？',['領先','落後'],[
      {text:'本月接單金額', a:0, why:'今天的訂單就是下個月的銷貨。'},
      {text:'上一季本期淨利', a:1, why:'它報告的是已經發生的結果。'},
      {text:'本週裁切線的報廢率', a:0, why:'報廢上升會在幾週後反映在毛利率上。'},
      {text:'全年毛利率', a:1, why:'是結果。'},
      {text:'逾期超過60天的應收帳款', a:0, why:'可預測呆帳和現金短缺。'},
      {text:'每位員工營收', a:1, why:'總結的是過去的表現。'}
    ])
  ]},
  {id:'set', label:'BraceWorks的數字', kind:'learn', title:'值得了解的25個數字', blocks:[
    `<p>以下是BraceWorks對照同類企業合理目標的評分。你不會把全部25個都放上儀表板，但應該知道每一個的意思。紅燈代表遠離目標，黃燈代表接近，綠燈代表達標。</p>`,
    {t:'html', html: (()=>{ const groups=[...new Set(LIB.map(k=>k.g))]; const dot=s=>`<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:var(--${s==='g'?'good':s==='a'?'amber':'red'});margin-right:6px"></span>`;
      return groups.map(g=>`<h3 style="margin:18px 0 8px">${g}</h3>`+BW.ui.table(['KPI','BraceWorks','目標','類型'],LIB.filter(k=>k.g===g).map(k=>[`${dot(k.s)}<strong>${k.n}</strong><div class="small" style="color:var(--muted)">${k.f}</div>`,k.v,k.t,k.lead?'領先':'落後']),{num:[1,2]})).join(''); })()},
    TIP('目標從哪裡來？',
      `<p>三個來源：你自己過去的最佳表現、你的預算，以及同類公司的水準。像你這種規模的企業很難找到產業標竿，所以先從「比去年好」開始，隨著經驗累積再逐步收緊。</p>`)
  ]},
  {id:'roce', label:'資本報酬率', kind:'learn', title:'這門生意值得投入其中的資金嗎？', blocks:[
    `<p>光看利潤無法判斷一門生意好不好。$55,500的利潤，若來自$100,000的投資就很亮眼，若來自$200萬就很差。報酬率把利潤和為了賺取它而投入的資金相比較。</p>`,
    {t:'tbl', head:['比率','公式','BraceWorks','它回答的問題'], opts:{num:[2]}, rows:[
      ['<strong>已動用資本報酬率（ROCE）</strong>','營業利益 ÷（資產總額 − 流動負債）','$94,000 ÷ $591,500 = 15.9%','企業運用所有長期資金（負債與權益合計）的效率如何？'],
      ['<strong>權益報酬率（ROE）</strong>','本期淨利 ÷ 權益','$55,500 ÷ $491,500 = 11.3%','股東在他們的持股上賺到多少報酬？']
    ]},
    `<p>把ROCE和資金的成本相比。BraceWorks的借款利率約為6.4%。資本報酬15.9%遠高於此，所以借錢投資這門生意創造了價值。如果ROCE跌破借款成本，每多借一塊錢都會讓股東更窮。</p>
     <h3>ROE背後的三個槓桿</h3>
     <p>權益報酬率可以拆成三個部分，這種拆解常被稱為杜邦分析（DuPont analysis）：</p>
     <p class="num" style="font-weight:600">ROE = 淨利率 × 資產週轉率 × 財務槓桿</p>
     <ul>
      <li><strong>淨利率</strong>（本期淨利 ÷ 營業收入）：每筆銷貨賺多少利潤。BraceWorks為4.6%。</li>
      <li><strong>資產週轉率</strong>（營業收入 ÷ 資產總額）：資產的運用效率。BraceWorks為1.42。</li>
      <li><strong>財務槓桿</strong>（資產總額 ÷ 權益）：企業有多少比例由負債支應。BraceWorks為1.72。</li>
     </ul>`,
    W('ROE槓桿', function(el, ctx){
      const {pct}=ctx.h;
      const top=document.createElement('div'), out=document.createElement('div'); el.append(top,out);
      ctx.ui.sliders(top,[
        {k:'m',label:'淨利率',min:1,max:10,step:0.1,v:4.6,f:x=>x.toFixed(1)+'%'},
        {k:'t',label:'資產週轉率',min:0.8,max:2.5,step:0.01,v:1.42,f:x=>x.toFixed(2)+'×'},
        {k:'l',label:'財務槓桿（資產 ÷ 權益）',min:1.1,max:3.5,step:0.01,v:1.72,f:x=>x.toFixed(2)+'×'}
      ],(v)=>{
        const roe=v.m/100*v.t*v.l;
        out.innerHTML=`<div class="stats">${ctx.ui.stat('權益報酬率',pct(roe),roe>=0.15?'good':roe<0.08?'bad':'warn','原為11.3%')}</div>
        <p class="w-hint" style="margin-top:10px">${v.l>2.5?'高財務槓桿能拉高ROE，但也會提高風險。負債沉重時碰上壞年頭，可能把權益一掃而空。銀行也會限制你能槓桿到什麼程度。':v.t>1.7?'資產週轉加快，通常來自更少的存貨和更少的未收款發票。第16單元會教你怎麼做。這往往是最安全的槓桿。':v.m>6?'對BraceWorks這種利潤率很薄的企業來說，利潤率是最有力的槓桿。':'試著把資產週轉率提高到1.70，BraceWorks可以藉由降低存貨和應收帳款達成。然後和透過增加負債得到相同ROE的做法相比。'}</p>`;
      },ctx.uid);
    })
  ]},
  {id:'dash', label:'建立你的儀表板', kind:'play', title:'建立一頁式儀表板', blocks:[
    `<p>為BraceWorks的月度儀表板選出最多12個KPI。盡量在各組之間取得平衡，並讓大約一半是領先指標。你的選擇會儲存在這個瀏覽器中。</p>`,
    W('儀表板建構器', function(el, ctx){
      const S=ctx.state; if(!Array.isArray(S.dash)) S.dash=REC.slice();
      el.innerHTML=`<div class="row"><button type="button" class="btn ghost small" data-rec>使用建議的十個</button><button type="button" class="linkbtn" data-clear>全部清除</button></div><div data-pick style="display:grid;gap:12px"></div><div data-prev></div>`;
      const pick=el.querySelector('[data-pick]'), prev=el.querySelector('[data-prev]');
      const groups=[...new Set(LIB.map(k=>k.g))];
      function drawPick(){
        pick.innerHTML='';
        groups.forEach(g=>{ const box=document.createElement('div'); box.innerHTML=`<div class="eyebrow" style="margin-bottom:6px">${g}</div>`; const seg=document.createElement('div'); seg.className='seg';
          LIB.filter(k=>k.g===g).forEach(k=>{ const b=document.createElement('button'); b.type='button'; b.textContent=k.n; b.setAttribute('aria-pressed',String(S.dash.includes(k.id)));
            b.onclick=()=>{ if(S.dash.includes(k.id)) S.dash=S.dash.filter(x=>x!==k.id); else { if(S.dash.length>=12) return flash(); S.dash.push(k.id); } ctx.save(); b.setAttribute('aria-pressed',String(S.dash.includes(k.id))); drawPrev(); };
            seg.appendChild(b); });
          box.appendChild(seg); pick.appendChild(box); });
      }
      let flashMsg='';
      function flash(){ flashMsg='上限是十二個。請先移除一個。需要捲動才看得完的儀表板就不叫儀表板了。'; drawPrev(); }
      function drawPrev(){
        const sel=LIB.filter(k=>S.dash.includes(k.id));
        const lead=sel.filter(k=>k.lead).length; const missing=groups.filter(g=>!sel.some(k=>k.g===g));
        const tips=[]; if(flashMsg){ tips.push(flashMsg); flashMsg=''; }
        if(sel.length<6) tips.push('少於六個KPI會留下盲點。');
        if(missing.length) tips.push('以下類別一個都沒有：'+missing.join('、').toLowerCase()+'。');
        if(sel.length&&lead/sel.length<0.4) tips.push(`${sel.length}個中只有${lead}個是領先指標。加入一些能及早示警的指標。`);
        if(sel.length&&!sel.some(k=>['head','dso','ccc','cconv','od60'].includes(k.id))) tips.push('沒有現金指標。讓賺錢的企業倒下的，正是現金。');
        const col=s=>s==='g'?'good':s==='a'?'warn':'bad';
        prev.innerHTML=`<div style="border-top:1px dashed var(--rule-strong);padding-top:14px;display:grid;gap:10px">
          <div class="row" style="justify-content:space-between"><h4>BraceWorks · 月度儀表板</h4><span class="eyebrow">${sel.length}/12 · ${lead}個領先</span></div>
          <div class="stats">${sel.map(k=>ctx.ui.stat(k.n,k.v,col(k.s),`目標 ${k.t}${k.lead?' · 領先':''}`)).join('')||'<p class="w-hint">請在上方選擇一些KPI。</p>'}</div>
          ${tips.length?`<div class="msg warn">${tips.join(' ')}</div>`:sel.length?'<div class="msg good">這是一份平衡的儀表板。每個類別都有涵蓋，而且有足夠的早期預警指標。</div>':''}</div>`;
      }
      el.querySelector('[data-rec]').onclick=()=>{ S.dash=REC.slice(); ctx.save(); drawPick(); drawPrev(); };
      el.querySelector('[data-clear]').onclick=()=>{ S.dash=[]; ctx.save(); drawPick(); drawPrev(); };
      drawPick(); drawPrev();
    }),
    K('建議的十個指標及其理由',
      `<p>毛利率和EBITDA利潤率（我們有賺錢嗎？）、訂單出貨比和最大客戶占比（需求健康且分散嗎？）、OTIF和報廢率（工廠表現好嗎？）、DSO和存貨週轉天數（現金被卡住了嗎？）、未來13週最低可用額度餘裕（現金夠用嗎？），以及淨負債對EBITDA比（我們撐得住負債嗎？）。十個中有七個是領先指標。</p>`)
  ]},
  {id:'case', label:'個案：全是綠燈', kind:'case', title:'全是綠燈，卻仍陷入困境', blocks:[
    CASE('說一切都很好的儀表板',
      `<p>前任GM有一份儀表板。每個月，每個KPI都是綠燈。然而年底卻出現現金危機、失去一家經銷商，還要花$43,000清理呆帳和陳舊存貨。你深入追查這些KPI是怎麼衡量的。</p>`),
    SORT('每個KPI為什麼會誤導人？',['目標太容易','定義被扭曲','平均數掩蓋細節','一次性項目美化數字'],[
      {text:'OTIF 96%，對照的是客戶同意延後之後的交期，而非最初承諾的日期', a:1, why:'對照最初承諾的日期，OTIF只有79%。重新承諾交期讓每張遲交的訂單都變成「準時」。'},
      {text:'毛利率28.9%，對照三年前設定的25%目標', a:0, why:'目標低於企業既有的水準，所以即使毛利率從31%往下掉，仍是綠燈。'},
      {text:'毛利率因泡棉供應商一筆$18,000的年終數量回饋而拉高', a:3, why:'扣除這筆回饋，毛利率只有27.4%，而且持續下滑。一次性項目應分開列示。'},
      {text:'DSO為62天，遠在75天目標之內', a:2, why:'平均數看起來沒問題，但有一家客戶已經到210天。依客戶列示的逾期金額就能看出來。'},
      {text:'報廢率1.8%，只在最終檢驗時衡量', a:1, why:'大部分報廢發生在裁切階段，而這部分沒有被計入。以領用材料來衡量，報廢率是4.1%。'}
    ]),
    K('給你的儀表板的教訓',
      `<ul>
        <li><strong>把每個KPI的定義寫下來</strong>，沒有你的核准不得更改。</li>
        <li><strong>每年檢討目標。</strong>永遠都能達成的目標就不是目標。</li>
        <li><strong>看穿平均數。</strong>每個平均數都搭配最差的情況：最差的客戶、最差的產品、最差的一週。</li>
        <li><strong>剔除一次性項目</strong>，讓趨勢呈現基本的營運狀況。</li>
        <li><strong>記住<span class="term">古德哈特定律</span>：</strong>當一項指標變成目標，人們會想辦法達成數字，而不是改善企業。要留意這一點，尤其是獎金與KPI掛鉤的地方。</li>
       </ul>`)
  ]},
  {id:'quiz', label:'測驗', kind:'quiz', title:'檢驗你的理解', blocks:[
    Q('哪一個KPI最能在銷貨下滑發生前就提出警告？',['本期淨利','訂單出貨比','毛利率','流動比率'],1,'它比較進來的訂單和出去的銷貨，所以會比銷貨先變動。'),
    Q('BraceWorks的ROCE為15.9%，借款利率約6.4%。這代表什麼？',['借錢投資創造了價值','企業應該立刻償還所有負債','ROCE高到不可能是真的','沒有任何有用的意義'],0,'資本賺的比它的成本多，表示以借款支應的投資能增加價值，前提是這種情況持續下去。'),
    Q('ROE = 淨利率 × 資產週轉率 × 財務槓桿。BraceWorks在不影響銷貨的情況下降低存貨和應收帳款。哪個槓桿會變動？',['淨利率','資產週轉率','財務槓桿','都不會'],1,'用更少的資產創造相同的營收，代表資產週轉率提高。'),
    Q('你的DSO是62天，在目標之內。你還應該檢查什麼？',['什麼都不用','依客戶列示的應收帳款，特別是逾期金額','流動比率','每位員工營收'],1,'平均數可能掩蓋一家嚴重遲付的客戶。'),
    Q('一頁式儀表板上應該放幾個KPI？',['3','大約8到12個','25','越多越好'],1,'多到足以涵蓋整個企業，少到兩分鐘內能看完。'),
    Q('某個KPI連續三年都是綠燈。你應該怎麼做？',['慶祝','檢查它的定義，以及目標是否仍有挑戰性','刪掉它','調降目標'],1,'它可能真的很好，也可能目標和定義已經失去意義。')
  ]},
  {id:'apply', label:'練習', kind:'apply', title:'用練習包練習', blocks:[
    PACK('packD',2,'練習包D，第2頁：儀表板'),
    Q('練習包D儀表板上的哪兩個綠燈KPI，依賴的是被更改或過於狹窄的定義？',['營業收入和稅前淨利','準時足量交貨率和報廢率','訂單出貨比和可用額度餘裕','DSO和淨負債'],1,'OTIF現在使用重新承諾的交期，而報廢只在最終檢驗時衡量。請查看附錄說明。'),
    Q('「史上最佳」的34.7%毛利率，扣除$8,000預收款後大約會降到多少？',['34.0%','30.4%','25.0%','40.0%'],1,'（$45,400 − $8,000）÷（$131,000 − $8,000）≈ 30.4%。低於當月32.3%的預算。'),
    Q('你會在練習包D的儀表板加上哪個KPI，來抓出它最大的隱藏問題？',['每位員工營收','現金轉換率（營業活動現金流量 ÷ EBITDA）','利息保障倍數','報價成交率'],1,'利潤大增的同時，營業現金卻是負的。一個現金指標就會讓儀表板亮起紅燈。'),
    {t:'html',html:'<h3>之後，用你自己的報告</h3><p class="small" style="color:var(--muted)">選讀。下次閱讀你自己的月報時，使用這份檢核表。這裡的內容不會分享或傳送；勾選只儲存在這個瀏覽器中。</p>'},
    CHECK('m11-kpi','針對我自己的企業，我已經……',[
      '選出8到12個KPI，涵蓋銷售、利潤、營運、現金和財務實力',
      '納入至少四個領先指標',
      '為每個KPI寫下一行定義',
      '為每個KPI設定目標，並至少每年檢討一次',
      '為每個KPI指定一位負責人',
      '要求每個KPI都附上六個月的趨勢',
      '讓平均數搭配最差情況（最差的客戶、產品或週）'
    ]),
    REPORT('你的週一早晨任務',
      `<p>把上面的儀表板建構器當作草稿。用你自己的目標取代BraceWorks的數字，然後問財務：<strong>「你能把這些放在月報的第一頁，附上最近六個月和紅／黃／綠燈狀態嗎？」</strong></p>`),
    K('重點整理',
      `<ul>
        <li>好的KPI能促成決策，有目標、趨勢和負責人，而且定義始終如一。</li>
        <li>兼顧領先與落後指標。領先指標讓你有時間採取行動。</li>
        <li>ROCE和ROE把利潤和投入的資金相比。ROCE應該高於你的借款成本。</li>
        <li>綠燈不一定是好事。檢查定義、目標、平均數和一次性項目。</li>
       </ul>`)
  ]}
  ],
  warnings:[
    {sign:'每個KPI每個月都是綠燈', meaning:'目標太容易、定義被扭曲，或平均數掩蓋了問題。', look:'KPI定義、目標的歷史、最差情況拆解。'},
    {sign:'KPI定義未經說明就被更改', meaning:'趨勢斷裂；可能有不好的數字被藏起來。', look:'要求把新舊定義並列比較。'},
    {sign:'ROCE逐漸下滑接近利率', meaning:'新的投資和借款可能不再創造價值。', look:'近期投資帶來的利潤；卡在營運資金中的資本。'},
    {sign:'最大客戶超過銷貨的20%', meaning:'失去一家客戶就可能威脅企業存續。', look:'銷貨集中度趨勢；分散客戶的計畫。'}
  ],
  formulas:[
    {name:'已動用資本報酬率（ROCE）', f:'營業利益 ÷（資產總額 − 流動負債）', ex:'$94,000 ÷ $591,500 = 15.9%'},
    {name:'權益報酬率（ROE）', f:'本期淨利 ÷ 權益', ex:'$55,500 ÷ $491,500 = 11.3%'},
    {name:'杜邦分析', f:'ROE = 淨利率 × 資產週轉率 × 財務槓桿', ex:'4.6% × 1.42 × 1.72 = 11.3%'},
    {name:'利息保障倍數', f:'營業利益 ÷ 利息費用（部分貸款機構使用EBITDA ÷ 利息）', ex:'$94,000 ÷ $14,000 = 6.7×；以EBITDA計算：$132,000 ÷ $14,000 = 9.4×'},
    {name:'資產週轉率', f:'營業收入 ÷ 資產總額', ex:'$1,200,000 ÷ $845,000 = 1.42×'},
    {name:'客戶集中度', f:'最大客戶銷貨 ÷ 銷貨總額', ex:'$264,000 ÷ $1,200,000 = 22%'}
  ],
  glossary:[
    {term:'KPI（關鍵績效指標）', def:'關鍵績效指標：對照目標追蹤的數字，因為它能顯示企業是否走在正軌上。'},
    {term:'儀表板（Dashboard）', def:'主要KPI的一頁式摘要，附目標、趨勢和狀態。'},
    {term:'已動用資本報酬率（Return on capital employed, ROCE）', def:'營業利益占企業長期資金（負債與權益）的%。'},
    {term:'權益報酬率（Return on equity, ROE）', def:'本期淨利占股東權益的%。'},
    {term:'資產週轉率（Asset turnover）', def:'營業收入除以資產總額。每一塊錢資產能創造多少銷貨。'},
    {term:'財務槓桿（Leverage）', def:'以負債為企業籌資。這裡以資產總額除以權益來衡量。'},
    {term:'利息保障倍數（Interest cover）', def:'利潤支付利息的寬裕程度：通常是營業利益除以利息，但許多借款合約改用EBITDA。一定要使用你自己借款合約中的定義。'},
    {term:'客戶集中度（Customer concentration）', def:'來自最大一家或幾家客戶的銷貨比重。'},
    {term:'古德哈特定律（Goodhart\'s law）', def:'當一項指標變成目標，它往往就不再是好的指標，因為人們會去優化這個數字。'}
  ]
});
})();
