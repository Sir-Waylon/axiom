/* ===== extras: labs in cards, resume, test-out, endless + skill checks, brain breaks, brand ===== */
(function(){
var M=P.meta;
if(M.accent){var r=document.documentElement.style;r.setProperty('--pri',M.accent[0]);r.setProperty('--pri-soft','color-mix(in srgb,'+M.accent[0]+' 14%,var(--surface))');r.setProperty('--sel','var(--pri-t)')}
try{var tt=$('ttl');if(tt)tt.textContent=M.brand||M.title;var og=$('org');if(og)og.textContent=M.tagline||(M.org+' · '+M.year);document.title=(M.brand||M.title)}catch(e){}

var LM={par:'par',tri:'tri',rt:'pyth',cir:'insc',lin:'line',crd:'line',sim:'scale',trn:'trn',virpe:'ohm',static:'coul',circ:'sp',logic:'gate',diode:'diode'};
document.addEventListener('click',function(e){var c=e.target.closest&&e.target.closest('.clz');if(c)c.classList.add('on')});
document.addEventListener('keydown',function(e){if((e.key==='Enter'||e.key===' ')&&e.target.classList&&e.target.classList.contains('clz')){e.preventDefault();e.target.classList.add('on')}});
/* labs */
var _ds=drawSess;drawSess=function(){_ds.apply(this,arguments);try{var st=Z&&Z.steps[Z.i];if(st&&st.k==='card'&&st.c.lab){var lc=document.querySelector('.lesson-card');if(lc&&!lc.querySelector('.lab')){var d=document.createElement('div');d.className='lab';lc.appendChild(d);labInit(d,st.c.lab)}}else if(st&&st.k==='explain'&&!st.ex&&st.st===0&&LM[st.it.q.t]){var ex=document.querySelector('.explain');if(ex&&!ex.querySelector('.lab')){var d2=document.createElement('div');d2.className='lab';ex.appendChild(d2);labInit(d2,LM[st.it.q.t])}}}catch(e){}};
/* resume */
function saveResume(){if(!Z||Z.fin||Z.kind!=='lesson')return;var n=0;for(var k=0;k<Z.i;k++){var s=Z.steps[k];if(s.k!=='explain'&&!(s.it&&s.it.follow))n++}S.rs={u:Z.unit.id,l:Z.lesson.id,n:n};save()}
var _ad=advance;advance=function(){_ad.apply(this,arguments);saveResume();try{var st=Z&&Z.steps[Z.i];if(st&&st.it&&st.it.skill)toast('Skill check: one from earlier')}catch(e){}};
var _fs=finishSess;finishSess=function(){var z=Z;if(z&&!z.fin&&z.kind==='lesson'){delete S.rs}var was=z&&z.fin;_fs.apply(this,arguments);
};
function resumeNow(){var r=S.rs;if(!r)return;startLesson(r.u,r.l);if(Z){Z.i=Math.min(r.n,Z.steps.length-1);drawSess()}}
function startEndless(){startSess({kind:'quick',title:'Endless',topics:(typeof pSel!=='undefined'&&pSel&&pSel.length?pSel:ALL),steps:[],lvl:1,streak:0,N:9999,remed:true,adaptive:true,endless:true})}
var _aa=appendAdaptive;appendAdaptive=function(){_aa.apply(this,arguments);if(Z&&Z.endless){Z.mains=Z.seenQ.length+6;if(Z.seenQ.length>3&&Z.seenQ.length%7===0){var d=dueIds().filter(function(id){return Z.seenQ.indexOf(id)<0});if(!d.length)d=Z.seenQ.slice(0,Z.seenQ.length-5).filter(function(id){var t=QS[QI[id]].type;return t==='mcq'||t==='short'});if(d.length){var id=d[Math.floor(Math.random()*d.length)];var it=mkItem(id);it.skill=1;Z.steps[Z.steps.length-1]={k:'try',it:it};Z.seenQ[Z.seenQ.length-1]=id}}}};
/* learn view patches */
var _vl2=viewLearn;viewLearn=function(){var h=_vl2();
 if(S.rs){var u=UN.filter(function(x){return x.id===S.rs.u})[0],L=u&&u.lessons.filter(function(x){return x.id===S.rs.l})[0];if(L)h=h.replace('<details class="unit"','<div class="cont resume"><div style="flex:1"><div class="small" style="opacity:.9">Pick up where you left off</div><h2>'+esc(L.title)+'</h2></div><button class="btn" id="rsm">Continue</button></div><details class="unit"')}
 return h};
var _vp=viewPractice;viewPractice=function(){var h=_vp();return h.replace('<button class="card" data-pm="blitz"','<button class="card" data-pm="endless" style="text-align:left"><h3>Endless</h3><p class="small mute">Never runs out. Skill checks and breaks.</p></button><button class="card" data-pm="blitz"')};
document.addEventListener('click',function(e){var t=e.target;
 if(t.id==='rsm'){resumeNow();return}
 var pm=t.closest&&t.closest('[data-pm="endless"]');if(pm){e.stopPropagation();startEndless()}},true);
/* breaks */
function brk(){var m=document.createElement('div');m.className='modal';var left=180;m.innerHTML='<div class="card">'+mascot(S.cos.on.av,'happy',96)+'<h2>Brain break</h2><p class="mute">Stand up, stretch, sip some water. Your brain files what you learned while you rest.</p><div class="bigtime" id="bt">3:00</div><button class="btn" id="bk">I am back</button></div>';document.body.appendChild(m);
 var iv=setInterval(function(){left--;var e=$('bt');if(e)e.textContent=Math.floor(left/60)+':'+('0'+left%60).slice(-2);if(left<=0){clearInterval(iv);var b=$('bk');if(b)b.textContent='Ready to continue'}},1000);
 $('bk').onclick=function(){clearInterval(iv);m.remove();if(Z)Z.nextBrk=Date.now()+20*60000}}
setInterval(function(){if(!Z||Z.fin||Z.kind==='blitz'||Z.kind==='mock'||Z.kind==='unit'||Z.kind==='testout'||document.querySelector('.modal'))return;if(!Z.nextBrk)Z.nextBrk=Z.t0+20*60000;if(Date.now()>=Z.nextBrk){Z.nextBrk=Date.now()+60*60000;brk()}},15000);
window.__brk=brk;route();window.startEndless=startEndless;
})();
