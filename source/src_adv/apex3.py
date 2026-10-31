# -*- coding: utf-8 -*-
"""Apex 3: trigonometry."""
from adv_h import *
rad=math.radians
def r4(x):return round(x,4)
CARDS={
'tc':[
("Turns and degrees","A full turn is 360°. Half a turn is 180°, a quarter turn is 90°. The three angles of any triangle always add to 180°.",None),
("The sides of a right triangle","In a right triangle the longest side, across from the right angle, is the hypotenuse. For an angle you pick, the other two sides are the opposite and the adjacent.","a² + b² = c²"),
("Sine, cosine and tangent","SOH-CAH-TOA: sin = opposite ÷ hypotenuse, cos = adjacent ÷ hypotenuse, tan = opposite ÷ adjacent. They are ratios, so they do not depend on how big the triangle is.","sin θ = opp/hyp"),
("Finding sides and angles","To find a side, write the ratio that has it and solve. To find an angle, use the inverse button: sin⁻¹, cos⁻¹ or tan⁻¹.",None),
("Radians","One radian is the angle that cuts off an arc as long as the radius. A half-turn is π radians, so 180° = π rad.","degrees × π/180 = radians"),
("The unit circle","On a circle of radius 1, the point at angle θ is (cos θ, sin θ). So cosine is the x-coordinate and sine is the y-coordinate.",None),
("Special angles","30°, 45° and 60° have exact values: sin 30° = ½, sin 45° = √2/2, sin 60° = √3/2. Cosine reads the same list backwards.","sin 30° = 0.5"),
("Reference angles and signs","Any angle has a reference angle (the acute angle to the x-axis). Find its value, then use the quadrant to choose + or −: All Students Take Calculus (all, sine, tangent, cosine).","sin 150° = sin 30° = 0.5")],
'tg':[
("Waves in everyday life","Sound, light, tides and alternating current all repeat in smooth waves. Sine and cosine are the mathematical models for these waves.",None),
("The sine graph","y = sin x starts at 0, rises to 1 at 90°, returns to 0 at 180°, falls to −1 at 270°, and repeats every 360°.",None),
("Amplitude","The amplitude is the distance from the midline to a peak. In y = a·sin x it is |a|.","y = 3 sin x: amplitude 3"),
("Period","The period is the length of one full wave. For y = sin(bx), the period is 360°/b (or 2π/b in radians). A bigger b squeezes the wave.","y = sin 2x: period 180°"),
("Phase shift","In y = sin(x − c) the wave slides right by c. A minus sign inside means right, plus means left.",None),
("Vertical shift (midline)","In y = sin x + d the whole wave moves up by d. The midline is y = d. Maximum = d + |a| and minimum = d − |a|.","y = 2 sin x + 1: ranges from −1 to 3"),
("Cosine and tangent graphs","Cosine is sine shifted left by 90°. Tangent repeats every 180° and has vertical asymptotes where cosine is 0.",None),
("Modeling with sinusoids","To model a wave: find the midline (average of max and min), the amplitude (half the difference), and the period. Then choose sine or cosine and a shift.","y = a sin(b(x − c)) + d")],
'ti':[
("Same value, different look","An identity is an equation that is true for every allowed angle, like a rule of arithmetic that always works.",None),
("The Pythagorean identity","On the unit circle x² + y² = 1, so sin²θ + cos²θ = 1. Knowing one of them gives you the other.","sin²θ + cos²θ = 1"),
("Tangent from sine and cosine","tan θ = sin θ / cos θ. That is why tangent has an asymptote wherever cosine is 0.",None),
("Double-angle identities","sin 2θ = 2 sin θ cos θ and cos 2θ = cos²θ − sin²θ = 1 − 2 sin²θ.","sin 2θ = 2 sin θ cos θ"),
("Sum and difference identities","sin(A + B) = sin A cos B + cos A sin B and cos(A + B) = cos A cos B − sin A sin B.",None),
("Solving a trig equation","Isolate the trig function, find the reference angle, use the quadrants to list all answers in the interval, then check.",None),
("Many solutions","Because trig functions repeat, equations have many solutions. In [0°, 360°) sin x = ½ has two: 30° and 150°.",None),
("Inverse trig functions","sin⁻¹ gives one answer in a restricted range (−90° to 90°). The equation sin x = k can have a second answer you must add yourself.",None)],
'tl':[
("Triangles that are not right","Many real triangles have no right angle. The Law of Sines and Law of Cosines work for every triangle.",None),
("Law of Sines","a/sin A = b/sin B = c/sin C. Use it when you know an angle and its opposite side.","a/sin A = b/sin B"),
("Law of Cosines","c² = a² + b² − 2ab cos C. It is the Pythagorean theorem with a correction term. If C = 90° the correction vanishes.","c² = a² + b² − 2ab cos C"),
("The ambiguous case (SSA)","Given two sides and an angle not between them, there may be 0, 1 or 2 triangles. Check whether the side opposite the angle can reach the base.",None),
("Area with sine","Area = ½ab sin C. It works for any two sides and the angle between them.","Area = ½ab sin C"),
("Vectors","A vector has a size (magnitude) and a direction. Write it as components (x, y). Its magnitude is √(x² + y²).","|v| = √(x² + y²)"),
("Adding vectors","Add components: (a, b) + (c, d) = (a + c, b + d). A plane's ground velocity is its air velocity plus the wind's.",None),
("Dot product and angles","a·b = a₁b₁ + a₂b₂ = |a||b| cos θ. If the dot product is 0 the vectors are perpendicular.","a·b = |a||b| cos θ")]}


def t3():
    a,b,c=pick([(3,4,5),(5,12,13),(8,15,17),(6,8,10),(7,24,25),(9,12,15)])
    k=rint(1,2)
    return NM('tc','F',f"The two shorter sides of a right triangle are {a*k} and {b*k}. How long is the hypotenuse?",c*k,[f"c² = {a*k}² + {b*k}² = {(a*k)**2+(b*k)**2}.",f"c = {c*k}."])
def t4():
    a,b,c=pick([(3,4,5),(5,12,13),(8,15,17),(6,8,10)])
    ask=pick(['sin','cos','tan'])
    v={'sin':Fr(a,c),'cos':Fr(b,c),'tan':Fr(a,b)}[ask]
    return NM('tc','B',f"A right triangle has opposite side {a}, adjacent side {b} and hypotenuse {c} for angle A. What is {ask} A (as a decimal)?",round(float(v),4),[f"{ask} = "+{'sin':'opposite/hypotenuse','cos':'adjacent/hypotenuse','tan':'opposite/adjacent'}[ask]+".",f"= {num(v)} ≈ {float(v):.4f}."])
def t5():
    h=rint(5,40);ang=pick([30,45,60]);
    s=math.sin(rad(ang))
    return NM('tc','B',f"A ladder {h} m long makes an angle of {ang}° with the ground. How high up the wall does it reach? (Round to 2 decimals.)",round(h*s,2),[f"sin {ang}° = opposite/hypotenuse, so height = {h} sin {ang}°.",f"= {h*s:.2f} m."],u='m',free=True,tol=0.005)
def t6():
    d=pick([30,45,60,90,120,135,150,180])
    return NM('tc','B',f"Convert {d}° to radians. (Give a decimal; use π ≈ 3.14159.)",round(rad(d),3),[f"radians = degrees × π/180 = {d} × π/180.",f"= {rad(d):.3f} rad."],u='rad',free=True,tol=0.003)
def t7():
    a=pick([30,45,60,120,135,150,210,225,240,300,315,330]);f=pick(['sin','cos'])
    v=getattr(math,f)(rad(a))
    return NM('tc','C',f"Find {f} {a}° as a decimal.",round(v,4),[f"Reference angle: {min(a%180,180-a%180)}°. Use the quadrant to choose the sign.",f"{f} {a}° ≈ {v:.4f}."],tol=0.002)
def t8():
    a=pick([15,25,32,40,58,65]);h=rint(8,30)
    return NM('tc','C',f"A tree casts a shadow {h} m long when the sun is {a}° above the horizon. How tall is the tree? (2 decimals)",round(h*math.tan(rad(a)),2),[f"tan {a}° = height/shadow.",f"height = {h} tan {a}° = {h*math.tan(rad(a)):.2f} m."],u='m',free=True,tol=0.005)
def t9():
    o=rint(2,9);a=rint(2,9)
    return NM('tc','C',f"In a right triangle the opposite side is {o} and the adjacent side is {a}. Find the angle, in degrees to 1 decimal.",round(math.degrees(math.atan2(o,a)),1),[f"tan θ = {o}/{a}.",f"θ = tan⁻¹({o/a:.3f}) ≈ {math.degrees(math.atan2(o,a)):.1f}°."],u='°',free=True,tol=0.003)
def t10():
    r=rint(2,12);d=pick([30,45,60,90,120,180])
    return NM('tc','C',f"Find the arc length on a circle of radius {r} cm cut off by a central angle of {d}°. (2 decimals)",round(r*rad(d),2),[f"Convert: {d}° = {rad(d):.4f} rad.",f"s = rθ = {r} × {rad(d):.4f} = {r*rad(d):.2f} cm."],u='cm',free=True,tol=0.005)
def t11():
    p,q,h=pick([(3,4,5),(5,12,13),(8,15,17),(20,21,29)])
    quad=pick([1,2,3,4])
    sv=Fr(q,h) if quad in(1,2) else -Fr(q,h)
    cv=Fr(p,h) if quad in(1,4) else -Fr(p,h)
    nm={1:'I',2:'II',3:'III',4:'IV'}[quad]
    return NM('tc','M',f"cos θ = {num(cv)} and θ is in quadrant {nm}. Find sin θ as a decimal.",float(sv),[f"sin²θ = 1 − cos²θ = 1 − {num(cv*cv)} = {num(1-cv*cv)}.",f"|sin θ| = {num(Fr(q,h))}. In quadrant {nm} sine is {'positive' if sv>0 else 'negative'}.",f"sin θ = {num(sv)} = {float(sv):.4f}."],tol=0.002)
def t12():
    r=rint(3,12);d=pick([30,45,60,90,120,150])
    return NM('tc','M',f"Find the area of a sector with radius {r} cm and central angle {d}°. (A = ½r²θ with θ in radians; 2 decimals)",round(.5*r*r*rad(d),2),[f"θ = {rad(d):.4f} rad.",f"A = ½({r})²({rad(d):.4f}) = {.5*r*r*rad(d):.2f} cm²."],u='cm²',free=True,tol=0.005)
def t13():
    r=rint(2,10);w=rint(2,9)
    return NM('tc','M',f"A wheel of radius {r} m turns at {w} rad/s. How fast does a point on its rim move (m/s)? (v = rω)",r*w,["Linear speed = radius × angular speed.",f"{r} × {w} = {r*w} m/s."],u='m/s',free=True)
def g1():
    a=rint(2,9);d=rint(-4,5)
    return NM('tg','B',f"What is the amplitude of y = {a}·sin x {sgn(d)}?",a,["The amplitude is the size of the number multiplying sin x.",f"Amplitude = {a}."])
def g2():
    b=pick([2,3,4,5,6,8,9,10,12])
    return NM('tg','B',f"What is the period, in degrees, of y = sin({b}x)?",360/b,[f"Period = 360°/b = 360/{b}.",f"= {360/b:g}°."],u='°',free=True)
def g3():
    a=rint(1,5);d=rint(-3,4)
    return NM('tg','C',f"What is the maximum value of y = {a}·sin x {sgn(d)}?",a+d,[f"The maximum is midline + amplitude = {d} + {a}.",f"= {a+d}."])
def g4():
    a=rint(1,5);d=rint(-3,4)
    return NM('tg','C',f"What is the minimum value of y = {a}·cos x {sgn(d)}?",d-a,[f"Minimum = midline − amplitude = {d} − {a}.",f"= {d-a}."])
def g5():
    b=pick([2,3,4,6,12]);p=360//b
    return NM('tg','C',f"A sine wave repeats every {p}°. In y = sin(bx), what is b?",b,[f"Period = 360°/b, so b = 360/{p}.",f"b = {b}."])
def g6():
    c=rint(1,8)*10
    return NM('tg','C',f"The graph of y = sin(x − {c}°) is the graph of y = sin x shifted how many degrees to the right?",c,["A minus sign inside the parentheses shifts the graph right.",f"{c}° to the right."],u='°',free=True)
def g7():
    a=rint(1,4);d=rint(-2,3)
    pts=[(x,a*math.sin(rad(x))+d) for x in range(0,361,15)]
    return GR('tg','C',f"The graph shows y = {a}·sin x {sgn(d)} for 0° ≤ x ≤ 360°. Tap the maximum point.",'x (°)','y',(0,360),(d-a-1,d+a+1),[('y',pts)],(90,a+d),["The sine curve peaks at x = 90°.",f"There y = {a} + {d} = {a+d}."],f"Sine wave with amplitude {a} and midline {d}",tx=18,ty=max(.25,a*.15))
def g8():
    hi=rint(3,12);lo=rint(-6,hi-2)
    return NM('tg','M',f"Tides: the water depth swings between a low of {lo} m and a high of {hi} m. For a model y = a·cos(bx) + d, what is d (the midline)?",(hi+lo)/2,["The midline is the average of the maximum and minimum.",f"({hi} + {lo})/2 = {(hi+lo)/2:g}."],free=True)
def g9():
    hi=rint(3,12);lo=rint(-6,hi-2)
    return NM('tg','M',f"A sinusoid has a maximum of {hi} and a minimum of {lo}. What is its amplitude?",(hi-lo)/2,["Amplitude = (max − min)/2.",f"({hi} − {lo})/2 = {(hi-lo)/2:g}."],free=True)
def g10():
    T=rint(2,12);b=360/T
    return NM('tg','M',f"A Ferris wheel completes one rotation every {T} minutes. If its height follows y = a·sin(bt) + d with t in minutes and angles in degrees, what is b?",b,[f"Period = 360°/b = {T} min.",f"b = 360/{T} = {b:g} degrees per minute."],free=True,tol=0.01)
def i1():
    s=pick([Fr(3,5),Fr(5,13),Fr(8,17),Fr(7,25)])
    return NM('ti','B',f"If sin θ = {num(s)}, what is sin²θ as a decimal?",float(s*s),[f"Square the value: ({num(s)})².",f"= {num(s*s)} ≈ {float(s*s):.4f}."],tol=0.002)
def i2():
    s=pick([Fr(3,5),Fr(5,13),Fr(8,17),Fr(7,25),Fr(20,29)])
    return NM('ti','C',f"If sin θ = {num(s)}, find cos²θ as a decimal.",float(1-s*s),["sin²θ + cos²θ = 1.",f"cos²θ = 1 − {num(s*s)} = {num(1-s*s)}."],tol=0.002)
def i3():
    s,c=pick([(Fr(3,5),Fr(4,5)),(Fr(5,13),Fr(12,13)),(Fr(8,17),Fr(15,17))])
    return NM('ti','C',f"sin θ = {num(s)} and cos θ = {num(c)}. Find sin 2θ using 2 sin θ cos θ.",float(2*s*c),[f"2 × {num(s)} × {num(c)} = {num(2*s*c)}.",f"≈ {float(2*s*c):.4f}."],tol=0.002)
def i4():
    s,c=pick([(Fr(3,5),Fr(4,5)),(Fr(5,13),Fr(12,13)),(Fr(8,17),Fr(15,17))])
    return NM('ti','C',f"sin θ = {num(s)}. Find cos 2θ using 1 − 2 sin²θ.",float(1-2*s*s),[f"1 − 2({num(s*s)}) = {num(1-2*s*s)}.",f"≈ {float(1-2*s*s):.4f}."],tol=0.002)
def i5():
    k=pick([0.5,0.866,0.7071,0.25])
    ans=round(math.degrees(math.asin(k)),1)
    return NM('ti','C',f"Solve sin x = {k} for 0° ≤ x ≤ 90°. Give the angle in degrees (1 decimal).",ans,[f"x = sin⁻¹({k}).",f"x ≈ {ans}°."],u='°',free=True,tol=0.004)
def i6():
    a=pick([30,45,60])
    return NM('ti','C',f"Solve sin x = {round(math.sin(rad(a)),4)} for 0° ≤ x < 360°. What is the LARGER solution? (degrees)",180-a,[f"The reference angle is {a}°.",f"Sine is positive in quadrants I and II: x = {a}° or {180-a}°.",f"The larger is {180-a}°."],u='°',free=True,tol=0.003)
def i7():
    a=pick([30,45,60])
    return NM('ti','M',f"Solve cos x = {round(math.cos(rad(a)),4)} for 0° ≤ x < 360°. What is the LARGER solution? (degrees)",360-a,[f"Reference angle {a}°. Cosine is positive in quadrants I and IV.",f"x = {a}° or {360-a}°.",f"The larger is {360-a}°."],u='°',free=True,tol=0.003)
def i8():
    return NM('ti','M',"How many solutions does sin 2x = 0.5 have for 0° ≤ x < 360°?",4,["2x runs from 0° to 720°, which is two full turns.","Each turn has two solutions for sin = 0.5, so there are 2 × 2 = 4 solutions for 2x, hence 4 for x."])
def i9():
    A=pick([(45,30),(60,45),(30,45)])
    a,b=A
    return NM('ti','M',f"Use sin(A + B) = sin A cos B + cos A sin B with A = {a}° and B = {b}° to find sin {a+b}°. (4 decimals)",round(math.sin(rad(a+b)),4),[f"sin {a}° cos {b}° + cos {a}° sin {b}°.",f"= {math.sin(rad(a))*math.cos(rad(b)):.4f} + {math.cos(rad(a))*math.sin(rad(b)):.4f} = {math.sin(rad(a+b)):.4f}."],tol=0.003)
def i10():
    k=rint(1,2)
    return NM('ti','M',"How many solutions does tan x = 1 have for 0° ≤ x < 360°?",2,["tan x = 1 at the reference angle 45°.","Tangent is positive in quadrants I and III: x = 45° and 225°."])
def l1():
    A=rint(30,70);B=rint(35,75);a=rint(5,20)
    if A+B>=170:return False
    b=a*math.sin(rad(B))/math.sin(rad(A))
    return NM('tl','C',f"In a triangle, angle A = {A}°, angle B = {B}° and side a = {a}. Find side b. (2 decimals)",round(b,2),[f"Law of Sines: b/sin B = a/sin A.",f"b = {a}·sin {B}° / sin {A}° = {b:.2f}."],tol=0.004)
def l2():
    a=rint(4,15);b=rint(4,15);C=pick([60,90,120])
    c=math.sqrt(a*a+b*b-2*a*b*math.cos(rad(C)))
    return NM('tl','C',f"Two sides of a triangle are {a} and {b}, with an included angle of {C}°. Find the third side. (2 decimals)",round(c,2),[f"Law of Cosines: c² = {a}² + {b}² − 2({a})({b})cos {C}°.",f"c² = {a*a+b*b-2*a*b*math.cos(rad(C)):.2f}, so c = {c:.2f}."],tol=0.004)
def l3():
    a=rint(4,16);b=rint(4,16);C=pick([30,45,60,90,120,150])
    return NM('tl','C',f"Find the area of a triangle with sides {a} and {b} and an included angle of {C}°. (2 decimals)",round(.5*a*b*math.sin(rad(C)),2),[f"Area = ½ab sin C = ½({a})({b}) sin {C}°.",f"= {.5*a*b*math.sin(rad(C)):.2f}."],tol=0.004)
def l4():
    x=rint(-8,8,True);y=rint(-8,8,True)
    return NM('tl','C',f"Find the magnitude of the vector ({x}, {y}). (2 decimals)",round(math.hypot(x,y),2),[f"|v| = √({x}² + {y}²) = √{x*x+y*y}.",f"≈ {math.hypot(x,y):.2f}."],tol=0.004)
def l5():
    m=rint(5,40);a=pick([30,45,60])
    return NM('tl','C',f"A force of {m} N acts at {a}° above the horizontal. What is its horizontal component? (2 decimals)",round(m*math.cos(rad(a)),2),[f"Horizontal component = F cos θ = {m} cos {a}°.",f"= {m*math.cos(rad(a)):.2f} N."],u='N',free=True,tol=0.004)
def l6():
    ax=rint(-6,6);ay=rint(-6,6);bx=rint(-6,6);by=rint(-6,6)
    return NM('tl','C',f"Find the dot product of ({ax}, {ay}) and ({bx}, {by}).",ax*bx+ay*by,[f"a·b = a₁b₁ + a₂b₂ = ({ax})({bx}) + ({ay})({by}).",f"= {ax*bx+ay*by}."])
def l7():
    p=rint(1,5);q=rint(1,5)
    return NM('tl','M',f"For what value of k are the vectors ({p}, {q}) and (k, {-p}) perpendicular?",q,[f"Perpendicular means the dot product is 0: {p}k + {q}({-p}) = 0.",f"{p}k = {p*q}, so k = {q}."])
def l8():
    return NM('tl','M',"Two sides of a triangle are 10 and 14 and the angle opposite the side of length 10 is 30°. How many different triangles are possible?",2,["The height from the other vertex is h = 14 sin 30° = 7.","10 is longer than 7 but shorter than 14, so two triangles fit (the ambiguous case)."])
def l9():
    s=rint(10,40);w=rint(5,15)
    return NM('tl','M',f"A plane flies east at {s} units while a wind pushes it north at {w}. What is its ground speed? (2 decimals)",round(math.hypot(s,w),2),[f"Add the components (east, north) = ({s}, {w}).",f"Ground speed = √({s}² + {w}²) = {math.hypot(s,w):.2f}."],tol=0.004,free=True)
def c1():
    b=pick([0,45,90,135,180,225,270,315])
    return CP('tl','F',f"Drag the pointer to the compass bearing {b}° (0° is north, 90° east, 180° south, 270° west).",b,["Bearings start at north and turn clockwise.",f"{b}° is {'north' if b==0 else 'east' if b==90 else 'south' if b==180 else 'west' if b==270 else 'between the main directions'}."],tol=10)
def c2():
    d=pick([30,60,120,150,210,240,300,330])
    return CP('tl','B',f"A wind blows FROM a bearing of {d}°. Drag the pointer to the bearing it blows TOWARD.",(d+180)%360,["The direction toward is opposite the direction from.","Add or subtract 180°."],tol=10)
def c3():
    d=pick([20,40,70,110,160,200,250,290,340]);t=rint(1,3)*30
    return CP('tl','C',f"A boat heads on a bearing of {d}° and then turns {t}° to the right. Drag the pointer to its new bearing.",(d+t)%360,["A right turn adds to the bearing.",f"{d}° + {t}° = {(d+t)%360}°."],tol=10)
FAMS=[t3,t4,t5,t6,t7,t8,t9,t10,t11,t12,t13,g1,g2,g3,g4,g5,g6,g7,g8,g9,g10,i1,i2,i3,i4,i5,i6,i7,i8,i9,i10,l1,l2,l3,l4,l5,l6,l7,l8,l9,c1,c2,c3]
def run(n=14):
    for f in FAMS:gen.rep(f,n)
