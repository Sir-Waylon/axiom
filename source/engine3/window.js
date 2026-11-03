/* ===== study window: a visible coin bonus that depends on the time of day (cosmetic coins only) =====
   Your own accuracy by hour of day is kept on this device and never uploaded. Until there are enough answers the app
   uses a default after-school window. Late night earns slightly less on purpose, because sleep helps memory more than one more session. */
(function(){
var MIN=8;
function hrs(){if(!S.hr)S.hr={};return S.hr}
window.recHour=function(ok){try{var h=new Date().getHours(),o=hrs();if(!o[h])o[h]=[0,0];o[h][1]++;if(ok)o[h][0]++}catch(e){}};
function stats(){var o=hrs(),t=0,r=0,rows=[];for(var h=0;h<24;h++){var x=o[h];if(x&&x[1]>0){t+=x[1];r+=x[0];rows.push({h:h,n:x[1],a:x[0]/x[1]})}}return{t:t,m:t?r/t:0,rows:rows}}
function best(st){var ok=st.rows.filter(function(x){return x.n>=MIN}).sort(function(a,b){return b.a-a.a||b.n-a.n});return ok.length>=2&&st.t>=40?ok.slice(0,3).map(function(x){return x.h}):null}
function fh(h){return (h%12||12)+(h<12?' AM':' PM')}
window.fmtHour=fh;
window.studyWindow=function(d){d=d||new Date();var h=d.getHours(),st=stats(),bs=best(st),mult=1,tag='Normal',why='';
 if(h>=22||h<6){mult=.8;tag='Sleep first';why='Late at night coins are 20% lower. Sleep helps you remember more than one extra session.'}
 else if(bs){if(bs.indexOf(h)>=0){mult=1.3;tag='Peak window';why='This is one of your three most accurate hours (based on your answers on this device).'}
  else{var near=bs.some(function(b){return Math.abs(b-h)===1});if(near){mult=1.15;tag='Good window';why='Next to one of your best hours.'}else{why='Not one of your best hours, so the normal rate applies.'}}}
 else{if(h>=15&&h<20){mult=1.15;tag='Good window';why='Default after-school window. It will switch to your own best hours once you have answered about 40 questions.'}else{why='Default rate. Answer a few more questions at different times and this will learn your best hours.'}}
 return{mult:mult,tag:tag,why:why,best:bs,hour:h,pct:Math.round((mult-1)*100)}};
window.studyChip=function(){var w=studyWindow(),s=w.pct>0?'+'+w.pct+'% coins':w.pct<0?w.pct+'% coins':'Normal coins';
 return '<button class="swchip sw'+(w.pct>0?'u':w.pct<0?'d':'n')+'" data-sw="1" aria-label="'+w.tag+', '+s+'. Tap to see why."><i aria-hidden="true">'+(w.pct>0?'☀':w.pct<0?'☾':'●')+'</i><b>'+w.tag+'</b><span>'+s+'</span></button>'};
/* coins use the multiplier: wrap award on the coin gain only */
var _aw2=award;award=function(q,ok,part,helped){var c0=S.coins,g=_aw2.apply(this,arguments),d=S.coins-c0;recHour(ok);
 if(d>0){var m=studyWindow().mult;if(m!==1){var want=d*m+(S.cw||0),n=Math.floor(want);S.cw=Math.round((want-n)*100)/100;S.coins=c0+Math.max(0,n);save();hud&&hud()}}return g};
if(typeof greet==='function'){var _gr=greet;greet=function(){return _gr.apply(this,arguments)+'<div class="swrow">'+studyChip()+'</div>'}}
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-sw]');if(!b)return;var w=studyWindow(),m=document.createElement('div');m.className='modal';m.setAttribute('role','dialog');m.setAttribute('aria-modal','true');m.setAttribute('aria-label','Study window');
 m.innerHTML='<div class="mbox" style="max-width:380px"><h3>'+w.tag+' · '+(w.pct>0?'+':'')+w.pct+'% coins</h3><p>'+w.why+'</p><p class="small mute">Coins only unlock looks. They never change questions or scores. Your hour-by-hour accuracy stays on this device.</p>'+(w.best?'<p><b>Your best hours:</b> '+w.best.sort(function(a,b){return a-b}).map(fh).join(', ')+'</p>':'')+'<button class="btn" id="swx">Got it</button></div>';
 document.body.appendChild(m);m.addEventListener('click',function(ev){if(ev.target===m||ev.target.id==='swx')m.remove()});var x=m.querySelector('#swx');if(x)x.focus()});
/* settings: best-time card + one tap to move the reminder */
var _vm2=viewMe;viewMe=function(){var h=_vm2();if(sub.me!=='settings')return h;var w=studyWindow(),bs=w.best;
 return h+'<div class="card set"><h3>Best study times</h3><p class="small">'+(bs?'Your most accurate hours: <b>'+bs.slice().sort(function(a,b){return a-b}).map(fh).join(', ')+'</b>.':'Still learning your best hours. Answer questions at different times of day.')+' Coins get a visible bonus in those hours, and a small reduction after 10 PM.</p>'+(bs?'<button class="btn sm sec" id="sw-set">Remind me at '+fh(bs[0])+'</button>':'')+'</div>'};
document.addEventListener('click',function(e){if(e.target.id==='sw-set'){var w=studyWindow();if(w.best){var o=RM.get();o.on=true;o.t=('0'+Math.min.apply(null,w.best)).slice(-2)+':00';RM.set(o);toast('Reminder set for '+o.t);route()}}});
})();
