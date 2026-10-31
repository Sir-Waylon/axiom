#!/bin/sh
# full pipeline: packs -> sites -> zips
cd "$(dirname "$0")"
python3 src/shortify.py events/circuit-lab-b/pack.json; python3 src/mkunits.py events/circuit-lab-b/pack.json >/dev/null; python3 src/applyfix.py events/circuit-lab-b/pack.json src/fixes_circ.json; python3 src/taglabs.py events/circuit-lab-b/pack.json circuit
python3 src_geo/mkgeo.py events/geometry-readiness/pack.json >/dev/null; python3 src/shortify.py events/geometry-readiness/pack.json; python3 src/mkunits.py events/geometry-readiness/pack.json >/dev/null; python3 src/applyfix.py events/geometry-readiness/pack.json src/fixes_geo.json; python3 src/taglabs.py events/geometry-readiness/pack.json geo
python3 - <<'P'
import json
N={'circuit-lab-b':['Wattson','Ohmega','Ohwl','Faradox','Capacitat','Dinode','Arc Rider','Faraday','Thundra','Tesla Guard','Quasar'],'geometry-readiness':['Theo Rem','Piper','Euclid','Vertex','Tangent','Pythagorex','Vertex Shade','Conjecture','Pythagodrake','Axiom Prime','QED'],'meteorology-b':['Cumulo','Nimbus','Isobar','Gale','Cirrus','Twister','Cirrus Ghost','Stormcaller','Supercell','Stormwarden','Aurora']}
for f,b,t,a in [('circuit-lab-b','Voltaic','Circuit Lab B · Science Olympiad',['#0b7a45','#dff6e9']),('geometry-readiness','Axiom','Algebra 1 → Geometry Honors',['#5b4bff','#eceaff'])]:
    p=json.load(open('events/'+f+'/pack.json'));p['meta'].update(brand=b,tagline=t,accent=a,names=N[f])
    if f=='circuit-lab-b':p['meta']['stations']='circ'
    if f=='geometry-readiness':p['meta'].update(refresh={'eq':['bas','par'],'lin':['crd'],'sys':['crd'],'exp':['area','sol'],'fac':['sim','rt'],'rad':['rt'],'qdr':['rt','area']},target='2027-03-31')
    json.dump(p,open('events/'+f+'/pack.json','w'),ensure_ascii=False,separators=(',',':'))
P
python3 src_met/mkmet.py events/meteorology-b/pack.json >/dev/null;python3 src/applyfix.py events/meteorology-b/pack.json src/fixes_met.json;python3 -c "import json;f='events/meteorology-b/pack.json';p=json.load(open(f));p['meta']['stations']='met';p['meta']['names']=['Cumulo','Nimbus','Isobar','Gale','Cirrus','Twister','Cirrus Ghost','Stormcaller','Supercell','Stormwarden','Aurora'];json.dump(p,open(f,'w'),ensure_ascii=False,separators=(',',':'))"; python3 src/shortify.py events/meteorology-b/pack.json; python3 src/mkunits.py events/meteorology-b/pack.json >/dev/null
for t in apex:apex-math quanta:quanta-physics; do k=${t%%:*}; d=${t##*:}; python3 src_adv/mkadv.py $k events/$d/pack.json >/dev/null; python3 src/shortify.py events/$d/pack.json; python3 src/mkunits.py events/$d/pack.json >/dev/null; done
python3 - <<'P'
import json
for f,b,t,a in [('apex-math','Apex','Algebra 2 → Calculus',['#b4410a','#ffe9dc']),('quanta-physics','Quanta','Electrical engineering and physics',['#0a6e8a','#dff4fa'])]:
    p=json.load(open('events/'+f+'/pack.json'));p['meta'].update(brand=b,tagline=t,accent=a,names=[])
    json.dump(p,open('events/'+f+'/pack.json','w'),ensure_ascii=False,separators=(',',':'))
P
python3 src/addref.py events/circuit-lab-b/pack.json events/meteorology-b/pack.json
HUBNAME=Skyvolt APPNAME=Skyvolt python3 build_open.py out/_app_skyvolt circuit=events/circuit-lab-b/pack.json meteorology=events/meteorology-b/pack.json
HUBNAME=Axiom APPNAME=Axiom python3 build_open.py out/_app_axiom geometry=events/geometry-readiness/pack.json apex=events/apex-math/pack.json quanta=events/quanta-physics/pack.json
python3 mksite.py skyvolt out/_app_skyvolt out/skyvolt && python3 mksite.py axiom out/_app_axiom out/axiom
