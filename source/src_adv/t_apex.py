# -*- coding: utf-8 -*-
"""Apex: algebra, Algebra 2, trigonometry and some precalculus (calculus and AP statistics removed; geometry is merged in from the geometry pack)."""
from adv_h import *
import importlib
MODS=[m for m in ('apex1','apex2','apex3','apex4','apex5','apex6') if os.path.exists(os.path.join(D,m+'.py'))]
mods=[importlib.import_module(m) for m in MODS]
import random
REMOVE={'ti','iv','id','lm','dv','da','in','st','mv','sr'}   # calculus, AP statistics, multivariable and the advanced trig identities (conics, polar and laws of sines/cosines stay)
TOPS={'fn':('Functions & transformations','Algebra 2'),'qd2':('Quadratics & complex numbers','Algebra 2'),'pl':('Polynomials','Algebra 2'),
'ra':('Rational functions','Algebra 2'),'ex':('Exponential functions','Algebra 2'),'lg':('Logarithms','Algebra 2'),'sq':('Sequences & series','Algebra 2'),
'tc':('Right triangles & the unit circle','Trigonometry'),'tg':('Graphs of trig functions','Trigonometry'),'ti':('Identities & trig equations','Trigonometry'),'iv':('Inverse trig functions','Trigonometry'),'id':('Angle identities','Trigonometry'),'tl':('Laws of sines & cosines, vectors','Trigonometry'),
'cn':('Conic sections','Precalculus'),'pp':('Polar & parametric','Precalculus'),'lm':('Limits & continuity','Calculus'),'dv':('Derivatives','Calculus'),'da':('Using derivatives','Calculus'),'in':('Integrals','Calculus'),'st':('AP Statistics','AP Statistics'),'mv':('Multivariable calculus','Calculus III'),'sr':('Series & parametric','Calculus III')}
for _k in REMOVE:TOPS.pop(_k,None)
CARDS={}
for m in mods:CARDS.update(m.CARDS)
for _k in REMOVE:CARDS.pop(_k,None)
TOP=[(k,v[0],v[1]) for k,v in TOPS.items() if k in CARDS]
META=dict(id='apex-math-2027',title='Apex: Algebra, Geometry and Precalculus',division='8-9',year=2027,org='PAUSD',tag='Middle and high school math',
 facts=[['Algebra','Equations to series'],['Geometry','Proofs to solids'],['Trig','Unit circle, laws'],['Precalc','Conics, polar']],
 intro='Start from ideas a 5th grader knows and climb through Algebra, Geometry, Algebra 2, trigonometry and some precalculus. Short lessons, typed answers, graphs you can tap, and worked solutions.',
 levels=['Rookie','Variable','Function','Graph','Root','Angle','Limit','Slope','Area','Apex'],stationsLabel='Mini-labs',
 scope=dict(core=[],adjacent=[],skip=[],stations=[],sources=[]))
GLOSS=[("Function","A rule that gives each input exactly one output."),("Domain","All allowed inputs."),("Range","All possible outputs."),("Inverse function","A function that undoes another: swaps inputs and outputs."),("Discriminant","b² − 4ac; tells how many real roots a quadratic has."),("Imaginary unit","i, defined by i² = −1."),("Polynomial","A sum of terms that are numbers times whole-number powers of x."),("Root (zero)","An input where the function equals 0."),("Remainder theorem","Dividing f(x) by (x − a) leaves remainder f(a)."),("Factor theorem","(x − a) is a factor of f exactly when f(a) = 0.")]
STUCK=["Write what you know and what you must find.","Try a small number first to see the pattern.","Sketch a graph. What shape is it?","Check your answer by plugging it back in."]
WEEKS=[('Functions',['fn']),('Quadratics and complex numbers',['qd2']),('Polynomials',['pl']),('Rational functions',['ra']),('Exponentials and logs',['ex','lg']),('Sequences and series',['sq']),('Right triangles and the unit circle',['tc']),('Graphing trig',['tg']),('Laws of sines and cosines',['tl']),('Conics and polar',['cn','pp'])]
WRITTEN=[["Explain why dividing by zero is not allowed.","If a ÷ 0 = b, then b × 0 = a. But anything times 0 is 0, so no number b works unless a is 0, and then every b works. The answer is either impossible or not unique."],
["Why does a polynomial of degree n have at most n roots?","Each root gives a linear factor (x − r). Degree n allows at most n such factors."]]
BENCH=[["Rate of change on a ramp","Roll a toy car down a ramp and time it over several distances. Plot distance against time and compare the slopes."]]
CHECK=['Bring pencils and a calculator if allowed.','Read every question twice.','Show your work on free-response items.','Check answers by plugging back in.']
def run(n=14):
    for m in mods:m.run(n)
    gen.OUT[:]=[q for q in gen.OUT if q['t'] not in REMOVE]
