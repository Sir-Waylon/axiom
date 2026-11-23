/* ===== math.js: renders LaTeX with KaTeX wherever it appears =====
   KaTeX (self-hosted at /app/katex/, v0.16.47) is injected here after the page has loaded, so a slow or blocked CDN can never delay first paint or DOMContentLoaded.
   This file watches the page and typesets new text as screens change. Delimiters: \( ... \)  \[ ... \]  $$ ... $$
   (single $ is NOT a delimiter, because the questions use $ for money). If KaTeX is blocked or offline, readable plain text is shown instead (see plainTeX below), so no screen ever shows raw LaTeX or goes blank. */
(function(){
var DEL=[{left:'$$',right:'$$',display:true},{left:'\\[',right:'\\]',display:true},{left:'\\(',right:'\\)',display:false}];
var OPT={delimiters:DEL,throwOnError:false,strict:'ignore',ignoredTags:['script','noscript','style','textarea','pre','code','option','input'],ignoredClasses:['katex','nomath'],trust:false};
var queue=[],busy=false,obs=null;
function has(t){return t.indexOf('\\(')>-1||t.indexOf('\\[')>-1||t.indexOf('$$')>-1}
function ready(){return typeof window.renderMathInElement==='function'&&window.katex}
function flush(){busy=false;if(!ready()&&!FB){queue=[];return}var items=queue;queue=[];if(obs)obs.disconnect();
 try{items.forEach(function(n){if(!n.isConnected||!has(n.textContent||''))return;if(ready())window.renderMathInElement(n,OPT);else fbNode(n)})}catch(e){}
 if(obs)obs.observe(document.body,{childList:true,subtree:true,characterData:true})}
function sched(n){if(n.nodeType===3)n=n.parentNode;if(!n||n.nodeType!==1)return;if(queue.indexOf(n)<0)queue.push(n);if(!busy){busy=true;(window.requestAnimationFrame||setTimeout)(flush)}}

/* ---- offline fallback: turn LaTeX into readable Unicode text when KaTeX cannot load ---- */
var FB=false,SUP={'0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹','+':'⁺','-':'⁻','−':'⁻','=':'⁼','(':'⁽',')':'⁾','n':'ⁿ','i':'ⁱ','x':'ˣ','y':'ʸ','a':'ᵃ','b':'ᵇ','c':'ᶜ','d':'ᵈ','e':'ᵉ','k':'ᵏ','m':'ᵐ','t':'ᵗ'},SUB={'0':'₀','1':'₁','2':'₂','3':'₃','4':'₄','5':'₅','6':'₆','7':'₇','8':'₈','9':'₉','+':'₊','-':'₋','=':'₌','(':'₍',')':'₎','a':'ₐ','e':'ₑ','i':'ᵢ','n':'ₙ','x':'ₓ','o':'ₒ','t':'ₜ'};
var SYM={cdot:'·',times:'×',div:'÷',pm:'±',mp:'∓',le:'≤',leq:'≤',ge:'≥',geq:'≥',ne:'≠',neq:'≠',approx:'≈',infty:'∞',to:'→',rightarrow:'→',leftarrow:'←',Rightarrow:'⇒',Leftrightarrow:'⇔',leftrightarrow:'↔',sum:'Σ',int:'∫',circ:'°',ldots:'…',cdots:'⋯',degree:'°',angle:'∠',triangle:'△',perp:'⊥',parallel:'∥',propto:'∝',in:'∈',cup:'∪',cap:'∩',subset:'⊂',forall:'∀',exists:'∃',therefore:'∴',partial:'∂',nabla:'∇',prime:'′',Omega:'Ω',omega:'ω',Delta:'Δ',delta:'δ',alpha:'α',beta:'β',gamma:'γ',Gamma:'Γ',theta:'θ',Theta:'Θ',lambda:'λ',mu:'μ',pi:'π',Pi:'Π',rho:'ρ',sigma:'σ',Sigma:'Σ',tau:'τ',phi:'φ',Phi:'Φ',psi:'ψ',epsilon:'ε',varepsilon:'ε',eta:'η',kappa:'κ',nu:'ν',xi:'ξ',zeta:'ζ',chi:'χ',quad:' ',qquad:'  '};
function grp(t,i){var d=0,j=i;for(;j<t.length;j++){if(t[j]==='{')d++;else if(t[j]==='}'){d--;if(!d)return j}}return -1}
function sc(map,w){var o='';for(var k=0;k<w.length;k++){if(!map[w[k]])return null;o+=map[w[k]]}return o}
function plainTeX(t){var guard=0;
 t=t.replace(/\\(left|right|displaystyle|textstyle|big|Big|bigg)\b/g,'').replace(/\\([,;:! ])/g,' ');
 for(;guard<40;guard++){var m=/\\(d|t)?frac\s*\{/.exec(t);if(!m)break;var a=m.index+m[0].length-1,e=grp(t,a);if(e<0)break;var f=e+1;while(t[f]===' ')f++;if(t[f]!=='{')break;var e2=grp(t,f);if(e2<0)break;
  var n=t.slice(a+1,e),d=t.slice(f+1,e2);t=t.slice(0,m.index)+(/^[\w.]+$/.test(n)?n:'('+n+')')+'/'+(/^[\w.]+$/.test(d)?d:'('+d+')')+t.slice(e2+1)}
 for(guard=0;guard<40;guard++){var q=/\\sqrt(\[(\d+)\])?\s*\{/.exec(t);if(!q)break;var a2=q.index+q[0].length-1,e3=grp(t,a2);if(e3<0)break;var inner=t.slice(a2+1,e3),root=q[2]==='3'?'∛':q[2]==='4'?'∜':'√';t=t.slice(0,q.index)+root+(/^[\w.]+$/.test(inner)?inner:'('+inner+')')+t.slice(e3+1)}
 t=t.replace(/\\(text|mathrm|mathbf|textbf|operatorname|mathit|mathbb)\s*\{([^{}]*)\}/g,'$2').replace(/\\vec\s*\{([^{}]*)\}/g,'$1⃗').replace(/\\(hat)\s*\{([^{}]*)\}/g,'$2̂').replace(/\\(overline|bar)\s*\{([^{}]*)\}/g,'$2̄');
 t=t.replace(/\^\s*\{([^{}]*)\}/g,function(_,w){return sc(SUP,w)||'^('+w+')'}).replace(/\^\s*([0-9a-z+\-])/gi,function(_,w){return SUP[w]||'^'+w});
 t=t.replace(/_\s*\{([^{}]*)\}/g,function(_,w){return sc(SUB,w)||'_('+w+')'}).replace(/_\s*([0-9a-z])/gi,function(_,w){return SUB[w]||'_'+w});
 t=t.replace(/\\([A-Za-z]+)/g,function(_,w){return SYM[w]!==undefined?SYM[w]:w}).replace(/[{}]/g,'').replace(/\s{2,}/g,' ');return t.trim()}
function fbNode(n){var w=document.createTreeWalker(n,NodeFilter.SHOW_TEXT,{acceptNode:function(x){var p=x.parentNode;return p&&!/^(SCRIPT|STYLE|TEXTAREA|CODE|PRE|OPTION)$/.test(p.nodeName)&&has(x.nodeValue)?1:3}}),L=[],x;while((x=w.nextNode()))L.push(x);
 L.forEach(function(x){x.nodeValue=x.nodeValue.replace(/\$\$([\s\S]+?)\$\$/g,function(_,a){return plainTeX(a)}).replace(/\\\[([\s\S]+?)\\\]/g,function(_,a){return plainTeX(a)}).replace(/\\\(([\s\S]+?)\\\)/g,function(_,a){return plainTeX(a)})})}
window.plainTeX=plainTeX;
var CDN='../katex/';
function load(){if(window.katex||document.getElementById('katexcss'))return;
 var l=document.createElement('link');l.rel='stylesheet';l.id='katexcss';l.href=CDN+'katex.min.css';document.head.appendChild(l);
 var a=document.createElement('script');a.async=true;a.src=CDN+'katex.min.js';
 a.onerror=function(){FB=true;sched(document.body)};a.onload=function(){var b=document.createElement('script');b.async=true;b.src=CDN+'contrib/auto-render.min.js';document.head.appendChild(b)};
 document.head.appendChild(a)}
function start(){if(document.readyState==='complete')setTimeout(load,0);else window.addEventListener('load',function(){setTimeout(load,0)});
 obs=new MutationObserver(function(ms){if(!ready()&&!FB)return;ms.forEach(function(m){if(m.type==='characterData')sched(m.target);else m.addedNodes.forEach(sched)})});
 obs.observe(document.body,{childList:true,subtree:true,characterData:true});
 var tries=0,iv=setInterval(function(){tries++;if(ready()){clearInterval(iv);sched(document.body)}else if(tries>24){clearInterval(iv);FB=true;sched(document.body)}},250)}
window.typeset=function(el){sched(el||document.body)};
if(document.body)start();else document.addEventListener('DOMContentLoaded',start)})();
