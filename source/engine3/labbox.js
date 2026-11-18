/* ===== labbox.js: puts every free-roam lab in its own workbench box =====
   Stage (picture + live readout) on the left or top, a Controls panel on the right or below.
   It only moves existing nodes after a lab has drawn itself, so lab code and its listeners are untouched. */
(function(){
var pend=false;
/* Touch controls: every slider becomes  [ − ]  tap/drag track  [ + ].  The real range input stays (hidden, focusable) so lab code and keyboards keep working. */
function snap(inp,v){var mn=+inp.min,mx=+inp.max,st=+inp.step||1;v=Math.min(mx,Math.max(mn,v));v=mn+Math.round((v-mn)/st)*st;var dp=(String(st).split('.')[1]||'').length;return +v.toFixed(dp)}
function setV(inp,v){v=snap(inp,v);if(+inp.value===v)return;inp.value=v;inp.dispatchEvent(new Event('input',{bubbles:true}));inp.dispatchEvent(new Event('change',{bubbles:true}))}
function touchify(panel){
 [].forEach.call(panel.querySelectorAll('label.lsl'),function(lb){
  var inp=lb.querySelector('input[type=range]'),out=lb.querySelector('output');if(!inp||lb.classList.contains('lst'))return;
  lb.classList.add('lst');lb.addEventListener('click',function(e){e.preventDefault()});
  var row=document.createElement('div');row.className='lstr';
  var m=document.createElement('button');m.type='button';m.className='lstb';m.textContent='\u2212';m.setAttribute('aria-label','Decrease '+(inp.getAttribute('aria-label')||''));
  var p=document.createElement('button');p.type='button';p.className='lstb';p.textContent='+';p.setAttribute('aria-label','Increase '+(inp.getAttribute('aria-label')||''));
  var tr=document.createElement('div');tr.className='ltrk';tr.setAttribute('aria-hidden','true');var fl=document.createElement('i');var kn=document.createElement('b');tr.appendChild(fl);tr.appendChild(kn);
  row.appendChild(m);row.appendChild(tr);row.appendChild(p);lb.appendChild(row);
  function paint(){var mn=+inp.min,mx=+inp.max,f=mx>mn?(+inp.value-mn)/(mx-mn):0;fl.style.width=(f*100)+'%';kn.style.left=(f*100)+'%'}
  inp.addEventListener('input',paint);if(out)new MutationObserver(paint).observe(out,{childList:true,characterData:true,subtree:true});paint();
  function hold(btn,dir){var t=null,iv=null;function go(){setV(inp,+inp.value+dir*(+inp.step||1))}
   function stop(){clearTimeout(t);clearInterval(iv)}
   btn.addEventListener('pointerdown',function(e){e.preventDefault();go();t=setTimeout(function(){iv=setInterval(go,70)},380)});
   ['pointerup','pointerleave','pointercancel'].forEach(function(n){btn.addEventListener(n,stop)});
   btn.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();go()}})}
  hold(m,-1);hold(p,1);
  function fromX(e){var r=tr.getBoundingClientRect(),f=Math.min(1,Math.max(0,(e.clientX-r.left)/r.width));setV(inp,+inp.min+f*(+inp.max-+inp.min))}
  tr.addEventListener('pointerdown',function(e){e.preventDefault();tr.setPointerCapture(e.pointerId);tr.dataset.d=1;fromX(e)});
  tr.addEventListener('pointermove',function(e){if(tr.dataset.d)fromX(e)});
  ['pointerup','pointercancel'].forEach(function(n){tr.addEventListener(n,function(){delete tr.dataset.d})})})}
function build(root){
 if(!root||root.querySelector('.lbx')||!root.querySelector('#lsvw'))return;
 var kids=[].slice.call(root.childNodes),intro=null,wrap=null,ro=null,rest=[];
 kids.forEach(function(n){
  if(n.nodeType!==1){return}
  if(!intro&&n.classList.contains('small')&&n.classList.contains('mute')&&!wrap){intro=n;return}
  if(n.id==='lsvw'){wrap=n;return}
  if(n.classList.contains('labr')&&!ro){ro=n;return}
  rest.push(n)});
 if(!wrap)return;
 var box=document.createElement('div');box.className='lbx';
 var stage=document.createElement('div');stage.className='lstage';
 if(intro){intro.classList.add('lintro');stage.appendChild(intro)}
 stage.appendChild(wrap);
 var tot=document.createElement('div');tot.className='ltot';if(ro)tot.appendChild(ro);stage.appendChild(tot);
 var panel=document.createElement('div');panel.className='lpanel';panel.setAttribute('role','group');panel.setAttribute('aria-label','Lab controls');
 var h=document.createElement('div');h.className='lph';h.textContent='Controls';panel.appendChild(h);
 rest.forEach(function(n){if(n.nodeType===1&&n.classList.contains('row')&&!n.querySelector('button,input,[data-lc]')&&!n.textContent.trim())return;panel.appendChild(n)});
 box.appendChild(stage);box.appendChild(panel);touchify(panel);
 while(root.firstChild)root.removeChild(root.firstChild);
 root.appendChild(box)}
function scan(){pend=false;build(document.getElementById('labroot'))}
function sched(){if(pend)return;pend=true;(window.requestAnimationFrame||setTimeout)(scan)}
new MutationObserver(sched).observe(document.body||document.documentElement,{childList:true,subtree:true});
})();
