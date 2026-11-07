/* ===== builders, set 2: fit a curve to points, balance forces on a hanging load, wire logic gates to match a truth table ===== */
(function(){
function mul(a){return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function hs(s){var h=2166136261;s=String(s);for(var i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function pk(r,a){return a[Math.floor(r()*a.length)]}
function rd(v,d){return +v.toFixed(d===undefined?2:d)}
function sg(x){return String(x).replace('-','−')}
function cur(type){var it=Z&&!Z.fin&&Z.steps&&Z.steps[Z.i]&&Z.steps[Z.i].it;return it&&it.q.type===type&&!it.done?it:null}
function refresh(){if(window.itEnable)itEnable()}
var B={};function add(pack,spec){if(pack==='geometry-readiness')pack='apex-math';(B[pack]=B[pack]||[]).push(spec)}

/* ---------- 5. curve fit: slide a, h, k until the parabola passes through the dots ---------- */
function fx(p,x){return p.a*(x-p.h)*(x-p.h)+p.k}
function fsv(pts,p,rev,tg){var c=16,o=8,W=17*c,s='<svg viewBox="0 0 '+W+' '+W+'" role="img" aria-label="Graph with points and your parabola" style="max-width:300px;width:100%;background:var(--surface,#fff);border:1px solid var(--line);border-radius:12px">',i;
 function X(x){return (x+o)*c+c/2}function Y(y){return (o-y)*c+c/2}
 for(i=0;i<17;i++){s+='<line x1="'+(i*c+c/2)+'" y1="0" x2="'+(i*c+c/2)+'" y2="'+W+'" stroke="currentColor" opacity="'+(i===o?.7:.1)+'"/><line x1="0" y1="'+(i*c+c/2)+'" x2="'+W+'" y2="'+(i*c+c/2)+'" stroke="currentColor" opacity="'+(i===o?.7:.1)+'"/>'}
 var d='',on=false;for(var x=-8;x<=8.001;x+=.25){var y=fx(p,x);if(Math.abs(y)>9){on=false;continue}d+=(on?'L':'M')+X(x).toFixed(1)+' '+Y(y).toFixed(1);on=true}
 s+='<path d="'+d+'" fill="none" stroke="#5b4bff" stroke-width="2.8"/>';
 if(rev&&tg){var d2='';on=false;for(x=-8;x<=8.001;x+=.25){y=fx(tg,x);if(Math.abs(y)>9){on=false;continue}d2+=(on?'L':'M')+X(x).toFixed(1)+' '+Y(y).toFixed(1);on=true}s+='<path d="'+d2+'" fill="none" stroke="#e08a00" stroke-width="2" stroke-dasharray="5 4"/>'}
 pts.forEach(function(q){var hit=Math.abs(fx(p,q[0])-q[1])<.26;s+='<circle cx="'+X(q[0])+'" cy="'+Y(q[1])+'" r="6" fill="'+(hit?'#12935f':'#e0457b')+'" stroke="#fff" stroke-width="2"/>'});
 return s+'</svg>'}
function feq(p){return 'y = '+(p.a===1?'':p.a===-1?'−':sg(p.a))+'(x '+(p.h<0?'+ '+(-p.h):'− '+p.h)+')² '+(p.k<0?'− '+(-p.k):'+ '+p.k)}
function fhit(it){return it.q.fc.pts.every(function(q){return Math.abs(fx(it.p,q[0])-q[1])<.26})}
IT.fitc={init:function(it){it.p={a:1,h:0,k:0};it.t=false},
 render:function(it,rev){var q=it.q.fc,h='<div class="itx bld"><div class="figw" id="fcfig">'+fsv(q.pts,it.p,rev,rev?q.t:null)+'</div><div class="small" id="fceq" aria-live="polite"><b>'+feq(it.p)+'</b></div>';
  [['a','Stretch a',-3,3,.5],['h','Shift right h',-6,6,1],['k','Shift up k',-6,6,1]].forEach(function(x){h+='<label class="lsl"><span>'+x[1]+': <b id="fcv_'+x[0]+'">'+sg(it.p[x[0]])+'</b></span><input type="range" class="fcr" data-fc="'+x[0]+'" min="'+x[2]+'" max="'+x[3]+'" step="'+x[4]+'" value="'+it.p[x[0]]+'" aria-label="'+x[1]+'"'+(rev?' disabled':'')+'></label>'});
  if(rev)h+='<div class="simo">'+(it.ok?'The curve passes through every point.':'The points sit on <b>'+feq(q.t)+'</b> (dashed).')+'</div>';
  return h+'</div>'},
 ok:function(it){return fhit(it)&&it.p.a!==0},done:function(it){return it.t},ans:function(q){return feq(q.fc.t)}};
document.addEventListener('input',function(e){var n=e.target.dataset&&e.target.dataset.fc;if(!n||!e.target.classList.contains('fcr'))return;var it=cur('fitc');if(!it)return;it.p[n]=+e.target.value;it.t=true;
 var f=document.getElementById('fcfig'),q=document.getElementById('fceq'),v=document.getElementById('fcv_'+n);if(f)f.innerHTML=fsv(it.q.fc.pts,it.p);if(q)q.innerHTML='<b>'+feq(it.p)+'</b>';if(v)v.textContent=sg(it.p[n]);window.sfx&&sfx('tick');refresh()});
function genFit(r){for(var k=0;k<80;k++){var t={a:pk(r,[-2,-1,-.5,.5,1,2]),h:Math.floor(r()*9)-4,k:Math.floor(r()*9)-4},xs=[t.h-2,t.h-1,t.h+1,t.h+2,t.h+3,t.h-3].filter(function(x){return x>=-7&&x<=7}).sort(function(){return r()-.5}),pts=[];
  for(var i=0;i<xs.length&&pts.length<3;i++){var y=fx(t,xs[i]);if(y===Math.round(y)&&Math.abs(y)<=7)pts.push([xs[i],y])}
  if(pts.length<3)continue;var xx=pts.map(function(p){return p[0]});if(new Set(xx).size<3)continue;
  return{q:'Three dots sit on a parabola y = a(x − h)² + k. Slide a, h and k until your curve turns every dot green.',fc:{pts:pts,t:t},steps:['The vertex of y = a(x − h)² + k is (h, k).','Use a dot to solve for a: a = (y − k) ÷ (x − h)².','Answer: '+feq(t)+'.']}}
 return null}
add('apex-math',{id:'fc',t:'fn',l:3,ic:'📈',type:'fitc',cp:0,gen:genFit});

/* ---------- 6. forces: pick the rope tensions that hold the load still ---------- */
function fnet(q,T){var a=q.al*Math.PI/180,b=q.be*Math.PI/180;return[-T[0]*Math.cos(a)+T[1]*Math.cos(b),T[0]*Math.sin(a)+T[1]*Math.sin(b)-q.W]}
function frsv(q,T,net){var cx=150,cy=118,sc=1.15,s='<svg viewBox="0 0 300 230" role="img" aria-label="Load hanging from two ropes" style="max-width:320px;width:100%"><line x1="10" y1="14" x2="290" y2="14" stroke="currentColor" stroke-width="4"/>',a=q.al*Math.PI/180,b=q.be*Math.PI/180,L=84,
  ax=cx-L*Math.cos(a)*1.1,ay=cy-L*Math.sin(a)*1.1,bx=cx+L*Math.cos(b)*1.1,by=cy-L*Math.sin(b)*1.1;
 s+='<line x1="'+ax+'" y1="'+ay+'" x2="'+cx+'" y2="'+cy+'" stroke="currentColor" stroke-width="2"/><line x1="'+bx+'" y1="'+by+'" x2="'+cx+'" y2="'+cy+'" stroke="currentColor" stroke-width="2"/>';
 s+='<rect x="'+(cx-18)+'" y="'+cy+'" width="36" height="30" rx="4" fill="var(--surface,#fff)" stroke="currentColor" stroke-width="2.5"/><text x="'+cx+'" y="'+(cy+20)+'" text-anchor="middle" font-size="12" font-weight="800" fill="currentColor">'+q.W+' N</text>';
 function ar(x1,y1,x2,y2,col,lab,lx,ly){return '<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="'+col+'" stroke-width="3" marker-end="url(#fa'+col.slice(1)+')"/><text x="'+lx+'" y="'+ly+'" font-size="11" font-weight="800" fill="'+col+'">'+lab+'</text>'}
 s+='<defs>'+['#5b4bff','#0b8f6a','#d6336c','#e08a00'].map(function(c){return '<marker id="fa'+c.slice(1)+'" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="'+c+'"/></marker>'}).join('')+'</defs>';
 s+=ar(cx,cy+30,cx,cy+30+q.W*.5,'#e08a00','weight',cx+8,cy+30+q.W*.5);
 s+='<text x="'+(ax+4)+'" y="'+(ay+16)+'" font-size="11" font-weight="700">'+q.al+'°</text><text x="'+(bx-30)+'" y="'+(by+16)+'" font-size="11" font-weight="700">'+q.be+'°</text>';
 if(net){var m=Math.hypot(net[0],net[1]);if(m<.04*q.W)s+='<text x="'+cx+'" y="222" text-anchor="middle" font-size="13" font-weight="800" fill="#0b8f6a">Balanced</text>';else{var k=Math.min(1.2,50/m);s+=ar(cx,cy+15,cx+net[0]*k,cy+15-net[1]*k,'#d6336c','net',cx+net[0]*k+6,cy+15-net[1]*k)}}
 return s+'</svg>'}
IT.frbal={init:function(it){it.T=[0,0];it.k=0;it.net=null;it.t=false},
 render:function(it,rev){var q=it.q.fr,h='<div class="itx bld"><div class="figw" id="frfig">'+frsv(q,it.T,it.net)+'</div>';
  [['Left rope tension',0],['Right rope tension',1]].forEach(function(x){h+='<label class="lsl"><span>'+x[0]+': <b id="frv'+x[1]+'">'+it.T[x[1]]+' N</b></span><input type="range" class="frr" data-fr="'+x[1]+'" min="0" max="'+q.max+'" step="1" value="'+it.T[x[1]]+'" aria-label="'+x[0]+'"'+(rev?' disabled':'')+'></label>'});
  if(!rev)h+='<div class="simt"><button class="btn sec sm" data-frt="1"'+(it.k>=3?' disabled':'')+'>Test it ('+(3-it.k)+' left)</button><div class="simo" aria-live="polite">'+(it.net?(Math.hypot(it.net[0],it.net[1])<.04*q.W?'Balanced, ready to check.':'Net force: <b>'+sg(rd(it.net[0],1))+' N sideways, '+sg(rd(it.net[1],1))+' N vertical</b>.'):'Think about the sideways and the vertical forces separately, then test.')+'</div></div>';
  else{var n=fnet(q,it.T);h+='<div class="simo">Your ropes leave <b>'+sg(rd(n[0],1))+' N</b> sideways and <b>'+sg(rd(n[1],1))+' N</b> vertical. '+(it.ok?'Balanced.':'About '+q.sol[0]+' N left and '+q.sol[1]+' N right balances it.')+'</div>'}
  return h+'</div>'},
 ok:function(it){var q=it.q.fr,n=fnet(q,it.T);return Math.hypot(n[0],n[1])<.04*q.W},done:function(it){return it.t},ans:function(q){return q.fr.sol[0]+' N left, '+q.fr.sol[1]+' N right'}};
document.addEventListener('input',function(e){if(!e.target.classList||!e.target.classList.contains('frr'))return;var it=cur('frbal');if(!it)return;var i=+e.target.dataset.fr;it.T[i]=+e.target.value;it.t=true;var v=document.getElementById('frv'+i);if(v)v.textContent=it.T[i]+' N';window.sfx&&sfx('tick');refresh()});
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-frt]');if(!b)return;var it=cur('frbal');if(!it||it.k>=3)return;it.k++;it.t=true;it.net=fnet(it.q.fr,it.T);window.sfx&&sfx(Math.hypot(it.net[0],it.net[1])<.04*it.q.fr.W?'ok':'hint');drawSess()});
function genFr(r){for(var k=0;k<80;k++){var al=pk(r,[30,37,45,53,60]),be=pk(r,[30,37,45,53,60]),W=pk(r,[40,50,60,80,100,120]),q={al:al,be:be,W:W,max:Math.round(W*2)},best=null;
  for(var a=0;a<=q.max;a++)for(var b=0;b<=q.max;b++){var n=fnet(q,[a,b]),m=Math.hypot(n[0],n[1]);if(!best||m<best.m)best={m:m,T:[a,b]}}
  if(best.m>.025*W||al===be)continue;q.sol=best.T;
  return{q:'A '+W+' N load hangs from two ropes: the left rope makes '+al+'° with the ceiling and the right rope makes '+be+'°. Choose both tensions so the load stays still.',fr:q,steps:['Sideways forces must cancel: T1 cos '+al+'° = T2 cos '+be+'°.','Upward forces must equal the weight: T1 sin '+al+'° + T2 sin '+be+'° = '+W+' N.','Solving gives about '+best.T[0]+' N and '+best.T[1]+' N.']}}
 return null}
add('quanta-physics',{id:'fr',t:'frc',l:3,ic:'🏗️',type:'frbal',cp:1,gen:genFr});

/* ---------- 7. logic: choose the gates that make the target truth table ---------- */
var GT={AND:function(a,b){return a&b},OR:function(a,b){return a|b},XOR:function(a,b){return a^b},NAND:function(a,b){return 1-(a&b)},NOR:function(a,b){return 1-(a|b)},XNOR:function(a,b){return 1-(a^b)}},GN=Object.keys(GT);
function lout(g,A,Bv,C){return GT[g[1]](GT[g[0]](A,Bv),C)}
function ltable(g){var o=[];for(var i=0;i<8;i++)o.push(lout(g,i>>2&1,i>>1&1,i&1));return o}
function lsv(g){var gb=function(x,y,t,l){return '<rect x="'+x+'" y="'+y+'" width="62" height="40" rx="8" fill="var(--surface,#fff)" stroke="currentColor" stroke-width="2.4"/><text x="'+(x+31)+'" y="'+(y+25)+'" text-anchor="middle" font-size="13" font-weight="800" fill="'+(l?'currentColor':'#8a8fb0')+'">'+(l||'?')+'</text>'};
 return '<svg viewBox="0 0 300 120" role="img" aria-label="Two gates in a row: A and B feed the first gate, its output and C feed the second" style="max-width:320px;width:100%"><g stroke="currentColor" stroke-width="2" fill="none"><path d="M30 30H60M30 62H60M122 46H150M30 100H150M212 70H270"/><path d="M60 30V30"/></g>'+gb(60,20,0,g[0])+gb(150,50,0,g[1])+'<text x="10" y="34" font-size="13" font-weight="800">A</text><text x="10" y="66" font-size="13" font-weight="800">B</text><text x="10" y="104" font-size="13" font-weight="800">C</text><text x="274" y="74" font-size="13" font-weight="800">Out</text></svg>'}
IT.lgate={init:function(it){it.g=[null,null];it.k=0;it.shown=false},
 render:function(it,rev){var q=it.q.lg,h='<div class="itx bld"><div class="figw">'+lsv(it.g)+'</div>';
  [['First gate (A, B)',0],['Second gate (that output, C)',1]].forEach(function(x){h+='<div class="bseg" role="group" aria-label="'+x[0]+'"><span>'+x[0]+'</span>'+GN.map(function(n){return '<button type="button" class="ch'+(it.g[x[1]]===n?' on':'')+'" data-lg="'+x[1]+n+'" aria-pressed="'+(it.g[x[1]]===n)+'"'+(rev?' disabled':'')+'>'+n+'</button>'}).join('')+'</div>'});
  var mine=it.g[0]&&it.g[1]&&(it.shown||rev)?ltable(it.g):null;
  h+='<table class="lgt" aria-label="Truth table"><tr><th>A</th><th>B</th><th>C</th><th>Target</th>'+(mine?'<th>Yours</th>':'')+'</tr>';
  for(var i=0;i<8;i++)h+='<tr><td>'+(i>>2&1)+'</td><td>'+(i>>1&1)+'</td><td>'+(i&1)+'</td><td><b>'+q.tt[i]+'</b></td>'+(mine?'<td class="'+(mine[i]===q.tt[i]?'okc':'badc')+'">'+mine[i]+(mine[i]===q.tt[i]?' ✓':' ✗')+'</td>':'')+'</tr>';
  h+='</table>';
  if(!rev)h+='<div class="simt"><button class="btn sec sm" data-lgt="1"'+(it.k>=3||!(it.g[0]&&it.g[1])?' disabled':'')+'>Try the circuit ('+(3-it.k)+' left)</button></div>';
  else h+='<div class="simo">'+(it.ok?'Your gates reproduce the target.':'One answer: '+q.sol.join(' then ')+'.')+'</div>';
  return h+'</div>'},
 ok:function(it){var t=it.q.lg.tt;return !!(it.g[0]&&it.g[1])&&ltable(it.g).every(function(v,i){return v===t[i]})},done:function(it){return !!(it.g[0]&&it.g[1])},ans:function(q){return q.lg.sol.join(' then ')}};
document.addEventListener('click',function(e){var it=cur('lgate');if(!it)return;var g=e.target.closest&&e.target.closest('[data-lg]'),t=e.target.closest&&e.target.closest('[data-lgt]');
 if(g){it.g[+g.dataset.lg[0]]=g.dataset.lg.slice(1);it.shown=false;window.sfx&&sfx('pop');drawSess();refresh()}
 else if(t&&it.k<3&&it.g[0]&&it.g[1]){it.k++;it.shown=true;window.sfx&&sfx(it.ok?'ok':'hint');drawSess();refresh()}});
function genLg(r){for(var k=0;k<60;k++){var g=[pk(r,GN),pk(r,GN)],tt=ltable(g),ones=tt.reduce(function(a,b){return a+b},0);if(ones<2||ones>6)continue;
  var gx=[0,1].map(function(i){return g[i]});
  return{q:'Build a circuit whose output matches the target column of the truth table. Pick the first gate (inputs A and B) and the second gate (the first gate’s output and C).',lg:{tt:tt,sol:gx},steps:['Work row by row: first find what the first gate must do to A and B.','Then see what the second gate must do with that result and C.','One answer: '+gx[0]+' then '+gx[1]+'.']}}
 return null}
add('circuit-lab-b',{id:'lg',t:'logic',l:3,ic:'🧠',type:'lgate',cp:0,gen:genLg});

var PK=(window.P&&P.meta&&P.meta.id||'').replace(/-20\d\d$/,'');
var TL=B[PK]||[],NPER=10;
TL.forEach(function(tp){var seen={};for(var i=0;i<NPER;i++){var id='bld-'+tp.id+'-'+(i<9?'0':'')+(i+1);if(QI[id]!==undefined)continue;var g=null,tries=0;while(!g&&tries<8){g=tp.gen(mul(hs(PK+tp.id+i+'x'+tries)));tries++;if(g&&seen[JSON.stringify(g.fc||g.fr||g.lg)])g=null}if(!g)continue;seen[JSON.stringify(g.fc||g.fr||g.lg)]=1;
 var q={id:id,t:tp.t,l:tp.l,type:tp.type,ic:tp.ic,q:g.q,sol:g.steps,w:g.steps[g.steps.length-1],fp:'bld-'+tp.id,cp:tp.cp,bld:1};for(var k in g)if(k!=='q'&&k!=='steps')q[k]=g[k];QS.push(q);QI[id]=QS.length-1}});
})();
