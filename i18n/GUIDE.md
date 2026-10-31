# Translation guide: The GM's Ledger, zh-TW and zh-CN

You are writing the Traditional Chinese (Taiwan) and Simplified Chinese (mainland China) editions of an interactive accounting and finance course for the general manager of a 50-person medical device exporter (BraceWorks Medical, fictional). Each source file is JavaScript that builds course content. You produce two new files with identical code and structure, where every learner-visible English string is rewritten in natural Chinese for that region.

## 1. This is localisation, not translation
- Write the way a good Taiwanese (zh-TW) or mainland (zh-CN) finance trainer would explain it to a factory GM: plain, warm, direct, short sentences. Rephrase freely; keep the meaning, the numbers, the examples and the teaching point.
- **Use each region's real accounting and business terms** (table in section 4). zh-CN is NOT zh-TW converted to simplified characters: vocabulary differs (營業利益 vs 营业利润, 帳 vs 账, 查核 vs 审计, 透支 vs 短期借款, 營業稅 vs 增值税, 保留盈餘 vs 未分配利润, 會計師 vs 注册会计师/会计师事务所).
- zh-TW reflects Taiwan practice: IFRS as endorsed by the FSC (金管會認可之IFRS／TIFRS), 會計師查核, 營利事業所得稅, 統一發票, 營業稅. zh-CN reflects mainland practice: 企业会计准则 (CAS), 注册会计师审计, 企业所得税, 增值税专用发票, 出口退税. When the English text says "IFRS" in general, zh-TW may write 「IFRS（國際財務報導準則）」, zh-CN 「国际财务报告准则（IFRS），中国企业会计准则与其基本趋同」 where helpful, but don't add long digressions.
- Keep the company, the figures, US dollars, the countries and the story the same. BraceWorks stays an exporter selling to the US, Europe and Australia. Do NOT relocate it to Taiwan or China.
- The tax module has country sections (Philippines, Taiwan, China, US, UK). Translate them all; for the Taiwan and China sections use each authority's official terms (TW: 營利事業所得稅、未分配盈餘加徵5%、最低稅負制（基本稅額）、營業稅、零稅率、扣繳; CN: 企业所得税、小型微利企业、高新技术企业、增值税、出口退税率、增值税专用发票、预提所得税).
- Names of people, brands and real companies stay in English (BraceWorks Medical, Invacare, Arjo, Embla Medical, Fior & Gentz). Product names: 減壓床墊（压力性损伤防护床垫）, 病患移位吊帶（患者移位吊带）, 護具/矯形護具（矫形护具）.
- Money: keep every number and $ amount as in the source ("$55,500" stays "$55,500"). In running prose you may write $1.2M as 「120萬美元」(TW) / 「120万美元」(CN) and $55.5k as 「5.55萬美元」/「5.55万美元」, or keep "$55,500". Never change a value. Percentages stay as they are.
- Dates: 「12月31日」, months 「1月」…「12月」; "Q1" can stay Q1 or 「第一季」(TW) / 「第一季度」(CN).
- Units: days 天, units 件/個 (TW) / 件/个 (CN).
- Punctuation: full-width ，。：；？！（）in Chinese text. Quotes: zh-TW 「」『』; zh-CN “”‘’. Never put an unescaped ASCII ' inside a single-quoted JS string or a ` inside a template literal.
- Acronyms: keep EBITDA, KPI, NPV, IRR, WACC, ROCE, DSO, OEE, OTIF, ERP, IFRS, VAT where the source uses them, with the Chinese term on first use in a section, e.g. 「EBITDA（稅前息前折舊攤銷前利益）」/「EBITDA（息税折旧摊销前利润）」.

## 2. Code rules (strict: the build checks these)
- Change ONLY learner-visible text: string literals and template-literal text that end up on screen (including SVG labels in figure code, aria-label, title, placeholder, caption, alt text, button text, messages built in code, glossary/warnings/formulas entries).
- Do NOT change: code, variable names, object keys, `id:` values, section ids, `kind`, `t:`, `tone`, CSS classes, data-attributes, colour keys (`c:'s1'`), row styles (`'sub'`, `'tot'`), numbers, formulas, `a:` answer indexes, the ORDER of options/items/cards/rows/blocks, file names, URLs, CHECK ids, the `at:` positions and the English anchor strings in `put(...)`/`swap(...)` calls in visuals.js (leave the whole `{at:…, after:'…'}` / `{at:…, n:'…'}` objects exactly as they are).
- Same number of sections, blocks, options, items, flip cards, rows, glossary entries, warnings, formulas and goals as the English file. Same quiz answer positions. Never merge or split blocks.
- If a string is used by code logic (compared with ===, used as a key, matched with a regex or `.includes`), either keep it identical in both places or leave it in English. Read the surrounding code.
- Number formatting helpers (money, pct, kfmt, toLocaleString('en-US')) stay as they are.
- For short labels inside charts (axis labels, node text in figures), keep them short: Chinese takes about half the width of English, which is fine; do not lengthen them.
- Glossary links: text inside `<span class="term">…</span>` should be the exact Chinese glossary term from the table below (or an exact term defined in some module's `glossary:` array), so the tap-to-define popover finds it.

## 3. Working method
1. Read the whole English source file first.
2. Write the translation to a temporary file, e.g. `/home/claude/course/src/i18n/zh-TW/m05.js.tmp`, then run `node --check` on it. Only when it passes, move it to the final name (`m05.js`). (Other translators are building at the same time; a half-written final file would break their checks.)
3. Verify: `node /home/claude/course/i18n/verify.js zh-TW <ids>` and the same for zh-CN. Module ids are `m1`…`m23`, `cap`, `packs` (or `packA`…`packD`). It must print `structure OK` and `no runtime errors`. "possible untranslated text" means English is still showing: fix it unless it's a proper name or URL.
4. Large files: it is fine to write the file in parts (write the first half to the .tmp file, then append with further Write/Edit calls) as long as the final file is complete and checked.
5. Do both languages. Write zh-TW natively, then write zh-CN natively using the CN column, not by converting characters.

## 4. Terminology (use these consistently)
| English | zh-TW (Taiwan) | zh-CN (mainland) |
|---|---|---|
| income statement / P&L | 綜合損益表（損益表） | 利润表 |
| balance sheet | 資產負債表 | 资产负债表 |
| cash flow statement | 現金流量表 | 现金流量表 |
| statement of changes in equity | 權益變動表 | 所有者权益变动表 |
| notes to the accounts | 財務報表附註 | 财务报表附注 |
| monthly pack / management report | 每月管理報表 | 月度管理报表 |
| revenue / net sales / sales | 營業收入（營收） | 营业收入 |
| cost of sales / COGS | 營業成本（銷貨成本） | 营业成本 |
| gross profit / gross margin | 營業毛利 / 毛利率 | 毛利 / 毛利率 |
| operating expenses | 營業費用 | 期间费用 |
| selling expenses / admin expenses | 推銷費用 / 管理費用 | 销售费用 / 管理费用 |
| R&D expenses | 研究發展費用 | 研发费用 |
| operating profit / EBIT | 營業利益 | 营业利润 |
| interest expense | 利息費用 | 利息费用（财务费用） |
| profit before tax | 稅前淨利 | 利润总额 |
| income tax | 所得稅費用 | 所得税费用 |
| net profit | 本期淨利（稅後淨利） | 净利润 |
| EBITDA | EBITDA（稅前息前折舊攤銷前利益） | EBITDA（息税折旧摊销前利润） |
| depreciation / amortisation | 折舊 / 攤銷 | 折旧 / 摊销 |
| accounts receivable | 應收帳款 | 应收账款 |
| accounts payable | 應付帳款 | 应付账款 |
| inventory / stock | 存貨 | 存货 |
| raw materials / WIP / finished goods | 原料 / 在製品 / 製成品 | 原材料 / 在产品 / 库存商品 |
| prepayments | 預付款項 | 预付款项 |
| accrued expenses | 應付費用 | 应计费用（其他应付款） |
| property, plant and equipment | 不動產、廠房及設備 | 固定资产 |
| goodwill | 商譽 | 商誉 |
| equity | 權益 | 所有者权益 |
| share capital | 股本 | 实收资本（股本） |
| retained earnings | 保留盈餘 | 未分配利润 |
| overdraft / overdraft limit | 銀行透支 / 透支額度 | 短期借款（流动资金贷款）/ 授信额度 |
| term loan / equipment loan | 中長期借款 / 設備貸款 | 中长期借款 / 设备贷款 |
| covenant | 財務承諾條款 | 财务约束条款（贷款契约） |
| net debt | 淨負債 | 净债务 |
| working capital | 營運資金 | 营运资金 |
| cash conversion cycle | 現金轉換循環 | 现金转换周期 |
| DSO / customer days | 應收帳款收現天數 | 应收账款周转天数 |
| stock days | 存貨週轉天數 | 存货周转天数 |
| supplier days | 應付帳款付款天數 | 应付账款周转天数 |
| free cash flow | 自由現金流量 | 自由现金流 |
| capex | 資本支出 | 资本性支出 |
| debit / credit | 借方 / 貸方（借／貸） | 借方 / 贷方（借／贷） |
| journal entry | 分錄 | 会计分录 |
| general ledger | 總分類帳 | 总账 |
| trial balance | 試算表 | 试算平衡表 |
| accruals basis | 權責發生制（應計基礎） | 权责发生制 |
| month-end close | 月結作業 | 月末结账 |
| bank reconciliation | 銀行存款調節表 | 银行余额调节表 |
| provision | 負債準備 | 预计负债 |
| bad debt allowance / expected credit loss | 備抵損失（預期信用損失） | 坏账准备（预期信用损失） |
| impairment | 減損 | 减值 |
| write-off | 沖銷 | 核销 |
| contribution margin | 邊際貢獻 | 边际贡献 |
| break-even | 損益兩平 | 盈亏平衡 |
| fixed / variable cost | 固定成本 / 變動成本 | 固定成本 / 变动成本 |
| factory overhead | 製造費用 | 制造费用 |
| standard cost / variance | 標準成本 / 差異 | 标准成本 / 差异 |
| absorption costing | 全部成本法 | 完全成本法 |
| activity-based costing | 作業基礎成本制（ABC） | 作业成本法（ABC） |
| scrap / rework | 報廢 / 重工 | 废品 / 返工 |
| OEE | 整體設備效率（OEE） | 设备综合效率（OEE） |
| OTIF | 準時足量交貨率（OTIF） | 准时足量交付率（OTIF） |
| book-to-bill / backlog | 訂單出貨比 / 未交訂單 | 订单出货比 / 在手订单 |
| budget / forecast / rolling forecast | 預算 / 預測 / 滾動預測 | 预算 / 预测 / 滚动预测 |
| NPV / IRR / payback | 淨現值 / 內部報酬率 / 回收期間 | 净现值 / 内部收益率 / 投资回收期 |
| WACC | 加權平均資金成本（WACC） | 加权平均资本成本（WACC） |
| ROCE | 已動用資本報酬率（ROCE） | 资本回报率（ROCE） |
| KPI | 關鍵績效指標（KPI） | 关键绩效指标（KPI） |
| letter of credit | 信用狀 | 信用证 |
| Incoterms (EXW, FOB, CIF, DAP, DDP) | 國貿條規（Incoterms） | 国际贸易术语（Incoterms） |
| forward contract / hedging | 遠期外匯合約 / 避險 | 远期结售汇合约 / 套期保值 |
| VAT | 加值型營業稅（營業稅、VAT） | 增值税 |
| input / output VAT | 進項稅額 / 銷項稅額 | 进项税额 / 销项税额 |
| zero-rated exports | 外銷適用零稅率 | 出口零税率（免抵退） |
| withholding tax | 扣繳稅款 | 预提所得税（代扣代缴） |
| transfer pricing | 移轉訂價 | 转让定价 |
| arm's length | 常規交易 | 独立交易原则 |
| permanent establishment | 常設機構 | 常设机构 |
| tax treaty | 租稅協定 | 税收协定 |
| deferred tax | 遞延所得稅 | 递延所得税 |
| effective tax rate | 有效稅率 | 实际税率 |
| auditor / audit report | 會計師 / 會計師查核報告 | 注册会计师 / 审计报告 |
| unmodified (clean) / qualified / adverse / disclaimer | 無保留意見 / 保留意見 / 否定意見 / 無法表示意見 | 无保留意见 / 保留意见 / 否定意见 / 无法表示意见 |
| key audit matters | 關鍵查核事項 | 关键审计事项 |
| going concern | 繼續經營 | 持续经营 |
| emphasis of matter | 強調事項 | 强调事项 |
| management letter | 管理建議書 | 管理建议书 |
| annual report / Form 10-K | 年報 / 10-K年度報告 | 年度报告 / 10-K年报 |
| segment information | 營運部門資訊 | 分部信息 |
| consolidated / group accounts | 合併財務報表 | 合并财务报表 |
| subsidiary / branch / representative office | 子公司 / 分公司 / 辦事處 | 子公司 / 分公司 / 代表处 |
| intercompany | 集團內部交易 | 内部交易 |
| unrealised profit | 未實現利益 | 未实现利润 |
| translation reserve | 國外營運機構財務報表換算之兌換差額 | 外币报表折算差额 |
| related party | 關係人 | 关联方 |
| segregation of duties | 職能分工 | 不相容职务分离 |
| three-way match | 三方核對 | 三单匹配 |
| dividend | 股利 | 股利（分红） |
| debt capacity | 舉債能力 | 举债能力 |
| alternative performance measure | 非IFRS績效衡量指標 | 非公认会计准则指标 |
| organic growth | 內生成長 | 内生增长 |
| adjusted EBITDA | 調整後EBITDA | 调整后EBITDA |
| exceptional / special items | 非經常性項目 | 非经常性损益项目 |
| Chapter 11 | 美國破產法第11章重整 | 美国破产法第11章重整 |
| three-statement forecast | 三表連動財務預測 | 三表联动财务预测 |
| balance check | 平衡檢查 | 平衡校验 |
| scenario / stress test | 情境分析 / 壓力測試 | 情景分析 / 压力测试 |
| 13th-month pay (Philippines) | 第13個月薪資（菲律賓法定） | 第13个月工资（菲律宾法定） |

Course furniture (use the same words everywhere): Learn 學習／学习 · Try it 動手試試／动手试试 · Case file 案例／案例 · Quiz 測驗／测验 · Practice 實作練習／实操练习 · Key idea 重點／要点 · Good to know 小提醒／小贴士 · Red flag 警訊／风险信号 · Back at work 回到工作上／回到工作中 · Practice pack 練習報表／练习报表 · Toolkit 工具箱／工具箱 · Glossary 名詞解釋／术语表 · Module 單元／模块 · Section 小節／小节.
