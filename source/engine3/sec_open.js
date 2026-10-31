/* Open-mode storage: no passcode. Tamper-EVIDENT checksum (casual edits are discarded), not tamper-proof. */
var __SEC=(function(){
var K='scioly:'+__PACK_ID__, SALT='cl|'+__PACK_ID__+'|v1';
function h(s){var a=0x811c9dc5,b=0x1b873593;for(var i=0;i<s.length;i++){var c=s.charCodeAt(i);a^=c;a=Math.imul(a,16777619);b=Math.imul(b^c,2246822519);b^=b>>>13}return (a>>>0).toString(36)+(b>>>0).toString(36)}
function sig(s){return h(SALT+s+SALT.split('').reverse().join(''))}
function b64(s){return btoa(unescape(encodeURIComponent(s)))}
function ub64(s){return decodeURIComponent(escape(atob(s)))}
function wrap(s){return JSON.stringify({d:s,h:sig(s)})}
function unwrap(t){var o=JSON.parse(t);if(!o||typeof o.d!=='string'||o.h!==sig(o.d))throw 0;return o.d}
var st=null;try{var r=localStorage.getItem(K);if(r)st=JSON.parse(unwrap(r))}catch(e){st=null}
return{state:st,
save:function(s){try{localStorage.setItem(K,wrap(s))}catch(e){}},
clear:function(){try{localStorage.removeItem(K)}catch(e){}},
pack:function(s){return Promise.resolve('CL1.'+b64(wrap(s)))},
unpack:function(t){return new Promise(function(ok,no){try{if(t.indexOf('CL1.')!==0)throw 0;ok(JSON.parse(unwrap(ub64(t.slice(4)))))}catch(e){no()}})},
share:function(o){return Promise.resolve('FR1.'+b64(wrap(JSON.stringify(o))))},
open:function(t){return new Promise(function(ok,no){try{t=t.trim();if(t.indexOf('FR1.')!==0)throw 0;ok(JSON.parse(unwrap(ub64(t.slice(4)))))}catch(e){no()}})},
forget:function(){}}})();
