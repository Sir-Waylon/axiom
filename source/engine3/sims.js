/* ===== real-world scenario simulators =====
   Each template makes many different problems (seeded numbers, so none repeat). The student sets a real quantity (a resistor,
   a ladder angle, a rain duration...) to hit a goal. The readout is hidden until "Test it" and only 3 tests are allowed,
   so thinking beats guessing. Answers are checked against the same formula the lesson teaches. */
(function(){
function mul(a){return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function hs(s){var h=2166136261;s=String(s);for(var i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function pk(r,a){return a[Math.floor(r()*a.length)]}
function rd(v,d){return +v.toFixed(d===undefined?2:d)}
function sg(x){return String(x).replace('-','−')}
/* template: {t topic, l level, ic icon, gen(r) -> {story,params,out,goal,steps,w,ans,scene}} */
var T={};
var PK=(window.P&&P.meta&&P.meta.id||'').replace(/-20\d\d$/,'');
/* ---------- Voltaic: circuits ---------- */
T['circuit-lab-b']=[
 {id:'led',t:'diode',l:2,ic:'💡',gen:function(r){var V=pk(r,[5,9,12]),R=pk(r,[150,220,330,470,680,820]),I=rd((V-2)/R*1000,1);
  return{story:'A robot has an LED that needs exactly '+I+' mA. It runs on a '+V+' V battery and the LED itself drops 2 V. Choose the series resistor.',
  params:[{n:'R',l:'Resistor',min:50,max:1000,step:10,u:' Ω',s:100}],env:{V:V},out:{e:'(V-2)/R*1000',l:'LED current',u:' mA',d:1},goal:{t:I,rel:.04},scene:'bulb',
  steps:['The resistor sees what the LED does not: '+V+' − 2 = '+(V-2)+' V.','Ohm’s law: R = V ÷ I = '+(V-2)+' ÷ '+rd(I/1000,4)+' A.','R ≈ '+R+' Ω.'],ans:R+' Ω'}}},
 {id:'div',t:'circ',l:2,ic:'🔌',gen:function(r){var Vin=pk(r,[5,9,12]),R1=pk(r,[4,5,10]),R2=pk(r,[2,3,5,6,8,10,12]),Vo=rd(Vin*R2/(R1+R2),2);
  return{story:'A sensor needs '+Vo+' V but your battery gives '+Vin+' V. You build a voltage divider with R1 = '+R1+' kΩ on top. Choose R2 (bottom).',
  params:[{n:'R2',l:'R2',min:1,max:20,step:.5,u:' kΩ',s:1}],env:{Vin:Vin,R1:R1},out:{e:'Vin*R2/(R1+R2)',l:'Output voltage',u:' V',d:2},goal:{t:Vo,rel:.02},
  steps:['Divider rule: Vout = Vin × R2 ÷ (R1 + R2).',Vo+' = '+Vin+' × R2 ÷ ('+R1+' + R2).','Solving gives R2 = '+R2+' kΩ.'],ans:R2+' kΩ'}}},
 {id:'par',t:'circ',l:2,ic:'🔋',gen:function(r){var R1=pk(r,[10,20,30,40]),R2=pk(r,[10,15,20,30,60]),Rt=rd(1/(1/R1+1/R2),2);
  return{story:'You need a total resistance of '+Rt+' Ω from two resistors in parallel. One is '+R1+' Ω. Choose the other.',
  params:[{n:'R2',l:'Second resistor',min:5,max:100,step:5,u:' Ω',s:50}],env:{R1:R1},out:{e:'1/(1/R1+1/R2)',l:'Total resistance',u:' Ω',d:2},goal:{t:Rt,rel:.03},
  steps:['Parallel: 1/Rt = 1/R1 + 1/R2.','1/'+Rt+' − 1/'+R1+' = 1/R2.','R2 = '+R2+' Ω. Total is always smaller than the smallest branch.'],ans:R2+' Ω'}}},
 {id:'fuse',t:'virpe',l:2,ic:'🧯',gen:function(r){var V=pk(r,[12,24]),I=pk(r,[.5,.8,1.2,1.5]),F=pk(r,[5,6,8,10]),n=Math.floor(F/I),lo=rd((n-1)*I+.01,2);
  return{story:'A '+V+' V circuit has a '+F+' A fuse. Each light draws '+I+' A. Add as many lights as you can without blowing the fuse.',
  params:[{n:'n',l:'Lights',min:1,max:20,step:1,u:'',s:1}],env:{I:I},out:{e:'n*I',l:'Total current',u:' A',d:2},goal:{lo:lo,hi:F},
  steps:['Lights in parallel add their currents: n × '+I+' A.',F+' ÷ '+I+' = '+rd(F/I,2)+', so at most '+n+' lights.','Any more and the current passes '+F+' A.'],ans:n+' lights'}}},
 {id:'cap',t:'cap',l:3,ic:'⚡',gen:function(r){var V=pk(r,[5,9,12]),C=pk(r,[10,22,47,100]),E=rd(.5*C*V*V,0);
  return{story:'A camera flash needs '+E+' µJ stored in a capacitor charged to '+V+' V. Choose its capacitance.',
  params:[{n:'C',l:'Capacitance',min:5,max:200,step:1,u:' µF',s:20}],env:{V:V},out:{e:'0.5*C*V^2',l:'Stored energy',u:' µJ',d:0},goal:{t:E,rel:.015},scene:'tube',
  steps:['Energy in a capacitor: E = ½ C V².',E+' = ½ × C × '+V+'².','C = '+C+' µF.'],ans:C+' µF'}}}];
/* ---------- Stratus: weather ---------- */
T['meteorology-b']=[
 {id:'ltg',t:'light',l:1,ic:'🌩️',gen:function(r){var d=pk(r,[1,1.5,2,2.5,3,4,5,6,7,8,9,10]),s=d*5;
  return{story:'A thunderstorm is '+d+' miles away. About how many seconds should you count between the flash and the thunder? (Sound travels about 1 mile in 5 seconds.)',
  params:[{n:'s',l:'Seconds counted',min:1,max:60,step:1,u:' s',s:10}],out:{e:'s/5',l:'Storm distance',u:' mi',d:1},goal:{t:d,abs:.11},scene:'tube',
  steps:['Light arrives almost instantly. Thunder takes about 5 seconds per mile.',d+' miles × 5 s = '+s+' s.'],ans:s+' s'}}},
 {id:'cb',t:'upper',l:2,ic:'☁️',gen:function(r){var sp=pk(r,[3,4,5,6,7,8,9,10,11,12,13,14,15]),h=rd(sp/4.4*1000,0);
  return{story:'A pilot reports cloud bases near '+h+' ft above the ground. Using the rule “about 1000 ft per 4.4°F of temperature–dew point spread”, what spread produced it?',
  params:[{n:'sp',l:'Temp − dew point',min:0,max:30,step:1,u:' °F',s:5}],out:{e:'sp/4.4*1000',l:'Cloud base',u:' ft',d:0},goal:{t:h,rel:.07},scene:'tube',
  steps:['Rule of thumb: base ≈ spread ÷ 4.4 × 1000 ft.',h+' ÷ 1000 × 4.4 ≈ '+rd(h/1000*4.4,1)+'.','Spread ≈ '+sp+' °F.'],ans:sp+' °F'}}},
 {id:'rain',t:'precip',l:1,ic:'🌧️',gen:function(r){var rate=pk(r,[.25,.5,.75,1,1.5,2,2.5,3]),h=pk(r,[1,1.5,2,2.5,3,4,5,6,8]),tot=rd(rate*h,2);
  return{story:'Rain is falling at '+rate+' inches per hour. A flood watch starts when a basin collects '+tot+' inches. For how many hours must it keep raining?',
  params:[{n:'h',l:'Hours of rain',min:.5,max:12,step:.5,u:' h',s:1}],env:{rate:rate},out:{e:'rate*h',l:'Rain collected',u:' in',d:2},goal:{t:tot,rel:.03},scene:'tube',
  steps:['Total = rate × time.',tot+' ÷ '+rate+' = '+h+' hours.'],ans:h+' h'}}},
 {id:'warn',t:'torn',l:2,ic:'🌪️',gen:function(r){var v=pk(r,[30,40,45,60]),L=pk(r,[10,15,20,30]),d=rd(v*L/60,1);
  return{story:'A tornadic storm moves at '+v+' mph. Forecasters want '+L+' minutes of warning. How many miles ahead of the storm must the warning reach a town?',
  params:[{n:'d',l:'Distance',min:1,max:40,step:.5,u:' mi',s:5}],env:{v:v},out:{e:'d/v*60',l:'Warning time',u:' min',d:1},goal:{t:L,rel:.04},
  steps:['Distance = speed × time, with time in hours.',v+' mph × '+L+'/60 h = '+d+' miles.'],ans:d+' mi'}}}];
/* ---------- Vertex: geometry ---------- */
T['geometry-readiness']=[
 {id:'lad',t:'rt',l:2,ic:'🪜',gen:function(r){var L=pk(r,[12,16,20,24]),a=pk(r,[60,65,70,72,75,78]),H=rd(L*Math.sin(a*Math.PI/180),1);
  return{story:'A '+L+' ft ladder must reach a window '+H+' ft up the wall. Choose the angle the ladder makes with the ground.',
  params:[{n:'a',l:'Ladder angle',min:30,max:85,step:1,u:'°',s:50}],env:{L:L},out:{e:'L*sind(a)',l:'Height reached',u:' ft',d:1},goal:{t:H,rel:.012},scene:{k:'tri',a:'L*cosd(a)',b:'L*sind(a)',la:'base',lb:'height'},
  steps:['The ladder is the hypotenuse, the wall height is the opposite side.','sin(angle) = '+H+' ÷ '+L+' = '+rd(H/L,3)+'.','Angle ≈ '+a+'°.'],ans:a+'°'}}},
 {id:'ramp',t:'lin',l:1,ic:'♿',gen:function(r){var rise=pk(r,[1,1.25,1.5,1.75,2,2.25,2.5,2.75,3,3.5]),run=rise*12;
  return{story:'A wheelchair ramp must climb '+rise+' ft and have a slope of 1 : 12 (rise : run). How long must the ramp run be along the ground?',
  params:[{n:'run',l:'Run',min:2,max:50,step:.5,u:' ft',s:10}],env:{rise:rise},out:{e:'run/rise',l:'Run per 1 ft of rise',u:'',d:1},goal:{t:12,rel:.03},scene:{k:'tri',a:'run',b:'rise',la:'run',lb:'rise'},
  steps:['1 : 12 means 12 ft of run for every 1 ft of rise.','12 × '+rise+' = '+run+' ft.'],ans:run+' ft'}}},
 {id:'mdl',t:'sim',l:1,ic:'📐',gen:function(r){var H=pk(r,[24,30,36,45,60,72,90,120,150]),s=pk(r,[40,50,60,80,100,120,150,200]),m=rd(H/s,3);
  return{story:'A model of a '+H+' m tower must be '+m+' m tall to fit on a table. Choose the scale 1 : s.',
  params:[{n:'s',l:'Scale 1 :',min:10,max:400,step:10,u:'',s:100}],env:{H:H},out:{e:'H/s',l:'Model height',u:' m',d:3},goal:{t:m,rel:.04},
  steps:['Model = real ÷ scale factor.',H+' ÷ s = '+m+'.','s = '+(H/m)+'.'],ans:'1 : '+Math.round(H/m)}}},
 {id:'gar',t:'qdr',l:3,ic:'🌱',gen:function(r){var P=pk(r,[40,60,80,100]),w=pk(r,[6,8,10,12,15,18]),A=w*(P/2-w);
  return{story:'You have '+P+' ft of fence for a rectangular garden. Choose the width so the garden has an area of '+A+' square feet.',
  params:[{n:'w',l:'Width',min:1,max:P/2-1,step:1,u:' ft',s:5}],env:{P:P},out:{e:'w*(P/2-w)',l:'Area',u:' ft²',d:0},goal:{t:A,rel:.005},
  steps:['Length = half the perimeter − width = '+(P/2)+' − w.','Area = w × ('+(P/2)+' − w) = '+A+'.','Width '+w+' ft works (so does '+(P/2-w)+' ft, the same rectangle turned).'],ans:w+' ft'}}},
 {id:'whl',t:'cir',l:2,ic:'🚲',gen:function(r){var rr=pk(r,[7,8,9,10,11,12,13,13.5,14,15,16]),C=rd(2*Math.PI*rr,1);
  return{story:'A bike wheel must travel '+C+' inches in one full turn. Choose its radius.',
  params:[{n:'r',l:'Radius',min:2,max:20,step:.5,u:' in',s:5}],out:{e:'2*3.14159*r',l:'Distance per turn',u:' in',d:1},goal:{t:C,rel:.02},scene:'tube',
  steps:['One turn = the circumference, C = 2πr.',C+' ÷ (2π) ≈ '+rr+'.'],ans:rr+' in'}}}];
/* ---------- Apex: algebra 2 to calculus ---------- */
T['apex-math']=[
 {id:'bac',t:'ex',l:2,ic:'🦠',gen:function(r){var N0=pk(r,[100,200,500]),d=pk(r,[2,3,4]),k=pk(r,[2,3,4]),t=d*k,N=N0*Math.pow(2,k);
  return{story:'A culture starts at '+N0+' bacteria and doubles every '+d+' hours. After how many hours will there be '+N+'?',
  params:[{n:'t',l:'Hours',min:0,max:48,step:1,u:' h',s:0}],env:{N0:N0,d:d},out:{e:'N0*2^(t/d)',l:'Population',u:'',d:0},goal:{t:N,rel:.01},
  steps:['N = '+N0+' × 2^(t ÷ '+d+').',N+' ÷ '+N0+' = '+Math.pow(2,k)+' = 2^'+k+'.','t ÷ '+d+' = '+k+', so t = '+t+' hours.'],ans:t+' h'}}},
 {id:'rich',t:'lg',l:3,ic:'🌍',gen:function(r){var a=pk(r,[4,5,6]),M=a+pk(r,[.5,1,1.5,2]),ratio=Math.pow(10,1.5*(M-a)),R=rd(ratio,ratio<100?1:0);
  return{story:'A quake measures magnitude '+a+'. Each +1 on the Richter scale releases about 31.6 times more energy (10^1.5). What magnitude releases about '+R+' times the energy?',
  params:[{n:'M',l:'Magnitude',min:3,max:9,step:.1,u:'',s:5}],env:{a:a},out:{e:'10^(1.5*(M-a))',l:'Energy ratio',u:'×',d:1},goal:{t:R,rel:.05},
  steps:['Energy ratio = 10^(1.5 × (M − '+a+')).','log₁₀('+R+') ÷ 1.5 ≈ '+rd(M-a,2)+'.','M ≈ '+M+'.'],ans:'M ≈ '+M}}},
 {id:'fer',t:'tg',l:3,ic:'🎡',gen:function(r){var Rr=pk(r,[20,25,30]),Tp=pk(r,[60,80,100]),C=Rr+3,t=pk(r,[10,15,20,25,30,35]),h=rd(C+Rr*Math.sin(2*Math.PI*t/Tp-Math.PI/2),1);
  return{story:'A Ferris wheel of radius '+Rr+' m turns once every '+Tp+' seconds. Its lowest point is 3 m off the ground. Find a time when a rider is '+h+' m high.',
  params:[{n:'t',l:'Time',min:0,max:Tp,step:1,u:' s',s:0}],env:{R:Rr,T:Tp,C:C},out:{e:'C+R*sin(2*3.14159*t/T-3.14159/2)',l:'Height',u:' m',d:1},goal:{t:h,abs:.8},
  steps:['Height = '+C+' + '+Rr+' × sin(2πt ÷ '+Tp+' − π/2): a sine wave with midline '+C+' and amplitude '+Rr+'.','Solve '+h+' = that. One solution is t ≈ '+t+' s (there is a second one on the way down).'],ans:'about '+t+' s'}}},
 {id:'spd',t:'dv',l:3,ic:'🏃',gen:function(r){var a=pk(r,[1,2,3]),b=pk(r,[2,4,6]),t=pk(r,[1,2,3,4,5]),v=2*a*t+b;
  return{story:'A sprinter’s distance is s(t) = '+a+'t² + '+b+'t meters. Her speed is the derivative s′(t). At what time is she running '+v+' m/s?',
  params:[{n:'t',l:'Time',min:0,max:8,step:.5,u:' s',s:0}],env:{a:a,b:b},out:{e:'2*a*t+b',l:'Speed',u:' m/s',d:1},goal:{t:v,rel:.03},
  steps:['s′(t) = '+(2*a)+'t + '+b+'.',v+' = '+(2*a)+'t + '+b+'.','t = '+t+' s.'],ans:t+' s'}}},
 {id:'sav',t:'sq',l:2,ic:'💰',gen:function(r){var s0=pk(r,[10,20,25]),d=pk(r,[5,10,15,20]),n=pk(r,[6,8,10,12]),S=n*(2*s0+(n-1)*d)/2;
  return{story:'You save $'+s0+' in month 1 and add $'+d+' more each month than the month before. After '+n+' months you want a total of $'+S+'. Test other raises to see which one fits.',
  params:[{n:'d',l:'Monthly raise',min:0,max:60,step:5,u:' $',s:0}],env:{s0:s0,n:n},out:{e:'n*(2*s0+(n-1)*d)/2',l:'Total saved',u:' $',d:0},goal:{t:S,rel:.01},
  steps:['This is an arithmetic series: S = n(2a + (n − 1)d) ÷ 2.',S+' = '+n+'(2×'+s0+' + '+(n-1)+'d) ÷ 2.','d = '+d+'.'],ans:'$'+d}}},
 {id:'hlf',t:'ex',l:2,ic:'☢️',gen:function(r){var A0=pk(r,[80,160,320]),h=pk(r,[3,5,8]),k=pk(r,[1,2,3]),t=h*k,A=A0/Math.pow(2,k);
  return{story:'A medical tracer starts at '+A0+' units and has a half-life of '+h+' days. After how many days will '+A+' units remain?',
  params:[{n:'t',l:'Days',min:0,max:40,step:1,u:' d',s:0}],env:{A0:A0,h:h},out:{e:'A0*0.5^(t/h)',l:'Remaining',u:'',d:1},goal:{t:A,rel:.01},
  steps:['Remaining = '+A0+' × (1/2)^(t ÷ '+h+').',A+' ÷ '+A0+' = (1/2)^'+k+'.','t = '+k+' × '+h+' = '+t+' days.'],ans:t+' d'}}}];
/* ---------- Quanta: physics + electronics ---------- */
T['quanta-physics']=[
 {id:'prj',t:'kin',l:3,ic:'🏹',gen:function(r){var v=pk(r,[15,20,25,30]),a=pk(r,[20,30,40,55,60]),R=rd(v*v*Math.sin(2*a*Math.PI/180)/9.8,1);
  return{story:'A ball launches at '+v+' m/s. It must land '+R+' m away on level ground. Choose the launch angle (ignore air).',
  params:[{n:'a',l:'Angle',min:5,max:85,step:1,u:'°',s:10}],env:{v:v},out:{e:'v^2*sind(2*a)/9.8',l:'Range',u:' m',d:1},goal:{t:R,rel:.012},
  steps:['Range = v² sin(2θ) ÷ g.','sin(2θ) = '+R+' × 9.8 ÷ '+(v*v)+' = '+rd(R*9.8/(v*v),3)+'.','θ ≈ '+a+'° (or '+(90-a)+'°).'],ans:a+'° (or '+(90-a)+'°)'}}},
 {id:'htr',t:'ohm',l:2,ic:'🔥',gen:function(r){var Rr=pk(r,[9.6,12,14.4,16,24,28.8,36,48]),P=rd(14400/Rr,0);
  return{story:'A wall heater on 120 V must give '+P+' W. Choose the resistance of its heating element.',
  params:[{n:'R',l:'Resistance',min:5,max:60,step:.5,u:' Ω',s:30}],out:{e:'120^2/R',l:'Power',u:' W',d:0},goal:{t:P,rel:.03},scene:'bulb',
  steps:['P = V² ÷ R.','R = 120² ÷ '+P+' = '+rd(14400/P,1)+' Ω.'],ans:Rr+' Ω'}}},
 {id:'rmp',t:'nrg',l:2,ic:'🛷',gen:function(r){var h=pk(r,[1,2,3,5,8,10,15]),v=rd(Math.sqrt(2*9.8*h),1);
  return{story:'A frictionless sled starts at rest. How high must the hill be for it to reach '+v+' m/s at the bottom?',
  params:[{n:'h',l:'Hill height',min:.5,max:25,step:.5,u:' m',s:3}],out:{e:'sqrt(2*9.8*h)',l:'Speed at bottom',u:' m/s',d:1},goal:{t:v,rel:.025},scene:'tube',
  steps:['Potential energy turns into kinetic: mgh = ½mv².','h = v² ÷ 2g = '+rd(v*v,1)+' ÷ 19.6.','h ≈ '+h+' m.'],ans:h+' m'}}},
 {id:'wav',t:'wav',l:2,ic:'🔊',gen:function(r){var f=pk(r,[200,343,500,686,850,1000]),L=rd(343/f*100,1);
  return{story:'Sound moves at 343 m/s. A speaker must make a tone with a wavelength of '+L+' cm. Choose the frequency.',
  params:[{n:'f',l:'Frequency',min:100,max:2000,step:10,u:' Hz',s:500}],out:{e:'343/f*100',l:'Wavelength',u:' cm',d:1},goal:{t:L,rel:.03},
  steps:['v = f × λ, so f = v ÷ λ.','f = 343 ÷ '+rd(L/100,3)+' m ≈ '+Math.round(343/(L/100))+' Hz.'],ans:'about '+f+' Hz'}}},
 {id:'col',t:'mom',l:3,ic:'🚃',gen:function(r){var m1=pk(r,[2,3,4]),v1=pk(r,[2,3,4,6]),m2=pk(r,[1,2,3,4,6]),v=rd(m1*v1/(m1+m2),2);
  return{story:'A '+m1+' kg cart moving at '+v1+' m/s sticks to a parked cart. The pair must roll away at '+v+' m/s. Choose the mass of the parked cart.',
  params:[{n:'m2',l:'Parked cart',min:.5,max:12,step:.5,u:' kg',s:1}],env:{m1:m1,v1:v1},out:{e:'m1*v1/(m1+m2)',l:'Final speed',u:' m/s',d:2},goal:{t:v,rel:.03},
  steps:['Momentum is conserved: m1 v1 = (m1 + m2) v.',m1+' × '+v1+' = ('+m1+' + m2) × '+v+'.','m2 = '+m2+' kg.'],ans:m2+' kg'}}},
 {id:'rc',t:'rc',l:3,ic:'⏱️',gen:function(r){var C=pk(r,[10,22,47,100]),Rr=pk(r,[2,5,10,22,47]),tau=Rr*C;
  return{story:'A camera timer needs an RC time constant of '+tau+' ms using a '+C+' µF capacitor. Choose the resistor.',
  params:[{n:'R',l:'Resistor',min:1,max:100,step:1,u:' kΩ',s:10}],env:{C:C},out:{e:'R*C',l:'Time constant',u:' ms',d:0},goal:{t:tau,rel:.03},
  steps:['Time constant τ = R × C (kΩ × µF = ms).','R = '+tau+' ÷ '+C+' = '+Rr+' kΩ.'],ans:Rr+' kΩ'}}}];
/* ---------- add to the question bank ---------- */
T['apex-math']=(T['geometry-readiness']||[]).concat(T['apex-math']||[]);
var TL=T[PK]||[],NPER=10;
TL.forEach(function(tp){var seen={};for(var i=0;i<NPER;i++){var id='sim-'+tp.id+'-'+(i<9?'0':'')+(i+1);if(QI[id]!==undefined)continue;var g=tp.gen(mul(hs(PK+tp.id+i)));if(seen[g.story]){continue}seen[g.story]=1;
 var q={id:id,t:tp.t,l:tp.l,type:'sim',ic:tp.ic,q:g.story,sim:g,sol:g.steps,w:g.steps[g.steps.length-1],fp:'sim-'+tp.id};QS.push(q);QI[id]=QS.length-1}});
/* ---------- the question type ---------- */
function sc(g,env,out,tg,ic){var s=g.scene,id=typeof s==='object'?s.k:s,h='';
 if(id==='bulb'){var p=Math.max(0,Math.min(1.4,out/tg));h='<svg viewBox="0 0 120 80" class="itsvg"><circle cx="60" cy="38" r="'+(10+p*20)+'" fill="var(--gold)" fill-opacity="'+Math.min(.9,.15+p*.6)+'" stroke="var(--gold)"/><path d="M52 62h16M54 68h12" stroke="currentColor"/></svg>'}
 else if(id==='tube'){var p2=Math.max(0,Math.min(1,out/(tg*1.6)));h='<svg viewBox="0 0 120 80" class="itsvg"><rect x="48" y="6" width="24" height="68" rx="12"/><rect x="50" y="'+(72-p2*64)+'" width="20" height="'+(p2*64)+'" rx="8" fill="var(--pri)" stroke="none"/></svg>'}
 else if(id==='tri'){var a=wx(s.a)(env),b=wx(s.b)(env),m=Math.max(a,b,.001),k=84/m,A=Math.max(10,a*k),B=Math.max(10,b*k);h='<svg viewBox="0 0 150 100" class="itsvg"><polygon points="20,90 '+(20+A)+',90 20,'+(90-B)+'" fill="var(--pri-soft)" stroke="var(--pri)"/><text x="'+(20+A/2)+'" y="99" font-size="9" text-anchor="middle" fill="currentColor" stroke="none">'+s.la+' '+rd(a,1)+'</text><text x="22" y="'+(90-B/2)+'" font-size="9" fill="currentColor" stroke="none">'+s.lb+' '+rd(b,1)+'</text></svg>'}
 return h}
function envOf(it){var g=it.q.sim,e=Object.assign({},g.env||{});g.params.forEach(function(p){e[p.n]=it.v[p.n]});return e}
function outOf(it,env){var g=it.q.sim;return wx(g.out.e)(env)}
function goalOk(g,val){var G=g.goal;if(G.lo!==undefined)return val>=G.lo-1e-9&&val<=G.hi+1e-9;var d=Math.abs(val-G.t);return G.abs!==undefined?d<=G.abs+1e-9:d<=Math.abs(G.t)*G.rel+1e-9}
function goalTxt(g){var G=g.goal,o=g.out;return G.lo!==undefined?'between '+sg(rd(G.lo,2))+' and '+sg(rd(G.hi,2))+o.u:sg(G.t)+o.u}
IT.sim={init:function(it){it.v={};it.q.sim.params.forEach(function(p){it.v[p.n]=p.s});it.tests=0;it.last=null;it.touched=false},
 render:function(it,rev){var q=it.q,g=q.sim,env=envOf(it),out=outOf(it,env),tg=g.goal.t!==undefined?g.goal.t:g.goal.hi,h='<div class="itx sim"><div class="simic" aria-hidden="true">'+q.ic+'</div>';
  var sv=sc(g,env,it.last!==null?it.last:out*(rev?1:0),tg,q.ic);if(sv)h+='<div class="figw">'+sv+'</div>';
  h+='<div class="simg">Goal: <b>'+goalTxt(g)+'</b> <span>'+esc(g.out.l)+'</span></div>';
  g.params.forEach(function(p){h+='<label class="lsl"><span>'+esc(p.l)+' <b id="simv_'+p.n+'">'+sg(it.v[p.n])+p.u+'</b></span><input type="range" class="simr" data-sp="'+p.n+'" min="'+p.min+'" max="'+p.max+'" step="'+p.step+'" value="'+it.v[p.n]+'" aria-label="'+esc(p.l)+'"'+(rev?' disabled':'')+'></label>'});
  if(!rev)h+='<div class="simt"><button class="btn sec sm" data-simtest="1"'+(it.tests>=3?' disabled':'')+'>Test it ('+(3-it.tests)+' left)</button><div class="simo" id="simo" aria-live="polite">'+(it.last===null?'Set your value, then test it.':'Last test: <b>'+sg(rd(it.last,g.out.d))+g.out.u+'</b> '+(goalOk(g,it.last)?'✓ on target':(it.last<(g.goal.t!==undefined?g.goal.t:g.goal.lo)?'↑ too low':'↓ too high')))+'</div></div>';
  else h+='<div class="simo">Your setting gives <b>'+sg(rd(out,g.out.d))+g.out.u+'</b>. '+(it.ok?'On target.':'Answer: '+esc(g.ans)+'.')+'</div>';
  return h+'</div>'},
 ok:function(it){var env=envOf(it);return goalOk(it.q.sim,outOf(it,env))},done:function(it){return it.touched},ans:function(q){return q.sim.ans}};
document.addEventListener('input',function(e){if(!e.target.classList||!e.target.classList.contains('simr'))return;var it=Z&&Z.steps&&Z.steps[Z.i]&&Z.steps[Z.i].it;if(!it||it.q.type!=='sim'||it.done)return;var n=e.target.dataset.sp,p=it.q.sim.params.filter(function(x){return x.n===n})[0];it.v[n]=+e.target.value;it.touched=true;var b=document.getElementById('simv_'+n);if(b)b.textContent=sg(it.v[n])+p.u;itEnable();window.sfx&&window.sfx('tick')});
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-simtest]');if(!b)return;var it=Z&&Z.steps&&Z.steps[Z.i]&&Z.steps[Z.i].it;if(!it||it.q.type!=='sim'||it.done||it.tests>=3)return;it.tests++;it.touched=true;it.last=outOf(it,envOf(it));window.sfx&&window.sfx(goalOk(it.q.sim,it.last)?'ok':'hint');drawSess()});
TYB&&0;
})();
