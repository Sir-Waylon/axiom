import math,random
def _svg(w,h,body,extra=''):
    return f'<svg viewBox="0 0 {w} {h}" width="{w}" role="img" {extra} font-family="Arial,sans-serif" font-size="11" fill="none" stroke="#111" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">{body}</svg>'
def T(x,y,s,a='middle',sz=11,w='normal'):
    return f'<text x="{x:.1f}" y="{y:.1f}" text-anchor="{a}" font-size="{sz}" font-weight="{w}" fill="#111" stroke="#fff" stroke-width="3" paint-order="stroke">{s}</text>'
def barb(cx,cy,d,spd,L=44,r=0):
    """wind barb: staff from (cx,cy) toward direction wind comes from d (deg)"""
    a=math.radians(d);ux,uy=math.sin(a),-math.cos(a);px,py=-uy,ux
    x0,y0=cx+ux*r,cy+uy*r;x1,y1=cx+ux*(r+L),cy+uy*(r+L)
    s=f'<line x1="{x0:.1f}" y1="{y0:.1f}" x2="{x1:.1f}" y2="{y1:.1f}"/>'
    if spd<3:return ''
    n=int(round(spd/5)*5);pen,rest=divmod(n,50);full,half=divmod(rest,10);half//=5
    pos=L;step=6;bl=15
    def pt(p):return (cx+ux*(r+p),cy+uy*(r+p))
    for _ in range(pen):
        ax,ay=pt(pos);bx,by=pt(pos-8);tx,ty=ax+px*bl+ux*0,ay+py*bl
        s+=f'<polygon fill="#111" points="{ax:.1f},{ay:.1f} {tx:.1f},{ty:.1f} {bx:.1f},{by:.1f}"/>';pos-=9
    for _ in range(full):
        ax,ay=pt(pos);s+=f'<line x1="{ax:.1f}" y1="{ay:.1f}" x2="{ax+px*bl+ux*-4:.1f}" y2="{ay+py*bl+uy*-4:.1f}"/>';pos-=step
    if half:
        if pen==0 and full==0:pos-=step
        ax,ay=pt(pos);s+=f'<line x1="{ax:.1f}" y1="{ay:.1f}" x2="{ax+px*bl/2-ux*2:.1f}" y2="{ay+py*bl/2-uy*2:.1f}"/>'
    return s
def sky(cx,cy,frac,r=11):
    s=f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="#fff"/>'
    if frac>=1:s=f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="#111"/>'
    elif frac>0:
        a=2*math.pi*frac;x=cx+r*math.sin(a);y=cy-r*math.cos(a);big=1 if frac>0.5 else 0
        s+=f'<path d="M{cx},{cy} L{cx},{cy-r} A{r},{r} 0 {big} 1 {x:.1f},{y:.1f} Z" fill="#111"/>'
    if frac==0.0:pass
    return s
WX={'rain':'●','snow':'✻','fog':'═','thunderstorm':'⚡','none':''}
def station(Tt,Td,p3,tend,fr,d,spd,wx='none',label=True):
    cx,cy=110,100
    s=barb(cx,cy,d,spd,L=46,r=12) if spd>=3 else ''
    s+=sky(cx,cy,fr)
    s+=T(cx-42,cy-24,str(Tt),'end',14,'bold')+T(cx-42,cy+32,str(Td),'end',14,'bold')
    s+=T(cx+16,cy-20,p3,'start',14,'bold')
    if tend is not None:s+=T(cx+16,cy+32,tend,'start',13,'bold')
    if WX[wx]:s+=T(cx-30,cy+5,WX[wx],'end',15)
    if spd<3:s+=f'<circle cx="{cx}" cy="{cy}" r="16"/>'
    return _svg(220,200,s,'aria-label="station model"')
def barb_only(d,spd):
    s=f'<circle cx="110" cy="100" r="3" fill="#111"/>'+barb(110,100,d,spd,L=62,r=4)
    s+=T(110,18,'N','middle',12,'bold')+'<line x1="110" y1="22" x2="110" y2="30"/>'
    return _svg(220,200,s,'aria-label="wind barb"')
def sounding(Tc,Td,lab,w=300,h=260):
    """Tc,Td: list of (p_mb,temp). x=temp -40..40, y=p 1000..200"""
    X=lambda t:40+(t+40)/80*(w-60);Y=lambda p:20+(p-200)/800*(h-45)
    s=f'<rect x="40" y="20" width="{w-60}" height="{h-45}"/>'
    for p in (1000,850,700,500,300,200):
        s+=f'<line x1="40" y1="{Y(p):.1f}" x2="{w-20}" y2="{Y(p):.1f}" stroke="#bbb" stroke-width="0.8"/>'+T(36,Y(p)+4,p,'end',10)
    for t in range(-40,41,20):s+=f'<line x1="{X(t):.1f}" y1="20" x2="{X(t):.1f}" y2="{h-25}" stroke="#bbb" stroke-width="0.8"/>'+T(X(t),h-10,t,'middle',10)
    s+=T(8,12,'mb','start',10)+T(w-20,h-10,'°C','end',10)
    s+='<polyline stroke-width="2.4" points="'+' '.join(f'{X(t):.1f},{Y(p):.1f}' for p,t in Tc)+'"/>'
    s+='<polyline stroke-width="2.4" stroke-dasharray="6 4" points="'+' '.join(f'{X(t):.1f},{Y(p):.1f}' for p,t in Td)+'"/>'
    for nm,p in lab:s+=f'<circle cx="{w-30}" cy="{Y(p):.1f}" r="9" fill="#fff"/>'+T(w-30,Y(p)+4,nm,'middle',11,'bold')
    s+=T(w-24,34,'solid = temp  dashed = dew pt','end',9)
    return _svg(w,h,s,'aria-label="sounding"')
def hodo(pts,rings=(10,20,30,40),size=260):
    """pts: list of (label,u,v) knots; u east+, v north+ (wind vector, blowing toward)"""
    c=size/2;k=(c-20)/max(rings)
    s=''.join(f'<circle cx="{c}" cy="{c}" r="{r*k:.1f}" stroke="#bbb" stroke-width="0.9"/>'+T(c+r*k,c+12,r,'middle',9) for r in rings)
    s+=f'<line x1="10" y1="{c}" x2="{size-10}" y2="{c}"/><line x1="{c}" y1="10" x2="{c}" y2="{size-10}"/>'
    s+=T(c,9,'N','middle',11,'bold')+T(size-6,c-4,'E','end',11,'bold')+T(c,size-2,'S','middle',11,'bold')+T(8,c-4,'W','start',11,'bold')
    pp=[(c+u*k,c-v*k) for _,u,v in pts]
    s+='<polyline stroke-width="2.2" points="'+' '.join(f'{x:.1f},{y:.1f}' for x,y in pp)+'"/>'
    for (lb,_,_),(x,y) in zip(pts,pp):s+=f'<circle cx="{x:.1f}" cy="{y:.1f}" r="3.5" fill="#111"/>'+T(x+7,y-5,lb,'start',11,'bold')
    s+=T(size/2,size-14,'rings = knots','middle',9)
    return _svg(size,size,s,'aria-label="hodograph"')
def idf(curves,w=320,h=240):
    """curves: {label:[(dur_h,inten_inph),...]} log-ish axes: dur 0.25..24 log, inten 0.1..10 log"""
    X=lambda d:45+(math.log10(d)-math.log10(0.25))/(math.log10(24)-math.log10(0.25))*(w-65)
    Y=lambda i:h-35-(math.log10(i)-math.log10(0.1))/(2)*(h-60)
    s=f'<rect x="45" y="15" width="{w-65}" height="{h-50}"/>'
    for d in (0.25,0.5,1,2,6,12,24):s+=f'<line x1="{X(d):.1f}" y1="15" x2="{X(d):.1f}" y2="{h-35}" stroke="#ccc" stroke-width="0.8"/>'+T(X(d),h-20,d,'middle',10)
    for i in (0.1,0.2,0.5,1,2,5,10):s+=f'<line x1="45" y1="{Y(i):.1f}" x2="{w-20}" y2="{Y(i):.1f}" stroke="#ccc" stroke-width="0.8"/>'+T(41,Y(i)+4,i,'end',10)
    dash=['','7 4','2 3']
    for n,(lb,pts) in enumerate(curves.items()):
        s+=f'<polyline stroke-width="2.2" stroke-dasharray="{dash[n%3]}" points="'+' '.join(f'{X(d):.1f},{Y(i):.1f}' for d,i in pts)+'"/>'
        d,i=pts[1];s+=T(X(d)+6,Y(i)-6,lb,'start',10,'bold')
    s+=T(w/2,h-3,'Duration (hours)','middle',10)+T(10,12,'in/hr','start',10)
    return _svg(w,h,s,'aria-label="IDF curves"')
def _line(x1,y1,x2,y2):return f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}"/>'
def front(kind,x1,y1,x2,y2,side=1,sp=22):
    """draw front along segment; side=+1 symbols on left of travel direction"""
    dx,dy=x2-x1,y2-y1;L=math.hypot(dx,dy);ux,uy=dx/L,dy/L;nx,ny=-uy*side,ux*side
    s=f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke-width="2"/>'
    n=int(L//sp)
    for i in range(n):
        t=(i+0.5)*sp;bx,by=x1+ux*t,y1+uy*t
        def tri(sg):
            return f'<polygon fill="#111" points="{bx-ux*6:.1f},{by-uy*6:.1f} {bx+ux*6:.1f},{by+uy*6:.1f} {bx+nx*10*sg:.1f},{by+ny*10*sg:.1f}"/>'
        def semi(sg):
            ex,ey=bx+ux*6,by+uy*6;sx,sy=bx-ux*6,by-uy*6
            return f'<path fill="#fff" d="M{sx:.1f},{sy:.1f} A6,6 0 0 {1 if sg*side>0 else 0} {ex:.1f},{ey:.1f}"/>' if False else f'<path fill="#fff" d="M{sx:.1f},{sy:.1f} Q{bx+nx*13*sg:.1f},{by+ny*13*sg:.1f} {ex:.1f},{ey:.1f} Z"/>'
        if kind=='cold':s+=tri(1)
        elif kind=='warm':s+=semi(1)
        elif kind=='occ':s+=tri(1) if i%2==0 else semi(1)
        elif kind=='stat':s+=tri(1) if i%2==0 else semi(-1)
    return s
def fmap(kind,side,city_pos,label='City'):
    """simple map: vertical-ish front with symbols; arrow showing motion"""
    s=front(kind,130,20,130,200,side)
    s+=f'<circle cx="{city_pos}" cy="115" r="5" fill="#111"/>'+T(city_pos,133,label,'middle',11,'bold')
    return _svg(260,220,s,'aria-label="front map"')
RAD='<circle cx="{x}" cy="{y}" r="6" fill="#111"/>'
def radar(kind):
    s=''
    if kind=='hook':
        s+='<path d="M60,150 C60,90 110,60 170,70 C210,78 230,110 215,140 C205,160 190,150 195,135 C200,115 180,105 160,110 C120,118 110,160 60,150 Z" fill="#999" stroke="#111"/>'
        s+='<path d="M175,98 C200,95 215,120 205,140" fill="none" stroke="#111" stroke-width="3"/>'
        s+=T(130,185,'reflectivity (darker = heavier rain)','middle',10)
    elif kind=='bow':
        s+='<path d="M40,170 C70,95 190,95 220,170 L205,172 C180,125 80,125 55,172 Z" fill="#555"/>'+T(130,195,'reflectivity, storm moving up the page','middle',10)+'<line x1="130" y1="100" x2="130" y2="60"/><polygon fill="#111" points="130,52 124,64 136,64"/>'
    elif kind=='couplet':
        s+='<circle cx="108" cy="100" r="18" fill="url(#h1)"/><circle cx="146" cy="100" r="18" fill="#bbb"/><circle cx="108" cy="100" r="18"/><circle cx="146" cy="100" r="18"/>'
        s+='<defs><pattern id="h1" width="6" height="6" patternUnits="userSpaceOnUse"><path d="M0,6 L6,0" stroke="#111" stroke-width="1.2"/></pattern></defs>'
        s+=f'<circle cx="127" cy="215" r="7" fill="#111"/>'+T(127,238,'radar site','middle',10)+T(108,140,'A','middle',12,'bold')+T(146,140,'B','middle',12,'bold')
        s+=T(130,22,'velocity: hatched = toward radar, gray = away','middle',10)
    elif kind=='ball':
        s+='<path d="M60,150 C60,90 110,60 170,70 C210,78 230,110 215,140 C205,160 190,150 195,135 C200,115 180,105 160,110 C120,118 110,160 60,150 Z" fill="#999" stroke="#111"/>'
        s+='<circle cx="197" cy="130" r="8" fill="#fff" stroke="#111" stroke-width="2" stroke-dasharray="3 2"/>'+T(214,160,'X','start',13,'bold')+'<line x1="212" y1="157" x2="200" y2="138"/>'
        s+=T(130,185,'correlation coefficient: X = very low values inside a hook','middle',10)
    elif kind=='line':
        s+='<path d="M20,150 L240,90" stroke-width="22" stroke="#666"/><path d="M20,172 L240,112" stroke-width="5" stroke="#999"/>'+T(130,195,'long continuous line of strong echoes','middle',10)
    elif kind=='fine':
        s+='<path d="M30,95 Q130,55 235,95" stroke="#777" stroke-width="2.5" stroke-dasharray="1 0"/><ellipse cx="130" cy="150" rx="70" ry="32" fill="#888"/>'+T(130,195,'thin faint arc ahead of the big storm','middle',10)
    return _svg(260,250 if kind=='couplet' else 205,s,'aria-label="radar"')
def eye():
    s='<circle cx="130" cy="110" r="14" fill="#fff"/><circle cx="130" cy="110" r="30" fill="#444"/>'
    s+='<circle cx="130" cy="110" r="14" fill="#fff" stroke="#111"/>'
    for k in range(3):
        s+=f'<path d="M{130+40+k*18},110 A{40+k*18},{40+k*18} 0 0 0 {130},{110-40-k*18}" stroke="#777" stroke-width="5"/>'
    s+=T(130,112,'A','middle',12,'bold')+T(130,64,'B','middle',12,'bold')+T(215,92,'C','middle',12,'bold')
    return _svg(260,200,s,'aria-label="hurricane"')
