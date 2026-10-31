# -*- coding: utf-8 -*-
"""Apex 4: conics, polar and parametric, limits, derivatives, applications, integrals."""
from adv_h import *
CARDS={
'cn':[
("Distance and midpoint","The distance between two points is a Pythagorean theorem in disguise: √((x₂ − x₁)² + (y₂ − y₁)²). The midpoint averages the coordinates.",None),
("Circles","A circle is every point the same distance r from a center (h, k): (x − h)² + (y − k)² = r².","(x − 2)² + (y + 1)² = 9"),
("Parabolas","A parabola is every point equally far from a point (the focus) and a line (the directrix). y = ax² has its focus at (0, 1/(4a)).",None),
("Ellipses","An ellipse is a stretched circle: x²/a² + y²/b² = 1. The two foci are c units from the center where c² = a² − b² (a is the longer half-axis).","x²/25 + y²/9 = 1: c = 4"),
("Hyperbolas","A hyperbola has two branches: x²/a² − y²/b² = 1. The foci satisfy c² = a² + b² and the asymptotes are y = ±(b/a)x.",None),
("Eccentricity","e = c/a measures how stretched a conic is. Circle e = 0, ellipse 0 < e < 1, parabola e = 1, hyperbola e > 1.","e = c/a"),
("Identifying a conic","Look at the squared terms. Same sign and same coefficient: circle. Same sign, different coefficients: ellipse. Opposite signs: hyperbola. Only one squared variable: parabola.",None),
("Real-world conics","Planets move in ellipses, satellite dishes are parabolas, and whispering galleries use ellipses to carry sound between the foci.",None)],
'pp':[
("Two ways to name a point","Rectangular coordinates give (x, y). Polar coordinates give (r, θ): how far from the origin and at what angle.",None),
("Converting polar to rectangular","x = r cos θ and y = r sin θ.","(2, 60°) → (1, √3)"),
("Converting rectangular to polar","r = √(x² + y²) and tan θ = y/x (check the quadrant).",None),
("Polar curves","r = 2 is a circle. r = θ spirals outward. Roses, cardioids and limaçons come from r = a cos(nθ) and similar rules.",None),
("Parametric equations","Write x and y as functions of a third variable t, like time. They describe motion along a path.","x = t + 1, y = 2t"),
("Eliminating the parameter","Solve one equation for t and substitute into the other to get a relation between x and y.",None),
("The complex plane","Plot a + bi at (a, b). Its modulus is √(a² + b²) and its argument is the angle from the real axis.",None),
("De Moivre's theorem","In polar form, multiplying complex numbers multiplies the moduli and adds the angles. So (r cis θ)ⁿ = rⁿ cis(nθ).","(cis 30°)³ = cis 90° = i")],
'lm':[
("Getting closer and closer","Look at 0.9, 0.99, 0.999, … The numbers never reach 1 but get as close as you like. We say they approach 1.",None),
("What a limit means","lim f(x) = L as x → a means f(x) gets as close to L as you want when x is close enough to a. The value at a itself does not matter.","lim x→2 of (x + 1) = 3"),
("Direct substitution","For polynomials and most everyday functions, just plug the number in.",None),
("0/0: factor and cancel","If substitution gives 0/0, factor and cancel the common piece, then substitute.","(x² − 9)/(x − 3) = x + 3 → 6"),
("One-sided limits","The left limit looks from below, the right limit from above. The limit exists only if both agree.",None),
("Limits at infinity","As x grows huge, only the highest powers matter. Compare the leading terms.","(3x² + 1)/(x² − 5) → 3"),
("Continuity","A function is continuous at a if the limit equals the value: no jumps, holes or breaks. You can draw it without lifting your pencil.",None),
("Famous limits","lim sin x / x = 1 when x is in radians. This is the key to the derivative of sine.",None)],
'dv':[
("Rate of change","Speed is how fast distance changes. The derivative is a rate of change at one instant, like a speedometer reading.",None),
("Slope of a curve","The derivative f′(x) is the slope of the tangent line at x. It is the limit of the slope between two points as they come together.","f′(x) = lim [f(x + h) − f(x)] / h"),
("Power rule","d/dx of xⁿ = n·xⁿ⁻¹. Constants disappear and constants multiplying stay.","d/dx 3x⁴ = 12x³"),
("Sums and differences","Take the derivative of each term separately.","d/dx (x³ + 5x) = 3x² + 5"),
("Product rule","(uv)′ = u′v + uv′. The derivative of a product is not the product of derivatives.",None),
("Quotient rule","(u/v)′ = (u′v − uv′)/v².",None),
("Chain rule","For a function inside a function, take the derivative of the outside, then multiply by the derivative of the inside.","d/dx (2x + 1)⁵ = 5(2x + 1)⁴ · 2"),
("Trig, exponential and log derivatives","(sin x)′ = cos x, (cos x)′ = −sin x, (eˣ)′ = eˣ, (ln x)′ = 1/x.",None)],
'da':[
("Position, velocity, acceleration","If s(t) is position, velocity is s′(t) and acceleration is s″(t).",None),
("Increasing and decreasing","If f′ > 0 the function rises. If f′ < 0 it falls. Where f′ = 0 there may be a peak or valley.",None),
("Critical points","Solve f′(x) = 0 to find candidates for maximum and minimum points.",None),
("The second derivative test","At a critical point, f″ > 0 means a valley (minimum) and f″ < 0 means a peak (maximum).",None),
("Concavity","f″ > 0: the curve bends upward like a cup. f″ < 0: it bends downward like a cap.",None),
("Optimization","Write what you want to maximize or minimize as a function of one variable, take the derivative, set it to 0 and check the endpoints.",None),
("Related rates","When two quantities are linked, their rates are linked too. Differentiate the relationship with respect to time.",None),
("Linear approximation","Near x = a, f(x) ≈ f(a) + f′(a)(x − a). The tangent line is a good estimate close by.","√4.1 ≈ 2 + 0.25(0.1)")],
'in':[
("Area by counting","Area is how much space is inside a shape. We can estimate the area under a curve by adding up thin rectangles.",None),
("Riemann sums","Split the interval into slices, make a rectangle for each, and add the areas. More slices give a better estimate.",None),
("The definite integral","∫ from a to b of f(x) dx is the exact signed area between the graph and the x-axis. Area below the axis counts as negative.",None),
("Antiderivatives","An antiderivative of f is a function whose derivative is f. For powers: ∫xⁿ dx = xⁿ⁺¹/(n + 1) + C.","∫x² dx = x³/3 + C"),
("Fundamental Theorem of Calculus","∫ from a to b of f(x) dx = F(b) − F(a) where F is any antiderivative of f. Derivatives and integrals undo each other.","∫₀² x² dx = 8/3"),
("Average value and total change","Average value = (1/(b − a)) ∫ f. Integrating a rate gives total change, like integrating speed to get distance.",None),
("Substitution","For ∫f(g(x))g′(x) dx, let u = g(x). The messy part becomes a simple integral in u.",None),
("Area between curves","Subtract the lower curve from the upper curve and integrate across the interval.",None)]}
def c1():
    x1,y1=rint(-5,5),rint(-5,5);dx=rint(1,5);dy=rint(1,5)
    return NM('cn','F',f"Find the midpoint x-coordinate of ({x1}, {y1}) and ({x1+2*dx}, {y1+2*dy}).",x1+dx,["Average the x-values.",f"({x1} + {x1+2*dx})/2 = {x1+dx}."])
def c2():
    a,b,c=pick([(3,4,5),(5,12,13),(8,15,17),(6,8,10)])
    return NM('cn','B',f"Find the distance between (0, 0) and ({a}, {b}).",c,[f"d = √({a}² + {b}²) = √{a*a+b*b}.",f"= {c}."])
def c3():
    h=rint(-6,6);k=rint(-6,6);r=rint(2,9)
    return NM('cn','B',f"What is the radius of the circle (x {sgn(-h)})² + (y {sgn(-k)})² = {r*r}?",r,["The right-hand side is r².",f"r = √{r*r} = {r}."])
def c4():
    h=rint(-6,6);k=rint(-6,6);r=rint(2,6)
    return NM('cn','C',f"A circle has equation (x {sgn(-h)})² + (y {sgn(-k)})² = {r*r}. What is the x-coordinate of its center?",h,["The center is (h, k) in (x − h)² + (y − k)².",f"x-coordinate = {h}."])
def c5():
    a,b,c=pick([(5,3,4),(13,5,12),(10,6,8),(17,8,15),(5,4,3)])
    return NM('cn','C',f"The ellipse x²/{a*a} + y²/{b*b} = 1 has foci at (±c, 0). Find c.",c,[f"c² = a² − b² = {a*a} − {b*b} = {c*c}.",f"c = {c}."])
def c6():
    a=pick([1,2,4]);
    return NM('cn','C',f"The parabola y = x²/{4*a} has its focus at (0, p). Find p.",a,[f"y = x²/(4p) matches y = x²/{4*a}.",f"p = {a}."])
def c7():
    a=rint(2,9);b=rint(2,9)
    return NM('cn','C',f"The hyperbola x²/{a*a} − y²/{b*b} = 1 has asymptotes y = ±mx. Find m.",Fr(b,a),["The asymptotes are y = ±(b/a)x.",f"m = {b}/{a} = {num(Fr(b,a))}."],tol=0.006)
def c8():
    a,b,c=pick([(5,3,4),(13,5,12),(10,6,8),(5,4,3)])
    return NM('cn','M',f"Find the eccentricity e = c/a of the ellipse x²/{a*a} + y²/{b*b} = 1 (3 decimals).",round(c/a,3),[f"c² = {a*a} − {b*b} = {c*c}, so c = {c}.",f"e = c/a = {c}/{a} = {c/a:.3f}."],tol=0.004)
def c9():
    a,b,c=pick([(3,4,5),(5,12,13),(8,15,17),(6,8,10)])
    return NM('cn','M',f"A point on the ellipse x²/{max(a,b)**2} + y²/{min(a,b)**2} = 1 has distances d₁ and d₂ to the two foci. What is d₁ + d₂?",2*max(a,b),["For any point on an ellipse the sum of the focal distances is 2a (the major axis length).",f"a = {max(a,b)}, so the sum is {2*max(a,b)}."])
def c10():
    a=rint(2,6);b=rint(2,6)
    return SA('cn','C',f"Is x²/{a*a} + y²/{b*b} = 1 a circle, ellipse, parabola or hyperbola?",['circle' if a==b else 'ellipse'],["Both squared terms are positive.","If the denominators are equal it is a circle; otherwise it is an ellipse."])
def c11():
    a=rint(2,6);b=rint(2,6)
    return SA('cn','C',f"Is x²/{a*a} − y²/{b*b} = 1 a circle, ellipse, parabola or hyperbola?",['hyperbola'],["The squared terms have opposite signs.","That is a hyperbola."])
def p1():
    r=rint(1,9);t=pick([0,90,180,270])
    x=int(round(r*math.cos(math.radians(t))));y=int(round(r*math.sin(math.radians(t))))
    return NM('pp','B',f"Convert the polar point ({r}, {t}°) to rectangular coordinates. What is x?",x,[f"x = r cos θ = {r} cos {t}°.",f"= {x}."]) if x!=0 else NM('pp','B',f"Convert the polar point ({r}, {t}°) to rectangular coordinates. What is y?",y,[f"y = r sin θ = {r} sin {t}°.",f"= {y}."])
def p2():
    a,b,c=pick([(3,4,5),(5,12,13),(8,15,17),(6,8,10)])
    return NM('pp','C',f"Find r for the rectangular point ({a}, {b}) in polar form.",c,[f"r = √({a}² + {b}²) = √{a*a+b*b}.",f"r = {c}."])
def p3():
    r=rint(2,10);t=pick([30,45,60])
    return NM('pp','C',f"Convert the polar point ({r}, {t}°) to rectangular form. What is y? (2 decimals)",round(r*math.sin(math.radians(t)),2),[f"y = r sin θ = {r} sin {t}°.",f"= {r*math.sin(math.radians(t)):.2f}."],tol=0.004)
def p4():
    a=rint(1,5);b=rint(1,5);c=rint(1,5);t=rint(1,5)
    return NM('pp','C',f"x = t + {a} and y = {b}t + {c}. Find y when x = {a+t}.",b*t+c,[f"x = t + {a} = {a+t}, so t = {t}.",f"y = {b}({t}) + {c} = {b*t+c}."])
def p5():
    m=rint(2,5);a=rint(1,4);t=rint(1,4)
    return NM('pp','C',f"A particle moves with x = {m}t and y = t² . What is y when x = {m*t}?",t*t,[f"t = x/{m} = {t}.",f"y = {t}² = {t*t}."])
def p6():
    a=rint(1,6);b=rint(1,6)
    return NM('pp','C',f"Find the modulus |{a} + {b}i|. (2 decimals)",round(math.hypot(a,b),2),[f"|z| = √({a}² + {b}²) = √{a*a+b*b}.",f"≈ {math.hypot(a,b):.2f}."],tol=0.004)
def p7():
    n=rint(2,6);t=pick([15,20,30,45,60])
    return NM('pp','M',f"By De Moivre's theorem, (cos {t}° + i sin {t}°){sup(n)} = cos φ + i sin φ. Find φ in degrees.",n*t,["Multiply the angle by the exponent.",f"φ = {n} × {t}° = {n*t}°."],u='°',free=True)
def p8():
    r=rint(2,4);n=rint(2,5)
    return NM('pp','M',f"A complex number has modulus {r}. What is the modulus of its {n}th power?",r**n,["Moduli multiply, so |zⁿ| = |z|ⁿ.",f"{r}^{n} = {r**n}."])
def m1():
    k=rint(1,9)
    return NM('lm','F',f"The numbers {k}.9, {k}.99, {k}.999, … get closer to what number?",k+1,["Each number is a little smaller than the next whole number.","They approach "+str(k+1)+"."])
def m2():
    a=rint(-5,5);b=rint(1,4);c=rint(-5,5)
    return NM('lm','B',f"Find the limit as x → {a} of {b}x {sgn(c)}.",b*a+c,["For a polynomial just substitute.",f"{b}({a}) {sgn(c)} = {b*a+c}."])
def m3():
    a=rint(-6,6);b=rint(1,4)
    return NM('lm','C',f"Find lim as x → {a} of (x² − {a*a})/(x {sgn(-a)}).",2*a,[f"Factor: (x − {a})(x + {a})/(x − {a}) = x + {a}.",f"Substitute x = {a}: {2*a}."]) if a!=0 else False
def m4():
    p=rint(1,5);q=rint(1,5);r=rint(1,6)
    return NM('lm','C',f"Find lim as x → ∞ of ({p*3}x² + {r}x)/({q}x² + 7).",Fr(p*3,q),["Compare the leading coefficients of the x² terms.",f"{p*3}/{q} = {num(Fr(p*3,q))}."],tol=0.006)
def m5():
    a=rint(1,6);b=rint(1,6)
    return NM('lm','C',f"Find lim as x → {a} of (x² − {(a+b)}x + {a*b})/(x − {a}).",a-b,[f"Factor: (x − {a})(x − {b})/(x − {a}) = x − {b}.",f"At x = {a}: {a-b}."])
def m6():
    c=rint(1,4)**2;r=int(math.isqrt(c))
    return NM('lm','M',f"Find lim as x → 0 of (√(x + {c}) − {r})/x. (Multiply by the conjugate; 4 decimals.)",round(1/(2*r),4),[f"Multiply top and bottom by (√(x + {c}) + {r}). The top becomes x.",f"The limit is 1/(√{c} + {r}) = 1/{2*r} = {1/(2*r):.4f}."],tol=0.004)
def m7():
    a=rint(2,6)
    return NM('lm','M',f"Find lim as x → 0 of sin({a}x)/x using sin u / u → 1 (u = {a}x).",a,[f"Multiply and divide by {a}: {a}·sin({a}x)/({a}x).",f"The limit is {a}·1 = {a}."])
def m8():
    a=rint(1,5);b=rint(1,5)
    return SA('lm','C',f"A function has left limit {a} and right limit {b} at x = 2. Does the limit exist? Answer yes or no.",['yes' if a==b else 'no'],["The limit exists only if both one-sided limits agree.",'They are equal.' if a==b else 'They differ, so the limit does not exist.']) if a!=b else False
def d1():
    s=rint(2,9);t=rint(2,9)
    return NM('dv','F',f"A car's distance is d = {s}t meters after t seconds. How fast is it going (m/s)?",s,["The distance grows by the same amount each second.",f"Speed = {s} m/s."],u='m/s',free=True)
def d2():
    a=rint(2,9);n=rint(2,5)
    return NM('dv','B',f"Find f′(1) for f(x) = {a}x{sup(n)}.",a*n,[f"f′(x) = {a}·{n}x{sup(n-1) if n>2 else ''}.",f"At x = 1: {a*n}."])
def d3():
    a=rint(1,5);b=rint(-6,6);c=rint(-6,6);x=rint(-3,4)
    return NM('dv','B',f"Find f′({x}) for f(x) = {poly([a,b,c])}.",2*a*x+b,[f"f′(x) = {2*a}x {sgn(b)}.",f"f′({x}) = {2*a*x+b}."])
def d4():
    a=rint(1,4);b=rint(-5,5);c=rint(-5,5);d=rint(-5,5);x=rint(-2,3)
    return NM('dv','C',f"Find the slope of the tangent line to y = {poly([a,b,c,d])} at x = {x}.",3*a*x*x+2*b*x+c,[f"y′ = {3*a}x² {sgn(2*b)}x {sgn(c)}.",f"At x = {x}: {3*a*x*x+2*b*x+c}."])
def d5():
    a=rint(2,5);b=rint(1,5);n=rint(2,4);x=rint(0,3)
    return NM('dv','C',f"Use the chain rule to find f′({x}) for f(x) = ({a}x {sgn(b)}){sup(n)}.",n*a*(a*x+b)**(n-1),[f"f′(x) = {n}({a}x {sgn(b)}){sup(n-1) if n>2 else ''}·{a}.",f"= {n*a*(a*x+b)**(n-1)}."])
def d6():
    a=rint(1,4);b=rint(1,4);x=rint(1,4)
    u=a*x+1;v=x*x+b
    return NM('dv','C',f"Use the product rule to find the derivative at x = {x} of f(x) = ({a}x + 1)(x² + {b}).",a*v+u*2*x,[f"f′ = {a}(x² + {b}) + ({a}x + 1)(2x).",f"At x = {x}: {a*v} + {u*2*x} = {a*v+u*2*x}."])
def d7():
    k=rint(2,9)
    return NM('dv','C',f"If f(x) = sin({k}x) with x in radians, what is f′(0)?",k,[f"f′(x) = {k}cos({k}x).",f"cos 0 = 1, so f′(0) = {k}."])
def d8():
    a=rint(2,6);x=rint(1,5)
    return NM('dv','C',f"Find f′({x}) for f(x) = {a} ln x. (3 decimals)",round(a/x,3),[f"f′(x) = {a}/x.",f"= {a/x:.3f}."],tol=0.004)
def d9():
    a=rint(1,3);b=rint(1,4);x=rint(1,3)
    num_=2*x;den=x+b
    return NM('dv','M',f"Use the quotient rule: find f′({x}) for f(x) = x²/(x + {b}).",round((2*x*(x+b)-x*x)/(x+b)**2,4),[f"f′ = [2x(x + {b}) − x²·1]/(x + {b})².",f"= ({2*x*(x+b)} − {x*x})/{(x+b)**2} = {(2*x*(x+b)-x*x)/(x+b)**2:.4f}."],tol=0.004)
def d10():
    a=rint(1,4);b=rint(2,6);x=rint(1,3)
    return NM('dv','M',f"Find f″({x}) for f(x) = {a}x{sup(b)}.",a*b*(b-1)*x**(b-2),[f"f′ = {a*b}x{sup(b-1) if b>2 else ''}; f″ = {a*b*(b-1)}x{sup(b-2) if b>3 else ''}.",f"f″({x}) = {a*b*(b-1)*x**(b-2)}."])
def d11():
    x0=rint(1,4);a=rint(1,4)
    return NM('dv','M',f"For f(x) = x² the slope at x = {x0} is {2*x0}. For what x is the slope of f(x) = {a}x² equal to {2*a*x0}?",x0,[f"f′(x) = {2*a}x = {2*a*x0}.",f"x = {x0}."])
def d12():
    a=rint(1,3);b=rint(1,6);x0=rint(1,3)
    y0=a*x0*x0+b
    return NM('dv','M',f"Find the y-intercept of the tangent line to y = {a}x² {sgn(b)} at x = {x0}.",y0-2*a*x0*x0,[f"Slope = {2*a*x0}, point ({x0}, {y0}).",f"y − {y0} = {2*a*x0}(x − {x0}), so at x = 0: y = {y0} − {2*a*x0*x0} = {y0-2*a*x0*x0}."])
def a1():
    a=rint(1,4);b=rint(1,6);t=rint(1,5)
    return NM('da','C',f"A particle's position is s(t) = {a}t² + {b}t. What is its velocity at t = {t}?",2*a*t+b,[f"v = s′(t) = {2*a}t + {b}.",f"v({t}) = {2*a*t+b}."])
def a2():
    a=rint(1,5);b=rint(-3,3)*a*2
    xv=Fr(-b,2*a)
    return NM('da','C',f"At what x does f(x) = {poly([a,b,rint(-5,5)])} have its vertex? (f′(x) = 0)",xv,[f"f′(x) = {2*a}x {sgn(b)} = 0.",f"x = {num(xv)}."])
def a3():
    P=rint(5,40)*4
    return NM('da','C',f"A farmer has {P} m of fence for a rectangular pen. What is the largest area the pen can have (in m²)?",(P//4)**2,["For a fixed perimeter the area is largest for a square.",f"Each side is {P//4}, so area = {(P//4)**2}."],u='m²',free=True)
def a4():
    a=rint(1,3);b=rint(-3,3)*3*a*0+rint(1,5)
    return NM('da','M',f"Find the x-coordinate of the local minimum of f(x) = x³ − {3*a*a}x for x > 0.",a,[f"f′(x) = 3x² − {3*a*a} = 0, so x = ±{a}.",f"f″ = 6x; f″({a}) = {6*a} > 0, so x = {a} is a minimum."])
def a5():
    v0=rint(10,40)
    return NM('da','M',f"A ball is thrown upward: h(t) = {v0}t − 5t². At what time t does it reach its maximum height?",v0/10,[f"h′(t) = {v0} − 10t = 0.",f"t = {v0/10:g} s."],u='s',free=True)
def a6():
    v0=rint(10,40)
    return NM('da','M',f"A ball is thrown upward: h(t) = {v0}t − 5t². What is the maximum height?",v0*v0/20,[f"The peak is at t = {v0/10:g} s.",f"h = {v0}({v0/10:g}) − 5({v0/10:g})² = {v0*v0/20:g} m."],u='m',free=True)
def a7():
    a=rint(2,6);b=rint(1,5);x=rint(1,4)
    return NM('da','M',f"Use f(x) ≈ f(a) + f′(a)(x − a) to estimate √{(a*a)+1} near √{a*a} (f(x) = √x, a = {a*a}). Give 3 decimals.",round(a+1/(2*a),3),[f"f′(x) = 1/(2√x), so f′({a*a}) = 1/{2*a}.",f"√{a*a+1} ≈ {a} + 1/{2*a} = {a+1/(2*a):.3f}."],tol=0.003)
def i1():
    w=rint(2,9);h=rint(2,9)
    return NM('in','F',f"A rectangle is {w} units wide and {h} units tall. What is its area?",w*h,[f"Area = width × height = {w} × {h}.",f"= {w*h}."])
def i2():
    a=rint(1,6);n=rint(2,4)
    return NM('in','B',f"Find the antiderivative of {a*n}x{sup(n-1) if n>2 else ''} evaluated at x = 1 (take the antiderivative with C = 0).",a,[f"∫{a*n}x{sup(n-1) if n>2 else ''} dx = {a}x{sup(n)}.",f"At x = 1: {a}."])
def i3():
    a=rint(1,6);b=rint(1,4)
    return NM('in','C',f"Evaluate the definite integral of {a*2}x from x = 0 to x = {b}.",a*b*b,[f"Antiderivative: {a}x².",f"{a}({b})² − 0 = {a*b*b}."])
def i4():
    a=rint(1,4);b=rint(1,4);c=rint(1,3);u=rint(1,3)
    return NM('in','C',f"Evaluate ∫ from 0 to {u} of ({a}x² + {b}) dx. (3 decimals)",round(a*u**3/3+b*u,3),[f"Antiderivative: {a}x³/3 + {b}x.",f"At {u}: {a*u**3/3:.3f} + {b*u} = {a*u**3/3+b*u:.3f}."],tol=0.004)
def i5():
    k=rint(2,6);a=rint(1,3);b=a+rint(1,3)
    return NM('in','C',f"Find the area under y = {k} from x = {a} to x = {b}.",k*(b-a),[f"The region is a rectangle {b-a} wide and {k} tall.",f"Area = {k*(b-a)}."])
def i6():
    v=rint(2,8);t=rint(2,8)
    return NM('in','C',f"A car's speed is {v}t m/s. How far does it go from t = 0 to t = {t}? (∫ speed dt)",v*t*t/2,[f"∫{v}t dt = {v}t²/2.",f"At t = {t}: {v*t*t/2:g} m."],u='m',free=True)
def i7():
    a=rint(1,3);b=a+rint(1,3)
    return NM('in','M',f"Find the average value of f(x) = 2x on [{a}, {b}].",a+b,[f"Average = (1/({b}−{a}))∫2x dx = ({b}² − {a}²)/({b}−{a}).",f"= {a+b}."])
def i8():
    n=rint(2,4)
    return NM('in','M',f"Use u = x² + 1 to evaluate ∫ from 0 to {n} of 2x(x² + 1)³ dx. (Integer answer.)",((n*n+1)**4-1)//4,[f"u = x² + 1, du = 2x dx; limits u = 1 to {n*n+1}.",f"∫u³ du = u⁴/4: ({(n*n+1)**4} − 1)/4 = {((n*n+1)**4-1)//4}."]) if ((n*n+1)**4-1)%4==0 else False
def i9():
    a=rint(1,3)
    return NM('in','M',f"Find the area between y = {a}x and y = x² from x = 0 to x = {a}. (3 decimals)",round(a**3/2-a**3/3,3),[f"Upper curve y = {a}x, lower curve y = x².",f"∫({a}x − x²)dx = {a}x²/2 − x³/3 = {a**3/2:.3f} − {a**3/3:.3f} = {a**3/6:.3f}."],tol=0.004)
def i10():
    k=rint(2,5)
    return NM('in','M',f"If F′(x) = f(x) and F(1) = 4 and F(3) = {4+k*2}, what is ∫ from 1 to 3 of f(x) dx?",k*2,["By the Fundamental Theorem: integral = F(3) − F(1).",f"= {4+k*2} − 4 = {k*2}."])
FAMS=[c1,c2,c3,c4,c5,c6,c7,c8,c9,c10,c11,p1,p2,p3,p4,p5,p6,p7,p8,m1,m2,m3,m4,m5,m6,m7,m8,d1,d2,d3,d4,d5,d6,d7,d8,d9,d10,d11,d12,a1,a2,a3,a4,a5,a6,a7,i1,i2,i3,i4,i5,i6,i7,i8,i9,i10]
def run(n=14):
    for f in FAMS:gen.rep(f,n)
