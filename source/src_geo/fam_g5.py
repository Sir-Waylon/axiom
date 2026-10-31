# -*- coding: utf-8 -*-
from gen import *
# (hypothesis, conclusion, negH, negC, true?)
ST=[("a figure is a square","it has four sides","a figure is not a square","it does not have four sides",True),
("an animal is a dog","it is a mammal","an animal is not a dog","it is not a mammal",True),
("a number is divisible by 6","it is divisible by 3","a number is not divisible by 6","it is not divisible by 3",True),
("two angles are vertical","they are equal","two angles are not vertical","they are not equal",True),
("an angle is a right angle","it measures 90°","an angle is not a right angle","it does not measure 90°",True),
("a polygon is a rectangle","it is a parallelogram","a polygon is not a rectangle","it is not a parallelogram",True),
("a number is even","it is divisible by 4","a number is not even","it is not divisible by 4",False),
("a figure is a rhombus","it is a square","a figure is not a rhombus","it is not a square",False),
("x = 3","x² = 9","x ≠ 3","x² ≠ 9",True),
("a triangle is equilateral","it is isosceles","a triangle is not equilateral","it is not isosceles",True),
("two lines are perpendicular","they intersect","two lines are not perpendicular","they do not intersect",True),
("it is a triangle","it has three angles that add to 180°","it is not a triangle","it does not have three angles that add to 180°",True)]
def lg1():
    h,c,nh,nc,_=R.choice(ST);k=R.choice(['converse','inverse','contrapositive'])
    ans={'converse':f"If {c}, then {h}.",'inverse':f"If {nh}, then {nc}.",'contrapositive':f"If {nc}, then {nh}."}
    good=ans[k];bad=[v for kk,v in ans.items() if kk!=k]+[f"If {h}, then {nc}."]
    return MC('log',2,'lg1',f"Statement: “If {h}, then {c}.” Which is its {k}?",good,bad,{'converse':"Converse: swap the parts.",'inverse':"Inverse: negate both parts.",'contrapositive':"Contrapositive: swap AND negate."}[k].split('.')[:1]+[f"Apply it: {good}"],b=.2)
def lg2():
    h,c,nh,nc,t=R.choice(ST)
    return MC('log',2,'lg2',f"“If {h}, then {c}.” Is the CONTRAPOSITIVE true or false? (Assume the original is as stated.)",'True' if t else 'False',['False' if t else 'True','It cannot be decided','Sometimes true'],["A conditional and its contrapositive always have the same truth value.","So they match the original."],b=.6)
def lg3():
    h,c,nh,nc,t=R.choice(ST)
    return MC('log',3,'lg3',f"The conditional “If {h}, then {c}.” is {'true' if t else 'false'}. What do you know about its CONVERSE?",'It may be true or false; check separately',['It must be true','It must be false','It is the same statement'],["The converse is NOT guaranteed to match.","Test it with an example."],b=1)
def lg4():
    ps=[("All squares are rectangles. ABCD is a square.","ABCD is a rectangle."),("If it is a prime greater than 2, it is odd. 17 is a prime greater than 2.","17 is odd."),("All mammals breathe air. A whale is a mammal.","A whale breathes air."),("If a polygon is a triangle, its angles add to 180°. △XYZ is a triangle.","The angles of △XYZ add to 180°.")]
    a,b=R.choice(ps);return MC('log',2,'lg4',f"Given: {a} Which conclusion follows by deduction?",b,["Nothing follows","The converse is true","The statement is false"],["Facts that match the hypothesis give the conclusion.",b],b=0)
def lg5():
    ps=[("If a number is a multiple of 10, it ends in 0. 40 ends in 0.","40 is a multiple of 10."),("If it is a square, it has four sides. Pentagon P has five sides.","Pentagon P is a square")]
    return MC('log',3,'lg5',"Given: If a figure is a rhombus, then it is a parallelogram. Figure F is a parallelogram. What can you conclude?","Nothing for certain",["F is a rhombus","F is not a rhombus","F is a square"],["This is the converse, affirming the conclusion.","A rectangle is a parallelogram but not a rhombus."],b=1.2)
def lg6():
    xs=[("all prime numbers are odd","2"),("all birds can fly","a penguin"),("every number squared is larger than the number","½"),("all quadrilaterals have four equal sides","a rectangle")]
    c,e=R.choice(xs);return MC('log',2,'lg6',f"Which is a counterexample to “{c[0].upper()+c[1:]}”?",e,[ "an example that fits","a proof","a definition"] ,["A counterexample fits the hypothesis but breaks the conclusion.",f"{e} breaks it."],b=.2)
def lg7():
    s=[(2,4,6,8,10,"12"),(3,6,12,24,48,"96"),(1,4,9,16,25,"36"),(5,10,15,20,25,"30"),(2,5,8,11,14,"17"),(1,2,4,8,16,"32")];a=R.choice(s)
    return NUM('log',1,'lg7',f"Find the next number: {', '.join(map(str,a[:5]))}, …",int(a[5]),["Look for the rule (add, multiply, squares).",f"Next: {a[5]}."],b=-.5)
def lg8():
    n=R.randint(4,12);return NUM('log',2,'lg8',f"A pattern: 1 line, 3 lines, 5 lines… each figure adds 2 lines. How many lines in figure {n}?",2*n-1,["Rule: 2n − 1.",f"2({n}) − 1 = {2*n-1}."],b=.3)
# ---- constructions & loci (hand)
CON=[
(1,"To copy a segment AB, you set the compass to…","the length AB","half of AB","any length","twice AB","The compass holds a length and copies it."),
(1,"A straightedge is used to…","draw straight lines","measure lengths","measure angles","copy lengths","It has no marks."),
(1,"The perpendicular bisector of AB passes through…","the midpoint of AB","point A only","a point outside AB","point B only","It cuts AB in half at 90°."),
(1,"An angle bisector divides an angle into…","two equal angles","two right angles","two supplementary angles","three angles","Bisect = cut in half."),
(2,"When bisecting an angle, the first arc is centered at…","the vertex","a point on one side only","a point outside","the midpoint","The arc crosses both sides."),
(2,"Why must the arcs when constructing a perpendicular bisector have radius greater than half of AB?","So the arcs will intersect","So the segment is longer","So the compass stays open","To measure AB","Smaller arcs never meet."),
(2,"Which construction makes a 60° angle?","Equilateral triangle","Perpendicular bisector","Angle bisector of 90°","Copy of a segment","Equal radii → equilateral triangle → 60°."),
(2,"Constructing a line through a point P parallel to line ℓ copies…","a corresponding angle","a segment","a midpoint","a radius","Equal corresponding angles ⇒ parallel."),
(2,"To construct a perpendicular from P to line ℓ (P not on ℓ), you first draw…","an arc centered at P cutting ℓ twice","a circle around ℓ","a ray through P","a parallel to ℓ","Two points on ℓ equidistant from P."),
(3,"A circle is inscribed in a triangle. Its center is found by constructing…","two angle bisectors","two medians","two altitudes","two midsegments","Incenter = bisectors."),
(3,"A circle passes through all three vertices of a triangle. Its center is found with…","perpendicular bisectors of two sides","angle bisectors","medians","altitudes","Circumcenter = perpendicular bisectors."),
(1,"The locus of points 5 cm from a fixed point P in a plane is…","a circle of radius 5","a line","a segment","two points","All points at distance 5 from P."),
(2,"The locus of points 3 cm from a line ℓ (in a plane) is…","two parallel lines","one line","a circle","a point","One on each side of ℓ."),
(2,"The locus of points in a plane equidistant from two parallel lines is…","a parallel line midway between them","a perpendicular line","a circle","two points","Halfway between the two."),
(2,"The locus of points equidistant from the sides of an angle is…","the angle bisector","the perpendicular bisector","a circle","a parallel line","Bisector."),
(3,"In space, the locus of points 4 from a point is a…","sphere","circle","plane","cylinder","In 3D, equal distance gives a sphere."),
(3,"In a plane, how many points are 2 cm from point A and 3 cm from point B if AB = 8 cm?","0","1","2","4","The circles are too far apart to meet (2 + 3 < 8)."),
(3,"In a plane, how many points are 2 cm from point A and 3 cm from point B if AB = 5 cm?","1","0","2","4","The circles touch externally: one point."),
(3,"In a plane, how many points are 3 cm from point A and 3 cm from point B if AB = 4 cm?","2","0","1","4","Circles overlap: two intersection points."),
(2,"A treasure is the same distance from two trees and exactly 10 m from a rock. The treasure lies on the…","perpendicular bisector of the trees and a circle around the rock","only a circle","an angle bisector","a median","Intersect the two loci."),
(1,"Which set of all points is a straight line (in a plane)?","Equidistant from two points","Fixed distance from a point","Fixed distance from a segment's endpoint","Inside an angle","Perpendicular bisector."),
(2,"How many points in a plane are equidistant from two intersecting lines and 3 cm from their intersection point?","4","2","1","0","Two bisectors each meet the circle twice."),
(3,"Constructing a 30° angle uses…","bisecting a 60° angle","copying a 45° angle","trisecting 90° with straightedge only","doubling 15°","Bisect an equilateral-triangle angle."),
(1,"A compass is used to…","draw circles and arcs","draw lines","measure angles","find slopes","It makes arcs."),
(2,"Which is NOT possible with only compass and straightedge?","Trisecting any angle","Bisecting any angle","Constructing a perpendicular","Constructing 60°","Angle trisection is impossible in general (proved in the 1800s)."),
]
def con():
    for l,st,g,a,b,c,w in CON:MC('con',l,'cn'+st[:14]+str(l),st,g,[a,b,c],[w],b=(l-2)*.6)
def run(n=10):
    for f in (lg1,lg2,lg3,lg4,lg5,lg6,lg7,lg8):rep(f,n)
    con()
