/* ===== Labs 3: breadboard, make-a-storm, lens bench, ripple tank, inclined plane ===== */
(function(){
var A=window.__labApi,K=window.__labTex&&window.__labTex.h;if(!A||!K)return;
var fx=K.fx,dragger=K.dragger,keep=K.keep,svgW=K.svgW,rng=K.rng,PI=Math.PI,UID=0;
function tog(root,grp,val){[].forEach.call(root.querySelectorAll('[data-lc^="'+grp+':"]'),function(c){var on=c.dataset.lc===grp+':'+val;c.classList.toggle('on',on);c.setAttribute('aria-pressed',on)})}

/* ---------- Breadboard ---------- */
var LEDS={red:{vf:1.9,c:'#ff3b3b',n:'Red'},yellow:{vf:2.0,c:'#ffd23f',n:'Yellow'},green:{vf:2.2,c:'#2ee66b',n:'Green'},blue:{vf:3.0,c:'#4aa8ff',n:'Blue'}};
var WC=['#e8453c','#2f7de1','#f2b21c','#2e9e4d','#8a4fd6','#ff7a1a'];
function breadboard(root){
 var s={tool:'wire',R:330,led:'red',Vs:5,parts:[],pend:null,burnt:{},probe:null,id:0,msg:''},holes=[],byKey={},c,r;
 function hole(key,node,x,y){var h={key:key,node:node,x:x,y:y};holes.push(h);byKey[key]=h}
 for(c=0;c<10;c++){var x=38+c*26;hole('P'+c,'P',x,22);hole('N'+c,'N',x,38);for(r=0;r<5;r++){hole('T'+c+'r'+r,'T'+c,x,74+r*16);hole('B'+c+'r'+r,'B'+c,x,176+r*16)}}
 root.innerHTML='<p class="small mute">Pick a part, then tap two holes to place it. The row of holes in each numbered strip is joined underneath, and the gap in the middle splits the board. Red rail is +, blue rail is −. Tap the LED’s long leg (anode) first.</p><div id="lsvw"></div>'+A.readout('lro')+'<div class="row"><span class="small mute">Part</span> '+A.chips('tool',[['wire','Wire'],['R','Resistor'],['LED','LED'],['sw','Switch'],['probe','Probe'],['erase','Erase']],s.tool)+'</div><div class="row" style="margin-top:6px"><span class="small mute">Resistor</span> '+A.chips('rv',[[100,'100 Ω'],[220,'220 Ω'],[330,'330 Ω'],[1000,'1 kΩ'],[10000,'10 kΩ']],s.R)+'</div><div class="row" style="margin-top:6px"><span class="small mute">LED</span> '+A.chips('lc',Object.keys(LEDS).map(function(k){return[k,LEDS[k].n]}),s.led)+'</div><div class="row" style="margin-top:6px"><span class="small mute">Battery</span> '+A.chips('vs',[[3,'3 V'],[5,'5 V'],[9,'9 V']],s.Vs)+'</div><div class="row" style="margin-top:8px"><button class="btn" data-la="ex">Show an example</button> <button class="btn sec" data-la="fix">Replace burnt parts</button> <button class="btn sec" data-la="clr">Clear board</button></div>';
 var wrap=root.querySelector('#lsvw');
 function pos(k){return byKey[k]}
 function solve(){
  var par={};function find(a){while(par[a]!==undefined&&par[a]!==a)a=par[a];return a}function uni(a,b){a=find(a);b=find(b);if(a!==b)par[a]=b}
  s.parts.forEach(function(p){if(p.k==='wire'||(p.k==='sw'&&p.on))uni(pos(p.a).node,pos(p.b).node)});
  var rp=find('P'),rn=find('N'),out={V:{},I:{},short:rp===rn,fixed:{}};
  if(out.short){return out}
  var nodes={};holes.forEach(function(h){nodes[find(h.node)]=1});
  var un=Object.keys(nodes).filter(function(n){return n!==rp&&n!==rn}),ix={};un.forEach(function(n,i){ix[n]=i});
  var on={},it,N=un.length,V={};V[rp]=s.Vs;V[rn]=0;
  for(it=0;it<30;it++){
   var G=[],B=[],i,j;for(i=0;i<N;i++){G.push(new Array(N).fill(0));B.push(0);G[i][i]=1e-9}
   function stamp(a,b,g,ia,ib){var A1=find(pos(a).node),B1=find(pos(b).node),ja=ix[A1],jb=ix[B1];
    if(ja!==undefined){G[ja][ja]+=g;if(jb!==undefined)G[ja][jb]-=g;else B[ja]+=g*V[B1]}
    if(jb!==undefined){G[jb][jb]+=g;if(ja!==undefined)G[jb][ja]-=g;else B[jb]+=g*V[A1]}
    if(ia){if(ja!==undefined)B[ja]+=ia;if(jb!==undefined)B[jb]-=ia}}
   s.parts.forEach(function(p){if(s.burnt[p.id])return;if(p.k==='R')stamp(p.a,p.b,1/p.v);else if(p.k==='LED'&&on[p.id]){var gl=.2;stamp(p.a,p.b,gl,gl*LEDS[p.col].vf)}});
   var Vn=gauss(G,B);un.forEach(function(n,k){V[n]=Vn[k]});
   var ch=false;s.parts.forEach(function(p){if(p.k!=='LED'||s.burnt[p.id])return;var vd=V[find(pos(p.a).node)]-V[find(pos(p.b).node)],want=vd>LEDS[p.col].vf;if(want!==!!on[p.id]){on[p.id]=want;ch=true}});
   if(!ch)break}
  var burn=false;
  s.parts.forEach(function(p){var va=V[find(pos(p.a).node)],vb=V[find(pos(p.b).node)],I=0;
   if(s.burnt[p.id]){out.I[p.id]=0;return}
   if(p.k==='R'){I=(va-vb)/p.v;if(I*I*p.v>.5){s.burnt[p.id]=1;burn=true;I=0}}
   else if(p.k==='LED'){I=on[p.id]?(va-vb-LEDS[p.col].vf)/5:0;if(I>.03){s.burnt[p.id]=1;burn=true;I=0}}
   out.I[p.id]=I});
  out.V=function(node){var v=V[find(node)];return v===undefined?0:v};out.find=find;out.on=on;
  if(burn)return solve();
  return out}
 function gauss(G,B){var n=B.length,i,j,k,M=G.map(function(r,a){return r.concat([B[a]])});
  for(i=0;i<n;i++){var p=i;for(j=i+1;j<n;j++)if(Math.abs(M[j][i])>Math.abs(M[p][i]))p=j;var t=M[i];M[i]=M[p];M[p]=t;var d=M[i][i]||1e-12;
   for(j=i+1;j<n;j++){var f=M[j][i]/d;if(f)for(k=i;k<=n;k++)M[j][k]-=f*M[i][k]}}
  var x=new Array(n).fill(0);for(i=n-1;i>=0;i--){var sm=M[i][n];for(j=i+1;j<n;j++)sm-=M[i][j]*x[j];x[i]=sm/(M[i][i]||1e-12)}return x}
 function seg(p){var a=pos(p.a),b=pos(p.b),dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy)||1;return{a:a,b:b,dx:dx,dy:dy,d:d,mx:(a.x+b.x)/2,my:(a.y+b.y)/2,ang:Math.atan2(dy,dx)*180/PI}}
 function drawPart(p,sol,i){var g=seg(p),h='';
  if(p.k==='wire'){var nx=-g.dy/g.d,ny=g.dx/g.d,cx=g.mx+nx*Math.min(14,g.d*.25),cy=g.my+ny*Math.min(14,g.d*.25)-6;h+='<path d="M'+g.a.x+' '+g.a.y+'Q'+cx+' '+cy+' '+g.b.x+' '+g.b.y+'" fill="none" stroke="'+WC[p.col%WC.length]+'" stroke-width="3.4" stroke-linecap="round"/>'}
  else if(p.k==='R'){var bw=Math.min(34,g.d*.7),b=K.bands(p.v),bad=s.burnt[p.id];h+='<line x1="'+g.a.x+'" y1="'+g.a.y+'" x2="'+g.b.x+'" y2="'+g.b.y+'" stroke="#9aa0b4" stroke-width="2"/><g transform="translate('+g.mx+' '+g.my+') rotate('+g.ang+')"><rect x="'+(-bw/2)+'" y="-5" width="'+bw+'" height="10" rx="4" fill="'+(bad?'#444':'#e7cf9c')+'" stroke="#8a7440" stroke-width="1"/>'+(bad?'<path d="M-6 -3L6 3M6 -3L-6 3" stroke="#ff6b4a" stroke-width="2"/>':[0,1,2].map(function(k,q){return'<rect x="'+(-bw/2+4+q*5)+'" y="-5" width="2.6" height="10" fill="'+K.COL[b[k]]+'"/>'}).join('')+'<rect x="'+(bw/2-6)+'" y="-5" width="2.6" height="10" fill="#d4a017"/>')+'</g>'+(bad?'':'<text x="'+g.mx+'" y="'+(g.my-9)+'" text-anchor="middle" font-size="8" font-weight="700" fill="currentColor">'+(p.v>=1000?p.v/1000+'k':p.v)+'Ω</text>')}
  else if(p.k==='LED'){var I=sol.I[p.id]||0,br=Math.min(1,I/.012),L=LEDS[p.col],bad2=s.burnt[p.id];h+='<line x1="'+g.a.x+'" y1="'+g.a.y+'" x2="'+g.b.x+'" y2="'+g.b.y+'" stroke="#9aa0b4" stroke-width="2"/>'+(br>0?'<circle cx="'+g.mx+'" cy="'+g.my+'" r="'+(11+br*10)+'" fill="'+L.c+'" opacity="'+(.2+br*.4)+'"/>':'')+'<circle cx="'+g.mx+'" cy="'+g.my+'" r="7.5" fill="'+(bad2?'#3a3a3a':br>0?L.c:'#d9dde8')+'" fill-opacity="'+(bad2?1:br>0?.6+br*.4:.55)+'" stroke="'+(bad2?'#222':L.c)+'" stroke-width="1.6"/>'+(bad2?'<path d="M'+(g.mx-4)+' '+(g.my-4)+'l8 8M'+(g.mx+4)+' '+(g.my-4)+'l-8 8" stroke="#ff6b4a" stroke-width="1.8"/>':'<ellipse cx="'+(g.mx-2)+'" cy="'+(g.my-2.5)+'" rx="2" ry="1.4" fill="#fff" opacity=".7"/>')+'<text x="'+(g.a.x+(g.b.x-g.a.x)*.18+(g.dy?5:0))+'" y="'+(g.a.y+(g.b.y-g.a.y)*.18-3)+'" font-size="9" font-weight="800" fill="currentColor">+</text>'}
  else if(p.k==='sw'){h+='<line x1="'+g.a.x+'" y1="'+g.a.y+'" x2="'+g.b.x+'" y2="'+g.b.y+'" stroke="#9aa0b4" stroke-width="2"/><g transform="translate('+g.mx+' '+g.my+') rotate('+g.ang+')"><rect x="-11" y="-6" width="22" height="12" rx="3" fill="#cfd4e2" stroke="#7a8499"/><line x1="-7" y1="0" x2="'+(p.on?7:5)+'" y2="'+(p.on?0:-6)+'" stroke="'+(p.on?'#12935f':'#d6336c')+'" stroke-width="2.4" stroke-linecap="round"/></g>'}
  h+='<circle cx="'+g.a.x+'" cy="'+g.a.y+'" r="3.2" fill="#444"/><circle cx="'+g.b.x+'" cy="'+g.b.y+'" r="3.2" fill="#444"/>';return h}
 function draw(){var sol=solve(),h='<defs><linearGradient id="bbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f3efe4"/><stop offset="1" stop-color="#e2dcc9"/></linearGradient></defs><rect x="14" y="8" width="292" height="272" rx="10" fill="url(#bbg)" stroke="#b9b29a" stroke-width="1.5"/>';
  h+='<line x1="24" y1="14" x2="296" y2="14" stroke="#e8453c" stroke-width="2"/><text x="20" y="25" font-size="9" font-weight="800" fill="#e8453c" text-anchor="end">+</text><text x="20" y="41" font-size="9" font-weight="800" fill="#2f7de1" text-anchor="end">−</text><line x1="24" y1="46" x2="296" y2="46" stroke="#2f7de1" stroke-width="2"/>';
  h+='<rect x="26" y="150" width="268" height="12" rx="3" fill="#c9c2ab" opacity=".7"/>';
  for(c=0;c<10;c++)h+='<text x="'+(38+c*26)+'" y="64" font-size="8" fill="#7a735e" text-anchor="middle">'+(c+1)+'</text>';
  holes.forEach(function(q){var pr=s.probe&&sol.find&&sol.find(q.node)===sol.find(s.probe.node);h+='<rect x="'+(q.x-3)+'" y="'+(q.y-3)+'" width="6" height="6" rx="1.4" fill="'+(pr?'#ffd23f':'#4a4636')+'"/>'});
  s.parts.forEach(function(p,i){h+=drawPart(p,sol,i)});
  if(s.pend){var pp=pos(s.pend);h+='<circle cx="'+pp.x+'" cy="'+pp.y+'" r="8" fill="none" stroke="#5b4bff" stroke-width="2.4"/>'}
  if(s.probe){var q=pos(s.probe.key);h+='<circle cx="'+q.x+'" cy="'+q.y+'" r="9" fill="none" stroke="#ffd23f" stroke-width="2.4"/>'}
  wrap.innerHTML=svgW(h,'Breadboard',320,288,'lsv');ro(sol)}
 function ro(sol){var e=root.querySelector('#lro'),t='';
  if(sol.short){e.innerHTML='<b style="color:var(--bad,#c0392b)">Short circuit!</b> A wire joins + to −, so a real battery would overheat. Remove that wire.';return}
  var tot=0,ledI=[];s.parts.forEach(function(p){if(p.k==='LED'&&!s.burnt[p.id])ledI.push(fx((sol.I[p.id]||0)*1000,1)+' mA');});
  var burn=Object.keys(s.burnt).length;
  t=(s.probe?'Probe: <b>'+fx(sol.V(s.probe.node),2)+' V</b> above the − rail. ':'')+(ledI.length?'LED current: <b>'+ledI.join(', ')+'</b>. ':'')+(burn?'<b style="color:var(--bad,#c0392b)">'+burn+' part'+(burn>1?'s':'')+' burnt out.</b> A part with too much current needs a resistor in series. ':'')+(s.msg||'');
  e.innerHTML=t||'Battery <b>'+s.Vs+' V</b>. Place an LED and a resistor to light it.'}
 function nearest(px,py,lim){var best=null,bd=lim||13;holes.forEach(function(q){var d=Math.hypot(q.x-px,q.y-py);if(d<bd){bd=d;best=q}});return best}
 function svgPt(e){var sv=wrap.querySelector('svg'),r=sv.getBoundingClientRect();return[(e.clientX-r.left)*320/r.width,(e.clientY-r.top)*288/r.height]}
 wrap.addEventListener('click',function(e){if(!e.target.closest('svg'))return;var p=svgPt(e),q=nearest(p[0],p[1]);s.msg='';
  if(s.tool==='erase'){var bi=-1,bd=10;s.parts.forEach(function(pt,i){var g=seg(pt),t=Math.max(0,Math.min(1,((p[0]-g.a.x)*g.dx+(p[1]-g.a.y)*g.dy)/(g.d*g.d))),d=Math.hypot(g.a.x+g.dx*t-p[0],g.a.y+g.dy*t-p[1]);if(d<bd){bd=d;bi=i}});if(bi>=0){delete s.burnt[s.parts[bi].id];s.parts.splice(bi,1)}s.pend=null;draw();return}
  if(s.tool==='sw'&&!s.pend){var hit=null,hd=10;s.parts.forEach(function(pt){if(pt.k!=='sw')return;var g=seg(pt),d=Math.hypot(g.mx-p[0],g.my-p[1]);if(d<hd){hd=d;hit=pt}});if(hit){hit.on=!hit.on;draw();return}}
  if(!q)return;
  if(s.tool==='probe'){s.probe=q;s.pend=null;draw();return}
  if(!s.pend){s.pend=q.key;draw();return}
  if(s.pend===q.key){s.pend=null;draw();return}
  var np={id:++s.id,k:s.tool==='R'?'R':s.tool==='LED'?'LED':s.tool==='sw'?'sw':'wire',a:s.pend,b:q.key,v:s.R,col:s.tool==='LED'?s.led:(s.id%WC.length),on:false};
  if(np.k==='wire')np.col=s.parts.length%WC.length;
  s.parts.push(np);s.pend=null;draw()});
 A.chipSet(root,function(g,v){if(g==='tool'){s.tool=v;s.pend=null}else if(g==='rv'){s.R=+v;if(s.tool!=='R')s.tool='R';tog(root,'tool','R')}else if(g==='lc'){s.led=v;if(s.tool!=='LED'){s.tool='LED';tog(root,'tool','LED')}}else if(g==='vs'){s.Vs=+v}draw()});
 root.addEventListener('click',function(e){var a=e.target.closest('[data-la]');if(!a)return;var v=a.dataset.la;
  if(v==='clr'){s.parts=[];s.burnt={};s.pend=null;s.probe=null;s.msg=''}
  else if(v==='fix'){s.burnt={};s.msg=''}
  else if(v==='ex'){s.parts=[];s.burnt={};s.id=0;s.Vs=5;tog(root,'vs',5);var L=function(k,a1,b1,x){s.parts.push({id:++s.id,k:k,a:a1,b:b1,v:x.v||330,col:x.col!==undefined?x.col:s.parts.length%WC.length,on:false})};
   L('wire','P0','T1r0',{});L('R','T1r2','T4r2',{v:330});L('LED','T4r3','T7r3',{col:'red'});L('wire','T7r4','N7',{});s.msg='Example: battery → 330 Ω resistor → LED → back to the battery. Try removing the resistor, or swapping the LED’s legs.'}
  draw()});
 draw()}

/* ---------- Make a storm ---------- */
var LIFT={none:0,sea:600,mtn:1500,front:2500},LIFTN={none:'No trigger',sea:'Sea breeze',mtn:'Mountain',front:'Cold front'};
function stormCalc(s){var T=s.T,Td=Math.min(s.Td,T),L=s.L,lcl=125*(T-Td),lift=LIFT[s.lift],z,dz=100,lfc=null,el=null,cape=0,g=9.8,prof=[];
 function Te(z){return T-L*Math.min(z,12000)/1000-(z>12000?0:0)}
 function Tp(z){return z<=lcl?T-9.8*z/1000:T-9.8*lcl/1000-6*(z-lcl)/1000}
 for(z=0;z<=12000;z+=dz){var B=Tp(z)-Te(z);prof.push([z,Te(z),Tp(z),B]);
  if(lfc===null&&B>0&&z>0)lfc=z;
  else if(lfc!==null&&el===null){if(B<=0)el=z;else cape+=g*B/(Te(z)+273.15)*dz}}
 if(lfc!==null&&el===null)el=12000;
 var st={lcl:lcl,lfc:lfc,el:el,cape:cape,lift:lift,prof:prof,Te:Te,Tp:Tp,kind:'',top:0,why:''};
 if(lcl>3200){st.kind='dry';st.why='The air is too dry. Cloud would not form until very high up.'}
 else if(lfc===null){st.kind=lift>lcl?'fair':'clear';st.why=lift>lcl?'Stable air. Only small fair-weather puffs can form.':'Stable air and nothing lifting it. Clear sky.'}
 else if(lfc>lift&&lfc>lcl+250){st.kind='cap';st.why='Energy is stored but a warm lid (the level of free convection is '+fx(lfc/1000,1)+' km) holds the air down. A stronger trigger could release it.'}
 else if(cape<250){st.kind='shower';st.top=el;st.why='A little buoyant energy: cumulus and a few showers.'}
 else if(cape<1500){st.kind='tstorm';st.top=el;st.why='Ordinary thunderstorm with rain and lightning.'}
 else if(s.S>=20){st.kind=(s.S>=30&&lcl<1500&&cape>=2000)?'tornado':'super';st.top=el;st.why=st.kind==='tornado'?'Strong energy, strong wind shear and a low cloud base: a supercell that can drop a tornado.':'Strong energy and wind shear: a rotating supercell with large hail.'}
 else{st.kind='multi';st.top=el;st.why='Strong energy but little shear: a tall, short-lived storm that collapses its own updraft.'}
 return st}
var KIND={dry:'Too dry',clear:'Clear sky',fair:'Fair-weather clouds',cap:'Capped: no storm yet',shower:'Showers',tstorm:'Thunderstorm',multi:'Strong thunderstorm',super:'Supercell',tornado:'Tornadic supercell'};
function stormLab(root){
 var s={T:30,Td:20,L:7.5,S:20,lift:'sea'},anim=null,st=stormCalc(s),UIDS=++UID;
 root.innerHTML='<p class="small mute">Build the day. Warm the ground, add moisture, make the air above cool quickly, pick what lifts it. Watch for a lid: lifting must reach the level of free convection before a storm can grow. Wind shear tilts the storm and lets it rotate.</p><div id="lsvw"></div><div id="lch"></div>'+A.readout('lro')+A.sl('T','Ground temperature',15,40,1,s.T,' °C')+A.sl('Td','Moisture (dew point)',0,28,1,s.Td,' °C')+A.sl('L','How fast air cools going up',5,9.5,.5,s.L,' °C/km')+A.sl('S','Wind shear',0,45,5,s.S,' kt')+'<div class="row" style="margin-top:6px"><span class="small mute">What lifts the air</span> '+A.chips('lift',Object.keys(LIFTN).map(function(k){return[k,LIFTN[k]]}),s.lift)+'</div><div class="row" style="margin-top:6px"><span class="small mute">Try a day</span> '+A.chips('pre',[['cal','Calm'],['pop','Pop-up'],['sev','Severe'],['tor','Tornado'],['win','Winter']],'')+'</div>';
 var wrap=root.querySelector('#lsvw'),ch=root.querySelector('#lch');
 var TIME=0;
 function scene(t){var k=st.kind,storm=!!st.top,GY=168,px=function(m){return GY-m/15000*128},cx=170,ten=Math.min(1,st.cape/2500),w=24+Math.min(36,st.cape/60),tilt=s.S/45*34,h='';
  var sky1=storm?['#6f7f9c','#c9d2e2'][0]:'#6fb7ff',sky2=storm?'#d6dce8':'#e6f3ff';
  if(k==='tornado'||k==='super')sky1='#4d5a76';
  h+='<defs><linearGradient id="sk'+UIDS+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+sky1+'"/><stop offset="1" stop-color="'+sky2+'"/></linearGradient><radialGradient id="cl'+UIDS+'" cx=".4" cy=".3" r=".8"><stop offset="0" stop-color="#fff"/><stop offset=".7" stop-color="#e6eaf2"/><stop offset="1" stop-color="#b9c1d1"/></radialGradient><radialGradient id="cd'+UIDS+'" cx=".4" cy=".3" r=".8"><stop offset="0" stop-color="#9aa3b6"/><stop offset="1" stop-color="#4a5266"/></radialGradient><pattern id="gr'+UIDS+'" width="10" height="8" patternUnits="userSpaceOnUse"><rect width="10" height="8" fill="#5aa84d"/><path d="M1 8l1-4M5 8l-1-5M8 8l1-4" stroke="#3c8a3a" stroke-width="1"/></pattern></defs>';
  h+='<rect width="320" height="200" fill="url(#sk'+UIDS+')"/><rect x="0" y="'+GY+'" width="320" height="32" fill="url(#gr'+UIDS+')"/>';
  if(s.lift==='mtn')h+='<path d="M0 168L30 130L55 150L90 105L130 168Z" fill="#8b7d6b"/><path d="M90 105L100 118L84 116Z M30 130L38 140L24 138Z" fill="#fff"/>';
  if(s.lift==='sea')h+='<rect x="236" y="'+GY+'" width="84" height="32" fill="#2a7de1" opacity=".85"/><path d="M244 182Q252 178 260 182T276 182T292 182T308 182" stroke="#bfe1ff" fill="none" stroke-width="1.4"/><path d="M232 160l-12 0M232 160l4 -3M232 160l4 3" stroke="#fff" stroke-width="1.6" fill="none"/>';
  if(s.lift==='front')h+='<path d="M286 168L262 130L250 168Z" fill="#2a4ea8" opacity=".85"/><path d="M262 130L286 168" stroke="#fff" stroke-width="1" fill="none"/><text x="296" y="162" font-size="9" fill="#fff" font-weight="800">cold</text>';
  /* ground line markers */
  h+='<line x1="0" y1="'+px(st.lcl)+'" x2="320" y2="'+px(st.lcl)+'" stroke="#fff" stroke-width=".8" stroke-dasharray="3 3" opacity=".5"/><text x="4" y="'+(px(st.lcl)-3)+'" font-size="8" fill="#fff" opacity=".9">cloud base '+fx(st.lcl/1000,1)+' km</text>';
  if(storm){var base=px(st.lcl),top=px(st.top),hh=base-top,n=Math.max(5,Math.round(hh/9)),i,flash=0;
   var ph=t%2600;if(st.cape>=1000&&(ph<110||(ph>190&&ph<260)))flash=1;if(flash)h+='<rect width="320" height="200" fill="#fff" opacity=".28"/>';
   /* rain */
   if(k!=='cap'){var rn=Math.round(8+ten*18);for(i=0;i<rn;i++){var rx=cx-w*.8+(i/rn)*w*1.7+tilt*0.15,ry=((t/ (k==='shower'?22:12)+i*37)%(GY-base));h+='<line x1="'+rx.toFixed(1)+'" y1="'+(base+ry).toFixed(1)+'" x2="'+(rx-1.5).toFixed(1)+'" y2="'+(base+ry+7).toFixed(1)+'" stroke="#4a7bd0" stroke-width="1.2" opacity=".7"/>'}
    h+='<rect x="'+(cx-w*.95)+'" y="'+(base+4)+'" width="'+(w*1.9)+'" height="'+(GY-base-4)+'" fill="#4a7bd0" opacity="'+(.1+ten*.12)+'"/>'}
   if(st.cape>=2500)for(i=0;i<8;i++){var hx=cx-w*.6+(i*37%w*1.2),hy=((t/9+i*53)%(GY-base));h+='<circle cx="'+hx.toFixed(1)+'" cy="'+(base+hy).toFixed(1)+'" r="1.8" fill="#fff" stroke="#9aa6c0" stroke-width=".5"/>'}
   /* tower */
   var dark=ten>.35?'cd':'cl';
   for(i=0;i<=n;i++){var u=i/n,yy=base-hh*u,xx=cx+tilt*u*u,rr=(w*.55+w*.35*Math.sin(u*PI*.9+.2)+u*4)*(i%2?1:.88);h+='<circle cx="'+xx.toFixed(1)+'" cy="'+yy.toFixed(1)+'" r="'+Math.max(6,rr).toFixed(1)+'" fill="url(#'+(u<.18&&ten>.3?'cd':'cl')+UIDS+')"/>'}
   h+='<ellipse cx="'+cx+'" cy="'+(base-1)+'" rx="'+(w*1.1)+'" ry="7" fill="url(#cd'+UIDS+')"/>';
   if(st.el>=8500){var ax=cx+tilt,aw=w*1.5+s.S*.9;h+='<ellipse cx="'+(ax+s.S*.5)+'" cy="'+(top+2)+'" rx="'+aw+'" ry="'+(6+ten*5)+'" fill="url(#cl'+UIDS+')"/><ellipse cx="'+(ax+s.S*.9)+'" cy="'+(top+7)+'" rx="'+(aw*.8)+'" ry="4" fill="#cdd4e2" opacity=".8"/>'}
   if(flash){var rs=rng(Math.floor(t/2600)+3),bx=cx-w*.4+rs()*w*.8,by=base+2,bp='M'+bx+' '+by,j;for(j=1;j<=6;j++){bx+=(rs()-.5)*16;by+=(GY-base-2)/6;bp+='L'+bx.toFixed(1)+' '+by.toFixed(1)}h+='<path d="'+bp+'" fill="none" stroke="#fff6a8" stroke-width="2.6" stroke-linejoin="round"/><path d="'+bp+'" fill="none" stroke="#fff" stroke-width="1"/>'}
   if(k==='tornado'){var sw=Math.sin(t/260)*3,fp='M'+(cx-14+sw)+' '+(base+2)+'L'+(cx+14+sw)+' '+(base+2)+'L'+(cx+3+sw*1.6)+' '+GY+'L'+(cx-3+sw*1.6)+' '+GY+'Z';h+='<path d="'+fp+'" fill="#6b7287" opacity=".92"/>';for(i=0;i<7;i++){var a=t/120+i*.9;h+='<circle cx="'+(cx+sw*1.6+Math.cos(a)*(7+i))+'" cy="'+(GY-3-Math.abs(Math.sin(a*1.3))*9)+'" r="1.6" fill="#7a5a3a"/>'}}
   if(k==='cap'){h+='<path d="M'+(cx-60)+' '+px(st.lfc)+'H'+(cx+60)+'" stroke="#e8453c" stroke-width="2" stroke-dasharray="6 3"/><text x="'+(cx+62)+'" y="'+(px(st.lfc)+3)+'" font-size="8" fill="#e8453c" font-weight="800">lid</text>'}}
  else if(k==='fair'){var fc=[[90,0],[170,18],[230,-8]];fc.forEach(function(q,qi){var b=px(st.lcl),yb=b-qi*3;h+='<ellipse cx="'+q[0]+'" cy="'+yb+'" rx="22" ry="6" fill="#d4dae8"/><circle cx="'+(q[0]-8)+'" cy="'+(yb-6)+'" r="9" fill="url(#cl'+UIDS+')"/><circle cx="'+(q[0]+6)+'" cy="'+(yb-8)+'" r="11" fill="url(#cl'+UIDS+')"/>'})}
  h+='<text x="6" y="14" font-size="11" font-weight="800" text-anchor="start" fill="'+(storm?'#fff':'#17314f')+'">'+KIND[k]+'</text>';
  return svgW(h,'Storm scene: '+KIND[k],320,200,'lsv')}
 function sounding(){var W=320,H=150,L=34,T=10,R=312,B=130,x0=-100,x1=45,X=function(t){return L+(t-x0)/(x1-x0)*(R-L)},Y=function(z){return B-z/15000*(B-T)},h='<rect x="'+L+'" y="'+T+'" width="'+(R-L)+'" height="'+(B-T)+'" fill="none" stroke="#9aa0b4" opacity=".5"/>',i;
  for(i=0;i<=15;i+=3)h+='<line x1="'+L+'" x2="'+R+'" y1="'+Y(i*1000)+'" y2="'+Y(i*1000)+'" stroke="#9aa0b4" opacity=".2"/><text x="'+(L-3)+'" y="'+(Y(i*1000)+3)+'" text-anchor="end" font-size="8" fill="currentColor">'+i+'</text>';
  for(i=-100;i<=40;i+=20)h+='<text x="'+X(i)+'" y="'+(B+10)+'" text-anchor="middle" font-size="8" fill="currentColor">'+i+'</text>';
  var P=st.prof;if(st.lfc!==null&&st.el!==null){var up='',dn='';P.forEach(function(q){if(q[0]>=st.lfc&&q[0]<=st.el){up+=(up?'L':'M')+X(q[2]).toFixed(1)+' '+Y(q[0]).toFixed(1);dn='L'+X(q[1]).toFixed(1)+' '+Y(q[0]).toFixed(1)+dn}});h+='<path d="'+up+dn+'Z" fill="#ff9f43" opacity=".55"/>'}
  h+='<path d="'+P.map(function(q,j){return(j?'L':'M')+X(q[1]).toFixed(1)+' '+Y(q[0]).toFixed(1)}).join('')+'" fill="none" stroke="#2a7de1" stroke-width="2"/>';
  h+='<path d="'+P.map(function(q,j){return(j?'L':'M')+X(q[2]).toFixed(1)+' '+Y(q[0]).toFixed(1)}).join('')+'" fill="none" stroke="#e8453c" stroke-width="2" stroke-dasharray="5 3"/>';
  h+='<circle cx="'+X(st.Tp(st.lcl))+'" cy="'+Y(st.lcl)+'" r="3.4" fill="#fff" stroke="#e8453c" stroke-width="1.6"/><text x="'+(X(st.Tp(st.lcl))+6)+'" y="'+(Y(st.lcl)+3)+'" font-size="8" fill="currentColor">cloud base</text>';
  if(st.lfc!==null)h+='<text x="'+(R-4)+'" y="'+(Y(st.lfc)+3)+'" font-size="8" text-anchor="end" fill="currentColor">free convection '+fx(st.lfc/1000,1)+' km</text>';
  h+='<text x="'+((L+R)/2)+'" y="'+(H-4)+'" text-anchor="middle" font-size="9" fill="currentColor">Temperature (°C)  ·  blue = surrounding air, red = rising parcel, orange = buoyant energy</text><text x="6" y="'+(T+8)+'" font-size="8" fill="currentColor">km</text>';
  return svgW(h,'Temperature with height. Orange area is buoyant energy.',W,H)}
 function ro(){root.querySelector('#lro').innerHTML='Cloud base <b>'+fx(st.lcl/1000,1)+' km</b> · '+(st.lfc!==null?'lid <b>'+fx(st.lfc/1000,1)+' km</b> · top <b>'+fx(st.el/1000,1)+' km</b> · ':'no buoyant layer · ')+'energy (CAPE) <b>'+Math.round(st.cape)+' J/kg</b>. '+st.why}
 function recalc(){st=stormCalc(s);ch.innerHTML=sounding();ro()}
 function frame(ts){if(!A.alive(root))return;TIME=ts;wrap.innerHTML=scene(ts);anim=A.raf(frame)}
 A.bindSl(root,{T:' °C',Td:' °C',L:' °C/km',S:' kt'},function(k,v){s[k]=v;recalc()});
 A.chipSet(root,function(g,v){if(g==='lift'){s.lift=v}else{var P={cal:[24,10,6.5,5,'none'],pop:[32,22,8,10,'sea'],sev:[34,24,8.5,30,'front'],tor:[36,26,9,40,'front'],win:[2,0,6,15,'none']}[v];s.T=P[0];s.Td=P[1];s.L=P[2];s.S=P[3];s.lift=P[4];[['T',P[0],' °C'],['Td',P[1],' °C'],['L',P[2],' °C/km'],['S',P[3],' kt']].forEach(function(q){var i=root.querySelector('[data-ls="'+q[0]+'"]');if(i){i.value=q[1];root.querySelector('#lo_'+q[0]).textContent=q[1]+q[2]}});tog(root,'lift',P[4]);tog(root,'pre','')}recalc()});
 recalc();frame(A.now());}

/* ---------- Lens bench ---------- */
function lensLab(root){
 var s={f:6,div:false,d:14},SC=8,AX=100,LX=160;
 root.innerHTML='<p class="small mute">Drag the arrow along the bench, or use the arrow keys when it is focused. Three rays show where the image forms. Try placing the arrow beyond, at and inside the focal point.</p><div id="lsvw"></div>'+A.readout('lro')+A.sl('f','Focal length',3,10,.5,s.f,' cm')+'<div class="row" style="margin-top:6px"><span class="small mute">Lens</span> '+A.chips('ty',[['c','Converging'],['d','Diverging']],'c')+'</div>';
 var wrap=root.querySelector('#lsvw');
 function F(){return s.div?-s.f:s.f}
 function calc(){var f=F(),d=s.d,q=1/f-1/d,di=Math.abs(q)<.012?null:1/q;return{di:di,m:di===null?null:-di/d}}
 function draw(){var f=F(),r=calc(),xo=LX-s.d*SC,hh=34,yt=AX-hh,h='<defs><linearGradient id="lg1" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#bfe6ff" stop-opacity=".9"/><stop offset=".5" stop-color="#eaf7ff" stop-opacity=".95"/><stop offset="1" stop-color="#a8d8ff" stop-opacity=".9"/></linearGradient><linearGradient id="og" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffb347"/><stop offset="1" stop-color="#e8453c"/></linearGradient></defs>';
  h+='<line x1="0" y1="'+AX+'" x2="320" y2="'+AX+'" stroke="#9aa0b4" stroke-width="1.2" stroke-dasharray="1 3"/>';
  var fl=LX-f*SC,fr=LX+f*SC;[fl,fr].forEach(function(x){h+='<circle cx="'+x+'" cy="'+AX+'" r="2.6" fill="#5b4bff"/><text x="'+x+'" y="'+(AX+13)+'" text-anchor="middle" font-size="8" font-weight="700" fill="currentColor">F</text>'});
  /* rays */
  var ys1=yt,xF=LX+f*SC,ray='';
  /* ray 1: parallel then through (160+f*8,100) */
  var m1=(AX-ys1)/(xF-LX),endY=function(x,ysrc,xs,mm){return ysrc+mm*(x-xs)};
  var y1r=endY(320,ys1,LX,m1);
  h+='<line x1="'+xo+'" y1="'+yt+'" x2="'+LX+'" y2="'+ys1+'" stroke="#e8453c" stroke-width="1.6"/><line x1="'+LX+'" y1="'+ys1+'" x2="320" y2="'+y1r+'" stroke="#e8453c" stroke-width="1.6"/>';
  if(s.div||(r.di!==null&&r.di<0))h+='<line x1="'+LX+'" y1="'+ys1+'" x2="'+Math.max(0,Math.min(xF,LX-200))+'" y2="'+endY(Math.max(0,Math.min(xF,LX-200)),ys1,LX,m1)+'" stroke="#e8453c" stroke-width="1.2" stroke-dasharray="4 3"/>';
  /* ray 2: through centre */
  var m2=(AX-yt)/(LX-xo);h+='<line x1="'+xo+'" y1="'+yt+'" x2="320" y2="'+endY(320,yt,xo,m2)+'" stroke="#2a7de1" stroke-width="1.6"/>';
  /* ray 3: through the object-side focal point, then parallel */
  var xf2=LX-f*SC;if(Math.abs(xo-xf2)>1){var m3=(yt-AX)/(xo-xf2),yl=AX+m3*(LX-xf2);h+='<line x1="'+xo+'" y1="'+yt+'" x2="'+LX+'" y2="'+yl+'" stroke="#12935f" stroke-width="1.6"/><line x1="'+LX+'" y1="'+yl+'" x2="320" y2="'+yl+'" stroke="#12935f" stroke-width="1.6"/>';
   if(r.di!==null&&r.di<0)h+='<line x1="'+LX+'" y1="'+yl+'" x2="'+(LX+r.di*SC)+'" y2="'+yl+'" stroke="#12935f" stroke-width="1.2" stroke-dasharray="4 3"/>'}
  /* lens */
  h+=s.div?'<path d="M153 28Q160 100 153 172H167Q160 100 167 28Z" fill="url(#lg1)" stroke="#5d8fb8" stroke-width="1.4"/>':'<path d="M160 28Q182 100 160 172Q138 100 160 28Z" fill="url(#lg1)" stroke="#5d8fb8" stroke-width="1.4"/>';
  h+='<path d="M154 40Q150 100 154 160" fill="none" stroke="#fff" stroke-width="1.6" opacity=".6"/>';
  /* object */
  h+='<g data-dr="obj" tabindex="0" role="slider" aria-label="Object distance" aria-valuemin="1.5" aria-valuemax="19" aria-valuenow="'+s.d+'" aria-valuetext="'+fx(s.d,1)+' centimetres from the lens" style="cursor:grab"><rect x="'+(xo-14)+'" y="'+(yt-8)+'" width="28" height="'+(hh+22)+'" fill="#fff" opacity="0"/><line x1="'+xo+'" y1="'+AX+'" x2="'+xo+'" y2="'+(yt+6)+'" stroke="#ff8a3d" stroke-width="5" stroke-linecap="round"/><path d="M'+(xo-7)+' '+(yt+9)+'L'+xo+' '+(yt-2)+'L'+(xo+7)+' '+(yt+9)+'Z" fill="#ff8a3d"/></g>';
  /* image */
  if(r.di!==null){var xi=LX+r.di*SC,yi=AX-r.m*hh,real=r.di>0;if(xi>-30&&xi<350){h+='<line x1="'+xi+'" y1="'+AX+'" x2="'+xi+'" y2="'+(yi+(r.m>0?6:-6))+'" stroke="#8a4fd6" stroke-width="'+(real?5:3)+'" stroke-linecap="round" '+(real?'':'stroke-dasharray="4 3" ')+'opacity="'+(real?1:.8)+'"/><path d="M'+(xi-7)+' '+(yi+(r.m>0?9:-9))+'L'+xi+' '+(yi+(r.m>0?-2:2))+'L'+(xi+7)+' '+(yi+(r.m>0?9:-9))+'Z" fill="#8a4fd6" opacity="'+(real?1:.65)+'"/>'}}
  wrap.innerHTML=svgW(h,'Lens bench',320,200,'lsv');ro()}
 function ro(){var r=calc(),e=root.querySelector('#lro');if(r.di===null){e.innerHTML='Object <b>'+fx(s.d,1)+' cm</b> from the lens, exactly at the focal point. The rays come out parallel, so <b>no image forms</b>.';return}
  var kind=r.di>0?'real':'virtual',up=r.m>0?'upright':'upside down',sz=Math.abs(r.m)>1.02?'bigger':Math.abs(r.m)<.98?'smaller':'same size';
  e.innerHTML='Object <b>'+fx(s.d,1)+' cm</b> · image <b>'+fx(Math.abs(r.di),1)+' cm</b> '+(r.di>0?'beyond':'in front of')+' the lens · magnification <b>'+fx(r.m,2).replace('-','−')+'×</b> · <b>'+kind+', '+up+', '+sz+'</b>'}
 dragger(wrap,function(ev,id,p){if(ev==='key'){s.d=Math.max(1.5,Math.min(19,s.d-p[0]*.5))}else if(ev==='up')return;else s.d=Math.max(1.5,Math.min(19,Math.round((LX-p[0])/SC*4)/4));keep(wrap,draw)});
 A.bindSl(root,{f:' cm'},function(k,v){s.f=v;draw()});
 A.chipSet(root,function(g,v){s.div=v==='d';draw()});
 draw()}

/* ---------- Ripple tank ---------- */
function rippleLab(root){
 var s={lam:12,d:36,mode:'in',one:false},CW=200,CH=125,anim=null,cv,ctx,img;
 root.innerHTML='<p class="small mute">Two dippers make circular ripples. Where crests meet crests the water jumps high. Where a crest meets a trough it stays flat, and those quiet lines fan out from between the dippers. Change the wavelength and the gap and count the quiet lines.</p><canvas id="rtc" width="'+CW+'" height="'+CH+'" role="img" aria-label="Ripple tank with two wave sources" style="display:block;width:100%;max-width:520px;margin:0 auto 8px;border-radius:14px;border:1px solid var(--line);background:#0b3a6e"></canvas>'+A.readout('lro')+A.sl('lam','Wavelength',6,24,1,s.lam,' px')+A.sl('d','Gap between dippers',8,70,2,s.d,' px')+'<div class="row" style="margin-top:6px"><span class="small mute">Dippers</span> '+A.chips('md',[['in','In step'],['out','Opposite'],['one','Just one']],'in')+'</div>';
 cv=root.querySelector('#rtc');ctx=cv.getContext('2d');img=ctx.createImageData(CW,CH);
 function srcs(){var y=CH/2;return s.one?[[34,y]]:[[34,y-s.d/2],[34,y+s.d/2]]}
 function paint(t){var S=srcs(),lam=s.lam,w=2*PI/lam,sp=34,ph=t/1000*sp*w,d=img.data,x,y,k,i=0,sg=s.mode==='out'?PI:0;
  for(y=0;y<CH;y++)for(x=0;x<CW;x++){var v=0;for(k=0;k<S.length;k++){var dx=x-S[k][0],dy=y-S[k][1],r=Math.sqrt(dx*dx+dy*dy);v+=Math.cos(w*r-ph+(k?sg:0))/Math.sqrt(r*.12+1.6)}
   var u=Math.max(-1,Math.min(1,v/(S.length>1?1.7:1))),q=(u+1)/2;
   d[i]=Math.round(10+q*q*200);d[i+1]=Math.round(60+q*150);d[i+2]=Math.round(120+q*130);d[i+3]=255;i+=4}
  ctx.putImageData(img,0,0);S.forEach(function(p){ctx.beginPath();ctx.arc(p[0],p[1],3.2,0,2*PI);ctx.fillStyle='#ffd23f';ctx.fill();ctx.strokeStyle='#7a5a00';ctx.lineWidth=1;ctx.stroke()})}
 function ro(){var q=s.d/s.lam,n=s.one?0:(s.mode==='in'?2*Math.floor(q+.5):2*Math.floor(q)+1);root.querySelector('#lro').innerHTML=s.one?'One dipper: circular ripples spread out evenly. Wavelength <b>'+s.lam+' px</b>.':'Wavelength <b>'+s.lam+' px</b> · gap <b>'+s.d+' px</b> (<b>'+fx(q,1)+'</b> wavelengths) · quiet lines: <b>'+n+'</b>'}
 function frame(ts){if(!A.alive(root))return;paint(ts);anim=A.raf(frame)}
 A.bindSl(root,{lam:' px',d:' px'},function(k,v){s[k]=v;ro()});
 A.chipSet(root,function(g,v){s.mode=v==='one'?'in':v;s.one=v==='one';ro()});
 ro();frame(A.now())}

/* ---------- Inclined plane ---------- */
var SURF={ice:{n:'Ice',mu:.05},wood:{n:'Wood',mu:.35},rubber:{n:'Rubber',mu:.8},sand:{n:'Sandpaper',mu:1.1}};
function inclineLab(root){
 var s={a:25,m:4,sf:'wood',t:null,run:false,forces:false},anim=null,U=++UID,PXM=60,g=9.8,B=[290,170];
 root.innerHTML='<p class="small mute">Tilt the ramp, pick a surface and press Release. Friction holds the block until the slope is steep enough. Then try a heavier block. Does it slide any faster?</p><div id="lsvw"></div>'+A.readout('lro')+A.sl('a','Slope angle',0,60,1,s.a,'°')+A.sl('m','Block mass',1,10,1,s.m,' kg')+'<div class="row" style="margin-top:6px"><span class="small mute">Surface</span> '+A.chips('sf',Object.keys(SURF).map(function(k){return[k,SURF[k].n]}),s.sf)+'</div><div class="row" style="margin-top:6px"><span class="small mute">Force arrows</span> '+A.chips('fa',[[0,'Hide'],[1,'Show']],0)+'</div><div class="row" style="margin-top:8px"><button class="btn" data-la="go">Release</button> <button class="btn sec" data-la="top">Back to top</button></div>';
 var wrap=root.querySelector('#lsvw');
 function phys(){var th=s.a*PI/180,mu=SURF[s.sf].mu,slide=Math.tan(th)>mu&&s.a>0,acc=slide?g*(Math.sin(th)-mu*Math.cos(th)):0,Lm=Math.min(230,150/Math.max(.2,Math.sin(th)))/PXM;return{th:th,mu:mu,slide:slide,a:acc,L:Lm,crit:Math.atan(mu)*180/PI}}
 function tex(){var a=s.a,t={ice:'<rect width="14" height="10" fill="#d8f0ff"/><path d="M0 7L14 2M3 10L10 0" stroke="#fff" stroke-width="1.2" opacity=".9"/>',wood:'<rect width="22" height="10" fill="#b98550"/><path d="M0 3Q6 1 11 3T22 3M0 7Q6 5 11 7T22 7" stroke="#8a5d30" stroke-width="1" fill="none"/><circle cx="15" cy="5" r="1.4" fill="#7a4e26"/>',rubber:'<rect width="8" height="8" fill="#3b3d46"/><circle cx="2" cy="2" r="1" fill="#555866"/><circle cx="6" cy="6" r="1" fill="#555866"/>',sand:'<rect width="10" height="10" fill="#c9a66b"/><circle cx="2" cy="2" r=".8" fill="#8a6b38"/><circle cx="7" cy="4" r=".7" fill="#e6c88e"/><circle cx="4" cy="8" r=".8" fill="#8a6b38"/><circle cx="9" cy="9" r=".6" fill="#6e5228"/>'}[s.sf],w={ice:14,wood:22,rubber:8,sand:10}[s.sf];return'<pattern id="rp'+U+'" width="'+w+'" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate('+a+')">'+t+'</pattern>'}
 function arrow(x,y,dx,dy,col,lab){var m=Math.hypot(dx,dy);if(m<3)return'';var ux=dx/m,uy=dy/m,ex=x+dx,ey=y+dy;return'<line x1="'+x+'" y1="'+y+'" x2="'+ex+'" y2="'+ey+'" stroke="'+col+'" stroke-width="2.4"/><path d="M'+ex+' '+ey+'l'+(-ux*7-uy*4)+' '+(-uy*7+ux*4)+'M'+ex+' '+ey+'l'+(-ux*7+uy*4)+' '+(-uy*7-ux*4)+'" stroke="'+col+'" stroke-width="2.4" fill="none"/><text x="'+(ex+ux*9)+'" y="'+(ey+uy*9+3)+'" font-size="9" font-weight="800" text-anchor="middle" fill="'+col+'">'+lab+'</text>'}
 function draw(){var P=phys(),th=P.th,c=Math.cos(th),sn=Math.sin(th),Ll=P.L*PXM,T=[B[0]-Ll*c,B[1]-Ll*sn],sd=s.t==null?0:Math.min(P.L,.5*P.a*s.t*s.t),size=22+s.m*1.6,
  dirx=c,diry=sn,nx=sn,ny=-c,bx=T[0]+dirx*(sd*PXM+size/2+4)+nx*size/2,by=T[1]+diry*(sd*PXM+size/2+4)+ny*size/2,
  h='<defs>'+tex()+'<linearGradient id="bk'+U+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd27a"/><stop offset="1" stop-color="#e08a00"/></linearGradient></defs>';
  h+='<rect x="0" y="'+B[1]+'" width="320" height="30" fill="#cdd3dc" opacity=".6"/><line x1="0" y1="'+B[1]+'" x2="320" y2="'+B[1]+'" stroke="#7a8499" stroke-width="2"/>';
  h+='<path d="M'+T[0]+' '+T[1]+'L'+B[0]+' '+B[1]+'L'+T[0]+' '+B[1]+'Z" fill="url(#rp'+U+')" stroke="#5a6178" stroke-width="1.4" stroke-linejoin="round"/><path d="M'+T[0]+' '+T[1]+'L'+B[0]+' '+B[1]+'" stroke="#3a4054" stroke-width="2.2"/>';
  h+='<path d="M'+(B[0]-Ll*.0-50)+' '+B[1]+'A50 50 0 0 0 '+(B[0]-50*c)+' '+(B[1]-50*sn)+'" fill="none" stroke="#e8453c" stroke-width="1.4" opacity="'+(s.a>0?1:0)+'"/><text x="'+(B[0]-70)+'" y="'+(B[1]-6)+'" font-size="10" font-weight="800" fill="#e8453c">'+s.a+'°</text>';
  h+='<g transform="translate('+bx.toFixed(1)+' '+by.toFixed(1)+') rotate('+s.a+')"><rect x="'+(-size/2)+'" y="'+(-size/2)+'" width="'+size+'" height="'+size+'" rx="3" fill="url(#bk'+U+')" stroke="#8a5600" stroke-width="1.4"/><text x="0" y="3.5" text-anchor="middle" font-size="10" font-weight="800" fill="#5a3600" transform="rotate('+(-s.a)+')">'+s.m+' kg</text></g>';
  if(s.forces){var k=.62,W=s.m*g*k,N=s.m*g*c*k,Fr=P.slide?s.m*g*P.mu*c*k:s.m*g*sn*k,Fn=P.slide?(s.m*g*sn-s.m*g*P.mu*c)*k:0;
   h+=arrow(bx,by,0,W,'#e8453c','mg')+arrow(bx,by,nx*N,ny*N,'#2a7de1','N')+arrow(bx,by,-dirx*Fr,-diry*Fr,'#12935f','friction')+(Fn>2?arrow(bx+8,by-6,dirx*Fn,diry*Fn,'#8a4fd6','net'):'')}
  wrap.innerHTML=svgW(h,'Inclined plane',320,200,'lsv');ro(P,sd)}
 function ro(P,sd){var e=root.querySelector('#lro'),tt=P.slide?Math.sqrt(2*P.L/P.a):null;
  e.innerHTML='Starts to slide above <b>'+fx(P.crit,1)+'°</b> on '+SURF[s.sf].n.toLowerCase()+' (μ = '+P.mu+') · '+(P.slide?'acceleration <b>'+fx(P.a,2)+' m/s²</b> · time down <b>'+fx(tt,1)+' s</b>'+(s.t!=null?' · speed <b>'+fx(P.a*Math.min(s.t,tt),1)+' m/s</b>':''):'<b>stuck</b>: friction is big enough to hold it')}
 function stop(){if(anim)A.caf(anim);anim=null;s.t=null;s.run=false}
 function frame(ts){if(!A.alive(root))return;if(s.t0==null)s.t0=ts;s.t=(ts-s.t0)/1000;var P=phys();draw();if(P.slide&&.5*P.a*s.t*s.t<P.L)anim=A.raf(frame);else{s.run=false;anim=null}}
 A.bindSl(root,{a:'°',m:' kg'},function(k,v){s[k]=v;stop();draw()});
 A.chipSet(root,function(g,v){if(g==='sf'){s.sf=v;stop()}else s.forces=v==='1';draw()});
 root.addEventListener('click',function(e){var a=e.target.closest('[data-la]');if(!a)return;if(a.dataset.la==='go'){stop();s.t0=null;s.t=0;s.run=true;anim=A.raf(frame)}else{stop();draw()}draw()});
 draw()}

var SET=[
 {id:'bread',t:'Breadboard',d:'Wire up LEDs and resistors. Burn one out to learn why',make:breadboard,p:['circuit-lab-b','quanta-physics']},
 {id:'storm',t:'Make a storm',d:'Heat, moisture, lift and shear build a thunderstorm',make:stormLab,p:['meteorology-b']},
 {id:'lens',t:'Lens bench',d:'Move an object and watch the image form',make:lensLab,p:['quanta-physics']},
 {id:'ripple',t:'Ripple tank',d:'Two wave sources and quiet interference lines',make:rippleLab,p:['quanta-physics']},
 {id:'incline',t:'Ramp and friction',d:'Tilt, change surface and mass, see the forces',make:inclineLab,p:['quanta-physics']}
];
SET.forEach(function(l){A.LABS.push(l)});
A.ANIM.storm=1;A.ANIM.ripple=1;A.ANIM.incline=1;
})();
