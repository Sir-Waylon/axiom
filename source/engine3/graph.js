/* ===== Graphing calculator (a Desmos-style tool built in house: no outside service, works offline) =====
   Functions y=f(x), implicit curves (x^2+y^2=9), inequalities (y>x^2), points (draggable), vertical lines,
   tables with curve fitting, sliders (with play), and a geometry set for triangles. Every preset is a normal row you can edit. */
(function(){
var PKID=(P.meta.id||'').replace(/-20\d\d$/,'');
var COL=['#2d70b3','#c74440','#388c46','#6042a6','#fa7e19','#00838f','#8d6e63','#000000'];
var MAXROWS=14;
var FN1={sin:Math.sin,cos:Math.cos,tan:Math.tan,asin:Math.asin,acos:Math.acos,atan:Math.atan,arcsin:Math.asin,arccos:Math.acos,arctan:Math.atan,sinh:Math.sinh,cosh:Math.cosh,tanh:Math.tanh,sqrt:Math.sqrt,abs:Math.abs,ln:Math.log,log:Math.log10,exp:Math.exp,floor:Math.floor,ceil:Math.ceil,round:Math.round,sign:Math.sign,sec:function(x){return 1/Math.cos(x)},csc:function(x){return 1/Math.sin(x)},cot:function(x){return 1/Math.tan(x)}};
var CONST={pi:Math.PI,e:Math.E,tau:2*Math.PI};
var FNK=Object.keys(FN1).sort(function(a,b){return b.length-a.length});
/* ---------- tokenizer + recursive-descent parser -> closures (never uses eval) ---------- */
function tok(s){var t=[],i=0,m;s=s.replace(/π/g,'pi').replace(/−/g,'-').replace(/×/g,'*').replace(/÷/g,'/').replace(/²/g,'^2').replace(/³/g,'^3').replace(/\s+/g,'');
 while(i<s.length){var r=s.slice(i);
  if(m=/^(\d+\.?\d*|\.\d+)/.exec(r)){t.push({n:+m[1]});i+=m[1].length}
  else if(m=/^[a-zA-Z]+/.exec(r)){var w=m[0];i+=w.length;
   if(FN1[w]||CONST[w]!=null||w==='x'||w==='y'||w==='t'){t.push({w:w})}
   else if(r[w.length]==='('){throw new Error('Unknown function '+w)}
   else{var rest=w;while(rest){var fn=FNK.filter(function(n){return rest.indexOf(n)===0})[0];if(fn&&rest.length>fn.length){t.push({w:fn});rest=rest.slice(fn.length)}else{t.push({w:rest[0]});rest=rest.slice(1)}}}}
  else if('+-*/^()|'.indexOf(r[0])>=0){t.push({o:r[0]});i++}
  else throw new Error('Unexpected '+r[0])}
 var o=[];for(i=0;i<t.length;i++){var a=t[i],b=t[i+1];o.push(a);if(!b)break;
  var aEnd=a.n!=null||(a.w&&!FN1[a.w])||a.o===')',bStart=b.n!=null||b.w||b.o==='(';
  if(aEnd&&bStart)o.push({o:'*'})}
 return o}
function parse(src,vars,opt){opt=opt||{};var T=tok(src),p=0;
 function pk(){return T[p]}
 function add(){var l=mul();while(pk()&&(pk().o==='+'||pk().o==='-')){var op=T[p++].o,r=mul(),a=l;l=op==='+'?(function(a,r){return function(c){return a(c)+r(c)}})(a,r):(function(a,r){return function(c){return a(c)-r(c)}})(a,r)}return l}
 function mul(){var l=un();while(pk()&&(pk().o==='*'||pk().o==='/')){var op=T[p++].o,r=un(),a=l;l=op==='*'?(function(a,r){return function(c){return a(c)*r(c)}})(a,r):(function(a,r){return function(c){return a(c)/r(c)}})(a,r)}return l}
 function un(){if(pk()&&pk().o==='-'){p++;var v=un();return function(c){return -v(c)}}if(pk()&&pk().o==='+'){p++;return un()}return pw()}
 function pw(){var b=at();if(pk()&&pk().o==='^'){p++;var e=un();return function(c){return Math.pow(b(c),e(c))}}return b}
 function at(){var t=T[p++];if(!t)throw new Error('Unfinished');
  if(t.n!=null)return function(){return t.n};
  if(t.o==='('){var v=add();if(!pk()||pk().o!==')')throw new Error('Missing )');p++;return v}
  if(t.o==='|'){var v2=add();if(!pk()||pk().o!=='|')throw new Error('Missing |');p++;return function(c){return Math.abs(v2(c))}}
  if(t.w){var w=t.w;
   if(FN1[w]){var f=FN1[w];var a=at();return function(c){return f(a(c))}}
   if(CONST[w]!=null){var k=CONST[w];return function(){return k}}
   if(w==='x'){vars.__x=1;return function(c){return c.x}}
   if(w==='y'){if(!opt.y)throw new Error('y can only appear in an equation or inequality');vars.__y=1;return function(c){return c.y}}
   vars[w]=1;return function(c){var v=c.v[w];return v==null?0:v}}
  throw new Error('Unexpected '+(t.o||''))}
 var v=add();if(p<T.length)throw new Error('Unexpected '+(T[p].o||T[p].w||T[p].n));return v}
function splitTop(s,sep){var o=[],d=0,b=0;for(var i=0;i<s.length;i++){var c=s[i];if(c==='(')d++;else if(c===')')d--;else if(c===sep&&d===0){o.push(s.slice(b,i));b=i+1}}o.push(s.slice(b));return o}
function findRel(s){var d=0;for(var i=0;i<s.length;i++){var c=s[i];if(c==='(')d++;else if(c===')')d--;else if(d===0&&(c==='<'||c==='>'||c==='=')){var two=(c==='<'||c==='>')&&s[i+1]==='=';return{op:two?c+'=':c,i:i,len:two?2:1}}}return null}
var GEOP={midpoint:2,centroid:3,circumcenter:3,incenter:3,orthocenter:3};
var GEOD={segment:2,polygon:0,line:2,circumcircle:3,incircle:3,info:3};
function isConst(vars){return !Object.keys(vars).length}
/* classify one row text */
function compile(src){src=(src||'').trim();var o={src:src,vars:{}};if(!src){o.k='empty';return o}
 try{var s=src.replace(/\s+/g,'').replace(/≤/g,'<=').replace(/≥/g,'>='),m;
  /* geometry helpers */
  if(m=/^(?:([A-Z][A-Za-z0-9]*)=)?(midpoint|centroid|circumcenter|incenter|orthocenter)\(([A-Z][A-Za-z0-9]*(?:,[A-Z][A-Za-z0-9]*)*)\)$/.exec(s)){var ar=m[3].split(',');if(ar.length!==GEOP[m[2]])throw new Error(m[2]+' needs '+GEOP[m[2]]+' points');o.k='gpt';o.name=m[1]||'';o.fn=m[2];o.args=ar;return o}
  if(m=/^(segment|polygon|line|circumcircle|incircle|info)\(([A-Z][A-Za-z0-9]*(?:,[A-Z][A-Za-z0-9]*)*)\)$/.exec(s)){var a2=m[2].split(',');if(GEOD[m[1]]&&a2.length!==GEOD[m[1]])throw new Error(m[1]+' needs '+GEOD[m[1]]+' points');if(m[1]==='polygon'&&a2.length<3)throw new Error('polygon needs 3 or more points');o.k='gshape';o.fn=m[1];o.args=a2;return o}
  if(m=/^circle\(([A-Z][A-Za-z0-9]*),(.+)\)$/.exec(s)){o.k='gshape';o.fn='circle';o.args=[m[1]];o.rf=parse(m[2],o.vars);return o}
  /* points: (a,b) or A=(a,b) */
  if(m=/^(?:([A-Z][A-Za-z0-9]*)=)?(\(.*\))$/.exec(s)){var inner=m[2].slice(1,-1),pr=splitTop(inner,',');
   if(pr.length===2&&m[2][0]==='('&&splitTop(s.replace(/^[A-Z][A-Za-z0-9]*=/,''),'(').length>=1){var vp={};var fx=parse(pr[0],vp),fy=parse(pr[1],vp);o.k='pt';o.name=m[1]||'';o.fx=fx;o.fy=fy;o.vars=vp;
    if(vp.__x||vp.__y)throw new Error('A point cannot use x or y');
    if(isConst(vp)){o.cx=fx({v:{}});o.cy=fy({v:{}});o.drag=isFinite(o.cx)&&isFinite(o.cy)}return o}}
  var rel=findRel(s);
  if(rel){var L=s.slice(0,rel.i),Rr=s.slice(rel.i+rel.len);if(!L||!Rr)throw new Error('Finish both sides');
   if(rel.op==='='){
    var vv={};
    if(/^[a-df-wzA-Z]$/.test(L)&&!/^[xy]$/.test(L)){var f0=parse(Rr,vv);if(isConst(vv)&&isFinite(f0({v:{}}))){o.k='def';o.name=L;o.val=f0({v:{}});return o}}
    if(L==='x'){var vx={};var fxx=parse(Rr,vx,{y:true});if(!vx.__x&&!vx.__y){o.k='vline';o.f=fxx;o.vars=vx;return o}}
    if(/^[a-z]\(x\)$/i.test(L)||L==='y'){var vf={};var ff=parse(Rr,vf);o.k='fn';o.f=ff;o.vars=vf;return o}
    o.k='imp';var vi=o.vars;var fl=parse(L,vi,{y:true}),fr=parse(Rr,vi,{y:true});if(!vi.__x&&!vi.__y)throw new Error('Use x or y in an equation');o.F=function(c){return fl(c)-fr(c)};return o}
   o.k='ineq';o.op=rel.op;var vq=o.vars;var gl=parse(L,vq,{y:true}),gr=parse(Rr,vq,{y:true});if(!vq.__x&&!vq.__y)throw new Error('Use x or y in an inequality');o.F=function(c){return gl(c)-gr(c)};return o}
  o.k='fn';o.f=parse(s.replace(/^[a-z]\(x\)=/i,''),o.vars);return o
 }catch(e){o.k='err';o.msg=e.message;return o}}
/* ---------- state ---------- */
var DEF_ROWS=function(){return[{s:'y=x^2',on:1},{s:'y=a*sin(b*x)',on:1}]};
var G={rows:DEF_ROWS(),vars:{a:1,b:1},rng:{},view:{cx:0,cy:0,sx:40},tr:null,anim:{},pend:null};
function varNames(cr){var n={};cr.forEach(function(c){if(c.k==='def'||!c.vars)return;Object.keys(c.vars).forEach(function(v){if(v.indexOf('__')!==0)n[v]=1})});return Object.keys(n).sort()}
function defined(cr){var d={};cr.forEach(function(c){if(c.k==='def')d[c.name]=c.val});return d}
function rangeOf(n){return G.rng[n]||[-10,10]}
function compileAll(){return G.rows.map(function(r){if(r.tbl){return tableCompile(r)}var c=compile(r.s);c.on=r.on;return c})}
function evalVars(cr){var v={},d=defined(cr);Object.keys(d).forEach(function(k){v[k]=d[k]});varNames(cr).forEach(function(k){if(d[k]==null){var g=G.vars[k];v[k]=g==null?1:g}});return v}
function fmt(n){if(!isFinite(n))return '—';var a=Math.abs(n);if(a!==0&&(a<1e-4||a>=1e7))return n.toExponential(2);return String(+n.toFixed(4))}
function f2(n){return String(+n.toFixed(2))}
/* ---------- tables and curve fitting ---------- */
function tableCompile(r){var c={k:'tbl',on:r.on,vars:{},row:r,pts:[]};
 var xs=[],ys=[];
 var yf=null;if(r.yf&&r.yf.trim()){try{var vv={};yf=parse(r.yf.replace(/x1/g,'x'),vv)}catch(e){c.msg='Formula: '+e.message}}
 for(var i=0;i<r.xs.length;i++){var xv=parseFloat(r.xs[i]);if(!isFinite(xv))continue;var yv=yf?yf({x:xv,v:{}}):parseFloat(r.ys[i]);if(!isFinite(yv))continue;c.pts.push([xv,yv])}
 c.fit=null;if(r.fit&&c.pts.length>=2)c.fit=fitCurve(c.pts,r.fit);return c}
function solve(A,b){var n=b.length,i,j,k;for(i=0;i<n;i++){var mx=i;for(j=i+1;j<n;j++)if(Math.abs(A[j][i])>Math.abs(A[mx][i]))mx=j;var t=A[i];A[i]=A[mx];A[mx]=t;t=b[i];b[i]=b[mx];b[mx]=t;if(Math.abs(A[i][i])<1e-12)return null;for(j=i+1;j<n;j++){var f=A[j][i]/A[i][i];for(k=i;k<n;k++)A[j][k]-=f*A[i][k];b[j]-=f*b[i]}}
 var x=new Array(n);for(i=n-1;i>=0;i--){var s=b[i];for(j=i+1;j<n;j++)s-=A[i][j]*x[j];x[i]=s/A[i][i]}return x}
function fitCurve(pts,kind){var n=pts.length,deg=kind==='line'?1:kind==='quad'?2:0,f=null,txt='';
 if(kind==='exp'){var q=pts.filter(function(p){return p[1]>0});if(q.length<2)return null;var l=fitCurve(q.map(function(p){return[p[0],Math.log(p[1])]}),'line');if(!l)return null;var A=Math.exp(l.c[1]),B=l.c[0];f=function(x){return A*Math.exp(B*x)};txt='y = '+f2(A)+'·e^('+f2(B)+'x)';var rr=r2(pts,f);return{f:f,txt:txt,r2:rr,src:'y='+A.toFixed(4)+'*exp('+B.toFixed(4)+'*x)'}}
 if(n<deg+1)return null;var M=[],b=[];for(var i=0;i<=deg;i++){M[i]=[];b[i]=0;for(var j=0;j<=deg;j++){var s=0;pts.forEach(function(p){s+=Math.pow(p[0],i+j)});M[i][j]=s}pts.forEach(function(p){b[i]+=p[1]*Math.pow(p[0],i)})}
 var c=solve(M,b);if(!c)return null;
 f=function(x){var s=0;for(var i=0;i<=deg;i++)s+=c[i]*Math.pow(x,i);return s};
 txt=deg===1?'y = '+f2(c[1])+'x '+(c[0]<0?'− ':'+ ')+f2(Math.abs(c[0])):'y = '+f2(c[2])+'x² '+(c[1]<0?'− ':'+ ')+f2(Math.abs(c[1]))+'x '+(c[0]<0?'− ':'+ ')+f2(Math.abs(c[0]));
 var src=deg===1?'y='+c[1].toFixed(4)+'*x+'+c[0].toFixed(4):'y='+c[2].toFixed(4)+'*x^2+'+c[1].toFixed(4)+'*x+'+c[0].toFixed(4);
 return{f:f,txt:txt,r2:r2(pts,f),c:c,src:src}}
function r2(pts,f){var m=0;pts.forEach(function(p){m+=p[1]});m/=pts.length;var st=0,sr=0;pts.forEach(function(p){st+=Math.pow(p[1]-m,2);sr+=Math.pow(p[1]-f(p[0]),2)});return st?1-sr/st:1}
/* ---------- geometry ---------- */
function ptTable(cr,vars){var T={};cr.forEach(function(c){if(c.k==='pt'&&c.name){var cx={v:vars,x:0};T[c.name]=[c.fx(cx),c.fy(cx)]}});
 var pass=0,again=true;while(again&&pass++<3){again=false;cr.forEach(function(c){if(c.k==='gpt'&&c.name&&!T[c.name]){var r=geoPt(c,T);if(r){T[c.name]=r;again=true}}})}return T}
function geoPt(c,T){var A=c.args.map(function(n){return T[n]});if(A.some(function(a){return !a}))return null;return GEOF[c.fn](A)}
var GEOF={midpoint:function(A){return[(A[0][0]+A[1][0])/2,(A[0][1]+A[1][1])/2]},
 centroid:function(A){return[(A[0][0]+A[1][0]+A[2][0])/3,(A[0][1]+A[1][1]+A[2][1])/3]},
 circumcenter:function(A){var a=A[0],b=A[1],c=A[2],d=2*(a[0]*(b[1]-c[1])+b[0]*(c[1]-a[1])+c[0]*(a[1]-b[1]));if(Math.abs(d)<1e-9)return null;var a2=a[0]*a[0]+a[1]*a[1],b2=b[0]*b[0]+b[1]*b[1],c2=c[0]*c[0]+c[1]*c[1];return[(a2*(b[1]-c[1])+b2*(c[1]-a[1])+c2*(a[1]-b[1]))/d,(a2*(c[0]-b[0])+b2*(a[0]-c[0])+c2*(b[0]-a[0]))/d]},
 incenter:function(A){var a=dist(A[1],A[2]),b=dist(A[0],A[2]),c=dist(A[0],A[1]),s=a+b+c;if(s<1e-9)return null;return[(a*A[0][0]+b*A[1][0]+c*A[2][0])/s,(a*A[0][1]+b*A[1][1]+c*A[2][1])/s]},
 orthocenter:function(A){var O=GEOF.circumcenter(A),G0=GEOF.centroid(A);if(!O)return null;return[3*G0[0]-2*O[0],3*G0[1]-2*O[1]]}};
function dist(p,q){return Math.hypot(p[0]-q[0],p[1]-q[1])}
function triInfo(A){var a=dist(A[1],A[2]),b=dist(A[0],A[2]),c=dist(A[0],A[1]);var area=Math.abs((A[1][0]-A[0][0])*(A[2][1]-A[0][1])-(A[2][0]-A[0][0])*(A[1][1]-A[0][1]))/2;
 if(area<1e-9)return 'Degenerate: the three points are in a line.';
 var ang=function(x,y,z){return Math.acos(Math.max(-1,Math.min(1,(y*y+z*z-x*x)/(2*y*z))))*180/Math.PI},al=ang(a,b,c),be=ang(b,a,c),ga=180-al-be,tol=1e-6*Math.max(a,b,c);
 var sides=[a,b,c].sort(function(p,q){return p-q}),iso=Math.abs(sides[0]-sides[1])<1e-2*sides[2]||Math.abs(sides[1]-sides[2])<1e-2*sides[2],eq=Math.abs(sides[0]-sides[2])<1e-2*sides[2];
 var big=Math.max(al,be,ga),kind=Math.abs(big-90)<.3?'right':big>90?'obtuse':'acute';
 return 'Sides a='+f2(a)+' b='+f2(b)+' c='+f2(c)+' · Angles A='+f2(al)+'° B='+f2(be)+'° C='+f2(ga)+'° · Area '+f2(area)+' · Perimeter '+f2(a+b+c)+' · '+(eq?'equilateral':iso?'isosceles':'scalene')+', '+kind}
/* ---------- marching squares / drawing ---------- */
function nice(span){var raw=span/6,p=Math.pow(10,Math.floor(Math.log10(raw))),f=raw/p;return (f<1.5?1:f<3.5?2:f<7.5?5:10)*p}
function hex2rgba(h,a){var n=parseInt(h.slice(1),16);return 'rgba('+(n>>16)+','+((n>>8)&255)+','+(n&255)+','+a+')'}
function grid(F,vars,x0,x1,y0,y1,W,H){var cell=Math.max(5,Math.ceil(Math.sqrt(W*H/22000))),nx=Math.ceil(W/cell),ny=Math.ceil(H/cell),vals=new Float64Array((nx+1)*(ny+1)),ctx={v:vars,x:0,y:0};
 for(var j=0;j<=ny;j++){ctx.y=y1-(y1-y0)*j/ny;for(var i=0;i<=nx;i++){ctx.x=x0+(x1-x0)*i/nx;var v=F(ctx);vals[j*(nx+1)+i]=isFinite(v)&&Math.abs(v)<1e9?v:NaN}}
 return{nx:nx,ny:ny,vals:vals,cw:W/nx,ch:H/ny}}
function contour(c,g){c.beginPath();var nx=g.nx,ny=g.ny,V=g.vals,cw=g.cw,ch=g.ch;
 for(var j=0;j<ny;j++)for(var i=0;i<nx;i++){var a=V[j*(nx+1)+i],b=V[j*(nx+1)+i+1],d=V[(j+1)*(nx+1)+i],e=V[(j+1)*(nx+1)+i+1];if(a!==a||b!==b||d!==d||e!==e)continue;
  var pts=[];
  if((a<0)!==(b<0))pts.push([i+a/(a-b),j]);
  if((b<0)!==(e<0))pts.push([i+1,j+b/(b-e)]);
  if((d<0)!==(e<0))pts.push([i+d/(d-e),j+1]);
  if((a<0)!==(d<0))pts.push([i,j+a/(a-d)]);
  if(pts.length===2){c.moveTo(pts[0][0]*cw,pts[0][1]*ch);c.lineTo(pts[1][0]*cw,pts[1][1]*ch)}
  else if(pts.length===4){c.moveTo(pts[0][0]*cw,pts[0][1]*ch);c.lineTo(pts[1][0]*cw,pts[1][1]*ch);c.moveTo(pts[2][0]*cw,pts[2][1]*ch);c.lineTo(pts[3][0]*cw,pts[3][1]*ch)}}
 c.stroke()}
function shade(c,g,op){var nx=g.nx,ny=g.ny,V=g.vals,cw=g.cw,ch=g.ch;
 for(var j=0;j<ny;j++){var run=-1;for(var i=0;i<=nx;i++){var ok=false;if(i<nx){var a=V[j*(nx+1)+i],b=V[j*(nx+1)+i+1],d=V[(j+1)*(nx+1)+i],e=V[(j+1)*(nx+1)+i+1],m=(a+b+d+e)/4;ok=m===m&&(op==='>'||op==='>='?m>=0:m<=0)}
  if(ok&&run<0)run=i;if(!ok&&run>=0){c.fillRect(run*cw,j*ch,(i-run)*cw+.5,ch+.5);run=-1}}}}
function draw(cv){var dpr=Math.min(window.devicePixelRatio||1,2),W=cv.clientWidth,H=cv.clientHeight;if(!W||!H)return;if(cv.width!==Math.round(W*dpr)||cv.height!==Math.round(H*dpr)){cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr)}
 var c=cv.getContext('2d');c.setTransform(dpr,0,0,dpr,0,0);var cs=getComputedStyle(cv),fg=cs.color,V=G.view;
 c.fillStyle=cs.backgroundColor&&cs.backgroundColor!=='rgba(0, 0, 0, 0)'?cs.backgroundColor:'#fff';c.fillRect(0,0,W,H);
 var X=function(x){return W/2+(x-V.cx)*V.sx},Y=function(y){return H/2-(y-V.cy)*V.sx},x0=V.cx-W/2/V.sx,x1=V.cx+W/2/V.sx,y0=V.cy-H/2/V.sx,y1=V.cy+H/2/V.sx;
 var stx=nice(x1-x0),sty=nice(y1-y0),i,v;
 c.lineWidth=1;c.font='11px system-ui,sans-serif';
 c.strokeStyle='rgba(128,136,160,.22)';c.beginPath();for(v=Math.ceil(x0/stx)*stx;v<=x1;v+=stx){c.moveTo(Math.round(X(v))+.5,0);c.lineTo(Math.round(X(v))+.5,H)}for(v=Math.ceil(y0/sty)*sty;v<=y1;v+=sty){c.moveTo(0,Math.round(Y(v))+.5);c.lineTo(W,Math.round(Y(v))+.5)}c.stroke();
 c.strokeStyle='rgba(60,66,90,.7)';c.lineWidth=1.5;c.beginPath();var ax=Math.min(Math.max(X(0),0),W),ay=Math.min(Math.max(Y(0),0),H);c.moveTo(0,ay);c.lineTo(W,ay);c.moveTo(ax,0);c.lineTo(ax,H);c.stroke();
 c.fillStyle='rgba(90,98,125,.95)';c.textBaseline='top';c.textAlign='center';
 for(v=Math.ceil(x0/stx)*stx;v<=x1;v+=stx){if(Math.abs(v)<stx/2)continue;c.fillText(fmt(+v.toPrecision(10)),X(v),Math.min(Math.max(ay+4,2),H-14))}
 c.textAlign='right';c.textBaseline='middle';for(v=Math.ceil(y0/sty)*sty;v<=y1;v+=sty){if(Math.abs(v)<sty/2)continue;c.fillText(fmt(+v.toPrecision(10)),Math.min(Math.max(ax-5,26),W-4),Y(v))}
 var cr=G.cr,vars=G.ev,PT=G.pt,label=function(txt,px,py,col){c.fillStyle=col||fg;c.font='bold 12px system-ui,sans-serif';c.textAlign='left';c.textBaseline='bottom';c.fillText(txt,px+8,py-6)};
 var dot=function(px,py,col,drag){c.fillStyle=col;c.beginPath();c.arc(px,py,drag?7:5,0,7);c.fill();if(drag){c.strokeStyle='#fff';c.lineWidth=2;c.stroke()}};
 /* shaded regions first so curves sit on top */
 cr.forEach(function(r,idx){if(!r.on||r.k!=='ineq')return;var col=COL[idx%COL.length],g=grid(r.F,vars,x0,x1,y0,y1,W,H);c.fillStyle=hex2rgba(col,.2);shade(c,g,r.op);c.strokeStyle=col;c.lineWidth=2;c.setLineDash(r.op.length===1?[7,5]:[]);contour(c,g);c.setLineDash([])});
 cr.forEach(function(r,idx){if(!r.on)return;var col=COL[idx%COL.length];c.strokeStyle=col;c.fillStyle=col;c.lineWidth=2.5;c.lineJoin='round';c.setLineDash([]);
  if(r.k==='fn'){c.beginPath();var pen=false,py=0,ctx={v:vars,x:0},N=Math.min(Math.ceil(W*1.5),2400);for(i=0;i<=N;i++){var x=x0+(x1-x0)*i/N;ctx.x=x;var y=r.f(ctx);
    if(!isFinite(y)||Math.abs(y)>1e6){pen=false;continue}var px=X(x),pyy=Y(y);if(pen&&Math.abs(pyy-py)>H*1.2)pen=false;if(!pen){c.moveTo(px,pyy);pen=true}else c.lineTo(px,pyy);py=pyy}c.stroke()}
  else if(r.k==='vline'){var xv=r.f({v:vars,x:0,y:0});c.beginPath();c.moveTo(X(xv),0);c.lineTo(X(xv),H);c.stroke()}
  else if(r.k==='imp'){contour(c,grid(r.F,vars,x0,x1,y0,y1,W,H))}
  else if(r.k==='pt'){var cx={v:vars,x:0},px2=r.fx(cx),py2=r.fy(cx);if(isFinite(px2)&&isFinite(py2)){dot(X(px2),Y(py2),col,r.drag);label(r.name||'('+fmt(px2)+', '+fmt(py2)+')',X(px2),Y(py2),r.name?col:fg)}}
  else if(r.k==='gpt'){var q=geoPt(r,PT);if(q){dot(X(q[0]),Y(q[1]),col,false);label((r.name||r.fn)+(r.name?'':''),X(q[0]),Y(q[1]),col)}}
  else if(r.k==='gshape'){var A=r.args.map(function(n){return PT[n]});if(A.some(function(a){return !a}))return;
   if(r.fn==='segment'){c.beginPath();c.moveTo(X(A[0][0]),Y(A[0][1]));c.lineTo(X(A[1][0]),Y(A[1][1]));c.stroke()}
   else if(r.fn==='line'){var dx=A[1][0]-A[0][0],dy=A[1][1]-A[0][1],L=1e4;c.beginPath();c.moveTo(X(A[0][0]-dx*L),Y(A[0][1]-dy*L));c.lineTo(X(A[0][0]+dx*L),Y(A[0][1]+dy*L));c.stroke()}
   else if(r.fn==='polygon'){c.beginPath();A.forEach(function(p,k){k?c.lineTo(X(p[0]),Y(p[1])):c.moveTo(X(p[0]),Y(p[1]))});c.closePath();c.fillStyle=hex2rgba(col,.12);c.fill();c.stroke()}
   else if(r.fn==='circumcircle'||r.fn==='incircle'||r.fn==='circle'){var cc,rad;if(r.fn==='circumcircle'){cc=GEOF.circumcenter(A);rad=cc&&dist(cc,A[0])}else if(r.fn==='incircle'){cc=GEOF.incenter(A);var a_=dist(A[1],A[2]),b_=dist(A[0],A[2]),c_=dist(A[0],A[1]),s=(a_+b_+c_)/2,ar=Math.abs((A[1][0]-A[0][0])*(A[2][1]-A[0][1])-(A[2][0]-A[0][0])*(A[1][1]-A[0][1]))/2;rad=cc&&ar/s}else{cc=A[0];rad=r.rf({v:vars,x:0})}
    if(cc&&isFinite(rad)&&rad>0){c.beginPath();c.arc(X(cc[0]),Y(cc[1]),rad*V.sx,0,7);c.stroke()}}}
  else if(r.k==='tbl'){c.fillStyle=col;r.pts.forEach(function(p){dot(X(p[0]),Y(p[1]),col,false)});if(r.fit){c.beginPath();var pn=false,ctx2={};for(i=0;i<=Math.min(W,1200);i++){var xx=x0+(x1-x0)*i/Math.min(W,1200),yy=r.fit.f(xx);if(!isFinite(yy)||Math.abs(yy)>1e6){pn=false;continue}pn?c.lineTo(X(xx),Y(yy)):c.moveTo(X(xx),Y(yy));pn=true}c.setLineDash([6,4]);c.stroke();c.setLineDash([])}}});
 if(G.tr){var t=G.tr,tx2=X(t.x),ty2=Y(t.y);c.fillStyle=COL[t.i%COL.length];c.strokeStyle='#fff';c.lineWidth=2;c.beginPath();c.arc(tx2,ty2,6,0,7);c.fill();c.stroke();
  var lab='('+fmt(t.x)+', '+fmt(t.y)+')',w=c.measureText(lab).width+14,bx=Math.min(Math.max(tx2+10,4),W-w-4),by=Math.min(Math.max(ty2-30,4),H-26);c.fillStyle='rgba(30,34,52,.92)';c.beginPath();c.roundRect?c.roundRect(bx,by,w,22,8):c.rect(bx,by,w,22);c.fill();c.fillStyle='#fff';c.font='11px system-ui,sans-serif';c.textAlign='left';c.textBaseline='middle';c.fillText(lab,bx+7,by+11)}}
/* ---------- row UI ---------- */
function dotBtn(r,i,col){return '<button type="button" class="gdot" style="background:'+(r.on?col:'transparent')+';border-color:'+col+'" data-gr="tog:'+i+'" aria-label="Show or hide row '+(i+1)+'" aria-pressed="'+(!!r.on)+'"></button>'}
function rowHTML(r,i,c){var col=COL[i%COL.length];
 if(r.tbl){var h='<div class="gtbl"><div class="grow">'+dotBtn(r,i,col)+'<b class="small">Table</b><select data-gt="fit:'+i+'" aria-label="Curve fit"><option value="">No fit</option><option value="line"'+(r.fit==='line'?' selected':'')+'>Line fit</option><option value="quad"'+(r.fit==='quad'?' selected':'')+'>Quadratic fit</option><option value="exp"'+(r.fit==='exp'?' selected':'')+'>Exponential fit</option></select><button type="button" class="gx" data-gr="del:'+i+'" aria-label="Delete table">×</button></div><table><thead><tr><th>x</th><th>y</th></tr></thead><tbody>';
  r.xs.forEach(function(x,k){h+='<tr><td><input inputmode="decimal" data-gt="x:'+i+':'+k+'" value="'+esc(x)+'" aria-label="x value '+(k+1)+'"></td><td><input inputmode="decimal" data-gt="y:'+i+':'+k+'" value="'+esc(r.ys[k]||'')+'" aria-label="y value '+(k+1)+'"'+(r.yf&&r.yf.trim()?' disabled':'')+'></td></tr>'});
  h+='</tbody></table><div class="row" style="gap:6px;margin-top:4px"><button type="button" class="btn sec sm" data-gr="trow:'+i+'">+ Row</button><input class="ginp" style="font-size:14px" data-gt="yf:'+i+'" value="'+esc(r.yf||'')+'" placeholder="y from x, e.g. x^2" aria-label="Optional formula for y"></div><div class="gfit" id="gfit'+i+'"></div></div>';return h}
 var msg=c.k==='err'?'<div class="gerr" role="alert">'+esc(c.msg)+'</div>':'';
 var kind=c.k==='pt'&&c.drag?' <span class="gtag">drag</span>':'';
 return '<div class="grow'+(c.k==='err'?' bad':'')+'">'+dotBtn(r,i,col)+'<input class="ginp" data-gi="'+i+'" value="'+esc(r.s)+'" spellcheck="false" autocomplete="off" autocapitalize="off" inputmode="text" aria-label="Expression '+(i+1)+'" placeholder="y = x^2 · x^2+y^2=9 · y>x+1 · (2,3)"><button type="button" class="gx" data-gr="del:'+i+'" aria-label="Delete row '+(i+1)+'">×</button></div>'+msg}
function sliders(cr){var d=defined(cr);return varNames(cr).filter(function(n){return d[n]==null}).map(function(n){var rg=rangeOf(n),v=G.vars[n]==null?1:G.vars[n];if(v<rg[0]||v>rg[1]){rg=G.rng[n]=[Math.min(rg[0],Math.floor(v*2)),Math.max(rg[1],Math.ceil(v*2))]}
 return '<label class="gsl"><b>'+n+'</b><input type="range" min="'+rg[0]+'" max="'+rg[1]+'" step="'+((rg[1]-rg[0])/400)+'" value="'+v+'" data-gs="'+n+'" aria-label="Slider '+n+'"><output>'+fmt(v)+'</output><button type="button" class="gpl" data-gp="'+n+'" aria-label="'+(G.anim[n]?'Stop':'Play')+' slider '+n+'" aria-pressed="'+!!G.anim[n]+'">'+(G.anim[n]?'❚❚':'▶')+'</button></label>'}).join('')}
/* ---------- presets ---------- */
var PRE=[
 {id:'triangle',t:'Triangle explorer',g:'Geometry',d:'Drag A, B, C. Circle centres update live.',rows:['A=(-3,-1)','B=(3,-1)','C=(0,3)','polygon(A,B,C)','O=circumcenter(A,B,C)','I=incenter(A,B,C)','G=centroid(A,B,C)','H=orthocenter(A,B,C)','circumcircle(A,B,C)','incircle(A,B,C)','info(A,B,C)'],off:[8,9],view:{cx:0,cy:1,sx:34}},
 {id:'circle',t:'Circle and a line',g:'Geometry',d:'Move the line through the circle.',rows:['(x-h)^2+(y-k)^2=r^2','y=m*x+c'],vars:{h:0,k:0,r:3,m:.5,c:1},rng:{r:[0,8],m:[-5,5],c:[-8,8],h:[-6,6],k:[-6,6]},view:{cx:0,cy:0,sx:40}},
 {id:'parabola',t:'Parabola, vertex form',g:'Algebra',d:'a opens it, (h, k) is the vertex.',rows:['y=a*(x-h)^2+k','(h,k)'],vars:{a:1,h:0,k:0},rng:{a:[-5,5],h:[-6,6],k:[-6,6]},view:{cx:0,cy:0,sx:36}},
 {id:'line',t:'Line: slope and intercept',g:'Algebra',d:'Slope m and intercept c.',rows:['y=m*x+c','(0,c)'],vars:{m:1,c:0},rng:{m:[-5,5],c:[-6,6]},view:{cx:0,cy:0,sx:40}},
 {id:'region',t:'Inequality region',g:'Algebra',d:'Shade where all three are true.',rows:['y<=-x+6','y>=x/2','x>=0'],view:{cx:3,cy:3,sx:44}},
 {id:'ellipse',t:'Ellipse and hyperbola',g:'Conics',d:'Change a and b.',rows:['x^2/a^2+y^2/b^2=1','x^2/a^2-y^2/b^2=1'],vars:{a:4,b:2},rng:{a:[.5,8],b:[.5,8]},off:[1],view:{cx:0,cy:0,sx:30}},
 {id:'sine',t:'Sine wave',g:'Trig',d:'Amplitude, frequency, shifts.',rows:['y=a*sin(b*(x-c))+d'],vars:{a:2,b:1,c:0,d:0},rng:{a:[-5,5],b:[.1,6],c:[-6,6],d:[-5,5]},view:{cx:0,cy:0,sx:32}},
 {id:'unit',t:'Unit circle',g:'Trig',d:'Drag P around the circle.',rows:['x^2+y^2=1','O=(0,0)','P=(0.6,0.8)','segment(O,P)'],view:{cx:0,cy:0,sx:140}},
 {id:'fit',t:'Data table and fit',g:'Data',d:'Edit the table, pick a fit.',table:{xs:['1','2','3','4','5','6'],ys:['2.1','3.9','6.2','7.8','10.1','12.2'],fit:'line'},rows:[],view:{cx:3.5,cy:6,sx:38}},
 {id:'proj',t:'Projectile path',g:'Physics',d:'Angle t (radians), speed v, gravity g.',rows:['y=x*tan(t)-g*x^2/(2*v^2*cos(t)^2)'],vars:{t:.8,v:20,g:9.8},rng:{t:[.05,1.5],v:[5,40],g:[1,25]},view:{cx:22,cy:10,sx:12}}
];
function applyPreset(p){G.rows=p.rows.map(function(s,i){return{s:s,on:(p.off||[]).indexOf(i)>=0?0:1}});if(p.table){G.rows.unshift({tbl:1,on:1,xs:p.table.xs.slice(),ys:p.table.ys.slice(),fit:p.table.fit||'',yf:''})}
 G.vars=Object.assign({},p.vars||{});G.rng=Object.assign({},p.rng||{});G.anim={};G.view=Object.assign({},p.view||{cx:0,cy:0,sx:40});G.tr=null}
/* ---------- mount ---------- */
function mount(root){var cv,raf=0;
 var presetChips=function(){var out='',g='';PRE.forEach(function(p){if(p.g!==g){if(g)out+='</div>';out+='<div class="gpg"><small>'+p.g+'</small>';g=p.g}out+='<button class="chip" data-gr="pre:'+p.id+'" title="'+esc(p.d)+'">'+esc(p.t)+'</button>'});return out+'</div>'};
 root.innerHTML='<p class="small mute">Type a function, an equation like <code>x^2+y^2=9</code>, an inequality like <code>y&gt;x^2</code>, a point <code>(2,3)</code> (drag it), or <code>a=2</code>. Letters such as <code>a</code>, <code>m</code> become sliders. Drag the graph to pan, pinch or use + and −, tap a curve to read a point.</p>'+
 '<div class="gcalc"><div class="gside"><div id="grows"></div><div class="row" style="margin:6px 0;flex-wrap:wrap"><button class="btn sm" data-gr="add">+ Expression</button><button class="btn sec sm" data-gr="addt">+ Table</button><button class="btn sec sm" data-gr="reset">Clear</button></div><div id="gread" class="gread" aria-live="polite"></div><div id="gsl"></div><details class="gex" open><summary>Presets to tinker with</summary><div class="gpre">'+presetChips()+'</div></details></div>'+
 '<div class="gplot"><canvas id="gcv" tabindex="0" role="img" aria-label="Graph. Arrow keys pan, plus and minus zoom." style="touch-action:none"></canvas><div class="gzoom"><button class="btn sec sm" data-gr="zi" aria-label="Zoom in">+</button><button class="btn sec sm" data-gr="zo" aria-label="Zoom out">−</button><button class="btn sec sm" data-gr="home" aria-label="Reset view">⌂</button></div></div></div>';
 cv=root.querySelector('#gcv');var pend=0;
 function redraw(){if(pend)return;pend=1;window.requestAnimationFrame(function(){pend=0;if(!root.isConnected)return;draw(cv);readouts()})}
 function readouts(){var lines=[];G.cr.forEach(function(c,i){if(c.k==='gshape'&&c.fn==='info'&&c.on){var A=c.args.map(function(n){return G.pt[n]});lines.push(A.some(function(a){return !a})?'Add points '+c.args.join(', ')+' first.':triInfo(A))}
   if(c.k==='tbl'){var el=root.querySelector('#gfit'+i);if(el){el.innerHTML=c.fit?esc(c.fit.txt)+' · R² = '+f2(c.fit.r2)+' <button class="btn sec sm" data-gr="usefit:'+i+'">Add as function</button>':(c.row.fit?'Need more points for this fit.':'')+(c.msg?esc(c.msg):'')}}});
  root.querySelector('#gread').innerHTML=lines.map(function(l){return '<div class="ginfo">'+esc(l)+'</div>'}).join('')}
 function recompute(full){G.cr=compileAll();G.ev=evalVars(G.cr);G.pt=ptTable(G.cr,G.ev);
  if(full){var h='';G.rows.forEach(function(r,i){h+=rowHTML(r,i,G.cr[i])});root.querySelector('#grows').innerHTML=h}
  else{[].forEach.call(root.querySelectorAll('#grows > .grow'),function(el){var i=+(el.querySelector('[data-gi]')||{dataset:{gi:-1}}).dataset.gi;if(i<0)return;var c=G.cr[i];el.classList.toggle('bad',c.k==='err');var nx=el.nextElementSibling;if(nx&&nx.classList.contains('gerr'))nx.remove();if(c.k==='err')el.insertAdjacentHTML('afterend','<div class="gerr" role="alert">'+esc(c.msg)+'</div>')})}
  var sl=root.querySelector('#gsl'),act=document.activeElement;if(!(act&&act.dataset&&act.dataset.gs))sl.innerHTML=sliders(G.cr);
  G.tr=null;redraw()}
 var animT=0;function animLoop(){if(animT||!root.isConnected)return;animT=window.requestAnimationFrame(function tick(ts){animT=0;if(!root.isConnected)return;var any=false;Object.keys(G.anim).forEach(function(n){if(!G.anim[n])return;any=true;var rg=rangeOf(n);G.vars[n]=rg[0]+(rg[1]-rg[0])*(.5-.5*Math.cos(ts/1000*2*Math.PI/7+(G.anim[n]||0)));var inp=root.querySelector('[data-gs="'+n+'"]');if(inp){inp.value=G.vars[n];inp.nextElementSibling.textContent=fmt(G.vars[n])}});
  if(any){G.ev=evalVars(G.cr);G.pt=ptTable(G.cr,G.ev);draw(cv);readouts();animT=window.requestAnimationFrame(tick)}})}
 root.addEventListener('input',function(e){var i=e.target.closest('[data-gi]');if(i){G.rows[+i.dataset.gi].s=i.value;recompute(false);return}
  var t=e.target.closest('[data-gt]');if(t){var a=t.dataset.gt.split(':'),r=G.rows[+a[1]];if(a[0]==='x')r.xs[+a[2]]=t.value;else if(a[0]==='y')r.ys[+a[2]]=t.value;else if(a[0]==='yf'){r.yf=t.value;recompute(true);var el=root.querySelector('[data-gt="yf:'+a[1]+'"]');if(el){el.focus();el.setSelectionRange(t.value.length,t.value.length)}return}G.cr=compileAll();G.ev=evalVars(G.cr);G.pt=ptTable(G.cr,G.ev);redraw();return}
  var s=e.target.closest('[data-gs]');if(s){G.vars[s.dataset.gs]=+s.value;G.anim[s.dataset.gs]=0;s.nextElementSibling.textContent=fmt(+s.value);var pb=root.querySelector('[data-gp="'+s.dataset.gs+'"]');if(pb){pb.textContent='▶';pb.setAttribute('aria-pressed','false')}G.ev=evalVars(G.cr);G.pt=ptTable(G.cr,G.ev);redraw()}});
 root.addEventListener('change',function(e){var t=e.target.closest('[data-gt^="fit:"]');if(t){G.rows[+t.dataset.gt.split(':')[1]].fit=t.value;G.cr=compileAll();redraw()}});
 root.addEventListener('click',function(e){var b=e.target.closest('[data-gr],[data-gp]');if(!b)return;
  if(b.dataset.gp){var n=b.dataset.gp;G.anim[n]=G.anim[n]?0:1;b.textContent=G.anim[n]?'❚❚':'▶';b.setAttribute('aria-pressed',String(!!G.anim[n]));if(G.anim[n])animLoop();return}
  var a=b.dataset.gr.split(':');
  if(a[0]==='tog'){G.rows[+a[1]].on=G.rows[+a[1]].on?0:1;recompute(true)}
  else if(a[0]==='del'){G.rows.splice(+a[1],1);if(!G.rows.length)G.rows.push({s:'',on:1});recompute(true)}
  else if(a[0]==='add'){if(G.rows.length<MAXROWS){G.rows.push({s:'',on:1});recompute(true);var ins=root.querySelectorAll('.ginp[data-gi]');ins[ins.length-1].focus()}}
  else if(a[0]==='addt'){if(G.rows.length<MAXROWS){G.rows.push({tbl:1,on:1,xs:['','','','',''],ys:['','','','',''],fit:'',yf:''});recompute(true)}}
  else if(a[0]==='trow'){var r=G.rows[+a[1]];r.xs.push('');r.ys.push('');recompute(true)}
  else if(a[0]==='usefit'){var c=G.cr[+a[1]];if(c&&c.fit&&G.rows.length<MAXROWS){G.rows.push({s:c.fit.src,on:1});recompute(true)}}
  else if(a[0]==='reset'){G.rows=[{s:'',on:1}];G.vars={};G.rng={};G.anim={};G.view={cx:0,cy:0,sx:40};recompute(true)}
  else if(a[0]==='pre'){var p=PRE.filter(function(x){return x.id===a[1]})[0];if(p){applyPreset(p);recompute(true)}}
  else if(a[0]==='zi'||a[0]==='zo'){G.view.sx=Math.max(4,Math.min(6000,G.view.sx*(a[0]==='zi'?1.4:1/1.4)));redraw()}
  else if(a[0]==='home'){G.view={cx:0,cy:0,sx:40};redraw()}});
 /* pan / pinch / drag points / tap-trace */
 var ptr={},start=null,moved=false,dragRow=-1;
 function pd(){var k=Object.keys(ptr);if(k.length<2)return 0;var a=ptr[k[0]],b=ptr[k[1]];return Math.hypot(a.x-b.x,a.y-b.y)}
 function toWorld(e){var r=cv.getBoundingClientRect(),V=G.view;return[V.cx+(e.clientX-r.left-r.width/2)/V.sx,V.cy-(e.clientY-r.top-r.height/2)/V.sx]}
 function hitPoint(e){var r=cv.getBoundingClientRect(),V=G.view,best=-1,bd=18;G.cr.forEach(function(c,i){if(c.k!=='pt'||!c.on||!c.drag)return;var d=Math.hypot(r.width/2+(c.cx-V.cx)*V.sx-(e.clientX-r.left),r.height/2-(c.cy-V.cy)*V.sx-(e.clientY-r.top));if(d<bd){bd=d;best=i}});return best}
 cv.addEventListener('pointerdown',function(e){cv.focus({preventScroll:true});try{cv.setPointerCapture(e.pointerId)}catch(x){}ptr[e.pointerId]={x:e.clientX,y:e.clientY};moved=false;dragRow=Object.keys(ptr).length===1?hitPoint(e):-1;start={x:e.clientX,y:e.clientY,cx:G.view.cx,cy:G.view.cy,sx:G.view.sx,d:pd()};if(dragRow>=0)cv.style.cursor='grabbing'});
 cv.addEventListener('pointermove',function(e){if(!ptr[e.pointerId]){var h=hitPoint(e);cv.style.cursor=h>=0?'grab':'';return}ptr[e.pointerId]={x:e.clientX,y:e.clientY};
  if(dragRow>=0){moved=true;var w=toWorld(e),dec=G.view.sx>150?2:1,q=Math.pow(10,dec);var nx=Math.round(w[0]*q)/q,ny=Math.round(w[1]*q)/q,r=G.rows[dragRow],nm=G.cr[dragRow].name;r.s=(nm?nm+'=':'')+'('+nx+','+ny+')';var inp=root.querySelector('[data-gi="'+dragRow+'"]');if(inp)inp.value=r.s;G.cr=compileAll();G.ev=evalVars(G.cr);G.pt=ptTable(G.cr,G.ev);G.tr=null;redraw();return}
  var n=Object.keys(ptr).length;if(n>=2&&start.d){var d=pd();G.view.sx=Math.max(4,Math.min(6000,start.sx*d/start.d));moved=true;redraw();return}
  var dx=e.clientX-start.x,dy=e.clientY-start.y;if(Math.abs(dx)+Math.abs(dy)>4)moved=true;if(moved){G.view.cx=start.cx-dx/start.sx;G.view.cy=start.cy+dy/start.sx;G.tr=null;redraw()}});
 function up(e){var was=ptr[e.pointerId];delete ptr[e.pointerId];cv.style.cursor='';if(dragRow>=0&&!Object.keys(ptr).length){dragRow=-1;recompute(false);return}if(was&&!moved&&!Object.keys(ptr).length)trace(e);if(Object.keys(ptr).length===1){var k=Object.keys(ptr)[0];start={x:ptr[k].x,y:ptr[k].y,cx:G.view.cx,cy:G.view.cy,sx:G.view.sx,d:0}}}
 cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',function(e){delete ptr[e.pointerId];dragRow=-1});
 cv.addEventListener('wheel',function(e){e.preventDefault();G.view.sx=Math.max(4,Math.min(6000,G.view.sx*(e.deltaY<0?1.12:1/1.12)));redraw()},{passive:false});
 cv.addEventListener('keydown',function(e){var st=40/G.view.sx,k=e.key,h=true;if(k==='ArrowLeft')G.view.cx-=st;else if(k==='ArrowRight')G.view.cx+=st;else if(k==='ArrowUp')G.view.cy+=st;else if(k==='ArrowDown')G.view.cy-=st;else if(k==='+'||k==='=')G.view.sx=Math.min(6000,G.view.sx*1.2);else if(k==='-')G.view.sx=Math.max(4,G.view.sx/1.2);else h=false;if(h){e.preventDefault();redraw()}});
 function trace(e){var r=cv.getBoundingClientRect(),V=G.view,py=e.clientY-r.top,x=V.cx+(e.clientX-r.left-r.width/2)/V.sx,best=null;
  G.cr.forEach(function(c,i){if(!c.on||c.k!=='fn')return;var y=c.f({v:G.ev,x:x});if(!isFinite(y))return;var dy=Math.abs((r.height/2-(y-V.cy)*V.sx)-py);if(dy<24&&(!best||dy<best.d))best={d:dy,i:i,x:x,y:y}});
  G.tr=best;redraw()}
 var ro=window.ResizeObserver?new ResizeObserver(function(){redraw()}):null;if(ro)ro.observe(cv);else window.addEventListener('resize',redraw);
 recompute(true)}
window.graphView=function(){setTimeout(function(){var r=document.getElementById('graphroot');if(r&&!r.dataset.on){r.dataset.on=1;if(G.pend){var p=PRE.filter(function(x){return x.id===G.pend})[0];G.pend=null;if(p)applyPreset(p)}mount(r)}},0);return '<div id="graphroot" class="card gcard"></div>'};
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-gpre]');if(b)G.pend=b.dataset.gpre},true);
window.__hasGraph=function(){return ['apex-math','quanta-physics','geometry-readiness'].indexOf(PKID)>=0};
window.__graphParse=compile;window.__graphPresets=PRE;window.__graphGeo={tri:triInfo,GEOF:GEOF,fit:fitCurve};
})();
