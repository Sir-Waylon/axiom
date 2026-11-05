/* ===== math games (Beast-Academy style puzzles): balance the scale, program a mystery machine, catch the robot's mistake.
   Seeded, 10 problems per game, every one verified solvable at load. ===== */
(function(){
function mul(a){return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function hs(s){var h=2166136261;s=String(s);for(var i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function pk(r,a){return a[Math.floor(r()*a.length)]}
function ri(r,a,b){return a+Math.floor(r()*(b-a+1))}
function sg(x){return String(x).replace(/-/g,'−')}
function rd(v,d){return +v.toFixed(d===undefined?2:d)}
var SUP={0:'⁰',1:'¹',2:'²',3:'³',4:'⁴',5:'⁵',6:'⁶',7:'⁷',8:'⁸',9:'⁹','-':'⁻'};function sup(n){return String(n).split('').map(function(c){return SUP[c]||c}).join('')}
function cur(type){var it=Z&&!Z.fin&&Z.steps&&Z.steps[Z.i]&&Z.steps[Z.i].it;return it&&it.q.type===type&&!it.done?it:null}
function refresh(){if(window.itEnable)itEnable()}
var GP={};function add(pack,tp){(GP[pack]=GP[pack]||[]).push(tp)}

/* ---------- 1. Balance scale: do the same thing to both sides until one bag stands alone ---------- */
var BT=[['gems','bag of gems','gem'],['oranges','crate of oranges','orange'],['coins','purse of coins','coin']];
function bstep(e,op){var o={a:e.a,b:e.b,c:e.c,d:e.d};if(op.k==='tb'){if(e.b<op.n||e.d<op.n)return null;o.b-=op.n;o.d-=op.n}else if(op.k==='tx'){if(e.a<op.n||e.c<op.n)return null;o.a-=op.n;o.c-=op.n}else{var k=op.n;if(e.a%k||e.b%k||e.c%k||e.d%k)return null;o.a/=k;o.b/=k;o.c/=k;o.d/=k}return o}
function bwin(e,x){return e.a===1&&e.b===0&&e.c===0&&e.d===x}
function bpan(n,bags,blk,sym){var h='<div class="pan">';for(var i=0;i<bags;i++)h+='<span class="bag" aria-hidden="true">'+sym+'</span>';if(blk<=14)for(i=0;i<blk;i++)h+='<span class="blk" aria-hidden="true"></span>';else h+='<span class="blk n" aria-hidden="true">'+blk+'</span>';return h+'<span class="sr-only">'+bags+' bags and '+blk+' single items</span></div>'}
IT.balance={init:function(it){it.e=Object.assign({},it.q.bal.s);it.mv=[];it.n=1;it.k=2},
 render:function(it,rev){var q=it.q.bal,e=it.e,t=BT[q.th],h='<div class="itx bld"><div class="scale" role="img" aria-label="Scale: '+e.a+' bags and '+e.b+' items on the left, '+e.c+' bags and '+e.d+' items on the right"><div class="beam"><div class="side">'+bpan(0,e.a,e.b,'x')+'</div><div class="eqs" aria-hidden="true">=</div><div class="side">'+bpan(0,e.c,e.d,'x')+'</div></div></div>';
  h+='<div class="small" aria-live="polite"><b>'+(e.a>1?e.a:'')+'x'+(e.b?' + '+e.b:'')+' = '+(e.c?(e.c>1?e.c:'')+'x'+(e.d?' + '+e.d:''):e.d)+'</b></div><div class="small mute">Moves used '+it.mv.length+' of '+q.max+'</div>';
  if(!rev){h+='<div class="bseg" role="group" aria-label="Amount"><span>Amount</span><button type="button" class="btn sec sm" data-bm="n-" aria-label="Less">−</button><b class="bnum">'+it.n+'</b><button type="button" class="btn sec sm" data-bm="n+" aria-label="More">+</button></div><div class="xbtns"><button type="button" class="btn sec sm" data-bo="tb">Take '+it.n+' single'+(it.n>1?'s':'')+' off both sides</button><button type="button" class="btn sec sm" data-bo="tx">Take '+it.n+' bag'+(it.n>1?'s':'')+' off both sides</button></div><div class="bseg" role="group" aria-label="Split into equal groups"><span>Split both sides into equal groups</span>'+[2,3,4,5,6,7,8,9].map(function(k){return '<button type="button" class="ch" data-bs="'+k+'">'+k+'</button>'}).join('')+'</div><div class="row"><button type="button" class="btn sec sm" data-bu="1"'+(it.mv.length?'':' disabled')+'>Undo</button><button type="button" class="btn sec sm" data-br="1"'+(it.mv.length?'':' disabled')+'>Reset</button></div><div class="small mute" id="bmsg" aria-live="polite">Keep the scale balanced: whatever you do to one side, you do to the other.</div>'}
  else h+='<div class="simo">'+(it.ok?'One '+t[1]+' holds <b>'+q.x+'</b>.':'Each '+t[1]+' holds <b>'+q.x+'</b> '+t[0]+'.')+'</div>';
  return h+'</div>'},
 ok:function(it){return bwin(it.e,it.q.bal.x)},done:function(it){return it.mv.length>0},ans:function(q){return String(q.bal.x)}};
document.addEventListener('click',function(e){var it=cur('balance');if(!it)return;var t=e.target,b=t.closest&&t.closest('[data-bm],[data-bo],[data-bs],[data-bu],[data-br]');if(!b)return;var msg;
 if(b.dataset.bm){it.n=Math.max(1,Math.min(15,it.n+(b.dataset.bm==='n+'?1:-1)));drawSess();return}
 if(b.dataset.bu){it.mv.pop();var s=Object.assign({},it.q.bal.s);it.mv.forEach(function(o){s=bstep(s,o)});it.e=s;drawSess();refresh();return}
 if(b.dataset.br){it.e=Object.assign({},it.q.bal.s);it.mv=[];drawSess();refresh();return}
 var op=b.dataset.bo?{k:b.dataset.bo,n:it.n}:{k:'sp',n:+b.dataset.bs};var ne=bstep(it.e,op);
 if(!ne||it.mv.length>=it.q.bal.max){msg=!ne?(op.k==='sp'?'That does not split evenly. Try taking things off first.':'You cannot take off more than is on a side.'):'You are out of moves. Undo or reset.';var m=document.getElementById('bmsg');if(m)m.textContent=msg;window.sfx&&sfx('hint');return}
 it.e=ne;it.mv.push(op);window.sfx&&sfx('pop');drawSess();refresh()});
function genBal(r){for(var k=0;k<60;k++){var x=ri(r,2,12),a=ri(r,2,6),c=ri(r,0,a-1),b=ri(r,1,9),d=(a-c)*x+b;if(d>40)continue;var th=ri(r,0,2),t=BT[th],sol=[];if(c)sol.push({k:'tx',n:c});sol.push({k:'tb',n:b});if(a-c>1)sol.push({k:'sp',n:a-c});
  return{q:'Each '+t[1]+' on the scale holds the same number of '+t[0]+'. The scale is perfectly balanced. How many '+t[0]+' are in one '+t[1].split(' ')[0]+'? Use the buttons to do the same thing to both sides until one bag stands alone.',bal:{s:{a:a,b:b,c:c,d:d},x:x,th:th,max:sol.length+3,sol:sol},
   steps:['Keep both sides equal: remove the same amount from each side.',(c?'Take '+c+' bag'+(c>1?'s':'')+' off both sides. ':'')+'Take '+b+' single'+(b>1?'s':'')+' off both sides.',(a-c>1?'Split into '+(a-c)+' equal groups. ':'')+'One bag = '+x+'.']}}
 return null}
add('geometry-readiness',{id:'bal',t:'eq',l:2,ic:'⚖️',type:'balance',cp:0,gen:genBal});

/* ---------- 2. Mystery machine: program it to match ---------- */
var MK={lin:function(m,c,x){return m*x+c},sq:function(m,c,x){return m*x*x+c},abs:function(m,c,x){return m*Math.abs(x)+c}};
var MD={lin:'multiplies the number by m, then adds c',sq:'squares the number, multiplies by m, then adds c',abs:'takes the distance from zero, multiplies by m, then adds c'};
var MV=[-2,1,3,4],MH=[0,-4,6];
IT.machine={init:function(it){it.m=1;it.c=0;it.t=false},
 render:function(it,rev){var q=it.q.mach,f=MK[q.kind],h='<div class="itx bld"><div class="mach" aria-hidden="true"><span>IN</span><b>⚙️</b><span>OUT</span></div><div class="small">This machine '+MD[q.kind]+'. Turn the dials to program yours. The tickets show what the mystery machine did.</div><table class="lgt" aria-label="Machine tickets"><tr><th>In</th><th>Mystery</th><th>Yours</th></tr>';
  MV.forEach(function(x){var mine=f(it.m,it.c,x),want=f(q.m,q.c,x);h+='<tr><td>'+sg(x)+'</td><td><b>'+sg(want)+'</b></td><td class="'+(mine===want?'okc':'badc')+'">'+sg(mine)+(mine===want?' ✓':'')+'</td></tr>'});
  MH.forEach(function(x){var mine=f(it.m,it.c,x),want=f(q.m,q.c,x);h+='<tr class="hid"><td>'+sg(x)+'</td><td>'+(rev?'<b>'+sg(want)+'</b>':'?')+'</td><td class="'+(rev?(mine===want?'okc':'badc'):'')+'">'+sg(mine)+(rev?(mine===want?' ✓':''):'')+'</td></tr>'});
  h+='</table>';[['m','Multiply by m',-6,6],['c','Then add c',-12,12]].forEach(function(s){h+='<label class="lsl"><span>'+s[1]+': <b id="mc_'+s[0]+'">'+sg(it['m'===s[0]?'m':'c'])+'</b></span><input type="range" class="mcr" data-mc="'+s[0]+'" min="'+s[2]+'" max="'+s[3]+'" step="1" value="'+it[s[0]]+'" aria-label="'+s[1]+'"'+(rev?' disabled':'')+'></label>'});
  h+=rev?'<div class="simo">'+(it.ok?'Your machine matches, even on the hidden tickets.':'The mystery machine uses m = '+sg(q.m)+' and c = '+sg(q.c)+'.')+'</div>':'<div class="small mute">The last three rows are hidden tickets. Your machine must match them too.</div>';
  return h+'</div>'},
 ok:function(it){var q=it.q.mach,f=MK[q.kind];return MV.concat(MH).every(function(x){return f(it.m,it.c,x)===f(q.m,q.c,x)})},done:function(it){return it.t},ans:function(q){return 'm = '+sg(q.mach.m)+', c = '+sg(q.mach.c)}};
function mrefresh(it){var q=it.q.mach,f=MK[q.kind],rows=document.querySelectorAll('.mach~table tr');MV.concat(MH).forEach(function(x,i){var tr=rows[i+1];if(!tr)return;var mine=f(it.m,it.c,x),want=f(q.m,q.c,x),tds=tr.children,vis=i<MV.length;tds[2].textContent=sg(mine)+(vis&&mine===want?' ✓':'');tds[2].className=vis?(mine===want?'okc':'badc'):''})}
document.addEventListener('input',function(e){var n=e.target.dataset&&e.target.dataset.mc;if(!n||!e.target.classList.contains('mcr'))return;var it=cur('machine');if(!it)return;it[n]=+e.target.value;it.t=true;var b=document.getElementById('mc_'+n);if(b)b.textContent=sg(it[n]);mrefresh(it);window.sfx&&sfx('tick');refresh()});
function genMach(kinds){return function(r){var kind=pk(r,kinds),m=pk(r,[-5,-4,-3,-2,-1,1,2,3,4,5]),c=ri(r,-9,9),th=pk(r,['Zorp-O-Matic','Number Muncher','Gizmo 3000','Beep-Boop Box']);return{q:'The '+th+' machine eats numbers and spits out new ones, always by the same rule. Study its tickets, then program your own machine to behave exactly the same way.',mach:{kind:kind,m:m,c:c},steps:['Use two tickets to find the rule: the change in OUT for each step in IN shows m.','Then c is what is left over: c = OUT − m × (the processed IN).','Mystery machine: m = '+sg(m)+', c = '+sg(c)+'.']}}}
add('geometry-readiness',{id:'mach',t:'lin',l:2,ic:'⚙️',type:'machine',cp:0,gen:genMach(['lin'])});
add('apex-math',{id:'mach',t:'fn',l:3,ic:'⚙️',type:'machine',cp:0,gen:genMach(['sq','abs'])});

/* ---------- 3. Catch the mistake: a robot solved it and slipped exactly once ---------- */
function mm(a){return sg(a)}
function famLinear(r){var a=ri(r,2,9),x0=ri(r,2,12),b=ri(r,2,15),c=a*x0+b,pos=ri(r,0,3),L=[a+'x + '+b+' = '+c],v1=c-b,d,fix;
 var s1=a+'x = '+c+(pos===0?' + ':' − ')+b,v=pos===0?c+b:c-b;L.push(s1);
 var s2v=v;if(pos===1){d=pk(r,[-2,-1,1,2]);s2v=v+d}L.push(a+'x = '+s2v);
 var s3=pos===2?'x = '+s2v+' × '+a:'x = '+s2v+' ÷ '+a,val=pos===2?s2v*a:s2v/a;L.push(s3);
 var fin=pos===3?x0+pk(r,[-1,1,2]):rd(val,2);L.push('x = '+(typeof fin==='number'?String(fin):fin));
 var ok=[a+'x = '+c+' − '+b,a+'x = '+v1,'x = '+v1+' ÷ '+a,'x = '+x0];
 return{lines:L,bad:pos+1,fix:ok[pos],why:['Subtract '+b+' from both sides, not add.','Check the arithmetic: '+c+' − '+b+' = '+v1+'.','To undo multiplying by '+a+', divide by '+a+'.','Finish the division carefully: '+v1+' ÷ '+a+' = '+x0+'.'][pos]}}
function famDist(r){var k=ri(r,2,5),p=ri(r,1,4),q=ri(r,2,8),x0=ri(r,2,9),R=k*(p*x0+q),pos=ri(r,0,3),kp=k*p,kq=k*q,L=[k+'('+(p>1?p:'')+'x + '+q+') = '+R];
 L.push(pos===0?kp+'x + '+q+' = '+R:kp+'x + '+kq+' = '+R);
 var sub=pos===0?q:kq,r2=R-sub;L.push(kp+'x = '+R+(pos===1?' + ':' − ')+sub);var rr=pos===1?R+sub:R-sub;
 if(pos===2)rr=rr+pk(r,[-2,-1,1,2]);L.push(kp+'x = '+rr);
 var den=pos===3?p:kp,fin=rd(rr/den,2);L.push('x = '+rr+' ÷ '+den+' = '+fin);
 var ok=[kp+'x + '+kq+' = '+R,kp+'x = '+R+' − '+kq,kp+'x = '+(R-kq),'x = '+(R-kq)+' ÷ '+kp+' = '+x0];
 return{lines:L,bad:pos+1,fix:ok[pos],why:['Distribute '+k+' to both terms inside the parentheses, including '+q+'.','Subtract '+kq+' from both sides.','Check the arithmetic: '+R+' − '+kq+' = '+(R-kq)+'.','Divide by the whole coefficient '+kp+', not just part of it.'][pos]}}
function famExp(r){var a=ri(r,2,4),b=ri(r,2,4),c=ri(r,2,6),pos=ri(r,0,2),L=['(x'+sup(a)+')'+sup(b)+' · x'+sup(c)];
 var e1=pos===0?a+b:a*b;L.push('x'+sup(e1)+' · x'+sup(c));var e2=pos===1?e1*c:e1+c;L.push('x'+sup(e2));var fin=pos===2?e2+pk(r,[-1,1]):e2;L.push('= x'+sup(fin));
 var ok=['x'+sup(a*b)+' · x'+sup(c),'x'+sup(a*b+c),'= x'+sup(a*b+c)];
 return{lines:L,bad:pos+1,fix:ok[pos],why:['A power of a power multiplies the exponents: '+a+' × '+b+' = '+a*b+'.','Multiplying like bases adds the exponents: '+a*b+' + '+c+' = '+(a*b+c)+'.','Write the exponent you just found, '+(a*b+c)+'.'][pos]}}
function famSq(r){var h=ri(r,1,6)*pk(r,[-1,1]),k=ri(r,2,7),pos=ri(r,0,2),hs_=h<0?' + '+(-h):' − '+h,L=['(x'+hs_+')² = '+k*k];
 L.push('x'+hs_+' = '+(pos===0?'':'±')+k);var s2=pos===1?(-h)+' ± '+k:h+' ± '+k;L.push('x = '+s2.replace(/-/g,'−'));
 var a1=pos===2?h+k+1:h+k,a2=h-k;L.push('x = '+sg(a1)+' or x = '+sg(a2));
 var ok=['x'+hs_+' = ±'+k,'x = '+sg(h)+' ± '+k,'x = '+sg(h+k)+' or x = '+sg(h-k)];
 return{lines:L,bad:pos+1,fix:ok[pos],why:['Taking a square root gives two answers: plus and minus.','Move the shift to the other side: add '+sg(h)+(h<0?' (so subtract '+(-h)+')':'')+'.','Compute both: '+sg(h)+' + '+k+' and '+sg(h)+' − '+k+'.'][pos]}}
function famLog(r){var b=pk(r,[2,3,5]),t=ri(r,2,4),N=Math.pow(b,t),pos=ri(r,0,2),L=[b+sup('x')+' = '+N];var lb='log '+b,lN='log '+N;
 L.push(pos===0?'x + '+lb+' = '+lN:'x · '+lb+' = '+lN);L.push(pos===0?'x = '+lN+' − '+lb:pos===1?'x = '+lN+' − '+lb:'x = '+lN+' ÷ '+lb);
 var v=pos===2?t+1:(pos===1?rd(Math.log10(N)-Math.log10(b),3):t);if(pos===0)v=rd(Math.log10(N)-Math.log10(b),3);L.push('x = '+v);
 var ok=['x · '+lb+' = '+lN,'x = '+lN+' ÷ '+lb,'x = '+t];
 return{lines:L,bad:pos+1,fix:ok[pos],why:['Bring the exponent down: log(b^x) = x · log b, a product, not a sum.','To undo multiplying by '+lb+', divide both sides by it.','Compute the final division: log '+N+' ÷ log '+b+' = '+t+'.'][pos]}}
function famDv(r){var a=ri(r,2,5),n=ri(r,3,5),b=ri(r,2,6),m=2,c=ri(r,2,9),pos=ri(r,0,2),L=['f(x) = '+a+'x'+sup(n)+' − '+b+'x'+sup(m)+' + '+c];
 var t1=a*n+'x'+sup(n-1),t1w=pos===0?a*n+'x'+sup(n):t1;L.push('Differentiate '+a+'x'+sup(n)+': '+t1w);
 var t2=b*m+'x',t2w=pos===1?b+'x':t2;L.push('Differentiate −'+b+'x'+sup(m)+': −'+t2w);
 var t3=pos===2?String(c):'0';L.push('Differentiate '+c+': '+t3);
 var fin='f′(x) = '+t1w+' − '+t2w+(pos===2?' + '+c:'');L.push(fin);
 var ok=[a*n+'x'+sup(n-1),'−'+b*m+'x','0'];
 return{lines:L,bad:pos+1,fix:ok[pos],why:['Power rule: bring the exponent down and lower it by one: '+a+'x'+sup(n)+' → '+a*n+'x'+sup(n-1)+'.','Power rule on x²: multiply by 2 and drop the exponent to 1.','The derivative of a constant is 0.'][pos]}}
var MS={lin:[famLinear,famDist],exp:[famExp],qdr:[famSq],lg:[famLog],dv:[famDv]};
function genMist(key){return function(r){var f=pk(r,MS[key]),g=f(r),who=pk(r,['Robo-Rita','Captain Calc','Professor Parrot','Detective Byte']);return{q:who+' solved this problem, but slipped exactly once. Tap the first line where the mistake happens.',ms:{lines:g.lines,bad:g.bad,fix:g.fix,why:g.why},steps:['Check each line against the one before it.','The first mistake is line '+(g.bad+1)+'.','Correct line: '+g.fix+'. '+g.why]}}}
IT.mistake={init:function(it){it.p=null},
 render:function(it,rev){var q=it.q.ms,h='<div class="itx bld"><ol class="mlines" aria-label="Worked solution">';
  q.lines.forEach(function(l,i){var cls='ml'+(it.p===i?' sel':'')+(rev&&i===q.bad?' bad':'');h+='<li><button type="button" class="'+cls+'" data-mst="'+i+'"'+(rev||i===0?' disabled':'')+' aria-pressed="'+(it.p===i)+'"><span class="mn">'+(i+1)+'</span><span>'+sg(l)+'</span></button></li>'});
  h+='</ol>';h+=rev?'<div class="simo">'+(it.ok?'Caught it. ':'The slip is in line '+(q.bad+1)+'. ')+'Line '+(q.bad+1)+' should be <b>'+sg(q.fix)+'</b>. '+q.why+'</div>':'<div class="small mute">Line 1 is the problem itself, so it is never the mistake.</div>';
  return h+'</div>'},
 ok:function(it){return it.p===it.q.ms.bad},done:function(it){return it.p!==null},ans:function(q){return 'Line '+(q.ms.bad+1)}};
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-mst]');if(!b)return;var it=cur('mistake');if(!it)return;it.p=+b.dataset.ml;window.sfx&&sfx('pop');drawSess();refresh()});
add('geometry-readiness',{id:'mlin',t:'eq',l:2,ic:'🕵️',type:'mistake',cp:0,gen:genMist('lin')});
add('geometry-readiness',{id:'mexp',t:'exp',l:2,ic:'🕵️',type:'mistake',cp:0,gen:genMist('exp')});
add('geometry-readiness',{id:'msq',t:'qdr',l:3,ic:'🕵️',type:'mistake',cp:0,gen:genMist('qdr')});
add('apex-math',{id:'mlg',t:'lg',l:3,ic:'🕵️',type:'mistake',cp:1,gen:genMist('lg')});
add('apex-math',{id:'mdv',t:'dv',l:3,ic:'🕵️',type:'mistake',cp:0,gen:genMist('dv')});

var PK=(window.P&&P.meta&&P.meta.id||'').replace(/-20\d\d$/,''),TL=GP[PK]||[];
TL.forEach(function(tp){var seen={};for(var i=0;i<10;i++){var id='gm-'+tp.id+'-'+(i<9?'0':'')+(i+1);if(QI[id]!==undefined)continue;var g=null,tries=0;while(!g&&tries<12){g=tp.gen(mul(hs(PK+tp.id+i+'g'+tries)));tries++;var key=g&&JSON.stringify(g.bal||g.mach||g.ms);if(g&&seen[key])g=null}if(!g)continue;seen[JSON.stringify(g.bal||g.mach||g.ms)]=1;
 var q={id:id,t:tp.t,l:tp.l,type:tp.type,ic:tp.ic,q:g.q,sol:g.steps,w:g.steps[g.steps.length-1],fp:'gm-'+tp.id,cp:tp.cp,bld:1};for(var k in g)if(k!=='q'&&k!=='steps')q[k]=g[k];QS.push(q);QI[id]=QS.length-1}});
window.__gmSolve=function(it){var q=it.q,t=q.type;if(t==='balance'){q.bal.sol.forEach(function(o){it.e=bstep(it.e,o);it.mv.push(o)})}else if(t==='machine'){it.m=q.mach.m;it.c=q.mach.c;it.t=true}else if(t==='mistake'){it.p=q.ms.bad}};
})();
