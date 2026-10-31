# -*- coding: utf-8 -*-
"""Shared helpers for the Apex (Algebra 2 to Calculus) and Quanta (EE + physics) packs."""
import sys,os,math,re
D=os.path.dirname(os.path.abspath(__file__))
sys.path[:0]=[D,os.path.join(D,'..','src_geo')]
import gen
from gen import R,fm
from fractions import Fraction as Fr
import auth
from auth import SA,MQ,MS,OR,MT,CL,SLD,CP,GR
def NM(t,tier,q,v,sol,u=None,tol=0.001,**k):
    fv=float(v);_t0=tol
    if fv!=0 and abs(fv*100-round(fv*100))>1e-6:tol=max(tol,0.006/abs(fv)+1e-4)
    if fv!=0 and abs(float(f'{fv:.3g}')-fv)>1e-9*abs(fv):tol=max(tol,0.006)
    if _t0==0:tol=0
    return auth.NM(t,tier,q,fv,sol,u=u,tol=tol,**k)
SUP=dict(zip('0123456789','⁰¹²³⁴⁵⁶⁷⁸⁹'))
def sup(n):
    return ''.join(SUP[c] for c in str(n)) if n>=0 else '⁻'+''.join(SUP[c] for c in str(-n))
def num(x):
    """pretty number: ints plain, Fractions a/b, floats trimmed"""
    if isinstance(x,Fr):return str(x.numerator) if x.denominator==1 else f"{x.numerator}/{x.denominator}"
    if isinstance(x,float):
        if abs(x-round(x))<1e-9:return str(int(round(x)))
        return f"{x:.4g}"
    return str(x)
def term(c,p,var='x',first=False):
    """one polynomial term"""
    if c==0:return ''
    a=abs(c);s='−' if c<0 else ('' if first else '+')
    body=('' if a==1 and p>0 else num(a))+(var+(sup(p) if p>1 else '') if p>0 else '')
    return (s+body) if first else f" {s} {body}"
def poly(cs,var='x'):
    """cs highest power first, e.g. [2,-3,5] -> 2x² − 3x + 5"""
    n=len(cs)-1;out='';first=True
    for i,c in enumerate(cs):
        t=term(c,n-i,var,first)
        if t:out+=t;first=False
    return out or '0'
def pv(cs,x):
    r=0
    for c in cs:r=r*x+c
    return r
def lin(m,b,var='x'):
    return poly([m,b],var)
def rint(a,b,nz=False):
    while True:
        v=R.randint(a,b)
        if not nz or v!=0:return v
def pick(l):return R.choice(l)
def paren(c):return f"({num(c)})" if c<0 else num(c)
def sgn(c):return f"+ {num(c)}" if c>=0 else f"− {num(-c)}"
def sci(x,sig=3):return float(f"{x:.{sig}g}")
# on-device-friendly tier shorthand
T_F,T_B,T_C,T_M='F','B','C','M'
