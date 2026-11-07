# -*- coding: utf-8 -*-
"""Quanta 5: Physics 1 and 2, AP Physics C (mechanics, E&M) and the reasoning toolkit used for university physics admissions."""
from adv_h import *
G="Use g = 10 m/s²."
def N(t,tier,q,v,sol,u=None,tol=0.006,adj=0):
    return NM(t,tier,q,sci(v,3),sol,u=u,free=True,tol=tol,adj=adj)
def f3(x):return f"{x:.3g}"
CARDS={
'rot':[
("Angular motion","Rotation uses angle θ (radians), angular velocity ω = Δθ/Δt and angular acceleration α = Δω/Δt. The equations match straight-line motion: ω = ω₀ + αt and θ = ω₀t + ½αt².","ω = ω₀ + αt"),
("Torque","A force turns an object only if it acts at a distance from the pivot. Torque = r F sin θ, where θ is the angle between the lever arm r and the force.","τ = rF sin θ"),
("Moment of inertia","I measures how hard it is to change rotation. It grows with mass and with distance from the axis squared. Point masses: I = Σmr². Solid disk about its centre: ½MR². Hoop: MR². Rod about its centre: ML²/12.","I = Σmr²"),
("Newton's second law for rotation","Net torque = I α. A bigger moment of inertia means a smaller angular acceleration for the same torque.","τ_net = Iα"),
("Rotational kinetic energy","A spinning object stores energy ½Iω². A rolling object has both ½mv² and ½Iω².","KE = ½Iω²"),
("Angular momentum","L = Iω. With no net external torque L is conserved: a skater who pulls her arms in lowers I, so ω rises.","L = Iω"),
("Rolling without slipping","The contact point is at rest, so v = ωR. Rolling down a slope the energy splits between moving and spinning, so rolling objects accelerate more slowly than sliding ones.","v = ωR")],
'sho':[
("Oscillation","An oscillation repeats. The period T is the time for one cycle. The frequency f = 1/T is cycles per second (hertz).","f = 1/T"),
("Restoring force","In simple harmonic motion the force always points back toward equilibrium and grows with displacement: F = −kx. This is Hooke's law.","F = −kx"),
("Mass on a spring","The period depends on mass and stiffness only, not on the amplitude: bigger mass is slower, stiffer spring is faster.","T = 2π√(m/k)"),
("Pendulum","For small angles a pendulum has period T = 2π√(L/g). It does not depend on the mass.","T = 2π√(L/g)"),
("Energy in SHM","Energy swaps between kinetic and potential. Total energy ½kA² is constant. Speed is greatest at equilibrium: v_max = Aω with ω = √(k/m).","E = ½kA²"),
("Graphs of SHM","Position is a cosine (or sine) of time. Velocity leads position by a quarter cycle. Acceleration is −ω² x.","x = A cos ωt")],
'flu':[
("Pressure","Pressure is force per area. Units: pascals (Pa), one newton per square metre.","P = F/A"),
("Pressure in a fluid","Pressure grows with depth: the weight of the fluid above pushes down. Gauge pressure is ρgh. Atmospheric pressure adds about 1.0 × 10⁵ Pa.","P = P₀ + ρgh"),
("Pascal's principle","Pressure added to a confined fluid spreads everywhere. A hydraulic lift trades distance for force: F₁/A₁ = F₂/A₂.","F₁/A₁ = F₂/A₂"),
("Buoyancy","A fluid pushes up with a force equal to the weight of the fluid the object pushes aside (Archimedes). F_B = ρ_fluid V_displaced g.","F_B = ρVg"),
("Continuity","An incompressible fluid does not pile up: A₁v₁ = A₂v₂. Fluid speeds up in a narrow pipe.","A₁v₁ = A₂v₂"),
("Bernoulli's equation","Along a streamline, P + ½ρv² + ρgh is constant. Fast fluid means low pressure. Draining from a hole at depth h leaves at v = √(2gh).","P + ½ρv² + ρgh = const")],
'gas':[
("Ideal gas","For a gas of n moles, PV = nRT with R = 8.31 J/(mol·K) and T in kelvin. Add 273 to a Celsius temperature.","PV = nRT"),
("Gas laws","At fixed amount, P₁V₁/T₁ = P₂V₂/T₂. At fixed T, pressure and volume are inversely related (Boyle).","P₁V₁/T₁ = P₂V₂/T₂"),
("Kinetic theory","Temperature measures the average kinetic energy of the molecules: for one molecule of a monatomic gas, KE = (3/2)k_BT. The internal energy of n moles is (3/2)nRT.","U = (3/2)nRT"),
("Work by a gas","A gas doing work expands. At constant pressure W = PΔV. On a P–V graph, work is the area under the curve.","W = PΔV"),
("First law","The internal energy changes by the heat added minus the work done by the gas.","ΔU = Q − W"),
("Heat engines","An engine takes Q_h from a hot reservoir, does work W, and dumps Q_c. Efficiency e = W/Q_h. No engine beats the Carnot limit 1 − T_c/T_h (kelvin).","e_max = 1 − T_c/T_h"),
("Second law","Heat flows by itself from hot to cold, and the entropy of an isolated system never decreases.",None)],
'mod':[
("Photons","Light comes in packets. A photon has energy E = hf = hc/λ. A handy form: E (eV) = 1240 / λ (nm).","E = hf"),
("Photoelectric effect","A photon frees an electron only if its energy exceeds the metal's work function φ. The fastest electrons leave with KE_max = hf − φ. Brighter light means more electrons, not faster ones.","KE_max = hf − φ"),
("Matter waves","Particles have a wavelength λ = h/p. Electrons diffract, which is why electron microscopes see fine detail.","λ = h/p"),
("Bohr hydrogen","Hydrogen energy levels are E_n = −13.6 eV / n². A photon is emitted or absorbed when the electron jumps between levels.","E_n = −13.6/n² eV"),
("Radioactive decay","Unstable nuclei decay at random, but a large sample halves every half-life: N = N₀ (½)^(t/T½).","N = N₀ 2^(−t/T)"),
("Mass and energy","Mass is a form of energy: E = mc². In nuclear reactions the lost mass shows up as energy: 1 u of mass equals 931.5 MeV.","E = mc²")],
'gau':[
("Electric potential","Potential is energy per charge, V = U/q, measured in volts. A point charge makes V = kq/r with k = 9.0 × 10⁹ N·m²/C².","V = kq/r"),
("Work and potential difference","Moving a charge q through a potential difference ΔV changes its energy by qΔV. A charge released from rest gains kinetic energy qΔV.","ΔKE = qΔV"),
("Uniform fields","Between parallel plates E is uniform and V = Ed. The field points from high to low potential.","V = Ed"),
("Gauss's law","The electric flux through a closed surface depends only on the charge inside: Φ = Q_enc/ε₀ with ε₀ = 8.85 × 10⁻¹² C²/(N·m²). Symmetry then gives E.","Φ = Q/ε₀"),
("Field of simple shapes","Point charge: E = kq/r². Long line of charge λ: E = λ/(2πε₀r). Infinite sheet σ: E = σ/(2ε₀). Inside a conductor in equilibrium E = 0.","E = kq/r²"),
("Capacitors","Two plates store charge: Q = CV. A parallel-plate capacitor has C = ε₀A/d, and stores energy ½CV². A dielectric multiplies C by κ.","C = ε₀A/d")],
'lor':[
("Magnetic force on a charge","A charge moving across a magnetic field feels a force F = qvB sin θ, at right angles to both v and B (right-hand rule). The force does no work, so speed stays constant.","F = qvB sin θ"),
("Circular paths","A charge moving at right angles to B goes in a circle of radius r = mv/(qB), with period T = 2πm/(qB).","r = mv/(qB)"),
("Force on a wire","A current-carrying wire in a field feels F = BIL sin θ.","F = BIL"),
("Field of a current","A long straight wire makes B = μ₀I/(2πr), with μ₀ = 4π × 10⁻⁷ T·m/A. A solenoid has B = μ₀nI inside, where n is turns per metre.","B = μ₀I/(2πr)"),
("Faraday's law","A changing magnetic flux induces an emf: ε = −N ΔΦ/Δt. Flux Φ = BA cos θ.","ε = −NΔΦ/Δt"),
("Lenz's law and motional emf","The induced current opposes the change that caused it. A rod of length L moving at v across a field B has emf ε = BLv.","ε = BLv")],
'mxw':[
("Electromagnetic waves","Changing E and B fields sustain each other and travel at c = 3.0 × 10⁸ m/s. Radio, light and X-rays differ only in frequency: c = fλ.","c = fλ"),
("Refraction","Light slows in matter: n = c/v. At a boundary n₁ sin θ₁ = n₂ sin θ₂. Past the critical angle, sin θ_c = n₂/n₁, light is totally reflected.","n₁ sin θ₁ = n₂ sin θ₂"),
("Double-slit interference","Two slits make bright fringes where the path difference is a whole number of wavelengths. Fringe spacing on a screen: Δy = λL/d.","Δy = λL/d"),
("Single-slit diffraction","A slit of width a gives dark fringes where a sin θ = mλ. A narrower slit spreads the light more.","a sin θ = mλ"),
("Polarization","Polarizers pass one direction of the electric field. Unpolarized light loses half its intensity. Polarized light follows Malus's law I = I₀ cos²θ.","I = I₀ cos²θ"),
("Thin films","Reflections from the top and bottom of a thin film interfere. A reflection off a slower medium flips the wave (half a cycle). Film thickness then sets which colours cancel.",None)],
'cal':[
("Motion with calculus","Velocity is the derivative of position, and acceleration the derivative of velocity. Going backwards: v = ∫a dt and x = ∫v dt, with initial conditions as constants.","v = ∫a dt"),
("Work from a variable force","When force changes with position, work is the area under the F–x curve: W = ∫F dx.","W = ∫F dx"),
("Impulse from a variable force","Impulse is the area under the F–t curve: J = ∫F dt = Δp.","J = ∫F dt"),
("Force from potential energy","Force is minus the slope of the potential energy curve: F = −dU/dx. Equilibrium is where the slope is zero; stable where U has a minimum.","F = −dU/dx"),
("Centre of mass","For continuous mass: x_cm = ∫x dm / ∫dm. For a rod with density λ(x), dm = λ dx.","x_cm = ∫x dm / M"),
("Moment of inertia by integration","I = ∫r² dm. Uniform rod about its end: ML²/3. About its centre: ML²/12.","I = ∫r² dm")],
'orb':[
("Newton's law of gravitation","Every pair of masses attracts with force F = GMm/r², with G = 6.67 × 10⁻¹¹ N·m²/kg². Field strength at distance r from mass M is g = GM/r².","F = GMm/r²"),
("Orbits","For a circular orbit gravity supplies the centripetal force: GM/r² = v²/r, so v = √(GM/r). Higher orbits are slower.","v = √(GM/r)"),
("Kepler's third law","T² is proportional to r³. If you know one orbit you can find another: (T₂/T₁)² = (r₂/r₁)³.","T² ∝ r³"),
("Gravitational potential energy","With zero at infinity U = −GMm/r. It is negative: you must add energy to escape.","U = −GMm/r"),
("Orbital energy","Total energy of a circular orbit is E = −GMm/(2r). KE = −E and U = 2E.","E = −GMm/2r"),
("Escape speed","Escape means total energy zero: ½mv² = GMm/r, so v_esc = √(2GM/r), which is √2 times the circular-orbit speed.","v_esc = √(2GM/r)")],
'dim':[
("Dimensions and units","Every term in a valid equation has the same dimensions. Checking units catches most algebra mistakes. Example: x = ½at² has dimensions L = (L/T²)T².",None),
("Estimation","Physicists estimate to the nearest power of ten (Fermi problems). Break the problem into numbers you know, multiply, and check the order of magnitude.",None),
("Vectors","A vector has magnitude and direction. Components: A_x = A cos θ, A_y = A sin θ. Add components, not magnitudes. Dot product A·B = AB cos θ; cross product magnitude AB sin θ.","A·B = AB cos θ"),
("Uncertainty","Every measurement has an uncertainty. For products and quotients relative uncertainties add (roughly). For sums, absolute uncertainties add.","δ(ab)/ab ≈ δa/a + δb/b"),
("Significant figures","Report no more digits than the least precise input supports. Keep extra digits in the middle of a calculation and round at the end.",None),
("Limiting cases","Test a formula at extremes: if m → 0 or r → ∞ should the answer vanish, blow up or approach a known result? This is the fastest way to check an unfamiliar formula.",None)],
}
def r1():
    r=pick([.2,.3,.4,.5,.8,1.2]);F=rint(5,60);a=pick([30,45,60,90])
    return N('rot','B',f"A {F} N force pushes on a wrench at a distance of {r} m from the bolt, at {a}° to the wrench. What is the torque? (3 significant figures)",F*r*math.sin(math.radians(a)),[f"τ = rF sin θ = {r} × {F} × sin {a}°.",f"= {f3(F*r*math.sin(math.radians(a)))} N·m."],u='N·m')
def r2():
    I=pick([.5,1,2,4,5]);t=rint(5,40)
    return N('rot','C',f"A net torque of {t} N·m acts on a wheel with moment of inertia {I} kg·m². What is its angular acceleration?",t/I,[f"α = τ/I = {t}/{I}.",f"= {f3(t/I)} rad/s²."],u='rad/s²')
def r3():
    a=rint(2,9);t=rint(2,10);w0=rint(0,5)
    return N('rot','C',f"A flywheel at {w0} rad/s speeds up at {a} rad/s² for {t} s. How many radians does it turn?",w0*t+a*t*t/2,[f"θ = ω₀t + ½αt² = {w0}({t}) + ½({a})({t})².",f"= {f3(w0*t+a*t*t/2)} rad."],u='rad')
def r4():
    m1=rint(1,4);m2=rint(1,4);r1_=pick([.5,1,1.5,2]);r2_=pick([.5,1,2,3])
    return N('rot','C',f"Two small masses, {m1} kg at {r1_} m and {m2} kg at {r2_} m, are fixed to a light rod spinning about an axis. What is the moment of inertia of the system?",m1*r1_**2+m2*r2_**2,[f"I = Σmr² = {m1}({r1_})² + {m2}({r2_})².",f"= {f3(m1*r1_**2+m2*r2_**2)} kg·m²."],u='kg·m²')
def r5():
    M=rint(2,10);R_=pick([.2,.3,.5]);w=rint(5,30)
    I=.5*M*R_**2
    return N('rot','C',f"A solid disk of mass {M} kg and radius {R_} m spins at {w} rad/s about its centre. What is its rotational kinetic energy? (I = ½MR²)",.5*I*w*w,[f"I = ½MR² = ½({M})({R_})² = {f3(I)} kg·m².",f"KE = ½Iω² = {f3(.5*I*w*w)} J."],u='J')
def r6():
    I1=rint(3,8);w1=rint(2,6);I2=pick([1,1.5,2,2.5])
    return N('rot','M',f"A skater spins at {w1} rad/s with moment of inertia {I1} kg·m². She pulls in her arms so I becomes {I2} kg·m². What is her new angular speed?",I1*w1/I2,[f"No external torque, so I₁ω₁ = I₂ω₂.",f"ω₂ = {I1}×{w1}/{I2} = {f3(I1*w1/I2)} rad/s."],u='rad/s')
def r7():
    h=rint(2,12)
    return N('rot','M',f"A solid disk rolls without slipping from rest down a ramp, dropping {h} m. How fast is its centre moving at the bottom? {G}",math.sqrt(4*10*h/3),["Energy: mgh = ½mv² + ½Iω² with I = ½mR² and ω = v/R, so mgh = (3/4)mv².",f"v = √(4gh/3) = √(4×10×{h}/3) = {f3(math.sqrt(40*h/3))} m/s."],u='m/s')
def r8():
    return MQ('rot','M',"A solid sphere, a solid disk and a hoop (same mass and radius) are released together from rest at the top of a ramp and roll without slipping. Which reaches the bottom first?","The solid sphere",["The hoop","The solid disk","They arrive together"],["A smaller moment of inertia per mass means less of the energy goes into spinning, so more goes into moving down the slope.","I/(mR²): sphere 2/5, disk 1/2, hoop 1. The sphere wins, the hoop loses.","The solid sphere arrives first."])
def s1():
    m=rint(1,8);k=rint(2,20)*10
    return N('sho','C',f"A {m} kg mass hangs on a spring with k = {k} N/m. What is the period of its oscillation? (π ≈ 3.1416)",2*math.pi*math.sqrt(m/k),[f"T = 2π√(m/k) = 2π√({m}/{k}).",f"= {f3(2*math.pi*math.sqrt(m/k))} s."],u='s')
def s2():
    L=pick([.25,.5,1,1.5,2,4])
    return N('sho','C',f"What is the period of a simple pendulum of length {L} m? Use g = 9.8 m/s² and small angles.",2*math.pi*math.sqrt(L/9.8),[f"T = 2π√(L/g) = 2π√({L}/9.8).",f"= {f3(2*math.pi*math.sqrt(L/9.8))} s."],u='s')
def s3():
    T=pick([.5,.8,1,1.2,2]);m=rint(1,6)
    k=4*math.pi**2*m/T**2
    return N('sho','M',f"A {m} kg block on a spring oscillates with period {T} s. What is the spring constant?",k,[f"T = 2π√(m/k), so k = 4π²m/T².",f"k = 4π²({m})/{T}² = {f3(k)} N/m."],u='N/m')
def s4():
    A=pick([.05,.1,.2]);k=rint(2,10)*50;m=rint(1,5)
    return N('sho','C',f"A {m} kg block on a spring (k = {k} N/m) oscillates with amplitude {A} m. What is its maximum speed?",A*math.sqrt(k/m),[f"v_max = Aω = A√(k/m) = {A}√({k}/{m}).",f"= {f3(A*math.sqrt(k/m))} m/s."],u='m/s')
def s5():
    A=pick([.05,.1,.2,.3]);k=rint(2,10)*50
    return N('sho','C',f"What is the total mechanical energy of a spring (k = {k} N/m) oscillating with amplitude {A} m?",.5*k*A*A,[f"E = ½kA² = ½({k})({A})².",f"= {f3(.5*k*A*A)} J."],u='J')
def s6():
    f=pick([2,4,5,10,20,50])
    return N('sho','B',f"An oscillator completes {f} cycles every second. What is its period in milliseconds?",1000/f,[f"T = 1/f = 1/{f} s.",f"= {f3(1000/f)} ms."],u='ms')
def s7():
    return MQ('sho','C',"A mass on a spring oscillates with amplitude A. If the amplitude is doubled, what happens to the period?","It stays the same",["It doubles","It is halved","It increases by a factor of √2"],["T = 2π√(m/k) contains no amplitude.","The period of SHM does not depend on amplitude.","It stays the same."])
def s8():
    m=rint(1,4)
    return MQ('sho','M',f"A spring-mass system is taken to the Moon, where g is smaller. What happens to the period of the mass on the spring, and of a pendulum?","Spring: unchanged. Pendulum: longer",["Both unchanged","Spring: longer. Pendulum: unchanged","Both longer"],["Spring period 2π√(m/k) has no g.","Pendulum period 2π√(L/g) grows when g shrinks.","Spring unchanged, pendulum longer."])
def f1():
    h=rint(2,40)
    return N('flu','B',f"What is the gauge pressure at a depth of {h} m in fresh water (ρ = 1000 kg/m³)? {G} Answer in kPa.",1000*10*h/1000,[f"P = ρgh = 1000 × 10 × {h} = {1000*10*h} Pa.",f"= {f3(10*h)} kPa."],u='kPa')
def f2():
    A1=rint(1,5);k=rint(4,20);F=rint(10,100)
    A2=A1*k;F2=F*k
    return N('flu','C',f"A hydraulic lift has a small piston of area {A1} cm² and a large piston of area {A2} cm². The large piston must push up with {F2} N. What force must be applied to the small piston?",F,[f"F₁/A₁ = F₂/A₂ so F₁ = F₂A₁/A₂ = {F2} × {A1}/{A2}.",f"= {F} N."],u='N')
def f3_():
    V=rint(1,9)*1e-3
    return N('flu','C',f"A fully submerged object has volume {V*1000:g} litres ({V:g} m³). What buoyant force does fresh water (1000 kg/m³) exert on it? {G}",1000*V*10,[f"F_B = ρVg = 1000 × {V:g} × 10.",f"= {f3(1000*V*10)} N."],u='N')
def f4():
    rho=pick([200,400,600,800,900])
    return N('flu','C',f"A block of density {rho} kg/m³ floats in fresh water (1000 kg/m³). What percent of its volume is underwater?",rho/10,[f"Floating: weight = buoyant force, ρ_obj V g = ρ_w V_sub g.",f"V_sub/V = {rho}/1000 = {rho/1000:g}, so {rho/10:g}%."],u='%')
def f5():
    A1=rint(2,10);k=rint(2,5);v1=rint(1,5)
    return N('flu','C',f"Water moves at {v1} m/s through a pipe of cross-section {A1*k} cm². The pipe narrows to {A1} cm². How fast is the water in the narrow part?",v1*k,[f"Continuity: A₁v₁ = A₂v₂ so v₂ = {A1*k}×{v1}/{A1}.",f"= {v1*k} m/s."],u='m/s')
def f6():
    h=rint(1,20)
    return N('flu','M',f"A tank of water has a small hole {h} m below the surface. How fast does the water exit? {G} (3 significant figures)",math.sqrt(20*h),[f"Torricelli: v = √(2gh) = √(2×10×{h}).",f"= {f3(math.sqrt(20*h))} m/s."],u='m/s')
def f7():
    v1=rint(1,4);v2=v1+rint(2,6)
    dp=.5*1000*(v2*v2-v1*v1)
    return N('flu','M',f"Water flows horizontally from a wide pipe (speed {v1} m/s) into a narrow one (speed {v2} m/s). By how much does the pressure drop, in pascals? (ρ = 1000 kg/m³)",dp,["Bernoulli, same height: P₁ − P₂ = ½ρ(v₂² − v₁²).",f"= ½(1000)({v2*v2} − {v1*v1}) = {f3(dp)} Pa."],u='Pa')
def g1():
    n=pick([.5,1,2,3]);T=pick([250,300,350,400,500]);V=pick([.01,.02,.03,.05])
    P=n*8.31*T/V/1000
    return N('gas','C',f"What is the pressure, in kPa, of {n} mol of ideal gas at {T} K in a container of volume {V} m³? Use R = 8.31 J/(mol·K).",P,[f"P = nRT/V = {n}×8.31×{T}/{V}.",f"= {f3(P*1000)} Pa = {f3(P)} kPa."],u='kPa')
def g2():
    P=rint(1,5)*1e5;dV=pick([.001,.002,.005])
    return N('gas','C',f"A gas expands at a constant {P/1e5:g} × 10⁵ Pa, increasing its volume by {dV} m³. How much work does it do?",P*dV,[f"W = PΔV = {P:g} × {dV}.",f"= {f3(P*dV)} J."],u='J')
def g3():
    Q=rint(2,9)*100;W=rint(1,Q//100-1 if Q//100>1 else 1)*100
    return N('gas','C',f"A gas absorbs {Q} J of heat and does {W} J of work. What is the change in its internal energy?",Q-W,[f"ΔU = Q − W = {Q} − {W}.",f"= {Q-W} J."],u='J')
def g4():
    Th=pick([400,500,600,800]);Tc=pick([250,300,350])
    return N('gas','C',f"What is the maximum possible efficiency, in percent, of a heat engine running between {Th} K and {Tc} K?",100*(1-Tc/Th),[f"e_max = 1 − T_c/T_h = 1 − {Tc}/{Th}.",f"= {f3(100*(1-Tc/Th))}%."],u='%')
def g5():
    n=pick([1,2,3]);dT=rint(2,10)*10
    return N('gas','M',f"The temperature of {n} mol of monatomic ideal gas rises by {dT} K. What is the change in internal energy? (R = 8.31)",1.5*n*8.31*dT,[f"ΔU = (3/2)nRΔT = 1.5×{n}×8.31×{dT}.",f"= {f3(1.5*n*8.31*dT)} J."],u='J')
def g6():
    P1=rint(1,4);V1=rint(2,6);T1=pick([300,400]);V2=V1*2;T2=T1*pick([1,2,3])
    P2=P1*V1*T2/(V2*T1)
    return N('gas','M',f"A gas at {P1} atm, {V1} L and {T1} K expands to {V2} L at {T2} K. What is the new pressure in atm?",P2,[f"P₂ = P₁V₁T₂/(V₂T₁) = {P1}×{V1}×{T2}/({V2}×{T1}).",f"= {f3(P2)} atm."],u='atm')
def g7():
    W=rint(2,9)*100;e=pick([20,25,40,50])
    return N('gas','M',f"A heat engine does {W} J of work per cycle with an efficiency of {e}%. How much heat does it take in per cycle?",W*100/e,[f"e = W/Q_h so Q_h = W/e = {W}/{e/100:g}.",f"= {f3(W*100/e)} J."],u='J')
def d1():
    lam=pick([200,300,400,500,600,700])
    return N('mod','C',f"What is the energy, in eV, of a photon of wavelength {lam} nm? (E = 1240/λ)",1240/lam,[f"E = 1240/λ = 1240/{lam}.",f"= {f3(1240/lam)} eV."],u='eV')
def d2():
    lam=pick([200,250,300]);phi=pick([2.0,2.5,3.0,3.5,4.0])
    k=1240/lam-phi
    if k<=0.05:return None
    return N('mod','C',f"Light of wavelength {lam} nm falls on a metal with work function {phi} eV. What is the maximum kinetic energy of the ejected electrons, in eV?",k,[f"Photon energy = 1240/{lam} = {1240/lam:.2f} eV.",f"KE_max = hf − φ = {1240/lam:.2f} − {phi} = {f3(k)} eV."],u='eV')
def d3():
    n=pick([3,4,5,6]);
    E=13.6*(1/4-1/n**2)
    return N('mod','M',f"A hydrogen atom drops from level n = {n} to n = 2. What is the energy of the emitted photon, in eV? (E_n = −13.6/n²)",E,[f"ΔE = 13.6(1/2² − 1/{n}²) = 13.6({1/4:.3f} − {1/n**2:.4f}).",f"= {f3(E)} eV."],u='eV')
def d4():
    T=rint(2,12);k=rint(1,4);N0=pick([800,1600,640,320])
    return N('mod','C',f"A sample has half-life {T} days. How many of its {N0} nuclei remain after {k*T} days (assume exact halvings)?",N0/2**k,[f"{k*T} days = {k} half-lives.",f"N = {N0}/2^{k} = {f3(N0/2**k)}."])
def d5():
    dm=pick([.001,.002,.005,.01,.03])
    return N('mod','M',f"A nuclear reaction loses {dm} u of mass. How much energy is released, in MeV? (1 u = 931.5 MeV)",dm*931.5,[f"E = Δm × 931.5 MeV/u = {dm} × 931.5.",f"= {f3(dm*931.5)} MeV."],u='MeV')
def d6():
    V=pick([25,50,100,150,200,400])
    return N('mod','M',f"An electron is accelerated from rest through {V} V. What is its de Broglie wavelength in nanometres? (λ ≈ 1.226/√V nm)",1.226/math.sqrt(V),[f"λ = 1.226/√V = 1.226/√{V}.",f"= {f3(1.226/math.sqrt(V))} nm."],u='nm')
def d7():
    return MQ('mod','C',"In the photoelectric effect, making the light brighter (same colour, above threshold) mainly changes…","The number of electrons ejected per second",["The maximum kinetic energy of the electrons","The work function of the metal","The threshold frequency"],["Intensity sets the number of photons per second.","Each photon still has energy hf, so KE_max is unchanged.","More electrons per second, not faster ones."])
def e1():
    q=rint(1,9);r=pick([.1,.2,.3,.5,1,2])
    return N('gau','C',f"What is the electric potential, in kilovolts, at a distance of {r} m from a point charge of {q} µC? (k = 9.0 × 10⁹ N·m²/C²)",9e9*q*1e-6/r/1000,[f"V = kq/r = 9×10⁹ × {q}×10⁻⁶ / {r}.",f"= {f3(9e9*q*1e-6/r)} V = {f3(9e9*q*1e-6/r/1000)} kV."],u='kV')
def e2():
    q=rint(1,9);V=rint(2,50)*10
    return N('gau','B',f"How much energy does a charge of {q} µC gain moving through a potential difference of {V} V? Answer in millijoules.",q*1e-6*V*1000,[f"ΔU = qΔV = {q}×10⁻⁶ × {V} = {q*1e-6*V:g} J.",f"= {f3(q*1e-6*V*1000)} mJ."],u='mJ')
def e3():
    V=rint(2,20)*10;d=pick([.005,.01,.02,.04])
    return N('gau','B',f"A potential difference of {V} V is across parallel plates {d*100:g} cm apart. What is the electric field between them, in V/m?",V/d,[f"E = V/d = {V}/{d}.",f"= {f3(V/d)} V/m."],u='V/m')
def e4():
    Q=rint(1,9)
    return N('gau','C',f"A closed surface encloses a net charge of {Q} nC. What is the total electric flux through it, in N·m²/C? (ε₀ = 8.85 × 10⁻¹² C²/(N·m²))",Q*1e-9/8.85e-12,[f"Φ = Q/ε₀ = {Q}×10⁻⁹ / 8.85×10⁻¹².",f"= {f3(Q*1e-9/8.85e-12)} N·m²/C."],u='N·m²/C')
def e5():
    A=pick([.01,.02,.05,.1]);d=pick([.001,.002,.005])
    C=8.85e-12*A/d
    return N('gau','C',f"A parallel-plate capacitor has plate area {A} m² and plate separation {d*1000:g} mm. What is its capacitance in picofarads?",C*1e12,[f"C = ε₀A/d = 8.85×10⁻¹² × {A}/{d}.",f"= {f3(C*1e12)} pF."],u='pF')
def e6():
    C=rint(1,9);V=rint(2,12)
    return N('gau','C',f"How much energy is stored in a {C} µF capacitor charged to {V} V? Answer in microjoules.",.5*C*V*V,[f"U = ½CV² = ½({C}µF)({V})².",f"= {f3(.5*C*V*V)} µJ."],u='µJ')
def e7():
    V=pick([100,200,500,1000,2000])
    v=math.sqrt(2*1.6e-19*V/9.11e-31)
    return N('gau','M',f"An electron is released from rest and accelerated through {V} V. How fast is it going, in units of 10⁶ m/s? (e = 1.6×10⁻¹⁹ C, m = 9.11×10⁻³¹ kg)",v/1e6,[f"qV = ½mv² so v = √(2eV/m).",f"v = √(2×1.6×10⁻¹⁹×{V}/9.11×10⁻³¹) = {f3(v/1e6)} × 10⁶ m/s."],u=None)
def l1():
    q=pick([1.6e-19]);v=rint(1,9)*1e5;B=pick([.1,.2,.5,1])
    return N('lor','C',f"A proton (q = 1.6 × 10⁻¹⁹ C) moves at {v/1e5:g} × 10⁵ m/s perpendicular to a {B} T field. What is the magnetic force, in units of 10⁻¹⁵ N?",q*v*B*1e15,[f"F = qvB = 1.6×10⁻¹⁹ × {v:.3g} × {B}.",f"= {f3(q*v*B*1e15)} × 10⁻¹⁵ N."],u=None)
def l2():
    B=pick([.1,.2,.5]);I=rint(1,10);L=pick([.2,.5,1,2])
    return N('lor','C',f"A {L} m wire carrying {I} A is at right angles to a {B} T field. What is the force on it?",B*I*L,[f"F = BIL = {B} × {I} × {L}.",f"= {f3(B*I*L)} N."],u='N')
def l3():
    I=rint(1,20);r=pick([.01,.02,.05,.1])
    return N('lor','C',f"What is the magnetic field, in microteslas, at {r*100:g} cm from a long straight wire carrying {I} A? (μ₀ = 4π × 10⁻⁷ T·m/A)",2e-7*I/r*1e6,[f"B = μ₀I/(2πr) = 2×10⁻⁷ × {I}/{r}.",f"= {f3(2e-7*I/r*1e6)} µT."],u='µT')
def l4():
    n=rint(2,10)*100;I=rint(1,5)
    return N('lor','C',f"A long solenoid has {n} turns per metre and carries {I} A. What is the field inside, in millitesla? (μ₀ = 4π × 10⁻⁷)",4*math.pi*1e-7*n*I*1000,[f"B = μ₀nI = 4π×10⁻⁷ × {n} × {I}.",f"= {f3(4*math.pi*1e-7*n*I*1000)} mT."],u='mT')
def l5():
    B=pick([.2,.5,1]);L=pick([.2,.5,1]);v=rint(2,10)
    return N('lor','C',f"A metal rod of length {L} m moves at {v} m/s at right angles to a {B} T field. What emf appears across it?",B*L*v,[f"ε = BLv = {B}×{L}×{v}.",f"= {f3(B*L*v)} V."],u='V')
def l6():
    Nn=rint(10,200);dPhi=pick([.002,.004,.01]);dt=pick([.1,.2,.5])
    return N('lor','M',f"A coil of {Nn} turns sees its flux change by {dPhi} Wb in {dt} s. What is the magnitude of the induced emf?",Nn*dPhi/dt,[f"|ε| = NΔΦ/Δt = {Nn}×{dPhi}/{dt}.",f"= {f3(Nn*dPhi/dt)} V."],u='V')
def l7():
    v=rint(1,9)*1e5;B=pick([.05,.1,.2,.5])
    r=1.67e-27*v/(1.6e-19*B)
    return N('lor','M',f"A proton (m = 1.67×10⁻²⁷ kg, q = 1.6×10⁻¹⁹ C) enters a {B} T field at {v/1e5:g} × 10⁵ m/s, perpendicular to it. What is the radius of its circular path, in millimetres?",r*1000,[f"r = mv/(qB) = 1.67×10⁻²⁷×{v:.3g}/(1.6×10⁻¹⁹×{B}).",f"= {f3(r*1000)} mm."],u='mm')
def l8():
    return MQ('lor','C',"A charged particle moves through a magnetic field. The magnetic force on it…","Does no work, so its speed stays constant",["Speeds it up when it points along the motion","Slows it down","Acts along the direction of the field"],["F = qv × B is always perpendicular to v.","A force perpendicular to the motion does no work.","The speed is unchanged; only the direction changes."])
def w1():
    f=pick([90,100,500,1000])
    return N('mxw','B',f"A radio station broadcasts at {f} MHz. What is the wavelength in metres? (c = 3.0 × 10⁸ m/s)",3e8/(f*1e6),[f"λ = c/f = 3×10⁸/({f}×10⁶).",f"= {f3(3e8/(f*1e6))} m."],u='m')
def w2():
    lam=pick([450,500,550,600,650]);L=pick([1,2,3]);d=pick([.1,.2,.5])
    dy=lam*1e-9*L/(d*1e-3)
    return N('mxw','C',f"Light of wavelength {lam} nm passes through two slits {d} mm apart onto a screen {L} m away. What is the fringe spacing, in millimetres?",dy*1000,[f"Δy = λL/d = {lam}×10⁻⁹×{L}/({d}×10⁻³).",f"= {f3(dy*1000)} mm."],u='mm')
def w3():
    I0=rint(2,10)*10;th=pick([30,45,60])
    return N('mxw','C',f"Polarized light of intensity {I0} W/m² hits a polarizer whose axis is {th}° from the light's polarization. What intensity passes?",I0*math.cos(math.radians(th))**2,[f"Malus: I = I₀cos²θ = {I0}×cos²{th}°.",f"= {f3(I0*math.cos(math.radians(th))**2)} W/m²."],u='W/m²')
def w4():
    n=pick([1.33,1.5,1.6,2.0,2.4])
    return N('mxw','C',f"What is the speed of light in a material of refractive index {n}? Answer in units of 10⁸ m/s.",3/n,[f"v = c/n = 3.0×10⁸/{n}.",f"= {f3(3/n)} × 10⁸ m/s."],u=None)
def w5():
    n=pick([1.33,1.5,2.0,2.4])
    return N('mxw','M',f"What is the critical angle, in degrees, for light going from a material of index {n} into air (n = 1)?",math.degrees(math.asin(1/n)),[f"sin θ_c = n₂/n₁ = 1/{n}.",f"θ_c = {f3(math.degrees(math.asin(1/n)))}°."],u=None)
def w6():
    lam=pick([500,600,650]);a=pick([.05,.1,.2])
    th=math.degrees(math.asin(lam*1e-9/(a*1e-3)))
    return N('mxw','M',f"Light of wavelength {lam} nm passes through a single slit {a} mm wide. At what angle, in degrees, is the first dark fringe? (3 significant figures)",th,[f"a sin θ = λ so sin θ = {lam}×10⁻⁹/({a}×10⁻³).",f"θ = {f3(th)}°."],u=None)
def w7():
    return MQ('mxw','C',"Unpolarized light of intensity I₀ passes through one ideal polarizer. What is the transmitted intensity?","I₀/2",["I₀","I₀/4","0"],["An ideal polarizer passes the component along its axis, averaged over all directions.","The average of cos²θ over all angles is ½.","I₀/2."])
def c1():
    a0=rint(1,6);T=rint(2,6)
    return N('cal','C',f"A particle starts from rest with acceleration a(t) = {a0}t m/s². What is its speed at t = {T} s?",a0*T*T/2,[f"v = ∫a dt = {a0}t²/2.",f"At t = {T}: {f3(a0*T*T/2)} m/s."],u='m/s')
def c2():
    b=rint(1,6);T=rint(2,5)
    return N('cal','C',f"A particle starts at x = 0 with velocity v(t) = {b}t² m/s. Where is it at t = {T} s?",b*T**3/3,[f"x = ∫v dt = {b}t³/3.",f"At t = {T}: {f3(b*T**3/3)} m."],u='m')
def c3():
    c=rint(1,6);X=rint(2,5)
    return N('cal','C',f"A force F(x) = {c}x² newtons acts as an object moves from x = 0 to x = {X} m. How much work does it do?",c*X**3/3,[f"W = ∫F dx = {c}x³/3.",f"From 0 to {X}: {f3(c*X**3/3)} J."],u='J')
def c4():
    c=rint(1,8);T=rint(2,6)
    return N('cal','C',f"A force F(t) = {c}t newtons acts for {T} s on a 2 kg object at rest. What is its final speed?",c*T*T/2/2,[f"Impulse = ∫F dt = {c}t²/2 = {f3(c*T*T/2)} N·s.",f"v = J/m = {f3(c*T*T/4)} m/s."],u='m/s')
def c5():
    a=rint(1,5);x=rint(1,4)
    return N('cal','M',f"A potential energy function is U(x) = {a}x³ joules. What is the force on the object at x = {x} m (positive means +x direction)?",-3*a*x*x,[f"F = −dU/dx = −3·{a}x².",f"At x = {x}: {-3*a*x*x} N."],u='N')
def c6():
    L=pick([1,2,3,4,6])
    return N('cal','M',f"A thin rod of length {L} m has linear density λ = kx (heavier toward the far end), x measured from the light end. Where is its centre of mass, in metres from the light end?",2*L/3,["x_cm = ∫x·kx dx / ∫kx dx = (L³/3)/(L²/2).",f"= 2L/3 = {f3(2*L/3)} m."],u='m')
def c7():
    M=rint(1,6);L=pick([.5,1,2])
    return N('cal','M',f"Use I = ∫r²dm to find the moment of inertia of a uniform rod of mass {M} kg and length {L} m about one end.",M*L*L/3,["dm = (M/L)dr, so I = ∫₀ᴸ r²(M/L)dr = ML²/3.",f"= {M}×{L}²/3 = {f3(M*L*L/3)} kg·m²."],u='kg·m²')
def o1():
    k=rint(2,4)
    return N('orb','C',f"How does g at a distance of {k} Earth radii from Earth's centre compare to g at the surface? Give the ratio as a decimal.",1/k**2,["g = GM/r² so g ∝ 1/r².",f"Ratio = 1/{k}² = {f3(1/k**2)}."],tol=.01)
def o2():
    h=pick([200,400,800,1500])
    r=6.37e6+h*1e3;v=math.sqrt(3.99e14/r)
    return N('orb','M',f"A satellite orbits {h} km above Earth's surface. Find its orbital speed in km/s. (GM_Earth = 3.99 × 10¹⁴ m³/s², R_Earth = 6370 km)",v/1000,[f"r = 6370 + {h} km. v = √(GM/r).",f"v = √(3.99×10¹⁴/{r:.3g}) = {f3(v/1000)} km/s."],u='km/s')
def o3():
    k=pick([4,9,16,25]);T1=rint(1,10)
    return N('orb','C',f"A planet orbits at {k} times the distance of another and the inner planet's period is {T1} years. What is the outer planet's period, in years?",T1*k**1.5,["Kepler: T² ∝ r³, so T₂ = T₁(r₂/r₁)^{3/2}.",f"= {T1} × {k}^1.5 = {f3(T1*k**1.5)} years."],u='years')
def o4():
    M=pick([6.0e24,5.97e24]);R=pick([6.37e6])
    v=math.sqrt(2*6.67e-11*M/R)
    return N('orb','M',f"What is the escape speed from a planet of mass {M:.2e} kg and radius {R/1000:.0f} km, in km/s? (G = 6.67×10⁻¹¹)",v/1000,[f"v_esc = √(2GM/R) = √(2×6.67×10⁻¹¹×{M:.2e}/{R:.3g}).",f"= {f3(v/1000)} km/s."],u='km/s')
def o5():
    m=pick([100,500,1000]);r=pick([7e6,8e6,1e7])
    return N('orb','M',f"What is the total mechanical energy, in gigajoules, of a {m} kg satellite in a circular orbit of radius {r:.3g} m about Earth? (GM = 3.99 × 10¹⁴; give a negative number)",-3.99e14*m/(2*r)/1e9,[f"E = −GMm/(2r) = −3.99×10¹⁴×{m}/(2×{r:.3g}).",f"= {f3(-3.99e14*m/(2*r)/1e9)} GJ."],u='GJ')
def o6():
    return MQ('orb','C',"A satellite moves to a higher circular orbit. Which statement is correct?","Its speed decreases and its total energy increases",["Its speed increases and its total energy increases","Its speed increases and its total energy decreases","Its speed decreases and its total energy decreases"],["v = √(GM/r) falls as r grows.","E = −GMm/(2r) gets closer to zero, so it increases.","Slower, but with more total energy."])
def x1():
    A=rint(5,30);th=pick([30,37,45,53,60])
    return N('dim','B',f"A vector of magnitude {A} has a direction {th}° above the x-axis. What is its y-component? (3 significant figures)",A*math.sin(math.radians(th)),[f"A_y = A sin θ = {A} sin {th}°.",f"= {f3(A*math.sin(math.radians(th)))}."])
def x2():
    a=rint(3,12);b=rint(3,12)
    return N('dim','B',f"Two perpendicular displacements of {a} m and {b} m are added. What is the magnitude of the resultant? (3 significant figures)",math.hypot(a,b),[f"|R| = √({a}² + {b}²) = √{a*a+b*b}.",f"= {f3(math.hypot(a,b))} m."],u='m')
def x3():
    A=rint(2,9);B=rint(2,9);th=pick([0,30,60,90])
    return N('dim','C',f"Vectors A (magnitude {A}) and B (magnitude {B}) are {th}° apart. What is A·B?",A*B*math.cos(math.radians(th)),[f"A·B = AB cos θ = {A}×{B}×cos {th}°.",f"= {f3(A*B*math.cos(math.radians(th)))}."])
def x4():
    L=pick([20.0,25.0,40.0]);dL=pick([.2,.5,1.0]);w=pick([10.0,12.0,15.0]);dw=pick([.1,.2,.3])
    rel=(dL/L+dw/w)*100
    return N('dim','M',f"A rectangle is measured as {L} ± {dL} cm by {w} ± {dw} cm. Using the rule for products, what is the percent uncertainty in its area? (3 significant figures)",rel,["For a product relative uncertainties add: δA/A ≈ δL/L + δw/w.",f"= {dL}/{L} + {dw}/{w} = {f3(rel/100)} = {f3(rel)}%."],u='%')
def x5():
    v=rint(2,30)*5
    return N('dim','B',f"Convert {v} km/h to metres per second. (3 significant figures)",v/3.6,[f"1 km/h = 1000 m / 3600 s = 1/3.6 m/s.",f"{v}/3.6 = {f3(v/3.6)} m/s."],u='m/s')
def x6():
    return MQ('dim','C',"Which equation is dimensionally consistent for a distance x, speed v, acceleration a and time t?","x = v t + ½ a t²",["x = v t + a t","x = v² t","x = a t + ½ v t²"],["Check each term has dimensions of length L.","vt is L, ½at² is (L/T²)T² = L. Both terms are L.","x = v t + ½ a t²."])
def x7():
    return MQ('dim','M',"A student derives that the period of a pendulum is T = 2π√(g/L). What quick check shows the formula is wrong?","The units of √(g/L) are 1/s, not seconds",["The formula has a factor of 2π","It does not include the mass","It gives a positive period"],["g/L has units (m/s²)/m = 1/s².","So √(g/L) has units 1/s, not s. Dimensional analysis rejects it. (Also: longer pendulums should be slower.)","The correct form is T = 2π√(L/g)."])
def x8():
    return MQ('dim','C',"Which is the best estimate for the number of seconds in one year?","3 × 10⁷",["3 × 10⁵","3 × 10⁹","3 × 10¹¹"],["365 × 24 × 3600 ≈ 365 × 86,400.","≈ 3.15 × 10⁷ seconds.","The right order of magnitude is 10⁷."])
FAMS=[r1,r2,r3,r4,r5,r6,r7,r8,s1,s2,s3,s4,s5,s6,s7,s8,f1,f2,f3_,f4,f5,f6,f7,g1,g2,g3,g4,g5,g6,g7,d1,d2,d3,d4,d5,d6,d7,e1,e2,e3,e4,e5,e6,e7,l1,l2,l3,l4,l5,l6,l7,l8,w1,w2,w3,w4,w5,w6,w7,c1,c2,c3,c4,c5,c6,c7,o1,o2,o3,o4,o5,o6,x1,x2,x3,x4,x5,x6,x7,x8]
def run(n=14):
    for f in FAMS:gen.rep(f,n)
