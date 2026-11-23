/* CSP helper: the Content-Security-Policy forbids inline style="" attributes and inline <style> elements.
   This keeps pages that build HTML strings working: style attributes in HTML inserted with innerHTML,
   outerHTML or insertAdjacentHTML are moved into data-cs and applied through the CSSOM (el.style), which CSP allows.
   It also sends plain-HTTP visits (not localhost) to HTTPS so passwords are never typed on an unencrypted page. */
(function(){
try{var L=location;if(L.protocol==='http:'&&!/^(localhost|127\.|\[::1\]|.*\.localhost)/.test(L.hostname))L.replace('https://'+L.host+L.pathname+L.search+L.hash)}catch(e){}
var TAG=/<[a-zA-Z][^\s>\/]*(?:"[^"]*"|'[^']*'|[^>"'])*>/g,ATT=/(\s)style\s*=\s*(?:"([^"]*)"|'([^']*)')/i;
function strip(h){return h.replace(TAG,function(t){return t.indexOf('style')<0?t:t.replace(ATT,function(m,sp,a,b){return sp+'data-cs="'+(a!==undefined?a:(b||'').replace(/"/g,'&quot;'))+'"'})})}
function fix(r){if(!r)return;var n=r.nodeType;if(n!==1&&n!==11)return;if(n===1&&r.hasAttribute('data-cs'))one(r);var l=r.querySelectorAll('[data-cs]');for(var i=0;i<l.length;i++)one(l[i])}
function one(e){var v=e.getAttribute('data-cs');e.removeAttribute('data-cs');try{e.style.cssText=v}catch(x){}}
function wrap(name){var d=Object.getOwnPropertyDescriptor(Element.prototype,name);if(!d||!d.set)return;
 Object.defineProperty(Element.prototype,name,{configurable:true,enumerable:d.enumerable,get:d.get,set:function(v){var s=String(v);if(s.indexOf('style')<0){d.set.call(this,v);return}
  var p=name==='outerHTML'?this.parentNode:null;d.set.call(this,strip(s));fix(name==='outerHTML'?p:(this.content||this))}})}
wrap('innerHTML');wrap('outerHTML');
var ia=Element.prototype.insertAdjacentHTML;
Element.prototype.insertAdjacentHTML=function(w,h){var s=String(h);if(s.indexOf('style')<0)return ia.call(this,w,h);ia.call(this,w,strip(s));fix(w==='afterbegin'||w==='beforeend'?this:(this.parentNode||this))};
document.addEventListener('DOMContentLoaded',function(){fix(document.documentElement)});
})();
