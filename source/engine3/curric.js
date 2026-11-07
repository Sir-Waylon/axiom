/* ===== My plan: placement check -> personal curriculum -> dedicated practice -> plan keeps re-adapting from live answers ===== */
(function(){
var REF=(P.meta&&P.meta.refresh)||null;
function emaOf(t){return S.ema&&S.ema[t]!==undefined?S.ema[t]:.5}
function unitBy(id){for(var i=0;i<UN.length;i++)if(UN[i].id===id)return UN[i];return null}
/* 1. build the baseline once, from the placement check. Skipped topics start from the basics, misses get a repair lesson, hits are review-only */
function build(skipped){
 var base={},n0={},sk={};
 UN.forEach(function(u){var t=u.id;if(!TOP[t])return;
  if(skipped&&skipped[t]||(S.dk&&S.dk[t]&&S.dgr&&S.dgr[t]!==1)){base[t]='n';sk[t]=1}
  else if(S.dgr&&S.dgr[t]===1)base[t]='s';
  else if(S.dgr&&S.dgr[t]===0)base[t]='f';
  else base[t]='n';
  n0[t]=(S.stat[t]||[0,0])[1]});
 S.cu={made:today(),base:base,n0:n0,sk:sk}}
function ensure(){if(!S.cu&&S.dg&&S.dg!=='skip'&&S.dgr)build(null);return S.cu}
/* 2. live status of every topic. Recomputed from current answers, so the plan adapts without any manual step */
function info(u){var t=u.id,c=S.cu,b=c.base[t]||'n',st=S.stat[t]||[0,0],n=Math.max(0,st[1]-(c.n0[t]||0)),e=emaOf(t),us=unitState(u),ml=mastery(t);
 var learn=b==='n'?us.all:b==='f'?us.done>0:true,prac=learn&&n>=8&&e>=.6,prove=us.pass||(prac&&ml.lv>=3&&e>=.75),
  slip=(b==='s'||prove)&&n>=6&&e<.5&&!us.pass,stuck=learn&&n>=10&&e<.4&&!prove;
 var s=slip?'slip':prove?'done':b==='s'?'keep':!learn?'learn':!prac?'practice':'prove';
 return{u:u,t:t,b:b,s:s,n:n,e:e,learn:learn,prac:prac,prove:prove,stuck:stuck,us:us}}
function items(){var c=ensure();if(!c)return null;var a=UN.filter(function(u){return TOP[u.id]}).map(info);
 a.forEach(function(x,i){if(!x.stuck)return;var pid=REF&&REF[x.t]&&REF[x.t][0],p=pid?a.filter(function(y){return y.t===pid})[0]:a[i-1];
  if(p&&(p.s==='keep'||p.s==='done'))p.back=x.t});
 return a}
var ACT={learn:1,practice:1,prove:1,slip:1};
function focus(a){var f=a.filter(function(x){return x.back||ACT[x.s]});f.sort(function(x,y){return (y.back?2:y.s==='slip'?1:0)-(x.back?2:x.s==='slip'?1:0)});return f}
function snap(a){var o={};a.forEach(function(x){o[x.t]=x.back?'back':x.s});return o}
var LBL={learn:'Learn',practice:'Practice',prove:'Prove it',slip:'Slipped',keep:'Strong',done:'Done',back:'Back up'};
function why(x){var c=S.cu;if(x.back)return 'Back up one step: '+TOP[x.back].name+' is hard right now and needs this first.';
 if(x.s==='slip')return 'Recent answers slipped, so this is back on the plan.';
 if(x.s==='done')return 'You proved this one.';
 if(x.s==='keep')return 'Right on the placement check. Review only, no lessons to repeat.';
 if(x.stuck)return 'Tough lately. Practice here is easier on purpose, and the step before it was added.';
 if(x.b==='n')return c.sk&&c.sk[x.t]?'You skipped this in the placement check, so we start from the basics.':'Not placed yet. Starting from the basics.';
 return 'Missed on the placement check. A short lesson, then practice.'}
/* 3. dedicated practice. Which topic, and how hard, follows the live status */
function tgt(x,first){return x.back?.95:x.s==='slip'?.9:x.stuck?.93:x.s==='prove'?.7:x.s==='practice'?(first?.93:.85):.85}
function startPlan(){var a=items();if(!a)return;var f=focus(a);
 if(!f.length){toast('Plan complete. Mixed review is next.');startPractice(ALL,12);return}
 var x=f[0];if(x.s==='learn'&&!x.back){var L=x.u.lessons.filter(function(l){return !x.us.us.d[l.id]})[0]||x.u.lessons[0];startLesson(x.t,L.id);return}
 var pt=f.filter(function(y){return y.s!=='learn'||y.back}).slice(0,3),rv=a.filter(function(y){return y.s==='keep'||y.s==='done'}).sort(function(p,q){return p.e-q.e})[0],tp=pt.map(function(y){return y.t});if(rv&&tp.indexOf(rv.t)<0)tp.push(rv.t);
 startSess({kind:'quick',title:'My plan',topics:tp,steps:[],lvl:1,streak:0,N:12,remed:true,adaptive:true,plan:{snap:snap(a)}})}
var _na=nextAdaptive;nextAdaptive=function(){var z=Z;if(!z||!z.plan)return _na.apply(this,arguments);
 var a=items(),f=a?focus(a).filter(function(y){return y.s!=='learn'||y.back}):[];if(!f.length)return _na.apply(this,arguments);
 var rv=a.filter(function(y){return y.s==='keep'||y.s==='done'}).sort(function(p,q){return p.e-q.e})[0],r=Math.random(),pick=f[0],isRv=false;
 if(rv&&r>.8){pick=rv;isRv=true}else if(f[1]&&r>.55)pick=f[1];
 var lastT=z.seenQ.slice(-3).map(function(id){return QS[QI[id]].t});
 var id=coachPick({topics:[pick.t],exclude:z.seenQ,last:lastT,target:isRv?.85:tgt(pick,z.seenQ.length===0)});
 return id||_na.apply(this,arguments)};
/* 4. results: diagnostic builds the plan, plan sessions report what moved */
var _fs=finishSess;finishSess=function(){var z=Z,was=z&&z.fin;_fs.apply(this,arguments);if(!z||was||!z.fin)return;
 if(z.kind==='diag'){var sk={};z.steps.forEach(function(s){if(s.k==='try'&&s.it.dk&&!s.probe)sk[s.it.q.t]=1});
  if(S.dk)Object.keys(S.dk).forEach(function(t){if(!sk[t])delete S.dk[t]});S.dk=S.dk||{};Object.keys(sk).forEach(function(t){S.dk[t]=1});build(sk);save()}
 else if(z.plan){var a=items();if(a){z.plan.now=snap(a);z.plan.nowItems=a.map(function(x){return{t:x.t,s:x.back?'back':x.s}});save()}}};
function chg(z){var o=[],A=z.plan.snap,B=z.plan.now;if(!B)return o;Object.keys(B).forEach(function(t){if(A[t]===B[t])return;var nm=TOP[t].name;
 if(B[t]==='done')o.push('✓ <b>'+esc(nm)+'</b> proved');else if(B[t]==='slip')o.push('↓ <b>'+esc(nm)+'</b> slipped, back on the plan');else if(B[t]==='back')o.push('↩ <b>'+esc(nm)+'</b> added as a step back');else if(A[t]==='learn'&&B[t]==='practice')o.push('→ <b>'+esc(nm)+'</b> learned, practice is next');else if(B[t]==='prove')o.push('→ <b>'+esc(nm)+'</b> ready to prove');else if(A[t]==='back'&&B[t]!=='back')o.push('✓ Step back on <b>'+esc(nm)+'</b> is done')});return o}
var _dr=drawResults;drawResults=function(top){_dr(top);var z=Z;if(!z||!z.sumDone)return;var b=$('sess')&&$('sess').querySelector('.s-body');if(!b)return;
 if(z.kind==='diag'&&S.cu){var n=0,f=0,s=0;Object.keys(S.cu.base).forEach(function(t){var v=S.cu.base[t];if(v==='n')n++;else if(v==='f')f++;else s++});
  b.insertAdjacentHTML('afterbegin','<div class="card plc"><h3>Your plan is ready</h3><p class="small">Built from what you answered, including what you skipped.</p><ul class="plu"><li><b>'+n+'</b> to learn from the basics</li><li><b>'+f+'</b> to repair with a short lesson</li><li><b>'+s+'</b> already strong, review only</li></ul><div class="row"><button class="btn sm" data-plan="go">Start my plan</button><button class="btn sec sm" data-plan="view">See plan</button></div></div>')}
 else if(z.plan){var c=chg(z),a=items(),f=a?focus(a)[0]:null;b.insertAdjacentHTML('afterbegin','<div class="card plc"><h3>Plan update</h3>'+(c.length?'<ul class="plu"><li>'+c.join('</li><li>')+'</li></ul>':'<p class="small">Nothing moved yet. Your answers are still shaping what comes next.</p>')+(f?'<p class="small">Next: <b>'+esc(TOP[f.t].name)+'</b> ('+LBL[f.back?'back':f.s].toLowerCase()+')</p>':'<p class="small">Every topic is done. Keep reviewing to hold on to it.</p>')+'<div class="row"><button class="btn sm" data-plan="go">Continue plan</button><button class="btn sec sm" data-plan="view">See plan</button></div></div>')}};
/* 5. surfaces: Learn and Practice cards, plan sheet, strong topics skipped on the Learn path */
function card(){var a=items();
 if(!a)return '<div class="card plc"><div class="row"><div style="flex:1"><b>My plan</b><div class="small mute">Take the placement check and we build your plan.</div></div><button class="btn sm" id="dgs">Start check</button></div></div>';
 var f=focus(a),d=a.filter(function(x){return x.s==='done'||x.s==='keep'}).length,x=f[0],lab=!x?'All topics done':x.s==='learn'&&!x.back?'Lesson: '+TOP[x.t].name:'Practice: '+f.filter(function(y){return y.s!=='learn'||y.back}).slice(0,2).map(function(y){return TOP[y.t].name}).join(', ');
 return '<div class="card plc"><div class="row"><div style="flex:1;min-width:0"><b>My plan</b><div class="small">Now: '+esc(lab)+'</div></div><button class="btn sm" data-plan="go">'+(x?'Start':'Review')+'</button><button class="btn sec sm" data-plan="view">See plan</button></div><div class="plb" role="img" aria-label="'+d+' of '+a.length+' topics strong or proven"><i style="width:'+Math.round(100*d/a.length)+'%"></i></div><div class="small mute">'+d+' of '+a.length+' topics strong or proven</div></div>'}
window.__cu={items:items,focus:focus,tgt:tgt,startPlan:startPlan,card:card,sheet:sheet};
var _vl=viewLearn;viewLearn=function(){var h=_vl.apply(this,arguments),c=card();if(S.dg&&S.dg!=='skip'&&items())h=h.replace(/<div class="card dgc">.*?<\/div><button class="btn sec sm" id="dgx"[^>]*>Skip<\/button><\/div>/,'');
 return h.indexOf('<div class="cont">')>-1?h.replace('<div class="cont">',c+'<div class="cont">'):c+h};
var _vp=viewPractice;viewPractice=function(){var h=_vp.apply(this,arguments);return h.replace('<div class="grid">',card()+'<div class="grid">')};
var _nl=nextLesson;nextLesson=function(){var a=items();if(!a)return _nl.apply(this,arguments);var keep=UN,skip={};a.forEach(function(x){if(x.s==='keep')skip[x.t]=1});var r;UN=keep.filter(function(u){return !skip[u.id]});try{r=_nl.apply(this,arguments)}finally{UN=keep}if(r)r.i=keep.indexOf(r.u);return r};
function dots(x){var st=['Learn','Practice','Prove'],cur=x.s==='learn'?0:x.s==='practice'?1:x.s==='prove'?2:3;if(x.s==='keep')return '';
 return '<span class="pld" aria-label="Stage: '+(cur>2?'done':st[cur])+'">'+st.map(function(l,i){return '<em class="'+(i<cur?'d':i===cur?'n':'')+'">'+(i<cur?'✓ ':'')+l+'</em>'}).join('')+'</span>'}
function sheet(){var a=items();if(!a)return;var m=document.createElement('div');m.className='modal';m.setAttribute('role','dialog');m.setAttribute('aria-modal','true');m.setAttribute('aria-label','My plan');
 var f=focus(a),fi=f.map(function(x){return x.t}),rest=a.filter(function(x){return fi.indexOf(x.t)<0});
 function row(x){var pr=x.s==='practice'?' · '+Math.min(8,x.n)+'/8 answers':'';return '<div class="plr"><div style="flex:1;min-width:0"><b>'+esc(TOP[x.t].name)+'</b> <span class="tag">'+LBL[x.back?'back':x.s]+'</span><div class="small mute">'+esc(why(x))+pr+'</div>'+dots(x)+'</div><button class="btn sec sm" data-plt="'+x.t+'" aria-label="Open '+esc(TOP[x.t].name)+'">'+(x.s==='learn'&&!x.back?'Lesson':x.s==='prove'?'Prove it':x.s==='keep'||x.s==='done'?'Review':'Practice')+'</button></div>'}
 m.innerHTML='<div class="mbox plm"><h3>My plan</h3><p class="small mute">Made '+esc(S.cu.made)+' from the placement check, then updated from your answers. Nothing here is hidden: a topic moves when your results move.</p>'+(f.length?'<h4>Working on now</h4>'+f.map(row).join(''):'<p><b>Every topic is done.</b></p>')+(rest.length?'<h4>Later and done</h4>'+rest.map(row).join(''):'')+'<div class="row" style="margin-top:12px"><button class="btn" id="plgo">Start my plan</button><button class="btn sec" id="dgs">Retake check</button><button class="btn sec" id="plx">Close</button></div></div>';
 document.body.appendChild(m);m.addEventListener('click',function(ev){if(ev.target===m||ev.target.id==='plx'||ev.target.id==='dgs')m.remove()});var x=m.querySelector('#plgo');if(x)x.focus()}
document.addEventListener('click',function(e){var t=e.target,b=t.closest&&t.closest('[data-plan],[data-plt],#plgo');if(!b)return;
 var md=document.querySelector('.modal');if(b.id==='plgo'||b.dataset.plt){if(md&&md.querySelector('.plm'))md.remove()}
 if(b.dataset.plan==='view'){sheet();return}
 var go=function(){if(b.dataset.plt){var u=unitBy(b.dataset.plt),x=info(u);if(x.s==='learn'){var L=u.lessons.filter(function(l){return !x.us.us.d[l.id]})[0]||u.lessons[0];startLesson(u.id,L.id)}else if(x.s==='prove')startUnitTest(u.id);else startPractice([u.id],x.s==='keep'||x.s==='done'?8:12)}else startPlan()};
 if(Z&&Z.fin){closeSess();setTimeout(go,30)}else go()});
})();
