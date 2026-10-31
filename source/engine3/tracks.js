/* ===== track switcher (Voltaic <-> Stratus), home link ===== */
(function(){var sib=typeof __SIB!=='undefined'?__SIB:[],sh=$('shell'),bar=sh&&sh.querySelector('header');if(!bar)return;
var lg=bar.querySelector('.logo');if(lg){var a=document.createElement('a');a.className=lg.className;a.href='/';a.setAttribute('aria-label',(sib.length?'Skyvolt':P.meta.brand||P.meta.title)+' home page');while(lg.firstChild)a.appendChild(lg.firstChild);lg.parentNode.replaceChild(a,lg)}
if(sib.length<2)return;var here=location.pathname.replace(/\/index\.html$/,'').replace(/\/$/,'').split('/').pop();
bar.insertAdjacentHTML('afterend','<nav class="tracks" aria-label="Switch track">'+sib.map(function(t){var cur=t.slug===here;return '<a href="/app/'+t.slug+'/" style="--tc:'+t.acc+'"'+(cur?' aria-current="page"':'')+'><i aria-hidden="true"></i><span><b>'+esc(t.brand)+'</b><small>'+esc(t.tag)+'</small></span></a>'}).join('')+'<a class="all" href="/app/" aria-label="All tracks">All</a></nav>')})();
