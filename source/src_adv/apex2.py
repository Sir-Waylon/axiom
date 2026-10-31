# -*- coding: utf-8 -*-
"""Apex 2: rational functions, exponentials, logarithms, sequences and series."""
from adv_h import *
CARDS={
'ra':[
("Fractions are division","A fraction a/b means a ÷ b. You can simplify by dividing the top and bottom by the same number, like 12/18 = 2/3.",None),
("Rational expressions","A rational expression is a polynomial divided by a polynomial. Simplify by factoring and cancelling common factors, never by cancelling terms that are added.","(x² − 4)/(x − 2) = x + 2"),
("Values that are not allowed","The denominator can never be 0. Every x that makes it 0 is left out of the domain.","1/(x − 3): x ≠ 3"),
("Vertical asymptotes and holes","If a factor cancels, the graph has a hole. If a factor in the denominator stays, the graph shoots off to infinity there: a vertical asymptote.",None),
("Horizontal asymptotes","Compare degrees. Top lower: y = 0. Same degree: y = (leading coefficient of top) ÷ (leading coefficient of bottom). Top higher: no horizontal asymptote.","(3x + 1)/(x − 2) → y = 3"),
("Solving rational equations","Multiply both sides by the common denominator to clear the fractions. Then check each answer, because a solution that makes a denominator 0 is extraneous.",None),
("Direct and inverse variation","Direct: y = kx, both grow together. Inverse: y = k/x, one grows as the other shrinks. More workers means fewer days.","3 workers take 12 days → 6 workers take 6 days"),
("Work and rate problems","Rates add. If A does a job in a hours and B in b hours, together they finish in ab/(a + b) hours.","1/a + 1/b = 1/T")],
'ex':[
("Repeated multiplication","2⁵ means 2 × 2 × 2 × 2 × 2 = 32. The small raised number counts how many times the base is used.","2⁵ = 32"),
("Doubling and tripling","If a plant doubles every day, after n days it is 2ⁿ times bigger. This kind of growth starts slowly and then explodes.",None),
("Exponential functions","y = a·bˣ. a is the starting amount and b is the growth factor. If b > 1 it grows. If 0 < b < 1 it decays.","y = 100·1.05ˣ"),
("Negative and zero exponents","b⁰ = 1 and b⁻ⁿ = 1/bⁿ. A negative exponent means flip, not negative.","2⁻³ = 1/8"),
("Percent growth and decay","Growing 8% a year multiplies by 1.08. Losing 20% multiplies by 0.80.","A = P(1 + r)ᵗ"),
("Compound interest","With n compounds a year: A = P(1 + r/n)ⁿᵗ. More compounds give slightly more money.","A = P(1 + r/n)^(nt)"),
("Half-life","After one half-life, half remains. After two, a quarter. Amount = start × (½)^(time ÷ half-life).",None),
("Solving exponential equations","If the bases match, set the exponents equal. Otherwise take a logarithm of both sides.","2ˣ = 64 → x = 6")],
'lg':[
("What a logarithm asks","log₂ 8 asks: what power of 2 gives 8? The answer is 3 because 2³ = 8. A log is an exponent in disguise.","log_b(x) = y means bʸ = x"),
("Common logs","log without a base means base 10. log 1000 = 3. Each +1 means ten times bigger.","log 1000 = 3"),
("Special values","log_b 1 = 0 and log_b b = 1, for any base.",None),
("Product and quotient rules","log(ab) = log a + log b and log(a/b) = log a − log b. Logs turn multiplying into adding.","log₂ 8 + log₂ 4 = log₂ 32 = 5"),
("Power rule","log(aⁿ) = n·log a. This is how logs pull exponents down so you can solve for them.",None),
("Change of base","log_b x = log x / log b. It lets a calculator find any log.","log₂ 10 ≈ 3.32"),
("Solving log equations","Combine logs into one, rewrite as an exponent, solve, then check that every log's input is positive.",None),
("Natural log","ln is the log with base e ≈ 2.718. ln(eˣ) = x and e^(ln x) = x.","ln e = 1")],
'sq':[
("Patterns and sequences","A sequence is an ordered list that follows a rule, like 3, 6, 9, 12, … Each number is a term.",None),
("Arithmetic sequences","You add the same amount (the common difference d) each time. The nth term is aₙ = a₁ + (n − 1)d.","aₙ = a₁ + (n − 1)d"),
("Geometric sequences","You multiply by the same number (the common ratio r) each time. aₙ = a₁·rⁿ⁻¹.","aₙ = a₁·rⁿ⁻¹"),
("Arithmetic series","Adding the terms: Sₙ = n(a₁ + aₙ)/2. Gauss found 1 + 2 + … + 100 = 5050 by pairing ends.","Sₙ = n(a₁ + aₙ)/2"),
("Geometric series","Sₙ = a₁(1 − rⁿ)/(1 − r). Each term is r times the last.","Sₙ = a₁(1 − rⁿ)/(1 − r)"),
("Infinite geometric series","If |r| < 1 the terms shrink and the total settles on S = a₁/(1 − r). If |r| ≥ 1 it never settles.","1 + ½ + ¼ + … = 2"),
("Sigma notation","Σ means add. Σ from k = 1 to 4 of 2k means 2 + 4 + 6 + 8 = 20.",None),
("Recursive and explicit rules","Recursive: each term from the one before (aₙ = aₙ₋₁ + 3). Explicit: each term from its position (aₙ = 3n + 1).",None)]}

def r2():
    w=rint(2,6);k=rint(2,6);d=rint(2,6)*k;w2=w*k
    return NM('ra','F',f"{w} workers take {d} days to build a wall. At the same rate, how many days will {w2} workers take?",d//k,[f"Total work = {w} × {d} = {w*d} worker-days.",f"Divide by {w2} workers: {w*d} ÷ {w2} = {d//k} days."],u='days',free=True)
def r3():
    k=rint(2,12);y=rint(2,8)
    return NM('ra','B',f"y varies inversely with x and y = {y} when x = {k}. Find y when x = {k*2}.",Fr(y,2),[f"xy is constant: {k} × {y} = {k*y}.",f"y = {k*y}/{k*2} = {num(Fr(y,2))}."])
def r4():
    a=rint(2,12);b=rint(2,12)
    x=Fr(a,b)
    return NM('ra','B',f"Solve {a}/x = {b}.",x,[f"Multiply both sides by x: {a} = {b}x.",f"x = {a}/{b} = {num(x)}."])
def r5():
    k=rint(-7,8);a=rint(1,6)
    return NM('ra','C',f"Find the vertical asymptote x = c of f(x) = {a}/(x {sgn(-k)}). What is c?",k,["The denominator is 0 where the graph blows up.",f"x {sgn(-k)} = 0 gives x = {k}."])
def r6():
    a=rint(1,6);b=rint(-6,6);c=rint(1,4);d=rint(-6,6)
    return NM('ra','C',f"Find the horizontal asymptote y = L of f(x) = ({lin(a*c,b)})/({lin(c,d)}).",a,["Degrees match, so L = (leading coefficient top)/(leading coefficient bottom).",f"L = {a*c}/{c} = {a}."])
def r7():
    p=rint(-5,5);q=rint(-5,5);s=rint(-5,5)
    if len({p,q,s})<3:return False
    return NM('ra','C',f"f(x) = (x {sgn(-p)})(x {sgn(-q)}) / ((x {sgn(-p)})(x {sgn(-s)})) has a hole. At what x-value is the hole?",p,["A hole happens where a factor cancels top and bottom.",f"(x {sgn(-p)}) cancels, so the hole is at x = {p}."])
def r8():
    x0=rint(2,9);a=rint(2,6)
    return NM('ra','C',f"Solve {a}/x + 1 = {num(Fr(a,x0)+1)}. What is x?",x0,[f"Subtract 1: {a}/x = {num(Fr(a,x0))}.",f"x = {a} ÷ {num(Fr(a,x0))} = {x0}."])
def r9():
    k=rint(-5,5);b=rint(1,6)
    return GR('ra','C',f"The graph shows y = {b}/(x {sgn(-k)}) + 0 in the region around its asymptote. Tap the point on the graph where x = {k+1}.",'x','y',(k-5,k+5),(-2*b-1,2*b+1),[('y',[(k+i*0.5,b/(i*0.5)) for i in range(-10,11) if i!=0])],(k+1,b),["At x = k + 1 the denominator is 1.",f"y = {b}/1 = {b}."],"Hyperbola with a vertical asymptote",tx=.4,ty=max(.5,b*.12))
def r10():
    a=rint(2,9);b=rint(2,9)
    return NM('ra','M',f"Machine A fills a tank in {a*(a+b)} hours and machine B fills it in {b*(a+b)} hours. Working together, how many hours does it take?",a*b,[f"Rates add: 1/{a*(a+b)} + 1/{b*(a+b)} = ({a+b})/({a*b*(a+b)}) per hour... simplify: ({b}+{a})/({a*b*(a+b)}) = 1/{a*b}.",f"So together they take {a*b} hours."],u='h',free=True)
def r11():
    x0=rint(2,8);p=rint(1,5)
    q=p+rint(1,4)
    if x0 in (p,q):return False
    lhs=Fr(1,x0-p)+Fr(1,x0-q)
    return NM('ra','M',f"Find the solution of 1/(x {sgn(-p)}) + 1/(x {sgn(-q)}) = {num(lhs)} (it is a whole number).",x0,["Multiply every term by (x − p)(x − q) to clear the fractions.",f"The valid solution is x = {x0}; check it keeps both denominators nonzero."])
def r12():
    a=rint(2,6);b=rint(-5,5);c=rint(1,4);d=rint(-5,5)
    return NM('ra','M',f"What is the slope m of the oblique asymptote y = mx + n of f(x) = ({a}x² {sgn(b)}x {sgn(d)})/({c}x {sgn(-c)})?",Fr(a,c),["Divide the leading terms: the quotient starts with (a/c)x.",f"m = {a}/{c} = {num(Fr(a,c))}."])
def r13():
    k=rint(2,6)
    return NM('ra','M',f"For f(x) = (x² − {k*k})/(x − {k}) how many values of x in the set of real numbers are NOT in the domain?",1,[f"x − {k} = 0 gives x = {k}.","Only x = "+str(k)+" is excluded, even though the graph has a hole there."])
def e1():
    n=rint(3,8)
    return NM('ex','F',f"A plant starts at 1 cm and doubles in height every day. How many centimeters tall is it after {n} days?",2**n,[f"Doubling {n} times: 2^{n}.",f"= {2**n} cm."],u='cm',free=True)
def e2():
    b=rint(2,6);n=rint(2,4)
    return NM('ex','F',f"What is {b}{sup(n)}?",b**n,[f"{b} used {n} times: "+' × '.join([str(b)]*n)+".",f"= {b**n}."])
def e3():
    a=rint(2,9);b=rint(2,4);x=rint(1,4)
    return NM('ex','B',f"If f(x) = {a}·{b}ˣ, find f({x}).",a*b**x,[f"{b}^{x} = {b**x}.",f"{a} × {b**x} = {a*b**x}."])
def e4():
    b=rint(2,5);n=rint(1,3)
    return NM('ex','B',f"What is {b} raised to the power −{n}, as a decimal?",round(1/b**n,4),[f"A negative exponent means flip: 1/{b}^{n} = 1/{b**n}.",f"= {1/b**n:.4g}."])
def e5():
    P=rint(1,9)*100;r=pick([5,10,20])
    return NM('ex','B',f"{P} dollars grows by {r}% in one year, then by {r}% again. How many dollars after two years?",round(P*(1+r/100)**2,2),[f"Multiply by {1+r/100} twice.",f"{P} × {1+r/100}² = {P*(1+r/100)**2:.2f}."])
def e6():
    b=rint(2,5);x=rint(2,6)
    return NM('ex','C',f"Solve {b}ˣ = {b**x}.",x,["The bases match, so the exponents are equal.",f"x = {x}."])
def e7():
    b=rint(2,4);x=rint(1,4);c=rint(1,3)
    return NM('ex','C',f"Solve {b}^(x + {c}) = {b**(x+c)}.",x,[f"Match exponents: x + {c} = {x+c}.",f"x = {x}."])
def e8():
    r=pick([2,3,4,5,6,8,10,12,15])
    return NM('ex','C',f"An account grows {r}% a year. By what factor does the balance multiply each year?",round(1+r/100,4),[f"Add the rate to 1: 1 + {r}/100.",f"= {1+r/100}."])
def e9():
    h=rint(2,8);t=h*rint(2,5);A=rint(1,6)*64
    return NM('ex','C',f"A sample of {A} g has a half-life of {h} days. How many grams remain after {t} days?",A/2**(t//h),[f"{t} ÷ {h} = {t//h} half-lives.",f"{A} × (½)^{t//h} = {A/2**(t//h):g} g."],u='g',free=True)
def e10():
    u1=rint(1,3);u2=u1+rint(1,3)
    b=-(2**u1+2**u2);c=2**(u1+u2)
    return NM('ex','M',f"Solve 4ˣ {sgn(b)}·2ˣ {sgn(c)} = 0. What is the larger solution? (Let u = 2ˣ.)",u2,[f"With u = 2ˣ: u² {sgn(b)}u {sgn(c)} = 0, so (u − {2**u1})(u − {2**u2}) = 0.",f"2ˣ = {2**u1} or {2**u2}, so x = {u1} or {u2}.",f"The larger is {u2}."])
def e11():
    a=rint(2,6);b=rint(2,3);n=rint(2,4)
    return NM('ex','M',f"An exponential y = a·bˣ passes through (0, {a}) and ({n}, {a*b**n}). Find b.",b,["At x = 0, y = a, so a is the starting value.",f"{a}·bⁿ = {a*b**n} → b^{n} = {b**n}.",f"b = {b}."])
def e12():
    h=rint(3,12);A=rint(2,8)*16
    t=h*4
    return NM('ex','M',f"{A} mg of a drug has half-life {h} hours. After {t} hours, how many milligrams are left?",A/16,[f"{t}/{h} = 4 half-lives.",f"{A}/2⁴ = {A/16:g} mg."],u='mg',free=True)
def l1():
    k=rint(1,5)
    return NM('lg','F',f"How many times must you multiply 10 by itself to get {10**k}? (That is log {10**k}.)",k,[f"10 used k times: 10^k = {10**k}.",f"So k = {k}."])
def l2():
    b=rint(2,5);k=rint(1,4)
    return NM('lg','F',f"What power of {b} equals {b**k}?",k,[f"{b}^{k} = {b**k}.",f"The power is {k}."])
def l3():
    b=rint(2,9);k=rint(1,4)
    return NM('lg','B',f"Evaluate log base {b} of {b**k}.",k,[f"Ask: {b} to what power is {b**k}?",f"{b}^{k} = {b**k}, so the answer is {k}."])
def l4():
    b=rint(2,6);k=rint(1,3)
    return NM('lg','B',f"Evaluate log base {b} of 1/{b**k}.",-k,[f"1/{b**k} = {b}^(−{k}).",f"So the log is −{k}."])
def l5():
    b=rint(2,5);m=rint(1,4);n=rint(1,4)
    return NM('lg','C',f"Simplify log base {b} of {b**m} plus log base {b} of {b**n}.",m+n,["Add the logs: log(ab) = log a + log b.",f"{m} + {n} = {m+n}."])
def l6():
    b=rint(2,5);k=rint(2,5)
    return NM('lg','C',f"Solve log base {b} of x = {k}.",b**k,["Rewrite as an exponent: x = b^k.",f"x = {b}^{k} = {b**k}."])
def l7():
    a=pick([1.585,2.322,2.807]);b=pick([3,5,7])
    return NM('lg','C',f"If log₂ {b} ≈ {a}, what is log₂ {b*b} approximately?",round(2*a,3),[f"{b*b} = {b}², so log₂ {b*b} = 2·log₂ {b}.",f"2 × {a} = {round(2*a,3)}."],tol=0.002)
def l8():
    n=rint(10,90)
    return NM('lg','C',f"Solve 2ˣ = {n} using logarithms. Give x to 2 decimals.",round(math.log(n,2),2),[f"Take the log of both sides: x = log {n} / log 2.",f"x ≈ {math.log(n,2):.2f}."],tol=0.002)



def l12():
    x=pick([4,6,8,10])
    return NM('lg','M',f"Solve log₂ x + log₂ (x − 2) = log₂ {x*(x-2)}. Give the valid solution x.",x,[f"Combine: log₂ [x(x − 2)] = log₂ {x*(x-2)}.",f"x² − 2x − {x*(x-2)} = 0 → x = {x} or x = {2-x}.",f"x = {2-x} makes x negative, so the valid solution is {x}."])
def l13():
    p=pick([0.3,0.5,0.7]);q=pick([0.4,0.6,0.8])
    return NM('lg','M',f"If log_b 2 = {p} and log_b 3 = {q}, find log_b 12 (12 = 2·2·3).",round(2*p+q,4),["12 = 2² × 3.",f"log_b 12 = 2·log_b 2 + log_b 3 = {2*p} + {q}."])
def l14():
    r=pick([2,3,5,6,8])
    n=math.log(3)/math.log(1+r/100)
    return NM('lg','M',f"An investment grows {r}% a year. About how many years until it triples? (Use t = ln 3 / ln(1 + r).)",round(n,1),[f"Solve {1+r/100}ᵗ = 3.",f"t = ln 3 / ln {1+r/100} ≈ {n:.1f} years."],u='yr',free=True,tol=0.01)
def s1():
    a=rint(2,9);d=rint(2,6);n=rint(5,8)
    seq=[a+i*d for i in range(4)]
    return NM('sq','F',f"What comes next? {', '.join(map(str,seq))}, ...",a+4*d,[f"The pattern adds {d} each time.",f"{seq[-1]} + {d} = {a+4*d}."])
def s2():
    n=rint(4,9)
    return NM('sq','F',f"What is the {n}th square number (1, 4, 9, 16, …)?",n*n,[f"The nth square number is n × n.",f"{n} × {n} = {n*n}."])
def s3():
    a=rint(1,9);d=rint(2,7);n=rint(6,20)
    return NM('sq','B',f"An arithmetic sequence has first term {a} and common difference {d}. What is term number {n}?",a+(n-1)*d,[f"aₙ = a₁ + (n − 1)d = {a} + {n-1}({d}).",f"= {a+(n-1)*d}."])
def s4():
    a=rint(1,5);r=rint(2,4);n=rint(3,6)
    return NM('sq','B',f"A geometric sequence starts at {a} and multiplies by {r} each time. What is term number {n}?",a*r**(n-1),[f"aₙ = a₁·rⁿ⁻¹ = {a}·{r}^{n-1}.",f"= {a*r**(n-1)}."])
def s5():
    n=rint(5,40)
    return NM('sq','B',f"Find 1 + 2 + 3 + … + {n}.",n*(n+1)//2,[f"Use n(n + 1)/2 = {n}·{n+1}/2.",f"= {n*(n+1)//2}."])
def s6():
    a=rint(1,9);d=rint(2,6);n=rint(5,15)
    return NM('sq','C',f"Find the sum of the first {n} terms of the arithmetic sequence {a}, {a+d}, {a+2*d}, …",n*(2*a+(n-1)*d)//2,[f"Sₙ = n/2 (2a + (n − 1)d) = {n}/2 (2·{a} + {n-1}·{d}).",f"= {n*(2*a+(n-1)*d)//2}."])
def s7():
    a=rint(1,9);d=rint(2,6);n=rint(8,25)
    t=a+(n-1)*d
    return NM('sq','C',f"In an arithmetic sequence a₁ = {a} and d = {d}. Which term number equals {t}?",n,[f"{a} + (n − 1)({d}) = {t}.",f"(n − 1) = {(t-a)//d}, so n = {n}."])
def s8():
    a=rint(1,6);r=pick([Fr(1,2),Fr(1,3),Fr(2,3),Fr(1,4),Fr(3,4)])
    S=a/(1-r)
    return NM('sq','C',f"Find the sum of the infinite geometric series {a} + {num(a*r)} + {num(a*r*r)} + …",S,[f"r = {num(r)}, which is between −1 and 1, so the series settles.",f"S = a/(1 − r) = {a}/{num(1-r)} = {num(Fr(a)/(1-r))}."],tol=0.006)
def s9():
    a=rint(1,5);r=rint(2,3);n=rint(3,6)
    return NM('sq','C',f"Find the sum of the first {n} terms of the geometric series starting at {a} with ratio {r}.",a*(r**n-1)//(r-1),[f"Sₙ = a(rⁿ − 1)/(r − 1) = {a}({r**n} − 1)/{r-1}.",f"= {a*(r**n-1)//(r-1)}."])
def s10():
    n=rint(3,8);k=rint(2,5)
    return NM('sq','C',f"Evaluate the sum of 2k from k = 1 to {n}.",n*(n+1),[f"Σ 2k = 2(1 + 2 + … + {n}) = 2·{n*(n+1)//2}.",f"= {n*(n+1)}."])
def s11():
    h=rint(2,8)*2;r=pick([Fr(1,2),Fr(2,3),Fr(3,4)])
    total=h*(1+r)/(1-r)
    return NM('sq','M',f"A ball dropped from {h} m bounces back to {num(r)} of its previous height each time. What total vertical distance (down and up) does it travel before stopping?",total,[f"Down: {h}. Then each bounce adds up and down: 2h·r/(1 − r).",f"Total = h(1 + r)/(1 − r) = {num(Fr(h)*(1+r)/(1-r))} m."],u='m',free=True,tol=0.006)
def s12():
    a=rint(2,6);d=rint(2,5);n=rint(8,20);S=n*(2*a+(n-1)*d)//2
    return NM('sq','M',f"An arithmetic series has first term {a}, {n} terms and sum {S}. Find the common difference d.",d,[f"S = n/2 (2a + (n − 1)d): {S} = {n}/2 (2·{a} + {n-1}d).",f"d = {d}."])
def s13():
    a=rint(1,3);r=rint(2,3)
    return NM('sq','M',f"A geometric sequence has a₂ = {a*r} and a₅ = {a*r**4}. Find the common ratio r.",r,["a₅/a₂ = r³.",f"{a*r**4}/{a*r} = {r**3}, so r = {r}."])
def s14():
    p=pick([(3,11),(5,9),(2,3)]);d=pick([(0.3333,1,3),(0.5555,5,9),(0.6666,2,3)])
    return NM('sq','M',"The repeating decimal 0.333… is the infinite geometric series 0.3 + 0.03 + 0.003 + … What fraction (decimal form) is the sum?",round(1/3,4),["a₁ = 0.3 and r = 0.1.","S = 0.3/(1 − 0.1) = 0.3/0.9 = 1/3."],tol=0.01)
FAMS=[r2,r3,r4,r5,r6,r7,r8,r9,r10,r11,r12,r13,e1,e2,e3,e4,e5,e6,e7,e8,e9,e10,e11,e12,l1,l2,l3,l4,l5,l6,l7,l8,l12,l13,l14,s1,s2,s3,s4,s5,s6,s7,s8,s9,s10,s11,s12,s13,s14]
def run(n=14):
    for f in FAMS:gen.rep(f,n)
