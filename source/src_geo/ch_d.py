# -*- coding: utf-8 -*-
# Chapter D: qdr (Algebra 1 -> Algebra 2 bridge) + extra conceptual items for eq/lin/sys/exp/fac/rad + cards/gloss/notes/written
from gen import *
import gen

def ri(a,b):return R.randint(a,b)
def nz(a,b):
    x=0
    while x==0:x=R.randint(a,b)
    return x
def N(k):
    if isinstance(k,Fr):return fm(k).replace('-','−')
    return f"−{-k}" if k<0 else str(k)
SUP={2:'²',3:'³',4:'⁴'}
def P(cs,v='x'):
    d=len(cs)-1;s=''
    for i,c in enumerate(cs):
        p=d-i
        if c==0:continue
        a=abs(c)
        body=('' if (a==1 and p>0) else str(a))+('' if p==0 else v+(SUP.get(p,'') if p>1 else ''))
        if not s:s=('−' if c<0 else '')+body
        else:s+=(' − ' if c<0 else ' + ')+body
    return s or '0'
def fr(a,b):return fm(Fr(a,b)).replace('-','−')

# ---------- graph helpers
def _plot(f,rng=6,sz=240,dots=()):
    s=grid_svg([],rng=rng,sz=sz);c=sz/2;k=(sz-30)/(2*rng)
    X=lambda x:c+x*k;Y=lambda y:c-y*k
    pts=[];x=-rng
    while x<=rng+1e-9:
        y=f(x)
        if abs(y)<=rng+0.3:pts.append(f"{X(x):.1f},{Y(y):.1f}")
        x+=0.1
    body=f'<polyline points="{" ".join(pts)}" stroke="#111" stroke-width="2.4"/>'
    for (px,py) in dots:body+=f'<circle cx="{X(px):.1f}" cy="{Y(py):.1f}" r="4" fill="#111"/>'
    return s.replace('</svg>',body+'</svg>')
FN='fghpqrst'
def vf(a,h,k):
    inner=f"(x {sg(-h)})"
    return f"y = {'−' if a<0 else ''}{inner}² {sg(k)}".replace('- ','− ')

# ---------- level 1
def a_f1(i):
    a=nz(-6,7);b=nz(-9,9);k=ri(-5,6)
    return NUM('qdr',1,'qf1',f"Let f(x) = {P([a,b])}. Find f({N(k)}).",a*k+b,[f"Replace x with {N(k)}: {a}({N(k)}) {sg(b)}.",f"= {a*k} {sg(b)}.",f"f({N(k)}) = {a*k+b}."],b=-1.3)
def a_f2(i):
    a=R.choice([1,1,2,-1]);b=nz(-6,6);c=nz(-8,8);k=-ri(1,4)
    v=a*k*k+b*k+c
    return NUM('qdr',1,'qf2',f"Let g(x) = {P([a,b,c])}. Find g({N(k)}).",v,[f"Square first: ({N(k)})² = {k*k}.",f"{a}({k*k}) {sg(b*k)} {sg(c)}.",f"g({N(k)}) = {v}."],b=-.6)
def a_mean(i):
    m=ri(60,95);d=[ri(-12,12) for _ in range(4)];d.append(-sum(d));v=[m+x for x in d];R.shuffle(v)
    assert sum(v)/5==m
    return NUM('qdr',1,'qmean',f"Find the mean of these quiz scores: {', '.join(map(str,v))}.",m,[f"Add them: {sum(v)}.",f"Divide by how many there are (5): {sum(v)}/5.",f"Mean = {m}."],b=-1.2)
def a_med(i):
    v=R.sample(range(3,60),5);med=sorted(v)[2]
    return NUM('qdr',1,'qmed',f"Find the median of {', '.join(map(str,v))}.",med,["Put the numbers in order: "+', '.join(map(str,sorted(v)))+".","The median is the middle one.",f"Median = {med}."],b=-1.0)
def a_prob(i):
    r,bl,g=ri(2,8),ri(2,8),ri(1,6);n=r+bl+g;nm=R.choice(['red','blue','green']);cnt={'red':r,'blue':bl,'green':g}[nm]
    return NUM('qdr',1,'qprob',f"A bag has {r} red, {bl} blue, and {g} green marbles. One is picked at random. What is the probability it is {nm}? Fraction or decimal.",cnt/n,[f"Total marbles: {n}.",f"Favorable ({nm}): {cnt}.",f"P = {cnt}/{n} = {fr(cnt,n)}."],tol=0.006,show=fr(cnt,n),b=-.9)
def a_cnt(i):
    a,b,c=ri(2,6),ri(2,5),ri(2,4)
    return NUM('qdr',1,'qcnt',f"You can pick from {a} shirts, {b} pants, and {c} pairs of shoes. How many different outfits are possible?",a*b*c,["Multiply the number of choices for each item.",f"{a} × {b} × {c} = {a*b*c}."],b=-.8)
def a_arith(i):
    a=ri(-5,12);d=nz(-6,7);t=[a+d*j for j in range(4)]
    return NUM('qdr',1,'qarith',f"What comes next? {', '.join(N(x) for x in t)}, …",a+4*d,[f"Subtract neighbors: the common difference is {d}.",f"Add {d} to the last term: {t[-1]} {sg(d)}.",f"Next term = {a+4*d}."],b=-1.0)
def a_dir(i):
    k=nz(2,9);x1=ri(2,6);x2=ri(7,12)
    return NUM('qdr',1,'qdir',f"y varies directly with x. When x = {x1}, y = {k*x1}. What is y when x = {x2}?",k*x2,["Direct variation: y = kx.",f"k = {k*x1}/{x1} = {k}.",f"y = {k}({x2}) = {k*x2}."],b=-.5)
def a_abs(i,b=None):
    a=ri(-6,6)
    if b is None:b=ri(2,9)
    n=2 if b>0 else (1 if b==0 else 0)
    ex={2:"A positive amount gives two values: x − a = b or x − a = −b.",1:"Zero has only one value, so there is one solution.",0:"Absolute value is never negative, so no number works."}[n]
    return MC('qdr',1,'qabs',f"How many solutions does |x {sg(-a)}| = {N(b)} have?",{2:'Two',1:'One',0:'None'}[n],[x for x in ['Two','One','None','Infinitely many'] if x!={2:'Two',1:'One',0:'None'}[n]],[ex],b=-.6)
def a_yint(i):
    a=R.choice([1,2,-1,3]);b=nz(-7,7);c=nz(-9,9)
    return NUM('qdr',1,'qyint',f"What is the y-intercept of y = {P([a,b,c])}?",c,["The y-intercept is where x = 0.",f"Every term with x vanishes, leaving {c}.",f"y-intercept = {c}."],b=-1.1)
def a_gvert(i):
    a=R.choice([1,-1]);h=ri(-3,3);k=ri(-4,4)
    f=lambda x:a*(x-h)**2+k
    return NUM('qdr',1,'qgv',f"The graph of {FN[i%8]}(x) is a parabola. What is the y-coordinate of its vertex?",k,["The vertex is the turning point of the curve.","Read its height on the y-axis (each grid square is 1).",f"y = {k}."],svg=_plot(f),b=-.4)
def a_gline(i):
    m=R.choice([1,2,-1,-2,3,-3,Fr(1,2),Fr(-1,2)]);x0=ri(-2,1);y0=ri(-2,2)
    dx=2 if isinstance(m,Fr) else 1;x1=x0+dx;y1=y0+m*dx
    x1=x0+dx*2 if abs(y1)>5 else x1
    f=lambda x:y0+m*(x-x0);x1=x0+dx;y1=f(x1)
    return NUM('qdr',1,'qgl',f"The line {FN[i%8]}(x) passes through the two dots. What is its slope? Fractions are fine.",float(m),["Count the rise (up or down) between the dots.","Count the run (steps to the right).",f"Slope = rise/run = {fm(m)}."],show=fm(m),svg=_plot(f,dots=[(x0,y0),(x1,y1)]),b=-.7)
def a_gnum(i):
    a=R.choice([1,-1]);h=ri(-3,3);k=R.choice([-3,-2,-1,0,1,2,3])
    f=lambda x:a*(x-h)**2+k
    n=0 if (a>0 and k>0) or (a<0 and k<0) else (1 if k==0 else 2)
    g={0:'0',1:'1',2:'2'}[n]
    ex={0:"The vertex is above the x-axis and the curve opens up (or below and opens down), so it never touches the axis.",1:"The vertex sits right on the x-axis, so it touches once.",2:"The vertex is on one side of the x-axis and the curve opens toward it, so it crosses twice."}[n]
    return MC('qdr',1,'qgn',f"How many times does the parabola {FN[i%8]}(x) cross or touch the x-axis?",g,[x for x in ['0','1','2','3'] if x!=g],["Look at where the curve meets the horizontal axis.",ex],svg=_plot(f),b=-.3)

# ---------- level 2
def b_vy(i):
    a=R.choice([1,2,-1,-2,3]);h=ri(-4,4);k=ri(-8,8)
    cs=[a,-2*a*h,a*h*h+k]
    return NUM('qdr',2,'qvy',f"What is the y-coordinate of the vertex of y = {P(cs)}?",k,[f"Vertex x = −b/(2a) = {-cs[1]}/{2*a} = {h}.",f"Plug in: {a}({h*h}) {sg(cs[1]*h)} {sg(cs[2])}.",f"y = {k}."],b=.1)
def b_zero(i):
    a=R.choice([1,1,2,3,-1,-2]);r1,r2=R.sample([x for x in range(-8,9) if x],2)
    cs=[a,-a*(r1+r2),a*r1*r2];lo=min(r1,r2)
    assert a*lo*lo+cs[1]*lo+cs[2]==0
    return NUM('qdr',2,'qzero',f"Find the smaller zero of f(x) = {P(cs)}.",lo,[f"Set f(x) = 0 and factor out {a} if needed: {a}(x {sg(-r1)})(x {sg(-r2)}) = 0." if a!=1 else f"Factor: (x {sg(-r1)})(x {sg(-r2)}) = 0.",f"Zeros: x = {r1} and x = {r2}.",f"Smaller zero = {lo}."],b=.1)
def b_qf(i):
    p,r=R.choice([(2,1),(2,3),(3,1),(2,2),(3,2)]);q=nz(-5,5);s=nz(-5,5)
    if p*s==q*r:return False
    a,b,c=p*r,p*s+q*r,q*s;D=b*b-4*a*c;rt=int(round(D**.5));assert rt*rt==D
    r1=Fr(-q,p);r2=Fr(-s,r);big=max(r1,r2)
    assert a*big*big+b*big+c==0
    return NUM('qdr',2,'qqf',f"Use the quadratic formula on {P([a,b,c])} = 0. What is the larger solution? Fraction or decimal.",float(big),[f"a = {a}, b = {b}, c = {c}. Discriminant: {b*b} − {4*a*c} = {D}, and √{D} = {rt}.",f"x = ({N(-b)} ± {rt})/{2*a}.",f"Larger solution = {fm(big)}."],tol=0.01,show=fm(big),b=.4)
def b_disc(i,cls=None):
    cls=cls if cls is not None else i%3
    if cls==0:
        a=ri(1,3);r=ri(-4,4);cs=[a,-2*a*r,a*r*r]
    elif cls==1:
        a=R.choice([1,2,-1]);b=ri(-6,6);c=ri(-6,6)
        while b*b-4*a*c<=0:b=ri(-8,8);c=ri(-6,6);a=R.choice([1,2,-1,-2,3])
        cs=[a,b,c]
    else:
        a=R.choice([1,2,3,-1,-2]);b=ri(-4,4);c=(b*b)//(4*a)+ri(1,4)*(1 if a>0 else -1)
        if b*b-4*a*c>=0:return False
        cs=[a,b,c]
    a,b,c=cs;D=b*b-4*a*c;g='Two' if D>0 else ('One' if D==0 else 'None')
    ex={'Two':"Positive discriminant: two different real solutions.",'One':"Zero discriminant: exactly one real solution.",'None':"Negative discriminant: no real solutions."}[g]
    return MC('qdr',2,'qdisc',f"How many real solutions does {P(cs)} = 0 have?",g,[x for x in ['Two','One','None','Three'] if x!=g],[f"Discriminant = b² − 4ac = {b*b} − {4*a*c} = {D}.",ex],b=0.0)
def b_abs(i):
    a=ri(2,5);j=nz(-4,4);t=ri(2,7);b=a*j;c=a*t
    lo,hi=-t-j,t-j
    assert abs(a*hi+b)==c and abs(a*lo+b)==c
    return NUM('qdr',2,'qabs2',f"Solve |{P([a,b])}| = {c}. What is the larger solution?",hi,[f"Two cases: {P([a,b])} = {c} or {P([a,b])} = {-c}.",f"First: {a}x = {c-b}, so x = {hi}. Second: {a}x = {-c-b}, so x = {lo}.",f"Larger solution = {hi}."],b=.3)
def b_comp(i):
    m=ri(2,4);n=nz(-6,6);lo=ri(-5,3);hi=lo+ri(3,7)
    cnt=sum(1 for x in range(-60,60) if m*lo+n<m*x+n<=m*hi+n);assert cnt==hi-lo
    return NUM('qdr',2,'qcomp',f"How many integers x satisfy {N(m*lo+n)} < {P([m,n])} ≤ {N(m*hi+n)}?",cnt,[f"Subtract {n} from all three parts: {m*lo} < {m}x ≤ {m*hi}." if n>0 else f"Add {-n} to all three parts: {m*lo} < {m}x ≤ {m*hi}.",f"Divide by {m}: {lo} < x ≤ {hi}.",f"The integers are {lo+1} through {hi}: {cnt} of them."],b=.2)
def b_rat(i):
    r=ri(2,8);s=nz(-7,7)
    while s==r:s=nz(-7,7)
    if i%3==0:
        return MC('qdr',2,'qrat1',f"Simplify (x² − {r*r})/(x − {r}), where x ≠ {r}.",f"x + {r}",[f"x − {r}",f"x² + {r}",f"{r}"],[f"Difference of squares: x² − {r*r} = (x − {r})(x + {r}).","Cancel the common factor (x − r).",f"Result: x + {r}."],b=.0)
    if i%3==1:
        top=P([1,-(r+s),r*s])
        return MC('qdr',2,'qrat2',f"Simplify ({top})/(x − {r}), where x ≠ {r}.",f"x {sg(-s)}",[f"x {sg(s)}",f"x − {r}",f"({top})/{r}"],[f"Factor the top: (x − {r})(x {sg(-s)}).","Cancel (x − r) from top and bottom.",f"Result: x {sg(-s)}."],b=.1)
    b=r
    return MC('qdr',2,'qrat3',f"Simplify (x² + {b}x)/x², where x ≠ 0.",f"(x + {b})/x",[f"{b}",f"(x + {b})/x²",f"x + {b}"],["Factor the top: x(x + b).","Cancel ONE x from top and bottom (not the whole thing).",f"Result: (x + {b})/x."],b=.1)
def b_inv(i):
    x1=R.choice([2,3,4,6,8,12]);y1=ri(3,10);k=x1*y1;ds=[d for d in range(1,k+1) if k%d==0 and d!=x1 and d<=24];x2=R.choice(ds)
    return NUM('qdr',2,'qinv',f"y varies inversely with x. When x = {x1}, y = {y1}. What is y when x = {x2}?",k/x2,["Inverse variation: xy = k.",f"k = {x1} × {y1} = {k}.",f"y = {k}/{x2} = {fm(Fr(k,x2))}."],show=fm(Fr(k,x2)),tol=.01,b=.2)
def b_grow(i):
    k=i%3
    if k==0:
        n0=ri(2,9)*10;t=ri(3,6);return NUM('qdr',2,'qgrow',f"A culture starts with {n0} bacteria and doubles every hour. How many bacteria are there after {t} hours?",n0*2**t,[f"Each hour multiplies by 2: {n0} × 2^{t}.",f"2^{t} = {2**t}.",f"{n0} × {2**t} = {n0*2**t}."],b=.1)
    if k==1:
        m=R.choice([80,160,240,320]);hl=R.choice([4,5,6]);n=ri(2,4);return NUM('qdr',2,'qhalf',f"A sample has {m} g of a substance. Its mass halves every {hl} days. How many grams remain after {hl*n} days?",m/2**n,[f"{hl*n} days is {n} half-lives.",f"Halve {n} times: {m} ÷ 2^{n} = {m} ÷ {2**n}.",f"{fm(Fr(m,2**n))} g."],show=fm(Fr(m,2**n)),tol=.01,b=.2)
    p=R.choice([500,800,1000,2000]);r=R.choice([10,20]);n=ri(2,3);v=p*(1+r/100)**n
    return NUM('qdr',2,'qpct',f"A town of {p} people grows {r}% each year. How many people are there after {n} years?",round(v),[f"Growth factor: 1 + {r}% = {1+r/100:g}.",f"{p} × {1+r/100:g}^{n}.",f"= {round(v)}."],tol=.6,b=.3)
def b_geo(i):
    a=ri(1,6);r=R.choice([2,3,-2,-3,2,3]);n=ri(4,6)
    return NUM('qdr',2,'qgeo',f"A geometric sequence has first term {a} and common ratio {r}. What is the term number {n}?",a*r**(n-1),[f"aₙ = a₁·r^(n−1) = {a}·({r})^{n-1}.",f"({r})^{n-1} = {r**(n-1)}.",f"{a} × {r**(n-1)} = {a*r**(n-1)}."],b=.2)
def b_ari(i):
    a=ri(-5,12);d=nz(-5,7);n=R.choice([12,15,20,25])
    return NUM('qdr',2,'qari',f"An arithmetic sequence starts {N(a)}, {N(a+d)}, {N(a+2*d)}, … What is the term number {n}?",a+(n-1)*d,[f"Common difference d = {d}.",f"aₙ = a₁ + (n − 1)d = {a} + {n-1}({d}).",f"= {a+(n-1)*d}."],b=.1)
def b_dom(i):
    a=ri(1,9)
    t=i%3
    if t==0:return MC('qdr',2,'qdom1',f"What is the domain of f(x) = √(x − {a})?",f"x ≥ {a}",[f"x ≤ {a}",f"x > {a}","All real numbers"],["The expression under √ cannot be negative.",f"x − {a} ≥ 0, so x ≥ {a}."],b=.2)
    if t==1:return MC('qdr',2,'qdom2',f"What is the domain of g(x) = 1/(x − {a})?",f"All real numbers except {a}",["All real numbers",f"x > {a}",f"All real numbers except 0"],["You cannot divide by zero.",f"x − {a} = 0 when x = {a}, so that input is not allowed."],b=.1)
    return MC('qdr',2,'qdom3',f"What is the domain of h(x) = √({a} − x)?",f"x ≤ {a}",[f"x ≥ {a}",f"x < {a}","All real numbers"],["The expression under √ cannot be negative.",f"{a} − x ≥ 0, so x ≤ {a}."],b=.3)
def b_geq(i):
    a=R.choice([1,-1]);h=R.choice([x for x in range(-3,4) if x]);k=R.choice([x for x in range(-4,5) if x])
    f=lambda x:a*(x-h)**2+k
    good=vf(a,h,k);bad=[vf(a,-h,k),vf(a,h,-k),vf(-a,h,k)]
    return MC('qdr',2,'qgeq',f"Which equation matches the graph of {FN[i%8]}(x)?",good,bad,["Find the vertex (h, k) and whether the curve opens up or down.",f"Vertex ({N(h)}, {N(k)}). Vertex form: y = a(x − h)² + k.",f"{'Opens down, so a = −1.' if a<0 else 'Opens up, so a = 1.'} {good}."],svg=_plot(f),b=.4)
def b_perm(i):
    n=ri(5,9);k=ri(2,3);v=math.perm(n,k)
    return NUM('qdr',2,'qperm',f"{n} runners race. How many different ways can the 1st, 2nd{' and 3rd' if k==3 else ''} place finishers turn out?",v,[f"{n} choices for 1st, then {n-1} for 2nd"+(f", then {n-2} for 3rd." if k==3 else "."),f"Multiply: {' × '.join(str(n-j) for j in range(k))}.",f"= {v}."],b=.2)
def b_ind(i):
    k=ri(2,4);v=Fr(6-k,12)
    return NUM('qdr',2,'qind',f"A fair coin is flipped and a fair die is rolled. What is the probability of heads AND a number greater than {k}? Fraction or decimal.",float(v),[f"P(heads) = 1/2. P(greater than {k}) = {6-k}/6.","Independent events: multiply.",f"1/2 × {6-k}/6 = {fr(6-k,12)}."],tol=.006,show=fr(6-k,12),b=.3)
def b_csq(i):
    h=ri(-6,6) or 3;c=ri(-9,12);b=2*h;k=c-h*h
    return NUM('qdr',2,'qcsq',f"Write {P([1,b,c])} as (x {sg(h)})² + k. What is k?",k,[f"Half of {b} is {h}, so (x {sg(h)})² = {P([1,b,h*h])}.",f"Compare the constant: {c} = {h*h} + k.",f"k = {k}."],b=.2)
def b_miss(i):
    n=4;m=ri(75,90);s=[ri(m-10,m+8) for _ in range(3)];last=m*n-sum(s)
    return NUM('qdr',2,'qmiss',f"The mean of 4 test scores is {m}. Three scores are {s[0]}, {s[1]}, {s[2]}. What is the fourth?",last,[f"Total needed: {m} × 4 = {m*4}.",f"Known total: {sum(s)}.",f"Fourth score = {m*4} − {sum(s)} = {last}."],b=.1)
def b_expeq(i):
    bs=R.choice([2,3,5]);c=ri(-3,4);n=ri(2,5);x=n-c
    return NUM('qdr',2,'qexpeq',f"Solve {bs}^(x {sg(c)}) = {bs**n}.",x,[f"Write {bs**n} as {bs}^{n}.","Same base, so the exponents are equal.",f"x {sg(c)} = {n}, so x = {x}."],b=.3)
def b_ycross(i):
    a=R.choice([1,2,3]);r=ri(1,5);s=ri(1,5)
    return NUM('qdr',2,'qsym',f"A parabola crosses the x-axis at x = {N(-r)} and x = {N(s)}. What is the x-coordinate of its vertex? Fraction or decimal.",(s-r)/2,["The vertex lies halfway between the x-intercepts (axis of symmetry).",f"({N(-r)} + {s})/2.",f"x = {fm(Fr(s-r,2))}."],show=fm(Fr(s-r,2)),tol=.01,b=.0)

# ---------- level 3
def c_irr(i):
    p=ri(1,6);n=R.choice([2,3,5,6,7,10,11]);c=p*p-n
    return NUM('qdr',3,'qirr',f"The solutions of {P([1,-2*p,c])} = 0 are {p} ± √n. What is n?",n,[f"Discriminant: ({-2*p})² − 4({c}) = {4*p*p-4*c}.",f"Solutions: x = ({2*p} ± √{4*p*p-4*c})/2.",f"√{4*n} = 2√{n}, so x = {p} ± √{n}. n = {n}."],b=.9)
def c_vf(i):
    a=R.choice([2,3,-1,-2,4]);h=ri(-3,3);k=ri(-9,9);cs=[a,-2*a*h,a*h*h+k]
    return NUM('qdr',3,'qvf',f"Write y = {P(cs)} in the form y = {a}(x − h)² + k. What is k?",k,[f"Factor {a} from the x-terms: {a}(x² {sg(-2*h)}x) {sg(cs[2])}.",f"Complete the square inside: {a}(x {sg(-h)})² − {a*h*h} {sg(cs[2])}." .replace('− -','− ').replace('- ','− '),f"k = {cs[2]-a*h*h}."],b=1.0)
def c_proj(i):
    v=R.choice([32,48,64,80,96]);h0=ri(2,8)*4
    mx=h0+v*v/64
    return NUM('qdr',3,'qproj',f"A ball's height in feet is h(t) = −16t² + {v}t + {h0}. What is its maximum height?",mx,[f"The peak is at the vertex: t = −{v}/(2·(−16)) = {fm(Fr(v,32))}.",f"h = −16({fm(Fr(v,32))})² + {v}({fm(Fr(v,32))}) + {h0}.",f"Maximum height = {fm(mx)} ft."],show=fm(mx),tol=.01,b=1.0)
def c_inv2(i):
    x1=R.choice([2,3,4]);y1=ri(2,9)*1;k=y1*x1*x1;xs=[d for d in (1,2,3,4,6,12) if k%(d*d)==0 and d!=x1] or [1]
    x2=R.choice(xs);return NUM('qdr',3,'qinv2',f"y varies inversely with the square of x. When x = {x1}, y = {y1}. What is y when x = {x2}?",k/x2**2,[f"y = k/x², so k = {y1} × {x1}² = {k}.",f"y = {k}/{x2}² = {k}/{x2*x2}.",f"y = {fm(Fr(k,x2*x2))}."],show=fm(Fr(k,x2*x2)),tol=.01,b=1.0)
def c_dbl(i):
    b0=ri(2,6)*50;g=R.choice([2,3,4]);n=ri(2,4)
    return NUM('qdr',3,'qdbl',f"A population of {b0} multiplies by {g} every 2 years. In how many years will it reach {b0*g**n}?",2*n,[f"Divide: {b0*g**n} ÷ {b0} = {g**n} = {g}^{n}.",f"It multiplies by {g} exactly {n} times.",f"{n} × 2 years = {2*n} years."],b=.7)
def c_comp(i):
    p=R.choice([2,5,1]);q=nz(-4,4);r=nz(-3,3);s=nz(-5,5);k=ri(-3,3)
    inner=r*k+s;v=inner*inner+p
    return NUM('qdr',3,'qcomp2',f"Let f(x) = x² + {p} and g(x) = {P([r,s])}. Find f(g({N(k)})).",v,[f"First g({N(k)}) = {r}({N(k)}) {sg(s)} = {inner}.",f"Then f({inner}) = {inner}² + {p}.",f"= {v}."],b=.8)
def c_sum(i):
    a=ri(-4,8);d=nz(2,6);n=ri(8,14);t=n*(2*a+(n-1)*d)//2
    return NUM('qdr',3,'qsum',f"What is the sum of the first {n} terms of the arithmetic sequence {N(a)}, {N(a+d)}, {N(a+2*d)}, …?",t,["Sum = n(a₁ + aₙ)/2.",f"aₙ = {a} + {n-1}({d}) = {a+(n-1)*d}.",f"{n}({a} + {a+(n-1)*d})/2 = {t}."],b=.9)
def c_ratv(i):
    r=ri(1,6);s=ri(-6,6);t=ri(1,6)
    while s==r or t==r or s==-t:r=ri(1,6);s=ri(-6,6);t=ri(1,6)
    k=ri(-5,5)
    while k in(r,-t):k=ri(-5,5)
    num=P([1,-(r+s),r*s]);den=P([1,t-r,-r*t]);v=Fr(k-s,k+t)
    assert (k-r)*(k-s)*(k+t)==(k-r)*(k+t)*(k-s)
    return NUM('qdr',3,'qratv',f"Simplify ({num})/({den}), then evaluate it at x = {N(k)}. Fraction or decimal.",float(v),[f"Factor top: (x {sg(-r)})(x {sg(-s)}). Factor bottom: (x {sg(-r)})(x {sg(t)}).","Cancel (x − "+str(r)+f"), leaving (x {sg(-s)})/(x {sg(t)}).",f"At x = {N(k)}: {N(k-s)}/{N(k+t)} = {fm(v)}."],tol=.01,show=fm(v),b=1.0)
def c_wo(i):
    r,b=ri(3,7),ri(3,7);n=r+b;v=Fr(r*(r-1),n*(n-1))
    return NUM('qdr',3,'qwo',f"A bag has {r} red and {b} blue marbles. Two are drawn without replacement. What is the probability both are red? Fraction or decimal.",float(v),[f"First red: {r}/{n}.",f"Second red (one fewer red, one fewer marble): {r-1}/{n-1}.",f"{r}/{n} × {r-1}/{n-1} = {fm(v)}."],tol=.006,show=fm(v),b=.8)
def c_k(i):
    b=2*nz(-5,5)
    return NUM('qdr',3,'qk',f"For what value of k does x² {sg(b)}x + k = 0 have exactly one solution?",b*b//4,["One solution means the discriminant is 0.",f"b² − 4ac = {b*b} − 4k = 0.",f"k = {b*b//4}."],b=1.0)
def c_gap(i):
    a=R.choice([1,2]);r1=ri(-6,-1);r2=ri(1,7);cs=[a,-a*(r1+r2),a*r1*r2]
    return NUM('qdr',3,'qgap',f"What is the distance between the x-intercepts of y = {P(cs)}?",r2-r1,[f"Factor: {a}(x {sg(-r1)})(x {sg(-r2)}) = 0." if a!=1 else f"Factor: (x {sg(-r1)})(x {sg(-r2)}) = 0.",f"Intercepts: x = {r1} and x = {r2}.",f"Distance = {r2} − ({r1}) = {r2-r1}."],b=.8)
def c_inv(i):
    a=nz(2,5);b=ri(-8,8);k=ri(-4,5);out=a*k+b
    return NUM('qdr',3,'qinvf',f"If f(x) = {P([a,b])}, what input x gives f(x) = {out}?",k,[f"Set {P([a,b])} = {out}.",f"{a}x = {out-b}.",f"x = {k}."],b=.6)

def X(t,l,fp,q,good,bad,sol,svg=None):
    return MC(t,l,fp,q,good,bad,sol,svg=svg)

# ---------- hand-written
def hand():
    # ===== qdr
    X('qdr',2,'qh1',"Data: 3, 5, 6, 7, 99. Which measure best describes a typical value?","Median","Mean|Range|Maximum".split('|'),["The 99 is an outlier that pulls the mean up.","The median (6) ignores extreme values.","So the median is the better 'typical' value."])
    X('qdr',1,'qh2',"The parabola y = −2x² + 8 opens which way?","Down, because a is negative",["Up, because 8 is positive","Up, because 2 is positive","Left, because of the minus sign"],["Look at the sign of a, the number in front of x².","a = −2 is negative.","Negative a opens down."])
    X('qdr',2,'qh3',"What is the axis of symmetry of y = x² − 6x + 5?","x = 3",["x = −3","x = 5","x = 6"],["x = −b/(2a) = −(−6)/2.","= 3.","Axis: x = 3."])
    X('qdr',1,'qh4',"Which situation is exponential?","A population triples each day",["A plant grows 2 cm each week","A taxi charges $3 per mile plus $4","A tank drains 5 L every minute"],["Exponential means multiplying by the same factor each step.","Tripling is repeated multiplication.","The others add the same amount each step (linear)."])
    X('qdr',1,'qh5',"f(3) = 7 means what?","When the input is 3, the output is 7",["f times 3 equals 7","The input is 7 and the output is 3","f is 4 more than 3"],["f(x) is function notation, not multiplication.","The number in parentheses is the input.","Input 3 gives output 7."])
    X('qdr',2,'qh6',"Which table shows inverse variation (xy stays constant)?","x = 2, 4, 8 and y = 12, 6, 3",["x = 2, 4, 8 and y = 3, 6, 12","x = 2, 4, 8 and y = 5, 7, 9","x = 2, 4, 8 and y = 12, 10, 8"],["Multiply each pair: 2·12 = 24, 4·6 = 24, 8·3 = 24.","The product is always 24.","That is inverse variation."])
    X('qdr',1,'qh7',"Which can NOT be a probability?","1.4",["0","1","3/4"],["Probabilities are between 0 and 1 (inclusive).","1.4 is more than 1.","So it cannot be a probability."])
    X('qdr',2,'qh8',"x² + 4x + 4 = 0 has how many real solutions?","One (a repeated solution)",["Two different solutions","None","Two solutions: 2 and −2"],["Discriminant: 16 − 16 = 0.","Zero discriminant: one repeated solution.","(x + 2)² = 0, so x = −2."])
    X('qdr',2,'qh9',"What is the range of f(x) = x²?","y ≥ 0",["All real numbers","y ≤ 0","y > 0"],["A squared number is never negative.","It can equal 0 (when x = 0).","Range: y ≥ 0."])
    X('qdr',3,'qh10',"If every score in a data set goes up by 5, what happens to the mean and the range?","Mean goes up by 5; range stays the same",["Both go up by 5","Mean stays the same; range goes up by 5","Both stay the same"],["Every value shifts by 5, so the average shifts by 5.","Max and min both shift by 5.","Their difference (range) is unchanged."])
    X('qdr',3,'qh11',"A student says (x + 3)(x − 3) = x² − 6x − 9. What is the correct product?","x² − 9",["x² + 6x − 9","x² − 6","x² + 9"],["Use FOIL: x² − 3x + 3x − 9.","The middle terms cancel.","Result: x² − 9."])
    X('qdr',2,'qh12',"For |x| = 7 a student says x = 7 only. What is missing?","x = −7 also works",["x = 0 also works","x = 49 also works","Nothing is missing"],["Absolute value is distance from 0.","Both 7 and −7 are 7 away from 0.","Solutions: x = 7 or x = −7."])
    # ===== eq
    X('eq',2,'xeq1',"The angles of a triangle measure x°, 2x°, and (3x + 12)°. What is x?","28",["30","32","14"],["Angles add to 180: x + 2x + 3x + 12 = 180.","6x = 168.","x = 28."])
    X('eq',2,'xeq2',"A rectangle's length is 3 more than twice its width. Its perimeter is 54. What is the width?","8",["9","19","10"],["Width w, length 2w + 3.","2w + 2(2w + 3) = 54, so 6w + 6 = 54.","w = 8 (the length is 19)."])
    X('eq',2,'xeq3',"Solve 3(x − 4) = 2x + 5.","x = 17",["x = 9","x = −7","x = 7"],["Distribute to every term: 3x − 12 = 2x + 5.","Subtract 2x: x − 12 = 5.","x = 17."])
    X('eq',1,'xeq4',"A student solves 2x + 6 = 14 like this: 2x = 20, x = 10. What went wrong?","Added 6 instead of subtracting 6 from both sides",["Divided by the wrong number","Should have multiplied by 2","Nothing; x = 10 is right"],["Undo +6 by subtracting 6.","2x = 8, so x = 4.","Check: 2(4) + 6 = 14."])
    X('eq',2,'xeq5',"Solve −2x > 8.","x < −4",["x > −4","x < 4","x > 4"],["Divide both sides by −2.","Dividing by a negative flips the sign.","x < −4."])
    X('eq',2,'xeq6',"How many solutions does 3(x + 2) = 3x + 5 have?","None",["One","Two","Infinitely many"],["Distribute: 3x + 6 = 3x + 5.","Subtract 3x: 6 = 5, which is false.","No value of x works."])
    X('eq',3,'xeq7',"An angle's supplement is 30° more than twice the angle. What is the angle?","50°",["60°","70°","110°"],["Angle x, supplement 180 − x.","180 − x = 2x + 30.","150 = 3x, so x = 50."])
    X('eq',3,'xeq8',"Solve A = ½(b₁ + b₂)h for h.","h = 2A/(b₁ + b₂)",["h = 2A − b₁ − b₂","h = A/(2(b₁ + b₂))","h = 2A/b₁ + b₂"],["Multiply both sides by 2: 2A = (b₁ + b₂)h.","Divide by the whole group (b₁ + b₂).","h = 2A/(b₁ + b₂)."])
    X('eq',2,'xeq9',"Three consecutive even integers add to 78. What is the smallest?","24",["26","22","25"],["Let them be x, x + 2, x + 4.","3x + 6 = 78, so 3x = 72.","x = 24."])
    # ===== lin
    X('lin',1,'xlin1',"A taxi's cost is C = 2.5m + 4, where m is miles. What does 2.5 mean?","The cost for each extra mile, in dollars",["The starting fee","The total number of miles","The cost of a 4-mile trip"],["In y = mx + b, m is the slope (rate of change).","C rises 2.5 for every 1 mile.","So 2.5 is dollars per mile."])
    X('lin',1,'xlin2',"A plant's height is h = 2w + 12 (cm, w weeks). What does 12 mean?","The height at week 0",["Growth each week","The number of weeks","The height at week 12"],["12 is the constant b, the y-intercept.","It is the value when w = 0.","Starting height: 12 cm."])
    X('lin',1,'xlin3',"What is the slope of the line y = 5?","0",["Undefined","5","1"],["y = 5 is a flat, horizontal line.","It never rises.","Slope = 0."])
    X('lin',2,'xlin4',"What is the slope of the vertical line x = 3?","Undefined",["0","3","1/3"],["Vertical lines have run = 0.","Dividing by 0 is not allowed.","Slope is undefined."])
    X('lin',2,'xlin5',"A line passes through (2, 5) and (6, 13). What is its slope?","2",["1/2","8","−2"],["Rise: 13 − 5 = 8. Run: 6 − 2 = 4.","Slope = rise ÷ run.","8/4 = 2."])
    X('lin',2,'xlin6',"What slope is perpendicular to y = −(2/3)x + 1?","3/2",["−3/2","2/3","−2/3"],["Flip the fraction: 3/2.","Change the sign: −(−) becomes +.","Perpendicular slope = 3/2."])
    X('lin',2,'xlin7',"Line A goes through (0, 0) and (2, 6). Line B is y = 2x + 5. Which is steeper?","A, because its slope 3 is bigger than 2",["B, because its intercept 5 is bigger","They are equally steep","B, because 5 > 3"],["Slope of A = 6/2 = 3.","Slope of B = 2.","Steepness depends on slope, not intercept."])
    X('lin',2,'xlin8',"Which line is parallel to y = 3x − 2 and passes through (0, 4)?","y = 3x + 4",["y = −3x + 4","y = (1/3)x + 4","y = 4x + 3"],["Parallel lines share the slope 3.","The y-intercept is 4.","y = 3x + 4."])
    X('lin',3,'xlin9',"What is the slope of 2x + 3y = 12?","−2/3",["2/3","−2","−3/2"],["Solve for y: 3y = −2x + 12.","y = (−2/3)x + 4.","Slope = −2/3."])
    X('lin',2,'xlin10',"Points (1, 2) and (4, 8) lie on a line. Which point is also on it?","(7, 14)",["(7, 11)","(7, 16)","(7, 12)"],["Slope = 6/3 = 2.","From (4, 8), going 3 right goes 6 up.","(7, 14)."])
    # ===== sys
    X('sys',1,'xsys1',"y = 2x + 3 and y = 2x − 1. How many solutions?","None",["One","Infinitely many","Two"],["Both have slope 2.","Different y-intercepts mean parallel lines.","Parallel lines never meet."])
    X('sys',2,'xsys2',"x + y = 4 and 2x + 2y = 8. How many solutions?","Infinitely many",["None","One","Two"],["Divide the second equation by 2.","It becomes x + y = 4.","Same line, so every point on it works."])
    X('sys',2,'xsys3',"A rectangle's length is 5 more than its width, and its perimeter is 50. What is the length?","15",["10","20","25"],["l = w + 5 and 2l + 2w = 50.","Substitute: 2(w + 5) + 2w = 50, so w = 10.","l = 15."])
    X('sys',1,'xsys4',"x + y = 7 and x − y = 1. What is x?","4",["3","6","8"],["Add the equations: 2x = 8.","x = 4.","Then y = 3."])
    X('sys',2,'xsys5',"2x + 3y = 12 and 4x − 3y = 6. What is x?","3",["2","6","18"],["The y terms are opposites: add the equations.","6x = 18.","x = 3."])
    X('sys',1,'xsys6',"The lines in a system cross at (2, 5). What does that tell you?","x = 2, y = 5 makes both equations true",["Only the first equation is true there","The lines are parallel","The slopes are 2 and 5"],["An intersection point lies on both lines.","So its coordinates satisfy both equations.","That is what a solution means."])
    X('sys',2,'xsys7',"Two angles are supplementary and one is 20° larger than the other. What is the larger angle?","100°",["80°","90°","110°"],["x + (x + 20) = 180.","2x = 160, x = 80.","Larger angle = 100°."])
    X('sys',2,'xsys8',"y = 2x − 1 and 3x + y = 9. What is x?","2",["8/5","4","10/5 · 2 = 4"],["Substitute y: 3x + (2x − 1) = 9.","5x − 1 = 9, so 5x = 10.","x = 2."])
    X('sys',2,'xsys9',"Check (2, −1) in x + y = 1 and 2x − y = 5. Which is true?","It solves both equations",["Only the first","Only the second","Neither"],["First: 2 + (−1) = 1. ✓.","Second: 4 − (−1) = 5. ✓.","It makes both true."])
    # ===== exp
    X('exp',1,'xexp1',"(x³)² equals what?","x⁶",["x⁵","x⁹","2x³"],["Power of a power: multiply the exponents.","3 × 2 = 6.","x⁶."])
    X('exp',1,'xexp2',"x⁴ · x⁴ equals what?","x⁸",["x¹⁶","2x⁴","x⁴"],["Same base, multiply: add the exponents.","4 + 4 = 8.","x⁸."])
    X('exp',2,'xexp3',"(2x)³ equals what?","8x³",["6x³","2x³","8x"],["The power applies to the 2 too.","2³ = 8 and x³.","8x³."])
    X('exp',2,'xexp4',"What is −3²?","−9",["9","−6","6"],["The exponent applies only to 3.","3² = 9.","Then the negative: −9."])
    X('exp',2,'xexp5',"What is 2⁻³?","1/8",["−8","−1/8","1/6"],["A negative exponent means reciprocal.","2⁻³ = 1/2³.","= 1/8."])
    X('exp',2,'xexp6',"(x + 3)² equals what?","x² + 6x + 9",["x² + 9","x² + 3x + 9","x² + 6"],["Squaring means multiplying twice: (x + 3)(x + 3).","FOIL: x² + 3x + 3x + 9.","x² + 6x + 9."])
    X('exp',1,'xexp7',"What is 4.5 × 10⁻³ in standard form?","0.0045",["0.045","4500","0.00045"],["A negative exponent moves the decimal left.","3 places left.","0.0045."])
    X('exp',1,'xexp8',"x⁷ ÷ x² equals what?","x⁵",["x^3.5","x⁹","x¹⁴"],["Same base, divide: subtract the exponents.","7 − 2 = 5.","x⁵."])
    X('exp',2,'xexp9',"A cube's edge length doubles. By what factor does its volume grow?","8",["2","4","6"],["V = s³.","(2s)³ = 8s³.","The volume is 8 times as big."])
    X('exp',2,'xexp10',"A square has side 3x. What is its area?","9x²",["6x²","3x²","9x"],["Area = side².","(3x)² = 3² · x².","9x²."])
    # ===== fac
    X('fac',1,'xfac1',"Which is x² − 16 factored?","(x − 4)(x + 4)",["(x − 4)²","(x + 4)²","(x − 8)(x + 2)"],["It is a difference of squares: x² − 4².","a² − b² = (a − b)(a + b).","(x − 4)(x + 4)."])
    X('fac',2,'xfac2',"Which is x² + 10x + 25 factored?","(x + 5)²",["(x + 5)(x − 5)","(x + 25)(x + 1)","(x + 5)(x + 10)"],["Is it a perfect square? 25 = 5² and 10 = 2·5.","(x + 5)(x + 5).","(x + 5)²."])
    X('fac',1,'xfac3',"What are the solutions of (x − 3)(x + 2) = 0?","x = 3 and x = −2",["x = −3 and x = 2","x = 3 and x = 2","x = −3 and x = −2"],["Set each factor to 0.","x − 3 = 0 gives x = 3.","x + 2 = 0 gives x = −2."])
    X('fac',2,'xfac4',"Solve x² = 4x.","x = 0 or x = 4",["x = 4 only","x = ±2","x = 0 only"],["Move everything to one side: x² − 4x = 0.","Factor: x(x − 4) = 0.","Dividing by x would lose x = 0. Solutions: 0 or 4."])
    X('fac',3,'xfac5',"Which are the solutions of (x − 2)(x − 3) = 6?","x = 0 and x = 5",["x = 8 and x = 9","x = 2 and x = 3","x = −5 and x = 0"],["The product must be 0 to use zero product, so expand first.","x² − 5x + 6 = 6, so x² − 5x = 0.","x(x − 5) = 0: x = 0 or 5."])
    X('fac',2,'xfac6',"Factor 6x² + 9x completely.","3x(2x + 3)",["3x(2x + 9)","6x(x + 9)","3x(x + 3)"],["GCF of 6 and 9 is 3; both have x.","Divide each term by 3x: 2x and 3.","3x(2x + 3)."])
    X('fac',2,'xfac7',"A rectangle has area x² + 7x + 12 and width x + 3. What is its length?","x + 4",["x + 9","x + 3","x + 12"],["Factor the area: numbers with product 12 and sum 7 are 3 and 4.","(x + 3)(x + 4).","Length = x + 4."])
    X('fac',3,'xfac8',"Which is 2x² + 7x + 3 factored?","(2x + 1)(x + 3)",["(2x + 3)(x + 1)","(2x − 1)(x − 3)","(2x + 7)(x + 3)"],["Try pairs and check the middle term.","(2x + 1)(x + 3): outer 6x + inner x = 7x. ✓.","The other pairs give 5x, −7x, or 13x."])
    X('fac',2,'xfac9',"Can x² + 9 be factored using real numbers?","No",["Yes: (x + 3)(x + 3)","Yes: (x + 3)(x − 3)","Yes: (x − 3)²"],["A sum of squares does not factor over the reals.","(x + 3)(x − 3) = x² − 9.","(x + 3)² = x² + 6x + 9."])
    # ===== rad
    X('rad',2,'xrad1',"Which statement is true?","√(9 + 16) = 5, but √9 + √16 = 7",["√(9 + 16) = √9 + √16","√(9 + 16) = 7","√9 + √16 = 5"],["√25 = 5.","√9 + √16 = 3 + 4 = 7.","You cannot split a root over addition."])
    X('rad',1,'xrad2',"√50 simplifies to what?","5√2",["25√2","10√2","2√5"],["50 = 25 × 2.","√25 = 5.","5√2."])
    X('rad',1,'xrad3',"√12 is between which two whole numbers?","3 and 4",["2 and 3","4 and 5","6 and 7"],["3² = 9 and 4² = 16.","12 is between 9 and 16.","√12 is between 3 and 4."])
    X('rad',1,'xrad4',"x² = 49. Which is the full answer?","x = 7 or x = −7",["x = 7 only","x = −7 only","x = 24.5"],["Both 7 and −7 square to 49.","Taking a square root gives ±.","x = ±7."])
    X('rad',2,'xrad5',"3√2 + 4√2 equals what?","7√2",["12√2","7√4","14"],["Like radicals combine like like terms.","Add the coefficients: 3 + 4 = 7.","The radical stays √2."])
    X('rad',2,'xrad6',"√2 · √8 equals what?","4",["√10","16","2√2"],["Multiply under one root: √16.","√16 = 4.","The answer is 4."])
    X('rad',3,'xrad7',"6/√3 rationalized is what?","2√3",["6√3","√3/2","3√3"],["Multiply top and bottom by √3.","6√3/3.","= 2√3."])
    X('rad',2,'xrad8',"A right triangle has two legs of length 5. What is the hypotenuse?","5√2",["10","5√3","√10"],["c² = 5² + 5² = 50.","c = √50.","c = 5√2."])
    X('rad',2,'xrad9',"What is the diagonal of a square with side 6?","6√2",["12","6√3","36√2"],["Diagonal² = 6² + 6² = 72.","√72 = √36 · √2.","6√2."])
    X('rad',1,'xrad10',"What is (√7)²?","7",["49","14","√49"],["Squaring undoes the square root.","(√7)(√7) = √49.","= 7."])

GEN=[(a_f1,5,1),(a_f2,4,1),(a_mean,4,1),(a_med,4,1),(a_prob,4,1),(a_cnt,4,1),(a_arith,4,1),(a_dir,4,1),(a_yint,3,1),(a_gvert,4,1),(a_gline,4,1),(a_gnum,4,1),
(b_vy,5,2),(b_zero,5,2),(b_qf,5,2),(b_disc,6,2),(b_abs,5,2),(b_comp,5,2),(b_rat,6,2),(b_inv,4,2),(b_grow,6,2),(b_geo,4,2),(b_ari,4,2),(b_dom,6,2),(b_geq,4,2),(b_perm,3,2),(b_ind,3,2),(b_csq,4,2),(b_miss,3,2),(b_expeq,3,2),(b_ycross,3,2),
(c_irr,4,3),(c_vf,4,3),(c_proj,4,3),(c_inv2,3,3),(c_dbl,3,3),(c_comp,4,3),(c_sum,4,3),(c_ratv,4,3),(c_wo,4,3),(c_k,3,3),(c_gap,3,3),(c_inv,3,3)]
def run():
    for f,n,_ in GEN:
        c=0;i=0
        while c<n and i<n*15:
            r=f(i);i+=1
            if r:c+=1
    # abs-count items: three cases
    a_abs(0,ri(2,9));a_abs(1,0);a_abs(2,-ri(1,6));a_abs(3,ri(2,9))
    hand()

CARDS={
'eq':[
["Balance rule","Whatever you do to one side of an equation, do to the other. Undo adding with subtracting, and undo multiplying with dividing.","ax + b = c → x = (c − b)/a"],
["x on both sides","Move the x terms to one side and the plain numbers to the other. Combine like terms, then divide by the coefficient of x."],
["Distribute first","Multiply the number outside the parentheses by every term inside, signs included. Then solve as usual.","a(x + b) = ax + ab"],
["Flip the sign","Multiplying or dividing an inequality by a negative number flips the inequality sign. Adding or subtracting never does.","−2x > 6 → x < −3"],
["No solution or all numbers","If x disappears and the leftover is false (6 = 5), there is no solution. If it is always true (5 = 5), every number works."],
["Solve for a letter","In a formula, treat the letter you want like x. Undo operations in reverse order.","A = ½bh → b = 2A/h"],
["Word problems","Name the unknown, write what equals what, solve, then check in the story. Consecutive integers: x, x + 1, x + 2."],
["Angle equations","Angles in a triangle add to 180°. Supplementary angles add to 180°. Complementary angles add to 90°. Write an equation and solve for x."]],
'lin':[
["Slope","Slope tells how steep a line is: rise over run. Use two points and subtract the y's and x's in the same order.","m = (y₂ − y₁)/(x₂ − x₁)"],
["Slope-intercept form","In y = mx + b, m is the slope and b is where the line crosses the y-axis.","y = mx + b"],
["Intercepts","The y-intercept is where x = 0. The x-intercept is where y = 0. Plug in 0 for the other variable and solve."],
["Parallel and perpendicular","Parallel lines have the same slope. Perpendicular lines have slopes that are negative reciprocals.","2/3 and −3/2"],
["Horizontal and vertical","y = c is flat with slope 0. x = c is vertical with undefined slope."],
["Point-slope form","If you know a point and the slope, plug them in. Then simplify to y = mx + b if you need to.","y − y₁ = m(x − x₁)"],
["Meaning in words","The slope is the rate of change (per mile, per week). The y-intercept is the starting amount when x = 0."],
["Standard form","In Ax + By = C, solve for y to find the slope. It equals −A/B.","2x + 3y = 12 → m = −2/3"]],
'sys':[
["What is a solution?","A solution of a system is a point (x, y) that makes every equation true. On a graph, it is where the lines cross."],
["Substitution","Solve one equation for a variable, then put that expression into the other equation. Solve, then go back for the other variable."],
["Elimination","Make one variable's coefficients opposites, add the equations to cancel it, and solve. Multiply an equation first if needed."],
["How many solutions?","Different slopes: one solution. Same slope, different intercept: none (parallel). Same line: infinitely many."],
["Graphing","Graph both lines. The crossing point is the solution. Check it in both equations."],
["Word problems","Pick two unknowns, write two equations (a total count and a total value), then solve."],
["Geometry systems","Perimeter, supplementary angles, and 'one side is 5 more than the other' often give two equations to solve together."]],
'exp':[
["Product rule","Same base, multiply: add the exponents.","xᵃ · xᵇ = xᵃ⁺ᵇ"],
["Quotient rule","Same base, divide: subtract the exponents.","xᵃ ÷ xᵇ = xᵃ⁻ᵇ"],
["Power of a power","Raise a power to a power: multiply the exponents. A power outside parentheses hits every factor inside.","(xᵃ)ᵇ = xᵃᵇ"],
["Zero and negative exponents","Any nonzero number to the 0 is 1. A negative exponent flips to the reciprocal.","x⁰ = 1, x⁻ⁿ = 1/xⁿ"],
["Fractional exponents","An exponent of 1/2 means square root.","x^(1/2) = √x"],
["Squaring a binomial","(x + a)² means (x + a)(x + a). The middle term is 2ax, so it is not x² + a².","(x + a)² = x² + 2ax + a²"],
["Scientific notation","Write a number as c × 10ⁿ with 1 ≤ c < 10. Positive n moves the decimal right; negative n moves it left."],
["Common traps","−3² = −9 because the exponent hits only the 3. (−3)² = 9. And 2x³ is not (2x)³."]],
'fac':[
["Greatest common factor","Pull out the biggest number and variable that divide every term.","6x² + 9x = 3x(2x + 3)"],
["Trinomials x² + bx + c","Find two numbers with product c and sum b. They go in the factors.","x² + 7x + 12 = (x + 3)(x + 4)"],
["Difference of squares","A square minus a square factors into a sum times a difference. A sum of squares does not factor.","a² − b² = (a − b)(a + b)"],
["Perfect square trinomial","If the first and last terms are squares and the middle is twice their product, it is a square.","x² + 2ax + a² = (x + a)²"],
["Zero product property","If a product is 0, one of the factors is 0. Set each factor to 0 and solve."],
["When a is not 1","Multiply a and c, find two numbers with that product and the sum b, split the middle term, then group."],
["Discriminant","For ax² + bx + c = 0, b² − 4ac tells the count: positive, two solutions; zero, one; negative, none.","D = b² − 4ac"],
["Vertex x-coordinate","The vertex of y = ax² + bx + c is at the x-value halfway between the roots.","x = −b/(2a)"],
["Sum and product of roots","For ax² + bx + c = 0, the roots add to −b/a and multiply to c/a."]],
'rad':[
["Perfect squares","Know 1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144. Their square roots are whole numbers."],
["Simplify a radical","Split the number into a perfect square times something else, then take the root of the square.","√50 = √25 · √2 = 5√2"],
["Multiply and divide","Roots multiply and divide under one radical sign.","√a · √b = √(ab)"],
["Add and subtract","Only like radicals combine. Add the coefficients and keep the radical.","3√2 + 4√2 = 7√2"],
["Rationalize","Remove a root from the bottom by multiplying top and bottom by that root.","6/√3 = 6√3/3 = 2√3"],
["Estimate a root","Find the two perfect squares around the number. The root is between their roots."],
["Square root of both signs","x² = 49 has two solutions: x = 7 or x = −7. The √ sign alone means the positive root."],
["Roots in geometry","The hypotenuse of a right triangle is √(a² + b²). A square with side s has diagonal s√2."]],
'qdr':[
["Function notation","f(x) is the output for input x. To find f(3), replace every x with 3.","f(x) = 2x + 1 → f(3) = 7"],
["Domain and range","Domain is the allowed inputs; range is the outputs. No division by 0, and nothing negative under a √."],
["Parabola features","y = ax² + bx + c makes a parabola. If a > 0 it opens up; if a < 0, down. The axis of symmetry is x = −b/(2a).","vertex x = −b/(2a)"],
["Vertex form","y = a(x − h)² + k has vertex (h, k). Completing the square turns standard form into vertex form.","x² + 6x + 5 = (x + 3)² − 4"],
["Solving quadratics","Factor, or use the quadratic formula. The discriminant b² − 4ac tells you 2, 1, or 0 real solutions.","x = (−b ± √(b² − 4ac))/(2a)"],
["Absolute value and compound inequalities","|x| = k has two solutions when k > 0. A compound inequality like 3 < 2x − 1 ≤ 9: do the same step to all three parts."],
["Rational expressions and variation","Factor, then cancel common factors. Direct variation: y = kx. Inverse variation: xy = k.","(x² − 9)/(x − 3) = x + 3"],
["Exponential growth and sequences","Repeated multiplying gives exponential change. Arithmetic sequences add d; geometric sequences multiply by r.","aₙ = a₁ + (n − 1)d, aₙ = a₁rⁿ⁻¹"],
["Statistics and probability","Mean is the average; median is the middle value. Probability is favorable ÷ total, from 0 to 1. Counting: multiply choices."]]}

GLOSS=[["expression","A math phrase with numbers and variables but no equals sign."],["equation","A statement that two expressions are equal."],["variable","A letter that stands for an unknown number."],["coefficient","The number multiplied by a variable, like 5 in 5x."],["constant","A term with no variable; its value never changes."],["like terms","Terms with the same variable part, like 3x and 7x."],["inequality","A statement comparing quantities with <, >, ≤, or ≥."],["solution","A value that makes an equation or inequality true."],["slope","Rise over run; how steep a line is."],["y-intercept","The point where a graph crosses the y-axis (x = 0)."],["x-intercept","The point where a graph crosses the x-axis (y = 0)."],["linear function","A function whose graph is a straight line: y = mx + b."],["system of equations","Two or more equations solved together."],["substitution","Replacing a variable with an equal expression."],["elimination","Adding equations to cancel one variable."],["exponent","A small raised number telling how many times the base is multiplied."],["base","The number being multiplied by itself in a power."],["scientific notation","A number written as c × 10ⁿ with 1 ≤ c < 10."],["polynomial","A sum of terms made of numbers and variables with whole-number powers."],["binomial","A polynomial with two terms."],["trinomial","A polynomial with three terms."],["factor","To write as a product; or one of the numbers in a product."],["GCF","Greatest common factor: the largest factor shared by all terms."],["difference of squares","A pattern a² − b² that factors as (a − b)(a + b)."],["perfect square trinomial","A trinomial that factors as (a ± b)²."],["quadratic","An equation or function with x² as its highest power."],["parabola","The U-shaped graph of a quadratic function."],["vertex","The highest or lowest point of a parabola."],["axis of symmetry","The line that splits a parabola into mirror halves."],["discriminant","b² − 4ac; tells how many real solutions a quadratic has."],["zero (root)","An input that makes a function equal to 0."],["radical","A root symbol, like √."],["radicand","The number under the radical sign."],["rationalize","Rewrite a fraction so no radical is in the denominator."],["function","A rule giving exactly one output for each input."],["domain","The set of all allowed inputs."],["range","The set of all outputs."],["absolute value","A number's distance from 0; never negative."],["direct variation","A relationship y = kx; y grows in step with x."],["inverse variation","A relationship xy = k; as one grows the other shrinks."],["arithmetic sequence","A list where each term adds the same number."],["geometric sequence","A list where each term multiplies by the same number."],["common difference","The number added each step in an arithmetic sequence."],["common ratio","The number multiplied each step in a geometric sequence."],["mean","The sum of the data divided by how many values there are."],["median","The middle value when data is in order."],["probability","Favorable outcomes divided by all possible outcomes."],["FOIL","A way to multiply two binomials: First, Outer, Inner, Last."]]

NOTES={
'eq':["Do the same thing to both sides; undo operations in reverse order.","Distribute to every term inside parentheses, signs included.","Flip an inequality sign when you multiply or divide by a negative.","False leftover (6 = 5): no solution. True leftover (5 = 5): all numbers.","Triangle angles sum to 180°; supplementary 180°; complementary 90°."],
'lin':["Slope m = (y₂ − y₁)/(x₂ − x₁); y = mx + b.","Parallel: equal slopes. Perpendicular: negative reciprocals.","Horizontal line: slope 0. Vertical line: slope undefined.","x-intercept: set y = 0. y-intercept: set x = 0.","Slope is the rate; intercept is the starting value."],
'sys':["A solution makes every equation true; it is the crossing point.","Substitution and elimination both reduce to one variable.","Same slope, different intercept: no solution. Same line: infinitely many.","Always check the answer in both equations."],
'exp':["Multiply: add exponents. Divide: subtract. Power of a power: multiply.","x⁰ = 1 and x⁻ⁿ = 1/xⁿ.","(x + a)² = x² + 2ax + a², not x² + a².","−3² = −9 but (−3)² = 9.","Scientific notation: c × 10ⁿ with 1 ≤ c < 10."],
'fac':["Always pull out the GCF first.","x² + bx + c: find numbers with product c and sum b.","a² − b² = (a − b)(a + b); a sum of squares does not factor.","Zero product property: set each factor equal to 0.","Discriminant b² − 4ac: positive 2, zero 1, negative 0 real solutions."],
'rad':["√(ab) = √a · √b, but √(a + b) ≠ √a + √b.","Simplify by pulling out the largest perfect square.","Only like radicals can be added or subtracted.","x² = k gives two solutions, ±√k.","A square's diagonal is side × √2."],
'qdr':["f(x) means output for input x; replace x everywhere.","Parabola vertex at x = −b/(2a); a > 0 opens up.","Quadratic formula: x = (−b ± √(b² − 4ac))/(2a).","Direct: y = kx. Inverse: xy = k.","Arithmetic: aₙ = a₁ + (n − 1)d. Geometric: aₙ = a₁rⁿ⁻¹.","Mean = sum ÷ count; probability = favorable ÷ total."]}

WRITTEN=["Explain why dividing an inequality by a negative number flips the sign. Use −2x > 8 as an example.","A student says √9 + √16 = √25. Show with numbers why this is wrong.","Describe how you can tell, without graphing, whether two lines are parallel, perpendicular, or neither.","Explain how to know if a system of two lines has no solution, one solution, or infinitely many.","Why does x² = 4x lose a solution if you divide both sides by x? Show the correct way.","Describe what the discriminant tells you and why. Give one example for each case.","A bacteria count triples every hour. Explain why this is not linear growth, using a small table.","Explain the difference between −3² and (−3)², and why they are different.","Show two ways to find the vertex of y = x² − 6x + 5 and compare them.","A rectangle's length is 3 more than twice its width and the perimeter is 54. Write an equation, solve it, and check."]
