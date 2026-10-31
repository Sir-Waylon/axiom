/* ===== shop v2: character boxes (published odds), banners, titles, collection, streak reminders ===== */
var BOX_PITY_E=12,BOX_PITY_L=40;
var BNS={
Voltaic:['Breadboard','Bench Glow','Neon Traces','Overclock','Capacitor Bank','Tesla Rain','Plasma Arc','Superconductor'],
Stratus:['Clear Sky','Cumulus Drift','Squall Line','Sunset Front','Supercell','Aurora Jet','Eyewall','Zenith'],
Apex:['Slope Field','Parabola','Asymptote','Unit Circle','Polar Rose','Limit Horizon','Tangent Line','Riemann Sum'],
Quanta:['Lab Bench','Free Fall','Standing Wave','Field Lines','Orbit','Spectrum','Photon Burst','Superposition'],
Axiom:['Graph Paper','Golden Ratio','Proof Lines','Tessellation','Fractal Bloom','Euclid Dusk','Infinite Series','Q.E.D.']};
BNS.Vertex=BNS.Axiom;
var BNP=[0,60,90,120,160,220,300,400],BNK=['grid','dots','waves','rays','tri','clouds','bolts','stars'];
var BNC=[['#0f6b44','#06251a'],['#1b8f6a','#0a3b4d'],['#5b4bff','#12104a'],['#e8582a','#4a1230'],['#0f8fd8','#0b2a4d'],['#c43b8a','#2a1252'],['#f0a000','#4a2a00'],['#9be7ff','#7c5cff']];
var TIS={
Voltaic:['Rookie','Volt Chaser','Ohm Hero','Diode Duke','Gate Keeper','Kirchhoff Knight','Circuit Sage','Power Phenom'],
Stratus:['Rookie','Cloud Spotter','Front Watcher','Isobar Scout','Storm Chaser','Dew Point Duke','Jet Stream Rider','Supercell Sage'],
Apex:['Rookie','Function Fan','Root Finder','Log Roller','Unit Circle Pro','Limit Breaker','Derivative Duke','Integral Ace'],
Quanta:['Rookie','Meter Reader','Circuit Solver','Wave Rider','Field Theorist','Energy Expert','Signal Sage','Quantum Leaper'],
Axiom:['Rookie','Angle Ace','Proof Apprentice','Triangle Tamer','Theorem Hunter','Locus Lord','Proof Master','Honors Hero']};
TIS.Vertex=TIS.Axiom;
var TIP=[0,50,120,200,300,450,700,1000];
var TI=TIS[rbrand()].map(function(n,i){return['i'+i,n,TIP[i],1]});
var BN=BNS[rbrand()].map(function(n,i){return['b'+i,n,BNP[i],BNC[i][0],BNC[i][1],BNK[i]]});
function bnOf(id){return BN.filter(function(x){return x[0]===id})[0]||BN[0]}
function bannerSVG(id,w,h){
 var b=bnOf(id),n=b[0],c1=b[3],c2=b[4],p=b[5],u='bn'+(++_rid),s='';
 if(p==='grid')for(var i=0;i<20;i++)s+='<path d="M'+(i*20)+' 0V96M0 '+(i*6)+'H360" stroke="#fff" stroke-opacity=".12"/>';
 if(p==='dots')for(var y=0;y<7;y++)for(var x=0;x<19;x++)s+='<circle cx="'+(x*20+(y%2?10:0))+'" cy="'+(y*15+8)+'" r="1.8" fill="#fff" fill-opacity=".22"/>';
 if(p==='waves')for(var j=0;j<5;j++)s+='<path d="M0 '+(20+j*16)+'q45-18 90 0t90 0 90 0 90 0" stroke="#fff" stroke-opacity=".16" fill="none" stroke-width="2"/>';
 if(p==='rays')for(var k=0;k<14;k++)s+='<path d="M180 120L'+(k*28-20)+' -10" stroke="#fff" stroke-opacity=".09" stroke-width="10"/>';
 if(p==='tri')for(var t=0;t<9;t++)s+='<path d="M'+(t*44-6)+' 96l22-40 22 40z" fill="#fff" fill-opacity="'+(.06+.03*(t%3))+'"/>';
 if(p==='clouds')s+='<path d="M20 70q-8 0-8-9t10-9q4-10 16-8t12 10q10 2 6 16z" fill="#fff" fill-opacity=".2"/><path d="M200 54q-8 0-8-9t10-9q4-10 16-8t12 10q10 2 6 16z" fill="#fff" fill-opacity=".18"/><path d="M290 84q-6 0-6-7t8-7q3-8 12-6t10 8q8 1 5 12z" fill="#fff" fill-opacity=".2"/>';
 if(p==='bolts')s+='<path d="M60 0l-14 36h14l-10 34 28-44H64l12-26z" fill="#fff" fill-opacity=".16"/><path d="M250 8l-12 30h12l-8 28 22-36h-12l10-22z" fill="#fff" fill-opacity=".14"/>';
 if(p==='stars')for(var q=0;q<16;q++)s+='<path d="M'+((q*47)%350+6)+' '+((q*29)%80+8)+'l1.6 3.6 3.6 1.6-3.6 1.6-1.6 3.6-1.6-3.6-3.6-1.6 3.6-1.6z" fill="#fff" fill-opacity="'+(.3+.1*(q%4))+'"/>';
 var br=RB[rbrand()];
 return '<svg class="bn" viewBox="0 0 360 96" preserveAspectRatio="xMidYMid slice" width="'+(w||360)+'" height="'+(h||96)+'" role="img" aria-label="Banner: '+b[1]+'"><defs><linearGradient id="'+u+'" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="'+c1+'"/><stop offset="1" stop-color="'+c2+'"/></linearGradient></defs><rect width="360" height="96" fill="url(#'+u+')"/>'+s+'<rect y="76" width="360" height="20" fill="#000" opacity=".16"/></svg>'}
/* ---------- packs, luck, rolling (odds are never shown) ---------- */
var PACKS=[{id:'classic',name:'Classic Pack',sub:'Everyday finds',cost:100,lo:0,hi:3,c:['#34c759','#0b6b2c']},{id:'elite',name:'Elite Pack',sub:'Rare and rarer finds',cost:250,lo:1,hi:5,c:['#a35cff','#341a85']}];
function pkOf(id){return PACKS.filter(function(p){return p.id===id})[0]||PACKS[0]}
function luckNow(){var m=(S.mins&&S.mins[today()])||0;return Math.min(1,m/LUCK_MIN)}
function oddsNow(){var L=luckNow();return ODDS_LO.map(function(lo,i){return lo+(ODDS_HI[i]-lo)*L})}
function rnd(){try{var a=new Uint32Array(1);crypto.getRandomValues(a);return a[0]/4294967296}catch(e){return Math.random()}}
function fold(key,title,sub,body,cls){var op=!S.fold||S.fold[key]!==0;return '<details class="fold '+(cls||'')+'" data-fk="'+key+'"'+(op?' open':'')+'><summary>'+title+(sub?' <span class="small mute">'+sub+'</span>':'')+'</summary>'+body+'</details>'}
function packSVG(pk,sz,shake){var c=pk.c,g='pk'+(++_rid);return '<svg class="pkart" viewBox="0 0 120 120" width="'+sz+'" height="'+sz+'" aria-hidden="true"><defs><linearGradient id="'+g+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+c[0]+'"/><stop offset="1" stop-color="'+c[1]+'"/></linearGradient><radialGradient id="'+g+'s"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs><ellipse cx="60" cy="112" rx="38" ry="6" fill="#000" opacity=".25"/><path d="M18 46h84v56a8 8 0 0 1-8 8H26a8 8 0 0 1-8-8z" fill="url(#'+g+')" stroke="#10162f" stroke-width="5" stroke-linejoin="round"/><path d="M12 30a8 8 0 0 1 8-8h80a8 8 0 0 1 8 8v22H12z" fill="url(#'+g+')" stroke="#10162f" stroke-width="5" stroke-linejoin="round"/><path d="M12 40h96" stroke="#10162f" stroke-width="4" opacity=".35"/><rect x="50" y="22" width="20" height="88" fill="#ffd23c" stroke="#10162f" stroke-width="4"/><circle cx="60" cy="58" r="11" fill="#fff" stroke="#10162f" stroke-width="4"/><path d="M60 50l3 6 6 1-4.5 4.2 1.2 6.3L60 64.5 54.3 67.5l1.2-6.3L51 57l6-1z" fill="'+(pk.id==='elite'?'#a35cff':'#34c759')+'"/><path d="M24 34l4 8M34 30l3 6" stroke="#fff" stroke-width="3" opacity=".6" stroke-linecap="round"/><circle cx="20" cy="26" r="2.6" fill="#fff" class="twk"/><circle cx="104" cy="70" r="2.2" fill="#fff" class="twk"/></svg>'}
function rollBox(pk){
 var c=S.cos,p=c.pity,od=oddsNow(),lo=pk.lo;
 if(p.l>=BOX_PITY_L-1)lo=Math.max(lo,3);else if(p.e>=BOX_PITY_E-1)lo=Math.max(lo,2);
 var w=od.map(function(v,i){return (i<lo||i>pk.hi)?0:v}),tot=w.reduce(function(a,b){return a+b},0),x=rnd()*tot,r=0;
 while(r<5&&x>=w[r]){x-=w[r];r++}
 p.e++;p.l++;p.n++;if(r>=2)p.e=0;if(r>=3)p.l=0;
 var pool=AV.filter(function(a){return a[6]===r}),ch=pool[Math.floor(rnd()*pool.length)];
 if(!c.cnt)c.cnt={};c.cnt[ch[0]]=(c.cnt[ch[0]]||0)+1;
 var dup=!!c.own[ch[0]],gain=0;
 if(dup){gain=REFUND[r];S.coins+=gain;c.dups++}else c.own[ch[0]]=1;
 return{ch:ch,r:r,dup:dup,gain:gain}}
function rmodal(){var o=document.querySelector('.modal.rvl');if(o)o.remove();var m=document.createElement('div');m.className='modal rvl';m.setAttribute('role','dialog');m.setAttribute('aria-modal','true');document.body.appendChild(m);m.addEventListener('keydown',function(e){if(e.key==='Escape'){m.remove();route()}});return m}
function packScreen(id){var pk=pkOf(id),m=rmodal();m.setAttribute('aria-label',pk.name);
 m.innerHTML='<div class="rvs"><h2>'+pk.name+'</h2><div class="stage"><div class="pkbig">'+packSVG(pk,200)+'</div><span class="price"><i></i>'+pk.cost+'</span></div><div class="row" style="justify-content:center;flex-wrap:wrap;gap:10px"><button class="btn" data-ro="go:'+pk.id+'"'+(S.coins<pk.cost?' disabled':'')+'>'+(S.coins<pk.cost?'Not enough coins':'Open')+'</button><button class="btn ghost" data-ro="close">Back</button></div><p class="small" style="opacity:.8">You have '+S.coins+' coins. Study to earn more.</p></div>';
 var b=m.querySelector('button');if(b)b.focus()}
function openBox(id){
 var pk=pkOf(id);if(S.coins<pk.cost){toast('You need '+pk.cost+' coins for this pack');return}
 S.coins-=pk.cost;var res=rollBox(pk);save();hud();
 var m=rmodal(),rc=RC[res.r],rm=A11&&A11.rm;m.setAttribute('aria-label','Opening '+pk.name);m.style.setProperty('--rc',rc[0]);
 m.innerHTML='<div class="rvs"><div class="stage"><div class="pkbig shake" id="rvpk">'+packSVG(pk,200)+'</div></div></div>';
 var show=function(){
  if(!rm){var f=document.createElement('div');f.className='rvflash';document.body.appendChild(f);setTimeout(function(){f.remove()},600);if(res.r>=3)burst(true)}
  m.innerHTML='<div class="rvs" style="--rc:'+rc[0]+'"><div class="rays" aria-hidden="true"></div><div class="stage"><div class="ribbon" id="rvt">'+RN[res.r]+'</div><div class="rv-av">'+mascot(res.ch[0],'cheer',200)+'</div><h2>'+esc(res.ch[1])+'</h2>'+(res.dup?'<span class="small">Duplicate. +'+res.gain+' coins back</span>':'<span class="newt">NEW</span>')+'</div><div class="row" style="justify-content:center;flex-wrap:wrap;gap:10px"><button class="btn" data-ro="eq:'+res.ch[0]+'">Equip</button><button class="btn sec" data-ro="pk:'+pk.id+'">Open another</button><button class="btn ghost" data-ro="close">Done</button></div></div>';
  var b=m.querySelector('button');if(b)b.focus();try{window.announce&&window.announce('You got '+res.ch[1]+', '+RN[res.r]+'. '+(res.dup?'Duplicate.':'New.'))}catch(e){}};
 if(rm)show();else setTimeout(show,1300)}
function detailScreen(id){var a=avOf(id),r=a[6],m=rmodal(),rc=r<0?['#9aa4c4']:RC[r],on=S.cos.on.av===id,n=(S.cos.cnt&&S.cos.cnt[id])||1;m.setAttribute('aria-label',a[1]);m.style.setProperty('--rc',rc[0]);
 m.innerHTML='<div class="rvs" style="--rc:'+rc[0]+'"><div class="rays" aria-hidden="true"></div><div class="stage"><div class="ribbon">'+(r<0?'Starter':RN[r])+'</div><div class="rv-av">'+mascot(id,'happy',200)+'</div><h2>'+esc(a[1])+'</h2>'+(n>1?'<span class="small">Found '+n+' times</span>':'')+'</div><div class="row" style="justify-content:center;gap:10px"><button class="btn" data-ro="eq:'+id+'"'+(on?' disabled':'')+'>'+(on?'Equipped':'Equip')+'</button><button class="btn ghost" data-ro="close">Close</button></div></div>';var b=m.querySelector('button');if(b)b.focus()}
/* ---------- shop screen ---------- */
function rchip(r){var c=RC[r];return '<span class="rchip" style="background:'+c[2]+';color:'+c[1]+';border-color:'+c[0]+'">'+RN[r]+'</span>'}
function shopHTML(){
 var own=S.cos.own,got=AV.filter(function(a){return own[a[0]]}).length,pt=S.cos.pity,h='';
 h+='<p class="mute small">'+S.coins+' coins. Looks only, no advantages.</p>';
 h+=fold('packs','Packs','',' <div class="packs">'+PACKS.map(function(p){return '<button class="pack" style="--pk1:'+p.c[0]+';--pk2:'+p.c[1]+'" data-ro="pk:'+p.id+'" aria-label="'+p.name+', '+p.cost+' coins">'+packSVG(p,110)+'<b>'+p.name+'</b><span class="sub">'+p.sub+'</span><span class="price"><i></i>'+p.cost+'</span></button>'}).join('')+'</div>');
 h+=fold('how','How packs work','','<ul class="small" style="margin:4px 0 0;padding-left:20px"><li>Each pack holds one random character. The Elite Pack never holds Uncommon characters and is the only place to find the very rarest ones.</li><li>Rarer characters are harder to find. Studying today gently improves your luck.</li><li>An Epic or better character is guaranteed within '+BOX_PITY_E+' packs ('+Math.max(0,BOX_PITY_E-pt.e)+' left). A Legendary or better is guaranteed within '+BOX_PITY_L+' ('+Math.max(0,BOX_PITY_L-pt.l)+' left).</li><li>A duplicate gives coins back: '+RN.map(function(n,i){return n+' '+REFUND[i]}).join(', ')+'.</li></ul>','cardf');
 var order=AV.slice().sort(function(a,b){return a[6]-b[6]});
 h+=fold('coll','Collection','<span class="small mute">'+got+' of '+AV.length+'</span>','<div class="coll">'+order.map(function(a){var o=!!own[a[0]],on=S.cos.on.av===a[0],r=a[6],n=(S.cos.cnt&&S.cos.cnt[a[0]])||0;return '<div class="cc'+(o?'':' lock')+(on?' on':'')+'" style="--rc:'+(r<0?'#9aa4c4':RC[r][0])+'">'+(o?'<button class="gh" data-ro="det:'+a[0]+'" aria-label="View '+esc(a[1])+'">'+mascot(a[0],'happy',104)+'</button>':'<div class="ghost" aria-hidden="true">'+mascot(a[0],'happy',104)+'</div>')+'<b>'+(o?esc(a[1]):'?')+'</b>'+(r<0?'<span class="rchip" style="background:#eef0f8;color:#3b4469;border-color:#9aa4c4">Starter</span>':rchip(r))+(o?(n>1?'<span class="cnt">×'+n+'</span>':'')+'<button class="btn sm" data-ro="eq:'+a[0]+'"'+(on?' disabled':'')+'>'+(on?'Equipped':'Equip')+'</button>':'<span class="small mute">Not found yet</span>')+'</div>'}).join('')+'</div>');
 h+=fold('bn','Banners','','<div class="bns">'+BN.map(function(b){var o=!!own[b[0]]||b[2]===0,on=S.cos.on.bn===b[0];return '<div class="bc'+(on?' on':'')+'">'+bannerSVG(b[0],360,96)+'<div class="row" style="justify-content:space-between;padding:8px 10px"><b>'+esc(b[1])+'</b><button class="btn sm" data-ro="bn:'+b[0]+'"'+(on?' disabled':(!o&&S.coins<b[2]?' disabled':''))+'>'+(on?'Equipped':o?'Equip':'Buy · '+b[2])+'</button></div></div>'}).join('')+'</div>');
 h+=fold('ti','Titles','','<div class="tis">'+TI.map(function(t){var o=!!own[t[0]]||t[2]===0,on=S.cos.on.ti===t[0];return '<div class="tc'+(on?' on':'')+'"><b>'+esc(t[1])+'</b><button class="btn sm" data-ro="ti:'+t[0]+'"'+(on?' disabled':(!o&&S.coins<t[2]?' disabled':''))+'>'+(on?'Equipped':o?'Equip':'Buy · '+t[2])+'</button></div>'}).join('')+'</div>');
 return h}
document.addEventListener('click',function(e){
 var b=e.target.closest&&e.target.closest('[data-ro]');if(!b)return;var v=b.dataset.ro,c=S.cos;
 if(v==='close'){var m2=document.querySelector('.modal.rvl');if(m2)m2.remove();route();return}
 var p=v.split(':'),k=p[0],id=p[1];
 if(k==='pk'){packScreen(id);return}
 if(k==='go'){openBox(id);return}
 if(k==='det'){detailScreen(id);return}
 if(k==='eq'&&c.own[id]){c.on.av=id;save();hud();var m3=document.querySelector('.modal.rvl');if(m3)m3.remove();route();toast('Equipped');return}
 if(k==='bn'||k==='ti'){var it=(k==='bn'?BN:TI).filter(function(x){return x[0]===id})[0];if(!it)return;if(!c.own[id]&&it[2]>0){if(S.coins<it[2])return;S.coins-=it[2];c.own[id]=1}c.on[k]=id;save();hud();route()}});
/* collapsible sections remember their state; other cards in Me become collapsible too */
document.addEventListener('toggle',function(e){var d=e.target;if(!d.classList||!d.classList.contains('fold'))return;var k=d.dataset.fk;if(!k)return;if(!S.fold)S.fold={};S.fold[k]=d.open?1:0;save()},true);
function foldify(){var m=$('main');if(!m)return;[].forEach.call(m.querySelectorAll(':scope > .card'),function(c){var h=c.firstElementChild;if(!h||h.tagName!=='H3'||c.querySelector(':scope > details.fold'))return;var key='c:'+h.textContent.trim().slice(0,24),op=!S.fold||S.fold[key]!==0,d=document.createElement('details');d.className='fold cardf';d.dataset.fk=key;if(op)d.open=true;var s=document.createElement('summary');s.innerHTML=h.innerHTML;h.remove();d.appendChild(s);while(c.firstChild)d.appendChild(c.firstChild);c.className=c.className.replace(/\bcard\b/,'').trim();c.appendChild(d)})}
var _rtF=route;route=function(){_rtF.apply(this,arguments);if(cur==='me')try{foldify()}catch(e){}};
/* profile banner */
var _vmR=viewMe;viewMe=function(){var h=_vmR();if(sub.me==='profile')h='<div class="bnr">'+bannerSVG(S.cos.on.bn,360,96)+'</div>'+h;return h};
/* ---------- on-device streak reminders ---------- */
var RM={get:function(){try{return JSON.parse(localStorage.getItem('rm_'+P.meta.id)||'{}')}catch(e){return{}}},set:function(o){try{localStorage.setItem('rm_'+P.meta.id,JSON.stringify(o))}catch(e){}}};
function studiedToday(){return (S.dxp[today()]||0)>0}
function remindCheck(){var o=RM.get();if(!o.on||!o.t)return;var n=new Date(),hm=('0'+n.getHours()).slice(-2)+':'+('0'+n.getMinutes()).slice(-2);
 if(hm<o.t||o.last===today()||studiedToday())return;o.last=today();RM.set(o);
 var st=dayStreak(),msg=st>0?'Your '+st+'-day streak is waiting. A short session keeps it going.':'A 10-minute session today starts a new streak.';
 try{if('Notification' in window&&Notification.permission==='granted'){new Notification(P.meta.brand||P.meta.title,{body:msg,icon:'../icon.svg',tag:'streak'})}}catch(e){}
 toast(msg)}
setInterval(remindCheck,30000);document.addEventListener('visibilitychange',function(){if(!document.hidden)remindCheck()});
function icsDaily(t){var hh=t.split(':')[0],mm=t.split(':')[1],d=new Date(),ds=d.getFullYear()+('0'+(d.getMonth()+1)).slice(-2)+('0'+d.getDate()).slice(-2),nm=P.meta.brand||P.meta.title;
 return ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//'+nm+'//Streak reminder//EN','BEGIN:VEVENT','UID:streak-'+P.meta.id+'@local','DTSTAMP:'+ds+'T000000','DTSTART:'+ds+'T'+hh+mm+'00','RRULE:FREQ=DAILY','DURATION:PT10M','SUMMARY:'+nm+' practice (10 minutes)','DESCRIPTION:Keep your streak going.','BEGIN:VALARM','TRIGGER:PT0M','ACTION:DISPLAY','DESCRIPTION:Time for your '+nm+' practice','END:VALARM','END:VEVENT','END:VCALENDAR'].join('\r\n')}
var _vmS=viewMe;viewMe=function(){var h=_vmS();if(sub.me!=='settings')return h;var o=RM.get(),perm=('Notification' in window)?Notification.permission:'unsupported';
 return h+'<div class="card set"><h3>Streak reminders</h3><p class="small mute">Reminders stay on this device. Nothing is sent to a server. A reminder shows once a day, only if you have not practiced yet.</p><label><input type="checkbox" id="rm-on"'+(o.on?' checked':'')+'> Remind me when my streak is at risk</label><label>Time <input type="time" id="rm-t" value="'+(o.t||'17:00')+'"></label><div class="row" style="margin-top:8px;flex-wrap:wrap"><button class="btn sm sec" id="rm-perm"'+(perm==='granted'||perm==='unsupported'?' disabled':'')+'>'+(perm==='granted'?'Notifications allowed':perm==='denied'?'Blocked in browser settings':perm==='unsupported'?'Not supported here':'Allow notifications')+'</button><button class="btn sm sec" id="rm-ics">Download a daily calendar reminder</button></div><p class="small mute">Browsers can only show a notification while the app is open or in a background tab. The calendar reminder works when the app is closed.</p></div>'};
document.addEventListener('change',function(e){var t=e.target;if(t.id==='rm-on'||t.id==='rm-t'){var o=RM.get();o.on=$('rm-on').checked;o.t=$('rm-t').value||'17:00';RM.set(o);toast(o.on?'Reminder set for '+o.t:'Reminder off')}});
document.addEventListener('click',function(e){var id=e.target.id;
 if(id==='rm-perm'){try{Notification.requestPermission().then(function(){route()})}catch(x){}}
 if(id==='rm-ics'){var t=(RM.get().t)||'17:00',b=new Blob([icsDaily(t)],{type:'text/calendar'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=(P.meta.id||'practice')+'-reminder.ics';document.body.appendChild(a);a.click();setTimeout(function(){a.remove();URL.revokeObjectURL(a.href)},500)}});
