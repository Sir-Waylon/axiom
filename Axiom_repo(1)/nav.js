(function(){"use strict";
function ck(){var m=document.cookie.split("; ").filter(function(c){return c.indexOf("__Host-csrf=")===0})[0];return m?m.slice(12):""}
fetch("/api/me",{credentials:"same-origin"}).then(function(r){if(!r.ok||!/json/.test(r.headers.get("content-type")||""))throw 0;return r.json()}).then(function(j){if(!j||!j.username)return;
var a=document.querySelectorAll('a[href="/account/"]');for(var i=0;i<a.length;i++){if(a[i].closest("footer"))continue;
 var w=document.createElement("span");w.className="um";var b=document.createElement("button");b.type="button";b.className="btn sec";b.setAttribute("aria-haspopup","menu");b.setAttribute("aria-expanded","false");b.textContent="Signed in ▾";
 var m=document.createElement("div");m.className="umm";m.setAttribute("role","menu");m.hidden=true;m.innerHTML='<div class="umh">'+String(j.username).replace(/[<>&"]/g,"")+'</div><a role="menuitem" href="/app/#me">Profile</a><a role="menuitem" href="/app/#practice">Practice</a><a role="menuitem" href="/app/">All trainers</a><button role="menuitem" type="button" id="umo">Sign out</button>';
 w.appendChild(b);w.appendChild(m);a[i].parentNode.replaceChild(w,a[i]);
 function close(){m.hidden=true;b.setAttribute("aria-expanded","false")}
 b.addEventListener("click",function(e){e.stopPropagation();var o=m.hidden;m.hidden=!o;b.setAttribute("aria-expanded",String(o));if(o){var f=m.querySelector("a");f&&f.focus()}});
 document.addEventListener("click",function(e){if(!w.contains(e.target))close()});
 w.addEventListener("keydown",function(e){if(e.key==="Escape"){close();b.focus()}if(e.key==="ArrowDown"||e.key==="ArrowUp"){var it=[].slice.call(m.querySelectorAll("[role=menuitem]")),k=it.indexOf(document.activeElement);if(!m.hidden){e.preventDefault();it[(k+(e.key==="ArrowDown"?1:it.length-1))%it.length].focus()}}});
 m.querySelector("#umo").addEventListener("click",function(){fetch("/api/logout",{method:"POST",credentials:"same-origin",headers:{"content-type":"application/json","x-csrf":ck()},body:"{}"}).then(function(){location.reload()})});
 break}}).catch(function(){})})();