/* "Go deeper": optional detailed panel under a lesson card. Data: card.dd = {why, pic, analogy, ways:[[label,text]], ex:{q,steps[]}, trap, tip}.
   Plain-language explanation of the concept, shown several ways. Never required, never graded. */
(function(){
var _d=drawSess;
function sec(h,body){return body?'<div class="ddx"><h4>'+h+'</h4>'+body+'</div>':''}
function para(t){return '<p>'+esc(t)+'</p>'}
function ddHTML(dd){var h='';
 h+=sec('Why it works',dd.why?para(dd.why):'');
 h+=sec('Picture it',dd.pic?para(dd.pic):'');
 h+=sec('Think of it like this',dd.analogy?para(dd.analogy):'');
 if(dd.ways&&dd.ways.length)h+=sec('Another way to see it',dd.ways.map(function(w){return '<p><b>'+esc(w[0])+':</b> '+esc(w[1])+'</p>'}).join(''));
 if(dd.ex&&dd.ex.steps)h+=sec('Worked example','<p><b>'+esc(dd.ex.q||'')+'</b></p><ol>'+dd.ex.steps.map(function(s){return '<li>'+esc(s)+'</li>'}).join('')+'</ol>');
 h+=sec('Watch out',dd.trap?para(dd.trap):'');
 h+=sec('Remember it',dd.tip?para(dd.tip):'');
 return h}
drawSess=function(){_d.apply(this,arguments);try{var z=Z;if(!z||z.fin)return;var st=z.steps[z.i];if(!st||st.k!=='card'||!st.c||!st.c.dd)return;var s=document.getElementById('sess'),card=s&&s.querySelector('.lesson-card');if(!card||card.querySelector('.dd'))return;
 var d=document.createElement('details');d.className='dd';d.innerHTML='<summary>Go deeper <span class="small mute">optional</span></summary><div class="ddb">'+ddHTML(st.c.dd)+'</div>';card.appendChild(d)}catch(e){}};
})();
