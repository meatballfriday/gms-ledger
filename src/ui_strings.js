/* Interface strings for The GM's Ledger (generated keys; translators fill in the values).
   BW.T(english, {vars}) looks up the English text in BW.UISTR[BW.lang]. A missing, null or empty value falls back to
   the English, so a half-filled catalog is safe. Keep {placeholders} exactly as written (you may move them), keep any
   HTML tags, and keep ✓ ← → ▶ symbols where they appear. 298 keys.
   Module titles and part names live in BW.OUTSTR below; module content comes from src/i18n/<lang>/ files instead. */
(function(){
'use strict';
BW.UISTR={
'zh-TW':{

/* ---- shell: page header ---- */
"Course home": "課程首頁",
"<span class=\"bn-the\">The </span>GM's Ledger": "<span class=\"bn-the\"></span>總經理的帳本",
"BraceWorks Medical edition": "BraceWorks Medical 版",
"Contents": "目錄",
"Switch colour mode": "切換色彩模式",
"Modules": "單元",
"Language": "語言",

/* ---- shell: top bar, progress ring and module strip ---- */
"<b>{done}</b> of {total}<span class=\"pr-l\"> done</span>": "<b>{done}</b>/{total}<span class=\"pr-l\"> 已完成</span>",
"{done} of {total} complete. Open contents": "已完成 {done}/{total}。開啟目錄",
"{done} of {total} complete ({n} modules and the capstone)": "已完成 {done}/{total}（{n}個單元和總結專題）",
"Home": "首頁",
"Part {n}": "第{n}部分",
"{title} (being built)": "{title}（製作中）",
"Toolkit": "工具箱",
"Practice packs": "練習包",
"Glossary": "詞彙表",
"Ref": "參考",

/* ---- shell: callouts, widgets, figures, pack links ---- */
"Key idea": "重點",
"Good to know": "補充說明",
"Red flag": "警訊",
"Back at work": "回到工作",
"Case file": "個案",
"This exercise could not load. Reload the page to try again.": "這個練習無法載入。請重新整理頁面再試一次。",
"This part could not load. Reload the page to try again.": "這個部分無法載入。請重新整理頁面再試一次。",
"This figure could not load.": "這張圖無法載入。",
"Practice pack {code}, {month}": "練習包{code}，{month}",
"Practice pack": "練習包",
"Open": "開啟",

/* ---- shell: quiz ---- */
"Question": "題目",
"Correct.": "答對了。",
"Not quite.": "不太對。",
"Try this question again": "再試一次這題",

/* ---- shell: flip cards ---- */
"Tap to reveal": "點一下顯示答案",

/* ---- shell: sorting exercise ---- */
"{right} of {done} right · {left} to go": "已答對 {right}/{done} · 還剩 {left} 個",
"{n} to sort": "共{n}個待分類",
"Right.": "正確。",
"Answer: {answer}.": "答案：{answer}。",
"Reset this exercise": "重設這個練習",

/* ---- shell: checklist ---- */
"{n} of {total} ticked": "已勾選 {n}/{total}",

/* ---- shell: module names ---- */
"Capstone": "總結專題",
"Module {n}": "第{n}單元",

/* ---- shell: back pill: page names ---- */
"Early warning signs": "早期警訊",
"Formula sheet": "公式表",
"Templates": "範本",
"Questions to ask": "該問的問題",
"Live tools": "互動工具",
"Pack {code} · {section}": "練習包{code} · {section}",
"Pack {code}": "練習包{code}",
"previous page": "上一頁",
"{where} · {section}": "{where} · {section}",

/* ---- shell: back pill ---- */
"Back to {where}": "回到{where}",
"Dismiss": "關閉",

/* ---- shell: module header and eyebrows ---- */
"Reference": "參考資料",
"Practice pack {code}, {month} (fictional)": "練習包{code}，{month}（虛構）",
"Final challenge": "最終挑戰",
"Module {n} · {part} (optional)": "第{n}單元 · {part}（選讀）",
"Module {n} of {total}, in Part {p}: {part}": "第{n}單元（共{total}單元），屬於第{p}部分：{part}",
"{n} pages": "{n}頁",
"Scenario: {scenario}": "情境：{scenario}",
"About {n} minutes": "約{n}分鐘",
"{n} sections": "{n}個小節",
"By the end you can": "學完之後，你能夠",
"{n} goals": "{n}個目標",

/* ---- shell: section tabs, section kinds, module-end card, pager ---- */
"{n} quiz questions": "{n}題測驗",
"Sections": "小節",
"Report page": "報告頁",
"Review": "複習",
"Try it": "動手做",
"Practice": "練習",
"Learn": "學習",
"Quiz": "測驗",
"{term}: show definition": "{term}：顯示定義",
"the capstone": "總結專題",
"You've finished {what}.": "你已完成{what}。",
"{right} of {n} quiz answers right. Use \"Try this question again\" on the ones you missed.": "測驗答對 {right}/{n} 題。答錯的題目可以按「再試一次這題」。",
"{right} of {n} quiz answers right.": "測驗答對 {right}/{n} 題。",
"Every section done.": "所有小節都已完成。",
"Start {what} (optional)": "開始{what}（選讀）",
"Start {what}": "開始{what}",
"That completes the course. An optional track follows for when BraceWorks grows beyond the Philippines: opening a company abroad, then running group finance, treasury, controls and funding across several countries.": "課程到此完成。接下來是一條選讀路線，適用於BraceWorks走出菲律賓之後：先在海外設立公司，再到跨國管理集團財務、資金、控制與籌資。",
"Almost there.": "就快完成了。",
"Keep going.": "繼續加油。",
"Not started yet.": "尚未開始。",
"To complete {what}, open this section and answer its questions:": "要完成{what}，請開啟這個小節並回答其中的問題：",
"To complete {what}, open these sections and answer their questions:": "要完成{what}，請開啟這些小節並回答其中的問題：",
"All practice packs": "所有練習包",
"Optional: {name}": "選讀：{name}",
"Next: {name}": "下一個：{name}",
"Back to course home": "回到課程首頁",

/* ---- shell: practice packs page ---- */
"Four fictional monthly reports": "四份虛構的月報",
"Realistic monthly management reports for BraceWorks, each from a different month with a different story, and each of a different quality. Every module's Practice tab sends you to one of them. Nothing here is real, and you never need to share your own reports.": "BraceWorks貼近真實的月度管理報告，每份來自不同月份、講述不同的故事，品質也各不相同。每個單元的「練習」分頁都會帶你到其中一份。這裡的內容全部是虛構的，你也完全不需要分享自己的報告。",
"{month}. {n} pages, used in {usedIn}.": "{month}。共{n}頁，用於{usedIn}。",
"How to use them": "使用方式",
"Read a pack the way you'd read your own: dashboard first, then commentary, then the statements.": "像讀自己的報告一樣讀練習包：先看儀表板，再看管理評述，最後看財務報表。",
"Each pack ends with a Review tab of questions. The modules' Practice tabs ask more.": "每個練習包最後都有一個「複習」分頁的問題。各單元的「練習」分頁還有更多題目。",
"Grade each pack with the scorecard in Module 9, then compare your grades with the expert ones.": "用第9單元的評分表為每個練習包打分數，再和專家的評分比較。",
"When you're ready, use the same questions on your own report. Your answers stay in your browser.": "準備好之後，用同樣的問題檢視你自己的報告。你的答案只會留在你的瀏覽器中。",
"Open the scorecard": "開啟評分表",

/* ---- shell: module being built ---- */
"Being built": "製作中",
"This module is still on the production line. Modules are added in order, so the ones before it are ready to take now.": "這個單元還在生產線上。單元會依序推出，所以它之前的單元現在都可以學了。",
"Continue with {name}": "繼續學習{name}",

/* ---- shell: home page and course map ---- */
"Stop nodding along in finance meetings.": "別再在財務會議上只會點頭。",
"The goal of this course is to make you finance savvy. You'll learn accounting the way a GM needs it: enough bookkeeping to know where numbers come from, enough analysis to challenge them, and enough finance to make better calls on pricing, costs, cash and investment. Every lesson runs on one company, BraceWorks Medical.": "這門課的目標是讓你懂財務。你會用總經理需要的方式學會計：懂得夠多的記帳，知道數字從哪裡來；懂得夠多的分析，能夠質疑數字；懂得夠多的財務，在訂價、成本、現金和投資上做出更好的決定。每一課都圍繞同一家公司：BraceWorks Medical。",
"BraceWorks Medical last year: revenue 1,200,000 dollars, net profit 55,500, but cash fell from 49,000 to 42,000.": "BraceWorks Medical去年：營業收入1,200,000美元，本期淨利55,500美元，但現金從49,000美元減少到42,000美元。",
"last year, US$": "去年，美元",
"Revenue": "營業收入",
"Gross profit": "營業毛利",
"Net profit": "本期淨利",
"Cash on 1 January": "1月1日現金",
"Cash on 31 December": "12月31日現金",
"A profit of $55,500 and still less cash. Where did it go? Module 1 starts here.": "賺了$55,500，現金卻變少了。錢去哪裡了？第1單元從這裡開始。",
"Finance savvy, in practice: by the end you can": "懂財務，落實在工作上：學完之後，你能夠",
"Read all three statements together and explain why profit and cash differ (Part 1)": "把三大財務報表放在一起讀，並解釋為什麼利潤和現金不同（第1部分）",
"Know what each product really costs, and spot where margin leaks (Part 2)": "知道每項產品真正的成本，並找出利潤從哪裡流失（第2部分）",
"Tell a good monthly report from a weak one, and ask the right questions (Part 3)": "分辨月報的好壞，並問出對的問題（第3部分）",
"Use the numbers to decide on prices, products, investments and budgets (Part 4)": "用數字決定價格、產品、投資和預算（第4部分）",
"Manage cash, currency and payment risk, and talk confidently to banks, auditors and owners (Part 5)": "管理現金、匯率和收款風險，並有自信地和銀行、會計師及股東溝通（第5部分）",
"Open any real annual report and find what matters in 20 minutes (Part 6)": "打開任何一份真實年報，20分鐘內找出重點（第6部分）",
"Pick up where you left off": "從上次停下的地方繼續",
"{where}: {title}": "{where}：{title}",
"Section {i} of {n}: {section}. {done} of {total} complete.": "第{i}小節（共{n}小節）：{section}。已完成 {done}/{total}。",
"Continue": "繼續",
"See all modules": "查看所有單元",
"Start Module 1": "開始第1單元",
"Not sure where to start? Take the 3-minute check": "不確定從哪裡開始？做個3分鐘小測驗",
"How each module works": "每個單元怎麼進行",
"Short explanations in plain words, with BraceWorks' real figures.": "用白話做簡短說明，搭配BraceWorks的實際數字。",
"Sliders and simulations. Change a number and watch the business react.": "滑桿和模擬。改一個數字，看看公司有什麼反應。",
"A problem BraceWorks hits, how it shows in the numbers, and the fix.": "BraceWorks遇到的一個問題、它如何反映在數字上，以及解決方法。",
"Quick questions with explanations, so mistakes teach you something.": "附解說的快問快答，讓答錯也能學到東西。",
"Questions on a realistic sample monthly report, plus an optional checklist for your own.": "針對一份貼近真實的範例月報提問，另附一份可用於你自己報告的檢核表（選用）。",
"Meet BraceWorks Medical": "認識BraceWorks Medical",
"A fictional 50-person factory that exports pressure-relief mattresses, patient slings and orthopaedic braces to distributors in the US, Europe and Australia. Its numbers are realistic for a small exporter like yours. You've just been made its general manager.": "一家虛構的50人工廠，把減壓床墊、病患移位吊帶和骨科護具出口給美國、歐洲和澳洲的經銷商。它的數字對像你這樣的小型出口商來說很貼近真實。你剛被任命為這家公司的總經理。",
"Do you need to learn bookkeeping?": "你需要學記帳嗎？",
"Learn how it works, not how to do it. Module 2 has you post a month of transactions by hand so you understand debits, credits and the journal. After that the course spends its time on reading, questioning and deciding, which is where a GM earns their pay.": "要學它怎麼運作，而不是學怎麼做。第2單元讓你親手過帳一個月的交易，搞懂借方、貸方和日記簿。之後，課程把時間花在解讀、提問和決策上，這才是總經理真正的價值所在。",
"Course map": "課程地圖",
"{n} modules and a capstone, about {h} hours in total; one module a week takes about six months. Then {extra} optional modules on growing into a multinational.": "{n}個單元和一個總結專題，總共約{h}小時；每週一個單元，大約六個月完成。之後還有{extra}個關於發展成跨國企業的選讀單元。",
"{built} of {total} modules ready. New modules appear here as they're finished.": "已完成 {built}/{total} 個單元。新單元完成後會出現在這裡。",
"Optional, and not part of the capstone or the final assessment. Take them when the topic comes up: before a bank request or a big plan, or before setting up abroad.": "選讀，不屬於總結專題或結業評量的範圍。等相關議題出現時再學：例如向銀行申貸或擬定重大計畫之前，或到海外設點之前。",
"Done": "已完成",
"{n} min": "{n}分鐘",
"Four fictional BraceWorks monthly reports, each from a different month and each telling a different story: a weak old-style report, a model pack, a record month heading for a cash crisis, and a polished pack hiding problems. Every module sends you to one of them for practice.": "四份虛構的BraceWorks月報，各來自不同月份，各講述不同的故事：一份薄弱的舊式報告、一份模範報告、一個業績創新高卻正走向現金危機的月份，以及一份包裝精美卻藏著問題的報告。每個單元都會帶你到其中一份做練習。",
"Open the practice packs": "開啟練習包",
"The Toolkit collects every early warning sign and formula from the course, eight Excel templates you can download and fill in, a bank of questions to ask your finance team, and a Glossary of every term in plain English. Keep it open beside your monthly pack.": "工具箱收錄課程中所有的早期警訊和公式、八個可以下載填寫的Excel範本、一套可以問財務團隊的問題，以及用白話解釋所有術語的詞彙表。閱讀月報時，把它開在旁邊。",
"Open the Toolkit": "開啟工具箱",
"BraceWorks Medical and everyone in it are fictional. Your progress is saved in this browser only.": "BraceWorks Medical及其中所有人物均為虛構。你的學習進度只儲存在這個瀏覽器中。",

/* ---- shell: Toolkit and glossary ---- */
"Warning sign": "警訊",
"What it may mean": "可能代表什麼",
"Where to look": "去哪裡查",
"No warning signs yet.": "目前還沒有警訊。",
"M{n}": "第{n}單元",
"No formulas yet.": "目前還沒有公式。",
"Everything worth keeping beside your monthly pack: early warning signs, the formula sheet, a plain-English glossary, Excel templates to download, and the questions to ask your finance team.": "閱讀月報時值得放在手邊的一切：早期警訊、公式表、白話詞彙表、可下載的Excel範本，以及該問財務團隊的問題。",
"Each sign below is something that shows up in the numbers before it shows up as a crisis. When you see one, ask the question in the last column.": "下面每一個警訊，都會在演變成危機之前先出現在數字裡。看到其中一個時，就問最後一欄的問題。",
"Every technical term in the course, in plain English. Search for a word or pick a letter. \"Learn more\" takes you to the module that explains it; the <strong>Back</strong> button brings you here again. In the lessons, tap any dotted-underlined term, like <span class=\"term\">EBITDA</span>, to see its definition on the spot.": "課程中的每個專業術語，都用白話解釋。可以搜尋字詞或選擇字母。「延伸學習」會帶你到講解它的單元；按<strong>返回</strong>按鈕就會回到這裡。在課程中，點一下任何有虛線底線的術語，例如<span class=\"term\">EBITDA</span>，就能當場看到定義。",
"Look up a term": "查詢術語",
"Search terms and definitions, for example \"margin\", \"accrual\" or \"COGS\"": "搜尋術語和定義，例如「毛利率」、「應計」或「COGS」",
"Filter by letter": "依字母篩選",
"All": "全部",
"{n} match": "{n}筆符合",
"{n} matches": "{n}筆符合",
"{n} terms under {letter}": "{letter}開頭的術語共{n}個",
"{n} terms": "共{n}個術語",
"Also called: {names}": "又稱：{names}",
", ": "、",
"Learn more:": "延伸學習：",
"{where}: {name}": "{where}：{name}",
"No match. Try a shorter word, or a short form such as \"AR\" or \"WIP\".": "沒有符合的結果。試試較短的字詞，或縮寫如「AR」或「WIP」。",

/* ---- shell: colour mode button ---- */
"Light": "淺色",
"Dark": "深色",
"Auto": "自動",
"Colour mode: {mode}. Tap to change.": "色彩模式：{mode}。點一下切換。",
"light": "淺色",
"dark": "深色",
"auto": "自動",

/* ---- shell: contents panel ---- */
"Close contents": "關閉目錄",
"<b>{done} of {total}</b> complete: {n} modules and the capstone": "已完成<b>{done}/{total}</b>：{n}個單元和總結專題",
"Continue: {where}, {section}": "繼續：{where}，{section}",
"Part {n}: {name}": "第{n}部分：{name}",
"Toolkit: warning signs, formulas, templates, questions": "工具箱：警訊、公式、範本、提問",
"Display": "顯示",
"Text size": "文字大小",
"Standard": "標準",
"Larger": "較大",
"Colours": "色彩",
"Match device": "跟隨裝置",

/* ---- shell: glossary popup ---- */
"Open in the glossary": "在詞彙表中開啟",

/* ---- viz: mounting with resize, so text stays a real size on every screen ---- */
"This figure could not be drawn.": "這張圖無法繪製。",

/* ---- viz: STEPPER: plays a diagram one step at a time ---- */
"Play ▶": "播放 ▶",
"← Back": "← 上一步",
"Next →": "下一步 →",
"Show all": "顯示全部",
"Press Play to go through it step by step.": "按「播放」逐步瀏覽。",
"Step {n}.": "第{n}步。",
"{n} steps": "共{n}步",
"{i} of {n}": "{i}/{n}",
"Show step {n}": "顯示第{n}步",
"Replay ▶": "重播 ▶",
"Pause ❚❚": "暫停 ❚❚",

/* ---- viz: LINE chart with hover, direct labels, reference lines and a data table ---- */
"Show the numbers": "顯示數字",

/* ---- report viewer: pageHTML ---- */
"Page {i} of {n}": "第{i}頁，共{n}頁",
"Original documents": "原始文件",
"A practice copy for this course: figures exactly as published, layout simplified, not updated after publication.": "本課程的練習用副本：數字與公開發布的完全相同，版面經過簡化，發布後未再更新。",

/* ---- report viewer: show ---- */
"Practice copy of a real report": "真實報告的練習用副本",
"Close the report": "關閉報告",
"Pages": "頁面",

/* ---- tutor (ask.js): where answers come from ---- */
"Fast": "快速",
"Answers almost at once. Good for definitions and quick checks.": "幾乎立即回答。適合查定義和快速確認。",
"Balanced": "平衡",
"Thinks briefly first. Good for most questions.": "先簡短思考。適合大多數問題。",
"Thorough": "深入",
"Thinks longest. Best for tricky calculations and judgement calls; can take a minute.": "思考最久。最適合棘手的計算和需要判斷的問題；可能需要一分鐘。",
"Low: quickest": "低：最快",
"Medium": "中",
"High: most careful": "高：最仔細",
"Explain simply": "簡單解釋",
"Explain this section to me more simply, as if I were new to it.": "請用更簡單的方式向我解釋這個小節，就當我是初學者。",
"BraceWorks example": "BraceWorks範例",
"Give me a worked example of this with BraceWorks numbers.": "請用BraceWorks的數字，給我一個完整的計算範例。",
"What do I do with it?": "我要怎麼用？",
"How would I use this in practice as a GM? What should I look for or ask my finance team?": "身為總經理，我在實務上要怎麼運用這個？我該注意什麼，或該問財務團隊什麼？",
"Quiz me": "考考我",
"Ask me one question at a time to check I understand this section. Wait for my answer before giving the next one.": "一次問我一個問題，確認我理解這個小節。等我回答後再問下一題。",

/* ---- tutor (ask.js): panel ---- */
"Ask": "提問",
"Ask a question about this page": "針對這一頁提問",
"Ask the tutor": "請教導師",
"New chat": "新對話",
"Start a new chat": "開始新對話",
"Close": "關閉",
"Remove the selected passage": "移除選取的段落",
"Your question": "你的問題",
"Ask about this page…": "針對這一頁提問…",
"Send": "送出",
"Stop": "停止",
"About: {page}": "關於：{page}",
"Explain this passage.": "請解釋這段內容。",

/* ---- tutor (ask.js): answer options ---- */
"Answer depth": "回答深度",
"Answers come from Claude on your own account and can be wrong. Check figures against the module.": "回答來自你帳戶上的Claude，可能有錯。請對照單元內容核對數字。",
"Model": "模型",
"Effort": "思考程度",
"API key": "API金鑰",
"Answers come from Claude through your API key, billed to your Anthropic account, and can be wrong. Check figures against the module.": "回答透過你的API金鑰來自Claude，費用計入你的Anthropic帳戶，且可能有錯。請對照單元內容核對數字。",
"No AI connected. Your question will be copied, with this page as context, to paste into any AI chat.": "尚未連接AI。你的問題會連同這一頁的內容一起複製，可貼到任何AI聊天工具中。",
"Connect a Claude API key": "連接Claude API金鑰",
"Tip: paste into Claude, Gemini or ChatGPT. Answers can be wrong; check figures against the module.": "提示：可貼到Claude、Gemini或ChatGPT。回答可能有錯；請對照單元內容核對數字。",

/* ---- tutor (ask.js): API key set-up ---- */
"Connect your Claude API key": "連接你的Claude API金鑰",
"With a key, answers appear here and you choose the exact model and effort. Create a key in the {link}; usage is billed to that account. The key is sent only to Anthropic.": "有了金鑰，回答會直接顯示在這裡，你也可以指定模型和思考程度。請在{link}建立金鑰；使用費用會計入該帳戶。金鑰只會傳送給Anthropic。",
"Claude Console": "Claude Console",
"Remember it on this device (don't tick on a shared computer)": "在這台裝置上記住（共用電腦請勿勾選）",
"Save": "儲存",
"Forget key": "清除金鑰",
"Cancel": "取消",

/* ---- tutor (ask.js): welcome text and suggestion chips ---- */
"Ask anything about this page: a term you don't follow, why a number moved, or how it applies to your own business.": "關於這一頁的任何問題都可以問：看不懂的術語、某個數字為什麼變動，或它如何應用在你自己的公司。",
"No AI is connected in this copy of the course. Type your question and it will be copied together with this page, ready to paste into any AI chat. Or connect a Claude API key to get answers here.": "這份課程尚未連接AI。輸入你的問題，它會連同這一頁的內容一起複製，可以直接貼到任何AI聊天工具中。或者連接Claude API金鑰，在這裡取得回答。",
"Tip: select a sentence on the page before opening this panel to ask about that passage.": "提示：開啟這個面板前，先選取頁面上的一句話，就能針對那段內容提問。",

/* ---- tutor (ask.js): messages ---- */
"Try again": "再試一次",
"<strong>Copied</strong>, with this page as context. Paste it into an AI chat:": "<strong>已複製</strong>，並附上這一頁的內容。請貼到AI聊天工具中：",
"Your browser blocked copying. Select all the text below, copy it, and paste it into an AI chat.": "你的瀏覽器封鎖了複製功能。請選取下方所有文字，複製後貼到AI聊天工具中。",
"Thinking…": "思考中…",
"The answer was cut short. Ask for the rest, or a shorter version.": "回答被截斷了。請要求繼續，或要求較短的版本。",
"Answered in {got} mode: {asked} isn't available on your Claude plan.": "以「{got}」模式回答：你的Claude方案不提供「{asked}」。",
"Stopped.": "已停止。",
"Asking Claude isn't available here, or wasn't allowed for this course. You can still use everything else on the page.": "這裡無法向Claude提問，或這門課程未獲准使用。頁面上的其他功能仍可正常使用。",
"That API key wasn't accepted. Check it and save it again.": "這個API金鑰未被接受。請檢查後重新儲存。",
"Your API key isn't allowed to do this. Check its permissions in the Claude Console.": "你的API金鑰沒有執行這項操作的權限。請到Claude Console檢查權限設定。",
"That model isn't available on your API account. Pick another model above, then try again.": "你的API帳戶無法使用這個模型。請在上方選擇其他模型後再試一次。",
"Claude is very busy right now. Try again in a minute, or pick a different model.": "Claude目前非常忙碌。請一分鐘後再試，或選擇其他模型。",
"Couldn't reach Claude. Check your internet connection.": "無法連線到Claude。請檢查你的網路連線。",
"Claude returned an error: {message}.": "Claude回傳錯誤：{message}。",
"unknown": "未知",
"Too many questions at once, or your usage limit has been reached. Please try again in a little while.": "同時提問太多，或已達使用上限。請稍後再試。",
"Your Claude sign-in has expired. Sign in again, then try again.": "你的Claude登入已過期。請重新登入後再試一次。",
"Claude couldn't answer that one. Try asking it a different way.": "Claude無法回答這個問題。請換個方式問問看。",
"This chat got too long. Start a new chat, or ask again.": "這段對話太長了。請開始新對話，或重新提問。",
"No answer came back. Try rephrasing the question.": "沒有收到回答。請試著換個說法提問。",
"The connection was interrupted.": "連線中斷了。",

/* ---- comments and notes (cmt.js): comment and note buttons ---- */
"Click a block…": "點選一個區塊…",
"Note": "筆記",
"Comment": "留言",
"Leave a comment on any part of this page for Claude to revise": "在這一頁的任何地方留言，讓Claude修改",
"Leave yourself a note on any part of this page": "在這一頁的任何地方替自己留下筆記",

/* ---- comments and notes (cmt.js): notes ---- */
"My notes <b>{n}</b>": "我的筆記 <b>{n}</b>",
"Your notes here": "你的筆記會在這裡",

/* ---- comments and notes (cmt.js): note editor ---- */
"Add a note": "新增筆記",
"What would you change, or what's unclear?": "你想改什麼，或哪裡不清楚？",
"Save note": "儲存筆記",

/* ---- comments and notes (cmt.js): notes list ---- */
"My notes": "我的筆記",
"On this block": "此區塊",
"Saved in this browser only": "只儲存在這個瀏覽器中",
"All notes": "所有筆記",
"No notes yet. Press <strong>Note</strong>, then click any paragraph, diagram or exercise.": "還沒有筆記。按<strong>筆記</strong>，再點選任何段落、圖表或練習。",
"Download notes": "下載筆記",
"Copy all": "全部複製",
"Send the downloaded file to whoever maintains the course, or paste it into a Claude chat, to have the content revised.": "把下載的檔案寄給課程維護者，或貼到Claude對話中，以便修訂內容。",
"Edit": "編輯",
"Delete": "刪除",
"Copied.": "已複製。",
"Copying is blocked here; use Download.": "這裡無法複製；請使用下載。"
}
};

/* Module names (short = top strip and pager, title = course map and contents, about = course map line) and part names.
   null = use the English shown in the comment. */
BW.OUTSTR={
'zh-TW':{
  m1:{ /* Module 1 */
    short: "三大報表",  /* Three statements */
    title: "三大財務報表",  /* The three statements */
    about: "用三張照片看BraceWorks的一年：利潤、財務狀況和現金。一筆銷售如何同時出現在三張報表中。" },  /* BraceWorks' year as three pictures: profit, position and cash. How one sale shows up in all three. */
  m2:{ /* Module 2 */
    short: "記帳",  /* Bookkeeping */
    title: "記帳基礎",  /* Bookkeeping basics */
    about: "會計恆等式、借方與貸方，以及日記簿。你會過帳一整個月的交易，並編製試算表。" },  /* The accounting equation, debits and credits, and the journal. You post a month of transactions and build a trial balance. */
  m3:{ /* Module 3 */
    short: "損益表",  /* Income statement */
    title: "損益表",  /* The income statement */
    about: "營業收入、銷貨成本、毛利率、間接費用和EBITDA。逐行解讀損益表，找出利潤在哪裡流失。" },  /* Revenue, cost of goods sold, gross margin, overheads and EBITDA. Reading a P&L line by line and spotting where profit leaks. */
  m4:{ /* Module 4 */
    short: "資產負債表",  /* Balance sheet */
    title: "資產負債表",  /* The balance sheet */
    about: "BraceWorks擁有和欠下的：應收帳款、存貨、設備、借款和權益，以及每一項透露給總經理的訊息。" },  /* What BraceWorks owns and owes: receivables, inventory, equipment, loans and equity, and what each tells a GM. */
  m5:{ /* Module 5 */
    short: "現金流量",  /* Cash flow */
    title: "現金流量",  /* Cash flow */
    about: "為什麼利潤不等於現金。現金流量表、從利潤到現金的調節，以及賺錢的公司如何把現金用光。" },  /* Why profit is not cash. The cash flow statement, the profit-to-cash bridge, and how a profitable firm runs dry. */
  m6:{ /* Module 6 */
    short: "產品成本",  /* Product costing */
    title: "產品成本計算",  /* Product costing */
    about: "一張床墊、一條吊帶和一個護具的真實成本。材料、人工和製造費用，以及製造費用如何分攤。" },  /* The true cost of one mattress, sling and brace. Materials, labour and overhead, and how overhead gets spread. */
  m7:{ /* Module 7 */
    short: "存貨",  /* Inventory */
    title: "存貨",  /* Inventory */
    about: "原料、在製品和製成品。存貨評價、呆滯存貨、存貨盤點與存貨短少。" },  /* Raw materials, work-in-progress and finished goods. Valuation, slow-moving stock, stock counts and shrinkage. */
  m8:{ /* Module 8 */
    short: "差異",  /* Variances */
    title: "標準成本與差異",  /* Standard costs and variances */
    about: "設定標準成本，並解釋實際成本為何偏離：價格、用量、人工效率和製造費用。" },  /* Setting cost standards and explaining why actual costs drift: price, usage, labour efficiency and overhead. */
  m9:{ /* Module 9 */
    short: "好的月報",  /* Good monthly pack */
    title: "一份好的月度管理報告",  /* A good monthly pack */
    about: "一份像樣的管理報告該包含什麼、薄弱報告的徵兆，以及一份為你的報告打分數的評分表。" },  /* What a decent management report contains, the signs of a weak one, and a scorecard to grade yours. */
  m10:{ /* Module 10 */
    short: "報表以外",  /* Beyond statements */
    title: "財務報表以外的報告",  /* Reports beyond the statements */
    about: "帳齡分析、依產品和客戶分析的利潤率、未出貨訂單、報廢與良率，以及13週現金流量預測。" },  /* Aging reports, margin by product and customer, order backlog, scrap and yield, and the 13-week cash forecast. */
  m11:{ /* Module 11 */
    short: "比率與KPI",  /* Ratios & KPIs */
    title: "財務比率與KPI",  /* Ratios and KPIs */
    about: "對小型製造商最重要的數字，以及打造你的一頁式儀表板。" },  /* The numbers that matter most for a small manufacturer, and building your one-page dashboard. */
  m12:{ /* Module 12 */
    short: "損益兩平與訂價",  /* Break-even & pricing */
    title: "損益兩平與訂價",  /* Break-even and pricing */
    about: "固定成本與變動成本、邊際貢獻率、損益兩平點，以及如何報出真正賺錢的出口報價。" },  /* Fixed and variable costs, contribution margin, break-even, and pricing an export quote that actually makes money. */
  m13:{ /* Module 13 */
    short: "重大決策",  /* Big decisions */
    title: "產品、客戶與採購決策",  /* Product, customer and sourcing decisions */
    about: "自製或外購、特殊訂單、哪些產品和客戶該擴大或放棄，以及如何因應瓶頸。" },  /* Make or buy, special orders, which products and customers to grow or drop, and working around a bottleneck. */
  m14:{ /* Module 14 */
    short: "投資",  /* Investing */
    title: "設備投資",  /* Investing in equipment */
    about: "用白話講解回收期間、NPV和IRR。判斷一台$60,000的機器值不值得買。" },  /* Payback, NPV and IRR in plain words. Deciding whether a $60,000 machine earns its keep. */
  m15:{ /* Module 15 */
    short: "預算",  /* Budgeting */
    title: "預算與預測",  /* Budgeting and forecasting */
    about: "從銷售到現金編製年度預算、預算與實際比較檢討，以及滾動預測。" },  /* Building an annual budget from sales to cash, budget-vs-actual reviews, and rolling forecasts. */
  m16:{ /* Module 16 */
    short: "營運資金",  /* Working capital */
    title: "營運資金",  /* Working capital */
    about: "現金轉換循環，以及從應收帳款、存貨和應付帳款中釋放現金的槓桿。" },  /* The cash conversion cycle, and the levers that free cash from receivables, inventory and payables. */
  m17:{ /* Module 17 */
    short: "出口融資",  /* Export finance */
    title: "出口融資",  /* Export finance */
    about: "匯率風險、國貿條規及其成本、信用狀、貿易融資、銀行貸款與財務承諾條款。" },  /* Currency risk, Incoterms and their cost, letters of credit, trade finance, bank loans and covenants. */
  m18:{ /* Module 18 */
    short: "控制",  /* Controls */
    title: "控制、查核與利害關係人",  /* Controls, audits and stakeholders */
    about: "舞弊與錯誤的警訊、適合50人公司的控制、與會計師合作，以及與銀行和股東溝通。" },  /* Fraud and error warning signs, controls for a 50-person firm, working with auditors, and talking to banks and owners. */
  m19:{ /* Module 19 */
    short: "稅務",  /* Tax */
    title: "出口商的稅務",  /* Tax for exporters */
    about: "稅務規則背後的邏輯、課稅所得與會計利潤、加值稅退稅與現金、跨境陷阱，以及菲律賓、台灣、中國、美國和英國的國別重點。" },  /* The logic behind tax rules, taxable vs accounting profit, VAT refunds and cash, cross-border traps, and country notes for the Philippines, Taiwan, China, the US and the UK. */
  m20:{ /* Module 20 */
    short: "籌資與價值",  /* Funding & value */
    title: "籌資與企業價值",  /* Funding and value */
    about: "資金來源、舉債能力、資金成本、可持續成長與股利，以及驅動企業價值的因素。" },  /* Funding sources, debt capacity, cost of capital, sustainable growth and dividends, and what drives the value of the business. */
  m24:{ /* Module 21 */
    short: "會計判斷",  /* Judgement calls */
    title: "數字背後的判斷",  /* The judgement calls behind the numbers */
    about: "收入認列時點、成本資本化、保固與回收負債準備、外幣重評價、租賃、遞延所得稅，以及你的帳務所依循的準則，包括2027年起的IFRS 18格式。" },  /* Revenue timing, capitalising costs, warranty and recall provisions, currency revaluation, leases, deferred tax and the rulebooks your accounts follow, including the IFRS 18 layout from 2027. */
  m21:{ /* Module 22 */
    short: "真實年報",  /* Real reports */
    title: "解讀真實年報",  /* Reading real annual reports */
    about: "在同業真實公司的公開報告中找出關鍵數字，並逐年解讀一家真實公司走向破產的過程。" },  /* Hunt for key figures in the published reports of real companies in your industry, and read a real road to bankruptcy year by year. */
  m22:{ /* Module 23 */
    short: "預測模型",  /* Forecast model */
    title: "建立三表預測模型",  /* Building a three-statement forecast */
    about: "在一個預測中串連損益、資產負債表和現金，檢查是否平衡，並在拍板前對計畫做壓力測試。" },  /* Link profit, balance sheet and cash in one forecast, check that it balances, and stress-test a plan before you commit. */
  cap:{ /* Capstone */
    short: "總結專題",  /* Capstone */
    title: "總結專題",  /* Capstone */
    about: "模擬經營BraceWorks一整年，再當一回偵探，找出一份年底管理報告中隱藏的問題。" },  /* Run BraceWorks for a simulated year, then play detective on a year-end pack with problems hidden in it. */
  m23:{ /* Module 24 */
    short: "海外設點",  /* Going abroad */
    title: "在海外設立銷售據點或工廠",  /* Opening a sales office or factory abroad */
    about: "常設機構、移轉訂價、設立公司、集團帳務、把現金匯回母國，以及設廠的商業評估。" },  /* Permanent establishment, transfer pricing, setting up a company, group accounts, moving cash home, and the factory business case. */
  m25:{ /* Module 25 */
    short: "集團財務",  /* Group finance */
    title: "跨國集團財務管理",  /* Running group finance across countries */
    about: "財務團隊、系統、月結、集團內部交易和集團報告，如何從一家公司擴展到五家。" },  /* How the finance team, systems, monthly close, intercompany and group reporting grow from one company to five. */
  m26:{ /* Module 26 */
    short: "集團資金",  /* Group treasury */
    title: "集團資金管理：跨國現金與匯率",  /* Group treasury: cash and currency across countries */
    about: "掌握所有現金、資金池與淨額結算、不是在賭博的避險政策，以及管理銀行與保證。" },  /* Seeing all the cash, pooling and netting, a hedging policy that isn't a bet, and managing banks and guarantees. */
  m27:{ /* Module 27 */
    short: "規模化控制",  /* Controls at scale */
    title: "規模化的控制與治理",  /* Controls and governance at scale */
    about: "COSO、核決權限表、三道模型、真正派上用場的風險登錄表、董事會、審計委員會與檢舉管道。" },  /* COSO, an authority matrix, the three lines, a risk register that gets used, the board, audit committee and whistleblowing. */
  m28:{ /* Module 28 */
    short: "投資人與退場",  /* Investors and exits */
    title: "為成長籌資：投資人、出售或上市",  /* Funding growth: investors, a sale or a listing */
    about: "私募股權、稀釋與控制權、從企業價值到現金、盈餘品質、交易條件與上市。" },  /* Private equity, dilution and control, from enterprise value to cash, quality of earnings, deal terms and listing. */
  /* part names, keyed by the English name */
  parts:{
    "Foundations": "基礎",
    "Factory costs": "工廠成本",
    "Reports": "報告",
    "Decisions": "決策",
    "Cash, risk and control": "現金、風險與控制",
    "Real-world practice": "實戰演練",
    "Finish": "結業",
    "Growing into a multinational": "發展成跨國企業",
  },
  /* part notes (shown on the course map), keyed by the English part name */
  notes:{
    "Growing into a multinational": "選讀，不屬於總結專題或結業評量的範圍。當BraceWorks第一次在海外銷售或生產時，從第24單元開始；第25至28單元則適用於公司朝向在多個國家擁有數百名員工發展的階段。這些單元教總經理如何建立和監督集團財務功能，而不是教你做財務長的工作。",  /* Optional, and not part of the capstone or the final assessment. Start with Module 24 when BraceWorks first sells or makes abroad; Modules 25 to 28 are for when it heads towards hundreds of people in several countries. They teach a GM how to build and oversee a group finance function, not how to do the CFO's job. */
  }
}
};

BW.T=function(s,v){
  const c=BW.UISTR[BW.lang]; let r=c&&c[s];
  if(r==null||r==='') r=s;
  if(v) r=String(r).replace(/\{(\w+)\}/g,(m,k)=>Object.prototype.hasOwnProperty.call(v,k)?String(v[k]):m);
  return r;
};
})();
