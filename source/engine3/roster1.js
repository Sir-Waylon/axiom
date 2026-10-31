/* ===== roster v2: original full-body cartoon characters, six rarity tiers, per-app casts, banners, titles =====
   Art direction: bold dark outlines, oversized heads, saturated gradients, a readable silhouette and one signature prop per
   character. Higher rarity adds more detail (armor, cape, halo, wings, flames, orbiting sparks, pearlescent finish).
   All characters are original designs. Characters come only from boxes (the starter is free). */
var RN=['Uncommon','Rare','Epic','Legendary','Mythic','Ascendant'];
var RC=[['#2fbf5b','#0b6b2c','#dcf7e5'],['#2f8cff','#0a4fb8','#dfeeff'],['#9b4dff','#5b1db5','#eee2ff'],['#ff9f1c','#8a4b00','#ffecc9'],['#ff3b4e','#a3121f','#ffe0e3'],['#9be7ff','#0b5a7a','#e6f9ff']];
/* published drop rates (percent). Low = no study today, High = full study bonus. Each column sums to exactly 100. */
var ODDS_LO=[57.1,27.6,10.0,3.9,0.9,0.5],ODDS_HI=[46.3,26.4,15.3,7.2,2.95,1.85];
var REFUND=[15,30,60,120,300,600],BOX_COST=100,LUCK_MIN=30;
var RB={
Voltaic:{k:'v',dk:'#06251a',bg:['#0f6b44','#06251a'],mk:'bolt',ro:[
 [0,'Sparky',-1,'bot','#19b36b','#ffe14a','antenna'],
 [1,'Ohmie',0,'cat','#37b6a3','#ffe27a','probe'],[2,'Resi',0,'dino','#8bc34a','#ffb02e','wrench'],[3,'Capa',0,'owl','#4dabf7','#ffd43b',''],[4,'Diode',0,'fox','#ff7043','#ffe0b2','bolt'],[5,'Gizmo',0,'bot','#26c6da','#ff5252','antenna'],[6,'Fuse',0,'pilot','#ffb300','#37474f',''],
 [7,'Amp',1,'hood','#2e7d32','#b9f6ca','probe'],[8,'Henri',1,'knight','#607d8b','#ffd54f','wrench'],[9,'Farad',1,'wiz','#3949ab','#ffee58','staff'],[10,'Coil',1,'drake','#00acc1','#ffd740','bolt'],[11,'Relay',1,'bot','#7e57c2','#69f0ae','antenna'],
 [12,'Arcflare',2,'hood','#d81b60','#fff176','bolt'],[13,'Gridlock',2,'knight','#455a64','#00e5ff','wrench'],[14,'Joulia',2,'wiz','#00897b','#ffd740','staff'],[15,'Pulse',2,'nova','#43a047','#f4ff81',''],
 [16,'Dynamo',3,'drake','#fb8c00','#fff59d','bolt'],[17,'Capacitron',3,'bot','#1e88e5','#ffea00','antenna,wings'],[18,'Lumina',3,'nova','#00c853','#ffff8d','staff'],
 [19,'Overload',4,'drake','#d50000','#ffd600','bolt'],[20,'Megawatt',4,'knight','#6200ea','#18ffff','wrench'],
 [21,'Supercon',5,'nova','#e0f7fa','#b388ff','staff'],[22,'Plasmo',5,'wiz','#f3e5f5','#40c4ff','staff']]},
Stratus:{k:'s',dk:'#0b2a4d',bg:['#1c6fc4','#0b2a4d'],mk:'cloud',ro:[
 [0,'Puff',-1,'sprite','#7ec8ff','#ffffff',''],
 [1,'Drizzle',0,'sprite','#64b5f6','#e1f5fe',''],[2,'Zephyr',0,'cat','#80cbc4','#ffffff','umbrella'],[3,'Dewey',0,'owl','#90caf9','#fff59d',''],[4,'Mistral',0,'pilot','#4fc3f7','#ff8a65',''],[5,'Fogg',0,'bot','#b0bec5','#ffd54f','antenna'],[6,'Sunny',0,'fox','#ffca28','#ff7043','umbrella'],
 [7,'Squall',1,'hood','#3f51b5','#80d8ff','staff'],[8,'Isobar',1,'knight','#546e7a','#81d4fa','umbrella'],[9,'Cirrus',1,'wiz','#5c6bc0','#e3f2fd','staff'],[10,'Hailey',1,'dino','#26c6da','#ffffff',''],[11,'Barometer',1,'bot','#26a69a','#ffab91','antenna'],
 [12,'Cumulo',2,'nova','#42a5f5','#ffffff',''],[13,'Gale',2,'hood','#00acc1','#e0f7fa','umbrella'],[14,'Stormi',2,'drake','#5e35b1','#ffee58','bolt'],[15,'Frontier',2,'knight','#1565c0','#ff8a80','staff'],
 [16,'Thunderhead',3,'drake','#37474f','#ffeb3b','bolt,wings'],[17,'Aurora',3,'wiz','#00bfa5','#ea80fc','staff'],[18,'Nimbus',3,'sprite','#9fa8da','#fff176','bolt'],
 [19,'Cyclone',4,'nova','#0277bd','#e1f5fe','umbrella'],[20,'Eyewall',4,'knight','#263238','#ff5252','staff'],
 [21,'Zenith',5,'nova','#e3f2fd','#80d8ff','staff'],[22,'Halcyon',5,'sprite','#f3e5f5','#b2ebf2','']]},
Axiom:{k:'x',dk:'#17104d',bg:['#3a2fc4','#17104d'],mk:'tri',ro:[
 [0,'Delta',-1,'bot','#6c5bff','#ffd45a','antenna'],
 [1,'Sigma',0,'cat','#7e57c2','#ffe082','compass'],[2,'Theta',0,'owl','#26a69a','#ffd45a','book'],[3,'Radi',0,'fox','#ef6c00','#fff3e0','compass'],[4,'Vertex',0,'dino','#43a047','#ffeb3b','tri'],[5,'Slope',0,'pilot','#5c6bc0','#ffab40',''],[6,'Quark',0,'bot','#ec407a','#fff59d','antenna'],
 [7,'Proof',1,'hood','#512da8','#ffd45a','book'],[8,'Euclid',1,'knight','#455a64','#ffd45a','compass'],[9,'Gauss',1,'wiz','#3949ab','#ffe082','staff'],[10,'Pythia',1,'drake','#00897b','#ffd45a','tri'],[11,'Lemma',1,'bot','#8e24aa','#b2ff59','antenna'],
 [12,'Theorem',2,'knight','#283593','#ffca28','compass'],[13,'Abacus',2,'hood','#bf360c','#ffe0b2','book'],[14,'Fibo',2,'nova','#6a1b9a','#ffd45a',''],[15,'Euler',2,'wiz','#00695c','#ffd45a','staff'],
 [16,'Infinity',3,'drake','#4a148c','#ffd45a','tri,wings'],[17,'Archi',3,'knight','#37474f','#ffd45a','compass'],[18,'Prime',3,'nova','#d500f9','#ffff8d','staff'],
 [19,'Riemann',4,'wiz','#1a237e','#ff80ab','staff'],[20,'Goldie',4,'drake','#ff6f00','#ffffff','tri'],
 [21,'Axiomatic',5,'nova','#ede7f6','#ffd45a','staff'],[22,'Tessera',5,'knight','#e8eaf6','#ff80ab','compass']]}
};

function _derive(src,names,cols){return src.map(function(r,i){var c=cols[i%cols.length];return [r[0],names[i],r[2],r[3],c[0],c[1],r[6]]})}
var _PC=[['#ef6c00','#fff3e0'],['#6a1b9a','#ffd45a'],['#00897b','#fff59d'],['#c62828','#ffe0b2'],['#1565c0','#ffd54f'],['#ad1457','#f8bbd0'],['#33691e','#ffee58'],['#4527a0','#b2ff59'],['#00838f','#ffab40'],['#e65100','#e1f5fe'],['#2e7d32','#ffcc80'],['#283593','#ffd740']];
RB.Apex={k:'p',dk:'#3a1500',bg:['#b4410a','#3a1500'],mk:'sig',ro:_derive(RB.Axiom.ro,['Slope','Lim','Parab','Asymp','Radian','Sine','Cosa','Tangy','Secant','Vector','Matrix','Integra','Derive','Logan','Expo','Polar','Conic','Ellipse','Hyper','Calcula','Zeno','Newtonia','Leibniz'],_PC)};
RB.Quanta={k:'q',dk:'#032a36',bg:['#0a6e8a','#032a36'],mk:'atom',ro:_derive(RB.Voltaic.ro,['Qubit','Joule','Newt','Hertz','Tesla','Gauss','Watt','Ohmi','Coulomb','Farady','Henrik','Kelvin','Pascal','Bohr','Curie','Planck','Maxwell','Lenz','Quark','Photon','Neutrino','Boson','Higgs'],_PC.slice().reverse())};
function _hx(c){c=c.replace('#','');return[parseInt(c.substr(0,2),16),parseInt(c.substr(2,2),16),parseInt(c.substr(4,2),16)]}
function _mx(a,b,t){var x=_hx(a),y=_hx(b);return '#'+[0,1,2].map(function(i){var v=Math.round(x[i]+(y[i]-x[i])*t);return (v<16?'0':'')+v.toString(16)}).join('')}
RB.Vertex=RB.Axiom;
function rbrand(){var b=(P&&P.meta&&P.meta.brand)||'Axiom';return RB[b]?b:'Axiom'}
function rmk(){var b=RB[rbrand()],AVL=[];b.ro.forEach(function(r){AVL.push([b.k+r[0],r[1],0,r[4],r[5],r[3],r[2],r[6]])});return AVL}
/* AV rows keep the old shape: [id,name,price,main,light,kind] plus [6]=rarity index (-1 starter), [7]=gear */
var AV=rmk();
var RAR={};AV.forEach(function(x){RAR[x[0]]=x[6]<0?'Starter':RN[x[6]]});
function avOf(id){return AV.filter(function(x){return x[0]===id})[0]||AV[0]}
var _rid=0;
function _brow(x,s,y,mood,i,ol){
 var P={idle:[.9,-.5,-1.5],cheer:[-1.4,-.4,-3.2],oops:[-2,1.4,-1.4],think:i?[-2.6,-3.4,-2.8]:[.6,.2,-1.2]}[mood]||[.9,-.5,-1.5];
 var xi=x-s*4.9,xo=x+s*5.4,yi=y+P[0],yo=y+P[1],xm=(xi+xo)/2,ym=(yi+yo)/2+P[2];
 return '<path d="M'+xo+' '+yo+'Q'+xm+' '+(ym-1.3)+' '+xi+' '+(yi-.4)+'L'+(xi-s*.2)+' '+(yi+1.3)+'Q'+xm+' '+(ym+1.7)+' '+xo+' '+(yo+.9)+'z" fill="'+ol+'" stroke="'+ol+'" stroke-width=".8" stroke-linejoin="round"/>'}
function _eyes(mood,y,pc,ol){
 var xs=[25,39],h='',br='',df='',pcl=_mx(pc,'#ffffff',.45),pcd=_mx(pc,'#000000',.25),id=_rid;
 xs.forEach(function(x,i){br+=_brow(x,i?1:-1,y-9.2,mood,i,ol)});
 if(mood==='cheer')return br+xs.map(function(x,i){var s=i?1:-1;return '<path d="M'+(x-5)+' '+(y+2)+'q5-9 10 0" stroke="'+ol+'" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M'+(x+s*5)+' '+(y+1.4)+'l'+(s*2)+' -1.6" stroke="'+ol+'" stroke-width="1.5" stroke-linecap="round"/>'}).join('')+'<path d="M31 35.8q1 1.2 2 0" stroke="'+ol+'" stroke-width="1.1" fill="none" stroke-linecap="round" opacity=".55"/>';
 xs.forEach(function(x,i){
  var s=i?1:-1,lx=mood==='think'?1.2:s*-.4,ly=mood==='think'?-1:.3,wide=mood==='oops',pr=wide?2.4:3.9,lid=mood==='think'?1.5:0,
   sh='M'+(x-5.1)+' '+(y+.6)+'Q'+(x-4.6)+' '+(y-6)+' '+x+' '+(y-6)+'Q'+(x+4.6)+' '+(y-6)+' '+(x+5.1)+' '+(y+.6)+'Q'+(x+4.4)+' '+(y+6)+' '+x+' '+(y+6)+'Q'+(x-4.4)+' '+(y+6)+' '+(x-5.1)+' '+(y+.6)+'z',cid='ec'+id+'_'+i;
  df+='<clipPath id="'+cid+'"><path d="'+sh+'"/></clipPath><radialGradient id="ei'+id+'_'+i+'" cx=".5" cy=".38" r=".7"><stop offset="0" stop-color="'+pcl+'"/><stop offset=".55" stop-color="'+pc+'"/><stop offset="1" stop-color="'+pcd+'"/></radialGradient>';
  h+='<path d="'+sh+'" fill="#fff"/>'
   +'<g clip-path="url(#'+cid+')"><path d="M'+(x-6)+' '+(y-6)+'h12v3q-6 2.4-12 0z" fill="#000" opacity=".1"/>'
   +'<circle cx="'+(x+lx)+'" cy="'+(y+.8+ly)+'" r="'+(pr+.5)+'" fill="url(#ei'+id+'_'+i+')" stroke="'+pcd+'" stroke-width=".9"/>'
   +'<circle cx="'+(x+lx)+'" cy="'+(y+.9+ly)+'" r="'+(pr*.4)+'" fill="'+ol+'"/>'
   +'<path d="M'+(x+lx-pr*.8)+' '+(y+1.6+ly)+'a'+(pr*.9)+' '+(pr*.9)+' 0 0 0 '+(pr*1.6)+' 0" stroke="#fff" stroke-width=".8" fill="none" opacity=".4"/>'
   +'<ellipse cx="'+(x+lx-1.3)+'" cy="'+(y-.9+ly)+'" rx="1.45" ry="1.6" fill="#fff"/><circle cx="'+(x+lx+1.6)+'" cy="'+(y+2+ly)+'" r=".7" fill="#fff" opacity=".9"/>'
   +(lid?'<path d="M'+(x-6)+' '+(y-6.4)+'h12v'+(6.4+lid-1.2)+'q-6 '+(mood==='think'?0:1.6)+'-12 0z" fill="'+ol+'" opacity=".5"/>':'')+'</g>'
   +'<path d="'+sh+'" fill="none" stroke="'+ol+'" stroke-width="1.5"/>'
   +'<path d="M'+(x-5.4)+' '+(y-.6)+'Q'+x+' '+(y-8.4)+' '+(x+5.4)+' '+(y-.6)+'" stroke="'+ol+'" stroke-width="2.6" fill="none" stroke-linecap="round"/>'
   +'<path d="M'+(x+s*5.2)+' '+(y-1)+'l'+(s*2.4)+' -2.2M'+(x+s*4.6)+' '+(y-2.6)+'l'+(s*2)+' -2.6" stroke="'+ol+'" stroke-width="1.4" stroke-linecap="round"/>'
   +'<path d="M'+(x-3.4)+' '+(y+6.6)+'q3.4 1.4 6.8 0" stroke="'+ol+'" stroke-width=".8" fill="none" opacity=".35"/>'});
 return '<defs>'+df+'</defs>'+br+'<g class="rblink" style="animation-delay:-'+((_rid*1.37)%4).toFixed(1)+'s">'+h+'</g><path d="M31 35.8q1 1.2 2 0" stroke="'+ol+'" stroke-width="1.1" fill="none" stroke-linecap="round" opacity=".55"/>'}
function _mouth(mood,y,ol){
 var dim='<path d="M26.6 '+(y+.4)+'l-1.1 -1M37.4 '+(y+.4)+'l1.1 -1" stroke="'+ol+'" stroke-width="1" stroke-linecap="round" opacity=".6"/>';
 if(mood==='cheer')return '<path d="M26.5 '+y+'q5.5 9 11 0z" fill="#7a1f2e" stroke="'+ol+'" stroke-width="1.6" stroke-linejoin="round"/><path d="M27.6 '+(y+.9)+'h8.8v1.6q-4.4 1.2 -8.8 0z" fill="#fff"/><path d="M29 '+(y+4.4)+'q3 -2.4 6 0q-3 2.6 -6 0z" fill="#ff8a96"/>'+dim;
 if(mood==='oops')return '<path d="M27.5 '+(y+3)+'q4.5-4 9 0" stroke="'+ol+'" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M52 24q2.6 3.6 0 5.8q-2.6-2.2 0-5.8z" fill="#6cc6ff" stroke="'+ol+'" stroke-width="1"/>';
 if(mood==='think')return '<path d="M28.5 '+(y+2)+'h7" stroke="'+ol+'" stroke-width="2" stroke-linecap="round"/><path d="M35.6 '+(y+2)+'l1.2 -1" stroke="'+ol+'" stroke-width="1" stroke-linecap="round"/>';
 return '<path d="M27 '+(y+.4)+'q4.5 4.6 9.6 -1" stroke="'+ol+'" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M36.8 '+(y-.7)+'l1.3 -1.3" stroke="'+ol+'" stroke-width="1.1" stroke-linecap="round" opacity=".7"/>'}
function _glow(mood,y,col,ol){
 if(mood==='cheer')return [25,39].map(function(x){return '<path d="M'+(x-4.4)+' '+(y+1.8)+'q4.4-7 8.8 0" stroke="'+col+'" stroke-width="2.8" fill="none" stroke-linecap="round"/>'}).join('');
 if(mood==='oops')return '<path d="M20 '+(y-3)+'l9 3.4M44 '+(y-3)+'l-9 3.4" stroke="'+col+'" stroke-width="2.6" stroke-linecap="round"/>';
 var ry=mood==='think'?3:4.4;return '<g class="rblink" style="animation-delay:-'+((_rid*1.37)%4).toFixed(1)+'s">'+[25,39].map(function(x){return '<ellipse cx="'+x+'" cy="'+y+'" rx="3.5" ry="'+ry+'" fill="'+col+'"/>'}).join('')+'</g>'}
function charSVG(c,mood,full,px){
 var id='rc'+(++_rid),m=c.p[0],a=c.p[1],r=c.r,g=c.g||[],has=function(x){return g.indexOf(x)>=0},
 dk=_mx(m,'#000000',.55),ol=_mx(m,'#000000',.78),lt=_mx(m,'#ffffff',.5),ad=_mx(a,'#000000',.45),
 skin='#ffd9b8',pc=_mx(m,'#000000',.5),
 o='stroke="'+ol+'" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"',
 pearl=r===5,fm='url(#'+id+'m)',fa='url(#'+id+'a)',k=c.a,BR=RB[rbrand()],mk=BR.mk,rc=r>=0?RC[r][0]:'#9aa4c4',
 defs='<defs><linearGradient id="'+id+'m" x1="0" y1="0" x2="1" y2="1">'+(pearl?'<stop offset="0" stop-color="#ffffff"/><stop offset=".35" stop-color="#d7f3ff"/><stop offset=".7" stop-color="#f6d9ff"/><stop offset="1" stop-color="#d4ffe8"/>':'<stop offset="0" stop-color="'+lt+'"/><stop offset=".55" stop-color="'+m+'"/><stop offset="1" stop-color="'+dk+'"/>')+'</linearGradient><linearGradient id="'+id+'a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+_mx(a,'#ffffff',.45)+'"/><stop offset="1" stop-color="'+a+'"/></linearGradient><radialGradient id="'+id+'g"><stop offset="0" stop-color="'+rc+'" stop-opacity=".55"/><stop offset="1" stop-color="'+rc+'" stop-opacity="0"/></radialGradient></defs>',
 B='',H='',T='',cx=32;
 var fl=(k==='sprite');
 if(r>=2)B+='<circle cx="32" cy="52" r="46" fill="url(#'+id+'g)" class="raura"/>';
 B+='<ellipse cx="32" cy="91" rx="'+(fl?9:17)+'" ry="3.2" fill="#000" opacity=".22"/>';
 if(has('wings')||r===3&&!has('cape')&&k!=='wiz'){var wc=pearl?'#ffffff':_mx(a,'#ffffff',.2);B+='<g class="rwing"><path d="M22 52Q2 36 2 12Q16 18 25 38z" fill="'+wc+'" '+o+'/><path d="M42 52Q62 36 62 12Q48 18 39 38z" fill="'+wc+'" '+o+'/><path d="M10 26q8 4 13 16M54 26q-8 4-13 16" stroke="'+ol+'" stroke-width="1.2" fill="none" opacity=".5"/></g>'}
 if(has('cape')||(r>=2&&r!==3&&!has('wings'))){B+='<path d="M21 48Q8 72 14 92L50 92Q56 72 43 48z" fill="'+(pearl?'#c9b6ff':ad)+'" '+o+'/><path d="M24 54Q18 74 22 90" stroke="'+a+'" stroke-width="1.6" fill="none" opacity=".6"/>'}
 if(k==='fox')B+='<g class="rtail"><path d="M44 72Q66 70 62 48Q60 62 46 64z" fill="'+fm+'" '+o+'/><path d="M62 48Q64 54 60 58Q60 52 62 48z" fill="#fff"/><path d="M52 66q5-2 7-8" stroke="'+ol+'" stroke-width="1" fill="none" opacity=".4"/></g>';
 if(k==='cat')B+='<g class="rtail"><path d="M43 74Q62 78 58 58" stroke="'+ol+'" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M43 74Q62 78 58 58" stroke="'+m+'" stroke-width="3.8" fill="none" stroke-linecap="round"/><path d="M55 76l1-4M59 70l2-3" stroke="'+ol+'" stroke-width="1.6" opacity=".6"/></g>';
 if(k==='dino'||k==='drake')B+='<g class="rtail"><path d="M42 72Q62 74 60 56L52 68z" fill="'+fm+'" '+o+'/><path d="M50 70l3-5M55 70l2-5" stroke="'+ol+'" stroke-width="1.2" opacity=".45"/></g>';
 if(r>=4)B+='<g class="rflame"><path d="M14 90q-4-9 2-16q1 6 5 7q-2-6 2-12q2 9 6 12q1 5-2 9z" fill="#ff7a1a" opacity=".85"/><path d="M42 90q-3-8 2-14q1 5 4 6q-1-5 2-10q3 8 5 11q2 4-1 7z" fill="#ffc21a" opacity=".85"/></g>';
 /* legs + boots */
 if(!fl){B+='<path d="M27 70V83M37 70V83" stroke="'+ol+'" stroke-width="10" stroke-linecap="round"/><path d="M27 70V83M37 70V83" stroke="'+dk+'" stroke-width="6" stroke-linecap="round"/><ellipse cx="25.5" cy="87" rx="7.4" ry="4.4" fill="'+fa+'" '+o+'/><ellipse cx="38.5" cy="87" rx="7.4" ry="4.4" fill="'+fa+'" '+o+'/><rect x="21" y="80.4" width="11" height="3.6" rx="1.6" fill="'+ad+'" '+o+'/><rect x="32" y="80.4" width="11" height="3.6" rx="1.6" fill="'+ad+'" '+o+'/><path d="M21 86.6q2.4 1.6 5.4 0M34 86.6q2.4 1.6 5.4 0" stroke="#fff" stroke-opacity=".5" stroke-width="1.2" fill="none"/>'}
 else{B+='<path d="M20 68Q18 84 32 90Q46 84 44 68z" fill="'+fm+'" '+o+'/><path d="M22 80q4 4 6 8M42 80q-4 4-6 8" stroke="'+ol+'" stroke-width="1.4" fill="none" opacity=".4"/>'}
 if(!fl){B+='<path d="M37.6 70V83" stroke="'+ol+'" stroke-width="3" opacity=".28" stroke-linecap="round"/><rect x="22.2" y="75.6" width="9.6" height="5" rx="2.2" fill="'+fa+'" '+o+'/><rect x="32.2" y="75.6" width="9.6" height="5" rx="2.2" fill="'+fa+'" '+o+'/><path d="M24 77h3M34 77h3" stroke="#fff" stroke-width="1.2" stroke-linecap="round" opacity=".6"/><path d="M18.6 88.2Q25.5 93.6 32.4 88.2M31.6 88.2Q38.5 93.6 45.4 88.2" stroke="#f4f6ff" stroke-width="1.7" fill="none" stroke-linecap="round" opacity=".85"/><ellipse cx="23.2" cy="86.4" rx="2.8" ry="1.5" fill="#fff" opacity=".4"/><ellipse cx="36.2" cy="86.4" rx="2.8" ry="1.5" fill="#fff" opacity=".4"/><path d="M24.2 81.6l3 1.2M24.2 83.4l3 1.2M37.2 81.6l3 1.2M37.2 83.4l3 1.2" stroke="#fff" stroke-width=".9" opacity=".6" stroke-linecap="round"/>'}
 /* torso */
 B+='<path d="M20 51Q20 46 26 46H38Q44 46 44 51V68Q44 73 39 73H25Q20 73 20 68z" fill="'+fm+'" '+o+'/><path d="M21 65H43" stroke="'+ol+'" stroke-width="3.4"/><rect x="29.5" y="62.6" width="5" height="5.6" rx="1.4" fill="'+fa+'" stroke="'+ol+'" stroke-width="1.2"/>';
 B+='<path d="M37.4 46H38Q44 46 44 51V68Q44 73 39 73H37.4z" fill="'+ol+'" opacity=".2"/><path d="M24 47.6H40L38.4 58H25.6z" fill="'+lt+'" opacity=".2" stroke="'+ol+'" stroke-width=".9"/><path d="M26 46.6Q32 50.4 38 46.6" fill="'+dk+'" stroke="'+ol+'" stroke-width="1.2"/>';
 if(!fl){B+='<rect x="21.6" y="66.6" width="5.2" height="5.4" rx="1.3" fill="'+dk+'" '+o+'/><rect x="37.2" y="66.6" width="5.2" height="5.4" rx="1.3" fill="'+dk+'" '+o+'/><path d="M22.4 68.6h3.6M38 68.6h3.6" stroke="#fff" stroke-width=".9" opacity=".5"/>';if(r>=2||k==='pilot'||k==='hood'||k==='knight')B+='<path d="M21 47.6L43 64.4" stroke="'+ol+'" stroke-width="4.6"/><path d="M21 47.6L43 64.4" stroke="'+a+'" stroke-width="2.7"/><path d="M21 47.6L43 64.4" stroke="#fff" stroke-width=".7" stroke-dasharray="1.6 2.2" opacity=".7"/>'}
 var det='';
 if(k==='fox'||k==='cat')det='<path d="M25 47Q32 60 39 47z" fill="#fff" opacity=".92"/>';
 if(k==='dino'||k==='drake')det='<path d="M26 54h12M26.5 58h11M27.5 62h9" stroke="'+lt+'" stroke-width="1.6" stroke-linecap="round" opacity=".6"/><circle cx="24" cy="68" r="1.2" fill="'+ol+'" opacity=".4"/><circle cx="40" cy="55" r="1.2" fill="'+ol+'" opacity=".4"/>';
 if(k==='owl')det='<path d="M25 53l7 4.4 7-4.4M25 58.4l7 4.4 7-4.4M26 63.8l6 3.6 6-3.6" stroke="'+lt+'" stroke-width="1.5" fill="none" stroke-linecap="round" opacity=".6"/>';
 if(k==='bot')det='<rect x="23" y="49" width="18" height="12" rx="3" fill="#0c1220" opacity=".5"/><circle cx="22.4" cy="70" r="1.3" fill="#cfd8dc"/><circle cx="41.6" cy="70" r="1.3" fill="#cfd8dc"/><path d="M24 69h16" stroke="'+ol+'" stroke-width="1" opacity=".4"/>';
 if(k==='knight')det='<rect x="30" y="46" width="4" height="26" fill="'+fa+'" opacity=".9"/><path d="M21 52h4M39 52h4M21 59h4M39 59h4" stroke="'+ol+'" stroke-width="1.2" opacity=".5"/>';
 if(k==='hood')det='<path d="M23 55h4M37 55h4M25 61h3M36 61h3" stroke="'+a+'" stroke-width="1.8" stroke-linecap="round" class="twk"/>';
 if(k==='wiz')det='<path d="M24 56l1 2 2 1-2 1-1 2-1-2-2-1 2-1zM39 62l.8 1.6 1.6.8-1.6.8-.8 1.6-.8-1.6-1.6-.8 1.6-.8z" fill="'+a+'" opacity=".9"/><path d="M20 70q12 3 24 0" stroke="'+a+'" stroke-width="1.6" fill="none"/>';
 if(k==='pilot')det='<path d="M20 49Q32 62 44 49" stroke="'+a+'" stroke-width="3" fill="none" opacity=".9"/><path d="M25 66h14" stroke="'+ol+'" stroke-width="1" opacity=".4"/>';
 if(k==='sprite')det='<path d="M26 70q2 4 0 8M38 70q-2 4 0 8" stroke="#fff" stroke-width="1.6" fill="none" opacity=".5" stroke-linecap="round" class="twk"/>';
 if(k==='nova')det='<circle cx="32" cy="66" r="2" fill="#fff" opacity=".7" class="twk"/>';
 B+=det+'<path d="M22.4 51Q21.4 59 22.4 66" stroke="#fff" stroke-opacity=".38" stroke-width="2" fill="none" stroke-linecap="round"/>';
 var emb=mk==='bolt'?'<path d="M33.5 49l-5.5 8h4l-2 6.4 7-9.2h-4.2z" fill="'+fa+'" stroke="'+ol+'" stroke-width="1.2" stroke-linejoin="round"/>':mk==='cloud'?'<path d="M26 58q-2-4 2.4-5 1.6-3.6 5.4-2 3.2.4 3.4 3.4 3.2.6 2.4 3.6z" fill="'+fa+'" stroke="'+ol+'" stroke-width="1.2" stroke-linejoin="round"/>':mk==='sig'?'<path d="M38 50H27l7 8-7 8h11" fill="none" stroke="'+fa+'" stroke-width="3.6" stroke-linejoin="round" stroke-linecap="round"/><path d="M38 50H27l7 8-7 8h11" fill="none" stroke="'+ol+'" stroke-width="1" opacity=".5"/>':mk==='atom'?'<ellipse cx="32" cy="58" rx="9" ry="3.6" fill="none" stroke="'+fa+'" stroke-width="1.8"/><ellipse cx="32" cy="58" rx="9" ry="3.6" fill="none" stroke="'+fa+'" stroke-width="1.8" transform="rotate(60 32 58)"/><ellipse cx="32" cy="58" rx="9" ry="3.6" fill="none" stroke="'+fa+'" stroke-width="1.8" transform="rotate(-60 32 58)"/><circle cx="32" cy="58" r="2.4" fill="'+fa+'" stroke="'+ol+'" stroke-width="1"/>':'<path d="M32 49.5l8 13.6H24z" fill="'+fa+'" stroke="'+ol+'" stroke-width="1.2" stroke-linejoin="round"/><circle cx="32" cy="58.6" r="1.6" fill="'+ol+'"/>';
 B+=emb;
 if(r<1&&!fl)B+='<path d="M14.6 51Q14.6 45.4 20.6 45.4Q23.6 46.6 24 51z" fill="'+dk+'" '+o+'/><path d="M49.4 51Q49.4 45.4 43.4 45.4Q40.4 46.6 40 51z" fill="'+dk+'" '+o+'/><path d="M16.4 48.4q2-2 4.4-2" stroke="#fff" stroke-width="1.1" opacity=".5" fill="none" stroke-linecap="round"/>';
 if(r>=1)B+='<circle cx="20" cy="50" r="6.2" fill="'+fa+'" '+o+'/><circle cx="44" cy="50" r="6.2" fill="'+fa+'" '+o+'/>';
 if(r>=3)B+='<circle cx="20" cy="50" r="2.2" fill="'+rc+'"/><circle cx="44" cy="50" r="2.2" fill="'+rc+'"/>';
 /* arms (left idle, right holds the signature prop) */
 var cheer=mood==='cheer';
 B+='<g class="rarmL"><path d="M20 52Q13 58 12 66" stroke="'+ol+'" stroke-width="9.4" fill="none" stroke-linecap="round"/><path d="M20 52Q13 58 12 66" stroke="'+m+'" stroke-width="5.6" fill="none" stroke-linecap="round"/><path d="M12.7 61L12.1 64.6" stroke="'+ol+'" stroke-width="7.4" stroke-linecap="round"/><path d="M12.7 61L12.1 64.6" stroke="'+fa+'" stroke-width="4.6" stroke-linecap="round"/><circle cx="12" cy="67.5" r="4.4" fill="'+(k==='bot'||k==='knight'||r>=1?fa:skin)+'" '+o+'/></g>';
 var hx=cheer?52:51,hy=cheer?46:67;
 B+='<g class="rarmR"><path d="M44 52Q'+(cheer?56:52)+' '+(cheer?50:58)+' '+hx+' '+(hy+1)+'" stroke="'+ol+'" stroke-width="9.4" fill="none" stroke-linecap="round"/><path d="M44 52Q'+(cheer?56:52)+' '+(cheer?50:58)+' '+hx+' '+(hy+1)+'" stroke="'+m+'" stroke-width="5.6" fill="none" stroke-linecap="round"/>';
 B+='<path d="M'+(hx-.8)+' '+(hy-6)+'L'+hx+' '+(hy-2.4)+'" stroke="'+ol+'" stroke-width="7.4" stroke-linecap="round"/><path d="M'+(hx-.8)+' '+(hy-6)+'L'+hx+' '+(hy-2.4)+'" stroke="'+fa+'" stroke-width="4.6" stroke-linecap="round"/>';
 var tools={wrench:'<path d="M'+hx+' '+(hy+6)+'V'+(hy-14)+'" stroke="'+ol+'" stroke-width="5" stroke-linecap="round"/><path d="M'+hx+' '+(hy+6)+'V'+(hy-14)+'" stroke="#cfd8dc" stroke-width="2.4" stroke-linecap="round"/><path d="M'+(hx-4.4)+' '+(hy-19)+'a5 5 0 1 0 8.8 0l-2.2 2.2h-4.4z" fill="#cfd8dc" stroke="'+ol+'" stroke-width="1.6" stroke-linejoin="round"/>',
  probe:'<path d="M'+hx+' '+(hy+5)+'V'+(hy-15)+'" stroke="'+ol+'" stroke-width="5" stroke-linecap="round"/><path d="M'+hx+' '+(hy+5)+'V'+(hy-15)+'" stroke="#e53935" stroke-width="2.4" stroke-linecap="round"/><path d="M'+hx+' '+(hy-15)+'v-5" stroke="#cfd8dc" stroke-width="1.8" stroke-linecap="round"/>',
  staff:'<path d="M'+hx+' '+(hy+8)+'V'+(hy-14)+'" stroke="'+ol+'" stroke-width="5" stroke-linecap="round"/><path d="M'+hx+' '+(hy+8)+'V'+(hy-14)+'" stroke="#8d6e63" stroke-width="2.4" stroke-linecap="round"/><circle cx="'+hx+'" cy="'+(hy-18)+'" r="5.2" fill="'+fa+'" '+o+' class="rorbp"/><circle cx="'+(hx-1.6)+'" cy="'+(hy-19.6)+'" r="1.4" fill="#fff"/>',
  umbrella:'<path d="M'+hx+' '+(hy+8)+'V'+(hy-12)+'" stroke="'+ol+'" stroke-width="4.4" stroke-linecap="round"/><path d="M'+hx+' '+(hy+8)+'V'+(hy-12)+'" stroke="#eceff1" stroke-width="1.8" stroke-linecap="round"/><path d="M'+(hx-13)+' '+(hy-12)+'Q'+hx+' '+(hy-30)+' '+(hx+13)+' '+(hy-12)+'q-4.3-3-8.7 0-4.3-3-8.6 0-4.3-3-8.7 0z" fill="'+fa+'" '+o+'/>',
  compass:'<path d="M'+hx+' '+(hy-18)+'L'+(hx-5)+' '+(hy+6)+'M'+hx+' '+(hy-18)+'L'+(hx+5)+' '+(hy+6)+'" stroke="'+ol+'" stroke-width="5" stroke-linecap="round"/><path d="M'+hx+' '+(hy-18)+'L'+(hx-5)+' '+(hy+6)+'M'+hx+' '+(hy-18)+'L'+(hx+5)+' '+(hy+6)+'" stroke="#cfd8dc" stroke-width="2" stroke-linecap="round"/><circle cx="'+hx+'" cy="'+(hy-18)+'" r="2.8" fill="'+fa+'" '+o+'/>',
  tri:'<path d="M'+hx+' '+(hy-22)+'L'+(hx+9)+' '+(hy-2)+'H'+(hx-9)+'z" fill="'+fa+'" '+o+'/><path d="M'+hx+' '+(hy-15)+'L'+(hx+4)+' '+(hy-6)+'H'+(hx-4)+'z" fill="'+ol+'" opacity=".35"/>',
  book:'<rect x="'+(hx-6)+'" y="'+(hy-14)+'" width="12" height="16" rx="2" fill="'+fa+'" '+o+'/><path d="M'+(hx-3)+' '+(hy-10)+'h6M'+(hx-3)+' '+(hy-6)+'h6" stroke="'+ol+'" stroke-width="1.4" stroke-linecap="round"/>',
  bolt:'<path d="M'+(hx+3)+' '+(hy-24)+'l-9 13h5.2l-3 11 11-14.6h-5.6z" fill="#ffe14a" '+o+' class="twk"/>'};
 T=(tools[g.filter(function(x){return tools[x]})[0]]||'');
 B+=T+'<circle cx="'+hx+'" cy="'+(hy+1.5)+'" r="4.4" fill="'+(k==='bot'||k==='knight'||r>=1?fa:skin)+'" '+o+'/></g>';
 /* head by archetype */
 var hd='',face='',ey=31,my=40;
 var std=function(fillc,rx,ry){return '<ellipse cx="32" cy="30" rx="'+(rx||17.5)+'" ry="'+(ry||16.5)+'" fill="'+fillc+'" '+o+'/>'};
 if(k==='bot'){hd='<g class="rant"><path d="M32 13V6" stroke="'+ol+'" stroke-width="3.4" stroke-linecap="round"/><circle cx="32" cy="5.4" r="3.4" fill="'+fa+'" '+o+' class="twk"/></g><rect x="13" y="25" width="5" height="11" rx="2.5" fill="'+fa+'" '+o+'/><rect x="46" y="25" width="5" height="11" rx="2.5" fill="'+fa+'" '+o+'/><rect x="15" y="13" width="34" height="33" rx="11" fill="'+fm+'" '+o+'/><rect x="19" y="20" width="26" height="20" rx="7" fill="#0c1220" stroke="'+ol+'" stroke-width="1.6"/><path d="M22 23h10" stroke="#fff" stroke-opacity=".35" stroke-width="1.6" stroke-linecap="round"/>';face=_glow(mood,31,a,ol)+(mood==='cheer'?'<path d="M26 37q6 6 12 0z" fill="'+a+'"/>':mood==='oops'?'<path d="M27 38q5-3 10 0" stroke="'+a+'" stroke-width="2" fill="none" stroke-linecap="round"/>':'<path d="M27 36.5q5 3.6 10 0" stroke="'+a+'" stroke-width="2" fill="none" stroke-linecap="round"/>')}
 else if(k==='hood'){hd='<path d="M12 40Q8 10 32 8Q56 10 52 40Q44 46 32 46Q20 46 12 40z" fill="'+fm+'" '+o+'/><path d="M17 38Q15 17 32 16Q49 17 47 38Q40 43 32 43Q24 43 17 38z" fill="#0c1220" stroke="'+ol+'" stroke-width="1.6"/><path d="M19 12Q32 5 45 12" stroke="'+lt+'" stroke-width="1.6" fill="none" opacity=".7"/><path d="M26 46l6 7 6-7z" fill="'+fa+'" '+o+'/>';face=_glow(mood,31,a,ol)+(mood==='cheer'?'<path d="M27 37q5 5 10 0" stroke="'+a+'" stroke-width="2" fill="none" stroke-linecap="round"/>':'')}
 else if(k==='knight'){hd='<path d="M32 3L36 11H28z" fill="'+fa+'" '+o+'/><path d="M13 36Q12 10 32 9Q52 10 51 36V43H13z" fill="'+fm+'" '+o+'/><path d="M32 10V24" stroke="'+ol+'" stroke-width="1.8"/><rect x="16" y="23" width="32" height="12" rx="5" fill="#0c1220" stroke="'+ol+'" stroke-width="1.6"/><path d="M17 12L12 8M47 12L52 8" stroke="'+a+'" stroke-width="2.4" stroke-linecap="round"/><ellipse cx="22" cy="15" rx="5" ry="2.2" fill="#fff" opacity=".4" transform="rotate(-28 22 15)"/><path d="M20 39h24" stroke="'+ol+'" stroke-width="1.6" opacity=".6"/>';face=_glow(mood,29,a,ol)}
 else if(k==='wiz'){hd=std(skin,16.5,15.5)+'<path d="M32 50Q16 42 16 36Q32 54 48 36Q48 42 32 50z" fill="#f4f4fb" '+o+'/><path d="M6 24Q32 31 58 24Q56 17 32 17T6 24z" fill="'+fm+'" '+o+'/><path d="M15 22Q22 -2 40 1Q31 9 32 20z" fill="'+fm+'" '+o+'/><rect x="15.4" y="18.8" width="33" height="3.4" rx="1.4" fill="'+fa+'" stroke="'+ol+'" stroke-width="1.2"/><path d="M38 8l1.4 3.2 3.2 1.4-3.2 1.4L38 17l-1.4-3-3.2-1.4 3.2-1.4z" fill="#fff" class="twk"/>';face=_eyes(mood,31,pc,ol)+_mouth(mood,41,ol);ey=0}
 else if(k==='pilot'){hd=std(skin)+'<path d="M13 28Q13 10 32 10Q51 10 51 28Q32 22 13 28z" fill="'+fm+'" '+o+'/><path d="M13 28V36M51 28V36" stroke="'+ol+'" stroke-width="3" stroke-linecap="round"/><rect x="15" y="22" width="34" height="13" rx="6.5" fill="'+fa+'" '+o+'/><circle cx="25" cy="28.5" r="5.2" fill="#e0f7ff" stroke="'+ol+'" stroke-width="1.6"/><circle cx="39" cy="28.5" r="5.2" fill="#e0f7ff" stroke="'+ol+'" stroke-width="1.6"/><circle cx="25" cy="29" r="2.4" fill="'+pc+'"/><circle cx="39" cy="29" r="2.4" fill="'+pc+'"/><circle cx="24" cy="27.6" r="1" fill="#fff"/><circle cx="38" cy="27.6" r="1" fill="#fff"/>';face=_mouth(mood,41,ol);ey=0}
 else if(k==='sprite'){hd='<path d="M12 36Q6 36 8 28Q8 20 16 21Q16 9 28 10Q36 4 44 13Q56 12 56 26Q60 36 50 38Q44 44 32 43Q20 44 12 36z" fill="'+fm+'" '+o+'/><ellipse cx="22" cy="17" rx="6" ry="2.4" fill="#fff" opacity=".55" transform="rotate(-20 22 17)"/>';face=_eyes(mood,28,pc,ol)+_mouth(mood,37,ol);ey=0;my=0}
 else if(k==='nova'){hd='<path d="M32 -1L35 8L44 4L42 13L52 14L45 21L53 28L43 29L46 38L37 34L32 43L27 34L18 38L21 29L11 28L19 21L12 14L22 13L20 4L29 8z" fill="'+(pearl?'#ffffff':a)+'" '+o+' class="rspin" opacity=".9"/>'+std(fm,15.5,15)+'<ellipse cx="25" cy="21" rx="6" ry="2.6" fill="#fff" opacity=".5" transform="rotate(-28 25 21)"/>';face=_eyes(mood,29.5,pc,ol)+_mouth(mood,38.5,ol);ey=0}
 else{ /* animal heads: fox cat owl dino drake */
  var ears='';
  if(k==='fox')ears='<path d="M15 24L16 4L29 14zM49 24L48 4L35 14z" fill="'+fm+'" '+o+'/><path d="M18.5 17L19 9L25 14zM45.5 17L45 9L39 14z" fill="'+a+'"/>';
  if(k==='cat')ears='<path d="M15 24L17 6L28 15zM49 24L47 6L36 15z" fill="'+fm+'" '+o+'/><path d="M19 17L19.4 11L24 14.4zM45 17L44.6 11L40 14.4z" fill="#ff9aa8"/>';
  if(k==='owl')ears='<path d="M14 22L13 6L26 13zM50 22L51 6L38 13z" fill="'+fm+'" '+o+'/>';
  if(k==='dino')ears='<path d="M20 15l3-8 3.4 6 3.2-8 3.4 8 3.4-6 3 8z" fill="'+fa+'" '+o+'/>';
  if(k==='drake')ears='<path d="M16 22L8 5L26 14zM48 22L56 5L38 14z" fill="'+fa+'" '+o+'/><path d="M24 14l2-9 3.6 7 2.4-8 2.4 8 3.6-7 2 9z" fill="'+fm+'" '+o+'/>';
  hd=ears+std(fm);
  if(k==='fox'||k==='cat')hd+='<ellipse cx="32" cy="38" rx="9.5" ry="6.4" fill="#fff" opacity=".92"/><ellipse cx="32" cy="34.6" rx="2.2" ry="1.5" fill="'+ol+'"/>'+(k==='cat'?'<path d="M10 34h9M10 38l8-2M54 34h-9M54 38l-8-2" stroke="'+ol+'" stroke-width="1.2"/>':'');
  if(k==='owl')hd+='<circle cx="25" cy="30" r="8" fill="#fff" opacity=".9"/><circle cx="39" cy="30" r="8" fill="#fff" opacity=".9"/><path d="M29.4 37.4l2.6 4.4 2.6-4.4z" fill="#ffb02e" '+o+'/>';
  if(k==='dino')hd+='<ellipse cx="32" cy="38" rx="11" ry="6.6" fill="'+_mx(m,'#ffffff',.6)+'" opacity=".95"/><circle cx="28" cy="36.4" r="1.1" fill="'+ol+'"/><circle cx="36" cy="36.4" r="1.1" fill="'+ol+'"/>';
  if(k==='drake')hd+='<ellipse cx="32" cy="37.4" rx="10" ry="6.8" fill="'+a+'" opacity=".6"/><circle cx="29" cy="36" r="1.1" fill="'+ol+'"/><circle cx="35" cy="36" r="1.1" fill="'+ol+'"/>';
  hd+='<ellipse cx="22.5" cy="19.5" rx="5.6" ry="2.4" fill="#fff" opacity=".45" transform="rotate(-28 22.5 19.5)"/>';
  face=_eyes(mood,k==='owl'?30:29.5,pc,ol)+(k==='fox'||k==='cat'?_mouth(mood,41.6,ol):_mouth(mood,42,ol));ey=0}
 if(['fox','cat','owl','dino','drake','wiz','pilot','nova','sprite'].indexOf(k)>=0)face+='<ellipse cx="19.4" cy="36" rx="3.2" ry="2" fill="#ff6f91" opacity=".38"/><ellipse cx="44.6" cy="36" rx="3.2" ry="2" fill="#ff6f91" opacity=".38"/>';
 var fr='',fr2='';
 if(has('goggles')&&k!=='pilot')fr+='<rect x="15" y="22" width="34" height="13" rx="6.5" fill="'+fa+'" opacity=".92" '+o+'/>';
 if(has('crown')||(r>=4&&k!=='wiz'&&k!=='nova'))fr+='<path d="M20 14l-2-10 8 5 6-8 6 8 8-5-2 10z" fill="#ffd23c" stroke="#8a5a00" stroke-width="1.6" stroke-linejoin="round" transform="translate(0 '+(k==='wiz'||k==='knight'||k==='nova'?-6:-3)+')"/>';
 if(r>=3)fr+='<ellipse cx="32" cy="'+(k==='wiz'||k==='knight'||k==='nova'||r>=4?-5:4)+'" rx="12" ry="3.4" fill="none" stroke="#ffe68a" stroke-width="2.8" opacity=".95" class="rhalo"/>';
 if(r>=4)fr2+='<g class="rorb"><path d="M32 -6l2.4 4.4-2.4 4.4-2.4-4.4z" fill="'+rc+'"/><path d="M60 52l2.4 4.4-2.4 4.4-2.4-4.4z" fill="'+a+'"/><path d="M4 66l2.4 4.4-2.4 4.4-2.4-4.4z" fill="'+rc+'"/></g>';
 if(pearl)fr2+='<path d="M10 20l1.2 3 3 1.2-3 1.2-1.2 3-1.2-3-3-1.2 3-1.2z" fill="#fff" class="twk"/><path d="M54 66l1 2.6 2.6 1-2.6 1-1 2.6-1-2.6-2.6-1 2.6-1z" fill="#fff" class="twk"/><path d="M52 12l.9 2.2 2.2.9-2.2.9-.9 2.2-.9-2.2-2.2-.9 2.2-.9z" fill="#ffd9f6" class="twk"/>';
 var inner='<g class="rbody">'+B+'<g class="rbob"><g class="rhead">'+hd+face+fr+'</g>'+fr2+'</g></g>';
 var cls='mas rf '+(r>=0?'rr'+r:'r0s')+(pearl?' prism':'')+' '+(mood||'');
 var lab=c.name+' ('+(r>=0?RN[r]:'Starter')+')';
 if(full){var s=px||96;return '<svg class="'+cls+'" width="'+Math.round(s*.6667)+'" height="'+s+'" viewBox="0 0 64 96" role="img" aria-label="'+lab+'">'+defs+inner+'</svg>'}
 var s2=px||40,bg=BR.bg;
 return '<svg class="'+cls+'" width="'+s2+'" height="'+s2+'" viewBox="6 3 52 52" role="img" aria-label="'+lab+'"><defs><linearGradient id="'+id+'b" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="'+bg[0]+'"/><stop offset="1" stop-color="'+bg[1]+'"/></linearGradient></defs>'+defs.replace('<defs>','').replace('</defs>','').replace(/^/,'<defs>')+'</defs><rect x="6" y="3" width="52" height="52" rx="14" fill="url(#'+id+'b)"/>'+(r>=0?'<rect x="6" y="3" width="52" height="52" rx="14" fill="none" stroke="'+rc+'" stroke-width="2.4"/>':'')+inner+'</svg>'}
function rowOf(id){var a=avOf(id);return{id:a[0],name:a[1],r:a[6],a:a[5],p:[a[3],a[4]],g:a[7]?a[7].split(','):[]}}
function mascot(id,mood,s,hat){s=s||40;return charSVG(rowOf(id),mood,s>=72,s)}
function avSVG(id,s){return mascot(id,'happy',s)}
/* migrate older saves (old avatar ids, hats, themes) once */
(function(){
 if(!S.cos)S.cos={own:{},on:{av:'a0',th:'t0',ti:'i0',ac:'c0'}};
 var c=S.cos;if(!c.own)c.own={};if(!c.on)c.on={};
 if(!c.v2){c.v2=1;var ref=0;try{var oldAV=[60,60,120,250,400,600,900,1500,2200,3500],oldAC=[40,90,150,300],oldTH=[80,80,150,200];
  for(var i=0;i<10;i++)if(c.own['a'+(i+1)])ref+=oldAV[i];
  for(var j=0;j<4;j++){if(c.own['c'+(j+1)])ref+=oldAC[j];if(c.own['t'+(j+1)])ref+=oldTH[j]}}catch(e){}
  if(ref>0){S.coins=(S.coins||0)+ref;c.refund=ref}
  c.own={};c.on.av=AV[0][0];c.on.ac='c0';c.on.th='t0';c.on.ti='i0';c.on.bn=c.on.bn||'b0';}
 if(!c.on.av||!avOf(c.on.av)||avOf(c.on.av)[0]!==c.on.av)c.on.av=AV[0][0];
 if(!c.on.bn)c.on.bn='b0';if(!c.pity)c.pity={e:0,l:0,n:0};if(!c.dups)c.dups=0;
 c.own[AV[0][0]]=1})();
