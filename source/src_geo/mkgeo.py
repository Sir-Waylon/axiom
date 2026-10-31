# -*- coding: utf-8 -*-
import sys,os,json,re,random
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
import gen,fam_alg,fam_g1,fam_g2,fam_g3,fam_g4,fam_g5,proofs,cards_geo,fam_int
R=random.Random(3)
for fs in fam_alg.FAM.values():
    for f in fs:gen.rep(f,8)
for m in (fam_g1,fam_g2,fam_g3,fam_g4,fam_g5):m.run(10)
fam_int.run(10)
Q=gen.OUT[:]
# proof-derived questions
for p in proofs.PR:
    st=p['steps'];t=p['t']
    items=[f"{s} — {r}" for s,r in st]
    gen.put(dict(t=t,l=3,type='order',q=f"Put the steps of this proof in order: {p['title']}.",items=items,sol=['Start from the givens.','Each step must follow from the ones before it.','Finish with what you were asked to prove.'],w=p['idea'],fp='po-'+p['id']))
    pairs=R.sample(st,min(5,len(st)))
    gen.put(dict(t=t,l=2,type='match',q=f"Match each step to its reason ({p['title']}).",pairs=[[s,r] for s,r in pairs],sol=['Think: definition, postulate or theorem?'],w=p['idea'],fp='pm-'+p['id']))
    for i,(s,r) in enumerate(st):
        others=[x[1] for x in st if x[1]!=r]+[x[1] for q in proofs.PR for x in q['steps'] if x[1]!=r]
        others=sorted(set(others),key=lambda o:(abs(len(o)-len(r))+R.random()*6));bad=[]
        for o in others:
            if o not in bad and len(bad)<3:bad.append(o)
        gen.put(dict(t=t,l=3 if len(r)>40 else 2,type='mcq',q=f"Proof: {p['title']}. What is the reason for “{s}”?",o=[r]+bad,sol=[p['idea']],w=f"Reason: {r}.",fp=f"pr-{p['id']}-{i}"))

# two-column proof builders (blank reasons / statements) from every proof
allr=sorted({x[1] for q in proofs.PR for x in q['steps']})
for p in proofs.PR:
    st=p['steps'];n=len(st);rows=[[a,b] for a,b in st]
    for v,(nm,cols) in enumerate((('reasons',[1]),('statements',[0]),('reasons',[1]))):
        if v==2 and n<5:continue
        idx=list(range(1,n)) ;R.shuffle(idx);k=min(3,max(2,n//3));pick=sorted(idx[:k])
        hide=[[c for c in cols] if i in pick else [] for i in range(n)]
        blanks=[rows[i][cols[0]] for i in pick]
        pool=[x for x in (allr if cols[0]==1 else [y[0] for q in proofs.PR for y in q['steps']]) if x not in blanks and abs(len(x)-len(blanks[0]))<40]
        R.shuffle(pool);ex=pool[:3]
        if v==2:pick2=sorted(idx[k:k+k]);hide=[[1] if i in pick2 else [] for i in range(n)];blanks=[rows[i][1] for i in pick2]
        if not any(hide):continue
        gen.put(dict(t=p['t'],l=3,type='proof',q=f"Complete the proof: {p['title']}. Given: {p['given']}. Prove: {p['prove']}. Fill each blank {'reason' if cols==[1] else 'statement'}{' (set '+str(v+1)+')' if v==2 else ''}.",rows=rows,hide=hide,extra=ex if v!=2 else [x for x in pool[:3]],sol=[p['idea'],'Each statement needs a reason: a definition, postulate, theorem or given.'],w=p['idea'],fp=f"pb-{p['id']}-{v}"))
Q=gen.OUT
import figs_geo;print('figs',figs_geo.attach(Q))
neg=re.compile(r'(?<![\w.)])-(?=\d)')
def fx(s):return neg.sub('−',s) if isinstance(s,str) else s
cnt={}
for q in Q:
    for k in ('q','w'):q[k]=fx(q.get(k,''))
    if 'o' in q:q['o']=[fx(x) for x in q['o']]
    if 'sol' in q:q['sol']=[fx(x) for x in q['sol']]
    if 'pairs' in q:q['pairs']=[[fx(a),fx(b)] for a,b in q['pairs']]
    cnt[q['t']]=cnt.get(q['t'],0)+1;q['id']=f"{q['t']}-{cnt[q['t']]:03d}"
TOP=[('eq','Equations & inequalities','Algebra 1'),('lin','Linear functions','Algebra 1'),('sys','Systems','Algebra 1'),('exp','Exponents','Algebra 1'),('fac','Factoring','Algebra 1'),('rad','Radicals','Algebra 1'),('qdr','Quadratics & functions','Bridge'),
('bas','Points, lines, angles','Geometry'),('log','Logic & proof','Geometry'),('par','Parallel lines & polygons','Geometry'),('tri','Congruent triangles','Geometry'),('quad','Quadrilaterals','Geometry'),('sim','Similarity','Geometry'),('rt','Right triangles & trig','Geometry'),('cir','Circles','Geometry'),('con','Constructions & loci','Geometry'),('area','Area','Geometry'),('sol','Solids','Geometry'),('crd','Coordinate geometry','Geometry'),('trn','Transformations','Geometry')]
topics=[dict(id=i,name=n,area=a,note='n1',tier='core') for i,n,a in TOP]
study={'cards':{t:[[h,tx]+([f] if f else []) for h,tx,f in v] for t,v in cards_geo.CARDS.items()},'glossary':[list(g) for g in cards_geo.GLOSS],'stuck':["Write what you KNOW and what you must FIND.","Draw and label a picture. Mark equal parts.","Pick a theorem or formula that links them. Then check if the answer is sensible."]}
meta=dict(id='geometry-readiness-2027',title='Geometry Readiness',division='8',year=2027,org='PAUSD',tag='Algebra 1 → Geometry Honors',
 facts=[['Algebra 1','Review'],['Geometry','Jurgensen units'],['Honors','Challenge Qs'],['Proofs','Step by step']],
 intro='Master Algebra 1, then Geometry. Short lessons, a practice question after each idea, unit tests, and proofs explained step by step.',
 levels=['Rookie','Point','Segment','Angle','Triangle','Polygon','Circle','Solid','Prover','Honors Ace'],stationsLabel='Mini-labs',
 scope=dict(core=[],adjacent=[],skip=[],stations=[],sources=[]))
notes=[dict(id='n1',title='Key facts by topic',html=''.join(f'<h4>{n}</h4><ul>'+''.join(f'<li>{(c[2] or c[0]+": "+c[1]) if False else c[0]+" — "+c[1]}</li>' for c in cards_geo.CARDS[i][:3])+'</ul>' for i,n,a in TOP if i in cards_geo.CARDS))]
written=[["Explain why the angles of a triangle add to 180°.","Draw a line through one vertex parallel to the opposite side. Alternate interior angles are equal, so the three angles sit along a straight line (180°)."],
["Why is AAA not enough to prove triangles congruent?","Three equal angles make the same SHAPE but can be any SIZE, so the triangles are only similar."],["What does an indirect proof assume first?","The opposite of the statement you want to prove. Then you show it leads to a contradiction."],["How do you decide between SAS and ASA?","Look at what is between: SAS has an angle between two sides; ASA has a side between two angles."],["Explain the 30-60-90 ratios.","Cut an equilateral triangle in half. The short leg is half the side, the hypotenuse is the full side, and the long leg is short leg × √3."]]
bench=[["Shadow height","Measure your height and your shadow, then a tree's shadow at the same time. Use similar triangles to find the tree's height."],["Angle sum by tearing","Draw a triangle, tear off the three corners and place them together. They make a straight line."],["Pi hunt","Measure the circumference and diameter of three round objects. Divide. Each answer should be near 3.14."]]
plan=[dict(t=f"Week {i+1}",focus=f,drill=dict(topics=ts,n=15),tasks=[['learn',f"Do the lessons for: {f}."],['wrap','Take the unit test; redo the questions you missed.']]) for i,(f,ts) in enumerate([('Equations, lines, systems',['eq','lin','sys']),('Exponents, factoring, radicals',['exp','fac','rad']),('Quadratics and functions',['qdr']),('Angles, logic, parallel lines',['bas','log','par']),('Triangles and quadrilaterals',['tri','quad']),('Similarity and right triangles',['sim','rt']),('Circles, constructions, area',['cir','con','area']),('Solids, coordinates, transformations',['sol','crd','trn'])])]
pack=dict(schema='scioly-pack/1',meta=meta,topics=topics,notes=notes,plan=plan,cards=[[g[0],g[1]] for g in cards_geo.GLOSS],written=written,bench=bench,safety=[],checklist=['Bring pencils and a calculator if allowed.','Read every question twice.','Show your work on free-response items.','Check answers by plugging back in.'],questions=Q,study=study,proofs=[{k:v for k,v in p.items()} for p in proofs.PR],_v=1)
json.dump(pack,open(sys.argv[1],'w',encoding='utf8'),ensure_ascii=False,separators=(',',':'))
print(len(Q),{k:cnt[k] for k in cnt})
