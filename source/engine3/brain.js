/* ===== coach: spaced repetition + difficulty targeting + interleaving + daily mission ===== */
var DOFF=0,BOX=[0,1,3,7,14,30],LB={1:-1,2:0,3:1.1},TARGET=.85;
if(!S.rn)S.rn={};if(!S.rf)S.rf=[];if(!S.hd)S.hd={};if(!S.mem)S.mem={};if(!S.th)S.th={};if(!S.mins)S.mins={};
function dayN(){return Math.floor(Date.now()/864e6)+DOFF}
function pOK(t,q){var th=S.th[t]||0,b=q.b!==undefined?q.b:LB[q.l];return 1/(1+Math.exp(-(th-b)))}
function coachUpdate(q,ok,helped){
 if(q.fp){S.rf.push(q.fp);if(S.rf.length>30)S.rf.shift()}
 if(q.l===3&&q.id.indexOf('stn-')!==0){var hd=S.hd[q.t]||[0,0];hd[1]++;if(ok&&!helped)hd[0]++;S.hd[q.t]=hd}
 var m=S.mem[q.id]||[0,0,0],box=m[0],st=S.stat[q.t]||[0,0];
 if(ok&&!helped)box=m[2]===0?2:Math.min(5,box+1);else if(ok)box=Math.max(1,box);else box=0;
 S.mem[q.id]=[box,dayN()+BOX[box],m[2]+1];
 var th=S.th[q.t]||0,p=pOK(q.t,q),k=Math.max(.12,.55/Math.sqrt(1+st[1]/5));
 var nt=th+k*((ok?1:0)-p)*(helped?.5:1),r=S.rn[q.t]||0;r=ok?(r>0?r+1:1):(r<0?r-1:-1);
 if(r>=3&&p<.93){nt+=.18;r=0}else if(r<=-2){nt-=.3;r=0}S.rn[q.t]=r;
 S.th[q.t]=Math.max(-3,Math.min(3,nt))}
function dueIds(topics){var d=dayN(),o=[];for(var id in S.mem){var m=S.mem[id];if(m[1]<=d&&QI[id]!==undefined&&(!topics||topics.indexOf(QS[QI[id]].t)>-1))o.push([id,d-m[1]])}return o.sort(function(a,b){return b[1]-a[1]})}
/* choose the next question. o: {topics, exclude[], last[] (recent topics), target, types} */
function coachPick(o){
 var tg=o.target||TARGET,ex=o.exclude||[],last=o.last||[],best=null,bs=-1e9,d=dayN();
 for(var i=0;i<QS.length;i++){var q=QS[i];
  if(o.topics&&o.topics.indexOf(q.t)<0)continue;if(ex.indexOf(q.id)>-1)continue;if(o.types&&o.types.indexOf(q.type)<0)continue;
  var m=S.mem[q.id],s=0;
  if(!m)s+=.5;else if(m[1]<=d)s+=(o.dueLeft===undefined||o.dueLeft>0)?1+Math.min(.5,.05*(d-m[1])):.1;else s-=9;
  if(q.fp&&S.rf.indexOf(q.fp)>-1)s-=1.5;
  s-=6*Math.abs(pOK(q.t,q)-tg);
  if(last[last.length-1]===q.t)s-=.7;else if(last.indexOf(q.t)>-1)s-=.3;
  var ma=mastery(q.t);s+=.6*(1-(ma.n?ma.acc:.5));
  s+=Math.random()*.35;if(s>bs){bs=s;best=q}}
 return best&&best.id}
function ability(t){var th=S.th[t]||0;return Math.round(100/(1+Math.exp(-th)))}
/* daily mission: warm-up, lesson step, spaced review, stretch. about 10 minutes */
function missionDone(){return S.msn===today()}
function startMission(){
 var steps=[],used=[],last=[];
 function add(n,tg,topics,follow){for(var i=0;i<n;i++){var id=coachPick({topics:topics||ALL,exclude:used,last:last,target:tg});if(!id)break;used.push(id);last.push(QS[QI[id]].t);steps.push({k:'try',it:mkItem(id)})}}
 var due=dueIds().slice(0,10).map(function(x){return x[0]});
 /* 1 warm-up: two sure wins (momentum) */
 add(2,.95);
 /* 2 new learning */
 var nl=nextLesson();if(nl){lessonSteps(nl.u,nl.L).forEach(function(s){steps.push(s)})}else add(3,.8);
 /* 3 spaced review of what is due */
 var rv=0;due.forEach(function(id){if(rv<4&&used.indexOf(id)<0){used.push(id);steps.push({k:'try',it:mkItem(id)});rv++}});if(rv<2)add(2-rv,.85);
 /* 4 stretch */
 add(2,.65);
 startSess({kind:'mission',title:'Daily mission',steps:steps,remed:true})}
function weekDays(){var n=0;for(var i=0;i<7;i++){var d=new Date();d.setDate(d.getDate()-i);var k=d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2);if(S.days[k])n++}return n}
function minsToday(){return Math.round(S.mins[today()]||0)}
function addMins(z){if(!z||!z.t0)return;var m=Math.min(30,(Date.now()-z.t0)/60000);S.mins[today()]=(S.mins[today()]||0)+m;z.t0=Date.now()}
