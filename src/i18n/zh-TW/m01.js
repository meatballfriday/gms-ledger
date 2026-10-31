/* ===== Module 1: The three statements ===== */
(function(){
const {K,TIP,FLAG,CASE,REPORT,Q,FS,FLIP,SORT,CHECK,W,PACK,money,signed,pct,kfmt} = BW.h;
const D = BW.data;

BW.add({
  id:'m1', minutes:35,
  title:'三大財務報表',
  subtitle:'用三張照片看BraceWorks的一年：賺了多少、擁有和欠了什麼，以及現金去了哪裡。',
  goals:[
    '用一句話說出三大報表各自告訴你什麼',
    '解釋為什麼BraceWorks賺了$55,500，現金卻減少了',
    '追蹤一筆銷售如何流經損益表、資產負債表和現金流量表',
    '檢查你的月度管理報告是否完整提供了這三張照片'
  ],
  sections:[
  /* ---------------------------------------------------------------- */
  {id:'meet', label:'認識BraceWorks', kind:'learn', title:'擔任總經理的第一個早上', blocks:[
    `<p>今天是你擔任<strong>BraceWorks Medical</strong>總經理的第一天。老闆把去年的帳冊交給你，說：<em>「我們明明有賺錢，為什麼銀行一直打電話來問我們的透支？」</em></p>
     <p>讀完這個單元，你就能回答這個問題。先來認識這家公司：</p>`,
    {t:'tbl', head:['產品','平均售價','去年銷量','營業收入'], opts:{num:[1,2,3]}, rows:[
      ['減壓床墊','$180','2,800','$504,000'],
      ['病患移位吊帶','$45','7,200','$324,000'],
      ['骨科護具','$28','13,000','$364,000'],
      ['備用床套及零件','','','$8,000'],
      {cls:'', cells:['<strong>合計</strong>','','','<strong>$1,200,000</strong>']}
    ]},
    `<ul>
      <li><strong>人員：</strong>50人。其中38人在生產線，6人負責工廠支援（品質、維修、倉庫、領班），6人在辦公室，包括你。</li>
      <li><strong>客戶：</strong>約25家經銷商。40%的銷售到美國，35%到歐洲，25%到澳洲和中東。最大客戶占全部銷售的22%。</li>
      <li><strong>品質系統：</strong>通過ISO 13485認證、完成FDA登錄並取得CE標誌。維持這些資格每年都要花真金白銀。</li>
      <li><strong>錢進錢出：</strong>大部分銷售以美元開立發票，部分以歐元計價。薪資、租金和電費則以當地貨幣支付。</li>
     </ul>`,
    K('會計是企業的語言',
      `<p>每一筆出貨、每一次發薪、每一台機器的採購都會被記錄下來。會計把這些紀錄整理成三份報告，也就是<strong>財務報表</strong>。每一份回答不同的問題。只看其中一份的總經理，就像閉著一隻眼睛開車。</p>`),
    `<h3>三張照片</h3><p>點一下每張卡片。</p>`,
    FLIP([
      {f:'損益表（P&L）', b:'<strong>這段期間我們有沒有賺錢？</strong>一個月或一年內的銷售，減去為賺取這些銷售所花的所有成本。把它想成整個球季的計分板。'},
      {f:'資產負債表', b:'<strong>在某一天，我們擁有什麼、欠了什麼？</strong>在單一日期（例如12月31日）拍下的快照。把它想成公司家當和債務的一張照片。'},
      {f:'現金流量表', b:'<strong>現金從哪裡來、到哪裡去？</strong>這段期間實際進出銀行的錢。把它想成附上解說的銀行對帳單。'}
    ]),
    TIP('關於括號',
      `<p>會計人員用括號表示負數：<span class="num">($7,000)</span>代表負$7,000。在這門課和你自己的報告裡，到處都會看到這種寫法。</p>`)
  ]},
  /* ---------------------------------------------------------------- */
  {id:'pl', label:'照片一：獲利', kind:'learn', title:'損益表：我們有沒有賺錢？', blocks:[
    `<p><span class="term">損益表</span>（英文常稱P&amp;L，即profit and loss）最上面是銷售，往下逐步扣除成本。留在最底下的就是利潤。這也是為什麼大家把利潤叫做「底線」（the bottom line）。</p>`,
    FS({title:'BraceWorks Medical · 損益表', sub:'截至12月31日止年度 · 簡化版', rows:[
      ['營業收入（銷售）', D.pl.revenue],
      ['銷貨成本', -D.pl.cogs],
      ['營業毛利', D.pl.gp, 'sub'],
      ['營業費用（銷售、辦公室、認證）', -D.pl.opex],
      ['營業利益', D.pl.ebit, 'sub'],
      ['利息及匯兌損失', -(D.pl.interest+D.pl.fx)],
      ['稅前淨利', D.pl.pbt, 'sub'],
      ['所得稅', -D.pl.tax],
      ['本期淨利', D.pl.net, 'total']
    ], note:'第3單元會逐行拆解這張報表。'}),
    `<h3>由上往下讀</h3>
     <ul>
      <li><strong>營業收入$120萬：</strong>BraceWorks這一年<em>出貨</em>給客戶的全部價值，不論客戶付款了沒有。</li>
      <li><strong>銷貨成本$860k：</strong>製造這些已售出產品的成本。泡棉、布料、扣具、工廠薪資和工廠運轉費用。</li>
      <li><strong>營業毛利$340k（28%）：</strong>剩下來支付其他一切開銷的錢。每$100的銷售，有$28撐過了工廠這一關。</li>
      <li><strong>營業費用$246k：</strong>辦公室、業務、出口文件作業和各項認證。</li>
      <li><strong>本期淨利$55,500（4.6%）：</strong>付完利息和稅之後留給股東的部分。每$100的銷售，BraceWorks留下$4.60。</li>
     </ul>`,
    K('營業收入在交貨時認列，不是在收款時',
      `<p>這叫做<span class="term">應計基礎會計</span>（又稱權責發生制）。只要依照運送條件交貨，銷售就算數，即使客戶60天後才付款。成本也是一樣：在發生時認列，而不是在付帳時。正因如此，損益表才能公平地為一整年的表現打分數。也正因如此，損益表沒辦法告訴你手上有多少現金。</p>`),
    Q('BraceWorks在3月31日出貨$40,000的吊帶給一家美國經銷商，客戶在5月30日付款。這$40,000何時列為營業收入？',
      [{text:'3月，貨物交付的時候',why:''},{text:'5月，現金入帳的時候'},{text:'3月和5月各一半'},{text:'要等年底查核完成才列'}],0,
      '在應計基礎會計下，營業收入跟著交貨走。在5月之前，這筆現金時間差會以應收帳款（客戶欠你的錢）的形式出現在資產負債表上。')
  ]},
  /* ---------------------------------------------------------------- */
  {id:'bs', label:'照片二：財務狀況', kind:'learn', title:'資產負債表：我們擁有什麼、欠了什麼', blocks:[
    `<p>資產負債表是某一天拍下的照片。左邊是企業<strong>擁有</strong>的東西（資產）。右邊是<strong>誰出錢買的</strong>：貸款人和供應商（負債），或是股東（權益）。</p>`,
    FS({title:'BraceWorks Medical · 資產負債表', sub:'12月31日 · 簡化版', rows:[
      '我們擁有的（資產）',
      ['銀行存款', D.bs.cash, 'ind'],
      ['應收帳款：客戶欠我們的錢', D.bs.ar, 'ind'],
      ['存貨：原料、半成品和製成品', D.bs.inv, 'ind'],
      ['預付款項及其他', D.bs.prepay, 'ind'],
      ['機器、設備及裝修（扣除折舊後）', D.bs.ppe, 'ind'],
      ['資產總額', D.bs.ta, 'total'],
      '由誰出資（負債及權益）',
      ['應付帳款：欠供應商的款項及帳單', D.bs.ap+D.bs.accr, 'ind'],
      ['應付稅款', D.bs.taxPay, 'ind'],
      ['銀行借款', D.bs.stLoan+D.bs.ltLoan, 'ind'],
      ['負債總額', D.bs.tl, 'sub'],
      ['股東權益', D.bs.equity, 'ind'],
      ['負債及權益總額', D.bs.ta, 'total']
    ]}),
    K('會計恆等式',
      `<p class="num" style="font-size:18px;font-weight:600">資產 = 負債 + 權益</p>
       <p>企業擁有的每樣東西，都是有人出錢買的：貸款人、供應商或股東。所以兩邊一定相等。這就是它叫做<em>資產負債平衡</em>表（balance sheet）的原因。如果你的報表不平衡，帳一定哪裡出錯了。</p>`),
    `<h3>總經理一眼會注意到的事</h3>
     <ul>
      <li><strong>$480,000卡在應收帳款和存貨裡。</strong>這占BraceWorks全部資產的57%，是銀行存款的十倍以上。</li>
      <li><strong>現金只有$42,000。</strong>光是薪資每月就約$24,000，所以喘息空間不到兩個月。</li>
      <li><strong>銀行借款$220,000，</strong>大約是股東出資的一半。借錢有用處，但必須用現金償還，不是用利潤。</li>
     </ul>`,
    SORT('資產、負債還是權益？為每個項目點選正確答案。',['資產','負債','權益'],[
      {text:'BraceWorks上個月買的一台新縫紉機', a:0, why:'這是企業擁有、而且會使用好幾年的東西。'},
      {text:'欠泡棉供應商的$18,000，45天內到期', a:1, why:'欠別人的錢就是負債。這一筆叫做應付帳款。'},
      {text:'放在倉庫裡的護具綁帶', a:0, why:'存貨在賣出之前都是資產。'},
      {text:'老闆當初創業投入的資金', a:2, why:'股東投入的資金是股本，屬於權益的一部分。'},
      {text:'一家德國經銷商因上個月訂單欠我們的$25,000', a:0, why:'客戶欠你的錢是應收帳款，屬於資產。'},
      {text:'以前年度留在公司裡的利潤', a:2, why:'這是保留盈餘。它屬於股東，所以列在權益。'},
      {text:'向銀行借的設備貸款', a:1, why:'借來的錢是負債。'}
    ])
  ]},
  /* ---------------------------------------------------------------- */
  {id:'cf', label:'照片三：現金', kind:'learn', title:'現金流量表：錢去了哪裡？', blocks:[
    `<p>這就是老闆的謎題。BraceWorks賺了<strong>$55,500的利潤</strong>，銀行帳戶卻<strong>減少了$7,000</strong>，從$49,000降到$42,000。現金流量表會解釋這個落差。</p>`,
    W('那$55,500去了哪裡？', function(el, ctx){
      const {money}=ctx.h;
      const ST=[
        {label:'本期淨利', v:D.cf.net, total:true, say:`從損益表上的<strong>$55,500利潤</strong>開始。如果每筆銷售都收現金、每項成本都付現金，銀行存款就會剛好增加這麼多。但事實並非如此，我們來看看原因。`},
        {label:'加回折舊', v:D.cf.dep, say:`<strong>$38,000</strong>的折舊減少了利潤，但今年並沒有錢因此離開銀行：機器在購買時就已經付過錢了。所以要把它加回來。目前現金：<strong>${money(D.cf.net+D.cf.dep)}</strong>。`},
        {label:'更多現金卡在應收帳款', v:D.cf.dAR, say:`客戶欠的錢比一年前<strong>多了$30,000</strong>。這些銷售已經算進利潤，但現金還沒進來。把它扣掉。`},
        {label:'更多現金卡在存貨', v:D.cf.dInv, say:`架上多了<strong>$45,000的存貨</strong>。買原料和生產都花了現金，但還沒賣出，所以不在利潤裡。這也要扣掉。`},
        {label:'欠供應商及其他人的更多了', v:D.cf.dAP+D.cf.dAccr+D.cf.dTax, say:`BraceWorks欠供應商、員工和稅務機關的錢比去年<strong>多了$14,500</strong>。這些成本已經算進利潤但還沒付，所以現金還留在我們帳上。把它加回來。`},
        {label:'營業活動現金流量', v:D.cf.cfo, total:true, say:`經營本業帶進了<strong>$33,000</strong>的現金，而不是$55,500。深色長條又從零開始：這是小計。$22,500的差額停在客戶那裡和貨架上。`},
        {label:'購買設備', v:D.cf.capex, say:`一台新的泡棉裁切機花了<strong>$60,000</strong>。它不是今年利潤裡的成本（會在幾年內提列折舊），但現金是一次付出去的。現在累計數已經低於零：<strong>${money(D.cf.cfo+D.cf.capex)}</strong>。`},
        {label:'淨新增借款', v:D.cf.cff, say:`BraceWorks多動用了$40,000的透支，並償還了$20,000的設備貸款：從銀行淨流入<strong>$20,000</strong>。`},
        {label:'現金變動', v:D.cf.change, total:true, say:`全部加總：銀行存款<strong>減少了$7,000</strong>，從$49,000降到$42,000。有賺錢，現金卻變少了。老闆的謎題解開了。`}
      ];
      let n=1;
      const top=document.createElement('div'); top.className='brs-top';
      top.innerHTML=`<button type="button" class="btn ghost small brs-back">← 上一步</button><span class="brs-n" aria-live="polite"></span><button type="button" class="btn small brs-next">下一步 →</button><button type="button" class="linkbtn brs-all">顯示全部</button>`;
      const chart=document.createElement('div'), say=document.createElement('div'); say.className='brs-say'; say.setAttribute('aria-live','polite');
      const key=document.createElement('p'); key.className='brs-key'; key.innerHTML='<span class="sw up"></span>增加現金 <span class="sw down"></span>減少現金 <span class="sw tot"></span>合計，從零起算 <span class="sw z"></span>零';
      el.append(top,chart,say,key);
      const all=ST.map(s=>s.v), lo=Math.min(0,...ST.reduce((acc,s)=>{ const r=s.total?s.v:(acc.length?acc[acc.length-1]:0)+s.v; acc.push(r); return acc; },[])), hi=Math.max(...ST.reduce((acc,s)=>{ const r=s.total?s.v:(acc.length?acc[acc.length-1]:0)+s.v; acc.push(r); return acc; },[]));
      const lb=ctx.ui.liveBridge(chart,{lo,hi});
      function draw(){
        lb(ST.map((s,i)=>i<n?{label:s.label,v:s.v,total:s.total,cls:i===n-1&&n<ST.length?'is-cur':''}:{label:s.label,v:0,vt:'?',cls:'is-ghost'}));
        say.innerHTML=`<p>${ST[n-1].say}</p>`;
        top.querySelector('.brs-n').textContent=`第${n}步，共${ST.length}步`;
        top.querySelector('.brs-back').disabled=n<=1; top.querySelector('.brs-next').disabled=n>=ST.length; top.querySelector('.brs-all').hidden=n>=ST.length;
      }
      top.querySelector('.brs-back').onclick=()=>{ if(n>1){ n--; draw(); } };
      top.querySelector('.brs-next').onclick=()=>{ if(n<ST.length){ n++; draw(); } };
      top.querySelector('.brs-all').onclick=()=>{ n=ST.length; draw(); };
      draw();
    }),
    `<p class="small" style="color:var(--muted);margin-top:-6px">從上往下讀。每條彩色長條都從上一條結束的位置開始，所以你可以順著頁面追蹤現金累計數。深色長條是從零起算的合計。</p>
     <h3>三種現金流量</h3>
     <ul>
      <li><strong>營業活動（流入$33,000）：</strong>經營本業產生的現金。也就是利潤，再調整卡在應收帳款和存貨裡的錢。</li>
      <li><strong>投資活動（流出$60,000）：</strong>購買設備。BraceWorks買了一台新的泡棉裁切機。</li>
      <li><strong>籌資活動（流入$20,000）：</strong>借款和還款，或股東投入、分配給股東的錢。BraceWorks多借了$40,000，償還了$20,000。</li>
     </ul>`,
    K('利潤是一種看法，現金是事實。',
      `<p>利潤取決於會計判斷：營業收入何時認列、機器折舊多快、存貨值多少。銀行裡的現金則不受這些影響。兩者都重要。利潤告訴你商業模式行不行得通；現金告訴你企業活不活得下去。</p>`),
    `<p>所以老闆問題的答案是：<strong>BraceWorks賺了$55,500，但有$75,000流進了增加的應收帳款和存貨，還有$60,000花在一台機器上。</strong>借款補上了大部分缺口。這就是銀行打電話來的原因。</p>`
  ]},
  /* ---------------------------------------------------------------- */
  {id:'connect', label:'三者如何連動', kind:'play', title:'一個事件，三張報表', blocks:[
    `<p>每一個營業事件都以自己的方式影響三張報表。有些改變利潤但不改變現金，有些改變現金但不改變利潤。逐一點選這些事件，找出其中的規律。</p>`,
    W('經營BraceWorks一個月', function(el, ctx){
      const {money,signed} = ctx.h;
      const EV=[
        {k:'ship', label:'出貨一筆$40,000的訂單', desc:'BraceWorks出貨220張床墊給一家德國經銷商。發票金額$40,000，60天內付款。這些床墊的製造成本是$28,000。',
         pl:[['營業收入',40000],['銷貨成本',-28000]], A:[['應收帳款',40000],['製成品',-28000]], L:[], E:[['保留盈餘',12000]], cf:[0,0,0],
         note:'利潤今天就入帳，現金要60天後才到。這個時間差，正是賺錢的公司也會缺現金的原因。'},
        {k:'collect', label:'客戶付款$40,000', desc:'60天後，德國經銷商全額付款。',
         pl:[], A:[['現金',40000],['應收帳款',-40000]], L:[], E:[], cf:[40000,0,0],
         note:'利潤沒有變動。出貨時利潤就已經算過了。這個事件純粹是現金。'},
        {k:'buymat', label:'賒購$25,000的泡棉', desc:'泡棉和布料從供應商送到，45天內付款。',
         pl:[], A:[['原料',25000]], L:[['應付帳款',25000]], E:[], cf:[0,0,0],
         note:'原料在被使用並售出之前都是資產。還沒有費用，也還沒有付現金。'},
        {k:'paysup', label:'付款給泡棉供應商', desc:'45天後，BraceWorks支付這張$25,000的發票。',
         pl:[], A:[['現金',-25000]], L:[['應付帳款',-25000]], E:[], cf:[-25000,0,0],
         note:'現金流出，但利潤沒變。泡棉要等到用它做成的床墊賣出時，才會進入損益表。'},
        {k:'wagesF', label:'支付$13,000的工廠薪資', desc:'生產線領取兩週縫製和組裝的薪資。',
         pl:[], A:[['現金',-13000],['在製品',13000]], L:[], E:[], cf:[-13000,0,0],
         note:'在工廠裡，製造產品的人員薪資會成為產品成本的一部分。等這些產品賣出時，才會進入損益表。第6單元會說明怎麼做。'},
        {k:'wagesO', label:'支付$8,000的辦公室薪資', desc:'支付辦公室團隊當月的薪資。',
         pl:[['辦公室薪資',-8000]], A:[['現金',-8000]], L:[], E:[['保留盈餘',-8000]], cf:[-8000,0,0],
         note:'辦公室成本不屬於任何產品，所以會立即影響利潤。'},
        {k:'machine', label:'購買一台$30,000的機器', desc:'一台新的絎縫機，以現金支付。',
         pl:[], A:[['現金',-30000],['機器設備',30000]], L:[], E:[], cf:[0,-30000,0],
         note:'今天的利潤不受影響。這筆成本會以折舊的方式逐步進入損益表，十年下來大約每月$250。'},
        {k:'loan', label:'借款$50,000', desc:'銀行借給BraceWorks $50,000，期限三年。',
         pl:[], A:[['現金',50000]], L:[['銀行借款',50000]], E:[], cf:[0,0,50000],
         note:'現金增加，利潤不變。借款不是收入，因為你得還回去。只有利息才會成為費用。'},
        {k:'dep', label:'提列$3,200的折舊', desc:'辦公設備和送貨車本月應分攤的成本。',
         pl:[['折舊',-3200]], A:[['設備（帳面淨值）',-3200]], L:[], E:[['保留盈餘',-3200]], cf:[0,0,0],
         note:'折舊是真實的成本，但沒有現金支出。現金在購買設備時就已經流出了。'},
        {k:'scrap', label:'丟棄$5,000的過期存貨', desc:'超過保存期限的護具綁帶被報廢。',
         pl:[['存貨沖銷',-5000]], A:[['存貨',-5000]], L:[], E:[['保留盈餘',-5000]], cf:[0,0,0],
         note:'今天沒有現金流動，因為錢在買綁帶時就花掉了。但利潤下降。反覆出現沖銷，通常代表買太多了。'}
      ];
      const tally={}; let sel=null;
      el.innerHTML=`<p class="w-hint">點一個事件，看看它落在哪裡。以任何順序點選事件，累積出一個月。</p>
        <div class="ev-list" role="group" aria-label="營業事件"></div>
        <div class="ev-show"></div>
        <div class="ev-month"></div>`;
      const list=el.querySelector('.ev-list'), show=el.querySelector('.ev-show'), month=el.querySelector('.ev-month');
      const lines=(arr)=>arr.length?arr.map(([l,v])=>`<div class="ev-line"><span>${l}</span><span class="num ${v<0?'neg':'pos'}">${signed(v)}</span></div>`).join(''):'';
      function draw(e){
        const profit=e.pl.reduce((s,x)=>s+x[1],0), cash=e.cf.reduce((s,x)=>s+x,0);
        const dA=e.A.reduce((s,x)=>s+x[1],0), dL=e.L.reduce((s,x)=>s+x[1],0), dE=e.E.reduce((s,x)=>s+x[1],0);
        show.innerHTML=`<p class="ev-desc">${e.desc}</p>
        <div class="stats" style="margin:12px 0">${ctx.ui.stat('對利潤的影響',signed(profit),profit>0?'good':profit<0?'bad':'')}${ctx.ui.stat('對現金的影響',signed(cash),cash>0?'good':cash<0?'bad':'')}</div>
        <div class="ev-panels">
          <div class="ev-p"><h5>損益表</h5>${e.pl.length?lines(e.pl)+`<div class="ev-line tot"><span>利潤</span><span class="num">${signed(profit)}</span></div>`:'<div class="ev-none">沒有變動</div>'}</div>
          <div class="ev-p"><h5>資產負債表</h5>
            ${e.A.length?`<div class="ev-sub">資產</div>${lines(e.A)}`:''}
            ${e.L.length?`<div class="ev-sub">負債</div>${lines(e.L)}`:''}
            ${e.E.length?`<div class="ev-sub">權益</div>${lines(e.E)}`:''}
            <div class="ev-line tot"><span>資產 ${signed(dA)} = 負債＋權益 ${signed(dL+dE)}</span><span>✓</span></div></div>
          <div class="ev-p"><h5>現金流量</h5>${cash||e.cf.some(x=>x)?['營業活動','投資活動','籌資活動'].map((n,i)=>e.cf[i]?`<div class="ev-line"><span>${n}</span><span class="num ${e.cf[i]<0?'neg':'pos'}">${signed(e.cf[i])}</span></div>`:'').join(''):'<div class="ev-none">沒有現金流動</div>'}</div>
        </div>
        <div class="msg info" style="margin-top:12px">${e.note}</div>`;
      }
      function drawMonth(){
        const keys=Object.keys(tally).filter(k=>tally[k]); if(!keys.length){ month.innerHTML=''; return; }
        let p=0,c=0,n=0; keys.forEach(k=>{ const e=EV.find(x=>x.k===k); n+=tally[k]; p+=tally[k]*e.pl.reduce((s,x)=>s+x[1],0); c+=tally[k]*e.cf.reduce((s,x)=>s+x,0); });
        const gap=p-c;
        month.innerHTML=`<div style="border-top:1px dashed var(--rule-strong);padding-top:12px;display:grid;gap:10px">
          <div class="row" style="justify-content:space-between"><strong>本月至今（${n}個事件）</strong><button type="button" class="linkbtn" data-reset>重新開始這個月</button></div>
          <div class="stats">${ctx.ui.stat('利潤合計',signed(p),p>0?'good':p<0?'bad':'')}${ctx.ui.stat('現金變動合計',signed(c),c>0?'good':c<0?'bad':'')}${ctx.ui.stat('差距：利潤減現金',signed(gap))}</div>
          <p class="w-hint">${Math.abs(gap)<1?'利潤和現金一致。這在真實的月份裡很少發生。':gap>0?'你賺到的利潤比現金多。看看是哪些事件造成的：賒銷出貨、購買機器、支付存貨。':'你的現金比利潤多。借款和收回舊帳款都會造成這種情況。感覺很好，但那不是盈餘。'}</p></div>`;
        month.querySelector('[data-reset]').onclick=()=>{ Object.keys(tally).forEach(k=>tally[k]=0); list.querySelectorAll('.cnt').forEach(x=>x.textContent=''); drawMonth(); };
      }
      EV.forEach(e=>{ const b=document.createElement('button'); b.type='button'; b.setAttribute('aria-pressed','false'); b.innerHTML=`${e.label}<span class="cnt"></span>`;
        b.onclick=()=>{ list.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed','false')); b.setAttribute('aria-pressed','true'); sel=e; tally[e.k]=(tally[e.k]||0)+1; b.querySelector('.cnt').textContent='×'+tally[e.k]; draw(e); drawMonth(); };
        list.appendChild(b); });
      show.innerHTML='<div class="ev-none" style="padding:6px 0">從上面選一個事件。建議先從「出貨一筆$40,000的訂單」開始。</div>';
    }),
    K('規律',
      `<ul>
        <li><strong>改變利潤但不改變現金：</strong>賒銷、折舊、沖銷。</li>
        <li><strong>改變現金但不改變利潤：</strong>向客戶收款、付款給供應商、購買機器、借款、償還貸款。</li>
        <li><strong>兩者都改變：</strong>現金銷售、以現金支付辦公室成本。</li>
       </ul>
       <p>好的總經理遇到任何重大事件都會問：<em>這對利潤有什麼影響？對現金又有什麼影響？</em>答案往往不一樣。</p>`)
  ]},
  /* ---------------------------------------------------------------- */
  {id:'case', label:'個案：史上最佳月份？', kind:'case', title:'史上最佳月份？', blocks:[
    CASE('創紀錄的銷售，空空的銀行帳戶',
      `<p>9月是BraceWorks有史以來最好的月份：<strong>銷售$135,000</strong>，<strong>本期淨利$14,000</strong>。業務經理還買了蛋糕請辦公室同事吃。</p>
       <p>10月1日，會計走進來：銀行裡只有<strong>$6,000</strong>，而星期五要發<strong>$21,000的薪資</strong>。</p>`),
    FS({title:'9月一覽', cols:['利潤觀點','現金觀點'], rows:[
      ['已出貨銷售／向客戶收到的現金', [135000, 77000]],
      ['銷貨成本／付給供應商', [-97000, -68000]],
      ['間接費用及薪資／實際支付', [-21000, -41000]],
      ['利息及稅／機器訂金', [-3000, -10000]],
      ['本期淨利／現金淨變動', [14000, -42000], 'total']
    ], note:'現金月初為$48,000，月底剩$6,000。'}),
    `<p>會計筆記裡的細節：</p>
     <ul>
      <li>一位新的美國大客戶以<strong>90天付款條件</strong>買了$60,000的床墊。</li>
      <li>生產部門多買了<strong>$30,000的泡棉</strong>，以取得6%的數量折扣。</li>
      <li>為一張新裁切台支付了<strong>$10,000的訂金</strong>。</li>
     </ul>`,
    Q('一個利潤創紀錄的月份，為什麼銀行帳戶幾乎見底？最好的解釋是什麼？',[
      {text:'會計算錯了。有利潤就不可能沒有現金。', why:'在應計基礎會計下，利潤和現金本來就經常不同。這裡沒有任何錯誤。'},
      {text:'銷售已入帳但還沒收款，而現金流進了額外的存貨和機器訂金。'},
      {text:'客戶拒絕付款。這看起來像舞弊。', why:'沒有任何跡象顯示客戶不會付款。那位美國客戶只是90天後才到期。'},
      {text:'稅金吃掉了大部分利潤。', why:'稅和利息加起來只有$3,000。'}
    ],1,'三個各自都合理的決策，合起來抽走了將近$100,000的現金：較長的授信期間、大量採購原料，以及一筆資本支出。這些在損益表上都看不到。'),
    `<h3>總經理原本可以預見的事</h3>
     <ul>
      <li><strong>在資產負債表上：</strong>單一個月內應收帳款增加$58,000，原料增加$30,000。</li>
      <li><strong>在現金流量表上：</strong>利潤為正，營業活動現金流量卻大幅為負。</li>
      <li><strong>事發之前：</strong>13週現金流量預測會提早好幾週就顯示薪資有風險。第10單元會建立一份。</li>
     </ul>`,
    K('解方',
      `<p>BraceWorks做的每件事單獨看都沒錯。錯在同一個月做了三個吃現金的決策，卻沒有看現金。在同意較長的付款條件或大量採購之前，先問：<em>「這在未來90天會對我們的現金造成什麼影響？」</em></p>`)
  ]},
  /* ---------------------------------------------------------------- */
  {id:'quiz', label:'測驗', kind:'quiz', title:'檢查你的理解', blocks:[
    Q('哪一張報表顯示公司在特定日期擁有什麼、欠了什麼？',['損益表','資產負債表','現金流量表','銷售報告'],1,'資產負債表是某一日期的快照。另外兩張涵蓋一段期間。'),
    Q('BraceWorks以$30,000現金購買一台新機器。購買當天，今年的利潤會怎樣？',[
      {text:'減少$30,000'},{text:'沒有變化。這筆成本會以折舊的方式分攤到機器的使用年限。'},{text:'增加，因為資產增加了'},{text:'減少這筆錢的利息'}],1,
      '購買設備是把一種資產（現金）換成另一種資產（機器）。利潤則透過折舊慢慢承擔這筆成本。'),
    Q('資產總額$845,000，負債總額$353,500。權益是多少？',['$1,198,500','$491,500','$353,500','沒有損益表無法得知'],1,'資產 = 負債 + 權益，所以權益 = $845,000 − $353,500 = $491,500。'),
    Q('你的損益表顯示不錯的利潤，但現金卻一個月比一個月少。你會先檢查資產負債表上的哪兩個地方？',[
      '權益和應付稅款','應收帳款和存貨','機器和借款','預付款項和應付帳款'],1,
      '在製造業，現金最常卡在應收帳款和存貨。如果它們成長得比銷售快，現金就正在被吸走。'),
    Q('BraceWorks向銀行借了$50,000。下列何者正確？',[
      '利潤增加$50,000','現金增加，負債也增加相同金額','權益增加$50,000','還款前什麼都不會變'],1,
      '借款帶進現金，同時產生同等金額的債務。它不是收入。'),
    Q('現金流量表最擅長回答哪個問題？',[
      '我們的產品定價合理嗎？','我們的錢從哪裡來、到哪裡去？','工廠值多少錢？','哪些客戶最賺錢？'],1,
      '它解釋銀行存款的變動，並分成營業、投資和籌資三類活動。')
  ]},
  /* ---------------------------------------------------------------- */
  {id:'apply', label:'練習', kind:'apply', title:'用練習包練習', blocks:[
    PACK('packA',2,'練習包A，第2頁：舊版10月損益表'),
    Q('練習包A的管理評述寫著「現金吃緊」。你需要什麼才能驗證這句話？',['不需要其他東西：損益表就看得出來','資產負債表和現金流量表，而練習包A沒有這兩張','一份銷售報告','所得稅申報書'],1,'損益表無法顯示現金。少了另外兩張報表，「現金吃緊」既無法驗證，也無法解釋。'),
    PACK('packB',6,'練習包B，第6頁：資產負債表和現金流量表'),
    Q('練習包B在3月31日的權益總額是多少？',['$814,100','$500,950','$313,150','$491,500'],1,'股本$250,000＋保留盈餘$250,950。資產總額$814,100＝負債$313,150＋權益$500,950，所以兩邊平衡。'),
    Q('保留盈餘從$241,500增加到$250,950。這個增加數應該等於什麼？',['本季營業收入','本季稅後淨利$9,450，因為沒有發放股利','現金變動','折舊'],1,'期初＋利潤－股利＝期末。剛好勾稽得上，這是好現象。'),
    Q('在練習包B的哪裡可以看到透支減少了$20,000？',['只有損益表','資產負債表（透支那一行）和現金流量表（籌資活動）','只有儀表板','哪裡都看不到'],1,'籌資活動會影響現金和資產負債表，但從不影響利潤。'),
    {t:'html',html:'<h3>之後，用你自己的報告</h3><p class="small" style="color:var(--muted)">選讀。下次閱讀你自己的月度報告時，可以用這份檢核表。這裡的內容不會被分享或傳送；勾選紀錄只儲存在這個瀏覽器中。</p>'},
    CHECK('m1-pack','我的月度報告……',[
      '包含三大報表：損益表、資產負債表和現金流量表，而不只是損益表',
      '資產負債表是平衡的：資產總額等於負債加權益',
      '列出本月和本年累計數，並與去年或預算比較',
      '期末現金與銀行對帳單相符',
      '本期淨利與資產負債表上保留盈餘的變動勾稽相符（扣除股利後）',
      '在月底後10個工作天內送達'
    ]),
    REPORT('你的週一早晨提問',
      `<p>問你的會計：<strong>「上個月，為什麼我們的現金變動和利潤不一樣？」</strong></p>
       <p>好的答案會舉出三、四個具體項目，例如「應收帳款增加$20k，因為美國那筆訂單還沒收款」或「我們付了機器訂金」。答案含糊或答不出來，就表示報告需要改進。第9單元會告訴你好的報告長什麼樣子。</p>`),
    K('重點整理',
      `<ul>
        <li><strong>損益表</strong>為一段期間打分數。<strong>資產負債表</strong>是擁有與欠款的快照。<strong>現金流量表</strong>解釋銀行存款的變化。</li>
        <li>營業收入在交貨時認列，不是在現金入帳時。所以利潤和現金會分道揚鑣。</li>
        <li>在製造業，現金藏在<strong>應收帳款</strong>和<strong>存貨</strong>裡。</li>
        <li>三張報表要一起看。每一張都能補足其他兩張的盲點。</li>
       </ul>`)
  ]}
  ],
  warnings:[
    {sign:'連續兩個月以上利潤上升、現金下降', meaning:'現金正卡在應收帳款或存貨裡，或被花在設備上。', look:'資產負債表上應收帳款和存貨的變動；營業活動現金流量。'},
    {sign:'月度報告只有損益表，沒有資產負債表或現金流量表', meaning:'你只看到三分之一的全貌。現金問題會讓你措手不及。', look:'請財務部門每個月都加上這兩張報表。'},
    {sign:'本期淨利與保留盈餘的變動不符', meaning:'有無法解釋的調整、錯誤，或直接記入權益的分錄。', look:'要求提供期初權益到期末權益的調節。'}
  ],
  formulas:[
    {name:'會計恆等式', f:'資產 = 負債 + 權益', ex:'BraceWorks：$845,000 = $353,500 + $491,500'},
    {name:'營業毛利', f:'營業收入 − 銷貨成本', ex:'$1,200,000 − $860,000 = $340,000'},
    {name:'淨利率', f:'本期淨利 ÷ 營業收入', ex:'$55,500 ÷ $1,200,000 = 4.6%'}
  ],
  glossary:[
    {term:'損益表（Income statement, P&L）', def:'報導一段期間（例如一個月或一年）營業收入、成本和利潤的報表。'},
    {term:'資產負債表（Balance sheet）', def:'某一日期企業擁有什麼（資產）以及這些資產如何取得資金（負債及權益）的快照。'},
    {term:'現金流量表（Cash flow statement）', def:'解釋一段期間現金變動的報表，分為營業、投資和籌資三類活動。'},
    {term:'應計基礎會計（Accrual accounting）', def:'在賺得時（貨物交付）認列營業收入、在發生時認列成本，而不論現金何時流動。'},
    {term:'營業收入（Revenue）', def:'本期交付給客戶的商品價值。也稱為銷售或營收。'},
    {term:'銷貨成本（Cost of goods sold, COGS）', def:'本期已售出產品的製造成本：原料、工廠人工和製造費用。'},
    {term:'營業毛利（Gross profit）', def:'營業收入減去銷貨成本。用來支付其他所有成本的剩餘金額。'},
    {term:'本期淨利（Net profit）', def:'扣除所有成本、利息和稅後的利潤。也就是「底線」。'},
    {term:'資產（Asset）', def:'企業擁有或控制、能帶來未來效益的東西：現金、應收帳款、存貨、設備。'},
    {term:'負債（Liability）', def:'企業欠別人的東西：供應商帳單、借款、稅款。'},
    {term:'權益（Equity）', def:'股東的權益：他們投入的資金加上留在公司的利潤。等於資產減負債。'},
    {term:'應收帳款（Receivables）', def:'客戶就已交付的商品所欠的款項。英文也稱accounts receivable或debtors。'},
    {term:'應付帳款（Payables）', def:'企業就已收到的商品或服務欠供應商的款項。英文也稱accounts payable或creditors。'},
    {term:'保留盈餘（Retained earnings）', def:'累積留在公司、而非分配給股東的利潤。屬於權益的一部分。'},
    {term:'折舊（Depreciation）', def:'把設備的成本在其耐用年限內分攤為費用。提列時沒有現金流動。'}
  ]
});
})();
