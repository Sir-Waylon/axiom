/* New-topic primer: before practice on a topic the student has never answered a question in, show a short explanation (big idea, everyday picture, key ideas, common trap).
   It can be skipped at any time, and switched off for good. Shown once per topic. */
var _ssP=startSess;
function primerTopic(o){if(!o||o.kind!=='quick'||(S.pro&&S.pro.off))return null;var ts=o.topics||[];
 for(var i=0;i<ts.length;i++){var t=ts[i];if(mastery(t).n===0&&!(S.pro&&S.pro[t])&&window.WHY&&WHY[t])return t}return null}
function primerShow(t,go){
 var u=UN.filter(function(x){return x.id===t})[0],w=WHY[t],nm=(u&&u.title)||t,cards=[];
 if(u)u.lessons.forEach(function(L){L.cards.forEach(function(c){if(cards.length<4&&c.h&&c.t)cards.push(c)})});
 S.pro=S.pro||{};S.pro[t]=1;save();
 var m=document.createElement('div');m.className='modal';m.setAttribute('role','dialog');m.setAttribute('aria-modal','true');m.setAttribute('aria-label','New topic: '+nm);
 var h='<div class="mbox pmx"><p class="small mute">New topic</p><h3>'+esc(nm)+'</h3><p class="small mute">A short explanation before you practise. You can skip it any time.</p>'
  +'<h4>The big idea</h4><p>'+esc(w[0])+'</p><h4>Think of it like this</h4><p>'+esc(w[1])+'</p>';
 if(cards.length)h+='<h4>Key ideas</h4><ul>'+cards.map(function(c){return '<li><b>'+esc(c.h)+'.</b> '+esc(c.t)+'</li>'}).join('')+'</ul>';
 h+='<h4>Watch out</h4><p>'+esc(w[2])+'</p><div class="row"><button class="btn" id="prgo">Got it, start</button><button class="btn sec" id="prsk">Skip explanation</button></div><p class="small"><button class="lnk" id="proff">Do not show explanations for new topics</button></p></div>';
 m.innerHTML=h;document.body.appendChild(m);
 function done(){m.remove();go()}
 m.addEventListener('click',function(e){var id=e.target&&e.target.id;if(id==='prgo'||id==='prsk'||e.target===m)done();else if(id==='proff'){S.pro.off=1;save();toast('Explanations off. Turn them on again in Me, Settings.');done()}});
 m.addEventListener('keydown',function(e){if(e.key==='Escape')done()});var b=m.querySelector('#prgo');if(b)b.focus()}
startSess=function(o){var t=primerTopic(o);if(!t)return _ssP.apply(this,arguments);var self=this,a=arguments;primerShow(t,function(){_ssP.apply(self,a)})};
