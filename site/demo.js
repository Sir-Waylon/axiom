(function(){"use strict";var NS="http://www.w3.org/2000/svg";
function E(t,a,p,x){var e=document.createElementNS(NS,t);for(var k in a)e.setAttribute(k,a[k]);if(x!=null)e.textContent=x;if(p)p.appendChild(e);return e}
function H(t,a,p,x){var e=document.createElement(t);for(var k in a)e.setAttribute(k,a[k]);if(x!=null)e.textContent=x;if(p)p.appendChild(e);return e}
var W=320,Hh=170;
function lin(g,x1,y1,x2,y2,c,w){return E("line",{x1:x1,y1:y1,x2:x2,y2:y2,stroke:c||"currentColor","stroke-width":w||2,"stroke-linecap":"round"},g)}
function tx(g,x,y,s,a,sz){return E("text",{x:x,y:y,"text-anchor":a||"middle","font-size":sz||12,fill:"currentColor"},g,s)}
var D={
ohm:{s:[["V","Battery voltage","V",1,24,1,12],["R","Resistance","Ω",10,200,10,60]],f:function(v){var I=v.V/v.R;return{o:[["Current",(I*1000).toFixed(0)+" mA"],["Power",(v.V*I).toFixed(2)+" W"]],d:function(g){
 E("rect",{x:20,y:50,width:30,height:70,rx:4,fill:"none",stroke:"currentColor","stroke-width":2},g);tx(g,35,90,v.V+" V");lin(g,35,50,35,30);lin(g,35,30,285,30);lin(g,285,30,285,60);lin(g,285,110,285,140);lin(g,285,140,35,140);lin(g,35,140,35,120);
 var p="285,60 275,68 295,76 275,84 295,92 275,100 285,108";E("polyline",{points:p,fill:"none",stroke:"currentColor","stroke-width":2},g);tx(g,230,88,v.R+" Ω","end");
 var n=Math.max(1,Math.round(I*18));for(var i=0;i<n;i++)E("circle",{cx:60+(i+0.5)*(210/n),cy:30,r:4,fill:"#e0a800"},g);tx(g,160,20,"Current flow: more dots = more current")}}}},
par:{s:[["R2","Second resistor R2","Ω",20,400,10,100]],f:function(v){var r1=100,q=r1*v.R2/(r1+v.R2);return{o:[["R1","100 Ω"],["R2",v.R2+" Ω"],["Total (parallel)",q.toFixed(1)+" Ω"]],d:function(g){
 var bars=[["R1",r1],["R2",v.R2],["Total",q]],cs=["#2D6A4F","#0077B6","#e0a800"];bars.forEach(function(b,i){var w=b[1]/400*220;E("rect",{x:60,y:25+i*42,width:w,height:26,fill:cs[i],rx:3},g);tx(g,52,43+i*42,b[0],"end");tx(g,66+w,43+i*42,Math.round(b[1])+" Ω","start")});}}}},
hov:{s:[["m","Total mass","g",300,1200,10,640],["A","Cushion area","cm²",400,1600,50,1024]],f:function(v){var P=v.m/1000*9.81/(v.A/10000);return{o:[["Pressure needed",P.toFixed(0)+" Pa"],["Weight",(v.m/1000*9.81).toFixed(2)+" N"]],d:function(g){
 var x=Math.min(P,500)/500*240;E("rect",{x:40,y:70,width:240,height:22,fill:"none",stroke:"currentColor","stroke-width":1.5},g);E("rect",{x:40,y:70,width:x,height:22,fill:P>370?"#b3261e":"#2D6A4F"},g);
 lin(g,40+68/500*240,60,40+68/500*240,104,"#b3261e",2);tx(g,40+68/500*240,54,"weak fan 68 Pa");lin(g,40+370/500*240,60,40+370/500*240,104,"#0077B6",2);tx(g,40+370/500*240,54,"blower 370 Pa");tx(g,160,130,"Pressure to float = weight ÷ area");tx(g,160,150,"0 Pa .......................... 500 Pa")}}}},
lcl:{s:[["T","Air temperature","°C",10,40,1,32],["Td","Dew point","°C",0,30,1,8]],f:function(v){var T=v.T,Td=Math.min(v.Td,v.T),sp=T-Td,h=125*sp;return{o:[["Gap",sp+" °C"],["Cloud base",Math.round(h)+" m"]],d:function(g){
 var y=Math.max(18,150-h/4000*125);E("rect",{x:0,y:150,width:W,height:20,fill:"#7aa66a"},g);lin(g,0,150,W,150,"currentColor",1);
 [[120,y],[160,y-6],[205,y],[150,y+6]].forEach(function(c){E("ellipse",{cx:c[0],cy:c[1],rx:38,ry:13,fill:"#cfd8dc",stroke:"#78909c"},g)});
 lin(g,40,148,40,y+14,"#b3261e",2);tx(g,40,y+8,"↑ rising air","start",11);tx(g,285,100,Math.round(h)+" m","end",14);tx(g,285,118,"cloud base","end",11)}}}},
quad:{s:[["b","b (x coefficient)","",-6,6,0.5,0],["c","c (constant)","",-4,8,0.5,-4]],f:function(v){var D2=v.b*v.b-4*v.c,n=D2>1e-9?2:(Math.abs(D2)<1e-9?1:0);return{o:[["Discriminant b² − 4c",D2.toFixed(2)],["x-intercepts",n+""]],d:function(g){
 var X=function(x){return 160+x*24},Y=function(y){return 150-(y+3)*13};lin(g,0,Y(0),W,Y(0),"#888",1);lin(g,X(0),0,X(0),Hh,"#888",1);var pts=[];for(var x=-6.5;x<=6.5;x+=0.25){var y=x*x+v.b*x+v.c;if(y<-3.2||y>9.8)continue;pts.push(X(x).toFixed(1)+","+Y(y).toFixed(1))}
 E("polyline",{points:pts.join(" "),fill:"none",stroke:"#BC4749","stroke-width":2.5},g);if(n>0){var r=[(-v.b-Math.sqrt(Math.max(D2,0)))/2,(-v.b+Math.sqrt(Math.max(D2,0)))/2];r.forEach(function(x){E("circle",{cx:X(x),cy:Y(0),r:5,fill:"#e0a800",stroke:"#000"},g)})}}}}},
pyth:{s:[["a","Leg a","",1,12,1,3],["b","Leg b","",1,12,1,4]],f:function(v){var c=Math.sqrt(v.a*v.a+v.b*v.b),k=Math.min(12,150/Math.max(v.a,v.b,1))*0.8;return{o:[["Hypotenuse c",c.toFixed(2)],["a² + b²",(v.a*v.a+v.b*v.b)+""]],d:function(g){
 var x0=60,y0=150,pa=[x0,y0],pb=[x0+v.b*k,y0],pc=[x0,y0-v.a*k];E("polygon",{points:pa+" "+pb+" "+pc,fill:"rgba(188,71,73,.15)",stroke:"currentColor","stroke-width":2},g);E("polyline",{points:(x0+10)+","+y0+" "+(x0+10)+","+(y0-10)+" "+x0+","+(y0-10),fill:"none",stroke:"currentColor"},g);tx(g,x0-8,y0-v.a*k/2,"a="+v.a,"end");tx(g,x0+v.b*k/2,y0+14,"b="+v.b);tx(g,x0+v.b*k/2+16,y0-v.a*k/2-4,"c="+c.toFixed(1),"start")}}}},
lever:{s:[["F","Your push","N",10,120,5,40],["d","Distance from pivot","m",0.2,4,0.1,1]],f:function(v){var L=60*2,R=v.F*v.d,diff=R-L,bal=Math.abs(diff)/L<0.03,ang=Math.max(-14,Math.min(14,diff/L*20));return{o:[["Load turning effect","60 N × 2 m = 120 N·m"],["Your turning effect",R.toFixed(0)+" N·m"],["Result",bal?"Balanced":(diff<0?"Load wins":"You win")]],d:function(g){
 E("polygon",{points:"160,150 148,166 172,166",fill:"currentColor"},g);var gg=E("g",{transform:"rotate("+ang+" 160 148)"},g);lin(gg,40,148,280,148,"currentColor",5);E("rect",{x:85,y:118,width:30,height:30,fill:"#0077B6"},gg);tx(gg,100,136,"60 N","middle",10);tx(gg,160+Math.min(v.d,4)*30,138,v.F+" N","middle",11);lin(gg,160+v.d*30,120,160+v.d*30,146,"#BC4749",3)}}}},
proj:{s:[["a","Launch angle","°",5,85,1,30]],f:function(v){var u=20,g=10,r=u*u*Math.sin(2*v.a*Math.PI/180)/g,hm=Math.pow(u*Math.sin(v.a*Math.PI/180),2)/(2*g);return{o:[["Range",r.toFixed(1)+" m"],["Max height",hm.toFixed(1)+" m"]],d:function(g2){
 var k=250/40;lin(g2,30,150,290,150,"currentColor",1.5);var pts=[];for(var t=0;t<=3;t+=0.05){var x=u*Math.cos(v.a*Math.PI/180)*t,y=u*Math.sin(v.a*Math.PI/180)*t-5*t*t;if(y<0)break;pts.push((30+x*k).toFixed(1)+","+(150-y*k*0.9).toFixed(1))}
 E("polyline",{points:pts.join(" "),fill:"none",stroke:"#0F4C5C","stroke-width":2.5},g2);E("circle",{cx:30+r*k,cy:150,r:5,fill:"#e0a800",stroke:"#000"},g2);tx(g2,160,168,"Same launch speed (20 m/s). Distance scale: 40 m across.","middle",10)}}}}
};
function build(c){var id=c.getAttribute("data-demo"),box=c.querySelector(".dm");if(!box||box.dataset.b)return;box.dataset.b=1;
 if(id==="proof"){proof(c,box);return}
 var cfg=D[id];if(!cfg)return;var svg=E("svg",{viewBox:"0 0 "+W+" "+Hh,role:"img","aria-label":"Interactive diagram"},null);box.appendChild(svg);var ro=H("div",{"class":"dro","aria-live":"polite"},box),sl=H("div",{"class":"dsl"},box),val={};
 cfg.s.forEach(function(s,i){var lb=H("label",{"for":id+"s"+i},sl,s[1]+" ");var o=H("output",{},lb,s[6]+" "+s[2]);var inp=H("input",{type:"range",id:id+"s"+i,min:s[3],max:s[4],step:s[5],value:s[6]},sl);val[s[0]]=s[6];
  inp.addEventListener("input",function(){val[s[0]]=Number(inp.value);o.textContent=inp.value+" "+s[2];draw()})});
 H("p",{"class":"dhint"},box,"Drag the sliders. The picture and numbers change at once.");
 function draw(){var r=cfg.f(val);while(svg.firstChild)svg.removeChild(svg.firstChild);var g=E("g",{},svg);r.d(g);while(ro.firstChild)ro.removeChild(ro.firstChild);r.o.forEach(function(x){var d=H("div",{},ro,x[0]+": ");H("b",{},d,x[1])})}draw()}
function proof(c,box){var d=JSON.parse(c.getAttribute("data-proof")),sel=[];
 H("h3",{"class":"tqh"},box,d.t);H("p",{"class":"pm"},box,"Given: "+d.g);H("p",{"class":"pm"},box,"Prove: "+d.p);H("p",{"class":"dhint"},box,"Pick the reason that justifies each step.");
 var ol=H("ol",{"class":"pf"},box);d.r.forEach(function(r,i){var li=H("li",{},ol);H("span",{"class":"pn"},li,(i+1)+".");var l=H("label",{"for":"pf"+i+d.t.length},li,r.s);var s=H("select",{id:"pf"+i+d.t.length,"aria-label":"Reason for step "+(i+1)},li);H("option",{value:""},s,"Choose a reason…");r.o.forEach(function(o,j){H("option",{value:j},s,o)});sel.push([s,li,r])});
 var bt=H("div",{"class":"pbt"},box),ck=H("button",{type:"button","class":"btn"},bt,"Check my proof"),h=H("button",{type:"button","class":"btn sec"},bt,"Hint"),msg=H("p",{"class":"pm",role:"status","aria-live":"polite"},box),lv=0;
 h.addEventListener("click",function(){lv=Math.min(2,lv+1);msg.textContent="Hint "+lv+": "+(lv===1?d.h1:d.h2);if(lv===2)h.disabled=true});
 ck.addEventListener("click",function(){var ok=0;sel.forEach(function(x){var v=x[0].value,good=v!==""&&Number(v)===x[2].a;x[1].className=v===""?"":(good?"good":"bad");if(good)ok++});
  msg.textContent=ok===sel.length?"Complete proof! Watch out: "+d.trap:ok+" of "+sel.length+" reasons are right. Fix the red ones, or ask for a hint. Errors are useful clues, not failures."});}
[].forEach.call(document.querySelectorAll(".tqd"),build)})();
