/* ===== sessions: lesson / unit test / practice / blitz / mock / review ===== */
var Z=null,tmr=null,STUDY=P.study||null;
function mkItem(id,extra){
 var q=QS[QI[id]],it={id:id,q:q,done:false,ok:null,gain:0,help:0};
 if(q.type==='mcq'||q.type==='multi'){it.perm=shuf(q.o.map(function(_,i){return i}));it.sel=[];it.off={}}
 else if(q.type==='short')it.val='';
 else if(q.type==='order'){it.pool=shuf(q.items.map(function(_,i){return i}));it.seq=[]}
 else if(q.type==='match'){it.rperm=shuf(q.pairs.map(function(_,i){return i}));it.mp={};it.pick=null}
 if(extra)for(var k in extra)it[k]=extra[k];return it}
function isOk(it){var q=it.q;
 if(q.type==='mcq')return it.sel.length===1&&it.sel[0]===0;
 if(q.type==='multi')return q.a.slice().sort().join()===it.sel.slice().sort().join();
 if(q.type==='short'){it.res=gradeShort(q,it.val);return it.res.ok}
 if(q.type==='order')return it.seq.length===q.items.length&&it.seq.every(function(v,i){return v===i});
 if(q.type==='match')return q.pairs.every(function(_,i){return it.mp[i]===i});return false}
function answered(it){var q=it.q;
 if(q.type==='mcq'||q.type==='multi')return it.sel.length>0;
 if(q.type==='short')return it.val.trim().length>0;
 if(q.type==='order')return it.seq.length===q.items.length;
 if(q.type==='match')return cnt(it.mp)===q.pairs.length;return false}
function W3(s){var o={};(String(s).toLowerCase().match(/[a-z0-9µΩ°]{3,}/g)||[]).forEach(function(w){o[w]=1});return o}
function overlap(a,b){var n=0;for(var k in a)if(b[k])n++;return n}
/* the study card that best matches a question */
function helpCard(q){
 var cs=(STUDY&&STUDY.cards[q.t])||[];if(!cs.length)return null;var qw=W3(q.q+' '+(q.o?q.o.join(' '):'')+' '+(q.w||'')),best=cs[0],bs=-1;
 cs.forEach(function(c){var s=overlap(qw,W3(c[0]+' '+c[1]+' '+(c[2]||'')));if(s>bs){bs=s;best=c}});return {h:best[0],t:best[1],f:best[2]}}
/* a similar question for follow-up practice */
function similar(q,avoid){
 var qw=W3(q.q),best=null,bs=-1e9;
 QS.forEach(function(c){if(c.id===q.id||c.t!==q.t||(avoid&&avoid.indexOf(c.id)>-1)||c.type==='multi')return;
  var s=overlap(qw,W3(c.q))+(c.fp&&c.fp===q.fp?6:0)+(c.type===q.type?2:0)-(c.l>q.l?4:0)-(S.seen[c.id]?3:0)-(c.l<q.l-1?2:0)+Math.random();
  if(s>bs){bs=s;best=c}});return best&&best.id}
function qBody(it,rev){
 var q=it.q,h='';
 if(q.fig)h+=figSVG(q.fig);if(q.svg)h+='<div class="figw">'+q.svg+'</div>';
 h+='<div class="qtext">'+esc(q.q)+'</div>';
 if(q.type==='multi')h+='<p class="small mute">Choose all that apply</p>';
 if(q.type==='mcq'||q.type==='multi'){
  h+='<div class="opts">';
  it.perm.forEach(function(oi,k){var sel=it.sel.indexOf(oi)>-1,good=q.type==='multi'?q.a.indexOf(oi)>-1:oi===0,cls='opt';
   if(rev){if(good)cls+=' ok';else if(sel)cls+=' bad'}else if(sel)cls+=' sel';if(it.off[oi]&&!rev)cls+=' off';
   h+='<button class="'+cls+'" data-oi="'+oi+'"'+(rev?' disabled':'')+' aria-pressed="'+sel+'"><b>'+'ABCDEF'[k]+'</b><span>'+esc(q.o[oi])+'</span></button>'});h+='</div>'}
 else if(q.type==='short'){
  var ph=q.num?(q.num.u?'Number and unit':'Number'):'Your answer';
  h+='<div class="ans"><input id="sv" type="text" inputmode="'+(q.num?'text':'text')+'" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="'+esc(ph)+'" value="'+esc(it.val)+'"'+(rev?' disabled class="'+(it.ok?'ok':'bad')+'"':'')+'></div>'}
 else if(q.type==='order'){
  h+='<div class="chips">';it.seq.forEach(function(v,k){h+='<button class="ch '+(rev?(v===k?'ok':'bad'):'')+'" data-sq="'+k+'"'+(rev?' disabled':'')+'>'+esc(q.items[v])+'</button>'});
  h+='</div><div class="chips">';it.pool.forEach(function(v){if(it.seq.indexOf(v)<0)h+='<button class="ch" data-po="'+v+'">'+esc(q.items[v])+'</button>'});h+='</div>'}
 else if(q.type==='match'){
  h+='<div class="mt"><div class="chips" style="flex-direction:column">';
  q.pairs.forEach(function(p,i){var pi=it.mp[i]!==undefined;h+='<button class="ch" data-ml="'+i+'"'+(pi?' data-p="1"':'')+(it.pick===i?' style="outline:3px solid var(--sel)"':'')+(rev?' disabled':'')+'>'+esc(p[0])+'</button>'});
  h+='</div><div class="chips" style="flex-direction:column">';
  it.rperm.forEach(function(ri){var used=false;for(var k in it.mp)if(it.mp[k]===ri)used=true;h+='<button class="ch" data-mr="'+ri+'"'+(used?' data-p="1"':'')+(rev?' disabled':'')+'>'+esc(q.pairs[ri][1])+'</button>'});h+='</div></div>'}
 return h}
/* ---------- start ---------- */
function startSess(o){
 if(tmr){clearInterval(tmr);tmr=null}
 Z=o;Z.t0=Date.now();Z.i=0;Z.earned=0;Z.right=0;Z.wrong=0;Z.seenQ=[];Z.fin=false;Z.mains=Z.steps.filter(function(s){return s.k==='try'&&!s.follow||s.k==='card'}).length;Z.doneM=0;
 if(Z.secs){Z.end=Date.now()+Z.secs*1000;tmr=setInterval(tick,250)}
 combo=0;if(Z.adaptive)appendAdaptive();document.body.classList.add('insess');drawSess();window.scrollTo(0,0)}
function closeSess(){if(tmr){clearInterval(tmr);tmr=null}addMins(Z);save();Z=null;document.body.classList.remove('insess');var s=$('sess');if(s)s.remove();route()}
function tick(){if(!Z){clearInterval(tmr);tmr=null;return}var el=$('tm');var r=Math.max(0,Math.ceil((Z.end-Date.now())/1000));if(el)el.textContent=Math.floor(r/60)+':'+('0'+r%60).slice(-2);if(r<=0)finishSess()}
function pickPool(ids,n,lv){
 var pool=shuf(QS.filter(function(q){return ids.indexOf(q.t)>-1&&(!lv||lv.indexOf(q.l)>-1)}));
 var fresh=pool.filter(function(q){return !S.seen[q.id]}),rest=pool.filter(function(q){return S.seen[q.id]}).sort(function(a,b){return (S.miss[b.id]?1:0)-(S.miss[a.id]?1:0)||S.seen[a.id]-S.seen[b.id]});
 /* spread near-identical variants: one per family first, recently used families last */
 var fam={},first=[],dup=[];fresh.forEach(function(q){var k=q.fp||q.id;if(fam[k]||(S.rf&&S.rf.indexOf(q.fp)>-1)){dup.push(q)}else{fam[k]=1;first.push(q)}});
 return first.concat(dup).concat(rest).slice(0,n).map(function(q){return q.id})}
function mixByLevel(topics,n,w){ /* w = [e,m,h] shares */
 var out=[],used={};[1,2,3].forEach(function(l,k){var c=Math.round(n*w[k]);pickPool(topics,c+6,[l]).forEach(function(id){if(c>0&&!used[id]){used[id]=1;out.push(id);c--}})});
 var extra=pickPool(topics,n+10).filter(function(id){return !used[id]});while(out.length<n&&extra.length)out.push(extra.shift());
 return shuf(out).slice(0,n)}
function nextAdaptive(){var z0=Z,lastT=z0.seenQ.slice(-3).map(function(id){return QS[QI[id]].t});var first=z0.seenQ.length===0;var dueUsed=z0.seenQ.filter(function(id){return z0.dueSet&&z0.dueSet[id]}).length,id=coachPick({topics:z0.topics,exclude:z0.seenQ,last:lastT,target:first?.93:TARGET,dueLeft:Math.ceil(z0.N*.35)-dueUsed});var m=S.mem[id];if(m&&m[1]<=dayN()){z0.dueSet=z0.dueSet||{};z0.dueSet[id]=1}return id}
function nextAdaptiveOld(){
 var z=Z,tp=z.topics.slice();tp.sort(function(a,b){var ma=mastery(a),mb=mastery(b);return (ma.n?ma.acc:.3)-(mb.n?mb.acc:.3)});
 var t=Math.random()<.6?tp[0]:tp[Math.floor(Math.random()*tp.length)];
 var order=[z.lvl,z.lvl===1?2:z.lvl-1,3,2,1];
 for(var k=0;k<order.length;k++){var ids=pickPool([t],1,[order[k]]).filter(function(id){return z.seenQ.indexOf(id)<0});if(ids.length)return ids[0]}
 var any=pickPool(z.topics,3).filter(function(id){return z.seenQ.indexOf(id)<0});return any[0]}
function lessonSteps(u,L){var st=[],have={};
 L.cards.forEach(function(c){st.push({k:'card',c:c});var id=c.q;if(!id){var cw=W3(c.h+' '+c.t),bs=1,bq=null;QS.forEach(function(q){if(q.t!==u.id||q.l>2||(q.type!=='mcq'&&q.type!=='short')||have[q.id])return;var s=overlap(cw,W3(q.q));if(s>bs){bs=s;bq=q.id}});id=bq}
  if(id){have[id]=1;st.push({k:'try',it:mkItem(id)})}});return st}
function startLesson(uid,lid){
 var u=UN.filter(function(x){return x.id===uid})[0],L=u.lessons.filter(function(x){return x.id===lid})[0];
 startSess({kind:'lesson',title:L.title,unit:u,lesson:L,steps:lessonSteps(u,L),remed:true})}
function startUnitTest(uid){
 var u=UN.filter(function(x){return x.id===uid})[0];
 var ids=mixByLevel([uid],8,[.35,.4,.25]);
 startSess({kind:'unit',title:u.title+' test',unit:u,steps:ids.map(function(id){return {k:'try',it:mkItem(id)}}),nofb:true})}
function startPractice(topics,n){
 var lvl=1;if(topics.length&&mastery(topics[0]).acc>=.8)lvl=2;
 startSess({kind:'quick',title:'Practice',topics:topics,steps:[],lvl:lvl,streak:0,N:n||12,remed:true,adaptive:true})}
function appendAdaptive(){var id=nextAdaptive();if(id){Z.steps.push({k:'try',it:mkItem(id)});Z.seenQ.push(id)}Z.mains=Z.N}
function startBlitz(){var ids=shuf(pickPool(ALL,60).filter(function(id){var t=QS[QI[id]].type;return t==='mcq'||t==='short'}));
 startSess({kind:'blitz',title:'Blitz',steps:ids.map(function(id){return {k:'try',it:mkItem(id)}}),secs:60,auto:true})}
function startMock(){var ids=mixByLevel(ALL,30,[.3,.5,.2]);startSess({kind:'mock',title:'Mock test',steps:ids.map(function(id){return {k:'try',it:mkItem(id)}}),nofb:true,secs:35*60})}
function startReview(){var ids=shuf(Object.keys(S.miss).filter(function(id){return QI[id]!==undefined})).slice(0,12);if(!ids.length){toast('No misses to review');return}
 startSess({kind:'review',title:'Review',steps:ids.map(function(id){return {k:'try',it:mkItem(id)}}),remed:true})}
function startFromIds(ids,title){startSess({kind:'review',title:title,steps:ids.map(function(id){return {k:'try',it:mkItem(id)}}),remed:true})}
/* ---------- resolve / advance ---------- */
function resolveIt(it){
 if(it.done)return;it.ok=isOk(it);it.done=true;
 if(!Z.nofb){it.gain=(it.scaf||it.retry)?0:award(it.q,it.ok,0,it.help>0);Z.earned+=it.gain;if(it.ok)Z.right++;else Z.wrong++}
 if(Z.kind==='quick'){if(it.ok){Z.streak++;if(Z.streak>=2){Z.lvl=Math.min(3,Z.lvl+1);Z.streak=0}}else{Z.streak=0;Z.lvl=Math.max(1,Z.lvl-1)}}
 if(!it.follow)Z.doneM++;
 if(it.ok){burst();xpFloat(it.gain)}}
function advance(){
 if(!Z)return;Z.i++;
 if(Z.adaptive&&Z.i>=Z.steps.length&&Z.seenQ.length<Z.N)appendAdaptive();
 if(Z.i>=Z.steps.length)return finishSess();
 if(Z.steps[Z.i].k==='card')Z.doneM++;
 drawSess();window.scrollTo(0,0)}
function explainNow(){
 var st=Z.steps[Z.i],it=st.it;Z.steps.splice(Z.i+1,0,{k:'explain',it:it,st:0,sh:1});Z.i++;drawSess();window.scrollTo(0,0)}
function followUp(it){S.xp+=3;S.dxp[today()]=(S.dxp[today()]||0)+3;Z.earned+=3;var avoid=Z.seenQ.concat([it.id]);var id=similar(it.q,avoid);if(!id){advance();return}
 Z.seenQ.push(id);Z.steps.splice(Z.i+1,0,{k:'try',it:mkItem(id),follow:true});Z.i++;drawSess();window.scrollTo(0,0)}
function finishSess(){
 var z=Z;if(!z||z.fin)return;if(tmr){clearInterval(tmr);tmr=null}
 if(z.nofb){z.steps.forEach(function(s){if(s.k!=='try')return;var it=s.it;if(!it.done){if(answered(it)){it.ok=isOk(it);it.done=true}else{it.done=true;it.ok=false;it.skipped=true}}
  if(!it.skipped){it.gain=award(it.q,it.ok,0,false);if(it.ok){z.right++;z.earned+=it.gain}else z.wrong++}else S.miss[it.id]=1})}
 z.fin=true;addMins(z);if(z.kind==='mission'&&!missionDone()){S.msn=today();S.xp+=25;S.coins+=15;S.dxp[today()]=(S.dxp[today()]||0)+25;z.earned+=25;z.chest=1}
 var tries=z.steps.filter(function(s){return s.k==='try'&&s.it.done&&!s.it.skipped});
 z.pct=z.nofb?Math.round(100*z.right/Math.max(1,z.steps.filter(function(s){return s.k==='try'}).length)):(tries.length?Math.round(100*tries.filter(function(s){return s.it.ok}).length/tries.length):0);
 if(z.kind==='lesson'){var us=S.un[z.unit.id]=S.un[z.unit.id]||{d:{}};if(!us.d[z.lesson.id]){us.d[z.lesson.id]=1;S.xp+=20;S.coins+=10;S.dxp[today()]=(S.dxp[today()]||0)+20;z.earned+=20;dq().l+=z.lesson.cards.length}}
 if(z.kind==='unit'){var u2=S.un[z.unit.id]=S.un[z.unit.id]||{d:{}};u2.best=Math.max(u2.best||0,z.pct);if(z.pct>=70&&!u2.pass){u2.pass=1;S.xp+=40;S.coins+=20;z.earned+=40;z.first=1}}
 if(z.kind!=='blitz'&&z.right>=10&&z.wrong===0){S.perfect++}
 S.days[today()]=1;checkBadges();save();hud();drawSess();
 if(z.kind==='unit'&&z.pct>=70||z.kind==='lesson'||z.pct===100)burst(true)}
/* ---------- render ---------- */
function drawSess(){
 var z=Z;if(!z)return;var s=$('sess');if(!s){s=document.createElement('div');s.id='sess';document.body.appendChild(s)}
 var st=z.steps[z.i],top='<div class="s-top"><button class="iconbtn" id="sx" aria-label="Close"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button><div class="prog"><i style="width:'+(z.fin?100:Math.min(100,100*z.doneM/Math.max(1,z.mains)))+'%"></i></div>'+(z.secs&&!z.fin?'<span class="timer" id="tm">–</span>':'')+'</div>',h=top+'<div class="s-body">',sheet='';
 if(z.fin)return drawResults(top);
 if(st.k==='card'){var c=st.c;
  h+='<div class="card lesson-card"><div class="row" style="margin-bottom:6px">'+mascot(S.cos.on.av,'think',52)+'<span class="tag">'+esc(z.unit.title)+'</span></div><h2>'+esc(c.h)+'</h2><p class="lc">'+esc(c.t)+'</p>'+(c.f?'<div class="fml">'+esc(c.f)+'</div>':'')+'</div>';
  var nx=z.steps[z.i+1];sheet='<div class="sheet plain"><div class="sheet-in"><div><button class="btn block" id="go">'+(nx&&nx.k==='try'?'Try it':'Continue')+'</button></div></div></div>'}
 else if(st.k==='explain'){var it=st.it,q=it.q,hc=helpCard(q);
  if(st.ex){var q2=st.it.q;h+='<div class="card explain"><div class="row">'+mascot(S.cos.on.av,'think',52)+'<h2>Worked example</h2></div><p class="small mute">Study how this one is solved. Then go back to yours.</p>'+(q2.svg?'<div class="fig">'+q2.svg+'</div>':'')+'<p class="lc" style="font-size:1.1rem"><b>'+esc(q2.q)+'</b></p>';
   var ss=q2.sol&&q2.sol.length?q2.sol:[q2.w||''];ss.slice(0,st.sh).forEach(function(t,k){h+='<div class="step"><b>Step '+(k+1)+'</b> '+clz(t,k===st.sh-1)+'</div>'});var mr=st.sh<ss.length;if(!mr)h+='<p class="small"><b>Answer:</b> '+esc(ansText(q2))+'</p>';
   sheet='<div class="sheet plain"><div class="sheet-in"><div><button class="btn block" id="'+(mr?'exs':'exb')+'">'+(mr?'Next step':'Back to my question')+'</button></div></div></div>';h+='</div>'}
  else{
  h+='<div class="card explain"><div class="row">'+mascot(S.cos.on.av,'think',52)+'<h2>Review the solution</h2></div>';
  var mine=q.type==='mcq'||q.type==='multi'?it.sel.map(function(i){return q.o[i]}).join('; '):q.type==='short'?it.val:'';
  h+='<p class="small mute">'+(mine?'You answered <b>'+esc(mine)+'</b>. ':'')+'Correct: <b>'+esc(ansText(q))+'</b></p>';
  if(st.st===0&&hc){h+='<div class="step"><b>Key idea · '+esc(hc.h)+'</b><p class="lc" style="font-size:1.05rem">'+esc(hc.t)+'</p>'+(hc.f?'<div class="fml">'+esc(hc.f)+'</div>':'')+'</div>';var ez=easier(q);sheet='<div class="sheet plain"><div class="sheet-in"><div>'+(ez?'<button class="btn block" id="exq">Try a simpler one first</button><button class="btn sec block" id="exn" style="margin-top:8px">Show me the steps</button>':'<button class="btn block" id="exn">Show me the steps</button>')+'</div></div></div>'}
  else{var steps=q.sol&&q.sol.length?q.sol:(q.w?[q.w]:['Re-read the key idea, then try a similar one.']);
   steps.slice(0,st.sh).forEach(function(t,k){h+='<div class="step"><b>Step '+(k+1)+'</b> '+clz(t,k===st.sh-1)+'</div>'});
   var more=st.sh<steps.length;sheet='<div class="sheet plain"><div class="sheet-in"><div><button class="btn block" id="'+(more?'exs':'exf')+'">'+(more?'Next step':'Try a similar one')+'</button></div></div></div>'}
  h+='</div>'}}
 else{var it=st.it,q=it.q,rev=it.done&&!z.nofb;
  h+=(st.follow?'<span class="tag" style="margin-bottom:8px">'+(st.scaf?'Warm-up: a simpler version':st.retry?'Your question again':'Similar problem')+'</span>':'')+qBody(it,rev);
  
  if(z.nofb){var last=z.i===z.steps.length-1;
   sheet='<div class="sheet plain"><div class="sheet-in"><div class="row">'+(z.i>0&&z.kind==='mock'?'<button class="btn sec" id="pv">Back</button>':'')+'<span class="sp"></span><button class="btn" id="nx"'+(z.kind!=='mock'&&!answered(it)?' disabled':'')+'>'+(last?'Finish':'Next')+'</button></div></div></div>'}
  else if(!rev){var need=q.type==='short'||q.type==='multi'||q.type==='order'||q.type==='match'||!!(window.IT&&IT[q.type]);
   sheet='<div class="sheet plain"><div class="sheet-in"><div class="row">'+(STUDY&&!z.auto?'<button class="btn sec sm" id="help">Show an example</button>':'')+'<span class="sp"></span>'+(need?'<button class="btn" id="chk"'+(answered(it)?'':' disabled')+'>Check</button>':'')+'</div></div></div>'}
  else{var ok=it.ok,hc=(!ok&&STUDY&&!st.follow)?null:null;
   sheet='<div class="sheet '+(ok?'ok':'bad')+'"><div class="sheet-in">'+mascot(S.cos.on.av,ok?'cheer':'oops',48)+'<div><h3>'+(ok?['Correct','Well done','Correct','Excellent'][z.i%4]:'Not yet')+(ok&&it.gain?' <span class="small">+'+it.gain+' XP</span>':'')+'</h3>'+(ok?'':'<div><b>Answer:</b> '+esc(ansText(q))+'</div>')+(q.w?'<div class="small">'+esc(q.w)+'</div>':'')+'<div class="btns">'+
    (!ok&&z.remed&&!st.follow?'<button class="btn bad" id="exp">Explain it</button><button class="btn sec" id="nx">Skip</button>':'<button class="btn '+(ok?'ok':'bad')+'" id="nx">Continue</button>')+'</div></div></div></div>'}}
 s.innerHTML=h+'</div>'+sheet;
 if(z.secs)tick();if(!z.brk&&Date.now()-z.t0>20*60000){z.brk=1;toast('20 minutes in. Stand up and stretch for 2 minutes?')}
 var inp=$('sv');if(inp&&!(st.it&&st.it.done)){inp.focus()}
 if(z.auto&&st.it&&st.it.done)setTimeout(function(){if(Z===z&&!z.fin&&z.steps[z.i]===st)advance()},st.it.ok?600:1300)}
function helpBox(it){var q=it.q,n=it.help,hc=helpCard(q),h='<div class="help"><b>Hint</b>';
 h+='<p class="small"><b>1.</b> '+esc(STUDY.stuck[0])+' '+esc(STUDY.stuck[1])+'</p>';
 if(n>=2&&hc)h+='<p class="small"><b>2. '+esc(hc.h)+'.</b> '+esc(hc.t)+(hc.f?' <code>'+esc(hc.f)+'</code>':'')+'</p>';
 if(n>=3)h+='<p class="small"><b>3.</b> '+(q.type==='mcq'?'Two wrong choices are gone. ':'')+esc(STUDY.stuck[2])+'</p>';
 return h+'<p class="small mute">A hint halves the XP for this question.</p></div>'}
function drawResults(top){
 var z=Z,s=$('sess'),tr=z.steps.filter(function(x){return x.k==='try'&&x.it.done&&!x.it.skipped}),all=z.steps.filter(function(x){return x.k==='try'}),by={},h=top+'<div class="s-body">',pass=z.kind==='unit'?z.pct>=70:true;
 tr.forEach(function(x){var t=x.it.q.t;by[t]=by[t]||[0,0];by[t][1]++;if(x.it.ok)by[t][0]++});
 var right=tr.filter(function(x){return x.it.ok}).length,miss=all.filter(function(x){return x.it.done&&!x.it.ok}).map(function(x){return x.it});
 h+='<div class="card" style="text-align:center">'+mascot(S.cos.on.av,pass&&z.pct>=60?'cheer':'think',88)+'<div class="score">'+(z.kind==='lesson'?'Lesson done':z.pct+'%')+'</div>'+(z.chest?'<p><b>Mission complete! +25 XP</b></p>':'')+(z.kind==='unit'?'<p><b>'+(z.pct>=70?(z.first?'Unit passed! +40 XP':'Unit passed'):'Pass mark is 70%. Review the lessons and try again.')+'</b></p>':'')+'<p class="mute">'+right+' correct · +'+z.earned+' XP'+(z.kind==='blitz'?'':'')+'</p></div>';
 if(Object.keys(by).length>1){h+='<div class="card"><h3>By topic</h3>';Object.keys(by).forEach(function(t){var p=by[t];h+='<div class="bar2"><span>'+esc(TOP[t].name)+'</span><span class="tr"><i style="width:'+(100*p[0]/p[1])+'%"></i></span><span>'+p[0]+'/'+p[1]+'</span></div>'});h+='</div>'}
 if(miss.length){h+='<div class="card"><h3>Missed</h3>';miss.forEach(function(it){h+='<details><summary>'+esc(it.q.q.slice(0,120))+'</summary><div class="in">'+(it.q.fig?figSVG(it.q.fig):'')+(it.q.svg?'<div class="figw">'+it.q.svg+'</div>':'')+'<p><b>Answer:</b> '+esc(ansText(it.q))+'</p>'+(it.q.sol?it.q.sol.map(function(t,k){return '<div class="step"><b>'+(k+1)+'</b> '+esc(t)+'</div>'}).join(''):(it.q.w?'<p>'+esc(it.q.w)+'</p>':''))+'</div></details>'});h+='</div>'}
 var sheet='<div class="sheet plain"><div class="sheet-in"><div class="row">'+(miss.length?'<button class="btn sec" id="rtry">Practice misses</button>':'')+'<span class="sp"></span><button class="btn" id="done">Done</button></div></div></div>';
 s.innerHTML=h+'</div>'+sheet;
 s.dataset.miss=miss.map(function(i){return i.id}).join(',')}
/* ---------- events ---------- */
document.addEventListener('input',function(e){if(e.target.id==='sv'&&Z){var it=Z.steps[Z.i].it;if(!it)return;it.val=e.target.value;var b=$('chk');if(b)b.disabled=!it.val.trim();var n=$('nx');if(n&&Z.nofb&&Z.kind!=='mock')n.disabled=!it.val.trim()}});
document.addEventListener('keydown',function(e){if(!Z||Z.fin)return;if(e.key==='Enter'&&e.target.id==='sv'){var st=Z.steps[Z.i],it=st.it;if(Z.nofb){if(it.val.trim())advance();return}if(it.val.trim()&&!it.done){resolveIt(it);drawSess()}}});
document.addEventListener('click',function(e){
 var s=$('sess');if(!s||!s.contains(e.target)||!Z)return;var t=e.target,id=t.id||(t.closest('button')||{}).id,z=Z;
 if(id==='sx'){if(z.fin||confirm('Leave? Progress in this session is kept.'))closeSess();return}
 if(id==='done'){closeSess();return}
 if(id==='rtry'){var ids=s.dataset.miss.split(',').filter(Boolean);closeSess();startFromIds(ids,'Practice misses');return}
 if(z.fin)return;var st=z.steps[z.i];
 if(id==='go'){advance();return}
 if(st.k==='explain'){if(id==='exb'){var src=st.src;Z.steps.splice(Z.i,1);Z.i=src;drawSess();return}if(id==='exq'){var ez=easier(st.it.q);Z.seenQ.push(ez);Z.steps.splice(Z.i+1,0,{k:'try',it:mkItem(ez),follow:true,scaf:true},{k:'explain',it:st.it,st:1,sh:1});Z.i++;drawSess();window.scrollTo(0,0)}else if(id==='exn'){st.st=1;drawSess()}else if(id==='exs'){st.sh++;drawSess()}else if(id==='exf'){retryThen(st.it)}return}
 var it=st.it,q=it.q;
 var o=t.closest('.opt');
 if(o&&!it.done){var oi=+o.dataset.oi,k=it.sel.indexOf(oi);
  if(q.type==='multi'){if(k>-1)it.sel.splice(k,1);else it.sel.push(oi);drawSess();return}
  it.sel=[oi];if(z.nofb){drawSess();if(z.kind==='unit'||z.kind==='mock'){}return}resolveIt(it);drawSess();return}
 var sq=t.closest('[data-sq]');if(sq&&!it.done){it.seq.splice(+sq.dataset.sq,1);drawSess();return}
 var po=t.closest('[data-po]');if(po&&!it.done){it.seq.push(+po.dataset.po);drawSess();return}
 var ml=t.closest('[data-ml]');if(ml&&!it.done){var li=+ml.dataset.ml;if(it.mp[li]!==undefined)delete it.mp[li];it.pick=li;drawSess();return}
 var mr=t.closest('[data-mr]');if(mr&&!it.done){var ri=+mr.dataset.mr;for(var kk in it.mp)if(it.mp[kk]===ri)delete it.mp[kk];if(it.pick!==null){it.mp[it.pick]=ri;it.pick=null}drawSess();return}
 if(id==='chk'){if(answered(it)){resolveIt(it);drawSess()}}
 else if(id==='help'){exampleNow()}
 else if(id==='exp'){explainNow()}
 else if(id==='nx'){if(!it.done&&!z.nofb)return;if(z.nofb&&z.i===z.steps.length-1)finishSess();else advance()}
 else if(id==='pv'){z.i--;drawSess()}
});

function clz(t,live){var i=t.lastIndexOf('=');if(!live||i<0||i>=t.length-2)return esc(t);var a=t.slice(0,i+1),b=t.slice(i+1);return esc(a)+'<span class="clz" tabindex="0" role="button" aria-label="Tap to reveal">'+esc(b)+'</span><span class="small mute"> (try it, then tap)</span>'}
function exampleNow(){var st=Z.steps[Z.i],q=st.it.q,sid=similar(q,[q.id]);if(!sid){toast('No example for this one');return}st.it.help=1;Z.steps.splice(Z.i+1,0,{k:'explain',ex:1,src:Z.i,it:mkItem(sid),sh:1,st:1});Z.i++;drawSess();window.scrollTo(0,0)}

function easier(q){var qw=W3(q.q),best=null,bs=-1e9,qb=(q.b!==undefined?q.b:(q.l-2)*.8);
 QS.forEach(function(c){if(c.id===q.id||c.t!==q.t||c.type==='multi'||c.type==='order'||c.type==='match')return;var cb=(c.b!==undefined?c.b:(c.l-2)*.8);if(c.l>q.l||cb>qb-.2)return;
  var sc=overlap(qw,W3(c.q))+(c.fp&&c.fp===q.fp?8:0)+(c.type===q.type?2:0)-(S.seen[c.id]?1:0)+Math.random()*1.5;if(sc>bs){bs=sc;best=c.id}});return best}
function retryThen(it){S.xp+=3;S.dxp[today()]=(S.dxp[today()]||0)+3;Z.earned+=3;var avoid=Z.seenQ.concat([it.id]),sid=similar(it.q,avoid),add=[{k:'try',it:mkItem(it.id),follow:true,retry:true}];if(sid){Z.seenQ.push(sid);add.push({k:'try',it:mkItem(sid),follow:true})}Z.steps.splice.apply(Z.steps,[Z.i+1,0].concat(add));Z.i++;drawSess();window.scrollTo(0,0)}
