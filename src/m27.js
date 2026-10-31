/* ===== Module 27: Controls and governance at scale (optional: growing into a multinational) ===== */
(function(){
const {K,TIP,FLAG,CASE,REPORT,Q,FS,FLIP,SORT,CHECK,W,money,signed,pct,kfmt} = BW.h;
const E=(tag,cls,html)=>{ const e=document.createElement(tag); if(cls) e.className=cls; if(html!=null) e.innerHTML=html; return e; };

BW.add({
  id:'m27', minutes:55,
  title:'Controls and governance at scale',
  subtitle:'At 50 people, the GM sees most things personally. At 1,000 people across five countries, nobody can. Controls, a risk process, internal audit and a proper board take over the job the GM\'s eyes used to do.',
  goals:[
    'Describe a complete control system using the five COSO components',
    'Set a delegation of authority that lets people act without losing control',
    'Explain the three lines: management, oversight functions and internal audit',
    'Run a risk register that is actually used, with owners and actions',
    'Know what a board, an audit committee and a whistleblowing channel should do for a growing group'
  ],
  sections:[
  /* ---------------------------------------------------------------- 1 */
  {id:'why', label:'What changes', kind:'learn', title:'What changes at 1,000 people', blocks:[
    `<p>Module 18 set out controls for a 50-person company: separate duties, approve payments, reconcile the bank. They still matter, but at group scale three things change. Most transactions happen in countries you rarely visit. People you've never met approve spending. And the cost of one undetected problem, a fraud, a bribe or a recall, can threaten the whole group.</p>
     <p>The most widely used way to think about a complete control system is the <strong>COSO framework</strong>: five components that must all work together. Press <strong>Play</strong>.</p>`,
    {t:'fig', title:'Five parts of a control system (COSO)', intro:'Press <strong>Play</strong> to see each part, and what it means at BraceWorks.',
      steps:[
        {k:['n0'],t:'<strong>Control environment.</strong> The tone from the top: a code of conduct, clear authority, competent people, and a board that oversees management. If leaders bend the rules, nothing below holds.'},
        {k:['n0','e0','n1'],t:'<strong>Risk assessment.</strong> Regularly asking what could go wrong, how likely it is and how bad it would be, including fraud risk and new risks from a new country or product.'},
        {k:['n1','e1','n2'],t:'<strong>Control activities.</strong> The specific checks: approvals, separated duties, reconciliations, system access limits, stock counts.'},
        {k:['n2','e2','n3'],t:'<strong>Information and communication.</strong> Reliable reports reaching the right people, policies everyone knows, and a way to raise concerns safely.'},
        {k:['n3','e3','n4'],t:'<strong>Monitoring.</strong> Checking the controls actually work: management reviews, internal audit, and fixing what\'s found.'}],
      draw:BW.viz.flow({label:'COSO: control environment, risk assessment, control activities, information and communication, monitoring.',labels:['shapes','targets','report','checked by'],edgeK:['e0','e1','e2','e3'],
        nodes:[{t:'Control environment',s:'tone from the top',k:'n0'},{t:'Risk assessment',s:'what could go wrong',k:'n1'},{t:'Control activities',s:'the checks',k:'n2'},{t:'Information',s:'reports and channels',k:'n3'},{t:'Monitoring',s:'do they work?',k:'n4'}]})},
    Q('A new subsidiary has excellent approval controls on paper, but its manager often tells staff to "just get it done, we\'ll sort the paperwork later". Which COSO component is failing?',[
      'Control activities','The control environment','Monitoring','None: the controls exist'],1,
      'Tone from the top beats any procedure. Staff follow what leaders do, not what the manual says.')
  ]},
  /* ---------------------------------------------------------------- 2 */
  {id:'doa', label:'Who approves what', kind:'play', title:'Delegation of authority: who can approve what', blocks:[
    `<p>A <span class="term">delegation of authority</span> (or authority matrix) says who can commit the company to what, up to what amount. Too tight, and every decision queues for the CEO. Too loose, and a country manager can sign a five-year lease alone. Good matrices follow a few principles: limits by type of decision, not just amount; some decisions always go higher whatever the amount (borrowing, guarantees, bank accounts, related parties); and nobody approves their own spending.</p>`,
    SORT('Where would a sensible matrix send each decision at BraceWorks Group?',['Country manager','CFO','CEO','Board'],[
      {text:'A $15,000 replacement sewing machine within the approved budget', a:0, why:'Budgeted, routine and small: decide locally.'},
      {text:'Opening a new bank account in Australia', a:1, why:'Bank accounts are a classic fraud route. Always central, whatever the amount.'},
      {text:'A 15% price discount for a hospital tender, outside the price policy', a:2, why:'Pricing exceptions affect margins and other customers. Above the country manager\'s limit, the CEO decides.'},
      {text:'A $3 million second production line in Vietnam', a:3, why:'Large, long-term and strategic: the board approves major investments.'},
      {text:'The parent guaranteeing a US subsidiary\'s bank loan', a:3, why:'Guarantees put the whole group on the hook. Board decision.'},
      {text:'Writing off a $4,000 debt from a bankrupt distributor', a:1, why:'Write-offs need approval by someone independent of sales.'},
      {text:'A contract with a company owned by the owner\'s brother-in-law', a:3, why:'Related-party transactions need independent approval, whatever the size.'},
      {text:'A new distributor agreement in a country with high corruption risk', a:2, why:'Agents and distributors are the biggest bribery risk for device makers. Due diligence first, then senior sign-off.'}
    ]),
    TIP('Make the matrix live in the system',
      `<p>A matrix in a binder is forgotten. Build the limits into the ERP's purchase and payment workflows (Module 25), so the system won't release a payment or order without the right approval, and review the matrix every year as the business grows.</p>`)
  ]},
  /* ---------------------------------------------------------------- 3 */
  {id:'lines', label:'Three lines', kind:'learn', title:'Three lines: who does, who checks, who audits', blocks:[
    `<p>As a group grows, responsibilities for control are split into three lines, all reporting in the end to the board.</p>`,
    {t:'fig', title:'The three lines', draw:function(w){
      const P=BW.viz.p; const narrow=w<560; let g='';
      const top=P.nodeLines(w-20,'Board and audit committee','oversee, set risk appetite, hold management to account'); g+=P.node(10,4,w-20,top.h,top,'hl'); let y=top.h+22;
      const cols=[['First line','Managers and staff in every country and function','run the business and its controls day to day',''],['Second line','Finance controllership, risk, compliance, quality','set policies, advise, challenge and monitor',''],['Third line','Internal audit','independent assurance, reports straight to the audit committee','good']];
      if(narrow){ cols.forEach(c=>{ const L=P.nodeLines(w-20,c[0]+': '+c[1],c[2]); g+=P.arrow(w/2,y-18,w/2,y-3)+P.node(10,y,w-20,L.h,L,c[3]); y+=L.h+22; }); }
      else { const cw=(w-20-2*16)/3; const Ls=cols.map(c=>P.nodeLines(cw,c[0]+': '+c[1],c[2])); const h=Math.max(...Ls.map(l=>l.h)); cols.forEach((c,i)=>{ const x=10+i*(cw+16); g+=P.arrow(x+cw/2,y-18,x+cw/2,y-3)+P.node(x,y,cw,h,Ls[i],c[3]); }); y+=h+22; }
      const ex=P.nodeLines(w-20,'External assurance','statutory auditors, regulators, notified bodies for device approvals'); g+=P.node(10,y,w-20,ex.h,ex,''); y+=ex.h+4;
      return P.svg(w,y,'Board oversight above three lines: management, oversight functions and internal audit, plus external assurance.',g);
    }, caption:'Based on the Institute of Internal Auditors\' Three Lines Model. The point is independence: internal audit doesn\'t report to the people it audits.'},
    K('When does BraceWorks need internal audit?',
      `<p>There is no fixed size, but the signals are clear: several countries, more than a few hundred people, outside investors or lenders who rely on the numbers, or a near miss. Many mid-sized groups start with a part-time head of internal audit or <strong>co-source</strong> the work from an accounting firm, following a risk-based plan approved by the audit committee: high-risk countries and processes first, such as cash, purchasing, sales incentives and distributors.</p>`),
    Q('Why should internal audit report to the audit committee rather than the CFO?',['It\'s cheaper','So it can report problems in finance, including the CFO\'s area, without fear','Auditors prefer it','It doesn\'t matter'],1,'Independence is the whole value of internal audit.')
  ]},
  /* ---------------------------------------------------------------- 4 */
  {id:'risk', label:'Risk register', kind:'play', title:'A risk register that gets used', blocks:[
    `<p>Most risk registers are long lists nobody reads. A useful one is short, scored, owned and reviewed. Rate each BraceWorks Group risk below, and watch the heat map.</p>`,
    W('Rate the group\'s top risks', function(el,ctx){
      const R=[
        {t:'Key foam supplier fails or stops supplying',act:'Second qualified supplier; safety stock; supplier financial checks.'},
        {t:'A recall or field safety action on a major product',act:'Quality system, lot traceability, recall insurance and a rehearsed recall plan.'},
        {t:'Ransomware or a cyber attack stops the ERP',act:'Offline backups, tested restore, access controls, incident plan, cyber insurance.'},
        {t:'Fraud or bribery in a distant subsidiary or distributor',act:'Due diligence on distributors, authority matrix, internal audit visits, whistleblowing channel.'},
        {t:'A big currency move against the euro',act:'Hedging policy (Module 26) and natural hedges.'},
        {t:'Delay to EU or US approval of a new product',act:'Regulatory plan with buffers; don\'t commit capacity or launch spend before approval is likely.'}];
      const L=['Low','Medium','High'];
      const S=ctx.state; S.m27r=S.m27r||{}; const st=S.m27r;
      el.innerHTML=`<div class="rk"></div><div class="hm"></div><div class="rk-out"></div>`;
      const rk=el.querySelector('.rk'), hm=el.querySelector('.hm'), out=el.querySelector('.rk-out');
      R.forEach((r,i)=>{ st[i]=st[i]||{l:1,m:1}; const row=E('div','rk-row',`<span class="hm-dot">${i+1}</span><span>${r.t}</span>`); const a=E('div'), b=E('div'); row.append(a,b); rk.appendChild(row);
        a.appendChild(E('small',null,'Likelihood')); b.appendChild(E('small',null,'Impact'));
        ctx.ui.seg(a,L.map((x,j)=>({v:j,label:x})),st[i].l,v=>{ st[i].l=v; ctx.save(); draw(); }); ctx.ui.seg(b,L.map((x,j)=>({v:j,label:x})),st[i].m,v=>{ st[i].m=v; ctx.save(); draw(); }); });
      function draw(){
        let h='';
        for(let row=2;row>=0;row--){ h+=`<div class="hm-y">${L[row]} impact</div>`; for(let col=0;col<3;col++){ const sc=row+col; h+=`<div class="hm-c ${sc>=3?'h':sc>=2?'m':'l'}" data-tip="${L[col]} likelihood, ${L[row]} impact|">${R.map((r,i)=>st[i].l===col&&st[i].m===row?`<span class="hm-dot" title="${r.t}">${i+1}</span>`:'').join('')}</div>`; } }
        h+=`<div></div>`+L.map(x=>`<div class="hm-x">${x} likelihood</div>`).join('');
        hm.innerHTML=h;
        const ranked=R.map((r,i)=>({r,i,s:(st[i].l+1)*(st[i].m+1)})).sort((a,b)=>b.s-a.s);
        const top=ranked.filter(x=>x.s>=4).slice(0,3);
        out.innerHTML=top.length?`<h4 style="margin:14px 0 6px">Your top ${top.length} risk${top.length>1?'s':''}, and what usually reduces them</h4><ol style="margin:0;padding-left:20px">${top.map(x=>`<li><strong>${x.r.t}.</strong> ${x.r.act}</li>`).join('')}</ol><p class="w-hint" style="margin-top:8px">Each needs a named owner, a target date for the actions, and a review by the leadership team every quarter and the board at least once a year.</p>`:'<p class="w-hint" style="margin-top:10px">Everything rated low? Ask someone outside your team to rate them too. Optimism is the most common bias in risk registers.</p>';
      }
      draw();
    }),
    TIP('Ten risks, not a hundred',
      `<p>Keep the register to the ten or so risks that could really hurt the group, each with an owner, current controls, planned actions and a date. Review it quarterly. Add new ones when the business changes: a new country, a new product, a new big customer.</p>`)
  ]},
  /* ---------------------------------------------------------------- 5 */
  {id:'board', label:'Board and whistleblowing', kind:'learn', title:'Board, audit committee and speaking up', blocks:[
    `<p>A family-owned exporter can be run with an informal board. A multinational group, especially one with outside investors or lenders, needs a board that actually oversees management.</p>`,
    {t:'tbl', head:['Body','What it should do','Signs it\'s working'], rows:[
      ['<strong>Board of directors</strong>','Sets strategy and risk appetite, approves budgets, big investments and borrowing, appoints and holds the CEO to account','At least one or two independent directors with relevant experience; papers sent in advance; decisions minuted'],
      ['<strong>Audit committee</strong> (of the board)','Oversees financial reporting, controls, internal and external audit, and whistleblowing','Meets the auditors without management present at least once a year; internal audit reports to it'],
      ['<strong>Remuneration or people committee</strong>','Sets pay and incentives for senior managers','Incentives that reward sustainable results, not just this quarter\'s numbers (Module 15)']
    ]},
    K('A whistleblowing channel that people trust',
      `<p>Many frauds are first reported by employees, often in the countries furthest from head office. A good channel lets anyone, including distributors and suppliers, raise a concern confidentially and in their own language, reaches someone independent of local management (the audit committee chair or an outside provider), protects people who speak up, and reports every case and its outcome to the audit committee.</p>`),
    FLAG('Bribery: the device industry\'s particular risk',
      `<p>Medical device makers have paid large settlements, mostly in the US, over payments by distributors, agents and sales staff to doctors and hospital officials abroad. Laws such as the US Foreign Corrupt Practices Act and the UK Bribery Act can reach a foreign group with US or UK links, and many countries, including the Philippines, have their own. Know your distributors, pay them only against invoices for real services, cap and record hospitality, and train sales teams every year.</p>`),
    Q('An employee in Vietnam suspects the local manager is inflating expense claims, but fears losing her job. What should exist?',[
      'An email address for the local manager','A confidential channel that reaches someone independent of local management, with protection for the reporter','Nothing: she should go to the police','A suggestion box in the factory'],1,
      'If the only route goes through the person she\'s worried about, she will stay silent.')
  ]},
  /* ---------------------------------------------------------------- 6 */
  {id:'case', label:'Case: the marketing fund', kind:'case', title:'The distributor\'s marketing fund', blocks:[
    CASE('Great growth in a new market',
      `<p>BraceWorks' new distributor in a fast-growing Asian market has tripled sales in a year. The country sales manager agreed a "marketing support fund": 12% of sales, paid quarterly to an account in a third country, "for hospital education events". There are no invoices for events, only the distributor's request letters. Internal audit's first visit is in four months. Sales bonuses are paid on revenue.</p>`),
    Q('What do you do now?',[
      {text:'Nothing until internal audit visits', why:'If payments are reaching hospital officials, every quarter of delay adds to the legal exposure.'},
      {text:'Stop further payments, get legal and compliance advice, ask internal audit or an outside firm to review the fund now, and require evidence of real services for anything paid'},
      {text:'Cut the fund to 6%', why:'A smaller unexplained payment to an offshore account is still an unexplained payment.'},
      {text:'Ask the distributor to promise the money is used properly', why:'A promise is not evidence. Payments to a third country with no invoices are a classic bribery red flag.'}],1,
      'Unexplained percentage payments to an offshore account, with no evidence of services and sales incentives tied to growth, match the pattern behind many bribery cases. Stop, get advice, investigate, and then fix the controls: distributor due diligence, payments only against evidence, and incentives that aren\'t only about revenue.')
  ]},
  /* ---------------------------------------------------------------- 7 */
  {id:'quiz', label:'Quiz', kind:'quiz', title:'Check your understanding', blocks:[
    Q('Which COSO component covers the code of conduct and tone from the top?',['Monitoring','Control environment','Control activities','Risk assessment'],1,'The control environment underpins all the others.'),
    Q('Which decision should go to the board whatever its size?',['A routine budgeted repair','Guaranteeing a subsidiary\'s bank loan','Hiring a warehouse assistant','A small customer credit note'],1,'Guarantees, borrowing and related-party deals go to the top.'),
    Q('In the three lines, internal audit is…',['First line','Second line','Third line, independent and reporting to the audit committee','Not part of it'],2,'Independent assurance is the third line.'),
    Q('What makes a risk register useful?',['It lists every possible risk','A short list of scored risks, each with an owner, actions and dates, reviewed regularly','It is approved once and filed','It is written by the auditors'],1,'Owners and actions turn a list into management.'),
    Q('Why do device makers need special care with distributors abroad?',['Distributors pay late','Payments through distributors to doctors or officials are a common source of bribery cases','Distributors don\'t use the ERP','They need different Incoterms'],1,'Know your distributors, and pay only against evidence of real services.')
  ]},
  /* ---------------------------------------------------------------- 8 */
  {id:'apply', label:'Practice', kind:'apply', title:'Governance for your group', blocks:[
    `<p>Optional. Ticks are saved only in this browser.</p>`,
    CHECK('m27-gov','In our group…',[
      'We have a code of conduct, and leaders visibly follow it',
      'A written authority matrix is built into our systems and reviewed every year',
      'Bank accounts, borrowing, guarantees and related-party deals are always decided centrally',
      'A risk register of about ten risks has owners and actions and is reviewed quarterly',
      'Internal audit (in-house or co-sourced) follows a risk-based plan and reports to the audit committee',
      'The board has at least one independent director, and an audit committee meets the auditors without management',
      'Anyone can raise a concern confidentially, in their language, to someone independent of local management',
      'Distributors and agents are checked before signing, and paid only against evidence'
    ]),
    REPORT('Your Monday-morning question',
      `<p>Ask: <strong>"If someone in our most distant subsidiary saw something wrong today, who would they tell, and would it reach me or the audit committee?"</strong></p>`),
    K('Takeaways',
      `<ul>
        <li>At scale, controls and governance do what the GM's eyes used to do.</li>
        <li>All five COSO components must work together; tone from the top underpins the rest.</li>
        <li>A good authority matrix speeds decisions while keeping high-risk ones central.</li>
        <li>Keep three lines: managers run controls, oversight functions challenge, internal audit checks independently.</li>
        <li>A short, owned risk register and a trusted whistleblowing channel catch problems early.</li>
       </ul>`)
  ]}
  ],
  warnings:[
    {sign:'Leaders who bypass their own controls "to get things done"', meaning:'A weak control environment; others will follow.', look:'Exceptions log; approvals after the event.'},
    {sign:'Payments to distributors or agents without invoices or evidence of services', meaning:'Bribery risk.', look:'Distributor contracts, due diligence files and payment support.'},
    {sign:'No whistleblowing reports at all in a large group', meaning:'People don\'t know about or trust the channel.', look:'Channel awareness and independence.'},
    {sign:'Risk register unchanged for a year', meaning:'Risk management on paper only.', look:'Owners, actions and review dates.'}
  ],
  glossary:[
    {term:'COSO framework', def:'A widely used model of internal control with five components: control environment, risk assessment, control activities, information and communication, and monitoring.'},
    {term:'Three lines model', def:'The split of responsibility between management (first line), oversight functions such as risk and compliance (second line) and internal audit (third line), under the board.'},
    {term:'Internal audit', def:'An independent function that checks whether controls and risk management work, reporting to the audit committee.'},
    {term:'Audit committee', def:'A board committee that oversees financial reporting, controls, internal and external audit, and whistleblowing.'},
    {term:'Whistleblowing channel', def:'A confidential way for employees and others to raise concerns, reaching someone independent of the people involved.'},
    {term:'Independent director', def:'A board member with no management role or close ties to the company or its owners, able to challenge management.'}
  ]
});
})();
