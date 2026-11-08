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
/* default schedule, shown to the student. Right after school is the strongest window; it fades through the evening. */
function sched(d){var h=d.getHours(),m=h*60+d.getMinutes(),wk=d.getDay()===0||d.getDay()===6;
 if(h>=22||h<6)return{mult:.8,tag:'Sleep first',why:'Late at night coins are 20% lower. Sleep helps you remember more than one extra session.'};
 if(m>=1290)return{mult:.9,tag:'Wind down',why:'After 9:30 PM coins ease down. Finish a short mission and rest.'};
 if(wk){if((h>=9&&h<12)||(h>=14&&h<17))return{mult:1.2,tag:'Good window',why:'Weekend default: mid-morning and mid-afternoon.'};return{mult:1,tag:'Normal',why:'Default rate.'}}
 if(m>=870&&m<1050)return{mult:1.25,tag:'After school',why:'Right after school is the strongest default window (2:30 to 5:30 PM). Your brain is warm and the day is still fresh.'};
 if(m>=1050&&m<1170)return{mult:1.1,tag:'Good window',why:'Early evening (5:30 to 7:30 PM). The bonus fades as the evening goes on.'};
 return{mult:1,tag:'Normal',why:'Default rate. Practice right after school for the biggest bonus.'}}
window.studyWindow=function(d){d=d||new Date();var h=d.getHours(),st=stats(),bs=best(st),s=sched(d);
 if(bs&&s.mult>=.9){if(bs.indexOf(h)>=0){return{mult:Math.max(s.mult,1.25),tag:'Peak window',why:'This is one of your three most accurate hours (based on your answers on this device).',best:bs,hour:h,pct:Math.round((Math.max(s.mult,1.25)-1)*100)}}
  if(bs.some(function(b){return Math.abs(b-h)===1})&&s.mult<1.15){return{mult:1.15,tag:'Good window',why:'Next to one of your best hours.',best:bs,hour:h,pct:15}}}
 return{mult:s.mult,tag:s.tag,why:s.why,best:bs,hour:h,pct:Math.round((s.mult-1)*100)}};
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
 return h+'<div class="card set"><h3>Best study times</h3><p class="small">'+(bs?'Your most accurate hours: <b>'+bs.slice().sort(function(a,b){return a-b}).map(fh).join(', ')+'</b>.':'Still learning your best hours. Answer questions at different times of day.')+' Coins get a visible bonus in those hours. The default schedule peaks right after school and fades into the evening, with a small reduction after 9:30 PM.</p>'+(bs?'<button class="btn sm sec" id="sw-set">Remind me at '+fh(bs[0])+'</button>':'')+'</div>'};
document.addEventListener('click',function(e){if(e.target.id==='sw-set'){var w=studyWindow();if(w.best){var o=RM.get();o.on=true;o.t=('0'+Math.min.apply(null,w.best)).slice(-2)+':00';RM.set(o);toast('Reminder set for '+o.t);route()}}});
})();
