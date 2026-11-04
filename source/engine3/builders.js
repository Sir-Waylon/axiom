/* ===== concept-specific builders: each one is shaped like its idea (a circuit you wire, a wind barb you draw, a shape you move, a point you drag).
   Seeded generators make 10 different problems per builder. Nothing is shown that gives the answer away; the check is the only attempt. ===== */
(function(){
function mul(a){return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function hs(s){var h=2166136261;s=String(s);for(var i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function pk(r,a){return a[Math.floor(r()*a.length)]}
function rd(v,d){return +v.toFixed(d===undefined?2:d)}
function sg(x){return String(x).replace('-','−')}
function cur(type){var it=Z&&!Z.fin&&Z.steps&&Z.steps[Z.i]&&Z.steps[Z.i].it;return it&&it.q.type===type&&!it.done?it:null}
function refresh(){if(window.itEnable)itEnable()}
var B={};/* pack id -> [{id,t,l,ic,type,gen(r)->q fields}] */
function add(pack,spec){(B[pack]=B[pack]||[]).push(spec)}

/* ---------- 1. resistor network: wire four resistors to hit a target ---------- */
function rsv(R,ops){ /* ((R1 a R2) b R3) c R4 as svg. null ops draw faded series */
 function box(v){return{w:46,h:20,s:function(x,y){return '<rect x="'+x+'" y="'+y+'" width="46" height="20" rx="3" fill="var(--surface,#fff)" stroke="currentColor" stroke-width="2"/><text x="'+(x+23)+'" y="'+(y+14)+'" text-anchor="middle" font-size="11" font-weight="700" fill="currentColor">'+v+' Ω</text>'},c:10}}
 function ser(a,b,ghost){var w=a.w+b.w+14,h=Math.max(a.h,b.h),ca=a.c,cb=b.c,cy=Math.max(ca,cb);return{w:w,h:Math.max(cy-ca+a.h,cy-cb+b.h),c:cy,s:function(x,y){return a.s(x,y+cy-ca)+b.s(x+a.w+14,y+cy-cb)+'<line x1="'+(x+a.w)+'" y1="'+(y+cy)+'" x2="'+(x+a.w+14)+'" y2="'+(y+cy)+'" stroke="currentColor" stroke-width="2"'+(ghost?' stroke-dasharray="3 3" opacity=".5"':'')+'/>'}}}
 function par(a,b,ghost){var w=Math.max(a.w,b.w)+24,g=10,cya=a.c,cyb=a.h+g+b.c,h=a.h+g+b.h,cy=(cya+cyb)/2;return{w:w,h:h,c:cy,s:function(x,y){var xa=x+12+(Math.max(a.w,b.w)-a.w)/2,xb=x+12+(Math.max(a.w,b.w)-b.w)/2;
  return a.s(xa,y)+b.s(xb,y+a.h+g)+'<g stroke="currentColor" stroke-width="2" fill="none"><path d="M'+x+' '+(y+cy)+'H'+(x+12)+'V'+(y+cya)+'M'+(x+12)+' '+(y+cy)+'V'+(y+cyb)+'M'+(x+12)+' '+(y+cya)+'H'+xa+'M'+(x+12)+' '+(y+cyb)+'H'+xb+'M'+(xa+a.w)+' '+(y+cya)+'H'+(x+w-12)+'M'+(xb+b.w)+' '+(y+cyb)+'H'+(x+w-12)+'M'+(x+w-12)+' '+(y+cya)+'V'+(y+cyb)+'M'+(x+w-12)+' '+(y+cy)+'H'+(x+w)+'"'+(ghost?' opacity=".5"':'')+'/></g>'}}}
 function join(a,b,o){return o==='p'?par(a,b,false):ser(a,b,o===null)}
 var n=join(join(join(box(R[0]),box(R[1]),ops[0]),box(R[2]),ops[1]),box(R[3]),ops[2]);
 var W=n.w+40,H=n.h+20;return '<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Resistor network drawing" style="max-width:100%;height:auto"><g transform="translate(0,0)"><line x1="2" y1="'+(10+n.c)+'" x2="20" y2="'+(10+n.c)+'" stroke="currentColor" stroke-width="2"/>'+n.s(20,10)+'<line x1="'+(20+n.w)+'" y1="'+(10+n.c)+'" x2="'+(W-2)+'" y2="'+(10+n.c)+'" stroke="currentColor" stroke-width="2"/></g></svg>'}
function rtot(R,ops){var t=R[0],i;for(i=0;i<3;i++){var r=R[i+1];t=ops[i]==='p'?t*r/(t+r):t+r}return t}
function allOps(){var o=[];['s','p'].forEach(function(a){['s','p'].forEach(function(b){['s','p'].forEach(function(c){o.push([a,b,c])})})});return o}
function genRes(r){for(var k=0;k<60;k++){var P=[2,3,4,6,8,10,12,15,20,24,30,40,60],R=[pk(r,P),pk(r,P),pk(r,P),pk(r,P)],sol=pk(r,allOps()),T=rtot(R,sol),all=allOps().map(function(o){return rtot(R,o)}),good=true;
  all.forEach(function(v,i){all.forEach(function(w,j){if(i<j&&Math.abs(v-w)/Math.max(v,w)<.04)good=false})});
  if(!good||T<1||T>150)continue;T=rd(T,2);
  var nm={s:'series',p:'parallel'};return{q:'Wire the four resistors in the order shown to make a total of '+sg(T)+' Ω. Choose how each one joins the group before it.',rn:{R:R,T:T,sol:sol},
   steps:['Work from the left: R1 and R2 first, then add R3, then R4.','R1 and R2 in '+nm[sol[0]]+' give '+rd(sol[0]==='s'?R[0]+R[1]:R[0]*R[1]/(R[0]+R[1]),2)+' Ω.','Adding R3 in '+nm[sol[1]]+' gives '+rd(sol[1]==='s'?rtot(R,[sol[0],'s','s'])-R[3]*0:0,2)+' Ω.']}}
 return null}
IT.resnet={init:function(it){it.o=[null,null,null]},
 render:function(it,rev){var q=it.q,rn=q.rn,h='<div class="itx bld"><div class="figw" id="rsfig">'+rsv(rn.R,it.o)+'</div>';
  [0,1,2].forEach(function(i){var lab=['R1 and R2','that group and R3','that group and R4'][i];h+='<div class="bseg" role="group" aria-label="'+lab+'"><span>'+lab+'</span>';[['s','Series'],['p','Parallel']].forEach(function(x){h+='<button type="button" class="ch'+(it.o[i]===x[0]?' on':'')+'" data-rs="'+i+x[0]+'" aria-pressed="'+(it.o[i]===x[0])+'"'+(rev?' disabled':'')+'>'+x[1]+'</button>'});h+='</div>'});
  if(rev)h+='<div class="simo">Yours gives <b>'+sg(rd(rtot(rn.R,it.o),2))+' Ω</b>. '+(it.ok?'On target.':'Target was '+sg(rn.T)+' Ω: '+rn.sol.map(function(x){return x==='s'?'series':'parallel'}).join(', ')+'.')+'</div>';
  return h+'</div>'},
 ok:function(it){return it.o.every(function(x){return x}) && Math.abs(rtot(it.q.rn.R,it.o)-it.q.rn.T)/it.q.rn.T<=.01},done:function(it){return it.o.every(function(x){return x})},ans:function(q){return q.rn.sol.map(function(x){return x==='s'?'series':'parallel'}).join(', ')+' = '+sg(q.rn.T)+' Ω'}};
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-rs]');if(!b)return;var it=cur('resnet');if(!it)return;var i=+b.dataset.rs[0],v=b.dataset.rs[1];it.o[i]=v;window.sfx&&sfx('pop');drawSess();refresh()});
function finishRes(g,tp){/* worked solution text from the generated ops */var R=g.rn.R,o=g.rn.sol,t=R[0],s=['Combine from the left.'],nm={s:'series',p:'parallel'};
 for(var i=0;i<3;i++){var r=R[i+1],n=o[i]==='p'?t*r/(t+r):t+r;s.push('Step '+(i+1)+': '+rd(t,2)+' Ω with '+r+' Ω in '+nm[o[i]]+' = '+rd(n,2)+' Ω.');t=n}g.steps=s;return g}
add('circuit-lab-b',{id:'rn',t:'circ',l:3,ic:'🔌',type:'resnet',cp:1,gen:function(r){var g=genRes(r);return g&&finishRes(g)}});
add('quanta-physics',{id:'rn',t:'ohm',l:3,ic:'🔌',type:'resnet',cp:1,gen:function(r){var g=genRes(r);return g&&finishRes(g)}});

/* ---------- 2. wind barb: draw the wind you are told ---------- */
var DIRS=['N','NE','E','SE','S','SW','W','NW'],DN={N:'north',NE:'northeast',E:'east',SE:'southeast',S:'south',SW:'southwest',W:'west',NW:'northwest'};
function barbSvg(dir,p,f,h){var a=dir*45,L=74,s='<svg viewBox="-90 -90 180 180" role="img" aria-label="Station model with wind barb" style="max-width:260px;width:100%"><circle cx="0" cy="0" r="86" fill="none" stroke="currentColor" opacity=".15"/><text x="0" y="-74" text-anchor="middle" font-size="11" opacity=".6">N</text><text x="78" y="4" font-size="11" opacity=".6">E</text><text x="0" y="86" text-anchor="middle" font-size="11" opacity=".6">S</text><text x="-84" y="4" font-size="11" opacity=".6">W</text><g transform="rotate('+a+')"><line x1="0" y1="-6" x2="0" y2="-'+L+'" stroke="currentColor" stroke-width="2.2"/>',y=L;
 for(var i=0;i<p;i++){s+='<path d="M0 -'+y+' L16 -'+(y-4)+' L0 -'+(y-9)+'Z" fill="currentColor" stroke="currentColor"/>';y-=11}
 for(i=0;i<f;i++){s+='<line x1="0" y1="-'+y+'" x2="16" y2="-'+(y-8)+'" stroke="currentColor" stroke-width="2.2"/>';y-=7}
 if(h){if(p===0&&f===0)y-=7;s+='<line x1="0" y1="-'+y+'" x2="8" y2="-'+(y-4)+'" stroke="currentColor" stroke-width="2.2"/>'}
 return s+'</g><circle cx="0" cy="0" r="6" fill="var(--surface,#fff)" stroke="currentColor" stroke-width="2.2"/></svg>'}
IT.barb={init:function(it){it.d=null;it.n=[0,0,0]},
 render:function(it,rev){var q=it.q,bb=q.bb,h='<div class="itx bld"><div class="figw" id="bbfig">'+barbSvg(it.d===null?0:it.d,it.n[0],it.n[1],it.n[2])+'</div>';
  h+='<div class="bseg" role="group" aria-label="Wind comes from"><span>Wind comes from</span>'+DIRS.map(function(d,i){return '<button type="button" class="ch'+(it.d===i?' on':'')+'" data-bd="'+i+'" aria-pressed="'+(it.d===i)+'"'+(rev?' disabled':'')+'>'+d+'</button>'}).join('')+'</div>';
  [['Pennant (50 kt)',0,3],['Full barb (10 kt)',1,4],['Half barb (5 kt)',2,1]].forEach(function(x){h+='<div class="bseg"><span>'+x[0]+'</span><button type="button" class="btn sec sm" data-bn="'+x[1]+'-" aria-label="Fewer '+x[0]+'"'+(rev?' disabled':'')+'>−</button><b class="bnum" aria-live="polite">'+it.n[x[1]]+'</b><button type="button" class="btn sec sm" data-bn="'+x[1]+'+" aria-label="More '+x[0]+'"'+(rev?' disabled':'')+'>+</button></div>'});
  h+='<div class="simo">'+(rev?'You drew <b>'+(it.d===null?'?':DIRS[it.d])+' '+(it.n[0]*50+it.n[1]*10+it.n[2]*5)+' kt</b>. '+(it.ok?'Correct.':'Needed: '+bb.d+' at '+bb.kt+' kt.'):'Total so far: <b>'+(it.n[0]*50+it.n[1]*10+it.n[2]*5)+' kt</b>')+'</div>';
  return h+'</div>'},
 ok:function(it){var b=it.q.bb;return it.d!==null&&DIRS[it.d]===b.d&&it.n[0]*50+it.n[1]*10+it.n[2]*5===b.kt},done:function(it){return it.d!==null&&(it.n[0]+it.n[1]+it.n[2])>0},ans:function(q){return q.bb.d+', '+q.bb.kt+' kt'}};
document.addEventListener('click',function(e){var it=cur('barb');if(!it)return;var d=e.target.closest&&e.target.closest('[data-bd]'),n=e.target.closest&&e.target.closest('[data-bn]');
 if(d){it.d=+d.dataset.bd;window.sfx&&sfx('tick');drawSess();refresh()}
 else if(n){var k=+n.dataset.bn[0],mx=[3,4,1][k],dl=n.dataset.bn[1]==='+'?1:-1;it.n[k]=Math.max(0,Math.min(mx,it.n[k]+dl));window.sfx&&sfx('tick');drawSess();refresh()}});
function genBarb(r){var kt=pk(r,[5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,100,105,110,115,120,125]),d=pk(r,DIRS),p=Math.floor(kt/50),f=Math.floor((kt-p*50)/10),h=(kt-p*50-f*10)/5;
 return{q:'The station reports wind from the '+DN[d]+' at '+kt+' knots. Draw the wind barb: choose the direction and add pennants and barbs.',bb:{kt:kt,d:d},
  steps:['A pennant is 50 kt, a full barb is 10 kt, a half barb is 5 kt.',kt+' = '+(p?p+' × 50':'')+(f?(p?' + ':'')+f+' × 10':'')+(h?(p||f?' + ':'')+'5':'')+'.','The staff points toward where the wind comes from: '+DN[d]+'.']}}
add('meteorology-b',{id:'bb',t:'maps',l:2,ic:'🌬️',type:'barb',cp:0,gen:genBarb});

/* ---------- 3. transformations: move the triangle onto its image ---------- */
var XO={rx:['Reflect over x-axis',function(p){return[p[0],-p[1]]}],ry:['Reflect over y-axis',function(p){return[-p[0],p[1]]}],r90:['Rotate 90° counterclockwise',function(p){return[-p[1],p[0]]}],rc:['Rotate 90° clockwise',function(p){return[p[1],-p[0]]}],r180:['Rotate 180°',function(p){return[-p[0],-p[1]]}],
 tl:['Slide left 1',function(p){return[p[0]-1,p[1]]}],tr:['Slide right 1',function(p){return[p[0]+1,p[1]]}],tu:['Slide up 1',function(p){return[p[0],p[1]+1]}],td:['Slide down 1',function(p){return[p[0],p[1]-1]}]};
function xapply(tri,mv){var t=tri;mv.forEach(function(m){t=t.map(XO[m][1])});return t}
function xsv(tri,goal){var c=17,o=7,W=15*c,s='<svg viewBox="0 0 '+W+' '+W+'" role="img" aria-label="Coordinate grid with triangle and target image" style="max-width:300px;width:100%;background:var(--surface,#fff);border:1px solid var(--line);border-radius:12px">',i;
 function X(x){return (x+o)*c+c/2}function Y(y){return (o-y)*c+c/2}
 for(i=0;i<15;i++){s+='<line x1="'+(i*c+c/2)+'" y1="0" x2="'+(i*c+c/2)+'" y2="'+W+'" stroke="currentColor" opacity="'+(i===o?.7:.1)+'"/><line x1="0" y1="'+(i*c+c/2)+'" x2="'+W+'" y2="'+(i*c+c/2)+'" stroke="currentColor" opacity="'+(i===o?.7:.1)+'"/>'}
 s+='<polygon points="'+goal.map(function(p){return X(p[0])+','+Y(p[1])}).join(' ')+'" fill="none" stroke="#e08a00" stroke-width="2.5" stroke-dasharray="5 4"/>';
 s+='<polygon points="'+tri.map(function(p){return X(p[0])+','+Y(p[1])}).join(' ')+'" fill="rgba(91,75,255,.28)" stroke="#5b4bff" stroke-width="2.5"/>';
 tri.forEach(function(p,k){s+='<text x="'+(X(p[0])+5)+'" y="'+(Y(p[1])-4)+'" font-size="11" font-weight="800" fill="#5b4bff">'+'ABC'[k]+'</text>'});
 goal.forEach(function(p,k){s+='<text x="'+(X(p[0])+5)+'" y="'+(Y(p[1])+13)+'" font-size="10" font-weight="800" fill="#c47400">'+'ABC'[k]+'′</text>'});
 return s+'</svg>'}
function coords(t,pr){return t.map(function(p,k){return 'ABC'[k]+pr+'('+sg(p[0])+', '+sg(p[1])+')'}).join('  ')}
IT.xform={init:function(it){it.mv=[]},
 render:function(it,rev){var x=it.q.xf,cur=xapply(x.tri,it.mv),h='<div class="itx bld"><div class="figw">'+xsv(cur,x.goal)+'</div><div class="small" aria-live="polite"><b>Now:</b> '+coords(cur,'')+'</div><div class="small"><b>Target:</b> '+coords(x.goal,'′')+'</div><div class="small mute">Moves used '+it.mv.length+' of '+x.max+(it.mv.length?': '+it.mv.map(function(m){return XO[m][0]}).join(' → '):'')+'</div>';
  if(!rev){h+='<div class="xbtns">';Object.keys(XO).forEach(function(k){h+='<button type="button" class="btn sec sm" data-xm="'+k+'"'+(it.mv.length>=x.max?' disabled':'')+'>'+XO[k][0]+'</button>'});h+='</div><div class="row"><button type="button" class="btn sec sm" data-xu="1"'+(it.mv.length?'':' disabled')+'>Undo</button><button type="button" class="btn sec sm" data-xr="1"'+(it.mv.length?'':' disabled')+'>Reset</button></div>'}
  else h+='<div class="simo">'+(it.ok?'Your moves land on the target.':'One way: '+x.sol.map(function(m){return XO[m][0]}).join(' → ')+'.')+'</div>';
  return h+'</div>'},
 ok:function(it){var x=it.q.xf,c=xapply(x.tri,it.mv);return c.every(function(p,i){return p[0]===x.goal[i][0]&&p[1]===x.goal[i][1]})},done:function(it){return it.mv.length>0},ans:function(q){return q.xf.sol.map(function(m){return XO[m][0]}).join(' → ')}};
document.addEventListener('click',function(e){var it=cur('xform');if(!it)return;var m=e.target.closest&&e.target.closest('[data-xm]'),u=e.target.closest&&e.target.closest('[data-xu]'),r=e.target.closest&&e.target.closest('[data-xr]');
 if(m&&it.mv.length<it.q.xf.max)it.mv.push(m.dataset.xm);else if(u)it.mv.pop();else if(r)it.mv=[];else return;window.sfx&&sfx('swish');drawSess();refresh()});
function genX(r){for(var k=0;k<80;k++){var tri=[0,1,2].map(function(){return[Math.floor(r()*9)-4,Math.floor(r()*9)-4]}),ar=Math.abs((tri[1][0]-tri[0][0])*(tri[2][1]-tri[0][1])-(tri[2][0]-tri[0][0])*(tri[1][1]-tri[0][1]))/2;if(ar<2||ar>10)continue;
  var d=function(a,b){return Math.pow(a[0]-b[0],2)+Math.pow(a[1]-b[1],2)},s=[d(tri[0],tri[1]),d(tri[1],tri[2]),d(tri[0],tri[2])];if(s[0]===s[1]||s[1]===s[2]||s[0]===s[2])continue;
  var lin=[pk(r,['rx','ry','r90','rc','r180']),pk(r,['rx','ry','r90','rc'])],dx=Math.floor(r()*5)-2,dy=Math.floor(r()*5)-2,tm=[];for(var i=0;i<Math.abs(dx);i++)tm.push(dx>0?'tr':'tl');for(i=0;i<Math.abs(dy);i++)tm.push(dy>0?'tu':'td');
  var seq=r()<.5?lin.concat(tm):tm.concat(lin);if(lin[0]===lin[1]||seq.length<3)continue;var goal=xapply(tri,seq);if(goal.some(function(p){return Math.abs(p[0])>6||Math.abs(p[1])>6}))continue;
  var same=goal.every(function(p,i){return p[0]===tri[i][0]&&p[1]===tri[i][1]});if(same)continue;
  return{q:'Move triangle ABC onto its dashed image A′B′C′ using the buttons. Watch how the coordinates change with each move.',xf:{tri:tri,goal:goal,sol:seq,max:seq.length+3},steps:['Compare the coordinates of A and A′ to find which moves change them.','Reflections swap or negate coordinates; rotations swap and negate; slides add or subtract.','One solution: '+seq.map(function(m){return XO[m][0]}).join(', then ')+'.']}}
 return null}
add('geometry-readiness',{id:'xf',t:'trn',l:3,ic:'🔺',type:'xform',cp:0,gen:genX});

/* ---------- 4. unit circle: put the point where the values say ---------- */
var SPEC=[30,45,60,120,135,150,210,225,240,300,315,330];
function rg(d){var g=function(a,b){return b?g(b,a%b):a},n=d,m=180,k=g(n,m);n/=k;m/=k;return n===1?(m===1?'π':'π/'+m):n+'π'+(m===1?'':'/'+m)}
var VAL={30:['1/2','√3/2','√3/3'],45:['√2/2','√2/2','1'],60:['√3/2','1/2','√3']};/* sin, cos, tan magnitudes for reference angle */
function ucsv(a,rev,tr){var R=90,cx=110,cy=110,rad=a*Math.PI/180,px=cx+R*Math.cos(rad),py=cy-R*Math.sin(rad),s='<svg id="ucsv" viewBox="0 0 220 220" role="img" aria-label="Unit circle, point at '+a+' degrees" style="max-width:280px;width:100%;touch-action:none"><circle cx="'+cx+'" cy="'+cy+'" r="'+R+'" fill="var(--surface,#fff)" stroke="currentColor" stroke-width="2"/><line x1="8" y1="'+cy+'" x2="212" y2="'+cy+'" stroke="currentColor" opacity=".4"/><line x1="'+cx+'" y1="8" x2="'+cx+'" y2="212" stroke="currentColor" opacity=".4"/>';
 for(var k=0;k<24;k++){var r2=k*15*Math.PI/180;s+='<circle cx="'+(cx+R*Math.cos(r2)).toFixed(1)+'" cy="'+(cy-R*Math.sin(r2)).toFixed(1)+'" r="'+(k%2?1.6:2.4)+'" fill="currentColor" opacity=".35"/>'}
 s+='<line x1="'+cx+'" y1="'+cy+'" x2="'+px.toFixed(1)+'" y2="'+py.toFixed(1)+'" stroke="#5b4bff" stroke-width="2.5"/><line x1="'+px.toFixed(1)+'" y1="'+py.toFixed(1)+'" x2="'+px.toFixed(1)+'" y2="'+cy+'" stroke="#d6336c" stroke-width="2.5" stroke-dasharray="4 3"/><line x1="'+px.toFixed(1)+'" y1="'+cy+'" x2="'+cx+'" y2="'+cy+'" stroke="#0b8f6a" stroke-width="2.5" stroke-dasharray="4 3"/>';
 s+='<path d="M'+(cx+22)+' '+cy+' A22 22 0 '+(a>180?1:0)+' 0 '+(cx+22*Math.cos(rad)).toFixed(1)+' '+(cy-22*Math.sin(rad)).toFixed(1)+'" fill="none" stroke="#5b4bff" stroke-width="2"/><circle cx="'+px.toFixed(1)+'" cy="'+py.toFixed(1)+'" r="8" fill="#5b4bff" stroke="#fff" stroke-width="2"/>';
 s+='<text x="'+(cx+6)+'" y="'+(cy+14)+'" font-size="10" fill="#0b8f6a" font-weight="700">cos</text><text x="'+(px+(Math.cos(rad)>=0?10:-30)).toFixed(1)+'" y="'+((py+cy)/2).toFixed(1)+'" font-size="10" fill="#d6336c" font-weight="700">sin</text></svg>';return s}
IT.ucirc={init:function(it){it.a=0;it.t=false},
 render:function(it,rev){var q=it.q,h='<div class="itx bld"><div class="figw" id="ucfig">'+ucsv(it.a,rev)+'</div><div class="ucr"><b id="uca" aria-live="polite">'+it.a+'° = '+rg(it.a)+(it.a===0?'':' rad')+'</b></div>'+
  '<label class="lsl"><span>Angle θ (drag the point or the slider)</span><input type="range" id="ucr" min="0" max="345" step="15" value="'+it.a+'" aria-label="Angle in degrees"'+(rev?' disabled':'')+'></label>';
  if(rev)h+='<div class="simo">'+(it.ok?'Yes, '+q.uc.a+'°.':'The point belongs at <b>'+q.uc.a+'° ('+rg(q.uc.a)+')</b>: cos = '+q.uc.cs+', sin = '+q.uc.sn+'.')+'</div>';
  return h+'</div>'},
 ok:function(it){return it.a===it.q.uc.a},done:function(it){return it.t},ans:function(q){return q.uc.a+'° ('+rg(q.uc.a)+')'}};
function ucSet(it,a){a=((Math.round(a/15)*15)%360+360)%360;it.a=a;it.t=true;var f=document.getElementById('ucfig'),l=document.getElementById('uca'),r=document.getElementById('ucr');if(f)f.innerHTML=ucsv(a);if(l)l.textContent=a+'° = '+rg(a)+(a===0?'':' rad');if(r&&+r.value!==a)r.value=a;refresh()}
document.addEventListener('input',function(e){if(e.target.id!=='ucr')return;var it=cur('ucirc');if(it){ucSet(it,+e.target.value);window.sfx&&sfx('tick')}});
(function(){var dr=false;function mv(e){var sv=document.getElementById('ucsv'),it=cur('ucirc');if(!sv||!it)return;var r=sv.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*220-110,y=110-(e.clientY-r.top)/r.height*220;ucSet(it,Math.atan2(y,x)*180/Math.PI)}
 document.addEventListener('pointerdown',function(e){if(e.target.closest&&e.target.closest('#ucsv')){dr=true;mv(e)}});document.addEventListener('pointermove',function(e){if(dr)mv(e)});document.addEventListener('pointerup',function(){dr=false})})();
function genUC(r){var a=pk(r,SPEC),ref=a<=90?a:a<=180?180-a:a<=270?a-180:360-a,v=VAL[ref],sn=(a>180?'−':'')+v[0],cs=((a>90&&a<270)?'−':'')+v[1],tn=((a>90&&a<180)||a>270?'−':'')+v[2],m=Math.floor(r()*3),q;
 if(m===0)q='sin θ = '+sn+' and cos θ '+(a>90&&a<270?'< 0':'> 0');else if(m===1)q='cos θ = '+cs+' and sin θ '+(a>180?'< 0':'> 0');else q='tan θ = '+tn+' and sin θ '+(a>180?'< 0':'> 0');
 return{q:'Put the point at the angle θ between 0° and 360° where '+q+'.',uc:{a:a,sn:sn,cs:cs},steps:['Find the reference angle from the magnitude: '+v[m===0?0:m===1?1:2]+' belongs to '+ref+'°.','Use the sign condition to choose the quadrant.','θ = '+a+'° ('+rg(a)+').']}}
add('apex-math',{id:'uc',t:'tc',l:2,ic:'🎯',type:'ucirc',cp:0,gen:genUC});

/* ---------- register questions ---------- */
var PK=(window.P&&P.meta&&P.meta.id||'').replace(/-20\d\d$/,'');
var TL=B[PK]||[],NPER=10;
TL.forEach(function(tp){var seen={};for(var i=0;i<NPER;i++){var id='bld-'+tp.id+'-'+(i<9?'0':'')+(i+1);if(QI[id]!==undefined)continue;var g=null,tries=0;while(!g&&tries<8){g=tp.gen(mul(hs(PK+tp.id+i+'x'+tries)));tries++;if(g&&seen[JSON.stringify(g.rn||g.bb||g.xf||g.uc)])g=null}if(!g)continue;seen[JSON.stringify(g.rn||g.bb||g.xf||g.uc)]=1;
 var q={id:id,t:tp.t,l:tp.l,type:tp.type,ic:tp.ic,q:g.q,sol:g.steps,w:g.steps[g.steps.length-1],fp:'bld-'+tp.id,cp:tp.cp,bld:1};for(var k in g)if(k!=='q'&&k!=='steps')q[k]=g[k];QS.push(q);QI[id]=QS.length-1}});
if(window.TYB){TYB.resnet=.45;TYB.barb=.35;TYB.xform=.5;TYB.ucirc=.45}
})();
