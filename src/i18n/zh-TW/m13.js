/* ===== Module 13: Product, customer and sourcing decisions ===== */
(function(){
const {K,TIP,FLAG,CASE,REPORT,Q,FS,FLIP,SORT,CHECK,W,PACK,money,signed,pct,kfmt} = BW.h;

BW.add({
  id:'m13', minutes:50,
  title:'產品、客戶與採購決策',
  subtitle:'自製還是外購、接不接那張特別的訂單、弱勢產品要停產還是保留。關鍵在於看清楚哪些成本真的會改變。',
  goals:[
    '區分攸關成本、沉沒成本與不變的固定成本',
    '運用邊際貢獻與閒置產能決定是否接受特殊訂單',
    '比較自製與外購零件，不只看單價',
    '依每瓶頸工時邊際貢獻為產品排序'
  ],
  sections:[
  {id:'rel', label:'攸關成本', kind:'learn', title:'只有會改變的成本才重要', blocks:[
    `<p>每個決策都在比較兩種未來：做，或不做。唯一重要的成本與收入，是<strong>在這兩種未來之間有差異</strong>的那些。會計人員稱之為<span class="term">攸關成本</span>（relevant cost）。</p>`,
    FLIP([
      {f:'沉沒成本', b:'<strong>已經花掉的錢，任何決策都拿不回來。</strong>買泡棉切割機已付的$60,000，與下個月要不要用它無關。只有未來的成本才重要。'},
      {f:'不變的固定成本', b:'<strong>無論怎麼選都一樣的成本，不影響決策。</strong>不管你接不接額外訂單，廠房租金都要付。單位成本中分攤的間接費用往往掩蓋了這一點。'},
      {f:'變動成本', b:'<strong>通常是攸關的。</strong>額外的訂單需要額外的材料、運費和佣金。'},
      {f:'可避免的固定成本', b:'<strong>真的會消失時才攸關。</strong>停產某項產品，只有在你真的減少人力，或把人調去做其他有收入的工作時，才能省下它的人工。'},
      {f:'機會成本', b:'<strong>你放棄的最佳替代方案的價值。</strong>如果縫製線已經滿載，多接一張吊帶訂單，代價就是你原本可以縫製的床墊。'}
    ]),
    K('完全單位成本的陷阱',
      `<p>完全單位成本（第6單元）包含一部分固定的間接費用。用於長期定價和存貨評價時沒有問題。但對一次性的決策來說，它會誤導你，因為那些間接費用不會隨決策而改變。請用<strong>邊際貢獻</strong>和真正會改變的成本。</p>`),
    SORT('與決策攸關，還是無關？',['攸關','無關'],[
      {text:'決定是否接一張一次性訂單：訂單所需的泡棉', a:0, why:'只有接單才會購買。'},
      {text:'決定是否接一張一次性訂單：廠房租金', a:1, why:'無論如何都要付。'},
      {text:'決定機器要修還是換：6年前買它花的錢', a:1, why:'這是沉沒成本。只有未來的成本與效益才重要。'},
      {text:'決定是否停產某項產品：你將資遣的那位主管的薪資', a:0, why:'可以避免，所以攸關。'},
      {text:'決定是否停產某項產品：分攤給它、之後會重新分攤到其他產品的間接費用', a:1, why:'這筆成本不會消失，只是換個地方。'},
      {text:'產線滿載時接單：因此必須推掉的訂單原本能賺的利潤', a:0, why:'這就是機會成本。'}
    ])
  ]},
  {id:'special', label:'特殊訂單', kind:'play', title:'低價訂單', blocks:[
    `<p>肯亞一家衛生NGO詢問<strong>2,000條病患吊帶，每條$32</strong>，在工廠取貨。BraceWorks的正常售價是$45。完全單位成本是$27.12，所以業務經理說：「每條只賺$4.88，不值得麻煩。」她說得對嗎？</p>`,
    W('特殊訂單計算器', function(el, ctx){
      const {money,signed}=ctx.h;
      const top=document.createElement('div'), out=document.createElement('div'); el.append(top,out);
      const VC=18.30, HRS=1.5, OT=4.5;
      ctx.ui.sliders(top,[
        {k:'price',label:'每條吊帶的報價',min:20,max:45,step:0.5,v:32,f:x=>money(x,2)},
        {k:'qty',label:'數量',min:500,max:4000,step:100,v:2000,f:x=>x.toLocaleString('en-US')},
        {k:'spare',label:'可用的閒置人工工時',min:0,max:5000,step:250,v:2000,f:x=>x.toLocaleString('en-US')+' 小時'}
      ],(v)=>{
        const need=v.qty*HRS, ot=Math.max(0,need-v.spare), otCost=ot*OT;
        const rev=v.qty*v.price, var_=v.qty*VC, inc=rev-var_-otCost;
        const fullView=v.qty*(v.price-27.12);
        out.innerHTML=ctx.ui.table(['增量觀點','金額'],[
          ['增加的營業收入',money(rev)],
          ['材料與處理費（每條$18.30）',money(-var_)],
          [`超出閒置產能的${ot.toLocaleString('en-US')}小時加班（每小時$4.50）`,money(-otCost)],
          ['閒置產能內的人工','$0（本來就要付）'],
          ['製造費用','$0（不會改變）'],
          {cls:'',cells:['<strong>這張訂單增加的利潤</strong>',`<strong class="${inc<0?'neg':'pos'}">${signed(Math.round(inc))}</strong>`]}
        ],{num:[1]})+
        `<div class="stats" style="margin-top:12px">${ctx.ui.stat('完全成本觀點顯示',signed(Math.round(fullView)),fullView<0?'bad':'warn','此處會誤導')}${ctx.ui.stat('實際增加的利潤',signed(Math.round(inc)),inc>0?'good':'bad')}</div>
        <p class="w-hint" style="margin-top:10px">${inc<=0?'在這個價格和產能下，這張訂單會虧錢。婉拒，或提議在產線有閒置產能時延後交貨。':v.spare>=need?'閒置產能足夠時，每條高於$18.30的部分都是額外利潤。製造費用本來就已經付了。':'部分訂單需要加班，侵蝕了獲利。能不能把交貨分散到比較清閒的月份？'}</p>`;
      },ctx.uid);
    }),
    K('什麼時候可以接受較低的價格',
      `<ul>
        <li><strong>價格高於變動成本</strong>，再加上加班、模具或運費等額外成本。</li>
        <li><strong>有閒置產能，</strong>所以你不會因此推掉按正常價格的訂單。</li>
        <li><strong>價格不會外溢。</strong>如果你的常態經銷商聽說有$32的吊帶，你可能得對所有人降價。不同的市場、不同的品牌標籤，或一次性的標案，能降低這個風險。</li>
        <li><strong>不會變成習慣。</strong>如果每個淡季都用便宜訂單填滿，固定成本永遠回收不了。</li>
       </ul>`)
  ]},
  {id:'make', label:'自製或外購', kind:'learn', title:'自己做，還是外購？', blocks:[
    `<p>一家供應商提議供應縫製好的床墊套，<strong>每個$27.00</strong>。BraceWorks自行製作一個床墊套的完全成本是<strong>$35.39</strong>。看起來每個輕鬆省下$8.39，一年就是$23,500。</p>`,
    FS({title:'自行製作一個床墊套', cols:['完全成本','人員留任時的攸關成本'], rows:[
      ['布料、拉鍊、包邊和縫線', [16.54, 16.54]],
      ['人工：3.1小時裁剪與縫製，每小時$3.00', [9.30, 0]],
      ['變動製造費用：電力和針具', [0.60, 0.60]],
      ['固定製造費用，每小時$3.08', [8.95, 0]],
      ['每個床墊套成本', [35.39, 17.14], 'total']
    ], fmt:x=>money(x,2), note:'如果縫製團隊無論如何都會留任，外購床墊套時，他們的薪資和固定製造費用並不會消失。'}),
    `<p>現在比較的結果不一樣了。外購要$27.00。自製的話，如果人員留任，額外的現金支出只有$17.14。<strong>外購每個反而多花$9.86</strong>，除非空出來的縫製時間能用在更有價值的地方。</p>
     <h3>什麼時候外購才合理</h3>
     <ul>
      <li><strong>縫製線是瓶頸</strong>，空出產能能讓你以完整的邊際貢獻多做床墊或吊帶。</li>
      <li>你真的<strong>減少了人力</strong>或加班。這時人工才變成攸關成本。</li>
      <li>供應商<strong>做得比較好</strong>：不良率更低，或擁有你沒有的能力。</li>
     </ul>`,
    FLAG('價格以外的考量',
      `<p>對醫療器材製造商來說，把零件委外代表要依ISO 13485評鑑及稽核供應商、管控他們的變更，並維持可追溯性。再加上前置時間、最低訂購量、匯率，以及單一來源的風險。這些成本即使沒有出現在報價單上，也是真實存在的。</p>`),
    Q('縫製線已經滿載，而外購床墊套空出的時間，一年可以多做900張床墊，每張邊際貢獻$74.20。這會改變答案嗎？',[
      '不會，自製還是比較便宜',
      '會。多出來的床墊增加約$66,800的邊際貢獻，遠高於外購2,800個床墊套多花的$27,600',
      '只有供應商在同一個國家才會',
      '只取決於完全單位成本'],1,
      '機會成本決定了答案。外購床墊套多花$9.86 × 2,800 = $27,600，但空出的時間價值$66,800。當產能是限制條件時，瓶頸的時間就是工廠裡最有價值的東西。')
  ]},
  {id:'bottle', label:'瓶頸', kind:'play', title:'產線滿載的時候', blocks:[
    `<p>當需求超過產能時，問題就從「哪個產品利潤率最好？」變成<strong>「哪個產品在每個瓶頸工時賺最多？」</strong>在BraceWorks，瓶頸是縫製。</p>`,
    {t:'tbl', head:['每單位','床墊','吊帶','護具'], opts:{num:[1,2,3]}, rows:[
      ['邊際貢獻','$74.20','$24.30','$14.52'],['邊際貢獻率','41.2%','54.0%','51.9%'],['縫製工時','2.6','1.2','1.4'],
      {cls:'',cells:['<strong>每縫製工時邊際貢獻</strong>','<strong>$28.54</strong>','<strong>$20.25</strong>','<strong>$10.37</strong>']},
      ['明年最大需求','3,400','8,000','14,500']
    ]},
    W('縫製受限時的產品組合', function(el, ctx){
      const {money}=ctx.h;
      const top=document.createElement('div'), out=document.createElement('div'); el.append(top,out);
      const P=[{n:'床墊',c:74.2,cm:0.412,h:2.6,d:3400},{n:'吊帶',c:24.3,cm:0.54,h:1.2,d:8000},{n:'護具',c:14.52,cm:0.519,h:1.4,d:14500}];
      const plan=(order,cap)=>{ let left=cap; const u={}; order.forEach(p=>{ const q=Math.min(p.d,Math.floor(left/p.h)); u[p.n]=q; left-=q*p.h; }); const c=P.reduce((s,p)=>s+u[p.n]*p.c,0); return {u,c,left}; };
      ctx.ui.sliders(top,[{k:'cap',label:'明年可用的縫製工時',min:25000,max:42000,step:500,v:36000,f:x=>x.toLocaleString('en-US')+' 小時'}],(v)=>{
        const a=plan([...P].sort((x,y)=>y.cm-x.cm),v.cap), b=plan([...P].sort((x,y)=>y.c/y.h-x.c/x.h),v.cap);
        const need=P.reduce((s,p)=>s+p.d*p.h,0);
        out.innerHTML=ctx.ui.table(['生產數量','依邊際貢獻率排序','依每縫製工時邊際貢獻排序'],P.map(p=>[p.n,a.u[p.n].toLocaleString('en-US'),b.u[p.n].toLocaleString('en-US')]).concat([{cls:'',cells:['<strong>邊際貢獻合計</strong>',`<strong>${money(Math.round(a.c))}</strong>`,`<strong>${money(Math.round(b.c))}</strong>`]}]),{num:[1,2]})+
        `<div class="msg ${b.c-a.c>1000?'good':'info'}" style="margin-top:12px">${v.cap>=need?`有${v.cap.toLocaleString('en-US')}小時時，縫製時間足以滿足所有需求（${Math.round(need).toLocaleString('en-US')}小時），所以排序不重要，全部都做。把滑桿往下拉看看。`:`縫製受限時，依每縫製工時邊際貢獻排序，比依邊際貢獻率排序<strong>多賺${money(Math.round(b.c-a.c))}</strong>。床墊的邊際貢獻率看起來最弱，但在稀缺資源的每小時裡賺得最多。`}</div>`;
      },ctx.uid);
    }),
    TIP('直接改善瓶頸本身',
      `<p>瓶頸損失一小時，就是整座工廠損失一小時。在其他地方省下一小時，幾乎什麼也沒省到。所以要把最好的人力、預防保養和品質檢查放在縫製線<em>之前</em>，讓它永遠不必等待，也永遠不會縫到不良品。投資增加縫製產能，往往是工廠能做的最佳投資（第14單元）。</p>`)
  ]},
  {id:'case', label:'個案：停產護具？', kind:'case', title:'BraceWorks該停產護具嗎？', blocks:[
    CASE('老闆的提議',
      `<p>老闆看過了產品成本計算（第6單元）。以完全成本計算，護具的毛利率只有16.6%，床墊是30%，吊帶是40%。他說：「我們別再做護具了，專心做賺錢的產品。這樣可以空出一半的廠房。」</p>
       <p>做決定之前，你先建模分析。選擇要停產哪些產品線，以及你實際上能減少多少它們的固定成本。</p>`),
    W('停產某條產品線？', function(el, ctx){
      const {money,signed}=ctx.h;
      const P={m:{n:'床墊',c:207760,lab:42000,oh:66640,fullGP:152880},s:{n:'吊帶',c:174960,lab:32400,oh:20736,fullGP:128736},b:{n:'護具',c:188760,lab:74100,oh:66300,fullGP:60450}};
      const drop={m:false,s:false,b:true};
      const seg=document.createElement('div'); seg.className='seg'; const top=document.createElement('div'), out=document.createElement('div'); el.append(seg,top,out);
      Object.keys(P).forEach(k=>{ const b=document.createElement('button'); b.type='button'; b.textContent='停產'+P[k].n.toLowerCase(); b.setAttribute('aria-pressed',String(drop[k])); b.onclick=()=>{ drop[k]=!drop[k]; b.setAttribute('aria-pressed',String(drop[k])); draw(); }; seg.appendChild(b); });
      let vals={};
      function draw(){
        let lost=0, saveL=0, saveO=0, fullLost=0;
        Object.keys(P).forEach(k=>{ if(drop[k]){ lost+=P[k].c; saveL+=P[k].lab*vals.l/100; saveO+=P[k].oh*vals.o/100; fullLost+=P[k].fullGP; } });
        const sev=saveL*0.4; const ongoing=-lost+saveL+saveO, y1=ongoing-sev; const pbt=74000+ongoing;
        out.innerHTML=ctx.ui.table(['停產的影響','每年'],[
          ['損失的邊際貢獻',money(-lost)],
          ['減少的生產人工',money(Math.round(saveL))],
          ['實際減少的間接費用',money(Math.round(saveO))],
          {cls:'',cells:['<strong>每年利潤的變化</strong>',`<strong class="${ongoing<0?'neg':'pos'}">${signed(Math.round(ongoing))}</strong>`]},
          ['第一年一次性資遣費（約5個月薪資）',money(-Math.round(sev))]
        ],{num:[1]})+
        `<div class="stats" style="margin-top:12px">${ctx.ui.stat('調整後的稅前淨利',money(Math.round(pbt)),pbt<0?'bad':pbt<74000?'warn':'good','目前$74,000')}${ctx.ui.stat('完全成本觀點的預期',`只損失${money(fullLost)}的營業毛利`,'warn')}</div>
        <p class="w-hint" style="margin-top:10px">${!lost?'選擇要停產的產品線。':ongoing<0?'完全成本觀點只計算該產品的營業毛利。實際上你會失去它全部的邊際貢獻，而大部分間接費用仍然存在，只是改由較少的產品分攤。剩下的產品也會突然看起來比較不賺錢。':'只有在你能砍掉它幾乎所有的人工和間接費用時，停產這條產品線才有幫助。'}</p>`;
      }
      ctx.ui.sliders(top,[
        {k:'l',label:'該產品線可減少的生產人工比例',min:0,max:100,step:5,v:60,f:x=>x+'%'},
        {k:'o',label:'分攤給它的間接費用中真正消失的比例',min:0,max:100,step:5,v:25,f:x=>x+'%'}
      ],(v)=>{vals=v;draw();},ctx.uid);
    }),
    Q('你該怎麼回覆老闆？',[
      {text:'同意。護具的利潤率最低。', why:'完全成本下的低利潤率主要來自分攤的間接費用，而護具停產後這些費用仍然存在。'},
      {text:'保留護具。它們每年貢獻$188,760來支應固定成本。應該改善它們的價格、生產批量，以及40個SKU的成本。'},
      {text:'停產護具，並調漲床墊價格來彌補', why:'光是要回到現在的水準，就需要大幅漲價。'},
      {text:'改為停產吊帶', why:'吊帶的邊際貢獻率最高。停產吊帶會更糟。'}
    ],1,'護具支應了很大一部分的租金、管理人員和機器成本。少了它們，BraceWorks會虧損。更好的問題是如何改善它們：減少SKU、加大批量、進行價格檢討，並設定最低訂購量。'),
    K('什麼時候停產產品是對的',
      `<p>當它的邊際貢獻為負或極小、當它占用的產能在別處能賺更多（瓶頸），或當你真的能移除它所造成的固定成本時。即使如此，也要確認客戶是不是把它當作整個產品系列的一部分來購買：買護具的經銷商可能也會買你的床墊。</p>`)
  ]},
  {id:'quiz', label:'測驗', kind:'quiz', title:'檢驗你的理解', blocks:[
    Q('你五年前花$40,000買了一台機器。在決定是否繼續使用時，這$40,000有多攸關？',['非常攸關','無關：這是沉沒成本','只與稅務有關','機器老舊時才攸關'],1,'只有未來的成本與效益才重要：運轉成本、維修成本、轉售價值。'),
    Q('一張特殊訂單每條吊帶付$32。材料與處理費為$18.30，且有閒置產能。每條吊帶增加的利潤是多少？',['$4.88','$13.70','$32.00','$(5.12)'],1,'$32.00 − $18.30。人工和間接費用本來就已經支付。'),
    Q('下列何者「不是」接受低價特殊訂單的好理由？',['有閒置產能','價格高於變動成本','其他客戶可能聽說並要求相同價格','不同市場，彼此沒有重疊'],2,'價格外溢到現有客戶，代價可能遠超過這張訂單的獲利。'),
    Q('某產品以完全成本計算呈現虧損。停產它通常會……',['一定增加利潤','失去它的邊際貢獻，而大部分分攤的間接費用仍然存在','沒有影響','增加間接費用'],1,'檢查邊際貢獻，以及哪些固定成本真的會消失。'),
    Q('縫製是瓶頸。你應該如何為產品排序？',['依邊際貢獻率','依每縫製工時邊際貢獻','依售價','依完全成本利潤率'],1,'稀缺資源是縫製時間，所以要讓每小時縫製時間的邊際貢獻最大化。'),
    Q('外購某零件看起來比自製便宜，但負責製作的員工會繼續留任，卻沒有其他工作可做。結果會如何？',['外購能省錢','外購可能花更多，因為人工成本不會消失','沒有差別','間接費用會下降'],1,'如果人工無法避免或調派他用，它就不攸關，而你還得另外付錢給供應商。')
  ]},
  {id:'apply', label:'練習', kind:'apply', title:'用練習包練習', blocks:[
    PACK('packC',3,'練習包C，第3頁：管理評述'),
    Q('NGO出價每條吊帶$32。材料與處理費為$18.30。如果人工有閒置，每條吊帶的邊際貢獻是多少？',['$4.88','$13.70','$32.00','$6.95'],1,'$32.00 − $18.30 = $13.70。'),
    Q('但產線每月已有960小時加班。如果每條吊帶需要1.5小時、每小時$4.50的加班，還剩多少？',['$13.70','$6.95','$0','$4.50'],1,'$13.70 − (1.5 × $4.50) = $6.95。一半的獲利消失了，而且現金需求出現在最糟的時間點。'),
    PACK('packB',5,'練習包B，第5頁：產品利潤率'),
    Q('練習包B顯示護具的毛利率為14.9%。BraceWorks該停產護具嗎？',['該，利潤率最低','不該：每個護具約有$14.50的邊際貢獻，有助於支應固定成本。應該改善價格、批量和品項變化。','只有床墊成長時才該','該，並調漲吊帶價格'],1,'完全成本利潤率不是判斷是否停產的標準（第13單元）。'),
    {t:'html',html:'<h3>之後，用你自己的報告</h3><p class="small" style="color:var(--muted)">選讀。下次閱讀你自己公司的月報時，使用這份檢核清單。這裡的內容不會被分享或傳送；勾選結果只儲存在這個瀏覽器中。</p>'},
    CHECK('m13-dec','我們做這類決策時……',[
      '我們看邊際貢獻與現金的變化，而不只是完全單位成本',
      '我們列出哪些固定成本真的會改變，哪些不會',
      '我們知道瓶頸在哪裡，也知道各產品的每瓶頸工時邊際貢獻',
      '低於正常價格的特殊訂單須經總經理核准，並附邊際貢獻檢查',
      '自製或外購決策會納入供應商資格認證、前置時間與品質風險',
      '停產某項產品或放棄某個客戶之前，我們會確認對方還向我們買了什麼'
    ]),
    REPORT('你的週一早晨提問',
      `<p>問：<strong>「我們的瓶頸製程是哪一個？每項產品在這個製程每小時的邊際貢獻是多少？」</strong>如果團隊答不出來，就一起找出答案。這是產能決策最重要的數字。</p>`),
    K('重點整理',
      `<ul>
        <li>只有在不同方案之間有差異的成本才是攸關的。忽略沉沒成本和不變的固定成本。</li>
        <li>有閒置產能時，任何高於變動成本的價格都能增加利潤，前提是不會外溢到其他客戶。</li>
        <li>自製或外購取決於哪些成本真的會消失，以及空出的產能能賺多少。</li>
        <li>遇到瓶頸時，依每瓶頸工時邊際貢獻為產品排序。</li>
        <li>停產低利潤率產品往往讓情況更糟。先檢查它的邊際貢獻。</li>
       </ul>`)
  ]}
  ],
  warnings:[
    {sign:'只根據完全單位成本做決策', meaning:'分攤的間接費用讓好產品看起來很差，導致錯誤的停產與拒單。', look:'與該決策相關的邊際貢獻與可避免成本。'},
    {sign:'頻繁出現低價的「特殊」訂單', meaning:'固定成本沒有被回收；有價格外溢風險。', look:'低於目標價格的銷售占比；邊際貢獻趨勢。'},
    {sign:'某個製程加班，其他製程卻在等待', meaning:'有一個瓶頸限制了整座工廠。', look:'各製程的產能利用率；每瓶頸工時邊際貢獻。'}
  ],
  formulas:[
    {name:'訂單的增量利潤', f:'增加的營業收入 − 增加的變動成本 − 增加的固定成本（例如加班）', ex:'2,000 × ($32.00 − $18.30) − $4,500加班費 = $22,900'},
    {name:'每瓶頸工時邊際貢獻', f:'單位邊際貢獻 ÷ 每單位瓶頸工時', ex:'床墊：$74.20 ÷ 2.6小時 = $28.54'},
    {name:'自製或外購的節省', f:'自製的攸關成本 − 外購價格（+/− 機會成本）', ex:'$17.14 − $27.00 = 每個($9.86)，尚未計入機會成本'}
  ],
  glossary:[
    {term:'攸關成本（Relevant cost）', def:'在所比較的方案之間有差異的未來成本。'},
    {term:'沉沒成本（Sunk cost）', def:'已經花掉、任何決策都無法收回的錢。與未來的決策無關。'},
    {term:'可避免成本（Avoidable cost）', def:'某項活動停止時就會消失的成本。'},
    {term:'機會成本（Opportunity cost）', def:'所放棄的最佳替代方案的效益。'},
    {term:'特殊訂單（Special order）', def:'一次性的訂單，通常價格較低，依其增量利潤來判斷。'},
    {term:'自製或外購（Make or buy）', def:'決定零件要自行生產，還是向供應商採購。'},
    {term:'瓶頸（Bottleneck）', def:'相對於需求產能最小的製程。它限制了整座工廠的產出。'},
    {term:'價格外溢（Price leakage）', def:'給某一客戶的折扣擴散到其他客戶。'}
  ]
});
})();
