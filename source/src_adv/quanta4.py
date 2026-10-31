# -*- coding: utf-8 -*-
"""Quanta 4: AC, filters, devices, digital logic, magnetism, power."""
from adv_h import *
CARDS={
'ac':[
("What AC means","Alternating current swings back and forth like a sine wave. Wall power is 60 Hz in the US: 60 full cycles each second.",None),
("RMS values","The RMS value gives the same heating as DC. For a sine wave V_rms = V_peak/√2 ≈ 0.707 V_peak. US outlets are 120 V rms.","V_rms = V_pk/√2"),
("Reactance","A capacitor resists AC by X_C = 1/(2πfC); an inductor by X_L = 2πfL. Units: ohms. Capacitors pass high frequencies, inductors pass low ones.","X_L = 2πfL"),
("Impedance","Resistance and reactance combine at right angles: |Z| = √(R² + X²) for a series RL or RC circuit. Ohm's law becomes V = IZ.","|Z| = √(R²+X²)"),
("Power factor","Only the resistive part uses real power: P = V·I·cos φ, where cos φ = R/|Z| is the power factor.","P = VI cos φ")],
'flt':[
("Frequency response","A filter treats frequencies differently. A low-pass filter keeps low frequencies, a high-pass keeps high ones, and a band-pass keeps a range.",None),
("RC cutoff","An RC filter drops to 70.7% (−3 dB) of the input at the cutoff frequency f_c = 1/(2πRC).","f_c = 1/(2πRC)"),
("Decibels","Decibels compare sizes on a log scale: dB = 20 log₁₀(V_out/V_in) for voltage. Every factor of 10 is 20 dB; halving is about −6 dB.","dB = 20 log₁₀(Vout/Vin)"),
("Resonance","A series LC circuit has the lowest impedance at f₀ = 1/(2π√(LC)), where X_L = X_C. Radios tune by changing this frequency.","f₀ = 1/(2π√LC)"),
("Quality factor","Q = f₀/bandwidth tells how sharp the resonance is. A series RLC has Q = X_L/R at resonance.",None)],
'dev':[
("Diodes","A diode lets current go one way. Silicon needs about 0.7 V forward; an LED needs roughly 2 V. Always add a series resistor.",None),
("LED resistor","The resistor drops the leftover voltage: R = (V_supply − V_LED)/I.","R = (Vs − Vf)/I"),
("Rectifiers","A diode on an AC source blocks the negative half (half-wave). A bridge of four diodes flips the negative half (full-wave). A capacitor then smooths it.",None),
("Transistors","A small base current controls a big collector current: I_C = β·I_B. It works as a switch or an amplifier.","I_C = βI_B"),
("Op-amps","An op-amp with negative feedback has two golden rules: no current into the inputs and equal input voltages. Inverting gain = −R_f/R_in; non-inverting gain = 1 + R_f/R_in.",None)],
'dig':[
("Binary","Computers use only 0 and 1. Each place is a power of 2: 1, 2, 4, 8, 16... so 1011₂ = 8 + 2 + 1 = 11.",None),
("Hexadecimal","Hex uses 16 digits (0–9, A–F). One hex digit equals four bits: A = 1010, F = 1111.",None),
("Logic gates","AND is 1 only if both inputs are 1. OR is 1 if either is 1. NOT flips the bit. NAND and NOR are the opposites of AND and OR.",None),
("Truth tables","A truth table lists the output for every input combination. n inputs give 2ⁿ rows.",None),
("Converting analog to digital","An n-bit converter splits its range into 2ⁿ levels. Step size = full-scale voltage ÷ 2ⁿ.","step = V_fs/2ⁿ")],
'mag':[
("Magnetic fields","Magnets and moving charges make magnetic fields, measured in tesla (T). Field lines run from north to south outside the magnet.",None),
("Force on a wire","A wire of length L carrying current I in a field B feels force F = BIL when the wire is at right angles to the field.","F = BIL"),
("Force on a charge","A charge q moving at speed v across field B feels F = qvB. The force is sideways, so the charge goes in a circle of radius r = mv/(qB).","F = qvB"),
("Induction","A changing magnetic flux induces a voltage: ε = −N ΔΦ/Δt (Faraday's law). Lenz's law says the induced current opposes the change.","ε = −NΔΦ/Δt"),
("Transformers","Two coils on one iron core: V₂/V₁ = N₂/N₁. A step-up transformer raises voltage and lowers current.","V₂/V₁ = N₂/N₁")],
'pwr':[
("Electric power","Power is P = VI = I²R = V²/R, in watts. A kilowatt-hour (kWh) is the energy of 1 kW used for 1 hour, or 3.6 million joules.","P = VI"),
("Why power lines use high voltage","Wire loss is I²R. Raising the voltage by 10× cuts the current for the same power by 10× and the loss by 100×.",None),
("Efficiency","Efficiency = useful output power ÷ input power. The difference leaves as heat.",None),
("Three-phase power","Power plants use three sine waves 120° apart. Total power is √3·V_line·I_line·cos φ.",None)],
}
def a1():
    V=rint(5,50)
    return NM('ac','B',f"An AC source has a peak voltage of {V} V. What is its RMS voltage? (2 decimals)",round(V/math.sqrt(2),2),["V_rms = V_peak/√2.",f"= {V/math.sqrt(2):.2f} V."],u='V',free=True,tol=0.006)
def a2():
    V=rint(5,40)*10
    return NM('ac','B',f"A wall outlet gives {V} V rms. What is the peak voltage? (1 decimal)",round(V*math.sqrt(2),1),["V_peak = V_rms × √2.",f"= {V*math.sqrt(2):.1f} V."],u='V',free=True,tol=0.004)
def a3():
    f=pick([50,60,100,400]);L=pick([0.1,0.5,1,2])
    return NM('ac','C',f"Find the reactance of a {L} H inductor at {f} Hz (Ω, 1 decimal).",round(2*math.pi*f*L,1),[f"X_L = 2πfL = 2π × {f} × {L}.",f"= {2*math.pi*f*L:.1f} Ω."],u='Ω',free=True,tol=0.004)
def a4():
    f=pick([50,60,100,1000]);C=pick([1,2,5,10,100])
    return NM('ac','C',f"Find the reactance of a {C} µF capacitor at {f} Hz (Ω, 1 decimal).",round(1/(2*math.pi*f*C*1e-6),1),[f"X_C = 1/(2πfC) = 1/(2π × {f} × {C}×10⁻⁶).",f"= {1/(2*math.pi*f*C*1e-6):.1f} Ω."],u='Ω',free=True,tol=0.004)
def a5():
    R,X=pick([(3,4),(6,8),(5,12),(8,15),(30,40)])
    return NM('ac','C',f"A series circuit has R = {R} Ω and reactance X = {X} Ω. What is |Z|?",math.hypot(R,X),["|Z| = √(R² + X²).",f"= √({R*R} + {X*X}) = {math.hypot(R,X):.4g} Ω."],u='Ω',free=True,tol=0.004)
def a6():
    R,X=pick([(3,4),(6,8),(5,12),(8,15)])
    return NM('ac','M',f"A series RL circuit has R = {R} Ω and X_L = {X} Ω. What is the power factor? (3 decimals)",round(R/math.hypot(R,X),3),["PF = cos φ = R/|Z|.",f"= {R}/{math.hypot(R,X):.4g} = {R/math.hypot(R,X):.3f}."],tol=0.006)
def a7():
    V=rint(6,24)*10;R,X=pick([(30,40),(60,80),(50,120)])
    I=V/math.hypot(R,X)
    return NM('ac','M',f"A {V} V rms source drives a series circuit with R = {R} Ω and X = {X} Ω. What is the real power dissipated (W, 2 decimals)?",round(I*I*R,2),[f"|Z| = {math.hypot(R,X):.4g} Ω so I = {I:.4f} A.",f"P = I²R = {I*I*R:.2f} W."],u='W',free=True,tol=0.006)
def f1():
    R=rint(1,9)*1000;C=pick([10,100,220,470])
    return NM('flt','C',f"An RC low-pass filter has R = {R} Ω and C = {C} nF. Find the cutoff frequency in Hz (nearest Hz).",round(1/(2*math.pi*R*C*1e-9)),[f"f_c = 1/(2πRC) = 1/(2π × {R} × {C}×10⁻⁹).",f"≈ {1/(2*math.pi*R*C*1e-9):.0f} Hz."],u='Hz',free=True,tol=0.006)
def f2():
    r=pick([2,10,100,0.5,0.1])
    return NM('flt','C',f"A filter's output voltage is {r}× its input. What is its gain in dB? (1 decimal)",round(20*math.log10(r),1),[f"dB = 20 log₁₀({r}).",f"= {20*math.log10(r):.1f} dB."],u='dB',free=True,tol=0.01)
def f3():
    return NM('flt','B',"At its cutoff frequency, how many dB has an RC filter's output fallen by? (positive number)",3,["At f_c the output is 0.707 of the input: 20 log₁₀(0.707) ≈ −3 dB."],u='dB',free=True,tol=0.05)
def f4():
    L=pick([1,10,100]);C=pick([1,10,100])
    f0=1/(2*math.pi*math.sqrt(L*1e-3*C*1e-6))
    return NM('flt','M',f"Find the resonant frequency of a series circuit with L = {L} mH and C = {C} µF (Hz, nearest).",round(f0),[f"f₀ = 1/(2π√(LC)) = 1/(2π√({L}×10⁻³ × {C}×10⁻⁶)).",f"≈ {f0:.0f} Hz."],u='Hz',free=True,tol=0.006)
def f5():
    f0=rint(1,10)*1000;bw=rint(1,10)*100
    return NM('flt','C',f"A resonant circuit has f₀ = {f0} Hz and bandwidth {bw} Hz. What is Q? (2 decimals)",round(f0/bw,2),[f"Q = f₀/BW = {f0}/{bw}.",f"= {f0/bw:.2f}."],tol=0.006)
def f6():
    return NM('flt','F',"A high-pass filter passes low or high frequencies? Type 1 for high, 0 for low.",1,["A high-pass filter keeps high frequencies and blocks low ones."])
def d1():
    Vs=pick([5,9,12]);Vf=pick([1.8,2.0,2.2]);I=pick([10,15,20])
    return NM('dev','B',f"An LED needs {Vf} V and {I} mA from a {Vs} V supply. What series resistor (Ω, nearest)?",round((Vs-Vf)/(I/1000)),[f"R = ({Vs} − {Vf})/{I/1000}.",f"= {(Vs-Vf)/(I/1000):.0f} Ω."],u='Ω',free=True,tol=0.006)
def d2():
    V=rint(5,30)
    return NM('dev','C',f"A {V} V source feeds a silicon diode (0.7 V drop) and a 1 kΩ resistor in series. What current flows, in mA? (2 decimals)",round((V-0.7)/1,2),[f"V_R = {V} − 0.7 = {V-0.7:.1f} V.",f"I = {V-0.7:.1f}/1000 = {V-0.7:.2f} mA."],u='mA',free=True,tol=0.006)
def d3():
    b=rint(50,200);IB=rint(10,100)
    return NM('dev','B',f"A transistor has β = {b} and base current {IB} µA. What is the collector current in mA? (2 decimals)",round(b*IB/1000,2),[f"I_C = βI_B = {b} × {IB} µA = {b*IB} µA.",f"= {b*IB/1000:.2f} mA."],u='mA',free=True,tol=0.006)
def d4():
    Rf=rint(2,20)*10;Ri=rint(1,10)*10
    return NM('dev','C',f"An inverting op-amp has R_in = {Ri} kΩ and R_f = {Rf} kΩ. What is its voltage gain? (include the sign, 2 decimals)",round(-Rf/Ri,2),["Gain = −R_f/R_in.",f"= −{Rf}/{Ri} = {-Rf/Ri:.2f}."],tol=0.006,free=True)
def d5():
    Rf=rint(2,20)*10;Ri=rint(1,10)*10
    return NM('dev','C',f"A non-inverting op-amp has R_f = {Rf} kΩ and R_in = {Ri} kΩ. What is its gain (2 decimals)?",round(1+Rf/Ri,2),["Gain = 1 + R_f/R_in.",f"= 1 + {Rf}/{Ri} = {1+Rf/Ri:.2f}."],tol=0.006,free=True)
def d6():
    Vp=rint(5,30)
    return NM('dev','M',f"A full-wave bridge rectifier has {Vp} V peak AC in and two silicon diodes (0.7 V each) conduct at a time. What is the peak output voltage (V, 1 decimal)?",round(Vp-1.4,1),[f"Two diode drops: 2 × 0.7 = 1.4 V.",f"{Vp} − 1.4 = {Vp-1.4:.1f} V."],u='V',free=True,tol=0.004)
def g1():
    n=rint(5,63)
    return NM('dig','F',f"Convert the binary number {bin(n)[2:]} to decimal.",n,["Add up the powers of 2 where there is a 1."],free=True)
def g2():
    n=rint(5,250)
    if R.random()<0.5:
        return NM('dig','B',f"How many bits are needed to write decimal {n} in binary?",n.bit_length(),[f"{n} in binary is {bin(n)[2:]}, which has {n.bit_length()} digits."],free=True)
    return NM('dig','C',f"How many 1s are in the binary form of decimal {n}?",bin(n).count('1'),[f"{n} in binary is {bin(n)[2:]}.",f"It has {bin(n).count('1')} ones."],free=True)
def g3():
    n=rint(16,255)
    return NM('dig','C',f"Convert hexadecimal {hex(n)[2:].upper()} to decimal.",n,["Multiply the first digit by 16 and add the second."],free=True)
def g4():
    n=rint(2,6)
    return NM('dig','B',f"How many rows does a truth table have for a circuit with {n} inputs?",2**n,["Each input is 0 or 1, giving 2ⁿ combinations."])
def g5():
    b=rint(6,12);V=pick([3.3,5])
    return NM('dig','C',f"A {b}-bit ADC measures 0 to {V} V. What is the step size in mV? (3 sig figs)",float(f"{V/2**b*1000:.3g}"),[f"Step = {V}/2^{b} = {V}/{2**b} V.",f"= {V/2**b*1000:.3g} mV."],u='mV',free=True,tol=0.006)
def g6():
    a,b=rint(0,1),rint(0,1)
    g=pick(['AND','OR','NAND','NOR','XOR'])
    r={'AND':a&b,'OR':a|b,'NAND':1-(a&b),'NOR':1-(a|b),'XOR':a^b}[g]
    return NM('dig','F',f"What is {a} {g} {b}? (type 0 or 1)",r,[f"Apply the {g} rule to inputs {a} and {b}."])
def g7():
    n=rint(2,8)
    return NM('dig','C',f"How many different values can an {n}-bit number represent?",2**n,["Each bit doubles the count: 2ⁿ."])
def m1():
    B=pick([0.1,0.2,0.5,1]);I=rint(1,10);L=pick([0.1,0.2,0.5])
    return NM('mag','B',f"A {L} m wire carries {I} A at right angles to a {B} T field. Find the force (N, 3 decimals).",round(B*I*L,3),[f"F = BIL = {B} × {I} × {L}.",f"= {B*I*L:.3f} N."],u='N',free=True,tol=0.006)
def m2():
    N=rint(100,1000);dPhi=pick([0.01,0.02,0.05]);dt=pick([0.1,0.2,0.5])
    return NM('mag','C',f"A {N}-turn coil sees its flux change by {dPhi} Wb in {dt} s. What voltage is induced (V, 1 decimal)?",round(N*dPhi/dt,1),[f"|ε| = NΔΦ/Δt = {N} × {dPhi}/{dt}.",f"= {N*dPhi/dt:.1f} V."],u='V',free=True,tol=0.004)
def m3():
    N1=rint(100,500);k=rint(2,6);V1=pick([120,240,12])
    return NM('mag','B',f"A transformer has {N1} primary turns and {N1*k} secondary turns. The primary is {V1} V. What is the secondary voltage?",V1*k,["V₂ = V₁ × N₂/N₁."],u='V',free=True)
def m4():
    V1=120;V2=pick([6,12,24]);I2=rint(1,5)
    return NM('mag','C',f"An ideal transformer steps {V1} V down to {V2} V and delivers {I2} A. What primary current flows (A, 3 decimals)?",round(V2*I2/V1,3),["Input power = output power: V₁I₁ = V₂I₂.",f"I₁ = {V2}×{I2}/{V1} = {V2*I2/V1:.3f} A."],u='A',free=True,tol=0.006)
def m5():
    q=1.6e-19;m=9.11e-31;v=pick([1,2,5])*1e6;B=pick([1,2,5])*1e-3
    r=m*v/(q*B)*1000
    return NM('mag','M',f"An electron moves at {v:.0e} m/s perpendicular to a {B*1000:g} mT field. Find its orbit radius in mm (2 sig figs; m = 9.11×10⁻³¹ kg, e = 1.6×10⁻¹⁹ C).",float(f"{r:.2g}"),["r = mv/(qB).",f"≈ {r:.2g} mm."],u='mm',free=True,tol=0.01)
def p1():
    V=rint(5,24);I=rint(1,10)
    return NM('pwr','F',f"A device runs on {V} V and draws {I} A. What is its power (W)?",V*I,["P = VI."],u='W',free=True)
def p2():
    P=rint(1,10)*100;h=rint(2,10)
    return NM('pwr','B',f"A {P} W heater runs for {h} hours. How many kWh does it use? (2 decimals)",round(P*h/1000,2),[f"{P} W = {P/1000} kW. Energy = {P/1000} × {h}.",f"= {P*h/1000:.2f} kWh."],u='kWh',free=True)
def p3():
    P=rint(1,10)*1000;V=pick([240,12000,120000]);R=rint(1,10)
    I=P/V
    return NM('pwr','M',f"A line of resistance {R} Ω carries {P} W at {V} V. How much power does the line lose (W, 3 decimals)?",round(I*I*R,3),[f"I = P/V = {I:.4f} A.",f"Loss = I²R = {I*I*R:.3f} W."],u='W',free=True,tol=0.006)
def p4():
    Pin=rint(2,10)*100;e=pick([0.5,0.6,0.8,0.9])
    return NM('pwr','B',f"A motor takes {Pin} W and is {int(e*100)}% efficient. How much useful power does it deliver (W)?",Pin*e,[f"{Pin} × {e} = {Pin*e:g}."],u='W',free=True)
def p5():
    P=rint(1,6)*100;rate=pick([0.12,0.15,0.2,0.3]);h=pick([10,20,50])
    return NM('pwr','C',f"A {P} W appliance runs {h} hours at ${rate}/kWh. What does it cost (dollars, 2 decimals)?",round(P/1000*h*rate,2),[f"Energy = {P/1000} kW × {h} h = {P*h/1000:g} kWh.",f"Cost = {P*h/1000:g} × {rate} = ${P*h/1000*rate:.2f}."],u='$',free=True,tol=0.006)
def p6():
    V=pick([208,400,480]);I=rint(5,30)
    return NM('pwr','M',f"A balanced three-phase load has line voltage {V} V, line current {I} A and power factor 1. Find the total power in kW (√3·V·I, 2 decimals).",round(math.sqrt(3)*V*I/1000,2),[f"P = √3 × {V} × {I} = {math.sqrt(3)*V*I:.0f} W.",f"= {math.sqrt(3)*V*I/1000:.2f} kW."],u='kW',free=True,tol=0.006)
FAMS=[a1,a2,a3,a4,a5,a6,a7,f1,f2,f3,f4,f5,f6,d1,d2,d3,d4,d5,d6,g1,g2,g3,g4,g5,g6,g7,m1,m2,m3,m4,m5,p1,p2,p3,p4,p5,p6]
def run(n=14):
    for f in FAMS:gen.rep(f,n)
