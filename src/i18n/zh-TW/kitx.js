/* Toolkit extras: downloadable Excel templates + questions-to-ask bank. Appended as Toolkit sections 3 and 4. */
(function(){
const secIx=(m,s)=>{ const mod=BW.mods[m]; if(!mod) return 0; const i=mod.sections.findIndex(x=>x.id===s); return i<0?0:i; };
const modName=m=>{ const mod=BW.mods[m]; const n=m==='cap'?'總結專題':'第'+BW.modNo(m)+'單元'; return mod?`${n}：${mod.title}`:n; };
const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ---------- saving files ---------- */
const XLSX='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
function b64Blob(b64,type){ const bin=atob(b64); const u=new Uint8Array(bin.length); for(let i=0;i<bin.length;i++) u[i]=bin.charCodeAt(i); return new Blob([u],{type}); }
let dlP=null;
function getDownloads(){ if(!dlP) dlP=(window.claude&&typeof window.claude.use==='function')?Promise.resolve(window.claude.use('downloads')).catch(()=>null):Promise.resolve(null); return dlP; }
async function saveFile(filename,data,say){
  say('正在準備檔案…');
  const d=await getDownloads();
  if(d){
    try{ const r=await d.save({filename,data}); say(r&&r.status==='delivered'?'已傳送。':'已下載，請查看你的下載資料夾。'); }
    catch(e){ const c=e&&e.code;
      if(c==='declined') say('已取消下載。');
      else if(c==='rate_limited') say('另一個下載正在等待你的回應。請先完成那一個，再試一次。');
      else say('這個檢視畫面無法下載。請在Claude應用程式或網頁瀏覽器中開啟課程，再試一次。'); }
    return;
  }
  try{
    if(!(window.URL&&URL.createObjectURL)) throw 0;
    const blob=data instanceof Blob?data:new Blob([data],{type:'text/plain'});
    const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=filename; document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(url),5000);
    say(window.claude?'如果沒有開始下載，表示這個檢視畫面封鎖了下載。請在Claude應用程式或網頁瀏覽器中開啟課程，再試一次。':'已下載，請查看你的下載資料夾。');
  }catch(_){ say('這個檢視畫面無法下載。請在Claude應用程式或網頁瀏覽器中開啟課程，再試一次。'); }
}
BW.saveFile=saveFile;

/* ---------- templates ---------- */
const T=[
  {file:'13-week-cash-forecast.xlsx',title:'13週現金流量預測',icon:'cash',m:'m10',s:'cash13',
   what:'逐週列出收款、付款、期末現金，以及相對於透支額度的可用額度餘裕，並標示出最低點。',
   sheets:['預測','上週實際與預測比較'],when:'每週一。每次往前滾動一週。'},
  {file:'budget-builder.xlsx',title:'預算編製工具',icon:'budget',m:'m15',s:'build',
   what:'在同一張工作表上設定價格、銷量、季節性、調薪和間接費用。產出每月損益表、損益兩平銷售額，以及年底現金估計。',
   sheets:['假設','預算損益表','現金摘要'],when:'每年一次，之後每季重新預測。'},
  {file:'kpi-dashboard.xlsx',title:'KPI儀表板',icon:'kpi',m:'m11',s:'dash',
   what:'十項KPI，各有目標、負責人、12個月趨勢和紅／黃／綠燈號。從月度管理報告輸入幾個數字，KPI就會自動計算。',
   sheets:['儀表板','每月輸入'],when:'每月，月報送達當天。'},
  {file:'export-quote-calculator.xlsx',title:'出口報價計算器',icon:'quote',m:'m12',s:'price',
   what:'讓報價涵蓋國貿條規、佣金、付款條件和匯率風險。顯示達到目標利潤率的價格、零利潤價格和底價。',
   sheets:['報價'],when:'每一筆超出正常定價條件的報價。'},
  {file:'month-end-close-checklist.xlsx',title:'月結檢核表',icon:'check',m:'m2',s:'close',
   what:'20個結帳步驟，各有負責人、到期日、完成日期和狀態。逾期步驟會變成紅色，並以進度數字顯示離完成還有多遠。',
   sheets:['檢核表'],when:'每次月結。請財務部門隨月報一併提供。'},
  {file:'equipment-purchase-proposal.xlsx',title:'設備採購提案',icon:'capex',m:'m14',s:'methods',
   what:'一頁式投資評估：NPV、IRR、回收期間，以及「如果效益少30%會怎樣」的測試，並附白話的建議。',
   sheets:['提案'],when:'任何超過你核決金額上限的採購。'},
  {file:'three-statement-forecast.xlsx',title:'三表預測模型',icon:'budget',m:'m22',s:'build',
   what:'三年期預測，損益表、資產負債表和現金流量表彼此連動。透支會自動平衡，工作表也會檢查財務承諾條款以及是否平衡。',
   sheets:['假設','預測'],when:'編製年度預算、向銀行申請，或做重大決策之前。'},
  {file:'annual-report-reader.xlsx',title:'年報解讀工具',icon:'reader',m:'m21',s:'apply',
   what:'輸入任何年報最多四年的數字，即可得到利潤率、現金轉換率、自由現金流量、營運資金週轉天數、負債比率和九項警訊。預先填入Invacare真實的10-K年報數字。',
   sheets:['輸入','比率與警訊'],when:'與大客戶、供應商、競爭對手或貸款銀行會面之前，以及每年針對自家帳務做一次。'}
];
const ICON={
  cash:'<path d="M4 17l5-5 4 3 7-8"/><path d="M15 7h5v5"/>',
  budget:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>',
  kpi:'<circle cx="12" cy="13" r="8"/><path d="M12 13l4-4"/><path d="M12 5v2"/>',
  quote:'<path d="M3 7h13l5 5-5 5H3z"/><circle cx="8" cy="12" r="1.6"/>',
  check:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 9l2 2 4-4M8 16h8"/>',
  capex:'<rect x="3" y="9" width="18" height="10" rx="1"/><path d="M7 9V5h10v4M8 14h3"/>',
  reader:'<rect x="4" y="3" width="13" height="18" rx="2"/><path d="M7 8h7M7 12h5"/><circle cx="17" cy="16" r="3.2"/><path d="M19.4 18.4l2 2"/>'
};
const tmplSec={id:'tmpl',label:'範本',kind:'learn',title:'可下載的Excel範本',blocks:[
  `<p>八個依本課程建立、可直接使用的Excel檔案。其中七個預先填入BraceWorks的範例數字，年報解讀工具則填入一家真實公司的數字，讓你在輸入自己的數字之前，先看看應該呈現的樣子。每個檔案都以一張<strong>使用說明</strong>工作表開頭。</p>`,
  {t:'live',cls:'tmpl-grid',render(box){
    const have=BW.tmplData||{};
    box.innerHTML=T.map((x,i)=>`<article class="tmpl"><div class="tmpl-h"><svg viewBox="0 0 24 24" aria-hidden="true">${ICON[x.icon]}</svg><div><h4>${x.title}</h4><div class="tmpl-f">${x.file}</div></div></div>
      <p>${x.what}</p>
      <dl class="tmpl-m"><div><dt>工作表</dt><dd>${x.sheets.join(' · ')}</dd></div><div><dt>使用時機</dt><dd>${x.when}</dd></div><div><dt>學習內容</dt><dd><button type="button" class="linkbtn" data-go="${i}">${modName(x.m)}</button></dd></div></dl>
      <div class="tmpl-a"><button type="button" class="btn small" data-dl="${i}" ${have[x.file]?'':'disabled'}><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" style="fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round"><path d="M12 4v11M7 10l5 5 5-5M5 20h14"/></svg>下載 .xlsx</button><span class="tmpl-s small" role="status" aria-live="polite"></span></div></article>`).join('');
    box.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>{ const x=T[+b.dataset.go]; BW.go(x.m,secIx(x.m,x.s),{jump:true}); });
    box.querySelectorAll('[data-dl]').forEach(b=>b.onclick=()=>{ const x=T[+b.dataset.dl]; const st=b.parentNode.querySelector('.tmpl-s'); const say=t=>{ st.textContent=t; };
      b.disabled=true; saveFile(x.file,b64Blob(have[x.file],XLSX),say).finally(()=>{ b.disabled=false; }); });
  }},
  {t:'callout',tone:'tip',title:'範本的顏色標示方式',html:`<ul><li><strong style="color:#0000ff;background:#ffff00;padding:0 4px">黃底藍字</strong>：輸入欄位。在這裡輸入你自己的數字。</li><li><strong>黑字</strong>：公式。不要覆寫，否則工作表會停止計算。</li><li><strong style="color:#008000">綠字</strong>：從其他工作表帶入的數字。</li></ul><p>這是大多數財務團隊採用的慣例。如果你的會計人員會建立模型，也請他們遵循：你就永遠知道哪些數字是假設、哪些是結果。</p>`},
  {t:'callout',tone:'report',title:'變成你自己的工具',html:`<p>從<strong>13週現金流量預測</strong>和<strong>KPI儀表板</strong>開始。請財務團隊每週、每月填寫，並隨月報一併提供。三個月後你就會有趨勢資料，也會知道哪些預測值得信任。</p><p>這些檔案是為Microsoft Excel製作的。也能在Google試算表和Apple Numbers中開啟，但部分功能（例如顏色警示）在那裡的顯示可能不同。</p>`}
]};

/* ---------- question bank ---------- */
const QB=[
 {g:'月度管理報告',qs:[
  ['為什麼上個月的現金變動和利潤不一樣？','三、四個具名項目並附金額：「應收帳款增加$20k，因為美國訂單尚未收款；我們付了$12k的機器訂金。」','「只是時間差。」沒有項目，也沒有金額。','m1','connect'],
  ['這份報告中我最該擔心的三件事是什麼？各自正在怎麼處理？','具體的問題，每項都有負責人和日期。','每個月都說「一切正常」，或列出15件小事。','m9','comment'],
  ['這個月哪些數字是估計值？金額有多大？','一份簡短清單：應計項目、存貨評價、保固負債準備，各附金額。','「沒有」：每個月都有估計值。','m2','close'],
  ['月結在第幾個工作天完成？銀行、應收帳款、應付帳款和存貨都調節了嗎？','一個日期（以你們的規模，第5到第8個工作天算好），且各項調節都已簽核。','「我們年底才調節。」','m2','close'],
  ['和上個月的預測相比有什麼變化？為什麼？','解釋兩、三個最大的變動，並更新預測。','根本沒有可比較的預測。','m15','fcst']]},
 {g:'現金與借款',qs:[
  ['未來13週內，我們的可用額度餘裕最低是多少？在哪一週？','一個金額和一個週次，再加上如果吃緊時要怎麼做。','「不會有問題的。」沒有13週預測。','m10','cash13'],
  ['哪些客戶付款晚於信用條件？逾期超過60天的有多少？','從帳齡分析列出名稱和金額，每一筆都有處理計畫。','只有應收帳款總額。','m10','aging'],
  ['應收帳款、存貨和應付帳款占住了多少天的現金？情況在改善還是惡化？','以天數表示的現金轉換循環，並與上一季比較。','沒有人追蹤。','m16','ccc'],
  ['我們離每一項銀行財務承諾條款有多近？','每項條款的限額、我們的數字和緩衝空間。','「我得去查一下借款合約。」','m17','bank'],
  ['我們對哪些供應商延遲付款？其中有沒有可能停止供貨的？','一份簡短清單，列出延遲天數和對供貨的風險。','習慣性延遲付款，卻沒有計畫。','m16','levers']]},
 {g:'利潤率與定價',qs:[
  ['過去12個月每個月的毛利率是多少？為什麼會變動？','一條趨勢線加上原因：價格、材料成本、產品組合、報廢。','只有數字，沒有「為什麼」。','m3','margins'],
  ['上個月運費、折扣、回饋和報廢花了我們多少，占銷售額的百分比是多少？','每一項流失分別列示，並與目標比較。','全部埋在「銷貨成本」裡。','m3','leaks'],
  ['我們上次漲價是什麼時候？材料成本的漲幅轉嫁了多少？','日期、漲幅百分比，以及有多少客戶接受。','「我們不想流失客戶。」','m12','raise'],
  ['我們每月的損益兩平銷售額是多少？目前高出多少？','一個每月數字，以及以百分比表示的安全邊際。','沒有區分固定成本和變動成本。','m12','be'],
  ['哪些產品和客戶在每個瓶頸工時賺得最少？','依每瓶頸工時邊際貢獻排序，而非依營業收入。','只依營業收入排序。','m13','bottle']]},
 {g:'成本與存貨',qs:[
  ['這項產品的單位成本是怎麼組成的？上次更新是什麼時候？','材料、人工、製造費用和運費，且在過去12個月內更新過。','多年前設定、沒人說得清楚的成本。','m6','build'],
  ['哪些存貨六個月沒有動過？價值多少？','依品項列出價值和處理計畫：使用、出售或沖銷。','「總有一天會賣掉的。」','m7','health'],
  ['這個月利潤上升，是不是只因為我們多生產了存貨？','單獨列示吸收進存貨的製造費用，並比較生產量與銷售量。','沒人知道製造費用是怎麼分攤的。','m7','absorb'],
  ['和標準成本相比，最大的差異有哪些？各由誰負責？','價格、數量和效率差異，各有負責人和原因。','只有一行「銷貨成本差異」。','m8','split'],
  ['品質問題讓我們付出多少：報廢、重工、退貨和客訴？','每個月一個品質成本數字。','報廢只計算數量，從不換算成金額。','m8','coq']]},
 {g:'客戶與出口',qs:[
  ['如果美元相對我們主要的幣別變動10%，利潤會怎樣？','依幣別列出金額，以及哪些已經避險。','「我們用美元開發票，所以沒有風險」（檢查一下你的成本）。','m17','fx'],
  ['哪些客戶採記帳交易？其中有多少有信用保險或信用狀保障？','依客戶列出暴險金額、保障範圍和額度。','大型新客戶採記帳交易，卻沒有任何查核。','m17','pay'],
  ['每個大客戶採用哪一種國貿條規？我們的報價有沒有包含隨之而來的所有成本？','依客戶列出國貿條規，並與報價中的運費和保險相符。','以EXW的價格報CIF或DAP。','m17','inco'],
  ['最大客戶占銷售額多少？如果他們離開，計畫是什麼？','百分比和一個切實可行的計畫。','超過25%卻沒有計畫。','m11','set']]},
 {g:'投資與籌資',qs:[
  ['NPV和回收期間是多少？如果效益少30%會怎樣？','以我們的資金成本計算的NPV、回收期間，且敏感度情境仍為正值。','只看回收期間，而且用最樂觀的節省金額。','m14','methods'],
  ['誰負責實現這些節省？什麼時候檢查是否真的做到了？','一位具名負責人，以及12個月後的檢討日期。','「節省自然會出現。」','m14','play'],
  ['這筆支出該用中長期貸款、租賃還是透支來支應？','長期資產用長期資金支應。','用透支買機器。','m20','sources'],
  ['在違反財務承諾條款之前，我們還能再借多少？','一個金額，依EBITDA和條款限額計算。','對舉債能力毫無概念。','m20','capacity'],
  ['考量未來13週的現金需求和財務承諾條款後，我們發得起這筆股利嗎？','納入股利的13週預測，以及條款測試結果。','「利潤就在那裡」，卻沒有檢查現金。','m20','case']]},
 {g:'稅務',qs:[
  ['去年我們的有效稅率是多少？為什麼和名目稅率不同？','一份調節表：租稅優惠、不可扣除的費用、使用的虧損扣抵。','「稅就是會計師說了算。」','m19','profit'],
  ['有多少加值稅在等待退稅？哪些申請快到期限了？','依期間列出金額和申報日期。','因為「文書作業太多」而從未申請退稅。','m19','vat'],
  ['我們符合出口租稅優惠的資格嗎？比較過各種選項了嗎？','我們符合資格的優惠，以及各自能節省的稅額。','「我們一直都是這樣做的。」','m19','logic'],
  ['每一筆境外付款，我們都扣繳了正確的稅款嗎？','一份境外付款清單（權利金、勞務費、利息）及扣繳稅額。','付給國外顧問全額，沒有任何審查。','m19','cross'],
  ['未來12個月的繳稅日期都放進現金預測了嗎？','每個日期和金額都列在預測中。','稅單總是突然出現。','m19','profit']]},
 {g:'判斷',qs:[
  ['哪三項估計對我們的利潤影響最大？各自合理變動會造成什麼影響？','具名的估計及其金額影響：「保固率增減0.5%，影響$2,500。」','「一切都是標準做法。」','m24','estimates'],
  ['我們如何決定一批出貨算在哪個月？回饋和退貨如何估計？','依國貿條規訂定的書面截止規則，以及依各級距每月估列的銷貨回饋。','回饋在付款時才入帳；銷售在月底暴增。','m24','revenue'],
  ['今年我們資本化了哪些項目？依據什麼規則？','依專案和資產列出的清單，附政策和門檻。','維修或開發支出被擱在資產負債表上，卻沒有清單。','m24','capitalise'],
  ['我們的保固負債準備率還符合實際的索賠情況嗎？','索賠歷史與負債準備的比較，每季檢討。','多年來都用同一個比率，不管索賠怎麼變化。','m24','provisions'],
  ['我們採用哪一套財務報導架構？它如何處理我們的租賃？','說出架構名稱，以及對EBITDA、負債和財務承諾條款的影響。','沒有人確定。','m24','rules']]},
 {g:'成長為跨國企業',qs:[
  ['集團月報在第幾個工作天送達？最大的延誤原因是什麼？','一個工作天數字（約第10天算好），以及拖慢進度的那一個步驟。','「要看是哪些國家。」','m25','close'],
  ['集團內部往來餘額是否在月底前由每一對公司確認一致？','是，並有關於截止、匯率和結算的書面政策。','差異一個月接一個月地延續下去。','m25','ic'],
  ['我們在每個國家持有多少現金？有沒有某家公司在借款，而另一家卻有盈餘？','依公司、銀行和幣別的每週報告。','不逐一詢問各國就沒人說得出來。','m26','visibility'],
  ['我們的避險政策允許什麼？目前的避險部位有在範圍內嗎？','避險在限額內、全是單純商品，每月報告其市價。','「今年資金部門又賺錢了。」','m26','fx'],
  ['如果明天買方的會計師檢視我們的EBITDA，他們會調整什麼？','一份附有佐證的加回調整清單，以及哪些經不起檢驗。','「我們的調整後EBITDA就是這樣。」','m28','qoe']]},
 {g:'控制與查核',qs:[
  ['誰可以新增供應商或變更銀行帳戶資料？誰負責檢查？','兩個不同的人，並回撥到已知的電話號碼確認。','同一個人兩件事都能做。','m18','fraud'],
  ['會計師的管理建議書寫了什麼？哪些已經改善？','每一點都有負責人、日期和狀態。','沒有人讀過。','m18','audit'],
  ['會計師做了哪些調整？為什麼我們每月的數字沒有發現？','列出調整，以及為避免再次發生而對月結做的改變。','每年年底都有重大意外。','m18','audit'],
  ['我們帳上哪些估計的風險最高？','保固、呆滯存貨和呆帳，以及各自如何計算。','沒人能解釋的估計值。','m4','judgement'],
  ['我們與股東或其關係企業有沒有往來？是否符合市場條件？','一份經核准並已揭露的清單。','借錢給股東卻沒有任何文件。','m18','governance']]}
];
const qbText=()=>'向財務團隊提出的問題\n出自《The GM’s Ledger》課程\n\n'+QB.map(g=>g.g.toUpperCase()+'\n'+g.qs.map((q,i)=>`${i+1}. ${q[0]}\n   好的回答：${q[1]}\n   警訊：${q[2]}\n   （${modName(q[3])}）`).join('\n')).join('\n\n')+'\n';
const askSec={id:'ask',label:'該問的問題',kind:'learn',title:'向財務團隊提出的問題',blocks:[
  `<p>懂財務的總經理會問的問題，依主題分組，每題都附上好的回答聽起來是什麼樣子，以及需要留意的警訊。每次月度檢討會議挑兩、三題來問就好，不必一次全部問完。</p>`,
  {t:'live',cls:'qb',render(box,ctx){
    let topic='', q='';
    const total=QB.reduce((n,g)=>n+g.qs.length,0);
    box.innerHTML=`<div class="qb-bar"><label class="sr" for="${ctx.uid('s')}">搜尋問題</label><input class="search" id="${ctx.uid('s')}" type="search" placeholder="搜尋，例如「利潤率」或「加值稅」" autocomplete="off"><button type="button" class="btn ghost small qb-dl">下載為文字檔</button></div><div class="az qb-t" role="group" aria-label="依主題篩選"></div><div class="qb-c small" style="color:var(--muted)"></div><span class="qb-s small" role="status" aria-live="polite"></span><div class="qb-list"></div>`;
    const tb=box.querySelector('.qb-t'), list=box.querySelector('.qb-list'), inp=box.querySelector('input'), cnt=box.querySelector('.qb-c');
    ['全部'].concat(QB.map(g=>g.g)).forEach((name,ix)=>{ const b=document.createElement('button'); b.type='button'; b.textContent=name; b.setAttribute('aria-pressed',String(ix===0)); b.onclick=()=>{ topic=ix?name:''; tb.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',String(x===b))); draw(); }; tb.appendChild(b); });
    const draw=()=>{ const qq=q.trim().toLowerCase(); let n=0;
      list.innerHTML=QB.filter(g=>!topic||g.g===topic).map(g=>{ const rows=g.qs.map((x,i)=>({x,i})).filter(({x})=>!qq||x.slice(0,3).join(' ').toLowerCase().includes(qq)); n+=rows.length; if(!rows.length) return '';
        return `<section class="qb-g"><h4>${g.g}</h4>${rows.map(({x,i})=>`<details class="qb-q"><summary>${esc(x[0])}</summary><div class="qb-a"><p><span class="qb-ok">好的回答</span>${esc(x[1])}</p><p><span class="qb-no">警訊</span>${esc(x[2])}</p><button type="button" class="linkbtn" data-m="${x[3]}" data-s="${x[4]}">${modName(x[3])}</button></div></details>`).join('')}</section>`; }).join('')||'<p>沒有符合的問題。試試較短的關鍵字。</p>';
      cnt.textContent=qq||topic?`${total}題中的${n}題`:`共${total}題`;
      list.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>BW.go(b.dataset.m,secIx(b.dataset.m,b.dataset.s),{jump:true})); };
    inp.addEventListener('input',()=>{ q=inp.value; draw(); });
    const st=box.querySelector('.qb-s'), dl=box.querySelector('.qb-dl');
    dl.onclick=()=>{ dl.disabled=true; saveFile('questions-to-ask-finance.txt',qbText(),t=>{ st.textContent=t; }).finally(()=>{ dl.disabled=false; }); };
    draw();
  }},
  {t:'callout',tone:'tip',title:'怎麼問才不會像在查帳',html:`<p>帶著好奇而不是懷疑去問：「幫我了解一下……」比「你為什麼沒有……」有效得多。在會議前先告知要問的問題，讓團隊能準備真正的答案。如果答案是「我們還不知道」，就約定一個日期。這是好結果：你在問題找上你之前，先找到了缺口。</p>`}
]};
BW.kitExtra=[tmplSec,askSec];
})();
