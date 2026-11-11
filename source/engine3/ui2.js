/* ===== compact navigation: nested menus with search for Practice, Library and Me; breadcrumbs; collapsed settings ===== */
(function(){
var CU=window.__cu,V={me:null,lib:null,prac:null},Q={q:{},open:{}};
var I={key:'<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M16 7l3 3M14 9l2 2"/>',chart:'<path d="M3 20V4"/><path d="M3 20h18"/><path d="M5 16c3 0 3-9 7-9s4 9 8 9"/>',user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c1-5 4-7 8-7s7 2 8 7"/>',bag:'<path d="M5 8h14l-1 12H6z"/><path d="M9 8a3 3 0 016 0"/>',users:'<circle cx="9" cy="8" r="3.5"/><path d="M2 20c.7-4 3.2-6 7-6s6.3 2 7 6"/><path d="M16 5a3.5 3.5 0 010 7M18 14c2.2.5 3.6 2.3 4 6"/>',gear:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>',book:'<path d="M4 4h6a2 2 0 012 2v14a2 2 0 00-2-2H4zM20 4h-6a2 2 0 00-2 2v14a2 2 0 012-2h6z"/>',cards:'<rect x="3" y="6" width="14" height="12" rx="2"/><path d="M7 3h12a2 2 0 012 2v10"/>',flask:'<path d="M9 3h6M10 3v6l-5 9a2 2 0 002 3h10a2 2 0 002-3l-5-9V3"/>',list:'<path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/>',check:'<path d="M5 12l4 4 10-10"/>',bolt:'<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',timer:'<circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6"/>',repeat:'<path d="M4 12a8 8 0 0114-5l2-2v6h-6l2-2a5 5 0 00-9 3M20 12a8 8 0 01-14 5l-2 2v-6h6l-2 2a5 5 0 009-3"/>',grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/>',play:'<path d="M8 5l11 7-11 7z"/>',shield:'<path d="M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6z"/>',star:'<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',pen:'<path d="M4 20l1-4L17 4l3 3L8 19z"/>',search:'<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>'};
var CH='<svg class="chv" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>';
var BK='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>';
window.__I=I;
function ic(k,s){return svgi(I[k]||I.star,s||20)}
function row(k,t,d,i,badge,kw){return '<button class="rw2" data-nav="'+k+'" data-kw="'+esc((t+' '+(d||'')+' '+(kw||'')).toLowerCase())+'"><span class="ri">'+ic(i)+'</span><span class="rt"><b>'+esc(t)+'</b>'+(d?'<small>'+esc(d)+'</small>':'')+'</span>'+(badge?'<span class="rb">'+badge+'</span>':'')+CH+'</button>'}
function search(key,ph){return '<label class="sch">'+ic('search',18)+'<span class="sr-only">Search</span><input type="search" data-sq="'+key+'" placeholder="'+ph+'" autocomplete="off" enterkeyhint="search" value="'+esc(Q.q[key]||'')+'"></label>'}
var RN={me:'Me',lib:'Library',prac:'Practice'};
function crumb(key,title,right){return '<div class="crumb"><button class="back" data-back="'+key+'" aria-label="Back to '+RN[key]+'">'+BK+'<span>'+RN[key]+'</span></button><h2>'+esc(title)+'</h2>'+(right||'')+'</div>'}
function pips(t){var l=mastery(t).lv;return '<span class="cpips" aria-label="'+['Not started','Attempted','Familiar','Proficient','Mastered'][l]+'">'+[1,2,3,4].map(function(k){return '<em class="'+(l>=k?'on lv'+l:'')+'"></em>'}).join('')+'</span>'}
function tname(t){var x=P.topics.filter(function(y){return y.id===t})[0];return x?x.name:t}
function order(){var pr={},a=CU&&CU.items();if(a)CU.focus(a).forEach(function(x,i){pr[x.t]=i});return{o:P.topics.map(function(t){return t.id}).sort(function(x,y){return (pr[x]===undefined?999:pr[x])-(pr[y]===undefined?999:pr[y])||ALL.indexOf(x)-ALL.indexOf(y)}),pr:pr}}
window.__order=order;window.__tname=tname;
/* reset a tab to its menu when its tab button is tapped */
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('#nav button');if(b){var m={me:'me',library:'lib',practice:'prac'}[b.dataset.t];if(m)V[m]=null;return}
 if(e.target.closest&&e.target.closest('#lvr')){V.me='profile'}},true);
/* breadcrumb replaces the old segmented tabs */
var _seg=seg;seg=function(list,key){if(key==='me'||key==='lib'){var t=(list.filter(function(x){return x[0]===sub[key]})[0]||[0,''])[1];return crumb(key,t)}return _seg.apply(this,arguments)};
/* ---- Me ---- */
function meRoot(){var L=lvInfo(),h='<div class="card prof2"><div class="row">'+mascot(S.cos.on.av,'happy',56)+'<div style="flex:1;min-width:0"><b class="pn">'+esc(S.nm||avOf(S.cos.on.av)[1])+'</b><div class="small mute">Level '+L.l+' · '+esc(L.name)+' · '+dayStreak()+' day streak</div></div></div></div>'+search('me','Search settings and profile')+'<div class="list2">';
 h+=row('me:profile','Profile','Progress, mastery and badges','user')+row('me:shop','Looks','Avatars, banners and titles','bag')+row('me:friends','Friends and account','Sign in, friends, reminders','users')+row('me:settings','Settings','Appearance, sound, accessibility, study times','gear','','theme dark text size motion contrast reminders voice sound dyslexia focus')+row('me:dev','Educator access','Access code, skip checks, preview plans','key','','teacher developer dev code skip unlock');
 return h+'</div><p class="empty" hidden>No matches</p>'}
var _vm=viewMe;viewMe=function(){if(V.me==null)return meRoot();sub.me=V.me;return _vm.apply(this,arguments)};
/* ---- Practice ---- */
function pracRoot(){var miss=Object.keys(S.miss).filter(function(id){return QI[id]!==undefined}).length,h='<h2 class="h2">Practice</h2>'+search('prac','Search modes and topics')+'<div class="list2">';
 h+=row('act:quick','Adaptive practice','12 questions that adjust to you','target')+row('act:blitz','Blitz','60 seconds, go fast','bolt')+row('act:mock','Mock test','30 questions, timed','timer')+row('act:review','Review mistakes',miss?miss+' to fix':'Nothing to fix yet','repeat',miss?'<span class="pill">'+miss+'</span>':'')+row('act:match','Match','Pair terms against the clock','grid')+row('lib:flash','Flashcards','Flip, learn, write and match','cards','','quizlet cards study vocabulary')+row('prac:topics','Practice one topic','Pick a topic','list','','topic unit')+row('act:play','Play with others','Host, solo or versus','users','','online class code versus host kahoot blooket');
 return h+'</div><p class="empty" hidden>No matches</p>'}
function topicsView(){var o=order(),h=crumb('prac','Practice one topic')+search('topics','Search topics')+'<div class="list2">';
 o.o.forEach(function(t){h+='<button class="rw2" data-nav="act:t:'+t+'" data-kw="'+esc(tname(t).toLowerCase())+'"><span class="rt"><b>'+esc(tname(t))+'</b>'+pips(t)+'</span>'+(o.pr[t]!==undefined&&o.pr[t]<3?'<span class="pill">Next</span>':'')+CH+'</button>'});
 return h+'</div><p class="empty" hidden>No matches</p>'}
var _vp=viewPractice;viewPractice=function(){if(V.prac==='topics')return topicsView();return pracRoot()};
/* ---- Library ---- */
function guideHTML(){var o=order(),h=search('guide','Search the study guide')+'<div class="list2">',st=window.STUDY||{cards:{}};
 o.o.forEach(function(t){var cs=(st.cards||{})[t];if(!cs||!cs.length)return;var op=Q.open[t];
  h+='<details class="gd" data-t="'+t+'" data-kw="'+esc((tname(t)+' '+cs.map(function(c){return c[0]+' '+c[1]}).join(' ')).toLowerCase())+'"'+(op?' open':'')+'><summary><span class="rt"><b>'+esc(tname(t))+'</b>'+pips(t)+'</span>'+(o.pr[t]!==undefined&&o.pr[t]<3?'<span class="pill">In your plan</span>':'')+CH+'</summary><div class="in"><ul class="gl2">'+cs.map(function(c){return '<li><b>'+esc(c[0])+'</b> '+esc(c[1])+(c[2]?' <code>'+esc(c[2])+'</code>':'')+'</li>'}).join('')+'</ul><div class="row"><button class="btn sm" data-nav="flash:'+t+'">Flashcards</button><button class="btn sec sm" data-nav="act:t:'+t+'">Practice</button></div></div></details>'});
 return h+'</div><p class="empty" hidden>No matches</p>'}
function libRoot(){var o=order(),first=o.o.filter(function(t){return o.pr[t]!==undefined&&o.pr[t]<3}).slice(0,3),h='<h2 class="h2">Library</h2>'+search('lib','Search terms, formulas and topics')+'<div id="sres" class="list2" hidden></div><div id="lroot">';
 if(first.length)h+='<div class="sech">For your plan</div><div class="list2">'+first.map(function(t){return '<div class="rw2 static" data-kw="'+esc(tname(t).toLowerCase())+'"><span class="rt"><b>'+esc(tname(t))+'</b>'+pips(t)+'</span><button class="btn sm" data-nav="flash:'+t+'">Cards</button><button class="btn sec sm" data-nav="lib:guide" data-open="'+t+'">Guide</button></div>'}).join('')+'</div>';
 h+='<div class="sech">Study</div><div class="list2">'+row('lib:guide','Study guide','Every topic, your plan first','book','','notes facts formulas')+row('lib:flash','Flashcards','Flip, learn, write and match','cards','','quizlet')+row('lib:labs','Labs','Free-roam simulations','flask','','simulation sandbox explore')+(window.__hasGraph&&window.__hasGraph()?row('lib:graph','Graphing calculator','Plot functions, sliders, points','chart','','desmos graph plot function'):'')+row('lib:gloss','Glossary','Key terms','list')+(P.proofs&&P.proofs.length?row('lib:proofs','Proofs','Step by step','check'):'')+'</div>';
 h+='<div class="sech">Reference</div><div class="list2">'+row('lib:notes','Reference notes','Longer notes','book')+(P.meta.stations?row('lib:stations','Stations','Station practice','grid'):'')+row('lib:written','Written answers','Model responses','pen')+row('lib:plan','Test-day plan','Schedule and checklist','timer')+'</div></div><p class="empty" hidden>No matches</p>';return h}
var TTL={guide:'Study guide',flash:'Flashcards',labs:'Labs',notes:'Reference notes',stations:'Stations',written:'Written answers',plan:'Test-day plan',gloss:'Glossary',proofs:'Proofs'};
var _vl=viewLibrary;viewLibrary=function(){if(V.lib==null)return libRoot();sub.lib=V.lib;if(V.lib==='guide')return crumb('lib','Study guide')+guideHTML();
 if(V.lib==='flash'&&window.flashView)return crumb('lib','Flashcards')+flashView();if(V.lib==='labs'&&window.labsView)return crumb('lib','Labs')+labsView();if(V.lib==='graph'&&window.graphView)return crumb('lib','Graphing calculator')+graphView();
 var h=_vl.apply(this,arguments);return crumb('lib',TTL[V.lib]||'Library')+h.replace(/^<div class="seg"[\s\S]*?<\/div>/,'')};
/* ---- navigation, search ---- */
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-nav],[data-back]');if(!b)return;
 if(b.dataset.back){V[b.dataset.back]=null;if(window.flashStop)flashStop();route();window.scrollTo(0,0);return}
 var k=b.dataset.nav.split(':');
 if(k[0]==='me'){V.me=k[1];sub.me=k[1]}else if(k[0]==='lib'){V.lib=k[1];sub.lib=k[1];if(b.dataset.open)Q.open[b.dataset.open]=1;if(window.flashStop&&k[1]!=='flash')flashStop()}
 else if(k[0]==='prac'){V.prac=k[1]}
 else if(k[0]==='flash'){if(cur!=='library')go('library');V.lib='flash';if(window.flashDeck)flashDeck(k[1])}
 else if(k[0]==='act'){var a=k[1];if(a==='quick')startPractice(ALL,12);else if(a==='blitz')startBlitz();else if(a==='mock')startMock();else if(a==='review')startReview();else if(a==='match')startMatch();else if(a==='t')startPractice([k[2]],12);else if(a==='play'&&window.openOnline)openOnline();return}
 route();window.scrollTo(0,0)});
function filt(inp){var q=inp.value.trim().toLowerCase(),root=inp.closest('#main')||document;Q.q[inp.dataset.sq]=inp.value;
 [].forEach.call(root.querySelectorAll('[data-kw]'),function(r){r.hidden=q&&r.dataset.kw.indexOf(q)<0});
 [].forEach.call(root.querySelectorAll('.sech'),function(s){var n=s.nextElementSibling,any=n&&[].some.call(n.children,function(c){return !c.hidden});s.hidden=!any});
 var em=root.querySelector('.empty');if(em)em.hidden=![].every.call(root.querySelectorAll('[data-kw]'),function(r){return r.hidden});
 if(inp.dataset.sq==='lib'){var box=document.getElementById('sres');if(box){if(q.length<2){box.hidden=true;box.innerHTML=''}else{var st=window.STUDY||{},out=[];(st.glossary||[]).forEach(function(g){if((g[0]+' '+g[1]).toLowerCase().indexOf(q)>=0)out.push('<div class="rw2 static"><span class="rt"><b>'+esc(g[0])+'</b><small>'+esc(g[1])+'</small></span></div>')});
  Object.keys(st.cards||{}).forEach(function(t){st.cards[t].forEach(function(c){if(out.length<14&&(c[0]+' '+c[1]).toLowerCase().indexOf(q)>=0)out.push('<button class="rw2" data-nav="lib:guide" data-open="'+t+'"><span class="rt"><b>'+esc(c[0])+'</b><small>'+esc(tname(t))+': '+esc(c[1].slice(0,110))+'</small></span>'+CH+'</button>')})});
  box.innerHTML=out.slice(0,14).join('')||'';box.hidden=!out.length}}}}
document.addEventListener('input',function(e){if(e.target.dataset&&e.target.dataset.sq)filt(e.target)});
/* ---- collapse long pages into sections ---- */
function post(){var m=document.getElementById('main');if(!m)return;var a=m.querySelector('.crumb');if(cur==='me'&&V.me&&(sub.me==='settings'||sub.me==='profile')){var first=true;[].slice.call(m.querySelectorAll(':scope > .card')).forEach(function(c){var h=c.querySelector(':scope > h3');if(!h||c.dataset.cz)return;var d=document.createElement('details'),s=document.createElement('summary'),w=document.createElement('div');d.className='card cz';d.dataset.cz='1';s.innerHTML='<b>'+h.innerHTML+'</b>'+CH;var key=sub.me+':'+h.textContent;d.dataset.k=key;
  if(Q.open[key]===undefined)Q.open[key]=sub.me==='profile'&&first;first=false;if(Q.open[key])d.open=true;w.className='in';h.remove();while(c.firstChild)w.appendChild(c.firstChild);d.appendChild(s);d.appendChild(w);c.replaceWith(d)})}
 var q=m.querySelector('[data-sq]');if(q&&q.value)filt(q)}
document.addEventListener('toggle',function(e){var d=e.target;if(d.dataset&&d.dataset.k)Q.open[d.dataset.k]=d.open;else if(d.classList&&d.classList.contains('gd'))Q.open[d.dataset.t]=d.open},true);
var _rt=route;route=function(){var r=_rt.apply(this,arguments);try{post()}catch(e){}return r};
if(location.hash==='#practice'||location.hash==='#me'){var hh=location.hash.slice(1);setTimeout(function(){V[hh==='me'?'me':'prac']=null;go(hh)},0)}
try{localStorage.setItem('vx:last',location.pathname.replace(/index\.html$/,''))}catch(e){}
var _am=afterMe;afterMe=function(){if(V.me==null)return;return _am.apply(this,arguments)};
window.__V=V;
})();

window.askOk=function(title,msg,yes,cb){var m=document.createElement('div');m.className='modal';m.style.zIndex=200;m.setAttribute('role','alertdialog');m.setAttribute('aria-modal','true');m.setAttribute('aria-label',title);
m.innerHTML='<div class="mbox" style="max-width:380px"><h3>'+esc(title)+'</h3><p>'+esc(msg)+'</p><button class="btn block" data-ok="1">'+esc(yes)+'</button><button class="btn sec block" data-ok="0">Cancel</button></div>';
var done=function(r){document.removeEventListener('keydown',kd);m.remove();if(r)cb()},kd=function(e){if(e.key==='Escape')done(0)};
m.addEventListener('click',function(e){var b=e.target.closest('[data-ok]');if(b)done(b.dataset.ok==='1');else if(e.target===m)done(0)});document.addEventListener('keydown',kd);document.body.appendChild(m);var f=m.querySelector('[data-ok="0"]');f&&f.focus()};

