/* Printable cheat sheets: formula sheet, all notes, flashcards, test-day checklist. Uses the browser's Print / Save as PDF. */
(function(){
var CSS='#prt{position:fixed;inset:0;z-index:90;background:#fff;color:#111;overflow-y:auto;font:14px/1.45 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}'
+'#prt .pbar{position:sticky;top:0;z-index:2;background:#f4f3ff;border-bottom:1px solid #d9d6ff;display:flex;flex-wrap:wrap;gap:8px;align-items:center;padding:10px 14px}'
+'#prt .pbar label{display:inline-flex;gap:6px;align-items:center;min-height:36px;font-weight:600}#prt .pbar button{min-height:44px;padding:0 16px;border-radius:10px;border:1px solid #5b4bff;background:#5b4bff;color:#fff;font:inherit;font-weight:700;cursor:pointer}#prt .pbar button.sec{background:#fff;color:#5b4bff}'
+'#prt .pg{max-width:8in;margin:14px auto;padding:.5in;background:#fff;border:1px solid #ddd;box-sizing:border-box}'
+'#prt h1{font-size:20px;margin:0 0 2px}#prt h2{font-size:15px;margin:14px 0 6px;border-bottom:2px solid #111;padding-bottom:2px}#prt h3{font-size:13px;margin:10px 0 3px}'
+'#prt .sub{color:#444;font-size:12px;margin-bottom:8px}#prt .fl{columns:2;column-gap:.3in}#prt .fl>div{break-inside:avoid;border:1px solid #888;border-radius:6px;padding:4px 8px;margin:0 0 6px;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:12.5px}'
+'#prt table{border-collapse:collapse;width:100%;font-size:12.5px;break-inside:avoid}#prt td,#prt th{border:1px solid #888;padding:3px 6px;text-align:left;vertical-align:top}#prt th{background:#eee}'
+'#prt .cd{display:grid;grid-template-columns:1fr 1fr;gap:0}#prt .cd div{border:1px dashed #777;padding:8px;min-height:46px;break-inside:avoid}#prt .cd b{display:block;font-size:13px}'
+'#prt .nt .card,#prt .nt details{border:0!important;background:none!important;box-shadow:none!important;padding:0!important;margin:4px 0!important}#prt .nt .f{display:block;font-family:ui-monospace,Menlo,Consolas,monospace;border:1px solid #888;border-radius:6px;padding:3px 8px;margin:3px 0}'
+'#prt .ck li{list-style:"☐  ";margin:3px 0}#prt .ft{margin-top:10px;font-size:10.5px;color:#555;border-top:1px solid #aaa;padding-top:4px}'
+'@media print{body>*:not(#prt){display:none!important}#prt{position:static!important;overflow:visible!important;inset:auto!important}#prt .pbar{display:none!important}#prt .pg{border:0;margin:0;padding:0;max-width:none;break-after:page}#prt .pg:last-child{break-after:auto}@page{size:letter;margin:.5in}*{-webkit-print-color-adjust:exact;print-color-adjust:exact}}';
try{var sh=new CSSStyleSheet();sh.replaceSync(CSS);document.adoptedStyleSheets=(document.adoptedStyleSheets||[]).concat([sh])}catch(e){var st=document.createElement('style');st.textContent=CSS;document.head.appendChild(st)}
function E(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function head(t){return '<h1>'+E(P.meta.title)+' '+E(P.meta.division||'')+'</h1><div class="sub">'+t+' · Voltaxis study kit · printed '+new Date().toLocaleDateString()+'</div>'}
var FT='<div class="ft">Check the official rules and your event supervisor for what is allowed in the room. Study aid only; not an official rules document.</div>';
function formulas(){var seen={},out=[];P.notes.forEach(function(n){var d=new DOMParser().parseFromString('<div>'+n.html+'</div>','text/html');d.querySelectorAll('.f').forEach(function(f){var t=f.textContent.trim().replace(/\s+/g,' ');if(t&&!seen[t]){seen[t]=1;out.push([n.title,t])}})});
 var g={},ord=[];out.forEach(function(o){if(!g[o[0]]){g[o[0]]=[];ord.push(o[0])}g[o[0]].push(o[1])});
 if(!ord.length){var secs=[];P.notes.forEach(function(n){var d=new DOMParser().parseFromString('<div>'+n.html+'</div>','text/html');d.querySelectorAll('h4').forEach(function(h){var ul=h.nextElementSibling;if(ul&&ul.tagName==='UL')secs.push([h.textContent,[].map.call(ul.children,function(li){return li.textContent.trim()})])})});
  return'<div class="pg nt">'+head('Key facts sheet')+(secs.length?secs.map(function(x){return'<h2>'+E(x[0])+'</h2><ul style="margin:0 0 4px 16px;padding:0;font-size:12.5px">'+x[1].map(function(t){return'<li>'+E(t)+'</li>'}).join('')+'</ul>'}).join(''):'<p>Use the all-notes sheet.</p>')+FT+'</div>'}
 return'<div class="pg">'+head('Formula and fact sheet (one page)')+ord.map(function(k){return'<h2>'+E(k)+'</h2><div class="fl">'+g[k].map(function(t){return'<div>'+E(t)+'</div>'}).join('')+'</div>'}).join('')+FT+'</div>'}
function notes(){return'<div class="pg nt">'+head('Study notes')+P.notes.map(function(n){return'<h2>'+E(n.title)+'</h2>'+n.html}).join('')+FT+'</div>'}
function cards(){if(!P.cards||!P.cards.length)return'';return'<div class="pg">'+head('Flashcards: fold or cut along the dashed lines')+'<div class="cd">'+P.cards.map(function(c){return'<div><b>'+E(c[0])+'</b>'+E(c[1])+'</div>'}).join('')+'</div>'+FT+'</div>'}
function plan(){var h='<div class="pg">'+head('Test-day checklist and bench tips');
 if(P.checklist&&P.checklist.length)h+='<h2>Pack and check</h2><ul class="ck">'+P.checklist.map(function(c){return'<li>'+E(Array.isArray(c)?c.join(': '):typeof c==='object'?(c.t||c.text||JSON.stringify(c)):c)+'</li>'}).join('')+'</ul>';
 if(P.bench&&P.bench.length)h+='<h2>Hands-on stations</h2><table><tr><th>Station</th><th>Method</th></tr>'+P.bench.map(function(b){return'<tr><td>'+E(b[0])+'</td><td>'+b[1]+'</td></tr>'}).join('')+'</table>';
 if(P.safety&&P.safety.length)h+='<h2>Safety</h2><ul>'+P.safety.map(function(s){return'<li>'+E(Array.isArray(s)?s.join(': '):s)+'</li>'}).join('')+'</ul>';
 return h+FT+'</div>'}
var SEL={f:1,n:0,c:0,p:0};
function build(){var o=document.getElementById('prt');if(!o)return;var b=o.querySelector('.body');b.innerHTML=(SEL.f?formulas():'')+(SEL.n?notes():'')+(SEL.c?cards():'')+(SEL.p?plan():'')||'<div class="pg">Pick a sheet above.</div>'}
function open(){close();var o=document.createElement('div');o.id='prt';o.setAttribute('role','dialog');o.setAttribute('aria-label','Printable cheat sheets');
 o.innerHTML='<div class="pbar"><button class="sec" id="prx">Close</button><label><input type="checkbox" data-s="f"'+(SEL.f?' checked':'')+'> Formula sheet</label><label><input type="checkbox" data-s="n"'+(SEL.n?' checked':'')+'> All notes</label><label><input type="checkbox" data-s="c"'+(SEL.c?' checked':'')+'> Flashcards</label><label><input type="checkbox" data-s="p"'+(SEL.p?' checked':'')+'> Checklist and stations</label><span style="flex:1"></span><button id="prp">Print or save as PDF</button></div><div class="body"></div>';
 document.body.appendChild(o);build();var x=document.getElementById('prx');if(x)x.focus()}
function close(){var o=document.getElementById('prt');if(o)o.remove()}
document.addEventListener('click',function(e){var t=e.target;if(!t.closest)return;
 if(t.closest('[data-nav="act:print"]')){e.stopPropagation();open();return}
 if(t.id==='prx'){close();return}if(t.id==='prp'){window.print();return}},true);
document.addEventListener('change',function(e){var t=e.target;if(t.dataset&&t.dataset.s&&t.closest('#prt')){SEL[t.dataset.s]=t.checked?1:0;build()}});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&document.getElementById('prt'))close()});
})();
