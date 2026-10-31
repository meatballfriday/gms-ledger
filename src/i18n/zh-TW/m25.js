/* ===== Module 25: Running group finance across countries (optional: growing into a multinational) ===== */
(function(){
const {K,TIP,FLAG,CASE,REPORT,Q,FS,FLIP,SORT,CHECK,W,money,signed,pct,kfmt} = BW.h;
const m$=v=>money(Math.round(v));
const E=(tag,cls,html)=>{ const e=document.createElement(tag); if(cls) e.className=cls; if(html!=null) e.innerHTML=html; return e; };

BW.add({
  id:'m25', minutes:60,
  title:'跨國集團財務管理',
  subtitle:'當BraceWorks在五個國家都有公司時，財務就不再只是一套帳。財務團隊、系統、月結和集團報告要如何隨著業務成長，以及總經理應該堅持什麼。',
  goals:[
    '知道成長中的集團需要哪些財務職位和系統，以及大約在什麼時候需要',
    '規劃會計系統（ERP）的更換，又不毀掉一個旺季',
    '在多家公司之間執行同一次月結，並且仍在大約十個工作天內完成報告',
    '調節集團內部往來餘額，並說明它們為什麼對不上',
    '了解各地帳簿如何變成集團帳目，以及每個國家仍需要自行處理哪些事',
    '解讀按國家及以固定匯率基礎表達的集團報告，並知道全球最低稅負制何時適用'
  ],
  sections:[
  /* ---------------------------------------------------------------- 1 */
  {id:'stages', label:'財務如何成長', kind:'play', title:'財務團隊如何隨你成長', blocks:[
    `<p>想像幾年後的BraceWorks：<strong>大約650人</strong>，在菲律賓有一座工廠、在越南有第二座，並在德國、美國和澳洲設有銷售公司。五家公司、五種貨幣、五個稅務機關、五組會計師。</p>
     <p>過去服務一家50人出口商的兩人財務團隊應付不了這種規模。但太早聘雇完整的企業財務部門，又會浪費錢。關鍵在於<strong>比複雜度早一步</strong>聘人。移動滑桿，看看各種規模的公司通常需要什麼。</p>`,
    W('財務團隊建構器', function(el,ctx){
      const R=[
        {k:'book',t:'記帳人員',d:'記錄交易、支付帳單、處理薪資輸入資料。',on:(p,e)=>true},
        {k:'acct',t:'會計人員',d:'執行月結、調節帳目、準備稅務申報。',on:(p,e)=>p>=30},
        {k:'ctrl',t:'財務主管',d:'負責結帳、控制和月度管理報告。',on:(p,e)=>p>=80},
        {k:'fd',t:'財務負責人',d:'預算、銀行關係，以及決策背後的數字。',on:(p,e)=>p>=150},
        {k:'fpa',t:'財務規劃與分析',d:'預測、預算、產品與客戶獲利能力。',on:(p,e)=>p>=150},
        {k:'grp',t:'集團會計',d:'合併財務報表、集團內部往來、集團政策。',on:(p,e)=>e>=2},
        {k:'ctry',t:'各國財務負責人',d:'當地帳務、當地稅務與查核；向集團報告。',on:(p,e)=>e>=3},
        {k:'tax',t:'稅務經理',d:'移轉訂價、扣繳、法遵行事曆。',on:(p,e)=>e>=3},
        {k:'cfo',t:'財務長',d:'策略、籌資、投資人、董事會。',on:(p,e)=>p>=300||e>=4},
        {k:'trs',t:'資金經理',d:'跨國現金、外匯避險、銀行。',on:(p,e)=>e>=4||p>=500},
        {k:'ia',t:'內部稽核',d:'獨立查核；向審計委員會報告。',on:(p,e)=>p>=500}];
      const SYS=(p,e)=>e>=4?'集團ERP採用同一套會計科目表，再加上合併報表工具':p>=150||e>=2?'具備多幣別、集團內部交易、標準成本及批號追溯功能的ERP':'小型企業會計軟體加上試算表';
      const top=E('div'), grid=E('div','ft-grid'), out=E('div'); el.append(top,grid,out);
      let ready=false, v={p:50,e:1};
      ctx.ui.sliders(top,[{k:'p',label:'人數',min:20,max:1000,step:10,v:50,f:x=>x+' 人'},{k:'e',label:'集團內公司數',min:1,max:6,step:1,v:1,f:x=>x+(x===1?' 家公司':' 家公司')}],x=>{ v=x; if(ready) draw(); },ctx.uid);
      grid.innerHTML=R.map(r=>`<div class="ft-card" data-k="${r.k}"><b>${r.t}</b><span>${r.d}</span></div>`).join('');
      function draw(){ let n=0; R.forEach(r=>{ const on=r.on(v.p,v.e); grid.querySelector(`[data-k="${r.k}"]`).classList.toggle('on',on); if(on) n++; });
        out.innerHTML=`<div class="stats" style="margin-top:12px">${ctx.ui.stat('所需財務職位',n+' / '+R.length)}${ctx.ui.stat('系統',SYS(v.p,v.e))}</div><p class="w-hint" style="margin-top:8px">${v.e>=3&&v.p<300?'跨好幾個國家但規模仍屬中型：無法以專職人力支應的就向外採購，例如各國的當地會計師、移轉訂價稅務顧問，或兼職財務長。':v.p>=500?'到了這個規模，財務是一個橫跨多國、15到40人的部門，財務長也是經營團隊的一員。':'這是經驗法則，不是定律：產品線複雜或法規嚴格，每一步都會提早到來。'}</p>`; }
      ready=true; draw();
    }),
    K('總經理在建立財務團隊上的職責',
      `<ul>
        <li><strong>提前一步聘人。</strong>集團會計應該在第二家公司成立之前到任，而不是在第一次混亂的合併之後。</li>
        <li><strong>向外採購專家</strong>，凡是無法以專職人力支應的：當地會計師和薪資服務商、移轉訂價顧問、兼職財務長。</li>
        <li><strong>規則只寫一次。</strong>一本每個國家都遵循的集團會計手冊（政策、會計科目表、結帳時程表、核決金額上限）。</li>
       </ul>`)
  ]},
  /* ---------------------------------------------------------------- 2 */
  {id:'systems', label:'系統', kind:'learn', title:'從會計軟體到ERP', blocks:[
    `<p>大多數小型製造商一開始用的是小型企業會計軟體和試算表。大約在150到300人之間，或第二家公司成立時，這套做法就撐不住了：存貨、成本、採購和銷售分散在不同地方，月結變成一場試算表馬拉松。答案通常是<span class="term">ERP</span>：一套涵蓋訂單、採購、生產、存貨和帳務的系統。</p>`,
    {t:'tbl', head:['醫療器材製造商的ERP必須能處理…','原因'], rows:[
      ['批號與序號追溯','回收與主管機關：你必須能把每一批追溯到客戶（第21單元）'],
      ['標準成本與差異','按產品計算的產品成本、存貨價值和利潤率（第6–8單元）'],
      ['多家公司與多種貨幣','每個國家的帳以各自的貨幣記錄，再以美元彙總'],
      ['集團內部交易','集團公司之間的銷售，雙方自動入帳'],
      ['一套會計科目表、一份料號清單','讓每個國家用同樣的方式報告，每項產品只有一個代碼'],
      ['核准流程','採購與付款上限由系統強制執行，而不是靠記憶（第27單元）']
    ]},
    K('ERP專案怎麼出錯',
      `<ul>
        <li><strong>在旺季系統上線</strong>，或所有東西同時上線。</li>
        <li><strong>髒資料：</strong>重複的客戶、錯誤的物料清單和舊價格被複製進新系統。</li>
        <li><strong>沒有彩排：</strong>系統上線前，沒有完整測試一整個月的訂單、出貨和發票。</li>
        <li><strong>沒有「停或走」的決策點</strong>，測試失敗時也沒有備案。</li>
       </ul>`),
    SORT('系統上線之前：必要，還是可有可無？',['必要','可以等'],[
      {text:'清理客戶、供應商和產品的主檔資料', a:0, why:'垃圾資料進去，就是錯誤的訂單、發票和成本出來。'},
      {text:'完整試跑一個月的訂單，一路到發票和存貨', a:0, why:'這是在客戶發現之前找出缺口的唯一方法。'},
      {text:'選在最忙的幾週以外的日期上線', a:0, why:'如果要出錯，也應該在你能夠恢復的時候出錯。'},
      {text:'頭兩個月額外準備存貨和現金緩衝', a:0, why:'幾乎每次系統上線後，出貨都會變慢。'},
      {text:'華麗的管理儀表板', a:1, why:'以後有用。系統首先必須能接單、出貨和開發票。'},
      {text:'從舊系統照搬的客製功能', a:1, why:'每一項都增加成本和風險。能改流程去配合標準功能的，就改流程。'}
    ]),
    Q('一家ERP廠商提議在10月1日上線，就在BraceWorks最忙的一季之前，「這樣新的一年就能乾淨開始」。你應該要求什麼？',[
      '接受：乾淨的年度結帳值得','選在淡季的日期、完整的彩排、一個停或走的檢查點，以及備援計畫','分階段上線但跳過測試','延後到每一項客製功能都做好'],1,
      '旺季上線失敗，會同時傷害客戶、營收和現金。淡季、彩排、檢查點、備援。')
  ]},
  /* ---------------------------------------------------------------- 3 */
  {id:'close', label:'集團結帳', kind:'play', title:'一次結帳，五套帳', blocks:[
    `<p>集團月結是一場接力賽：每個國家先結自己的帳，集團內部往來餘額取得一致，各公司的數字對應到集團格式、換算成美元，再編製合併報表。集團報告要等跑最慢的那一棒抵達才能發出。試試看通常最有效的幾項改變。</p>`,
    W('集團結帳時程', function(el,ctx){
      const ENT=[['菲律賓',5],['越南',8],['德國',4],['美國',4],['澳洲',4]];
      const O=[{k:'cal',t:'共用的結帳時程表，期限固定',save:'最慢的國家在第6天結帳，而不是第8天'},{k:'coa',t:'每個國家使用同一套會計科目表',save:'不需要對應步驟：省下2天'},{k:'ic',t:'月底前就取得一致的集團內部往來餘額',save:'不必追差異：省下3天'},{k:'tool',t:'用合併報表工具取代試算表',save:'省下1天，公式錯誤也更少'}];
      const S=ctx.state; S.m25c=S.m25c||{}; const st=S.m25c;
      el.innerHTML=`<div class="gc-opts">${O.map(o=>`<label class="gc-o"><input type="checkbox" data-k="${o.k}"><span><b>${o.t}</b><small>${o.save}</small></span></label>`).join('')}</div><div class="gc"></div><div class="gc-out"></div>`;
      const gc=el.querySelector('.gc'), out=el.querySelector('.gc-out');
      el.querySelectorAll('input[data-k]').forEach(i=>{ i.checked=!!st[i.dataset.k]; i.onchange=()=>{ st[i.dataset.k]=i.checked; ctx.save(); draw(); }; });
      const MAXD=22;
      gc.innerHTML=`<div class="gc-axis">${[...Array(MAXD)].map((_,d)=>`<span>${d+1}</span>`).join('')}</div>`+ENT.map(e=>`<div class="gc-row"><span class="gc-l">${e[0]}</span><span class="gc-t"><i class="gc-b loc"></i></span></div>`).join('')+
        `<div class="gc-row"><span class="gc-l">對應到集團格式</span><span class="gc-t"><i class="gc-b map"></i></span></div><div class="gc-row"><span class="gc-l">集團內部往來對帳</span><span class="gc-t"><i class="gc-b ic"></i></span></div><div class="gc-row"><span class="gc-l">合併與覆核</span><span class="gc-t"><i class="gc-b con"></i></span></div><div class="gc-row tot"><span class="gc-l">發出集團報告</span><span class="gc-t"><i class="gc-b fin"></i></span></div>`;
      function draw(){
        const loc=ENT.map(e=>st.cal?Math.min(e[1],6):e[1]), lmax=Math.max(...loc);
        const map=st.coa?0:2, ic=st.ic?0:3, con=st.tool?2:3, done=lmax+map+ic+con;
        const P=d=>(d/MAXD*100).toFixed(2)+'%';
        const bars=gc.querySelectorAll('.gc-b');
        loc.forEach((d,i)=>{ bars[i].style.left='0%'; bars[i].style.width=P(d); bars[i].dataset.tip=`${ENT[i][0]}|第${d}天結帳`; });
        const set=(b,s,len,t)=>{ b.style.left=P(s); b.style.width=len?P(len):'0%'; b.style.opacity=len?1:.15; b.dataset.tip=t; };
        set(bars[5],lmax,map,map?`對應|${map} 天`:'對應|不需要');
        set(bars[6],lmax+map,ic,ic?`集團內部往來|${ic} 天`:'集團內部往來|已事先取得一致');
        set(bars[7],lmax+map+ic,con,`合併|${con} 天`);
        set(bars[8],done-0.6,0.6,`集團報告|第${done}天`);
        out.innerHTML=`<div class="stats" style="margin-top:12px">${ctx.ui.stat('集團報告發出日',`第${done}個工作天`,done<=10?'good':done<=14?'warn':'bad')}${ctx.ui.stat('最慢的國家',ENT[loc.indexOf(lmax)][0]+'，第'+lmax+'天')}</div><p class="w-hint" style="margin-top:8px">${done<=10?'對這種規模的集團來說，大約第10天發出集團報告是很好的標準。決策根據的是上個月的數字，而不是上上個月。':done<=14?'進步了。剩下的通常來自在月底前就把集團內部往來對好，以及讓每個國家依同一份時程表結帳。':'到了第16個工作天，下個月大半都過去了，才有人看到上個月的數字。這裡的每一項改善都是流程決策，而不是聘人決策。'}</p>`;
      }
      draw();
    }),
    TIP('買軟體之前先改善結帳流程',
      `<p>大部分延誤來自流程，而不是系統：沒有固定的時程表、各地會計科目表不同、月底後才在爭論集團內部往來餘額。合併報表工具有幫助，但前提是這些問題都先解決了。</p>`)
  ]},
  /* ---------------------------------------------------------------- 4 */
  {id:'ic', label:'集團內部往來', kind:'play', title:'集團內部往來：集團和自己做生意', blocks:[
    `<p>BraceWorks菲律賓製造護具；位於德國的BraceWorks歐洲購入後賣給醫院。每一批出貨都在馬尼拉產生一筆應收帳款，在德國產生一筆應付帳款。在集團帳目中，兩者必須剛好互相抵銷。如果對不上，合併作業就會卡住，直到有人說明差異為止。</p>`,
    W('說明集團內部往來的差額', function(el,ctx){
      const PH=1050000, DE=1028500;
      const IT=[
        {t:'一張日期為6月30日、金額$16,500的發票：馬尼拉已入帳；德國要等7月貨到時才會入帳',v:16500,ok:true,why:'在途存貨：時間性差異。訂一條規則：買方以賣方的出貨日入帳。'},
        {t:'德國以月底匯率換算其歐元應付帳款；馬尼拉則用各發票日的匯率',v:5000,ok:true,why:'匯率：集團內部往來雙方應使用同一個由集團訂定的匯率。'},
        {t:'一張馬尼拉尚未開立、針對受損護具的$12,000折讓單',v:12000,ok:false,why:'有可能，但這裡的證據並不支持。先查證再假設。'},
        {t:'馬尼拉在6月29日收到德國匯來的$20,000，而德國尚未入帳',v:20000,ok:false,why:'這會讓德國的應付帳款<em>高於</em>馬尼拉的應收帳款，與我們看到的情況相反。不符合。'}];
      const S=ctx.state; S.m25ic=S.m25ic||{}; const st=S.m25ic;
      el.innerHTML=`<div class="stats"><div class="stat"><div class="stat-l">馬尼拉：應收德國款項</div><div class="stat-v">${m$(PH)}</div></div><div class="stat"><div class="stat-l">德國：應付馬尼拉款項（以$計）</div><div class="stat-v">${m$(DE)}</div></div><div class="stat ic-gap"><div class="stat-l">未說明的差額</div><div class="stat-v"></div></div></div>
        <p class="w-hint" style="margin:10px 0 6px">勾選能解釋差額的項目。其中只有兩項有證據支持。</p><div class="ic-list">${IT.map((x,i)=>`<label class="gc-o"><input type="checkbox" data-i="${i}"><span><b>${x.t}</b><small class="ic-why" hidden></small></span></label>`).join('')}</div><div class="ic-out"></div>`;
      const gapEl=el.querySelector('.ic-gap .stat-v'), gapBox=el.querySelector('.ic-gap'), out=el.querySelector('.ic-out');
      el.querySelectorAll('input[data-i]').forEach(inp=>{ const i=+inp.dataset.i; inp.checked=!!st[i]; inp.onchange=()=>{ st[i]=inp.checked; ctx.save(); draw(); }; });
      function draw(){ let gap=PH-DE; IT.forEach((x,i)=>{ const w=el.querySelector(`input[data-i="${i}"]`).closest('label').querySelector('.ic-why'); if(st[i]){ gap-=x.v; w.hidden=false; w.innerHTML=(x.ok?'✓ ':'✗ ')+x.why; w.style.color=x.ok?'var(--good)':'var(--red)'; } else w.hidden=true; });
        gapEl.textContent=m$(gap); gapBox.classList.toggle('good',gap===0); gapBox.classList.toggle('bad',gap<0);
        out.innerHTML=gap===0&&IT.every((x,i)=>!!st[i]===x.ok)?`<div class="msg good" style="margin-top:10px">調節完成：$21,500 = 在途$16,500 + 匯率差$5,000。兩者都是規則問題，不是錯誤。一套集團內部往來政策（相同的截止點、相同的匯率、結帳前每月對帳）就能讓它們消失。</div>`:gap<0?`<div class="msg bad" style="margin-top:10px">你解釋的金額超過了差額。其中有一項不該選。</div>`:'';
      }
      draw();
    }),
    K('五行寫完的集團內部往來政策',
      `<ol>
        <li>每一筆集團內部銷售都要有發票，以約定的貨幣開立，並依據書面協議（第24單元）。</li>
        <li>買方在賣方出貨時就將貨物入帳，而不是等貨到。</li>
        <li>雙方以同一個匯率換算，由集團每月訂定。</li>
        <li>各公司之間在月底前確認餘額，差異由賣方修正。</li>
        <li>集團內部債務定期結清，最好透過淨額結算（第26單元），避免餘額累積多年。</li>
       </ol>`)
  ]},
  /* ---------------------------------------------------------------- 5 */
  {id:'gaap', label:'從當地到集團', kind:'learn', title:'從當地帳簿到集團帳目', blocks:[
    `<p>每家公司都以自己的貨幣、依所在國家的規則記帳，並自行申報法定財務報表和所得稅。集團帳目則建立在這些帳之上。按下<strong>播放</strong>，跟著BraceWorks越南的數字一路走進集團。</p>`,
    {t:'fig', title:'從越南的帳到集團帳目', intro:'按下<strong>播放</strong>，一步一步看。',
      steps:[
        {k:['n0'],t:'<strong>當地帳簿。</strong>BraceWorks越南以越南盾、依越南會計規則記錄一切。這些帳是當地所得稅申報和法定查核的基礎，而且永遠都需要。'},
        {k:['n0','e0','n1'],t:'<strong>調整為集團政策。</strong>凡是當地規則與集團規範處理方式不同的，都要調整：例如依IFRS 16把租賃列入資產負債表，或不同的折舊年限（第21單元）。'},
        {k:['n1','e1','n2'],t:'<strong>換算為美元。</strong>資產負債表用期末匯率，損益表用平均匯率。差額列入權益中的國外營運機構財務報表換算之兌換差額，而不是列入損益（第4單元）。'},
        {k:['n2','e2','n3'],t:'<strong>沖銷集團與自己的交易。</strong>集團內部的銷售、餘額、股利，以及仍留在另一家集團公司存貨中的任何未實現利益（第24單元）。'},
        {k:['n3','e3','n4'],t:'<strong>加總並報告。</strong>集團的損益表、資產負債表和現金流量表，再加上按國家或產品的營運部門資訊。'}],
      draw:BW.viz.flow({label:'當地帳簿、調整政策、換算、沖銷、集團帳目。',labels:['調整','換算','沖銷','加總'],edgeK:['e0','e1','e2','e3'],
        nodes:[{t:'當地帳簿',s:'當地貨幣與規則',k:'n0'},{t:'集團政策',s:'處處同一套規範',k:'n1'},{t:'換算',s:'換成美元',k:'n2'},{t:'沖銷',s:'集團內部交易',k:'n3'},{t:'集團帳目',s:'整個集團一套帳',k:'n4'}]})},
    {t:'tbl', head:['每家公司仍需要…','通常期限'], rows:[
      ['依當地規則編製的法定財務報表，必要時經查核','會計年度結束後數個月內'],
      ['公司所得稅申報，以及年度中的暫繳稅款','依當地法律規定'],
      ['加值稅（VAT）或商品及服務稅（GST）申報','每月或每季'],
      ['薪資稅與社會保險費','每月'],
      ['集團內部交易價格的移轉訂價文據','每年，通常與所得稅申報一併辦理'],
      ['公司秘書事務申報：董事、股東、年度申報','每年']
    ]},
    TIP('整個集團一份法遵行事曆',
      `<p>五個國家可能代表一年有一百個以上的申報期限。把它們全部放進一份共用的行事曆，每一項都指定負責人，並且每月檢視。逾期申報會被處罰，在某些國家還會讓當地董事負個人責任。</p>`),
    Q('為什麼集團不能只用合併財務報表，把當地帳簿取消？',[
      '可以，只要集團經過查核','每家公司都是獨立的法人，必須依當地法律申報自己的財務報表和所得稅','只有在所有公司都採用IFRS時才可以','當地帳簿只有銀行需要'],1,
      '集團帳目是多出來的一層。每家公司在所在國家仍然在法律上獨立存在，有自己的申報、稅務和會計師。')
  ]},
  /* ---------------------------------------------------------------- 6 */
  {id:'report', label:'集團報告', kind:'learn', title:'總經理用得上的集團報告', blocks:[
    `<p>集團報告應該回答和BraceWorks過去月度管理報告（第9單元）相同的問題，再加上三個新問題。</p>`,
    {t:'tbl', head:['新問題','報告應該呈現什麼'], rows:[
      ['<strong>哪個國家或產品線在賺錢？</strong>','按營運部門列示營業收入、毛利率和營業利益，集團內部利益要呈現在真正賺到的地方'],
      ['<strong>是我們進步了，還是匯率變了？</strong>','以去年或預算匯率計算的結果（「固定匯率基礎」），並列在實際匯率結果旁邊'],
      ['<strong>現金在哪裡？我們能動用嗎？</strong>','按國家列示現金與借款，並標示不易匯出該國的現金（第26單元）']
    ]},
    W('是成長，還是只是匯率？', function(el,ctx){
      const top=E('div'), out=E('div'); el.append(top,out);
      const LY=10.0, LYR=1.08; let ready=false, v={g:5,r:1.08};
      ctx.ui.sliders(top,[{k:'g',label:'以歐元計的歐洲銷貨成長',min:-10,max:20,step:1,v:5,f:x=>(x>0?'+':'')+x+'%'},{k:'r',label:'今年平均歐元匯率',min:0.95,max:1.25,step:0.01,v:1.08,f:x=>'€1 = $'+x.toFixed(2)}],x=>{ v=x; if(ready) draw(); },ctx.uid);
      function draw(){ const eur=LY*(1+v.g/100), act=eur*v.r, cc=eur*LYR, ly=LY*LYR;
        out.innerHTML=`<table class="jtbl"><thead><tr><th>BraceWorks歐洲銷貨</th><th class="v">$ 百萬</th><th class="v">成長</th></tr></thead><tbody>
          <tr><td>去年（€1,000萬，匯率1.08）</td><td class="v">${ly.toFixed(2)}</td><td class="v"></td></tr>
          <tr><td>今年，以實際匯率計</td><td class="v">${act.toFixed(2)}</td><td class="v">${pct(act/ly-1,1)}</td></tr>
          <tr class="hi"><td><strong>今年，以去年匯率計（固定匯率基礎）</strong></td><td class="v"><strong>${cc.toFixed(2)}</strong></td><td class="v"><strong>${pct(cc/ly-1,1)}</strong></td></tr></tbody></table>
          <p class="w-hint" style="margin-top:8px">${Math.abs(act-cc)<0.05?'匯率幾乎沒變，所以帳面成長和實質成長一致。':act>cc?`帳面成長美化了業績：其中${pct((act-cc)/ly,1)}來自歐元升值，而不是有更多醫院來買。`:`帳面成長掩蓋了真正的進步：以歐元計業務成長了${pct(cc/ly-1,1)}，但歐元走弱讓美元數字少了${pct((cc-act)/ly,1)}。`}</p>`; }
      ready=true; draw();
    }),
    K('全球最低稅負制，以及它何時有影響',
      `<p>許多國家，包括大部分歐盟國家、英國、日本、南韓、澳洲和越南，已經採用<span class="term">全球最低稅負制</span>（常稱為第二支柱，Pillar Two）的規則：在前四年中有兩年合併營業收入至少<strong>€7.5億</strong>的集團，在每個國家經調整後的利益都必須負擔至少15%的有效稅率。如果沒有達到，就要課徵補充稅，通常由該國自行課徵，否則由母公司所在國或其他集團成員所在國課徵。菲律賓和美國尚未採用這些規則。BraceWorks遠低於門檻，但若被大型集團收購，或快速成長，就會被納入。屆時，當地優渥的租稅假期可能直接被補稅到15%，因此租稅優惠需要重新檢視。</p>`),
    Q('集團銷貨以美元計成長12%，以固定匯率基礎計成長4%。發生了什麼事？',[
      '業務成長了12%','約8個百分點的成長來自各幣別對美元升值','價格下跌了8%','數字有誤'],1,
      '固定匯率基礎剔除了匯率變動。實質成長是4%；其餘是換算造成的。')
  ]},
  /* ---------------------------------------------------------------- 7 */
  {id:'case', label:'個案：第19天', kind:'case', title:'第19天才送到的集團報告', blocks:[
    CASE('新的集團，舊的流程',
      `<p>BraceWorks現在有五家公司。今年第一份集團報告在第19個工作天才送到。報告顯示營業利益$410萬，但附了一句說明：「集團內部往來差異$340,000調查中；越南數字為暫定數。」集團會計花了四天把越南的數字重新輸入試算表，因為越南用的是另一套會計科目表。德國和馬尼拉對德國欠多少錢各說各話。銀行要求在第20天前提交季度財務承諾條款遵循證明。</p>`),
    Q('這一季你可以修正三件事。是哪三件？',[
      {text:'在馬尼拉多聘兩名會計人員', why:'多找人重新輸入同樣的試算表，解決不了根本原因。'},
      {text:'所有國家固定的結帳時程表、一套會計科目表，以及一套在月底前就對好餘額的集團內部往來政策'},
      {text:'先買合併報表工具', why:'沒有統一的會計科目表和對好的集團內部往來餘額，工具只會更快地把同樣的爛攤子合併起來。'},
      {text:'每一季都請銀行延後財務承諾條款的期限', why:'這次可能需要一次性的延期，但結帳延遲對放款人來說是個警訊。'}],1,
      '這三項都是成本不高的流程改善，能消除大部分的延誤。這些到位之後，合併報表工具和增聘人手才值得投資。'),
    TIP('該怎麼跟銀行說',
      `<p>及早開口、只開口一次，並說明計畫：「這是我們成為五家公司集團後的第一季，結帳花了比較久的時間。以下是我們做的改變；從下一季起，你們會在第12天前拿到證明。」放款人會原諒延遲的第一季。他們擔心的是一再發生。</p>`)
  ]},
  /* ---------------------------------------------------------------- 8 */
  {id:'quiz', label:'測驗', kind:'quiz', title:'檢查你的理解', blocks:[
    Q('BraceWorks正要進入第三個國家。哪一個財務職位最需要先到位？',['內部稽核人員','負責合併財務報表和集團內部往來的集團會計','投資人關係經理','資金交易員'],1,'只要超過一家公司，合併財務報表和集團內部往來就會成為瓶頸。'),
    Q('哪一個ERP計畫風險最高？',['完整彩排後，在淡季月份上線','分階段、一個國家接一個國家上線','在最忙的季節前夕，所有地方同時上線，而且沒有備案','上線前清理主檔資料'],2,'同時全面上線、在旺季、沒有備案：只要一出錯，所有東西都會在最糟的時候一起出錯。'),
    Q('馬尼拉帳上顯示德國欠$105萬；德國帳上顯示欠馬尼拉$103萬。最應該先查哪個可能原因？',['德國有舞弊','在途存貨與不同的匯率','稅務錯誤','德國付了兩次'],1,'時間差和匯率能解釋大部分的集團內部往來差異。一套關於截止點和匯率的集團政策可以預防。'),
    Q('國外子公司資產負債表的換算差額列在哪裡？',['營業利益','權益中的國外營運機構財務報表換算之兌換差額','營業收入','銷貨成本'],1,'換算差額列入其他綜合損益，並累積在權益中。'),
    Q('為什麼要以固定匯率基礎報告結果？',['會計師要求','看出排除匯率影響後的實質表現','讓結果看起來更好','計算稅額'],1,'它把企業本身的表現和匯率造成的影響分開。'),
    Q('全球最低稅負制適用於營業收入至少多少的集團？',['$1億','前四年中有兩年達€7.5億','每年€10億','任何有海外子公司的集團'],1,'門檻是在前四年中至少有兩年合併營業收入達€7.5億。')
  ]},
  /* ---------------------------------------------------------------- 9 */
  {id:'apply', label:'練習', kind:'apply', title:'規劃你自己的集團財務', blocks:[
    `<p>選讀。規劃下一個國家或下一批200人時，可以使用這份清單。勾選只儲存在這個瀏覽器中。</p>`,
    CHECK('m25-group','下一家公司成立之前…',[
      '我們知道由誰負責它的帳務、申報它的稅，並簽署它的法定財務報表',
      '它從第一天起就使用集團的會計科目表和會計政策',
      '集團內部協議、價格和結算規則都已形諸文字',
      '它的各項期限都列在集團法遵行事曆中，每一項都有負責人',
      '它會依照和其他公司相同的結帳時程表向集團報告',
      '超過一定金額的銀行授權需要總公司簽名',
      '我們的系統能再處理一家公司和一種貨幣，或者我們已有升級計畫',
      '我們已確認集團的規模是否會帶來新規則，例如全球最低稅負制'
    ]),
    REPORT('你的週一早晨提問',
      `<p>問：<strong>「下個月的集團報告會在第幾個工作天送到？最拖慢它的那一件事是什麼？」</strong>答案會告訴你，財務上的下一塊錢該花在哪裡。</p>`),
    K('重點整理',
      `<ul>
        <li>財務人力要比複雜度早一步到位，無法以專職人力支應的專家就向外採購。</li>
        <li>在淡季更換系統，搭配乾淨的資料、完整的彩排和備援計畫。</li>
        <li>大部分結帳延誤是流程問題：固定的時程表、一套會計科目表和事先對好的集團內部往來，就能解決大部分。</li>
        <li>每家公司仍需要自己的當地帳簿、申報和查核。</li>
        <li>按營運部門並以固定匯率基礎解讀集團結果。</li>
       </ul>`)
  ]}
  ],
  warnings:[
    {sign:'集團報告晚於第12個工作天', meaning:'決策根據的是舊數字；通常是流程問題。', look:'結帳時程表；哪個國家或哪個步驟最慢。'},
    {sign:'未說明的集團內部往來差異逐月延續', meaning:'沒有集團內部往來政策；錯誤藏在差額裡。', look:'按每一對公司的集團內部對帳。'},
    {sign:'只以實際匯率報告成長', meaning:'匯率可能美化或掩蓋了真正的表現。', look:'固定匯率基礎的比較。'},
    {sign:'當地申報「由當地會計師處理」，沒有集團行事曆', meaning:'罰款和董事責任在無人察覺中累積。', look:'有指定負責人的集團法遵行事曆。'}
  ],
  formulas:[
    {name:'固定匯率基礎成長率', f:'(今年以當地貨幣計之金額 × 去年匯率) ÷ 去年以美元計之金額 − 1', ex:'(€1,050萬 × 1.08) ÷ $1,080萬 − 1 = 5.0%'}
  ],
  glossary:[
    {term:'集團會計手冊（Group accounting manual）', def:'集團內每家公司都遵循的書面政策、會計科目表、結帳時程表和核決金額上限。'},
    {term:'集團內部對帳（Intercompany reconciliation）', def:'核對集團各公司之間彼此的應收應付餘額，使其在集團帳目中剛好互相抵銷。'},
    {term:'結帳時程表（Close calendar）', def:'月底結帳中，每家公司、每個步驟的工作與期限的固定時間表。'},
    {term:'固定匯率基礎（Constant currency）', def:'以固定匯率（通常是去年或預算匯率）重新表達的結果，用來呈現實質表現。'},
    {term:'全球最低稅負制（Global minimum tax）', def:'規定營業收入達€7.5億以上的集團，在每個國家的利益都必須負擔至少15%有效稅率的規則（常稱為第二支柱，Pillar Two）。'}
  ]
});
})();
