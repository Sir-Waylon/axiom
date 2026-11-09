/* ===== Educator / developer access =====
   An access code (not shown anywhere in this repository; only its salted hash is) turns on tools for teachers and the developer:
   skip the placement check, preview every learning plan, unlock every cosmetic, add coins. It changes this device's saved progress only.
   It is a convenience, not a security boundary, and it is clearly labelled while it is on. */
(function(){
var SALT='voltaxis-dev-v1',HASH='4aa5032ac37d0ba62b88bad4a14c03b8f00b5011379373603ac82fc106a111ae';
var K256=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
function sha256(str){var b=[],i,j;for(i=0;i<str.length;i++){var c=str.charCodeAt(i);if(c<128)b.push(c);else if(c<2048)b.push(192|c>>6,128|c&63);else b.push(224|c>>12,128|(c>>6)&63,128|c&63)}
 var l=b.length*8;b.push(128);while(b.length%64!==56)b.push(0);for(i=7;i>=0;i--)b.push(i>3?0:(l>>>(i*8))&255);
 var H=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19],W=new Array(64);
 var rr=function(x,n){return(x>>>n)|(x<<(32-n))};
 for(var o=0;o<b.length;o+=64){for(i=0;i<16;i++)W[i]=(b[o+i*4]<<24)|(b[o+i*4+1]<<16)|(b[o+i*4+2]<<8)|b[o+i*4+3];
  for(i=16;i<64;i++){var s0=rr(W[i-15],7)^rr(W[i-15],18)^(W[i-15]>>>3),s1=rr(W[i-2],17)^rr(W[i-2],19)^(W[i-2]>>>10);W[i]=(W[i-16]+s0+W[i-7]+s1)|0}
  var a=H[0],bb=H[1],cc=H[2],d=H[3],e=H[4],f=H[5],g=H[6],h=H[7];
  for(i=0;i<64;i++){var S1=rr(e,6)^rr(e,11)^rr(e,25),ch=(e&f)^(~e&g),t1=(h+S1+ch+K256[i]+W[i])|0,S0=rr(a,2)^rr(a,13)^rr(a,22),mj=(a&bb)^(a&cc)^(bb&cc),t2=(S0+mj)|0;h=g;g=f;f=e;e=(d+t1)|0;d=cc;cc=bb;bb=a;a=(t1+t2)|0}
  H[0]=(H[0]+a)|0;H[1]=(H[1]+bb)|0;H[2]=(H[2]+cc)|0;H[3]=(H[3]+d)|0;H[4]=(H[4]+e)|0;H[5]=(H[5]+f)|0;H[6]=(H[6]+g)|0;H[7]=(H[7]+h)|0}
 return H.map(function(x){return('00000000'+(x>>>0).toString(16)).slice(-8)}).join('')}
var tries=0,lock=0;
function allCos(){return AV.concat(AC,TH,TI).map(function(x){return x[0]})}
function tn(t){var x=P.topics.filter(function(y){return y.id===t})[0];return x?x.name:t}
function mkCu(kind){var base={},n0={},sk={},i=0;UN.forEach(function(u){var t=u.id;if(!TOP[t])return;base[t]=kind==='found'?'n':kind==='acc'?'s':['n','f','s'][i%3];i++;n0[t]=(S.stat[t]||[0,0])[1]});return{made:today(),base:base,n0:n0,sk:sk}}
var KINDS=[['found','Foundation builder','Most topics start from the basics'],['gap','Gap closer','A mix of strong and shaky topics'],['acc','Accelerator','Most topics already strong']];
function preview(kind){var saved=S.cu;S.cu=mkCu(kind);var out;try{var a=window.__cu.items(),f=window.__cu.focus(a);out={n:f.length,first:f.slice(0,8).map(function(x){return tn(x.t)+' ('+(x.back?'back up':x.s)+')'})}}catch(e){out={n:0,first:['(preview unavailable)']}}S.cu=saved;return out}
function applyKind(kind){S.dg=today();S.dgr=S.dgr||{};S.cu=mkCu(kind);save();route()}
function on(){S.dev=1;save();chip();route()}
function off(){lockCos();if(S.devCoins){S.coins=Math.max(0,(S.coins||0)-S.devCoins);S.devCoins=0}S.dev=0;save();chip();route()}
function giveCos(){S.devOwn=S.devOwn||[];allCos().forEach(function(id){if(!S.cos.own[id]){S.cos.own[id]=1;S.devOwn.push(id)}});save();route()}
function lockCos(){(S.devOwn||[]).forEach(function(id){delete S.cos.own[id];var o=S.cos.on;Object.keys(o).forEach(function(k){if(o[k]===id)o[k]=({av:'a0',th:'t0',ti:'i0',ac:'c0'})[k]})});S.devOwn=[];save()}
function chip(){var c=document.getElementById('devchip');if(S.dev&&!c){c=document.createElement('button');c.id='devchip';c.className='devchip';c.setAttribute('data-nav','me:dev');c.textContent='DEV MODE';c.title='Educator access is on. Tap for tools.';document.body.appendChild(c)}else if(!S.dev&&c)c.remove()}
function view(){
 var back='<div class="crumb"><button class="back" data-back="me" aria-label="Back to Me"><span>Me</span></button><h2>Educator access</h2></div>';
 if(!S.dev)return back+'<div class="card"><p class="small">For teachers and the developer. Enter the access code to skip the placement check, preview learning plans and unlock looks. It only changes progress saved on this device.</p><label class="small" for="devk">Access code</label><div class="row" style="margin-top:6px"><input id="devk" type="password" autocomplete="off" autocapitalize="characters" spellcheck="false" style="flex:1;min-width:0;font:16px ui-monospace,monospace;padding:10px;border-radius:10px;border:1px solid var(--line,#d5d9e6);background:var(--card,#fff);color:inherit" placeholder="XX-XXXX-XXXX-XXXX-XXXX"><button class="btn" data-dev="unlock">Unlock</button></div><p class="small" id="devmsg" role="status" aria-live="polite" style="min-height:1.2em"></p></div>';
 var h=back+'<div class="card"><b>Educator access is on.</b><p class="small mute">Changes below affect this device only and are labelled with a DEV MODE badge. Turning it off takes back the coins and looks it added.</p><button class="btn sec sm" data-dev="off">Turn off</button></div>';
 h+='<div class="card"><h3>Skip the placement check</h3><p class="small mute">Pick the learning category you want to be placed in.</p><div class="row" style="flex-wrap:wrap;gap:8px">'+KINDS.map(function(k){return '<button class="btn sm" data-dev="skip:'+k[0]+'">'+k[1]+'</button>'}).join('')+'<button class="btn sec sm" data-dev="redo">Reset: make me take it again</button></div></div>';
 h+='<div class="card"><h3>Preview every learning plan</h3><p class="small mute">First steps each category would get from a fresh start. Your own plan is not changed.</p>'+KINDS.map(function(k){var p=preview(k[0]);return '<details class="gex"><summary><b>'+k[1]+'</b> · '+p.n+' topics to work on</summary><ol class="small" style="margin:6px 0 6px 18px">'+p.first.map(function(x){return '<li>'+esc(x)+'</li>'}).join('')+'</ol><button class="btn sec sm" data-dev="skip:'+k[0]+'">Use this plan</button></details>'}).join('')+'</div>';
 h+='<div class="card"><h3>Looks and coins</h3><div class="row" style="flex-wrap:wrap;gap:8px"><button class="btn sm" data-dev="cos">Unlock every cosmetic</button><button class="btn sec sm" data-dev="lock">Take them back</button><button class="btn sm" data-dev="coins">+10,000 coins</button></div><p class="small mute">You own '+Object.keys(S.cos.own).length+' of '+allCos().length+' looks and have '+(S.coins||0)+' coins.</p></div>';
 return h}
var _vm=viewMe;viewMe=function(){if(window.__V&&window.__V.me==='dev')return view();return _vm.apply(this,arguments)};
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-dev]');if(!b)return;var a=b.dataset.dev.split(':')[0],arg=b.dataset.dev.split(':')[1];
 if(a==='unlock'){var m=document.getElementById('devmsg'),k=(document.getElementById('devk').value||'').trim().toUpperCase();if(Date.now()<lock){m.textContent='Too many tries. Wait a moment.';return}
  if(sha256(SALT+k)===HASH){tries=0;on()}else{tries++;if(tries>=5){lock=Date.now()+30000;tries=0}m.textContent='Code not recognised.'}}
 else if(a==='off')off();else if(a==='skip')applyKind(arg);else if(a==='redo'){S.dg=null;S.dgr=null;S.cu=null;save();route()}
 else if(a==='cos')giveCos();else if(a==='lock'){lockCos();route()}else if(a==='coins'){S.coins=(S.coins||0)+10000;S.devCoins=(S.devCoins||0)+10000;save();route()}});
document.addEventListener('keydown',function(e){if(e.key==='Enter'&&e.target&&e.target.id==='devk'){var b=document.querySelector('[data-dev="unlock"]');b&&b.click()}});
var _r=route;route=function(){var r=_r.apply(this,arguments);chip();return r};
window.__sha256=sha256;chip();
})();
