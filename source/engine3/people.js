/* ===== people v1: original cartoon people (chunky outlines, big heads, bold outfits), one uniform per trainer =====
   Voltaic = line electricians, Stratus = storm chasers, Vertex = drafting-room geometers, Apex = summit climbers,
   Quanta = lab scientists. Each character gets its own hair, skin, face detail, headgear, prop and personality.
   Same API as before: charSVG(c,mood,full,px). Rarity adds gear (pauldrons, cape, wings, halo, crown, flames, sparks). */
var PSKIN=['#ffd9b8','#f5c39b','#e8a97d','#c98b5f','#a66a43','#7d4a2c','#5b3420','#fbe0cf'];
var PHAIR=['#2b1a12','#4a2c17','#7a4a24','#c9892e','#e8c65a','#1c1c28','#b5382a','#6b3fa0','#2f7fd0','#d85fa0'];
function _hh(s){var h=2166136261;for(var i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}h^=h>>>13;h=Math.imul(h,2654435761);return (h^(h>>>16))>>>0}
function _look(c){
 var br=rbrand(),h=_hh(br+':'+c.id),r=c.r;
 return{skin:PSKIN[h%8],hair:(h>>>3)%11,hc:(r>=3?4+((h>>>7)%6):(h>>>7)%10)%10,feat:(h>>>11)%7,gear:(h>>>14)%3,prop:(h>>>16)%4,iris:['#5b3a1e','#2f6fe0','#1f8a5a','#6b3fa0','#3a2a22','#2a8aa0'][(h>>>19)%6],h:h}}
function _hair(st,col,ol){
 var f='fill="'+col+'" stroke="'+ol+'" stroke-width="2" stroke-linejoin="round"',cap='M15.2 27Q12.6 10 32 10.2Q51.4 10 48.8 27Q47.4 21 42 19.4Q35.6 22.6 27 20.4Q20.4 19.4 17.6 23.6Q16 25 15.2 27z',back='',front='';
 switch(st){
 case 0:front='<path d="'+cap+'" '+f+'/>';break;
 case 1:front='<path d="'+cap+'" '+f+'/><path d="M17 17L14 6L24 13L28 3L33 12L40 3L42 13L51 6L47 18z" '+f+'/>';break;
 case 2:back='<circle cx="32" cy="6.6" r="6.4" '+f+'/>';front='<path d="'+cap+'" '+f+'/>';break;
 case 3:back='<path d="M46 14Q62 14 60 36Q58 46 52 44Q56 32 46 24z" '+f+'/>';front='<path d="'+cap+'" '+f+'/>';break;
 case 4:back='<circle cx="32" cy="21" r="21.5" '+f+'/>';front='<path d="'+cap+'" '+f+'/>';break;
 case 5:back='<path d="M14.2 24Q8 44 14 58L22 58L20 34zM49.8 24Q56 44 50 58L42 58L44 34z" '+f+'/>';front='<path d="'+cap+'" '+f+'/>';break;
 case 6:front='<path d="M26 15Q32 -3 38 15L36 21Q32 15 28 21z" '+f+'/><path d="M15.4 27Q14.6 20 20 17Q18 22 18.6 26zM48.6 27Q49.4 20 44 17Q46 22 45.4 26z" '+f+'/>';break;
 case 7:back='<g '+f+'><circle cx="17" cy="22" r="6.4"/><circle cx="47" cy="22" r="6.4"/><circle cx="22" cy="13" r="7"/><circle cx="32" cy="10" r="7.4"/><circle cx="42" cy="13" r="7"/></g>';front='<path d="M17.6 25Q22 17.6 32 17.6Q42 17.6 46.4 25Q45 20 32 20Q19 20 17.6 25z" '+f+'/>';break;
 case 8:back='<path d="M13.6 26Q10 42 16 44L48 44Q54 42 50.4 26Q32 6 13.6 26z" '+f+'/>';front='<path d="'+cap+'" '+f+'/>';break;
 case 9:back='<path d="M15 28Q10 40 14 52Q18 54 20 48Q16 40 19 30zM49 28Q54 40 50 52Q46 54 44 48Q48 40 45 30z" '+f+'/><path d="M13.4 38l7 2M13 45l7 2M50.6 38l-7 2M51 45l-7 2" stroke="'+ol+'" stroke-width="1" opacity=".5"/>';front='<path d="'+cap+'" '+f+'/>';break;
 default:front='<path d="M15.6 25Q16 12 32 11.6Q48 12 48.4 25Q44 17.6 32 17.6Q20 17.6 15.6 25z" '+f+'/>'}
 return[back,front+'<path d="M22 14.6Q28 12 35 13" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".35"/>']}
function _gear(br,gear,m,a,ol,o,hc){
 /* headgear by trainer: returns [behind-head, in-front-of-hair] */
 var f=function(c){return 'fill="'+c+'" '+o};
 if(gear===2)return['',''];
 if(br==='Voltaic')return gear===0?['','<path d="M13.6 21Q14 6 32 6Q50 6 50.4 21z" '+f('#ffd23c')+'/><path d="M11 21H53" stroke="'+ol+'" stroke-width="4.4" stroke-linecap="round"/><path d="M11 21H53" stroke="#ffbf00" stroke-width="2"/><path d="M29 6V20M35 6V20" stroke="'+ol+'" stroke-width="1.2" opacity=".5"/><rect x="28.4" y="9" width="7.2" height="5.4" rx="2.4" fill="#fff7c2" stroke="'+ol+'" stroke-width="1.2" class="twk"/>']:['','<path d="M14.6 22Q32 18 49.4 22" stroke="'+ol+'" stroke-width="5" fill="none"/><rect x="17" y="14" width="13" height="8.4" rx="4" fill="#cfe9ff" fill-opacity=".85" stroke="'+ol+'" stroke-width="2"/><rect x="34" y="14" width="13" height="8.4" rx="4" fill="#cfe9ff" fill-opacity=".85" stroke="'+ol+'" stroke-width="2"/><path d="M19 16.4h5M36 16.4h5" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/>'];
 if(br==='Stratus')return gear===0?['<path d="M10.6 46Q6 14 32 8Q58 14 53.4 46Q44 51 32 51Q20 51 10.6 46z" '+f(m)+'/>','<path d="M17 21Q32 13 47 21" stroke="'+ol+'" stroke-width="1.4" fill="none" opacity=".4"/><path d="M12 46Q32 54 52 46" stroke="'+a+'" stroke-width="2.4" fill="none" stroke-linecap="round"/>']:['','<path d="M12 22Q32 2 52 22Q32 17 12 22z" '+f('#ffca28')+'/><path d="M8 25Q32 15 56 25Q54 19 52 22Q32 17 12 22Q10 19 8 25z" '+f('#ffb300')+'/>'];
 if(br==='Axiom'||br==='Vertex')return gear===0?['','<path d="M12 21Q10 7 31 8Q50 8 52 19Q41 12 12 21z" '+f(m)+'/><path d="M12 21Q30 14 52 19" stroke="'+ol+'" stroke-width="1.2" fill="none" opacity=".5"/><circle cx="30" cy="7.6" r="2.4" '+f(a)+'/>']:['','<path d="M12 22Q32 16 52 22V25Q32 20 12 25z" '+f(m)+'/><path d="M12 22Q32 16 52 22" stroke="#fff" stroke-width="1.2" fill="none" opacity=".4"/>'];
 if(br==='Apex')return gear===0?['','<path d="M14 22Q13 6 32 6Q51 6 50 22Q32 18 14 22z" '+f(m)+'/><path d="M13.6 21.4Q32 17 50.4 21.4V26Q32 21.6 13.6 26z" '+f(a)+'/><circle cx="32" cy="4.6" r="4.2" '+f(a)+'/><path d="M16 12q3-3 8-3M22 17q-1-3 2-5" stroke="#fff" stroke-width="1" opacity=".4" fill="none"/>']:['','<path d="M14.6 22Q32 18 49.4 22" stroke="'+ol+'" stroke-width="5" fill="none"/><rect x="16" y="14" width="14" height="8.8" rx="4.4" fill="#ffb74d" fill-opacity=".8" stroke="'+ol+'" stroke-width="2"/><rect x="34" y="14" width="14" height="8.8" rx="4.4" fill="#ffb74d" fill-opacity=".8" stroke="'+ol+'" stroke-width="2"/>'];
 /* Quanta */
 return gear===0?['','<rect x="14.6" y="24.4" width="34.8" height="12.4" rx="6" fill="#bdf2ff" fill-opacity=".38" stroke="'+ol+'" stroke-width="2"/><path d="M14.6 30.6H11M49.4 30.6H53" stroke="'+ol+'" stroke-width="3" stroke-linecap="round"/><path d="M19 27l5-1" stroke="#fff" stroke-width="1.4" stroke-linecap="round" opacity=".8"/>']:['','<circle cx="25" cy="30" r="7.2" fill="#bdf2ff" fill-opacity=".22" stroke="'+ol+'" stroke-width="1.8"/><circle cx="39" cy="30" r="7.2" fill="#bdf2ff" fill-opacity=".22" stroke="'+ol+'" stroke-width="1.8"/><path d="M32.2 29.6h-.4M14.8 29l-2 -1M49.2 29l2 -1" stroke="'+ol+'" stroke-width="1.8" stroke-linecap="round"/>']}
function _feat(n,ol,hair){
 if(n===1)return '<g fill="#b9632f" opacity=".55"><circle cx="21.6" cy="36.4" r=".9"/><circle cx="24" cy="38" r=".9"/><circle cx="19.8" cy="38.4" r=".8"/><circle cx="42.4" cy="36.4" r=".9"/><circle cx="40" cy="38" r=".9"/><circle cx="44.2" cy="38.4" r=".8"/></g>';
 if(n===2)return '<path d="M23.6 22l1.8 4M44 31.4l-1.4 3.4" stroke="#c0392b" stroke-width="1.3" stroke-linecap="round" opacity=".75"/>';
 if(n===3)return '<path d="M26 42.4Q32 39.4 38 42.4Q35 44.4 32 43.4Q29 44.4 26 42.4z" fill="'+hair+'" stroke="'+ol+'" stroke-width="1.2" stroke-linejoin="round"/>';
 if(n===4)return '<circle cx="45" cy="38" r=".9" fill="'+ol+'" opacity=".7"/>';
 if(n===5)return '<path d="M21 42Q32 54 43 42Q40 47 32 47Q24 47 21 42z" fill="'+hair+'" stroke="'+ol+'" stroke-width="1.4" stroke-linejoin="round" opacity=".95"/>';
 return ''}
function _prop(br,k,hx,hy,m,a,ol){
 var o='stroke="'+ol+'" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"',S=function(d,w,c){return '<path d="'+d+'" stroke="'+ol+'" stroke-width="'+(w+2.6)+'" fill="none" stroke-linecap="round"/><path d="'+d+'" stroke="'+c+'" stroke-width="'+w+'" fill="none" stroke-linecap="round"/>'};
 var P={
 Voltaic:[S('M'+hx+' '+(hy+6)+'V'+(hy-14),2.6,'#cfd8dc')+'<path d="M'+(hx-4.6)+' '+(hy-19)+'a5.6 5.6 0 1 1 9.2 0l-2.4 3.4h-4.4z" fill="#b0bec5" '+o+'/>',
  S('M'+hx+' '+(hy+6)+'V'+(hy-14),2.6,'#e53935')+S('M'+hx+' '+(hy-14)+'v-6',1.4,'#cfd8dc'),
  '<path d="M'+(hx+3)+' '+(hy-24)+'l-9 13h5.2l-3 11 11-14.6h-5.6z" fill="#ffe14a" '+o+' class="twk"/>',
  '<rect x="'+(hx-5)+'" y="'+(hy-14)+'" width="10" height="17" rx="2.4" fill="#37474f" '+o+'/><rect x="'+(hx-2)+'" y="'+(hy-17)+'" width="4" height="3.4" fill="#cfd8dc" '+o+'/><path d="M'+(hx-2)+' '+(hy-7)+'h4M'+hx+' '+(hy-9)+'v4" stroke="#69f0ae" stroke-width="1.6" stroke-linecap="round"/>'],
 Stratus:['<path d="M'+hx+' '+(hy+8)+'V'+(hy-12)+'" stroke="'+ol+'" stroke-width="4.4" stroke-linecap="round"/><path d="M'+hx+' '+(hy+8)+'V'+(hy-12)+'" stroke="#eceff1" stroke-width="1.8" stroke-linecap="round"/><path d="M'+(hx-13)+' '+(hy-12)+'Q'+hx+' '+(hy-30)+' '+(hx+13)+' '+(hy-12)+'Q'+(hx+6.5)+' '+(hy-15)+' '+hx+' '+(hy-12)+'Q'+(hx-6.5)+' '+(hy-15)+' '+(hx-13)+' '+(hy-12)+'z" fill="'+a+'" '+o+'/>',
  S('M'+hx+' '+(hy+6)+'V'+(hy-11),2.4,'#90a4ae')+'<g class="rspin" style="transform-origin:'+hx+'px '+(hy-14)+'px"><path d="M'+(hx-7)+' '+(hy-14)+'H'+(hx+7)+'" stroke="'+ol+'" stroke-width="2"/><circle cx="'+(hx-7)+'" cy="'+(hy-14)+'" r="3" fill="'+a+'" '+o+'/><circle cx="'+(hx+7)+'" cy="'+(hy-14)+'" r="3" fill="'+a+'" '+o+'/></g>',
  '<rect x="'+(hx-2.4)+'" y="'+(hy-20)+'" width="4.8" height="24" rx="2.4" fill="#fff" '+o+'/><circle cx="'+hx+'" cy="'+(hy+4)+'" r="4.4" fill="#ef5350" '+o+'/><rect x="'+(hx-1)+'" y="'+(hy-12)+'" width="2" height="14" fill="#ef5350"/>',
  '<g class="twk"><circle cx="'+hx+'" cy="'+(hy-15)+'" r="7" fill="#fff" '+o+'/><circle cx="'+(hx-6)+'" cy="'+(hy-12)+'" r="4.6" fill="#fff" '+o+'/><circle cx="'+(hx+6)+'" cy="'+(hy-12)+'" r="4.6" fill="#fff" '+o+'/><circle cx="'+hx+'" cy="'+(hy-12)+'" r="5.4" fill="#fff"/></g><path d="M'+(hx-2)+' '+(hy-6)+'l-2 4M'+(hx+2)+' '+(hy-6)+'l-2 4" stroke="#4fc3f7" stroke-width="1.6" stroke-linecap="round"/>'],
 Vertex:[S('M'+hx+' '+(hy-18)+'L'+(hx-5)+' '+(hy+6)+'M'+hx+' '+(hy-18)+'L'+(hx+5)+' '+(hy+6),2.4,'#cfd8dc')+'<circle cx="'+hx+'" cy="'+(hy-18)+'" r="2.6" fill="'+a+'" '+o+'/>',
  '<path d="M'+(hx-11)+' '+(hy-2)+'A11 11 0 0 1 '+(hx+11)+' '+(hy-2)+'z" fill="#bdf2ff" fill-opacity=".8" '+o+'/><path d="M'+(hx-7)+' '+(hy-2)+'a7 7 0 0 1 14 0" stroke="'+ol+'" stroke-width="1" fill="none"/>',
  '<path d="M'+hx+' '+(hy-22)+'L'+(hx+9)+' '+(hy-2)+'H'+(hx-9)+'z" fill="'+a+'" '+o+'/><path d="M'+hx+' '+(hy-15)+'L'+(hx+4)+' '+(hy-6)+'H'+(hx-4)+'z" fill="'+ol+'" opacity=".35"/>',
  '<rect x="'+(hx-6)+'" y="'+(hy-14)+'" width="12" height="16" rx="2" fill="'+a+'" '+o+'/><path d="M'+(hx-3)+' '+(hy-10)+'h6M'+(hx-3)+' '+(hy-6)+'h6" stroke="'+ol+'" stroke-width="1.4" stroke-linecap="round"/>'],
 Apex:[S('M'+hx+' '+(hy+8)+'V'+(hy-14),2.8,'#8d6e63')+'<path d="M'+(hx-7)+' '+(hy-17)+'Q'+hx+' '+(hy-22)+' '+(hx+7)+' '+(hy-14)+'L'+(hx+5)+' '+(hy-13)+'Q'+hx+' '+(hy-17)+' '+(hx-6)+' '+(hy-14)+'z" fill="#b0bec5" '+o+'/>',
  S('M'+(hx-3)+' '+(hy+5)+'L'+(hx+3)+' '+(hy-17),3,'#ffd54f')+'<path d="M'+(hx+3)+' '+(hy-17)+'l1.4-4.6 2.4 3.6z" fill="#f8bbd0" '+o+'/>',
  S('M'+hx+' '+(hy+8)+'V'+(hy-20),2,'#cfd8dc')+'<path d="M'+hx+' '+(hy-20)+'l13 4.6-13 4.6z" fill="'+a+'" '+o+' class="twk"/>',
  '<rect x="'+(hx-9)+'" y="'+(hy-15)+'" width="18" height="13" rx="2.4" fill="#263238" '+o+'/><path d="M'+(hx-6)+' '+(hy-5)+'Q'+(hx-2)+' '+(hy-14)+' '+hx+' '+(hy-8)+'T'+(hx+6)+' '+(hy-12)+'" stroke="#69f0ae" stroke-width="1.8" fill="none" stroke-linecap="round"/>'],
 Quanta:['<path d="M'+(hx-2.6)+' '+(hy-19)+'h5.2v7l5 8q2 4-2 5h-11q-4-1-2-5l5-8z" fill="#e0f7fa" fill-opacity=".85" '+o+'/><path d="M'+(hx-6.2)+' '+(hy-3)+'h12.4l2 3.4q.6 1.6-1 1.6h-14.4q-1.6 0-1-1.6z" fill="#69f0ae" opacity=".9"/>',
  '<circle cx="'+hx+'" cy="'+(hy-12)+'" r="3" fill="'+a+'" '+o+'/><g class="rspin" style="transform-origin:'+hx+'px '+(hy-12)+'px"><ellipse cx="'+hx+'" cy="'+(hy-12)+'" rx="10" ry="4" fill="none" stroke="'+ol+'" stroke-width="1.6"/><ellipse cx="'+hx+'" cy="'+(hy-12)+'" rx="10" ry="4" fill="none" stroke="'+ol+'" stroke-width="1.6" transform="rotate(60 '+hx+' '+(hy-12)+')"/><ellipse cx="'+hx+'" cy="'+(hy-12)+'" rx="10" ry="4" fill="none" stroke="'+ol+'" stroke-width="1.6" transform="rotate(120 '+hx+' '+(hy-12)+')"/></g>',
  '<path d="M'+(hx-7)+' '+(hy-3)+'V'+(hy-12)+'a7 7 0 0 1 14 0V'+(hy-3)+'h-5V'+(hy-12)+'a2 2 0 0 0-4 0V'+(hy-3)+'z" fill="#e53935" '+o+'/><path d="M'+(hx-7)+' '+(hy-3)+'h5M'+(hx+2)+' '+(hy-3)+'h5" stroke="#eceff1" stroke-width="3"/>',
  '<rect x="'+(hx-7)+'" y="'+(hy-16)+'" width="14" height="19" rx="2" fill="#a1887f" '+o+'/><rect x="'+(hx-5)+'" y="'+(hy-14)+'" width="10" height="15" fill="#fff"/><path d="M'+(hx-3)+' '+(hy-10)+'h6M'+(hx-3)+' '+(hy-6)+'h6M'+(hx-3)+' '+(hy-2)+'h4" stroke="#455a64" stroke-width="1.2" stroke-linecap="round"/>']};
 return (P[br]||P.Vertex)[k%4]}
function _outfit(br,m,a,ol,o,dk,r,id){
 /* returns {legs,torso,over,sleeve,glove,boot} for a trainer uniform */
 var white=r===5?'#ffffff':'#f4f7fb',cr=_mx(a,'#ffffff',.55),O={};
 var T='M20 51Q20 46 26 46H38Q44 46 44 51V68Q44 73 39 73H25Q20 73 20 68z';
 if(br==='Voltaic'){var sh=_mx(a,'#ffffff',.35);O.sleeve=sh;O.pants=m;O.boot='#6d4c41';O.glove='#ffd23c';
  O.torso='<path d="'+T+'" fill="'+sh+'" '+o+'/><path d="M24 47V73H40V47L38 60H26z" fill="'+m+'" '+o+'/><path d="M24 46l2.4 10M40 46l-2.4 10" stroke="'+ol+'" stroke-width="3.4" stroke-linecap="round"/><path d="M24 46l2.4 10M40 46l-2.4 10" stroke="'+m+'" stroke-width="1.6" stroke-linecap="round"/><circle cx="26.6" cy="57" r="1.5" fill="'+a+'" stroke="'+ol+'" stroke-width=".8"/><circle cx="37.4" cy="57" r="1.5" fill="'+a+'" stroke="'+ol+'" stroke-width=".8"/><rect x="28" y="61" width="8" height="6" rx="1.4" fill="'+_mx(m,'#000000',.2)+'" stroke="'+ol+'" stroke-width="1.2"/><path d="M33.6 61.6l-2.2 2.6h1.8l-1 2.4 2.4-3h-1.8z" fill="#ffe14a"/>';
  O.over='<path d="M20 69H44V72.4H20z" fill="#8d6e63" '+o+'/><rect x="20.6" y="68.4" width="6.4" height="7.6" rx="1.6" fill="#a1887f" '+o+'/><rect x="37" y="68.4" width="6.4" height="7.6" rx="1.6" fill="#a1887f" '+o+'/><rect x="30" y="69" width="4" height="3.4" rx=".8" fill="'+a+'" stroke="'+ol+'" stroke-width="1"/>'}
 else if(br==='Stratus'){O.sleeve=m;O.pants=_mx(m,'#000000',.5);O.boot='#ffca28';O.glove='#37474f';
  O.torso='<path d="'+T+'" fill="'+m+'" '+o+'/><path d="M32 46.4V73" stroke="'+ol+'" stroke-width="1.8"/><path d="M26 48.4Q32 56 38 48.4L36 46.6H28z" fill="'+_mx(m,'#ffffff',.2)+'" '+o+'/><circle cx="29" cy="56" r="1.6" fill="'+a+'" stroke="'+ol+'" stroke-width=".9"/><circle cx="29" cy="62" r="1.6" fill="'+a+'" stroke="'+ol+'" stroke-width=".9"/><circle cx="35" cy="56" r="1.6" fill="'+a+'" stroke="'+ol+'" stroke-width=".9"/><circle cx="35" cy="62" r="1.6" fill="'+a+'" stroke="'+ol+'" stroke-width=".9"/><path d="M21 69h22" stroke="'+ol+'" stroke-width="1.2" opacity=".5"/><path d="M22.6 52Q22 58 22.6 64" stroke="#fff" stroke-width="1.6" fill="none" opacity=".4" stroke-linecap="round"/>';
  O.over='<path d="M24 47.2Q32 52 40 47.2L40 50Q32 55 24 50z" fill="'+a+'" '+o+'/><path d="M37 52l1.4 9.4h-3.6z" fill="'+a+'" '+o+'/>'}
 else if(br==='Apex'){O.sleeve=m;O.pants=_mx(m,'#000000',.55);O.boot='#455a64';O.glove=a;
  O.torso='<path d="'+T+'" fill="'+m+'" '+o+'/><path d="M20.6 54H43.4M20.6 60.4H43.4M20.6 66.6H43.4" stroke="'+ol+'" stroke-width="1.5" opacity=".6"/><path d="M32 47V73" stroke="'+ol+'" stroke-width="1.6"/><path d="M36 52l4 2.6-4 2.6" stroke="'+a+'" stroke-width="1.8" fill="none" stroke-linecap="round"/><path d="M22.6 52Q22 58 22.6 64" stroke="#fff" stroke-width="1.6" fill="none" opacity=".4" stroke-linecap="round"/><path d="M24 47.4V70M40 47.4V70" stroke="'+ol+'" stroke-width="2.6" opacity=".45"/>';
  O.over='<path d="M23.6 46.4Q32 50.4 40.4 46.4V51Q32 56 23.6 51z" fill="'+a+'" '+o+'/><path d="M37.4 51.4l1.4 11-4 .4-.6-9z" fill="'+a+'" '+o+'/><path d="M35.6 58.4l3.6-.6" stroke="'+ol+'" stroke-width="1" opacity=".5"/>'}
 else if(br==='Quanta'){var sk=_mx(a,'#ffffff',.2);O.sleeve=white;O.pants='#37474f';O.boot='#eceff1';O.glove=white;
  O.torso='<path d="'+T+'" fill="'+sk+'" '+o+'/><path d="M20 51Q20 46 26 46H29L32 56L29 73H25Q20 73 20 68zM44 51Q44 46 38 46H35L32 56L35 73H39Q44 73 44 68z" fill="'+white+'" '+o+'/><path d="M29 46.4L24.6 53L29.6 57.4M35 46.4L39.4 53L34.4 57.4" fill="'+white+'" stroke="'+ol+'" stroke-width="1.4" stroke-linejoin="round"/><circle cx="32" cy="63" r="2.4" fill="'+a+'" stroke="'+ol+'" stroke-width=".9"/><rect x="21.4" y="58" width="6.4" height="7" rx="1.2" fill="'+_mx(white,'#000000',.06)+'" stroke="'+ol+'" stroke-width="1"/><path d="M23 56l.6 3M25 56.4l.2 3" stroke="#e53935" stroke-width="1.3" stroke-linecap="round"/><path d="M22.6 52Q22 58 22.6 64" stroke="#fff" stroke-width="1.6" fill="none" opacity=".5" stroke-linecap="round"/>';
  O.over='<rect x="35.6" y="55" width="6" height="4.6" rx="1" fill="#fff" stroke="'+ol+'" stroke-width="1"/><circle cx="38.6" cy="57.2" r="1.1" fill="'+a+'"/>'}
 else{ /* Vertex / Axiom */ O.sleeve='#f7f4ff';O.pants=_mx(m,'#000000',.55);O.boot='#4e342e';O.glove=null;
  O.torso='<path d="'+T+'" fill="#f7f4ff" '+o+'/><path d="M24 46.4L32 62L40 46.4L40.6 73H23.4z" fill="'+m+'" '+o+'/><path d="M32 62V73" stroke="'+ol+'" stroke-width="1.3"/><path d="M27.4 46.4L32 52L36.6 46.4" fill="#fff" stroke="'+ol+'" stroke-width="1.4" stroke-linejoin="round"/><path d="M32 52l-2.8 3 2.8 2 2.8-2z" fill="'+a+'" stroke="'+ol+'" stroke-width="1.1" stroke-linejoin="round"/><path d="M32 57l-1.8 8 1.8 2.4 1.8-2.4z" fill="'+a+'" stroke="'+ol+'" stroke-width="1.1" stroke-linejoin="round"/><path d="M36 62h4.4" stroke="'+a+'" stroke-width="1.6" stroke-linecap="round"/><path d="M22.6 52Q22 58 22.6 64" stroke="#fff" stroke-width="1.6" fill="none" opacity=".5" stroke-linecap="round"/>';
  O.over='<path d="M22 71.6H42" stroke="'+ol+'" stroke-width="3.4"/><rect x="29.4" y="70" width="5.2" height="4.4" rx="1.2" fill="'+a+'" stroke="'+ol+'" stroke-width="1.1"/>'}
 return O}
function charSVG(c,mood,full,px){
 var id='rc'+(++_rid),m=c.p[0],a=c.p[1],r=c.r,g=c.g||[],has=function(x){return g.indexOf(x)>=0},
  BR=rbrand(),Bd=RB[BR],L=_look(c),pearl=r===5,ol=_mx(m,'#000000',.78),dk=_mx(m,'#000000',.55),fa='url(#'+id+'a)',fm='url(#'+id+'m)',
  rc=r>=0?RC[r][0]:'#9aa4c4',o='stroke="'+ol+'" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"',
  skin=L.skin,sk2=_mx(skin,'#000000',.14),hc=PHAIR[L.hc],hs=_hair(L.hair,hc,ol),gr=_gear(BR,L.gear,m,a,ol,o,hc),
  U=_outfit(BR,m,a,ol,o,dk,r,id),cheer=mood==='cheer',
  defs='<defs><linearGradient id="'+id+'m" x1="0" y1="0" x2="1" y2="1">'+(pearl?'<stop offset="0" stop-color="#ffffff"/><stop offset=".5" stop-color="#e3f6ff"/><stop offset="1" stop-color="#f6d9ff"/>':'<stop offset="0" stop-color="'+_mx(m,'#ffffff',.25)+'"/><stop offset="1" stop-color="'+m+'"/>')+'</linearGradient><linearGradient id="'+id+'a" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="'+_mx(a,'#ffffff',.3)+'"/><stop offset="1" stop-color="'+a+'"/></linearGradient><radialGradient id="'+id+'g"><stop offset="0" stop-color="'+rc+'" stop-opacity=".55"/><stop offset="1" stop-color="'+rc+'" stop-opacity="0"/></radialGradient></defs>',
  B='',hx=cheer?52:51,hy=cheer?46:67;
 if(r>=2)B+='<circle cx="32" cy="52" r="46" fill="url(#'+id+'g)" class="raura"/>';
 B+='<ellipse cx="32" cy="91" rx="17" ry="3.2" fill="#000" opacity=".22"/>';
 if(has('wings')||(r===3&&!has('cape'))){var wc=pearl?'#ffffff':_mx(a,'#ffffff',.2);B+='<g class="rwing"><path d="M22 52Q2 36 2 12Q16 18 25 38z" fill="'+wc+'" '+o+'/><path d="M42 52Q62 36 62 12Q48 18 39 38z" fill="'+wc+'" '+o+'/><path d="M10 26q8 4 13 13M54 26q-8 4-13 13" stroke="'+ol+'" stroke-width="1.2" fill="none" opacity=".4"/></g>'}
 if(has('cape')||(r>=2&&r!==3)){B+='<path d="M21 48Q8 72 14 92L50 92Q56 72 43 48z" fill="'+(pearl?'#c9b6ff':_mx(a,'#000000',.45))+'" '+o+'/><path d="M24 54Q18 74 22 90" stroke="'+a+'" stroke-width="1.6" fill="none" opacity=".6"/>'}
 if(r>=4)B+='<g class="rflame"><path d="M14 90q-4-9 2-16q1 6 5 7q-2-6 2-12q2 9 6 12q1 5-2 9z" fill="#ff7a1a" opacity=".85"/><path d="M42 90q-3-8 2-14q1 5 4 6q-1-5 2-10q3 8 5 11q2 4-1 7z" fill="#ffc21a" opacity=".85"/></g>';
 /* legs + boots */
 var pc2=pearl?'#dfe7f5':U.pants,bt=pearl?'#ffffff':U.boot;
 B+='<path d="M27 70V83M37 70V83" stroke="'+ol+'" stroke-width="10.4" stroke-linecap="round"/><path d="M27 70V83M37 70V83" stroke="'+pc2+'" stroke-width="6.4" stroke-linecap="round"/><path d="M37.6 70V83" stroke="'+ol+'" stroke-width="3" opacity=".25" stroke-linecap="round"/>'
  +'<path d="M20.6 84Q20 91 27 91H29V84z" fill="'+bt+'" '+o+'/><path d="M43.4 84Q44 91 37 91H35V84z" fill="'+bt+'" '+o+'/><path d="M22 87.6h5M37 87.6h5" stroke="'+ol+'" stroke-width="1" opacity=".4"/>';
 /* torso + outfit + hands */
 B+=U.torso+U.over;
 if(r>=1||pearl){var pd=pearl?'#fff':a;B+='<path d="M13.6 52Q13.6 44.4 21 44.4Q25 45.6 25 52z" fill="'+pd+'" '+o+'/><path d="M50.4 52Q50.4 44.4 43 44.4Q39 45.6 39 52z" fill="'+pd+'" '+o+'/>';if(r>=3)B+='<circle cx="19.4" cy="49" r="2.2" fill="'+rc+'"/><circle cx="44.6" cy="49" r="2.2" fill="'+rc+'"/>'}
 var hand=U.glove||skin;
 B+='<g class="rarmL"><path d="M20 52Q13 58 12 66" stroke="'+ol+'" stroke-width="9.6" fill="none" stroke-linecap="round"/><path d="M20 52Q13 58 12 66" stroke="'+U.sleeve+'" stroke-width="5.8" fill="none" stroke-linecap="round"/><circle cx="12" cy="68" r="4.2" fill="'+hand+'" '+o+'/></g>';
 var P1=cheer?56:52,P2=cheer?50:58;
 B+='<g class="rarmR"><path d="M44 52Q'+P1+' '+P2+' '+hx+' '+(hy+1)+'" stroke="'+ol+'" stroke-width="9.6" fill="none" stroke-linecap="round"/><path d="M44 52Q'+P1+' '+P2+' '+hx+' '+(hy+1)+'" stroke="'+U.sleeve+'" stroke-width="5.8" fill="none" stroke-linecap="round"/>'+_prop(BR,L.prop,hx,hy,m,a,ol)+'<circle cx="'+hx+'" cy="'+(hy+1.5)+'" r="4.4" fill="'+hand+'" '+o+'/></g>';
 /* neck + head */
 var H='<path d="M28.4 42H35.6V49H28.4z" fill="'+sk2+'" '+o+'/>';
 H+='<ellipse cx="14.8" cy="31" rx="3.4" ry="4.6" fill="'+skin+'" '+o+'/><ellipse cx="49.2" cy="31" rx="3.4" ry="4.6" fill="'+skin+'" '+o+'/><path d="M14 31q1.6 0 2 2M50 31q-1.6 0-2 2" stroke="'+ol+'" stroke-width="1" fill="none" opacity=".4"/>';
 H+='<ellipse cx="32" cy="28.4" rx="16.6" ry="16.4" fill="'+skin+'" '+o+'/><path d="M16 33Q18 44 32 44.6Q46 44 48 33Q44 40 32 40Q20 40 16 33z" fill="'+sk2+'" opacity=".35"/><ellipse cx="22" cy="19" rx="5" ry="2.2" fill="#fff" opacity=".25" transform="rotate(-24 22 19)"/>';
 var face=_eyes(mood,30,L.iris,ol)+_mouth(mood,40.4,ol)+'<ellipse cx="19.8" cy="36.4" rx="3.2" ry="2" fill="#ff6f91" opacity=".32"/><ellipse cx="44.2" cy="36.4" rx="3.2" ry="2" fill="#ff6f91" opacity=".32"/>'+_feat(L.feat,ol,hc);
 var eyeGear=(L.gear===0&&BR==='Quanta')||(L.gear===1&&BR==='Quanta');
 var hasHat=L.gear===0&&(BR==='Stratus'||BR==='Axiom'||BR==='Vertex'||BR==='Apex'||BR==='Voltaic');
 var hairFront=(BR==='Stratus'&&L.gear===0)?'':hs[1];
 if(hasHat&&BR!=='Stratus')hairFront=hs[1].replace(/d="M15\.2 27[^"]*"/,function(x){return x});
 var fr='';
 if(has('crown')||(r>=4))fr+='<path d="M20 14l-2-10 8 5 6-8 6 8 8-5-2 10z" fill="#ffd23c" stroke="#8a5a00" stroke-width="1.6" stroke-linejoin="round" transform="translate(0 '+(hasHat?-8:-3)+')"/>';
 if(r>=3)fr+='<ellipse cx="32" cy="'+(r>=4||hasHat?-5:5)+'" rx="12" ry="3.4" fill="none" stroke="#ffe68a" stroke-width="2.8" opacity=".95" class="rhalo"/>';
 var fr2='';
 if(r>=4)fr2+='<g class="rorb"><path d="M32 -6l2.4 4.4-2.4 4.4-2.4-4.4z" fill="'+rc+'"/><path d="M60 52l2.4 4.4-2.4 4.4-2.4-4.4z" fill="'+a+'"/><path d="M4 66l2.4 4.4-2.4 4.4-2.4-4.4z" fill="'+rc+'"/></g>';
 if(pearl)fr2+='<path d="M10 20l1.2 3 3 1.2-3 1.2-1.2 3-1.2-3-3-1.2 3-1.2z" fill="#fff" class="twk"/><path d="M54 66l1 2.6 2.6 1-2.6 1-1 2.6-1-2.6-2.6-1 2.6-1z" fill="#fff" class="twk"/>';
 var inner='<g class="rbody">'+B+'<g class="rbob"><g class="rhead">'+gr[0]+hs[0]+H+face+hairFront+gr[1]+'</g>'+fr+fr2+'</g></g>';
 var cls='mas rf '+(r>=0?'rr'+r:'r0s')+(pearl?' prism':'')+' '+(mood||'');
 var lab=c.name+' ('+(r>=0?RN[r]:'Starter')+')';
 if(full){var s=px||96;return '<svg class="'+cls+'" width="'+Math.round(s*.6667)+'" height="'+s+'" viewBox="0 0 64 96" role="img" aria-label="'+lab+'">'+defs+inner+'</svg>'}
 var s2=px||40,bg=Bd.bg;
 return '<svg class="'+cls+'" width="'+s2+'" height="'+s2+'" viewBox="6 3 52 52" role="img" aria-label="'+lab+'"><defs><linearGradient id="'+id+'b" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="'+bg[0]+'"/><stop offset="1" stop-color="'+bg[1]+'"/></linearGradient></defs>'+defs+'<rect x="6" y="3" width="52" height="52" rx="14" fill="url(#'+id+'b)"/>'+(r>=0?'<rect x="6" y="3" width="52" height="52" rx="14" fill="none" stroke="'+rc+'" stroke-width="2.4"/>':'')+inner+'</svg>'}
/* ---- personality: role, two traits, a quirk and a catchphrase per character ---- */
var PERS={
Voltaic:{role:'Line electrician',q:['Hums at exactly 60 Hz when nervous.','Tests every doorknob for static.','Names every wire. This one is Gerald.','Never trusts a switch that is not labeled.','Carries a spare fuse as a good-luck charm.','Calls every shock "a free lesson".','Sorts snacks by color code.','Only drinks from a mug marked "Ω".','Waves hello with the probe hand.','Counts to three, then flips the breaker.','Keeps a tiny notebook of "great sparks".','Insists on safety goggles at lunch.'],
 s:['Measure twice, power once.','Current flows where it is invited.','Every circuit has a story.','Ground it, then ground yourself.','Parallel is just friends sharing the load.','Voltage wants to go somewhere.','Resistance is only a speed bump.','Let us follow the loop.','Turn it off, then turn it on again.','The trick is the return path.','Small wires, big ideas.','Right on the ohm.']},
Stratus:{role:'Storm chaser',q:['Licks a finger to check the wind.','Predicts rain from sore knees.','Names every cloud and waves at it.','Carries a dry spare umbrella for strangers.','Whistles when the pressure drops.','Keeps a journal of every sunset.','Refuses to say "it is just a shower".','Sleeps with the window cracked for data.','Hugs the weather balloon before launch.','Draws fronts on napkins.','Cheers for thunder, counts the seconds.','Tastes the air before a storm.'],
 s:['The sky is always telling us something.','Low pressure, high hopes.','Watch the horizon.','Every front has a plan.','Clouds are just lessons in motion.','A good forecast is a good story.','Let us chase it, safely.','The wind knows first.','Check the radar, then the sky.','Warm air rises. So do we.','Dew point never lies.','Storm warning? Storm learning.']},
Vertex:{role:'Geometer',q:['Straightens every picture frame.','Measures the pizza before slicing.','Draws a tiny proof on every napkin.','Walks only along perfect right angles.','Corrects "round" to "circular".','Folds paper airplanes by exact angles.','Keeps a protractor in a lucky pocket.','Says "therefore" at breakfast.','Sorts socks by congruence.','Names every triangle in the room.','Gets sad about obtuse angles. Briefly.','Bows, but only at 45 degrees.'],
 s:['Given this, then that. Therefore, joy.','Let us prove it, line by line.','Angles do not lie.','Every shape has a secret.','Parallel lines will never meet, and that is fine.','Start with what we know.','Draw the picture first.','Congruent? Almost certainly.','A good diagram is half the proof.','Q.E.D., my friend.','Let us bisect this problem.','Right angles, right answers.']},
Apex:{role:'Summit climber',q:['Narrates every slope out loud.','Always tightens the laces twice.','Calls hills "gentle derivatives".','Packs snacks by elevation.','Waves at the horizon like it waved first.','Never says "downhill", only "limit approaching".','Plants a tiny flag on every finished chapter.','Hums when the grade gets steep.','Tests the rope three times for luck.','Carries a pocket graph for emergencies.','Calls a wrong turn "a detour in the domain".','Takes a deep breath at every asymptote.'],
 s:['One step closer to the limit.','Steep is just a number.','Rate of change? Quick.','We are climbing, not rushing.','The summit is a maximum.','Chain rule, chain of friends.','Take the integral view.','Every curve has a peak.','Slow down, check the slope.','Almost there, approaching zero.','Higher ground, better graph.','Let us build on what we have.']},
Quanta:{role:'Lab scientist',q:['Labels the lab fridge with tiny jokes.','Wears goggles to breakfast.','Greets every particle by name.','Counts electrons when waiting in line.','Says "interesting" before every surprise.','Keeps a lucky beaker on the desk.','Draws atoms on every whiteboard.','Insists spin is just a dance.','Tests a snack with a magnet first.','Narrates experiments like a nature show.','Never throws away a good graph.','Writes the units on everything.'],
 s:['Let us run the experiment.','Everything is waves, if you squint.','Conservation first, questions second.','Energy never disappears, it relocates.','Units never lie.','A good hypothesis is a brave one.','Observe, then wonder.','Measure it twice.','Small things, huge consequences.','Charge ahead, carefully.','Field of dreams, field of forces.','Let us find the pattern.']}};
var PTRAIT=['Curious','Brave','Patient','Cheerful','Careful','Bold','Dreamy','Funny','Steady','Sharp','Warm','Playful','Calm','Clever','Fearless','Gentle'];
function persona(id){var c=rowOf(id),br=rbrand(),Pn=PERS[br==='Axiom'?'Vertex':br]||PERS.Vertex,i=parseInt(String(id).replace(/\D/g,''),10)||0,L=_look(c),rk=c.r<0?'Starter':RN[c.r];
 return{role:(c.r>=3?'Elite ':c.r>=1?'Senior ':'')+Pn.role,traits:[PTRAIT[(i*5+3)%16],PTRAIT[(i*7+L.h%16+1)%16]].filter(function(x,j,a){return a.indexOf(x)===j}),quirk:Pn.q[i%12],say:Pn.s[(i*5+3)%12],rarity:rk}}
function personaHTML(id){var p=persona(id);return '<div class="pers"><b>'+esc(p.role)+'</b><span>'+p.traits.join(' · ')+'</span><em>'+esc(p.quirk)+'</em><q>'+esc(p.say)+'</q></div>'}
window.persona=persona;
