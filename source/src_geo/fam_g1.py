# -*- coding: utf-8 -*-
from gen import *
def ri(a,b):return R.randint(a,b)
# ---- bas
def bas1():
    a=ri(20,80);return NUM('bas',1,'bas1',f"Two angles are complementary. One measures {a}°. Find the other (degrees).",90-a,[f"Complementary angles add to 90°.",f"90 − {a} = {90-a}."],b=-1)
def bas2():
    a=ri(25,155);return NUM('bas',1,'bas2',f"Two angles form a linear pair. One is {a}°. Find the other (degrees).",180-a,["A linear pair adds to 180°.",f"180 − {a} = {180-a}."],b=-1)
def bas3():
    x=ri(8,30);a=2*x+ri(1,9);b=2*x+ri(1,9);a,b=x*3+10,2*x+20
    return NUM('bas',2,'bas3',f"∠A = (3x + 10)° and ∠B = (2x + 20)° are complementary. Find x.",(90-30)/5,["Complementary: (3x + 10) + (2x + 20) = 90.","5x + 30 = 90, so 5x = 60.","x = 12."],b=.3) if False else None
def bas3b():
    p=ri(2,5);q=ri(2,6);c=ri(0,20);d=ri(0,20);tot=90
    # (p x + c)+(q x + d)=90
    rem=tot-c-d;
    if rem%(p+q):return False
    x=rem//(p+q);return NUM('bas',2,'bas3',f"∠A = ({p}x + {c})° and ∠B = ({q}x + {d})° are complementary. Find x.",x,[f"Complementary: ({p}x + {c}) + ({q}x + {d}) = 90.",f"{p+q}x + {c+d} = 90, so {p+q}x = {rem}.",f"x = {x}."],b=.4)
def bas4():
    p=ri(2,5);q=ri(2,6);c=ri(0,30);d=ri(0,30);rem=180-c-d
    if rem%(p+q):return False
    x=rem//(p+q);return NUM('bas',2,'bas4',f"∠1 = ({p}x + {c})° and ∠2 = ({q}x + {d})° form a linear pair. Find the larger angle (degrees).",max(p*x+c,q*x+d),[f"Linear pair: ({p}x + {c}) + ({q}x + {d}) = 180.",f"{p+q}x = {rem}, so x = {x}.",f"Angles: {p*x+c}° and {q*x+d}°. The larger is {max(p*x+c,q*x+d)}°."],b=.7)
def bas5():
    x=ri(10,50);return NUM('bas',1,'bas5',f"Two lines cross. One angle is {x+40}°. What is the angle vertical to it (degrees)?",x+40,["Vertical angles are equal.",f"So it is {x+40}°."],b=-.8)
def bas6():
    a=ri(3,12);b=ri(3,12);c=ri(3,12);return NUM('bas',1,'bas6',f"Points A, B, C lie on a line with B between A and C. AB = {a} and BC = {b}. Find AC.",a+b,["Segment addition: AB + BC = AC.",f"{a} + {b} = {a+b}."],b=-1)
def bas7():
    x=ri(3,12);m=ri(2,5);return NUM('bas',2,'bas7',f"M is the midpoint of AB. AM = {m}x + {ri(1,4)*0+2} and MB = {m+1}x − {2*0+x*0+1}. Find x.",3,["x"],b=0) if False else None
def bas7b():
    a=ri(2,5);c=ri(1,9);x=ri(2,12);b=a+ri(1,3);d=a*x+c-b*x
    if d==0:return False
    return NUM('bas',2,'bas7',f"M is the midpoint of AB. AM = {a}x + {c} and MB = {b}x {sg(d)}. Find x.",x,["A midpoint makes AM = MB.",f"{a}x + {c} = {b}x {sg(d)}.",f"Solve: {c-d} = {b-a}x, so x = {x}."],b=.6)
def bas8():
    a=ri(50,130);return NUM('bas',2,'bas8',f"Ray BD bisects ∠ABC, and m∠ABC = {2*a}°. Find m∠ABD (degrees).",a,["A bisector splits an angle into two equal angles.",f"{2*a} ÷ 2 = {a}."],b=-.3)
# ---- par
def par1():
    a=ri(40,140);kind=R.choice([('corresponding','equal'),('alternate interior','equal'),('same-side interior','supplementary'),('alternate exterior','equal')])
    ans=a if kind[1]=='equal' else 180-a
    return NUM('par',1,'par1',f"Lines ℓ ∥ m are cut by a transversal. One angle is {a}°. Its {kind[0]} angle is how many degrees?",ans,[f"{kind[0].capitalize()} angles with parallel lines are {'equal' if kind[1]=='equal' else 'supplementary (add to 180°)'}.",f"Answer: {ans}°."],b=-.5)
def par2():
    p=ri(2,5);c=ri(0,25);q=ri(1,4);d=ri(0,25);
    # corresponding equal: p x + c = q x + d
    if p==q:return False
    x=ri(3,20);d=p*x+c-q*x
    if d<0 or d>60:return False
    return NUM('par',2,'par2',f"Parallel lines cut by a transversal. Corresponding angles are ({p}x + {c})° and ({q}x + {d})°. Find x.",x,["Corresponding angles with parallel lines are equal.",f"{p}x + {c} = {q}x + {d}.",f"{p-q}x = {d-c}, so x = {x}."],b=.5)
def par3():
    p=ri(1,4);c=ri(0,20);x=ri(5,25);q=ri(1,4);
    d=180-(p*x+c)-q*x
    if d<-20 or d>60 or d==0:return False
    return NUM('par',3,'par3',f"Parallel lines cut by a transversal. Same-side interior angles are ({p}x + {c})° and ({q}x {sg(d)})°. Find the larger angle (degrees).",max(p*x+c,q*x+d),["Same-side interior angles add to 180°.",f"{p+q}x + {c+d} = 180, so x = {x}.",f"Angles: {p*x+c}° and {q*x+d}°."],b=1)
def par4():
    a=ri(30,100);b=ri(30,100)
    if a+b>=170:return False
    return NUM('par',1,'par4',f"A triangle has angles {a}° and {b}°. Find the third angle (degrees).",180-a-b,["Triangle angles add to 180°.",f"180 − {a} − {b} = {180-a-b}."],b=-1)
def par5():
    n=ri(5,12);return NUM('par',2,'par5',f"Find the sum of the interior angles of a convex polygon with {n} sides (degrees).",(n-2)*180,["Sum = (n − 2) × 180°.",f"({n} − 2) × 180 = {(n-2)*180}."],b=0)
def par6():
    n=R.choice([5,6,8,9,10,12,15,18,20,24,30,36]);return NUM('par',2,'par6',f"Each exterior angle of a regular polygon is {360//n}°. How many sides does it have?",n,["Exterior angles of any convex polygon add to 360°.",f"360 ÷ {360//n} = {n}."],b=.5)
def par7():
    n=R.choice([5,6,8,9,10,12,15,18,20]);return NUM('par',2,'par7',f"Find one interior angle of a regular {n}-gon (degrees).",(n-2)*180/n,[f"Sum = ({n} − 2) × 180 = {(n-2)*180}°.",f"Divide by {n}: {(n-2)*180/n:g}°."],b=.4)
def par8():
    a=ri(30,80);b=ri(30,80)
    if a+b>=170:return False
    return NUM('par',2,'par8',f"In a triangle, the two remote interior angles measure {a}° and {b}°. Find the exterior angle at the third vertex (degrees).",a+b,["Exterior angle = sum of the two remote interior angles.",f"{a} + {b} = {a+b}."],b=.2)
# ---- tri
def tri1():
    x=ri(3,15);a=ri(2,4);c=ri(1,9);return NUM('tri',2,'tri1',f"△ABC ≅ △DEF with AB = {a}x + {c} and DE = {a*x+c+0}. If DE = {a*x+c}, find x when a = {a} and c = {c}.",x,["x"]) if False else None
def tri1b():
    a=ri(2,5);c=ri(1,9);x=ri(2,12);return NUM('tri',2,'tri1',f"△ABC ≅ △DEF. AB = {a}x + {c} and DE = {a*x+c}... ",x,[""]) if False else None
def tri2():
    a=ri(3,8);x=ri(2,10);b=ri(1,9)
    return NUM('tri',2,'tri2',f"In an isosceles triangle the equal sides are {a}x + {b} and {a+2}x − {2*x+b-b if False else 0 or 1}. Find x.",x,[""]) if False else None
def tri3():
    a=ri(20,80);return NUM('tri',1,'tri3',f"In an isosceles triangle the vertex angle is {2*a}°. Find one base angle (degrees).",(180-2*a)/2,["Base angles are equal.",f"(180 − {2*a}) ÷ 2 = {(180-2*a)/2:g}."],b=-.3)
def tri4():
    a=ri(25,75);return NUM('tri',1,'tri4',f"In an isosceles triangle a base angle is {a}°. Find the vertex angle (degrees).",180-2*a,["Both base angles are equal.",f"180 − {a} − {a} = {180-2*a}."],b=-.3)
def tri5():
    a,b=sorted(R.sample(range(3,20),2));c=a+b
    return MC('tri',2,'tri5',f"Which set of lengths can form a triangle?",f"{a+2}, {b+1}, {a+b-1}" if a+2+b+1>a+b-1 and a+2+a+b-1>b+1 and b+1+a+b-1>a+2 else f"{a},{b},{c-1}",[f"{a}, {b}, {a+b}",f"{a}, {b}, {a+b+2}",f"{a}, {b}, {a+b+5}"],["Two sides must add to MORE than the third.",f"A set with sum of two shorter sides = third (like {a}, {b}, {a+b}) fails."],b=.2)
def tri6():
    a,b=sorted(R.sample(range(3,25),2))
    return NUM('tri',2,'tri6',f"Two sides of a triangle are {a} and {b}. What is the smallest WHOLE number the third side can be?",b-a+1,["Third side must be greater than the difference: > "+str(b-a)+".",f"Smallest whole number: {b-a+1}."],b=.6)
def tri7():
    a,b=sorted(R.sample(range(3,25),2))
    return NUM('tri',2,'tri7',f"Two sides of a triangle are {a} and {b}. What is the largest WHOLE number the third side can be?",a+b-1,["Third side must be less than the sum: < "+str(a+b)+".",f"Largest whole number: {a+b-1}."],b=.6)
def tri8():
    x=ri(30,70);y=ri(30,70);z=180-x-y
    if z<=20 or len({x,y,z})<3:return False
    L={x:'∠A',y:'∠B',z:'∠C'};op={x:'BC',y:'AC',z:'AB'}
    ang=[x,y,z]
    return MC('tri',2,'tri8',f"In △ABC, m∠A = {x}°, m∠B = {y}°, m∠C = {z}°. Which side is the longest?",op[max(ang)],[v for k,v in op.items() if k!=max(ang)],["The longest side is opposite the largest angle.",f"Largest angle: {L[max(ang)]} ({max(ang)}°).",f"Opposite side: {op[max(ang)]}."],b=.3)
def tri9():
    a=ri(5,15);b=ri(3,9)
    return NUM('tri',1,'tri9',f"△ABC ≅ △XYZ. If AB = {a}, how long is XY?",a,["Congruent triangles have matching sides equal.","A matches X and B matches Y, so XY = AB."],b=-1)
def tri10():
    x=ri(2,12);a=ri(2,6);c=ri(1,9)
    return NUM('tri',2,'tri10',f"△ABC ≅ △DEF. AB = {a}x + {c} and DE = {a*x+c}. If x equals what number, given DE = {a*x+c} and AB = {a}x + {c}?",x,[""]) if False else None
def tri11():
    s=R.choice([('SSS','three pairs of sides'),('SAS','two sides and the angle BETWEEN them'),('ASA','two angles and the side BETWEEN them'),('AAS','two angles and a side NOT between them'),('HL','hypotenuse and a leg (right triangles)')])
    return MC('tri',1,'tri11',f"What does {s[0]} tell you about two triangles?",f"They are congruent if {s[1]} match",[ "They are congruent if three angles match","They are similar only","They have equal area only"] if s[0]!='SSS' else ["They are congruent if three angles match","They are congruent if two sides match","They have equal perimeters only"],[f"{s[0]}: {s[1]} are congruent.","Matching three ANGLES (AAA) does not prove congruence."],b=-.2)
def tri12():
    return MC('tri',2,'tri12',R.choice(["Which pair of facts is NOT enough to prove two triangles congruent?"]),"AAA (three pairs of angles)",["SSS","SAS","ASA"],["AAA only gives the same SHAPE, not the same size.","SSS, SAS, ASA and AAS all force the same size."],b=.1)
FAMS1=dict(bas=[bas1,bas2,bas3b,bas4,bas5,bas6,bas7b,bas8],par=[par1,par2,par3,par4,par5,par6,par7,par8],tri=[tri3,tri4,tri5,tri6,tri7,tri8,tri9,tri11,tri12])
def run(n=10):
    for t,fs in FAMS1.items():
        for f in fs:rep(f,n)
