# -*- coding: utf-8 -*-
from gen import *
from math import isqrt,sqrt,gcd
def ri(a,b):return R.randint(a,b)
TR=[(3,4,5),(5,12,13),(8,15,17),(7,24,25),(20,21,29),(9,40,41)]
# ---- quad
def q1():
    a=ri(40,130);return NUM('quad',1,'q1',f"In parallelogram ABCD, m∠A = {a}°. Find m∠C (degrees).",a,["Opposite angles of a parallelogram are equal.",f"∠C = ∠A = {a}°."],b=-.8)
def q2():
    a=ri(40,130);return NUM('quad',1,'q2',f"In parallelogram ABCD, m∠A = {a}°. Find m∠B (degrees).",180-a,["Consecutive angles are supplementary.",f"180 − {a} = {180-a}."],b=-.5)
def q3():
    p=ri(2,5);c=ri(1,9);x=ri(2,12);q=ri(1,p-1) if p>1 else 1;d=p*x+c-q*x
    return NUM('quad',2,'q3',f"In parallelogram ABCD, AB = {p}x + {c} and CD = {q}x + {d}. Find x.",x,["Opposite sides of a parallelogram are equal.",f"{p}x + {c} = {q}x + {d}.",f"{p-q}x = {d-c}, x = {x}."],b=.5) if d>0 else False
def q4():
    d1=2*ri(4,14);d2=2*ri(4,14);return NUM('quad',2,'q4',f"The diagonals of a parallelogram meet at P. One diagonal is {d1} long. How long is the segment from a vertex to P along it?",d1/2,["Diagonals of a parallelogram bisect each other.",f"{d1} ÷ 2 = {d1//2}."],b=-.2)
def q5():
    a=ri(5,16);b=ri(5,16);return NUM('quad',2,'q5',f"A rhombus has side {a}. Find its perimeter.",4*a,["A rhombus has four equal sides.",f"4 × {a} = {4*a}."],b=-.8)
def q6():
    t=R.choice(TR);a,b,c=t;k=ri(1,3)
    return NUM('quad',3,'q6',f"The diagonals of a rhombus are {2*a*k} and {2*b*k}. Find its side length.",c*k,["Diagonals of a rhombus are perpendicular bisectors.",f"Half-diagonals {a*k} and {b*k} form a right triangle with the side as hypotenuse.",f"√({a*k}² + {b*k}²) = {c*k}."],b=1.2)
def q7():
    a=ri(6,20);b=ri(6,20);return NUM('quad',2,'q7',f"Find the length of the diagonal of a rectangle with sides {3*a//a*3 if False else 3*ri(1,5)}.. ",1,[""]) if False else None
def q8():
    t=R.choice(TR[:3]);k=ri(1,4);a,b,c=t
    return NUM('quad',2,'q8',f"A rectangle has sides {a*k} and {b*k}. How long is each diagonal?",c*k,["Diagonals of a rectangle are equal and cut the rectangle into right triangles.",f"√({a*k}² + {b*k}²) = {c*k}."],b=.4)
def q9():
    b1=ri(5,15);b2=b1+2*ri(1,8);return NUM('quad',2,'q9',f"Find the midsegment of a trapezoid whose bases are {b1} and {b2}.",(b1+b2)/2,["Midsegment = average of the bases.",f"({b1} + {b2}) ÷ 2 = {(b1+b2)/2:g}."],b=0)
def q10():
    b1=ri(5,15);m=ri(b1+1,b1+10);return NUM('quad',3,'q10',f"A trapezoid has a midsegment of {m} and one base of {b1}. Find the other base.",2*m-b1,["Midsegment = (b₁ + b₂) ÷ 2, so b₁ + b₂ = 2 × midsegment.",f"2 × {m} − {b1} = {2*m-b1}."],b=1)
def q11():
    a=ri(50,130);return NUM('quad',2,'q11',f"In an isosceles trapezoid, one base angle is {a}°. Find the angle at the other base on the same leg (degrees).",180-a,["The legs are transversals of parallel bases, so same-side angles are supplementary.",f"180 − {a} = {180-a}."],b=.3)
def q12():
    return MC('quad',2,'q12',R.choice(["Which shape ALWAYS has perpendicular diagonals?"]),"Rhombus",["Rectangle","Parallelogram","Isosceles trapezoid"],["Rhombus diagonals are perpendicular bisectors.","A rectangle's diagonals are equal but not perpendicular (unless it is a square)."],b=.2)
def q13():
    return MC('quad',2,'q13',"Which shape has diagonals that are equal in length but are NOT perpendicular in general?","Rectangle",["Rhombus","Kite","Parallelogram"],["Rectangle diagonals are congruent.","Rhombus diagonals are perpendicular; a general parallelogram's are neither."],b=.2)
# ---- sim
def s1():
    a=ri(2,7);b=ri(2,7);k=ri(2,6)
    if gcd(a,b)>1 or a==b:return False
    return NUM('sim',1,'s1',f"The ratio of two lengths is {a} : {b}. The first is {a*k}. Find the second.",b*k,[f"{a*k} ÷ {a} = {k} per part.",f"{b} × {k} = {b*k}."],b=-.5)
def s2():
    a=ri(2,9);b=ri(2,9);x=ri(3,15);c=a*x;d=b*x
    if a==b:return False
    return NUM('sim',2,'s2',f"Solve the proportion  {a}/{b} = {c}/x.",d,["Cross-multiply.",f"{a}x = {b}·{c} = {b*c}.",f"x = {d}."],b=.1)
def s3():
    k=R.choice([2,3,4,5]);a=ri(3,9);b=ri(3,9);return NUM('sim',2,'s3',f"△ABC ∼ △DEF with scale factor 1 : {k}. AB = {a}. Find DE.",a*k,[f"Scale factor 1 : {k} multiplies lengths by {k}.",f"{a} × {k} = {a*k}."],b=0)
def s4():
    k=R.choice([2,3,4,5]);a=ri(3,9);return NUM('sim',2,'s4',f"Two similar polygons have scale factor 1 : {k}. The smaller has perimeter {a*4}. Find the larger perimeter.",a*4*k,["Perimeters scale by the same factor as sides.",f"{a*4} × {k} = {a*4*k}."],b=.2)
def s5():
    k=R.choice([2,3,4,5]);a=ri(2,9);return NUM('sim',2,'s5',f"Two similar figures have scale factor 1 : {k}. The smaller has area {a} cm². Find the larger area (cm²).",a*k*k,["Areas scale by the SQUARE of the scale factor.",f"{k}² = {k*k}; {a} × {k*k} = {a*k*k}."],b=.4)
def s6():
    a=ri(2,6);b=ri(2,6)
    if a==b:return False
    A=a*a*ri(1,4);return NUM('sim',3,'s6',f"Two similar figures have corresponding sides {a} and {b}. The first has area {A}. Find the second area (round to 0.01).",round(A*b*b/(a*a),2),["Area ratio = (side ratio)².",f"{A} × ({b}/{a})² = {A*b*b/(a*a):.2f}."],tol=.02,b=1.1)
def s7():
    s=ri(2,6);x=ri(2,6);t=ri(2,6)
    # DE ∥ BC; AD=s, DB=x, AE=t ; find EC
    a=ri(2,8);d=ri(2,8);e=ri(2,8);ec=Fr(d*e,a)
    if ec.denominator!=1:return False
    return NUM('sim',2,'s7',f"In △ABC, DE ∥ BC with D on AB and E on AC. AD = {a}, DB = {d}, AE = {e}. Find EC.",ec,["A line parallel to one side divides the other two sides proportionally.",f"AD/DB = AE/EC → {a}/{d} = {e}/EC.",f"EC = {d}·{e}/{a} = {ec}."],b=.5)
def s8():
    h=ri(2,8);k=ri(2,6);return NUM('sim',3,'s8',f"A {h}-ft stick casts a {k}-ft shadow. At the same time a tree casts a {k*4}-ft shadow. How tall is the tree (ft)?",h*4,["Shadows and heights make similar right triangles.",f"{h}/{k} = x/{k*4}.",f"x = {h*4}."],b=.5)
def s9():
    return MC('sim',1,'s9',"Which is enough to prove two triangles similar?","Two pairs of equal angles (AA)",["Two pairs of equal sides","One pair of equal angles","Equal perimeters"],["AA similarity: two equal angle pairs force the third.","Equal sides alone do not guarantee the same shape."],b=-.4)
def s10():
    return MC('sim',2,'s10',"△ABC ∼ △DEF. Which proportion must be true?","AB/DE = BC/EF",["AB/DE = EF/BC","AB/BC = EF/DE","AB/EF = BC/DE"],["Corresponding sides: AB↔DE, BC↔EF.","Keep the same order of letters."],b=.2)
# ---- rt
def r1():
    a,b,c=R.choice(TR);k=ri(1,3);return NUM('rt',1,'r1',f"A right triangle has legs {a*k} and {b*k}. Find the hypotenuse.",c*k,["a² + b² = c².",f"{a*k}² + {b*k}² = {(a*k)**2+(b*k)**2}.",f"c = √{(a*k)**2+(b*k)**2} = {c*k}."],b=-.3)
def r2():
    a,b,c=R.choice(TR);k=ri(1,3);return NUM('rt',2,'r2',f"A right triangle has hypotenuse {c*k} and one leg {a*k}. Find the other leg.",b*k,["Leg² = hypotenuse² − other leg².",f"{c*k}² − {a*k}² = {(c*k)**2-(a*k)**2}.",f"√ = {b*k}."],b=.3)
def r3():
    a=ri(2,12);return NUM('rt',2,'r3',f"A right triangle has legs {a} and {a}. Find the hypotenuse to the nearest tenth.",round(a*sqrt(2),1),["Isosceles right triangle: hypotenuse = leg × √2.",f"{a} × 1.414 = {a*sqrt(2):.1f}."],tol=.06,b=.2)
def r4():
    a=ri(2,14);return NUM('rt',2,'r4',f"In a 30°-60°-90° triangle the short leg is {a}. Find the hypotenuse.",2*a,["Hypotenuse = 2 × short leg.",f"2 × {a} = {2*a}."],b=0)
def r5():
    a=ri(2,10);return NUM('rt',3,'r5',f"In a 30°-60°-90° triangle the short leg is {a}. Find the long leg to the nearest tenth.",round(a*sqrt(3),1),["Long leg = short leg × √3.",f"{a} × 1.732 = {a*sqrt(3):.1f}."],tol=.06,b=.7)
def r6():
    a,b,c=R.choice(TR);k=ri(1,3);s=sorted([a*k,b*k,c*k]);ok=R.random()<.6
    if not ok:s[2]+=ri(1,3)
    good='Yes, a right triangle' if ok else 'No, not a right triangle'
    return MC('rt',2,'r6',f"Are {s[0]}, {s[1]}, {s[2]} the sides of a right triangle?",good,[x for x in ['Yes, a right triangle','No, not a right triangle','Cannot tell','It is a degenerate segment'] if x!=good],[f"Test: {s[0]}² + {s[1]}² = {s[0]**2+s[1]**2}.",f"{s[2]}² = {s[2]**2}.",'They match, so right.' if ok else 'They differ, so not right.'],b=.3)
def r7():
    a,b=ri(3,12),ri(4,12);return NUM('rt',2,'r7',f"A right triangle has legs {a} and {b}. The altitude to the hypotenuse splits it. How long is the hypotenuse squared?",a*a+b*b,["c² = a² + b²",f"{a*a} + {b*b} = {a*a+b*b}."],b=0) if False else None
def r8():
    a,b,c=R.choice(TR[:3]);k=ri(1,3);o,ad,h=a,b,c;pick=R.choice(['sin','cos','tan'])
    num,den={'sin':(a,c),'cos':(b,c),'tan':(a,b)}[pick]
    f=Fr(num,den);good=f"{f.numerator}/{f.denominator}"
    bad=[f"{b//gcd(b,c)}/{c//gcd(b,c)}" if pick!='cos' else f"{a//gcd(a,c)}/{c//gcd(a,c)}"]
    alt={'sin':(b,c),'cos':(a,c),'tan':(b,a)}[pick];fa=Fr(*alt);bad.append(f"{fa.numerator}/{fa.denominator}")
    bad.append(f"{c}/{a}" if pick!='tan' else f"{c}/{b}");bad.append(f"{a}/{a+b}")
    return MC('rt',2,'r8',f"In a right triangle with legs {a*k} and {b*k} and hypotenuse {c*k}, find {pick} of the angle opposite the leg {a*k}.",good,bad,["SOH-CAH-TOA: sin = opp/hyp, cos = adj/hyp, tan = opp/adj.",f"Opposite = {a*k}, adjacent = {b*k}, hypotenuse = {c*k}.",f"{pick} = {good} (simplified)."],b=.5)
def r9():
    ang=R.choice([30,40,50,60]);d=ri(10,60);import math
    return NUM('rt',3,'r9',f"A ladder leans against a wall and makes a {ang}° angle with the ground. The foot is {d} ft from the wall. How high up the wall does it reach (ft, nearest tenth)? (tan{ang}° ≈ {math.tan(math.radians(ang)):.3f})",round(d*math.tan(math.radians(ang)),1),["Opposite (height) over adjacent (distance): tan θ = h/d.",f"h = {d} × {math.tan(math.radians(ang)):.3f}."],tol=.3,b=1)
# ---- cir
def c1():
    r=ri(2,15);return NUM('cir',1,'c1',f"A circle has radius {r}. Find its diameter.",2*r,["Diameter = 2 × radius.",f"2 × {r} = {2*r}."],b=-1)
def c2():
    a=ri(20,160);return NUM('cir',1,'c2',f"A central angle measures {a}°. What is the measure of its intercepted arc (degrees)?",a,["A central angle equals its arc."],b=-.7)
def c3():
    a=2*ri(10,80);return NUM('cir',2,'c3',f"An inscribed angle intercepts an arc of {a}°. Find the inscribed angle (degrees).",a/2,["An inscribed angle is half its intercepted arc.",f"{a} ÷ 2 = {a//2}."],b=0)
def c4():
    a=ri(20,80);return NUM('cir',2,'c4',f"An inscribed angle measures {a}°. Find its intercepted arc (degrees).",2*a,["Arc = 2 × inscribed angle.",f"2 × {a} = {2*a}."],b=0)
def c5():
    return NUM('cir',2,'c5',"An angle inscribed in a semicircle measures how many degrees?",90,["It intercepts a 180° arc.","Half of 180° is 90°."],b=-.3)
def c6():
    r=ri(3,13);d=r*r+ri(0,0);t=ri(3,12);return NUM('cir',2,'c6',f"A tangent segment from P touches a circle at T. The radius is {r} and the distance from P to the center is {int(sqrt(r*r+t*t)) if False else 0}.",1,[""]) if False else None
def c7():
    a,b,c=R.choice(TR[:3]);k=ri(1,3);return NUM('cir',3,'c7',f"A tangent from P touches a circle of radius {a*k} at T. P is {c*k} from the center O. Find PT.",b*k,["The radius to a tangent point is perpendicular to the tangent.",f"△OTP is right: PT² = {c*k}² − {a*k}².",f"PT = {b*k}."],b=1)
def c8():
    a=ri(20,160);b=ri(20,160)
    if a+b>=340:return False
    return NUM('cir',3,'c8',f"Two chords meet INSIDE a circle forming an angle that intercepts arcs of {a}° and {b}°. Find the angle (degrees).",(a+b)/2,["Angle formed by two chords = half the SUM of the intercepted arcs.",f"({a} + {b}) ÷ 2 = {(a+b)/2:g}."],b=1.3)
def c9():
    a=ri(100,250);b=ri(20,90)
    if a<=b:return False
    return NUM('cir',3,'c9',f"Two secants meet OUTSIDE a circle. They intercept arcs of {a}° and {b}°. Find the angle (degrees).",(a-b)/2,["Angle outside = half the DIFFERENCE of the arcs.",f"({a} − {b}) ÷ 2 = {(a-b)/2:g}."],b=1.4)
def c10():
    a=ri(2,8);b=ri(2,8);c=ri(2,8);d=Fr(a*b,c)
    if d.denominator!=1:return False
    return NUM('cir',3,'c10',f"Two chords intersect inside a circle. One is split into {a} and {b}; the other into {c} and x. Find x.",d,["Chord product: (part)(part) = (part)(part).",f"{a}·{b} = {c}·x.",f"x = {d}."],b=1.2)
def c11():
    return MC('cir',1,'c11',"A segment from the center to the circle is a…","radius",["chord","diameter","tangent"],["Radius: center to circle.","A chord joins two points on the circle."],b=-1)
FAMS2=dict(quad=[q1,q2,q3,q4,q5,q6,q8,q9,q10,q11,q12,q13],sim=[s1,s2,s3,s4,s5,s6,s7,s8,s9,s10],rt=[r1,r2,r3,r4,r5,r6,r8,r9],cir=[c1,c2,c3,c4,c5,c7,c8,c9,c10,c11])
def run(n=10):
    for t,fs in FAMS2.items():
        for f in fs:rep(f,n)
