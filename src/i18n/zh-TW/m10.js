/* ===== Module 10: Reports beyond the statements ===== */
(function(){
const {K,TIP,FLAG,CASE,REPORT,Q,FS,FLIP,SORT,CHECK,W,PACK,money,signed,pct,kfmt} = BW.h;

BW.add({
  id:'m10', minutes:50,
  title:'財務報表以外的報告',
  subtitle:'三大財務報表告訴你發生了什麼。這些報告告訴你為什麼，以及接下來會發生什麼。',
  goals:[
    '看懂應收帳款帳齡分析，決定要對哪些客戶採取行動',
    '運用客戶與產品獲利分析，看出誰才真正讓你賺錢',
    '追蹤訂單、未出貨訂單與訂單出貨比，作為早期警訊',
    '建立並運用13週現金流量預測'
  ],
  sections:[
  {id:'map', label:'報告地圖', kind:'learn', title:'讓工廠運轉的報告', blocks:[
    `<p>財務報表是彙總。當其中某個數字變動時，你需要底下的明細才能找出原因。而且財務報表是回顧過去，所以你也需要一些往前看的報告。以下是對BraceWorks重要的一套報告。</p>`,
    {t:'tbl', head:['報告','回答的問題','頻率'], rows:[
      ['<strong>應收帳款帳齡分析</strong>','誰欠我們錢？逾期多久？','每週'],
      ['<strong>應付帳款帳齡分析</strong>','我們欠誰錢？何時到期？','每週'],
      ['<strong>存貨庫齡分析</strong>','哪些存貨不動？（第7單元）','每月'],
      ['<strong>依客戶與產品的利潤率</strong>','誰、什麼東西真正讓我們賺錢？','每月或每季'],
      ['<strong>訂單與未出貨訂單</strong>','在反映到銷貨之前，需求是在成長還是萎縮？','每週'],
      ['<strong>生產KPI</strong>','產出、效率、報廢與良率、準時交貨','每天到每週'],
      ['<strong>13週現金流量預測</strong>','未來一季，每一週的現金夠不夠用？','每週'],
      ['<strong>預算與實際比較</strong>','我們有照計畫走嗎？（第15單元）','每月']
    ]},
    K('落後與領先',
      `<p>損益表是<strong>落後</strong>報告：它告訴你已經發生的事。接到的訂單、尚未成交的報價、逾期應收帳款與現金預測則是<strong>領先</strong>指標：它們告訴你即將發生什麼。好的總經理花在領先報告上的時間至少一樣多。</p>`)
  ]},
  {id:'aging', label:'應收帳款帳齡分析', kind:'play', title:'誰欠BraceWorks錢？', blocks:[
    `<p>BraceWorks的應收帳款共$230,000。<span class="term">應收帳款帳齡分析</span>依客戶、以及每張發票逾期的時間來拆分這筆金額。點選一位客戶，看看你會怎麼做。</p>`,
    W('年底應收帳款帳齡分析', function(el, ctx){
      const {money}=ctx.h; const k=x=>x?money(x*1000):'–';
      const R=[
        ['美國經銷商A',40,10,0,0,0,'你最大的客戶，占銷貨22%。大多未到期。稍微逾期的$10k只是時間差。維持每週一次友善的聯繫。','good'],
        ['澳洲醫院供應商',22,5,0,0,0,'健康。月底付款會稍晚一點。除了一般提醒外不必採取行動。','good'],
        ['德國經銷商',20,0,6,0,0,'有一張$6k的發票逾期45天。可能有爭議。問問業務：是否有品質或交貨問題？','warn'],
        ['瑞典經銷商',24,0,0,0,0,'完美的付款客戶。考慮給他們更好的條件或優先待遇。值得好好維繫。','good'],
        ['美國經銷商B',10,5,8,0,0,'情況正在惡化：六個月前他們都準時付款，現在有$13k逾期。打電話給老闆，問問發生了什麼變化，並在最舊的發票付清前暫停下一批出貨。','bad'],
        ['阿聯經銷商',0,0,0,0,28,'$28k逾期超過180天且聯絡不上。停止所有出貨、發出正式催告、考慮委託催收公司或申請信用保險理賠，並在帳上提列（第4單元）。','bad'],
        ['英國經銷商',12,0,0,8,0,'$8k逾期75天，其餘未到期。常見原因是發票遺失或文件不齊。請財務這週打給對方的應付帳款團隊。','warn'],
        ['其他19位客戶',32,0,0,0,0,'全部未到期。小客戶，管理良好。','good']
      ];
      const cols=['未到期','1–30','31–60','61–90','90+'];
      const tot=cols.map((c,i)=>R.reduce((s,r)=>s+r[i+1],0));
      el.innerHTML=`<div class="tbl"><table class="grid"><thead><tr><th>客戶</th>${cols.map(c=>`<th class="v">${c}</th>`).join('')}<th class="v">合計</th></tr></thead><tbody></tbody><tfoot></tfoot></table></div><div data-note class="msg info">點選客戶名稱。</div>`;
      const tb=el.querySelector('tbody');
      R.forEach(r=>{ const tr=document.createElement('tr'); const t=r.slice(1,6).reduce((a,b)=>a+b,0);
        tr.innerHTML=`<td><button type="button" class="linkbtn" style="text-align:left;font-size:14px">${r[0]}</button></td>${r.slice(1,6).map((x,i)=>`<td class="v ${x&&i>=2?'neg':''}">${k(x)}</td>`).join('')}<td class="v"><strong>${k(t)}</strong></td>`;
        tr.querySelector('button').onclick=()=>{ tb.querySelectorAll('tr').forEach(x=>x.style.background=''); tr.style.background='var(--accent-soft)'; const n=el.querySelector('[data-note]'); n.className='msg '+r[7]; n.innerHTML=`<strong>${r[0]}：</strong> ${r[6]}`; };
        tb.appendChild(tr); });
      el.querySelector('tfoot').innerHTML=`<tr><td><strong>合計</strong></td>${tot.map(x=>`<td class="v"><strong>${k(x)}</strong></td>`).join('')}<td class="v"><strong>${k(tot.reduce((a,b)=>a+b,0))}</strong></td></tr><tr><td class="small">占合計%</td>${tot.map(x=>`<td class="v small">${(x/230*100).toFixed(0)}%</td>`).join('')}<td class="v small">100%</td></tr>`;
    }),
    K('如何解讀帳齡分析',
      `<ul>
        <li><strong>看分布。</strong>70%未到期，算合理。但有$50k（22%）逾期超過30天。</li>
        <li><strong>逐一看客戶的趨勢。</strong>一位客戶在幾個月內從未到期滑到31–60天、再到61–90天，比一張你了解來龍去脈的大額舊發票更令人擔心。</li>
        <li><strong>逾期超過90天是問題，不是時間差。</strong>超過90天後每多一個月，收回的機會就大幅下降。</li>
        <li><strong>計算應收帳款週轉天數：</strong>應收帳款 ÷ 銷貨 × 365 = $230,000 ÷ $1,200,000 × 365 = <strong>70天</strong>。</li>
       </ul>`),
    TIP('授信管理基本功',
      `<p>每位客戶都應有<strong>信用額度</strong>與議定的付款條件。到期前寄出提醒，逾期7天打電話，逾期30到45天暫停出貨。對不熟悉的出口客戶，使用信用狀或信用保險（第17單元）。</p>`)
  ]},
  {id:'margin', label:'誰讓你賺錢？', kind:'play', title:'客戶獲利分析', blocks:[
    `<p>依產品看毛利率是個起點。但購買相同產品的兩位客戶，服務起來可能天差地遠。一位以FOB條件整櫃下單、準時付款；另一位下小批量、客製標籤、要求送到門口，而且晚付款。<span class="term">服務成本</span>反映的就是這個差異。</p>`,
    W('BraceWorks主要客戶排名', function(el, ctx){
      const {money,pct}=ctx.h;
      const C=[
        {n:'美國經銷商A',rev:264000,gm:0.26,frt:0,cts:4000,bad:0,note:'FOB大單，標準產品'},
        {n:'澳洲醫院供應商',rev:150000,gm:0.29,frt:9000,cts:3000,bad:0,note:'CIF條件，訂單穩定'},
        {n:'瑞典經銷商',rev:96000,gm:0.31,frt:2000,cts:2000,bad:0,note:'FCA，提前付款'},
        {n:'德國經銷商',rev:110000,gm:0.31,frt:12000,cts:6000,bad:0,note:'DDP，小訂單多'},
        {n:'英國經銷商',rev:70000,gm:0.28,frt:4000,cts:5000,bad:0,note:'每張訂單都要客製標籤'},
        {n:'阿聯經銷商',rev:60000,gm:0.30,frt:3000,cts:2000,bad:21000,note:'備抵呆帳'}
      ].map(c=>Object.assign(c,{gp:c.rev*c.gm,contrib:c.rev*c.gm-c.frt-c.cts-c.bad}));
      let mode='rev'; const segEl=document.createElement('div'), out=document.createElement('div'); el.append(segEl,out);
      function draw(){
        const list=[...C].sort((a,b)=> mode==='rev'?b.rev-a.rev: mode==='gp'?b.gm-a.gm : b.contrib/b.rev-a.contrib/a.rev);
        const val=c=> mode==='rev'?c.rev: mode==='gp'?c.gp : c.contrib;
        out.innerHTML=ctx.ui.bars(list.map(c=>({label:c.n,v:val(c),tone:val(c)<0?'bad':mode==='contrib'&&c.contrib/c.rev<0.18?'warn':mode==='contrib'?'good':''})),{max:Math.max(...C.map(val))})+
          ctx.ui.table(['客戶','營業收入','營業毛利','運費','服務成本','呆帳','邊際貢獻','%'],list.map(c=>[`${c.n}<div class="small" style="color:var(--muted)">${c.note}</div>`,money(c.rev),money(c.gp),c.frt?money(-c.frt):'–',money(-c.cts),c.bad?money(-c.bad):'–',`<strong class="${c.contrib<0?'neg':''}">${money(c.contrib)}</strong>`,pct(c.contrib/c.rev)]),{num:[1,2,3,4,5,6,7]})+
          `<p class="w-hint">${mode==='rev'?'依營業收入排名，阿聯經銷商看起來是中型客戶。現在切換到邊際貢獻。':mode==='gp'?'依毛利率%排名，德國經銷商看起來是你最好的客戶。但毛利率%忽略了交貨與收款的成本。':'扣除運費、服務成本與呆帳後，德國經銷商從毛利率最高掉到低於平均，而阿聯經銷商則在虧錢。毛利率最低的美國經銷商A，以金額計才是你最有價值的客戶。'}</p>`;
      }
      ctx.ui.seg(segEl,[{v:'rev',label:'依營業收入排名'},{v:'gp',label:'依毛利率%排名'},{v:'contrib',label:'依邊際貢獻%排名'}],'rev',v=>{mode=v;draw();});
      draw();
    }),
    K('化為行動',
      `<ul>
        <li><strong>依服務成本訂價：</strong>小訂單附加費、運費按實際成本收取、標籤費。</li>
        <li><strong>改條件，不只是改價格：</strong>把德國經銷商從DDP改為FCA或CIF，並設定最低訂購量。</li>
        <li><strong>保護你最好的客戶：</strong>美國經銷商A買走全部營收的22%。讓他們滿意，同時降低依賴他們的風險（第11單元）。</li>
       </ul>`)
  ]},
  {id:'ops', label:'訂單與營運', kind:'learn', title:'訂單、未出貨訂單與工廠現場', blocks:[
    `<h3>訂單告訴你未來</h3>
     <p>本月的銷貨大多來自一到三個月前接到的訂單。所以接單量是你察覺景氣放緩或需求暴增最好的早期警訊。</p>`,
    {t:'tbl', head:['指標','公式','BraceWorks，上一季','意義'], opts:{num:[2]}, rows:[
      ['<strong>訂單出貨比</strong>','接單金額 ÷ 出貨銷貨金額','0.92','低於1.0：接單速度慢於出貨速度。未出貨訂單正在減少。'],
      ['<strong>未出貨訂單</strong>','已接單但尚未出貨的訂單','$180,000','約1.8個月的銷貨，一季前是2.3個月。'],
      ['<strong>報價成交率</strong>','成交報價數 ÷ 發出報價數','31%','成交率下降可能代表價格偏離市場，或報價太慢。']
    ]},
    `<p>一季的訂單出貨比為0.92，代表除非訂單回升，兩三個月後銷貨就會下滑。等你在損益表上看到時，事情已經發生了。</p>
     <h3>解釋金錢的工廠KPI</h3>`,
    {t:'tbl', head:['KPI','衡量什麼','BraceWorks','關聯到'], opts:{num:[2]}, rows:[
      ['<strong>準時足量交貨率（OTIF）</strong>','在承諾日期前完整出貨的訂單比例','87%','客戶留存、運費（趕件空運）'],
      ['<strong>一次良率</strong>','第一次就通過品保、不需重工的產品比例','95.9%','重工成本、人工效率'],
      ['<strong>報廢率</strong>','報廢材料 ÷ 領用材料','4.1%','材料數量差異'],
      ['<strong>人工效率</strong>','達成標準工時 ÷ 實際工作時數','93%','人工效率差異、單位成本'],
      ['<strong>每人工小時產出</strong>','按標準計算的營業收入 ÷ 直接工時','$23.70','產能與訂價決策']
    ]},
    TIP('每張桌子一個數字',
      `<p>每一項KPI都應有一位能改變它的負責人。OTIF歸生管與生產；報廢率歸生產主管；訂單出貨比歸業務。數字一動，你就知道該問誰。</p>`)
  ]},
  {id:'cash13', label:'13週現金流量預測', kind:'play', title:'13週現金流量預測', blocks:[
    `<p>對小型製造商來說，這是最有用的一份報告。它<strong>逐週</strong>列出未來一季預計的收款與付款，讓你在現金吃緊前幾週就看到。它的資料來自應收帳款帳齡分析、應付帳款帳齡分析、發薪日程、借款還款計畫與預計採購。</p>`,
    W('BraceWorks未來13週', function(el, ctx){
      const {money}=ctx.h;
      const BASE_REC=[16,18,44,15,17,20,40,16,18,19,42,16,18];
      const LUMP={2:25,6:25,10:25}; // US distributor A monthly payment (weeks 3, 7, 11)
      const OPEN=42, LIMIT=30, BUFFER=15;
      const opts={late:false,foam:false,slow:false,machine:false};
      el.innerHTML=`<p class="w-hint">開啟各種假設情境，觀察最低點。流動性＝現金＋$30k未動用的透支額度。紅色長條（低於$15k）表示太接近警戒線。</p><div data-t class="seg"></div><div data-out></div>`;
      const T=[['late','美國經銷商A晚3週付款'],['foam','第5週大量採購泡棉$30k'],['slow','銷貨比計畫低10%（自第6週起收款減少）'],['machine','第6週支付新機器訂金$15k']];
      const tEl=el.querySelector('[data-t]');
      T.forEach(([k,l])=>{ const b=document.createElement('button'); b.type='button'; b.textContent=l; b.setAttribute('aria-pressed','false'); b.onclick=()=>{ opts[k]=!opts[k]; b.setAttribute('aria-pressed',String(opts[k])); draw(); }; tEl.appendChild(b); });
      const out=el.querySelector('[data-out]');
      function draw(){
        const rec=BASE_REC.slice();
        if(opts.late){ Object.keys(LUMP).forEach(w=>{ w=+w; rec[w]-=LUMP[w]; if(w+3<13) rec[w+3]+=LUMP[w]; }); }
        if(opts.slow){ for(let i=5;i<13;i++) rec[i]=rec[i]*0.9; }
        const pay=[];
        for(let i=0;i<13;i++){ let p=15; if(i%2===1) p+=12; if(i%4===0) p+=9; if(i===3||i===7||i===11) p+=6; if(i===9) p+=5; if(opts.foam&&i===4) p+=30; if(opts.machine&&i===5) p+=15; pay.push(p); }
        let bal=OPEN; const rows=[], liq=[];
        for(let i=0;i<13;i++){ bal=bal+rec[i]-pay[i]; liq.push(bal+LIMIT); rows.push([`第${i+1}週`,money(Math.round(rec[i]*1000)),money(-pay[i]*1000),`<strong class="${bal<0?'neg':''}">${money(Math.round(bal*1000))}</strong>`,`<span class="${bal+LIMIT<BUFFER?'neg':''}">${money(Math.round((bal+LIMIT)*1000))}</span>`]); }
        const min=Math.min(...liq), wk=liq.indexOf(min)+1;
        const maxL=Math.max(...liq,OPEN+LIMIT);
        const chart='<div data-chart></div>';
        out.innerHTML=`<div class="stats" style="margin:12px 0">${ctx.ui.stat('最低流動性',money(Math.round(min*1000)),min<0?'bad':min<BUFFER?'warn':'good',`在第${wk}週`)}${ctx.ui.stat('第13週現金',money(Math.round(bal*1000)))}</div>
          <h4 style="margin:4px 0 8px">每週流動性（現金＋未動用透支額度）</h4>${chart}
          <div class="msg ${min<0?'bad':min<BUFFER?'warn':'good'}" style="margin-top:12px">${min<0?`在第${wk}週，BraceWorks的現金與透支額度都會用完。薪資發放有風險。現在就行動：催收帳款、延後採購，或趁還來得及時向銀行申請暫時提高額度。`:min<BUFFER?`第${wk}週很緊。還不是危機，但再來一個意外就是了。現在就決定你會延後哪筆付款，或提前收回哪筆帳款。`:'整段期間都很寬裕。現在試著同時開啟兩個假設情境。問題很少單獨出現。'}</div>
          <details style="margin-top:12px"><summary style="cursor:pointer">顯示每週明細表</summary>${ctx.ui.table(['週','收款','付款','期末現金','流動性'],rows,{num:[1,2,3,4]})}</details>`;
        BW.viz.mount(out.querySelector('[data-chart]'),BW.viz.line({label:'未來13週每週的流動性。',x:liq.map((v,i)=>'W'+(i+1)),fmt:kfmt,tfmt:x=>money(Math.round(x)),dots:true,zero:true,endLabels:false,table:false,
          series:[{name:'流動性',v:liq.map(v=>Math.round(v*1000)),c:min<0?'s2':'s1'}],refs:[{v:BUFFER*1000,label:'安全水位$15k',cls:'bad'}],band:min<0?{lo:Math.min(-15000,Math.round(min*1000)-5000),hi:0,label:'現金用罄'}:null,
          marks:[{i:wk-1,label:money(Math.round(min*1000)),dy:18}]}));
      }
      draw();
    }),
    K('如何運作',
      `<ul>
        <li><strong>每週更新，</strong>每次往後滾動一週。</li>
        <li><strong>收款</strong>來自應收帳款帳齡分析，並依每位客戶實際的付款習慣調整，而非到期日。</li>
        <li><strong>付款</strong>來自應付帳款、發薪日、租金、借款還款計畫、繳稅日與預計採購。</li>
        <li><strong>把上週的預測和實際發生的情況比較。</strong>隨著你摸清哪些客戶會晚付，預測就會越來越準。</li>
        <li><strong>盯住最低點，</strong>並事先決定若它接近零時你會怎麼做。</li>
       </ul>`)
  ]},
  {id:'case', label:'個案：逐漸消失的客戶', kind:'case', title:'慢慢消失的那位客戶', blocks:[
    CASE('美國經銷商B',
      `<p>美國經銷商B五年來一直是穩定的客戶。三月時它聲請破產，欠BraceWorks <strong>$23,000</strong>。倉庫裡還有<strong>$14,000的客製標籤存貨</strong>，是專為它生產的，不重新貼標就賣不出去。</p>
       <p>回頭檢視報告，徵兆早在八個月前就出現了：</p>`),
    {t:'tbl', head:['月份','平均付款天數','訂單','發生了什麼'], opts:{num:[1]}, rows:[
      ['7月','32','$14,000','正常'],['8月','38','$12,000','兩張發票一起付'],['9月','47','$11,000','要求把付款條件從30天改為60天'],
      ['10月','55','$9,000','「暫付」整數$5,000，而非針對特定發票付款'],['11月','63','$12,000','超過信用額度；業務仍核准出貨'],
      ['12月','71','$6,000','換了新的應付帳款窗口；回覆很慢'],['1月','82','$4,000','三度承諾「下週」付款'],['2月','–','$0','不再回應']
    ]},
    SORT('以下哪些是警訊？',['警訊','正常'],[
      {text:'平均付款天數逐月上升', a:0, why:'付款天數穩定拉長，是客戶現金出問題最明顯的早期訊號。'},
      {text:'要求延長付款條件', a:0, why:'客戶缺現金時就會要求更長的付款期限。'},
      {text:'以整數金額「暫付」，而非針對特定發票付款', a:0, why:'他們付的是能負擔的金額，而不是欠的金額。'},
      {text:'同時訂單也在縮減', a:0, why:'他們自己的銷售正在下滑。'},
      {text:'客戶剛好在到期日付款', a:1, why:'這正是你想要的。'},
      {text:'因為「他們是好客戶」而超過信用額度出貨', a:0, why:'信用額度就是為這種情況而設。要越過額度應需經總經理核准。'}
    ]),
    K('會計原本可以做什麼',
      `<p>每個訊號都在報告裡：帳齡分析、付款紀錄、信用額度檢查。缺少的是有人<strong>按客戶、隨時間</strong>去看它們，以及一條把訊號轉成行動的規則。若在逾期45天時暫停出貨，BraceWorks可能只損失$6,000，而不是$37,000。對客製標籤訂單收取訂金，也能涵蓋大部分存貨。</p>`)
  ]},
  {id:'quiz', label:'測驗', kind:'quiz', title:'檢驗你的理解', blocks:[
    Q('應收帳款$230,000，年銷貨$1,200,000。應收帳款週轉天數是多少？',['19天','52天','70天','100天'],2,'$230,000 ÷ $1,200,000 × 365 = 70天。'),
    Q('哪一位客戶最令人擔心？',['$40k全部未到期','$28k，全部逾期超過180天，聯絡不上','$24k，總是提前付款','$12k未到期，另有$8k因發票遺失逾期75天'],1,'聯絡不上的客戶所欠的極舊帳款，最可能收不回來。'),
    Q('訂單出貨比已經一季都是0.92。這代表什麼？',['未來幾個月銷貨可能下滑','利益正在上升','存貨太低','客戶付款變快'],0,'接單速度慢於出貨速度，所以未出貨訂單與未來銷貨都會縮減。'),
    Q('為什麼毛利率%最高的客戶，可能是獲利最低的客戶之一？',['毛利率算錯了','高運費、小訂單、客製工作或晚付款可能吃掉利潤','高毛利客戶總是晚付款','不可能'],1,'服務成本位於毛利之下。扣除這些成本後的邊際貢獻才說出真相。'),
    Q('13週現金流量預測應多久更新一次？',['每年','每季','每週','只在危機時'],2,'每週，往後滾動。它的價值在於提前幾週看到問題。'),
    Q('一位客戶開始以整數金額「暫付」，而非針對特定發票付款。這通常代表什麼？',['他們換了會計系統','他們付的是能負擔的金額，是現金出問題的徵兆','他們付多了','沒什麼'],1,'把它當成早期警訊：檢討他們的信用額度與付款條件。')
  ]},
  {id:'apply', label:'練習', kind:'apply', title:'用練習包練習', blocks:[
    PACK('packC',5,'練習包C，第5頁：應收帳款帳齡分析'),
    Q('哪一位客戶這週需要採取行動？',['美國經銷商A（$88k，全部未到期）','美國經銷商B（$45k，其中$39k逾期、$10k逾期超過90天）','瑞典經銷商','其他客戶'],1,'一位合作五年的客戶逐步滑過每個帳齡區間：暫停出貨並打電話給對方老闆（第10單元）。'),
    Q('7月創下銷貨新高，但訂單出貨比是0.88。這代表什麼？',['訂單強勁','創紀錄的月份是靠既有的未出貨訂單出貨；新進訂單較少，所以銷貨會回落','客戶付款變快','沒什麼'],1,'未出貨訂單降到1.4個月。沒有新訂單，8月和9月會比較弱。'),
    Q('付款條件90天的美國經銷商A，占練習包C應收帳款的比例約多少？',['約10%','約29%','約50%','約75%'],1,'$88,000 ÷ $302,000 ≈ 29%。這一組付款條件就解釋了應收帳款週轉天數上升的大部分原因。'),
    {t:'html',html:'<h3>之後，用你自己的報告</h3><p class="small" style="color:var(--muted)">選讀。下次閱讀你自己的月報時，使用這份檢核表。這裡的內容不會分享或傳送；勾選內容只儲存在這個瀏覽器中。</p>'},
    CHECK('m10-ops','我會收到，而且真的會看……',[
      '每週一份依客戶分列的應收帳款帳齡分析',
      '超過信用額度或逾期超過30天的客戶清單，以及對應行動',
      '至少每季一次、包含運費與服務成本的客戶別利潤率',
      '每週的接單金額、未出貨訂單與訂單出貨比',
      '每週更新、標出最低點的13週現金流量預測',
      '上週現金預測與實際結果的比較',
      '每週的OTIF、報廢率、一次良率與人工效率'
    ]),
    REPORT('你的週一早晨要求',
      `<p>請財務<strong>在週五前提出13週現金流量預測</strong>，即使只是試算表上的粗略版本也行。第一版不會完美。沒關係。每週更新才會讓它變準，也會讓你成為從不被現金嚇到的總經理。</p>`),
    K('重點回顧',
      `<ul>
        <li>財務報表是彙總。帳齡、利潤率與營運報告負責解釋它們。</li>
        <li>按客戶、隨時間來看應收帳款。付款天數逐漸拉長是早期警訊。</li>
        <li>扣除服務成本後的客戶獲利，可能推翻毛利率給你的印象。</li>
        <li>訂單與未出貨訂單能預測銷貨。訂單出貨比低於1.0是警訊。</li>
        <li>13週現金流量預測是你的油表。每週更新。</li>
       </ul>`)
  ]}
  ],
  warnings:[
    {sign:'客戶的付款天數逐月上升', meaning:'這位客戶可能有現金問題。', look:'依客戶的付款紀錄；信用額度；訂單趨勢。'},
    {sign:'超過信用額度仍核准出貨', meaning:'授信管理被業績壓力凌駕。', look:'暫停出貨例外報告；由誰核准。'},
    {sign:'訂單出貨比連續一季低於1.0', meaning:'未來幾個月銷貨會下滑。', look:'依客戶與市場的訂單；報價成交率。'},
    {sign:'高毛利率客戶的邊際貢獻卻很低', meaning:'運費、小訂單、客製工作或晚付款正在吃掉利潤。', look:'依客戶的服務成本。'},
    {sign:'沒有前瞻性的現金預測', meaning:'現金問題會毫無預警地出現。', look:'建立13週預測並每週更新。'}
  ],
  formulas:[
    {name:'應收帳款週轉天數（DSO）', f:'應收帳款 ÷ 銷貨 × 365', ex:'$230,000 ÷ $1,200,000 × 365 = 70天'},
    {name:'訂單出貨比', f:'接單金額 ÷ 出貨銷貨金額（同一期間）', ex:'$276,000 ÷ $300,000 = 0.92'},
    {name:'客戶邊際貢獻', f:'營業毛利 − 運費 − 服務成本 − 呆帳', ex:'德國經銷商：$34,100 − $12,000 − $6,000 = $16,100'},
    {name:'人工效率', f:'達成標準工時 ÷ 實際工作時數', ex:'47,100 ÷ 50,650 = 93%'}
  ],
  glossary:[
    {term:'應收帳款帳齡分析（Receivables aging）', def:'列出每位客戶所欠金額、並依逾期時間分組的報告。'},
    {term:'應收帳款週轉天數（Days sales outstanding, DSO）', def:'客戶付款平均所需的天數。'},
    {term:'信用額度（Credit limit）', def:'客戶在任何時點可積欠的上限，超過即暫停出貨。'},
    {term:'服務成本（Cost to serve）', def:'產品本身以外供應客戶的成本：運費、小訂單、客製工作、行政、收款。'},
    {term:'訂單出貨比（Book-to-bill ratio）', def:'接單金額除以出貨銷貨金額。高於1.0代表未出貨訂單在增加。'},
    {term:'未出貨訂單（Order backlog）', def:'已接單但尚未出貨的訂單。亦稱在手訂單。'},
    {term:'準時足量交貨率（OTIF）', def:'On time in full：在承諾日期前完整交貨的訂單比例。'},
    {term:'一次良率（First-pass yield）', def:'第一次就通過品質檢驗、不需重工的產品比例。'},
    {term:'13週現金流量預測（13-week cash forecast）', def:'未來一季逐週的收款、付款與現金預估。'},
    {term:'領先指標（Leading indicator）', def:'在結果之前就先變動的指標，例如接單量。'},
    {term:'落後指標（Lagging indicator）', def:'在事後才報告結果的指標，例如獲利。'}
  ]
});
})();
