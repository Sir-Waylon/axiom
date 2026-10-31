# -*- coding: utf-8 -*-
"""Apex 1: functions, quadratics and complex numbers, polynomials."""
from adv_h import *
import math
CARDS={
'fn':[
("Input and output","A function is a rule that turns every input into exactly one output, like a vending machine: press B4 and you always get the same snack.","f(x) = 2x + 3"),
("Function notation","f(x) is read “f of x”. It means: use the rule f on the number x. To find f(4), put 4 into the rule.","f(x) = 3x − 1, so f(4) = 11"),
("Tables, graphs and the vertical line test","A graph shows a function if no vertical line touches it twice. If one input had two outputs, the machine would be broken.",None),
("Domain and range","The domain is every input that is allowed. The range is every output you can get. You cannot divide by zero, and you cannot take the square root of a negative number in the real numbers.","1/(x − 3): x ≠ 3"),
("Composing functions","(f∘g)(x) means f(g(x)). Do g first, then feed its answer into f. The order matters.","f(x)=x+1, g(x)=2x: f(g(3)) = 7 but g(f(3)) = 8"),
("Inverse functions","An inverse undoes a function. If f(a) = b then f⁻¹(b) = a. To find it, swap input and output and solve.","f(f⁻¹(x)) = x"),
("Transformations","y = a·f(x − h) + k. h slides right, k slides up, a stretches (and flips if negative). Do stretches first, then shifts.","y = |x − 2| + 1: vertex (2, 1)"),
("Even and odd functions","Even: f(−x) = f(x), the graph is mirror-symmetric about the y-axis. Odd: f(−x) = −f(x), it looks the same after a half-turn about the origin.","x² is even, x³ is odd")],
'qd2':[
("Squares and square roots","A square with side s has area s². Going backwards, √(s²) = s. Every positive number has two square roots, one positive and one negative.","x² = 49 → x = 7 or x = −7"),
("Solving by factoring","If two numbers multiply to zero, one of them must be zero. So (x − p)(x − q) = 0 means x = p or x = q.","(x − 2)(x + 5) = 0 → 2, −5"),
("Vertex form","y = a(x − h)² + k has its turning point at (h, k). It opens up if a > 0 and down if a < 0.","y = (x − 3)² + 1: lowest point (3, 1)"),
("The quadratic formula","For ax² + bx + c = 0, x = (−b ± √(b² − 4ac)) / 2a. It always works.","x² − 5x + 6 = 0 → 2, 3"),
("The discriminant","D = b² − 4ac tells how many real roots: D > 0 two, D = 0 one, D < 0 none (two complex roots).","D = b² − 4ac"),
("Imaginary and complex numbers","Define i so that i² = −1. A complex number is a + bi. Add and multiply like algebra, then replace i² with −1.","(2 + 3i)(1 − i) = 5 + i"),
("Powers of i","The powers of i repeat every 4: i, −1, −i, 1. To find iⁿ, divide n by 4 and use the remainder.","i⁹ = i"),
("Roots and coefficients (Vieta)","For ax² + bx + c = 0 the roots add to −b/a and multiply to c/a, even when they are complex.","sum = −b/a, product = c/a")],
'pl':[
("Powers and terms","x³ means x · x · x. A term is a number times powers of x. A polynomial is a sum of terms. Its degree is the highest power.","3x⁴ + x − 7 has degree 4"),
("Adding and multiplying polynomials","Combine like terms to add. To multiply, give every term in the first factor a turn with every term in the second.","(x + 2)(x + 3) = x² + 5x + 6"),
("Evaluating and the remainder theorem","When you divide f(x) by (x − a), the remainder is f(a). So plugging in a number is a shortcut for division.","f(x) ÷ (x − 2) leaves f(2)"),
("The factor theorem","(x − a) is a factor of f(x) exactly when f(a) = 0. Roots and factors are the same information.","f(3) = 0 → (x − 3) divides f"),
("How many roots?","A polynomial of degree n has exactly n roots, counting repeats and complex roots. Odd degree always crosses the x-axis at least once.",None),
("End behavior","Far out, only the highest-degree term matters. Even degree: both ends go the same way. Odd degree: the ends go opposite ways. A negative leading coefficient flips the picture.",None),
("Rational root theorem","A rational root p/q (lowest terms) of an integer polynomial has p dividing the constant term and q dividing the leading coefficient.",None),
("Vieta for cubics","For x³ + bx² + cx + d the roots add to −b, pair-products add to c and all three multiply to −d.","roots r, s, t: r + s + t = −b")]}
def f1():
    a=rint(2,9);b=rint(1,9);x=rint(2,9)
    return NM('fn','F',f"A number machine multiplies by {a} and then adds {b}. What comes out when {x} goes in?",a*x+b,[f"Multiply: {a} × {x} = {a*x}.",f"Add {b}: {a*x} + {b} = {a*x+b}."])
def f2():
    a=rint(2,8);b=rint(1,9);x=rint(2,9);y=a*x+b
    return NM('fn','F',f"A machine multiplies by {a} and then adds {b}. The output is {y}. What was the input?",x,["Work backwards: undo the last step first.",f"Subtract {b}: {y} − {b} = {a*x}.",f"Divide by {a}: {a*x} ÷ {a} = {x}."])
def f3():
    a=rint(2,6);b=rint(0,5);n=rint(8,15)
    xs=[1,2,3,4];ys=[a*x+b for x in xs]
    return NM('fn','F',f"A table shows x = 1, 2, 3, 4 and y = {', '.join(map(str,ys))}. Following the same pattern, what is y when x = {n}?",a*n+b,[f"y goes up by {a} each time, so the rule is y = {a}x + {b}.",f"When x = {n}: {a}×{n} + {b} = {a*n+b}."])
def f4():
    xs=R.sample(range(1,9),3);ys=[rint(1,9) for _ in range(3)]
    bad=R.random()<.5
    if bad:xs[2]=xs[0];ys[2]=ys[0]+rint(1,3)
    pairs=', '.join(f"({x}, {y})" for x,y in zip(xs,ys))
    return SA('fn','F',f"Do the pairs {pairs} (input, output) describe a function? Answer yes or no.",['no' if bad else 'yes'],["A function gives each input exactly one output.",("The input "+str(xs[0])+" appears with two different outputs, so it is not a function.") if bad else "Every input appears once, so it is a function."])
def f5():
    a=rint(-6,6,);a=a or 3;b=rint(-9,9);x=rint(-5,5)
    return NM('fn','B',f"If f(x) = {lin(a,b)}, find f({x}).",a*x+b,[f"Replace x with {paren(x)}: {a}({paren(x)}) {sgn(b)}.",f"= {a*x+b}."])
def f6():
    a=rint(1,4)*pick([-1,1]);b=rint(-6,6);c=rint(-9,9);x=rint(-4,4)
    return NM('fn','B',f"If f(x) = {poly([a,b,c])}, find f({x}).",a*x*x+b*x+c,[f"Substitute x = {x}: {a}({paren(x)})² {sgn(b)}({paren(x)}) {sgn(c)}.",f"Square first: ({paren(x)})² = {x*x}.",f"Total = {a*x*x+b*x+c}."])
def f7():
    k=rint(-7,9)
    return NM('fn','B',f"The function f(x) = 1/(x {sgn(-k)}) is not defined for exactly one value of x. What is it?",k,["A fraction is undefined when its denominator is 0.",f"x {sgn(-k)} = 0 gives x = {k}."])
def f8():
    k=rint(-6,9)
    return NM('fn','B',f"What is the smallest x that can be put into f(x) = √(x {sgn(-k)})?",k,["The expression under a square root cannot be negative.",f"x {sgn(-k)} ≥ 0, so x ≥ {k}."])
def f9():
    a=rint(2,5);b=rint(-5,5);c=rint(2,5);d=rint(-5,5);x=rint(-3,4)
    g=c*x+d
    return NM('fn','B',f"Let f(x) = {lin(a,b)} and g(x) = {lin(c,d)}. Find f(g({x})).",a*g+b,[f"Do g first: g({x}) = {g}.",f"Then f({g}) = {a*g+b}."])
def f10():
    a=rint(2,6);b=rint(-8,8);x0=rint(-5,6);y=a*x0+b
    return NM('fn','B',f"Let f(x) = {lin(a,b)}. Find f⁻¹({y}), the input that gives output {y}.",x0,["Undo the rule: solve f(x) = "+str(y)+".",f"{a}x {sgn(b)} = {y}, so x = {x0}."])
def f11():
    h=rint(-6,6);k=rint(-6,6);a=pick([1,2,3,-1,-2])
    f=f"y = {'' if a==1 else ('−' if a==-1 else a)}|x {sgn(-h)}| {sgn(k)}"
    return NM('fn','C',f"Find the x-coordinate of the vertex of {f}.",h,["For y = a|x − h| + k the vertex is (h, k).",f"Here h = {h}."])
def f12():
    h=rint(-5,5);k=rint(-5,5)
    xs=list(range(-8,9));pts=[(x,abs(x-h)+k) for x in xs]
    return GR('fn','C',f"The graph shows y = |x {sgn(-h)}| {sgn(k)}. Tap its lowest point (the vertex).",'x','y',(-8,8),(min(k-1,-1),max(k+10,8)),[('y',pts)],(h,k),["The vertex is where the V turns.",f"For |x − h| + k the vertex is (h, k) = ({h}, {k})."],f"V-shaped graph with its lowest point at ({h}, {k})",tx=.5,ty=.7)
def f13():
    a=rint(1,3);c=rint(-6,6);b=rint(2,4);d=rint(-5,5);x=rint(-2,3)
    g=b*x+d
    return NM('fn','C',f"Let f(x) = x² {sgn(c)} and g(x) = {lin(b,d)}. Find f(g({x})).",g*g+c,[f"g({x}) = {g}.",f"f({g}) = {g}² {sgn(c)} = {g*g+c}."])
def f14():
    n=pick([2,3,4,5,6]);c=pick([0,0,2,-3,5])
    a=['even','odd']
    if n%2==0:ans='even' if True else ''
    else:ans='odd'
    if c!=0 and n%2==1:ans='neither'
    cs=[1]+[0]*(n-1)+[c]
    f=poly(cs)
    return SA('fn','C',f"Is f(x) = {f} even, odd, or neither?",[ans],[f"Compare f(−x) with f(x).",f"(−x){sup(n)} = {'x'+sup(n) if n%2==0 else '−x'+sup(n)}."+("" if c==0 else f" The constant {c} does not change sign, which breaks odd symmetry."),f"So f is {ans}."])
def f15():
    a=rint(2,9);b=rint(2,9);x=rint(2,9)
    return NM('fn','C',f"f is a one-to-one function with f({x}) = {a*x+b}. What is f⁻¹({a*x+b})?",x,["f⁻¹ undoes f.",f"Since f({x}) = {a*x+b}, f⁻¹({a*x+b}) = {x}."])
def f16():
    a1=rint(1,4);b1=rint(-4,6);x=rint(-5,6)
    g=(lambda x:2*x+1 if x<0 else x*x-3 if x<4 else 5)
    return NM('fn','C',f"A piecewise function is f(x) = 2x + 1 if x < 0; x² − 3 if 0 ≤ x < 4; 5 if x ≥ 4. Find f({x}).",g(x),[f"Check which rule applies to x = {x}.",f"f({x}) = {g(x)}."])
def f17():
    a=rint(2,5);b=rint(1,5);c=rint(1,5);x=rint(1,5)
    h=lambda t:a*t+b
    return NM('fn','M',f"Let f(x) = {lin(a,b)}. For what value of x does f(f(x)) = {h(h(x))}?",x,[f"f(f(x)) = {a}({lin(a,b)}) {sgn(b)} = {poly([a*a,a*b+b])}.",f"Solve {poly([a*a,a*b+b])} = {h(h(x))}.",f"x = {x}."])
def f18():
    p=rint(-4,4);q=rint(-4,4);a=pick([2,3,-1,-2]);h=rint(-4,4);k=rint(-4,4)
    return NM('fn','M',f"The point ({p}, {q}) is on y = f(x). The graph is transformed to y = {a}·f(x {sgn(-h)}) {sgn(k)}. What is the y-coordinate of the image of the point?",a*q+k,[f"The point moves to (x + {h}, {a}·y {sgn(k)}).",f"y-coordinate = {a}({q}) {sgn(k)} = {a*q+k}."])
def f19():
    a=rint(1,3);b=rint(-3,3);c=rint(-5,5);x1=rint(-3,0);x2=x1+rint(2,4)
    f=lambda x:a*x*x+b*x+c
    return NM('fn','M',f"For f(x) = {poly([a,b,c])}, find the average rate of change from x = {x1} to x = {x2}.",Fr(f(x2)-f(x1),x2-x1),[f"f({x2}) − f({x1}) = {f(x2)} − ({f(x1)}) = {f(x2)-f(x1)}.",f"Divide by {x2 - x1}: {num(Fr(f(x2)-f(x1),x2-x1))}."],tol=0.001)
def f20():
    k=rint(-5,6)
    return NM('fn','M',f"What is the smallest integer in the domain of f(x) = 1/√(x {sgn(-k)})?",k+1,[f"Need x {sgn(-k)} > 0 (not just ≥ 0, because the denominator cannot be 0).",f"So x > {k}; the smallest integer is {k+1}."])
def f21():
    x0=rint(1,6)
    return NM('fn','M',f"f(x) = 3x − 2 and g(x) = x² + 1. Find the positive x with f(g(x)) = {3*(x0*x0+1)-2}.",x0,["f(g(x)) = 3(x² + 1) − 2 = 3x² + 1.",f"3x² + 1 = {3*x0*x0+1}, so x² = {x0*x0}.",f"The positive solution is {x0}."])
def q1():
    n=rint(2,12)
    return NM('qd2','F',f"A square has side {n} cm. What is its area in square centimeters?",n*n,[f"Area = side × side = {n} × {n}.",f"= {n*n}."])
def q2():
    n=rint(3,15)
    return NM('qd2','F',f"What is the positive number x with x² = {n*n}?",n,[f"Find the number that multiplies by itself to give {n*n}.",f"{n} × {n} = {n*n}."])
def q3():
    n=rint(2,12)
    return NM('qd2','F',f"A square has area {n*n} square meters. How long is each side in meters?",n,["Side = √area.",f"√{n*n} = {n}."])
def q4():
    p=rint(-7,7,True);q=rint(-7,7,True)
    if p==q:q+=1
    return NM('qd2','B',f"Solve (x {sgn(-p)})(x {sgn(-q)}) = 0. What is the larger solution?",max(p,q),["Set each factor to 0.",f"x = {p} or x = {q}.",f"The larger is {max(p,q)}."])
def q5():
    h=rint(-6,6);k=rint(-9,9);a=pick([1,2,3])
    return NM('qd2','B',f"What is the minimum value of y = {'' if a==1 else a}(x {sgn(-h)})² {sgn(k)}?",k,["A squared term is never negative, so its smallest value is 0 (at x = h).",f"Then y = {k}."])
def q6():
    p=rint(1,9);q=rint(-9,9)
    return NM('qd2','B',f"Solve x² = {p*p}. What is the negative solution?",-p,[f"Both {p} and −{p} square to {p*p}.",f"The negative solution is −{p}."])
def q7():
    p=rint(-6,6);q=rint(-6,6)
    if p==q:q+=2
    b=-(p+q);c=p*q
    return NM('qd2','C',f"Use the quadratic formula to solve {poly([1,b,c])} = 0. What is the larger root?",max(p,q),[f"D = b² − 4ac = {b*b-4*c}.",f"x = ({-b} ± √{b*b-4*c}) / 2 = ({-b} ± {abs(p-q)}) / 2.",f"The larger root is {max(p,q)}."])
def q8():
    a=rint(1,4);b=rint(-8,8);c=rint(-8,8)
    return NM('qd2','C',f"Find the discriminant b² − 4ac of {poly([a,b,c])}.",b*b-4*a*c,[f"a = {a}, b = {b}, c = {c}.",f"b² − 4ac = {b*b} − {4*a*c} = {b*b-4*a*c}."])
def q9():
    a=rint(1,3);b=rint(-8,8);c=rint(-8,8);D=b*b-4*a*c
    ans='0' if D<0 else ('1' if D==0 else '2')
    return SA('qd2','C',f"How many real roots does {poly([a,b,c])} = 0 have? Answer 0, 1 or 2.",[ans],[f"D = {b}² − 4({a})({c}) = {D}.",{'0':'D < 0: no real roots.','1':'D = 0: one repeated root.','2':'D > 0: two real roots.'}[ans]])
def q10():
    a=rint(1,3);b=a*rint(-8,8);c=rint(-5,5)
    return NM('qd2','C',f"What is the x-coordinate of the vertex of y = {poly([a,b,c])}?",Fr(-b,2*a),["The vertex is at x = −b/(2a).",f"x = {-b}/{2*a} = {num(Fr(-b,2*a))}."])
def q11():
    a=rint(1,6);b=rint(1,6);c=rint(1,6);d=rint(1,6)
    return NM('qd2','C',f"Multiply ({a} + {b}i)({c} + {d}i). What is the real part of the product? (Use i² = −1.)",a*c-b*d,["Real part = ac − bd, because i² = −1.",f"= {a*c} − {b*d} = {a*c-b*d}."])
def q12():
    n=rint(5,60)
    r=n%4;ans=['1','i','−1','−i'][r]
    return SA('qd2','C',f"Simplify i{sup(n)}. (Answer 1, i, −1 or −i.)",[ans,ans.replace('−','-')],["The powers of i repeat in a cycle of 4: i, −1, −i, 1.",f"{n} ÷ 4 leaves remainder {r}.",f"i{sup(n)} = {ans}."])
def q13():
    a=rint(1,4);b=rint(1,6)
    return NM('qd2','C',f"The roots of {poly([a,-a*b,a*(b+1)])} = 0 (real or complex) add up to what?",b,["The sum of the roots is −b/a, even if they are complex.",f"−({-a*b})/{a} = {b}."])

def q15():
    p=rint(1,5)*2;k=p
    return NM('qd2','M',f"For what positive value of k does x² + kx + {(p//2)**2} = 0 have exactly one real solution?",p,[f"One real root means D = 0: k² − 4({(p//2)**2}) = 0.",f"k² = {p*p}, so k = {p}."])
def q16():
    s=rint(-6,8);p=rint(-8,12)
    return NM('qd2','M',f"The roots r and s of x² {sgn(-s)}x {sgn(p)} = 0 satisfy r + s = {s} and rs = {p}. Find r² + s².",s*s-2*p,["Use r² + s² = (r + s)² − 2rs.",f"= {s*s} − {2*p} = {s*s-2*p}."])
def q17():
    n=rint(40,400)
    r=n%4;ans=['1','i','−1','−i'][r]
    return SA('qd2','M',f"Evaluate i{n}. (Answer 1, i, −1 or −i.)",[ans,ans.replace('−','-')],[f"Only the remainder of {n} ÷ 4 matters.",f"{n} = 4·{n//4} + {r}.",f"i{n} = i{sup(r) if r else '⁰'} = {ans}."])
def q18():
    a=rint(1,7);b=rint(1,7)
    return NM('qd2','M',f"Find (a + bi)(a − bi) for a = {a}, b = {b}.",a*a+b*b,["A complex number times its conjugate is a² + b².",f"= {a*a} + {b*b} = {a*a+b*b}."])
def q19():
    k=rint(2,8)
    return NM('qd2','M',f"What is the smallest integer c for which x² − {2*k}x + c = 0 has no real roots?",k*k+1,[f"No real roots needs D < 0: {4*k*k} − 4c < 0.",f"c > {k*k}, so the smallest integer is {k*k+1}."])
def p1():
    n=rint(2,9)
    return NM('pl','F',f"Find the value of x³ when x = {n}.",n**3,[f"x³ means x × x × x.",f"{n} × {n} × {n} = {n**3}."])
def p2():
    a=rint(2,9);b=rint(2,9)
    return NM('pl','F',f"Simplify {a}x + {b}x by combining like terms. What is the coefficient of x?",a+b,["Like terms have the same variable part.",f"{a} + {b} = {a+b}."])
def p3():
    d=rint(2,7)
    return NM('pl','F',f"What is the degree of the polynomial 3x{sup(d)} + 5x − 2?",d,["The degree is the highest power of x.",f"The highest power is {d}."])
def p4():
    a=rint(1,6);b=rint(1,6)
    return NM('pl','B',f"Expand (x + {a})(x + {b}). What is the coefficient of x?",a+b,["Multiply every term by every term: x² + bx + ax + ab.",f"The x-terms add: {a} + {b} = {a+b}."])
def p5():
    a=rint(-6,6,True);b=rint(-6,6,True)
    return NM('pl','B',f"What is the constant term of (x {sgn(a)})(x {sgn(b)})?",a*b,["The constant term is the product of the two constants.",f"{paren(a)} × {paren(b)} = {a*b}."])
def p6():
    a=rint(1,3);b=rint(-5,5);c=rint(-5,5);d=rint(-9,9);x=rint(-2,3)
    return NM('pl','B',f"Evaluate {poly([a,b,c,d])} at x = {x}.",pv([a,b,c,d],x),[f"Substitute x = {x} into each term.",f"The value is {pv([a,b,c,d],x)}."])
def p7():
    a=rint(1,2);b=rint(-5,5);c=rint(-5,5);d=rint(-9,9);r=rint(-3,3)
    return NM('pl','C',f"What is the remainder when {poly([a,b,c,d])} is divided by (x {sgn(-r)})?",pv([a,b,c,d],r),["By the remainder theorem the remainder is f(r).",f"f({r}) = {pv([a,b,c,d],r)}."])
def p8():
    r1,r2,r3=R.sample(range(-4,5),3);cs=[1,-(r1+r2+r3),r1*r2+r1*r3+r2*r3,-r1*r2*r3]
    if R.random()<.5:
        x=r1;ans='yes'
    else:
        x=r1+pick([1,2,3]);ans='yes' if pv(cs,x)==0 else 'no'
    return SA('pl','C',f"Is (x {sgn(-x)}) a factor of {poly(cs)}? Answer yes or no.",[ans],[f"Compute f({x}) = {pv(cs,x)}.","The factor theorem: (x − a) is a factor exactly when f(a) = 0.",f"So the answer is {ans}."])
def p9():
    r1,r2,r3=R.sample(range(-5,6),3)
    return NM('pl','C',f"The roots of x³ + bx² + cx + d = 0 are {r1}, {r2} and {r3}. Find b.",-(r1+r2+r3),["The roots add to −b.",f"b = −({r1} + {r2} + {r3}) = {-(r1+r2+r3)}."])
def p10():
    n=rint(2,9);lead=pick([1,2,3,-1,-2,-3])
    ans=('rises' if lead>0 else 'falls')
    which=pick(['right','left'])
    if which=='left' and n%2==1:ans='falls' if lead>0 else 'rises'
    return SA('pl','C',f"For f(x) = {poly([lead]+[0]*(n-1)+[1])}, as x goes to the {'far right' if which=='right' else 'far left'}, does f(x) rise or fall (to +∞ or −∞)? Answer rises or falls.",[ans],["Only the highest-degree term matters far out.",f"{lead}x{sup(n)} has {'even' if n%2==0 else 'odd'} degree and {'positive' if lead>0 else 'negative'} leading coefficient.",f"The graph {ans} on that side."])
def p11():
    r1,r2,r3=R.sample(range(-4,5),3)
    return NM('pl','M',f"Expand (x {sgn(-r1)})(x {sgn(-r2)})(x {sgn(-r3)}). What is the coefficient of x?",r1*r2+r1*r3+r2*r3,["The x coefficient is the sum of pairwise products of the roots.",f"{r1*r2} + {r1*r3} + {r2*r3} = {r1*r2+r1*r3+r2*r3}."])
def p12():
    r=rint(-3,3,True);b=rint(-4,4);c=rint(-4,4)
    d=-(r**3+b*r*r+c*r)
    return NM('pl','M',f"f(x) = {poly([1,b,c,0])} + d, and (x {sgn(-r)}) is a factor of f. Find d.",d,[f"A factor (x − {r}) means f({r}) = 0.",f"{r}³ + {b}({r})² + {c}({r}) + d = 0, so {r**3+b*r*r+c*r} + d = 0.",f"d = {d}."])
def p13():
    n=rint(5,40)
    return NM('pl','M',f"What is the remainder when x^{n} is divided by (x − 1)?",1,["The remainder is f(1) = 1ⁿ.","1 raised to any power is 1."])
def p14():
    a=rint(2,4);r=rint(1,4)
    return NM('pl','M',f"A cubic with leading coefficient 1 has roots {r}, {r} and {-r}. What is the sum of its roots?",r,["The sum of the roots counts the repeated root twice.",f"{r} + {r} + ({-r}) = {r}."])

FAMS=[f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f11,f12,f13,f14,f15,f16,f17,f18,f19,f20,f21,q1,q2,q3,q4,q5,q6,q7,q8,q9,q10,q11,q12,q13,q15,q16,q17,q18,q19,p1,p2,p3,p4,p5,p6,p7,p8,p9,p10,p11,p12,p13,p14]
def run(n=14):
    for f in FAMS:gen.rep(f,n)
