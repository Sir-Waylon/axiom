/* ===== interactive answer formats =====
   Typed numbers become a dial you tune (with fine nudges and a "type it instead" escape hatch). Multiple choice becomes
   swipe-to-judge cards: each choice is judged "fits" or "does not fit", so every distractor gets thought about.
   Yes/no becomes a two-way swipe. Only free-text answers stay typed. Data files are unchanged: the remap happens when a question is shown. */
(function(){
function hsh(s){var h=2166136261;s=String(s);for(var i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return (h^(h>>>15))>>>0}
function niceFloor(x){var p=Math.pow(10,Math.floor(Math.log10(x))),m=x/p;return (m>=5?5:m>=2?2:1)*p}
function niceCeil(x){var p=Math.pow(10,Math.floor(Math.log10(x))),m=x/p;return (m<=1?1:m<=2?2:m<=5?5:10)*p}
function tfmt(x,step){if(!isFinite(x))return '–';var ax=Math.abs(x);if(ax!==0&&(ax>=1e7||ax<1e-4))return x.toExponential(3).replace('e+','×10^').replace('e-','×10^−');var d=Math.max(0,Math.min(12,Math.ceil(-Math.log10(step)-1e-9)));return String(+x.toFixed(d)).replace('-','−')}
function unitOf(n){if(n.u)return n.u;if(n.show){var m=/^\s*[-−+]?[\d.,]+(?:\s*[×x*]\s*10\^?[-−+]?\d+)?\s*(.*)$/.exec(n.show);if(m&&m[1]&&m[1].length<14)return m[1]}return ''}
function spec(q){var n=q.num,v=n.v;if(!isFinite(v))return null;var av=Math.abs(v)||1,e=Math.floor(Math.log10(av)),tol=n.tol===undefined?.01:n.tol,step;
 if(v===0)step=.1;else if(Number.isInteger(v)&&av<1e6)step=1;else step=niceFloor(Math.min(Math.pow(10,e-2),Math.max(tol*av/2,Math.pow(10,e-4))));
 var h=hsh(q.id),R=niceCeil(av*(1.7+(h%100)/100*2.4));if(v===0)R=10;var N=Math.ceil(R/step);if(N>20000)return null;
 var mid=niceCeil(Math.max(1,N/60)),co=niceCeil(Math.max(2,N/8));return{step:step,N:N,mid:mid,co:co,unit:unitOf(n)}}
var YN=/^(yes|no|true|false)$/i;
function virt(q){
 if(q.type==='short'&&q.num&&!q.keep){var s=spec(q);if(s)return Object.assign({},q,{type:'tune',src:q,tn:s})}
 if((q.type==='mcq'||q.type==='short')&&q.o&&q.o.length>=2&&!q.keep)return Object.assign({},q,{type:'swipe',src:q});
 if(q.type==='short'&&q.text&&q.text.length&&q.text.every(function(t){return YN.test(String(t).trim())}))return Object.assign({},q,{type:'yn',src:q});
 return null}
/* ---------- tune ---------- */
IT.tune={init:function(it){it.val=null;it.k=null;it.typed=false},
 render:function(it,rev){var q=it.q,s=q.tn,k=it.k===null?0:it.k,x=k*s.step,cls=rev?(it.ok?'ok':'bad'):'',h='<div class="itx tune">';
  h+='<div class="tnrd '+cls+'" aria-live="polite"><b id="tnv">'+(it.val===null&&!rev?'?':tfmt(x,s.step))+'</b><span>'+esc(s.unit)+'</span></div>';
  if(it.typed&&!rev)h+='<div class="ans"><input id="tnt" type="text" inputmode="decimal" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Type your answer" value="'+(it.val===null?'':esc(String(it.val)))+'"></div>';
  else{h+='<input type="range" id="tnr" class="tnr" min="'+(-s.N)+'" max="'+s.N+'" step="1" value="'+k+'" aria-label="Answer dial"'+(rev?' disabled':'')+'>';
   if(!rev){var ds=[];[s.co,s.mid,1].forEach(function(d){if(ds.indexOf(d)<0)ds.push(d)});ds.sort(function(a,b){return b-a});
    h+='<div class="tnb">'+ds.map(function(d){return '<button data-tnd="'+(-d)+'" aria-label="Minus '+tfmt(d*s.step,s.step)+'">−'+tfmt(d*s.step,s.step).replace('−','')+'</button>'}).join('')+ds.slice().reverse().map(function(d){return '<button data-tnd="'+d+'" aria-label="Plus '+tfmt(d*s.step,s.step)+'">+'+tfmt(d*s.step,s.step).replace('−','')+'</button>'}).join('')+'</div>'}}
  if(!rev)h+='<button class="lnk" data-tntype="1">'+(it.typed?'Use the dial':'Type it instead')+'</button>';
  return h+'</div>'},
 ok:function(it){if(it.val===null)return false;var n=it.q.num,str=String(+Number(it.val).toPrecision(12));var r=gradeNum(n,n.free||!n.u?str:str+' '+n.u);it.res=r;return !!r.ok},
 done:function(it){return it.val!==null&&isFinite(it.val)},ans:function(q){return shortAnswer(q.src||q)}};
/* ---------- swipe-to-judge (multiple choice) ---------- */
IT.swipe={init:function(it){var n=it.q.o.length;it.jd=[];for(var i=0;i<n;i++)it.jd.push(null);it.ord=shuf(it.q.o.map(function(_,i){return i}));it.cs=0},
 nextOpen:function(it){for(var i=0;i<it.ord.length;i++)if(it.jd[it.ord[i]]===null)return i;return -1},
 render:function(it,rev){var q=it.q,h='<div class="itx swj">',all=it.jd.every(function(j){return j!==null});
  if(rev){h+='<ul class="swl">'+it.ord.map(function(oi){var good=oi===0,j=it.jd[oi],r=j===null?'skip':(j===good?'ok':'bad');return '<li class="'+r+'"><i aria-hidden="true">'+(good?'✓':'✗')+'</i><span>'+esc(q.o[oi])+'</span><em>'+(j===null?'not judged':j?'you: fits':'you: does not fit')+'</em></li>'}).join('')+'</ul>';return h+'</div>'}
  var cur=it.ord[it.cs];if(!all&&it.jd[cur]!==null){var nx=IT.swipe.nextOpen(it);if(nx>=0){it.cs=nx;cur=it.ord[nx]}}
  h+='<div class="swdots" role="tablist">'+it.ord.map(function(oi,i){var j=it.jd[oi];return '<button class="swd'+(i===it.cs?' cur':'')+(j===null?'':j?' yes':' no')+'" data-swi="'+i+'" aria-label="Choice '+(i+1)+(j===null?'':j?', fits':', does not fit')+'"></button>'}).join('')+'</div>';
  if(!all||it.edit!==undefined){var ci=it.ord[it.cs];h+='<div class="swstage"><div class="swcard" id="swc" data-oi2="'+ci+'" style="touch-action:pan-y"><small>Does this fit the question?</small><b>'+esc(q.o[ci])+'</b><div class="swhint"><span>✗ Does not fit</span><span>Fits ✓</span></div></div></div><div class="swbt"><button class="swno" data-swj="0">✗ Does not fit</button><button class="swyes" data-swj="1">Fits ✓</button></div><p class="small mute" style="text-align:center">Swipe the card or tap a button. '+it.jd.filter(function(j){return j!==null}).length+' of '+it.jd.length+' judged.</p>'}
  if(all)h+='<p class="small mute" style="text-align:center">All judged. Tap a dot to change one, then press Check.</p>';
  return h+'</div>'},
 ok:function(it){return it.jd.every(function(j,i){return j!==null&&j===(i===0)})},done:function(it){return it.jd.every(function(j){return j!==null})},ans:function(q){return (q.src||q).o[0]}};
/* ---------- yes / no ---------- */
IT.yn={init:function(it){it.val=null},render:function(it,rev){var ans=/^(yes|true)$/i.test(String(it.q.text[0]).trim())?'yes':'no',v=it.val;
  var b=function(k,l){var c='ynb '+k+(v===k?' on':'');if(rev){if(k===ans)c+=' good';else if(v===k)c+=' wrong'}return '<button class="'+c+'" data-yn="'+k+'"'+(rev?' disabled':'')+' aria-pressed="'+(v===k)+'">'+l+'</button>'};
  return '<div class="itx yn"><div class="ynrow">'+b('no','✗ No')+b('yes','Yes ✓')+'</div></div>'},
 ok:function(it){var ans=/^(yes|true)$/i.test(String(it.q.text[0]).trim())?'yes':'no';return it.val===ans},done:function(it){return it.val!==null},ans:function(q){return String((q.src||q).text[0])}};
/* ---------- wire in ---------- */

var _mk4=mkItem;mkItem=function(id,extra){var it=_mk4(id,extra),v=virt(it.q);if(v){it.q=v;IT[v.type].init(it);if(extra)for(var k in extra)it[k]=extra[k]}return it};
var MY={tune:1,swipe:1,yn:1};
var _qb4=qBody;qBody=function(it,rev){var q=it.q;if(!MY[q.type])return _qb4(it,rev);return (q.fig?figSVG(q.fig):'')+(q.svg?'<div class="figw">'+q.svg+'</div>':'')+'<div class="qtext">'+esc(q.q)+'</div>'+IT[q.type].render(it,rev)};
/* hints: eliminate wrong swipe choices by marking them for the student */
var _ansT=ansText;ansText=function(q){if(MY[q.type])return IT[q.type].ans(q);return _ansT(q)};
/* ---------- events ---------- */
function liveSet(it,k){var s=it.q.tn;k=Math.max(-s.N,Math.min(s.N,k));it.k=k;it.val=+(k*s.step).toFixed(12);var v=document.getElementById('tnv');if(v)v.textContent=tfmt(it.val,s.step);var r=document.getElementById('tnr');if(r)r.value=k;itEnable()}
function cur(){return Z&&Z.steps&&Z.steps[Z.i]&&Z.steps[Z.i].it}
document.addEventListener('input',function(e){var it=cur();if(!it||it.done)return;
 if(e.target.id==='tnr'&&it.q.type==='tune'){liveSet(it,+e.target.value);window.sfx&&window.sfx('tick');return}
 if(e.target.id==='tnt'&&it.q.type==='tune'){var p=parseNum(e.target.value);it.val=p&&isFinite(p.v)?p.v:null;itEnable()}});
document.addEventListener('click',function(e){var it=cur();if(!it||it.done)return;var t=e.target,b=t.closest&&t.closest('button');if(!b)return;
 if(it.q.type==='tune'){if(b.dataset.tnd!==undefined){liveSet(it,(it.k||0)+(+b.dataset.tnd));window.sfx&&window.sfx('tick');return}
  if(b.dataset.tntype){it.typed=!it.typed;drawSess();return}}
 if(it.q.type==='yn'&&b.dataset.yn){it.val=b.dataset.yn;window.sfx&&window.sfx('pop');drawSess();return}
 if(it.q.type==='swipe'){if(b.dataset.swj!==undefined){judge(it,b.dataset.swj==='1');return}if(b.dataset.swi!==undefined){it.cs=+b.dataset.swi;it.edit=1;drawSess();return}}});
function judge(it,yes){var oi=it.ord[it.cs];it.jd[oi]=yes;window.sfx&&window.sfx(yes?'pop':'tick');var n=IT.swipe.nextOpen(it);if(n>=0){it.cs=n;it.edit=undefined}else it.edit=undefined;drawSess()}
/* drag to swipe */
var drag=null;
document.addEventListener('pointerdown',function(e){var c=e.target.closest&&e.target.closest('#swc');if(!c)return;drag={c:c,x:e.clientX,dx:0};try{c.setPointerCapture(e.pointerId)}catch(x){}});
document.addEventListener('pointermove',function(e){if(!drag)return;drag.dx=e.clientX-drag.x;var c=drag.c;c.style.transform='translateX('+drag.dx+'px) rotate('+drag.dx/18+'deg)';c.classList.toggle('lf',drag.dx<-30);c.classList.toggle('rt',drag.dx>30)});
function endDrag(){if(!drag)return;var d=drag.dx,c=drag.c;drag=null;var it=cur();if(it&&it.q.type==='swipe'&&Math.abs(d)>70){c.style.transition='transform .18s';c.style.transform='translateX('+(d>0?420:-420)+'px) rotate('+(d>0?20:-20)+'deg)';setTimeout(function(){var i2=cur();if(i2&&i2.q.type==='swipe')judge(i2,d>0)},150)}else if(c){c.style.transform='';c.classList.remove('lf','rt')}}
document.addEventListener('pointerup',endDrag);document.addEventListener('pointercancel',endDrag);
document.addEventListener('keydown',function(e){var it=cur();if(!it||it.done||it.q.type!=='swipe')return;if(e.key==='ArrowRight'){judge(it,true)}else if(e.key==='ArrowLeft'){judge(it,false)}});
window.virtQ=virt;
})();
