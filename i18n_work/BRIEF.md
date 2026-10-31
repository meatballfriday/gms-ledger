# Translating The GM's Ledger into Traditional Chinese (Taiwan)

You translate course source files from English into Traditional Chinese as used in Taiwan (zh-TW).
The course: an interactive accounting and finance course for the general manager of BraceWorks Medical,
a ~50-person medical device maker and exporter in the Philippines. The reader is a smart, busy GM, not an accountant.

## Files
- English sources: /home/claude/course/src/<file>. Read them; NEVER modify anything in /home/claude/course/src/ except your own output files.
- Write each translation to /home/claude/course/src/i18n/zh-TW/<same filename>. It must be a complete copy of the English file with ONLY the human-readable text translated.
- Terminology: /home/claude/course/i18n_work/terms_zh-TW.tsv (English TAB Chinese TAB note). This list is binding. Use these exact Chinese terms every time. If a term you need isn't listed, choose the standard Taiwan (TIFRS / Taiwan business) wording and keep it consistent within your files.

## What to translate
- Every string the learner sees: titles, subtitles, goals, section labels and titles, paragraphs, list items, table headings and row labels, callout titles and bodies (K, TIP, FLAG, CASE, REPORT…), quiz questions, options and explanations, flip cards, sort items and their "why", check items, captions, step texts, widget labels, slider labels, button texts, hints and messages built inside widget code, aria-labels and titles, glossary terms and definitions, warnings (sign/meaning/look), formulas (name/f/ex text), story cards (text, lessons, "Pause and think").
- Translate text inside template literals and inside JS string concatenations, but keep every ${...} expression exactly as is.

## What must NOT change
- Code: identifiers, function calls, object keys, operators, numbers, formulas, ids (module ids, section `id:`, `k:` keys, data-* attributes), CSS classes, HTML tags and attributes (except visible attribute text like aria-label/title/placeholder/alt), URLs, regexes, `kind:` values, quiz answer indexes `a:` / correct option numbers, block order and count, number of options/items/steps.
- Source titles and URLs in `src:` lists of stories/reports (keep the English title of an English source; you may add nothing).
- Company and person names (BraceWorks Medical, Arjo, Luckin Coffee…), product codes (INV-5582), currency: keep $ and US-style number formatting ($1,200,000; (60,000)). Keep % as is.
- Module numbers and cross-references: "Module 12" → 「第12單元」; keep the number.

## Style
- Natural, clear Taiwan Mandarin written style; full-width punctuation （，。：；「」） in Chinese sentences; numbers, $ amounts and % stay half-width. Use 「」 for quotes. Use 週 not 周, 帳 not 賬, 臺/台 consistently as 台灣.
- Address the reader as 你. Keep the friendly, direct tone of the English. Don't add or remove content. Don't explain the translation.
- Technical terms: on first use in each section you MAY add the English in brackets, e.g. 邊際貢獻（contribution）, where it helps a GM who works in English. Don't overdo it.
- Units: m³, kg, hours (小時), days (天), working day (工作天).

## Glossary entries (important — the engine looks terms up by name)
- Each glossary `term:` becomes: Chinese term + full-width brackets with the English term, e.g. term:'邊際貢獻（Contribution）', term:'營運資金（Working capital）', term:'EBITDA（稅前息前折舊攤銷前利益）' (if the Chinese term already starts with the English abbreviation, keep the terms-list form as is).
- If the English term already has a bracketed abbreviation, e.g. 'Capital expenditure (capex)', write '資本支出（Capital expenditure, capex）'.
- In running text, `<span class="term">…</span>` must contain the Chinese term exactly as in the terms list (without the English bracket), so the definition pop-up finds it.
- In gloss.js the AKA table is keyed by glossary term names: translate each key to the exact translated term name of that entry (Chinese + （English）), and translate aliases into Chinese aliases the text actually uses (keep English abbreviations like NPV, IRR, KPI as aliases too).

## Engine notes
- Callout labels (Key idea, Red flag…), buttons like Next/Back/Play, quiz feedback and other interface chrome come from the engine and are translated separately: you don't need to touch them.
- Some widgets compare or match strings in code (e.g. a label used as a key, a `includes('...')` test, a `switch` on text). Only translate a string if it is purely displayed. If in doubt, read how it's used. Never translate object keys or values used as ids.
- Escaping: inside single-quoted JS strings, Chinese text rarely needs escaping, but keep any `\'` that remains, and never introduce an unescaped ' or ` that breaks the string. Prefer Chinese 「」 quotes over ' or ".

## Check your work (required)
1. `node --check /home/claude/course/src/i18n/zh-TW/<file>` — must pass (wrap check: the file is a script body).
2. `cd /home/claude/course && node i18n_work/compare.js <file> [<file>…]` — loads the course with your translation(s) swapped in. It must say "structure: same as English" and "no errors". It also lists sections with lots of English left: look at the lines for YOUR modules and fix anything you missed (ignore modules you weren't given, and ignore names it lists like company names). Interface chrome may legitimately still be English.
3. Re-read your file once against the English for meaning, numbers and terminology.
Do NOT run build.py (others are building in parallel).

## Report back (under 150 words)
Files done, check results, any English strings you deliberately left (and why), any terms you had to choose that aren't in the terms list.
