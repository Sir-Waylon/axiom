(function(){"use strict";
var $=function(i){return document.getElementById(i)},up=false,csrf="";
function ck(){var m=document.cookie.split("; ").filter(function(c){return c.indexOf("__Host-csrf=")===0})[0];return m?m.slice(12):""}
function api(m,p,b){return fetch("/api"+p,{method:m,credentials:"same-origin",headers:{"content-type":"application/json","x-csrf":csrf||ck()},body:m==="POST"?JSON.stringify(b||{}):undefined}).then(function(r){return r.json().catch(function(){return{error:"The server is not reachable. You can still learn as a guest."}}).then(function(j){j.__s=r.status;return j})})}
function say(t,id){var e=$(id||"msg");e.textContent=t||"";e.className="msg"+(t?" bad":"")}
function mark(el,bad){el.setAttribute("aria-invalid",bad?"true":"false")}
function mode(u){up=u;$("mIn").setAttribute("aria-pressed",!u);$("mUp").setAttribute("aria-pressed",u);$("wId").hidden=u;$("wEm").hidden=!u;$("wUn").hidden=!u;$("wCo").hidden=!u;$("ph").hidden=!u;$("pw").autocomplete=u?"new-password":"current-password";$("go").textContent=u?"Create account":"Sign in";say("")}
function next(){var q=/[?&]next=([^&]+)/.exec(location.search),n=q?decodeURIComponent(q[1]):"";return/^\/app\/[a-z0-9\/_-]*$/.test(n)?n:"/app/"}
function done(j){if(j.error){say(j.error);$("go").disabled=false;return}csrf=j.csrf||csrf;if(j.needUsername){$("f").hidden=true;$("uf").hidden=false;$("un2").focus();return}location.href=next()}
$("mIn").onclick=function(){mode(false)};$("mUp").onclick=function(){mode(true)};
$("sh").onchange=function(){$("pw").type=this.checked?"text":"password"};
$("f").onsubmit=function(e){e.preventDefault();say("");var pw=$("pw").value,bad=0;
 if(up){var em=$("em").value.trim(),un=$("un").value.trim().toLowerCase();
  if(!/^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']{2,}$/.test(em)){mark($("em"),1);say("Enter a valid email.");$("em").focus();return}mark($("em"),0);
  if(!/^[a-z0-9_]{3,16}$/.test(un)){mark($("un"),1);say("Username: 3 to 16 letters, numbers or _.");$("un").focus();return}mark($("un"),0);
  if(pw.length<10){mark($("pw"),1);say("Use at least 10 characters.");$("pw").focus();return}mark($("pw"),0);
  if(!$("co").checked){say("Please confirm the age and agreement box.");$("co").focus();return}
  $("go").disabled=true;api("POST","/signup",{email:em,username:un,password:pw}).then(done)}
 else{var id=$("id").value.trim();if(!id||!pw){say("Enter your email or username and password.");return}$("go").disabled=true;api("POST","/login",{id:id,password:pw}).then(done)}};
$("uf").onsubmit=function(e){e.preventDefault();var u=$("un2").value.trim().toLowerCase();if(!/^[a-z0-9_]{3,16}$/.test(u)){say("Username: 3 to 16 letters, numbers or _.","msg2");return}api("POST","/username",{username:u}).then(function(j){if(j.error)say(j.error,"msg2");else location.href=next()})};
function loadG(cid){var s=document.createElement("script");s.src="https://accounts.google.com/gsi/client";s.async=true;s.onload=function(){try{google.accounts.id.initialize({client_id:cid,callback:function(r){say("");api("POST","/google",{credential:r.credential}).then(done)},auto_select:false});google.accounts.id.renderButton($("gbtn"),{theme:"outline",size:"large",text:"continue_with",shape:"pill",width:320});$("gw").hidden=false}catch(x){}};document.head.appendChild(s)}
fetch("/api/config",{credentials:"same-origin"}).then(function(r){if(!r.ok||!/json/.test(r.headers.get("content-type")||""))throw 0;return r.json()}).then(function(c){if(c.google)loadG(c.google);return api("GET","/me")}).then(function(j){
 if(j.__s===200){csrf=j.csrf||"";if(j.needUsername){$("f").hidden=true;$("uf").hidden=false}else{$("f").hidden=true;$("signed").hidden=false;$("who").textContent=j.username}}}).catch(function(){say("Accounts are not available on this copy of the site. You can still learn as a guest.");$("go").disabled=true});
})();