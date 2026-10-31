# -*- coding: utf-8 -*-
import sys,os,math
sys.path.insert(0,os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','src_geo'))
from gen import *
import figs
def ri(a,b):return R.randint(a,b)
DIR=[('north',0),('northeast',45),('east',90),('southeast',135),('south',180),('southwest',225),('west',270),('northwest',315)]
def _bad(good,pool,n=3):
    o=[x for x in pool if x!=good];R.shuffle(o);return o[:n]
# ---- station model / barbs
def st1():
    T=ri(20,95);D=T-ri(2,25);p=ri(0,999);d=R.choice(DIR)[1];sp=R.choice([5,10,15,20,25,30,35])
    return NUM('maps',1,'st1',"In this station model, what is the temperature (°F)?",T,["The temperature is the number at the upper left.",f"It reads {T}."],svg=figs.station(T,D,f"{p:03d}",None,R.choice([0,.25,.5,.75,1]),d,sp),b=-.8)
def st2():
    T=ri(40,95);dep=ri(1,20);D=T-dep;d=R.choice(DIR)[1];sp=R.choice([5,10,15,20])
    return NUM('maps',2,'st2',"The station model shows temperature (upper left) and dew point (lower left). How many °F apart are they?",dep,["Subtract: temperature − dew point.",f"{T} − {D} = {dep}."],svg=figs.station(T,D,f"{ri(0,999):03d}",None,R.choice([0,.5,1]),d,sp),b=0)
def st3():
    p=ri(0,999);mb=(1000+p/10) if p<500 else (900+p/10)
    return NUM('maps',3,'st3',"Decode the 3-digit pressure code in the station model into millibars (to one decimal). Hint: values near 1000 mb.",round(mb,1),["Put a decimal before the last digit.",f"{p:03d} → {p/10:.1f}.","If it starts with 5–9, add 900; if 0–4, add 1000.",f"Result: {mb:.1f} mb."],tol=.06,svg=figs.station(ri(30,90),ri(10,60),f"{p:03d}",None,.5,R.choice(DIR)[1],10),b=1.1)
def bb1():
    d,nm=R.choice([(x[1],x[0]) for x in DIR]);sp=R.choice([5,10,15,20,25,30,35,40,45,55,60,65])
    return NUM('maps',2,'bb1',"Read the wind barb. Speed in knots? (Full barb = 10, half barb = 5, pennant = 50.)",sp,["Count: pennant 50, full barb 10, half barb 5.",f"Total = {sp} knots."],svg=figs.barb_only(d,sp),b=.3)
def bb2():
    nm,d=R.choice(DIR);sp=R.choice([10,15,20,25,30])
    bad=_bad(nm,[x[0] for x in DIR])
    return MC('maps',2,'bb2',"The staff points toward the direction the wind blows FROM. Which wind is shown?",f"From the {nm}",[f"From the {b}" for b in bad],["The staff points to where the wind comes from.",f"It points {nm}, so a {nm} wind."],svg=figs.barb_only(d,sp),b=.4)
def bb3():
    nm,d=R.choice(DIR)
    bad=_bad(nm,[x[0] for x in DIR])
    return MC('maps',1,'bb3',f"A north wind blows from the north. A wind from the {nm} is called a…",f"{nm} wind",[f"{x} wind" for x in bad],["Winds are named for where they come from.",f"{nm} wind."],b=-.5)
# ---- numeric facts
def th1():
    s=ri(2,40);return NUM('light',1,'th1',f"You count {s*5//5*5 if False else s*5} seconds between a flash and its thunder. About how far away is the lightning (miles)? (5 seconds ≈ 1 mile)",s,["5 seconds of delay ≈ 1 mile.",f"{s*5} ÷ 5 = {s}."],b=-.4)
def th2():
    m=ri(1,8);return NUM('light',2,'th2',f"Lightning is about {m} miles away. About how many seconds should pass between flash and thunder?",m*5,["1 mile ≈ 5 seconds.",f"{m} × 5 = {m*5}."],b=0)
def cb1():
    T=ri(50,95);dep=ri(2,25);return NUM('clouds',2,'cb1',f"Surface temperature is {T}°F and dew point is {T-dep}°F. Estimate the cloud base height above ground (ft). (About 400 ft per °F of spread.)",dep*400,["Spread = T − Td.",f"{T} − {T-dep} = {dep} °F.",f"{dep} × 400 = {dep*400} ft."],tol=1,b=.5)
def wc1():
    T=R.choice([20,10,0,-10,5,15]);V=R.choice([10,15,20,25,30]);wc=35.74+0.6215*T-35.75*V**.16+0.4275*T*V**.16
    return NUM('winter',3,'wc1',f"NWS wind chill formula: 35.74 + 0.6215T − 35.75V^0.16 + 0.4275TV^0.16. Find the wind chill (nearest °F) for T = {T}°F and wind V = {V} mph.",round(wc),["Plug into the formula; compute V^0.16 first.",f"V^0.16 = {V**.16:.3f}.",f"Result ≈ {wc:.1f} → {round(wc)}."],tol=1.01,b=1.4)
def ef1():
    ws=R.choice([70,80,90,100,120,130,150,160,175,190,210]);ef=0 if ws<=85 else 1 if ws<=110 else 2 if ws<=135 else 3 if ws<=165 else 4 if ws<=200 else 5
    return MC('torn',2,'ef1',f"A tornado's estimated peak wind is {ws} mph. What is its EF rating? (EF0 65–85, EF1 86–110, EF2 111–135, EF3 136–165, EF4 166–200, EF5 over 200)",f"EF{ef}",[f"EF{k}" for k in range(6) if k!=ef][:3] if ef not in(1,2) else [f"EF{k}" for k in range(6) if k!=ef][1:4],[f"Find {ws} mph in the table.",f"It fits EF{ef}."],b=.2)
def ss1():
    ws=R.choice([80,90,100,105,115,125,135,150,160,170]);c=1 if ws<=95 else 2 if ws<=110 else 3 if ws<=129 else 4 if ws<=156 else 5
    return MC('hurr',2,'ss1',f"A hurricane has sustained winds of {ws} mph. Which Saffir–Simpson category? (1: 74–95, 2: 96–110, 3: 111–129, 4: 130–156, 5: 157+)",f"Category {c}",[f"Category {k}" for k in range(1,6) if k!=c][:3],[f"Match {ws} mph to the range.",f"Category {c}."],b=.1)
def ss2():
    c=ri(1,5);w={1:'74–95',2:'96–110',3:'111–129',4:'130–156',5:'157+'}
    return MC('hurr',1,'ss2',f"Which sustained wind range matches a Category {c} hurricane?",f"{w[c]} mph",[f"{w[k]} mph" for k in w if k!=c][:3],["Saffir–Simpson scale: 1: 74–95, 2: 96–110, 3: 111–129, 4: 130–156, 5: 157+."],b=.3)
def bl1():
    ws=ri(20,50);vis=R.choice([.1,.2,.25,.5,1]);hrs=R.choice([1,2,3,4]);ok=ws>=35 and vis<.25 and hrs>=3
    return MC('winter',3,'bl1',f"Winds {ws} mph, visibility {vis} mile, for {hrs} hours with falling or blowing snow. Is this a blizzard? (Needs wind ≥ 35 mph AND visibility < ¼ mile for ≥ 3 hours.)",'Yes' if ok else 'No',['No' if ok else 'Yes','Only if it is below 0°F','Only if snowfall exceeds 12 inches'],["Check all three rules.",f"Wind {ws}≥35? {ws>=35}. Visibility {vis}<0.25? {vis<.25}. Hours {hrs}≥3? {hrs>=3}.", "Yes" if ok else "At least one test fails, so no."],b=1)
def cp1():
    c=R.choice([300,800,1500,2000,3000,3800,4500]);k='weak' if c<1000 else 'moderate' if c<2500 else 'strong' if c<4000 else 'extreme'
    return MC('upper',2,'cp1',f"CAPE of {c} J/kg is best described as… (weak <1000, moderate 1000–2500, strong 2500–4000, extreme >4000)",k,[x for x in ['weak','moderate','strong','extreme'] if x!=k][:3],["CAPE measures energy available for storm updrafts.",f"{c} falls in the {k} range."],b=.2)
def rp1():
    t=R.choice([2,5,10,25,50,100]);return NUM('precip',2,'rp1',f"A {t}-year flood has what percent chance of happening in any single year?",100/t,["Annual chance = 1 ÷ return period.",f"1 ÷ {t} = {100/t:g}%."],tol=.02,b=.2)
def rp2():
    n=R.choice([10,30,50]);p=round((1-.99**n)*100)
    return NUM('precip',3,'rp2',f"A 100-year flood has a 1% chance each year. What is the chance (nearest %) of at least one in {n} years?",p,["P(none) = 0.99^n.",f"0.99^{n} = {.99**n:.3f}.",f"1 − {.99**n:.3f} = {1-.99**n:.2f} → {p}%."],tol=1.01,b=1.3)
def mo1():
    dist=ri(20,150);sp=R.choice([15,20,25,30,40,50]);t=dist/sp
    return NUM('tstorm',2,'mo1',f"A storm is {dist} miles away and moves toward you at {sp} mph. How long until it arrives (hours, nearest tenth)?",round(t,1),["time = distance ÷ speed.",f"{dist} ÷ {sp} = {t:.2f} h."],tol=.06,b=.3)
def cf1():
    F=R.choice([-10,0,14,32,50,68,86,95,104]);return NUM('dh',1,'cf1',f"Convert {F}°F to °C (nearest degree).",round((F-32)*5/9),["C = (F − 32) × 5/9.",f"({F} − 32) × 5/9 = {(F-32)*5/9:.1f}."],tol=1.01,b=0)
def cf2():
    C=R.choice([-20,-5,0,10,20,25,30,35,40]);return NUM('dh',1,'cf2',f"Convert {C}°C to °F.",C*9/5+32,["F = C × 9/5 + 32.",f"{C} × 9/5 + 32 = {C*9/5+32:g}."],tol=.6,b=0)
def pr1():
    mb=R.choice([960,980,1000,1013,1020,1030]);return NUM('maps',3,'pr1',f"Convert {mb} millibars to inches of mercury (nearest hundredth). (1 inHg = 33.86 mb)",round(mb/33.8639,2),["inHg = mb ÷ 33.86.",f"{mb} ÷ 33.86 = {mb/33.8639:.2f}."],tol=.03,b=1)
def kt1():
    k=R.choice([20,35,50,65,80,100]);return NUM('winds',2,'kt1',f"Convert {k} knots to mph (nearest whole). (1 knot ≈ 1.15 mph)",round(k*1.15),["mph = knots × 1.15.",f"{k} × 1.15 = {k*1.15:.1f}."],tol=1.01,b=.1)
def lr1():
    h=ri(1,9)*1000;return NUM('upper',3,'lr1',f"A rising dry (unsaturated) air parcel cools about 5.5°F per 1000 ft. By how many °F does it cool rising {h} ft?",h/1000*5.5,["Dry adiabatic rate ≈ 5.5°F per 1000 ft.",f"{h//1000} × 5.5 = {h/1000*5.5:g}."],tol=.06,b=.6)
def sw1():
    t=R.choice([('Watch','Conditions are favorable; be ready'),('Warning','Severe weather is happening or imminent; take shelter now')])
    return MC('safety',1,'sw1',f"What does a tornado {t[0].lower()} mean?",t[1],[x for x in ['Conditions are favorable; be ready','Severe weather is happening or imminent; take shelter now','The storm has ended','Only rain is expected'] if x!=t[1]][:3] if t[0]=='Watch' else ['Conditions are favorable; be ready','The storm has ended','Only rain is expected'],["Watch = could happen.","Warning = happening now or about to."],b=-.6)
def hl1():
    d=ri(1,9);return NUM('hurr',2,'hl1',f"A hurricane eye moves toward the coast at {R.choice([10,12,15])} mph... how many hours until landfall if it is {d*60} miles away at 12 mph?",d*60/12,["time = distance ÷ speed.",f"{d*60} ÷ 12 = {d*5}."],tol=.06,b=.3) if False else None
def hd1():
    sp=R.choice([10,15,20,25,30,40]);return MC('torn',3,'hd1',"A velocity image shows strong outbound winds right next to strong inbound winds. What may this signal?","Rotation (a mesocyclone or tornado)",["A cold front passing","Only heavy rain","Clear air"],["Adjacent inbound/outbound velocities mean the air is spinning.","That is a velocity couplet."],svg=figs.radar('couplet'),b=1)
def rd1():
    k=R.choice([('hook','A hook echo'),('bow','A bow echo'),('line','A squall line'),('ball','A debris ball')]);pool=['A hook echo','A bow echo','A squall line','A debris ball']
    return MC('torn',2,'rd1',"Which radar feature is shown?",k[1],_bad(k[1],pool),["Match the shape."],svg=figs.radar(k[0]),b=.5)
def fr1():
    k=R.choice([('cold','Cold front'),('warm','Warm front'),('stat','Stationary front'),('occ','Occluded front')]);pool=['Cold front','Warm front','Stationary front','Occluded front']
    return MC('maps',2,'fr1',"Which front does this symbol show?",k[1],_bad(k[1],pool),["Triangles = cold. Half-circles = warm. Both on opposite sides = stationary. Both on the same side = occluded."],svg=figs.fmap(k[0],1,70),b=.2)
def sk1():
    f=R.choice([(0,'Clear'),(.25,'Scattered'),(.5,'Broken-ish (half covered)'),(1,'Overcast')])
    return MC('maps',1,'sk1',"The sky circle in this station model shows…",f[1],_bad(f[1],['Clear','Scattered','Broken-ish (half covered)','Overcast']),["A filled circle means more cloud cover."],svg=figs.station(60,50,"132",None,f[0],200,10),b=-.2)
def run(n=8):
    for f in (st1,st2,st3,bb1,bb2,bb3,th1,th2,cb1,wc1,ef1,ss1,ss2,bl1,cp1,rp1,rp2,mo1,cf1,cf2,pr1,kt1,lr1,sw1,hd1,rd1,fr1,sk1):rep(f,n)
