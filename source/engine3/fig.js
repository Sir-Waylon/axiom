function figSVG(f){
 var lw='stroke="currentColor" stroke-width="1.6" fill="none"',tx=' text-anchor="middle" font-size="11" fill="currentColor"';
 function ln(a,b,c,d){return '<line x1="'+a+'" y1="'+b+'" x2="'+c+'" y2="'+d+'" '+lw+'/>'}
 function hr(cx,cy,n,v){return '<rect x="'+(cx-22)+'" y="'+(cy-9)+'" width="44" height="18" fill="var(--surface)" '+lw+'/><text x="'+cx+'" y="'+(cy+4)+'"'+tx+'>R'+n+'</text><text x="'+cx+'" y="'+(cy-13)+'"'+tx+'>'+v+' Ω</text>'}
 function vr(cx,cy,n,v,hh){hh=hh||20;return '<rect x="'+(cx-9)+'" y="'+(cy-hh)+'" width="18" height="'+(2*hh)+'" fill="var(--surface)" '+lw+'/><text x="'+cx+'" y="'+(cy+4)+'"'+tx+' font-size="9">R'+n+'</text><text x="'+(cx+14)+'" y="'+(cy+4)+'" font-size="11" fill="currentColor">'+v+' Ω</text>'}
 function bat(top,bot){var s=ln(30,top,30,58)+ln(20,58,40,58)+'<line x1="25" y1="66" x2="35" y2="66" stroke="currentColor" stroke-width="3.2"/>'+ln(30,66,30,bot)+'<text x="44" y="57" font-size="11" fill="currentColor">+</text>';if(f.v)s+='<text x="8" y="90" font-size="11" fill="currentColor">'+f.v+' V</text>';return s}
 var r=f.r,s='';
 if(f.k==='S'){var n=r.length;s+=bat(30,100)+ln(30,30,340,30)+ln(340,30,340,100)+ln(30,100,340,100);r.forEach(function(v,i){s+=hr(90+i*(240/n),30,i+1,v)})}
 else if(f.k==='P'){s+=bat(20,100);var n2=r.length,last=90+(n2-1)*80;s+=ln(30,20,last,20)+ln(30,100,last,100);r.forEach(function(v,i){var x=90+i*80;s+=ln(x,20,x,40)+ln(x,80,x,100)+vr(x,60,i+1,v)})}
 else if(f.k==='SP'){s+=bat(30,100)+ln(30,30,68,30)+ln(112,30,270,30)+ln(30,100,270,100)+hr(90,30,1,r[0]);[190,270].forEach(function(x,i){s+=ln(x,30,x,45)+ln(x,85,x,100)+vr(x,65,i+2,r[i+1])})}
 else{s+=bat(20,100)+ln(30,20,240,20)+ln(30,100,240,100)+ln(120,20,120,40)+ln(120,80,120,100)+vr(120,60,1,r[0])+ln(240,20,240,28)+ln(240,52,240,68)+ln(240,92,240,100)+vr(240,40,2,r[1],12)+vr(240,80,3,r[2],12)}
 return '<svg class="fig" viewBox="0 0 360 120" role="img" aria-label="Circuit schematic">'+s+'</svg>';
}

