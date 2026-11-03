/* ===== WebAudio synth sfx (no files) ===== */
(function(){var ctx=null;
function C(){if(!ctx){try{ctx=new (window.AudioContext||window.webkitAudioContext)()}catch(e){return null}}if(ctx.state==='suspended')ctx.resume();return ctx}
function tone(f,t0,d,type,v,f2){var c=C();if(!c)return;var o=c.createOscillator(),g=c.createGain(),t=c.currentTime+t0;o.type=type||'sine';o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+d);g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(v||.12,t+.015);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(c.destination);o.start(t);o.stop(t+d+.02)}
function noise(t0,d,v,f1,f2,q){var c=C();if(!c)return;var n=Math.floor(c.sampleRate*d),b=c.createBuffer(1,n,c.sampleRate),a=b.getChannelData(0),k;for(k=0;k<n;k++)a[k]=Math.random()*2-1;var s=c.createBufferSource(),fl=c.createBiquadFilter(),g=c.createGain(),t=c.currentTime+t0;s.buffer=b;fl.type='bandpass';fl.Q.value=q||1.2;fl.frequency.setValueAtTime(f1,t);if(f2)fl.frequency.exponentialRampToValueAtTime(f2,t+d);g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(v||.1,t+d*.15);g.gain.exponentialRampToValueAtTime(.0001,t+d);s.connect(fl);fl.connect(g);g.connect(c.destination);s.start(t);s.stop(t+d+.02)}
function arp(notes,gap,d,type,v){notes.forEach(function(f,i){tone(f,i*gap,d,type||'triangle',v||.11)})}
var combo=0;
var S2={tick:function(){tone(660,0,.04,'triangle',.05)},pop:function(){tone(520,0,.07,'triangle',.09,780)},click:function(){tone(440,0,.05,'square',.04)},
 ok:function(){tone(660,0,.12,'sine',.13);tone(880,.09,.18,'sine',.13)},no:function(){tone(220,0,.22,'sawtooth',.07,150)},
 streak:function(){arp([523,659,784,1047],.07,.16)},
 level:function(){arp([392,523,659,784,1047],.09,.22,'triangle',.12)},
 win:function(){arp([523,659,784],.1,.25,'sine',.12);tone(1047,.35,.4,'triangle',.1)},
 brk:function(){tone(440,0,.3,'sine',.08);tone(554,.2,.4,'sine',.08)},
 /* answers */
 combo:function(){combo=Math.min(combo+1,8);var b=523*Math.pow(1.0595,combo*2);tone(b,0,.1,'sine',.12);tone(b*1.5,.07,.16,'sine',.12);if(combo>=3)tone(b*2,.14,.2,'triangle',.08)},
 comboreset:function(){combo=0},
 almost:function(){tone(440,0,.1,'sine',.1);tone(392,.1,.2,'sine',.1)},
 buzz:function(){tone(110,0,.25,'sawtooth',.08);tone(104,0,.25,'square',.04)},
 perfect:function(){arp([523,659,784,1047,1319],.06,.2,'triangle',.11);noise(.3,.5,.05,3000,9000)},
 /* economy */
 coin:function(){tone(988,0,.07,'square',.06);tone(1319,.07,.28,'square',.06)},
 coins:function(){for(var i=0;i<5;i++){tone(1200+i*90,i*.06,.1,'square',.04)}},
 buy:function(){tone(330,0,.08,'triangle',.1);tone(494,.07,.08,'triangle',.1);tone(659,.14,.2,'triangle',.1)},
 /* boxes */
 shake:function(){for(var i=0;i<8;i++){noise(i*.14,.1,.07,500+i*140,300+i*140,3);tone(90+i*12,i*.14,.1,'square',.03)}},
 reveal0:function(){arp([523,659],.1,.3,'sine',.12)},
 reveal1:function(){arp([523,659,784],.09,.3,'sine',.12)},
 reveal2:function(){arp([523,659,784,1047],.09,.35,'triangle',.12);noise(.2,.4,.04,4000,8000)},
 reveal3:function(){arp([392,523,659,784,1047],.08,.4,'triangle',.12);noise(.1,.6,.06,2000,9000);tone(1568,.45,.6,'sine',.09)},
 reveal4:function(){arp([392,494,587,740,988,1175],.08,.45,'triangle',.12);noise(.1,.8,.08,1500,10000);tone(1976,.55,.8,'sine',.1);tone(98,0,.9,'sine',.12)},
 reveal5:function(){arp([261,392,523,659,784,1047,1319,1568],.09,.6,'triangle',.12);noise(0,1.2,.1,800,12000,.6);tone(65,0,1.4,'sine',.16);tone(2093,.8,1,'sine',.08)},
 /* ui */
 whoosh:function(){noise(0,.28,.09,400,3000,.8)},
 swish:function(){noise(0,.18,.07,2500,700,.9)},
 flip:function(){tone(300,0,.05,'triangle',.07,500);noise(.02,.08,.05,2000,3500)},
 hint:function(){tone(784,0,.1,'sine',.09);tone(988,.1,.18,'sine',.09)},
 lock:function(){tone(180,0,.08,'square',.06);tone(140,.07,.12,'square',.06)},
 unlock:function(){tone(440,0,.07,'triangle',.09);tone(660,.07,.07,'triangle',.09);tone(880,.14,.2,'triangle',.1)},
 equip:function(){tone(587,0,.06,'triangle',.1);tone(880,.06,.18,'triangle',.1);noise(.02,.12,.04,3000,6000)},
 toast:function(){tone(880,0,.08,'sine',.07)},
 sparkle:function(){for(var i=0;i<5;i++)tone(1500+Math.random()*2500,i*.05,.12,'sine',.04)},
 /* timing / games */
 count:function(){tone(700,0,.12,'square',.07)},
 go:function(){tone(1050,0,.3,'square',.08);tone(1400,.02,.3,'triangle',.06)},
 timeup:function(){tone(330,0,.15,'sawtooth',.08);tone(247,.15,.35,'sawtooth',.08)},
 join:function(){arp([523,784],.08,.12,'triangle',.09)},
 leave:function(){arp([784,523],.08,.12,'triangle',.07)},
 gameWin:function(){arp([523,659,784,1047,784,1047,1319],.1,.22,'triangle',.12);noise(.4,.7,.06,3000,9000)},
 gameLose:function(){arp([392,349,311,262],.14,.3,'sine',.1)},
 daily:function(){arp([523,659,784,659,784,1047],.08,.2,'sine',.11)},
 badge:function(){tone(1047,0,.1,'triangle',.1);tone(1319,.1,.1,'triangle',.1);tone(1568,.2,.4,'triangle',.11);noise(.2,.3,.04,4000,9000)},
 type:function(){tone(1200+Math.random()*300,0,.02,'square',.025)},
 wow:function(){tone(300,0,.4,'sawtooth',.06,900)}};
window.sfxList=Object.keys(S2);
window.sfx=function(n){try{if(window.A11&&A11.snd===false)return;if(S2[n])S2[n]()}catch(e){}};
document.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('button,.opt,.node,.tab,[data-oi],[data-sq]');if(t&&!t.disabled)window.sfx(t.dataset&&(t.dataset.oi!==undefined||t.dataset.sq!==undefined)?'pop':'click')},true);
})();
