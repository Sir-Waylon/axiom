/* ===== math.js: renders LaTeX with KaTeX wherever it appears =====
   KaTeX (jsDelivr, version-pinned) is injected here after the page has loaded, so a slow or blocked CDN can never delay first paint or DOMContentLoaded.
   This file watches the page and typesets new text as screens change. Delimiters: \( ... \)  \[ ... \]  $$ ... $$
   (single $ is NOT a delimiter, because the questions use $ for money). If KaTeX is blocked or offline the plain text stays. */
(function(){
var DEL=[{left:'$$',right:'$$',display:true},{left:'\\[',right:'\\]',display:true},{left:'\\(',right:'\\)',display:false}];
var OPT={delimiters:DEL,throwOnError:false,strict:'ignore',ignoredTags:['script','noscript','style','textarea','pre','code','option','input'],ignoredClasses:['katex','nomath'],trust:false};
var queue=[],busy=false,obs=null;
function has(t){return t.indexOf('\\(')>-1||t.indexOf('\\[')>-1||t.indexOf('$$')>-1}
function ready(){return typeof window.renderMathInElement==='function'&&window.katex}
function flush(){busy=false;if(!ready()){queue=[];return}var items=queue;queue=[];if(obs)obs.disconnect();
 try{items.forEach(function(n){if(n.isConnected&&has(n.textContent||''))window.renderMathInElement(n,OPT)})}catch(e){}
 if(obs)obs.observe(document.body,{childList:true,subtree:true,characterData:true})}
function sched(n){if(n.nodeType===3)n=n.parentNode;if(!n||n.nodeType!==1)return;if(queue.indexOf(n)<0)queue.push(n);if(!busy){busy=true;(window.requestAnimationFrame||setTimeout)(flush)}}
var CDN='https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/';
function load(){if(window.katex||document.getElementById('katexcss'))return;
 var l=document.createElement('link');l.rel='stylesheet';l.id='katexcss';l.href=CDN+'katex.min.css';l.crossOrigin='anonymous';document.head.appendChild(l);
 var a=document.createElement('script');a.async=true;a.crossOrigin='anonymous';a.src=CDN+'katex.min.js';
 a.onload=function(){var b=document.createElement('script');b.async=true;b.crossOrigin='anonymous';b.src=CDN+'contrib/auto-render.min.js';document.head.appendChild(b)};
 document.head.appendChild(a)}
function start(){if(document.readyState==='complete')setTimeout(load,0);else window.addEventListener('load',function(){setTimeout(load,0)});
 obs=new MutationObserver(function(ms){if(!ready())return;ms.forEach(function(m){if(m.type==='characterData')sched(m.target);else m.addedNodes.forEach(sched)})});
 obs.observe(document.body,{childList:true,subtree:true,characterData:true});
 var tries=0,iv=setInterval(function(){tries++;if(ready()){clearInterval(iv);sched(document.body)}else if(tries>60)clearInterval(iv)},250)}
window.typeset=function(el){sched(el||document.body)};
if(document.body)start();else document.addEventListener('DOMContentLoaded',start)})();
