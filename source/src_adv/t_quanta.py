# -*- coding: utf-8 -*-
"""Quanta: electrical engineering and middle/high-school physics."""
from adv_h import *
import importlib
MODS=[m for m in ('quanta1','quanta2','quanta3','quanta4','quanta5') if os.path.exists(os.path.join(D,m+'.py'))]
mods=[importlib.import_module(m) for m in MODS]
TOPS={'rot':('Rotation & torque','Physics'),'sho':('Oscillations & SHM','Physics'),'flu':('Fluids','Physics'),'gas':('Gases & thermodynamics','Physics'),'mod':('Quantum & nuclear physics','Physics'),'gau':('Electric potential & Gauss’s law','Electricity & magnetism'),'lor':('Magnetic forces, Ampère & Faraday (AP E&M)','Electricity & magnetism'),'mxw':('Electromagnetic waves & wave optics','Physics'),'cal':('Calculus-based mechanics (AP C)','Physics'),'orb':('Gravitation & orbits','Physics'),'dim':('Physicist’s toolkit: vectors, units, estimation','Physics'),
'kin':('Motion & kinematics','Physics'),'frc':('Forces & Newton’s laws','Physics'),'nrg':('Work, energy & power','Physics'),'mom':('Momentum & collisions','Physics'),'cir':('Circular motion & gravity','Physics'),'wav':('Waves & sound','Physics'),'opt':('Light & optics','Physics'),'thm':('Heat & thermodynamics','Physics'),'est':('Electric fields & charge','Physics'),
'ohm':('Ohm’s law & DC circuits','Electrical engineering'),'kvl':('Kirchhoff & network analysis','Electrical engineering'),'rc':('Capacitors, inductors & transients','Electrical engineering'),'ac':('AC, phasors & impedance','Electrical engineering'),'flt':('Resonance & filters','Electrical engineering'),'dev':('Diodes, transistors & op-amps','Electrical engineering'),'dig':('Digital logic','Electrical engineering'),'mag':('Magnetism & induction','Electrical engineering'),'pwr':('Power & transformers','Electrical engineering')}
CARDS={}
for m in mods:CARDS.update(m.CARDS)
ORDER=['dim','kin','frc','nrg','mom','rot','cir','orb','sho','cal','flu','wav','mxw','opt','thm','gas','est','gau','ohm','kvl','rc','mag','lor','ac','flt','dev','dig','pwr','mod']
ORDER+=[k for k in TOPS if k not in ORDER]
TOP=[(k,TOPS[k][0],TOPS[k][1]) for k in ORDER if k in CARDS and k in TOPS]
META=dict(id='quanta-physics-2027',title='Quanta: Physics and Electrical Engineering',division='8-9',year=2027,org='PAUSD',tag='8th-grade physics to AP Physics and E&M',
 facts=[['Physics','Motion to waves'],['Circuits','DC to AC'],['Devices','Diodes to op-amps'],['Digital','Logic and binary']],
 intro='Start from everyday ideas and climb through Physics 1 and 2, AP Physics C mechanics and E&M, and electrical engineering. Short lessons, typed answers, and worked solutions.',
 levels=['Rookie','Spark','Current','Field','Wave','Circuit','Signal','Quantum','Engineer','Quanta'],stationsLabel='Mini-labs',
 scope=dict(core=[],adjacent=[],skip=[],stations=[],sources=[]))
GLOSS=[("Velocity","Speed in a given direction."),("Acceleration","The rate at which velocity changes."),("Force","A push or pull; measured in newtons."),("Energy","The ability to do work; measured in joules."),("Power","Energy used per second; measured in watts."),("Current","Charge flowing per second; measured in amperes."),("Voltage","Energy per unit charge; the push that drives current."),("Resistance","How strongly a part opposes current; measured in ohms."),("Capacitor","A part that stores energy in an electric field."),("Inductor","A part that stores energy in a magnetic field.")]
STUCK=["List what you know, with units.","Pick the formula that links what you know to what you want.","Check the units on both sides.","Does the size of your answer make sense?"]
WEEKS=[(TOPS[k][0],[k]) for k in ORDER if k in TOPS]
WRITTEN=[["Why do heavy and light objects fall together?","Gravity pulls harder on a heavier object, but a heavier object also resists acceleration more. The two effects cancel, so all objects fall with the same acceleration when air drag is ignored."],
["Why does a series circuit go dark when one bulb is removed?","There is only one path. Removing a part breaks the loop, so the current stops everywhere."]]
BENCH=[["Ohm's law with a battery and bulb","Measure the voltage across and current through one, two and three bulbs in series. Plot V against I and find the slope."],["Pendulum timer","Time ten swings of strings with different lengths. Compare period against length."]]
CHECK=['Bring pencils and a calculator if allowed.','Write units on every number.','Show formulas and substitutions.','Check that your answer is reasonable.']
def run(n=14):
    for m in mods:m.run(n)
