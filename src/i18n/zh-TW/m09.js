/* ===== Module 9: A good monthly pack ===== */
(function(){
const {K,TIP,FLAG,CASE,REPORT,Q,FS,FLIP,SORT,CHECK,W,PACK,money,signed,pct,kfmt} = BW.h;

const GROUPS=[
  {g:'及時且可靠', items:[
    '在月底後10個工作天內送達',
    '發出前已完成銀行帳戶、應收帳款和應付帳款的調節',
    '報告發出後數字不再變動',
    '每個月都入帳應計項目和預付費用'
  ]},
  {g:'完整', items:[
    '包含損益表、資產負債表和現金流量表',
    '依產品線呈現毛利率',
    '包含應收帳款帳齡分析和存貨庫齡分析',
    '包含附可用額度餘裕的未來現金預測'
  ]},
  {g:'可比較', items:[
    '與預算比較',
    '與去年同期比較',
    '呈現重要項目的12個月趨勢',
    '損益表每一行都呈現占營收%'
  ]},
  {g:'有洞見', items:[
    '以一頁摘要或儀表板開頭',
    '管理評述說明數字為什麼變動，而不只是什麼變動了',
    '列出行動事項，附負責人和日期',
    '一次性項目分開列示'
  ]},
  {g:'與營運連結', items:[
    '包含產量和效率指標',
    '呈現報廢、重工和退貨的成本',
    '呈現接單金額和未出貨訂單',
    '每個月使用相同的格式'
  ]}
];

BW.add({
  id:'m9', minutes:40,
  title:'一份好的月度管理報告',
  subtitle:'一份像樣的管理報告該包含什麼、薄弱報告的徵兆，以及一份用來為你現在拿到的報告打分數的評分表。',
  goals:[
    '逐節說明一份有用的月度管理報告包含哪些內容',
    '分辨有幫助的管理評述和只是重複數字的評述',
    '為你自己的報告打分數，並挑出最先要做的三項改善',
    '理解為什麼已報告的數字有時會在發出後改變'
  ],
  sections:[
  {id:'purpose', label:'它的用途', kind:'learn', title:'月報是為了決策，不是裝飾', blocks:[
    `<p>你的會計人員每年為稅務機關和會計師編製一次法定財務報表。<span class="term">月度管理報告</span>則不同。它存在只有一個理由：幫助你和股東經營這門生意。如果它沒有改變你的做法，它就沒有發揮作用。</p>
     <p>許多小公司拿到的月報技術上正確，卻毫無用處：會計系統印出來的損益表，晚了三週，沒有比較，也沒有說明。你大概見過這種報告。</p>`,
    `<h3>好月報的八項特質</h3>`,
    FLIP([
      {f:'及時', b:'在月底後5到10個工作天內送達。10月25日才送到的9月報告是歷史，不是管理。'},
      {f:'可靠', b:'建立在已調節的帳目和確實的月結之上。你看過之後數字不會再變。'},
      {f:'可比較', b:'每個數字都有對照：預算、去年、上個月。單獨一個數字沒有意義。'},
      {f:'有說明', b:'管理評述說明為什麼變動、代表什麼意義、正在採取什麼行動。由有和營運部門溝通過的人撰寫。'},
      {f:'聚焦', b:'以一頁摘要開頭。十到十二個KPI，而不是五十個。細節放在後面。'},
      {f:'有連結', b:'把金額和營運連結起來：產量、報廢、準時交貨、訂單。GM看得到原因，而不只是結果。'},
      {f:'前瞻', b:'包含現金預測和更新後的全年展望。未來仍然可以改變。'},
      {f:'一致', b:'每個月相同的結構、相同的定義。格式固定，趨勢才看得出來。'}
    ])
  ]},
  {id:'structure', label:'理想的結構', kind:'learn', title:'月報裡該有什麼，依序排列', blocks:[
    `<p>以BraceWorks的規模，一份好的月報大約10到15頁。以下是你該要求的結構。順序很重要：最重要的放最前面。</p>`,
    {t:'tbl', head:['#','章節','呈現內容','單元'], rows:[
      ['1','<strong>一頁式儀表板</strong>','10–12個KPI，附目標、趨勢箭頭和紅／黃／綠燈狀態','11'],
      ['2','<strong>管理評述</strong>','一頁：發生了什麼、為什麼、我們在做什麼、展望','9'],
      ['3','<strong>損益表</strong>','當月和本年累計對照預算和去年，附占營收%','3'],
      ['4','<strong>利潤率分析</strong>','依產品線、主要客戶和市場的毛利率','6, 10'],
      ['5','<strong>資產負債表</strong>','月底對照上月和去年年底，附重要比率','4'],
      ['6','<strong>現金</strong>','現金流量表、13週現金流量預測、可用額度餘裕','5, 10'],
      ['7','<strong>營運資金</strong>','應收帳款帳齡、應付帳款帳齡、存貨庫齡','7, 10, 16'],
      ['8','<strong>營運</strong>','產量、人工效率、差異、報廢、重工、退貨、準時交貨','8, 10'],
      ['9','<strong>銷售管線</strong>','接單金額、未出貨訂單、訂單出貨比、未結報價','10'],
      ['10','<strong>資本支出</strong>','依專案比較支出與核准預算','14'],
      ['11','<strong>風險與行動紀錄</strong>','未結事項、負責人、到期日、狀態','9'],
      ['12','<strong>附錄</strong>','結帳檢核表簽核、調節狀態、定義','2']
    ]},
    TIP('不要一次要求全部',
      `<p>如果你現在的月報只有一張損益表，下個月就要求十二個章節全部到位，會讓財務團隊不堪負荷，產出倉促又不可靠的報告。用下一節的評分表找出最大的缺口，每個月改善三項。</p>`)
  ]},
  {id:'score', label:'評分表', kind:'play', title:'為你自己的月報打分數', blocks:[
    `<p>先拿四個練習包練習。每一份都有專家評分可以對照。每個項目給分：<strong>0</strong> = 沒有，<strong>1</strong> = 部分有，<strong>2</strong> = 完全具備。你也可以私下為自己的報告打分數；不會傳送到任何地方。</p>`,
    W('月度管理報告評分表', function(el, ctx){
      const S=ctx.state;
      if(!S.sc2){ S.sc2={}; if(S.sc&&typeof S.sc==='object'&&Object.keys(S.sc).length){ S.sc2.own=S.sc; } }
      const TARGETS=[{v:'A',label:'練習包A · 10月'},{v:'B',label:'練習包B · 3月'},{v:'C',label:'練習包C · 7月'},{v:'D',label:'練習包D · 11月'},{v:'own',label:'我自己的報告（私人）'}];
      let target=S.scTarget&&TARGETS.some(t=>t.v===S.scTarget)?S.scTarget:'A';
      let showExpert=false;
      const head=document.createElement('div'), body=document.createElement('div'); el.append(head,body);
      head.innerHTML='<p class="w-hint" style="margin-bottom:8px">選擇要評分的對象：</p>';
      ctx.ui.seg(head,TARGETS,target,v=>{ target=v; S.scTarget=v; ctx.save(); showExpert=false; draw(); });
      function draw(){
        const sc=S.sc2[target]=S.sc2[target]||{};
        const pack=target!=='own'?BW.packs['pack'+target]:null;
        const expert=pack?pack.grades:null;
        body.innerHTML='';
        if(pack){ const lk=document.createElement('button'); lk.type='button'; lk.className='packlink'; lk.style.marginTop='10px'; lk.innerHTML=`<span><span class="pl-k">練習用月報${pack.code}，${pack.month}</span>${pack.title}</span><span class="pl-a">開啟</span>`; lk.onclick=()=>BW.go(pack.id,0,{jump:true}); body.appendChild(lk); }
        else body.appendChild(Object.assign(document.createElement('p'),{className:'w-hint',textContent:'為財務團隊給你的報告打分數。內容不會離開這個頁面：你的答案只儲存在這個瀏覽器中。'}));
        const groups=document.createElement('div'); groups.style.cssText='display:grid;gap:16px;margin-top:12px'; body.appendChild(groups);
        let idx=0;
        GROUPS.forEach((g,gi)=>{
          const box=document.createElement('div'); box.innerHTML=`<h4 style="margin-bottom:6px">${g.g}</h4>`;
          g.items.forEach((it,ii)=>{
            const key=gi+'.'+ii, ex=expert?expert[idx]:null; idx++;
            const row=document.createElement('div'); row.className='sort-item';
            row.innerHTML=`<div class="sort-text">${it}</div>`; const bb=document.createElement('div'); bb.className='seg';
            [[0,'0 · 沒有'],[1,'1 · 部分'],[2,'2 · 有']].forEach(([v,l])=>{ const b=document.createElement('button'); b.type='button'; b.textContent=l; b.setAttribute('aria-pressed',String(sc[key]===v));
              b.onclick=()=>{ sc[key]=v; ctx.save(); bb.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed','false')); b.setAttribute('aria-pressed','true'); result(); }; bb.appendChild(b); });
            row.appendChild(bb);
            if(showExpert&&ex!==null){ const you=sc[key]; const m=document.createElement('div'); m.className='sort-fb'; m.innerHTML=`專家：<strong>${ex}</strong>${you===undefined?'':you===ex?' <span class="pos">· 你的評分一致</span>':` <span class="neg">· 你給了${you}</span>`}`; row.appendChild(m); }
            box.appendChild(row);
          });
          groups.appendChild(box);
        });
        const res=document.createElement('div'); res.dataset.res='1'; body.appendChild(res);
        const row=document.createElement('div'); row.className='row'; row.style.marginTop='10px';
        if(expert){ const xb=document.createElement('button'); xb.type='button'; xb.className='btn ghost small'; xb.textContent=showExpert?'隱藏專家評分':'與專家評分比較'; xb.onclick=()=>{ showExpert=!showExpert; draw(); }; row.appendChild(xb); }
        const reset=document.createElement('button'); reset.type='button'; reset.className='linkbtn'; reset.textContent='清除這些分數'; reset.onclick=()=>{ S.sc2[target]={}; ctx.save(); draw(); }; row.appendChild(reset);
        body.appendChild(row);
        result();
      }
      function result(){
        const res=body.querySelector('[data-res]'); const sc=S.sc2[target]||{}; const pack=target!=='own'?BW.packs['pack'+target]:null;
        let total=0, answered=0; const gs=GROUPS.map((g,gi)=>{ let s=0; g.items.forEach((x,ii)=>{ const v=sc[gi+'.'+ii]; if(v!==undefined){ s+=v; answered++; total+=v; } }); return {g:g.g,s}; });
        const n=GROUPS.reduce((a,g)=>a+g.items.length,0);
        if(!answered){ res.innerHTML='<div class="msg info" style="margin-top:12px">至少為幾個項目評分，才能看到結果。</div>'; return; }
        const grade=t=> t>=32?['優秀','good','一份真正有用的月報。保持一致，並補上少數缺口。']:t>=22?['尚可','warn','基礎扎實。幾項有針對性的改善，就能讓它成為真正的管理工具。']:t>=12?['基本','warn','有數字，但對經營幫助不大。還有很大的進步空間。']:['薄弱','bad','這份月報還沒發揮作用。先從可靠性著手，再加入比較。'];
        const g=grade(total); const weakest=[...gs].sort((a,b)=>a.s-b.s).slice(0,2);
        const exTot=pack?pack.grades.reduce((a,b)=>a+b,0):null;
        res.innerHTML=`<div style="border-top:1px dashed var(--rule-strong);padding-top:14px;margin-top:14px;display:grid;gap:12px">
          <div class="stats">${ctx.ui.stat('你的分數',`${total} / ${n*2}`,g[1],`已評分${answered}／${n}項`)}${ctx.ui.stat('等級',g[0],g[1])}${exTot!==null?ctx.ui.stat('專家分數',`${exTot} / 40`,grade(exTot)[1],grade(exTot)[0]):''}</div>
          ${ctx.ui.bars(gs.map(x=>({label:x.g,v:x.s,tone:x.s>=6?'good':x.s>=3?'warn':'bad'})),{max:8,fmt:x=>x+' / 8'})}
          <div class="msg ${g[1]}">${g[2]} <strong>最弱的面向：${weakest.map(w=>w.g.toLowerCase()).join('和')}。</strong>${pack&&answered===n?` ${Math.abs(total-exTot)<=3?'你的評分和專家很接近。':total>exTot?'你的評分比專家寬鬆。逐項比較看看差在哪裡。':'你比專家嚴格。逐項比較看看。'}`:''}</div></div>`;
      }
      draw();
    }),
    K('依這個順序改善',
      `<ol>
        <li><strong>先求可靠。</strong>建立在未調節數字上的漂亮報告，只會讓錯誤的數字看起來更有說服力。</li>
        <li><strong>再求可比較。</strong>預算和去年的欄位加起來不費力，卻能徹底改變你看到的東西。</li>
        <li><strong>然後求洞見。</strong>一頁摘要和真正的管理評述。</li>
        <li><strong>最後求完整和連結。</strong>依產品的利潤率、帳齡報表、營運KPI。</li>
       </ol>`)
  ]},
  {id:'comment', label:'管理評述', kind:'learn', title:'真正有幫助的管理評述', blocks:[
    `<p>管理評述那一頁，是月報證明自身價值的地方。比較以下兩個關於BraceWorks同一個月的版本。</p>`,
    FLAG('薄弱的管理評述',
      `<p>「10月銷貨為$96,000，低於預算。毛利率為25.1%。費用與預算相符。本期淨利為$1,200。月底現金為$31,000。」</p>
       <p class="small"><strong>為什麼薄弱：</strong>每一句都在重複你已經能在表格中看到的數字。沒有說明原因，所以也沒有告訴你該做什麼。</p>`),
    K('有力的管理評述',
      `<p><strong>銷貨$96k，低於預算$9k（9%）。</strong>我們最大的美國經銷商把一張$12k的床墊訂單延到11月4日（已書面確認）。歐洲的移位吊帶超出預算$3k。基本銷貨符合計畫。</p>
       <p><strong>毛利率25.1%，預算為28.0%，影響$2.8k。</strong>兩個原因：泡棉供應商自10月1日起漲價6%（$1.4k），以及吊帶批號2231因縫製瑕疵而重工（$1.1k）。其餘是數量較低、固定成本分攤不足所致。</p>
       <p><strong>行動：</strong>發函通知經銷商自1月1日起調漲價格（業務，11月15日前）。取得第二家泡棉報價（採購，11月8日前）。4號縫紉機的矯正措施已結案（品保）。</p>
       <p><strong>現金$31k，低於預測$11k</strong>，原因是訂單延後。未來13週最低點：第3週$18k。不需要額外借款。</p>
       <p><strong>展望：</strong>11月預測銷貨$118k，毛利率27.5%。全年仍可望達成$122萬。</p>`),
    `<h3>好的管理評述的公式</h3>
     <ul>
      <li><strong>先講差異：</strong>對照預算或預測，以金額和%表示差異大小。</li>
      <li><strong>說明原因：</strong>具體寫出產品、客戶或批號的名稱。</li>
      <li><strong>區分時間差和真正的變化：</strong>延後的訂單不等於失去的訂單。</li>
      <li><strong>說明正在採取的行動：</strong>由誰負責，何時完成。</li>
      <li><strong>往前看：</strong>這對下個月和全年代表什麼。</li>
     </ul>`,
    Q('哪一句屬於好的管理評述？',[
      '本月原料成本較高。',
      '材料占銷貨49.2%，預算為46%，主要是泡棉漲價6%（$1.4k）；新供應商報價將於11月8日提出。',
      '損益表顯示利潤$1,200。',
      '結果令人失望，我們下個月會更努力。'],1,
      '它量化了差異、指出原因、標出金額，並說明正在採取的行動。')
  ]},
  {id:'case', label:'個案：會變動的數字', kind:'case', title:'變動的數字', blocks:[
    CASE('先有利潤，後來沒了',
      `<p>10月12日你收到9月的月報：<strong>本期淨利$9,000</strong>，是今年最好的一個月。你告訴了股東。10月26日，財務寄來一份「修正版」月報：9月現在變成<strong>虧損$2,000</strong>。</p>
       <p>會計人員解釋了變動的原因：</p>
       <ul>
        <li>$6,800的泡棉和布料在9月到貨，但供應商發票10月才來。它們沒有入帳在9月。</li>
        <li>一張9月出貨的$2,400運費帳單延遲送達。</li>
        <li>9月最後一週的$1,800加班費在10月才支付。</li>
       </ul>`),
    Q('什麼流程本來可以避免這種情況？',[
      {text:'等所有發票都到齊再發出月報', why:'這會讓月報越來越晚。好的公司會估計缺漏的部分，準時發出月報。'},
      {text:'在月結時，為已收貨未收發票的貨品，以及運費和加班費等已知成本估列應計項目'},
      {text:'要求供應商更快開立發票', why:'有幫助，但時間差永遠存在。結帳流程必須處理它們。'},
      {text:'改用現金基礎報導', why:'這會讓每月數字波動得更厲害（第2單元）。'}
    ],1,'解決方法是「已收貨未收發票」應計：倉庫已簽收但尚未開票的貨品，按採購單價格入帳。運費和加班費則依出貨和工時紀錄估列。'),
    K('已收貨未收發票（GRNI）',
      `<p>倉庫簽收貨品時，成本就已經發生，不論發票到了沒有。好的系統會根據驗收單和採購單自動入帳。月底時，所有已收貨未收發票的貨品都會估列。光是這一項控制，就能解決數字變動最常見的原因。</p>`),
    TIP('值得訂下的規則',
      `<p>告訴財務：<strong>月報一經發出，該月即結帳。</strong>之後發現的任何事項都計入下個月，並附註說明。這樣你的數字就不會在背後被改動，團隊也有充分的理由第一次就把結帳做對。</p>`)
  ]},
  {id:'quiz', label:'測驗', kind:'quiz', title:'檢驗你的理解', blocks:[
    Q('月度管理報告的主要目的是什麼？',['滿足稅務機關的要求','幫助經理人和股東做決策','為年度查核做準備','記錄交易'],1,'法定財務報表服務外部人士。月度管理報告服務經營企業的人。'),
    Q('一份好的月報應該以什麼開頭？',['詳細的試算表','附重要KPI和狀態的一頁摘要','應收帳款帳齡分析','附錄'],1,'最重要的放最前面。細節放在後面。'),
    Q('你的月報在月底後22個工作天才送達。主要問題是什麼？',['看起來不專業','太晚了，來不及據以行動，所以它是歷史而不是管理','銀行不會接受','沒問題，只要它正確'],1,'目標是5到10個工作天。太晚的資訊無法改變結果。'),
    Q('如果你的月報每一項分數都很低，應該先改善什麼？',['更好看的設計','可靠性：調節和確實的結帳','更多KPI','圖表'],1,'其他一切都建立在可靠的數字之上。'),
    Q('9月28日收到的材料，10月5日才開立發票。這筆成本應該在何時出現？',['10月','9月，作為已收貨未收發票的應計項目','付款時','年底'],1,'成本在貨品到達時就已發生。'),
    Q('「銷貨$96k，低於預算。」這段管理評述少了什麼？',['幣別','差異大小、原因和行動','圖表','本年累計數字'],1,'好的管理評述會量化、解釋，並說明正在採取的行動。')
  ]},
  {id:'apply', label:'練習', kind:'apply', title:'用練習包練習', blocks:[
    PACK('packA',1,'練習包A：舊的10月報告'),
    PACK('packB',1,'練習包B：3月的月報'),
    `<p>用「動手試試」分頁中的評分表為練習包A和練習包B打分數，再和專家評分比較。接著試試練習包C和D。</p>`,
    Q('練習包D看起來比練習包C精美，有綠燈儀表板和充滿自信的管理評述。哪一份在評分表上的分數較高？',['練習包D','練習包C（31分對24分）','兩者分數相同','評分表無法判斷'],1,'練習包D在一次性項目、報廢成本、更改的定義和可靠性上被扣分。精美不等於品質。'),
    Q('練習包A的管理評述具備好評述所需的哪一項？',['對照預算的差異','原因','附負責人的行動','都沒有：它只是重複數字'],3,'和練習包B的管理評述比較：差異、原因、行動、展望。'),
    {t:'html',html:'<h3>之後，用你自己的報告</h3><p class="small" style="color:var(--muted)">準備好時，同一份評分表也適用於你自己的報告。你的分數只會留在這個瀏覽器中。下面的計畫是改善的順序。</p>'},
    CHECK('m9-plan','第1個月：可靠',[
      '約定月報截止日：第8個工作天或更早',
      '書面的月結檢核表，每月簽核',
      '已收貨未收發票、運費和加班費的應計項目',
      '規則：已發出的月份即結帳；延遲事項計入下個月'
    ]),
    CHECK('m9-plan2','第2個月：可比較、有說明',[
      '損益表加上預算和去年欄位，附占營收%',
      '依公式撰寫一頁管理評述：差異、原因、行動、展望',
      '每月都包含資產負債表和現金流量表'
    ]),
    CHECK('m9-plan3','第3個月：洞見與營運',[
      '一頁式KPI儀表板（第11單元）',
      '依產品線的毛利率',
      '應收帳款與存貨帳齡、13週現金流量預測（第10單元）',
      '報廢、重工和退貨成本分開列示'
    ]),
    REPORT('你的週一早晨對話',
      `<p>把你的評分表當作共同專案和會計人員分享，而不是批評。問：<strong>「這些項目中，下個月可以先加入哪三項？你需要我或團隊提供什麼才能做到？」</strong>答案往往是只有營運部門才能提供的資訊：生產資料、出貨紀錄、工時表。</p>`),
    K('重點整理',
      `<ul>
        <li>好的月報要及時、可靠、可比較、有說明、聚焦、有連結、前瞻且一致。</li>
        <li>以一頁摘要和真正的管理評述開頭：差異、原因、行動、展望。</li>
        <li>先改善可靠性，再加入比較，然後是洞見。</li>
        <li>發出後還會變動的數字，通常代表缺少應計項目。把月份結帳，並保持結帳狀態。</li>
       </ul>`)
  ]}
  ],
  warnings:[
    {sign:'月報在月底後超過10個工作天才送達', meaning:'結帳流程薄弱或財務人力不足。決策建立在舊消息上。', look:'結帳檢核表，以及時間花在哪裡。'},
    {sign:'月報發出後數字還會變動', meaning:'缺少應計項目或截止錯誤。報告的結果不可信。', look:'已收貨未收發票、運費和加班費的應計項目。'},
    {sign:'管理評述只是重複數字', meaning:'財務沒有和營運部門溝通，或不知道原因。', look:'針對三大差異問「為什麼？」'},
    {sign:'格式每個月都在變', meaning:'趨勢變得看不見；問題可能被藏起來。', look:'約定固定的範本和定義。'}
  ],
  formulas:[
    {name:'月報評分表', f:'20項標準 ×（0 沒有、1 部分、2 有）= 滿分40分', ex:'32分以上優秀 · 22–31尚可 · 12–21基本 · 12分以下薄弱'}
  ],
  glossary:[
    {term:'月度管理報告（Management pack）', def:'給經理人和股東的每月內部報告：財務報表、KPI、分析和管理評述。'},
    {term:'法定財務報表（Statutory accounts）', def:'依法律和會計準則編製、提供給稅務機關、主管機關和股東的年度財務報表。'},
    {term:'管理評述（Commentary）', def:'月度管理報告中的文字說明：什麼變動了、為什麼、正在採取什麼行動，以及展望。'},
    {term:'已收貨未收發票（Goods received not invoiced, GRNI）', def:'對已交貨並簽收、但供應商尚未開票的貨品所估列的應計項目。'},
    {term:'預算差異（Variance to budget）', def:'實際結果與預算之間的差額，以金額和%表示。'},
    {term:'展望（Outlook）', def:'管理階層對今年剩餘期間的最新預期，每月更新。'}
  ]
});
})();
