/* ===== native tools v2: scientific + graphing calculator (policy per question), scratchpad. No eval. ===== */
(function(){
var DEG=true,GDEG=false,ANS=0,pending=null;
var FN={sqrt:Math.sqrt,sin:function(x){return Math.sin(DEG?x*Math.PI/180:x)},cos:function(x){return Math.cos(DEG?x*Math.PI/180:x)},tan:function(x){return Math.tan(DEG?x*Math.PI/180:x)},asin:function(x){var r=Math.asin(x);return DEG?r*180/Math.PI:r},acos:function(x){var r=Math.acos(x);return DEG?r*180/Math.PI:r},atan:function(x){var r=Math.atan(x);return DEG?r*180/Math.PI:r},ln:Math.log,log:Math.log10,abs:Math.abs,exp:Math.exp,fact:function(n){if(n<0||n>170||n!==Math.floor(n))throw 0;var r=1;for(var k=2;k<=n;k++)r*=k;return r}};
function calc(src,env){
 var s=src.replace(/×/g,'*').replace(/÷/g,'/').replace(/−/g,'-').replace(/π/g,'pi').replace(/√/g,'sqrt').replace(/\s+/g,'').replace(/⁻¹/g,'inv').toLowerCase(),i=0;env=env||{};
 function peek(){return s[i]}
 function num(){var m=/^(\d+\.?\d*|\.\d+)(e[+-]?\d+)?/.exec(s.slice(i));if(!m)return null;i+=m[0].length;return parseFloat(m[0])}
 function ident(){var m=/^(asin|acos|atan|sqrt|sin|cos|tan|ln|log|abs|exp|fact|pi|ans|e|x|[abcdkmn])/.exec(s.slice(i));if(!m)return null;i+=m[0].length;return m[0]}
 function prim(){var c=peek();
  if(c==='('){i++;var v=expr();if(peek()===')')i++;return v}
  if(c==='|'){i++;var w=expr();if(peek()==='|')i++;return Math.abs(w)}
  if(c==='-'){i++;return -pow()}if(c==='+'){i++;return pow()}
  var n=num();if(n!==null)return n;
  var id=ident();if(!id)throw 0;if(id==='pi')return Math.PI;if(id==='e')return Math.E;if(id==='ans')return ANS;if(id==='x'){if(env.x===undefined)throw 0;return env.x}if(id.length===1&&id!=='e'){if(env[id]===undefined)throw 0;return env[id]}
  if(FN[id]){var a;if(peek()==='('){i++;a=expr();if(peek()===')')i++}else a=pow();return FN[id](a)}throw 0}
 function pow(){var b=prim();while(peek()==='!'){i++;b=FN.fact(b)}if(peek()==='^'){i++;var e=un();return Math.pow(b,e)}if(peek()==='%'){i++;return b/100}return b}
 function un(){if(peek()==='-'){i++;return -un()}if(peek()==='+'){i++}return pow()}
 function term(){var v=pow();for(;;){var c=peek();if(c==='*'){i++;v*=pow()}else if(c==='/'){i++;v/=pow()}else if(c&&(c==='('||c==='|'||/[a-z.\d]/.test(c))&&c!==')'){v*=pow()}else return v}}
 function expr(){var v=term();for(;;){var c=peek();if(c==='+'){i++;v+=term()}else if(c==='-'){i++;v-=term()}else return v}}
 var r=expr();if(i<s.length)throw 0;return r}
function fmt(r){if(!isFinite(r))throw 0;if(Math.abs(r)>=1e10||(Math.abs(r)<1e-7&&r!==0))return r.toExponential(6).replace(/\.?0+e/,'e').replace('e+','×10^').replace('e-','×10^−');return String(+r.toPrecision(10))}
window.__calc=function(s){return calc(s)};
/* ---- policy: which tools does this question allow? 0 none, 1 scientific, 2 scientific + graph ---- */
var TP={'apex-math':{fn:2,qd2:1,pl:1,ra:2,ex:2,lg:1,sq:1,tc:1,tg:2,ti:1,iv:1,id:1,tl:1,cn:2,pp:2,lm:2,dv:1,da:2,'in':1},
 'geometry-readiness':{eq:0,lin:2,sys:2,exp:1,fac:0,rad:1,qdr:2,bas:0,log:0,par:0,tri:0,quad:0,sim:1,rt:1,cir:1,con:0,area:1,sol:1,crd:1,trn:0},
 'quanta-physics':{dig:0},'circuit-lab-b':{hist:0,ctrl:0,logic:0,sym:0,hands:1,diode:1},'meteorology-b':{obs:0,maps:0,clouds:0,light:0,safety:0,cases:0,winter:0,hurr:0,torn:0}};
function pol(q){if(!q)return 1;if(q.type==='sim')return 1;var pid=(typeof P!=='undefined'&&P.meta&&P.meta.id||'').replace(/-20\d\d$/,''),tab=TP[pid]||{},base=tab[q.t]===undefined?1:tab[q.t];
 if(q.cp!==undefined)return q.cp;
 var numeric=q.num&&q.num.v!==undefined;if(!numeric&&q.type!=='graph')return 0;
 if(!numeric)return 0;
 var v=Math.abs(q.num.v),easy=q.l===1&&(v<=1000&&Math.abs(v-Math.round(v))<1e-9);if(easy)return 0;
 if(base===2){var tx=String(q.q||'');if(q.l<2||/amplitude|period of|vertex|asymptote|domain|range of|midline|phase|intercept|slope of|zero of|roots? of|solve|what is the value|evaluate|find f/i.test(tx))base=1;else if(q.l<3&&!/how many|number of|intersect|approximate|estimate|model|as x (approaches|gets)|end behavior|which graph|best (fit|describes)|where does|sketch|compare|increasing|decreasing/i.test(tx))base=1}
 return base}
function curPol(){if(!Z||Z.fin)return 0;var st=Z.steps[Z.i];if(!st)return 1;if(st.k==='try'&&st.it&&st.it.q)return pol(st.it.q);if(st.k==='explain'&&st.it&&st.it.q)return pol(st.it.q);return 1}
var panel=null,hist=[],tab='calc',gs={f:['','',''],x:[-10,10],y:[-8,8],tr:null,tbl:false,p:{},vis:[1,1,1]};
function used(){var o={};gs.f.forEach(function(f){f.toLowerCase().replace(/asin|acos|atan|sqrt|sin|cos|tan|ln|log|abs|exp|fact|ans|pi/g,'').replace(/[abcdkmn]/g,function(c){o[c]=1;return c})});return Object.keys(o).sort()}
function close(){if(panel){panel.remove();panel=null}}
var KEYS=[['2nd','2nd'],['deg','DEG'],['back','⌫'],['clr','C'],['ans','Ans'],
 ['sin(','sin'],['cos(','cos'],['tan(','tan'],['ln(','ln'],['log(','log'],
 ['^2','x²'],['√(','√'],['^','xʸ'],['π','π'],['e','e'],
 ['(','('],[')',')'],['!','n!'],['|','|x|'],['%','%']];
var KEYS2={'sin(':['asin(','sin⁻¹'],'cos(':['acos(','cos⁻¹'],'tan(':['atan(','tan⁻¹'],'ln(':['exp(','eˣ'],'log(':['10^','10ˣ']};
function openCalc(allowGraph,startTab){close();var second=false,pl=curPol();
 panel=document.createElement('div');panel.className='tpanel calc';panel.setAttribute('role','dialog');panel.setAttribute('aria-label','Calculator');
 panel.innerHTML='<div class="thd"><div class="ttabs" role="tablist"><button role="tab" data-tab="calc" aria-selected="true">Calculator</button>'+(allowGraph?'<button role="tab" data-tab="graph" aria-selected="false">Graph</button>':'')+'</div><span class="sp"></span><button class="tg" id="tdeg" aria-label="Angle mode">'+(DEG?'DEG':'RAD')+'</button><button class="iconbtn tx" aria-label="Close">×</button></div><div class="tbody" id="tb"></div>';
 document.body.appendChild(panel);var tb=panel.querySelector('#tb');
 function setTab(t){tab=t;panel.classList.toggle('wide',t==='graph');var hb=panel.querySelector('#tdeg');if(hb)hb.textContent=(t==='graph'?GDEG:DEG)?'DEG':'RAD';panel.querySelectorAll('[data-tab]').forEach(function(b){b.setAttribute('aria-selected',b.dataset.tab===t?'true':'false')});if(t==='calc')drawCalc();else drawGraph()}
 function drawCalc(){var inp;tb.innerHTML='<div class="tdisp"><div class="thist" id="thist"></div><input id="tin" inputmode="none" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Expression"><div class="tres" id="tres" aria-live="polite">0</div></div><div class="tkeys5" id="kf"></div><div class="tkeys" id="kn"></div>';
  inp=tb.querySelector('#tin');var kf=tb.querySelector('#kf'),kn=tb.querySelector('#kn');
  function keys(){kf.innerHTML=KEYS.map(function(k){var kk=k[0],lab=k[1];if(second&&KEYS2[k[0]]){kk=KEYS2[k[0]][0];lab=KEYS2[k[0]][1]}if(k[0]==='2nd')return '<button class="f'+(second?' on':'')+'" data-k="2nd" aria-pressed="'+second+'">2nd</button>';if(k[0]==='deg')return '<button class="f" data-k="deg">'+(DEG?'DEG':'RAD')+'</button>';return '<button class="f" data-k="'+kk+'">'+lab+'</button>'}).join('');
   kn.innerHTML=['7','8','9','÷','4','5','6','×','1','2','3','−','0','.','EE','+'].map(function(k){return '<button data-k="'+k+'" class="'+(/\d|\./.test(k)?'n':/[+−×÷]/.test(k)?'o':'f')+'">'+k+'</button>'}).join('')+'<button class="eq" data-k="eq" style="grid-column:1/-1">=</button>'}
  function upd(){var r=tb.querySelector('#tres'),h=tb.querySelector('#thist');h.innerHTML=hist.slice(-4).map(function(x,i){return '<button class="hrow" data-r="'+x[1]+'"><span>'+x[0]+'</span><b>'+x[1]+'</b></button>'}).join('');try{r.textContent=inp.value.trim()?fmt(calc(inp.value)):'0';r.classList.remove('bad')}catch(e){r.textContent=inp.value.trim()?'…':'0'}}
  function add(t){var a=inp.selectionStart==null?inp.value.length:inp.selectionStart,b2=inp.selectionEnd==null?a:inp.selectionEnd;inp.value=inp.value.slice(0,a)+t+inp.value.slice(b2);inp.setSelectionRange(a+t.length,a+t.length);upd()}
  keys();upd();inp.focus({preventScroll:true});
  tb.onclick=function(e){var b=e.target.closest('button');if(!b)return;window.sfx&&window.sfx('click');if(b.dataset.r){add(b.dataset.r);return}var k=b.dataset.k;if(!k)return;
   if(k==='2nd'){second=!second;keys();return}if(k==='deg'){DEG=!DEG;panel.querySelector('#tdeg').textContent=DEG?'DEG':'RAD';keys();upd();return}
   if(k==='clr'){inp.value='';upd()}else if(k==='back'){inp.value=inp.value.slice(0,-1);upd()}
   else if(k==='eq'){try{var r=fmt(calc(inp.value));ANS=calc(inp.value);hist.push([inp.value,r]);inp.value='';upd();inp.value=r.indexOf('×10')>0?'':r;upd()}catch(x){var rr=tb.querySelector('#tres');rr.textContent='Check the expression';rr.classList.add('bad')}}
   else if(k==='ans')add('ans');else if(k==='EE')add('e');else{add(k);if(second){second=false;keys()}}};
  inp.addEventListener('input',upd);inp.addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();tb.querySelector('[data-k=eq]').click()}if(e.key==='Escape')close();e.stopPropagation()},true)}
 function drawGraph(){tb.innerHTML='<div class="gwrap"><div class="gleft"><div class="gfs">'+[0,1,2].map(function(i){return '<div class="gf g'+i+'"><button class="gsw" data-sw="'+i+'" aria-pressed="'+!!gs.vis[i]+'" aria-label="Show or hide y'+(i+1)+'" style="--c:'+['#5b4bff','#e0412f','#0a8f5a'][i]+'"></button><input data-f="'+i+'" placeholder="'+['y = x^2','y = a*x+b','y = sin(x)'][i]+'" value="'+gs.f[i].replace(/"/g,'&quot;')+'" inputmode="text" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Function '+(i+1)+'"><button class="gcl" data-clr="'+i+'" aria-label="Clear function '+(i+1)+'">×</button></div>'}).join('')+'</div><div class="gps" id="gps"></div><div class="gq">'+['x','^','(',')','sin(','cos(','tan(','√(','π','abs(','ln(','a','b'].map(function(k){return '<button data-ins="'+k+'">'+k+'</button>'}).join('')+'</div></div><div class="gright"><div class="gcv"><canvas id="gc" aria-label="Graph. Drag to move, pinch or use plus and minus to zoom." role="img"></canvas><div class="gzm"><button data-g="in" aria-label="Zoom in">+</button><button data-g="out" aria-label="Zoom out">−</button><button data-g="reset" aria-label="Reset view">⌂</button></div><div class="gro" id="gro" aria-live="polite"></div></div><div class="gbt"><button data-g="tbl">Table</button><button data-g="deg">'+(GDEG?'DEG':'RAD')+'</button></div><div id="gtb"></div></div></div>';
  var cv=tb.querySelector('#gc'),g=cv.getContext('2d'),ro=tb.querySelector('#gro'),colors=['#5b4bff','#e0412f','#0a8f5a'],W=0,H=0,focused=null,UL=used(),psig='';
  function size(){var r=cv.getBoundingClientRect(),d=window.devicePixelRatio||1;W=r.width;H=r.height;cv.width=W*d;cv.height=H*d;g.setTransform(d,0,0,d,0,0)}
  function px(x){return (x-gs.x[0])/(gs.x[1]-gs.x[0])*W}function py(y){return H-(y-gs.y[0])/(gs.y[1]-gs.y[0])*H}
  function nice(span){var raw=span/6,p=Math.pow(10,Math.floor(Math.log10(raw))),m=raw/p;return (m<1.5?1:m<3.5?2:m<7.5?5:10)*p}
  function ev(i,x){var d=DEG;DEG=GDEG;try{var en={x:x};UL.forEach(function(c){en[c]=gs.p[c]===undefined?1:gs.p[c]});return calc(gs.f[i],en)}catch(e){return NaN}finally{DEG=d}}
  function draw(){g.clearRect(0,0,W,H);var cs=getComputedStyle(panel),ink=cs.color,bg=getComputedStyle(cv).backgroundColor,sx=nice(gs.x[1]-gs.x[0]),sy=nice(gs.y[1]-gs.y[0]),x,y;g.lineWidth=1;
   g.strokeStyle='rgba(120,120,140,.11)';g.beginPath();for(x=Math.ceil(gs.x[0]/(sx/5))*(sx/5);x<=gs.x[1];x+=sx/5){g.moveTo(px(x),0);g.lineTo(px(x),H)}for(y=Math.ceil(gs.y[0]/(sy/5))*(sy/5);y<=gs.y[1];y+=sy/5){g.moveTo(0,py(y));g.lineTo(W,py(y))}g.stroke();
   g.strokeStyle='rgba(120,120,140,.3)';g.beginPath();for(x=Math.ceil(gs.x[0]/sx)*sx;x<=gs.x[1];x+=sx){g.moveTo(px(x),0);g.lineTo(px(x),H)}for(y=Math.ceil(gs.y[0]/sy)*sy;y<=gs.y[1];y+=sy){g.moveTo(0,py(y));g.lineTo(W,py(y))}g.stroke();
   g.strokeStyle=ink;g.globalAlpha=.8;g.lineWidth=1.8;var ax=py(0),ay=px(0),axc=Math.min(H-16,Math.max(2,ax)),ayc=Math.min(W-4,Math.max(26,ay));g.beginPath();g.moveTo(0,axc);g.lineTo(W,axc);g.moveTo(ayc,0);g.lineTo(ayc,H);g.stroke();g.globalAlpha=1;
   g.font='11px system-ui,sans-serif';g.lineJoin='round';g.lineWidth=3;g.strokeStyle=bg;g.fillStyle='rgba(110,110,130,1)';g.textAlign='center';
   for(x=Math.ceil(gs.x[0]/sx)*sx;x<=gs.x[1];x+=sx)if(Math.abs(x)>sx/2){var t=String(+x.toFixed(6));g.strokeText(t,px(x),Math.min(H-4,axc+13));g.fillText(t,px(x),Math.min(H-4,axc+13))}
   g.textAlign='right';for(y=Math.ceil(gs.y[0]/sy)*sy;y<=gs.y[1];y+=sy)if(Math.abs(y)>sy/2){var u=String(+y.toFixed(6));g.strokeText(u,ayc-4,py(y)+4);g.fillText(u,ayc-4,py(y)+4)}
   g.lineJoin='round';g.lineCap='round';
   for(var i=0;i<3;i++){if(!gs.f[i].trim()||!gs.vis[i])continue;g.strokeStyle=colors[i];g.lineWidth=2.8;g.beginPath();var pen=false,py0=null;for(var p=0;p<=W;p+=1.5){var xv=gs.x[0]+p/W*(gs.x[1]-gs.x[0]),yv=ev(i,xv);if(!isFinite(yv)||Math.abs(yv)>1e7){pen=false;continue}var Y=py(yv);if(pen&&py0!==null&&Math.abs(Y-py0)>H*1.5){pen=false}if(!pen){g.moveTo(p,Y);pen=true}else g.lineTo(p,Y);py0=Y}g.stroke()}
   if(gs.tr){var T=gs.tr,yy=ev(T.i,T.x);if(isFinite(yy)){var X=px(T.x),Yp=py(yy);g.fillStyle='#fff';g.strokeStyle=colors[T.i];g.lineWidth=3;g.beginPath();g.arc(X,Yp,6,0,7);g.fill();g.stroke();
     var lab='('+(+T.x.toFixed(3))+', '+(+yy.toFixed(3))+')';g.font='700 12px ui-monospace,monospace';var tw=g.measureText(lab).width+14,bx=Math.min(W-tw-4,Math.max(4,X-tw/2)),by=Yp>40?Yp-34:Yp+14;g.fillStyle='rgba(40,42,60,.92)';g.beginPath();if(g.roundRect)g.roundRect(bx,by,tw,22,8);else g.rect(bx,by,tw,22);g.fill();g.fillStyle='#fff';g.textAlign='center';g.fillText(lab,bx+tw/2,by+15);
     ro.textContent='y'+(T.i+1)+': x = '+(+T.x.toFixed(4))+', y = '+(+yy.toFixed(4))}}else ro.textContent='Tap a curve to read a point.'}
  function params(){var L=UL.join(''),el=tb.querySelector('#gps');if(!el||L===psig)return;psig=L;el.innerHTML=UL.map(function(c){var v=gs.p[c]===undefined?1:gs.p[c];return '<label class="gp"><b>'+c+'</b><input type="range" min="-10" max="10" step="0.1" value="'+v+'" data-p="'+c+'" aria-label="Value of '+c+'"><output>'+v+'</output></label>'}).join('')}
  function table(){var t=tb.querySelector('#gtb');if(!t)return;if(!gs.tbl){t.innerHTML='';return}var fi=[0,1,2].filter(function(i){return gs.f[i].trim()}),st=nice(gs.x[1]-gs.x[0])/2,x0=Math.ceil(gs.x[0]/st)*st,h='<div class="gtw"><table><tr><th>x</th>'+fi.map(function(i){return '<th style="color:'+colors[i]+'">y'+(i+1)+'</th>'}).join('')+'</tr>';for(var k=0;k<12;k++){var x=+(x0+k*st).toFixed(6);h+='<tr><td>'+x+'</td>'+fi.map(function(i){var v=ev(i,x);return '<td>'+(isFinite(v)?+v.toFixed(4):'–')+'</td>'}).join('')+'</tr>'}t.innerHTML=h+'</table></div>'}
  function redraw(){if(!cv.isConnected)return;draw();table()}
  size();params();redraw();
  tb.addEventListener('focusin',function(e){if(e.target.dataset&&e.target.dataset.f!==undefined)focused=e.target});
  tb.addEventListener('input',function(e){var f=e.target.dataset&&e.target.dataset.f;if(f!==undefined){gs.f[+f]=e.target.value;gs.tr=null;UL=used();params();redraw()}var pp=e.target.dataset&&e.target.dataset.p;if(pp){gs.p[pp]=+e.target.value;var o=e.target.nextElementSibling;if(o)o.textContent=e.target.value;gs.tr=null;redraw()}});
  tb.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;window.sfx&&window.sfx('click');
   if(b.dataset.ins){var el=focused||tb.querySelector('[data-f="0"]');el.focus();var a=el.selectionStart==null?el.value.length:el.selectionStart,z=el.selectionEnd==null?a:el.selectionEnd;el.value=el.value.slice(0,a)+b.dataset.ins+el.value.slice(z);el.setSelectionRange(a+b.dataset.ins.length,a+b.dataset.ins.length);gs.f[+el.dataset.f]=el.value;UL=used();params();redraw();return}
   if(b.dataset.sw!==undefined){var k=+b.dataset.sw;gs.vis[k]=gs.vis[k]?0:1;b.setAttribute('aria-pressed',!!gs.vis[k]);gs.tr=null;redraw();return}if(b.dataset.clr!==undefined){var q=tb.querySelector('[data-f="'+b.dataset.clr+'"]');q.value='';gs.f[+b.dataset.clr]='';gs.tr=null;UL=used();params();redraw();q.focus();return}var a2=b.dataset.g;if(!a2)return;if(a2==='reset'){gs.x=[-10,10];gs.y=[-8,8];gs.tr=null}else if(a2==='tbl')gs.tbl=!gs.tbl;else if(a2==='deg'){GDEG=!GDEG;b.textContent=GDEG?'DEG':'RAD';panel.querySelector('#tdeg').textContent=b.textContent}else{var f=a2==='in'?.7:1.4,cx=(gs.x[0]+gs.x[1])/2,cy=(gs.y[0]+gs.y[1])/2,hx=(gs.x[1]-gs.x[0])/2*f,hy=(gs.y[1]-gs.y[0])/2*f;gs.x=[cx-hx,cx+hx];gs.y=[cy-hy,cy+hy]}redraw()});
  var ptr={},moved=0,pd=0;function loc(e){var r=cv.getBoundingClientRect();return [e.clientX-r.left,e.clientY-r.top]}
  cv.addEventListener('pointerdown',function(e){cv.setPointerCapture(e.pointerId);ptr[e.pointerId]=loc(e);moved=0;pd=0});
  cv.addEventListener('pointermove',function(e){if(!ptr[e.pointerId])return;var n=loc(e),o=ptr[e.pointerId],ids=Object.keys(ptr);
   if(ids.length===2){var other=ptr[ids.filter(function(k){return +k!==e.pointerId})[0]],d0=Math.hypot(o[0]-other[0],o[1]-other[1]),d1=Math.hypot(n[0]-other[0],n[1]-other[1]);if(d0>5){var f=d0/d1,cx=(gs.x[0]+gs.x[1])/2,cy=(gs.y[0]+gs.y[1])/2,hx=(gs.x[1]-gs.x[0])/2*f,hy=(gs.y[1]-gs.y[0])/2*f;gs.x=[cx-hx,cx+hx];gs.y=[cy-hy,cy+hy]}}
   else{var dx=(n[0]-o[0])/W*(gs.x[1]-gs.x[0]),dy=(n[1]-o[1])/H*(gs.y[1]-gs.y[0]);gs.x=[gs.x[0]-dx,gs.x[1]-dx];gs.y=[gs.y[0]+dy,gs.y[1]+dy]}
   moved+=Math.abs(n[0]-o[0])+Math.abs(n[1]-o[1]);ptr[e.pointerId]=n;gs.tr=null;redraw()});
  function up(e){var was=ptr[e.pointerId];delete ptr[e.pointerId];if(was&&moved<6&&!Object.keys(ptr).length){var x=gs.x[0]+was[0]/W*(gs.x[1]-gs.x[0]),best=null,bd=1e9;[0,1,2].forEach(function(i){if(!gs.f[i].trim()||!gs.vis[i])return;var y=ev(i,x);if(!isFinite(y))return;var d=Math.abs(py(y)-was[1]);if(d<bd){bd=d;best={i:i,x:x}}});gs.tr=bd<40?best:null;redraw()}}
  cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',function(e){delete ptr[e.pointerId]});
  cv.addEventListener('wheel',function(e){e.preventDefault();var f=e.deltaY<0?.85:1.18,cx=(gs.x[0]+gs.x[1])/2,cy=(gs.y[0]+gs.y[1])/2,hx=(gs.x[1]-gs.x[0])/2*f,hy=(gs.y[1]-gs.y[0])/2*f;gs.x=[cx-hx,cx+hx];gs.y=[cy-hy,cy+hy];redraw()},{passive:false});
  if(window.ResizeObserver)new ResizeObserver(function(){size();redraw()}).observe(cv)}
 panel.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;if(b.classList.contains('tx'))return close();if(b.id==='tdeg'){if(tab==='calc'){DEG=!DEG;b.textContent=DEG?'DEG':'RAD';drawCalc()}else{GDEG=!GDEG;b.textContent=GDEG?'DEG':'RAD';drawGraph()}return}if(b.dataset.tab&&b.dataset.tab!==tab)setTab(b.dataset.tab)});
 panel.addEventListener('keydown',function(e){if(e.key==='Escape')close()});
 setTab(startTab||'calc')}
/* scratchpad */
var pads={};
function openPad(){close();var key=(Z&&Z.i)||0,col='#2b2f45',w=3,er=false,hs=[];
 panel=document.createElement('div');panel.className='tpanel pad';panel.innerHTML='<div class="thd"><b>Scratchpad</b><span class="sp"></span><button class="tg" data-c="#2b2f45" style="background:#2b2f45"></button><button class="tg" data-c="#e0412f" style="background:#e0412f"></button><button class="tg" data-c="#2f6fe0" style="background:#2f6fe0"></button><button class="tg" data-c="er">Erase</button><button class="tg" data-c="un">Undo</button><button class="tg" data-c="cl">Clear</button><button class="iconbtn tx" aria-label="Close">×</button></div><canvas id="pc"></canvas>';
 document.body.appendChild(panel);var cv=panel.querySelector('#pc'),dpr=window.devicePixelRatio||1,r=cv.getBoundingClientRect();cv.width=r.width*dpr;cv.height=r.height*dpr;var g=cv.getContext('2d');g.scale(dpr,dpr);g.lineCap='round';g.lineJoin='round';
 if(pads[key]){var im=new Image();im.onload=function(){g.drawImage(im,0,0,r.width,r.height)};im.src=pads[key]}
 var down=false,lx,ly;function pos(e){var b=cv.getBoundingClientRect();return [e.clientX-b.left,e.clientY-b.top]}
 cv.addEventListener('pointerdown',function(e){down=true;cv.setPointerCapture(e.pointerId);hs.push(cv.toDataURL());if(hs.length>20)hs.shift();var p=pos(e);lx=p[0];ly=p[1];g.globalCompositeOperation=er?'destination-out':'source-over';g.strokeStyle=col;g.lineWidth=er?18:w;g.beginPath();g.moveTo(lx,ly);g.lineTo(lx+.01,ly);g.stroke()});
 cv.addEventListener('pointermove',function(e){if(!down)return;var p=pos(e);g.beginPath();g.moveTo(lx,ly);g.lineTo(p[0],p[1]);g.stroke();lx=p[0];ly=p[1]});
 function up(){if(down){down=false;pads[key]=cv.toDataURL()}}cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
 panel.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;if(b.classList.contains('tx')){pads[key]=cv.toDataURL();return close()}var c=b.dataset.c;if(!c)return;
  if(c==='cl'){g.clearRect(0,0,r.width,r.height);pads[key]=''}else if(c==='un'){var u=hs.pop();if(u){var m=new Image();m.onload=function(){g.globalCompositeOperation='source-over';g.clearRect(0,0,r.width,r.height);g.drawImage(m,0,0,r.width,r.height);pads[key]=cv.toDataURL()};m.src=u}}else if(c==='er')er=true;else{er=false;col=c}})}

function bar(){var s=document.getElementById('sess');if(!s||!Z||Z.fin){var o=document.getElementById('tbar');if(o)o.remove();close();return}
 var pl=curPol(),d=document.getElementById('tbar');if(!d){d=document.createElement('div');d.id='tbar';d.className='tbar';s.appendChild(d);d.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;if(b.id==='tpad')openPad();else if(b.id==='tcalc')openCalc(curPol()>=2,'calc');else if(b.id==='tgraph')openCalc(true,'graph')})}
 var sig=pl+':'+(Z.i||0);if(d.dataset.sig===sig)return;d.dataset.sig=sig;
 d.innerHTML='<button id="tpad" aria-label="Scratchpad"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20l4-1 11-11-3-3L5 16z"/><path d="M14 7l3 3"/></svg></button>'+(pl>=1?'<button id="tcalc" aria-label="Calculator"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="5" y="3" width="14" height="18" rx="3"/><path d="M8 7h8M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01"/></svg></button>':'')+(pl>=2?'<button id="tgraph" aria-label="Graphing calculator"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21V3M3 21h18"/><path d="M6 17c4 0 4-10 8-10s2 6 6 6"/></svg></button>':'')+(pl===0?'<span class="tnone" title="This question is meant to be done by hand or in your head">No calculator</span>':'');
 if(pl===0&&panel&&panel.classList.contains('calc'))close();else if(pl<2&&panel&&tab==='graph')close()}
var _ds=drawSess;drawSess=function(){_ds.apply(this,arguments);bar()};
var _cs=closeSess;closeSess=function(){close();var o=document.getElementById('tbar');if(o)o.remove();return _cs.apply(this,arguments)};
window.calcPolicy=pol;
})();
