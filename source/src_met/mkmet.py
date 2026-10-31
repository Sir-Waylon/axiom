# -*- coding: utf-8 -*-
import sys,os,json,re
H=os.path.dirname(os.path.abspath(__file__));sys.path[:0]=[H,H+'/../src_geo']
import gen,content1 as c,q_hand,q_gen,q_more,q_n1,q_n2
q_gen.run(30);q_more.run();q_n1.run();q_n2.run()
Q=[dict(x,fp=x.get('fp','h_'+x['t']+str(i)),sol=[x['w']]) for i,x in enumerate(q_hand.H)]+gen.OUT
neg=re.compile(r'(?<![\w.)])-(?=\d)')
fx=lambda s:neg.sub('−',s) if isinstance(s,str) else s
cnt={}
for q in Q:
    q['q']=fx(q['q']);q['w']=fx(q.get('w',''))
    if 'o' in q:q['o']=[fx(x) for x in q['o']]
    q['sol']=[fx(s) for s in q.get('sol',[q['w']])]
    cnt[q['t']]=cnt.get(q['t'],0)+1;q['id']=f"{q['t']}-{cnt[q['t']]:03d}"
topics=[dict(id=t[0],name=t[1],area=t[2],note='n-'+t[0],tier=t[3]) for t in c.TOPICS]
notes=[dict(id='n-'+n[0],title=n[1],html=n[2]) for n in c.NOTES]
plan=[dict(t=p[0],focus=p[1],drill=dict(topics=p[2].split(),n=15),tasks=[['learn','Do the lessons for: '+p[0]+'.'],['wrap','Take the unit tests; redo misses.']]) for p in c.PLAN]
meta=dict(id='meteorology-b-2027',title='Meteorology',division='B',year=2027,org='Science Olympiad',brand='Stratus',tagline='Meteorology B · Science Olympiad',accent=['#1a62c8','#e3eeff'],
 facts=[['Severe weather','2027 topic'],['Data first','50%+ interpretation'],['Binder','Allowed'],['Team','of 2']],intro='Read the data, name the hazard, pick the safe action.',levels=['Calm','Breeze','Gust','Squall','Front','Supercell','Eyewall','Storm Chaser'],scope=dict(core=[],adjacent=[],skip=[],stations=[],sources=[]))
pack=dict(schema='scioly-pack/1',meta=meta,topics=topics,notes=notes,plan=plan,cards=c.CARDS,written=c.WRITTEN,bench=c.BENCH,safety=c.SAFETY,checklist=c.CHECK,questions=Q,study=dict(cards=c.C,glossary=c.GL,stuck=c.STUCK),_v=1)
json.dump(pack,open(sys.argv[1],'w',encoding='utf8'),ensure_ascii=False,separators=(',',':'))
print(len(Q),cnt)
