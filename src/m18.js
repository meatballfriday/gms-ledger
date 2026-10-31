/* ===== Module 18: Controls, audits and stakeholders ===== */
(function(){
const {K,TIP,FLAG,CASE,REPORT,Q,FS,FLIP,SORT,CHECK,W,PACK,money,signed,pct,kfmt} = BW.h;

BW.add({
  id:'m18', minutes:45,
  title:'Controls, audits and stakeholders',
  subtitle:'Protect the money, prove the numbers, and talk about them with confidence to banks, auditors and owners.',
  goals:[
    'Recognise the frauds and errors most common in small manufacturers',
    'Put in place the controls a 50-person company actually needs',
    'Work well with your auditors',
    'Give banks and owners clear, honest updates, including bad news'
  ],
  sections:[
  {id:'fraud', label:'How money leaks', kind:'learn', title:'Fraud and error in a small factory', blocks:[
    `<p>Most people are honest. But small companies lose a surprising amount to fraud, because one or two trusted people often handle everything, and nobody checks. Fraud tends to happen when three things come together, a pattern known as the <span class="term">fraud triangle</span>:</p>
     <ul>
      <li><strong>Pressure:</strong> personal debts, illness in the family, a bonus target that can't be hit honestly.</li>
      <li><strong>Opportunity:</strong> weak controls. The same person sets up suppliers and pays them.</li>
      <li><strong>Rationalisation:</strong> "I'm underpaid", "I'll pay it back", "everyone does it".</li>
     </ul>
     <p>You can't control pressure or rationalisation. You can control <strong>opportunity</strong>.</p>`,
    FLIP([
      {f:'Fake supplier', b:'Someone sets up a supplier that doesn\'t exist, or exists only as a bank account, and approves invoices from it. Often for "consulting" or "services", with no goods to check.'},
      {f:'Changed bank details', b:'An email, apparently from a real supplier, says their bank account has changed. The next payment goes to a fraudster. The most common fraud against exporters today.'},
      {f:'Ghost employees and padded overtime', b:'Pay for people who\'ve left, or overtime that wasn\'t worked. Hard to spot in a 50-person payroll without review.'},
      {f:'Purchasing kickbacks', b:'A buyer favours a supplier in return for personal payments. Shows up as prices above market, or one supplier always winning.'},
      {f:'Stock and scrap theft', b:'Materials or finished goods leave the site, or scrap with value is sold privately. Shows up as count differences (Module 7).'},
      {f:'Duplicate payments', b:'Not always fraud. The same invoice paid twice, sometimes with a slightly changed number. Suppliers rarely send the money back unprompted.'}
    ]),
    K('Errors cost money too',
      `<p>Not every leak is dishonest. Duplicate payments, invoices for goods never received, unbilled shipments and wrong prices on invoices are usually mistakes. The same controls catch both.</p>`)
  ]},
  {id:'controls', label:'Controls that work', kind:'learn', title:'The controls a 50-person company needs', blocks:[
    `<p>You don't need a big internal audit department. You need a handful of controls, applied every time. The most important idea is <span class="term">segregation of duties</span>: no single person should be able to start, approve and complete a transaction on their own.</p>`,
    {t:'tbl', head:['Process','Who should do what','Why'], rows:[
      ['<strong>Purchasing</strong>','Production requests; purchasing orders; stores receives; finance pays','No one can order, receive and pay for something on their own'],
      ['<strong>Three-way match</strong>','Pay only when the purchase order, goods-received note and invoice agree','Stops paying for goods not ordered or not delivered'],
      ['<strong>Supplier master file</strong>','New suppliers and bank detail changes need a second person\'s approval, and a call-back to a known phone number','Stops fake suppliers and bank-detail fraud'],
      ['<strong>Payments</strong>','Two people approve each payment run in the bank system; the GM approves above a limit','No single person can send money out'],
      ['<strong>Payroll</strong>','HR maintains staff records; finance runs payroll; the GM reviews headcount and overtime monthly','Stops ghost employees and padded overtime'],
      ['<strong>Bank reconciliation</strong>','Prepared by finance, reviewed and signed by the GM monthly','Catches unusual payments fast'],
      ['<strong>Stock</strong>','Cycle counts by someone other than the storekeeper; scrap recorded and disposed of under control','Catches theft and recording errors'],
      ['<strong>Approval limits</strong>','A written table of who can approve what, up to which amount','Everyone knows the rules; exceptions stand out']
    ]},
    TIP('When you can\'t separate duties',
      `<p>With a small finance team, one person may have to do several jobs. Then add <strong>review</strong> instead: the GM looks at the payment run, the supplier changes report and the bank reconciliation every month. Ten minutes of attention is a strong deterrent.</p>`)
  ]},
  {id:'run', label:'Approve the payments', kind:'play', title:'Approve this week\'s payment run', blocks:[
    `<p>Finance sends you this week's payment run for approval. For each payment, choose <strong>Approve</strong> or <strong>Query</strong>. Some are fine. Some aren't.</p>`,
    SORT('This week\'s payments',['Approve','Query'],[
      {text:'<strong>Foam supplier, $14,200.</strong> Invoice matches the purchase order and goods-received note. Regular supplier, same bank account as always.', a:0, why:'Three-way match, known supplier, no changes. This is what a clean payment looks like.'},
      {text:'<strong>Global Medical Textiles Ltd, $8,750.</strong> New supplier added last week by the purchasing officer. "Consulting services", no purchase order. Your approval limit is $9,000.', a:1, why:'New supplier, vague services, no PO, set up and requested by the same person, and just under the approval limit. Ask who they are and what they did before paying.'},
      {text:'<strong>Freight forwarder, $3,480.</strong> Bank details changed yesterday, after an email from their accounts team.', a:1, why:'Classic bank-detail fraud. Call the forwarder on a phone number you already have, not one from the email, before paying.'},
      {text:'<strong>Electricity, $3,620.</strong> Direct debit, in line with the last six months.', a:0, why:'Expected, consistent amount.'},
      {text:'<strong>Overtime: worker 2214, 96 hours this month.</strong> Same as each of the last three months. HR records show this worker was on sick leave for two weeks.', a:1, why:'Overtime during sick leave is impossible. Check the timesheets and who approved them.'},
      {text:'<strong>Webbing supplier, two invoices of $2,150:</strong> numbers 4471 and 4471A.', a:1, why:'Very likely a duplicate. Pay one, and ask the supplier about the other.'},
      {text:'<strong>Certification body, $6,800.</strong> Annual ISO 13485 surveillance audit fee, as per contract.', a:0, why:'Expected annual cost, matches the contract.'},
      {text:'<strong>Customer refund, $1,900,</strong> to a personal bank account, not the customer company\'s account.', a:1, why:'Refunds should go back to the account the customer paid from. Check with the customer directly.'}
    ]),
    K('What the payment run shows',
      `<p>Five of eight payments needed a question. None of them would have been caught by checking that the totals add up. They're caught by someone who knows the business looking at <em>who</em> is being paid, <em>why</em>, and <em>what changed</em>. That's why the GM's review matters.</p>`)
  ]},
  {id:'audit', label:'Working with auditors', kind:'learn', title:'Working with your auditors', blocks:[
    `<p>An external audit gives an independent <strong>opinion</strong> on whether the annual financial statements give a true and fair view. It's often required by law or by the bank.</p>
     <h3>What an audit is, and isn't</h3>
     <ul>
      <li>It <strong>is</strong> a check that the annual accounts are free from material misstatement, based on testing samples.</li>
      <li>It <strong>isn't</strong> a guarantee that there's no fraud, or that the business is well run. Auditors test samples; they don't check every transaction.</li>
      <li>It <strong>doesn't</strong> replace your own controls. Management is responsible for preventing and detecting fraud.</li>
     </ul>
     <h3>Getting value from it</h3>
     <ul>
      <li><strong>Prepare:</strong> auditors send a list of what they need, often called the PBC ("prepared by client") list: reconciliations, stock count results, fixed asset register, contracts. A well-prepared company has a shorter, cheaper audit.</li>
      <li><strong>Attend the stock count</strong> and let auditors observe it. Inventory is usually the biggest audit risk in a factory.</li>
      <li><strong>Read the management letter.</strong> After the audit, auditors list weaknesses they found in controls. It's free consulting. Make sure each point has an owner and a fix date.</li>
      <li><strong>Ask about audit adjustments.</strong> Every correction the auditors make is something your monthly reports got wrong. Big or repeated adjustments mean the monthly numbers can't be trusted.</li>
     </ul>`,
    Q('The auditors made $38,000 of adjustments to last year\'s accounts. What does that tell you?',[
      'Nothing; auditors always adjust','Your monthly reports were materially wrong during the year, and the close process needs fixing','The auditors made mistakes','Profit was understated'],1,
      'Audit adjustments are corrections. $38,000 is half of BraceWorks\' profit before tax. Ask what each one was, and why the monthly close didn\'t catch it.')
  ]},
  {id:'talk', label:'Banks and owners', kind:'learn', title:'Talking to banks and owners', blocks:[
    `<p>As GM, you'll increasingly be the face of the numbers: to the owner, perhaps a board, and to the bank. Both want the same things: <strong>no surprises, a clear story, and a plan.</strong></p>
     <h3>What your bank wants to know</h3>
     <ul>
      <li>Is the business generating cash, and can it repay its loans?</li>
      <li>Are the covenants met, with headroom?</li>
      <li>What's the forecast, and what could go wrong?</li>
      <li>Is management in control: timely, reliable numbers, and honest communication?</li>
     </ul>
     <h3>A one-page quarterly update</h3>
     <p>Send this to the bank and owner every quarter, even when not required. Banks lend more readily to companies that keep them informed.</p>`,
    {t:'tbl', head:['Section','BraceWorks example'], rows:[
      ['<strong>Headline</strong>','Q3 sales $312k, 4% ahead of last year. Gross margin 28.9%, up from 27.6%, after the price review.'],
      ['<strong>Cash and debt</strong>','Cash $38k, overdraft $95k of $150k. Net debt to EBITDA 1.3×, interest cover 9×. All covenants met.'],
      ['<strong>What went well</strong>','Receivable days down from 70 to 61; $30k of cash released. New Australian contract signed with 60-day terms and a deposit.'],
      ['<strong>What didn\'t</strong>','One-off $22k inventory write-down for obsolete braces and expired components. Causes fixed: see note.'],
      ['<strong>Outlook and risks</strong>','Full year forecast $1.24M sales, $70k profit before tax. Main risk: euro weakness; 60% of Q4 euro receipts hedged.'],
      ['<strong>Asks</strong>','We\'d like to discuss a $60k equipment loan for a fabric cutter (payback 2.7 years) in Q1.']
    ]},
    K('Delivering bad news',
      `<p>Tell them early, before they find out. Give the number, the cause, what you've done about it, and what it means for the forecast. A bank that hears about a problem from you, with a plan, usually helps. A bank that discovers it in the annual accounts starts to doubt everything else.</p>`)
  ]},
  {id:'case', label:'Case: the email', kind:'case', title:'The email from the supplier', blocks:[
    CASE('$18,400 gone',
      `<p>An email arrives from BraceWorks' fabric supplier in Taiwan: <em>"Please note our bank account has changed due to an audit. Kindly use the new details below for all future payments."</em> The email address looks right. The invoice attached is real. The accounts assistant updates the supplier record and pays the next invoice: <strong>$18,400</strong>.</p>
       <p>Three weeks later, the real supplier calls asking why they haven't been paid. The email came from a lookalike address, with one letter changed. The money has gone.</p>`),
    SORT('Which controls would have stopped it?',['Would have stopped it','Wouldn\'t'],[
      {text:'Calling the supplier on a phone number already on file to confirm any bank detail change', a:0, why:'The single most effective control. Fraudsters can fake an email, but not your existing contact.'},
      {text:'A second person approving every change to supplier bank details', a:0, why:'A second look, especially by someone who knows this control, catches most attempts.'},
      {text:'Checking that the invoice amount is correct', a:1, why:'The invoice was real. The fraud was the bank account.'},
      {text:'Sending a small test payment to a new account and confirming receipt with the supplier by phone', a:0, why:'Confirms the account belongs to the supplier before the big payment.'},
      {text:'A monthly report of all supplier bank detail changes, reviewed by the GM', a:0, why:'Would have caught it soon after, possibly before the money moved or while recall was still possible.'},
      {text:'The annual audit', a:1, why:'Far too late, and not designed to catch this.'}
    ]),
    K('What to do if it happens',
      `<p>Call your bank immediately and ask them to recall the payment; speed matters. Report it to the police. Tell your insurer, as some policies cover it. Then fix the control. Many exporters lose money this way every year, and recovery is rare after a few days.</p>`)
  ]},
  {id:'quiz', label:'Quiz', kind:'quiz', title:'Check your understanding', blocks:[
    Q('Which element of the fraud triangle can a GM most directly control?',['Pressure','Opportunity','Rationalisation','None of them'],1,'Controls remove the opportunity.'),
    Q('What is segregation of duties?',['Splitting the finance team across two offices','Making sure no one person can start, approve and complete a transaction alone','Separating personal and business accounts','Having two auditors'],1,'Different people order, receive, approve and pay.'),
    Q('What is a three-way match?',['Matching three quotes','Checking the purchase order, goods-received note and invoice agree before paying','Three signatures on a cheque','Matching three months of bank statements'],1,'It stops payment for goods not ordered or not received.'),
    Q('A supplier emails new bank details. What should happen before the next payment?',['Update the record immediately','Call the supplier on a number already on file, and have a second person approve the change','Reply to the email asking for confirmation','Wait for the auditors'],1,'Never confirm through the channel that requested the change.'),
    Q('Does a clean audit opinion prove there\'s no fraud?',['Yes','No. Auditors test samples for material misstatement, and management remains responsible for preventing fraud.','Only if the auditors are large','Only for that year'],1,'An audit is not a fraud guarantee.'),
    Q('You expect to breach a covenant next quarter. When should you tell the bank?',['After the test date','Now, with the cause, your plan and a forecast','Only if they ask','Never; fix it quietly'],1,'Early, honest communication with a plan keeps the relationship and usually leads to a waiver.')
  ]},
  {id:'apply', label:'Practice', kind:'apply', title:'Practise on a sample pack', blocks:[
    PACK('packD',5,'Pack D, page 5: supplier changes and payments'),
    Q('The freight forwarder\'s new bank details were "confirmed by reply email". What should happen before the next payment?',['Nothing more','Call the forwarder on a number already on file, and have a second person approve the change','Reply again to the email','Pay half'],1,'Replying to the requesting email verifies nothing (Module 18).'),
    Q('Pacific Quality Consulting: set up and approved by the same person, $2,500 a month, no purchase order, vague invoices. First step?',['Keep paying','Hold further payments; ask for the contract, deliverables and company details, and verify independently','Report to the police immediately','Ask the purchasing officer if it\'s fine'],1,'It may be genuine. Verify before assuming either way, and fix the approval control.'),
    Q('Pack D recommends a bigger bonus pool for the managers who prepare and benefit from these numbers. Which part of the fraud triangle does that represent?',['Opportunity','Pressure','Rationalisation','None'],1,'Bonuses tied to reported numbers create pressure. Controls and independent review matter more, not less.'),
    {t:'html',html:'<h3>Later, with your own report</h3><p class="small" style="color:var(--muted)">Optional. When you next read your own monthly report, use this checklist. Nothing here is shared or sent; ticks are saved only in this browser.</p>'},
    CHECK('m18-ctl','At my company…',[
      'There\'s a written approval limits table',
      'New suppliers and bank detail changes need a second approval and a call-back',
      'Payments need two approvers in the bank system',
      'The GM reviews the payment run, or a summary, every week',
      'The GM reviews and signs the monthly bank reconciliation',
      'Headcount and overtime are reviewed by the GM each month',
      'Purchases are paid only after a three-way match',
      'The auditors\' management letter points each have an owner and a fix date',
      'The bank and owner get a short written update every quarter'
    ]),
    REPORT('Your Monday-morning request',
      `<p>Ask finance for a list of <strong>every change to supplier bank details in the last 12 months</strong>, and how each one was verified. Then ask for the same report every month from now on.</p>`),
    K('Takeaways',
      `<ul>
        <li>Fraud needs opportunity. Segregation of duties and GM review remove most of it.</li>
        <li>Bank detail changes are the biggest single risk for exporters. Always call back on a known number.</li>
        <li>Audits give an opinion on the accounts. They don't replace your controls, but the management letter is valuable.</li>
        <li>Give banks and owners regular, honest updates, and bad news early with a plan.</li>
       </ul>`)
  ]}
  ],
  warnings:[
    {sign:'New suppliers for vague "services" with no purchase order', meaning:'Possible fake supplier.', look:'Who set it up, who approved it, what was delivered.'},
    {sign:'Supplier bank details changed by email', meaning:'Possible payment redirection fraud.', look:'Call-back on a known number; second approval.'},
    {sign:'Invoices just below an approval limit', meaning:'Splitting to avoid scrutiny.', look:'Payments by supplier and approver near each limit.'},
    {sign:'Overtime steady and high for the same people', meaning:'Possible padded hours or ghost workers.', look:'Timesheets, gate records, HR leave records.'},
    {sign:'Large or repeated audit adjustments', meaning:'Monthly reports are materially wrong.', look:'List of adjustments and why the close missed them.'}
  ],
  formulas:[
    {name:'Fraud triangle', f:'Pressure + Opportunity + Rationalisation', ex:'Controls remove the opportunity'},
    {name:'Three-way match', f:'Purchase order = Goods received = Invoice → pay', ex:'Quantities and prices must agree before payment'}
  ],
  glossary:[
    {term:'Fraud triangle', def:'The three conditions usually present when fraud happens: pressure, opportunity and rationalisation.'},
    {term:'Segregation of duties', def:'Splitting key steps of a transaction between different people, so no one can complete it alone.'},
    {term:'Three-way match', def:'Checking the purchase order, goods-received note and supplier invoice agree before payment.'},
    {term:'Supplier master file', def:'The system record of each supplier, including bank details. Changes should be tightly controlled.'},
    {term:'Approval limits', def:'A table setting who can approve which transactions, up to what amount.'},
    {term:'Payment redirection fraud', def:'Fraud where criminals impersonate a supplier to change bank details and divert payments.'},
    {term:'Audit opinion', def:'The auditor\'s conclusion on whether the financial statements give a true and fair view.'},
    {term:'Management letter', def:'The auditor\'s report to management of control weaknesses found during the audit.'},
    {term:'Audit adjustment', def:'A correction to the accounts made as a result of the audit.'},
    {term:'PBC list', def:'"Prepared by client": the list of schedules and documents the auditors ask the company to prepare.'}
  ]
});
})();
