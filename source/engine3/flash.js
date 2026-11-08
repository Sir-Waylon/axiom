/* ===== flashcards: Flip, Learn, Write and Match, on your plan's topics. Progress is saved on this device. ===== */
(function(){
var FL={deck:null,name:'',mode:null,cards:[],q:[],i:0,known:[],again:[],flip:false,st:null,tm:null,t0:0,pen:0,sel:null,msg:'',ans:null},CH='<svg class="chv" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>';
function key(c){return c.t+'|'+c.h}
function box(c){return (S.fcs&&S.fcs[key(c)])||0}
function setBox(c,v){if(!S.fcs)S.fcs={};S.fcs[key(c)]=Math.max(0,Math.min(3,v));save()}
function short(x){x=String(x).replace(/\s+/g,' ');var m=x.match(/^(.{20,150}?[.!?])(\s|$)/);return m?m[1]:x.slice(0,150)}
function st(){return window.STUDY||{cards:{},glossary:[]}}
function fromTopics(ts){var o=[];ts.forEach(function(t){((st().cards||{})[t]||[]).forEach(function(c){o.push({t:t,h:c[0],x:c[1],f:c[2]||''})})});return o}
function plan(){var o=__order();return o.o.filter(function(t){return o.pr[t]!==undefined&&o.pr[t]<3}).slice(0,4)}
function cardsFor(d){if(d==='plan'){var p=plan();return fromTopics(p.length?p:ALL.slice(0,3))}if(d==='all')return fromTopics(ALL);if(d==='gloss')return (st().glossary||[]).map(function(g){return{t:'gloss',h:g[0],x:g[1],f:''}});return fromTopics([d])}
function nameFor(d){return d==='plan'?'My plan':d==='all'?'All topics':d==='gloss'?'Glossary':__tname(d)}
window.flashDeck=function(d){flashStop();FL.deck=d;FL.name=nameFor(d);FL.cards=cardsFor(d);FL.mode=null};
window.flashStop=function(){if(FL.tm){clearInterval(FL.tm);FL.tm=null}FL.mode=null};
function bar(p){return '<div class="cprog" role="img" aria-label="'+Math.round(p)+' percent"><i style="width:'+p+'%"></i></div>'}
function known(cs){return cs.filter(function(c){return box(c)>=3}).length}
window.flashView=function(){
 if(!FL.deck){var o=__order(),h='<p class="small mute" style="margin:0 0 10px">Pick a deck, then a way to study it.</p><div class="list2">';
  var pc=cardsFor('plan');h+='<button class="rw2" data-fl="deck:plan"><span class="rt"><b>My plan</b><small>'+pc.length+' cards from the topics you need most</small></span>'+CH+'</button>';
  h+='<button class="rw2" data-fl="deck:all"><span class="rt"><b>All topics</b><small>'+cardsFor('all').length+' cards</small></span>'+CH+'</button>';
  if((st().glossary||[]).length)h+='<button class="rw2" data-fl="deck:gloss"><span class="rt"><b>Glossary</b><small>'+st().glossary.length+' terms</small></span>'+CH+'</button>';
  h+='</div><div class="sech">By topic</div><label class="sch"><span class="sr-only">Search topics</span><input type="search" data-sq="fl" placeholder="Search topics" autocomplete="off"></label><div class="list2">';
  o.o.forEach(function(t){var cs=cardsFor(t);if(!cs.length)return;h+='<button class="rw2" data-kw="'+esc(__tname(t).toLowerCase())+'" data-fl="deck:'+t+'"><span class="rt"><b>'+esc(__tname(t))+'</b><small>'+known(cs)+' of '+cs.length+' known</small></span>'+CH+'</button>'});
  return h+'</div><p class="empty" hidden>No matches</p>'}
 if(!FL.mode){var n=FL.cards.length,k=known(FL.cards);return '<div class="card"><div class="row"><div style="flex:1"><b>'+esc(FL.name)+'</b><div class="small mute">'+k+' of '+n+' known</div></div><button class="btn sec sm" data-fl="change">Change deck</button></div>'+bar(n?100*k/n:0)+'</div>'+
  '<div class="list2"><button class="rw2" data-fl="mode:flip"><span class="rt"><b>Flip cards</b><small>See the term, flip, mark known or still learning</small></span>'+CH+'</button><button class="rw2" data-fl="mode:learn"><span class="rt"><b>Learn</b><small>Choose, then type. Missed cards come back</small></span>'+CH+'</button><button class="rw2" data-fl="mode:write"><span class="rt"><b>Write</b><small>Read the meaning, type the term</small></span>'+CH+'</button><button class="rw2" data-fl="mode:match"><span class="rt"><b>Match</b><small>Race the clock to pair terms and meanings</small></span>'+CH+'</button></div>'}
 return '<div id="fl" aria-live="polite">'+body()+'</div>'};
function norm(s){return String(s).toLowerCase().replace(/[’']/g,'').replace(/[^a-z0-9α-ωΩ]+/g,' ').replace(/^(the|a|an) /,'').trim()}
function lev(a,b){var m=a.length,n=b.length,d=[],i,j;for(i=0;i<=m;i++)d[i]=[i];for(j=1;j<=n;j++)d[0][j]=j;for(i=1;i<=m;i++)for(j=1;j<=n;j++)d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(a[i-1]===b[j-1]?0:1));return d[m][n]}
function close(a,b){a=norm(a);b=norm(b);if(!a)return false;if(a===b)return true;var L=b.length;return L>=4&&lev(a,b)<=(L>=10?2:1)}
function begin(m){FL.mode=m;FL.i=0;FL.known=[];FL.again=[];FL.flip=false;FL.ans=null;FL.msg='';flashStopT();
 var pool=FL.cards.filter(function(c){return box(c)<3});if(!pool.length)pool=FL.cards.slice();
 if(m==='flip')FL.q=shuf(pool);else if(m==='learn'||m==='write'){FL.q=shuf(pool).slice(0,12);FL.n0=FL.q.length;FL.right=0}
 else if(m==='match'){newMatch()}
 route()}
function flashStopT(){if(FL.tm){clearInterval(FL.tm);FL.tm=null}}
function body(){var m=FL.mode;if(m==='flip')return flipB();if(m==='learn'||m==='write')return learnB();if(m==='match')return matchB();return''}
function top(t,p){return '<div class="row" style="margin-bottom:8px"><button class="btn sec sm" data-fl="menu">‹ Modes</button><span class="small mute" style="margin-left:auto">'+t+'</span></div>'+bar(p)}
function draw(){var e=document.getElementById('fl');if(e)e.innerHTML=body()}
/* flip */
function flipB(){if(FL.i>=FL.q.length){return done('Flip cards')}var c=FL.q[FL.i];
 return top((FL.i+1)+' of '+FL.q.length,100*FL.i/FL.q.length)+'<div class="fcard'+(FL.flip?' flip':'')+'" data-fl="flip" role="button" tabindex="0" aria-label="Flip card. '+(FL.flip?'Showing meaning':'Showing term')+'"><div class="fci"><div class="ff"><span>'+esc(c.h)+'</span></div><div class="fb"><span>'+esc(c.x)+(c.f?'<code>'+esc(c.f)+'</code>':'')+'</span></div></div></div><div class="row fbtn"><button class="btn sec block" data-fl="again">Still learning</button><button class="btn block" data-fl="know">Know it</button></div><p class="small mute" style="text-align:center">Tap the card to flip. Swipe right for Know it, left for Still learning.</p>'}
function done(t){var k=FL.known.length,a=FL.again.length;return '<div class="card fdone"><h3>'+t+' complete</h3><p>'+k+' known'+(a?', '+a+' still learning':'')+'.</p><div class="row">'+(a?'<button class="btn" data-fl="redo">Study the '+a+' again</button>':'')+'<button class="btn sec" data-fl="menu">Back to modes</button></div></div>'}
/* learn / write */
function distract(c){var pool=shuf(FL.cards.filter(function(x){return x.h!==c.h}));if(pool.length<3)pool=pool.concat(shuf(fromTopics(ALL).filter(function(x){return x.h!==c.h})));var s=[],seen={};pool.forEach(function(x){if(s.length<3&&!seen[x.h]){seen[x.h]=1;s.push(x.h)}});return s}
function learnB(){if(!FL.q.length)return doneL();var c=FL.q[0],useW=FL.mode==='write'||box(c)>=2,p=100*FL.right/Math.max(1,FL.n0);
 var h=top(FL.right+' of '+FL.n0+' learned',p)+'<div class="card lq"><div class="small mute">What term matches this meaning?</div><p class="lqt">'+esc(short(c.x))+'</p>';
 if(FL.ans){var ok=FL.ans.ok;h+='<div class="fb2 '+(ok?'ok':'bad')+'" role="status"><b>'+(ok?'Correct':'Not quite')+'</b>'+(ok?'':' The answer is <b>'+esc(c.h)+'</b>.')+'</div>'+(ok?'':'<div class="row"><button class="btn sec sm" data-fl="override">I was right</button></div>')+'<button class="btn block" data-fl="next" autofocus>Continue</button></div>';return h}
 if(!useW){FL.opts=FL.opts&&FL.optc===c?FL.opts:shuf(distract(c).concat([c.h]));FL.optc=c;h+='<div class="lopts">'+FL.opts.map(function(o,i){return '<button class="opt" data-fl="pick:'+i+'">'+esc(o)+'</button>'}).join('')+'</div></div>'}
 else h+='<form class="row lw" data-fl="form"><input id="flw" type="text" autocomplete="off" autocapitalize="none" spellcheck="false" placeholder="Type the term" aria-label="Type the term"><button class="btn" type="submit">Check</button></form><button class="btn ghost sm" data-fl="skip">I don\'t know</button></div>';
 return h}
function doneL(){var r=FL.right;return '<div class="card fdone"><h3>Round complete</h3><p>You learned '+r+' of '+FL.n0+' cards this round.</p><div class="row"><button class="btn" data-fl="mode:'+FL.mode+'">Another round</button><button class="btn sec" data-fl="menu">Back to modes</button></div></div>'}
function grade(ok,typed){var c=FL.q[0];FL.ans={ok:ok};if(ok){setBox(c,box(c)+1);window.sfx&&sfx('ok')}else{setBox(c,0);window.sfx&&sfx('no')}}
function nextL(){var c=FL.q.shift(),ok=FL.ans&&FL.ans.ok;
 if(ok){if(FL.mode==='learn'&&box(c)<2)FL.q.splice(Math.min(4,FL.q.length),0,c);else FL.right++}else FL.q.splice(Math.min(3,FL.q.length),0,c);
 FL.ans=null;FL.opts=null;if(!FL.q.length){var d=dq();d.l+=FL.right;save()}draw();var f=document.getElementById('flw');if(f)f.focus()}
/* match */
function newMatch(){var pool=shuf(FL.cards.filter(function(c){return box(c)<3}));if(pool.length<6)pool=shuf(FL.cards);var ch=pool.slice(0,6);FL.tiles=shuf(ch.map(function(c,i){return{k:i,s:c.h,side:0}}).concat(ch.map(function(c,i){return{k:i,s:short(c.x).slice(0,70),side:1}})));FL.dn={};FL.sel=null;FL.pen=0;FL.t0=Date.now();FL.fin=false;FL.bad=-1;
 flashStopT();FL.tm=setInterval(function(){var e=document.getElementById('flt');if(!e){flashStopT();return}e.textContent=((Date.now()-FL.t0)/1000+FL.pen).toFixed(1)+' s'},100)}
function matchB(){var left=FL.tiles.filter(function(t,i){return !FL.dn[i]}).length;if(FL.fin){var tt=FL.res,key='m:'+FL.deck,best=(S.fcm||{})[key];return '<div class="card fdone"><h3>Matched in '+tt.toFixed(1)+' s</h3><p>'+(best&&best<=tt?'Best: '+best.toFixed(1)+' s':'New best time!')+'</p><div class="row"><button class="btn" data-fl="mode:match">Play again</button><button class="btn sec" data-fl="menu">Back to modes</button></div></div>'}
 return top('Time <b id="flt">0.0 s</b>',100*(12-left)/12)+'<div class="mgrid">'+FL.tiles.map(function(t,i){return FL.dn[i]?'<span class="mt gone"></span>':'<button class="mt'+(FL.sel===i?' sel':'')+(FL.bad===i?' bad':'')+'" data-fl="tile:'+i+'" aria-pressed="'+(FL.sel===i)+'">'+esc(t.s)+'</button>'}).join('')+'</div><p class="small mute" style="text-align:center">Tap a term, then its meaning. A miss adds 2 seconds.</p>'}
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-fl]');if(!b||!document.getElementById('main'))return;var a=b.dataset.fl;if(a==='form')return;var k=a.split(':');
 if(k[0]==='deck'){flashDeck(k[1]);route();return}
 if(a==='change'){FL.deck=null;FL.mode=null;route();return}
 if(a==='menu'){flashStopT();FL.mode=null;route();return}
 if(k[0]==='mode'){begin(k[1]);return}
 if(a==='flip'){FL.flip=!FL.flip;var c=document.querySelector('.fcard');if(c){c.classList.toggle('flip',FL.flip)}return}
 if(a==='know'||a==='again'){var c2=FL.q[FL.i];if(!c2)return;if(a==='know'){FL.known.push(c2);setBox(c2,box(c2)+1);window.sfx&&sfx('ok')}else{FL.again.push(c2);setBox(c2,0)}FL.i++;FL.flip=false;draw();if(FL.i>=FL.q.length){var d=dq();d.l+=FL.known.length;save()}return}
 if(a==='redo'){FL.q=shuf(FL.again);FL.i=0;FL.known=[];FL.again=[];FL.flip=false;draw();return}
 if(k[0]==='pick'){if(FL.ans)return;var c3=FL.q[0];grade(FL.opts[+k[1]]===c3.h);draw();return}
 if(a==='skip'){if(FL.ans)return;grade(false);draw();return}
 if(a==='override'){var c4=FL.q[0];FL.ans={ok:true};setBox(c4,1);draw();return}
 if(a==='next'){nextL();return}
 if(k[0]==='tile'&&FL.mode==='match'){var i=+k[1],t=FL.tiles[i];if(FL.dn[i]||FL.fin)return;if(FL.sel===null||FL.sel===i){FL.sel=FL.sel===i?null:i;FL.bad=-1;draw();return}
  var o=FL.tiles[FL.sel];if(o.side!==t.side&&o.k===t.k){FL.dn[i]=1;FL.dn[FL.sel]=1;FL.sel=null;FL.bad=-1;window.sfx&&sfx('ok');if(FL.tiles.every(function(x,j){return FL.dn[j]})){flashStopT();FL.fin=true;FL.res=(Date.now()-FL.t0)/1000+FL.pen;if(!S.fcm)S.fcm={};var kk='m:'+FL.deck;if(!S.fcm[kk]||FL.res<S.fcm[kk])S.fcm[kk]=FL.res;save()}}
  else{FL.pen+=2;FL.bad=i;FL.sel=null;window.sfx&&sfx('no')}draw();return}});
document.addEventListener('submit',function(e){var f=e.target.closest&&e.target.closest('[data-fl="form"]');if(!f)return;e.preventDefault();if(FL.ans)return;var v=document.getElementById('flw').value,c=FL.q[0];grade(close(v,c.h));draw()});
document.addEventListener('keydown',function(e){if(!document.getElementById('fl')||e.target.tagName==='INPUT')return;if(FL.mode==='flip'){if(e.key===' '||e.key==='Enter'){e.preventDefault();FL.flip=!FL.flip;var c=document.querySelector('.fcard');if(c)c.classList.toggle('flip',FL.flip)}else if(e.key==='ArrowRight'){var b=document.querySelector('[data-fl="know"]');b&&b.click()}else if(e.key==='ArrowLeft'){var b2=document.querySelector('[data-fl="again"]');b2&&b2.click()}}
 else if((FL.mode==='learn'||FL.mode==='write')&&FL.ans&&e.key==='Enter'){e.preventDefault();nextL()}});
/* swipe */
var sx=null;document.addEventListener('pointerdown',function(e){var c=e.target.closest&&e.target.closest('.fcard');sx=c?{x:e.clientX,y:e.clientY,c:c}:null});
document.addEventListener('pointerup',function(e){if(!sx)return;var dx=e.clientX-sx.x,dy=Math.abs(e.clientY-sx.y);sx=null;if(Math.abs(dx)>70&&dy<60){var b=document.querySelector('[data-fl="'+(dx>0?'know':'again')+'"]');b&&b.click()}});
})();
