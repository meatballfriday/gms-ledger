/* Learning design: starting diagnostic, spaced warm-ups, Pack C commentary exercise, final assessment. */
(function(){
const S=BW.state, save=BW.save;
const E=(tag,cls,html)=>{ const e=document.createElement(tag); if(cls) e.className=cls; if(html!=null) e.innerHTML=html; return e; };
const optsOf=b=>b.opts.map(o=>typeof o==='string'?{text:o}:o);
const MODS=BW.ORDER.filter(id=>id!=='cap'&&!BW.isOptional(id));  /* the core course, in teaching order (the optional multinational track is excluded) */
const mnum=id=>BW.modNo(id);              /* the number the learner sees */
const pos=id=>BW.ORDER.indexOf(id);
const plain=h=>String(h).replace(/<[^>]+>/g,'');

/* one multiple-choice question with instant feedback; returns the element */
function mcq(q,{onAnswer,reveal=true,chosen}={}){
  const box=E('div','quiz'); const opts=optsOf(q);
  box.innerHTML=`<div class="quiz-q"><span class="quiz-tag">${q.tag||'題目'}</span><p>${q.q}</p></div><div class="quiz-opts"></div><div class="quiz-why" hidden></div>`;
  const oe=box.querySelector('.quiz-opts'), why=box.querySelector('.quiz-why'); const btns=[];
  const show=c=>{ const right=c===q.a; btns.forEach((bt,j)=>{ bt.disabled=true; if(reveal){ bt.classList.toggle('is-right',j===q.a); bt.classList.toggle('is-wrong',j===c&&!right); bt.classList.toggle('is-dim',j!==q.a&&j!==c); } else { bt.classList.toggle('is-picked',j===c); bt.classList.toggle('is-dim',j!==c); } });
    if(reveal){ why.hidden=false; why.innerHTML=`<p><strong>${right?'答對了。':'不太對。'}</strong> ${opts[c].why?opts[c].why+' ':''}${q.why||''}</p>`; } };
  opts.forEach((o,j)=>{ const bt=E('button','opt',`<span class="ol">${'ABCDEF'[j]}</span><span>${o.text}</span>`); bt.type='button'; bt.onclick=()=>{ show(j); if(onAnswer) onAnswer(j,why); }; oe.appendChild(bt); btns.push(bt); });
  if(chosen!=null) show(chosen);
  box._why=why; box._btns=btns; box._unlock=()=>{ btns.forEach(bt=>{ bt.disabled=false; bt.className='opt'; }); why.hidden=true; };
  return box;
}

/* ================= Spaced-review warm-up ================= */
function quizPool(upto){
  const pool=[];
  MODS.filter(id=>pos(id)<upto).forEach(id=>{ const m=BW.mods[id]; if(!m) return;
    const visited=Object.keys(S.visited).some(k=>k.startsWith(id+'.'));
    if(!visited) return;
    m.sections.forEach((sec,si)=>{ const ki=BW.keyIdx(sec); sec.blocks.forEach((b,i)=>{ if(b&&b.t==='quiz'){ const key=`${id}.${sec.id}.${ki[i]}`; const ans=S.quiz[key]; pool.push({b,id,si,key,w:ans===undefined?2:ans!==b.a?4:1}); } }); });
  });
  return pool;
}
function seeded(seed){ let x=seed%2147483647; if(x<=0) x+=2147483646; return ()=>(x=x*16807%2147483647)/2147483647; }
BW.warmup=function(m){
  if(!/^m\d+$/.test(m.id)||pos(m.id)<2) return null;
  const pool=quizPool(pos(m.id)); if(pool.length<2) return null;
  const day=Math.floor(Date.now()/864e5); const rnd=seeded(day*31+mnum(m.id)*977);
  const pick=[]; const tmp=pool.slice();
  while(pick.length<2&&tmp.length){ const tot=tmp.reduce((t,p)=>t+p.w,0); let r=rnd()*tot, k=0; while(r>tmp[k].w){ r-=tmp[k].w; k++; } pick.push(tmp.splice(k,1)[0]); }
  const wrap=E('div','warm');
  wrap.innerHTML=`<div class="warm-h"><span class="warm-tag">暖身</span><strong>前面單元的兩道題目</strong><button type="button" class="linkbtn warm-x">隱藏</button></div><p class="small" style="margin:2px 0 10px;color:var(--muted)">回想幾週前學過的東西，才會真正記住。你以前答錯的題目會比較常出現。</p>`;
  const list=E('div','warm-list'); wrap.appendChild(list);
  pick.forEach(p=>{ const mod=BW.mods[p.id];
    const el=mcq({q:p.b.q,opts:p.b.opts,a:p.b.a,why:p.b.why,tag:`出自第${mnum(p.id)}單元`},{onAnswer:(j,why)=>{
      S.warm=S.warm||{n:0,r:0}; S.warm.n++; if(j===p.b.a) S.warm.r++; save();
      const lk=E('button','linkbtn',`複習第${mnum(p.id)}單元：${mod.sections[p.si].label}`); lk.type='button'; lk.onclick=()=>BW.go(p.id,p.si,{jump:true}); why.appendChild(lk); }});
    list.appendChild(el); });
  wrap.querySelector('.warm-x').onclick=()=>{ wrap.remove(); };
  return wrap;
};

/* ================= Starting diagnostic (home page) ================= */
const DIAG=[
 {p:1,q:'客戶支付一張 $5,000 的發票，貨品是上個月交付的。這個月的獲利會怎樣？',opts:['增加 $5,000','不變：這筆銷貨在上個月交貨時就已經認列了','減少 $5,000','要看稅率而定'],a:1},
 {p:1,q:'哪一張報表顯示企業在某一天擁有什麼、欠了什麼？',opts:['損益表','資產負債表','現金流量表','銷售報表'],a:1},
 {p:2,q:'一張床墊的「全部成本」包含哪些？',opts:['只有材料','材料和直接人工','材料、直接人工，加上分攤的製造費用','售價減去利潤'],a:2},
 {p:2,q:'工廠這個月生產的床墊比賣出的多。帳上獲利通常會怎樣？',opts:['增加，因為部分固定製造費用轉進了存貨','減少','不變','加倍'],a:0},
 {p:3,q:'一份好的月度管理報告，第一頁應該放什麼？',opts:['完整的試算表','幾個 KPI 與目標的比較，加上一段簡短的管理評述，說明哪些事需要處理','每一張開出的發票','去年經查核的財務報表'],a:1},
 {p:3,q:'應收帳款週轉天數（DSO）衡量的是……',opts:['存貨在倉庫裡放多久','客戶平均要幾天才付款','我們付款給供應商有多快','距離下一張銷售訂單還有幾天'],a:1},
 {p:4,q:'固定成本一年 $300,000，邊際貢獻率40%。損益兩平的營收是多少？',opts:['$120,000','$420,000','$750,000','$1,200,000'],a:2},
 {p:4,q:'一台 $60,000 的機器，每年可節省 $22,000，為期八年。判斷該不該買，最好的檢驗是什麼？',opts:['回收期間是否少於五年？','以我們的資金成本計算，即使節省金額比預期少，淨現值（NPV）是否仍為正數？','供應商有沒有給折扣？','銀行裡今天有沒有現金？'],a:1},
 {p:5,q:'今年獲利增加，現金卻減少。最可能的原因是什麼？',opts:['記帳錯誤','應收帳款和存貨增加得比獲利還快','稅率提高了','折舊增加了'],a:1},
 {p:5,q:'為什麼出口商常常有加值稅退稅可以申請？',opts:['出口適用零稅率，但在當地採購時要支付加值稅','出口商要繳兩次加值稅','國外客戶幫我們繳加值稅','加值稅不適用於製造商'],a:0}
];
const PARTN=[null,{n:'基礎',m:'m1'},{n:'工廠成本',m:'m6'},{n:'報表',m:'m9'},{n:'決策',m:'m12'},{n:'現金、風險與控制',m:'m16'}];
BW.homeDiag=function(){
  const sec=E('section','diag'); sec.style.marginTop='30px';
  const draw=()=>{ const d=S.diag;
    if(d&&d.done){
      const per=[1,2,3,4,5].map(p=>DIAG.map((q,i)=>({q,i})).filter(x=>x.q.p===p).reduce((t,x)=>t+(d.a[x.i]===x.q.a?1:0),0));
      const first=per.findIndex(x=>x<2); const startM=first<0?null:PARTN[first+1].m;
      sec.innerHTML=`<h2 style="margin-bottom:6px">你的起點</h2><p class="prose" style="margin:0 0 12px">從你的快速檢測來看：10題答對 ${per.reduce((a,b)=>a+b,0)} 題。${first<0?'你在整個課程範圍都有扎實的基礎。按照自己的步調學習，把大部分時間花在個案檔案和練習包上。':`從第${first+1}部分開始。標示「快速瀏覽」的部分可以加快進度。`}</p>
        <div class="diag-g">${per.map((v,i)=>`<div class="diag-p ${v===2?'ok':v===1?'mid':'low'}"><span class="eyebrow">第${i+1}部分</span><strong>${PARTN[i+1].n}</strong><span>${v===2?'快速瀏覽：你已懂基礎':v===1?'按部就班學習':'這部分放慢腳步'}</span></div>`).join('')}</div>
        <div class="row" style="margin-top:12px;gap:10px;display:flex;flex-wrap:wrap">${startM?`<button type="button" class="btn small" data-start>從第${mnum(startM)}單元開始</button>`:''}<button type="button" class="btn ghost small" data-redo>重新檢測</button></div>`;
      const st=sec.querySelector('[data-start]'); if(st) st.onclick=()=>BW.go(startM,0);
      sec.querySelector('[data-redo]').onclick=()=>{ S.diag={a:{},done:false,open:true}; save(); draw(); };
      return;
    }
    const open=d&&d.open;
    sec.innerHTML=`<h2 style="margin-bottom:6px">你該從哪裡開始？</h2><p class="prose" style="margin:0 0 12px">十道快問快答，課程每個部分各兩題，大約三分鐘。你會知道哪些部分可以快速瀏覽、哪些地方要放慢。不計分。</p>`;
    if(!open){ const b=E('button','btn small','開始3分鐘檢測'); b.type='button'; b.onclick=()=>{ S.diag={a:{},done:false,open:true}; save(); draw(); }; sec.appendChild(b); return; }
    const a=d.a||{}; const list=E('div','diag-q'); sec.appendChild(list);
    const done=E('button','btn small','查看我的起點'); done.type='button'; done.style.marginTop='12px';
    const upd=()=>{ const n=Object.keys(a).length; done.disabled=n<DIAG.length; done.textContent=n<DIAG.length?`查看我的起點（已答 ${n} / ${DIAG.length} 題）`:'查看我的起點'; };
    DIAG.forEach((q,i)=>{ const el=mcq(Object.assign({tag:`第 ${i+1} / 10 題 · 第${q.p}部分`},q),{reveal:false,chosen:a[i],onAnswer:j=>{ a[i]=j; S.diag.a=a; save(); upd(); }});
      const ch=E('button','linkbtn small','更改答案'); ch.type='button'; ch.style.marginTop='6px'; ch.onclick=()=>{ delete a[i]; save(); el._unlock(); upd(); }; el.appendChild(ch); list.appendChild(el); });
    done.onclick=()=>{ S.diag.done=true; S.diag.open=false; save(); draw(); sec.scrollIntoView&&sec.scrollIntoView({block:'start'}); };
    sec.appendChild(done); upd();
  };
  draw(); return sec;
};

/* ================= Pack C: write the commentary ================= */
const CHK=[
 ['開頭先講現金，而不是營收',t=>/cash|liquidity|headroom|現金|流動性|資金|週轉/.test(t.split(/[.!?。！？]/)[0]||'')],
 ['說明缺口有多大、何時發生（第2週和第4週，最低約 −$12k）',t=>/week\s*(2|4|two|four)|第\s*[2４4二四]\s*週|12\s?k|12,000|1\.2萬|below zero|negative|負數|跌破零|低於零|缺口/.test(t)],
 ['解釋為什麼獲利沒有變成現金：應收帳款和存貨增加',t=>/(receivable|debtor|customers owe|應收)/.test(t)&&/(inventory|stock|foam|存貨|庫存|泡棉)/.test(t)],
 ['點名有問題的客戶：美國經銷商B和沙烏地阿拉伯的信用狀',t=>/(distributor b|\bb\b owes|saudi|letter of credit|\blc\b|經銷商\s*b|沙烏地|信用狀)/.test(t)],
 ['提議在資金吃緊之前先跟銀行談',t=>/bank|overdraft|銀行|透支/.test(t)],
 ['提出行動，並指定負責人和日期',t=>/(by (mon|tue|wed|thu|fri|the|end|\d)|this week|tomorrow|owner|will |本週|明天|週[一二三四五]前|之前|負責|將會|會在)/.test(t)],
 ['對 NGO 訂單做出決定',t=>/ngo|kenya|sling|肯亞|吊帶|非政府組織/.test(t)],
 ['解釋毛利率下滑：加班、報廢、空運',t=>/overtime|scrap|air|margin|加班|報廢|空運|毛利/.test(t)]
];
const MODEL=`<p><strong>這個月的重點是現金，不是營收。</strong>營收創下 $128.0k 的新高，稅前淨利 $12.9k，符合預算。但我們的13週現金流量預測顯示，第2週（−$6k）和第4週（−$12k）流動性會跌破零，因為薪資、泡棉供應商的貨款和季度稅款都在那時到期。如果不採取行動，我們將付不出第4週的薪資。</p>
<p><strong>原因。</strong>1月以來我們賺了 $34.7k 稅後淨利，但營運卻用掉了 $36.5k 現金。應收帳款增加 $72k（77天，目標60天），主要是美國經銷商A以90天 CIF 條件下的 $88k 訂單。存貨增加 $46k，其中包括 $38k 大量採購的泡棉。美國經銷商B欠我們 $45k，其中 $30k 已逾期，$10k 逾期超過90天。</p>
<p><strong>本週行動。</strong>（1）總經理在週五前帶著這份預測與銀行會面，申請把透支額度暫時提高 $45k 至10月。（2）財務部在週三前重新提交沙烏地阿拉伯信用狀的單據，以收回 $18k。（3）業務部致電美國經銷商B的老闆；在議定付款計畫前不再出貨，並考慮提列備抵呆帳。（4）採購部與泡棉供應商協商延後付款日期。（5）婉拒9月交貨的 NGO 訂單，或改提10月交貨並收取30%訂金。</p>
<p><strong>毛利率。</strong>毛利率29.6%，預算為30.9%：原因是 $2.9k 的加班費、4.6%的報廢率和一次空運。本年累計為28.3%，預算29.5%。</p>
<p><strong>從現在起。</strong>任何新的長付款期限交易，都必須經財務部簽核並做現金檢查。</p>`;
const pc=BW.packs.packC;
if(pc&&!pc.sections.some(s=>s.id==='write')) pc.sections.push({id:'write',label:'撰寫管理評述',kind:'play',title:'自己重寫這份管理評述',blocks:[
  `<p>7月的管理評述把現金狀況說成「暫時的」。請以財務經理寫給總經理和老闆的角度，寫出這份報告原本應有的管理評述。目標是300到500字。請使用前面幾頁的數字。</p>`,
  {t:'callout',tone:'tip',title:'一份好的管理評述',html:`<ul><li>先講最重要的訊息，而不是最好的消息。</li><li>用數字說話：多少、何時、與什麼目標比較。</li><li>說明<em>為什麼</em>，而不只是<em>發生了什麼</em>。</li><li>最後列出行動、負責人和日期。</li></ul><p>第9單元有更多關於撰寫管理評述的內容。</p>`},
  {t:'live',render(box){
    const st=S.commC=S.commC||{text:'',checked:{},shown:false};
    box.innerHTML=`<label class="small" for="commC" style="color:var(--muted)">你的7月管理評述（輸入時會自動儲存在這個瀏覽器中）</label><textarea id="commC" class="cm-ta" rows="12" placeholder="從最重要的訊息開始寫……"></textarea><div class="cm-bar"><span class="cm-wc small"></span><button type="button" class="btn small cm-check">檢查我的草稿</button></div><div class="cm-out"></div>`;
    const ta=box.querySelector('textarea'), wc=box.querySelector('.cm-wc'), out=box.querySelector('.cm-out');
    ta.value=st.text||'';
    const words=()=>{ const v=ta.value; const n=(v.match(/[\u3400-\u9FFF]/g)||[]).length+(v.replace(/[\u3400-\u9FFF]/g,' ').match(/[A-Za-z0-9$.,%k\-]+/g)||[]).length; /* Chinese: count characters (each English word or number counts as one) */ wc.textContent=`${n} 字`+(n?n<300?' · 稍嫌短了點':n>500?' · 試著精簡':' · 長度剛好':''); wc.style.color=n&&(n<300||n>500)?'var(--amber)':'var(--muted)'; };
    let tmr; ta.addEventListener('input',()=>{ words(); clearTimeout(tmr); tmr=setTimeout(()=>{ st.text=ta.value; save(); },400); });
    const check=()=>{ st.text=ta.value; st.shown=true; save(); const t=ta.value.toLowerCase();
      const rows=CHK.map((c,i)=>{ const auto=c[1](t); const on=st.checked[i]!==undefined?st.checked[i]:auto; return `<label class="cm-row"><input type="checkbox" data-i="${i}" ${on?'checked':''}><span>${c[0]}</span>${auto?'<em class="cm-auto">在你的草稿中找到</em>':''}</label>`; }).join('');
      out.innerHTML=`<div class="cm-list"><h4>用這八個要點檢查你的草稿</h4><p class="small" style="color:var(--muted);margin:0 0 6px">標示「在你的草稿中找到」的勾選，只是根據你用的字詞所做的快速猜測。請誠實地逐項勾選或取消。</p>${rows}<div class="cm-score"></div></div><details class="cm-model"><summary>顯示一份範例管理評述</summary><div class="prose">${MODEL}</div></details>`;
      const score=()=>{ const n=out.querySelectorAll('input:checked').length; out.querySelector('.cm-score').innerHTML=`<div class="msg ${n>=7?'good':n>=5?'warn':'bad'}"><strong>8項中做到 ${n} 項。</strong> ${n>=7?'這是一份總經理今天就能據以行動的管理評述。':n>=5?'好的開始。補上缺少的部分，再和範例比較。':'先讀下面的範例，再試一次。開頭先講現金，最後以行動作結。'}</div>`; };
      out.querySelectorAll('input').forEach(cb=>cb.onchange=()=>{ st.checked[cb.dataset.i]=cb.checked; save(); score(); });
      score(); };
    box.querySelector('.cm-check').onclick=()=>{ st.checked={}; check(); };
    words(); if(st.shown&&st.text) check();
  }}
]});

/* ================= Final assessment (capstone) ================= */
const FINAL=[
 {q:'BraceWorks 今年獲利 $60,000，但現金減少了 $20,000。最可能的解釋是什麼？',opts:['會計人員算錯了','應收帳款和存貨增加，而且買了一台機器','獲利因折舊而高估','稅繳了兩次'],a:1,why:'獲利和現金會因為營運資金和投資而分道揚鑣（第1與第5單元）。',m:'m5'},
 {q:'一家經銷商支付了一張 $10,000 的發票。哪一筆分錄記錄這件事？',opts:['借記銷貨，貸記現金','借記現金，貸記應收帳款','借記應收帳款，貸記現金','借記現金，貸記銷貨'],a:1,why:'現金增加（借方），應收的金額減少（貸方）。銷貨在開立發票時就已經記錄了（第2單元）。',m:'m2'},
 {q:'營業收入 $110,000，銷貨成本 $78,100。毛利率是多少？',opts:['29.0%','71.0%','32.1%','22.0%'],a:0,why:'($110,000 − $78,100) ÷ $110,000 = 29.0%（第3單元）。',m:'m3'},
 {q:'流動資產 $520,000，其中 $300,000 是存貨。流動負債 $300,000。速動比率是多少？',opts:['1.73','0.73','1.00','0.58'],a:1,why:'($520,000 − $300,000) ÷ $300,000 = 0.73。不賣掉存貨的話，BraceWorks 付不起短期帳單（第4單元）。',m:'m4'},
 {q:'製造費用按直接人工小時分攤，但護具使用的機器時間遠多於吊帶。風險是什麼？',opts:['只要製造費用總額正確，就沒有風險','護具看起來比實際便宜，吊帶看起來比實際貴，導致訂價決策出錯','稅會增加','資產負債表會不平衡'],a:1,why:'不恰當的製造費用分攤基礎，會把成本在產品之間挪來挪去（第6單元）。',m:'m6'},
 {q:'在銷售清淡的月份，工廠持續生產，製成品因此增加了400件。為什麼獲利可能看起來比實際好？',opts:['因為營收增加了','因為部分固定製造費用進入了存貨，而不是損益表','因為報廢減少了','因為停止提列折舊'],a:1,why:'生產超前於銷售時，全部成本法可能美化獲利（第7單元）。',m:'m7'},
 {q:'泡棉的數量差異為 $4,000 不利，而泡棉的價格差異為零。你應該先從哪裡查起？',opts:['採購經理的議價','工廠現場的報廢、裁切損耗和泡棉品質','業務團隊','匯率'],a:1,why:'數量差異來自用了多少，而不是花了多少錢買（第8單元）。',m:'m8'},
 {q:'固定成本 $360,000，邊際貢獻率45%。損益兩平的營收是多少？',opts:['$162,000','$800,000','$522,000','$1,000,000'],a:1,why:'$360,000 ÷ 0.45 = $800,000（第12單元）。',m:'m12'},
 {q:'在有閒置產能的情況下，有人提出一張一次性的出口訂單，每張床墊 $96。變動成本 $88，全部成本 $118。你該怎麼做？',opts:['拒絕：低於全部成本','如果不會削弱你的正常售價就接受，因為每件可增加 $8 的邊際貢獻','任何高於零的價格都接受','拒絕：利潤率一定要有30%'],a:1,why:'有閒置產能時固定成本不變，所以只要高於變動成本都能增加獲利，前提是不損及正常售價（第13單元）。',m:'m13'},
 {q:'A專案2年回收，但淨現值為負。B專案4年回收，淨現值為 +$40,000。哪一個創造更多價值？',opts:['A專案，因為回收較快','B專案，因為在整個存續期間，它賺得比資金成本還多','都沒有','兩者相同'],a:1,why:'回收期間忽略了回收之後發生的事，也忽略了資金成本。淨現值則不會（第14單元）。',m:'m14'},
 {q:'應收帳款週轉天數70天，存貨週轉天數100天，應付帳款週轉天數45天。現金轉換循環是多少？',opts:['215天','125天','25天','170天'],a:1,why:'70 + 100 − 45 = 125天，也就是從支付材料款到收到客戶貨款之間的天數（第16單元）。',m:'m16'},
 {q:'一個新國家的新客戶，首張訂單 $90,000，要求90天記帳交易（open account）條件。最安全又合理的回應是什麼？',opts:['接受：大訂單是好事','先要求信用狀、訂金，或投保信用保險','拒絕所有出口賒銷','改用空運以便更快收款'],a:1,why:'依風險選擇相應的付款方式（第17單元）。',m:'m17'},
 {q:'一封電子郵件要求你在週五付款作業之前，變更某供應商的銀行帳戶資料。應該怎麼處理？',opts:['照改：信是從供應商的信箱寄來的','打給供應商（用你原本就有的電話號碼），並由另一個人核准這項變更','一半付到舊帳戶，一半付到新帳戶','請寄件人用電子郵件確認'],a:1,why:'電話回撥確認和職能分工可以阻止大多數付款詐騙（第18單元）。',m:'m18'},
 {q:'你的會計利潤是 $100,000，但稅單是以 $112,000 計算。最可能的原因是什麼？',opts:['稅務機關弄錯了','有些成本，例如交際費或某些負債準備，在稅法上不能扣除','稅率提高了','營收算了兩次'],a:1,why:'課稅所得與會計利潤不同，是因為稅法對扣除項目和認列時點有不同規定（第19單元）。',m:'m19'},
 {q:'淨負債 $300,000，EBITDA $120,000。財務承諾條款上限是 2.5×。BraceWorks 能否再借 $100,000 買一台機器？',opts:['可以，空間還很大','除非 EBITDA 成長，否則一定會違反財務承諾條款：目前已經是 2.5×','財務承諾條款不適用於設備貸款','只有用現金支付才行'],a:1,why:'$300,000 ÷ $120,000 = 2.5×，已經到上限。先跟銀行談，或改用租賃或股權籌資（第17與第20單元）。',m:'m20'}
];
const PASS=12;
function recordHTML(r){
  const d=new Date(r.date); const ds=d.toLocaleDateString(undefined,{year:'numeric',month:'long',day:'numeric'});
  return `<!doctype html><html><head><meta charset="utf-8"><title>結業紀錄</title><style>body{font-family:Georgia,serif;max-width:720px;margin:40px auto;padding:0 24px;color:#16232A}h1{font-size:30px;margin:0}h2{font-weight:normal;color:#55666B;margin:4px 0 28px}table{border-collapse:collapse;width:100%;margin:20px 0}td{border-bottom:1px solid #D3DCD7;padding:8px 4px}td:last-child{text-align:right;font-family:monospace}.box{border:2px solid #0C6A61;padding:28px 32px;border-radius:8px}.small{font-size:13px;color:#55666B}</style></head><body><div class="box"><p class="small">THE GM'S LEDGER · BRACEWORKS MEDICAL 版</p><h1>結業紀錄</h1><h2>給總經理的會計與財務課程</h2><p>茲證明 <strong>${(r.name||'學員').replace(/[<>&]/g,'')}</strong> 已於 ${ds} 完成結業評量。</p><table><tr><td>結業評量成績</td><td>${r.score} / ${FINAL.length}</td></tr><tr><td>已開啟的課程小節</td><td>${r.secs}</td></tr><tr><td>單元測驗答對題數</td><td>${r.quiz}</td></tr><tr><td>已評分的練習包</td><td>${r.packs} / 4</td></tr><tr><td>全年模擬，最佳決策數</td><td>${r.sim}</td></tr></table><p class="small">內容涵蓋三大財務報表、記帳、產品成本計算、存貨、差異、管理報告、KPI、訂價與決策、投資評估、預算、營運資金、出口融資、控制與查核、出口商的稅務，以及籌資與企業價值。本紀錄為自學課程紀錄，並非經認證的資格證明。</p></div></body></html>`;
}
function courseStats(){
  let n=0,r=0,secs=0,done=0;
  MODS.forEach(id=>{ const m=BW.mods[id]; if(!m) return; m.sections.forEach(sec=>{ secs++; if(S.visited[id+'.'+sec.id]) done++; const ki=BW.keyIdx(sec); sec.blocks.forEach((b,i)=>{ if(b&&b.t==='quiz'){ n++; if(S.quiz[`${id}.${sec.id}.${ki[i]}`]===b.a) r++; } }); }); });
  const packs=['A','B','C','D'].filter(x=>S.sc2&&S.sc2[x]&&Object.keys(S.sc2[x]).length>=20).length;
  return {secs:`${done} / ${secs}`,quiz:`${r} / ${n}`,packs,sim:S.simDone?`${S.simBest||0} / 8`:'尚未進行'};
}
const cap=BW.mods.cap;
if(cap&&!cap.sections.some(s=>s.id==='final')){
  const gi=cap.sections.findIndex(s=>s.id==='grad');
  cap.sections.splice(gi<0?cap.sections.length:gi,0,{id:'final',label:'結業評量',kind:'quiz',title:'結業評量',blocks:[
    `<p>十五道題目，主要單元各出一題，都是總經理實際會遇到的情境。全部作答後再交卷評分。得到 ${PASS} 分以上（80%）即可取得結業紀錄。你可以隨時重考，系統會保留你的最高分。</p>`,
    {t:'live',render(box){
      const F=S.final=S.final||{a:{},marked:false,best:0};
      const draw=()=>{
        box.innerHTML='';
        const list=E('div','fa-list'); box.appendChild(list);
        const btns=[];
        FINAL.forEach((q,i)=>{
          const el=mcq(Object.assign({tag:`第 ${i+1} / ${FINAL.length} 題 · 第${mnum(q.m)}單元`},q),{reveal:F.marked,chosen:F.a[i],onAnswer:j=>{ F.a[i]=j; save(); upd(); }});
          if(F.marked&&F.a[i]!==q.a){ const lk=E('button','linkbtn',`複習第${mnum(q.m)}單元`); lk.type='button'; lk.onclick=()=>BW.go(q.m,0,{jump:true}); el._why.appendChild(lk); }
          if(!F.marked){ const ch=E('button','linkbtn small','更改答案'); ch.type='button'; ch.style.marginTop='6px'; ch.onclick=()=>{ delete F.a[i]; save(); el._unlock(); upd(); }; el.appendChild(ch); }
          list.appendChild(el);
        });
        const foot=E('div','fa-foot'); box.appendChild(foot);
        const upd=()=>{ if(F.marked) return; const n=Object.keys(F.a).length; foot.innerHTML=''; const b=E('button','btn',n<FINAL.length?`交卷評分（已答 ${n} / ${FINAL.length} 題）`:'交卷評分'); b.type='button'; b.disabled=n<FINAL.length;
          b.onclick=()=>{ F.marked=true; const sc=FINAL.reduce((t,q,i)=>t+(F.a[i]===q.a?1:0),0); F.score=sc; if(sc>=F.best){ F.best=sc; } if(sc>=PASS&&!F.passDate) F.passDate=new Date().toISOString(); save(); draw(); box.scrollIntoView&&box.scrollIntoView({block:'start'}); };
          foot.appendChild(b); };
        if(!F.marked){ upd(); return; }
        const sc=F.score, pass=sc>=PASS;
        const res=E('div','fa-res'); res.innerHTML=`<div class="msg ${pass?'good':sc>=9?'warn':'bad'}"><strong>你答對了 ${sc} / ${FINAL.length} 題。</strong> ${pass?'做得好：你通過了。你的結業紀錄在下方。':`需要 ${PASS} 分才能通過。下方的解說會告訴你，每一題答錯的該回去複習哪個單元。`}${F.best>sc?` 你目前的最高分是 ${F.best} 分。`:''}</div>`;
        box.insertBefore(res,list);
        const again=E('button','btn ghost small','重新評量'); again.type='button'; again.onclick=()=>{ F.a={}; F.marked=false; save(); draw(); };
        foot.appendChild(again);
        if(F.best>=PASS){
          const st=courseStats(); const rec=E('div','fa-rec');
          const date=F.passDate||new Date().toISOString();
          rec.innerHTML=`<div class="fa-cert"><div class="eyebrow">結業紀錄</div><h3>The GM's Ledger：給總經理的會計與財務課程</h3><label class="small" for="faName" style="color:var(--muted)">紀錄上的姓名</label><input id="faName" class="search" type="text" autocomplete="name" placeholder="你的姓名"><div class="fa-g"><div><span>完成日期</span><strong>${new Date(date).toLocaleDateString(undefined,{year:'numeric',month:'short',day:'numeric'})}</strong></div><div><span>結業評量最高分</span><strong>${F.best} / ${FINAL.length}</strong></div><div><span>已開啟的小節</span><strong>${st.secs}</strong></div><div><span>測驗答對題數</span><strong>${st.quiz}</strong></div><div><span>已評分的練習包</span><strong>${st.packs} / 4</strong></div><div><span>模擬</span><strong>${st.sim}</strong></div></div><div class="tmpl-a"><button type="button" class="btn small" data-rec>下載紀錄</button><span class="small fa-s" role="status" aria-live="polite" style="color:var(--muted)"></span></div></div>`;
          box.appendChild(rec);
          const nm=rec.querySelector('#faName'); nm.value=F.name||''; nm.addEventListener('input',()=>{ F.name=nm.value.slice(0,80); save(); });
          rec.querySelector('[data-rec]').onclick=()=>{ const r=Object.assign({name:F.name,date,score:F.best},st); BW.saveFile('gms-ledger-completion-record.html',recordHTML(r),t=>{ rec.querySelector('.fa-s').textContent=t; }); };
        }
      };
      draw();
    }}
  ]});
}
})();
