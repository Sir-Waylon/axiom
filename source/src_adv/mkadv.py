# -*- coding: utf-8 -*-
"""mkadv.py <apex|quanta> <out pack.json> : build a scioly-pack/1 pack from the track modules."""
import sys,os,json,re
D=os.path.dirname(os.path.abspath(__file__))
sys.path[:0]=[D,os.path.join(D,'..','src_geo')]
import gen,adv_h
track,out=sys.argv[1],sys.argv[2]
mod=__import__('t_'+track)
mod.run()
Q=gen.OUT
neg=re.compile(r'(?<![\w.)])-(?=\d)')
def fx(s):return neg.sub('−',s) if isinstance(s,str) else s
cnt={}
for q in Q:
    for k in ('q','w'):q[k]=fx(q.get(k,''))
    if 'o' in q:q['o']=[fx(x) for x in q['o']]
    if 'sol' in q:q['sol']=[fx(x) for x in q['sol']]
    if 'pairs' in q:q['pairs']=[[fx(a),fx(b)] for a,b in q['pairs']]
    cnt[q['t']]=cnt.get(q['t'],0)+1;q['id']=f"{q['t']}-{cnt[q['t']]:03d}"
TOP=mod.TOP
topics=[dict(id=i,name=n,area=a,note='n1',tier='core') for i,n,a in TOP]
study={'cards':{t:[[h,tx]+([f] if f else []) for h,tx,f in v] for t,v in mod.CARDS.items()},'glossary':[list(g) for g in mod.GLOSS],'stuck':mod.STUCK}
notes=[dict(id='n1',title='Key facts by topic',html=''.join(f'<h4>{n}</h4><ul>'+''.join(f'<li>{c[0]} — {c[1]}</li>' for c in mod.CARDS[i][:3])+'</ul>' for i,n,a in TOP if i in mod.CARDS))]
plan=[dict(t=f"Week {i+1}",focus=f,drill=dict(topics=ts,n=15),tasks=[['learn',f"Do the lessons for: {f}."],['wrap','Take the unit test; redo the questions you missed.']]) for i,(f,ts) in enumerate(mod.WEEKS)]
pack=dict(schema='scioly-pack/1',meta=mod.META,topics=topics,notes=notes,plan=plan,cards=[[g[0],g[1]] for g in mod.GLOSS],written=mod.WRITTEN,bench=mod.BENCH,safety=getattr(mod,'SAFETY',[]),checklist=mod.CHECK,questions=Q,study=study,proofs=[])
json.dump(pack,open(out,'w',encoding='utf8'),ensure_ascii=False,separators=(',',':'))
print(len(Q),{k:cnt[k] for k in cnt})
