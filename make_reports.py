"""Build src/reports.js: practice copies of real published statements (figures as reported, layout simplified)."""
import json, copy
D = '/home/claude/course/data'
arjo = json.load(open(f'{D}/arjo.json'))
embla = json.load(open(f'{D}/embla.json'))
ivc = json.load(open(f'{D}/invacare.json'))

def st(d, sid):
    return copy.deepcopy([s for s in d['statements'] if s['id'] == sid][0])
def tb(d, tid):
    return copy.deepcopy([t for t in d['tables'] if t['id'] == tid][0])
def S(s, periods, title=None, note=None):
    return {'t': 'st', 'title': title or s['title'], 'periods': periods, 'rows': s['rows'], 'note': note}
def T(t, title=None, note=None, cols=None, rows=None):
    return {'t': 'tbl', 'title': title or t['title'], 'cols': cols or t['cols'], 'rows': rows if rows is not None else t['rows'], 'note': note}
def H(html):
    return {'t': 'html', 'html': html}

R = {}
# ------------------------------------------------------------------ ARJO
kf = tb(arjo, 'keyfig')
kf['rows'] = [r for r in kf['rows'] if '(Arjo in brief' not in r[0] and 'Arjo in brief' not in r[0]]
inbrief = [['Net sales, SEK M', '11,292'], ['Organic growth', '3.1%'], ['Sales by type of service', 'Capital goods 39% · Rental 25% · Service 20% · Disposables 16%'],
           ['Sales by customer', 'Acute care 68% · Long-term care 32%'], ['Sales by segment', 'Global Sales 57% · North America 39% · Other 4%'],
           ['Employees', 'about 7,000'], ['Products sold in', 'more than 100 countries'], ['Dividend per share (proposed)', 'SEK 0.95 (2023: 0.90)']]
R['arjo'] = {'id': 'arjo', 'company': 'Arjo AB', 'title': 'Year-end report 2024', 'short': 'Arjo 2024', 'unit': 'SEK M (millions of Swedish kronor)', 'neg': 'minus',
  'sources': [['Year-end report January–December 2024', 'https://www.arjo.com/siteassets/01-about-us/investors/2025/q4-2024/arjo_q4_2024_eng_final.pdf'],
              ['Annual and Sustainability Report 2024', 'https://www.arjo.com/siteassets/01-about-us/investors/2025/annual-report-2024/final-version/arjo_ahr24_eng_final.pdf']],
  'pages': [
    {'id': 'about', 'title': 'About this report', 'blocks': [
      H('<p><strong>Arjo</strong> is a Swedish medical technology company. It sells and rents patient-handling equipment (lifts and slings), medical beds, therapeutic mattresses for preventing pressure injuries, and related service, mostly to hospitals and long-term care homes. Its shares are listed in Stockholm.</p>'
        '<p>The pages that follow reproduce the full-year figures from Arjo\'s <strong>year-end report for 2024</strong>, with the "Arjo in brief" figures from its 2024 annual report. Every figure is as published, in millions of Swedish kronor. The layout is simplified and the narrative text is left out.</p>'),
      T(None, 'Arjo in brief (annual report 2024)', cols=['', ''], rows=inbrief)]},
    {'id': 'keyfig', 'title': 'Key figures', 'blocks': [T(kf, 'Key figures, full year', 'Most of these are Arjo\'s own measures (alternative performance measures). The report defines each one and reconciles it to the statements.')]},
    {'id': 'is', 'title': 'Income statement', 'blocks': [S(st(arjo, 'is'), ['2024', '2023'], 'Consolidated income statement, January–December')]},
    {'id': 'bs', 'title': 'Balance sheet', 'blocks': [S(st(arjo, 'bs'), ['31 Dec 2024', '31 Dec 2023'], 'Consolidated balance sheet (condensed, as published)')]},
    {'id': 'cf', 'title': 'Cash flow statement', 'blocks': [S(st(arjo, 'cf'), ['2024', '2023'], 'Consolidated cash-flow statement, January–December')]},
    {'id': 'debt', 'title': 'Net debt and exceptional items', 'blocks': [T(tb(arjo, 'netdebt'), 'Interest-bearing net debt, 31 December'), T(tb(arjo, 'exceptional'), 'Exceptional items')]},
    {'id': 'seg', 'title': 'Segments and sales', 'blocks': [T(tb(arjo, 'segments'), 'Segments, full year'), T(tb(arjo, 'category'), 'Net sales by category'),
      T(tb(arjo, 'organic'), 'Sales growth', 'Reported growth includes currency translation; organic growth excludes it.')]},
  ]}

# ------------------------------------------------------------------ EMBLA
fy = tb(embla, 'fiveyear')
fy['rows'] = [r for r in fy['rows'] if r[0] != 'USD MILLION']
gr = tb(embla, 'growth')
sp = tb(embla, 'special')
sp['rows'] = [r for r in sp['rows'] if 'DERIVED' not in r[0] and not r[0].startswith('Memo') and 'cash flow statement' not in r[0]]
nb = tb(embla, 'nibd')
nb_rows = [r[:3] for r in nb['rows'] if 'DERIVED' not in r[0]]
acq = tb(embla, 'acq')
acq_rows = [r[:2] for r in acq['rows'] if not r[0].startswith('Memo') and not r[0].startswith('Goodwill roll') and r[0] not in ('Business combinations', 'Exchange rate differences', 'At 31 December')]
gw_rows = [['At 1 January', 690855, 680400], ['Business combinations', 104489, 2241], ['Exchange rate differences', -19038, 8214], ['At 31 December', 776306, 690855]]
R['embla'] = {'id': 'embla', 'company': 'Embla Medical hf.', 'title': 'Report for 2024', 'short': 'Embla 2024', 'unit': 'USD thousands unless stated', 'neg': 'paren',
  'sources': [['Interim report Q4 2024 (full-year statements)', 'https://mb.cision.com/Main/18404/4100604/3246107.pdf'],
              ['Annual Report 2024', 'https://media.ossur.com/image/upload/documents/corporate/Quarterly%20Reports/2024/2024%20Annual%20Report.pdf']],
  'pages': [
    {'id': 'about', 'title': 'About this report', 'blocks': [
      H('<p><strong>Embla Medical</strong>, called Össur until 2024, is an Icelandic company listed in Copenhagen. Its largest business makes prosthetic legs and feet and neuro-orthotic devices. It also has a <strong>Bracing &amp; Supports</strong> business (orthopaedic braces) and runs patient-care clinics. It reports in US dollars.</p>'
        '<p>The pages that follow reproduce the full-year 2024 statements from Embla\'s <strong>fourth-quarter 2024 report</strong> (in USD thousands), with the five-year overview and growth analysis from its 2024 annual report (in USD millions). Every figure is as published. The layout is simplified and the narrative text is left out.</p>')]},
    {'id': 'five', 'title': 'Five-year overview', 'blocks': [T(fy, 'Five-year overview (USD million unless stated)', 'From the 2024 annual report. Free cash flow, organic growth and NIBD are Embla\'s own measures.')]},
    {'id': 'is', 'title': 'Income statement', 'blocks': [S(st(embla, 'is'), ['2024', '2023'], 'Consolidated income statement, full year (USD thousands)')]},
    {'id': 'bs', 'title': 'Balance sheet', 'blocks': [S(st(embla, 'bs'), ['31 Dec 2024', '31 Dec 2023'], 'Consolidated balance sheet (USD thousands)')]},
    {'id': 'cf', 'title': 'Cash flow statement', 'blocks': [S(st(embla, 'cf'), ['2024', '2023'], 'Consolidated statement of cash flows, full year (USD thousands)')]},
    {'id': 'seg', 'title': 'Segments and growth', 'blocks': [T(tb(embla, 'segments'), 'Segment information: net sales (USD thousands)'), T(gr, 'Sales growth analysis, 2024', 'Organic growth, plus the effect of acquisitions and currency, adds up to the growth in US dollars.')]},
    {'id': 'notes', 'title': 'Selected notes', 'blocks': [T(sp, 'EBITDA and EBITDA before special items (USD thousands)', 'Special items in 2024 were all in the first quarter.'),
      T(None, 'Net interest-bearing debt', cols=['', '31 Dec 2024', '31 Dec 2023'], rows=nb_rows),
      T(None, 'Acquisition of Fior & Gentz, 1 January 2024 (USD thousands)', cols=['', '2024'], rows=acq_rows),
      T(None, 'Goodwill (USD thousands)', cols=['', '2024', '2023'], rows=gw_rows)]},
  ]}

# ------------------------------------------------------------------ INVACARE
def ivc_rep(i):
    return ivc['reports'][i]
k21, k22, b19 = ivc_rep(0), ivc_rep(1), ivc_rep(2)
def relabel(s):
    for r in s['rows']:
        if r['label'] == 'Revenues': r['label'] = 'Net sales'
        if r['label'].startswith('Gain (Loss) on Extinguishment of Debt'): r['label'] = 'Loss (gain) on debt extinguishment, including debt finance charges and fees'
    return s
def isonly(s):
    s = relabel(s); rows = []
    for r in s['rows']:
        if r['label'].startswith('Other comprehensive income') or r['label'] == 'Other comprehensive income (loss):': break
        rows.append(r)
    s['rows'] = rows; return s
def ivc_debt(rep):
    t = [x for x in rep['tables'] if x['id'] == 'debt'][0]
    return T(t, 'Long-term debt (note to the accounts)', 'Carrying values in US$ thousands. Convertible notes can be swapped for shares by the holder; if not, they must be repaid in cash when due.')
# condensed 2022 operating cash flow
cf22 = relabel(copy.deepcopy([s for s in k22['statements'] if s['id'] == 'cf'][0]))
rows = cf22['rows']; out = []; i = 0
wc_start = next(k for k, r in enumerate(rows) if r['label'].startswith('Changes in operating assets'))
ocf_i = next(k for k, r in enumerate(rows) if r['label'].startswith('Net Cash Provided by (Used in) Operating'))
nl = rows[1]['v']; ocf = rows[ocf_i]['v']
wc = [r for r in rows[wc_start + 1:ocf_i]]
wcsum = [sum(r['v'][j] or 0 for r in wc) for j in range(2)]
noncash = [ocf[j] - nl[j] - wcsum[j] for j in range(2)]
out = rows[:2] + [{'label': 'Depreciation, impairments and other non-cash items (shown as one line here)*', 'v': noncash, 's': 'n'}] + rows[wc_start:]
cf22['rows'] = out

ab21 = ('<p><strong>Invacare</strong> made wheelchairs, homecare beds, therapeutic mattresses, patient lifts and slings, selling in North America and Europe. These pages reproduce the main statements from its <strong>Form 10-K annual report for 2021</strong>, filed with the US Securities and Exchange Commission on 8 March 2022. US companies show three years of income and cash flow, and two balance sheets.</p>'
        '<p>Figures are as filed, in thousands of US dollars. Costs are shown as positive numbers and deducted, as US reports do; figures in brackets are negative. Line labels come from the SEC\'s data version of the filing, so a few differ slightly from the printed wording.</p>')
gc = ('<p>Invacare filed for Chapter 11 bankruptcy protection on 31 January 2023, before this report was published. Note 1 to the accounts explains that the statements were still prepared on a going-concern basis: the assumption that the business will carry on. But it says the company\'s ability to continue depends on the court approving a reorganisation plan, the company emerging from Chapter 11, and then generating enough cash to meet its obligations. Until then, there is substantial doubt.</p>'
      '<p class="rv-src">Summary written for this course. Read the full wording in Note 1 and in the risk factors of the filing on SEC EDGAR.</p>')
ab22 = ('<p>These pages reproduce the main statements from Invacare\'s <strong>Form 10-K annual report for 2022</strong>, filed late, on 14 April 2023, more than two months after the company entered Chapter 11. Figures are as filed, in thousands of US dollars.</p>')
R['ivc21'] = {'id': 'ivc21', 'company': 'Invacare Corporation', 'title': 'Form 10-K for 2021', 'short': 'Invacare 2021 10-K', 'unit': 'US$ thousands', 'neg': 'paren',
  'sources': [['Form 10-K for 2021 on SEC EDGAR', 'https://www.sec.gov/Archives/edgar/data/742112/000074211222000012/0000742112-22-000012-index.html'],
              ['Form 10-K for 2019 on SEC EDGAR', 'https://www.sec.gov/Archives/edgar/data/742112/000074211220000015/']],
  'pages': [
    {'id': 'about', 'title': 'About this report', 'blocks': [H(ab21)]},
    {'id': 'is', 'title': 'Income statement', 'blocks': [S(isonly(copy.deepcopy([s for s in k21['statements'] if s['id'] == 'is'][0])), ['2021', '2020', '2019'], 'Consolidated statement of comprehensive income (loss): income statement part')]},
    {'id': 'bs', 'title': 'Balance sheet', 'blocks': [S(relabel(copy.deepcopy([s for s in k21['statements'] if s['id'] == 'bs'][0])), ['31 Dec 2021', '31 Dec 2020'], 'Consolidated balance sheets')]},
    {'id': 'cf', 'title': 'Cash flow statement', 'blocks': [S(relabel(copy.deepcopy([s for s in k21['statements'] if s['id'] == 'cf'][0])), ['2021', '2020', '2019'], 'Consolidated statement of cash flows')]},
    {'id': 'debt', 'title': 'Debt note', 'blocks': [ivc_debt(k21)]},
    {'id': 'bs19', 'title': 'Balance sheet, 2019', 'blocks': [H('<p>From the Form 10-K for 2019, to complete the four-year picture.</p>'), S(relabel(copy.deepcopy(b19['statements'][0])), ['31 Dec 2019', '31 Dec 2018'], 'Consolidated balance sheets')]},
  ]}
R['ivc22'] = {'id': 'ivc22', 'company': 'Invacare Corporation', 'title': 'Form 10-K for 2022', 'short': 'Invacare 2022 10-K', 'unit': 'US$ thousands', 'neg': 'paren',
  'sources': [['Form 10-K for 2022 on SEC EDGAR', 'https://www.sec.gov/Archives/edgar/data/742112/000074211223000036/0000742112-23-000036-index.html']],
  'pages': [
    {'id': 'about', 'title': 'About this report', 'blocks': [H(ab22)]},
    {'id': 'gc', 'title': 'Note 1: going concern', 'blocks': [H(gc)]},
    {'id': 'is', 'title': 'Income statement', 'blocks': [S(isonly(copy.deepcopy([s for s in k22['statements'] if s['id'] == 'is'][0])), ['2022', '2021'], 'Consolidated statement of comprehensive income (loss): income statement part')]},
    {'id': 'bs', 'title': 'Balance sheet', 'blocks': [S(relabel(copy.deepcopy([s for s in k22['statements'] if s['id'] == 'bs'][0])), ['31 Dec 2022', '31 Dec 2021'], 'Consolidated balance sheets')]},
    {'id': 'cf', 'title': 'Cash flow statement', 'blocks': [S(cf22, ['2022', '2021'], 'Consolidated statement of cash flows', '* The filing lists each non-cash item separately. They are combined into one line here, worked out as the reported operating cash flow minus the net loss and the working-capital lines. All other lines are as filed.')]},
    {'id': 'debt', 'title': 'Debt note', 'blocks': [ivc_debt(k22)]},
  ]}

js = '/* Practice copies of published statements. Figures as reported; layout simplified; not kept up to date. Generated by make_reports.py */\nBW.reports=' + json.dumps(R, ensure_ascii=False, separators=(',', ':')) + ';\n'
open('/home/claude/course/src/reports.js', 'w').write(js)
print('reports', {k: [p['id'] for p in v['pages']] for k, v in R.items()}, 'noncash22', noncash, 'size', len(js))
