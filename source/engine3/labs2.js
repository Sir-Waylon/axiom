/* ===== Labs 2: textured worlds and bigger free-roam simulations =====
   Gravity and orbits, breadboard, mystery component, make-a-storm, lens, ripple tank, inclined plane.
   Uses the helpers that sandbox.js shares through window.__labApi (virtual clock, sliders, chips). ===== */
(function(){
var A=window.__labApi;if(!A)return;
var UID=0,PI=Math.PI;
function esc2(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function fx(x,d){return (+x).toFixed(d==null?1:d)}
function rng(seed){var a=seed|0;return function(){a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
/* pointer dragging on a stable wrapper, so handles survive redraws */
function dragger(wrap,cb){var dn=null;
 function pt(e){var s=wrap.querySelector('svg'),r=s.getBoundingClientRect(),vb=s.viewBox.baseVal;return[(e.clientX-r.left)*vb.width/r.width,(e.clientY-r.top)*vb.height/r.height]}
 wrap.addEventListener('pointerdown',function(e){var h=e.target.closest&&e.target.closest('[data-dr]');if(!h)return;dn=h.dataset.dr;try{wrap.setPointerCapture(e.pointerId)}catch(x){}e.preventDefault();cb('down',dn,pt(e))});
 wrap.addEventListener('pointermove',function(e){if(dn)cb('move',dn,pt(e))});
 function up(){if(dn){var d=dn;dn=null;cb('up',d)}}wrap.addEventListener('pointerup',up);wrap.addEventListener('pointercancel',up);
 wrap.addEventListener('keydown',function(e){var h=e.target.closest&&e.target.closest('[data-dr]');if(!h)return;var m={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[e.key];if(!m)return;e.preventDefault();cb('key',h.dataset.dr,m)})}
function keep(wrap,fn){var a=document.activeElement,id=a&&a.dataset&&a.dataset.dr;fn();if(id){var n=wrap.querySelector('[data-dr="'+id+'"]');if(n)try{n.focus({preventScroll:true})}catch(x){}}}
function svgW(inner,label,w,h,id){return '<svg'+(id?' id="'+id+'"':'')+' viewBox="0 0 '+w+' '+h+'" role="group" aria-label="'+label+'" class="lsvg">'+inner+'</svg>'}

/* ---------- Surface textures (SVG patterns), shared by the labs ---------- */
function planetUnit(k,u){var g='pg'+u,c='pc'+u,s='ps'+u;
 var B={sun:['#fff7b0','#ffb300','#e65100'],earth:['#8fd3ff','#2a79d6','#0c2f6e'],mars:['#f4ad82','#c4532f','#6e2615'],moon:['#f2f2f2','#aaaab0','#55555e'],jupiter:['#f8e0ba','#cc975e','#6b4426'],venus:['#fdeab0','#dba845','#7a5410'],neptune:['#93b9ff','#3f66d8','#16277a']}[k]||['#eee','#999','#444'];
 var d='<defs><radialGradient id="'+g+'" cx=".35" cy=".3" r=".95"><stop offset="0" stop-color="'+B[0]+'"/><stop offset=".55" stop-color="'+B[1]+'"/><stop offset="1" stop-color="'+B[2]+'"/></radialGradient><clipPath id="'+c+'"><circle r="1"/></clipPath><radialGradient id="'+s+'" cx=".4" cy=".35" r=".8"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".42"/></radialGradient></defs>';
 var o='<circle r="1" fill="url(#'+g+')"/><g clip-path="url(#'+c+')">';
 if(k==='earth')o+='<path d="M-.7 -.35C-.5 -.7 -.15 -.6 -.05 -.35C.05 -.15 -.25 -.05 -.3 .2C-.35 .45 -.55 .3 -.65 .05C-.75 -.1 -.8 -.2 -.7 -.35Z" fill="#46a352"/><path d="M.2 -.5C.5 -.6 .85 -.3 .75 -.05C.65 .2 .45 .1 .35 .35C.25 .6 .1 .5 .15 .2C.2 0 .05 -.3 .2 -.5Z" fill="#3b9248"/><path d="M-.2 .6C0 .55 .2 .75 .1 .9C-.1 .95 -.3 .8 -.2 .6Z" fill="#5fb25b"/><ellipse cx="0" cy="-.93" rx=".5" ry=".14" fill="#fff" opacity=".9"/><ellipse cx="0" cy=".95" rx=".4" ry=".1" fill="#fff" opacity=".85"/><path d="M-.8 -.05Q-.5 -.15 -.2 -.02M.1 .08Q.4 -.02 .75 .12M-.5 .5Q-.2 .4 .2 .55" stroke="#fff" stroke-width=".11" stroke-linecap="round" fill="none" opacity=".6"/>';
 else if(k==='moon')o+='<circle cx="-.35" cy="-.3" r=".22" fill="#7d7d85" opacity=".55"/><circle cx="-.35" cy="-.3" r=".22" fill="none" stroke="#e8e8ee" stroke-width=".04" opacity=".6"/><circle cx=".35" cy="-.1" r=".3" fill="#80808a" opacity=".5"/><circle cx=".35" cy="-.1" r=".3" fill="none" stroke="#e8e8ee" stroke-width=".04" opacity=".5"/><circle cx="-.1" cy=".45" r=".18" fill="#84848c" opacity=".55"/><circle cx=".55" cy=".5" r=".1" fill="#80808a" opacity=".6"/><circle cx="-.6" cy=".25" r=".1" fill="#80808a" opacity=".6"/><circle cx=".05" cy="-.65" r=".1" fill="#80808a" opacity=".55"/>';
 else if(k==='mars')o+='<ellipse cx="-.25" cy=".05" rx=".45" ry=".2" fill="#7a2f18" opacity=".5"/><ellipse cx=".35" cy="-.25" rx=".3" ry=".14" fill="#8b3a1e" opacity=".45"/><ellipse cx=".15" cy=".5" rx=".3" ry=".12" fill="#8b3a1e" opacity=".4"/><ellipse cx="0" cy="-.95" rx=".35" ry=".13" fill="#fff" opacity=".9"/><ellipse cx="-.55" cy="-.45" rx=".14" ry=".08" fill="#e8a070" opacity=".6"/>';
 else if(k==='jupiter'){var bs=[-.82,-.6,-.38,-.14,.1,.34,.58,.8],i;for(i=0;i<bs.length;i++)o+='<rect x="-1" y="'+bs[i]+'" width="2" height="'+(i%2?.16:.22)+'" fill="'+(i%2?'#f1d5a8':'#9a5d34')+'" opacity=".55"/>';o+='<path d="M-1 -.02Q-.5 -.1 0 -.02T1 -.02" stroke="#fff" stroke-width=".05" fill="none" opacity=".35"/><ellipse cx=".38" cy=".3" rx=".2" ry=".12" fill="#b8452c"/><ellipse cx=".38" cy=".3" rx=".2" ry=".12" fill="none" stroke="#f2c9a5" stroke-width=".03"/>'}
 else if(k==='sun')o+='<circle cx="-.3" cy="-.2" r=".09" fill="#a33a00" opacity=".6"/><circle cx=".35" cy=".25" r=".12" fill="#a33a00" opacity=".55"/><circle cx=".1" cy="-.5" r=".06" fill="#a33a00" opacity=".6"/><path d="M-.9 .1Q-.4 -.1 0 .1T.9 .0" stroke="#ffe08a" stroke-width=".07" fill="none" opacity=".5"/>';
 else if(k==='venus')o+='<path d="M-1 -.5Q-.5 -.7 0 -.5T1 -.5M-1 -.1Q-.5 -.3 0 -.1T1 -.1M-1 .3Q-.5 .1 0 .3T1 .3M-1 .7Q-.5 .5 0 .7T1 .7" stroke="#fff4cf" stroke-width=".12" fill="none" opacity=".5"/>';
 else if(k==='neptune')o+='<path d="M-1 -.4Q-.4 -.55 .2 -.4T1 -.45M-1 .2Q-.4 .05 .2 .2T1 .15" stroke="#cfe0ff" stroke-width=".07" fill="none" opacity=".5"/><ellipse cx="-.3" cy=".35" rx=".22" ry=".12" fill="#1a2f9c" opacity=".6"/>';
 return d+o+'</g><circle r="1" fill="url(#'+s+')"/>'}
function planet(k,cx,cy,r){var u=++UID,glow=k==='sun'?'<defs><radialGradient id="sg'+u+'"><stop offset=".55" stop-color="#ffd23f" stop-opacity=".75"/><stop offset="1" stop-color="#ffd23f" stop-opacity="0"/></radialGradient></defs><circle cx="'+cx+'" cy="'+cy+'" r="'+(r*1.7)+'" fill="url(#sg'+u+')"/>':'';return glow+'<g transform="translate('+cx+' '+cy+') scale('+r+')">'+planetUnit(k,u)+'</g>'}
/* ground textures: one tile pattern per world, drawn into a band 30 high at the bottom of the projectile lab */
function ground(w){var u=++UID,p='gp'+u,t={
 Earth:['#5fae52','<rect width="16" height="12" fill="#5fae52"/><path d="M2 12l1.5-6M6 12l-1-5M10 12l1-7M14 12l-1.5-6" stroke="#3f8a3a" stroke-width="1.3" stroke-linecap="round"/><circle cx="8" cy="3" r="1" fill="#f6d84c"/>','#e4f2ff'],
 Moon:['#b9b9c0','<rect width="22" height="12" fill="#b9b9c0"/><ellipse cx="6" cy="6" rx="4" ry="2" fill="#9a9aa3"/><ellipse cx="6" cy="5.4" rx="4" ry="1.6" fill="none" stroke="#d8d8de" stroke-width=".8"/><circle cx="17" cy="8" r="1.4" fill="#8e8e98"/>','#ececf3'],
 Mars:['#c4693f','<rect width="20" height="12" fill="#c4693f"/><path d="M0 4Q5 1 10 4T20 4" stroke="#a24f2a" stroke-width="1.4" fill="none"/><ellipse cx="14" cy="9" rx="3" ry="1.6" fill="#8e3f20"/><circle cx="4" cy="9" r="1.2" fill="#e08a5c"/>','#fdeadb'],
 Jupiter:['#d9a46a','<rect width="24" height="12" fill="#e2b684"/><path d="M0 3Q6 0 12 3T24 3M0 8Q6 5 12 8T24 8" stroke="#b3763f" stroke-width="2.2" fill="none" opacity=".75"/><path d="M0 11Q6 9 12 11T24 11" stroke="#f6e2bf" stroke-width="1.4" fill="none"/>','#f8ecd2']}[w]||['#cdd3dc','<rect width="10" height="10" fill="#cdd3dc"/>','#f3f4f8'];
 var wd=t[1].match(/width="(\d+)"/)[1];
 return '<defs><pattern id="'+p+'" width="'+wd+'" height="12" patternUnits="userSpaceOnUse">'+t[1]+'</pattern></defs><rect x="0" y="0" width="320" height="170" fill="'+t[2]+'" opacity=".4"/><rect x="0" y="170" width="320" height="30" fill="url(#'+p+')"/>'}
window.__labTex={planet:planet,ground:ground,surface:null};
/* stars: fixed pattern so the sky does not shimmer */
function stars(n,w,h,seed){var r=rng(seed||7),o='';for(var i=0;i<n;i++)o+='<circle cx="'+(r()*w).toFixed(1)+'" cy="'+(r()*h).toFixed(1)+'" r="'+(r()<.2?1.1:.6)+'" fill="#9aa4c0" opacity="'+(.3+r()*.5).toFixed(2)+'"/>';return o}

/* ---------- Gravity and orbits ---------- */
var BODY=[['moon','Moon',14,.2],['mars','Mars',18,.5],['earth','Earth',22,1],['jupiter','Jupiter',34,3],['sun','Sun',40,6]];
function orbitLab(root){
 var GM0=135000,s={b:'earth',x:245,y:100,vx:0,vy:-36,go:false,trail:[],msg:'',t0:null,crash:false,gone:false},CX=160,CY=100,anim=null,last=null;
 function body(){return BODY.filter(function(b){return b[0]===s.b})[0]}
 function GM(){return GM0*body()[3]}
 root.innerHTML='<p class="small mute">Drag the small moon to choose where it starts, and drag the green arrow to choose how fast it goes. The dashed line is the path it will follow. Press Launch. Then change the planet, because a bigger planet pulls harder.</p><div id="lsvw"></div>'+A.readout('lro')+'<div class="row"><button class="btn" data-la="go">Launch</button> <button class="btn sec" data-la="circ">Make it circular</button> <button class="btn sec" data-la="stop">Back to setup</button></div><div class="row" style="margin-top:6px"><span class="small mute">Planet</span> '+A.chips('b',BODY.map(function(b){return[b[0],b[1]]}),s.b)+'</div>';
 var wrap=root.querySelector('#lsvw');
 wrap.innerHTML=A.svgHTML('<g id="st"></g><g id="dyn"></g>','Gravity lab');
 function staticLayer(){var b=body(),st=wrap.querySelector('#st');st.innerHTML='<rect width="320" height="200" fill="#0b1030" opacity=".92"/>'+stars(46,320,200,11)+planet(b[0],CX,CY,b[2])}
 function dist(){return Math.hypot(s.x-CX,s.y-CY)}
 function path(x,y,vx,vy,steps){var pts=[[x,y]],g=GM(),dt=.02,R=body()[2],k;for(k=0;k<steps;k++){var r2=(x-CX)*(x-CX)+(y-CY)*(y-CY),r=Math.sqrt(r2),a=-g/r2/r;vx+=a*(x-CX)*dt;vy+=a*(y-CY)*dt;x+=vx*dt;y+=vy*dt;if(Math.hypot(x-CX,y-CY)<R+3){pts.push([x,y]);break}if(k%6===0)pts.push([x,y])}return pts}
 function dyn(){var h='',b=body(),g=wrap.querySelector('#dyn'),pp;
  if(!s.go){pp=path(s.x,s.y,s.vx,s.vy,1600);h+='<path d="'+pp.map(function(p,i){return(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)}).join('')+'" fill="none" stroke="#9fb0ff" stroke-width="1.4" stroke-dasharray="4 3" opacity=".8"/>'}
  else if(s.trail.length>1)h+='<path d="'+s.trail.map(function(p,i){return(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)}).join('')+'" fill="none" stroke="#7de0ff" stroke-width="1.8" opacity=".85"/>';
  var ex=s.x+s.vx*.9,ey=s.y+s.vy*.9;
  if(!s.go)h+='<line x1="'+s.x+'" y1="'+s.y+'" x2="'+ex+'" y2="'+ey+'" stroke="#3ddc97" stroke-width="2.4"/><g data-dr="vel" tabindex="0" role="slider" aria-label="Launch velocity arrow" style="cursor:grab"><circle cx="'+ex+'" cy="'+ey+'" r="9" fill="#3ddc97" opacity=".92"/><path d="M'+(ex-3)+' '+(ey+3)+'L'+(ex+3)+' '+(ey-3)+'M'+(ex+3)+' '+(ey-3)+'h-4M'+(ex+3)+' '+(ey-3)+'v4" stroke="#0b1030" stroke-width="1.6" fill="none"/></g>';
  if(s.crash)h+='<text x="160" y="22" text-anchor="middle" font-size="12" font-weight="700" fill="#ff8a8a">Crash! The moon hit the planet.</text>';
  if(s.gone)h+='<text x="160" y="22" text-anchor="middle" font-size="12" font-weight="700" fill="#ffd23f">Escaped! It is moving too fast to stay.</text>';
  h+='<g'+(s.go?'':' data-dr="pos" tabindex="0" role="slider" aria-label="Moon start position" style="cursor:grab"')+'>'+(s.go?'':'<circle cx="'+s.x+'" cy="'+s.y+'" r="13" fill="#fff" opacity=".12"/>')+planet('moon',s.x,s.y,6)+'</g>';
  g.innerHTML=h;ro()}
 function ro(){var r=dist(),v=Math.hypot(s.vx,s.vy),g=GM(),vc=Math.sqrt(g/r),E=v*v/2-g/r,h=(s.x-CX)*s.vy-(s.y-CY)*s.vx,e=Math.sqrt(Math.max(0,1+2*E*h*h/(g*g))),kind=E>=0?'escape path':e<.05?'circle':'ellipse';
  root.querySelector('#lro').innerHTML='Distance <b>'+fx(r,0)+'</b> · speed <b>'+fx(v,0)+'</b> · speed for a circle here <b>'+fx(vc,0)+'</b> · escape speed <b>'+fx(vc*Math.SQRT2,0)+'</b> · path: <b>'+kind+'</b>'}
 function full(){staticLayer();dyn()}
 function clampPos(px,py){var R=body()[2]+14,dx=px-CX,dy=py-CY,d=Math.hypot(dx,dy)||1;if(d<R){dx*=R/d;dy*=R/d}d=Math.hypot(dx,dy);if(d>92){dx*=92/d;dy*=92/d}s.x=CX+dx;s.y=CY+dy}
 function circ(){var r=dist(),v=Math.sqrt(GM()/r),nx=-(s.y-CY)/r,ny=(s.x-CX)/r;s.vx=nx*v;s.vy=ny*v}
 dragger(wrap,function(ev,id,p){if(s.go)return;if(ev==='key'){if(id==='pos')clampPos(s.x+p[0]*4,s.y+p[1]*4);else{s.vx+=p[0]*4;s.vy+=p[1]*4}keep(wrap,dyn);return}if(ev==='up')return;
  if(id==='pos')clampPos(p[0],p[1]);else{var vx=(p[0]-s.x)/.9,vy=(p[1]-s.y)/.9,m=Math.hypot(vx,vy);if(m>130){vx*=130/m;vy*=130/m}s.vx=vx;s.vy=vy}keep(wrap,dyn)});
 function step(ts){if(!A.alive(root))return;var dt=last==null?0:Math.min(.05,(ts-last)/1000);last=ts;var g=GM(),R=body()[2],k;
  for(k=0;k<8;k++){var h=dt/8,r2=(s.x-CX)*(s.x-CX)+(s.y-CY)*(s.y-CY),r=Math.sqrt(r2),a=-g/r2/r;s.vx+=a*(s.x-CX)*h;s.vy+=a*(s.y-CY)*h;s.x+=s.vx*h;s.y+=s.vy*h;
   if(Math.hypot(s.x-CX,s.y-CY)<R+3){s.crash=true;s.go=false;break}if(Math.hypot(s.x-CX,s.y-CY)>400){s.gone=true;s.go=false;break}}
  s.trail.push([s.x,s.y]);if(s.trail.length>260)s.trail.shift();dyn();if(s.go)anim=A.raf(step)}
 root.addEventListener('click',function(e){var b=e.target.closest('[data-lc]'),a=e.target.closest('[data-la]');
  if(b){var k=b.dataset.lc.split(':');if(k[0]==='b'){s.b=k[1];[].forEach.call(root.querySelectorAll('[data-lc^="b:"]'),function(c){var on=c===b;c.classList.toggle('on',on);c.setAttribute('aria-pressed',on)});s.go=false;s.crash=false;s.gone=false;clampPos(s.x,s.y);full()}}
  if(a){var v=a.dataset.la;if(v==='circ'){circ();s.go=false;s.crash=s.gone=false;dyn()}else if(v==='go'){if(s.go)return;s.crash=s.gone=false;s.go=true;s.trail=[];last=null;s.s0=[s.x,s.y,s.vx,s.vy];anim=A.raf(step)}else if(v==='stop'){if(anim)A.caf(anim);s.go=false;if(s.s0){s.x=s.s0[0];s.y=s.s0[1];s.vx=s.s0[2];s.vy=s.s0[3]}s.crash=s.gone=false;s.trail=[];dyn()}}});
 circ();full()}

/* ---------- Mystery component ---------- */
var MYS=[47,68,100,150,220,330,470,680,1000,1500,2200,4700];
var COL=['#111','#8b4513','#d33','#f08c1a','#f2d21c','#2e9e4d','#2a6fd6','#8a4fd6','#888','#fff'];
function bands(r){var e=Math.floor(Math.log10(r))-1,m=Math.round(r/Math.pow(10,e));if(m>=100){m=Math.round(m/10);e++}return[Math.floor(m/10),m%10,e]}
function bandName(r){var n=['black','brown','red','orange','yellow','green','blue','violet','grey','white'],b=bands(r);return n[b[0]]+', '+n[b[1]]+', '+n[b[2]]}
function mysteryLab(root){
 var s={kind:'res',R:330,V:0,pts:[],done:false,seed:1};
 function pickR(){s.R=MYS[Math.floor(Math.random()*MYS.length)]}
 function cur(V){if(s.kind==='res')return V/s.R;if(s.kind==='lamp')return(-10+Math.sqrt(100+160*V))/80;var nVt=.052,Is=1e-12,lo=0,hi=V/100,i;for(i=0;i<60;i++){var I=(lo+hi)/2,vd=nVt*Math.log(I/Is+1),f=I*100+vd;if(f>V)hi=I;else lo=I}return(lo+hi)/2}
 function reset(newR){if(newR)pickR();s.V=0;s.pts=[];s.done=false;draw();ro()}
 root.innerHTML='<p class="small mute">A sealed box hides one part. Turn the voltage up, press Record to log the current, and work out what is inside. A straight line through zero means a resistor. Then type your guess.</p><div id="lsvw"></div><div id="lgr"></div>'+A.readout('lro')+A.sl('V','Voltage',0,12,.5,0,' V')+'<div class="row" style="margin-top:6px"><button class="btn" data-la="rec">Record point</button> <button class="btn sec" data-la="clr">Clear points</button> <button class="btn sec" data-la="new">New mystery</button></div><div class="row" style="margin-top:6px"><span class="small mute">Box</span> '+A.chips('k',[['res','Resistor'],['lamp','Lamp'],['dio','Diode']],s.kind)+'</div><div class="row" style="margin-top:8px"><label class="small" for="mgs">My guess for the resistance (ohms)</label> <input id="mgs" type="number" min="1" inputmode="decimal" style="width:110px"> <button class="btn" data-la="chk">Check</button> <button class="btn sec" data-la="rev">Reveal</button></div><div id="mfb" class="small" aria-live="polite" style="margin-top:6px"></div>';
 var wrap=root.querySelector('#lsvw'),gr=root.querySelector('#lgr');
 function draw(){var I=cur(s.V),glow=s.kind==='lamp'?Math.min(1,s.V*I/2.2):s.kind==='dio'?Math.min(1,I/.05):0,col=s.kind==='lamp'?'#ffd23f':'#ff5a5a';
  var h='<g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M40 62V30H73M107 30H250V80M250 122V160H40V100M160 30V84M160 118V160"/></g><rect x="30" y="62" width="20" height="38" rx="3" fill="#5b4bff"/><text x="40" y="116" text-anchor="middle" font-size="10" font-weight="700" fill="currentColor">'+fx(s.V,1)+' V</text>'
   +'<circle cx="90" cy="30" r="17" fill="var(--surface,#fff)" stroke="currentColor" stroke-width="2"/><text x="90" y="35" text-anchor="middle" font-size="13" font-weight="700" fill="currentColor">A</text><text x="90" y="58" text-anchor="middle" font-size="10" fill="currentColor">'+fx(I*1000,1)+' mA</text>'
   +'<circle cx="160" cy="101" r="17" fill="var(--surface,#fff)" stroke="currentColor" stroke-width="2"/><text x="160" y="106" text-anchor="middle" font-size="13" font-weight="700" fill="currentColor">V</text>'
   +'<rect x="215" y="80" width="70" height="42" rx="8" fill="#2d2f45"/><text x="250" y="108" text-anchor="middle" font-size="22" font-weight="700" fill="#fff">?</text>'+(glow>0?'<circle cx="250" cy="76" r="'+(5+glow*9)+'" fill="'+col+'" opacity="'+(glow*.6)+'"/><circle cx="250" cy="76" r="3.5" fill="'+col+'"/>':'');
  wrap.innerHTML=A.svgHTML(h,'Mystery box circuit with an ammeter and voltmeter');
  graph()}
 function graph(){var W=320,H=170,L=38,T=18,Rr=300,B=140,vm=12,im=Math.max(.02,Math.ceil(cur(12)*1000/10)*10/1000),X=function(v){return L+v/vm*(Rr-L)},Y=function(i){return B-i/im*(B-T)},h='<rect x="'+L+'" y="'+T+'" width="'+(Rr-L)+'" height="'+(B-T)+'" fill="none" stroke="#9aa0b4" opacity=".5"/>',i;
  for(i=0;i<=4;i++){h+='<text x="'+(L-4)+'" y="'+(Y(im*i/4)+3)+'" text-anchor="end" font-size="8" fill="currentColor">'+fx(im*i/4*1000,0)+'</text>'+'<line x1="'+L+'" x2="'+Rr+'" y1="'+Y(im*i/4)+'" y2="'+Y(im*i/4)+'" stroke="#9aa0b4" opacity=".2"/>'}
  for(i=0;i<=6;i++)h+='<text x="'+X(i*2)+'" y="'+(B+11)+'" text-anchor="middle" font-size="8" fill="currentColor">'+i*2+'</text>';
  h+='<text x="'+((L+Rr)/2)+'" y="'+(H-6)+'" text-anchor="middle" font-size="9" fill="currentColor">Voltage (V)</text><text x="'+L+'" y="'+(T-2)+'" font-size="9" fill="currentColor">mA</text>';
  if(s.pts.length>=2){var sxy=0,sxx=0;s.pts.forEach(function(p){sxy+=p[0]*p[1];sxx+=p[0]*p[0]});var m=sxy/sxx;h+='<line x1="'+X(0)+'" y1="'+Y(0)+'" x2="'+X(vm)+'" y2="'+Y(Math.min(im,m*vm))+'" stroke="#e08a00" stroke-width="1.6" stroke-dasharray="4 3"/>'}
  s.pts.forEach(function(p){h+='<circle cx="'+X(p[0])+'" cy="'+Y(p[1])+'" r="3.6" fill="#5b4bff"/>'});h+='<circle cx="'+X(s.V)+'" cy="'+Y(cur(s.V))+'" r="5" fill="none" stroke="#12935f" stroke-width="2"/>';
  gr.innerHTML=svgW(h,'Current against voltage graph',W,H)}
 function ro(){var I=cur(s.V),sl='';if(s.pts.length>=2){var sxy=0,sxx=0;s.pts.forEach(function(p){sxy+=p[0]*p[1];sxx+=p[0]*p[0]});sl=' · best straight line gives <b>'+fx(sxx/sxy,0)+' Ω</b>'}
  root.querySelector('#lro').innerHTML='Voltage <b>'+fx(s.V,1)+' V</b> · current <b>'+fx(I*1000,1)+' mA</b>'+(s.V>0&&I>0?' · V ÷ I = <b>'+fx(s.V/I,0)+' Ω</b>':'')+sl}
 bindSl();function bindSl(){A.bindSl(root,{V:' V'},function(k,v){s.V=v;draw();ro()})}
 root.addEventListener('click',function(e){var b=e.target.closest('[data-lc]'),a=e.target.closest('[data-la]'),fb=root.querySelector('#mfb');
  if(b){var k=b.dataset.lc.split(':');if(k[0]==='k'){s.kind=k[1];[].forEach.call(root.querySelectorAll('[data-lc^="k:"]'),function(c){var on=c===b;c.classList.toggle('on',on);c.setAttribute('aria-pressed',on)});pickR();s.pts=[];fb.textContent='';draw();ro()}}
  if(a){var v=a.dataset.la;if(v==='rec'){if(s.V>0&&!s.pts.some(function(p){return p[0]===s.V})){s.pts.push([s.V,cur(s.V)]);draw();ro()}}else if(v==='clr'){s.pts=[];draw();ro()}else if(v==='new'){pickR();s.pts=[];fb.textContent='A new box is ready.';root.querySelector('#mgs').value='';draw();ro()}
   else if(v==='chk'){var g=+root.querySelector('#mgs').value;if(!g){fb.textContent='Type a number first.';return}
    if(s.kind==='res'){var d=Math.abs(g-s.R)/s.R;fb.innerHTML=d<=.05?'<b>Yes!</b> It was '+s.R+' Ω (bands '+bandName(s.R)+'). Ohm’s law: R = V ÷ I.':g>s.R?'A little too high. Check V ÷ I again.':'A little too low. Check V ÷ I again.'}
    else fb.textContent='This box is not a plain resistor, so it has no single resistance. Look at the graph: it is a curve, not a straight line. Press Reveal.'}
   else if(v==='rev'){fb.innerHTML=s.kind==='res'?'It is a <b>'+s.R+' Ω resistor</b>. Colour bands: '+bandName(s.R)+'. The graph is a straight line through zero.':s.kind==='lamp'?'It is a <b>filament lamp</b>. As it heats up its resistance rises, so the graph bends. It does not obey Ohm’s law.':'It is a <b>diode</b> with a 100 Ω protector. Almost no current flows until about 0.6 V, then it rises very fast.'}}});
 draw();ro()}

window.__labTex.mystery=1;
var SET=[
 {id:'orbit',t:'Gravity and orbits',d:'Textured planets, launch a moon and watch the path',make:orbitLab,p:['quanta-physics']},
 {id:'myst',t:'Mystery component',d:'Measure volts and amps, then work out what is inside',make:mysteryLab,p:['circuit-lab-b','quanta-physics']}
];
window.__labSet2=SET;
SET.forEach(function(l){A.LABS.push(l)});
A.ANIM.orbit=1;
})();
