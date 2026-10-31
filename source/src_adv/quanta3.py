# -*- coding: utf-8 -*-
"""Quanta 3: optics, heat, electric fields, network analysis, capacitors and inductors."""
from adv_h import *
rad=math.radians
K=8.99e9
CARDS={
'opt':[
("Light travels in straight lines","Light moves in straight rays at about 3 × 10⁸ m/s. We see an object when its light reaches our eyes. Shadows form where light is blocked.",None),
("Reflection","A ray hits a mirror and bounces off. The angle in equals the angle out, both measured from the normal (the line at 90° to the surface).","θᵢ = θᵣ"),
("Refraction","Light bends when it passes between materials because it changes speed. The index of refraction is n = c/v. Snell's law links the angles.","n₁ sin θ₁ = n₂ sin θ₂"),
("Total internal reflection","Going from a slow material to a faster one, the ray bends away from the normal. Past the critical angle sin θc = n₂/n₁ all the light reflects. Optical fibres use this.","sin θc = n₂/n₁"),
("Lenses and mirrors","A converging lens or concave mirror bends rays to a focus at distance f. The thin-lens equation connects object distance d₀, image distance dᵢ and focal length f.","1/f = 1/d₀ + 1/dᵢ")],
'thm':[
("Heat and temperature","Temperature measures how fast the particles jiggle on average. Heat is energy that flows from hot to cold. Both are not the same thing.",None),
("Specific heat","Q = mcΔT gives the heat needed to change a temperature. Water has c = 4186 J/(kg·°C), which is why it warms slowly.","Q = mcΔT"),
("Phase changes","Melting or boiling takes energy with no temperature change. Q = mL, with L the latent heat. For water, L_fusion ≈ 334 kJ/kg and L_vaporization ≈ 2260 kJ/kg.","Q = mL"),
("Gas laws","For a fixed amount of gas, PV/T stays constant, with T in kelvin. K = °C + 273. The ideal gas law is PV = nRT.","PV = nRT"),
("Heat engines","An engine takes heat Qh from a hot source, does work W and dumps Qc. Efficiency is e = W/Qh = 1 − Qc/Qh. The best possible efficiency is 1 − Tc/Th (kelvin).","e = W/Qh")],
'est':[
("Charge","Matter has positive and negative charge. Like charges repel, opposite charges attract. Charge is measured in coulombs (C). One electron has charge 1.6 × 10⁻¹⁹ C.",None),
("Coulomb's law","The force between two point charges is F = kq₁q₂/r², with k = 9 × 10⁹ N·m²/C². Doubling the distance cuts the force to a quarter.","F = kq₁q₂/r²"),
("Electric field","The field E at a point is the force per unit charge, E = F/q. A point charge makes E = kQ/r². Field lines point away from positive charge.","E = F/q"),
("Electric potential","Potential V is energy per unit charge, in volts. A charge q moved through a potential difference V gains energy qV. A uniform field has V = Ed.","ΔU = qV"),
("Capacitors","Two plates storing charge: Q = CV. The energy stored is ½CV². Parallel-plate: C = ε₀A/d.","Q = CV")],
'kvl':[
("Nodes and loops","A node is where wires meet. A loop is any closed path. Kirchhoff's two laws apply to every circuit, however tangled.",None),
("Current law","The current into a node equals the current out. Charge does not pile up.","ΣI = 0"),
("Voltage law","Going once around any loop, the voltage rises equal the voltage drops. The sum is zero.","ΣV = 0"),
("Voltage and current dividers","Series resistors share voltage in proportion to resistance: V₁ = V·R₁/(R₁ + R₂). Parallel resistors share current: I₁ = I·R₂/(R₁ + R₂).",None),
("Thevenin and maximum power","Any two-terminal linear network acts like a voltage source V_th in series with R_th. A load takes maximum power when R_L = R_th.","R_L = R_th")],
'rc':[
("Capacitor basics","A capacitor stores energy in an electric field. Q = CV and the energy is ½CV². Units: farads (F), often µF or nF.",None),
("RC charging","Through a resistor a capacitor charges gradually. The time constant is τ = RC. After one τ it reaches 63% of the final voltage; after 5τ it is essentially full.","τ = RC"),
("RC discharging","Discharging, the voltage falls as V = V₀e^(−t/τ). After one τ it is 37% of the start.","V = V₀e^(−t/τ)"),
("Inductors","A coil resists changes in current. V = L·ΔI/Δt and the stored energy is ½LI². In an RL circuit τ = L/R.","τ = L/R"),
("Series and parallel","Capacitors in parallel add: C = C₁ + C₂. In series: 1/C = 1/C₁ + 1/C₂. Inductors behave like resistors.",None)],
}
def o1():
    a=rint(10,70)
    return NM('opt','F',f"A light ray hits a flat mirror at {a}° from the normal. What is the angle of reflection?",a,["The angle of reflection equals the angle of incidence."],u='°',free=True)
def o2():
    n=pick([1.33,1.5,1.52,2.42])
    return NM('opt','F',f"Light travels at 3.00 × 10⁸ m/s in vacuum. A material has n = {n}. What is the light speed in it, in 10⁸ m/s? (3 sig figs)",round(3/n,2),[f"v = c/n = 3.00/{n} = {3/n:.3f} × 10⁸ m/s."],tol=0.006)
def o3():
    a=rint(20,60);n=pick([1.33,1.5,1.6])
    r=math.degrees(math.asin(math.sin(rad(a))/n))
    return NM('opt','C',f"Light in air hits a surface at {a}° and enters a material with n = {n}. Find the refraction angle (1 decimal, degrees).",round(r,1),[f"sin θ₂ = sin {a}° / {n} = {math.sin(rad(a))/n:.4f}.",f"θ₂ = {r:.1f}°."],u='°',free=True,tol=0.004)
def o4():
    n=pick([1.33,1.5,1.6,2.42])
    c=math.degrees(math.asin(1/n))
    return NM('opt','C',f"What is the critical angle for light going from a material with n = {n} into air? (1 decimal, degrees)",round(c,1),[f"sin θc = 1/{n} = {1/n:.4f}.",f"θc = {c:.1f}°."],u='°',free=True,tol=0.004)
def o5():
    f=rint(5,30);d=rint(f+3,f+40)
    di=1/(1/f-1/d)
    return NM('opt','C',f"A converging lens has focal length {f} cm. An object is {d} cm away. How far from the lens is the image? (cm, 1 decimal)",round(di,1),[f"1/dᵢ = 1/{f} − 1/{d}.",f"dᵢ = {di:.2f} cm."],u='cm',free=True,tol=0.004)
def o6():
    f=rint(5,30);d=rint(f+5,f+40)
    di=1/(1/f-1/d)
    return NM('opt','M',f"A converging lens has f = {f} cm and the object is {d} cm away. Find the magnification magnitude |m| = dᵢ/d₀ (2 decimals).",round(di/d,2),[f"dᵢ = {di:.2f} cm.",f"|m| = {di:.2f}/{d} = {di/d:.2f}."],tol=0.006)
def o7():
    fr=pick([4,5,6,7.5])*1e14
    return NM('opt','C',f"Light has frequency {fr/1e14:g} × 10¹⁴ Hz. Find its wavelength in nm (c = 3 × 10⁸ m/s, nearest nm).",round(3e8/fr*1e9),[f"λ = c/f = 3 × 10⁸ / {fr:.3g}.",f"≈ {3e8/fr*1e9:.0f} nm."],u='nm',free=True,tol=0.006)
def h1():
    m=rint(1,5);dt=rint(10,60)
    return NM('thm','B',f"How much heat raises {m} kg of water by {dt} °C? (c = 4186 J/(kg·°C), answer in kJ, 1 decimal)",round(m*4186*dt/1000,1),[f"Q = mcΔT = {m} × 4186 × {dt} = {m*4186*dt} J.",f"= {m*4186*dt/1000:.1f} kJ."],u='kJ',free=True,tol=0.004)
def h2():
    m=rint(1,5)
    return NM('thm','B',f"How much heat melts {m} kg of ice at 0 °C? (L = 334 kJ/kg, answer in kJ)",m*334,[f"Q = mL = {m} × 334 = {m*334} kJ."],u='kJ',free=True)
def h3():
    c=rint(0,100)
    return NM('thm','F',f"Convert {c} °C to kelvin.",c+273,["K = °C + 273."],u='K',free=True)
def h4():
    T1=rint(250,350);f=pick([2,3,0.5])
    return NM('thm','C',f"A gas at constant pressure has volume 2 L at {T1} K. What is its volume at {T1*f:g} K? (litres, 2 decimals)",2*f,["V/T is constant: V₂ = V₁ × T₂/T₁.",f"= 2 × {f:g} = {2*f:g} L."],u='L',free=True)
def h5():
    P=pick([1,2,3]);Vf=pick([2,4,0.5])
    return NM('thm','C',f"A gas at {P} atm is squeezed at constant temperature until its volume is 1/{Vf:g} of the original. What is the new pressure (atm)?",P*Vf,["Boyle's law: PV is constant.",f"P₂ = {P} × {Vf:g} = {P*Vf:g} atm."],u='atm',free=True)
def h6():
    Qh=rint(5,20)*100;e=pick([0.2,0.25,0.3,0.4])
    return NM('thm','C',f"A heat engine takes {Qh} J from a hot source and has efficiency {e}. How much work does it do (J)?",Qh*e,[f"W = e·Qh = {e} × {Qh}.",f"= {Qh*e:.0f} J."],u='J',free=True)
def h7():
    Th=rint(450,800);Tc=rint(280,330)
    return NM('thm','M',f"What is the maximum possible efficiency (as a decimal, 3 decimals) of an engine running between {Th} K and {Tc} K?",round(1-Tc/Th,3),[f"e = 1 − Tc/Th = 1 − {Tc}/{Th}.",f"= {1-Tc/Th:.3f}."],tol=0.006)
def h8():
    m=rint(1,4);T0=rint(10,30)
    return NM('thm','M',f"{m} kg of water at {T0} °C is heated to 100 °C and then fully boiled. Total heat in MJ? (c = 4186, L = 2260 kJ/kg, 2 decimals)",round((m*4186*(100-T0)+m*2.26e6)/1e6,2),["Heat to 100 °C: mcΔT.","Then add mL to boil.","Add the two and convert to MJ."],u='MJ',free=True,tol=0.004)
def e1():
    q=rint(2,9);r=rint(2,6)
    return NM('est','C',f"Two charges of {q} µC are {r} m apart in vacuum. Find the force between them in mN (k = 9 × 10⁹, 2 decimals).",round(K*(q*1e-6)**2/r**2*1000,2),[f"F = kq²/r² = 9×10⁹ × ({q}×10⁻⁶)² / {r}².",f"≈ {K*(q*1e-6)**2/r**2*1000:.2f} mN."],u='mN',free=True,tol=0.01)
def e2():
    f=pick([2,3,4])
    return NM('est','B',f"The distance between two charges is multiplied by {f}. By what factor is the force divided?",f*f,[f"F ∝ 1/r², so dividing by {f}² = {f*f}."])
def e3():
    F=rint(2,20);q=rint(1,5)
    return NM('est','B',f"A charge of {q} C feels a force of {F} N. What is the electric field (N/C)?",F/q,["E = F/q."],u='N/C',free=True,tol=0.004)
def e4():
    V=rint(5,100);d=rint(1,10)
    return NM('est','B',f"A uniform field has a potential difference of {V} V over {d*10} cm. What is E in V/m?",V/(d/10),[f"E = V/d = {V}/{d/10}."],u='V/m',free=True,tol=0.004)
def e5():
    q=rint(1,10);V=rint(50,500)
    return NM('est','C',f"A test charge of {q} µC moves through {V} V. How much energy does it gain in µJ?",q*V,["Energy = qV.",f"= {q} × {V} = {q*V} µJ."],u='µJ',free=True)
def e6():
    C=rint(1,10);V=rint(3,20)
    return NM('est','C',f"A {C} µF capacitor is charged to {V} V. How much energy does it store, in µJ? (1 decimal)",round(0.5*C*V*V,1),[f"½CV² = ½ × {C} × {V}² µJ.",f"= {0.5*C*V*V:.1f} µJ."],u='µJ',free=True,tol=0.004)
def e7():
    Q=rint(1,9);r=rint(1,5)
    return NM('est','M',f"Find the electric field {r} m from a point charge of {Q} µC, in kV/m (2 decimals).",round(K*Q*1e-6/r**2/1000,2),[f"E = kQ/r² = 9×10⁹ × {Q}×10⁻⁶ / {r}².",f"= {K*Q*1e-6/r**2/1000:.2f} kV/m."],u='kV/m',free=True,tol=0.01)
def e8():
    n=rint(2,9)
    return NM('est','C',f"How many electrons carry a charge of {n}.0 µC? Give the answer in units of 10¹³ (2 decimals, e = 1.6 × 10⁻¹⁹ C).",round(n*1e-6/1.6e-19/1e13,2),[f"N = Q/e = {n}×10⁻⁶ / 1.6×10⁻¹⁹.",f"= {n*1e-6/1.6e-19/1e13:.2f} × 10¹³."],tol=0.01)
def k1():
    I1=rint(1,6);I2=rint(1,6)
    return NM('kvl','F',f"Two wires carry {I1} A and {I2} A into a node. What current leaves through the third wire (A)?",I1+I2,["Current in equals current out."],u='A',free=True)
def k2():
    V=rint(6,24);R1=rint(1,6)*100;R2=rint(1,6)*100
    return NM('kvl','B',f"A {V} V source feeds {R1} Ω and {R2} Ω in series. What is the voltage across the {R2} Ω resistor? (V, 2 decimals)",round(V*R2/(R1+R2),2),["Voltage divider: V·R₂/(R₁+R₂).",f"= {V*R2/(R1+R2):.2f} V."],u='V',free=True,tol=0.006)
def k3():
    I=rint(2,12);R1=rint(1,6);R2=rint(1,6)
    return NM('kvl','B',f"A {I} A current splits between parallel resistors {R1} Ω and {R2} Ω. How much flows through the {R1} Ω one? (A, 2 decimals)",round(I*R2/(R1+R2),2),["Current divider: I·R₂/(R₁+R₂) goes through R₁.",f"= {I*R2/(R1+R2):.2f} A."],u='A',free=True,tol=0.006)
def k4():
    Vth=rint(6,24);Rth=rint(1,10)*10
    return NM('kvl','C',f"A Thevenin source is {Vth} V with R_th = {Rth} Ω. What load resistance (Ω) gets the maximum power?",Rth,["Maximum power transfer: R_L = R_th."],u='Ω',free=True)
def k5():
    Vth=rint(6,24);Rth=rint(1,10)*10
    return NM('kvl','M',f"A Thevenin source of {Vth} V with R_th = {Rth} Ω drives a matched load. What power (W, 3 decimals) does the load receive?",round(Vth**2/(4*Rth),3),["At R_L = R_th the current is V/(2R). Power = I²R = V²/(4R).",f"= {Vth**2/(4*Rth):.3f} W."],u='W',free=True,tol=0.006)
def k6():
    R=pick([(1,2,3),(2,3,6),(4,4,8)]);V=rint(6,24)
    a,b,c=R
    Rt=a+b*c/(b+c)
    return NM('kvl','C',f"Resistor {a} Ω is in series with a parallel pair {b} Ω and {c} Ω, all across {V} V. What total current flows? (A, 2 decimals)",round(V/Rt,2),[f"R_total = {a} + ({b}×{c})/({b}+{c}) = {Rt:.2f} Ω.",f"I = {V}/{Rt:.2f} = {V/Rt:.2f} A."],u='A',free=True,tol=0.006)
def k7():
    V=rint(6,24);R1=rint(1,5)*10;R2=rint(1,5)*10;R3=rint(1,5)*10
    I=V/(R1+R2+R3)
    return NM('kvl','B',f"A {V} V battery drives {R1} Ω, {R2} Ω and {R3} Ω in series. What is the current (A, 3 decimals)?",round(I,3),["Add the resistances, then I = V/R.",f"I = {V}/{R1+R2+R3} = {I:.3f} A."],u='A',free=True,tol=0.006)
def r1():
    R=rint(1,9)*1000;C=rint(1,9)
    return NM('rc','B',f"An RC circuit has R = {R} Ω and C = {C} µF. What is the time constant in ms? (2 decimals)",round(R*C*1e-6*1000,2),[f"τ = RC = {R} × {C}×10⁻⁶ s.",f"= {R*C*1e-3:.2f} ms."],u='ms',free=True,tol=0.006)
def r2():
    V=rint(5,24)
    return NM('rc','B',f"A capacitor charges through a resistor from a {V} V supply. What is its voltage after one time constant? (V, 2 decimals)",round(V*(1-math.exp(-1)),2),["V = V₀(1 − e⁻¹) ≈ 0.632 V₀.",f"= {V*(1-math.exp(-1)):.2f} V."],u='V',free=True,tol=0.006)
def r3():
    V=rint(5,24)
    return NM('rc','C',f"A capacitor charged to {V} V discharges through a resistor. What is its voltage after two time constants? (V, 2 decimals)",round(V*math.exp(-2),2),["V = V₀e⁻² ≈ 0.135 V₀.",f"= {V*math.exp(-2):.2f} V."],u='V',free=True,tol=0.006)
def r4():
    a=rint(1,9);b=rint(1,9)
    return NM('rc','B',f"Two capacitors, {a} µF and {b} µF, are connected in parallel. What is the total capacitance (µF)?",a+b,["Parallel capacitors add."],u='µF',free=True)
def r5():
    a=pick([2,3,4,6,12]);b=pick([2,3,4,6,12])
    return NM('rc','C',f"Two capacitors, {a} µF and {b} µF, are connected in series. What is the total (µF, 2 decimals)?",round(a*b/(a+b),2),["1/C = 1/C₁ + 1/C₂, so C = C₁C₂/(C₁ + C₂).",f"= {a*b/(a+b):.2f} µF."],u='µF',free=True,tol=0.006)
def r6():
    L=rint(1,9);R=rint(1,9)*10
    return NM('rc','C',f"An RL circuit has L = {L} H and R = {R} Ω. What is τ in ms? (1 decimal)",round(L/R*1000,1),[f"τ = L/R = {L}/{R} s.",f"= {L/R*1000:.1f} ms."],u='ms',free=True,tol=0.006)
def r7():
    L=rint(1,9);I=rint(1,5)
    return NM('rc','C',f"An inductor of {L} H carries {I} A. How much energy does it store (J, 1 decimal)?",round(0.5*L*I*I,1),[f"½LI² = ½ × {L} × {I}².",f"= {0.5*L*I*I:.1f} J."],u='J',free=True,tol=0.004)
def r8():
    R=rint(1,9)*1000;C=rint(1,9)
    return NM('rc','M',f"With R = {R} Ω and C = {C} µF, after how many ms does the charging voltage reach 63% of final? Give the time in ms (RC to 2 decimals).",round(R*C*1e-3,2),["63% is one time constant: t = RC.",f"= {R*C*1e-3:.2f} ms."],u='ms',free=True,tol=0.006)
FAMS=[o1,o2,o3,o4,o5,o6,o7,h1,h2,h3,h4,h5,h6,h7,h8,e1,e2,e3,e4,e5,e6,e7,e8,k1,k2,k3,k4,k5,k6,k7,r1,r2,r3,r4,r5,r6,r7,r8]
def run(n=14):
    for f in FAMS:gen.rep(f,n)
