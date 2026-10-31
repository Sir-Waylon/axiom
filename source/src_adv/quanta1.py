# -*- coding: utf-8 -*-
"""Quanta 1: motion and DC circuits (first topics)."""
from adv_h import *
CARDS={
'kin':[
("Speed","Speed tells how far something goes in a certain time. Going 60 km in 2 hours is 30 kilometers every hour.","speed = distance ÷ time"),
("Velocity and direction","Velocity is speed with a direction. Walking 3 m/s north and 3 m/s south have the same speed but opposite velocities.",None),
("Acceleration","Acceleration is how fast velocity changes. A car going from 0 to 20 m/s in 4 s gains 5 m/s every second.","a = Δv ÷ Δt"),
("Falling objects","Near Earth, anything in free fall (no air drag) speeds up by about 9.8 m/s every second, no matter its mass.","g = 9.8 m/s²"),
("Constant-acceleration equations","When acceleration is steady: v = v₀ + at, and d = v₀t + ½at². Pick the one that has the quantities you know.","v = v₀ + at;  d = v₀t + ½at²"),
("Reading motion graphs","On a position-time graph, slope is velocity. On a velocity-time graph, slope is acceleration and area is displacement.",None)],
'ohm':[
("Charge, current and voltage","Current is how much charge flows past a point each second. Voltage is the push that makes charge flow, like water pressure in a pipe.","I = Q ÷ t"),
("Resistance","Resistance is how much a part holds back current, like a narrow pipe. It is measured in ohms (Ω).",None),
("Ohm's law","Voltage, current and resistance are linked: V = I × R. Double the voltage and the current doubles.","V = IR"),
("Series circuits","In series there is one path. The same current goes through every part, resistances add, and voltages share the supply.","R = R₁ + R₂ + …"),
("Parallel circuits","In parallel there are branches. Every branch gets the full supply voltage, and the currents add.","1/R = 1/R₁ + 1/R₂ + …"),
("Electric power","Power is how fast energy is used. A 60 W bulb uses 60 joules every second.","P = IV = I²R = V²/R")]}
def k1():
    v=rint(2,9);t=rint(2,9)
    return NM('kin','F',f"A bike goes {v*t} meters in {t} seconds at a steady speed. How many meters per second is that?",v,[f"Speed = distance ÷ time = {v*t} ÷ {t}.",f"= {v} m/s."],u='m/s',free=True)
def k2():
    v=rint(2,9);t=rint(3,12)
    return NM('kin','F',f"A runner keeps a steady speed of {v} m/s. How far does she go in {t} seconds?",v*t,[f"Distance = speed × time = {v} × {t}.",f"= {v*t} m."],u='m',free=True)
def k3():
    a=rint(2,6);t=rint(2,8)
    return NM('kin','B',f"A car starts from rest and speeds up at {a} m/s². What is its speed after {t} s?",a*t,[f"v = at = {a} × {t}.",f"= {a*t} m/s."],u='m/s',free=True)
def k4():
    a=rint(2,6);t=rint(2,8)
    return NM('kin','B',f"A cyclist at rest accelerates at {a} m/s² for {t} s. How far does she travel? (d = ½at²)",a*t*t/2,[f"d = ½ × {a} × {t}² = ½ × {a} × {t*t}.",f"= {a*t*t/2} m."],u='m',free=True)
def k5():
    t=rint(1,6)
    return NM('kin','B',f"An apple falls from rest for {t} s (ignore air). Use g = 10 m/s². How fast is it going?",10*t,[f"v = gt = 10 × {t}.",f"= {10*t} m/s."],u='m/s',free=True)
def k6():
    t=rint(1,5)
    return NM('kin','C',f"A stone is dropped from rest. Using g = 10 m/s², how far does it fall in {t} s?",5*t*t,[f"d = ½gt² = ½(10)({t})².",f"= {5*t*t} m."],u='m',free=True)
def k7():
    v0=rint(2,12);a=rint(1,5);t=rint(2,8)
    return NM('kin','C',f"A scooter moving at {v0} m/s speeds up at {a} m/s² for {t} s. How far does it go in that time?",v0*t+a*t*t/2,[f"d = v₀t + ½at² = {v0}({t}) + ½({a})({t})².",f"= {v0*t} + {a*t*t/2} = {v0*t+a*t*t/2} m."],u='m',free=True)
def k8():
    v=rint(10,40);a=rint(2,5)
    return NM('kin','C',f"A car going {v} m/s brakes steadily at {a} m/s². How many seconds until it stops? (Give a number.)",Fr(v,a),[f"v = v₀ − at = 0, so t = v₀/a = {v}/{a}.",f"t ≈ {v/a:.2f} s."],u='s',free=True,tol=0.01)
def k9():
    v0=rint(2,8);a=rint(2,6);d=rint(10,60)
    vf=math.sqrt(v0*v0+2*a*d)
    return NM('kin','M',f"An object at {v0} m/s accelerates uniformly at {a} m/s² over {d} m. What is its final speed? (v² = v₀² + 2ad)",round(vf,3),[f"v² = {v0}² + 2({a})({d}) = {v0*v0+2*a*d}.",f"v = √{v0*v0+2*a*d} ≈ {vf:.2f} m/s."],u='m/s',free=True,tol=0.005)
def k10():
    h=rint(5,80)
    t=math.sqrt(2*h/10)
    return NM('kin','M',f"A ball is dropped from {h} m (g = 10 m/s², no air). How long does it take to land?",round(t,3),[f"h = ½gt², so t = √(2h/g) = √({2*h}/10).",f"t ≈ {t:.2f} s."],u='s',free=True,tol=0.005)
def o1():
    i=rint(2,9);t=rint(2,9)
    return NM('ohm','F',f"A wire carries {i} coulombs of charge past a point every second. In {t} seconds, how many coulombs pass?",i*t,[f"Charge = current × time = {i} × {t}.",f"= {i*t} C."],u='C',free=True)
def o2():
    v=rint(2,12);r=rint(2,9)
    return NM('ohm','B',f"A {v*r} V supply is connected across a {r} Ω resistor. What current flows? (I = V/R)",v,[f"I = V/R = {v*r}/{r}.",f"= {v} A."],u='A',free=True)
def o3():
    i=rint(2,9);r=rint(2,12)
    return NM('ohm','B',f"A {r} Ω resistor carries {i} A. What is the voltage across it?",i*r,[f"V = IR = {i} × {r}.",f"= {i*r} V."],u='V',free=True)
def o4():
    r1=rint(2,12);r2=rint(2,12)
    return NM('ohm','B',f"Two resistors of {r1} Ω and {r2} Ω are in series. What is the total resistance?",r1+r2,["In series, resistances add.",f"{r1} + {r2} = {r1+r2} Ω."],u='Ω',free=True)
def o5():
    r=rint(2,9)*2;n=2
    return NM('ohm','C',f"Two identical {r} Ω resistors are in parallel. What is the equivalent resistance?",r//2,["For two equal resistors in parallel, R = R₁/2.",f"{r}/2 = {r//2} Ω."],u='Ω',free=True)
def o6():
    a=rint(2,6);b=rint(2,6)
    r1=a*(a+b);r2=b*(a+b)
    return NM('ohm','C',f"A {r1} Ω and a {r2} Ω resistor are in parallel. What is the equivalent resistance? (Use R = R₁R₂/(R₁ + R₂).)",Fr(r1*r2,r1+r2),[f"R = ({r1})({r2})/({r1}+{r2}) = {r1*r2}/{r1+r2}.",f"= {num(Fr(r1*r2,r1+r2))} Ω."],u='Ω',free=True)
def o7():
    v=rint(3,24);r=rint(2,12)
    return NM('ohm','C',f"A {r} Ω heater is connected to {v} V. How much power does it use? (P = V²/R)",round(v*v/r,3),[f"P = V²/R = {v}²/{r} = {v*v}/{r}.",f"≈ {v*v/r:.2f} W."],u='W',free=True,tol=0.005)
def o8():
    v=rint(6,24);r1=rint(2,9);r2=rint(2,9)
    return NM('ohm','M',f"A {v} V battery drives a {r1} Ω resistor in series with a {r2} Ω resistor. What voltage is across the {r2} Ω resistor?",round(v*r2/(r1+r2),3),[f"Total R = {r1+r2} Ω, so I = {v}/{r1+r2} A.",f"V₂ = I × {r2} = {v*r2/(r1+r2):.3f} V."],u='V',free=True,tol=0.005)
FAMS=[k1,k2,k3,k4,k5,k6,k7,k8,k9,k10,o1,o2,o3,o4,o5,o6,o7,o8]
def run(n=14):
    for f in FAMS:gen.rep(f,n)
