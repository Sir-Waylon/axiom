/* ===== labbox.js: puts every free-roam lab in its own workbench box =====
   Stage (picture + live readout) on the left or top, a Controls panel on the right or below.
   It only moves existing nodes after a lab has drawn itself, so lab code and its listeners are untouched. */
(function(){
var pend=false;
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
 box.appendChild(stage);box.appendChild(panel);
 while(root.firstChild)root.removeChild(root.firstChild);
 root.appendChild(box)}
function scan(){pend=false;build(document.getElementById('labroot'))}
function sched(){if(pend)return;pend=true;(window.requestAnimationFrame||setTimeout)(scan)}
new MutationObserver(sched).observe(document.body||document.documentElement,{childList:true,subtree:true});
})();
