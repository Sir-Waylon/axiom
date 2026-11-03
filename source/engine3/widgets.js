/* ===== widgets: spec-driven interactive explainers (no eval, no libraries) ===== */
var WID={};
/* ---- tiny safe expression parser: numbers, names, + - * / ^, ( ), functions ---- */
var WFN={sin:Math.sin,cos:Math.cos,tan:Math.tan,asin:Math.asin,acos:Math.acos,atan:Math.atan,sind:function(a){return Math.sin(a*Math.PI/180)},cosd:function(a){return Math.cos(a*Math.PI/180)},tand:function(a){return Math.tan(a*Math.PI/180)},asind:function(a){return Math.asin(a)*180/Math.PI},acosd:function(a){return Math.acos(a)*180/Math.PI},atand:function(a){return Math.atan(a)*180/Math.PI},sqrt:Math.sqrt,abs:Math.abs,ln:Math.log,log:Math.log10,exp:Math.exp,floor:Math.floor,round:Math.round,ceil:Math.ceil,min:Math.min,max:Math.max,pow:Math.pow,sign:Math.sign};
var _wxc={};
function wx(src){if(_wxc[src])return _wxc[src];var t=src.match(/\d*\.?\d+(?:e[+-]?\d+)?|[A-Za-z_][A-Za-z_0-9]*|[-+*\/^(),]/g)||[],i=0;
 function pk(){return t[i]}function nx(){return t[i++]}
 function ex(){var l=tm();while(pk()==='+'||pk()==='-'){var o=nx(),r=tm();l=bin(o,l,r)}return l}
 function bin(o,l,r){return o==='+'?function(e){return l(e)+r(e)}:o==='-'?function(e){return l(e)-r(e)}:o==='*'?function(e){return l(e)*r(e)}:o==='/'?function(e){return l(e)/r(e)}:function(e){return Math.pow(l(e),r(e))}}
 function tm(){var l=un();while(pk()==='*'||pk()==='/'){var o=nx(),r=un();l=bin(o,l,r)}return l}
 function un(){if(pk()==='-'){nx();var a=un();return function(e){return -a(e)}}if(pk()==='+'){nx();return un()}return pw()}
 function pw(){var b=at();if(pk()==='^'){nx();var x=un();return bin('^',b,x)}return b}
 function at(){var k=nx();if(k===undefined)return function(){return NaN};if(k==='('){var v=ex();if(pk()===')')nx();return v}
  if(/^[\d.]/.test(k)){var n=parseFloat(k);return function(){return n}}
  if(pk()==='('&&WFN[k]){nx();var a=[ex()];while(pk()===','){nx();a.push(ex())}if(pk()===')')nx();var f=WFN[k];return function(e){return f.apply(null,a.map(function(g){return g(e)}))}}
  if(k==='pi')return function(){return Math.PI};if(k==='e')return function(){return Math.E};
  return function(e){var v=e[k];return v===undefined?NaN:v}}
 var f=ex();_wxc[src]=f;return f}
function wnum(v,d){if(!isFinite(v))return '–';d=d===undefined?2:d;var a=Math.abs(v);if(a!==0&&(a>=1e6||a<1e-3))return v.toExponential(2).replace('e+','×10^').replace('e-','×10^−');return String(+v.toFixed(d))}
function wfmt(tpl,env){return String(tpl).replace(/\{(=?)([^}|]+)(?:\|(\d+))?\}/g,function(m,eq,x,d){var v=wx(x.trim())(env);return '<b>'+wnum(v,d===undefined?(Math.abs(v)<10?2:1):+d)+'</b>'})}
function wsl(w,id,p){return '<label class="lsl"><span>'+p[1]+' <b id="'+id+'p_'+p[0]+'v">'+wnum(p[5],p[4]<1?2:0)+'</b>'+(p[6]||'')+'</span><input type="range" id="'+id+'p_'+p[0]+'" min="'+p[2]+'" max="'+p[3]+'" step="'+p[4]+'" value="'+p[5]+'" aria-label="'+p[1]+'"></label>'}
/* every widget is: [predict gate] -> svg + sliders + live readout + (optional) takeaway */
function wshell(el,s,body,init){var id='w'+Math.floor(Math.random()*1e6);
 var h='<div class="wh">'+(s.hook||'Try it')+'</div>';
 if(s.pre){h+='<div class="wpre"><div class="wq">'+s.pre.q+'</div><div class="wopts">'+s.pre.o.map(function(o,i){return '<button class="btn sm sec" data-i="'+i+'">'+o+'</button>'}).join('')+'</div><div class="wfb" aria-live="polite"></div></div><div class="wbody" hidden>'+body(id)+'</div>'}
 else h+='<div class="wbody">'+body(id)+'</div>';
 if(s.take)h+='<div class="wtake" hidden><b>Remember:</b> '+s.take+'</div>';
 el.innerHTML=h;var moved=0;
 function reveal(){var b=el.querySelector('.wbody');b.hidden=false;init(id,b)}
 function done(){var tk=el.querySelector('.wtake');if(tk)tk.hidden=false}
 el.addEventListener('input',function(){if(!moved){moved=1;setTimeout(done,600)}});el.addEventListener('click',function(e){if(e.target.closest('.wstep,.wtog,.wbit'))done()});
 if(s.pre){var pr=el.querySelector('.wpre');pr.addEventListener('click',function(e){var b=e.target.closest('button');if(!b||pr.dataset.d)return;pr.dataset.d=1;var i=+b.dataset.i,ok=i===s.pre.a;pr.querySelectorAll('button').forEach(function(x,j){x.disabled=true;if(j===s.pre.a)x.classList.add('good');else if(j===i)x.classList.add('bad')});pr.querySelector('.wfb').innerHTML=(ok?'<b>Nice guess.</b> ':'<b>Not quite.</b> ')+(s.pre.why||'')+' <i>Now try it below.</i>';reveal()})}
 else init(id,el.querySelector('.wbody'))}
function wsvg(w,h,b,lab){return '<svg viewBox="0 0 '+w+' '+h+'" class="labsvg" role="img" aria-label="'+(lab||'Interactive diagram')+'" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+b+'</svg>'}
function wenv(b,id,ps){var e={};ps.forEach(function(p){e[p[0]]=+b.querySelector('#'+id+'p_'+p[0]).value});return e}
function wbind(b,id,ps,draw){ps.forEach(function(p){var s=b.querySelector('#'+id+'p_'+p[0]);s.addEventListener('input',function(){b.querySelector('#'+id+'p_'+p[0]+'v').textContent=wnum(+s.value,p[4]<1?2:0);draw(wenv(b,id,ps))})});draw(wenv(b,id,ps))}
function wsliders(id,ps){return '<div class="wsl">'+ps.map(function(p){return wsl(0,id,p)}).join('')+'</div>'}
/* ---- plot: curve(s) that respond to sliders ---- */
WID.plot=function(el,s){var ps=s.p||[],X=s.x||[-5,5],Y=s.y||[-5,5],W=260,H=170,L=26,R=250,T=10,B=150;
 function sx(x){return L+(x-X[0])/(X[1]-X[0])*(R-L)}function sy(y){return B-(y-Y[0])/(Y[1]-Y[0])*(B-T)}
 var fs=[].concat(s.f).map(function(f){return typeof f==='string'?{e:f}:f}),cols=['var(--pri)','var(--gold)','var(--bad)'];
 wshell(el,s,function(id){return wsvg(W,H,'<g id="'+id+'g"></g>',s.hook)+wsliders(id,ps)+'<div class="out" id="'+id+'o" aria-live="polite"></div>'},function(id,b){
  var g=b.querySelector('#'+id+'g'),o=b.querySelector('#'+id+'o');
  var axes='<path d="M'+L+' '+sy(0<Y[0]?Y[0]:0>Y[1]?Y[1]:0)+'H'+R+'M'+sx(0<X[0]?X[0]:0>X[1]?X[1]:0)+' '+T+'V'+B+'" stroke-opacity=".55" stroke-width="1.5"/>';
  for(var k=Math.ceil(X[0]);k<=X[1];k+=Math.max(1,Math.round((X[1]-X[0])/8)))if(k)axes+='<path d="M'+sx(k)+' '+(B-3)+'v6" stroke-opacity=".3" stroke-width="1"/><text x="'+sx(k)+'" y="'+(B+14)+'" text-anchor="middle" font-size="9" fill="currentColor" stroke="none" opacity=".6">'+k+'</text>';
  for(var k2=Math.ceil(Y[0]);k2<=Y[1];k2+=Math.max(1,Math.round((Y[1]-Y[0])/6)))if(k2)axes+='<text x="'+(L-4)+'" y="'+(sy(k2)+3)+'" text-anchor="end" font-size="9" fill="currentColor" stroke="none" opacity=".6">'+k2+'</text><path d="M'+L+' '+sy(k2)+'H'+R+'" stroke-opacity=".08" stroke-width="1"/>';
  if(s.xl)axes+='<text x="'+R+'" y="'+(B+26)+'" text-anchor="end" font-size="10" fill="currentColor" stroke="none">'+s.xl+'</text>';if(s.yl)axes+='<text x="'+(L+2)+'" y="'+(T+2)+'" font-size="10" fill="currentColor" stroke="none">'+s.yl+'</text>';
  wbind(b,id,ps,function(e){var out=axes;fs.forEach(function(f,fi){var fn=wx(f.e),d='',pen=false,N=180;for(var i=0;i<=N;i++){var x=X[0]+(X[1]-X[0])*i/N;e.x=x;var y=fn(e);if(!isFinite(y)||y<Y[0]-(Y[1]-Y[0])*.5||y>Y[1]+(Y[1]-Y[0])*.5){pen=false;continue}d+=(pen?'L':'M')+sx(x).toFixed(1)+' '+sy(Math.max(Y[0]-5,Math.min(Y[1]+5,y))).toFixed(1);pen=true}
    out+='<path d="'+d+'" stroke="'+(f.c||cols[fi%3])+'" stroke-width="2.6" fill="none"/>'});
   (s.pts||[]).forEach(function(pt){var px=wx(pt.x)(e),py=wx(pt.y)(e);if(isFinite(px)&&isFinite(py))out+='<circle cx="'+sx(px)+'" cy="'+sy(py)+'" r="5" fill="var(--gold)" stroke="var(--surface)" stroke-width="1.5"/>'+(pt.l?'<text x="'+(sx(px)+8)+'" y="'+(sy(py)-8)+'" font-size="10" fill="currentColor" stroke="none" font-weight="700">'+pt.l+'</text>':'')});
   (s.vl||[]).forEach(function(v){var vx=wx(v.x)(e);if(isFinite(vx))out+='<path d="M'+sx(vx)+' '+T+'V'+B+'" stroke="var(--bad)" stroke-dasharray="4 3" stroke-width="1.5"/>'});
   g.innerHTML=out;e.x=0;o.innerHTML=wfmt(s.out||'',e)})})};
/* ---- calc: a law with sliders and live bars ---- */
WID.calc=function(el,s){var ps=s.p||[],os=s.o||[];
 wshell(el,s,function(id){return '<div id="'+id+'v" class="wbars" aria-hidden="true"></div>'+wsliders(id,ps)+'<div class="out" id="'+id+'o" aria-live="polite"></div>'},function(id,b){var v=b.querySelector('#'+id+'v'),o=b.querySelector('#'+id+'o');
  wbind(b,id,ps,function(e){var r='',t='';os.forEach(function(q){var val=wx(q.e)(e);e[q.n||q.l]=val;var pc=Math.max(2,Math.min(100,val/(q.m||1)*100));r+='<div class="wbar"><span>'+q.l+'</span><i style="width:'+(isFinite(pc)?pc:2)+'%;background:'+(q.c||'var(--pri)')+'"></i></div>';t+=(t?' · ':'')+q.l+' = <b>'+wnum(val,q.d===undefined?2:q.d)+'</b>'+(q.u?' '+q.u:'')});
   v.innerHTML=r;o.innerHTML=(s.eq?'<div class="weq">'+s.eq+'</div>':'')+t+(s.note?'<div class="wnote">'+wfmt(s.note,e)+'</div>':'')})})};
/* ---- circle: unit circle ---- */
WID.circle=function(el,s){var ps=[['a','Angle',0,360,5,s.a0===undefined?30:s.a0,'°']];
 wshell(el,s,function(id){return wsvg(260,180,'<g id="'+id+'g"></g>',s.hook)+wsliders(id,ps)+'<div class="out" id="'+id+'o" aria-live="polite"></div>'},function(id,b){var g=b.querySelector('#'+id+'g'),o=b.querySelector('#'+id+'o'),cx=90,cy=90,r=70;
  wbind(b,id,ps,function(e){var a=e.a*Math.PI/180,c=Math.cos(a),sn=Math.sin(a),px=cx+r*c,py=cy-r*sn;
   g.innerHTML='<path d="M10 90H170M90 10V170" stroke-opacity=".35" stroke-width="1.2"/><circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" stroke-opacity=".6" stroke-width="1.5"/><path d="M'+(cx+22)+' '+cy+'A22 22 0 '+(e.a>180?1:0)+' 0 '+(cx+22*c)+' '+(cy-22*sn)+'" stroke="var(--gold)" stroke-width="2"/><path d="M'+cx+' '+cy+'L'+px+' '+py+'" stroke="var(--ink)" stroke-width="2.5"/><path d="M'+cx+' '+cy+'H'+px+'" stroke="var(--pri)" stroke-width="3.5"/><path d="M'+px+' '+cy+'V'+py+'" stroke="var(--bad)" stroke-width="3.5"/><circle cx="'+px+'" cy="'+py+'" r="6" fill="var(--gold)" stroke="var(--surface)" stroke-width="2"/><text x="190" y="46" font-size="12" fill="var(--pri)" stroke="none" font-weight="700">cos = x</text><text x="190" y="70" font-size="12" fill="var(--bad)" stroke="none" font-weight="700">sin = y</text><text x="190" y="104" font-size="11" fill="currentColor" stroke="none">radius = 1</text>';
   o.innerHTML='Angle <b>'+e.a+'°</b> = <b>'+wnum(a,2)+'</b> rad<br>cos = <b>'+wnum(c,3)+'</b> · sin = <b>'+wnum(sn,3)+'</b> · tan = <b>'+(Math.abs(c)<1e-9?'undefined':wnum(sn/c,3))+'</b>'})})};
/* ---- tri: right triangle SOH-CAH-TOA ---- */
WID.tri=function(el,s){var ps=[['a','Angle θ',5,85,1,s.a0||35,'°'],['h','Hypotenuse',2,10,1,s.h0||8]];
 wshell(el,s,function(id){return wsvg(260,150,'<g id="'+id+'g"></g>',s.hook)+wsliders(id,ps)+'<div class="out" id="'+id+'o" aria-live="polite"></div>'},function(id,b){var g=b.querySelector('#'+id+'g'),o=b.querySelector('#'+id+'o');
  wbind(b,id,ps,function(e){var a=e.a*Math.PI/180,k=14,ad=e.h*Math.cos(a),op=e.h*Math.sin(a),x0=30,y0=130,x1=x0+ad*k*1.4,y1=y0-op*k*1.4;
   g.innerHTML='<path d="M'+x0+' '+y0+'H'+x1+'V'+y1+'z" fill="var(--pri)" fill-opacity=".12" stroke="var(--pri)" stroke-width="2.5"/><path d="M'+(x1-10)+' '+y0+'v-10h10" stroke-width="1.5" stroke-opacity=".6"/><path d="M'+(x0+26)+' '+y0+'A26 26 0 0 0 '+(x0+26*Math.cos(a))+' '+(y0-26*Math.sin(a))+'" stroke="var(--gold)" stroke-width="2"/><text x="'+(x0+30)+'" y="'+(y0-6)+'" font-size="11" fill="var(--gold)" stroke="none" font-weight="700">θ</text><text x="'+((x0+x1)/2)+'" y="'+(y0+16)+'" text-anchor="middle" font-size="11" fill="currentColor" stroke="none">adjacent '+wnum(ad,1)+'</text><text x="'+(x1+6)+'" y="'+((y0+y1)/2)+'" font-size="11" fill="currentColor" stroke="none">opposite '+wnum(op,1)+'</text><text x="'+((x0+x1)/2-10)+'" y="'+((y0+y1)/2-8)+'" text-anchor="end" font-size="11" fill="currentColor" stroke="none">hypotenuse '+e.h+'</text>';
   o.innerHTML='sin θ = opp ÷ hyp = <b>'+wnum(op/e.h,3)+'</b><br>cos θ = adj ÷ hyp = <b>'+wnum(ad/e.h,3)+'</b><br>tan θ = opp ÷ adj = <b>'+wnum(op/ad,3)+'</b><div class="wnote">Change the size: the ratios stay put. They depend only on the angle.</div>'})})};
/* ---- wave ---- */
WID.wave=function(el,s){var ps=s.p||[['A','Amplitude',1,10,1,5,''],['f','Frequency',1,10,1,3,' Hz']];
 wshell(el,s,function(id){return wsvg(260,130,'<path d="M10 65H250" stroke-opacity=".3" stroke-width="1"/><path id="'+id+'p" stroke="var(--pri)" stroke-width="3"/>',s.hook)+wsliders(id,ps)+'<div class="out" id="'+id+'o" aria-live="polite"></div>'},function(id,b){var p=b.querySelector('#'+id+'p'),o=b.querySelector('#'+id+'o'),E={A:5,f:3},t0=0,last=0,fn=s.sp||10;
  function draw(){var d='';for(var i=0;i<=120;i++){var x=10+i*2,y=65-E.A*5.5*Math.sin(2*Math.PI*(E.f*i/120*2-t0));d+=(i?'L':'M')+x+' '+y.toFixed(1)}p.setAttribute('d',d)}
  function fr(ts){if(!el.isConnected)return;var dt=Math.min(.05,(ts-last)/1000||0);last=ts;if(!matchMedia('(prefers-reduced-motion: reduce)').matches)t0+=dt*.35;draw();requestAnimationFrame(fr)}
  wbind(b,id,ps,function(e){E=e;o.innerHTML=wfmt(s.out||'',e)});requestAnimationFrame(fr)})};
/* ---- proj: projectile ---- */
WID.proj=function(el,s){var ps=[['v','Launch speed',5,30,1,s.v0||18,' m/s'],['a','Angle',10,80,5,s.a0||45,'°']];
 wshell(el,s,function(id){return wsvg(260,130,'<path d="M10 118H250" stroke-opacity=".5"/><g id="'+id+'g"></g>',s.hook)+wsliders(id,ps)+'<div class="out" id="'+id+'o" aria-live="polite"></div>'},function(id,b){var g=b.querySelector('#'+id+'g'),o=b.querySelector('#'+id+'o');
  wbind(b,id,ps,function(e){var a=e.a*Math.PI/180,gg=9.8,T=2*e.v*Math.sin(a)/gg,Rg=e.v*e.v*Math.sin(2*a)/gg,Hm=Math.pow(e.v*Math.sin(a),2)/(2*gg),sc=230/Math.max(60,Rg*1.05),sv=Math.min(sc,100/Math.max(2,Hm));var d='';for(var i=0;i<=40;i++){var t=T*i/40,x=e.v*Math.cos(a)*t,y=e.v*Math.sin(a)*t-.5*gg*t*t;d+=(i?'L':'M')+(10+x*sc).toFixed(1)+' '+(118-y*sc).toFixed(1)}
   g.innerHTML='<path d="'+d+'" stroke="var(--pri)" stroke-width="2.6" stroke-dasharray="5 4"/><circle cx="'+(10+Rg*sc)+'" cy="118" r="5" fill="var(--bad)" stroke="none"/><circle cx="10" cy="118" r="5" fill="var(--gold)" stroke="none"/>';
   o.innerHTML='Time in air <b>'+wnum(T,1)+' s</b> · range <b>'+wnum(Rg,1)+' m</b> · peak <b>'+wnum(Hm,1)+' m</b><div class="wnote">Gravity pulls down at 9.8 m/s² every second. Sideways speed never changes.</div>'})})};
/* ---- gate: logic gate with toggles ---- */
WID.gate=function(el,s){var G=s.g||'AND',f={AND:function(a,b){return a&b},OR:function(a,b){return a|b},NOT:function(a){return 1-a},NAND:function(a,b){return 1-(a&b)},NOR:function(a,b){return 1-(a|b)},XOR:function(a,b){return a^b},XNOR:function(a,b){return 1-(a^b)}}[G],one=G==='NOT';
 wshell(el,s,function(id){return '<div class="wgate"><button class="btn sm sec wtog" id="'+id+'a" aria-pressed="false">A = 0</button>'+(one?'':'<button class="btn sm sec wtog" id="'+id+'b" aria-pressed="false">B = 0</button>')+'<span class="wgn">'+G+'</span><span class="wlamp" id="'+id+'l" role="img" aria-label="Output 0"></span></div><div class="out" id="'+id+'o" aria-live="polite"></div><table class="wtab"><tr>'+(one?'<th>A</th>':'<th>A</th><th>B</th>')+'<th>Out</th></tr>'+(one?[0,1]:[0,1,2,3]).map(function(i){var a=one?i:i>>1,b=one?0:i&1;return '<tr id="'+id+'r'+i+'"><td>'+a+'</td>'+(one?'':'<td>'+b+'</td>')+'<td>'+f(a,b)+'</td></tr>'}).join('')+'</table>'},function(id,b){var A=0,B=0,a=b.querySelector('#'+id+'a'),bb=b.querySelector('#'+id+'b'),l=b.querySelector('#'+id+'l'),o=b.querySelector('#'+id+'o');
  function up(){var out=f(A,B);a.textContent='A = '+A;a.setAttribute('aria-pressed',A?'true':'false');if(bb){bb.textContent='B = '+B;bb.setAttribute('aria-pressed',B?'true':'false')}l.className='wlamp'+(out?' on':'');l.setAttribute('aria-label','Output '+out);o.innerHTML=G+'('+A+(one?'':', '+B)+') = <b>'+out+'</b>'+(s.say?' · '+s.say:'');var row=one?A:A*2+B;b.querySelectorAll('.wtab tr').forEach(function(r){r.classList.remove('hl')});var rr=b.querySelector('#'+id+'r'+row);if(rr)rr.classList.add('hl')}
  a.onclick=function(){A=1-A;up()};if(bb)bb.onclick=function(){B=1-B;up()};up()})};
/* ---- bits: binary switches ---- */
WID.bits=function(el,s){var n=s.n||6;
 wshell(el,s,function(id){var h='<div class="wbits">';for(var i=n-1;i>=0;i--)h+='<button class="wbit" data-i="'+i+'" aria-pressed="false" aria-label="Bit worth '+Math.pow(2,i)+'"><small>'+Math.pow(2,i)+'</small><b>0</b></button>';return h+'</div><div class="out" id="'+id+'o" aria-live="polite"></div>'},function(id,b){var o=b.querySelector('#'+id+'o'),v=0;
  function up(){var t=[];b.querySelectorAll('.wbit').forEach(function(x){var on=+x.dataset.on||0;x.querySelector('b').textContent=on;x.setAttribute('aria-pressed',on?'true':'false');x.classList.toggle('on',!!on);if(on)t.push(Math.pow(2,+x.dataset.i))});v=t.reduce(function(a,c){return a+c},0);o.innerHTML=(t.length?t.join(' + ')+' = ':'')+'<b>'+v+'</b>'+(s.say?'<div class="wnote">'+s.say+'</div>':'')}
  b.querySelectorAll('.wbit').forEach(function(x){x.onclick=function(){x.dataset.on=+x.dataset.on?0:1;up()}});up()})};
/* ---- steps: tap through an explanation, with an optional picture per step ---- */
WID.steps=function(el,s){var S=s.s;
 wshell(el,s,function(id){return '<div class="wstage" id="'+id+'f"></div><div class="wstepbar"><button class="btn sm sec wstep" id="'+id+'p">Back</button><span class="small" id="'+id+'c"></span><button class="btn sm wstep" id="'+id+'n">Next</button></div>'},function(id,b){var i=0,f=b.querySelector('#'+id+'f');
  function up(){var st=S[i];f.innerHTML=(st.svg?wsvg(260,st.h||110,st.svg,st.t):'')+'<div class="wstx" aria-live="polite">'+st.t+'</div>';b.querySelector('#'+id+'c').textContent=(i+1)+' of '+S.length;b.querySelector('#'+id+'p').disabled=!i;b.querySelector('#'+id+'n').disabled=i===S.length-1}
  b.querySelector('#'+id+'p').onclick=function(){if(i>0){i--;up()}};b.querySelector('#'+id+'n').onclick=function(){if(i<S.length-1){i++;up()}};up()})};
/* ---- balance: solve an equation by doing the same thing to both sides ---- */
WID.bal=function(el,s){var a=s.a,bq=s.b,c=s.c;
 wshell(el,s,function(id){return '<div class="out" id="'+id+'e" style="font-size:1.4rem;text-align:center"></div><div class="wops" id="'+id+'b"></div><div class="out" id="'+id+'o" aria-live="polite"></div>'},function(id,b){var A=a,B=bq,C=c,e=b.querySelector('#'+id+'e'),ops=b.querySelector('#'+id+'b'),o=b.querySelector('#'+id+'o'),n=0;
  function L(){return (A===1?'':A===-1?'−':A)+'x'+(B>0?' + '+B:B<0?' − '+(-B):'')}
  function up(){e.innerHTML=L()+' = '+C;var h='';if(B!==0)h+='<button class="btn sm sec" data-o="addB">'+(B>0?'Subtract '+B:'Add '+(-B))+' from both sides</button>';if(A!==1)h+='<button class="btn sm sec" data-o="divA">Divide both sides by '+A+'</button>';ops.innerHTML=h;
   o.innerHTML=(A===1&&B===0)?'<b>x = '+C+'</b> Check: '+a+'×'+C+(bq>=0?' + '+bq:' − '+(-bq))+' = '+(a*C+bq)+' ✓':'Each move keeps both sides equal, like a balanced scale.'}
  ops.onclick=function(ev){var t=ev.target.closest('button');if(!t)return;if(t.dataset.o==='addB'){C=C-B;B=0}else{C=+(C/A).toFixed(4);A=1}n++;up()};up()})};
/* ---- count: a counting/sequence explorer: drag n and see the pattern (any single expression) ---- */
WID.table=function(el,s){var ps=[[s.v||'n',s.vl||'n',s.mn||1,s.mx||10,1,s.v0||3,'']];
 wshell(el,s,function(id){return wsliders(id,ps)+'<div class="out" id="'+id+'o" aria-live="polite"></div><div class="wtabw" id="'+id+'t"></div>'},function(id,b){var o=b.querySelector('#'+id+'o'),t=b.querySelector('#'+id+'t');
  wbind(b,id,ps,function(e){o.innerHTML=wfmt(s.out||'',e);var rows='';for(var i=s.mn||1;i<=Math.min(s.mx||10,(s.mn||1)+9);i++){var env={};env[ps[0][0]]=i;rows+='<tr'+(i===e[ps[0][0]]?' class="hl"':'')+'><td>'+i+'</td><td>'+wnum(wx(s.e)(env),3)+'</td></tr>'}t.innerHTML='<table class="wtab"><tr><th>'+ps[0][1]+'</th><th>'+(s.col||'result')+'</th></tr>'+rows+'</table>'})})};
/* hook into the lab system: card.lab may be a spec object */
var _wLabInit=labInit;labInit=function(el,key){if(key&&typeof key==='object'){var f=WID[key.k];if(f){el.classList.add('lab-in','wid');try{f(el,key)}catch(x){el.innerHTML=''}}}else _wLabInit(el,key)};
