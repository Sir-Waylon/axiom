/* ===== Course: unit-by-unit mastery, in the style of a course page. Levels come from real answers: Not started, Attempted, Familiar, Proficient, Mastered. ===== */
(function(){
var CU=window.__cu,LV=['Not started','Attempted','Familiar','Proficient','Mastered'],open={};
function lvl(t){return mastery(t).lv}
function stage(a,t){for(var i=0;i<a.length;i++)if(a[i].t===t)return a[i];return null}
function seg(counts,total){return '<div class="cseg" role="img" aria-label="'+LV.map(function(n,i){return counts[i]+' '+n.toLowerCase()}).join(', ')+'">'+counts.map(function(c,i){return c?'<i class="lv'+i+'" style="width:'+(100*c/total)+'%"></i>':''}).join('')+'</div>'}
window.viewCourse=function(){
 var a=CU&&CU.items(),U=UN.filter(function(u){return TOP[u.id]}),counts=[0,0,0,0,0],pts=0;
 U.forEach(function(u){var l=lvl(u.id);counts[l]++;pts+=l});var T=U.length||1,prof=counts[3]+counts[4],foc=a?CU.focus(a)[0]:null;
 var h='<h2 style="margin-bottom:10px">Course</h2><div class="card cmast"><div class="row"><div style="flex:1"><b>Course mastery</b><div class="small mute">'+prof+' of '+U.length+' units Proficient or Mastered</div></div><div class="cpts" title="Mastery points"><b>'+pts+'</b><small>of '+4*U.length+' pts</small></div></div>'+seg(counts,T)+
  '<div class="clg">'+LV.map(function(n,i){return '<span><i class="lv'+i+'"></i>'+n+' '+counts[i]+'</span>'}).join('')+'</div></div>';
 if(foc)h+='<button class="card cnext" data-co="go:'+foc.t+'"><span class="small mute">Up next for you</span><b>'+esc(TOP[foc.t].name)+'</b></button>';
 h+=U.map(function(u,i){var l=lvl(u.id),us=unitState(u),x=a&&stage(a,u.id),isOpen=open[u.id],lp=100*us.done/Math.max(1,u.lessons.length);
  var chip=x?'<span class="tag">'+({learn:'Learn',practice:'Practice',prove:'Prove it',slip:'Review',keep:'Strong',done:'Done'})[x.back?'practice':x.s]+'</span>':'';
  var body=isOpen?'<div class="cbody"><ul class="clessons">'+u.lessons.map(function(L){var d=us.us.d&&us.us.d[L.id];return '<li><span class="cck'+(d?' on':'')+'" aria-hidden="true">'+(d?'✓':'')+'</span><span style="flex:1">'+esc(L.title)+'</span><button class="btn sec sm" data-ls="'+u.id+'|'+L.id+'">'+(d?'Redo':'Start')+'</button></li>'}).join('')+'</ul><div class="row"><button class="btn sm" data-co="prac:'+u.id+'">Practice</button><button class="btn sec sm" data-co="test:'+u.id+'"'+(us.all?'':' disabled')+'>Unit test</button></div>'+(us.all?'':'<div class="small mute">Finish the lessons to unlock the unit test.</div>')+'</div>':'';
  return '<div class="card cunit"><button class="chead" data-co="tog:'+u.id+'" aria-expanded="'+!!isOpen+'"><span class="cnum">'+(i+1)+'</span><span style="flex:1;min-width:0;text-align:left"><b>'+esc(u.title)+'</b><span class="cpips" aria-label="'+LV[l]+'">'+[1,2,3,4].map(function(k){return '<em class="'+(l>=k?'on lv'+l:'')+'"></em>'}).join('')+'<small>'+LV[l]+'</small></span></span>'+chip+'</button><div class="cprog" role="img" aria-label="'+us.done+' of '+u.lessons.length+' lessons done"><i style="width:'+lp+'%"></i></div><div class="small mute">'+us.done+'/'+u.lessons.length+' lessons'+(us.pass?' · unit test passed':'')+'</div>'+body+'</div>'}).join('');
 return h};
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-co]');if(!b)return;var k=b.dataset.co.split(':'),id=k[1];
 if(k[0]==='tog'){open[id]=!open[id];route()}else if(k[0]==='prac')startPractice([id],12);else if(k[0]==='test'){if(!b.disabled)startUnitTest(id)}
 else if(k[0]==='go'){var u=UN.filter(function(x){return x.id===id})[0];if(u){var us=unitState(u),L=u.lessons.filter(function(l){return !(us.us.d&&us.us.d[l.id])})[0];if(L&&!(CU.items().filter(function(x){return x.t===id})[0]||{}).back)startLesson(id,L.id);else startPractice([id],12)}}});
})();
