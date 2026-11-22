(function(){"use strict";
(function(){var i=document.getElementById("sq"),l=document.getElementById("sres"),ix=null,sel=-1;if(!i||!l)return;
function load(c){if(ix)return c();fetch("/search.json").then(function(r){return r.json()}).then(function(j){ix=j;c()}).catch(function(){ix=[];c()})}
function show(q){q=q.trim().toLowerCase();l.innerHTML="";sel=-1;if(q.length<2){l.hidden=true;return}
var r=ix.map(function(e){var t=e.t.toLowerCase(),d=(e.d||"").toLowerCase(),s=t.indexOf(q)===0?3:t.indexOf(q)>=0?2:d.indexOf(q)>=0?1:0;return[s,e]}).filter(function(x){return x[0]}).sort(function(a,b){return b[0]-a[0]}).slice(0,6);
if(!r.length){var n=document.createElement("li");n.textContent="No matches. Try a topic name.";n.style.padding="10px 12px";l.appendChild(n)}
r.forEach(function(x){var li=document.createElement("li"),a=document.createElement("a"),sm=document.createElement("small");a.href=x[1].u;a.textContent=x[1].t;sm.textContent=x[1].d||"";a.appendChild(sm);li.appendChild(a);l.appendChild(li)});l.hidden=false}
i.addEventListener("input",function(){load(function(){show(i.value)})});
i.addEventListener("keydown",function(e){var a=[].slice.call(l.querySelectorAll("a"));if(e.key==="Escape"){l.hidden=true;return}if(e.key==="ArrowDown"&&a.length){e.preventDefault();sel=Math.min(sel+1,a.length-1);a[sel].focus()}if(e.key==="Enter"&&a.length){location.href=a[0].href}});
l.addEventListener("keydown",function(e){var a=[].slice.call(l.querySelectorAll("a"));if(e.key==="ArrowDown"){e.preventDefault();sel=Math.min(sel+1,a.length-1);a[sel].focus()}if(e.key==="ArrowUp"){e.preventDefault();sel--;if(sel<0){i.focus()}else a[sel].focus()}if(e.key==="Escape"){l.hidden=true;i.focus()}});
document.addEventListener("click",function(e){if(!e.target.closest(".srch"))l.hidden=true})})();
(function(){var h=location.hostname.toLowerCase(),me="axiom",ot="skyvolt";if(h.indexOf(me)<0)return;var u=location.protocol+"//"+h.replace(me,ot)+(location.port?":"+location.port:"")+"/";[].forEach.call(document.querySelectorAll("[data-sister]"),function(a){a.href=u;a.rel="noopener"});[].forEach.call(document.querySelectorAll("[data-sister-wrap]"),function(w){w.hidden=false})})();
function ck(){var m=document.cookie.split("; ").filter(function(c){return c.indexOf("__Host-csrf=")===0})[0];return m?m.slice(12):""}
fetch("/api/me",{credentials:"same-origin"}).then(function(r){if(!r.ok||!/json/.test(r.headers.get("content-type")||""))throw 0;return r.json()}).then(function(j){if(!j||!j.username)return;
function lo(){fetch("/api/logout",{method:"POST",credentials:"same-origin",headers:{"content-type":"application/json","x-csrf":ck()},body:"{}"}).then(function(){location.reload()})}
var a=document.querySelectorAll('a[href="/account/"]'),first=true;for(var i=0;i<a.length;i++){if(a[i].closest("footer"))continue;
 if(!first){var so=document.createElement("button");so.type="button";so.className=a[i].className;so.textContent="Sign out";so.addEventListener("click",lo);a[i].parentNode.replaceChild(so,a[i]);continue}first=false;
 var w=document.createElement("span");w.className="um";var b=document.createElement("button");b.type="button";b.className="btn sec";b.setAttribute("aria-haspopup","menu");b.setAttribute("aria-expanded","false");b.textContent="Signed in ▾";
 var m=document.createElement("div");m.className="umm";m.setAttribute("role","menu");m.hidden=true;m.innerHTML='<div class="umh">'+String(j.username).replace(/[<>&"]/g,"")+'</div><a role="menuitem" href="/app/#me">Profile</a><a role="menuitem" href="/app/#practice">Practice</a><a role="menuitem" href="/app/">All trainers</a><button role="menuitem" type="button" id="umo">Sign out</button>';
 w.appendChild(b);w.appendChild(m);a[i].parentNode.replaceChild(w,a[i]);
 function close(){m.hidden=true;b.setAttribute("aria-expanded","false")}
 b.addEventListener("click",function(e){e.stopPropagation();var o=m.hidden;m.hidden=!o;b.setAttribute("aria-expanded",String(o));if(o){var f=m.querySelector("a");f&&f.focus()}});
 document.addEventListener("click",function(e){if(!w.contains(e.target))close()});
 w.addEventListener("keydown",function(e){if(e.key==="Escape"){close();b.focus()}if(e.key==="ArrowDown"||e.key==="ArrowUp"){var it=[].slice.call(m.querySelectorAll("[role=menuitem]")),k=it.indexOf(document.activeElement);if(!m.hidden){e.preventDefault();it[(k+(e.key==="ArrowDown"?1:it.length-1))%it.length].focus()}}});
 m.querySelector("#umo").addEventListener("click",function(){fetch("/api/logout",{method:"POST",credentials:"same-origin",headers:{"content-type":"application/json","x-csrf":ck()},body:"{}"}).then(function(){location.reload()})});
 }}).catch(function(){})})();