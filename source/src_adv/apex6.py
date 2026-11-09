# -*- coding: utf-8 -*-
"""Apex 6: AP Statistics, multivariable calculus, series and parametric calculus."""
from adv_h import *
def f2(x):return f"{x:.2f}"
def ncdf(z):return 0.5*(1+math.erf(z/math.sqrt(2)))
CARDS={
'st':[
("Centre and spread","The mean is the balance point; the median is the middle value and resists outliers. Standard deviation s measures typical distance from the mean: s = √(Σ(x − x̄)²/(n − 1)).","s = √(Σ(x − x̄)²/(n−1))"),
("The normal distribution","A bell curve described by mean μ and standard deviation σ. A z-score counts standard deviations from the mean: z = (x − μ)/σ. About 68%, 95% and 99.7% lie within 1, 2 and 3 σ.","z = (x − μ)/σ"),
("Sampling and the CLT","Averages of many random samples pile up in a bell shape around the true mean, with standard error σ/√n. Bigger samples give narrower curves.","SE = σ/√n"),
("Confidence intervals","An interval estimate: x̄ ± z*·σ/√n. A 95% interval uses z* ≈ 1.96. The 95% describes the method, not one interval.","x̄ ± z*·σ/√n"),
("Hypothesis tests","Assume the null hypothesis, then ask how surprising your data would be. The test statistic z = (x̄ − μ₀)/(σ/√n) measures that. A small p-value means the data would be rare if the null were true.","z = (x̄ − μ₀)/(σ/√n)"),
],
'mv':[
("Vectors in space","A vector has direction and size. The dot product a·b = a₁b₁ + a₂b₂ + a₃b₃ is zero exactly when the vectors are perpendicular. The magnitude is |a| = √(a·a).","a·b = a₁b₁ + a₂b₂ + a₃b₃"),
("Partial derivatives","For f(x, y), the partial ∂f/∂x treats y as a constant and differentiates in x. It is the slope of the surface when you walk in the x direction.","∂f/∂x: hold y fixed"),
("The gradient","∇f = (∂f/∂x, ∂f/∂y) points in the direction of steepest increase, and its length is that steepest slope. It is perpendicular to level curves.","∇f = (fₓ, f_y)"),
("Double integrals","∬ f dA adds up f over a region. For a rectangle, integrate in one variable, then the other. With f = 1, it gives the area; in general, the volume under the surface.","∬ f dA"),
],
'sr':[
("Sequences and partial sums","A series adds the terms of a sequence. It converges if its partial sums settle toward a number. A geometric series a + ar + ar² + … converges to a/(1 − r) when |r| < 1.","S = a/(1 − r), |r| < 1"),
("Convergence tests","If the terms do not go to 0, the series diverges. A p-series Σ1/nᵖ converges exactly when p > 1. The ratio test: if |aₙ₊₁/aₙ| → L, converge when L < 1, diverge when L > 1.","Σ1/nᵖ converges ⇔ p > 1"),
("Taylor series","A smooth function near 0 can be matched by a polynomial: f(x) ≈ f(0) + f′(0)x + f″(0)x²/2! + …. For eˣ every derivative at 0 is 1, so eˣ = 1 + x + x²/2! + x³/3! + ….","eˣ = Σ xⁿ/n!"),
("Parametric curves","x = x(t), y = y(t) trace a path. The slope is dy/dx = (dy/dt)/(dx/dt), and the speed is √((dx/dt)² + (dy/dt)²).","dy/dx = (dy/dt)/(dx/dt)"),
],
}
# ---- AP Statistics
def st1():
    d=sorted(R.sample(range(2,40),5));m=sum(d)/5
    return NM('st','F',f"Find the mean of {', '.join(map(str,d))}.",m,[f"Sum = {sum(d)}.",f"Mean = {sum(d)}/5 = {m:g}."],free=True,tol=0.01)
def st2():
    d=R.sample(range(1,30),5);s=sorted(d)
    return NM('st','F',f"Find the median of {', '.join(map(str,d))}.",s[2],["Sort the data: "+', '.join(map(str,s))+".",f"The middle (3rd) value is {s[2]}."],free=True,tol=0.01)
def st3():
    mu=rint(60,100);sg=rint(4,12);z=pick([-2,-1,1,2,1.5,-1.5]);x=mu+z*sg
    return NM('st','B',f"Scores have mean {mu} and standard deviation {sg}. Find the z-score of {x:g}.",z,[f"z = (x − μ)/σ = ({x:g} − {mu})/{sg}.",f"z = {z:g}."],free=True,tol=0.01)
def st4():
    d=pick([[2,4,4,4,5,5,7,9],[1,3,5,7],[2,4,6,8,10],[3,5,7,9,11,13]]);m=sum(d)/len(d)
    s=math.sqrt(sum((x-m)**2 for x in d)/(len(d)-1))
    return NM('st','C',f"Find the sample standard deviation of {', '.join(map(str,d))} (2 decimals).",round(s,2),[f"Mean = {m:g}.",f"Σ(x − x̄)² = {sum((x-m)**2 for x in d):g}; divide by n − 1 = {len(d)-1}.",f"s = {s:.4f} ≈ {s:.2f}."],tol=0.012,free=True)
def st5():
    z=pick([0,1,2,-1,1.96]);p=ncdf(z)
    return NM('st','C',f"For a standard normal variable, find P(Z < {z:g}) (3 decimals).",round(p,3),[f"Use the normal table or calculator: normalcdf(−∞, {z:g}).",f"P ≈ {p:.3f}."],tol=0.002,free=True)
def st6():
    sg=rint(8,20);n=pick([4,9,16,25,36,64])
    return NM('st','B',f"A population has σ = {sg}. Find the standard error of the mean for samples of size {n} (2 decimals).",round(sg/math.sqrt(n),2),[f"SE = σ/√n = {sg}/√{n}.",f"= {sg/math.sqrt(n):.3f}."],tol=0.011,free=True)
def st7():
    xb=rint(40,90);sg=rint(5,15);n=pick([16,25,36,49,100]);z=1.96;me=z*sg/math.sqrt(n)
    return NM('st','C',f"x̄ = {xb}, σ = {sg}, n = {n}. Find the margin of error of a 95% confidence interval (z* = 1.96, 2 decimals).",round(me,2),[f"ME = z*·σ/√n = 1.96 × {sg}/√{n}.",f"= {me:.3f}."],tol=0.011,free=True)
def st8():
    mu=rint(50,80);sg=rint(5,12);n=pick([16,25,36,64]);se=sg/math.sqrt(n);z=pick([-2,-1,1,2,2.5]);xb=mu+z*se
    return NM('st','M',f"H₀: μ = {mu}. σ = {sg}, n = {n}, x̄ = {xb:g}. Find the z test statistic (2 decimals).",round((xb-mu)/se,2),[f"SE = {sg}/√{n} = {se:g}.",f"z = (x̄ − μ₀)/SE = ({xb:g} − {mu})/{se:g} = {(xb-mu)/se:.2f}."],tol=0.011,free=True)
def st9():
    z=pick([2.1,2.5,1.0,0.5,3.0])
    return NM('st','M',f"A two-sided z test gives z = {z}. At the 5% level (cutoff 1.96), do you reject H₀? Type 1 for yes, 0 for no.",1 if abs(z)>1.96 else 0,[f"|{z}| {'>' if abs(z)>1.96 else '<'} 1.96, so {'reject' if abs(z)>1.96 else 'do not reject'} H₀."])
def st10():
    p=pick([0.2,0.3,0.4,0.25]);q=pick([0.5,0.6,0.1,0.35])
    return NM('st','B',f"Independent events have P(A) = {p} and P(B) = {q}. Find P(A and B) (3 decimals).",round(p*q,3),["For independent events multiply: P(A)·P(B).",f"{p} × {q} = {p*q:.3f}."],tol=0.0011,free=True)
# ---- Multivariable
def mv1():
    a=[rint(-5,5) for _ in range(3)];b=[rint(-5,5) for _ in range(3)];d=sum(x*y for x,y in zip(a,b))
    return NM('mv','B',f"Find the dot product of ⟨{a[0]}, {a[1]}, {a[2]}⟩ and ⟨{b[0]}, {b[1]}, {b[2]}⟩.",d,["Multiply matching parts and add.",f"= {a[0]*b[0]} + {a[1]*b[1]} + {a[2]*b[2]} = {d}."],free=True,tol=0.01)
def mv2():
    a,b,c=pick([(1,2,2),(2,3,6),(3,4,12),(2,6,9),(4,4,7)])
    m=math.sqrt(a*a+b*b+c*c)
    return NM('mv','B',f"Find the magnitude of ⟨{a}, {b}, {c}⟩.",m,[f"√({a}² + {b}² + {c}²) = √{a*a+b*b+c*c}.",f"= {m:g}."],free=True,tol=0.01)
def mv3():
    a=rint(1,5);b=rint(1,5);x=rint(1,4);y=rint(1,4)
    return NM('mv','F',f"f(x, y) = {a}x² + {b}y. Find ∂f/∂x at (x, y) = ({x}, {y}).",2*a*x,["Treat y as a constant: ∂f/∂x = "+f"{2*a}x.",f"At x = {x}: {2*a*x}."],free=True,tol=0.01)
def mv4():
    a=rint(1,5);b=rint(1,5);x=rint(1,4);y=rint(1,4)
    return NM('mv','B',f"f(x, y) = {a}xy² + x. Find ∂f/∂y at ({x}, {y}).",2*a*x*y,[f"∂f/∂y = {2*a}xy (x is constant, and the lone x vanishes).",f"At ({x}, {y}): {2*a*x*y}."],free=True,tol=0.01)
def mv5():
    a=rint(1,4);b=rint(1,4);x=rint(1,3);y=rint(1,3)
    g=math.hypot(2*a*x,2*b*y)
    return NM('mv','C',f"f(x, y) = {a}x² + {b}y². Find |∇f| at ({x}, {y}) (2 decimals).",round(g,2),[f"∇f = ⟨{2*a}x, {2*b}y⟩ = ⟨{2*a*x}, {2*b*y}⟩.",f"|∇f| = √({(2*a*x)**2} + {(2*b*y)**2}) = {g:.3f}."],tol=0.011,free=True)
def mv6():
    a=rint(2,6);b=rint(2,6);c=rint(1,5)
    return NM('mv','B',f"Find the area of the rectangle 0 ≤ x ≤ {a}, 0 ≤ y ≤ {b} using ∬ {c} dA.",a*b*c,[f"∬ {c} dA = {c} × area.",f"= {c} × {a} × {b} = {a*b*c}."],free=True,tol=0.01)
def mv7():
    a=rint(1,4);b=rint(1,4)
    return NM('mv','C',f"Evaluate ∫₀^{a}∫₀^{b} xy dy dx.",a*a*b*b/4,[f"Inner: ∫₀^{b} xy dy = x·{b}²/2.",f"Outer: ∫₀^{a} x·{b*b}/2 dx = {b*b}/2 · {a}²/2 = {a*a*b*b/4:g}."],free=True,tol=0.01)
def mv8():
    a=pick([(1,2,0),(2,1,0),(3,4,0)]);return NM('mv','F',f"Are ⟨1, 2, 0⟩ and ⟨2, −1, 5⟩ perpendicular? Type 1 for yes, 0 for no.",1,["Dot product: 2 − 2 + 0 = 0.","A zero dot product means perpendicular."])
# ---- Series and parametric
def sr1():
    a=rint(1,9);r=pick([Fr(1,2),Fr(1,3),Fr(2,3),Fr(1,4),Fr(3,4)]);s=a/(1-r)
    return NM('sr','B',f"Find the sum of the geometric series {a} + {num(a*r)} + {num(a*r*r)} + …",float(s),[f"Ratio r = {num(r)}, and |r| < 1.",f"S = a/(1 − r) = {a}/{num(1-r)} = {num(s)}."],free=True,tol=0.01)
def sr2():
    p=pick([Fr(1,2),Fr(1),Fr(3,2),2,3]);p=Fr(p)
    return NM('sr','B',f"Does Σ 1/n^{num(p)} (n from 1 to ∞) converge? Type 1 for yes, 0 for no.",1 if p>1 else 0,[f"A p-series converges exactly when p > 1. Here p = {num(p)}.",f"So the answer is {'yes' if p>1 else 'no'}."])
def sr3():
    r=pick([Fr(1,2),Fr(2,3),Fr(3,2),2,Fr(1,3)]);r=Fr(r)
    return NM('sr','C',f"For aₙ = {num(r)}ⁿ, the ratio aₙ₊₁/aₙ tends to {num(r)}. Does Σaₙ converge? Type 1 for yes, 0 for no.",1 if r<1 else 0,["Ratio test: converge when the limit is below 1.",f"{num(r)} is {'below' if r<1 else 'at least'} 1."])
def sr4():
    n=rint(2,5)
    return NM('sr','B',f"In the Taylor series eˣ = 1 + x + x²/2! + x³/3! + …, what is the coefficient of x^{n}? (Decimal, 4 places)",round(1/math.factorial(n),4),[f"The coefficient is 1/{n}!.",f"= 1/{math.factorial(n)} = {1/math.factorial(n):.4f}."],tol=0.0002,free=True)
def sr5():
    x=pick([0.1,0.2,0.5,1])
    t=1+x+x*x/2+x**3/6
    return NM('sr','C',f"Use the first four terms of the series for eˣ to estimate e^{x} (4 decimals).",round(t,4),[f"1 + {x} + {x}²/2 + {x}³/6.",f"= {t:.4f}."],tol=0.0002,free=True)
def sr6():
    a=rint(2,6);b=rint(2,6);t=rint(1,3)
    return NM('sr','C',f"x = {a}t², y = {b}t³. Find dy/dx at t = {t}.",(3*b*t*t)/(2*a*t),[f"dx/dt = {2*a}t, dy/dt = {3*b}t².",f"dy/dx = {3*b}t²/{2*a}t = {3*b}t/{2*a}.",f"At t = {t}: {3*b*t/(2*a):g}."],tol=0.01,free=True)
def sr7():
    a,b=pick([(3,4),(5,12),(6,8),(8,15)])
    return NM('sr','M',f"A particle has dx/dt = {a} and dy/dt = {b}. Find its speed.",math.hypot(a,b),["Speed = √((dx/dt)² + (dy/dt)²).",f"= √({a*a} + {b*b}) = {math.hypot(a,b):g}."],free=True,tol=0.01)
def sr8():
    r=rint(2,9)
    return NM('sr','M',f"The circle x = {r}cos t, y = {r}sin t has speed {r} for every t. How far does a point travel in one full turn (0 ≤ t ≤ 2π)? (Give a decimal, 2 places)",round(2*math.pi*r,2),[f"Distance = speed × time = {r} × 2π.",f"= {2*math.pi*r:.3f}."],tol=0.011,free=True)
FAMS=[st1,st2,st3,st4,st5,st6,st7,st8,st9,st10,mv1,mv2,mv3,mv4,mv5,mv6,mv7,mv8,sr1,sr2,sr3,sr4,sr5,sr6,sr7,sr8]
def run(n=14):
    for f in FAMS:gen.rep(f,n)
