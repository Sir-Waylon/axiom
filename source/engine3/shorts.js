/* ===== typed answers first: converted questions can reveal their choices as a hint ===== */
var _qbSh=qBody;qBody=function(it,rev){var h=_qbSh(it,rev),q=it.q;if(q.type!=='short'||!q.o||rev||it.done||(Z&&Z.nofb))return h;
 if(!it.showo)return h+'<div class="so"><button class="btn sec sm" type="button" id="so">Show choices (halves XP)</button></div>';
 return h+'<div class="so"><p class="small mute">Tap a choice to fill in your answer.</p><div class="chips">'+(it.operm||(it.operm=shuf(q.o.map(function(_,i){return i})))).map(function(i){return '<button class="ch" type="button" data-fill="'+i+'">'+esc(q.o[i])+'</button>'}).join('')+'</div></div>'};
document.addEventListener('click',function(e){if(!Z||Z.fin)return;var st=Z.steps[Z.i],it=st&&st.it;if(!it||it.done)return;var t=e.target;
 if(t.id==='so'){it.showo=1;it.help=Math.max(1,it.help||0);drawSess();return}
 var f=t.closest&&t.closest('[data-fill]');if(f){var v=it.q.o[+f.dataset.fill];it.val=v;var inp=$('sv');if(inp)inp.value=v;var b=$('chk');if(b)b.disabled=false;var n=$('nx');if(n&&Z.nofb)n.disabled=false}});
