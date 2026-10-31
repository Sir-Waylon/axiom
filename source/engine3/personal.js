/* ===== personalization: placement check, recency/mode weighted picking, adaptive lesson length, refresher gating, pacing ===== */
(function(){
var M=P.meta,REF=M.refresh||null;
S.ema=S.ema||{};S.ls=S.ls||{};S.rfu=S.rfu||{};S.ld=S.ld||{};
function emaOf(t){return S.ema[t]!==undefined?S.ema[t]:.5}
function ab(t){return Math.round(100/(1+Math.exp(-(S.th[t]||0))))}
/* recency-weighted accuracy */
var _cu=coachUpdate;coachUpdate=function(q,ok,helped){_cu.apply(this,arguments);S.ema[q.t]=Math.round((emaOf(q.t)*.75+(ok&&!helped?1:ok?.6:0)*.25)*1000)/1000;S.ls[q.id]=Date.now()};
function pace(t){var st=S.stat[t]||[0,0],e=emaOf(t),a=ab(t);if(st[1]<2&&S.dgr&&S.dgr[t]===undefined)return 'mid';if(a<38||e<.5)return 'weak';if(a>=72&&e>=.8)return 'strong';return 'mid'}
window.__pace=pace;
function modeW(){var k=Z&&Z.kind;return k==='review'?{due:2,nw:.3,weak:.6}:k==='lesson'?{due:.6,nw:1.2,weak:.8}:(k==='quick'||k==='adaptive')?{due:.9,nw:.5,weak:1.5}:k==='mock'?{due:.3,nw:.6,weak:1}:{due:1,nw:.5,weak:1}}
coachPick=function(o){
 var tg=o.target||TARGET,ex=o.exclude||[],last=o.last||[],best=null,bs=-1e9,d=dayN(),W=modeW(),now=Date.now();
 for(var i=0;i<QS.length;i++){var q=QS[i];
  if(o.topics&&o.topics.indexOf(q.t)<0)continue;if(ex.indexOf(q.id)>-1)continue;if(o.types&&o.types.indexOf(q.type)<0)continue;
  var m=S.mem[q.id],s=0,p=.6*pOK(q.t,q)+.4*Math.min(.98,Math.max(.02,emaOf(q.t)*.6+pOK(q.t,q)*.4));
  if(!m)s+=W.nw;else if(m[1]<=d)s+=W.due*((o.dueLeft===undefined||o.dueLeft>0)?1+Math.min(.5,.05*(d-m[1])):.1);else s-=2.5;
  if(S.ls[q.id]&&now-S.ls[q.id]<20*60000)s-=3;
  s-=6*Math.abs(p-tg);
  if(last[last.length-1]===q.t)s-=.7;else if(last.indexOf(q.t)>-1)s-=.3;
  s+=W.weak*.8*(1-emaOf(q.t));
  s+=Math.random()*.35;if(s>bs){bs=s;best=q}}
 return best&&best.id};
/* adaptive lesson length: weak topics get gentler extra steps, mastered topics get shorter harder lessons */
var _ls=lessonSteps;lessonSteps=function(u,L){var st=_ls(u,L),pc=pace(u.id),used=st.filter(function(x){return x.k==='try'}).map(function(x){return x.it.id}),add=function(n,tg){var o=[];for(var i=0;i<n;i++){var id=coachPick({topics:[u.id],exclude:used.concat(o),target:tg});if(!id)break;o.push(id);st.push({k:'try',it:mkItem(id)})}};
 if(pc==='weak'){st.forEach(function(x){if(x.k==='card')x.slow=1});add(2,.9);add(1,.8)}
 else if(pc==='strong'){st=st.filter(function(x){return x.k!=='try'||x.it.q.l>1||Math.random()<.3});add(2,.6)}
 return st};
/* refresher gating */
function refUnits(){return REF?UN.filter(function(u){return REF[u.id]}):[]}
function refWhy(t){if(!REF||!REF[t])return null;if(S.rfu[t])return 'Unlocked by you';var d=S.dgr&&S.dgr[t];if(d===0)return 'Placement check: needs review';var adj=REF[t],bad=adj.filter(function(a){var st=S.stat[a]||[0,0];return st[1]>=6&&emaOf(a)<.62});if(bad.length)return 'Struggling with '+bad.map(function(a){return TOP[a].name}).join(', ');var st=S.stat[t]||[0,0];if(st[1]>=6&&emaOf(t)<.6)return 'Recent misses';return null}
var FULL=UN;
function withMain(fn){var keep=UN;UN=FULL.filter(function(u){return !REF||!REF[u.id]||refWhy(u.id)});try{return fn()}finally{UN=keep}}
if(REF){var _nl=nextLesson;nextLesson=function(){return withMain(_nl)}}
var _vl=viewLearn;
viewLearn=function(){var h=withMain(_vl);
 if(!S.dg)h=h.replace(/(<div class="cont">|<details class="unit")/,'<div class="card dgc"><div style="flex:1"><b>Placement check</b><div class="small mute">One question per topic. Sets your starting path.</div></div><button class="btn sm" id="dgs">Start</button><button class="btn sec sm" id="dgx" aria-label="Skip">Skip</button></div>$1');
 var tgt=M.target;if(tgt){var left=0;FULL.forEach(function(u){if(REF&&REF[u.id]&&!refWhy(u.id))return;var us=S.un[u.id]||{d:{}};u.lessons.forEach(function(L){if(!us.d[L.id])left++})});var wk=Math.max(1,(new Date(tgt+'T12:00:00')-Date.now())/6048e5),need=Math.ceil(left/wk),did=0;for(var i=0;i<7;i++){var dk=new Date();dk.setDate(dk.getDate()-i);var k=dk.getFullYear()+'-'+('0'+(dk.getMonth()+1)).slice(-2)+'-'+('0'+dk.getDate()).slice(-2);did+=S.ld[k]||0}
  h=h.replace(/(<div class="cont">)/,'<div class="pace"><span>'+left+' lessons left · '+need+'/week to finish by spring</span><b class="'+(did>=need?'ok':'')+'">'+did+' this week</b></div>$1')}
 var rf=refUnits().filter(function(u){return !refWhy(u.id)});
 if(rf.length)h+='<details class="unit refr"><summary class="unit-h"><div style="flex:1"><h3>Algebra refreshers</h3><div class="small mute">Only if you need them · '+rf.length+' topics</div></div></summary><div class="lessons rfl">'+rf.map(function(u){return '<button class="btn sec sm" data-rfu="'+u.id+'">'+esc(u.title)+'</button>'}).join('')+'</div></details>';
 refUnits().forEach(function(u){var w=refWhy(u.id);if(w)h=h.replace('<h3>'+esc(u.title)+'</h3>','<h3>'+esc(u.title)+' <span class="tag">Refresher</span></h3><div class="small" style="color:var(--pri-t)">'+esc(w)+'</div>')});
 return h};
document.addEventListener('click',function(e){var r=e.target.closest&&e.target.closest('[data-rfu]');if(r){S.rfu[r.dataset.rfu]=1;save();toast&&toast('Added to your path');route();return}
 if(e.target.id==='dgs')startDiag();if(e.target.id==='dgx'){S.dg='skip';save();route()}});
/* placement check */
function startDiag(){var steps=[],used=[];ALL.forEach(function(t){var qs=QS.filter(function(q){return q.t===t&&(q.type==='mcq'||q.type==='short')&&q.l<=2}).sort(function(a,b){return (a.b!==undefined?a.b:LB[a.l])-(b.b!==undefined?b.b:LB[b.l])});if(!qs.length)return;var q=qs[Math.floor(qs.length*.5)];steps.push({k:'try',it:mkItem(q.id)})});
 startSess({kind:'diag',title:'Placement check',steps:steps,nofb:true})}
var _fs=finishSess;finishSess=function(){var z=Z;var was=z&&z.fin;_fs.apply(this,arguments);if(z&&!was&&z.fin){if(z.kind==='diag'){S.dgr={};z.steps.forEach(function(s){if(s.k!=='try')return;var t=s.it.q.t,ok=!!s.it.ok;S.dgr[t]=ok?1:0;S.th[t]=ok?.9:-.9;S.ema[t]=ok?.8:.3;S.rn[t]=0});S.dg=today()}
  if(z.kind==='lesson'){S.ld[today()]=(S.ld[today()]||0)+1}save()}};
var _dr=drawResults;drawResults=function(top){_dr(top);var z=Z;if(!z||z.kind!=='diag'||!z.sumDone)return;var s=$('sess'),good=[],need=[];ALL.forEach(function(t){if(S.dgr&&S.dgr[t]===1)good.push(TOP[t].name);else if(S.dgr&&S.dgr[t]===0)need.push(TOP[t].name)});var b=s.querySelector('.s-body');if(b)b.insertAdjacentHTML('afterbegin','<div class="card"><h3>Your starting point</h3>'+(need.length?'<p><b>Start with:</b> '+need.slice(0,6).map(esc).join(' · ')+'</p>':'')+(good.length?'<p><b>Already strong:</b> '+good.slice(0,8).map(esc).join(' · ')+'</p>':'')+'<p class="small mute">Strong topics get shorter, harder lessons. Others get extra steps.</p></div>')};
})();
