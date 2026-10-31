/* ===== app shell, views, fx ===== */
var UN=P.units||[],ALL=P.topics.map(function(t){return t.id}),cur='learn',sub={lib:'notes',me:'profile'};
if(!S.cos)S.cos={own:{},on:{av:'a0',th:'t0',ti:'i0',ac:'c0'}};if(!S.cos.on.ac)S.cos.on.ac='c0';
if(!S.un)S.un={};if(!S.fr)S.fr={};if(!S.nm)S.nm='';if(!S.theme)S.theme='auto';if(!S.lr)S.lr={};
var IC={learn:'<path d="M4 6l8-3 8 3v6c0 4-3.5 7-8 9-4.5-2-8-5-8-9z"/><path d="M9 12l2 2 4-4"/>',practice:'<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',library:'<path d="M4 4h6a2 2 0 012 2v14a2 2 0 00-2-2H4zM20 4h-6a2 2 0 00-2 2v14a2 2 0 012-2h6z"/>',me:'<circle cx="12" cy="8" r="4"/><path d="M4 21c1-5 4-7 8-7s7 2 8 7"/>'};
var TABS=[['learn','Learn'],['practice','Practice'],['library','Library'],['me','Me']];
var A11={};try{A11=JSON.parse(localStorage.getItem('scioly:ui')||'{}')}catch(e){}
function svgi(p,s){return '<svg width="'+(s||24)+'" height="'+(s||24)+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+p+'</svg>'}
/* ---------- shell ---------- */
(function(){
 document.body.insertAdjacentHTML('afterbegin','<div id="shell"><header class="bar"><div class="bar-in"><div class="brand"><span class="logo"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h5l2-6 4 12 3-9 2 3h4"/></svg></span><div><small id="org"></small><b id="ttl"></b></div></div><span class="sp"></span><span class="saved" id="svd">Saved</span><span class="chip" title="Day streak">'+'<svg viewBox="0 0 16 16" fill="#ff9a1f"><path d="M8 1c1 3 4 4 4 8a4 4 0 01-8 0c0-2 1-3 2-4 0 2 1 2 1 1 0-2 0-3 1-5z"/></svg><span id="hst">0</span></span><span class="chip" title="Coins"><svg viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" fill="#f2b705"/><circle cx="8" cy="8" r="4.5" fill="none" stroke="#a87a10" stroke-width="1.3"/></svg><span id="hco">0</span></span><button class="lvring" id="lvr" aria-label="Level"><span id="lvn">1</span></button><button class="iconbtn" id="thm" aria-label="Light or dark mode"></button></div></header><nav class="nav" id="nav" aria-label="Sections"></nav><main id="main"></main></div>');
 $('ttl').textContent=P.meta.title+' '+P.meta.division;$('org').textContent=P.meta.org+' · '+P.meta.year;
 $('nav').innerHTML=TABS.map(function(t){return '<button data-t="'+t[0]+'">'+svgi(IC[t[0]])+'<span>'+t[1]+'</span></button>'}).join('')})();
function hud(){var L=lvInfo();$('lvn').textContent=L.l;$('lvr').style.setProperty('--p',L.pct);$('lvr').title='Level '+L.l+' · '+L.name+' · '+L.to+' XP to next';$('hst').textContent=dayStreak();$('hco').textContent=S.coins;
 var th=$('thm');if(th)th.innerHTML=isDark()?svgi('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5"/>',22):svgi('<path d="M21 13A9 9 0 1111 3a7 7 0 0010 10z"/>',22)}
var _sv=save;save=function(){_sv();var e=$('svd');if(e){e.classList.add('on');clearTimeout(save.t);save.t=setTimeout(function(){e.classList.remove('on')},1200)}};
function isDark(){var t=S.theme;return t==='dark'||(t==='auto'&&window.matchMedia&&matchMedia('(prefers-color-scheme:dark)').matches)}
function applyTheme(){document.documentElement.setAttribute('data-theme',S.theme||'auto')}
function applyCos(){var t=TH.filter(function(x){return x[0]===S.cos.on.th})[0]||TH[0],r=document.documentElement.style;r.setProperty('--pri',t[3]);r.setProperty('--pri-soft','color-mix(in srgb,'+t[3]+' 14%,var(--surface))')}
function applyUI(){var c=document.documentElement.classList;c.toggle('xl',A11.xl==1);c.toggle('xxl',A11.xl==2);c.toggle('rm',!!A11.rm);c.toggle('hc',!!A11.hc);c.toggle('dys',!!A11.dys);c.toggle('focus',!!A11.focus)}
function saveUI(){try{localStorage.setItem('scioly:ui',JSON.stringify(A11))}catch(e){}applyUI()}
function route(){
 [].forEach.call(document.querySelectorAll('#nav button'),function(b){b.setAttribute('aria-current',b.dataset.t===cur?'true':'false')});
 var m=$('main');m.className='view-in';m.innerHTML=({learn:viewLearn,practice:viewPractice,library:viewLibrary,me:viewMe})[cur]();
 var f=({library:afterLibrary,me:afterMe})[cur];if(f)f();window.scrollTo(0,0)}
function go(t){cur=t;route()}
/* ---------- FX ---------- */
function burst(big){if(A11.rm)return;var cols=['#5b4bff','#12935f','#f0a000','#d33f4f','#0f8fd8','#c43b8a'],n=big?46:16,cx=innerWidth/2,cy=big?innerHeight*.35:innerHeight*.6;
 for(var i=0;i<n;i++){var d=document.createElement('i');d.className='cf';d.style.left=cx+'px';d.style.top=cy+'px';d.style.background=cols[i%cols.length];var a=Math.random()*Math.PI*2,r=(big?220:130)*(.4+Math.random());d.style.setProperty('--dx',Math.cos(a)*r+'px');d.style.setProperty('--dy',(Math.sin(a)*r-60)+'px');d.style.setProperty('--rot',(Math.random()*720-360)+'deg');document.body.appendChild(d);setTimeout(function(x){x.remove()},1200,d)}}
function xpFloat(g){if(!g||A11.rm)return;var d=document.createElement('div');d.className='xpf';d.textContent='+'+g+' XP';d.style.left=(innerWidth/2-30)+'px';d.style.top=(innerHeight-190)+'px';document.body.appendChild(d);setTimeout(function(){d.remove()},1000)}
function levelUp(){var L=lvInfo();burst(true);var m=document.createElement('div');m.className='modal';m.innerHTML='<div class="card">'+mascot(S.cos.on.av,'cheer',96)+'<h2>Level '+L.l+'</h2><p class="mute">'+esc(L.name)+'</p><button class="btn" id="lvok">Keep going</button></div>';document.body.appendChild(m);m.querySelector('#lvok').onclick=function(){m.remove()}}
/* ---------- Learn ---------- */
function unitState(u){var us=S.un[u.id]||{d:{}},done=u.lessons.filter(function(L){return us.d[L.id]}).length;return{us:us,done:done,all:done===u.lessons.length,pass:!!us.pass}}
function nextLesson(){for(var i=0;i<UN.length;i++){var u=UN[i],us=S.un[u.id]||{d:{}};for(var j=0;j<u.lessons.length;j++)if(!us.d[u.lessons[j].id])return{u:u,L:u.lessons[j],i:i}}return null}
function greetOld(){var dx=S.dxp[today()]||0,st=dayStreak(),nl=nextLesson(),m;
 if(!S.total)m='Hi, I am '+avOf(S.cos.on.av)[1]+'. Start with the first lesson.';else if(dx>=60)m='Daily goal done. Anything extra is bonus XP.';else if(st>=3)m=st+' days in a row. Keep it going.';else m=(60-dx)+' XP to reach today\'s goal.';
 return '<div class="hero">'+mascot(S.cos.on.av,dx>=60?'cheer':'happy',76)+'<div class="bubble">'+esc(m)+'</div></div>'}
function viewLearn(){
 var curSet=0,h=greet(),nl=nextLesson();
 if(nl)h+='<div class="cont"><div style="flex:1"><div class="small" style="opacity:.85">Unit '+(nl.i+1)+' · '+esc(nl.u.title)+'</div><h2>'+esc(nl.L.title)+'</h2></div><button class="btn" data-ls="'+nl.u.id+'|'+nl.L.id+'">Start</button></div>';
 UN.forEach(function(u,i){var s=unitState(u),prevOk=i===0||unitState(UN[i-1]).all||(unitState(UN[i-1]).done>0),m=mastery(u.id);
  var isCur=!s.all&&!curSet;if(isCur)curSet=1;
  h+='<details class="unit"'+(isCur?' open':'')+'><summary class="unit-h"><span class="n">'+(i+1)+'</span><div style="flex:1;min-width:0"><h3>'+esc(u.title)+'</h3><div class="small mute">'+s.done+'/'+u.lessons.length+' lessons'+(s.us.best?' · test '+s.us.best+'%':'')+'</div></div>'+(s.pass?'<span class="tag ok">Passed</span>':'<span class="tag">'+MN[m.lv]+'</span>')+'</summary><div class="lessons">';
  var firstOpen=true;u.lessons.forEach(function(L,k){var d=!!s.us.d[L.id],cu=!d&&firstOpen;if(!d)firstOpen=false;
   h+='<button class="node '+(d?'done':cu?'cur':'')+'" data-ls="'+u.id+'|'+L.id+'" title="'+esc(L.title)+'" aria-label="Lesson '+(k+1)+': '+esc(L.title)+'">'+(d?svgi('<path d="M5 12l5 5 9-10"/>',26):(k+1))+'</button>'});
  h+='<button class="node test '+(s.pass?'done':'')+'" data-ut="'+u.id+'" title="Unit test" aria-label="Unit test">'+svgi('<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',26)+'</button></div></details>'});
 return h}
document.addEventListener('click',function(e){
 var l=e.target.closest('[data-ls]');if(l){var p=l.dataset.ls.split('|');startLesson(p[0],p[1]);return}
 var ut=e.target.closest('[data-ut]');if(ut){var u=UN.filter(function(x){return x.id===ut.dataset.ut})[0];if(unitState(u).all||confirm('Take the test before finishing all lessons?'))startUnitTest(ut.dataset.ut);return}
 var tb=e.target.closest('#nav button');if(tb){go(tb.dataset.t);return}
 if(e.target.closest('#thm')){S.theme=isDark()?'light':'dark';applyTheme();save();hud();return}
 if(e.target.closest('#lvr')){sub.me='profile';go('me');return}
});
/* ---------- Practice ---------- */
var pSel=null;
function viewPractice(){
 if(!pSel)pSel=ALL.slice();var miss=Object.keys(S.miss).filter(function(id){return QI[id]!==undefined}).length;
 var h='<h2 style="margin-bottom:12px">Practice</h2><div class="grid">'+
 '<button class="card" data-pm="quick" style="text-align:left"><h3>Adaptive</h3><p class="small mute">Gets harder as you get it right</p></button>'+
 '<button class="card" data-pm="blitz" style="text-align:left"><h3>Blitz</h3><p class="small mute">60 seconds, go fast</p></button>'+
 '<button class="card" data-pm="mock" style="text-align:left"><h3>Mock test</h3><p class="small mute">30 questions, timed</p></button>'+
 '<button class="card" data-pm="review" style="text-align:left'+(miss?'':';opacity:.5')+'"><h3>Review</h3><p class="small mute">'+miss+' to fix</p></button>'+
 '<button class="card" data-pm="match" style="text-align:left"><h3>Match</h3><p class="small mute">Pair terms fast</p></button></div>'+
 '<details style="margin-top:14px"><summary>Topics ('+pSel.length+'/'+ALL.length+')</summary><div class="chips" style="margin-top:10px">'+P.topics.map(function(t){return '<label class="ch" style="display:flex;gap:6px;align-items:center"><input type="checkbox" class="tc" value="'+t.id+'"'+(pSel.indexOf(t.id)>-1?' checked':'')+'>'+esc(t.name)+'</label>'}).join('')+'</div></details>';
 return h}
document.addEventListener('change',function(e){if(e.target.classList.contains('tc')){pSel=[].filter.call(document.querySelectorAll('.tc'),function(c){return c.checked}).map(function(c){return c.value});if(!pSel.length)pSel=ALL.slice()}});
document.addEventListener('click',function(e){var b=e.target.closest('[data-pm]');if(!b)return;var m=b.dataset.pm;
 if(m==='quick')startPractice(pSel||ALL,12);else if(m==='blitz')startBlitz();else if(m==='mock')startMock();else if(m==='review')startReview();else if(m==='match')startMatch()});
/* match game */
var mg=null,mtm=null;
function startMatch(){var ids=shuf(P.cards.map(function(_,i){return i})).slice(0,6),t=[];ids.forEach(function(i){t.push({k:i,s:P.cards[i][0],side:0});t.push({k:i,s:P.cards[i][1],side:1})});
 mg={tiles:shuf(t),sel:null,left:6,t0:Date.now(),pen:0,wrong:-1};clearInterval(mtm);mtm=setInterval(function(){var e=$('mt');if(e&&mg)e.textContent=((Date.now()-mg.t0)/1000+mg.pen).toFixed(1)},100);cur='practice';drawMatch()}
function drawMatch(){var h='<div class="row" style="justify-content:space-between"><h2>Match</h2><span class="timer" id="mt">0.0</span></div><div class="mg" style="margin-top:12px">';
 mg.tiles.forEach(function(t,i){h+='<button data-m="'+i+'" class="'+(t.gone?'gone':'')+(mg.sel===i?' sel':'')+(mg.wrong===i?' wrong':'')+'">'+esc(t.s)+'</button>'});
 $('main').innerHTML=h+'</div><p><button class="btn ghost" id="mq">Quit</button></p>';[].forEach.call(document.querySelectorAll('#nav button'),function(b){b.setAttribute('aria-current',b.dataset.t==='practice'?'true':'false')})}
document.addEventListener('click',function(e){
 if(!mg)return;if(e.target.id==='mq'){mg=null;clearInterval(mtm);route();return}
 var b=e.target.closest('[data-m]');if(!b)return;var i=+b.dataset.m,t=mg.tiles[i];if(t.gone)return;mg.wrong=-1;
 if(mg.sel===null)mg.sel=i;else if(mg.sel===i)mg.sel=null;else{var a=mg.tiles[mg.sel];
  if(a.k===t.k&&a.side!==t.side){a.gone=t.gone=true;mg.left--;mg.sel=null;
   if(!mg.left){clearInterval(mtm);var sec=(Date.now()-mg.t0)/1000+mg.pen,best=!S.mbest||sec<S.mbest;if(best)S.mbest=Math.round(sec*10)/10;var xp=best?30:15;S.xp+=xp;S.coins+=10;S.dxp[today()]=(S.dxp[today()]||0)+xp;S.days[today()]=1;checkBadges();save();hud();burst(true);
    $('main').innerHTML='<div class="card" style="text-align:center">'+mascot(S.cos.on.av,'cheer',88)+'<div class="score">'+sec.toFixed(1)+' s</div><p class="mute">'+(best?'New best · ':'')+'+'+xp+' XP</p><div class="row" style="justify-content:center"><button class="btn" id="mst">Again</button><button class="btn sec" id="mx">Done</button></div></div>';mg=null;return}}
  else{mg.pen+=2;mg.wrong=i;mg.sel=null}}drawMatch()});
document.addEventListener('click',function(e){if(e.target.id==='mst')startMatch();if(e.target.id==='mx')route()});
/* ---------- Library ---------- */
var fc={i:0,flip:false,order:null,hide:false};
function seg(list,key){return '<div class="seg" role="tablist">'+list.map(function(x){return '<button data-seg="'+key+'|'+x[0]+'" aria-current="'+(sub[key]===x[0])+'">'+x[1]+'</button>'}).join('')+'</div>'}
function viewLibrary(){
 var s=sub.lib,h=seg([['notes','Notes'],['cards','Cards']].concat(P.meta.stations?[['stations','Stations']]:[],[['written','Written'],['plan','Plan'],['gloss','Glossary']],P.proofs?[['proofs','Proofs']]:[]),'lib');
 if(s==='notes')P.notes.forEach(function(n,i){h+='<details id="n-'+n.id+'"'+(i===0?' open':'')+'><summary>'+esc(n.title)+'</summary><div class="in">'+n.html+'</div></details>'});
 else if(s==='cards'){if(!fc.order)fc.order=P.cards.map(function(_,i){return i});var list=fc.hide?fc.order.filter(function(i){return !S.known[i]}):fc.order;if(fc.i>=list.length)fc.i=0;var c=P.cards[list[fc.i]];
  h+=list.length?'<div class="flash'+(fc.flip?' flip':'')+'" id="fcard" tabindex="0" role="button" aria-label="Flip card"><div><div class="f">'+esc(c[0])+'</div><div class="b">'+esc(c[1])+'</div></div></div><div class="row" style="justify-content:center"><button class="btn sec" id="fpv">Back</button><button class="btn sec" id="fkn">Know it</button><button class="btn" id="fnx">Next</button></div><p class="small mute" style="text-align:center">'+list.length+' cards · <label><input type="checkbox" id="fhd"'+(fc.hide?' checked':'')+'> hide known</label> · <a href="#" id="fsh">shuffle</a></p>':'<p>All cards known.</p><button class="btn" id="fa">Show all</button>'}
 else if(s==='stations')h+=stationsHTML();
 else if(s==='written')h+=P.written.map(function(w){return '<details><summary>'+esc(w[0])+'</summary><div class="in"><p>'+esc(w[1])+'</p></div></details>'}).join('');
 else if(s==='plan')h+=P.plan.map(function(d,i){return '<details><summary>Day '+(i+1)+' · '+esc(d.t)+'</summary><div class="in"><p class="mute">'+esc(d.focus||'')+'</p><ul>'+(d.tasks||[]).map(function(t){return '<li>'+esc(t[1])+'</li>'}).join('')+'</ul>'+(d.drill?'<button class="btn sm" data-drill="'+i+'">Drill</button>':'')+'</div></details>'}).join('')+(P.checklist?'<div class="card" style="margin-top:12px"><h3>Test-day checklist</h3><ul>'+P.checklist.map(function(x){return '<li>'+esc(x)+'</li>'}).join('')+'</ul></div>':'');
 else if(s==='proofs')h+=P.proofs.map(function(p,i){return '<details><summary>'+esc(p.title)+'</summary><div class="in proof"><p><b>Given:</b> '+esc(p.given)+'<br><b>Prove:</b> '+esc(p.prove)+'</p><p class="idea">💡 '+esc(p.idea)+'</p><table class="pf"><tr><th>Statement</th><th>Reason</th></tr>'+p.steps.map(function(x,j){return '<tr class="'+(j?'hid':'')+'" data-k="'+j+'"><td>'+(j+1)+'. '+esc(x[0])+'</td><td>'+esc(x[1])+'</td></tr>'}).join('')+'</table><div class="row"><button class="btn sm" data-rv="1">Show next step</button><button class="btn sm sec" data-rv="all">Show all</button></div><details class="deep"><summary>Go deeper</summary><p>'+esc(p.deep)+'</p><p><b>Watch out:</b> '+esc(p.trap)+'</p></details></div></details>'}).join('')
 else if(s==='gloss')h+='<dl class="gl">'+((STUDY&&STUDY.glossary)||[]).map(function(g){return '<dt>'+esc(g[0])+'</dt><dd>'+esc(g[1])+'</dd>'}).join('')+'</dl>';
 return h}
function afterLibrary(){}
document.addEventListener('click',function(e){
 var rv=e.target.closest('[data-rv]');if(rv){var tb=rv.closest('.proof').querySelector('table');var hs=tb.querySelectorAll('tr.hid');if(rv.dataset.rv==='all')hs.forEach(function(r){r.classList.remove('hid')});else if(hs[0])hs[0].classList.remove('hid');if(!tb.querySelector('tr.hid'))rv.disabled=true;return}
 var sg=e.target.closest('[data-seg]');if(sg){var p=sg.dataset.seg.split('|');sub[p[0]]=p[1];route();return}
 var d=e.target.closest('[data-drill]');if(d){var dd=P.plan[+d.dataset.drill].drill;startPractice(dd.topics,dd.n>15?15:dd.n);return}
 if(cur!=='library'||sub.lib!=='cards')return;var id=(e.target.closest('[id]')||{}).id;
 function list(){return fc.hide?fc.order.filter(function(i){return !S.known[i]}):fc.order}
 if(id==='fcard'){fc.flip=!fc.flip;route()}else if(id==='fnx'){fc.i=(fc.i+1)%Math.max(1,list().length);fc.flip=false;route()}else if(id==='fpv'){fc.i=(fc.i-1+list().length)%Math.max(1,list().length);fc.flip=false;route()}
 else if(id==='fkn'){S.known[list()[fc.i]]=1;save();fc.flip=false;route()}else if(id==='fsh'){e.preventDefault();fc.order=shuf(P.cards.map(function(_,i){return i}));fc.i=0;route()}
 else if(id==='fhd'){fc.hide=e.target.checked;fc.i=0;route()}else if(id==='fa'){fc.hide=false;route()}});
/* ---------- Me ---------- */
var QU=[['Answer 10 questions',function(){return dq().a},10],['Get 7 right',function(){return dq().r},7],['Learn 3 cards',function(){return dq().l},3]];
function myCard(){var L=lvInfo();return{n:S.nm||'Player',x:S.xp,l:L.l,s:dayStreak(),a:S.cos.on.av,ti:S.cos.on.ti,t:Date.now()}}
function viewMe(){
 var s=sub.me,L=lvInfo(),h=seg([['profile','Profile'],['shop','Shop'],['friends','Friends'],['settings','Settings']],'me');
 if(s==='profile'){
  h+='<div class="card"><div class="row">'+mascot(S.cos.on.av,'happy',76)+'<div style="flex:1"><h2>'+esc(S.nm||avOf(S.cos.on.av)[1])+'</h2><div class="small mute">'+esc((TI.filter(function(x){return x[0]===S.cos.on.ti})[0]||TI[0])[1])+' · Level '+L.l+' · '+esc(L.name)+'</div><div class="tr" style="margin-top:8px"><i style="width:'+L.pct+'%"></i></div><div class="small mute">'+S.xp+' XP · '+L.to+' to next</div></div></div><input id="nm" maxlength="14" placeholder="Nickname (no real name)" value="'+esc(S.nm)+'" style="margin-top:12px;width:100%;font:inherit;padding:10px;border-radius:12px;border:1.5px solid var(--line);background:var(--surface);color:var(--ink)"></div>';
  var wk='';for(var i=6;i>=0;i--){var d=new Date();d.setDate(d.getDate()-i);var k=d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2);wk+='<i class="'+(S.days[k]?'on':'')+'">'+'SMTWTFS'[d.getDay()]+'</i>'}
  h+='<div class="card"><h3>'+dayStreak()+' day streak</h3><div class="wk" style="margin-top:8px">'+wk+'</div><p class="small mute">One missed day is forgiven after every 7 played days.</p></div>';
  h+='<div class="card"><h3>Today</h3>'+QU.map(function(u){var v=Math.min(u[2],u[1]());return '<div class="bar2"><span>'+u[0]+(v>=u[2]?' ✓':'')+'</span><span class="tr"><i style="width:'+100*v/u[2]+'%"></i></span><span>'+v+'/'+u[2]+'</span></div>'}).join('')+'</div>';
  h+='<div class="card"><h3>Mastery</h3>'+P.topics.map(function(t){var st=S.stat[t.id]||[0,0],p=st[1]?100*st[0]/st[1]:0;return '<div class="bar2"><span>'+esc(t.name)+'</span><span class="tr"><i style="width:'+p+'%"></i></span><span>'+(st[1]?Math.round(p)+'%':'–')+'</span></div>'}).join('')+'</div>';
  h+='<div class="card"><h3>Badges</h3><div class="bdgs" style="margin-top:8px">'+BADGES.map(function(b){return '<div class="bdg'+(S.badges[b[0]]?' on':'')+'"><b>'+b[1]+'</b><small>'+b[2]+'</small></div>'}).join('')+'</div></div>'}
 else if(s==='shop'){h+=shopHTML()}
 else if(s==='friends'){
  if(!(SEC&&SEC.share))h+='<div class="card"><p>Friend codes work in the hosted version of this trainer.</p></div>';
  else{var rows=Object.keys(S.fr).map(function(k){return S.fr[k]}).concat([Object.assign(myCard(),{me:1})]).sort(function(a,b){return b.x-a.x});
   h+='<div class="card"><h3>Your code</h3><p class="small mute">Send it to a friend. It holds no personal info and cannot be faked.</p><textarea id="mc" readonly rows="3" aria-label="Your share code"></textarea><div class="row" style="margin-top:8px"><button class="btn sm" id="mcp">Copy</button></div></div><div class="card"><h3>Add a friend</h3><textarea id="fcd" rows="2" placeholder="Paste a friend code"></textarea><div class="row" style="margin-top:8px"><button class="btn sm" id="fadd">Add</button></div></div><div class="card"><h3>Leaderboard</h3>'+rows.map(function(r,i){return '<div class="row" style="padding:6px 0;'+(r.me?'font-weight:800':'')+'"><span>'+(i+1)+'</span>'+mascot(r.a,'happy',32,'c0')+'<span style="flex:1">'+esc(r.n)+' <span class="small mute">Lv '+r.l+' · '+r.s+'d</span></span><b>'+r.x+' XP</b></div>'}).join('')+'<p class="small mute">A friend\'s score updates when they send a new code.</p></div>'}}
 else{h+='<div class="card set"><h3>Display</h3><label>Theme <select id="u-th"><option value="auto">Match device</option><option value="light">Light</option><option value="dark">Dark</option></select></label><label>Text size <select id="u-xl"><option value="0">Normal</option><option value="1">Large</option><option value="2">Extra large</option></select></label><label><input type="checkbox" id="u-rm"> Reduce motion</label><label><input type="checkbox" id="u-snd"> Sound effects</label><label><input type="checkbox" id="u-hc"> High contrast</label><label><input type="checkbox" id="u-dys"> Easy-read font</label><label><input type="checkbox" id="u-focus"> Focus mode</label></div><div class="card"><h3>Save and restore</h3><p class="small mute">Progress saves automatically on this device. Keep a backup file too.</p><div class="row"><button class="btn sm" id="exd">Download backup</button><label class="btn sec sm" style="cursor:pointer">Import file<input type="file" id="imf" accept=".json,.txt" hidden></label></div><textarea id="im" rows="2" placeholder="Or paste a backup code" style="margin-top:10px"></textarea><div class="row" style="margin-top:8px"><button class="btn sm sec" id="ip">Restore</button><button class="btn sm ghost" id="rs">Reset all</button></div></div>'}
 return h}
function shopHTML(){
 function sec(name,list,key,render){return '<h3>'+name+'</h3><div class="shop">'+list.map(function(x){var own=S.cos.own[x[0]]||x[2]===0,on=S.cos.on[key]===x[0];return '<div class="up'+(RAR[x[0]]&&RAR[x[0]]!=='Common'?' rr r'+x[0]:'')+'">'+render(x)+'<b>'+x[1]+'</b>'+(RAR[x[0]]?'<span class="rar r'+x[0]+'">'+RAR[x[0]]+'</span>':'')+'<button class="btn sm" data-cos="'+x[0]+'|'+key+'"'+(on?' disabled':(!own&&S.coins<x[2]?' disabled':''))+'>'+(on?'Equipped':own?'Equip':'Buy · '+x[2])+'</button></div>'}).join('')+'</div>'}
 var goal=AV.filter(function(x){return !(S.cos.own[x[0]]||x[2]===0)}).sort(function(a,b){return a[2]-b[2]})[0],gh=goal?'<div class="goalc">'+mascot(goal[0],'cheer',64,'c0')+'<div style="flex:1"><b>Next goal: '+goal[1]+'</b> <span class="rar r'+goal[0]+'">'+(RAR[goal[0]]||'')+'</span><div class="bar"><i style="width:'+Math.min(100,Math.round(100*S.coins/goal[2]))+'%"></i></div><span class="small mute">'+Math.min(S.coins,goal[2])+' / '+goal[2]+' coins</span></div></div>':'';
 return gh+'<p class="mute small">'+S.coins+' coins · looks only, no advantages</p>'+sec('Characters',AV,'av',function(x){return mascot(x[0],'happy',56,S.cos.on.ac)})+sec('Hats',AC,'ac',function(x){return mascot(S.cos.on.av,'happy',56,x[0])})+sec('Themes',TH,'th',function(x){return '<i class="sw" style="background:'+x[3]+'"></i>'})+sec('Titles',TI,'ti',function(){return ''})}
function afterMe(){if(sub.me==='friends'&&SEC&&SEC.share)SEC.share(myCard()).then(function(t){var e=$('mc');if(e)e.value=t});
 if(sub.me==='settings'){$('u-th').value=S.theme;$('u-xl').value=A11.xl||0;$('u-rm').checked=!!A11.rm;$('u-snd').checked=A11.snd!==false;$('u-hc').checked=!!A11.hc;$('u-dys').checked=!!A11.dys;$('u-focus').checked=!!A11.focus}}
function doRestore(o){if(!o||typeof o.xp!=='number')throw 0;for(var k in o)S[k]=o[k];save();hud();applyCos();applyTheme();toast('Restored');route()}
function exportNow(){var go2=function(txt){var b=new Blob([txt],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=P.meta.id+'-backup.json';document.body.appendChild(a);a.click();setTimeout(function(){a.remove();URL.revokeObjectURL(a.href)},500);toast('Backup downloaded')};
 if(SEC&&SEC.pack)SEC.pack(S).then(go2);else go2(JSON.stringify(S))}
function importText(txt){txt=txt.trim();try{if(SEC&&SEC.unpack)SEC.unpack(txt).then(doRestore,function(){toast('That backup is not valid for this trainer')});else doRestore(JSON.parse(txt))}catch(x){toast('Not a valid backup')}}
document.addEventListener('input',function(e){if(e.target.id==='nm'){S.nm=e.target.value.replace(/[<>&"]/g,'').slice(0,14);save()}});
document.addEventListener('click',function(e){
 var b=e.target.closest('[data-cos]');if(b){var p=b.dataset.cos.split('|'),all=AV.concat(AC,TH,TI),it=all.filter(function(x){return x[0]===p[0]})[0];if(!S.cos.own[p[0]]&&it[2]>0){if(S.coins<it[2])return;S.coins-=it[2];S.cos.own[p[0]]=1}S.cos.on[p[1]]=p[0];save();hud();applyCos();route();return}
 var id=e.target.id;
 if(id==='exd')exportNow();
 if(id==='ip')importText($('im').value);
 if(id==='mcp'){var ta=$('mc');ta.select();try{navigator.clipboard.writeText(ta.value);toast('Copied')}catch(x){document.execCommand('copy')}}
 if(id==='fadd'&&SEC)SEC.open($('fcd').value).then(function(o){if(typeof o.x!=='number'||o.x<0||o.x>1e6)throw 0;var k=String(o.n).slice(0,14),old=S.fr[k];if(!old||o.t>=old.t)S.fr[k]={n:k,x:o.x|0,l:o.l|0,s:o.s|0,a:String(o.a),ti:String(o.ti),t:o.t|0};save();route();toast('Friend added')},function(){toast('That code is not valid for this class')});
 if(id==='rs'){if(e.target.dataset.arm){if(SEC)SEC.clear();else try{localStorage.removeItem(KEY)}catch(x){}setTimeout(function(){location.reload()},200)}else{e.target.dataset.arm=1;e.target.textContent='Tap again to erase everything'}}});
document.addEventListener('change',function(e){var t=e.target;
 if(t.id==='imf'&&t.files[0]){var r=new FileReader();r.onload=function(){importText(String(r.result))};r.readAsText(t.files[0]);return}
 if(t.id==='u-th'){S.theme=t.value;applyTheme();save();hud();return}
 if(t.id==='u-xl')A11.xl=+t.value;else if(t.id==='u-rm')A11.rm=t.checked;else if(t.id==='u-snd'){A11.snd=t.checked;if(t.checked&&window.sfx)window.sfx('ok')}else if(t.id==='u-hc')A11.hc=t.checked;else if(t.id==='u-dys')A11.dys=t.checked;else if(t.id==='u-focus')A11.focus=t.checked;else return;saveUI()});
/* ---------- boot ---------- */
applyTheme();applyCos();applyUI();hud();route();
window.addEventListener('pagehide',function(){save()});
/* ---------- greeting + daily mission card ---------- */
function greet(){var dx=S.dxp[today()]||0,st=dayStreak(),hr=new Date().getHours(),m;
 if(!S.total)m='Hi, I am '+avOf(S.cos.on.av)[1]+'. Start with today\'s mission. It takes about 10 minutes.';
 else if(minsToday()>=45)m='You studied '+minsToday()+' minutes today. That is plenty. Stopping here is a win.';
 else if(hr>=22||hr<5)m='It is late. Sleep helps your memory. A short mission now, then rest.';
 else if(missionDone())m='Mission done today. Extra practice is bonus.';
 else if(st>=3)m=st+' days in a row. Today\'s mission is ready.';
 else m='Ready when you are.';
 return '<div class="hero">'+mascot(S.cos.on.av,missionDone()?'cheer':'happy',76)+'<div class="bubble">'+esc(m)+'</div></div>'}
function missionCard(){var nl=nextLesson(),due=dueIds().length;
 return '<div class="cont"><div style="flex:1"><div class="small" style="opacity:.9">Today · about 10 min</div><h2>'+(missionDone()?'Mission done':'Daily mission')+'</h2></div><button class="btn" id="msn">'+(missionDone()?'Again':'Start')+'</button></div>'+(due?'<div class="row" style="margin-bottom:10px"><span class="chip">'+due+' due for review</span></div>':'')}
var _vl=viewLearn;viewLearn=function(){var h=_vl();return h.replace(/<div class="cont">[\s\S]*?<\/button><\/div>/,missionCard())};
document.addEventListener('click',function(e){if(e.target.id==='msn')startMission()});
