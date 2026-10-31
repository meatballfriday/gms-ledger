/* ===== Glossary: extra terms, short forms, and the lookup used across the course ===== */
(function(){
'use strict';
const ADD={
  m28:[
    {term:'投資後估值（Post-money valuation）', def:'公司在新資金投入後當下的價值：投資前估值加上新投入的資金。投資人的持股比例，等於新資金除以投資後估值。'},
    {term:'盡職調查（Due diligence）', def:'買方或投資人在交易前對企業所做的詳細檢查：財務、稅務、法律、合約、品質和人員。查到的結果會反映在價格和合約裡。'},
    {term:'賣方盡職調查（Vendor due diligence）', def:'由賣方在出售前委託進行的盡職調查，讓買方拿到一份現成的報告，交易後期也比較不會冒出意外。'},
    {term:'投資條件書（Term sheet）', def:'一份簡短文件，在正式法律合約起草之前，列出投資或出售的主要條件，例如價格、持股、董事席次、否決權和優先權。大多不具約束力，但事後很難重新談判。'},
    {term:'私募股權（Private equity）', def:'買進非上市公司少數或多數股權的基金，目標是讓公司成長，並在大約四到七年內出售。通常會取得董事席次和否決權。'},
    {term:'策略投資人（Strategic investor）', def:'同業或相關產業的公司，基於策略考量（例如產品、市場或技術）投資或收購一家企業。'},
    {term:'私募信貸（Private credit）', def:'由投資基金而非銀行提供的貸款。通常較快、較有彈性，但利率較高。'},
    {term:'開發金融機構（Development finance institution, DFI）', def:'由政府支持的放款人或投資人，例如 IFC，為開發中國家的民營企業提供資金，期限往往比銀行更長。'},
    {term:'加回調整（Add-back）', def:'賣方對 EBITDA 所做的調整，把它認為不會再發生的成本（例如一次性的訴訟）剔除。買方只接受有證據支持的加回調整。'},
    {term:'常態化EBITDA（Normalised EBITDA）', def:'針對一次性項目和非市場行情成本做出合理調整後的 EBITDA。這是買方用來評估企業價值的數字。'},
    {term:'交割日結算帳目（Completion accounts）', def:'決定最終價格的一種方式：在交割日編製帳目，再依實際的現金、負債和營運資金調整價格。另一種做法是鎖箱機制（locked box）。'},
    {term:'價金保管（Escrow）', def:'出售價款中的一部分由第三方保管一段約定的期間，用來支付買方依聲明保證條款提出的求償。'},
    {term:'聲明保證與補償條款（Warranties and indemnities）', def:'出售合約中對企業狀況所做的承諾（聲明保證），以及針對已知風險承諾賠償的特定條款（補償）。若事後發現有問題，買方可據此求償。'}
  ],
  m27:[
    {term:'風險胃納（Risk appetite）', def:'董事會為了達成目標，願意承擔多少風險、承擔哪些類型的風險。它決定各種上限，例如借款上限，或可以有多少外幣部位不避險。'},
    {term:'高層基調（Tone from the top）', def:'領導者在誠信、控制和道德上所樹立的榜樣。員工看的是領導者怎麼做，多過政策怎麼寫。'},
    {term:'董事會（Board of directors）', def:'由股東選出、負責監督經營團隊的一群人：核准策略、預算和重大決策，任命執行長並決定其薪酬，並確保控制制度有效運作。'},
    {term:'薪資報酬委員會（Remuneration committee）', def:'董事會轄下的委員會，通常由獨立董事組成，負責訂定執行長和高階主管的薪酬與獎酬。'},
    {term:'協同委外（Co-sourcing）', def:'把部分內部稽核工作（例如資訊系統或海外據點的稽核）委由外部事務所執行，而公司仍保有稽核計畫的主導權。'},
    {term:'美國海外反腐敗法（Foreign Corrupt Practices Act, FCPA）', def:'美國的反賄賂法律。在美國上市、在美國營運或經由美國付款的外國公司都可能受其管轄；已有多家醫療器材廠商因此支付鉅額和解金。'},
    {term:'風險熱圖（Risk heat map）', def:'依發生可能性和影響程度，把每項風險標在一張方格圖上，讓最大的風險一目了然。'}
  ],
  m26:[
    {term:'名目資金池（Notional pooling）', def:'銀行以集團多個帳戶的合計餘額計算利息，但帳戶之間不實際移轉任何資金。並非每個國家都提供。'},
    {term:'主要往來銀行（Relationship bank）', def:'集團集中往來的少數幾家銀行之一，讓每家銀行都充分了解集團，在關鍵時刻願意放款。'},
    {term:'母公司保證（Parent company guarantee）', def:'母公司承諾在子公司無法償債時代為清償。這會讓母公司自己的資產和借款財務承諾條款都承擔風險。'},
    {term:'外匯選擇權（Currency option）', def:'一種合約，賦予持有人以約定匯率兌換外幣的權利，但沒有義務。它能防範不利的匯率變動，同時保留有利的一面，代價是一筆預先支付、稱為權利金的費用。'},
    {term:'累計型選擇權（Accumulator）', def:'一種槓桿型合約：市場維持在某個區間內時給你較好的匯率，但一旦走勢不利，就會強迫持有人買進或賣出兩倍甚至更多的金額。健全的避險政策會禁止使用。'},
    {term:'過度避險（Over-hedging）', def:'避險的外幣金額超過企業實際會收到或支付的金額。超出的部分不是保障，而是在賭匯率。'}
  ],
  m25:[
    {term:'系統上線（Go-live）', def:'新系統（例如 ERP）正式取代舊系統的那一天。要安全上線，需要乾淨的資料、完整的演練，以及一個明確決定喊停或繼續的時間點。'}
  ],
  m23:[
    {term:'集團內部借款（Intercompany loan）', def:'集團內一家公司借給另一家公司的錢。需要書面協議和符合常規交易的利率，可能須扣繳稅款，有些國家還要求登記。'},
    {term:'權利金（Royalty）', def:'使用他人品牌、技術或專業知識所支付的費用。在集團內，子公司可能支付權利金給母公司，把獲利移回母國，但必須符合常規交易。'}
  ],
  m21:[
    {term:'商譽（Goodwill）', def:'收購價格中，超過所取得資產與負債公允價值的部分：品牌、人才和客戶關係。在 IFRS 下商譽不攤銷，但每年至少要做一次減損測試。'},
    {term:'報導期間後事項（Events after the reporting date）', def:'在年底到財務報表簽發日之間發生的事。有些會改變數字，例如年底時已陷入困境的客戶後來倒閉；有些則只在附註中揭露。'}
  ],
  m24:[
    {term:'國際財務報導準則（IFRS, International Financial Reporting Standards）', def:'美國以外多數國家（包括歐盟和澳洲）上市公司所採用的會計準則。菲律賓以 PFRS 的形式採用。美國則使用自己的準則，即 US GAAP。'},
    {term:'菲律賓財務報導準則（PFRS, Philippine Financial Reporting Standards）', def:'菲律賓版的 IFRS。較大的公司使用完整的 PFRS；較小的公司依規模可以使用較簡化的版本，例如中小企業適用之 PFRS。'},
    {term:'中小企業適用之菲律賓財務報導準則（PFRS for SMEs）', def:'給未上市中小型公司使用的簡化版 PFRS：揭露較少，部分規定也較簡單。'},
    {term:'已實現兌換損益（Realised exchange gain or loss）', def:'外幣發票實際收付時，因匯率與入帳時不同而產生的匯兌損益。與未實現兌換損益不同，它已經變成現金。'}
  ],
  m19:[
    {term:'加值稅（VAT, value added tax）', def:'在供應鏈每個環節課徵的一種銷售稅。企業對銷貨收取（銷項稅額），申請扣抵進貨時支付的部分（進項稅額），再繳納差額。出口通常適用零稅率。'}
  ],
  m1:[
    {term:'損益表（Profit and loss, P&L）', def:'損益表的另一個名稱。顯示一段期間的營業收入、成本和獲利。'},
    {term:'本年累計（Year to date, YTD）', def:'從會計年度開始到本月月底為止。「本年累計營收」指的是今年到目前為止的全部營收。'},
    {term:'股利（Dividend）', def:'公司把獲利發放給股東的款項。它會減少現金和保留盈餘，但不是損益表上的費用。'},
    {term:'經銷商（Distributor）', def:'買進你的產品，再在自己市場轉售的公司。BraceWorks 的客戶大多是經銷商。'},
    {term:'ISO 13485（醫療器材品質管理系統）', def:'醫療器材製造商的國際品質管理標準。認證每年都要接受稽核，客戶和主管機關通常都會要求。'},
    {term:'CE標誌（CE marking）', def:'表示產品符合歐盟安全與性能規定的標誌。在歐洲銷售醫療器材必須具備。'},
    {term:'FDA登錄（FDA registration）', def:'向美國食品藥物管理局（FDA）登錄，是在美國銷售醫療器材的必要條件。'}
  ],
  m2:[
    {term:'過帳（Posting）', def:'把分錄記入總分類帳的各個帳戶。'},
    {term:'科目餘額（Account balance）', def:'一個帳戶在所有分錄記入後的累計總額。例如「現金」科目的餘額，就是帳上顯示的銀行存款。'},
    {term:'現金基礎會計（Cash basis accounting）', def:'只在現金實際收付時才記錄收入和成本。很簡單，但會讓每月獲利大幅波動。正式的帳務改用應計基礎會計。'},
    {term:'調節（Reconciliation）', def:'核對同一件事的兩份紀錄是否一致，並解釋任何差異。例如把銀行對帳單和帳上紀錄互相核對。'},
    {term:'結帳檢核表（Close checklist）', def:'一份列出每次月結要完成哪些步驟、由誰負責、何時完成的書面清單。'},
    {term:'應計的（Accrued）', def:'在所屬期間記錄為成本或收入，即使現金還沒有收付。應計費用就是已經發生、但尚未支付的成本。'}
  ],
  m3:[
    {term:'營業費用（Operating expenses, opex）', def:'工廠以外、日常經營的成本：業務、辦公室、行政。簡稱「opex」。可與資本支出（capex）對照。'},
    {term:'攤銷（Amortisation）', def:'類似折舊，但適用於摸不到的東西，例如軟體授權或專利：把它們的成本分攤到使用的年度。'},
    {term:'稅前淨利（Profit before tax, PBT）', def:'扣除所有成本和利息之後、但在所得稅之前的獲利。'},
    {term:'銷貨總額與銷貨淨額（Gross sales and net sales）', def:'銷貨總額是扣除折扣、退貨和折讓單之前的開票銷貨。銷貨淨額是扣除這些之後剩下的金額。'},
    {term:'銷售佣金（Sales commission）', def:'付給業務人員或代理商的款項，通常是銷貨或營業毛利的某個百分比。'},
    {term:'運費（Freight）', def:'運送貨物的成本。「銷貨運費」是送貨給客戶的費用；「進貨運費」是運進材料的費用。'}
  ],
  m4:[
    {term:'股本（Share capital）', def:'股東投入公司以換取股份的資金。屬於權益的一部分。'},
    {term:'透支（Overdraft, working capital line）', def:'一種銀行額度，讓你在上限內借款，有現金時隨時償還。用於短期需求，例如存貨和應收帳款。'},
    {term:'流動性（Liquidity）', def:'企業在帳款到期時付款的難易程度。現金和尚未動用的銀行額度是流動性最高的資源。'},
    {term:'償債能力（Solvency）', def:'企業擁有的是否多於所欠的，以及長期而言能否償還債務。'},
    {term:'呆帳（Bad debt）', def:'客戶欠款中很可能永遠收不回來的部分。會沖銷並認列為費用。'},
    {term:'沖銷（Write-off）', def:'因為資產已失去價值，而把它全部或部分從資產負債表上移除，並把損失計入損益。'},
    {term:'負債準備（Provision）', def:'時間或金額不確定的負債，例如保固、產品回收或訴訟。英文的「provision」也常泛指為可能損失預先提列的金額；在台灣會計上，應收帳款的呆帳與呆滯存貨則以資產減項表達，稱為備抵呆帳與備抵存貨跌價損失。'},
    {term:'不動產、廠房及設備（Property, plant and equipment, PPE）', def:'長期的實體資產：機器、工具、車輛、建築物和裝修。也稱為固定資產。'},
    {term:'負債權益比（Debt to equity）', def:'銀行借款除以權益。顯示企業相較於股東的錢，有多依賴借來的錢。'},
    {term:'淨負債對EBITDA比（Net debt to EBITDA）', def:'銀行借款減去現金，再除以 EBITDA。大約代表要用幾年的營運盈餘才能還清借款。銀行最愛用的檢驗指標之一。'}
  ],
  m5:[
    {term:'現金預算（Cash budget）', def:'按月或按週列出預期現金收入和支出的計畫，用來看出何時可能需要額外資金。'}
  ],
  m7:[
    {term:'存貨週轉天數（Inventory days, DIO）', def:'你的存貨夠賣幾天：存貨 ÷ 銷貨成本 × 365。又稱存貨在庫天數。'},
    {term:'呆滯存貨（Obsolete stock）', def:'因為過期、過時或已經沒人要，而無法再以全額價值出售或使用的存貨。'}
  ],
  m8:[
    {term:'工資率差異（Rate variance）', def:'人工差異中，因每小時實付工資率與標準不同所造成的部分，常常是因為加班費加成。'},
    {term:'標準工時（Standard hours）', def:'依照製程途程，生產一件產品應該花費的時間。用來評估人工效率。'},
    {term:'加班費加成（Overtime premium）', def:'超出正常工時的工作所多付的薪資，例如1.5倍工資。'},
    {term:'報廢品（Scrap）', def:'因損壞、瑕疵或剩餘而丟棄的材料或產品。'},
    {term:'重工（Rework）', def:'修理不良品，讓它能通過檢驗。要花人工和時間，但能省下材料。'}
  ],
  m9:[
    {term:'工作天（Working day）', def:'正常的營業日，不含週末和國定假日。「第8個工作天發出」指的是月底後的第八個營業日。'}
  ],
  m10:[
    {term:'授信管理（Credit control）', def:'例行的信用控管工作：設定信用額度、寄送提醒、追討遲付款項，必要時暫停出貨。'},
    {term:'報廢率（Scrap rate）', def:'報廢的材料占發料到生產線材料的百分比。'},
    {term:'人工效率（Labour efficiency）', def:'實際產出所對應的標準工時，除以實際工作時數。低於100%代表工作花的時間比應有的長。'},
    {term:'催收公司（Collection agency）', def:'代你追討逾期帳款的公司，通常按收回金額的某個百分比收費。'}
  ],
  m12:[
    {term:'成本加成定價（Cost-plus pricing）', def:'在成本上加一個利潤率來訂價。適合當作底線，但忽略了客戶願意付多少。'},
    {term:'價格檢討（Price review）', def:'定期（通常每年）依最新成本和市場檢查售價，並據以調整價格。'},
    {term:'到岸成本（Landed cost）', def:'把貨物送到目的地的全部成本：產品成本加上運費、保險、關稅和裝卸費。'}
  ],
  m13:[
    {term:'產能（Capacity）', def:'一個製程或工廠在一段期間內最多能生產的數量，例如每週件數或每月工時。'},
    {term:'產品組合（Product mix）', def:'所銷售產品的組合。即使總營收不變，改變組合也會改變總獲利。'},
    {term:'每瓶頸工時邊際貢獻（Contribution per bottleneck hour）', def:'單位邊際貢獻除以每件產品所需的瓶頸工時。產能受限時，這才是排序產品的正確方法。'}
  ],
  m15:[
    {term:'季節性（Seasonality）', def:'每年同一時間營收或成本規律的起伏，例如醫院在1月採購放緩。'},
    {term:'曲棍球桿式預算（Hockey-stick budget）', def:'一年中大部分時間持平、到年底才陡然上升的預算，通常是基於期望而非證據。'},
    {term:'由上而下與由下而上預算（Top-down and bottom-up budgeting）', def:'由上而下：由領導者設定目標。由下而上：由各主管自己編列數字。好的預算兩者兼顧。'}
  ],
  m16:[
    {term:'存貨、應收及應付週轉天數（Days inventory, receivable and payable）', def:'現金轉換循環的三個組成：存貨持有天數、客戶付款天數，以及你付款給供應商的天數。'}
  ],
  m17:[
    {term:'匯率（Exchange rate）', def:'一種貨幣以另一種貨幣表示的價格，例如 €1 兌 $1.10。'},
    {term:'避險（Hedging）', def:'降低價格朝不利方向變動的風險，例如用遠期外匯合約預先鎖定匯率。'},
    {term:'提單（Bill of lading, B/L）', def:'船公司對裝船貨物開立的收據。它證明貨物已出運，通常在目的地提貨時需要出示。'},
    {term:'關稅（Customs duty）', def:'一國對進口貨物課徵的稅。'},
    {term:'應收帳款承購（Factoring）', def:'把未收款的發票賣給金融公司，對方立即支付大部分金額，之後再向你的客戶收款。'},
    {term:'裝船前融資（Pre-shipment (packing) credit）', def:'為已確認的出口訂單支付材料和人工的銀行貸款，在客戶付款時償還。'},
    {term:'中長期貸款（Term loan）', def:'在數年內按固定分期償還的貸款。最適合用於機器等長期資產。'},
    {term:'違反財務承諾及豁免（Covenant breach and waiver）', def:'違反是指未能符合借款的財務承諾條款。豁免是銀行同意不據此採取行動，通常要收費或附加新條件。'}
  ],
  m18:[
    {term:'內部控制（Internal control）', def:'任何能防止或抓出錯誤與舞弊的例行程序，例如核准、調節和職能分工。'},
    {term:'查核（Audit）', def:'由外部會計師對年度財務報表進行的獨立檢查，最後出具查核意見。'},
    {term:'重大性（Materiality）', def:'錯誤要多大，才會對閱讀財務報表的人造成影響。會計師聚焦在重大的金額上。'},
    {term:'幽靈員工（Ghost employee）', def:'仍留在薪資名冊上的虛構或已離職員工，其薪資流向了別人。'},
    {term:'回扣（Kickback）', def:'供應商私下付給員工的款項，用來換取訂單或更好的待遇。'},
    {term:'重複付款（Duplicate payment）', def:'同一張發票付了兩次，可能是失誤，也可能是故意。'}
  ]
};
Object.keys(ADD).forEach(id=>{ const m=BW.mods[id]; if(!m){ console.error('gloss: no module '+id); return; } m.glossary=(m.glossary||[]).concat(ADD[id]); });

/* short forms and other names readers will meet */
const AKA={
  '或有負債（Contingent liability）':['或有事項'],
  '負債準備（Provision）':['提列負債準備'],
  "常規交易（Arm's length）":['符合常規交易','常規交易原則'],
  '應計項目（Accrual）':['應計','估列'],
  '關係人（Related party）':['關係人交易'],
  '查核意見（Audit opinion）':['查核報告','會計師查核報告'],
  '合併財務報表（Consolidation）':['合併報表','集團合併報表','編製合併報表'],
  '移轉訂價（Transfer pricing）':['移轉訂價文據'],
  '核決權限（Delegation of authority）':['核決權限表','分層負責'],
  '資金池（Cash pooling）':['實體資金池'],
  '遞延所得稅（Deferred tax）':['遞延所得稅資產','遞延所得稅負債','DTA','DTL'],
  '母公司保證（Parent company guarantee）':['保證','母公司擔保'],
  '薪資報酬委員會（Remuneration committee）':['薪酬委員會'],
  '協同委外（Co-sourcing）':['協同委外稽核'],
  '風險熱圖（Risk heat map）':['熱圖'],
  '價金保管（Escrow）':['保留價款','價金保管或保留價款'],
  '加回調整（Add-back）':['加回','加回項目'],
  '國際財務報導準則（IFRS, International Financial Reporting Standards）':['IFRS準則'],
  '全球最低稅負制（Global minimum tax）':['第二支柱','Pillar Two'],
  '損益表（Income statement, P&L）':['P&L','綜合損益表','損益'],
  '銷貨成本（Cost of goods sold, COGS）':['COGS','營業成本'],
  '應收帳款（Receivables）':['AR','應收款項'],
  '應付帳款（Payables）':['AP','應付款項'],
  '營業收入（Revenue）':['營收','銷貨收入','銷售額'],
  '在製品（Work-in-progress, WIP）':['WIP'],
  '物料清單（Bill of materials, BOM）':['BOM'],
  '應收帳款週轉天數（Days sales outstanding, DSO）':['DSO','應收帳款收現天數','客戶付款天數'],
  '應付帳款週轉天數（Payable days, DPO）':['DPO','供應商付款天數'],
  '存貨週轉天數（Inventory days, DIO）':['DIO','存貨天數','存貨在庫天數'],
  '淨變現價值（Net realisable value, NRV）':['NRV'],
  '信用狀（Letter of credit, LC）':['LC','L/C','跟單信用狀'],
  '推銷及管理費用（Operating expenses, SG&A）':['SG&A','辦公室間接費用'],
  '營業費用（Operating expenses, opex）':['opex'],
  '營業利益（Operating profit, EBIT）':['EBIT','營業淨利'],
  '淨現值（Net present value, NPV）':['NPV'],
  '內部報酬率（Internal rate of return, IRR）':['IRR'],
  '已動用資本報酬率（Return on capital employed, ROCE）':['ROCE'],
  '權益報酬率（Return on equity, ROE）':['ROE','股東權益報酬率'],
  '資本支出（Capital expenditure, capex）':['capex','資本性支出'],
  '不動產、廠房及設備（Property, plant and equipment, PPE）':['PPE','固定資產'],
  '複式簿記（Double-entry bookkeeping）':['複式記帳'],
  '應收帳款帳齡分析（Receivables aging）':['帳齡分析','帳齡分析表','應收帳款帳齡'],
  '攸關成本（Relevant cost）':[],
  '財務承諾條款（Covenant）':['財務承諾','限制條款','借款財務承諾條款'],
  '國貿條規（Incoterms）':['Incoterm','Incoterms'],
  '折現率（Discount rate）':['折現'],
  '預測（Forecast, latest estimate）':['最新預估','LE'],
  '月度管理報告（Management pack）':['月報','每月管理報告','管理月報'],
  '作業基礎成本制（Activity-based costing, ABC）':['ABC'],
  '預收款項（Customer deposits, deferred revenue）':['遞延收入','客戶訂金','訂金','預收貨款'],
  '銷售與作業規劃（Sales and operations planning, S&OP）':['S&OP'],
  '矯正及預防措施（Corrective action, CAPA）':['CAPA'],
  '已收貨未收發票（Goods received not invoiced, GRNI）':['GRNI'],
  '透支（Overdraft, working capital line）':['營運週轉額度','透支額度'],
  '本年累計（Year to date, YTD）':['YTD','年初至今'],
  '稅前淨利（Profit before tax, PBT）':['PBT','稅前利益'],
  '關鍵績效指標（Key performance indicator）':['KPI'],
  'KPI（關鍵績效指標）':['關鍵績效指標','KPIs'],
  '準時足量交貨率（OTIF）':['準時足量交貨'],
  'SKU（存貨單位）':['存貨單位','SKUs'],
  '先進先出法（FIFO）':['先進先出'],
  '邊際貢獻（Contribution）':['單位邊際貢獻'],
  '國貿條規2020（Incoterms 2020）':[],
  '備抵呆帳（Allowance for doubtful debts）':['呆帳準備','備抵損失'],
  '自由現金流量（Free cash flow, FCF）':['FCF','自由現金流'],
  '現金轉換循環（Cash conversion cycle, CCC）':['CCC']
};

/* ---------- build one de-duplicated list with module references */
const norm=s=>String(s).toLowerCase().replace(/&amp;/g,'&').replace(/[’']/g,"'").replace(/\s+/g,' ').trim();
/* translated term names use full-width brackets: 中文（English, abbr）; strip both kinds to get the base term */
const stripB=s=>String(s).replace(/\s*（[^）]*）\s*/g,' ').replace(/\s*\([^)]*\)\s*/g,' ').trim();
const AKA_BASE={}; Object.keys(AKA).forEach(k=>{ const b=norm(stripB(k)); if(b&&!AKA_BASE[b]) AKA_BASE[b]=AKA[k]; });
let LIST=null, INDEX=null;
function build(){
  const byKey={};
  BW.ORDER.filter(id=>id!=='cap').forEach(id=>{  /* every module, in teaching order, so new modules are never left out */ const m=BW.mods[id]; if(!m) return;
    (m.glossary||[]).forEach(g=>{ const k=norm(g.term); if(!byKey[k]) byKey[k]={term:g.term,def:g.def,mods:[],aka:(AKA[g.term]||AKA_BASE[norm(stripB(g.term))]||[]).slice()}; if(!byKey[k].mods.includes(id)) byKey[k].mods.push(id); }); });
  LIST=Object.values(byKey).sort((a,b)=>a.term.replace(/^[^a-z0-9]+/i,'').localeCompare(b.term.replace(/^[^a-z0-9]+/i,''),'en',{sensitivity:'base'}));
  INDEX={};
  const add=(key,e)=>{ key=norm(key); if(key&&key.length>1&&!INDEX[key]) INDEX[key]=e; };
  LIST.forEach(e=>{ add(e.term,e); const base=stripB(e.term); add(base,e);
    (e.term.match(/（[^）]*）|\([^)]*\)/g)||[]).forEach(p=>p.slice(1,-1).split(/,|，| or /).forEach(x=>add(x,e)));
    e.aka.forEach(a=>add(a,e)); });
}
BW.gloss={
  list(){ if(!LIST) build(); return LIST; },
  find(text){ if(!INDEX) build(); const t=norm(text); return INDEX[t]||INDEX[t.replace(/s$/,'')]||INDEX[t.replace(/es$/,'')]||null; },
  norm
};
})();
