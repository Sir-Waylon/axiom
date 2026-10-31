# -*- coding: utf-8 -*-
"""Apex 5: inverse trig, angle identities, area of triangles (aligned to a precalculus course scope)."""
from adv_h import *
rad=math.radians
deg=math.degrees
def f4(x):return f"{x:.4f}"
CARDS={
'iv':[
("Undoing a function","An inverse function undoes another: if f turns x into y, then f⁻¹ turns y back into x. Check: f⁻¹(f(x)) = x. Note f⁻¹(x) is NOT 1/f(x).","f⁻¹(f(x)) = x"),
("Trig takes an angle, inverse takes a ratio","sin, cos and tan turn an angle into a ratio. sin⁻¹ (also written arcsin), cos⁻¹ and tan⁻¹ turn a ratio back into an angle. That is how you find a missing angle in a right triangle.","θ = sin⁻¹(opp/hyp)"),
("Why we restrict the range","Sine repeats forever, so many angles share one ratio. To make an inverse, we keep one piece: arcsin gives −90° to 90°, arccos gives 0° to 180°, arctan gives −90° to 90° (open).",None),
("Using a calculator","Check degree or radian mode first. Use the sin⁻¹, cos⁻¹, tan⁻¹ keys. arcsin and arccos only accept inputs from −1 to 1; arctan accepts any number.",None),
],
'id':[
("Sum and difference","sin(A ± B) = sin A cos B ± cos A sin B. cos(A ± B) = cos A cos B ∓ sin A sin B. Notice the sign flips for cosine.","sin(A+B) = sinA cosB + cosA sinB"),
("Double angles","Put B = A in the sum formulas: sin 2A = 2 sin A cos A and cos 2A = cos²A − sin²A = 1 − 2 sin²A = 2 cos²A − 1.","sin 2A = 2 sinA cosA"),
("Half angles","Solve the cosine double-angle formula for the half angle: sin²(A/2) = (1 − cos A)/2 and cos²(A/2) = (1 + cos A)/2. Pick the sign from the quadrant.",None),
("Product to sum","Adding the sum and difference formulas gives 2 sin A cos B = sin(A+B) + sin(A−B). The same idea turns products into sums and sums into products.",None),
],
}
def iv1():
    k=pick([Fr(1,2),Fr(1,1),Fr(0,1),Fr(-1,2)])
    return NM('iv','F',f"What is sin⁻¹({num(k)}) in degrees? (answer between −90° and 90°)",deg(math.asin(float(k))),[f"Find the angle between −90° and 90° whose sine is {num(k)}."],u='°',free=True,tol=0.004)
def iv2():
    a=pick([30,45,60,0,90])
    c=round(math.cos(rad(a)),4)
    return NM('iv','B',f"cos⁻¹({c}) = ? (degrees, between 0° and 180°)",a,[f"cos {a}° = {c}, and {a}° is in the allowed range 0° to 180°."],u='°',free=True,tol=0.004)
def iv3():
    a=rint(10,80);h=rint(8,30)
    o=round(h*math.sin(rad(a)),2)
    return NM('iv','B',f"A ramp {h} m long rises {o} m. What angle does it make with the ground? (degrees, 1 decimal)",round(math.asin(o/h)*180/math.pi,1),[f"sin θ = opposite/hypotenuse = {o}/{h}.",f"θ = sin⁻¹({o/h:.4f}) ≈ {round(deg(math.asin(o/h)),1)}°."],u='°',free=True,tol=0.004)
def iv4():
    opp=rint(3,12);adj=rint(3,12)
    ans=round(deg(math.atan(opp/adj)),1)
    return NM('iv','B',f"A right triangle has legs {opp} and {adj} (angle θ is opposite the leg {opp}). Find θ in degrees (1 decimal).",ans,[f"tan θ = {opp}/{adj}.",f"θ = tan⁻¹({opp/adj:.4f}) ≈ {ans}°."],u='°',free=True,tol=0.004)
def iv5():
    x=pick([0.3,0.6,0.8,0.5,-0.5])
    return NM('iv','C',f"Find arccos({x}) in degrees (1 decimal).",round(deg(math.acos(x)),1),[f"arccos gives an angle between 0° and 180°.",f"arccos({x}) ≈ {round(deg(math.acos(x)),1)}°."],u='°',free=True,tol=0.004)
def iv6():
    x=pick([0.5,0.866,0.25,0.9,0.1])
    return NM('iv','C',f"Find arcsin(−{x}) in degrees (1 decimal).",round(deg(math.asin(-x)),1),["arcsin of a negative number is a negative angle between −90° and 0°.",f"arcsin(−{x}) = −arcsin({x}) ≈ {round(deg(math.asin(-x)),1)}°."],u='°',free=True,tol=0.004)
def iv7():
    return NM('iv','M',"What is the exact value of sin(sin⁻¹(0.4))?",0.4,["sin and sin⁻¹ undo each other when the input is between −1 and 1.","So sin(sin⁻¹(0.4)) = 0.4."])
def iv8():
    s=pick([Fr(3,5),Fr(5,13),Fr(8,17),Fr(7,25)])
    c=math.sqrt(1-float(s)**2)
    return NM('iv','M',f"Find cos(sin⁻¹({num(s)})) as a decimal (θ = sin⁻¹ is in quadrant I).",c,[f"Draw a right triangle with opposite {s.numerator} and hypotenuse {s.denominator}.",f"adjacent = √({s.denominator}² − {s.numerator}²) = {c*s.denominator:.4g}.",f"cos θ = {c:.4f}."],tol=0.003)
def iv9():
    return NM('iv','M',"What is the domain of arcsin (largest allowed input)? Give the largest allowed input value.",1,["arcsin accepts ratios from −1 to 1, since sine never exceeds 1."])
def iv10():
    x=pick([0.5,1,2,5,10])
    return NM('iv','C',f"Find arctan({x}) in degrees (1 decimal).",round(deg(math.atan(x)),1),[f"arctan({x}) ≈ {round(deg(math.atan(x)),1)}°."],u='°',free=True,tol=0.004)
def id1():
    a,b=pick([(30,45),(45,60),(60,30),(45,45),(30,60)])
    return NM('id','B',f"Use sin(A + B) = sin A cos B + cos A sin B with A = {a}° and B = {b}° to find sin {a+b}° (4 decimals).",round(math.sin(rad(a+b)),4),[f"sin {a}° cos {b}° + cos {a}° sin {b}°.",f"= {math.sin(rad(a+b)):.4f}."],tol=0.003)
def id2():
    a,b=pick([(75,30),(60,15),(45,15),(90,30),(120,45)])
    return NM('id','C',f"Use cos(A − B) = cos A cos B + sin A sin B with A = {a}°, B = {b}° to find cos {a-b}° (4 decimals).",round(math.cos(rad(a-b)),4),[f"cos {a}° cos {b}° + sin {a}° sin {b}°.",f"= {math.cos(rad(a-b)):.4f}."],tol=0.003)
def id3():
    a=pick([15,20,25,35,40])
    return NM('id','B',f"Use sin 2A = 2 sin A cos A with A = {a}° to find sin {2*a}° (4 decimals).",round(math.sin(rad(2*a)),4),[f"2 × sin {a}° × cos {a}° = {math.sin(rad(2*a)):.4f}."],tol=0.003)
def id4():
    s=pick([Fr(3,5),Fr(5,13),Fr(8,17),Fr(7,25)])
    return NM('id','C',f"sin A = {num(s)} with A in quadrant I. Find cos 2A as a decimal.",float(1-2*s*s),["cos 2A = 1 − 2 sin²A.",f"= 1 − 2({num(s*s)}) = {num(1-2*s*s)}."],tol=0.003)
def id5():
    a=pick([30,60,90,120,40,50])
    return NM('id','C',f"Use sin²(A/2) = (1 − cos A)/2 to find sin²({a//2}°) with A = {a}° (4 decimals).",round((1-math.cos(rad(a)))/2,4),[f"(1 − cos {a}°)/2 = {(1-math.cos(rad(a)))/2:.4f}."],tol=0.003)
def id6():
    a=pick([30,60,90,120,150])
    return NM('id','M',f"Use half-angle: find cos {a//2}° for A = {a}° using √((1 + cos A)/2) (4 decimals).",round(math.sqrt((1+math.cos(rad(a)))/2),4),[f"cos {a}° = {math.cos(rad(a)):.4f}.",f"√((1 + {math.cos(rad(a)):.4f})/2) = {math.sqrt((1+math.cos(rad(a)))/2):.4f}."],tol=0.003)
def id7():
    a,b=pick([(60,30),(75,15),(45,15),(80,20)])
    return NM('id','M',f"Product-to-sum: 2 sin {a}° cos {b}° = sin {a+b}° + sin {a-b}°. Compute it (4 decimals).",round(2*math.sin(rad(a))*math.cos(rad(b)),4),[f"sin {a+b}° + sin {a-b}° = {math.sin(rad(a+b)):.4f} + {math.sin(rad(a-b)):.4f}.",f"= {2*math.sin(rad(a))*math.cos(rad(b)):.4f}."],tol=0.003)
def id8():
    return NM('id','M',"If tan A = 3/4 and A is in quadrant I, what is sin 2A as a decimal?",24/25,["Triangle 3-4-5: sin A = 3/5, cos A = 4/5.","sin 2A = 2 × 3/5 × 4/5 = 24/25 = 0.96."],tol=0.003)
def id9():
    a=pick([75,105,15,165])
    return NM('id','M',f"Find sin {a}° using a sum or difference of 45°, 30°, 60°, 90°, 120° or 135° (4 decimals).",round(math.sin(rad(a)),4),[f"For example {a}° is a sum or difference of special angles.",f"sin {a}° = {math.sin(rad(a)):.4f}."],tol=0.003)
def id10():
    return NM('id','F',"Is sin(A + B) equal to sin A + sin B? Type 1 for yes, 0 for no. (Try A = B = 30°.)",0,["sin 60° ≈ 0.866 but sin 30° + sin 30° = 1.","So they are not equal: 0."])
def ar1():
    a=rint(4,15);b=rint(4,15);C=pick([30,45,60,90])
    return NM('id','B',f"A triangle has two sides {a} and {b} with an included angle of {C}°. Find its area (2 decimals) using ½ab sin C.",round(0.5*a*b*math.sin(rad(C)),2),[f"½ × {a} × {b} × sin {C}°.",f"≈ {0.5*a*b*math.sin(rad(C)):.2f}."],tol=0.003)
FAMS=[iv1,iv2,iv3,iv4,iv5,iv6,iv7,iv8,iv9,iv10,id1,id2,id3,id4,id5,id6,id7,id8,id9,id10,ar1]
def run(n=14):
    for f in FAMS:gen.rep(f,n)
