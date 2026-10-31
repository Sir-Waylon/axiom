/* ===== references to the study notes inside explanations ===== */
(function(){
var _c=clz;clz=function(t,live){if(t.indexOf('Notes|')===0){var p=t.split('|');return '<button class="btn sec sm" data-note="'+esc(p[1])+'">Open notes: '+esc(p[2])+'</button>'}if(t.indexOf('From your notes')===0)return '<span class="nq">'+esc(t)+'</span>';return _c(t,live)};
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-note]');if(!b)return;var id=b.dataset.note;if(typeof Z!=='undefined'&&Z)closeSess();sub.lib='notes';go('library');setTimeout(function(){var d=document.getElementById('n-'+id);if(d){d.open=true;d.scrollIntoView({behavior:'smooth',block:'start'})}},60)});
})();
