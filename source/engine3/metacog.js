/* ===== study tactics: confidence check (calibration) and "why does it work?" self-explanation =====
   Both are optional and quick. Confidence ratings never change your score. They show whether you know what you know. */
(function(){
function cal(){if(!S.cal)S.cal={1:[0,0],2:[0,0],3:[0,0]};return S.cal}
var LBL={1:'Guess',2:'Think so',3:'Sure'};
function reasonOpts(q){var w=String(q.w||'');if(!w)return null;var pool=QS.filter(function(x){return x.t===q.t&&x.id!==q.id&&x.w&&x.w!==w&&x.fp!==q.fp&&x.type!=='sim'&&String(x.w).length<140});
 if(pool.length<2||w.length>160)return null;var h=0,s=q.id;for(var i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))>>>0;var a=pool[h%pool.length],b=pool[(h*7+3)%pool.length];if(a===b)b=pool[(h+1)%pool.length];if(a===b||a.w===b.w)return null;
 var o=[{t:w,ok:1},{t:a.w},{t:b.w}];return o.sort(function(x,y){return (hsh(x.t+q.id)%97)-(hsh(y.t+q.id)%97)})}
function hsh(s){var h=2166136261;for(var i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
var _ds5=drawSess;drawSess=function(){_ds5.apply(this,arguments);try{
 var z=Z;if(!z||z.fin||z.nofb)return;var st=z.steps[z.i];if(!st||st.k!=='try'||!st.it)return;var it=st.it,sh=document.querySelector('.sheet .sheet-in');if(!sh)return;
 if(!it.done){return;var d=document.createElement('div');d.className='conf';d.setAttribute('role','group');d.setAttribute('aria-label','How sure are you? Optional');d.innerHTML='<span>How sure? <i>(optional)</i></span>'+[1,2,3].map(function(n){return '<button data-cf="'+n+'" aria-pressed="'+(it.conf===n)+'" class="'+(it.conf===n?'on':'')+'">'+LBL[n]+'</button>'}).join('');sh.insertBefore(d,sh.firstChild);return}
 /* after checking */
 if(sh.querySelector('.cfb,.xpl'))return;var add='',q=it.q;
 
 if(it.conf){var m=it.ok?(it.conf==='g'?'You said guess and got it. Check the steps so it sticks.':it.conf==='s'?'You were sure and right. That is real knowledge.':'Nice, your hunch was right.'):(it.conf==='s'?'You were sure, but it was a miss. That is the most useful kind of mistake to study.':it.conf==='g'?'You said guess. Good call: this one needs more practice.':'Close. Review the steps below.');add+='<div class="cfb">'+m+'</div>'}
 if(it.ok&&q.type!=='sim'&&q.l>=2&&!it.xpd&&(z.right%3===1)&&!z.nofb){var o=reasonOpts(q);if(o){it.xo=o;add+='<div class="xpl" id="xpl"><b>Why does it work? +3 XP</b>'+o.map(function(x,i){return '<button data-xp="'+i+'">'+esc(x.t)+'</button>'}).join('')+'</div>'}}
 if(add){var dv=document.createElement('div');dv.innerHTML=add;while(dv.firstChild)sh.appendChild(dv.firstChild)}}catch(e){}};
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-xp]');if(!b)return;var it=Z&&Z.steps&&Z.steps[Z.i]&&Z.steps[Z.i].it;if(!it)return;
 if(b.dataset.cf){it.conf=+b.dataset.cf;b.parentNode.querySelectorAll('button').forEach(function(x){var on=x===b;x.classList.toggle('on',on);x.setAttribute('aria-pressed',on)});window.sfx&&sfx('tick');return}
 if(b.dataset.xp!==undefined&&it.xo&&!it.xpd){it.xpd=1;var o=it.xo[+b.dataset.xp];var box=document.getElementById('xpl');box.querySelectorAll('button').forEach(function(x,i){x.disabled=true;x.classList.add(it.xo[i].ok?'good':(x===b?'wrong':''))});
  if(o.ok){S.xp+=3;S.dxp[today()]=(S.dxp[today()]||0)+3;save();hud&&hud();window.sfx&&sfx('ok')}else window.sfx&&sfx('almost')}});
var _vmC=viewMe;viewMe=function(){var h=_vmC();if(sub.me!=='profile')return h;var c=cal(),n=c[1][1]+c[2][1]+c[3][1];if(n<6)return h;
 return h+'<div class="card"><h3>How well you know what you know</h3><p class="small mute">When you rate your confidence, this shows how often each rating was right. Sure should be right most of the time.</p><table class="calt"><tr><th></th><th>Rated</th><th>Right</th></tr>'+[1,2,3].map(function(k){var x=c[k];return '<tr><td>'+LBL[k]+'</td><td>'+x[1]+'</td><td>'+(x[1]?Math.round(100*x[0]/x[1])+'%':'–')+'</td></tr>'}).join('')+'</table></div>'};
})();
/* ---- placement check: "I haven't learned this" skip so nobody gets stuck or overwhelmed ---- */
(function(){
var _dsK=drawSess;drawSess=function(){_dsK.apply(this,arguments);try{var z=Z;if(!z||z.fin||z.kind!=='diag')return;var row=document.querySelector('.sheet .sheet-in .row');if(!row||document.getElementById('dkip'))return;
 var b=document.createElement('button');b.className='btn sec sm';b.id='dkip';b.textContent="I haven't learned this";b.setAttribute('aria-label',"Skip: I haven't learned this yet");row.insertBefore(b,row.firstChild);
 var sp=document.querySelector('.sheet .sheet-in');if(sp&&!sp.querySelector('.dknote')){var n=document.createElement('p');n.className='small mute dknote';n.textContent='Not sure? Skipping is fine. It just tells us where to start you.';sp.appendChild(n)}}catch(e){}};
document.addEventListener('click',function(e){if(e.target.id!=='dkip')return;var z=Z;if(!z||z.kind!=='diag')return;var st=z.steps[z.i],it=st&&st.it;if(!it)return;
 it.dk=1;it.skipped=true;it.done=true;it.ok=false;it.res=null;S.dk=S.dk||{};S.dk[it.q.t]=1;if(!st.probe)S.miss[it.id]=1;window.sfx&&sfx('swish');
 if(z.i===z.steps.length-1)finishSess();else advance()});
})();
