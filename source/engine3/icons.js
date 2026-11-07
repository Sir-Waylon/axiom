/* ===== icon families. Skyvolt: round, open line icons. Axiom: angular icons with a flat tint. Each trainer has its own mark. ===== */
(function(){
var id=(P.meta&&P.meta.id||'').replace(/-20\d\d$/,''),SKY=id==='circuit-lab-b'||id==='meteorology-b',fam=SKY?'sky':'axm';
var T='<path fill="currentColor" fill-opacity=".16" stroke="none" d="';
var SET={
 sky:{learn:'<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>',
  course:'<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
  practice:'<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
  library:'<path d="M4 4h6a2 2 0 012 2v14a2 2 0 00-2-2H4zM20 4h-6a2 2 0 00-2 2v14a2 2 0 012-2h6z"/>',
  me:'<circle cx="12" cy="8" r="4"/><path d="M4 21c1-5 4-7 8-7s7 2 8 7"/>'},
 axm:{learn:T+'M4 5h16v15H4z"/><path d="M4 5h16v15H4zM4 10h16M8 3v4M16 3v4M9 15l2 2 4-4"/>',
  course:T+'M4 20v-6h5v-5h5V4h6v16z"/><path d="M4 20v-6h5v-5h5V4h6v16z"/>',
  practice:T+'M12 3l9 9-9 9-9-9z"/><path d="M12 3l9 9-9 9-9-9zM12 8l4 4-4 4-4-4z"/>',
  library:T+'M5 3h14v18H5z"/><path d="M5 3h14v18H5zM9 3v18M12 8h4M12 12h4"/>',
  me:T+'M4 21l3-6h10l3 6z"/><path d="M12 3l4 4-4 4-4-4zM4 21l3-6h10l3 6z"/>'}};
/* trainer marks (24 grid) */
var MARK={circuit:'<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',meteorology:'<path d="M7 18a4 4 0 010-8 5 5 0 019.5-1A3.5 3.5 0 0117 18z"/><path d="M9 21l1-2M13 21l1-2"/>',
 geometry:'<path d="M3 20L12 4l9 16z"/><path d="M7.5 20a5 5 0 011.2-3.3"/>',apex:'<path d="M2 20L9 6l4 7 3-4 6 11z"/>',
 quanta:'<ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/>'};
var slug=({'circuit-lab-b':'circuit','meteorology-b':'meteorology','geometry-readiness':'geometry','apex-math':'apex','quanta-physics':'quanta'})[id]||'circuit';
window.__fam=fam;document.documentElement.classList.add('fam-'+fam,'tr-'+slug);
var set=SET[fam];Object.keys(set).forEach(function(k){IC[k]=set[k]});IC.mark=MARK[slug];
svgi=function(p,s){return '<svg width="'+(s||24)+'" height="'+(s||24)+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="'+(SKY?2:1.9)+'" stroke-linecap="'+(SKY?'round':'square')+'" stroke-linejoin="'+(SKY?'round':'miter')+'" aria-hidden="true" focusable="false">'+p+'</svg>'};
/* nav, rebuilt with the family icons */
$('nav').innerHTML=TABS.map(function(t){return '<button data-t="'+t[0]+'">'+svgi(IC[t[0]]||IC.learn)+'<span>'+t[1]+'</span></button>'}).join('');
/* header mark */
var lg=document.querySelector('.logo');if(lg){lg.innerHTML=svgi(IC.mark,22).replace('stroke="currentColor"','stroke="#fff"');lg.style.borderRadius=SKY?'10px':'4px';lg.style.transform=SKY?'':'none'}
})();
