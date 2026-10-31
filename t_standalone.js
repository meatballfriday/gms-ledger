// The standalone export: works as a plain file. Tutor in copy mode and API-key mode (mocked), local notes, downloads.
const {chromium}=require('/opt/node22/lib/node_modules/playwright');
(async()=>{
  const b=await chromium.launch(); const url='file://'+require('path').resolve('dist/gm-ledger-standalone.html'); const errs=[];
  const cx=await b.newContext({viewport:{width:1200,height:900},acceptDownloads:true,permissions:['clipboard-read','clipboard-write']});
  const pg=await cx.newPage(); pg.on('pageerror',e=>errs.push(String(e)));
  let sent=null, status=200;
  await pg.route('https://api.anthropic.com/v1/messages',async r=>{ sent={h:r.request().headers(),body:JSON.parse(r.request().postData())};
    if(status!==200) return r.fulfill({status,contentType:'application/json',body:JSON.stringify({type:'error',error:{type:'authentication_error',message:'invalid x-api-key'}})});
    const ev=(t,d)=>`event: ${t}\ndata: ${JSON.stringify(d)}\n\n`;
    const body=ev('message_start',{type:'message_start',message:{}})+ev('content_block_start',{type:'content_block_start',index:0,content_block:{type:'thinking'}})+ev('content_block_delta',{type:'content_block_delta',index:0,delta:{type:'thinking_delta',thinking:'hmm'}})+
      ev('content_block_delta',{type:'content_block_delta',index:1,delta:{type:'text_delta',text:'**Working capital** is '}})+ev('content_block_delta',{type:'content_block_delta',index:1,delta:{type:'text_delta',text:'cash tied up.'}})+ev('message_delta',{type:'message_delta',delta:{stop_reason:'end_turn'}})+ev('message_stop',{type:'message_stop'});
    r.fulfill({status:200,headers:{'content-type':'text/event-stream','access-control-allow-origin':'*'},body}); });
  await pg.goto(url+'#m1-4'); await pg.waitForTimeout(900);
  console.log('charset ok:', await pg.evaluate(()=>document.characterSet), '| back arrow:', await pg.$eval('.brs-back',e=>e.textContent));
  console.log('fab visible:', !(await pg.$eval('.ask-fab',e=>e.hidden)), '| note pen:', await pg.$eval('.cmt-fab span',e=>e.textContent));
  // copy mode
  await pg.click('.ask-fab'); await pg.fill('#askta','What is working capital?'); await pg.keyboard.press('Enter'); await pg.waitForTimeout(300);
  console.log('copy bubble:', await pg.$eval('.ask-m.bot',e=>e.textContent.slice(0,40)));
  const clip=await pg.evaluate(()=>navigator.clipboard.readText()); console.log('clipboard has rules+page+question:', /tutor built into/.test(clip), /Page text/.test(clip), /My question: What is working capital\?/.test(clip));
  // connect key
  await pg.click('.ask-tier .ask-key'); await pg.fill('#askkey','sk-ant-test'); await pg.check('.ask-rem'); await pg.click('.ask-save'); await pg.waitForTimeout(100);
  console.log('api mode selects:', await pg.$$eval('.ask-tier select',x=>x.length));
  await pg.selectOption('.ask-model','claude-opus-5-5'); await pg.selectOption('.ask-effort','high');
  await pg.fill('#askta','Explain this'); await pg.keyboard.press('Enter'); await pg.waitForTimeout(600);
  console.log('headers:', sent.h['x-api-key'], sent.h['anthropic-version'], sent.h['anthropic-dangerous-direct-browser-access']);
  console.log('body:', sent.body.model, JSON.stringify(sent.body.output_config), sent.body.stream, 'system?', !!sent.body.system, 'roles', sent.body.messages.map(m=>m.role).join(','));
  console.log('answer:', await pg.$$eval('.ask-m.bot',x=>x.at(-1).innerHTML));
  status=401; await pg.fill('#askta','again'); await pg.keyboard.press('Enter'); await pg.waitForTimeout(500);
  console.log('401 note:', await pg.$$eval('.ask-err',x=>x.at(-1).textContent), '| setup shown:', !!(await pg.$('.ask-setup')));
  console.log('key remembered:', await pg.evaluate(()=>localStorage.getItem('gmledger.apiKey')));
  await pg.click('.ask-forget'); console.log('forgotten:', await pg.evaluate(()=>localStorage.getItem('gmledger.apiKey')));
  await pg.keyboard.press('Escape'); await pg.click('.ask-x').catch(()=>{});
  // notes
  await pg.click('.cmt-fab'); await pg.click('#cm-m1-cf-3-1 .w-head'); await pg.fill('#ntta','Make this clearer'); await pg.click('.nt-save'); await pg.waitForTimeout(100);
  console.log('pin:', await pg.$eval('#cm-m1-cf-3-1 .nt-pin',e=>e.textContent), '| list btn:', await pg.$eval('.nt-fab',e=>e.textContent));
  await pg.goto(url+'#m3-1'); await pg.waitForTimeout(500); await pg.click('.nt-fab');
  console.log('list item:', await pg.$eval('.nt-it .nt-go',e=>e.textContent));
  const [dl]=await Promise.all([pg.waitForEvent('download'),pg.click('.nt-dl')]); const fs=require('fs'); const pth=await dl.path(); console.log('notes file:', dl.suggestedFilename(), fs.readFileSync(pth,'utf8').split('\n').slice(0,4).join(' | '));
  await pg.click('.nt-go'); await pg.waitForTimeout(500); console.log('navigated:', await pg.evaluate(()=>location.hash));
  await pg.screenshot({path:'/tmp/claude-0/shots/sa_notes.png'});
  // template download
  await pg.goto(url+'#kit-4'); await pg.waitForTimeout(700);
  const btn=pg.locator('button',{hasText:/Download/}).first(); const [d2]=await Promise.all([pg.waitForEvent('download',{timeout:5000}).catch(()=>null),btn.click()]); console.log('template download:', d2&&d2.suggestedFilename());
  console.log(errs.length?'ERRORS '+errs.join('\n'):'no errors'); await b.close();
})();
