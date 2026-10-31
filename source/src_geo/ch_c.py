# -*- coding: utf-8 -*-
from gen import *
import gen
def ri(a,b):return R.randint(a,b)
def N(x):return str(x).replace('-','−')
def Pt(x,y):return f"({N(x)}, {N(y)})"
def pc(n):return 'π' if n==1 else f"{N(n)}π"
def fq(f):return N(fm(Fr(f)))
def sq(n):
    k=1
    for i in range(2,int(n**.5)+1):
        if n%(i*i)==0:k=i
    r=n//(k*k)
    if r==1:return str(k)
    return (str(k) if k>1 else '')+f"√{r}"
TRI=[(3,4,5),(5,12,13),(8,15,17),(7,24,25)]
def lin_str(m,k):
    m=Fr(m);k=Fr(k)
    if m==0:return N(f"y = {fm(k)}")
    if m.denominator==1:mt='' if m==1 else '−' if m==-1 else N(m.numerator)
    else:mt=f"({N(fm(m))})"
    s=f"y = {mt}x"
    if k>0:s+=f" + {fm(k)}"
    elif k<0:s+=f" − {fm(-k)}"
    return s
def cir_eq(h,k,r2):
    a='x²' if h==0 else f"(x − {h})²" if h>0 else f"(x + {-h})²"
    b='y²' if k==0 else f"(y − {k})²" if k>0 else f"(y + {-k})²"
    return f"{a} + {b} = {r2}"
# ---------------- svg figures
def rect_svg(a,b):return S(250,170,'<rect x="40" y="25" width="170" height="100"/>'+TXT(125,148,a)+TXT(230,80,b))
def para_svg(b,h,s=None):
    x='<polygon points="10,140 150,140 205,40 65,40"/><line x1="65" y1="40" x2="65" y2="140" stroke-dasharray="4 3"/><path d="M65,128 h12 v12" stroke-width="1.2"/>'
    x+=TXT(80,158,b)+TXT(59,95,h,'end')
    if s:x+=TXT(190,95,s,'start')
    return S(250,170,x)
def tri_h_svg(b,h):
    return S(250,170,'<polygon points="20,140 210,140 100,25"/><line x1="100" y1="25" x2="100" y2="140" stroke-dasharray="4 3"/><path d="M100,128 h12 v12" stroke-width="1.2"/>'+TXT(115,160,b)+TXT(94,88,h,'end'))
def trap_svg(b1,b2,h):
    return S(250,175,'<polygon points="15,145 235,145 190,45 65,45"/><line x1="65" y1="45" x2="65" y2="145" stroke-dasharray="4 3"/><path d="M65,133 h12 v12" stroke-width="1.2"/>'+TXT(127,36,b1)+TXT(125,166,b2)+TXT(59,100,h,'end'))
def rhomb_svg(d1,d2):
    return S(250,170,'<polygon points="125,15 225,80 125,145 25,80"/><line x1="25" y1="80" x2="225" y2="80" stroke-dasharray="4 3"/><line x1="125" y1="15" x2="125" y2="145" stroke-dasharray="4 3"/>'+TXT(175,74,d1)+TXT(131,50,d2,'start'))
def circ_svg2(lab,kind='r'):
    x='<circle cx="125" cy="85" r="65"/><circle cx="125" cy="85" r="2.5" fill="#111"/>'
    x+=f'<line x1="125" y1="85" x2="190" y2="85"/>' if kind=='r' else '<line x1="60" y1="85" x2="190" y2="85"/>'
    x+=TXT(160 if kind=='r' else 125,78 if kind=='r' else 78,lab)
    return S(250,170,x)
def sector_svg(r,ang):
    cx,cy,R_=100,100,75;a=math.radians(ang)
    x2=cx+R_*math.cos(a);y2=cy-R_*math.sin(a);lg=1 if ang>180 else 0
    x=f'<path d="M{cx},{cy} L{cx+R_},{cy} A{R_},{R_} 0 {lg} 0 {x2:.1f},{y2:.1f} Z"/>'
    x+=TXT(cx+40,cy+16,r)+TXT(cx+18,cy-8,f"{ang}°",'start',12)
    return S(250,185,x)
def reg_svg(n,a,s):
    cx,cy,Rr=125,85,70;pts=[]
    for i in range(n):
        t=math.radians(90-180/n+i*360/n);pts.append((cx+Rr*math.cos(t),cy+Rr*math.sin(t)))
    x='<polygon points="'+' '.join(f'{p:.0f},{q:.0f}' for p,q in pts)+'"/>'
    ay=cy+Rr*math.cos(math.pi/n)
    x+=f'<line x1="{cx}" y1="{cy}" x2="{cx}" y2="{ay:.0f}" stroke-dasharray="4 3"/>'+TXT(cx-6,(cy+ay)/2+4,a,'end')+TXT(cx,ay+16,s)
    return S(250,185,x)
def box_svg(l,w,h):
    x='<rect x="30" y="70" width="120" height="90"/><polygon points="30,70 80,35 200,35 150,70"/><polygon points="150,70 200,35 200,125 150,160"/>'
    return S(250,185,x+TXT(90,177,l)+TXT(190,158,w,'start')+TXT(24,120,h,'end'))
def cyl_svg(r,h):
    x='<ellipse cx="125" cy="40" rx="60" ry="18"/><line x1="65" y1="40" x2="65" y2="150"/><line x1="185" y1="40" x2="185" y2="150"/><path d="M65,150 A60,18 0 0 0 185,150"/><path d="M65,150 A60,18 0 0 1 185,150" stroke-dasharray="4 3"/><line x1="125" y1="40" x2="185" y2="40"/>'
    return S(250,185,x+TXT(155,34,r)+TXT(194,100,h,'start'))
def cone_svg(r,h,l=None):
    x='<line x1="125" y1="20" x2="65" y2="140"/><line x1="125" y1="20" x2="185" y2="140"/><path d="M65,140 A60,16 0 0 0 185,140"/><path d="M65,140 A60,16 0 0 1 185,140" stroke-dasharray="4 3"/><line x1="125" y1="20" x2="125" y2="140" stroke-dasharray="4 3"/><line x1="125" y1="140" x2="185" y2="140"/>'
    x+=TXT(155,134,r)
    if h:x+=TXT(119,85,h,'end')
    if l:x+=TXT(168,72,l,'start')
    return S(250,170,x)
def sph_svg(r):
    return S(250,170,'<circle cx="125" cy="85" r="65"/><path d="M60,85 A65,18 0 0 0 190,85"/><path d="M60,85 A65,18 0 0 1 190,85" stroke-dasharray="4 3"/><line x1="125" y1="85" x2="190" y2="85"/><circle cx="125" cy="85" r="2.5" fill="#111"/>'+TXT(158,76,r))
def pyr_svg(s,h,l=None):
    x='<polygon points="50,150 160,150 210,120 100,120" stroke-dasharray="0"/><line x1="130" y1="25" x2="50" y2="150"/><line x1="130" y1="25" x2="160" y2="150"/><line x1="130" y1="25" x2="210" y2="120"/><line x1="130" y1="25" x2="100" y2="120" stroke-dasharray="4 3"/>'
    if l:x+='<line x1="130" y1="25" x2="105" y2="150" stroke-dasharray="4 3"/>'+TXT(108,90,l,'end')
    else:x+='<line x1="130" y1="25" x2="130" y2="135" stroke-dasharray="4 3"/>'+TXT(124,85,h,'end')
    return S(250,185,x+TXT(105,168,s))
def prism_svg(a,b,h):
    x='<polygon points="30,150 120,150 30,80"/><polygon points="90,115 180,115 90,45" stroke-dasharray="4 3"/><line x1="30" y1="150" x2="90" y2="115"/><line x1="120" y1="150" x2="180" y2="115"/><line x1="30" y1="80" x2="90" y2="45"/>'
    return S(250,185,x+TXT(75,168,a)+TXT(24,115,b,'end')+TXT(165,146,h,'start'))
def grid2(polys,rng=6,sz=240):
    c=sz/2;k=(sz-30)/(2*rng);X=lambda x:c+x*k;Y=lambda y:c-y*k
    s=''.join(f'<line x1="{X(i):.0f}" y1="10" x2="{X(i):.0f}" y2="{sz-10}" stroke="#ddd" stroke-width="1"/><line x1="10" y1="{Y(i):.0f}" x2="{sz-10}" y2="{Y(i):.0f}" stroke="#ddd" stroke-width="1"/>' for i in range(-rng,rng+1))
    s+=f'<line x1="10" y1="{c}" x2="{sz-10}" y2="{c}" stroke-width="2"/><line x1="{c}" y1="10" x2="{c}" y2="{sz-10}" stroke-width="2"/>'
    for i in range(-rng+1,rng):
        if i and i%2==0:s+=TXT(X(i),c+14,N(i),sz=10)+TXT(c-12,Y(i)+4,N(i),sz=10)
    for pts,dash in polys:
        d=' stroke-dasharray="5 3"' if dash else ''
        if len(pts)>2:s+='<polygon points="'+' '.join(f'{X(x):.0f},{Y(y):.0f}' for _,x,y in pts)+f'" fill="rgba(80,70,255,.{"06" if dash else "14"})"{d}/>'
        elif len(pts)==2:s+=f'<line x1="{X(pts[0][1]):.0f}" y1="{Y(pts[0][2]):.0f}" x2="{X(pts[1][1]):.0f}" y2="{Y(pts[1][2]):.0f}"{d}/>'
        for n,x,y in pts:s+=f'<circle cx="{X(x):.0f}" cy="{Y(y):.0f}" r="3.5" fill="#111"/>'+TXT(X(x)+8,Y(y)-6,n,'start',b=True)
    return S(sz,sz,s)
def rg(*pts):return max(6,max(abs(v) for p in pts for v in p)+1)
# =========================== AREA
T='area'
def a_rect():
    l=ri(5,18);w=ri(3,l-1)
    return NUM(T,1,'a_rect',f"A rectangle is {l} cm long and {w} cm wide. What is its area in cm²?",l*w,["Area = length × width.",f"{l} × {w} = {l*w}."],svg=rect_svg(f"{l} cm",f"{w} cm"))
def a_rect_p():
    a=ri(3,12);b=ri(3,12)
    if a==b:return False
    return NUM(T,2,'a_rect_p',f"A rectangle has area {a*b} m² and one side of {a} m. What is its perimeter in m?",2*(a+b),[f"Other side = {a*b} ÷ {a} = {b} m.",f"Perimeter = 2({a} + {b})."," = "+str(2*(a+b))+"."])
def a_rect_k():
    w=ri(3,9)*3;k=Fr(ri(1,3)*0+R.choice([2,3,4]),R.choice([1,1,3]))
    l=w*k
    if l.denominator!=1 or l==w:return False
    l=int(l);P=2*(l+w)
    return NUM(T,3,'a_rect_k',f"A rectangle's length is {fm(k)} times its width. Its perimeter is {P} cm. What is its area in cm²?",l*w,[f"Let width = w, length = {fm(k)}w. Perimeter: 2(w + {fm(k)}w) = {P}.",f"Solve: w = {w}, so length = {l}.",f"Area = {l} × {w} = {l*w}."])
def a_para():
    b=ri(6,16);h=ri(4,10);s=h+ri(2,5)
    return MC(T,1,'a_para',f"Find the area of the parallelogram, in cm².",str(b*h),[str(b*s),str(2*(b+s)),str(b+h),str(b*h//2 if (b*h)%2==0 else b*h+1)],["Area = base × height (the perpendicular height).",f"The slanted side {s} is not the height.",f"{b} × {h} = {b*h}."],svg=para_svg(f"{b} cm",f"{h} cm",f"{s} cm"))
def a_tri():
    b=2*ri(3,10);h=ri(4,13)
    return NUM(T,1,'a_tri',f"Find the area of the triangle in cm².",b*h//2,["Area = ½ × base × height.",f"½ × {b} × {h} = {b*h//2}."],svg=tri_h_svg(f"{b} cm",f"{h} cm"))
def a_tri_leg():
    a=ri(4,15);b=2*ri(2,8)
    return NUM(T,1,'a_tri_leg',f"A right triangle has legs of {a} in and {b} in. What is its area in in²?",a*b//2,["The legs are the base and height.",f"½ × {a} × {b} = {a*b//2}."])
def a_tri_h():
    b=ri(4,14);h=ri(3,12)
    if (b*h)%2:return False
    A=b*h//2
    return NUM(T,2,'a_tri_h',f"A triangle has area {A} cm² and a base of {b} cm. How tall is it, in cm?",h,[f"Area = ½ × base × height, so {A} = ½ × {b} × h.",f"Multiply by 2: {2*A} = {b}h.",f"h = {2*A} ÷ {b} = {h}."])
def a_trap():
    b1=ri(4,10);b2=b1+ri(2,8);h=ri(3,9)
    if ((b1+b2)*h)%2:return False
    A=(b1+b2)*h//2
    return NUM(T,2,'a_trap',"Find the area of the trapezoid in cm².",A,["Area = ½ × height × (base₁ + base₂).",f"½ × {h} × ({b1} + {b2}) = ½ × {h} × {b1+b2}.",f"= {A}."],svg=trap_svg(f"{b1} cm",f"{b2} cm",f"{h} cm"))
def a_trap_m():
    b1=ri(3,9);b2=b1+2*ri(1,5);h=ri(3,9);A=(b1+b2)*h//2
    if A*2!=(b1+b2)*h:return False
    return NUM(T,3,'a_trap_m',f"A trapezoid has area {A} cm², height {h} cm, and one base of {b1} cm. How long is the other base, in cm?",b2,[f"{A} = ½ × {h} × ({b1} + b).",f"{2*A} = {h}({b1} + b), so {b1} + b = {2*A//h}.",f"b = {2*A//h} − {b1} = {b2}."])
def a_midseg():
    m=ri(5,14);h=ri(3,9)
    return NUM(T,3,'a_midseg',f"The midsegment of a trapezoid is {m} cm long and the trapezoid is {h} cm tall. What is its area in cm²?",m*h,["The midsegment is the average of the two bases.","Area = ½ × h × (b₁ + b₂) = midsegment × h.",f"{m} × {h} = {m*h}."])
def a_rhomb():
    d1=ri(4,16);d2=ri(4,16)
    if (d1*d2)%2 or d1==d2:return False
    return NUM(T,2,'a_rhomb',"Find the area of the rhombus in cm².",d1*d2//2,["Area = ½ × d₁ × d₂.",f"½ × {d1} × {d2} = {d1*d2//2}."],svg=rhomb_svg(f"{d1} cm",f"{d2} cm"))
def a_rhomb_s():
    a,b,c=R.choice(TRI[:2]);k=ri(1,2)
    s=c*k;d=2*a*k;d2=2*b*k
    return NUM(T,3,'a_rhomb_s',f"A rhombus has sides of {s} cm and one diagonal of {d} cm. What is its area in cm²?",d*d2//2,["The diagonals cross at right angles and bisect each other.",f"Half-diagonal {d//2} and side {s} make a right triangle, so the other half is {b*k}, and the diagonal is {d2}.",f"Area = ½ × {d} × {d2} = {d*d2//2}."])
def a_eqtri():
    k=ri(1,9);s=2*k
    return MC(T,2,'a_eqtri',f"What is the area of an equilateral triangle with side {s} cm?",f"{k*k}√3 cm²".replace('1√3','√3') if k==1 else f"{k*k}√3 cm²",[f"{k}√3 cm²" if k>1 else "2√3 cm²",f"{2*k*k}√3 cm²",f"{k*k}√2 cm²",f"{s*s}√3 cm²"],[f"Height of an equilateral triangle = (√3/2) × side = {k}√3.",f"Area = ½ × {s} × {k}√3.",f"= {k*k}√3 cm²."])
def a_hex():
    k=ri(1,6);s=2*k
    return MC(T,3,'a_hex',f"A regular hexagon has sides of {s} cm. What is its exact area in cm²?",f"{6*k*k}√3",[f"{3*k*k}√3",f"{12*k*k}√3",f"{6*k*k}√2",f"{6*k}√3"],["A regular hexagon is 6 equilateral triangles.",f"One triangle: ½ × {s} × {k}√3 = {k*k}√3.",f"Six of them: {6*k*k}√3."])
def a_reg():
    n=R.choice([5,6,8,10]);a=ri(3,12);s=ri(3,10)
    if (a*n*s)%2:return False
    return NUM(T,2,'a_reg',f"A regular {['','','','','','pentagon','hexagon','','octagon','','decagon'][n]} has side {s} cm and apothem {a} cm. What is its area in cm²?",a*n*s//2,[f"Perimeter = {n} × {s} = {n*s} cm.","Area = ½ × apothem × perimeter.",f"½ × {a} × {n*s} = {a*n*s//2}."],svg=reg_svg(n,f"{a} cm",f"{s} cm"))
def a_circ_r():
    r=ri(2,15)
    return NUM(T,1,'a_circ_r',f"What is the circumference of a circle with radius {r} cm? Give the number that goes with π.",2*r,["C = 2πr.",f"2 × {r} = {2*r}, so C = {2*r}π cm."],pi=True,show=pc(2*r),svg=circ_svg2(f"r = {r}"))
def a_circ_d():
    d=ri(3,24)
    return NUM(T,1,'a_circ_d',f"A circle has diameter {d} m. What is its circumference? Give the number that goes with π.",d,["C = πd.",f"C = {d}π m."],pi=True,show=pc(d),svg=circ_svg2(f"d = {d}",'d'))
def a_circ_rev():
    r=ri(3,20);C=2*r
    return NUM(T,2,'a_circ_rev',f"A circle's circumference is {C}π cm. What is its radius in cm?",r,["C = 2πr, so 2πr = "+f"{C}π.",f"2r = {C}, so r = {r}."])
def a_area_r():
    r=ri(2,13)
    return NUM(T,1,'a_area_r',f"Find the area of a circle with radius {r} cm. Give the number that goes with π.",r*r,["A = πr².",f"{r}² = {r*r}, so A = {r*r}π cm²."],pi=True,show=pc(r*r),svg=circ_svg2(f"r = {r}"))
def a_area_d():
    r=ri(2,12);d=2*r
    return MC(T,2,'a_area_d',f"A circle has diameter {d} cm. What is its area?",f"{r*r}π cm²",[f"{d*d}π cm²",f"{d}π cm²",f"{2*r*r}π cm²"],["The radius is half the diameter.",f"r = {r}.",f"A = π({r})² = {r*r}π cm²."],svg=circ_svg2(f"d = {d}",'d'))
def a_area_rev():
    r=ri(3,14)
    return NUM(T,2,'a_area_rev',f"A circle has area {r*r}π m². What is its diameter in m?",2*r,[f"πr² = {r*r}π, so r² = {r*r}.",f"r = {r}.",f"Diameter = 2 × {r} = {2*r}."])
def a_area_314():
    r=ri(2,12)
    return NUM(T,1,'a_area_314',f"Use 3.14 for π. What is the area of a circle with radius {r} cm, in cm²?",round(3.14*r*r,2),[f"A = πr² = 3.14 × {r}².",f"{r}² = {r*r}.",f"3.14 × {r*r} = {round(3.14*r*r,2)}."],tol=.01)
def a_sector():
    r=ri(3,15);ang=R.choice([40,45,60,72,90,120,150,180,270])
    c=Fr(ang,360)*r*r
    if c.denominator!=1:return False
    return NUM(T,2,'a_sector',f"A sector has radius {r} cm and central angle {ang}°. What is its area? Give the number that goes with π.",int(c),[f"Fraction of the circle = {ang}/360 = {fm(Fr(ang,360))}.",f"Circle area = {r*r}π.",f"{fm(Fr(ang,360))} × {r*r}π = {int(c)}π cm²."],pi=True,show=pc(int(c)),svg=sector_svg(f"{r}",ang))
def a_arc():
    r=ri(3,18);ang=R.choice([30,45,60,90,120,180,240,270])
    c=Fr(ang,360)*2*r
    if c.denominator!=1:return False
    return NUM(T,2,'a_arc',f"Find the length of an arc with central angle {ang}° in a circle of radius {r} cm. Give the number that goes with π.",int(c),[f"Whole circle: 2π({r}) = {2*r}π.",f"Fraction: {ang}/360 = {fm(Fr(ang,360))}.",f"{fm(Fr(ang,360))} × {2*r}π = {int(c)}π cm."],pi=True,show=pc(int(c)),svg=sector_svg(f"{r}",ang))
def a_arc_ang():
    r=ri(4,18);ang=R.choice([30,45,60,90,120,135,150,180,240])
    L=Fr(ang*r,180)
    if L.denominator!=1:return False
    return NUM(T,3,'a_arc_ang',f"An arc of length {int(L)}π cm is on a circle with radius {r} cm. What is its central angle, in degrees?",ang,[f"Circumference = 2π({r}) = {2*r}π.",f"Fraction of circle = {int(L)}π / {2*r}π = {fm(Fr(int(L),2*r))}.",f"{fm(Fr(int(L),2*r))} × 360° = {ang}°."])
def a_sim_ar():
    a=ri(1,6);b=a+ri(1,5)
    from math import gcd
    if gcd(a,b)!=1:return False
    return MC(T,2,'a_sim_ar',f"Two similar figures have a scale factor of {a}:{b}. What is the ratio of their areas?",f"{a*a}:{b*b}",[f"{a}:{b}",f"{a*a}:{b}",f"{2*a}:{2*b+1}",f"{a**3}:{b**3}"],["Areas compare as the square of the scale factor.",f"{a}² : {b}² = {a*a}:{b*b}."])
def a_sim_a2():
    a=ri(1,4);b=a+ri(1,4);A=ri(2,9)*a*a
    from math import gcd
    if gcd(a,b)!=1:return False
    return NUM(T,2,'a_sim_a2',f"Two similar polygons have a scale factor of {a}:{b}. The smaller has area {A} cm². What is the area of the larger, in cm²?",A*b*b//(a*a),[f"Area ratio = {a}² : {b}² = {a*a}:{b*b}.",f"Smaller area {A} is {A//(a*a)} × {a*a}.",f"Larger = {A//(a*a)} × {b*b} = {A*b*b//(a*a)}."])
def a_sim_perim():
    a=ri(1,4);b=a+ri(1,3);A=ri(2,6)*a*a
    from math import gcd
    if gcd(a,b)!=1:return False
    p=a*ri(2,5);q=p*b//a
    return NUM(T,3,'a_sim_perim',f"Two similar triangles have perimeters {p*1} cm and {q} cm. The smaller triangle's area is {A*p*p//(a*a)//1 if False else A*(p//a)**2} cm². What is the larger triangle's area, in cm²?",A*(p//a)**2*b*b//(a*a)if False else A*(p//a)**2*(q*q)//(p*p),[f"Scale factor = perimeter ratio = {p}:{q}.",f"Area ratio = {p*p}:{q*q}.",f"Larger area = {A*(p//a)**2} × {q*q}/{p*p}."])
def a_sim_sf():
    a=ri(2,7);b=a+ri(1,5)
    from math import gcd
    if gcd(a,b)!=1:return False
    return MC(T,2,'a_sim_sf',f"The areas of two similar figures are {a*a*4} cm² and {b*b*4} cm². What is the scale factor (smaller:larger)?",f"{a}:{b}",[f"{a*a}:{b*b}",f"{4*a*a}:{4*b*b}",f"{a*a*2}:{b*b*2}",f"{b}:{a}"],["Scale factor is the square root of the area ratio.",f"{a*a*4}:{b*b*4} = {a*a}:{b*b} in lowest terms.",f"√ gives {a}:{b}."])
def a_comp_circ():
    r=ri(2,9)
    return NUM(T,3,'a_comp_circ',f"A circle of radius {r} cm is cut from a square piece of metal with side {2*r} cm. How much metal is left? Use 3.14 for π. Answer in cm².",round(4*r*r-3.14*r*r,2),[f"Square: {2*r}² = {4*r*r}.",f"Circle: 3.14 × {r}² = {round(3.14*r*r,2)}.",f"Left over: {round(4*r*r-3.14*r*r,2)}."],tol=.01)
def a_comp_semi():
    r=ri(2,8)
    return NUM(T,3,'a_comp_semi',f"A square with side {2*r} m has a semicircle on top, with the square's top side as its diameter. Use 3.14 for π. Find the total area in m².",round(4*r*r+3.14*r*r/2,2),[f"Square: {2*r}² = {4*r*r}.",f"Semicircle: ½ × 3.14 × {r}² = {round(3.14*r*r/2,2)}.",f"Total: {round(4*r*r+3.14*r*r/2,2)}."],tol=.02)
def a_isos():
    a,b,c=R.choice(TRI[:2]);k=ri(1,3)
    e=c*k;base=2*a*k;h=b*k
    return NUM(T,3,'a_isos',f"An isosceles triangle has two sides of {e} cm and a base of {base} cm. What is its area in cm²?",base*h//2,[f"The height splits the base in half: {base//2} cm.",f"Height: √({e}² − {base//2}²) = {h} cm.",f"Area = ½ × {base} × {h} = {base*h//2}."])
def a_scale_dbl():
    k=R.choice([2,3,4,5])
    return MC(T,2,'a_scale_dbl',f"Every side of a square is multiplied by {k}. By what factor does its area change?",f"× {k*k}",[f"× {k}",f"× {2*k}",f"× {k**3}"],["Area depends on length × width.",f"Both multiply by {k}.",f"{k} × {k} = {k*k}."])
def a_comp_L():
    a=ri(6,12);b=ri(6,12);c=ri(2,4);d=ri(2,4)
    return NUM(T,2,'a_comp_L',f"A rectangular room is {a} m by {b} m. A rectangular rug {c} m by {d} m cuts one corner off. How many m² of the room are left?",a*b-c*d,[f"Room: {a} × {b} = {a*b}.",f"Cut-out: {c} × {d} = {c*d}.",f"{a*b} − {c*d} = {a*b-c*d}."])
def a_para_tri():
    b=ri(5,14);h=ri(4,12)
    return MC(T,2,'a_para_tri',f"A diagonal splits a parallelogram with base {b} cm and height {h} cm into two triangles. What is the area of each triangle?",f"{fm(Fr(b*h,2))} cm²",[f"{b*h} cm²",f"{b+h} cm²",f"{fm(Fr(b*h,4))} cm²"],["The diagonal makes two congruent triangles.",f"Parallelogram area = {b*h}.",f"Half: {fm(Fr(b*h,2))}."])
for k_ in range(0):pass
def run_area():
    for f,n in [(a_rect,5),(a_rect_p,5),(a_rect_k,4),(a_para,6),(a_tri,6),(a_tri_leg,4),(a_tri_h,5),(a_trap,6),(a_trap_m,4),(a_midseg,3),(a_rhomb,5),(a_rhomb_s,3),(a_eqtri,5),(a_hex,3),(a_reg,5),(a_circ_r,6),(a_circ_d,4),(a_circ_rev,4),(a_area_r,6),(a_area_d,5),(a_area_rev,4),(a_area_314,4),(a_sector,6),(a_arc,6),(a_arc_ang,4),(a_sim_ar,5),(a_sim_a2,5),(a_sim_perim,3),(a_sim_sf,4),(a_comp_circ,4),(a_comp_semi,3),(a_isos,4),(a_scale_dbl,3),(a_comp_L,3),(a_para_tri,3)]:rep(f,n)
    C=[
    (1,"The height of a parallelogram is measured along…","a line perpendicular to the base",["the slanted side","the longer side","the diagonal"],"The height is the perpendicular distance between bases.","Slanted sides are usually longer than the height."),
    (1,"Which unit fits an area?","cm²",["cm","cm³","π cm"],"Area counts squares, so units are squared.","Length uses cm; volume uses cm³."),
    (1,"What is the apothem of a regular polygon?","A segment from the center perpendicular to a side",["A segment from the center to a vertex","A segment joining two vertices","Half the perimeter"],"The apothem meets a side at 90°.","The center-to-vertex segment is the radius."),
    (1,"Which formula gives the area of a triangle?","½ × base × height",["base × height","½ × (b₁ + b₂)","2 × base × height"],"A triangle is half of a parallelogram.","So half of base × height."),
    (1,"Which formula gives circumference?","C = 2πr",["C = πr²","C = 2r²","C = πr"],"Circumference is a length around the circle.","2πr, or πd."),
    (2,"The radius of a circle is tripled. The area is multiplied by…","9",["3","6","27"],"Area uses r².","3² = 9."),
    (2,"The diameter of a circle is doubled. The circumference is multiplied by…","2",["4","π","8"],"C = πd is proportional to d.","Double d, double C."),
    (2,"A trapezoid has bases 6 and 10. Its midsegment is…","8",["16","4","60"],"The midsegment is the average of the bases.","(6 + 10) ÷ 2 = 8."),
    (2,"Which has the larger area: a rectangle 6 × 4, or a parallelogram with sides 6 and 5 slanted so its height is 3?","The rectangle (24 vs 18)",["The parallelogram (30 vs 24)","They are equal","Cannot tell"],"Parallelogram area = base × height = 6 × 3 = 18.","The slant side is not used."),
    (2,"Two rectangles both have perimeter 24 cm. Which has the greatest area?","6 cm × 6 cm",["2 cm × 10 cm","4 cm × 8 cm","1 cm × 11 cm"],"Compute each: 36, 20, 32, 11.","A square gives the most area for a fixed perimeter."),
    (2,"A regular polygon has perimeter 40 and apothem 6. Its area is…","120",["240","46","60"],"Area = ½ × apothem × perimeter.","½ × 6 × 40 = 120."),
    (3,"A sector has a central angle of 90° and radius 8. Another sector of the same circle has area equal to it. What must its central angle be?","90°",["45°","180°","8°"],"Same circle, same area means same fraction.","So the same angle."),
    (3,"Why is area scaled by k² when lengths are scaled by k?","Two dimensions each grow by k",["Perimeter grows by k²","Area is always squared","Angles grow by k"],"Area is length × width.","Both lengths multiply by k."),
    (3,"Two similar figures have areas in ratio 4:9. Their perimeters are in ratio…","2:3",["4:9","16:81","8:27"],"Perimeter ratio is the scale factor.","√(4/9) = 2/3."),
    (3,"A rhombus has diagonals 10 and 24. Its perimeter is…","52",["34","120","68"],"Half-diagonals 5 and 12 make a 5-12-13 triangle.","Side 13, perimeter 4 × 13 = 52."),
    (3,"A circle is inscribed in a square of side 10. The area inside the square but outside the circle is…","100 − 25π",["100 − 10π","100 − 100π","25π"],"The radius is 5.","Square 100 minus circle 25π."),
    ]
    for i,(l,q,g,bd,s1,s2) in enumerate(C):MC(T,l,f'a_c{i}',q,g,bd,[s1,s2],w=s2)
    put(dict(t=T,l=2,type='multi',q="Select ALL that are formulas for the area of a trapezoid with bases b₁, b₂ and height h.",o=["½h(b₁ + b₂)","h × (b₁ + b₂) ÷ 2","(midsegment) × h","h × b₁ × b₂"],a=[0,1,2],sol=["The midsegment is (b₁ + b₂)/2.","So all three first ones agree; the last multiplies the bases."],w="Area = average base × height.",fp='a_mu1'))
    put(dict(t=T,l=1,type='multi',q="Select ALL the figures whose area is base × height.",o=["Rectangle","Parallelogram","Triangle","Trapezoid"],a=[0,1],sol=["Rectangle and parallelogram use b × h.","Triangle and trapezoid have a ½."],w="Triangle and trapezoid need a ½.",fp='a_mu2'))
    put(dict(t=T,l=1,type='match',q="Match each shape to its area formula.",pairs=[["Rectangle","l × w"],["Triangle","½bh"],["Circle","πr²"],["Rhombus","½d₁d₂"]],sol=["Rectangle: length × width.","Triangle: half base × height.","Circle: π r².","Rhombus: half the product of diagonals."],w="Each shape has its own formula.",fp='a_ma1'))
    put(dict(t=T,l=2,type='match',q="Match each scale factor to the ratio of areas.",pairs=[["1:2","1:4"],["2:3","4:9"],["3:5","9:25"],["1:10","1:100"]],sol=["Area ratio is the scale factor squared.","1² : 2² = 1:4, 2² : 3² = 4:9, and so on."],w="Square both parts of the ratio.",fp='a_ma2'))
    put(dict(t=T,l=2,type='order',q="Put the steps in order to find the area of a regular polygon.",items=["Find the perimeter","Find the apothem","Multiply apothem by perimeter","Take half of that product"],sol=["Perimeter = number of sides × side length.","Use the apothem with it: ½ × a × P."],w="Area = ½ a P.",fp='a_or1'))
    put(dict(t=T,l=2,type='order',q="Put the steps in order to find an arc length.",items=["Find the circumference","Write the fraction angle/360","Multiply the fraction by the circumference"],sol=["Arc length is a part of the circumference.","Part = fraction × whole."],w="Arc = (angle/360) × 2πr.",fp='a_or2'))
# =========================== SOL
T='sol'
def s_box():
    l=ri(3,12);w=ri(2,9);h=ri(2,9)
    return NUM(T,1,'s_box',"Find the volume of the box in cm³.",l*w*h,["V = length × width × height.",f"{l} × {w} × {h} = {l*w*h}."],svg=box_svg(f"{l} cm",f"{w} cm",f"{h} cm"))
def s_cube_sa():
    s=ri(2,12)
    return NUM(T,1,'s_cube_sa',f"What is the total surface area of a cube with edge {s} cm, in cm²?",6*s*s,["A cube has 6 equal square faces.",f"One face: {s}² = {s*s}.",f"6 × {s*s} = {6*s*s}."])
def s_box_sa():
    l=ri(3,10);w=ri(2,8);h=ri(2,8)
    return NUM(T,2,'s_box_sa',"Find the total surface area of the box in cm².",2*(l*w+l*h+w*h),["Three pairs of faces: l×w, l×h, w×h.",f"{l*w} + {l*h} + {w*h} = {l*w+l*h+w*h}.","Double it: "+str(2*(l*w+l*h+w*h))+"."],svg=box_svg(f"{l} cm",f"{w} cm",f"{h} cm"))
def s_diag():
    a,b,c=R.choice([(2,3,6),(1,4,8),(4,4,7),(2,6,9),(6,6,7),(2,10,11),(4,8,8)]);k=R.choice([1,1,2])
    a,b,c=a*k,b*k,c*k;d=int(math.isqrt(a*a+b*b+c*c))
    return NUM(T,3,'s_diag',f"A box measures {a} by {b} by {c}. How long is the longest straight line inside it, from one corner to the opposite corner?",d,["Space diagonal d = √(l² + w² + h²).",f"{a*a} + {b*b} + {c*c} = {a*a+b*b+c*c}.",f"√{a*a+b*b+c*c} = {d}."])
def s_trprism():
    a=ri(3,10);b=2*ri(2,5);h=ri(4,12)
    return NUM(T,2,'s_trprism',"The bases of this prism are right triangles. Find its volume in cm³.",a*b*h//2,["Base area = ½ × legs: "+f"½ × {a} × {b} = {a*b//2}.","V = base area × height.",f"{a*b//2} × {h} = {a*b*h//2}."],svg=prism_svg(f"{a} cm",f"{b} cm",f"{h} cm"))
def s_lat():
    l=ri(3,9);w=ri(2,8);h=ri(3,10)
    return NUM(T,2,'s_lat',f"A prism has a rectangular base {l} cm by {w} cm and is {h} cm tall. What is its lateral area in cm²?",2*(l+w)*h,[f"Base perimeter = 2({l} + {w}) = {2*(l+w)}.","Lateral area = perimeter × height.",f"{2*(l+w)} × {h} = {2*(l+w)*h}."])
def s_cyl_v():
    r=ri(2,9);h=ri(3,12)
    return NUM(T,1,'s_cyl_v',"Find the volume of the cylinder. Give the number that goes with π.",r*r*h,["V = πr²h.",f"{r}² × {h} = {r*r*h}.",f"V = {r*r*h}π cm³."],pi=True,show=pc(r*r*h),svg=cyl_svg(f"{r} cm",f"{h} cm"))
def s_cyl_l():
    r=ri(2,9);h=ri(3,12)
    return NUM(T,2,'s_cyl_l',"Find the lateral area of the cylinder. Give the number that goes with π.",2*r*h,["Lateral area = 2πrh (a rolled-up rectangle).",f"2 × {r} × {h} = {2*r*h}.",f"{2*r*h}π cm²."],pi=True,show=pc(2*r*h),svg=cyl_svg(f"{r} cm",f"{h} cm"))
def s_cyl_t():
    r=ri(2,8);h=ri(3,12)
    return NUM(T,2,'s_cyl_t',f"A cylinder has radius {r} cm and height {h} cm. What is its total surface area? Give the number that goes with π.",2*r*h+2*r*r,["Two circle bases: 2πr² = "+f"{2*r*r}π.",f"Side: 2πrh = {2*r*h}π.",f"Total {2*r*h+2*r*r}π cm²."],pi=True,show=pc(2*r*h+2*r*r))
def s_cyl_h():
    r=ri(2,8);h=ri(3,12)
    return NUM(T,3,'s_cyl_h',f"A cylinder with radius {r} cm has volume {r*r*h}π cm³. How tall is it, in cm?",h,[f"πr²h = {r*r*h}π.",f"r² = {r*r}, so {r*r}h = {r*r*h}.",f"h = {h}."])
def s_cone_v():
    r=3*ri(1,4);h=ri(3,10)
    return NUM(T,2,'s_cone_v',"Find the volume of the cone. Give the number that goes with π.",r*r*h//3,["V = ⅓πr²h.",f"⅓ × {r*r} × {h} = {r*r*h//3}.",f"V = {r*r*h//3}π cm³."],pi=True,show=pc(r*r*h//3),svg=cone_svg(f"{r} cm",f"{h} cm"))
def s_cone_vl():
    a,b,c=R.choice(TRI[:3]);k=ri(1,2) if a<5 else 1
    if R.random()<.5:r,h=a*k,b*k
    else:r,h=b*k,a*k
    l=c*k
    if (r*r*h)%3:return False
    return NUM(T,3,'s_cone_vl',f"A cone has radius {r} cm and slant height {l} cm. What is its volume? Give the number that goes with π.",r*r*h//3,[f"Height from the right triangle: √({l}² − {r}²) = {h} cm.","V = ⅓πr²h.",f"⅓ × {r*r} × {h} = {r*r*h//3}, so {r*r*h//3}π cm³."],pi=True,show=pc(r*r*h//3),svg=cone_svg(f"{r} cm",None,f"{l} cm"))
def s_cone_lat():
    r=ri(2,10);l=r+ri(1,8)
    return NUM(T,2,'s_cone_lat',f"A cone has radius {r} cm and slant height {l} cm. What is its lateral area? Give the number that goes with π.",r*l,["Lateral area = πrl.",f"{r} × {l} = {r*l}.",f"{r*l}π cm²."],pi=True,show=pc(r*l),svg=cone_svg(f"{r} cm",None,f"{l} cm"))
def s_cone_t():
    a,b,c=R.choice(TRI[:3]);r=a;l=c
    return NUM(T,3,'s_cone_t',f"A cone has radius {r} cm and height {b} cm. What is its total surface area? Give the number that goes with π.",r*l+r*r,[f"Slant height = √({r}² + {b}²) = {l} cm.",f"Lateral: πrl = {r*l}π. Base: πr² = {r*r}π.",f"Total: {r*l+r*r}π cm²."],pi=True,show=pc(r*l+r*r),svg=cone_svg(f"{r} cm",f"{b} cm"))
def s_sph_sa():
    r=ri(2,12)
    return NUM(T,1,'s_sph_sa',"Find the surface area of the sphere. Give the number that goes with π.",4*r*r,["SA = 4πr².",f"4 × {r*r} = {4*r*r}.",f"{4*r*r}π cm²."],pi=True,show=pc(4*r*r),svg=sph_svg(f"{r} cm"))
def s_sph_v():
    r=3*ri(1,5)
    v=4*r**3//3
    return NUM(T,2,'s_sph_v',"Find the volume of the sphere. Give the number that goes with π.",v,["V = (4/3)πr³.",f"{r}³ = {r**3}; (4/3) × {r**3} = {v}.",f"V = {v}π cm³."],pi=True,show=pc(v),svg=sph_svg(f"{r} cm"))
def s_sph_rev():
    r=ri(2,11)
    return NUM(T,3,'s_sph_rev',f"A sphere has surface area {4*r*r}π cm². What is its radius in cm?",r,[f"4πr² = {4*r*r}π.",f"r² = {r*r}.",f"r = {r}."])
def s_hemi():
    r=ri(2,10)
    return NUM(T,3,'s_hemi',f"A solid hemisphere has radius {r} cm. What is its total surface area (curved part plus flat circle)? Give the number that goes with π.",3*r*r,[f"Curved part: half of 4πr² = {2*r*r}π.",f"Flat circle: πr² = {r*r}π.",f"Total {3*r*r}π cm²."],pi=True,show=pc(3*r*r))
def s_pyr_v():
    s=3*ri(1,4);h=ri(3,10)
    return NUM(T,2,'s_pyr_v',"The pyramid has a square base. Find its volume in cm³.",s*s*h//3,["V = ⅓ × base area × height.",f"Base: {s} × {s} = {s*s}.",f"⅓ × {s*s} × {h} = {s*s*h//3}."],svg=pyr_svg(f"{s} cm",f"{h} cm"))
def s_pyr_lat():
    s=2*ri(2,7);l=ri(5,12)
    return NUM(T,3,'s_pyr_lat',f"A square pyramid has base edge {s} cm and slant height {l} cm. What is its lateral area in cm²?",2*s*l,["Each of 4 faces is a triangle: ½ × base × slant height.",f"½ × {s} × {l} = {s*l//2}.",f"4 × {s*l//2} = {2*s*l}."],svg=pyr_svg(f"{s} cm",None,f"{l} cm"))
def s_pyr_h():
    a,b,c=R.choice(TRI[:3]);k=ri(1,2) if a<5 else 1
    s=2*a*k;l=c*k;h=b*k
    if (s*s*h)%3:return False
    return NUM(T,3,'s_pyr_h',f"A square pyramid has base edge {s} cm and slant height {l} cm. What is its volume in cm³?",s*s*h//3,[f"Half the base is {a*k}. Height = √({l}² − {a*k}²) = {h}.",f"Base area = {s*s}.",f"V = ⅓ × {s*s} × {h} = {s*s*h//3}."],svg=pyr_svg(f"{s} cm",None,f"{l} cm"))
def s_sim_vol():
    a=ri(1,4);b=a+ri(1,3);from_=ri(2,6)
    from math import gcd
    if gcd(a,b)!=1:return False
    V=from_*a**3
    return NUM(T,2,'s_sim_vol',f"Two similar solids have a scale factor {a}:{b}. The smaller has volume {V} cm³. What is the volume of the larger, in cm³?",from_*b**3,[f"Volume ratio = {a}³ : {b}³ = {a**3}:{b**3}.",f"Smaller = {from_} × {a**3}.",f"Larger = {from_} × {b**3} = {from_*b**3}."])
def s_sim_ratio():
    a=ri(1,6);b=a+ri(1,5)
    from math import gcd
    if gcd(a,b)!=1:return False
    return MC(T,2,'s_sim_ratio',f"Two similar prisms have a scale factor of {a}:{b}. What is the ratio of their volumes?",f"{a**3}:{b**3}",[f"{a*a}:{b*b}",f"{a}:{b}",f"{3*a}:{3*b}"],["Volumes compare as the cube of the scale factor.",f"{a}³ : {b}³ = {a**3}:{b**3}."])
def s_sim_sa():
    a=ri(1,6);b=a+ri(1,5)
    from math import gcd
    if gcd(a,b)!=1:return False
    return MC(T,2,'s_sim_sa',f"Two similar cylinders have a scale factor of {a}:{b}. What is the ratio of their surface areas?",f"{a*a}:{b*b}",[f"{a**3}:{b**3}",f"{a}:{b}",f"{a*a}:{b**3}"],["Surface areas compare as the square of the scale factor.",f"{a}² : {b}² = {a*a}:{b*b}."])
def s_sim_rev():
    a=ri(2,6);b=a+ri(1,3)
    from math import gcd
    if gcd(a,b)!=1:return False
    return MC(T,3,'s_sim_rev',f"The volumes of two similar solids are {a**3*8} cm³ and {b**3*8} cm³. What is the ratio of their surface areas?",f"{a*a}:{b*b}",[f"{a}:{b}",f"{a**3}:{b**3}",f"{a*a*8}:{b*b*8}"],["Volume ratio reduces to "+f"{a**3}:{b**3}.",f"Scale factor = cube root = {a}:{b}.",f"Surface area ratio = {a*a}:{b*b}."])
def s_sim_sav():
    a=ri(2,5);b=a+ri(1,3)
    from math import gcd
    if gcd(a,b)!=1:return False
    return MC(T,3,'s_sim_sav',f"Two similar solids have surface areas in the ratio {a*a}:{b*b}. What is the ratio of their volumes?",f"{a**3}:{b**3}",[f"{a*a}:{b*b}",f"{a**4}:{b**4}",f"{a}:{b}"],[f"Scale factor = √ of {a*a}:{b*b} = {a}:{b}.",f"Volume ratio = {a}³ : {b}³ = {a**3}:{b**3}."])
def s_euler():
    F=ri(5,12);V=ri(6,14);E=F+V-2
    return NUM(T,2,'s_euler',f"A polyhedron has {F} faces and {V} vertices. How many edges does it have?",E,["Euler's formula: V + F = E + 2.",f"{V} + {F} = E + 2.",f"E = {V+F} − 2 = {E}."])
def s_can():
    r=ri(2,6);h=ri(5,12)
    return NUM(T,2,'s_can',f"A can has diameter {2*r} cm and height {h} cm. The paper label wraps the side once with no overlap. How many cm² is the label? Give the number that goes with π.",2*r*h,["The label is the lateral area: 2πrh.",f"r = {r}, so 2 × {r} × {h} = {2*r*h}.",f"{2*r*h}π cm²."],pi=True,show=pc(2*r*h))
def s_comp():
    r=3*ri(1,3);h=ri(4,10)
    c=r*r*h+2*r**3//3
    return NUM(T,3,'s_comp',f"A silo is a cylinder with radius {r} m and height {h} m, topped with a hemisphere of the same radius. Find its total volume. Give the number that goes with π.",c,[f"Cylinder: π({r})²({h}) = {r*r*h}π.",f"Hemisphere: ½ × (4/3)π({r})³ = {2*r**3//3}π.",f"Total {c}π m³."],pi=True,show=pc(c))
def s_fill():
    r=ri(2,6);h=ri(5,10)
    v=r*r*h
    return NUM(T,3,'s_fill',f"A cone and a cylinder have the same radius {r} cm and height {h} cm. How much more does the cylinder hold than the cone, in cm³? Give the number that goes with π.",Fr(2*v,3) if (2*v)%3==0 else None,["Cylinder: πr²h. Cone: ⅓ of that.","The difference is ⅔ of the cylinder.",f"⅔ × {v} = {2*v//3}π."],pi=True,show=pc(2*v//3)) if (2*v)%3==0 else False
def s_nets():
    return False
def run_sol():
    for f,n in [(s_box,5),(s_cube_sa,4),(s_box_sa,5),(s_diag,4),(s_trprism,5),(s_lat,4),(s_cyl_v,6),(s_cyl_l,4),(s_cyl_t,5),(s_cyl_h,4),(s_cone_v,5),(s_cone_vl,4),(s_cone_lat,4),(s_cone_t,4),(s_sph_sa,6),(s_sph_v,5),(s_sph_rev,3),(s_hemi,3),(s_pyr_v,5),(s_pyr_lat,4),(s_pyr_h,3),(s_sim_vol,5),(s_sim_ratio,5),(s_sim_sa,4),(s_sim_rev,3),(s_sim_sav,3),(s_euler,4),(s_can,3),(s_comp,3),(s_fill,3)]:rep(f,n)
    C=[
    (1,"What is the name of a solid with two parallel congruent circular bases?","Cylinder",["Cone","Sphere","Prism with square bases"],"Two congruent circles joined by a curved side.","That is a cylinder."),
    (1,"How many faces does a cube have?","6",["4","8","12"],"A cube has six square faces.","Count: top, bottom, 4 sides."),
    (1,"How many vertices does a rectangular prism have?","8",["6","12","4"],"Four corners on top, four on the bottom.","8 vertices, 12 edges, 6 faces."),
    (1,"Which unit fits volume?","cm³",["cm","cm²","π cm"],"Volume counts cubes.","Cubic units."),
    (1,"The lateral faces of a pyramid are…","triangles",["rectangles","circles","trapezoids"],"They meet at the apex.","Each lateral face is a triangle."),
    (1,"Which solid has no flat faces?","Sphere",["Cone","Cylinder","Pyramid"],"A sphere is all curved.","Cones and cylinders have flat bases."),
    (2,"What is the slant height of a cone?","Distance from the apex to a point on the base edge, along the side",["Distance from the apex to the center of the base","The diameter of the base","The radius of the base"],"It lies on the surface.","The height goes inside the cone."),
    (2,"A cone and a cylinder have the same base and height. The cone's volume is…","one third of the cylinder's",["half of the cylinder's","equal to the cylinder's","two thirds of the cylinder's"],"Cone: ⅓πr²h; cylinder: πr²h.","So one third."),
    (2,"The radius of a sphere doubles. The volume is multiplied by…","8",["2","4","6"],"Volume uses r³.","2³ = 8."),
    (2,"The radius of a sphere doubles. The surface area is multiplied by…","4",["2","8","6"],"Surface area uses r².","2² = 4."),
    (2,"Which can be found with only the base area and the height?","Volume of any prism",["Surface area of a prism","Slant height of a cone","Lateral area of a pyramid"],"V = Bh for every prism.","Surface area needs perimeters or side faces too."),
    (2,"A cylinder's height is doubled; the radius stays. Its volume is multiplied by…","2",["4","8","π"],"V = πr²h is proportional to h.","Double h, double V."),
    (3,"A cylinder's radius is doubled; the height stays. Its volume is multiplied by…","4",["2","8","16"],"V = πr²h; r is squared.","2² = 4."),
    (3,"A cube has volume 64 cm³. What is its total surface area?","96 cm²",["16 cm²","64 cm²","384 cm²"],"Edge = ∛64 = 4.","6 × 4² = 96."),
    (3,"A cube's edge grows by 50%. By what factor does the volume grow?","3.375",["1.5","2.25","4.5"],"Edge × 1.5.","1.5³ = 3.375."),
    (3,"Two similar jars have heights 10 cm and 15 cm. The smaller holds 200 mL. How much does the larger hold?","675 mL",["300 mL","450 mL","1350 mL"],"Scale factor 2:3.","Volume × 27/8: 200 × 27/8 = 675."),
    (3,"A sphere fits snugly inside a cylinder (same radius, height = diameter). The sphere's volume is what fraction of the cylinder's?","⅔",["½","⅓","¾"],"Cylinder: 2πr³. Sphere: (4/3)πr³.","(4/3) ÷ 2 = ⅔."),
    ]
    for i,(l,q,g,bd,s1,s2) in enumerate(C):MC(T,l,f's_c{i}',q,g,bd,[s1,s2],w=s2)
    put(dict(t=T,l=2,type='multi',q="Select ALL the solids with volume V = Bh (base area × height).",o=["Rectangular prism","Cylinder","Triangular prism","Cone"],a=[0,1,2],sol=["Prisms and cylinders have equal bases top and bottom.","A cone narrows to a point, so it has a ⅓."],w="Cones and pyramids carry the ⅓.",fp='s_mu1'))
    put(dict(t=T,l=1,type='multi',q="Select ALL the solids that have a circular base.",o=["Cylinder","Cone","Square pyramid","Triangular prism"],a=[0,1],sol=["Cylinders and cones have circle bases.","Pyramids and prisms here have polygon bases."],w="Cylinder and cone.",fp='s_mu2'))
    put(dict(t=T,l=1,type='match',q="Match each solid to its volume formula.",pairs=[["Prism","V = Bh"],["Cylinder","V = πr²h"],["Cone","V = ⅓πr²h"],["Sphere","V = (4/3)πr³"]],sol=["Prism: base area × height.","Cylinder: circle base × height.","Cone: a third of its cylinder.","Sphere: (4/3)πr³."],w="Learn all four.",fp='s_ma1'))
    put(dict(t=T,l=2,type='match',q="Match each scale factor to the ratio of volumes of similar solids.",pairs=[["1:2","1:8"],["2:3","8:27"],["1:3","1:27"],["3:4","27:64"]],sol=["Cube each part of the scale factor.","2³ = 8, 3³ = 27, 4³ = 64."],w="Cube the scale factor.",fp='s_ma2'))
    put(dict(t=T,l=2,type='order',q="Put the steps in order to find the volume of a cone when you know radius and slant height.",items=["Use the Pythagorean Theorem to find the height","Square the radius","Multiply by the height","Divide by 3 and attach π"],sol=["Slant height is the hypotenuse of the right triangle (r, h).","Then use V = ⅓πr²h."],w="Find h first.",fp='s_or1'))
    put(dict(t=T,l=2,type='order',q="Order these from smallest to largest volume, same radius 3 and height 3.",items=["Cone","Hemisphere (radius 3)","Cylinder"],sol=["Cone: 9π. Hemisphere: 18π. Cylinder: 27π."],w="9π < 18π < 27π.",fp='s_or2'))
# =========================== CRD
T='crd'
def c_dist_g():
    a,b,c=R.choice(TRI[:1]+[(6,8,10)])
    dx,dy=(a,b) if R.random()<.5 else (b,a)
    sx=R.choice([-1,1]);sy=R.choice([-1,1])
    x1=ri(-6,6);y1=ri(-6,6);x2=x1+sx*dx;y2=y1+sy*dy
    if abs(x2)>6 or abs(y2)>6:return False
    pts=[('P',x1,y1),('Q',x2,y2)]
    return NUM(T,2,'c_dist_g',f"Find the distance between P{Pt(x1,y1)} and Q{Pt(x2,y2)}.",c,[f"Horizontal change = {abs(x2-x1)}, vertical change = {abs(y2-y1)}.",f"d = √({dx*dx} + {dy*dy}) = √{c*c}.",f"d = {c}."],svg=grid_svg(pts))
def c_dist_t():
    a,b,c=R.choice(TRI);k=ri(1,3) if a<5 else 1
    dx,dy=(a*k,b*k) if R.random()<.5 else (b*k,a*k)
    x1=ri(-8,8);y1=ri(-8,8);x2=x1+R.choice([-1,1])*dx;y2=y1+R.choice([-1,1])*dy
    return NUM(T,2,'c_dist_t',f"Find the distance between A{Pt(x1,y1)} and B{Pt(x2,y2)}.",c*k,["d = √((x₂ − x₁)² + (y₂ − y₁)²).",f"= √({dx*dx} + {dy*dy}) = √{c*c*k*k}.",f"d = {c*k}."])
def c_dist_r():
    x1=ri(-7,7);y1=ri(-7,7);dx=ri(1,7);dy=ri(1,7)
    x2=x1+R.choice([-1,1])*dx;y2=y1+R.choice([-1,1])*dy
    n=dx*dx+dy*dy
    if int(math.isqrt(n))**2==n:return False
    good=sq(n);bd=[str(n),sq(dx+dy) if False else f"√{dx+dy}",f"{dx+dy}",sq(abs(dx*dx-dy*dy)) if dx!=dy else "0"]
    return MC(T,2,'c_dist_r',f"What is the distance between {Pt(x1,y1)} and {Pt(x2,y2)}? (Exact answer)",good,bd,["Use d = √(Δx² + Δy²).",f"Δx = {dx}, Δy = {dy}: {dx*dx} + {dy*dy} = {n}.",f"d = √{n} = {good}."])
def c_mid():
    x1=ri(-9,9);y1=ri(-9,9);x2=x1+2*ri(-5,5);y2=y1+2*ri(-5,5)
    if (x1,y1)==(x2,y2):return False
    mx=(x1+x2)//2;my=(y1+y2)//2
    pts=[('A',x1,y1),('B',x2,y2)]
    return MC(T,1,'c_mid',f"What is the midpoint of A{Pt(x1,y1)} and B{Pt(x2,y2)}?",Pt(mx,my),[Pt(x1+x2,y1+y2),Pt((x2-x1)//2,(y2-y1)//2),Pt(my,mx),Pt(mx+1,my-1)],["Average the x-coordinates and average the y-coordinates.",f"x: ({x1} + {x2 if x2>=0 else '('+str(x2)+')'}) ÷ 2 = {mx}.",f"y: ({y1} + {y2 if y2>=0 else '('+str(y2)+')'}) ÷ 2 = {my}."],svg=grid_svg(pts,rng=rg((x1,y1),(x2,y2))) if max(abs(x1),abs(x2),abs(y1),abs(y2))<=6 else None)
def c_mid_x():
    x1=ri(-9,9);x2=x1+2*ri(1,8)
    return NUM(T,1,'c_mid_x',f"Segment CD has endpoints C({N(x1)}, {ri(-5,5)}) and D({N(x2)}, {ri(-5,5)}). What is the x-coordinate of its midpoint?",(x1+x2)//2,["Add the x-coordinates and divide by 2.",f"({x1} + {x2}) ÷ 2 = {(x1+x2)//2}."])
def c_endpt():
    mx=ri(-6,6);my=ri(-6,6);x1=ri(-8,8);y1=ri(-8,8)
    x2=2*mx-x1;y2=2*my-y1
    if (x2,y2)==(x1,y1):return False
    return MC(T,2,'c_endpt',f"M{Pt(mx,my)} is the midpoint of AB and A is {Pt(x1,y1)}. What are the coordinates of B?",Pt(x2,y2),[Pt(mx-x1,my-y1),Pt(mx+x1,my+y1),Pt(2*x1-mx,2*y1-my),Pt(x1+2*(mx-x1)+1,y2)],[f"M is the average: {mx} = ({x1} + x)/2.",f"x = 2({mx}) − ({x1}) = {x2}; y = 2({my}) − ({y1}) = {y2}.",f"B = {Pt(x2,y2)}."])
def c_slope_i():
    m=R.choice([-3,-2,-1,1,2,3]);x1=ri(-4,2);y1=ri(-4,3);dx=ri(1,2);x2=x1+dx;y2=y1+m*dx
    if abs(y2)>6:return False
    return NUM(T,1,'c_slope_i',f"Find the slope of the line through P{Pt(x1,y1)} and Q{Pt(x2,y2)}.",m,["Slope = rise ÷ run = (y₂ − y₁)/(x₂ − x₁).",f"({y2} − {y1})/({x2} − {x1}) = {y2-y1}/{dx}.",f"= {m}."],svg=grid_svg([('P',x1,y1),('Q',x2,y2)]))
def c_slope_f():
    x1=ri(-8,8);y1=ri(-8,8);dx=ri(2,7);dy=ri(-7,7)
    f=Fr(dy,dx)
    if dy==0 or abs(f)==1 or f.denominator==1:return False
    x2=x1+dx;y2=y1+dy
    g=fq(f);bd=[fq(-f),fq(1/f),fq(-1/f)]
    return MC(T,2,'c_slope_f',f"What is the slope of the line through {Pt(x1,y1)} and {Pt(x2,y2)}?",g,bd,["Slope = (y₂ − y₁) ÷ (x₂ − x₁).",f"Rise = {dy}, run = {dx}.",f"Slope = {g}."])
def c_slope_std():
    A=ri(1,6);B=ri(2,7);C=ri(1,12)
    from math import gcd
    if gcd(A,B)!=1:return False
    s=Fr(-A,B)
    return MC(T,2,'c_slope_std',f"What is the slope of the line {A}x + {B}y = {C}?",fq(s),[fq(-s),fq(1/s),fq(-1/s)],[f"Solve for y: {B}y = −{A}x + {C}.",f"y = ({fq(s)})x + {fm(Fr(C,B))}.","Slope is the coefficient of x."])
def c_par():
    m=ri(-6,6);b=ri(-8,8)
    if m==0:return False
    return NUM(T,1,'c_par',f"A line has equation y = {N(m)}x {sg(b).replace('+','+')}. What is the slope of any line parallel to it?",m,["Parallel lines have equal slopes.",f"The slope is {m}."])
def c_perp_s():
    a=ri(1,7);b=ri(2,8)
    from math import gcd
    if gcd(a,b)!=1:return False
    s=R.choice([1,-1])*Fr(a,b)
    return MC(T,2,'c_perp_s',f"A line has slope {fq(s)}. What is the slope of a line perpendicular to it?",fq(-1/s),[fq(s),fq(-s),fq(1/s)],["Perpendicular slopes are negative reciprocals.","Flip the fraction and change the sign.",f"{fq(-1/s)}."])
def c_perp_i():
    m=nzr()
    return NUM(T,1,'c_perp_i',f"What is the slope of a line perpendicular to a line with slope {N(m)}? Enter a decimal or fraction like 1/3.",float(Fr(-1,m)),["Perpendicular slopes multiply to −1.",f"{m} × s = −1.",f"s = {fq(Fr(-1,m))}."],tol=.01,show=fq(Fr(-1,m)))
def nzr():
    m=0
    while m==0 or abs(m)==1:m=ri(-8,8)
    return m
def c_line2():
    m=R.choice([-3,-2,-1,1,2,3]);b=ri(-6,6);x1=ri(-4,0);x2=x1+ri(1,3)
    y1=m*x1+b;y2=m*x2+b
    g=lin_str(m,b)
    return MC(T,2,'c_line2',f"Which equation describes the line through {Pt(x1,y1)} and {Pt(x2,y2)}?",g,[lin_str(-m,b),lin_str(m,-b),lin_str(b,m)],[f"Slope = ({y2} − ({y1}))/({x2} − ({x1})) = {m}.",f"Use y = mx + b with the point {Pt(x1,y1)}: b = {y1} − ({m})({x1}) = {b}.",f"{g}."])
def c_par_line():
    m=R.choice([-3,-2,2,3,Fr(1,2),Fr(-1,2),Fr(2,3),Fr(-3,2)]);m=Fr(m)
    x0=m.denominator*ri(-3,3);y0=ri(-6,6);b=y0-m*x0
    return MC(T,3,'c_par_line',f"Which line passes through {Pt(x0,y0)} and is parallel to {lin_str(m,ri(-5,5))}?",lin_str(m,b),[lin_str(-1/m,b),lin_str(m,y0),lin_str(-m,b),lin_str(m,-b)],["Parallel means the same slope: "+fq(m)+".",f"Plug in {Pt(x0,y0)}: b = {y0} − ({fq(m)})({x0}) = {fm(b)}.",f"{lin_str(m,b)}."])
def c_perp_line():
    a=ri(1,4);bb=ri(2,5)
    from math import gcd
    if gcd(a,bb)!=1:return False
    m=R.choice([1,-1])*Fr(a,bb);t=ri(-2,2);x0=a*t;y0=ri(-5,5)
    pm_=-1/m;b=y0-pm_*x0
    return MC(T,3,'c_perp_line',f"Which line passes through {Pt(x0,y0)} and is perpendicular to {lin_str(m,ri(-4,4))}?",lin_str(pm_,b),[lin_str(m,y0-m*x0),lin_str(pm_,y0),lin_str(-m,y0+m*x0),lin_str(pm_,-b)],[f"Perpendicular slope = negative reciprocal = {fq(pm_)}.",f"b = {y0} − ({fq(pm_)})({x0}) = {fm(b)}.",f"{lin_str(pm_,b)}."])
def c_yint():
    m=nzr();x0=ri(-4,4);y0=ri(-9,9);b=y0-m*x0
    return NUM(T,2,'c_yint',f"A line has slope {N(m)} and passes through {Pt(x0,y0)}. Where does it cross the y-axis? Give the y-value.",b,[f"Use y = mx + b: {y0} = ({m})({x0}) + b.",f"b = {y0} − ({m*x0}).",f"b = {b}."])
def c_ptslope():
    m=R.choice([-3,-2,2,3,4]);x0=ri(-5,5);y0=ri(-6,6)
    f=lambda a,b,c:f"y {('−' if b>0 else '+')} {abs(b)} = {N(a)}(x {('−' if c>0 else '+')} {abs(c)})"
    return MC(T,2,'c_ptslope',f"Which is the point-slope form of the line with slope {N(m)} through {Pt(x0,y0)}?",f(m,y0,x0),[f(m,-y0,-x0),f(m,x0,y0),f(-m,y0,x0)],["Point-slope: y − y₁ = m(x − x₁).",f"y₁ = {y0}, x₁ = {x0}, m = {m}.",f"{f(m,y0,x0)}."]) if x0!=0 and y0!=0 else False
def c_circ_eq():
    h=ri(-6,6);k=ri(-6,6);r=ri(2,9)
    if h==0 or k==0:return False
    g=cir_eq(h,k,r*r)
    return MC(T,2,'c_circ_eq',f"Which is the equation of a circle with center {Pt(h,k)} and radius {r}?",g,[cir_eq(-h,-k,r*r),cir_eq(h,k,r),cir_eq(-h,k,r*r),cir_eq(h,-k,r*r)],["Circle: (x − h)² + (y − k)² = r².",f"h = {h}, k = {k}, r² = {r*r}.",f"{g}."])
def c_circ_r():
    h=ri(-6,6);k=ri(-6,6);r=ri(2,11)
    return NUM(T,2,'c_circ_r',f"A circle has equation {cir_eq(h,k,r*r)}. What is its radius?",r,["The right side is r².",f"r² = {r*r}.",f"r = {r}."])
def c_circ_c():
    h=ri(-7,7);k=ri(-7,7);r=ri(2,9)
    if h==0 or k==0 or abs(h)==abs(k):return False
    return MC(T,2,'c_circ_c',f"What is the center of the circle {cir_eq(h,k,r*r)}?",Pt(h,k),[Pt(-h,-k),Pt(k,h),Pt(-h,k)],["In (x − h)² the center's x is h. In (x + 3)², h = −3.",f"So the center is {Pt(h,k)}."])
def c_circ_pt():
    h=ri(-3,3);k=ri(-3,3);a,b,c=R.choice(TRI[:2])
    r=c;kind=R.choice(['on','in','out'])
    if kind=='on':px,py=h+a,k+b
    elif kind=='in':px,py=h+ri(1,3),k+ri(-2,2)
    else:px,py=h+c+ri(1,3),k+ri(1,3)
    d2=(px-h)**2+(py-k)**2
    ans='On the circle' if d2==r*r else 'Inside the circle' if d2<r*r else 'Outside the circle'
    if kind=='in' and d2>=r*r:return False
    return MC(T,3,'c_circ_pt',f"A circle has center {Pt(h,k)} and radius {r}. Where is the point {Pt(px,py)}?",ans,[x for x in ['On the circle','Inside the circle','Outside the circle','At the center'] if x!=ans],[f"Distance² from the center = {(px-h)**2} + {(py-k)**2} = {d2}.",f"Radius² = {r*r}.",ans+"."])
def c_diam():
    cx=ri(-5,5);cy=ri(-5,5);p=ri(1,5);q=ri(1,5)
    A=(cx-p,cy-q);B=(cx+p,cy+q)
    return MC(T,3,'c_diam',f"Segment AB with A{Pt(*A)} and B{Pt(*B)} is a diameter of a circle. Which is the circle's equation?",cir_eq(cx,cy,p*p+q*q),[cir_eq(cx,cy,2*(p*p+q*q)),cir_eq(cx,cy,p+q),cir_eq(-cx,-cy,p*p+q*q),cir_eq(cx,cy,4*(p*p+q*q))],["Center = midpoint of AB.",f"Radius² = (distance from center to B)² = {p}² + {q}² = {p*p+q*q}.",f"{cir_eq(cx,cy,p*p+q*q)}."]) if cx!=0 and cy!=0 else False
def _cls(P):
    (a,b,c)=P
    d=lambda u,v:(u[0]-v[0])**2+(u[1]-v[1])**2
    s=sorted([d(a,b),d(b,c),d(a,c)])
    if s[0]==0:return None
    right=s[0]+s[1]==s[2]
    iso=len(set(s))<3
    return ('Isosceles right' if iso else 'Scalene right') if right else ('Isosceles, not right' if iso else 'Scalene, not right')
_tc=[0]
def c_tri_cls():
    tgt=['Isosceles right','Scalene right','Isosceles, not right','Scalene, not right'][_tc[0]%4];_tc[0]+=1
    for _ in range(400):
        P=[(ri(-5,5),ri(-5,5)) for _ in range(3)]
        if _cls(P)==tgt:break
    else:return False
    pts=[(n,x,y) for n,(x,y) in zip('ABC',P)]
    d=lambda u,v:(u[0]-v[0])**2+(u[1]-v[1])**2
    return MC(T,3,'c_tri_cls',f"△ABC has vertices A{Pt(*P[0])}, B{Pt(*P[1])}, C{Pt(*P[2])}. How is it best described?",tgt,[x for x in ['Isosceles right','Scalene right','Isosceles, not right','Scalene, not right'] if x!=tgt],[f"AB² = {d(P[0],P[1])}, BC² = {d(P[1],P[2])}, CA² = {d(P[0],P[2])}.","Equal squares mean equal sides; a² + b² = c² means a right angle.",tgt+"."],svg=grid_svg(pts))
_qc=[0]
def c_quad_cls():
    names=['Parallelogram, not a rectangle or rhombus','Rectangle, not a square','Rhombus, not a square','Square']
    tgt=names[_qc[0]%4];_qc[0]+=1
    for _ in range(600):
        A=(ri(-4,1),ri(-4,1));u=(ri(-3,4),ri(-3,4));v=(ri(-3,4),ri(-3,4))
        if u[0]*v[1]-u[1]*v[0]==0:continue
        dot=u[0]*v[0]+u[1]*v[1];lu=u[0]**2+u[1]**2;lv=v[0]**2+v[1]**2
        nm=names[3] if dot==0 and lu==lv else names[1] if dot==0 else names[2] if lu==lv else names[0]
        B=(A[0]+u[0],A[1]+u[1]);D=(A[0]+v[0],A[1]+v[1]);C=(B[0]+v[0],B[1]+v[1])
        if nm==tgt and all(abs(c)<=6 for p in (A,B,C,D) for c in p):break
    else:return False
    P=[A,B,C,D]
    return MC(T,3,'c_quad_cls',f"The vertices of ABCD are A{Pt(*A)}, B{Pt(*B)}, C{Pt(*C)}, D{Pt(*D)}. What is the most specific name for ABCD?",tgt,[x for x in names if x!=tgt],[f"AB: slope run/rise {u}; DC is the same step, so opposite sides are parallel and equal.",f"Check the angle with slopes and compare AB² = {lu} with AD² = {lv}.",tgt+"."],svg=grid_svg([(n,x,y) for n,(x,y) in zip('ABCD',P)]))
def c_perim():
    a,b,c=R.choice(TRI[:2]);k=1 if a>3 else ri(1,2)
    x=ri(-5,0);y=ri(-5,0)
    A=(x,y);B=(x+a*k,y);C=(x,y+b*k)
    if max(abs(v) for p in (A,B,C) for v in p)>6:return False
    return NUM(T,2,'c_perim',f"Find the perimeter of △ABC with A{Pt(*A)}, B{Pt(*B)}, C{Pt(*C)}.",(a+b+c)*k,[f"AB = {a*k} (horizontal), AC = {b*k} (vertical).",f"BC = √({a*k}² + {b*k}²) = {c*k}.",f"Perimeter = {a*k} + {b*k} + {c*k} = {(a+b+c)*k}."],svg=grid_svg([('A',*A),('B',*B),('C',*C)]))
def c_area_g():
    x=ri(-5,0);y=ri(-5,0);w=ri(2,6);h=ri(2,6)
    A=(x,y);B=(x+w,y);C=(x,y+h)
    if max(abs(v) for p in (A,B,C) for v in p)>6:return False
    return NUM(T,2,'c_area_g',f"Find the area of △ABC with A{Pt(*A)}, B{Pt(*B)}, C{Pt(*C)}.",Fr(w*h,2) if True else 0,[f"AB is horizontal with length {w}; AC is vertical with length {h}.","They meet at a right angle at A.",f"Area = ½ × {w} × {h} = {fm(Fr(w*h,2))}."],svg=grid_svg([('A',*A),('B',*B),('C',*C)]),tol=.01)
def c_pbis():
    mx=ri(-4,4);my=ri(-4,4);p=ri(1,4);q=ri(1,4)
    from math import gcd
    if gcd(p,q)!=1:return False
    A=(mx-p,my-q);B=(mx+p,my+q);m=Fr(-p,q);b=my-m*mx
    return MC(T,3,'c_pbis',f"Which line is the perpendicular bisector of the segment from {Pt(*A)} to {Pt(*B)}?",lin_str(m,b),[lin_str(Fr(q,p),my-Fr(q,p)*mx),lin_str(-m,my+m*mx),lin_str(m,my),lin_str(Fr(-q,p),my+Fr(q,p)*mx)],[f"Midpoint = {Pt(mx,my)}; slope of the segment = {fq(Fr(q,p))}.",f"Perpendicular slope = {fq(m)}.",f"Through the midpoint: b = {fm(b)}, so {lin_str(m,b)}."])
def c_dist_eq():
    a,b,c=R.choice(TRI[:2]);x1=ri(-4,4);y1=ri(-4,4)
    return NUM(T,3,'c_dist_eq',f"The point (x, {y1+b}) is {c} units from {Pt(x1,y1)}. Find the greater possible value of x.",x1+a,[f"(x − {N(x1)})² + {b}² = {c*c}.",f"(x − {N(x1)})² = {a*a}, so x − {N(x1)} = ±{a}.",f"The greater value: x = {x1+a}."])
def c_collin():
    x1=ri(-3,1);m=ri(-3,3);b=ri(-4,4)
    if m==0:return False
    x2=x1+ri(1,3);x3=x2+ri(1,4)
    return NUM(T,3,'c_collin',f"What value of k puts {Pt(x1,m*x1+b)}, {Pt(x2,m*x2+b)} and ({x3}, k) on one line?",m*x3+b,[f"Slope of the first two points = {m}.",f"The third point must also give slope {m}: (k − ({m*x2+b}))/({x3} − {x2}) = {m}.",f"k = {m*x3+b}."])
def c_mid_seg():
    x1=ri(-6,6);y1=ri(-6,6);dx=ri(1,5)*2;dy=ri(1,5)*2
    A=(x1,y1);B=(x1+dx,y1+dy);C=(x1+ri(-3,3)*2,y1+ri(-6,-2)*1*2//2*2)
    return False
def run_crd():
    for f,n in [(c_dist_g,5),(c_dist_t,5),(c_dist_r,5),(c_mid,7),(c_mid_x,4),(c_endpt,6),(c_slope_i,5),(c_slope_f,6),(c_slope_std,5),(c_par,4),(c_perp_s,6),(c_perp_i,4),(c_line2,6),(c_par_line,5),(c_perp_line,5),(c_yint,4),(c_ptslope,4),(c_circ_eq,6),(c_circ_r,4),(c_circ_c,4),(c_circ_pt,5),(c_diam,4),(c_tri_cls,6),(c_quad_cls,6),(c_perim,4),(c_area_g,4),(c_pbis,4),(c_dist_eq,4),(c_collin,4)]:rep(f,n)
    C=[
    (1,"What is the slope of a horizontal line?","0",["1","undefined","−1"],"A horizontal line has no rise.","0 ÷ run = 0."),
    (1,"What is the slope of a vertical line?","Undefined",["0","1","Infinity is a number we use here"],"A vertical line has no run, so we would divide by 0.","Division by 0 is undefined."),
    (1,"Which formula gives the midpoint of a segment?","Average the x's and average the y's",["Subtract the x's and y's","Multiply the coordinates","Add the coordinates without halving"],"The midpoint is halfway.","Halfway = the average."),
    (1,"A line with a positive slope…","rises from left to right",["falls from left to right","is horizontal","is vertical"],"Positive slope means y grows as x grows.","It goes uphill."),
    (1,"The distance formula comes from…","the Pythagorean Theorem",["the midpoint formula","the slope formula","the area of a circle"],"Horizontal and vertical changes are legs of a right triangle.","d is the hypotenuse."),
    (2,"What does the 'm' mean in y = mx + b?","Slope",["y-intercept","x-intercept","Midpoint"],"m multiplies x, so it is the steepness.","b is the y-intercept."),
    (2,"Two lines are parallel if their slopes are…","equal",["negative reciprocals","opposites","both zero only"],"Same steepness, never meet.","Equal slopes (and different intercepts)."),
    (2,"Two lines are perpendicular if the product of their slopes is…","−1",["1","0","−0.5"],"Negative reciprocals multiply to −1.","Example: 2 and −½."),
    (2,"The center of a circle is at the origin and its radius is 5. Its equation is…","x² + y² = 25",["x² + y² = 5","x + y = 25","(x − 5)² + (y − 5)² = 25"],"With h = k = 0, the equation is x² + y² = r².","r² = 25."),
    (2,"Which line is vertical?","x = 4",["y = 4","y = 4x","x + y = 4"],"All points have x = 4.","y = 4 is horizontal."),
    (2,"Which line has slope 0 and passes through (2, 5)?","y = 5",["x = 2","y = 2","y = 5x"],"Slope 0 means horizontal.","Every point has y = 5."),
    (3,"To show a quadrilateral is a parallelogram with coordinates, you can show that…","the diagonals have the same midpoint",["the diagonals have the same length","one pair of sides is parallel","its sides are 4 units long"],"Diagonals of a parallelogram bisect each other.","Same midpoint is enough."),
    (3,"To show a parallelogram is a rectangle with coordinates, you can show that…","the diagonals are equal in length",["the diagonals are perpendicular","the sides have the same slope","the diagonals have the same midpoint"],"Rectangles have congruent diagonals.","Perpendicular diagonals show a rhombus instead."),
    (3,"To show a parallelogram is a rhombus with coordinates, you can show that…","two adjacent sides are equal in length",["the diagonals are equal","the midpoints are equal","opposite sides have equal slopes"],"A rhombus has four equal sides.","One pair of adjacent equal sides is enough for a parallelogram."),
    (3,"Why do coordinate proofs often put one vertex at (0, 0) and a side on the x-axis?","It makes the other coordinates simple, and the shape stays general",["It makes the shape a square","It guarantees a right angle","The formulas only work there"],"Moving a figure does not change its shape.","Fewer variables, same proof."),
    (3,"A rectangle has vertices (0, 0), (a, 0), (a, b), (0, b). What is the midpoint of a diagonal?","(a/2, b/2)",["(a, b)","(a/2, b)","(0, 0)"],"Average (0, 0) and (a, b).","(a/2, b/2)."),
    (3,"For a triangle with vertices (0, 0), (2a, 0), (0, 2b), the midsegment joining the midpoints of the two legs has length…","√(a² + b²)",["a + b","2√(a² + b²)","ab"],"Midpoints (a, 0) and (0, b).","Distance = √(a² + b²), half the hypotenuse."),
    ]
    for i,(l,q,g,bd,s1,s2) in enumerate(C):MC(T,l,f'c_c{i}',q,g,bd,[s1,s2],w=s2)
    put(dict(t=T,l=3,type='multi',q="Select ALL points on the circle x² + y² = 25.",o=["(3, 4)","(−5, 0)","(4, 4)","(0, −5)","(−3, 4)"],a=[0,1,3,4],sol=["Test each: x² + y² should equal 25.","(4, 4) gives 32."],w="(4, 4) is the only miss.",fp='c_mu1'))
    put(dict(t=T,l=2,type='multi',q="Select ALL lines parallel to y = 2x + 1.",o=["y = 2x − 7","y = −½x + 1","y = 2x","4x − 2y = 6"],a=[0,2,3],sol=["Parallel lines have slope 2.","4x − 2y = 6 → y = 2x − 3."],w="Slope 2 each time.",fp='c_mu2'))
    put(dict(t=T,l=1,type='match',q="Match each formula to what it finds.",pairs=[["√((x₂−x₁)² + (y₂−y₁)²)","Distance"],["((x₁+x₂)/2, (y₁+y₂)/2)","Midpoint"],["(y₂−y₁)/(x₂−x₁)","Slope"],["(x−h)² + (y−k)² = r²","Circle"]],sol=["Each formula has its own job.","Distance and midpoint use two points; slope compares rise and run."],w="Learn them as a set.",fp='c_ma1'))
    put(dict(t=T,l=2,type='match',q="Match each slope to the slope of a perpendicular line.",pairs=[["2","−½"],["−3","⅓"],["⅔","−3/2"],["−¼","4"]],sol=["Flip the fraction and change the sign.","2 → −1/2; −3 → 1/3; 2/3 → −3/2; −1/4 → 4."],w="Negative reciprocal.",fp='c_ma2'))
    put(dict(t=T,l=2,type='order',q="Put the steps in order to write the equation of a line through two points.",items=["Find the slope","Pick one of the points","Substitute into y = mx + b to find b","Write the equation"],sol=["You need m before you can find b.","Plug in a point to solve for b."],w="Slope, point, b, equation.",fp='c_or1'))
    put(dict(t=T,l=2,type='order',q="Put the steps in order to find the distance between two points.",items=["Subtract the x-coordinates","Subtract the y-coordinates","Square both differences and add","Take the square root"],sol=["Find Δx and Δy first.","Then square, add, and root."],w="Pythagorean Theorem.",fp='c_or2'))
# =========================== TRN
T='trn'
ALLIM=lambda x,y:[(-x,y),(x,-y),(-x,-y),(y,x),(-y,-x),(y,-x),(-y,x)]
def pick_tri(r=5):
    while True:
        P=[(ri(-r,r),ri(-r,r)) for _ in range(3)]
        d=lambda u,v:(u[0]-v[0])**2+(u[1]-v[1])**2
        ar=abs((P[1][0]-P[0][0])*(P[2][1]-P[0][1])-(P[2][0]-P[0][0])*(P[1][1]-P[0][1]))
        if ar>=6 and all(abs(x)!=abs(y) and x and y for x,y in P[:1]):return P
def t_refl():
    k=R.choice(['x-axis','y-axis','y = x','y = −x'])
    l={'x-axis':1,'y-axis':1,'y = x':2,'y = −x':3}[k]
    P=pick_tri()
    x,y=P[0]
    f={'x-axis':(x,-y),'y-axis':(-x,y),'y = x':(y,x),'y = −x':(-y,-x)}[k]
    bad=[p for p in ALLIM(x,y) if p!=f]
    R.shuffle(bad)
    pts=[(n,a,b) for n,(a,b) in zip('ABC',P)]
    return MC(T,l,'t_refl_'+k,f"△ABC is reflected across the {'line ' if 'y =' in k else ''}{k}. What are the coordinates of A′?",Pt(*f),[Pt(*p) for p in bad],[f"Reflection across the {k}: "+{'x-axis':'(x, y) → (x, −y).','y-axis':'(x, y) → (−x, y).','y = x':'(x, y) → (y, x).','y = −x':'(x, y) → (−y, −x).'}[k],f"A is {Pt(x,y)}.",f"A′ = {Pt(*f)}."],svg=grid_svg(pts))
def t_refl_k():
    k=ri(-4,4);vert=R.random()<.5
    x=ri(-6,6);y=ri(-6,6)
    if k==x if vert else k==y:return False
    nx=2*k-x if vert else x;ny=y if vert else 2*k-y
    if abs(nx)>9 or abs(ny)>9:return False
    ln=f"x = {N(k)}" if vert else f"y = {N(k)}"
    bad=[(2*k-x,y) if not vert else (x,2*k-y),(-x,y),(x,-y),(2*k+x,y) if vert else (x,2*k+y)]
    return MC(T,3,'t_refl_k',f"Point P{Pt(x,y)} is reflected across the line {ln}. What is P′?",Pt(nx,ny),[Pt(*p) for p in bad],["The image is the same distance from the line on the other side.",f"{'x' if vert else 'y'} changes to 2({k}) − {x if vert else y}; the other coordinate stays.",f"P′ = {Pt(nx,ny)}."])
def t_trans():
    a=ri(-6,6);b=ri(-6,6);x=ri(-5,5);y=ri(-5,5)
    if a==0 or b==0 or abs(a)==abs(b):return False
    d=lambda v,p,n:f"{abs(v)} unit{'s' if abs(v)!=1 else ''} {p if v>0 else n}"
    return MC(T,1,'t_trans',f"Point P{Pt(x,y)} is translated {d(a,'right','left')} and {d(b,'up','down')}. What is P′?",Pt(x+a,y+b),[Pt(x-a,y-b),Pt(x+b,y+a),Pt(x+a,y-b),Pt(x-a,y+b)],["Right/left changes x; up/down changes y.",f"x: {x} {sg(a)} = {x+a}; y: {y} {sg(b)} = {y+b}.",f"P′ = {Pt(x+a,y+b)}."])
def t_trans_rule():
    a=ri(-6,6);b=ri(-6,6);x=ri(-5,5);y=ri(-5,5)
    if a==0 or b==0 or abs(a)==abs(b):return False
    f=lambda a,b:f"(x, y) → (x {sg(a)}, y {sg(b)})"
    return MC(T,2,'t_trans_rule',f"A translation maps {Pt(x,y)} to {Pt(x+a,y+b)}. Which rule describes it?",f(a,b),[f(-a,-b),f(b,a),f(a,-b),f(-a,b)],[f"x changed by {x+a} − ({x}) = {a}.",f"y changed by {y+b} − ({y}) = {b}.",f"{f(a,b)}."])
def t_rot():
    ang,dr=R.choice([(90,'counterclockwise'),(180,'counterclockwise'),(270,'counterclockwise'),(90,'clockwise'),(270,'clockwise')])
    x=ri(-6,6);y=ri(-6,6)
    if x==0 or y==0 or abs(x)==abs(y):return False
    eff=ang if dr=='counterclockwise' else (360-ang)%360
    f={90:(-y,x),180:(-x,-y),270:(y,-x)}[eff]
    bad=[p for p in ALLIM(x,y) if p!=f]
    R.shuffle(bad)
    rule={90:'(x, y) → (−y, x)',180:'(x, y) → (−x, −y)',270:'(x, y) → (y, −x)'}[eff]
    return MC(T,1 if ang==180 else 2,'t_rot_'+str(ang)+dr,f"Rotate P{Pt(x,y)} {ang}° {dr} about the origin. What is P′?",Pt(*f),[Pt(*p) for p in bad],[f"{ang}° {dr} is the same as {eff}° counterclockwise.",f"Rule: {rule}.",f"P′ = {Pt(*f)}."],svg=grid_svg([('P',x,y)],rng=max(6,max(abs(x),abs(y))+1)))
def t_rot_pt():
    h=ri(-3,3);k=ri(-3,3);x=ri(-4,4);y=ri(-4,4)
    if (x,y)==(h,k):return False
    f=(h-(y-k),k+(x-h))
    bad=[(h+(y-k),k-(x-h)),(2*h-x,2*k-y),(-(y-k),(x-h)),(h-(x-h),k+(y-k))]
    return MC(T,3,'t_rot_pt',f"Rotate P{Pt(x,y)} 90° counterclockwise about C{Pt(h,k)}. What is P′?",Pt(*f),[Pt(*p) for p in bad],[f"Shift so C is the origin: P becomes ({x-h}, {y-k}).",f"Rotate 90° counterclockwise: (a, b) → (−b, a) gives ({-(y-k)}, {x-h}).",f"Shift back: P′ = {Pt(*f)}."])
def t_half():
    h=ri(-4,4);k=ri(-4,4);x=ri(-5,5);y=ri(-5,5)
    if (h,k)==(0,0):return False
    return NUM(T,3,'t_half',f"A half-turn about {Pt(h,k)} maps P{Pt(x,y)} to P′. What is the sum of the coordinates of P′?",2*h-x+2*k-y,[f"A half-turn about (h, k) sends (x, y) to (2h − x, 2k − y).",f"P′ = ({2*h-x}, {2*k-y}).",f"Sum = {2*h-x+2*k-y}."])
def t_dil():
    k=R.choice([2,3,4,Fr(1,2),Fr(1,3),Fr(3,2)]);k=Fr(k)
    x=ri(-6,6);y=ri(-6,6)
    if k.denominator>1:x*=k.denominator;y*=k.denominator
    if x==0 or y==0 or abs(x)>12 or abs(y)>12 or abs(x)==abs(y):return False
    f=(x*k,y*k)
    P=lambda p:Pt(fm(Fr(p[0])) if False else int(p[0]),int(p[1]))
    return MC(T,1 if k.denominator==1 and k<=3 else 2,'t_dil',f"A dilation centered at the origin has scale factor {fm(k)}. What is the image of P{Pt(x,y)}?",P(f),[Pt(x+int(k) if k.denominator==1 else x+1,y+int(k) if k.denominator==1 else y+1),Pt(int(x/k) if (x/k)==int(x/k) else x*2,int(y/k) if (y/k)==int(y/k) else y*2),Pt(int(x*k),int(-y*k)),Pt(y*k if (y*k).denominator==1 else y,x*k if (x*k).denominator==1 else x)],["A dilation at the origin multiplies each coordinate by the scale factor.",f"({x} × {fm(k)}, {y} × {fm(k)}).",f"P′ = {P(f)}."])
def t_dil_k():
    k=R.choice([2,3,4,5,Fr(1,2),Fr(1,3),Fr(2,3),Fr(3,2)]);k=Fr(k);d=k.denominator
    x=d*ri(1,4)*R.choice([-1,1]);y=d*ri(1,4)*R.choice([-1,1])
    return NUM(T,1,'t_dil_k',f"A dilation centered at the origin maps A{Pt(x,y)} to A′{Pt(x*k,y*k)}. What is the scale factor? (Decimal or fraction)",float(k),["Scale factor = image coordinate ÷ original coordinate.",f"{fq(x*k)} ÷ {x} = {fm(k)}."],tol=.01,show=fm(k))
def t_dil_c():
    cx=ri(-3,3);cy=ri(-3,3);k=R.choice([2,3,Fr(1,2)]);k=Fr(k)
    x=cx+ri(-3,3)*(2 if k<1 else 1);y=cy+ri(-3,3)*(2 if k<1 else 1)
    if (x,y)==(cx,cy):return False
    f=(cx+k*(x-cx),cy+k*(y-cy))
    if f[0].denominator!=1 or f[1].denominator!=1:return False
    f=(int(f[0]),int(f[1]))
    return MC(T,3,'t_dil_c',f"A dilation with center C{Pt(cx,cy)} and scale factor {fm(k)} is applied to P{Pt(x,y)}. What is P′?",Pt(*f),[Pt(int(x*k) if (x*k).denominator==1 else x,int(y*k) if (y*k).denominator==1 else y),Pt(cx+int(k)*(x-cx) if k>1 else cx+(x-cx)//2+1,cy+int(k)*(y-cy) if k>1 else cy+(y-cy)//2),Pt(cx-(x-cx),cy-(y-cy)),Pt(x+cx,y+cy)],[f"Distance from C: ({x-cx}, {y-cy}).",f"Multiply by {fm(k)}: ({fq((x-cx)*k)}, {fq((y-cy)*k)}).",f"Add back to C: {Pt(*f)}."])
def t_dil_len():
    k=R.choice([2,3,4,5,Fr(1,2),Fr(3,2),Fr(5,2)]);k=Fr(k);L=ri(2,6)*k.denominator*2
    return NUM(T,1,'t_dil_len',f"A segment {L} cm long is dilated by scale factor {fm(k)}. How long is the image, in cm?",float(L*k),["Lengths are multiplied by the scale factor.",f"{L} × {fm(k)} = {fm(L*k)}."],show=fm(L*k),tol=.01)
def t_dil_area():
    k=R.choice([2,3,4,5,Fr(1,2),Fr(3,2)]);k=Fr(k);A=ri(2,9)*4
    return NUM(T,2,'t_dil_area',f"A triangle with area {A} cm² is dilated by scale factor {fm(k)}. What is the area of the image, in cm²?",float(A*k*k),[f"Areas change by the factor k² = {fm(k*k)}.",f"{A} × {fm(k*k)} = {fm(A*k*k)}."],show=fm(A*k*k),tol=.01)
def t_comp():
    a=ri(-5,5);b=ri(-5,5);x=ri(-5,5);y=ri(-5,5)
    if not a or not b or not x or not y or abs(x)==abs(y):return False
    k=R.choice(['x','y']);first=R.choice([True,False])
    if k=='x':
        refl=lambda p:(p[0],-p[1]);nm='x-axis'
    else:
        refl=lambda p:(-p[0],p[1]);nm='y-axis'
    tr=lambda p:(p[0]+a,p[1]+b)
    f=tr(refl((x,y))) if first else refl(tr((x,y)))
    wrong=refl(tr((x,y))) if first else tr(refl((x,y)))
    if wrong==f:return False
    t1=f"reflected across the {nm}, then translated by (x, y) → (x {sg(a)}, y {sg(b)})" if first else f"translated by (x, y) → (x {sg(a)}, y {sg(b)}), then reflected across the {nm}"
    bad=[wrong,tr((x,y)),refl((x,y)),(f[0]+1,f[1]-1)]
    return MC(T,3,'t_comp',f"Point P{Pt(x,y)} is {t1}. What is the final image?",Pt(*f),[Pt(*p) for p in bad],["Do the steps in the order given.",f"After step one: {Pt(*(refl((x,y)) if first else tr((x,y))))}.",f"After step two: {Pt(*f)}."])
def t_two_refl():
    th=ri(15,80)
    return NUM(T,3,'t_two_refl',f"Two lines meet at a {th}° angle. A figure is reflected across one line and then across the other. The result is a rotation. What is its angle in degrees?",2*th,["A product of reflections in intersecting lines is a rotation.","The rotation angle is twice the angle between the lines.",f"2 × {th} = {2*th}."])
def t_two_par():
    d=ri(2,12)
    return NUM(T,3,'t_two_par',f"Two parallel lines are {d} cm apart. A figure is reflected across one, then the other. By how many cm is the final image shifted from the original?",2*d,["Reflecting over two parallel lines gives a translation.","The distance moved is twice the distance between the lines.",f"2 × {d} = {2*d}."])
def t_sym_l():
    n=ri(3,12)
    nm={3:'triangle',4:'square',5:'pentagon',6:'hexagon',7:'heptagon',8:'octagon',9:'nonagon',10:'decagon',12:'dodecagon'}.get(n)
    if not nm:return False
    return NUM(T,1,'t_sym_l',f"How many lines of symmetry does a regular {nm} have?",n,["A regular n-gon has n lines of symmetry.",f"n = {n}."])
def t_sym_r():
    n=R.choice([3,4,5,6,8,9,10,12])
    return NUM(T,2,'t_sym_r',f"What is the smallest angle (in degrees) that rotates a regular polygon with {n} sides onto itself?",360//n,["The turns come every 360° ÷ n.",f"360 ÷ {n} = {360//n}."])
def t_ident():
    typ=R.choice(['x-axis reflection','y-axis reflection','half-turn about origin','translation','dilation','90° rotation'])
    for _ in range(100):
        P=[(ri(1,3),ri(1,3)) for _ in range(3)]
        if abs((P[1][0]-P[0][0])*(P[2][1]-P[0][1])-(P[2][0]-P[0][0])*(P[1][1]-P[0][1]))>=2:break
    tr={'x-axis reflection':lambda p:(p[0],-p[1]),'y-axis reflection':lambda p:(-p[0],p[1]),'half-turn about origin':lambda p:(-p[0],-p[1]),'translation':lambda p:(p[0]-5,p[1]+1),'dilation':lambda p:(2*p[0],2*p[1]),'90° rotation':lambda p:(-p[1],p[0])}[typ]
    Q=[tr(p) for p in P]
    if any(abs(v)>6 for q in Q for v in q):return False
    svg=grid2([([(n,*p) for n,p in zip('ABC',P)],False),([(n+'′',*p) for n,p in zip('ABC',Q)],True)])
    names=['x-axis reflection','y-axis reflection','half-turn about origin','translation','dilation','90° rotation']
    nice={'x-axis reflection':'Reflection across the x-axis','y-axis reflection':'Reflection across the y-axis','half-turn about origin':'Rotation of 180° about the origin','translation':'Translation','dilation':'Dilation centered at the origin','90° rotation':'Rotation of 90° about the origin'}
    others=[nice[n] for n in names if n!=typ];R.shuffle(others)
    pool={'x-axis reflection':"y-values changed sign.",'y-axis reflection':"x-values changed sign.",'half-turn about origin':"both coordinates changed sign.",'translation':"every point moved the same way.",'dilation':"every coordinate doubled; the shape is bigger.",'90° rotation':"x and y swapped, with one sign change."}
    return MC(T,2,'t_ident_'+typ,"Which transformation maps the solid triangle onto the dashed triangle?",nice[typ],others[:3],["Compare A with A′.",f"A is {Pt(*P[0])} and A′ is {Pt(*Q[0])}: "+pool[typ],nice[typ]+"."],svg=svg)
def t_inverse():
    a=ri(-6,6);b=ri(-6,6)
    if not a or not b or abs(a)==abs(b):return False
    f=lambda a,b:f"(x, y) → (x {sg(a)}, y {sg(b)})"
    return MC(T,2,'t_inverse',f"A translation has the rule {f(a,b)}. Which rule undoes it (its inverse)?",f(-a,-b),[f(a,b),f(-a,b),f(b,a)],["The inverse brings every point back.","Reverse each shift: use the opposite numbers.",f(-a,-b)+"."])
def t_rot_inv():
    a=R.choice([30,45,60,72,90,120,135,150])
    return NUM(T,2,'t_rot_inv',f"A rotation of {a}° counterclockwise about a point is followed by another rotation about the same point that returns every point to start. What is the smallest positive counterclockwise angle, in degrees, of the second rotation?",360-a,["Total turn must be 360°.",f"360 − {a} = {360-a}."])
def run_trn():
    for f,n in [(t_refl,14),(t_refl_k,4),(t_trans,6),(t_trans_rule,5),(t_rot,9),(t_rot_pt,5),(t_half,3),(t_dil,8),(t_dil_k,5),(t_dil_c,5),(t_dil_len,4),(t_dil_area,4),(t_comp,6),(t_two_refl,3),(t_two_par,3),(t_sym_l,5),(t_sym_r,5),(t_ident,10),(t_inverse,3),(t_rot_inv,3)]:rep(f,n)
    C=[
    (1,"Which transformation is NOT an isometry?","Dilation with scale factor 2",["Reflection","Rotation","Translation"],"An isometry keeps all distances.","A dilation changes size."),
    (1,"What is the image?","The figure after the transformation",["The figure before","The center of rotation","The line of reflection"],"Pre-image goes in; image comes out.","A′ is the image of A."),
    (1,"A reflection across a line gives a figure that is…","a mirror image of the original",["rotated around a point","slid without turning","larger than the original"],"Reflection flips over the line.","Orientation reverses."),
    (1,"A translation…","slides every point the same distance in the same direction",["flips the figure","turns the figure around a point","changes the figure's size"],"No turning, no flipping.","Everything moves together."),
    (1,"Which letter has a vertical line of symmetry?","A",["F","R","S"],"Fold it down the middle and the halves match.","A matches; F, R, S do not."),
    (1,"A figure and its reflection image are…","congruent",["similar but not congruent","always equal in orientation","never the same size"],"Reflection is an isometry.","Same size and shape."),
    (2,"A rotation about a point P maps P to…","P itself",["the center of the image","a point on the x-axis","the opposite point"],"The center does not move.","The center is fixed."),
    (2,"Which isometry changes orientation (clockwise order of vertices becomes counterclockwise)?","Reflection",["Rotation","Translation","Half-turn"],"A mirror image is reversed.","Rotations and translations keep orientation."),
    (2,"A dilation with scale factor between 0 and 1 produces…","a smaller similar figure",["a larger similar figure","a congruent figure","a reflected figure"],"Scale factor < 1 shrinks.","Similar, but not congruent."),
    (2,"A dilation with scale factor 1 is…","the identity mapping",["a reflection","a translation by 1","impossible"],"Every point stays put.","Identity."),
    (2,"A half-turn about the origin sends (x, y) to…","(−x, −y)",["(−x, y)","(y, x)","(x, −y)"],"A half-turn is a 180° rotation.","Both signs flip."),
    (2,"A figure has rotational symmetry of order 4. It matches itself after a turn of…","90°",["45°","180° only","360° only"],"360° ÷ 4 = 90°.","Turns of 90°, 180°, 270°, and 360°."),
    (2,"What is the inverse of a reflection across line ℓ?","The same reflection across ℓ",["A rotation of 180°","A translation","A dilation"],"Reflecting twice returns to start.","A reflection is its own inverse."),
    (3,"A reflection followed by a reflection across the same line is…","the identity",["a translation","a rotation of 90°","a dilation"],"Flip, then flip back.","Everything returns to start."),
    (3,"Which pair of reflections produces a translation?","Reflections across two parallel lines",["Reflections across two intersecting lines","Two reflections across the same line","Reflection across the x-axis then y = x"],"Parallel mirrors shift the figure.","The shift is twice the gap."),
    (3,"Reflection across the x-axis followed by reflection across the y-axis is the same as…","a half-turn about the origin",["a translation","a 90° rotation","reflection across y = x"],"(x, y) → (x, −y) → (−x, −y).","(−x, −y) is a half-turn."),
    (3,"In a dilation, which property is NOT preserved?","Distance",["Angle measure","Parallelism","Collinearity"],"Lengths scale by k.","Angles and parallel lines stay."),
    (3,"Does the order of two transformations always matter?","No. Sometimes the result is the same, but not always",["Yes, always","No, never","Only for translations"],"Two translations give the same result in either order.","A reflection and a translation often do not."),
    ]
    for i,(l,q,g,bd,s1,s2) in enumerate(C):MC(T,l,f't_c{i}',q,g,bd,[s1,s2],w=s2)
    put(dict(t=T,l=2,type='multi',q="Select ALL transformations that are isometries.",o=["Reflection","Rotation","Translation","Dilation with scale factor 3"],a=[0,1,2],sol=["Isometries keep distances the same.","A dilation with k = 3 triples distances."],w="Dilations change size.",fp='t_mu1'))
    put(dict(t=T,l=2,type='multi',q="Select ALL figures with at least one line of symmetry.",o=["Isosceles triangle","Scalene triangle","Rectangle","Regular pentagon"],a=[0,2,3],sol=["Isosceles: 1 line. Rectangle: 2 lines. Regular pentagon: 5 lines.","A scalene triangle has none."],w="Scalene triangles have no symmetry lines.",fp='t_mu2'))
    put(dict(t=T,l=1,type='match',q="Match each transformation to its rule.",pairs=[["Reflection across the x-axis","(x, y) → (x, −y)"],["Reflection across the y-axis","(x, y) → (−x, y)"],["Half-turn about the origin","(x, y) → (−x, −y)"],["Reflection across y = x","(x, y) → (y, x)"]],sol=["x-axis reflection flips y.","y-axis reflection flips x.","A half-turn flips both.","y = x swaps x and y."],w="Learn these four.",fp='t_ma1'))
    put(dict(t=T,l=2,type='match',q="Match each regular polygon to the number of lines of symmetry.",pairs=[["Equilateral triangle","3"],["Square","4"],["Regular hexagon","6"],["Regular octagon","8"]],sol=["A regular n-gon has n lines of symmetry."],w="n sides, n lines.",fp='t_ma2'))
    put(dict(t=T,l=2,type='order',q="Put the steps in order to find the image of P after a rotation of 90° about center C (not the origin).",items=["Subtract C from P","Rotate the result about the origin","Add C back"],sol=["Move C to the origin first.","Rotate, then undo the move."],w="Shift, rotate, shift back.",fp='t_or1'))
    put(dict(t=T,l=2,type='order',q="Order these dilations of a 6 cm segment from shortest image to longest image.",items=["Scale factor ⅓","Scale factor ½","Scale factor 1","Scale factor 2"],sol=["Images: 2, 3, 6, 12 cm."],w="Multiply 6 by each factor.",fp='t_or2'))
# =========================== content
CARDS={
'area':[
["Rectangle and parallelogram","Area is base × height. The height must be perpendicular to the base. A slanted side is not the height.","A = bh"],
["Triangle","A triangle is half of a parallelogram with the same base and height.","A = ½bh"],
["Trapezoid","Average the two parallel bases, then multiply by the height.","A = ½h(b₁ + b₂)"],
["Rhombus and kite","Multiply the diagonals, then take half. The diagonals meet at right angles.","A = ½d₁d₂"],
["Regular polygon","The apothem goes from the center to a side at 90°. Area is half the apothem times the perimeter.","A = ½aP"],
["Circle","Circumference goes around. Area fills the inside. Radius is half of the diameter.","C = 2πr    A = πr²"],
["Sectors and arcs","A sector is a slice. Find the fraction angle/360, then take that part of the circle.","Arc = (n/360)(2πr)    Sector = (n/360)(πr²)"],
["Similar figures","If the scale factor is a:b, the ratio of perimeters is a:b and the ratio of areas is a²:b².","Area ratio = (scale)²"],
["Composite figures","Break the shape into pieces you know. Add pieces, or subtract holes.","Total = parts added − parts removed"]],
'sol':[
["Prisms","Volume is base area times height. Lateral area is base perimeter times height.","V = Bh    L = Ph"],
["Surface area","Add the area of every face. A net shows all faces flat.","S = L + 2B"],
["Pyramids","A pyramid has one base. Volume is one third of the matching prism. Slant height runs up a face.","V = ⅓Bh    L = ½Pl"],
["Cylinders","Two circles and a rolled rectangle. The rectangle is as wide as the circumference.","V = πr²h    S = 2πrh + 2πr²"],
["Cones","Volume is one third of a cylinder. The slant height is the hypotenuse of (r, h).","V = ⅓πr²h    S = πrl + πr²"],
["Spheres","Every point is the same distance r from the center. Surface area is 4 circles' worth.","S = 4πr²    V = (4/3)πr³"],
["Similar solids","With scale factor a:b, lengths use a:b, surface areas use a²:b², and volumes use a³:b³.","Volume ratio = (scale)³"],
["Euler's formula","For any polyhedron, count vertices, faces, and edges.","V + F = E + 2"]],
'crd':[
["Distance formula","Use the horizontal and vertical changes as legs of a right triangle.","d = √((x₂−x₁)² + (y₂−y₁)²)"],
["Midpoint formula","Average the x's and average the y's.","M = ((x₁+x₂)/2, (y₁+y₂)/2)"],
["Slope","Slope is rise over run. Horizontal lines have slope 0; vertical lines have undefined slope.","m = (y₂−y₁)/(x₂−x₁)"],
["Parallel and perpendicular","Parallel lines have equal slopes. Perpendicular slopes are negative reciprocals.","m₁ = m₂    m₁·m₂ = −1"],
["Equation of a line","Slope-intercept uses m and b. Point-slope uses any point on the line.","y = mx + b    y − y₁ = m(x − x₁)"],
["Circle equation","The center is (h, k). The right side is the radius squared. Watch the signs.","(x − h)² + (y − k)² = r²"],
["Classify shapes","Find the side lengths with the distance formula and the slopes. Equal sides, and slopes with product −1, name the shape.","d, m"],
["Coordinate proofs","Place a vertex at (0, 0) and a side on an axis. Use letters for the other coordinates so the proof works for every shape.","Rectangle: (0,0), (a,0), (a,b), (0,b)"]],
'trn':[
["Isometries","A transformation that keeps distances is an isometry. Reflections, rotations, and translations are isometries.","Image ≅ pre-image"],
["Reflections","A reflection flips a figure over a line. Each point and its image are the same distance from the line.","x-axis: (x, −y)    y-axis: (−x, y)    y = x: (y, x)"],
["Translations","A translation slides every point the same way.","(x, y) → (x + a, y + b)"],
["Rotations","A rotation turns a figure about a center point. Counterclockwise is the positive direction.","90°: (−y, x)    180°: (−x, −y)    270°: (y, −x)"],
["Symmetry","A figure has line symmetry if a mirror line maps it onto itself. It has rotational symmetry if a turn under 360° does.","Regular n-gon: n lines, turns of 360°/n"],
["Products of mappings","Do one transformation, then another. Order can matter. Two reflections in parallel lines make a translation; in intersecting lines, a rotation.","Rotation angle = 2 × angle between lines"],
["Inverses and identity","The inverse undoes a mapping. The identity leaves everything alone.","Inverse of (x + a, y + b) is (x − a, y − b)"],
["Dilations","A dilation stretches or shrinks from a center. Scale factor k multiplies distances from the center. The image is similar, not congruent.","(x, y) → (kx, ky)"]],
}
GLOSS=[
["Area","The amount of flat surface inside a figure, in square units."],
["Base","A side of a figure used with its perpendicular height."],
["Height","Perpendicular distance from a base to the opposite side or vertex."],
["Apothem","Segment from the center of a regular polygon perpendicular to a side."],
["Circumference","The distance around a circle."],
["Sector","A region of a circle bounded by two radii and an arc."],
["Arc length","The length of part of a circle's circumference."],
["Scale factor","The ratio of corresponding lengths in similar figures."],
["Midsegment","A segment joining the midpoints of two sides of a figure."],
["Lateral area","The area of the sides of a solid, not counting the bases."],
["Surface area","The total area of all faces of a solid."],
["Volume","The amount of space inside a solid, in cubic units."],
["Prism","A solid with two parallel congruent polygon bases and parallelogram sides."],
["Pyramid","A solid with one polygon base and triangular faces meeting at a vertex."],
["Slant height","Height of a lateral face of a pyramid, or side length of a cone."],
["Polyhedron","A solid whose faces are all polygons."],
["Sphere","All points in space at a given distance from a center."],
["Hemisphere","Half of a sphere."],
["Distance formula","d = √((x₂−x₁)² + (y₂−y₁)²)."],
["Midpoint","The point halfway between two endpoints."],
["Slope","The ratio of vertical change to horizontal change."],
["y-intercept","The y-value where a line crosses the y-axis."],
["Negative reciprocal","The number you get by flipping a fraction and changing its sign."],
["Point-slope form","y − y₁ = m(x − x₁)."],
["Coordinate proof","A proof that places a figure on a coordinate plane and uses algebra."],
["Transformation","A rule that moves every point of a figure to a new place."],
["Pre-image and image","The figure before a transformation, and the figure after it."],
["Isometry","A transformation that preserves distance."],
["Reflection","A flip over a line, called the line of reflection."],
["Rotation","A turn about a fixed point, called the center."],
["Translation","A slide: every point moves the same distance and direction."],
["Glide reflection","A translation followed by a reflection over a parallel line."],
["Line symmetry","A figure that matches itself when flipped over a line."],
["Rotational symmetry","A figure that matches itself after a turn of less than 360°."],
["Dilation","A transformation that enlarges or shrinks a figure from a center."],
["Identity mapping","A mapping that sends every point to itself."],
]
NOTES={
'area':["Rectangle and parallelogram: A = bh. Triangle: A = ½bh. Trapezoid: A = ½h(b₁ + b₂).","Regular polygon: A = ½ × apothem × perimeter. Rhombus: A = ½d₁d₂.","Circle: C = 2πr, A = πr². Sector: (n/360)πr². Arc: (n/360)(2πr).","Similar figures with scale factor a:b: perimeters a:b, areas a²:b².","Equilateral triangle with side s: A = (√3/4)s²."],
'sol':["Prism and cylinder: V = Bh. Pyramid and cone: V = ⅓Bh.","Lateral area: prism Ph, pyramid ½Pl, cylinder 2πrh, cone πrl.","Sphere: S = 4πr², V = (4/3)πr³.","Similar solids with scale a:b: surface areas a²:b², volumes a³:b³.","Euler: V + F = E + 2."],
'crd':["Distance: √(Δx² + Δy²). Midpoint: average the coordinates.","Slope = rise/run. Parallel: equal slopes. Perpendicular: product −1.","Lines: y = mx + b and y − y₁ = m(x − x₁). Vertical: x = c.","Circle: (x − h)² + (y − k)² = r².","Coordinate proofs: place a vertex at the origin and use variables."],
'trn':["Isometries (reflection, rotation, translation) keep distance. Dilations do not.","x-axis: (x, −y). y-axis: (−x, y). y = x: (y, x). y = −x: (−y, −x).","Rotation about the origin: 90° (−y, x), 180° (−x, −y), 270° (y, −x).","Dilation about the origin: (kx, ky). Areas scale by k².","Two reflections: parallel lines make a translation; intersecting lines make a rotation of twice the angle."],
}
WRITTEN=[
"Explain why the area of a triangle is half of base times height. Use a parallelogram in your answer.",
"A circle's radius is doubled. Tell what happens to its circumference and to its area, and say why they differ.",
"Show how to find the area of a regular hexagon with side 6 by splitting it into triangles.",
"A cone and a cylinder have the same radius and height. How are their volumes related? Describe how you could check this with sand or water.",
"Two similar boxes have a scale factor of 2:3. Explain how to find the ratios of their surface areas and volumes, and why they are different.",
"Use the distance formula to prove that the triangle with vertices (0, 0), (4, 0), (2, 5) is isosceles.",
"Prove with slopes that the quadrilateral with vertices (0, 0), (4, 1), (5, 4), (1, 3) is a parallelogram.",
"Place a rectangle on a coordinate plane with one vertex at the origin. Prove that its diagonals have the same length.",
"Explain how to find the equation of the line through (2, 5) that is perpendicular to y = 2x − 1.",
"Reflect the point (3, 2) across the x-axis, then across the y-axis. Describe the single transformation that has the same effect.",
"Explain the difference between an isometry and a dilation. Give one example of each.",
"Triangle ABC has A(1, 1), B(3, 1), C(2, 4). Dilate it by a scale factor of 3 centered at the origin. Describe how the area and the angles change.",
]
LESSON_TITLES={'area':'Area & circles','sol':'Solids','crd':'Coordinate geometry','trn':'Transformations'}
def run():
    run_area();run_sol();run_crd();run_trn()
