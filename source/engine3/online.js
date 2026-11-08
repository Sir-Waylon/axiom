/* ===== online play: class games (join with a code) and versus (real player, or a labelled bot) =====
   Talks to /api/room/* and /api/vs/*. Guests are fine: no account needed. Only a nickname and correct/incorrect + timing are sent.
   Honest limit: questions are graded in the browser, so this is for fun and class use, not for exams. Coins earned here are cosmetic. */
(function(){
var OG=null,poll=null,raf=0,off=0,NK='ognick';
function api(m,p,b,tok){var h={'content-type':'application/json'};if(tok)h['x-gtok']=tok;
 return fetch('/api'+p,{method:m,credentials:'same-origin',headers:h,body:b?JSON.stringify(b):undefined}).then(function(r){return r.json().catch(function(){return{}}).then(function(j){j._s=r.status;return j})}).catch(function(){return{error:'No connection. Check your internet and try again.',_s:0}})}
var TN='';try{localStorage.removeItem(NK)}catch(e){}
function nick(){return TN}
function setNick(n){TN=n}
var ADJ=['Swift','Quiet','Bright','Brave','Lucky','Calm','Sharp','Bold'],ANI=['Otter','Fox','Owl','Lynx','Heron','Panda','Gecko','Wolf'];
function sugg(){return ADJ[Math.floor(Math.random()*ADJ.length)]+' '+ANI[Math.floor(Math.random()*ANI.length)]}
function myAv(){return (S.cos&&S.cos.on&&S.cos.on.av)||'a0'}
function pickQ(n,typed){var pool=QS.filter(function(q){return q.id&&(q.type==='mcq'||(typed&&q.type==='short'&&q.l<=3&&(!q.num||(window.calcPolicy&&calcPolicy(q)===0))))});
 var mc=shuf(pool.filter(function(q){return q.type==='mcq'})),sh=shuf(pool.filter(function(q){return q.type==='short'})),out=[];
 while(out.length<n&&(mc.length||sh.length)){var useS=typed&&sh.length&&out.length%3===2;var q=useS?sh.pop():(mc.pop()||sh.pop());if(q)out.push(q)}
 return{ids:out.map(function(q){return q.id}),lims:out.map(function(q){return q.type==='short'?40000:20000})}}
function el(){return document.getElementById('ogb')}
function stop(){if(poll){clearInterval(poll);poll=null}if(raf){cancelAnimationFrame(raf);raf=0}}
function shell(title){var o=document.getElementById('og');if(!o){o=document.createElement('div');o.id='og';o.className='ogov';o.setAttribute('role','dialog');o.setAttribute('aria-modal','true');o.setAttribute('aria-label','Play online');document.body.appendChild(o)}
 o.innerHTML='<div class="ogh"><button class="iconbtn" id="ogx" aria-label="Leave game">×</button><b id="ogt">'+esc(title||'Play online')+'</b><span class="sp"></span><span id="ogc"></span></div><div class="ogbody" id="ogb"></div>';return o}
function leave(){TN='';stop();var o=document.getElementById('og');if(o)o.remove();if(OG&&OG.tok&&OG.mode==='vs'&&OG.code)api('POST','/room/end',{code:OG.code},OG.tok);if(OG&&OG.q)api('POST','/vs/cancel',{},OG.q);OG=null;try{route()}catch(e){}}
function err(m){var b=document.getElementById('ogerr');if(b){b.textContent=m||'';b.hidden=!m}}
/* ---------- menu ---------- */
function menu(mode){stop();OG=null;mode=(mode==='host'||mode==='vs'||mode==='join')?mode:'';shell(mode==='host'?'Host a game':mode==='vs'?'Versus':mode==='join'?'Join a game':'Play online');var n=nick()||sugg();
 el().innerHTML='<div class="ogmenu"><div class="ogcard" data-m="join"><h2>Join a class game</h2><p class="small mute">Your teacher shows a 6-letter code.</p><label>Code<input id="ogcode" maxlength="6" autocapitalize="characters" autocomplete="off" spellcheck="false" placeholder="ABC234"></label><label>Nickname<input id="ognick" maxlength="16" autocomplete="off" placeholder="Any name, 2 to 16 characters" value="'+esc(n)+'"></label><button class="btn block" id="ogjoin">Join</button></div>'
 +'<div class="ogcard" data-m="vs"><h2>Versus</h2><p class="small mute">10 questions against another student. If nobody is waiting, you can choose to play a practice bot. Bots are always labelled.</p><label>Nickname<input id="ognick2" maxlength="16" autocomplete="off" placeholder="Any name, 2 to 16 characters" value="'+esc(n)+'"></label><button class="btn block" id="ogvs">Find an opponent</button></div>'
 +'<div class="ogcard" data-m="host"><h2>Host a class game</h2><p class="small mute">You control the pace. Students join with the code on their own devices.</p><div class="ogrow"><label>Questions<select id="ogn"><option>10</option><option selected>15</option><option>20</option><option>30</option></select></label><label class="chk"><input type="checkbox" id="ogtyped"> Include typed answers</label></div><label class="chk"><input type="checkbox" id="ogplay" checked> I play too</label><label>My nickname<input id="ognick3" maxlength="16" autocomplete="off" value="'+esc(n)+'"></label><button class="btn block" id="oghost">Create game</button></div>'
 +'<p id="ogerr" class="ogerr" role="alert" hidden></p><p class="small mute" style="text-align:center">Your nickname is temporary: use any name, even your real one. It is not saved on this device and is deleted from the server about 10 minutes after the game ends. Coins from games only unlock looks.</p></div>';if(mode)[].forEach.call(el().querySelectorAll('.ogcard[data-m]'),function(c){if(c.dataset.m!==mode)c.remove()})}
/* ---------- joining / hosting / versus ---------- */
function startPoll(){stop();poll=setInterval(tick,OG&&OG.fast?700:1000);tick()}
function tick(){if(!OG||!OG.code||OG.busy)return;OG.busy=1;api('GET','/room/state?code='+encodeURIComponent(OG.code),null,OG.tok).then(function(v){OG&&(OG.busy=0);if(!OG)return;if(v.gone||v._s===404){over('This game has ended.');return}if(v.error){if(v._s===0){return}over(v.error);return}onState(v)})}
function over(m){stop();var o=shell('Game over');el().innerHTML='<div class="ogmenu"><div class="ogcard"><h2>'+esc(m)+'</h2><button class="btn block" id="ogback">Back</button></div></div>';OG=null}
function join(){var code=(document.getElementById('ogcode').value||'').toUpperCase().replace(/[^A-Z0-9]/g,''),nk=(document.getElementById('ognick').value||'').trim();
 if(code.length!==6){err('Enter the 6-letter code.');return}if(!nk){err('Pick a nickname.');return}err('Joining…');setNick(nk);
 api('POST','/room/join',{code:code,nick:nk,av:myAv(),pack:P.meta.id}).then(function(r){if(r.error){err(r.error);return}OG={mode:'class',code:r.code,tok:r.tok,host:false};window.sfx&&sfx('join');startPoll()})}
function host(){var nk=(document.getElementById('ognick3').value||'').trim(),pl=document.getElementById('ogplay').checked,n=+document.getElementById('ogn').value||15,ty=document.getElementById('ogtyped').checked;
 if(pl&&!nk){err('Pick a nickname, or untick "I play too".');return}if(pl)setNick(nk);var qs=pickQ(n,ty);if(qs.ids.length<5){err('Not enough questions for a game here.');return}err('Creating…');
 api('POST','/room/create',{pack:P.meta.id,qids:qs.ids,lims:qs.lims,nick:pl?nk:undefined,av:myAv()}).then(function(r){if(r.error){err(r.error);return}OG={mode:'class',code:r.code,tok:r.tok,host:true,player:!!r.player};startPoll()})}
function recentAcc(){var r=S.ra||'';return r.length<5?.6:r.split('').filter(function(c){return c==='1'}).length/r.length}
function versus(){var nk=(document.getElementById('ognick2').value||'').trim();if(!nk){err('Pick a nickname.');return}setNick(nk);var qs=pickQ(10,false);
 var bots=AV.filter(function(a){return a[6]>=0});var bav=bots.length?bots[Math.floor(Math.random()*bots.length)][0]:myAv();
 err('');queue({nick:nk,pack:P.meta.id,qids:qs.ids,lims:qs.lims,av:myAv(),bav:bav,lvl:Math.max(.25,Math.min(.95,recentAcc()))})}
function queue(body,forceBot){shell('Versus');el().innerHTML='<div class="ogmenu"><div class="ogcard ogwait"><div class="ogspin" aria-hidden="true"></div><h2 id="ogq">Looking for an opponent…</h2><p class="small mute" id="ogq2">Another student has about 10 seconds to join you.</p><div id="ogqb"></div><button class="btn sec block" id="ogcancel">Cancel</button></div></div>';
 api('POST','/vs/queue',Object.assign({},body,forceBot?{bot:true}:{})).then(function(r){if(r.error){over(r.error);return}OG={mode:'vs',tok:r.tok,q:r.matched?null:r.tok,body:body,fast:true};if(r.matched){OG.q=null;OG.code=r.code;OG.bot=!!r.bot;startMatch()}else waitMatch()})}
function waitMatch(){stop();var t0=Date.now();poll=setInterval(function(){if(!OG||!OG.q)return;api('GET','/vs/status',null,OG.q).then(function(r){if(!OG||!OG.q)return;if(r.code){OG.code=r.code;OG.q=null;startMatch();return}if(r.gone){over('The search ended. Try again.');return}
  if(Date.now()-t0>9000){var b=document.getElementById('ogqb');if(b&&!b.innerHTML){document.getElementById('ogq').textContent='No one is waiting right now';document.getElementById('ogq2').textContent='You can play a practice bot. It is clearly labelled as a bot and answers like an average student at your level.';b.innerHTML='<button class="btn block" id="ogbot">Play a bot</button><button class="btn sec block" id="ogwait">Keep waiting</button>'}}})},1200)}
function startMatch(){stop();window.sfx&&sfx('join');OG.fast=true;startPoll()}
/* ---------- state rendering ---------- */
function sig(v){return [v.state,v.qi,v.done,v.mine&&v.mine.pts,(v.players||[]).map(function(p){return p.n+p.s+(p.k===null?'-':p.k)}).join(','),v.np,v.an,v.opp&&v.opp.s,v.me&&v.me.s].join('|')}
function onState(v){off=v.t-Date.now();OG.v=v;OG.mode=v.mode;OG.host=v.host;var s=sig(v);
 if((v.state==='q'||v.state==='reveal')&&OG.qkey!==v.qi+':'+v.qid){OG.qkey=v.qi+':'+v.qid;OG.it=QI[v.qid]!==undefined?mkItem(v.qid):null;OG.my=null;OG.sound=0}
 if(OG.sig===s){return}OG.sig=s;draw(v)}
function ldr(v,n){var rows=(v.players||[]).slice(0,n||5);return '<ol class="ogldr">'+rows.map(function(p,i){var me=v.me&&p.n===v.me.n;return '<li class="'+(me?'me':'')+'"><span class="rk">'+(i+1)+'</span>'+mascot(p.av||'a0','happy',34)+'<b>'+esc(p.n)+(p.b?' <i class="botlab">bot</i>':'')+'</b><span class="pts">'+p.s+'</span></li>'}).join('')+'</ol>'}
function draw(v){stop2();var o=shell(v.mode==='vs'?'Versus':'Class game');var c=document.getElementById('ogc');if(c&&v.mode==='class')c.innerHTML='<span class="ogcode" aria-label="Game code">'+v.code+'</span>';
 var b=el();
 if(v.state==='lobby')return lobby(b,v);
 if(v.state==='q')return question(b,v);
 if(v.state==='reveal')return reveal(b,v);
 return done(b,v)}
function stop2(){if(raf){cancelAnimationFrame(raf);raf=0}}
function lobby(b,v){var n=(v.players||[]).length;
 b.innerHTML='<div class="oglobby"><p class="small mute">'+(v.host?'Share this code':'Joined. Waiting for the host to start')+'</p><div class="ogbig" aria-label="Code '+v.code.split('').join(' ')+'">'+v.code+'</div><p class="mute">'+n+(n===1?' player':' players')+' in the lobby</p><div class="ogchips">'+(v.players||[]).map(function(p){return '<span class="ogchip">'+mascot(p.av||'a0','happy',28)+esc(p.n)+'</span>'}).join('')+'</div>'+(v.host?'<button class="btn block" id="ogstart"'+(n?'':' disabled')+'>Start game</button><p class="small mute">'+(OG.player?'You are playing too. ':'')+'Players can still join until you start.</p>':'')+'<p class="ogerr" id="ogerr" role="alert" hidden></p></div>'}
function timerBar(v){return '<div class="ogtm" role="timer" aria-label="Time left"><i id="ogti"></i><span id="ogts"></span></div>'}
function runTimer(v){stop2();var fn=function(){var i=document.getElementById('ogti');if(!i||!OG){return}var rem=Math.max(0,v.lim-(Date.now()+off-v.qat)),p=rem/v.lim;i.style.width=(p*100)+'%';i.style.background=p<.25?'#e0412f':p<.5?'#f5a623':'var(--pri)';var s=document.getElementById('ogts');if(s)s.textContent=Math.ceil(rem/1000)+'s';
  if(OG.v&&OG.v.state==='q'&&rem<=3000&&rem>0&&OG.sound!==Math.ceil(rem/1000)){OG.sound=Math.ceil(rem/1000);window.sfx&&sfx('count')}raf=requestAnimationFrame(fn)};fn()}
function question(b,v){var it=OG.it,q=it&&it.q,vs=v.mode==='vs',hud='';
 if(vs&&v.me){var o=v.opp||{n:'…',s:0,av:'a0'};hud='<div class="ogvs"><div class="me">'+mascot(v.me.av||myAv(),'happy',44)+'<b>'+esc(v.me.n)+'</b><span>'+v.me.s+'</span></div><div class="vsx">VS</div><div class="op">'+mascot(o.av||'a0','happy',44)+'<b>'+esc(o.n)+'</b><span>'+o.s+'</span></div></div>'}
 var head='<div class="ogq"><div class="ogqn">Question '+(v.qi+1)+' of '+v.n+'</div>'+timerBar(v)+'</div>';
 if(!q){b.innerHTML=hud+head+'<p>This question is not in your version of the game. Hang tight.</p>';if(v.player&&!v.done&&!OG.my){OG.my={ok:false};api('POST','/room/answer',{code:v.code,qi:v.qi,ok:false,ms:v.lim},OG.tok)}runTimer(v);return}
 var wait=v.qat-(Date.now()+off);
 var ctl='';if(v.host){ctl='<div class="ogctl"><span>'+(v.an||0)+' of '+(v.np||0)+' answered</span><button class="btn sm sec" id="ogreveal">Show answer</button></div>'}
 var body;
 if(!v.player){body='<div class="ogproj">'+qBody(it,false).replace(/data-oi=/g,'data-x=')+'</div>'}
 else if(v.done||OG.my){body='<div class="ogproj">'+qBody(it,false).replace(/data-oi=/g,'data-x=').replace(/<input /,'<input disabled ')+'</div><div class="oglock"><b>Locked in</b><span>Waiting for everyone…</span></div>'}
 else{var qh=qBody(it,false);var tiles='';
  if(q.type==='mcq'){var shapes=['▲','◆','●','■'];qh=(q.fig?figSVG(q.fig):'')+(q.svg?'<div class="figw">'+q.svg+'</div>':'')+'<div class="qtext">'+esc(q.q)+'</div>';
   tiles='<div class="ogtiles">'+it.perm.map(function(oi,k){return '<button class="ogtile t'+(k%4)+'" data-ogo="'+oi+'"><i aria-hidden="true">'+shapes[k%4]+'</i><b>'+'ABCDEF'[k]+'</b><span>'+esc(q.o[oi])+'</span></button>'}).join('')+'</div>'}
  else tiles='<div class="ans"><input id="ogv" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Your answer"><button class="btn block" id="ogsend">Lock in</button></div>';
  body='<div class="ogproj">'+(q.type==='mcq'?qh:qh.replace(/<div class="ans">[\s\S]*$/,''))+'</div>'+tiles}
 b.innerHTML=hud+head+body+ctl+'<p class="ogerr" id="ogerr" role="alert" hidden></p>';runTimer(v);
 if(wait>0&&v.mode==='vs'){var w=document.createElement('div');w.className='ogcd';w.id='ogcd';b.appendChild(w);var k=function(){var r=Math.ceil((v.qat-(Date.now()+off))/1000);var d=document.getElementById('ogcd');if(!d)return;if(r<=0){d.remove();window.sfx&&sfx('go');return}d.textContent=r;setTimeout(k,200)};k()}
 var iv=document.getElementById('ogv');if(iv)iv.focus()}
function submit(ok,val){var v=OG.v;if(!v||OG.my)return;OG.my={ok:ok,val:val};var ms=Math.max(500,Math.min(v.lim,Date.now()+off-v.qat));if(OG.it&&val!==undefined)OG.it.val=val;
 window.sfx&&sfx('pop');api('POST','/room/answer',{code:v.code,qi:v.qi,ok:ok,ms:ms},OG.tok).then(function(r){if(!OG)return;if(r.pts!==undefined)OG.my.pts=r.pts;OG.sig='';tick()});OG.sig='';draw(Object.assign({},v,{done:1}))}
function reveal(b,v){var it=OG.it,q=it&&it.q,mine=OG.my||(v.mine?{ok:!!v.mine.ok,pts:v.mine.pts}:null);
 if(it&&mine){if(q.type==='mcq'){it.sel=it.sel&&it.sel.length?it.sel:(mine.ok?[0]:[it.perm.filter(function(x){return x!==0})[0]])}it.ok=!!mine.ok;it.done=true}
 var row=(v.players||[]).filter(function(p){return v.me&&p.n===v.me.n})[0],pts=row?row.p:0,ok=row?row.k===1:(mine&&mine.ok);
 var msg=!v.player?'':(ok?'Correct! +'+pts:(row&&row.k===null)?'No answer':'Not this time');
 if(v.player&&!OG.sound2){OG.sound2=v.qi;window.sfx&&sfx(ok?'ok':'no')}
 var last=v.qi+1>=v.n;
 b.innerHTML=(v.player?'<div class="ogres '+(ok?'good':'bad')+'">'+mascot(v.me?v.me.av:myAv(),ok?'cheer':'oops',72)+'<h2>'+esc(msg)+'</h2></div>':'')+(it?'<div class="ogproj rev">'+qBody(it,true)+(q.w?'<p class="ogw">'+esc(q.w)+'</p>':'')+'</div>':'')+'<h3>Scores</h3>'+ldr(v,v.mode==='vs'?2:5)
  +(v.host?'<button class="btn block" id="ognext">'+(last?'Show final results':'Next question')+'</button>':'<p class="small mute" style="text-align:center">'+(v.mode==='vs'?'Next question in a moment…':'Waiting for the host…')+'</p>')+'<p class="ogerr" id="ogerr" role="alert" hidden></p>'}
function done(b,v){stop();var me=v.me,rank=me?me.rank:0,pl=v.players||[],top=pl.slice(0,3);
 if(me&&!OG.paid){OG.paid=1;var gain=Math.min(60,10+3*me.r+(rank===1?10:0));S.coins+=gain;OG.gain=gain;try{S.og=S.og||{g:0,w:0};S.og.g++;if(rank===1)S.og.w++;save();hud&&hud()}catch(e){}window.sfx&&sfx(rank===1?'gameWin':'gameLose')}
 var vs=v.mode==='vs',won=vs&&pl.length>1&&pl[0].n===(me&&me.n)&&pl[0].s>pl[1].s,tie=vs&&pl.length>1&&pl[0].s===pl[1].s;
 b.innerHTML='<div class="ogdone"><h2>'+(vs?(tie?'It is a tie':won?'You win!':'Good game'):(rank===1?'You won the class game!':'Final results'))+'</h2>'
  +'<div class="ogpod">'+top.map(function(p,i){return '<div class="pd p'+i+'">'+mascot(p.av||'a0',i===0?'cheer':'happy',i===0?96:72)+'<b>'+esc(p.n)+(p.b?' <i class="botlab">bot</i>':'')+'</b><span>'+p.s+'</span></div>'}).join('')+'</div>'
  +(me?'<p class="ogme">You finished <b>#'+rank+'</b> with <b>'+me.s+'</b> points and <b>'+me.r+'</b> right.</p><p class="small mute">+'+(OG.gain||0)+' coins (looks only, no advantages)</p>':'')
  +(pl.length>3?'<h3>Everyone</h3>'+ldr(v,12):'')+'<button class="btn block" id="ogagain">Play again</button><button class="btn sec block" id="ogexit">Done</button></div>'}
/* ---------- events ---------- */
document.addEventListener('click',function(e){var t=e.target,id=t.id,bt=t.closest&&t.closest('button');
 if(t.closest&&t.closest('[data-og]')){var og=t.closest('[data-og]').dataset.og;if(og==='solo')return;menu(og);return}
 if(!document.getElementById('og'))return;
 if(id==='ogx'||id==='ogexit'||id==='ogback'){leave();return}
 if(id==='ogjoin')return join();if(id==='oghost')return host();if(id==='ogvs')return versus();
 if(id==='ogcancel'){if(OG&&OG.q)api('POST','/vs/cancel',{},OG.q);stop();menu();return}
 if(id==='ogbot'){var bd=OG&&OG.body;stop();if(OG&&OG.q)api('POST','/vs/cancel',{},OG.q);if(bd)queue(bd,true);return}
 if(id==='ogwait'){var q=document.getElementById('ogqb');if(q)q.innerHTML='';document.getElementById('ogq').textContent='Still looking…';return}
 if(id==='ogstart'||id==='ognext'||id==='ogreveal'){if(!OG)return;api('POST','/room/next',{code:OG.code},OG.tok).then(function(r){if(r.error)err(r.error);else{OG.sig='';tick()}});return}
 if(id==='ogagain'){leave();menu();return}
 if(bt&&bt.dataset.ogo!==undefined&&OG&&OG.it){var oi=+bt.dataset.ogo;OG.it.sel=[oi];submit(oi===0);return}
 if(id==='ogsend'&&OG&&OG.it){var iv=document.getElementById('ogv'),val=iv?iv.value:'';if(!val.trim())return;var ok=false;try{ok=!!gradeShort(OG.it.q,val).ok}catch(x){}submit(ok,val);return}});
document.addEventListener('keydown',function(e){if(!document.getElementById('og'))return;if(e.key==='Escape'){leave();return}if(e.key==='Enter'){var t=e.target;if(t.id==='ogv'){document.getElementById('ogsend').click()}else if(t.id==='ogcode'||t.id==='ognick')document.getElementById('ogjoin').click()}});
/* entry point on the Practice tab */
var _vp3=viewPractice;viewPractice=function(){var h=_vp3();var card='<button class="card" data-og="1" style="text-align:left"><h3>Play online</h3><p class="small mute">Class code or versus</p></button>';return h.replace('<button class="card" data-pm="blitz"',card+'<button class="card" data-pm="blitz"')};
window.openOnline=menu;
})();
