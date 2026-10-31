/* ===== Module 20: Funding and value ===== */
(function(){
const {K,TIP,FLAG,CASE,REPORT,Q,FS,FLIP,SORT,CHECK,W,PACK,money,signed,pct,kfmt} = BW.h;

BW.add({
  id:'m20', minutes:45,
  title:'籌資與企業價值',
  subtitle:'BraceWorks營運與成長的資金從哪裡來、實際成本是多少、靠自己能成長多快，以及公司值多少錢。',
  goals:[
    '比較主要的資金來源，並與資金需求配對',
    '估算公司能安全承擔多少負債',
    '計算資金成本，判斷公司是否在創造價值',
    '運用可持續成長率規劃成長與股利',
    '說明是什麼在驅動一家小型製造商的價值'
  ],
  sections:[
  {id:'sources', label:'資金從哪裡來', kind:'learn', title:'資金來源選單', blocks:[
    `<p>BraceWorks的每一塊錢都有來處：留在公司裡的利潤、供應商、銀行，或是股東。每種來源的成本不同、風險不同，附帶的條件也不同。</p>`,
    {t:'tbl', head:['來源','最適合','成本','附帶條件'], rows:[
      ['<strong>留在公司裡的利潤</strong>','穩定成長、設備','沒有利息，但股東期待這筆錢有報酬','可發放股利的現金變少'],
      ['<strong>供應商信用</strong>','材料','準時付款就不用成本','拖得太久會失去商譽（第16單元）'],
      ['<strong>透支或營運週轉額度</strong>','存貨與應收帳款的波動','利息，通常為浮動利率','每年續約；可能在你最需要時被砍'],
      ['<strong>應收帳款融資</strong>','快速成長的應收帳款','利息加手續費','客戶可能會知道；與發票品質掛鉤'],
      ['<strong>中長期貸款或租賃</strong>','機器、廠房裝修','固定或浮動利率','財務承諾條款、擔保品、還款時程'],
      ['<strong>股東借款</strong>','填補資金缺口','雙方約定的條件','必須有書面文件；清償順位在銀行之後'],
      ['<strong>新增權益資金</strong>','大型擴張、新廠','最昂貴：投資人期待高報酬','讓出部分所有權與部分控制權'],
      ['<strong>政府或出口信用方案</strong>','出口商、新市場','常有補貼','資格規定與文書作業']
    ]},
    {t:'fig', title:'負債較便宜；權益較安全', draw:function(w){
      const P=BW.viz.p, items=['供應商信用','銀行透支','中長期貸款或租賃','股東借款','新增權益資金'];
      let g='';
      if(w>=560){ const x0=50,x1=w-50,y=66,st=(x1-x0)/(items.length-1);
        g+=P.arrow((x0+x1)/2,y,x0-30,y,{cls:'acc'})+P.arrow((x0+x1)/2,y,x1+30,y);
        items.forEach((m,i)=>{ const x=x0+i*st, up=i%2===0; g+=`<circle cx="${P.f(x)}" cy="${y}" r="7" class="v-f-s1"/>`+P.lines(x,up?y-24:y+26,P.wrap(m,14),'v-s','middle',13); });
        g+=P.lines(x0-30,y+64,['較便宜，但必須準時','償還：你的風險較高'],'v-l','start',13)+P.lines(x1+30,y+64,['成本較高，但沒有固定','還款：你的風險較低'],'v-l','end',13);
        return P.svg(w,160,'資金來源由較便宜但風險較高的負債，排到成本較高但較安全的權益。',g); }
      const x=26,y0=34,st=50; g+=P.txt(x-10,14,'較便宜，你的風險較高','v-l','start')+P.arrow(x,y0+((items.length-1)*st)/2,x,y0-8,{cls:'acc'})+P.arrow(x,y0+((items.length-1)*st)/2,x,y0+(items.length-1)*st+10);
      items.forEach((m,i)=>{ const y=y0+i*st; g+=`<circle cx="${x}" cy="${P.f(y)}" r="7" class="v-f-s1"/>`+P.txt(x+18,y+5,m,'v-s','start'); });
      g+=P.txt(x-10,y0+(items.length-1)*st+30,'成本較高，你的風險較低','v-l','start');
      return P.svg(w,y0+(items.length-1)*st+38,'資金來源由較便宜但風險較高的負債，排到成本較高但較安全的權益。',g);
    }, caption:'負債成本較低，因為債權人優先受償，而且利息通常可以抵稅。但無論發生什麼事都必須償還。權益成本較高，因為股東承擔風險，只有公司經營得好才拿得到報酬。'},
    K('讓資金與需求相配',
      `<p>短期需求（存貨、應收帳款）適合短期資金。長期資產（機器、新產線）適合長期資金：中長期貸款、租賃或權益。用透支來買機器是最常見的錯誤，而這正是第5單元中讓BraceWorks資金吃緊的原因。</p>`)
  ]},
  {id:'capacity', label:'能借多少？', kind:'play', title:'BraceWorks能承擔多少負債？', blocks:[
    `<p>銀行核定貸款額度主要看兩項測試：負債相當於幾年的EBITDA，以及營業現金是否足以輕鬆支應利息與還款。在開口之前，你可以自己先跑一遍同樣的測試。</p>`,
    W('舉債能力檢查', function(el, ctx){
      const {money}=ctx.h; const top=document.createElement('div'), out=document.createElement('div'); el.append(top,out);
      ctx.ui.sliders(top,[
        {k:'ebitda',label:'EBITDA',min:60000,max:250000,step:2000,v:132000,f:money},
        {k:'lim',label:'你自訂的上限：淨負債 ÷ EBITDA',min:1,max:3.5,step:0.25,v:2,f:x=>x.toFixed(2)+'×'},
        {k:'nd',label:'目前淨負債',min:0,max:400000,step:5000,v:178000,f:money},
        {k:'rate',label:'利率',min:3,max:14,step:0.5,v:6.5,f:x=>x+'%'},
        {k:'yrs',label:'新借款的還款年數',min:2,max:10,step:1,v:5,f:x=>x+' 年'}
      ],v=>{
        const capTotal=v.ebitda*v.lim, room=Math.max(0,capTotal-v.nd);
        const interest=capTotal*v.rate/100, service=interest+room/v.yrs, fcf=v.ebitda*0.75;
        const dscr=fcf/service;
        out.innerHTML=`<div class="stats">${ctx.ui.stat('在你的上限下最多可有的淨負債',money(Math.round(capTotal)))}${ctx.ui.stat('還能再借的空間',money(Math.round(room)),room<20000?'warn':'good')}${ctx.ui.stat('上限下的利息保障倍數（EBITDA ÷ 利息）',(v.ebitda/Math.max(1,interest)).toFixed(1)+'×',v.ebitda/interest<4?'bad':'good')}${ctx.ui.stat('可用現金 ÷ 每年還本付息',dscr.toFixed(2)+'×',dscr<1.25?'bad':dscr<1.6?'warn':'good','銀行希望在1.25×以上')}</div>`+
          ctx.ui.bars([{label:'目前淨負債',v:v.nd,tone:'blue'},{label:'還能再借的空間',v:Math.round(room),tone:'good'},{label:'你的上限',v:Math.round(capTotal),tone:'muted'}],{max:Math.max(capTotal,v.nd)})+
          `<p class="w-hint" style="margin-top:10px">${room===0?'BraceWorks已達到或超過你的上限。要成長就得靠利潤、更快收款，或是權益資金。':dscr<1.25?'比率說可以，但現金流量說不行：還款會吃掉公司產生的太多現金。少借一點，或拉長還款年數。':'兩項測試都通過。別忘了銀行的財務承諾條款（第17單元）可能比你自訂的上限更嚴。'} 可用現金估計為EBITDA的75%，已扣除稅金與例行設備支出。</p>`;
      },ctx.uid);
    }),
    K('自訂上限要低於銀行的標準',
      `<p>如果財務承諾條款是2.5×，就把公司控制在2.0×以下。這段差距就是你的安全邊際，用來應付一季表現不佳、客戶延遲付款或匯率波動。從不需要申請豁免財務承諾條款的公司，最受債權人信任。</p>`)
  ]},
  {id:'cost', label:'資金成本', kind:'play', title:'BraceWorks的資金成本是多少？', blocks:[
    `<p>BraceWorks使用兩種長期資金：銀行借款與股東的權益。各有其成本：</p>
     <ul>
      <li><strong>負債資金成本：</strong>利率，扣除因利息可抵稅而省下的稅。6.4% × (1 − 25%) = <strong>4.8%</strong>。</li>
      <li><strong>權益資金成本：</strong>股東把錢投到其他風險相當的地方，可合理期待的報酬。小型未上市製造商常見的數字約在百分之十五上下。這裡用<strong>14%</strong>。</li>
     </ul>
     <p>依BraceWorks各自使用的金額加權（負債$220,000、權益$491,500），得出<span class="term">加權平均資金成本</span>（WACC）約為<strong>11%</strong>。</p>`,
    W('資金成本與經濟利潤', function(el, ctx){
      const {money,pct}=ctx.h; const top=document.createElement('div'), out=document.createElement('div'); el.append(top,out);
      ctx.ui.sliders(top,[
        {k:'r',label:'借款利率',min:3,max:14,step:0.1,v:6.4,f:x=>x.toFixed(1)+'%'},
        {k:'t',label:'稅率',min:0,max:30,step:1,v:25,f:x=>x+'%'},
        {k:'ke',label:'股東要求報酬率（權益資金成本）',min:8,max:25,step:0.5,v:14,f:x=>x+'%'},
        {k:'wd',label:'負債占資金比重',min:0,max:70,step:1,v:31,f:x=>x+'%'},
        {k:'roce',label:'已動用資本報酬率',min:0,max:30,step:0.1,v:15.9,f:x=>x.toFixed(1)+'%'}
      ],v=>{
        const kd=v.r*(1-v.t/100), wacc=(v.wd/100)*kd+(1-v.wd/100)*v.ke, ep=(v.roce-wacc)/100*591500;
        out.innerHTML=`<div class="stats">${ctx.ui.stat('稅後負債資金成本',kd.toFixed(1)+'%')}${ctx.ui.stat('WACC',wacc.toFixed(1)+'%')}${ctx.ui.stat('資本報酬率',v.roce.toFixed(1)+'%',v.roce>wacc?'good':'bad')}${ctx.ui.stat('經濟利潤',money(Math.round(ep)),ep>0?'good':'bad','(ROCE − WACC) × $591,500 資本')}</div>
        <p class="w-hint" style="margin-top:10px">${ep>0?`BraceWorks的資本報酬比資本成本高出${(v.roce-wacc).toFixed(1)}個百分點：它正在為股東創造價值。`:'資本報酬率低於資金成本。帳面利潤也許是正的，但股東把錢放在別處會更好。'} 增加負債在一定程度內能降低WACC，但會提高風險：把負債比重往上拉時，記得想想財務承諾條款。</p>`;
      },ctx.uid);
    }),
    K('與其他單元的關聯',
      `<ul>
        <li><strong>投資決策（第14單元）：</strong>折現率至少要等於WACC。用11%計算，布料裁切機的NPV約為+$56,000，而用10%時為+$61,300：仍然明確值得投資。</li>
        <li><strong>經濟利潤：</strong>扣除<em>所有</em>使用資本（包括股東的資本）的成本後的利潤。BraceWorks：(15.9% − 11.2%) × $591,500 ≈ 當年創造了<strong>$27,800</strong>的價值。</li>
       </ul>`)
  ]},
  {id:'growth', label:'成長與股利', kind:'play', title:'BraceWorks靠自己的錢能成長多快？', blocks:[
    `<p>成長需要更多存貨、更多應收帳款和更多設備（第5單元）。如果BraceWorks維持各項比率不變、也不再增加借款，它最快能成長的速度取決於保留了多少利潤：</p>
     <p class="num" style="font-weight:600">可持續成長率 = 權益報酬率 × 保留在公司的利潤比例</p>
     <p>BraceWorks：11.3% × 100%保留 = <strong>每年11.3%</strong>。若將一半發放為股利，就降到約5.6%。</p>`,
    W('股利與成長', function(el, ctx){
      const {money,pct}=ctx.h; const top=document.createElement('div'), out=document.createElement('div'); el.append(top,out);
      ctx.ui.sliders(top,[
        {k:'roe',label:'權益報酬率',min:4,max:25,step:0.1,v:11.3,f:x=>x.toFixed(1)+'%'},
        {k:'pay',label:'發放為股利的利潤比例',min:0,max:100,step:5,v:0,f:x=>x+'%'},
        {k:'plan',label:'你規劃的成長率',min:0,max:40,step:1,v:15,f:x=>x+'%'}
      ],v=>{
        const g=v.roe*(1-v.pay/100), gap=v.plan-g;
        out.innerHTML=`<div class="stats">${ctx.ui.stat('可持續成長率','每年 '+g.toFixed(1)+'%')}${ctx.ui.stat('規劃成長率',v.plan+'%',gap>0?'warn':'good')}${ctx.ui.stat('第一年需要的額外資金',gap>0?money(Math.round(gap/100*591500)):'$0',gap>0?'bad':'good','約略估算：成長缺口 × $591,500 已動用資本')}</div>`+
          ctx.ui.bars([{label:'可持續成長率',v:g,tone:'good'},{label:'規劃成長率',v:v.plan,tone:gap>0?'bad':'blue'}],{fmt:x=>x.toFixed(1)+'%',max:Math.max(v.plan,g,1)})+
          `<p class="w-hint" style="margin-top:10px">${gap>0?`成長速度超過${g.toFixed(1)}%就需要額外資金：增加借款、新增權益資金、降低股利，或加快現金循環（第16單元）。在簽約之前就決定要用哪一種。`:'只要比率維持不變，這個成長計畫可以靠保留的利潤來支應。'}</p>`;
      },ctx.uid);
    }),
    K('股利：先問這些問題',
      `<ul>
        <li><strong>有現金嗎？</strong>股利是用現金發放，不是用利潤。查看13週現金流量預測。</li>
        <li><strong>法律允許嗎？</strong>公司法通常只允許從累積盈餘發放股利，借款合約也可能加以限制。</li>
        <li><strong>成長計畫需要多少？</strong>每發出去一塊錢，就少一塊錢支應成長。</li>
        <li><strong>怎麼課稅？</strong>各國的股利稅制不同，而台灣的未分配盈餘加徵營利事業所得稅則是往反方向推（第19單元）。</li>
        <li><strong>薪資、股利還是借款？</strong>股東可以用不同方式取得報酬，稅務與法律效果各不相同。股東借款要留有書面文件（第18單元）。</li>
       </ul>`)
  ]},
  {id:'value', label:'公司值多少', kind:'play', title:'BraceWorks值多少錢？', blocks:[
    `<p>股東、買家和銀行遲早都會問這個問題。對小型未上市公司來說，最常用的捷徑是<span class="term">評價倍數</span>：</p>
     <ul>
      <li><strong>企業價值</strong> = EBITDA × 倍數。這是整個事業的價值，不論資金由誰提供。</li>
      <li><strong>股權價值</strong> = 企業價值 − 淨負債。這是股東持股的價值。</li>
     </ul>
     <p>小型未上市製造商的成交價通常落在EBITDA的中個位數倍。成長、利潤率越高、風險越低，倍數就越高；依賴單一客戶或依賴老闆本人，倍數就越低。更周全的方法是直接評估未來的現金流量，也就是把第14單元的NPV概念套用到整家公司。</p>`,
    W('評價試算', function(el, ctx){
      const {money}=ctx.h; const top=document.createElement('div'), tg=document.createElement('div'), out=document.createElement('div'); tg.className='seg'; el.append(top,tg,out);
      const F=[['conc','最大客戶占營收低於15%',0.4],['audit','乾淨的查核後財務報表與可靠的月度管理報告',0.4],['mgmt','不靠老闆也能經營的管理團隊',0.5],['cash','現金轉換率高於EBITDA的70%',0.3]];
      const on={}; let vals={};
      F.forEach(x=>{ const b=document.createElement('button'); b.type='button'; b.textContent='+ '+x[1]; b.setAttribute('aria-pressed','false'); b.onclick=()=>{ on[x[0]]=!on[x[0]]; b.setAttribute('aria-pressed',String(!!on[x[0]])); draw(); }; tg.appendChild(b); });
      function draw(){ const add=F.reduce((s,x)=>s+(on[x[0]]?x[2]:0),0), mult=vals.m+add, ev=vals.e*mult, eq=ev-vals.nd;
        out.innerHTML=ctx.ui.bridge([{label:'EBITDA × '+vals.m.toFixed(1)+'（基本倍數）',v:Math.round(vals.e*vals.m),total:true},{label:'風險降低：倍數 +'+add.toFixed(1)+'×',v:Math.round(vals.e*add)},{label:'企業價值',v:Math.round(ev),total:true},{label:'減：淨負債',v:-vals.nd},{label:'股權價值',v:Math.round(eq),total:true}],{fmt:kfmt})+
          `<div class="stats" style="margin-top:12px">${ctx.ui.stat('採用倍數',mult.toFixed(1)+'× EBITDA')}${ctx.ui.stat('股權價值',money(Math.round(eq)),eq>0?'good':'bad')}</div>
          <p class="w-hint" style="margin-top:10px">僅供說明：實際倍數取決於市場、買家和交易本身。重點在於什麼會影響價值：同樣的EBITDA，風險越低的公司越值錢。其中好幾項改善，正是本課程所教的內容。</p>`; }
      ctx.ui.sliders(top,[
        {k:'e',label:'EBITDA',min:60000,max:300000,step:2000,v:132000,f:money},
        {k:'m',label:'基本倍數',min:3,max:8,step:0.1,v:4.5,f:x=>x.toFixed(1)+'×'},
        {k:'nd',label:'淨負債',min:0,max:400000,step:5000,v:178000,f:money}
      ],v=>{vals=v;draw();},ctx.uid);
    }),
    K('價值是每個月累積出來的',
      `<p>更好的利潤率會提高EBITDA。更低的風險會提高倍數。更快收款會降低淨負債。三者都改善的總經理，所創造的價值可能比一場大型業績衝刺還多。而乾淨、可靠的數字本身就值錢：買家無法信任帳目時，會壓低價格，或乾脆走人。</p>`)
  ]},
  {id:'case', label:'個案：年底股利', kind:'case', title:'年底股利', blocks:[
    CASE('老闆要求發放$50,000',
      `<p>現在是12月初。老闆今年表現不錯，要求在聖誕節前發放<strong>$50,000股利</strong>。目前狀況如下：</p>
       <ul>
        <li>現金$42,000；透支已用$120,000，額度$150,000。</li>
        <li>淨負債對EBITDA比為1.35×。財務承諾條款是2.5×；你自訂的上限是2.0×。</li>
        <li>澳洲合約（第5單元）2月開始，即使已談到較好的付款條件，仍需先投入約$45,000的營運資金。</li>
        <li>1月和2月是銷售最淡的月份（第15單元）。</li>
       </ul>`),
    FS({title:'現在發放$50,000', cols:['發放前','發放後'], rows:[
      ['現金加未動用透支額度（可用額度餘裕）',[72000,22000]],
      ['淨負債',[178000,228000]],
      ['淨負債 ÷ EBITDA',['1.35×','1.73×']],
      ['支應澳洲合約後的可用額度餘裕',[27000,-23000],'total']
    ]}),
    Q('你會向老闆提出什麼建議？',[
      {text:'現在全額發放$50,000：今年表現很好', why:'在最淡的月份，可用額度餘裕會降到$22,000，而澳洲合約會讓BraceWorks現金用罄。'},
      {text:'今年完全不發股利', why:'公司有獲利，也在負債上限之內。沒有任何計畫就直接拒絕，會損害與老闆之間的信任。'},
      {text:'現在先發放較小金額的股利，其餘在第二季、合約所需資金已到位且預測確認仍有餘裕後再發放'},
      {text:'發放，並把供應商付款拉長到90天來支應', why:'用供應商的錢來發股利，正是第16單元警告過的模式。'}
    ],2,'例如現在發放$15,000，4月再發放最多$35,000，以13週現金流量預測為前提。老闆拿到報酬，公司維持在自訂上限內，成長合約也有資金支應。把數字攤給老闆看：看得到現金計畫時，老闆比較容易同意。'),
    K('要養成的習慣',
      `<p>每年和老闆議定一次股利政策，例如「最多發放利潤的40%，於年度結束後發放，前提是可用額度餘裕維持在$50,000以上，且淨負債低於EBITDA的2×」。這樣股利就不再讓任何人措手不及。</p>`)
  ]},
  {id:'quiz', label:'測驗', kind:'quiz', title:'檢驗你的理解', blocks:[
    Q('為什麼負債通常比權益便宜？',['銀行很大方','債權人優先受償，而且利息通常可以抵稅','權益沒有成本','負債永遠不必償還'],1,'債權人風險較低，加上節稅效果，使負債較便宜。但無論發生什麼事都必須償還。'),
    Q('BraceWorks的EBITDA為$132,000，自訂上限為淨負債對EBITDA 2.0×。淨負債為$178,000。在這個上限內還能再借多少？',['$264,000','$86,000','$178,000','完全不能'],1,'2.0 × $132,000 = 上限$264,000，減去目前的$178,000 = 還有$86,000的空間。'),
    Q('ROCE為15.9%，WACC為11.2%。這代表什麼？',['公司在虧損','公司的資本報酬高於資本成本：它在創造價值','WACC太低','沒有什麼意義'],1,'經濟利潤為正：在$591,500的資本上約為$27,800。'),
    Q('ROE為11.3%，公司把一半利潤發放為股利。它的可持續成長率是多少？',['11.3%','5.65%','22.6%','50%'],1,'11.3% × 50%保留 = 不需新資金下約每年5.6%。'),
    Q('兩家公司的EBITDA相同。哪一家應得到較高的倍數？',['有一個客戶買走40%產品的那家','客戶眾多、有查核後財務報表、而且有不靠老闆也能經營之團隊的那家','透支金額較大的那家','兩家價值完全相同'],1,'風險越低，倍數越高。'),
    Q('老闆要求發股利時，應該先看什麼？',['稅率','現金流量預測與可用額度餘裕、借款限制，以及成長計畫的現金需求','股價','會計師公費'],1,'股利是用現金發放的。確認公司負擔得起，並能維持在各項上限之內。')
  ]},
  {id:'apply', label:'練習', kind:'apply', title:'用練習包練習', blocks:[
    PACK('packB',6,'練習包B，第6頁：資產負債表與現金流量'),
    Q('練習包B的儀表板顯示淨負債對EBITDA比為1.2×。淨負債約$154,000。EBITDA約$132,000、自訂上限2.0×，大約還有多少空間可以借錢買布料裁切機？',['約$110,000','約$20,000','約$264,000','沒有'],0,'2.0 × $132,000 = $264,000，減去$154,000 = 約$110,000。為裁切機借$60,000綽綽有餘。'),
    PACK('packC',6,'練習包C，第6頁：財務承諾條款'),
    Q('7月時（練習包C），老闆以「利潤超前預算」為由要求發放股利。說「現在不行」最有力的理由是什麼？',['財務承諾條款未通過','13週現金流量預測顯示第2週和第4週流動性低於零','利潤落後預算','稅務'],1,'財務承諾條款通過了，但現金不夠。發股利只會讓資金緊縮更嚴重。'),
    {t:'html',html:'<h3>日後，在你自己的公司</h3><p class="small" style="color:var(--muted)">選讀。勾選紀錄只會儲存在這個瀏覽器中。</p>'},
    CHECK('m20-fund','在我的公司⋯⋯',[
      '長期資產用長期資金（中長期貸款、租賃、權益）支應，而不是用透支',
      '我們有自訂的負債上限，且低於銀行的財務承諾條款',
      '我大致知道我們的資金成本，並在投資決策中至少使用這個比率',
      '成長計畫會對照利潤所能支應的成長速度來檢查',
      '與股東之間有議定的股利政策',
      '股東借款與付給股東的款項都有書面文件',
      '我知道是什麼在驅動公司的價值，以及哪些風險會降低價值'
    ]),
    K('重點整理',
      `<ul>
        <li>負債較便宜但必須償還；權益成本較高但沒有固定還款。讓資金與需求相配。</li>
        <li>用兩項測試估算負債規模：淨負債 ÷ EBITDA，以及可用現金 ÷ 還本付息。自訂上限要低於銀行的標準。</li>
        <li>WACC是門檻：資本報酬高於它，才是在創造價值。</li>
        <li>可持續成長率 = ROE × 保留的利潤比例。成長更快就需要額外資金。</li>
        <li>價值 = EBITDA × 倍數（風險越低倍數越高），再減去淨負債。</li>
       </ul>`)
  ]}
  ],
  warnings:[
    {sign:'規劃成長率高於可持續成長率，卻沒有資金計畫', meaning:'過度擴張營業的風險：公司會缺現金。', look:'可持續成長率與計畫的比較；事先議定的資金選項。'},
    {sign:'淨負債超過自訂上限，或接近財務承諾條款', meaning:'幾乎沒有餘地應付一季表現不佳；銀行可能收緊條件。', look:'淨負債 ÷ EBITDA的趨勢與預測。'},
    {sign:'資本報酬率低於資金成本', meaning:'即使帳上有利潤，公司仍在摧毀價值。', look:'ROCE與WACC的比較；低報酬的產品、客戶或資產。'},
    {sign:'未確認現金就發放股利', meaning:'股利靠透支或拖延供應商付款來支應。', look:'13週現金流量預測與付款日的可用額度餘裕。'}
  ],
  formulas:[
    {name:'稅後負債資金成本', f:'利率 × (1 − 稅率)', ex:'6.4% × (1 − 25%) = 4.8%'},
    {name:'WACC', f:'(負債比重 × 稅後負債資金成本) + (權益比重 × 權益資金成本)', ex:'31% × 4.8% + 69% × 14% = 11.2%'},
    {name:'經濟利潤', f:'(ROCE − WACC) × 已動用資本', ex:'(15.9% − 11.2%) × $591,500 = $27,800'},
    {name:'可持續成長率', f:'ROE × 保留在公司的利潤比例', ex:'11.3% × 100% = 每年11.3%'},
    {name:'舉債能力', f:'EBITDA × 你的上限（淨負債 ÷ EBITDA）− 目前淨負債', ex:'$132,000 × 2.0 − $178,000 = $86,000'},
    {name:'股權價值', f:'EBITDA × 倍數 − 淨負債', ex:'$132,000 × 4.5 − $178,000 = $416,000'}
  ],
  glossary:[
    {term:'負債資金成本（Cost of debt）', def:'借款的利率，通常以扣除利息節稅效果後的數字表示。'},
    {term:'權益資金成本（Cost of equity）', def:'股東把錢投到其他風險相同的地方，可合理期待的報酬。'},
    {term:'加權平均資金成本（Weighted average cost of capital, WACC）', def:'公司所使用全部長期資金的平均成本，依各類資金的金額加權計算。'},
    {term:'經濟利潤（Economic profit）', def:'扣除所有使用資本（包括股東的資本）的成本後的利潤。為正數代表正在創造價值。'},
    {term:'可持續成長率（Sustainable growth rate）', def:'在各項比率不變的情況下，公司不需新資金所能達到的最快成長速度：ROE × 保留的利潤比例。'},
    {term:'股利發放率（Payout ratio）', def:'以股利形式發放的利潤比例。'},
    {term:'舉債能力（Debt capacity）', def:'公司在維持自訂上限與通過債權人測試的前提下，能借入的金額。'},
    {term:'還本付息（Debt service）', def:'某一期間內借款應付的利息與還款。'},
    {term:'負債比率（Gearing）', def:'公司資金中由負債而非權益提供的程度。又稱財務槓桿。'},
    {term:'企業價值（Enterprise value）', def:'整個事業在扣除負債前的價值。常以EBITDA × 倍數估算。'},
    {term:'股權價值（Equity value）', def:'企業價值減去淨負債：股東持股的價值。'},
    {term:'評價倍數（Valuation multiple）', def:'用來評估企業價值的經驗比率，例如若干年的EBITDA。'},
    {term:'現金流量折現法（Discounted cash flow, DCF）', def:'將企業或專案預期的未來現金流量折現到今天，以評估其價值。'},
    {term:'個人保證（Personal guarantee）', def:'股東承諾在公司無法償還時，以個人身分償還公司借款。'},
    {term:'股東借款（Owner loan）', def:'股東借給公司的資金，依約定條件償還。'},
    {term:'出口信用機構（Export credit agency）', def:'由政府支持、提供貸款、保證或保險以協助出口商的機構。'}
  ]
});
})();
