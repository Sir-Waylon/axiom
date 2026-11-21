/* ===== accounts: email/password + Google sign-in, native friends by username, weekly league, cloud save ===== */
(function(){
var ACC={mode:'unknown',me:null,csrf:'',f:{mode:'in'},fr:null,g:null,busy:false,last:0},PK=P.meta.id;
function ck(n){var m=document.cookie.split('; ').filter(function(c){return c.indexOf(n+'=')===0})[0];return m?m.slice(n.length+1):''}
function api(m,p,b){return fetch('/api'+p,{method:m,credentials:'same-origin',headers:{'content-type':'application/json','x-csrf':ACC.csrf||ck('__Host-csrf')},body:m==='POST'?JSON.stringify(b||{}):undefined}).then(function(r){return r.json().catch(function(){return {error:'Server unavailable'}}).then(function(j){j.__s=r.status;return j})})}
function setMe(j){ACC.me=j;ACC.mode='in';ACC.csrf=j.csrf||ACC.csrf;mergeShared(j.shared);}
function mergeShared(sh){if(!sh)return;var ch=0;if(sh.days)for(var k in sh.days)if(/^\d{4}-\d{2}-\d{2}$/.test(k)&&!S.days[k]){S.days[k]=1;ch=1}
 if(sh.cos&&sh.cos.own)for(var c in sh.cos.own)if(/^[a-z]\d{1,2}$/.test(c)&&!S.cos.own[c]){S.cos.own[c]=1;ch=1}if(ch)save()}
function pull(){return api('GET','/save?pack='+encodeURIComponent(PK)).then(function(j){if(j.state&&typeof j.state.xp==='number'&&j.state.xp>S.xp){var keep={cos:S.cos,days:S.days};try{doRestore(j.state)}catch(e){}mergeShared({days:keep.days,cos:keep.cos})}push(true)})}
function loadXp(){if(ACC.mode!=='in'||!ACC.me)return Promise.resolve();return api('GET','/xp').then(function(j){if(j&&typeof j.total==='number'){var t=j.total,mine=PK in j.packs?j.packs[PK]:0;if(S.xp>mine)t+=S.xp-mine;ACC.xp={total:t,packs:j.packs};try{hud&&hud()}catch(e){}}})}
var lastRef=0;function refresh(){if(ACC.mode!=='in'||!ACC.me||Date.now()-lastRef<45000)return;lastRef=Date.now();api('GET','/me').then(function(j){if(j&&j.username){setMe(j);return pull()}}).then(loadXp).then(function(){try{route()}catch(e){}})}
document.addEventListener('visibilitychange',function(){if(!document.hidden)refresh()});window.addEventListener('focus',refresh);
var pt=null;function push(now){if(ACC.mode!=='in'||!ACC.me||!ACC.me.username)return;clearTimeout(pt);pt=setTimeout(function(){var st;try{st=JSON.parse(JSON.stringify(S))}catch(e){return}delete st.rs;api('POST','/sync',{pack:PK,state:st,shared:{days:S.days,cos:{own:S.cos.own,on:S.cos.on}},pub:{av:S.cos.on.av,lv:lvInfo().l,st:dayStreak()}}).then(function(j){if(j.ok){ACC.last=Date.now();if(now)loadXp()}else if(j.error&&j.__s!==401&&j.__s!==0)toast(j.error)})},now?0:4000)}
var _sv=save;save=function(){var r=_sv.apply(this,arguments);push();return r};
function friends(){return api('GET','/friends').then(function(j){if(!j.error){ACC.fr=j;if(cur==='me'&&sub.me==='friends')route()}})}
function boot(){fetch('/api/config',{credentials:'same-origin'}).then(function(r){if(!r.ok||!/json/.test(r.headers.get('content-type')||''))throw 0;return r.json()}).then(function(c){ACC.g=c.google;return api('GET','/me')}).then(function(j){if(j.__s===200){setMe(j);pull().then(friends)}else if(j.__s===401){ACC.mode='out';loadG()}else throw 0;if(cur==='me')route()}).catch(function(){ACC.mode='none'})}
function loadG(){if(!ACC.g||window.google||document.getElementById('gsi'))return;var s=document.createElement('script');s.id='gsi';s.src='https://accounts.google.com/gsi/client';s.async=true;s.onload=function(){gate();if(cur==='me'&&sub.me==='friends')afterMe()};document.head.appendChild(s)}
function auth(j){if(j.error){toast(j.error);ACC.busy=false;return}setMe(j);ACC.f={mode:'in'};ACC.busy=false;pull().then(friends);route()}
function field(id,label,type,ph,auto){return '<label class="fld"><span>'+label+'</span><input id="'+id+'" type="'+type+'" placeholder="'+(ph||'')+'" autocomplete="'+auto+'" value="'+esc(ACC.f[id]||'')+'" '+(type==='text'?'autocapitalize="none" spellcheck="false"':'')+'></label>'}
function html(){
 if(ACC.mode==='unknown')return '<div class="card"><p class="mute">Loading…</p></div>';
 if(!ACC.me)return '<div class="card"><p class="mute">Sign in to see friends and your league.</p></div>';
 if(ACC.me.needUsername)return '<div class="card acc"><h3>Pick a username</h3>'+field('username','Username','text','','username')+'<button class="btn" id="acu" style="width:100%">Save</button></div>';
 var fr=ACC.fr||{league:[],incoming:[],outgoing:[]},h='<div class="card"><div class="row">'+mascot(S.cos.on.av,'happy',48)+'<div style="flex:1"><b>'+esc(ACC.me.username)+'</b><div class="small mute">'+(ACC.last?'Saved to your account':'Syncs automatically')+'</div></div><button class="btn sec sm" data-so="1">Sign out</button></div></div>';
 h+='<div class="card"><h3>Add a friend</h3><div class="row"><input id="fru" class="grow" placeholder="Their username" autocapitalize="none" spellcheck="false"><button class="btn sm" id="fra">Add</button></div>'+(fr.incoming.length?'<div style="margin-top:10px">'+fr.incoming.map(function(x){return '<div class="row" style="padding:6px 0"><span style="flex:1"><b>'+esc(x.username)+'</b> wants to be friends</span><button class="btn sm" data-fa="'+esc(x.username)+'">Accept</button><button class="btn sec sm" data-fr="'+esc(x.username)+'" aria-label="Decline">×</button></div>'}).join('')+'</div>':'')+(fr.outgoing.length?'<p class="small mute" style="margin-top:8px">Waiting: '+fr.outgoing.map(function(x){return esc(x.username)}).join(', ')+'</p>':'')+'</div>';
 h+='<div class="card"><h3>This week</h3>'+(fr.league.length?fr.league.map(function(r,i){return '<div class="row lg'+(r.me?' me':'')+'"><span class="rk">'+(i+1)+'</span>'+mascot(r.av||'a0','happy',34,'c0')+'<span style="flex:1;min-width:0"><b>'+esc(r.username)+'</b><span class="small mute"> Lv '+(r.lv||1)+' · '+(r.st||0)+'d</span></span><b>'+r.wk+' XP</b>'+(r.me?'':'<button class="iconbtn" data-fr="'+esc(r.username)+'" aria-label="Remove friend">×</button>')+'</div>'}).join(''):'<p class="mute small">Add a friend to start a league.</p>')+'</div>';
 h+=nCard();
 return h+'<p class="small mute" style="text-align:center"><a href="#" id="acd">Delete my account</a></p>'}

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
document.addEventListener('input',function(e){var t=e.target;if(t.closest&&t.closest('.acc')&&t.id)ACC.f[t.id]=t.value});
document.addEventListener('keydown',function(e){if(e.key==='Enter'&&e.target.closest&&e.target.closest('.acc')){var b=$('acg')||$('acu');if(b)b.click()}if(e.key==='Enter'&&e.target.id==='fru')$('fra').click()});
document.addEventListener('click',function(e){var t=e.target,b=t.closest&&t.closest('button,a');if(!b)return;
 if(b.dataset.am){ACC.f.mode=b.dataset.am;route();gate();return}
 if(b.id==='acg'&&!ACC.busy){ACC.busy=true;var up=ACC.f.mode==='up';api('POST',up?'/signup':'/login',up?{email:ACC.f.email,username:ACC.f.username,password:ACC.f.password}:{id:ACC.f.email,password:ACC.f.password}).then(function(j){ACC.f.password='';auth(j)});return}
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
function gateHtml(){var up=ACC.f.mode==='up';
 if(ACC.mode==='unknown')return '<div class="gcard"><p class="mute" role="status">Checking your sign-in…</p></div>';
 if(ACC.me&&ACC.me.needUsername)return '<form class="gcard acc" novalidate><h2 id="gt">Pick a username</h2><p class="small mute">Friends find you by this name.</p>'+field('username','Username','text','','username')+'<button class="btn" id="acu" type="button">Save</button></form>';
 return '<form class="gcard acc" novalidate aria-labelledby="gt"><h2 id="gt">'+(up?'Create your account':'Sign in')+'</h2><p class="small mute">'+(up?'Free. You must be 13 or older.':'Sign in to open '+esc(GN)+'. You will sign in again next time you open it.')+'</p>'+
  (up?field('email','Email','email','','email')+field('username','Username','text','','username'):field('email','Email or username','text','','username'))+field('password','Password','password',up?'10+ characters':'','current-password')+
  '<button class="btn" id="acg" type="button">'+(up?'Create account':'Sign in')+'</button>'+(ACC.g?'<div class="or"><span>or</span></div><div id="gbtn" class="gbtnw"></div>':'')+
  '<p class="small gsw">'+(up?'Already have an account? <button type="button" class="lnk" data-am="in">Sign in</button>':'New here? <button type="button" class="lnk" data-am="up">Create an account</button>')+'</p></form>'}
function gate(){var need=location.protocol!=='file:'&&(ACC.mode==='unknown'||ACC.mode==='out'||(ACC.me&&ACC.me.needUsername)),g=document.getElementById('gate');
 if(!need){if(g){g.remove();[].forEach.call(document.body.children,function(n){n.removeAttribute('inert')})}return}
 if(!g){g=document.createElement('div');g.id='gate';g.setAttribute('role','dialog');g.setAttribute('aria-modal','true');g.setAttribute('aria-label','Sign in');document.body.appendChild(g)}
 [].forEach.call(document.body.children,function(n){if(n!==g&&n.tagName!=='SCRIPT')n.setAttribute('inert','')})
 var act=document.activeElement&&document.activeElement.id,pos=null;try{pos=document.activeElement.selectionStart}catch(e){}
 g.innerHTML=gateHtml();
 if(ACC.mode==='out'&&ACC.g&&window.google&&document.getElementById('gbtn')){google.accounts.id.initialize({client_id:ACC.g,callback:function(r){api('POST','/google',{credential:r.credential}).then(auth)},ux_mode:'popup'});google.accounts.id.renderButton(document.getElementById('gbtn'),{theme:'outline',size:'large',shape:'pill',width:280})}
 var f=(act&&document.getElementById(act))||g.querySelector('input');if(f&&ACC.mode!=='unknown'){f.focus();try{if(pos!=null)f.setSelectionRange(pos,pos)}catch(e){}}}
var _auth=auth;auth=function(j){_auth(j);gate()};
document.addEventListener('keydown',function(e){if(e.key==='Tab'){var g=document.getElementById('gate');if(!g)return;var el=[].filter.call(g.querySelectorAll('input,button,a[href]'),function(x){return !x.disabled&&x.offsetParent});if(!el.length)return;var f=el[0],l=el[el.length-1];if(e.shiftKey&&document.activeElement===f){e.preventDefault();l.focus()}else if(!e.shiftKey&&document.activeElement===l){e.preventDefault();f.focus()}}});
/* show the gate straight away on the web so protected screens never flash, then follow the server's answer */
if(location.protocol!=='file:')gate();
var _boot=boot;boot=function(){_boot();var t=setInterval(function(){gate();if(ACC.mode!=='unknown'){clearInterval(t)}},150)};

boot();
})();
