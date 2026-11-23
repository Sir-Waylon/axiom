(function(){"use strict";var m=/(?:^|; )vx_pg=([^;]*)/.exec(document.cookie),h=document.querySelector(".try .tryhd");if(m&&h){try{var o=JSON.parse(decodeURIComponent(m[1]));if(/^[a-z0-9-]+$/.test(o.s||"")){var p=document.createElement("p"),a=document.createElement("a");p.className="small wb";p.appendChild(document.createTextNode("Welcome back. You are level "+(+o.l||1)+" with "+(+o.x||0)+" XP. "));a.href="/app/"+o.s+"/";a.textContent="Continue practicing";p.appendChild(a);h.parentNode.insertBefore(p,h)}}catch(e){}}})();
(function(){"use strict";var L=document.querySelector(".trylist");if(!L)return;var C=[].slice.call(L.querySelectorAll(".tq")),ct=document.getElementById("tryc"),rm=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
function idx(){var w=C[0].offsetWidth+12;return Math.max(0,Math.min(C.length-1,Math.round(L.scrollLeft/w)))}
function upd(){if(ct)ct.textContent=(idx()+1)+" of "+C.length}
function go(d){var i=Math.max(0,Math.min(C.length-1,idx()+d));L.scrollTo({left:C[i].offsetLeft-C[0].offsetLeft,behavior:rm?"auto":"smooth"})}
document.getElementById("tryp").addEventListener("click",function(){go(-1)});document.getElementById("tryn").addEventListener("click",function(){go(1)});
L.addEventListener("scroll",function(){clearTimeout(L._t);L._t=setTimeout(upd,60)});
function say(c,ok,t){var f=c.querySelector(".tqf");f.querySelector("b").textContent=t;f.hidden=false}
C.forEach(function(c){
 [].forEach.call(c.querySelectorAll(".tqb"),function(b){b.addEventListener("click",function(){var all=c.querySelectorAll(".tqb");if(c.dataset.done)return;c.dataset.done=1;
  var good=b.hasAttribute("data-ok");[].forEach.call(all,function(x){x.disabled=true;if(x.hasAttribute("data-ok"))x.classList.add("ok")});if(!good)b.classList.add("no");say(c,good,good?"Correct!":"Not quite. The right answer is marked.")})});
 var k=c.querySelector(".tqc");if(k){var inp=c.querySelector("input"),run=function(){if(c.dataset.done)return;var raw=inp.value.replace(/[\s,]/g,"").replace(/−/g,"-");if(!raw||isNaN(Number(raw))){say(c,0,"Type a number first.");return}
  var v=Number(inp.dataset.v),x=Number(raw),tol=Number(inp.dataset.tol),ok=Math.abs(x-v)<=Math.max(Math.abs(v)*tol,1e-9);c.dataset.done=1;inp.disabled=true;k.disabled=true;say(c,ok,ok?"Correct!":"Not quite.")};
  k.addEventListener("click",run);inp.addEventListener("keydown",function(e){if(e.key==="Enter"){e.preventDefault();run()}})}
});upd()})();
