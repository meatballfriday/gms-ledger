/* Ask the tutor: a chat panel on every page. Uses the artifact's `sample` capability (the viewer's own Claude account).
   Hidden entirely when the page isn't running inside a Claude viewer that can sample. */
(function(){
if(BW._askInit) return; BW._askInit=true;
const T=(s,v)=>BW.T(s,v);
const E=(tag,cls,html)=>{ const e=document.createElement(tag); if(cls) e.className=cls; if(html!=null) e.innerHTML=html; return e; };
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/* ---------- a small, safe Markdown renderer (escape first, then format) */
function inline(s){
  return esc(s)
    .replace(/`([^`]+)`/g,'<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>')
    .replace(/(^|[^*\w])\*([^*\n]+)\*(?=[^*\w]|$)/g,'$1<em>$2</em>');
}
function md(src){
  const lines=String(src).replace(/\r/g,'').split('\n'); let h='', i=0;
  const isRow=l=>/^\s*\|.*\|\s*$/.test(l), isSep=l=>/^\s*\|?\s*:?-{2,}/.test(l)&&/\|/.test(l);
  while(i<lines.length){
    const l=lines[i];
    if(!l.trim()){ i++; continue; }
    if(isRow(l)&&i+1<lines.length&&isSep(lines[i+1])){
      const cells=r=>r.trim().replace(/^\||\|$/g,'').split('|').map(c=>c.trim());
      h+='<div class="ask-tw"><table><thead><tr>'+cells(l).map(c=>`<th>${inline(c)}</th>`).join('')+'</tr></thead><tbody>'; i+=2;
      while(i<lines.length&&isRow(lines[i])){ h+='<tr>'+cells(lines[i]).map(c=>`<td>${inline(c)}</td>`).join('')+'</tr>'; i++; }
      h+='</tbody></table></div>'; continue;
    }
    if(/^\s*([-*•])\s+/.test(l)||/^\s*\d+[.)]\s+/.test(l)){
      const ol=/^\s*\d+[.)]\s+/.test(l); h+=ol?'<ol>':'<ul>';
      while(i<lines.length&&(ol?/^\s*\d+[.)]\s+/:/^\s*([-*•])\s+/).test(lines[i])){ h+='<li>'+inline(lines[i].replace(/^\s*([-*•]|\d+[.)])\s+/,''))+'</li>'; i++; }
      h+=ol?'</ol>':'</ul>'; continue;
    }
    if(/^#{1,6}\s+/.test(l)){ h+='<p><strong>'+inline(l.replace(/^#{1,6}\s+/,''))+'</strong></p>'; i++; continue; }
    let p=[]; while(i<lines.length&&lines[i].trim()&&!isRow(lines[i])&&!/^\s*([-*•]|\d+[.)])\s+/.test(lines[i])&&!/^#{1,6}\s+/.test(lines[i])){ p.push(lines[i]); i++; }
    h+='<p>'+p.map(inline).join('<br>')+'</p>';
  }
  return h;
}
BW.askMd=md;  /* exposed for tests */

/* ---------- what the learner is looking at */
function pageContext(){
  const main=document.getElementById('main'); if(!main) return {where:'the course',text:''};
  const h1=main.querySelector('.mod-head h1'), eb=main.querySelector('.mod-head .eyebrow'), tab=main.querySelector('.sectab.is-active'), body=main.querySelector('.sec-body');
  let where, text;
  if(h1){
    const sn=tab?tab.querySelector('.sn'):null, label=tab?tab.textContent.replace(sn?sn.textContent:'','').trim():'';
    where=`${eb?eb.textContent.trim()+': ':''}"${h1.textContent.trim()}"${label?`, section ${sn?sn.textContent+' ':''}"${label}"`:''}`;
    text=(body||main).innerText;
  } else { where='the course home page (course map and progress)'; text=main.innerText; }
  text=text.replace(/\n{3,}/g,'\n\n').trim();
  if(text.length>9000) text=text.slice(0,9000)+'\n[…page text cut short]';
  return {where,text,short:h1?(tab?tab.textContent.replace(/^\d+/,'').trim():h1.textContent.trim()):T('Course home')};
}
function moduleList(){
  return BW.ORDER.map(id=>{ const o=BW.OUT[id]; if(!o) return ''; return `${o.n==='C'?'Capstone':'Module '+o.n}: ${o.title}${BW.isOptional(id)?' (optional track: growing into a multinational)':''}`; }).filter(Boolean).join('\n');
}
/* the learner's interface language decides the answer language */
function langRule(){
  if(BW.lang==='zh-TW') return `- Language: this learner is using the course in Traditional Chinese. Answer in Traditional Chinese as used in Taiwan (繁體中文), not English and not Simplified Chinese, still plain and warm. Use Taiwan accounting terminology, as in TIFRS (the IFRS as adopted in Taiwan) and as used by Taiwanese companies and the Financial Supervisory Commission. The first time a technical term appears, give the English term in brackets after it, for example 應收帳款 (accounts receivable). Keep numbers in the course's US$ format.
`;
  return '';
}
function rules(ctx,quote){
  return `You are the tutor built into "The GM's Ledger", an interactive accounting and finance course for general managers. The course follows BraceWorks Medical, a fictional company of about 50 people in the Philippines that makes and exports medical devices (braces, slings, mattresses). The learner is a general manager, not an accountant.

How to answer:
- Plain English, warm and direct. Lead with the answer. Keep it under about 200 words unless the learner asks for more depth.
- Define any jargon the first time you use it. When it helps, show a small worked example with BraceWorks-style numbers.
- Treat the page text below as your main source. Stay consistent with its numbers, terms and conventions (the course follows IFRS and Philippine PFRS). If the page has interactive widgets, the text shows their current values.
- If the question is covered better in another module, say which one by number and name, from the list below.
- If the learner asks for a quiz answer they haven't attempted yet, help them reason it out with a hint first rather than giving the answer outright.
- For decisions about their own company's tax, legal or audit position, explain the principles and suggest confirming the specifics with their accountant or adviser. Don't invent current tax rates or rules you aren't sure of; say what to check.
- If the question has nothing to do with business or finance, answer briefly and steer back to the course.
- Format with Markdown: short paragraphs, **bold** for key terms, bullet or numbered lists, and simple tables when comparing numbers. No headings.
${langRule()}
Course outline:
${moduleList()}

The learner is currently on: ${ctx.where}. (They may have moved between pages during this chat; earlier questions may refer to earlier pages.)
${quote?`\nThe learner selected this passage on the page and is asking about it:\n"""${quote}"""\n`:''}
Page text:
"""
${ctx.text||'(no text)'}
"""`;
}

/* ---------- where answers come from
   app:  inside the Claude app or claude.ai, through the viewer's own Claude account (the `sample` capability)
   api:  the course opened as a file or on another website, with the learner's own Claude API key
   copy: no key: the question is copied, with the page context, for pasting into any AI chat */
const LS={get(k,d){ try{ const v=localStorage.getItem('gmledger.'+k); return v==null?d:v; }catch(e){ return d; } },set(k,v){ try{ if(v==null) localStorage.removeItem('gmledger.'+k); else localStorage.setItem('gmledger.'+k,v); }catch(e){} }};
/* labels are English keys for BW.T, translated when drawn (the T marks list them in the catalog) */
const TIERS=[['quick',/*T*/'Fast',/*T*/'Answers almost at once. Good for definitions and quick checks.'],['default',/*T*/'Balanced',/*T*/'Thinks briefly first. Good for most questions.'],['complex',/*T*/'Thorough',/*T*/'Thinks longest. Best for tricky calculations and judgement calls; can take a minute.']];
const MODELS=[['claude-opus-5-5','Claude Opus 5.5'],['claude-sonnet-5-5','Claude Sonnet 5.5'],['claude-haiku-4-5-20251001','Claude Haiku 4.5'],['claude-fable-5-1','Claude Fable 5.1']];
const EFFORTS=[['low',/*T*/'Low: quickest'],['medium',/*T*/'Medium'],['high',/*T*/'High: most careful']];
let tier=LS.get('askTier','default'); if(!TIERS.some(x=>x[0]===tier)) tier='default';
let model=LS.get('askModel','claude-sonnet-5-5'); if(!MODELS.some(x=>x[0]===model)) model='claude-sonnet-5-5';
let effort=LS.get('askEffort','medium'); if(!EFFORTS.some(x=>x[0]===effort)) effort='medium';
let apiKey=LS.get('apiKey','')||'';
const tierName=t=>T((TIERS.find(x=>x[0]===t)||TIERS[1])[1]);
const inViewer=!!(window.claude&&typeof window.claude.use==='function');
let mode=inViewer?'pending':(apiKey?'api':'copy');
let sample=null, dead=false, busy=false, ctl=null, turns=[], quote='', fab, panel, log, form, ta, sendB, stopB, quoteBox, sugg, ctxLine, opts;
const SUGG=()=>[
  [T('Explain simply'),T('Explain this section to me more simply, as if I were new to it.')],
  [T('BraceWorks example'),T('Give me a worked example of this with BraceWorks numbers.')],
  [T('What do I do with it?'),T('How would I use this in practice as a GM? What should I look for or ask my finance team?')],
  [T('Quiz me'),T('Ask me one question at a time to check I understand this section. Wait for my answer before giving the next one.')]
];

/* ---------- Claude API, straight from the browser (only outside claude.ai, whose pages can't reach other sites) */
async function apiAsk(system,msgs,{signal,onText}){
  const merged=[]; msgs.forEach(m=>{ const last=merged[merged.length-1]; if(last&&last.role===m.role) last.content+='\n\n'+m.content; else merged.push({role:m.role,content:m.content}); });
  if(!merged.length||merged[0].role!=='user') merged.unshift({role:'user',content:'(start)'});
  let res;
  try{
    res=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',signal,headers:{'content-type':'application/json','x-api-key':apiKey,'anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true'},
      body:JSON.stringify({model,max_tokens:effort==='high'?32000:effort==='medium'?16000:8000,system,messages:merged,stream:true,output_config:{effort}})});
  }catch(e){ throw {code:signal&&signal.aborted?'cancelled':'network'}; }
  if(!res.ok){ let j=null; try{ j=await res.json(); }catch(e){} const t=j&&j.error&&j.error.type, m=j&&j.error&&j.error.message;
    throw {code:res.status===401?'bad_key':res.status===403?'forbidden':res.status===404?'bad_model':res.status===429?'rate_limited':res.status===529||t==='overloaded_error'?'overloaded':'api_error',message:m||('HTTP '+res.status)}; }
  const rd=res.body.getReader(), dec=new TextDecoder(); let buf='', text='', truncated=false;
  try{
    for(;;){ const {done,value}=await rd.read(); if(done) break; buf+=dec.decode(value,{stream:true});
      let k; while((k=buf.indexOf('\n\n'))>=0){ const evt=buf.slice(0,k); buf=buf.slice(k+2);
        const data=evt.split('\n').filter(l=>l.startsWith('data:')).map(l=>l.slice(5).trim()).join(''); if(!data) continue;
        let j; try{ j=JSON.parse(data); }catch(e){ continue; }
        if(j.type==='content_block_delta'&&j.delta&&j.delta.type==='text_delta'){ text+=j.delta.text; onText&&onText(text); }
        else if(j.type==='message_delta'&&j.delta&&j.delta.stop_reason==='max_tokens') truncated=true;
        else if(j.type==='error') throw {code:(j.error&&j.error.type)==='overloaded_error'?'overloaded':'api_error',message:j.error&&j.error.message,text}; } }
  }catch(e){ if(e&&e.code) throw e; throw {code:signal&&signal.aborted?'cancelled':'network',text}; }
  if(!text.trim()) throw {code:'empty_completion'};
  return {text,truncated};
}
function copyText(t){
  if(navigator.clipboard&&window.isSecureContext) return navigator.clipboard.writeText(t).then(()=>true,()=>fallback());
  return Promise.resolve(fallback());
  function fallback(){ try{ const x=document.createElement('textarea'); x.value=t; x.setAttribute('readonly',''); x.style.position='fixed'; x.style.opacity='0'; document.body.appendChild(x); x.select(); const ok=document.execCommand('copy'); x.remove(); return ok; }catch(e){ return false; } }
}

/* ---------- UI */
function build(){
  fab=E('button','ask-fab','<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 4.5h12a1.5 1.5 0 0 1 1.5 1.5v6.5A1.5 1.5 0 0 1 16 14H9l-3.5 3v-3H4a1.5 1.5 0 0 1-1.5-1.5V6A1.5 1.5 0 0 1 4 4.5z"/><path d="M6.5 8.3h7M6.5 10.8h4.5"/></svg><span></span>');
  fab.type='button'; fab.setAttribute('aria-haspopup','dialog'); fab.setAttribute('aria-controls','askp');
  fab.onclick=()=>open();
  panel=E('aside','ask'); panel.id='askp'; panel.hidden=true; panel.setAttribute('role','dialog');
  panel.innerHTML=`<div class="ask-head"><div class="ask-ttl"><strong></strong><span class="ask-ctx"></span></div>
      <button type="button" class="ask-new"></button><button type="button" class="ask-x">✕</button></div>
    <div class="ask-tier"></div>
    <div class="ask-log" role="log" aria-live="polite"></div>
    <div class="ask-foot">
      <div class="ask-sugg"></div>
      <div class="ask-quote" hidden><span></span><button type="button">✕</button></div>
      <form class="ask-form"><label class="sr" for="askta"></label><textarea id="askta" rows="1" maxlength="2000"></textarea>
        <button type="submit" class="ask-send">➤</button><button type="button" class="ask-stop" hidden></button></form>
      <p class="ask-note"></p>
    </div>`;
  document.body.append(fab,panel);
  log=panel.querySelector('.ask-log'); form=panel.querySelector('.ask-form'); ta=panel.querySelector('textarea'); sendB=panel.querySelector('.ask-send'); stopB=panel.querySelector('.ask-stop');
  quoteBox=panel.querySelector('.ask-quote'); sugg=panel.querySelector('.ask-sugg'); ctxLine=panel.querySelector('.ask-ctx'); opts=panel.querySelector('.ask-tier');
  panel.querySelector('.ask-x').onclick=close;
  panel.querySelector('.ask-new').onclick=()=>{ if(ctl) ctl.abort(); turns=[]; log.innerHTML=''; setQuote(''); intro(); ta.focus(); };
  quoteBox.querySelector('button').onclick=()=>setQuote('');
  form.onsubmit=e=>{ e.preventDefault(); ask(ta.value); };
  ta.addEventListener('keydown',e=>{ if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing){ e.preventDefault(); ask(ta.value); } });
  ta.addEventListener('input',grow);
  stopB.onclick=()=>{ if(ctl) ctl.abort(); };
  panel.addEventListener('keydown',e=>{ if(e.key==='Escape'){ e.stopPropagation(); close(); } });
  window.addEventListener('hashchange',refreshCtx);
  new MutationObserver(()=>{ if(!panel.hidden) refreshCtx(); }).observe(document.getElementById('main'),{childList:true});
  labels(); renderOpts();
  BW.onLang&&BW.onLang(()=>{ labels(); renderOpts(); if(!panel.hidden){ refreshCtx(); if(!turns.length&&log.querySelector('.ask-hi')){ log.innerHTML=''; intro(); } } });
}
/* fixed interface text, redrawn when the language changes */
function labels(){
  fab.querySelector('span').textContent=T('Ask'); fab.title=T('Ask a question about this page');
  panel.setAttribute('aria-label',T('Ask the tutor')); panel.querySelector('.ask-ttl strong').textContent=T('Ask the tutor');
  const nw=panel.querySelector('.ask-new'); nw.textContent=T('New chat'); nw.title=T('Start a new chat');
  panel.querySelector('.ask-x').setAttribute('aria-label',T('Close'));
  quoteBox.querySelector('button').setAttribute('aria-label',T('Remove the selected passage'));
  panel.querySelector('label[for=askta]').textContent=T('Your question'); ta.placeholder=T('Ask about this page…');
  sendB.setAttribute('aria-label',T('Send')); stopB.textContent=T('Stop');
}
/* the strip under the title: answer depth in the app; model, effort and key with an API key; set-up link otherwise */
function renderOpts(){
  const note=panel.querySelector('.ask-note');
  if(mode==='app'){
    opts.innerHTML=`<span class="ask-tg" role="radiogroup" aria-label="${esc(T('Answer depth'))}">${TIERS.map(([v,l,d])=>`<button type="button" role="radio" data-t="${v}" title="${esc(T(d))}" aria-checked="${v===tier}">${esc(T(l))}</button>`).join('')}</span><span class="ask-tier-d"></span>`;
    const d=opts.querySelector('.ask-tier-d'), show=()=>{ opts.querySelectorAll('[data-t]').forEach(b=>b.setAttribute('aria-checked',b.dataset.t===tier?'true':'false')); d.textContent=T((TIERS.find(x=>x[0]===tier)||TIERS[1])[2]); };
    opts.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{ tier=b.dataset.t; LS.set('askTier',tier); show(); }); show();
    note.textContent=T('Answers come from Claude on your own account and can be wrong. Check figures against the module.');
  } else if(mode==='api'){
    opts.innerHTML=`<label class="ask-sel">${T('Model')} <select class="ask-model">${MODELS.map(([v,l])=>`<option value="${v}"${v===model?' selected':''}>${l}</option>`).join('')}</select></label>
      <label class="ask-sel">${T('Effort')} <select class="ask-effort">${EFFORTS.map(([v,l])=>`<option value="${v}"${v===effort?' selected':''}>${esc(T(l))}</option>`).join('')}</select></label>
      <button type="button" class="linkbtn ask-key">${T('API key')}</button>`;
    opts.querySelector('.ask-model').onchange=e=>{ model=e.target.value; LS.set('askModel',model); };
    opts.querySelector('.ask-effort').onchange=e=>{ effort=e.target.value; LS.set('askEffort',effort); };
    opts.querySelector('.ask-key').onclick=()=>setup();
    note.textContent=T('Answers come from Claude through your API key, billed to your Anthropic account, and can be wrong. Check figures against the module.');
  } else {
    opts.innerHTML=`<span class="ask-tier-d">${T('No AI connected. Your question will be copied, with this page as context, to paste into any AI chat.')}</span><button type="button" class="linkbtn ask-key">${T('Connect a Claude API key')}</button>`;
    opts.querySelector('.ask-key').onclick=()=>setup();
    note.textContent=T('Tip: paste into Claude, Gemini or ChatGPT. Answers can be wrong; check figures against the module.');
  }
}
function setup(){
  if(busy) return;
  const hi=log.querySelector('.ask-hi'); if(hi) hi.remove();
  const old=log.querySelector('.ask-setup'); if(old) old.remove();
  const c=E('div','ask-setup');
  c.innerHTML=`<p><strong>${T('Connect your Claude API key')}</strong></p>
    <p class="small">${T('With a key, answers appear here and you choose the exact model and effort. Create a key in the {link}; usage is billed to that account. The key is sent only to Anthropic.',{link:`<a href="https://platform.claude.com/" target="_blank" rel="noopener">${T('Claude Console')}</a>`})}</p>
    <label class="sr" for="askkey">${T('API key')}</label><input id="askkey" type="password" autocomplete="off" spellcheck="false" placeholder="sk-ant-…" value="${esc(apiKey)}">
    <label class="ask-chk"><input type="checkbox" class="ask-rem"${LS.get('apiKey','')?' checked':''}> ${T("Remember it on this device (don't tick on a shared computer)")}</label>
    <div class="ask-row"><button type="button" class="btn small ask-save">${T('Save')}</button>${apiKey?`<button type="button" class="btn ghost small ask-forget">${T('Forget key')}</button>`:''}<button type="button" class="linkbtn ask-cancel">${T('Cancel')}</button></div>`;
  log.appendChild(c); log.scrollTop=log.scrollHeight;
  const inp=c.querySelector('input[type=password]'); setTimeout(()=>inp.focus(),30);
  c.querySelector('.ask-save').onclick=()=>{ const k=inp.value.trim(); if(!k){ inp.focus(); return; } apiKey=k; LS.set('apiKey',c.querySelector('.ask-rem').checked?k:null); mode='api'; c.remove(); renderOpts(); intro(); ta.focus(); };
  const fg=c.querySelector('.ask-forget'); if(fg) fg.onclick=()=>{ apiKey=''; LS.set('apiKey',null); mode='copy'; c.remove(); renderOpts(); intro(); };
  c.querySelector('.ask-cancel').onclick=()=>{ c.remove(); intro(); };
}
function grow(){ ta.style.height='auto'; ta.style.height=Math.min(ta.scrollHeight,140)+'px'; }
function refreshCtx(){ const c=pageContext(); ctxLine.textContent=T('About: {page}',{page:c.short}); }
function setQuote(q){ quote=q; quoteBox.hidden=!q; quoteBox.querySelector('span').textContent=q?`“${q.length>140?q.slice(0,140)+'…':q}”`:''; }
function intro(){
  if(turns.length||log.querySelector('.ask-setup')) return;
  log.innerHTML=`<div class="ask-hi"><p>${T("Ask anything about this page: a term you don't follow, why a number moved, or how it applies to your own business.")}</p>${mode==='copy'?`<p class="small">${T('No AI is connected in this copy of the course. Type your question and it will be copied together with this page, ready to paste into any AI chat. Or connect a Claude API key to get answers here.')}</p>`:''}<p class="small">${T('Tip: select a sentence on the page before opening this panel to ask about that passage.')}</p></div>`;
  renderSugg();
}
function renderSugg(){
  sugg.innerHTML=''; if(turns.length) return;
  SUGG().forEach(([label,q])=>{ const b=E('button','ask-chip',esc(label)); b.type='button'; b.onclick=()=>ask(q); sugg.appendChild(b); });
}
function open(){
  if(dead) return;
  const sel=(window.getSelection&&String(window.getSelection()||'').trim())||'';
  if(sel&&sel.length>=3&&!panel.contains(window.getSelection().anchorNode)) setQuote(sel.slice(0,1200));
  panel.hidden=false; fab.hidden=true; document.body.classList.add('ask-open');
  refreshCtx(); intro(); if(quote&&!turns.length&&!ta.value) ta.value=T('Explain this passage.'); grow();
  setTimeout(()=>ta.focus(),30);
}
function close(){ panel.hidden=true; fab.hidden=dead; document.body.classList.remove('ask-open'); fab.focus(); }
function bubble(role,html){ const b=E('div','ask-m '+role,html); log.appendChild(b); log.scrollTop=log.scrollHeight; return b; }
function setBusy(on){ busy=on; sendB.hidden=on; stopB.hidden=!on; ta.disabled=false; log.setAttribute('aria-busy',on?'true':'false'); sugg.querySelectorAll('button').forEach(b=>b.disabled=on); }
function note(b,msg,retry){
  const n=E('p','ask-err',esc(msg)); b.appendChild(n);
  if(retry){ const r=E('button','linkbtn',T('Try again')); r.type='button'; r.onclick=()=>{ b.remove(); const last=turns[turns.length-1]; if(last&&last.role==='user'){ const q=turns.pop(); const ubs=log.querySelectorAll('.ask-m.user'); if(ubs.length) ubs[ubs.length-1].remove(); ask(q.content,true); } }; n.append(' ',r); }
}
function ask(q,isRetry){
  q=String(q||'').trim(); if(!q||busy||dead) return;
  if(mode==='pending') return;
  if(mode==='app'&&!sample) return;
  ta.value=''; grow(); sugg.innerHTML='';
  const hi=log.querySelector('.ask-hi'); if(hi) hi.remove();
  const qq=quote; setQuote('');
  bubble('user',(qq?`<span class="ask-q">“${esc(qq.length>160?qq.slice(0,160)+'…':qq)}”</span>`:'')+esc(q).replace(/\n/g,'<br>'));
  const content=qq?`About this passage: "${qq}"\n\n${q}`:q;
  if(mode==='copy'){
    const prompt=rules(pageContext(),qq)+'\n\nMy question: '+content;
    const b=bubble('bot','');
    copyText(prompt).then(ok=>{
      b.innerHTML=ok?`<p>${T('<strong>Copied</strong>, with this page as context. Paste it into an AI chat:')}</p><p class="ask-links"><a href="https://claude.ai/new" target="_blank" rel="noopener">Claude</a><a href="https://gemini.google.com/app" target="_blank" rel="noopener">Gemini</a><a href="https://chatgpt.com/" target="_blank" rel="noopener">ChatGPT</a></p>`
        :`<p>${T('Your browser blocked copying. Select all the text below, copy it, and paste it into an AI chat.')}</p><textarea class="ask-copy" readonly rows="6"></textarea>`;
      const x=b.querySelector('.ask-copy'); if(x){ x.value=prompt; x.focus(); x.select(); }
      log.scrollTop=log.scrollHeight; });
    return;
  }
  turns.push({role:'user',content});
  while(turns.length>16) turns.splice(0,2);   /* keep the chat short; the instructions are rebuilt every call */
  const b=bubble('bot',`<span class="ask-think"><i></i><i></i><i></i> ${T('Thinking…')}</span>`);
  ctl=new AbortController(); const my=ctl; setBusy(true);
  const ctxRules=rules(pageContext(),qq);
  const asked=tier;
  const p=mode==='app'
    ? sample([{role:'user',content:ctxRules}].concat(turns),{cache:false,modelTier:asked,signal:my.signal,onText:({text})=>{ b.innerHTML=md(text); log.scrollTop=log.scrollHeight; }})
    : apiAsk(ctxRules,turns,{signal:my.signal,onText:text=>{ b.innerHTML=md(text); log.scrollTop=log.scrollHeight; }});
  p.then(r=>{ b.innerHTML=md(r.text); turns.push({role:'assistant',content:r.text}); if(r.truncated) note(b,T('The answer was cut short. Ask for the rest, or a shorter version.')); if(r.modelTierApplied&&r.modelTierApplied!==asked) note(b,T("Answered in {got} mode: {asked} isn't available on your Claude plan.",{got:tierName(r.modelTierApplied),asked:tierName(asked)})); })
    .catch(e=>{
      const code=(e&&e.code)||'upstream_error', part=e&&e.text;
      if(part){ b.innerHTML=md(part); turns.push({role:'assistant',content:part}); } else b.innerHTML='';
      if(code==='cancelled') note(b,T('Stopped.'));
      else if(['not_granted','sampling_disabled','not_declared','capability_disabled','capability_removed'].includes(code)){
        dead=true; turns=[]; note(b,T("Asking Claude isn't available here, or wasn't allowed for this course. You can still use everything else on the page."));
        form.hidden=true; sugg.innerHTML=''; }
      else if(code==='bad_key'){ note(b,T("That API key wasn't accepted. Check it and save it again.")); setTimeout(setup,0); }
      else if(code==='forbidden') note(b,T("Your API key isn't allowed to do this. Check its permissions in the Claude Console."));
      else if(code==='bad_model') note(b,T("That model isn't available on your API account. Pick another model above, then try again."),true);
      else if(code==='overloaded') note(b,T('Claude is very busy right now. Try again in a minute, or pick a different model.'),true);
      else if(code==='network') note(b,T("Couldn't reach Claude. Check your internet connection."),!part);
      else if(code==='api_error') note(b,T('Claude returned an error: {message}.',{message:e.message||T('unknown')}),true);
      else if(code==='rate_limited') note(b,T('Too many questions at once, or your usage limit has been reached. Please try again in a little while.'),true);
      else if(code==='session_expired') note(b,T('Your Claude sign-in has expired. Sign in again, then try again.'),true);
      else if(code==='refused'){ b.innerHTML=''; turns.pop(); note(b,T("Claude couldn't answer that one. Try asking it a different way.")); }
      else if(code==='prompt_too_large'){ turns=turns.slice(-2); note(b,T('This chat got too long. Start a new chat, or ask again.'),true); }
      else if(code==='empty_completion') note(b,T('No answer came back. Try rephrasing the question.'));
      else note(b,T('The connection was interrupted.'),!part);
    })
    .finally(()=>{ if(ctl===my) ctl=null; setBusy(false); log.scrollTop=log.scrollHeight; if(!panel.hidden&&!dead) ta.focus(); });
}

/* ---------- start */
build();
if(inViewer){
  /* inside a Claude viewer: show the button only once the viewer's own Claude can answer (pages here can't reach other sites) */
  fab.hidden=true;
  Promise.resolve(window.claude.use('sample')).then(s=>{ if(typeof s==='function'){ sample=s; mode='app'; renderOpts(); fab.hidden=false; } }).catch(()=>{});
}
})();
