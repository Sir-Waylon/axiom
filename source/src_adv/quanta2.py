# -*- coding: utf-8 -*-
"""Quanta 2: forces, energy, momentum, circular motion and gravity, waves and sound."""
from adv_h import *
G="Use g = 10 m/s²."
CARDS={
'frc':[
("Pushes and pulls","A force is a push or a pull. It is measured in newtons (N). One newton is about the weight of a small apple.",None),
("Balanced and unbalanced forces","If forces balance, the motion does not change: a book on a table stays put. An unbalanced (net) force changes the motion.",None),
("Newton's first law","An object keeps doing what it is doing, at rest or moving in a straight line at steady speed, unless a net force acts on it. This is inertia.",None),
("Newton's second law","The net force on an object equals its mass times its acceleration. Push twice as hard and it accelerates twice as fast. Double the mass and it accelerates half as much.","F = ma"),
("Weight and mass","Mass is how much matter you have (kg). Weight is the pull of gravity on it (N). Weight = mass × g, with g ≈ 10 N/kg near Earth.","W = mg"),
("Friction","Friction opposes sliding. Its maximum size is f = μN, where N is the push of the surface on the object and μ depends on the two surfaces.","f = μN"),
("Newton's third law","When object A pushes on B, B pushes back on A with an equal and opposite force. The two forces act on different objects, so they do not cancel.",None),
("Inclined planes","On a slope, gravity splits into a part along the slope, mg sin θ, and a part into the slope, mg cos θ.","a = g sin θ (no friction)")],
'nrg':[
("Energy and work","Energy is the ability to make things change. Work is energy transferred by a force: lifting a box takes work.","W = F × d"),
("Kinetic energy","Moving things have kinetic energy. It grows with mass and with the square of speed: doubling the speed makes the energy four times bigger.","KE = ½mv²"),
("Potential energy","Raised things can fall, so they store gravitational potential energy.","PE = mgh"),
("Conservation of energy","Energy is never created or destroyed. It changes form. Without friction, KE + PE stays the same along a path.",None),
("Power","Power is how fast energy is used or work is done. One watt is one joule per second.","P = W/t"),
("Springs","A stretched spring pulls back with F = kx and stores energy ½kx².","PE = ½kx²"),
("Work-energy theorem","The net work done on an object equals its change in kinetic energy.","W_net = ΔKE"),
("Efficiency","Efficiency = useful energy out ÷ energy in. No machine is 100% efficient because some energy always turns into heat.",None)],
'mom':[
("Momentum","Momentum is mass times velocity. A heavy truck and a fast bullet can both be hard to stop.","p = mv"),
("Impulse","A force acting for a time changes momentum. A longer time means a smaller force for the same change, which is why airbags help.","FΔt = Δp"),
("Conservation of momentum","In a collision with no outside force, the total momentum before equals the total momentum after.",None),
("Sticking together (inelastic)","If objects stick, they move off together: m₁v₁ + m₂v₂ = (m₁ + m₂)v. Kinetic energy is lost to heat and deformation.",None),
("Bouncing (elastic)","In an elastic collision both momentum and kinetic energy are kept. Equal masses swap velocities.",None),
("Recoil","If two objects start at rest and push apart, their momenta are equal and opposite. The lighter one moves faster.",None),
("Rockets","A rocket pushes gas backward and gains forward momentum. It works in space because it does not push against anything outside.",None),
("Impulse and area","On a force-time graph, the area under the curve is the impulse.",None)],
'cir':[
("Going around","Anything moving in a circle is always turning, so its velocity keeps changing direction. That means it is accelerating even at constant speed.",None),
("Speed on a circle","One lap is 2πr long. If it takes time T, speed v = 2πr/T.","v = 2πr/T"),
("Centripetal acceleration","The acceleration points to the center and equals v²/r. The net force pointing in is the centripetal force, F = mv²/r.","a = v²/r"),
("What provides the force?","Centripetal force is not a new force. It is tension, gravity, friction or a normal force pointing toward the center.",None),
("Gravity between masses","Every pair of masses attracts. F = Gm₁m₂/r². Double the distance and the force becomes one quarter.","F = Gm₁m₂/r²"),
("Orbits","A satellite is falling around Earth. Gravity supplies the centripetal force: GMm/r² = mv²/r, so v = √(GM/r).",None),
("Gravity changes with height","g = GM/r². Moving from the surface to twice the Earth's radius from the center makes g four times smaller.",None),
("Loops and tops of circles","At the top of a vertical loop, gravity and the normal force both point down. The slowest speed that keeps contact is v = √(gr).",None)],
'wav':[
("Waves carry energy","A wave moves energy without moving matter along with it. A stadium wave moves around the arena while each person only stands up and sits down.",None),
("Frequency and period","Frequency f is how many waves pass each second (hertz). Period T is the time for one wave. f = 1/T.","f = 1/T"),
("Wavelength and speed","The wavelength λ is the length of one wave. Wave speed = frequency × wavelength.","v = fλ"),
("Transverse and longitudinal","In a transverse wave the particles move sideways to the motion (light, a rope). In a longitudinal wave they move back and forth along it (sound).",None),
("Sound","Sound is a longitudinal wave in air. It travels about 340 m/s in air, faster in water and fastest in solids.",None),
("Interference","Waves add. Crest meets crest: bigger wave. Crest meets trough: they cancel. Two close frequencies make beats at |f₁ − f₂|.","f_beat = |f₁ − f₂|"),
("Standing waves","On a string fixed at both ends, only certain waves fit: fₙ = n·v/(2L), n = 1, 2, 3, … This is how guitars and organs choose notes.","fₙ = n v/(2L)"),
("Loudness","Intensity falls with the square of distance. Every 10 dB is ten times the intensity. A 10 dB increase sounds about twice as loud.",None)]}
def f1():
    m=rint(2,12)
    return NM('frc','F',f"What is the weight of a {m} kg mass in newtons? {G}",m*10,[f"Weight = mg = {m} × 10.",f"= {m*10} N."],u='N',free=True)
def f2():
    a=rint(2,9);b=rint(2,9)
    return NM('frc','F',f"Two people push a box in the same direction with {a} N and {b} N. What is the total force?",a+b,["Forces in the same direction add.",f"{a} + {b} = {a+b} N."],u='N',free=True)
def f3():
    a=rint(5,30);b=rint(1,a-1)
    return NM('frc','B',f"A box is pushed right with {a} N and left with {b} N. What is the net force (in N, to the right)?",a-b,["Opposite forces subtract.",f"{a} − {b} = {a-b} N to the right."],u='N',free=True)
def f4():
    m=rint(2,12);a=rint(2,9)
    return NM('frc','B',f"What net force makes a {m} kg cart accelerate at {a} m/s²?",m*a,[f"F = ma = {m} × {a}.",f"= {m*a} N."],u='N',free=True)
def f5():
    m=rint(2,10);a=rint(2,8)
    return NM('frc','B',f"A net force of {m*a} N acts on a {m} kg object. What is its acceleration?",a,[f"a = F/m = {m*a}/{m}.",f"= {a} m/s²."],u='m/s²',free=True)
def f6():
    m=rint(5,40);mu=pick([.2,.25,.4,.5])
    return NM('frc','C',f"A {m} kg crate is on a flat floor with μ = {mu}. How large is the maximum friction force? {G}",m*10*mu,[f"N = mg = {m*10} N.",f"f = μN = {mu} × {m*10} = {m*10*mu:g} N."],u='N',free=True)
def f7():
    m=rint(2,10);th=pick([30,45,60]);
    return NM('frc','C',f"A {m} kg block slides down a frictionless slope of {th}°. What is its acceleration? {G} (2 decimals)",round(10*math.sin(math.radians(th)),2),[f"a = g sin θ = 10 sin {th}°.",f"= {10*math.sin(math.radians(th)):.2f} m/s²."],u='m/s²',free=True,tol=0.004)
def f8():
    m=rint(2,8);F=rint(20,60);mu=pick([.1,.2,.3])
    a=(F-mu*m*10)/m
    return NM('frc','C',f"A {m} kg box is pulled with {F} N on a surface with friction μ = {mu}. What is its acceleration? {G}",round(a,3),[f"Friction = μmg = {mu*m*10:g} N.",f"Net = {F} − {mu*m*10:g} = {F-mu*m*10:g} N.",f"a = {F-mu*m*10:g}/{m} = {a:.3f} m/s²."],u='m/s²',free=True,tol=0.004)
def f9():
    m=rint(50,90);a=rint(1,3)
    return NM('frc','C',f"A {m} kg person stands in an elevator accelerating upward at {a} m/s². What is the normal force from the floor? {G}",m*(10+a),[f"N − mg = ma, so N = m(g + a).",f"= {m}({10+a}) = {m*(10+a)} N."],u='N',free=True)
def f10():
    m1=rint(1,4);m2=m1+rint(1,4)
    a=(m2-m1)*10/(m1+m2)
    return NM('frc','M',f"An Atwood machine has masses {m1} kg and {m2} kg on a light pulley. What is the acceleration? {G} (3 decimals)",round(a,3),[f"a = (m₂ − m₁)g/(m₁ + m₂) = ({m2} − {m1})(10)/({m1+m2}).",f"= {a:.3f} m/s²."],u='m/s²',free=True,tol=0.004)
def f11():
    m1=rint(2,6);m2=rint(2,6);F=rint(10,40)
    return NM('frc','M',f"Blocks of {m1} kg and {m2} kg touch on a frictionless table. A force of {F} N pushes the {m1} kg block, which pushes the {m2} kg block. What force does the {m1} kg block exert on the {m2} kg block? (3 decimals)",round(F*m2/(m1+m2),3),[f"a = F/(m₁ + m₂) = {F}/{m1+m2}.",f"Force on block 2 = m₂a = {m2} × {F/(m1+m2):.3f} = {F*m2/(m1+m2):.3f} N."],u='N',free=True,tol=0.004)
def f12():
    th=pick([30,37,45]);mu=pick([.1,.2,.3])
    a=10*(math.sin(math.radians(th))-mu*math.cos(math.radians(th)))
    return NM('frc','M',f"A block slides down a {th}° slope with kinetic friction μ = {mu}. Find its acceleration. {G} (2 decimals)",round(a,2),[f"a = g(sin θ − μ cos θ) = 10(sin {th}° − {mu} cos {th}°).",f"= {a:.2f} m/s²."],u='m/s²',free=True,tol=0.004)
def f13():
    return SA('frc','C',"A book rests on a table. What force pairs with the book's weight in Newton's third law: the table's push up on the book, or the book's pull on Earth?",["the book's pull on earth","book's pull on earth","the book pulls on earth","book pulls on earth","gravitational pull of the book on earth"],["Third-law pairs act on different objects.","Earth pulls the book down, so the book pulls Earth up. The table's push is a different interaction."])
def n1():
    F=rint(2,20);d=rint(2,15)
    return NM('nrg','F',f"You push a box with {F} N for {d} m. How much work do you do?",F*d,[f"Work = force × distance = {F} × {d}.",f"= {F*d} J."],u='J',free=True)
def n2():
    W=rint(2,20)*10;t=rint(2,10)
    return NM('nrg','F',f"A motor does {W*t} J of work in {t} seconds. What is its power?",W,[f"Power = work ÷ time = {W*t} ÷ {t}.",f"= {W} W."],u='W',free=True)
def n3():
    m=rint(2,12);v=rint(2,10)
    return NM('nrg','B',f"What is the kinetic energy of a {m} kg object moving at {v} m/s?",m*v*v/2,[f"KE = ½mv² = ½({m})({v})².",f"= {m*v*v/2:g} J."],u='J',free=True)
def n4():
    m=rint(1,10);h=rint(2,20)
    return NM('nrg','B',f"What is the gravitational potential energy of a {m} kg mass lifted {h} m? {G}",m*10*h,[f"PE = mgh = {m} × 10 × {h}.",f"= {m*10*h} J."],u='J',free=True)
def n5():
    h=rint(2,45)
    return NM('nrg','C',f"A ball is dropped from {h} m (no air resistance). How fast is it moving just before it lands? {G} (2 decimals)",round(math.sqrt(20*h),2),[f"mgh = ½mv², so v = √(2gh) = √(2×10×{h}).",f"= {math.sqrt(20*h):.2f} m/s."],u='m/s',free=True,tol=0.004)
def n6():
    k=rint(1,5)*100;x=pick([.05,.1,.2,.3])
    return NM('nrg','C',f"A spring with k = {k} N/m is stretched {x} m. How much energy does it store?",k*x*x/2,[f"PE = ½kx² = ½({k})({x})².",f"= {k*x*x/2:g} J."],u='J',free=True)
def n7():
    F=rint(2,30);v=rint(2,12)
    return NM('nrg','C',f"An engine pulls with {F*10} N at a steady speed of {v} m/s. What power does it deliver?",F*10*v,[f"P = Fv = {F*10} × {v}.",f"= {F*10*v} W."],u='W',free=True)
def n8():
    e=rint(2,9)*10;win=rint(2,9)*100
    return NM('nrg','C',f"A machine takes in {win} J and does {win*e//100} J of useful work. What is its efficiency in percent?",e,[f"Efficiency = useful/input = {win*e//100}/{win}.",f"= {e}%."],u='%',free=True)
def n9():
    m=rint(2,10);v1=rint(2,8);dv=rint(2,6)
    v2=v1+dv
    return NM('nrg','M',f"The net work on a {m} kg cart increases its speed from {v1} m/s to {v2} m/s. How much work was done?",m*(v2*v2-v1*v1)/2,[f"W = ΔKE = ½m(v₂² − v₁²) = ½({m})({v2*v2} − {v1*v1}).",f"= {m*(v2*v2-v1*v1)/2:g} J."],u='J',free=True)
def n10():
    h=rint(10,40);hb=rint(1,h//2)
    return NM('nrg','M',f"A frictionless roller coaster starts from rest at {h} m. How fast is it going at a point {hb} m above the ground? {G} (2 decimals)",round(math.sqrt(20*(h-hb)),2),[f"Energy conservation: ½v² = g(h − h_b) = 10({h-hb}).",f"v = √{20*(h-hb)} = {math.sqrt(20*(h-hb)):.2f} m/s."],u='m/s',free=True,tol=0.004)
def n11():
    m=rint(1,4);k=rint(2,8)*100;x=pick([.1,.2,.3])
    v=x*math.sqrt(k/m)
    return NM('nrg','M',f"A spring (k = {k} N/m) is compressed {x} m and launches a {m} kg block on a frictionless table. What is the block's speed as it leaves? (3 decimals)",round(v,3),[f"½kx² = ½mv², so v = x√(k/m).",f"v = {x}√({k}/{m}) = {v:.3f} m/s."],u='m/s',free=True,tol=0.004)
def n12():
    m=rint(2,10);h=rint(2,10);mu=pick([.2,.3,.5]);
    d=h/mu
    return NM('nrg','M',f"A {m} kg block slides from rest down a frictionless ramp from height {h} m onto a rough floor (μ = {mu}). How far does it slide on the floor before stopping? (m)",round(d,2),[f"All the PE turns into friction work: mgh = μmg·d.",f"d = h/μ = {h}/{mu} = {d:.2f} m."],u='m',free=True,tol=0.004)
def m1():
    m=rint(2,20);v=rint(2,12)
    return NM('mom','F',f"What is the momentum of a {m} kg cart moving at {v} m/s?",m*v,[f"p = mv = {m} × {v}.",f"= {m*v} kg·m/s."],u='kg·m/s',free=True)
def m2():
    F=rint(2,20);t=rint(2,9)
    return NM('mom','B',f"A {F} N force acts for {t} s. What is the impulse?",F*t,[f"Impulse = FΔt = {F} × {t}.",f"= {F*t} N·s."],u='N·s',free=True)
def m3():
    m=rint(1,5);J=rint(2,6)*m;
    return NM('mom','B',f"An impulse of {J} N·s acts on a {m} kg object at rest. What speed does it reach?",J/m,[f"Δp = J, so mv = {J}.",f"v = {J}/{m} = {J/m:g} m/s."],u='m/s',free=True)
def m4():
    m1=rint(1,6);m2=rint(1,6);v=rint(2,10)
    return NM('mom','C',f"A {m1} kg cart moving at {v} m/s hits and sticks to a {m2} kg cart at rest. What is their common speed? (3 decimals)",round(m1*v/(m1+m2),3),[f"m₁v = (m₁ + m₂)v′, so v′ = {m1}×{v}/{m1+m2}.",f"= {m1*v/(m1+m2):.3f} m/s."],u='m/s',free=True,tol=0.004)
def m5():
    m=rint(40,70);M=rint(2,6)*10;v=rint(2,6)
    return NM('mom','C',f"A {M} kg cart is at rest. A {m} kg person jumps off the back horizontally at {v} m/s. How fast does the cart recoil? (3 decimals)",round(m*v/M,3),["Total momentum stays 0.",f"M·V = m·v, so V = {m}×{v}/{M} = {m*v/M:.3f} m/s."],u='m/s',free=True,tol=0.004)
def m6():
    m=rint(1,5);v=rint(2,12)
    return NM('mom','C',f"Two identical {m} kg carts collide elastically head-on. Cart A moves at {v} m/s and cart B is at rest. What is B's speed afterward?",v,["Equal masses in a 1-D elastic collision swap velocities.",f"B moves at {v} m/s."],u='m/s',free=True)
def m7():
    m=rint(1,4);v=rint(4,12)
    return NM('mom','M',f"A {m} kg ball moving at {v} m/s sticks to an equal mass at rest. How much kinetic energy is lost? (J)",m*v*v/4,[f"Before: ½({m})({v})² = {m*v*v/2:g} J.",f"After: speed {v/2:g} m/s, KE = ½({2*m})({v/2:g})² = {m*v*v/4:g} J.",f"Lost = {m*v*v/4:g} J."],u='J',free=True)
def m8():
    m1=rint(1,4);m2=rint(1,4);v1=rint(3,8);v2=rint(-6,-1)
    return NM('mom','M',f"A {m1} kg cart moving right at {v1} m/s collides head-on with a {m2} kg cart moving left at {abs(v2)} m/s and they stick. What is their velocity (right is positive)? (3 decimals)",round((m1*v1+m2*v2)/(m1+m2),3),[f"Total momentum = {m1}({v1}) + {m2}({v2}) = {m1*v1+m2*v2}.",f"v = {m1*v1+m2*v2}/{m1+m2} = {(m1*v1+m2*v2)/(m1+m2):.3f} m/s."],u='m/s',free=True,tol=0.004)
def c1():
    r=rint(2,20);T=rint(2,10)
    return NM('cir','B',f"A toy goes around a circle of radius {r} m once every {T} s. What is its speed? (2 decimals; π ≈ 3.1416)",round(2*math.pi*r/T,2),[f"v = 2πr/T = 2π({r})/{T}.",f"= {2*math.pi*r/T:.2f} m/s."],u='m/s',free=True,tol=0.004)
def c2():
    v=rint(2,20);r=rint(2,10)
    return NM('cir','C',f"Find the centripetal acceleration of an object moving at {v} m/s on a circle of radius {r} m. (3 decimals)",round(v*v/r,3),[f"a = v²/r = {v}²/{r}.",f"= {v*v/r:.3f} m/s²."],u='m/s²',free=True,tol=0.004)
def c3():
    m=rint(2,10);v=rint(2,12);r=rint(2,8)
    return NM('cir','C',f"What centripetal force keeps a {m} kg object moving at {v} m/s on a circle of radius {r} m? (3 decimals)",round(m*v*v/r,3),[f"F = mv²/r = {m}({v})²/{r}.",f"= {m*v*v/r:.3f} N."],u='N',free=True,tol=0.004)
def c4():
    d=rint(2,5)
    return NM('cir','C',f"By what factor does gravity between two masses change if the distance between them is multiplied by {d}? (Give a decimal.)",round(1/d**2,4),["F ∝ 1/r².",f"1/{d}² = {1/d**2:.4f}."],tol=0.01)
def c5():
    r=rint(2,10)
    return NM('cir','M',f"A car goes over a circular hilltop of radius {r*10} m. At what speed does the car just lose contact with the road? {G} (2 decimals)",round(math.sqrt(10*r*10),2),[f"At loss of contact N = 0 so mg = mv²/r.",f"v = √(gr) = √(10×{r*10}) = {math.sqrt(100*r):.2f} m/s."],u='m/s',free=True,tol=0.004)
def c6():
    k=pick([2,3])
    return NM('cir','M',f"A satellite moves from a circular orbit of radius r to one of radius {k}r. By what factor does its orbital speed change? (Give a decimal, 3 places.)",round(1/math.sqrt(k),3),["v = √(GM/r), so v ∝ 1/√r.",f"New/old = 1/√{k} = {1/math.sqrt(k):.3f}."],tol=0.004)
def c7():
    h=rint(1,3)
    return NM('cir','M',f"At a height of {h} Earth radii above the surface (distance {h+1} Earth radii from the center), g is what fraction of its surface value? (3 decimals)",round(1/(h+1)**2,3),[f"g ∝ 1/r². The distance is {h+1} times larger.",f"g/g₀ = 1/{(h+1)**2} = {1/(h+1)**2:.3f}."],tol=0.01)
def w1():
    f=rint(2,20)
    return NM('wav','F',f"A wave has a frequency of {f} Hz. How many waves pass each second?",f,["Hertz means waves per second.",f"{f} waves."])
def w2():
    f=pick([2,4,5,8,10,20,25,50])
    return NM('wav','B',f"A wave has frequency {f} Hz. What is its period in seconds?",1/f,[f"T = 1/f = 1/{f}.",f"= {1/f:g} s."],u='s',free=True)
def w3():
    f=rint(2,20)*10;l=pick([0.5,1,2,3,4])
    return NM('wav','B',f"A wave has frequency {f} Hz and wavelength {l} m. What is its speed?",f*l,[f"v = fλ = {f} × {l}.",f"= {f*l:g} m/s."],u='m/s',free=True)
def w4():
    d=rint(2,30)*17
    return NM('wav','C',f"You shout at a cliff and hear the echo after {d/170:g} s. Sound travels 340 m/s. How far away is the cliff?",d,[f"The sound goes there and back: total distance = 340 × {d/170:g} = {2*d} m.",f"Cliff distance = {d} m."],u='m',free=True)
def w5():
    v=rint(2,10)*40;L=pick([0.5,0.8,1.0,1.2]);n=rint(1,4)
    return NM('wav','C',f"A string {L} m long fixed at both ends supports waves moving at {v} m/s. What is the frequency of harmonic n = {n}?",n*v/(2*L),[f"fₙ = n·v/(2L) = {n}({v})/(2×{L}).",f"= {n*v/(2*L):g} Hz."],u='Hz',free=True,tol=0.004)
def w6():
    f1=rint(400,500);d=rint(2,8)
    return NM('wav','M',f"Two tuning forks sound at {f1} Hz and {f1+d} Hz. How many beats per second do you hear?",d,["Beat frequency = |f₁ − f₂|.",f"= {d} Hz."],u='Hz',free=True)
def w7():
    n=rint(1,3)
    return NM('wav','M',f"A sound's intensity is increased by a factor of {10**n}. By how many decibels does the level increase? (10 dB per factor of 10)",10*n,[f"Each factor of 10 adds 10 dB: {n} factor(s) of 10.",f"= {10*n} dB."],u='dB',free=True)
def w8():
    L=pick([0.6,0.8,1.0]);v=340
    return NM('wav','M',f"A pipe open at both ends is {L} m long. What is its fundamental frequency? (Speed of sound 340 m/s; f₁ = v/(2L); 1 decimal)",round(v/(2*L),1),[f"f₁ = v/(2L) = 340/(2×{L}).",f"= {v/(2*L):.1f} Hz."],u='Hz',free=True,tol=0.004)
FAMS=[f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f11,f12,f13,n1,n2,n3,n4,n5,n6,n7,n8,n9,n10,n11,n12,m1,m2,m3,m4,m5,m6,m7,m8,c1,c2,c3,c4,c5,c6,c7,w1,w2,w3,w4,w5,w6,w7,w8]
def run(n=14):
    for f in FAMS:gen.rep(f,n)
