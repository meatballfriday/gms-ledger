/* ===== Module 26: Group treasury, cash and currency across countries (optional: growing into a multinational) ===== */
(function(){
const {K,TIP,FLAG,CASE,REPORT,Q,FS,FLIP,SORT,CHECK,W,money,signed,pct,kfmt} = BW.h;
const m$=v=>money(Math.round(v));
const E=(tag,cls,html)=>{ const e=document.createElement(tag); if(cls) e.className=cls; if(html!=null) e.innerHTML=html; return e; };

BW.add({
  id:'m26', minutes:55,
  title:'集團資金管理：跨國現金與匯率',
  subtitle:'有了五家公司、五種貨幣，現金會擺錯地方，款項雙向跨境流動，匯率變動可能吃掉一整年的利潤。看成長中的集團如何掌握、調度和保護它的現金。',
  goals:[
    '每週掌握每家公司的現金，並在借款前先動用多餘的現金',
    '說明資金池與淨額結算，以及限制它們的當地法規',
    '撰寫一份能保護利潤率、又不會變成賭博的外匯避險政策',
    '管理少數幾家主要往來銀行、授信額度、保證和財務承諾條款'
  ],
  sections:[
  /* ---------------------------------------------------------------- 1 */
  {id:'visibility', label:'現金在哪裡？', kind:'play', title:'我們的現金在哪裡？', blocks:[
    `<p>在集團裡，現金很少剛好在需要它的地方。一家公司有可觀的盈餘卻只賺到微薄利息，另一家卻在付昂貴的透支利息。沒有每週檢視每個銀行帳戶，就沒有人會注意到。以下是BraceWorks集團在月底最後一個週五的情況，全部以美元等值表示。</p>`,
    W('全集團的現金', function(el,ctx){
      const ENT=[['菲律賓',2100000,0.025],['德國',900000,0.015],['美國',1400000,0.03],['澳洲',400000,0.025],['越南',-1200000,0.09]];
      const IC=0.06; let lend=false;
      const sg=E('div'), chart=E('div'), out=E('div'); el.append(sg,chart,out);
      ctx.ui.seg(sg,[{v:false,label:'各公司各自運作'},{v:true,label:'把馬尼拉的盈餘借給越南'}],false,v=>{ lend=v; draw(); });
      sg.style.marginBottom='10px';
      const plot=BW.cols(chart,{series:[{name:'銀行存款餘額',cls:'s1'}],label:'各公司銀行存款餘額',fmt:v=>kfmt(v),height:160});
      function draw(){
        const bal=ENT.map(e=>e[1]); if(lend){ bal[0]-=1200000; bal[4]+=1200000; }
        plot(ENT.map((e,i)=>({label:e[0],v:[bal[i]]})));
        const net=bal.reduce((a,b)=>a+b,0);
        const intr=ENT.reduce((t,e,i)=>t+(bal[i]>=0?bal[i]*e[2]:bal[i]*e[2]),0);
        const base=ENT.reduce((t,e)=>t+e[1]*e[2],0);
        out.innerHTML=`<div class="stats" style="margin-top:10px">${ctx.ui.stat('集團淨現金',m$(net),'','兩種情況都一樣')}${ctx.ui.stat('集團每年淨利息',m$(intr),intr<0?'bad':'good')}${ctx.ui.stat('節省',lend?'每年'+m$(intr-base):'–',lend?'good':'')}</div>
          <p class="w-hint" style="margin-top:8px">${lend?`越南用馬尼拉借給它的$120萬償還9%的透支。集團不再一邊付銀行9%借自己的錢，一邊只賺2.5%。在集團內部，越南按常規交易利率（例如${pct(IC,0)}）付利息給馬尼拉，並為移轉訂價留存文件（第24單元）。利息可能需要扣繳稅款（第19單元），而且有些國家要求登記跨境借款：越南對一年以上的借款（向越南國家銀行登記），中國則向其外匯主管機關登記。`:`集團有$${(net/1e6).toFixed(1)}百萬的淨現金，然而越南為$120萬的透支付9%利息，馬尼拉的盈餘卻只賺2.5%。試試把盈餘借出去。`}</p>`;
      }
      draw();
    }),
    K('先求看得見',
      `<p>在做任何資金池或避險之前，先每週取得一份報告：依公司、銀行和幣別列示的現金與借款，以及可用額度餘裕。大多數銀行提供跨國的唯讀查詢權限，ERP或資金管理工具也能彙整這些資料。看不見的現金，你就管不了。</p>`)
  ]},
  /* ---------------------------------------------------------------- 2 */
  {id:'netting', label:'資金池與淨額結算', kind:'play', title:'資金池與淨額結算：少搬動一點錢', blocks:[
    `<p>有兩個工具能避免集團的現金繞圈子。</p>`,
    {t:'tbl', head:['工具','運作方式','需要留意'], rows:[
      ['<strong>實體資金池</strong>','集團各帳戶的餘額每天歸集到一個主帳戶，因而產生集團內部借款','每次歸集都是一筆借款：需要常規交易利率和文件，跨境時可能受到限制'],
      ['<strong>名目資金池</strong>','現金留在各帳戶，但銀行以合併餘額計算利息','並非每個國家都提供；銀行需要交叉保證'],
      ['<strong>集團內部淨額結算</strong>','每月一次，把集團各公司彼此之間的欠款互相抵銷，每家公司只付出或收到一筆淨額','需要先對好餘額（第25單元）和固定的結算日；有些國家限制貿易款項的淨額結算']
    ]},
    `<p>以下是BraceWorks一個月的集團內部交易，單位為千美元等值。開啟淨額結算，看看款項會有什麼變化。</p>`,
    W('每月集團內部淨額結算', function(el,ctx){
      const N=[{k:'PH',t:'菲律賓',c:'USD'},{k:'DE',t:'德國',c:'EUR'},{k:'US',t:'美國',c:'USD'},{k:'AU',t:'澳洲',c:'AUD'},{k:'VN',t:'越南',c:'VND'}];
      const F=[['DE','PH',1200],['PH','DE',450],['US','PH',900],['PH','US',300],['AU','PH',300],['PH','VN',700],['VN','PH',650]];
      const cur=k=>N.find(n=>n.k===k).c;
      const net={}; N.forEach(n=>net[n.k]=0); F.forEach(([a,b,v])=>{ net[a]-=v; net[b]+=v; });
      let mode='gross';
      const sg=E('div'), box=E('div','nt'), out=E('div'); el.append(sg,box,out);
      ctx.ui.seg(sg,[{v:'gross',label:'每張發票分別付款'},{v:'net',label:'每月淨額結算'}],'gross',v=>{ mode=v; draw(); });
      sg.style.marginBottom='8px';
      BW.viz.mount(box,function(w){ const P=BW.viz.p; const cx=w/2, cy=150, R=Math.min(w/2-70,130);
        const pos={}; N.forEach((n,i)=>{ const a=-Math.PI/2+i*2*Math.PI/N.length; pos[n.k]=[cx+R*Math.cos(a),cy+R*Math.sin(a)]; });
        let g=`<defs><marker id="ntA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0L10,5L0,10z" fill="var(--s2)"/></marker><marker id="ntB" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0L10,5L0,10z" fill="var(--s3)"/></marker></defs>`;
        const line=(x1,y1,x2,y2,off,cls,mk,lab)=>{ const dx=x2-x1, dy=y2-y1, L=Math.hypot(dx,dy), ux=dx/L, uy=dy/L, nx=-uy*off, ny=ux*off, r=30;
          const a=[x1+ux*r+nx,y1+uy*r+ny], b=[x2-ux*r+nx,y2-uy*r+ny];
          return `<line x1="${P.f(a[0])}" y1="${P.f(a[1])}" x2="${P.f(b[0])}" y2="${P.f(b[1])}" class="${cls}" marker-end="url(#${mk})"/>`+(lab?P.txt((a[0]+b[0])/2+nx*1.6,(a[1]+b[1])/2+ny*1.6+4,lab,'v-l'):''); };
        g+='<g class="nt-g">'+F.map(([a,b,v])=>{ const two=F.some(x=>x[0]===b&&x[1]===a); return line(pos[a][0],pos[a][1],pos[b][0],pos[b][1],two?9:0,'nt-l g','ntA',w>=480?String(v):''); }).join('')+'</g>';
        g+='<g class="nt-n">'+N.map(n=>{ const v=net[n.k]; return line(...(v<0?[pos[n.k][0],pos[n.k][1],cx,cy]:[cx,cy,pos[n.k][0],pos[n.k][1]]),0,'nt-l n','ntB',w>=480?String(Math.abs(v)):''); }).join('')+
          `<circle cx="${cx}" cy="${cy}" r="30" class="v-node hl"/>`+P.txt(cx,cy-2,'淨額結算','v-t')+P.txt(cx,cy+13,'中心','v-s')+'</g>';
        N.forEach(n=>{ const [x,y]=pos[n.k]; g+=`<circle cx="${P.f(x)}" cy="${P.f(y)}" r="28" class="v-node"/>`+P.txt(x,y-1,n.t.length>9&&w<480?n.k:n.t.replace('United States','US'),'v-t')+P.txt(x,y+13,n.c,'v-s'); });
        return P.svg(w,300,'BraceWorks五家公司之間的集團內部款項，逐筆支付或透過淨額結算中心。',g);
      },()=>draw());
      function draw(){ box.classList.toggle('is-net',mode==='net');
        const gp=F.length, gv=F.reduce((t,x)=>t+x[2],0), gfx=F.filter(([a,b])=>cur(a)!==cur(b)).reduce((t,x)=>t+x[2],0);
        const np=N.filter(n=>net[n.k]!==0).length, nv=N.reduce((t,n)=>t+(net[n.k]<0?-net[n.k]:0),0), nfx=N.filter(n=>n.c!=='USD').reduce((t,n)=>t+Math.abs(net[n.k]),0);
        const P=mode==='net'?{p:np,v:nv,fx:nfx}:{p:gp,v:gv,fx:gfx}; const cost=x=>x.fx*1000*0.004*12+x.p*40*12;
        out.innerHTML=`<div class="stats" style="margin-top:8px">${ctx.ui.stat('跨境付款',`每月${P.p}筆`)}${ctx.ui.stat('搬動的金額','每月'+kfmt(P.v*1000))}${ctx.ui.stat('換匯金額','每月'+kfmt(P.fx*1000))}${ctx.ui.stat('銀行及換匯成本','每年'+m$(cost(P)),mode==='net'?'good':'')}</div>
          <p class="w-hint" style="margin-top:8px">${mode==='net'?`現在每家公司只付出或收到一筆款項。搬動的金額從每月${kfmt(gv*1000)}降到${kfmt(nv*1000)}，換匯金額從${kfmt(gfx*1000)}降到${kfmt(nfx*1000)}：假設匯差0.4%、每筆付款$40，每年約可節省${m$(cost({p:gp,fx:gfx})-cost(P))}。換匯次數減少，也代表各公司利潤中的匯率雜訊變少。`:'七筆各自獨立的跨境付款，大多雙向換匯。德國和馬尼拉互相付款，馬尼拉和越南也是。'}</p>`; }
    }),
    TIP('在建立資金池或淨額結算前，先確認當地法規',
      `<p>資金池和淨額結算會產生集團內部借款，並跨境抵銷款項。有些國家兩者都限制，要求向中央銀行登記或申報，或對利息課稅。銀行的現金管理團隊或你的稅務顧問可以告訴你各國允許什麼。先從允許的國家開始，其他國家則以定期、有文件佐證的付款結清。</p>`)
  ]},
  /* ---------------------------------------------------------------- 3 */
  {id:'fx', label:'避險政策', kind:'play', title:'是避險政策，不是賭注', blocks:[
    `<p>第17單元示範了針對一筆歐元標案的一份遠期外匯合約。到了集團規模，BraceWorks每月在歐洲銷售約€100萬，而大部分成本以披索和越南盾支付。歐元小幅變動，就可能吃掉一整年的利潤。解決之道是一份經董事會核准的書面<span class="term">避險政策</span>，明訂：</p>
     <ul>
      <li>避險<strong>什麼</strong>：以外幣計價的確定訂單和預測銷貨或採購，絕不超過實際暴險。</li>
      <li>避險<strong>多少</strong>，依期間而定：未來幾個月幾乎確定，避險比例較高；更遠的月份比例較低。</li>
      <li>用<strong>什麼工具</strong>：只用單純的遠期外匯合約和簡單的選擇權。不用槓桿型商品，也不用損失沒有上限的合約。</li>
      <li>由<strong>誰</strong>交易、誰核准、誰確認：三個不同的人。</li>
      <li><strong>如何報告</strong>：每月向董事會報告避險部位及其市價。</li>
     </ul>`,
    W('避險政策模擬器', function(el,ctx){
      const F=1.10, MON=12, SALES=1000000; let v={h1:75,h2:50,h3:25}, short=false, ready=false;
      const top=E('div'), sg=E('div'), chart=E('div'), out=E('div'); el.append(top,sg,chart,out);
      ctx.ui.sliders(top,[{k:'h1',label:'第1–3個月避險比例',min:0,max:100,step:5,v:75,f:x=>x+'%'},{k:'h2',label:'第4–6個月避險比例',min:0,max:100,step:5,v:50,f:x=>x+'%'},{k:'h3',label:'第7–12個月避險比例',min:0,max:100,step:5,v:25,f:x=>x+'%'}],x=>{ v=x; if(ready) draw(); },ctx.uid);
      ctx.ui.seg(sg,[{v:false,label:'銷貨符合預測'},{v:true,label:'銷貨比預測低40%'}],false,x=>{ short=x; draw(); });
      sg.style.margin='10px 0';
      const BUD=SALES*MON*F;
      const plot=BW.cols(chart,{series:[{name:'未避險',cls:'mut'},{name:'依你的避險',cls:'s1'}],label:'三種歐元情境下美元營收與預算的差異',fmt:x=>(x>=0?'+':'')+kfmt(x),height:160});
      const SC=[['歐元跌至0.95',0.95],['歐元持平於1.10',1.10],['歐元升至1.25',1.25]];
      const hr=m=>(m<3?v.h1:m<6?v.h2:v.h3)/100;
      function run(end){ let un=0, he=0; for(let m=0;m<MON;m++){ const spot=F+(end-F)*(m+1)/MON, act=SALES*(short?0.6:1), H=SALES*hr(m); un+=act*spot; he+=act*spot+H*(F-spot); } return {un,he}; }
      function draw(){ const R=SC.map(s=>run(s[1])); plot(SC.map((s,i)=>({label:s[0],v:[R[i].un-BUD,R[i].he-BUD]})));
        const ru=Math.max(...R.map(r=>r.un))-Math.min(...R.map(r=>r.un)), rh=Math.max(...R.map(r=>r.he))-Math.min(...R.map(r=>r.he));
        const over=short&&[v.h1,v.h2,v.h3].some(h=>h>60);
        out.innerHTML=`<p class="w-hint" style="margin:4px 0 0">長條顯示全年美元營收與$1,320萬預算（€1,200萬，匯率1.10）的差異。</p><div class="stats" style="margin-top:8px">${ctx.ui.stat('結果區間（未避險）',m$(ru))}${ctx.ui.stat('結果區間（依你的避險）',m$(rh),rh<ru*0.7?'good':'')}</div>
          <p class="w-hint" style="margin-top:8px">${over?`<strong>過度避險。</strong>銷貨比預測低40%時，部分合約的金額已經超過實際收到的歐元。那一部分不再是避險：它是押注歐元，如果歐元升值就會虧錢，而且沒有任何東西可以抵銷。這就是為什麼政策對不確定的後期月份避險比例較低，也是為什麼絕不允許避險比率超過確定暴險的100%。`:`避險能縮小結果的區間：你放棄歐元升值時的部分好處，換取歐元貶值時的保護。重點不在打敗市場，而在掌握你的利潤率。分層避險（近期多、遠期少）讓你在預測逐漸確定的過程中持續受到保護。`}</p>`; }
      ready=true; draw();
    }),
    FLAG('當避險變成賭注',
      `<p>警訊：合約金額大於它所涵蓋的銷貨或採購；商品名稱中有「accumulator」（累計型選擇權）、「knock-in」（觸及生效）或「target redemption」（目標可贖回）；某些情境下賺錢、在其他情境下虧損卻沒有上限的避險；由同一個人交易並確認自己的交易；企業無法解釋的「資金管理」利潤。</p>`),
    Q('BraceWorks預測明年銷貨€1,200萬。一家銀行提議一份合約，遠期賣出€2,400萬，「匯率更好，因為如果歐元升破1.20，你必須賣出雙倍」。政策應該怎麼規定？',[
      '接受：匯率更好就是更好的避險','拒絕：它可能讓集團必須賣出兩倍於實際暴險的金額，這是投機，不是避險','接受一半','如果財務長喜歡就接受'],1,
      '這類槓桿型結構可能正好在市場對你不利時讓你的暴險加倍。好的政策會全面禁止它們。')
  ]},
  /* ---------------------------------------------------------------- 4 */
  {id:'banks', label:'銀行與授信額度', kind:'learn', title:'集團的銀行、授信額度與保證', blocks:[
    `<p>單一公司的出口商通常只有一家銀行。跨五國的集團則需要經過規劃的銀行往來架構。</p>`,
    {t:'tbl', head:['做法','原因'], rows:[
      ['<strong>二到四家主要往來銀行</strong>，涵蓋你的主要國家','價格上有競爭、某家銀行緊縮時有備援，而且要控管的帳戶較少'],
      ['<strong>一份授信額度明細表</strong>：集團內每一筆借款、透支、保證和信用狀額度，附額度、已動用金額、到期日和財務承諾條款','這樣就不會有額度在沒人注意時到期，各國的可用額度餘裕也一清二楚'],
      ['<strong>在集團層級測試財務承諾條款</strong>，並每季預測每項測試','到年底才發現違反就來不及補救了（第23單元）'],
      ['<strong>集團公司之間的保證</strong>要登錄並經董事會核准','母公司保證會讓母公司對子公司的債務負責'],
      ['<strong>了解交叉違約條款</strong>','一個國家的違約，可能讓其他地方的借款立即到期'],
      ['<strong>存款分散</strong>於體質健全的銀行','銀行倒閉可能讓現金被凍結數天或數週']
    ]},
    K('受困資金與匯回股利',
      `<p>子公司的利潤不等於馬尼拉的現金。透過股利、權利金、服務費或借款還款把錢匯回，各有不同的稅務和法律影響（第24單元）。每年規劃匯回的途徑，免得現金堆在無法動用的地方。</p>`),
    Q('一筆給BraceWorks USA的美國銀行借款由菲律賓母公司提供保證。這對集團代表什麼？',[
      '沒什麼：那是美國的借款','如果BraceWorks USA無法償還，母公司就必須償還：母公司自己的資產和財務承諾條款都被牽連進去','保證會降低集團負債','只有美國銀行的律師需要知道'],1,
      '保證讓母公司被牽連進去。這筆借款本來就在集團合併報表中；保證讓母公司本身負有責任，而且可能計入母公司自己的財務承諾測試。為每一項保證建立登錄表。')
  ]},
  /* ---------------------------------------------------------------- 5 */
  {id:'case', label:'個案：聰明的避險', kind:'case', title:'賺錢的避險，直到它不再賺錢', blocks:[
    CASE('資金管理變成利潤中心',
      `<p>BraceWorks歐洲的財務經理很自豪：兩年來，她的外匯合約每季都賺錢，合計約$180,000，她把這筆錢列為「資金管理收益」。仔細一看，你發現她一直以預期銷貨的兩倍遠期賣出歐元，所用的結構只要歐元維持在1.15以下就能拿到較好的匯率。沒有其他人檢查這些合約。歐元現在是1.13，而且還在上升。</p>`),
    Q('你第一步該做什麼？',[
      {text:'不動它：它已經賺了兩年', why:'過去的獲利無法說明現在的暴險。這種結構正好在歐元升值時虧損最多。'},
      {text:'今天就為每一份未平倉合約評價、停止新交易，並在書面政策下由董事會決定如何平倉或減少超額部分'},
      {text:'開除財務經理，然後什麼都不說', why:'把人撤換掉並不會讓合約消失。暴險仍然必須衡量和管理。'},
      {text:'把部位加倍來攤平', why:'那是拿公司的錢去賭博。'}],1,
      '先衡量（按市價評估合約），再停止新增風險，然後與董事會一起決定。之後：訂定避險政策、設定限額，並讓交易、核准和確認由不同的人負責。')
  ]},
  /* ---------------------------------------------------------------- 6 */
  {id:'quiz', label:'測驗', kind:'quiz', title:'檢驗你的理解', blocks:[
    Q('馬尼拉持有$210萬，利率2.5%，而越南欠銀行$120萬，利率9%。最簡單的改善方法是……',['不管它','在當地法規允許下，以常規交易利率在集團內部把馬尼拉的盈餘借給越南','把所有現金移到美國','在馬尼拉借更多錢'],1,'集團不再付銀行9%來借自己的錢。'),
    Q('集團內部淨額結算的作用是什麼？',['免除集團內部交易的稅','抵銷集團各公司彼此之間的欠款，讓每家公司只付出或收到一筆淨額','隱藏集團內部餘額','把所有餘額換算成美元'],1,'付款更少、搬動的錢更少、換匯次數更少。'),
    Q('哪一項應該寫進避險政策？',['為求保險，避險預測銷貨的150%','使用銀行推薦的任何商品','依期間對實際暴險的固定比例避險，使用單純的遠期合約，交易與核准分開，並每月報告','讓各國自行決定'],2,'政策明訂避險什麼、多少、用什麼工具、由誰負責，以及如何報告。'),
    Q('避險主要是……',['提高預期利潤','縮小結果的區間','永遠消除所有匯率風險','只適用於銀行'],1,'你放棄一部分好處，換取對不利情況的保護。'),
    Q('某個國家的一筆借款有交叉違約條款。這代表什麼？',['集團任何地方發生違約，都可能讓這筆借款立即到期','銀行不能在其他地方放款','這筆借款沒有財務承諾條款','利率是固定的'],0,'交叉違約把你的各筆借款綁在一起。一次違約可能觸發多筆借款。')
  ]},
  /* ---------------------------------------------------------------- 7 */
  {id:'apply', label:'練習', kind:'apply', title:'為你的集團管理資金', blocks:[
    `<p>選讀。勾選只儲存在這個瀏覽器中。</p>`,
    CHECK('m26-treasury','在我們的集團裡……',[
      '我每週收到一份依公司、銀行和幣別列示現金與借款的報告',
      '在當地法規允許下，先動用某家公司的多餘現金，再讓另一家公司借款',
      '集團內部餘額每月結清，最好透過淨額結算',
      '我們有經董事會核准的避險政策，並每月報告部位',
      '避險的交易、核准和確認由不同的人負責',
      '授信額度明細表列出每一筆借款、保證和財務承諾條款，附到期日',
      '我們知道哪些現金不容易離開所在國家，並每年規劃股利匯回'
    ]),
    REPORT('你的週一早晨提問',
      `<p>問：<strong>「我們今天在每個國家各有多少現金？有多少閒置著，而另一家公司卻在借錢？」</strong></p>`),
    K('重點整理',
      `<ul>
        <li>在試圖優化之前，先每週看清所有的現金。</li>
        <li>資金池和淨額結算能降低利息和換匯成本；先確認當地法規。</li>
        <li>依書面政策、用單純的工具為實際暴險避險，絕不超過暴險的100%。</li>
        <li>會「賺錢」的資金管理，最需要被嚴格追問。</li>
        <li>掌握集團內每一項授信額度、保證和財務承諾條款，以及各自的到期日。</li>
       </ul>`)
  ]}
  ],
  warnings:[
    {sign:'一家公司在借錢，另一家公司卻有閒置現金', meaning:'付利息去借集團自己的錢。', look:'依公司列示的每週現金報告。'},
    {sign:'避險金額大於實際暴險，或使用槓桿型商品', meaning:'披著避險外衣的投機。', look:'避險部位對照預測暴險；商品條款。'},
    {sign:'每年持續成長的「資金管理收益」', meaning:'可能有沒人核准過的風險承擔。', look:'誰交易、誰核准、誰確認；按市價評估的價值。'},
    {sign:'授信額度即將到期卻沒有續約計畫', meaning:'資金缺口會突然出現。', look:'附到期日的授信額度明細表。'}
  ],
  formulas:[
    {name:'在集團內部借貸節省的利息', f:'金額 ×（透支利率 − 存款利率）', ex:'$120萬 ×（9% − 2.5%）= 每年$78,000'},
    {name:'避險後營收', f:'實際銷貨 × 即期匯率 + 避險金額 ×（遠期匯率 − 即期匯率）', ex:'說明為什麼避險超過實際銷貨會形成投機部位'}
  ],
  glossary:[
    {term:'資金池（Cash pooling）', def:'合併集團各銀行帳戶的餘額，可實際把現金歸集到一個帳戶，或僅為計息而名目合併，讓多餘的現金抵銷借款。'},
    {term:'集團內部淨額結算（Intercompany netting）', def:'抵銷集團各公司彼此之間的欠款，讓每家公司只付出或收到一筆淨額，通常每月一次。'},
    {term:'避險政策（Hedging policy）', def:'經董事會核准的文件，明訂哪些匯率暴險要避險、避險多少、用哪些工具、由誰執行，以及如何報告部位。'},
    {term:'避險比率（Hedge ratio）', def:'預測或確定的外幣暴險中，由避險合約涵蓋的比例。'},
    {term:'授信額度明細表（Facilities register）', def:'集團內每一筆借款、透支、保證和信用額度的清單，附額度、已動用金額、到期日和財務承諾條款。'},
    {term:'交叉違約（Cross-default）', def:'借款合約條款，允許貸款人在借款人對另一筆借款違約時要求還款。'}
  ]
});
})();
