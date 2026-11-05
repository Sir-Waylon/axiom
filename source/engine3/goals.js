/* ===== goal labs: a live sandbox with a goal, in the style of "tinker until the goal is met".
   Every slider updates the scene at once. Goals show a tick when met. The first Check is the answer.
   Problems are seeded (10 per lab) and every one is verified solvable by brute force before it is added. ===== */
(function(){
function mul(a){return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function hs(s){var h=2166136261;s=String(s);for(var i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function pk(r,a){return a[Math.floor(r()*a.length)]}
function rd(v,d){return +v.toFixed(d===undefined?2:d)}
function sg(x){return String(x).replace('-','−')}
function fm(x,d){return sg(rd(x,d===undefined?1:d))}
var G=9.8,PI=Math.PI;
function SV(body,lab,h){return '<svg viewBox="0 0 300 '+(h||170)+'" role="img" aria-label="'+lab+'" style="max-width:340px;width:100%;background:var(--surface,#fff);border:1px solid var(--line);border-radius:12px">'+body+'</svg>'}
function TX(x,y,t,o){o=o||{};return '<text x="'+x+'" y="'+y+'" font-size="'+(o.s||10)+'" font-weight="'+(o.w||700)+'" text-anchor="'+(o.a||'start')+'" fill="'+(o.c||'currentColor')+'">'+t+'</text>'}
function LN(x1,y1,x2,y2,c,w,d){return '<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="'+(c||'currentColor')+'" stroke-width="'+(w||1.5)+'"'+(d?' stroke-dasharray="'+d+'"':'')+'/>'}
function RC(x,y,w,h,f,s,r){return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+(r||3)+'" fill="'+(f||'none')+'" stroke="'+(s||'currentColor')+'" stroke-width="1.8"/>'}
function CI(x,y,r,f,s){return '<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+(f||'none')+'" stroke="'+(s||'currentColor')+'" stroke-width="1.8"/>'}
function PA(d,s,w,f,dash){return '<path d="'+d+'" fill="'+(f||'none')+'" stroke="'+(s||'#5b4bff')+'" stroke-width="'+(w||2.5)+'"'+(dash?' stroke-dasharray="'+dash+'"':'')+'/>'}
var PU='#5b4bff',OR='#e08a00',GR='#0b8f6a',RD='#d6336c',BL='#2a7de1';
var LAB={};function add(pack,tp){(LAB[pack]=LAB[pack]||[]).push(tp)}
window.__labAdd=add;window.__labKit={mul:mul,hs:hs,pk:pk,rd:rd,sg:sg,fm:fm,SV:SV,TX:TX,LN:LN,RC:RC,CI:CI,PA:PA,PU:PU,OR:OR,GR:GR,RD:RD,BL:BL,G:G};

/* ---------- Quanta: its own set of labs (physics and electronics), not shared with the circuit-event trainer ---------- */
add('quanta-physics',{id:'proj',t:'kin',l:3,ic:'🏹',cp:1,
 gen:function(r){var a0=pk(r,[30,35,40,45,50,55,60]),v0=12+Math.floor(r()*15),th=a0*PI/180,D=Math.round(v0*v0*Math.sin(2*th)/G);if(D<15)return null;var wx=Math.round(D*pk(r,[.4,.5,.6])),y0=wx*Math.tan(th)-G*wx*wx/(2*v0*v0*Math.cos(th)*Math.cos(th));return{D:D,wx:wx,wh:Math.max(1,Math.floor(y0*.7))}},
 story:function(p){return 'Launch the ball so it lands on the flag '+p.D+' m away and clears the '+p.wh+' m wall that stands '+p.wx+' m from the launcher.'},
 params:function(){return[{n:'a',l:'Launch angle',min:15,max:75,step:5,s:45,u:'°'},{n:'v',l:'Launch speed',min:5,max:30,step:1,s:15,u:' m/s'}]},
 model:function(v,p){var th=v.a*PI/180,R=v.v*v.v*Math.sin(2*th)/G,pkh=Math.pow(v.v*Math.sin(th),2)/(2*G),yw=p.wx*Math.tan(th)-G*p.wx*p.wx/(2*v.v*v.v*Math.cos(th)*Math.cos(th));return{R:R,pk:pkh,yw:yw,t:2*v.v*Math.sin(th)/G}},
 goals:function(p){return[{t:'Land within 1.5 m of the flag',ok:function(o){return Math.abs(o.R-p.D)<=1.5}},{t:'Clear the '+p.wh+' m wall',ok:function(o){return o.R>p.wx&&o.yw>p.wh}}]},
 draw:function(v,o,p){var xm=Math.max(p.D*1.2,Math.min(o.R,p.D*2.2)),ym=Math.max(o.pk,p.wh+1,6),sc=Math.min(270/xm,125/ym),X=function(x){return 15+x*sc},Y=function(y){return 150-y*sc},th=v.a*PI/180,d='',i,x,y;
  for(i=0;i<=80;i++){x=o.R*i/80;if(x>xm)break;y=x*Math.tan(th)-G*x*x/(2*v.v*v.v*Math.cos(th)*Math.cos(th));d+=(i?'L':'M')+X(x).toFixed(1)+' '+Y(Math.max(0,y)).toFixed(1)}
  return SV(LN(8,150,292,150,null,2)+RC(X(p.wx)-3,Y(p.wh),6,p.wh*sc,'#e08a00','#e08a00',1)+LN(X(p.D),150,X(p.D),128,'currentColor',2)+'<path d="M'+X(p.D)+' 128 l14 6 l-14 6z" fill="#d6336c"/>'+PA(d,PU)+CI(X(0),150,5,PU,PU)+TX(X(p.D),164,p.D+' m',{a:'middle'}),'Ball trajectory with wall and flag')},
 read:function(v,o){return 'Range <b>'+fm(o.R)+' m</b> · peak <b>'+fm(o.pk)+' m</b> · height at the wall <b>'+fm(o.yw)+' m</b>'},
 why:function(p,s){return['Range = v² sin 2θ ÷ g sets where it lands.','Height at the wall: y = x tan θ − g x² ÷ (2 v² cos² θ). Higher angles clear the wall but need more speed for the same range.','One way: '+s.a+'° at '+s.v+' m/s.']}});

add('quanta-physics',{id:'coast',t:'nrg',l:3,ic:'🎢',cp:1,
 gen:function(r){var Rm=pk(r,[3,4,5,6]),Hm=2.5*Rm+pk(r,[3,4,5,6]);return{Rm:Rm,vmax:Math.ceil(Math.sqrt(2*G*Hm))}},
 story:function(p){return 'Design a roller coaster. The loop must be at least '+p.Rm+' m in radius, the car must not fall off at the top, and it may not exceed '+p.vmax+' m/s at the bottom.'},
 params:function(){return[{n:'H',l:'Start height',min:4,max:40,step:1,s:10,u:' m'},{n:'R',l:'Loop radius',min:2,max:8,step:1,s:3,u:' m'}]},
 model:function(v){var vt2=2*G*(v.H-2*v.R);return{vb:Math.sqrt(2*G*v.H),vt:vt2>0?Math.sqrt(vt2):0,need:Math.sqrt(G*v.R),ok:vt2>=G*v.R}},
 goals:function(p){return[{t:'Loop radius at least '+p.Rm+' m',ok:function(o,v){return v.R>=p.Rm}},{t:'Car stays on the track at the top of the loop',ok:function(o){return o.ok}},{t:'Bottom speed at most '+p.vmax+' m/s',ok:function(o){return o.vb<=p.vmax}}]},
 draw:function(v,o){var sc=130/Math.max(v.H,2*v.R,10),Y=function(y){return 150-y*sc},cx=215,cy=150-v.R*sc;
  return SV(LN(8,150,292,150,null,2)+PA('M20 '+Y(v.H).toFixed(1)+' Q70 150 130 150',PU,3)+CI(cx,cy,v.R*sc,'none',PU)+LN(130,150,cx-4,150,PU,3)+CI(24,Y(v.H)-5,5,OR,OR)+CI(cx,cy-v.R*sc-6,6,o.ok?'#12935f':'#d6336c','#fff')+TX(24,Y(v.H)-14,v.H+' m'),'Roller coaster hill and loop')},
 read:function(v,o){return 'Bottom speed <b>'+fm(o.vb)+' m/s</b> · top-of-loop speed <b>'+fm(o.vt)+' m/s</b> (needs at least '+fm(o.need)+')'},
 why:function(p,s){return['Energy: ½mv² at the bottom = mgH, so v = √(2gH).','At the top of the loop the car needs v² ≥ gR. With energy, that means H ≥ 2.5 R.','One way: start height '+s.H+' m with a '+s.R+' m loop.']}});

add('quanta-physics',{id:'cart',t:'mom',l:3,ic:'🛒',cp:1,
 gen:function(r){var mB=pk(r,[2,3,4,5]),mA=1+Math.floor(r()*6),vA=2+Math.floor(r()*7),e=pk(r,[0,.5,1]),vB=(1+e)*mA*vA/(mA+mB),vAp=(mA-e*mB)*vA/(mA+mB),c=vAp<-.05?'back':vAp>.05?'fwd':null;if(!c||vB>14)return null;return{mB:mB,vBt:rd(vB,1),c:c}},
 story:function(p){return 'Cart A rolls into cart B ('+p.mB+' kg, at rest). Choose A’s mass, A’s speed and how bouncy the bumpers are so that B leaves at '+p.vBt+' m/s and A '+(p.c==='back'?'bounces backward':'keeps rolling forward')+'.'},
 params:function(){return[{n:'mA',l:'Cart A mass',min:1,max:6,step:1,s:2,u:' kg'},{n:'vA',l:'Cart A speed',min:1,max:8,step:1,s:4,u:' m/s'},{n:'e',l:'Bounciness (0 sticks, 1 bounces)',min:0,max:1,step:.25,s:0,u:''}]},
 model:function(v,p){return{vB:(1+v.e)*v.mA*v.vA/(v.mA+p.mB),vA:(v.mA-v.e*p.mB)*v.vA/(v.mA+p.mB)}},
 goals:function(p){return[{t:'Cart B leaves at '+p.vBt+' m/s (±0.15)',ok:function(o){return Math.abs(o.vB-p.vBt)<=.15}},{t:p.c==='back'?'Cart A rebounds backward':'Cart A keeps rolling forward',ok:function(o){return p.c==='back'?o.vA<-.05:o.vA>.05}}]},
 draw:function(v,o,p){function row(y,a,b,lb){var wa=14+v.mA*5,wb=14+p.mB*5;return TX(8,y-14,lb,{s:9})+RC(40,y-12,wa,18,'#dfe8ff',PU)+RC(190,y-12,wb,18,'#ffe8c9',OR)+TX(40+wa/2,y,'A',{a:'middle'})+TX(190+wb/2,y,'B',{a:'middle'})+(a?LN(40+wa/2,y+14,40+wa/2+a*8,y+14,PU,3):'')+(b?LN(190+wb/2,y+14,190+wb/2+b*8,y+14,OR,3):'')}
  return SV(LN(8,60,292,60,null,2)+row(55,v.vA,0,'Before')+LN(8,140,292,140,null,2)+row(135,o.vA,o.vB,'After'),'Carts before and after the collision')},
 read:function(v,o){return 'After: A moves at <b>'+fm(o.vA)+' m/s</b>, B at <b>'+fm(o.vB)+' m/s</b>'},
 why:function(p,s){return['Momentum is conserved: mA vA = mA vA′ + mB vB′.','With bounciness e: vB′ = (1+e) mA vA ÷ (mA + mB). A heavier cart A sends B faster; e = 1 conserves energy too.','One way: '+s.mA+' kg at '+s.vA+' m/s, bounciness '+s.e+'.']}});

add('quanta-physics',{id:'str',t:'wav',l:3,ic:'🎸',cp:1,
 gen:function(r){var L=pk(r,[.6,.8,1,1.2,1.5]),mu=pk(r,[.004,.006,.01,.016]),nm=pk(r,[2,3]),n0=1+Math.floor(r()*nm),T0=20+5*Math.floor(r()*37),f0=n0/(2*L)*Math.sqrt(T0/mu);if(f0<80||f0>900)return null;return{L:L,mu:mu,nm:nm,fT:Math.round(f0)}},
 story:function(p){return 'A '+p.L+' m string with mass '+p.mu*1000+' g per metre must sound at '+p.fT+' Hz while vibrating in no more than '+p.nm+' loops. Set the tension and the number of loops.'},
 params:function(){return[{n:'T',l:'Tension',min:10,max:200,step:5,s:50,u:' N'},{n:'n',l:'Loops (antinodes)',min:1,max:6,step:1,s:1,u:''}]},
 model:function(v,p){var vel=Math.sqrt(v.T/p.mu);return{vel:vel,f:v.n/(2*p.L)*vel,lam:2*p.L/v.n}},
 goals:function(p){return[{t:'Frequency '+p.fT+' Hz (within 3%)',ok:function(o){return Math.abs(o.f-p.fT)/p.fT<=.03}},{t:'Use at most '+p.nm+' loops',ok:function(o,v){return v.n<=p.nm}}]},
 draw:function(v){var d='',d2='',x,i;for(i=0;i<=120;i++){x=i/120;d+=(i?'L':'M')+(30+x*240).toFixed(1)+' '+(85-38*Math.sin(v.n*PI*x)).toFixed(1);d2+=(i?'L':'M')+(30+x*240).toFixed(1)+' '+(85+38*Math.sin(v.n*PI*x)).toFixed(1)}
  return SV(RC(22,60,8,50,'currentColor')+RC(270,60,8,50,'currentColor')+PA(d,PU,3)+PA(d2,PU,1.5,'none','4 3')+TX(150,160,v.n+(v.n===1?' loop':' loops'),{a:'middle'}),'Vibrating string')},
 read:function(v,o){return 'Wave speed <b>'+fm(o.vel,0)+' m/s</b> · wavelength <b>'+fm(o.lam,2)+' m</b> · frequency <b>'+fm(o.f,0)+' Hz</b>'},
 why:function(p,s){return['Wave speed v = √(T ÷ μ).','Standing wave: f = n v ÷ (2L).','One way: '+s.T+' N with '+s.n+' loop'+(s.n>1?'s':'')+'.']}});

add('quanta-physics',{id:'lens',t:'opt',l:3,ic:'🔍',cp:1,
 gen:function(r){var f0=6+Math.floor(r()*15),M=pk(r,[.5,1,1.5,2,3]),d0=Math.round(f0*(1+1/M));if(d0<8||d0>60||d0<=f0)return null;var m0=f0/(d0-f0),di=f0*d0/(d0-f0);return{M:rd(m0,1),S:Math.max(30,Math.ceil(di/10)*10+10)}},
 story:function(p){return 'Project a sharp, upside-down image '+p.M+' times the size of the object onto a screen no more than '+p.S+' cm from the lens. Move the object and choose the lens.'},
 params:function(){return[{n:'d',l:'Object distance',min:8,max:60,step:1,s:30,u:' cm'},{n:'f',l:'Lens focal length',min:5,max:25,step:1,s:10,u:' cm'}]},
 model:function(v){if(v.d<=v.f+.001)return{real:false,m:v.f/(v.f-v.d+1e-9)};var di=v.f*v.d/(v.d-v.f);return{real:true,di:di,m:v.f/(v.d-v.f)}},
 goals:function(p){return[{t:'Real, upside-down image (object beyond the focal point)',ok:function(o){return o.real}},{t:'Image '+p.M+'× the object (±0.15)',ok:function(o){return o.real&&Math.abs(o.m-p.M)<=.15}},{t:'Screen within '+p.S+' cm',ok:function(o){return o.real&&o.di<=p.S}}]},
 draw:function(v,o){var sc=1.4,xo=Math.max(8,150-v.d*sc),b=LN(8,85,292,85,null,1)+LN(150,20,150,150,PU,3)+'<path d="M150 18 l-6 8 h12z M150 152 l-6 -8 h12z" fill="'+PU+'"/>'+CI(150-v.f*sc,85,2.5,OR,OR)+CI(150+v.f*sc,85,2.5,OR,OR)+LN(xo,85,xo,55,BL,3)+TX(xo,48,'object',{a:'middle',c:BL});
  if(o.real){var xi=Math.min(285,150+o.di*sc),h=Math.min(55,30*o.m);b+=LN(xi,85,xi,85+h,RD,3)+LN(xo,55,150,55,GR,1.2)+LN(150,55,xi,85+h,GR,1.2)+LN(xo,55,xi,85+h,OR,1.2)+TX(xi,85+h+12,'image',{a:'middle',c:RD})}else b+=TX(150,130,'No screen image: object is inside the focal length',{a:'middle',c:RD});
  return SV(b,'Lens with object and image')},
 read:function(v,o){return o.real?'Image distance <b>'+fm(o.di,0)+' cm</b> · magnification <b>'+fm(o.m,2)+'×</b>':'The rays spread apart, so no image lands on a screen.'},
 why:function(p,s){return['Thin lens: 1/f = 1/d + 1/d′, so d′ = f d ÷ (d − f).','Magnification = d′ ÷ d = f ÷ (d − f).','One way: f = '+s.f+' cm with the object at '+s.d+' cm.']}});

add('quanta-physics',{id:'mix',t:'thm',l:3,ic:'🛁',cp:1,
 gen:function(r){var mc=pk(r,[150,200,250]),Tc=pk(r,[10,15,20]),cap=pk(r,[200,250,300,350]),mh=20+10*Math.floor(r()*Math.floor(cap/10)),Th=40+5*Math.floor(r()*13),T=(mc*Tc+mh*Th)/(mc+mh),Tt=Math.round(T);if(Tt<30||Tt>60)return null;return{mc:mc,Tc:Tc,cap:cap,Tt:Tt}},
 story:function(p){return 'Fill a bath for a child: '+p.mc+' g of '+p.Tc+' °C water is already in the tub. Add hot water so the mix ends at '+p.Tt+' °C. You have only '+p.cap+' g of hot water.'},
 params:function(){return[{n:'m',l:'Hot water mass',min:20,max:500,step:10,s:100,u:' g'},{n:'T',l:'Hot water temperature',min:40,max:100,step:5,s:80,u:' °C'}]},
 model:function(v,p){return{T:(p.mc*p.Tc+v.m*v.T)/(p.mc+v.m)}},
 goals:function(p){return[{t:'Mixture ends at '+p.Tt+' °C (±1)',ok:function(o){return Math.abs(o.T-p.Tt)<=1}},{t:'Use at most '+p.cap+' g of hot water',ok:function(o,v){return v.m<=p.cap}}]},
 draw:function(v,o,p){function bk(x,m,t,c,l){var h=Math.max(8,m/500*90);return RC(x,130-90,50,90,'none')+RC(x,130-h,50,h,c,'currentColor',2)+TX(x+25,146,l,{a:'middle',s:9})+TX(x+25,130-h-4,Math.round(t)+'°',{a:'middle'})}
  var col=function(t){return t>60?'#ff9a5a':t>40?'#ffd27a':'#9cc8ff'};return SV(bk(30,p.mc,p.Tc,col(p.Tc),'in tub')+bk(120,v.m,v.T,col(v.T),'hot')+TX(105,95,'+',{s:18})+bk(220,p.mc+v.m>500?500:p.mc+v.m,o.T,col(o.T),'mixed'),'Cold, hot and mixed water')},
 read:function(v,o){return 'Mixture temperature <b>'+fm(o.T)+' °C</b>'},
 why:function(p,s){return['Heat lost by hot water = heat gained by cold water.','T = (m₁T₁ + m₂T₂) ÷ (m₁ + m₂), because the specific heat cancels.','One way: '+s.m+' g at '+s.T+' °C.']}});

add('quanta-physics',{id:'fld',t:'est',l:3,ic:'⚡',cp:1,
 gen:function(r){var X0=pk(r,[.4,.8]),q1=X0===.4?pk(r,[1,2,3,4,5]):pk(r,[4,8,12,16,20]);return{D:1.2,X0:X0,q1:q1}},
 story:function(p){return 'Charge 1 is '+p.q1+' µC. Charge 2 sits '+p.D+' m away. Choose charge 2 and place the probe so the electric field is zero exactly at the marked spot, '+p.X0+' m from charge 1.'},
 params:function(){return[{n:'q',l:'Charge 2',min:1,max:20,step:1,s:4,u:' µC'},{n:'x',l:'Probe position from charge 1',min:.1,max:1.1,step:.1,s:.6,u:' m'}]},
 model:function(v,p){var k=9e9,E1=k*p.q1*1e-6/(v.x*v.x),E2=k*v.q*1e-6/((p.D-v.x)*(p.D-v.x));return{E1:E1,E2:E2}},
 goals:function(p){return[{t:'Field at the probe is zero (within 3%)',ok:function(o){return Math.abs(o.E1-o.E2)<=.03*o.E1}},{t:'Probe is on the marked spot ('+p.X0+' m)',ok:function(o,v){return Math.abs(v.x-p.X0)<.05}}]},
 draw:function(v,o,p){var X=function(x){return 30+x/p.D*240},m=Math.max(o.E1,o.E2),l1=60*o.E1/m,l2=60*o.E2/m;
  return SV(LN(30,95,270,95,null,1.5)+CI(30,95,8+Math.sqrt(p.q1)*2,'#ffd0d8',RD)+TX(30,130,'+'+p.q1+' µC',{a:'middle'})+CI(270,95,8+Math.sqrt(v.q)*2,'#ffd0d8',RD)+TX(270,130,'+'+v.q+' µC',{a:'middle'})+LN(X(p.X0),80,X(p.X0),110,OR,2,'3 3')+TX(X(p.X0),72,'goal',{a:'middle',c:OR})+'<path d="M'+X(v.x)+' 95 l-6 12 h12z" fill="'+PU+'"/>'+LN(X(v.x),70,X(v.x)+l1,70,RD,3)+LN(X(v.x),52,X(v.x)-l2,52,BL,3)+TX(X(v.x)+l1+4,73,'from 1',{c:RD})+TX(X(v.x)-l2-4,55,'from 2',{c:BL,a:'end'}),'Two charges and a probe')},
 read:function(v,o){return 'Field from charge 1 <b>'+(o.E1/1e3).toFixed(0)+' kN/C</b> pushes right; from charge 2 <b>'+(o.E2/1e3).toFixed(0)+' kN/C</b> pushes left'},
 why:function(p,s){return['Each charge makes a field E = k q ÷ r². The probe is balanced when the two fields are equal and opposite.','q₁ ÷ x² = q₂ ÷ (D − x)², so q₂ = q₁ (D − x)² ÷ x².','One way: charge 2 = '+s.q+' µC with the probe at '+s.x+' m.']}});

add('quanta-physics',{id:'rc',t:'rc',l:3,ic:'⏲️',cp:1,
 gen:function(r){var V=pk(r,[5,9,12]),R0=pk(r,[2,5,10,20,47]),C0=pk(r,[2,5,10,22,47,100]),tau=R0*C0;if(tau<20||tau>2000)return null;return{V:V,tau:tau,Imax:Math.ceil(V/R0*1.25*10)/10}},
 story:function(p){return 'A '+p.V+' V supply charges a capacitor through a resistor. The timer needs a time constant of '+p.tau+' ms, but the supply can give at most '+p.Imax+' mA at the start. Choose R and C.'},
 params:function(){return[{n:'R',l:'Resistor',min:1,max:100,step:1,s:10,u:' kΩ'},{n:'C',l:'Capacitor',min:1,max:100,step:1,s:10,u:' µF'}]},
 model:function(v,p){return{tau:v.R*v.C,I0:p.V/v.R}},
 goals:function(p){return[{t:'Time constant '+p.tau+' ms (±5%)',ok:function(o){return Math.abs(o.tau-p.tau)/p.tau<=.05}},{t:'Starting current at most '+p.Imax+' mA',ok:function(o){return o.I0<=p.Imax+1e-9}}]},
 draw:function(v,o,p){var T=3*p.tau,X=function(t){return 25+t/T*260},Y=function(y){return 140-y/p.V*110},d='',i,t;for(i=0;i<=90;i++){t=T*i/90;d+=(i?'L':'M')+X(t).toFixed(1)+' '+Y(p.V*(1-Math.exp(-t/o.tau))).toFixed(1)}
  return SV(LN(25,140,290,140,null,1.5)+LN(25,20,25,140,null,1.5)+LN(25,Y(.632*p.V),290,Y(.632*p.V),'#8a8fb0',1,'4 3')+LN(X(p.tau),20,X(p.tau),140,OR,1.5,'4 3')+TX(X(p.tau),160,'goal τ',{a:'middle',c:OR})+TX(28,Y(.632*p.V)-3,'63%',{c:'#6b7090'})+PA(d,PU,3)+TX(285,155,'time',{a:'end',s:9}),'Capacitor charging curve')},
 read:function(v,o){return 'τ = R × C = <b>'+fm(o.tau,0)+' ms</b> · starting current <b>'+fm(o.I0,2)+' mA</b>'},
 why:function(p,s){return['τ = R × C (kΩ × µF gives ms).','Starting current is V ÷ R, so R cannot be too small. Then C finishes the job.','One way: R = '+s.R+' kΩ, C = '+s.C+' µF.']}});

add('quanta-physics',{id:'res',t:'flt',l:3,ic:'📻',cp:1,
 gen:function(r){var L0=pk(r,[1,2,5,10,20,33,47]),C0=pk(r,[1,2,5,10,22,47]),f0=1/(2*PI*Math.sqrt(L0*1e-3*C0*1e-6));if(f0<150||f0>5000)return null;return{fT:Math.round(f0/10)*10,Lmax:L0*2}},
 story:function(p){return 'Tune a radio circuit to resonate at '+p.fT+' Hz. You have an inductor no larger than '+p.Lmax+' mH. Choose L and C.'},
 params:function(){return[{n:'L',l:'Inductor',min:1,max:100,step:1,s:10,u:' mH'},{n:'C',l:'Capacitor',min:1,max:100,step:1,s:10,u:' µF'}]},
 model:function(v){return{f0:1/(2*PI*Math.sqrt(v.L*1e-3*v.C*1e-6))}},
 goals:function(p){return[{t:'Resonance at '+p.fT+' Hz (±3%)',ok:function(o){return Math.abs(o.f0-p.fT)/p.fT<=.03}},{t:'Inductor no larger than '+p.Lmax+' mH',ok:function(o,v){return v.L<=p.Lmax}}]},
 draw:function(v,o,p){var X=function(f){return 20+(Math.log10(f)-2)/2*265},d='',i,f,Q=5;for(i=0;i<=120;i++){f=100*Math.pow(100,i/120);var m=1/Math.sqrt(1+Q*Q*Math.pow(f/o.f0-o.f0/f,2));d+=(i?'L':'M')+X(f).toFixed(1)+' '+(140-m*105).toFixed(1)}
  return SV(LN(20,140,290,140,null,1.5)+LN(X(p.fT),25,X(p.fT),140,OR,1.5,'4 3')+TX(X(p.fT),160,'goal',{a:'middle',c:OR})+PA(d,PU,3)+TX(20,160,'100 Hz',{s:9})+TX(290,160,'10 kHz',{s:9,a:'end'}),'Resonance curve')},
 read:function(v,o){return 'Resonant frequency <b>'+fm(o.f0,0)+' Hz</b>'},
 why:function(p,s){return['Resonance: f₀ = 1 ÷ (2π√(LC)).','Make LC the right size; a smaller inductor needs a larger capacitor.','One way: L = '+s.L+' mH, C = '+s.C+' µF.']}});

add('quanta-physics',{id:'amp',t:'dev',l:3,ic:'🔊',cp:1,
 gen:function(r){var vin=pk(r,[.2,.25,.4,.5]),Ri=pk(r,[2,5,10]),g=pk(r,[2,4,5,8,10,12]);if(Ri*g>100||vin*g>8)return null;return{vin:vin,Vo:rd(vin*g,2),Rmin:Ri}},
 story:function(p){return 'An inverting amplifier must turn a '+p.vin+' V peak signal into a '+p.Vo+' V peak output (the supply rails are ±10 V). The source needs an input resistance of at least '+p.Rmin+' kΩ.'},
 params:function(){return[{n:'Ri',l:'Input resistor',min:1,max:20,step:1,s:10,u:' kΩ'},{n:'Rf',l:'Feedback resistor',min:1,max:100,step:1,s:10,u:' kΩ'}]},
 model:function(v,p){var g=v.Rf/v.Ri;return{g:g,vo:g*p.vin}},
 goals:function(p){return[{t:'Output peaks at '+p.Vo+' V (±5%)',ok:function(o){return Math.abs(o.vo-p.Vo)<=.05*p.Vo}},{t:'Input resistance at least '+p.Rmin+' kΩ',ok:function(o,v){return v.Ri>=p.Rmin}}]},
 draw:function(v,o,p){var d='',d2='',i,x,s=7;for(i=0;i<=100;i++){x=i/100;var a=Math.sin(x*4*PI);d+=(i?'L':'M')+(15+x*270).toFixed(1)+' '+(85-p.vin*s*a).toFixed(1);var y=-o.g*p.vin*a;y=Math.max(-10,Math.min(10,y));d2+=(i?'L':'M')+(15+x*270).toFixed(1)+' '+(85-y*s).toFixed(1)}
  return SV(LN(15,85,290,85,null,1)+LN(15,15,290,15,RD,1,'4 3')+LN(15,155,290,155,RD,1,'4 3')+TX(20,12,'+10 V rail',{s:9,c:RD})+PA(d,BL,2.5)+PA(d2,PU,2.5)+TX(20,148,'blue = input · purple = output',{s:9}),'Input and output waveforms')},
 read:function(v,o){return 'Gain <b>'+fm(-o.g,1)+'</b> · output peak <b>'+fm(o.vo,2)+' V</b>'+(o.vo>10?' (clipping)':'')},
 why:function(p,s){return['Inverting amplifier gain = −Rf ÷ Ri.','Output peak = gain × input peak. The input resistance seen by the source is Ri.','One way: Ri = '+s.Ri+' kΩ, Rf = '+s.Rf+' kΩ.']}});

add('quanta-physics',{id:'gen',t:'mag',l:3,ic:'🌀',cp:1,
 gen:function(r){var f=pk(r,[5,10,15,20,25,30,40,50]),N=50*(1+Math.floor(r()*10)),V=N*.5*.002*2*PI*f;return{f:f,V:Math.round(V)}},
 story:function(p){return 'A generator coil (area 20 cm², in a 0.5 T field) must make '+p.f+' Hz alternating current with a peak of about '+p.V+' V. Choose the turning speed and the number of turns.'},
 params:function(){return[{n:'rpm',l:'Turning speed',min:60,max:3000,step:60,s:600,u:' rpm'},{n:'N',l:'Turns of wire',min:50,max:500,step:50,s:100,u:''}]},
 model:function(v){var f=v.rpm/60;return{f:f,V:v.N*.5*.002*2*PI*f}},
 goals:function(p){return[{t:'Frequency '+p.f+' Hz',ok:function(o){return Math.abs(o.f-p.f)<.01}},{t:'Peak voltage '+p.V+' V (±5%)',ok:function(o){return Math.abs(o.V-p.V)<=.05*p.V}}]},
 draw:function(v,o,p){var d='',i,x;for(i=0;i<=160;i++){x=i/160;d+=(i?'L':'M')+(15+x*270).toFixed(1)+' '+(85-o.V/160*65*Math.sin(2*PI*o.f*0.2*x)).toFixed(1)}
  return SV(LN(15,85,290,85,null,1)+LN(15,85-p.V/160*65,290,85-p.V/160*65,OR,1,'4 3')+TX(20,85-p.V/160*65-3,'goal peak',{s:9,c:OR})+PA(d,PU,2.5)+TX(285,160,'0.2 s',{a:'end',s:9}),'Generator output voltage over 0.2 seconds')},
 read:function(v,o){return 'Frequency <b>'+fm(o.f,1)+' Hz</b> · peak voltage <b>'+fm(o.V,0)+' V</b>'},
 why:function(p,s){return['Frequency = rpm ÷ 60.','Peak EMF = N B A ω, with ω = 2π f.','One way: '+s.rpm+' rpm and '+s.N+' turns.']}});

add('quanta-physics',{id:'xf',t:'pwr',l:3,ic:'🔌',cp:1,
 gen:function(r){var Vs=pk(r,[5,6,9,12,15,24]),R=pk(r,[5,10,20,40]),Ip=Vs*Vs/(R*120);return{Vs:Vs,Imax:Math.ceil(Ip*1.3*100)/100}},
 story:function(p){return 'A transformer’s primary has 600 turns on 120 V mains. Pick the secondary turns and the load so the secondary delivers '+p.Vs+' V while the wall outlet supplies at most '+p.Imax+' A.'},
 params:function(){return[{n:'Ns',l:'Secondary turns',min:5,max:1000,step:5,s:100,u:''},{n:'R',l:'Load resistance',min:5,max:100,step:5,s:20,u:' Ω'}]},
 model:function(v){var Vs=120*v.Ns/600,Is=Vs/v.R;return{Vs:Vs,Is:Is,Ip:Is*v.Ns/600}},
 goals:function(p){return[{t:'Secondary voltage '+p.Vs+' V (±3%)',ok:function(o){return Math.abs(o.Vs-p.Vs)<=.03*p.Vs}},{t:'Primary current at most '+p.Imax+' A',ok:function(o){return o.Ip<=p.Imax+1e-9}}]},
 draw:function(v,o){return SV(RC(125,25,50,120,'none',null)+RC(100,40,100,90,'none')+PA('M100 55 q-28 6 0 12 q-28 6 0 12 q-28 6 0 12 q-28 6 0 12',OR,3)+PA('M200 55 q28 6 0 12 q28 6 0 12 q28 6 0 12 q28 6 0 12',PU,3)+TX(50,150,'600 turns, 120 V',{a:'middle',s:9})+TX(255,150,v.Ns+' turns, '+fm(o.Vs,1)+' V',{a:'middle',s:9}),'Transformer with primary and secondary coils')},
 read:function(v,o){return 'Secondary <b>'+fm(o.Vs,1)+' V</b> at <b>'+fm(o.Is,2)+' A</b> · wall current <b>'+fm(o.Ip,3)+' A</b>'},
 why:function(p,s){return['Voltage follows turns: Vs = Vp × Ns ÷ Np.','Power in equals power out, so the wall current is Ip = Vs² ÷ (R × Vp).','One way: '+s.Ns+' turns with a '+s.R+' Ω load.']}});

add('quanta-physics',{id:'div',t:'ohm',l:3,ic:'🎚️',cp:1,
 gen:function(r){var Vs=pk(r,[5,9,12]),P=[1,2,3,4,5,6,8,10,12,15,20],R1=pk(r,P),R2=pk(r,P),Vo=Vs*R2/(R1+R2);if(Vo<1||Vo>Vs-1)return null;return{Vs:Vs,Vt:rd(Vo,1),Imax:Math.ceil(Vs/(R1+R2)*1.3*100)/100}},
 story:function(p){return 'A '+p.Vs+' V battery feeds a voltage divider. A sensor needs exactly '+p.Vt+' V at the middle node, and the battery should give no more than '+p.Imax+' mA so it lasts. Choose both resistors.'},
 params:function(){return[{n:'R1',l:'Top resistor',min:1,max:50,step:1,s:10,u:' kΩ'},{n:'R2',l:'Bottom resistor',min:1,max:50,step:1,s:10,u:' kΩ'}]},
 model:function(v,p){return{Vo:p.Vs*v.R2/(v.R1+v.R2),I:p.Vs/(v.R1+v.R2)}},
 goals:function(p){return[{t:'Middle node at '+p.Vt+' V (±0.15)',ok:function(o){return Math.abs(o.Vo-p.Vt)<=.15}},{t:'Battery current at most '+p.Imax+' mA',ok:function(o){return o.I<=p.Imax+1e-9}}]},
 draw:function(v,o,p){var h=o.Vo/p.Vs;return SV(LN(60,20,60,150,null,2)+RC(40,38,40,28,'none')+TX(60,56,'R1 '+v.R1+'k',{a:'middle',s:9})+RC(40,100,40,28,'none')+TX(60,118,'R2 '+v.R2+'k',{a:'middle',s:9})+LN(80,84,130,84,null,2)+CI(60,84,3,PU,PU)+TX(130,80,'node',{s:9})+RC(190,25,40,120,'none')+RC(190,25+120*(1-h),40,120*h,'#cfd8ff',PU,1)+TX(210,160,fm(o.Vo,2)+' V',{a:'middle'}),'Voltage divider with level bar')},
 read:function(v,o){return 'Node voltage <b>'+fm(o.Vo,2)+' V</b> · battery current <b>'+fm(o.I,2)+' mA</b>'},
 why:function(p,s){return['Divider: Vout = Vs × R2 ÷ (R1 + R2).','Current = Vs ÷ (R1 + R2), so bigger resistors save the battery.','One way: R1 = '+s.R1+' kΩ, R2 = '+s.R2+' kΩ.']}});

add('quanta-physics',{id:'orb',t:'cir',l:3,ic:'🛰️',cp:1,
 gen:function(r){var r0=1.2+.1*Math.floor(r()*48),T=84.4*Math.pow(r0,1.5),v=7.9/Math.sqrt(r0);return{T:Math.round(T),vmax:Math.ceil(v*10)/10,M:pk(r,[500,800,1200])}},
 story:function(p){return 'Place a satellite in a circular orbit with a period of '+p.T+' minutes, moving no faster than '+p.vmax+' km/s, while carrying at least '+p.M+' kg of instruments. Choose the orbit radius and the satellite mass.'},
 params:function(){return[{n:'r',l:'Orbit radius (Earth radii)',min:1.1,max:8,step:.05,s:2,u:''},{n:'m',l:'Satellite mass',min:100,max:2000,step:100,s:500,u:' kg'}]},
 model:function(v){return{T:84.4*Math.pow(v.r,1.5),v:7.9/Math.sqrt(v.r)}},
 goals:function(p){return[{t:'Period '+p.T+' min (±3%)',ok:function(o){return Math.abs(o.T-p.T)/p.T<=.03}},{t:'Speed at most '+p.vmax+' km/s',ok:function(o){return o.v<=p.vmax+1e-9}},{t:'Carry at least '+p.M+' kg',ok:function(o,v){return v.m>=p.M}}]},
 draw:function(v,o){var R=14,rr=Math.min(75,R*v.r);return SV(CI(150,85,R,'#bfe0ff',BL)+CI(150,85,rr,'none',PU)+CI(150+rr,85,5,OR,OR)+TX(150,165,'period '+fm(o.T,0)+' min',{a:'middle'}),'Satellite orbit around Earth')},
 read:function(v,o){return 'Period <b>'+fm(o.T,0)+' min</b> · speed <b>'+fm(o.v,2)+' km/s</b>'},
 why:function(p,s){return['Orbital period grows with radius: T ∝ r^1.5 (about 84 min at the surface).','Mass cancels out of the orbit equations, so heavier satellites need no different radius.','One way: radius '+s.r+' Earth radii with any mass of at least '+p.M+' kg.']}});

/* ---------- framework ---------- */
function steps(tp,p){var o=[];(tp.params(p)).forEach(function(q){var a=[],n=Math.round((q.max-q.min)/q.step);for(var i=0;i<=n;i++)a.push(+(q.min+i*q.step).toFixed(6));o.push(a)});return o}
function solve(tp,p){var ps=tp.params(p),gr=steps(tp,p),gs=tp.goals(p),v={},found=null;
 (function rec(i){if(found)return;if(i===ps.length){var o=tp.model(v,p);if(gs.every(function(g){return g.ok(o,v)}))found=Object.assign({},v);return}
  for(var k=0;k<gr[i].length&&!found;k++){v[ps[i].n]=gr[i][k];rec(i+1)}})(0);return found}
var PK=(window.P&&P.meta&&P.meta.id||'').replace(/-20\d\d$/,''),TL=LAB[PK]||[],TM={};TL.forEach(function(t){TM[t.id]=t});
function tpl(it){return TM[(it.q?it.q:it).lab.id]}
function unit(q,x){return sg(x)+(q.u||'')}
function goalsHTML(tp,p,o,v){return tp.goals(p).map(function(g){var ok=g.ok(o,v);return '<li class="'+(ok?'ok':'')+'"><span aria-hidden="true">'+(ok?'✓':'○')+'</span> '+g.t+'<span class="sr-only">'+(ok?' (met)':' (not met yet)')+'</span></li>'}).join('')}
IT.lab={init:function(it){var tp=tpl(it);it.v={};tp.params(it.q.lab.p).forEach(function(q){it.v[q.n]=q.s});it.t=false;it.met=false},
 render:function(it,rev){var q=it.q,tp=tpl(it),p=q.lab.p,o=tp.model(it.v,p),h='<div class="itx bld lab"><div class="figw" id="labf">'+tp.draw(it.v,o,p)+'</div><div class="labr" id="labr" aria-live="polite">'+tp.read(it.v,o,p)+'</div><ul class="labg" id="labg" aria-label="Goals">'+goalsHTML(tp,p,o,it.v)+'</ul>';
  tp.params(p).forEach(function(s){h+='<label class="lsl"><span>'+s.l+': <b id="labv_'+s.n+'">'+unit(s,it.v[s.n])+'</b></span><input type="range" class="labs" data-lb="'+s.n+'" min="'+s.min+'" max="'+s.max+'" step="'+s.step+'" value="'+it.v[s.n]+'" aria-label="'+s.l+'"'+(rev?' disabled':'')+'></label>'});
  if(!rev)h+='<div class="row"><button type="button" class="btn sec sm" data-labreset="1">Reset</button></div><div class="small mute">Tinker freely. Change one slider at a time and watch what moves. Press Check when every goal has a tick.</div>';
  else h+='<div class="simo">'+(it.ok?'Every goal is met.':'One way to meet them: '+tp.params(p).map(function(s){return s.l.toLowerCase()+' '+unit(s,q.lab.sv[s.n])}).join(', ')+'.')+'</div>';
  return h+'</div>'},
 ok:function(it){var tp=tpl(it),p=it.q.lab.p,o=tp.model(it.v,p);return tp.goals(p).every(function(g){return g.ok(o,it.v)})},done:function(it){return it.t},
 ans:function(q){var tp=TM[q.lab.id];return tp.params(q.lab.p).map(function(s){return s.l.toLowerCase()+' '+unit(s,q.lab.sv[s.n])}).join(', ')}};
function cur(){var it=Z&&!Z.fin&&Z.steps&&Z.steps[Z.i]&&Z.steps[Z.i].it;return it&&it.q.type==='lab'&&!it.done?it:null}
function upd(it){var tp=tpl(it),p=it.q.lab.p,o=tp.model(it.v,p),f=document.getElementById('labf'),r=document.getElementById('labr'),g=document.getElementById('labg');if(f)f.innerHTML=tp.draw(it.v,o,p);if(r)r.innerHTML=tp.read(it.v,o,p);if(g)g.innerHTML=goalsHTML(tp,p,o,it.v);
 var all=IT.lab.ok(it);if(all&&!it.met){window.sfx&&sfx('ok')}it.met=all;if(window.itEnable)itEnable()}
document.addEventListener('input',function(e){var t=e.target;if(!t.classList||!t.classList.contains('labs'))return;var it=cur();if(!it)return;var n=t.dataset.lb,q=tpl(it).params(it.q.lab.p).filter(function(s){return s.n===n})[0];it.v[n]=+t.value;it.t=true;var b=document.getElementById('labv_'+n);if(b)b.textContent=unit(q,it.v[n]);window.sfx&&sfx('tick');upd(it)});
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-labreset]');if(!b)return;var it=cur();if(!it)return;IT.lab.init(it);drawSess();if(window.itEnable)itEnable()});
var NPER=10;
TL.forEach(function(tp){var seen={};for(var i=0;i<NPER;i++){var id='lab-'+tp.id+'-'+(i<9?'0':'')+(i+1),p=null,sv=null,tries=0;if(QI[id]!==undefined)continue;
 while(!sv&&tries<12){p=tp.gen(mul(hs(PK+tp.id+i+'z'+tries)));tries++;if(!p||seen[JSON.stringify(p)]){p=null;continue}sv=solve(tp,p)}
 if(!sv)continue;seen[JSON.stringify(p)]=1;var st=tp.why(p,sv);
 QS.push({id:id,t:tp.t,l:tp.l,type:'lab',ic:tp.ic,q:tp.story(p),lab:{id:tp.id,p:p,sv:sv},sol:st,w:st[st.length-1],fp:'lab-'+tp.id,cp:tp.cp,bld:1});QI[id]=QS.length-1}});
})();
