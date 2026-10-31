# -*- coding: utf-8 -*-
from gen import *
from math import sqrt,pi,gcd
def ri(a,b):return R.randint(a,b)
# ---- area
def a1():
    l=ri(3,20);w=ri(2,15);return NUM('area',1,'a1',f"Find the area of a rectangle {l} by {w}.",l*w,["Area = length × width.",f"{l} × {w} = {l*w}."],b=-1)
def a2():
    b=ri(4,20);h=ri(3,15);return NUM('area',1,'a2',f"Find the area of a triangle with base {b} and height {h}.",b*h/2,["Area = ½ × base × height.",f"½ × {b} × {h} = {b*h/2:g}."],b=-.5)
def a3():
    b=ri(4,20);h=ri(3,15);return NUM('area',1,'a3',f"Find the area of a parallelogram with base {b} and height {h}.",b*h,["Area = base × height (the PERPENDICULAR height).",f"{b} × {h} = {b*h}."],b=-.5)
def a4():
    b1=ri(4,12);b2=ri(b1+1,b1+10);h=ri(3,12);return NUM('area',2,'a4',f"Find the area of a trapezoid with bases {b1} and {b2} and height {h}.",(b1+b2)*h/2,["Area = ½ × (b₁ + b₂) × h.",f"½ × {b1+b2} × {h} = {(b1+b2)*h/2:g}."],b=0)
def a5():
    r=ri(2,12);return NUM('area',1,'a5',f"Find the area of a circle with radius {r}. Give the answer as a multiple of π.",r*r,["Area = π r².",f"π × {r}² = {r*r}π."],pi=True,show=f"{r*r}π",b=-.2)
def a6():
    r=ri(2,12);return NUM('area',1,'a6',f"Find the circumference of a circle with diameter {2*r}. Give the answer as a multiple of π.",2*r,["Circumference = π d.",f"π × {2*r} = {2*r}π."],pi=True,show=f"{2*r}π",b=-.4)
def a7():
    r=ri(3,12);a=R.choice([30,45,60,90,120,180]);v=Fr(a*r*r,360);return NUM('area',3,'a7',f"Find the area of a {a}° sector of a circle with radius {r}. Give the coefficient of π (decimal ok).",float(v),["Sector = (angle ÷ 360) × π r².",f"({a}/360) × {r*r} = {float(v):.2f}."],tol=.02,pi=True,show=f"{float(v):.2f}π",b=1)
def a8():
    r=ri(3,12);a=R.choice([30,45,60,90,120,180]);v=Fr(a*2*r,360);return NUM('area',3,'a8',f"Find the length of a {a}° arc in a circle with radius {r}. Give the coefficient of π (decimal ok).",float(v),["Arc = (angle ÷ 360) × 2π r.",f"({a}/360) × {2*r} = {float(v):.2f}."],tol=.02,pi=True,show=f"{float(v):.2f}π",b=1)
def a9():
    s=ri(2,10);return NUM('area',2,'a9',f"A square has diagonal {s}√2. Find its area.",s*s,["Diagonal = side × √2, so the side is "+str(s)+".",f"Area = {s}² = {s*s}."],b=.8)
def a10():
    a=ri(3,9);b=ri(3,9);return NUM('area',3,'a10',f"A right triangle has legs {a} and {b}. Find the length of the altitude to the hypotenuse (nearest tenth).",round(a*b/sqrt(a*a+b*b),1),["Area = ½ab = ½ × hypotenuse × altitude.",f"Hypotenuse = √({a*a+b*b}) ≈ {sqrt(a*a+b*b):.2f}.",f"Altitude = {a}·{b} ÷ {sqrt(a*a+b*b):.2f} ≈ {a*b/sqrt(a*a+b*b):.1f}."],tol=.06,b=1.4)
def a11():
    n=ri(2,5)*2;k=R.choice([2,3,4,5]);return NUM('area',3,'a11',f"A figure has area {n*k*k}. A similar figure has all lengths multiplied by {k}. Find the new area.",n*k**4,["Area scales by k².",f"{k}² = {k*k}; {n*k*k} × {k*k} = {n*k**4}."],b=.5)
def a12():
    s=ri(2,9);return NUM('area',2,'a12',f"A regular hexagon has side {s}. Its apothem is {s}√3/2. Find the area as a multiple of √3: area = ? √3",3*s*s/2*1,["Area = ½ × apothem × perimeter.",f"Perimeter = {6*s}; apothem = {s}√3/2.",f"½ × {s}√3/2 × {6*s} = {3*s*s/2:g}√3."],show=f"{3*s*s/2:g}√3",b=1.3)
# ---- sol
def v1():
    l,w,h=ri(2,12),ri(2,10),ri(2,9);return NUM('sol',1,'v1',f"Find the volume of a box {l} × {w} × {h}.",l*w*h,["V = length × width × height.",f"{l}×{w}×{h} = {l*w*h}."],b=-1)
def v2():
    l,w,h=ri(2,9),ri(2,9),ri(2,9);return NUM('sol',2,'v2',f"Find the total surface area of a box {l} × {w} × {h}.",2*(l*w+l*h+w*h),["SA = 2(lw + lh + wh).",f"2({l*w} + {l*h} + {w*h}) = {2*(l*w+l*h+w*h)}."],b=.2)
def v3():
    r=ri(2,9);h=ri(2,12);return NUM('sol',2,'v3',f"Find the volume of a cylinder with radius {r} and height {h} (coefficient of π).",r*r*h,["V = π r² h.",f"{r}² × {h} = {r*r*h}, so V = {r*r*h}π."],pi=True,show=f"{r*r*h}π",b=.3)
def v4():
    r=ri(2,9);h=3*ri(1,5);return NUM('sol',2,'v4',f"Find the volume of a cone with radius {r} and height {h} (coefficient of π).",r*r*h/3,["V = ⅓ π r² h.",f"⅓ × {r*r} × {h} = {r*r*h//3}."],pi=True,show=f"{r*r*h//3}π",b=.5)
def v5():
    r=3*ri(1,5);return NUM('sol',2,'v5',f"Find the volume of a sphere with radius {r} (coefficient of π).",4*r**3/3,["V = (4/3) π r³.",f"(4/3) × {r**3} = {4*r**3//3}."],pi=True,show=f"{4*r**3//3}π",b=.6)
def v6():
    l,w,h=ri(3,12),ri(3,12),3*ri(1,4);return NUM('sol',2,'v6',f"Find the volume of a pyramid with a {l} × {w} base and height {h}.",l*w*h/3,["V = ⅓ × base area × height.",f"⅓ × {l*w} × {h} = {l*w*h//3}."],b=.4)
def v7():
    r=ri(2,9);return NUM('sol',3,'v7',f"Find the surface area of a sphere with radius {r} (coefficient of π).",4*r*r,["SA = 4 π r².",f"4 × {r*r} = {4*r*r}."],pi=True,show=f"{4*r*r}π",b=.7)
def v8():
    k=R.choice([2,3,4]);v=ri(2,9);return NUM('sol',3,'v8',f"A solid has volume {v}. A similar solid has every length multiplied by {k}. Find its volume.",v*k**3,["Volume scales by k³.",f"{k}³ = {k**3}; {v} × {k**3} = {v*k**3}."],b=.9)
def v9():
    r=ri(2,9);h=ri(2,12);return NUM('sol',3,'v9',f"Find the lateral (side) area of a cylinder with radius {r} and height {h} (coefficient of π).",2*r*h,["Lateral area = 2π r h (the rolled-up rectangle).",f"2 × {r} × {h} = {2*r*h}."],pi=True,show=f"{2*r*h}π",b=.8)
def v10():
    return MC('sol',1,'v10',"Which formula gives the volume of any prism?","V = Bh (base area × height)",["V = ½Bh","V = 2πrh","V = ⅓Bh²"],["Prism volume = area of base × height.","A pyramid has the ⅓."],b=-.3)
# ---- crd
def d1():
    x=ri(-6,6);y=ri(-6,6);dx=ri(1,6);dy=ri(1,6);t=R.choice([(3,4,5),(5,12,13),(6,8,10)]);dx,dy,c=t
    return NUM('crd',2,'d1',f"Find the distance between ({x}, {y}) and ({x+dx}, {y+dy}).",c,["d = √[(x₂−x₁)² + (y₂−y₁)²].",f"√({dx}² + {dy}²) = √{dx*dx+dy*dy}.",f"= {c}."],b=.4)
def d2():
    x1,y1,x2,y2=ri(-9,9),ri(-9,9),ri(-9,9),ri(-9,9)
    if (x1+x2)%2 or (y1+y2)%2:return False
    return MC('crd',1,'d2',f"Find the midpoint of ({x1}, {y1}) and ({x2}, {y2}).",f"({(x1+x2)//2}, {(y1+y2)//2})",[f"({(x1+x2)//2+1}, {(y1+y2)//2})",f"({(x1-x2)//2}, {(y1-y2)//2})",f"({(x1+x2)//2}, {(y1+y2)//2-1})"],["Average the x-values and the y-values.",f"({x1}+{x2})/2 = {(x1+x2)//2}; ({y1}+{y2})/2 = {(y1+y2)//2}."],b=-.2)
def d3():
    x1,y1=ri(-5,5),ri(-5,5);dx=ri(1,6);m=ri(-4,4)
    if m==0:return False
    return MC('crd',1,'d3',f"Find the slope through ({x1}, {y1}) and ({x1+dx}, {y1+m*dx}).",f"{m}",[f"{-m}",f"{Fr(1,m)}" if abs(m)!=1 else f"{m+2}",f"{-Fr(1,m)}" if abs(m)!=1 else f"{m+3}"],["slope = rise ÷ run.",f"Rise {m*dx}, run {dx}.",f"= {m}."],b=-.3)
def d4():
    a=R.choice([2,3,4,5,-2,-3,-4,-5]);return MC('crd',2,'d4',f"A line has slope {a}. What is the slope of a line PERPENDICULAR to it?",f"{Fr(-1,a)}",[f"{a}",f"{-a}",f"{Fr(1,a)}"],["Perpendicular slopes are negative reciprocals.",f"−1 ÷ {a} = {Fr(-1,a)}."],b=.2)
def d5():
    h,k,r=ri(-5,5),ri(-5,5),ri(2,9);return MC('crd',2,'d5',f"Which is the equation of a circle with center ({h}, {k}) and radius {r}?",f"(x {sg(-h)})² + (y {sg(-k)})² = {r*r}",[f"(x {sg(h)})² + (y {sg(k)})² = {r*r}",f"(x {sg(-h)})² + (y {sg(-k)})² = {r}",f"(x {sg(-h)}) + (y {sg(-k)}) = {r*r}"],["Form: (x − h)² + (y − k)² = r².",f"h = {h}, k = {k}, r² = {r*r}."],b=.6) if h and k else False
def d6():
    m=ri(-4,4);b=ri(-8,8);x=ri(-3,3);
    if m==0:return False
    return NUM('crd',1,'d6',f"For y = {m}x {sg(b)}, find y when x = {x}.",m*x+b,[f"Substitute x = {x}.",f"{m}({x}) {sg(b)} = {m*x+b}."],b=-.6)
def d7():
    m=ri(-4,4);x1=ri(-4,4);y1=ri(-6,6);b=y1-m*x1
    if m==0:return False
    return NUM('crd',2,'d7',f"A line has slope {m} and passes through ({x1}, {y1}). What is its y-intercept?",b,["Use y = mx + b.",f"{y1} = {m}({x1}) + b.",f"b = {b}."],b=.3)
def d8():
    return MC('crd',3,'d8',"Points A(0,0), B(4,0), C(5,3), D(1,3). What is quadrilateral ABCD?","Parallelogram",["Rectangle","Rhombus","Trapezoid only"],["AB ∥ DC (both slope 0) and AD ∥ BC (both slope 3).","Side AB = 4 but AD = √10, so not a rhombus; no right angles, so not a rectangle."],b=1)
# ---- trn
def t1():
    x,y=ri(-6,6),ri(-6,6)
    if not x or not y:return False
    return MC('trn',1,'t1',f"Reflect ({x}, {y}) across the x-axis.",f"({x}, {-y})",[f"({-x}, {y})",f"({-x}, {-y})",f"({y}, {x})"],["Across the x-axis: the y-sign flips.","(x, y) → (x, −y)."],b=-.3)
def t2():
    x,y=ri(-6,6),ri(-6,6)
    if not x or not y:return False
    return MC('trn',1,'t2',f"Reflect ({x}, {y}) across the y-axis.",f"({-x}, {y})",[f"({x}, {-y})",f"({-x}, {-y})",f"({y}, {x})"],["Across the y-axis: the x-sign flips.","(x, y) → (−x, y)."],b=-.3)
def t3():
    x,y=ri(-6,6),ri(-6,6);a,b=ri(-5,5),ri(-5,5)
    return MC('trn',1,'t3',f"Translate ({x}, {y}) by ({a}, {b}) (right a, up b). Where does it land?",f"({x+a}, {y+b})",[f"({x-a}, {y-b})",f"({x+b}, {y+a})",f"({x+a}, {y-b})"],["Add the shift to each coordinate.",f"({x}+{a}, {y}+{b})."],b=-.6) if a and b else False
def t4():
    x,y=ri(-6,6),ri(-6,6);d=R.choice([90,180,270])
    new={90:(-y,x),180:(-x,-y),270:(y,-x)}[d]
    if not x or not y or x==y:return False
    bad=[v for k,v in {90:(-y,x),180:(-x,-y),270:(y,-x)}.items() if k!=d]+[(x,-y)]
    return MC('trn',2,'t4',f"Rotate ({x}, {y}) {d}° counterclockwise about the origin.",f"({new[0]}, {new[1]})",[f"({u}, {v})" for u,v in bad],["Rules: 90° → (−y, x); 180° → (−x, −y); 270° → (y, −x).",f"Apply the {d}° rule."],b=.7)
def t5():
    x,y=ri(-6,6),ri(-6,6);k=R.choice([2,3,4,Fr(1,2)])
    if isinstance(k,Fr) and (x%2 or y%2):return False
    X,Y=x*k,y*k;fmt=lambda v:str(int(v)) if v==int(v) else str(v)
    return MC('trn',2,'t5',f"Dilate ({x}, {y}) by scale factor {fm(k)} about the origin.",f"({fmt(X)}, {fmt(Y)})",[f"({fmt(x+k)}, {fmt(y+k)})",f"({fmt(x/k)}, {fmt(y/k)})",f"({fmt(-X)}, {fmt(Y)})"],["Multiply both coordinates by the scale factor.",f"({x}·{fm(k)}, {y}·{fm(k)})."],b=.2)
def t6():
    return MC('trn',1,'t6',"Which transformation does NOT keep the size and shape of a figure?","Dilation (scale factor 2)",["Reflection","Rotation","Translation"],["Reflections, rotations and translations are isometries (rigid motions).","A dilation changes size."],b=-.5)
def t7():
    n=R.choice([3,4,5,6,8]);return NUM('trn',2,'t7',f"How many lines of symmetry does a regular {n}-gon have?",n,["A regular n-gon has n lines of symmetry.",f"So {n}."],b=0)
def t8():
    n=R.choice([3,4,5,6,8,9,10,12]);return NUM('trn',3,'t8',f"What is the smallest positive angle of rotational symmetry (degrees) for a regular {n}-gon?",360//n if 360%n==0 else 360/n,["360° ÷ n.",f"360 ÷ {n} = {360/n:g}."],b=.6)
FAMS3=dict(area=[a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12],sol=[v1,v2,v3,v4,v5,v6,v7,v8,v9,v10],crd=[d1,d2,d3,d4,d5,d6,d7,d8],trn=[t1,t2,t3,t4,t5,t6,t7,t8])
def run(n=10):
    for t,fs in FAMS3.items():
        for f in fs:rep(f,n)
