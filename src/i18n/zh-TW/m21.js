/* ===== Module 22 (file m21): Reading real annual reports ===== */
(function(){
const {K,TIP,FLAG,CASE,REPORT,Q,FS,FLIP,SORT,CHECK,W,money,signed,pct,kfmt} = BW.h;

/* ---------- sources (opened by the learner) ---------- */
const SRC={
  arjoAR:'https://www.arjo.com/siteassets/01-about-us/investors/2025/annual-report-2024/final-version/arjo_ahr24_eng_final.pdf',
  arjoQ4:'https://www.arjo.com/siteassets/01-about-us/investors/2025/q4-2024/arjo_q4_2024_eng_final.pdf',
  emblaAR:'https://media.ossur.com/image/upload/documents/corporate/Quarterly%20Reports/2024/2024%20Annual%20Report.pdf',
  emblaQ4:'https://mb.cision.com/Main/18404/4100604/3246107.pdf',
  ivc21:'https://www.sec.gov/Archives/edgar/data/742112/000074211222000012/0000742112-22-000012-index.html',
  ivc22:'https://www.sec.gov/Archives/edgar/data/742112/000074211223000036/0000742112-23-000036-index.html'
};
const link=(href,label)=>`<a class="btn ghost small" href="${href}" target="_blank" rel="noopener noreferrer">${label} ↗</a>`;

/* ---------- the report hunt: find a number, type it, get it checked ---------- */
function hunt(id,title,tasks,rid){
  const pg=p=>{ const r=(BW.reports||{})[rid]; const x=r&&r.pages.find(q=>q.id===p); return x?x.title:p; };
  return W(title,function(el,ctx){
    const S=ctx.state; S.hunt=S.hunt||{}; const st=S.hunt[id]=S.hunt[id]||{};
    el.innerHTML=`<div class="hunt-top"><span class="hunt-score small"></span><button type="button" class="linkbtn hunt-reset">重新開始</button></div><ol class="hunt">${tasks.map((t,i)=>`<li class="hunt-i" data-i="${i}">
      <div class="hunt-q">${t.q}</div>
      <div class="hunt-row"><input class="hunt-in" type="text" inputmode="decimal" autocomplete="off" id="${ctx.uid('h'+i)}" aria-label="第 ${i+1} 題的答案"><span class="hunt-u">${t.unit||''}</span><button type="button" class="btn small" data-c>檢查</button><button type="button" class="linkbtn" data-h>去哪裡找</button></div>
      <div class="hunt-hint small" hidden>${t.where}${t.page&&rid?` ${BW.reportBtn(rid,t.page,'開啟：'+pg(t.page),'linkbtn')}`:''}</div><div class="hunt-fb" hidden></div></li>`).join('')}</ol>`;
    const score=el.querySelector('.hunt-score');
    const upd=()=>{ const n=tasks.filter((t,i)=>st[i]&&st[i].ok).length, sh=tasks.filter((t,i)=>st[i]&&st[i].shown&&!st[i].ok).length; score.textContent=`已找到 ${n}／${tasks.length} 題${sh?`・已顯示 ${sh} 題答案`:''}`; };
    const parse=s=>{ let x=String(s).trim().replace(/^\((.*)\)$/,'-$1').replace(/sek|usd|us\$|\$|%|×|x|m\b|,|\s/gi,''); if(x.endsWith('.')) x=x.slice(0,-1); const v=parseFloat(x); return isNaN(v)?null:v; };
    el.querySelectorAll('.hunt-i').forEach(li=>{ const i=+li.dataset.i, t=tasks[i], inp=li.querySelector('input'), fb=li.querySelector('.hunt-fb'), hint=li.querySelector('.hunt-hint');
      const done=(ok,shown)=>{ li.classList.add(ok?'is-ok':'is-shown'); inp.value=t.show||String(t.ans); inp.disabled=true; li.querySelector('[data-c]').disabled=true;
        fb.hidden=false; const u=t.unit==='%'||t.unit==='×'?t.unit:(t.unit?' '+t.unit:''); fb.innerHTML=`<p><strong>${ok?'找到了。':'答案是 '+(t.show||t.ans)+u+'。'}</strong> ${t.why}</p>`; };
      if(st[i]&&(st[i].ok||st[i].shown)) done(!!st[i].ok,true);
      li.querySelector('[data-h]').onclick=()=>{ hint.hidden=!hint.hidden; };
      const check=()=>{ const v=parse(inp.value); if(v==null){ fb.hidden=false; fb.innerHTML='<p>請輸入數字，例如 <code>1,234</code> 或 <code>12.5</code>。</p>'; return; }
        const val=t.abs?Math.abs(v):v; const ok=Math.abs(val-t.ans)<=(t.tol!=null?t.tol:Math.max(0.5,Math.abs(t.ans)*0.002));
        st[i]=st[i]||{tries:0};
        if(ok){ st[i].ok=true; ctx.save(); done(true); upd(); return; }
        st[i].tries++; ctx.save(); fb.hidden=false;
        fb.innerHTML=`<p><strong>不太對。</strong> ${t.nudge||'檢查一下年度、單位，以及你用的是哪一行。'}</p>`;
        if(st[i].tries>=2){ const b=document.createElement('button'); b.type='button'; b.className='linkbtn'; b.textContent='顯示答案'; b.onclick=()=>{ st[i].shown=true; ctx.save(); done(false); upd(); }; fb.appendChild(b); } };
      li.querySelector('[data-c]').onclick=check; inp.addEventListener('keydown',e=>{ if(e.key==='Enter') check(); });
    });
    el.querySelector('.hunt-reset').onclick=()=>{ Object.keys(st).forEach(k=>delete st[k]); ctx.save(); ctx.sec&&BW.go(ctx.mod.id,ctx.mod.sections.indexOf(ctx.sec)); };
    upd();
  });
}

/* ---------- Invacare data (US$ millions, from the 10-K filings) ---------- */
const IVC=[
  {y:2019,sales:928.0,gm:28.2,op:-10.4,nl:-53.3,ocf:2.7,capex:10.9,cash:80.1,debt:219.5,eq:308.5,inv:120.5,ar:116.7,gw:373.4},
  {y:2020,sales:850.7,gm:28.8,op:11.3,nl:-28.3,ocf:21.9,capex:22.3,cash:105.3,debt:245.1,eq:333.8,inv:115.5,ar:108.6,gw:402.5},
  {y:2021,sales:872.5,gm:27.4,op:-24.2,nl:-45.6,ocf:-14.3,capex:17.7,cash:83.7,debt:308.1,eq:218.5,inv:144.3,ar:117.1,gw:355.9},
  {y:2022,sales:741.7,gm:23.6,op:-80.5,nl:-101.1,ocf:-55.3,capex:3.8,cash:58.8,debt:354.2,eq:81.1,inv:112.6,ar:88.0,gw:326.3}
];
const m1=v=>(v<0?'(':'')+'$'+Math.abs(v).toFixed(1)+(v<0?')':'');
const IVCQ=[
  {when:'2020年3月：2019年年報出爐', story:`營收 $9.28億。公司又虧損了。它正在關閉並整併歐洲的工廠，並在11月把2021年到期的票據換成2024年到期的新票據。`,
   q:'營業活動現金流量為正的 $270萬，資本支出為 $1,090萬。這告訴你什麼？',
   opts:['公司在產生現金，所以虧損不要緊','自由現金流量為負：公司無法靠自己支付投資，只能靠現金存底和借款過日子','資本支出太高，應該砍到零','什麼也沒有：現金流量只對小公司重要'],a:1,
   why:'$270萬 − $1,090萬＝約 −$800萬 的自由現金流量。一家連維持性支出都無法自己負擔的公司，只能不斷借錢。把2021年到期的票據換成2024年到期，是在爭取時間，但一毛錢也沒還。'},
  {when:'2021年3月：2020年年報出爐', story:`疫情那一年營收下滑8%，但標題說營業利益已轉正：$1,130萬，前一年是虧損 $1,040萬。現金增加到 $1.05億。`,
   q:'營業利益的轉虧為盈是真的嗎？',
   opts:['是：$2,170萬 的翻轉是明確的復甦','大部分不是：其中 $980萬 來自出售 Dynamic Controls 業務的一次性利益，所以基本面數字只有約 $150萬','是，因為現金增加了','沒有股價就無法判斷'],a:1,
   why:'一次性利益應該另外看。扣掉出售業務的 $980萬 利益，營業利益約 $150萬，對比 $8.51億 的營收：大約只是損益兩平。現金增加，部分原因是負債增加，從 $2.2億 升到 $2.45億。'},
  {when:'2022年3月：2021年年報出爐', story:`營收成長2.6%。北美在一次IT系統更換後，提列了 $2,860萬 的商譽減損。這一年它透過2026年到期的新可轉換票據借了 $1.1億（後來增加到 $1.25億），主要用來買回2022年到期的票據。`,
   q:'存貨增加25%，營收只成長2.6%，營業活動現金流量轉為負數（−$1,430萬），負債升到 $3.08億。最令人擔心的訊號是什麼？',
   opts:['商譽減損，因為它是最大的數字','公司現在在燒錢，靠新借款填補缺口，同時存貨越堆越多','毛利率下降1.4個百分點','應收帳款增加了 $850萬'],a:1,
   why:'減損是真的，但不涉及現金。更大的問題是：營運第一次在消耗現金，多出 $2,900萬 被綁在存貨裡，而且是靠新負債支應。權益也減少了 $1.15億，遠多於 $4,600萬 的虧損。遇到這種情況，就打開權益變動表，看看其餘的錢去了哪裡。'},
  {when:'2022年底到2023年初', story:`7月，公司借了一筆利率為 SOFR + 7% 的擔保中長期貸款，並把部分票據換成有擔保的票據。9月，紐約證券交易所（NYSE）警告其股價已連續30天低於 $1。呼吸照護產品線被放棄。2022年年報延遲到2023年4月14日才申報。`,
   q:'一筆利率 SOFR + 7% 的擔保貸款，告訴財報讀者什麼？',
   opts:['2022年全球利率都上升了','放款人現在認為風險很高：他們要求以資產作擔保，還要非常高的利差。這是最後手段的資金','公司正在擴張','什麼也沒有：貸款條件不重要'],a:1,
   why:'體質健康的公司借的是無擔保貸款，或利差不高。擔保加上7個百分點的利差，代表放款人認為違約的可能性很實在，而擔保讓他們的受償順位排在既有票據持有人之前。'}
];

BW.add({
  id:'m21', minutes:60,
  title:'解讀真實年報',
  subtitle:'到目前為止都用 BraceWorks 當例子。現在打開三家販售床墊、移位吊帶和護具的真實公司所發布的報告，找出關鍵數字，並一份年報接一份年報地，看著一家真實公司滑向破產。',
  goals:[
    '在20分鐘內摸清任何一份年報，從經過查核的部分開始',
    '在真實發布的報告中找出、核對並計算關鍵數字',
    '分辨經查核的數字與管理階層自訂的衡量指標，例如「調整後」利益和內生成長',
    '在會計師提出警告的好幾年前，就看出財務困境的警訊',
    '從附註和查核報告中，讀出報表本身沒有顯示的資訊'
  ],
  sections:[
  /* ------------------------------------------------------------ 1 */
  {id:'map', label:'年報怎麼看', kind:'learn', title:'你的年報地圖', blocks:[
    `<p>一家上市公司的年報可能長達150頁。你不需要從頭讀到尾。前半部大多由管理階層撰寫，用來說一個好故事。後半部才是證據：財務報表和附註，經會計師查核。懂財務的讀者會從後面讀起。</p>`,
    {t:'fig', title:'每份年報的兩半', draw:function(w){
      const P=BW.viz.p;
      const L=[['故事','由管理階層撰寫・未經查核',['董事長與執行長致股東信','策略與市場','重點摘要與「關鍵數據」','營運部門與區域回顧','永續報告','「調整後」及其他自訂指標'],''],
               ['證據','經查核・所有公司適用相同規則',['查核報告','損益表','資產負債表','現金流量表','權益變動表','財務報表附註'],'hl']];
      const wide=w>=560, bw=wide?(w-70)/2:w-8, ih=24, bh=58+6*ih+10;
      let g='';
      L.forEach((c,k)=>{ const x=wide?(k?bw+66:4):4, y=wide?24:(k?bh+70:24);
        g+=`<rect x="${P.f(x)}" y="${y}" width="${P.f(bw)}" height="${bh}" rx="12" class="v-node ${c[3]}"/>`+P.txt(x+16,y+26,c[0],'v-t','start')+P.txt(x+16,y+44,c[1],'v-s','start');
        c[2].forEach((it,i)=>{ g+=`<circle cx="${P.f(x+22)}" cy="${y+66+i*ih}" r="3" class="v-f-${k?'s3':'s2'}"/>`+P.txt(x+32,y+70+i*ih,it,'v-s','start'); }); });
      if(wide){ const mx=bw+35; g+=P.arrow(mx+26,24+bh/2,mx-26,24+bh/2,{cls:'acc'})+P.lines(mx,24+bh/2-30,['檢驗','說法'],'v-l','middle',12); g+=P.txt(4,14,'前半部','v-l','start')+P.txt(bw+66,14,'後半部','v-l','start'); }
      else { g+=P.arrow(w/2,24+bh+52,w/2,24+bh+14,{cls:'acc'})+P.txt(w/2+10,24+bh+38,'用證據檢驗說法','v-l','start'); }
      return P.svg(w,wide?bh+34:2*bh+100,'年報的前半部講述管理階層的故事；後半部是經查核的報表和附註，用來檢驗那個故事。',g);
    }, caption:'前半部要放什麼由管理階層決定，包括它自己的「調整後」數字。後半部遵循會計準則，並經過查核。先讀後半部，再拿前半部來對照。'},
    {t:'tbl', head:['你想知道的','去哪裡找'], rows:[
      ['這些數字可信嗎？','<strong>查核報告</strong>（auditor\'s report）：意見是否乾淨？有沒有關於繼續經營的段落？'],
      ['公司有沒有把獲利轉成現金？','<strong>現金流量表</strong>：營業活動現金流量對比獲利；資本支出；缺口靠什麼補'],
      ['欠了多少錢？何時到期？','<strong>資產負債表</strong>和<strong>借款（負債）附註</strong>（borrowings / debt note）'],
      ['哪些部分在成長？哪些在賺錢？','<strong>營運部門附註</strong>（segment note）和營運部門回顧'],
      ['收購花了多少錢？現在還值得嗎？','<strong>企業合併</strong>（business combinations）和<strong>商譽</strong>（goodwill）附註'],
      ['有沒有還沒反映在數字裡的大事？','<strong>或有負債</strong>（contingent liabilities）和<strong>報導期間後事項</strong>（events after the reporting date）附註']
    ]},
    `<h3>20分鐘閱讀法</h3><p>每次都用同樣的順序，不論是競爭對手的年報、客戶的年報，還是你自己公司經查核的財務報表。</p>`,
    {t:'fig', title:'你的20分鐘怎麼分配', render:function(box){ box.innerHTML=BW.viz.stack({fmt:v=>v+'分鐘',inside:'label',pct:false,minShow:12,keys:[
      {c:'s1',label:'1 查核報告',v:'2分鐘'},{c:'s2',label:'2 現金流量',v:'4分鐘'},{c:'s3',label:'3 資產負債表',v:'4分鐘'},{c:'s4',label:'4 損益表',v:'3分鐘'},{c:'q2',label:'5 附註',v:'5分鐘'},{c:'muted',label:'6 故事',v:'2分鐘'}],
      rows:[{label:'',tipLabel:'20分鐘',parts:[{label:'1',v:2,c:'s1'},{label:'2',v:4,c:'s2'},{label:'3',v:4,c:'s3'},{label:'4',v:3,c:'s4'},{label:'5',v:5,c:'q2'},{label:'6',v:2,c:'muted'}]}]}); },
      caption:'先看現金流量和資產負債表，再看損益表：獲利要美化一兩年很容易，現金和負債則不然。'},
    {t:'tbl', head:['步驟','要找什麼'], rows:[
      ['<strong>1. 查核報告</strong>','乾淨的（「無保留」，unmodified）意見。有沒有關於繼續經營或「強調事項」的段落。關鍵查核事項清單：會計師最擔心的領域。'],
      ['<strong>2. 現金流量表</strong>','營業活動現金流量與獲利的比較。資本支出。自由現金流量。任何缺口是靠新負債、發行新股還是出售資產補上的？'],
      ['<strong>3. 資產負債表</strong>','今年與去年的現金、負債和權益。應收帳款和存貨的成長是否快於營收？商譽相對於權益是否很大？'],
      ['<strong>4. 損益表</strong>','營收成長、毛利率趨勢，以及一次性項目。獲利增加是否只是因為一筆利益或較低的所得稅費用？'],
      ['<strong>5. 附註</strong>','營運部門、負債到期日、收購與商譽、負債準備、或有負債、關係人、期後事項。'],
      ['<strong>6. 故事</strong>','現在才讀前半部。對每一個說法，問自己：後半部的哪個數字可以檢驗它？']
    ]},
    K('經查核的數字 vs 管理階層自訂的指標',
      `<p>上市公司常以沒有任何會計準則定義的數字開場：<strong>內生成長</strong>（organic growth）、<strong>調整後EBITDA</strong>（adjusted EBITDA）、<strong>現金轉換率</strong>（cash conversion）、<strong>自由現金流量</strong>（free cash flow）。這些稱為<span class="term">替代性績效衡量指標</span>。它們可能真的很有用，但放進什麼、排除什麼，都由管理階層決定。好的報告會把每一項指標調節到經查核的數字。一定要找那份調節表。</p>`),
    SORT('經查核的數字，還是管理階層自訂的指標？',['經查核的數字','管理階層自訂的指標'],[
      {text:'銷貨淨額（Net sales）', a:0, why:'由會計準則定義，是經查核損益表的一部分。'},
      {text:'內生成長（Organic growth）', a:1, why:'剔除匯率和收購影響後的營收成長。很有用，但每家公司的定義都不一樣。'},
      {text:'調整後EBITDA（Adjusted EBITDA）', a:1, why:'由管理階層決定哪些成本屬於「特殊」項目並加回。'},
      {text:'營業活動現金流量（Cash flow from operating activities）', a:0, why:'經查核現金流量表中的一行。'},
      {text:'現金轉換率（Cash conversion）', a:1, why:'由管理階層定義的比率，通常是營業活動現金流量 ÷ EBITDA。要檢查定義。'},
      {text:'商譽（Goodwill）', a:0, why:'列在經查核的資產負債表上，每年都要做減損測試。'},
      {text:'淨負債 ÷ EBITDA', a:1, why:'常見的指標，也常是貸款的財務承諾條款，但不是由會計準則定義。'}
    ]),
    `<h3>去哪裡找真實的報告</h3><p>閱讀其他公司的財務報表是免費的練習，也能讓你看清競爭對手、客戶和供應商的真實狀況。</p>`,
    {t:'tbl', head:['國家','哪裡','可以拿到什麼'], rows:[
      ['菲律賓','菲律賓證券交易委員會（SEC，sec.gov.ph）；上市公司見 PSE EDGE（edge.pse.com.ph）','每家公司每年都要向 SEC 申報經查核的財務報表，可以申請影本。上市公司會把年報公布在 PSE EDGE。'],
      ['台灣','公開資訊觀測站（mops.twse.com.tw）','上市櫃公司的財務報告。'],
      ['中國','巨潮資訊網（cninfo.com.cn）；香港上市公司見 HKEXnews（披露易）','上市公司的年報。'],
      ['美國','SEC EDGAR（sec.gov/edgar）','上市公司的10-K年報（Form 10-K），免費。非上市公司不公開。'],
      ['英國','Companies House（英國公司註冊署，gov.uk「Find and update company information」）','每家公司的財務報表，包括非上市公司，免費。小型公司可能只申報簡式報表，不含損益表。'],
      ['任何地方的上市公司','公司的投資人關係網站','年報、季報和法說會簡報。']
    ]},
    TIP('從季報開始是好選擇',
      `<p>年終或第四季報告通常只有20到30頁，載有和年報相同的全年數字，但沒有光鮮的前半部。這是快速進入數字的方法。接著再用年報看附註和查核報告。</p>`)
  ]},
  {id:'library', label:'報告資料庫', kind:'learn', title:'報告資料庫', blocks:[
    `<p>課程內建四份真實報告，讓你不必離開課程就能練習。每份都有關鍵數據、完整的損益表、資產負債表和現金流量表，以及最有用的附註。每一個數字都與公司發布的完全相同，只簡化了版面，並省略公司自己的敘述文字。報告內容保留英文原文。</p>`,
    {t:'live', render(box){
      const R=BW.reports||{}; const blurb={arjo:'瑞典製造商，生產病患移位機與吊帶、醫療病床及減壓床墊。以瑞典克朗報導。',embla:'冰島義肢公司，旗下有護具業務。以美元報導。',ivc21:'美國病床、床墊和病患移位機製造商，倒閉前一年的報告。含三年的經營成果。',ivc22:'同一家公司的最後一份年報，在進入美國破產法第11章程序後申報。'};
      box.className='lib';
      box.innerHTML=['arjo','embla','ivc21','ivc22'].filter(k=>R[k]).map(k=>{ const r=R[k]; return `<article class="lib-card"><span class="lib-co">${r.company}</span><h4>${r.title}</h4><p>${blurb[k]}</p><span class="lib-pages">共 ${r.pages.length} 頁：${r.pages.slice(1).map(p=>p.title).join('、')}</span>${BW.reportBtn(k,'about','打開報告')}</article>`; }).join('');
    }},
    TIP('如何用資料庫練習',
      `<ul><li>打開一份報告，只用頁面上的資訊，做一次上一節的20分鐘閱讀。</li><li>在看現金流量表之前，先從損益表和資產負債表猜猜現金是增加還是減少。然後再核對。</li><li>隨便挑一行問自己：它比去年大還是小？可能的原因是什麼？</li><li>接下來三節會帶著具體的問題，帶你走進這些報告。</li></ul>`),
    `<h3>各家呈現方式不同</h3>`,
    {t:'tbl', head:['呈現方式','代表什麼'], rows:[
      ['(1,234) 或 −1,234','負數。美國的報告和 Embla 用括號；Arjo 用負號。'],
      ['成本以正數表示','美國的報告把成本列為正數，再予以扣除。Arjo 和 Embla 把成本列為負數。'],
      ['SEK M · USD thousands · US$ thousands','單位（百萬瑞典克朗・千美元・千美元），標在每頁頂端。比較之前一定要先確認。']
    ]}
  ]},
  /* ------------------------------------------------------------ 2 */
  {id:'arjo', label:'尋寶1：Arjo', kind:'play', title:'報告尋寶1：Arjo，2024年', blocks:[
    `<p><strong>Arjo</strong> 是一家瑞典公司，向全球的醫院和照護機構銷售病患移位機和吊帶、醫療病床、預防壓傷的床墊及相關服務。它比 BraceWorks 大得多，但許多產品和你的屬於同一類。它以瑞典克朗（SEK）報導；2024年大約 SEK 10.5 兌1美元。比率不在乎幣別。</p>
     <p>打開報告，找出每個數字並輸入。在寬螢幕上，報告會開在這些問題旁邊；在手機上，按 ✕ 關閉就能回來。每個「去哪裡找」提示也能直接帶你到正確的頁面，但先試著自己找。報告是英文原文，提示中會附上要找的英文項目名稱。</p>
     <div class="hunt-open">${BW.reportBtn('arjo','about','打開 Arjo 2024年報告')}<span class="small" style="color:var(--muted)">數字單位為百萬瑞典克朗（SEK M），與公司發布的完全相同。</span></div>`,
    hunt('arjo','在 Arjo 2024年報告中找出來',[
      {q:'2024年的銷貨淨額', unit:'SEK M', ans:11292, tol:3, show:'11,292', page:'is', where:'損益表（Income statement）的第一行「Net sales」，或關鍵數據（Key figures）的最上方。', why:'2023年為 10,980，所以帳面成長率是2.8%。'},
      {q:'2024年的內生成長', unit:'%', ans:3.1, tol:0.1, page:'keyfig', where:'Key figures（關鍵數據）：「Organic growth in sales」（銷貨內生成長）。「Segments and sales」（營運部門與銷售）頁有細項。', why:'內生成長（3.1%）略高於帳面成長（2.8%），因為克朗走強，換算後使國外銷售縮水了 SEK 3,200萬。內生成長剔除了匯率和收購的影響，所以能看出既有業務的真實表現。'},
      {q:'2024年的毛利率', unit:'%', ans:43.5, tol:0.15, page:'is', where:'Key figures（關鍵數據），或自己算：用損益表上的 gross profit（營業毛利）÷ net sales（銷貨淨額）。', why:'遠高於 BraceWorks 的28%。Arjo 有四分之一的營收來自租賃、五分之一來自服務：與一家把產品賣給經銷商的製造商，組合截然不同。只在相似的商業模式之間比較利潤率。'},
      {q:'2024年的調整後EBITDA利潤率', unit:'%', ans:18.5, tol:0.15, page:'keyfig', where:'Key figures（關鍵數據）：「Adjusted EBITDA margin」。注意它就在未調整的「EBITDA margin」旁邊。', why:'未調整的利潤率是17.5%。Arjo 自己的目標是從2025全年起調整後EBITDA利潤率約23%，所以2024年仍差4.5個百分點。拿實際成果和公司自己的目標比，是檢驗經營團隊最快的方法之一。'},
      {q:'2024年認列的「特殊項目」合計（請以正數輸入金額）', unit:'SEK M', ans:126, tol:1, abs:true, page:'debt', where:'損益表中單獨的一行（exceptional items），細項在「Net debt and exceptional items」（淨負債與特殊項目）頁。', why:'重組 68、一項經銷協議終止後 Bruin Biometrics 資產的損失 54，以及收購成本 4。2022年的特殊項目也有 SEK 7,400萬，2023年則是 SEK 7,300萬。「調整後」EBITDA 把它們加回。每年都會出現的成本就是經營的一部分，所以也要看未調整的數字。'},
      {q:'2024年的營業活動現金流量', unit:'SEK M', ans:1516, tol:3, show:'1,516', page:'cf', where:'現金流量表（Cash flow statement）：營運資金變動之後的小計「Cash flow from operations」。', why:'從2023年的 2,061 下降，而 EBITDA 卻上升。看看它上方的三行營運資金項目：差異就在那裡。'},
      {q:'計算現金轉換率：營業活動現金流量 ÷ EBITDA（EBITDA 在關鍵數據中）', unit:'%', ans:76.7, tol:0.4, page:'keyfig', where:'1,516 ÷ 1,977 × 100。Arjo 就是這樣定義現金轉換率（Cash Conversion），目標是80%以上。', why:'低於目標，且從2023年的105.9%下滑。現金流量表說明了原因：2023年營運資金釋放了 SEK 5.25億（存貨 192、應收帳款 130、更多的供應商信用 203），而2024年則吸收了 SEK 7,300萬，主要是應收帳款。一次性的營運資金釋放會美化單一年度，所以要把三年放在一起看。'},
      {q:'計算應收帳款週轉天數：年底應收帳款 ÷ 銷貨淨額 × 365', unit:'天', ans:58, tol:1.5, page:'bs', where:'應收帳款在資產負債表上，項目名稱為「Accounts receivables」：1,798 ÷ 11,292 × 365。', why:'約58天，而 BraceWorks 是70天，儘管 Arjo 大多賣給醫院和政府。大客戶不一定代表付款慢。'},
      {q:'2024年底的淨負債 ÷ 調整後EBITDA', unit:'×', ans:2.0, tol:0.05, page:'keyfig', where:'Key figures（關鍵數據）：「Net debt/adjusted EBITDA」。「Net debt and exceptional items」頁列出淨負債的組成，含租賃。', why:'從2023年的2.3倍（2022年為2.7倍）下降。Arjo 一直在用現金還債。'},
      {q:'2024年營收中，租賃、服務和耗材合計占多少比例？', unit:'%', ans:61, tol:1, page:'about', where:'第一頁的「Arjo in brief」（Arjo 簡介）：「Sales by type of service」（依服務類型的銷售）。', why:'約五分之三的營收每年都會回來，不需要重新成交。經常性收入讓經營成果更穩定、更容易預測。BraceWorks 有沒有可以提供的經常性產品，例如替換套或服務方案？'}
    ],'arjo'),
    {t:'fig', title:'Arjo：獲利上升，現金沒跟上', draw:BW.viz.vbars({label:'Arjo 2022至2024年調整後EBITDA與營業活動現金流量，單位百萬瑞典克朗。',x:['2022','2023','2024'],xName:'年度',fmt:v=>(v/1000).toFixed(1)+'bn',tfmt:v=>'SEK '+v.toLocaleString('en-US')+' M',values:true,vfmt:v=>v.toLocaleString('en-US'),
      series:[{name:'調整後EBITDA',c:'s1',v:[1752,2017,2086]},{name:'營業活動現金流量',c:'s3',v:[827,2061,1516]}]}),
      caption:'調整後EBITDA穩定上升。現金流量則從2022年占EBITDA的49%，擺盪到2023年的106%和2024年的77%。這就是為什麼單一年度的現金流量說明不了什麼：要把三年放在一起看。資料來源：Arjo 年終報告。'},
    Q('Arjo 的標題說調整後EBITDA升到 SEK 20.86億。細心的讀者接下來該檢查什麼？',['只看股價','被加回的「特殊」成本是否真的是一次性，以及現金流量有沒有跟上獲利','員工人數','董事長致股東信'],1,'調整後數字排除了管理階層稱為特殊的成本。Arjo 連續三年都有這類成本，而且2024年的現金轉換率下滑了。'),
    Q('Arjo 的內生成長是3.1%，帳面成長卻是2.8%。為什麼？',['Arjo 出售了一項業務','克朗走強，使國外銷售換算成 SEK 後變少','價格下跌','只是四捨五入的誤差'],1,'匯率變動會改變帳面營收，但業務本身什麼都沒變。內生成長把它剔除。')
  ]},
  /* ------------------------------------------------------------ 3 */
  {id:'embla', label:'尋寶2：Embla Medical', kind:'play', title:'報告尋寶2：Embla Medical，2024年', blocks:[
    `<p><strong>Embla Medical</strong>（2024年以前名為 Össur）是一家冰島公司，最知名的是義肢腿和義肢腳。它也有一個<strong>護具與支撐（Bracing &amp; Supports）</strong>業務，銷售骨科護具，和 BraceWorks 生產的是同一類產品。它以<strong>美元</strong>報導，所以它的數字可以直接和你的放在一起看。</p>
     <div class="hunt-open">${BW.reportBtn('embla','about','打開 Embla Medical 2024年報告')}<span class="small" style="color:var(--muted)">報表單位為千美元（USD thousands）；五年概覽（Five-year overview）單位為百萬美元。請以百萬美元作答。</span></div>`,
    hunt('embla','在 Embla Medical 2024年報告中找出來',[
      {q:'2024年的銷貨淨額（百萬美元）', unit:'USD M', ans:855, tol:1, page:'five', where:'Five-year overview（五年概覽），或損益表的第一行「Net sales」（以千元計為 854,889）。', why:'比2023年的 $7.86億 成長9%。'},
      {q:'2024年的內生成長', unit:'%', ans:6, tol:0.3, page:'five', where:'Five-year overview（五年概覽）的「SALES GROWTH」（營收成長）下方；「Segments and growth」（營運部門與成長）頁的成長分析也有。', why:'帳面成長是9%。匯率影響為零，所以其餘3個百分點來自收購。'},
      {q:'2024年的成長中，有幾個百分點來自收購？', unit:'個百分點', ans:3, tol:0.5, page:'seg', where:'成長分析（growth analysis）：organic（內生）＋ acquisitions（收購）＋ currency（匯率）＝ growth in USD（以美元計的成長）。', why:'全部來自義肢與神經矯具（Prosthetics & Neuro Orthotics，該部門貢獻6個百分點），源自2024年1月1日收購的 Fior & Gentz。買來的成長和賺來的成長不一樣：它要花現金或發行新股，還會增加商譽。'},
      {q:'2024年護具與支撐（Bracing & Supports）的營收（百萬美元）', unit:'USD M', ans:148, tol:1, page:'seg', where:'營運部門資訊：「sales by business segment」（依營運部門的銷售），以千元計為 148,386。', why:'不到集團營收的五分之一。義肢與神經矯具部門為 $4.51億，是它的三倍。'},
      {q:'2024年護具與支撐業務的內生成長', unit:'%', ans:1, tol:0.3, page:'seg', where:'成長分析表中的營運部門（business segment）各列。', why:'只有1%，而義肢是9%，集團是6%。即使對全球領導者來說，護具也是成熟、價格競爭激烈的市場。這對 BraceWorks 自己的成長計畫和訂價是很有用的背景資訊。'},
      {q:'2024年的毛利率（取到整數%）', unit:'%', ans:63, tol:0.6, page:'is', where:'Five-year overview 的關鍵比率「Gross profit margin %」，或用損益表上的 gross profit ÷ net sales。', why:'是 BraceWorks 利潤率的兩倍多。義肢屬高科技產品，為每位病患量身裝配，部分還透過 Embla 自己的診所銷售，所以利潤率和一家賣給經銷商的製造商非常不同。'},
      {q:'2024年特殊項目前的EBITDA利潤率', unit:'%', ans:20, tol:0.5, page:'notes', where:'Five-year overview（「EBITDA margin before special items %」），或「Selected notes」（精選附註）中的 EBITDA 表。', why:'EBITDA 為 $1.691億；加回全部發生在第一季的 $410萬 特殊項目（special items）前，為 $1.733億：營收的20%。'},
      {q:'2024年的自由現金流量（百萬美元）', unit:'USD M', ans:77, tol:1, page:'cf', where:'Five-year overview（「Free cash flow」）。到現金流量表核對：「Net cash generated from operating activities」減去「Purchase of fixed and intangible assets」（購置固定及無形資產）。', why:'116,066 − 39,227 = 76,839 千元，占營收9%。注意現金流量表有兩個小計：「cash generated from operations」（$1.6億，未扣利息和所得稅）和「net cash generated from operating activities」（$1.16億，已扣除）。要清楚你比較的是哪一個。'},
      {q:'2024年底資產負債表上的商譽（百萬美元）', unit:'USD M', ans:776, tol:2, page:'bs', where:'資產負債表，非流動資產中的「Goodwill」（以千元計為 776,306）。', why:'從 $6.91億 增加：$1.045億 來自收購 Fior & Gentz，部分被 $1,900萬 的匯率變動抵銷。見「Selected notes」中的商譽表。'},
      {q:'計算商譽占總資產的比例', unit:'%', ans:50, tol:1.5, page:'bs', where:'商譽 ÷ 總資產（Total assets），兩者都在資產負債表上：776,306 ÷ 1,538,965 × 100。', why:'資產負債表有一半是商譽：收購業務時超出其資產價值所付的溢價。它不是現金，也賣不掉。如果收購的業務表現不佳，就得減損，就像 Invacare 在2021年那樣。這就是會計師每年都要測試它的原因。'},
      {q:'2024年底淨附息負債 ÷ 特殊項目前EBITDA', unit:'×', ans:2.4, tol:0.05, page:'notes', where:'Five-year overview（「NIBD to EBITDA」），或「Selected notes」中的淨附息負債（net interest-bearing debt）表。', why:'從2023年的2.8倍下降，落在公司自己2.0–3.0倍的目標區間內。$4.14億 的淨負債包含租賃負債。'}
    ],'embla'),
    {t:'fig', title:'Embla Medical：各業務的內生成長', draw:BW.viz.vbars({label:'各營運部門2023與2024年的內生成長：義肢13%與9%，病患照護8%與5%，護具與支撐3%與1%。',x:['義肢','病患照護','護具與支撐'],xName:'營運部門',fmt:v=>v+'%',values:true,
      series:[{name:'2023',c:'muted',v:[13,8,3]},{name:'2024',c:'s1',v:[9,5,1]}]}),
      caption:'營運部門附註會告訴你，是哪些部分在撐起整個公司。兩年中都是護具成長最慢。資料來源：Embla Medical 2023及2024年年報（義肢部門於2024年更名為 Prosthetics & Neuro Orthotics）。'},
    Q('Embla 2024年成長9%：6%是內生，3%來自收購。為什麼要分開看？',['兩者意思相同','內生成長顯示既有業務的表現；收購來的成長是用現金或股份買來的，還會增加商譽','收購不算營收','為了節稅'],1,'一家公司可以靠收購多年維持穩定成長，而底層業務卻停滯不前。一定要找這個拆分。'),
    Q('Embla 總資產的一半是商譽。對讀者而言，主要風險是什麼？',['商譽會用完','如果收購的業務表現不佳，商譽就會被減損，減少獲利和權益，雖然當下沒有現金流出','商譽必須還給銀行','沒有風險'],1,'商譽反映的是過去付出的價格。它每年都要測試，一旦減損，就表示某項收購沒有達到預期。')
  ]},
  /* ------------------------------------------------------------ 4 */
  {id:'invacare', label:'個案：走向破產', kind:'case', title:'個案檔案：Invacare，2019至2023年', blocks:[
    CASE('四份年報，一個結局',
      `<p><strong>Invacare</strong> 是一家美國公司，生產輪椅、居家照護床、治療用床墊和病患移位機，營收將近$10億。2023年1月31日，它依美國破產法第11章聲請破產保護。原有股東血本無歸。</p>
       <p>你將依序閱讀它最後四份年報，就像當時的總經理或放款人一樣。每一年，判斷數字在說什麼。所有數字都取自公司的10-K年報，單位為百萬美元，你可以在課程中打開完整內容。</p>
       <div class="hunt-open">${BW.reportBtn('ivc21','is','2021年 10-K','btn ghost small')}${BW.reportBtn('ivc22','is','2022年 10-K','btn ghost small')}</div>`),
    W('依年報出爐的順序閱讀', function(el,ctx){
      const S=ctx.state; S.ivc=S.ivc||{y:0,a:{}}; const st=S.ivc;
      const row=(lab,k,fmt)=>{ return `<tr><td>${lab}</td>${IVC.map((r,i)=>`<td class="num ${i===st.y?'cur':''} ${i>st.y?'fut':''}">${i>st.y?'?':fmt(r[k])}</td>`).join('')}</tr>`; };
      const draw=()=>{ const q=IVCQ[st.y];
        el.innerHTML=`<div class="ivc-years" role="tablist">${IVC.map((r,i)=>`<button type="button" class="chip plain ${i===st.y?'is-active':''}" ${i>st.y&&st.a[i-1]===undefined?'disabled':''} data-y="${i}">${r.y}</button>`).join('')}</div>
          <div class="eyebrow" style="margin-top:10px">${q.when}</div><p style="margin:4px 0 10px">${q.story}</p>
          <div class="tbl"><table class="grid ivc-t"><thead><tr><th>百萬美元</th>${IVC.map((r,i)=>`<th class="num ${i===st.y?'cur':''}">${i>st.y?'':r.y}</th>`).join('')}</tr></thead><tbody>
          ${row('銷貨淨額','sales',v=>v.toFixed(1))}${row('毛利率','gm',v=>v.toFixed(1)+'%')}${row('營業利益','op',m1)}${row('本期淨損','nl',m1)}${row('營業活動現金流量','ocf',m1)}${row('資本支出','capex',v=>v.toFixed(1))}${row('年底現金','cash',v=>v.toFixed(1))}${row('負債總額','debt',v=>v.toFixed(1))}${row('股東權益','eq',v=>v.toFixed(1))}${row('存貨','inv',v=>v.toFixed(1))}${row('商譽','gw',v=>v.toFixed(1))}
          </tbody></table></div><div class="ivc-q"></div>`;
        const qb=el.querySelector('.ivc-q'); const box=document.createElement('div'); box.className='quiz';
        box.innerHTML=`<div class="quiz-q"><span class="quiz-tag">你的判斷</span><p>${q.q}</p></div><div class="quiz-opts"></div><div class="quiz-why" hidden></div>`; qb.appendChild(box);
        const oe=box.querySelector('.quiz-opts'), why=box.querySelector('.quiz-why'); const btns=[];
        const show=c=>{ btns.forEach((b,j)=>{ b.disabled=true; b.classList.toggle('is-right',j===q.a); b.classList.toggle('is-wrong',j===c&&c!==q.a); b.classList.toggle('is-dim',j!==q.a&&j!==c); }); why.hidden=false;
          why.innerHTML=`<p><strong>${c===q.a?'答對了。':'不太對。'}</strong> ${q.why}</p>`;
          const nb=document.createElement('button'); nb.type='button'; nb.className='btn small'; nb.style.marginTop='8px';
          if(st.y<IVC.length-1){ nb.textContent=`打開 ${IVC[st.y+1].y} 年的年報`; nb.onclick=()=>{ st.y++; ctx.save(); draw(); }; }
          else { nb.textContent='看看後來發生了什麼'; nb.onclick=()=>{ st.y=IVC.length-1; st.end=true; ctx.save(); draw(); }; }
          why.appendChild(nb); };
        q.opts.forEach((o,j)=>{ const b=document.createElement('button'); b.type='button'; b.className='opt'; b.innerHTML=`<span class="ol">${'ABCD'[j]}</span><span>${o}</span>`; b.onclick=()=>{ st.a[st.y]=j; ctx.save(); show(j); }; oe.appendChild(b); btns.push(b); });
        if(st.a[st.y]!==undefined) show(st.a[st.y]);
        el.querySelectorAll('[data-y]').forEach(b=>b.onclick=()=>{ st.y=+b.dataset.y; st.end=false; ctx.save(); draw(); });
        if(st.end&&st.y===IVC.length-1){ const out=document.createElement('div'); out.className='ivc-end';
          out.innerHTML=`<h4>後來發生了什麼</h4><ul class="ivc-tl">
            <li><b>2023年1月31日</b>在德州依美國破產法第11章聲請重整，並提出一份與債權人談妥、可削減約 $2.4億 負債的計畫。</li>
            <li><b>2023年2月1日</b>紐約證券交易所暫停交易；股票在當月稍後下市。</li>
            <li><b>2023年4月14日</b>2022年年報延遲申報。報告中這時寫著，這些風險使公司繼續經營的能力存在「重大疑慮」（substantial doubt）。</li>
            <li><b>2023年5月5日</b>以 Invacare Holdings 之名脫離第11章程序。$2.23億 的可轉換票據及未付利息被一筆勾銷，債權人成為新股東，舊股份則被註銷，股東一無所獲。</li></ul>
            <p class="w-hint">得分：答對 ${IVCQ.filter((x,i)=>st.a[i]===x.a).length}／4 題。正式的繼續經營警告是在聲請破產<strong>之後</strong>才出現的。現金流量表、負債附註和資產負債表，早在三年前就已經在說這個故事了。</p>
            <button type="button" class="linkbtn" data-restart>重新閱讀這四份年報</button>`;
          el.appendChild(out); out.querySelector('[data-restart]').onclick=()=>{ S.ivc={y:0,a:{}}; ctx.save(); BW.go('m21',ctx.mod.sections.indexOf(ctx.sec)); }; }
      };
      draw();
    }),
    {t:'fig', title:'Invacare：最先出問題的是現金', draw:BW.viz.line({label:'Invacare 2019至2022年營業活動現金流量與自由現金流量，單位百萬美元。營業活動現金流量從2.7降到負55.3。',x:['2019','2020','2021','2022'],xName:'年度',xw:28,fmt:v=>(v<0?'−$'+(-v):'$'+v)+'百萬',tfmt:v=>m1(v)+'百萬',dots:true,zero:true,ticks:4,
      series:[{name:'營業活動現金流量',short:'營業',c:'s1',v:[2.7,21.9,-14.3,-55.3]},{name:'自由現金流量（扣除資本支出後）',short:'自由',c:'s2',v:[-8.2,-0.4,-32.0,-59.1]}]}),
      caption:'這裡的自由現金流量是營業活動現金流量減去資本支出，由10-K的數字算出。四年全都是負數，缺口靠借款填補。'},
    {t:'fig', title:'負債上升，權益下降', draw:BW.viz.vbars({label:'2019至2022年，Invacare 負債總額從$2.195億升到$3.542億，權益則從$3.085億降到$8,110萬。',x:['2019','2020','2021','2022'],xName:'年度',fmt:v=>'$'+v+'百萬',tfmt:v=>'$'+v.toFixed(1)+'百萬',values:true,vfmt:v=>Math.round(v),
      series:[{name:'負債總額',c:'s2',v:[219.5,245.1,308.1,354.2]},{name:'股東權益',c:'s1',v:[308.5,333.8,218.5,81.1]}]}),
      caption:'負債從權益的0.7倍升到4.4倍。每年的虧損都在侵蝕股東的緩衝，而放款人的債權卻越來越大。'},
    {t:'tbl', head:['訊號','出現在哪裡','最早可見於'], rows:[
      ['自由現金流量年年為負','現金流量表','2019年年報'],
      ['一再以換發較晚到期票據的方式為負債再融資','負債附註；新聞稿','2019年年報'],
      ['獲利被一次性利益美化','損益表；附註','2020年年報'],
      ['存貨成長速度是營收的十倍','資產負債表','2021年年報'],
      ['系統更換後提列商譽減損','損益表；商譽附註','2021年年報'],
      ['權益減少的速度遠快於帳上虧損','資產負債表；權益變動表','2021年年報'],
      ['利率 SOFR + 7% 的擔保貸款；資本支出砍到 $380萬','負債附註；現金流量表','2022年年報'],
      ['年報延遲申報；對繼續經營存在「重大疑慮」','申報日期；附註1及風險因素','2023年4月，聲請破產之後']
    ]},
    `<p><strong>輪到你來看真實的申報文件。</strong>兩份10-K年報都在課程裡。在 <strong>2021年 10-K</strong> 中，找出說出整個故事的三行：資產負債表上的「Inventories」（存貨）、「Net cash provided (used) by operating activities」（營業活動淨現金流量），以及負債附註中2024年11月到期的可轉換票據（convertible notes）。接著打開 <strong>2022年 10-K</strong>：閱讀附註1關於繼續經營（going concern）的說明，並把負債附註和前一年比較。什麼改變了？現在誰排在第一順位？</p>
     <div class="hunt-open">${BW.reportBtn('ivc21','is','打開2021年 10-K')}${BW.reportBtn('ivc22','gc','打開2022年 10-K','btn ghost small')}</div>
     <p class="small" style="color:var(--muted)">完整的申報文件，包括 Item 8 中的查核報告，請用每份報告第一頁上的連結。</p>`,
    K('給 BraceWorks 的教訓',
      `<p>Invacare 2019年的毛利率是28%，和 BraceWorks 差不多。規模沒能保護它。讓它沉沒的，是第5單元提醒過的模式：現金流出比流入快，年復一年靠新借款填補，直到放款人不再相信。用同樣的眼光讀你自己的財務報表：每年都看自由現金流量、負債到期日和權益趨勢。</p>`)
  ]},
  /* ------------------------------------------------------------ 5 */
  {id:'notes', label:'附註與查核報告', kind:'learn', title:'閱讀附註與查核報告', blocks:[
    `<p>報表給你總數。附註告訴你裡面有什麼，以及接下來會發生什麼。大多數年報有25到40個附註。第一次閱讀時，你只需要其中幾個。</p>`,
    {t:'tbl', head:['附註','它回答的問題','真實例子'], rows:[
      ['<strong>營運部門資訊</strong>（Segment information）','哪些部分在成長？哪些在賺錢？','Embla：2024年護具與支撐內生成長1%，義肢9%。'],
      ['<strong>企業合併</strong>（Business combinations）','買了什麼？花了多少？怎麼付款？','Embla 在2024年以新股加現金收購 Fior & Gentz，增加約 $1.04億 的商譽。'],
      ['<strong>借款或負債</strong>（Borrowings / Debt）','欠多少？利率多少？何時到期？','Invacare 2021年的附註顯示約 $1.5億 的票據在2024年11月到期。'],
      ['<strong>商譽與減損測試</strong>（Goodwill and impairment testing）','過去的收購是否仍值得當初付的價格？','Invacare 在2021年沖銷了 $2,860萬 的北美商譽。'],
      ['<strong>負債準備與或有負債</strong>（Provisions and contingent liabilities）','有哪些預期會發生、但還沒支付的成本或求償？','保固、產品責任和法律求償：對醫療器材來說是大事。'],
      ['<strong>關係人</strong>（Related parties）','公司是否和股東、董事或他們的公司有往來？','對股東的借款、租金或銷售，應該按正常條件進行。'],
      ['<strong>報導期間後事項</strong>（Events after the reporting date）','年底之後有沒有發生什麼大事？','Invacare 的2022年年報是在聲請第11章程序之後才出爐。']
    ]},
    {t:'fig', title:'Invacare 的還款高牆，如2021年負債附註所示', draw:BW.viz.vbars({label:'依2021年負債附註，Invacare 可轉換票據依到期年度：2024年到期約$1.5億，2026年到期$1.19億。',x:['2022','2023','2024','2025','2026'],xName:'到期年度',fmt:v=>'$'+v+'百萬',tfmt:v=>'$'+v.toFixed(1)+'百萬',values:true,vfmt:v=>v?Math.round(v):'',
      series:[{name:'到期的可轉換票據',c:'s2',v:[2.6,0,150.4,0,119.0]}]}),
      caption:'2021年 10-K 負債附註中可轉換票據的帳面金額：2024年 Series I $7,210萬 加 Series II $7,830萬；2026年票據 $1.19億（面額 $1.25億）。其他借款（$3,610萬，主要是循環信用額度）未列入。手上只有 $8,370萬 現金、營業活動現金流量又是負的，2024年這道高牆只能靠再融資來應付。'},
    `<div class="hunt-open">${BW.reportBtn('ivc21','debt','打開2021年 10-K 的負債附註','btn ghost small')}</div>`,
    Q('2022年3月，一家供應商正在考慮是否給 Invacare 更長的付款期限。負債附註提供了什麼額外資訊？',['除了資產負債表之外沒什麼','它顯示約 $1.5億 的票據將在2024年11月到期，而公司無法用現金或營運來償還，所以再融資或重整勢在必行','它顯示利率很低，所以公司很安全','它顯示票據可以轉換成股份，所以不需要償還'],1,'資產負債表給你總數，負債附註給你日期。一筆現金流量無法支應的大額還款，對公司所有的債權人都是風險，包括供應商。'),
    `<h3>查核報告</h3><p>通常只有兩到四頁，就在報表之前或之後。學會幾種標準格式，任何一份你都能在兩分鐘內讀完。</p>`,
    FLIP([
      {f:'無保留（乾淨）意見（Unmodified / clean opinion）', b:'報表依會計準則允當表達（英文寫作「true and fair view」或「present fairly」）。這是你想看到的。'},
      {f:'保留意見：「除…之外」（Qualified opinion: "except for…"）', b:'整體允當，但有一個特定領域會計師不同意，或無法取得證據。仔細看被排除的到底是什麼。'},
      {f:'否定意見（Adverse opinion）', b:'報表存在重大不實。很罕見，而且非常嚴重。'},
      {f:'無法表示意見（Disclaimer of opinion）', b:'會計師無法取得足夠的證據來形成任何意見。把這些數字視為未經驗證。'},
      {f:'與繼續經營有關之重大不確定性（Material uncertainty related to going concern）', b:'依國際審計準則，這是單獨的一段，說明公司能否繼續經營存在重大疑慮。在美國，用語是「substantial doubt」。查核意見仍可能是乾淨的。'},
      {f:'強調事項（Emphasis of matter）', b:'會計師提醒你注意附註中已揭露的事項，例如一宗大官司或一場火災。查核意見不會因此改變。'},
      {f:'關鍵查核事項（Key audit matters）', b:'適用於上市公司：會計師判斷最重要的領域，例如商譽減損、收入或存貨。美國報告中稱為 critical audit matters（重要查核事項）。可以預先看出判斷空間在哪裡。'}
    ]),
    SORT('你會先打開哪個附註？',['營運部門','負債','商譽','關係人'],[
      {text:'一家競爭對手說它的居家照護部門「成長快速」。是真的嗎？', a:0, why:'營運部門附註會依部門列出營收，通常也有獲利。'},
      {text:'一位客戶有一筆大額借款。什麼時候到期？', a:1, why:'借款附註會列出每筆借款的利率和到期日。'},
      {text:'一家經銷商去年收購了兩家對手。它付太多了嗎？', a:2, why:'商譽附註會顯示減損測試和任何減損金額。'},
      {text:'你的工廠向股東家族的公司租廠房。有沒有揭露？條件是否正常？', a:3, why:'關係人交易必須揭露。'},
      {text:'哪些產品線的利潤率最好？', a:0, why:'如果公司依產品線報導營運部門，營運部門附註就會顯示。'},
      {text:'公司是否違反、或接近違反貸款的財務承諾條款？', a:1, why:'財務承諾條款的遵循情形通常在負債附註，或風險與流動性附註中說明。'}
    ])
  ]},
  /* ------------------------------------------------------------ 6 */
  {id:'compare', label:'像分析師一樣比較', kind:'play', title:'像分析師一樣比較公司', blocks:[
    `<p>金額告訴你規模；比率告訴你品質。比率可以跨幣別、跨規模比較，這就是你能把一家 SEK 110億的公司和一家 $120萬 的公司放在一起比的方法。但前提是定義要一致。</p>`,
    {t:'tbl', head:['比率','Arjo 2024','Embla 2024','Invacare 2021','Brace­Works'], opts:{num:[1,2,3,4]}, rows:[
      ['毛利率','43.5%','62.5%','27.4%','28.3%'],
      ['營業利益率','7.9%','13.2%','(2.8%)','7.8%'],
      ['現金轉換率¹','76.7%','68.6%','n/a','25.0%'],
      ['應收帳款週轉天數（天）','58','52','49','70'],
      ['淨負債 ÷ EBITDA²','2.0×','2.4×','n/m','1.35×']
    ]},
    `<p class="small" style="color:var(--muted)">Arjo 和 Embla 取自其2024年報告；Invacare 取自其2021年 10-K；BraceWorks 取自第1單元。營業利益率為 EBIT ÷ 營收。¹ 扣除利息和所得稅後的營業活動現金流量 ÷ EBITDA；這裡引用的 Invacare 10-K 數字不含 EBITDA。² Arjo 用調整後EBITDA，Embla 用特殊項目前EBITDA；Invacare 處於虧損，比率沒有意義（n/m）。Embla 的現金比率使用營業活動淨現金流量（$1.16億），和 Arjo 的數字一樣是扣除利息和所得稅之後。Embla 的「cash generated by operations」（$1.6億）是扣除之前，用它會得到95%。</p>`,
    W('自己算三個比率', function(el,ctx){
      const T=[
        {q:'Invacare 2021年營業利益率：營業利益（−24.2）÷ 銷貨淨額（872.5）',ans:-2.8,tol:0.1,unit:'%',why:'虧損相當於營收的2.8%。扣掉 $2,860萬 的商譽減損，約為 +0.5%：勉強高於損益兩平，這還是在現金問題出現之前。'},
        {q:'Invacare 2021年存貨週轉天數：存貨（144.3）÷ 銷貨成本（872.5 − 239.1 = 633.4）× 365',ans:83,tol:1.5,unit:'天',why:'約83天，2020年約70天。多出14天的存貨，大約是 $2,400萬 的現金躺在倉庫裡。'},
        {q:'Embla 2024年營業利益率：EBIT（113.2）÷ 銷貨淨額（854.9）',ans:13.2,tol:0.1,unit:'%',why:'Embla 每一美元營收可留下13美分的營業利益，BraceWorks 是7.8美分，Arjo 是7.9美分。'}
      ];
      const S=ctx.state; S.cmp=S.cmp||{};
      el.innerHTML=T.map((t,i)=>`<div class="hunt-i" data-i="${i}"><div class="hunt-q">${t.q}</div><div class="hunt-row"><input class="hunt-in" type="text" inputmode="decimal" aria-label="你的答案" id="${ctx.uid('c'+i)}"><span class="hunt-u">${t.unit}</span><button type="button" class="btn small">檢查</button></div><div class="hunt-fb" hidden></div></div>`).join('');
      el.querySelectorAll('.hunt-i').forEach(row=>{ const i=+row.dataset.i, t=T[i], inp=row.querySelector('input'), fb=row.querySelector('.hunt-fb'), b=row.querySelector('button');
        const ok=()=>{ row.classList.add('is-ok'); inp.value=String(t.ans); inp.disabled=true; b.disabled=true; fb.hidden=false; fb.innerHTML=`<p><strong>答對了。</strong> ${t.why}</p>`; };
        if(S.cmp[i]) ok();
        const go=()=>{ const v=parseFloat(String(inp.value).replace(/^\((.*)\)$/,'-$1').replace(/[%,\s]|days?/gi,'')); if(isNaN(v)){ fb.hidden=false; fb.innerHTML='<p>請輸入數字。</p>'; return; }
          if(Math.abs(v-t.ans)<=t.tol){ S.cmp[i]=1; ctx.save(); ok(); } else { fb.hidden=false; fb.innerHTML=`<p><strong>不太對。</strong> ${t.ans<0&&v>0?'注意正負號：營業虧損會得出負的利潤率。':''}檢查一下公式，並記得乘以 ${t.unit==='%'?'100':'365'}。</p>`; } };
        b.onclick=go; inp.addEventListener('keydown',e=>{ if(e.key==='Enter') go(); }); });
    }),
    Q('Invacare 向客戶收款的速度（49天）比 BraceWorks（70天）快，卻還是破產了。這告訴我們什麼？',['應收帳款週轉天數不重要','沒有任何單一比率能說出全貌：Invacare 的問題是虧損、燒錢和負債，而不是收款','BraceWorks 快要倒了','Invacare 的數字有錯'],1,'要把比率當成一組來看，而且要看好幾年。一個好看的比率，旁邊可能就坐著好幾個致命的比率。'),
    K('比較的三條規則',
      `<ol><li><strong>比較比率，不要比較金額。</strong>規模和幣別的影響就會消失。</li><li><strong>檢查定義。</strong>「調整後」、「特殊項目前」、「營業現金」：每家公司劃線的位置都不同。去讀定義那一頁。</li><li><strong>比較相似的商業模式，並看三年。</strong>以租賃為主的公司或連鎖診所，毛利率永遠會高於賣給經銷商的製造商。一年可能是偶然；三年才構成趨勢。</li></ol>`)
  ]},
  /* ------------------------------------------------------------ 7 */
  {id:'quiz', label:'測驗', kind:'quiz', title:'檢查你的理解', blocks:[
    Q('年報的哪個部分經過查核？',['全部內容','財務報表及其附註','董事長致股東信和重點摘要','只有永續報告'],1,'會計師的意見涵蓋報表和附註。前半部是管理階層自己的呈現，不過會計師會閱讀它，確認是否與報表一致。'),
    Q('Arjo 在2022、2023和2024年都列報了「特殊項目」，而其調整後EBITDA把它們加回。合理的解讀是什麼？',['忽略它們：它們是特殊的','把每年都會出現的成本視為正常營運成本的一部分，也要看未調整的數字','把它們加到營收裡','它們證明公司快要倒了'],1,'一項每年都出現的「特殊」成本，其實就是貼了好聽標籤的正常成本。'),
    Q('內生成長排除了什麼？',['漲價','匯率變動的影響，以及收購或出售業務的影響','新產品','對新客戶的銷售'],1,'內生成長顯示你原有的業務表現如何。'),
    Q('Invacare 2020年列報營業利益 $1,130萬，其中包含出售一項業務的 $980萬 利益。基本面數字是多少？',['$2,110萬','約 $150萬','$1,130萬','虧損 $980萬'],1,'把一次性利益拿掉，才能看出本業賺了多少。'),
    Q('Invacare 出問題最早、最可靠的警訊是什麼？',['2022年報告中關於繼續經營的用語','自由現金流量為負，年復一年靠展延負債支應','2022年紐約證券交易所的通知','聲請破產'],1,'正式的警告最後才來。現金流量表和負債附註從2019年就顯示出這個模式。'),
    Q('你想比較 Arjo（以 SEK 報導）和 Embla（以美元報導）。最好的方法是什麼？',['全部用今天的匯率換算','比較利潤率和應收帳款週轉天數等比率，並使用一致的定義','比較營收總額','做不到'],1,'比率消除了幣別和規模的影響。一致的定義消除其餘的雜訊。'),
    Q('去哪裡可以免費取得一家英國非上市競爭對手的財務報表？',['向它的會計師要','Companies House（英國公司註冊署）','英國稅務機關','拿不到'],1,'每家英國公司都要向 Companies House 申報財務報表，可在線上免費查閱。小型公司可能只申報簡式版本。'),
    Q('一份查核報告中有一段標題為「與繼續經營有關之重大不確定性」（Material uncertainty related to going concern）。這代表什麼？',['財務報表有錯','會計師同意財務報表，但公司能否繼續經營存在重大疑慮：去讀它所指向的附註','公司被罰款了','查核沒有完成'],1,'查核意見仍可能是乾淨的。這一段會指向說明疑慮的附註，而那往往是整份報告中最重要的一頁。')
  ]},
  /* ------------------------------------------------------------ 8 */
  {id:'apply', label:'練習', kind:'apply', title:'自己讀一份真實的報告', blocks:[
    `<p>現在挑一份報告自己讀一遍：競爭對手、大客戶、主要供應商，或你自己公司經查核的財務報表。<strong>年報閱讀器</strong>範本會幫你算比率並標出警訊。它預先填入了 Invacare 2019至2022年的數字，讓你看看警示燈是怎麼亮起來的。</p>`,
    {t:'live', render(box){
      const f='annual-report-reader.xlsx', d=(BW.tmplData||{})[f];
      box.innerHTML=`<div class="tmpl" style="max-width:520px"><div class="tmpl-h"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h4"/><circle cx="17" cy="17" r="3"/><path d="M19.2 19.2l2 2"/></svg><div><h4>年報閱讀器</h4><div class="tmpl-f">${f}</div></div></div><p>從任何一份年報輸入三到四年的數字。範本會算出利潤率、現金轉換率、自由現金流量、營運資金天數、負債比率和商譽占比，並標出本單元介紹過的警訊。</p><div class="tmpl-a"><button type="button" class="btn small" ${d?'':'disabled'}>下載 .xlsx</button><span class="small tmpl-s" role="status" aria-live="polite"></span></div></div>`;
      const b=box.querySelector('button'), st=box.querySelector('.tmpl-s');
      b.onclick=()=>{ const bin=atob(d), u=new Uint8Array(bin.length); for(let i=0;i<bin.length;i++) u[i]=bin.charCodeAt(i); b.disabled=true;
        BW.saveFile(f,new Blob([u],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}),t=>{ st.textContent=t; }).finally(()=>{ b.disabled=false; }); };
    }},
    CHECK('m21-read','我對一份真實報告的20分鐘閱讀',[
      '讀查核報告：查核意見、有無繼續經營或強調事項段落、關鍵查核事項',
      '現金流量表：營業活動現金流量對比獲利、資本支出、自由現金流量、缺口如何補上',
      '資產負債表：現金、負債和權益的趨勢；應收帳款和存貨對比營收；商譽對比權益',
      '損益表：營收成長、毛利率趨勢、一次性的利益或成本',
      '附註：營運部門、負債到期日、收購與商譽、負債準備、關係人、期後事項',
      '管理階層自訂的指標：找到定義，以及與經查核數字的調節',
      '前半部：至少用數字檢驗了管理階層的三個說法',
      '寫下三句話：公司表現如何、最大的風險是什麼、明年我會關注什麼'
    ]),
    REPORT('你的週一早晨請求',
      `<p>請你的會計人員提供<strong>去年完整的經查核財務報表</strong>：每一個附註、查核報告，以及會計師寄來的管理建議書。然後對你自己的公司做一次20分鐘閱讀。放款人或買方光看這幾頁，會得出什麼結論？</p>`),
    TIP('適合練習的報告',
      `<ul><li><strong>Arjo</strong> 和 <strong>Embla Medical</strong>：本單元用過的公司；試試它們的2023年報告，並做比較。</li><li><strong>Getinge</strong>（瑞典）：醫院設備，可說是 Arjo 規模更大的表親。</li><li><strong>Enovis</strong>（美國，10-K 在 EDGAR 上）：旗下擁有 DJO，一個大型骨科護具品牌。</li><li><strong>一家英國競爭對手</strong>，從 Companies House 找：搜尋床墊或行動輔具製造商，閱讀它申報的財務報表。</li><li><strong>一家菲律賓上市公司</strong>，在 PSE EDGE 上找：任何一家製造商都行，看看依 PFRS 編製的本地報導。</li></ul>`),
    `<p>若想多練習閱讀<em>月度</em>管理報告，四份 BraceWorks 練習包就在工具箱選單的<strong>練習包</strong>底下。</p>`
  ]}
  ],
  warnings:[
    {sign:'每年都有「特殊」或「非經常性」項目', meaning:'把正常成本包裝成一次性項目，以美化調整後獲利。', look:'三年的特殊項目；未調整的獲利。'},
    {sign:'調整後獲利上升，現金轉換率卻下降', meaning:'獲利被綁在應收帳款和存貨裡，或者並非真正的現金。', look:'現金流量表；營運資金各行。'},
    {sign:'一再以換發較晚到期票據的方式為負債再融資', meaning:'公司無法用現金還債；它是在爭取時間。', look:'負債附註中的到期日；自由現金流量。'},
    {sign:'權益減少得比帳上虧損還快', meaning:'有其他損失直接進入權益：匯率、退休金或融資成本。', look:'權益變動表。'},
    {sign:'商譽大於權益', meaning:'一次減損就可能抹去股東大部分的緩衝。', look:'商譽附註及減損測試的假設。'},
    {sign:'年報延遲申報', meaning:'往往是查核出問題或公司陷入危機的跡象。', look:'申報日期；查核報告；繼續經營附註。'}
  ],
  formulas:[
    {name:'內生成長', f:'營收成長 − 收購與處分業務的影響 − 匯率影響', ex:'Embla 2024年：帳面9% − 收購3% − 匯率0% = 6%'},
    {name:'商譽占資產比例', f:'商譽 ÷ 總資產', ex:'Embla 2024年：$7.76億 ÷ $15.39億 = 50%'},
    {name:'經常性收入占比', f:'（租賃 + 服務 + 耗材營收）÷ 總營收', ex:'Arjo 2024年：25% + 20% + 16% = 61%'}
  ],
  glossary:[
    {term:'年報（Annual report）', def:'公司每年給股東的報告：前面是管理階層的回顧，後面是經查核的財務報表和附註。'},
    {term:'10-K年報（Form 10-K）', def:'美國上市公司向美國證券交易委員會申報的年報，可在 EDGAR 上免費查閱。'},
    {term:'替代性績效衡量指標（Alternative performance measure, APM）', def:'管理階層使用、但會計準則沒有定義的數字，例如調整後EBITDA或內生成長。應該調節到經查核的數字。'},
    {term:'內生成長（Organic growth）', def:'排除匯率影響及收購或出售業務後的營收成長：顯示既有業務的表現。'},
    {term:'調整後EBITDA（Adjusted EBITDA）', def:'把管理階層認為屬於特殊或一次性的成本加回後的EBITDA。要檢查加回了什麼，以及它是否每年重複出現。'},
    {term:'特殊項目（Exceptional items）', def:'公司視為不尋常而單獨列示的成本或利益，例如重組或收購成本。也稱為 special items 或 items affecting comparability（影響可比較性之項目）。'},
    {term:'關鍵查核事項（Key audit matters）', def:'上市公司查核報告中，會計師判斷最重要的領域。在美國稱為 critical audit matters。'},
    {term:'與繼續經營有關之重大不確定性（Material uncertainty related to going concern）', def:'查核報告中的一段，說明公司能否繼續經營存在重大疑慮，並指向說明原因的附註。'},
    {term:'營運部門資訊（Segment reporting）', def:'依管理階層經營公司的方式，按業務線或地區拆分營收和經營成果的附註。'},
    {term:'企業合併（Business combination）', def:'收購一項業務。附註會顯示付了多少、怎麼付，以及其中多少成為商譽。'},
    {term:'可轉換票據（Convertible notes）', def:'持有人可以換成股份的債券。如果沒有轉換，到期時就必須以現金償還。'},
    {term:'美國破產法第11章（Chapter 11）', def:'美國的破產程序，讓公司在法院保護下一邊繼續營運、一邊重整負債。'},
    {term:'權益變動表（Statement of changes in equity）', def:'列出一年中所有改變股東權益之項目的報表：損益、股利、發行新股，以及其他利益或損失。'},
    {term:'經常性收入（Recurring revenue）', def:'不需要每次重新成交就會重複發生的營收，例如租賃、服務合約和耗材。'},
    {term:'淨附息負債（Net interest-bearing debt）', def:'所有需支付利息的借款（通常包括租賃）減去現金。'}
  ]
});
})();
