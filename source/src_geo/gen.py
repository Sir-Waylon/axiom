# -*- coding: utf-8 -*-
import random,math
from fractions import Fraction as Fr
R=random.Random(7)
OUT=[];_seen=set()
def fm(x):
    if isinstance(x,Fr):
        return str(x.numerator) if x.denominator==1 else f"{x.numerator}/{x.denominator}"
    if isinstance(x,float):
        s=f"{x:.2f}".rstrip('0').rstrip('.');return s
    return str(x)
def sg(n):return f"+ {n}" if n>=0 else f"− {abs(n)}"
def put(q):
    key=q['q']+str(q.get('tpl',''))
    if key in _seen:return False
    _seen.add(key);OUT.append(q);return True
def NUM(t,l,fp,stem,v,sol,tol=0.005,free=True,pi=False,show=None,b=None,svg=None,w=None):
    n={'v':float(v),'tol':tol,'free':True}
    if pi:n['pi']=True
    n['show']=show or fm(v if not isinstance(v,float) else round(v,2))
    q=dict(t=t,l=l,type='short',q=stem,num=n,sol=sol,w=w or sol[-1],fp=fp)
    if b is not None:q['b']=b
    if svg:q['svg']=svg
    return put(q)
def MC(t,l,fp,stem,good,bad,sol,b=None,svg=None,w=None):
    bad=[x for i,x in enumerate(bad) if x!=good and x not in bad[:i]][:3]
    if len(bad)<3:return False
    q=dict(t=t,l=l,type='mcq',q=stem,o=[good]+bad,sol=sol,w=w or sol[-1],fp=fp)
    if b is not None:q['b']=b
    if svg:q['svg']=svg
    return put(q)
def TX(t,l,fp,stem,ans,sol,svg=None):
    q=dict(t=t,l=l,type='short',q=stem,text=ans,sol=sol,w=sol[-1],fp=fp)
    if svg:q['svg']=svg
    return put(q)
def rep(f,n):
    c=0;tries=0
    while c<n and tries<n*12:
        tries+=1
        if f():c+=1
# ---------- svg helpers ----------
def S(w,h,body):return f'<svg viewBox="0 0 {w} {h}" width="{w}" role="img" font-family="Arial,sans-serif" font-size="13" fill="none" stroke="#111" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">{body}</svg>'
def TXT(x,y,s,a='middle',sz=13,b=False):return f'<text x="{x:.0f}" y="{y:.0f}" text-anchor="{a}" font-size="{sz}" font-weight="{700 if b else 400}" fill="#111" stroke="#fff" stroke-width="3" paint-order="stroke">{s}</text>'
def tri_svg(A=(20,150),B=(220,150),C=(90,30),labels=('A','B','C'),sides=None,angles=None,right=None):
    s=f'<polygon points="{A[0]},{A[1]} {B[0]},{B[1]} {C[0]},{C[1]}"/>'
    for P,(dx,dy),l in zip((A,B,C),((-12,14),(12,14),(0,-8)),labels):s+=TXT(P[0]+dx,P[1]+dy,l,b=True)
    mid=lambda P,Q:((P[0]+Q[0])/2,(P[1]+Q[1])/2)
    if sides:
        for (P,Q),v,off in zip(((A,B),(B,C),(C,A)),sides,((0,18),(18,0),(-18,0))):
            if v is not None:m=mid(P,Q);s+=TXT(m[0]+off[0],m[1]+off[1],v)
    if angles:
        for P,v,(dx,dy) in zip((A,B,C),angles,((28,-6),(-28,-6),(0,28))):
            if v is not None:s+=TXT(P[0]+dx,P[1]+dy,v,sz=12)
    if right:
        P=right;s+=f'<path d="M{P[0]+(14 if P[0]<100 else -14)},{P[1]} v-14 h{(-14 if P[0]<100 else 14)}" stroke-width="1.2"/>'
    return S(250,185,s)
def rt_svg(a,b,c,la='a',lb='b',lc='c'):
    s='<polygon points="30,150 220,150 30,30"/><path d="M30,136 h14 v14" stroke-width="1.2"/>'
    s+=TXT(125,170,lb)+TXT(14,95,la,'end')+TXT(135,80,lc)
    return S(250,185,s)
def lines_svg(labels):
    s='<line x1="20" y1="60" x2="230" y2="60"/><line x1="20" y1="130" x2="230" y2="130"/><line x1="90" y1="20" x2="160" y2="170"/>'
    pos={'1':(100,52),'2':(150,52),'3':(100,76),'4':(148,76),'5':(115,122),'6':(165,122),'7':(112,148),'8':(160,148)}
    for k,v in pos.items():
        if k in labels:s+=TXT(v[0],v[1],labels[k],b=True)
    return S(250,185,s)
def circ_svg(kind,a=None,b=None):
    s='<circle cx="125" cy="95" r="70"/><circle cx="125" cy="95" r="2.5" fill="#111"/>'
    if kind=='central':
        s+='<line x1="125" y1="95" x2="195" y2="95"/><line x1="125" y1="95" x2="160" y2="34"/>'+TXT(158,86,a,sz=12)+TXT(205,99,'B','start',b=True)+TXT(160,26,'A','start',b=True)+TXT(125,112,'O',b=True)
    elif kind=='inscribed':
        s+='<polyline points="195,95 125,165 160,34"/><polyline points="195,95 55,95" stroke-width="0"/><polyline points="125,165 195,95" stroke-width="0"/>'
        s+=TXT(207,99,'B','start',b=True)+TXT(125,182,'C',b=True)+TXT(160,24,'A','start',b=True)+TXT(125,150,a,sz=12)
    elif kind=='tangent':
        s+='<line x1="125" y1="95" x2="195" y2="95"/><line x1="195" y1="20" x2="195" y2="200"/><line x1="125" y1="95" x2="195" y2="20" stroke-dasharray="4 3"/><path d="M185,95 v-10 h10" stroke-width="1.2"/>'
        s+=TXT(160,112,a)+TXT(207,60,b,'start')+TXT(207,99,'T','start',b=True)+TXT(125,112,'O',b=True)+TXT(207,22,'P','start',b=True)
    return S(250,200,s)
def grid_svg(pts,lines=(),rng=6,sz=240):
    c=sz/2;k=(sz-30)/(2*rng);X=lambda x:c+x*k;Y=lambda y:c-y*k
    s=''.join(f'<line x1="{X(i):.0f}" y1="10" x2="{X(i):.0f}" y2="{sz-10}" stroke="#ddd" stroke-width="1"/><line x1="10" y1="{Y(i):.0f}" x2="{sz-10}" y2="{Y(i):.0f}" stroke="#ddd" stroke-width="1"/>' for i in range(-rng,rng+1))
    s+=f'<line x1="10" y1="{c}" x2="{sz-10}" y2="{c}" stroke-width="2"/><line x1="{c}" y1="10" x2="{c}" y2="{sz-10}" stroke-width="2"/>'
    for i in range(-rng+1,rng):
        if i and i%2==0:s+=TXT(X(i),c+14,i,sz=10)+TXT(c-12,Y(i)+4,i,sz=10)
    if len(pts)>2:s+='<polygon points="'+' '.join(f'{X(x):.0f},{Y(y):.0f}' for _,x,y in pts)+'" fill="rgba(80,70,255,.12)"/>'
    for n,x,y in pts:s+=f'<circle cx="{X(x):.0f}" cy="{Y(y):.0f}" r="3.5" fill="#111"/>'+TXT(X(x)+8,Y(y)-6,n,'start',b=True)
    return S(sz,sz,s)
