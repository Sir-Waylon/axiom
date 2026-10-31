/* ===== dynamic coins (spread-out, effort-aware) + animated results slide ===== */
(function(){
var _aw=award;
function recentAcc(){var r=S.ra||'';return r.length<5?.7:r.split('').filter(function(c){return c==='1'}).length/r.length}
function volF(){var a=(S.dq&&S.dq[today()]&&S.dq[today()].a)||0;try{a=dq().a}catch(e){}return a<=25?1:Math.max(.25,1/(1+(a-25)/35))}
award=function(q,ok,part,helped){
 var c0=S.coins,a0=recentAcc(),vf=volF();
 var g=_aw(q,ok,part,helped);
 S.ra=((S.ra||'')+(ok?'1':'0')).slice(-20);window.sfx&&window.sfx(ok?'ok':'no');
 var d=S.coins-c0;
 if(d>0){var af=Math.max(.4,Math.min(1.6,1.7-1.3*a0)),want=d*af*vf+(S.cc||0),n=Math.floor(want);S.cc=Math.round((want-n)*100)/100;S.coins=c0+n;save();hud&&hud()}
 return g};
if(typeof levelUp==='function'){var _lu=levelUp;levelUp=function(){window.sfx&&window.sfx('level');return _lu.apply(this,arguments)}}
var _ss=startSess;startSess=function(o){_ss.apply(this,arguments);if(Z){Z.c0=S.coins;Z.ts=Date.now()}};
function fmtT(ms){var s=Math.round(ms/1000),m=Math.floor(s/60);return m?m+'m '+('0'+s%60).slice(-2)+'s':s+'s'}
var _dr=drawResults;
drawResults=function(top){
 var z=Z;if(!z||z.sumDone)return _dr(top);
 var s=$('sess'),coins=Math.max(0,S.coins-(z.c0||0)),xp=z.earned,acc=z.pct,t=fmtT(Date.now()-(z.ts||Date.now())),st=dayStreak(),vf=volF(),af=Math.max(.4,Math.min(1.6,1.7-1.3*recentAcc()));
 var note=vf<.7?'Lots of practice today, so coins ease off. Come back tomorrow for full rewards.':af<.7?'You are nailing it, so coins are lower. Harder practice pays more.':af>1.2?'Coins run higher while you are still learning. Every try builds skill.':'Spread-out practice works best. Come back tomorrow!';
 var R=2*Math.PI*30,card=function(cls,ic,lab,val,i){return '<div class="rw '+cls+'" style="animation-delay:'+(.25+i*.18)+'s"><div class="rwi">'+ic+'</div><b class="cu" data-to="'+val[0]+'" data-sfx="'+(val[2]||'')+'">0</b><span>'+lab+'</span></div>'};
 s.innerHTML=top+'<div class="s-body"><div class="sumx"><div class="sum-hero">'+mascot(S.cos.on.av,acc>=60?'cheer':'think',104)+'<h2>'+(z.kind==='lesson'?'Lesson complete!':acc>=90?'Outstanding!':acc>=60?'Nice work!':'Good effort!')+'</h2></div>'+
 '<div class="rwrow">'+card('xp','<svg width="26" height="26" viewBox="0 0 24 24"><path d="M13 2L4 14h6l-1 8 9-12h-6z" fill="#ffb800" stroke="#c78500" stroke-width="1.2" stroke-linejoin="round"/></svg>','XP',[xp],0)+card('coin','<svg width="26" height="26" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9.5" fill="#ffd23c" stroke="#c78500" stroke-width="1.5"/><path d="M12 7v10M9 9.5h4.5a1.8 1.8 0 010 3.6H9.6a1.8 1.8 0 000 3.4H15" stroke="#c78500" stroke-width="1.5" fill="none"/></svg>','Coins',[coins],1)+'</div>'+
 '<div class="rwrow three"><div class="rw" style="animation-delay:.8s"><svg class="ring" width="70" height="70" viewBox="0 0 70 70"><circle cx="35" cy="35" r="30" stroke="var(--pri-soft)" stroke-width="7" fill="none"/><circle cx="35" cy="35" r="30" stroke="var(--pri)" stroke-width="7" fill="none" stroke-linecap="round" stroke-dasharray="'+R+'" stroke-dashoffset="'+R+'" data-off="'+(R*(1-acc/100))+'" transform="rotate(-90 35 35)"/></svg><b class="cu" data-to="'+acc+'" data-suf="%">0%</b><span>Accuracy</span></div>'+
 '<div class="rw" style="animation-delay:.95s"><div class="rwi"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--pri)" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6"/></svg></div><b>'+t+'</b><span>Time</span></div>'+
 '<div class="rw flame" style="animation-delay:1.1s"><div class="rwi"><svg width="28" height="28" viewBox="0 0 24 24"><path d="M12 2c1 4 5 6 5 11a5 5 0 01-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-4-1-6 1-10z" fill="#ff7a1a" stroke="#c2410c" stroke-width="1.2" stroke-linejoin="round"/></svg></div><b class="cu" data-to="'+st+'">0</b><span>Day streak</span></div></div>'+
 '<p class="small mute" style="text-align:center;opacity:0;animation:rwin .5s 1.5s forwards">'+note+'</p></div></div><div class="sheet plain"><div class="sheet-in"><div class="row"><span class="sp"></span><button class="btn" id="sumc">Continue</button></div></div></div>';
 if(!A11.rm){burst&&burst(acc>=70);}
 setTimeout(function(){s.querySelectorAll('.cu').forEach(function(e,i){var to=+e.dataset.to,suf=e.dataset.suf||'',t0=performance.now(),d=A11.rm?1:900;(function f(n){var p=Math.min(1,(n-t0)/d);e.textContent=Math.round(to*(1-Math.pow(1-p,3)))+suf;if(p<1)requestAnimationFrame(f)})(t0)});var c=s.querySelector('circle[data-off]');if(c)c.style.strokeDashoffset=c.dataset.off;window.sfx&&window.sfx('win')},300)};
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('#sumc');if(b&&Z){Z.sumDone=1;drawSess()}},true);
})();
