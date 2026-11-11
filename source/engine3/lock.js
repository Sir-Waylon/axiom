/* ===== lock it in: delayed retrieval, confidence ratings, end-of-mission retest ===== */
/* Why: retrieving something after a gap beats re-reading it (Roediger & Karpicke 2006; Cepeda et al. 2006).
   Rating how sure you are before checking trains accurate self-judgement, and corrections to confident errors stick well
   (Butler, Fazio & Marsh 2011). A retest after other items adds spaced practice inside the session. */
(function(){
if(!S.cal)S.cal={g:[0,0],t:[0,0],s:[0,0]};if(!S.hyper)S.hyper={};
var CF=[['g','Guess'],['t','Think so'],['s','Sure']];
window.confRow=function(it){return '<div class="conf" role="group" aria-label="How sure are you?"><span class="small mute">How sure?</span>'+CF.map(function(c){return '<button type="button" class="cfdd'+(it.conf===c[0]?' on':'')+'" aria-pressed="'+(it.conf===c[0])+'" data-cf="'+c[0]+'">'+c[1]+'</button>'}).join('')+'</div>'};
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-cf]');if(!b||!Z)return;var st=Z.steps[Z.i],it=st&&st.it;if(!it||it.done)return;it.conf=it.conf===b.dataset.cf?null:b.dataset.cf;[].forEach.call(document.querySelectorAll('[data-cf]'),function(x){var on=x.dataset.cf===it.conf;x.classList.toggle('on',on);x.setAttribute('aria-pressed',on)})});
var _ri=resolveIt;resolveIt=function(it){var was=it.done;_ri(it);if(!was&&it.done&&it.conf&&!it.follow){var c=S.cal[it.conf]=S.cal[it.conf]||[0,0];c[1]++;if(it.ok)c[0]++;
 if(!it.ok&&it.conf==='s'){it.hyper=1;S.hyper[it.id]=dayN()}else if(it.ok&&S.hyper[it.id])delete S.hyper[it.id]}};
window.calCard=function(all){var r={g:[0,0],t:[0,0],s:[0,0]},n=0;all.forEach(function(x){var it=x.it;if(it.done&&!it.skipped&&it.conf){r[it.conf][1]++;n++;if(it.ok)r[it.conf][0]++}});if(n<3)return '';
 var h='<div class="card"><h3>How sure you were</h3>';CF.forEach(function(c){var v=r[c[0]];if(v[1])h+='<div class="bar2"><span>'+c[1]+'</span><span class="tr"><i style="width:'+(100*v[0]/v[1])+'%"></i></span><span>'+v[0]+'/'+v[1]+'</span></div>'});
 var s=r.s;h+='<p class="small mute">'+(s[1]&&s[0]<s[1]?'Some answers you felt sure about were wrong. Those are the best ones to learn from.':'Your confidence matched your results. Keep trusting your checks.')+'</p></div>';return h};
/* delayed retrieval first: items last practised 1 to 5 days ago, weakest first */
function lockIds(n){var d=dayN(),c=[];for(var id in S.mem){if(QI[id]===undefined)continue;var m=S.mem[id],last=m[1]-BOX[m[0]],age=d-last;if(age<1||age>6)continue;c.push([id,(S.hyper[id]?-5:0)+m[0]*2-Math.min(age,6)*.2+Math.random()*.5])}
 c.sort(function(a,b){return a[1]-b[1]});return c.slice(0,n).map(function(x){return x[0]})}
var _s3=startSess;startSess=function(o){
 if(o)o.a0=window.actNow();
 if(o&&o.kind==='mission'&&!o.lkd&&o.steps){o.lkd=1;var ids=lockIds(3);if(ids.length){var rest=o.steps.filter(function(s){return !(s.k==='try'&&ids.indexOf(s.it.id)>-1)});o.steps=ids.map(function(id){return {k:'try',it:mkItem(id),lock:1}}).concat(rest)}}
 return _s3.apply(this,arguments)};
/* end of mission: ask the missed ones again after the other items in between */
var _ad=advance;advance=function(){
 if(Z&&Z.kind==='mission'&&!Z.rq&&Z.i+1>=Z.steps.length){Z.rq=1;var ms=Z.steps.filter(function(s){return s.k==='try'&&s.it&&s.it.done&&!s.it.ok&&!s.it.skipped&&!s.follow&&!s.lock&&!(Z.rq3&&Z.rq3[s.it.id])}).sort(function(a,b){return (b.it.hyper?1:0)-(a.it.hyper?1:0)}).slice(0,3);
  ms.forEach(function(s){Z.steps.push({k:'try',it:mkItem(s.it.id),lock:2})});Z.mains+=ms.length}
 return _ad.apply(this,arguments)};
})();

/* time on the site only: the break timer ignores time the tab is hidden or the window is not focused */
(function(){var AC=0,last=Date.now();function on(){return document.visibilityState==='visible'&&(!document.hasFocus||document.hasFocus())}
setInterval(function(){var n=Date.now(),d=n-last;last=n;if(on()&&d<5000)AC+=d},500);
window.actNow=function(){var n=Date.now(),d=n-last;return AC+(on()&&d<5000?d:0)};
/* keep the footer above the on-screen keyboard */
function fit(){var se=document.getElementById('sess'),vv=window.visualViewport;if(!se||!vv)return;se.style.height=vv.height+'px';se.style.top=vv.offsetTop+'px';se.style.bottom='auto'}
if(window.visualViewport){visualViewport.addEventListener('resize',fit);visualViewport.addEventListener('scroll',fit)}})();
