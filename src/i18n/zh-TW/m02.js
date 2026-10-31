/* ===== Module 2: Bookkeeping basics ===== */
(function(){
const {K,TIP,FLAG,CASE,REPORT,Q,FS,FLIP,SORT,CHECK,W,PACK,money,signed,pct,kfmt} = BW.h;

BW.add({
  id:'m2', minutes:45,
  title:'記帳基礎',
  subtitle:'你報告裡的每個數字從哪裡來。你會親手過帳一整個月的真實交易，之後就再也不必自己做了。',
  goals:[
    '追蹤一筆交易從發票到財務報表的完整路徑',
    '在常見交易中正確使用借方與貸方',
    '看懂試算表，並知道它為什麼一定要平衡',
    '說明應計項目，以及為什麼月結決定了你報告的品質'
  ],
  sections:[
  {id:'chain', label:'從發票到報告', kind:'learn', title:'從一張發票到你的月度管理報告', blocks:[
    `<p>你月報裡的每個數字，最初都是一張紙或一個畫面：一張銷貨發票、一張供應商帳單、一張薪資單、一筆銀行轉帳。記帳就是把成千上萬筆這類資料變成三大財務報表的系統。</p>
     <p>你不需要自己做。但你需要知道它怎麼運作，原因有二。第一，當某個數字看起來不對，你會知道該從哪裡查起。第二，<strong>你的報告品質，永遠不可能比底下的記帳品質更好。</strong></p>
     <h3>五個步驟</h3>
     <ol>
      <li><strong>原始憑證。</strong>某件事發生了並留下證據：一張發票、一張送貨單、一行銀行對帳單。</li>
      <li><strong>分錄。</strong>記帳人員把它記入會計系統，並決定它影響哪些科目。</li>
      <li><strong>總分類帳。</strong>系統把每筆分錄歸入所屬科目，讓你看到現金、銷貨、薪資等科目的累計金額。</li>
      <li><strong>試算表。</strong>月底時列出每個科目的餘額。借方合計必須等於貸方合計。</li>
      <li><strong>財務報表。</strong>試算表被整理成損益表與資產負債表，現金流量表再由這兩張報表推導出來。</li>
     </ol>`,
    K('會計科目表',
      `<p>每家企業都有一份它所使用的科目清單，稱為<span class="term">會計科目表</span>。大多數遵循相同的編號邏輯：</p>`),
    {t:'tbl', head:['編號範圍','科目類型','BraceWorks範例'], rows:[
      ['1000–1999','資產','1010 銀行存款（USD）· 1020 銀行存款（EUR）· 1200 應收帳款 · 1310 原料 · 1320 在製品 · 1330 製成品 · 1500 機器設備'],
      ['2000–2999','負債','2100 應付帳款 · 2200 應計費用 · 2300 預收款項 · 2500 銀行借款'],
      ['3000–3999','權益','3100 股本 · 3200 保留盈餘'],
      ['4000–4999','營業收入','4010 銷貨：床墊 · 4020 銷貨：吊帶 · 4030 銷貨：護具 · 4900 退貨與折讓'],
      ['5000–5999','銷貨成本','5100 材料 · 5200 直接人工 · 5300 製造費用 · 5400 報廢與重工'],
      ['6000–7999','營業費用','6100 銷貨運費 · 6200 佣金 · 7100 辦公室薪資 · 7300 認證費用']
    ]},
    TIP('這對你為什麼重要',
      `<p>會計科目表決定了你的報告<em>能</em>呈現什麼。如果只有一個叫「銷貨」的科目，你永遠看不到各產品的利潤率。如果報廢混在「材料」裡，你永遠看不到報廢讓你付出多少成本。當你的報告回答不了某個問題時，解法往往要從這裡開始。請財務部門為你想管理的項目設立獨立科目。</p>`)
  ]},
  {id:'drcr', label:'借方與貸方', kind:'learn', title:'借方與貸方，輕鬆搞懂', blocks:[
    `<p>記帳採用<span class="term">複式簿記</span>。每筆交易至少影響兩個科目，而且兩邊的金額相等。這就是讓會計恆等式保持平衡的原因。</p>
     <p>這兩邊分別稱為<strong>借方</strong>（寫作Dr，左邊）與<strong>貸方</strong>（Cr，右邊）。忘掉「借」和「貸」在日常生活中的意思。在這裡它們只代表左邊和右邊。</p>`,
    {t:'tbl', head:['科目類型','記在借方…','記在貸方…'], rows:[
      ['<strong>資產</strong>（現金、應收帳款、存貨、機器）','增加','減少'],
      ['<strong>費用</strong>（薪資、耗用材料、租金）','增加','減少'],
      ['<strong>負債</strong>（應付帳款、借款）','減少','增加'],
      ['<strong>權益</strong>（股本、保留盈餘）','減少','增加'],
      ['<strong>營業收入</strong>（銷貨）','減少','增加']
    ]},
    K('記憶口訣：DEALER（DEA｜LER）',
      `<p><strong>D</strong>ividends（股利）、<strong>E</strong>xpenses（費用）、<strong>A</strong>ssets（資產）記在<strong>借方</strong>時增加。<strong>L</strong>iabilities（負債）、<strong>E</strong>quity（權益）、<strong>R</strong>evenue（收入）記在<strong>貸方</strong>時增加。</p>
       <p>所以現金流入時，你<em>借記</em>現金。做成一筆銷貨時，你<em>貸記</em>銷貨收入。</p>`),
    TIP('「可是錢進來的時候，銀行說是貸記我的帳戶！」',
      `<p>沒錯，這讓每個人都很困惑。你的銀行對帳單是從<em>銀行的</em>角度寫的。對銀行來說，你的存款是它欠你的錢，是一項負債，所以它記在貸方。在你的帳上，同一筆現金是你的資產，所以你記在借方。</p>`),
    `<h3>範例演練</h3>
     <p>BraceWorks以30天賒帳買進$9,000的尼龍織帶。有兩個科目改變：存貨增加（資產，所以借記），應付帳款增加（負債，所以貸記）。</p>`,
    {t:'tbl', head:['科目','借','貸'], opts:{num:[1,2]}, rows:[
      ['存貨：原料','$9,000',''],
      ['&nbsp;&nbsp;&nbsp;&nbsp;應付帳款','','$9,000']
    ]},
    `<p class="small" style="color:var(--muted)">慣例：貸方那一行縮排在借方之下。借方永遠等於貸方。</p>`,
    SORT('這個科目是記在借方還是貸方時增加？',['借方','貸方'],[
      {text:'銀行存款', a:0, why:'現金是資產。資產記在借方時增加。'},
      {text:'銷貨收入', a:1, why:'收入記在貸方時增加。'},
      {text:'薪資費用', a:0, why:'費用記在借方時增加。'},
      {text:'銀行借款', a:1, why:'借款是負債。負債記在貸方時增加。'},
      {text:'原料存貨', a:0, why:'存貨是資產。'},
      {text:'欠供應商的錢（應付帳款）', a:1, why:'應付帳款是負債。'},
      {text:'業主投入的股本', a:1, why:'權益記在貸方時增加。'},
      {text:'客戶應收帳款', a:0, why:'應收帳款是資產。'}
    ])
  ]},
  {id:'journal', label:'過帳一個月', kind:'play', title:'過帳一個月的交易', blocks:[
    `<p>業主成立了一家小型姊妹公司<strong>BraceWorks Straps</strong>，專門生產吊帶織帶。你是它第一個月的記帳人員。每筆交易請選出要借記的科目與要貸記的科目。試算表會隨著你的進度逐步建立。</p>`,
    W('日記簿', function(el, ctx){
      const {money}=ctx.h;
      const ACC=['現金','應收帳款','存貨','設備','累計折舊','應付帳款','銀行借款','股本','銷貨收入','銷貨成本','薪資費用','租金費用','折舊費用'];
      const TX=[
        {d:'10月1日', t:'業主把$50,000存入公司的銀行帳戶。', amt:50000, dr:0, cr:7, why:'現金（資產）增加：借記。業主的投資是股本（權益），增加：貸記。'},
        {d:'10月2日', t:'買進兩台工業用縫紉機，$18,000，以銀行轉帳支付。', amt:18000, dr:3, cr:0, why:'設備（資產）增加：借記。現金減少：貸記。這是用一項資產換另一項資產。'},
        {d:'10月4日', t:'供應商的織帶與扣具送達：$9,000，30天賒帳。', amt:9000, dr:2, cr:5, why:'存貨增加：借記。你現在欠供應商錢，所以應付帳款增加：貸記。'},
        {d:'10月10日', t:'向銀行借款$10,000。', amt:10000, dr:0, cr:6, why:'現金增加：借記。借款（負債）增加：貸記。'},
        {d:'10月15日', t:'把織帶出貨給BraceWorks的客戶並開立發票$14,000，30天內付款。', amt:14000, dr:1, cr:8, why:'客戶現在欠你錢：應收帳款增加，借記。你已賺得收入：銷貨收入增加，貸記。'},
        {d:'10月15日', t:'出貨的織帶材料成本為$7,000。把這筆成本從存貨轉出。', amt:7000, dr:9, cr:2, why:'銷貨成本（費用）增加：借記。存貨減少：貸記。這讓成本與銷貨相配合。'},
        {d:'10月25日', t:'一位客戶支付了所欠款項中的$10,000。', amt:10000, dr:0, cr:1, why:'現金增加：借記。應收帳款減少：貸記。這裡沒有收入，因為收入在10月15日已經入帳。'},
        {d:'10月28日', t:'支付供應商所欠$9,000中的$6,000。', amt:6000, dr:5, cr:0, why:'應付帳款減少：借記。現金減少：貸記。'},
        {d:'10月30日', t:'支付10月薪資$4,000。', amt:4000, dr:10, cr:0, why:'薪資費用增加：借記。現金減少：貸記。（在規模較大的工廠，這些薪資會計入產品成本。第6單元會說明。）'},
        {d:'10月31日', t:'支付10月工作坊租金$1,500。', amt:1500, dr:11, cr:0, why:'租金費用增加：借記。現金減少：貸記。'},
        {d:'10月31日', t:'提列縫紉機一個月的折舊：$300。', amt:300, dr:12, cr:4, why:'折舊費用增加：借記。累計折舊是抵減機器價值的資產減項，增加：貸記。沒有現金流動。'}
      ];
      let n=Math.min(ctx.state.m2j||0, TX.length);
      const opt='<option value="">選擇一個科目…</option>'+ACC.map((a,i)=>`<option value="${i}">${a}</option>`).join('');
      el.innerHTML=`<div class="row" style="justify-content:space-between"><span class="eyebrow" data-step></span><button type="button" class="linkbtn" data-restart>重新開始這個月</button></div>
        <div data-card></div>
        <div data-journal></div>
        <div data-tb></div>
        <div data-fin></div>`;
      const step=el.querySelector('[data-step]'), card=el.querySelector('[data-card]'), jr=el.querySelector('[data-journal]'), tbEl=el.querySelector('[data-tb]'), fin=el.querySelector('[data-fin]');
      function balances(k){ const b=ACC.map(()=>0); TX.slice(0,k).forEach(x=>{ b[x.dr]+=x.amt; b[x.cr]-=x.amt; }); return b; }
      function drawCard(){
        if(n>=TX.length){ step.textContent='11筆分錄全部過帳完成'; card.innerHTML=`<div class="msg good"><strong>本月已結帳。</strong>每一筆借方都有相對應的貸方，所以試算表是平衡的。下方把試算表轉換成兩張主要報表。</div>`; return; }
        const x=TX[n]; step.textContent=`第${n+1}筆分錄，共${TX.length}筆`;
        card.innerHTML=`<div class="stat" style="background:var(--paper)"><div class="stat-l">${x.d}</div><div style="font-size:16.5px;margin:2px 0 6px">${x.t}</div><div class="stat-v">${money(x.amt)}</div></div>
          <div class="ctrls" style="margin-top:12px">
            <div class="ctrl"><label for="${ctx.uid('dr'+n)}"><span>借方（左邊）</span></label><select class="search" id="${ctx.uid('dr'+n)}" data-dr>${opt}</select></div>
            <div class="ctrl"><label for="${ctx.uid('cr'+n)}"><span>貸方（右邊）</span></label><select class="search" id="${ctx.uid('cr'+n)}" data-cr>${opt}</select></div>
          </div>
          <div class="row" style="margin-top:12px"><button type="button" class="btn small" data-post>過帳</button><button type="button" class="btn ghost small" data-show>告訴我答案</button></div>
          <div data-fb style="margin-top:10px"></div>`;
        const dr=card.querySelector('[data-dr]'), cr=card.querySelector('[data-cr]'), fb=card.querySelector('[data-fb]');
        const accept=(msg)=>{ fb.innerHTML=`<div class="msg good">${msg} ${x.why}</div><div class="row" style="margin-top:10px"><button type="button" class="btn small" data-next>${n+1<TX.length?'下一筆分錄':'月底結帳'}</button></div>`; card.querySelector('[data-post]').disabled=true; card.querySelector('[data-show]').disabled=true; dr.disabled=true; cr.disabled=true; n++; ctx.state.m2j=n; ctx.save(); drawBooks(); fb.querySelector('[data-next]').onclick=()=>{ drawCard(); }; };
        card.querySelector('[data-post]').onclick=()=>{
          const d=dr.value===''?null:+dr.value, c=cr.value===''?null:+cr.value;
          if(d===null||c===null){ fb.innerHTML='<div class="msg warn">請先為兩邊各選一個科目。</div>'; return; }
          if(d===x.dr&&c===x.cr) return accept('<strong>正確，已過帳。</strong>');
          let m;
          if(d===x.cr&&c===x.dr) m='科目對了，但借貸方向反了。檢查哪一個科目在增加，以及它是資產或費用（記借方時增加），還是負債、權益或收入（記貸方時增加）。';
          else if(d===x.dr) m='你的借方是對的。再想想貸方：這筆價值是從哪裡來的？';
          else if(c===x.cr) m='你的貸方是對的。再想想借方：公司收到了什麼，或發生了什麼成本？';
          else m='不太對。先問：哪兩個科目有變動？再問：每個科目是增加還是減少？';
          fb.innerHTML=`<div class="msg bad">${m}</div>`;
        };
        card.querySelector('[data-show]').onclick=()=>{ dr.value=String(x.dr); cr.value=String(x.cr); accept(`<strong>答案：借：${ACC[x.dr]}，貸：${ACC[x.cr]}。</strong>`); };
      }
      function drawBooks(){
        if(n===0){ jr.innerHTML=''; tbEl.innerHTML=''; fin.innerHTML=''; return; }
        jr.innerHTML=`<h4 style="margin:4px 0 8px">日記簿</h4>`+ctx.ui.table(['日期','科目','借','貸'],
          TX.slice(0,n).flatMap(x=>[[x.d,ACC[x.dr],money(x.amt),''],['', '&nbsp;&nbsp;&nbsp;&nbsp;'+ACC[x.cr],'',money(x.amt)]]),{num:[2,3]});
        const b=balances(n); let td=0,tc=0;
        const rows=ACC.map((a,i)=>{ if(!b[i]) return null; const dv=b[i]>0?b[i]:0, cv=b[i]<0?-b[i]:0; td+=dv; tc+=cv; return [a,dv?money(dv):'',cv?money(cv):'']; }).filter(Boolean);
        rows.push({cls:'',cells:['<strong>合計</strong>',`<strong>${money(td)}</strong>`,`<strong>${money(tc)}</strong>`]});
        tbEl.innerHTML=`<h4 style="margin:4px 0 8px">試算表 ${td===tc?'<span class="pos small">· 已平衡 ✓</span>':''}</h4>`+ctx.ui.table(['科目','借方','貸方'],rows,{num:[1,2]});
        if(n<TX.length){ fin.innerHTML=''; return; }
        const rev=-b[8], cogs=b[9], wages=b[10], rent=b[11], dep=b[12], profit=rev-cogs-wages-rent-dep;
        fin.innerHTML=`<div style="display:grid;gap:12px;grid-template-columns:repeat(auto-fit,minmax(260px,1fr))">`+
          BW.fsHTML({title:'損益表 · 10月',rows:[['銷貨收入',rev],['銷貨成本',-cogs],['營業毛利',rev-cogs,'sub'],['薪資',-wages],['租金',-rent],['折舊',-dep],['本期淨利',profit,'total']]})+
          BW.fsHTML({title:'資產負債表 · 10月31日',rows:['資產',['現金',b[0],'ind'],['應收帳款',b[1],'ind'],['存貨',b[2],'ind'],['設備淨額',b[3]+b[4],'ind'],['資產總計',b[0]+b[1]+b[2]+b[3]+b[4],'total'],'負債及權益',['應付帳款',-b[5],'ind'],['銀行借款',-b[6],'ind'],['股本',-b[7],'ind'],['10月淨利',profit,'ind'],['合計',-b[5]-b[6]-b[7]+profit,'total']]})+
          `</div><div class="msg info" style="margin-top:12px">請注意：<strong>淨利是${money(profit)}</strong>，但現金從$0變成<strong>${money(b[0])}</strong>，主要是因為業主投入的資金和銀行借款。而且有$4,000的利潤還卡在應收帳款裡。這正是第1單元的重點，現在出現在你自己的帳上。</div>`;
      }
      el.querySelector('[data-restart]').onclick=()=>{ n=0; ctx.state.m2j=0; ctx.save(); drawCard(); drawBooks(); };
      drawCard(); drawBooks();
    }),
    TIP('實務上你不會這樣做',
      `<p>會計軟體會自動處理大部分工作。當你的團隊開立銷貨發票時，系統會自動過帳「借：應收帳款，貸：銷貨收入」。軟體做不到的是判斷特殊項目該記入哪個科目。錯誤就是從這裡悄悄出現的。</p>`)
  ]},
  {id:'close', label:'月結', kind:'learn', title:'月結：決定報告品質的地方', blocks:[
    `<p>在試算表變成你的月度管理報告之前，財務團隊應該先做一系列調整，稱為<span class="term">月結</span>。跳過這些步驟，是小公司報告不可靠最常見的原因。</p>`,
    {t:'tbl', head:['月結步驟','代表什麼','跳過會出什麼問題'], rows:[
      ['<strong>銀行調節</strong>','把銀行對帳單的每一行與帳上記錄逐筆核對。','漏記的付款、重複記帳，甚至竊盜，都不會被發現。'],
      ['<strong>應計項目</strong>','把本月已發生但尚未收到帳單的成本入帳：電費、運費、加班費。','本月看起來太賺，下個月又太差。'],
      ['<strong>預付費用</strong>','把預先支付的成本，例如年度保險或ISO驗證稽核費，分攤到所涵蓋的各個月份。','某一個月受到重擊，其他月份則看起來太好。'],
      ['<strong>折舊</strong>','提列本月應分攤的設備成本。','每個月利潤都被高估，到年底再一次大幅補提。'],
      ['<strong>存貨</strong>','確認存貨數量與價值。實地盤點，或與存貨系統調節。','銷貨成本只是猜測，所以毛利率也只是猜測。'],
      ['<strong>截止</strong>','確保銷貨與進貨記在正確的月份，與交貨日期一致。','收入在月份之間移動。有時是故意的。'],
      ['<strong>覆核</strong>','由資深人員將結果與上月及預算比較，並調查異常變動。','錯誤送到你手上，而你根據錯誤做決策。']
    ]},
    `<h3>應計項目的實際影響</h3><p>以下是漏記應計項目對BraceWorks每月利潤的影響。電費帳單晚一個月才到，而$9,600的年度保險費在8月支付。</p>`,
    W('有無月結的差別', function(el, ctx){
      const months=['7月','8月','9月','10月'];
      const without=[9400,-6100,10200,5900], withA=[4900,5000,4800,5000];
      el.innerHTML='<div data-seg></div><div data-out></div>';
      const out=el.querySelector('[data-out]');
      const draw=(mode)=>{ const v=mode==='with'?withA:without;
        out.innerHTML=ctx.ui.bars(months.map((m,i)=>({label:m,v:v[i],tone:v[i]<0?'bad':''})),{max:10200})+
        `<p class="w-hint" style="margin-top:10px">${mode==='with'?'有了應計項目與預付費用的處理，每月利潤穩定在約$5,000。這才是事實：公司的狀況並沒有逐月改變。':'沒有這些處理，利潤從+$10,200擺盪到虧損，純粹是因為帳單支付的時間點。總經理很容易因為8月的「虧損」而做出其實不必要的刪減。'}</p>`; };
      ctx.ui.seg(el.querySelector('[data-seg]'),[{v:'without',label:'帳單付款時才入帳'},{v:'with',label:'確實執行月結'}],'without',draw);
      draw('without');
    }),
    K('好的月結又快又無聊',
      `<p>一家管理良好的小公司會在5到10個工作天內完成結帳，有書面檢核表，每個月都執行相同的步驟。如果你的報告25日才送到，或利潤在你說不出原因的情況下大幅波動，就該從月結查起。</p>`)
  ]},
  {id:'case', label:'個案：好得不像真的', kind:'case', title:'好得不像真的', blocks:[
    CASE('突如其來的$15,000',
      `<p>11月的報告顯示BraceWorks創下全年最佳毛利率。銷貨為$118,000，10月則是$104,000。但倉庫經理說出貨量和10月差不多。</p>
       <p>你向記帳人員要了11月的銷貨明細。有一行特別顯眼：</p>`),
    {t:'tbl', head:['日期','客戶','摘要','金額'], opts:{num:[3]}, rows:[
      ['11月27日','Kangaroo Care Supplies（澳洲）','訂單#4471之30%訂金，出貨日1月15日','$15,000']
    ]},
    `<p>記帳人員是這樣過帳的：</p>`,
    {t:'tbl', head:['科目','借','貸'], opts:{num:[1,2]}, rows:[['現金','$15,000',''],['&nbsp;&nbsp;&nbsp;&nbsp;銷貨收入','','$15,000']]},
    Q('這筆分錄應該怎麼記？',[
      {text:'借：現金，貸：銷貨收入。這是對的，因為已經收到現金。', why:'收入是在交貨時賺得的，不是在收到現金時。目前什麼都還沒出貨。'},
      {text:'借：現金，貸：預收款項（一項負債）'},
      {text:'借：應收帳款，貸：銷貨收入', why:'銷貨還沒發生，客戶也沒有欠任何錢。他們是預先付款。'},
      {text:'等到1月再入帳', why:'現金已經在銀行裡，所以現在就必須入帳。問題是該記到哪個科目。'}
    ],1,'在貨物出貨之前，BraceWorks欠客戶的是產品或退款。這是一項負債，通常稱為預收款項或遞延收入。到了1月訂單出貨時，這筆訂金再轉為收入。'),
    `<h3>為什麼這不只是一個月的問題</h3>
     <ul>
      <li>11月利潤被高估約$15,000，而1月利潤將被低估相同金額。</li>
      <li>如果銷售佣金或獎金是根據每月營收計算，BraceWorks可能已經為一筆還沒發生的銷貨付了錢。</li>
      <li>如果訂單取消，訂金必須退還。若記成收入，它就被當成已賺到的錢。</li>
      <li>銀行和會計師都把提前認列收入視為嚴重警訊，因為這是灌水利潤最常見的手法。</li>
     </ul>`,
    FLAG('暫記科目',
      `<p>當記帳人員不知道某筆款項該歸在哪裡時，常會「暫時」放進<span class="term">暫記科目</span>。暫記科目每個月都應該清為零。如果你的暫記科目餘額愈來愈大，就表示有沒人解釋得了的交易。請要求提供明細。</p>`)
  ]},
  {id:'quiz', label:'測驗', kind:'quiz', title:'檢查你的理解', blocks:[
    Q('BraceWorks從銀行支付一筆$3,000的電費帳單。分錄是什麼？',['借：現金，貸：電費','借：電費，貸：現金','借：電費，貸：應付帳款','借：應付帳款，貸：電費'],1,'費用增加：借記。現金減少：貸記。'),
    Q('為什麼試算表一定要平衡？',[
      '因為會計師會在年底調整它','因為每筆分錄的借方與貸方金額相等','因為收入永遠等於費用','它不需要平衡'],1,'複式簿記代表每筆交易在兩邊加上相同的金額，所以合計永遠相符。如果不相符，就是有分錄過帳錯誤。'),
    Q('試算表平衡了。這能證明帳是正確的嗎？',[
      '能，一定能','不能。一筆分錄可以平衡，卻記錯科目，或根本漏記。','只有在會計師簽核後才能','只有在現金與銀行相符時才能'],1,
      '平衡只能抓出單邊的錯誤。把機器修理費記到設備而不是修繕費用，帳仍然平衡，但會高估利潤。'),
    Q('你的8月報告顯示虧損。7月和9月都有獲利。工廠沒有任何改變。你最先懷疑什麼？',[
      '銷貨下滑','竊盜','漏記應計項目或預付費用：成本在付款時入帳，而不是在發生時','稅務錯誤'],2,
      '在沒有營運原因的情況下利潤大幅波動，通常代表月結沒有確實執行。'),
    Q('一位客戶為你下一季才會出貨的商品支付訂金。這筆錢該記在哪裡？',['銷貨收入','預收款項，一項負債','應收帳款','保留盈餘'],1,'在你交貨之前，你欠對方貨物或退款，所以在那之前它是一項負債。'),
    Q('哪一個科目每個月都應該清為零？',['現金','保留盈餘','暫記科目','應收帳款'],2,'暫記科目是暫時的存放處。餘額一直掛著，代表有無法解釋的交易。')
  ]},
  {id:'apply', label:'練習', kind:'apply', title:'用練習包練習', blocks:[
    PACK('packB',7,'練習包B，第7頁：月結檢核表'),
    Q('練習包B的結帳檢核表顯示，已就已收貨、運費和加班費估列$6,200的應計項目。如果沒有估列，3月的利潤會…',['不變','3月高出約$6,200，然後4月低$6,200','較低','不受影響，因為應計項目是資產負債表項目'],1,'應計項目把成本放進它所屬的月份。沒有它們，利潤就會在月份之間擺盪（第2單元）。'),
    PACK('packD',5,'練習包D，第5頁：最大筆發票與暫記項目'),
    Q('INV-5601是一筆1月交貨的$8,000預收款，卻被記為11月的收入。這筆分錄應該怎麼記？',['借：現金，貸：銷貨收入','借：現金，貸：預收款項（一項負債）','借：應收帳款，貸：銷貨收入','等到1月才入帳'],1,'交貨前收到的現金，在貨物出貨前都是負債。'),
    Q('練習包D在「其他流動資產」中有$8,600的暫記項目。應該怎麼處理？',['留到年底再說','在報告發出前調查並清為零','轉列損益沖銷','轉到權益'],1,'暫記科目是暫時的。無法解釋的項目絕不應該擺在一個名稱模糊的項目裡。'),
    {t:'html',html:'<h3>之後，用你自己的報告</h3><p class="small" style="color:var(--muted)">選讀。下次閱讀你自己的月度管理報告時，可以使用這份檢核表。這裡的內容不會被分享或傳送；勾選紀錄只儲存在這個瀏覽器中。</p>'},
    CHECK('m2-books','問你的財務團隊…',[
      '所有銀行帳戶每個月都有調節嗎？包括外幣帳戶？',
      '每個月底暫記科目都是零嗎？',
      '我們有為尚未收到帳單的成本（電費、運費、加班費、佣金）估列應計項目嗎？',
      '保險和認證費等預付費用，有分攤到所涵蓋的各個月份嗎？',
      '收入是依照符合客戶國貿條規的出貨日期入帳，而不是在接單或收款時入帳嗎？',
      '有書面的月結檢核表嗎？由誰簽核？',
      '是否任何人都能過帳分錄，還是人工分錄都會由第二個人覆核與核准？',
      '會計科目表是否依產品線分開銷貨與銷貨成本？'
    ]),
    REPORT('你週一早上的要求',
      `<p>要一份<strong>月結檢核表</strong>，以及上個月每個步驟完成的日期。如果沒有這份表，那就是你的第一個改善專案，而且成本很低。</p>`),
    K('重點整理',
      `<ul>
        <li>每筆分錄都有金額相等的借方與貸方。資產與費用記在借方時增加。負債、權益與收入記在貸方時增加。</li>
        <li>試算表平衡不代表帳是對的，只代表帳是一致的。</li>
        <li>月結（調節、應計項目、預付費用、截止、覆核）決定了你的月度數字是否可信。</li>
        <li>交貨前收到的現金是負債，不是收入。</li>
       </ul>`)
  ]}
  ],
  warnings:[
    {sign:'營運穩定，利潤卻逐月大幅波動', meaning:'成本在付款時入帳，而不是在發生時入帳。月結做得不扎實。', look:'問是否每個月都有估列應計項目與分攤預付費用。'},
    {sign:'暫記或「未分配」科目有餘額', meaning:'沒人解釋得了的交易，可能是錯誤，甚至更糟。', look:'要求提供逐項明細，以及清理計畫。'},
    {sign:'銀行調節延遲或沒做', meaning:'錯誤、重複付款或竊盜可能無法被發現。', look:'要求提供上個月經簽名並註明日期的調節表。'},
    {sign:'營收跳升，但出貨量沒有相應增加', meaning:'把訂金或訂單記成銷貨，或有截止錯誤。', look:'把當月開立發票的銷貨與出貨紀錄比對。'}
  ],
  formulas:[
    {name:'複式簿記', f:'借方合計 = 貸方合計（每一筆分錄皆然）', ex:'賒購$9,000織帶：借：存貨$9,000，貸：應付帳款$9,000'},
    {name:'應計費用', f:'本月已發生成本 − 已收到帳單的金額', ex:'9月用電$3,500，帳單10月才到：9月估列$3,500'}
  ],
  glossary:[
    {term:'複式簿記（Double-entry bookkeeping）', def:'每筆交易至少記入兩個科目、且借貸金額相等的記帳制度。'},
    {term:'借方（Debit, Dr）', def:'分錄的左邊。使資產與費用增加；使負債、權益與收入減少。'},
    {term:'貸方（Credit, Cr）', def:'分錄的右邊。使負債、權益與收入增加；使資產與費用減少。'},
    {term:'分錄（Journal entry）', def:'一筆交易的紀錄，列出借記與貸記的科目。'},
    {term:'總分類帳（General ledger）', def:'所有科目的完整集合，每個科目列出過帳到它的每筆分錄及累計餘額。'},
    {term:'會計科目表（Chart of accounts）', def:'企業使用的所有科目的編號清單。決定報告能呈現什麼。'},
    {term:'試算表（Trial balance）', def:'某一日期所有科目餘額的清單。借方合計必須等於貸方合計。'},
    {term:'月結（Month-end close）', def:'在產出月度報告之前所進行的例行調節與調整作業。'},
    {term:'應計項目（Accrual）', def:'在成本發生的月份入帳，即使帳單尚未送達。'},
    {term:'預付費用（Prepayment）', def:'預先支付、並分攤到所涵蓋月份的成本，例如年度保險。'},
    {term:'銀行存款調節表（Bank reconciliation）', def:'將銀行對帳單與帳上記錄逐行核對，並說明任何差異。'},
    {term:'截止（Cut-off）', def:'確保銷貨與成本記在正確的期間。'},
    {term:'暫記科目（Suspense account）', def:'用於暫放不知正確科目之分錄的臨時科目。月底時應為零。'},
    {term:'預收款項（Customer deposits, deferred revenue）', def:'貨物交付前收到的現金。在貨物出貨前是一項負債。'},
    {term:'累計折舊（Accumulated depreciation）', def:'設備迄今已提列的折舊總額。列為其成本的減項。'}
  ]
});
})();
