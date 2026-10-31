/* ===== Glossary: extra terms, short forms, and the lookup used across the course ===== */
(function(){
'use strict';
const ADD={
  m28:[
    {term:'Post-money valuation', def:'The value of a company straight after new investment: the pre-money value plus the new money. The investor\'s share is the new money divided by the post-money value.'},
    {term:'Due diligence', def:'A buyer\'s or investor\'s detailed check of a business before a deal: finances, tax, legal, contracts, quality and people. What it finds feeds into the price and the contract.'},
    {term:'Vendor due diligence', def:'Due diligence the seller commissions before a sale, so buyers get a ready-made report and fewer surprises late in the deal.'},
    {term:'Term sheet', def:'A short document setting out the main terms of an investment or sale, such as price, stake, board seats, vetoes and preferences, before the full legal contracts are drafted. Mostly not binding, but hard to renegotiate.'},
    {term:'Private equity', def:'Funds that buy minority or majority stakes in private companies, aiming to grow them and sell within about four to seven years. They usually take board seats and vetoes.'},
    {term:'Strategic investor', def:'A company in the same or a related industry that invests in or buys a business for strategic reasons, such as its products, markets or technology.'},
    {term:'Private credit', def:'Loans from investment funds rather than banks. Usually faster and more flexible, at a higher interest rate.'},
    {term:'Development finance institution', def:'A government-backed lender or investor, such as the IFC, that funds private companies in developing countries, often for longer terms than banks offer.'},
    {term:'Add-back', def:'An adjustment a seller makes to EBITDA to remove a cost it says won\'t recur, such as a one-off legal case. Buyers accept only the add-backs the evidence supports.'},
    {term:'Normalised EBITDA', def:'EBITDA after fair adjustments for one-off items and non-market costs. It\'s the figure a buyer values the business on.'},
    {term:'Completion accounts', def:'A way of setting the final price: accounts drawn up at the completion date, with the price adjusted for the actual cash, debt and working capital. The alternative is a locked box.'},
    {term:'Escrow', def:'Part of the sale price held back by a third party for an agreed period, to pay any claims the buyer makes under the warranties.'},
    {term:'Warranties and indemnities', def:'Promises in a sale contract about the state of the business (warranties), and specific promises to pay for known risks (indemnities). They let the buyer claim money back if something turns out to be wrong.'}
  ],
  m27:[
    {term:'Risk appetite', def:'How much risk, and of what kinds, the board is willing to accept to reach its goals. It guides limits such as maximum borrowing or how much currency to leave unhedged.'},
    {term:'Tone from the top', def:'The example leaders set on honesty, controls and ethics. Staff follow what leaders do more than what the policies say.'},
    {term:'Board of directors', def:'The group elected by shareholders to oversee management: approving strategy, budgets and big decisions, appointing and paying the CEO, and making sure controls work.'},
    {term:'Remuneration committee', def:'A board committee, usually of independent directors, that sets pay and incentives for the CEO and senior managers.'},
    {term:'Co-sourcing', def:'Using an outside firm to carry out part of internal audit, such as IT or overseas reviews, while the company keeps ownership of the audit plan.'},
    {term:'Foreign Corrupt Practices Act (FCPA)', def:'The US anti-bribery law. It can reach foreign companies with US listings, US operations or payments through the US, and has led to large settlements by medical device makers.'},
    {term:'Risk heat map', def:'A grid plotting each risk by likelihood and impact, so the biggest risks stand out.'}
  ],
  m26:[
    {term:'Notional pooling', def:'The bank works out interest on the combined balance of several group accounts without moving any money between them. Not offered in every country.'},
    {term:'Relationship bank', def:'One of the few banks a group concentrates its business with, so each knows the group well and will lend when it matters.'},
    {term:'Parent company guarantee', def:'A promise by the parent to pay a subsidiary\'s debt if the subsidiary can\'t. It puts the parent\'s own assets and loan covenants on the hook.'},
    {term:'Currency option', def:'A contract giving the right, but not the obligation, to exchange currency at a set rate. It protects against a bad move while keeping the upside, for an upfront fee called the premium.'},
    {term:'Accumulator', def:'A leveraged contract that gives a better rate while markets stay in a range, but forces the holder to buy or sell double, or more, when they move the wrong way. Sound hedging policies ban them.'},
    {term:'Over-hedging', def:'Hedging more currency than the business will actually receive or pay. The excess isn\'t protection; it\'s a bet on the exchange rate.'}
  ],
  m25:[
    {term:'Go-live', def:'The day a new system, such as an ERP, replaces the old one for real. A safe go-live needs clean data, a full rehearsal and a clear point at which to decide to stop or go.'}
  ],
  m23:[
    {term:'Intercompany loan', def:'Money one group company lends another. It needs a written agreement and an arm\'s-length interest rate, may attract withholding tax, and some countries require it to be registered.'},
    {term:'Royalty', def:'A fee for using someone else\'s brand, technology or know-how. Inside a group, a subsidiary may pay the parent royalties, which moves profit home but must be at arm\'s length.'}
  ],
  m21:[
    {term:'Goodwill', def:'The part of an acquisition price paid above the fair value of the assets and liabilities bought: brand, people and customer relationships. Under IFRS it isn\'t depreciated; it\'s tested for impairment at least once a year.'},
    {term:'Events after the reporting date', def:'Things that happen between the year-end and the date the accounts are signed. Some change the numbers, such as a customer going bust that was already struggling at year-end; others are only disclosed in a note.'}
  ],
  m24:[
    {term:'IFRS (International Financial Reporting Standards)', def:'The accounting rules used by listed companies in most countries outside the US, including the EU and Australia. The Philippines adopts them as PFRS. The US uses its own rules, US GAAP.'},
    {term:'PFRS (Philippine Financial Reporting Standards)', def:'The Philippine version of IFRS. Larger companies use full PFRS; smaller companies can use simpler versions, such as PFRS for SMEs, depending on their size.'},
    {term:'PFRS for SMEs', def:'A simpler version of PFRS for small and medium-sized companies that aren\'t listed: fewer disclosures and some simpler rules.'},
    {term:'Realised exchange gain or loss', def:'The currency gain or loss once a foreign invoice is actually paid or received at a different rate from the one it was booked at. Unlike an unrealised gain or loss, it has turned into cash.'}
  ],
  m19:[
    {term:'VAT (value added tax)', def:'A tax on sales collected at each step of the supply chain. A business charges it on sales (output VAT), reclaims what it paid on purchases (input VAT) and pays the difference. Exports are usually zero-rated.'}
  ],
  m1:[
    {term:'Profit and loss (P&L)', def:'Another name for the income statement. Shows revenue, costs and profit for a period.'},
    {term:'Year to date (YTD)', def:'From the start of the financial year up to the end of the current month. "YTD sales" means all sales so far this year.'},
    {term:'Dividend', def:'A payment of profit from the company to its owners. It reduces cash and retained earnings, but it isn\'t a cost on the P&L.'},
    {term:'Distributor', def:'A company that buys your products and resells them in its own market. Most of BraceWorks\' customers are distributors.'},
    {term:'ISO 13485', def:'The international quality management standard for medical device makers. Certification is audited every year and is usually required by customers and regulators.'},
    {term:'CE marking', def:'The mark showing a product meets European Union safety and performance rules. Needed to sell medical devices in Europe.'},
    {term:'FDA registration', def:'Registration with the US Food and Drug Administration, required to sell medical devices in the United States.'}
  ],
  m2:[
    {term:'Posting', def:'Recording a journal entry into the accounts in the general ledger.'},
    {term:'Account balance', def:'The running total of an account after all entries. For example, the balance of the Cash account is the money in the bank according to the books.'},
    {term:'Cash basis accounting', def:'Recording income and costs only when cash moves. Simple, but it makes monthly profit swing. Proper accounts use accrual accounting instead.'},
    {term:'Reconciliation', def:'Checking that two records of the same thing agree, and explaining any difference. For example, the bank statement against the books.'},
    {term:'Close checklist', def:'A written list of the steps to complete at each month-end, with who does each one and when.'},
    {term:'Accrued', def:'Recorded as a cost or income in the period it belongs to, even though the cash hasn\'t moved yet. An accrued expense is a cost incurred but not yet paid.'}
  ],
  m3:[
    {term:'Operating expenses (opex)', def:'The day-to-day costs of running the business outside the factory: sales, office, admin. Short form "opex". Compare with capex.'},
    {term:'Amortisation', def:'Like depreciation, but for things you can\'t touch, such as software licences or patents: spreading their cost over the years they\'re used.'},
    {term:'Profit before tax (PBT)', def:'Profit after all costs and interest, but before income tax.'},
    {term:'Gross sales and net sales', def:'Gross sales are invoiced sales before discounts, returns and credit notes. Net sales are what\'s left after them.'},
    {term:'Sales commission', def:'A payment to salespeople or agents, usually a percentage of sales or of gross profit.'},
    {term:'Freight', def:'The cost of transporting goods. "Freight out" is delivering to customers; "freight in" is bringing in materials.'}
  ],
  m4:[
    {term:'Share capital', def:'The money the owners put into the company in exchange for shares. Part of equity.'},
    {term:'Overdraft (working capital line)', def:'A bank facility that lets you borrow up to a set limit and repay whenever you have cash. Meant for short-term needs like stock and receivables.'},
    {term:'Liquidity', def:'How easily the business can pay its bills as they fall due. Cash and unused bank facilities are the most liquid resources.'},
    {term:'Solvency', def:'Whether the business owns more than it owes and can meet its debts in the long run.'},
    {term:'Bad debt', def:'Money a customer owes that will probably never be collected. It\'s written off as a cost.'},
    {term:'Write-off', def:'Removing an asset, or part of it, from the balance sheet because it has lost its value, and charging the loss to profit.'},
    {term:'Provision', def:'An amount set aside in the accounts for a likely loss or cost whose exact amount isn\'t known yet, such as doubtful debts or obsolete stock.'},
    {term:'Property, plant and equipment (PPE)', def:'Long-term physical assets: machines, tools, vehicles, buildings and fit-out. Also called fixed assets.'},
    {term:'Debt to equity', def:'Bank debt divided by equity. Shows how much the business relies on borrowed money compared with the owners\' money.'},
    {term:'Net debt to EBITDA', def:'Bank debt minus cash, divided by EBITDA. Roughly how many years of operating earnings it would take to repay the debt. A favourite bank test.'}
  ],
  m5:[
    {term:'Cash budget', def:'A plan of expected cash receipts and payments, month by month or week by week, to show when extra funding may be needed.'}
  ],
  m7:[
    {term:'Inventory days (DIO)', def:'How many days of sales your stock would last: inventory ÷ cost of goods sold × 365. Also called days inventory outstanding.'},
    {term:'Obsolete stock', def:'Stock that can no longer be sold or used at full value, because it\'s expired, out of date or no longer wanted.'}
  ],
  m8:[
    {term:'Rate variance', def:'The part of a labour variance caused by paying a different rate per hour than standard, often because of overtime premiums.'},
    {term:'Standard hours', def:'The time a product should take to make, according to the routing. Used to judge labour efficiency.'},
    {term:'Overtime premium', def:'The extra pay for hours worked beyond normal time, such as time-and-a-half.'},
    {term:'Scrap', def:'Material or products thrown away because they\'re damaged, defective or left over.'},
    {term:'Rework', def:'Fixing a defective product so it can pass inspection. It costs labour and time but saves the materials.'}
  ],
  m9:[
    {term:'Working day', def:'A normal business day, excluding weekends and public holidays. "Issued on working day 8" means eight business days after month-end.'}
  ],
  m10:[
    {term:'Credit control', def:'The routine of setting credit limits, sending reminders, chasing late payers and holding shipments when needed.'},
    {term:'Scrap rate', def:'Material scrapped as a percentage of material issued to production.'},
    {term:'Labour efficiency', def:'Standard hours earned for the output made, divided by the hours actually worked. Below 100% means work took longer than it should.'},
    {term:'Collection agency', def:'A firm that chases overdue debts on your behalf, usually for a percentage of what it collects.'}
  ],
  m12:[
    {term:'Cost-plus pricing', def:'Setting a price by adding a margin to cost. Useful as a floor, but it ignores what customers would pay.'},
    {term:'Price review', def:'A regular, usually yearly, check of selling prices against updated costs and the market, followed by any price changes.'},
    {term:'Landed cost', def:'The full cost of getting goods to a destination: product cost plus freight, insurance, duties and handling.'}
  ],
  m13:[
    {term:'Capacity', def:'The most a process or factory can produce in a period, such as units per week or hours per month.'},
    {term:'Product mix', def:'The combination of products sold. Changing the mix changes total profit even if total sales stay the same.'},
    {term:'Contribution per bottleneck hour', def:'Contribution per unit divided by the bottleneck hours each unit needs. The right way to rank products when capacity is the limit.'}
  ],
  m15:[
    {term:'Seasonality', def:'Regular ups and downs in sales or costs at the same time each year, such as hospital buying slowing in January.'},
    {term:'Hockey-stick budget', def:'A budget that is flat for most of the year and then jumps steeply at the end, usually based on hope rather than evidence.'},
    {term:'Top-down and bottom-up budgeting', def:'Top-down: leaders set the targets. Bottom-up: managers build their own numbers. Good budgets combine both.'}
  ],
  m16:[
    {term:'Days inventory, receivable and payable', def:'The three parts of the cash conversion cycle: days of stock held, days customers take to pay, and days you take to pay suppliers.'}
  ],
  m17:[
    {term:'Exchange rate', def:'The price of one currency in another, such as $1.10 for €1.'},
    {term:'Hedging', def:'Reducing the risk of a price moving against you, for example fixing an exchange rate in advance with a forward contract.'},
    {term:'Bill of lading', def:'The shipping company\'s receipt for goods loaded on a ship. It proves shipment and is usually needed to collect the goods at the destination.'},
    {term:'Customs duty', def:'A tax charged by a country on imported goods.'},
    {term:'Factoring', def:'Selling your unpaid invoices to a finance company, which pays most of their value straight away and then collects from your customers.'},
    {term:'Pre-shipment (packing) credit', def:'A bank loan to pay for materials and labour for a confirmed export order, repaid when the customer pays.'},
    {term:'Term loan', def:'A loan repaid in fixed instalments over several years. Best for long-term assets such as machines.'},
    {term:'Covenant breach and waiver', def:'A breach is failing a loan covenant. A waiver is the bank agreeing not to act on it, often for a fee or new conditions.'}
  ],
  m18:[
    {term:'Internal control', def:'Any routine that prevents or catches errors and fraud, such as approvals, reconciliations and segregation of duties.'},
    {term:'Audit', def:'An independent check of the annual financial statements by an external accountant (the auditor), ending in an audit opinion.'},
    {term:'Materiality', def:'How big an error must be to matter to someone reading the accounts. Auditors focus on material amounts.'},
    {term:'Ghost employee', def:'A fake or former employee still on the payroll, whose pay goes to someone else.'},
    {term:'Kickback', def:'A secret payment to an employee by a supplier in return for orders or better treatment.'},
    {term:'Duplicate payment', def:'Paying the same invoice twice, by mistake or on purpose.'}
  ]
};
Object.keys(ADD).forEach(id=>{ const m=BW.mods[id]; if(!m){ console.error('gloss: no module '+id); return; } m.glossary=(m.glossary||[]).concat(ADD[id]); });

/* short forms and other names readers will meet */
const AKA={
  'Contingent liability':['contingent liabilities'],
  'Provision':['provisions'],
  "Arm's length":["at arm's length"],
  'Accrual':['accrued'],
  'Related party':['related parties','related-party'],
  'Audit opinion':["auditor's report",'audit report'],
  'Consolidation':['group accounts','consolidated accounts','consolidated financial statements'],
  'Transfer pricing':['transfer pricing documentation'],
  'Delegation of authority':['authority matrix','approval matrix'],
  'Cash pooling':['physical cash pooling','physical pooling'],
  'Deferred tax':['deferred tax asset','deferred tax assets','deferred tax liability'],
  'Parent company guarantee':['guarantee','guarantees','parent guarantee'],
  'Remuneration committee':['people committee','remuneration or people committee'],
  'Co-sourcing':['co-source','co-sourced'],
  'Risk heat map':['heat map'],
  'Escrow':['holdback','escrow or holdback'],
  'Add-back':['add-backs'],
  'IFRS (International Financial Reporting Standards)':['IFRS standards'],
  'Global minimum tax':['Pillar Two'],
  'Income statement (P&L)':['P&L','profit and loss','income statement','profit and loss account'],
  'Cost of goods sold (COGS)':['COGS','cost of sales','cost of goods'],
  'Receivables':['AR','accounts receivable','debtors','trade receivables'],
  'Payables':['AP','accounts payable','creditors','trade payables'],
  'Revenue':['sales','turnover','net revenue'],
  'Work-in-progress (WIP)':['WIP','work in progress'],
  'Bill of materials (BOM)':['BOM'],
  'Days sales outstanding (DSO)':['DSO','receivable days','debtor days'],
  'Payable days (DPO)':['DPO','creditor days'],
  'Inventory days (DIO)':['DIO','stock days','days inventory outstanding'],
  'Net realisable value (NRV)':['NRV'],
  'Letter of credit (LC)':['LC','L/C','documentary credit'],
  'Operating expenses (SG&A)':['SG&A','overheads (office)'],
  'Operating expenses (opex)':['opex'],
  'Operating profit (EBIT)':['EBIT','operating income'],
  'Net present value (NPV)':['NPV'],
  'Internal rate of return (IRR)':['IRR'],
  'Return on capital employed (ROCE)':['ROCE'],
  'Return on equity (ROE)':['ROE'],
  'Capital expenditure (capex)':['capex','capital spending'],
  'Property, plant and equipment (PPE)':['PPE','fixed assets'],
  'Double-entry bookkeeping':['double entry'],
  'Receivables aging':['aging report','aged debtors','debtor aging'],
  'Relevant cost':['relevant costs'],
  'Covenant':['covenants','loan covenant'],
  'Incoterms':['Incoterm'],
  'Discount rate':['discounting'],
  'Forecast (latest estimate)':['forecast','latest estimate','LE'],
  'Management pack':['monthly management pack','monthly pack','monthly report'],
  'Activity-based costing (ABC)':['ABC','activity-based costing'],
  'Customer deposits (deferred revenue)':['deferred revenue','customer deposit','deposit'],
  'Sales and operations planning (S&OP)':['S&OP'],
  'Corrective action (CAPA)':['CAPA'],
  'Goods received not invoiced (GRNI)':['GRNI'],
  'Overdraft (working capital line)':['overdraft','working capital line','overdraft line'],
  'Year to date (YTD)':['YTD'],
  'Profit before tax (PBT)':['PBT'],
  'Key performance indicator':['KPI'],
  'KPI':['key performance indicator','KPIs'],
  'OTIF':['on time in full'],
  'SKU':['stock-keeping unit','SKUs'],
  'FIFO':['first in, first out'],
  'Contribution':['contribution margin per unit'],
  'Incoterms 2020':[],
  'Allowance for doubtful debts':['bad debt provision','doubtful debts'],
  'Free cash flow':['FCF'],
  'Cash conversion cycle':['CCC']
};

/* ---------- build one de-duplicated list with module references */
const norm=s=>String(s).toLowerCase().replace(/&amp;/g,'&').replace(/[’']/g,"'").replace(/\s+/g,' ').trim();
let LIST=null, INDEX=null;
function build(){
  const byKey={};
  BW.ORDER.filter(id=>id!=='cap').forEach(id=>{  /* every module, in teaching order, so new modules are never left out */ const m=BW.mods[id]; if(!m) return;
    (m.glossary||[]).forEach(g=>{ const k=norm(g.term); if(!byKey[k]) byKey[k]={term:g.term,def:g.def,mods:[],aka:(AKA[g.term]||[]).slice()}; if(!byKey[k].mods.includes(id)) byKey[k].mods.push(id); }); });
  LIST=Object.values(byKey).sort((a,b)=>a.term.replace(/^[^a-z0-9]+/i,'').localeCompare(b.term.replace(/^[^a-z0-9]+/i,''),'en',{sensitivity:'base'}));
  INDEX={};
  const add=(key,e)=>{ key=norm(key); if(key&&key.length>1&&!INDEX[key]) INDEX[key]=e; };
  LIST.forEach(e=>{ add(e.term,e); const base=e.term.replace(/\s*\([^)]*\)\s*/g,' ').trim(); add(base,e);
    (e.term.match(/\(([^)]*)\)/g)||[]).forEach(p=>p.slice(1,-1).split(/,| or /).forEach(x=>add(x,e)));
    e.aka.forEach(a=>add(a,e)); });
}
BW.gloss={
  list(){ if(!LIST) build(); return LIST; },
  find(text){ if(!INDEX) build(); const t=norm(text); return INDEX[t]||INDEX[t.replace(/s$/,'')]||INDEX[t.replace(/es$/,'')]||null; },
  norm
};
})();
