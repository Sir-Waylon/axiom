/* ===== scioly engine core: state, utils, grading, XP ===== */
var P=__PACK__;
var SEC=(typeof __SEC!=='undefined')?__SEC:null;
var QS=P.questions,QI={};QS.forEach(function(q,i){QI[q.id]=i});
var TOP={};P.topics.forEach(function(t){TOP[t.id]=t});
function $(id){return document.getElementById(id)}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
function shuf(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
function cnt(o){return Object.keys(o).length}
function today(){var d=new Date();return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2)}
var KEY='scioly:'+P.meta.id;
var S={xp:0,coins:0,best:0,days:{},dxp:{},seen:{},miss:{},stat:{},plan:{},known:{},badges:{},un:{},lr:{},theme:'auto',mbest:0,shorts:0,total:0,right:0,perfect:0,v:1};
try{var _o=SEC?SEC.state:JSON.parse(localStorage.getItem(KEY)||'null');if(_o&&typeof _o==='object')for(var _k in _o)S[_k]=_o[_k]}catch(e){}
(function(){var ok=typeof S.xp==='number'&&typeof S.coins==='number'&&S.xp>=0&&S.coins>=0&&S.xp<=60*(S.total|0)+2*Object.keys(S.lr||{}).length+60&&S.coins<=2*S.xp+20;if(!ok){S.xp=0;S.coins=0;S.dxp={};S.cos=null;S.lr={}}})();
function save(){var s=JSON.stringify(S);if(SEC)SEC.save(s);else try{localStorage.setItem(KEY,s)}catch(e){}}

/* ---- levels ---- */
var LV=P.meta.levels||['Static Spark','Wire Wrapper','Breadboarder','Bench Tech','Circuit Builder','Logic Architect','Field Engineer','Kirchhoff Master'];
function lvOf(xp){var l=0;while(xp>=need(l+1))l++;return l}
function need(l){return Math.round(40*l*l+60*l)}   /* cumulative XP to reach level l (l>=1) */
function lvInfo(){var l=lvOf(S.xp),a=need(l),b=need(l+1);return{l:l+1,name:LV[Math.min(l,LV.length-1)],pct:100*(S.xp-a)/(b-a),to:b-S.xp}}
function dayStreak(){var ks=Object.keys(S.days).sort();if(!ks.length)return 0;var d=new Date(ks[0]+'T12:00:00'),t=new Date();t.setHours(12,0,0,0);var run=0,since=0;
 function key(x){return x.getFullYear()+'-'+('0'+(x.getMonth()+1)).slice(-2)+'-'+('0'+x.getDate()).slice(-2)}
 for(;d<=t;d.setDate(d.getDate()+1)){var k=key(d);if(S.days[k]){run++;since++}else if(k===key(t)){}else if(since>=7){since=0}else{run=0;since=0}}return run}
function dq(){var k=today();if(!S.dq||S.dq.d!==k)S.dq={d:k,a:0,l:0,r:0};return S.dq}
function toast(m){var t=document.createElement('div');t.className='toast';t.textContent=m;document.body.appendChild(t);setTimeout(function(){t.remove()},2400)}

/* ---- badges ---- */
var BADGES=[['first','First answer','Answer any question',function(){return S.total>=1}],['ten','10 right','10 correct answers',function(){return S.right>=10}],['hund','Century','100 correct answers',function(){return S.right>=100}],['five','On a roll','5 in a row',function(){return S.best>=5}],['fifteen','Unstoppable','15 in a row',function(){return S.best>=15}],['short','Free-response','10 short answers right',function(){return S.shorts>=10}],['perfect','Flawless','A perfect set of 10+',function(){return S.perfect>=1}],['master','Mastery','Master any topic',function(){return P.topics.some(function(t){return mastery(t.id).lv>=4})}],['week','Week warrior','3-day streak',function(){return dayStreak()>=3}],['rich','Collector','Own 3 cosmetics',function(){return Object.keys(S.cos.own).length>=3}],['match','Quick match','Match game under 40 s',function(){return S.mbest>0&&S.mbest<=40}]];
function checkBadges(){BADGES.forEach(function(b){if(!S.badges[b[0]]&&b[3]()){S.badges[b[0]]=1;toast('Badge: '+b[1])}})}

/* ---- mastery ---- */
var MN=['Not started','Attempted','Familiar','Proficient','Mastered'];
function mastery(t){var st=S.stat[t]||[0,0],n=st[1],a=n?st[0]/n:0,lv=0;if(n>0)lv=1;if(n>=8&&a>=.5)lv=2;if(n>=15&&a>=.75)lv=3;var hd=(S.hd&&S.hd[t])||[0,0];if(n>=25&&a>=.9&&hd[1]>=6&&hd[0]/hd[1]>=.8)lv=4;return{lv:lv,n:n,acc:a,hard:hd}}

/* ---- grading: short answers ---- */
var PRE={'n':1e-9,'u':1e-6,'µ':1e-6,'μ':1e-6,'m':1e-3,'k':1e3,'K':1e3,'M':1e6,'':1};
function unitInfo(s){
 s=String(s||'').trim().replace(/\s+/g,'').replace(/ohms?/ig,'Ω').replace(/Ω/g,'Ω');
 if(!s)return null;
 var m;
 if(s==='%'||/^percent$/i.test(s))return{f:1,d:'%'};
 if((m=s.match(/^([nuµμmkKM]?)(N\/C|V\/m)$/)))return{f:PRE[m[1]],d:'N/C'};
 if((m=s.match(/^([nuµμmkKM]?)(Wh)$/i))&&s.toLowerCase().slice(-2)==='wh'){var p=s.length===3?s[0]:'';return{f:3600*(PRE[p]||1),d:'J'}}
 if(/^h(ours?|r|rs)?$/i.test(s))return{f:3600,d:'s'};
 if(/^min(utes?)?$/i.test(s))return{f:60,d:'s'};
 if((m=s.match(/^([nuµμmkKM]?)(Hz|V|A|Ω|W|J|C|N|F|T|s)$/))){var pf=PRE[m[1]];var b=m[2];return{f:pf,d:b==='Hz'?'Hz':b}}
 if((m=s.match(/^([nuµμmkKM]?)(hz|v|a|w|j|c|n|f|t|s)$/))){return{f:PRE[m[1]],d:m[2]==='hz'?'Hz':m[2].toUpperCase()==='S'?'s':m[2].toUpperCase()}}
 return null;
}
function parseNum(s){
 s=String(s).trim().replace(/,/g,'').replace(/−/g,'-').replace(/\$/g,'');
 s=s.replace(/\s*[×x*]\s*10\s*\^?\s*\(?(-?\d+)\)?/i,'e$1');
 var fr=s.match(/^\(?([+-]?\d+\.?\d*)\s*\/\s*(\d+\.?\d*)\)?\s*(.*)$/);if(fr&&+fr[2]!==0)return{v:parseFloat(fr[1])/parseFloat(fr[2]),u:fr[3].trim()};
 var m=s.match(/^([+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?)\s*(.*)$/i);
 if(!m)return null;return{v:parseFloat(m[1]),u:m[2].trim()};
}
function fmt(x){if(x===0)return '0';var a=Math.abs(x);if(a>=1e5||a<1e-3)return x.toExponential(2).replace(/\.?0+e/,'e').replace('e+','×10^').replace('e','×10^');var s=Number(x.toPrecision(3));return String(s)}
function numAnswer(n){if(n.show)return n.show;var ui=n.u?unitInfo(n.u):null,f=ui?ui.f:1;return fmt(n.v/f)+(n.u?' '+n.u:'')}
function gradeNum(n,input){
 var p=parseNum(input);if(!p||!isFinite(p.v))return{ok:false,msg:'Enter a number'+(n.u?' (unit: '+n.u+')':'')};
 var eu=n.u?unitInfo(n.u):null,val;
 if(n.free){var tl=n.tol===undefined?0.01:n.tol,hit=function(x){return n.v===0?Math.abs(x)<1e-9:Math.abs(x-n.v)/Math.abs(n.v)<=tl+1e-12};return{ok:hit(p.v)||(n.pi&&/π|pi/i.test(p.u)&&hit(p.v))||(n.pi&&hit(p.v/Math.PI))}}
 if(p.u){var ui=unitInfo(p.u);
  if(!ui)return{ok:false,msg:'Unit not recognised'};
  if(eu&&ui.d!==eu.d)return{ok:false,msg:'Wrong kind of unit'};
  if(!eu&&p.u&&!/^$/.test(p.u))return{ok:false,msg:'No unit needed'};
  val=p.v*ui.f;
 }else val=p.v*(eu?eu.f:1);
 var tol=n.tol===undefined?0.02:n.tol;
 if(n.v===0)return{ok:Math.abs(val)<1e-12};
 return{ok:Math.abs(val-n.v)/Math.abs(n.v)<=tol+1e-12};
}
function norm(s){return String(s).toLowerCase().replace(/[’']/g,'').replace(/≥/g,'>=').replace(/≤/g,'<=').replace(/≠/g,'!=').replace(/[−–—]/g,'-').replace(/=>/g,'>=').replace(/=</g,'<=').replace(/^(a|an|the)\s+/,'').replace(/[^a-z0-9+·′ø.\-<>=!\/*^]/g,'').replace(/\.$/,'')}
function lev(a,b){var d=[],i,j;for(i=0;i<=a.length;i++)d[i]=[i];for(j=1;j<=b.length;j++)d[0][j]=j;for(i=1;i<=a.length;i++)for(j=1;j<=b.length;j++){d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(a[i-1]===b[j-1]?0:1));if(i>1&&j>1&&a[i-1]===b[j-2]&&a[i-2]===b[j-1])d[i][j]=Math.min(d[i][j],d[i-2][j-2]+1)}return d[a.length][b.length]}
function gradeText(acc,input){var n=norm(input);if(!n)return false;
 return acc.some(function(a){var m=norm(a);return n===m||(m.length>=6&&lev(n,m)<=1)})}
function gradeShort(q,input){if(q.num)return gradeNum(q.num,input);return{ok:gradeText(q.text,input)}}
function shortAnswer(q){return q.num?numAnswer(q.num):q.text[0]}
function ansText(q){
 if(q.type==='mcq')return q.o[0];
 if(q.type==='multi')return q.a.map(function(i){return q.o[i]}).join('; ');
 if(q.type==='short')return shortAnswer(q);
 if(q.type==='order')return q.items.map(function(x,i){return (i+1)+'. '+x}).join('  ');
 if(q.type==='match')return q.pairs.map(function(p){return p[0]+' → '+p[1]}).join('; ');
 return ''}

/* ---- recording ---- */
var combo=0;
function award(q,ok,part,helped){
 var gain=0;
 dq().a++;if(ok)dq().r++;S.total++;S.seen[q.id]=(S.seen[q.id]||0)+1;
 var st=S.stat[q.t]||[0,0];st[1]++;
 if(ok){S.right++;if(q.type==='short')S.shorts++;st[0]++;delete S.miss[q.id];combo++;if(combo>S.best)S.best=combo;
  var mult=1+Math.min(combo-1,9)*0.1;
  gain=Math.round((8+4*q.l)*(q.type==='short'||q.type==='order'||q.type==='match'?1.5:1)*mult);
 }else{S.miss[q.id]=1;combo=0}
 S.stat[q.t]=st;
 if(gain&&helped)gain=Math.max(1,Math.round(gain/2));
 if(gain){var before=lvInfo().l;S.xp+=gain;S.coins+=Math.max(1,Math.round(gain/2));S.dxp[today()]=(S.dxp[today()]||0)+gain;if(lvInfo().l>before)levelUp()}
 S.days[today()]=1;
 if(typeof coachUpdate==='function')coachUpdate(q,ok,helped);
 checkBadges();save();hud();
 return gain;
}
