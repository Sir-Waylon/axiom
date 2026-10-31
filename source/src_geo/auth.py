# -*- coding: utf-8 -*-
"""Compact authoring helpers shared by all three packs.
Tiers: F=Foundation (grade 5-6 ideas, everyday words), B=Bridge (grades 7-8), C=Core (high-school), M=Mastery (hardest high-school exam items).
Every helper takes sol = list of worked steps (last one is the take-away) and registers through gen.put (de-duplicated by stem)."""
import hashlib
from gen import *
TB={'F':(1,-1.2),'B':(2,-0.45),'C':(2,0.3),'M':(3,1.2)}
def _fp(s):return 'h'+hashlib.md5(s.encode('utf8')).hexdigest()[:7]
def _b(tier,adj):return TB[tier][1]+adj
def _sol(sol):return sol if isinstance(sol,list) else [sol]
def SA(t,tier,q,ans,sol,adj=0,svg=None,o=None):
    """typed short answer; ans = accepted strings (first is shown). o = optional choices shown only as a hint"""
    ans=[ans] if isinstance(ans,str) else list(ans)
    d=dict(t=t,l=TB[tier][0],b=_b(tier,adj),type='short',q=q,text=ans,sol=_sol(sol),w=_sol(sol)[-1],fp=_fp(q))
    if svg:d['svg']=svg
    if o:d['o']=[ans[0]]+list(o)
    return put(d)
def NM(t,tier,q,v,sol,u=None,tol=0.02,show=None,adj=0,svg=None,free=False):
    import re
    known=bool(u) and (re.match(r'^([nuµμmkKM]?)(Hz|V|A|Ω|W|J|C|N|F|T|s|Wh)$',u) or u in ('h','min','N/C','V/m'))
    if u and not known:free=True
    n=dict(v=float(v),tol=tol)
    if u and not free:n['u']=u
    if free or not u:n['free']=True
    if show:n['show']=show
    elif u:n['show']=fm(v)+' '+u
    d=dict(t=t,l=TB[tier][0],b=_b(tier,adj),type='short',q=q,num=n,sol=_sol(sol),w=_sol(sol)[-1],fp=_fp(q))
    if svg:d['svg']=svg
    return put(d)
def MQ(t,tier,q,good,bad,sol,adj=0,svg=None):
    d=dict(t=t,l=TB[tier][0],b=_b(tier,adj),type='mcq',q=q,o=[good]+list(bad)[:3],sol=_sol(sol),w=_sol(sol)[-1],fp=_fp(q))
    if svg:d['svg']=svg
    return put(d)
def MS(t,tier,q,good,bad,sol,adj=0):
    """select all that apply: good are correct, bad are wrong"""
    o=list(good)+list(bad);idx=list(range(len(o)));R.shuffle(idx)
    return put(dict(t=t,l=TB[tier][0],b=_b(tier,adj),type='multi',q=q,o=[o[i] for i in idx],a=[k for k,i in enumerate(idx) if i<len(good)],sol=_sol(sol),w=_sol(sol)[-1],fp=_fp(q)))
def OR(t,tier,q,items,sol,adj=0):
    return put(dict(t=t,l=TB[tier][0],b=_b(tier,adj),type='order',q=q,items=list(items),sol=_sol(sol),w=_sol(sol)[-1],fp=_fp(q)))
def MT(t,tier,q,pairs,sol,adj=0):
    return put(dict(t=t,l=TB[tier][0],b=_b(tier,adj),type='match',q=q,pairs=[list(p) for p in pairs],sol=_sol(sol),w=_sol(sol)[-1],fp=_fp(q)))
def CL(t,tier,tpl,ans,dist,sol,adj=0):
    """sentence with {0},{1}.. blanks filled from a word bank"""
    bank=list(ans)+list(dist);R.shuffle(bank);used=[];idx=[]
    for a in ans:
        for i,x in enumerate(bank):
            if x==a and i not in used:used.append(i);idx.append(i);break
    return put(dict(t=t,l=TB[tier][0],b=_b(tier,adj),type='chips',q='Complete the sentence.',tpl=tpl,bank=bank,ans=idx,sol=_sol(sol),w=_sol(sol)[-1],fp=_fp(tpl)))
def SLD(t,tier,q,mn,mx,st,target,sol,label,unit='',live=None,tol=0,start=None,adj=0):
    d=dict(t=t,l=TB[tier][0],b=_b(tier,adj),type='slider',q=q,sl=dict(min=mn,max=mx,step=st,target=target,tol=tol,label=label,unit=unit,start=mn if start is None else start),sol=_sol(sol),w=_sol(sol)[-1],fp=_fp(q))
    if live:d['live']=live
    return put(d)
def CP(t,tier,q,target,sol,tol=10,ref=None,rlab=None,adj=0):
    """compass: drag a pointer to a bearing (0 = north, clockwise)"""
    c=dict(target=target,tol=tol)
    if ref is not None:c['ref']=ref;c['rlab']=rlab or 'given'
    return put(dict(t=t,l=TB[tier][0],b=_b(tier,adj),type='compass',q=q,cmp=c,sol=_sol(sol),w=_sol(sol)[-1],fp=_fp(q)))
def GR(t,tier,q,xl,yl,x,y,lines,target,sol,desc,tx=None,ty=None,hl=None,adj=0):
    """graph: tap a point. lines = [(label,[(x,y),...])]"""
    g=dict(xl=xl,yl=yl,x=list(x),y=list(y),lines=[dict(l=l,pts=[list(p) for p in pts]) for l,pts in lines],t=list(target),desc=desc)
    if tx is not None:g['tx']=tx
    if ty is not None:g['ty']=ty
    if hl:g['hl']=hl
    return put(dict(t=t,l=TB[tier][0],b=_b(tier,adj),type='graph',q=q,gr=g,sol=_sol(sol),w=_sol(sol)[-1],fp=_fp(q)))
