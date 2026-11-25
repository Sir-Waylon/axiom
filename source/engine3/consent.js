/* ===== Optional cookie + optional diagnostics (both OFF until the person turns them on in Me > Settings) =====
   1. Progress cookie "vx_pg": a tiny first-party summary (trainer, level, XP, answers) so the home page can say "Welcome back".
      Your full progress stays in your account / on this device. Turning it off deletes the cookie.
   2. Diagnostics: measures this device (cores, memory, screen, connection, a short speed test) and keeps the last few
      errors on this device only. Nothing is sent unless you press "Send to developer". */
(function(){
var CK='vx:consent',DK='vx:diag',C={pg:0,dg:0};
try{C=Object.assign(C,JSON.parse(localStorage.getItem(CK)||'{}'))}catch(e){}
function sc(){try{localStorage.setItem(CK,JSON.stringify(C))}catch(e){}}
function slug(){var m=/\/app\/([a-z0-9-]+)\//.exec(location.pathname);return m?m[1]:''}
function setCookie(on){var s=location.protocol==='https:'?'; Secure':'';
 if(!on){document.cookie='vx_pg=; Max-Age=0; Path=/; SameSite=Lax'+s;return}
 try{var o={s:slug(),l:lvInfo().l,x:Math.round(S.xp||0),t:S.total||0,d:new Date().toISOString().slice(0,10)};
  document.cookie='vx_pg='+encodeURIComponent(JSON.stringify(o))+'; Max-Age=15552000; Path=/; SameSite=Lax'+s}catch(e){}}
var last=0,_sv=save;save=function(){_sv.apply(this,arguments);if(C.pg&&Date.now()-last>5000){last=Date.now();setCookie(1)}};
/* ---- diagnostics ---- */
function base(u){return String(u||'').replace(/^.*[\/\\]/,'').replace(/[?#].*$/,'')}
function log(){try{return JSON.parse(localStorage.getItem(DK)||'[]')}catch(e){return[]}}
function add(m,src,ln,col,st){if(!C.dg)return;var l=log();l.push({t:new Date().toISOString().slice(0,19),m:String(m).slice(0,200),f:base(src)+':'+(ln||0)+':'+(col||0),k:String(st||'').replace(/https?:\/\/[^\s)]*\//g,'').slice(0,500),a:slug(),w:innerWidth+'x'+innerHeight});
 try{localStorage.setItem(DK,JSON.stringify(l.slice(-15)))}catch(e){}}
addEventListener('error',function(e){add(e.message,e.filename,e.lineno,e.colno,e.error&&e.error.stack)});
addEventListener('unhandledrejection',function(e){var r=e.reason;add('Promise: '+(r&&r.message||r),'',0,0,r&&r.stack)});
var longT=0;try{new PerformanceObserver(function(l){longT+=l.getEntries().length}).observe({entryTypes:['longtask']})}catch(e){}
function bench(){var t=performance.now(),x=0;for(var i=0;i<3e6;i++)x+=Math.sqrt(i)*Math.sin(i);return Math.round(performance.now()-t)}
function gpu(){try{var c=document.createElement('canvas'),g=c.getContext('webgl'),e=g&&g.getExtension('WEBGL_debug_renderer_info');return e?String(g.getParameter(e.UNMASKED_RENDERER_WEBGL)).slice(0,80):'hidden by browser'}catch(e){return'unavailable'}}
function scan(){var n=navigator,cn=n.connection||{},nav=(performance.getEntriesByType&&performance.getEntriesByType('navigation')[0])||{},ms=bench();
 var r={cores:n.hardwareConcurrency||0,memGB:n.deviceMemory||0,screen:screen.width+'x'+screen.height,dpr:window.devicePixelRatio||1,viewport:innerWidth+'x'+innerHeight,net:cn.effectiveType||'unknown',saveData:!!cn.saveData,
  loadMs:Math.round(nav.loadEventEnd||nav.duration||0),longTasks:longT,speedTestMs:ms,gpu:gpu(),touch:n.maxTouchPoints||0,app:slug(),ua:String(n.userAgent).slice(0,160)};
 r.rating=(ms>350||(r.cores&&r.cores<=2)||(r.memGB&&r.memGB<=2))?'slow':ms>150?'ok':'fast';return r}
function tips(r){var t=[];if(r.rating==='slow')t.push('Turn on Reduce motion in Settings and close other tabs.');if(r.net==='slow-2g'||r.net==='2g')t.push('The connection is slow; the trainer keeps working offline after the first load.');if(r.saveData)t.push('Data saver is on.');if(!t.length)t.push('This device looks fine.');return t}
var res=null;
function card(){var e=log();
 return '<div class="card set"><h3>New-topic explanations</h3><label><input type="checkbox" id="cs-pr"'+((S.pro&&S.pro.off)?'':' checked')+'> Show a short explanation before I practise a topic for the first time (you can always skip it)</label></div><div class="card set"><h3>Cookies and diagnostics (optional)</h3><p class="small mute">Both are off until you choose. Neither is needed to study.</p>'
 +'<label><input type="checkbox" id="cs-pg"'+(C.pg?' checked':'')+'> Remember a small progress summary on this device (cookie <code>vx_pg</code>, 180 days)</label>'
 +'<label><input type="checkbox" id="cs-dg"'+(C.dg?' checked':'')+'> Check this device&rsquo;s speed and keep recent error details to help fix bugs</label>'
 +(C.dg?'<div class="row" style="gap:8px;flex-wrap:wrap"><button class="btn sec sm" id="cs-run">Run device check</button><button class="btn sec sm" id="cs-send"'+((res||e.length)?'':' disabled')+'>Send to developer</button><button class="btn sec sm" id="cs-clr">Clear</button></div>'
  +(res?'<div class="small" id="cs-out" role="status"><b>Device: '+res.rating+'</b> · '+res.cores+' cores · '+(res.memGB?res.memGB+' GB memory · ':'')+res.screen+' @'+res.dpr+'x · network '+res.net+' · speed test '+res.speedTestMs+' ms<br>GPU: '+esc(res.gpu)+'<br>'+tips(res).map(esc).join(' ')+'</div>':'')
  +'<p class="small mute">'+e.length+' recent error'+(e.length===1?'':'s')+' saved on this device'+(e.length?': latest &ldquo;'+esc(e[e.length-1].m)+'&rdquo; in '+esc(e[e.length-1].f):'')+'. Nothing is sent unless you press Send. Reports hold device details and error text only, never your answers, name or email.</p>':'')+'</div>'}
var _vm=viewMe;viewMe=function(){var h=_vm.apply(this,arguments);return sub.me==='settings'?h+card():h};
var _am=afterMe;afterMe=function(){_am.apply(this,arguments);if(sub.me!=='settings'||!$('cs-pg'))return;
 $('cs-pr').onchange=function(){S.pro=S.pro||{};S.pro.off=this.checked?0:1;save();toast(this.checked?'Explanations on':'Explanations off')};
 $('cs-pg').onchange=function(){C.pg=this.checked?1:0;sc();setCookie(C.pg);toast(C.pg?'Progress cookie on':'Progress cookie deleted')};
 $('cs-dg').onchange=function(){C.dg=this.checked?1:0;sc();if(!C.dg){try{localStorage.removeItem(DK)}catch(e){}res=null}route()};
 if($('cs-run'))$('cs-run').onclick=function(){res=scan();route()};
 if($('cs-clr'))$('cs-clr').onclick=function(){try{localStorage.removeItem(DK)}catch(e){}res=null;route()};
 if($('cs-send'))$('cs-send').onclick=function(){var o={device:res||scan(),errors:log(),v:'__VER__'};fetch('/api/diag',{method:'POST',credentials:'same-origin',headers:{'content-type':'application/json'},body:JSON.stringify(o)}).then(function(r){toast(r.ok?'Thanks, sent':'Could not send right now')}).catch(function(){toast('Could not send right now')})}};
if(C.pg)setCookie(1);
})();
