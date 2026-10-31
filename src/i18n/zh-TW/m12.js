/* ===== Module 12: Break-even and pricing ===== */
(function(){
const {K,TIP,FLAG,CASE,REPORT,Q,FS,FLIP,SORT,CHECK,W,PACK,money,signed,pct,kfmt} = BW.h;

BW.add({
  id:'m12', minutes:50,
  title:'損益兩平與訂價',
  subtitle:'把成本分成隨銷量變動的和不隨銷量變動的，大多數訂價與銷量問題就迎刃而解。',
  goals:[
    '區分固定成本與變動成本，並計算邊際貢獻率',
    '找出BraceWorks的損益兩平點與安全邊際',
    '依目標利潤率為出口報價訂價，納入運費、付款條件與匯率',
    '算出一次漲價最多能承受流失多少銷量'
  ],
  sections:[
  {id:'behave', label:'固定與變動', kind:'learn', title:'會變動的成本，與不會變動的成本', blocks:[
    `<p>損益表是依成本<em>是什麼</em>來分組。但做決策時，你需要依銷量變動時成本<em>如何變化</em>來分組。</p>
     <ul>
      <li><strong>變動成本</strong>隨每賣出一個單位而增減：材料、每批出貨的運費、銷售佣金。</li>
      <li><strong>固定成本</strong>在短期內不論銷量多少都維持不變：租金、薪資、折舊、保險、認證費用。</li>
     </ul>`,
    SORT('對BraceWorks而言，未來幾個月內這些是固定還是變動成本？',['變動','固定'],[
      {text:'泡棉與布料', a:0, why:'每多做一張床墊就需要更多。'},
      {text:'廠房租金', a:1, why:'不論做2,000張還是3,000張床墊，租金都一樣。'},
      {text:'按營收2%計算的銷售佣金', a:0, why:'直接隨營業收入變動。'},
      {text:'領月薪的生產人員', a:1, why:'短期內不論產線忙不忙，你都得付團隊薪水。在菲律賓，正職員工只能基於法定事由、經預告並支付資遣費才能解僱，所以訂單減少時這項成本不會下降。以一年來看你可以增聘或減少人力，所以它屬於「半固定」。'},
      {text:'訂單多時的加班費', a:0, why:'只在產線多運轉的時數支付，而且有加成：在菲律賓，一般工作天的加班每小時至少多付25%。'},
      {text:'旺季僱用的派遣人員', a:0, why:'為了額外的銷量而僱用，旺季結束就解約。'},
      {text:'每批出貨的海運運費', a:0, why:'出貨越多，運費越多。'},
      {text:'ISO 13485 認證稽核費', a:1, why:'不論銷量多少都一樣。'},
      {text:'泡棉裁切機的折舊', a:1, why:'依時間提列，不是依使用量。'}
    ]),
    `<h3>重新排列後的BraceWorks</h3>`,
    FS({title:'以邊際貢獻觀點檢視BraceWorks的年度', cols:['$','占營收%'], rows:[
      ['營業收入', [1200000,'100%'], 'sub'],
      ['材料', [-552000,'46%'], 'ind'],
      ['運費與出口文件', [-48000,'4%'], 'ind'],
      ['銷售佣金', [-24000,'2%'], 'ind'],
      ['邊際貢獻', [576000,'48%'], 'sub'],
      ['生產人員薪資', [-152000,''], 'ind'],
      ['製造費用', [-156000,''], 'ind'],
      ['其他推銷及管理費用', [-174000,''], 'ind'],
      ['利息與匯率', [-20000,''], 'ind'],
      ['固定成本合計', [-502000,''], 'sub'],
      ['稅前淨利', [74000,''], 'total']
    ]}),
    K('生產人工是混合成本',
      `<p>生產人工真的是固定成本嗎？實務上它是<strong>部分固定、部分變動</strong>。領月薪的核心團隊不論產線忙或閒都要支薪。但旺季會帶來<strong>加班</strong>以及<strong>派遣或日薪人員</strong>，這些會隨銷量變動。這類成本稱為<span class="term">半變動成本</span>。</p>
       <p>上表為了讓第一眼看起來簡單，把$152,000的生產人員薪資全部視為固定成本。下面把它拆開，看看有什麼改變。</p>`),
    K('邊際貢獻：本課程最有用的數字',
      `<p><span class="term">邊際貢獻</span> = 營業收入 − 變動成本。這是每筆銷售先用來支付固定成本、之後再轉為利潤的金額。</p>
       <p>在把所有生產人員薪資視為固定成本的情況下，BraceWorks的<strong>邊際貢獻率是48%</strong>。所以以目前價格每多賣$100，只要固定成本不變，利潤就增加$48。而每少賣$100，就損失$48。</p>`),
    {t:'tbl', head:['每單位','床墊','吊帶','護具'], opts:{num:[1,2,3]}, rows:[
      ['售價','$180.00','$45.00','$28.00'],
      ['材料','($95.00)','($18.00)','($11.80)'],
      ['運費與佣金（6%）','($10.80)','($2.70)','($1.68)'],
      {cls:'',cells:['<strong>單位邊際貢獻</strong>','<strong>$74.20</strong>','<strong>$24.30</strong>','<strong>$14.52</strong>']},
      ['邊際貢獻率','41.2%','54.0%','51.9%'],
      ['全部成本下的毛利率（第6單元）','30.3%','39.7%','16.6%']
    ]},
    TIP('留意護具',
      `<p>以全部成本來看，護具是最弱的產品，只有16.6%。以邊際貢獻來看，卻有51.9%，幾乎和吊帶一樣好。兩種看法都正確，它們回答的是不同的問題。第13單元會說明決定是否停售某項產品時該用哪一種。</p>`)
  ]},
  {id:'be', label:'損益兩平', kind:'play', title:'BraceWorks在哪裡損益兩平？', blocks:[
    `<p><span class="term">損益兩平點</span>是邊際貢獻剛好足以支付固定成本的銷售水準：不賺也不賠。</p>
     <p class="num" style="font-weight:600">損益兩平銷售額 = 固定成本 ÷ 邊際貢獻率 = $502,000 ÷ 48% = $1,045,833</p>
     <p>BraceWorks的銷售額是$1,200,000。兩者的差距就是它的<span class="term">安全邊際</span>：$154,000，也就是<strong>12.8%</strong>。銷售額可以下降12.8%，公司才會出現虧損。</p>`,
    W('損益兩平圖', function(el, ctx){
      const {money,pct,kfmt}=ctx.h;
      const top=document.createElement('div'), chart=document.createElement('div'), out=document.createElement('div'); el.append(top,chart,out);
      ctx.ui.sliders(top,[
        {k:'p',label:'價格變動',min:-10,max:10,step:1,v:0,f:x=>(x>0?'+':'')+x+'%'},
        {k:'vc',label:'單位變動成本變動',min:-10,max:15,step:1,v:0,f:x=>(x>0?'+':'')+x+'%'},
        {k:'fc',label:'固定成本',min:400000,max:620000,step:5000,v:502000,f:money}
      ],(v)=>{
        const R=1200000*(1+v.p/100), VC=624000*(1+v.vc/100), FC=v.fc; const cm=(R-VC)/R;
        const be=cm>0?FC/cm:Infinity, beVol=cm>0?be/R:Infinity; const pbt=R-VC-FC;
        const W_=600,H_=300,L=64,B=36,T=12,Rt=14; const xmax=1.5, ymax=Math.max(R,VC+FC)*1.5*1.02;
        const X=x=>L+(x/xmax)*(W_-L-Rt), Y=y=>T+(1-y/ymax)*(H_-T-B);
        const line=(f,col,dash)=>`<polyline fill="none" stroke="${col}" stroke-width="2.5" ${dash?'stroke-dasharray="6 5"':''} points="${[0,0.5,1,1.5].map(x=>X(x).toFixed(1)+','+Y(f(x)).toFixed(1)).join(' ')}"/>`;
        let grid=''; for(let i=0;i<=4;i++){ const y=ymax*i/4; grid+=`<line x1="${L}" x2="${W_-Rt}" y1="${Y(y)}" y2="${Y(y)}" stroke="var(--rule)" stroke-width="1"/><text x="${L-8}" y="${Y(y)+4}" text-anchor="end" font-size="11" fill="var(--muted)" font-family="var(--f-mono)">${kfmt(y)}</text>`; }
        [0,0.5,1,1.5].forEach(x=>{ grid+=`<text x="${X(x)}" y="${H_-B+18}" text-anchor="middle" font-size="11" fill="var(--muted)" font-family="var(--f-mono)">${Math.round(x*100)}%</text>`; });
        const beMark= isFinite(beVol)&&beVol<=xmax ? `<line x1="${X(beVol)}" x2="${X(beVol)}" y1="${T}" y2="${H_-B}" stroke="var(--amber)" stroke-width="1.5" stroke-dasharray="3 4"/><circle cx="${X(beVol)}" cy="${Y(be)}" r="5" fill="var(--amber)"/><text x="${X(beVol)>W_*0.55?X(beVol)-8:X(beVol)+8}" text-anchor="${X(beVol)>W_*0.55?'end':'start'}" y="${Y(be)-10}" font-size="12" fill="var(--amber)" font-weight="700" font-family="var(--f-body)">損益兩平 ${kfmt(be)}</text>`:'';
        const cur=`<line x1="${X(1)}" x2="${X(1)}" y1="${T}" y2="${H_-B}" stroke="var(--ink)" stroke-width="1" stroke-dasharray="2 3" opacity=".5"/><text x="${X(1)-6}" y="${T+14}" text-anchor="end" font-size="11" fill="var(--muted)" font-family="var(--f-body)">目前銷量</text>`;
        chart.innerHTML=`<div style="overflow-x:auto"><svg viewBox="0 0 ${W_} ${H_}" style="width:100%;min-width:420px;height:auto" role="img" aria-label="損益兩平圖">${grid}<line x1="${L}" x2="${W_-Rt}" y1="${H_-B}" y2="${H_-B}" stroke="var(--rule-strong)"/>${line(x=>FC,'var(--muted)',true)}${line(x=>FC+VC*x,'var(--red)')}${line(x=>R*x,'var(--good)')}${cur}${beMark}<text x="${L}" y="${H_-4}" font-size="11" fill="var(--muted)" font-family="var(--f-body)">銷量（占目前銷量的%）</text></svg></div>
          <div class="row small" style="gap:14px;color:var(--muted)"><span><span style="display:inline-block;width:14px;height:3px;background:var(--good);vertical-align:middle"></span> 營業收入</span><span><span style="display:inline-block;width:14px;height:3px;background:var(--red);vertical-align:middle"></span> 總成本</span><span><span style="display:inline-block;width:14px;height:0;border-top:2px dashed var(--muted);vertical-align:middle"></span> 固定成本</span></div>`;
        const mos=isFinite(be)?(R-be)/R:-1;
        out.innerHTML=`<div class="stats">${ctx.ui.stat('邊際貢獻率',pct(cm))}${ctx.ui.stat('損益兩平銷售額',isFinite(be)?money(Math.round(be)):'永遠無法','',isFinite(beVol)?`目前銷量的${Math.round(beVol*100)}%`:'')}${ctx.ui.stat('安全邊際',isFinite(be)?pct(mos):'–',mos<0?'bad':mos<0.1?'warn':'good')}${ctx.ui.stat('目前銷量下的稅前淨利',money(Math.round(pbt)),pbt<0?'bad':'')}</div>`;
      },ctx.uid);
    }),
    K('營運槓桿',
      `<p>由於BraceWorks的成本大多是固定的，利潤的波動遠大於銷售額。邊際貢獻$576,000 ÷ 稅前淨利$74,000 = <strong>7.8</strong>。這就是<span class="term">營運槓桿</span>：銷售額變動1%，利潤約變動7.8%。銷售額下滑10%，利潤會減少將近80%。高營運槓桿在好年頭令人振奮，在壞年頭則很危險。</p>`),
    Q('固定成本增加$24,000（新聘一位品保工程師）。銷售額要增加多少才能維持相同利潤？',['$24,000','$50,000','$11,520','$100,000'],1,'需要增加的銷售額 = $24,000 ÷ 48% = $50,000。每一筆固定成本，大約需要兩倍金額的額外銷售來支應。')
  ]},
  {id:'price', label:'出口報價訂價', kind:'play', title:'出口報價怎麼訂', blocks:[
    `<p>每一份出口報價都有國內價目表不會考慮的成本：誰負擔運費與關稅（<span class="term">國貿條規</span>）、要等多久才收到款項、匯率風險，以及佣金。每一項不是占售價的%，就是每單位的成本。漏掉任何一項，你的利潤就會悄悄消失。</p>`,
    W('出口報價試算', function(el, ctx){
      const {money,pct}=ctx.h; const m2=x=>money(x,2);
      const P={m:{n:'Mattress',full:125.40,vc:95,list:180,log:{EXW:0,FOB:3,CIF:14,DDP:22}},s:{n:'Sling',full:27.12,vc:18,list:45,log:{EXW:0,FOB:0.6,CIF:1.8,DDP:3.2}},b:{n:'Brace',full:23.35,vc:11.8,list:28,log:{EXW:0,FOB:0.4,CIF:1.1,DDP:2.0}}};
      let prod='m', inc='FOB';
      const segP=document.createElement('div'), segI=document.createElement('div'), top=document.createElement('div'), out=document.createElement('div');
      segI.style.marginTop='8px'; el.append(segP,segI,top,out);
      let vals={};
      function draw(){
        const p=P[prod], log=p.log[inc], duty=inc==='DDP'?0.03:0;
        const fin=0.08*vals.days/365, pctCosts=vals.com/100+vals.fx/100+fin+duty;
        const target=vals.tm/100;
        const priceT=(p.full+log)/(1-target-pctCosts);
        const floor=(p.vc+log)/(1-pctCosts);
        const fullBE=(p.full+log)/(1-pctCosts);
        const listMargin=(p.list-(p.full+log)-p.list*pctCosts)/p.list;
        out.innerHTML=ctx.ui.table(['目標售價的組成','每單位'],[
          ['全部單位成本（第6單元）',m2(p.full)],
          [`運費、保險與處理費（${inc}）`,m2(log)],
          ['銷售佣金（'+vals.com+'%）',m2(priceT*vals.com/100)],
          ['匯率緩衝（'+vals.fx+'%）',m2(priceT*vals.fx/100)],
          [`等待${vals.days}天收款的成本（年利率8%）`,m2(priceT*fin)],
          ...(duty?[['由我方支付的進口關稅（3%）',m2(priceT*duty)]]:[]),
          ['利潤（'+vals.tm+'%）',m2(priceT*target)],
          {cls:'',cells:['<strong>報價</strong>',`<strong>${m2(priceT)}</strong>`]}
        ],{num:[1]})+
        `<div class="stats" style="margin-top:12px">${ctx.ui.stat('達到目標利潤率的報價',m2(priceT),'good')}${ctx.ui.stat('涵蓋全部成本、零利潤',m2(fullBE),'warn')}${ctx.ui.stat('絕對底線：只涵蓋變動成本',m2(floor),'bad')}${ctx.ui.stat('以價目表價格（'+money(p.list)+'）報價的利潤率',pct(listMargin),listMargin<0.1?'bad':listMargin<target?'warn':'good')}</div>
        <p class="w-hint" style="margin-top:10px">${inc==='DDP'?'DDP代表BraceWorks要負擔運費、保險、進口關稅，並承擔一路送到客戶門口的風險。如果你用FOB的價格報DDP，差額會直接從你的利潤中扣掉。':vals.days>=90?'較長的付款條件是實實在在的成本：你的錢在替客戶融資。以年利率8%計算，90天約占售價的2%。':'試著把國貿條規切換成DDP並搭配90天付款條件，再和價目表價格的利潤率比較看看。'}</p>`;
      }
      function build(){
        top.innerHTML='';
        ctx.ui.sliders(top,[
          {k:'tm',label:'扣除所有成本後的目標利潤率',min:5,max:40,step:1,v:25,f:x=>x+'%'},
          {k:'days',label:'客戶付款條件',min:0,max:120,step:15,v:60,f:x=>x+' 天'},
          {k:'com',label:'銷售佣金或代理商費用',min:0,max:10,step:0.5,v:2,f:x=>x+'%'},
          {k:'fx',label:'匯率緩衝（以歐元報價時）',min:0,max:5,step:0.5,v:0,f:x=>x+'%'}
        ],(v)=>{vals=v;draw();},ctx.uid);
      }
      ctx.ui.seg(segP,[{v:'m',label:'床墊'},{v:'s',label:'吊帶'},{v:'b',label:'護具'}],'m',v=>{prod=v;draw();});
      ctx.ui.seg(segI,[{v:'EXW',label:'EXW：在工廠交貨'},{v:'FOB',label:'FOB：裝上船'},{v:'CIF',label:'CIF：送到對方港口'},{v:'DDP',label:'DDP：送到對方門口，關稅已付'}],'FOB',v=>{inc=v;draw();});
      build();
    }),
    K('每項產品都該知道的三個價格水準',
      `<ul>
        <li><strong>目標價格：</strong>涵蓋全部成本、交貨條件、融資成本與你的目標利潤。這是你平常的報價。</li>
        <li><strong>全部成本價格：</strong>涵蓋一切，但什麼也沒賺。低於這個價格，你就沒有分擔到應負的間接費用。</li>
        <li><strong>底價：</strong>只涵蓋變動成本。低於這個價格，每多賣一個單位你就更窮。只有在有閒置產能的特殊情況下才考慮接近它（第13單元）。</li>
       </ul>`),
    TIP('成本加成定價是底線，不是策略',
      `<p>成本告訴你能接受的最低價格，卻不會告訴你客戶願意付的最高價格。對於BraceWorks具優勢的產品，例如交期快、經過認證的減壓床墊，去問業務競爭對手怎麼收費，以及醫院使用更好的產品能省下多少。這就是<span class="term">價值定價</span>，利潤就是在這裡贏來的。</p>`)
  ]},
  {id:'raise', label:'漲價測試', kind:'learn', title:'一次漲價最多能承受流失多少銷量？', blocks:[
    `<p>每次漲價背後的恐懼，都是怕失去客戶。邊際貢獻能讓你把這個風險量化。</p>
     <p class="num" style="font-weight:600">最多可流失的銷量 = 漲價幅度 ÷ (邊際貢獻率 + 漲價幅度)</p>
     <p>以BraceWorks漲價5%為例：5% ÷ (48% + 5%) = <strong>9.4%</strong>。即使每十個單位流失將近一個，利潤仍然不變。流失得更少，你就賺更多。</p>`,
    {t:'tbl', head:['漲價幅度','可流失而仍維持相同利潤的銷量','若改為降價所需增加的銷量'], opts:{num:[1,2]}, rows:[
      ['+3%','5.9%','–'],['+5%','9.4%','–'],['+10%','17.2%','–'],['−5%','–','11.6%'],['−10%','–','26.3%']
    ]},
    K('不對稱性',
      `<p>價格<em>調降</em>10%，需要多26%的銷量才能維持原狀。價格<em>調漲</em>10%，可以流失17%的銷量而仍維持相同利潤。在利潤率薄、固定成本高的情況下，打折代價高昂，而漲價威力強大。</p>`),
    Q('BraceWorks漲價5%，流失3%的銷量。稅前淨利會如何變化？',['下降','不變','增加約$40,000','增加$60,000'],2,
      '營業收入變成$1,222,200。變動成本變成$606,400：材料與運費隨銷量減少，佣金則隨價格增加。邊際貢獻由$576,000增加到$615,800，約多出$40,000，而固定成本不變。')
  ]},
  {id:'case', label:'個案：沒人敢漲價', kind:'case', title:'沒人敢提的漲價', blocks:[
    CASE('兩年沒漲價',
      `<p>兩年來，泡棉漲了12%、布料漲了7%、薪資漲了8%。BraceWorks的價格卻沒變，因為「經銷商會跑掉」。毛利率已從31.5%滑落到28.3%。</p>
       <p>你提議從1月1日起漲價5%。業務經理估計可能會流失最多6%的銷量。老闆問：<em>「值得冒這個險嗎？」</em></p>`),
    FS({title:'數字', cols:['不變','+5%，流失6%'], rows:[
      ['營業收入', [1200000, 1184400]],
      ['變動成本（材料、運費、佣金）', [-624000, -587700]],
      ['邊際貢獻', [576000, 596700], 'sub'],
      ['固定成本', [-502000, -502000]],
      ['稅前淨利', [74000, 94700], 'total']
    ], note:'即使是業務經理估計的最壞情況，利潤仍增加28%。佣金隨較高的價格增加；材料與運費隨較低的銷量減少。'}),
    Q('BraceWorks應該如何推行漲價？',[
      {text:'一夜之間全面漲價5%，不做任何說明', why:'突如其來會損害信任。經銷商需要時間更新他們自己的價目表。'},
      {text:'提前60–90天通知，簡短而誠實地說明成本上漲的情況，以小幅的忠誠優惠保護重要客戶，事後再按客戶追蹤銷量'},
      {text:'只對新客戶漲價', why:'這樣大部分的利潤問題仍未解決。'},
      {text:'再等一年，看成本會不會下降', why:'每延後一年，就要損失約$20,000–$60,000的利潤。'}
    ],1,'醫療用品經銷商本來就預期每年會有價格檢討。有提前通知、並與實際成本上漲連結的清楚說明，幾乎能留住所有經銷商。之後再按客戶追蹤銷量與利潤率，看看誰有反應。'),
    K('會計是怎麼發現的',
      `<p>訊號其實一直都在報表裡：材料占營收的%逐漸上升（第3單元）、泡棉出現不利的價格差異（第8單元），以及沒有更新的標準成本（第6單元）。缺少的是每年的例行程序：<strong>先更新標準成本，再據以檢討價格</strong>。</p>`)
  ]},
  {id:'quiz', label:'測驗', kind:'quiz', title:'檢驗你的理解', blocks:[
    Q('營業收入$120萬，變動成本$624,000。邊際貢獻率是多少？',['52%','48%','28%','62%'],1,'($1,200,000 − $624,000) ÷ $1,200,000 = 48%。'),
    Q('固定成本$502,000，邊際貢獻率48%。損益兩平營業收入是多少？',['$502,000','$1,045,833','$240,960','$1,200,000'],1,'$502,000 ÷ 0.48 = $1,045,833。'),
    Q('短期內能對利潤有任何貢獻的絕對最低價格是哪一個？',['全部成本','變動成本（加上交貨與收款成本）','價目表價格','損益兩平價格'],1,'任何高於變動成本的價格都能增加邊際貢獻。但只有在有閒置產能、且不損及正常價格時才合理。'),
    Q('你用與FOB報價相同的價格報DDP。會發生什麼事？',['什麼都不變','你的利潤要吸收運費、保險、關稅與交貨風險','客戶付得更多','你的營收增加'],1,'DDP把一路到客戶門口的所有成本都轉到你身上。價格必須相應調高。'),
    Q('邊際貢獻率為48%時，漲價5%在利潤下降前最多能流失多少銷量？',['5%','9.4%','25%','48%'],1,'5 ÷ (48 + 5) = 9.4%。'),
    Q('高營運槓桿代表⋯⋯',['利潤的變動遠大於銷售額，不論上升或下降','公司負債很多','銷售額非常穩定','變動成本很高'],0,'在成本以固定成本為主時，銷售額每變動1%，利潤就變動好幾個%。')
  ]},
  {id:'apply', label:'練習', kind:'apply', title:'用練習包練習', blocks:[
    PACK('packB',3,'練習包B，第3頁：管理評述'),
    Q('練習包B提議進行價格檢討。若漲價4%且銷量沒有流失，3月的毛利率會是多少？',['26.7%','約29.5%','約31%','約34%'],1,'營業收入$106,080，營業毛利$27,200 + $4,080 = $31,280：29.5%。'),
    PACK('packC',4,'練習包C，第4頁：損益表'),
    Q('練習包C的運費占營收5.0%，預算為4.0%，原因是一筆大訂單以CIF出貨。未來的CIF報價應該包含什麼？',['不需額外加入','到目的港的海運運費與保險，並計入報價','只要佣金','折扣'],1,'在CIF條件下，賣方負擔運費與保險。要把它計入價格（第12單元）。'),
    {t:'html',html:'<h3>日後，用你自己的報告</h3><p class="small" style="color:var(--muted)">選讀。下次閱讀你自己的月報時，可以使用這份檢核清單。這裡的內容不會被分享或傳送；勾選紀錄只會儲存在這個瀏覽器中。</p>'},
    CHECK('m12-price','在我的公司⋯⋯',[
      '財務部門能告訴我公司的邊際貢獻率與損益兩平銷售額',
      '每項產品都有已知的變動成本與單位邊際貢獻',
      '報價會依國貿條規納入運費、付款條件、匯率與佣金',
      '業務知道每項產品的底價，報價低於目標價格時需要核准',
      '每年依更新後的標準成本檢討價格',
      '佣金依邊際貢獻或營業毛利計算，而不只依營收',
      '我們追蹤報價的成交率與利潤率，而不只看銷量'
    ]),
    REPORT('你週一早上要問的問題',
      `<p>問：<strong>「我們的邊際貢獻率、損益兩平銷售額和安全邊際是多少？」</strong>接著問：<strong>「我們上次漲價是什麼時候？之後成本又漲了多少？」</strong></p>`),
    K('重點整理',
      `<ul>
        <li>邊際貢獻 = 營業收入 − 變動成本。BraceWorks每一塊錢的銷售中，有48分錢用來支付固定成本。</li>
        <li>損益兩平點 = 固定成本 ÷ 邊際貢獻率。安全邊際顯示銷售額能下降多少。</li>
        <li>出口價格必須涵蓋交貨條件、付款條件、匯率與佣金。</li>
        <li>漲價通常勝過衝量。降價所需增加的銷量，遠比你想像的多。</li>
       </ul>`)
  ]}
  ],
  warnings:[
    {sign:'成本上漲，但超過一年沒有漲價', meaning:'利潤率遭侵蝕，常常一年就掉好幾個百分點。', look:'材料與薪資的漲幅相對於價格變動。'},
    {sign:'安全邊際低於10%', meaning:'銷售額小幅下滑就會造成虧損。', look:'損益兩平銷售額相對於預測；固定成本的成長。'},
    {sign:'DDP或CIF報價卻按FOB訂價', meaning:'運費、關稅與風險被吸收，卻沒有計入價格。', look:'近期訂單依國貿條規區分的利潤率。'},
    {sign:'業務以延長付款條件來爭取訂單', meaning:'隱藏的降價，加上更多資金被套住。', look:'各客戶的付款條件；報價中的融資成本。'}
  ],
  formulas:[
    {name:'邊際貢獻', f:'營業收入 − 變動成本', ex:'$1,200,000 − $624,000 = $576,000'},
    {name:'邊際貢獻率', f:'邊際貢獻 ÷ 營業收入', ex:'$576,000 ÷ $1,200,000 = 48%'},
    {name:'損益兩平銷售額', f:'固定成本 ÷ 邊際貢獻率', ex:'$502,000 ÷ 48% = $1,045,833'},
    {name:'安全邊際', f:'(實際銷售額 − 損益兩平銷售額) ÷ 實際銷售額', ex:'($1,200,000 − $1,045,833) ÷ $1,200,000 = 12.8%'},
    {name:'營運槓桿', f:'邊際貢獻 ÷ 稅前淨利', ex:'$576,000 ÷ $74,000 = 7.8×'},
    {name:'漲價可流失的銷量', f:'漲價幅度 ÷ (邊際貢獻率 + 漲價幅度)', ex:'5% ÷ (48% + 5%) = 9.4%'},
    {name:'降價需增加的銷量', f:'降價幅度 ÷ (邊際貢獻率 − 降價幅度)', ex:'5% ÷ (48% − 5%) = 11.6%'}
  ],
  glossary:[
    {term:'變動成本（Variable cost）', def:'隨銷量增減的成本，例如材料或每批出貨的運費。'},
    {term:'固定成本（Fixed cost）', def:'短期內不論銷量多少都維持不變的成本，例如租金或薪資。'},
    {term:'半變動成本（Semi-variable cost）', def:'包含固定部分與變動部分的成本，例如生產人工：領月薪的核心團隊，加上隨銷量增加的加班與派遣人員。又稱混合成本。'},
    {term:'邊際貢獻（Contribution）', def:'營業收入減去變動成本。每筆銷售對固定成本與利潤的貢獻。'},
    {term:'邊際貢獻率（Contribution margin）', def:'邊際貢獻占營業收入的%。'},
    {term:'損益兩平點（Break-even point）', def:'邊際貢獻剛好足以支付固定成本的銷售水準。'},
    {term:'安全邊際（Margin of safety）', def:'銷售額在公司出現虧損前能下降多少，以占目前銷售額的%表示。'},
    {term:'營運槓桿（Operating leverage）', def:'利潤對銷售額變動的敏感程度，取決於固定成本所占比重。'},
    {term:'國貿條規（Incoterms）', def:'標準貿易條件（EXW、FCA、FOB、CIF、DDP等），界定交貨每個階段由誰付費、由誰承擔風險。'},
    {term:'價值定價（Value-based pricing）', def:'依產品對客戶的價值訂價，而不只依成本。'},
    {term:'底價（Floor price）', def:'可接受的最低價格：變動成本加上交貨與收款成本。'}
  ]
});
})();
