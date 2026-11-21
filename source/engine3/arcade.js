/* ===== Arcade: three games that pause to ask a question (Gold Quest, Boss Raid, Rocket Run) =====
   Questions come from this trainer's own multiple-choice bank. Opponents are bots and always labelled "bot".
   Every random outcome shows its odds on screen. Coins earned here only unlock looks (no advantages). */
(function(){
var AR=null,tm=0,raf=0,SH=['▲','◆','●','■'];
function rm(){return !!(window.A11&&A11.rm)}
function accNow(){var r=S.ra||'';return r.length<5?.6:r.split('').filter(function(c){return c==='1'}).length/r.length}
function refill(){var a=accNow(),lv=a>.8?[2,3]:a<.5?[1,2]:[1,2,3];
 var pool=QS.filter(function(q){return q.id&&q.type==='mcq'&&q.o&&q.o.length>=3&&lv.indexOf(q.l)>=0});if(pool.length<8)pool=QS.filter(function(q){return q.id&&q.type==='mcq'&&q.o&&q.o.length>=3});
 AR.q=shuf(pool).map(function(q){return q.id})}
function nextQ(){if(!AR.q.length)refill();return AR.q.pop()}
function frame(title){var o=document.getElementById('ar');if(!o){o=document.createElement('div');o.id='ar';o.className='ogov arov';o.setAttribute('role','dialog');o.setAttribute('aria-modal','true');o.setAttribute('aria-label','Arcade');document.body.appendChild(o)}
 o.innerHTML='<div class="ogh"><button class="iconbtn" id="arx" aria-label="Leave game">×</button><b>'+esc(title)+'</b><span class="sp"></span><span id="arsc" class="arsc"></span></div><div class="ogbody arbody" id="arb"></div><div class="sr-only" id="arlive" role="status" aria-live="polite"></div>';return o}
function B(){return document.getElementById('arb')}
function say(t){var l=document.getElementById('arlive');if(l)l.textContent=t}
function score(t){var s=document.getElementById('arsc');if(s)s.innerHTML=t}
function stopAll(){clearInterval(tm);tm=0;cancelAnimationFrame(raf);raf=0;if(AR)AR.to&&AR.to.forEach(clearTimeout);if(AR)AR.to=[]}
function later(fn,ms){var t=setTimeout(fn,ms);AR.to.push(t);return t}
function leave(){stopAll();var o=document.getElementById('ar');if(o)o.remove();AR=null;try{route()}catch(e){}}
function reward(win,base){var g=Math.min(40,base);S.coins+=g;try{S.ar=S.ar||{g:0,w:0};S.ar.g++;if(win)S.ar.w++;save();hud&&hud()}catch(e){}window.sfx&&sfx(win?'gameWin':'gameLose');return g}
/* ---------- the forced question ---------- */
function ask(o,cb){AR.asked=(AR.asked||0)+1;var id=nextQ(),it=mkItem(id),q=it.q;AR.paused=true;var box=document.getElementById('arq');if(!box){box=document.createElement('section');box.id='arq';box.className='arq';box.setAttribute('aria-label','Question');B().appendChild(box)}
 var lim=o.lim||0,t0=Date.now(),done=false;
 box.innerHTML='<div class="arqt"><span class="arbadge">'+esc(o.tag||'Question')+'</span>'+(lim?'<div class="ogtm" role="timer" aria-label="Time left"><i id="arti"></i><span id="arts"></span></div>':'')+'</div>'
  +(q.fig?figSVG(q.fig):'')+(q.svg?'<div class="figw">'+q.svg+'</div>':'')+'<div class="qtext">'+esc(q.q)+'</div>'
  +'<div class="ogtiles">'+it.perm.map(function(oi,k){return '<button class="ogtile t'+(k%4)+'" data-aro="'+oi+'"><i aria-hidden="true">'+SH[k%4]+'</i><b>'+'ABCDEF'[k]+'</b><span>'+esc(q.o[oi])+'</span></button>'}).join('')+'</div>';
 var ov=document.getElementById('ar');if(ov)ov.classList.add('asking');var first=box.querySelector('.ogtile');if(first)first.focus({preventScroll:true});ov&&ov.scrollTo&&ov.scrollTo(0,0);say((o.tag||'Question')+'. '+q.q);
 function fin(ok,to){if(done)return;done=true;cancelAnimationFrame(raf);var good=it.perm.indexOf(0);
  [].forEach.call(box.querySelectorAll('.ogtile'),function(b){b.disabled=true;if(+b.dataset.aro===0)b.classList.add('rgt');else if(!ok&&+b.dataset.aro===AR.pick)b.classList.add('wrg')});
  window.sfx&&sfx(ok?'ok':'no');say(ok?'Correct':(to?'Time is up. ':'Not quite. ')+'The answer is '+q.o[0]);
  var fb=document.createElement('div');fb.className='arfb '+(ok?'good':'bad');fb.innerHTML='<b>'+(ok?'Correct!':to?'Time is up':'Not quite')+'</b>'+(ok?'':'<p>Answer: '+esc(q.o[0])+'</p>'+(q.w?'<p class="small">'+esc(q.w)+'</p>':''))+(ok?'':'<button class="btn block" id="arcont">Continue</button>');box.appendChild(fb);
  function go(){box.remove();var o2=document.getElementById('ar');if(o2)o2.classList.remove('asking');AR.paused=false;cb(ok,to)}
  if(ok)later(go,rm()?500:900);else{AR.cont=go;var c=document.getElementById('arcont');if(c)c.focus()}}
 AR.answer=function(oi){AR.pick=oi;fin(oi===0,false)};
 if(lim){var fn=function(){if(done)return;var rem=Math.max(0,lim-(Date.now()-t0)),p=rem/lim,i=document.getElementById('arti');if(i){i.style.width=(p*100)+'%';i.style.background=p<.25?'#e0412f':p<.5?'#f5a623':'var(--pri)'}var s=document.getElementById('arts');if(s)s.textContent=Math.ceil(rem/1000);if(rem<=0){AR.pick=-1;fin(false,true);return}raf=requestAnimationFrame(fn)};fn()}}
/* ---------- menu ---------- */
var IC={gold:'<path d="M3 11h18v9H3zM3 11a9 6 0 0118 0M12 11v4"/>',boss:'<path d="M12 3c5 0 8 4 8 9v6l-3-2-2 3-3-2-3 2-2-3-3 2v-6c0-5 3-9 8-9zM9 11h.01M15 11h.01"/>',run:'<path d="M12 2c3 3 4 7 3 12l-3 3-3-3c-1-5 0-9 3-12zM8 17l-3 4 4-1M16 17l3 4-4-1"/>'};
var GM={gold:['Gold Quest','Answer to open treasure chests. Race three bots to the biggest pile.','Chest odds are shown. Pirate ambushes force a quick question.'],boss:['Boss Raid','Hit the boss by answering. When it winds up, dodge with a timed answer.','3 hearts. Every third turn is a dodge.'],run:['Rocket Run','Tap falling stars. Gates stop the rocket and ask a question.','70 seconds. A right answer gives a ×2 star boost.']};
function menu(){stopAll();AR={q:[],to:[]};frame('Arcade');
 B().innerHTML='<div class="armenu"><div class="arhero"><h2>Pick a game</h2><p class="mute">Each one pauses the action to ask a question from this trainer.</p></div><div class="argrid">'+['gold','boss','run'].map(function(k){return '<button class="arcard ar-'+k+'" data-arg="'+k+'"><span class="aric"><svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+IC[k]+'</svg></span><b>'+GM[k][0]+'</b><span>'+GM[k][1]+'</span><small>'+GM[k][2]+'</small></button>'}).join('')+'</div><p class="small mute" style="text-align:center">Opponents are bots and are always labelled. Coins from games only unlock looks.</p></div>'}
function start(k){stopAll();AR={q:[],to:[],kind:k,paused:false,streak:0,right:0,asked:0};frame(GM[k][0]);refill();({gold:gold,boss:boss,run:run})[k]()}
/* ---------- Gold Quest ---------- */
var CH=[{p:.55,n:'Treasure',lo:30,hi:60},{p:.15,n:'Jackpot',lo:100,hi:140},{p:.15,n:'Empty chest',lo:0,hi:0},{p:.15,n:'Pirate',steal:40}];
var BN=['Captain Pixel','Coral','Mr. Moss','Zippy','Nova','Biscuit'];
function roll(){var r=Math.random(),a=0;for(var i=0;i<CH.length;i++){a+=CH[i].p;if(r<a)return CH[i]}return CH[0]}
function chestSVG(open,c){return '<svg viewBox="0 0 64 56" width="72" height="62" aria-hidden="true"><rect x="6" y="22" width="52" height="30" rx="5" fill="#b7791f" stroke="#7a4b0c" stroke-width="2"/>'+(open?'<path d="M6 22q0-16 26-16t26 16z" fill="#d69e2e" stroke="#7a4b0c" stroke-width="2" transform="rotate(-18 6 22)"/>':'<path d="M6 22q0-14 26-14t26 14z" fill="#d69e2e" stroke="#7a4b0c" stroke-width="2"/>')+'<rect x="27" y="26" width="10" height="12" rx="2" fill="#ffd54a" stroke="#7a4b0c" stroke-width="1.5"/>'+(open&&c&&!c.steal&&c.hi?'<circle cx="32" cy="18" r="6" fill="#ffd54a"/>':'')+'</svg>'}
function gold(){var G=AR;G.gold=0;G.rd=0;G.R=8;G.bots=shuf(BN).slice(0,3).map(function(n){return{n:n,g:0,sk:.5+Math.random()*.3}});
 function board(){var rows=[{n:'You',g:G.gold,me:1}].concat(G.bots.map(function(b){return{n:b.n,g:b.g,b:1}})).sort(function(a,b){return b.g-a.g});
  return '<ol class="ogldr arldr">'+rows.map(function(r,i){return '<li class="'+(r.me?'me':'')+'"><span class="rk">'+(i+1)+'</span><b>'+esc(r.n)+(r.b?' <i class="botlab">bot</i>':'')+'</b><span class="pts">'+r.g+'</span></li>'}).join('')+'</ol>'}
 function top(msg){score('<b>'+G.gold+'</b> gold');B().innerHTML='<div class="arinfo"><span>Round '+Math.min(G.rd+1,G.R)+' of '+G.R+'</span><span>Streak '+G.streak+(G.streak>1?' · +'+Math.min(25,5*(G.streak-1))+' bonus':'')+'</span></div><div id="arst" class="arstage">'+(msg||'')+'</div><p class="small mute arodds">Chests: '+CH.map(function(c){return c.n+' '+Math.round(c.p*100)+'%'+(c.steal?' (lose up to '+c.steal+')':c.hi?' (+'+c.lo+' to '+c.hi+')':'')}).join(' · ')+'</p><h3 class="arh">Leaderboard</h3>'+board()}
 function botsMove(){G.bots.forEach(function(b){if(Math.random()<b.sk){var c=roll();b.g=Math.max(0,b.g+(c.steal?-c.steal:c.hi?c.lo+Math.floor(Math.random()*(c.hi-c.lo+1)):0))}})}
 function round(){if(G.rd>=G.R)return end();top('<p class="mute">Answer to earn a chest.</p>');
  ask({tag:'Round '+(G.rd+1)},function(ok){G.rd++;if(ok){G.right++;G.streak++;chests()}else{G.streak=0;botsMove();later(afterRound,300)}})}
 function chests(){var bonus=Math.min(25,5*(G.streak-1)),cs=[roll(),roll(),roll()];
  top('<p><b>Pick a chest</b></p><div class="archests">'+[0,1,2].map(function(i){return '<button class="archest" data-arc="'+i+'" aria-label="Chest '+(i+1)+'">'+chestSVG(false)+'<span>'+(i+1)+'</span></button>'}).join('')+'</div>');
  G.cs=cs;G.bonus=bonus;G.chestOpen=function(i){var c=cs[i],gain=c.steal?-Math.min(G.gold,c.steal):c.hi?c.lo+Math.floor(Math.random()*(c.hi-c.lo+1))+bonus:bonus;G.gold=Math.max(0,G.gold+gain);window.sfx&&sfx(gain>0?'coin':c.steal?'no':'pop');
   var st=document.getElementById('arst');st.innerHTML='<div class="archests done">'+cs.map(function(x,j){return '<div class="archest '+(j===i?'pick':'dim')+'">'+chestSVG(true,x)+'<span>'+x.n+'</span></div>'}).join('')+'</div><p class="arres"><b>'+(c.steal?'A pirate bot grabbed '+(-gain)+' gold':c.hi?'+'+gain+' gold':bonus?'Empty, but your streak bonus is +'+bonus:'Empty chest')+'</b></p>';say(c.n+'. '+(gain>=0?'Plus ':'Minus ')+Math.abs(gain)+' gold');score('<b>'+G.gold+'</b> gold');
   G.chestOpen=null;botsMove();later(afterRound,rm()?900:1500)}}
 function afterRound(){if(!AR)return;if(G.rd===3||G.rd===6){return ambush()}round()}
 function ambush(){top('<p class="arwarn"><b>Pirate ambush!</b> Answer in 12 seconds or lose 30 gold.</p>');ask({tag:'Pirate ambush',lim:12000},function(ok){if(!ok){G.gold=Math.max(0,G.gold-30);G.streak=0;score('<b>'+G.gold+'</b> gold')}else G.right++;round()})}
 function end(){stopAll();var rows=[{n:'You',g:G.gold,me:1}].concat(G.bots.map(function(b){return{n:b.n,g:b.g,b:1}})).sort(function(a,b){return b.g-a.g}),rank=rows.findIndex(function(r){return r.me})+1,c=reward(rank===1,5+Math.floor(G.gold/25));
  B().innerHTML='<div class="ogdone"><h2>'+(rank===1?'You found the most gold!':'Final standings')+'</h2><ol class="ogldr arldr">'+rows.map(function(r,i){return '<li class="'+(r.me?'me':'')+'"><span class="rk">'+(i+1)+'</span><b>'+esc(r.n)+(r.b?' <i class="botlab">bot</i>':'')+'</b><span class="pts">'+r.g+'</span></li>'}).join('')+'</ol><p>'+G.right+' of '+G.asked+' answered right. +'+c+' coins (looks only).</p><button class="btn block" data-arg="gold">Play again</button><button class="btn sec block" data-arg="menu">More games</button></div>';score('')}
 round()}
/* ---------- Boss Raid ---------- */
var BOSSES=[['Glitch Blob','#7c4dff'],['Static Golem','#ef6c00'],['Gravity Kraken','#00838f'],['Entropy Imp','#c2185b']];
function bossSVG(c,hit){return '<svg viewBox="0 0 120 110" width="150" height="138" class="arboss'+(hit?' hit':'')+'" aria-hidden="true"><ellipse cx="60" cy="98" rx="38" ry="7" fill="rgba(0,0,0,.15)"/><path d="M18 80C10 40 34 14 60 14s50 26 42 66c-6 14-78 14-84 0z" fill="'+c+'"/><circle cx="44" cy="52" r="10" fill="#fff"/><circle cx="76" cy="52" r="10" fill="#fff"/><circle cx="46" cy="54" r="5" fill="#222"/><circle cx="74" cy="54" r="5" fill="#222"/><path d="M42 78q18 12 36 0" stroke="#222" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M30 22l-8-14 18 8M90 22l8-14-18 8" fill="'+c+'"/></svg>'}
function boss(){var G=AR,B0=BOSSES[Math.floor(Math.random()*BOSSES.length)];G.hp=120;G.max=120;G.hearts=3;G.turn=0;G.hit=false;
 function top(msg,hit){var pct=Math.max(0,G.hp/G.max*100);score(Array(G.hearts+1).join('♥ ')+Array(3-G.hearts+1).join('♡ '));
  B().innerHTML='<div class="arinfo"><span>'+esc(B0[0])+'</span><span>Streak '+G.streak+'</span></div><div class="arbar" role="img" aria-label="Boss health '+Math.max(0,G.hp)+' of '+G.max+'"><i style="width:'+pct+'%"></i><span>'+Math.max(0,G.hp)+' / '+G.max+'</span></div><div class="arstage arbossst">'+bossSVG(B0[1],hit&&!rm())+'<p class="arres">'+(msg||'')+'</p></div>'}
 function turn(){if(G.hp<=0)return end(true);if(G.hearts<=0)return end(false);G.turn++;
  if(G.turn%3===0){top('<span class="arwarn"><b>The boss is winding up!</b> Dodge: answer in 10 seconds.</span>');ask({tag:'Dodge!',lim:10000},function(ok){if(ok){G.right++;G.streak++;window.sfx&&sfx('whoosh');top('You dodged!');later(turn,700)}else{G.hearts--;G.streak=0;window.sfx&&sfx('shake');top('Ouch! −1 heart',true);later(turn,900)}})}
  else{top('Your turn: a right answer hits the boss.');ask({tag:'Attack'+(G.streak>1?' · streak '+G.streak:'')},function(ok){if(ok){G.right++;G.streak++;var d=15+Math.min(20,5*(G.streak-1));G.hp-=d;window.sfx&&sfx('combo');top('Hit! −'+d+' health'+(G.streak>1?' (streak bonus +'+Math.min(20,5*(G.streak-1))+')':''),true)}else{G.streak=0;top('Missed. No damage.')}later(turn,rm()?700:1000)})}}
 function end(win){stopAll();var c=reward(win,win?25:8);B().innerHTML='<div class="ogdone"><h2>'+(win?'Boss defeated!':'The boss won this time')+'</h2>'+bossSVG(B0[1],false).replace('class="arboss"','class="arboss '+(win?'ko':'')+'"')+'<p>'+G.right+' of '+G.asked+' right in '+G.turn+' turns. +'+c+' coins (looks only).</p><button class="btn block" data-arg="boss">Play again</button><button class="btn sec block" data-arg="menu">More games</button></div>';score('')}
 turn()}
/* ---------- Rocket Run ---------- */
function run(){var G=AR;G.t=0;G.dur=70000;G.stars=0;G.boost=0;G.gates=0;G.nextGate=7000+Math.random()*3000;G.nextStar=300;G.live=0;
 function view(){score('<b>'+G.stars+'</b> star'+(G.stars===1?'':'s')+(G.boost>0?' · ×2 boost '+Math.ceil(G.boost/1000)+'s':''))}
 B().innerHTML='<div class="arinfo"><span id="artime">70 s</span><span>Gates: '+'<b id="argates">0</b></span></div><div class="arstage arsky" id="arsky" aria-label="Sky: tap the stars"><svg class="arrocket" viewBox="0 0 40 70" width="44" height="76" aria-hidden="true"><path d="M20 2c9 9 12 24 8 40l-8 8-8-8C8 26 11 11 20 2z" fill="#eceff1" stroke="#455a64" stroke-width="2"/><circle cx="20" cy="22" r="5" fill="#4fc3f7"/><path d="M12 40l-8 12 10-3M28 40l8 12-10-3" fill="#ef5350"/><path d="M15 52h10l-5 14z" fill="#ffb300"/></svg></div><p class="small mute arodds">Tap stars to collect them. Every 7 to 10 seconds a gate appears. A right answer gives ×2 stars for 10 seconds. A wrong answer or timeout costs 5 stars.</p>';view();
 var sky=document.getElementById('arsky');
 function spawn(){var s=document.createElement('button');s.className='arstar';s.setAttribute('aria-label','Star');s.textContent='★';s.style.left=(6+Math.random()*80)+'%';s.dataset.life=2800;sky.appendChild(s);G.live++;
  if(!rm()){s.style.top='-12%';requestAnimationFrame(function(){requestAnimationFrame(function(){s.style.transition='top 2.8s linear';s.style.top='92%'})})}else s.style.top=(10+Math.random()*70)+'%';
  later(function(){if(s.parentNode){s.remove();G.live--}},2800)}
 sky.addEventListener('click',function(e){var s=e.target.closest('.arstar');if(!s||G.paused)return;s.remove();G.live--;G.stars+=G.boost>0?2:1;window.sfx&&sfx('pop');view()});
 function gate(){G.gates++;document.getElementById('argates').textContent=G.gates;[].forEach.call(sky.querySelectorAll('.arstar'),function(s){s.remove()});G.live=0;sky.classList.add('gated');
  ask({tag:'Gate '+G.gates,lim:15000},function(ok){sky.classList.remove('gated');if(ok){G.right++;G.boost=10000;window.sfx&&sfx('streak')}else{G.stars=Math.max(0,G.stars-5)}view();G.nextGate=G.t+7000+Math.random()*3000})}
 tm=setInterval(function(){if(!AR||G.paused)return;G.t+=100;if(G.boost>0){G.boost-=100;if(G.boost%1000===0)view()}
  var r=document.getElementById('artime');if(r)r.textContent=Math.ceil((G.dur-G.t)/1000)+' s';
  if(G.t>=G.dur)return end();
  if(G.t>=G.nextGate&&G.t<G.dur-6000){gate();return}
  if(G.t>=G.nextStar){spawn();G.nextStar=G.t+(rm()?900:550+Math.random()*400)}},100);
 function end(){stopAll();var sc=G.stars+10*G.right,c=reward(sc>=60,5+Math.floor(sc/6));B().innerHTML='<div class="ogdone"><h2>Run complete</h2><p class="arbig">'+sc+'</p><p>'+G.stars+' stars + '+G.right+' right answers × 10. +'+c+' coins (looks only).</p><button class="btn block" data-arg="run">Play again</button><button class="btn sec block" data-arg="menu">More games</button></div>';score('')}}
/* ---------- events ---------- */
document.addEventListener('click',function(e){var t=e.target,b=t.closest&&t.closest('button');
 if(t.closest&&t.closest('[data-ar]')&&!document.getElementById('ar')){menu();return}
 if(!document.getElementById('ar')||!b)return;
 if(b.id==='arx'){leave();return}
 if(b.dataset.arg){if(b.dataset.arg==='menu')menu();else start(b.dataset.arg);return}
 if(b.dataset.aro!==undefined&&AR&&AR.answer){AR.answer(+b.dataset.aro);return}
 if(b.id==='arcont'&&AR&&AR.cont){var f=AR.cont;AR.cont=null;f();return}
 if(b.dataset.arc!==undefined&&AR&&AR.chestOpen){AR.chestOpen(+b.dataset.arc);return}});
document.addEventListener('keydown',function(e){if(!document.getElementById('ar'))return;if(e.key==='Escape'){leave();return}
 if(/^[1-4]$/.test(e.key)&&AR&&AR.answer){var tl=document.querySelectorAll('#arq .ogtile:not([disabled])')[+e.key-1];if(tl)tl.click()}});
window.openArcade=function(k){if(k&&GM[k]){AR={q:[],to:[]};start(k)}else menu()};
var _vp4=viewPractice;viewPractice=function(){var h=_vp4.apply(this,arguments);var card='<button class="card" data-ar="1" style="text-align:left"><h3>Arcade</h3><p class="small mute">Gold Quest, Boss Raid, Rocket Run</p></button>';return h.replace('<button class="card" data-pm="blitz"',card+'<button class="card" data-pm="blitz"')};
})();
