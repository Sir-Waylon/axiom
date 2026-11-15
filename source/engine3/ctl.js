/* Select redesign: short native <select> lists in stations/graph tables become tappable choice chips.
   The real <select> stays in the DOM (hidden) so existing handlers keep working; long lists stay as big native menus. */
(function(){
var busy=0,q=0;
function enh(sel){if(sel.dataset.enh||sel.multiple)return;var o=[].slice.call(sel.options);if(o.length<2||o.length>7||!(sel.dataset.s||sel.dataset.gt))return;
 var lens=o.reduce(function(a,x){return a+x.text.length},0);if(lens>90)return;
 sel.dataset.enh='1';var g=document.createElement('div');g.className='segs';g.setAttribute('role','radiogroup');g.setAttribute('aria-label',sel.getAttribute('aria-label')||(sel.closest('label')&&sel.closest('label').textContent.trim().slice(0,60))||'Choose one');
 o.forEach(function(x,i){if(x.value===''&&i===0&&/^(—|-|choose|select|pick|\.\.\.)/i.test(x.text.trim()))return;var b=document.createElement('button');b.type='button';b.className='seg'+(x.selected&&sel.value===x.value?' on':'');b.setAttribute('role','radio');b.setAttribute('aria-checked',sel.value===x.value?'true':'false');b.textContent=x.text;b.dataset.v=x.value;if(sel.disabled)b.disabled=true;
  b.addEventListener('click',function(){if(sel.disabled)return;sel.value=x.value;sel.dispatchEvent(new Event('input',{bubbles:true}));sel.dispatchEvent(new Event('change',{bubbles:true}));[].forEach.call(g.children,function(c){var on=c.dataset.v===sel.value;c.classList.toggle('on',on);c.setAttribute('aria-checked',on?'true':'false')})});g.appendChild(b)});
 sel.hidden=true;sel.parentNode.insertBefore(g,sel.nextSibling)}
function run(){q=0;if(busy)return;busy=1;try{[].forEach.call(document.querySelectorAll('select[data-s],select[data-gt]'),enh)}finally{busy=0}}
new MutationObserver(function(){if(!q){q=1;(window.requestAnimationFrame||setTimeout)(run)}}).observe(document.documentElement,{childList:true,subtree:true});
run();
})();
