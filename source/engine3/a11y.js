/* ===== accessibility (WCAG 2.2 AA) + voiced assistant ===== */
(function(){
var main=$('main'),nav=$('nav'),shell=$('shell'),V={step:'',fb:'',tab:null};
function mk(t,c,h){var e=document.createElement(t);if(c)e.className=c;if(h!==undefined)e.innerHTML=h;return e}
/* ---- skeleton: skip link, landmarks, live region ---- */
main.setAttribute('role','main');main.tabIndex=-1;nav.setAttribute('aria-label','Sections');
var skip=mk('a','skip','Skip to main content');skip.href='#main';skip.addEventListener('click',function(e){e.preventDefault();main.focus()});document.body.insertBefore(skip,document.body.firstChild);
var live=mk('div','sr');live.id='live';live.setAttribute('role','status');live.setAttribute('aria-live','polite');live.setAttribute('aria-atomic','true');document.body.appendChild(live);
var lt=0;function say(t){t=String(t||'').replace(/\s+/g,' ').trim();if(!t)return;clearTimeout(lt);live.textContent='';lt=setTimeout(function(){live.textContent=t},80)}
window.announce=say;
try{if(A11.rm===undefined&&window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches){A11.rm=true;applyUI()}}catch(e){}
/* ---- inert background while a lesson is open ---- */
function syncInert(){var on=document.body.classList.contains('insess');try{shell.inert=on}catch(e){}if(on)shell.setAttribute('aria-hidden','true');else shell.removeAttribute('aria-hidden')}
new MutationObserver(syncInert).observe(document.body,{attributes:true,attributeFilter:['class']});syncInert();
/* ---- text alternatives for every svg that has none ---- */
function svgText(s){var t=[];[].forEach.call(s.querySelectorAll('text'),function(x){var v=x.textContent.trim();if(v)t.push(v)});return t.join(', ')}
function fixInputs(root){[].forEach.call((root||document).querySelectorAll('input:not([type=hidden]):not([type=checkbox]):not([type=file]),textarea,select'),function(i){if(i.getAttribute('aria-label')||i.getAttribute('aria-labelledby')||(i.labels&&i.labels.length))return;var rg=i.closest&&i.closest('.rng');if(rg){var sp=rg.querySelector('span');if(sp){i.setAttribute('aria-label',sp.textContent.trim());return}}var t=i.getAttribute('placeholder')||i.getAttribute('title')||i.name||'';if(t)i.setAttribute('aria-label',t)})}
function fixSvg(root){fixInputs(root);[].forEach.call((root||document).querySelectorAll('svg'),function(s){if(s.hasAttribute('aria-label')||s.hasAttribute('aria-labelledby')||s.getAttribute('aria-hidden')==='true')return;
 if(s.closest('button,.iconbtn,.chip,.lvring')&&!svgText(s)){s.setAttribute('aria-hidden','true');s.setAttribute('focusable','false');return}
 var t=svgText(s);if(t&&s.getBoundingClientRect().width>60){s.setAttribute('role','img');s.setAttribute('aria-label','Diagram: '+t)}else{s.setAttribute('aria-hidden','true');s.setAttribute('focusable','false')}})}
var ft=0;new MutationObserver(function(){if(ft)return;ft=requestAnimationFrame(function(){ft=0;fixSvg()})}).observe(document.body,{childList:true,subtree:true});
/* ---- headings, focus and announcements on navigation ---- */
var TT={learn:'Learn',practice:'Practice',library:'Library',me:'Me'};
var _rt=route;route=function(){_rt.apply(this,arguments);
 if(!$('sess')){var t=TT[cur]||'';var h=main.querySelector('h1.sr');if(!h){h=mk('h1','sr');main.insertBefore(h,main.firstChild)}h.textContent=t+' · '+P.meta.title;
  var ch=V.tab!==null&&V.tab!==cur;V.tab=cur;if(ch){try{main.focus({preventScroll:true})}catch(e){}say(t)}}
 var lv=$('lvr');if(lv){try{lv.setAttribute('aria-label','Level '+lvInfo().l+'. Open profile')}catch(e){}}
 [].forEach.call(document.querySelectorAll('.chip[title]'),function(c){var v=c.textContent.trim();c.setAttribute('role','img');c.setAttribute('aria-label',c.title+': '+v)})};
var _tt=toast;toast=function(m){_tt(m);say(m)};
/* ---- keep keyboard focus when the lesson view redraws ---- */
function focusId(s){var a=document.activeElement;if(!a||!s.contains(a))return null;if(a.id)return'#'+a.id;var d=a.dataset||{};for(var k in d)return'['+'data-'+k.replace(/[A-Z]/g,function(m){return'-'+m.toLowerCase()})+'="'+d[k]+'"]';return null}
var _ds=drawSess;drawSess=function(){var s0=$('sess'),fid=s0?focusId(s0):null,z=Z,st=z&&z.steps[z.i],key=z?z.i+':'+(st&&(st.k+(st.st||'')+(st.sh||'')))+':'+(z.fin?'f':''):'';
 var r=_ds.apply(this,arguments),s=$('sess');if(!s)return r;
 s.setAttribute('role','dialog');s.setAttribute('aria-modal','true');s.setAttribute('aria-label',(z&&z.title)||'Practice');
 enhance(s,st);syncInert();fixSvg(s);
 var fb=s.querySelector('.sheet.ok,.sheet.bad'),stepNew=key!==V.step;
 if(stepNew){V.step=key;V.fb='';var f=s.querySelector('.qtext,.lesson-card h2,.explain h2,.score,.s-body h2,.s-body h3');if(f){f.tabIndex=-1;try{f.focus({preventScroll:true})}catch(e){}}
  if(A11.va&&!fb)speak(bodyText(s))}
 else if(fid){var n=null;try{n=s.querySelector(fid)}catch(e){}if(!n&&/^#(chk|nx|go)$/.test(fid||''))n=null;if(!n)n=s.querySelector('.bl.cur')||null;if(n&&n!==document.activeElement){try{n.focus({preventScroll:true})}catch(e){}}}
 if(fb){var k=key+'|fb';if(V.fb!==k){V.fb=k;var ft=fb.innerText;say(ft);if(A11.va)speak(ft);var nb=$('nx');if(nb&&!(document.activeElement&&document.activeElement.id==='sv')){try{nb.focus({preventScroll:true})}catch(e){}}}}else V.fb='';
 return r};
var _cs=closeSess;closeSess=function(){stop();V.step='';var r=_cs.apply(this,arguments);syncInert();return r};
/* ---- keyboard / typed alternatives for the interactive types ---- */
function enhance(s,st){var it=st&&st.it;
 if(it&&it.q&&!it.done){var q=it.q,host=s.querySelector('.itx');
  if(q.type==='angle'){var sv=$('angsv');if(sv){sv.setAttribute('tabindex','0');sv.setAttribute('role','slider');sv.setAttribute('aria-label','Angle in degrees. Use the arrow keys.');sv.setAttribute('aria-valuemin','0');sv.setAttribute('aria-valuemax','180');sv.setAttribute('aria-valuenow',it.val===null?'30':String(it.val));sv.setAttribute('aria-valuetext',(it.val===null?30:it.val)+' degrees');sv.removeAttribute('aria-hidden')}
   if(host&&!host.querySelector('.alt'))host.insertAdjacentHTML('beforeend','<label class="alt"><span>Or type the angle</span><input id="angin" type="number" inputmode="numeric" min="0" max="180" step="1" value="'+(it.val===null?'':it.val)+'"><em>°</em></label>')}
  if(q.type==='point'&&host&&!host.querySelector('.alt')){var g=host.querySelector('.gridtap');if(g){g.setAttribute('role','img');g.setAttribute('aria-label','Coordinate grid. Tap to place a point, or type the coordinates below.')}
   host.insertAdjacentHTML('beforeend','<details class="alt"><summary>Type the coordinates instead</summary><div class="altrow"><label>x <input id="ptx" type="number" inputmode="numeric" step="1" min="-'+(q.pt.rng||6)+'" max="'+(q.pt.rng||6)+'"></label><label>y <input id="pty" type="number" inputmode="numeric" step="1" min="-'+(q.pt.rng||6)+'" max="'+(q.pt.rng||6)+'"></label><button class="btn sm" id="ptset" type="button">Place point</button></div></details>')}}
 var top=s.querySelector('.s-top');if(top&&VX.ok&&!top.querySelector('.speak'))top.appendChild(mk('button','iconbtn speak','<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16.5 8.5a5 5 0 010 7M19 6a8.5 8.5 0 010 12"/></svg>')).setAttribute('aria-label','Read aloud')}
function angSet(v){var it=Z&&Z.steps[Z.i]&&Z.steps[Z.i].it;if(!it||it.done||it.q.type!=='angle')return;v=Math.max(0,Math.min(180,Math.round(v)));it.val=v;var sv=$('angsv');if(sv){sv.innerHTML=angG(it.q,v,null);sv.setAttribute('aria-valuenow',v);sv.setAttribute('aria-valuetext',v+' degrees')}var av=$('angv');if(av)av.textContent=v+'°';var ai=$('angin');if(ai&&document.activeElement!==ai)ai.value=v;itEnable()}
document.addEventListener('keydown',function(e){var t=e.target;if(!t||t.id!=='angsv')return;var it=Z&&Z.steps[Z.i]&&Z.steps[Z.i].it;if(!it)return;var v=it.val===null?30:it.val,d=0;
 if(e.key==='ArrowRight'||e.key==='ArrowUp')d=1;else if(e.key==='ArrowLeft'||e.key==='ArrowDown')d=-1;else if(e.key==='PageUp')d=10;else if(e.key==='PageDown')d=-10;else if(e.key==='Home'){e.preventDefault();angSet(0);return}else if(e.key==='End'){e.preventDefault();angSet(180);return}else return;
 e.preventDefault();angSet(v+d*(e.shiftKey?5:1))});
document.addEventListener('input',function(e){var t=e.target;if(t.id==='angin'&&t.value!==''&&!isNaN(+t.value))angSet(+t.value)});
document.addEventListener('pointerup',function(){var it=Z&&Z.steps[Z.i]&&Z.steps[Z.i].it,sv=$('angsv');if(it&&sv&&it.val!==null){sv.setAttribute('aria-valuenow',it.val);sv.setAttribute('aria-valuetext',it.val+' degrees');var ai=$('angin');if(ai)ai.value=it.val}});
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('#ptset');if(!b||!Z)return;var it=Z.steps[Z.i].it,R=it.q.pt.rng||6,x=Math.round(+$('ptx').value),y=Math.round(+$('pty').value);
 if($('ptx').value===''||$('pty').value===''||isNaN(x)||isNaN(y)||Math.abs(x)>R||Math.abs(y)>R){say('Type whole numbers for x and y between -'+R+' and '+R+'.');return}it.pt=[x,y];drawSess();itEnable();say('Point placed at '+x+', '+y)},true);
/* ---- voiced assistant ---- */
var VX={ok:!!(window.speechSynthesis&&window.SpeechSynthesisUtterance),voices:[]};window.VX=VX;
function loadV(){if(!VX.ok)return;try{VX.voices=speechSynthesis.getVoices().filter(function(v){return /^en/i.test(v.lang)})}catch(e){}}
loadV();if(VX.ok){try{speechSynthesis.addEventListener('voiceschanged',function(){loadV();var u=$('u-vx');if(u)fillVoices()})}catch(e){speechSynthesis.onvoiceschanged=loadV}}
function pickV(){var n=A11.vx,l=VX.voices,v=l.filter(function(x){return x.name===n})[0];if(v)return v;
 return l.filter(function(x){return /natural|premium|enhanced|samantha|aria|jenny|google us english|daniel|karen|moira/i.test(x.name)&&/^en-(US|GB|AU)/i.test(x.lang)})[0]||l.filter(function(x){return x.lang==='en-US'})[0]||l[0]||null}
var SUP={'⁰':'0','¹':'1','²':'2','³':'3','⁴':'4','⁵':'5','⁶':'6','⁷':'7','⁸':'8','⁹':'9','⁻':'-'};
function spoken(t){t=String(t||'');
 t=t.replace(/(\w)²/g,'$1 squared').replace(/(\w)³/g,'$1 cubed').replace(/([A-Za-z0-9)])([⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+)/g,function(m,a,b){return a+' to the power '+b.split('').map(function(c){return SUP[c]==='-'?'negative ':SUP[c]}).join('')+' '});
 t=t.replace(/(\d)\s?kΩ/g,'$1 kilo ohms').replace(/(\d)\s?MΩ/g,'$1 mega ohms').replace(/(\d)\s?Ω/g,'$1 ohms').replace(/Ω/g,' ohms').replace(/(\d)\s?[µμ]F/g,'$1 microfarads').replace(/(\d)\s?mA\b/g,'$1 milliamps').replace(/(\d)\s?mV\b/g,'$1 millivolts').replace(/(\d)\s?mW\b/g,'$1 milliwatts').replace(/(\d)\s?V\b/g,'$1 volts').replace(/(\d)\s?A\b/g,'$1 amps').replace(/(\d)\s?W\b/g,'$1 watts').replace(/(\d)\s?Hz\b/g,'$1 hertz').replace(/(\d)\s?hPa\b/g,'$1 hectopascals').replace(/(\d)\s?°\s?C\b/g,'$1 degrees Celsius').replace(/(\d)\s?°\s?F\b/g,'$1 degrees Fahrenheit').replace(/(\d)\s?kt\b/g,'$1 knots');
 t=t.replace(/m∠/g,'the measure of angle ').replace(/∠/g,'angle ').replace(/△/g,'triangle ').replace(/≅/g,' is congruent to ').replace(/∼/g,' is similar to ').replace(/∥/g,' is parallel to ').replace(/⊥/g,' is perpendicular to ').replace(/→/g,' to ').replace(/√/g,' square root of ').replace(/π/g,' pi ').replace(/Δ/g,' delta ').replace(/θ/g,' theta ').replace(/∴/g,' therefore ').replace(/°/g,' degrees').replace(/%/g,' percent').replace(/×|·/g,' times ').replace(/÷/g,' divided by ').replace(/≤/g,' is at most ').replace(/≥/g,' is at least ').replace(/≠/g,' is not equal to ').replace(/≈/g,' is about ').replace(/</g,' is less than ').replace(/>/g,' is greater than ').replace(/=/g,' equals ').replace(/\+/g,' plus ').replace(/[−–]/g,' minus ').replace(/(^|[\s(])-(?=\d)/g,'$1negative ').replace(/(\d)\/(\d)/g,'$1 over $2').replace(/\s\/\s/g,' per ').replace(/[_*#`]/g,' ').replace(/\s+/g,' ');return t.trim()}
function bodyText(root){var c=(root.querySelector('.s-body')||root).cloneNode(true);[].forEach.call(c.querySelectorAll('.speak,.alt,script,style,svg,.sr,.tag,.chips.bank'),function(n){n.remove()});
 [].forEach.call(c.querySelectorAll('.bl'),function(b){if(!b.textContent.trim())b.textContent='blank'});
 [].forEach.call(c.querySelectorAll('.opt'),function(o){var b=o.querySelector('b');if(b)b.textContent='Option '+b.textContent+'. '});
 var out=[];(function w(n){if(n.nodeType===3){out.push(n.textContent)}else if(n.nodeType===1){var blk=/^(P|DIV|H1|H2|H3|H4|LI|BUTTON|TR|SUMMARY|LABEL)$/.test(n.tagName);if(blk)out.push('. ');for(var i=0;i<n.childNodes.length;i++)w(n.childNodes[i]);if(blk)out.push('. ')}})(c);return out.join('').replace(/\.\s*(\.\s*)+/g,'. ')}
var spkOn=false;
function stop(){if(!VX.ok)return;try{speechSynthesis.cancel()}catch(e){}spkOn=false;var b=document.querySelector('.speak');if(b){b.setAttribute('aria-label','Read aloud');b.classList.remove('on')}}
function speak(raw){if(!VX.ok)return;var t=spoken(raw);if(!t)return;try{speechSynthesis.cancel()}catch(e){}
 var parts=t.match(/[^.!?;:]+[.!?;:]?\s*/g)||[t],chunks=[],cur='';parts.forEach(function(p){if((cur+p).length>170&&cur){chunks.push(cur);cur=p}else cur+=p});if(cur)chunks.push(cur);
 var v=pickV(),r=Math.max(.6,Math.min(1.5,+A11.vr||1));spkOn=true;var bt=document.querySelector('.speak');if(bt){bt.setAttribute('aria-label','Stop reading');bt.classList.add('on')}
 chunks.forEach(function(c,i){var u=new SpeechSynthesisUtterance(c);if(v){u.voice=v;u.lang=v.lang}else u.lang='en-US';u.rate=r;u.pitch=1;if(i===chunks.length-1)u.onend=function(){spkOn=false;var b=document.querySelector('.speak');if(b){b.setAttribute('aria-label','Read aloud');b.classList.remove('on')}};try{speechSynthesis.speak(u)}catch(e){}});
 try{if(speechSynthesis.paused)speechSynthesis.resume()}catch(e){}}
window.speakText=speak;
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('.speak,[data-speak]');if(!b)return;e.preventDefault();if(spkOn&&b.classList.contains('speak')){stop();return}
 if(b.dataset&&b.dataset.speak){speak(b.dataset.speak);return}var s=$('sess');if(s){var fb=s.querySelector('.sheet.ok,.sheet.bad');speak(bodyText(s)+(fb?'. '+fb.innerText:''))}});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&spkOn)stop()});
/* speak button for the mascot greeting on the Learn tab */
var _vl=viewLearn;viewLearn=function(){var h=_vl.apply(this,arguments);return h};
function fillVoices(){var u=$('u-vx');if(!u)return;u.innerHTML='<option value="">Automatic</option>'+VX.voices.map(function(v){return'<option value="'+esc(v.name)+'">'+esc(v.name)+' ('+esc(v.lang)+')</option>'}).join('');u.value=A11.vx||''}
function voiceCard(){if(!VX.ok)return'<div class="card set"><h3>Voice</h3><p class="small mute">Your browser does not offer read-aloud voices.</p></div>';
 return'<div class="card set"><h3>Voice assistant</h3><p class="small mute">The speaker button in a lesson reads the question, hints and explanations aloud. Nothing is sent to us.</p><label>Voice <select id="u-vx"></select></label><label>Speed <input type="range" id="u-vr" min="0.6" max="1.5" step="0.1" value="1" aria-label="Speaking speed"></label><label><input type="checkbox" id="u-va"> Read each question aloud automatically</label><div class="row"><button class="btn sec sm" id="u-vt" type="button">Test voice</button></div></div>'}
function aboutCard(){return'<div class="card set"><h3>About</h3><ul class="links"><li><a href="/">Home page</a></li><li><a href="/privacy/">Privacy policy</a></li><li><a href="/terms/">Terms of service</a></li><li><a href="/accessibility/">Accessibility</a></li><li><a href="/ai-disclosure/">AI disclosure</a></li><li><a href="/resources/">Learning resources</a></li></ul></div>'}
var _vm=viewMe;viewMe=function(){var h=_vm.apply(this,arguments);return sub.me==='settings'?h+voiceCard()+aboutCard():h};
var _am=afterMe;afterMe=function(){_am.apply(this,arguments);if(sub.me==='settings'&&$('u-va')){fillVoices();$('u-vr').value=A11.vr||1;$('u-va').checked=!!A11.va}};
document.addEventListener('change',function(e){var t=e.target;if(t.id==='u-vx'){A11.vx=t.value;saveUI()}else if(t.id==='u-va'){A11.va=t.checked;saveUI();if(t.checked)speak('Reading aloud is on.')}else if(t.id==='u-vr'){A11.vr=+t.value;saveUI()}});
document.addEventListener('click',function(e){if(e.target&&e.target.id==='u-vt')speak('Hi, I am '+avOf(S.cos.on.av)[1]+'. I can read questions and explanations to you. Two plus two equals four.')});
document.addEventListener('input',function(e){var t=e.target,rg=t.closest&&t.closest('.rng');if(!rg)return;setTimeout(function(){var v=rg.querySelector('b');if(v)t.setAttribute('aria-valuetext',v.textContent.trim())},30)});
fixSvg();
})();
