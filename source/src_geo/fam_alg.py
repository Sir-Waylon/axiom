# -*- coding: utf-8 -*-
from gen import *
def ri(a,b):return R.randint(a,b)
def nz(a,b):
    x=0
    while x==0:x=R.randint(a,b)
    return x
def pm(n):return 'plus' if n>=0 else 'minus'
# ---------------- eq
def eq1():
    a=nz(2,9);x=ri(-9,12);b=ri(-15,15);c=a*x+b
    return NUM('eq',1,'eq1',f"Solve for x: {a}x {sg(b)} = {c}",x,[f"Undo the {pm(b)} {abs(b)}: {a}x = {c-b}.",f"Divide both sides by {a}: x = {x}.",f"Check: {a}({x}) {sg(b)} = {c}."],b=-1.2)
def eq2():
    a=nz(2,8);c=nz(-6,8)
    while c==a:c=nz(-6,8)
    x=ri(-8,10);b=ri(-12,12);d=a*x+b-c*x
    return NUM('eq',2,'eq2',f"Solve for x: {a}x {sg(b)} = {c}x {sg(d)}",x,[f"Get the x terms on one side: {a}x − {c}x = {d} − {b}.",f"Combine: {a-c}x = {d-b}.",f"Divide by {a-c}: x = {x}."],b=-.3)
def eq3():
    a=nz(2,7);b=ri(-8,8);x=ri(-6,9);c=a*(x+b)
    return NUM('eq',2,'eq3',f"Solve for x: {a}(x {sg(b)}) = {c}",x,[f"Distribute: {a}x {sg(a*b)} = {c}.",f"Isolate the x term: {a}x = {c-a*b}.",f"Divide by {a}: x = {x}."],b=-.2)
def eq4():
    a=ri(2,6);x=a*ri(-5,8);b=ri(-9,9);c=x//a+b
    return NUM('eq',2,'eq4',f"Solve for x: x/{a} {sg(b)} = {c}",x,[f"Undo the {pm(b)} {abs(b)}: x/{a} = {c-b}.",f"Multiply both sides by {a}: x = {(c-b)*a}."],b=-.1)
def eq5():
    a=nz(-7,7)
    while abs(a)<2:a=nz(-7,7)
    b=ri(-9,9);c=ri(-12,12);k=Fr(c-b,a);sym=R.choice(['>','≤']);flip={'>':'<','≤':'≥','<':'>','≥':'≤'}
    op=sym if a>0 else flip[sym]
    good=f"x {op} {fm(k)}";bad=[f"x {sym} {fm(k)}" if a<0 else f"x {flip[sym]} {fm(k)}",f"x {op} {fm(Fr(c+b,a))}",f"x {flip[op]} {fm(Fr(b-c,a))}",f"x {op} {fm(Fr(c,a)-b)}"]
    st=[f"Move the constant: {a}x {sym} {c-b}.",f"Divide by {a}. "+('The number is negative, so flip the sign.' if a<0 else 'The number is positive, so the sign stays.'),f"Result: {good}."]
    return MC('eq',3,'eq5',f"Solve: {a}x {sg(b)} {sym} {c}",good,bad,st,b=.9)
def eq6():
    L=[("P = 2l + 2w","l","l = (P − 2w)/2",["l = P − 2w","l = (P + 2w)/2","l = P/2 + w"]),("A = ½bh","b","b = 2A/h",["b = A/(2h)","b = 2Ah","b = A − h/2"]),("V = lwh","h","h = V/(lw)",["h = V − lw","h = Vlw","h = lw/V"]),("d = rt","t","t = d/r",["t = dr","t = r/d","t = d − r"]),("y = mx + b","x","x = (y − b)/m",["x = y − b·m","x = (y + b)/m","x = m(y − b)"]),("C = 2πr","r","r = C/(2π)",["r = 2πC","r = C − 2π","r = C/π"])]
    f,v,g,bd=R.choice(L)
    return MC('eq',3,'eq6',f"Solve {f} for {v}.",g,bd,[f"Treat {v} as the unknown and undo the operations in reverse order.","Undo anything added or subtracted first, then divide by whatever multiplies it.",g],b=1.0)
def eq7():
    n=ri(-4,12)
    return NUM('eq',3,'eq7',f"The sum of three consecutive integers is {3*n+3}. What is the smallest?",n,["Let the integers be x, x + 1, x + 2.",f"Their sum is 3x + 3 = {3*n+3}.",f"3x = {3*n}, so x = {n}."],b=.7)
# ---------------- lin
def lin1():
    x1,y1=ri(-6,6),ri(-6,6);dx=nz(-5,5);dy=ri(-8,8);x2,y2=x1+dx,y1+dy;m=Fr(dy,dx)
    return NUM('lin',1,'lin1',f"Find the slope of the line through ({x1}, {y1}) and ({x2}, {y2}). Fractions are fine.",float(m),["Slope = (y₂ − y₁)/(x₂ − x₁).",f"= ({y2} − {y1})/({x2} − {x1}) = {dy}/{dx}.",f"m = {fm(m)}."],show=fm(m),b=-1.1)
def lin2():
    m=nz(-6,6);b=ri(-9,9)
    return NUM('lin',1,'lin2',f"What is the y-intercept of y = {m}x {sg(b)}?",b,["In y = mx + b, b is the y-intercept (where x = 0).",f"b = {b}."],b=-1.3)
def lin3():
    m=nz(-5,5);x=ri(-5,5);y=ri(-8,8);b=y-m*x
    return NUM('lin',2,'lin3',f"A line with slope {m} passes through ({x}, {y}). What is its y-intercept?",b,[f"Use y = mx + b with m = {m}, x = {x}, y = {y}.",f"{y} = {m}({x}) + b, so {y} = {m*x} + b.",f"b = {y} − ({m*x}) = {b}."],b=-.2)
def lin4():
    m=Fr(ri(1,6),ri(2,5))*R.choice([1,-1])
    if R.random()<.5:
        return NUM('lin',2,'lin4a',f"A line has slope {fm(m)}. What is the slope of a line parallel to it?",float(m),["Parallel lines have equal slopes.",f"Slope = {fm(m)}."],show=fm(m),b=-.6)
    p=-1/m
    return NUM('lin',2,'lin4b',f"A line has slope {fm(m)}. What is the slope of a line perpendicular to it?",float(p),["Perpendicular slopes are negative reciprocals.",f"Flip {fm(m)} to {fm(1/m)} and change the sign.",f"Slope = {fm(p)}."],show=fm(p),b=.1)
def lin5():
    m=nz(-5,5);xi=ri(-6,6);b=-m*xi
    return NUM('lin',2,'lin5',f"Find the x-intercept of y = {m}x {sg(b)}.",xi,["The x-intercept is where y = 0.",f"0 = {m}x {sg(b)}, so {m}x = {-b}.",f"x = {xi}."],b=.1)
def lin6():
    m=nz(-4,4);x1=ri(-4,4);y1=ri(-6,6);x=x1+nz(-4,4);y=y1+m*(x-x1)
    return NUM('lin',2,'lin6',f"A line through ({x1}, {y1}) has slope {m}. What is y when x = {x}?",y,[f"Slope {m} means y changes by {m} for each 1 step in x.",f"x changes by {x-x1}, so y changes by {m*(x-x1)}.",f"y = {y1} {sg(m*(x-x1))} = {y}."],b=.0)
# ---------------- sys
def sys1():
    x=ri(-5,6);y=ri(-6,8);a=nz(-4,4);c=nz(-4,4)
    while c==a:c=nz(-4,4)
    b=y-a*x;d=y-c*x
    return NUM('sys',2,'sys1',f"Solve the system and give x:  y = {a}x {sg(b)}  and  y = {c}x {sg(d)}",x,["Set the two expressions for y equal.",f"{a}x {sg(b)} = {c}x {sg(d)}, so {a-c}x = {d-b}.",f"x = {x}."],b=-.1)
def sys2():
    x=ri(-4,6);y=ri(-4,6);a,b,c,d=nz(1,4),nz(1,4),nz(1,4),nz(-4,-1)
    e=a*x+b*y;f=c*x+d*y
    return NUM('sys',2,'sys2',f"Solve:  {a}x + {b}y = {e}  and  {c}x − {-d}y = {f}.  What is x + y?",x+y,["Make the y-coefficients match, then add or subtract the equations.",f"Solving gives x = {x}.",f"Put x into the first equation: y = {y}.",f"x + y = {x+y}."],b=.4)
def sys3():
    k=R.choice(['parallel','same','one']);m=nz(-4,4);b=ri(-5,5)
    if k=='parallel':eqs=(f"y = {m}x {sg(b)}",f"y = {m}x {sg(b+nz(1,4))}");good='No solution'
    elif k=='same':eqs=(f"y = {m}x {sg(b)}",f"2y = {2*m}x {sg(2*b)}");good='Infinitely many solutions'
    else:eqs=(f"y = {m}x {sg(b)}",f"y = {m+nz(1,3)}x {sg(b+ri(-4,4))}");good='Exactly one solution'
    st={'parallel':["Both lines have the same slope but different y-intercepts.","Parallel lines never meet."],'same':["Divide the second equation by 2. It becomes the first equation.","The two lines are identical."],'one':["The slopes are different.","Lines with different slopes cross exactly once."]}[k]
    return MC('sys',2,'sys3'+k,f"How many solutions does this system have?  {eqs[0]}   and   {eqs[1]}",good,[x for x in ['No solution','Infinitely many solutions','Exactly one solution','Exactly two solutions'] if x!=good],st+[good+'.'],b=0.0)
def sys4():
    ad=ri(5,12);ch=ad-ri(2,4);na=ri(2,9);nc=ri(2,9);tot=ad*na+ch*nc;n=na+nc
    return NUM('sys',3,'sys4',f"Tickets cost ${ad} for adults and ${ch} for children. {n} tickets were sold for ${tot} in all. How many adult tickets were sold?",na,["Let a = adult tickets and c = child tickets.",f"a + c = {n} and {ad}a + {ch}c = {tot}.",f"Substitute c = {n} − a: {ad}a + {ch}({n} − a) = {tot}.",f"{ad-ch}a = {tot-ch*n}, so a = {na}."],b=1.0)
# ---------------- exp
def exp1():
    a,b=ri(2,9),ri(2,9)
    return NUM('exp',1,'exp1',f"x^{a} · x^{b} = x^n. What is n?",a+b,["Multiplying powers with the same base: add the exponents.",f"n = {a} + {b} = {a+b}."],b=-1.2)
def exp2():
    a,b,c=ri(2,5),ri(2,4),ri(1,6)
    return NUM('exp',2,'exp2',f"(x^{a})^{b} ÷ x^{c} = x^n. What is n?",a*b-c,["Power of a power: multiply the exponents.",f"{a} × {b} = {a*b}, so the top is x^{a*b}.",f"Dividing powers: subtract. n = {a*b} − {c} = {a*b-c}."],b=.1)
def exp3():
    k=R.choice(['neg','zero','frac'])
    if k=='neg':
        b,e=ri(2,5),ri(1,3);return NUM('exp',2,'exp3a',f"Evaluate {b}^(−{e}). Fraction or decimal.",1/b**e,["A negative exponent means reciprocal.",f"{b}^(−{e}) = 1/{b}^{e} = 1/{b**e}."],tol=0.02,show=f"1/{b**e}",b=0.0)
    if k=='zero':
        b=ri(2,9);return NUM('exp',1,'exp3b',f"Evaluate (−{b})⁰ + {b}⁰.",2,["Any nonzero number to the 0 power is 1.","1 + 1 = 2."],b=-.9)
    b=R.choice([4,9,16,25,36,49,64]);return NUM('exp',3,'exp3c',f"Evaluate {b}^(1/2).",math.sqrt(b),["An exponent of 1/2 means square root.",f"√{b} = {int(math.sqrt(b))}."],b=.5)
def exp4():
    a,b=nz(-8,8),nz(-8,8)
    return NUM('exp',2,'exp4',f"When (x {sg(a)})(x {sg(b)}) is multiplied out, what is the coefficient of x?",a+b,["FOIL: x·x, x·b, a·x, a·b.",f"The x terms are {b}x and {a}x.",f"Coefficient = {a} + ({b}) = {a+b}."],b=-.1)
def exp5():
    a,b=ri(2,9),ri(2,9);e1,e2=ri(2,6),ri(2,5);m=a*b;e=e1+e2
    while m>=10:m/=10;e+=1
    return NUM('exp',3,'exp5',f"Compute ({a}×10^{e1})({b}×10^{e2}) and write it as c×10^n with 1 ≤ c < 10. What is c?",round(m,2),[f"Multiply the numbers: {a}×{b} = {a*b}.",f"Add the exponents: {e1}+{e2} = {e1+e2}.",f"{a*b}×10^{e1+e2} = {fm(round(m,2))}×10^{e}."],b=1.0,tol=0.01)
def exp6():
    a,b,c=nz(-3,5),nz(-6,6),ri(-5,8);x=ri(-3,4)
    return NUM('exp',1,'exp6',f"Evaluate {a}x² {sg(b)}x {sg(c)} when x = {x}.",a*x*x+b*x+c,[f"Square first: x² = {x*x}.",f"{a}({x*x}) {sg(b*x)} {sg(c)}.",f"= {a*x*x+b*x+c}."],b=-.8)
# ---------------- fac
def fac1():
    p,q=ri(-8,8),ri(-8,8)
    if p==q or p==0 or q==0:return False
    return NUM('fac',2,'fac1',f"x² {sg(p+q)}x {sg(p*q)} = (x + a)(x + b). What is the larger of a and b?",max(p,q),[f"Find two numbers with product {p*q} and sum {p+q}.",f"They are {p} and {q}, so the factors are (x {sg(p)})(x {sg(q)}).",f"The larger of a and b is {max(p,q)}."],b=.0)
def fac2():
    r1,r2=ri(-7,7),ri(-7,7)
    if r1==r2 or 0 in(r1,r2):return False
    return NUM('fac',2,'fac2',f"Solve x² {sg(-(r1+r2))}x {sg(r1*r2)} = 0. Give the larger solution.",max(r1,r2),[f"Factor: (x {sg(-r1)})(x {sg(-r2)}) = 0.",f"Set each factor to 0: x = {r1} or x = {r2}.",f"The larger solution is {max(r1,r2)}."],b=.0)
def fac3():
    n=ri(2,13)
    return NUM('fac',1,'fac3',f"x² − {n*n} = 0. What is the positive solution?",n,[f"Difference of squares: x² − {n*n} = (x − {n})(x + {n}).",f"x = {n} or x = −{n}.",f"The positive solution is {n}."],b=-.9)
def fac4():
    a,b,c=nz(1,4),ri(-9,9),ri(-9,9);D=b*b-4*a*c
    return NUM('fac',2,'fac4',f"Find the discriminant b² − 4ac of {a}x² {sg(b)}x {sg(c)} = 0.",D,[f"Identify a = {a}, b = {b}, c = {c}.",f"b² − 4ac = {b*b} − {4*a*c}.",f"= {D}."],b=-.2)
def fac5():
    a,b=nz(1,4),2*nz(-5,5);c=ri(-6,6)
    return NUM('fac',2,'fac5',f"What is the x-coordinate of the vertex of y = {a}x² {sg(b)}x {sg(c)}?",-b/(2*a),["Vertex x = −b/(2a).",f"= −({b})/(2·{a}) = {-b}/{2*a}.",f"x = {fm(Fr(-b,2*a))}."],show=fm(Fr(-b,2*a)),b=.0)
def fac6():
    g=ri(2,9);a,b=ri(1,6),ri(1,6)
    if math.gcd(a,b)!=1:return False
    return NUM('fac',1,'fac6',f"What is the greatest common factor of {g*a}x and {g*b}?",g,["List what both terms share.",f"{g*a}x = {g}·{a}x and {g*b} = {g}·{b}.",f"GCF = {g}."],b=-.8)
def fac7():
    a=nz(2,3);r1,r2=ri(-5,5),ri(-5,5)
    if r1==r2 or 0 in(r1,r2):return False
    b=-a*(r1+r2);c=a*r1*r2
    return NUM('fac',3,'fac7',f"The roots of {a}x² {sg(b)}x {sg(c)} = 0 are r and s. What is r + s?",r1+r2,["For ax² + bx + c = 0, the sum of the roots is −b/a.",f"−({b})/{a} = {r1+r2}."],b=.8)
# ---------------- rad
def rad1():
    k=ri(2,9);n=R.choice([2,3,5,6,7])
    return NUM('rad',1,'rad1',f"√{k*k*n} simplifies to a√{n}. What is a?",k,[f"Pull out the perfect square: {k*k*n} = {k*k} × {n}.",f"√{k*k} = {k}.",f"a = {k}."],b=-.5)
def rad2():
    n=R.choice([2,3,5,7]);a,b=nz(1,8),nz(1,8)
    return NUM('rad',2,'rad2',f"{a}√{n} {sg(b)}√{n} = c√{n}. What is c?",a+b,["Like radicals combine like like terms.",f"c = {a} + ({b}) = {a+b}."],b=-.1)
def rad3():
    n=R.choice([2,3,5,7,10]);k=ri(2,5)
    return NUM('rad',2,'rad3',f"√{n} · √{n*k*k} = ?",n*k,["Multiply under one root.",f"√{n}·√{n*k*k} = √{n*n*k*k}.",f"= {n}·{k} = {n*k}."],b=.4)
FAM={'eq':[eq1,eq2,eq3,eq4,eq5,eq6,eq7],'lin':[lin1,lin2,lin3,lin4,lin5,lin6],'sys':[sys1,sys2,sys3,sys4],'exp':[exp1,exp2,exp3,exp4,exp5,exp6],'fac':[fac1,fac2,fac3,fac4,fac5,fac6,fac7],'rad':[rad1,rad2,rad3]}
