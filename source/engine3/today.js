/* ===== Today: compulsory placement check, learning category, 15-minute mission that mixes new and earlier units, Practice front and center ===== */
(function(){
var CU=window.__cu;if(!CU)return;
function done(){return !!(S.dg&&S.dg!=='skip'&&S.dgr)}
/* learning category, from the placement check. Shown to the student, and it only changes pacing */
function cat(){var c=S.cu;if(!c)return null;var n=0,f=0,s=0,tot=0;Object.keys(c.base).forEach(function(t){var v=c.base[t];tot++;if(v==='n')n++;else if(v==='f')f++;else s++});if(!tot)return null;
 if(s/tot>=.6)return{k:'Accelerator',d:'Most topics were already strong. Missions are mostly new material and harder questions, with short reviews.',nw:.6};
 if(n/tot>=.4)return{k:'Foundation builder',d:'Many topics start from the basics. Missions use shorter lessons, more worked examples and easier first questions.',nw:.4};
 return{k:'Gap closer',d:'A mix of strong and shaky topics. Missions repair the gaps first and keep strong topics fresh.',nw:.5}}
/* 1. the check is compulsory: only Me (settings, accessibility) opens until it is done */
var _rt=route;route=function(){if(!done()&&cur!=='me'&&!(typeof Z!=='undefined'&&Z&&!Z.fin)){var m=$('main');[].forEach.call(document.querySelectorAll('#nav button'),function(b){b.setAttribute('aria-current',b.dataset.t===cur?'true':'false')});m.className='view-in';
  m.innerHTML='<div class="card gate"><h2>Start with the placement check</h2><p>About 15 minutes. It decides where you start, so every lesson and practice set after it fits you.</p><ul class="plu"><li>Tap <b>I have not learned this</b> on any question. That is useful information, not a mistake.</li><li>You can pause and come back. Your answers are saved.</li><li>There is no grade.</li></ul><button class="btn" id="dgs">'+(S.dgp?'Continue':'Start the check')+'</button></div>';window.scrollTo(0,0);return}
 return _rt.apply(this,arguments)};
/* 2. Today replaces the premade unit list once the plan exists */
function mins(){return minsToday()}
function mCard(){var due=dueIds().length,k=cat(),md=missionDone();
 return '<div class="cont"><div style="flex:1"><div class="small" style="opacity:.9">Today · about 15 min</div><h2>'+(md?'Mission done':'Daily mission')+'</h2><div class="small" style="opacity:.9">New material, then earlier units mixed in</div></div><button class="btn" id="msn">'+(md?'Again':'Start')+'</button></div>'+
 '<div class="row" style="margin-bottom:10px">'+(due?'<span class="chip">'+due+' due for review</span>':'')+(k?'<span class="chip">'+esc(k.k)+'</span>':'')+'</div>'}
var _vl=viewLearn;viewLearn=function(){var a=CU.items();if(!a||!done())return _vl.apply(this,arguments);
 var k=cat(),h=greet()+mCard()+CU.card();
 h+='<button class="card prc" data-t2="practice" style="text-align:left;width:100%"><h3>Practice</h3><p class="small mute">Adaptive sets, timed blitz, mock test and review of what you missed.</p></button>';
 if(k)h+='<div class="card"><b>Your learning category: '+esc(k.k)+'</b><p class="small mute" style="margin-top:4px">'+esc(k.d)+' Your plan re-sorts itself as your answers change.</p></div>';
 return h};
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-t2]');if(b)go(b.dataset.t2)});
/* 3. 15-minute mission: warm-up from earlier units, new step from the plan, spaced review, mixed set across units, stretch */
startMission=function(){var a=CU.items();if(!a){startPractice(ALL,12);return}
 var k=cat()||{nw:.5},steps=[],used=[],last=[],f=CU.focus(a);
 function add(n,tg,topics){for(var i=0;i<n;i++){var id=coachPick({topics:topics&&topics.length?topics:ALL,exclude:used,last:last,target:tg});if(!id)break;used.push(id);last.push(QS[QI[id]].t);steps.push({k:'try',it:mkItem(id)})}}
 var earlier=a.filter(function(x){return x.s==='keep'||x.s==='done'||x.us.done>0}).map(function(x){return x.t}),started=a.filter(function(x){return (S.stat[x.t]||[0,0])[1]>0}).map(function(x){return x.t});
 add(3,.92,earlier.length?earlier:null);
 var x=f[0];
 if(x&&x.s==='learn'&&!x.back){var L=x.u.lessons.filter(function(l){return !x.us.us.d[l.id]})[0]||x.u.lessons[0];lessonSteps(x.u,L).forEach(function(s){if(s.k==='card')s.ut=x.u.title;steps.push(s)});add(2,.9,[x.t])}
 else if(x){var pt=f.filter(function(y){return y.s!=='learn'||y.back}).slice(0,2).map(function(y){return y.t});add(Math.round(4+2*k.nw),CU.tgt(x,true),pt)}
 else add(4,.8);
 var due=dueIds().slice(0,12).map(function(y){return y[0]}),rv=0;due.forEach(function(id){if(rv<4&&used.indexOf(id)<0){used.push(id);steps.push({k:'try',it:mkItem(id)});rv++}});if(rv<2)add(2-rv,.85,started.length?started:null);
 add(3,.78,started.length?started:null);
 add(2,.65,f.length?f.map(function(y){return y.t}):null);
 startSess({kind:'mission',title:'Daily mission',steps:steps,remed:true})};
/* every test-like session gets a fresh random question order each time, for every student; lessons keep their teaching order */
var _ss=startSess;startSess=function(o){if(o&&o.steps&&o.kind!=='lesson'&&o.kind!=='mission'&&o.steps.every(function(s){return s.k==='try'}))o.steps=shuf(o.steps);return _ss.apply(this,arguments)};
/* nav label */
TABS[0][1]='Today';route();var sp=document.querySelector('#nav button[data-t="learn"] span');if(sp)sp.textContent='Today';
})();
