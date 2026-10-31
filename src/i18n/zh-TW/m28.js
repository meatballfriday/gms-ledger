/* ===== Module 28: Funding growth: investors, a sale or a listing (optional: growing into a multinational) ===== */
(function(){
const {K,TIP,FLAG,CASE,REPORT,Q,FS,FLIP,SORT,CHECK,W,money,signed,pct,kfmt} = BW.h;
const m$=v=>money(Math.round(v));
const mm=v=>(v<0?'(':'')+'$'+Math.round(Math.abs(v)*100).toLocaleString('en-US')+'萬'+(v<0?')':'');
const E=(tag,cls,html)=>{ const e=document.createElement(tag); if(cls) e.className=cls; if(html!=null) e.innerHTML=html; return e; };

BW.add({
  id:'m28', minutes:60,
  title:'為成長籌資：投資人、出售或上市',
  subtitle:'從50人成長到1,000人，所需資金通常超過獲利與銀行貸款所能提供。各類投資人想要什麼、交易中企業如何評價與調整，以及一個好結果背後數年的準備。',
  goals:[
    '比較銀行借款、私募股權、策略投資人與股票上市',
    '算出新資金如何稀釋原股東，以及哪些控制權比持股比例更重要',
    '把評價倍數換算成賣方實際拿到的現金',
    '找出買方會質疑的盈餘調整項',
    '規劃增資或出售前三年的準備工作',
    '了解價格談定後仍會影響金額的交易條款'
  ],
  sections:[
  /* ---------------------------------------------------------------- 1 */
  {id:'options', label:'成長的資金來源', kind:'play', title:'為下一階段籌資的方式', blocks:[
    `<p>第20單元談的是50人公司的籌資。對一個邁向1,000人、要蓋第二座工廠並收購經銷商的集團來說，選項變多了，附帶的條件也變多了。</p>`,
    {t:'tbl', head:['來源','提供什麼','想要什麼','常見附帶條件'], rows:[
      ['<strong>銀行與私募信貸基金</strong>','貸款；私募信貸通常金額更大、期限更長','利息與還本','財務承諾條款、擔保品，有時限制股利與收購'],
      ['<strong>開發金融機構</strong>','為新興市場成長提供長期貸款或股權','發展影響力與報酬並重','環境、社會與治理標準；定期報告'],
      ['<strong>私募股權，少數股權</strong>','成長所需股權資金，外加董事會協助','約4–7年內拿回投入資金的數倍','董事席次、關鍵決策否決權、退場計畫'],
      ['<strong>私募股權，多數股權</strong>','買下公司大部分股權；創辦人常保留部分持股','控制權與規劃好的退場','經營團隊激勵、舉債、五年計畫'],
      ['<strong>策略投資人</strong>（規模更大的醫材公司）','資金，外加通路或技術','市場進入、產品，日後可能全資持有','獨家條款、買下其餘股權的權利'],
      ['<strong>股票上市</strong>','來自眾多投資人的資金；股份有了交易市場','成長、股利與持續的資訊揭露','公開報導、治理規範、每季受到檢視']
    ]},
    W('新資金如何改變股權結構', function(el,ctx){
      const top=E('div'), sg=E('div'), out=E('div'); el.append(top,sg,out);
      let v={r1:20,v1:60}, two=false, ready=false;
      ctx.ui.sliders(top,[{k:'r1',label:'向私募股權投資人募集',min:5,max:60,step:5,v:20,f:x=>'$'+(x*100).toLocaleString('en-US')+'萬'},{k:'v1',label:'增資前議定價值（投資前估值）',min:20,max:200,step:5,v:60,f:x=>'$'+(x*100).toLocaleString('en-US')+'萬'}],x=>{ v=x; if(ready) draw(); },ctx.uid);
      ctx.ui.seg(sg,[{v:false,label:'單輪'},{v:true,label:'加第二輪：投資前估值$1.6億、募集$4,000萬'}],false,x=>{ two=x; draw(); });
      sg.style.margin='10px 0';
      function draw(){
        const post1=v.v1+v.r1, a=v.r1/post1, own1=1-a;
        let own=own1, A=a, B=0, val=post1;
        if(two){ const post2=160+40; B=40/post2; own=own1*(1-B); A=a*(1-B); val=post2; }
        const seg=(cls,p,lab)=>`<i class="${cls}" style="flex-basis:${(p*100).toFixed(2)}%" title="${lab}: ${pct(p,1)}">${p>0.08?lab.split(' ')[0]+' '+pct(p,0):''}</i>`;
        out.innerHTML=`<div class="pie-wrap"><div class="own">${seg('s1',own,'創辦人')}${seg('s2',A,'投資人A')}${two?seg('s3',B,'投資人B'):''}</div></div>
          <div class="stats" style="margin-top:12px">${ctx.ui.stat('創辦人持股',pct(own,1),own<0.5?'warn':'')}${ctx.ui.stat('公司估值',mm(val),'','投資後')}${ctx.ui.stat('創辦人持股價值',mm(own*val),'good','帳面上')}</div>
          <p class="w-hint" style="margin-top:8px">${own<0.5?'創辦人已失去過半控制權，除非股東協議另有約定。事先講好哪些決策需要誰同意。':own<2/3?'低於三分之二，創辦人可能無法再獨自通過某些重大決議：在許多國家，修改公司章程、合併或出售公司需要三分之二以上的表決。請確認你所在地的法律與股東協議。':'創辦人仍保有明確的控制權，但投資人還是會要求對關鍵決策的否決權。'}一家規模更大、資金更充足的企業的一小部分，可能遠比一家小企業的全部更值錢。</p>`;
      }
      ready=true; draw();
    }),
    K('控制權不只看持股比例',
      `<p>持股25%的投資人常會取得董事席次，以及對預算、借款、收購、聘任執行長與出售公司的否決權。讀股東協議要像看價格一樣仔細：<strong>誰決定什麼</strong>，以及<strong>誰能在何時強制出售公司</strong>。</p>`)
  ]},
  /* ---------------------------------------------------------------- 2 */
  {id:'value', label:'從價值到現金', kind:'play', title:'從帳面上的估值到賣方手中的現金', blocks:[
    `<p>買方通常以盈餘的倍數為公司定價，常用的是EBITDA（第20單元）。這得出<strong>企業價值</strong>（enterprise value），即整個事業的價值。賣方拿到的是<strong>股權價值</strong>（equity value）：扣除負債及任何性質類似負債的項目後所剩的部分，再依事業交接時營運資金是否處於正常水準做調整。</p>`,
    W('企業價值到股權價值', function(el,ctx){
      const top=E('div'), br=E('div'), out=E('div'); el.append(top,br,out);
      const EB=12.2, ND=18, RET=2.0, TAX=1.5, LEASE=4.0, PEG=28;
      const lb=ctx.ui.liveBridge(br); let v={x:9,wc:26}, ready=false;
      ctx.ui.sliders(top,[{k:'x',label:'EBITDA倍數',min:6,max:14,step:0.5,v:9,f:x=>x.toFixed(1)+'×'},{k:'wc',label:'交割時營運資金',min:22,max:32,step:0.5,v:26,f:x=>'$'+Math.round(x*100).toLocaleString('en-US')+'萬（正常：$2,800萬）'}],x=>{ v=x; if(ready) draw(); },ctx.uid);
      function draw(){ const EV=EB*v.x, wcAdj=v.wc-PEG, eq=EV-ND-RET-TAX-LEASE+wcAdj;
        lb([{label:`企業價值（${v.x.toFixed(1)}× $${EB}m EBITDA）`,v:EV,total:true},{label:'銀行淨負債',v:-ND},{label:'租賃負債',v:-LEASE},{label:'未提撥之員工退休義務',v:-RET},{label:'以前年度應付稅款',v:-TAX},{label:'營運資金高於或低於正常水準',v:wcAdj},{label:'股權價值：賣方實際拿到的',v:eq,total:true}].map(s=>Object.assign(s,{v:Math.round(s.v*10)/10*1e6})));
        out.innerHTML=`<p class="w-hint" style="margin-top:10px">${wcAdj<0?`營運資金比議定的正常水準（即「基準值」）低${mm(-wcAdj)}。交割前壓低存貨與應收帳款，只會讓價格等額減少。`:wcAdj>0?'把多餘的營運資金留在公司裡，買方會等額付錢。':'營運資金正好等於基準值：不做調整。'}在這裡，每$1的EBITDA值${v.x.toFixed(1)}元的價值；每$1的類負債項目則正好扣掉$1。</p>`; }
      ready=true; draw();
    }),
    TIP('什麼算「類負債」',
      `<p>買方會扣除任何將耗用現金且與出售前期間有關的項目：銀行借款、租賃負債、未繳稅款、未提撥的員工退休義務（依菲律賓法律RA 7641，年滿60歲且服務滿五年以上退休的員工，每服務一年至少可領22.5天薪資）、過去收購的遞延付款，有時還包括客戶預收款。每一項都要談判。在買方發現之前先掌握它們，就能保住你的價格。</p>`)
  ]},
  /* ---------------------------------------------------------------- 3 */
  {id:'qoe', label:'盈餘品質', kind:'play', title:'盈餘品質：買方會調整什麼', blocks:[
    `<p>投資人或買方在談定價格前，會委託會計師編製<span class="term">盈餘品質</span>報告：這家公司在正常年度實際能賺多少。賣方提出「調整後EBITDA」，把他們認為屬一次性的成本加回。買方會逐項檢查。以下是BraceWorks Group的資料：帳列EBITDA <strong>$1,218萬</strong>，經賣方調整為<strong>$1,350萬</strong>。以9倍EBITDA計，每一項調整的價值都是其金額的九倍。</p>`,
    W('審查賣方的調整項', function(el,ctx){
      const BASE=12.18, X=9;
      const IT=[
        {t:'加回$30萬的專利訴訟律師費，該案已勝訴並結案',v:0.30,seller:true,right:true,why:'確實是一次性且已結束：合理的加回。'},
        {t:'加回$50萬的回收成本，稱為「一次性」',v:0.50,seller:true,right:false,why:'這是五年內第三次現場矯正行動。在醫材製造業，回收是經營的常態成本：買方會把它留在盈餘裡。'},
        {t:'加回$12萬的兩位家族成員薪資，他們會在出售時離職',v:0.12,seller:true,right:true,why:'前提是他們的合約真的終止且不會有人遞補，才會被接受。'},
        {t:'加回$40萬計畫遷往較便宜倉庫可省下的費用',v:0.40,seller:true,right:false,why:'尚未簽約，也尚未實現。買方只為已實現的節省付錢，不為計畫中的節省付錢。'},
        {t:'老闆年薪$90,000；聘一位市場行情的集團執行長要$250,000',v:-0.16,seller:false,right:true,why:'買方之後得付市場行情的薪資，因此會扣除差額。'},
        {t:'馬尼拉工廠向老闆承租，租金每年比市價低$20萬',v:-0.20,seller:false,right:true,why:'出售後租金會調回市價。買方會扣除差額。'}];
      const S=ctx.state; S.m28q=S.m28q||{}; const st=S.m28q;
      el.innerHTML=`<div class="rs-list"></div><div class="rs-run"><span>常態化EBITDA：<b class="q-e"></b></span><span>以9×計價值：<b class="q-v"></b></span></div><div class="rs-end"></div><p style="margin-top:8px"><button type="button" class="linkbtn q-reset">重新開始</button></p>`;
      const list=el.querySelector('.rs-list');
      IT.forEach((it,i)=>{ const yes=it.seller?'接受加回':'做此扣除', no=it.seller?'拒絕':'忽略';
        const d=E('div','rs-i',`<h5>${i+1}. ${it.t}</h5><div class="rs-b"><button type="button" class="btn small ghost" data-c="y">${yes}</button><button type="button" class="btn small ghost" data-c="n">${no}</button></div><div class="rs-v" hidden></div>`); list.appendChild(d);
        const v=d.querySelector('.rs-v');
        const show=()=>{ const c=st[i]; if(!c) return; d.classList.add('done'); d.querySelectorAll('[data-c]').forEach(b=>{ b.disabled=true; if(b.dataset.c===c) b.classList.remove('ghost'); });
          const ok=(c==='y')===it.right; v.hidden=false; v.className='rs-v '+(ok?'ok':'no'); v.innerHTML=`<strong>${ok?'同意。':'買方會有不同看法。'}</strong> ${it.why}`; };
        d.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{ st[i]=b.dataset.c; ctx.save(); show(); upd(); }); show(); });
      function upd(){ const e=BASE+IT.reduce((t,it,i)=>t+(st[i]==='y'?it.v:0),0), n=IT.filter((it,i)=>st[i]).length;
        el.querySelector('.q-e').textContent='$'+Math.round(e*100).toLocaleString('en-US')+'萬'; el.querySelector('.q-v').textContent='$'+Math.round(e*X*100).toLocaleString('en-US')+'萬';
        const end=el.querySelector('.rs-end'); if(n<IT.length){ end.innerHTML=''; return; }
        const right=IT.filter((it,i)=>(st[i]==='y')===it.right).length; const fair=BASE+IT.filter(it=>it.right).reduce((t,it)=>t+it.v,0);
        end.innerHTML=`<div class="msg ${right===IT.length?'good':'warn'}" style="margin-top:12px"><strong>你的判斷有${right}／${IT.length}項與審慎的買方一致。</strong>買方大概會接受約<strong>$${fair.toFixed(2)}m</strong>的EBITDA，相對於賣方的$1,350萬：以9×計，價格差距約<strong>$${((13.5-fair)*X).toFixed(1)}m</strong>。自行先做盈餘品質報告的賣方會先發現這些落差，並在買方發現之前修正或說明。</div>`; }
      el.querySelector('.q-reset').onclick=()=>{ Object.keys(st).forEach(k=>delete st[k]); ctx.save(); BW.go(ctx.mod.id,ctx.mod.sections.indexOf(ctx.sec)); };
      upd();
    })
  ]},
  /* ---------------------------------------------------------------- 4 */
  {id:'ready', label:'做好準備', kind:'learn', title:'做好準備：之前的三年', blocks:[
    `<p>準備最充分的公司，增資或出售的條件更好、速度更快，因為買方信任他們看到的東西。準備要花好幾年，不是幾個月。按<strong>播放</strong>。</p>`,
    {t:'fig', title:'三年做到投資人就緒', intro:'按<strong>播放</strong>逐步走過時間軸。',
      steps:[
        {k:['n0'],t:'<strong>前三年。</strong>依投資人期待的準則（通常是完整IFRS）編製經查核的財務報表，並連續三年一致。乾淨的集團架構：每家公司都由應有的主體持有，與老闆之間的關係人交易已終止或改為市場條件（第27單元）。'},
        {k:['n0','e0','n1'],t:'<strong>前兩年。</strong>約在第10個工作天完成集團月報（第25單元）、能夠達成的預算、KPI歷史資料、與主要客戶、經銷商及供應商的書面合約、法規文件與許可齊備，以及包含移轉訂價在內的稅務健檢（第24單元）。'},
        {k:['n1','e1','n2'],t:'<strong>前一年。</strong>堅強的財務團隊與財務長；一兩位獨立董事；自行完成的盈餘品質與法律檢視（「賣方盡職調查」）；備齊買方會要的每份文件的資料室；以及清楚說明成長從何而來的故事。'},
        {k:['n2','e2','n3'],t:'<strong>交易。</strong>先簽意向書，接著是買方會計師、律師與技術專家數週的盡職調查，然後談判買賣合約。整個過程中業績必須持續達成預測：交易進行中有一個月沒達標，就會損及價值。'},
        {k:['n3','e3','n4'],t:'<strong>交易之後。</strong>業績連動價款目標、對投資人的報告、董事會會議與新的節奏。買賣合約中的許多承諾，在第一年就會受到檢驗。'}],
      draw:BW.viz.flow({label:'前三年、前兩年、前一年、交易、交易之後。',labels:['','','','',''],edgeK:['e0','e1','e2','e3'],
        nodes:[{t:'第−3年',s:'經查核財報、乾淨架構',k:'n0'},{t:'第−2年',s:'報告、合約、稅務健檢',k:'n1'},{t:'第−1年',s:'團隊、自行盡職調查、資料室',k:'n2'},{t:'交易',s:'盡職調查、買賣合約',k:'n3'},{t:'之後',s:'業績連動價款、投資人報告',k:'n4'}]})},
    Q('哪一項準備工作最常保住價格？',['一份精美的簡報','在買方到來之前自行完成盈餘品質與法律檢視，讓問題先被修正或說明','聘請最貴的投資銀行','把壞消息壓到簽約之後'],1,'被買方發現的意外會砍價，甚至讓交易告吹。自己發現的問題則可以修正或妥善說明。')
  ]},
  /* ---------------------------------------------------------------- 5 */
  {id:'deal', label:'交易條款', kind:'learn', title:'價格談定後仍會影響金額的交易條款', blocks:[
    `<p>帳面上的價格只是起點。這些條款決定賣方實際能留下多少。</p>`,
    {t:'tbl', head:['條款','意義','注意事項'], rows:[
      ['<strong>鎖箱機制</strong>','價格以過去某一資產負債表日固定；買方取得自該日起的利益，賣方承諾不會有現金「外溢」給他們','簡單且確定，但鎖箱日後付給賣方的每一筆款項都必須在合約中明訂允許'],
      ['<strong>交割日結算帳目</strong>','交易後依交割日實際的負債、現金與營運資金調整價格','對交割日結算帳目編製方式的爭議'],
      ['<strong>營運資金基準值</strong>','事業交接時必須具備的「正常」營運資金','基準值訂得太高，會悄悄砍掉價格'],
      ['<strong>業績連動價款</strong>','部分價款在達成目標後才支付','新東家能影響的目標；務必精確定義'],
      ['<strong>價金保管或保留價款</strong>','保留部分價款以支應求償','金額多少、保留多久、何種條件下釋放'],
      ['<strong>聲明保證與補償條款</strong>','賣方對事業所做的承諾，以及承諾不實時的補償','事先揭露問題；聲明保證保險可涵蓋部分求償']
    ]},
    Q('一項業績連動價款約定：若集團EBITDA在兩年內達到$1,500萬，賣方可再多拿$1,000萬。對賣方最大的風險是什麼？',[
      '這筆款項的稅','出售後由買方掌控成本、定價與投資，能左右目標是否達成','款項金額太大','利率'],1,
      '要明確約定EBITDA如何衡量、買方可以與不可以改變什麼，以及事業被合併或重組時如何處理。')
  ]},
  /* ---------------------------------------------------------------- 6 */
  {id:'ipo', label:'上市', kind:'learn', title:'股票上市：會改變什麼', blocks:[
    `<p>上市（首次公開發行，IPO）向眾多投資人募資，並為股份創造交易市場。它也會永久改變公司的經營方式。</p>`,
    {t:'tbl', head:['上市前','上市後'], rows:[
      ['財務報表一年查核一次','期中與年度報告須在嚴格期限內完成；部分市場要求季報'],
      ['想分享消息時才分享','影響股價的重大訊息須即時、同時向所有人揭露'],
      ['由老闆與朋友組成的董事會','獨立董事、功能性委員會與公司治理守則'],
      ['老闆私下買賣股份','內線交易規範、禁止交易期間、董事持股異動揭露'],
      ['你認識的投資人','數以千計的股東、分析師與放空者細讀每一則附註']
    ]},
    K('選哪個交易所？',
      `<p>每個交易所，例如馬尼拉的菲律賓證券交易所、新加坡交易所、香港交易所或紐約的Nasdaq，對營運紀錄、獲利、公眾持股比例與治理都有各自的規定。選擇取決於你的投資人與同業在哪裡上市，以及哪裡的分析師懂醫療器材。顧問可以幫你比較；提前兩到三年開始討論。</p>`),
    Q('為什麼投資人在上市前會如此嚴格檢視「調整後」指標與關係人交易？',[
      '只因為主管機關要求','它們顯示經營階層是否誠實報告，以及是否為全體股東而非只為創辦人經營公司','調整後指標一定是錯的','關係人交易是違法的'],1,
      '上市時你賣的資產就是可信度。美化的指標與自肥交易會摧毀它。')
  ]},
  /* ---------------------------------------------------------------- 7 */
  {id:'case', label:'個案：投資條件書', kind:'case', title:'私募股權的投資條件書', blocks:[
    CASE('桌上的一份提案',
      `<p>一家私募股權基金提議以<strong>$3,000萬取得BraceWorks Group 40%股權</strong>，用以支應越南工廠與兩件收購。依此帳面價格，投資後估值為$7,500萬（投資前為$4,500萬）。投資條件書還包括：五席董事中的兩席；對預算、超過$500萬的借款、收購與高階人事的否決權；<strong>2倍清算優先權</strong>（出售時基金先拿回兩倍投資金額，創辦人才能分到錢）；以及若五年後尚未退場，有權強制出售整家公司。</p>`),
    Q('哪些條款最值得用力談判？',[
      {text:'只有價格', why:'價格重要，但其他條款可能移轉遠更多的價值與控制權。'},
      {text:'2倍清算優先權與強制出售權：在一般規模的出售中，創辦人可能拿到遠少於60%的價款，還失去退場時機的主導權'},
      {text:'董事席次的數量', why:'持股40%的投資人取得五席中的兩席很正常。經濟條款更重要。'},
      {text:'對預算的否決權', why:'以這樣的持股比例而言很常見；可要求在業績達標時失效。'}],1,
      '在2倍優先權下，若以$9,000萬出售，基金先拿$6,000萬，只剩$3,000萬給持股60%的創辦人（這是不參與分配型優先權的情況；若為參與分配型，基金還會再拿走剩下$3,000萬中的40%）。應爭取1倍不參與分配型優先權，以及期限更長、且出售程序須經創辦人同意的退場權。')
  ]},
  /* ---------------------------------------------------------------- 8 */
  {id:'quiz', label:'測驗', kind:'quiz', title:'檢驗你的理解', blocks:[
    Q('一位投資人以$6,000萬的投資前估值投入$2,000萬。它持有多少股權？',['20%','25%','33%','40%'],1,'$2,000萬 ÷ ($6,000萬 + $2,000萬) = 25%。'),
    Q('企業價值$1.1億、淨負債$1,800萬、租賃負債$400萬。不考慮其他項目，股權價值是多少？',['$1.1億','$9,200萬','$8,800萬','$1.32億'],2,'$1.1億 − $1,800萬 − $400萬 = $8,800萬。'),
    Q('買方最可能拒絕哪一項加回？',['已結束的一次性訴訟律師費','五年內有三次現場矯正行動的醫材廠的回收成本','出售時離職的家族成員薪資','出售流程本身的成本'],1,'反覆發生的「一次性」項目是正常盈餘的一部分。'),
    Q('在鎖箱機制交易中，鎖箱日後賣方必須避免什麼？',['做生意銷貨','除約定事項外從公司拿走現金（外溢）','聘人','付款給供應商'],1,'價格固定在鎖箱日，因此之後流出公司的價值就是「外溢」。'),
    Q('為什麼要提前一年準備資料室並自行做盡職調查？',['買方要求一年','讓問題在買方發現之前被找出、修正或說明','可以節稅','可以取代查核'],1,'準備能保住價格與速度。')
  ]},
  /* ---------------------------------------------------------------- 9 */
  {id:'apply', label:'練習', kind:'apply', title:'你的集團準備好迎接投資人了嗎？', blocks:[
    `<p>選讀。勾選內容只儲存在這個瀏覽器中。</p>`,
    CHECK('m28-ready','我們能向投資人展示……',[
      '依他們期待的準則編製、連續三年經查核的財務報表',
      '乾淨的集團架構，關係人交易已終止或採市場條件',
      '約在第10天完成的集團月報，以及曾經達成的預算',
      '我們自己的調整後EBITDA，每一項調整都有說明與佐證',
      '類負債項目清單：租賃、退休義務、未繳稅款、遞延付款',
      '與主要客戶、經銷商及供應商的書面合約，以及齊備的法規許可',
      '經得起投資人提問的財務團隊與董事會'
    ]),
    REPORT('你的週一早晨提問',
      `<p>問：<strong>「如果買方的會計師下個月就來，他們會調整我們EBITDA中的哪些項目，又會把什麼當成負債扣除？」</strong>在你需要這筆錢之前先把它們處理好。</p>`),
    K('重點回顧',
      `<ul>
        <li>每一種資金來源都有附帶條件；讀控制權條款要像看價格一樣仔細。</li>
        <li>更大事業的一小部分可能更值錢，但要知道哪些決策你仍能自己做主。</li>
        <li>企業價值減去負債與類負債項目，再依營運資金調整，就是賣方拿到的金額。</li>
        <li>買方會把盈餘常態化；反覆出現的「一次性」項目與計畫中的節省都過不了關。</li>
        <li>做到投資人就緒約需三年：經查核的財報、乾淨的架構、可靠的報告、可信的指標。</li>
       </ul>`)
  ]}
  ],
  warnings:[
    {sign:'「調整後EBITDA」遠高於帳列數，且每年都是同樣的加回項目', meaning:'買方會把它們沖回；價格期待過高。', look:'加回項目的歷史與佐證。'},
    {sign:'與老闆之間以非市場條件進行的關係人交易', meaning:'買方會調整盈餘並質疑公司治理。', look:'關係人清單與合約。'},
    {sign:'投資條件書含高倍數清算優先權或強制出售權', meaning:'創辦人拿到的可能遠少於持股比例所顯示的。', look:'不同出售價格下的價款分配順序（waterfall）。'},
    {sign:'出售前夕營運資金被壓低', meaning:'價格會透過基準值等額下降。', look:'過去12–24個月的正常營運資金。'}
  ],
  formulas:[
    {name:'投資人持股比例', f:'投入金額 ÷（投資前估值 ＋ 投入金額）', ex:'$2,000萬 ÷ ($6,000萬 + $2,000萬) = 25%'},
    {name:'股權價值', f:'企業價值 − 淨負債 − 類負債項目 ±（營運資金 − 基準值）', ex:'$1.098億 − $1,800萬 − $750萬 − $200萬 = $8,230萬'}
  ],
  glossary:[
    {term:'投資前估值（Pre-money valuation）', def:'新投資進來之前公司議定的價值；加上投資金額即為投資後估值。'},
    {term:'稀釋（Dilution）', def:'發行新股給投資人時，原股東持股比例的下降。'},
    {term:'盈餘品質（Quality of earnings）', def:'會計師對一家企業在正常年度實際盈利能力的檢視，逐項測試對帳列利益的每一項調整。'},
    {term:'類負債項目（Debt-like items）', def:'買方像負債一樣從企業價值中扣除的義務：租賃、未繳稅款、未提撥的退休義務、遞延付款。'},
    {term:'營運資金基準值（Working capital peg）', def:'出售時事業交接必須具備的正常營運資金水準；差額會調整價格。'},
    {term:'鎖箱機制（Locked box）', def:'價格以過去某一資產負債表固定，賣方承諾此後不會有價值外溢給他們的交易方式。'},
    {term:'業績連動價款（Earn-out）', def:'只有在達成約定目標時才於日後支付的部分出售價款。'},
    {term:'清算優先權（Liquidation preference）', def:'投資人在出售時，於其他股東分到任何款項前，先拿回其投資金額一定倍數的權利。'},
    {term:'資料室（Data room）', def:'存放買方或投資人在盡職調查中會審閱之所有文件的安全線上資料夾。'},
    {term:'首次公開發行（Initial public offering, IPO）', def:'公司首次向大眾出售股份，並在證券交易所掛牌。'}
  ]
});
})();
