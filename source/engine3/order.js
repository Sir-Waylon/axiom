/* Ordering questions: drag cards by the dots into numbered boxes (touch and mouse). Taps still work; up/down arrows reorder for keyboards. */
(function(){
var D=null,ghost=null,sup=0;
function slotAt(x,y){var el=document.elementFromPoint(x,y);return el&&el.closest?el.closest('.slot'):null}
document.addEventListener('pointerdown',function(e){var g=e.target.closest&&e.target.closest('[data-drag],[data-dragpo]');if(!g||!window.Z||e.button>0)return;
 var it=Z.steps[Z.i]&&Z.steps[Z.i].it;if(!it||it.done||!it.seq)return;e.preventDefault();
 D={from:g.dataset.drag!==undefined?{k:+g.dataset.drag}:null,v:g.dataset.drag!==undefined?it.seq[+g.dataset.drag]:+g.dataset.dragpo,it:it,x:e.clientX,y:e.clientY,moved:0,id:e.pointerId};
 try{g.setPointerCapture(e.pointerId)}catch(_){}
 var src=g.closest('.oc,.oi');ghost=document.createElement('div');ghost.className='dgh';ghost.textContent=src?src.textContent.replace(/\u2807/g,'').trim():'';ghost.style.width=Math.min(280,(src&&src.offsetWidth)||200)+'px';document.body.appendChild(ghost);mv(e)},true);
function mv(e){if(!ghost)return;if(D&&Math.abs(e.clientX-D.x)+Math.abs(e.clientY-D.y)>8)D.far=1;ghost.style.left=(e.clientX-30)+'px';ghost.style.top=(e.clientY-24)+'px';D.moved=1;[].forEach.call(document.querySelectorAll('.slot.over'),function(x){x.classList.remove('over')});var sl=slotAt(e.clientX,e.clientY);if(sl)sl.classList.add('over')}
document.addEventListener('pointermove',function(e){if(D&&e.pointerId===D.id){e.preventDefault();mv(e)}},{passive:false});
function end(e){if(!D||e.pointerId!==D.id)return;var sl=slotAt(e.clientX,e.clientY),it=D.it,v=D.v,from=D.from,far=D.far;[].forEach.call(document.querySelectorAll('.slot.over'),function(x){x.classList.remove('over')});if(ghost){ghost.remove();ghost=null}D=null;
 if(from)it.seq.splice(from.k,1);
 if(!far){if(!from)it.seq.push(v)}else if(sl){var k=Math.min(+sl.dataset.slot,it.seq.length);it.seq.splice(k,0,v)}else if(!from){/* dropped nowhere: stays in bank */}
 drawSess()}
document.addEventListener('pointerup',end);document.addEventListener('pointercancel',function(e){if(D&&e.pointerId===D.id){if(ghost){ghost.remove();ghost=null}D=null;drawSess()}});
})();
