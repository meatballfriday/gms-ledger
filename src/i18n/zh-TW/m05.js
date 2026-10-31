/* ===== Module 5: Cash flow ===== */
(function(){
const {K,TIP,FLAG,CASE,REPORT,Q,FS,FLIP,SORT,CHECK,W,PACK,money,signed,pct,kfmt} = BW.h;
const C=BW.data.cf;

BW.add({
  id:'m5', minutes:40,
  title:'現金流量',
  subtitle:'獲利是記分板，現金才讓你活下去。如何解讀現金流量表，以及一家賺錢的工廠為什麼仍可能把錢用光。',
  goals:[
    '看懂兩種常見格式的現金流量表',
    '說明從本期淨利到營業活動現金流量的每一步',
    '計算自由現金流量與可用額度餘裕',
    '在簽下大筆新訂單之前，看出過度擴張營業的風險'
  ],
  sections:[
  {id:'stmt', label:'現金流量表', kind:'learn', title:'BraceWorks的現金流量表', blocks:[
    `<p>現金流量表說明銀行存款餘額為什麼會變動。多數公司採用<strong>間接法</strong>表達：從本期淨利出發，再調整所有對損益與現金影響不同的項目。</p>`,
    FS({title:'BraceWorks Medical · 現金流量表', sub:'截至12月31日止年度 · 間接法', rows:[
      '營業活動',
      ['本期淨利', C.net, 'ind'],
      ['加回折舊', C.dep, 'ind'],
      ['應收帳款增加', C.dAR, 'ind'],
      ['存貨增加', C.dInv, 'ind'],
      ['應付帳款增加', C.dAP, 'ind'],
      ['應計費用增加', C.dAccr, 'ind'],
      ['應付所得稅增加', C.dTax, 'ind'],
      ['營業活動之現金流入', C.cfo, 'sub'],
      '投資活動',
      ['購置泡棉裁切機', C.capex, 'ind'],
      ['投資活動之現金流出', C.capex, 'sub'],
      '籌資活動',
      ['動用營運週轉額度', C.borrow, 'ind'],
      ['償還設備貸款', C.repay, 'ind'],
      ['支付股利', 0, 'ind'],
      ['籌資活動之現金流入', C.cff, 'sub'],
      ['本期現金淨變動', C.change, 'sub'],
      ['期初現金', C.open, 'ind'],
      ['期末現金', C.close, 'total']
    ]}),
    `<h3>同一個故事，直接說出來</h3>
     <p>有些公司用<strong>直接法</strong>表達營業活動現金流量：實際收進來和付出去的錢。這種格式比較好讀，值得請你的團隊至少每月提供一次。</p>`,
    FS({title:'營業活動現金流量 · 直接法', rows:[
      ['向客戶收取之現金', 1170000],
      ['支付供應商、員工及其他之現金', -1106000],
      ['支付利息', -14000],
      ['支付所得稅', -17000],
      ['營業活動之現金流入', 33000, 'total']
    ], note:'因為應收帳款增加，客戶付的錢比銷貨少了$30,000。答案和間接法相同，只是從另一個方向算。'}),
    K('先看哪裡',
      `<p>先看<strong>營業活動</strong>那一行，其他的稍後再看。健康的企業年復一年從營運中產生現金。如果營業活動現金很弱甚至是負數，不管帳面獲利多好看，這家公司其實是靠借錢或股東撐著。</p>`),
    TIP('2027年起：利息放在哪裡',
      `<p>目前公司可以把支付的利息列在營業活動或籌資活動。BraceWorks列在營業活動。在<strong>IFRS 18</strong>之下，自2027年起採用完整IFRS或完整PFRS的公司（台灣IFRS自2028年起），支付的利息與股利要列在<strong>籌資活動</strong>，收取的利息與股利列在投資活動，而間接法改從<strong>營業利益</strong>而非本期淨利出發。以BraceWorks來說，營業活動現金流量會從$33,000增加到$47,000，籌資活動則減少同樣的$14,000，銀行存款餘額完全不變。</p>`)
  ]},
  {id:'bridge', label:'從獲利到現金', kind:'learn', title:'從獲利到現金，一步一步來', blocks:[
    `<p>間接法看起來很混亂，但只要懂背後的兩條規則就不難了。</p>`,
    K('規則1：加回沒有花到現金的成本',
      `<p>折舊讓獲利減少了$38,000，但認列折舊時沒有任何錢離開銀行。錢是在買機器的時候就付出去了，所以要加回。存貨跌價損失和提列的備抵呆帳也是同樣道理。</p>`),
    K('規則2：營運資金會讓現金移動',
      `<ul>
        <li><strong>資產增加</strong>（應收帳款變多、存貨變多）會<strong>用掉現金</strong>。錢現在卡在那裡，而不是在銀行裡。</li>
        <li><strong>資產減少</strong>會釋放現金。</li>
        <li><strong>負債增加</strong>（欠供應商更多）會<strong>提供現金</strong>。你留住了原本要付出去的錢。</li>
        <li><strong>負債減少</strong>會用掉現金。</li>
       </ul>`),
    SORT('每一項變動是用掉現金，還是提供現金？',['用掉現金','提供現金'],[
      {text:'應收帳款增加$20,000', a:0, why:'客戶欠你更多，代表你收到的錢比賣出的少。'},
      {text:'製成品存貨減少$15,000', a:1, why:'你賣掉了已經付過錢的存貨，而且沒有全部補回來。'},
      {text:'應付供應商帳款增加$10,000', a:1, why:'你留住了$10,000，這筆錢原本應該付給供應商。'},
      {text:'客戶為未來的訂單支付$15,000訂金', a:1, why:'現在現金流入，同時產生日後交貨的負債。'},
      {text:'你預付了一整年的保險費', a:0, why:'現在付出現金，但這筆成本屬於未來的月份。'},
      {text:'你償還$20,000的設備貸款', a:0, why:'負債減少，用掉現金。列在籌資活動。'},
      {text:'你以$2,000賣掉一台舊縫紉機', a:1, why:'來自投資活動的現金流入。'}
    ]),
    TIP('解讀任何現金流量表的捷徑',
      `<p>拿<strong>營業活動現金流量和EBITDA比較</strong>。這叫做現金轉換率（cash conversion）。BraceWorks：$33,000 ÷ $132,000 = 25%。在穩定的企業，扣除所得稅與利息後，你會希望達到70%以上。轉換率低幾乎總是代表營運資金在增加：去查應收帳款和存貨。</p>`)
  ]},
  {id:'play', label:'現金橋', kind:'play', title:'建立BraceWorks這一年的現金', blocks:[
    `<p>調整客戶付款的速度、持有的存貨量、付款給供應商的速度，以及設備支出金額，看看年底現金會怎麼變。起始數字是去年的實際數。</p>`,
    W('現金橋建構器', function(el, ctx){
      const {money,signed}=ctx.h;
      const top=document.createElement('div'), out=document.createElement('div'); el.append(top,out);
      const REV=1200000, COGS=860000, MAT=552000, AR0=200000, INV0=205000, AP0=85000, DEP=38000, OPEN=49000, FIN=20000, OTHER=4500;
      ctx.ui.sliders(top,[
        {k:'dso',label:'客戶付款天數',min:30,max:120,step:1,v:70,f:x=>x+' 天'},
        {k:'dio',label:'存貨持有天數（以銷貨成本計）',min:45,max:150,step:1,v:106,f:x=>x+' 天'},
        {k:'dpo',label:'我們付款給供應商的天數',min:20,max:90,step:1,v:63,f:x=>x+' 天'},
        {k:'capex',label:'設備購置',min:0,max:120000,step:5000,v:60000,f:money},
        {k:'np',label:'本期淨利',min:-20000,max:120000,step:2500,v:55500,f:money}
      ],(v)=>{
        const ar=REV*v.dso/365, inv=COGS*v.dio/365, ap=MAT*v.dpo/365;
        const dAR=-(ar-AR0), dInv=-(inv-INV0), dAP=ap-AP0;
        const cfo=v.np+DEP+dAR+dInv+dAP+OTHER, fcf=cfo-v.capex, close=OPEN+cfo-v.capex+FIN;
        const R=x=>Math.round(x/100)*100;
        out.innerHTML=ctx.ui.bridge([
          {label:'本期淨利',v:R(v.np),total:true},
          {label:'加回折舊',v:DEP},
          {label:'應收帳款',v:R(dAR)},
          {label:'存貨',v:R(dInv)},
          {label:'應付帳款及其他',v:R(dAP+OTHER)},
          {label:'營業活動現金',v:R(cfo),total:true},
          {label:'設備',v:-v.capex},
          {label:'淨借款',v:FIN},
          {label:'期初現金',v:OPEN},
          {label:'期末現金',v:R(close),total:true}
        ])+`<div class="stats" style="margin-top:14px">
          ${ctx.ui.stat('營業活動現金',money(R(cfo)),cfo<0?'bad':'')}
          ${ctx.ui.stat('自由現金流量',money(R(fcf)),fcf<0?'bad':'good','營業活動現金減設備支出')}
          ${ctx.ui.stat('年底現金',money(R(close)),close<0?'bad':close<30000?'warn':'good')}
        </div>
        <p class="w-hint" style="margin-top:10px">${close<0?`BraceWorks還需要再借<strong>${money(-R(close))}</strong>才撐得過這一年，${v.np>0?'儘管它有獲利':'不論它的損益結果如何'}。`:v.dso<=55&&v.dio<=85?'看看從營運資金裡釋放出多少現金。收款更快、存貨更精簡，不必多賺一分錢就能支應公司營運。':'試試看：把客戶付款設為55天、存貨設為85天，獲利不動。這樣大約可以釋放$100,000。'}</p>`;
      },ctx.uid);
    }),
    K('營運資金是和獲利一樣大的現金槓桿',
      `<p>收款快15天、存貨少3週，就能一次釋放大約$100,000。若要靠獲利產生同樣多的現金，BraceWorks需要將近兩年的目前盈餘。這就是為什麼第16單元整個都在談它。</p>`)
  ]},
  {id:'build', label:'自己動手編', kind:'play', title:'自己編製明年的現金流量表', blocks:[
    `<p>看懂現金流量表是一種能力；能從另外兩張報表把它編出來，才證明你懂三者如何連結。以下是BraceWorks<strong>明年</strong>的帳目草稿。請根據線索算出現金流量表的每一行。現金流出請用負號。</p>`,
    W('現金流量表編製器', function(el,ctx){
      const CL=[
        ['現金',42000,17900],['應收帳款',230000,214000],['存貨（三類合計）',250000,245000],['預付費用',13000,15000],
        ['機器設備及裝修（成本）',520000,575000],['減：累計折舊',-210000,-227000],['<strong>資產總計</strong>',845000,839900],
        ['應付帳款',95000,88000],['應計費用',30000,34000],['營運週轉借款（透支）',120000,95000],['應付所得稅',8500,10200],['設備貸款',100000,80000],
        ['股本',250000,250000],['保留盈餘',241500,282700],['<strong>負債及權益總計</strong>',845000,839900]];
      const L=[
        {h:'營業活動'},
        {k:'np',t:'本期淨利',a:61200,given:true},
        {k:'dep',t:'加回折舊',a:44000,hint:'本年度提列的折舊在線索中：$44,000。它減少了獲利，但沒有用掉現金。'},
        {k:'gain',t:'出售舊機器之利益',a:-2000,hint:'這台機器的帳面淨值是$30,000 − $27,000 = $3,000，以$5,000賣出。$2,000的利益包含在獲利中，但整筆$5,000應該列在投資活動，所以要在這裡把利益扣掉。'},
        {k:'ar',t:'應收帳款變動',a:16000,hint:'$230,000 → $214,000。應收帳款減少$16,000：客戶付的比開立的帳款多，因此提供現金。'},
        {k:'inv',t:'存貨變動',a:5000,hint:'$250,000 → $245,000。存貨減少代表釋放現金。'},
        {k:'pre',t:'預付費用變動',a:-2000,hint:'$13,000 → $15,000。預付得更多，用掉現金。'},
        {k:'ap',t:'應付帳款變動',a:-7000,hint:'$95,000 → $88,000。付款給供應商降低了應付帳款，用掉現金。'},
        {k:'acc',t:'應計費用變動',a:4000,hint:'$30,000 → $34,000。尚未支付的成本變多：留住了現金。'},
        {k:'tax',t:'應付所得稅變動',a:1700,hint:'$8,500 → $10,200。已認列但尚未繳納的稅：留住了現金。'},
        {sub:'cfo',t:'營業活動之現金流量',of:['np','dep','gain','ar','inv','pre','ap','acc','tax']},
        {h:'投資活動'},
        {k:'capex',t:'購置機器',a:-85000,hint:'機器成本從$520,000增加到$575,000，但賣掉的那台$30,000機器也已除列。購置金額 = $575,000 − $520,000 + $30,000 = $85,000。'},
        {k:'sale',t:'出售舊機器之現金',a:5000,hint:'售價：$5,000。'},
        {sub:'cfi',t:'投資活動之現金流量',of:['capex','sale']},
        {h:'籌資活動'},
        {k:'od',t:'償還透支',a:-25000,hint:'$120,000 → $95,000。'},
        {k:'loan',t:'償還設備貸款',a:-20000,hint:'$100,000 → $80,000。'},
        {k:'div',t:'支付股利',a:-20000,hint:'見線索。驗算：保留盈餘$241,500 + 獲利$61,200 − 股利 = $282,700。'},
        {sub:'cff',t:'籌資活動之現金流量',of:['od','loan','div']},
        {sub:'net',t:'本期現金淨變動',of:['np','dep','gain','ar','inv','pre','ap','acc','tax','capex','sale','od','loan','div']}];
      const S=ctx.state; S.cfb=S.cfb||{}; const st=S.cfb; const P=BW.parseNum||(x=>parseFloat(x));
      el.innerHTML=`<div class="cfb-clues"><div><h4 style="margin:0 0 6px">資產負債表</h4>${ctx.ui.table(['','今年','明年'],CL.map(r=>[r[0],ctx.h.money(r[1]),ctx.h.money(r[2])]),{num:[1,2]})}</div>
        <div><h4 style="margin:0 0 6px">明年：其他線索</h4><ul class="prose" style="margin:0;padding-left:18px;font-size:15px">
          <li>本期淨利：<strong>$61,200</strong>，已扣除折舊<strong>$44,000</strong>。</li>
          <li>一台成本<strong>$30,000</strong>（累計折舊<strong>$27,000</strong>）的舊縫紉機以現金<strong>$5,000</strong>出售。處分利益已包含在獲利中。</li>
          <li>宣告並支付股利<strong>$20,000</strong>。</li>
          <li>沒有新增任何借款。</li></ul></div></div>
        <div class="cfb-lines"></div>
        <div class="cfb-tie"><div class="cfb-txt" style="flex:1"></div><span class="cfb-stamp" hidden>勾稽相符 ✓</span></div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px"><button type="button" class="btn small" data-check>檢查我的答案</button><button type="button" class="btn ghost small" data-show style="display:none">顯示答案</button><button type="button" class="linkbtn" data-reset>重新開始</button></div>`;
      const box=el.querySelector('.cfb-lines'); const rows={};
      L.forEach(l=>{ if(l.h){ box.appendChild(Object.assign(document.createElement('div'),{className:'cfb-row h',textContent:l.h})); return; }
        const r=document.createElement('div'); r.className='cfb-row'+(l.sub?' sub':'');
        if(l.sub){ r.innerHTML=`<span>${l.t}</span><span class="given" data-sum></span><span class="mk"></span>`; rows[l.sub]={r,l}; }
        else if(l.given){ r.innerHTML=`<span>${l.t}</span><span class="given">${ctx.h.money(l.a)}</span><span class="mk"></span>`; rows[l.k]={r,l}; }
        else { r.innerHTML=`<label for="${ctx.uid(l.k)}">${l.t}</label><input id="${ctx.uid(l.k)}" type="text" inputmode="decimal" autocomplete="off" placeholder="0"><span class="mk" aria-live="polite"></span><div class="hint" hidden></div>`; rows[l.k]={r,l}; const inp=r.querySelector('input'); if(st[l.k]!=null) inp.value=st[l.k]; inp.addEventListener('input',()=>{ st[l.k]=inp.value; ctx.save(); r.classList.remove('ok','bad'); r.querySelector('.mk').textContent=''; r.querySelector('.hint').hidden=true; sums(); }); inp.addEventListener('keydown',e=>{ if(e.key==='Enter') check(); }); }
        box.appendChild(r); });
      const val=k=>{ const x=rows[k]; if(x.l.given) return x.l.a; const v=P(x.r.querySelector('input').value); return v==null?0:v; };
      const allRight=()=>L.filter(l=>l.k&&!l.given).every(l=>val(l.k)===l.a);
      function sums(){ L.filter(l=>l.sub).forEach(l=>{ const t=l.of.reduce((a,k)=>a+val(k),0); rows[l.sub].r.querySelector('[data-sum]').textContent=ctx.h.money(t); });
        const net=L.find(l=>l.sub==='net').of.reduce((a,k)=>a+val(k),0), close=42000+net, ok=allRight();
        const tie=el.querySelector('.cfb-tie'); tie.classList.toggle('ok',ok); el.querySelector('.cfb-stamp').hidden=!ok;
        el.querySelector('.cfb-txt').innerHTML=`期初現金$42,000 ${net<0?'−':'+'} ${ctx.h.money(Math.abs(net))} = 期末現金<strong>${ctx.h.money(close)}</strong>。資產負債表上是<strong>$17,900</strong>。${ok?'每一行都正確，三大報表彼此勾稽相符。':Math.round(close)===17900?'總數對上了，但至少有一行是錯的：兩個錯誤剛好互相抵銷。請檢查你的答案。':''}`; }
      function check(){ let wrong=0; L.filter(l=>l.k&&!l.given).forEach(l=>{ const x=rows[l.k], v=val(l.k), raw=x.r.querySelector('input').value.trim(), h=x.r.querySelector('.hint'), mk=x.r.querySelector('.mk');
          if(v===l.a&&raw){ x.r.classList.add('ok'); x.r.classList.remove('bad'); mk.textContent='✓'; h.hidden=true; return; }
          wrong++; x.r.classList.add('bad'); x.r.classList.remove('ok'); mk.textContent='✗'; h.hidden=false;
          h.innerHTML=raw&&v===-l.a?'<strong>金額對了，方向錯了。</strong>這項變動是用掉現金還是提供現金？':raw?'還差一點。比較這一行在兩張資產負債表上的數字，或重讀一次線索。':'這一格還沒填。'; });
        el.querySelector('[data-show]').style.display=wrong===0?'none':''; S.cfbChecked=true; ctx.save(); sums(); }
      el.querySelector('[data-check]').onclick=check;
      el.querySelector('[data-show]').onclick=()=>{ L.filter(l=>l.k&&!l.given).forEach(l=>{ const x=rows[l.k]; x.r.querySelector('input').value=String(l.a); st[l.k]=String(l.a); const h=x.r.querySelector('.hint'); h.hidden=false; h.innerHTML=l.hint; }); ctx.save(); check(); };
      el.querySelector('[data-reset]').onclick=()=>{ Object.keys(st).forEach(k=>delete st[k]); ctx.save(); BW.go(ctx.mod.id,ctx.mod.sections.indexOf(ctx.sec)); };
      sums(); if(S.cfbChecked&&Object.keys(st).length) check();
    }),
    K('方法只有三步',
      `<ol>
        <li><strong>從獲利出發。</strong>加回沒有用到現金的成本（折舊、跌價損失）。扣除應列在投資活動的利益與損失，例如出售機器。</li>
        <li><strong>資產負債表上其他每一項變動都是一筆現金流量。</strong>資產增加：用掉現金。負債增加：留住現金。把每一項歸入營業、投資或籌資活動。</li>
        <li><strong>確認勾稽相符。</strong>合計數必須等於銀行存款餘額的變動。如果不相等，就是漏了一行或正負號錯了。</li>
       </ol>
       <p>三表預測模型也正是這樣運作的（第23單元）。</p>`),
    Q('明年獲利$61,200，現金卻減少$24,100。哪個說法最能解釋？',[
      '這家公司以現金來看是虧損的','營運產生了大量現金，但流向機器、還銀行和發股利的錢更多','折舊提列得太高','所得稅繳了兩次'],1,
      '營業活動現金$120,900是很好的成績；$80,000投入機器，$65,000付給銀行和股東。現金減少不一定是壞消息：要看錢流到哪裡去。')
  ]},
  {id:'runway', label:'自由現金與餘裕', kind:'learn', title:'自由現金流量、可用額度餘裕與最低點', blocks:[
    `<h3>自由現金流量</h3>
     <p><span class="term">自由現金流量</span> = 營業活動現金 − 設備支出。這是企業產生、可以自由用來還債、發股利或存起來的現金。</p>
     <p>BraceWorks：$33,000 − $60,000 = <strong>($27,000)</strong>。公司沒有自己支應投資，是銀行出的錢。買機器的那一年出現這種情況很正常；如果連續好幾年都這樣，代表公司在慢慢借錢原地踏步。</p>
     <h3>年底數字掩蓋了低點</h3>
     <p>BraceWorks年底有$42,000現金。但看看每個月底的現金：</p>`,
    W('BraceWorks各月底現金', function(el, ctx){
      const m=['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'], v=[38,31,22,35,41,18,9,48,6,24,37,42];
      el.innerHTML=ctx.ui.bars(m.map((x,i)=>({label:x,v:v[i]*1000,tone:v[i]<15?'bad':v[i]<25?'warn':''})),{max:50000})+
        `<p class="w-hint" style="margin-top:10px">這一年中有兩次現金跌破$10,000，而每月薪資大約$24,000。7月是因為一大筆泡棉採購。9月就是你在第1單元看過的那個個案。年底數字看起來沒問題，但公司有兩次差點發不出薪水。</p>`;
    }),
    K('流動性的可用額度餘裕',
      `<p><span class="term">可用額度餘裕</span> = 現金 + 借款額度中尚未動用的部分。這才是衡量你還有多少空間的真正指標。</p>
       <p>BraceWorks有$150,000的營運週轉額度，已動用$120,000。年底的可用額度餘裕：$42,000 + $30,000 = <strong>$72,000</strong>，大約三個月的薪資。每個月都要問可用額度餘裕，以及<strong>未來13週預期的最低可用額度餘裕</strong>。</p>`),
    Q('BraceWorks的營業活動現金流量是$33,000，設備購置是$60,000。自由現金流量是多少？代表什麼？',[
      '$93,000：有很多閒置現金','($27,000)：公司需要外部資金來支應投資','$33,000：設備不算在內','$60,000：機器的價值'],1,
      '自由現金流量為負，代表公司用掉的現金比產生的多。缺口由借款補上。')
  ]},
  {id:'case', label:'個案：越成長越沒錢', kind:'case', title:'越成長越沒錢', blocks:[
    CASE('人人都想要的合約',
      `<p>一家澳洲醫院集團提供BraceWorks一份兩年期的供貨合約：床墊和吊帶，<strong>每年$432,000</strong>。這大約比BraceWorks目前的產量多出40%。條件如下：</p>
       <ul>
        <li>因為量大，價格比BraceWorks的牌價低10%。</li>
        <li>交貨後<strong>90天</strong>付款。</li>
        <li>BraceWorks必須保有六週的安全存量。</li>
        <li>兩個月後開始首批交貨。</li>
       </ul>
       <p>財務部門算過了。這份合約有賺錢：在增聘15人、加開第二班之後，<strong>每年約增加$69,000的本期淨利</strong>。業務團隊想今天就簽約。</p>`),
    `<p>現在來看第一年的現金面：</p>`,
    FS({title:'這份合約第一年對現金的影響', rows:[
      ['增加的本期淨利', 69000],
      ['增加的應收帳款（$432,000的90天）', -106500],
      ['增加的存貨（原料、在製品及安全存量）', -90600],
      ['增加的供應商信用（$221,000原料的63天）', 38100],
      ['因應產量需要的第二台泡棉裁切機', -45000],
      ['第一年所需現金', -135000, 'sub'],
      ['目前可用額度餘裕（現金 + 未動用透支額度）', 72000],
      ['資金缺口', -63000, 'total']
    ], note:'而且這還只是年底的情況。在頭四個月，工資和原料早在第一筆客戶貨款進來之前就要支付，所以缺口的高峰更大。'}),
    K('這就叫過度擴張營業',
      `<p><span class="term">過度擴張營業</span>（overtrading）是指成長速度超過現金能支撐的程度。這是賺錢的小型製造商倒閉最常見的原因之一。成長需要先投入營運資金：製造產品需要存貨，等待收款時還要給客戶賒帳。</p>`),
    Q('BraceWorks應該怎麼做？',[
      {text:'拒絕。風險太大。', why:'這份合約是賺錢的。沒有試著解決現金問題就拒絕，等於把錢留在桌上不拿。'},
      {text:'今天就簽，現金問題以後再說', why:'過度擴張營業就是這樣開始的。缺口現在就知道了，可用額度餘裕不夠支應也已經知道了。'},
      {text:'先談判：縮短付款期限或收取訂金、分階段放量，並在簽約前談妥額外的銀行資金'},
      {text:'簽約，然後把所有供應商都改成120天付款來籌錢', why:'把供應商拖到這麼久，會危及供貨、品質優先順序和你的商譽。這是最後手段，不是計畫。'}
    ],2,'每一個槓桿都能縮小缺口。付款期限從90天改為60天，大約釋放$35,000。首批訂單收取20%訂金，能在你花錢之前先把現金收進來。用六個月逐步放量，能分散存貨的累積。再於簽約前安排好出口應收帳款融資額度，補足其餘部分。銀行對手上有醫院集團簽約合約的公司，遠比對已經陷入困境的公司更願意放款。'),
    TIP('每筆大訂單之前都該問的問題',
      `<p>不只是<em>「有沒有賺錢？」</em>，而是<strong>「需要多少現金、什麼時候需要、這些現金從哪裡來？」</strong>請財務部門針對這筆訂單做按月的現金預測，從第一筆原料採購到最後一筆客戶付款。</p>`)
  ]},
  {id:'quiz', label:'測驗', kind:'quiz', title:'檢查你的理解', blocks:[
    Q('為什麼在現金流量表中要把折舊加回本期淨利？',['它是現金來源','它減少了獲利，卻沒有任何現金離開公司','銀行要求這樣做','為了節稅'],1,'現金在購買機器時就流出了，列在投資活動。折舊只是分攤這筆成本，本身不會移動任何錢。'),
    Q('本年度應收帳款增加$30,000。在間接法現金流量表中，這一項…',['加到獲利上','從獲利中減除','列在籌資活動','忽略不計'],1,'客戶欠的錢變多，代表收到的比賣出的少。要減除。'),
    Q('總經理應該先看現金流量表的哪一行？',['籌資活動','營業活動之現金流量','股利','期初現金'],1,'營業活動現金顯示企業本身是否能產生現金。投資和籌資活動則顯示它如何花錢與籌錢。'),
    Q('BraceWorks有$42,000現金，以及$150,000的透支額度、已動用$120,000。它的流動性可用額度餘裕是多少？',['$42,000','$72,000','$150,000','$192,000'],1,'現金加未動用額度：$42,000 + $30,000 = $72,000。'),
    Q('一份賺錢的新合約第一年需要$135,000現金，而你只有$72,000的可用額度餘裕。這是哪一種例子？',['已經發生的流動性危機','過度擴張營業的風險','一份爛合約','正常的季節性'],1,'即使成長是賺錢的，公司也可能因為成長太快而把現金用光。'),
    Q('營業活動現金流量一直遠低於EBITDA。最可能的原因是什麼？',['折舊很高','營運資金（應收帳款和存貨）持續增加','利率很低','銀行裡的現金太多'],1,'現金轉換率低，通常代表現金被營運資金吸走了。')
  ]},
  {id:'apply', label:'練習', kind:'apply', title:'用練習包練習', blocks:[
    PACK('packC',5,'練習包C，第5頁：13週預測'),
    Q('練習包C的現金流量顯示營業活動現金為($36,500)，稅後淨利則是$34,725。現金轉換率是多少？',['大約100%','負數：公司在賺錢的同時用掉了現金','大約50%','無法判斷'],1,'每一塊錢的獲利，甚至更多，都流進了應收帳款和存貨。'),
    Q('在13週預測中，流動性何時最低？低到多少？',['第1週，$9k','第4週，($12k)','第13週，$52k','第11週'],1,'薪資、一筆泡棉貨款和每季稅款都在第4週同時到期。'),
    Q('預測之所以回升，主要靠一筆收款。是哪一筆？如果晚到會怎樣？',['沙烏地的$18k；沒有影響','美國經銷商A在第11週的$88k；如果晚到，資金短缺會多拖好幾週','退稅；沒有影響','提高透支額度'],1,'仰賴單一大筆收款的預測需要備案。在這個例子中，現在就應該去跟銀行談。'),
    {t:'html',html:'<h3>之後，用你自己的報告</h3><p class="small" style="color:var(--muted)">選讀。下次閱讀你自己的月度報告時，可以用這份檢核表。這裡的內容不會分享或傳送出去；勾選只儲存在這個瀏覽器中。</p>'},
    CHECK('m5-cash','我的月度管理報告…',[
      '包含當月及本年累計的現金流量表',
      '用幾句話說明獲利與營業活動現金之間的差距',
      '按幣別及銀行帳戶列示現金餘額',
      '列示透支及貸款額度、已動用金額與可用額度餘裕',
      '包含前瞻性的現金預測（最好是13週、逐週）',
      '單獨列示資本支出，並與核准的預算比較',
      '標示未來幾個月預期的現金最低點'
    ]),
    REPORT('你的週一早晨提問',
      `<p>問：<strong>「未來13週，我們預期最低的現金和可用額度餘裕是多少？在哪一週？」</strong>如果沒人答得出來，你就是在沒有油量表的情況下飛行。第10單元會說明如何建立這份預測。</p>`),
    K('重點整理',
      `<ul>
        <li>先看營業活動現金流量。它告訴你企業能不能自己養活自己。</li>
        <li>獲利要先通過應收帳款和存貨這兩關，才會變成現金。</li>
        <li>自由現金流量 = 營業活動現金 − 設備支出。連續多年為負，代表在借錢原地踏步。</li>
        <li>要看最低點和可用額度餘裕，不能只看月底餘額。</li>
        <li>在簽下大幅成長的合約之前，先問需要多少現金、什麼時候需要。</li>
       </ul>`)
  ]}
  ],
  warnings:[
    {sign:'營業活動現金流量年年遠低於EBITDA', meaning:'營運資金正在吸乾獲利。', look:'應收帳款與存貨週轉天數的趨勢。'},
    {sign:'自由現金流量連續兩年以上為負', meaning:'設備與成長靠舉債支應。', look:'資本支出計畫與營業活動現金的比較。'},
    {sign:'可用額度餘裕低於一個月薪資', meaning:'客戶晚付款或一筆大採購，就幾乎沒有轉圜空間。', look:'13週現金流量預測；及早擴增額度的選項。'},
    {sign:'付款期限很長的大筆新訂單', meaning:'過度擴張營業的風險：成長在帶來收入之前就需要現金。', look:'這筆訂單逐月的現金預測。'},
    {sign:'為了撐下去而越來越晚付款給供應商', meaning:'公司把供應商當成隱形的銀行。', look:'應付帳款週轉天數趨勢；供應商的抱怨和停止供貨的威脅。'}
  ],
  formulas:[
    {name:'營業活動現金流量（間接法）', f:'本期淨利 + 折舊 − 應收帳款增加 − 存貨增加 + 應付帳款增加（及其他營運資金）', ex:'$55,500 + $38,000 − $30,000 − $45,000 + $14,500 = $33,000'},
    {name:'自由現金流量', f:'營業活動現金流量 − 資本支出', ex:'$33,000 − $60,000 = ($27,000)'},
    {name:'現金轉換率', f:'營業活動現金流量 ÷ EBITDA', ex:'$33,000 ÷ $132,000 = 25%'},
    {name:'流動性可用額度餘裕', f:'現金 + 未動用借款額度', ex:'$42,000 + $30,000 = $72,000'}
  ],
  glossary:[
    {term:'營業活動現金流量（Operating cash flow）', def:'企業日常營運活動所產生的現金。'},
    {term:'投資活動現金流量（Investing cash flow）', def:'用於取得或處分機器等長期資產而支出或收到的現金。'},
    {term:'籌資活動現金流量（Financing cash flow）', def:'與債權人及股東之間往來的現金：借入與償還借款、增資、股利。'},
    {term:'間接法（Indirect method）', def:'從本期淨利出發，調整非現金項目及營運資金變動的現金流量表達方式。'},
    {term:'直接法（Direct method）', def:'列示實際收款與付款的現金流量表達方式，例如向客戶收取的現金與支付給供應商的現金。'},
    {term:'自由現金流量（Free cash flow, FCF）', def:'營業活動現金流量減資本支出。可自由用於還債、發放股利或儲蓄的現金。'},
    {term:'現金轉換率（Cash conversion）', def:'營業活動現金流量占EBITDA的百分比。顯示營業獲利有多少變成了現金。'},
    {term:'可用額度餘裕（Headroom）', def:'現金加上未動用的借款額度。衡量財務空間的真正指標。'},
    {term:'過度擴張營業（Overtrading）', def:'成長速度超過可用現金能支撐的程度，導致賺錢的企業把錢用光。'},
    {term:'資本支出（Capital expenditure, capex）', def:'用於機器、模治具或廠房裝修等長期資產的支出。'}
  ]
});
})();
