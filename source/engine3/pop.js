/* ===== pop.js: lesson colour by mode, and a "halfway" cheer ===== */
(function(){
var _d=drawSess;drawSess=function(){var r=_d.apply(this,arguments);try{pop()}catch(e){}return r};
function pop(){var z=Z;if(!z||z.fin||z.kind!=='lesson')return;var c=document.querySelector('#sess .lesson-card');if(c)c.setAttribute('data-m',z.lmode||'new');
 var n=z.steps.length;if(!z._half&&n>=6&&z.i>=Math.floor(n/2)){z._half=1;var t=document.createElement('div');t.className='pkhalf';t.setAttribute('role','status');t.textContent='Halfway there! Keep going';document.body.appendChild(t);setTimeout(function(){t.remove()},2300);try{burst(false)}catch(e){}}}
})();
