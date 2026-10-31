/* ===== WebAudio synth sfx (no files) ===== */
(function(){var ctx=null;
function C(){if(!ctx){try{ctx=new (window.AudioContext||window.webkitAudioContext)()}catch(e){return null}}if(ctx.state==='suspended')ctx.resume();return ctx}
function tone(f,t0,d,type,v,f2){var c=C();if(!c)return;var o=c.createOscillator(),g=c.createGain(),t=c.currentTime+t0;o.type=type||'sine';o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+d);g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(v||.12,t+.015);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(c.destination);o.start(t);o.stop(t+d+.02)}
var S2={tick:function(){tone(660,0,.04,'triangle',.05)},pop:function(){tone(520,0,.07,'triangle',.09,780)},click:function(){tone(440,0,.05,'square',.04)},
 ok:function(){tone(660,0,.12,'sine',.13);tone(880,.09,.18,'sine',.13)},no:function(){tone(220,0,.22,'sawtooth',.07,150)},
 streak:function(){[523,659,784,1047].forEach(function(f,i){tone(f,i*.07,.16,'triangle',.11)})},
 level:function(){[392,523,659,784,1047].forEach(function(f,i){tone(f,i*.09,.22,'triangle',.12)})},
 win:function(){[523,659,784].forEach(function(f,i){tone(f,i*.1,.25,'sine',.12)});tone(1047,.35,.4,'triangle',.1)},
 brk:function(){tone(440,0,.3,'sine',.08);tone(554,.2,.4,'sine',.08)}};
window.sfx=function(n){try{if(window.A11&&A11.snd===false)return;if(S2[n])S2[n]()}catch(e){}};
document.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('button,.opt,.node,.tab,[data-oi],[data-sq]');if(t&&!t.disabled)window.sfx(t.dataset&&(t.dataset.oi!==undefined||t.dataset.sq!==undefined)?'pop':'click')},true);
})();
