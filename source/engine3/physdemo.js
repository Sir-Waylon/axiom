/* ===== animated physics demos (Quanta). Drag a handle, press Run, watch real objects move, then read the result.
   Replaces slider labs for projectile motion and momentum. Every problem is seeded and verified solvable. ===== */
(function(){
var K=window.__labKit;if(!K)return;var mul=K.mul,hs=K.hs,pk=K.pk,rd=K.rd,sg=K.sg,fm=K.fm,TX=K.TX,LN=K.LN,PU=K.PU,OR=K.OR,GR=K.GR,RD=K.RD,BL=K.BL,G=9.8,PI=Math.PI;
var PKID=(window.P&&P.meta&&P.meta.id||'').replace(/-20\d\d$/,'');if(PKID!=='quanta-physics')return;
var D={};function def(d){D[d.id]=d}
function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
/* ---------- 1. Drop tower: bowling ball, basketball, feather. Air or vacuum. ---------- */
var OBJ=[{n:'Bowling ball',m:7,A:.038,Cd:.5,x:62,r:8,c:'#3b3b4f'},{n:'Basketball',m:.6,A:.045,Cd:.5,x:150,r:10,c:'#e08a00'},{n:'Feather',m:.003,A:.01,Cd:1.2,x:238,r:6,c:'#2a7de1'}];
function fall(o,h,air){var y=h,v=0,t=0,dt=1/240,ys=[h],k=air?.5*1.2*o.Cd*o.A/o.m:0;while(y>0&&t<60){var a=G-k*v*v;v+=a*dt;y-=v*dt;t+=dt;ys.push(Math.max(0,y))}return{t:t,v:v,ys:ys,dt:dt}}
def({id:'drop',t:'kin',l:3,ic:'🗼',
 gen:function(r){var k=pk(r,['time','time','cmp','cmp','speed']);if(k==='time'){var T=pk(r,[1.2,1.5,1.8,2,2.2,2.5,2.8]);return{k:k,T:T}}if(k==='speed'){return{k:k,V:pk(r,[8,10,12,14,16,18])}}return{k:k,H:pk(r,[10,15,20,25,30,35])}},
 story:function(p){return p.k==='time'?'Set the tower height so that, in a vacuum, the three objects take '+p.T+' s to land. Drop all three together.':p.k==='speed'?'In a vacuum, drop the objects from a height that makes them hit the ground at '+p.V+' m/s.':'Drop the three objects together from at least '+p.H+' m in air and watch which one lags. Then drop them from the same height in a vacuum and watch what changes.'},
 init:function(){return{h:10,air:false}},
 sim:function(s){return OBJ.map(function(o){return fall(o,s.h,s.air)})},
 res:function(s,rs){var ts=rs.map(function(r){return r.t});return{h:s.h,air:s.air,t:rs[0].t,v:rs[0].v,spread:Math.max.apply(0,ts)-Math.min.apply(0,ts)}},
 goals:function(p){if(p.k==='time')return[{t:'Vacuum drop that lands at '+p.T+' s (within 0.15 s)',ok:function(r){return!r.air&&Math.abs(r.t-p.T)<=.15}}];if(p.k==='speed')return[{t:'Vacuum drop that lands at '+p.V+' m/s (within 0.7 m/s)',ok:function(r){return!r.air&&Math.abs(r.v-p.V)<=.7}}];
  return[{t:'In air from at least '+p.H+' m, the feather lands late',ok:function(r,all){return all.some(function(x){return x.air&&x.h>=p.H&&x.spread>.3})}},{t:'In a vacuum from the same height, all three land together',ok:function(r,all){return all.some(function(x){return x.air&&x.h>=p.H&&x.spread>.3&&all.some(function(y){return!y.air&&y.h===x.h&&y.spread<.02})})}}]},
 cands:function(p){var o=[];for(var h=5;h<=45;h++){o.push({h:h,air:false});o.push({h:h,air:true})}return o},
 solveSeq:function(p){var o=[];if(p.k==='cmp'){var h=Math.max(p.H,5);return[{h:h,air:true},{h:h,air:false}]}for(var h=5;h<=45;h++)o.push({h:h,air:false});return o},
 scene:function(s,p,rs,tm){var sc=3,top=150-s.h*sc,h='<rect x="0" y="150" width="300" height="20" fill="#cdd3dc"/>'+LN(0,150,300,150,'#7a8499',2)+'<rect x="296" y="'+Math.min(top,148)+'" width="4" height="'+(150-Math.min(top,148))+'" fill="#7a8499"/>';
  if(!s.air)h+='<text x="6" y="14" font-size="9" font-weight="700" fill="#7a8499">VACUUM</text>';else h+='<g fill="#9fb4d8" opacity=".55">'+[40,100,200,260].map(function(x,i){return '<circle cx="'+x+'" cy="'+(40+i*25)+'" r="1.5"/><circle cx="'+(x+18)+'" cy="'+(55+i*20)+'" r="1.5"/>'}).join('')+'</g><text x="6" y="14" font-size="9" font-weight="700" fill="#2a7de1">AIR</text>';
  OBJ.forEach(function(o,i){var y=s.h;if(rs&&tm!==null){var f=rs[i],ix=Math.min(f.ys.length-1,Math.floor(tm/f.dt));y=f.ys[ix]}var cy=150-y*sc-o.r;
   h+=(o.n==='Feather'?'<ellipse cx="'+o.x+'" cy="'+cy+'" rx="4" ry="9" fill="'+o.c+'" transform="rotate(25 '+o.x+' '+cy+')"/>':'<circle cx="'+o.x+'" cy="'+cy+'" r="'+o.r+'" fill="'+o.c+'"/>')+TX(o.x,164,o.n,{s:8,a:'middle',w:600});
   if(rs&&tm!==null&&tm>=rs[i].t)h+=TX(o.x,cy-o.r-4,rd(rs[i].t,2)+' s',{s:9,a:'middle',c:'#d6336c'})});
  var hy=clamp(top,10,145);h+='<g data-hd="1" tabindex="0" role="slider" aria-label="Drop height in metres" aria-valuemin="5" aria-valuemax="45" aria-valuenow="'+s.h+'" style="cursor:ns-resize"><rect x="10" y="'+(hy-1.5)+'" width="280" height="3" fill="'+PU+'" opacity=".55"/><rect x="262" y="'+(hy-11)+'" width="34" height="22" rx="6" fill="'+PU+'"/><text x="279" y="'+(hy+4)+'" font-size="10" font-weight="800" text-anchor="middle" fill="#fff">'+s.h+' m</text></g>';return h},
 drag:function(s,x,y){var h=clamp(Math.round((150-y)/3),5,45);if(h===s.h)return false;s.h=h;return true},key:function(s,k){var h=clamp(s.h+(k==='up'?1:k==='down'?-1:0),5,45);if(h===s.h)return false;s.h=h;return true},
 ctl:function(s){return '<button type="button" class="chip'+(s.air?'':' on')+'" data-sbx="air:0" aria-pressed="'+!s.air+'">Vacuum</button> <button type="button" class="chip'+(s.air?' on':'')+'" data-sbx="air:1" aria-pressed="'+s.air+'">Air</button>'},
 click:function(s,k,v){if(k==='air')s.air=v==='1'},
 dur:function(rs){return Math.max.apply(0,rs.map(function(r){return r.t}))+.4},
 read:function(s,r){return r?'Height <b>'+r.h+' m</b> · '+(r.air?'air':'vacuum')+' · landing speed of the bowling ball <b>'+fm(r.v)+' m/s</b> · spread between first and last <b>'+fm(r.spread,2)+' s</b>':'Height <b>'+s.h+' m</b> · '+(s.air?'air':'vacuum')+'. Drag the purple bar, then press Run.'},
 why:function(p,sv){var l=[];if(p.k==='time')l=['With no air every object falls the same way: h = ½ g t².','h = ½ × 9.8 × '+p.T+'² ≈ '+fm(.5*G*p.T*p.T,0)+' m.'];else if(p.k==='speed')l=['With no air v² = 2 g h, so h = v² ÷ (2 g).','h = '+p.V+'² ÷ 19.6 ≈ '+fm(p.V*p.V/19.6,0)+' m.'];else l=['In air the feather catches a lot of air for its tiny weight, so drag cancels most of gravity and it falls slowly.','In a vacuum there is no drag. Gravity accelerates every mass at the same 9.8 m/s², so all three land together.'];return l.concat(['Try it: '+(sv.length?sv.map(function(x){return x.h+' m '+(x.air?'in air':'in a vacuum')}).join(', then '):'')+'.'])}});
/* ---------- 2. Launcher: drag the arrow. Direction is the angle, length is the speed. ---------- */
def({id:'shot',t:'kin',l:3,ic:'🏹',
 gen:function(r){var a0=pk(r,[30,35,40,45,50,55,60]),v0=12+Math.floor(r()*15),th=a0*PI/180,Dd=Math.round(v0*v0*Math.sin(2*th)/G);if(Dd<15)return null;var wx=Math.round(Dd*pk(r,[.4,.5,.6])),y0=wx*Math.tan(th)-G*wx*wx/(2*v0*v0*Math.cos(th)*Math.cos(th));return{D:Dd,wx:wx,wh:Math.max(1,Math.floor(y0*.7))}},
 story:function(p){return 'Aim the launcher so the ball lands on the flag '+p.D+' m away and clears the '+p.wh+' m wall that stands '+p.wx+' m from the launcher.'},
 init:function(){return{a:45,v:15}},
 sim:function(s){var th=s.a*PI/180,vx=s.v*Math.cos(th),vy=s.v*Math.sin(th),T=2*vy/G;return{vx:vx,vy:vy,T:T,R:vx*T}},
 res:function(s,r,p){var yw=p.wx*Math.tan(s.a*PI/180)-G*p.wx*p.wx/(2*s.v*s.v*Math.cos(s.a*PI/180)*Math.cos(s.a*PI/180));return{a:s.a,v:s.v,R:r.R,yw:yw,wx:p.wx}},
 goals:function(p){return[{t:'Land within 1.5 m of the flag',ok:function(r){return Math.abs(r.R-p.D)<=1.5}},{t:'Clear the '+p.wh+' m wall',ok:function(r){return r.R>p.wx&&r.yw>p.wh}}]},
 cands:function(p){var o=[];for(var a=15;a<=75;a+=5)for(var v=5;v<=30;v++)o.push({a:a,v:v});return o},solveSeq:function(p){return D.shot.cands(p)},
 scene:function(s,p,r,tm){var xm=p.D*1.3,sc=Math.min(255/xm,5),X=function(x){return 20+x*sc},Y=function(y){return 150-y*sc},h='<rect x="0" y="150" width="300" height="20" fill="#cdd3dc"/>'+LN(0,150,300,150,'#7a8499',2)+'<rect x="'+(X(p.wx)-3)+'" y="'+Y(p.wh)+'" width="6" height="'+p.wh*sc+'" fill="'+OR+'"/>'+LN(X(p.D),150,X(p.D),126,'currentColor',2)+'<path d="M'+X(p.D)+' 126 l14 6 l-14 6z" fill="'+RD+'"/>'+TX(X(p.D),164,p.D+' m',{a:'middle',s:9});
  var k=4,ex=20+Math.cos(s.a*PI/180)*s.v*k*1.0,ey=150-Math.sin(s.a*PI/180)*s.v*k;
  if(r&&tm!==null){var t=Math.min(tm,r.T),bx=X(r.vx*t),by=Y(Math.max(0,r.vy*t-.5*G*t*t)),d='';for(var i=0;i<=Math.min(40,Math.floor(40*t/r.T));i++){var tt=r.T*i/40;if(tt>t)break;d+=(i?'L':'M')+X(r.vx*tt).toFixed(1)+' '+Y(Math.max(0,r.vy*tt-.5*G*tt*tt)).toFixed(1)}h+='<path d="'+d+'" fill="none" stroke="'+PU+'" stroke-width="2" stroke-dasharray="3 3" opacity=".6"/><circle cx="'+bx+'" cy="'+by+'" r="5" fill="'+PU+'"/>'}else h+='<circle cx="20" cy="150" r="5" fill="'+PU+'"/>';
  h+='<g data-hd="1" tabindex="0" role="slider" aria-label="Launch arrow: angle and speed" aria-valuetext="'+s.a+' degrees, '+s.v+' metres per second" style="cursor:grab">'+LN(20,150,ex,ey,GR,3)+'<circle cx="'+ex+'" cy="'+ey+'" r="9" fill="'+GR+'"/>'+TX(ex,ey+3,'',{})+'</g>'+TX(Math.min(ex+12,250),Math.max(ey-8,12),s.a+'° · '+s.v+' m/s',{s:9,c:GR});return h},
 drag:function(s,x,y){var dx=x-20,dy=150-y;if(dx<1)dx=1;if(dy<1)dy=1;var a=clamp(Math.round(Math.atan2(dy,dx)*180/PI/5)*5,15,75),v=clamp(Math.round(Math.sqrt(dx*dx+dy*dy)/4),5,30);if(a===s.a&&v===s.v)return false;s.a=a;s.v=v;return true},
 key:function(s,k){var a=s.a,v=s.v;if(k==='up')a+=5;if(k==='down')a-=5;if(k==='right')v++;if(k==='left')v--;a=clamp(a,15,75);v=clamp(v,5,30);if(a===s.a&&v===s.v)return false;s.a=a;s.v=v;return true},
 ctl:function(){return ''},click:function(){},
 dur:function(r){return r.T+.3},
 read:function(s,r){return r?'Angle <b>'+r.a+'°</b> · speed <b>'+r.v+' m/s</b> · landed <b>'+fm(r.R)+' m</b> away · <b>'+fm(r.yw)+' m</b> high at the wall':'Angle <b>'+s.a+'°</b> · speed <b>'+s.v+' m/s</b>. Drag the green arrow, then press Run.'},
 why:function(p,sv){var s=sv[0];return['Range = v² sin 2θ ÷ g sets where it lands.','Height at the wall: y = x tan θ − g x² ÷ (2 v² cos² θ). A steeper angle clears the wall but needs less speed for the same range.','One way: '+s.a+'° at '+s.v+' m/s.']}});
/* ---------- 3. Collision track: pick the mass of cart A, drag its speed arrow, run. ---------- */
def({id:'crash',t:'mom',l:3,ic:'🛒',
 gen:function(r){var k=pk(r,['stick','stick','send','stop']),mB=1+Math.floor(r()*4);if(k==='stick'){var m1=1+Math.floor(r()*5),v1=2+Math.floor(r()*9);return{k:k,mB:mB,T:rd(m1*v1/(m1+mB),1)}}if(k==='send'){var m1b=1+Math.floor(r()*5),v1b=2+Math.floor(r()*9);return{k:k,mB:mB,T:rd(2*m1b*v1b/(m1b+mB),1)}}return{k:k,mB:1+Math.floor(r()*5),T:pk(r,[4,6,8,10])}},
 story:function(p){return p.k==='stick'?'Cart B ('+p.mB+' kg) sits at rest. Cart A will hit it and they will stick together. Choose cart A\'s mass and speed so the pair moves off at '+p.T+' m/s.':p.k==='send'?'Cart B ('+p.mB+' kg) sits at rest. Cart A hits it in a perfectly bouncy collision. Make cart B shoot away at '+p.T+' m/s.':'Cart B ('+p.mB+' kg) sits at rest. Cart A hits it in a perfectly bouncy collision. Make cart A stop dead, and send cart B away at at least '+p.T+' m/s.'},
 init:function(){return{m:2,v:5}},
 sim:function(s,p){var m1=s.m,m2=p.mB,v1=s.v,e=p.k!=='stick',a,b;if(!e){a=b=m1*v1/(m1+m2)}else{a=(m1-m2)/(m1+m2)*v1;b=2*m1/(m1+m2)*v1}return{a:a,b:b,v1:v1,m1:m1}},
 res:function(s,r){return r},
 goals:function(p){if(p.k==='stick')return[{t:'Pair moves off at '+p.T+' m/s (within 0.2)',ok:function(r){return Math.abs(r.b-p.T)<=.2}}];if(p.k==='send')return[{t:'Cart B leaves at '+p.T+' m/s (within 0.3)',ok:function(r){return Math.abs(r.b-p.T)<=.3}}];return[{t:'Cart A stops dead',ok:function(r){return Math.abs(r.a)<.05}},{t:'Cart B leaves at '+p.T+' m/s or more',ok:function(r){return r.b>=p.T-.05}}]},
 cands:function(p){var o=[];for(var m=1;m<=5;m++)for(var v=1;v<=10;v++)o.push({m:m,v:v});return o},solveSeq:function(p){return D.crash.cands(p)},
 scene:function(s,p,r,tm){var u=30,w1=12+s.m*6,w2=12+p.mB*6,gx=Math.max(110,60+w1),x1=20,x2=gx+90,hit=r?(x2-(x1+w1))/(u*r.v1):0,h='<rect x="0" y="130" width="300" height="40" fill="#cdd3dc"/>'+LN(0,130,300,130,'#7a8499',2),ax=x1,bx=x2;
  if(r&&tm!==null){if(tm<hit)ax=x1+u*r.v1*tm;else{var t2=tm-hit;ax=x1+(x2-(x1+w1))+u*r.a*t2;bx=x2+u*r.b*t2;if(p.k==='stick'){ax=x1+(x2-(x1+w1))+u*r.a*t2;bx=ax+w1}}}
  h+='<rect x="'+ax+'" y="'+(130-26)+'" width="'+w1+'" height="22" rx="4" fill="'+PU+'"/>'+TX(ax+w1/2,130-11,s.m+' kg',{s:9,a:'middle',c:'#fff'})+'<rect x="'+bx+'" y="'+(130-26)+'" width="'+w2+'" height="22" rx="4" fill="'+OR+'"/>'+TX(bx+w2/2,130-11,p.mB+' kg',{s:9,a:'middle',c:'#fff'})+'<circle cx="'+(ax+8)+'" cy="130" r="4" fill="#333"/><circle cx="'+(ax+w1-8)+'" cy="130" r="4" fill="#333"/><circle cx="'+(bx+8)+'" cy="130" r="4" fill="#333"/><circle cx="'+(bx+w2-8)+'" cy="130" r="4" fill="#333"/>';
  if(!r||tm===null||tm<hit){var al=u*s.v;h+='<g data-hd="1" tabindex="0" role="slider" aria-label="Cart A speed in metres per second" aria-valuemin="1" aria-valuemax="10" aria-valuenow="'+s.v+'" style="cursor:ew-resize">'+LN(x1+w1/2,100,x1+w1/2+Math.min(al,170),100,GR,3)+'<circle cx="'+(x1+w1/2+Math.min(al,170))+'" cy="100" r="9" fill="'+GR+'"/></g>'+TX(x1+w1/2,92,'A speed '+s.v+' m/s',{s:9,c:GR})}
  else if(tm>=hit){h+=TX(150,50,'A '+fm(r.a)+' m/s · B '+fm(r.b)+' m/s',{s:11,a:'middle',c:RD})}return h},
 drag:function(s,x){var v=clamp(Math.round((x-(20+(12+s.m*6)/2))/30),1,10);if(v===s.v)return false;s.v=v;return true},key:function(s,k){var v=clamp(s.v+(k==='right'||k==='up'?1:k==='left'||k==='down'?-1:0),1,10);if(v===s.v)return false;s.v=v;return true},
 ctl:function(s){var h='<span class="small mute">Cart A mass:</span> ';for(var m=1;m<=5;m++)h+='<button type="button" class="chip'+(s.m===m?' on':'')+'" data-sbx="m:'+m+'" aria-pressed="'+(s.m===m)+'">'+m+' kg</button> ';return h},
 click:function(s,k,v){if(k==='m')s.m=+v},
 dur:function(r){return 3.2},
 read:function(s,r){return r?'Cart A '+r.m1+' kg at '+r.v1+' m/s · after: cart A <b>'+fm(r.a)+' m/s</b>, cart B <b>'+fm(r.b)+' m/s</b>':'Cart A: <b>'+s.m+' kg</b> at <b>'+s.v+' m/s</b>. Pick a mass, drag the arrow, then press Run.'},
 why:function(p,sv){var s=sv[0];var l=p.k==='stick'?['Sticking together: momentum is conserved, so m₁ v₁ = (m₁ + m₂) v.','v = m₁ v₁ ÷ (m₁ + '+p.mB+').']:['Bouncy collision: momentum and kinetic energy are both conserved.','Cart B leaves at 2 m₁ v₁ ÷ (m₁ + m₂). Cart A stops only when the masses are equal.'];return l.concat(['One way: cart A '+s.m+' kg at '+s.v+' m/s.'])}});
/* ---------- engine ---------- */
function tpl(it){return D[it.q.sbx.id]}
function lastRes(it){return it.runs&&it.runs.length?it.runs[it.runs.length-1]:null}
function metAll(it){var tp=tpl(it),p=it.q.sbx.p,gs=tp.goals(p);return it.runs&&it.runs.some(function(r){return gs.every(function(g){return g.ok(r,it.runs)})})}
function goalsHTML(it){var tp=tpl(it),p=it.q.sbx.p,l=lastRes(it);return tp.goals(p).map(function(g){var ok=l?g.ok(l,it.runs):false;return '<li class="'+(ok?'ok':'')+'"><span aria-hidden="true">'+(ok?'✓':'○')+'</span> '+g.t+'<span class="sr-only">'+(ok?' (met)':' (not met yet)')+'</span></li>'}).join('')}
function runOf(tp,s,p){var rs=tp.sim(s,p);return{rs:rs,res:tp.res(s,rs,p)}}
IT.sbx={init:function(it){var tp=tpl(it);it.s=tp.init(it.q.sbx.p);it.runs=[];it.sim=null;it.busy=false},
 render:function(it,rev){var q=it.q,tp=tpl(it),p=q.sbx.p,l=lastRes(it),h='<div class="itx bld sbx"><div class="figw"><svg id="sbxs" viewBox="0 0 300 170" role="group" aria-label="'+esc(tp.id)+' demo" style="max-width:360px;width:100%;touch-action:none;background:var(--surface,#fff);border:1px solid var(--line);border-radius:12px">'+tp.scene(it.s,p,it.sim&&it.sim.rs,null)+'</svg></div><div class="labr" id="sbxr" aria-live="polite">'+tp.read(it.s,l)+'</div><ul class="labg" id="sbxg" aria-label="Goals">'+goalsHTML(it)+'</ul><div class="row sbxc" id="sbxc">'+tp.ctl(it.s,p)+'</div>';
  if(!rev)h+='<div class="row"><button type="button" class="btn sm" data-sbx="run">Run</button><button type="button" class="btn sec sm" data-sbx="reset">Reset</button></div><div class="small mute">Set it up, press Run, and watch. Change one thing at a time. Press Check when every goal has a tick.</div>';
  else h+='<div class="simo">'+(it.ok?'Every goal is met.':'One way to meet them: '+q.sbx.sv.map(function(x){return Object.keys(x).map(function(k){return k+' '+x[k]}).join(', ')}).join(' then ')+'.')+'</div>';return h+'</div>'},
 ok:function(it){return metAll(it)},done:function(it){return it.runs&&it.runs.length>0},
 ans:function(q){return q.sbx.sv.map(function(x){return Object.keys(x).map(function(k){return k+' '+x[k]}).join(', ')}).join(' then ')}};
function cur(){var it=Z&&!Z.fin&&Z.steps&&Z.steps[Z.i]&&Z.steps[Z.i].it;return it&&it.q.type==='sbx'&&!it.done?it:null}
function refresh(it,tm){var tp=tpl(it),p=it.q.sbx.p,sv=document.getElementById('sbxs');if(sv)sv.innerHTML=tp.scene(it.s,p,it.sim&&it.sim.rs,tm===undefined?null:tm);var r=document.getElementById('sbxr');if(r)r.innerHTML=tp.read(it.s,tm!==undefined&&tm!==null&&it.sim&&tm<tp.dur(it.sim.rs)?null:lastRes(it));var g=document.getElementById('sbxg');if(g)g.innerHTML=goalsHTML(it);var c=document.getElementById('sbxc');if(c)c.innerHTML=tp.ctl(it.s,it.q.sbx.p);if(window.itEnable)itEnable()}
function doRun(it){if(it.busy)return;var tp=tpl(it),p=it.q.sbx.p,o=runOf(tp,it.s,p);it.sim=o;it.runs.push(o.res);var du=tp.dur(o.rs),t0=null;window.sfx&&sfx('tick');
 if(A11&&A11.rm){refresh(it,du);return}it.busy=true;var b=document.querySelector('[data-sbx="run"]');if(b)b.disabled=true;
 (function f(ts){if(!cur()||cur()!==it){it.busy=false;return}if(t0===null)t0=ts;var tm=(ts-t0)/1000;if(tm>=du){it.busy=false;if(b)b.disabled=false;refresh(it,du);if(metAll(it)&&!it.met){it.met=true;window.sfx&&sfx('ok')}return}var sv=document.getElementById('sbxs');if(sv)sv.innerHTML=tp.scene(it.s,p,o.rs,tm);requestAnimationFrame(f)})(performance.now())}
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-sbx]');if(!b)return;var it=cur();if(!it||it.busy)return;var k=b.dataset.sbx,tp=tpl(it);
 if(k==='run'){doRun(it);return}if(k==='reset'){IT.sbx.init(it);drawSess();if(window.itEnable)itEnable();return}var a=k.split(':');tp.click(it.s,a[0],a[1]);it.sim=null;refresh(it)});
var dragging=null;
function pt(e,svg){var r=svg.getBoundingClientRect();return[(e.clientX-r.left)*300/r.width,(e.clientY-r.top)*170/r.height]}
document.addEventListener('pointerdown',function(e){var h=e.target.closest&&e.target.closest('[data-hd]');if(!h)return;var it=cur();if(!it||it.busy)return;dragging=it;try{h.setPointerCapture(e.pointerId)}catch(x){}e.preventDefault()});
document.addEventListener('pointermove',function(e){if(!dragging)return;var it=cur();if(!it||it!==dragging){dragging=null;return}var svg=document.getElementById('sbxs');if(!svg)return;var p=pt(e,svg);if(tpl(it).drag(it.s,p[0],p[1],it.q.sbx.p)){it.sim=null;var sv=svg;sv.innerHTML=tpl(it).scene(it.s,it.q.sbx.p,null,null);var r=document.getElementById('sbxr');if(r)r.innerHTML=tpl(it).read(it.s,null)}});
document.addEventListener('pointerup',function(){dragging=null});
document.addEventListener('keydown',function(e){var h=e.target.closest&&e.target.closest('[data-hd]');if(!h)return;var it=cur();if(!it||it.busy)return;var m={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right'}[e.key];if(!m)return;e.preventDefault();if(tpl(it).key(it.s,m)){it.sim=null;refresh(it);var n=document.querySelector('#sbxs [data-hd]');if(n)n.focus()}});
/* verified generation: 10 per demo, each must be solvable by brute force */
function solve(tp,p){var seq=tp.solveSeq(p),i,st;if(p.k==='cmp'){var hh=Math.max(p.H,5);var runs=[];var okAll=true;seq.forEach(function(s){runs.push(tp.res(s,tp.sim(s,p),p))});var gs=tp.goals(p);return gs.every(function(g){return g.ok(runs[runs.length-1],runs)})?seq:null}
 for(i=0;i<seq.length;i++){var r=tp.res(seq[i],tp.sim(seq[i],p),p);if(tp.goals(p).every(function(g){return g.ok(r,[r])}))return[seq[i]]}return null}
Object.keys(D).forEach(function(k){var tp=D[k],seen={};for(var i=0;i<10;i++){var id='sbx-'+tp.id+'-'+(i<9?'0':'')+(i+1),p=null,sv=null,tries=0;if(QI[id]!==undefined)continue;
 while(!sv&&tries<14){p=tp.gen(mul(hs(PKID+tp.id+i+'s'+tries)));tries++;if(!p||seen[JSON.stringify(p)]){p=null;continue}sv=solve(tp,p)}
 if(!sv)continue;seen[JSON.stringify(p)]=1;var st=tp.why(p,sv);
 QS.push({id:id,t:tp.t,l:tp.l,type:'sbx',ic:tp.ic,q:tp.story(p),sbx:{id:tp.id,p:p,sv:sv},sol:st,w:st[st.length-1],fp:'sbx-'+tp.id,cp:1,bld:1});QI[id]=QS.length-1}});
window.__sbxSolve=function(it){var tp=tpl(it),p=it.q.sbx.p;it.s=tp.init(p);it.runs=[];it.q.sbx.sv.forEach(function(s){it.s=Object.assign({},s);it.runs.push(tp.res(it.s,tp.sim(it.s,p),p))})};
})();
