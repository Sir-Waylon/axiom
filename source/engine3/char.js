/* ===== characters + cosmetics data ===== */
/* cosmetics: characters, hats, themes, titles. Coins buy looks only. */
var AV=[['a0','Volt',0,'#ff8a1f','#fff0dc','spark'],['a1','Gizmo',60,'#3f8cff','#e1eeff','bot'],['a2','Hoot',60,'#8a5cf6','#eee6ff','owl'],['a3','Fennec',120,'#f2603c','#ffe5dd','fox'],['a4','Capa',250,'#18b58a','#d9f5ec','cat'],['a5','Rex',400,'#5aa83a','#e5f4d9','dino'],['a6','Hood',600,'#888','#222','hood'],['a7','Wizard',900,'#888','#222','wizard'],['a8','Drake',1500,'#888','#222','drake'],['a9','Knight',2200,'#888','#222','knight'],['a10','Nova',3500,'#888','#222','nova']];
var RAR={a0:'Common',a1:'Common',a2:'Common',a3:'Rare',a4:'Rare',a5:'Rare',a6:'Epic',a7:'Epic',a8:'Legendary',a9:'Legendary',a10:'Mythic'};
var AC=[['c0','No hat',0],['c1','Cap',40],['c2','Goggles',90],['c3','Headphones',150],['c4','Crown',300]];
var TH=[['t0','Indigo',0,'#5b4bff'],['t1','Ocean',80,'#0f8fd8'],['t2','Mint',80,'#12a67a'],['t3','Berry',150,'#c43b8a'],['t4','Sunset',200,'#e8582a']];
var TI=[['i0','Rookie',0,1],['i1','Volt Chaser',50,1],['i2','Ohm Hero',120,1],['i3','Diode Duke',200,1],['i4','Gate Keeper',300,1]];

var BT={
Voltaic:{dk:'#06251a',bg:'#0f6b44',p:{hood:['#12a35e','#7dffc0'],wizard:['#e0a100','#ffe27a'],drake:['#ffb02e','#fff0a0'],knight:['#2fbf86','#d6fff0'],nova:['#19e3a0','#f4ffb0']},mo:function(c){return '<path d="M24 2l-7 12h5l-3 10 9-13h-6z" fill="'+c+'" opacity=".18"/><path d="M6 20l-3 6h3l-1 6 5-8H7z" fill="'+c+'" opacity=".18" class="twk"/>'}},
Axiom:{dk:'#17104d',bg:'#3a2fc4',p:{hood:['#6c5bff','#c9c2ff'],wizard:['#7c3aed','#ffd45a'],drake:['#8a5cf6','#ffe08a'],knight:['#5b4bff','#ffd45a'],nova:['#a78bfa','#fff3b8']},mo:function(c){return '<path d="M20 4L34 30H6z" fill="none" stroke="'+c+'" stroke-width="1" opacity=".25"/><path d="M6 30a8 8 0 0 1 4-7" stroke="'+c+'" fill="none" opacity=".35"/>'}},
Stratus:{dk:'#0b2a4d',bg:'#1c6fc4',p:{hood:['#3aa0ff','#d3ecff'],wizard:['#2a7fdc','#ffe7a3'],drake:['#47a8ff','#ffffff'],knight:['#6fb7ff','#e7f4ff'],nova:['#7fd2ff','#fff6c9']},mo:function(c){return '<path d="M5 18q0-5 5-5 1-4 6-3 4 0 5 4 5-1 6 4z" fill="'+c+'" opacity=".2"/><path d="M29 24l-1 4M33 26l-1 4M25 27l-1 4" stroke="'+c+'" stroke-width="1.2" opacity=".35" class="twk"/>'}}};
function avOf(id){return AV.filter(function(x){return x[0]===id})[0]||AV[0]}
function mascot(id,mood,s,hat){
 var a=avOf(id),m=a[3],l=a[4],k=a[5];s=s||40;hat=hat===undefined?(S.cos&&S.cos.on.ac):hat;
 var b='<rect width="40" height="40" rx="12" fill="'+l+'"/><path d="M6 40c1-9 6-12 14-12s13 3 14 12z" fill="'+m+'"/>';
 if(k==='spark')b+='<path d="M20 1l-5 7h4l-2 5 7-8h-4z" fill="#ffd23c" stroke="#b8860b" stroke-width=".6"/>';
 if(k==='bot')b+='<rect x="19" y="3" width="2" height="6" fill="#33415c"/><circle cx="20" cy="3" r="2.4" fill="#ff5c5c"/><rect x="3.5" y="17" width="4" height="9" rx="2" fill="#33415c"/><rect x="32.5" y="17" width="4" height="9" rx="2" fill="#33415c"/>';
 if(k==='owl')b+='<path d="M7 12l3-9 6 7zM33 12l-3-9-6 7z" fill="'+m+'"/>';
 if(k==='fox')b+='<path d="M6 17L8 2l9 8zM34 17L32 2l-9 8z" fill="'+m+'"/><path d="M9 11l.8-5 3.7 3zM31 11l-.8-5-3.7 3z" fill="#fff"/>';
 if(k==='cat')b+='<path d="M7 16L8 3l8 6zM33 16L32 3l-8 6z" fill="'+m+'"/>';
 if(k==='dino')b+='<path d="M12 9l2-5 3 4 3-6 3 6 3-4 2 5z" fill="#2f7a1d"/>';
 b+=(k==='bot'?'<rect x="7" y="9" width="26" height="22" rx="7" fill="'+m+'"/><rect x="10" y="14" width="20" height="12" rx="5" fill="#fff"/>':'<ellipse cx="20" cy="21" rx="14" ry="13" fill="'+m+'"/><ellipse cx="20" cy="25" rx="9" ry="7" fill="#fff" opacity=".85"/>');
 if(k==='owl')b+='<circle cx="14" cy="20" r="6" fill="#fff"/><circle cx="26" cy="20" r="6" fill="#fff"/><path d="M18.5 25l1.5 3 1.5-3z" fill="#ffb02e"/>';


 var EL={hood:1,wizard:1,drake:1,knight:1,nova:1}[k];
 if(EL){var g='g'+id,BR=(P&&P.meta&&P.meta.brand)||'Axiom',T=BT[BR]||BT.Axiom,pl=T.p[k],m1=pl[0],m2=pl[1],dk=T.dk,st='stroke="'+dk+'" stroke-width="1.3" stroke-linejoin="round"';
  b='<defs><radialGradient id="'+g+'" cx=".35" cy=".25" r=".95"><stop offset="0" stop-color="'+m2+'"/><stop offset=".5" stop-color="'+m1+'"/><stop offset="1" stop-color="'+dk+'"/></radialGradient><linearGradient id="'+g+'b" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="'+dk+'"/><stop offset="1" stop-color="'+T.bg+'"/></linearGradient></defs><rect width="40" height="40" rx="12" fill="url(#'+g+'b)"/>'+T.mo(m2)+'<circle cx="20" cy="20" r="17.5" fill="none" stroke="'+m2+'" stroke-opacity=".4" stroke-dasharray="2 3" class="spin"/>';
  b+='<path d="M3 40c1-8 8-11 17-11s16 3 17 11z" fill="url(#'+g+')" '+st+'/><path d="M14 31l6 4 6-4" stroke="'+m2+'" stroke-width="1.2" fill="none" stroke-opacity=".8"/>';
  var happy=mood==='cheer'||mood==='happy',eh=mood==='oops'?1.2:happy?1.7:3,eyes=function(y,c){return mood==='oops'?'<path d="M10.5 '+(y-2)+'l5 2.4M29.5 '+(y-2)+'l-5 2.4" stroke="'+c+'" stroke-width="2"/>':'<ellipse cx="14.5" cy="'+y+'" rx="2.7" ry="'+eh+'" fill="'+c+'"/><ellipse cx="25.5" cy="'+y+'" rx="2.7" ry="'+eh+'" fill="'+c+'"/>'},mth=mood==='oops'?'M16 29.5q4-3 8 0':mood==='cheer'?'M14.5 27.5q5.5 7 11 0z':'M15.5 28q4.5 4.5 9 0',mc=k==='wizard'?'#5a2a1a':'#fff';
  if(k==='hood'){b+='<path d="M5 28Q4 5 20 3q16 2 15 25z" fill="url(#'+g+')" '+st+'/><path d="M10 26Q9 12 20 11q11 1 10 15q-3 5-10 5t-10-5z" fill="'+dk+'"/><path d="M9 20h22" stroke="'+m2+'" stroke-width="2.4" opacity=".0"/>'+eyes(20,m2)+'<path d="M12 12Q20 6 28 12" stroke="'+m2+'" stroke-width="1.2" fill="none" opacity=".7"/>'}
  if(k==='wizard'){b+='<ellipse cx="20" cy="22.5" rx="11" ry="10.5" fill="#ffe3c8" '+st+'/><path d="M20 27q-9 0-9 8l9 3 9-3q0-8-9-8z" fill="#f4f4fb" '+st+'/><path d="M2 15q18 3 36 0-2-4-18-4T2 15z" fill="url(#'+g+')" '+st+'/><path d="M9 14Q14 1 24 0q-3 6-3 14z" fill="url(#'+g+')" '+st+'/><rect x="9" y="12.2" width="22" height="2.4" fill="'+m2+'"/><path d="M26 6l1 2.4 2.4 1-2.4 1L26 13l-1-2.6-2.4-1 2.4-1z" fill="#fff" class="twk"/>'+eyes(21,'#2b1a3a')+'<path d="'+mth+'" stroke="#7a3b2a" stroke-width="1.6" fill="'+(mood==='cheer'?'#7a1f2e':'none')+'" stroke-linecap="round"/>'}
  if(k==='drake'){b+='<path d="M4 20L0 7l9 5zM36 20l4-13-9 5zM12 10l2-8 3 5 3-7 3 7 3-5 2 8z" fill="url(#'+g+')" '+st+'/><ellipse cx="20" cy="22" rx="13.5" ry="12.5" fill="url(#'+g+')" '+st+'/><ellipse cx="14" cy="14.5" rx="5.5" ry="2.4" fill="#fff" opacity=".3" transform="rotate(-25 14 14.5)"/><ellipse cx="20" cy="27" rx="8" ry="5.5" fill="'+m2+'" opacity=".55"/><path d="M16 29.5l1-3 1 3M22 29.5l1-3 1 3" fill="#fff" stroke="none"/>'+eyes(20,'#fff')+(mood==='cheer'?'<path d="M16 31q4 3 8 0z" fill="'+dk+'"/>':'')}
  if(k==='knight'){b+='<path d="M20 0l3 7h-6z" fill="'+m2+'" '+st+'/><path d="M7 24Q7 6 20 5q13 1 13 19v8H7z" fill="url(#'+g+')" '+st+'/><path d="M20 6v14" stroke="'+dk+'" stroke-width="1.2"/><rect x="10" y="17" width="20" height="6.5" rx="2.5" fill="'+dk+'"/>'+eyes(20.3,m2)+'<path d="M9 9l-3-3M31 9l3-3" stroke="'+m2+'" stroke-width="1.5"/><ellipse cx="14" cy="11" rx="4" ry="1.8" fill="#fff" opacity=".35" transform="rotate(-30 14 11)"/>'}
  if(k==='nova'){b+='<path d="M20 -1l2.4 8 8-2.4-2.4 8 8 2.4-8 2.4 2.4 8-8-2.4L20 31l-2.4-8-8 2.4 2.4-8-8-2.4 8-2.4-2.4-8 8 2.4z" fill="'+m2+'" opacity=".55" class="spin"/><circle cx="20" cy="21" r="12.5" fill="url(#'+g+')" '+st+'/><ellipse cx="15" cy="15" rx="5" ry="2.4" fill="#fff" opacity=".4" transform="rotate(-30 15 15)"/>'+eyes(21,'#fff')+'<path d="'+mth+'" stroke="#fff" stroke-width="1.8" fill="'+(mood==='cheer'?dk:'none')+'" stroke-linecap="round"/>'}
  if(k==='hood'||k==='knight')b+='<path d="'+mth+'" stroke="'+m2+'" stroke-width="1.6" fill="none" stroke-linecap="round" transform="translate(0 '+(k==='knight'?1:2)+')"/>';
  b+='<path d="M34 3l1 2.4 2.4 1-2.4 1L34 10l-1-2.6-2.4-1 2.4-1z" fill="#fff" class="twk"/><path d="M4 31l.8 1.8 1.8.8-1.8.8L4 36l-.8-1.8-1.8-.8 1.8-.8z" fill="'+m2+'" class="twk"/>';
  return '<svg class="mas elite '+k+' '+(mood||'')+'" width="'+s+'" height="'+s+'" viewBox="0 0 40 40" aria-hidden="true">'+b+'</svg>'}
 var e='',o='#1b2038';
 if(mood==='happy'||mood==='cheer'){e='<path d="M11 21q3-4 6 0M23 21q3-4 6 0" stroke="'+o+'" stroke-width="2" fill="none" stroke-linecap="round"/>'}
 else if(mood==='oops'){e='<circle cx="14" cy="21" r="2" fill="'+o+'"/><circle cx="26" cy="21" r="2" fill="'+o+'"/><path d="M10 18l5-1.6M30 18l-5-1.6" stroke="'+o+'" stroke-width="1.4"/>'}
 else if(mood==='think'){e='<circle cx="14" cy="21" r="2" fill="'+o+'"/><circle cx="26" cy="21" r="2" fill="'+o+'"/><path d="M23 16.5l6-1.5" stroke="'+o+'" stroke-width="1.4"/>'}
 else e='<circle cx="14" cy="21" r="2.1" fill="'+o+'"/><circle cx="26" cy="21" r="2.1" fill="'+o+'"/>';
 var mo=mood==='cheer'?'<path d="M15 27q5 7 10 0z" fill="#7a1f2e"/>':mood==='oops'?'<path d="M16 30q4-3 8 0" stroke="'+o+'" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M33 14q2 3 0 5q-2-2 0-5z" fill="#6cc6ff"/>':mood==='think'?'<path d="M17 29h6" stroke="'+o+'" stroke-width="1.6" stroke-linecap="round"/>':'<path d="M16 28q4 4 8 0" stroke="'+o+'" stroke-width="1.8" fill="none" stroke-linecap="round"/>';
 b+=e+mo+(k==='cat'?'<path d="M5 24h6M5 28l6-2M35 24h-6M35 28l-6-2" stroke="'+o+'" stroke-width=".9"/>':'')+(mood==='cheer'||mood==='happy'?'<circle cx="9.5" cy="26" r="2.2" fill="#ff9aa8" opacity=".6"/><circle cx="30.5" cy="26" r="2.2" fill="#ff9aa8" opacity=".6"/>':'');
 if(hat==='c1')b+='<path d="M9 12q11-11 22 0z" fill="#e23d3d"/><rect x="7" y="11" width="26" height="3" rx="1.5" fill="#b92b2b"/>';
 if(hat==='c2')b+='<rect x="8" y="16" width="24" height="9" rx="4.5" fill="#222" opacity=".85"/><circle cx="14" cy="20.5" r="3.4" fill="#9fe3ff"/><circle cx="26" cy="20.5" r="3.4" fill="#9fe3ff"/>';
 if(hat==='c3')b+='<path d="M7 22q0-15 13-15t13 15" stroke="#333" stroke-width="2.4" fill="none"/><rect x="4.5" y="19" width="5" height="9" rx="2.4" fill="#333"/><rect x="30.5" y="19" width="5" height="9" rx="2.4" fill="#333"/>';
 if(hat==='c4')b+='<path d="M10 11l-1-9 6 5 5-7 5 7 6-5-1 9z" fill="#ffc83d" stroke="#b8860b" stroke-width=".8"/>';
 return '<svg class="mas '+(mood||'')+'" width="'+s+'" height="'+s+'" viewBox="0 0 40 40" aria-hidden="true">'+b+'</svg>'}
function avSVG(id,s){return mascot(id,'happy',s)}
