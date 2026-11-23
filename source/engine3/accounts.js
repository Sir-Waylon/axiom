/* ===== accounts: email/password + Google sign-in, native friends by username, weekly league, cloud save ===== */
(function(){
var ACC={mode:'unknown',me:null,csrf:'',f:{mode:'in'},fr:null,g:null,busy:false,last:0},PK=P.meta.id;
function ck(n){var m=document.cookie.split('; ').filter(function(c){return c.indexOf(n+'=')===0})[0];return m?m.slice(n.length+1):''}
function api(m,p,b){return fetch('/api'+p,{method:m,credentials:'same-origin',headers:{'content-type':'application/json','x-csrf':ACC.csrf||ck('__Host-csrf')},body:m==='POST'?JSON.stringify(b||{}):undefined}).then(function(r){return r.json().catch(function(){return {error:'Server unavailable'}}).then(function(j){j.__s=r.status;return j})})}
function unv(){return !!(ACC.me&&ACC.me.verified===false)}
var RUNS=['qwertyuiopasdfghjklzxcvbnm','abcdefghijklmnopqrstuvwxyz','01234567890'];
function hasRun(l){for(var i=0;i+5<=l.length;i++){var c=l.slice(i,i+5);for(var k=0;k<RUNS.length;k++){if(RUNS[k].indexOf(c)>=0||RUNS[k].split('').reverse().join('').indexOf(c)>=0)return true}}return false}
/* mirrors the server rules so the checklist can guide typing; the server is the real check (it also rejects breached passwords) */
function pwRules(p){var l=p.toLowerCase();return [['12 or more characters',p.length>=12],['A number, or 16+ characters',p.length>=16||(/[a-z]/i.test(p)&&/\d/.test(p))],['No runs (12345, qwert), repeats or site name',p.length>0&&!hasRun(l)&&!/(.)\1{3,}/.test(l)&&new Set(l.split('')).size>=6&&!/voltaxis|skyvolt|axiom|quanta|voltaic|stratus|password|olympiad/.test(l)]]}
function pwList(p){return pwRules(p||'').map(function(r){return '<li class="'+(r[1]?'ok':'')+'"><span aria-hidden="true">'+(r[1]?'\u2713':'\u25CB')+'</span> '+r[0]+(r[1]?' (done)':'')+'</li>'}).join('')}
/* Cloudflare Turnstile. The button stays off until the check passes; if the script cannot load there is a plain message and a retry link, never a blank screen. */
function setBtn(){var b=document.getElementById('acg');if(b)b.disabled=!!(ACC.ts&&!ACC.cf)}
function tsFail(){var m=document.getElementById('tsm');if(m&&!ACC.cf)m.innerHTML='The security check could not load. A blocker or the network may be in the way. <button type="button" class="lnk" id="tsr">Try again</button>'}
function tsReset(){ACC.cf='';try{if(window.turnstile&&ACC.tw!=null)turnstile.reset(ACC.tw)}catch(e){}setBtn()}
function tsInit(){if(!ACC.ts||!document.getElementById('ts'))return;ACC.cf='';setBtn();
 function draw(){if(!window.turnstile||!document.getElementById('ts'))return;try{ACC.tw=turnstile.render('#ts',{sitekey:ACC.ts,callback:function(t){ACC.cf=t;var m=document.getElementById('tsm');if(m)m.textContent='';setBtn()},'expired-callback':function(){ACC.cf='';setBtn()},'error-callback':function(){ACC.cf='';setBtn();tsFail()}})}catch(e){tsFail()}}
 if(window.turnstile){draw();return}
 if(!document.getElementById('cfts')){var sc=document.createElement('script');sc.id='cfts';sc.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';sc.async=true;sc.onload=draw;sc.onerror=tsFail;document.head.appendChild(sc)}
 else if(document.getElementById('cfts').dataset.dead){document.getElementById('cfts').remove();tsInit();return}
 setTimeout(function(){if(!window.turnstile)tsFail()},8000)}
function setMe(j){ACC.me=j;ACC.mode='in';ACC.csrf=j.csrf||ACC.csrf;mergeShared(j.shared);}
function mergeShared(sh){if(!sh)return;var ch=0;if(sh.days)for(var k in sh.days)if(/^\d{4}-\d{2}-\d{2}$/.test(k)&&!S.days[k]){S.days[k]=1;ch=1}
 if(sh.cos&&sh.cos.own)for(var c in sh.cos.own)if(/^[a-z]\d{1,2}$/.test(c)&&!S.cos.own[c]){S.cos.own[c]=1;ch=1}if(ch)save()}
function pull(){if(unv())return Promise.resolve();return api('GET','/save?pack='+encodeURIComponent(PK)).then(function(j){if(j.state&&typeof j.state.xp==='number'&&j.state.xp>S.xp){var keep={cos:S.cos,days:S.days};try{doRestore(j.state)}catch(e){}mergeShared({days:keep.days,cos:keep.cos})}push(true)})}
function loadXp(){if(ACC.mode!=='in'||!ACC.me||unv())return Promise.resolve();return api('GET','/xp').then(function(j){if(j&&typeof j.total==='number'){var t=j.total,mine=PK in j.packs?j.packs[PK]:0;if(S.xp>mine)t+=S.xp-mine;ACC.xp={total:t,packs:j.packs};try{hud&&hud()}catch(e){}}})}
var lastRef=0;function refresh(){if(ACC.mode!=='in'||!ACC.me||Date.now()-lastRef<45000)return;lastRef=Date.now();api('GET','/me').then(function(j){if(j&&j.username){setMe(j);return pull()}}).then(loadXp).then(function(){try{route()}catch(e){}})}
document.addEventListener('visibilitychange',function(){if(!document.hidden)refresh()});window.addEventListener('focus',refresh);
var pt=null;function push(now){if(ACC.mode!=='in'||!ACC.me||!ACC.me.username||unv())return;clearTimeout(pt);pt=setTimeout(function(){var st;try{st=JSON.parse(JSON.stringify(S))}catch(e){return}delete st.rs;api('POST','/sync',{pack:PK,state:st,shared:{days:S.days,cos:{own:S.cos.own,on:S.cos.on}},pub:{av:S.cos.on.av,lv:lvInfo().l,st:dayStreak()}}).then(function(j){if(j.ok){ACC.last=Date.now();if(now)loadXp()}else if(j.error&&j.__s!==401&&j.__s!==0)toast(j.error)})},now?0:4000)}
var _sv=save;save=function(){var r=_sv.apply(this,arguments);push();return r};
function friends(){if(unv())return Promise.resolve();return api('GET','/friends').then(function(j){if(!j.error){ACC.fr=j;if(cur==='me'&&sub.me==='friends')route()}})}
function boot(){fetch('/api/config',{credentials:'same-origin'}).then(function(r){if(!r.ok||!/json/.test(r.headers.get('content-type')||''))throw 0;return r.json()}).then(function(c){ACC.g=c.google;ACC.ts=c.turnstile||null;ACC.tf=!!c.tfa;return api('GET','/me')}).then(function(j){if(j.__s===200){setMe(j);pull().then(friends)}else if(j.__s===401){ACC.mode='out';loadG()}else throw 0;if(cur==='me')route()}).catch(function(){ACC.mode='none'})}
function loadG(){if(!ACC.g||window.google||document.getElementById('gsi'))return;var s=document.createElement('script');s.id='gsi';s.src='https://accounts.google.com/gsi/client';s.async=true;s.onload=function(){gate();if(cur==='me'&&sub.me==='friends')afterMe()};document.head.appendChild(s)}
function auth(j){tsReset();if(j.need2fa){ACC.t2={ch:j.ch,to:j.to};ACC.busy=false;ACC.f.code='';return}if(j.error){toast(j.error);ACC.busy=false;return}ACC.t2=null;setMe(j);ACC.f={mode:'in'};ACC.busy=false;if(!unv())pull().then(friends);route()}
function field(id,label,type,ph,auto){return '<label class="fld"><span>'+label+'</span><input id="'+id+'" type="'+type+'" placeholder="'+(ph||'')+'" autocomplete="'+auto+'" value="'+esc(ACC.f[id]||'')+'" '+(type==='text'?'autocapitalize="none" spellcheck="false"':'')+'></label>'}
function html(){
 if(ACC.mode==='unknown')return '<div class="card"><p class="mute">Loading…</p></div>';
 if(!ACC.me)return '<div class="card"><p class="mute">Sign in to see friends and your league.</p></div>';
 if(ACC.me.needUsername)return '<div class="card acc"><h3>Pick a username</h3>'+field('username','Username','text','','username')+'<button class="btn" id="acu" style="width:100%">Save</button></div>';
 var fr=ACC.fr||{league:[],incoming:[],outgoing:[]},h='<div class="card"><div class="row">'+mascot(S.cos.on.av,'happy',48)+'<div style="flex:1"><b>'+esc(ACC.me.username)+'</b><div class="small mute">'+(ACC.last?'Saved to your account':'Syncs automatically')+'</div></div><button class="btn sec sm" data-so="1">Sign out</button></div></div>';
 h+='<div class="card"><h3>Add a friend</h3><div class="row"><input id="fru" class="grow" placeholder="Their username" autocapitalize="none" spellcheck="false"><button class="btn sm" id="fra">Add</button></div>'+(fr.incoming.length?'<div style="margin-top:10px">'+fr.incoming.map(function(x){return '<div class="row" style="padding:6px 0"><span style="flex:1"><b>'+esc(x.username)+'</b> wants to be friends</span><button class="btn sm" data-fa="'+esc(x.username)+'">Accept</button><button class="btn sec sm" data-fr="'+esc(x.username)+'" aria-label="Decline">×</button></div>'}).join('')+'</div>':'')+(fr.outgoing.length?'<p class="small mute" style="margin-top:8px">Waiting: '+fr.outgoing.map(function(x){return esc(x.username)}).join(', ')+'</p>':'')+'</div>';
 h+='<div class="card"><h3>This week</h3>'+(fr.league.length?fr.league.map(function(r,i){return '<div class="row lg'+(r.me?' me':'')+'"><span class="rk">'+(i+1)+'</span>'+mascot(r.av||'a0','happy',34,'c0')+'<span style="flex:1;min-width:0"><b>'+esc(r.username)+'</b><span class="small mute"> Lv '+(r.lv||1)+' · '+(r.st||0)+'d</span></span><b>'+r.wk+' XP</b>'+(r.me?'':'<button class="iconbtn" data-fr="'+esc(r.username)+'" aria-label="Remove friend">×</button>')+'</div>'}).join(''):'<p class="mute small">Add a friend to start a league.</p>')+'</div>';
 h+=secCard();h+=nCard();
 return h+'<p class="small mute" style="text-align:center"><a href="#" id="acd">Delete my account</a></p>'}

function secCard(){var m=ACC.me;if(!ACC.tf||!m||(!m.canTfa&&!m.tfa))return '';var st=ACC.s2&&ACC.s2.step;
 if(st==='code')return '<div class="card"><h3>Sign-in codes</h3><p class="small">We emailed a code to '+esc(ACC.s2.to||'you')+'. Enter it to turn this on.</p><div class="row"><input id="tfc" class="grow" inputmode="numeric" pattern="[0-9]*" maxlength="6" autocomplete="one-time-code" placeholder="123456" aria-label="6-digit code"><button class="btn sm" id="tfy">Confirm</button><button class="btn sec sm" id="tfx">Cancel</button></div></div>';
 if(st==='off')return '<div class="card"><h3>Sign-in codes</h3><p class="small">Enter your password to turn this off.</p><div class="row"><input id="tfp" class="grow" type="password" autocomplete="current-password" aria-label="Password"><button class="btn sm" id="tfo">Turn off</button><button class="btn sec sm" id="tfx">Cancel</button></div></div>';
 return '<div class="card"><h3>Sign-in codes (2-step)</h3><p class="small">'+(m.tfa?'On. After your password we email a 6-digit code, so a stolen password is not enough.':'Optional. After your password we email a 6-digit code, so a stolen password is not enough. Recommended for coaches and teachers.')+'</p><button class="btn sm'+(m.tfa?' sec':'')+'" id="'+(m.tfa?'tff':'tfn')+'">'+(m.tfa?'Turn off':'Turn on')+'</button></div>'}
var NT=null;function nCard(){if(NT===null){NT={load:1};api('GET','/notify').then(function(j){NT=j.error?{available:false}:j;if(cur==='me'&&sub.me==='friends')route()});return '<div class="card"><h3>Streak reminder email</h3><p class="small mute">Loading…</p></div>'}
 if(NT.load)return '';if(!NT.available)return '<div class="card"><h3>Streak reminder email</h3><p class="small mute">Not available on this site yet. Reminders on this device still work in Settings.</p></div>';
 var o='';for(var i=0;i<24;i++)o+='<option value="'+i+'"'+(i===NT.hr?' selected':'')+'>'+(i%12||12)+(i<12?' AM':' PM')+'</option>';
 return '<div class="card"><h3>Streak reminder email</h3><p class="small">One email at most per day, only if you have a streak and have not studied yet. It goes to '+esc(NT.email||'your account email')+'. Every email has a one-click unsubscribe link.</p><div class="row"><label class="small" for="ntr">Send at</label><select id="ntr">'+o+'</select><button class="btn sm'+(NT.on?' sec':'')+'" id="ntb">'+(NT.on?'Turn off':'Turn on')+'</button></div>'+(NT.on?'<p class="small mute">On. Time zone: '+esc(NT.tz||'')+'.</p>':'')+'</div>'}
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('#ntb');if(!b||!NT)return;var on=!NT.on,hr=+($('ntr')?$('ntr').value:NT.hr),tz='America/Los_Angeles';try{tz=Intl.DateTimeFormat().resolvedOptions().timeZone||tz}catch(x){}
 api('POST','/notify',{on:on,hr:hr,tz:tz}).then(function(j){if(j.error)return toast(j.error);NT.on=j.on;NT.hr=j.hr;NT.tz=j.tz;toast(j.on?'Reminder email on':'Reminder email off');route()})});
window.__ACC=ACC;window.vxLevel=function(){var t=ACC.xp&&ACC.xp.total;if(typeof t!=='number')return null;var l=0;while(t>=need(l+1))l++;return{l:l+1,total:t,packs:ACC.xp.packs}};
function pname(k){return /circuit/.test(k)?'Circuit Lab B':/meteor/.test(k)?'Meteorology B':/apex/.test(k)?'Apex Math':/quanta/.test(k)?'Quanta Physics':k}
function allCard(){var v=window.vxLevel&&vxLevel();if(!v)return '';var rows=Object.keys(v.packs).sort().map(function(k){return '<li><span>'+esc(pname(k))+'</span><b>'+(k===PK?Math.max(S.xp,v.packs[k]):v.packs[k])+' XP</b></li>'}).join('');return '<div class="card allx"><h3>All Voltaxis trainers</h3><p class="small mute">Your account shares progress, looks and streak across every trainer.</p><div class="row" style="gap:12px"><b style="font-size:1.6rem">Level '+v.l+'</b><span class="mute">'+v.total+' XP in total</span></div><ul class="allxl">'+rows+'</ul></div>'}
var _vm=viewMe;viewMe=function(){var h=_vm();if(sub.me==='profile')h=allCard()+h;if(sub.me!=='friends'||ACC.mode==='none')return h;return seg([['profile','Profile'],['shop','Shop'],['friends','Friends'],['settings','Settings']],'me')+html()};
var _am=afterMe;afterMe=function(){_am.apply(this,arguments);if(sub.me==='friends'&&ACC.mode==='out'&&ACC.g&&window.google&&$('gbtn')&&!$('gbtn').firstChild){google.accounts.id.initialize({client_id:ACC.g,callback:function(r){api('POST','/google',{credential:r.credential}).then(auth)},ux_mode:'popup'});google.accounts.id.renderButton($('gbtn'),{theme:'outline',size:'large',shape:'pill',width:280})}};
document.addEventListener('input',function(e){var t=e.target;if(t.closest&&t.closest('.acc')&&t.id)ACC.f[t.id]=t.value;if(t.id==='password'&&document.getElementById('pwr'))document.getElementById('pwr').innerHTML=pwList(t.value)});
document.addEventListener('keydown',function(e){if(e.key==='Enter'&&e.target.closest&&e.target.closest('.acc')){var b=$('acg')||$('acu')||$('acv')||$('act');if(b)b.click()}if(e.key==='Enter'&&e.target.id==='fru')$('fra').click()});
document.addEventListener('click',function(e){var t=e.target,b=t.closest&&t.closest('button,a');if(!b)return;
 if(b.dataset.am){ACC.f.mode=b.dataset.am;route();gate();return}
 if(b.id==='tsr'){var o=document.getElementById('cfts');if(o)o.remove();window.turnstile=undefined;var m=document.getElementById('tsm');if(m)m.textContent='Loading the security check…';tsInit();return}
 if(b.id==='acg'&&!ACC.busy){ACC.busy=true;var up=ACC.f.mode==='up';api('POST',up?'/signup':'/login',up?{email:ACC.f.email,username:ACC.f.username,password:ACC.f.password,cf:ACC.cf}:{id:ACC.f.email,password:ACC.f.password,cf:ACC.cf}).then(function(j){ACC.f.password='';auth(j)});return}
 if(b.id==='acv'&&!ACC.busy){ACC.busy=true;api('POST','/verify',{code:ACC.f.code}).then(function(j){ACC.busy=false;if(j.error)return toast(j.error);ACC.f.code='';return api('GET','/me').then(function(m){if(m.username!==undefined){setMe(m);toast('Email confirmed');pull().then(friends).then(loadXp);route();gate()}})});return}
 if(b.id==='acr'){api('POST','/verify/resend').then(function(j){toast(j.error||'New code sent')});return}
 if(b.id==='act'&&!ACC.busy&&ACC.t2){ACC.busy=true;api('POST','/login/2fa',{ch:ACC.t2.ch,code:ACC.f.code}).then(function(j){ACC.busy=false;if(j.error)return toast(j.error);auth(j)});return}
 if(b.id==='acb'){ACC.t2=null;ACC.f.code='';gate();return}
 if(b.id==='tfn'){api('POST','/2fa/start').then(function(j){if(j.error)return toast(j.error);ACC.s2={step:'code',to:j.to};route()});return}
 if(b.id==='tfx'){ACC.s2=null;route();return}
 if(b.id==='tfy'){api('POST','/2fa/confirm',{code:($('tfc')||{}).value}).then(function(j){if(j.error)return toast(j.error);ACC.me.tfa=true;ACC.s2=null;toast('Sign-in codes are on');route()});return}
 if(b.id==='tff'){ACC.s2={step:'off'};route();return}
 if(b.id==='tfo'){api('POST','/2fa/off',{password:($('tfp')||{}).value}).then(function(j){if(j.error)return toast(j.error);ACC.me.tfa=false;ACC.s2=null;toast('Sign-in codes are off');route()});return}
 if(b.id==='acu'){api('POST','/username',{username:ACC.f.username}).then(function(j){if(j.error)return toast(j.error);ACC.me.username=j.username;ACC.me.needUsername=false;push(true);friends();route()});return}
 if(b.id==='aco'||b.dataset.so){api('POST','/logout').then(function(){ACC.me=null;ACC.fr=null;NT=null;ACC.mode='out';ACC.f={mode:'in'};loadG();route();gate()});return}
 if(b.id==='acd'){e.preventDefault();window.askOk('Delete your account?','Your cloud save is deleted. Progress on this device stays.','Delete',function(){api('POST','/delete').then(function(){ACC.me=null;ACC.fr=null;ACC.mode='out';route();toast('Account deleted')})});return}
 if(b.id==='fra'){var u=($('fru').value||'').trim().toLowerCase();if(u)api('POST','/friends/request',{username:u}).then(function(j){toast(j.error||'Request sent');friends()});return}
 if(b.dataset.fa){api('POST','/friends/accept',{username:b.dataset.fa}).then(function(j){if(!j.error){ACC.fr=j;route()}});return}
 if(b.dataset.fr){var fu=b.dataset.fr;window.askOk('Remove '+fu+'?','You can add them again later.','Remove',function(){api('POST','/friends/remove',{username:fu}).then(function(j){if(!j.error){ACC.fr=j;route()}})});return}});
document.addEventListener('visibilitychange',function(){if(document.visibilityState==='hidden')push(true)});
/* --- instant friend requests + username suggestions --- */
var known=null,timer=0,nSeen=-1;
function signed(){return ACC.mode==='in'&&ACC.me&&ACC.me.username}
function norm(u){return String(u||'').trim().toLowerCase().replace(/^@/,'').replace(/\s+/g,'').replace(/[^a-z0-9_]/g,'')}
function banner(names){var old=document.getElementById('frq');if(old)old.remove();if(!names.length)return;var d=document.createElement('div');d.id='frq';d.setAttribute('role','alert');
 d.innerHTML='<div class="frqt"><b>'+esc(names[0])+'</b>'+(names.length>1?' and '+(names.length-1)+' more want':' wants')+' to be friends</div><div class="frqb"><button class="btn sm" data-qa="'+esc(names[0])+'">Accept</button><button class="btn sm sec" data-qd="1">Later</button></div>';document.body.appendChild(d)}
function ping(){if(!signed()||document.visibilityState!=='visible')return;api('GET','/friends/ping').then(function(j){if(!j||j.error||!j.inc)return;var inc=j.inc,first=known===null;
  if(!first){var fresh=inc.filter(function(n){return known.indexOf(n)<0});if(fresh.length)banner(inc);}
  if(first&&inc.length)banner(inc);
  var changed=first||inc.join()!==known.join()||(nSeen>=0&&j.n!==nSeen);known=inc;nSeen=j.n;
  if(changed)friends();
  if(!inc.length){var b=document.getElementById('frq');if(b)b.remove()}})}
function loop(){clearInterval(timer);timer=setInterval(ping,10000)}
document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible')ping()});
window.addEventListener('focus',ping);window.addEventListener('online',ping);
setTimeout(function(){loop();ping()},3000);
document.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('[data-qa],[data-qd],[data-sg]');if(!t)return;
 if(t.dataset.qa){api('POST','/friends/accept',{username:t.dataset.qa}).then(function(j){if(!j.error){ACC.fr=j;known=(j.incoming||[]).map(function(x){return x.username});toast('You and '+t.dataset.qa+' are friends');banner(known);route()}});return}
 if(t.dataset.qd){var b=document.getElementById('frq');if(b)b.remove();return}
 if(t.dataset.sg){var i=document.getElementById('fru');if(i){i.value=t.dataset.sg;i.focus()}var s=document.getElementById('frsug');if(s)s.innerHTML=''}});
var st=0;
document.addEventListener('input',function(e){if(!e.target||e.target.id!=='fru')return;var i=e.target,q=norm(i.value);clearTimeout(st);var box=document.getElementById('frsug');if(!box){box=document.createElement('div');box.id='frsug';box.className='segs';box.setAttribute('aria-live','polite');i.parentNode.parentNode.insertBefore(box,i.parentNode.nextSibling)}
 if(q.length<3){box.innerHTML='';return}
 st=setTimeout(function(){api('GET','/friends/suggest?q='+encodeURIComponent(q)).then(function(j){var cur=norm(i.value);if(cur!==q||!j||!j.names)return;box.innerHTML=j.names.length?'<span class="small mute" style="align-self:center">Did you mean</span>'+j.names.map(function(n){return '<button type="button" class="seg" data-sg="'+esc(n)+'">'+esc(n)+'</button>'}).join(''):''})},250)});
/* clean the typed name before it is sent */
var _fetchNorm=true;document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('#fra');if(!b)return;var i=document.getElementById('fru');if(i)i.value=norm(i.value)},true);

/* --- sign-in gate: the trainer is only usable while signed in. The session lasts until the browser closes (or 8 h). --- */
var GN=(P.meta&&(P.meta.short||P.meta.title||P.meta.name))||'your trainer';
function codeField(id,label){return '<label class="fld"><span>'+label+'</span><input id="'+id+'" type="text" inputmode="numeric" pattern="[0-9]*" maxlength="6" autocomplete="one-time-code" placeholder="123456" value="'+esc(ACC.f[id]||'')+'"></label>'}
function maskE(e){var p=String(e||'').split('@');return p.length<2?'your email':p[0].slice(0,2)+'***@'+p[1]}
function gateHtml(){var up=ACC.f.mode==='up';
 if(ACC.mode==='unknown')return '<div class="gcard"><p class="mute" role="status">Checking your sign-in…</p></div>';
 if(ACC.me&&ACC.me.verified===false)return '<form class="gcard acc" novalidate aria-labelledby="gt"><h2 id="gt">Check your email</h2><p class="small mute">We sent a 6-digit code to <b>'+esc(maskE(ACC.me.email))+'</b>. It works for 10 minutes. Check spam if you do not see it.</p>'+codeField('code','6-digit code')+'<button class="btn" id="acv" type="button">Confirm email</button><p class="small gsw"><button type="button" class="lnk" id="acr">Send a new code</button> · <button type="button" class="lnk" data-so="1">Sign out</button></p></form>';
 if(ACC.t2)return '<form class="gcard acc" novalidate aria-labelledby="gt"><h2 id="gt">Enter your sign-in code</h2><p class="small mute">We emailed a 6-digit code to <b>'+esc(ACC.t2.to||'your email')+'</b>. It works for 10 minutes.</p>'+codeField('code','6-digit code')+'<button class="btn" id="act" type="button">Sign in</button><p class="small gsw"><button type="button" class="lnk" id="acb">Back</button></p></form>';
 if(ACC.me&&ACC.me.needUsername)return '<form class="gcard acc" novalidate><h2 id="gt">Pick a username</h2><p class="small mute">Friends find you by this name.</p>'+field('username','Username','text','','username')+'<button class="btn" id="acu" type="button">Save</button></form>';
 return '<form class="gcard acc" novalidate aria-labelledby="gt"><img class="gico" src="icon.svg" width="56" height="56" alt=""><h2 id="gt">'+(up?'Create your account':'Sign in')+'</h2><p class="small mute">'+(up?'Free. You must be 13 or older.':'Sign in to open '+esc(GN)+'. You will sign in again next time you open it.')+'</p>'+
  (up?field('email','Email','email','','email')+field('username','Username','text','','username'):field('email','Email or username','text','','username'))+field('password','Password','password',up?'12+ characters':'',up?'new-password':'current-password')+(up?'<ul class="pwr" id="pwr" aria-label="Password rules">'+pwList(ACC.f.password)+'</ul>':'')+(ACC.ts?'<div id="ts" class="tsw"></div><p id="tsm" class="small mute" role="status"></p>':'')+
  '<button class="btn" id="acg" type="button">'+(up?'Create account':'Sign in')+'</button>'+(ACC.g?'<div class="or"><span>or</span></div><div id="gbtn" class="gbtnw"></div>':'')+
  '<p class="small gsw">'+(up?'Already have an account? <button type="button" class="lnk" data-am="in">Sign in</button>':'New here? <button type="button" class="lnk" data-am="up">Create an account</button>')+'</p></form>'}
function gate(){var need=location.protocol!=='file:'&&(ACC.mode==='unknown'||ACC.mode==='out'||(ACC.me&&(ACC.me.needUsername||ACC.me.verified===false))),g=document.getElementById('gate');
 if(!need){if(g){g.remove();[].forEach.call(document.body.children,function(n){n.removeAttribute('inert')})}return}
 if(!g){g=document.createElement('div');g.id='gate';g.setAttribute('role','dialog');g.setAttribute('aria-modal','true');g.setAttribute('aria-label','Sign in');document.body.appendChild(g)}
 [].forEach.call(document.body.children,function(n){if(n!==g&&n.tagName!=='SCRIPT')n.setAttribute('inert','')})
 var act=document.activeElement&&document.activeElement.id,pos=null;try{pos=document.activeElement.selectionStart}catch(e){}
 g.innerHTML=gateHtml();if(ACC.mode==='out'&&!ACC.t2)tsInit();
 if(ACC.mode==='out'&&ACC.g&&window.google&&document.getElementById('gbtn')){google.accounts.id.initialize({client_id:ACC.g,callback:function(r){api('POST','/google',{credential:r.credential}).then(auth)},ux_mode:'popup'});google.accounts.id.renderButton(document.getElementById('gbtn'),{theme:'outline',size:'large',shape:'pill',width:280})}
 var f=(act&&document.getElementById(act))||g.querySelector('input');if(f&&ACC.mode!=='unknown'){f.focus();try{if(pos!=null)f.setSelectionRange(pos,pos)}catch(e){}}}
var _auth=auth;auth=function(j){_auth(j);gate()};
document.addEventListener('keydown',function(e){if(e.key==='Tab'){var g=document.getElementById('gate');if(!g)return;var el=[].filter.call(g.querySelectorAll('input,button,a[href],iframe'),function(x){return !x.disabled&&x.offsetParent});if(!el.length)return;var f=el[0],l=el[el.length-1];if(e.shiftKey&&document.activeElement===f){e.preventDefault();l.focus()}else if(!e.shiftKey&&document.activeElement===l){e.preventDefault();f.focus()}}});
/* show the gate straight away on the web so protected screens never flash, then follow the server's answer */
if(location.protocol!=='file:')gate();
var _boot=boot;boot=function(){_boot();var t=setInterval(function(){gate();if(ACC.mode!=='unknown'){clearInterval(t)}},150)};

boot();
})();
