# -*- coding: utf-8 -*-
import re
from gen import S,TXT,tri_svg,rt_svg,lines_svg,circ_svg,grid_svg
N=lambda s:[float(x) if '.' in x else int(x) for x in re.findall(r'-?\d+(?:\.\d+)?',s.replace('−','-'))]
def rect(l,w,lab=True):
    return S(250,150,f'<rect x="40" y="30" width="170" height="90" fill="rgba(80,70,255,.10)"/>'+TXT(125,138,l)+TXT(228,80,w,'start'))
def para(b,h):
    return S(250,150,'<polygon points="60,120 200,120 240,40 100,40" fill="rgba(80,70,255,.10)"/><line x1="100" y1="40" x2="100" y2="120" stroke-dasharray="4 3"/>'+TXT(130,138,b)+TXT(92,84,h,'end'))
def triangle(b,h):
    return S(250,150,'<polygon points="30,120 220,120 120,25" fill="rgba(80,70,255,.10)"/><line x1="120" y1="25" x2="120" y2="120" stroke-dasharray="4 3"/>'+TXT(125,138,b)+TXT(128,78,h,'start'))
def trap(b1,b2,h):
    return S(250,150,'<polygon points="30,120 220,120 180,35 70,35" fill="rgba(80,70,255,.10)"/><line x1="70" y1="35" x2="70" y2="120" stroke-dasharray="4 3"/>'+TXT(125,138,b2)+TXT(125,28,b1)+TXT(62,80,h,'end'))
def circle_r(r):
    return S(250,200,'<circle cx="125" cy="100" r="70" fill="rgba(80,70,255,.10)"/><line x1="125" y1="100" x2="195" y2="100"/><circle cx="125" cy="100" r="2.5" fill="#111"/>'+TXT(160,92,r))
LP={'corresponding':('1','5'),'alternate interior':('3','6'),'same-side interior':('3','5'),'alternate exterior':('1','8')}
def fig(q):
    f=q['fp'];t=q['q'];n=N(t)
    try:
        if f in('r1',):return rt_svg(n[0],n[1],'?',str(n[0]),str(n[1]),'?')
        if f=='r2':return rt_svg(0,0,0,'?' if False else str(n[1]) if False else '?',str(n[1]),str(n[0]))
        if f=='r3':return rt_svg(0,0,0,str(n[0]),str(n[0]),'?')
        if f in('par1',):
            a=n[1] if False else [x for x in n if x>=1][0];k=[k for k in LP if k in t][0];x,y=LP[k]
            return lines_svg({x:f'{a}°',y:'?'})
        if f in('tri3','tri4'):
            a=n[0];lab=('?',f'{a}°',f'{a}°') if f=='tri4' else (f'{a}°','?','?')
            return tri_svg(A=(20,150),B=(220,150),C=(120,30),angles=(f'{a}°' if f=='tri4' else '?',f'{a}°' if f=='tri4' else '?','?' if f=='tri3' else f'?') ) if False else tri_svg(A=(20,150),B=(220,150),C=(120,30),angles=(('?',)+(f'{a}°',)*0+('',))*0 or ((f'{a}°',f'{a}°','?') if f=='tri4' else ('?','?',f'{n[0]}°')))
        if f=='par4':return tri_svg(angles=(f'{n[0]}°',f'{n[1]}°','?'))
        if f=='tri9':return None
        if f=='a1':return rect(n[0],n[1])
        if f=='a2':return triangle(n[0],n[1])
        if f=='a3':return para(n[0],n[1])
        if f=='a4':return trap(n[0],n[1],n[2])
        if f in('a5','a6'):return circle_r('r = %s'%(n[0]) if f=='a5' else 'd = %s'%n[0])
        if f=='c1':return circle_r('r = %s'%n[0])
        if f=='c2':return circ_svg('central',f'{n[0]}°')
        if f in('c3',):return circ_svg('inscribed','?')
        if f=='c4':return circ_svg('inscribed',f'{n[0]}°')
        if f=='c7':return circ_svg('tangent',f'{n[0]}',f'?')
        if f=='d1':return grid_svg([('A',n[0],n[1]),('B',n[2],n[3])])
        if f in('t1','t2','t4','t5'):return grid_svg([('P',n[0],n[1])])
        if f=='t3':return grid_svg([('P',n[0],n[1])],rng=12)
    except Exception as e:return None
def attach(Q):
    c=0
    for q in Q:
        if 'svg' in q:continue
        s=fig(q)
        if s:q['svg']=s;c+=1
    return c
