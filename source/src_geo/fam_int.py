# -*- coding: utf-8 -*-
"""Interactive (non-MCQ) question families: angle (drag a ray), slider (live figure), point (tap the grid),
chips (fill the blanks) and proof builders (two-column). Every item carries worked steps in `sol`."""
from gen import *
import itertools,re
def ri(a,b):return R.randint(a,b)
def shuf(l):l=list(l);R.shuffle(l);return l
def _put(t,l,fp,stem,typ,extra,sol,b=None):
    q=dict(t=t,l=l,type=typ,q=stem,sol=sol,w=sol[-1],fp=fp);q.update(extra)
    if 'tpl' in extra:q['q']='Complete the sentence.'
    if b is not None:q['b']=b
    return put(q)
def ANG(t,l,fp,stem,target,sol,frm=None,ref='',tol=3,b=None):
    a=dict(target=target,tol=tol)
    if frm is not None:a['from']=frm
    if ref:a['ref']=ref
    return _put(t,l,fp,stem,'angle',dict(ang=a),sol,b)
def SLD(t,l,fp,stem,mn,mx,st,target,sol,label,unit='',live=None,tol=0,start=None,b=None):
    q=dict(sl=dict(min=mn,max=mx,step=st,target=target,tol=tol,label=label,unit=unit,start=mn if start is None else start))
    if live:q['live']=live
    return _put(t,l,fp,stem,'slider',q,sol,b)
def PT(t,l,fp,stem,x,y,show,sol,rng=6,b=None):
    return _put(t,l,fp,stem,'point',dict(pt=dict(x=x,y=y,rng=rng,show=show)),sol,b)
def CHP(t,l,fp,tpl,answers,dist,sol,stem=None):
    bank=shuf(list(answers)+list(dist));used=[];ans=[]
    for a in answers:
        for i,x in enumerate(bank):
            if x==a and i not in used:used.append(i);ans.append(i);break
    return _put(t,l,fp,stem or 'Complete the sentence.','chips',dict(tpl=tpl,bank=bank,ans=ans),sol)
# ---------------- angle (drag the ray) ----------------
def a_comp():
    a=R.choice(range(10,81,5));return ANG('bas',1,'ia1',f"Drag the blue ray so the angle it makes with the baseline is complementary to the {a}° angle shown.",90-a,[f"Complementary angles add to 90°.",f"90 − {a} = {90-a}."],frm=a,ref=f"{a}° given",b=-1)
def a_supp():
    a=R.choice(range(20,161,5));return ANG('bas',1,'ia2',f"Drag the blue ray so its angle with the baseline is supplementary to the {a}° angle shown.",180-a,["Supplementary angles add to 180°.",f"180 − {a} = {180-a}."],frm=a,ref=f"{a}° given",b=-1)
def a_bis():
    a=R.choice(range(20,81,5));return ANG('bas',2,'ia3',f"The shown ray makes a {2*a}° angle with the baseline. Drag the blue ray to bisect that angle.",a,["A bisector splits an angle into two equal parts.",f"{2*a} ÷ 2 = {a}."],frm=2*a,ref=f"{2*a}° to bisect",b=-.2)
def a_ext():
    a=R.choice(range(25,76,5));c=R.choice(range(30,85,5));return ANG('tri',2,'ia4',f"A triangle has angles of {a}° and {c}°. Drag the blue ray to show the exterior angle at the third vertex.",a+c,["The exterior angle equals the sum of the two remote interior angles.",f"{a} + {c} = {a+c}."],ref="exterior angle",b=.2)
def a_third():
    a=ri(30,80);c=ri(30,80)
    if a+c>140:return False
    return ANG('tri',1,'ia5',f"Two angles of a triangle are {a}° and {c}°. Drag the blue ray to show the third angle.",180-a-c,["Angles of a triangle add to 180°.",f"180 − {a} − {c} = {180-a-c}."],ref="third angle",b=-.5)
def a_iso():
    ap=R.choice(range(20,101,10));return ANG('tri',2,'ia6',f"An isosceles triangle has a {ap}° apex (vertex) angle. Drag the blue ray to show one base angle.",(180-ap)//2,["Base angles of an isosceles triangle are equal.",f"(180 − {ap}) ÷ 2 = {(180-ap)//2}."],ref="base angle",b=0)
def a_polyi():
    n=R.choice([5,6,8,9,10,12]);v=(n-2)*180//n;return ANG('par',2,'ia7',f"Drag the blue ray to show one interior angle of a regular {n}-gon.",v,[f"Interior angle sum = (n − 2)·180° = {(n-2)*180}°.",f"Each angle = {(n-2)*180} ÷ {n} = {v}°."],ref=f"regular {n}-gon",tol=3,b=.4)
def a_polye():
    n=R.choice([5,6,8,9,10,12,15,18,20,24]);v=360//n;return ANG('par',1,'ia8',f"Drag the blue ray to show one exterior angle of a regular {n}-gon.",v,["Exterior angles of a convex polygon add to 360°.",f"360 ÷ {n} = {v}°."],ref=f"regular {n}-gon",tol=3 if v>=30 else 2,b=0)
def a_cointer():
    a=R.choice(range(35,146,5));return ANG('par',2,'ia9',f"Two parallel lines are cut by a transversal. One interior angle is {a}°. Drag the blue ray to show the same-side interior (co-interior) angle on the same side.",180-a,["Same-side interior angles between parallel lines are supplementary.",f"180 − {a} = {180-a}."],frm=a,ref=f"{a}° given",b=.2)
def a_vert():
    a=R.choice(range(25,86,5));return ANG('bas',1,'ia10',f"Two lines cross and form a {a}° angle. Drag the blue ray to show the adjacent angle.",180-a,["Adjacent angles formed by two crossing lines are a linear pair.",f"180 − {a} = {180-a}."],frm=a,ref=f"{a}° given",b=-.5)
def a_insc():
    arc=R.choice(range(60,181,10));return ANG('cir',2,'ia11',f"An arc measures {arc}°. Drag the blue ray to show the inscribed angle that intercepts it.",arc//2,["An inscribed angle is half its intercepted arc.",f"{arc} ÷ 2 = {arc//2}."],ref="inscribed angle",b=.3)
def a_cent():
    i=R.choice(range(20,90,5));return ANG('cir',2,'ia12',f"An inscribed angle measures {i}°. Drag the blue ray to show the central angle on the same arc.",2*i,["A central angle equals its arc, and an inscribed angle is half the arc.",f"2 × {i} = {2*i}."],ref="central angle",b=.3)
def a_tan():
    x=R.choice(range(20,71,5));return ANG('cir',2,'ia13',f"A tangent meets a radius at the point of tangency. A second line makes a {x}° angle with the radius there. Drag the blue ray to show the angle between that line and the tangent.",90-x,["The tangent is perpendicular to the radius (90°).",f"90 − {x} = {90-x}."],frm=x,ref=f"{x}° to radius",b=.5)
# ---------------- slider ----------------
def s_tri():
    A=R.choice(range(30,90,5));B=R.choice(range(30,90,5))
    if A+B>140:return False
    return SLD('tri',1,'is1',f"A triangle has angles A = {A}° and B = {B}°. Slide to set angle C.",1,150,1,180-A-B,["The three angles of a triangle add to 180°.",f"C = 180 − {A} − {B} = {180-A-B}°."],'Angle C','°',live=dict(k='tri',A=A,B=B),start=20,b=-.4)
def s_scale():
    k=R.choice([2,3,4,5,1.5,2.5]);s=R.choice([2,3,4,5,6]);ks=('%g'%k)
    return SLD('sim',1,'is2',f"A square with side {s} is enlarged to a square with side {'%g'%(s*k)}. Slide to set the scale factor.",.5,5,.5,k,[f"Scale factor = new length ÷ old length.",f"{'%g'%(s*k)} ÷ {s} = {ks}."],'Scale factor','×',live=dict(k='scale'),start=1,b=-.3)
def s_area():
    k=R.choice([2,3,4,5]);return SLD('sim',2,'is3',f"A figure is enlarged by a scale factor of {k}. Slide to the ratio of the NEW area to the OLD area.",1,30,1,k*k,[f"Areas scale by the square of the scale factor.",f"{k}² = {k*k}."],'Area ratio','×',tol=0,start=1,b=.1)
def s_eq():
    a=R.choice([2,3,4,5,6]);x=ri(-8,10);b=ri(-9,9);c=a*x+b
    return SLD('eq',1,'is4',f"Slide x until {a}x {sg(b)} = {c}. Watch both sides.",-15,15,1,x,[f"Subtract {b} from both sides: {a}x = {c-b}." if b>=0 else f"Add {-b} to both sides: {a}x = {c-b}.",f"Divide by {a}: x = {x}."],'x','',live=dict(k='eq',a=a,b=b,c=c),start=0,b=-.6)
def s_line():
    m=R.choice([-3,-2,-1,1,2,3,4]);b0=ri(-3,3);x1=ri(1,3);y1=m*x1+b0
    if abs(y1)>7:return False
    return SLD('lin',1,'is5',f"The line y = mx {sg(b0)} must pass through the point ({x1}, {y1}). Slide to set the slope m.",-4,4,1,m,[f"Plug in the point: {y1} = m·{x1} {sg(b0)}.",f"m = ({y1} − ({b0})) ÷ {x1} = {m}."],'Slope m','',live=dict(k='line',b=b0,pts=[[x1,y1]]),start=0,b=-.2)
def s_circ():
    r=ri(3,11);return SLD('cir',2,'is6',f"A circle has area {r*r}π. Slide to set its radius.",1,15,1,r,["Area = πr².",f"r² = {r*r}, so r = {r}."],'Radius','',live=dict(k='circ'),start=1,b=.1)
def s_circc():
    r=ri(3,12);return SLD('area',2,'is7',f"A circle has circumference {2*r}π. Slide to set its radius.",1,15,1,r,["Circumference = 2πr.",f"{2*r}π = 2πr, so r = {r}."],'Radius','',live=dict(k='circ'),start=1,b=0)
def s_trv():
    rel=R.choice(['co','alt']);a=R.choice(range(40,141,10));g=(180-a) if rel=='co' else a;nm='same-side interior' if rel=='co' else 'alternate interior'
    return SLD('par',2,'is8',f"Two lines are parallel. Slide ∠1 so that its {nm} partner ∠2 measures {g}°.",20,160,5,a,[f"{nm.capitalize()} angles between parallel lines are "+("supplementary (add to 180°)." if rel=='co' else "congruent."),(f"∠1 = 180 − {g} = {a}°." if rel=='co' else f"∠1 = {g}°.")],'∠1','°',live=dict(k='trv',rel=rel),start=90,b=.1)
def s_pyth():
    T=[(6,8,10),(5,12,13),(8,15,17),(9,12,15),(7,24,25),(12,16,20),(9,40,41),(8,6,10),(15,8,17),(12,5,13),(20,21,29),(10,24,26),(12,35,37),(15,20,25),(16,30,34),(18,24,30)]
    a,b,c=R.choice(T);return SLD('rt',2,'is9',f"A right triangle has one leg {a} and hypotenuse {c}. Slide to set the other leg.",1,40,1,b,[f"a² + b² = c²: {a}² + b² = {c}².",f"b² = {c*c} − {a*a} = {b*b}, so b = {b}."],'Other leg','',live=dict(k='pyth',a=a,c=c),start=1,b=.3)
def s_inter():
    A=R.choice(range(100,145,5));return SLD('quad',2,'is10',f"One angle of a parallelogram is {A}°. Slide to the measure of an adjacent (consecutive) angle.",20,100,5,180-A,["Consecutive angles of a parallelogram are supplementary.",f"180 − {A} = {180-A}."],'Adjacent angle','°',start=60,b=.1)
# ---------------- point (tap the grid) ----------------
def inr(*v):return all(-6<=x<=6 for x in v)
def p_plot():
    x,y=ri(-6,6),ri(-6,6)
    if x==0 and y==0:return False
    return PT('crd',1,'ip1',f"Tap the point ({x}, {y}).",x,y,[],[f"x = {x}: go {'right' if x>0 else 'left' if x<0 else 'nowhere'} {abs(x)}.",f"y = {y}: go {'up' if y>0 else 'down' if y<0 else 'nowhere'} {abs(y)}."],b=-1)
def p_mid():
    x1,y1,x2,y2=ri(-6,6),ri(-6,6),ri(-6,6),ri(-6,6)
    if (x1+x2)%2 or (y1+y2)%2 or (x1,y1)==(x2,y2):return False
    mx,my=(x1+x2)//2,(y1+y2)//2
    return PT('crd',2,'ip2',f"Tap the midpoint of A({x1}, {y1}) and B({x2}, {y2}).",mx,my,[['A',x1,y1],['B',x2,y2]],["Midpoint = average of the coordinates.",f"x: ({x1} + {x2}) ÷ 2 = {mx}.",f"y: ({y1} + {y2}) ÷ 2 = {my}."],b=.1)
def p_refl():
    x,y=ri(-5,5),ri(-5,5);kind=R.choice(['x','y','o','d'])
    if x==0 or y==0 or x==y:return False
    tx,ty,nm,rule={'x':(x,-y,'the x-axis','(x, −y)'),'y':(-x,y,'the y-axis','(−x, y)'),'o':(-x,-y,'the origin (a 180° rotation)','(−x, −y)'),'d':(y,x,'the line y = x','(y, x)')}[kind]
    return PT('trn',2,'ip3'+kind,f"Reflect P({x}, {y}) over {nm}. Tap the image P′.",tx,ty,[['P',x,y]],[f"The rule for this is {rule}.",f"P({x}, {y}) → P′({tx}, {ty})."],b=0)
def p_trans():
    x,y=ri(-5,5),ri(-5,5);h,k=ri(-5,5),ri(-5,5)
    if (h,k)==(0,0) or not inr(x+h,y+k):return False
    ph=f"{abs(h)} unit{'s' if abs(h)!=1 else ''} {'right' if h>0 else 'left'}" if h else ''
    pk=f"{abs(k)} unit{'s' if abs(k)!=1 else ''} {'up' if k>0 else 'down'}" if k else ''
    d=' and '.join(z for z in (ph,pk) if z)
    return PT('trn',1,'ip4',f"Translate P({x}, {y}) {d}. Tap the image P′.",x+h,y+k,[['P',x,y]],[f"Translation rule: (x, y) → (x {sg(h)}, y {sg(k)}).",f"({x}, {y}) → ({x+h}, {y+k})."],b=-.5)
def p_rot():
    x,y=ri(-5,5),ri(-5,5);kind=R.choice(['ccw','cw','h'])
    if x==0 or y==0:return False
    tx,ty,nm,rule={'ccw':(-y,x,'90° counterclockwise','(x, y) → (−y, x)'),'cw':(y,-x,'90° clockwise','(x, y) → (y, −x)'),'h':(-x,-y,'180°','(x, y) → (−x, −y)')}[kind]
    return PT('trn',2,'ip5'+kind,f"Rotate P({x}, {y}) {nm} about the origin. Tap the image P′.",tx,ty,[['P',x,y]],[f"Rule: {rule}.",f"P′ = ({tx}, {ty})."],b=.2)
def p_dil():
    k=R.choice([2,3,-1,-2]);x,y=ri(-3,3),ri(-3,3)
    if x==0 and y==0 or not inr(k*x,k*y):return False
    return PT('trn',2,'ip6',f"Dilate P({x}, {y}) by a scale factor of {k} centered at the origin. Tap the image P′.",k*x,k*y,[['P',x,y]],["Multiply both coordinates by the scale factor.",f"({x}, {y}) × {k} = ({k*x}, {k*y})."],b=.2)
def p_dilh():
    x,y=2*ri(-3,3),2*ri(-3,3)
    if x==0 and y==0:return False
    return PT('sim',2,'ip7',f"Dilate P({x}, {y}) by a scale factor of ½ centered at the origin. Tap the image P′.",x//2,y//2,[['P',x,y]],["Multiply both coordinates by ½.",f"({x}, {y}) × ½ = ({x//2}, {y//2})."],b=.1)
def p_para():
    ax,ay,bx,by,cx,cy=[ri(-5,5) for _ in range(6)];dx,dy=ax+cx-bx,ay+cy-by
    if not inr(dx,dy) or len({(ax,ay),(bx,by),(cx,cy),(dx,dy)})<4 or (ax-bx)*(cy-by)==(ay-by)*(cx-bx):return False
    return PT('quad',3,'ip8',f"A({ax}, {ay}), B({bx}, {by}) and C({cx}, {cy}) are three vertices of parallelogram ABCD (in that order). Tap vertex D.",dx,dy,[['A',ax,ay],['B',bx,by],['C',cx,cy]],["Diagonals bisect each other, so the midpoint of AC equals the midpoint of BD.",f"D = A + C − B = ({ax}+{cx}−{bx}, {ay}+{cy}−{by}).",f"D = ({dx}, {dy})."],b=.7)
def p_xint():
    m=R.choice([1,2,3,-1,-2]);xi=ri(-4,4)
    if xi==0:return False
    b=-m*xi
    if abs(b)>6:return False
    return PT('lin',2,'ip9',f"Tap the x-intercept of y = {m if m not in(1,-1) else ('' if m==1 else '−')}x {sg(b)}.".replace('+ -','− '),xi,0,[],["The x-intercept is where y = 0.",f"0 = {m}x {sg(b)}, so x = {xi}."],b=.2)
def p_yint():
    m=R.choice([1,2,3,-1,-2,-3]);b=ri(-5,5)
    if b==0:return False
    ms=('' if m==1 else '−' if m==-1 else str(m).replace('-','−'))
    return PT('lin',1,'ip10',f"Tap the y-intercept of y = {ms}x {sg(b)}.",0,b,[],["The y-intercept is where x = 0.",f"y = {m}(0) {sg(b)} = {b}."],b=-.5)
def p_onl():
    m=R.choice([1,2,3,-1,-2]);b=ri(-3,3);x=ri(-2,2);y=m*x+b
    if not inr(y):return False
    ms=('' if m==1 else '−' if m==-1 else str(m).replace('-','−'))
    return PT('lin',2,'ip11',f"Tap the point on the line y = {ms}x {sg(b)} where x = {x}.",x,y,[],[f"Substitute x = {x}.",f"y = {m}({x}) {sg(b)} = {y}."],b=0)
def p_words():
    x,y=ri(-4,4),ri(-4,4);r,u=ri(1,4),ri(1,4);dr,du=R.choice(['right','left']),R.choice(['up','down'])
    tx=x+(r if dr=='right' else -r);ty=y+(u if du=='up' else -u)
    if not inr(tx,ty):return False
    return PT('crd',1,'ip12',f"Start at A({x}, {y}). Move {r} {dr} and {u} {du}. Tap where you land.",tx,ty,[['A',x,y]],[f"Moving {dr} changes x by {'+' if dr=='right' else '−'}{r}; moving {du} changes y by {'+' if du=='up' else '−'}{u}.",f"New point: ({tx}, {ty})."],b=-.7)
def p_equid():
    a=ri(1,5);b=ri(1,5)
    if a==b:return False
    x=(a+b)/2
    if x!=int(x):return False
    return PT('con',2,'ip13',f"Points A({-a if False else 0}, 0) and B({a+b}, 0) are on the x-axis. Tap the point on the x-axis that is equidistant from A and B.",(a+b)//2,0,[['A',0,0],['B',a+b,0]] if a+b<=6 else [],["Equidistant points on the segment are its midpoint.",f"({0} + {a+b}) ÷ 2 = {(a+b)//2}."],b=0) if a+b<=6 else False
# ---------------- chips (fill the blanks) ----------------
CH=[
('eq',1,'ic1',"To solve 3x + 5 = 20, {0} 5 from both sides, then {1} both sides by {2}.",['subtract','divide','3'],['add','multiply','5'],["Undo addition with subtraction.","Undo multiplication with division.","3x = 15, so x = 5."]),
('eq',1,'ic2',"An equation with {0} solutions is an identity, and one with {1} solutions is a contradiction.",['infinitely many','no'],['one','two'],["2x + 2 = 2(x + 1) is true for every x: infinitely many.","x + 1 = x + 2 can never be true: no solution."]),
('eq',2,'ic3',"When you multiply or divide an inequality by a {0} number, you must {1} the inequality sign.",['negative','flip'],['positive','keep'],["Multiplying by a negative reverses the order of numbers.","Example: −2x > 6 gives x < −3."]),
('lin',1,'ic4',"In y = mx + b, m is the {0} and b is the {1}.",['slope','y-intercept'],['x-intercept','area'],["m is the rate of change (rise over run).","b is where the line crosses the y-axis (x = 0)."]),
('lin',2,'ic5',"Parallel lines have {0} slopes. Perpendicular lines have slopes that are {1}.",['equal','negative reciprocals'],['opposite signs only','reciprocals'],["Parallel lines never meet, so they tilt the same amount.","Perpendicular slopes multiply to −1, for example 2 and −½."]),
('lin',1,'ic6',"A line that rises from left to right has a {0} slope; a horizontal line has a slope of {1}.",['positive','0'],['negative','undefined'],["Rising means y increases as x increases.","A horizontal line has rise 0, so slope 0. A vertical line has undefined slope."]),
('sys',1,'ic7',"A system whose lines cross has {0} solution. Parallel lines give {1} solution. The same line twice gives {2} solutions.",['one','no','infinitely many'],['two','three'],["Crossing lines meet at one point.","Parallel lines never meet.","The same line has every point in common."]),
('sys',2,'ic8',"To eliminate y, make its coefficients {0}, then {1} the equations.",['opposites','add'],['equal','multiply'],["Opposite coefficients cancel when added.","Example: 3y and −3y add to 0."]),
('exp',1,'ic9',"x⁵ · x³ = x^{0}, (x⁵)³ = x^{1}, and x⁰ = {2}.",['8','15','1'],['2','0','125'],["Multiplying powers with the same base: add exponents (5 + 3).","A power of a power: multiply exponents (5 · 3).","Any nonzero number to the power 0 is 1."]),
('exp',2,'ic10',"x⁻² means {0} divided by x², and x⁶ ÷ x² = x^{1}.",['1','4'],['0','8','x'],["A negative exponent is a reciprocal.","Dividing powers with the same base: subtract exponents (6 − 2)."]),
('fac',1,'ic11',"x² − 9 is a {0}, so it factors as (x + {1})(x − {2}).",['difference of squares','3','3'],['perfect square trinomial','9','6'],["x² − 9 = x² − 3².","a² − b² = (a + b)(a − b)."]),
('fac',2,'ic12',"Always factor out the {0} first. Then look for a difference of squares or a {1} trinomial.",['greatest common factor','trinomial'],['least common multiple','binomial'],["Factoring out the GCF simplifies everything else.","A trinomial x² + bx + c may factor into two binomials."]),
('rad',1,'ic13',"√50 = {0}√{1}, because 50 = 25 · {2}.",['5','2','2'],['25','10'],["√25 = 5 comes out of the radical.","50 = 25 · 2."]),
('rad',2,'ic14',"To rationalize 1/√3, multiply the top and bottom by {0} to get {1}.",['√3','√3/3'],['3','1/3'],["Multiplying by √3/√3 is multiplying by 1.","1·√3 over √3·√3 = √3/3."]),
('qdr',2,'ic15',"The discriminant is {0}. If it is positive there are {1} real solutions; if zero, {2}.",['b² − 4ac','two','one'],['b² + 4ac','three','none'],["The discriminant sits under the square root in the quadratic formula.","Positive: two different solutions.","Zero: one repeated solution."]),
('qdr',2,'ic16',"The graph of y = ax² + bx + c is a {0}. Its axis of symmetry is x = {1}.",['parabola','−b/(2a)'],['hyperbola','b/(2a)'],["Quadratic functions graph as parabolas.","The vertex lies on the line x = −b/(2a)."]),
('bas',1,'ic17',"Complementary angles add to {0}°. Supplementary angles add to {1}°. Vertical angles are {2}.",['90','180','congruent'],['360','supplementary','complementary'],["Complementary: 90°.","Supplementary: 180° (a linear pair).","Vertical angles are always equal."]),
('bas',1,'ic18',"A {0} has one endpoint and goes on forever; a {1} has two endpoints.",['ray','segment'],['line','plane'],["A ray starts at a point and extends in one direction.","A segment is a piece of a line between two points."]),
('bas',1,'ic19',"The {0} of a segment splits it into two {1} parts.",['midpoint','congruent'],['endpoint','parallel'],["The midpoint is halfway between the endpoints.","Equal halves are congruent."]),
('bas',2,'ic20',"Three points on the same line are {0}. Points in the same plane are {1}.",['collinear','coplanar'],['concurrent','parallel'],["Collinear: on one line.","Coplanar: on one plane."]),
('log',2,'ic21',"For “If p then q”: the {0} is “If q then p”, the {1} is “If not p then not q”, and the {2} is “If not q then not p”.",['converse','inverse','contrapositive'],['conclusion','hypothesis'],["Swap hypothesis and conclusion: converse.","Negate both: inverse.","Swap and negate: contrapositive."]),
('log',2,'ic22',"The {0} of a statement is always {1} to the statement itself.",['contrapositive','equivalent'],['converse','opposite'],["If the statement is true, so is its contrapositive.","The converse and inverse can be false even when the original is true."]),
('log',2,'ic23',"A single example that shows a statement is false is called a {0}. In an indirect proof you assume the {1} and look for a {2}.",['counterexample','opposite','contradiction'],['definition','postulate','diagram'],["One counterexample is enough to disprove a statement.","Assume the opposite of what you want to prove.","Show that the assumption leads to a contradiction."]),
('par',2,'ic24',"When parallel lines are cut by a transversal, corresponding angles are {0}, alternate interior angles are {1}, and same-side interior angles are {2}.",['congruent','congruent','supplementary'],['complementary','right'],["Corresponding angles are equal.","Alternate interior angles are equal.","Same-side interior angles add to 180°."]),
('par',2,'ic25',"The interior angles of an n-gon add to ({0}) · 180°, and the exterior angles of any convex polygon add to {1}°.",['n − 2','360'],['n + 2','180','720'],["Split the polygon into n − 2 triangles.","Exterior angles always make one full turn."]),
('tri',2,'ic26',"SSS, SAS, ASA and AAS prove triangles are {0}. In right triangles the shortcut {1} also works.",['congruent','HL'],['similar','SSA'],["These are congruence shortcuts.","Hypotenuse-Leg works only for right triangles."]),
('tri',1,'ic27',"CPCTC means corresponding parts of {0} triangles are {1}.",['congruent','congruent'],['similar','parallel'],["Use CPCTC only after the triangles are proven congruent.","Matching parts then have equal measures."]),
('tri',2,'ic28',"The sum of any two sides of a triangle must be {0} than the third side. The longest side is opposite the {1} angle.",['greater','largest'],['less','smallest'],["Triangle inequality.","Larger angle, longer opposite side."]),
('quad',2,'ic29',"A parallelogram has opposite sides {0} and diagonals that {1}. A rhombus has {2} diagonals; a rectangle has {3} diagonals.",['parallel','bisect each other','perpendicular','congruent'],['supplementary','adjacent'],["Opposite sides are parallel and equal.","Diagonals of a parallelogram bisect each other.","Rhombus diagonals cross at 90°.","Rectangle diagonals are equal in length."]),
('quad',1,'ic30',"A {0} has exactly one pair of parallel sides. A {1} has four congruent sides and four right angles.",['trapezoid','square'],['kite','rectangle'],["Trapezoid: exactly one pair of parallel sides.","Square: all sides equal and all angles 90°."]),
('sim',2,'ic31',"Similar figures have {0} angles and {1} sides. The ratio of areas is the {2} of the scale factor.",['congruent','proportional','square'],['parallel','equal','cube'],["Same shape means equal angles.","Sides scale by the same ratio.","Areas scale by k²."]),
('sim',2,'ic32',"Triangles are similar if they satisfy AA, SAS or SSS {0}. If DE ∥ BC in △ABC, then △ADE ∼ △ABC by {1}.",['similarity','AA'],['congruence','SSS'],["Similarity has its own versions of the shortcuts.","DE ∥ BC gives equal corresponding angles plus the shared angle A."]),
('rt',1,'ic33',"In a right triangle, a² + b² = {0}, where c is the {1}.",['c²','hypotenuse'],['c','leg'],["Pythagorean theorem.","The hypotenuse is the longest side, opposite the right angle."]),
('rt',2,'ic34',"sin θ = {0} ÷ {1}, cos θ = {2} ÷ {3}, and tan θ = {4} ÷ {5}.",['opposite','hypotenuse','adjacent','hypotenuse','opposite','adjacent'],['leg','base'],["SOH: sine = opposite over hypotenuse.","CAH: cosine = adjacent over hypotenuse.","TOA: tangent = opposite over adjacent."]),
('rt',2,'ic35',"In a 45°-45°-90° triangle the hypotenuse is {0} times a leg. In a 30°-60°-90° triangle the long leg is {1} times the short leg.",['√2','√3'],['2','√3/2'],["Legs are equal: hypotenuse = leg·√2.","Short leg x, long leg x√3, hypotenuse 2x."]),
('cir',2,'ic36',"A tangent is {0} to the {1} at the point of tangency. An inscribed angle is {2} its intercepted arc.",['perpendicular','radius','half'],['parallel','diameter','equal to'],["Tangent and radius meet at 90°.","The radius to the tangent point.","Inscribed angle = ½ arc."]),
('cir',2,'ic37',"A central angle equals its {0}. An angle inscribed in a semicircle measures {1}°.",['arc','90'],['chord','180'],["Central angle = intercepted arc.","A semicircle is 180°, half of that is 90°."]),
('cir',1,'ic38',"Circumference = {0} and area = {1}.",['2πr','πr²'],['πr','2πr²'],["Circumference is distance around: 2πr.","Area is the space inside: πr²."]),
('con',2,'ic39',"To bisect an angle, draw an arc from the vertex, then two {0} arcs from the points where it meets the sides. Every point on the {1} of a segment is equidistant from its endpoints.",['intersecting','perpendicular bisector'],['parallel','median'],["The two later arcs cross inside the angle; the ray through that point is the bisector.","The perpendicular bisector is the locus of equidistant points."]),
('con',2,'ic40',"The set of points a fixed distance from a point is a {0}. The set of points equidistant from two parallel lines is a {1} midway between them.",['circle','line'],['sphere','ray'],["Fixed distance from a point: circle (in a plane).","Halfway between two parallel lines: a parallel line."]),
('area',1,'ic41',"Area of a triangle = {0}, of a trapezoid = {1}, of a circle = {2}.",['½bh','½(b₁ + b₂)h','πr²'],['bh','(b₁ + b₂)h','2πr'],["Half base times height.","Average of the bases times height.","Pi r squared."]),
('sol',2,'ic42',"Volume of a prism = {0}; cylinder = {1}; cone = {2}; sphere = {3}.",['Bh','πr²h','⅓πr²h','⁴⁄₃πr³'],['½Bh','2πrh','4πr²'],["Base area times height.","Circular base times height.","A cone is one third of a cylinder.","Sphere volume four-thirds pi r cubed."]),
('crd',2,'ic43',"Midpoint = ({0}, {1}) and distance = √({2}).",['(x₁ + x₂)/2','(y₁ + y₂)/2','(x₂ − x₁)² + (y₂ − y₁)²'],['x₁ + x₂','(x₂ + x₁)²'],["Average the x’s.","Average the y’s.","Distance comes from the Pythagorean theorem."]),
('crd',2,'ic44',"Slope = {0} ÷ {1}. Two lines are perpendicular when their slopes {2} to −1.",['rise','run','multiply'],['add','zero','subtract'],["Slope is rise over run.","Run is the horizontal change.","Perpendicular slopes multiply to −1."]),
('trn',1,'ic45',"A {0} slides a figure, a {1} flips it, a {2} turns it about a point, and a {3} changes its size.",['translation','reflection','rotation','dilation'],['congruence','symmetry'],["Translation: slide.","Reflection: flip over a line.","Rotation: turn.","Dilation: enlarge or reduce."]),
('trn',2,'ic46',"Reflecting (x, y) over the x-axis gives ({0}); over the y-axis gives ({1}); rotating 180° about the origin gives ({2}).",['x, −y','−x, y','−x, −y'],['y, x','−y, x'],["Only y changes sign over the x-axis.","Only x changes sign over the y-axis.","Both change sign for 180°."]),
('trn',2,'ic47',"Translations, reflections and rotations are {0}: they keep size and {1}. A dilation keeps {2} but not size.",['isometries','shape','shape'],['similarities','area'],["Isometries preserve distance.","Dilations make similar (not congruent) figures."]),
('cir',3,'ic48',"A chord’s perpendicular bisector passes through the {0} of the circle. Tangent segments from an outside point are {1}.",['center','congruent'],['circumference','parallel'],["Every point equidistant from the chord’s ends lies on it, including the center.","Proved with HL: radii are equal and the right angles come from the tangent."]),
('tri',3,'ic49',"The three medians of a triangle meet at the {0}, which is {1} of the way along each median from the vertex.",['centroid','two thirds'],['circumcenter','one half'],["Medians are concurrent at the centroid.","The centroid divides each median 2 : 1."]),
('tri',3,'ic50',"The perpendicular bisectors meet at the {0} (center of the circumscribed circle). The angle bisectors meet at the {1} (center of the inscribed circle).",['circumcenter','incenter'],['centroid','orthocenter'],["Equidistant from the three vertices.","Equidistant from the three sides."]),
]
def run(n=10):
    fams=[a_comp,a_supp,a_bis,a_ext,a_third,a_iso,a_polyi,a_polye,a_cointer,a_vert,a_insc,a_cent,a_tan,
          s_tri,s_scale,s_area,s_eq,s_line,s_circ,s_circc,s_trv,s_pyth,s_inter,
          p_plot,p_mid,p_refl,p_trans,p_rot,p_dil,p_dilh,p_para,p_xint,p_yint,p_onl,p_words]
    for f in fams:rep(f,n+4)
    for t,l,fp,tpl,ans,dist,sol in CH:CHP(t,l,fp,tpl,ans,dist,sol)
