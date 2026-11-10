/* ===== Labs 4: voltage divider, sea breeze, skate park, standing waves, Doppler ===== */
(function(){
var A=window.__labApi,K=window.__labTex&&window.__labTex.h;if(!A||!K)return;
var fx=K.fx,dragger=K.dragger,keep=K.keep,svgW=K.svgW,PI=Math.PI,UID=0;
var REDUCE=false;try{REDUCE=window.matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){}
function tog(root,grp,val){[].forEach.call(root.querySelectorAll('[data-lc^="'+grp+':"]'),function(c){var on=c.dataset.lc===grp+':'+val;c.classList.toggle('on',on);c.setAttribute('aria-pressed',on)})}
function ohm(r){return r>=1000?fx(r/1000,r%1000?1:0)+' kΩ':Math.round(r)+' Ω'}

/* ---------- Voltage divider ---------- */
function divider(root){
 var s={V:9,R1:1000,R2:1000,knob:false,k:50,RL:0};
 root.innerHTML='<p class="small mute">Two resistors in a row share the battery’s voltage. The output is taken between them. Change the resistors, add a load, or switch to a knob (a potentiometer) and turn it.</p><div id="lsvw"></div>'+A.readout('lro')+A.sl('V','Battery',1,12,1,s.V,' V')+A.sl('R1','Top resistor',100,10000,100,s.R1,' Ω')+A.sl('R2','Bottom resistor',100,10000,100,s.R2,' Ω')+'<div id="kn" style="display:none">'+A.sl('k','Knob position',0,100,1,s.k,'%')+'</div><div class="row" style="margin-top:6px"><span class="small mute">Type</span> '+A.chips('ty',[['fx','Two resistors'],['kn','Knob (potentiometer)']],'fx')+'</div><div class="row" style="margin-top:6px"><span class="small mute">Load on the output</span> '+A.chips('rl',[[0,'None'],[10000,'10 kΩ'],[1000,'1 kΩ'],[100,'100 Ω']],0)+'</div>';
 var wrap=root.querySelector('#lsvw');
 function calc(){var Rt=s.R1+s.R2,r1=s.knob?Rt*(1-s.k/100):s.R1,r2=s.knob?Rt*s.k/100:s.R2,r2e=s.RL?(r2*s.RL/(r2+s.RL)):r2;if(r2<1)r2e=Math.min(r2e,r2);var I=s.V/(r1+r2e),vo=I*r2e;return{r1:r1,r2:r2,r2e:r2e,I:I,vo:vo,v1:s.V-vo}}
 function res(x,y,len,val,lab){var b=K.bands(Math.max(10,val)),h='<line x1="'+x+'" y1="'+(y)+'" x2="'+x+'" y2="'+(y+len)+'" stroke="currentColor" stroke-width="2.4"/><rect x="'+(x-7)+'" y="'+(y+len/2-17)+'" width="14" height="34" rx="5" fill="#e7cf9c" stroke="#8a7440"/>';[0,1,2].forEach(function(k){h+='<rect x="'+(x-7)+'" y="'+(y+len/2-13+k*7)+'" width="14" height="3" fill="'+K.COL[b[k]]+'"/>'});return h+'<text x="'+(x+12)+'" y="'+(y+len/2+3)+'" font-size="9" font-weight="700" fill="currentColor">'+lab+': '+ohm(val)+'</text>'}
 function draw(){var c=calc(),h='';
  h+='<g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M40 70V24H110M110 176H40V130"/></g><rect x="30" y="70" width="20" height="60" rx="3" fill="#5b4bff"/><text x="40" y="104" text-anchor="middle" font-size="10" font-weight="800" fill="#fff">'+s.V+'V</text>';
  h+='<path d="M110 24V40M110 176V160" stroke="currentColor" stroke-width="2.4" fill="none"/>';
  h+=res(110,38,52,c.r1,'R1')+res(110,124,52,c.r2,'R2');
  h+='<line x1="110" y1="90" x2="110" y2="124" stroke="currentColor" stroke-width="2.4"/><line x1="110" y1="106" x2="200" y2="106" stroke="#12935f" stroke-width="2.4"/><circle cx="110" cy="106" r="3.6" fill="#12935f"/>';
  if(s.knob)h+='<path d="M100 '+(90+(1-s.k/100)*34)+'l-12 0" stroke="#e08a00" stroke-width="2"/><path d="M104 '+(90+(1-s.k/100)*34)+'l-7 -4v8z" fill="#e08a00"/>';
  if(s.RL)h+='<path d="M170 106V124M170 176V160M170 176H110" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M110 176H170" stroke="currentColor" stroke-width="2.4"/>'+res(170,124,52,s.RL,'Load').replace('<line x1="170" y1="124" x2="170" y2="176" stroke="currentColor" stroke-width="2.4"/>','').replace(/<text[^>]*>[^<]*<\/text>/,'<text x="176" y="156" font-size="9" font-weight="700" fill="currentColor">Load</text>');
  h+='<circle cx="206" cy="106" r="3.6" fill="#12935f"/><text x="212" y="102" font-size="10" font-weight="800" fill="#12935f">Out</text><text x="212" y="114" font-size="12" font-weight="800" fill="#12935f">'+fx(c.vo,2)+' V</text>';
  var bh=130,y0=34,t1=c.v1/s.V*bh;h+='<rect x="272" y="'+y0+'" width="26" height="'+t1+'" fill="#ff9f43"/><rect x="272" y="'+(y0+t1)+'" width="26" height="'+(bh-t1)+'" fill="#2a7de1"/><rect x="272" y="'+y0+'" width="26" height="'+bh+'" fill="none" stroke="currentColor" stroke-width="1.4"/><text x="285" y="26" text-anchor="middle" font-size="9" font-weight="700" fill="currentColor">'+s.V+' V</text><text x="285" y="'+(y0+bh+12)+'" text-anchor="middle" font-size="8" fill="currentColor">0 V</text>'+(t1>14?'<text x="285" y="'+(y0+t1/2+3)+'" text-anchor="middle" font-size="9" font-weight="800" fill="#4a2a00">'+fx(c.v1,1)+'</text>':'')+((bh-t1)>14?'<text x="285" y="'+(y0+t1+(bh-t1)/2+3)+'" text-anchor="middle" font-size="9" font-weight="800" fill="#fff">'+fx(c.vo,1)+'</text>':'');
  wrap.innerHTML=A.svgHTML(h,'Voltage divider circuit');
  root.querySelector('#lro').innerHTML='Output <b>'+fx(c.vo,2)+' V</b> = battery × <b>'+fx(c.vo/s.V*100,0)+'%</b> · current <b>'+fx(c.I*1000,2)+' mA</b>'+(s.RL?' · the load drags the output down from '+fx(s.V*(s.knob?s.k/100:s.R2/(s.R1+s.R2)),2)+' V':'')}
 A.bindSl(root,{V:' V',R1:' Ω',R2:' Ω',k:'%'},function(k,v){s[k]=v;draw()});
 A.chipSet(root,function(g,v){if(g==='ty'){s.knob=v==='kn';root.querySelector('#kn').style.display=s.knob?'':'none'}else s.RL=+v;draw()});
 draw()}

/* ---------- Sea breeze ---------- */
function seaBreeze(root){
 var s={h:14,sea:18,sun:80},anim=null,U=++UID;
 root.innerHTML='<p class="small mute">Land heats and cools faster than water. Slide the time of day and watch which way the wind blows near the ground, and which way it blows higher up. Cloudy skies weaken the effect.</p><div id="lsvw"></div>'+A.readout('lro')+A.sl('h','Time of day',0,23,1,s.h,' h')+A.sl('sea','Sea temperature',8,28,1,s.sea,' °C')+A.sl('sun','Sunshine',0,100,10,s.sun,'%')+'<div class="row" style="margin-top:6px"><span class="small mute">Jump to</span> '+A.chips('j',[[4,'Dawn'],[14,'Afternoon'],[22,'Night']],'')+'</div>';
 var wrap=root.querySelector('#lsvw');
 function land(){return s.sea+(s.sun/100)*10*Math.sin(PI*(s.h-9)/12)}
 function frame(t){if(!A.alive(root))return;draw(t);anim=A.raf(frame)}
 function draw(t){var L=land(),dT=L-s.sea,e=Math.min(1,Math.abs(dT)/8),ph=(t/1000)*(18+40*e),SH=164;
  var sunUp=s.h>=6&&s.h<=18,el=Math.sin(PI*(s.h-6)/12),dayf=Math.max(0,Math.min(1,el*2.2)),sk1=dayf>0?mix([18,24,70],[88,170,255],dayf):[18,24,70],sk2=dayf>0?mix([40,40,90],[210,235,255],dayf):[40,40,90];
  function mix(a,b,u){return a.map(function(x,i){return Math.round(x+(b[i]-x)*u)})}
  var h='<defs><linearGradient id="bs'+U+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="rgb('+sk1+')"/><stop offset="1" stop-color="rgb('+sk2+')"/></linearGradient><pattern id="lg'+U+'" width="12" height="9" patternUnits="userSpaceOnUse"><rect width="12" height="9" fill="#6aa84f"/><path d="M2 9l1-5M6 9l-1-4M10 9l1-5" stroke="#4a8a3a" stroke-width="1"/></pattern><linearGradient id="sw'+U+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3b8fe0"/><stop offset="1" stop-color="#14508f"/></linearGradient></defs><rect width="320" height="200" fill="url(#bs'+U+')"/>';
  if(dayf<.7)h+='<g opacity="'+(1-dayf)+'">'+K.stars(24,320,110,5)+'</g>';
  var ang=PI*((s.h-6)/12),sx=160-Math.cos(ang)*130,sy=120-Math.sin(ang)*95;
  if(sunUp)h+='<circle cx="'+sx+'" cy="'+sy+'" r="14" fill="#ffd23f"/><circle cx="'+sx+'" cy="'+sy+'" r="22" fill="#ffd23f" opacity=".25"/>';
  else{var ma=PI*(((s.h+12)%24-6)/12);h+='<circle cx="'+(160-Math.cos(ma)*130)+'" cy="'+(120-Math.sin(ma)*95)+'" r="10" fill="#f4f1e0"/><circle cx="'+(164-Math.cos(ma)*130)+'" cy="'+(117-Math.sin(ma)*95)+'" r="9" fill="rgb('+sk1+')"/>'}
  h+='<rect x="140" y="'+SH+'" width="180" height="36" fill="url(#sw'+U+')"/><path d="M146 '+(SH+8)+'q8 -4 16 0t16 0t16 0t16 0t16 0t16 0t16 0t16 0t16 0t16 0" fill="none" stroke="#bfe1ff" stroke-width="1.2" opacity=".7" transform="translate('+((ph*.4)%16)+' 0)"/><path d="M146 '+(SH+20)+'q8 -4 16 0t16 0t16 0t16 0t16 0t16 0t16 0t16 0t16 0t16 0" fill="none" stroke="#bfe1ff" stroke-width="1" opacity=".5" transform="translate('+(-(ph*.3)%16)+' 0)"/>';
  h+='<path d="M0 '+SH+'L0 200H150L140 '+SH+'Z" fill="url(#lg'+U+')"/><path d="M118 '+(SH-2)+'l5 -14l5 14z" fill="#2f6b2a"/><path d="M100 '+(SH-2)+'l6 -18l6 18z" fill="#2f6b2a"/><rect x="30" y="'+(SH-20)+'" width="22" height="20" fill="#e6c8a0"/><path d="M27 '+(SH-20)+'l14 -12l14 12z" fill="#b5532f"/>';
  /* temperature chips */
  h+=th(70,L,'Land')+th(235,s.sea,'Sea');
  /* wind arrows */
  if(Math.abs(dT)>=1){var dir=dT>0?1:-1,i;for(i=0;i<4;i++){var x=((ph*(1.2)+i*80)%300)-10,xs=dir>0?320-x-10:x;h+=ar(xs,SH-16,dir,'#fff',.9);}
   for(i=0;i<3;i++){var x2=((ph*1.2+i*110)%300)-10,xs2=dir>0?x2:320-x2-10;h+=ar(xs2,52,-dir,'#ffe9a0',.8)}
   var up=dT>0?75:235;for(i=0;i<3;i++){var yy=SH-8-((ph*.8+i*40)%90);h+='<path d="M'+(up-8+i*8)+' '+(yy+10)+'q-4 -5 0 -10t0 -10" fill="none" stroke="#ffb199" stroke-width="2" opacity="'+(.3+.5*e)+'"/>'}
   h+='<text x="'+(dT>0?236:70)+'" y="'+(SH-4)+'" font-size="8" font-weight="800" fill="#fff" text-anchor="middle">sinking</text>'}
  if(dT>5&&dayf>.2){h+='<ellipse cx="78" cy="68" rx="30" ry="8" fill="#e9eef7"/><circle cx="66" cy="62" r="11" fill="#fff"/><circle cx="84" cy="58" r="14" fill="#fff"/><circle cx="98" cy="64" r="9" fill="#f4f7fb"/>'}
  h+='<text x="6" y="14" font-size="9" font-weight="800" fill="'+(dayf>.5?'#17314f':'#fff')+'">'+('0'+s.h).slice(-2)+':00</text><text x="6" y="36" font-size="8" font-weight="700" fill="'+(dayf>.5?'#17314f':'#fff')+'">low pressure over '+(dT>0.5?'land':dT<-.5?'sea':'—')+'</text>';
  wrap.innerHTML=A.svgHTML(h,'Sea breeze cross-section');
  root.querySelector('#lro').innerHTML='Land <b>'+fx(L,0)+' °C</b> · sea <b>'+fx(s.sea,0)+' °C</b> · '+(Math.abs(dT)<1?'about the same, so <b>almost no breeze</b>.':dT>0?'warm air rises over land, so near the ground the wind blows <b>from sea to land</b> (a sea breeze). Higher up, it returns out to sea.':'air sinks over the cool land and rises over the warmer sea, so near the ground the wind blows <b>from land to sea</b> (a land breeze).')}
 function th(x,T,lab){var hh=Math.max(4,Math.min(40,(T-4)*1.6));return'<rect x="'+(x-4)+'" y="78" width="8" height="42" rx="4" fill="#fff" stroke="#7a8499"/><rect x="'+(x-2)+'" y="'+(118-hh)+'" width="4" height="'+hh+'" rx="2" fill="#e8453c"/><text x="'+x+'" y="74" font-size="8" font-weight="800" text-anchor="middle" fill="#fff" stroke="#00000055" stroke-width=".4">'+lab+' '+fx(T,0)+'°</text>'}
 function ar(x,y,d,c,o){return'<g opacity="'+o+'"><line x1="'+x+'" y1="'+y+'" x2="'+(x+d*18)+'" y2="'+y+'" stroke="'+c+'" stroke-width="2.4"/><path d="M'+(x+d*18)+' '+y+'l'+(-d*6)+' -4v8z" fill="'+c+'"/></g>'}
 A.bindSl(root,{h:' h',sea:' °C',sun:'%'},function(k,v){s[k]=v});
 A.chipSet(root,function(g,v){s.h=+v;var i=root.querySelector('[data-ls="h"]');i.value=v;root.querySelector('#lo_h').textContent=v+' h';tog(root,'j','')});
 frame(A.now())}

/* ---------- Skate park (energy) ---------- */
var GRAV={Earth:9.8,Moon:1.6,Jupiter:24.8};
function skatePark(root){
 var s={shape:'bowl',m:3,mu:0,pl:'Earth',x:50,v:0,th:0,E0:0,run:true,hold:false},SC=.04,anim=null,last=null,U=++UID;
 function hp(x){if(s.shape==='bowl')return .0046*(x-160)*(x-160);if(s.shape==='hills')return 40+35*Math.cos(2*PI*x/160);return x<100?.0141*(100-x)*(100-x):x>220?.0141*(x-220)*(x-220):0}
 function dh(x){return(hp(x+.5)-hp(x-.5))/1}
 function d2h(x){return(hp(x+1)-2*hp(x)+hp(x-1))/1}
 root.innerHTML='<p class="small mute">Drag the skater up the track and let go. Watch energy swap between height (blue) and speed (green). Turn on friction and some becomes heat (orange). Try a heavier skater, or the Moon.</p><div id="lsvw"></div><div id="lbr"></div>'+A.readout('lro')+A.sl('m','Skater mass',1,10,1,s.m,' kg')+A.sl('mu','Friction',0,.3,.02,s.mu,'')+'<div class="row" style="margin-top:6px"><span class="small mute">Track</span> '+A.chips('sh',[['bowl','Bowl'],['hills','Two valleys'],['ramp','Flat and ramps']],s.shape)+'</div><div class="row" style="margin-top:6px"><span class="small mute">World</span> '+A.chips('pl',Object.keys(GRAV).map(function(k){return[k,k]}),s.pl)+'</div><div class="row" style="margin-top:8px"><button class="btn" data-la="go">Release</button> <button class="btn sec" data-la="rs">Back to start</button></div>';
 var wrap=root.querySelector('#lsvw'),bars=root.querySelector('#lbr');
 function g(){return GRAV[s.pl]}
 function PE(){return s.m*g()*hp(s.x)*SC}
 function KE(){var p=dh(s.x)/1,vs2=s.v*s.v*SC*SC*(1+p*p);return .5*s.m*vs2}
 function setE(){s.th=0;s.E0=PE()+KE()}
 function step(dt){var n=Math.max(1,Math.ceil(dt/.0015)),k,h=dt/n;for(k=0;k<n;k++){var p=dh(s.x),v=s.v*SC,gg=g(),a;
   a=-(gg*p+p*(d2h(s.x)/SC)*v*v)/(1+p*p);
   if(s.mu>0){var fr=s.mu*gg/(1+p*p);if(Math.abs(v)<.02&&Math.abs(gg*p/(1+p*p))<=fr){s.v=0;continue}a-=fr*(v>0?1:v<0?-1:(a>0?-1:1)*0)}
   var vn=v+a*h;if(s.mu>0&&v*vn<0&&Math.abs(gg*p/(1+p*p))<=s.mu*gg/(1+p*p)){vn=0}
   var xn=s.x+(vn/SC)*h;if(xn<10){xn=10;vn=Math.abs(vn)*.0}if(xn>310){xn=310;vn=0}
   s.th+=s.mu*s.m*gg*Math.abs(vn)*h;s.x=xn;s.v=vn/SC}}
 function draw(){var h='<defs><linearGradient id="tk'+U+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8f96a8"/><stop offset="1" stop-color="#555b6e"/></linearGradient><pattern id="cc'+U+'" width="16" height="12" patternUnits="userSpaceOnUse"><rect width="16" height="12" fill="#6b7186"/><circle cx="3" cy="3" r=".8" fill="#8b91a6"/><circle cx="11" cy="8" r=".8" fill="#575c70"/><path d="M0 11H16" stroke="#7a8097" stroke-width=".6"/></pattern></defs>',pts=[],x;
  for(x=0;x<=320;x+=4)pts.push(x+' '+(184-hp(x)).toFixed(1));h+='<path d="M0 200L0 '+(184-hp(0))+'L'+pts.join('L')+'L320 200Z" fill="url(#cc'+U+')"/><path d="M'+pts.join('L')+'" fill="none" stroke="#2f3345" stroke-width="3"/><path d="M'+pts.join('L')+'" fill="none" stroke="#c5cbe0" stroke-width="1" transform="translate(0 -1.5)"/>';
  var sy=184-hp(s.x),p=dh(s.x),ang=Math.atan(p)*-180/PI;
  h+='<g data-dr="sk" tabindex="0" role="slider" aria-label="Skater position" aria-valuemin="10" aria-valuemax="310" aria-valuenow="'+Math.round(s.x)+'" style="cursor:grab"><circle cx="'+s.x+'" cy="'+(sy-11)+'" r="22" fill="#fff" opacity="0"/><g transform="translate('+s.x+' '+(sy-1)+') rotate('+ang+')"><rect x="-10" y="-3" width="20" height="4" rx="2" fill="#e8453c"/><circle cx="-6" cy="3" r="2.6" fill="#222"/><circle cx="6" cy="3" r="2.6" fill="#222"/><g transform="translate(0 -3)"><rect x="-4" y="-14" width="8" height="12" rx="3" fill="#2a7de1"/><circle cx="0" cy="-19" r="5" fill="#f2c9a0"/><path d="M-5 -20a5 5 0 0 1 10 0z" fill="#12935f"/></g></g></g>';
  wrap.innerHTML=A.svgHTML(h,'Skate park track');
  var ke=KE(),pe=PE(),th=s.th,tot=Math.max(1,s.E0,ke+pe+th),bw=function(v){return Math.max(0,v/tot*190)};
  bars.innerHTML=svgW('<text x="4" y="14" font-size="9" fill="currentColor" font-weight="700">Energy (J)</text>'+[['Height (PE)',pe,'#2a7de1'],['Speed (KE)',ke,'#12935f'],['Heat',th,'#ff9f43']].map(function(r,i){return'<text x="4" y="'+(33+i*22)+'" font-size="9" fill="currentColor">'+r[0]+'</text><rect x="86" y="'+(24+i*22)+'" width="'+bw(r[1])+'" height="14" rx="3" fill="'+r[2]+'"/><text x="'+(90+bw(r[1]))+'" y="'+(35+i*22)+'" font-size="9" fill="currentColor" font-weight="700">'+fx(r[1],1)+'</text>'}).join('')+'<text x="4" y="98" font-size="9" fill="currentColor" font-weight="700">Total '+fx(ke+pe+th,1)+' J</text><rect x="86" y="88" width="'+bw(ke+pe+th)+'" height="6" rx="3" fill="none" stroke="currentColor" stroke-width="1.5"/>',"Energy bars: height energy, speed energy and heat",320,106);
  root.querySelector('#lro').innerHTML='Speed <b>'+fx(Math.sqrt(2*ke/s.m),1)+' m/s</b> · height <b>'+fx(hp(s.x)*SC,1)+' m</b> · energy stays the same when there is no friction; with friction the total stays too, but some becomes heat.'}
 function frame(ts){if(!A.alive(root))return;var dt=last==null?0:Math.min(.04,(ts-last)/1000);last=ts;if(s.run&&!s.hold)step(dt);draw();anim=A.raf(frame)}
 dragger(wrap,function(ev,id,p){if(ev==='down'){s.hold=true}if(ev==='key'){s.x=Math.max(10,Math.min(310,s.x+p[0]*6));s.v=0;setE();keep(wrap,draw);return}if(ev==='up'){s.hold=false;setE();return}s.x=Math.max(10,Math.min(310,p[0]));s.v=0;setE();keep(wrap,draw)});
 A.bindSl(root,{m:' kg',mu:''},function(k,v){s[k]=v;setE()});
 A.chipSet(root,function(gp,v){if(gp==='sh'){s.shape=v;s.x=v==='ramp'?40:v==='hills'?20:50;s.v=0}else{s.pl=v}setE()});
 root.addEventListener('click',function(e){var a=e.target.closest('[data-la]');if(!a)return;s.v=0;s.x=s.shape==='ramp'?40:s.shape==='hills'?20:50;setE()});
 setE();frame(A.now())}

/* ---------- Standing waves on a string ---------- */
function stringLab(root){
 var s={L:.65,T:80,f:0},mu=.004,anim=null,U=++UID,Q=22;
 function f1(){return Math.sqrt(s.T/mu)/(2*s.L)}
 s.f=f1();
 root.innerHTML='<p class="small mute">A vibrator shakes one end of a guitar string. At most frequencies the string barely moves. At special frequencies, the harmonics, it leaps into a pattern with still spots (nodes) between big swings (antinodes). Slide the frequency, or jump to a harmonic.</p><div id="lsvw"></div>'+A.readout('lro')+A.sl('f','Shaking frequency',20,600,1,Math.round(s.f),' Hz')+A.sl('L','String length',.4,1,.05,s.L,' m')+A.sl('T','Tension',20,200,10,s.T,' N')+'<div class="row" style="margin-top:6px"><span class="small mute">Jump to harmonic</span> '+A.chips('n',[1,2,3,4,5,6].map(function(n){return[n,n]}),'')+'</div>';
 var wrap=root.querySelector('#lsvw');
 function modes(){var base=f1(),o=[],n;for(n=1;n<=8;n++){var fn=n*base,r=s.f/fn,d=1/Math.sqrt(Math.pow(1-r*r,2)+Math.pow(r/Q,2))*(1/n),sg=(1-r*r)>=0?1:-1;o.push({n:n,fn:fn,c:d*sg})}var mx=0;o.forEach(function(m){mx=Math.max(mx,Math.abs(m.c))});return{o:o,mx:mx}}
 function draw(t){var M=modes(),base=f1(),amp=Math.min(1,M.mx/9)*40+1.5,wt=Math.cos((t/1000)*2*PI*(.5+.9*Math.min(s.f/base,6)/6)),x0=30,x1=290,pts='',i,near=null;
  M.o.forEach(function(m){if(Math.abs(s.f-m.fn)/m.fn<.025)near=m});
  var h='<defs><linearGradient id="gw'+U+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9a6b3f"/><stop offset="1" stop-color="#6e4723"/></linearGradient><pattern id="gp'+U+'" width="40" height="14" patternUnits="userSpaceOnUse"><rect width="40" height="14" fill="url(#gw'+U+')"/><path d="M0 4Q10 2 20 4T40 4M0 10Q10 8 20 10T40 10" stroke="#5a3a1c" stroke-width=".8" fill="none" opacity=".6"/></pattern></defs><rect x="0" y="0" width="320" height="200" fill="url(#gp'+U+')" opacity=".35"/>';
  h+='<rect x="12" y="60" width="18" height="80" rx="4" fill="#3a3a44"/><rect x="290" y="60" width="18" height="80" rx="4" fill="#3a3a44"/><circle cx="21" cy="100" r="4" fill="#ffd23f"/>';
  var nn=60;for(i=0;i<=nn;i++){var u=i/nn,yv=0;M.o.forEach(function(m){yv+=m.c*Math.sin(m.n*PI*u)});yv=yv/(M.mx||1)*amp*wt;pts+=(i?'L':'M')+(x0+u*(x1-x0)).toFixed(1)+' '+(100-yv).toFixed(1)}
  h+='<path d="'+pts+'" fill="none" stroke="#fff" stroke-width="5" opacity=".15" stroke-linecap="round"/><path d="'+pts+'" fill="none" stroke="#dfe5f2" stroke-width="2.2" stroke-linecap="round"/>';
  if(near){for(i=0;i<=near.n;i++){var nx=x0+i/near.n*(x1-x0);h+='<circle cx="'+nx+'" cy="100" r="4.2" fill="#e8453c" stroke="#fff" stroke-width="1.2"/>'}for(i=0;i<near.n;i++){var ax=x0+(i+.5)/near.n*(x1-x0);h+='<text x="'+ax+'" y="'+(100-amp-8)+'" text-anchor="middle" font-size="8" font-weight="800" fill="#12935f">swing</text>'}}
  /* resonance curve */
  var cv='M',k,maxA=0,curve=[];for(k=0;k<=160;k++){var ff=20+k*(580/160),mm=0,n2;for(n2=1;n2<=8;n2++){var r2=ff/(n2*base);mm=Math.max(mm,1/Math.sqrt(Math.pow(1-r2*r2,2)+Math.pow(r2/Q,2))/n2)}curve.push(mm);maxA=Math.max(maxA,mm)}
  curve.forEach(function(v,i){cv+=(i?'L':'')+(30+i/160*260).toFixed(1)+' '+(188-Math.min(1,v/maxA)*38).toFixed(1)});
  h+='<path d="'+cv+'" fill="none" stroke="#5b4bff" stroke-width="1.6"/><line x1="30" y1="188" x2="290" y2="188" stroke="currentColor" stroke-width=".8" opacity=".5"/><line x1="'+(30+(s.f-20)/580*260)+'" y1="148" x2="'+(30+(s.f-20)/580*260)+'" y2="190" stroke="#e8453c" stroke-width="1.6"/><text x="30" y="146" font-size="8" fill="currentColor">how much it swings, by frequency</text>';
  wrap.innerHTML=A.svgHTML(h,'Vibrating string');
  root.querySelector('#lro').innerHTML='Fundamental <b>'+fx(base,0)+' Hz</b> · shaking at <b>'+fx(s.f,0)+' Hz</b> · '+(near?'<b>Resonance! '+ord(near.n)+' harmonic</b> with '+(near.n+1)+' nodes (including the ends) and '+near.n+' antinode'+(near.n>1?'s':'')+'. Wavelength = 2L ÷ '+near.n+' = '+fx(2*s.L/near.n,2)+' m.':'between harmonics, so the string barely moves. Harmonics are at '+[1,2,3].map(function(n){return fx(n*base,0)}).join(', ')+' Hz…')}
 function ord(n){return n+(n===1?'st':n===2?'nd':n===3?'rd':'th')}
 function frame(ts){if(!A.alive(root))return;draw(ts);anim=A.raf(frame)}
 function setF(v){s.f=v;var i=root.querySelector('[data-ls="f"]');i.value=Math.round(v);root.querySelector('#lo_f').textContent=Math.round(v)+' Hz'}
 A.bindSl(root,{f:' Hz',L:' m',T:' N'},function(k,v){s[k]=v;if(k!=='f'){var i=root.querySelector('[data-ls="f"]');i.value=Math.max(20,Math.min(600,Math.round(s.f)))}});
 A.chipSet(root,function(g,v){setF(+v*f1());tog(root,'n',v)});
 frame(A.now())}

/* ---------- Doppler effect ---------- */
function dopplerLab(root){
 var s={M:.5,rate:2},V=100,anim=null,U=++UID;
 root.innerHTML='<p class="small mute">A siren truck sends out a sound wave every moment. Ahead of it the waves bunch up (higher pitch). Behind it they stretch out (lower pitch). Push the speed past the speed of sound to make a shock wave.</p><div id="lsvw"></div>'+A.readout('lro')+A.sl('M','Truck speed (1 = speed of sound)',0,1.6,.1,s.M,'')+A.sl('rate','Siren pitch',1,4,.5,s.rate,' Hz')+'<div class="row" style="margin-top:6px"><span class="small mute">Try</span> '+A.chips('p',[[0,'Parked'],[.3,'Slow'],[.7,'Fast'],[1,'Mach 1'],[1.4,'Supersonic']],'')+'</div>';
 var wrap=root.querySelector('#lsvw');
 function frame(ts){if(!A.alive(root))return;draw(ts/1000);anim=A.raf(frame)}
 function draw(t){var vs=s.M*V,Te=1/s.rate,span=(360)/(vs||1),tc=vs>0?t%span:t,sx=vs>0?-20+vs*tc:160,h='',k,kmax=Math.floor(tc/Te),KS=Math.max(0,kmax-40);
  h+='<defs><linearGradient id="dp'+U+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#dfeaff"/><stop offset="1" stop-color="#f6f9ff"/></linearGradient></defs><rect width="320" height="200" fill="url(#dp'+U+')" opacity=".5"/><rect x="0" y="146" width="320" height="54" fill="#6f7487"/><path d="M0 172H320" stroke="#e8d36b" stroke-width="2" stroke-dasharray="14 10"/>';
  for(k=KS;k<=kmax;k++){var tk=k*Te,cx=vs>0?-20+vs*tk:160,r=V*(tc-tk);if(r<1||r>380)continue;h+='<circle cx="'+cx.toFixed(1)+'" cy="112" r="'+r.toFixed(1)+'" fill="none" stroke="#2a7de1" stroke-width="1.6" opacity="'+Math.max(.1,1-r/380).toFixed(2)+'"/>'}
  if(s.M>1){var a=Math.asin(1/s.M),L=300;h+='<path d="M'+sx+' 112L'+(sx-Math.cos(a)*L)+' '+(112-Math.sin(a)*L)+'M'+sx+' 112L'+(sx-Math.cos(a)*L)+' '+(112+Math.sin(a)*L)+'" stroke="#e8453c" stroke-width="2.6" opacity=".85"/><text x="'+Math.max(30,Math.min(290,sx-70))+'" y="40" font-size="9" font-weight="800" fill="#e8453c">shock wave (sonic boom)</text>'}
  var flash=Math.floor(t*4)%2;h+='<g transform="translate('+sx+' 112)"><rect x="-18" y="-10" width="36" height="18" rx="4" fill="#f2f2f5" stroke="#555"/><rect x="2" y="-8" width="12" height="9" fill="#9bd0ff"/><circle cx="-10" cy="9" r="4" fill="#333"/><circle cx="10" cy="9" r="4" fill="#333"/><rect x="-12" y="-15" width="6" height="5" fill="'+(flash?'#ff3b3b':'#ffd0d0')+'"/><rect x="-5" y="-15" width="6" height="5" fill="'+(flash?'#ffd0d0':'#3b7bff')+'"/></g>';
  h+='<g font-size="9" font-weight="800" fill="currentColor"><text x="6" y="132">Behind</text><text x="314" y="132" text-anchor="end">Ahead</text></g>';
  var ahead=s.M<1?s.rate/(1-s.M):null,behind=s.rate/(1+s.M);
  h+='<g font-size="10" font-weight="800"><rect x="2" y="136" width="64" height="16" rx="4" fill="#fff" opacity=".85"/><text x="34" y="148" text-anchor="middle" fill="#2a7de1">'+fx(behind,1)+' Hz</text><rect x="254" y="136" width="64" height="16" rx="4" fill="#fff" opacity=".85"/><text x="286" y="148" text-anchor="middle" fill="#e8453c">'+(ahead===null?'boom':fx(ahead,1)+' Hz')+'</text></g>';
  wrap.innerHTML=A.svgHTML(h,'Doppler effect with a siren truck');
  root.querySelector('#lro').innerHTML='Siren <b>'+fx(s.rate,1)+' Hz</b> · speed <b>Mach '+fx(s.M,1)+'</b> · heard ahead <b>'+(ahead===null?'a sonic boom, not a pitch':fx(ahead,1)+' Hz')+'</b> · heard behind <b>'+fx(behind,1)+' Hz</b>'}
 A.bindSl(root,{M:'',rate:' Hz'},function(k,v){s[k]=v});
 A.chipSet(root,function(g,v){s.M=+v;var i=root.querySelector('[data-ls="M"]');i.value=v;root.querySelector('#lo_M').textContent=v;tog(root,'p',v)});
 frame(A.now())}

var SET=[
 {id:'div',t:'Voltage divider',d:'Two resistors, a knob and a load: where does the voltage go?',make:divider,p:['circuit-lab-b','quanta-physics']},
 {id:'sea',t:'Sea breeze',d:'Land and sea heat differently. Slide through a day',make:seaBreeze,p:['meteorology-b']},
 {id:'skate',t:'Skate park energy',d:'Height, speed and heat swap energy. Add friction',make:skatePark,p:['quanta-physics']},
 {id:'string',t:'Standing waves on a string',d:'Find the harmonics, nodes and antinodes',make:stringLab,p:['quanta-physics']},
 {id:'dopp',t:'Doppler effect',d:'A siren truck, bunched waves, and a sonic boom',make:dopplerLab,p:['quanta-physics']}
];
SET.forEach(function(l){A.LABS.push(l)});
A.ANIM.sea=1;A.ANIM.skate=1;A.ANIM.string=1;A.ANIM.dopp=1;
})();
