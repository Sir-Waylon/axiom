/* ===== Stations: interactive recreations of the event tasks + real-life practice instructions ===== */
var STN={list:[],cur:null,st:null,res:null};
function stnReg(o){if(o.pack===(P.meta.stations||''))STN.list.push(o)}
var SR=function(a,b){return a+Math.random()*(b-a)},SI=function(a,b){return Math.floor(SR(a,b+1))},SP=function(a){return a[Math.floor(Math.random()*a.length)]};
var E12=[10,12,15,18,22,27,33,39,47,56,68,82];
var ESER=[];[1,10,100,1000,10000].forEach(function(m){E12.forEach(function(v){ESER.push(v*m)})});
function sig(v,n){return +(+v).toPrecision(n||3)}
function eng(v,u){u=u===undefined?'Ω':u;var a=Math.abs(v);if(a>=1e6)return sig(v/1e6)+' M'+u;if(a>=1e3)return sig(v/1e3)+' k'+u;if(a>=1||a===0)return sig(v)+' '+u;return sig(v*1e3)+' m'+u}
function pv(s){s=String(s==null?'':s).trim().replace(/[−–]/g,'-').replace(/,/g,'').replace(/[ΩωohmsOHMS]/g,'').replace(/\s/g,'');var m=/^(-?\d*\.?\d+(?:e-?\d+)?)([kKmMuµ]?)/.exec(s);if(!m)return NaN;var v=parseFloat(m[1]),x=m[2];return x==='k'||x==='K'?v*1e3:x==='M'?v*1e6:x==='m'?v/1e3:(x==='u'||x==='µ')?v/1e6:v}
function near(v,t,tol){return isFinite(v)&&Math.abs(v-t)<=Math.abs(t)*tol+1e-9}
function sv(st,id){return st.in&&st.in[id]!==undefined?st.in[id]:''}
function fld(st,id,label,unit,ph){return '<label class="fld"><span>'+label+'</span><span class="inl"><input class="si" data-i="'+id+'" inputmode="decimal" autocomplete="off" placeholder="'+(ph||'')+'" value="'+esc(sv(st,id))+'"'+(st.done?' disabled':'')+'>'+(unit?'<em>'+unit+'</em>':'')+'</span></label>'}
function stnIcon(p){return '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="sic">'+p+'</svg>'}
function stationsHTML(){
 if(!STN.list.length)return '<p class="mute">No stations for this event.</p>';
 if(!STN.cur){return '<p class="small mute" style="margin:2px 2px 10px">Practice the real station tasks. Each run is new. Every station also lists how to practice with real equipment.</p><div class="stn-grid">'+STN.list.map(function(o){return '<button class="stn-card" data-stn="open:'+o.id+'"><div class="ico">'+stnIcon(o.ic)+'</div><b>'+esc(o.title)+'</b><span class="small mute">'+esc(o.sub)+'</span></button>'}).join('')+'</div>'+(P.safety?'<div class="card" style="margin-top:12px"><h3>Safety</h3><ul>'+P.safety.map(function(x){return '<li>'+esc(x)+'</li>'}).join('')+'</ul></div>':'')}
 var o=STN.cur;
 return '<div class="stn-top"><button class="iconbtn" data-stn="back" aria-label="Back">←</button><h2>'+esc(o.title)+'</h2></div><p class="small mute" style="margin:0 0 8px">'+o.task(STN.st)+'</p><div id="stnbody">'+stnBody()+'</div>'}
function stnBody(){var o=STN.cur,st=STN.st,h='<div class="stn-sim">'+o.view(st)+'</div>';
 if(!STN.res)h+='<div class="row" style="margin-top:12px"><button class="btn sec" data-stn="new">New problem</button><span class="sp"></span><button class="btn" data-stn="check">Check</button></div>';
 else{var r=STN.res;h+='<div class="card stn-res '+(r.score>=.7?'good':'try')+'"><h3>'+(r.score>=1?'Perfect':r.score>=.7?'Nice work':'Not yet')+' · '+Math.round(r.score*100)+'%</h3>'+r.lines.map(function(l){return '<div class="rl '+(l[0]?'ok':'no')+'"><i>'+(l[0]?'✓':'✗')+'</i><span>'+l[1]+'</span></div>'}).join('')+(r.gain?'<p class="small mute">+'+r.gain+' XP</p>':'')+'</div><div class="card"><h3>Walk-through</h3>'+r.steps.map(function(t,i){return '<div class="step"><b>'+(i+1)+'</b> '+t+'</div>'}).join('')+(o.notes?'<button class="btn sec sm" data-note="'+o.notes+'" style="margin-top:8px">Open the notes</button>':'')+'</div><div class="row"><button class="btn" data-stn="new">New problem</button></div>'}
 h+='<details class="stn-real"><summary>Practice this with real equipment</summary><div class="in"><p class="small"><b>You need:</b> '+o.mats+'</p><ol>'+o.real.map(function(x){return '<li>'+x+'</li>'}).join('')+'</ol></div></details>';
 return h}
function stnDraw(){var b=$('stnbody');if(b)b.innerHTML=stnBody();if(STN.cur&&STN.cur.after)STN.cur.after(STN.st)}
function stnOpen(id){STN.cur=STN.list.filter(function(o){return o.id===id})[0];STN.res=null;STN.st=STN.cur.gen();STN.st.in={};route()}
function stnNew(){STN.res=null;STN.st=STN.cur.gen();STN.st.in={};route()}
function stnCheck(){var o=STN.cur,st=STN.st;if(STN.res)return;var r=o.check(st);r.score=Math.round(Math.max(0,Math.min(1,r.score))*1e4)/1e4;st.done=1;r.gain=0;
 try{r.gain=award({id:'stn-'+o.id,t:o.topic,l:2,type:'short'},r.score>=.7,0,false)}catch(e){}
 window.sfx&&window.sfx(r.score>=.7?'ok':'no');STN.res=r;stnDraw();var e=$('stnbody');if(e)e.scrollIntoView({behavior:'smooth',block:'start'})}
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-stn]');if(b){var a=b.dataset.stn;if(a.indexOf('open:')===0)stnOpen(a.slice(5));else if(a==='back'){STN.cur=null;STN.res=null;route()}else if(a==='new')stnNew();else if(a==='check')stnCheck();return}
 var c=e.target.closest&&e.target.closest('#stnbody [data-a]');if(c&&STN.cur&&!STN.res){var o=STN.cur;if(o.act&&o.act(STN.st,c.dataset.a,c.dataset.v,c)!==false)stnDraw()}});
document.addEventListener('input',function(e){var t=e.target;if(!STN.cur||!STN.st)return;if(t.classList&&t.classList.contains('si')){STN.st.in[t.dataset.i]=t.value;return}
 if(t.dataset&&t.dataset.r&&!STN.res&&STN.cur.range){STN.cur.range(STN.st,t.dataset.r,+t.value,t)}});
document.addEventListener('change',function(e){var t=e.target;if(!STN.cur||STN.res)return;if(t.dataset&&t.dataset.s&&STN.cur.act){if(STN.cur.act(STN.st,t.dataset.s,t.value,t)!==false)stnDraw()}});
var _rt=route;route=function(){_rt.apply(this,arguments);if(cur==='library'&&sub.lib==='stations'&&STN.cur&&STN.cur.after)STN.cur.after(STN.st)};
