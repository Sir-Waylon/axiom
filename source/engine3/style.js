/* ===== format-aware personalization =====
   1. Every question format has a difficulty weight (a typed answer is harder than picking from choices at the same content level).
   2. For each student the engine learns, per format, whether they do better or worse than the model expects, with recent answers
      counting most so it follows the student as they change. That adjusts how hard each format is FOR THAT STUDENT.
   3. The picker samples every format early, re-checks formats now and then, and leans slightly toward formats that work for the student.
   Everything is stored on this device. Nothing is sent anywhere. */
var TYB={lab:.5,fitc:.5,frbal:.55,lgate:.4,resnet:.45,barb:.35,xform:.5,ucirc:.45,sim:.4,tune:.5,swipe:.1,yn:0,mcq:0,multi:.25,chips:.2,match:.1,order:.25,slider:.3,angle:.35,point:.4,compass:.35,graph:.45,short:.6,proof:.8};
var FAM=[['Choosing',['mcq','multi'],'Picking the right answer from a list'],['Typing',['short','proof'],'Writing an answer or a proof step'],['Hands-on',['slider','angle','point','compass','graph'],'Dragging, tapping and measuring'],['Building',['order','match','chips'],'Putting things in order, matching, filling gaps']];
if(!S.fm)S.fm={};
function fmOf(t){return S.fm[t]||(S.fm[t]={n:0,res:0,last:0,ok:0})}
function fmAdj(t){var f=S.fm[t];if(!f||f.n<3)return 0;var sh=f.n/(f.n+4);return -Math.max(-.9,Math.min(.9,f.res*2.4))*sh}
function pBase(q){var th=S.th[q.t]||0,b=(q.b!==undefined?q.b:LB[q.l])+(TYB[q.type]||0);return 1/(1+Math.exp(-(th-b)))}
function pOK(t,q){var th=S.th[t]||0,b=(q.b!==undefined?q.b:LB[q.l])+(TYB[q.type]||0)+fmAdj(q.type);return 1/(1+Math.exp(-(th-b)))}
var _cuF=coachUpdate;coachUpdate=function(q,ok,helped){var p0=pBase(q);_cuF.apply(this,arguments);
 if(helped)return;var f=fmOf(q.type),a=f.n<10?.25:.12;f.res=f.n?f.res*(1-a)+((ok?1:0)-p0)*a:((ok?1:0)-p0)*a;f.n++;f.ok+=ok?1:0;f.last=dayN()};
/* picker: explore every format early, re-probe stale ones, lean slightly toward what works (never exclusively) */
var _cpF=coachPick;coachPick=function(o){
 if(o&&!o._st){var best=null,bs=-1e9,tg=o.target||TARGET,ex=o.exclude||[],last=o.last||[],d=dayN();
  var base=_cpF(o);if(!base)return base;
  /* with some probability, replace by the best item of an under-sampled or stale format at a similar topic mix */
  var cand=[],tot=0;Object.keys(TYB).forEach(function(t){var f=S.fm[t],n=f?f.n:0,age=f?d-f.last:99,w=n<3?.55:(age>12?.22:0);if(w>0&&QS.some(function(q){return q.type===t&&(!o.topics||o.topics.indexOf(q.t)>-1)}))cand.push([t,w])});
  var kind=Z&&Z.kind;if(kind==='diag'||kind==='mock')return base;
  if(cand.length&&Math.random()<Math.min(.5,cand.reduce(function(a,c){return Math.max(a,c[1])},0))){var pick=cand[Math.floor(Math.random()*cand.length)][0],
    id=_cpF(Object.assign({},o,{types:[pick],_st:1}));if(id)return id}
  /* mild preference for formats the student does well in */
  var fb=Object.keys(S.fm).filter(function(t){return S.fm[t].n>=6&&S.fm[t].res>.06});
  if(fb.length&&Math.random()<.22){var id2=_cpF(Object.assign({},o,{types:[fb[Math.floor(Math.random()*fb.length)]],_st:1}));if(id2)return id2}
  return base}
 return _cpF(o)};
/* "How you learn" summary */
function famStats(){return FAM.map(function(f){var n=0,w=0,ok=0;f[1].forEach(function(t){var x=S.fm[t];if(x){n+=x.n;w+=x.res*x.n;ok+=x.ok}});return{name:f[0],desc:f[2],n:n,res:n?w/n:0,acc:n?ok/n:0}})}
function styleHTML(){var fs=famStats(),tot=fs.reduce(function(a,f){return a+f.n},0);
 var h='<div class="card"><h3>How you learn</h3>';
 if(tot<12)return h+'</div>';
 h+='';
 fs.forEach(function(f){var v=Math.max(-.3,Math.min(.3,f.res)),pct=Math.round((v+.3)/.6*100),lab=f.n<5?'Still testing':v>.07?'Strength':v<-.07?'Growing area':'On track';
  h+='<div class="stl"><div class="row" style="justify-content:space-between"><b>'+f.name+'</b><span class="small">'+lab+' · '+f.n+' answered</span></div><div class="bar" role="img" aria-label="'+f.name+': '+lab+'"><i style="width:'+(f.n<5?10:Math.max(6,pct))+'%"></i></div><div class="small mute">'+f.desc+'</div></div>'});
 return h+'<button class="btn sm ghost" id="sty-rs">Reset</button></div>'}
var _vmY=viewMe;viewMe=function(){var h=_vmY();if(sub.me==='profile')h+=styleHTML();return h};
document.addEventListener('click',function(e){if(e.target.id==='sty-rs'){S.fm={};save();route();toast('Format profile reset')}});

