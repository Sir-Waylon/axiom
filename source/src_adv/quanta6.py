# -*- coding: utf-8 -*-
"""Quanta 6: basic middle/high-school physics topics that replace the advanced (AP C / E&M / AC) material.
Topics: mac (work and simple machines), mat (matter, density, pressure), hea (temperature and heat), ene (energy in everyday life)."""
from adv_h import *
CARDS={
'mac':[
("Work: force times distance","In physics, work happens only when a force moves something in the direction of the push. Pushing a box 4 m with 10 N does 40 joules of work. Pushing a wall that does not move does no work at all, even if you get tired.","W = F × d"),
("Power: how fast work is done","Power is work divided by time. Two people can lift the same box to the same shelf (the same work), but the one who does it in half the time has twice the power. One watt is one joule every second.","P = W ÷ t"),
("Simple machines trade force for distance","A lever, ramp, pulley, wheel and axle, wedge and screw all make a job easier by letting you push with a smaller force over a longer distance. They never reduce the amount of work. If you use half the force you must push twice as far.",None),
("Levers and the balance rule","A lever turns around a pivot (fulcrum). It balances when force × distance from the pivot is equal on both sides. A long handle lets a small effort balance a big load, like a see-saw with a heavy kid sitting close to the middle.","F₁ × d₁ = F₂ × d₂"),
("Ramps (inclined planes)","Lifting a load straight up needs a force equal to its weight. A ramp spreads the same lifting over a longer path, so you push with less force. A ramp 4 times longer than its height needs about 1/4 of the force (ignoring friction).","effort ≈ load × height ÷ length"),
("Pulleys","A fixed pulley only changes the direction of the pull. A movable pulley shares the load between rope sections: with n rope sections holding the load, the effort is the load ÷ n, but you pull n times as much rope.","effort = load ÷ n"),
("Mechanical advantage","Mechanical advantage (MA) tells how many times a machine multiplies your force. MA = load ÷ effort. An MA of 3 means a 30 N effort lifts a 90 N load. The price is distance: you move your hand 3 times as far.","MA = load ÷ effort"),
("Efficiency","Real machines waste some energy as heat from friction, so the useful work out is always less than the work you put in. Efficiency is the useful fraction, written as a percent. It can never be above 100%.","efficiency = work out ÷ work in × 100%")],
'mat':[
("Mass, volume and density","Mass is how much matter there is, volume is how much space it takes up, and density is how tightly the matter is packed. Lead is dense, foam is not. Two objects of the same size can have very different masses.","density = mass ÷ volume"),
("Units of density","Water has a density of 1 g/cm³ (the same as 1000 kg/m³). A cubic centimetre is the size of a sugar cube. To get volume of a box multiply length × width × height.",None),
("Sinking and floating","An object floats in a liquid if it is less dense than the liquid, and sinks if it is denser. A steel ship floats because its hollow shape makes its overall density (steel plus air inside) less than water.",None),
("Measuring volume by displacement","An irregular object like a rock takes up space. Put it in a measuring cylinder and the water level rises by exactly the rock’s volume. 1 mL equals 1 cm³.",None),
("Buoyant force","A liquid pushes up on anything in it. The push equals the weight of the liquid the object pushes out of the way. A floating object pushes aside exactly its own weight of liquid.","buoyant force = weight of displaced liquid"),
("Pressure","Pressure is how concentrated a force is. The same weight on a small area gives a high pressure (a high heel), and spread over a big area gives low pressure (a snowshoe). The unit is the pascal (1 Pa = 1 N/m²).","P = F ÷ A"),
("Pressure in liquids","Pressure increases with depth because there is more water above pushing down. It acts in all directions. In water, every 10 m of depth adds about one extra atmosphere (about 100,000 Pa).","P = ρ × g × depth"),
("States of matter","Solids keep their shape and volume. Liquids keep their volume but take the shape of the container. Gases fill the whole container. Heat moves particles faster, which can change one state to another.",None)],
'hea':[
("Temperature and heat are different","Temperature tells how fast the particles in something are jiggling on average. Heat is the energy that flows from a hotter object to a colder one. A bathtub of warm water holds more heat energy than a cup of boiling water, even though the cup has a higher temperature.",None),
("Temperature scales","Water freezes at 0 °C (32 °F) and boils at 100 °C (212 °F). Kelvin starts at absolute zero: K = °C + 273. To change °C to °F multiply by 9/5 and add 32.","°F = °C × 9/5 + 32"),
("Conduction","Conduction is heat passing through direct contact, as in a metal spoon heating up in hot soup. Metals conduct well; wood, plastic and air do not, so they are used as insulators.",None),
("Convection","Convection is heat carried by moving fluid. Warm air or water is less dense, so it rises while cooler fluid sinks, making a loop. It is why heaters work best low in a room and why a sea breeze forms.",None),
("Radiation","Radiation is heat carried by light, mostly infrared. It needs no material, which is how the Sun warms the Earth through empty space. Dark surfaces absorb more; shiny surfaces reflect more.",None),
("Specific heat","Different materials need different amounts of energy to warm up. Water needs 4.18 joules to warm 1 gram by 1 °C, a lot, which is why oceans warm and cool slowly. The heat needed is q = m × c × ΔT.","q = m × c × ΔT"),
("Changing state","While ice melts or water boils, the temperature stays constant: the heat goes into breaking the bonds between particles instead of speeding them up. Melting ice takes 334 J per gram.","q = m × L"),
("Reaching the same temperature","When a hot and a cold object touch, heat flows until both reach the same temperature (thermal equilibrium). With equal masses of the same material, the final temperature is the average.",None)],
'ene':[
("Forms of energy","Energy comes in forms: kinetic (motion), gravitational potential (height), thermal, chemical, electrical, light, sound and nuclear. Energy is measured in joules (J).",None),
("Kinetic energy","Moving things have kinetic energy. It grows with mass but with the square of speed: doubling speed makes it 4 times larger, which is why fast crashes are so much worse.","KE = ½ × m × v²"),
("Gravitational potential energy","Lifting something stores energy in it. The higher and heavier the object, the more it stores. On Earth, g is about 10 N per kilogram (9.8 more exactly).","PE = m × g × h"),
("Conservation of energy","Energy is never made or destroyed, only changed from one form to another. A roller coaster trades height for speed: PE at the top becomes KE at the bottom. With no friction, the total stays the same.",None),
("Energy transformations","Everyday devices change energy forms: a light bulb turns electrical into light and heat; a battery turns chemical into electrical; a solar panel turns light into electrical. Some always becomes thermal energy.",None),
("Power and energy use","Power is the rate of using energy: watts = joules per second. A 100 W bulb on for 10 s uses 1000 J. Utilities charge in kilowatt-hours: kW × hours.","E = P × t"),
("Efficiency","No device is perfect. An old bulb may give only 5% of the electrical energy as light and waste the rest as heat. Efficiency is useful energy out ÷ total energy in.",None),
("Energy sources","Fossil fuels, nuclear, wind, solar, hydro, geothermal and biomass are the main sources. Renewable sources are replaced naturally, but each has trade-offs such as cost, land use, reliability and waste.",None)]}

def pb(*xs):return list(xs)
# ---------------- mac ----------------
def m1():
    f=rint(3,40);d=rint(2,15)
    return NM('mac','F',f"You push a crate with a steady force of {f} N for {d} m. How much work do you do?",f*d,[f"Work = force × distance = {f} × {d}.",f"= {f*d} J."],u='J',free=True)
def m2():
    w=rint(2,30)*10;t=rint(2,12)
    return NM('mac','F',f"A machine does {w*t} J of work in {t} s. What is its power?",w,[f"Power = work ÷ time = {w*t} ÷ {t}.",f"= {w} W."],u='W',free=True)
def m3():
    p=rint(2,20)*10;t=rint(3,20)
    return NM('mac','B',f"A motor with a power of {p} W runs for {t} s. How much work does it do?",p*t,[f"Work = power × time = {p} × {t}.",f"= {p*t} J."],u='J',free=True)
def m4():
    m=rint(2,15);h=rint(2,12)
    return NM('mac','B',f"A student lifts a {m} kg box straight up {h} m. The force needed is its weight (use 10 N per kg). How much work is done?",m*10*h,[f"Weight = {m} × 10 = {m*10} N.",f"Work = {m*10} × {h} = {m*10*h} J."],u='J',free=True)
def m5():
    l=rint(2,9);dl=rint(2,9);de=rint(2,9);e=Fr(l*dl,de)
    return NM('mac','B',f"A lever balances when force × distance is equal on both sides. A {l*10} N load sits {dl} m from the pivot. How much effort is needed {de} m from the pivot on the other side?",round(float(e*10),2),[f"Balance: effort × {de} = {l*10} × {dl}.",f"Effort = {l*10*dl} ÷ {de} = {num(Fr(l*10*dl,de))} N."],u='N',free=True)
def m6():
    ld=rint(2,10)*10;e=rint(2,ld//10)*5
    ma=Fr(ld,e)
    return NM('mac','B',f"A machine lifts a {ld} N load using an effort of {e} N. What is its mechanical advantage?",round(float(ma),2),[f"MA = load ÷ effort = {ld} ÷ {e}.",f"= {num(ma)}."],free=True)
def m7():
    h=rint(1,4);k=rint(2,6);ld=rint(2,12)*10
    return NM('mac','C',f"A ramp {h*k} m long rises {h} m. Ignoring friction, what effort pushes a {ld} N load up the ramp? (effort = load × height ÷ length)",round(ld/k,2),[f"Effort = {ld} × {h} ÷ {h*k}.",f"= {ld}/{k} = {ld/k:.2f} N."],u='N',free=True)
def m8():
    n=rint(2,6);ld=n*rint(2,15)*5
    return NM('mac','C',f"A pulley system has {n} rope sections supporting the load. What effort lifts a {ld} N load (ignore friction)?",ld//n,[f"Effort = load ÷ number of supporting sections = {ld} ÷ {n}.",f"= {ld//n} N."],u='N',free=True)
def m9():
    n=rint(2,6);h=rint(1,6)
    return NM('mac','C',f"A pulley system with {n} supporting rope sections raises a load {h} m. How much rope must you pull?",n*h,[f"Rope pulled = number of sections × height = {n} × {h}.",f"= {n*h} m."],u='m',free=True)
def m10():
    wi=rint(2,10)*50;e=rint(40,90)
    wo=wi*e/100
    return NM('mac','C',f"A machine takes in {wi} J of energy and its efficiency is {e}%. How much useful work comes out?",round(wo,2),[f"Useful work = efficiency × input = {e}% of {wi}.",f"= {wo:g} J."],u='J',free=True)
def m11():
    wi=rint(5,20)*20;wo=wi*rint(4,9)/10
    return NM('mac','C',f"A winch uses {wi} J of energy and lifts a load, doing {wo:g} J of useful work. What is the efficiency, in percent?",round(wo/wi*100,1),[f"Efficiency = useful work out ÷ work in = {wo:g} ÷ {wi}.",f"= {wo/wi*100:.0f}%."],u='%',free=True)
def m12():
    r=rint(1,4)*5;R=r*rint(2,6)
    return NM('mac','C',f"A wheel and axle has a wheel radius of {R} cm and an axle radius of {r} cm. What is its ideal mechanical advantage? (MA = wheel radius ÷ axle radius)",round(R/r,2),[f"MA = {R} ÷ {r}.",f"= {R/r:.2f}."],free=True)
def m13():
    items=[("a see-saw","lever"),("a wheelbarrow","lever"),("a pair of scissors","lever"),("a ramp for a wheelchair","inclined plane"),("a flagpole rope","pulley"),("a doorknob","wheel and axle"),("a screwdriver handle","wheel and axle"),("a knife blade","wedge"),("an axe head","wedge"),("a spiral jar lid","screw")]
    n,a=pick(items);wrong=[x for x in ['lever','inclined plane','pulley','wheel and axle','wedge','screw'] if x!=a]
    R.shuffle(wrong)
    return MQ('mac','F',f"Which simple machine is {n}?",a,wrong[:3],[f"{n.capitalize()} works as a {a}.","Simple machines change the size or direction of a force."])
def m14():
    return pick([lambda:MQ('mac','B',"A simple machine can never…",'reduce the total work needed',['change the direction of a force','multiply a force','let you use less force over a longer distance'],["Work out can never be more than work in.","A machine trades force for distance but cannot save work."]),
     lambda:MQ('mac','B',"Which of these has the greatest power?",'1000 J in 2 s',['1000 J in 5 s','1000 J in 10 s','1000 J in 20 s'],["Power = work ÷ time.","Same work in the shortest time means the most power: 500 W."]),
     lambda:MQ('mac','C',"A person carries a heavy backpack along a flat road at a constant height. How much work do they do on the backpack (in the physics sense)?",'None, because the force upward is not in the direction of motion',['A lot, because the backpack is heavy','Equal to the weight of the pack','Equal to the distance walked'],["Work needs a force along the direction of motion.","The upward force is at right angles to the motion, so it does no work on the pack."]),
     lambda:MQ('mac','C',"A longer ramp to the same height needs…",'less force but a longer push',['more force and a shorter push','less force and less distance','less work in total'],["Work (force × distance) stays the same.","A longer path means a smaller force."])])()
# ---------------- mat ----------------
def a1():
    d=rint(2,19);v=rint(2,40)
    return NM('mat','F',f"A rock has a mass of {d*v} g and a volume of {v} cm³. What is its density in g/cm³?",d,[f"Density = mass ÷ volume = {d*v} ÷ {v}.",f"= {d} g/cm³."],u='g/cm³',free=True)
def a2():
    d=rint(2,12);v=rint(2,30)
    return NM('mat','F',f"A block has a density of {d} g/cm³ and a volume of {v} cm³. What is its mass?",d*v,[f"Mass = density × volume = {d} × {v}.",f"= {d*v} g."],u='g',free=True)
def a3():
    d=rint(2,10);m=d*rint(3,25)
    return NM('mat','B',f"A metal sample has a mass of {m} g and a density of {d} g/cm³. What is its volume?",m//d,[f"Volume = mass ÷ density = {m} ÷ {d}.",f"= {m//d} cm³."],u='cm³',free=True)
def a4():
    l=rint(2,8);w=rint(2,6);h=rint(2,5);d=rint(1,9)
    return NM('mat','B',f"A box measures {l} cm by {w} cm by {h} cm and has a mass of {l*w*h*d} g. What is its density in g/cm³?",d,[f"Volume = {l} × {w} × {h} = {l*w*h} cm³.",f"Density = {l*w*h*d} ÷ {l*w*h} = {d} g/cm³."],u='g/cm³',free=True)
def a5():
    v1=rint(20,60);dv=rint(4,25)
    return NM('mat','B',f"A rock is lowered into a cylinder with {v1} mL of water. The level rises to {v1+dv} mL. What is the rock’s volume in cm³?",dv,[f"Volume = new level − old level = {v1+dv} − {v1}.",f"= {dv} mL = {dv} cm³."],u='cm³',free=True)
def a6():
    d=rint(3,25)/10
    fl=d<1
    return MQ('mat','B',f"An object has a density of {d:.1f} g/cm³. Water is 1.0 g/cm³. What happens in water?",'It floats' if fl else 'It sinks',['It sinks' if fl else 'It floats','It floats halfway','It hovers anywhere'],[f"Compare {d:.1f} with 1.0.",("Less dense than water, so it floats." if fl else "Denser than water, so it sinks.")])
def a7():
    f=rint(2,30)*10;a=rint(2,10)
    return NM('mat','B',f"A force of {f*a} N is spread evenly over {a} m². What pressure is that, in pascals (N/m²)?",f,[f"Pressure = force ÷ area = {f*a} ÷ {a}.",f"= {f} Pa."],u='Pa',free=True)
def a8():
    p=rint(2,40)*10;a=rint(2,8)
    return NM('mat','C',f"A pressure of {p} Pa acts on a surface of {a} m². What is the force on it?",p*a,[f"Force = pressure × area = {p} × {a}.",f"= {p*a} N."],u='N',free=True)
def a9():
    m=rint(40,90);a=rint(2,6)*100
    return NM('mat','C',f"A {m} kg person (weight {m*10} N, using 10 N/kg) stands on {a} cm² of shoe soles. What is the pressure on the floor in pascals? (1 m² = 10,000 cm²)",round(m*10/(a/10000)),[f"Area = {a} cm² = {a/10000:g} m².",f"Pressure = {m*10} ÷ {a/10000:g} = {m*10/(a/10000):.0f} Pa."],u='Pa',free=True,tol=0.01)
def a10():
    h=rint(2,30)
    return NM('mat','C',f"What is the water pressure caused by the water alone at a depth of {h} m? Use P = ρgh with ρ = 1000 kg/m³ and g = 10 N/kg. Give kPa.",h*10,[f"P = 1000 × 10 × {h} = {h*10000} Pa.",f"= {h*10} kPa."],u='kPa',free=True)
def a11():
    d=rint(2,15)
    return NM('mat','C',f"A liquid has a density of {d/10:g} g/cm³. What is that in kg/m³? (1 g/cm³ = 1000 kg/m³)",d*100,[f"{d/10:g} × 1000.",f"= {d*100} kg/m³."],u='kg/m³',free=True)
def a12():
    m=rint(2,40)*10
    return NM('mat','C',f"A boat floats and pushes aside {m} g of water. Using 10 N per kg, what is the buoyant force on it?",round(m/1000*10,3),[f"The buoyant force equals the weight of the displaced water: {m} g = {m/1000:g} kg.",f"Weight = {m/1000:g} × 10 = {m/1000*10:g} N."],u='N',free=True,tol=0.005)
def a13():
    return pick([lambda:MQ('mat','F',"Which state of matter keeps its volume but takes the shape of its container?",'Liquid',['Solid','Gas','Plasma only'],["A liquid’s particles slide past each other.","So it flows to the container’s shape but keeps its volume."]),
     lambda:MQ('mat','F',"Which state of matter spreads out to fill any container?",'Gas',['Solid','Liquid','Ice'],["Gas particles are far apart and move freely.","So they fill all the space available."]),
     lambda:MQ('mat','B',"Why does a snowshoe stop you sinking into snow?",'It spreads your weight over a bigger area, lowering the pressure',['It makes you lighter','It increases the pressure','It adds buoyancy to the snow'],["Pressure = force ÷ area.","A bigger area with the same force gives a smaller pressure."]),
     lambda:MQ('mat','B',"A steel ship floats because…",'its overall density (steel plus air inside) is less than water',['steel is less dense than water','the ship is very light','water pushes sideways on it'],["Float or sink depends on average density.","Air inside the hull lowers the ship’s overall density."]),
     lambda:MQ('mat','C',"If you cut a block of iron in half, its density…",'stays the same',['is halved','doubles','becomes zero'],["Density = mass ÷ volume.","Both halve, so the ratio is unchanged."]),
     lambda:MQ('mat','C',"Water pressure increases as you go deeper because…",'there is more water above pushing down',['the water is colder','gravity is stronger deeper','the water is denser at the surface'],["Pressure comes from the weight of the water above.","More depth means more water above."])])()
# ---------------- hea ----------------
def h1():
    c=rint(-10,100)
    return NM('hea','F',f"Convert {c} °C to kelvin (K = °C + 273).",c+273,[f"K = {c} + 273.",f"= {c+273} K."],u='K',free=True)
def h2():
    c=rint(1,20)*5
    return NM('hea','B',f"Convert {c} °C to °F. (°F = °C × 9/5 + 32)",round(c*9/5+32,1),[f"°F = {c} × 9/5 + 32 = {c*9/5:g} + 32.",f"= {c*9/5+32:g} °F."],u='°F',free=True)
def h3():
    f=rint(4,20)*9+32
    c=(f-32)*5/9
    return NM('hea','B',f"Convert {f} °F to °C. (°C = (°F − 32) × 5/9)",round(c,1),[f"°C = ({f} − 32) × 5/9 = {f-32} × 5/9.",f"= {c:.1f} °C."],u='°C',free=True)
def h4():
    m=rint(2,20)*10;dt=rint(2,40)
    return NM('hea','B',f"How much heat is needed to warm {m} g of water by {dt} °C? Use c = 4.2 J/(g·°C).",round(m*4.2*dt,1),[f"q = m × c × ΔT = {m} × 4.2 × {dt}.",f"= {m*4.2*dt:g} J."],u='J',free=True)
def h5():
    m=rint(2,10)*50;c=rint(2,9)/10;dt=rint(5,50)
    return NM('hea','C',f"A {m} g metal block has a specific heat of {c:g} J/(g·°C). How much heat warms it by {dt} °C?",round(m*c*dt,2),[f"q = m × c × ΔT = {m} × {c:g} × {dt}.",f"= {m*c*dt:g} J."],u='J',free=True)
def h6():
    m=rint(2,10)*10;c=pick([0.4,0.9,2.1,4.2]);dt=rint(5,30);q=m*c*dt
    return NM('hea','C',f"A {m} g sample absorbs {q:g} J and warms by {dt} °C. What is its specific heat in J/(g·°C)?",c,[f"c = q ÷ (m × ΔT) = {q:g} ÷ ({m} × {dt}).",f"= {c:g} J/(g·°C)."],u='J/(g·°C)',free=True)
def h7():
    m=rint(2,20)*10
    return NM('hea','C',f"How much heat melts {m} g of ice at 0 °C? (334 J per gram)",m*334,[f"q = m × L = {m} × 334.",f"= {m*334} J."],u='J',free=True)
def h8():
    t1=rint(2,9)*10;t2=t1+rint(2,8)*10
    return NM('hea','C',f"Equal masses of water at {t1} °C and {t2} °C are mixed. What is the final temperature (ignore losses)?",(t1+t2)/2,[f"Equal masses of the same liquid end up at the average: ({t1} + {t2}) ÷ 2.",f"= {(t1+t2)/2:g} °C."],u='°C',free=True)
def h9():
    q=rint(2,30)*100;m=rint(2,10)*10
    return NM('hea','C',f"{q} J of heat is added to {m} g of water (c = 4.2 J/(g·°C)). By how many °C does it warm up?",round(q/(m*4.2),2),[f"ΔT = q ÷ (m × c) = {q} ÷ ({m} × 4.2).",f"= {q/(m*4.2):.2f} °C."],u='°C',free=True,tol=0.01)
def h10():
    ex=[("A metal spoon heating in hot soup","conduction"),("Warm air rising above a radiator","convection"),("Feeling the Sun’s warmth on your face","radiation"),("A pot handle getting hot on a stove","conduction"),("Hot water rising in a heated pot","convection"),("A campfire warming your hands from a distance","radiation"),("A hand warming on a hot mug","conduction"),("Sea breezes forming at the coast","convection")]
    e,a=pick(ex);wr=[x for x in ['conduction','convection','radiation'] if x!=a]
    return MQ('hea','F',f"{e} is an example of which kind of heat transfer?",a,wr+['evaporation'],[f"{e} is {a}.","Conduction needs contact, convection needs moving fluid, radiation needs neither."])
def h11():
    return pick([lambda:MQ('hea','F',"At what temperature does pure water boil at sea level?",'100 °C',['0 °C','50 °C','212 °C'],["Water boils at 100 °C (212 °F) at sea level."]),
     lambda:MQ('hea','B',"Heat always flows…",'from a hotter object to a colder one',['from a colder object to a hotter one','only through metals','only in liquids'],["Energy spontaneously moves from hot to cold until the temperatures match."]),
     lambda:MQ('hea','B',"A cup of boiling water and a bathtub of warm water: which has more thermal energy?",'The bathtub, because it has far more water',['The cup, because it is hotter','They have exactly the same','Neither, because temperature is not energy'],["Thermal energy depends on mass as well as temperature.","The bathtub has vastly more particles."]),
     lambda:MQ('hea','C',"While ice melts at 0 °C, its temperature…",'stays at 0 °C because the energy goes into breaking bonds',['rises steadily','falls below 0 °C','jumps to 100 °C'],["During a change of state the energy changes how the particles are held together."]),
     lambda:MQ('hea','C',"Why do coastal areas have milder temperatures than inland areas?",'Water has a high specific heat, so it warms and cools slowly',['Water has a low specific heat','The ocean makes its own heat','Sand is a good insulator of sound'],["High specific heat means a lot of energy is needed to change the water’s temperature."])])()
def h12():
    k=rint(250,400)
    return NM('hea','B',f"Convert {k} K to °C.",k-273,[f"°C = K − 273 = {k} − 273.",f"= {k-273} °C."],u='°C',free=True)
# ---------------- ene ----------------
def e1():
    m=rint(2,12);v=rint(2,12)
    return NM('ene','B',f"A {m} kg cart moves at {v} m/s. What is its kinetic energy? (KE = ½mv²)",m*v*v/2,[f"KE = ½ × {m} × {v}² = ½ × {m} × {v*v}.",f"= {m*v*v/2:g} J."],u='J',free=True)
def e2():
    m=rint(2,30);h=rint(2,20)
    return NM('ene','F',f"A {m} kg object is {h} m above the ground. What is its gravitational potential energy? (PE = mgh, g = 10 N/kg)",m*10*h,[f"PE = {m} × 10 × {h}.",f"= {m*10*h} J."],u='J',free=True)
def e3():
    h=pick([5,10,20,45,80]);v=math.sqrt(2*10*h)
    return NM('ene','C',f"A ball is dropped from {h} m. Ignoring air, how fast is it going just before landing? (g = 10 m/s²)",round(v,2),[f"PE at the top turns into KE at the bottom: mgh = ½mv², so v = √(2gh) = √(2 × 10 × {h}).",f"= √{20*h} = {v:.2f} m/s."],u='m/s',free=True,tol=0.005)
def e4():
    ke=rint(2,60)*10;v=rint(2,10);m=ke*2/(v*v)
    return NM('ene','C',f"An object moving at {v} m/s has {ke} J of kinetic energy. What is its mass? (KE = ½mv²)",round(m,3),[f"m = 2 × KE ÷ v² = 2 × {ke} ÷ {v*v}.",f"= {m:.2f} kg."],u='kg',free=True,tol=0.005)
def e5():
    p=rint(2,30)*10;t=rint(2,20)
    return NM('ene','F',f"A {p} W device runs for {t} s. How many joules of energy does it use?",p*t,[f"Energy = power × time = {p} × {t}.",f"= {p*t} J."],u='J',free=True)
def e6():
    w=rint(2,20)*100;h=rint(2,8);c=rint(10,30)
    cost=w/1000*h*c/100
    return NM('ene','C',f"A {w} W heater runs for {h} hours. Electricity costs {c} cents per kWh. What is the cost in dollars? (kWh = kW × hours)",round(cost,2),[f"Energy = {w/1000:g} kW × {h} h = {w/1000*h:g} kWh.",f"Cost = {w/1000*h:g} × {c/100:g} = ${cost:.2f}."],free=True,tol=0.01)
def e7():
    ein=rint(2,10)*100;eff=rint(2,9)*10
    return NM('ene','F',f"A bulb takes in {ein} J of electrical energy and is {eff}% efficient. How many joules become light?",ein*eff/100,[f"Useful energy = {eff}% × {ein}.",f"= {ein*eff/100:g} J."],u='J',free=True)
def e8():
    ein=rint(2,10)*100;lt=rint(2,8)*ein//10;
    return NM('ene','C',f"A device uses {ein} J and gives out {lt} J of light. How much energy is wasted as heat?",ein-lt,[f"Wasted energy = total in − useful out = {ein} − {lt}.",f"= {ein-lt} J."],u='J',free=True)
def e9():
    m=rint(2,10);h=rint(2,10)
    return NM('ene','C',f"A {m} kg box falls {h} m. How much kinetic energy has it gained, ignoring air? (g = 10 N/kg)",m*10*h,[f"Energy gained = energy lost = mgh = {m} × 10 × {h}.",f"= {m*10*h} J."],u='J',free=True)
def e10():
    v=rint(2,9)
    return NM('ene','C',f"A car’s speed doubles from {v} m/s to {2*v} m/s. By what factor does its kinetic energy increase?",4,["KE depends on v². Doubling v multiplies KE by 2² = 4.",f"Factor = {(2*v)**2} ÷ {v**2} = 4."],free=True)
def e11():
    return pick([lambda:MQ('ene','F',"What energy change happens in a solar panel?",'Light to electrical',['Chemical to light','Electrical to sound','Heat to motion'],["A solar panel converts light energy into electrical energy."]),
     lambda:MQ('ene','F',"Which of these is a renewable energy source?",'Wind',['Coal','Natural gas','Oil'],["Wind keeps being replaced naturally; fossil fuels take millions of years to form."]),
     lambda:MQ('ene','F',"A battery stores energy in which form?",'Chemical',['Kinetic','Nuclear','Sound'],["Batteries store chemical energy and release it as electrical energy."]),
     lambda:MQ('ene','B',"At the top of a roller-coaster hill, the cars have the most…",'gravitational potential energy',['kinetic energy','thermal energy','sound energy'],["Highest point means the most stored gravitational energy.","It turns into kinetic energy on the way down."]),
     lambda:MQ('ene','B',"Energy is never created or destroyed, only changed from one form to another. This is called…",'conservation of energy',['conservation of momentum','Newton’s third law','Ohm’s law'],["This is the law of conservation of energy."]),
     lambda:MQ('ene','C',"A bouncing ball reaches lower heights each bounce. Where does the missing mechanical energy go?",'Mostly to thermal energy and sound',['It is destroyed','It becomes gravitational energy','It goes back into the floor as more height'],["Energy is conserved: the mechanical energy lost becomes heat and sound in the ball and floor."]),
     lambda:MQ('ene','C',"Which has more kinetic energy: a 2 kg ball at 4 m/s or a 4 kg ball at 2 m/s?",'The 2 kg ball at 4 m/s',['The 4 kg ball at 2 m/s','They are equal','Cannot tell'],["KE = ½mv².","½(2)(16) = 16 J, while ½(4)(4) = 8 J."])])()
def e12():
    n=rint(2,12);w=rint(2,10)*10;h=rint(2,8)
    return NM('ene','C',f"{n} bulbs of {w} W each are on for {h} hours. How many kilowatt-hours is that?",round(n*w*h/1000,3),[f"Total power = {n} × {w} = {n*w} W = {n*w/1000:g} kW.",f"Energy = {n*w/1000:g} × {h} = {n*w*h/1000:g} kWh."],u='kWh',free=True,tol=0.005)
FAMS=[m1,m2,m3,m4,m5,m6,m7,m8,m9,m10,m11,m12,m13,m14,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,h1,h2,h3,h4,h5,h6,h7,h8,h9,h10,h11,h12,e1,e2,e3,e4,e5,e6,e7,e8,e9,e10,e11,e12]
def run(n=14):
    for f in FAMS:gen.rep(f,n)
