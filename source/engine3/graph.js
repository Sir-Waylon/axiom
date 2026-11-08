/* ===== Graphing calculator (a Desmos-style tool built in house: no outside service, works offline) =====
   Type functions of x, vertical lines (x=2), points ((1,2)), or definitions (a=2). Names like a, b, k get sliders. */
(function(){
var PKID=(P.meta.id||'').replace(/-20\d\d$/,'');
var COL=['#2d70b3','#c74440','#388c46','#6042a6','#fa7e19','#000000'];
var FN1={sin:Math.sin,cos:Math.cos,tan:Math.tan,asin:Math.asin,acos:Math.acos,atan:Math.atan,arcsin:Math.asin,arccos:Math.acos,arctan:Math.atan,sinh:Math.sinh,cosh:Math.cosh,tanh:Math.tanh,sqrt:Math.sqrt,abs:Math.abs,ln:Math.log,log:Math.log10,exp:Math.exp,floor:Math.floor,ceil:Math.ceil,round:Math.round,sign:Math.sign,sec:function(x){return 1/Math.cos(x)},csc:function(x){return 1/Math.sin(x)},cot:function(x){return 1/Math.tan(x)}};
var CONST={pi:Math.PI,e:Math.E,tau:2*Math.PI};
/* ---- tokenizer + recursive-descent parser -> closure (never uses eval) ---- */
function tok(s){var t=[],i=0,m;s=s.replace(/π/g,'pi').replace(/−/g,'-').replace(/×/g,'*').replace(/÷/g,'/').replace(/²/g,'^2').replace(/³/g,'^3').replace(/\s+/g,'');
 while(i<s.length){var r=s.slice(i);
  if(m=/^(\d+\.?\d*|\.\d+)/.exec(r)){t.push({n:+m[1]});i+=m[1].length}
  else if(m=/^[a-zA-Z]+/.exec(r)){var w=m[0];i+=w.length;
   if(FN1[w]||CONST[w]!=null||w==='x'||w==='y'||w==='t'){t.push({w:w})}
   else if(r[w.length]==='('){throw new Error('Unknown function '+w)}
   else{var rest=w;while(rest){var fn=Object.keys(FN1).sort(function(a,b){return b.length-a.length}).filter(function(n){return rest.indexOf(n)===0})[0];if(fn&&rest.length>fn.length){t.push({w:fn});rest=rest.slice(fn.length)}else{t.push({w:rest[0]});rest=rest.slice(1)}}}}
  else if('+-*/^(),|=<>'.indexOf(r[0])>=0){t.push({o:r[0]});i++}
  else throw new Error('Unexpected '+r[0])}
 /* insert implicit multiplication */
 var o=[];for(i=0;i<t.length;i++){var a=t[i],b=t[i+1];o.push(a);if(!b)break;
  var aEnd=a.n!=null||(a.w&&!FN1[a.w])||a.o===')',bStart=b.n!=null||b.w||b.o==='(';
  if(aEnd&&bStart)o.push({o:'*'})}
 return o}
function parse(src,vars){var T=tok(src),p=0;
 function pk(){return T[p]}
 function ex(){return add()}
 function add(){var l=mul();while(pk()&&(pk().o==='+'||pk().o==='-')){var op=T[p++].o,r=mul(),a=l;l=op==='+'?(function(a,r){return function(c){return a(c)+r(c)}})(a,r):(function(a,r){return function(c){return a(c)-r(c)}})(a,r)}return l}
 function mul(){var l=un();while(pk()&&(pk().o==='*'||pk().o==='/')){var op=T[p++].o,r=un(),a=l;l=op==='*'?(function(a,r){return function(c){return a(c)*r(c)}})(a,r):(function(a,r){return function(c){return a(c)/r(c)}})(a,r)}return l}
 function un(){if(pk()&&pk().o==='-'){p++;var v=un();return function(c){return -v(c)}}if(pk()&&pk().o==='+'){p++;return un()}return pw()}
 function pw(){var b=at();if(pk()&&pk().o==='^'){p++;var e=un();return function(c){return Math.pow(b(c),e(c))}}return b}
 function at(){var t=T[p++];if(!t)throw new Error('Unfinished');
  if(t.n!=null)return function(){return t.n};
  if(t.o==='('){var v=ex();if(!pk()||pk().o!==')')throw new Error('Missing )');p++;return v}
  if(t.o==='|'){var v2=ex();if(!pk()||pk().o!=='|')throw new Error('Missing |');p++;return function(c){return Math.abs(v2(c))}}
  if(t.w){var w=t.w;
   if(FN1[w]){var f=FN1[w];var a=at();return function(c){return f(a(c))}}
   if(CONST[w]!=null){var k=CONST[w];return function(){return k}}
   if(w==='x')return function(c){return c.x};
   if(w==='t')return function(c){return c.t};
   if(w==='y')throw new Error('y can only appear on the left');
   vars[w]=1;return function(c){var v=c.v[w];return v==null?0:v}}
  throw new Error('Unexpected '+(t.o||''))}
 var v=ex();if(p<T.length)throw new Error('Unexpected '+(T[p].o||T[p].w||T[p].n));return v}
/* classify one row: {k:'fn'|'vline'|'pt'|'def'|'err'|'empty', ...} */
function compile(src){src=(src||'').trim();var o={src:src,vars:{}};if(!src){o.k='empty';return o}
 try{var s=src.replace(/\s+/g,'');var m;
  if(m=/^\(([^,()]+),([^,()]+)\)$/.exec(s)){o.k='pt';o.fx=parse(m[1],o.vars);o.fy=parse(m[2],o.vars);return o}
  if(!/^[xy]=/i.test(s)&&(m=/^([a-df-wzA-Z])=([^=]+)$/.exec(s))&&!/^[a-z]=/i.test(m[2].slice(0,0))){var vv={},f=parse(m[2],vv);if(!Object.keys(vv).length&&f({x:0,v:{}})===f({x:1,v:{}})&&isFinite(f({x:0,v:{}}))){o.k='def';o.name=m[1];o.val=f({x:0,v:{}});return o}}
  if(m=/^x=(.+)$/.exec(s)){o.k='vline';o.f=parse(m[1],o.vars);return o}
  s=s.replace(/^[a-z]\(x\)=/i,'').replace(/^y=/i,'');
  o.k='fn';o.f=parse(s,o.vars);return o
 }catch(e){o.k='err';o.msg=e.message;return o}}
/* ---- state ---- */
var G={rows:[{s:'y=x^2',on:1},{s:'y=a*sin(b*x)',on:1}],vars:{a:1,b:1},view:{cx:0,cy:0,sx:40},sel:null,tr:null};
function norm(){/* seed example variables */}
function varNames(cr){var n={};cr.forEach(function(c){if(c.k==='def')return;Object.keys(c.vars||{}).forEach(function(v){n[v]=1})});return Object.keys(n).sort()}
function defined(cr){var d={};cr.forEach(function(c){if(c.k==='def')d[c.name]=c.val});return d}
function compileAll(){return G.rows.map(function(r){var c=compile(r.s);c.on=r.on;return c})}
function evalVars(cr){var v={};var d=defined(cr);Object.keys(d).forEach(function(k){v[k]=d[k]});varNames(cr).forEach(function(k){if(d[k]==null)v[k]=G.vars[k]==null?1:G.vars[k]});return v}
function fmt(n){if(!isFinite(n))return '—';var a=Math.abs(n);if(a!==0&&(a<1e-4||a>=1e7))return n.toExponential(2);return String(+n.toFixed(4))}
/* ---- drawing ---- */
function nice(span){var raw=span/6,p=Math.pow(10,Math.floor(Math.log10(raw))),f=raw/p;return (f<1.5?1:f<3.5?2:f<7.5?5:10)*p}
function draw(cv){var dpr=Math.min(window.devicePixelRatio||1,2),W=cv.clientWidth,H=cv.clientHeight;if(!W||!H)return;if(cv.width!==Math.round(W*dpr)||cv.height!==Math.round(H*dpr)){cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr)}
 var c=cv.getContext('2d');c.setTransform(dpr,0,0,dpr,0,0);var cs=getComputedStyle(cv),fg=cs.color,V=G.view;
 c.fillStyle=cs.backgroundColor&&cs.backgroundColor!=='rgba(0, 0, 0, 0)'?cs.backgroundColor:'#fff';c.fillRect(0,0,W,H);
 var X=function(x){return W/2+(x-V.cx)*V.sx},Y=function(y){return H/2-(y-V.cy)*V.sx},x0=V.cx-W/2/V.sx,x1=V.cx+W/2/V.sx,y0=V.cy-H/2/V.sx,y1=V.cy+H/2/V.sx;
 var st=nice(Math.max(x1-x0,1e-9)*(Math.min(W,H)/W>0?1:1)),stx=nice(x1-x0),sty=nice(y1-y0);
 c.lineWidth=1;c.font='11px system-ui,sans-serif';
 var i,v,mn;
 c.strokeStyle='rgba(128,136,160,.22)';c.beginPath();for(v=Math.ceil(x0/stx)*stx;v<=x1;v+=stx){c.moveTo(Math.round(X(v))+.5,0);c.lineTo(Math.round(X(v))+.5,H)}for(v=Math.ceil(y0/sty)*sty;v<=y1;v+=sty){c.moveTo(0,Math.round(Y(v))+.5);c.lineTo(W,Math.round(Y(v))+.5)}c.stroke();
 c.strokeStyle='rgba(60,66,90,.7)';c.lineWidth=1.5;c.beginPath();var ax=Math.min(Math.max(X(0),0),W),ay=Math.min(Math.max(Y(0),0),H);c.moveTo(0,ay);c.lineTo(W,ay);c.moveTo(ax,0);c.lineTo(ax,H);c.stroke();
 c.fillStyle='rgba(90,98,125,.95)';c.textBaseline='top';c.textAlign='center';
 for(v=Math.ceil(x0/stx)*stx;v<=x1;v+=stx){if(Math.abs(v)<stx/2)continue;var ty=Math.min(Math.max(ay+4,2),H-14);c.fillText(fmt(+v.toPrecision(10)),X(v),ty)}
 c.textAlign='right';c.textBaseline='middle';for(v=Math.ceil(y0/sty)*sty;v<=y1;v+=sty){if(Math.abs(v)<sty/2)continue;var tx=Math.min(Math.max(ax-5,26),W-4);c.fillText(fmt(+v.toPrecision(10)),tx,Y(v))}
 var cr=G.cr,vars=G.ev,hit=[];
 cr.forEach(function(r,idx){if(!r.on)return;var col=COL[idx%COL.length];c.strokeStyle=col;c.fillStyle=col;c.lineWidth=2.5;c.lineJoin='round';
  if(r.k==='fn'){c.beginPath();var pen=false,py=0,ctx={v:vars,x:0},N=Math.min(Math.ceil(W*1.5),2400);for(i=0;i<=N;i++){var x=x0+(x1-x0)*i/N;ctx.x=x;var y=r.f(ctx);
    if(!isFinite(y)||Math.abs(y)>1e6){pen=false;continue}var px=X(x),pyy=Y(y);if(pen&&Math.abs(pyy-py)>H*1.2){pen=false}if(!pen){c.moveTo(px,pyy);pen=true}else c.lineTo(px,pyy);py=pyy}c.stroke();hit.push(r)}
  else if(r.k==='vline'){var xv=r.f({v:vars,x:0});c.beginPath();c.moveTo(X(xv),0);c.lineTo(X(xv),H);c.stroke()}
  else if(r.k==='pt'){var cx={v:vars,x:0},px2=r.fx(cx),py2=r.fy(cx);if(isFinite(px2)&&isFinite(py2)){c.beginPath();c.arc(X(px2),Y(py2),5,0,7);c.fill();c.fillStyle=fg;c.textAlign='left';c.textBaseline='bottom';c.fillText('('+fmt(px2)+', '+fmt(py2)+')',X(px2)+8,Y(py2)-6)}}});
 if(G.tr){var t=G.tr,tx2=X(t.x),ty2=Y(t.y);c.fillStyle=COL[t.i%COL.length];c.strokeStyle='#fff';c.lineWidth=2;c.beginPath();c.arc(tx2,ty2,6,0,7);c.fill();c.stroke();
  var lab='('+fmt(t.x)+', '+fmt(t.y)+')',w=c.measureText(lab).width+14,bx=Math.min(Math.max(tx2+10,4),W-w-4),by=Math.min(Math.max(ty2-30,4),H-26);c.fillStyle='rgba(30,34,52,.92)';c.beginPath();c.roundRect?c.roundRect(bx,by,w,22,8):c.rect(bx,by,w,22);c.fill();c.fillStyle='#fff';c.textAlign='left';c.textBaseline='middle';c.fillText(lab,bx+7,by+11)}}
/* ---- UI ---- */
function rowHTML(r,i,c){var col=COL[i%COL.length];var msg=c.k==='err'?'<div class="gerr" role="alert">'+esc(c.msg)+'</div>':'';
 return '<div class="grow'+(c.k==='err'?' bad':'')+'"><button type="button" class="gdot" style="background:'+(r.on?col:'transparent')+';border-color:'+col+'" data-gr="tog:'+i+'" aria-label="Show or hide expression '+(i+1)+'" aria-pressed="'+(!!r.on)+'"></button><input class="ginp" data-gi="'+i+'" value="'+esc(r.s)+'" spellcheck="false" autocomplete="off" autocapitalize="off" inputmode="text" aria-label="Expression '+(i+1)+'" placeholder="y = x^2, (2,3), x = 4, a = 2"><button type="button" class="gx" data-gr="del:'+i+'" aria-label="Delete expression '+(i+1)+'">×</button></div>'+msg}
function sliders(cr){var names=varNames(cr),d=defined(cr);names=names.filter(function(n){return d[n]==null});
 return names.map(function(n){var v=G.vars[n]==null?1:G.vars[n];return '<label class="gsl"><b>'+n+'</b><input type="range" min="-10" max="10" step="0.1" value="'+v+'" data-gs="'+n+'" aria-label="Slider '+n+'"><output>'+fmt(v)+'</output></label>'}).join('')}
var EXS=[['Parabola','y=x^2'],['Sine wave','y=a*sin(b*x)'],['Line','y=m*x+c'],['Circle top','y=sqrt(9-x^2)'],['Exponential','y=2^x'],['Log','y=ln(x)'],['Rational','y=1/x'],['Point','(2,3)'],['Vertical','x=2']];
function mount(root){var cv,tid=null;
 root.innerHTML='<p class="small mute">Type a function, a point like <code>(2,3)</code>, a vertical line like <code>x=2</code>, or a number like <code>a=2</code>. Letters such as <code>a</code>, <code>b</code>, <code>m</code> become sliders. Drag the graph to pan, pinch or use + and − to zoom, tap a curve to read a point.</p>'+
 '<div class="gcalc"><div class="gside"><div id="grows"></div><div class="row" style="margin:6px 0"><button class="btn sm" data-gr="add">+ Add</button><button class="btn sec sm" data-gr="reset">Reset</button></div><div id="gsl"></div><details class="gex"><summary>Examples</summary><div class="row" style="flex-wrap:wrap;gap:6px;margin-top:6px">'+EXS.map(function(e,i){return '<button class="chip" data-gr="ex:'+i+'">'+esc(e[0])+'</button>'}).join('')+'</div></details></div>'+
 '<div class="gplot"><canvas id="gcv" tabindex="0" role="img" aria-label="Graph. Arrow keys pan, plus and minus zoom." style="touch-action:none"></canvas><div class="gzoom"><button class="btn sec sm" data-gr="zi" aria-label="Zoom in">+</button><button class="btn sec sm" data-gr="zo" aria-label="Zoom out">−</button><button class="btn sec sm" data-gr="home" aria-label="Reset view">⌂</button></div></div></div>';
 cv=root.querySelector('#gcv');var pend=0;
 function redraw(){if(pend)return;pend=1;window.requestAnimationFrame(function(){pend=0;if(!root.isConnected)return;draw(cv)})}
 function recompute(full){G.cr=compileAll();G.ev=evalVars(G.cr);if(full){var h='';G.rows.forEach(function(r,i){h+=rowHTML(r,i,G.cr[i])});root.querySelector('#grows').innerHTML=h;root.querySelector('#gsl').innerHTML=sliders(G.cr)}else{root.querySelector('#gsl').innerHTML=sliders(G.cr);[].forEach.call(root.querySelectorAll('.grow'),function(el,i){var c=G.cr[i];el.classList.toggle('bad',c.k==='err');var nx=el.nextElementSibling;if(nx&&nx.classList.contains('gerr'))nx.remove();if(c.k==='err')el.insertAdjacentHTML('afterend','<div class="gerr" role="alert">'+esc(c.msg)+'</div>')})}G.tr=null;redraw()}
 root.addEventListener('input',function(e){var i=e.target.closest('[data-gi]');if(i){G.rows[+i.dataset.gi].s=i.value;recompute(false);return}var s=e.target.closest('[data-gs]');if(s){G.vars[s.dataset.gs]=+s.value;s.nextElementSibling.textContent=fmt(+s.value);G.ev=evalVars(G.cr);redraw()}});
 root.addEventListener('click',function(e){var b=e.target.closest('[data-gr]');if(!b)return;var a=b.dataset.gr.split(':');
  if(a[0]==='tog'){G.rows[+a[1]].on=G.rows[+a[1]].on?0:1;recompute(true)}
  else if(a[0]==='del'){G.rows.splice(+a[1],1);if(!G.rows.length)G.rows.push({s:'',on:1});recompute(true)}
  else if(a[0]==='add'){if(G.rows.length<8){G.rows.push({s:'',on:1});recompute(true);var ins=root.querySelectorAll('.ginp');ins[ins.length-1].focus()}}
  else if(a[0]==='reset'){G.rows=[{s:'y=x^2',on:1},{s:'y=a*sin(b*x)',on:1}];G.vars={a:1,b:1};G.view={cx:0,cy:0,sx:40};recompute(true)}
  else if(a[0]==='ex'){var ex=EXS[+a[1]][1];var empty=G.rows.filter(function(r){return !r.s.trim()})[0];if(empty)empty.s=ex;else if(G.rows.length<8)G.rows.push({s:ex,on:1});else G.rows[G.rows.length-1].s=ex;recompute(true)}
  else if(a[0]==='zi'||a[0]==='zo'){G.view.sx=Math.max(4,Math.min(4000,G.view.sx*(a[0]==='zi'?1.4:1/1.4)));redraw()}
  else if(a[0]==='home'){G.view={cx:0,cy:0,sx:40};redraw()}});
 /* pan / pinch / tap-trace */
 var ptr={},start=null,moved=false;
 cv.addEventListener('pointerdown',function(e){cv.focus({preventScroll:true});try{cv.setPointerCapture(e.pointerId)}catch(x){}ptr[e.pointerId]={x:e.clientX,y:e.clientY};moved=false;start={x:e.clientX,y:e.clientY,cx:G.view.cx,cy:G.view.cy,sx:G.view.sx,d:pd()}});
 function pd(){var k=Object.keys(ptr);if(k.length<2)return 0;var a=ptr[k[0]],b=ptr[k[1]];return Math.hypot(a.x-b.x,a.y-b.y)}
 cv.addEventListener('pointermove',function(e){if(!ptr[e.pointerId])return;ptr[e.pointerId]={x:e.clientX,y:e.clientY};var n=Object.keys(ptr).length;
  if(n>=2&&start.d){var d=pd();G.view.sx=Math.max(4,Math.min(4000,start.sx*d/start.d));moved=true;redraw();return}
  var dx=e.clientX-start.x,dy=e.clientY-start.y;if(Math.abs(dx)+Math.abs(dy)>4)moved=true;if(moved){G.view.cx=start.cx-dx/start.sx;G.view.cy=start.cy+dy/start.sx;G.tr=null;redraw()}});
 function up(e){var was=ptr[e.pointerId];delete ptr[e.pointerId];if(was&&!moved&&!Object.keys(ptr).length)trace(e);if(Object.keys(ptr).length===1){var k=Object.keys(ptr)[0];start={x:ptr[k].x,y:ptr[k].y,cx:G.view.cx,cy:G.view.cy,sx:G.view.sx,d:0}}}
 cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',function(e){delete ptr[e.pointerId]});
 cv.addEventListener('wheel',function(e){e.preventDefault();G.view.sx=Math.max(4,Math.min(4000,G.view.sx*(e.deltaY<0?1.12:1/1.12)));redraw()},{passive:false});
 cv.addEventListener('keydown',function(e){var st=40/G.view.sx,k=e.key,h=true;if(k==='ArrowLeft')G.view.cx-=st;else if(k==='ArrowRight')G.view.cx+=st;else if(k==='ArrowUp')G.view.cy+=st;else if(k==='ArrowDown')G.view.cy-=st;else if(k==='+'||k==='=')G.view.sx=Math.min(4000,G.view.sx*1.2);else if(k==='-')G.view.sx=Math.max(4,G.view.sx/1.2);else h=false;if(h){e.preventDefault();redraw()}});
 function trace(e){var r=cv.getBoundingClientRect(),V=G.view,px=e.clientX-r.left,py=e.clientY-r.top,x=V.cx+(px-r.width/2)/V.sx,best=null;
  G.cr.forEach(function(c,i){if(!c.on||c.k!=='fn')return;var y=c.f({v:G.ev,x:x});if(!isFinite(y))return;var dy=Math.abs((r.height/2-(y-V.cy)*V.sx)-py);if(dy<24&&(!best||dy<best.d))best={d:dy,i:i,x:x,y:y}});
  G.tr=best;redraw()}
 var ro=window.ResizeObserver?new ResizeObserver(function(){redraw()}):null;if(ro)ro.observe(cv);else window.addEventListener('resize',redraw);
 recompute(true)}
window.graphView=function(){setTimeout(function(){var r=document.getElementById('graphroot');if(r&&!r.dataset.on){r.dataset.on=1;mount(r)}},0);return '<div id="graphroot" class="card gcard"></div>'};
window.__hasGraph=function(){return ['apex-math','quanta-physics','geometry-readiness'].indexOf(PKID)>=0};
window.__graphParse=compile;
})();
