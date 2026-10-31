# -*- coding: utf-8 -*-
from gen import *
from math import sqrt
def ri(a,b):return R.randint(a,b)
def nz(a,b):
    x=0
    while x==0:x=ri(a,b)
    return x
# ---- qdr (Algebra bridge)
def g1():
    a=ri(1,3);r1=ri(-6,6);r2=ri(-6,6)
    if r1==r2 or r1*r2==0:return False
    b=-a*(r1+r2);c=a*r1*r2
    lo,hi=sorted([r1,r2])
    return NUM('qdr',2,'g1',f"Solve {'' if a==1 else str(a)}x² {sg(b)}x {sg(c)} = 0. Enter the LARGER solution.",hi,[f"Factor: {a if a>1 else ''}(x {sg(-r1)})(x {sg(-r2)}) = 0.",f"Solutions: x = {r1} and x = {r2}.",f"Larger: {hi}."],b=.5)
def g2():
    a=ri(1,3);h=ri(-6,6);k=ri(-9,9);b=-2*a*h;c=a*h*h+k
    if not h or not k:return False
    return NUM('qdr',2,'g2',f"Find the x-coordinate of the vertex of y = {'' if a==1 else a}x² {sg(b)}x {sg(c)}.",h,["Vertex x = −b ÷ (2a).",f"−({b}) ÷ {2*a} = {h}."],b=.4)
def g3():
    a=ri(1,3);h=ri(-6,6);k=ri(-9,9);b=-2*a*h;c=a*h*h+k
    if not h or not k:return False
    return NUM('qdr',3,'g3',f"Find the minimum value of y = {'' if a==1 else a}x² {sg(b)}x {sg(c)}.",k,[f"Vertex x = {h}.",f"y = {a}({h})² {sg(b)}({h}) {sg(c)} = {k}."],b=.9)
def g4():
    a=ri(1,3);b=nz(-8,8);c=nz(-8,8);D=b*b-4*a*c
    n=2 if D>0 else 1 if D==0 else 0
    return NUM('qdr',3,'g4',f"How many real solutions does {'' if a==1 else a}x² {sg(b)}x {sg(c)} = 0 have?",n,[f"Discriminant b² − 4ac = {b*b} − {4*a*c} = {D}.","Positive → 2 solutions; zero → 1; negative → 0.",f"Answer: {n}."],b=.8)
def g5():
    a=ri(2,6);b=ri(-5,5);x=ri(-4,4);return NUM('qdr',1,'g5',f"If f(x) = {a}x {sg(b)}, find f({x}).",a*x+b,[f"Replace x with {x}.",f"{a}({x}) {sg(b)} = {a*x+b}."],b=-.8)
def g6():
    a=ri(1,4);b=ri(-5,5);c=ri(-6,6);x=ri(-3,3);return NUM('qdr',2,'g6',f"If f(x) = {'' if a==1 else a}x² {sg(b)}x {sg(c)}, find f({x}).",a*x*x+b*x+c,[f"Replace x with {x}: square first.",f"{a}·{x*x} {sg(b*x)} {sg(c)} = {a*x*x+b*x+c}."],b=.1)
def g7():
    a=ri(2,9);b=ri(1,6);return NUM('qdr',2,'g7',f"Solve |x − {b}| = {a}. Enter the larger solution.",b+a,[f"Two cases: x − {b} = {a} or x − {b} = −{a}.",f"x = {b+a} or x = {b-a}.",f"Larger: {b+a}."],b=.3)
def g8():
    p=ri(100,900);r=R.choice([.05,.1,.2]);n=ri(2,3);return NUM('qdr',3,'g8',f"A value of ${p} grows {int(r*100)}% each year. What is it after {n} years (nearest cent)?",round(p*(1+r)**n,2),["Use A = P(1 + r)ⁿ.",f"{p} × {1+r:g}^{n} = {p*(1+r)**n:.2f}."],tol=.02,b=1)
def g9():
    a=ri(2,9);d=ri(2,7);n=ri(8,20);return NUM('qdr',2,'g9',f"An arithmetic sequence starts at {a} and adds {d} each step. Find term {n}.",a+(n-1)*d,["aₙ = a₁ + (n − 1)d.",f"{a} + {n-1}·{d} = {a+(n-1)*d}."],b=.2)
def g10():
    a=ri(2,5);r=ri(2,3);n=ri(4,6);return NUM('qdr',3,'g10',f"A geometric sequence starts at {a} and multiplies by {r} each step. Find term {n}.",a*r**(n-1),["aₙ = a₁ · rⁿ⁻¹.",f"{a} × {r}^{n-1} = {a*r**(n-1)}."],b=.6)
def g11():
    s=sorted(R.sample(range(2,30),5));m=sum(s)/5
    return NUM('qdr',1,'g11',f"Find the mean of {', '.join(map(str,s))}.",round(m,1),[f"Add: {sum(s)}.",f"Divide by 5: {m:g}."],tol=.06,b=-.5)
def g12():
    k=ri(2,6);x=ri(2,9);y=k*x;x2=ri(10,20);return NUM('qdr',2,'g12',f"y varies directly with x, and y = {y} when x = {x}. Find y when x = {x2}.",k*x2,[f"k = y ÷ x = {y} ÷ {x} = {k}.",f"y = {k} × {x2} = {k*x2}."],b=.2)
def g13():
    a=ri(2,6);b=ri(2,6);return MC('qdr',2,'g13',f"Simplify (x² − {a*a}) / (x − {a}).",f"x + {a}",[f"x − {a}",f"x² + {a}",f"x + {a*a}"],["Difference of squares: x² − a² = (x − a)(x + a).","Cancel (x − a)."],b=.5)
def g14():
    a=ri(2,12);return MC('qdr',2,'g14',f"Complete the square: x² + {2*a}x + ___ = (x + {a})². What fills the blank?",f"{a*a}",[f"{a}",f"{2*a}",f"{4*a*a}"],["Take half of the x-coefficient and square it.",f"({2*a}/2)² = {a*a}."],b=.4)
# ---- hand written concept items (t,l,stem,good,b1,b2,b3,why)
H=[
('bas',1,"Which is a correct way to name a ray starting at P and passing through Q?","PQ with an arrow (ray PQ)","QP with an arrow (ray QP)","PQ with a bar on top","PQ with arrows on both ends","A ray starts at its endpoint: the first letter is the starting point."),
('bas',1,"Three points all lie on one line. They are called…","collinear","coplanar only","concurrent","congruent","Collinear means on the same line."),
('bas',1,"Points that lie in the same plane are…","coplanar","collinear","parallel","skew","Coplanar means in one plane."),
('bas',1,"How many points does it take to determine one line?","2","1","3","Infinitely many","Two points determine exactly one line."),
('bas',1,"An angle measuring 90° is called…","right","acute","obtuse","straight","Right angle = 90°."),
('bas',1,"An angle measuring 135° is…","obtuse","acute","right","straight","Obtuse is between 90° and 180°."),
('bas',2,"Which statement describes a postulate?","A statement accepted as true without proof","A statement proven using theorems","A guess based on a pattern","A definition of a figure","Postulates are starting assumptions."),
('bas',2,"If AB = CD and CD = EF, then AB = EF. Which property is this?","Transitive property","Reflexive property","Symmetric property","Distributive property","Things equal to the same thing are equal to each other."),
('bas',2,"If m∠1 = m∠2, then m∠2 = m∠1. Which property?","Symmetric property","Reflexive property","Transitive property","Addition property","Equality can be flipped."),
('bas',2,"Which pair of angles are adjacent?","They share a vertex and a side, with no overlap","They share only a vertex","They add to 90°","They are equal","Adjacent angles are side by side."),
('bas',3,"Two angles are supplementary and the larger is 4 times the smaller. Find the smaller (degrees).","36","45","30","40","x + 4x = 180, so x = 36."),
('log',1,"In 'If p, then q', p is called the…","hypothesis","conclusion","converse","contrapositive","The 'if' part is the hypothesis."),
('log',1,"In 'If it rains, the ground is wet', what is the conclusion?","The ground is wet","It rains","It does not rain","The ground is dry","The conclusion follows 'then'."),
('log',2,"What is the converse of 'If a figure is a square, then it has four sides'?","If a figure has four sides, then it is a square","If a figure is not a square, then it does not have four sides","If a figure does not have four sides, then it is not a square","A square has four sides","Converse swaps hypothesis and conclusion."),
('log',2,"What is the contrapositive of 'If p, then q'?","If not q, then not p","If q, then p","If not p, then not q","p and q","Contrapositive swaps AND negates; it always matches the original statement's truth."),
('log',2,"Which statement is always logically equivalent to 'If p, then q'?","Its contrapositive","Its converse","Its inverse","Its negation","Only the contrapositive always has the same truth value."),
('log',2,"A counterexample shows that a statement is…","false","true","a postulate","a definition","One counterexample disproves a 'for all' claim."),
('log',2,"You see 2, 4, 6, 8 and conclude the next even number is 10. This is…","inductive reasoning","deductive reasoning","a proof","a postulate","Inductive: a pattern from examples."),
('log',2,"If 'All squares are rectangles' and 'ABCD is a square', then ABCD is a rectangle. This is…","deductive reasoning","inductive reasoning","a counterexample","an assumption","Deductive: facts to a certain conclusion."),
('log',3,"To prove 'a triangle cannot have two right angles' by indirect proof, you begin by assuming…","a triangle has two right angles","a triangle has no right angle","a triangle has two acute angles","the angle sum is 90°","Start with the opposite of what you want."),
('log',3,"A true conditional's inverse is…","not necessarily true","always true","always false","the same as the converse","Inverse and converse can fail: 'If x=2 then x²=4' is true but 'if x²=4 then x=2' is not."),
('par',1,"Two lines in a plane that never meet are…","parallel","skew","perpendicular","intersecting","Parallel lines in one plane never meet."),
('par',1,"Angles in the 'F' shape (same position at each intersection) are…","corresponding angles","vertical angles","adjacent angles","alternate exterior angles","F = corresponding."),
('par',1,"Angles in the 'Z' shape between parallel lines are…","alternate interior angles","corresponding angles","same-side interior angles","vertical angles","Z = alternate interior."),
('par',2,"Which condition PROVES two lines are parallel?","Corresponding angles are equal","The lines look parallel","Consecutive angles are equal","One angle is 90°","Equal corresponding angles ⇒ parallel lines."),
('par',2,"A regular polygon has interior angles of 120°. How many sides does it have?","6","5","8","10","Exterior = 60°, 360 ÷ 60 = 6."),
('par',2,"Which polygon has an interior angle sum of 540°?","Pentagon","Quadrilateral","Hexagon","Heptagon","(5 − 2) × 180 = 540."),
('par',3,"The exterior angles of any convex polygon (one at each vertex) add to…","360°","180°","(n − 2)·180°","It depends on n","Always 360°, no matter the number of sides."),
('tri',1,"A triangle with three equal sides is…","equilateral","isosceles only","scalene","right","Equi = equal, lateral = sides."),
('tri',1,"A triangle with no equal sides is…","scalene","isosceles","equilateral","acute only","Scalene: all sides different."),
('tri',1,"A segment from a vertex to the midpoint of the opposite side is a…","median","altitude","angle bisector","midsegment","Median goes to the midpoint."),
('tri',1,"A segment from a vertex perpendicular to the opposite side is an…","altitude","median","angle bisector","chord","Altitude = height."),
('tri',2,"In congruent triangles, CPCTC stands for…","Corresponding parts of congruent triangles are congruent","Congruent parts create two congruent triangles","Common parts of congruent triangles are constant","Corresponding points create triangle congruence","Use it AFTER proving the triangles congruent."),
('tri',2,"Two sides and an angle NOT between them (SSA) are…","not enough to prove congruence","enough, like SAS","enough, like ASA","the same as HL","SSA can build two different triangles."),
('tri',2,"The point where all three medians meet is the…","centroid","circumcenter","incenter","orthocenter","Centroid = balance point; medians meet there."),
('tri',3,"The circumcenter of a triangle is the point where the…","perpendicular bisectors of the sides meet","medians meet","angle bisectors meet","altitudes meet","Equidistant from the vertices; center of the circle through all three."),
('tri',3,"The incenter of a triangle is where the…","angle bisectors meet","perpendicular bisectors meet","medians meet","altitudes meet","Equidistant from the three sides; center of the inscribed circle."),
('quad',1,"A quadrilateral with exactly one pair of parallel sides is a…","trapezoid","parallelogram","rhombus","kite","Trapezoid: exactly one pair of parallel sides (this book's definition)."),
('quad',1,"A parallelogram with four right angles is a…","rectangle","rhombus","kite","trapezoid","Rectangle: parallelogram with right angles."),
('quad',2,"A parallelogram with four equal sides is a…","rhombus","rectangle","trapezoid","kite","Rhombus: equal sides."),
('quad',2,"Which quadrilateral has diagonals that bisect each other but are not necessarily equal or perpendicular?","Parallelogram","Isosceles trapezoid","Kite","Trapezoid","All parallelograms have bisecting diagonals."),
('quad',3,"A square is a…","rectangle and a rhombus","rectangle only","rhombus only","trapezoid","A square has all the properties of both."),
('quad',3,"Is every rhombus a parallelogram?","Yes, a rhombus is a parallelogram with equal sides","No, a rhombus has no parallel sides","Only if it is a square","Only if its angles are 90°","Rhombus ⊂ parallelogram."),
('sim',1,"Similar figures have…","the same shape, possibly different size","the same size and shape","equal areas","equal perimeters","Similar = same shape."),
('sim',2,"Is △ABC with angles 40°, 60°, 80° similar to a triangle with angles 40°, 60°, 80°?","Yes (AA)","No","Only if sides are equal","Cannot tell","Equal angles ⇒ similar."),
('sim',3,"If the scale factor of two similar solids is 2 : 3, the ratio of their volumes is…","8 : 27","4 : 9","2 : 3","6 : 9","Volumes scale by the cube."),
('rt',1,"The longest side of a right triangle, opposite the right angle, is the…","hypotenuse","leg","altitude","median","Hypotenuse is the longest side."),
('rt',2,"In a 45°-45°-90° triangle, the legs are 6. The hypotenuse is…","6√2","12","6√3","6","Hypotenuse = leg × √2."),
('rt',2,"In a 30°-60°-90° triangle with hypotenuse 10, the short leg is…","5","10√3/2","5√3","20","Short leg = hypotenuse ÷ 2."),
('rt',3,"In right △ABC, altitude CD to the hypotenuse splits AB into AD = 4 and DB = 9. The altitude CD is…","6","6.5","13","36","Altitude² = 4 × 9 = 36."),
('cir',1,"A line that touches a circle at exactly one point is a…","tangent","secant","chord","radius","Tangent touches once."),
('cir',2,"A tangent and a radius meet at the point of tangency. The angle between them is…","90°","45°","180°","It depends","Tangent ⊥ radius."),
('cir',2,"Congruent chords of a circle have…","equal arcs","different arcs","equal inscribed angles only","no relationship","Equal chords ↔ equal arcs."),
('cir',3,"Two tangent segments drawn to a circle from the same outside point are…","equal in length","perpendicular","parallel","different lengths","Tangent segments from one point are congruent."),
('con',1,"Which tools are allowed in a classic Euclidean construction?","Compass and straightedge","Ruler and protractor","Calculator","Graph paper","Classic constructions use only a compass and an unmarked straightedge."),
('con',1,"A construction of a perpendicular bisector of AB uses arcs centered at…","A and B with equal radii bigger than half of AB","only A","the midpoint","any point on AB","Two intersecting arcs mark two points on the bisector."),
('con',2,"The locus of points equidistant from two fixed points is…","the perpendicular bisector of the segment joining them","a circle","an angle bisector","a parallel line","Equidistant from the endpoints ⇒ perpendicular bisector."),
('con',2,"The locus of points a fixed distance from a point (in a plane) is a…","circle","line","pair of lines","parabola","All points at distance r form a circle."),
('con',2,"The locus of points equidistant from two intersecting lines is…","the two angle bisectors","one perpendicular bisector","one circle","a parallel line","Both bisecting lines of the vertical-angle pairs."),
('con',3,"How many points in a plane are 3 cm from line ℓ AND 5 cm from point P on ℓ?","4","1","2","0","Two lines parallel to ℓ each meet the circle twice: 4."),
('area',1,"Area is measured in…","square units","units","cubic units","degrees","Area = squares."),
('area',2,"Doubling every side of a square makes its area…","4 times as large","2 times as large","8 times as large","the same","Area scales by k²."),
('sol',1,"Volume is measured in…","cubic units","square units","units","degrees","Volume = cubes."),
('sol',2,"A cone and a cylinder have the same base and height. The cone's volume is…","one third of the cylinder's","half of the cylinder's","equal","one fourth","Cone = ⅓ cylinder."),
('crd',2,"Parallel lines have slopes that are…","equal","negative reciprocals","opposite","undefined","Equal slopes ⇒ parallel."),
('crd',2,"Lines with slopes 2/3 and −3/2 are…","perpendicular","parallel","the same line","neither","Product = −1 ⇒ perpendicular."),
('crd',3,"To show ABCD is a rectangle with coordinates you can show…","opposite sides parallel and adjacent sides perpendicular","only that diagonals are equal","only that two sides are equal","only that slopes are equal","Parallelogram + right angle ⇒ rectangle."),
('trn',1,"A slide of a figure without turning is a…","translation","reflection","rotation","dilation","Slide = translation."),
('trn',1,"A flip over a line is a…","reflection","rotation","translation","dilation","Flip = reflection."),
('trn',2,"A rotation of 360° about a point is the same as…","the identity (no change)","a reflection","a translation","a dilation","A full turn returns every point."),
('trn',3,"Reflecting over two parallel lines in a row is equivalent to a…","translation","rotation","reflection","dilation","Two parallel reflections = a slide twice the distance between the lines."),
('eq',1,"Which step undoes 'x + 7 = 12'?","Subtract 7 from both sides","Add 7 to both sides","Divide by 7","Multiply by 7","Undo addition with subtraction."),
('lin',2,"A line has slope −2. As x increases by 1, y…","decreases by 2","increases by 2","decreases by 1/2","stays the same","Slope = change in y per 1 of x."),
('lin',2,"Which equation has a slope of 3 and y-intercept −1?","y = 3x − 1","y = −x + 3","y = x/3 − 1","y = 3 − x","y = mx + b."),
('sys',2,"A system has two parallel lines. How many solutions?","none","one","two","infinitely many","Parallel lines never meet."),
('sys',2,"A system's two equations describe the SAME line. How many solutions?","infinitely many","none","one","two","Every point is shared."),
('exp',1,"Simplify x³ · x⁴.","x⁷","x¹²","2x⁷","x⁴·³","Add exponents when multiplying like bases."),
('exp',2,"Simplify (x³)⁴.","x¹²","x⁷","x⁸","3x⁴","Multiply exponents for a power of a power."),
('exp',2,"What is 5⁰?","1","0","5","undefined","Any nonzero number to the 0 is 1."),
('exp',2,"What is 2⁻³?","1/8","−8","−6","1/6","Negative exponent flips: 1/2³."),
('fac',2,"Factor x² − 49.","(x − 7)(x + 7)","(x − 7)²","(x + 7)²","(x − 49)(x + 1)","Difference of squares."),
('fac',2,"Factor x² + 5x + 6.","(x + 2)(x + 3)","(x + 1)(x + 6)","(x − 2)(x − 3)","(x + 5)(x + 6)","2 × 3 = 6 and 2 + 3 = 5."),
('rad',2,"Simplify √72.","6√2","36√2","2√18","8√9","72 = 36 × 2."),
('rad',1,"√81 =","9","8","18","27","9 × 9 = 81."),
]
def hand():
    for t,l,st,g,a,b,c,w in H:
        MC(t,l,'h_'+t+str(l)+st[:12],st,g,[a,b,c],[w],b=(l-2)*.6)
FAMS4=dict(qdr=[g1,g2,g3,g4,g5,g6,g7,g8,g9,g10,g11,g12,g13,g14])
def run(n=10):
    for fs in FAMS4.values():
        for f in fs:rep(f,n)
    hand()
