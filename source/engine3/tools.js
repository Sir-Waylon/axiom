/* ===== native tools: calculator + scratchpad (no eval) ===== */
(function(){
var DEG=true;
function calc(src){
 var s=src.replace(/×/g,'*').replace(/÷/g,'/').replace(/−/g,'-').replace(/π/g,'pi').replace(/√/g,'sqrt').replace(/\s+/g,'').toLowerCase(),i=0;
 function peek(){return s[i]}
 function num(){var m=/^(\d+\.?\d*|\.\d+)(e[+-]?\d+)?/.exec(s.slice(i));if(!m)return null;i+=m[0].length;return parseFloat(m[0])}
 function ident(){var m=/^[a-z]+/.exec(s.slice(i));if(!m)return null;i+=m[0].length;return m[0]}
 var F={sqrt:Math.sqrt,sin:function(x){return Math.sin(DEG?x*Math.PI/180:x)},cos:function(x){return Math.cos(DEG?x*Math.PI/180:x)},tan:function(x){return Math.tan(DEG?x*Math.PI/180:x)},asin:function(x){var r=Math.asin(x);return DEG?r*180/Math.PI:r},acos:function(x){var r=Math.acos(x);return DEG?r*180/Math.PI:r},atan:function(x){var r=Math.atan(x);return DEG?r*180/Math.PI:r},ln:Math.log,log:Math.log10,abs:Math.abs};
 function prim(){var c=peek();
  if(c==='('){i++;var v=expr();if(peek()!==')')throw 0;i++;return v}
  if(c==='-'){i++;return -pow()}if(c==='+'){i++;return pow()}
  var n=num();if(n!==null)return n;
  var id=ident();if(!id)throw 0;if(id==='pi')return Math.PI;if(id==='e'&&false)return Math.E;
  if(F[id]){var a;if(peek()==='('){i++;a=expr();if(peek()!==')')throw 0;i++}else a=pow();return F[id](a)}throw 0}
 function pow(){var b=prim();if(peek()==='^'){i++;var e=pow();return Math.pow(b,e)}if(peek()==='%'){i++;return b/100}return b}
 function term(){var v=pow();for(;;){var c=peek();if(c==='*'){i++;v*=pow()}else if(c==='/'){i++;v/=pow()}else if(c==='('||(c&&/[a-z.\d]/.test(c))){v*=pow()}else return v}}
 function expr(){var v=term();for(;;){var c=peek();if(c==='+'){i++;v+=term()}else if(c==='-'){i++;v-=term()}else return v}}
 var r=expr();if(i<s.length)throw 0;if(!isFinite(r))throw 0;return r}
function fmt(r){if(Math.abs(r)>=1e9||(Math.abs(r)<1e-6&&r!==0))return r.toExponential(6).replace(/\.?0+e/,'e');return String(+r.toPrecision(10))}
window.__calc=calc;
var panel=null,hist=[];
function close(){if(panel){panel.remove();panel=null}}
function openCalc(){close();var K=['sin','cos','tan','√(','π','^','(',')','7','8','9','÷','4','5','6','×','1','2','3','−','0','.','EE','+'];
 panel=document.createElement('div');panel.className='tpanel';panel.innerHTML='<div class="thd"><b>Calculator</b><button class="tg" id="tdeg">'+(DEG?'DEG':'RAD')+'</button><button class="iconbtn tx" aria-label="Close">×</button></div><div class="tdisp"><div class="thist" id="thist"></div><input id="tin" inputmode="none" autocomplete="off" aria-label="Expression"><div class="tres" id="tres">0</div></div><div class="tkeys">'+K.map(function(k){return '<button data-k="'+k+'" class="'+(/\d|\./.test(k)?'n':/[+−×÷^]/.test(k)?'o':'f')+'">'+k+'</button>'}).join('')+'<button class="f" data-k="back">⌫</button><button class="f" data-k="clr">C</button><button class="eq" data-k="eq">=</button></div>';
 document.body.appendChild(panel);var inp=panel.querySelector('#tin');inp.focus({preventScroll:true});upd();
 function upd(){var r=panel.querySelector('#tres'),h=panel.querySelector('#thist');h.innerHTML=hist.slice(-3).map(function(x){return '<div>'+x+'</div>'}).join('');try{r.textContent=inp.value.trim()?fmt(calc(inp.value)):'0';r.classList.remove('bad')}catch(e){r.textContent=inp.value.trim()?'…':'0'}}
 function add(t){var a=inp.selectionStart||inp.value.length;inp.value=inp.value.slice(0,a)+t+inp.value.slice(inp.selectionEnd||a);inp.setSelectionRange(a+t.length,a+t.length);upd()}
 panel.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;window.sfx&&window.sfx('click');if(b.classList.contains('tx'))return close();if(b.id==='tdeg'){DEG=!DEG;b.textContent=DEG?'DEG':'RAD';upd();return}var k=b.dataset.k;if(!k)return;
  if(k==='clr'){inp.value='';upd()}else if(k==='back'){inp.value=inp.value.slice(0,-1);upd()}else if(k==='eq'){try{var r=fmt(calc(inp.value));hist.push(inp.value+' = '+r);inp.value=r;upd()}catch(x){panel.querySelector('#tres').textContent='Check the expression';panel.querySelector('#tres').classList.add('bad')}}
  else if(k==='EE')add('e');else if(['sin','cos','tan'].indexOf(k)>-1)add(k+'(');else add(k)});
 inp.addEventListener('input',upd);inp.addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();panel.querySelector('[data-k=eq]').click()}if(e.key==='Escape')close();e.stopPropagation()},true)}
/* scratchpad */
var pads={};
function openPad(){close();var key=(Z&&Z.i)||0,col='#2b2f45',w=3,er=false,hs=[];
 panel=document.createElement('div');panel.className='tpanel pad';panel.innerHTML='<div class="thd"><b>Scratchpad</b><span class="sp"></span><button class="tg" data-c="#2b2f45" style="background:#2b2f45"></button><button class="tg" data-c="#e0412f" style="background:#e0412f"></button><button class="tg" data-c="#2f6fe0" style="background:#2f6fe0"></button><button class="tg" data-c="er">Erase</button><button class="tg" data-c="un">Undo</button><button class="tg" data-c="cl">Clear</button><button class="iconbtn tx" aria-label="Close">×</button></div><canvas id="pc"></canvas>';
 document.body.appendChild(panel);var cv=panel.querySelector('#pc'),dpr=window.devicePixelRatio||1,r=cv.getBoundingClientRect();cv.width=r.width*dpr;cv.height=r.height*dpr;var g=cv.getContext('2d');g.scale(dpr,dpr);g.lineCap='round';g.lineJoin='round';
 if(pads[key]){var im=new Image();im.onload=function(){g.drawImage(im,0,0,r.width,r.height)};im.src=pads[key]}
 var down=false,lx,ly;function pos(e){var b=cv.getBoundingClientRect();return [e.clientX-b.left,e.clientY-b.top]}
 cv.addEventListener('pointerdown',function(e){down=true;cv.setPointerCapture(e.pointerId);hs.push(cv.toDataURL());if(hs.length>20)hs.shift();var p=pos(e);lx=p[0];ly=p[1];g.globalCompositeOperation=er?'destination-out':'source-over';g.strokeStyle=col;g.lineWidth=er?18:w;g.beginPath();g.moveTo(lx,ly);g.lineTo(lx+.01,ly);g.stroke()});
 cv.addEventListener('pointermove',function(e){if(!down)return;var p=pos(e);g.beginPath();g.moveTo(lx,ly);g.lineTo(p[0],p[1]);g.stroke();lx=p[0];ly=p[1]});
 function up(){if(down){down=false;pads[key]=cv.toDataURL()}}cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
 panel.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;if(b.classList.contains('tx')){pads[key]=cv.toDataURL();return close()}var c=b.dataset.c;if(!c)return;
  if(c==='cl'){g.clearRect(0,0,r.width,r.height);pads[key]=''}else if(c==='un'){var u=hs.pop();if(u){var m=new Image();m.onload=function(){g.globalCompositeOperation='source-over';g.clearRect(0,0,r.width,r.height);g.drawImage(m,0,0,r.width,r.height);pads[key]=cv.toDataURL()};m.src=u}}else if(c==='er')er=true;else{er=false;col=c}})}
function bar(){var s=document.getElementById('sess');if(!s||!Z||Z.fin){var o=document.getElementById('tbar');if(o)o.remove();close();return}if(document.getElementById('tbar'))return;
 var d=document.createElement('div');d.id='tbar';d.className='tbar';d.innerHTML='<button id="tpad" aria-label="Scratchpad"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20l4-1 11-11-3-3L5 16z"/><path d="M14 7l3 3"/></svg></button><button id="tcalc" aria-label="Calculator"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="5" y="3" width="14" height="18" rx="3"/><path d="M8 7h8M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01"/></svg></button>';
 s.appendChild(d);d.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;if(b.id==='tpad')openPad();else openCalc()})}
var _ds=drawSess;drawSess=function(){_ds.apply(this,arguments);bar()};
var _cs=closeSess;closeSess=function(){close();var o=document.getElementById('tbar');if(o)o.remove();return _cs.apply(this,arguments)};
})();
